begin;

create or replace function public.alimenta_obra_current_date()
returns date language sql stable set search_path = '' as $$
  select (now() at time zone 'America/Bahia')::date;
$$;

create table if not exists public.meal_categories (
  id text primary key check (id ~ '^[a-z0-9_]+$'),
  label text not null,
  can_record_actuals boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists meal_categories_set_updated_at on public.meal_categories;
create trigger meal_categories_set_updated_at before update on public.meal_categories
for each row execute function public.set_updated_at();

insert into public.meal_categories (id, label, can_record_actuals, active, sort_order)
values
  ('marmita', 'Marmita', false, true, 10),
  ('buffet', 'Buffet', true, true, 20),
  ('janta', 'Janta', true, true, 30),
  ('outro', 'Outro', false, true, 40)
on conflict (id) do update
set label = excluded.label,
    can_record_actuals = excluded.can_record_actuals,
    active = true,
    sort_order = excluded.sort_order;

alter table public.meal_types
  drop constraint if exists meal_types_category_check;

alter table public.meal_types
  alter column category set default 'outro';

update public.meal_types mt
set category = 'outro'
where not exists (
  select 1 from public.meal_categories mc where mc.id = mt.category
);

alter table public.meal_categories enable row level security;

drop policy if exists "permitted users read meal categories" on public.meal_categories;
create policy "permitted users read meal categories" on public.meal_categories for select to authenticated
using (public.current_user_role() in ('admin', 'encarregado', 'fornecedor'));

drop policy if exists "catalog managers manage meal categories" on public.meal_categories;
create policy "catalog managers manage meal categories" on public.meal_categories for all to authenticated
using (public.can_manage_meal_catalog()) with check (public.can_manage_meal_catalog());

create or replace function public.normalize_meal_category_id(p_value text)
returns text language sql immutable set search_path = '' as $$
  select trim(both '_' from regexp_replace(lower(trim(coalesce(p_value, ''))), '[^a-z0-9_]+', '_', 'g'));
$$;

create or replace function public.prevent_past_meal_request_date()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.meal_date < public.alimenta_obra_current_date() then
    raise exception 'Nao e permitido criar ou alterar pedido para data passada.';
  end if;
  return new;
end;
$$;

create or replace function public.upsert_meal_category(
  p_id text,
  p_label text,
  p_can_record_actuals boolean default false,
  p_active boolean default true
) returns text language plpgsql security definer set search_path = '' as $$
declare
  v_id text := public.normalize_meal_category_id(coalesce(p_id, p_label));
  v_sort_order integer;
begin
  if not public.can_manage_meal_catalog() then
    raise exception 'Usuario nao autorizado a gerenciar categorias de refeicao';
  end if;
  if length(v_id) < 2 then
    raise exception 'Informe um codigo valido para a categoria';
  end if;
  if length(trim(coalesce(p_label, ''))) < 2 then
    raise exception 'Informe o nome da categoria';
  end if;

  if exists (select 1 from public.meal_categories where id = v_id) then
    update public.meal_categories
    set label = trim(p_label),
        can_record_actuals = coalesce(p_can_record_actuals, false),
        active = coalesce(p_active, true)
    where id = v_id;
  else
    select coalesce(max(sort_order), 0) + 10 into v_sort_order from public.meal_categories;
    insert into public.meal_categories (id, label, can_record_actuals, active, sort_order)
    values (v_id, trim(p_label), coalesce(p_can_record_actuals, false), coalesce(p_active, true), v_sort_order);
  end if;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    auth.uid(),
    'Categoria de refeicao salva',
    'categoria_refeicao',
    null,
    jsonb_build_object('id', v_id, 'label', trim(p_label), 'can_record_actuals', coalesce(p_can_record_actuals, false), 'active', coalesce(p_active, true))
  );
  return v_id;
end;
$$;

create or replace function public.delete_meal_category(
  p_id text
) returns text language plpgsql security definer set search_path = '' as $$
declare
  v_id text := public.normalize_meal_category_id(p_id);
begin
  if not public.can_manage_meal_catalog() then
    raise exception 'Usuario nao autorizado a gerenciar categorias de refeicao';
  end if;
  if not exists (select 1 from public.meal_categories where id = v_id) then
    raise exception 'Categoria nao encontrada';
  end if;

  update public.meal_categories
  set active = false
  where id = v_id;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Categoria de refeicao removida', 'categoria_refeicao', null, jsonb_build_object('id', v_id));
  return v_id;
end;
$$;

create or replace function public.upsert_meal_type_catalog(
  p_id uuid,
  p_name text,
  p_description text,
  p_unit_price numeric default 0,
  p_active boolean default true,
  p_category text default 'outro'
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_sort_order integer;
  v_category text := public.normalize_meal_category_id(coalesce(nullif(p_category, ''), 'outro'));
begin
  if not public.can_manage_meal_catalog() then raise exception 'Usuario nao autorizado a gerenciar tipos de alimentacao'; end if;
  if length(trim(coalesce(p_name, ''))) < 2 then raise exception 'Informe o tipo de alimentacao'; end if;
  if not exists (select 1 from public.meal_categories where id = v_category and active) then raise exception 'Categoria invalida ou inativa'; end if;

  if p_id is null then
    select coalesce(max(sort_order), 0) + 10 into v_sort_order from public.meal_types;
    insert into public.meal_types (name, description, unit_price, active, category, sort_order)
    values (trim(p_name), trim(coalesce(p_description, '')), greatest(0, coalesce(p_unit_price, 0)), coalesce(p_active, true), v_category, v_sort_order)
    returning id into v_id;
  else
    update public.meal_types
    set name = trim(p_name),
        description = trim(coalesce(p_description, '')),
        unit_price = greatest(0, coalesce(p_unit_price, 0)),
        active = coalesce(p_active, true),
        category = v_category
    where id = p_id
    returning id into v_id;
  end if;
  if v_id is null then raise exception 'Tipo de alimentacao nao encontrado'; end if;

  insert into public.meal_locations (meal_type_id, name, active, sort_order)
  values (v_id, 'Operacional', true, 10)
  on conflict (meal_type_id, name) do update set active = true;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), case when p_id is null then 'Tipo de alimentacao criado' else 'Tipo de alimentacao atualizado' end,
    'tipo_alimentacao', v_id, jsonb_build_object('name', trim(p_name), 'category', v_category, 'active', coalesce(p_active, true)));
  return v_id;
end;
$$;

create or replace function public.create_meal_request_as_user(
  p_leader_id uuid,
  p_meal_date date,
  p_meal_type_id uuid,
  p_location_id uuid default null,
  p_team_id uuid default null,
  p_quantity integer default 1,
  p_status text default 'enviado',
  p_notes text default '',
  p_supplier_company_id uuid default null,
  p_origin_role text default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_actor_id uuid := (select auth.uid());
  v_actor_role text := public.current_user_role();
  v_location_id uuid := p_location_id;
  v_origin_role text := coalesce(p_origin_role, case when v_actor_role = 'admin' and p_leader_id is null then 'admin' else 'encarregado' end);
begin
  if v_actor_id is null then raise exception 'Sessao expirada. Entre novamente.'; end if;
  if p_status not in ('rascunho', 'enviado') then raise exception 'Status de pedido invalido'; end if;
  if p_quantity <= 0 then raise exception 'A quantidade deve ser maior que zero'; end if;
  if p_meal_date < public.alimenta_obra_current_date() then raise exception 'Nao e permitido criar pedido para data passada'; end if;
  if v_origin_role not in ('admin', 'encarregado') then raise exception 'Origem do pedido invalida'; end if;

  if v_origin_role = 'admin' then
    if v_actor_role <> 'admin' then raise exception 'Apenas administradores podem criar pedido administrativo'; end if;
  else
    if p_leader_id is null then raise exception 'Informe o encarregado do pedido'; end if;
    if not exists (select 1 from public.profiles where id = p_leader_id and role = 'encarregado' and active) then
      raise exception 'Encarregado invalido ou inativo';
    end if;
    if p_leader_id <> v_actor_id and v_actor_role <> 'admin' then raise exception 'Apenas administradores podem acessar outro usuario'; end if;
    if p_leader_id = v_actor_id and v_actor_role not in ('encarregado', 'admin') then raise exception 'Seu perfil nao pode criar pedidos'; end if;
  end if;

  if p_supplier_company_id is not null and not exists (
    select 1 from public.supplier_meal_types smt
    join public.supplier_companies sc on sc.id = smt.supplier_company_id
    where smt.supplier_company_id = p_supplier_company_id
      and smt.meal_type_id = p_meal_type_id
      and smt.active
      and sc.active
  ) then
    raise exception 'Fornecedor nao atende este tipo de refeicao';
  end if;

  if p_team_id is not null and not exists (
    select 1 from public.work_sections
    where id = p_team_id
      and active
      and (v_origin_role = 'admin' or leader_id is null or leader_id = p_leader_id)
  ) then
    raise exception 'Equipe ou trecho invalido para este pedido';
  end if;

  if p_team_id is not null and not exists (
    select 1
    from public.work_section_meal_types
    where work_section_id = p_team_id
      and meal_type_id = p_meal_type_id
      and active
  ) then
    raise exception 'Tipo de refeicao nao permitido para este efetivo/local';
  end if;

  if v_location_id is null then
    select ml.id into v_location_id
    from public.meal_locations ml
    where ml.meal_type_id = p_meal_type_id and ml.active
    order by ml.sort_order, ml.name
    limit 1;
  end if;
  if v_location_id is null then raise exception 'Tipo de alimentacao sem local tecnico cadastrado'; end if;

  insert into public.meal_requests (
    meal_date, meal_type_id, location_id, team_id, leader_id, quantity, status,
    notes, created_by, updated_by, supplier_company_id, origin_role
  ) values (
    p_meal_date, p_meal_type_id, v_location_id, p_team_id, p_leader_id, p_quantity,
    p_status, coalesce(p_notes, ''), v_actor_id, v_actor_id, p_supplier_company_id, v_origin_role
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.save_consolidation_actuals(
  p_consolidation_id uuid,
  p_actuals jsonb
) returns integer language plpgsql security definer set search_path = '' as $$
declare
  v_status text;
  v_date date;
  v_supplier uuid;
  v_supplier_company uuid;
  v_count integer := 0;
  v_item jsonb;
  v_team_id uuid;
  v_meal_type_id uuid;
  v_team_raw text;
  v_meal_type_raw text;
begin
  select status, meal_date, supplier_id, supplier_company_id into v_status, v_date, v_supplier, v_supplier_company
  from public.consolidations where id = p_consolidation_id for update;
  if not found then raise exception 'Bloco diario nao encontrado'; end if;
  if v_supplier <> auth.uid() and not public.can_access_supplier_company(v_supplier_company) and not public.is_admin() then
    raise exception 'Usuario nao autorizado';
  end if;
  if v_status not in ('confirmado', 'producao', 'saiu_entrega') then
    raise exception 'Confirme o recebimento antes de registrar consumo real';
  end if;

  for v_item in select * from jsonb_array_elements(coalesce(p_actuals, '[]'::jsonb))
  loop
    v_team_raw := nullif(v_item ->> 'team_id', '');
    v_meal_type_raw := nullif(v_item ->> 'meal_type_id', '');
    if v_team_raw is null
      or v_meal_type_raw is null
      or v_team_raw !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      or v_meal_type_raw !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    then
      continue;
    end if;

    v_team_id := v_team_raw::uuid;
    v_meal_type_id := v_meal_type_raw::uuid;
    if not exists (select 1 from public.work_sections where id = v_team_id)
      or not exists (
        select 1
        from public.meal_types mt
        join public.meal_categories mc on mc.id = mt.category
        where mt.id = v_meal_type_id
          and mc.can_record_actuals
      )
    then
      continue;
    end if;

    insert into public.consolidation_actuals (
      consolidation_id, meal_date, team_id, meal_type_id, quantity, recorded_by
    ) values (
      p_consolidation_id, v_date, v_team_id, v_meal_type_id,
      greatest(0, coalesce((v_item ->> 'quantity')::integer, 0)), auth.uid()
    )
    on conflict (consolidation_id, team_id, meal_type_id) do update
      set quantity = excluded.quantity,
          recorded_by = excluded.recorded_by,
          recorded_at = now();
    v_count := v_count + 1;
  end loop;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Consumo real registrado', 'consolidacao', p_consolidation_id,
    jsonb_build_object('rows', v_count, 'supplier_company_id', v_supplier_company));
  return v_count;
end;
$$;

revoke all on function public.normalize_meal_category_id(text) from public;
revoke all on function public.alimenta_obra_current_date() from public;
revoke all on function public.upsert_meal_category(text, text, boolean, boolean) from public;
revoke all on function public.delete_meal_category(text) from public;
revoke all on function public.upsert_meal_type_catalog(uuid, text, text, numeric, boolean, text) from public;
revoke all on function public.create_meal_request_as_user(uuid, date, uuid, uuid, uuid, integer, text, text, uuid, text) from public;
revoke all on function public.save_consolidation_actuals(uuid, jsonb) from public;

grant execute on function public.upsert_meal_category(text, text, boolean, boolean) to authenticated;
grant execute on function public.delete_meal_category(text) to authenticated;
grant execute on function public.alimenta_obra_current_date() to authenticated;
grant execute on function public.upsert_meal_type_catalog(uuid, text, text, numeric, boolean, text) to authenticated;
grant execute on function public.create_meal_request_as_user(uuid, date, uuid, uuid, uuid, integer, text, text, uuid, text) to authenticated;
grant execute on function public.save_consolidation_actuals(uuid, jsonb) to authenticated;
grant select on public.meal_categories to authenticated;
grant insert, update on public.meal_categories to authenticated;

do $$ begin alter publication supabase_realtime add table public.meal_categories; exception when duplicate_object then null; end $$;

commit;
