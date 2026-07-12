create or replace function public.admin_update_user_password_v2(
  p_user_id text,
  p_password text
) returns void language plpgsql security definer set search_path = '' as $$
declare
  v_actor uuid := auth.uid();
  v_target uuid;
begin
  if v_actor is null then
    raise exception 'Sessao expirada. Entre novamente antes de alterar a senha.';
  end if;
  if not public.is_admin() then
    raise exception 'Apenas administradores podem alterar a senha de outro usuario.';
  end if;
  if length(coalesce(p_password, '')) < 8 then
    raise exception 'A senha precisa ter pelo menos 8 caracteres.';
  end if;

  v_target := p_user_id::uuid;
  if not exists (select 1 from public.profiles where id = v_target) then
    raise exception 'Usuario nao encontrado.';
  end if;

  update auth.users
  set encrypted_password = crypt(p_password, gen_salt('bf')),
      updated_at = now(),
      confirmation_token = '',
      recovery_token = '',
      email_change_token_new = '',
      email_change = ''
  where id = v_target;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (v_actor, 'Administrador alterou senha de usuario', 'usuario', v_target, '{}'::jsonb);
end;
$$;

revoke all on function public.admin_update_user_password_v2(text, text) from public;
grant execute on function public.admin_update_user_password_v2(text, text) to anon, authenticated;
