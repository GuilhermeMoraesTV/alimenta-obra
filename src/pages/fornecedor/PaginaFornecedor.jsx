import React from "react";

const supplierPageStyles = `
  .supplier-page {
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    display: grid;
    gap: 0.75rem;
    color: #1c1917;
  }
  .supplier-page h1,
  .supplier-page h2,
  .supplier-page h3,
  .supplier-page p { margin: 0; }
  .supplier-page h1 { font-size: 26px; line-height: 1; font-weight: 900; letter-spacing: 0; }
  .supplier-page h2 { font-size: 1.25rem; font-weight: 900; }
  .supplier-page h3 { font-weight: 900; }
  .supplier-page p { font-size: .875rem; color: #78716c; }
  .supplier-page .app-page-header {
    position: relative;
    margin-bottom: .75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: .75rem;
    border-radius: 18px;
    border: 1px solid #e7e5e4;
    border-left: 5px solid #ea580c;
    background: rgba(255,255,255,.9);
    padding: 1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }
  .supplier-page .eyebrow { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .12em; color: #c2410c; }
  .supplier-page .page-subtitle { font-size: .75rem; font-weight: 700; color: #78716c; }
  .supplier-page .btn,
  .supplier-page .supplier-back-button {
    display: inline-flex;
    min-height: 2.5rem;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    border-radius: .5rem;
    border: 1px solid transparent;
    padding: 0 1rem;
    font-size: .875rem;
    font-weight: 800;
    transition: transform .18s ease, border-color .18s ease, background .18s ease;
  }
  .supplier-page .btn:hover { transform: translateY(-2px); }
  .supplier-page .btn.primary { border-color: #ea580c; background: #ea580c; color: #fff; box-shadow: 0 10px 22px rgba(239,91,29,.2); }
  .supplier-page .btn.outline,
  .supplier-page .supplier-back-button { border-color: #d6d3d1; background: #fff; color: #1c1917; }
  .supplier-page .btn.small { min-height: 2.25rem; padding: 0 .75rem; font-size: .75rem; }
  .supplier-page .badge { display: inline-flex; min-height: 1.75rem; align-items: center; border-radius: 999px; border: 1px solid #e7e5e4; background: #f5f5f4; padding: 0 .625rem; font-size: 11px; font-weight: 900; text-transform: uppercase; color: #57534e; }
  .supplier-page .badge.enviado { border-color: #fed7aa; background: #fff7ed; color: #c2410c; }
  .supplier-page .badge.entregue { border-color: #a7f3d0; background: #ecfdf5; color: #047857; }
  .supplier-page .badge.confirmado { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
  .supplier-page .badge.producao { border-color: #fde68a; background: #fffbeb; color: #b45309; }
  .supplier-page .badge.saiu_entrega { border-color: #bae6fd; background: #f0f9ff; color: #0369a1; }
  .supplier-page .supplier-dashboard,
  .supplier-page .supplier-workspace,
  .supplier-page .supplier-queue,
  .supplier-page .supplier-order-list,
  .supplier-page .supplier-origin-list,
  .supplier-page .supplier-history-list,
  .supplier-page .supplier-documents-list,
  .supplier-page .supplier-attached-files { display: grid; gap: .75rem; }
  .supplier-page .supplier-heading {
    margin-bottom: .75rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: .75rem;
    border-radius: 18px;
    border: 1px solid #292524;
    border-left: 5px solid #ea580c;
    background: #242622;
    color: #fff;
    padding: 1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }
  .supplier-page .supplier-heading p { color: rgba(255,255,255,.65); }
  .supplier-page .supplier-metrics-grid,
  .supplier-page .finance-metrics,
  .supplier-page .supplier-order-highlights { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .5rem; }
  .supplier-page .supplier-metric,
  .supplier-page .supplier-next-action,
  .supplier-page .supplier-panel-card,
  .supplier-page .supplier-queue-row,
  .supplier-page .supplier-order-list-item,
  .supplier-page .supplier-order-detail,
  .supplier-page .supplier-origin-card,
  .supplier-page .supplier-history-row,
  .supplier-page .supplier-more-tile,
  .supplier-page .supplier-document-card,
  .supplier-page .finance-metric,
  .supplier-page .finance-card,
  .supplier-page .consolidated-block {
    border-radius: 1rem;
    border: 1px solid #e7e5e4;
    background: #fff;
    padding: 1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }
  .supplier-page .supplier-metric,
  .supplier-page .finance-metric,
  .supplier-page .supplier-order-highlights > div {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: .5rem;
    border-radius: .375rem 1rem 1rem .375rem;
    border: 1px dashed #d6d3d1;
    border-left-width: 2px;
    background: #fff;
    padding: .75rem 1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }
  .supplier-page .supplier-data-icon {
    display: grid;
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
    place-items: center;
    border-radius: 999px;
    background: #fff0e8;
    color: #c2410c;
  }
  .supplier-page .supplier-data-copy {
    min-width: 0;
    line-height: 1;
  }
  .supplier-page .supplier-metric .supplier-data-copy span,
  .supplier-page .supplier-order-highlights span { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .supplier-page .supplier-metric strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 1.12rem; line-height: 1; font-weight: 950; color: #1c1917; }
  .supplier-page .supplier-metric small { display: none; }
  .supplier-page .supplier-metric.accent,
  .supplier-page .finance-metric.accent { border-color: #d6d3d1; background: #fff; color: #1c1917; }
  .supplier-page .supplier-metric.accent .supplier-data-copy span,
  .supplier-page .supplier-metric.accent small { color: #78716c; }
  .supplier-page .supplier-next-action { display: grid; gap: .75rem; }
  .supplier-page .supplier-next-icon { display: grid; width: 3rem; height: 3rem; place-items: center; border-radius: .75rem; background: #fff7ed; color: #c2410c; }
  .supplier-page .supplier-next-order,
  .supplier-page .supplier-next-actions,
  .supplier-page .filter-bar,
  .supplier-page .supplier-detail-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
  .supplier-page .supplier-next-order span { border-radius: 999px; background: #f5f5f4; padding: .25rem .625rem; font-size: .75rem; font-weight: 700; }
  .supplier-page .supplier-section-heading,
  .supplier-page .supplier-detail-top,
  .supplier-page .supplier-origin-card > div,
  .supplier-page .supplier-document-title,
  .supplier-page .supplier-document-body,
  .supplier-page .supplier-history-row { display: flex; align-items: center; justify-content: space-between; gap: .75rem; }
  .supplier-page .text-action { display: inline-flex; align-items: center; gap: .25rem; border: 0; background: transparent; color: #c2410c; font-size: .875rem; font-weight: 800; }
  .supplier-page .supplier-queue-row { display: grid; grid-template-columns: minmax(0,1fr) auto auto auto; align-items: center; text-align: left; }
  .supplier-page .supplier-orders-layout,
  .supplier-page .supplier-detail-grid,
  .supplier-page .supplier-more-grid,
  .supplier-page .finance-grid { display: grid; gap: .75rem; }
  .supplier-page .supplier-order-list-item { display: grid; gap: .5rem; text-align: left; }
  .supplier-page .supplier-order-list-item.selected { border-color: #f97316; background: #fff7ed; }
  .supplier-page .supplier-detail-grid section,
  .supplier-page .supplier-document-body { border-radius: .75rem; border: 1px solid #e7e5e4; background: #fafaf9; padding: .75rem; }
  .supplier-page .consolidated-row { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .5rem 0; }
  .supplier-page .total-line { font-weight: 900; }
  .supplier-page .timeline { display: grid; gap: .5rem; }
  .supplier-page .timeline-item { display: grid; grid-template-columns: 12px minmax(0,1fr); gap: .75rem; border-radius: .75rem; border: 1px solid #e7e5e4; background: #fff; padding: .75rem; }
  .supplier-page .timeline-dot { margin-top: .25rem; width: .75rem; height: .75rem; border-radius: 999px; background: #ea580c; }
  .supplier-page .supplier-origin-card footer { margin-top: .5rem; display: flex; flex-wrap: wrap; gap: .5rem; font-size: .75rem; font-weight: 700; color: #78716c; }
  .supplier-page input,
  .supplier-page select { min-height: 2.5rem; border-radius: .5rem; border: 1px solid #d6d3d1; background: #fff; padding: 0 .75rem; font-size: .875rem; }
  .supplier-page .supplier-more-tile { display: grid; grid-template-columns: 44px minmax(0,1fr) auto 20px; align-items: center; gap: .75rem; text-align: left; }
  .supplier-page .supplier-file-row { display: grid; grid-template-columns: 20px minmax(0,1fr) auto; align-items: center; gap: .5rem; border-radius: .75rem; border: 1px solid #e7e5e4; background: #fff; padding: .75rem; text-align: left; }
  .supplier-page .finance-metric strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 1.12rem; line-height: 1; font-weight: 950; color: #1c1917; }
  .supplier-page .finance-metric .supplier-data-copy span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 950; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .supplier-page .finance-metric small { display: none; }
  .supplier-page .finance-progress { display: grid; gap: .5rem; padding: .5rem 0; }
  .supplier-page .finance-progress > div { display: flex; align-items: center; justify-content: space-between; }
  .supplier-page .finance-progress i { display: block; height: .5rem; overflow: hidden; border-radius: 999px; background: #f5f5f4; }
  .supplier-page .finance-progress b { display: block; height: 100%; border-radius: 999px; background: #ea580c; }
  .supplier-page .finance-bars { display: grid; height: 11rem; grid-template-columns: repeat(7,minmax(0,1fr)); align-items: end; gap: .5rem; }
  .supplier-page .finance-bars > div { display: grid; justify-items: center; }
  .supplier-page .finance-bars i { display: block; width: 1.5rem; border-radius: 999px 999px 0 0; background: #ea580c; }
  .supplier-page .table-wrap { overflow-x: auto; border-radius: .75rem; border: 1px solid #e7e5e4; background: #fff; }
  .supplier-page table { width: 100%; border-collapse: collapse; }
  .supplier-page th { background: #fafaf9; padding: .75rem; text-align: left; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #78716c; }
  .supplier-page td { border-top: 1px solid #f5f5f4; padding: .75rem; }
  .supplier-page .empty { border-radius: .75rem; border: 1px dashed #d6d3d1; background: #fafaf9; padding: 1.25rem; text-align: center; font-size: .875rem; font-weight: 700; color: #78716c; }
  @media (min-width: 640px) {
    .supplier-page h1 { font-size: 34px; }
    .supplier-page .supplier-next-actions { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }
  }
  @media (max-width: 767px) {
    .supplier-page .app-page-header:has(.supplier-back-button),
    .supplier-page .supplier-heading:has(.supplier-back-button) {
      margin-top: 1.75rem;
      overflow: visible;
    }
    .supplier-page .app-page-header:has(.supplier-back-button) > div:first-child,
    .supplier-page .supplier-heading:has(.supplier-back-button) > div:first-child {
      min-height: 0;
      padding-left: 0;
    }
    .supplier-page .supplier-back-button {
      position: absolute;
      top: -1.72rem;
      left: 0;
      z-index: 3;
      width: auto;
      min-height: 1.25rem;
      padding: 0;
      border: 0;
      background: transparent;
      box-shadow: none;
      color: #78716c;
      font-size: .75rem;
      font-weight: 800;
      gap: .25rem;
    }
  }
  @media (min-width: 1024px) {
    .supplier-page .supplier-metrics-grid,
    .supplier-page .supplier-order-highlights,
    .supplier-page .finance-metrics { grid-template-columns: repeat(4,minmax(0,1fr)); }
    .supplier-page .supplier-next-action { grid-template-columns: 48px minmax(0,1fr) auto; }
    .supplier-page .supplier-orders-layout { grid-template-columns: 360px minmax(0,1fr); }
    .supplier-page .supplier-detail-grid,
    .supplier-page .supplier-more-grid,
    .supplier-page .finance-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  }
`;

function Icon({ icon, name, size = 16 }) {
  return <span dangerouslySetInnerHTML={{ __html: icon(name, size) }} />;
}

function Topbar({ actions, subtitle, title }) {
  return (
    <header className="topbar app-page-header supplier-page-header">
      <div><span className="eyebrow">{title}</span><h1 className="page-title">{title}</h1><div className="page-subtitle">{subtitle}</div></div>
      {actions ? <div className="actions">{actions}</div> : null}
    </header>
  );
}

function SupplierBackButton({ icon }) {
  return <button className="admin-back-button supplier-back-button" data-view="fornecedor-mais" aria-label="Voltar para mais"><Icon icon={icon} name="arrow-left" size={15} /><span>Voltar</span></button>;
}

function getUserName(state, userId) {
  return state.users.find((user) => user.id === userId)?.name ?? "Usuario";
}

function supplierConsolidations(state, user) {
  return state.consolidations
    .filter((item) => item.supplierId === user?.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function supplierDocuments(state, consolidationId) {
  return state.consolidationDocuments.filter((item) => item.consolidationId === consolidationId);
}

function supplierStatusCount(rows, status) {
  return rows.filter((item) => item.status === status).length;
}

function supplierActionLabel(consolidation, nextSupplierStep) {
  const next = nextSupplierStep(consolidation.status);
  return next?.label ?? "Entrega concluida";
}

function foodSummary(summary) {
  return Object.entries(summary.byMeal).map(([meal, data]) => `${data.total} ${meal}`).join(" - ");
}

function ConsolidatedSummary({ requestMealDescription, state, summary }) {
  if (!summary.rows.length) return <div className="empty">Sem pedidos recebidos para enviar ao fornecedor.</div>;
  return (
    <>
      {Object.entries(summary.byMeal).map(([meal, data]) => (
        <div className="consolidated-block" key={meal}>
          <div className="consolidated-row total-line"><span>{meal}</span><span>{data.total}</span></div>
          {requestMealDescription(data.rows[0]) ? <div className="consolidated-description">{requestMealDescription(data.rows[0])}</div> : null}
          {data.rows.map((request) => <div className="consolidated-row" key={request.id}><span>{meal === "Marmita Campo" ? getUserName(state, request.leaderId) : request.location}</span><strong>{request.quantity}</strong></div>)}
        </div>
      ))}
      <div className="consolidated-row total-line"><span>Total geral</span><span>{summary.total} refeicoes</span></div>
    </>
  );
}

function ConsolidationTimeline({ consolidation, formatDateTime, state }) {
  const steps = [["enviado", "Enviado ao fornecedor"], ["confirmado", "Fornecedor confirmou recebimento"], ["producao", "Fornecedor confirmou producao"], ["saiu_entrega", "Saida para entrega registrada"], ["entregue", "Entrega concluida"]];
  return (
    <div className="timeline">
      {steps.map(([step, label]) => {
        const confirmation = consolidation.confirmations.find((item) => item.step === step);
        return <div className="timeline-item" key={step}><div className="timeline-dot" style={{ background: confirmation ? "var(--orange)" : "var(--line)" }} /><div className="timeline-body"><strong>{label}</strong><br />{confirmation ? `${getUserName(state, confirmation.userId)} - ${formatDateTime(confirmation.at)}` : "Aguardando"}</div></div>;
      })}
    </div>
  );
}

function RequestTable({ formatDate, formatDateTime, rows, state, STATUS_LABEL }) {
  if (!rows.length) return <div className="empty">Nenhum pedido encontrado.</div>;
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Data</th><th>Encarregado</th><th>Tipo</th><th>Local</th><th>Qtd</th><th>Status</th><th>Atualizacao</th></tr></thead>
        <tbody>
          {rows.map((request) => (
            <tr key={request.id}>
              <td>{formatDate(request.date)}</td>
              <td><strong>{getUserName(state, request.leaderId)}</strong></td>
              <td>{request.mealType}</td>
              <td>{request.location}</td>
              <td><strong>{request.quantity}</strong></td>
              <td><span className={`badge ${request.status}`}>{STATUS_LABEL[request.status] ?? request.status}</span></td>
              <td>{formatDateTime(request.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OriginRequestCards({ formatDate, formatDateTime, rows, state, STATUS_LABEL }) {
  if (!rows.length) return <div className="empty">Nenhum pedido de origem encontrado.</div>;
  return (
    <div className="supplier-origin-list">
      {rows.map((request) => (
        <article className="supplier-origin-card" key={request.id}>
          <div><strong>{request.mealType}</strong><span className={`badge ${request.status}`}>{STATUS_LABEL[request.status] ?? request.status}</span></div>
          <p>{getUserName(state, request.leaderId)} - {request.location}</p>
          <footer><span>{formatDate(request.date)}</span><b>{request.quantity} ref.</b><small>{formatDateTime(request.updatedAt)}</small></footer>
        </article>
      ))}
    </div>
  );
}

function SupplierMetric({ accent = "", detail, icon, iconName, label, value }) {
  return (
    <article className={`supplier-metric ${accent} transition duration-200 hover:-translate-y-0.5`}>
      {iconName ? <span className="supplier-data-icon"><Icon icon={icon} name={iconName} size={15} /></span> : null}
      <div className="supplier-data-copy">
        <strong>{value}</strong>
        <span>{label}</span>
        <small>{detail}</small>
      </div>
    </article>
  );
}

function EmptyNextAction({ icon }) {
  return (
    <section className="supplier-next-action is-empty">
      <span className="supplier-next-icon"><Icon icon={icon} name="package" size={22} /></span>
      <div><span className="eyebrow">Tudo em dia</span><h2>Sem acao pendente</h2><p>Quando o administrador enviar um consolidado, ele aparecera aqui.</p></div>
    </section>
  );
}

function SupplierNextAction(props) {
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

function SupplierQueueRow(props) {
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

function Dashboard(props) {
  const { formatDate, getConsolidationSummary, icon, state, user } = props;
  const rows = supplierConsolidations(state, user);
  const activeRows = rows.filter((item) => !["entregue", "rascunho"].includes(item.status));
  const priority = [...activeRows].sort((a, b) => {
    const rank = { enviado: 0, confirmado: 1, producao: 2, saiu_entrega: 3 };
    return (rank[a.status] ?? 9) - (rank[b.status] ?? 9) || new Date(a.date) - new Date(b.date);
  })[0];
  const totalToday = rows.filter((item) => item.date === state.settings.defaultMealDate).reduce((sum, item) => sum + getConsolidationSummary(state, item).total, 0);

  return (
    <section className="supplier-dashboard">
      <header className="supplier-heading">
        <div><span className="eyebrow">Fornecedor</span><h1>Home</h1><p>Pedidos recebidos, producao e entregas em um fluxo simples.</p></div>
        <button className="btn primary" data-view="fornecedor-pedidos"><Icon icon={icon} name="clipboard" size={15} />Pedidos</button>
      </header>
      <div className="supplier-metrics-grid">
        <SupplierMetric icon={icon} iconName="utensils" label="Recebidos do dia" value={totalToday} detail={`para ${formatDate(state.settings.defaultMealDate)}`} accent="accent" />
        <SupplierMetric icon={icon} iconName="clipboard" label="A confirmar" value={supplierStatusCount(rows, "enviado")} detail="pedidos recebidos" />
        <SupplierMetric icon={icon} iconName="clock" label="Em producao" value={supplierStatusCount(rows, "confirmado") + supplierStatusCount(rows, "producao")} detail="em preparo" />
        <SupplierMetric icon={icon} iconName="check" label="Entregues" value={supplierStatusCount(rows, "entregue")} detail="historico total" />
      </div>
      {priority ? <SupplierNextAction {...props} consolidation={priority} /> : <EmptyNextAction icon={icon} />}
      <section className="supplier-panel-card supplier-queue-card">
        <div className="supplier-section-heading"><div><span className="eyebrow">Fila operacional</span><h2>Pedidos prioritarios</h2></div><button className="text-action" data-view="fornecedor-pedidos">Ver todos <Icon icon={icon} name="arrow" size={15} /></button></div>
        <div className="supplier-queue">{activeRows.length ? activeRows.slice(0, 5).map((item) => <SupplierQueueRow {...props} consolidation={item} key={item.id} />) : <div className="empty">Nenhum pedido pendente no momento.</div>}</div>
      </section>
    </section>
  );
}

function OrderListItem(props) {
  const { consolidation, consolidationValue, formatDate, getConsolidationSummary, money, selected, STATUS_LABEL } = props;
  const summary = getConsolidationSummary(props.state, consolidation);
  return <button className={`supplier-order-list-item ${selected ? "selected" : ""}`} data-supplier-select={consolidation.id}><span className={`badge ${consolidation.status}`}>{STATUS_LABEL[consolidation.status] ?? consolidation.status}</span><strong>{foodSummary(summary)}</strong><small>{summary.total} refeicoes - {money(consolidationValue(consolidation))} - Entrega {formatDate(consolidation.date)}</small></button>;
}

function OrderDetail(props) {
  const { consolidation, consolidationValue, formatDate, getConsolidationSummary, icon, money, nextSupplierStep, requestMealDescription, STATUS_LABEL } = props;
  const summary = getConsolidationSummary(props.state, consolidation);
  const next = nextSupplierStep(consolidation.status);
  const highlights = Object.entries(summary.byMeal).map(([meal, data]) => `${meal}: ${data.total}`).join(" - ");
  const compositions = Object.entries(summary.byMeal).map(([meal, data]) => [meal, requestMealDescription(data.rows[0])]).filter(([, description]) => description);

  return (
    <article className="supplier-order-detail">
      <div className="supplier-detail-top"><div><span className="eyebrow">Pedido {consolidation.id.slice(0, 8).toUpperCase()}</span><h2>{summary.total} refeicoes para {formatDate(consolidation.date)}</h2></div><span className={`badge ${consolidation.status}`}>{STATUS_LABEL[consolidation.status] ?? consolidation.status}</span></div>
      <div className="supplier-order-highlights"><div><span>Alimentacao</span><strong>{highlights}</strong></div><div><span>Quantidade</span><strong>{summary.total} refeicoes</strong></div><div><span>Valor do pedido</span><strong>{money(consolidationValue(consolidation))}</strong></div><div><span>Entrega prevista</span><strong>{formatDate(consolidation.date)}</strong></div></div>
      {compositions.length ? <section className="supplier-composition"><h3>Composicao das marmitas</h3>{compositions.map(([meal, description]) => <p key={meal}><strong>{meal}:</strong> {description}</p>)}</section> : null}
      <div className="supplier-detail-actions"><button className="btn outline small" data-generate-romaneio={consolidation.id}>Gerar nota de fornecimento</button>{next ? <button className="btn primary" data-step={next.step} data-id={consolidation.id}>{next.label}</button> : null}</div>
      <div className="supplier-detail-grid"><section><h3>Itens consolidados</h3><ConsolidatedSummary {...props} summary={summary} /></section><section><h3>Rastreabilidade</h3><ConsolidationTimeline {...props} consolidation={consolidation} /></section></div>
      <section className="supplier-origin-requests"><h3>Pedidos de origem</h3><OriginRequestCards {...props} rows={summary.rows} /></section>
    </article>
  );
}

function Orders(props) {
  const { state, supplierOrderDate, supplierOrderStatus, selectedSupplierConsolidationId, user } = props;
  const rows = supplierConsolidations(state, user).filter((item) => {
    const matchesStatus = supplierOrderStatus === "todos" || (supplierOrderStatus === "ativos" ? !["entregue", "rascunho"].includes(item.status) : item.status === supplierOrderStatus);
    return matchesStatus && (!supplierOrderDate || item.date === supplierOrderDate);
  });
  const selected = rows.find((item) => item.id === selectedSupplierConsolidationId) ?? rows[0] ?? null;

  return (
    <section className="supplier-workspace">
      <Topbar title="Pedidos" subtitle="Fila de producao, entrega e acompanhamento" actions={<div className="filter-bar supplier-filter-bar">
        <select defaultValue={supplierOrderStatus} data-supplier-status><option value="ativos">Pedidos ativos</option><option value="todos">Todos os pedidos</option><option value="enviado">A confirmar</option><option value="confirmado">Em producao</option><option value="saiu_entrega">Em rota</option><option value="entregue">Entregues</option></select>
        <input type="date" defaultValue={supplierOrderDate} data-supplier-date />
        <button className="btn outline small" data-supplier-clear-filter>Limpar filtros</button>
      </div>} />
      <div className="supplier-orders-layout"><div className="supplier-order-list">{rows.length ? rows.map((item) => <OrderListItem {...props} consolidation={item} selected={item.id === selected?.id} key={item.id} />) : <div className="empty">Nenhum pedido encontrado.</div>}</div>{selected ? <OrderDetail {...props} consolidation={selected} /> : <div className="empty supplier-detail-empty">Selecione um pedido para ver os detalhes.</div>}</div>
    </section>
  );
}

function History(props) {
  const { formatDate, formatDateTime, getConsolidationSummary, state, user } = props;
  const rows = supplierConsolidations(state, user).filter((item) => item.status === "entregue");
  return (
    <section className="supplier-workspace">
      <Topbar title="Historico de entregas" subtitle="Pedidos concluidos pelo fornecedor" />
      <div className="supplier-history-list">{rows.length ? rows.map((item) => { const summary = getConsolidationSummary(state, item); const delivered = item.confirmations.find((confirmation) => confirmation.step === "entregue"); return <article className="supplier-history-row" key={item.id}><div><span className="badge entregue">Entregue</span><h2>{formatDate(item.date)} - {summary.total} refeicoes</h2><p>Concluido em {formatDateTime(delivered?.at)}</p></div><div className="supplier-history-actions"><button className="btn outline small" data-generate-romaneio={item.id}>Nota de fornecimento</button><button className="btn outline small" data-view="fornecedor-documentos">Documentos</button></div></article>; }) : <div className="empty">Nenhuma entrega concluida ainda.</div>}</div>
    </section>
  );
}

function More(props) {
  const { consolidationValue, formatDateTime, icon, money, state, user } = props;
  const rows = supplierConsolidations(state, user);
  const delivered = rows.filter((item) => item.status === "entregue");
  const documents = state.consolidationDocuments.filter((item) => rows.some((row) => row.id === item.consolidationId));
  const openValue = rows
    .filter((item) => item.status !== "entregue" && item.status !== "rascunho")
    .reduce((sum, item) => sum + consolidationValue(item), 0);
  const latestDoc = documents[0];
  const tools = [
    ["fornecedor-documentos", "package", "Documentos", `${documents.length} arquivo${documents.length === 1 ? "" : "s"}`, latestDoc ? `Ultimo envio ${formatDateTime(latestDoc.createdAt)}` : "Notas e comprovantes"],
    ["fornecedor-financeiro", "chart", "Financeiro", money(openValue), `${delivered.length} entrega${delivered.length === 1 ? "" : "s"} concluida${delivered.length === 1 ? "" : "s"}`]
  ];

  return (
    <section className="supplier-more">
      <header className="supplier-heading supplier-more-heading">
        <div><span className="eyebrow">Mais</span><h1>Documentos e financeiro</h1><p>Acesse arquivos fiscais, notas de fornecimento e valores sem lotar a barra principal.</p></div>
      </header>
      <div className="supplier-more-grid">
        {tools.map(([view, iconName, title, value, text]) => (
          <button className="supplier-more-tile" data-view={view} key={view}>
            <span><Icon icon={icon} name={iconName} size={22} /></span>
            <div><strong>{title}</strong><small>{text}</small></div>
            <b>{value}</b>
            <i><Icon icon={icon} name="arrow" size={16} /></i>
          </button>
        ))}
      </div>
    </section>
  );
}

function Documents(props) {
  const { formatDate, formatDateTime, getConsolidationSummary, icon, state, STATUS_LABEL, user } = props;
  const rows = supplierConsolidations(state, user);
  return (
    <section className="supplier-workspace">
      <Topbar title="Documentos" subtitle="Notas de fornecimento e notas fiscais anexadas" actions={<SupplierBackButton icon={icon} />} />
      <div className="supplier-documents-list">{rows.length ? rows.map((consolidation) => { const summary = getConsolidationSummary(state, consolidation); const docs = supplierDocuments(state, consolidation.id); return (
        <article className="supplier-document-card" key={consolidation.id}>
          <div className="supplier-document-title"><div><span className="eyebrow">{formatDate(consolidation.date)}</span><h2>Pedido {consolidation.id.slice(0, 8).toUpperCase()}</h2><p>{summary.total} refeicoes - {STATUS_LABEL[consolidation.status] ?? consolidation.status}</p></div><button className="btn outline small" data-generate-romaneio={consolidation.id}>Gerar nota</button></div>
          <div className="supplier-document-body"><div><strong>Nota fiscal</strong><small>Anexe o PDF fiscal emitido fora do sistema.</small></div><label className="btn primary small supplier-upload-label">Anexar PDF<input type="file" accept="application/pdf" data-document-upload={consolidation.id} hidden /></label></div>
          {docs.length ? <div className="supplier-attached-files">{docs.map((doc) => <button className="supplier-file-row" data-download-document={doc.id} key={doc.id}><Icon icon={icon} name="package" size={16} /><span>{doc.originalName}</span><small>{formatDateTime(doc.createdAt)}</small></button>)}</div> : <div className="supplier-no-documents">Nenhuma nota fiscal anexada.</div>}
        </article>
      ); }) : <div className="empty">Ainda nao ha pedidos para documentar.</div>}</div>
    </section>
  );
}

function Financeiro(props) {
  const { formatDate, icon, money, requestValue, state, sumQty, user, STATUS_LABEL } = props;
  const sourceRows = supplierConsolidations(state, user).flatMap((consolidation) => props.getConsolidationSummary(state, consolidation).rows);
  const month = state.settings.defaultMealDate.slice(0, 7);
  const rows = sourceRows.filter((request) => request.date.startsWith(month));
  const delivered = rows.filter((request) => request.status === "entregue");
  const projected = rows.reduce((sum, request) => sum + requestValue(request), 0);
  const deliveredValue = delivered.reduce((sum, request) => sum + requestValue(request), 0);
  const pendingValue = projected - deliveredValue;
  const byMeal = state.mealTypes.map((meal) => ({ label: meal.label, value: rows.filter((request) => request.mealTypeId === meal.id).reduce((sum, request) => sum + requestValue(request), 0) })).filter((item) => item.value > 0);
  const max = Math.max(...byMeal.map((item) => item.value), 1);
  const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(`${state.settings.defaultMealDate}T12:00:00`); date.setDate(date.getDate() - (6 - index)); const key = date.toISOString().slice(0, 10); return { key, label: String(date.getDate()).padStart(2, "0"), value: sourceRows.filter((request) => request.date === key).reduce((sum, request) => sum + requestValue(request), 0) }; });
  const dailyMax = Math.max(...days.map((item) => item.value), 1);

  return (
    <section className="finance-page">
      <Topbar title="Financeiro do fornecedor" subtitle={`Analise de ${month}`} actions={<><SupplierBackButton icon={icon} /><button className="btn primary" data-export-finance="fornecedor"><Icon icon={icon} name="chart" size={15} />Gerar PDF</button></>} />
      <div className="finance-metrics">
        <article className="finance-metric accent"><span className="supplier-data-icon"><Icon icon={icon} name="chart" size={15} /></span><div className="supplier-data-copy"><strong>{money(projected)}</strong><span>Faturamento previsto</span><small>{sumQty(rows)} refeicoes no mes</small></div></article>
        <article className="finance-metric"><span className="supplier-data-icon"><Icon icon={icon} name="truck" size={15} /></span><div className="supplier-data-copy"><strong>{money(deliveredValue)}</strong><span>Faturado</span><small>{delivered.length} pedidos entregues</small></div></article>
        <article className="finance-metric"><span className="supplier-data-icon"><Icon icon={icon} name="clock" size={15} /></span><div className="supplier-data-copy"><strong>{money(pendingValue)}</strong><span>Em aberto</span><small>pedidos ainda em operacao</small></div></article>
        <article className="finance-metric"><span className="supplier-data-icon"><Icon icon={icon} name="utensils" size={15} /></span><div className="supplier-data-copy"><strong>{money(rows.length ? projected / sumQty(rows) : 0)}</strong><span>Ticket medio</span><small>por refeicao</small></div></article>
      </div>
      <div className="finance-grid"><article className="finance-card"><h2>Composicao por refeicao</h2>{byMeal.length ? byMeal.map((item) => <div className="finance-progress" key={item.label}><div><span>{item.label}</span><strong>{money(item.value)}</strong></div><i><b style={{ width: `${Math.max(3, Math.round((item.value / max) * 100))}%` }} /></i></div>) : <div className="empty">Sem movimentacao no periodo.</div>}</article><article className="finance-card"><h2>Evolucao dos ultimos 7 dias</h2><div className="finance-bars">{days.map((item) => <div key={item.key}><strong>{item.value ? money(item.value).replace("R$", "") : "-"}</strong><i style={{ height: `${Math.max(5, Math.round((item.value / dailyMax) * 126))}px` }} /><span>{item.label}</span></div>)}</div></article></div>
      <article className="finance-card finance-table-card"><h2>Movimentacoes do periodo</h2><div className="table-wrap"><table><thead><tr><th>Data</th><th>Tipo</th><th>Quantidade</th><th>Valor</th><th>Status</th></tr></thead><tbody>{[...rows].sort((a, b) => b.date.localeCompare(a.date)).map((request) => <tr key={request.id}><td>{formatDate(request.date)}</td><td>{request.mealType}</td><td>{request.quantity}</td><td><strong>{money(requestValue(request))}</strong></td><td><span className={`badge ${request.status}`}>{STATUS_LABEL[request.status] ?? request.status}</span></td></tr>)}</tbody></table></div></article>
    </section>
  );
}

export function SupplierReactPage(props) {
  let content;
  if (props.page === "fornecedor-pedidos") content = <Orders {...props} />;
  else if (props.page === "fornecedor-historico") content = <History {...props} />;
  else if (props.page === "fornecedor-mais") content = <More {...props} />;
  else if (props.page === "fornecedor-documentos") content = <Documents {...props} />;
  else if (props.page === "fornecedor-financeiro") content = <Financeiro {...props} />;
  else content = <Dashboard {...props} />;
  return <><style>{supplierPageStyles}</style><div className="supplier-page">{content}</div></>;
}
