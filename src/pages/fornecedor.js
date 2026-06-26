export function createSupplierPages(renderers) {
  return {
    fornecedor: renderers.renderFornecedor,
    "fornecedor-pedidos": renderers.renderSupplierOrders,
    "fornecedor-historico": renderers.renderSupplierHistory,
    "fornecedor-documentos": renderers.renderSupplierDocuments,
    "fornecedor-financeiro": () => renderers.renderFinanceiro("fornecedor")
  };
}
