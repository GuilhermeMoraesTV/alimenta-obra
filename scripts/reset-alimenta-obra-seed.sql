begin;

set local statement_timeout = '120s';

alter table public.meal_requests disable trigger meal_requests_prevent_past_date;

do $$
declare
  v_admin uuid;
  v_forn_marmita uuid;
  v_forn_buffer uuid;
  v_forn_janta uuid;
  v_enc_campo1 uuid;
  v_enc_campo2 uuid;
  v_enc_canteiro1 uuid;
  v_enc_canteiro2 uuid;
  v_enc_escritorio uuid;
  v_supplier_marmita uuid;
  v_supplier_buffer uuid;
  v_supplier_janta uuid;
  v_campo_norte uuid;
  v_campo_sul uuid;
  v_canteiro_central uuid;
  v_canteiro_apoio uuid;
  v_escritorio uuid;
  v_date date;
  v_day int;
  v_status text;
  v_supplier record;
  v_request record;
  v_consolidation uuid;
begin
  select id into v_admin from public.profiles where lower(email) = 'admin@gmail.com' and role = 'admin' and active;
  select id into v_forn_marmita from public.profiles where lower(email) = 'fornecedor.marmita@alimentaobra.com';
  select id into v_forn_buffer from public.profiles where lower(email) = 'fornecedor.buffer@alimentaobra.com';
  select id into v_forn_janta from public.profiles where lower(email) = 'fornecedor.janta@alimentaobra.com';
  select id into v_enc_campo1 from public.profiles where lower(email) = 'encarregado.campo1@alimentaobra.com';
  select id into v_enc_campo2 from public.profiles where lower(email) = 'encarregado.campo2@alimentaobra.com';
  select id into v_enc_canteiro1 from public.profiles where lower(email) = 'encarregado.canteiro1@alimentaobra.com';
  select id into v_enc_canteiro2 from public.profiles where lower(email) = 'encarregado.canteiro2@alimentaobra.com';
  select id into v_enc_escritorio from public.profiles where lower(email) = 'encarregado.escritorio@alimentaobra.com';

  if v_admin is null
     or v_forn_marmita is null
     or v_forn_buffer is null
     or v_forn_janta is null
     or v_enc_campo1 is null
     or v_enc_campo2 is null
     or v_enc_canteiro1 is null
     or v_enc_canteiro2 is null
     or v_enc_escritorio is null then
    raise exception 'Usuarios esperados nao encontrados; crie-os pela Edge Function antes do seed.';
  end if;

  update public.profiles
     set name = 'Administrador',
         email = 'admin@gmail.com',
         role = 'admin',
         team = 'Administracao',
         active = true,
         updated_at = now()
   where id = v_admin;

  update public.profiles
     set active = true,
         updated_at = now()
   where id in (
     v_forn_marmita,
     v_forn_buffer,
     v_forn_janta,
     v_enc_campo1,
     v_enc_campo2,
     v_enc_canteiro1,
     v_enc_canteiro2,
     v_enc_escritorio
   );

  insert into public.meal_categories (id, label, can_record_actuals, active, sort_order)
  values
    ('marmita', 'Marmita', false, true, 10),
    ('buffet', 'Buffer', true, true, 20),
    ('janta', 'Janta', true, true, 30);

  insert into public.meal_types (name, description, unit_price, active, sort_order, category)
  values
    ('Marmita Simples', 'Arroz, feijao, proteina simples, salada e fruta.', 20.00, true, 101, 'marmita'),
    ('Marmita Executiva', 'Arroz, feijao, proteina premium, guarnicao, salada e sobremesa.', 23.50, true, 102, 'marmita'),
    ('Marmita Proteica', 'Base reforcada com dupla proteina e acompanhamentos leves.', 25.00, true, 103, 'marmita'),
    ('Buffer Padrao', 'Buffet operacional padrao para canteiro.', 21.90, true, 201, 'buffet'),
    ('Buffer Completo', 'Buffet completo com saladas, guarnicoes e duas proteinas.', 24.50, true, 202, 'buffet'),
    ('Buffer Especial', 'Buffet especial para equipes com maior demanda operacional.', 25.00, true, 203, 'buffet'),
    ('Janta Simples', 'Janta simples para encerramento de turno.', 20.50, true, 301, 'janta'),
    ('Janta Reforcada', 'Janta reforcada para equipes de campo e canteiro.', 23.00, true, 302, 'janta'),
    ('Janta Especial', 'Janta especial com proteina reforcada e acompanhamento extra.', 24.90, true, 303, 'janta');

  insert into public.meal_locations (meal_type_id, name, active, sort_order)
  select id, 'Operacional', true, 10
    from public.meal_types;

  insert into public.supplier_companies (
    legal_name,
    trade_name,
    cnpj,
    state_registration,
    municipal_registration,
    address_line,
    city,
    state,
    zip_code,
    phone,
    email,
    contact_name,
    bank_details,
    notes,
    active,
    legacy_profile_id,
    created_by
  )
  values
    (
      'Fornecedor Marmitas Ltda',
      'Fornecedor Marmitas',
      '11.111.111/0001-11',
      'ISENTO',
      'ISENTO',
      'Rua das Marmitas, 100',
      'Salvador',
      'BA',
      '40000-101',
      '(71) 91111-0101',
      'fornecedor.marmita@alimentaobra.com',
      'Responsavel Marmitas',
      'Banco Teste ag 0001 cc 2026-01',
      'Seed reset controlado 2026-08',
      true,
      v_forn_marmita,
      v_admin
    ),
    (
      'Fornecedor Buffer Ltda',
      'Fornecedor Buffer',
      '22.222.222/0001-22',
      'ISENTO',
      'ISENTO',
      'Rua do Buffer, 200',
      'Salvador',
      'BA',
      '40000-202',
      '(71) 92222-0202',
      'fornecedor.buffer@alimentaobra.com',
      'Responsavel Buffer',
      'Banco Teste ag 0002 cc 2026-02',
      'Seed reset controlado 2026-08',
      true,
      v_forn_buffer,
      v_admin
    ),
    (
      'Fornecedor Janta Ltda',
      'Fornecedor Janta',
      '33.333.333/0001-33',
      'ISENTO',
      'ISENTO',
      'Rua da Janta, 300',
      'Salvador',
      'BA',
      '40000-303',
      '(71) 93333-0303',
      'fornecedor.janta@alimentaobra.com',
      'Responsavel Janta',
      'Banco Teste ag 0003 cc 2026-03',
      'Seed reset controlado 2026-08',
      true,
      v_forn_janta,
      v_admin
    );

  select id into v_supplier_marmita from public.supplier_companies where email = 'fornecedor.marmita@alimentaobra.com';
  select id into v_supplier_buffer from public.supplier_companies where email = 'fornecedor.buffer@alimentaobra.com';
  select id into v_supplier_janta from public.supplier_companies where email = 'fornecedor.janta@alimentaobra.com';

  insert into public.supplier_company_users (supplier_company_id, user_id, active)
  values
    (v_supplier_marmita, v_forn_marmita, true),
    (v_supplier_buffer, v_forn_buffer, true),
    (v_supplier_janta, v_forn_janta, true);

  insert into public.supplier_meal_types (supplier_company_id, meal_type_id, active, unit_price, notes)
  select
    case mt.category
      when 'marmita' then v_supplier_marmita
      when 'buffet' then v_supplier_buffer
      when 'janta' then v_supplier_janta
    end,
    mt.id,
    true,
    mt.unit_price,
    'Preco de referencia do catalogo'
  from public.meal_types mt
  where mt.category in ('marmita', 'buffet', 'janta');

  insert into public.work_sections (name, headcount, leader_id, active, area_type)
  values
    ('Campo Norte', 28, v_enc_campo1, true, 'campo'),
    ('Campo Sul', 24, v_enc_campo2, true, 'campo'),
    ('Canteiro Central', 18, v_enc_canteiro1, true, 'canteiro'),
    ('Canteiro Apoio', 14, v_enc_canteiro2, true, 'canteiro'),
    ('Escritorio Administrativo', 9, v_enc_escritorio, true, 'escritorio');

  select id into v_campo_norte from public.work_sections where name = 'Campo Norte';
  select id into v_campo_sul from public.work_sections where name = 'Campo Sul';
  select id into v_canteiro_central from public.work_sections where name = 'Canteiro Central';
  select id into v_canteiro_apoio from public.work_sections where name = 'Canteiro Apoio';
  select id into v_escritorio from public.work_sections where name = 'Escritorio Administrativo';

  insert into public.work_section_meal_types (work_section_id, meal_type_id, active)
  select ws.id, mt.id, true
    from public.work_sections ws
    cross join public.meal_types mt
   where (
       ws.name in ('Campo Norte', 'Campo Sul')
       and mt.category in ('marmita', 'janta')
     )
      or (
       ws.name in ('Canteiro Central', 'Canteiro Apoio', 'Escritorio Administrativo')
       and mt.category in ('buffet', 'janta')
     );

  for v_date in
    select generate_series(date '2026-08-01', date '2026-08-07', interval '1 day')::date
  loop
    v_day := extract(day from v_date)::int;
    v_status := case v_date
      when date '2026-08-01' then 'enviado'
      when date '2026-08-02' then 'confirmado'
      when date '2026-08-03' then 'producao'
      when date '2026-08-04' then 'saiu_entrega'
      when date '2026-08-05' then 'entregue'
      when date '2026-08-06' then 'cancelamento_pendente'
      else 'cancelado_confirmado'
    end;

    for v_request in
      select * from (
        values
          (v_enc_campo1, v_campo_norte, 'Marmita Simples', v_supplier_marmita, 18 + v_day, 'Pedido principal Campo Norte'),
          (v_enc_campo1, v_campo_norte, 'Janta Simples', v_supplier_janta, 7 + (v_day % 3), 'Janta Campo Norte'),
          (v_enc_campo2, v_campo_sul, 'Marmita Executiva', v_supplier_marmita, 15 + v_day, 'Pedido principal Campo Sul'),
          (v_enc_campo2, v_campo_sul, 'Janta Reforcada', v_supplier_janta, 6 + (v_day % 4), 'Janta Campo Sul'),
          (v_enc_canteiro1, v_canteiro_central, 'Buffer Padrao', v_supplier_buffer, 12 + v_day, 'Pedido principal Canteiro Central'),
          (v_enc_canteiro1, v_canteiro_central, 'Janta Especial', v_supplier_janta, 5 + (v_day % 3), 'Janta Canteiro Central'),
          (v_enc_canteiro2, v_canteiro_apoio, 'Buffer Completo', v_supplier_buffer, 9 + v_day, 'Pedido principal Canteiro Apoio'),
          (v_enc_canteiro2, v_canteiro_apoio, 'Janta Reforcada', v_supplier_janta, 4 + (v_day % 3), 'Janta Canteiro Apoio'),
          (v_enc_escritorio, v_escritorio, 'Buffer Especial', v_supplier_buffer, 6 + v_day, 'Pedido principal Escritorio'),
          (v_enc_escritorio, v_escritorio, 'Janta Simples', v_supplier_janta, 3 + (v_day % 3), 'Janta Escritorio')
      ) as rows(leader_id, team_id, meal_name, supplier_company_id, quantity, note)
    loop
      insert into public.meal_requests (
        meal_date,
        meal_type_id,
        location_id,
        team_id,
        leader_id,
        quantity,
        status,
        notes,
        created_by,
        updated_by,
        supplier_company_id,
        origin_role,
        created_at,
        updated_at
      )
      select
        v_date,
        mt.id,
        ml.id,
        v_request.team_id,
        v_request.leader_id,
        v_request.quantity,
        case when v_status in ('entregue') then 'entregue' else 'enviado' end,
        v_request.note || ' - reset controlado',
        v_request.leader_id,
        v_admin,
        v_request.supplier_company_id,
        'encarregado',
        (v_date::timestamp + time '07:30') at time zone 'America/Bahia',
        (v_date::timestamp + time '08:00') at time zone 'America/Bahia'
      from public.meal_types mt
      join public.meal_locations ml on ml.meal_type_id = mt.id and ml.active
      where mt.name = v_request.meal_name
      order by ml.sort_order
      limit 1;
    end loop;

    for v_supplier in
      select * from (
        values
          (v_supplier_marmita, v_forn_marmita),
          (v_supplier_buffer, v_forn_buffer),
          (v_supplier_janta, v_forn_janta)
      ) as rows(supplier_company_id, supplier_user_id)
    loop
      insert into public.consolidations (
        meal_date,
        supplier_id,
        supplier_company_id,
        status,
        sent_at,
        created_by,
        created_at,
        updated_at
      )
      values (
        v_date,
        v_supplier.supplier_user_id,
        v_supplier.supplier_company_id,
        v_status,
        (v_date::timestamp + time '09:00') at time zone 'America/Bahia',
        v_admin,
        (v_date::timestamp + time '08:50') at time zone 'America/Bahia',
        (v_date::timestamp + time '11:30') at time zone 'America/Bahia'
      )
      returning id into v_consolidation;

      insert into public.consolidation_items (consolidation_id, meal_request_id)
      select v_consolidation, mr.id
      from public.meal_requests mr
      where mr.meal_date = v_date
        and mr.supplier_company_id = v_supplier.supplier_company_id
        and mr.status in ('enviado', 'entregue');

      if v_status in ('confirmado', 'producao', 'saiu_entrega', 'entregue', 'cancelamento_pendente', 'cancelado_confirmado') then
        insert into public.supplier_confirmations (consolidation_id, step, confirmed_by, confirmed_at, metadata)
        values (
          v_consolidation,
          'confirmado',
          v_supplier.supplier_user_id,
          (v_date::timestamp + time '09:30') at time zone 'America/Bahia',
          jsonb_build_object('seed', 'reset-controlado-2026-08')
        );
      end if;

      if v_status in ('producao') then
        insert into public.supplier_confirmations (consolidation_id, step, confirmed_by, confirmed_at, metadata)
        values (
          v_consolidation,
          'producao',
          v_supplier.supplier_user_id,
          (v_date::timestamp + time '10:20') at time zone 'America/Bahia',
          jsonb_build_object('seed', 'reset-controlado-2026-08')
        );
      end if;

      if v_status in ('saiu_entrega', 'entregue', 'cancelamento_pendente', 'cancelado_confirmado') then
        insert into public.supplier_confirmations (consolidation_id, step, confirmed_by, confirmed_at, metadata)
        values (
          v_consolidation,
          'saiu_entrega',
          v_supplier.supplier_user_id,
          (v_date::timestamp + time '11:15') at time zone 'America/Bahia',
          jsonb_build_object('seed', 'reset-controlado-2026-08')
        );
      end if;

      if v_status = 'entregue' then
        insert into public.supplier_confirmations (consolidation_id, step, confirmed_by, confirmed_at, metadata)
        values (
          v_consolidation,
          'entregue',
          v_supplier.supplier_user_id,
          (v_date::timestamp + time '12:20') at time zone 'America/Bahia',
          jsonb_build_object('seed', 'reset-controlado-2026-08')
        );
      end if;

      if v_status = 'cancelado_confirmado' then
        insert into public.supplier_confirmations (consolidation_id, step, confirmed_by, confirmed_at, metadata)
        values (
          v_consolidation,
          'cancelado_confirmado',
          v_supplier.supplier_user_id,
          (v_date::timestamp + time '12:20') at time zone 'America/Bahia',
          jsonb_build_object('seed', 'reset-controlado-2026-08', 'reason', 'Cancelamento confirmado no reset controlado')
        );
      end if;

      if v_status in ('producao', 'saiu_entrega', 'entregue', 'cancelamento_pendente', 'cancelado_confirmado') then
        insert into public.consolidation_actuals (
          consolidation_id,
          meal_date,
          team_id,
          meal_type_id,
          quantity,
          notes,
          recorded_by,
          recorded_at
        )
        select
          v_consolidation,
          v_date,
          mr.team_id,
          mr.meal_type_id,
          case
            when v_status in ('cancelamento_pendente', 'cancelado_confirmado') then 0
            when v_status = 'producao' then greatest(0, mr.quantity - 2)
            when v_status = 'saiu_entrega' and ws.area_type = 'canteiro' then mr.quantity + 1
            when v_status = 'saiu_entrega' then greatest(0, mr.quantity - 1)
            else mr.quantity
          end,
          case
            when v_status in ('cancelamento_pendente', 'cancelado_confirmado') then 'Consumo real zerado por cancelamento'
            when v_status = 'producao' then 'Consumo real parcial'
            when v_status = 'saiu_entrega' then 'Consumo real variando abaixo/acima do solicitado'
            else 'Consumo real preenchido'
          end,
          v_supplier.supplier_user_id,
          (v_date::timestamp + time '11:05') at time zone 'America/Bahia'
        from public.meal_requests mr
        join public.meal_types mt on mt.id = mr.meal_type_id
        join public.meal_categories mc on mc.id = mt.category
        join public.work_sections ws on ws.id = mr.team_id
        where mr.meal_date = v_date
          and mr.supplier_company_id = v_supplier.supplier_company_id
          and mc.can_record_actuals
          and mr.status in ('enviado', 'entregue');
      end if;
    end loop;
  end loop;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    v_admin,
    'Reset controlado executado',
    'seed',
    null,
    jsonb_build_object(
      'project_ref',
      'nahretmwgwuqjhhqwjpd',
      'periodo',
      '2026-08-01 a 2026-08-07',
      'admin_preservado',
      'admin@gmail.com',
      'usuarios_criados',
      8
    )
  );
end $$;

alter table public.meal_requests enable trigger meal_requests_prevent_past_date;

commit;
