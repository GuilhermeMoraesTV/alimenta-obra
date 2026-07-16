# Guia de integracao com Supabase

O AlimentaObra ja possui a camada de integracao com Supabase. Este documento descreve a manutencao do produto atual.

## Situacao atual

- `src/services/supabase.js`: cliente Supabase e validacao das variaveis `VITE_`.
- `src/services/database.js`: Auth, consultas, RPCs, adaptadores e Realtime.
- `src/services/store-v2.js`: estado visual, filtros e regras locais de interface.
- `src/pages/`: telas por perfil conectadas aos dados carregados do banco.
- `supabase/migrations/`: schema, RLS, funcoes RPC e evolucoes incrementais.
- `service-worker.js`: cache dos arquivos publicos da aplicacao em producao.

Arquivos como `src/data/seed.js`, `src/services/store.js` e os SQLs em `docs/legacy/database/` sao historico legado e nao devem orientar novas entregas.

## 1. Projeto e variaveis

Use um projeto Supabase exclusivo para o AlimentaObra. Em **Project Settings > API**, copie:

- Project URL;
- Publishable key, ou `anon key` em projetos antigos.

Crie `.env.local` a partir de `.env.example`:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
```

Nunca coloque a chave `service_role` no navegador, no GitHub ou em variaveis iniciadas com `VITE_`.

## 2. Banco e migracoes

Aplique as migracoes de `supabase/migrations/` na ordem dos nomes dos arquivos. Elas mantem:

- perfis ligados ao Supabase Auth;
- catalogo de refeicoes;
- equipes/trechos e enderecos de entrega;
- pedidos e consolidacoes;
- confirmacoes do fornecedor;
- consumo real e relatorios diarios;
- auditoria;
- RLS e politicas por perfil;
- RPCs transacionais para operacoes criticas.

Qualquer mudanca de schema, permissao, RLS ou RPC deve entrar como nova migracao. Nao edite uma migracao ja aplicada em producao.

## 3. Auth e cadastro

Para entrega a cliente, mantenha cadastro publico desligado no Supabase e crie/convide usuarios pelo painel administrativo do projeto. Todos os perfis devem nascer sem privilegio administrativo; administradores e fornecedores sao promovidos por rotina controlada.

Em ambiente local, `supabase/config.toml` tambem deve refletir essa politica:

```toml
[auth]
enable_signup = false

[auth.email]
enable_signup = false
```

## 4. Permissoes sensiveis

RPCs administrativas devem ser concedidas somente para `authenticated`, com validacao interna de perfil no banco. Exemplo de padrao:

```sql
revoke all on function public.admin_update_user_password_v2(text, text) from public;
revoke execute on function public.admin_update_user_password_v2(text, text) from anon;
grant execute on function public.admin_update_user_password_v2(text, text) to authenticated;
```

Mesmo com `security definer`, a funcao precisa checar `auth.uid()` e `public.is_admin()` antes de executar qualquer acao sensivel.

## 5. Validacao local

```powershell
npm run ci
```

O `ci` local executa verificacao sintatica, formatacao, testes de regras e build de producao.

## 6. Testes obrigatorios antes de entrega

- Encarregado ve apenas o proprio escopo operacional.
- Administrador ve todos os pedidos, consolidacoes, auditoria e relatorios.
- Fornecedor ve apenas os blocos atribuidos ao seu fluxo.
- Usuario comum nao consegue alterar papel, senha de terceiros ou dados de outro perfil.
- RPC administrativa nao esta concedida para `anon`.
- Cadastro publico esta desligado, salvo decisao explicita do cliente.
- Consolidacao nao fica parcialmente gravada.
- Fornecedor nao pula etapas.
- Nenhuma chave `service_role` aparece no frontend, no Git ou nos bundles.

## Documentacao oficial

- <https://supabase.com/docs/reference/javascript/introduction>
- <https://supabase.com/docs/guides/auth/passwords>
- <https://supabase.com/docs/guides/database/postgres/row-level-security>
- <https://supabase.com/docs/guides/local-development/cli/getting-started>
