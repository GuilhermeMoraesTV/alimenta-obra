create or replace function public.update_current_profile(
  p_name text,
  p_team text default ''
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := (select auth.uid());
  v_name text := trim(coalesce(p_name, ''));
  v_team text := nullif(trim(coalesce(p_team, '')), '');
begin
  if v_user_id is null then
    raise exception 'Sessao expirada. Entre novamente.';
  end if;

  if char_length(v_name) < 2 or char_length(v_name) > 120 then
    raise exception 'Informe um nome entre 2 e 120 caracteres.';
  end if;

  update public.profiles
  set name = v_name,
      team = v_team
  where id = v_user_id
  returning id into v_user_id;

  if v_user_id is null then
    raise exception 'Perfil nao encontrado.';
  end if;

  return v_user_id;
end;
$$;

revoke all on function public.update_current_profile(text, text) from public;
grant execute on function public.update_current_profile(text, text) to authenticated;
