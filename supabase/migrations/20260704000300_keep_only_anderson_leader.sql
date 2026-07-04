create temp table _keep_leader_id (
  id uuid primary key
) on commit drop;

insert into _keep_leader_id (id)
select id
from public.profiles
where role = 'encarregado'
  and lower(trim(name)) = 'anderson silva'
order by active desc, created_at asc, id::text asc
limit 1;

do $$
begin
  if not exists (select 1 from _keep_leader_id) then
    raise exception 'Encarregado Anderson Silva nao encontrado. Nenhum usuario foi removido.';
  end if;
end $$;

create temp table _remove_leader_ids (
  id uuid primary key
) on commit drop;

insert into _remove_leader_ids (id)
select id
from public.profiles
where role = 'encarregado'
  and id not in (select id from _keep_leader_id);

delete from public.consolidation_documents
where uploaded_by in (select id from _remove_leader_ids);

delete from public.supplier_confirmations
where confirmed_by in (select id from _remove_leader_ids);

delete from public.consolidation_items
where consolidation_id in (
  select id
  from public.consolidations
  where supplier_id in (select id from _remove_leader_ids)
     or created_by in (select id from _remove_leader_ids)
)
or meal_request_id in (
  select id
  from public.meal_requests
  where leader_id in (select id from _remove_leader_ids)
     or created_by in (select id from _remove_leader_ids)
     or updated_by in (select id from _remove_leader_ids)
);

delete from public.consolidations
where supplier_id in (select id from _remove_leader_ids)
   or created_by in (select id from _remove_leader_ids);

delete from public.meal_requests
where leader_id in (select id from _remove_leader_ids)
   or created_by in (select id from _remove_leader_ids)
   or updated_by in (select id from _remove_leader_ids);

update public.app_settings
set updated_by = null
where updated_by in (select id from _remove_leader_ids);

update public.audit_log
set actor_id = null
where actor_id in (select id from _remove_leader_ids);

update public.access_invites
set created_by = null
where created_by in (select id from _remove_leader_ids);

update public.access_invites
set used_by = null
where used_by in (select id from _remove_leader_ids);

delete from auth.users
where id in (select id from _remove_leader_ids);
