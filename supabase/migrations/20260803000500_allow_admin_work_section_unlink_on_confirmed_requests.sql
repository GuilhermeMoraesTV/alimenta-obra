begin;

create or replace function public.prevent_confirmed_request_content_edit()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_content_changed boolean;
  v_allowed_unlink_id text := current_setting('app.allow_work_section_unlink', true);
  v_only_unlinking_section boolean;
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

  v_only_unlinking_section :=
    v_allowed_unlink_id = old.team_id::text
    and new.team_id is null
    and old.meal_date is not distinct from new.meal_date
    and old.meal_type_id is not distinct from new.meal_type_id
    and old.location_id is not distinct from new.location_id
    and old.quantity is not distinct from new.quantity
    and old.notes is not distinct from new.notes
    and old.delivery_address_id is not distinct from new.delivery_address_id;

  if v_only_unlinking_section then
    return new;
  end if;

  if exists (
    select 1
    from public.consolidation_items ci
    join public.consolidations c on c.id = ci.consolidation_id
    where ci.meal_request_id = old.id
      and (
        c.status in ('confirmado', 'producao', 'saiu_entrega', 'entregue', 'cancelamento_pendente', 'cancelado_confirmado')
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

create or replace function public.delete_work_section(
  p_id uuid
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_fk record;
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem excluir efetivos';
  end if;
  if not exists (select 1 from public.work_sections where id = p_id) then
    raise exception 'Efetivo nao encontrado';
  end if;

  perform set_config('app.allow_work_section_unlink', p_id::text, true);

  for v_fk in
    select
      format('%I.%I', ns.nspname, cls.relname) as table_name,
      att.attname as column_name,
      att.attnotnull as is_not_null
    from pg_constraint con
    join pg_class cls on cls.oid = con.conrelid
    join pg_namespace ns on ns.oid = cls.relnamespace
    join unnest(con.conkey) with ordinality key(attnum, ord) on true
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = key.attnum
    where con.contype = 'f'
      and con.confrelid = 'public.work_sections'::regclass
      and array_length(con.conkey, 1) = 1
  loop
    if v_fk.is_not_null then
      execute format('delete from %s where %I = $1', v_fk.table_name, v_fk.column_name) using p_id;
    else
      execute format('update %s set %I = null where %I = $1', v_fk.table_name, v_fk.column_name, v_fk.column_name) using p_id;
    end if;
  end loop;

  delete from public.work_sections
  where id = p_id;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Efetivo excluido', 'efetivo', p_id, jsonb_build_object('id', p_id));
  return p_id;
end;
$$;

revoke all on function public.delete_work_section(uuid) from public;
grant execute on function public.delete_work_section(uuid) to authenticated;

commit;
