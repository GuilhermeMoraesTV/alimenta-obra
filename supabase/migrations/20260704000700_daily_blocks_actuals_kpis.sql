begin;

alter table public.app_settings
  add column if not exists occupancy_target integer not null default 100
    check (occupancy_target >= 0);

alter table public.meal_types
  add column if not exists description text not null default '',
  add column if not exists unit_price numeric(12, 2) not null default 0
    check (unit_price >= 0);

update public.meal_types
set unit_price = coalesce(nullif(unit_price, 0), (select default_meal_unit_price from public.app_settings where id = true), 0);

create table if not exists public.work_sections (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  headcount integer not null default 0 check (headcount >= 0),
  leader_id uuid references public.profiles(id),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists work_sections_name_key on public.work_sections (lower(trim(name)));
create index if not exists work_sections_leader_idx on public.work_sections (leader_id, active);

drop trigger if exists work_sections_set_updated_at on public.work_sections;
create trigger work_sections_set_updated_at before update on public.work_sections
for each row execute function public.set_updated_at();

insert into public.work_sections (name, headcount, leader_id, active)
select coalesce(nullif(trim(team), ''), name), 0, id, true
from public.profiles
where role = 'encarregado' and active
on conflict do nothing;

alter table public.meal_requests
  add column if not exists team_id uuid references public.work_sections(id);

update public.meal_requests mr
set team_id = ws.id
from public.work_sections ws
where mr.team_id is null
  and (ws.leader_id = mr.leader_id or lower(trim(ws.name)) = lower(trim(coalesce((select team from public.profiles where id = mr.leader_id), ''))))
  and ws.active;

create index if not exists meal_requests_team_idx on public.meal_requests(team_id);

create table if not exists public.consolidation_actuals (
  id uuid primary key default gen_random_uuid(),
  consolidation_id uuid not null references public.consolidations(id) on delete cascade,
  meal_date date not null,
  team_id uuid not null references public.work_sections(id),
  meal_type_id uuid not null references public.meal_types(id),
  quantity integer not null default 0 check (quantity >= 0),
  notes text not null default '',
  recorded_by uuid references public.profiles(id),
  recorded_at timestamptz not null default now(),
  unique (consolidation_id, team_id, meal_type_id)
);

create index if not exists consolidation_actuals_date_idx
  on public.consolidation_actuals(meal_date, team_id, meal_type_id);

create table if not exists public.consolidation_revisions (
  id uuid primary key default gen_random_uuid(),
  consolidation_id uuid not null references public.consolidations(id) on delete cascade,
  edited_by uuid references public.profiles(id),
  edited_at timestamptz not null default now(),
  reason text not null default '',
  snapshot jsonb not null default '[]'::jsonb
);

create table if not exists public.daily_reports (
  id uuid primary key default gen_random_uuid(),
  report_date date not null unique,
  status text not null default 'gerado',
  totals jsonb not null default '{}'::jsonb,
  snapshot jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  generated_by uuid references public.profiles(id)
);

alter table public.work_sections enable row level security;
alter table public.consolidation_actuals enable row level security;
alter table public.consolidation_revisions enable row level security;
alter table public.daily_reports enable row level security;

drop policy if exists "permitted users read work sections" on public.work_sections;
create policy "permitted users read work sections" on public.work_sections for select to authenticated using (true);

drop policy if exists "admins manage work sections" on public.work_sections;
create policy "admins manage work sections" on public.work_sections for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "permitted users read actuals" on public.consolidation_actuals;
create policy "permitted users read actuals" on public.consolidation_actuals for select to authenticated
using (public.can_access_consolidation(consolidation_id));

drop policy if exists "permitted users read revisions" on public.consolidation_revisions;
create policy "permitted users read revisions" on public.consolidation_revisions for select to authenticated
using (public.can_access_consolidation(consolidation_id));

drop policy if exists "admins read reports" on public.daily_reports;
create policy "admins read reports" on public.daily_reports for select to authenticated using (public.is_admin());

create or replace function public.upsert_work_section(
  p_id uuid,
  p_name text,
  p_headcount integer default 0,
  p_leader_id uuid default null,
  p_active boolean default true
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  if not public.is_admin() then raise exception 'Apenas administradores podem gerenciar equipes'; end if;
  if p_id is null then
    insert into public.work_sections (name, headcount, leader_id, active)
    values (trim(p_name), greatest(0, coalesce(p_headcount, 0)), p_leader_id, coalesce(p_active, true))
    returning id into v_id;
  else
    update public.work_sections
    set name = trim(p_name),
        headcount = greatest(0, coalesce(p_headcount, 0)),
        leader_id = p_leader_id,
        active = coalesce(p_active, true),
        updated_at = now()
    where id = p_id
    returning id into v_id;
  end if;
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
  v_count integer := 0;
  v_item jsonb;
begin
  select status, meal_date, supplier_id into v_status, v_date, v_supplier
  from public.consolidations where id = p_consolidation_id for update;
  if not found then raise exception 'Bloco diario nao encontrado'; end if;
  if v_supplier <> auth.uid() and not public.is_admin() then raise exception 'Usuario nao autorizado'; end if;
  if v_status not in ('confirmado', 'producao', 'saiu_entrega') then
    raise exception 'Confirme o recebimento antes de registrar consumo real';
  end if;

  for v_item in select * from jsonb_array_elements(coalesce(p_actuals, '[]'::jsonb))
  loop
    insert into public.consolidation_actuals (
      consolidation_id, meal_date, team_id, meal_type_id, quantity, recorded_by
    ) values (
      p_consolidation_id, v_date,
      (v_item ->> 'team_id')::uuid,
      (v_item ->> 'meal_type_id')::uuid,
      greatest(0, coalesce((v_item ->> 'quantity')::integer, 0)),
      auth.uid()
    )
    on conflict (consolidation_id, team_id, meal_type_id) do update
      set quantity = excluded.quantity,
          recorded_by = excluded.recorded_by,
          recorded_at = now();
    v_count := v_count + 1;
  end loop;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Consumo real registrado', 'consolidacao', p_consolidation_id,
    jsonb_build_object('rows', v_count));

  return v_count;
end;
$$;

grant execute on function public.upsert_work_section(uuid, text, integer, uuid, boolean) to authenticated;
grant execute on function public.save_consolidation_actuals(uuid, jsonb) to authenticated;

do $$ begin alter publication supabase_realtime add table public.work_sections; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.consolidation_actuals; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.daily_reports; exception when duplicate_object then null; end $$;

commit;
