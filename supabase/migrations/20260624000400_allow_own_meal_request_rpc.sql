create or replace function public.create_meal_request_as_user(
  p_leader_id uuid,
  p_meal_date date,
  p_meal_type_id uuid,
  p_location_id uuid,
  p_delivery_address_id uuid default null,
  p_quantity integer default 1,
  p_status text default 'enviado',
  p_notes text default ''
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_actor_id uuid := (select auth.uid());
  v_actor_role text := public.current_user_role();
begin
  if v_actor_id is null then
    raise exception 'Sessao expirada. Entre novamente.';
  end if;

  if p_status not in ('rascunho', 'enviado') then
    raise exception 'Status de pedido invalido';
  end if;

  if p_quantity <= 0 then
    raise exception 'A quantidade deve ser maior que zero';
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = p_leader_id
      and role = 'encarregado'
      and active
  ) then
    raise exception 'Encarregado invalido ou inativo';
  end if;

  if p_leader_id <> v_actor_id and v_actor_role <> 'admin' then
    raise exception 'Apenas administradores podem acessar outro usuario';
  end if;

  if p_leader_id = v_actor_id and v_actor_role not in ('encarregado', 'admin') then
    raise exception 'Seu perfil nao pode criar pedidos';
  end if;

  insert into public.meal_requests (
    meal_date, meal_type_id, location_id, delivery_address_id, leader_id,
    quantity, status, notes, created_by, updated_by
  ) values (
    p_meal_date, p_meal_type_id, p_location_id, p_delivery_address_id, p_leader_id,
    p_quantity, p_status, coalesce(p_notes, ''), v_actor_id, v_actor_id
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.create_meal_request_as_user(
  uuid, date, uuid, uuid, uuid, integer, text, text
) from public;

grant execute on function public.create_meal_request_as_user(
  uuid, date, uuid, uuid, uuid, integer, text, text
) to authenticated;
