export const NAV_BY_ROLE = {
  encarregado: [
    ["inicio", "home", "Home"],
    ["pedido", "clipboard", "Fazer Pedido"],
    ["historico", "history", "Historico"]
  ],
  admin: [
    ["painel", "home", "Home"],
    ["pedidos", "clipboard", "Pedidos"],
    ["financeiro", "chart", "Financeiro"],
    ["relatorios", "chart", "Relatorios"],
    ["auditoria", "history", "Auditoria"],
    ["mais", "settings", "Mais"]
  ],
  fornecedor: [
    ["fornecedor", "home", "Home"],
    ["fornecedor-pedidos", "clipboard", "Pedidos"],
    ["fornecedor-documentos", "package", "Documentos"],
    ["fornecedor-financeiro", "chart", "Financeiro"],
    ["fornecedor-mais", "settings", "Mais"]
  ]
};

export const STATUS_LABEL = {
  rascunho: "Rascunho",
  enviado: "Enviado",
  confirmado: "Confirmado",
  producao: "Em producao",
  saiu_entrega: "Saiu para entrega",
  entregue: "Entregue",
  cancelado: "Cancelado",
  cancelamento_pendente: "Cancelamento pendente",
  cancelado_confirmado: "Cancelado apos confirmacao"
};

export function viewLabel(view) {
  return {
    inicio: "Home",
    pedido: "Fazer pedido",
    historico: "Historico",
    configuracoes: "Configuracoes",
    painel: "Home",
    "pedido-detalhe": "Pedido",
    pedidos: "Controle",
    consolidacao: "Enviar pedido",
    mais: "Mais",
    financeiro: "Financeiro",
    relatorios: "Inteligencia",
    auditoria: "Rastreabilidade",
    fornecedor: "Producao",
    "fornecedor-pedidos": "Pedidos",
    "fornecedor-historico": "Historico",
    "fornecedor-mais": "Mais",
    "fornecedor-documentos": "Documentos",
    "fornecedor-financeiro": "Financeiro"
  }[view] ?? "AlimentaObra";
}
