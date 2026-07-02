export function createLeaderPages() {
  function renderReactLeaderPage() {
    return `<div data-leader-react-root></div>`;
  }

  return {
    historico: renderReactLeaderPage,
    inicio: renderReactLeaderPage,
    pedido: renderReactLeaderPage
  };
}
