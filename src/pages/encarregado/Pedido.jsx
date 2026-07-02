import React from "react";
import { RequestForm } from "./RequestForm.jsx";
import { Icon, shellClass } from "./shared.jsx";

export function Pedido({ formatDate, icon, state, ...props }) {
  return (
    <div className={shellClass}>
      <header className="overflow-hidden rounded-[22px] border border-stone-800 bg-[#242622] text-white shadow-[0_18px_40px_-22px_rgba(0,0,0,0.55)]">
        <div className="relative px-4 pb-7 pt-4 sm:px-6 sm:pt-5">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(currentColor 1.4px, transparent 1.4px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="m-0 text-[10px] font-black uppercase tracking-[.16em] text-orange-200">Comanda da obra</p>
              <h1 className="m-0 mt-1 text-[24px] font-black leading-none tracking-normal sm:text-[30px]">Novo pedido</h1>
              <p className="m-0 mt-1.5 text-xs font-bold text-white/55 sm:text-sm">
                Refeicao para {formatDate(state.settings.defaultMealDate)}
              </p>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-r-xl rounded-l-md border border-white/10 bg-white/8 text-orange-200">
              <Icon icon={icon} name="clipboard" size={19} />
            </span>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-around px-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="h-2.5 w-2.5 rounded-full bg-white" />
            ))}
          </div>
        </div>
      </header>
      <RequestForm {...props} formatDate={formatDate} icon={icon} state={state} />
    </div>
  );
}
