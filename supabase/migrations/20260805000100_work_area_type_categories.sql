begin;

create table if not exists public.work_area_types (
  id text primary key,
  label text not null,
  active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_area_type_categories (
  area_type_id text not null references public.work_area_types(id) on delete cascade,
  meal_category_id text not null references public.meal_categories(id) on delete restrict,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (area_type_id, meal_category_id)
);

alter table public.work_area_types enable row level security;
alter table public.work_area_type_categories enable row level security;

drop policy if exists "work_area_types_select_authenticated" on public.work_area_types;
create policy "work_area_types_select_authenticated"
on public.work_area_types for select
to authenticated
using (true);

drop policy if exists "work_area_type_categories_select_authenticated" on public.work_area_type_categories;
create policy "work_area_type_categories_select_authenticated"
on public.work_area_type_categories for select
to authenticated
using (true);

drop policy if exists "work_area_types_admin_all" on public.work_area_types;
create policy "work_area_types_admin_all"
on public.work_area_types for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "work_area_type_categories_admin_all" on public.work_area_type_categories;
create policy "work_area_type_categories_admin_all"
on public.work_area_type_categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

alter table public.work_sections
  drop constraint if exists work_sections_area_type_check;

insert into public.work_area_types (id, label, active, sort_order)
values
  ('campo', 'Campo', true, 10),
  ('canteiro', 'Canteiro', true, 20),
  ('escritorio', 'Escritorio', true, 30),
  ('misto', 'Misto', true, 40)
on conflict (id) do update
set label = excluded.label,
    active = public.work_area_types.active,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.work_area_type_categories (area_type_id, meal_category_id, active)
select area_type_id, meal_category_id, true
from (values
  ('campo', 'marmita'),
  ('campo', 'janta'),
  ('canteiro', 'buffet'),
  ('canteiro', 'janta'),
  ('escritorio', 'buffet'),
  ('escritorio', 'janta'),
  ('misto', 'marmita'),
  ('misto', 'buffet'),
  ('misto', 'janta')
) as seed(area_type_id, meal_category_id)
where exists (select 1 from public.meal_categories c where c.id = seed.meal_category_id)
on conflict (area_type_id, meal_category_id) do update
set active = true;

create or replace function public.upsert_work_area_type(
  p_id text,
  p_label text,
  p_category_ids text[],
  p_active boolean default true
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id text := lower(trim(coalesce(p_id, '')));
  v_label text := trim(coalesce(p_label, ''));
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem gerenciar tipos de area.';
  end if;
  if v_id = '' or v_label = '' then
    raise exception 'Informe um tipo de area valido.';
  end if;
  if coalesce(array_length(p_category_ids, 1), 0) = 0 then
    raise exception 'Vincule pelo menos uma categoria de refeicao.';
  end if;

  insert into public.work_area_types (id, label, active, sort_order, updated_at)
  values (
    v_id,
    v_label,
    coalesce(p_active, true),
    coalesce((select max(sort_order) + 10 from public.work_area_types), 10),
    now()
  )
  on conflict (id) do update
  set label = excluded.label,
      active = excluded.active,
      updated_at = now();

  update public.work_area_type_categories
  set active = false
  where area_type_id = v_id;

  insert into public.work_area_type_categories (area_type_id, meal_category_id, active)
  select v_id, category_id, true
  from unnest(p_category_ids) as category_id
  where exists (select 1 from public.meal_categories c where c.id = category_id)
  on conflict (area_type_id, meal_category_id) do update
  set active = true;

  return v_id;
end;
$$;

create or replace function public.delete_work_area_type(p_id text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id text := lower(trim(coalesce(p_id, '')));
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem excluir tipos de area.';
  end if;
  if v_id = '' then
    raise exception 'Tipo de area invalido.';
  end if;
  if exists (select 1 from public.work_sections where area_type = v_id) then
    update public.work_area_types set active = false, updated_at = now() where id = v_id;
  else
    delete from public.work_area_types where id = v_id;
  end if;
  return v_id;
end;
$$;

revoke all on function public.upsert_work_area_type(text, text, text[], boolean) from public;
revoke all on function public.delete_work_area_type(text) from public;
grant execute on function public.upsert_work_area_type(text, text, text[], boolean) to authenticated;
grant execute on function public.delete_work_area_type(text) to authenticated;

do $$ begin alter publication supabase_realtime add table public.work_area_types; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.work_area_type_categories; exception when duplicate_object then null; end $$;

commit;
