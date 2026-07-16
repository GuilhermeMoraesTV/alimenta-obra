# AlimentaObra

> PWA operacional para controle de refeicoes em obras, conectando encarregados,
> administracao e fornecedor em um fluxo unico, auditavel e pronto para
> demonstracao.

![Status](https://img.shields.io/badge/status-entregavel-1f7a4d)
![Stack](https://img.shields.io/badge/stack-Vite%20%2B%20React%20%2B%20Supabase-334155)
![PWA](https://img.shields.io/badge/PWA-mobile--first-c2410c)
![Licenca](https://img.shields.io/badge/licenca-UNLICENSED-78716c)

## Sumario

- [Visao geral](#visao-geral)
- [O problema que o sistema resolve](#o-problema-que-o-sistema-resolve)
- [Perfis e responsabilidades](#perfis-e-responsabilidades)
- [Fluxo principal](#fluxo-principal)
- [Recursos implementados](#recursos-implementados)
- [Guia rapido de uso](#guia-rapido-de-uso)
- [Stack e arquitetura](#stack-e-arquitetura)
- [Como rodar localmente](#como-rodar-localmente)
- [Configuracao do Supabase](#configuracao-do-supabase)
- [Scripts do projeto](#scripts-do-projeto)
- [Estrutura do repositorio](#estrutura-do-repositorio)
- [Validacao antes de entrega](#validacao-antes-de-entrega)
- [Documentacao complementar](#documentacao-complementar)

## Visao geral

O AlimentaObra centraliza a operacao de refeicoes em obras. Ele substitui
controles espalhados por WhatsApp, planilhas e combinados manuais por um fluxo
com pedidos, consolidacao diaria, envio ao fornecedor, confirmacoes
operacionais, consumo real, auditoria e relatorios.

O produto foi pensado para uso em campo: a experiencia e mobile-first, os
perfis sao separados por responsabilidade e o fluxo principal prioriza clareza
operacional em vez de telas genericas.

| Area | Entrega |
| --- | --- |
| Produto | PWA para gestao de refeicoes em obra |
| Publico | Encarregados, administracao e fornecedor |
| Backend | Supabase Auth, PostgreSQL, RLS, RPCs e Realtime |
| Frontend | Vite, React, Tailwind e service worker |
| Evidencias | Auditoria, relatorios, PDF, Excel e romaneios |
| Validacao local | `npm run ci` |

## O problema que o sistema resolve

Em obras, pedidos de refeicao tendem a mudar ao longo do dia, envolver varias
frentes de trabalho e depender de confirmacao do fornecedor. Sem um sistema
central, a operacao fica vulneravel a duplicidade, esquecimento, falta de
rastreabilidade e divergencia entre solicitado, enviado e consumido.

O AlimentaObra organiza esse processo em quatro pontos:

1. O encarregado registra a necessidade da equipe.
2. O administrador consolida a demanda e envia ao fornecedor.
3. O fornecedor confirma as etapas de atendimento.
4. O sistema preserva historico, auditoria e relatorios.

## Perfis e responsabilidades

| Perfil | Responsabilidade principal | Telas esperadas |
| --- | --- | --- |
| Encarregado | Criar e acompanhar pedidos da propria frente de trabalho | Home, Fazer Pedido, Historico |
| Administrador | Consolidar, enviar, auditar e analisar a operacao | Home, Pedidos, Financeiro, Relatorios, Auditoria, Mais |
| Fornecedor | Receber blocos enviados e confirmar etapas de producao/entrega | Home/Producao, Pedidos, Documentos, Financeiro, Mais |

### Regras importantes por perfil

- Encarregados criam pedidos por data, tipo de refeicao, quantidade e
  equipe/trecho.
- Administradores visualizam a operacao consolidada, enviam blocos ao
  fornecedor e acompanham status.
- Fornecedores confirmam recebimento, producao, saida/entrega e consumo real.
- Blocos ja confirmados pelo fornecedor limitam edicoes posteriores.
- Novas demandas para data ja confirmada seguem como pedido/bloco extra quando
  aplicavel.

## Fluxo principal

```text
Encarregado
  cria pedido
      |
      v
Administrador
  revisa e consolida por data
      |
      v
Fornecedor
  confirma recebimento, producao e saida/entrega
      |
      v
Administrador
  acompanha auditoria, financeiro, relatorios e exportacoes
```

## Recursos implementados

### Operacao

- Login por Supabase Auth e carregamento de perfil operacional.
- Pedidos por data, tipo de refeicao, quantidade, equipe/trecho e observacao.
- Consolidacao diaria com blocos extras quando a data ja foi confirmada.
- Regras de edicao, cancelamento e bloqueio apos confirmacao do fornecedor.
- Fluxo de fornecedor com confirmacao de recebimento, producao, saida/entrega
  e consumo real.
- Auditoria de acoes relevantes com usuario, data e entidade operacional.

### Gestao

- Dashboard administrativo com indicadores da operacao.
- Pedidos filtraveis e organizados por data/bloco.
- Area financeira para acompanhamento de valores.
- Relatorios com graficos, leituras operacionais e exportacoes.
- Romaneios e documentos de apoio ao fornecedor.
- Catalogo operacional com tipos de refeicao, precos e equipes/trechos.

### Entrega tecnica

- PWA com manifest, icones e service worker.
- Supabase com RLS, funcoes RPC, migrations e Realtime.
- Scripts de validacao local, formatacao e testes de regra.
- Documentacao de deploy, operacao, QA e entrega.
- Arquivos internos e logs de desenvolvimento fora do versionamento.

## Guia rapido de uso

Para um roteiro completo, consulte [docs/guia-utilizacao.md](docs/guia-utilizacao.md).

### 1. Preparar o ambiente

1. Criar ou validar o projeto Supabase do AlimentaObra.
2. Aplicar as migrations em `supabase/migrations/`.
3. Criar usuarios no Supabase Auth.
4. Promover os perfis iniciais com os scripts administrativos.
5. Cadastrar tipos de refeicao, precos e equipes/trechos.

### 2. Demonstrar como encarregado

1. Entrar com usuario do perfil `encarregado`.
2. Abrir `Fazer Pedido`.
3. Conferir se a data atual vem preenchida.
4. Informar tipo de refeicao, quantidade e equipe/trecho.
5. Salvar ou enviar o pedido.
6. Conferir o pedido no historico.

### 3. Demonstrar como administrador

1. Entrar com usuario do perfil `admin`.
2. Abrir `Pedidos`.
3. Conferir o bloco consolidado da data.
4. Enviar o bloco ao fornecedor.
5. Acompanhar status, relatorios, financeiro e auditoria.

### 4. Demonstrar como fornecedor

1. Entrar com usuario do perfil `fornecedor`.
2. Abrir Home/Producao ou Pedidos.
3. Confirmar recebimento.
4. Confirmar producao.
5. Confirmar saida/entrega.
6. Registrar consumo real quando aplicavel.

## Stack e arquitetura

| Camada | Tecnologia |
| --- | --- |
| UI | React 19, JSX e componentes por perfil |
| Build | Vite 8 |
| Estilo | Tailwind CSS 4 e CSS local |
| Backend | Supabase Auth, PostgreSQL, Storage e Realtime |
| Banco | Migrations SQL versionadas em `supabase/migrations/` |
| PWA | `manifest.webmanifest`, assets e `service-worker.js` |
| Validacao | `node --check`, testes de regra, format checker e build |

### Desenho tecnico

```text
src/app.js
  orquestra estado, eventos globais, autenticacao e renderizacao

src/pages/
  separa telas por perfil: admin, encarregado e fornecedor

src/services/database.js
  concentra Auth, consultas, RPCs, Realtime e adaptadores Supabase

src/services/store-v2.js
  estado derivado e regras locais de exibicao

supabase/migrations/
  fonte versionada de schema, RLS, triggers e funcoes RPC
```

## Como rodar localmente

### Requisitos

- Node.js instalado.
- Dependencias do projeto instaladas.
- Projeto Supabase configurado.
- Arquivo `.env.local` criado a partir de `.env.example`.

### Instalar dependencias

```powershell
npm install
```

### Configurar variaveis

Crie `.env.local`:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
```

Nunca use chave `service_role` no frontend, no Git ou em variaveis iniciadas
com `VITE_`.

### Iniciar o app

```powershell
npm run dev
```

Acesse:

```text
http://127.0.0.1:5190
```

## Configuracao do Supabase

O Supabase e a fonte operacional do produto. Para um ambiente novo:

1. Criar projeto dedicado para o AlimentaObra.
2. Aplicar migrations em ordem cronologica.
3. Configurar Site URL e Redirect URLs para a URL local/publicada.
4. Manter cadastro publico desligado, salvo decisao explicita.
5. Criar usuarios iniciais no Auth.
6. Promover perfis internos com rotina administrativa controlada.
7. Validar login e menus dos tres perfis.

Arquivos relevantes:

- `supabase/config.toml`
- `supabase/migrations/`
- `database/promover-usuario.sql`
- `docs/configuracao-supabase.md`
- `docs/guia-supabase.md`

## Scripts do projeto

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o Vite em ambiente local |
| `npm run build` | Gera build de producao em `dist/` |
| `npm run build:pages` | Gera build com base `/alimenta-obra/` para GitHub Pages |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Executa verificacao estrutural dos arquivos JS/JSX |
| `npm run format:check` | Confere formatacao de textos acompanhados |
| `npm run format` | Normaliza textos acompanhados |
| `npm run test` | Executa testes de regras de negocio |
| `npm run ci` | Roda lint, format check, testes e build |

## Estrutura do repositorio

```text
assets/                         Logos, icones e recursos PWA
database/                       Scripts administrativos de operacao
docs/                           Documentacao funcional, tecnica e operacional
docs/legacy/                    Modelos historicos fora do fluxo atual
public/assets/                  Assets publicos usados no app
scripts/                        Validacao, formatacao e servidor estatico
src/app.js                      Orquestracao principal da SPA
src/components/                 Shell, login, icones e UI compartilhada
src/core/navigation.js          Menus, rotulos e navegacao por perfil
src/features/                   Regras reutilizaveis de dominio e metricas
src/pages/admin/                Telas do administrador
src/pages/encarregado/          Telas do encarregado
src/pages/fornecedor/           Telas do fornecedor
src/services/database.js        Auth, consultas, RPCs e Realtime
src/services/store-v2.js        Estado derivado e regras de interface
src/services/exports.js         PDF, Excel, Word e romaneios
src/styles/app.css              Layout responsivo e linguagem visual
supabase/migrations/            Schema, RLS, triggers e RPCs
manifest.webmanifest            Metadados de instalacao PWA
service-worker.js               Cache de assets em producao
```

### Legado preservado

`src/data/seed.js`, `src/services/store.js` e `docs/legacy/database/` permanecem
como historico/apoio. A base atual do produto e Supabase + `store-v2`.

## Validacao antes de entrega

Execute:

```powershell
npm run ci
```

Antes de uma apresentacao, validar tambem:

- Login com os tres perfis.
- Criacao de pedido pelo encarregado.
- Consolidacao e envio pelo administrador.
- Confirmacoes do fornecedor.
- Consumo real quando aplicavel.
- Auditoria, relatorios, financeiro e exportacoes.
- Manifest, icones e service worker no ambiente publicado.

## Documentacao complementar

| Documento | Conteudo |
| --- | --- |
| [docs/guia-utilizacao.md](docs/guia-utilizacao.md) | Guia completo de uso por perfil |
| [docs/entrega.md](docs/entrega.md) | Roteiro de apresentacao e entrega |
| [docs/deploy.md](docs/deploy.md) | Publicacao do frontend e Supabase |
| [docs/operacao.md](docs/operacao.md) | Rotina operacional do sistema |
| [docs/checklist-qa.md](docs/checklist-qa.md) | Checklist manual antes de reuniao/publicacao |
| [docs/arquitetura.md](docs/arquitetura.md) | Organizacao tecnica do app |
| [docs/requisitos-funcionais.md](docs/requisitos-funcionais.md) | Regras funcionais do produto |
| [docs/configuracao-supabase.md](docs/configuracao-supabase.md) | Setup inicial do Supabase |
| [docs/guia-supabase.md](docs/guia-supabase.md) | Cuidados tecnicos com Supabase |

## Boas praticas de manutencao

- Nao editar migrations ja aplicadas em producao; criar nova migration.
- Nao versionar `.env.local`, logs, `dist/`, `tmp/`, `outputs/` ou arquivos
  internos de ferramentas.
- Validar `npm run ci` antes de commit/deploy.
- Manter perfis administrativos restritos.
- Registrar qualquer mudanca sensivel de regra operacional.
- Revisar o service worker em publicacoes criticas para evitar cache antigo.

## Status de entrega

O repositorio esta preparado para uma entrega profissional quando:

- `npm run ci` passa sem erro.
- Migrations estao aplicadas no Supabase correto.
- Usuarios de demonstracao existem para os tres perfis.
- A URL publicada foi validada em navegador limpo.
- O fluxo Encarregado -> Administrador -> Fornecedor -> Relatorios funciona de
  ponta a ponta.
