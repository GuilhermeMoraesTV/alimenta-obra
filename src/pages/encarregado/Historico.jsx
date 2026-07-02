import React, { useMemo } from "react";
import { RequestCard } from "./RequestCard.jsx";
import { Icon, leaderRequests, primaryButtonClass, shellClass } from "./shared.jsx";

function HistoryChip({ icon, iconName, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-300 bg-white px-3 py-3 shadow-sm">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-700">
        <Icon icon={icon} name={iconName} size={15} />
      </span>
      <div className="min-w-0 leading-tight">
        <strong className="block truncate text-lg font-black text-stone-950">{value}</strong>
        <span className="block truncate text-[9px] font-black uppercase tracking-[.08em] text-stone-500">{label}</span>
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
              <p className="m-0 text-[10px] font-black uppercase tracking-[.16em] text-orange-200">Historico do lider</p>
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
          <HistoryChip icon={icon} iconName="clipboard" value={rows.length} label="Pedidos" />
          <HistoryChip icon={icon} iconName="utensils" value={totalQty} label="Refeicoes" />
          <HistoryChip icon={icon} iconName="clock" value={draftCount} label="Rascunhos" />
        </div>
      </section>
      {!rows.length ? (
        <div className="grid justify-items-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-white px-6 py-8 text-center shadow-sm"><span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-orange-700"><Icon icon={icon} name="clipboard" size={22} /></span><strong>Historico vazio</strong><p className="m-0 text-sm text-stone-500">Os pedidos enviados ou salvos como rascunho aparecerao aqui.</p><button className={primaryButtonClass} data-view="pedido"><Icon icon={icon} name="plus" size={15} />Novo pedido</button></div>
      ) : (
        <section className="grid gap-3">
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">{rows.map((request) => <RequestCard {...props} request={request} compact key={request.id} />)}</div>
        </section>
      )}
    </div>
  );
}
