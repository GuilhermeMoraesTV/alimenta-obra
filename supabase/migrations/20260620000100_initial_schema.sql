begin;

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'encarregado'
    check (role in ('encarregado', 'admin', 'fornecedor')),
  team text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meal_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  unit_price numeric(12, 2) not null default 0 check (unit_price >= 0),
  active boolean not null default true,
  sort_order integer not null default 0
);

create table public.meal_locations (
  id uuid primary key default gen_random_uuid(),
  meal_type_id uuid not null references public.meal_types(id) on delete cascade,
  name text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  unique (meal_type_id, name),
  unique (id, meal_type_id)
);

create table public.app_settings (
  id boolean primary key default true check (id = true),
  cutoff_time time not null default '18:00',
  default_meal_date date,
  supplier_name text not null default 'Fornecedor Central',
  notification_channel text not null default 'E-mail e push',
  offline_sync_enabled boolean not null default false,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table public.meal_requests (
  id uuid primary key default gen_random_uuid(),
  meal_date date not null,
  meal_type_id uuid not null references public.meal_types(id),
  location_id uuid not null references public.meal_locations(id),
  leader_id uuid not null references public.profiles(id),
  quantity integer not null check (quantity > 0),
  status text not null default 'rascunho'
    check (status in ('rascunho', 'enviado', 'cancelado', 'entregue')),
  notes text not null default '',
  created_by uuid not null references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (location_id, meal_type_id)
    references public.meal_locations(id, meal_type_id)
);

create table public.consolidations (
  id uuid primary key default gen_random_uuid(),
  meal_date date not null unique,
  supplier_id uuid not null references public.profiles(id),
  status text not null default 'rascunho'
    check (status in ('rascunho', 'enviado', 'confirmado', 'producao', 'saiu_entrega', 'entregue')),
  sent_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.consolidation_items (
  id uuid primary key default gen_random_uuid(),
  consolidation_id uuid not null references public.consolidations(id) on delete cascade,
  meal_request_id uuid not null references public.meal_requests(id),
  unique (consolidation_id, meal_request_id)
);

create table public.supplier_confirmations (
  id uuid primary key default gen_random_uuid(),
  consolidation_id uuid not null references public.consolidations(id) on delete cascade,
  step text not null check (step in ('confirmado', 'producao', 'saiu_entrega', 'entregue')),
  confirmed_by uuid not null references public.profiles(id),
  confirmed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique (consolidation_id, step)
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index meal_requests_date_idx on public.meal_requests(meal_date);
create index meal_requests_leader_idx on public.meal_requests(leader_id);
create index meal_requests_status_idx on public.meal_requests(status);
create index consolidations_supplier_idx on public.consolidations(supplier_id);
create index consolidation_items_request_idx on public.consolidation_items(meal_request_id);
create index audit_log_created_at_idx on public.audit_log(created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger requests_set_updated_at before update on public.meal_requests
for each row execute function public.set_updated_at();
create trigger consolidations_set_updated_at before update on public.consolidations
for each row execute function public.set_updated_at();
create trigger settings_set_updated_at before update on public.app_settings
for each row execute function public.set_updated_at();

create or replace function public.audit_new_request()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    new.created_by,
    case
      when new.created_by <> new.leader_id then 'Administrador criou pedido em nome de usuario'
      when new.status = 'enviado' then 'Pedido enviado'
      else 'Rascunho salvo'
    end,
    'pedido',
    new.id,
    jsonb_strip_nulls(jsonb_build_object(
      'status', new.status,
      'meal_date', new.meal_date,
      'represented_user_id',
      case when new.created_by <> new.leader_id then new.leader_id else null end
    ))
  );
  return new;
end;
$$;

create trigger meal_request_created_audit
after insert on public.meal_requests
for each row execute function public.audit_new_request();

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, name, email, role, team)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1)),
    lower(new.email),
    'encarregado',
    nullif(trim(new.raw_user_meta_data ->> 'team'), '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

create or replace function public.current_user_role()
returns text language sql stable security definer set search_path = '' as $$
  select role from public.profiles
  where id = (select auth.uid()) and active = true;
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(public.current_user_role() = 'admin', false);
$$;

create or replace function public.can_access_consolidation(p_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(
    public.is_admin() or exists (
      select 1 from public.consolidations
      where id = p_id and supplier_id = (select auth.uid())
    ), false
  );
$$;

create or replace function public.can_access_request(p_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(
    public.is_admin()
    or exists (
      select 1 from public.meal_requests
      where id = p_id and leader_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.consolidation_items ci
      join public.consolidations c on c.id = ci.consolidation_id
      where ci.meal_request_id = p_id
        and c.supplier_id = (select auth.uid())
    ), false
  );
$$;

alter table public.profiles enable row level security;
alter table public.meal_types enable row level security;
alter table public.meal_locations enable row level security;
alter table public.app_settings enable row level security;
alter table public.meal_requests enable row level security;
alter table public.consolidations enable row level security;
alter table public.consolidation_items enable row level security;
alter table public.supplier_confirmations enable row level security;
alter table public.audit_log enable row level security;

create policy "read profiles" on public.profiles for select to authenticated
using (active or id = (select auth.uid()) or public.is_admin());
create policy "read meal types" on public.meal_types for select to authenticated
using (active or public.is_admin());
create policy "admins manage meal types" on public.meal_types for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "read meal locations" on public.meal_locations for select to authenticated
using (active or public.is_admin());
create policy "admins manage meal locations" on public.meal_locations for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "read settings" on public.app_settings for select to authenticated using (true);
create policy "admins manage settings" on public.app_settings for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "read permitted requests" on public.meal_requests for select to authenticated
using (public.can_access_request(id));
create policy "create own requests" on public.meal_requests for insert to authenticated
with check (
  leader_id = (select auth.uid())
  and created_by = (select auth.uid())
  and public.current_user_role() in ('encarregado', 'admin')
);
create policy "update permitted requests" on public.meal_requests for update to authenticated
using (leader_id = (select auth.uid()) or public.is_admin())
with check (leader_id = (select auth.uid()) or public.is_admin());
create policy "read permitted consolidations" on public.consolidations for select to authenticated
using (public.can_access_consolidation(id));
create policy "read consolidation items" on public.consolidation_items for select to authenticated
using (public.can_access_consolidation(consolidation_id));
create policy "read confirmations" on public.supplier_confirmations for select to authenticated
using (public.can_access_consolidation(consolidation_id));
create policy "admins read audit" on public.audit_log for select to authenticated
using (public.is_admin());
create policy "users read own audit" on public.audit_log for select to authenticated
using (actor_id = (select auth.uid()));

create or replace function public.create_meal_request_as_user(
  p_leader_id uuid,
  p_meal_date date,
  p_meal_type_id uuid,
  p_location_id uuid,
  p_quantity integer,
  p_status text default 'enviado',
  p_notes text default ''
) returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem acessar outro usuario';
  end if;
  if p_status not in ('rascunho', 'enviado') then
    raise exception 'Status de pedido invalido';
  end if;
  if p_quantity <= 0 then
    raise exception 'A quantidade deve ser maior que zero';
  end if;
  if not exists (
    select 1 from public.profiles
    where id = p_leader_id and role = 'encarregado' and active
  ) then
    raise exception 'Encarregado invalido ou inativo';
  end if;

  insert into public.meal_requests (
    meal_date, meal_type_id, location_id, leader_id, quantity,
    status, notes, created_by, updated_by
  ) values (
    p_meal_date, p_meal_type_id, p_location_id, p_leader_id, p_quantity,
    p_status, coalesce(p_notes, ''), (select auth.uid()), (select auth.uid())
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.create_or_refresh_consolidation(
  p_meal_date date, p_supplier_id uuid
) returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem consolidar pedidos';
  end if;
  if not exists (
    select 1 from public.profiles
    where id = p_supplier_id and role = 'fornecedor' and active
  ) then
    raise exception 'Fornecedor invalido ou inativo';
  end if;

  insert into public.consolidations (meal_date, supplier_id, status, created_by)
  values (p_meal_date, p_supplier_id, 'rascunho', (select auth.uid()))
  on conflict (meal_date) do update
    set supplier_id = excluded.supplier_id
    where consolidations.status = 'rascunho'
  returning id into v_id;

  if v_id is null then
    raise exception 'Uma consolidacao enviada nao pode ser recriada';
  end if;

  delete from public.consolidation_items where consolidation_id = v_id;
  insert into public.consolidation_items (consolidation_id, meal_request_id)
  select v_id, id from public.meal_requests
  where meal_date = p_meal_date and status = 'enviado';

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    (select auth.uid()), 'Consolidacao criada ou atualizada',
    'consolidacao', v_id, jsonb_build_object('meal_date', p_meal_date)
  );
  return v_id;
end;
$$;

create or replace function public.send_consolidation(
  p_meal_date date, p_supplier_id uuid
) returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  v_id := public.create_or_refresh_consolidation(p_meal_date, p_supplier_id);
  if not exists (
    select 1 from public.consolidation_items where consolidation_id = v_id
  ) then
    raise exception 'Nao ha pedidos enviados para consolidar';
  end if;
  update public.consolidations set status = 'enviado', sent_at = now() where id = v_id;
  insert into public.audit_log (actor_id, action, entity, entity_id)
  values ((select auth.uid()), 'Consolidado enviado ao fornecedor', 'consolidacao', v_id);
  return v_id;
end;
$$;

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
    (v_status = 'enviado' and p_step = 'confirmado')
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

  if p_step in ('saiu_entrega', 'entregue') then
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

create or replace function public.change_request_status(
  p_request_id uuid, p_status text
) returns void language plpgsql security definer set search_path = '' as $$
declare v_request public.meal_requests; v_cutoff time; v_limit timestamptz;
begin
  if p_status not in ('rascunho', 'cancelado') then
    raise exception 'Status nao permitido';
  end if;
  select * into v_request from public.meal_requests
  where id = p_request_id for update;
  if not found then raise exception 'Pedido nao encontrado'; end if;
  if v_request.leader_id <> (select auth.uid()) and not public.is_admin() then
    raise exception 'Usuario nao autorizado';
  end if;
  if v_request.status in ('cancelado', 'entregue') then
    raise exception 'Pedido bloqueado';
  end if;

  select cutoff_time into v_cutoff from public.app_settings where id = true;
  v_limit := ((v_request.meal_date - 1) + v_cutoff) at time zone 'America/Bahia';
  if now() > v_limit and not public.is_admin() then
    raise exception 'O horario limite foi encerrado';
  end if;

  update public.meal_requests
  set status = p_status, updated_by = (select auth.uid())
  where id = p_request_id;
  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    (select auth.uid()),
    case when p_status = 'cancelado' then 'Pedido cancelado' else 'Pedido liberado para edicao' end,
    'pedido', p_request_id, jsonb_build_object('status', p_status)
  );
end;
$$;

revoke all on function public.create_or_refresh_consolidation(date, uuid) from public;
revoke all on function public.create_meal_request_as_user(uuid, date, uuid, uuid, integer, text, text) from public;
revoke all on function public.send_consolidation(date, uuid) from public;
revoke all on function public.confirm_supplier_step(uuid, text, jsonb) from public;
revoke all on function public.change_request_status(uuid, text) from public;
grant execute on function public.create_or_refresh_consolidation(date, uuid) to authenticated;
grant execute on function public.create_meal_request_as_user(uuid, date, uuid, uuid, integer, text, text) to authenticated;
grant execute on function public.send_consolidation(date, uuid) to authenticated;
grant execute on function public.confirm_supplier_step(uuid, text, jsonb) to authenticated;
grant execute on function public.change_request_status(uuid, text) to authenticated;

grant usage on schema public to authenticated;
grant select on all tables in schema public to authenticated;
grant insert on public.meal_requests to authenticated;

insert into public.app_settings (id) values (true);
insert into public.meal_types (name, sort_order) values
  ('Marmita Campo', 10), ('Buffer Almoco', 20), ('Jantar', 30);
insert into public.meal_locations (meal_type_id, name, sort_order)
select id, 'Campo', 10 from public.meal_types where name = 'Marmita Campo';
insert into public.meal_locations (meal_type_id, name, sort_order)
select id, location, ordering
from public.meal_types
cross join (values ('Restaurante BR', 10), ('Restaurante Centro', 20)) locations(location, ordering)
where name = 'Buffer Almoco';
insert into public.meal_locations (meal_type_id, name, sort_order)
select id, 'Restaurante Centro', 10 from public.meal_types where name = 'Jantar';

do $$
begin
  alter publication supabase_realtime add table public.meal_requests;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.consolidations;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.supplier_confirmations;
exception when duplicate_object then null;
end $$;

commit;
