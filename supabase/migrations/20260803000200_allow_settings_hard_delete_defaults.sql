begin;

create or replace function public.delete_meal_category(
  p_id text
) returns text language plpgsql security definer set search_path = '' as $$
declare
  v_id text := public.normalize_meal_category_id(p_id);
  v_fallback_id text;
begin
  if not public.can_manage_meal_catalog() then
    raise exception 'Usuario nao autorizado a gerenciar categorias de refeicao';
  end if;
  if not exists (select 1 from public.meal_categories where id = v_id) then
    raise exception 'Categoria nao encontrada';
  end if;

  select id into v_fallback_id
  from public.meal_categories
  where id <> v_id
  order by case when id = 'outro' then 0 else 1 end, sort_order, label
  limit 1;

  update public.meal_types
  set category = coalesce(v_fallback_id, category)
  where category = v_id;

  delete from public.meal_categories
  where id = v_id;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    auth.uid(),
    'Categoria de refeicao excluida',
    'categoria_refeicao',
    null,
    jsonb_build_object('id', v_id, 'fallback_id', v_fallback_id)
  );
  return v_id;
end;
$$;

create or replace function public.delete_work_section(
  p_id uuid
) returns uuid language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem excluir efetivos';
  end if;
  if not exists (select 1 from public.work_sections where id = p_id) then
    raise exception 'Efetivo nao encontrado';
  end if;

  delete from public.work_section_meal_types
  where work_section_id = p_id;

  update public.meal_requests
  set team_id = null
  where team_id = p_id;

  delete from public.consolidation_actuals
  where team_id = p_id;

  delete from public.work_sections
  where id = p_id;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Efetivo excluido', 'efetivo', p_id, jsonb_build_object('id', p_id));
  return p_id;
end;
$$;

revoke all on function public.delete_meal_category(text) from public;
revoke all on function public.delete_work_section(uuid) from public;

grant execute on function public.delete_meal_category(text) to authenticated;
grant execute on function public.delete_work_section(uuid) to authenticated;

commit;
