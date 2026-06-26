export function createAdminPages(renderers) {
  return {
    painel: renderers.renderPainel,
    pedidos: renderers.renderPedidosAdmin,
    consolidacao: renderers.renderConsolidacao,
    mais: renderers.renderAdminMore,
    financeiro: () => renderers.renderFinanceiro("admin"),
    relatorios: renderers.renderRelatorios,
    auditoria: renderers.renderAuditoria
  };
}
