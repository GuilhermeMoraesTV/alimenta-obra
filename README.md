# AlimentaObra

## Configuracao atual com Supabase

O frontend agora usa Supabase Auth e PostgreSQL. Para concluir a conexao:

1. No SQL Editor do projeto Supabase, execute
   `supabase/migrations/20260620000100_initial_schema.sql`.
2. Copie `.env.example` para `.env.local`.
3. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. Crie os usuarios em **Authentication > Users**.
5. Edite e execute `database/promover-usuario.sql` para definir o administrador
   e o fornecedor.
6. Rode `npm install` e `npm run dev`.

Nunca coloque a chave `service_role` no frontend, no Git ou em variaveis
iniciadas com `VITE_`.

Validacao local:

```powershell
npm run check
npm run build
```

Protótipo completo de um aplicativo PWA para gestão de refeições em obras. O sistema centraliza pedidos dos encarregados, consolida a demanda para o administrador, envia o pedido ao fornecedor e registra confirmações com data, hora e usuário.

## Como abrir

Instale as dependências e inicie o servidor Vite:

```powershell
npm install
npm run dev
```

Depois acesse:

```text
http://127.0.0.1:5190
```

## Perfis do sistema

- Encarregado: cria, salva, envia, consulta, edita e cancela pedidos antes do limite.
- Administrador: acompanha dashboard, filtra pedidos, consolida, envia ao fornecedor e exporta relatórios.
- Fornecedor: recebe pedido consolidado e confirma recebimento, produção e saída para entrega.

## Estrutura

```text
assets/                 Icones PWA
database/schema.sql      Modelo inicial do banco centralizado
docs/                    Documentação funcional e técnica
src/app.js               Interface e fluxos do protótipo
src/data/seed.js         Dados iniciais de demonstração
src/services/store.js    Estado, regras, auditoria e consolidação
src/services/exports.js  Exportações de relatório
src/styles/app.css       Layout responsivo
service-worker.js        Cache offline do PWA
manifest.webmanifest     Instalação Android/iPhone/Web
```

## Recursos implementados no protótipo

- Login por perfil.
- Solicitação de refeição com data, tipo, quantidade e local.
- Regras de local por tipo de refeição.
- Histórico do encarregado.
- Dashboard administrativo com totais do dia.
- Filtros por data, encarregado e tipo.
- Consolidação automática por data.
- Envio ao fornecedor.
- Confirmação de recebimento, produção e saída para entrega.
- Registro de auditoria para ações relevantes.
- Fila de sincronização simulada para modo offline.
- Exportação de dados em CSV, Excel compatível, PDF via impressão e Word compatível.
- PWA com manifest e service worker.

## Próximos passos para produção

- Gerar `.xlsx`, `.pdf` e `.docx` nativos no backend.
- Enviar notificações push/e-mail/WhatsApp corporativo.
- Adicionar testes automatizados de regras de negócio.
