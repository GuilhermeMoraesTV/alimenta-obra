drop policy if exists "create own requests" on public.meal_requests;

create policy "create permitted requests"
on public.meal_requests for insert to authenticated
with check (
  (
    leader_id = (select auth.uid())
    and created_by = (select auth.uid())
    and public.current_user_role() in ('encarregado', 'admin')
  )
  or (
    created_by = (select auth.uid())
    and public.is_admin()
    and exists (
      select 1
      from public.profiles leader
      where leader.id = leader_id
        and leader.role = 'encarregado'
        and leader.active
    )
  )
);
