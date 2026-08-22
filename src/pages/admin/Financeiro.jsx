import React from "react";
import { AdminBackButton, AdminFilterMenu, AdminReceiptHeader, Icon, statusLabel } from "./shared.jsx";
import { requestActualQuantity, requestFinancialValue as resolveRequestFinancialValue } from "../../services/store-v2.js";

const baseAdminScreenStyles = `
  .admin-page {
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    display: grid;
    gap: 0.75rem;
    color: #1c1917;
  }
  .admin-page h1,
  .admin-page h2,
  .admin-page h3,
  .admin-page p { margin: 0; }
  .admin-page h1 { font-size: 26px; line-height: 1; font-weight: 900; letter-spacing: 0; }
  .admin-page h2 { font-size: 1.125rem; font-weight: 900; color: #1c1917; }
  .admin-page h3 { font-weight: 900; }
  .admin-page p { font-size: 0.875rem; color: #78716c; }
  .admin-page .eyebrow,
  .admin-page .compact-kicker,
  .admin-page .stat-label,
  .admin-page .finance-metric span,
  .admin-page .request-card-quantity span {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: #c2410c;
  }
  .admin-page .page-subtitle,
  .admin-page .stat-sub,
  .admin-page .finance-metric small,
  .admin-page .request-card-quantity span { color: #78716c; font-size: .75rem; font-weight: 700; }
  .admin-page .section-title { margin-bottom: .75rem; font-size: 1rem; font-weight: 900; color: #1c1917; }
  .admin-page .app-page-header,
  .admin-page .admin-list-header,
  .admin-page .admin-send-header {
    position: relative;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border-radius: 18px;
    border: 1px solid #e7e5e4;
    border-left: 5px solid #ea580c;
    background: rgba(255,255,255,.9);
    padding: 1rem;
    box-shadow: 0 12px 30px rgba(25,27,24,.055);
  }
  .admin-page .actions,
  .admin-page .button-row,
  .admin-page .admin-list-actions,
  .admin-page .admin-send-actions,
  .admin-page .request-card-actions,
  .admin-page .week-nav { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
  .admin-page .admin-list-actions,
  .admin-page .admin-send-actions { justify-content: flex-end; }
  .admin-page .btn,
  .admin-page .icon-action,
  .admin-page .admin-back-button {
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
  .admin-page .btn:hover,
  .admin-page .icon-action:hover { transform: translateY(-2px); }
  .admin-page .btn.primary { border-color: #ea580c; background: #ea580c; color: #fff; box-shadow: 0 10px 22px rgba(239,91,29,.2); }
  .admin-page .btn.primary:hover { background: #c2410c; }
  .admin-page .btn.outline,
  .admin-page .icon-action,
  .admin-page .admin-back-button { border-color: #d6d3d1; background: #fff; color: #1c1917; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .btn.danger,
  .admin-page .icon-action.danger { border-color: #fecaca; background: #fef2f2; color: #b91c1c; }
  .admin-page .btn.small { min-height: 2.25rem; padding: 0 .75rem; font-size: .75rem; }
  .admin-page .badge { display: inline-flex; min-height: 1.75rem; align-items: center; border-radius: 999px; border: 1px solid #e7e5e4; background: #f5f5f4; padding: 0 .625rem; font-size: 11px; font-weight: 900; text-transform: uppercase; color: #57534e; }
  .admin-page .badge.enviado { border-color: #fed7aa; background: #fff7ed; color: #c2410c; }
  .admin-page .badge.entregue { border-color: #a7f3d0; background: #ecfdf5; color: #047857; }
  .admin-page .badge.cancelado { border-color: #fecaca; background: #fef2f2; color: #b91c1c; }
  .admin-page .badge.cancelado_confirmado { border-color: #fecaca; background: #fef2f2; color: #991b1b; }
  .admin-page .badge.confirmado { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
  .admin-page .badge.producao { border-color: #fde68a; background: #fffbeb; color: #b45309; }
  .admin-page .badge.saiu_entrega { border-color: #a7f3d0; background: #ecfdf5; color: #047857; }
  @media (min-width: 640px) { .admin-page h1 { font-size: 34px; } }
`;

const financeiroStyles = `
  .admin-page .finance-page { display: grid; gap: .75rem; }
  .admin-page .finance-page > .finance-hero { display: none; }
  .admin-page .finance-mobile-movements { display: none; }
  .admin-page .finance-movements-card { max-height: 30rem; display: grid; grid-template-rows: auto minmax(0,1fr); }
  .admin-page .finance-movements-scroll { min-height: 0; overflow: auto; padding-right: .15rem; }
  .admin-page .finance-hero { overflow: visible; border-radius: 22px; border: 1px solid #27251f; background: #242622; box-shadow: 0 18px 40px -22px rgba(0,0,0,.55); isolation: isolate; }
  .admin-page .finance-hero-head { position: relative; display: grid; gap: .85rem; border-radius: 22px 22px 0 0; background: linear-gradient(135deg, #242622, #1c1d1b); padding: 1rem; color: #fff; }
  .admin-page .finance-hero-head::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .055; background-image: radial-gradient(currentColor 1.4px, transparent 1.4px); background-size: 16px 16px; }
  .admin-page .finance-hero-head > * { position: relative; z-index: 1; }
  .admin-page .finance-hero-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
  .admin-page .finance-hero-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: .5rem; }
  .admin-page .finance-hero .compact-kicker { color: #fed7aa; }
  .admin-page .finance-hero h1 { color: #fff; }
  .admin-page .finance-hero p { max-width: 32rem; color: rgba(255,255,255,.58); font-size: .86rem; font-weight: 700; }
  .admin-page .finance-holes { pointer-events: none; display: flex; justify-content: space-around; padding: 0 1rem; transform: translateY(50%); }
  .admin-page .finance-holes span { width: .65rem; height: .65rem; border-radius: 999px; background: #fffefa; }
  .admin-page .finance-metrics-strip { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: .5rem; border-radius: 0 0 20px 20px; background: #f5f1ea; padding: 1.25rem 1rem .85rem; }
  .admin-page .finance-metric { border-radius: 18px; border: 1px solid #ded9d1; background: rgba(255,254,250,.94); padding: 1rem; box-shadow: 0 12px 30px rgba(25,27,24,.055); }
  .admin-page .finance-metrics-strip .finance-metric { border-radius: 0 1rem 1rem .375rem; border-left: 2px dashed #d6d3d1; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .finance-metric.accent { border-color: #ea580c; background: #ea580c; color: #fff; }
  .admin-page .finance-metric.accent span,
  .admin-page .finance-metric.accent small { color: rgba(255,255,255,.72); }
  .admin-page .finance-metric strong { display: block; margin-top: .42rem; overflow-wrap: anywhere; font-size: clamp(1.05rem, .84rem + .62vw, 1.45rem); line-height: 1; font-weight: 950; color: inherit; }
  .admin-page .report-chart-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .75rem; }
  .admin-page .report-chart-card { min-width: 0; display: grid; gap: .85rem; border-radius: 16px; border: 1px solid #ded9d1; border-left: 2px dashed #d6d3d1; background: #fffefa; padding: 1rem; box-shadow: 0 12px 30px rgba(25,27,24,.055); }
  .admin-page .report-chart-card.is-emphasis { border-color: #fed7aa; background: #fff7ed; }
  .admin-page .report-chart-head { display: flex; align-items: flex-start; justify-content: space-between; gap: .75rem; }
  .admin-page .report-chart-head div { min-width: 0; display: grid; gap: .18rem; }
  .admin-page .report-chart-head h2 { font-size: .95rem; line-height: 1.1; }
  .admin-page .report-chart-head p { font-size: .76rem; font-weight: 700; line-height: 1.35; }
  .admin-page .report-chart-chip { border-radius: 999px; background: #1c1917; padding: .36rem .52rem; color: #fff; font-size: 10px; font-weight: 950; white-space: nowrap; }
  .admin-page .report-bars { display: grid; gap: .55rem; }
  .admin-page .report-bar-row { display: grid; grid-template-columns: minmax(5.8rem,.72fr) minmax(0,1fr) auto; align-items: center; gap: .55rem; }
  .admin-page .report-bar-label { min-width: 0; overflow: hidden; color: #44403c; font-size: .76rem; font-weight: 900; text-overflow: ellipsis; white-space: nowrap; }
  .admin-page .report-bar-track { overflow: hidden; height: .72rem; border-radius: 999px; background: #e7e5e4; }
  .admin-page .report-bar-fill { display: block; height: 100%; min-width: 3px; border-radius: inherit; background: var(--bar-color, #c2410c); }
  .admin-page .report-bar-value { color: #1c1917; font-size: .76rem; font-weight: 950; text-align: right; white-space: nowrap; }
  .admin-page .report-column-chart { min-height: 12rem; display: grid; grid-auto-flow: column; grid-auto-columns: minmax(1.8rem,1fr); align-items: end; gap: .38rem; border-bottom: 1px solid #d6d3d1; padding-top: .5rem; }
  .admin-page .report-column { min-width: 0; display: grid; grid-template-rows: auto minmax(1rem,1fr) auto; align-items: end; gap: .32rem; height: 100%; text-align: center; }
  .admin-page .report-column strong { color: #44403c; font-size: .62rem; font-weight: 900; }
  .admin-page .report-column i { display: block; width: 100%; min-height: .18rem; border-radius: .45rem .45rem 0 0; background: linear-gradient(180deg, #ea580c, #9a3412); }
  .admin-page .report-column span { overflow: hidden; color: #78716c; font-size: .62rem; font-weight: 900; text-overflow: ellipsis; white-space: nowrap; }
  .admin-page .report-empty { border-radius: .9rem; border: 1px dashed #d6d3d1; background: #fafaf9; padding: 1rem; color: #78716c; font-size: .82rem; font-weight: 800; text-align: center; }
  @media (max-width: 767px) {
    .admin-page .finance-hero-row { display: grid; gap: .8rem; }
    .admin-page .finance-hero-actions { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }
    .admin-page .finance-metrics-strip { grid-template-columns: repeat(2,minmax(0,1fr)); padding-inline: .75rem; }
    .admin-page .finance-desktop-movements { display: none; }
    .admin-page .finance-mobile-movements { display: grid; gap: .5rem; }
    .admin-page .finance-mobile-row { display: grid; gap: .45rem; border-radius: .85rem; border: 1px solid #e7e5e4; border-left: 2px dashed #d6d3d1; background: #fffefa; padding: .65rem; }
    .admin-page .finance-mobile-row-top { display: flex; align-items: flex-start; justify-content: space-between; gap: .55rem; }
    .admin-page .finance-mobile-row h3 { margin: 0; font-size: .84rem; font-weight: 950; color: #1c1917; }
    .admin-page .finance-mobile-row time { font-size: .68rem; font-weight: 800; color: #78716c; }
    .admin-page .finance-mobile-row-meta { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .35rem; }
    .admin-page .finance-mobile-row-meta span { border-radius: .55rem; background: #f5f1ea; padding: .38rem .45rem; font-size: .68rem; font-weight: 850; color: #78716c; }
    .admin-page .finance-mobile-row-meta strong { display: block; margin-top: .12rem; overflow-wrap: anywhere; font-size: .82rem; line-height: 1; font-weight: 950; color: #1c1917; }
    .admin-page .finance-mobile-row .badge { width: max-content; min-height: 1.45rem; padding-inline: .5rem; font-size: 9px; }
    .admin-page .report-chart-grid { grid-template-columns: 1fr; }
    .admin-page .report-chart-card { padding: .75rem; border-radius: 14px; }
    .admin-page .report-chart-head { display: grid; }
    .admin-page .report-chart-chip { justify-self: start; }
    .admin-page .report-bar-row { grid-template-columns: minmax(4.9rem,.64fr) minmax(0,1fr) auto; gap: .4rem; }
    .admin-page .report-column-chart { overflow-x: auto; grid-auto-columns: 2.2rem; }
  }
`;

function FinanceMetric({ accent = false, icon, iconName, label, value, hint }) {
  return (
    <article className={`finance-metric ${accent ? "accent" : ""}`}>
      {iconName ? <span className="data-card-icon"><Icon icon={icon} name={iconName} size={15} /></span> : null}
      <div className="data-card-copy">
        <strong>{value}</strong>
        <span>{label}</span>
        {hint ? <small>{hint}</small> : null}
      </div>
    </article>
  );
}

const REPORT_COLORS = ["#ea580c", "#1c1917", "#0f766e", "#2563eb", "#a16207", "#7c3aed", "#be123c", "#64748b"];

function clampPercent(value, max = 100) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.min(max, Math.max(0, value));
}

function FinanceChartCard({ children, className = "", kicker, title, subtitle, chip }) {
  return (
    <article className={`report-chart-card ${className}`.trim()}>
      <header className="report-chart-head">
        <div>
          {kicker ? <span className="compact-kicker">{kicker}</span> : null}
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {chip ? <span className="report-chart-chip">{chip}</span> : null}
      </header>
      {children}
    </article>
  );
}

function FinanceEmptyChart() {
  return <div className="report-empty">Sem dados suficientes no periodo filtrado.</div>;
}

function FinanceHorizontalBars({ items, format, limit = 8 }) {
  const safeItems = items.slice(0, limit);
  const max = Math.max(...safeItems.map((item) => Number(item.value ?? 0)), 1);
  if (!safeItems.length) return <FinanceEmptyChart />;
  return (
    <div className="report-bars">
      {safeItems.map((item, index) => {
        const value = Number(item.value ?? 0);
        return (
          <div className="report-bar-row" key={item.label}>
            <span className="report-bar-label" title={item.label}>{item.label}</span>
            <span className="report-bar-track"><b className="report-bar-fill" style={{ "--bar-color": REPORT_COLORS[index % REPORT_COLORS.length], width: `${clampPercent((value / max) * 100)}%` }} /></span>
            <span className="report-bar-value">{format(value)}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Financeiro(props) {
  const { financeFilter, financePeriodLabel, financeRows, formatDate, icon, money, state, STATUS_LABEL } = props;
  const currentFilter = financeFilter ?? { range: "all", start: "", end: "" };
  const rows = financeRows ?? [];
  const periodLabel = financePeriodLabel ?? "Todo periodo";
  const isAllPeriod = currentFilter.range === "all";
  const isCustomPeriod = currentFilter.range === "custom";
  const delivered = rows.filter((request) => request.status === "entregue");
  const actualQuantity = (request) => requestActualQuantity(state, request);
  const requestFinancialValue = (request) => resolveRequestFinancialValue(state, request);
  const projected = rows.reduce((sum, request) => sum + requestFinancialValue(request), 0);
  const deliveredValue = delivered.reduce((sum, request) => sum + requestFinancialValue(request), 0);
  const pendingValue = projected - deliveredValue;
  const mealCount = rows.reduce((sum, request) => sum + actualQuantity(request), 0);
  const byMeal = Object.values(rows.reduce((acc, request) => {
    const label = request.mealType || "Sem tipo";
    acc[label] ??= { label, value: 0 };
    acc[label].value += requestFinancialValue(request);
    return acc;
  }, {})).sort((a, b) => b.value - a.value);
  const bySection = Object.values(rows.reduce((acc, request) => {
    const label = request.sectionName || request.location || "Sem equipe";
    acc[label] ??= { label, value: 0 };
    acc[label].value += requestFinancialValue(request);
    return acc;
  }, {})).sort((a, b) => b.value - a.value);
  const sortedRows = [...rows].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <style>{baseAdminScreenStyles + financeiroStyles}</style>
      <section className="finance-page">
        <AdminReceiptHeader
          className="admin-corner-action-receipt"
          kicker="Financeiro"
          title="Financeiro"
          totalValue={money(projected)}
          totalLabel={`previsto em ${periodLabel}`}
          description={`Custos, entregas e pendencias. Periodo: ${periodLabel}.`}
          actions={(
            <>
              <AdminBackButton icon={icon} />
              <AdminFilterMenu icon={icon}>
                <select data-finance-range defaultValue={currentFilter.range}>
                  <option value="all">Todo periodo</option>
                  <option value="day">Dia</option>
                  <option value="week">Semana</option>
                  <option value="month">Mes</option>
                  <option value="custom">Periodo personalizado</option>
                </select>
                <input type="date" defaultValue={currentFilter.start || state.settings.defaultMealDate} data-finance-start aria-label={isCustomPeriod ? "Inicio do periodo" : "Data de referencia"} disabled={isAllPeriod} />
                <input type="date" defaultValue={currentFilter.end || currentFilter.start || state.settings.defaultMealDate} data-finance-end aria-label="Fim do periodo" disabled={!isCustomPeriod} />
                <select data-finance-supplier defaultValue={currentFilter.supplierCompanyId || ""} aria-label="Fornecedor">
                  <option value="">Todos fornecedores</option>
                  {(state.supplierCompanies ?? []).map((supplier) => <option value={supplier.id} key={supplier.id}>{supplier.tradeName || supplier.legalName}</option>)}
                </select>
                <select data-finance-meal defaultValue={currentFilter.mealTypeId || ""} aria-label="Tipo de refeicao">
                  <option value="">Todas refeicoes</option>
                  {(state.mealCatalog ?? state.mealTypes ?? []).map((meal) => <option value={meal.id} key={meal.id}>{meal.label}</option>)}
                </select>
                <select data-finance-team defaultValue={currentFilter.teamId || ""} aria-label="Efetivo ou local">
                  <option value="">Todos locais</option>
                  {(state.workSections ?? []).map((section) => <option value={section.id} key={section.id}>{section.name}</option>)}
                </select>
                <select data-finance-origin defaultValue={currentFilter.originRole || ""} aria-label="Origem do pedido">
                  <option value="">Todas origens</option>
                  <option value="admin">Admin</option>
                  <option value="encarregado">Encarregado</option>
                </select>
                <button className="btn primary small" type="button" data-finance-apply>Aplicar</button>
              </AdminFilterMenu>
              <button className="btn primary" data-export-finance="admin">
                <Icon icon={icon} name="chart" size={15} />Gerar PDF
              </button>
            </>
          )}
          metrics={[
            { icon, iconName: "chart", label: "Custo total", value: money(projected) },
            { icon, iconName: "truck", label: "Pago/entregue", value: money(deliveredValue) },
            { icon, iconName: "clock", label: "Em aberto", value: money(pendingValue) },
            { icon, iconName: "utensils", label: "Ticket medio", value: money(mealCount ? projected / mealCount : 0) },
          ]}
        />
        <div className="report-chart-grid">
          <FinanceChartCard kicker="Financeiro" title="Custo por refeicao" subtitle="Estimativa baseada no preco unitario cadastrado." chip={money(projected)}>
            <FinanceHorizontalBars items={byMeal} format={money} />
          </FinanceChartCard>

          <FinanceChartCard kicker="Financeiro" title="Custo por equipe / trecho" subtitle="Frentes com maior impacto financeiro no periodo filtrado." chip={money(projected)}>
            <FinanceHorizontalBars items={bySection} format={money} />
          </FinanceChartCard>
        </div>

        {/* Card: Tabela de Movimentações */}
        <article className="finance-movements-card overflow-hidden rounded-2xl border border-l-2 border-dashed border-stone-300 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-stone-800">
            Movimentações do Período
          </h2>
          <div className="finance-movements-scroll">
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
                  <span>Consumido<strong>{actualQuantity(request)}</strong></span>
                  <span>Valor<strong>{money(requestFinancialValue(request))}</strong></span>
                </div>
              </article>
            ))}
            {!sortedRows.length && <div className="empty">Nenhuma movimentacao encontrada para o periodo.</div>}
          </div>
          <div className="finance-desktop-movements overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 shadow-inner">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-100 text-[10px] uppercase tracking-widest text-stone-500">
                <tr>
                  <th className="px-5 py-3.5 font-black">Data</th>
                  <th className="px-5 py-3.5 font-black">Tipo</th>
                  <th className="px-5 py-3.5 text-center font-black">Consumido</th>
                  <th className="px-5 py-3.5 font-black">Valor</th>
                  <th className="px-5 py-3.5 font-black">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {sortedRows.map((request) => (
                  <tr key={request.id} className="group/row cursor-default transition-colors hover:bg-stone-50">
                    <td className="px-5 py-3.5 font-medium text-stone-500">
                      {formatDate(request.date)}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-stone-700">
                      {request.mealType}
                    </td>
                    <td className="px-5 py-3.5 text-center font-bold text-stone-600">
                      {actualQuantity(request)}
                    </td>
                    <td className="px-5 py-3.5 font-black text-stone-900 transition-colors group-hover/row:text-blue-700">
                      {money(requestFinancialValue(request))}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${request.status}`}>
                        {statusLabel(STATUS_LABEL, request.status)}
                      </span>
                    </td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-sm font-bold text-stone-500">
                      Nenhuma movimentação encontrada para o período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        </article>

      </section>
    </>
  );
}
