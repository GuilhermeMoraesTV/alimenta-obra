import React from "react";
import { AdminBackButton, AdminFilterMenu, AdminReceiptHeader, Icon } from "./shared.jsx";
import { requestActualQuantity, requestFinancialValue } from "../../services/store-v2.js";

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
  .admin-page .compact-kicker,
  .admin-page .finance-metric span {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: #c2410c;
  }
  .admin-page .finance-metric small { color: #78716c; font-size: .75rem; font-weight: 700; }

  .admin-page .admin-filter-menu,
  .admin-page .export-menu { position: relative; }
  .admin-page .admin-filter-popover,
  .admin-page .export-options { position: absolute; right: 0; z-index: 20; margin-top: .5rem; display: grid; min-width: 10rem; gap: .5rem; border-radius: 1rem; border: 1px solid #e7e5e4; background: #fff; padding: .75rem; box-shadow: 0 25px 50px rgba(0,0,0,.18); }
  .admin-page .finance-hero-actions .admin-filter-popover,
  .admin-page .finance-hero-actions .export-options,
  .admin-page .admin-receipt-actions .admin-filter-popover,
  .admin-page .admin-receipt-actions .export-options {
    min-width: 11.5rem;
    width: 11.5rem;
    gap: .4rem;
    border-radius: .75rem;
    padding: .55rem;
    box-shadow: 0 16px 34px rgba(25,27,24,.2);
  }
  .admin-page .finance-hero-actions .export-options label {
    display: grid;
    gap: .18rem;
  }
  .admin-page .admin-receipt-actions .export-options label,
  .admin-page .admin-receipt-actions .admin-filter-popover label {
    display: grid;
    gap: .18rem;
  }
  .admin-page .finance-hero-actions .export-options label span,
  .admin-page .admin-receipt-actions .export-options label span,
  .admin-page .admin-receipt-actions .admin-filter-popover label span {
    color: #78716c;
    font-size: 8.5px;
    font-weight: 950;
    letter-spacing: .06em;
    text-transform: uppercase;
  }
  .admin-page .finance-hero-actions .admin-filter-popover input,
  .admin-page .finance-hero-actions .admin-filter-popover select,
  .admin-page .finance-hero-actions .admin-filter-popover button,
  .admin-page .finance-hero-actions .export-options input,
  .admin-page .finance-hero-actions .export-options select,
  .admin-page .finance-hero-actions .export-options button,
  .admin-page .admin-receipt-actions .admin-filter-popover input,
  .admin-page .admin-receipt-actions .admin-filter-popover select,
  .admin-page .admin-receipt-actions .admin-filter-popover button,
  .admin-page .admin-receipt-actions .export-options input,
  .admin-page .admin-receipt-actions .export-options select,
  .admin-page .admin-receipt-actions .export-options button {
    min-height: 1.9rem;
    border-radius: .5rem;
    padding-inline: .5rem;
    font-size: .72rem;
  }
`;

const relatoriosHeroStyles = `
  .admin-page > .finance-hero { display: none; }
  .admin-page .finance-hero { overflow: visible; border-radius: 18px; border: 1px solid #27251f; background: #242622; box-shadow: 0 12px 30px -15px rgba(0,0,0,.5); isolation: isolate; }
  .admin-page .finance-hero-head { position: relative; display: flex; flex-direction: column; gap: 0.85rem; border-radius: 18px 18px 0 0; background: linear-gradient(135deg, #242622, #1c1d1b); padding: 1.25rem; color: #fff; }
  .admin-page .finance-hero-head::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .055; background-image: radial-gradient(currentColor 1.4px, transparent 1.4px); background-size: 16px 16px; }
  .admin-page .finance-hero-head > * { position: relative; z-index: 1; }

  .admin-page .finance-hero-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }

  /* Botão de Voltar Redesenhado e Apontando para fora */
  .admin-page .sleek-back-btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.5rem 0.25rem 0; color: #a8a29e; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; background: transparent; border: none; cursor: pointer; transition: color 0.2s; margin-bottom: 0.25rem; }
  .admin-page .sleek-back-btn:hover { color: #fff; }

  .admin-page .finance-hero .compact-kicker { color: #fed7aa; display: block; margin-bottom: 0.25rem; }
  .admin-page .finance-hero h1 { color: #fff; font-size: 1.5rem; margin-bottom: 0.25rem; }
  .admin-page .finance-hero p { max-width: 32rem; color: rgba(255,255,255,.58); font-size: .85rem; font-weight: 600; }

  /* Botões de Ação (Filtro e Exportar) mais bonitos e proporcionais */
  .admin-page .finance-hero-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 0.5rem; }
  .admin-page .finance-hero-actions summary,
  .admin-page .finance-hero-actions .btn { display: inline-flex; min-height: 2rem; align-items: center; gap: 0.4rem; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.08); padding: 0 0.75rem; font-size: 0.75rem; font-weight: 800; color: #fff; cursor: pointer; transition: all 0.2s; }
  .admin-page .finance-hero-actions summary:hover,
  .admin-page .finance-hero-actions .btn:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.25); }

  .admin-page .finance-holes { pointer-events: none; display: flex; justify-content: space-around; padding: 0 1rem; transform: translateY(50%); }
  .admin-page .finance-holes span { width: .5rem; height: .5rem; border-radius: 999px; background: #fffefa; }

  .admin-page .finance-metrics-strip { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: .5rem; border-radius: 0 0 16px 16px; background: #f5f1ea; padding: 1.25rem 1rem 1rem; }
  .admin-page .finance-metric { border-radius: 12px; border: 1px solid #ded9d1; background: rgba(255,254,250,.94); padding: 0.85rem; box-shadow: 0 4px 12px rgba(25,27,24,.03); }
  .admin-page .finance-metrics-strip .finance-metric { border-radius: 0 .75rem .75rem .25rem; border-left: 2px dashed #d6d3d1; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .finance-metric.accent { border-color: #ea580c; background: #ea580c; color: #fff; }
  .admin-page .finance-metric.accent span,
  .admin-page .finance-metric.accent small { color: rgba(255,255,255,.72); }
  .admin-page .finance-metric strong { display: block; margin-top: 0.25rem; overflow-wrap: anywhere; font-size: 1.25rem; line-height: 1; font-weight: 950; color: inherit; }
  .admin-page .daily-report-card { display: grid; gap: .85rem; border-radius: 18px; border: 1px solid #ded9d1; border-left: 2px dashed #d6d3d1; background: #fffefa; padding: 1rem; box-shadow: 0 12px 30px rgba(25,27,24,.055); }
  .admin-page .daily-report-card.is-pending { background: #fafaf9; }
  .admin-page .daily-report-main { display: grid; grid-template-columns: 3rem minmax(0,1fr) auto; align-items: center; gap: .85rem; }
  .admin-page .daily-report-icon { display: grid; width: 3rem; height: 3rem; place-items: center; border-radius: .9rem; background: #fff0e8; color: #c2410c; }
  .admin-page .daily-report-copy { min-width: 0; display: grid; gap: .22rem; }
  .admin-page .daily-report-copy h2 { font-size: 1rem; line-height: 1.1; }
  .admin-page .daily-report-copy p { max-width: 48rem; font-size: .82rem; font-weight: 700; line-height: 1.35; }
  .admin-page .daily-report-status { justify-self: end; border-radius: 999px; border: 1px solid #bbf7d0; background: #ecfdf5; padding: .45rem .7rem; color: #047857; font-size: 10px; font-weight: 950; text-transform: uppercase; letter-spacing: .08em; white-space: nowrap; }
  .admin-page .daily-report-card.is-pending .daily-report-status { border-color: #fed7aa; background: #fff7ed; color: #c2410c; }
  .admin-page .daily-report-actions { display: flex; flex-wrap: wrap; gap: .5rem; }

  /* COMPACTAÇÃO EXTREMA PARA O MOBILE */
  .admin-page .report-analytics { display: grid; gap: .75rem; }
  .admin-page .report-chart-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .75rem; }
  .admin-page .report-chart-grid.wide { grid-template-columns: 1.08fr .92fr; }
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
  .admin-page .report-grouped-chart { display: grid; gap: .68rem; }
  .admin-page .report-grouped-bars { display: grid; gap: .68rem; }
  .admin-page .report-series-legend { display: flex; flex-wrap: wrap; gap: .45rem .75rem; }
  .admin-page .report-series-legend span { display: inline-flex; align-items: center; gap: .32rem; color: #57534e; font-size: .68rem; font-weight: 950; text-transform: uppercase; }
  .admin-page .report-series-legend i { width: .65rem; height: .65rem; border-radius: 999px; background: var(--series-color, #ea580c); }
  .admin-page .report-group-row { display: grid; grid-template-columns: minmax(5.8rem,.62fr) minmax(0,1fr); gap: .65rem; align-items: center; }
  .admin-page .report-group-stack { display: grid; gap: .28rem; }
  .admin-page .report-mini-track { height: .55rem; overflow: hidden; border-radius: 999px; background: #e7e5e4; }
  .admin-page .report-mini-track b { display: block; height: 100%; min-width: 3px; border-radius: inherit; }
  .admin-page .report-donut-wrap { display: grid; grid-template-columns: 9rem minmax(0,1fr); align-items: center; gap: 1rem; }
  .admin-page .report-donut { width: 9rem; aspect-ratio: 1; border-radius: 999px; background: conic-gradient(var(--donut-stops, #d6d3d1 0 100%)); position: relative; box-shadow: inset 0 0 0 1px rgba(0,0,0,.04); }
  .admin-page .report-donut::after { content: attr(data-center); position: absolute; inset: 1.95rem; display: grid; place-items: center; border-radius: inherit; background: #fffefa; color: #1c1917; font-size: 1rem; font-weight: 950; text-align: center; }
  .admin-page .report-legend { display: grid; gap: .45rem; }
  .admin-page .report-legend-row { display: grid; grid-template-columns: .55rem minmax(0,1fr) auto; align-items: center; gap: .45rem; color: #57534e; font-size: .76rem; font-weight: 850; }
  .admin-page .report-legend-dot { width: .55rem; height: .55rem; border-radius: 999px; background: var(--dot-color, #c2410c); }
  .admin-page .report-column-chart { min-height: 12rem; display: grid; grid-template-columns: repeat(var(--column-count, 1), minmax(0,1fr)); justify-content: stretch; align-items: end; gap: .7rem; border-bottom: 1px solid #d6d3d1; padding-top: .5rem; overflow-x: visible; }
  .admin-page .report-column { min-width: 0; display: grid; grid-template-rows: auto minmax(1rem,1fr) auto; align-items: end; gap: .32rem; height: 100%; text-align: center; }
  .admin-page .report-column strong { color: #44403c; font-size: .62rem; font-weight: 900; }
  .admin-page .report-column i { display: block; width: .55rem; justify-self: center; min-height: .18rem; border-radius: 999px 999px 0 0; background: var(--column-color, #ea580c); box-shadow: 0 0 0 1px rgba(28,25,23,.04); }
  .admin-page .report-column span { overflow: hidden; color: #78716c; font-size: .62rem; font-weight: 900; text-overflow: ellipsis; white-space: nowrap; }
  .admin-page .report-heatmap { display: grid; gap: .38rem; }
  .admin-page .report-heat-row { display: grid; grid-template-columns: 5.5rem repeat(var(--heat-count), minmax(2.2rem,1fr)); gap: .32rem; align-items: center; }
  .admin-page .report-heat-row strong { color: #44403c; font-size: .7rem; font-weight: 950; }
  .admin-page .report-heat-cell { min-height: 2rem; display: grid; place-items: center; border-radius: .45rem; background: color-mix(in srgb, #ea580c var(--heat, 0%), #f5f5f4); color: #1c1917; font-size: .68rem; font-weight: 950; }
  .admin-page .report-empty { border-radius: .9rem; border: 1px dashed #d6d3d1; background: #fafaf9; padding: 1rem; color: #78716c; font-size: .82rem; font-weight: 800; text-align: center; }

  @media (max-width: 767px) {
    .admin-page .finance-hero-head { padding: 0.75rem; gap: 0.5rem; }
    .admin-page .sleek-back-btn { font-size: 0.65rem; padding-bottom: 0; margin-bottom: 0; }
    .admin-page .finance-hero .compact-kicker { font-size: 9px; margin-bottom: 0.15rem; }
    .admin-page .finance-hero h1 { font-size: 1.15rem; margin-bottom: 0.15rem; }
    .admin-page .finance-hero p { font-size: 0.7rem; line-height: 1.2; }

    .admin-page .finance-hero-row { flex-direction: column; gap: 0.6rem; }
    .admin-page .finance-hero-actions { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; }
    .admin-page .finance-hero-actions summary,
    .admin-page .finance-hero-actions .btn { width: 100%; justify-content: center; min-height: 1.8rem; font-size: 0.7rem; padding: 0 0.5rem; }

    .admin-page .finance-metrics-strip { grid-template-columns: repeat(2,minmax(0,1fr)); padding: 1rem 0.5rem 0.6rem; gap: 0.4rem; }
    .admin-page .finance-metric { padding: 0.5rem; }
    .admin-page .finance-metric span { font-size: 9px; }
    .admin-page .finance-metric strong { font-size: 1.05rem; margin-top: 0.15rem; }
    .admin-page .finance-metric small { font-size: 0.65rem; }
    .admin-page .daily-report-main { grid-template-columns: 2.5rem minmax(0,1fr); align-items: start; }
    .admin-page .daily-report-icon { width: 2.5rem; height: 2.5rem; border-radius: .75rem; }
    .admin-page .daily-report-status { grid-column: 1 / -1; justify-self: start; }
    .admin-page .daily-report-actions { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }
    .admin-page .daily-report-actions .btn { width: 100%; }
    .admin-page .report-chart-grid,
    .admin-page .report-chart-grid.wide { grid-template-columns: 1fr; }
    .admin-page .report-chart-card { padding: .75rem; border-radius: 14px; }
    .admin-page .report-chart-head { display: grid; }
    .admin-page .report-chart-chip { justify-self: start; }
    .admin-page .report-bar-row { grid-template-columns: minmax(4.9rem,.64fr) minmax(0,1fr) auto; gap: .4rem; }
    .admin-page .report-donut-wrap { grid-template-columns: 1fr; justify-items: center; }
    .admin-page .report-legend { width: 100%; }
    .admin-page .report-column-chart { grid-template-columns: repeat(var(--column-count, 1), minmax(2.05rem,1fr)); gap: .5rem; overflow-x: auto; }
    .admin-page .report-heat-row { grid-template-columns: 4.6rem repeat(var(--heat-count), minmax(2rem,1fr)); gap: .24rem; }
    .admin-page .report-heat-row strong,
    .admin-page .report-heat-cell { font-size: .62rem; }
  }
`;

const REPORT_COLORS = ["#ea580c", "#1c1917", "#0f766e", "#2563eb", "#a16207", "#7c3aed", "#be123c", "#64748b"];
const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

function clampPercent(value, max = 100) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.min(max, Math.max(0, value));
}

function formatNumber(value) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(Number(value ?? 0));
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value ?? 0));
}

function compactDate(value) {
  if (!value) return "-";
  const [, month, day] = String(value).split("-");
  return month && day ? `${day}/${month}` : String(value);
}

function actualQuantity(state, request) {
  return requestActualQuantity(state, request);
}

function requestHeadcount(state, request) {
  return Number(request.sectionHeadcount ?? request.headcount ?? state.workSections?.find((section) => section.id === request.teamId)?.headcount ?? 0);
}

function summarizeRows(state, rows, statusLabels = {}) {
  const summary = rows.reduce((acc, request) => {
    const requested = Number(request.quantity ?? 0);
    const consumed = actualQuantity(state, request);
    const effective = requestHeadcount(state, request);
    const value = requestFinancialValue(state, request);
    const meal = request.mealType || "Sem tipo";
    const section = request.sectionName || request.location || "Sem equipe";
    const status = statusLabels[request.status] ?? request.status ?? "Sem status";

    acc.requested += requested;
    acc.consumed += consumed;
    acc.effective += effective;
    acc.value += value;

    acc.byMeal[meal] ??= { label: meal, requested: 0, consumed: 0, effective: 0, value: 0 };
    acc.byMeal[meal].requested += requested;
    acc.byMeal[meal].consumed += consumed;
    acc.byMeal[meal].effective += effective;
    acc.byMeal[meal].value += value;

    acc.bySection[section] ??= { label: section, requested: 0, consumed: 0, effective: 0, value: 0 };
    acc.bySection[section].requested += requested;
    acc.bySection[section].consumed += consumed;
    acc.bySection[section].effective += effective;
    acc.bySection[section].value += value;

    acc.byStatus[status] ??= { label: status, value: 0 };
    acc.byStatus[status].value += 1;

    acc.byDay[request.date] ??= { label: compactDate(request.date), date: request.date, requested: 0, consumed: 0, effective: 0, value: 0 };
    acc.byDay[request.date].requested += requested;
    acc.byDay[request.date].consumed += consumed;
    acc.byDay[request.date].effective += effective;
    acc.byDay[request.date].value += value;

    const weekday = WEEKDAY_LABELS[new Date(`${request.date}T12:00:00`).getDay()] ?? "-";
    acc.heatmap[weekday] ??= {};
    acc.heatmap[weekday][meal] = (acc.heatmap[weekday][meal] ?? 0) + consumed;
    return acc;
  }, { requested: 0, consumed: 0, effective: 0, value: 0, byMeal: {}, bySection: {}, byStatus: {}, byDay: {}, heatmap: {} });

  return {
    ...summary,
    meals: Object.values(summary.byMeal).sort((a, b) => b.consumed - a.consumed),
    sections: Object.values(summary.bySection).sort((a, b) => b.consumed - a.consumed),
    statuses: Object.values(summary.byStatus).sort((a, b) => b.value - a.value),
    days: Object.values(summary.byDay).sort((a, b) => a.date.localeCompare(b.date))
  };
}

function ChartCard({ children, className = "", kicker, title, subtitle, chip }) {
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

function EmptyChart() {
  return <div className="report-empty">Sem dados suficientes no periodo filtrado.</div>;
}

function HorizontalBars({ items, valueKey = "value", format = formatNumber, limit = 8 }) {
  const safeItems = items.slice(0, limit);
  const max = Math.max(...safeItems.map((item) => Number(item[valueKey] ?? 0)), 1);
  if (!safeItems.length) return <EmptyChart />;
  return (
    <div className="report-bars">
      {safeItems.map((item, index) => {
        const value = Number(item[valueKey] ?? 0);
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

function GroupedMealBars({ items }) {
  const safeItems = items.slice(0, 7);
  const max = Math.max(...safeItems.flatMap((item) => [item.requested, item.consumed, item.effective]).map(Number), 1);
  if (!safeItems.length) return <EmptyChart />;
  return (
    <div className="report-grouped-chart">
      <div className="report-grouped-bars">
        {safeItems.map((item) => (
          <div className="report-group-row" key={item.label}>
            <span className="report-bar-label" title={item.label}>{item.label}</span>
            <div className="report-group-stack">
              <span className="report-mini-track" title={`Solicitado: ${item.requested}`}><b style={{ background: "#ea580c", width: `${clampPercent((item.requested / max) * 100)}%` }} /></span>
              <span className="report-mini-track" title={`Consumido: ${item.consumed}`}><b style={{ background: "#1c1917", width: `${clampPercent((item.consumed / max) * 100)}%` }} /></span>
              <span className="report-mini-track" title={`Efetivo: ${item.effective || 0}`}><b style={{ background: "#0f766e", width: `${clampPercent(((item.effective || 0) / max) * 100)}%` }} /></span>
            </div>
          </div>
        ))}
      </div>
      <div className="report-series-legend">
        <span><i style={{ "--series-color": "#ea580c" }} />Solicitado</span>
        <span><i style={{ "--series-color": "#1c1917" }} />Consumido real</span>
        <span><i style={{ "--series-color": "#0f766e" }} />Efetivo</span>
      </div>
    </div>
  );
}

function DonutChart({ items, center }) {
  const safeItems = items.filter((item) => Number(item.value ?? item.consumed ?? 0) > 0).slice(0, 7);
  const total = safeItems.reduce((sum, item) => sum + Number(item.value ?? item.consumed ?? 0), 0);
  if (!safeItems.length || !total) return <EmptyChart />;
  let start = 0;
  const stops = safeItems.map((item, index) => {
    const value = Number(item.value ?? item.consumed ?? 0);
    const end = start + (value / total) * 100;
    const color = REPORT_COLORS[index % REPORT_COLORS.length];
    const stop = `${color} ${start}% ${end}%`;
    start = end;
    return stop;
  }).join(", ");
  return (
    <div className="report-donut-wrap">
      <div className="report-donut" data-center={center ?? formatNumber(total)} style={{ "--donut-stops": stops }} />
      <div className="report-legend">
        {safeItems.map((item, index) => {
          const value = Number(item.value ?? item.consumed ?? 0);
          return (
            <div className="report-legend-row" key={item.label}>
              <span className="report-legend-dot" style={{ "--dot-color": REPORT_COLORS[index % REPORT_COLORS.length] }} />
              <span className="report-bar-label" title={item.label}>{item.label}</span>
              <strong>{formatNumber(value)}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ColumnChart({ color = "#ea580c", items, valueKey = "consumed", format = formatNumber, limit = 14 }) {
  const safeItems = items.slice(-limit);
  const max = Math.max(...safeItems.map((item) => Number(item[valueKey] ?? 0)), 1);
  if (!safeItems.length) return <EmptyChart />;
  return (
    <div className="report-column-chart" style={{ "--column-color": color, "--column-count": safeItems.length }}>
      {safeItems.map((item) => {
        const value = Number(item[valueKey] ?? 0);
        return (
          <div className="report-column" key={item.date ?? item.label} title={`${item.label}: ${format(value)}`}>
            <strong>{format(value)}</strong>
            <i style={{ height: `${Math.max(4, (value / max) * 100)}%` }} />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function HeatmapChart({ meals, heatmap }) {
  const columns = meals.slice(0, 5).map((item) => item.label);
  const max = Math.max(...Object.values(heatmap).flatMap((row) => columns.map((meal) => Number(row[meal] ?? 0))), 1);
  if (!columns.length) return <EmptyChart />;
  return (
    <div className="report-heatmap" style={{ "--heat-count": columns.length }}>
      <div className="report-heat-row">
        <strong>Dia</strong>
        {columns.map((meal) => <strong key={meal} title={meal}>{meal.split(" ")[0]}</strong>)}
      </div>
      {WEEKDAY_LABELS.map((day) => (
        <div className="report-heat-row" key={day}>
          <strong>{day}</strong>
          {columns.map((meal) => {
            const value = Number(heatmap[day]?.[meal] ?? 0);
            return <span className="report-heat-cell" key={meal} style={{ "--heat": `${clampPercent((value / max) * 82, 82)}%` }}>{value || "-"}</span>;
          })}
        </div>
      ))}
    </div>
  );
}

function MeasurementExportMenu({ currentFilter, exportMenuOpen, icon, isAllPeriod, isCustomPeriod }) {
  return (
    <div className={`export-menu ${exportMenuOpen === "relatorios" ? "open" : ""}`}>
      <button className="btn outline small" type="button" data-export-toggle="relatorios"><Icon icon={icon} name="clipboard" size={14} />Medicao</button>
      {exportMenuOpen === "relatorios" ? (
        <div className="export-options">
          <label>
            <span>Periodo</span>
            <select data-report-range defaultValue={currentFilter.range}>
              <option value="all">Todo periodo</option>
              <option value="day">Dia</option>
              <option value="week">Semana</option>
              <option value="month">Mes</option>
              <option value="custom">Periodo personalizado</option>
            </select>
          </label>
          <label>
            <span>Inicio</span>
            <input type="date" defaultValue={currentFilter.start || ""} data-report-start disabled={isAllPeriod} />
          </label>
          <label>
            <span>Fim</span>
            <input type="date" defaultValue={currentFilter.end || currentFilter.start || ""} data-report-end disabled={!isCustomPeriod} />
          </label>
          <button type="button" data-report-apply>Definir</button>
          <button type="button" data-export="pdf"><Icon icon={icon} name="clipboard" size={14} />PDF</button>
          <button type="button" data-export="xlsx"><Icon icon={icon} name="chart" size={14} />Excel</button>
        </div>
      ) : null}
    </div>
  );
}

function localDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function previousDateKey(dateKey = localDateKey()) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() - 1);
  return localDateKey(date);
}

function shortDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(`${value}T12:00:00`));
}

function DailyReportCard({ icon, report, reportDate }) {
  const available = Boolean(report);
  return (
    <article className={`daily-report-card ${available ? "is-available" : "is-pending"}`}>
      <div className="daily-report-main">
        <span className="daily-report-icon"><Icon icon={icon} name="clipboard" size={22} /></span>
        <div className="daily-report-copy">
          <span className="compact-kicker">Relatorio automatico do dia anterior</span>
          <h2>{available ? `Relatorio de ${shortDate(reportDate)} disponivel` : `Relatorio de ${shortDate(reportDate)} em geracao`}</h2>
          <p>{available ? "Arquivo gerado pelo sistema e pronto para baixar em PDF ou Excel, sem envio automatico por e-mail." : "O sistema tenta gerar automaticamente este arquivo ao abrir o Admin depois de 00:00."}</p>
        </div>
        <span className="daily-report-status">{available ? "Disponivel" : "Pendente"}</span>
      </div>
      <div className="daily-report-actions">
        <button className="btn primary" type="button" data-daily-report-download="pdf" data-report-date={reportDate} disabled={!available}><Icon icon={icon} name="clipboard" size={15} />PDF</button>
        <button className="btn outline" type="button" data-daily-report-download="xlsx" data-report-date={reportDate} disabled={!available}><Icon icon={icon} name="chart" size={15} />Excel</button>
      </div>
    </article>
  );
}

export function Relatorios(props) {
  const { icon, reportFilter, reportPeriodLabel, reportRows, reportRowsWithCancelled, state, sumQty } = props;
  const rows = reportRows ?? state.requests.filter((request) => request.status !== "cancelado");
  const rowsWithCancelled = reportRowsWithCancelled ?? rows;
  const analytics = summarizeRows(state, rows, props.STATUS_LABEL ?? {});
  const statusAnalytics = summarizeRows(state, rowsWithCancelled, props.STATUS_LABEL ?? {});
  const yesterday = previousDateKey();
  const yesterdayReport = state.dailyReports?.find((report) => report.date === yesterday);
  const currentFilter = reportFilter ?? { range: "all", start: state.settings.defaultMealDate, end: state.settings.defaultMealDate };
  const total = sumQty(rows);
  const isAllPeriod = currentFilter.range === "all";
  const isCustomPeriod = currentFilter.range === "custom";
  const serviceRate = analytics.effective ? `${Math.round((analytics.consumed / analytics.effective) * 100)}%` : "-";

  return (
    <>
      <style>{baseAdminScreenStyles + relatoriosHeroStyles}</style>

      <AdminReceiptHeader
        kicker="Relatórios"
        title="Visão geral e desempenho"
        totalValue={total}
        totalLabel="refeições no período"
        description={`Período: ${reportPeriodLabel ?? "Todo período"}`}
        actions={(
          <>
            <AdminBackButton icon={icon} />
            <AdminFilterMenu icon={icon}>
              <select data-report-range defaultValue={currentFilter.range}>
                <option value="all">Todo periodo</option>
                <option value="day">Dia</option>
                <option value="week">Semana</option>
                <option value="month">Mes</option>
                <option value="custom">Período personalizado</option>
              </select>
              <input type="date" defaultValue={currentFilter.start || state.settings.defaultMealDate} data-report-start aria-label={isCustomPeriod ? "Inicio do periodo" : "Data de referencia"} disabled={isAllPeriod} />
              <input type="date" defaultValue={currentFilter.end || currentFilter.start || state.settings.defaultMealDate} data-report-end aria-label="Fim do periodo" disabled={!isCustomPeriod} />
              <select data-report-supplier defaultValue={currentFilter.supplierCompanyId || ""} aria-label="Fornecedor">
                <option value="">Todos fornecedores</option>
                {(state.supplierCompanies ?? []).map((supplier) => <option value={supplier.id} key={supplier.id}>{supplier.tradeName || supplier.legalName}</option>)}
              </select>
              <select data-report-meal defaultValue={currentFilter.mealTypeId || ""} aria-label="Tipo de refeicao">
                <option value="">Todas refeicoes</option>
                {(state.mealCatalog ?? state.mealTypes ?? []).map((meal) => <option value={meal.id} key={meal.id}>{meal.label}</option>)}
              </select>
              <select data-report-team defaultValue={currentFilter.teamId || ""} aria-label="Efetivo ou local">
                <option value="">Todos locais</option>
                {(state.workSections ?? []).map((section) => <option value={section.id} key={section.id}>{section.name}</option>)}
              </select>
              <select data-report-origin defaultValue={currentFilter.originRole || ""} aria-label="Origem do pedido">
                <option value="">Todas origens</option>
                <option value="admin">Admin</option>
                <option value="encarregado">Encarregado</option>
              </select>
            </AdminFilterMenu>

            <button className="btn primary small" type="button" data-export-kpi><Icon icon={icon} name="chart" size={14} />KPI PDF</button>
            <MeasurementExportMenu
              currentFilter={currentFilter}
              exportMenuOpen={props.exportMenuOpen}
              icon={icon}
              isAllPeriod={isAllPeriod}
              isCustomPeriod={isCustomPeriod}
            />
          </>
        )}
        metrics={[
          { icon, iconName: "utensils", label: "Refeicoes", value: analytics.meals.length },
          { icon, iconName: "clipboard", label: "Pedidos", value: rows.length },
          { icon, iconName: "box", label: "Solicitados", value: analytics.requested },
          { icon, iconName: "chart", label: "Consumo real", value: analytics.consumed },
        ]}
      />

      <DailyReportCard icon={icon} report={yesterdayReport} reportDate={yesterday} />

      <section className="report-analytics mt-3">
        <div className="report-chart-grid wide">
          <ChartCard className="is-emphasis" kicker="KPI operacional" title="Solicitado x consumido x efetivo" subtitle="Comparacao por tipo de refeicao, seguindo a mesma leitura do KPI em PDF." chip={`${analytics.meals.length} tipos`}>
            <GroupedMealBars items={analytics.meals} />
          </ChartCard>
          <ChartCard kicker="Distribuicao" title="Consumo por refeicao" subtitle="Participacao de cada alimentacao no total consumido." chip={formatNumber(analytics.consumed)}>
            <DonutChart items={analytics.meals.map((item) => ({ label: item.label, value: item.consumed }))} center={formatNumber(analytics.consumed)} />
          </ChartCard>
        </div>

        <div className="report-chart-grid">
          <ChartCard kicker="Status" title="Situacao dos pedidos" subtitle="Visao resumida do funil operacional, incluindo cancelamentos confirmados." chip={`${rowsWithCancelled.length} pedidos`}>
            <DonutChart items={statusAnalytics.statuses} center={String(rowsWithCancelled.length)} />
          </ChartCard>
          <ChartCard kicker="Evolucao" title="Consumo diario" subtitle="Ultimos dias do periodo filtrado para identificar picos e quedas." chip={`${analytics.days.length} dias`}>
            <ColumnChart items={analytics.days} color="#ea580c" />
          </ChartCard>
        </div>

        <div className="report-chart-grid wide">
          <ChartCard kicker="Areas e trechos" title="Top equipes por consumo" subtitle="Frentes com maior volume operacional no periodo." chip="ranking">
            <HorizontalBars items={analytics.sections} valueKey="consumed" />
          </ChartCard>
          <ChartCard kicker="Efetivo" title="Atendimento diario" subtitle="Percentual do efetivo atendido por refeicoes consumidas." chip={serviceRate}>
            <ColumnChart items={analytics.days.map((day) => ({ ...day, occupancy: day.effective ? Math.round((day.consumed / day.effective) * 100) : 0 }))} valueKey="occupancy" format={(value) => `${value}%`} color="#0f766e" />
          </ChartCard>
        </div>
      </section>
    </>
  );
}
