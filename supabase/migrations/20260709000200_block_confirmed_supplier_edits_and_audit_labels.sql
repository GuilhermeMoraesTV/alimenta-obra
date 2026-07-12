drop policy if exists "permitted users read revisions" on public.consolidation_revisions;
create policy "permitted users read revisions" on public.consolidation_revisions for select to authenticated
using (public.can_access_consolidation(consolidation_id));

alter table public.consolidations drop constraint if exists consolidations_meal_date_key;
create index if not exists consolidations_meal_date_idx on public.consolidations(meal_date);

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
      values (v_id, auth.uid(), 'Pedido alterado pelo Admin antes da confirmacao do fornecedor', coalesce(v_snapshot, '[]'::jsonb));
    end if;
  end if;

  delete from public.consolidation_items where consolidation_id = v_id;
  insert into public.consolidation_items (consolidation_id, meal_request_id)
  select v_id, mr.id
  from public.meal_requests mr
  where mr.meal_date = p_meal_date
    and mr.status = 'enviado'
    and not exists (
      select 1 from public.consolidation_items ci
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
