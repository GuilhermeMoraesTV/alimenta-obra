import React from "react";
import { Icon, SupplierFilterMenu, SupplierReceiptHeader, foodSummary, statusLabel, supplierConsolidations, supplierStatusCount } from "./shared.jsx";

function OrderItemsSummary({ requestMealDescription, summary }) {
  if (!summary.rows.length) return <div className="empty">Sem itens neste pedido.</div>;
  return (
    <div className="supplier-order-items-summary">
      {Object.entries(summary.byMeal).map(([meal, data]) => (
        <div className="supplier-order-item-line" key={meal}>
          <span>
            <strong>{meal}</strong>
            {requestMealDescription(data.rows[0]) ? <small>{requestMealDescription(data.rows[0])}</small> : null}
          </span>
          <b>{data.total}</b>
        </div>
      ))}
      <div className="supplier-order-item-line total-line"><span>Total</span><b>{summary.total} refeicoes</b></div>
    </div>
  );
}

export function OrderCard(props) {
  const { consolidation, consolidationValue, formatDate, getConsolidationSummary, icon, money, nextSupplierStep, requestMealDescription, STATUS_LABEL } = props;
  const summary = getConsolidationSummary(props.state, consolidation);
  const next = nextSupplierStep(consolidation.status);
  const compositions = Object.entries(summary.byMeal).map(([meal, data]) => [meal, requestMealDescription(data.rows[0])]).filter(([, description]) => description);

  return (
    <article className="supplier-order-card">
      <div className="supplier-order-card-head">
        <span className="supplier-order-card-icon"><Icon icon={icon} name={consolidation.status === "saiu_entrega" ? "truck" : "package"} size={19} /></span>
        <div className="supplier-order-card-title">
          <div className="supplier-order-title-row">
            <h2>{foodSummary(summary) || `${summary.total} refeicoes`}</h2>
            <span className={`badge ${consolidation.status}`}>{statusLabel(STATUS_LABEL, consolidation.status)}</span>
          </div>
          <p>Entrega {formatDate(consolidation.date)} - Pedido {consolidation.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <div className="supplier-order-card-actions">
          <button className="btn outline small" data-generate-romaneio={consolidation.id}>Gerar nota</button>
          {next ? <button className="btn primary small" data-step={next.step} data-id={consolidation.id}>{next.label}</button> : null}
        </div>
      </div>
      <div className="supplier-order-card-meta">
        <span>Quantidade<strong>{summary.total}</strong></span>
        <span>Valor<strong>{money(consolidationValue(consolidation))}</strong></span>
        <span>Origem<strong>{summary.rows.length}</strong></span>
        <span>Status<strong>{statusLabel(STATUS_LABEL, consolidation.status)}</strong></span>
      </div>
      <details className="supplier-order-details">
        <summary>Ver itens, composicao e origem</summary>
        <div className="supplier-order-details-body">
          <section className="supplier-order-detail-section">
            <h3>Resumo do pedido</h3>
            <OrderItemsSummary requestMealDescription={requestMealDescription} summary={summary} />
          </section>
          {compositions.length ? (
            <section className="supplier-order-detail-section">
              <h3>Composicao</h3>
              {compositions.map(([meal, description]) => <p key={meal}><strong>{meal}:</strong> {description}</p>)}
            </section>
          ) : null}
        </div>
      </details>
    </article>
  );
}

export function Orders(props) {
  const { getConsolidationSummary, icon, state, supplierOrderDate, supplierOrderStatus, user } = props;
  const rows = supplierConsolidations(state, user).filter((item) => {
    const matchesStatus = supplierOrderStatus === "todos" || (supplierOrderStatus === "ativos" ? !["entregue", "rascunho"].includes(item.status) : item.status === supplierOrderStatus);
    return matchesStatus && (!supplierOrderDate || item.date === supplierOrderDate);
  });
  const activeRows = rows.filter((item) => !["entregue", "rascunho"].includes(item.status));
  const totalMeals = rows.reduce((sum, item) => sum + getConsolidationSummary(state, item).total, 0);
  const waitingCount = supplierStatusCount(rows, "enviado");

  return (
    <section className="supplier-workspace">
      <SupplierReceiptHeader
        kicker="Pedidos do fornecedor"
        title="Pedidos recebidos"
        totalValue={rows.length}
        totalLabel="pedidos na fila"
        description="Fila de producao, entrega e acompanhamento."
        actions={(
          <SupplierFilterMenu icon={icon}>
            <select defaultValue={supplierOrderStatus} data-supplier-status><option value="ativos">Pedidos ativos</option><option value="todos">Todos os pedidos</option><option value="enviado">A confirmar</option><option value="confirmado">Em producao</option><option value="saiu_entrega">Em rota</option><option value="entregue">Entregues</option></select>
            <input type="date" defaultValue={supplierOrderDate} data-supplier-date />
            <button className="btn outline small" data-supplier-clear-filter>Limpar filtros</button>
          </SupplierFilterMenu>
        )}
        metrics={[
          { icon, iconName: "clipboard", label: "Pedidos", value: rows.length },
          { icon, iconName: "utensils", label: "Refeicoes", value: totalMeals },
          { icon, iconName: "clock", label: "A confirmar", value: waitingCount },
          { icon, iconName: "truck", label: "Ativos", value: activeRows.length },
        ]}
      />
      <div className="supplier-simple-orders">
        {rows.length ? rows.map((item) => (
          <div className="supplier-request-shell" key={item.id}>
            <div className="supplier-request-owner">Fornecedor <strong>{user?.name ?? "Fornecedor"}</strong></div>
            <OrderCard {...props} consolidation={item} />
          </div>
        )) : <div className="empty">Nenhum pedido encontrado.</div>}
      </div>
    </section>
  );
}
