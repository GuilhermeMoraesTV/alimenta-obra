export function createAdminPages() {
  function renderReactAdminPage() {
    return `<div data-admin-react-root></div>`;
  }

  return {
    painel: renderReactAdminPage,
    pedidos: renderReactAdminPage,
    consolidacao: renderReactAdminPage,
    mais: renderReactAdminPage,
    financeiro: renderReactAdminPage,
    relatorios: renderReactAdminPage,
    auditoria: renderReactAdminPage
  };
}
