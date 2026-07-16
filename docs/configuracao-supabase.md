# Configuracao do Supabase para o AlimentaObra

O codigo da integracao esta preparado para um projeto Supabase dedicado ao AlimentaObra.

> Nao reutilize o projeto `ConsultPrimer` (`htahirvnziszdpbepskt`). Ele possui tabelas com nomes semelhantes e estruturas diferentes.

## 1. Aplicar o banco

Aplique as migracoes de `supabase/migrations/` em ordem cronologica. Elas criam e evoluem:

- perfis ligados ao Supabase Auth;
- catalogo de refeicoes;
- equipes/trechos e enderecos;
- pedidos;
- consolidacoes;
- confirmacoes do fornecedor;
- consumo real;
- relatorios diarios;
- configuracoes;
- auditoria;
- indices;
- RLS e politicas;
- funcoes RPC atomicas;
- Realtime para tabelas operacionais.

`database/schema.sql` e material historico de apoio. Para entrega e manutencao, use as migracoes em `supabase/migrations/`.

## 2. Configurar o frontend

Copie:

```text
.env.example
```

para:

```text
.env.local
```

Preencha com os valores de **Project Settings > API**:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
```

Use a chave publicavel. Nunca use `service_role`.

## 3. Configurar Auth

Em **Authentication > URL Configuration**:

```text
Site URL: http://127.0.0.1:5190
Redirect URL: http://127.0.0.1:5190/**
```

Depois adicione tambem a URL de producao quando publicar.

Para entrega a cliente, mantenha cadastro publico desligado e crie/convide usuarios de forma controlada pelo painel do Supabase ou por rotina administrativa.

## 4. Criar usuarios iniciais

Crie em **Authentication > Users**:

1. administrador;
2. fornecedor;
3. encarregados.

Todos devem nascer sem privilegio administrativo. Promova os dois primeiros perfis com os scripts administrativos em `database/` ou por rotina validada de administracao.

## 5. Iniciar

```powershell
npm install
npm run dev
```

Abra:

```text
http://127.0.0.1:5190
```

## 6. Validar

```powershell
npm run ci
```

Teste com as tres funcoes:

- encarregado cria, envia e cancela os proprios pedidos dentro das regras;
- administrador ve todos, consolida, envia, audita e exporta;
- fornecedor ve somente o pedido atribuido e confirma as etapas.

## Arquivos principais

- `src/services/supabase.js`: cliente e validacao das variaveis.
- `src/services/database.js`: Auth, consultas, RPC e Realtime.
- `src/services/store-v2.js`: estado visual e regras locais.
- `src/pages/`: telas por perfil.
- `src/app.js`: orquestracao da SPA.
- `supabase/migrations/`: schema, RLS, RPCs e evolucoes do banco.
- `database/`: scripts administrativos e historico de apoio.
