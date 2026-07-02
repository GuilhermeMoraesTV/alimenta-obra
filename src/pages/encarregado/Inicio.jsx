import React, { useMemo } from "react";
import { RequestCard } from "./RequestCard.jsx";
import { Icon, leaderRequests, primaryButtonClass, shellClass } from "./shared.jsx";

const STATUS_LABEL = {
  rascunho: "Rascunho",
  pendente: "Pendente",
  aprovado: "Aprovado",
  cancelado: "Cancelado",
};

const STATUS_STAMP = {
  rascunho: "border-stone-400/60 text-stone-300",
  pendente: "border-amber-300/70 text-amber-300",
  aprovado: "border-emerald-300/70 text-emerald-300",
  cancelado: "border-rose-300/70 text-rose-300",
};

function StubChip({ icon, iconName, value, label }) {
  return (
    <div className="flex min-w-[172px] flex-1 items-center gap-3 rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-300 bg-white px-4 py-3 shadow-sm sm:min-w-0">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-700">
        <Icon icon={icon} name={iconName} size={16} />
      </span>
      <div className="min-w-0 leading-tight">
        <div className="truncate text-base font-black text-stone-900">{value}</div>
        <div className="truncate text-[10px] font-bold uppercase tracking-[.08em] text-stone-500">{label}</div>
      </div>
    </div>
  );
}

export function Inicio(props) {
  const { countStatus, formatDate, icon, state, sumQty, user } = props;
  const rows = useMemo(() => leaderRequests(state, user), [state, user]);
  const activeRows = rows.filter((request) => request.status !== "cancelado");
  const mealDate = state.settings.defaultMealDate;
  const todayRows = activeRows.filter((request) => request.date === mealDate);
  const featuredRequest = todayRows[0] ?? activeRows[0] ?? rows[0];
  const todayQuantity = sumQty(todayRows);
  const draftCount = countStatus(activeRows, "rascunho");
  const homeStatus = featuredRequest ? (featuredRequest.date === mealDate ? "Pedido de hoje" : "Ultimo pedido") : "Sem pedido ativo";
  const stampClass = STATUS_STAMP[featuredRequest?.status] ?? "border-white/25 text-white/45";

  return (
    <div className={shellClass}>
      {/* BARRA SUPERIOR */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] font-black uppercase tracking-[.16em] text-orange-700">Painel do lider</p>
        <button
          className="inline-flex items-center gap-1 text-xs font-extrabold text-stone-500 transition hover:text-orange-700"
          data-view="historico"
        >
          Pedidos anteriores
          <Icon icon={icon} name="arrow" size={13} />
        </button>
      </div>

      {/* COMANDA */}
      <section className="overflow-hidden rounded-[22px] border border-stone-800 bg-[#242622] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.55)]">
        {/* cabecalho: numero em destaque + carimbo de status */}
        <div className="relative px-4 pb-7 pt-4 text-white sm:px-6 sm:pt-5">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(currentColor 1.4px, transparent 1.4px)",
              backgroundSize: "16px 16px",
            }}
          />
          {featuredRequest ? (
            <span
              className={`absolute right-4 top-4 -rotate-6 rounded-md border-2 px-2 py-1 text-[9px] font-black uppercase tracking-[.12em] sm:right-6 sm:top-5 ${stampClass}`}
            >
              {STATUS_LABEL[featuredRequest.status] ?? featuredRequest.status}
            </span>
          ) : null}

          <p className="relative text-[10px] font-black uppercase tracking-[.16em] text-orange-200">
            Hoje &middot; {formatDate(mealDate)}
          </p>

          <div className="relative mt-2 flex items-end gap-2.5">
            <span className="text-[48px] font-black leading-[0.85] tracking-tight sm:text-[64px]">{todayQuantity}</span>
            <span className="mb-1 text-[10px] font-extrabold uppercase leading-tight tracking-[.1em] text-white/55 sm:text-xs">
              refeicoes
              <br />
              hoje
            </span>
          </div>

          <p className="relative mt-1.5 text-xs font-bold text-white/55 sm:text-sm">
            {homeStatus}
            {featuredRequest && featuredRequest.date !== mealDate ? ` \u00b7 ${formatDate(featuredRequest.date)}` : ""}
          </p>

          {/* perfuracao da comanda */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-around px-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="h-2.5 w-2.5 rounded-full bg-white" />
            ))}
          </div>
        </div>

        {/* canhotos de resumo */}
        <div className="grid grid-cols-2 gap-2 bg-stone-50 px-4 pb-3 pt-5 sm:px-6">
          <StubChip icon={icon} iconName="utensils" value={todayQuantity} label="Refeicoes hoje" />
          <StubChip icon={icon} iconName="clipboard" value={draftCount} label={draftCount === 1 ? "Rascunho" : "Rascunhos"} />
        </div>

        {/* corpo: detalhe do pedido */}
        <div className="bg-white px-4 pb-3 pt-5 text-stone-900 sm:px-6">
          {featuredRequest ? (
            <RequestCard {...props} request={featuredRequest} />
          ) : (
            <div className="grid justify-items-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-8 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-orange-700">
                <Icon icon={icon} name="clipboard" size={22} />
              </span>
              <strong className="text-stone-900">Nada pendente para {formatDate(mealDate)}</strong>
              <p className="m-0 max-w-md text-sm text-stone-500">
                Quando precisar alimentar a equipe, crie o pedido em poucos passos.
              </p>
            </div>
          )}
        </div>

        {/* aba de acao */}
        <div className="flex flex-col gap-3 border-t border-stone-100 bg-stone-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-stone-500">
            <Icon icon={icon} name="clock" size={14} />
            Prazo: ate {state.settings.cutoffTime} do dia anterior
          </span>
          <button
            className={`${primaryButtonClass} w-full justify-center shadow-lg shadow-orange-950/20 transition active:scale-[0.97] sm:w-auto`}
            data-view="pedido"
          >
            <Icon icon={icon} name="plus" size={16} />
            Novo pedido
          </button>
        </div>
      </section>
    </div>
  );
}
