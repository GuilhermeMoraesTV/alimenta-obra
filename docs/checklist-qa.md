# Checklist de QA

## Objetivo

Roteiro manual de alto nivel para validar o AlimentaObra antes de uma reuniao, apresentacao ou publicacao.

## Preparacao

- Rodar `npm run ci`.
- Confirmar que `.env.local` aponta para o Supabase correto.
- Confirmar que migrations foram aplicadas.
- Confirmar que existem usuarios para os tres perfis.
- Confirmar que ha tipos de refeicao, equipes/trechos e precos cadastrados.
- Abrir a aplicacao em janela anonima ou navegador limpo.

## Login e perfis

- Admin consegue entrar.
- Encarregado consegue entrar.
- Fornecedor consegue entrar.
- Login invalido mostra feedback claro.
- Cada perfil ve apenas o menu esperado.
- Usuario sem perfil valido nao acessa areas operacionais.

## Encarregado

- Home abre sem erro.
- Fazer Pedido carrega a data atual.
- Pedido aceita tipo de refeicao, quantidade, equipe/trecho e observacao.
- Pedido pode ser salvo/enviado.
- Historico mostra os pedidos do encarregado.
- Edicao/cancelamento respeita as regras operacionais.

## Administrador

- Home carrega indicadores principais.
- Pedidos lista pedidos por data/bloco.
- Filtros principais funcionam.
- Consolidacao aparece corretamente.
- Envio ao fornecedor funciona.
- Status do fornecedor aparece no bloco enviado.
- Financeiro abre sem erro.
- Relatorios abrem com graficos e exportacoes.
- Auditoria mostra eventos relevantes.

## Fornecedor

- Home/Producao mostra blocos recebidos.
- Pedidos mostra o bloco enviado pelo administrador.
- Confirmar recebimento funciona.
- Confirmar producao funciona.
- Confirmar saida/entrega funciona.
- Registrar consumo real funciona quando aplicavel.
- Documentos e Financeiro abrem sem erro.

## Regras criticas

- Pedido enviado antes da confirmacao aparece no bloco correto.
- Depois que o fornecedor confirma, novas demandas para a mesma data nao devem quebrar o bloco confirmado.
- Novo envio para data ja confirmada deve virar pedido/bloco extra quando aplicavel.
- Fornecedor nao deve pular etapas de status.
- Admin nao deve alterar livremente pedido bloqueado por confirmacao.
- Auditoria deve registrar acoes sensiveis.

## Exportacoes e relatorios

- PDF de pedidos abre sem erro.
- Excel abre sem reparo do arquivo.
- Relatorio diario e gerado/baixado quando aplicavel.
- Romaneios/documentos relevantes usam dados atuais.
- Arquivos exportados usam nomes compreensiveis.

## PWA e publicacao

- Manifest carrega sem erro.
- Icones aparecem.
- Service worker nao prende bundle antigo em validacao critica.
- Refresh completo continua abrindo a aplicacao.
- URL publicada abre diretamente.
- Rotas internas funcionam apos reload.

## Evidencias para reuniao

Registrar antes da apresentacao:

- URL validada;
- data e horario do teste;
- usuarios usados por perfil;
- versao/commit quando disponivel;
- pontos pendentes ou limitacoes conhecidas;
- prints dos fluxos principais, se necessario.

## Criterio de aceite

A entrega esta pronta para demonstracao quando o fluxo completo funciona de ponta a ponta:

Encarregado cria pedido, administrador consolida/envia, fornecedor confirma, e administrador consegue consultar auditoria, relatorios e exportacoes sem erro bloqueante.
