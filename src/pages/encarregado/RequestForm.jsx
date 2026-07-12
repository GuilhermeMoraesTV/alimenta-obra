import React, { useEffect, useState } from "react";
import { getActiveWorkSections } from "../../services/store-v2.js";
import { Field, Icon, SectionTitle, inputClass, outlineButtonClass, panelClass, primaryButtonClass } from "./shared.jsx";

const ticketPanelClass = "overflow-hidden rounded-[18px] border border-stone-200 bg-white shadow-[0_12px_30px_rgba(25,27,24,.06)]";

function TicketPanel({ children, number, title }) {
  return (
    <section className={ticketPanelClass}>
      <div className="border-b border-dashed border-stone-200 bg-stone-50 px-4 py-3">
        <SectionTitle number={number} title={title} />
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </section>
  );
}

export function RequestForm({ icon, state, user }) {
  const [mealTypeId, setMealTypeId] = useState(state.mealTypes[0]?.id ?? "");
  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const currentMeal = state.mealTypes.find((meal) => meal.id === mealTypeId) ?? state.mealTypes[0];
  const sections = getActiveWorkSections(state, user.id);
  const fallbackLocationId = currentMeal?.locations?.[0]?.id ?? "";

  useEffect(() => {
    if (!state.mealTypes.some((meal) => meal.id === mealTypeId)) {
      setMealTypeId(state.mealTypes[0]?.id ?? "");
    }
  }, [mealTypeId, state.mealTypes]);

  if (!state.mealTypes.length) {
    return <div className={`${panelClass} text-center`}><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-orange-700"><Icon icon={icon} name="clipboard" size={22} /></span><strong>Nenhuma alimentacao ativa</strong><p className="m-0 text-sm text-stone-500">Administrador ou fornecedor precisa cadastrar um tipo de alimentacao antes do pedido.</p></div>;
  }

  return (
    <form className="grid gap-3 sm:gap-4" data-form="request">
      <TicketPanel number="1" title="Quando e quantas?">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="request-quantity" label="Quantidade de refeicoes">
            <div className="grid grid-cols-[44px_minmax(0,1fr)] overflow-hidden rounded-lg border border-stone-300 bg-white shadow-sm">
              <span className="grid place-items-center bg-stone-50 text-orange-700"><Icon icon={icon} name="users" size={20} /></span>
              <input className="min-h-12 w-full border-0 px-3 text-lg font-black outline-none" id="request-quantity" name="quantity" type="number" min="1" defaultValue="10" inputMode="numeric" required />
            </div>
          </Field>
          <Field id="request-date" label="Data da refeicao"><input className={inputClass} id="request-date" name="date" type="date" min={today} defaultValue={today} required /></Field>
        </div>
      </TicketPanel>

      <TicketPanel number="2" title="Qual refeicao?">
        <div className="grid gap-2 sm:grid-cols-3">
          {state.mealTypes.map((meal, index) => (
            <label className="grid cursor-pointer grid-cols-[34px_minmax(0,1fr)_18px] items-start gap-3 rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-200 bg-white p-3 transition has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50" key={meal.id}>
              <input className="sr-only" type="radio" name="mealTypeId" value={meal.id} checked={mealTypeId === meal.id} onChange={() => setMealTypeId(meal.id)} />
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-stone-100 text-orange-700"><Icon icon={icon} name={index === 0 ? "package" : "utensils"} size={20} /></span>
              <span className="min-w-0"><span className="block font-black text-stone-950">{meal.label}</span><span className="mt-1 block text-xs font-semibold text-stone-500">{meal.description || "Sem composicao cadastrada"}</span></span>
              <span className="mt-1 h-4 w-4 rounded-full border border-stone-300 bg-white shadow-inner" />
            </label>
          ))}
        </div>
      </TicketPanel>

      <TicketPanel number="3" title="Equipe / trecho">
        <input type="hidden" name="locationId" value={fallbackLocationId} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="request-team" label="Equipe ou trecho">
            <select className={inputClass} id="request-team" name="teamId" required>
              {sections.length
                ? sections.map((section) => <option value={section.id} key={section.id}>{section.name} - efetivo {section.headcount}</option>)
                : <option value="">Nenhuma equipe ativa</option>}
            </select>
          </Field>
          <Field id="request-leader" label="Responsavel"><input className={`${inputClass} bg-stone-50 text-stone-500`} id="request-leader" value={user.name} disabled readOnly /></Field>
        </div>
        {!sections.length ? (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
            Cadastre uma equipe/trecho ativo antes de enviar pedidos.
          </div>
        ) : null}
        <div className="mt-3"><Field id="request-notes" label="Observacao" optional><textarea className={`${inputClass} min-h-24 resize-y`} id="request-notes" name="notes" placeholder="Ex.: reforco de efetivo, ajuste de equipe ou observacao operacional" /></Field></div>
      </TicketPanel>

      <div className="sticky bottom-2 z-[2] grid gap-2 rounded-[18px] border border-stone-800 bg-[#242622]/95 p-3 text-white shadow-[0_18px_44px_rgba(25,27,24,.24)] backdrop-blur sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-white/65"><Icon icon={icon} name="clock" size={16} />Limite: {state.settings.cutoffTime} do dia anterior</div>
        <div className="grid grid-cols-2 gap-2">
          <button className={`${outlineButtonClass} border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/15`} type="submit" name="status" value="rascunho">Salvar rascunho</button>
          <button className={primaryButtonClass} type="submit" name="status" value="enviado" disabled={!sections.length}>Enviar pedido <Icon icon={icon} name="arrow" size={16} /></button>
        </div>
      </div>
    </form>
  );
}
