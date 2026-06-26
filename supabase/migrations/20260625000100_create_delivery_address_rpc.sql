create or replace function public.create_delivery_address_as_user(
  p_leader_id uuid,
  p_label text,
  p_address_line text,
  p_reference text default ''
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_actor_id uuid := (select auth.uid());
  v_actor_role text := public.current_user_role();
  v_label text := trim(coalesce(p_label, ''));
  v_address_line text := trim(coalesce(p_address_line, ''));
  v_reference text := trim(coalesce(p_reference, ''));
begin
  if v_actor_id is null then
    raise exception 'Sessao expirada. Entre novamente.';
  end if;

  if char_length(v_label) < 2 or char_length(v_label) > 80 then
    raise exception 'Informe um nome de endereco entre 2 e 80 caracteres.';
  end if;

  if char_length(v_address_line) < 5 or char_length(v_address_line) > 240 then
    raise exception 'Informe o endereco completo entre 5 e 240 caracteres.';
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = p_leader_id
      and role = 'encarregado'
      and active
  ) then
    raise exception 'Encarregado invalido ou inativo.';
  end if;

  if p_leader_id <> v_actor_id and v_actor_role <> 'admin' then
    raise exception 'Apenas administradores podem cadastrar endereco para outro usuario.';
  end if;

  if p_leader_id = v_actor_id and v_actor_role not in ('encarregado', 'admin') then
    raise exception 'Seu perfil nao pode cadastrar enderecos.';
  end if;

  insert into public.delivery_addresses (
    leader_id, label, address_line, reference
  ) values (
    p_leader_id, v_label, v_address_line, v_reference
  )
  returning id into v_id;

  return jsonb_build_object('id', v_id, 'label', v_label);
exception
  when unique_violation then
    raise exception 'Ja existe um endereco com esse nome para este encarregado.';
end;
$$;

revoke all on function public.create_delivery_address_as_user(uuid, text, text, text) from public;
grant execute on function public.create_delivery_address_as_user(uuid, text, text, text) to authenticated;
