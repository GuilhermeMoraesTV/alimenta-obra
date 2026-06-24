-- Carga de demonstracao idempotente para o AlimentaObra.
-- Execute depois das migracoes, em um ambiente de teste.
-- Preserva dados reais: remove apenas registros com a marca [DEMO].

begin;

-- Garante que a conta criada para testes do fornecedor seja utilizavel, se existir.
update public.profiles
set role = 'fornecedor', team = null
where email = 'marmitas@gmail.com';

delete from public.consolidations c
where exists (
  select 1 from public.consolidation_items ci
  join public.meal_requests mr on mr.id = ci.meal_request_id
  where ci.consolidation_id = c.id and mr.notes like '[DEMO]%'
)
and not exists (
  select 1 from public.consolidation_items ci
  join public.meal_requests mr on mr.id = ci.meal_request_id
  where ci.consolidation_id = c.id and mr.notes not like '[DEMO]%'
);
delete from public.meal_requests where notes like '[DEMO]%';
delete from public.delivery_addresses where label like '[DEMO]%';

with leaders as (
  select id, row_number() over (order by name) as position
  from public.profiles
  where active and role in ('encarregado', 'admin')
), addresses as (
  select id, leader_id, row_number() over (partition by leader_id order by label) as position
  from public.delivery_addresses
  where label like '[DEMO]%'
)
insert into public.delivery_addresses (leader_id, label, address_line, reference)
select
  id,
  '[DEMO] ' || case position % 3 when 1 then 'Frente Norte' when 2 then 'Base Central' else 'Frente Sul' end,
  case position % 3
    when 1 then 'Rua das Palmeiras, ' || (120 + position) || ' - Centro, Salvador - BA'
    when 2 then 'Avenida da Obra, ' || (480 + position) || ' - Industrial, Salvador - BA'
    else 'Estrada do Campo, km ' || (4 + position) || ' - Area Rural, Salvador - BA'
  end,
  'Endereco de demonstracao'
from leaders;

with leaders as (
  select id, row_number() over (order by name) as position
  from public.profiles
  where active and role in ('encarregado', 'admin')
), catalog as (
  select mt.id as meal_type_id, ml.id as location_id, row_number() over (order by mt.sort_order, ml.sort_order) as position
  from public.meal_types mt join public.meal_locations ml on ml.meal_type_id = mt.id
  where mt.active and ml.active
), addresses as (
  select distinct on (leader_id) id, leader_id
  from public.delivery_addresses where label like '[DEMO]%'
  order by leader_id, created_at
), template as (
  select * from (values
    (-3, 'entregue'), (-2, 'entregue'), (-1, 'entregue'), (0, 'enviado'),
    (1, 'enviado'), (2, 'rascunho'), (3, 'enviado')
  ) as t(day_offset, status)
)
insert into public.meal_requests (
  meal_date, meal_type_id, location_id, delivery_address_id, leader_id,
  quantity, status, notes, created_by, updated_by
)
select
  current_date + template.day_offset,
  catalog.meal_type_id,
  catalog.location_id,
  addresses.id,
  leaders.id,
  18 + ((leaders.position * 7 + catalog.position * 5 + template.day_offset + 20) % 55),
  template.status,
  '[DEMO] Pedido de teste ' || template.status || ' para validar o fluxo completo.',
  leaders.id,
  leaders.id
from leaders
cross join template
join catalog on catalog.position = ((leaders.position + template.day_offset + 30) % (select count(*) from catalog)) + 1
left join addresses on addresses.leader_id = leaders.id;

-- Cria consolidacoes e etapas em estados variados quando houver fornecedor cadastrado.
with supplier as (
  select id from public.profiles where active and role = 'fornecedor' order by created_at limit 1
), dates as (
  select distinct meal_date
  from public.meal_requests
  where notes like '[DEMO]%' and status in ('enviado', 'entregue')
)
insert into public.consolidations (meal_date, supplier_id, status, sent_at, created_by)
select
  dates.meal_date,
  supplier.id,
  case
    when dates.meal_date <= current_date - 2 then 'entregue'
    when dates.meal_date = current_date - 1 then 'saiu_entrega'
    when dates.meal_date = current_date then 'producao'
    else 'enviado'
  end,
  (dates.meal_date - 1)::timestamp at time zone 'America/Bahia' + time '17:20',
  supplier.id
from dates cross join supplier
on conflict (meal_date) do nothing;

insert into public.consolidation_items (consolidation_id, meal_request_id)
select c.id, mr.id
from public.consolidations c
join public.meal_requests mr on mr.meal_date = c.meal_date
where mr.notes like '[DEMO]%' and mr.status in ('enviado', 'entregue')
  and c.created_by = (select id from public.profiles where active and role = 'fornecedor' order by created_at limit 1)
on conflict do nothing;

with supplier as (
  select id from public.profiles where active and role = 'fornecedor' order by created_at limit 1
), steps as (
  select c.id as consolidation_id, c.meal_date, c.status, supplier.id as supplier_id, step.step
  from public.consolidations c
  cross join supplier
  cross join lateral unnest(case c.status
    when 'entregue' then array['confirmado', 'producao', 'saiu_entrega', 'entregue']
    when 'saiu_entrega' then array['confirmado', 'producao', 'saiu_entrega']
    when 'producao' then array['confirmado', 'producao']
    when 'confirmado' then array['confirmado']
    else array[]::text[]
  end) as step(step)
  where c.meal_date between current_date - 3 and current_date + 3
    and c.created_by = supplier.id
)
insert into public.supplier_confirmations (consolidation_id, step, confirmed_by, confirmed_at, metadata)
select consolidation_id, step, supplier_id,
  (meal_date::timestamp at time zone 'America/Bahia') + time '06:00',
  jsonb_build_object('source', 'demo')
from steps
on conflict (consolidation_id, step) do nothing;

commit;
