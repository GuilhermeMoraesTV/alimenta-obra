import { exportAuditExcel, exportAuditPdf, exportDailyReportExcel, exportDailyReportPdf, exportExcel, exportFinancialPdf, exportKpiPdf, exportMeasurementExcel, exportMeasurementPdf, exportOrdersExcel, exportOrdersPdf, exportPdf, exportSupplierRomaneio, exportWord } from "./services/exports.js";
import { renderAppShell } from "./components/app-shell.js";
import { renderLoginScreen } from "./components/auth.js";
import { icon } from "./components/icons.js";
import { createSharedUi } from "./components/shared-ui.js";
import { NAV_BY_ROLE, STATUS_LABEL, viewLabel } from "./core/navigation.js";
import { createMealDomain } from "./features/meals/domain.js";
import { countStatus, initials, nextSupplierStep, roleName, sumQty, totalsByMeal } from "./features/operations/metrics.js";
import { createPageRegistry } from "./pages/index.js";
import {
  canEditRequest,
  createEmptyState,
  getActiveWorkSections,
  getActiveUser,
  getConsolidationForDate,
  getConsolidationSummary,
  getLeaders,
  getSuppliers,
  getUserName,
  loadUiState,
  requestsForDate,
  saveUiState
} from "./services/store-v2.js";
import {
  changeRequestStatus,
  confirmSupplierStep,
  createAccessInvite,
  createDeliveryAddress,
  createMealRequest,
  fetchApplicationData,
  fetchProfile,
  generateDailyReport,
  getAuthenticatedUser,
  getSupplierDocumentUrl,
  getSession,
  logSupplierRomaneio,
  removeSubscription,
  saveConsolidationActuals,
  saveMealTypeCatalog,
  saveWorkSection,
  sendDailyConsolidation,
  signIn,
  signOut,
  signUp,
  subscribeToChanges,
  updateCurrentProfile,
  updateDefaultMealUnitPrice,
  updateMealRequest,
  updateUserPassword,
  uploadSupplierInvoice,
  validateAlimentaObraSchema
} from "./services/database.js";
import { isSupabaseConfigured, supabase } from "./services/supabase.js";
import { escapeHtml, formatDate, formatDateTime, money } from "./utils/formatters.js";

const uiState = loadUiState();
let state = { ...createEmptyState(), activeView: uiState.activeView ?? "inicio" };
let realtimeChannel = null;
let isRefreshing = false;
let leaderOrdersTab = "novo";
let leaderAddressFormOpen = false;
let editingRequestId = null;
let adminRequestDetailId = null;
let exportMenuOpen = null;
let generatedInviteLink = "";
let pendingCancelRequestId = null;
let operationNotice = null;
let requestFormError = "";
let adminConsumptionWeekOffset = 0;
let adminRequestDateFilter = "";
let reportFilter = {
  range: "all",
  start: "",
  end: ""
};
let dailyReportGenerationDate = "";
let renderCycle = 0;
const pageMountModules = new Map();

function localDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function previousLocalDateKey(dateKey = localDateKey()) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function minimumMealDate() {
  return state.settings.defaultMealDate || localDateKey();
}

function assertMealDateIsNotPast(date) {
  if (!date || String(date) < minimumMealDate()) {
    throw new Error("Não é permitido criar ou alterar pedido para data passada.");
  }
}

const root = document.querySelector("#app-root");
const toastRoot = document.querySelector("#toast-root");
const initialInviteToken = new URLSearchParams(window.location.search).get("invite") ?? "";
const appLogoAsset = `${import.meta.env.BASE_URL}assets/logo-alimentaobra.png`;
const modalBackdropClass = "fixed inset-0 z-50 grid place-items-end bg-stone-950/50 p-0 backdrop-blur-sm sm:place-items-center sm:p-4";
const modalPanelClass = "max-h-[92vh] w-full max-w-2xl overflow-auto rounded-t-3xl border border-white/70 bg-white p-4 shadow-2xl sm:rounded-3xl sm:p-5 [&_header]:mb-4 [&_header]:flex [&_header]:items-start [&_header]:justify-between [&_header]:gap-3 [&_header]:border-b [&_header]:border-stone-100 [&_header]:pb-3 [&_.eyebrow]:text-[10px] [&_.eyebrow]:font-black [&_.eyebrow]:uppercase [&_.eyebrow]:tracking-[.12em] [&_.eyebrow]:text-orange-700 [&_h2]:m-0 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:leading-none [&_p]:m-0 [&_p]:text-sm [&_p]:text-stone-500 [&_.modal-close]:grid [&_.modal-close]:h-9 [&_.modal-close]:w-9 [&_.modal-close]:place-items-center [&_.modal-close]:rounded-full [&_.modal-close]:border [&_.modal-close]:border-stone-200 [&_.modal-close]:bg-white [&_.modal-close]:text-xl [&_.modal-close]:font-black [&_.modal-close]:text-stone-500 [&_.admin-request-detail-card]:grid [&_.admin-request-detail-card]:gap-3 [&_.admin-request-detail-hero]:grid [&_.admin-request-detail-hero]:grid-cols-[48px_minmax(0,1fr)] [&_.admin-request-detail-hero]:gap-3 [&_.admin-request-detail-hero]:rounded-2xl [&_.admin-request-detail-hero]:border [&_.admin-request-detail-hero]:border-stone-200 [&_.admin-request-detail-hero]:bg-stone-50 [&_.admin-request-detail-hero]:p-3 [&_.request-meal-icon]:grid [&_.request-meal-icon]:h-12 [&_.request-meal-icon]:w-12 [&_.request-meal-icon]:place-items-center [&_.request-meal-icon]:rounded-xl [&_.request-meal-icon]:bg-orange-50 [&_.request-meal-icon]:text-orange-700 [&_.badge]:inline-flex [&_.badge]:min-h-7 [&_.badge]:items-center [&_.badge]:rounded-full [&_.badge]:border [&_.badge]:border-stone-200 [&_.badge]:bg-white [&_.badge]:px-2.5 [&_.badge]:text-[11px] [&_.badge]:font-black [&_.badge]:uppercase [&_.badge]:text-stone-600 [&_.admin-request-detail-grid]:grid [&_.admin-request-detail-grid]:gap-2 sm:[&_.admin-request-detail-grid]:grid-cols-2 [&_.admin-request-detail-grid>div]:rounded-xl [&_.admin-request-detail-grid>div]:border [&_.admin-request-detail-grid>div]:border-stone-200 [&_.admin-request-detail-grid>div]:bg-white [&_.admin-request-detail-grid>div]:p-3 [&_.admin-request-detail-grid_span]:text-[10px] [&_.admin-request-detail-grid_span]:font-black [&_.admin-request-detail-grid_span]:uppercase [&_.admin-request-detail-grid_span]:text-stone-500 [&_.admin-request-detail-grid_strong]:block [&_.admin-request-notes]:rounded-xl [&_.admin-request-notes]:border [&_.admin-request-notes]:border-stone-200 [&_.admin-request-notes]:bg-white [&_.admin-request-notes]:p-3 [&_.admin-request-notes_span]:text-[10px] [&_.admin-request-notes_span]:font-black [&_.admin-request-notes_span]:uppercase [&_.admin-request-notes_span]:text-stone-500 [&_footer]:mt-4 [&_footer]:flex [&_footer]:justify-end [&_footer]:gap-2 [&_footer]:border-t [&_footer]:border-stone-100 [&_footer]:pt-3 [&_.btn]:inline-flex [&_.btn]:min-h-10 [&_.btn]:items-center [&_.btn]:justify-center [&_.btn]:gap-2 [&_.btn]:rounded-lg [&_.btn]:border [&_.btn]:px-4 [&_.btn]:text-sm [&_.btn]:font-extrabold [&_.btn.primary]:border-orange-600 [&_.btn.primary]:bg-orange-600 [&_.btn.primary]:text-white [&_.btn.outline]:border-stone-300 [&_.btn.outline]:bg-white [&_.btn.outline]:text-stone-900";
const modalHeaderClass = "mb-4 flex items-start justify-between gap-3 border-b border-stone-100 pb-3";
const modalTitleClass = "m-0 text-2xl font-black leading-none tracking-normal text-stone-950";
const modalKickerClass = "text-[10px] font-black uppercase tracking-[.12em] text-orange-700";
const modalCloseClass = "grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-white text-xl font-black text-stone-500";
const modalFieldClass = "grid gap-1.5";
const modalLabelClass = "text-[10px] font-black uppercase tracking-[.08em] text-stone-500";
const modalInputClass = "min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-100";
const modalButtonPrimaryClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-orange-600 bg-orange-600 px-4 text-sm font-extrabold text-white";
const modalButtonOutlineClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 text-sm font-extrabold text-stone-900";
const modalButtonDangerClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-extrabold text-red-700";

let loginMode = initialInviteToken ? "register" : "login";
let loginError = "";
let supplierOrderStatus = "todos";
let supplierOrderDate = "";
let selectedSupplierConsolidationId = null;
let pendingActualsConsolidationId = null;

const {
  consolidationValue,
  mealById,
  pendingSyncText,
  requestMealDescription,
  requestUnitPrice,
  requestValue
} = createMealDomain({
  getState: () => state,
  getConsolidationSummary
});

const {
  renderCompactHeader,
  renderEmptyState,
  renderExportMenu,
  topbar
} = createSharedUi({
  getActiveView: () => state.activeView,
  getExportMenuOpen: () => exportMenuOpen,
  viewLabel
});

function persist(message) {
  saveUiState(state);
  render();
  if (message) toast(message);
}

function toast(message) {
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  toastRoot.appendChild(item);
  setTimeout(() => item.remove(), 3400);
}

function activeDate() {
  const currentValue = document.querySelector("[data-filter-date]")?.value;
  if (state.activeView === "pedidos") return currentValue ?? adminRequestDateFilter;
  return currentValue || state.settings.defaultMealDate;
}

function setView(view) {
  adminRequestDetailId = null;
  exportMenuOpen = null;
  if (view !== "pedido") requestFormError = "";
  state.activeView = view;
  if (view !== "painel") adminConsumptionWeekOffset = 0;
  persist();
}

function render() {
  const currentRenderCycle = ++renderCycle;
  const adminFilters = {
    date: state.activeView === "pedidos" ? adminRequestDateFilter : activeDate(),
    leader: document.querySelector("[data-filter-leader]")?.value ?? "",
    meal: document.querySelector("[data-filter-meal]")?.value ?? ""
  };
  unmountLoadedReactPages(root);
  if (state.loading) {
    root.innerHTML = `<section class="grid min-h-screen place-content-center justify-items-center gap-4 bg-[#1b1c1a] p-6 text-white" aria-live="polite"><img class="h-24 w-auto max-w-[360px] object-contain brightness-110" src="${appLogoAsset}" alt="AlimentaObra" /><div class="h-1 w-40 overflow-hidden rounded-full bg-white/15" aria-hidden="true"><i class="block h-full w-1/2 animate-pulse rounded-full bg-orange-600"></i></div><p class="m-0 text-xs font-black uppercase tracking-[.08em] text-white/60">Preparando sua operação</p></section>`;
    return;
  }
  const user = getActiveUser(state);
  if (!user) {
    renderLogin();
    return;
  }
  const roleExtraViews = user.role === "fornecedor" ? ["fornecedor-documentos", "fornecedor-financeiro"] : user.role === "admin" ? ["financeiro", "relatorios", "auditoria"] : [];
  const allowedViews = [...NAV_BY_ROLE[user.role].map(([view]) => view), ...roleExtraViews, "configuracoes"];
  if (user.role === "admin" && state.activeView === "consolidacao") state.activeView = "pedidos";
  if (user.role === "fornecedor" && state.activeView === "fornecedor-historico") state.activeView = "fornecedor-pedidos";
  if (!allowedViews.includes(state.activeView)) {
    state.activeView = allowedViews[0];
    saveUiState(state);
  }
  root.innerHTML = renderAppShell({
    accessSwitcher: renderAccessSwitcher(user),
    activeView: state.activeView,
    adminRequestDetailModal: renderAdminRequestDetailModal(),
    content: renderView(user),
    editRequestModal: renderEditRequestModal(),
    initials,
    operationModal: renderOperationModal(),
    renderNav,
    roleName,
    user,
    workspaceIntro: renderWorkspaceIntro(user)
  });
  const leaderProps = {
    STATUS_LABEL,
    canEditRequest,
    countStatus,
    formatDate,
    formatDateTime,
    getLeaderAddressFormOpen: () => leaderAddressFormOpen,
    icon,
    page: state.activeView,
    requestError: state.activeView === "pedido" ? requestFormError : "",
    requestMealDescription,
    state,
    sumQty,
    user
  };
  const adminProps = {
    STATUS_LABEL,
    adminConsumptionWeekOffset,
    adminFilters,
    canEditRequest,
    consolidationValue,
    countStatus,
    exportMenuOpen,
    formatDate,
    formatDateTime,
    getConsolidationForDate,
    getConsolidationSummary,
    icon,
    money,
    page: state.activeView,
    requestMealDescription,
    requestValue,
    reportFilter,
    reportPeriodLabel: getReportPeriodLabel(),
    reportRows: getReportRows(),
    state,
    sumQty,
    totalsByMeal,
    user
  };
  const supplierProps = {
    STATUS_LABEL,
    consolidationValue,
    formatDate,
    formatDateTime,
    getConsolidationSummary,
    icon,
    money,
    nextSupplierStep,
    page: state.activeView,
    requestMealDescription,
    requestValue,
    selectedSupplierConsolidationId,
    state,
    sumQty,
    supplierOrderDate,
    supplierOrderStatus,
    user
  };
  mountActiveReactPage(user.role, { adminProps, leaderProps, supplierProps }, currentRenderCycle);
}

function unmountLoadedReactPages(container) {
  pageMountModules.get("admin")?.unmountAdminReactPage(container);
  pageMountModules.get("encarregado")?.unmountLeaderReactPage(container);
  pageMountModules.get("fornecedor")?.unmountSupplierReactPage(container);
}

async function loadPageMountModule(role) {
  if (pageMountModules.has(role)) return pageMountModules.get(role);
  const loader = {
    admin: () => import("./pages/admin/mount.jsx"),
    encarregado: () => import("./pages/encarregado/mount.jsx"),
    fornecedor: () => import("./pages/fornecedor/mount.jsx")
  }[role];
  const module = loader ? await loader() : null;
  if (module) pageMountModules.set(role, module);
  return module;
}

async function mountActiveReactPage(role, props, cycle) {
  const module = await loadPageMountModule(role);
  if (!module || cycle !== renderCycle) return;
  if (role === "admin") module.mountAdminReactPage(root, props.adminProps);
  if (role === "encarregado") module.mountLeaderReactPage(root, props.leaderProps);
  if (role === "fornecedor") module.mountSupplierReactPage(root, props.supplierProps);
  bindEvents();
}

function renderLogin() {
  root.innerHTML = renderLoginScreen({ initialInviteToken, isSupabaseConfigured, loginMode, loginError });
  bindEvents();
}

function renderNav(user) {
  const adminMoreViews = ["financeiro", "relatorios", "auditoria", "configuracoes"];
  const supplierMoreViews = ["fornecedor-mais", "fornecedor-documentos", "fornecedor-financeiro", "configuracoes"];
  return NAV_BY_ROLE[user.role].map(([view, iconName, label]) => {
    const active = state.activeView === view || (view === "mais" && adminMoreViews.includes(state.activeView)) || (view === "fornecedor-mais" && supplierMoreViews.includes(state.activeView));
    const responsiveClass = user.role === "admin" && view === "mais"
      ? "md:hidden"
      : user.role === "admin" && adminMoreViews.includes(view)
        ? "hidden md:flex"
        : user.role === "fornecedor" && view === "fornecedor-mais"
          ? "md:hidden"
          : user.role === "fornecedor" && ["fornecedor-documentos", "fornecedor-financeiro"].includes(view)
            ? "hidden md:flex"
            : "";
    return `
    <button class="group relative grid min-w-0 flex-1 place-items-center gap-0.5 rounded-[16px] border border-white/10 !bg-[#242622] px-1 py-1 text-center text-[8px] font-black leading-tight text-white/65 transition hover:!bg-[#2f312d] hover:text-white md:flex md:min-h-11 md:w-full md:flex-none md:justify-start md:gap-3 md:rounded-r-2xl md:rounded-l-md md:px-2.5 md:text-left md:text-sm ${responsiveClass} ${active ? "active !border-orange-500 !bg-orange-600 !text-white shadow-[0_10px_18px_rgba(239,91,29,.25)] md:shadow-[inset_4px_0_0_rgba(249,115,22,.95)]" : ""}" data-view="${view}">
      <span class="grid h-7 w-7 place-items-center rounded-[12px] bg-white/10 text-white/75 transition group-hover:bg-orange-500/15 group-hover:text-orange-100 md:h-8 md:w-8 md:rounded-r-xl md:rounded-l-md ${active ? "!bg-white/18 !text-white" : ""}">${icon(iconName, 17)}</span>
      <span class="max-w-full truncate">${label}</span>
    </button>`;
  }).join("");
}

function renderAdminBackButton() {
  const user = getActiveUser(state);
  if (user?.role !== "admin") return "";
  return `<button class="admin-back-button" data-view="mais" aria-label="Voltar para mais ferramentas">${icon("arrow-left", 15)}<span>Voltar</span></button>`;
}

function renderSupplierBackButton() {
  const user = getActiveUser(state);
  if (user?.role !== "fornecedor") return "";
  return `<button class="admin-back-button supplier-back-button" data-view="fornecedor-mais" aria-label="Voltar para mais">${icon("arrow-left", 15)}<span>Voltar</span></button>`;
}

function renderAccessSwitcher(user) {
  const authenticatedUser = state.users.find((item) => item.id === state.authenticatedUserId);
  if (authenticatedUser?.role !== "admin") return "";

  const isRepresentingUser = user.id !== authenticatedUser.id;
  const options = state.users
    .filter((item) => item.active !== false)
    .sort((a, b) => {
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (a.role !== "admin" && b.role === "admin") return 1;
      return a.name.localeCompare(b.name, "pt-BR");
    })
    .map((item) => `
      <option value="${item.id}" ${item.id === user.id ? "selected" : ""}>
        ${item.name} - ${roleName(item.role)}
      </option>`)
    .join("");

  return `
    <section class="mb-3 grid gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto] ${isRepresentingUser ? "is-representing" : ""}">
      <div>
        <span class="text-[10px] font-black uppercase tracking-[.12em] text-orange-700">${isRepresentingUser ? "Modo de acesso ativo" : "Acesso administrativo"}</span>
        <strong class="block text-base font-black">${isRepresentingUser ? `Voce esta acessando como ${user.name}` : "Escolha qual usuario deseja acessar"}</strong>
        <small class="text-xs font-semibold text-stone-500">A identidade autenticada continua sendo ${authenticatedUser.name}; todas as ações permanecem rastreáveis.</small>
      </div>
      <div class="grid gap-2 sm:grid-cols-[minmax(180px,1fr)_auto] sm:items-end">
        <label class="grid gap-1 text-[10px] font-black uppercase tracking-[.08em] text-stone-500" for="access-user">Usuário<select class="min-h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-stone-950" id="access-user" data-access-user>${options}</select></label>
        ${isRepresentingUser ? `<button class="inline-flex min-h-10 items-center justify-center rounded-lg border border-stone-300 bg-white px-3 text-xs font-extrabold text-stone-900" type="button" data-action="return-admin">Voltar ao administrador</button>` : ""}
      </div>
    </section>`;
}

const pageRegistry = createPageRegistry({
  leader: {
    canEditRequest,
    countStatus,
    escapeHtml,
    formatDate,
    formatDateTime,
    getLeaderAddressFormOpen: () => leaderAddressFormOpen,
    getState: () => state,
    icon,
    locationOptions,
    renderEmptyState,
    renderRequestTable,
    requestMealDescription,
    STATUS_LABEL,
    sumQty,
    topbar
  },
  settings: {
    escapeHtml,
    getGeneratedInviteLink: () => generatedInviteLink,
    getState: () => state,
    icon,
    money,
    renderAdminBackButton,
    renderEmptyState,
    roleName
  },
  renderAdminMore,
  renderAuditoria,
  renderConsolidacao,
  renderFinanceiro,
  renderFornecedor,
  renderPainel,
  renderPedidosAdmin,
  renderRelatorios,
  renderSupplierDocuments,
  renderSupplierHistory,
  renderSupplierOrders
});

function renderView(user) {
  return (pageRegistry[state.activeView] ?? pageRegistry.pedido)(user);
}

function renderWorkspaceIntro(user) {
  // As telas começam pelo conteúdo operativo, sem banner de apresentação.
  return "";
}

function renderEditRequestModal() {
  const request = state.requests.find((item) => item.id === editingRequestId);
  if (!request) return "";
  const sections = getActiveWorkSections(state, request.leaderId);
  const meal = state.mealTypes.find((item) => item.id === request.mealTypeId) ?? state.mealTypes[0];
  const fallbackLocationId = request.locationId || meal?.locations?.[0]?.id || "";
  const teamOptions = sections.length
    ? sections.map((section) => `<option value="${section.id}" ${section.id === request.teamId ? "selected" : ""}>${escapeHtml(section.name)} - efetivo ${Number(section.headcount ?? 0)}</option>`).join("")
    : `<option value="">Nenhuma equipe ativa</option>`;
  return `<div class="${modalBackdropClass}" data-close-edit-modal><section class="${modalPanelClass}" role="dialog" aria-modal="true" aria-labelledby="edit-request-title" onclick="event.stopPropagation()"><header class="${modalHeaderClass}"><div><span class="${modalKickerClass}">Edicao de pedido</span><h2 class="${modalTitleClass}" id="edit-request-title">Atualizar solicitacao</h2><p class="mt-1 text-sm text-stone-500">Permitido somente antes da confirmacao do fornecedor.</p></div><button class="${modalCloseClass}" type="button" data-close-edit-modal aria-label="Fechar">x</button></header><form class="grid gap-3" data-form="edit-request"><input type="hidden" id="edit-request-location" name="locationId" value="${fallbackLocationId}" /><div class="grid gap-3 sm:grid-cols-2"><div class="${modalFieldClass}"><label class="${modalLabelClass}" for="edit-request-date">Data da refeicao</label><input class="${modalInputClass}" id="edit-request-date" name="date" type="date" min="${minimumMealDate()}" value="${request.date}" required /></div><div class="${modalFieldClass}"><label class="${modalLabelClass}" for="edit-request-quantity">Quantidade</label><input class="${modalInputClass}" id="edit-request-quantity" name="quantity" type="number" min="1" value="${request.quantity}" required /></div></div><div class="grid gap-3 sm:grid-cols-2"><div class="${modalFieldClass}"><label class="${modalLabelClass}" for="edit-request-meal">Tipo de refeicao</label><select class="${modalInputClass}" id="edit-request-meal" name="mealTypeId">${state.mealTypes.map((meal) => `<option value="${meal.id}" ${meal.id === request.mealTypeId ? "selected" : ""}>${escapeHtml(meal.label)}</option>`).join("")}</select></div><div class="${modalFieldClass}"><label class="${modalLabelClass}" for="edit-request-team">Equipe / trecho</label><select class="${modalInputClass}" id="edit-request-team" name="teamId" required>${teamOptions}</select></div></div><div class="${modalFieldClass}"><label class="${modalLabelClass}" for="edit-request-notes">Observacao</label><textarea class="${modalInputClass} min-h-24 py-2" id="edit-request-notes" name="notes">${escapeHtml(request.notes)}</textarea></div><footer class="flex justify-end gap-2 border-t border-stone-100 pt-3"><button class="${modalButtonOutlineClass}" type="button" data-close-edit-modal>Cancelar</button><button class="${modalButtonPrimaryClass}" type="submit" ${sections.length ? "" : "disabled"}>Salvar alteracoes</button></footer></form></section></div>`;
}

function renderEditRequestModalLegacy() {
  const request = state.requests.find((item) => item.id === editingRequestId);
  if (!request) return "";
  const user = getActiveUser(state);
  const addresses = state.deliveryAddresses.filter((address) => address.leaderId === user?.id && address.active !== false);
  const addressOptions = `<option value="">Selecione um endereço</option>${addresses.map((address) => `<option value="${address.id}" ${address.id === request.deliveryAddressId ? "selected" : ""}>${address.label} · ${address.addressLine}</option>`).join("")}`;
  return `<div class="${modalBackdropClass}" data-close-edit-modal><section class="${modalPanelClass}" role="dialog" aria-modal="true" aria-labelledby="edit-request-title" onclick="event.stopPropagation()"><header class="${modalHeaderClass}"><div><span class="${modalKickerClass}">Edição de pedido</span><h2 class="${modalTitleClass}" id="edit-request-title">Atualizar solicitação</h2><p class="mt-1 text-sm text-stone-500">As alterações serão aplicadas ao pedido já registrado.</p></div><button class="${modalCloseClass}" type="button" data-close-edit-modal aria-label="Fechar">×</button></header><form class="grid gap-3" data-form="edit-request"><div class="grid gap-3 sm:grid-cols-2"><div class="${modalFieldClass}"><label class="${modalLabelClass}" for="edit-request-date">Data da refeição</label><input class="${modalInputClass}" id="edit-request-date" name="date" type="date" value="${request.date}" required /></div><div class="${modalFieldClass}"><label class="${modalLabelClass}" for="edit-request-quantity">Quantidade</label><input class="${modalInputClass}" id="edit-request-quantity" name="quantity" type="number" min="1" value="${request.quantity}" required /></div></div><div class="grid gap-3 sm:grid-cols-2"><div class="${modalFieldClass}"><label class="${modalLabelClass}" for="edit-request-meal">Tipo de refeição</label><select class="${modalInputClass}" id="edit-request-meal" name="mealTypeId" data-edit-meal>${state.mealTypes.map((meal) => `<option value="${meal.id}" ${meal.id === request.mealTypeId ? "selected" : ""}>${meal.label}</option>`).join("")}</select></div><div class="${modalFieldClass}"><label class="${modalLabelClass}" for="edit-request-location">Local operacional</label><select class="${modalInputClass}" id="edit-request-location" name="locationId">${locationOptions(request.mealTypeId, request.locationId)}</select></div></div>${state.deliveryAddressFeatureAvailable ? `<div class="${modalFieldClass}"><label class="${modalLabelClass}" for="edit-request-address">Endereço de entrega</label><select class="${modalInputClass}" id="edit-request-address" name="deliveryAddressId" required>${addressOptions}</select></div>` : ""}<div class="${modalFieldClass}"><label class="${modalLabelClass}" for="edit-request-notes">Observação</label><textarea class="${modalInputClass} min-h-24 py-2" id="edit-request-notes" name="notes">${request.notes}</textarea></div><footer class="flex justify-end gap-2 border-t border-stone-100 pt-3"><button class="${modalButtonOutlineClass}" type="button" data-close-edit-modal>Cancelar</button><button class="${modalButtonPrimaryClass}" type="submit">Salvar alterações</button></footer></form></section></div>`;
}

function renderActualsModal() {
  const consolidation = state.consolidations.find((item) => item.id === pendingActualsConsolidationId);
  if (!consolidation) return "";
  const summary = getConsolidationSummary(state, consolidation);
  const grouped = new Map();
  summary.rows.forEach((request) => {
    const key = `${request.teamId || request.sectionName || request.leaderId}:${request.mealTypeId}`;
    const current = grouped.get(key) ?? {
      teamId: request.teamId || "",
      teamName: request.sectionName || request.location || getUserName(state, request.leaderId),
      mealTypeId: request.mealTypeId,
      mealType: request.mealType,
      requested: 0,
      actual: 0,
      headcount: request.sectionHeadcount ?? 0
    };
    current.requested += Number(request.quantity ?? 0);
    current.actual += Number(request.actualQuantity ?? request.quantity ?? 0);
    grouped.set(key, current);
  });
  const rows = Array.from(grouped.values());
  return `<div class="${modalBackdropClass}" data-close-actuals-modal><section class="${modalPanelClass}" role="dialog" aria-modal="true" aria-labelledby="actuals-title" onclick="event.stopPropagation()"><header class="${modalHeaderClass}"><div><span class="${modalKickerClass}">Consumo real</span><h2 class="${modalTitleClass}" id="actuals-title">Registrar saida do bloco</h2><p class="mt-1 text-sm text-stone-500">Informe o consumido por equipe/trecho e alimentacao antes de concluir a saida.</p></div><button class="${modalCloseClass}" type="button" data-close-actuals-modal aria-label="Fechar">x</button></header><form class="grid gap-3" data-form="actuals"><input type="hidden" name="consolidationId" value="${consolidation.id}" /><div class="grid gap-2">${rows.map((row, index) => `<div class="grid gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_110px] sm:items-end"><input type="hidden" name="teamId-${index}" value="${row.teamId}" /><input type="hidden" name="mealTypeId-${index}" value="${row.mealTypeId}" /><div><span class="${modalLabelClass}">Equipe / trecho</span><strong class="block text-sm">${escapeHtml(row.teamName)}</strong><small class="text-xs font-bold text-stone-500">Solicitado ${row.requested} - efetivo ${row.headcount || "-"}</small></div><div><span class="${modalLabelClass}">Alimentacao</span><strong class="block text-sm">${escapeHtml(row.mealType)}</strong></div><div class="${modalFieldClass}"><label class="${modalLabelClass}" for="actual-${index}">Consumido</label><input class="${modalInputClass}" id="actual-${index}" name="quantity-${index}" type="number" min="0" value="${row.actual}" required /></div></div>`).join("")}</div><footer class="flex justify-end gap-2 border-t border-stone-100 pt-3"><button class="${modalButtonOutlineClass}" type="button" data-close-actuals-modal>Cancelar</button><button class="${modalButtonPrimaryClass}" type="submit">Salvar e registrar saida</button></footer></form></section></div>`;
}

function renderOperationModal() {
  const actualsModal = renderActualsModal();
  if (actualsModal) return actualsModal;
  const request = state.requests.find((item) => item.id === pendingCancelRequestId);
  if (request) return `<div class="${modalBackdropClass}"><section class="w-full max-w-md rounded-t-3xl border border-white/70 bg-white p-5 text-center shadow-2xl sm:rounded-3xl"><span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-700">${icon("trash", 23)}</span><span class="${modalKickerClass} mt-3 block">Confirmar cancelamento</span><h2 class="${modalTitleClass} mt-1">Cancelar este pedido?</h2><p class="mt-2 text-sm text-stone-500">O pedido de ${request.quantity} refeições para ${formatDate(request.date)} será cancelado e não entrará no envio ao fornecedor.</p><div class="mt-4 grid grid-cols-2 gap-2"><button class="${modalButtonOutlineClass}" data-dismiss-operation>Voltar</button><button class="${modalButtonDangerClass}" data-confirm-cancel="${request.id}">Cancelar pedido</button></div></section></div>`;
  if (operationNotice) return `<div class="${modalBackdropClass}"><section class="w-full max-w-md rounded-t-3xl border border-white/70 bg-white p-5 text-center shadow-2xl sm:rounded-3xl"><span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-orange-50 text-orange-700">${icon("clipboard", 23)}</span><span class="${modalKickerClass} mt-3 block">Operacao registrada</span><h2 class="${modalTitleClass} mt-1">${operationNotice.title}</h2><p class="mt-2 text-sm text-stone-500">${operationNotice.message}</p><button class="${modalButtonPrimaryClass} mt-4 w-full" data-dismiss-operation>Continuar</button></section></div>`;
  return "";
}

function renderFinanceiro(mode) {
  const isSupplier = mode === "fornecedor";
  const sourceRows = isSupplier
    ? supplierConsolidations().flatMap((consolidation) => getConsolidationSummary(state, consolidation).rows)
    : state.requests.filter((request) => request.status !== "cancelado");
  const month = state.settings.defaultMealDate.slice(0, 7);
  const rows = sourceRows.filter((request) => request.date.startsWith(month));
  const delivered = rows.filter((request) => request.status === "entregue");
  const projected = rows.reduce((sum, request) => sum + requestValue(request), 0);
  const deliveredValue = delivered.reduce((sum, request) => sum + requestValue(request), 0);
  const pendingValue = projected - deliveredValue;
  const byMeal = state.mealTypes.map((meal) => ({
    label: meal.label,
    value: rows.filter((request) => request.mealTypeId === meal.id).reduce((sum, request) => sum + requestValue(request), 0)
  })).filter((item) => item.value > 0);
  const max = Math.max(...byMeal.map((item) => item.value), 1);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(`${state.settings.defaultMealDate}T12:00:00`);
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return { key, label: String(date.getDate()).padStart(2, "0"), value: sourceRows.filter((request) => request.date === key).reduce((sum, request) => sum + requestValue(request), 0) };
  });
  const dailyMax = Math.max(...days.map((item) => item.value), 1);
  const title = isSupplier ? "Financeiro do fornecedor" : "Financeiro administrativo";
  return `<section class="finance-page">${topbar(title, `Análise de ${month}`, `${isSupplier ? renderSupplierBackButton() : renderAdminBackButton()}<button class="btn primary" data-export-finance="${mode}">Gerar PDF</button>`)}<div class="finance-metrics"><article class="finance-metric accent"><span>${isSupplier ? "Faturamento previsto" : "Custo previsto"}</span><strong>${money(projected)}</strong><small>${sumQty(rows)} refeições no mês</small></article><article class="finance-metric"><span>${isSupplier ? "Faturado" : "Pago/entregue"}</span><strong>${money(deliveredValue)}</strong><small>${delivered.length} pedidos entregues</small></article><article class="finance-metric"><span>Em aberto</span><strong>${money(pendingValue)}</strong><small>pedidos ainda em operação</small></article><article class="finance-metric"><span>Ticket médio</span><strong>${money(rows.length ? projected / sumQty(rows) : 0)}</strong><small>por refeicao</small></article></div><div class="finance-grid"><article class="finance-card"><h2>Composição por refeição</h2>${byMeal.map((item) => `<div class="finance-progress"><div><span>${item.label}</span><strong>${money(item.value)}</strong></div><i><b style="width:${Math.max(3, Math.round((item.value / max) * 100))}%"></b></i></div>`).join("") || `<div class="empty">Sem movimentação no período.</div>`}</article><article class="finance-card"><h2>Evolução dos últimos 7 dias</h2><div class="finance-bars">${days.map((item) => `<div><strong>${item.value ? money(item.value).replace("R$", "") : "-"}</strong><i style="height:${Math.max(5, Math.round((item.value / dailyMax) * 126))}px"></i><span>${item.label}</span></div>`).join("")}</div></article></div><article class="finance-card finance-table-card"><h2>Movimentações do período</h2><div class="table-wrap"><table><thead><tr><th>Data</th><th>Tipo</th><th>Quantidade</th><th>Valor</th><th>Status</th></tr></thead><tbody>${rows.sort((a, b) => b.date.localeCompare(a.date)).map((request) => `<tr><td>${formatDate(request.date)}</td><td>${request.mealType}</td><td>${request.quantity}</td><td><strong>${money(requestValue(request))}</strong></td><td><span class="badge ${request.status}">${STATUS_LABEL[request.status]}</span></td></tr>`).join("")}</tbody></table></div></article></section>`;
}

function renderPainel() {
  const date = activeDate();
  const rows = requestsForDate(state, date);
  const waitingCount = countStatus(rows, "enviado");
  const deliveredCount = countStatus(rows, "entregue");
  const totalCost = rows.reduce((sum, request) => sum + requestValue(request), 0);
  return `
    <section class="admin-home">
      <header class="admin-home-hero">
        <div>
          <span class="compact-kicker">Home</span>
          <h1>Resumo de ${formatDate(date)}</h1>
          <p>${waitingCount} pedido${waitingCount === 1 ? "" : "s"} recebido${waitingCount === 1 ? "" : "s"} para envio ao fornecedor.</p>
        </div>
        <button class="btn primary" data-view="pedidos">${icon("truck", 16)}Enviar pedido</button>
      </header>
      <section class="admin-stats">
        <div class="stats-grid admin-metrics-grid admin-home-metrics">
          <div class="stat-card accent"><div class="stat-label">Total</div><div class="stat-value">${sumQty(rows)}</div><div class="stat-sub">refeições</div></div>
          <div class="stat-card"><div class="stat-label">A enviar</div><div class="stat-value">${waitingCount}</div><div class="stat-sub">aguardando</div></div>
          <div class="stat-card"><div class="stat-label">Entregas</div><div class="stat-value">${deliveredCount}</div><div class="stat-sub">realizadas</div></div>
          <div class="stat-card"><div class="stat-label">Custo</div><div class="stat-value">${money(totalCost)}</div><div class="stat-sub">estimado</div></div>
        </div>
      </section>
      ${renderAdminLiveOrders(rows)}
    </section>
    <div class="report-grid">
      <div class="insight-panel">
        ${renderWeeklyConsumptionChart(date)}
      </div>
    </div>`;
}

function renderWeeklyConsumptionChart(referenceDate) {
  const weekStart = getWeekStart(referenceDate, adminConsumptionWeekOffset);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    const rows = state.requests.filter((request) => request.date === key && request.status !== "cancelado");
    return {
      date,
      key,
      label: new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date).replace(".", ""),
      total: sumQty(rows),
      value: rows.reduce((sum, request) => sum + requestValue(request), 0),
      waiting: countStatus(rows, "enviado"),
      delivered: countStatus(rows, "entregue")
    };
  });
  const max = Math.max(...days.map((day) => day.total), 1);
  const weekTotal = days.reduce((sum, day) => sum + day.total, 0);
  const weekCost = days.reduce((sum, day) => sum + day.value, 0);
  const todayKey = new Date().toISOString().slice(0, 10);
  const periodLabel = `${formatDate(days[0].key)} a ${formatDate(days[6].key)}`;

  return `
    <div class="weekly-consumption-card">
      <div class="weekly-consumption-head">
        <div>
          <h2 class="section-title">Consumo semanal</h2>
          <p>${periodLabel}</p>
        </div>
        <div class="week-nav" aria-label="Navegar semanas">
          <button class="icon-action" type="button" data-week-nav="-1" aria-label="Semana anterior">${icon("arrow", 14)}</button>
          <button class="btn outline small" type="button" data-week-nav="0">Semana atual</button>
          <button class="icon-action next" type="button" data-week-nav="1" aria-label="Próxima semana">${icon("arrow", 14)}</button>
        </div>
      </div>
      <div class="weekly-consumption-summary">
        <span><strong>${weekTotal}</strong> refeições</span>
        <span><strong>${money(weekCost)}</strong> custo previsto</span>
      </div>
      <div class="weekly-chart" role="list" aria-label="Consumo semanal por dia">
        ${days.map((day) => `
          <button class="weekly-bar ${day.key === todayKey ? "today" : ""}" type="button" role="listitem" data-filter-date-set="${day.key}" aria-label="${day.label}, ${day.total} refeições">
            <span class="weekly-bar-value">${day.total || "-"}</span>
            <i style="height:${Math.max(8, Math.round((day.total / max) * 150))}px"></i>
            <span class="weekly-bar-label">${day.label}</span>
            <small>${day.date.getDate().toString().padStart(2, "0")}</small>
            <b class="weekly-tooltip">${formatDate(day.key)}<br>${day.total} refeições<br>${day.waiting} a enviar · ${day.delivered} entregues</b>
          </button>`).join("")}
      </div>
    </div>`;
}

function getWeekStart(referenceDate, offset = 0) {
  const date = new Date(`${referenceDate}T12:00:00`);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diffToMonday + offset * 7);
  date.setHours(12, 0, 0, 0);
  return date;
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function normalizeReportFilter(nextFilter = reportFilter) {
  const baseDate = nextFilter.start || state.settings.defaultMealDate;
  if (nextFilter.range === "all") return { range: "all", start: "", end: "" };
  if (nextFilter.range === "day") return { range: "day", start: baseDate, end: baseDate };
  if (nextFilter.range === "week") {
    const start = getWeekStart(baseDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { range: "week", start: toDateKey(start), end: toDateKey(end) };
  }
  if (nextFilter.range === "month") {
    const [year, month] = baseDate.split("-").map(Number);
    const start = new Date(year, month - 1, 1, 12);
    const end = new Date(year, month, 0, 12);
    return { range: "month", start: toDateKey(start), end: toDateKey(end) };
  }
  const start = nextFilter.start || state.settings.defaultMealDate;
  const end = nextFilter.end || start;
  return start <= end ? { range: "custom", start, end } : { range: "custom", start: end, end: start };
}

function getReportRows() {
  const filter = normalizeReportFilter(reportFilter);
  return state.requests
    .filter((request) => request.status !== "cancelado")
    .filter((request) => filter.range === "all" || (request.date >= filter.start && request.date <= filter.end));
}

function getReportPeriodLabel() {
  const filter = normalizeReportFilter(reportFilter);
  if (filter.range === "all") return "Todo período";
  if (filter.start === filter.end) return formatDate(filter.start);
  return `${formatDate(filter.start)} a ${formatDate(filter.end)}`;
}

function auditEntityLabel(entity) {
  return {
    pedido: "Pedido de refeição",
    meal_request: "Pedido de refeição",
    tipo_alimentacao: "Tipo de alimentação",
    meal_type: "Tipo de alimentação",
    consolidacao: "Envio ao fornecedor",
    consolidation: "Envio ao fornecedor",
    fornecedor: "Fornecedor",
    supplier: "Fornecedor",
    usuario: "Usuário",
    user: "Usuário",
    seed: "Carga inicial"
  }[entity] ?? String(entity ?? "Registro").replaceAll("_", " ");
}

function renderAdminLiveOrders(rows) {
  const operationalRows = rows
    .filter((request) => request.status !== "cancelado")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const waitingRows = operationalRows.filter((request) => request.status === "enviado");
  const draftRows = operationalRows.filter((request) => request.status === "rascunho");
  const latestRows = operationalRows.slice(0, 6);
  const nextRequest = waitingRows[0] ?? draftRows[0] ?? latestRows[0];

  if (!latestRows.length) {
    return `
      <section class="admin-live-panel is-empty">
        <div class="admin-live-heading">
          <div><span class="eyebrow">Pedidos em tempo real</span><h2>Nenhum pedido chegou para esta data</h2><p>Assim que um encarregado enviar, ele aparece aqui automaticamente.</p></div>
          <span class="live-pill">${icon("clock", 14)}Ao vivo</span>
        </div>
      </section>`;
  }

  return `
    <section class="admin-live-panel">
      <div class="admin-live-heading">
        <div>
          <span class="eyebrow">Pedidos em tempo real</span>
          <h2>${waitingRows.length ? `${waitingRows.length} pedido${waitingRows.length > 1 ? "s" : ""} aguardando conferencia` : "Fila operacional atualizada"}</h2>
          <p>Pedidos novos entram aqui sem precisar recarregar a pagina.</p>
        </div>
        <span class="live-pill">${icon("clock", 14)}Ao vivo</span>
      </div>
      <div class="admin-live-grid">
        ${nextRequest ? renderAdminPriorityOrder(nextRequest) : ""}
        <div class="admin-live-list">
          ${latestRows.map(renderAdminLiveOrderRow).join("")}
        </div>
      </div>
    </section>`;
}

function renderAdminPriorityOrder(request) {
  const destination = request.sectionName || "Equipe nao informada";
  return `
    <article class="admin-priority-order">
      <div class="admin-priority-main">
        <span class="request-meal-icon">${icon(request.mealType?.includes("Marmita") ? "package" : "utensils", 17)}</span>
        <div>
          <span class="badge ${request.status}">${STATUS_LABEL[request.status] ?? request.status}</span>
          <h3>${request.mealType}</h3>
          <p>${getUserName(state, request.leaderId)} - ${destination}</p>
        </div>
        <strong>${request.quantity}<small>ref.</small></strong>
      </div>
      <div class="admin-priority-metrics legacy-hidden">
        <div><strong>${request.quantity}</strong><span>refeições</span></div>
        <div><strong>${money(requestValue(request))}</strong><span>valor</span></div>
        <div><strong>${formatDate(request.date)}</strong><span>entrega</span></div>
      </div>
      <p>${getUserName(state, request.leaderId)} · ${request.deliveryAddress || request.location}</p>
      <div class="admin-priority-actions">
        <button class="btn outline small" data-open-request="${request.id}">Abrir pedido</button>
        ${canEditRequest(state, request) ? `<button class="btn primary small" data-send-request-date="${request.date}">${icon("truck", 14)}Enviar</button>` : ""}
        <button class="btn outline small" data-view="pedidos">Ver todos</button>
      </div>
    </article>`;
}

function renderAdminLiveOrderRow(request) {
  return `
    <article class="admin-live-order">
      <button class="admin-live-order-main" data-open-request="${request.id}">
      <span class="badge ${request.status}">${STATUS_LABEL[request.status] ?? request.status}</span>
      <strong>${request.mealType} · ${request.quantity} refeições</strong>
      <small>${getUserName(state, request.leaderId)} · ${request.deliveryAddress || request.location}</small>
      <b>${formatDateTime(request.updatedAt)}</b>
      </button>
      ${canEditRequest(state, request) ? `<button class="icon-action admin-live-send" data-send-request-date="${request.date}" aria-label="Enviar pedido ao fornecedor">${icon("truck", 15)}Enviar</button>` : ""}
    </article>`;
}

function renderAdminRequestDetailModal() {
  const request = state.requests.find((item) => item.id === adminRequestDetailId);
  if (!request) return "";
  const destination = request.sectionName || "Equipe nao informada";
  const composition = requestMealDescription(request);
  return `
    <div class="${modalBackdropClass}" data-close-request-detail>
    <section class="${modalPanelClass}" role="dialog" aria-modal="true" aria-labelledby="request-detail-title" onclick="event.stopPropagation()">
      <header>
        <div>
          <span class="eyebrow">Detalhe do pedido</span>
          <h2 id="request-detail-title">${getUserName(state, request.leaderId)}</h2>
          <p>${formatDate(request.date)} - ${STATUS_LABEL[request.status] ?? request.status}</p>
        </div>
        <button class="modal-close" type="button" data-close-request-detail aria-label="Fechar">×</button>
      </header>
      <article class="admin-request-detail-card">
        <div class="admin-request-detail-hero">
          <span class="request-meal-icon">${icon(request.mealType?.includes("Marmita") ? "package" : "utensils", 22)}</span>
          <div>
            <span class="badge ${request.status}">${STATUS_LABEL[request.status] ?? request.status}</span>
            <h2>${request.mealType}</h2>
            <p>${request.quantity} refeições solicitadas${composition ? ` - ${escapeHtml(composition)}` : ""}</p>
          </div>
        </div>
        <div class="admin-request-detail-grid">
          <div><span>Encarregado</span><strong>${getUserName(state, request.leaderId)}</strong></div>
          <div><span>Entrega</span><strong>${destination}</strong></div>
          <div><span>Data</span><strong>${formatDate(request.date)}</strong></div>
          <div><span>Valor estimado</span><strong>${money(requestValue(request))}</strong></div>
        </div>
        <div class="admin-request-notes">
          <span>Observação</span>
          <p>${request.notes || "Sem observacoes para este pedido."}</p>
        </div>
        ${composition ? `<div class="admin-request-notes"><span>Composição</span><p>${escapeHtml(composition)}</p></div>` : ""}
      </article>
      <footer>
        ${canEditRequest(state, request) ? `<button class="btn outline" data-edit-request="${request.id}">${icon("edit", 14)}Editar</button>` : ""}
        ${canEditRequest(state, request) ? `<button class="btn primary" data-send-request-date="${request.date}">${icon("truck", 14)}Enviar pedido</button>` : ""}
      </footer>
    </section>
    </div>`;
}

function renderPedidosAdmin() {
  const date = activeDate();
  const leader = document.querySelector("[data-filter-leader]")?.value ?? "";
  const meal = document.querySelector("[data-filter-meal]")?.value ?? "";
  const rows = state.requests.filter((request) => {
    const matchDate = !date || request.date === date;
    const matchLeader = !leader || request.leaderId === leader;
    const matchMeal = !meal || request.mealType === meal;
    return matchDate && matchLeader && matchMeal;
  });
  return `
    <header class="admin-list-header">
      <div>
        <span class="compact-kicker">Pedidos</span>
        <h1>Pedidos recebidos</h1>
      </div>
      <div class="admin-list-actions">
        <input type="date" value="${date}" data-filter-date aria-label="Filtrar por data" />
        <select data-filter-leader aria-label="Filtrar encarregado">
          <option value="">Todos</option>
          ${state.users.map((user) => `<option value="${user.id}" ${leader === user.id ? "selected" : ""}>${user.name}</option>`).join("")}
        </select>
        <select data-filter-meal aria-label="Filtrar refeicao">
          <option value="">Tipos</option>
          ${state.mealTypes.map((item) => `<option ${meal === item.label ? "selected" : ""}>${item.label}</option>`).join("")}
        </select>
        ${renderExportMenu("pedidos", [["pdf", "PDF", "clipboard"], ["xlsx", "Excel", "chart"]])}
      </div>
    </header>
    <div class="table-panel admin-requests-panel">
      <h2 class="section-title">Lista operacional</h2>
      ${renderAdminRequestCards(rows)}
      ${rows.length ? renderRequestTable(rows, { showLeader: true, editable: true }) : ""}
    </div>`;
}

function renderAdminRequestCards(rows) {
  if (!rows.length) return `<div class="admin-request-list"><div class="empty">Nenhum pedido encontrado.</div></div>`;
  return `<div class="admin-request-list">${rows.map(renderAdminRequestCard).join("")}</div>`;
}

function renderAdminRequestCard(request) {
  const editable = canEditRequest(state, request);
  return `
    <article class="admin-request-card">
      <div class="admin-request-main">
        <span class="request-meal-icon">${icon(request.mealType?.includes("Marmita") ? "package" : "utensils", 18)}</span>
        <div>
          <div class="request-card-title"><strong>${getUserName(state, request.leaderId)}</strong><span class="badge ${request.status}">${STATUS_LABEL[request.status] ?? request.status}</span></div>
          <small>${request.mealType} · ${request.deliveryAddress || request.location}</small>
        </div>
        <div class="request-card-quantity"><strong>${request.quantity}</strong><span>ref.</span></div>
      </div>
      <footer>
        <span>${formatDate(request.date)} · ${formatDateTime(request.updatedAt)}</span>
        <div class="request-card-actions">
          ${editable ? `<button class="icon-action" data-edit-request="${request.id}" aria-label="Editar pedido">${icon("edit", 15)}Editar</button><button class="icon-action danger" data-cancel-request="${request.id}" aria-label="Cancelar pedido">${icon("trash", 15)}Cancelar</button>` : `<span class="locked-label">${icon("clock", 14)}Bloqueado</span>`}
        </div>
      </footer>
    </article>`;
}

function renderAdminMore() {
  const shortcuts = [
    ["financeiro", "chart", "Financeiro"],
    ["relatorios", "chart", "Relatórios"],
    ["auditoria", "history", "Auditoria"],
    ["configuracoes", "settings", "Configurações"]
  ];
  return `
    <section class="admin-more">
      <header class="admin-home-hero compact">
        <div>
          <span class="compact-kicker">Administração</span>
          <h1>Mais ferramentas</h1>
          <p>Acesse as áreas de consulta e ajustes sem deixar o rodapé principal carregado.</p>
        </div>
      </header>
      <div class="admin-more-grid">
        ${shortcuts.map(([view, iconName, title]) => `
          <button class="admin-more-tile" data-view="${view}">
            <span>${icon(iconName, 24)}</span>
            <strong>${title}</strong>
          </button>`).join("")}
      </div>
    </section>`;
}

function renderConsolidacao() {
  const date = activeDate();
  const consolidation = getConsolidationForDate(state, date);
  const summary = getConsolidationSummary(state, consolidation);
  const suppliers = getSuppliers(state);
  const selectedSupplier = consolidation.supplierId ?? suppliers[0]?.id ?? "";
  return `
    <header class="admin-send-header">
      <div class="admin-send-title">
        <span class="compact-kicker">Enviar pedido</span>
        <h1>Pedido ao fornecedor</h1>
        <p>${summary.total} refeições para ${formatDate(date)}</p>
      </div>
      <div class="admin-send-actions">
        <div class="admin-send-filters">
          <input type="date" value="${date}" data-filter-date aria-label="Data do pedido" />
          <select data-supplier-id aria-label="Fornecedor">
            ${suppliers.map((supplier) => `<option value="${supplier.id}" ${supplier.id === selectedSupplier ? "selected" : ""}>${supplier.name}</option>`).join("")}
          </select>
          <span class="badge ${consolidation.status}">${STATUS_LABEL[consolidation.status] ?? consolidation.status}</span>
        </div>
        ${renderExportMenu("consolidacao", [["pdf", "PDF", "chart"], ["doc", "Word", "clipboard"]])}
        <button class="btn primary admin-send-submit" data-action="send-consolidation">${icon("truck", 15)}Enviar</button>
      </div>
    </header>
    <div class="report-grid">
      <div class="data-panel">
        <h2 class="section-title">Resumo do pedido</h2>
        ${renderConsolidatedSummary(summary)}
      </div>
      <div class="timeline-panel">
        <h2 class="section-title">Linha do tempo</h2>
        ${renderConsolidationTimeline(consolidation)}
      </div>
    </div>
    <div class="table-panel">
      <h2 class="section-title">Pedidos de origem</h2>
      ${renderRequestTable(summary.rows, { showLeader: true, editable: false })}
    </div>`;
}

function supplierConsolidations() {
  const user = getActiveUser(state);
  return state.consolidations
    .filter((item) => item.supplierId === user?.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function supplierDocuments(consolidationId) {
  return state.consolidationDocuments.filter((item) => item.consolidationId === consolidationId);
}

function supplierStatusCount(rows, status) {
  return rows.filter((item) => item.status === status).length;
}

function supplierActionLabel(consolidation) {
  const next = nextSupplierStep(consolidation.status);
  return next?.label ?? "Entrega concluida";
}

function renderSupplierMetric(label, value, detail, accent = "") {
  return `<article class="supplier-metric ${accent}"><span>${label}</span><strong>${value}</strong><small>${detail}</small></article>`;
}

function renderFornecedor() {
  const rows = supplierConsolidations();
  const activeRows = rows.filter((item) => !["entregue", "rascunho"].includes(item.status));
  const priority = [...activeRows].sort((a, b) => {
    const rank = { enviado: 0, confirmado: 1, producao: 2, saiu_entrega: 3 };
    return (rank[a.status] ?? 9) - (rank[b.status] ?? 9) || new Date(a.date) - new Date(b.date);
  })[0];
  const totalToday = rows
    .filter((item) => item.date === state.settings.defaultMealDate)
    .reduce((sum, item) => sum + getConsolidationSummary(state, item).total, 0);

  return `
    <section class="supplier-dashboard">
      <header class="supplier-heading">
        <div><span class="eyebrow">Operação do fornecedor</span><h1>Visão de hoje</h1><p>Produza, despache e acompanhe cada pedido em tempo real.</p></div>
        <button class="btn outline" data-view="fornecedor-pedidos">Ver pedidos</button>
      </header>
      <div class="supplier-metrics-grid">
        ${renderSupplierMetric("Refeições do dia", totalToday, `para ${formatDate(state.settings.defaultMealDate)}`, "accent")}
        ${renderSupplierMetric("A confirmar", supplierStatusCount(rows, "enviado"), "pedidos recebidos")}
        ${renderSupplierMetric("Em produção", supplierStatusCount(rows, "confirmado") + supplierStatusCount(rows, "producao"), "em preparo")}
        ${renderSupplierMetric("Em rota", supplierStatusCount(rows, "saiu_entrega"), "aguardando entrega")}
        ${renderSupplierMetric("Entregues", supplierStatusCount(rows, "entregue"), "histórico total")}
      </div>
      ${priority ? renderSupplierNextAction(priority) : renderSupplierEmptyState()}
      <section class="supplier-panel-card supplier-queue-card">
        <div class="supplier-section-heading"><div><span class="eyebrow">Fila operacional</span><h2>Pedidos prioritários</h2></div><button class="text-action" data-view="fornecedor-pedidos">Ver todos ${icon("arrow", 15)}</button></div>
        <div class="supplier-queue">${activeRows.slice(0, 5).map(renderSupplierQueueRow).join("") || `<div class="empty">Nenhum pedido pendente no momento.</div>`}</div>
      </section>
    </section>`;
}

function renderSupplierEmptyState() {
  return `<section class="supplier-next-action is-empty"><span class="supplier-next-icon">${icon("package", 22)}</span><div><span class="eyebrow">Tudo em dia</span><h2>Sem ação pendente</h2><p>Quando o administrador enviar um pedido ao fornecedor, ele aparecerá aqui.</p></div></section>`;
}

function renderSupplierNextAction(consolidation) {
  const summary = getConsolidationSummary(state, consolidation);
  const next = nextSupplierStep(consolidation.status);
  const foods = Object.entries(summary.byMeal).map(([meal, data]) => `${data.total} ${meal}`).join(" · ");
  const value = consolidationValue(consolidation);
  return `<section class="supplier-next-action">
    <span class="supplier-next-icon">${icon(consolidation.status === "saiu_entrega" ? "truck" : "clipboard", 22)}</span>
    <div class="supplier-next-copy"><span class="eyebrow">Próxima ação</span><h2>${supplierActionLabel(consolidation)}</h2><div class="supplier-next-order"><strong>${foods}</strong><span>Pedido ${consolidation.id.slice(0, 8).toUpperCase()}</span><span>${summary.total} refeições</span><span>${money(value)}</span><span>Entrega: ${formatDate(consolidation.date)}</span></div></div>
    <div class="supplier-next-actions"><button class="btn outline small" data-supplier-select="${consolidation.id}">Detalhes</button>${next ? `<button class="btn primary" data-step="${next.step}" data-id="${consolidation.id}">${next.label}</button>` : ""}</div>
  </section>`;
}

function renderSupplierQueueRow(consolidation) {
  const summary = getConsolidationSummary(state, consolidation);
  const foods = Object.entries(summary.byMeal).map(([meal, data]) => `${data.total} ${meal}`).join(" · ");
  return `<button class="supplier-queue-row" data-supplier-select="${consolidation.id}"><span><strong>${foods}</strong><small>Pedido ${consolidation.id.slice(0, 8).toUpperCase()} · ${summary.total} refeições · ${money(consolidationValue(consolidation))}</small></span><span class="supplier-queue-delivery">Entrega<br><b>${formatDate(consolidation.date)}</b></span><span class="badge ${consolidation.status}">${STATUS_LABEL[consolidation.status]}</span>${icon("arrow", 16)}</button>`;
}

function renderSupplierOrders() {
  const rows = supplierConsolidations().filter((item) => {
    const matchesStatus = supplierOrderStatus === "todos"
      || (supplierOrderStatus === "ativos" ? !["entregue", "rascunho"].includes(item.status) : item.status === supplierOrderStatus);
    return matchesStatus && (!supplierOrderDate || item.date === supplierOrderDate);
  });
  const selected = rows.find((item) => item.id === selectedSupplierConsolidationId) ?? rows[0] ?? null;
  return `<section class="supplier-workspace">
    ${topbar("Pedidos", "Fila de produção, entrega e acompanhamento", `<div class="filter-bar supplier-filter-bar"><select data-supplier-status><option value="ativos" ${supplierOrderStatus === "ativos" ? "selected" : ""}>Pedidos ativos</option><option value="todos" ${supplierOrderStatus === "todos" ? "selected" : ""}>Todos os pedidos</option><option value="enviado" ${supplierOrderStatus === "enviado" ? "selected" : ""}>A confirmar</option><option value="confirmado" ${supplierOrderStatus === "confirmado" ? "selected" : ""}>Em produção</option><option value="saiu_entrega" ${supplierOrderStatus === "saiu_entrega" ? "selected" : ""}>Em rota</option><option value="entregue" ${supplierOrderStatus === "entregue" ? "selected" : ""}>Entregues</option></select><input type="date" value="${supplierOrderDate}" data-supplier-date /><button class="btn outline small" data-supplier-clear-filter>Limpar filtros</button></div>`)}
    <div class="supplier-orders-layout"><div class="supplier-order-list">${rows.map((item) => renderSupplierOrderListItem(item, item.id === selected?.id)).join("") || `<div class="empty">Nenhum pedido encontrado.</div>`}</div>${selected ? renderSupplierOrderDetail(selected) : `<div class="empty supplier-detail-empty">Selecione um pedido para ver os detalhes.</div>`}</div>
  </section>`;
}

function renderSupplierOrderListItem(consolidation, selected) {
  const summary = getConsolidationSummary(state, consolidation);
  const foods = Object.entries(summary.byMeal).map(([meal, data]) => `${data.total} ${meal}`).join(" · ");
  return `<button class="supplier-order-list-item ${selected ? "selected" : ""}" data-supplier-select="${consolidation.id}"><span class="badge ${consolidation.status}">${STATUS_LABEL[consolidation.status]}</span><strong>${foods}</strong><small>${summary.total} refeições · ${money(consolidationValue(consolidation))} · Entrega ${formatDate(consolidation.date)}</small></button>`;
}

function renderSupplierOrderDetail(consolidation) {
  const summary = getConsolidationSummary(state, consolidation);
  const next = nextSupplierStep(consolidation.status);
  const highlights = Object.entries(summary.byMeal).map(([meal, data]) => `${meal}: ${data.total}`).join(" · ");
  const compositions = Object.entries(summary.byMeal)
    .map(([meal, data]) => {
      const description = requestMealDescription(data.rows[0]);
      return description ? `<p><strong>${escapeHtml(meal)}:</strong> ${escapeHtml(description)}</p>` : "";
    })
    .join("");
  return `<article class="supplier-order-detail"><div class="supplier-detail-top"><div><span class="eyebrow">Pedido ${consolidation.id.slice(0, 8).toUpperCase()}</span><h2>${summary.total} refeições para ${formatDate(consolidation.date)}</h2></div><span class="badge ${consolidation.status}">${STATUS_LABEL[consolidation.status]}</span></div><div class="supplier-order-highlights"><div><span>Alimentação</span><strong>${highlights}</strong></div><div><span>Quantidade</span><strong>${summary.total} refeições</strong></div><div><span>Valor do pedido</span><strong>${money(consolidationValue(consolidation))}</strong></div><div><span>Entrega prevista</span><strong>${formatDate(consolidation.date)}</strong></div></div>${compositions ? `<section class="supplier-composition"><h3>Composição das marmitas</h3>${compositions}</section>` : ""}<div class="supplier-detail-actions"><button class="btn outline small" data-generate-romaneio="${consolidation.id}">Gerar nota de fornecimento</button>${next ? `<button class="btn primary" data-step="${next.step}" data-id="${consolidation.id}">${next.label}</button>` : ""}</div><div class="supplier-detail-grid"><section><h3>Itens do pedido</h3>${renderConsolidatedSummary(summary)}</section><section><h3>Rastreabilidade</h3>${renderConsolidationTimeline(consolidation)}</section></div><section class="supplier-origin-requests"><h3>Pedidos de origem</h3>${renderSupplierOriginCards(summary.rows)}</section></article>`;
}

function renderSupplierOriginCards(rows) {
  if (!rows.length) return `<div class="empty">Nenhum pedido de origem encontrado.</div>`;
  return `<div class="supplier-origin-list">${rows.map((request) => `<article class="supplier-origin-card"><div><strong>${request.mealType}</strong><span class="badge ${request.status}">${STATUS_LABEL[request.status] ?? request.status}</span></div><p>${getUserName(state, request.leaderId)} - ${request.location}</p><footer><span>${formatDate(request.date)}</span><b>${request.quantity} ref.</b><small>${formatDateTime(request.updatedAt)}</small></footer></article>`).join("")}</div>`;
}

function renderSupplierHistory() {
  const rows = supplierConsolidations().filter((item) => item.status === "entregue");
  return `<section class="supplier-workspace">${topbar("Histórico de entregas", "Pedidos concluídos pelo fornecedor")}<div class="supplier-history-list">${rows.map((item) => { const summary = getConsolidationSummary(state, item); const delivered = item.confirmations.find((confirmation) => confirmation.step === "entregue"); return `<article class="supplier-history-row"><div><span class="badge entregue">Entregue</span><h2>${formatDate(item.date)} · ${summary.total} refeições</h2><p>Concluído em ${formatDateTime(delivered?.at)}</p></div><div class="supplier-history-actions"><button class="btn outline small" data-generate-romaneio="${item.id}">Nota de fornecimento</button><button class="btn outline small" data-view="fornecedor-documentos">Documentos</button></div></article>`; }).join("") || `<div class="empty">Nenhuma entrega concluída ainda.</div>`}</div></section>`;
}

function renderSupplierDocuments() {
  const rows = supplierConsolidations();
  return `<section class="supplier-workspace">${topbar("Documentos", "Notas de fornecimento e notas fiscais anexadas", renderSupplierBackButton())}<div class="supplier-documents-list">${rows.map((consolidation) => { const summary = getConsolidationSummary(state, consolidation); const docs = supplierDocuments(consolidation.id); return `<article class="supplier-document-card"><div class="supplier-document-title"><div><span class="eyebrow">${formatDate(consolidation.date)}</span><h2>Pedido ${consolidation.id.slice(0, 8).toUpperCase()}</h2><p>${summary.total} refeições · ${STATUS_LABEL[consolidation.status]}</p></div><button class="btn outline small" data-generate-romaneio="${consolidation.id}">Gerar nota</button></div><div class="supplier-document-body"><div><strong>Nota fiscal</strong><small>Anexe o PDF fiscal emitido fora do sistema.</small></div><label class="btn primary small supplier-upload-label">Anexar PDF<input type="file" accept="application/pdf" data-document-upload="${consolidation.id}" hidden /></label></div>${docs.length ? `<div class="supplier-attached-files">${docs.map((doc) => `<button class="supplier-file-row" data-download-document="${doc.id}">${icon("package", 16)}<span>${doc.originalName}</span><small>${formatDateTime(doc.createdAt)}</small></button>`).join("")}</div>` : `<div class="supplier-no-documents">Nenhuma nota fiscal anexada.</div>`}</article>`; }).join("") || `<div class="empty">Ainda não há pedidos para documentar.</div>`}</div></section>`;
}

function renderRelatorios() {
  const filter = normalizeReportFilter(reportFilter);
  const rows = getReportRows();
  const total = sumQty(rows);
  const byLeader = Object.entries(rows.reduce((acc, request) => {
    const leader = getUserName(state, request.leaderId);
    acc[leader] ??= 0;
    acc[leader] += Number(request.quantity);
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);
  const byMeal = Object.entries(totalsByMeal(rows)).sort((a, b) => b[1] - a[1]);
  const byStatus = Object.entries(rows.reduce((acc, request) => {
    const label = STATUS_LABEL[request.status] ?? request.status;
    acc[label] ??= 0;
    acc[label] += 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);
  const byDay = Object.entries(rows.reduce((acc, request) => {
    acc[request.date] ??= 0;
    acc[request.date] += Number(request.quantity);
    return acc;
  }, {})).sort((a, b) => a[0].localeCompare(b[0])).slice(-10);
  const maxMeal = Math.max(...byMeal.map(([, value]) => value), 1);
  const maxLeader = Math.max(...byLeader.map(([, value]) => value), 1);
  const maxDay = Math.max(...byDay.map(([, value]) => value), 1);
  return `
    ${topbar("Relatórios", `Período: ${getReportPeriodLabel()}`, `
      <div class="filter-bar report-filter-bar">
      <select data-report-range>
        <option value="all" ${filter.range === "all" ? "selected" : ""}>Todo período</option>
        <option value="day" ${filter.range === "day" ? "selected" : ""}>Dia</option>
        <option value="week" ${filter.range === "week" ? "selected" : ""}>Semana</option>
        <option value="month" ${filter.range === "month" ? "selected" : ""}>Mes</option>
        <option value="custom" ${filter.range === "custom" ? "selected" : ""}>Período personalizado</option>
      </select>
      <input type="date" value="${filter.start || state.settings.defaultMealDate}" data-report-start ${filter.range === "all" ? "disabled" : ""} />
      <input type="date" value="${filter.end || filter.start || state.settings.defaultMealDate}" data-report-end ${filter.range === "custom" ? "" : "disabled"} />
      <select>
        <option>Todos os encarregados</option>
        ${getLeaders(state).map((leader) => `<option>${leader.name}</option>`).join("")}
      </select>
      </div>
      <button class="btn primary small" type="button" data-export-kpi>${icon("chart", 14)}KPI PDF</button>
      ${renderExportMenu("relatorios", [["pdf", "PDF", "clipboard"], ["xlsx", "Excel", "chart"]], "Medicao")}
      ${renderAdminBackButton()}
    `)}
    <div class="stats-grid report-metrics-grid">
      <div class="stat-card accent"><div class="stat-label">Total</div><div class="stat-value">${total}</div><div class="stat-sub">refeições no periodo</div></div>
      <div class="stat-card"><div class="stat-label">Marmitas</div><div class="stat-value">${totalsByMeal(rows)["Marmita Campo"] ?? 0}</div></div>
      <div class="stat-card"><div class="stat-label">Almocos</div><div class="stat-value">${totalsByMeal(rows)["Buffer Almoco"] ?? 0}</div></div>
      <div class="stat-card"><div class="stat-label">Jantas</div><div class="stat-value">${totalsByMeal(rows).Jantar ?? 0}</div></div>
    </div>
    <div class="report-grid">
      <div class="insight-panel">
        <h2 class="section-title">Distribuicao por refeicao</h2>
        ${byMeal.map(([meal, qty]) => `<div class="finance-progress"><div><span>${meal}</span><strong>${qty}</strong></div><i><b style="width:${Math.max(3, Math.round((qty / maxMeal) * 100))}%"></b></i></div>`).join("") || `<div class="empty">Sem dados no periodo.</div>`}
      </div>
      <div class="insight-panel">
        <h2 class="section-title">Status dos pedidos</h2>
        ${byStatus.map(([status, qty]) => `<div class="finance-progress"><div><span>${status}</span><strong>${qty}</strong></div><i><b style="width:${Math.max(3, Math.round((qty / rows.length) * 100))}%"></b></i></div>`).join("") || `<div class="empty">Sem dados no periodo.</div>`}
      </div>
      <div class="insight-panel">
        <h2 class="section-title">Ranking por encarregado</h2>
        ${byLeader.slice(0, 8).map(([leader, qty]) => `<div class="finance-progress"><div><span>${leader}</span><strong>${qty}</strong></div><i><b style="width:${Math.max(3, Math.round((qty / maxLeader) * 100))}%"></b></i></div>`).join("") || `<div class="empty">Sem dados no periodo.</div>`}
      </div>
      <div class="insight-panel">
        <h2 class="section-title">Evolucao diaria</h2>
        <div class="finance-bars">${byDay.map(([date, qty]) => `<div><strong>${qty}</strong><i style="height:${Math.max(5, Math.round((qty / maxDay) * 126))}px"></i><span>${date.slice(5).replace("-", "/")}</span></div>`).join("") || `<div class="empty">Sem dados no periodo.</div>`}</div>
      </div>
    </div>`;
}

function renderAuditoria() {
  return `
    ${topbar("Auditoria", "Registro de usuario, data e horario em todas as acoes", renderAdminBackButton())}
    <div class="audit-panel">
      <h2 class="section-title">Eventos do sistema</h2>
      <div class="timeline">
        ${state.auditLog.map((item) => `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-body"><strong>${item.action}</strong><br>${getUserName(state, item.userId)} · ${formatDateTime(item.at)} · ${auditEntityLabel(item.entity)}</div>
          </div>`).join("")}
      </div>
    </div>`;
}

function renderRequestTable(rows, options = {}) {
  if (!rows.length) return `<div class="empty">Nenhum pedido encontrado.</div>`;
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            ${options.showLeader ? "<th>Encarregado</th>" : ""}
            <th>Tipo</th>
            <th>Local</th>
            <th>Qtd</th>
            <th>Status</th>
            <th>Atualização</th>
            ${options.editable ? "<th>Ações</th>" : ""}
          </tr>
        </thead>
        <tbody>
          ${rows.map((request) => `
            <tr>
              <td>${formatDate(request.date)}</td>
              ${options.showLeader ? `<td><strong>${getUserName(state, request.leaderId)}</strong></td>` : ""}
              <td>${request.mealType}</td>
              <td>${request.location}</td>
              <td><strong>${request.quantity}</strong></td>
              <td><span class="badge ${request.status}">${STATUS_LABEL[request.status] ?? request.status}</span></td>
              <td>${formatDateTime(request.updatedAt)}</td>
              ${options.editable ? `<td>${renderRequestActions(request)}</td>` : ""}
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function renderRequestActions(request) {
  if (!canEditRequest(state, request)) return `<span class="page-subtitle">Bloqueado</span>`;
  return `
    <div class="button-row">
      <button class="btn outline small" data-edit-request="${request.id}">Editar</button>
      <button class="btn danger small" data-cancel-request="${request.id}">Cancelar</button>
    </div>`;
}

function renderConsolidatedSummary(summary) {
  if (!summary.rows.length) return `<div class="empty">Sem pedidos recebidos para enviar ao fornecedor.</div>`;
  return `
    ${Object.entries(summary.byMeal).map(([meal, data]) => `
      <div class="consolidated-block">
        <div class="consolidated-row total-line"><span>${meal}</span><span>${data.total}</span></div>
        ${requestMealDescription(data.rows[0]) ? `<div class="consolidated-description">${escapeHtml(requestMealDescription(data.rows[0]))}</div>` : ""}
        ${data.rows.map((request) => `<div class="consolidated-row"><span>${meal === "Marmita Campo" ? getUserName(state, request.leaderId) : request.location}</span><strong>${request.quantity}</strong></div>`).join("")}
      </div>`).join("")}
    <div class="consolidated-row total-line"><span>Total geral</span><span>${summary.total} refeições</span></div>`;
}

function renderConsolidationTimeline(consolidation) {
  const steps = [
    ["enviado", "Enviado ao fornecedor"],
    ["confirmado", "Fornecedor confirmou recebimento"],
    ["producao", "Fornecedor confirmou produção"],
    ["saiu_entrega", "Saida para entrega registrada"],
    ["entregue", "Entrega concluida"]
  ];
  return `
    <div class="timeline">
      ${steps.map(([step, label]) => {
        const confirmation = consolidation.confirmations.find((item) => item.step === step);
        return `
          <div class="timeline-item">
            <div class="timeline-dot" style="background:${confirmation ? "var(--orange)" : "var(--line)"}"></div>
            <div class="timeline-body"><strong>${label}</strong><br>${confirmation ? `${getUserName(state, confirmation.userId)} · ${formatDateTime(confirmation.at)}` : "Aguardando"}</div>
          </div>`;
      }).join("")}
    </div>`;
}

function bindEvents() {
  root.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.ordersTab) leaderOrdersTab = button.dataset.ordersTab;
      else if (button.dataset.view === "pedido") leaderOrdersTab = "novo";
      setView(button.dataset.view);
    });
  });
  root.querySelectorAll("[data-orders-tab]").forEach((button) => {
    if (button.dataset.view) return;
    button.addEventListener("click", () => {
      leaderOrdersTab = button.dataset.ordersTab;
      render();
    });
  });
  root.querySelector("[data-form='login']")?.addEventListener("submit", handleLoginSubmit);
  root.querySelectorAll("[data-login-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      loginMode = button.dataset.loginMode;
      loginError = "";
      renderLogin();
    });
  });
  root.querySelector("[data-form='register']")?.addEventListener("submit", handleRegisterSubmit);
  root.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => togglePasswordVisibility(button));
  });
  root.querySelectorAll("[data-action='logout']").forEach((button) => {
    button.addEventListener("click", handleLogout);
  });
  root.querySelector("[data-access-user]")?.addEventListener("change", (event) => {
    switchAccessUser(event.currentTarget.value);
  });
  root.querySelector("[data-action='return-admin']")?.addEventListener("click", () => {
    switchAccessUser(state.authenticatedUserId);
  });
  root.querySelector("[data-form='request']")?.addEventListener("submit", handleRequestSubmit);
  root.querySelector("[data-address-form-toggle]")?.addEventListener("click", () => {
    leaderAddressFormOpen = true;
    render();
  });
  root.querySelector("[data-address-form-cancel]")?.addEventListener("click", () => {
    leaderAddressFormOpen = false;
    render();
  });
  root.querySelector("[data-save-delivery-address]")?.addEventListener("click", saveDeliveryAddress);
  root.querySelectorAll("[data-filter-date], [data-filter-leader], [data-filter-meal]").forEach((control) => {
    control.addEventListener("change", (event) => {
      if (state.activeView === "pedidos" && event.currentTarget.matches("[data-filter-date]")) {
        adminRequestDateFilter = event.currentTarget.value;
      }
      render();
    });
  });
  root.querySelector("[data-clear-admin-request-filters]")?.addEventListener("click", () => {
    adminRequestDateFilter = "";
    render();
  });
  root.querySelectorAll("[data-report-range]").forEach((control) => {
    control.addEventListener("change", (event) => {
      reportFilter = normalizeReportFilter({ ...reportFilter, range: event.currentTarget.value });
      render();
    });
  });
  root.querySelectorAll("[data-report-start]").forEach((control) => {
    control.addEventListener("change", (event) => {
      reportFilter = normalizeReportFilter({ ...reportFilter, start: event.currentTarget.value });
      render();
    });
  });
  root.querySelectorAll("[data-report-end]").forEach((control) => {
    control.addEventListener("change", (event) => {
      reportFilter = normalizeReportFilter({ ...reportFilter, end: event.currentTarget.value });
      render();
    });
  });
  root.querySelectorAll("[data-cancel-request]").forEach((button) => {
    button.addEventListener("click", () => cancelRequest(button.dataset.cancelRequest));
  });
  root.querySelectorAll("[data-dismiss-operation]").forEach((button) => {
    button.addEventListener("click", () => {
      pendingCancelRequestId = null;
      operationNotice = null;
      render();
    });
  });
  root.querySelector("[data-confirm-cancel]")?.addEventListener("click", () => {
    const requestId = pendingCancelRequestId;
    pendingCancelRequestId = null;
    cancelRequest(requestId, true);
  });
  root.querySelectorAll("[data-edit-request]").forEach((button) => {
    button.addEventListener("click", () => duplicateForEdit(button.dataset.editRequest));
  });
  root.querySelectorAll("[data-open-request]").forEach((button) => {
    button.addEventListener("click", () => openAdminRequestDetail(button.dataset.openRequest));
  });
  root.querySelectorAll("[data-close-request-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      adminRequestDetailId = null;
      render();
    });
  });
  root.querySelectorAll("[data-send-request-date]").forEach((button) => {
    button.addEventListener("click", () => sendConsolidationForDate(button.dataset.sendRequestDate));
  });
  root.querySelectorAll("[data-close-edit-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      editingRequestId = null;
      render();
    });
  });
  root.querySelector("[data-form='edit-request']")?.addEventListener("submit", handleEditRequestSubmit);
  root.querySelector("[data-form='profile-settings']")?.addEventListener("submit", handleProfileSettingsSubmit);
  root.querySelector("[data-form='password-settings']")?.addEventListener("submit", handlePasswordSettingsSubmit);
  root.querySelector("[data-form='meal-price-settings']")?.addEventListener("submit", handleMealPriceSettingsSubmit);
  root.querySelector("[data-form='access-invite']")?.addEventListener("submit", handleAccessInviteSubmit);
  root.querySelector("[data-copy-invite-link]")?.addEventListener("click", copyGeneratedInviteLink);
  root.querySelectorAll("[data-form='work-section']").forEach((form) => {
    form.addEventListener("submit", handleWorkSectionSubmit);
  });
  root.querySelectorAll("[data-form='meal-catalog']").forEach((form) => {
    form.addEventListener("submit", handleMealCatalogSubmit);
  });
  root.querySelector("[data-open-new-meal]")?.addEventListener("click", () => {
    const panel = root.querySelector("[data-new-meal-panel]");
    if (panel) panel.open = true;
  });
  root.querySelectorAll("[data-delete-meal-type]").forEach((button) => {
    button.addEventListener("click", () => handleMealCatalogDelete(button.dataset.deleteMealType));
  });
  root.querySelector("[data-edit-meal]")?.addEventListener("change", (event) => {
    const location = root.querySelector("#edit-request-location");
    if (location) location.innerHTML = locationOptions(event.currentTarget.value);
  });
  root.querySelector("[data-action='send-consolidation']")?.addEventListener("click", sendConsolidation);
  root.querySelector("[data-form='actuals']")?.addEventListener("submit", handleActualsSubmit);
  root.querySelectorAll("[data-close-actuals-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      pendingActualsConsolidationId = null;
      render();
    });
  });
  root.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => supplierStep(button.dataset.id, button.dataset.step));
  });
  root.querySelectorAll("[data-supplier-select]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedSupplierConsolidationId = button.dataset.supplierSelect;
      state.activeView = "fornecedor-pedidos";
      render();
    });
  });
  root.querySelectorAll("[data-supplier-close-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedSupplierConsolidationId = null;
      render();
    });
  });
  root.querySelector("[data-supplier-status]")?.addEventListener("change", (event) => {
    supplierOrderStatus = event.currentTarget.value;
    selectedSupplierConsolidationId = null;
    render();
  });
  root.querySelector("[data-supplier-date]")?.addEventListener("change", (event) => {
    supplierOrderDate = event.currentTarget.value;
    selectedSupplierConsolidationId = null;
    render();
  });
  root.querySelector("[data-supplier-clear-filter]")?.addEventListener("click", () => {
    supplierOrderStatus = "todos";
    supplierOrderDate = "";
    selectedSupplierConsolidationId = null;
    render();
  });
  root.querySelectorAll("[data-generate-romaneio]").forEach((button) => {
    button.addEventListener("click", () => generateSupplierRomaneio(button.dataset.generateRomaneio));
  });
  root.querySelectorAll("[data-document-upload]").forEach((input) => {
    input.addEventListener("change", () => uploadSupplierDocument(input.dataset.documentUpload, input.files?.[0]));
  });
  root.querySelectorAll("[data-download-document]").forEach((button) => {
    button.addEventListener("click", () => downloadSupplierDocument(button.dataset.downloadDocument));
  });
  root.querySelectorAll("[data-daily-report-download]").forEach((button) => {
    button.addEventListener("click", () => downloadDailyReport(button.dataset.reportDate, button.dataset.dailyReportDownload));
  });
  root.querySelectorAll("[data-export-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      exportMenuOpen = exportMenuOpen === button.dataset.exportToggle ? null : button.dataset.exportToggle;
      render();
    });
  });
  root.querySelectorAll("[data-export]").forEach((button) => {
    button.addEventListener("click", () => {
      exportMenuOpen = null;
      handleExport(button.dataset.export);
    });
  });
  root.querySelectorAll("[data-export-kpi]").forEach((button) => {
    button.addEventListener("click", handleKpiExport);
  });
  root.querySelectorAll("[data-export-finance]").forEach((button) => {
    button.addEventListener("click", () => handleFinanceExport(button.dataset.exportFinance));
  });
  root.querySelectorAll("[data-export-audit]").forEach((button) => {
    button.addEventListener("click", () => handleAuditExport(button.dataset.exportAudit || "pdf"));
  });
  root.querySelectorAll("[data-week-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.weekNav);
      adminConsumptionWeekOffset = direction === 0 ? 0 : adminConsumptionWeekOffset + direction;
      render();
    });
  });
  root.querySelectorAll("[data-filter-date-set]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = root.querySelector("[data-filter-date]");
      if (filter) filter.value = button.dataset.filterDateSet;
      state.settings.defaultMealDate = button.dataset.filterDateSet;
      render();
    });
  });
}

function togglePasswordVisibility(button) {
  const input = document.getElementById(button.dataset.togglePassword);
  if (!input) return;
  const shouldShow = input.type === "password";
  input.type = shouldShow ? "text" : "password";
  button.classList.toggle("active", shouldShow);
  button.setAttribute("aria-label", shouldShow ? "Ocultar senha" : "Mostrar senha");
}

function switchAccessUser(userId) {
  const authenticatedUser = state.users.find((item) => item.id === state.authenticatedUserId);
  const targetUser = state.users.find((item) => item.id === userId && item.active !== false);
  if (authenticatedUser?.role !== "admin" || !targetUser) {
    toast("Este usuário não pode ser acessado.");
    return;
  }

  state.activeUserId = targetUser.id;
  state.activeView = NAV_BY_ROLE[targetUser.role][0][0];
  leaderOrdersTab = "novo";
  render();
  toast(targetUser.id === authenticatedUser.id
    ? "Voce voltou ao acesso administrativo."
    : `Agora voce esta acessando como ${targetUser.name}.`);
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  loginError = "";
  const form = new FormData(event.currentTarget);
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    await validateAlimentaObraSchema();
    const email = normalizeEmail(form.get("email"));
    if (!isValidEmail(email)) {
      loginError = "Informe um e-mail valido, por exemplo nome@empresa.com.";
      renderLogin();
      return;
    }
    await signIn(email, String(form.get("password")));
    await bootstrapAuthenticatedApp();
    toast("Acesso realizado.");
  } catch (error) {
    const message = String(error?.message ?? "");
    const isExpectedAuthError = String(error?.status ?? "") === "400"
      || message.toLowerCase().includes("invalid login credentials");
    loginError = "E-mail ou senha invalidos. Confira os dados e tente novamente.";
    if (!isExpectedAuthError) console.error(error);
    renderLogin();
  } finally {
    if (button) button.disabled = false;
  }
}

async function handleRegisterSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    await validateAlimentaObraSchema();
    const email = normalizeEmail(form.get("email"));
    if (!isValidEmail(email)) {
      toast("Informe um e-mail valido, por exemplo pedro@empresa.com.");
      return;
    }
    const result = await signUp({
      name: String(form.get("name")).trim(),
      email,
      team: String(form.get("team")).trim(),
      password: String(form.get("password")),
      inviteToken: String(form.get("inviteToken") ?? "")
    });
    if (!result.session) {
      loginMode = "login";
      renderLogin();
      toast("Conta criada. Confirme seu e-mail antes de entrar.");
      return;
    }
    await bootstrapAuthenticatedApp();
    toast("Conta criada. Bem-vindo ao AlimentaObra.");
  } catch (error) {
    console.error(error);
    if (String(error.message).toLowerCase().includes("email address")) {
      toast("O Supabase recusou este e-mail. Digite-o novamente sem espacos ou caracteres especiais.");
    } else {
      toast(error.message);
    }
  } finally {
    if (button) button.disabled = false;
  }
}

async function handleLogout() {
  try {
    await removeSubscription(realtimeChannel);
    realtimeChannel = null;
    await signOut();
  } catch (error) {
    console.error(error);
  }
  state = { ...createEmptyState(), loading: false };
  renderLogin();
}

async function handleRequestSubmit(event) {
  event.preventDefault();
  requestFormError = "";
  const submitter = event.submitter;
  if (submitter) submitter.disabled = true;
  const form = new FormData(event.currentTarget);
  const user = getActiveUser(state);
  const status = submitter?.value ?? "enviado";
  try {
    assertMealDateIsNotPast(form.get("date"));
    await createMealRequest({
      date: form.get("date"),
      mealTypeId: form.get("mealTypeId"),
      locationId: form.get("locationId"),
      teamId: form.get("teamId"),
      quantity: form.get("quantity"),
      status,
      notes: String(form.get("notes") ?? "")
    }, user.id);
    await refreshData();
    requestFormError = "";
    operationNotice = status === "enviado"
      ? {
          title: "Pedido enviado",
          message: "Seu pedido foi registrado e ja apareceu para a administracao em tempo real."
        }
      : {
          title: "Rascunho salvo",
          message: "Seu pedido ficou salvo como rascunho e pode ser editado antes do envio."
        };
    render();
  } catch (error) {
    console.error(error);
    requestFormError = error.message || "Nao foi possivel salvar o pedido.";
    render();
    toast(`Não foi possível salvar: ${error.message}`);
  } finally {
    if (submitter) submitter.disabled = false;
  }
}

async function saveDeliveryAddress() {
  const label = document.querySelector("#delivery-address-label")?.value.trim();
  const addressLine = document.querySelector("#delivery-address-line")?.value.trim();
  const reference = document.querySelector("#delivery-address-reference")?.value.trim() ?? "";
  const user = getActiveUser(state);
  if (!label || !addressLine) {
    toast("Informe o nome e o endereço completo.");
    return;
  }
  if (!user?.id) {
    toast("Não foi possível identificar o encarregado deste endereço.");
    return;
  }
  const button = document.querySelector("[data-save-delivery-address]");
  if (button) button.disabled = true;
  try {
    const saved = await createDeliveryAddress({ leaderId: user.id, label, addressLine, reference });
    leaderAddressFormOpen = false;
    await refreshData();
    const select = document.querySelector("#request-delivery-address");
    if (select) select.value = saved.id;
    toast("Endereço salvo para próximas entregas.");
  } catch (error) {
    console.error(error);
    toast(`Não foi possível salvar o endereço: ${error.message}`);
  } finally {
    if (button) button.disabled = false;
  }
}

async function handleProfileSettingsSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    await updateCurrentProfile({
      name: form.get("name"),
      team: form.get("team")
    });
    await refreshData();
    toast("Configurações salvas.");
  } catch (error) {
    console.error(error);
    toast(`Não foi possível salvar os dados: ${error.message}`);
  } finally {
    if (button) button.disabled = false;
  }
}

async function handlePasswordSettingsSubmit(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const password = String(form.get("password") ?? "");
  const passwordConfirm = String(form.get("passwordConfirm") ?? "");
  if (password !== passwordConfirm) {
    toast("As senhas não conferem.");
    return;
  }
  if (password.length < 8) {
    toast("A senha precisa ter pelo menos 8 caracteres.");
    return;
  }
  const targetUser = getActiveUser(state);
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    await updateUserPassword(password, targetUser?.id);
    formElement.reset();
    toast("Senha alterada com sucesso.");
  } catch (error) {
    toast(`Não foi possível alterar a senha: ${error.message}`);
  } finally {
    if (button) button.disabled = false;
  }
}

async function handleMealPriceSettingsSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    await updateDefaultMealUnitPrice(form.get("unitPrice"));
    await refreshData();
    toast("Preco unico atualizado.");
  } catch (error) {
    console.error(error);
    toast(`Não foi possível salvar o preco: ${error.message}`);
  } finally {
    if (button) button.disabled = false;
  }
}

async function handleWorkSectionSubmit(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    await saveWorkSection({
      id: String(form.get("id") ?? "") || null,
      name: form.get("name"),
      headcount: form.get("headcount"),
      leaderId: String(form.get("leaderId") ?? "") || null,
      active: form.get("active") === "true"
    });
    if (!form.get("id")) formElement.reset();
    await refreshData();
    toast("Equipe/trecho salvo.");
  } catch (error) {
    console.error(error);
    toast(`Nao foi possivel salvar a equipe: ${error.message}`);
  } finally {
    if (button) button.disabled = false;
  }
}

async function handleMealCatalogSubmit(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    await saveMealTypeCatalog({
      id: String(form.get("id") ?? "") || null,
      name: form.get("name"),
      description: form.get("description"),
      unitPrice: form.get("unitPrice"),
      active: form.get("active") === "true"
    });
    if (!form.get("id")) formElement.reset();
    await refreshData();
    toast("Tipo de alimentacao salvo.");
  } catch (error) {
    console.error(error);
    toast(`Não foi possível salvar o tipo: ${error.message}`);
  } finally {
    if (button) button.disabled = false;
  }
}

async function handleMealCatalogDelete(id) {
  const meal = state.mealCatalog.find((item) => item.id === id);
  if (!meal) return;
  const button = root.querySelector(`[data-delete-meal-type="${id}"]`);
  if (button) button.disabled = true;
  try {
    await saveMealTypeCatalog({
      id: meal.id,
      name: meal.label,
      description: meal.description,
      unitPrice: meal.unitPrice,
      active: false
    });
    await refreshData();
    toast("Tipo removido dos novos pedidos.");
  } catch (error) {
    console.error(error);
    toast(`Não foi possível remover o tipo: ${error.message}`);
  } finally {
    if (button) button.disabled = false;
  }
}

async function handleAccessInviteSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    const token = generateInviteToken();
    await createAccessInvite({
      token,
      role: form.get("role"),
      email: form.get("email"),
      team: form.get("team"),
      expiresInDays: form.get("expiresInDays")
    });
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("invite", token);
    generatedInviteLink = url.toString();
    render();
    toast("Link privado gerado.");
  } catch (error) {
    console.error(error);
    toast(`Não foi possível gerar o convite: ${error.message}`);
  } finally {
    if (button) button.disabled = false;
  }
}

async function copyGeneratedInviteLink() {
  if (!generatedInviteLink) return;
  try {
    await navigator.clipboard.writeText(generatedInviteLink);
    toast("Link copiado.");
  } catch {
    toast("Não foi possível copiar automaticamente. Selecione o link na tela.");
  }
}

async function cancelRequest(id, confirmed = false) {
  const request = state.requests.find((item) => item.id === id);
  if (!request || !canEditRequest(state, request)) return;
  if (!confirmed) {
    pendingCancelRequestId = id;
    render();
    return;
  }
  try {
    await changeRequestStatus(id, "cancelado");
    await refreshData();
    operationNotice = { title: "Pedido cancelado", message: "O pedido foi removido da operação e nao entrara no proximo envio ao fornecedor." };
    render();
  } catch (error) {
    console.error(error);
    toast(`Não foi possível cancelar: ${error.message}`);
  }
}

async function duplicateForEdit(id) {
  const request = state.requests.find((item) => item.id === id);
  if (!request) return;
  if (!canEditRequest(state, request)) {
    toast("Este pedido nao pode mais ser editado porque o fornecedor ja confirmou ou a operacao foi encerrada.");
    return;
  }
  adminRequestDetailId = null;
  editingRequestId = id;
  render();
}

function openAdminRequestDetail(id) {
  const request = state.requests.find((item) => item.id === id);
  if (!request) return;
  adminRequestDetailId = id;
  render();
}

async function handleEditRequestSubmit(event) {
  event.preventDefault();
  const request = state.requests.find((item) => item.id === editingRequestId);
  if (!request) return;
  if (!canEditRequest(state, request)) {
    editingRequestId = null;
    render();
    toast("Edicao bloqueada: o fornecedor ja confirmou este pedido.");
    return;
  }
  const form = new FormData(event.currentTarget);
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    assertMealDateIsNotPast(form.get("date"));
    await updateMealRequest(request.id, {
      date: form.get("date"),
      quantity: form.get("quantity"),
      mealTypeId: form.get("mealTypeId"),
      locationId: form.get("locationId"),
      teamId: form.get("teamId"),
      notes: form.get("notes")
    });
    editingRequestId = null;
    await refreshData();
    toast("Pedido atualizado.");
  } catch (error) {
    console.error(error);
    toast(`Não foi possível atualizar o pedido: ${error.message}`);
  } finally {
    if (button) button.disabled = false;
  }
}

async function sendConsolidation() {
  const date = activeDate();
  const supplierId = document.querySelector("[data-supplier-id]")?.value;
  if (!supplierId) {
    toast("Cadastre e selecione um fornecedor.");
    return;
  }
  try {
    await sendDailyConsolidation(date, supplierId);
    await refreshData();
    toast("Fornecedor notificado com o pedido.");
  } catch (error) {
    console.error(error);
    toast(`Não foi possível enviar: ${error.message}`);
  }
}

async function sendConsolidationForDate(date) {
  const consolidation = getConsolidationForDate(state, date);
  const supplierId = consolidation?.supplierId ?? getSuppliers(state)[0]?.id;
  if (!supplierId) {
    state.activeView = "pedidos";
    persist("Selecione um fornecedor para enviar este pedido.");
    return;
  }
  try {
    await sendDailyConsolidation(date, supplierId);
    await refreshData();
    toast("Pedido enviado ao fornecedor.");
  } catch (error) {
    console.error(error);
    toast(`Não foi possível enviar: ${error.message}`);
  }
}

async function supplierStep(id, step) {
  if (step === "saiu_entrega") {
    pendingActualsConsolidationId = id;
    render();
    return;
  }
  try {
    await confirmSupplierStep(id, step);
    await refreshData();
    operationNotice = { title: STATUS_LABEL[step] ?? "Etapa confirmada", message: "Confirmacao registrada com data e hora. A operação foi atualizada para todos os envolvidos." };
    render();
  } catch (error) {
    console.error(error);
    toast(`Não foi possível confirmar: ${error.message}`);
  }
}

async function generateSupplierRomaneio(consolidationId) {
  const consolidation = state.consolidations.find((item) => item.id === consolidationId);
  if (!consolidation) return;
  if (!exportSupplierRomaneio(state, consolidation)) {
    toast("Permita a abertura de janela para gerar o romaneio.");
    return;
  }
  try {
    await logSupplierRomaneio(consolidationId);
  } catch (error) {
    console.warn("Não foi possível registrar a geração do romaneio.", error);
  }
}

async function uploadSupplierDocument(consolidationId, file) {
  if (!file) return;
  try {
    await uploadSupplierInvoice(consolidationId, file);
    await refreshData();
    toast("Nota fiscal anexada ao pedido.");
  } catch (error) {
    console.error(error);
    toast(`Não foi possível anexar o PDF: ${error.message}`);
  }
}

async function downloadSupplierDocument(documentId) {
  const documentItem = state.consolidationDocuments.find((item) => item.id === documentId);
  if (!documentItem) return;
  try {
    const url = await getSupplierDocumentUrl(documentItem.storagePath);
    window.open(url, "_blank", "noopener");
  } catch (error) {
    console.error(error);
    toast(`Não foi possível abrir o documento: ${error.message}`);
  }
}

async function downloadDailyReport(reportDate, type) {
  const report = state.dailyReports.find((item) => item.date === reportDate);
  if (!report) {
    toast("O relatorio diario ainda nao esta disponivel.");
    return;
  }
  try {
    if (type === "xlsx") {
      await exportDailyReportExcel(state, report);
      toast("Excel do relatorio diario preparado.");
      return;
    }
    if (!exportDailyReportPdf(state, report)) {
      toast("Permita a abertura de janela para gerar o PDF.");
      return;
    }
    toast("PDF do relatorio diario preparado.");
  } catch (error) {
    console.error(error);
    toast(`Nao foi possivel baixar o relatorio diario: ${error.message}`);
  }
}

async function handleExport(type) {
  if (state.activeView === "auditoria") {
    handleAuditExport(type);
    return;
  }
  const date = activeDate();
  const rows = state.activeView === "relatorios"
    ? getReportRows()
    : state.requests.filter((request) => {
      const leader = document.querySelector("[data-filter-leader]")?.value ?? "";
      const meal = document.querySelector("[data-filter-meal]")?.value ?? "";
      return (!date || request.date === date) && (!leader || request.leaderId === leader) && (!meal || request.mealType === meal);
    });
  const consolidation = getConsolidationForDate(state, date);
  if (type === "xlsx" && state.activeView === "pedidos") {
    exportOrdersExcel(state, rows, { periodLabel: getRowsPeriodLabel(rows, "Pedidos") });
  } else if (type === "xlsx" && state.activeView === "relatorios") {
    exportMeasurementExcel(state, rows, { periodLabel: getReportPeriodLabel(), filter: normalizeReportFilter(reportFilter) });
  } else if (type === "xlsx") {
    exportExcel(state, rows);
  }
  if (type === "doc") exportWord(state, consolidation);
  const popupOpened = type === "pdf" && state.activeView === "pedidos"
    ? exportOrdersPdf(state, rows, { periodLabel: getRowsPeriodLabel(rows, "Pedidos") })
    : type === "pdf" && state.activeView === "relatorios"
      ? exportMeasurementPdf(state, rows, { periodLabel: getReportPeriodLabel(), filter: normalizeReportFilter(reportFilter) })
      : type === "pdf"
        ? exportPdf(state, consolidation)
        : true;
  if (!popupOpened) {
    toast("Permita a abertura de janela para gerar o PDF.");
    return;
  }
  toast("Exportacao preparada.");
}

function handleKpiExport() {
  const rows = getReportRows();
  if (!exportKpiPdf(state, rows, "KPIs operacionais")) {
    toast("Permita a abertura de janela para gerar o PDF de KPI.");
    return;
  }
  toast("KPI em PDF preparado.");
}

function getRowsPeriodLabel(rows, prefix = "Periodo") {
  const dates = rows.map((request) => request.date).filter(Boolean).sort();
  if (!dates.length) return `${prefix} vazio`;
  const first = formatDate(dates[0]);
  const last = formatDate(dates.at(-1));
  return first === last ? `${prefix} ${first}` : `${prefix} ${first} a ${last}`;
}

function handleFinanceExport(mode) {
  const rows = mode === "fornecedor"
    ? supplierConsolidations().flatMap((consolidation) => getConsolidationSummary(state, consolidation).rows)
    : state.requests.filter((request) => request.status !== "cancelado");
  if (!exportFinancialPdf(state, rows, mode === "fornecedor" ? "Financeiro do fornecedor" : "Financeiro administrativo")) {
    toast("Permita a abertura de janela para gerar o PDF.");
  }
}

function handleAuditExport(type = "pdf") {
  if (type === "xlsx") {
    exportAuditExcel(state);
    toast("Excel de auditoria preparado.");
    return;
  }
  if (!exportAuditPdf(state)) {
    toast("Permita a abertura de janela para gerar o PDF de auditoria.");
    return;
  }
  toast("PDF de auditoria preparado.");
}

async function ensureYesterdayDailyReport(profile) {
  if (profile?.role !== "admin") return;
  const reportDate = previousLocalDateKey();
  if (!reportDate || dailyReportGenerationDate === reportDate) return;
  if (state.dailyReports.some((report) => report.date === reportDate)) return;
  dailyReportGenerationDate = reportDate;
  try {
    await generateDailyReport(reportDate);
    const data = await fetchApplicationData();
    mapApplicationData(data, profile);
    render();
    toast("Relatorio diario automatico gerado.");
  } catch (error) {
    console.error("Nao foi possivel gerar o relatorio diario.", error);
    toast(`Nao foi possivel gerar o relatorio diario: ${error.message}`);
  }
}

async function handleActualsSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const consolidationId = String(form.get("consolidationId") ?? "");
  const actuals = [];
  for (const [key, value] of form.entries()) {
    if (!key.startsWith("quantity-")) continue;
    const index = key.replace("quantity-", "");
    actuals.push({
      team_id: form.get(`teamId-${index}`),
      meal_type_id: form.get(`mealTypeId-${index}`),
      quantity: Number(value ?? 0)
    });
  }
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    await saveConsolidationActuals(consolidationId, actuals);
    await confirmSupplierStep(consolidationId, "saiu_entrega");
    pendingActualsConsolidationId = null;
    await refreshData();
    operationNotice = { title: "Saida registrada", message: "Consumo real salvo e bloco diario concluido para os indicadores." };
    render();
  } catch (error) {
    console.error(error);
    toast(`Nao foi possivel salvar o consumo real: ${error.message}`);
  } finally {
    if (button) button.disabled = false;
  }
}

function locationOptions(mealTypeId, selectedLocationId = "") {
  const meal = state.mealTypes.find((item) => item.id === mealTypeId) ?? state.mealTypes[0];
  return (meal?.locations ?? [])
    .map((location) => `<option value="${location.id}" ${location.id === selectedLocationId ? "selected" : ""}>${location.name}</option>`)
    .join("");
}

function normalizeEmail(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[\s\u200B-\u200D\uFEFF]/g, "")
    .replace(/[^\x21-\x7E]/g, "")
    .toLowerCase();
}

function generateInviteToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mapApplicationData(data, profile) {
  const previousActiveUserId = state.activeUserId;
  state.users = data.profiles.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    role: item.role,
    team: item.team ?? "",
    active: item.active
  }));
  const mappedCatalog = data.catalog
    .map((item) => ({
      id: item.id,
      label: item.name,
      description: item.description ?? "",
      unitPrice: Number(item.unit_price ?? data.settings?.default_meal_unit_price ?? 0),
      active: item.active,
      locations: (item.meal_locations ?? [])
        .filter((location) => location.active)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((location) => ({ id: location.id, name: location.name }))
    }));
  state.mealCatalog = mappedCatalog;
  state.mealTypes = mappedCatalog.filter((item) => item.active);
  state.workSections = (data.workSections?.length ? data.workSections.map((item) => ({
    id: item.id,
    name: item.name,
    headcount: Number(item.headcount ?? 0),
    leaderId: item.leader_id,
    active: item.active,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  })) : state.users
    .filter((item) => item.role === "encarregado")
    .map((item) => ({
      id: item.id,
      name: item.team || item.name,
      headcount: 0,
      leaderId: item.id,
      active: true,
      derived: true
    })));
  state.requests = data.requests.map((item) => ({
    id: item.id,
    date: item.meal_date,
    mealTypeId: item.meal_type_id,
    mealType: item.meal_types?.name ?? "",
    mealDescription: item.meal_types?.description ?? "",
    unitPrice: Number(item.meal_types?.unit_price ?? data.settings?.default_meal_unit_price ?? 0),
    locationId: item.location_id,
    location: item.meal_locations?.name ?? "",
    teamId: item.team_id ?? "",
    sectionName: item.work_sections?.name ?? item.meal_locations?.name ?? "",
    sectionHeadcount: Number(item.work_sections?.headcount ?? 0),
    deliveryAddressId: item.delivery_address_id,
    deliveryAddress: item.delivery_addresses?.label ?? "",
    deliveryAddressLine: item.delivery_addresses?.address_line ?? "",
    leaderId: item.leader_id,
    quantity: item.quantity,
    status: item.status,
    notes: item.notes ?? "",
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));
  state.consolidations = data.consolidations.map((item) => ({
    id: item.id,
    date: item.meal_date,
    supplierId: item.supplier_id,
    status: item.status,
    sentAt: item.sent_at,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    requestIds: (item.consolidation_items ?? []).map((row) => row.meal_request_id),
    confirmations: [
      ...(item.sent_at ? [{
        step: "enviado",
        userId: item.created_by,
        at: item.sent_at
      }] : []),
      ...(item.supplier_confirmations ?? []).map((row) => ({
        step: row.step,
        userId: row.confirmed_by,
        at: row.confirmed_at,
        metadata: row.metadata
      }))
    ],
    revisions: (item.consolidation_revisions ?? []).map((row) => ({
      id: row.id,
      userId: row.edited_by,
      at: row.edited_at,
      reason: row.reason,
      snapshot: row.snapshot
    }))
  }));
  state.consolidationActuals = (data.actuals ?? []).map((item) => ({
    id: item.id,
    consolidationId: item.consolidation_id,
    date: item.meal_date,
    teamId: item.team_id,
    mealTypeId: item.meal_type_id,
    quantity: Number(item.quantity ?? 0),
    notes: item.notes ?? "",
    recordedBy: item.recorded_by,
    recordedAt: item.recorded_at
  }));
  state.dailyReports = (data.reports ?? []).map((item) => ({
    id: item.id,
    date: item.report_date,
    status: item.status,
    totals: item.totals ?? {},
    snapshot: item.snapshot ?? {},
    items: item.snapshot?.items ?? item.snapshot?.rows ?? item.snapshot?.requests ?? [],
    rows: item.snapshot?.rows ?? item.snapshot?.items ?? item.snapshot?.requests ?? [],
    generatedAt: item.generated_at,
    generatedBy: item.generated_by
  }));
  state.auditLog = data.audit.map((item) => ({
    id: item.id,
    action: item.action,
    entity: item.entity,
    entityId: item.entity_id,
    payload: item.payload,
    userId: item.actor_id,
    at: item.created_at
  }));
  state.consolidationDocuments = data.documents.map((item) => ({
    id: item.id,
    consolidationId: item.consolidation_id,
    type: item.document_type,
    storagePath: item.storage_path,
    originalName: item.original_name,
    mimeType: item.mime_type,
    sizeBytes: item.size_bytes,
    uploadedBy: item.uploaded_by,
    createdAt: item.created_at
  }));
  state.deliveryAddresses = data.addresses.map((item) => ({
    id: item.id,
    leaderId: item.leader_id,
    label: item.label,
    addressLine: item.address_line,
    reference: item.reference ?? "",
    active: item.active,
    createdAt: item.created_at
  }));
  state.deliveryAddressFeatureAvailable = data.addressFeatureAvailable;
  state.settings = {
    cutoffTime: String(data.settings.cutoff_time).slice(0, 5),
    supplierName: data.settings.supplier_name,
    defaultMealUnitPrice: Number(data.settings.default_meal_unit_price ?? 0),
    defaultMealDate: localDateKey(),
    occupancyTarget: Number(data.settings.occupancy_target ?? 100),
    notificationChannel: data.settings.notification_channel,
    offlineSyncEnabled: data.settings.offline_sync_enabled
  };
  state.authenticatedUserId = profile.id;
  const canKeepRepresentedUser = profile.role === "admin"
    && state.users.some((item) => item.id === previousActiveUserId && item.active !== false);
  state.activeUserId = canKeepRepresentedUser ? previousActiveUserId : profile.id;
  state.loading = false;
}

async function refreshData({ silent = false } = {}) {
  if (isRefreshing) return;
  isRefreshing = true;
  try {
    const user = await getAuthenticatedUser();
    if (!user) return;
    const profile = await fetchProfile(user.id);
    if (!profile.active) throw new Error("Este usuario esta desativado.");
    const data = await fetchApplicationData();
    mapApplicationData(data, profile);
    render();
    await ensureYesterdayDailyReport(profile);
  } catch (error) {
    console.error(error);
    state.loading = false;
    render();
    if (!silent) toast(`Erro ao carregar dados: ${error.message}`);
  } finally {
    isRefreshing = false;
  }
}

async function bootstrapAuthenticatedApp() {
  state.loading = true;
  render();
  await refreshData();
  if (!realtimeChannel) {
    realtimeChannel = subscribeToChanges(() => refreshData({ silent: true }));
  }
}

async function bootstrapApp() {
  if (!isSupabaseConfigured) {
    state.loading = false;
    renderLogin();
    return;
  }
  try {
    const session = await getSession();
    if (!session) {
      state.loading = false;
      renderLogin();
      return;
    }
    await bootstrapAuthenticatedApp();
  } catch (error) {
    console.error(error);
    state.loading = false;
    renderLogin();
    toast(`Falha ao iniciar: ${error.message}`);
  }
}

window.addEventListener("online", () => {
  toast("Conexao restaurada.");
  refreshData({ silent: true });
});
window.addEventListener("offline", render);

if ("serviceWorker" in navigator && !import.meta.env.DEV) {
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}service-worker.js`).catch(() => {
    console.warn("Service worker indisponivel neste ambiente.");
  });
}

if ("serviceWorker" in navigator && import.meta.env.DEV) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
  caches.keys().then((keys) => {
    keys
      .filter((key) => key.startsWith("alimenta-obra-"))
      .forEach((key) => caches.delete(key));
  });
}

supabase?.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT" || !session) {
    state = { ...createEmptyState(), loading: false };
    renderLogin();
  }
});

bootstrapApp();
