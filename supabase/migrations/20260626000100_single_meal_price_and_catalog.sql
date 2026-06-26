begin;

alter table public.app_settings
  add column if not exists default_meal_unit_price numeric(12, 2) not null default 18.50
    check (default_meal_unit_price >= 0);

alter table public.meal_types
  add column if not exists description text not null default '';

update public.app_settings
set default_meal_unit_price = coalesce(
  nullif((select unit_price from public.meal_types where name = 'Marmita Campo' limit 1), 0),
  default_meal_unit_price,
  18.50
)
where id = true;

update public.meal_types
set description = case name
  when 'Marmita Campo' then 'Marmita individual para entrega em campo.'
  when 'Buffer Almoco' then 'Refeicao servida em ponto de apoio ou restaurante.'
  when 'Jantar' then 'Refeicao noturna para equipes programadas.'
  else description
end
where description = '';

create or replace function public.can_manage_meal_catalog()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(public.current_user_role() in ('admin', 'fornecedor'), false);
$$;

drop policy if exists "suppliers manage meal types" on public.meal_types;
create policy "suppliers manage meal types" on public.meal_types for insert to authenticated
with check (public.can_manage_meal_catalog());
create policy "suppliers update meal types" on public.meal_types for update to authenticated
using (public.can_manage_meal_catalog()) with check (public.can_manage_meal_catalog());

drop policy if exists "suppliers manage meal locations" on public.meal_locations;
create policy "suppliers manage meal locations" on public.meal_locations for insert to authenticated
with check (public.can_manage_meal_catalog());
create policy "suppliers update meal locations" on public.meal_locations for update to authenticated
using (public.can_manage_meal_catalog()) with check (public.can_manage_meal_catalog());

create or replace function public.upsert_meal_type_catalog(
  p_id uuid,
  p_name text,
  p_description text,
  p_active boolean default true
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_sort_order integer;
begin
  if not public.can_manage_meal_catalog() then
    raise exception 'Usuario nao autorizado a gerenciar tipos de alimentacao';
  end if;

  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'Informe o tipo de alimentacao';
  end if;

  if p_id is null then
    select coalesce(max(sort_order), 0) + 10 into v_sort_order from public.meal_types;
    insert into public.meal_types (name, description, active, sort_order)
    values (trim(p_name), trim(coalesce(p_description, '')), coalesce(p_active, true), v_sort_order)
    returning id into v_id;
  else
    update public.meal_types
    set name = trim(p_name),
        description = trim(coalesce(p_description, '')),
        active = coalesce(p_active, true)
    where id = p_id
    returning id into v_id;

    if v_id is null then
      raise exception 'Tipo de alimentacao nao encontrado';
    end if;
  end if;

  insert into public.meal_locations (meal_type_id, name, active, sort_order)
  values (v_id, 'Campo', true, 10)
  on conflict (meal_type_id, name) do update
    set active = true;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    (select auth.uid()),
    case when p_id is null then 'Tipo de alimentacao criado' else 'Tipo de alimentacao atualizado' end,
    'tipo_alimentacao',
    v_id,
    jsonb_build_object('name', trim(p_name), 'active', coalesce(p_active, true))
  );

  return v_id;
end;
$$;

create or replace function public.update_default_meal_unit_price(
  p_unit_price numeric
) returns numeric language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem alterar o preco da refeicao';
  end if;

  if p_unit_price is null or p_unit_price < 0 then
    raise exception 'Informe um preco valido';
  end if;

  update public.app_settings
  set default_meal_unit_price = round(p_unit_price, 2),
      updated_by = (select auth.uid())
  where id = true;

  insert into public.audit_log (actor_id, action, entity, payload)
  values (
    (select auth.uid()),
    'Preco unico da refeicao atualizado',
    'configuracoes',
    jsonb_build_object('default_meal_unit_price', round(p_unit_price, 2))
  );

  return round(p_unit_price, 2);
end;
$$;

revoke all on function public.can_manage_meal_catalog() from public;
revoke all on function public.upsert_meal_type_catalog(uuid, text, text, boolean) from public;
revoke all on function public.update_default_meal_unit_price(numeric) from public;
grant execute on function public.can_manage_meal_catalog() to authenticated;
grant execute on function public.upsert_meal_type_catalog(uuid, text, text, boolean) to authenticated;
grant execute on function public.update_default_meal_unit_price(numeric) to authenticated;
grant insert (name, description, active, sort_order) on public.meal_types to authenticated;
grant update (name, description, active, sort_order) on public.meal_types to authenticated;
grant insert (meal_type_id, name, active, sort_order) on public.meal_locations to authenticated;
grant update (name, active, sort_order) on public.meal_locations to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.meal_types;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.app_settings;
exception when duplicate_object then null;
end $$;

commit;
