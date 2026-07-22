import React, { useMemo } from "react";
import { RequestCard } from "./RequestCard.jsx";
import { Icon, leaderRequests, primaryButtonClass, shellClass } from "./shared.jsx";

function mealGroupLabel(request) {
  if (request.mealCategory === "marmita") return "Marmita";
  if (request.mealCategory === "buffet") return "Buffer";
  if (request.mealCategory === "janta") return "Janta";
  return request.mealType || "Outras refeicoes";
}

function groupByDate(rows) {
  return Object.entries(rows.reduce((acc, request) => {
    acc[request.date] ??= [];
    acc[request.date].push(request);
    return acc;
  }, {})).sort(([dateA], [dateB]) => dateB.localeCompare(dateA));
}

function groupByMeal(rows) {
  const order = { marmita: 0, buffet: 1, janta: 2 };
  return Object.values(rows.reduce((acc, request) => {
    const key = request.mealCategory || request.mealType || "outro";
    acc[key] ??= { key, label: mealGroupLabel(request), rows: [], total: 0 };
    acc[key].rows.push(request);
    acc[key].total += Number(request.quantity ?? 0);
    return acc;
  }, {})).sort((a, b) => (order[a.key] ?? 9) - (order[b.key] ?? 9) || a.label.localeCompare(b.label));
}

function HistoryChip({ icon, iconName, label, value }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-1.5 rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-300 bg-white px-2.5 py-3 shadow-sm sm:flex-row sm:items-center sm:gap-3 sm:px-4">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-700 sm:h-9 sm:w-9">
        <Icon icon={icon} name={iconName} size={16} />
      </span>
      <div className="min-w-0 flex-1 leading-tight">
        <strong className="block truncate text-base font-black text-stone-900">{value}</strong>
        <span className="block text-[10px] font-bold uppercase leading-[1.15] tracking-normal text-stone-500">{label}</span>
      </div>
    </div>
  );
}

export function Historico(props) {
  const { countStatus, formatDate, icon, state, sumQty, user } = props;
  const rows = useMemo(() => leaderRequests(state, user), [state, user]);
  const activeRows = rows.filter((request) => request.status !== "cancelado");
  const lastRequest = rows[0];
  const totalQty = sumQty(activeRows);
  const draftCount = countStatus(rows, "rascunho");
  const dailyBlocks = groupByDate(rows);

  return (
    <div className={shellClass}>
      <section className="overflow-hidden rounded-[22px] border border-stone-800 bg-[#242622] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.55)]">
        <div className="relative px-4 pb-7 pt-4 text-white sm:px-6 sm:pt-5">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(currentColor 1.4px, transparent 1.4px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="m-0 text-[10px] font-black uppercase tracking-[.16em] text-orange-200">Histórico do líder</h1>
              <div className="mt-2 flex items-end gap-2.5">
                <span className="text-[46px] font-black leading-[0.85] tracking-tight sm:text-[60px]">{rows.length}</span>
                <span className="mb-1 text-[10px] font-extrabold uppercase leading-tight tracking-[.1em] text-white/55 sm:text-xs">
                  pedidos
                  <br />
                  registrados
                </span>
              </div>
              <p className="m-0 mt-1.5 text-xs font-bold text-white/55 sm:text-sm">
                {lastRequest ? `Ultimo movimento em ${formatDate(lastRequest.date)}` : "Nenhum pedido registrado ainda"}
              </p>
            </div>
            <button className={`${primaryButtonClass} shrink-0 shadow-lg shadow-orange-950/20`} data-view="pedido">
              <Icon icon={icon} name="plus" size={15} />
              Novo
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-around px-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="h-2.5 w-2.5 rounded-full bg-white" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 bg-stone-50 px-4 pb-3 pt-5 sm:px-6">
          <HistoryChip icon={icon} iconName="clipboard" value={rows.length} label="Pedidos registrados" />
          <HistoryChip icon={icon} iconName="utensils" value={totalQty} label="Refeições" />
          <HistoryChip icon={icon} iconName="clock" value={draftCount} label="Rascunhos" />
        </div>
      </section>
      {!rows.length ? (
        <div className="grid justify-items-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-white px-6 py-8 text-center shadow-sm"><span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-orange-700"><Icon icon={icon} name="clipboard" size={22} /></span><strong>Histórico vazio</strong><p className="m-0 text-sm text-stone-500">Os pedidos enviados ou salvos como rascunho aparecerão aqui.</p><button className={primaryButtonClass} data-view="pedido"><Icon icon={icon} name="plus" size={15} />Novo pedido</button></div>
      ) : (
        <section className="grid gap-3">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {dailyBlocks.map(([date, dateRows]) => {
              const activeDateRows = dateRows.filter((request) => request.status !== "cancelado");
              const total = sumQty(activeDateRows);
              const mealGroups = groupByMeal(dateRows);
              return (
                <article className="overflow-hidden rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-200 bg-[#fffefa] shadow-sm" key={date}>
                  <header className="flex items-start justify-between gap-3 border-b border-stone-100 px-3 py-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-[.1em] text-orange-700">Bloco diario</span>
                      <h2 className="m-0 mt-1 text-base font-black leading-none text-stone-950">{formatDate(date)}</h2>
                      <p className="m-0 mt-1 text-xs font-bold text-stone-500">{dateRows.length} pedidos registrados</p>
                    </div>
                    <div className="shrink-0 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-right">
                      <strong className="block text-sm font-black leading-none text-orange-700">{total}</strong>
                      <span className="text-[9px] font-black uppercase text-orange-600">refeicoes</span>
                    </div>
                  </header>
                  <div className="grid gap-2 p-3">
                    {mealGroups.map((group) => (
                      <section className="grid gap-2 rounded-xl border border-stone-200 bg-white p-2" key={group.key}>
                        <div className="flex items-center justify-between gap-2">
                          <strong className="min-w-0 truncate text-sm font-black text-stone-950">{group.label}</strong>
                          <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-black text-orange-700">{group.total}</span>
                        </div>
                        {group.rows.map((request) => <RequestCard {...props} request={request} compact key={request.id} />)}
                      </section>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
