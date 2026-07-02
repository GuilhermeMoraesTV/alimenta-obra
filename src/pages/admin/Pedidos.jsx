import React from "react";
import { RequestCard } from "../encarregado/RequestCard.jsx";
import { Icon, primaryButtonClass } from "../encarregado/shared.jsx";
import { AdminFilterMenu, AdminReceiptHeader, ExportButtons, getUserName } from "./shared.jsx";

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
  .admin-page .table-wrap { overflow-x: auto; border-radius: .75rem; border: 1px solid #e7e5e4; background: #fff; }
  .admin-page table { width: 100%; border-collapse: collapse; }
  .admin-page th { background: #fafaf9; padding: .75rem; text-align: left; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .admin-page td { border-top: 1px solid #f5f5f4; padding: .75rem; font-size: .875rem; }
  .admin-page input,
  .admin-page select,
  .admin-page textarea { min-height: 2.5rem; border-radius: .5rem; border: 1px solid #d6d3d1; background: #fff; padding: 0 .75rem; font-size: .875rem; }
  .admin-page textarea { min-height: 6rem; padding-top: .5rem; padding-bottom: .5rem; }
  .admin-page .admin-filter-menu,
  .admin-page .export-menu { position: relative; }
  .admin-page .admin-filter-menu summary { display: inline-flex; min-height: 2.5rem; align-items: center; gap: .5rem; border-radius: .5rem; border: 1px solid #d6d3d1; background: #fff; padding: 0 1rem; font-size: .875rem; font-weight: 800; cursor: pointer; }
  .admin-page .admin-filter-popover,
  .admin-page .export-options { position: absolute; right: 0; z-index: 20; margin-top: .5rem; display: grid; min-width: 10rem; gap: .5rem; border-radius: 1rem; border: 1px solid #e7e5e4; background: #fff; padding: .75rem; box-shadow: 0 25px 50px rgba(0,0,0,.18); }
  .admin-page .empty { border-radius: .75rem; border: 1px dashed #d6d3d1; background: #fafaf9; padding: 1.25rem; text-align: center; font-size: .875rem; font-weight: 700; color: #78716c; }
  @media (min-width: 640px) { .admin-page h1 { font-size: 34px; } }
`;

const pedidosStyles = `
  .admin-page .admin-history-shell { position: relative; overflow: visible; }
  .admin-page .admin-history-hero { overflow: visible; isolation: isolate; }
  .admin-page .admin-history-actions { position: relative; z-index: 80; display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: .5rem; }
  .admin-page .admin-history-actions .admin-filter-menu,
  .admin-page .admin-history-actions .export-menu { position: relative; z-index: 90; }
  .admin-page .admin-history-actions .admin-filter-popover,
  .admin-page .admin-history-actions .export-options { z-index: 999; top: 100%; right: 0; left: auto; min-width: min(19rem, calc(100vw - 2rem)); }
  .admin-page .admin-pedidos-summary { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: .5rem; border-radius: 0 0 20px 20px; background: #f5f5f4; padding: 1.25rem 1rem .75rem; }
  .admin-page .admin-history-chip { display: flex; min-width: 0; align-items: center; gap: .5rem; border-radius: 0 1rem 1rem .375rem; border: 1px solid #d6d3d1; border-left-width: 2px; border-left-style: dashed; background: #fff; padding: .75rem; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .admin-history-chip-icon { display: grid; height: 2rem; width: 2rem; flex-shrink: 0; place-items: center; border-radius: 999px; background: #fff7ed; color: #c2410c; }
  .admin-page .admin-history-chip strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 1.125rem; font-weight: 950; line-height: 1; color: #1c1917; }
  .admin-page .admin-history-chip span:last-child { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 950; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .admin-page .admin-request-list { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,32rem),1fr)); align-items: start; gap: .75rem; }
  .admin-page .admin-request-shell { display: grid; min-width: 0; gap: .35rem; }
  .admin-page .admin-request-owner { display: inline-flex; width: max-content; max-width: 100%; align-items: center; gap: .45rem; border-radius: .5rem; border: 1px dashed #d6d3d1; background: #fffefa; padding: .35rem .55rem; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .admin-page .admin-request-owner strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #1c1917; }
  @media (max-width: 767px) {
    .admin-page .admin-history-hero .admin-history-actions { width: 100%; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }
    .admin-page .admin-pedidos-summary { padding-inline: .75rem; }
    .admin-page .admin-history-chip { padding: .55rem; gap: .35rem; }
    .admin-page .admin-history-chip-icon { height: 1.75rem; width: 1.75rem; }
    .admin-page .admin-history-chip strong { font-size: 1rem; }
  }
`;

function AdminRequestCard(props) {
  const { request, state } = props;
  return (
    <article className="admin-request-shell">
      <div className="admin-request-owner">Encarregado <strong>{getUserName(state, request.leaderId)}</strong></div>
      <RequestCard {...props} request={request} compact />
    </article>
  );
}

export function Pedidos(props) {
  const { adminFilters, countStatus, icon, state, sumQty } = props;
  const date = adminFilters.date;
  const leader = adminFilters.leader;
  const meal = adminFilters.meal;
  const rows = state.requests.filter((request) => (!date || request.date === date) && (!leader || request.leaderId === leader) && (!meal || request.mealType === meal));
  const activeRows = rows.filter((request) => request.status !== "cancelado");
  const waitingCount = countStatus(rows, "enviado");

  return (
    <>
      <style>{baseAdminScreenStyles + pedidosStyles}</style>
      <div className="grid w-full gap-3 sm:gap-4 admin-history-shell">
        <AdminReceiptHeader
          kicker="Pedidos administrativos"
          title="Pedidos recebidos"
          totalValue={rows.length}
          totalLabel="pedidos recebidos"
          description={waitingCount ? `${waitingCount} aguardando envio ao fornecedor` : "Fila operacional atualizada"}
          actions={(
            <>
              <AdminFilterMenu icon={icon}>
                <input type="date" defaultValue={date} data-filter-date aria-label="Filtrar por data" />
                <select defaultValue={leader} data-filter-leader aria-label="Filtrar encarregado"><option value="">Todos</option>{state.users.map((user) => <option value={user.id} key={user.id}>{user.name}</option>)}</select>
                <select defaultValue={meal} data-filter-meal aria-label="Filtrar refeicao"><option value="">Tipos</option>{state.mealTypes.map((item) => <option value={item.label} key={item.id}>{item.label}</option>)}</select>
              </AdminFilterMenu>
              <ExportButtons exportMenuOpen={props.exportMenuOpen} icon={icon} id="pedidos" items={[["csv", "CSV", "clipboard"], ["xlsx", "Excel", "chart"]]} />
            </>
          )}
          metrics={[
            { icon, iconName: "clipboard", value: rows.length, label: "Pedidos" },
            { icon, iconName: "utensils", value: sumQty(activeRows), label: "Refeicoes" },
            { icon, iconName: "clock", value: waitingCount, label: "A enviar" },
          ]}
        />

        {!rows.length ? (
          <div className="grid justify-items-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-white px-6 py-8 text-center shadow-sm">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-orange-700"><Icon icon={icon} name="clipboard" size={22} /></span>
            <strong>Nenhum pedido encontrado</strong>
            <p className="m-0 text-sm text-stone-500">Ajuste os filtros ou aguarde o envio dos encarregados.</p>
            <button className={primaryButtonClass} data-view="consolidacao"><Icon icon={icon} name="truck" size={15} />Enviar ao fornecedor</button>
          </div>
        ) : (
          <section className="grid gap-3">
            <div className="admin-request-list">{rows.map((request) => <AdminRequestCard {...props} request={request} key={request.id} />)}</div>
          </section>
        )}
      </div>
    </>
  );
}
