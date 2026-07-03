create or replace function public.confirm_supplier_step(
  p_consolidation_id uuid, p_step text, p_metadata jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = '' as $$
declare v_status text; v_supplier uuid;
begin
  select status, supplier_id into v_status, v_supplier
  from public.consolidations where id = p_consolidation_id for update;
  if not found then raise exception 'Consolidacao nao encontrada'; end if;
  if v_supplier <> (select auth.uid()) and not public.is_admin() then
    raise exception 'Usuario nao autorizado';
  end if;
  if not (
    (v_status = 'enviado' and p_step in ('confirmado', 'producao'))
    or (v_status = 'confirmado' and p_step = 'producao')
    or (v_status = 'producao' and p_step = 'saiu_entrega')
    or (v_status = 'saiu_entrega' and p_step = 'entregue')
  ) then raise exception 'Transicao de status invalida'; end if;

  insert into public.supplier_confirmations
    (consolidation_id, step, confirmed_by, metadata)
  values
    (p_consolidation_id, p_step, (select auth.uid()), coalesce(p_metadata, '{}'::jsonb))
  on conflict (consolidation_id, step) do nothing;
  update public.consolidations set status = p_step where id = p_consolidation_id;

  if p_step = 'entregue' then
    update public.meal_requests mr
    set status = 'entregue', updated_by = (select auth.uid())
    where exists (
      select 1 from public.consolidation_items ci
      where ci.consolidation_id = p_consolidation_id
        and ci.meal_request_id = mr.id
    );
  end if;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    (select auth.uid()), 'Fornecedor registrou etapa', 'consolidacao',
    p_consolidation_id, jsonb_build_object('step', p_step)
  );
end;
$$;
