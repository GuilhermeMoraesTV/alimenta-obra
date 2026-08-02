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
    supplierCompanies: [],
    supplierCompanyUsers: [],
    supplierMealTypes: [],
    workSections: [],
    sectionMealTypes: [],
    deliveryAddresses: [],
    deliveryAddressFeatureAvailable: false,
    requests: [],
    consolidations: [],
    consolidationActuals: [],
    dailyReports: [],
    consolidationDocuments: [],
    settings: {
      cutoffTime: "18:00",
      supplierName: "Fornecedor Central",
      defaultMealUnitPrice: 18.5,
      defaultMealDate: today,
      occupancyTarget: 100,
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
  return (state.users ?? []).filter((user) => user.role === "fornecedor" && user.active !== false);
}

export function getSupplierCompanies(state, { includeInactive = true } = {}) {
  const companies = state.supplierCompanies?.length
    ? state.supplierCompanies
    : getSuppliers(state).map((user) => ({
      id: user.id,
      legalName: user.name,
      tradeName: user.team || user.name,
      active: user.active !== false,
      legacyUserId: user.id
    }));
  return includeInactive ? companies : companies.filter((company) => company.active !== false);
}

export function getSupplierCompanyName(state, supplierCompanyId, fallbackUserId = "") {
  if (!supplierCompanyId && fallbackUserId) return getUserName(state, fallbackUserId);
  const company = getSupplierCompanies(state).find((item) => item.id === supplierCompanyId);
  if (!company && fallbackUserId) return getUserName(state, fallbackUserId);
  return company?.tradeName || company?.legalName || "Fornecedor";
}

export function getSupplierMealLink(state, supplierCompanyId, mealTypeId) {
  return state.supplierMealTypes?.find((item) => item.supplierCompanyId === supplierCompanyId && item.mealTypeId === mealTypeId) ?? null;
}

export function getSuppliersForMeal(state, mealTypeId, { includeInactive = false } = {}) {
  const companies = getSupplierCompanies(state, { includeInactive });
  if (!state.supplierMealTypes?.length) return [];
  return companies.filter((company) => {
    const link = getSupplierMealLink(state, company.id, mealTypeId);
    return link?.active === true;
  });
}

export function mealCategoryLabel(category) {
  return {
    marmita: "Marmita",
    buffet: "Buffet",
    janta: "Janta",
    outro: "Outro"
  }[category] ?? "Outro";
}

export function sectionLabel(state, sectionId, fallback = "Sem equipe") {
  return state.workSections?.find((section) => section.id === sectionId)?.name ?? fallback;
}

export function sectionHeadcount(state, sectionId) {
  return Number(state.workSections?.find((section) => section.id === sectionId)?.headcount ?? 0);
}

export function getActiveWorkSections(state, leaderId = "") {
  const sections = (state.workSections ?? []).filter((section) => section.active !== false);
  if (!leaderId) return sections;
  return sections.filter((section) => !section.leaderId || section.leaderId === leaderId);
}

export function getMealsForSection(state, sectionId = "") {
  const activeMeals = state.mealTypes ?? [];
  const hasSupplierMealRules = (state.supplierMealTypes ?? []).some((item) => item.active === true);
  const orderableMeals = hasSupplierMealRules
    ? activeMeals.filter((meal) => getSuppliersForMeal(state, meal.id, { includeInactive: false }).length > 0)
    : activeMeals;
  if (!sectionId) return orderableMeals;
  const allowedIds = (state.sectionMealTypes ?? [])
    .filter((item) => item.sectionId === sectionId && item.active !== false)
    .map((item) => item.mealTypeId);
  if (!allowedIds.length) return orderableMeals;
  return orderableMeals.filter((meal) => allowedIds.includes(meal.id));
}

export function requestOriginLabel(request) {
  return request.originRole === "admin" && !request.leaderId ? "Admin" : "Encarregado";
}

export function requestResponsibleName(state, request) {
  if (request.originRole === "admin" && !request.leaderId) return getUserName(state, request.createdBy) || "Admin";
  return getUserName(state, request.leaderId) || getUserName(state, request.createdBy) || "Sem responsavel";
}

export function canEditRequest(state, request) {
  const user = getActiveUser(state);
  if (!user) return false;
  const consolidation = state.consolidations?.find((item) =>
    item.status !== "rascunho"
    && item.requestIds?.includes(request.id)
  );
  const supplierConfirmed = consolidation?.confirmations?.some((confirmation) => confirmation.step === "confirmado");
  if (supplierConfirmed) return false;
  if (consolidation && !["enviado", "rascunho"].includes(consolidation.status)) return false;
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
  const existing = state.consolidations
    .filter((item) => item.date === date && ["rascunho", "enviado"].includes(item.status))
    .sort((a, b) => new Date(b.createdAt ?? b.sentAt ?? 0) - new Date(a.createdAt ?? a.sentAt ?? 0))[0];
  const currentRequestIds = new Set(existing?.requestIds ?? []);
  const linkedToOtherBlocks = new Set(
    (state.consolidations ?? [])
      .filter((item) => item.date === date && item.id !== existing?.id)
      .flatMap((item) => item.requestIds ?? [])
  );
  const requestIds = requestsForDate(state, date)
    .filter((request) => request.status === "enviado")
    .filter((request) => currentRequestIds.has(request.id) || !linkedToOtherBlocks.has(request.id))
    .map((request) => request.id);
  if (existing) return {
    ...existing,
    requestIds: Array.from(new Set([...(existing.requestIds ?? []), ...requestIds]))
  };
  return {
    id: "",
    date,
    status: "rascunho",
    sentAt: null,
    supplierId: getSuppliers(state)[0]?.id ?? null,
    supplierCompanyId: state.requests.find((request) => request.date === date && request.supplierCompanyId)?.supplierCompanyId
      ?? getSupplierCompanies(state, { includeInactive: false })[0]?.id
      ?? null,
    requestIds,
    confirmations: []
  };
}

export function getConsolidationSummary(state, consolidation) {
  const rows = consolidation.requestIds
    .map((id) => state.requests.find((request) => request.id === id))
    .filter(Boolean)
    .filter((request) => request.status !== "cancelado");

  const byMeal = rows.reduce((acc, request) => {
    acc[request.mealType] ??= { total: 0, actual: 0, headcount: 0, rows: [], byLocation: {}, bySection: {} };
    acc[request.mealType].total += Number(request.quantity);
    acc[request.mealType].rows.push(request);
    const sectionName = request.sectionName || request.location;
    const actual = getActualQuantity(state, consolidation.id, request);
    const headcount = sectionHeadcount(state, request.teamId);
    acc[request.mealType].actual += actual;
    acc[request.mealType].headcount += headcount;
    acc[request.mealType].byLocation[sectionName] ??= 0;
    acc[request.mealType].byLocation[sectionName] += Number(request.quantity);
    acc[request.mealType].bySection[sectionName] ??= { requested: 0, actual: 0, headcount: 0, rows: [] };
    acc[request.mealType].bySection[sectionName].requested += Number(request.quantity);
    acc[request.mealType].bySection[sectionName].actual += actual;
    acc[request.mealType].bySection[sectionName].headcount += headcount;
    acc[request.mealType].bySection[sectionName].rows.push(request);
    return acc;
  }, {});

  const bySection = rows.reduce((acc, request) => {
    const sectionName = request.sectionName || request.location;
    const actual = getActualQuantity(state, consolidation.id, request);
    acc[sectionName] ??= { requested: 0, actual: 0, headcount: 0, rows: [] };
    acc[sectionName].requested += Number(request.quantity);
    acc[sectionName].actual += actual;
    acc[sectionName].headcount += sectionHeadcount(state, request.teamId);
    acc[sectionName].rows.push(request);
    return acc;
  }, {});

  const actualTotal = rows.reduce((sum, request) => sum + getActualQuantity(state, consolidation.id, request), 0);
  const headcountTotal = rows.reduce((sum, request) => sum + sectionHeadcount(state, request.teamId), 0);

  return {
    rows,
    byMeal,
    bySection,
    total: rows.reduce((sum, request) => sum + Number(request.quantity), 0),
    actualTotal,
    headcountTotal
  };
}

export function getActualQuantity(state, consolidationId, request) {
  const actual = state.consolidationActuals?.find((item) => {
    const sameConsolidation = !consolidationId || !item.consolidationId || item.consolidationId === consolidationId;
    return sameConsolidation && item.teamId === request.teamId && item.mealTypeId === request.mealTypeId;
  });
  return Number(actual?.quantity ?? request.actualQuantity ?? request.quantity ?? 0);
}

export function requestUnitPrice(state, request) {
  const supplierId = request.supplierCompanyId;
  const link = supplierId ? getSupplierMealLink(state, supplierId, request.mealTypeId) : null;
  return Number(link?.unitPrice ?? request.unitPrice ?? state.mealCatalog?.find((meal) => meal.id === request.mealTypeId)?.unitPrice ?? state.settings?.defaultMealUnitPrice ?? 0);
}
