begin;

set local statement_timeout = '120s';

do $$
declare
  v_admin_id uuid;
begin
  select id
    into v_admin_id
    from auth.users
   where lower(email) = 'admin@gmail.com'
     and deleted_at is null
   order by created_at
   limit 1;

  if v_admin_id is null then
    raise exception 'Admin auth user admin@gmail.com nao encontrado; reset abortado.';
  end if;

  delete from public.consolidation_documents;
  delete from public.daily_reports;
  delete from public.consolidation_actuals;
  delete from public.consolidation_revisions;
  delete from public.supplier_confirmations;
  delete from public.consolidation_items;
  delete from public.consolidations;
  delete from public.meal_requests;
  delete from public.supplier_meal_types;
  delete from public.work_section_meal_types;
  delete from public.supplier_company_users;
  delete from public.work_sections;
  delete from public.supplier_companies;
  delete from public.meal_locations;
  delete from public.meal_types;
  delete from public.meal_categories;
  delete from public.access_invites;
  delete from public.audit_log;

  insert into public.profiles (id, name, email, role, team, active)
  values (v_admin_id, 'Administrador', 'admin@gmail.com', 'admin', 'Administracao', true)
  on conflict (id) do update
    set name = excluded.name,
        email = excluded.email,
        role = excluded.role,
        team = excluded.team,
        active = true,
        updated_at = now();

  insert into public.app_settings (
    id,
    cutoff_time,
    default_meal_date,
    supplier_name,
    notification_channel,
    offline_sync_enabled,
    occupancy_target,
    updated_by
  )
  values (
    true,
    time '18:00',
    null,
    'Fornecedores Alimenta Obra',
    'E-mail e push',
    false,
    100,
    v_admin_id
  )
  on conflict (id) do update
    set cutoff_time = excluded.cutoff_time,
        default_meal_date = excluded.default_meal_date,
        supplier_name = excluded.supplier_name,
        notification_channel = excluded.notification_channel,
        offline_sync_enabled = excluded.offline_sync_enabled,
        occupancy_target = excluded.occupancy_target,
        updated_by = excluded.updated_by,
        updated_at = now();

  delete from auth.users
   where id <> v_admin_id;

  insert into public.profiles (id, name, email, role, team, active)
  values (v_admin_id, 'Administrador', 'admin@gmail.com', 'admin', 'Administracao', true)
  on conflict (id) do update
    set name = excluded.name,
        email = excluded.email,
        role = excluded.role,
        team = excluded.team,
        active = true,
        updated_at = now();
end $$;

commit;
