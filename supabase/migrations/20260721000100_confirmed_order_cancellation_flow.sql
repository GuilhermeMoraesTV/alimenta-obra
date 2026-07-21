begin;

alter table public.consolidations
  drop constraint if exists consolidations_status_check;

alter table public.consolidations
  add constraint consolidations_status_check
  check (status in (
    'rascunho',
    'enviado',
    'confirmado',
    'producao',
    'saiu_entrega',
    'entregue',
    'cancelado_confirmado'
  ));

create or replace function public.prevent_confirmed_request_content_edit()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_content_changed boolean;
begin
  v_content_changed :=
    old.meal_date is distinct from new.meal_date
    or old.meal_type_id is distinct from new.meal_type_id
    or old.location_id is distinct from new.location_id
    or old.team_id is distinct from new.team_id
    or old.quantity is distinct from new.quantity
    or old.notes is distinct from new.notes
    or old.delivery_address_id is distinct from new.delivery_address_id;

  if not v_content_changed then
    return new;
  end if;

  if exists (
    select 1
    from public.consolidation_items ci
    join public.consolidations c on c.id = ci.consolidation_id
    where ci.meal_request_id = old.id
      and (
        c.status in ('confirmado', 'producao', 'saiu_entrega', 'entregue', 'cancelado_confirmado')
        or exists (
          select 1
          from public.supplier_confirmations sc
          where sc.consolidation_id = c.id
            and sc.step = 'confirmado'
        )
      )
  ) then
    raise exception 'Edicao bloqueada: fornecedor ja confirmou o recebimento deste bloco';
  end if;

  return new;
end;
$$;

create or replace function public.change_request_status(
  p_request_id uuid,
  p_status text
) returns void language plpgsql security definer set search_path = '' as $$
declare
  v_request public.meal_requests;
  v_cutoff time;
  v_limit timestamptz;
begin
  if p_status not in ('rascunho', 'cancelado') then
    raise exception 'Status nao permitido';
  end if;

  select * into v_request
  from public.meal_requests
  where id = p_request_id
  for update;

  if not found then raise exception 'Pedido nao encontrado'; end if;

  if v_request.leader_id is distinct from auth.uid() and not public.is_admin() then
    raise exception 'Usuario nao autorizado';
  end if;

  if v_request.status in ('cancelado', 'entregue') then
    raise exception 'Pedido bloqueado';
  end if;

  if exists (
    select 1
    from public.consolidation_items ci
    join public.consolidations c on c.id = ci.consolidation_id
    where ci.meal_request_id = p_request_id
      and (
        c.status in ('confirmado', 'producao', 'saiu_entrega', 'entregue', 'cancelado_confirmado')
        or exists (
          select 1
          from public.supplier_confirmations sc
          where sc.consolidation_id = c.id
            and sc.step = 'confirmado'
        )
      )
  ) then
    raise exception 'Cancelamento bloqueado: fornecedor ja confirmou este pedido';
  end if;

  select cutoff_time into v_cutoff from public.app_settings where id = true;
  v_limit := ((v_request.meal_date - 1) + v_cutoff) at time zone 'America/Bahia';
  if now() > v_limit and not public.is_admin() then
    raise exception 'O horario limite foi encerrado';
  end if;

  update public.meal_requests
  set status = p_status,
      updated_by = auth.uid()
  where id = p_request_id;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    auth.uid(),
    case when p_status = 'cancelado' then 'Pedido cancelado' else 'Pedido liberado para edicao' end,
    'pedido',
    p_request_id,
    jsonb_build_object('status', p_status)
  );
end;
$$;

create or replace function public.create_or_refresh_consolidation(
  p_meal_date date,
  p_supplier_company_id uuid,
  p_supplier_user_id uuid default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_supplier_user uuid := p_supplier_user_id;
begin
  if not public.is_admin() then raise exception 'Apenas administradores podem consolidar pedidos'; end if;
  if not exists (select 1 from public.supplier_companies where id = p_supplier_company_id and active) then
    raise exception 'Fornecedor invalido ou inativo';
  end if;
  if v_supplier_user is null then
    select user_id into v_supplier_user
    from public.supplier_company_users
    where supplier_company_id = p_supplier_company_id and active
    order by created_at
    limit 1;
  end if;
  if v_supplier_user is null then
    select legacy_profile_id into v_supplier_user from public.supplier_companies where id = p_supplier_company_id;
  end if;
  if v_supplier_user is null then raise exception 'Fornecedor sem usuario de acesso vinculado'; end if;

  select c.id into v_id
  from public.consolidations c
  where c.meal_date = p_meal_date
    and c.supplier_company_id = p_supplier_company_id
    and c.status in ('rascunho', 'enviado')
  order by c.created_at desc
  limit 1
  for update;

  if v_id is null then
    insert into public.consolidations (meal_date, supplier_id, supplier_company_id, status, created_by)
    values (p_meal_date, v_supplier_user, p_supplier_company_id, 'rascunho', auth.uid())
    returning id into v_id;
  else
    update public.consolidations
    set supplier_id = v_supplier_user,
        supplier_company_id = p_supplier_company_id
    where id = v_id;
  end if;

  delete from public.consolidation_items where consolidation_id = v_id;
  insert into public.consolidation_items (consolidation_id, meal_request_id)
  select v_id, mr.id
  from public.meal_requests mr
  where mr.meal_date = p_meal_date
    and mr.status = 'enviado'
    and (mr.supplier_company_id is null or mr.supplier_company_id = p_supplier_company_id)
    and not exists (
      select 1
      from public.consolidation_items ci
      join public.consolidations c2 on c2.id = ci.consolidation_id
      where ci.meal_request_id = mr.id
        and c2.id <> v_id
        and (
          c2.status in ('confirmado', 'producao', 'saiu_entrega', 'entregue', 'cancelado_confirmado')
          or exists (select 1 from public.supplier_confirmations sc where sc.consolidation_id = c2.id and sc.step = 'confirmado')
        )
    );

  update public.meal_requests
  set supplier_company_id = p_supplier_company_id,
      updated_by = auth.uid()
  where id in (select meal_request_id from public.consolidation_items where consolidation_id = v_id)
    and supplier_company_id is null;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Bloco diario criado ou atualizado', 'consolidacao', v_id,
    jsonb_build_object('meal_date', p_meal_date, 'supplier_company_id', p_supplier_company_id));
  return v_id;
end;
$$;

create or replace function public.cancel_confirmed_consolidation(
  p_consolidation_id uuid,
  p_reason text
) returns integer language plpgsql security definer set search_path = '' as $$
declare
  v_consolidation public.consolidations;
  v_reason text := trim(coalesce(p_reason, ''));
  v_count integer := 0;
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem cancelar pedido confirmado';
  end if;

  if char_length(v_reason) < 5 then
    raise exception 'Informe o motivo do cancelamento';
  end if;

  select * into v_consolidation
  from public.consolidations
  where id = p_consolidation_id
  for update;

  if not found then
    raise exception 'Bloco diario nao encontrado';
  end if;

  if v_consolidation.status = 'cancelado_confirmado' then
    return 0;
  end if;

  if v_consolidation.status not in ('confirmado', 'producao', 'saiu_entrega') then
    raise exception 'Cancelamento pos-confirmacao permitido somente depois da confirmacao e antes da entrega final';
  end if;

  insert into public.consolidation_actuals (
    consolidation_id,
    meal_date,
    team_id,
    meal_type_id,
    quantity,
    notes,
    recorded_by
  )
  select
    p_consolidation_id,
    v_consolidation.meal_date,
    mr.team_id,
    mr.meal_type_id,
    0,
    v_reason,
    auth.uid()
  from public.consolidation_items ci
  join public.meal_requests mr on mr.id = ci.meal_request_id
  where ci.consolidation_id = p_consolidation_id
    and mr.status <> 'cancelado'
    and mr.team_id is not null
    and mr.meal_type_id is not null
  group by mr.team_id, mr.meal_type_id
  on conflict (consolidation_id, team_id, meal_type_id) do update
    set quantity = 0,
        notes = excluded.notes,
        recorded_by = excluded.recorded_by,
        recorded_at = now();

  get diagnostics v_count = row_count;

  update public.consolidations
  set status = 'cancelado_confirmado'
  where id = p_consolidation_id;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    auth.uid(),
    'Pedido cancelado apos confirmacao',
    'consolidacao',
    p_consolidation_id,
    jsonb_build_object(
      'previous_status', v_consolidation.status,
      'status', 'cancelado_confirmado',
      'reason', v_reason,
      'actual_quantity', 0,
      'actual_rows', v_count,
      'supplier_company_id', v_consolidation.supplier_company_id
    )
  );

  return v_count;
end;
$$;

revoke all on function public.cancel_confirmed_consolidation(uuid, text) from public;
grant execute on function public.cancel_confirmed_consolidation(uuid, text) to authenticated;

commit;
