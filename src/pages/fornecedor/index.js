export function createSupplierPages(renderers) {
  function renderReactSupplierPage() {
    return `<div data-supplier-react-root></div>`;
  }

  return {
    fornecedor: renderReactSupplierPage,
    "fornecedor-pedidos": renderReactSupplierPage,
    "fornecedor-historico": renderReactSupplierPage,
    "fornecedor-mais": renderReactSupplierPage,
    "fornecedor-documentos": renderReactSupplierPage,
    "fornecedor-financeiro": renderReactSupplierPage
  };
}
