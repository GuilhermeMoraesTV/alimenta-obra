export function totalsByMeal(rows) {
  return rows.reduce((acc, request) => {
    acc[request.mealType] ??= 0;
    acc[request.mealType] += Number(request.quantity);
    return acc;
  }, {});
}

export function sumQty(rows) {
  return rows.reduce((sum, request) => sum + Number(request.quantity), 0);
}

export function countStatus(rows, status) {
  return rows.filter((request) => request.status === status).length;
}

export function nextSupplierStep(status) {
  if (status === "enviado") return { step: "confirmado", label: "Confirmar recebimento" };
  if (status === "confirmado") return { step: "producao", label: "Confirmar producao" };
  if (status === "producao") return { step: "saiu_entrega", label: "Confirmar saida" };
  if (status === "saiu_entrega") return { step: "entregue", label: "Confirmar entrega" };
  return null;
}

export function roleName(role) {
  return {
    admin: "Administrador",
    encarregado: "Encarregado",
    fornecedor: "Fornecedor"
  }[role] ?? role;
}

export function initials(name) {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
