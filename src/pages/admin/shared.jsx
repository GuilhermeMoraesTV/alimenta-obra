import React from "react";
import { RequestCard } from "../encarregado/RequestCard.jsx";

export function Icon({ icon, name, size = 16 }) {
  return <span dangerouslySetInnerHTML={{ __html: icon(name, size) }} />;
}

export function Topbar({ actions, subtitle, title }) {
  return (
    <header className="topbar app-page-header">
      <div>
        <span className="eyebrow">{title}</span>
        <h1 className="page-title">{title}</h1>
        <div className="page-subtitle">{subtitle}</div>
      </div>
      {actions ? <div className="actions">{actions}</div> : null}
    </header>
  );
}

export function AdminReceiptMetric({ icon, iconName, label, value }) {
  return (
    <div className="admin-receipt-chip">
      <span className="admin-receipt-chip-icon"><Icon icon={icon} name={iconName} size={15} /></span>
      <div className="admin-receipt-chip-text">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export function AdminReceiptHeader({ actions, className = "", description, kicker, metrics = [], title, totalLabel, totalValue }) {
  const metricCount = Math.max(metrics.length, 1);
  return (
    <div className={`admin-receipt ${className}`.trim()}>
      <header className="admin-receipt-head">
        <div className="admin-receipt-main">
          <span className="compact-kicker">{kicker}</span>
          <h1>{title}</h1>
          {totalValue !== undefined ? (
            <div className="admin-receipt-total">
              <strong>{totalValue}</strong>
              <span>{totalLabel}</span>
            </div>
          ) : null}
          {description ? <p>{description}</p> : null}
        </div>
        {actions ? <div className="admin-receipt-actions">{actions}</div> : null}
      </header>
      <div className="admin-receipt-holes">{Array.from({ length: 14 }).map((_, index) => <span key={index} />)}</div>
      <div className="admin-receipt-metrics" data-count={metricCount} style={{ "--receipt-metric-count": metricCount }}>
        {metrics.map((metric) => <AdminReceiptMetric {...metric} key={`${metric.label}-${metric.value}`} />)}
      </div>
    </div>
  );
}

export function AdminBackButton({ icon }) {
  return <button className="admin-back-button" data-view="mais" aria-label="Voltar para mais ferramentas"><Icon icon={icon} name="arrow-left" size={15} /><span>Voltar</span></button>;
}

export function ExportButtons({ exportMenuOpen, icon, id, items }) {
  return (
    <div className={`export-menu ${exportMenuOpen === id ? "open" : ""}`}>
      <button className="btn outline small" type="button" data-export-toggle={id}><Icon icon={icon} name="clipboard" size={14} />Exportar</button>
      {exportMenuOpen === id ? (
        <div className="export-options">
          {items.map(([type, label, iconName]) => <button type="button" data-export={type} key={type}><Icon icon={icon} name={iconName} size={14} />{label}</button>)}
        </div>
      ) : null}
    </div>
  );
}

export function AdminFilterMenu({ children, icon, label = "Filtros" }) {
  return (
    <details className="admin-filter-menu">
      <summary aria-label={label}><Icon icon={icon} name="filter" size={15} /><span>{label}</span></summary>
      <div className="admin-filter-popover">{children}</div>
    </details>
  );
}

export function statusLabel(labels, status) {
  return labels[status] ?? status;
}

export function getUserName(state, userId) {
  return state.users.find((user) => user.id === userId)?.name ?? "Usuario";
}

export function getLeaders(state) {
  return state.users.filter((user) => user.role === "encarregado");
}

export function getSuppliers(state) {
  return state.users.filter((user) => user.role === "fornecedor");
}

export function requestsForDate(state, date) {
  return state.requests.filter((request) => request.date === date);
}

export function getWeekStart(referenceDate, offset = 0) {
  const date = new Date(`${referenceDate}T12:00:00`);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diffToMonday + offset * 7);
  date.setHours(12, 0, 0, 0);
  return date;
}

export function RequestActions({ canEditRequest, request, state }) {
  if (!canEditRequest(state, request)) return <span className="page-subtitle">Bloqueado</span>;
  return (
    <div className="button-row">
      <button className="btn outline small" data-edit-request={request.id}>Editar</button>
      <button className="btn danger small" data-cancel-request={request.id}>Cancelar</button>
    </div>
  );
}

export function RequestTable({ canEditRequest, formatDate, formatDateTime, rows, showLeader = false, editable = false, state, STATUS_LABEL, ...props }) {
  if (!rows.length) return <div className="empty">Nenhum pedido encontrado.</div>;

  return (
    <>
      <div className="admin-request-list">
        {rows.map((request) => (
          <article className="admin-request-shell" key={request.id}>
            {showLeader ? <div className="admin-request-owner">Encarregado <strong>{getUserName(state, request.leaderId)}</strong></div> : null}
            <RequestCard
              {...props}
              canEditRequest={editable ? canEditRequest : () => false}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
              request={request}
              state={state}
              STATUS_LABEL={STATUS_LABEL}
              compact={!editable}
            />
          </article>
        ))}
      </div>
      <div className="table-wrap legacy-request-table">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              {showLeader ? <th>Encarregado</th> : null}
              <th>Tipo</th>
              <th>Local</th>
              <th>Qtd</th>
              <th>Status</th>
              <th>Atualizacao</th>
              {editable ? <th>Acoes</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((request) => (
              <tr key={request.id}>
                <td>{formatDate(request.date)}</td>
                {showLeader ? <td><strong>{getUserName(state, request.leaderId)}</strong></td> : null}
                <td>{request.mealType}</td>
                <td>{request.location}</td>
                <td><strong>{request.quantity}</strong></td>
                <td><span className={`badge ${request.status}`}>{statusLabel(STATUS_LABEL, request.status)}</span></td>
                <td>{formatDateTime(request.updatedAt)}</td>
                {editable ? <td><RequestActions canEditRequest={canEditRequest} request={request} state={state} /></td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
