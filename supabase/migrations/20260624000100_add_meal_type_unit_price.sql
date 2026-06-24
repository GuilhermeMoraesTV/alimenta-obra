-- Mantem o catalogo compativel com o modulo financeiro.
-- Seguro para projetos que ainda nao possuem a coluna.
alter table public.meal_types
  add column if not exists unit_price numeric(12, 2) not null default 0;

alter table public.meal_types
  drop constraint if exists meal_types_unit_price_nonnegative;

alter table public.meal_types
  add constraint meal_types_unit_price_nonnegative check (unit_price >= 0);
