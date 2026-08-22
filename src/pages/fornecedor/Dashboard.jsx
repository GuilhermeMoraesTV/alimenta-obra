import React from "react";
import { SupplierDailyBlockCard, supplierDailyBlockStyles } from "./DailyBlock.jsx";
import { Icon, SupplierReceiptHeader, supplierConsolidations, supplierStatusCount } from "./shared.jsx";

function localDateKey(value) {
  if (arguments.length > 0 && !value) return "";
  const date = value instanceof Date ? value : new Date(arguments.length ? value : undefined);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function Dashboard(props) {
  const { formatDate, getConsolidationSummary, icon, state, user } = props;
  const rows = supplierConsolidations(state, user);
  const todayKey = localDateKey();
  const activeRows = rows.filter((item) => item.status !== "rascunho" && !["saiu_entrega", "entregue", "cancelado_confirmado"].includes(item.status));
  const totalToday = activeRows.reduce((sum, item) => sum + getConsolidationSummary(state, item).total, 0);
  const waitingCount = supplierStatusCount(rows, "enviado");
  const readyToExitCount = supplierStatusCount(rows, "confirmado") + supplierStatusCount(rows, "producao");
  const deliveredCount = supplierStatusCount(rows, "saiu_entrega") + supplierStatusCount(rows, "entregue");

  return (
    <section className="supplier-dashboard">
      <style>{supplierDailyBlockStyles}</style>
      <SupplierReceiptHeader
        className="supplier-home-receipt"
        kicker={`Recebidos em tempo real - ${formatDate(todayKey)}`}
        title="Visao operacional"
        totalValue={waitingCount}
        totalLabel="pedidos a confirmar"
        description="Pedidos enviados pelo Admin aparecem aqui assim que chegam ao fornecedor."
        actions={<button className="btn primary" data-view="fornecedor-pedidos"><Icon icon={icon} name="clipboard" size={15} />Ver todos</button>}
        metrics={[
          { icon, iconName: "utensils", label: "Refeicoes ativas", value: totalToday },
          { icon, iconName: "clipboard", label: "A confirmar", value: waitingCount },
          { icon, iconName: "clock", label: "Prontos p/ entrega", value: readyToExitCount },
          { icon, iconName: "check", label: "Entregues", value: deliveredCount },
        ]}
      />
      {activeRows.length ? (
        <div className="supplier-daily-block-list">
          {activeRows.map((item) => <SupplierDailyBlockCard {...props} consolidation={item} key={item.id} />)}
        </div>
      ) : (
        <div className="empty">Nenhum pedido ativo no momento. Assim que o Admin enviar, ele aparece aqui em tempo real.</div>
      )}
    </section>
  );
}
