import React, { useEffect, useState } from "react";
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

function AddressForm() {
  return (
    <div className="mt-3 grid gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
      <Field id="delivery-address-label" label="Nome do endereco"><input className={inputClass} id="delivery-address-label" placeholder="Ex.: Frente Norte" required /></Field>
      <Field id="delivery-address-line" label="Endereco completo"><input className={inputClass} id="delivery-address-line" placeholder="Rua, numero, bairro e cidade" required /></Field>
      <Field id="delivery-address-reference" label="Referencia" optional><input className={inputClass} id="delivery-address-reference" placeholder="Portaria, bloco ou ponto de apoio" /></Field>
      <div className="grid grid-cols-2 gap-2">
        <button className={outlineButtonClass} type="button" data-address-form-cancel>Cancelar</button>
        <button className={primaryButtonClass} type="button" data-save-delivery-address>Salvar endereco</button>
      </div>
    </div>
  );
}

export function RequestForm({ getLeaderAddressFormOpen, icon, state, user }) {
  const [mealTypeId, setMealTypeId] = useState(state.mealTypes[0]?.id ?? "");
  const authenticatedUser = state.users.find((item) => item.id === state.authenticatedUserId);
  const canManageAddresses = user.id === state.authenticatedUserId || authenticatedUser?.role === "admin";
  const currentMeal = state.mealTypes.find((meal) => meal.id === mealTypeId) ?? state.mealTypes[0];
  const addresses = state.deliveryAddresses.filter((address) => address.leaderId === user.id && address.active !== false);

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
          <Field id="request-date" label="Data da refeicao"><input className={inputClass} id="request-date" name="date" type="date" defaultValue={state.settings.defaultMealDate} required /></Field>
        </div>
      </TicketPanel>

      <TicketPanel number="2" title="Qual refeicao?">
        <div className="grid gap-2 sm:grid-cols-3">
          {state.mealTypes.map((meal, index) => (
            <label className="grid cursor-pointer grid-cols-[34px_minmax(0,1fr)_18px] items-start gap-3 rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-200 bg-white p-3 transition has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50" key={meal.id}>
              <input className="sr-only" type="radio" name="mealTypeId" value={meal.id} checked={mealTypeId === meal.id} onChange={() => setMealTypeId(meal.id)} />
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-stone-100 text-orange-700"><Icon icon={icon} name={index === 0 ? "package" : "utensils"} size={20} /></span>
              <span className="min-w-0"><span className="block font-black text-stone-950">{meal.label}</span><span className="mt-1 block text-xs font-semibold text-stone-500">{meal.description || meal.locations.map((item) => item.name).join(" ou ")}</span></span>
              <span className="mt-1 h-4 w-4 rounded-full border border-stone-300 bg-white shadow-inner" />
            </label>
          ))}
        </div>
      </TicketPanel>

      <TicketPanel number="3" title="Onde entrega?">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="request-location" label="Local de entrega"><select className={inputClass} id="request-location" key={mealTypeId} name="locationId">{(currentMeal?.locations ?? []).map((location) => <option value={location.id} key={location.id}>{location.name}</option>)}</select></Field>
          <Field id="request-leader" label="Responsavel"><input className={`${inputClass} bg-stone-50 text-stone-500`} id="request-leader" value={user.name} disabled readOnly /></Field>
        </div>
        {state.deliveryAddressFeatureAvailable ? (
          <div className="mt-3 grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[10px] font-black uppercase tracking-[.08em] text-stone-500" htmlFor="request-delivery-address">Endereco de entrega</label>
              {canManageAddresses ? <button type="button" className="inline-flex items-center gap-1 text-xs font-black text-orange-700" data-address-form-toggle><Icon icon={icon} name="plus" size={15} />Novo endereco</button> : null}
            </div>
            <select className={inputClass} id="request-delivery-address" name="deliveryAddressId" required>
              {addresses.length ? <option value="">Selecione um endereco</option> : <option value="">Cadastre um endereco de entrega</option>}
              {addresses.map((address) => <option value={address.id} key={address.id}>{address.label} - {address.addressLine}</option>)}
            </select>
            {canManageAddresses && getLeaderAddressFormOpen() ? <AddressForm /> : null}
          </div>
        ) : (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700"><Icon icon={icon} name="map" size={15} /> Enderecos salvos serao liberados apos a atualizacao do banco.</div>
        )}
        <div className="mt-3"><Field id="request-notes" label="Observacao" optional><textarea className={`${inputClass} min-h-24 resize-y`} id="request-notes" name="notes" placeholder="Ex.: equipe extra, frente de servico ou ajuste de entrega" /></Field></div>
      </TicketPanel>

      <div className="sticky bottom-2 z-[2] grid gap-2 rounded-[18px] border border-stone-800 bg-[#242622]/95 p-3 text-white shadow-[0_18px_44px_rgba(25,27,24,.24)] backdrop-blur sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-white/65"><Icon icon={icon} name="clock" size={16} />Limite: {state.settings.cutoffTime} do dia anterior</div>
        <div className="grid grid-cols-2 gap-2">
          <button className={`${outlineButtonClass} border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/15`} type="submit" name="status" value="rascunho">Salvar rascunho</button>
          <button className={primaryButtonClass} type="submit" name="status" value="enviado">Enviar pedido <Icon icon={icon} name="arrow" size={16} /></button>
        </div>
      </div>
    </form>
  );
}
