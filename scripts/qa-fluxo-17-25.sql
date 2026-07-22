begin;

create extension if not exists pgcrypto with schema extensions;

alter table public.meal_requests disable trigger meal_requests_prevent_past_date;

create or replace function pg_temp.ensure_qa_user(
  p_email text,
  p_password text,
  p_name text,
  p_role text,
  p_team text
) returns uuid
language plpgsql
as $fn$
declare
  v_id uuid;
begin
  select id into v_id from auth.users where email = lower(p_email) and deleted_at is null order by created_at limit 1;
  if v_id is null then
    v_id := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, is_sso_user, is_anonymous
    ) values (
      '00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated', lower(p_email),
      extensions.crypt(p_password, extensions.gen_salt('bf')),
      now(),
      jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
      jsonb_build_object('name', p_name, 'team', p_team),
      now(), now(), false, false
    );
  else
    update auth.users
    set encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        aud = 'authenticated',
        role = 'authenticated',
        raw_app_meta_data = jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
        raw_user_meta_data = jsonb_build_object('name', p_name, 'team', p_team),
        updated_at = now(),
        deleted_at = null,
        banned_until = null
    where id = v_id;
  end if;

  insert into auth.identities (
    id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), v_id::text, v_id,
    jsonb_build_object('sub', v_id::text, 'email', lower(p_email), 'email_verified', true, 'phone_verified', false),
    'email', now(), now(), now()
  )
  on conflict (provider_id, provider) do update
    set user_id = excluded.user_id,
        identity_data = excluded.identity_data,
        updated_at = now();

  insert into public.profiles (id, name, email, role, team, active)
  values (v_id, p_name, lower(p_email), p_role, p_team, true)
  on conflict (id) do update
    set name = excluded.name,
        email = excluded.email,
        role = excluded.role,
        team = excluded.team,
        active = true,
        updated_at = now();

  return v_id;
end;
$fn$;

do $$
declare
  v_label constant text := 'QA Fluxo 17-25';
  v_password constant text := 'admin123';
  v_admin uuid;
  v_lider_campo uuid;
  v_lider_canteiro uuid;
  v_lider_escritorio uuid;
  v_lider_noite uuid;
  v_fornecedor_marmita_user uuid;
  v_fornecedor_buffet_user uuid;
  v_fornecedor_janta_user uuid;
  v_marmita_company uuid;
  v_buffet_company uuid;
  v_janta_company uuid;
  v_marmita uuid;
  v_buffet uuid;
  v_janta uuid;
  v_marmita_location uuid;
  v_buffet_location uuid;
  v_janta_location uuid;
  v_campo_norte uuid;
  v_campo_sul uuid;
  v_canteiro uuid;
  v_escritorio uuid;
  v_noite uuid;
  v_consolidation uuid;
  v_request uuid;
  v_date date;
  v_status text;
  v_supplier_user uuid;
  v_supplier_company uuid;
  v_meal uuid;
  v_location uuid;
  v_actual_status text;
  v_actual_offset int;
  v_total_requested int;
  v_total_actual int;
  v_idx int;
  v_item record;
begin
  v_admin := pg_temp.ensure_qa_user('admin@admin.com', v_password, 'Admin QA Fluxo', 'admin', 'Administracao');
  v_lider_campo := pg_temp.ensure_qa_user('encarregado.campo@teste.com', v_password, 'Encarregado Campo Norte', 'encarregado', 'Campo Norte');
  v_lider_canteiro := pg_temp.ensure_qa_user('encarregado.canteiro@teste.com', v_password, 'Encarregado Canteiro', 'encarregado', 'Canteiro Central');
  v_lider_escritorio := pg_temp.ensure_qa_user('encarregado.escritorio@teste.com', v_password, 'Encarregado Escritorio', 'encarregado', 'Escritorio Administrativo');
  v_lider_noite := pg_temp.ensure_qa_user('encarregado.noite@teste.com', v_password, 'Encarregado Turno Noite', 'encarregado', 'Turno Noite');
  v_fornecedor_marmita_user := pg_temp.ensure_qa_user('fornecedor.marmita@teste.com', v_password, 'Login Marmitaria QA', 'fornecedor', 'Marmitaria QA');
  v_fornecedor_buffet_user := pg_temp.ensure_qa_user('fornecedor.buffet@teste.com', v_password, 'Login Buffet QA', 'fornecedor', 'Buffet QA');
  v_fornecedor_janta_user := pg_temp.ensure_qa_user('fornecedor.janta@teste.com', v_password, 'Login Janta QA', 'fornecedor', 'Janta QA');

  insert into public.supplier_companies (
    legal_name, trade_name, cnpj, state_registration, municipal_registration,
    address_line, city, state, zip_code, phone, email, contact_name, bank_details, notes, active, created_by
  )
  select *
  from (values
    ('QA Marmitaria Campo Ltda', 'QA Marmitaria Campo', '11.111.111/0001-11', 'ISENTO', 'ISENTO', 'Rua Campo, 17', 'Salvador', 'BA', '40000-117', '(71) 91111-1111', 'fornecedor.marmita@teste.com', 'Marina Marmita', 'Banco QA Marmita ag 0001 cc 1707', v_label, true, v_admin),
    ('QA Buffet Canteiro Ltda', 'QA Buffet Canteiro', '22.222.222/0001-22', 'ISENTO', 'ISENTO', 'Rua Canteiro, 25', 'Salvador', 'BA', '40000-225', '(71) 92222-2222', 'fornecedor.buffet@teste.com', 'Bruno Buffet', 'Banco QA Buffet ag 0002 cc 2507', v_label, true, v_admin),
    ('QA Janta Operacional Ltda', 'QA Janta Operacional', '33.333.333/0001-33', 'ISENTO', 'ISENTO', 'Rua Noite, 19', 'Salvador', 'BA', '40000-319', '(71) 93333-3333', 'fornecedor.janta@teste.com', 'Julia Janta', 'Banco QA Janta ag 0003 cc 1907', v_label, true, v_admin)
  ) as rows(legal_name, trade_name, cnpj, state_registration, municipal_registration, address_line, city, state, zip_code, phone, email, contact_name, bank_details, notes, active, created_by)
  where not exists (select 1 from public.supplier_companies sc where sc.email = rows.email);

  update public.supplier_companies
  set active = true,
      notes = v_label,
      updated_at = now()
  where email in ('fornecedor.marmita@teste.com', 'fornecedor.buffet@teste.com', 'fornecedor.janta@teste.com');

  select id into v_marmita_company from public.supplier_companies where email = 'fornecedor.marmita@teste.com' order by created_at desc limit 1;
  select id into v_buffet_company from public.supplier_companies where email = 'fornecedor.buffet@teste.com' order by created_at desc limit 1;
  select id into v_janta_company from public.supplier_companies where email = 'fornecedor.janta@teste.com' order by created_at desc limit 1;

  insert into public.supplier_company_users (supplier_company_id, user_id, active)
  values
    (v_marmita_company, v_fornecedor_marmita_user, true),
    (v_buffet_company, v_fornecedor_buffet_user, true),
    (v_janta_company, v_fornecedor_janta_user, true)
  on conflict (supplier_company_id, user_id) do update set active = true;

  insert into public.meal_types (name, description, active, sort_order, unit_price, category)
  select *
  from (values
    ('QA Marmita Campo 17-25', 'Arroz, feijao, proteina, salada e fruta para frente de campo', true, 901, 21.50::numeric, 'marmita'),
    ('QA Buffet Canteiro 17-25', 'Buffet operacional para canteiro e escritorio', true, 902, 34.90::numeric, 'buffet'),
    ('QA Janta Turno 17-25', 'Janta reforcada para turno da noite', true, 903, 26.75::numeric, 'janta')
  ) as rows(name, description, active, sort_order, unit_price, category)
  where not exists (select 1 from public.meal_types mt where mt.name = rows.name);

  update public.meal_types
  set active = true,
      description = case name
        when 'QA Marmita Campo 17-25' then 'Arroz, feijao, proteina, salada e fruta para frente de campo'
        when 'QA Buffet Canteiro 17-25' then 'Buffet operacional para canteiro e escritorio'
        when 'QA Janta Turno 17-25' then 'Janta reforcada para turno da noite'
        else description
      end,
      category = case name
        when 'QA Marmita Campo 17-25' then 'marmita'
        when 'QA Buffet Canteiro 17-25' then 'buffet'
        when 'QA Janta Turno 17-25' then 'janta'
        else category
      end
  where name in ('QA Marmita Campo 17-25', 'QA Buffet Canteiro 17-25', 'QA Janta Turno 17-25');

  select id into v_marmita from public.meal_types where name = 'QA Marmita Campo 17-25' order by sort_order limit 1;
  select id into v_buffet from public.meal_types where name = 'QA Buffet Canteiro 17-25' order by sort_order limit 1;
  select id into v_janta from public.meal_types where name = 'QA Janta Turno 17-25' order by sort_order limit 1;

  insert into public.meal_locations (meal_type_id, name, active, sort_order)
  values
    (v_marmita, 'Campo / Frente operacional', true, 1),
    (v_buffet, 'Canteiro / Escritorio', true, 1),
    (v_janta, 'Turno da noite', true, 1)
  on conflict (meal_type_id, name) do update set active = true;

  select id into v_marmita_location from public.meal_locations where meal_type_id = v_marmita and active order by sort_order limit 1;
  select id into v_buffet_location from public.meal_locations where meal_type_id = v_buffet and active order by sort_order limit 1;
  select id into v_janta_location from public.meal_locations where meal_type_id = v_janta and active order by sort_order limit 1;

  insert into public.supplier_meal_types (supplier_company_id, meal_type_id, active, unit_price, notes)
  values
    (v_marmita_company, v_marmita, true, 22.10, v_label),
    (v_buffet_company, v_buffet, true, 36.40, v_label),
    (v_janta_company, v_janta, true, 28.25, v_label)
  on conflict (supplier_company_id, meal_type_id) do update
    set active = true,
        unit_price = excluded.unit_price,
        notes = excluded.notes,
        updated_at = now();

  insert into public.work_sections (name, headcount, leader_id, active, area_type)
  select *
  from (values
    ('QA Campo Norte 17-25', 34, v_lider_campo, true, 'campo'),
    ('QA Campo Sul 17-25', 28, v_lider_campo, true, 'campo'),
    ('QA Canteiro Central 17-25', 18, v_lider_canteiro, true, 'canteiro'),
    ('QA Escritorio Obra 17-25', 11, v_lider_escritorio, true, 'escritorio'),
    ('QA Turno Noite 17-25', 16, v_lider_noite, true, 'misto')
  ) as rows(name, headcount, leader_id, active, area_type)
  where not exists (select 1 from public.work_sections ws where ws.name = rows.name);

  update public.work_sections
  set active = true,
      leader_id = case name
        when 'QA Campo Norte 17-25' then v_lider_campo
        when 'QA Campo Sul 17-25' then v_lider_campo
        when 'QA Canteiro Central 17-25' then v_lider_canteiro
        when 'QA Escritorio Obra 17-25' then v_lider_escritorio
        when 'QA Turno Noite 17-25' then v_lider_noite
        else leader_id
      end,
      updated_at = now()
  where name in ('QA Campo Norte 17-25', 'QA Campo Sul 17-25', 'QA Canteiro Central 17-25', 'QA Escritorio Obra 17-25', 'QA Turno Noite 17-25');

  select id into v_campo_norte from public.work_sections where name = 'QA Campo Norte 17-25' order by created_at desc limit 1;
  select id into v_campo_sul from public.work_sections where name = 'QA Campo Sul 17-25' order by created_at desc limit 1;
  select id into v_canteiro from public.work_sections where name = 'QA Canteiro Central 17-25' order by created_at desc limit 1;
  select id into v_escritorio from public.work_sections where name = 'QA Escritorio Obra 17-25' order by created_at desc limit 1;
  select id into v_noite from public.work_sections where name = 'QA Turno Noite 17-25' order by created_at desc limit 1;

  insert into public.work_section_meal_types (work_section_id, meal_type_id, active)
  values
    (v_campo_norte, v_marmita, true),
    (v_campo_sul, v_marmita, true),
    (v_canteiro, v_buffet, true),
    (v_escritorio, v_buffet, true),
    (v_noite, v_janta, true)
  on conflict (work_section_id, meal_type_id) do update set active = true;

  delete from public.consolidation_actuals where notes like v_label || '%'
    or consolidation_id in (
      select distinct ci.consolidation_id
      from public.consolidation_items ci
      join public.meal_requests mr on mr.id = ci.meal_request_id
      where mr.notes like v_label || '%'
  );
  delete from public.supplier_confirmations where consolidation_id in (
    select distinct ci.consolidation_id
    from public.consolidation_items ci
    join public.meal_requests mr on mr.id = ci.meal_request_id
    where mr.notes like v_label || '%'
  );
  delete from public.consolidation_items where meal_request_id in (
    select id from public.meal_requests where notes like v_label || '%'
  );
  delete from public.consolidations
  where supplier_company_id in (v_marmita_company, v_buffet_company, v_janta_company)
    and meal_date between date '2026-07-17' and date '2026-07-25'
    and created_by = v_admin;
  delete from public.meal_requests where notes like v_label || '%';

  for v_date in select generate_series(date '2026-07-17', date '2026-07-25', interval '1 day')::date loop
    v_idx := extract(day from v_date)::int - 16;

    for v_item in
      select * from (
        values
          (v_lider_campo, v_campo_norte, v_marmita, v_marmita_location, v_marmita_company, (26 + v_idx), 'encarregado', 'Campo Norte'),
          (v_lider_campo, v_campo_sul, v_marmita, v_marmita_location, v_marmita_company, (18 + (v_idx % 5)), 'encarregado', 'Campo Sul'),
          (v_lider_canteiro, v_canteiro, v_buffet, v_buffet_location, v_buffet_company, (12 + (v_idx % 4)), 'encarregado', 'Canteiro'),
          (null::uuid, v_escritorio, v_buffet, v_buffet_location, v_buffet_company, (8 + (v_idx % 3)), 'admin', 'Pedido admin escritorio'),
          (v_lider_noite, v_noite, v_janta, v_janta_location, v_janta_company, (10 + (v_idx % 6)), 'encarregado', 'Turno noite')
      ) as t(leader_id, team_id, meal_type_id, location_id, supplier_company_id, quantity, origin_role, note_suffix)
    loop
      if (v_item.note_suffix = 'Campo Sul' and v_idx in (2, 5, 8))
        or (v_item.note_suffix = 'Canteiro' and v_idx in (3, 7))
        or (v_item.note_suffix = 'Pedido admin escritorio' and v_idx in (1, 4, 6, 9))
        or (v_item.note_suffix = 'Turno noite' and v_idx in (2, 6))
      then
        continue;
      end if;

      insert into public.meal_requests (
        meal_date, meal_type_id, location_id, team_id, leader_id, quantity, status,
        notes, created_by, updated_by, supplier_company_id, origin_role, created_at, updated_at
      ) values (
        v_date, v_item.meal_type_id, v_item.location_id, v_item.team_id, v_item.leader_id, v_item.quantity,
        case when v_date = date '2026-07-25' and v_item.note_suffix = 'Campo Sul' then 'rascunho' else 'enviado' end,
        v_label || ' - ' || v_item.note_suffix,
        case when v_item.origin_role = 'admin' then v_admin else v_item.leader_id end,
        v_admin,
        v_item.supplier_company_id,
        v_item.origin_role,
        (v_date::timestamp + time '07:30') at time zone 'America/Bahia',
        (v_date::timestamp + time '08:10') at time zone 'America/Bahia'
      )
      returning id into v_request;
    end loop;

    for v_supplier_company, v_supplier_user, v_meal, v_actual_offset in
      select * from (
        values
          (v_marmita_company, v_fornecedor_marmita_user, v_marmita, case when v_idx % 3 = 0 then -2 else -1 end),
          (v_buffet_company, v_fornecedor_buffet_user, v_buffet, case when v_idx % 2 = 0 then -1 else 0 end),
          (v_janta_company, v_fornecedor_janta_user, v_janta, case when v_idx % 2 = 0 then -2 else -1 end)
      ) as s(supplier_company_id, supplier_user_id, meal_type_id, actual_offset)
    loop
      if not exists (
        select 1 from public.meal_requests
        where meal_date = v_date
          and supplier_company_id = v_supplier_company
          and meal_type_id = v_meal
          and status = 'enviado'
          and notes like v_label || '%'
      ) then
        continue;
      end if;

      v_actual_status := case
        when v_date <= date '2026-07-19' then 'entregue'
        when v_date between date '2026-07-20' and date '2026-07-21' then 'saiu_entrega'
        when v_date = date '2026-07-22' then 'confirmado'
        else 'enviado'
      end;

      insert into public.consolidations (
        meal_date, supplier_id, supplier_company_id, status, sent_at, created_by, created_at, updated_at
      ) values (
        v_date, v_supplier_user, v_supplier_company, v_actual_status,
        (v_date::timestamp + time '09:00') at time zone 'America/Bahia',
        v_admin,
        (v_date::timestamp + time '08:55') at time zone 'America/Bahia',
        (v_date::timestamp + time '11:30') at time zone 'America/Bahia'
      )
      returning id into v_consolidation;

      insert into public.consolidation_items (consolidation_id, meal_request_id)
      select v_consolidation, id
      from public.meal_requests
      where meal_date = v_date
        and supplier_company_id = v_supplier_company
        and meal_type_id = v_meal
        and status = 'enviado'
        and notes like v_label || '%';

      if v_actual_status in ('confirmado', 'saiu_entrega', 'entregue') then
        insert into public.supplier_confirmations (consolidation_id, step, confirmed_by, confirmed_at, metadata)
        values (
          v_consolidation, 'confirmado', v_supplier_user,
          (v_date::timestamp + time '09:30') at time zone 'America/Bahia',
          jsonb_build_object('qa', v_label)
        )
        on conflict do nothing;
      end if;

      if v_actual_status in ('saiu_entrega', 'entregue') then
        insert into public.supplier_confirmations (consolidation_id, step, confirmed_by, confirmed_at, metadata)
        values (
          v_consolidation, 'saiu_entrega', v_supplier_user,
          (v_date::timestamp + time '11:15') at time zone 'America/Bahia',
          jsonb_build_object('qa', v_label)
        )
        on conflict do nothing;

        insert into public.consolidation_actuals (
          consolidation_id, meal_date, team_id, meal_type_id, quantity, notes, recorded_by, recorded_at
        )
        select
          v_consolidation,
          v_date,
          mr.team_id,
          mr.meal_type_id,
          greatest(0, mr.quantity + v_actual_offset),
          v_label || ' - consumo real',
          v_supplier_user,
          (v_date::timestamp + time '11:10') at time zone 'America/Bahia'
        from public.meal_requests mr
        where mr.id in (select meal_request_id from public.consolidation_items where consolidation_id = v_consolidation)
        on conflict (consolidation_id, team_id, meal_type_id) do update
          set quantity = excluded.quantity,
              notes = excluded.notes,
              recorded_by = excluded.recorded_by,
              recorded_at = excluded.recorded_at;
      end if;

      if v_actual_status = 'entregue' then
        insert into public.supplier_confirmations (consolidation_id, step, confirmed_by, confirmed_at, metadata)
        values (
          v_consolidation, 'entregue', v_supplier_user,
          (v_date::timestamp + time '12:20') at time zone 'America/Bahia',
          jsonb_build_object('qa', v_label)
        )
        on conflict do nothing;
      end if;
    end loop;
  end loop;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    v_admin,
    'Carga QA criada',
    'qa_fluxo',
    null,
    jsonb_build_object('label', v_label, 'periodo', '2026-07-17 a 2026-07-25')
  );

  select count(*), coalesce(sum(quantity), 0)
    into v_idx, v_total_requested
  from public.meal_requests
  where notes like v_label || '%';

  select coalesce(sum(quantity), 0)
    into v_total_actual
  from public.consolidation_actuals
  where notes like v_label || '%';

  raise notice 'QA Fluxo 17-25 criado: % pedidos, % solicitadas, % consumidas reais', v_idx, v_total_requested, v_total_actual;
end;
$$;

alter table public.meal_requests enable trigger meal_requests_prevent_past_date;

commit;
