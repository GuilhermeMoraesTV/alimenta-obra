import React from "react";
import { AdminBackButton, AdminReceiptHeader, Icon, statusLabel } from "./shared.jsx";

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
  .admin-page .badge.confirmado { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
  .admin-page .badge.producao { border-color: #fde68a; background: #fffbeb; color: #b45309; }
  .admin-page .badge.saiu_entrega { border-color: #bae6fd; background: #f0f9ff; color: #0369a1; }
  @media (min-width: 640px) { .admin-page h1 { font-size: 34px; } }
`;

const financeiroStyles = `
  .admin-page .finance-page { display: grid; gap: .75rem; }
  .admin-page .finance-page > .finance-hero { display: none; }
  .admin-page .finance-mobile-movements { display: none; }
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
  }
`;

function FinanceMetric({ accent = false, icon, iconName, label, value, hint }) {
  return (
    <article className={`finance-metric ${accent ? "accent" : ""}`}>
      <span>{iconName ? <Icon icon={icon} name={iconName} size={14} /> : null}{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  );
}

export function Financeiro(props) {
  const { formatDate, icon, money, requestValue, state, sumQty, STATUS_LABEL } = props;
  const sourceRows = state.requests.filter((request) => request.status !== "cancelado");
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
    <>
      <style>{baseAdminScreenStyles + financeiroStyles}</style>
      <section className="finance-page">
        <AdminReceiptHeader
          kicker="Financeiro"
          title="Financeiro"
          totalValue={money(projected)}
          totalLabel={`previsto em ${month}`}
          description="Custos, entregas e pendencias do mes."
          actions={(
            <>
              <AdminBackButton icon={icon} />
              <button className="btn primary" data-export-finance="admin">
                <Icon icon={icon} name="chart" size={15} />Gerar PDF
              </button>
            </>
          )}
          metrics={[
            { icon, iconName: "chart", label: "Custo previsto", value: money(projected) },
            { icon, iconName: "truck", label: "Pago/entregue", value: money(deliveredValue) },
            { icon, iconName: "clock", label: "Em aberto", value: money(pendingValue) },
            { icon, iconName: "utensils", label: "Ticket medio", value: money(mealCount ? projected / mealCount : 0) },
          ]}
        />
        <div className="finance-hero">
          <div className="finance-hero-head">
            <div className="finance-hero-row">
              <div>
                <span className="compact-kicker">Financeiro</span>
                <h1>Financeiro administrativo</h1>
                <p>Análise de {month} com custos, entregas e pendências.</p>
              </div>
              <div className="finance-hero-actions">
                <AdminBackButton icon={icon} />
                <button className="btn primary" data-export-finance="admin">
                  <Icon icon={icon} name="chart" size={15} />Gerar PDF
                </button>
              </div>
            </div>
          </div>
          <div className="finance-holes">
            {Array.from({ length: 14 }).map((_, index) => <span key={index} />)}
          </div>
          <div className="finance-metrics-strip">
            <FinanceMetric icon={icon} iconName="chart" label="Custo previsto" value={money(projected)} hint={`${mealCount} refeições no mês`} />
            <FinanceMetric icon={icon} iconName="truck" label="Pago/entregue" value={money(deliveredValue)} hint={`${delivered.length} pedidos entregues`} />
            <FinanceMetric icon={icon} iconName="clock" label="Em aberto" value={money(pendingValue)} hint="pedidos ainda em operação" />
            <FinanceMetric icon={icon} iconName="utensils" label="Ticket médio" value={money(mealCount ? projected / mealCount : 0)} hint="por refeição" />
          </div>
        </div>

        <div className="mt-2 grid gap-3 lg:grid-cols-2">

          {/* Card: Composição por Refeição */}
          <article className="group relative overflow-hidden rounded-2xl border border-l-2 border-dashed border-stone-300 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-stone-800">
              Composição por Refeição
            </h2>
            <div className="grid gap-3">
              {byMeal.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1.5 rounded-lg border border-stone-100 bg-stone-50 p-3 transition-colors hover:border-blue-200 hover:bg-blue-50/40"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-stone-600">
                    <span className="uppercase tracking-wider">{item.label}</span>
                    <strong className="text-blue-700">{money(item.value)}</strong>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-700 ease-out"
                      style={{ width: `${Math.max(3, Math.round((item.value / max) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
              {!byMeal.length && (
                <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm font-bold text-stone-500">
                  Sem movimentação no período.
                </div>
              )}
            </div>
          </article>

          {/* Card: Evolução 7 dias */}
          <article className="group relative overflow-hidden rounded-2xl border border-l-2 border-dashed border-stone-300 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-stone-800">
              Evolução dos últimos 7 dias
            </h2>
            <div className="flex h-44 items-end justify-between gap-1 rounded-xl border border-stone-100 bg-stone-50 p-3 sm:gap-2">
              {days.map((item) => (
                <div key={item.key} className="group/bar relative flex h-full w-full flex-col items-center justify-end gap-1">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover/bar:-translate-y-1 group-hover/bar:opacity-100">
                    <span className="whitespace-nowrap rounded bg-stone-800 px-2 py-1 text-[10px] font-bold text-white shadow-lg">
                      {item.value ? money(item.value).replace("R$", "") : "0,00"}
                    </span>
                  </div>
                  <div className="relative flex w-full max-w-[2.5rem] flex-1 items-end justify-center rounded-t-md bg-stone-200/50 transition-colors group-hover/bar:bg-stone-200">
                    <div
                      className="w-full rounded-t-md bg-stone-400 transition-all duration-700 ease-out group-hover/bar:bg-red-600"
                      style={{ height: `${Math.max(5, Math.round((item.value / dailyMax) * 100))}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-stone-500">{item.label}</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Card: Tabela de Movimentações */}
        <article className="overflow-hidden rounded-2xl border border-l-2 border-dashed border-stone-300 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-stone-800">
            Movimentações do Período
          </h2>
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
          <div className="finance-desktop-movements overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 shadow-inner">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-100 text-[10px] uppercase tracking-widest text-stone-500">
                <tr>
                  <th className="px-5 py-3.5 font-black">Data</th>
                  <th className="px-5 py-3.5 font-black">Tipo</th>
                  <th className="px-5 py-3.5 text-center font-black">Qtd</th>
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
                      {request.quantity}
                    </td>
                    <td className="px-5 py-3.5 font-black text-stone-900 transition-colors group-hover/row:text-blue-700">
                      {money(requestValue(request))}
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
        </article>

      </section>
    </>
  );
}
