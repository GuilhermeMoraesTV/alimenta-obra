# Configuracao do Supabase para o AlimentaObra

O codigo da integracao ja esta preparado. Para ligar o frontend ao seu projeto:

> Use um projeto Supabase exclusivo para o AlimentaObra. Nao reutilize o
> projeto `ConsultPrimer` (`htahirvnziszdpbepskt`), pois ele ja possui tabelas
> com nomes iguais e estruturas diferentes.

## 1. Aplicar o banco

No Supabase Dashboard, abra **SQL Editor > New query** e execute todo o arquivo:

```text
supabase/migrations/20260620000100_initial_schema.sql
```

Ele cria:

- perfis ligados ao Supabase Auth;
- tipos e locais de refeicao;
- pedidos;
- consolidacoes;
- confirmacoes do fornecedor;
- configuracoes;
- auditoria;
- indices;
- RLS e politicas;
- funcoes RPC atomicas;
- dados iniciais do catalogo;
- Realtime para as tabelas operacionais.

O arquivo `database/schema.sql` e apenas o modelo legado do prototipo.

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

Em **Authentication > Providers > Email**, mantenha e-mail e senha habilitados.
Durante o desenvolvimento, a confirmacao de e-mail pode ser desabilitada. Em
producao, use confirmacao e SMTP proprio.

## 4. Criar os usuarios iniciais

Crie em **Authentication > Users**:

1. administrador;
2. fornecedor;
3. encarregados.

Todos nascem como `encarregado` por seguranca. Edite os dois e-mails em
`database/promover-usuario.sql` e execute o arquivo no SQL Editor.

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
npm run check
npm run build
```

Teste com as tres funcoes:

- encarregado cria, envia e cancela os proprios pedidos;
- administrador ve todos, consolida e envia;
- fornecedor ve somente o pedido atribuido e confirma as etapas.

## Arquivos principais

- `src/services/supabase.js`: cliente e validacao das variaveis.
- `src/services/database.js`: Auth, consultas, RPC e Realtime.
- `src/services/store-v2.js`: estado visual e regras locais.
- `src/app.js`: interface conectada.
- `supabase/migrations/20260620000100_initial_schema.sql`: banco completo.
- `database/promover-usuario.sql`: promocao inicial dos perfis.
