begin;

alter table public.meal_requests
  add column if not exists meal_name_snapshot text,
  add column if not exists meal_description_snapshot text,
  add column if not exists meal_category_snapshot text,
  add column if not exists can_record_actuals_snapshot boolean,
  add column if not exists unit_price_snapshot numeric(12, 2),
  add column if not exists section_name_snapshot text,
  add column if not exists section_headcount_snapshot integer,
  add column if not exists supplier_name_snapshot text;

create or replace function public.set_meal_request_snapshots()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_meal record;
  v_section record;
  v_supplier record;
  v_supplier_price numeric(12, 2);
  v_default_price numeric(12, 2);
begin
  select mt.name, mt.description, mt.category, mt.unit_price, coalesce(mc.can_record_actuals, false) as can_record_actuals
    into v_meal
  from public.meal_types mt
  left join public.meal_categories mc on mc.id = mt.category
  where mt.id = new.meal_type_id;

  select ws.name, ws.headcount
    into v_section
  from public.work_sections ws
  where ws.id = new.team_id;

  select coalesce(nullif(sc.trade_name, ''), nullif(sc.legal_name, ''), sc.email, sc.id::text) as name
    into v_supplier
  from public.supplier_companies sc
  where sc.id = new.supplier_company_id;

  select smt.unit_price
    into v_supplier_price
  from public.supplier_meal_types smt
  where smt.supplier_company_id = new.supplier_company_id
    and smt.meal_type_id = new.meal_type_id
    and smt.active
  limit 1;

  select aps.default_meal_unit_price
    into v_default_price
  from public.app_settings aps
  where aps.id = true;

  if tg_op = 'INSERT'
    or new.meal_type_id is distinct from old.meal_type_id
    or new.supplier_company_id is distinct from old.supplier_company_id
    or new.meal_name_snapshot is null
    or new.meal_category_snapshot is null
    or new.unit_price_snapshot is null
  then
    new.meal_name_snapshot := coalesce(v_meal.name, new.meal_name_snapshot);
    new.meal_description_snapshot := coalesce(v_meal.description, new.meal_description_snapshot, '');
    new.meal_category_snapshot := coalesce(v_meal.category, new.meal_category_snapshot, '');
    new.can_record_actuals_snapshot := coalesce(v_meal.can_record_actuals, new.can_record_actuals_snapshot, false);
    new.unit_price_snapshot := coalesce(v_supplier_price, v_meal.unit_price, new.unit_price_snapshot, v_default_price, 0);
  end if;

  if tg_op = 'INSERT'
    or new.team_id is distinct from old.team_id
    or new.section_name_snapshot is null
  then
    new.section_name_snapshot := coalesce(v_section.name, new.section_name_snapshot, '');
    new.section_headcount_snapshot := coalesce(v_section.headcount, new.section_headcount_snapshot, 0);
  end if;

  if tg_op = 'INSERT'
    or new.supplier_company_id is distinct from old.supplier_company_id
    or new.supplier_name_snapshot is null
  then
    new.supplier_name_snapshot := coalesce(v_supplier.name, new.supplier_name_snapshot, '');
  end if;

  return new;
end;
$$;

drop trigger if exists meal_requests_set_snapshots on public.meal_requests;
create trigger meal_requests_set_snapshots
before insert or update of meal_type_id, team_id, supplier_company_id on public.meal_requests
for each row execute function public.set_meal_request_snapshots();

update public.meal_requests
set meal_type_id = meal_type_id
where meal_name_snapshot is null
  or meal_category_snapshot is null
  or unit_price_snapshot is null
  or section_name_snapshot is null
  or supplier_name_snapshot is null;

commit;
