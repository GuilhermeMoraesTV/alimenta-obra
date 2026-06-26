const UI_STORAGE_KEY = "alimenta-obra-ui-v2";

export function createEmptyState() {
  const today = new Date().toISOString().slice(0, 10);
  return {
    authenticatedUserId: null,
    activeUserId: null,
    activeView: "inicio",
    users: [],
    mealCatalog: [],
    mealTypes: [],
    deliveryAddresses: [],
    deliveryAddressFeatureAvailable: false,
    requests: [],
    consolidations: [],
    consolidationDocuments: [],
    settings: {
      cutoffTime: "18:00",
      supplierName: "Fornecedor Central",
      defaultMealUnitPrice: 18.5,
      defaultMealDate: today,
      notificationChannel: "E-mail e push",
      offlineSyncEnabled: false
    },
    auditLog: [],
    syncQueue: [],
    loading: true
  };
}

export function loadUiState() {
  try {
    return JSON.parse(localStorage.getItem(UI_STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function saveUiState(state) {
  localStorage.setItem(UI_STORAGE_KEY, JSON.stringify({ activeView: state.activeView }));
}

export function getActiveUser(state) {
  return state.users.find((user) => user.id === state.activeUserId) ?? null;
}

export function getUserName(state, userId) {
  return state.users.find((user) => user.id === userId)?.name ?? "Usuario removido";
}

export function getLeaders(state) {
  return state.users.filter((user) => user.role === "encarregado");
}

export function getSuppliers(state) {
  return state.users.filter((user) => user.role === "fornecedor" && user.active !== false);
}

export function canEditRequest(state, request) {
  const user = getActiveUser(state);
  if (!user) return false;
  if (user.role === "admin") return !["cancelado", "entregue"].includes(request.status);
  if (request.leaderId !== user.id) return false;
  if (["cancelado", "entregue"].includes(request.status)) return false;

  const [hour, minute] = state.settings.cutoffTime.split(":").map(Number);
  const limit = new Date(`${request.date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);
  limit.setDate(limit.getDate() - 1);
  return new Date() <= limit;
}

export function requestsForDate(state, date) {
  return state.requests.filter((request) => request.date === date && request.status !== "cancelado");
}

export function getConsolidationForDate(state, date) {
  const existing = state.consolidations.find((item) => item.date === date);
  if (existing) return existing;
  return {
    id: "",
    date,
    status: "rascunho",
    sentAt: null,
    supplierId: getSuppliers(state)[0]?.id ?? null,
    requestIds: requestsForDate(state, date)
      .filter((request) => request.status === "enviado")
      .map((request) => request.id),
    confirmations: []
  };
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
