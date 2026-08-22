import React from "react";
import { getSupplierCompanies } from "../../services/store-v2.js";
import { AdminFilterMenu, AdminReceiptHeader, ExportButtons, Icon, RequestTable, getUserName, statusLabel } from "./shared.jsx";

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

const consolidacaoStyles = `
  .admin-page .admin-send-page { display: grid; gap: .75rem; }
  .admin-page .admin-send-receipt { overflow: visible; border-radius: 22px; border: 1px solid #27251f; background: #242622; box-shadow: 0 18px 40px -22px rgba(0,0,0,.55); isolation: isolate; }
  .admin-page .admin-send-receipt .admin-send-header { display: grid; margin: 0; border: 0; border-radius: 22px 22px 0 0; box-shadow: none; }
  .admin-page .admin-send-total { margin-top: .45rem; display: flex; align-items: end; gap: .55rem; color: #fff; }
  .admin-page .admin-send-total strong { font-size: clamp(2.7rem, 2rem + 3vw, 4.25rem); line-height: .82; font-weight: 950; letter-spacing: 0; }
  .admin-page .admin-send-total span { padding-bottom: .28rem; max-width: 8rem; font-size: 10px; line-height: 1.12; font-weight: 950; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.58); }
  .admin-page .admin-send-holes { pointer-events: none; display: flex; justify-content: space-around; padding: 0 1rem; transform: translateY(50%); }
  .admin-page .admin-send-holes span { width: .65rem; height: .65rem; border-radius: 999px; background: #fffefa; }
  .admin-page .admin-send-summary { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: .5rem; border-radius: 0 0 20px 20px; background: #f5f1ea; padding: 1.25rem 1rem .85rem; }
  .admin-page .admin-send-top-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: .5rem; }
  .admin-page .admin-send-chip { display: flex; min-width: 0; align-items: center; gap: .65rem; border-radius: 0 1rem 1rem .375rem; border: 1px solid #d6d3d1; border-left: 2px dashed #d6d3d1; background: #fffefa; padding: .78rem; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .admin-send-chip-icon { display: grid; width: 2rem; height: 2rem; flex-shrink: 0; place-items: center; border-radius: 999px; background: #fff0e8; color: #c2410c; }
  .admin-page .admin-send-chip strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 1.15rem; line-height: 1; font-weight: 950; color: #1c1917; }
  .admin-page .admin-send-chip span:last-child { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 950; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .admin-page .report-grid { display: grid; gap: .75rem; }
  .admin-page .data-panel,
  .admin-page .timeline-panel,
  .admin-page .table-panel { border-radius: 18px; border: 1px solid #ded9d1; background: rgba(255,254,250,.94); padding: 1rem; box-shadow: 0 12px 30px rgba(25,27,24,.055); }
  .admin-page .consolidated-summary { display: grid; gap: .65rem; }
  .admin-page .consolidated-block { display: grid; gap: .4rem; overflow: hidden; border-radius: 0 1rem 1rem .4rem; border: 1px solid #e4ded4; border-left: 2px dashed #d6d3d1; background: #fffefa; padding: .65rem; box-shadow: 0 1px 2px rgba(0,0,0,.035); }
  .admin-page .consolidated-block + .consolidated-block { margin-top: .55rem; }
  .admin-page .consolidated-block-title,
  .admin-page .consolidated-distribution-head,
  .admin-page .consolidated-row,
  .admin-page .consolidated-resume-row { display: grid; grid-template-columns: minmax(0,1fr) 4.5rem; align-items: center; }
  .admin-page .consolidated-block-title,
  .admin-page .consolidated-resume-row { color: #1c1917; font-size: .8rem; font-weight: 950; }
  .admin-page .consolidated-block-title { display: flex; align-items: center; justify-content: space-between; gap: .65rem; }
  .admin-page .consolidated-block-title span { border-radius: 999px; background: #fff7ed; padding: .18rem .5rem; color: #c2410c; font-size: .78rem; }
  .admin-page .consolidated-distribution-head { display: none; }
  .admin-page .consolidated-description { color: #78716c; font-size: .78rem; font-weight: 700; }
  .admin-page .consolidated-distribution { display: grid; gap: .3rem; }
  .admin-page .consolidated-row { display: flex; align-items: center; justify-content: space-between; gap: .75rem; border-radius: .55rem; background: #fafaf9; padding: .42rem .5rem; font-size: .875rem; }
  .admin-page .consolidated-row span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .admin-page .consolidated-resume { display: flex; flex-wrap: wrap; gap: .35rem; }
  .admin-page .consolidated-resume-row { display: inline-flex; align-items: center; gap: .32rem; border-radius: 999px; border: 1px solid #fed7aa; background: #fff7ed; color: #c2410c; font-size: .72rem; font-weight: 950; }
  .admin-page .consolidated-resume-row span,
  .admin-page .consolidated-resume-row strong { min-width: 0; padding: .24rem .44rem; }
  .admin-page .consolidated-resume-row strong { padding-left: 0; }
  .admin-page .total-line { font-weight: 950; color: #1c1917; }
  .admin-page .timeline { display: grid; gap: .5rem; }
  .admin-page .timeline-item { display: grid; grid-template-columns: 12px minmax(0,1fr); gap: .75rem; border-radius: 0 1rem 1rem .4rem; border: 1px solid #e4ded4; border-left: 2px dashed #d6d3d1; background: #fffefa; padding: .78rem; }
  .admin-page .timeline-dot { margin-top: .25rem; width: .75rem; height: .75rem; border-radius: 999px; background: #ea580c; box-shadow: 0 0 0 4px #fff0e8; }
  .admin-page .timeline-body { color: #78716c; font-size: .82rem; font-weight: 700; }
  .admin-page .timeline-body strong { color: #1c1917; font-size: .88rem; }
  .admin-page .admin-send-receipt-card .admin-receipt-metrics[data-count="3"] { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
  .admin-page .admin-send-receipt-card .admin-receipt-metrics[data-count="3"] .admin-receipt-chip:last-child { grid-column: 1 / -1; }
  @media (max-width: 767px) {
    .admin-page .admin-send-summary { grid-template-columns: 1fr; padding-inline: .75rem; }
    .admin-page .admin-send-receipt-card .admin-receipt-actions {
      display: grid;
      grid-template-columns: minmax(0,1fr) auto;
      align-items: center;
      gap: .35rem;
      width: auto;
      max-width: none;
    }
    .admin-page .admin-send-top-actions {
      grid-column: 1;
      display: flex;
      min-width: 0;
      justify-self: start;
      gap: .35rem;
    }
    .admin-page .admin-send-top-actions > *,
    .admin-page .admin-send-top-actions .admin-filter-menu summary,
    .admin-page .admin-send-top-actions .btn {
      width: auto;
      min-width: 0;
    }
    .admin-page .admin-send-receipt-card .admin-receipt-actions .admin-send-submit {
      grid-column: 2;
      justify-self: end;
      width: auto;
      max-width: 100%;
      min-height: 2.08rem;
      padding-inline: .75rem;
      font-size: .7rem;
    }
  }
  @media (min-width: 1024px) { .admin-page .report-grid { grid-template-columns: minmax(0,1fr) minmax(320px,.42fr); } .admin-page .admin-send-header { grid-template-columns: minmax(0,1fr) auto; } }
`;

function mealSummaryLabel(request, fallbackMeal) {
  const category = request?.mealCategory;
  if (category === "marmita") return "Marmita";
  if (category === "buffet") return "Buffer";
  if (category === "janta") return "Janta";
  return fallbackMeal || "Outro";
}

function mealDistributionName(state, request) {
  if (request.mealCategory === "marmita") return getUserName(state, request.leaderId);
  return request.sectionName || request.location || getUserName(state, request.leaderId);
}

function mealGroups(rows) {
  const order = { marmita: 0, buffet: 1, janta: 2, outro: 3 };
  return Object.values(rows.reduce((acc, request) => {
    const key = request.mealCategory || request.mealType || "outro";
    acc[key] ??= { key, label: mealSummaryLabel(request, request.mealType), total: 0, rows: [] };
    acc[key].total += Number(request.quantity ?? 0);
    acc[key].rows.push(request);
    return acc;
  }, {})).sort((a, b) => (order[a.key] ?? 9) - (order[b.key] ?? 9));
}

function ConsolidatedSummary({ requestMealDescription, state, summary }) {
  if (!summary.rows.length) return <div className="empty">Sem pedidos recebidos para enviar ao fornecedor.</div>;
  const groups = mealGroups(summary.rows);
  return (
    <div className="consolidated-summary">
      {groups.map((data) => (
        <div className="consolidated-block" key={data.key}>
          <div className="consolidated-block-title"><strong>{data.label}</strong><span>{data.total}</span></div>
          {requestMealDescription(data.rows[0]) ? <div className="consolidated-description">{requestMealDescription(data.rows[0])}</div> : null}
          <div className="consolidated-distribution">
            {data.rows.map((request) => (
              <div className="consolidated-row" key={request.id}>
                <span>{mealDistributionName(state, request)}</span>
                <strong>{request.quantity}</strong>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="consolidated-resume" aria-label="Resumo por refeicao">
        {groups.map((data) => (
          <div className="consolidated-resume-row" key={data.key}>
            <span>{data.label}</span>
            <strong>{data.total}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConsolidationTimeline({ consolidation, formatDateTime, state }) {
  const steps = [["enviado", "Enviado ao fornecedor"], ["confirmado", "Fornecedor confirmou recebimento"], ["producao", "Fornecedor confirmou producao"], ["saiu_entrega", "Entrega registrada"], ["entregue", "Entrega concluida"]];
  if (consolidation.status === "cancelado_confirmado") steps.push(["cancelado_confirmado", "Cancelado apos confirmacao"]);
  return (
    <div className="timeline">
      {steps.map(([step, label]) => {
        const confirmation = consolidation.confirmations.find((item) => item.step === step);
        const cancelled = step === "cancelado_confirmado" && consolidation.status === "cancelado_confirmado";
        return <div className="timeline-item" key={step}><div className="timeline-dot" style={{ background: confirmation || cancelled ? "var(--orange)" : "var(--line)" }} /><div className="timeline-body"><strong>{label}</strong><br />{confirmation ? `${getUserName(state, confirmation.userId)} - ${formatDateTime(confirmation.at)}` : cancelled ? formatDateTime(consolidation.updatedAt) : "Aguardando"}</div></div>;
      })}
    </div>
  );
}

export function Consolidacao(props) {
  const { adminFilters, formatDate, getConsolidationForDate, getConsolidationSummary, icon, state, STATUS_LABEL } = props;
  const date = adminFilters.date;
  const consolidation = getConsolidationForDate(state, date);
  const summary = getConsolidationSummary(state, consolidation);
  const suppliers = getSupplierCompanies(state, { includeInactive: false });
  const selectedSupplier = consolidation.supplierCompanyId ?? suppliers[0]?.id ?? "";
  const leadersCount = new Set(summary.rows.map((request) => request.leaderId)).size;
  const mealGroupsCount = Object.keys(summary.byMeal).length;

  return (
    <>
      <style>{baseAdminScreenStyles + consolidacaoStyles}</style>
      <section className="admin-send-page">
        <AdminReceiptHeader
          className="admin-send-receipt-card"
          kicker="Enviar pedido"
          title="Pedido ao fornecedor"
          totalValue={summary.total}
          totalLabel={`refeições para ${formatDate(date)}`}
          description="Revise a comanda consolidada e envie para o fornecedor selecionado."
          actions={(
            <>
              <div className="admin-send-top-actions">
                <AdminFilterMenu icon={icon}>
                  <input type="date" defaultValue={date} data-filter-date aria-label="Data do pedido" />
                  <select defaultValue={selectedSupplier} data-supplier-id aria-label="Fornecedor">{suppliers.map((supplier) => <option value={supplier.id} key={supplier.id}>{supplier.tradeName || supplier.legalName}</option>)}</select>
                  <span className={`badge ${consolidation.status}`}>{statusLabel(STATUS_LABEL, consolidation.status)}</span>
                </AdminFilterMenu>
                <ExportButtons exportMenuOpen={props.exportMenuOpen} icon={icon} id="consolidacao" items={[["pdf", "PDF", "chart"], ["doc", "Word", "clipboard"]]} />
              </div>
              <button className="btn primary admin-send-submit" data-action="send-consolidation"><Icon icon={icon} name="truck" size={15} />Enviar</button>
            </>
          )}
          metrics={[
            { icon, iconName: "utensils", value: summary.total, label: "Refeições" },
            { icon, iconName: "users", value: leadersCount, label: "Encarregados" },
            { icon, iconName: "package", value: mealGroupsCount, label: "Tipos no pedido" },
          ]}
        />

        <div className="report-grid">
          <div className="data-panel"><h2 className="section-title">Resumo do pedido</h2><ConsolidatedSummary {...props} summary={summary} /></div>
          <div className="timeline-panel"><h2 className="section-title">Linha do tempo</h2><ConsolidationTimeline {...props} consolidation={consolidation} /></div>
        </div>
        <div className="table-panel"><h2 className="section-title">Pedidos de origem</h2><RequestTable {...props} rows={summary.rows} showLeader /></div>
      </section>
    </>
  );
}
