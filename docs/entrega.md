# Entrega do AlimentaObra

## URLs

- Ambiente local: `http://127.0.0.1:5190`
- Ambiente publicado: preencher com a URL final da publicacao.
- Supabase: projeto dedicado do AlimentaObra, configurado pelas variaveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.

## Objetivo da entrega

O AlimentaObra e uma PWA para centralizar pedidos de refeicoes em obra, substituir controles por WhatsApp/planilhas e dar rastreabilidade entre encarregados, administracao e fornecedor.

O sistema cobre o fluxo principal:

1. Encarregado cria e envia pedidos.
2. Administrador acompanha, consolida e envia blocos ao fornecedor.
3. Fornecedor confirma recebimento, producao, saida/entrega e consumo real.
4. Administrador consulta relatorios, financeiro, auditoria e exportacoes.

## Perfis de demonstracao

Os usuarios devem ser criados no Supabase Auth e vinculados a perfis internos.

- `admin`: acesso a Home, Pedidos, Financeiro, Relatorios, Auditoria e Mais.
- `encarregado`: acesso a Home, Fazer Pedido e Historico.
- `fornecedor`: acesso a Home/Producao, Pedidos, Documentos, Financeiro e Mais.

Para demonstracao, preparar pelo menos:

- 1 administrador;
- 1 fornecedor;
- 1 ou mais encarregados;
- equipes/trechos ativos;
- tipos de refeicao com preco configurado;
- alguns pedidos de exemplo em datas diferentes.

## Fluxo sugerido de demonstracao

1. Entrar como encarregado.
2. Criar um pedido para a data atual, informando tipo de refeicao, quantidade, equipe/trecho e observacao se necessario.
3. Enviar o pedido ao administrador.
4. Entrar como administrador.
5. Abrir Pedidos e conferir o bloco consolidado.
6. Enviar o bloco ao fornecedor.
7. Entrar como fornecedor.
8. Confirmar recebimento, producao e saida/entrega.
9. Registrar consumo real quando aplicavel.
10. Voltar como administrador e mostrar relatorios, financeiro, auditoria e exportacoes.

## Pontos importantes para apresentar

- A operacao e organizada por perfis.
- Os pedidos viram blocos diarios consolidados.
- Blocos ja confirmados pelo fornecedor nao devem ser editados livremente.
- Novos envios para uma data ja confirmada devem gerar pedido/bloco extra.
- A auditoria registra acoes relevantes com usuario, data e contexto.
- Exportacoes e relatorios servem como evidencia operacional e apoio financeiro.

## Limitacoes conhecidas

- A aplicacao depende de conexao com Supabase para autenticacao, dados e Realtime.
- A geracao automatica de rotinas em horario fixo, como meia-noite, precisa de job backend/Supabase cron; a PWA so executa quando aberta.
- Usuarios, fornecedores e perfis iniciais exigem preparacao administrativa.
- Alteracoes de banco, RLS ou RPC precisam ser publicadas por migrations.
- O service worker pode manter bundle antigo em navegador ja usado; em validacoes criticas, fazer refresh completo ou limpar cache.
