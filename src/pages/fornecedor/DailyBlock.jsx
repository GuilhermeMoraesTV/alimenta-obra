import React from "react";
import { requestOriginLabel } from "../../services/store-v2.js";
import { Icon, mealDistributionName, mealGroups, statusLabel } from "./shared.jsx";

export const supplierDailyBlockStyles = `
  .supplier-page .supplier-daily-block-list { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); align-items: start; gap: .75rem; }
  .supplier-page .supplier-daily-block-card { display: grid; min-width: 0; overflow: hidden; border-radius: 16px; border: 1px solid #e7e5e4; border-left: 2px dashed #d6d3d1; background: #fffefa; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .supplier-page .supplier-daily-block-card.is-extra { border-color: #fdba74; border-left-color: #ea580c; background: #fff7ed; }
  .supplier-page .supplier-daily-block-head { display: grid; gap: .55rem; border-bottom: 1px solid #f5f5f4; padding: .75rem; }
  .supplier-page .supplier-daily-block-head-main { display: grid; align-items: start; gap: .75rem; }
  .supplier-page .supplier-daily-block-head h2 { font-size: 1rem; line-height: 1; color: #1c1917; }
  .supplier-page .supplier-daily-block-head p { color: #78716c; font-size: .72rem; font-weight: 800; }
  .supplier-page .supplier-daily-extra-chip { display: inline-flex; width: fit-content; align-items: center; gap: .28rem; border-radius: 999px; border: 1px solid #fb923c; background: #ffedd5; padding: .28rem .5rem; color: #9a3412; font-size: 9px; font-weight: 950; text-transform: uppercase; }
  .supplier-page .supplier-daily-block-body { display: grid; gap: .45rem; padding: .65rem .75rem; }
  .supplier-page .supplier-daily-meal-block { display: grid; gap: .35rem; border-radius: .8rem; border: 1px solid #eee8df; background: #fff; padding: .58rem; }
  .supplier-page .supplier-daily-meal-title { display: flex; align-items: center; justify-content: space-between; gap: .65rem; color: #1c1917; }
  .supplier-page .supplier-daily-meal-title strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .86rem; font-weight: 950; }
  .supplier-page .supplier-daily-meal-title span { border-radius: 999px; background: #fff7ed; padding: .18rem .5rem; color: #c2410c; font-size: .78rem; font-weight: 950; }
  .supplier-page .supplier-daily-meal-description { color: #78716c; font-size: .7rem; font-weight: 800; }
  .supplier-page .supplier-daily-request-row { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: center; gap: .55rem; border-radius: .55rem; background: #fafaf9; padding: .42rem .5rem; }
  .supplier-page .supplier-daily-request-title { min-width: 0; }
  .supplier-page .supplier-daily-request-title strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .85rem; color: #1c1917; }
  .supplier-page .supplier-daily-request-title small { display: block; margin-top: .12rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #78716c; font-size: .68rem; font-weight: 800; }
  .supplier-page .supplier-daily-request-qty { min-width: 2.75rem; text-align: right; }
  .supplier-page .supplier-daily-request-qty strong { display: block; font-size: 1rem; line-height: 1; font-weight: 950; color: #1c1917; }
  .supplier-page .supplier-daily-request-qty small { font-size: 9px; font-weight: 900; color: #78716c; text-transform: uppercase; }
  .supplier-page .supplier-daily-block-footer { display: grid; gap: .5rem; border-top: 1px solid #f5f5f4; padding: .65rem .75rem .75rem; }
  .supplier-page .supplier-daily-final-summary { display: flex; flex-wrap: wrap; gap: .35rem; }
  .supplier-page .supplier-daily-final-row { display: inline-flex; align-items: center; gap: .32rem; border-radius: 999px; border: 1px solid #fed7aa; background: #fff7ed; color: #c2410c; font-size: .72rem; font-weight: 950; }
  .supplier-page .supplier-daily-final-row + .supplier-daily-final-row { border-top: 0; }
  .supplier-page .supplier-daily-final-row span,
  .supplier-page .supplier-daily-final-row strong { min-width: 0; padding: .24rem .44rem; }
  .supplier-page .supplier-daily-final-row span { text-align: left; }
  .supplier-page .supplier-daily-final-row strong { padding-left: 0; }
  .supplier-page .supplier-daily-update-alert { display: grid; grid-template-columns: auto minmax(0,1fr); align-items: center; gap: .45rem; border-radius: .75rem; border: 1px solid #fed7aa; background: #fff7ed; padding: .55rem .6rem; color: #9a3412; }
  .supplier-page .supplier-daily-update-alert strong { display: block; font-size: .72rem; font-weight: 950; text-transform: uppercase; }
  .supplier-page .supplier-daily-update-alert span { display: block; margin-top: .08rem; font-size: .68rem; font-weight: 800; color: #c2410c; }
  .supplier-page .supplier-daily-cancel-note { display: flex; align-items: center; justify-content: space-between; gap: .55rem; border-radius: .75rem; border: 1px solid #fecaca; background: #fef2f2; padding: .55rem .6rem; color: #991b1b; font-size: .72rem; font-weight: 900; }
  .supplier-page .supplier-daily-cancel-note strong { color: #7f1d1d; }
  .supplier-page .supplier-daily-total-line { display: flex; align-items: center; justify-content: space-between; gap: .75rem; font-size: .82rem; font-weight: 950; color: #1c1917; }
  .supplier-page .supplier-daily-actions { display: grid; grid-template-columns: minmax(0,1fr); gap: .4rem; }
  .supplier-page .supplier-daily-actions .btn { width: 100%; min-height: 2.35rem; }
  @media (max-width: 767px) {
    .supplier-page .supplier-daily-block-list { grid-template-columns: 1fr; }
  }
  @media (min-width: 768px) and (max-width: 1180px) {
    .supplier-page .supplier-daily-block-list { grid-template-columns: repeat(2,minmax(0,1fr)); }
  }
`;

export function SupplierDailyBlockCard(props) {
  const { consolidation, formatDate, getConsolidationSummary, icon, nextSupplierStep, STATUS_LABEL } = props;
  const summary = getConsolidationSummary(props.state, consolidation);
  const next = nextSupplierStep(consolidation.status);
  const createdAt = new Date(consolidation.createdAt ?? consolidation.sentAt ?? 0).getTime();
  const isExtra = Number.isFinite(createdAt) && (props.state.consolidations ?? []).some((item) => {
    if (item.id === consolidation.id || item.date !== consolidation.date || item.supplierId !== consolidation.supplierId) return false;
    if (item.status === "rascunho") return false;
    const itemCreatedAt = new Date(item.createdAt ?? item.sentAt ?? 0).getTime();
    return Number.isFinite(itemCreatedAt) && itemCreatedAt < createdAt;
  });
  const byMeal = mealGroups(summary.rows);
  const leadersCount = new Set(summary.rows.map((request) => request.leaderId || request.createdBy)).size;
  const sectionsCount = new Set(summary.rows.map((request) => request.teamId || request.sectionName || request.location)).size;
  const updatedRows = consolidation.sentAt
    ? summary.rows.filter((request) => request.updatedAt && new Date(request.updatedAt) > new Date(consolidation.sentAt))
    : [];
  const hasAdminUpdate = consolidation.status === "enviado" && (updatedRows.length > 0 || (consolidation.revisions?.length ?? 0) > 0);
  const isConfirmedCancelled = consolidation.status === "cancelado_confirmado";

  return (
    <article className={`supplier-daily-block-card${isExtra ? " is-extra" : ""}`}>
      <header className="supplier-daily-block-head">
        <div className="supplier-daily-block-head-main">
          <div>
            <span className="compact-kicker">{isExtra ? "Pedido extra" : "Bloco diario"}</span>
            <h2>{formatDate(consolidation.date)}</h2>
            <p>{summary.rows.length} pedidos - {leadersCount} encarregados - {sectionsCount} equipes</p>
          </div>
        </div>
        {isExtra ? <span className="supplier-daily-extra-chip"><Icon icon={icon} name="plus" size={12} />Pedido extra da data</span> : null}
      </header>
      <div className="supplier-daily-block-body">
        {byMeal.map((data) => (
          <section className="supplier-daily-meal-block" key={data.key}>
            <div className="supplier-daily-meal-title"><strong>{data.label}</strong><span>{data.total}</span></div>
            {props.requestMealDescription?.(data.rows[0]) ? <div className="supplier-daily-meal-description">{props.requestMealDescription(data.rows[0])}</div> : null}
            {data.rows.map((request) => (
              <div className="supplier-daily-request-row" key={request.id}>
                <div className="supplier-daily-request-title">
                  <strong>{mealDistributionName(props.state, request)}</strong>
                  <small>{requestOriginLabel(request)} - {request.sectionName || request.location}</small>
                </div>
                <div className="supplier-daily-request-qty"><strong>{request.quantity}</strong></div>
              </div>
            ))}
          </section>
        ))}
      </div>
      <footer className="supplier-daily-block-footer">
        {hasAdminUpdate ? (
          <div className="supplier-daily-update-alert">
            <Icon icon={icon} name="edit" size={15} />
            <div><strong>Pedido atualizado pelo Admin</strong><span>Confira quantidades e itens antes de confirmar recebimento.</span></div>
          </div>
        ) : null}
        <div className="supplier-daily-final-summary">
          {byMeal.map((data) => (
            <div className="supplier-daily-final-row" key={data.key}>
              <span>{data.label}</span>
              <strong>{data.total}</strong>
            </div>
          ))}
        </div>
        <div className="supplier-daily-total-line"><span>{isExtra ? "Total do extra" : "Total do dia"}</span><strong>{summary.total} refeicoes</strong></div>
        {isConfirmedCancelled ? <div className="supplier-daily-cancel-note"><span>Consumo real</span><strong>0 refeicoes</strong></div> : null}
        <div className="supplier-daily-actions">
          {next ? <button className="btn primary small" data-step={next.step} data-id={consolidation.id}><Icon icon={icon} name={next.iconName ?? "check"} size={15} />{next.label}</button> : <span className={`badge ${consolidation.status}`}>{statusLabel(STATUS_LABEL, consolidation.status)}</span>}
        </div>
      </footer>
    </article>
  );
}
