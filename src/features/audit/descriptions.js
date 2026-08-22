export const auditEntityLabel = (entity) => ({
  pedido: "Pedido de refeicao",
  meal_request: "Pedido de refeicao",
  tipo_alimentacao: "Tipo de alimentacao",
  tipo_refeicao: "Tipo de alimentacao",
  meal_type: "Tipo de alimentacao",
  categoria_refeicao: "Categoria de refeicao",
  consolidacao: "Pedido ao fornecedor",
  consolidation: "Pedido ao fornecedor",
  fornecedor: "Fornecedor",
  supplier: "Fornecedor",
  efetivo: "Efetivo",
  usuario: "Usuario",
  user: "Usuario",
  seed: "Carga inicial"
}[entity] ?? String(entity ?? "Registro").replaceAll("_", " "));

export function shouldShowAuditItem(item) {
  const action = String(item?.action ?? "").toLowerCase();
  const entity = String(item?.entity ?? "").toLowerCase();
  return !entity.includes("daily_report")
    && !entity.includes("relatorio_diario")
    && !action.includes("daily report")
    && !action.includes("relatorio diario automatico");
}

export function auditStatusLabel(status) {
  return ({
    enviado: "enviado",
    confirmado: "recebimento confirmado",
    producao: "em producao",
    saiu_entrega: "entregue",
    entregue: "entregue",
    cancelamento_pendente: "com cancelamento pendente",
    cancelado_confirmado: "cancelado com ciencia do fornecedor",
    cancelado: "cancelado"
  })[status] ?? status ?? "atualizado";
}

export function actorDisplayName(state, userId) {
  const user = state.users?.find((item) => item.id === userId);
  if (!user) return "Usuario removido";
  if (user.role === "admin") return "Administrador";
  return user.name || user.email || "Usuario";
}

export function resolveAuditRequest(state, item) {
  const direct = state.requests?.find((request) => request.id === item.entityId);
  if (direct) return direct;
  const payload = item.payload ?? {};
  const payloadRequest = state.requests?.find((request) => request.id === payload.request_id || request.id === payload.meal_request_id);
  if (payloadRequest) return payloadRequest;
  const consolidation = state.consolidations?.find((entry) => entry.id === item.entityId || entry.id === payload.consolidation_id);
  const requestId = consolidation?.requestIds?.[0];
  return state.requests?.find((request) => request.id === requestId) ?? null;
}

export function auditRequestFacts(state, request) {
  if (!request) return "";
  const parts = [
    request.mealType,
    request.sectionName || request.location,
    request.date,
    request.quantity ? `${request.quantity} refeicoes` : ""
  ].filter(Boolean);
  return parts.join(" - ");
}

function resolveAuditConsolidation(state, item) {
  const payload = item?.payload ?? {};
  return state.consolidations?.find((entry) => entry.id === item.entityId || entry.id === payload.consolidation_id) ?? null;
}

export function auditActualConsumptionFacts(state, item) {
  const action = String(item?.action ?? "").toLowerCase();
  if (!action.includes("consumo real")) return "";
  const consolidation = resolveAuditConsolidation(state, item);
  if (!consolidation) return "";
  const requests = (state.requests ?? []).filter((request) => consolidation.requestIds?.includes(request.id));
  const actualRows = (state.consolidationActuals ?? []).filter((row) => row.consolidationId === consolidation.id);
  if (!actualRows.length) return auditRequestFacts(state, requests[0]);
  return actualRows.map((actual) => {
    const matchingRequests = requests.filter((request) => request.teamId === actual.teamId && request.mealTypeId === actual.mealTypeId);
    const requested = matchingRequests.reduce((sum, request) => sum + Number(request.quantity ?? 0), 0);
    const sample = matchingRequests[0];
    const section = sample?.sectionName || sample?.location || state.workSections?.find((item) => item.id === actual.teamId)?.name || "Equipe";
    const meal = sample?.mealType || state.mealCatalog?.find((item) => item.id === actual.mealTypeId)?.label || "Refeicao";
    return `${meal} - ${section}: solicitado ${requested}, consumido ${Number(actual.quantity ?? 0)}`;
  }).join(" | ");
}

export function auditItemFacts(state, item) {
  return auditActualConsumptionFacts(state, item) || auditRequestFacts(state, resolveAuditRequest(state, item));
}

function areaNameFromPayload(payload = {}) {
  return payload.label || payload.name || payload.id || "";
}

function supplierNameFromPayload(state, payload = {}) {
  const supplier = state.supplierCompanies?.find((item) => item.id === payload.supplier_company_id);
  return supplier?.tradeName || supplier?.legalName || "";
}

export function auditSentenceParts(state, item) {
  const actor = actorDisplayName(state, item.userId);
  const action = String(item.action ?? "");
  const lower = action.toLowerCase();
  const payload = item.payload ?? {};
  const request = resolveAuditRequest(state, item);
  const supplier = supplierNameFromPayload(state, payload);
  const target = request ? { type: "request", label: "PEDIDO", requestId: request.id } : null;
  const pedidoTarget = target ?? { type: "entity", label: "PEDIDO" };

  if ((lower.includes("pedido") && lower.includes("criado")) || lower.includes("solicita")) {
    return { before: `${actor} fez um `, target: pedidoTarget, after: " de refeicao." };
  }
  if (action === "Fornecedor alterou status do pedido" || lower.includes("fornecedor registrou etapa")) {
    const status = auditStatusLabel(payload.status || payload.step);
    const supplierActor = supplier || actor;
    return { before: `${supplierActor} marcou o `, target: pedidoTarget, after: ` como ${status}.` };
  }
  if (lower.includes("consumo real")) {
    return { before: `${actor} registrou consumo real no `, target: pedidoTarget, after: payload.rows ? ` com ${payload.rows} lancamento(s).` : "." };
  }
  if (lower.includes("cancelamento")) {
    const reason = payload.reason ? ` Motivo: ${payload.reason}.` : "";
    return { before: `${actor} registrou cancelamento do `, target: pedidoTarget, after: `.${reason}` };
  }
  if (lower.includes("enviado") || lower.includes("consolidado")) {
    return { before: `${actor} enviou o `, target: pedidoTarget, after: supplier ? ` para ${supplier}.` : " ao fornecedor." };
  }
  if (lower.includes("atualiz") || lower.includes("alterou") || lower.includes("edit")) {
    return { before: `${actor} alterou o `, target: target ?? { type: "entity", label: auditEntityLabel(item.entity) }, after: "." };
  }
  if (lower.includes("exclu") || lower.includes("remov")) {
    return { before: `${actor} removeu ${auditEntityLabel(item.entity)}`, target: null, after: areaNameFromPayload(payload) ? ` ${areaNameFromPayload(payload)}.` : "." };
  }
  if (lower.includes("salv") || lower.includes("criad")) {
    return { before: `${actor} salvou ${auditEntityLabel(item.entity)}`, target: null, after: areaNameFromPayload(payload) ? ` ${areaNameFromPayload(payload)}.` : "." };
  }
  return { before: `${actor} registrou `, target: target ?? { type: "entity", label: auditEntityLabel(item.entity) }, after: "." };
}

export function auditDescription(state, item) {
  const parts = auditSentenceParts(state, item);
  const target = parts.target?.label ?? "";
  return `${parts.before}${target}${parts.after}`.replace(/\s+/g, " ").trim();
}
