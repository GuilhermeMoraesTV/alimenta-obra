# Requisitos Funcionais

## Objetivo

Eliminar controles por WhatsApp e planilhas, centralizando solicitações, consolidação, confirmação, entrega e relatórios de refeições da obra.

## Perfis

### Encarregado

- Criar solicitação para sua equipe.
- Informar data, tipo, quantidade e local.
- Salvar rascunho.
- Enviar pedido ao administrador.
- Editar ou cancelar dentro do horário limite.
- Consultar histórico.

### Administrador

- Visualizar todos os pedidos.
- Filtrar por data, encarregado e tipo.
- Consolidar pedidos automaticamente.
- Revisar pedido consolidado.
- Enviar ao fornecedor.
- Gerar relatórios.
- Exportar dados.
- Consultar auditoria.

### Fornecedor

- Receber pedido consolidado.
- Confirmar recebimento.
- Confirmar produção.
- Confirmar saída para entrega.
- Registrar automaticamente data e hora de cada etapa.

## Tipos de refeição

- Marmita Campo: local fixo `Campo`.
- Buffer Almoço: locais `Restaurante BR` e `Restaurante Centro`.
- Jantar: local `Restaurante Centro`.

## Status principais

- `rascunho`: pedido salvo pelo encarregado.
- `enviado`: pedido enviado para o administrador.
- `cancelado`: pedido cancelado dentro do prazo.
- `confirmado`: fornecedor confirmou recebimento.
- `producao`: fornecedor confirmou produção.
- `saiu_entrega`: fornecedor confirmou saída.
- `entregue`: entrega registrada.

## Auditoria

Toda ação relevante registra:

- Usuário.
- Perfil.
- Data e hora.
- Entidade afetada.
- Dados principais da operação.
