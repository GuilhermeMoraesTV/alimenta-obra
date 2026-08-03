begin;

create or replace function public.delete_meal_category(
  p_id text
) returns text language plpgsql security definer set search_path = '' as $$
declare
  v_id text := public.normalize_meal_category_id(p_id);
begin
  if not public.can_manage_meal_catalog() then
    raise exception 'Usuario nao autorizado a gerenciar categorias de refeicao';
  end if;
  if v_id = 'outro' then
    raise exception 'A categoria Outro e usada como padrao e nao pode ser excluida';
  end if;
  if not exists (select 1 from public.meal_categories where id = v_id) then
    raise exception 'Categoria nao encontrada';
  end if;

  update public.meal_types
  set category = 'outro'
  where category = v_id;

  delete from public.meal_categories
  where id = v_id;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Categoria de refeicao excluida', 'categoria_refeicao', null, jsonb_build_object('id', v_id));
  return v_id;
end;
$$;

create or replace function public.upsert_work_section_meal_type(
  p_work_section_id uuid,
  p_meal_type_id uuid,
  p_active boolean default true
) returns uuid language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem gerenciar vinculos por equipe';
  end if;
  if not exists (select 1 from public.work_sections where id = p_work_section_id) then
    raise exception 'Equipe nao encontrada';
  end if;
  if not exists (select 1 from public.meal_types where id = p_meal_type_id) then
    raise exception 'Refeicao nao encontrada';
  end if;

  insert into public.work_section_meal_types (work_section_id, meal_type_id, active)
  values (p_work_section_id, p_meal_type_id, coalesce(p_active, true))
  on conflict (work_section_id, meal_type_id)
  do update set active = excluded.active;

  return p_work_section_id;
end;
$$;

create or replace function public.delete_meal_type_catalog(
  p_id uuid
) returns uuid language plpgsql security definer set search_path = '' as $$
begin
  if not public.can_manage_meal_catalog() then
    raise exception 'Usuario nao autorizado a gerenciar tipos de alimentacao';
  end if;
  if not exists (select 1 from public.meal_types where id = p_id) then
    raise exception 'Refeicao nao encontrada';
  end if;
  if exists (select 1 from public.meal_requests where meal_type_id = p_id)
    or exists (select 1 from public.consolidation_actuals where meal_type_id = p_id) then
    raise exception 'Esta refeicao ja possui historico de pedidos ou consumo. Para preservar relatorios, desative em vez de excluir.';
  end if;

  delete from public.meal_types
  where id = p_id;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Tipo de alimentacao excluido', 'tipo_refeicao', p_id, jsonb_build_object('id', p_id));
  return p_id;
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

create or replace function public.delete_supplier_company(
  p_id uuid
) returns uuid language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem excluir fornecedores';
  end if;
  if not exists (select 1 from public.supplier_companies where id = p_id) then
    raise exception 'Fornecedor nao encontrado';
  end if;

  update public.meal_requests
  set supplier_company_id = null
  where supplier_company_id = p_id;

  update public.consolidations
  set supplier_company_id = null
  where supplier_company_id = p_id;

  delete from public.supplier_companies
  where id = p_id;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Fornecedor excluido', 'fornecedor', p_id, jsonb_build_object('id', p_id));
  return p_id;
end;
$$;

revoke all on function public.delete_meal_category(text) from public;
revoke all on function public.upsert_work_section_meal_type(uuid, uuid, boolean) from public;
revoke all on function public.delete_meal_type_catalog(uuid) from public;
revoke all on function public.delete_work_section(uuid) from public;
revoke all on function public.delete_supplier_company(uuid) from public;

grant execute on function public.delete_meal_category(text) to authenticated;
grant execute on function public.upsert_work_section_meal_type(uuid, uuid, boolean) to authenticated;
grant execute on function public.delete_meal_type_catalog(uuid) to authenticated;
grant execute on function public.delete_work_section(uuid) to authenticated;
grant execute on function public.delete_supplier_company(uuid) to authenticated;

commit;
