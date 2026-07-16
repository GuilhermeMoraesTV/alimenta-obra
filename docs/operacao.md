# Operacao

## Visao geral

Este documento resume como manter o AlimentaObra no dia a dia. Ele nao substitui as regras internas da empresa, mas serve como roteiro para preparar usuarios, cadastros e parametros antes da operacao.

## Perfis

O sistema trabalha com tres perfis principais:

- Encarregado: cria e acompanha pedidos da propria operacao.
- Administrador: acompanha todos os pedidos, consolida, envia ao fornecedor, audita e consulta relatorios.
- Fornecedor: recebe blocos consolidados, confirma etapas e informa consumo real.

## Cadastro de usuarios

1. Criar ou convidar o usuario no Supabase Auth.
2. Vincular o usuario a um perfil interno.
3. Conferir se o perfil esta correto antes de liberar acesso.
4. Testar login em janela anonima.

Boas praticas:

- usar e-mails individuais;
- evitar usuarios compartilhados;
- remover ou desativar acessos de pessoas que sairam da operacao;
- revisar perfis administrativos periodicamente.

## Administradores

Administradores devem ser poucos e controlados. Eles podem consultar a operacao inteira, acessar relatorios, financeiro, auditoria e executar acoes sensiveis.

Antes de promover um usuario a administrador:

- confirmar autorizacao interna;
- conferir se o e-mail esta correto;
- validar que o usuario consegue entrar;
- registrar a mudanca quando aplicavel.

## Fornecedores

O fornecedor precisa ter usuario proprio e perfil de fornecedor. Na operacao normal, ele deve acessar os blocos enviados, confirmar etapas e registrar consumo real quando solicitado.

Pontos de atencao:

- o fornecedor nao deve alterar pedidos de encarregados;
- confirmacoes geram rastreabilidade;
- blocos confirmados limitam edicoes posteriores;
- divergencias devem ser tratadas como ajuste operacional ou pedido extra, conforme a regra combinada.

## Equipes e trechos

As equipes/trechos representam os locais ou frentes de trabalho usados nos pedidos.

Manter atualizado:

- nomes das equipes;
- responsaveis;
- status ativo/inativo;
- relacao com encarregados quando aplicavel.

Antes de reunioes ou viradas de obra, revisar se as equipes ativas refletem a operacao real.

## Tipos de refeicao

O catalogo de refeicoes define o que pode ser solicitado e como os valores entram nos relatorios.

Exemplos atuais:

- Marmita Campo;
- Buffet Almoco;
- Jantar.

Para cada tipo, conferir:

- nome exibido;
- descricao operacional;
- preco unitario;
- disponibilidade;
- local ou regra de entrega, quando aplicavel.

## Precos

Precos devem ser revisados sempre que houver mudanca contratual com o fornecedor.

Cuidados:

- validar o impacto em relatorios financeiros;
- evitar alterar historico sem necessidade;
- combinar a data de vigencia da mudanca;
- registrar o motivo quando houver ajuste relevante.

## Rotina diaria sugerida

1. Encarregados registram pedidos.
2. Administrador acompanha os pedidos recebidos.
3. Administrador envia o bloco consolidado ao fornecedor.
4. Fornecedor confirma recebimento e etapas operacionais.
5. Administrador acompanha status e resolve excecoes.
6. No fechamento, consultar relatorios, financeiro e auditoria.

## Tratamento de excecoes

- Pedido antes da confirmacao do fornecedor: pode seguir regra normal de edicao/cancelamento.
- Pedido depois da confirmacao do fornecedor: deve ser tratado com cuidado e tende a virar pedido/bloco extra.
- Divergencia de quantidade: fornecedor registra consumo real ou administrador ajusta conforme processo interno.
- Usuario com acesso errado: corrigir perfil antes de continuar operacao.
- Problema de dados: checar Supabase, migrations, RLS e logs antes de alterar codigo.
