import React from "react";
import { Icon, SupplierReceiptHeader, supplierActionLabel, supplierConsolidations, supplierHomeAction, supplierStatusCount, foodSummary } from "./shared.jsx";

export function EmptyNextAction({ icon }) {
  return (
    <section className="supplier-next-action is-empty">
      <span className="supplier-next-icon"><Icon icon={icon} name="package" size={22} /></span>
      <div><span className="eyebrow">Tudo em dia</span><h2>Sem acao pendente</h2><p>Quando o administrador enviar um pedido ao fornecedor, ele aparecera aqui.</p></div>
    </section>
  );
}

export function SupplierNextAction(props) {
  const { consolidation, consolidationValue, formatDate, getConsolidationSummary, icon, money, nextSupplierStep } = props;
  const summary = getConsolidationSummary(props.state, consolidation);
  const next = nextSupplierStep(consolidation.status);
  return (
    <section className="supplier-next-action">
      <span className="supplier-next-icon"><Icon icon={icon} name={consolidation.status === "saiu_entrega" ? "truck" : "clipboard"} size={22} /></span>
      <div className="supplier-next-copy">
        <span className="eyebrow">Proxima acao</span>
        <h2>{supplierActionLabel(consolidation, nextSupplierStep)}</h2>
        <div className="supplier-next-order">
          <strong>{foodSummary(summary)}</strong>
          <span>Pedido {consolidation.id.slice(0, 8).toUpperCase()}</span>
          <span>{summary.total} refeicoes</span>
          <span>{money(consolidationValue(consolidation))}</span>
          <span>Entrega: {formatDate(consolidation.date)}</span>
        </div>
      </div>
      <div className="supplier-next-actions"><button className="btn outline small" data-supplier-select={consolidation.id}>Detalhes</button>{next ? <button className="btn primary" data-step={next.step} data-id={consolidation.id}>{next.label}</button> : null}</div>
    </section>
  );
}

export function SupplierQueueRow(props) {
  const { consolidation, consolidationValue, formatDate, getConsolidationSummary, icon, money, STATUS_LABEL } = props;
  const summary = getConsolidationSummary(props.state, consolidation);
  return (
    <button className="supplier-queue-row" data-supplier-select={consolidation.id}>
      <span className="supplier-queue-date">Entrega<br /><b>{formatDate(consolidation.date)}</b></span>
      <span><strong>{foodSummary(summary)}</strong><small>Pedido {consolidation.id.slice(0, 8).toUpperCase()} - {summary.total} refeicoes - {money(consolidationValue(consolidation))}</small></span>
      <span className={`badge ${consolidation.status}`}>{STATUS_LABEL[consolidation.status] ?? consolidation.status}</span>
      <Icon icon={icon} name="arrow" size={16} />
    </button>
  );
}

export function Dashboard(props) {
  const { formatDate, getConsolidationSummary, icon, state, user } = props;
  const rows = supplierConsolidations(state, user);
  const activeRows = rows.filter((item) => !["entregue", "rascunho"].includes(item.status));
  const priority = [...activeRows].sort((a, b) => {
    const rank = { enviado: 0, confirmado: 1, producao: 2, saiu_entrega: 3 };
    return (rank[a.status] ?? 9) - (rank[b.status] ?? 9) || new Date(a.date) - new Date(b.date);
  })[0];
  const totalToday = rows.filter((item) => item.date === state.settings.defaultMealDate).reduce((sum, item) => sum + getConsolidationSummary(state, item).total, 0);
  const waitingCount = supplierStatusCount(rows, "enviado");
  const productionCount = supplierStatusCount(rows, "confirmado") + supplierStatusCount(rows, "producao");
  const deliveredCount = supplierStatusCount(rows, "entregue");
  const priorityNextStep = priority ? supplierHomeAction(priority.status) : null;

  return (
    <section className="supplier-dashboard">
      <SupplierReceiptHeader
        className="supplier-home-receipt"
        kicker={`Fornecedor - ${formatDate(state.settings.defaultMealDate)}`}
        title="Visao operacional"
        totalValue={waitingCount}
        totalLabel="pedidos a confirmar"
        description="Pedidos recebidos, producao e entregas em um fluxo simples."
        actions={(
          priorityNextStep ? (
            <button className="btn primary" data-step={priorityNextStep.step} data-id={priority.id}>
              <Icon icon={icon} name={priorityNextStep.iconName} size={15} />{priorityNextStep.label}
            </button>
          ) : (
            <button className="btn primary" data-view="fornecedor-pedidos">
              <Icon icon={icon} name="clipboard" size={15} />Pedidos
            </button>
          )
        )}
        metrics={[
          { icon, iconName: "utensils", label: "Recebidos do dia", value: totalToday },
          { icon, iconName: "clipboard", label: "A confirmar", value: waitingCount },
          { icon, iconName: "clock", label: "Em producao", value: productionCount },
          { icon, iconName: "check", label: "Entregues", value: deliveredCount },
        ]}
      />
      {priority ? <SupplierNextAction {...props} consolidation={priority} /> : <EmptyNextAction icon={icon} />}
      <section className="supplier-panel-card supplier-queue-card">
        <div className="supplier-section-heading"><div><span className="eyebrow">Fila operacional</span><h2>Pedidos prioritarios</h2></div><button className="text-action" data-view="fornecedor-pedidos">Ver todos <Icon icon={icon} name="arrow" size={15} /></button></div>
        <div className="supplier-queue">{activeRows.length ? activeRows.slice(0, 5).map((item) => <SupplierQueueRow {...props} consolidation={item} key={item.id} />) : <div className="empty">Nenhum pedido pendente no momento.</div>}</div>
      </section>
    </section>
  );
}
