create or replace function public.audit_new_request()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    new.created_by,
    case
      when new.created_by <> new.leader_id then 'Administrador criou pedido em nome de usuario'
      when new.status = 'enviado' then 'Pedido enviado'
      else 'Rascunho salvo'
    end,
    'pedido',
    new.id,
    jsonb_strip_nulls(jsonb_build_object(
      'status', new.status,
      'meal_date', new.meal_date,
      'represented_user_id',
      case when new.created_by <> new.leader_id then new.leader_id else null end
    ))
  );
  return new;
end;
$$;

create or replace function public.create_meal_request_as_user(
  p_leader_id uuid,
  p_meal_date date,
  p_meal_type_id uuid,
  p_location_id uuid,
  p_quantity integer,
  p_status text default 'enviado',
  p_notes text default ''
) returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem acessar outro usuario';
  end if;
  if p_status not in ('rascunho', 'enviado') then
    raise exception 'Status de pedido invalido';
  end if;
  if p_quantity <= 0 then
    raise exception 'A quantidade deve ser maior que zero';
  end if;
  if not exists (
    select 1 from public.profiles
    where id = p_leader_id and role = 'encarregado' and active
  ) then
    raise exception 'Encarregado invalido ou inativo';
  end if;

  insert into public.meal_requests (
    meal_date, meal_type_id, location_id, leader_id, quantity,
    status, notes, created_by, updated_by
  ) values (
    p_meal_date, p_meal_type_id, p_location_id, p_leader_id, p_quantity,
    p_status, coalesce(p_notes, ''), (select auth.uid()), (select auth.uid())
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.create_meal_request_as_user(
  uuid, date, uuid, uuid, integer, text, text
) from public;
grant execute on function public.create_meal_request_as_user(
  uuid, date, uuid, uuid, integer, text, text
) to authenticated;
