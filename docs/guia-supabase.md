# Guia de integração com Supabase

O AlimentaObra ainda usa `localStorage` como fonte de dados. Para colocá-lo em
produção, a migração deve incluir banco PostgreSQL, autenticação, autorização
por perfil e substituição das operações locais pela API do Supabase.

## Situação atual

- `src/data/seed.js`: usuários e dados de demonstração.
- `src/services/store.js`: persistência no `localStorage`.
- `src/app.js`: login fictício e operações síncronas.
- `database/schema.sql`: modelo inicial, ainda sem Supabase Auth e RLS.
- `service-worker.js`: cache e sincronização apenas simulada.

## 1. Criar o projeto

1. Acesse <https://supabase.com/dashboard>.
2. Crie um projeto chamado `alimenta-obra`.
3. Guarde a senha do banco.
4. Em **Project Settings > API**, copie:
   - Project URL;
   - Publishable key, ou `anon key` em projetos antigos.

Nunca coloque a chave `service_role` no navegador ou no GitHub.

## 2. Instalar as dependências

O projeto atual é estático. Recomenda-se usar Vite:

```powershell
npm install @supabase/supabase-js
npm install -D vite
```

Scripts sugeridos no `package.json`:

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5190",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 5190",
    "check": "node --check src/app.js && node --check src/services/store.js"
  }
}
```

Crie `.env.local`:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
```

Adicione ao `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

## 3. Criar o cliente

Crie `src/services/supabase.js`:

```js
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("Configure as variáveis do Supabase no .env.local.");
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
```

## 4. Ajustar o banco

O `database/schema.sql` é um ponto de partida, mas precisa destes ajustes:

- substituir `users` por `profiles`;
- usar o mesmo UUID de `auth.users`;
- adicionar configurações operacionais;
- padronizar os status;
- ativar RLS em todas as tabelas;
- criar políticas diferentes para administrador, encarregado e fornecedor.

Estrutura recomendada para perfis:

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'encarregado'
    check (role in ('encarregado', 'admin', 'fornecedor')),
  team text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Crie automaticamente o perfil após o cadastro:

```sql
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email, role, team)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    'encarregado',
    new.raw_user_meta_data ->> 'team'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();
```

Todo cadastro público deve começar como `encarregado`. Administradores e
fornecedores devem ser promovidos por um administrador.

## 5. Ativar RLS

Exemplo:

```sql
alter table public.profiles enable row level security;
alter table public.meal_types enable row level security;
alter table public.meal_locations enable row level security;
alter table public.meal_requests enable row level security;
alter table public.consolidations enable row level security;
alter table public.consolidation_items enable row level security;
alter table public.supplier_confirmations enable row level security;
alter table public.audit_log enable row level security;
```

Função auxiliar:

```sql
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role
  from public.profiles
  where id = (select auth.uid())
    and active = true;
$$;
```

Política básica para pedidos:

```sql
create policy "read permitted requests"
on public.meal_requests
for select
to authenticated
using (
  leader_id = (select auth.uid())
  or public.current_user_role() = 'admin'
);

create policy "create own requests"
on public.meal_requests
for insert
to authenticated
with check (
  leader_id = (select auth.uid())
  and created_by = (select auth.uid())
);
```

Antes da produção, teste tentativas manuais de acessar pedidos de outro
encarregado e de alterar o próprio papel para `admin`.

## 6. Implementar autenticação

Cadastro:

```js
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { name, team }
  }
});
```

Login:

```js
const { error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

Logout:

```js
await supabase.auth.signOut();
```

Carregamento inicial:

```js
const {
  data: { session }
} = await supabase.auth.getSession();

if (session) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();
}
```

Remova o seletor de usuários e os botões de demonstração da tela de login.

## 7. Criar uma camada de banco

Centralize as consultas em `src/services/database.js`.

```js
import { supabase } from "./supabase.js";

export async function fetchRequests() {
  const { data, error } = await supabase
    .from("meal_requests")
    .select(`
      *,
      meal_types (id, name),
      meal_locations (id, name),
      profiles!meal_requests_leader_id_fkey (id, name, team)
    `)
    .order("meal_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createRequest(input, userId) {
  const { data, error } = await supabase
    .from("meal_requests")
    .insert({
      meal_date: input.date,
      meal_type_id: input.mealTypeId,
      location_id: input.locationId,
      quantity: Number(input.quantity),
      leader_id: userId,
      created_by: userId,
      updated_by: userId,
      status: input.status,
      notes: input.notes ?? ""
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

Use adaptadores para converter `snake_case` do banco para `camelCase` usado na
interface.

## 8. Consolidação e fornecedor

As operações abaixo devem ser funções PostgreSQL chamadas por `supabase.rpc()`:

- criar consolidação e respectivos itens;
- enviar consolidação;
- confirmar recebimento;
- confirmar produção;
- confirmar saída;
- registrar entrega.

Isso garante transações atômicas e impede estados incompletos. A sequência deve
ser validada pelo banco:

```text
enviado -> confirmado -> producao -> saiu_entrega -> entregue
```

Não deixe apenas o JavaScript validar essa ordem.

## 9. Offline

Implemente offline somente depois de estabilizar o fluxo online:

- use IndexedDB para a fila;
- adicione `client_operation_id` único;
- confirme a resposta do Supabase antes de marcar como sincronizado;
- trate reenvios de forma idempotente;
- não considere `navigator.onLine` uma confirmação de gravação.

O `localStorage` pode continuar guardando filtros e preferências, mas não deve
ser a fonte oficial de pedidos e usuários.

## 10. Usuários iniciais

Em **Authentication > Users**:

1. crie o administrador;
2. crie o fornecedor;
3. abra `profiles`;
4. altere o papel do primeiro para `admin`;
5. altere o segundo para `fornecedor`;
6. crie ou convide os encarregados.

Senhas pertencem ao Supabase Auth e nunca à tabela `profiles`.

## 11. Ordem de implementação

1. Criar projeto, variáveis, cliente e tabelas.
2. Implementar Auth e carregamento de perfil.
3. Migrar catálogo, pedidos e auditoria.
4. Migrar painel administrativo e consolidação.
5. Migrar fluxo do fornecedor.
6. Implementar Realtime e offline, se necessários.
7. Configurar domínio, SMTP, backups e monitoramento.

## 12. Testes obrigatórios

- encarregado vê apenas seus pedidos;
- administrador vê todos;
- fornecedor vê apenas consolidações atribuídas;
- cadastro público não escolhe `admin`;
- usuário não altera o próprio papel;
- sessão sobrevive ao recarregamento;
- logout remove acesso;
- consolidação não fica parcialmente gravada;
- fornecedor não pula etapas;
- dados persistem entre navegadores e dispositivos;
- nenhuma chave `service_role` aparece no frontend.

## Documentação oficial

- <https://supabase.com/docs/reference/javascript/introduction>
- <https://supabase.com/docs/guides/auth/passwords>
- <https://supabase.com/docs/guides/database/postgres/row-level-security>
- <https://supabase.com/docs/guides/local-development/cli/getting-started>
