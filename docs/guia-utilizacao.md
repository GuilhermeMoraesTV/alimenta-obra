# Guia de utilizacao do AlimentaObra

Este guia mostra como usar o AlimentaObra no dia a dia e como demonstrar o
sistema para um cliente. Ele complementa o README e organiza o uso por perfil.

## Visao geral do fluxo

```text
Encarregado cria pedido
        |
        v
Administrador revisa, consolida e envia
        |
        v
Fornecedor confirma etapas
        |
        v
Administrador acompanha auditoria, relatorios e financeiro
```

## Preparacao antes de usar

Antes da operacao, confirme:

- o Supabase correto esta configurado em `.env.local`;
- as migrations foram aplicadas;
- existem usuarios para admin, encarregado e fornecedor;
- os perfis internos foram vinculados corretamente;
- existem equipes/trechos ativos;
- os tipos de refeicao e precos estao cadastrados;
- o fornecedor tem acesso ao sistema.

## Acesso ao sistema

1. Abrir a URL do ambiente local ou publicado.
2. Informar e-mail e senha.
3. Conferir se o menu exibido corresponde ao perfil do usuario.

Se o login falhar, conferir:

- e-mail digitado;
- senha;
- usuario criado no Supabase Auth;
- perfil interno vinculado;
- usuario ativo.

## Perfil Encarregado

O encarregado registra a demanda da frente de trabalho.

### Criar pedido

1. Entrar como encarregado.
2. Abrir `Fazer Pedido`.
3. Conferir a data do pedido.
4. Selecionar o tipo de refeicao.
5. Informar a quantidade.
6. Selecionar equipe/trecho.
7. Preencher observacao, se necessario.
8. Salvar ou enviar o pedido.

### Conferir historico

1. Abrir `Historico`.
2. Conferir pedidos criados pelo proprio usuario.
3. Validar status, data, quantidade e tipo de refeicao.

### Regras importantes

- A data padrao de novo pedido deve ser a data atual.
- Edicoes dependem da regra operacional e do status do pedido.
- Apos confirmacao do fornecedor, o bloco confirmado nao deve ser alterado
  livremente.
- Se nao houver equipe/trecho disponivel, o admin deve ajustar o cadastro.

## Perfil Administrador

O administrador coordena a operacao, consolida pedidos e acompanha evidencias.

### Acompanhar pedidos

1. Entrar como administrador.
2. Abrir `Pedidos`.
3. Conferir pedidos recebidos por data.
4. Revisar blocos diarios e informacoes de equipe/trecho.
5. Usar filtros quando necessario.

### Enviar ao fornecedor

1. Selecionar o bloco consolidado.
2. Conferir quantidades e tipos de refeicao.
3. Enviar o bloco ao fornecedor.
4. Acompanhar o status exibido no proprio bloco.

### Relatorios e financeiro

1. Abrir `Relatorios`.
2. Conferir indicadores, graficos e relatorio diario.
3. Baixar PDF ou Excel quando necessario.
4. Abrir `Financeiro` para acompanhar valores.

### Auditoria

1. Abrir `Auditoria`.
2. Conferir eventos recentes.
3. Validar usuario, horario, acao e entidade relacionada.

### Regras importantes

- Blocos confirmados pelo fornecedor limitam edicoes posteriores.
- Novas demandas para uma data ja confirmada devem virar pedido/bloco extra
  quando aplicavel.
- Alteracoes sensiveis precisam ficar rastreaveis.
- Usuarios administrativos devem ser poucos e controlados.

## Perfil Fornecedor

O fornecedor recebe blocos enviados pelo admin e registra o andamento da
producao/entrega.

### Confirmar etapas

1. Entrar como fornecedor.
2. Abrir Home/Producao ou `Pedidos`.
3. Conferir o bloco recebido.
4. Confirmar recebimento.
5. Confirmar producao.
6. Confirmar saida/entrega.
7. Registrar consumo real quando aplicavel.

### Documentos e financeiro

1. Abrir `Documentos` quando houver anexos ou evidencias.
2. Abrir `Financeiro` para consultar informacoes relacionadas ao fornecedor.

### Regras importantes

- O fornecedor nao cria pedidos de encarregados.
- As confirmacoes servem como evidencia operacional.
- O fornecedor deve seguir a sequencia operacional esperada.
- Divergencias de quantidade devem ser tratadas como ajuste operacional ou
  consumo real, conforme o processo combinado.

## Roteiro de demonstracao para cliente

Use este roteiro em uma apresentacao:

1. Mostrar a tela de login.
2. Entrar como encarregado.
3. Criar um pedido para a data atual.
4. Mostrar o historico do encarregado.
5. Sair e entrar como administrador.
6. Mostrar Home/Pedidos e o bloco consolidado.
7. Enviar o bloco ao fornecedor.
8. Sair e entrar como fornecedor.
9. Confirmar recebimento, producao e saida/entrega.
10. Voltar ao admin.
11. Mostrar auditoria.
12. Mostrar relatorios, financeiro e exportacoes.

## Checklist rapido por reuniao

Antes de apresentar:

- rodar `npm run ci`;
- abrir o app em janela anonima;
- testar login dos tres perfis;
- garantir dados de exemplo;
- limpar cache se o service worker estiver servindo bundle antigo;
- ter a URL publicada pronta;
- saber qual commit esta sendo demonstrado.

## Problemas comuns

| Sintoma | Possivel causa | Acao |
| --- | --- | --- |
| Login nao entra | Usuario inexistente, senha errada ou perfil ausente | Conferir Supabase Auth e perfil interno |
| Menu errado | Perfil interno incorreto | Ajustar perfil do usuario |
| Encarregado nao consegue enviar | Sem equipe/trecho ativo ou permissao invalida | Revisar cadastro de equipes |
| Pedido nao aparece para admin | Filtro/data/status diferente do esperado | Conferir filtros e atualizar dados |
| Fornecedor nao ve bloco | Bloco nao enviado ou usuario fornecedor incorreto | Reenviar/validar perfil |
| Exportacao estranha | Dados incompletos ou cache antigo | Revalidar dados e atualizar pagina |
| App publicado mostra versao antiga | Service worker/cache | Fazer refresh completo ou limpar cache |

## Criterio de uso pronto

O sistema esta pronto para operacao ou demonstracao quando:

- os tres perfis entram corretamente;
- o pedido nasce no encarregado;
- o admin consegue consolidar e enviar;
- o fornecedor confirma etapas;
- auditoria registra as acoes;
- relatorios e exportacoes abrem sem erro bloqueante.
