begin;

drop function if exists public.generate_daily_report(date);

create or replace function public.generate_daily_report(
  p_report_date date
) returns public.daily_reports
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_report public.daily_reports;
  v_rows jsonb;
  v_totals jsonb;
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem gerar relatorio diario';
  end if;

  with report_rows as (
    select
      mr.id,
      mr.meal_date,
      mr.leader_id,
      coalesce(leader.name, 'Usuario removido') as leader_name,
      mr.team_id,
      coalesce(ws.name, ml.name, '') as section_name,
      coalesce(ws.headcount, 0) as effective,
      mr.meal_type_id,
      mt.name as meal_type,
      coalesce(mt.unit_price, 0) as unit_price,
      mr.quantity as requested,
      coalesce(ca.quantity, mr.quantity, 0) as consumed,
      mr.status,
      mr.notes
    from public.meal_requests mr
    join public.meal_types mt on mt.id = mr.meal_type_id
    join public.meal_locations ml on ml.id = mr.location_id
    left join public.profiles leader on leader.id = mr.leader_id
    left join public.work_sections ws on ws.id = mr.team_id
    left join (
      select meal_date, team_id, meal_type_id, max(quantity) as quantity
      from public.consolidation_actuals
      group by meal_date, team_id, meal_type_id
    ) ca on ca.meal_date = mr.meal_date
      and ca.team_id = mr.team_id
      and ca.meal_type_id = mr.meal_type_id
    where mr.meal_date = p_report_date
      and mr.status <> 'cancelado'
  ),
  packed as (
    select
      coalesce(jsonb_agg(jsonb_build_object(
        'id', id,
        'date', meal_date,
        'leaderId', leader_id,
        'leader', leader_name,
        'teamId', team_id,
        'section', section_name,
        'mealTypeId', meal_type_id,
        'meal', meal_type,
        'requested', requested,
        'consumed', consumed,
        'actualQuantity', consumed,
        'effective', effective,
        'unitPrice', unit_price,
        'value', consumed * unit_price,
        'status', status,
        'notes', notes
      ) order by leader_name, section_name, meal_type), '[]'::jsonb) as rows,
      coalesce(sum(requested), 0) as requested,
      coalesce(sum(consumed), 0) as consumed,
      coalesce(sum(effective), 0) as headcount,
      coalesce(sum(consumed * unit_price), 0) as cost,
      count(*) as row_count
    from report_rows
  )
  select
    jsonb_build_object(
      'requested', requested,
      'consumed', consumed,
      'headcount', headcount,
      'cost', cost,
      'rows', row_count
    ),
    jsonb_build_object('rows', rows, 'items', rows)
  into v_totals, v_rows
  from packed;

  insert into public.daily_reports (
    report_date,
    status,
    totals,
    snapshot,
    generated_at,
    generated_by
  ) values (
    p_report_date,
    'gerado',
    coalesce(v_totals, '{}'::jsonb),
    coalesce(v_rows, jsonb_build_object('rows', '[]'::jsonb, 'items', '[]'::jsonb)),
    now(),
    auth.uid()
  )
  on conflict (report_date) do update
    set status = excluded.status,
        totals = excluded.totals,
        snapshot = excluded.snapshot,
        generated_at = excluded.generated_at,
        generated_by = excluded.generated_by
  returning * into v_report;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Relatorio diario gerado', 'daily_report', v_report.id,
    jsonb_build_object('report_date', p_report_date));

  return v_report;
end;
$$;

grant execute on function public.generate_daily_report(date) to authenticated;

commit;
