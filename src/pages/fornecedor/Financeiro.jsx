import React from "react";
import { Icon, SupplierBackButton, SupplierReceiptHeader, statusLabel, supplierConsolidations } from "./shared.jsx";

export function Financeiro(props) {
  const { formatDate, icon, money, requestValue, state, sumQty, user, STATUS_LABEL } = props;
  const sourceRows = supplierConsolidations(state, user).flatMap((consolidation) => props.getConsolidationSummary(state, consolidation).rows);
  const month = state.settings.defaultMealDate.slice(0, 7);
  const rows = sourceRows.filter((request) => request.date.startsWith(month));
  const delivered = rows.filter((request) => request.status === "entregue");
  const projected = rows.reduce((sum, request) => sum + requestValue(request), 0);
  const deliveredValue = delivered.reduce((sum, request) => sum + requestValue(request), 0);
  const pendingValue = projected - deliveredValue;
  const mealCount = sumQty(rows);
  const byMeal = state.mealTypes.map((meal) => ({ label: meal.label, value: rows.filter((request) => request.mealTypeId === meal.id).reduce((sum, request) => sum + requestValue(request), 0) })).filter((item) => item.value > 0);
  const max = Math.max(...byMeal.map((item) => item.value), 1);
  const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(`${state.settings.defaultMealDate}T12:00:00`); date.setDate(date.getDate() - (6 - index)); const key = date.toISOString().slice(0, 10); return { key, label: String(date.getDate()).padStart(2, "0"), value: sourceRows.filter((request) => request.date === key).reduce((sum, request) => sum + requestValue(request), 0) }; });
  const dailyMax = Math.max(...days.map((item) => item.value), 1);
  const sortedRows = [...rows].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="finance-page">
      <SupplierReceiptHeader
        kicker="Financeiro"
        title="Financeiro do fornecedor"
        totalValue={money(projected)}
        totalLabel={`previsto em ${month}`}
        description={`Analise de ${month}.`}
        backAction={<SupplierBackButton icon={icon} />}
        actions={<button className="btn primary" data-export-finance="fornecedor"><Icon icon={icon} name="chart" size={15} />Gerar PDF</button>}
        metrics={[
          { icon, iconName: "chart", label: "Faturamento previsto", value: money(projected) },
          { icon, iconName: "truck", label: "Faturado", value: money(deliveredValue) },
          { icon, iconName: "clock", label: "Em aberto", value: money(pendingValue) },
          { icon, iconName: "utensils", label: "Ticket medio", value: money(mealCount ? projected / mealCount : 0) },
        ]}
      />
      <div className="finance-grid"><article className="finance-card"><h2>Composicao por refeicao</h2>{byMeal.length ? byMeal.map((item) => <div className="finance-progress" key={item.label}><div><span>{item.label}</span><strong>{money(item.value)}</strong></div><i><b style={{ width: `${Math.max(3, Math.round((item.value / max) * 100))}%` }} /></i></div>) : <div className="empty">Sem movimentacao no periodo.</div>}</article><article className="finance-card"><h2>Evolucao dos ultimos 7 dias</h2><div className="finance-bars">{days.map((item) => <div key={item.key}><strong>{item.value ? money(item.value).replace("R$", "") : "-"}</strong><i style={{ height: `${Math.max(5, Math.round((item.value / dailyMax) * 126))}px` }} /><span>{item.label}</span></div>)}</div></article></div>
      <article className="finance-card finance-table-card">
        <h2>Movimentacoes do periodo</h2>
        <div className="finance-mobile-movements">
          {sortedRows.map((request) => (
            <article className="finance-mobile-row" key={request.id}>
              <div className="finance-mobile-row-top">
                <div>
                  <h3>{request.mealType}</h3>
                  <time>{formatDate(request.date)}</time>
                </div>
                <span className={`badge ${request.status}`}>{statusLabel(STATUS_LABEL, request.status)}</span>
              </div>
              <div className="finance-mobile-row-meta">
                <span>Quantidade<strong>{request.quantity}</strong></span>
                <span>Valor<strong>{money(requestValue(request))}</strong></span>
              </div>
            </article>
          ))}
          {!sortedRows.length && <div className="empty">Nenhuma movimentacao encontrada para o periodo.</div>}
        </div>
        <div className="table-wrap finance-desktop-movements"><table><thead><tr><th>Data</th><th>Tipo</th><th>Quantidade</th><th>Valor</th><th>Status</th></tr></thead><tbody>{sortedRows.map((request) => <tr key={request.id}><td>{formatDate(request.date)}</td><td>{request.mealType}</td><td>{request.quantity}</td><td><strong>{money(requestValue(request))}</strong></td><td><span className={`badge ${request.status}`}>{statusLabel(STATUS_LABEL, request.status)}</span></td></tr>)}</tbody></table></div>
      </article>
    </section>
  );
}
