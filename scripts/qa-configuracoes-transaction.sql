begin;

do $$
declare
  v_admin uuid;
  v_supplier uuid;
  v_meal uuid;
  v_section uuid;
  v_invite text := 'codex-qa-token-' || md5(clock_timestamp()::text || random()::text);
begin
  select id into v_admin
  from public.profiles
  where email = 'admin@gmail.com' and role = 'admin' and active = true
  limit 1;

  if v_admin is null then
    raise exception 'Admin admin@gmail.com nao encontrado ou inativo';
  end if;

  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);

  perform public.create_access_invite(v_invite, 'fornecedor', 'codex.qa.sql@alimentaobra.local', 'QA SQL', 7);

  v_supplier := public.upsert_supplier_company(
    null,
    'Codex QA Fornecedor SQL',
    'Codex QA Restaurante SQL',
    '',
    '',
    '',
    'Rua QA, 100',
    'Salvador',
    'BA',
    '40000-000',
    '(71) 99999-0000',
    'codex.qa.fornecedor.sql@alimentaobra.local',
    'Contato QA',
    'Banco QA',
    'Teste transacional Codex',
    true
  );

  if not exists (select 1 from public.supplier_companies where id = v_supplier and trade_name = 'Codex QA Restaurante SQL') then
    raise exception 'Fornecedor nao foi criado corretamente';
  end if;

  perform public.upsert_supplier_company(
    v_supplier,
    'Codex QA Fornecedor SQL',
    'Codex QA Restaurante SQL Editado',
    '',
    '',
    '',
    'Rua QA, 101',
    'Salvador',
    'BA',
    '40000-001',
    '(71) 99999-0001',
    'codex.qa.fornecedor.sql.editado@alimentaobra.local',
    'Contato QA Editado',
    'Banco QA',
    'Teste transacional Codex editado',
    true
  );

  if not exists (select 1 from public.supplier_companies where id = v_supplier and trade_name = 'Codex QA Restaurante SQL Editado') then
    raise exception 'Fornecedor nao foi editado corretamente';
  end if;

  v_meal := public.upsert_meal_type_catalog(
    null,
    'Codex QA Refeicao SQL',
    'Arroz, feijao, proteina e salada',
    19.75,
    true,
    'marmita'
  );

  perform public.upsert_meal_type_catalog(
    v_meal,
    'Codex QA Refeicao SQL Editada',
    'Arroz, feijao, proteina, salada e fruta',
    21.50,
    true,
    'marmita'
  );

  if not exists (select 1 from public.meal_types where id = v_meal and name = 'Codex QA Refeicao SQL Editada' and category = 'marmita') then
    raise exception 'Refeicao nao foi criada/editada corretamente';
  end if;

  perform public.upsert_supplier_meal_type(v_supplier, v_meal, true, 22.25, 'Vinculo QA ativo');

  if not exists (select 1 from public.supplier_meal_types where supplier_company_id = v_supplier and meal_type_id = v_meal and active = true and unit_price = 22.25) then
    raise exception 'Vinculo fornecedor-refeicao nao foi salvo corretamente';
  end if;

  v_section := public.upsert_work_section(
    null,
    'Codex QA Equipe SQL',
    12,
    null,
    true,
    'campo',
    array[v_meal]
  );

  if not exists (select 1 from public.work_sections where id = v_section and name = 'Codex QA Equipe SQL' and area_type = 'campo') then
    raise exception 'Efetivo nao foi criado corretamente';
  end if;

  if not exists (select 1 from public.work_section_meal_types where work_section_id = v_section and meal_type_id = v_meal and active = true) then
    raise exception 'Vinculo efetivo-refeicao nao foi salvo corretamente';
  end if;

  perform public.upsert_supplier_company_user(v_supplier, v_admin, true);

  if not exists (select 1 from public.supplier_company_users where supplier_company_id = v_supplier and user_id = v_admin and active = true) then
    raise exception 'Vinculo login-fornecedor nao foi salvo corretamente';
  end if;

  raise notice 'QA configuracoes OK: supplier=%, meal=%, section=%, invite=%', v_supplier, v_meal, v_section, v_invite;
end $$;

rollback;
