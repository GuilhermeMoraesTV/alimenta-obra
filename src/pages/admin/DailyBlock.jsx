import React from "react";
import { getActualQuantity, getSupplierCompanyName, requestOriginLabel, requestResponsibleName } from "../../services/store-v2.js";
import { Icon, getUserName, statusLabel } from "./shared.jsx";

export const dailyBlockStyles = `
  .admin-page .daily-block-list { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); justify-items: center; align-items: start; gap: .75rem; }
  .admin-page .daily-block-card { display: grid; grid-template-rows: auto minmax(0,1fr) auto; width: 100%; max-width: 27rem; max-height: 34rem; min-width: 0; overflow: hidden; border-radius: 14px; border: 1px solid #e7e5e4; border-left: 2px dashed #d6d3d1; background: #fffefa; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .daily-block-head { display: grid; gap: .45rem; border-bottom: 1px solid #f5f5f4; padding: .65rem .7rem; }
  .admin-page .daily-block-head-main { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: start; gap: .6rem; }
  .admin-page .daily-block-head h2 { font-size: .95rem; line-height: 1; color: #1c1917; }
  .admin-page .daily-block-head p { color: #78716c; font-size: .68rem; font-weight: 800; }
  .admin-page .daily-block-total { text-align: right; }
  .admin-page .daily-block-total strong { display: block; font-size: 1.4rem; line-height: .9; font-weight: 950; color: #1c1917; }
  .admin-page .daily-block-total span { display: block; margin-top: .15rem; font-size: 9px; font-weight: 950; text-transform: uppercase; color: #78716c; }
  .admin-page .daily-food-summary { display: flex; flex-wrap: wrap; gap: .3rem; }
  .admin-page .daily-food-chip { display: inline-flex; max-width: 100%; min-width: 0; align-items: center; gap: .28rem; border-radius: 999px; border: 1px solid #fed7aa; background: #fff7ed; padding: .24rem .43rem; color: #c2410c; }
  .admin-page .daily-food-chip strong { font-size: .72rem; line-height: 1; font-weight: 950; }
  .admin-page .daily-food-chip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 950; text-transform: uppercase; }
  .admin-page .daily-block-body { display: grid; gap: .32rem; max-height: 18rem; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: .6rem .7rem; scrollbar-width: thin; scrollbar-color: #d6d3d1 transparent; }
  .admin-page .daily-block-body::-webkit-scrollbar { width: 7px; }
  .admin-page .daily-block-body::-webkit-scrollbar-thumb { border-radius: 999px; background: #d6d3d1; }
  .admin-page .daily-request-row { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: center; gap: .45rem; border-radius: .65rem; background: #fafaf9; padding: .48rem .52rem; }
  .admin-page .daily-request-title { min-width: 0; }
  .admin-page .daily-request-title strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .8rem; color: #1c1917; }
  .admin-page .daily-request-title small { display: block; margin-top: .1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #78716c; font-size: .64rem; font-weight: 800; }
  .admin-page .daily-request-side { display: flex; align-items: center; gap: .32rem; }
  .admin-page .daily-request-qty { min-width: 2.35rem; text-align: right; }
  .admin-page .daily-request-qty strong { display: block; font-size: .95rem; line-height: 1; font-weight: 950; color: #1c1917; }
  .admin-page .daily-request-qty small { font-size: 9px; font-weight: 900; color: #78716c; text-transform: uppercase; }
  .admin-page .daily-request-actions { display: flex; gap: .2rem; }
  .admin-page .daily-request-actions .btn { min-height: 1.85rem; width: 1.85rem; padding: 0; }
  .admin-page .daily-request-actions .daily-action-label { display: none; }
  .admin-page .daily-block-footer { display: grid; gap: .42rem; border-top: 1px solid #f5f5f4; padding: .58rem .7rem .68rem; }
  .admin-page .daily-total-line { display: flex; align-items: center; justify-content: space-between; gap: .6rem; font-size: .78rem; font-weight: 950; color: #1c1917; }
  .admin-page .daily-block-footer .btn.primary { width: 100%; min-height: 2.1rem; }
  .admin-page .daily-status-line { display: flex; align-items: center; justify-content: space-between; gap: .5rem; border-radius: .65rem; background: #fafaf9; padding: .48rem .58rem; }
  .admin-page .daily-status-line span:first-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .72rem; font-weight: 900; color: #57534e; }
  @media (max-width: 767px) {
    .admin-page .daily-block-list { grid-template-columns: 1fr; }
    .admin-page .daily-request-row { grid-template-columns: minmax(0,1fr) auto; }
  }
  @media (min-width: 768px) and (max-width: 1180px) {
    .admin-page .daily-block-list { grid-template-columns: repeat(2,minmax(0,1fr)); }
  }
`;

export function groupRequestsByDate(rows) {
  return Object.entries(rows.reduce((acc, request) => {
    acc[request.date] ??= [];
    acc[request.date].push(request);
    return acc;
  }, {})).sort(([dateA], [dateB]) => dateB.localeCompare(dateA));
}

export function DailyBlockCard(props) {
  const { canEditRequest, formatDate, icon, requests, state, STATUS_LABEL } = props;
  const date = requests[0]?.date ?? "";
  const consolidations = (state.consolidations ?? []).filter((item) => item.date === date && item.status !== "rascunho");
  const consolidation = consolidations.find((item) => ["rascunho", "enviado"].includes(item.status)) ?? consolidations[0];
  const activeRequests = requests.filter((request) => request.status !== "cancelado");
  const waitingRequests = activeRequests.filter((request) => request.status === "enviado");
  const linkedRequestIds = new Set(consolidations.flatMap((item) => item.requestIds ?? []));
  const extraWaitingRequests = waitingRequests.filter((request) => !linkedRequestIds.has(request.id));
  const displayRequests = extraWaitingRequests.length ? extraWaitingRequests : activeRequests;
  const total = displayRequests.reduce((sum, request) => sum + Number(request.quantity ?? 0), 0);
  const byMeal = Object.entries(displayRequests.reduce((acc, request) => {
    acc[request.mealType] ??= 0;
    acc[request.mealType] += Number(request.quantity ?? 0);
    return acc;
  }, {}));
  const leadersCount = new Set(displayRequests.map((request) => request.leaderId)).size;
  const sectionsCount = new Set(displayRequests.map((request) => request.teamId || request.sectionName || request.location)).size;

  return (
    <article className="daily-block-card">
      <header className="daily-block-head">
        <div className="daily-block-head-main">
          <div>
            <span className="compact-kicker">Bloco diario</span>
            <h2>{formatDate(date)}</h2>
            <p>{displayRequests.length} pedidos - {leadersCount} encarregados - {sectionsCount} equipes</p>
          </div>
          <div className="daily-block-total"><strong>{total}</strong><span>refeicoes</span></div>
        </div>
        <div className="daily-food-summary">
          {byMeal.map(([meal, quantity]) => <div className="daily-food-chip" key={meal}><strong>{quantity}</strong><span>{meal}</span></div>)}
        </div>
      </header>
      <div className="daily-block-body">
        {displayRequests.map((request) => {
          const editable = canEditRequest(state, request);
          return (
            <div className="daily-request-row" key={request.id}>
              <div className="daily-request-title">
                <strong>{requestResponsibleName(state, request)}</strong>
                <small>{requestOriginLabel(request)} - {request.mealType} - {request.sectionName || request.location} - {getSupplierCompanyName(state, request.supplierCompanyId, request.supplierId)}</small>
              </div>
              <div className="daily-request-side">
                <div className="daily-request-qty"><strong>{request.quantity}</strong><small>sol.</small><small>{getActualQuantity(state, consolidation?.id ?? "", request)} real</small></div>
                <div className="daily-request-actions">
                  {editable ? (
                    <>
                      <button className="btn outline small" type="button" data-edit-request={request.id} aria-label="Editar pedido"><Icon icon={icon} name="edit" size={14} /><span className="daily-action-label">Editar</span></button>
                      <button className="btn danger small" type="button" data-cancel-request={request.id} aria-label="Cancelar pedido"><Icon icon={icon} name="trash" size={14} /><span className="daily-action-label">Cancelar</span></button>
                    </>
                  ) : <span className={`badge ${request.status}`}>{statusLabel(STATUS_LABEL, request.status)}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <footer className="daily-block-footer">
        <div className="daily-total-line"><span>{extraWaitingRequests.length ? "Total a enviar" : "Total do dia"}</span><strong>{total} refeicoes</strong></div>
        {consolidation ? (
          <>
            <div className="daily-status-line">
              <span>{consolidations.length > 1 ? `${consolidations.length} pedidos ao fornecedor` : "Status do fornecedor"}</span>
              <span className={`badge ${consolidation.status}`}>{statusLabel(STATUS_LABEL, consolidation.status)}</span>
            </div>
            {extraWaitingRequests.length ? (
              <button className="btn primary" type="button" data-send-request-date={date}>
                <Icon icon={icon} name="truck" size={15} />{consolidation.status === "enviado" ? "Enviar pedido extra" : "Enviar novo pedido da data"}
              </button>
            ) : null}
          </>
        ) : waitingRequests.length ? (
          <button className="btn primary" type="button" data-send-request-date={date}><Icon icon={icon} name="truck" size={15} />Enviar bloco ao fornecedor</button>
        ) : (
          <span className="badge enviado">Bloco sem pendencias de envio</span>
        )}
      </footer>
    </article>
  );
}
