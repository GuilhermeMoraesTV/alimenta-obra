import { exportCsv, exportExcel, exportFinancialPdf, exportPdf, exportSupplierRomaneio, exportWord } from "./services/exports.js";
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
  getAuthenticatedUser,
  getSupplierDocumentUrl,
  getSession,
  logSupplierRomaneio,
  removeSubscription,
  saveMealTypeCatalog,
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

const root = document.querySelector("#app-root");
const toastRoot = document.querySelector("#toast-root");
const initialInviteToken = new URLSearchParams(window.location.search).get("invite") ?? "";

let loginMode = initialInviteToken ? "register" : "login";
let supplierOrderStatus = "ativos";
let supplierOrderDate = "";
let selectedSupplierConsolidationId = null;

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
  return document.querySelector("[data-filter-date]")?.value || state.settings.defaultMealDate;
}

function setView(view) {
  adminRequestDetailId = null;
  exportMenuOpen = null;
  state.activeView = view;
  persist();
}

function render() {
  if (state.loading) {
    root.innerHTML = `<section class="app-loader" aria-live="polite"><div class="app-loader-brand"><span class="brand-mark">AO</span><span class="brand-name">Alimenta<span>Obra</span></span></div><div class="app-loader-progress" aria-hidden="true"><i></i></div><p>Preparando sua operação</p></section>`;
    return;
  }
  const user = getActiveUser(state);
  if (!user) {
    renderLogin();
    return;
  }
  const allowedViews = [...NAV_BY_ROLE[user.role].map(([view]) => view), "configuracoes"];
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
  bindEvents();
}

function renderLogin() {
  root.innerHTML = renderLoginScreen({ initialInviteToken, isSupabaseConfigured, loginMode });
  bindEvents();
}

function renderNav(user) {
  const adminMoreViews = ["financeiro", "relatorios", "auditoria", "configuracoes"];
  return NAV_BY_ROLE[user.role].map(([view, iconName, label]) => `
    <button class="${state.activeView === view || (view === "mais" && adminMoreViews.includes(state.activeView)) ? "active" : ""}" data-view="${view}">
      <span class="nav-icon">${icon(iconName, 18)}</span>
      <span>${label}</span>
    </button>`).join("");
}

function renderAdminBackButton() {
  const user = getActiveUser(state);
  if (user?.role !== "admin") return "";
  return `<button class="btn outline small admin-back-button" data-view="mais">${icon("arrow", 15)}Voltar</button>`;
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
    <section class="access-switcher ${isRepresentingUser ? "is-representing" : ""}">
      <div>
        <span class="eyebrow">${isRepresentingUser ? "Modo de acesso ativo" : "Acesso administrativo"}</span>
        <strong>${isRepresentingUser ? `Voce esta acessando como ${user.name}` : "Escolha qual usuario deseja acessar"}</strong>
        <small>A identidade autenticada continua sendo ${authenticatedUser.name}; todas as acoes permanecem rastreaveis.</small>
      </div>
      <div class="access-switcher-controls">
        <label for="access-user">Usuario</label>
        <select id="access-user" data-access-user>${options}</select>
        ${isRepresentingUser ? `<button class="btn outline small" type="button" data-action="return-admin">Voltar ao administrador</button>` : ""}
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
  // As telas comecam pelo conteudo operativo, sem banner de apresentacao.
  return "";
}

function renderEditRequestModal() {
  const request = state.requests.find((item) => item.id === editingRequestId);
  if (!request) return "";
  const user = getActiveUser(state);
  const addresses = state.deliveryAddresses.filter((address) => address.leaderId === user?.id && address.active !== false);
  const addressOptions = `<option value="">Selecione um endereco</option>${addresses.map((address) => `<option value="${address.id}" ${address.id === request.deliveryAddressId ? "selected" : ""}>${address.label} · ${address.addressLine}</option>`).join("")}`;
  return `<div class="request-edit-backdrop" data-close-edit-modal><section class="request-edit-modal" role="dialog" aria-modal="true" aria-labelledby="edit-request-title" onclick="event.stopPropagation()"><header><div><span class="eyebrow">Edicao de pedido</span><h2 id="edit-request-title">Atualizar solicitacao</h2><p>As alteracoes serao aplicadas ao pedido ja registrado.</p></div><button class="modal-close" type="button" data-close-edit-modal aria-label="Fechar">×</button></header><form data-form="edit-request"><div class="form-grid"><div class="field"><label for="edit-request-date">Data da refeicao</label><input id="edit-request-date" name="date" type="date" value="${request.date}" required /></div><div class="field"><label for="edit-request-quantity">Quantidade</label><input id="edit-request-quantity" name="quantity" type="number" min="1" value="${request.quantity}" required /></div></div><div class="form-grid"><div class="field"><label for="edit-request-meal">Tipo de refeicao</label><select id="edit-request-meal" name="mealTypeId" data-edit-meal>${state.mealTypes.map((meal) => `<option value="${meal.id}" ${meal.id === request.mealTypeId ? "selected" : ""}>${meal.label}</option>`).join("")}</select></div><div class="field"><label for="edit-request-location">Local operacional</label><select id="edit-request-location" name="locationId">${locationOptions(request.mealTypeId, request.locationId)}</select></div></div>${state.deliveryAddressFeatureAvailable ? `<div class="field"><label for="edit-request-address">Endereco de entrega</label><select id="edit-request-address" name="deliveryAddressId" required>${addressOptions}</select></div>` : ""}<div class="field"><label for="edit-request-notes">Observacao</label><textarea id="edit-request-notes" name="notes">${request.notes}</textarea></div><footer><button class="btn outline" type="button" data-close-edit-modal>Cancelar</button><button class="btn primary" type="submit">Salvar alteracoes</button></footer></form></section></div>`;
}

function renderOperationModal() {
  const request = state.requests.find((item) => item.id === pendingCancelRequestId);
  if (request) return `<div class="operation-backdrop"><section class="operation-modal confirm"><span class="operation-icon danger">${icon("trash", 23)}</span><span class="eyebrow">Confirmar cancelamento</span><h2>Cancelar este pedido?</h2><p>O pedido de ${request.quantity} refeicoes para ${formatDate(request.date)} sera cancelado e nao entrara no envio ao fornecedor.</p><div><button class="btn outline" data-dismiss-operation>Voltar</button><button class="btn danger" data-confirm-cancel="${request.id}">Cancelar pedido</button></div></section></div>`;
  if (operationNotice) return `<div class="operation-backdrop"><section class="operation-modal success"><span class="operation-icon">${icon("clipboard", 23)}</span><span class="eyebrow">Operacao registrada</span><h2>${operationNotice.title}</h2><p>${operationNotice.message}</p><button class="btn primary" data-dismiss-operation>Continuar</button></section></div>`;
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
  return `<section class="finance-page">${topbar(title, `Analise de ${month}`, `${!isSupplier ? renderAdminBackButton() : ""}<button class="btn primary" data-export-finance="${mode}">Gerar PDF</button>`)}<div class="finance-metrics"><article class="finance-metric accent"><span>${isSupplier ? "Faturamento previsto" : "Custo previsto"}</span><strong>${money(projected)}</strong><small>${sumQty(rows)} refeicoes no mes</small></article><article class="finance-metric"><span>${isSupplier ? "Faturado" : "Pago/entregue"}</span><strong>${money(deliveredValue)}</strong><small>${delivered.length} pedidos entregues</small></article><article class="finance-metric"><span>Em aberto</span><strong>${money(pendingValue)}</strong><small>pedidos ainda em operacao</small></article><article class="finance-metric"><span>Ticket medio</span><strong>${money(rows.length ? projected / sumQty(rows) : 0)}</strong><small>por refeicao</small></article></div><div class="finance-grid"><article class="finance-card"><h2>Composicao por refeicao</h2>${byMeal.map((item) => `<div class="finance-progress"><div><span>${item.label}</span><strong>${money(item.value)}</strong></div><i><b style="width:${Math.max(3, Math.round((item.value / max) * 100))}%"></b></i></div>`).join("") || `<div class="empty">Sem movimentacao no periodo.</div>`}</article><article class="finance-card"><h2>Evolucao dos ultimos 7 dias</h2><div class="finance-bars">${days.map((item) => `<div><strong>${item.value ? money(item.value).replace("R$", "") : "-"}</strong><i style="height:${Math.max(5, Math.round((item.value / dailyMax) * 126))}px"></i><span>${item.label}</span></div>`).join("")}</div></article></div><article class="finance-card finance-table-card"><h2>Movimentacoes do periodo</h2><div class="table-wrap"><table><thead><tr><th>Data</th><th>Tipo</th><th>Quantidade</th><th>Valor</th><th>Status</th></tr></thead><tbody>${rows.sort((a, b) => b.date.localeCompare(a.date)).map((request) => `<tr><td>${formatDate(request.date)}</td><td>${request.mealType}</td><td>${request.quantity}</td><td><strong>${money(requestValue(request))}</strong></td><td><span class="badge ${request.status}">${STATUS_LABEL[request.status]}</span></td></tr>`).join("")}</tbody></table></div></article></section>`;
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
        <button class="btn primary" data-view="consolidacao">${icon("truck", 16)}Enviar pedido</button>
      </header>
      <section class="admin-stats">
        <div class="stats-grid admin-metrics-grid admin-home-metrics">
          <div class="stat-card accent"><div class="stat-label">Total</div><div class="stat-value">${sumQty(rows)}</div><div class="stat-sub">refeicoes</div></div>
          <div class="stat-card"><div class="stat-label">A enviar</div><div class="stat-value">${waitingCount}</div><div class="stat-sub">aguardando</div></div>
          <div class="stat-card"><div class="stat-label">Entregas</div><div class="stat-value">${deliveredCount}</div><div class="stat-sub">realizadas</div></div>
          <div class="stat-card"><div class="stat-label">Custo</div><div class="stat-value">${money(totalCost)}</div><div class="stat-sub">estimado</div></div>
        </div>
      </section>
      ${renderAdminLiveOrders(rows)}
    </section>
    <div class="report-grid">
      <div class="insight-panel">
        <h2 class="section-title">Consumo recente</h2>
        <div class="chart">${[42, 65, 58, 71, 89, 94, 78, 88, 102, 115, 109, 130, sumQty(rows), 0].map((value, index) => `
          <div class="bar ${index === 12 ? "today" : ""}">
            <span style="height:${Math.max(4, Math.round((value / 140) * 150))}px"></span>
            <span>${index + 1}</span>
          </div>`).join("")}</div>
      </div>
    </div>`;
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
  const destination = request.deliveryAddress || request.location;
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
        <div><strong>${request.quantity}</strong><span>refeicoes</span></div>
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
      <strong>${request.mealType} · ${request.quantity} refeicoes</strong>
      <small>${getUserName(state, request.leaderId)} · ${request.deliveryAddress || request.location}</small>
      <b>${formatDateTime(request.updatedAt)}</b>
      </button>
      ${canEditRequest(state, request) ? `<button class="icon-action admin-live-send" data-send-request-date="${request.date}" aria-label="Enviar pedido ao fornecedor">${icon("truck", 15)}Enviar</button>` : ""}
    </article>`;
}

function renderAdminRequestDetailModal() {
  const request = state.requests.find((item) => item.id === adminRequestDetailId);
  if (!request) return "";
  const destination = request.deliveryAddress || request.location;
  const composition = requestMealDescription(request);
  return `
    <div class="request-detail-backdrop" data-close-request-detail>
    <section class="request-detail-modal" role="dialog" aria-modal="true" aria-labelledby="request-detail-title" onclick="event.stopPropagation()">
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
            <p>${request.quantity} refeicoes solicitadas${composition ? ` - ${escapeHtml(composition)}` : ""}</p>
          </div>
        </div>
        <div class="admin-request-detail-grid">
          <div><span>Encarregado</span><strong>${getUserName(state, request.leaderId)}</strong></div>
          <div><span>Entrega</span><strong>${destination}</strong></div>
          <div><span>Data</span><strong>${formatDate(request.date)}</strong></div>
          <div><span>Valor estimado</span><strong>${money(requestValue(request))}</strong></div>
        </div>
        <div class="admin-request-notes">
          <span>Observacao</span>
          <p>${request.notes || "Sem observacoes para este pedido."}</p>
        </div>
        ${composition ? `<div class="admin-request-notes"><span>Composicao</span><p>${escapeHtml(composition)}</p></div>` : ""}
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
        ${renderExportMenu("pedidos", [["csv", "CSV", "clipboard"], ["xlsx", "Excel", "chart"]])}
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
  const rows = state.requests.filter((request) => request.status !== "cancelado");
  const auditLast = state.auditLog[0];
  const shortcuts = [
    ["financeiro", "chart", "Financeiro", money(rows.reduce((sum, request) => sum + requestValue(request), 0)), "Custos previstos e realizados"],
    ["relatorios", "chart", "Relatorios", `${sumQty(rows)} refeicoes`, "Exportacoes e ranking por encarregado"],
    ["auditoria", "history", "Auditoria", auditLast ? formatDateTime(auditLast.at) : "Sem eventos", "Registro das acoes do sistema"],
    ["configuracoes", "settings", "Configuracoes", "Conta", "Dados do usuario e senha"]
  ];
  return `
    <section class="admin-more">
      <header class="admin-home-hero compact">
        <div>
          <span class="compact-kicker">Administracao</span>
          <h1>Mais ferramentas</h1>
          <p>Acesse as areas de consulta e ajustes sem deixar o rodape principal carregado.</p>
        </div>
      </header>
      <div class="admin-more-grid">
        ${shortcuts.map(([view, iconName, title, value, text]) => `
          <button class="admin-more-tile" data-view="${view}">
            <span>${icon(iconName, 20)}</span>
            <strong>${title}</strong>
            <b>${value}</b>
            <small>${text}</small>
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
        <p>${summary.total} refeicoes para ${formatDate(date)}</p>
      </div>
      <div class="admin-send-actions">
        ${renderExportMenu("consolidacao", [["doc", "Word", "clipboard"], ["pdf", "PDF", "chart"]])}
        <button class="btn primary small" data-action="send-consolidation">${icon("truck", 15)}Enviar</button>
      </div>
      <div class="admin-send-filters">
        <input type="date" value="${date}" data-filter-date aria-label="Data do pedido" />
        <select data-supplier-id aria-label="Fornecedor">
          ${suppliers.map((supplier) => `<option value="${supplier.id}" ${supplier.id === selectedSupplier ? "selected" : ""}>${supplier.name}</option>`).join("")}
        </select>
        <span class="badge ${consolidation.status}">${STATUS_LABEL[consolidation.status] ?? consolidation.status}</span>
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
        <div><span class="eyebrow">Operacao do fornecedor</span><h1>Visao de hoje</h1><p>Produza, despache e acompanhe cada pedido em tempo real.</p></div>
        <button class="btn outline" data-view="fornecedor-pedidos">Ver pedidos</button>
      </header>
      <div class="supplier-metrics-grid">
        ${renderSupplierMetric("Refeicoes do dia", totalToday, `para ${formatDate(state.settings.defaultMealDate)}`, "accent")}
        ${renderSupplierMetric("A confirmar", supplierStatusCount(rows, "enviado"), "pedidos recebidos")}
        ${renderSupplierMetric("Em producao", supplierStatusCount(rows, "confirmado") + supplierStatusCount(rows, "producao"), "em preparo")}
        ${renderSupplierMetric("Em rota", supplierStatusCount(rows, "saiu_entrega"), "aguardando entrega")}
        ${renderSupplierMetric("Entregues", supplierStatusCount(rows, "entregue"), "historico total")}
      </div>
      ${priority ? renderSupplierNextAction(priority) : renderSupplierEmptyState()}
      <section class="supplier-panel-card supplier-queue-card">
        <div class="supplier-section-heading"><div><span class="eyebrow">Fila operacional</span><h2>Pedidos prioritarios</h2></div><button class="text-action" data-view="fornecedor-pedidos">Ver todos ${icon("arrow", 15)}</button></div>
        <div class="supplier-queue">${activeRows.slice(0, 5).map(renderSupplierQueueRow).join("") || `<div class="empty">Nenhum pedido pendente no momento.</div>`}</div>
      </section>
    </section>`;
}

function renderSupplierEmptyState() {
  return `<section class="supplier-next-action is-empty"><span class="supplier-next-icon">${icon("package", 22)}</span><div><span class="eyebrow">Tudo em dia</span><h2>Sem acao pendente</h2><p>Quando o administrador enviar um consolidado, ele aparecera aqui.</p></div></section>`;
}

function renderSupplierNextAction(consolidation) {
  const summary = getConsolidationSummary(state, consolidation);
  const next = nextSupplierStep(consolidation.status);
  const foods = Object.entries(summary.byMeal).map(([meal, data]) => `${data.total} ${meal}`).join(" · ");
  const value = consolidationValue(consolidation);
  return `<section class="supplier-next-action">
    <span class="supplier-next-icon">${icon(consolidation.status === "saiu_entrega" ? "truck" : "clipboard", 22)}</span>
    <div class="supplier-next-copy"><span class="eyebrow">Proxima acao</span><h2>${supplierActionLabel(consolidation)}</h2><div class="supplier-next-order"><strong>${foods}</strong><span>Pedido ${consolidation.id.slice(0, 8).toUpperCase()}</span><span>${summary.total} refeicoes</span><span>${money(value)}</span><span>Entrega: ${formatDate(consolidation.date)}</span></div></div>
    <div class="supplier-next-actions"><button class="btn outline small" data-supplier-select="${consolidation.id}">Detalhes</button>${next ? `<button class="btn primary" data-step="${next.step}" data-id="${consolidation.id}">${next.label}</button>` : ""}</div>
  </section>`;
}

function renderSupplierQueueRow(consolidation) {
  const summary = getConsolidationSummary(state, consolidation);
  const foods = Object.entries(summary.byMeal).map(([meal, data]) => `${data.total} ${meal}`).join(" · ");
  return `<button class="supplier-queue-row" data-supplier-select="${consolidation.id}"><span><strong>${foods}</strong><small>Pedido ${consolidation.id.slice(0, 8).toUpperCase()} · ${summary.total} refeicoes · ${money(consolidationValue(consolidation))}</small></span><span class="supplier-queue-delivery">Entrega<br><b>${formatDate(consolidation.date)}</b></span><span class="badge ${consolidation.status}">${STATUS_LABEL[consolidation.status]}</span>${icon("arrow", 16)}</button>`;
}

function renderSupplierOrders() {
  const rows = supplierConsolidations().filter((item) => {
    const matchesStatus = supplierOrderStatus === "todos"
      || (supplierOrderStatus === "ativos" ? !["entregue", "rascunho"].includes(item.status) : item.status === supplierOrderStatus);
    return matchesStatus && (!supplierOrderDate || item.date === supplierOrderDate);
  });
  const selected = rows.find((item) => item.id === selectedSupplierConsolidationId) ?? rows[0] ?? null;
  return `<section class="supplier-workspace">
    ${topbar("Pedidos", "Fila de producao, entrega e acompanhamento")}
    <div class="filter-bar supplier-filter-bar"><select data-supplier-status><option value="ativos" ${supplierOrderStatus === "ativos" ? "selected" : ""}>Pedidos ativos</option><option value="todos" ${supplierOrderStatus === "todos" ? "selected" : ""}>Todos os pedidos</option><option value="enviado" ${supplierOrderStatus === "enviado" ? "selected" : ""}>A confirmar</option><option value="confirmado" ${supplierOrderStatus === "confirmado" ? "selected" : ""}>Em producao</option><option value="saiu_entrega" ${supplierOrderStatus === "saiu_entrega" ? "selected" : ""}>Em rota</option><option value="entregue" ${supplierOrderStatus === "entregue" ? "selected" : ""}>Entregues</option></select><input type="date" value="${supplierOrderDate}" data-supplier-date /><button class="btn outline small" data-supplier-clear-filter>Limpar filtros</button></div>
    <div class="supplier-orders-layout"><div class="supplier-order-list">${rows.map((item) => renderSupplierOrderListItem(item, item.id === selected?.id)).join("") || `<div class="empty">Nenhum pedido encontrado.</div>`}</div>${selected ? renderSupplierOrderDetail(selected) : `<div class="empty supplier-detail-empty">Selecione um pedido para ver os detalhes.</div>`}</div>
  </section>`;
}

function renderSupplierOrderListItem(consolidation, selected) {
  const summary = getConsolidationSummary(state, consolidation);
  const foods = Object.entries(summary.byMeal).map(([meal, data]) => `${data.total} ${meal}`).join(" · ");
  return `<button class="supplier-order-list-item ${selected ? "selected" : ""}" data-supplier-select="${consolidation.id}"><span class="badge ${consolidation.status}">${STATUS_LABEL[consolidation.status]}</span><strong>${foods}</strong><small>${summary.total} refeicoes · ${money(consolidationValue(consolidation))} · Entrega ${formatDate(consolidation.date)}</small></button>`;
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
  return `<article class="supplier-order-detail"><div class="supplier-detail-top"><div><span class="eyebrow">Pedido ${consolidation.id.slice(0, 8).toUpperCase()}</span><h2>${summary.total} refeicoes para ${formatDate(consolidation.date)}</h2></div><span class="badge ${consolidation.status}">${STATUS_LABEL[consolidation.status]}</span></div><div class="supplier-order-highlights"><div><span>Alimentacao</span><strong>${highlights}</strong></div><div><span>Quantidade</span><strong>${summary.total} refeicoes</strong></div><div><span>Valor do pedido</span><strong>${money(consolidationValue(consolidation))}</strong></div><div><span>Entrega prevista</span><strong>${formatDate(consolidation.date)}</strong></div></div>${compositions ? `<section class="supplier-composition"><h3>Composicao das marmitas</h3>${compositions}</section>` : ""}<div class="supplier-detail-actions"><button class="btn outline small" data-generate-romaneio="${consolidation.id}">Gerar nota de fornecimento</button>${next ? `<button class="btn primary" data-step="${next.step}" data-id="${consolidation.id}">${next.label}</button>` : ""}</div><div class="supplier-detail-grid"><section><h3>Itens consolidados</h3>${renderConsolidatedSummary(summary)}</section><section><h3>Rastreabilidade</h3>${renderConsolidationTimeline(consolidation)}</section></div><section class="supplier-origin-requests"><h3>Pedidos de origem</h3>${renderRequestTable(summary.rows, { showLeader: true, editable: false })}</section></article>`;
}

function renderSupplierHistory() {
  const rows = supplierConsolidations().filter((item) => item.status === "entregue");
  return `<section class="supplier-workspace">${topbar("Historico de entregas", "Pedidos concluidos pelo fornecedor")}<div class="supplier-history-list">${rows.map((item) => { const summary = getConsolidationSummary(state, item); const delivered = item.confirmations.find((confirmation) => confirmation.step === "entregue"); return `<article class="supplier-history-row"><div><span class="badge entregue">Entregue</span><h2>${formatDate(item.date)} · ${summary.total} refeicoes</h2><p>Concluido em ${formatDateTime(delivered?.at)}</p></div><div class="supplier-history-actions"><button class="btn outline small" data-generate-romaneio="${item.id}">Nota de fornecimento</button><button class="btn outline small" data-view="fornecedor-documentos">Documentos</button></div></article>`; }).join("") || `<div class="empty">Nenhuma entrega concluida ainda.</div>`}</div></section>`;
}

function renderSupplierDocuments() {
  const rows = supplierConsolidations();
  return `<section class="supplier-workspace">${topbar("Documentos", "Notas de fornecimento e notas fiscais anexadas")}<div class="supplier-documents-list">${rows.map((consolidation) => { const summary = getConsolidationSummary(state, consolidation); const docs = supplierDocuments(consolidation.id); return `<article class="supplier-document-card"><div class="supplier-document-title"><div><span class="eyebrow">${formatDate(consolidation.date)}</span><h2>Pedido ${consolidation.id.slice(0, 8).toUpperCase()}</h2><p>${summary.total} refeicoes · ${STATUS_LABEL[consolidation.status]}</p></div><button class="btn outline small" data-generate-romaneio="${consolidation.id}">Gerar nota</button></div><div class="supplier-document-body"><div><strong>Nota fiscal</strong><small>Anexe o PDF fiscal emitido fora do sistema.</small></div><label class="btn primary small supplier-upload-label">Anexar PDF<input type="file" accept="application/pdf" data-document-upload="${consolidation.id}" hidden /></label></div>${docs.length ? `<div class="supplier-attached-files">${docs.map((doc) => `<button class="supplier-file-row" data-download-document="${doc.id}">${icon("package", 16)}<span>${doc.originalName}</span><small>${formatDateTime(doc.createdAt)}</small></button>`).join("")}</div>` : `<div class="supplier-no-documents">Nenhuma nota fiscal anexada.</div>`}</article>`; }).join("") || `<div class="empty">Ainda nao ha pedidos para documentar.</div>`}</div></section>`;
}

function renderRelatorios() {
  const rows = state.requests.filter((request) => request.status !== "cancelado");
  const total = sumQty(rows);
  const byLeader = Object.entries(rows.reduce((acc, request) => {
    const leader = getUserName(state, request.leaderId);
    acc[leader] ??= 0;
    acc[leader] += Number(request.quantity);
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);
  return `
    ${topbar("Relatorios", "Diario, semanal, mensal e periodo personalizado", `
      ${renderAdminBackButton()}
      <button class="btn outline" data-export="csv">CSV</button>
      <button class="btn outline" data-export="xlsx">Excel</button>
    `)}
    <div class="filter-bar">
      <select data-report-range>
        <option value="day">Data</option>
        <option value="week">Semana</option>
        <option value="month">Mes</option>
        <option value="custom">Periodo personalizado</option>
      </select>
      <input type="date" value="${state.settings.defaultMealDate}" />
      <input type="date" value="${state.settings.defaultMealDate}" />
      <select>
        <option>Todos os encarregados</option>
        ${getLeaders(state).map((leader) => `<option>${leader.name}</option>`).join("")}
      </select>
    </div>
    <div class="stats-grid">
      <div class="stat-card accent"><div class="stat-label">Total</div><div class="stat-value">${total}</div><div class="stat-sub">refeicoes no periodo</div></div>
      <div class="stat-card"><div class="stat-label">Marmitas</div><div class="stat-value">${totalsByMeal(rows)["Marmita Campo"] ?? 0}</div></div>
      <div class="stat-card"><div class="stat-label">Almocos</div><div class="stat-value">${totalsByMeal(rows)["Buffer Almoco"] ?? 0}</div></div>
      <div class="stat-card"><div class="stat-label">Jantas</div><div class="stat-value">${totalsByMeal(rows).Jantar ?? 0}</div></div>
    </div>
    <div class="report-grid">
      <div class="table-panel">
        <h2 class="section-title">Historico completo</h2>
        ${renderRequestTable(rows, { showLeader: true, editable: false })}
      </div>
      <div class="insight-panel">
        <h2 class="section-title">Ranking por encarregado</h2>
        <table class="ranking-table"><tbody>${byLeader.map(([leader, qty], index) => `<tr><td>${index + 1}</td><td>${leader}</td><td><strong>${qty}</strong></td></tr>`).join("")}</tbody></table>
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
            <div class="timeline-body"><strong>${item.action}</strong><br>${getUserName(state, item.userId)} · ${formatDateTime(item.at)} · ${item.entity}</div>
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
            <th>Atualizacao</th>
            ${options.editable ? "<th>Acoes</th>" : ""}
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
    <div class="consolidated-row total-line"><span>Total geral</span><span>${summary.total} refeicoes</span></div>`;
}

function renderConsolidationTimeline(consolidation) {
  const steps = [
    ["enviado", "Enviado ao fornecedor"],
    ["confirmado", "Fornecedor confirmou recebimento"],
    ["producao", "Fornecedor confirmou producao"],
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
  root.querySelectorAll("input[name='mealTypeId']").forEach((input) => {
    input.addEventListener("change", () => {
      const select = document.querySelector("#request-location");
      if (select) select.innerHTML = locationOptions(input.value);
    });
  });
  root.querySelectorAll("[data-filter-date], [data-filter-leader], [data-filter-meal]").forEach((control) => {
    control.addEventListener("change", () => render());
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
  root.querySelectorAll("[data-form='meal-catalog']").forEach((form) => {
    form.addEventListener("submit", handleMealCatalogSubmit);
  });
  root.querySelector("[data-edit-meal]")?.addEventListener("change", (event) => {
    const location = root.querySelector("#edit-request-location");
    if (location) location.innerHTML = locationOptions(event.currentTarget.value);
  });
  root.querySelector("[data-action='send-consolidation']")?.addEventListener("click", sendConsolidation);
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
    supplierOrderStatus = "ativos";
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
  root.querySelectorAll("[data-export-finance]").forEach((button) => {
    button.addEventListener("click", () => handleFinanceExport(button.dataset.exportFinance));
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
    toast("Este usuario nao pode ser acessado.");
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
  const form = new FormData(event.currentTarget);
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    await validateAlimentaObraSchema();
    const email = normalizeEmail(form.get("email"));
    if (!isValidEmail(email)) {
      toast("Informe um e-mail valido, por exemplo nome@empresa.com.");
      return;
    }
    await signIn(email, String(form.get("password")));
    await bootstrapAuthenticatedApp();
    toast("Acesso realizado.");
  } catch (error) {
    console.error(error);
    toast("E-mail ou senha invalidos.");
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
  const submitter = event.submitter;
  if (submitter) submitter.disabled = true;
  const form = new FormData(event.currentTarget);
  const user = getActiveUser(state);
  const status = submitter?.value ?? "enviado";
  try {
    await createMealRequest({
      date: form.get("date"),
      mealTypeId: form.get("mealTypeId"),
      locationId: form.get("locationId"),
      deliveryAddressId: form.get("deliveryAddressId"),
      quantity: form.get("quantity"),
      status,
      notes: String(form.get("notes") ?? "")
    }, user.id);
    await refreshData();
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
    toast(`Nao foi possivel salvar: ${error.message}`);
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
    toast("Informe o nome e o endereco completo.");
    return;
  }
  if (!user?.id) {
    toast("Nao foi possivel identificar o encarregado deste endereco.");
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
    toast("Endereco salvo para proximas entregas.");
  } catch (error) {
    console.error(error);
    toast(`Nao foi possivel salvar o endereco: ${error.message}`);
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
    toast("Configuracoes salvas.");
  } catch (error) {
    console.error(error);
    toast(`Nao foi possivel salvar os dados: ${error.message}`);
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
    toast("As senhas nao conferem.");
    return;
  }
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    await updateUserPassword(password);
    formElement.reset();
    toast("Senha alterada com sucesso.");
  } catch (error) {
    toast(`Nao foi possivel alterar a senha: ${error.message}`);
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
    toast(`Nao foi possivel salvar o preco: ${error.message}`);
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
      active: form.get("active") === "true"
    });
    if (!form.get("id")) formElement.reset();
    await refreshData();
    toast("Tipo de alimentacao salvo.");
  } catch (error) {
    console.error(error);
    toast(`Nao foi possivel salvar o tipo: ${error.message}`);
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
    toast(`Nao foi possivel gerar o convite: ${error.message}`);
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
    toast("Nao foi possivel copiar automaticamente. Selecione o link na tela.");
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
    operationNotice = { title: "Pedido cancelado", message: "O pedido foi removido da operacao e nao entrara no proximo envio ao fornecedor." };
    render();
  } catch (error) {
    console.error(error);
    toast(`Nao foi possivel cancelar: ${error.message}`);
  }
}

async function duplicateForEdit(id) {
  const request = state.requests.find((item) => item.id === id);
  if (!request || !canEditRequest(state, request)) return;
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
  if (!request || !canEditRequest(state, request)) return;
  const form = new FormData(event.currentTarget);
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    await updateMealRequest(request.id, {
      date: form.get("date"),
      quantity: form.get("quantity"),
      mealTypeId: form.get("mealTypeId"),
      locationId: form.get("locationId"),
      deliveryAddressId: form.get("deliveryAddressId"),
      notes: form.get("notes")
    });
    editingRequestId = null;
    await refreshData();
    toast("Pedido atualizado.");
  } catch (error) {
    console.error(error);
    toast(`Nao foi possivel atualizar o pedido: ${error.message}`);
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
    toast("Fornecedor notificado com o pedido consolidado.");
  } catch (error) {
    console.error(error);
    toast(`Nao foi possivel enviar: ${error.message}`);
  }
}

async function sendConsolidationForDate(date) {
  const consolidation = getConsolidationForDate(state, date);
  const supplierId = consolidation?.supplierId ?? getSuppliers(state)[0]?.id;
  if (!supplierId) {
    state.activeView = "consolidacao";
    persist("Selecione um fornecedor para enviar este pedido.");
    return;
  }
  try {
    await sendDailyConsolidation(date, supplierId);
    await refreshData();
    toast("Pedido enviado ao fornecedor.");
  } catch (error) {
    console.error(error);
    toast(`Nao foi possivel enviar: ${error.message}`);
  }
}

async function supplierStep(id, step) {
  try {
    await confirmSupplierStep(id, step);
    await refreshData();
    operationNotice = { title: STATUS_LABEL[step] ?? "Etapa confirmada", message: "Confirmacao registrada com data e hora. A operacao foi atualizada para todos os envolvidos." };
    render();
  } catch (error) {
    console.error(error);
    toast(`Nao foi possivel confirmar: ${error.message}`);
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
    console.warn("Nao foi possivel registrar a geracao do romaneio.", error);
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
    toast(`Nao foi possivel anexar o PDF: ${error.message}`);
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
    toast(`Nao foi possivel abrir o documento: ${error.message}`);
  }
}

function handleExport(type) {
  const date = activeDate();
  const rows = state.requests.filter((request) => !date || request.date === date);
  const consolidation = getConsolidationForDate(state, date);
  if (type === "csv") exportCsv(state, rows);
  if (type === "xlsx") exportExcel(state, rows);
  if (type === "doc") exportWord(state, consolidation);
  if (type === "pdf") exportPdf(state, consolidation);
  toast("Exportacao preparada.");
}

function handleFinanceExport(mode) {
  const rows = mode === "fornecedor"
    ? supplierConsolidations().flatMap((consolidation) => getConsolidationSummary(state, consolidation).rows)
    : state.requests.filter((request) => request.status !== "cancelado");
  exportFinancialPdf(state, rows, mode === "fornecedor" ? "Financeiro do fornecedor" : "Financeiro administrativo");
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
      active: item.active,
      locations: (item.meal_locations ?? [])
        .filter((location) => location.active)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((location) => ({ id: location.id, name: location.name }))
    }));
  state.mealCatalog = mappedCatalog;
  state.mealTypes = mappedCatalog.filter((item) => item.active);
  state.requests = data.requests.map((item) => ({
    id: item.id,
    date: item.meal_date,
    mealTypeId: item.meal_type_id,
    mealType: item.meal_types?.name ?? "",
    mealDescription: item.meal_types?.description ?? "",
    locationId: item.location_id,
    location: item.meal_locations?.name ?? "",
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
    ]
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
    defaultMealDate: data.settings.default_meal_date ?? new Date().toISOString().slice(0, 10),
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
