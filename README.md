# AlimentaObra

Protótipo completo de um aplicativo PWA para gestão de refeições em obras. O sistema centraliza pedidos dos encarregados, consolida a demanda para o administrador, envia o pedido ao fornecedor e registra confirmações com data, hora e usuário.

## Como abrir

Como é um protótipo estático, você pode abrir `index.html` diretamente no navegador. Para testar o modo PWA/offline com service worker, rode um servidor local:

```powershell
npm run dev
```

Depois acesse:

```text
http://127.0.0.1:5190
```

## Perfis de demonstração

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

- Trocar `localStorage` por API com banco centralizado.
- Implementar autenticação real com permissões por perfil.
- Gerar `.xlsx`, `.pdf` e `.docx` nativos no backend.
- Enviar notificações push/e-mail/WhatsApp corporativo.
- Adicionar testes automatizados de regras de negócio.
