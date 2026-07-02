import React from "react";
import { RequestCard } from "../encarregado/RequestCard.jsx";
import { AdminReceiptHeader, Icon, getUserName, getWeekStart, requestsForDate } from "./shared.jsx";


// Componente de canhoto reutilizável (idêntico ao Inicio.jsx, adaptado para as métricas do admin)
function WeeklyConsumptionChart({ adminConsumptionWeekOffset, countStatus, formatDate, icon, money, requestValue, state, sumQty }) {
  const weekStart = getWeekStart(state.settings.defaultMealDate, adminConsumptionWeekOffset);
  const todayKey = state.settings.defaultMealDate;

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    const rows = requestsForDate(state, key).filter((request) => request.status !== "cancelado");
    return {
      key,
      date,
      label: date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
      total: sumQty(rows),
      waiting: countStatus(rows, "enviado"),
      delivered: countStatus(rows, "entregue"),
      value: rows.reduce((sum, request) => sum + requestValue(request), 0),
    };
  });

  const total = days.reduce((sum, day) => sum + day.total, 0);
  const totalValue = days.reduce((sum, day) => sum + day.value, 0);
  const max = Math.max(...days.map((day) => day.total), 1);

  return (
    <div className="grid gap-2 px-1">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[.12em] text-orange-700">Consumo recente</span>
          <h2 className="text-base font-black leading-tight text-stone-900">Semana operacional</h2>
          <p className="mt-0.5 text-xs font-bold text-stone-500">{formatDate(days[0].key)} até {formatDate(days[6].key)}</p>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:items-center">
          <button className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-stone-300 bg-white px-2 text-[11px] font-bold text-stone-700 shadow-sm transition hover:bg-stone-50 hover:text-orange-700" data-week-offset={adminConsumptionWeekOffset - 1}>
            <Icon icon={icon} name="arrow" size={12} /> Anterior
          </button>
          <button className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-stone-300 bg-white px-2 text-[11px] font-bold text-stone-700 shadow-sm transition hover:bg-stone-50" data-week-offset={0}>
            Atual
          </button>
          <button className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-stone-300 bg-white px-2 text-[11px] font-bold text-stone-700 shadow-sm transition hover:bg-stone-50" data-week-offset={adminConsumptionWeekOffset + 1}>
            Próxima
          </button>
        </div>
      </div>

      <div className="hidden">
        <div className="rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-200 bg-white px-3 py-2">
          <strong className="text-lg font-black leading-none text-stone-900">{total}</strong><br />
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Refeições na semana</span>
        </div>
        <div className="rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-200 bg-white px-3 py-2">
          <strong className="text-lg font-black leading-none text-stone-900">{money(totalValue)}</strong><br />
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Custo estimado</span>
        </div>
      </div>

      <div className="grid min-h-[7.25rem] grid-cols-7 items-end gap-1.5 px-1 pt-2" role="list">
        {days.map((day) => (
          <button
            className="group relative flex h-[7rem] appearance-none flex-col items-center justify-end border-0 bg-transparent p-0"
            type="button"
            role="listitem"
            data-filter-date-set={day.key}
            aria-label={`${day.label}, ${day.total} refeições`}
            key={day.key}
          >
            <span className="mb-1 text-[11px] font-black text-stone-500">{day.total || "-"}</span>
            <i
              className={`block w-full max-w-[1.35rem] rounded-t-full transition-all group-hover:opacity-80 ${day.key === todayKey ? "bg-orange-600" : "bg-stone-800"}`}
              style={{ height: `${Math.max(6, Math.round((day.total / max) * 70))}px` }}
            />
            <span className={`mt-1 text-[9px] font-black uppercase ${day.key === todayKey ? "text-orange-700" : "text-stone-400"}`}>{day.label}</span>
            <small className="text-[9px] font-bold text-stone-500">{String(day.date.getDate()).padStart(2, "0")}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function AdminLiveOrders(props) {
  const { canEditRequest, formatDateTime, icon, rows, state } = props;
  const operationalRows = rows.filter((request) => request.status !== "cancelado").sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const waitingRows = operationalRows.filter((request) => request.status === "enviado");
  const draftRows = operationalRows.filter((request) => request.status === "rascunho");
  const latestRows = operationalRows.slice(0, 6);
  const nextRequest = waitingRows[0] ?? draftRows[0] ?? latestRows[0];

  if (!latestRows.length) {
    return (
      <div className="grid justify-items-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-center">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-700">
          <Icon icon={icon} name="inbox" size={20} />
        </span>
        <strong className="text-stone-900">Fila vazia</strong>
        <p className="m-0 max-w-md text-xs font-semibold text-stone-500">
          Nenhum pedido chegou para esta data ainda. Assim que um encarregado enviar, ele aparecerá aqui automaticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-stone-900">
          {waitingRows.length ? `${waitingRows.length} pedido${waitingRows.length > 1 ? "s" : ""} aguardando` : "Fila operacional atualizada"}
        </h3>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[.1em] text-emerald-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span> Ao vivo
        </span>
      </div>

      {nextRequest && (
        <article className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-stone-50 p-2.5 sm:p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-stone-300 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wider text-stone-500">
              Próximo da fila <strong className="text-stone-900">{getUserName(state, nextRequest.leaderId)}</strong>
            </span>
          </div>

          <RequestCard {...props} request={nextRequest} compact />

          <div className="mt-1 flex flex-wrap gap-2">
            <button className="inline-flex min-h-[2.25rem] flex-1 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-xs font-bold text-stone-700 shadow-sm transition hover:bg-stone-100" data-open-request={nextRequest.id}>
              Abrir pedido
            </button>
            {canEditRequest(state, nextRequest) && (
              <button className="inline-flex min-h-[2.25rem] flex-1 items-center justify-center gap-2 rounded-lg bg-orange-600 px-3 text-xs font-bold text-white shadow-[0_8px_16px_-4px_rgba(234,88,12,0.4)] transition hover:bg-orange-700" data-send-request-date={nextRequest.date}>
                <Icon icon={icon} name="truck" size={14} /> Enviar
              </button>
            )}
            <button className="inline-flex min-h-[2.25rem] flex-1 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-xs font-bold text-stone-700 shadow-sm transition hover:bg-stone-100" data-view="pedidos">
              Ver todos
            </button>
          </div>
        </article>
      )}

      {latestRows.length > 1 && (
        <div className="hidden flex-col gap-3 border-t border-stone-100 pt-3 sm:flex">
          <h4 className="text-[10px] font-black uppercase tracking-[.12em] text-stone-400">Últimas atualizações</h4>
          {latestRows.filter(r => r.id !== nextRequest?.id).slice(0, 2).map((request) => (
            <article className="flex flex-col gap-2" key={request.id}>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500">
                <span>Por <strong className="text-stone-900">{getUserName(state, request.leaderId)}</strong></span>
                <span>{formatDateTime(request.updatedAt)}</span>
              </div>
              <RequestCard {...props} request={request} compact />
              {canEditRequest(state, request) && (
                <button className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-100 py-2 text-xs font-bold text-orange-800 transition hover:bg-orange-200" data-send-request-date={request.date} aria-label="Enviar pedido ao fornecedor">
                  <Icon icon={icon} name="truck" size={14} /> Enviar rapidamente
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function Painel(props) {
  const { countStatus, formatDate, icon, money, requestValue, state, sumQty } = props;
  const date = props.adminFilters.date;
  const rows = requestsForDate(state, date);
  const waitingCount = countStatus(rows, "enviado");
  const deliveredCount = countStatus(rows, "entregue");
  const totalCost = rows.reduce((sum, request) => sum + requestValue(request), 0);

  return (
    <div className="grid w-full gap-3 sm:gap-4">
      <AdminReceiptHeader
        className="admin-home-receipt"
        kicker={`Resumo - ${formatDate(date)}`}
        title="Visao geral administrativa"
        totalValue={waitingCount}
        totalLabel="pedidos a enviar"
        description="Aguardando envio ao fornecedor"
        actions={(
          <button className="btn primary" data-view="consolidacao">
            <Icon icon={icon} name="truck" size={16} />
            Enviar ao fornecedor
          </button>
        )}
        metrics={[
          { icon, iconName: "utensils", value: sumQty(rows), label: "Refeicoes hoje" },
          { icon, iconName: "clock", value: waitingCount, label: "Aguardando" },
          { icon, iconName: "check", value: deliveredCount, label: "Entregas feitas" },
          { icon, iconName: "dollar-sign", value: money(totalCost), label: "Custo estimado" },
        ]}
      />

      <section className="admin-live-panel">
        <AdminLiveOrders {...props} rows={rows} />
      </section>

      <WeeklyConsumptionChart {...props} />
    </div>
  );
}
