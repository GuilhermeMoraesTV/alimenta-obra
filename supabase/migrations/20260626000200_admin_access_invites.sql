begin;

create table if not exists public.access_invites (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  role text not null check (role in ('admin', 'fornecedor')),
  email text,
  team text,
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  used_by uuid references public.profiles(id),
  used_at timestamptz,
  revoked_at timestamptz
);

create index if not exists access_invites_token_hash_idx on public.access_invites(token_hash);
create index if not exists access_invites_active_idx on public.access_invites(expires_at, used_at, revoked_at);

alter table public.access_invites enable row level security;

drop policy if exists "admins read access invites" on public.access_invites;
create policy "admins read access invites" on public.access_invites for select to authenticated
using (public.is_admin());

create or replace function public.hash_invite_token(p_token text)
returns text language sql immutable set search_path = '' as $$
  select pg_catalog.md5(coalesce(p_token, ''));
$$;

create or replace function public.create_access_invite(
  p_token text,
  p_role text,
  p_email text default null,
  p_team text default null,
  p_expires_in_days integer default 7
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_email text := nullif(lower(trim(coalesce(p_email, ''))), '');
  v_expires_days integer := greatest(1, least(coalesce(p_expires_in_days, 7), 30));
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem criar convites';
  end if;

  if p_role not in ('admin', 'fornecedor') then
    raise exception 'Perfil de convite invalido';
  end if;

  if length(coalesce(p_token, '')) < 32 then
    raise exception 'Token de convite invalido';
  end if;

  insert into public.access_invites (
    token_hash, role, email, team, expires_at, created_by
  ) values (
    public.hash_invite_token(p_token),
    p_role,
    v_email,
    nullif(trim(coalesce(p_team, '')), ''),
    now() + make_interval(days => v_expires_days),
    (select auth.uid())
  )
  returning id into v_id;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    (select auth.uid()),
    'Convite de acesso criado',
    'convite',
    v_id,
    jsonb_build_object('role', p_role, 'email', v_email, 'expires_in_days', v_expires_days)
  );

  return v_id;
end;
$$;

create or replace function public.revoke_access_invite(
  p_invite_id uuid
) returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem revogar convites';
  end if;

  update public.access_invites
  set revoked_at = now()
  where id = p_invite_id and used_at is null and revoked_at is null;

  insert into public.audit_log (actor_id, action, entity, entity_id)
  values ((select auth.uid()), 'Convite de acesso revogado', 'convite', p_invite_id);
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_invite public.access_invites%rowtype;
  v_token text := nullif(new.raw_user_meta_data ->> 'invite_token', '');
  v_role text := 'encarregado';
  v_team text := nullif(trim(coalesce(new.raw_user_meta_data ->> 'team', '')), '');
begin
  if v_token is not null then
    select *
      into v_invite
      from public.access_invites
     where token_hash = public.hash_invite_token(v_token)
       and used_at is null
       and revoked_at is null
       and expires_at > now()
     for update;

    if found and (v_invite.email is null or v_invite.email = lower(new.email)) then
      v_role := v_invite.role;
      v_team := coalesce(v_invite.team, v_team);
    end if;
  end if;

  insert into public.profiles (id, name, email, role, team)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1)),
    lower(new.email),
    v_role,
    v_team
  );

  if v_invite.id is not null and v_role = v_invite.role then
    update public.access_invites
    set used_by = new.id,
        used_at = now()
    where id = v_invite.id;

    insert into public.audit_log (actor_id, action, entity, entity_id, payload)
    values (
      new.id,
      'Convite de acesso utilizado',
      'convite',
      v_invite.id,
      jsonb_build_object('role', v_role)
    );
  end if;

  return new;
end;
$$;

revoke all on function public.hash_invite_token(text) from public;
revoke all on function public.create_access_invite(text, text, text, text, integer) from public;
revoke all on function public.revoke_access_invite(uuid) from public;
grant execute on function public.create_access_invite(text, text, text, text, integer) to authenticated;
grant execute on function public.revoke_access_invite(uuid) to authenticated;

grant select on public.access_invites to authenticated;

commit;
