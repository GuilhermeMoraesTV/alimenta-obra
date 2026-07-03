import React from "react";
import { Icon, SupplierReceiptHeader, foodSummary, supplierConsolidations } from "./shared.jsx";

export function History(props) {
  const { formatDate, formatDateTime, getConsolidationSummary, icon, state, user } = props;
  const rows = supplierConsolidations(state, user).filter((item) => item.status === "entregue");
  const totalMeals = rows.reduce((sum, item) => sum + getConsolidationSummary(state, item).total, 0);
  const latest = rows[0];
  return (
    <section className="supplier-workspace">
      <SupplierReceiptHeader
        className="supplier-history-receipt"
        kicker="Historico"
        title="Historico de entregas"
        totalValue={rows.length}
        totalLabel="entregas concluidas"
        description="Pedidos concluidos pelo fornecedor."
        metrics={[
          { icon, iconName: "check", label: "Entregas", value: rows.length },
          { icon, iconName: "utensils", label: "Refeicoes", value: totalMeals },
          { icon, iconName: "history", label: "Ultima entrega", value: latest ? formatDate(latest.date) : "-" },
        ]}
      />
      <div className="supplier-history-list">{rows.length ? rows.map((item) => { const summary = getConsolidationSummary(state, item); const delivered = item.confirmations.find((confirmation) => confirmation.step === "entregue"); return (
        <article className="supplier-history-row supplier-order-card" key={item.id}>
          <div className="supplier-order-card-head">
            <span className="supplier-order-card-icon"><Icon icon={icon} name="check" size={19} /></span>
            <div className="supplier-order-card-title">
              <div className="supplier-order-title-row">
                <h2>{foodSummary(summary) || `${summary.total} refeicoes`}</h2>
                <span className="badge entregue">Entregue</span>
              </div>
              <p>Entrega {formatDate(item.date)} - concluido em {formatDateTime(delivered?.at)}</p>
            </div>
            <div className="supplier-history-actions">
              <button className="btn outline small" data-generate-romaneio={item.id}>Nota</button>
              <button className="btn outline small" data-view="fornecedor-documentos">Documentos</button>
            </div>
          </div>
          <div className="supplier-order-card-meta">
            <span>Quantidade<strong>{summary.total}</strong></span>
            <span>Origem<strong>{summary.rows.length}</strong></span>
            <span>Pedido<strong>{item.id.slice(0, 8).toUpperCase()}</strong></span>
            <span>Status<strong>Entregue</strong></span>
          </div>
        </article>
      ); }) : <div className="empty">Nenhuma entrega concluida ainda.</div>}</div>
    </section>
  );
}
