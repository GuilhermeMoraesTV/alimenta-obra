-- ESQUEMA LEGADO DO PROTOTIPO.
-- Nao execute este arquivo no Supabase.
-- Use supabase/migrations/20260620000100_initial_schema.sql.

-- ESQUEMA LEGADO DO PROTOTIPO.
-- Nao execute este arquivo no Supabase.
-- Use supabase/migrations/20260620000100_initial_schema.sql.

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null check (role in ('encarregado', 'admin', 'fornecedor')),
  team text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table meal_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active boolean not null default true
);

create table meal_locations (
  id uuid primary key default gen_random_uuid(),
  meal_type_id uuid not null references meal_types(id),
  name text not null,
  active boolean not null default true,
  unique (meal_type_id, name)
);

create table meal_requests (
  id uuid primary key default gen_random_uuid(),
  meal_date date not null,
  meal_type_id uuid not null references meal_types(id),
  location_id uuid not null references meal_locations(id),
  leader_id uuid not null references users(id),
  quantity integer not null check (quantity > 0),
  status text not null check (status in ('rascunho', 'enviado', 'cancelado', 'entregue')),
  notes text,
  created_by uuid not null references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table consolidations (
  id uuid primary key default gen_random_uuid(),
  meal_date date not null unique,
  supplier_id uuid not null references users(id),
  status text not null check (status in ('rascunho', 'enviado', 'confirmado', 'producao', 'saiu_entrega', 'entregue')),
  sent_at timestamptz,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table consolidation_items (
  id uuid primary key default gen_random_uuid(),
  consolidation_id uuid not null references consolidations(id) on delete cascade,
  meal_request_id uuid not null references meal_requests(id),
  unique (consolidation_id, meal_request_id)
);

create table supplier_confirmations (
  id uuid primary key default gen_random_uuid(),
  consolidation_id uuid not null references consolidations(id) on delete cascade,
  step text not null check (step in ('confirmado', 'producao', 'saiu_entrega')),
  confirmed_by uuid not null references users(id),
  confirmed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique (consolidation_id, step)
);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references users(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index meal_requests_date_idx on meal_requests(meal_date);
create index meal_requests_leader_idx on meal_requests(leader_id);
create index meal_requests_status_idx on meal_requests(status);
create index audit_log_created_at_idx on audit_log(created_at desc);

insert into meal_types (name) values
  ('Marmita Campo'),
  ('Buffer Almoco'),
  ('Jantar');
