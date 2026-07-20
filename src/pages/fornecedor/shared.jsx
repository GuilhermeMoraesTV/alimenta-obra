import React from "react";
import { getActualQuantity, mealCategoryLabel, requestOriginLabel, requestResponsibleName } from "../../services/store-v2.js";

export function Icon({ icon, name, size = 16 }) {
  return <span className="inline-icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon(name, size) }} />;
}

export function SupplierBackButton({ icon }) {
  return <button className="admin-back-button supplier-back-button" data-view="fornecedor-mais" aria-label="Voltar para mais"><Icon icon={icon} name="arrow-left" size={15} /><span>Voltar</span></button>;
}

export function SupplierReceiptMetric({ icon, iconName, label, value }) {
  const longValueClass = String(value).length > 12 ? " is-long-value" : "";
  return (
    <div className={`admin-receipt-chip${longValueClass}`}>
      <span className="admin-receipt-chip-icon"><Icon icon={icon} name={iconName} size={15} /></span>
      <div className="admin-receipt-chip-text">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export function SupplierReceiptHeader({ actions, backAction, className = "", description, kicker, metrics = [], title, totalLabel, totalValue }) {
  const metricCount = Math.max(metrics.length, 1);
  return (
    <div className={`admin-receipt ${className}`.trim()}>
      <header className="admin-receipt-head">
        {backAction}
        <div className="admin-receipt-main">
          <div>
            <span className="compact-kicker">{kicker}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="admin-receipt-total">
            <strong>{totalValue}</strong>
            <span>{totalLabel}</span>
          </div>
        </div>
        {actions ? <div className="admin-receipt-actions">{actions}</div> : null}
      </header>
      {metrics.length ? (
        <>
          <div className="admin-receipt-holes">{Array.from({ length: 14 }).map((_, index) => <span key={index} />)}</div>
          <div className="admin-receipt-metrics" data-count={metricCount} style={{ "--receipt-metric-count": metricCount }}>
            {metrics.map((metric) => <SupplierReceiptMetric {...metric} key={`${metric.label}-${metric.value}`} />)}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function SupplierFilterMenu({ children, icon, label = "Filtros" }) {
  return (
    <details className="admin-filter-menu">
      <summary><Icon icon={icon} name="filter" size={15} />{label}</summary>
      <div className="admin-filter-popover">{children}</div>
    </details>
  );
}

export function getUserName(state, userId) {
  return state.users.find((user) => user.id === userId)?.name ?? "Usuario";
}

export function supplierConsolidations(state, user) {
  const companyIds = new Set((state.supplierCompanyUsers ?? [])
    .filter((item) => item.userId === user?.id && item.active !== false)
    .map((item) => item.supplierCompanyId));
  return state.consolidations
    .filter((item) => item.supplierId === user?.id || companyIds.has(item.supplierCompanyId))
    .sort((a, b) => b.date.localeCompare(a.date) || new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0));
}

export function supplierDocuments(state, consolidationId) {
  return state.consolidationDocuments.filter((item) => item.consolidationId === consolidationId);
}

export function supplierStatusCount(rows, status) {
  return rows.filter((item) => item.status === status).length;
}

export function supplierActionLabel(consolidation, nextSupplierStep) {
  const next = nextSupplierStep(consolidation.status);
  return next?.label ?? "Entrega concluida";
}

export function statusLabel(STATUS_LABEL, status) {
  return STATUS_LABEL[status] ?? status;
}

export function supplierHomeAction(status) {
  if (status === "enviado") return { step: "confirmado", label: "Confirmar recebimento", iconName: "check" };
  if (status === "confirmado") return { step: "saiu_entrega", label: "Registrar saida", iconName: "truck" };
  if (status === "producao") return { step: "saiu_entrega", label: "Confirmar saida", iconName: "truck" };
  return null;
}

export function foodSummary(summary) {
  return Object.entries(summary.byMeal).map(([meal, data]) => `${data.total} ${meal}`).join(" - ");
}

export function ConsolidatedSummary({ requestMealDescription, state, summary }) {
  if (!summary.rows.length) return <div className="empty">Sem pedidos recebidos para enviar ao fornecedor.</div>;
  return (
    <>
      {Object.entries(summary.byMeal).map(([meal, data]) => (
        <div className="consolidated-block" key={meal}>
          <div className="consolidated-row total-line"><span>{meal}</span><span>{data.total}</span></div>
          {requestMealDescription(data.rows[0]) ? <div className="consolidated-description">{requestMealDescription(data.rows[0])}</div> : null}
          {data.rows.map((request) => <div className="consolidated-row" key={request.id}><span>{request.sectionName || request.location || getUserName(state, request.leaderId)}</span><strong>{request.quantity}</strong></div>)}
        </div>
      ))}
      <div className="consolidated-row total-line"><span>Total geral</span><span>{summary.total} refeicoes</span></div>
    </>
  );
}

export function ConsolidationTimeline({ consolidation, formatDateTime, state }) {
  const hasLegacyProduction = consolidation.confirmations.some((item) => item.step === "producao") || consolidation.status === "producao";
  const steps = [
    ["enviado", "Enviado ao fornecedor"],
    ["confirmado", "Fornecedor confirmou recebimento"],
    ...(hasLegacyProduction ? [["producao", "Fornecedor confirmou producao"]] : []),
    ["saiu_entrega", "Saida registrada"]
  ];
  return (
    <div className="timeline">
      {steps.map(([step, label]) => {
        const confirmation = consolidation.confirmations.find((item) => item.step === step);
        return <div className="timeline-item" key={step}><div className="timeline-dot" style={{ background: confirmation ? "var(--orange)" : "var(--line)" }} /><div className="timeline-body"><strong>{label}</strong><br />{confirmation ? `${getUserName(state, confirmation.userId)} - ${formatDateTime(confirmation.at)}` : "Aguardando"}</div></div>;
      })}
    </div>
  );
}

export function OriginRequestCards({ formatDate, formatDateTime, rows, state, STATUS_LABEL }) {
  if (!rows.length) return <div className="empty">Nenhum pedido de origem encontrado.</div>;
  return (
    <div className="supplier-origin-list">
      {rows.map((request) => {
        const actual = getActualQuantity(state, "", request);
        return (
          <article className="supplier-origin-card" key={request.id}>
            <div><strong>{request.mealType}</strong><span className={`badge ${request.status}`}>{STATUS_LABEL[request.status] ?? request.status}</span></div>
            <p>{requestOriginLabel(request)} - {requestResponsibleName(state, request)} - {request.sectionName || request.location}</p>
            <footer>
              <span>{formatDate(request.date)}</span>
              <span>{mealCategoryLabel(request.mealCategory)}</span>
              <b>{request.quantity} ped.</b>
              <b>{actual} cons.</b>
              <small>{formatDateTime(request.updatedAt)}</small>
            </footer>
          </article>
        );
      })}
    </div>
  );
}
