export const shellClass = "mx-auto grid w-full max-w-5xl gap-3 sm:gap-4";
export const panelClass = "rounded-[18px] border border-stone-200/80 bg-white/90 p-3 shadow-[0_12px_30px_rgba(25,27,24,.06)] sm:p-5";
export const titleClass = "m-0 text-[26px] font-black leading-none tracking-normal text-stone-950 sm:text-[34px]";
export const kickerClass = "text-[10px] font-black uppercase tracking-[.12em] text-orange-700";
export const inputClass = "min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 outline-none shadow-sm transition focus:border-orange-600 focus:ring-4 focus:ring-orange-100";
export const primaryButtonClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-orange-600 bg-orange-600 px-4 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(239,91,29,.2)] transition hover:-translate-y-0.5 hover:bg-orange-700";
export const outlineButtonClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 text-sm font-extrabold text-stone-900 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-900";
export const iconButtonClass = "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-xs font-extrabold text-stone-800 transition hover:border-orange-300 hover:bg-orange-50";

export function Icon({ className = "", icon, name, size = 16 }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: icon(name, size) }} />;
}

export function Field({ children, id, label, optional = false }) {
  return (
    <div className="grid gap-1.5">
      <label className="text-[10px] font-black uppercase tracking-[.08em] text-stone-500" htmlFor={id}>{label} {optional ? <span className="font-bold normal-case tracking-normal text-stone-400">Opcional</span> : null}</label>
      {children}
    </div>
  );
}

export function SectionTitle({ number, title }) {
  return <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-orange-600 text-sm font-black text-white">{number}</span><h2 className="m-0 text-lg font-black text-stone-950">{title}</h2></div>;
}

export function Metric({ label, value }) {
  return <div className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm"><strong className="block text-xl font-black text-stone-950">{value}</strong><span className="text-[10px] font-black uppercase leading-tight text-stone-500">{label}</span></div>;
}

export function statusBadgeClass(status) {
  const variants = {
    cancelado: "border-red-200 bg-red-50 text-red-700",
    confirmado: "border-blue-200 bg-blue-50 text-blue-700",
    entregue: "border-emerald-200 bg-emerald-50 text-emerald-700",
    enviado: "border-orange-200 bg-orange-50 text-orange-700",
    producao: "border-amber-200 bg-amber-50 text-amber-700",
    rascunho: "border-stone-200 bg-stone-100 text-stone-600",
    saiu_entrega: "border-sky-200 bg-sky-50 text-sky-700"
  };
  return `inline-flex h-7 items-center rounded-full border px-2.5 text-[11px] font-black uppercase ${variants[status] ?? variants.rascunho}`;
}

export function leaderRequests(state, user, includeCancelled = true) {
  return state.requests
    .filter((request) => request.leaderId === user.id && (includeCancelled || request.status !== "cancelado"))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}
