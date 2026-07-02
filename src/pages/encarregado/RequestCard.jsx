import React from "react";
import { Icon, iconButtonClass, statusBadgeClass } from "./shared.jsx";

export function RequestCard({ canEditRequest, formatDate, formatDateTime, icon, request, requestMealDescription, state, STATUS_LABEL, compact = false }) {
  const editable = canEditRequest(state, request);
  const composition = requestMealDescription(request);

  return (
    <article className={`${compact ? "rounded-r-2xl rounded-l-md border-l-2 border-dashed bg-[#fffefa] p-3" : "rounded-2xl bg-white p-3 sm:p-4"} border border-stone-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(34,29,24,.12)]`}>
      <div className="grid grid-cols-[42px_minmax(0,1fr)_auto] gap-3">
        <span className={`${compact ? "rounded-r-xl rounded-l-md border border-orange-100 bg-orange-50" : "rounded-xl bg-orange-50"} grid h-10 w-10 place-items-center text-orange-700`}>
          <Icon icon={icon} name={request.mealType?.includes("Marmita") ? "package" : "utensils"} size={19} />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <strong className="min-w-0 text-[15px] text-stone-950">{request.mealType}</strong>
            <span className={statusBadgeClass(request.status)}>{STATUS_LABEL[request.status] ?? request.status}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-stone-500">
            <span className="inline-flex items-center gap-1"><Icon icon={icon} name="clock" size={14} />{formatDate(request.date)}</span>
            <span className="inline-flex min-w-0 items-center gap-1"><Icon icon={icon} name="map" size={14} />{request.deliveryAddress || request.location}</span>
          </div>
          {composition ? <div className={`${compact ? "border border-dashed border-stone-200 bg-stone-50/70" : "bg-stone-50"} mt-2 rounded-lg px-3 py-2 text-xs font-semibold text-stone-600`}>{composition}</div> : null}
        </div>
        <div className="text-right">
          <strong className={`${compact ? "text-xl" : "text-2xl"} block font-black leading-none text-stone-950`}>{request.quantity}</strong>
          <span className="text-[10px] font-black uppercase text-stone-500">refeicoes</span>
        </div>
      </div>
      <div className={`${compact ? "mt-2 pt-2" : "mt-3 pt-3"} flex flex-col gap-2 border-t border-stone-100 text-xs font-bold text-stone-500 sm:flex-row sm:items-center sm:justify-between`}>
        <span>Atualizado {formatDateTime(request.updatedAt)}</span>
        {editable ? (
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button className={iconButtonClass} data-edit-request={request.id} aria-label="Editar pedido"><Icon icon={icon} name="edit" size={15} />Editar</button>
            <button className={`${iconButtonClass} border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100`} data-cancel-request={request.id} aria-label="Cancelar pedido"><Icon icon={icon} name="trash" size={15} />Cancelar</button>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1 text-stone-500"><Icon icon={icon} name="clock" size={14} />Edicao encerrada</span>
        )}
      </div>
    </article>
  );
}
