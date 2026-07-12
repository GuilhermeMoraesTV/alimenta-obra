create or replace function public.save_consolidation_actuals(
  p_consolidation_id uuid,
  p_actuals jsonb
) returns integer language plpgsql security definer set search_path = '' as $$
declare
  v_status text;
  v_date date;
  v_supplier uuid;
  v_count integer := 0;
  v_item jsonb;
  v_team_id uuid;
  v_meal_type_id uuid;
begin
  select status, meal_date, supplier_id into v_status, v_date, v_supplier
  from public.consolidations where id = p_consolidation_id for update;
  if not found then raise exception 'Bloco diario nao encontrado'; end if;
  if v_supplier <> auth.uid() and not public.is_admin() then raise exception 'Usuario nao autorizado'; end if;
  if v_status not in ('confirmado', 'producao', 'saiu_entrega') then
    raise exception 'Confirme o recebimento antes de registrar consumo real';
  end if;

  for v_item in select * from jsonb_array_elements(coalesce(p_actuals, '[]'::jsonb))
  loop
    v_team_id := nullif(v_item ->> 'team_id', '')::uuid;
    v_meal_type_id := nullif(v_item ->> 'meal_type_id', '')::uuid;

    if v_team_id is null
      or v_meal_type_id is null
      or not exists (select 1 from public.work_sections where id = v_team_id)
      or not exists (select 1 from public.meal_types where id = v_meal_type_id)
    then
      continue;
    end if;

    insert into public.consolidation_actuals (
      consolidation_id, meal_date, team_id, meal_type_id, quantity, recorded_by
    ) values (
      p_consolidation_id, v_date,
      v_team_id,
      v_meal_type_id,
      greatest(0, coalesce((v_item ->> 'quantity')::integer, 0)),
      auth.uid()
    )
    on conflict (consolidation_id, team_id, meal_type_id) do update
      set quantity = excluded.quantity,
          recorded_by = excluded.recorded_by,
          recorded_at = now();
    v_count := v_count + 1;
  end loop;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (auth.uid(), 'Consumo real registrado', 'consolidacao', p_consolidation_id,
    jsonb_build_object('rows', v_count));

  return v_count;
end;
$$;

grant execute on function public.save_consolidation_actuals(uuid, jsonb) to authenticated;
