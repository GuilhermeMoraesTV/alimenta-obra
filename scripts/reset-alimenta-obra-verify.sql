with role_counts as (
  select role, count(*)::int as total
  from public.profiles
  group by role
),
consolidation_status as (
  select status, count(*)::int as total
  from public.consolidations
  group by status
),
leaders_by_date as (
  select meal_date, count(distinct leader_id)::int as leaders
  from public.meal_requests
  group by meal_date
),
section_meals as (
  select
    ws.name as section,
    array_agg(distinct mc.id order by mc.id) as categories
  from public.work_sections ws
  join public.work_section_meal_types wsmt on wsmt.work_section_id = ws.id and wsmt.active
  join public.meal_types mt on mt.id = wsmt.meal_type_id
  join public.meal_categories mc on mc.id = mt.category
  group by ws.name
)
select jsonb_build_object(
  'capturedAt', now(),
  'projectRef', 'nahretmwgwuqjhhqwjpd',
  'profileCountsByRole', (select jsonb_object_agg(role, total) from role_counts),
  'supplierCompanies', (select count(*)::int from public.supplier_companies),
  'workSections', (select count(*)::int from public.work_sections),
  'mealCategories', (select count(*)::int from public.meal_categories),
  'mealTypes', (select count(*)::int from public.meal_types),
  'mealLocations', (select count(*)::int from public.meal_locations),
  'mealRequests', (select count(*)::int from public.meal_requests),
  'distinctConsolidationDates', (select count(distinct meal_date)::int from public.consolidations),
  'supplierConsolidationRows', (select count(*)::int from public.consolidations),
  'consolidationStatusCounts', (select jsonb_object_agg(status, total) from consolidation_status),
  'leadersByDate', (select jsonb_agg(jsonb_build_object('mealDate', meal_date, 'leaders', leaders) order by meal_date) from leaders_by_date),
  'actualsRows', (select count(*)::int from public.consolidation_actuals),
  'marmitaActualRows', (
    select count(*)::int
    from public.consolidation_actuals ca
    join public.meal_types mt on mt.id = ca.meal_type_id
    where mt.category = 'marmita'
  ),
  'categoryActualRules', (
    select jsonb_object_agg(id, can_record_actuals order by id)
    from public.meal_categories
  ),
  'sectionAllowedCategories', (
    select jsonb_object_agg(section, categories order by section)
    from section_meals
  )
) as verification;
