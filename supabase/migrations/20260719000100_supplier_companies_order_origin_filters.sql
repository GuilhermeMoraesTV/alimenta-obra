begin;

create table if not exists public.supplier_companies (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null check (char_length(trim(legal_name)) between 2 and 180),
  trade_name text not null default '',
  cnpj text not null default '',
  state_registration text not null default '',
  municipal_registration text not null default '',
  address_line text not null default '',
  city text not null default '',
  state text not null default '',
  zip_code text not null default '',
  phone text not null default '',
  email text not null default '',
  contact_name text not null default '',
  bank_details text not null default '',
  notes text not null default '',
  active boolean not null default true,
  legacy_profile_id uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists supplier_companies_legacy_profile_key
  on public.supplier_companies(legacy_profile_id)
  where legacy_profile_id is not null;
create index if not exists supplier_companies_active_idx on public.supplier_companies(active, legal_name);

create table if not exists public.supplier_company_users (
  supplier_company_id uuid not null references public.supplier_companies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (supplier_company_id, user_id)
);

alter table public.meal_types
  add column if not exists category text not null default 'outro'
    check (category in ('marmita', 'buffet', 'janta', 'outro'));

update public.meal_types
set category = case
  when lower(name) like '%marmita%' then 'marmita'
  when lower(name) like '%buffet%' or lower(name) like '%buffer%' or lower(name) like '%almoco%' or lower(name) like '%almoço%' then 'buffet'
  when lower(name) like '%janta%' or lower(name) like '%jantar%' then 'janta'
  else category
end
where category = 'outro';

create table if not exists public.supplier_meal_types (
  supplier_company_id uuid not null references public.supplier_companies(id) on delete cascade,
  meal_type_id uuid not null references public.meal_types(id) on delete cascade,
  active boolean not null default true,
  unit_price numeric(12, 2) check (unit_price is null or unit_price >= 0),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (supplier_company_id, meal_type_id)
);

alter table public.work_sections
  add column if not exists area_type text not null default 'campo'
    check (area_type in ('campo', 'canteiro', 'escritorio', 'misto'));

create table if not exists public.work_section_meal_types (
  work_section_id uuid not null references public.work_sections(id) on delete cascade,
  meal_type_id uuid not null references public.meal_types(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (work_section_id, meal_type_id)
);

alter table public.meal_requests
  alter column leader_id drop not null,
  add column if not exists origin_role text not null default 'encarregado'
    check (origin_role in ('admin', 'encarregado')),
  add column if not exists supplier_company_id uuid references public.supplier_companies(id);

alter table public.consolidations
  add column if not exists supplier_company_id uuid references public.supplier_companies(id);

drop trigger if exists supplier_companies_set_updated_at on public.supplier_companies;
create trigger supplier_companies_set_updated_at before update on public.supplier_companies
for each row execute function public.set_updated_at();

drop trigger if exists supplier_meal_types_set_updated_at on public.supplier_meal_types;
create trigger supplier_meal_types_set_updated_at before update on public.supplier_meal_types
for each row execute function public.set_updated_at();

insert into public.supplier_companies (legal_name, trade_name, cnpj, email, active, legacy_profile_id, created_by)
select
  p.name,
  coalesce(nullif(trim(p.team), ''), p.name),
  '',
  p.email,
  p.active,
  p.id,
  p.id
from public.profiles p
where p.role = 'fornecedor'
on conflict do nothing;

insert into public.supplier_company_users (supplier_company_id, user_id, active)
select sc.id, sc.legacy_profile_id, true
from public.supplier_companies sc
where sc.legacy_profile_id is not null
on conflict (supplier_company_id, user_id) do update set active = excluded.active;

insert into public.supplier_meal_types (supplier_company_id, meal_type_id, active, unit_price)
select sc.id, mt.id, mt.active, nullif(mt.unit_price, 0)
from public.supplier_companies sc
cross join public.meal_types mt
on conflict do nothing;

update public.consolidations c
set supplier_company_id = sc.id
from public.supplier_companies sc
where c.supplier_company_id is null
  and sc.legacy_profile_id = c.supplier_id;

update public.meal_requests mr
set origin_role = case when mr.leader_id is null then 'admin' else 'encarregado' end
where mr.origin_role is null or mr.origin_role = 'encarregado';

update public.meal_requests mr
set supplier_company_id = c.supplier_company_id
from public.consolidation_items ci
join public.consolidations c on c.id = ci.consolidation_id
where mr.id = ci.meal_request_id
  and mr.supplier_company_id is null
  and c.supplier_company_id is not null;

alter table public.supplier_companies enable row level security;
alter table public.supplier_company_users enable row level security;
alter table public.supplier_meal_types enable row level security;
alter table public.work_section_meal_types enable row level security;

create or replace function public.can_access_supplier_company(p_company_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(
    public.is_admin()
    or exists (
      select 1
      from public.supplier_company_users scu
      where scu.supplier_company_id = p_company_id
        and scu.user_id = (select auth.uid())
        and scu.active
    ), false
  );
$$;

create or replace function public.can_access_consolidation(p_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(
    public.is_admin()
    or exists (
      select 1 from public.consolidations
      where id = p_id
        and (
          supplier_id = (select auth.uid())
          or public.can_access_supplier_company(supplier_company_id)
        )
    ), false
  );
$$;

drop policy if exists "permitted users read supplier companies" on public.supplier_companies;
create policy "permitted users read supplier companies" on public.supplier_companies for select to authenticated
using (active or public.can_access_supplier_company(id));

drop policy if exists "admins manage supplier companies" on public.supplier_companies;
create policy "admins manage supplier companies" on public.supplier_companies for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "permitted users read supplier links" on public.supplier_company_users;
create policy "permitted users read supplier links" on public.supplier_company_users for select to authenticated
using (public.is_admin() or user_id = (select auth.uid()));

drop policy if exists "admins manage supplier links" on public.supplier_company_users;
create policy "admins manage supplier links" on public.supplier_company_users for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "permitted users read supplier meals" on public.supplier_meal_types;
create policy "permitted users read supplier meals" on public.supplier_meal_types for select to authenticated
using (public.can_access_supplier_company(supplier_company_id) or exists (
  select 1 from public.supplier_companies sc
  where sc.id = supplier_company_id and sc.active
));

drop policy if exists "admins manage supplier meals" on public.supplier_meal_types;
create policy "admins manage supplier meals" on public.supplier_meal_types for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "permitted users read section meals" on public.work_section_meal_types;
create policy "permitted users read section meals" on public.work_section_meal_types for select to authenticated
using (true);

drop policy if exists "admins manage section meals" on public.work_section_meal_types;
create policy "admins manage section meals" on public.work_section_meal_types for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create or replace function public.upsert_supplier_company(
  p_id uuid,
  p_legal_name text,
  p_trade_name text default '',
  p_cnpj text default '',
  p_state_registration text default '',
  p_municipal_registration text default '',
  p_address_line text default '',
  p_city text default '',
  p_state text default '',
  p_zip_code text default '',
  p_phone text default '',
  p_email text default '',
  p_contact_name text default '',
  p_bank_details text default '',
  p_notes text default '',
  p_active boolean default true
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  if not public.is_admin() then raise exception 'Apenas administradores podem gerenciar fornecedores'; end if;
  if length(trim(coalesce(p_legal_name, ''))) < 2 then raise exception 'Informe a razao social do fornecedor'; end if;

  if p_id is null then
    insert into public.supplier_companies (
      legal_name, trade_name, cnpj, state_registration, municipal_registration,
      address_line, city, state, zip_code, phone, email, contact_name, bank_details,
      notes, active, created_by
    ) values (
      trim(p_legal_name), trim(coalesce(p_trade_name, '')), trim(coalesce(p_cnpj, '')),
      trim(coalesce(p_state_registration, '')), trim(coalesce(p_municipal_registration, '')),
      trim(coalesce(p_address_line, '')), trim(coalesce(p_city, '')), upper(trim(coalesce(p_state, ''))),
      trim(coalesce(p_zip_code, '')), trim(coalesce(p_phone, '')), lower(trim(coalesce(p_email, ''))),
      trim(coalesce(p_contact_name, '')), trim(coalesce(p_bank_details, '')),
      trim(coalesce(p_notes, '')), coalesce(p_active, true), auth.uid()
    )
    returning id into v_id;
  else
    update public.supplier_companies
    set legal_name = trim(p_legal_name),
        trade_name = trim(coalesce(p_trade_name, '')),
        cnpj = trim(coalesce(p_cnpj, '')),
        state_registration = trim(coalesce(p_state_registration, '')),
        municipal_registration = trim(coalesce(p_municipal_registration, '')),
        address_line = trim(coalesce(p_address_line, '')),
        city = trim(coalesce(p_city, '')),
        state = upper(trim(coalesce(p_state, ''))),
        zip_code = trim(coalesce(p_zip_code, '')),
        phone = trim(coalesce(p_phone, '')),
        email = lower(trim(coalesce(p_email, ''))),
        contact_name = trim(coalesce(p_contact_name, '')),
        bank_details = trim(coalesce(p_bank_details, '')),
        notes = trim(coalesce(p_notes, '')),
        active = coalesce(p_active, true)
    where id = p_id
    returning id into v_id;
  end if;
  if v_id is null then raise exception 'Fornecedor nao encontrado'; end if;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), case when p_id is null then 'Fornecedor criado' else 'Fornecedor atualizado' end,
    'fornecedor', v_id, jsonb_build_object('legal_name', trim(p_legal_name), 'active', coalesce(p_active, true)));

  return v_id;
end;
$$;

create or replace function public.upsert_supplier_meal_type(
  p_supplier_company_id uuid,
  p_meal_type_id uuid,
  p_active boolean default true,
  p_unit_price numeric default null,
  p_notes text default ''
) returns uuid language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Apenas administradores podem vincular refeicoes ao fornecedor'; end if;
  insert into public.supplier_meal_types (supplier_company_id, meal_type_id, active, unit_price, notes)
  values (p_supplier_company_id, p_meal_type_id, coalesce(p_active, true), p_unit_price, trim(coalesce(p_notes, '')))
  on conflict (supplier_company_id, meal_type_id) do update
    set active = excluded.active,
        unit_price = excluded.unit_price,
        notes = excluded.notes,
        updated_at = now();
  return p_supplier_company_id;
end;
$$;

create or replace function public.upsert_supplier_company_user(
  p_supplier_company_id uuid,
  p_user_id uuid,
  p_active boolean default true
) returns uuid language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Apenas administradores podem vincular usuarios ao fornecedor'; end if;
  insert into public.supplier_company_users (supplier_company_id, user_id, active)
  values (p_supplier_company_id, p_user_id, coalesce(p_active, true))
  on conflict (supplier_company_id, user_id) do update set active = excluded.active;
  update public.profiles set role = 'fornecedor', active = true where id = p_user_id;
  return p_supplier_company_id;
end;
$$;

create or replace function public.upsert_work_section(
  p_id uuid,
  p_name text,
  p_headcount integer default 0,
  p_leader_id uuid default null,
  p_active boolean default true,
  p_area_type text default 'campo',
  p_meal_type_ids uuid[] default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  if not public.is_admin() then raise exception 'Apenas administradores podem gerenciar equipes'; end if;
  if p_area_type not in ('campo', 'canteiro', 'escritorio', 'misto') then raise exception 'Tipo de area invalido'; end if;
  if p_id is null then
    insert into public.work_sections (name, headcount, leader_id, active, area_type)
    values (trim(p_name), greatest(0, coalesce(p_headcount, 0)), p_leader_id, coalesce(p_active, true), p_area_type)
    returning id into v_id;
  else
    update public.work_sections
    set name = trim(p_name),
        headcount = greatest(0, coalesce(p_headcount, 0)),
        leader_id = p_leader_id,
        active = coalesce(p_active, true),
        area_type = p_area_type,
        updated_at = now()
    where id = p_id
    returning id into v_id;
  end if;
  if v_id is null then raise exception 'Equipe nao encontrada'; end if;

  if p_meal_type_ids is not null then
    delete from public.work_section_meal_types where work_section_id = v_id;
    insert into public.work_section_meal_types (work_section_id, meal_type_id, active)
    select v_id, unnest(p_meal_type_ids), true;
  end if;
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
begin
  if not public.can_manage_meal_catalog() then raise exception 'Usuario nao autorizado a gerenciar tipos de alimentacao'; end if;
  if length(trim(coalesce(p_name, ''))) < 2 then raise exception 'Informe o tipo de alimentacao'; end if;
  if p_category not in ('marmita', 'buffet', 'janta', 'outro') then raise exception 'Categoria invalida'; end if;

  if p_id is null then
    select coalesce(max(sort_order), 0) + 10 into v_sort_order from public.meal_types;
    insert into public.meal_types (name, description, unit_price, active, category, sort_order)
    values (trim(p_name), trim(coalesce(p_description, '')), greatest(0, coalesce(p_unit_price, 0)), coalesce(p_active, true), p_category, v_sort_order)
    returning id into v_id;
  else
    update public.meal_types
    set name = trim(p_name),
        description = trim(coalesce(p_description, '')),
        unit_price = greatest(0, coalesce(p_unit_price, 0)),
        active = coalesce(p_active, true),
        category = p_category
    where id = p_id
    returning id into v_id;
  end if;
  if v_id is null then raise exception 'Tipo de alimentacao nao encontrado'; end if;

  insert into public.meal_locations (meal_type_id, name, active, sort_order)
  values (v_id, 'Operacional', true, 10)
  on conflict (meal_type_id, name) do update set active = true;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), case when p_id is null then 'Tipo de alimentacao criado' else 'Tipo de alimentacao atualizado' end,
    'tipo_alimentacao', v_id, jsonb_build_object('name', trim(p_name), 'category', p_category, 'active', coalesce(p_active, true)));
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
  if p_meal_date < current_date then raise exception 'Nao e permitido criar pedido para data passada'; end if;
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

  if p_team_id is not null and exists (select 1 from public.work_section_meal_types where work_section_id = p_team_id and active)
    and not exists (select 1 from public.work_section_meal_types where work_section_id = p_team_id and meal_type_id = p_meal_type_id and active) then
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
          c2.status in ('confirmado', 'producao', 'saiu_entrega', 'entregue')
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

create or replace function public.send_consolidation(
  p_meal_date date,
  p_supplier_company_id uuid,
  p_supplier_user_id uuid default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  v_id := public.create_or_refresh_consolidation(p_meal_date, p_supplier_company_id, p_supplier_user_id);
  if not exists (select 1 from public.consolidation_items where consolidation_id = v_id) then
    raise exception 'Nao ha pedidos enviados para consolidar';
  end if;
  update public.consolidations set status = 'enviado', sent_at = now() where id = v_id;
  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Bloco diario enviado ou atualizado ao fornecedor', 'consolidacao', v_id,
    jsonb_build_object('supplier_company_id', p_supplier_company_id));
  return v_id;
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
      or not exists (select 1 from public.meal_types where id = v_meal_type_id)
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

revoke all on function public.can_access_supplier_company(uuid) from public;
revoke all on function public.upsert_supplier_company(uuid, text, text, text, text, text, text, text, text, text, text, text, text, text, text, boolean) from public;
revoke all on function public.upsert_supplier_meal_type(uuid, uuid, boolean, numeric, text) from public;
revoke all on function public.upsert_supplier_company_user(uuid, uuid, boolean) from public;
revoke all on function public.create_meal_request_as_user(uuid, date, uuid, uuid, uuid, integer, text, text, uuid, text) from public;
revoke all on function public.create_or_refresh_consolidation(date, uuid, uuid) from public;
revoke all on function public.send_consolidation(date, uuid, uuid) from public;

grant execute on function public.can_access_supplier_company(uuid) to authenticated;
grant execute on function public.upsert_supplier_company(uuid, text, text, text, text, text, text, text, text, text, text, text, text, text, text, boolean) to authenticated;
grant execute on function public.upsert_supplier_meal_type(uuid, uuid, boolean, numeric, text) to authenticated;
grant execute on function public.upsert_supplier_company_user(uuid, uuid, boolean) to authenticated;
grant execute on function public.upsert_work_section(uuid, text, integer, uuid, boolean, text, uuid[]) to authenticated;
grant execute on function public.upsert_meal_type_catalog(uuid, text, text, numeric, boolean, text) to authenticated;
grant execute on function public.create_meal_request_as_user(uuid, date, uuid, uuid, uuid, integer, text, text, uuid, text) to authenticated;
grant execute on function public.create_or_refresh_consolidation(date, uuid, uuid) to authenticated;
grant execute on function public.send_consolidation(date, uuid, uuid) to authenticated;
grant execute on function public.confirm_supplier_step(uuid, text, jsonb) to authenticated;
grant execute on function public.save_consolidation_actuals(uuid, jsonb) to authenticated;

do $$ begin alter publication supabase_realtime add table public.supplier_companies; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.supplier_company_users; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.supplier_meal_types; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.work_section_meal_types; exception when duplicate_object then null; end $$;

commit;
