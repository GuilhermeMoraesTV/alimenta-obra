create or replace function public.admin_update_user_active_status(
  p_user_id uuid,
  p_active boolean
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_target uuid := p_user_id;
begin
  if v_actor is null then
    raise exception 'Sessao expirada. Entre novamente.';
  end if;

  if not public.is_admin() then
    raise exception 'Apenas administradores podem alterar status de usuarios.';
  end if;

  if v_target is null then
    raise exception 'Usuario nao informado.';
  end if;

  if v_target = v_actor and coalesce(p_active, false) = false then
    raise exception 'Nao e possivel desativar o proprio usuario logado.';
  end if;

  update public.profiles
  set active = coalesce(p_active, true)
  where id = v_target
  returning id into v_target;

  if v_target is null then
    raise exception 'Usuario nao encontrado.';
  end if;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    v_actor,
    case when coalesce(p_active, true) then 'Usuario ativado' else 'Usuario desativado' end,
    'profile',
    v_target,
    jsonb_build_object('active', coalesce(p_active, true))
  );

  return v_target;
end;
$$;

revoke all on function public.admin_update_user_active_status(uuid, boolean) from public;
grant execute on function public.admin_update_user_active_status(uuid, boolean) to authenticated;
