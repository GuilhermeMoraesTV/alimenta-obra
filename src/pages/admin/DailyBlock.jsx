import React from "react";
import { getRecordedActualQuantity, getSupplierCompanyName, requestOriginLabel, requestResponsibleName } from "../../services/store-v2.js";
import { Icon, statusLabel } from "./shared.jsx";

function mealCategoryName(category, fallbackMeal = "Outro") {
  if (category === "marmita") return "Marmita";
  if (category === "buffet") return "Buffer";
  if (category === "janta") return "Janta";
  return fallbackMeal;
}

function mealDistributionName(state, request) {
  if (request.mealCategory === "marmita") return requestResponsibleName(state, request);
  return request.sectionName || request.location || requestResponsibleName(state, request);
}

function mealGroups(rows) {
  const order = { marmita: 0, buffet: 1, janta: 2, outro: 3 };
  return Object.values(rows.reduce((acc, request) => {
    const key = request.mealCategory || request.mealType || "outro";
    acc[key] ??= { key, label: mealCategoryName(request.mealCategory, request.mealType), total: 0, rows: [] };
    acc[key].total += Number(request.quantity ?? 0);
    acc[key].rows.push(request);
    return acc;
  }, {})).sort((a, b) => (order[a.key] ?? 9) - (order[b.key] ?? 9));
}

function timestampValue(value) {
  return value ? new Date(value).getTime() || 0 : 0;
}

function newestActivity(consolidation) {
  return Math.max(timestampValue(consolidation?.updatedAt), timestampValue(consolidation?.sentAt), timestampValue(consolidation?.createdAt));
}

function consolidationActionPriority(consolidation) {
  return { cancelamento_pendente: 4, saiu_entrega: 3, producao: 2, confirmado: 1 }[consolidation.status] ?? 0;
}

function dailyBlockStatusPresentation({ activeRequests, consolidation, extraWaitingRequests, operationalConsolidations, cancellationConsolidations, STATUS_LABEL }) {
  if (cancellationConsolidations.some((item) => item.status === "cancelamento_pendente")) {
    return { label: "Cancelamento pendente", status: "cancelamento_pendente" };
  }
  if (!activeRequests.length) {
    return cancellationConsolidations.length
      ? { label: STATUS_LABEL[cancellationConsolidations[0].status] ?? cancellationConsolidations[0].status, status: cancellationConsolidations[0].status }
      : operationalConsolidations.length
      ? { label: STATUS_LABEL[operationalConsolidations[0].status] ?? operationalConsolidations[0].status, status: operationalConsolidations[0].status }
      : { label: STATUS_LABEL[consolidation?.status] ?? consolidation?.status ?? "Sem envio", status: consolidation?.status ?? "pendente" };
  }

  const linkedRequestIds = new Set(operationalConsolidations.flatMap((item) => item.requestIds ?? []));
  const allActiveLinked = activeRequests.every((request) => linkedRequestIds.has(request.id));
  const activeStatuses = new Set(operationalConsolidations.map((item) => item.status));

  if (extraWaitingRequests.length || !allActiveLinked) return { label: "Pendente", status: "pendente" };
  if (activeRequests.length && activeRequests.every((request) => request.status === "entregue")) {
    return { label: "Concluido", status: "entregue" };
  }
  if (activeStatuses.size && [...activeStatuses].every((status) => status === "enviado")) {
    return { label: "Aguardando confirmacao", status: "aguardando_confirmacao" };
  }
  if (activeStatuses.size && [...activeStatuses].every((status) => ["confirmado", "producao", "saiu_entrega"].includes(status))) {
    return { label: "Aguardando entrega", status: "aguardando_entrega" };
  }
  if (activeStatuses.size && [...activeStatuses].every((status) => status === "entregue")) {
    return { label: "Concluido", status: "entregue" };
  }
  return { label: "Pendente", status: "pendente" };
}

export const dailyBlockStyles = `
  .admin-page .daily-block-list { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); justify-items: center; align-items: stretch; gap: .75rem; }
  .admin-page .daily-block-card { display: grid; grid-template-rows: auto minmax(0,1fr) auto; width: 100%; max-width: 27rem; min-height: 34rem; max-height: 34rem; min-width: 0; overflow: hidden; border-radius: 14px; border: 1px solid #e7e5e4; border-left: 2px dashed #d6d3d1; background: #fffefa; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .daily-block-card.is-cancelled { border-color: #fecaca; border-left-color: #ef4444; background: #fff7f7; }
  .admin-page .daily-block-head { display: grid; gap: .45rem; border-bottom: 1px solid #f5f5f4; padding: .65rem .7rem; }
  .admin-page .daily-block-head-main { display: grid; align-items: start; gap: .6rem; }
  .admin-page .daily-block-head h2 { font-size: .95rem; line-height: 1; color: #1c1917; }
  .admin-page .daily-block-head p { color: #78716c; font-size: .68rem; font-weight: 800; }
  .admin-page .daily-block-body { display: grid; align-content: start; gap: .45rem; max-height: 19rem; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: .6rem .7rem; scrollbar-width: none; -ms-overflow-style: none; }
  .admin-page .daily-block-body::-webkit-scrollbar { display: none; width: 0; height: 0; }
  .admin-page .daily-meal-block { display: grid; align-self: start; gap: .35rem; border-radius: .75rem; border: 1px solid #eee8df; background: #fff; padding: .55rem; }
  .admin-page .daily-meal-title { display: flex; align-items: center; justify-content: space-between; gap: .6rem; color: #1c1917; }
  .admin-page .daily-meal-title strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .82rem; font-weight: 950; }
  .admin-page .daily-meal-title span { border-radius: 999px; background: #fff7ed; padding: .18rem .48rem; color: #c2410c; font-size: .75rem; font-weight: 950; }
  .admin-page .daily-cancelled-block { display: grid; gap: .35rem; border-radius: .75rem; border: 1px solid #fecaca; background: #fef2f2; padding: .55rem; }
  .admin-page .daily-cancelled-title { display: flex; align-items: center; justify-content: space-between; gap: .6rem; color: #991b1b; }
  .admin-page .daily-cancelled-title strong { font-size: .78rem; font-weight: 950; text-transform: uppercase; }
  .admin-page .daily-cancelled-title span { border-radius: 999px; background: #fff; padding: .16rem .46rem; color: #991b1b; font-size: .72rem; font-weight: 950; }
  .admin-page .daily-request-row { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: center; gap: .55rem; border-radius: .55rem; background: #fafaf9; padding: .42rem .5rem; }
  .admin-page .daily-request-row.is-cancelled { background: #fff; opacity: .92; }
  .admin-page .daily-request-title { min-width: 0; }
  .admin-page .daily-request-title strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .8rem; color: #1c1917; }
  .admin-page .daily-request-title small { display: block; margin-top: .1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #78716c; font-size: .64rem; font-weight: 800; }
  .admin-page .daily-request-side { display: flex; align-items: center; justify-content: flex-end; gap: .32rem; }
  .admin-page .daily-request-qty { min-width: 2.35rem; text-align: right; }
  .admin-page .daily-request-qty strong { display: block; font-size: .95rem; line-height: 1; font-weight: 950; color: #1c1917; }
  .admin-page .daily-request-qty small { font-size: 9px; font-weight: 900; color: #78716c; text-transform: uppercase; }
  .admin-page .daily-request-actions { display: flex; gap: .2rem; }
  .admin-page .daily-request-actions .btn { min-height: 1.85rem; width: 1.85rem; padding: 0; }
  .admin-page .daily-request-actions .daily-action-label { display: none; }
  .admin-page .daily-block-footer { display: grid; gap: .42rem; border-top: 1px solid #f5f5f4; padding: .58rem .7rem .68rem; }
  .admin-page .daily-final-summary { display: flex; flex-wrap: wrap; gap: .35rem; }
  .admin-page .daily-final-row { display: inline-flex; align-items: center; gap: .32rem; border-radius: 999px; border: 1px solid #fed7aa; background: #fff7ed; color: #c2410c; font-size: .7rem; font-weight: 950; }
  .admin-page .daily-final-row + .daily-final-row { border-top: 0; }
  .admin-page .daily-final-row span,
  .admin-page .daily-final-row strong { min-width: 0; padding: .24rem .42rem; }
  .admin-page .daily-final-row span { text-align: left; }
  .admin-page .daily-final-row strong { padding-left: 0; }
  .admin-page .daily-total-line { display: flex; align-items: center; justify-content: space-between; gap: .6rem; font-size: .78rem; font-weight: 950; color: #1c1917; }
  .admin-page .daily-block-footer .btn.primary { width: 100%; min-height: 2.1rem; }
  .admin-page .daily-status-line { display: flex; align-items: center; justify-content: space-between; gap: .5rem; border-radius: .65rem; background: #fafaf9; padding: .48rem .58rem; }
  .admin-page .daily-status-line span:first-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .72rem; font-weight: 900; color: #57534e; }
  .admin-page .daily-status-line .badge.pendente { border-color: #e7e5e4; background: #f5f5f4; color: #57534e; }
  .admin-page .daily-status-line .badge.aguardando_confirmacao { border-color: #fed7aa; background: #fff7ed; color: #c2410c; }
  .admin-page .daily-status-line .badge.aguardando_entrega { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
  .admin-page .daily-status-line .badge.cancelamento_pendente { border-color: #fecaca; background: #fef2f2; color: #991b1b; }
  .admin-page .daily-cancel-note { display: flex; align-items: center; justify-content: space-between; gap: .55rem; border-radius: .65rem; border: 1px solid #fecaca; background: #fef2f2; padding: .5rem .58rem; color: #991b1b; font-size: .72rem; font-weight: 900; }
  .admin-page .daily-cancel-note strong { color: #7f1d1d; }
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
  const cancellationBlocks = consolidations.filter((item) => ["cancelamento_pendente", "cancelado_confirmado"].includes(item.status));
  const pendingCancellationRequestIds = new Set(cancellationBlocks
    .filter((item) => item.status === "cancelamento_pendente")
    .flatMap((item) => item.requestIds ?? []));
  const finalCancellationRequestIds = new Set(cancellationBlocks
    .filter((item) => item.status === "cancelado_confirmado")
    .flatMap((item) => item.requestIds ?? []));
  const cancellationRequestIds = new Set([...pendingCancellationRequestIds, ...finalCancellationRequestIds]);
  const activeRequests = requests.filter((request) => request.status !== "cancelado" && !cancellationRequestIds.has(request.id));
  const cancelledRequests = requests
    .filter((request) => request.status === "cancelado" || cancellationRequestIds.has(request.id))
    .map((request) => pendingCancellationRequestIds.has(request.id)
      ? { ...request, status: "cancelamento_pendente" }
      : finalCancellationRequestIds.has(request.id)
      ? { ...request, status: "cancelado_confirmado" }
      : request);
  const activeRequestIds = new Set(activeRequests.map((request) => request.id));
  const consolidationHasActiveRequest = (item) => (item.requestIds ?? []).some((requestId) => activeRequestIds.has(requestId));
  const waitingRequests = activeRequests.filter((request) => request.status === "enviado");
  const linkedRequestIds = new Set(consolidations.flatMap((item) => item.requestIds ?? []));
  const lastSentAt = Math.max(...consolidations.map((item) => timestampValue(item.sentAt)), 0);
  const extraWaitingRequests = waitingRequests.filter((request) => {
    if (linkedRequestIds.has(request.id)) return false;
    if (!lastSentAt) return true;
    return Math.max(timestampValue(request.updatedAt), timestampValue(request.createdAt)) > lastSentAt;
  });
  const displayRequests = extraWaitingRequests.length ? extraWaitingRequests : activeRequests;
  const total = displayRequests.reduce((sum, request) => sum + Number(request.quantity ?? 0), 0);
  const byMeal = mealGroups(displayRequests);
  const leadersCount = new Set(displayRequests.map((request) => request.leaderId)).size;
  const sectionsCount = new Set(displayRequests.map((request) => request.teamId || request.sectionName || request.location)).size;
  const suppliersCount = new Set(displayRequests.map((request) => request.supplierCompanyId || request.supplierId).filter(Boolean)).size;
  const currentUser = state.users.find((user) => user.id === state.activeUserId);
  const cancelableConfirmedBlocks = currentUser?.role === "admin"
    ? consolidations.filter((item) => ["confirmado", "producao", "saiu_entrega"].includes(item.status) && consolidationHasActiveRequest(item))
    : [];
  const cancelableConfirmedBlock = [...cancelableConfirmedBlocks].sort((a, b) => {
    const priorityDiff = consolidationActionPriority(b) - consolidationActionPriority(a);
    return priorityDiff || newestActivity(b) - newestActivity(a);
  })[0];
  const operationalConsolidations = consolidations.filter((item) => !["cancelamento_pendente", "cancelado_confirmado"].includes(item.status) && consolidationHasActiveRequest(item));
  const canShowRecordedActuals = operationalConsolidations.some((item) => ["saiu_entrega", "entregue"].includes(item.status))
    || cancellationBlocks.some((item) => item.status === "cancelado_confirmado");
  const recordedActualTotal = canShowRecordedActuals
    ? displayRequests.reduce((sum, request) => sum + Number(getRecordedActualQuantity(state, "", request) ?? 0), 0)
    : 0;
  const hasRecordedActuals = canShowRecordedActuals && displayRequests.some((request) => getRecordedActualQuantity(state, "", request) !== null);
  const isFullyCancelled = !activeRequests.length && cancelledRequests.length > 0;
  const statusPresentation = dailyBlockStatusPresentation({
    activeRequests,
    consolidation,
    extraWaitingRequests,
    operationalConsolidations,
    cancellationConsolidations: cancellationBlocks,
    STATUS_LABEL
  });

  return (
    <article className={`daily-block-card${isFullyCancelled ? " is-cancelled" : ""}`}>
      <header className="daily-block-head">
        <div className="daily-block-head-main">
          <div>
            <span className="compact-kicker">Bloco diario</span>
            <h2>{formatDate(date)}</h2>
            <p>{displayRequests.length} pedidos - {leadersCount} encarregados - {sectionsCount} equipes - {suppliersCount} fornecedores</p>
          </div>
        </div>
      </header>
      <div className="daily-block-body">
        {byMeal.map((data) => (
          <section className="daily-meal-block" key={data.key}>
            <div className="daily-meal-title"><strong>{data.label}</strong><span>{data.total}</span></div>
            {data.rows.map((request) => {
              const editable = canEditRequest(state, request);
              return (
                <div className="daily-request-row" key={request.id}>
                  <div className="daily-request-title">
                    <strong>{mealDistributionName(state, request)}</strong>
                    <small>{requestOriginLabel(request)} - {request.sectionName || request.location} - {getSupplierCompanyName(state, request.supplierCompanyId, request.supplierId)}</small>
                  </div>
                  <div className="daily-request-side">
                    <div className="daily-request-qty"><strong>{request.quantity}</strong></div>
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
          </section>
        ))}
        {cancelledRequests.length ? (
          <section className="daily-cancelled-block">
            <div className="daily-cancelled-title"><strong>Pedidos cancelados</strong><span>{cancelledRequests.length}</span></div>
            {cancelledRequests.map((request) => (
              <div className="daily-request-row is-cancelled" key={request.id}>
                <div className="daily-request-title">
                  <strong>{mealDistributionName(state, request)}</strong>
                  <small>{requestOriginLabel(request)} - {request.sectionName || request.location} - {getSupplierCompanyName(state, request.supplierCompanyId, request.supplierId)}</small>
                </div>
                <div className="daily-request-side">
                  <div className="daily-request-qty"><strong>{request.quantity}</strong></div>
                  <span className={`badge ${request.status}`}>{statusLabel(STATUS_LABEL, request.status)}</span>
                </div>
              </div>
            ))}
          </section>
        ) : null}
      </div>
      <footer className="daily-block-footer">
        <div className="daily-final-summary">
          {byMeal.map((data) => (
            <div className="daily-final-row" key={data.key}>
              <span>{data.label}</span>
              <strong>{data.total}</strong>
            </div>
          ))}
        </div>
        {hasRecordedActuals ? <div className="daily-total-line"><span>Consumo real</span><strong>{recordedActualTotal} refeicoes</strong></div> : null}
        <div className="daily-total-line"><span>{extraWaitingRequests.length ? "Total a enviar" : "Total do dia"}</span><strong>{total} refeicoes</strong></div>
        {consolidation ? (
          <>
            <div className="daily-status-line">
              <span>{consolidations.length > 1 ? `${consolidations.length} pedidos ao fornecedor` : "Status do fornecedor"}</span>
              <span className={`badge ${statusPresentation.status}`}>{statusPresentation.label}</span>
            </div>
            {extraWaitingRequests.length ? (
              <button className="btn primary" type="button" data-send-request-date={date}>
                <Icon icon={icon} name="truck" size={15} />{consolidation.status === "enviado" ? "Enviar pedido extra" : "Enviar novo pedido da data"}
              </button>
            ) : null}
            {cancelableConfirmedBlock ? (
              <button className="btn danger" type="button" data-cancel-confirmed-consolidation={cancelableConfirmedBlock.id}>
                <Icon icon={icon} name="trash" size={15} />Cancelar pedido
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
