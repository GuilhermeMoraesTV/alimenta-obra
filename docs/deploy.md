# Deploy

## Visao geral

O AlimentaObra e uma SPA/PWA em Vite com React, Tailwind e Supabase. A publicacao envolve dois blocos:

1. frontend estatico gerado em `dist/`;
2. Supabase com Auth, tabelas, RLS, RPCs, Realtime e migrations aplicadas.

## Requisitos

- Node.js instalado.
- Dependencias instaladas com `npm install`.
- Projeto Supabase dedicado ao AlimentaObra.
- Variaveis de ambiente configuradas.
- Migrations aplicadas na ordem dos arquivos em `supabase/migrations/`.

## Variaveis

Criar `.env.local` a partir de `.env.example`:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
```

Usar somente chave publicavel no frontend. Nunca usar `service_role` em variaveis `VITE_`, no Git ou no bundle.

## Build local

Para validar a entrega completa:

```powershell
npm run ci
```

Para gerar build de producao:

```powershell
npm run build
```

O resultado fica em `dist/`.

## Publicacao do frontend

O projeto pode ser publicado em hospedagem estatica compat compativel com SPA/PWA, como GitHub Pages, Firebase Hosting, Netlify, Vercel ou outro servidor web.

Para publicacao com base padrao:

```powershell
npm run build
```

Para GitHub Pages no caminho `/alimenta-obra/`:

```powershell
npm run build:pages
```

Depois publicar o conteudo de `dist/` no provedor escolhido.

## Supabase

Antes de liberar o ambiente:

- aplicar todas as migrations em `supabase/migrations/`;
- conferir se Auth esta configurado para a URL final;
- adicionar a URL final em redirect/site URLs do Supabase;
- manter cadastro publico desligado, salvo decisao explicita;
- criar usuarios iniciais;
- promover perfis administrativos/fornecedor por rotina controlada;
- validar RLS e RPCs sensiveis.

## Migrations

Regras de manutencao:

- migrations ja aplicadas em producao nao devem ser editadas;
- qualquer alteracao de schema, RLS, indice, trigger ou RPC deve virar nova migration;
- aplicar em ordem cronologica;
- validar depois com usuarios dos tres perfis.

## Checklist rapido pos-deploy

- Abrir a URL publicada em janela anonima.
- Fazer login com usuario admin.
- Fazer login com usuario encarregado.
- Fazer login com usuario fornecedor.
- Criar e enviar pedido.
- Enviar bloco ao fornecedor.
- Confirmar etapas pelo fornecedor.
- Verificar relatorios, auditoria e exportacoes.
- Conferir se o PWA carrega assets, manifest e service worker sem erro.
