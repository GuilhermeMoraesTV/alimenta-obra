import React from "react";
import { AdminBackButton, AdminFilterMenu, AdminReceiptHeader, ExportButtons, RequestTable, Icon } from "./shared.jsx";

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

  /* COMPACTAÇÃO EXTREMA PARA O MOBILE */
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

export function Relatorios(props) {
  const { icon, state, sumQty, totalsByMeal } = props;
  const rows = state.requests.filter((request) => request.status !== "cancelado");
  const total = sumQty(rows);
  const mealTotals = totalsByMeal(rows);

  return (
    <>
      <style>{baseAdminScreenStyles + relatoriosHeroStyles}</style>

      <AdminReceiptHeader
        kicker="Relatorios"
        title="Visao geral e desempenho"
        totalValue={total}
        totalLabel="refeicoes no periodo"
        description="Filtre por periodo diario, semanal, mensal ou personalizado."
        actions={(
          <>
            <AdminBackButton icon={icon} />
            <AdminFilterMenu icon={icon}>
              <select data-report-range>
                <option value="day">Data</option>
                <option value="week">Semana</option>
                <option value="month">Mes</option>
                <option value="custom">Periodo personalizado</option>
              </select>
              <input type="date" defaultValue={state.settings.defaultMealDate} />
              <input type="date" defaultValue={state.settings.defaultMealDate} />
            </AdminFilterMenu>

            <ExportButtons
              exportMenuOpen={props.exportMenuOpen}
              icon={icon}
              id="relatorios"
              items={[["csv", "CSV", "clipboard"], ["xlsx", "Excel", "chart"]]}
            />
          </>
        )}
        metrics={[
          { icon, iconName: "utensils", label: "Refeicoes", value: total },
          { icon, iconName: "clipboard", label: "Pedidos", value: rows.length },
          { icon, iconName: "box", label: "Marmitas", value: mealTotals["Marmita Campo"] ?? 0 },
          { icon, iconName: "utensils", label: "Almocos", value: mealTotals["Buffer Almoco"] ?? 0 },
          { icon, iconName: "moon", label: "Jantas", value: mealTotals.Jantar ?? 0 },
        ]}
      />

      <div className="finance-hero mt-2">
        <div className="finance-hero-head">

          {/* Botão de voltar acima do título */}
          <div>
            <button className="sleek-back-btn" data-view="admin">
              <Icon icon={icon} name="arrow-left" size={12} /> Voltar
            </button>
          </div>

          <div className="finance-hero-row">
            <div>
              <span className="compact-kicker">Relatórios</span>
              <h1>Visão geral e desempenho</h1>
              <p>Filtre por período diário, semanal, mensal ou personalizado.</p>
            </div>

            {/* Ações Redesenhadas */}
            <div className="finance-hero-actions">
              <AdminFilterMenu icon={icon}>
                <select data-report-range>
                  <option value="day">Data</option>
                  <option value="week">Semana</option>
                  <option value="month">Mês</option>
                  <option value="custom">Período personalizado</option>
                </select>
                <input type="date" defaultValue={state.settings.defaultMealDate} />
                <input type="date" defaultValue={state.settings.defaultMealDate} />
              </AdminFilterMenu>

              <ExportButtons
                exportMenuOpen={props.exportMenuOpen}
                icon={icon}
                id="relatorios"
                items={[["csv", "CSV", "clipboard"], ["xlsx", "Excel", "chart"]]}
              />
            </div>
          </div>
        </div>

        <div className="finance-holes">
          {Array.from({ length: 14 }).map((_, index) => <span key={index} />)}
        </div>

        <div className="finance-metrics-strip">
          <FinanceMetric accent icon={icon} iconName="clipboard" label="Total" value={total} hint="refeições no período" />
          <FinanceMetric icon={icon} iconName="box" label="Marmitas" value={totalsByMeal(rows)["Marmita Campo"] ?? 0} hint="entregas em campo" />
          <FinanceMetric icon={icon} iconName="utensils" label="Almoços" value={totalsByMeal(rows)["Buffer Almoco"] ?? 0} hint="refeições no buffer" />
          <FinanceMetric icon={icon} iconName="moon" label="Jantas" value={totalsByMeal(rows).Jantar ?? 0} hint="período noturno" />
        </div>
      </div>

      <div className="mt-3">
        {/* Histórico Ocupando 100% (Sem Ranking) */}
        <article className="overflow-hidden rounded-2xl border border-l-2 border-dashed border-stone-300 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-stone-800">
            Histórico Completo
          </h2>
          <div className="overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 shadow-inner">
            <RequestTable {...props} rows={rows} showLeader />
          </div>
        </article>
      </div>
    </>
  );
}
