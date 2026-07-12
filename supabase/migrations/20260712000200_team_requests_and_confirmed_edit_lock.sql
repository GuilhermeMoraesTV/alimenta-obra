create or replace function public.create_meal_request_as_user(
  p_leader_id uuid,
  p_meal_date date,
  p_meal_type_id uuid,
  p_location_id uuid default null,
  p_team_id uuid default null,
  p_quantity integer default 1,
  p_status text default 'enviado',
  p_notes text default ''
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_actor_id uuid := (select auth.uid());
  v_actor_role text := public.current_user_role();
  v_location_id uuid := p_location_id;
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

  if p_meal_date < current_date then
    raise exception 'Nao e permitido criar pedido para data passada';
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

  if p_team_id is not null and not exists (
    select 1
    from public.work_sections
    where id = p_team_id
      and active
      and (leader_id is null or leader_id = p_leader_id)
  ) then
    raise exception 'Equipe ou trecho invalido para este encarregado';
  end if;

  if v_location_id is null then
    select ml.id into v_location_id
    from public.meal_locations ml
    where ml.meal_type_id = p_meal_type_id
      and ml.active
    order by ml.sort_order, ml.name
    limit 1;
  end if;

  if v_location_id is null then
    raise exception 'Tipo de alimentacao sem local tecnico cadastrado';
  end if;

  insert into public.meal_requests (
    meal_date, meal_type_id, location_id, team_id, leader_id,
    quantity, status, notes, created_by, updated_by
  ) values (
    p_meal_date, p_meal_type_id, v_location_id, p_team_id, p_leader_id,
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

create or replace function public.prevent_confirmed_request_content_edit()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_content_changed boolean;
begin
  v_content_changed :=
    old.meal_date is distinct from new.meal_date
    or old.meal_type_id is distinct from new.meal_type_id
    or old.location_id is distinct from new.location_id
    or old.team_id is distinct from new.team_id
    or old.quantity is distinct from new.quantity
    or old.notes is distinct from new.notes
    or old.delivery_address_id is distinct from new.delivery_address_id;

  if not v_content_changed then
    return new;
  end if;

  if exists (
    select 1
    from public.consolidation_items ci
    join public.consolidations c on c.id = ci.consolidation_id
    where ci.meal_request_id = old.id
      and (
        c.status in ('confirmado', 'producao', 'saiu_entrega', 'entregue')
        or exists (
          select 1
          from public.supplier_confirmations sc
          where sc.consolidation_id = c.id
            and sc.step = 'confirmado'
        )
      )
  ) then
    raise exception 'Edicao bloqueada: fornecedor ja confirmou o recebimento deste bloco';
  end if;

  return new;
end;
$$;

drop trigger if exists meal_requests_block_confirmed_content_edit on public.meal_requests;
create trigger meal_requests_block_confirmed_content_edit
before update on public.meal_requests
for each row execute function public.prevent_confirmed_request_content_edit();
