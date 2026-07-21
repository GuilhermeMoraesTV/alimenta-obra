import React from "react";
import { SupplierDailyBlockCard, supplierDailyBlockStyles } from "./DailyBlock.jsx";
import { ConsolidatedSummary, ConsolidationTimeline, Icon, OriginRequestCards, SupplierFilterMenu, SupplierReceiptHeader, foodSummary, statusLabel, supplierConsolidations, supplierStatusCount } from "./shared.jsx";

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
  const updatedRows = consolidation.sentAt
    ? summary.rows.filter((request) => request.updatedAt && new Date(request.updatedAt) > new Date(consolidation.sentAt))
    : [];
  const hasAdminUpdate = consolidation.status === "enviado" && (updatedRows.length > 0 || (consolidation.revisions?.length ?? 0) > 0);

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
      {hasAdminUpdate ? <div className="supplier-daily-update-alert"><Icon icon={icon} name="edit" size={15} /><div><strong>Pedido atualizado pelo Admin</strong><span>Revise o pedido antes de confirmar.</span></div></div> : null}
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
  const { formatDate, formatDateTime, getConsolidationSummary, icon, requestMealDescription, selectedSupplierConsolidationId, state, supplierOrderDate, supplierOrderStatus, STATUS_LABEL, user } = props;
  const rows = supplierConsolidations(state, user).filter((item) => {
    const matchesStatus = supplierOrderStatus === "todos" || (supplierOrderStatus === "ativos" ? !["saiu_entrega", "entregue", "rascunho", "cancelado_confirmado"].includes(item.status) : item.status === supplierOrderStatus);
    return matchesStatus && (!supplierOrderDate || item.date === supplierOrderDate);
  });
  const activeRows = rows.filter((item) => !["saiu_entrega", "entregue", "rascunho", "cancelado_confirmado"].includes(item.status));
  const totalMeals = rows.reduce((sum, item) => sum + getConsolidationSummary(state, item).total, 0);
  const waitingCount = supplierStatusCount(rows, "enviado");
  const selected = rows.find((item) => item.id === selectedSupplierConsolidationId) ?? null;
  const selectedSummary = selected ? getConsolidationSummary(state, selected) : null;

  return (
    <>
      <style>{`
        ${supplierDailyBlockStyles}
        .supplier-page .supplier-simple-orders {
          grid-template-columns: repeat(3,minmax(0,1fr));
          align-items: start;
          gap: .75rem;
        }
        .supplier-page .supplier-request-shell { gap: 0; }
        .supplier-page .supplier-request-owner { display: none; }
        @media (max-width: 767px) {
          .supplier-page .supplier-simple-orders { grid-template-columns: 1fr; }
        }
        @media (min-width: 768px) and (max-width: 1180px) {
          .supplier-page .supplier-simple-orders { grid-template-columns: repeat(2,minmax(0,1fr)); }
        }
      `}</style>
      <section className="supplier-workspace">
        <SupplierReceiptHeader
          kicker="Pedidos do fornecedor"
          title="Pedidos recebidos"
          totalValue={rows.length}
          totalLabel="pedidos na fila"
          description="Blocos diarios recebidos, consumo real e saida."
          actions={(
            <SupplierFilterMenu icon={icon}>
              <select defaultValue={supplierOrderStatus} data-supplier-status><option value="ativos">Pedidos ativos</option><option value="todos">Todos os pedidos</option><option value="enviado">A confirmar</option><option value="confirmado">A registrar saida</option><option value="saiu_entrega">Saida registrada</option><option value="entregue">Entregues</option><option value="cancelado_confirmado">Cancelados apos confirmacao</option></select>
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
        <div className="supplier-daily-block-list">
          {rows.length ? rows.map((item) => (
            <div className="supplier-request-shell" key={item.id}>
              <SupplierDailyBlockCard {...props} consolidation={item} />
            </div>
          )) : <div className="empty">Nenhum pedido encontrado.</div>}
        </div>
        {selected && selectedSummary ? (
          <div className="supplier-detail-modal-backdrop" data-supplier-close-detail>
            <section className="supplier-detail-modal" role="dialog" aria-modal="true" aria-labelledby="supplier-detail-title" onClick={(event) => event.stopPropagation()}>
              <header>
                <div>
                  <span className="compact-kicker">Pedido {selected.id.slice(0, 8).toUpperCase()}</span>
                  <h2 id="supplier-detail-title">{selectedSummary.total} refeicoes para {formatDate(selected.date)}</h2>
                  <p>Status: {statusLabel(STATUS_LABEL, selected.status)}</p>
                </div>
                <button className="modal-close" type="button" data-supplier-close-detail aria-label="Fechar">x</button>
              </header>
              <div className="supplier-order-highlights">
                <div><span>Quantidade</span><strong>{selectedSummary.total}</strong></div>
                <div><span>Origem</span><strong>{selectedSummary.rows.length}</strong></div>
                <div><span>Entrega</span><strong>{formatDate(selected.date)}</strong></div>
                <div><span>Status</span><strong>{statusLabel(STATUS_LABEL, selected.status)}</strong></div>
              </div>
              <div className="supplier-detail-grid">
                <section><h3>Itens do pedido</h3><ConsolidatedSummary requestMealDescription={requestMealDescription} state={state} summary={selectedSummary} /></section>
                <section><h3>Rastreabilidade</h3><ConsolidationTimeline consolidation={selected} formatDateTime={formatDateTime} state={state} /></section>
              </div>
              <section><h3>Pedidos de origem</h3><OriginRequestCards formatDate={formatDate} formatDateTime={formatDateTime} rows={selectedSummary.rows} state={state} STATUS_LABEL={STATUS_LABEL} /></section>
            </section>
          </div>
        ) : null}
      </section>
    </>
  );
}
