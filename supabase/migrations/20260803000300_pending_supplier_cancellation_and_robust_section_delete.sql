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
    'cancelamento_pendente',
    'cancelado_confirmado'
  ));

create or replace function public.delete_work_section(
  p_id uuid
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_fk record;
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem excluir efetivos';
  end if;
  if not exists (select 1 from public.work_sections where id = p_id) then
    raise exception 'Efetivo nao encontrado';
  end if;

  for v_fk in
    select
      format('%I.%I', ns.nspname, cls.relname) as table_name,
      att.attname as column_name,
      att.attnotnull as is_not_null
    from pg_constraint con
    join pg_class cls on cls.oid = con.conrelid
    join pg_namespace ns on ns.oid = cls.relnamespace
    join unnest(con.conkey) with ordinality key(attnum, ord) on true
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = key.attnum
    where con.contype = 'f'
      and con.confrelid = 'public.work_sections'::regclass
      and array_length(con.conkey, 1) = 1
  loop
    if v_fk.is_not_null then
      execute format('delete from %s where %I = $1', v_fk.table_name, v_fk.column_name) using p_id;
    else
      execute format('update %s set %I = null where %I = $1', v_fk.table_name, v_fk.column_name, v_fk.column_name) using p_id;
    end if;
  end loop;

  delete from public.work_sections
  where id = p_id;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Efetivo excluido', 'efetivo', p_id, jsonb_build_object('id', p_id));
  return p_id;
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

  if v_consolidation.status in ('cancelamento_pendente', 'cancelado_confirmado') then
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
  set status = 'cancelamento_pendente'
  where id = p_consolidation_id;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    auth.uid(),
    'Cancelamento de pedido enviado ao fornecedor',
    'consolidacao',
    p_consolidation_id,
    jsonb_build_object(
      'previous_status', v_consolidation.status,
      'status', 'cancelamento_pendente',
      'reason', v_reason,
      'actual_quantity', 0,
      'actual_rows', v_count,
      'supplier_company_id', v_consolidation.supplier_company_id
    )
  );

  return v_count;
end;
$$;

create or replace function public.confirm_supplier_step(
  p_consolidation_id uuid,
  p_step text,
  p_metadata jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = '' as $$
declare
  v_status text;
  v_supplier uuid;
  v_supplier_company uuid;
begin
  select status, supplier_id, supplier_company_id into v_status, v_supplier, v_supplier_company
  from public.consolidations where id = p_consolidation_id for update;
  if not found then raise exception 'Consolidacao nao encontrada'; end if;
  if v_supplier <> auth.uid() and not public.can_access_supplier_company(v_supplier_company) and not public.is_admin() then
    raise exception 'Usuario nao autorizado';
  end if;
  if not (
    (v_status = 'enviado' and p_step = 'confirmado')
    or (v_status = 'confirmado' and p_step in ('producao', 'saiu_entrega'))
    or (v_status = 'producao' and p_step = 'saiu_entrega')
    or (v_status = 'saiu_entrega' and p_step = 'entregue')
    or (v_status = 'cancelamento_pendente' and p_step = 'cancelado_confirmado')
  ) then raise exception 'Transicao de status invalida'; end if;

  insert into public.supplier_confirmations (consolidation_id, step, confirmed_by, metadata)
  values (p_consolidation_id, p_step, auth.uid(), coalesce(p_metadata, '{}'::jsonb))
  on conflict (consolidation_id, step) do nothing;

  update public.consolidations set status = p_step where id = p_consolidation_id;
  if p_step in ('saiu_entrega', 'entregue') then
    update public.meal_requests mr
    set status = 'entregue', updated_by = auth.uid()
    where exists (
      select 1 from public.consolidation_items ci
      where ci.consolidation_id = p_consolidation_id
        and ci.meal_request_id = mr.id
    );
  end if;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Fornecedor alterou status do pedido', 'consolidacao', p_consolidation_id,
    jsonb_build_object('previous_status', v_status, 'status', p_step, 'supplier_company_id', v_supplier_company));
end;
$$;

revoke all on function public.delete_work_section(uuid) from public;
revoke all on function public.cancel_confirmed_consolidation(uuid, text) from public;
revoke all on function public.confirm_supplier_step(uuid, text, jsonb) from public;

grant execute on function public.delete_work_section(uuid) to authenticated;
grant execute on function public.cancel_confirmed_consolidation(uuid, text) to authenticated;
grant execute on function public.confirm_supplier_step(uuid, text, jsonb) to authenticated;

commit;
