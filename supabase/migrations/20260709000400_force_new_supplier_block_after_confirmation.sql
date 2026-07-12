create or replace function public.create_or_refresh_consolidation(
  p_meal_date date,
  p_supplier_id uuid
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_previous_status text;
  v_snapshot jsonb;
begin
  if not public.is_admin() then raise exception 'Apenas administradores podem consolidar pedidos'; end if;
  if not exists (select 1 from public.profiles where id = p_supplier_id and role = 'fornecedor' and active) then
    raise exception 'Fornecedor invalido ou inativo';
  end if;

  select id, status into v_id, v_previous_status
  from public.consolidations
  where meal_date = p_meal_date
    and status in ('rascunho', 'enviado')
  order by created_at desc
  limit 1
  for update;

  if v_id is null then
    insert into public.consolidations (meal_date, supplier_id, status, created_by)
    values (p_meal_date, p_supplier_id, 'rascunho', auth.uid())
    returning id, status into v_id, v_previous_status;
  else
    select jsonb_agg(jsonb_build_object('meal_request_id', meal_request_id))
    into v_snapshot
    from public.consolidation_items
    where consolidation_id = v_id;

    update public.consolidations
    set supplier_id = p_supplier_id,
        updated_at = now()
    where id = v_id;

    if v_previous_status <> 'rascunho' then
      insert into public.consolidation_revisions (consolidation_id, edited_by, reason, snapshot)
      values (v_id, auth.uid(), 'Pedido extra alterado pelo Admin antes da confirmacao do fornecedor', coalesce(v_snapshot, '[]'::jsonb));
    end if;
  end if;

  delete from public.consolidation_items where consolidation_id = v_id;

  delete from public.consolidation_items ci
  using public.consolidations c, public.meal_requests mr
  where ci.consolidation_id = c.id
    and ci.meal_request_id = mr.id
    and c.id <> v_id
    and c.meal_date = p_meal_date
    and c.status in ('confirmado', 'producao', 'saiu_entrega', 'entregue')
    and mr.status = 'enviado'
    and greatest(coalesce(mr.updated_at, mr.created_at), mr.created_at) > coalesce(
      (
        select min(sc.confirmed_at)
        from public.supplier_confirmations sc
        where sc.consolidation_id = c.id
          and sc.step = 'confirmado'
      ),
      c.updated_at,
      c.sent_at,
      c.created_at
    );

  insert into public.consolidation_items (consolidation_id, meal_request_id)
  select v_id, mr.id
  from public.meal_requests mr
  where mr.meal_date = p_meal_date
    and mr.status = 'enviado'
    and not exists (
      select 1
      from public.consolidation_items ci
      join public.consolidations c on c.id = ci.consolidation_id
      where ci.meal_request_id = mr.id
        and c.id <> v_id
    );

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Bloco diario criado ou atualizado',
    'consolidacao', v_id, jsonb_build_object('meal_date', p_meal_date, 'previous_status', v_previous_status));

  return v_id;
end;
$$;

create or replace function public.send_consolidation(
  p_meal_date date,
  p_supplier_id uuid
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  v_id := public.create_or_refresh_consolidation(p_meal_date, p_supplier_id);

  if not exists (select 1 from public.consolidation_items where consolidation_id = v_id) then
    raise exception 'Nao ha pedidos enviados para consolidar';
  end if;

  update public.consolidations
  set status = case when status = 'rascunho' then 'enviado' else status end,
      sent_at = coalesce(sent_at, now()),
      updated_at = now()
  where id = v_id;

  insert into public.audit_log (actor_id, action, entity, entity_id)
  values (auth.uid(), 'Bloco diario enviado ou atualizado ao fornecedor', 'consolidacao', v_id);

  return v_id;
end;
$$;
