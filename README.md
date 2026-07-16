# AlimentaObra

Sistema PWA para gestao de refeicoes em obras. O AlimentaObra centraliza pedidos dos encarregados, consolida a demanda para o administrador, envia o pedido ao fornecedor e registra confirmacoes com data, hora e usuario.

## Configuracao com Supabase

O frontend usa Supabase Auth, PostgreSQL, RLS, RPCs transacionais e Realtime.

1. Crie um projeto Supabase exclusivo para o AlimentaObra.
2. Aplique as migracoes em `supabase/migrations/` na ordem dos arquivos.
3. Copie `.env.example` para `.env.local`.
4. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
5. Crie ou convide os usuarios iniciais pelo Supabase Auth.
6. Promova os perfis iniciais com os scripts administrativos em `database/`.
7. Rode `npm install` e `npm run dev`.

Nunca coloque a chave `service_role` no frontend, no Git ou em variaveis iniciadas com `VITE_`.

Validacao local:

```powershell
npm run ci
```

## Como abrir

```powershell
npm install
npm run dev
```

Depois acesse:

```text
http://127.0.0.1:5190
```

## Perfis do sistema

- Encarregado: cria, salva, envia, consulta, edita e cancela pedidos enquanto a regra operacional permite.
- Administrador: acompanha dashboard, filtra pedidos, consolida, envia ao fornecedor, audita eventos e exporta relatorios.
- Fornecedor: recebe pedidos consolidados, confirma etapas operacionais e registra consumo real.

## Estrutura

```text
assets/                         Icones, logo e recursos PWA
database/                       Scripts administrativos e apoio operacional
docs/                           Documentacao funcional, arquitetura e Supabase
src/app.js                      Orquestracao da SPA, eventos globais e integracao das telas
src/components/                 Shell, login, icones e componentes compartilhados
src/core/navigation.js          Menus, rotulos e navegacao por perfil
src/features/                   Regras de dominio e metricas reutilizaveis
src/pages/admin/                Telas do administrador
src/pages/encarregado/          Telas do encarregado
src/pages/fornecedor/           Telas do fornecedor
src/services/database.js        Auth, consultas, RPCs, Realtime e adaptadores Supabase
src/services/store-v2.js        Estado derivado e regras locais de interface
src/services/exports.js         Exportacoes PDF, Excel, Word e romaneios
src/styles/app.css              Layout responsivo e linguagem visual
supabase/migrations/            Schema, RLS, funcoes RPC e evolucoes do banco
service-worker.js               Cache PWA em producao
manifest.webmanifest            Instalacao Android, iPhone e Web
```

`src/data/seed.js`, `src/services/store.js` e `database/schema.sql` ficam apenas como historico/apoio legado. A base atual do produto e Supabase + `store-v2`.

## Recursos implementados

- Login por Supabase Auth e carregamento de perfil.
- Pedidos por data, tipo de refeicao, quantidade, equipe/trecho e observacao.
- Regras de edicao, cancelamento e bloqueio apos confirmacao do fornecedor.
- Consolidacao diaria com blocos extras quando a data ja foi confirmada.
- Fluxo do fornecedor com confirmacao de recebimento, producao, saida/entrega e consumo real.
- Auditoria de acoes relevantes.
- Dashboard administrativo, relatorios, financeiro, romaneios e exportacoes.
- PWA com manifest, cache de assets e layout responsivo por perfil.

## Scripts

```powershell
npm run lint
npm run format:check
npm run test
npm run build
npm run ci
```

`npm run format` normaliza arquivos de texto acompanhados pelo projeto.
