drop function if exists public.update_user_password_as_admin(uuid, text);

create function public.update_user_password_as_admin(
  p_user_id uuid,
  p_password text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor_id uuid := (select auth.uid());
  v_actor_role text := public.current_user_role();
  v_updated integer;
begin
  if v_actor_id is null then
    raise exception 'Sessão expirada. Entre novamente antes de alterar a senha.';
  end if;

  if v_actor_role <> 'admin' then
    raise exception 'Apenas administradores podem alterar a senha de outro usuario.';
  end if;

  if length(coalesce(p_password, '')) < 8 then
    raise exception 'A senha precisa ter pelo menos 8 caracteres.';
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = p_user_id
      and active
  ) then
    raise exception 'Usuário inválido ou inativo.';
  end if;

  update auth.users
  set encrypted_password = crypt(p_password, gen_salt('bf')),
      updated_at = now()
  where id = p_user_id;

  get diagnostics v_updated = row_count;
  if v_updated <> 1 then
    raise exception 'Usuário inválido ou inativo.';
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.update_user_password_as_admin(uuid, text) from public;
grant execute on function public.update_user_password_as_admin(uuid, text) to authenticated;

notify pgrst, 'reload schema';
