create table public.delivery_addresses (
  id uuid primary key default gen_random_uuid(),
  leader_id uuid not null references public.profiles(id) on delete cascade,
  label text not null check (char_length(trim(label)) between 2 and 80),
  address_line text not null check (char_length(trim(address_line)) between 5 and 240),
  reference text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (leader_id, label)
);

create index delivery_addresses_leader_idx on public.delivery_addresses(leader_id, active, label);
create trigger delivery_addresses_set_updated_at before update on public.delivery_addresses
for each row execute function public.set_updated_at();

alter table public.meal_requests
  add column delivery_address_id uuid references public.delivery_addresses(id);

create or replace function public.validate_request_delivery_address()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.delivery_address_id is not null and not exists (
    select 1 from public.delivery_addresses
    where id = new.delivery_address_id
      and leader_id = new.leader_id
      and active
  ) then
    raise exception 'Endereco de entrega invalido para este encarregado';
  end if;
  return new;
end;
$$;

create trigger meal_requests_validate_delivery_address
before insert or update of delivery_address_id, leader_id on public.meal_requests
for each row execute function public.validate_request_delivery_address();

alter table public.delivery_addresses enable row level security;

create policy "leaders read own delivery addresses"
on public.delivery_addresses for select to authenticated
using (leader_id = (select auth.uid()) or public.is_admin());

create policy "leaders create own delivery addresses"
on public.delivery_addresses for insert to authenticated
with check (leader_id = (select auth.uid()) and public.current_user_role() in ('encarregado', 'admin'));

create policy "leaders manage own delivery addresses"
on public.delivery_addresses for update to authenticated
using (leader_id = (select auth.uid()) or public.is_admin())
with check (leader_id = (select auth.uid()) or public.is_admin());

create policy "leaders delete own delivery addresses"
on public.delivery_addresses for delete to authenticated
using (leader_id = (select auth.uid()) or public.is_admin());

grant select, insert, update, delete on public.delivery_addresses to authenticated;

drop function if exists public.create_meal_request_as_user(uuid, date, uuid, uuid, integer, text, text);
create function public.create_meal_request_as_user(
  p_leader_id uuid,
  p_meal_date date,
  p_meal_type_id uuid,
  p_location_id uuid,
  p_delivery_address_id uuid default null,
  p_quantity integer default 1,
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
    select 1 from public.profiles where id = p_leader_id and role = 'encarregado' and active
  ) then
    raise exception 'Encarregado invalido ou inativo';
  end if;

  insert into public.meal_requests (
    meal_date, meal_type_id, location_id, delivery_address_id, leader_id,
    quantity, status, notes, created_by, updated_by
  ) values (
    p_meal_date, p_meal_type_id, p_location_id, p_delivery_address_id, p_leader_id,
    p_quantity, p_status, coalesce(p_notes, ''), (select auth.uid()), (select auth.uid())
  ) returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.create_meal_request_as_user(uuid, date, uuid, uuid, uuid, integer, text, text) from public;
grant execute on function public.create_meal_request_as_user(uuid, date, uuid, uuid, uuid, integer, text, text) to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.delivery_addresses;
exception when duplicate_object then null;
end $$;
