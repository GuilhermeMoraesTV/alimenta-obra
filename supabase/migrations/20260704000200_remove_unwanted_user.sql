create temp table _remove_unwanted_user_ids (
  id uuid primary key
) on commit drop;

insert into _remove_unwanted_user_ids (id)
select id
from public.profiles
where lower(name) in ('cagão', 'cagao')
   or lower(email) like '%cagão%'
   or lower(email) like '%cagao%';

delete from public.consolidation_documents
where uploaded_by in (select id from _remove_unwanted_user_ids);

delete from public.supplier_confirmations
where confirmed_by in (select id from _remove_unwanted_user_ids);

delete from public.consolidation_items
where consolidation_id in (
  select id
  from public.consolidations
  where supplier_id in (select id from _remove_unwanted_user_ids)
     or created_by in (select id from _remove_unwanted_user_ids)
)
or meal_request_id in (
  select id
  from public.meal_requests
  where leader_id in (select id from _remove_unwanted_user_ids)
     or created_by in (select id from _remove_unwanted_user_ids)
     or updated_by in (select id from _remove_unwanted_user_ids)
);

delete from public.consolidations
where supplier_id in (select id from _remove_unwanted_user_ids)
   or created_by in (select id from _remove_unwanted_user_ids);

delete from public.meal_requests
where leader_id in (select id from _remove_unwanted_user_ids)
   or created_by in (select id from _remove_unwanted_user_ids)
   or updated_by in (select id from _remove_unwanted_user_ids);

update public.audit_log
set actor_id = null
where actor_id in (select id from _remove_unwanted_user_ids);

update public.access_invites
set created_by = null
where created_by in (select id from _remove_unwanted_user_ids);

update public.access_invites
set used_by = null
where used_by in (select id from _remove_unwanted_user_ids);

delete from auth.users
where id in (select id from _remove_unwanted_user_ids);
