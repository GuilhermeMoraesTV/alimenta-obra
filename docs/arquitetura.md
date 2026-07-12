# Arquitetura

## Camadas atuais

- Entrada da SPA: `src/app.js` inicializa estado, autenticação, eventos globais e renderização principal.
- Roteamento por pagina: `src/pages/` agrupa as telas por perfil (`admin`, `encarregado` e `fornecedor`) e monta o registro usado pelo app.
- Configuração de navegação: `src/core/navigation.js` centraliza menus por perfil, rótulos de status e nomes de telas.
- Componentes compartilhados: `src/components/` guarda shell da aplicação, login, helpers visuais e ícones.
- Utilitários: `src/utils/` guarda formatação de data, dinheiro e escape de HTML.
- Dados iniciais: `src/data/seed.js` centraliza usuários, tipos de refeição e pedidos de demonstração.
- Regras e estado: `src/services/store-v2.js` contem o estado derivado atual; `src/services/store.js` preserva a camada local legada.
- Banco/Supabase: `src/services/database.js` concentra auth, consultas, mutações e inscrições realtime; `src/services/supabase.js` cria o client.
- Exportação: `src/services/exports.js` gera CSV, Excel, PDF, Word e romaneios.
- Estilos: `src/styles/app.css` concentra a linguagem visual da aplicação.
- Offline/PWA: `service-worker.js` faz cache dos arquivos principais.

## Estrutura de pastas

```text
src/
  app.js
  components/
    app-shell.js
    auth.js
    icons.js
    shared-ui.js
  core/
    navigation.js
  data/
    seed.js
  pages/
    admin.js
    encarregado.js
    fornecedor.js
    index.js
    settings.js
  features/
    meals/
      domain.js
    operations/
      metrics.js
  services/
    database.js
    exports.js
    store-v2.js
    store.js
    supabase.js
  styles/
    app.css
  utils/
    formatters.js
```

## Direção da refatoração

As telas de `encarregado` e `configuracoes` já foram movidas para `src/pages/`. O `src/app.js` ainda preserva orquestração, eventos globais, modais e algumas telas administrativas/fornecedor para evitar quebra funcional durante a separação. A partir desta base, novas telas devem nascer em `src/pages/` ou em subpastas por funcionalidade, e código compartilhado deve ir para `src/components/`, `src/core/`, `src/features/`, `src/services/` ou `src/utils/`.

## Arquitetura para produção

```mermaid
flowchart LR
  A["App Web/PWA"] --> B["Supabase"]
  B --> C["Postgres"]
  B --> D["Auth"]
  B --> E["Realtime"]
  B --> F["Storage"]
  A --> G["Exportadores locais"]
```

## Banco centralizado

As migrações em `supabase/migrations/` são a fonte principal do schema em produção. A pasta `database/` preserva scripts auxiliares e históricos de carga/promoção.

## Offline e sincronização

No produto final:

- O app grava ações em IndexedDB quando offline.
- Cada acao recebe um `client_operation_id`.
- Ao voltar internet, o app envia a fila para o backend.
- O backend aplica operações de forma idempotente.
- Conflitos são resolvidos por regra de status e horário limite.
