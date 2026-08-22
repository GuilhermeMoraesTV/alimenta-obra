with counts as (
  select 'auth.users' as table_name, count(*)::int as row_count from auth.users where deleted_at is null
  union all select 'profiles', count(*)::int from public.profiles
  union all select 'supplier_companies', count(*)::int from public.supplier_companies
  union all select 'supplier_company_users', count(*)::int from public.supplier_company_users
  union all select 'supplier_meal_types', count(*)::int from public.supplier_meal_types
  union all select 'work_sections', count(*)::int from public.work_sections
  union all select 'work_section_meal_types', count(*)::int from public.work_section_meal_types
  union all select 'meal_categories', count(*)::int from public.meal_categories
  union all select 'meal_types', count(*)::int from public.meal_types
  union all select 'meal_locations', count(*)::int from public.meal_locations
  union all select 'meal_requests', count(*)::int from public.meal_requests
  union all select 'consolidations', count(*)::int from public.consolidations
  union all select 'consolidation_items', count(*)::int from public.consolidation_items
  union all select 'supplier_confirmations', count(*)::int from public.supplier_confirmations
  union all select 'consolidation_actuals', count(*)::int from public.consolidation_actuals
  union all select 'consolidation_revisions', count(*)::int from public.consolidation_revisions
  union all select 'daily_reports', count(*)::int from public.daily_reports
  union all select 'consolidation_documents', count(*)::int from public.consolidation_documents
  union all select 'access_invites', count(*)::int from public.access_invites
  union all select 'audit_log', count(*)::int from public.audit_log
  union all select 'storage.objects:supplier-documents', count(*)::int from storage.objects where bucket_id = 'supplier-documents'
)
select jsonb_build_object(
  'capturedAt', now(),
  'projectRef', 'nahretmwgwuqjhhqwjpd',
  'adminPreserved', 'admin@gmail.com',
  'tableCounts', (select jsonb_object_agg(table_name, row_count order by table_name) from counts),
  'authUsersToRemove', coalesce((
    select jsonb_agg(jsonb_build_object('id', id, 'email', email, 'createdAt', created_at) order by email)
    from auth.users
    where deleted_at is null and lower(email) <> 'admin@gmail.com'
  ), '[]'::jsonb),
  'profilesToRemove', coalesce((
    select jsonb_agg(jsonb_build_object('id', id, 'email', email, 'name', name, 'role', role, 'team', team, 'active', active) order by email)
    from public.profiles
    where lower(email) <> 'admin@gmail.com'
  ), '[]'::jsonb)
) as snapshot;
