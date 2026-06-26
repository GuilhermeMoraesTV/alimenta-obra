import { INITIAL_CONSOLIDATIONS, INITIAL_REQUESTS, INITIAL_SETTINGS, MEAL_TYPES, USERS } from "../data/seed.js";

const STORAGE_KEY = "alimenta-obra-state-v1";

const clone = (value) => JSON.parse(JSON.stringify(value));

export function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  const state = {
    activeUserId: "u-joaquim",
    activeView: "pedido",
    users: clone(USERS),
    mealCatalog: clone(MEAL_TYPES),
    mealTypes: clone(MEAL_TYPES).filter((item) => item.active !== false),
    requests: clone(INITIAL_REQUESTS),
    consolidations: clone(INITIAL_CONSOLIDATIONS),
    settings: clone(INITIAL_SETTINGS),
    auditLog: [
      { id: "audit-001", action: "Sistema inicializado", userId: "u-admin", at: "2026-06-17T07:00:00-03:00", entity: "seed" }
    ],
    syncQueue: []
  };
  saveState(state);
  return state;
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return loadState();
}

export function getActiveUser(state) {
  if (!state.activeUserId) return null;
  return state.users.find((user) => user.id === state.activeUserId) ?? null;
}

export function getUserName(state, userId) {
  return state.users.find((user) => user.id === userId)?.name ?? "Usuario removido";
}

export function getLeaders(state) {
  return state.users.filter((user) => user.role === "encarregado");
}

export function addAudit(state, action, entity, payload = {}) {
  state.auditLog.unshift({
    id: crypto.randomUUID(),
    action,
    entity,
    payload,
    userId: state.activeUserId,
    at: new Date().toISOString()
  });
  state.syncQueue.unshift({
    id: crypto.randomUUID(),
    action,
    entity,
    payload,
    queuedAt: new Date().toISOString(),
    synced: navigator.onLine
  });
}

export function upsertRequest(state, request) {
  const index = state.requests.findIndex((item) => item.id === request.id);
  if (index >= 0) state.requests[index] = request;
  else state.requests.unshift(request);
}

export function canEditRequest(state, request) {
  const user = getActiveUser(state);
  if (user.role === "admin") return true;
  if (request.leaderId !== user.id) return false;
  if (["cancelado", "entregue"].includes(request.status)) return false;

  const now = new Date();
  const [hour, minute] = state.settings.cutoffTime.split(":").map(Number);
  const limit = new Date(`${request.date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);
  limit.setDate(limit.getDate() - 1);
  return now <= limit || request.date >= state.settings.defaultMealDate;
}

export function requestsForDate(state, date) {
  return state.requests.filter((request) => request.date === date && request.status !== "cancelado");
}

export function consolidateRequests(state, date) {
  const requestIds = requestsForDate(state, date)
    .filter((request) => request.status === "enviado")
    .map((request) => request.id);
  const existing = state.consolidations.find((item) => item.date === date);
  const consolidation = {
    id: existing?.id ?? `cons-${date}`,
    date,
    status: existing?.status ?? "rascunho",
    sentAt: existing?.sentAt ?? null,
    supplierId: existing?.supplierId ?? "u-fornecedor",
    requestIds,
    confirmations: existing?.confirmations ?? []
  };
  const index = state.consolidations.findIndex((item) => item.id === consolidation.id);
  if (index >= 0) state.consolidations[index] = consolidation;
  else state.consolidations.unshift(consolidation);
  return consolidation;
}

export function getConsolidationSummary(state, consolidation) {
  const rows = consolidation.requestIds
    .map((id) => state.requests.find((request) => request.id === id))
    .filter(Boolean)
    .filter((request) => request.status !== "cancelado");

  const byMeal = rows.reduce((acc, request) => {
    acc[request.mealType] ??= { total: 0, rows: [], byLocation: {} };
    acc[request.mealType].total += Number(request.quantity);
    acc[request.mealType].rows.push(request);
    acc[request.mealType].byLocation[request.location] ??= 0;
    acc[request.mealType].byLocation[request.location] += Number(request.quantity);
    return acc;
  }, {});

  return {
    rows,
    byMeal,
    total: rows.reduce((sum, request) => sum + Number(request.quantity), 0)
  };
}

export function markConsolidationStep(state, consolidationId, step) {
  const consolidation = state.consolidations.find((item) => item.id === consolidationId);
  if (!consolidation) return null;
  const at = new Date().toISOString();
  consolidation.status = step;
  if (step === "enviado") consolidation.sentAt = at;
  consolidation.confirmations = consolidation.confirmations.filter((item) => item.step !== step);
  consolidation.confirmations.push({ step, userId: state.activeUserId, at });

  if (step === "saiu_entrega") {
    consolidation.requestIds.forEach((id) => {
      const request = state.requests.find((item) => item.id === id);
      if (request) {
        request.status = "entregue";
        request.updatedAt = at;
      }
    });
  }
  return consolidation;
}
