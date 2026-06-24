import { exportCsv, exportExcel, exportFinancialPdf, exportPdf, exportSupplierRomaneio, exportWord } from "./services/exports.js";
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
  createDeliveryAddress,
  createMealRequest,
  fetchApplicationData,
  fetchProfile,
  getAuthenticatedUser,
  getSupplierDocumentUrl,
  getSession,
  logSupplierRomaneio,
  removeSubscription,
  sendDailyConsolidation,
  signIn,
  signOut,
  signUp,
  subscribeToChanges,
  updateMealRequest,
  uploadSupplierInvoice,
  validateAlimentaObraSchema
} from "./services/database.js";
import { isSupabaseConfigured, supabase } from "./services/supabase.js";

const uiState = loadUiState();
let state = { ...createEmptyState(), activeView: uiState.activeView ?? "inicio" };
let realtimeChannel = null;
let isRefreshing = false;
let leaderOrdersTab = "novo";
let leaderAddressFormOpen = false;
let editingRequestId = null;
let pendingCancelRequestId = null;
let operationNotice = null;

const root = document.querySelector("#app-root");
const toastRoot = document.querySelector("#toast-root");

const NAV_BY_ROLE = {
  encarregado: [
    ["inicio", "home", "Inicio"],
    ["pedido", "clipboard", "Pedidos"]
  ],
  admin: [
    ["painel", "dashboard", "Painel"],
    ["pedidos", "clipboard", "Pedidos"],
    ["consolidacao", "package", "Consolidacao"],
    ["financeiro", "chart", "Financeiro"],
    ["relatorios", "chart", "Relatorios"],
    ["auditoria", "history", "Auditoria"]
  ],
  fornecedor: [
    ["fornecedor", "dashboard", "Painel"],
    ["fornecedor-pedidos", "clipboard", "Pedidos"],
    ["fornecedor-historico", "history", "Historico"],
    ["fornecedor-documentos", "package", "Documentos"],
    ["fornecedor-financeiro", "chart", "Financeiro"]
  ]
};

const STATUS_LABEL = {
  rascunho: "Rascunho",
  enviado: "Enviado",
  confirmado: "Confirmado",
  producao: "Em producao",
  saiu_entrega: "Saiu para entrega",
  entregue: "Entregue",
  cancelado: "Cancelado"
};

let loginMode = "login";
let supplierOrderStatus = "ativos";
let supplierOrderDate = "";
let selectedSupplierConsolidationId = null;

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

function formatDate(date) {
  if (!date) return "-";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function activeDate() {
  return document.querySelector("[data-filter-date]")?.value || state.settings.defaultMealDate;
}

function setView(view) {
  state.activeView = view;
  persist();
}

function icon(name, size = 18) {
  const paths = {
    home: `<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/>`,
    clipboard: `<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5"/><path d="M9 10h6M9 14h6M9 18h4"/>`,
    dashboard: `<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>`,
    package: `<path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z"/><path d="M12 11v10"/>`,
    chart: `<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>`,
    history: `<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>`,
    truck: `<path d="M3 6h11v11H3zM14 10h4l3 4v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>`,
    plus: `<path d="M12 5v14M5 12h14"/>`,
    arrow: `<path d="M5 12h14M14 7l5 5-5 5"/>`,
    clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
    utensils: `<path d="M7 3v8M4 3v5c0 2 1.3 3 3 3s3-1 3-3V3M7 11v10M15 3v18M15 3c3 1 5 4 5 7h-5"/>`,
    map: `<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>`,
    users: `<circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 2.7-7 6-7s6 3 6 7"/><path d="M16 5a3 3 0 0 1 0 6M17 14c2.5.7 4 2.8 4 6"/>`,
    logout: `<path d="M10 4H4v16h6M14 8l4 4-4 4M8 12h10"/>`,
    edit: `<path d="m4 20 4.5-1 10-10-3.5-3.5-10 10L4 20Z"/><path d="m13.5 7 3.5 3.5"/>`,
    trash: `<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>`
  };
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] ?? paths.clipboard}</svg>`;
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
  const allowedViews = NAV_BY_ROLE[user.role].map(([view]) => view);
  if (!allowedViews.includes(state.activeView)) {
    state.activeView = allowedViews[0];
    saveUiState(state);
  }
  root.innerHTML = `
    <div class="mobile-header role-${user.role}">
      <div class="brand">
        <div class="brand-mark">AO</div>
        <div class="brand-name">Alimenta<span>Obra</span></div>
      </div>
      <button class="mobile-profile" data-action="logout" aria-label="Sair do sistema">
        <span>${initials(user.name)}</span>
        ${icon("logout", 17)}
      </button>
    </div>
    <div class="app-shell role-${user.role}">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">AO</div>
          <div class="brand-name">Alimenta<span>Obra</span></div>
        </div>
        <div class="profile-box">
          <div class="profile-avatar">${initials(user.name)}</div>
          <div class="role">${roleName(user.role)}</div>
          <div class="profile-name">${user.name}</div>
          <div class="page-subtitle">${user.team}</div>
        </div>
        <nav class="nav">${renderNav(user)}</nav>
        <div class="sidebar-footer">
          <div class="side-status">
            <span></span>
            <div>
              <strong>${navigator.onLine ? "Sistema online" : "Modo offline"}</strong>
              <small>${pendingSyncText()}</small>
            </div>
          </div>
          <button class="btn ghost sidebar-logout" data-action="logout">${icon("logout", 16)}<span>Sair do sistema</span></button>
        </div>
      </aside>
      <main class="main role-${user.role} view-${state.activeView}">
        ${renderAccessSwitcher(user)}
        ${renderWorkspaceIntro(user)}
        ${renderView(user)}
      </main>
    </div>
    <div class="sync-strip ${navigator.onLine ? "" : "offline"}">${navigator.onLine ? "Online" : "Offline"} · ${pendingSyncText()}</div>
    ${renderEditRequestModal()}
    ${renderOperationModal()}
  `;
  bindEvents();
}

function renderLogin() {
  root.innerHTML = `
    <section class="login-screen">
      <div class="login-showcase">
        <div class="login-hero">
          <div class="brand brand-large">
            <div class="brand-mark">AO</div>
            <div class="brand-name">Alimenta<span>Obra</span></div>
          </div>
          <h1>Pedidos de refeicao da obra em um fluxo so.</h1>
          <p>Encarregados solicitam, administracao consolida e fornecedor confirma cada etapa com rastreabilidade.</p>
          <div class="login-metrics">
            <div><strong>189</strong><span>refeicoes hoje</span></div>
            <div><strong>3</strong><span>etapas fornecedor</span></div>
            <div><strong>100%</strong><span>auditavel</span></div>
          </div>
          <div class="login-flow">
            <span>Solicitar</span>
            <span>Consolidar</span>
            <span>Produzir</span>
            <span>Entregar</span>
          </div>
        </div>
        <div class="login-card">
          <div class="login-tabs">
            <button class="${loginMode === "login" ? "active" : ""}" data-login-mode="login">Login</button>
            <button class="${loginMode === "cadastro" ? "active" : ""}" data-login-mode="cadastro">Cadastro</button>
          </div>
          ${loginMode === "login" ? renderLoginForm() : renderRegisterForm()}
        </div>
      </div>
    </section>
  `;
  bindEvents();
}

function renderLoginForm() {
  return `
    <div class="brand login-brand">
      <div class="brand-mark">AO</div>
      <div>
        <div class="brand-name">Entrar</div>
        <p class="login-subtitle">Entre com seu e-mail e senha.</p>
      </div>
    </div>
    ${!isSupabaseConfigured ? `<div class="empty">Configure o arquivo .env.local antes de entrar.</div>` : ""}
    <form data-form="login">
      <div class="field">
        <label for="login-email">E-mail</label>
        <input id="login-email" name="email" type="email" autocomplete="email" required />
      </div>
      <div class="field">
        <label for="login-pass">Senha</label>
        <input id="login-pass" name="password" type="password" autocomplete="current-password" minlength="8" required />
      </div>
      <button class="btn primary full" type="submit" ${isSupabaseConfigured ? "" : "disabled"}>Entrar no sistema</button>
    </form>`;
}

function renderRegisterForm() {
  return `
    <div class="brand login-brand">
      <div class="brand-mark">+</div>
      <div>
        <div class="brand-name">Criar acesso</div>
        <p class="login-subtitle">Novos cadastros entram como encarregado.</p>
      </div>
    </div>
    <form data-form="register">
      <div class="field">
        <label for="register-name">Nome completo</label>
        <input id="register-name" name="name" placeholder="Ex.: Carlos Almeida" required />
      </div>
      <div class="field">
        <label for="register-email">E-mail</label>
        <input id="register-email" name="email" type="email" placeholder="nome@obra.com" required />
      </div>
      <div class="field">
        <label for="register-team">Equipe / frente</label>
        <input id="register-team" name="team" placeholder="Frente Sul" required />
      </div>
      <div class="field">
        <label for="register-pass">Senha</label>
        <input id="register-pass" name="password" type="password" minlength="8" autocomplete="new-password" required />
      </div>
      <button class="btn primary full" type="submit" ${isSupabaseConfigured ? "" : "disabled"}>Criar conta</button>
    </form>`;
}

function renderNav(user) {
  return NAV_BY_ROLE[user.role].map(([view, iconName, label]) => `
    <button class="${state.activeView === view ? "active" : ""}" data-view="${view}">
      <span class="nav-icon">${icon(iconName, 18)}</span>
      <span>${label}</span>
    </button>`).join("");
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

function renderView(user) {
  const view = state.activeView;
  if (view === "inicio") return renderLeaderHome(user);
  if (view === "pedido") return renderPedido(user);
  if (view === "historico") return renderHistorico(user);
  if (view === "painel") return renderPainel();
  if (view === "pedidos") return renderPedidosAdmin();
  if (view === "consolidacao") return renderConsolidacao();
  if (view === "financeiro") return renderFinanceiro("admin");
  if (view === "relatorios") return renderRelatorios();
  if (view === "fornecedor") return renderFornecedor();
  if (view === "fornecedor-pedidos") return renderSupplierOrders();
  if (view === "fornecedor-historico") return renderSupplierHistory();
  if (view === "fornecedor-documentos") return renderSupplierDocuments();
  if (view === "fornecedor-financeiro") return renderFinanceiro("fornecedor");
  if (view === "auditoria") return renderAuditoria();
  return renderPedido(user);
}

function renderWorkspaceIntro(user) {
  // As telas comecam pelo conteudo operativo, sem banner de apresentacao.
  return "";
}

function topbar(title, subtitle, actions = "") {
  return `
    <div class="topbar">
      <div>
        <span class="eyebrow">${viewLabel(state.activeView)}</span>
        <h1 class="page-title">${title}</h1>
        <div class="page-subtitle">${subtitle}</div>
      </div>
      <div class="actions">${actions}</div>
    </div>`;
}

function renderCompactHeader(kicker, title, subtitle, actions = "") {
  return `
    <header class="compact-header">
      <div>
        <span class="compact-kicker">${kicker}</span>
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
      ${actions ? `<div class="compact-actions">${actions}</div>` : ""}
    </header>`;
}

function renderEmptyState(title, message, action = "") {
  return `
    <div class="leader-empty">
      <span class="leader-empty-icon">${icon("clipboard", 22)}</span>
      <strong>${title}</strong>
      <p>${message}</p>
      ${action}
    </div>`;
}

function leaderRequests(user, includeCancelled = true) {
  return state.requests
    .filter((request) => request.leaderId === user.id && (includeCancelled || request.status !== "cancelado"))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function renderLeaderHome(user) {
  const rows = leaderRequests(user);
  const activeRows = rows.filter((request) => request.status !== "cancelado");
  const mealDate = state.settings.defaultMealDate;
  const todayRows = activeRows.filter((request) => request.date === mealDate);
  const latest = rows[0];
  const firstName = String(user.name).split(" ")[0];
  return `
    <div class="leader-page leader-home">
      ${renderCompactHeader(
        "Area do encarregado",
        `Ola, ${firstName}.`,
        `${user.team || "Sua equipe"} · pedidos de refeicao organizados em um unico lugar.`,
        `<button class="btn primary leader-primary-action" data-view="pedido">${icon("plus", 17)}Novo pedido</button>`
      )}
      <section class="deadline-strip">
        <span class="deadline-icon">${icon("clock", 20)}</span>
        <div>
          <span>Prazo do proximo pedido</span>
          <strong>Ate ${state.settings.cutoffTime} do dia anterior</strong>
        </div>
        <span class="deadline-date">Refeicao em ${formatDate(mealDate)}</span>
      </section>
      <div class="leader-summary-grid">
        <article class="leader-summary primary">
          <span class="summary-icon">${icon("utensils", 20)}</span>
          <div><span>Refeicoes programadas</span><strong>${sumQty(todayRows)}</strong><small>para ${formatDate(mealDate)}</small></div>
        </article>
        <article class="leader-summary">
          <span class="summary-icon">${icon("clipboard", 20)}</span>
          <div><span>Pedidos ativos</span><strong>${activeRows.length}</strong><small>${countStatus(activeRows, "rascunho")} em rascunho</small></div>
        </article>
        <article class="leader-summary">
          <span class="summary-icon">${icon("users", 20)}</span>
          <div><span>Equipe</span><strong class="summary-text">${user.team || "Nao informada"}</strong><small>encarregado responsavel</small></div>
        </article>
      </div>
      <section class="latest-section">
        <div class="section-heading">
          <div><span class="compact-kicker">Acompanhamento</span><h2>Pedido mais recente</h2></div>
          <button class="text-action" data-orders-tab="historico" data-view="pedido">Ver todos ${icon("arrow", 15)}</button>
        </div>
        ${latest
          ? renderLeaderRequestCard(latest)
          : renderEmptyState(
              "Nenhum pedido por aqui",
              "Crie a primeira solicitacao de refeicao da sua equipe.",
              `<button class="btn primary small" data-view="pedido">${icon("plus", 15)}Criar pedido</button>`
            )}
      </section>
    </div>`;
}

function renderPedido(user) {
  const date = state.settings.defaultMealDate;
  const rows = leaderRequests(user);
  return `
    <div class="leader-page leader-orders">
      ${renderCompactHeader(
        "Operacao da equipe",
        "Pedidos",
        "Crie uma solicitacao ou acompanhe tudo o que ja foi enviado."
      )}
      <div class="orders-tabs" role="tablist" aria-label="Secoes de pedidos">
        <button class="${leaderOrdersTab === "novo" ? "active" : ""}" data-orders-tab="novo" role="tab" aria-selected="${leaderOrdersTab === "novo"}">${icon("plus", 16)}Novo pedido</button>
        <button class="${leaderOrdersTab === "historico" ? "active" : ""}" data-orders-tab="historico" role="tab" aria-selected="${leaderOrdersTab === "historico"}">${icon("history", 16)}Historico <span>${rows.length}</span></button>
      </div>
      ${leaderOrdersTab === "novo" ? renderLeaderRequestForm(user, date) : renderLeaderHistory(user, rows)}
    </div>`;
}

function renderLeaderRequestForm(user, date) {
  const canManageAddresses = user.id === state.authenticatedUserId;
  return `
    <form class="leader-request-form" data-form="request">
      <section class="form-section form-section-emphasis">
        <div class="form-section-title">
          <span>01</span>
          <div><h2>Quantidade e data</h2><p>Informe quantas refeicoes a equipe precisa.</p></div>
        </div>
        <div class="request-basics">
          <div class="field quantity-field">
            <label for="request-quantity">Quantidade de refeicoes</label>
            <div class="quantity-control">
              <span>${icon("users", 20)}</span>
              <input id="request-quantity" name="quantity" type="number" min="1" value="10" inputmode="numeric" required />
            </div>
          </div>
          <div class="field">
            <label for="request-date">Data da refeicao</label>
            <input id="request-date" name="date" type="date" value="${date}" required />
          </div>
        </div>
      </section>
      <section class="form-section">
        <div class="form-section-title">
          <span>02</span>
          <div><h2>Tipo de refeicao</h2><p>Escolha uma opcao para liberar os locais disponiveis.</p></div>
        </div>
        <div class="type-grid leader-type-grid">
          ${state.mealTypes.map((meal, index) => `
            <label class="meal-choice">
              <input type="radio" name="mealTypeId" value="${meal.id}" ${index === 0 ? "checked" : ""} />
              <span class="meal-choice-icon">${icon(index === 0 ? "package" : "utensils", 20)}</span>
              <span class="meal-choice-copy">
                <span class="choice-title">${meal.label}</span>
                <span class="choice-sub">${meal.locations.map((item) => item.name).join(" ou ")}</span>
              </span>
              <span class="meal-choice-check"></span>
            </label>`).join("")}
        </div>
      </section>
      <section class="form-section">
        <div class="form-section-title">
          <span>03</span>
          <div><h2>Entrega e observacoes</h2><p>Complete os detalhes finais da solicitacao.</p></div>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="request-location">Local de entrega</label>
            <select id="request-location" name="locationId">${locationOptions(state.mealTypes[0]?.id)}</select>
          </div>
          <div class="field">
            <label for="request-leader">Responsavel</label>
            <input id="request-leader" value="${user.name}" disabled />
          </div>
        </div>
        ${state.deliveryAddressFeatureAvailable ? `
          <div class="saved-address-field">
            <div class="saved-address-heading"><label for="request-delivery-address">Endereco de entrega</label>${canManageAddresses ? `<button type="button" class="text-action" data-address-form-toggle>${icon("plus", 15)}Novo endereco</button>` : ""}</div>
            <select id="request-delivery-address" name="deliveryAddressId" required>${deliveryAddressOptions(user.id)}</select>
            ${canManageAddresses && leaderAddressFormOpen ? renderDeliveryAddressForm() : ""}
          </div>` : `
          <div class="saved-address-unavailable">${icon("map", 15)} Enderecos salvos serao liberados apos a atualizacao do banco.</div>`}
        <div class="field">
          <label for="request-notes">Observacao <span class="optional-label">Opcional</span></label>
          <textarea id="request-notes" name="notes" placeholder="Ex.: equipe extra, frente de servico ou ajuste de entrega"></textarea>
        </div>
      </section>
      <div class="request-action-bar">
        <div class="request-action-note">${icon("clock", 16)}Limite: ${state.settings.cutoffTime} do dia anterior</div>
        <div class="button-row">
          <button class="btn outline" type="submit" name="status" value="rascunho">Salvar rascunho</button>
          <button class="btn primary" type="submit" name="status" value="enviado">Enviar pedido ${icon("arrow", 16)}</button>
        </div>
      </div>
    </form>`;
}

function deliveryAddressOptions(leaderId) {
  const rows = state.deliveryAddresses.filter((address) => address.leaderId === leaderId && address.active !== false);
  if (!rows.length) return `<option value="">Cadastre um endereco de entrega</option>`;
  return `<option value="">Selecione um endereco</option>${rows.map((address) => `<option value="${address.id}">${address.label} · ${address.addressLine}</option>`).join("")}`;
}

function renderDeliveryAddressForm() {
  return `<div class="saved-address-form"><div class="field"><label for="delivery-address-label">Nome do endereco</label><input id="delivery-address-label" placeholder="Ex.: Frente Norte" required /></div><div class="field"><label for="delivery-address-line">Endereco completo</label><input id="delivery-address-line" placeholder="Rua, numero, bairro e cidade" required /></div><div class="field"><label for="delivery-address-reference">Referencia <span class="optional-label">Opcional</span></label><input id="delivery-address-reference" placeholder="Portaria, bloco ou ponto de apoio" /></div><div class="saved-address-actions"><button class="btn outline small" type="button" data-address-form-cancel>Cancelar</button><button class="btn primary small" type="button" data-save-delivery-address>Salvar endereco</button></div></div>`;
}

function renderLeaderHistory(user, rows = leaderRequests(user)) {
  if (!rows.length) {
    return renderEmptyState(
      "Historico vazio",
      "Os pedidos enviados ou salvos como rascunho aparecerao aqui.",
      `<button class="btn primary small" data-orders-tab="novo">${icon("plus", 15)}Novo pedido</button>`
    );
  }
  return `
    <section class="leader-history">
      <div class="history-summary">
        <div><strong>${rows.length}</strong><span>pedidos registrados</span></div>
        <div><strong>${sumQty(rows.filter((request) => request.status !== "cancelado"))}</strong><span>refeicoes solicitadas</span></div>
        <div><strong>${countStatus(rows, "rascunho")}</strong><span>rascunhos</span></div>
      </div>
      <div class="leader-request-list">${rows.map(renderLeaderRequestCard).join("")}</div>
      <div class="leader-history-table">${renderRequestTable(rows, { showLeader: false, editable: true })}</div>
    </section>`;
}

function renderLeaderRequestCard(request) {
  const editable = canEditRequest(state, request);
  return `
    <article class="leader-request-card">
      <div class="request-card-main">
        <span class="request-meal-icon">${icon(request.mealType?.includes("Marmita") ? "package" : "utensils", 19)}</span>
        <div class="request-card-copy">
          <div class="request-card-title"><strong>${request.mealType}</strong><span class="badge ${request.status}">${STATUS_LABEL[request.status] ?? request.status}</span></div>
          <div class="request-card-meta">
            <span>${icon("clock", 14)}${formatDate(request.date)}</span>
            <span>${icon("map", 14)}${request.deliveryAddress || request.location}</span>
          </div>
        </div>
        <div class="request-card-quantity"><strong>${request.quantity}</strong><span>refeicoes</span></div>
      </div>
      <div class="request-card-footer">
        <span>Atualizado ${formatDateTime(request.updatedAt)}</span>
        ${editable
          ? `<div class="request-card-actions">
              <button class="icon-action" data-edit-request="${request.id}" aria-label="Editar pedido">${icon("edit", 15)}Editar</button>
              <button class="icon-action danger" data-cancel-request="${request.id}" aria-label="Cancelar pedido">${icon("trash", 15)}Cancelar</button>
            </div>`
          : `<span class="locked-label">${icon("clock", 14)}Edicao encerrada</span>`}
      </div>
    </article>`;
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
  if (request) return `<div class="operation-backdrop"><section class="operation-modal confirm"><span class="operation-icon danger">${icon("trash", 23)}</span><span class="eyebrow">Confirmar cancelamento</span><h2>Cancelar este pedido?</h2><p>O pedido de ${request.quantity} refeicoes para ${formatDate(request.date)} sera cancelado e deixara de entrar na consolidacao.</p><div><button class="btn outline" data-dismiss-operation>Voltar</button><button class="btn danger" data-confirm-cancel="${request.id}">Cancelar pedido</button></div></section></div>`;
  if (operationNotice) return `<div class="operation-backdrop"><section class="operation-modal success"><span class="operation-icon">${icon("clipboard", 23)}</span><span class="eyebrow">Operacao registrada</span><h2>${operationNotice.title}</h2><p>${operationNotice.message}</p><button class="btn primary" data-dismiss-operation>Continuar</button></section></div>`;
  return "";
}

function renderHistorico(user, embedded = false) {
  const rows = leaderRequests(user);
  return `
    ${embedded ? "" : topbar("Historico de pedidos", "Solicitacoes feitas pela sua equipe")}
    <div class="table-panel">
      <h2 class="section-title">${embedded ? "Pedidos recentes" : "Todos os pedidos"}</h2>
      ${renderRequestTable(rows, { showLeader: false, editable: true })}
    </div>`;
}

function requestUnitPrice(request) {
  return state.mealTypes.find((meal) => meal.id === request.mealTypeId)?.unitPrice ?? 0;
}

function requestValue(request) {
  return Number(request.quantity) * requestUnitPrice(request);
}

function consolidationValue(consolidation) {
  return getConsolidationSummary(state, consolidation).rows.reduce((sum, request) => sum + requestValue(request), 0);
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
  return `<section class="finance-page">${topbar(title, `Analise de ${month}`, `<button class="btn primary" data-export-finance="${mode}">Gerar PDF</button>`)}<div class="finance-metrics"><article class="finance-metric accent"><span>${isSupplier ? "Faturamento previsto" : "Custo previsto"}</span><strong>${money(projected)}</strong><small>${sumQty(rows)} refeicoes no mes</small></article><article class="finance-metric"><span>${isSupplier ? "Faturado" : "Pago/entregue"}</span><strong>${money(deliveredValue)}</strong><small>${delivered.length} pedidos entregues</small></article><article class="finance-metric"><span>Em aberto</span><strong>${money(pendingValue)}</strong><small>pedidos ainda em operacao</small></article><article class="finance-metric"><span>Ticket medio</span><strong>${money(rows.length ? projected / sumQty(rows) : 0)}</strong><small>por refeicao</small></article></div><div class="finance-grid"><article class="finance-card"><h2>Composicao por refeicao</h2>${byMeal.map((item) => `<div class="finance-progress"><div><span>${item.label}</span><strong>${money(item.value)}</strong></div><i><b style="width:${Math.max(3, Math.round((item.value / max) * 100))}%"></b></i></div>`).join("") || `<div class="empty">Sem movimentacao no periodo.</div>`}</article><article class="finance-card"><h2>Evolucao dos ultimos 7 dias</h2><div class="finance-bars">${days.map((item) => `<div><strong>${item.value ? money(item.value).replace("R$", "") : "-"}</strong><i style="height:${Math.max(5, Math.round((item.value / dailyMax) * 126))}px"></i><span>${item.label}</span></div>`).join("")}</div></article></div><article class="finance-card finance-table-card"><h2>Movimentacoes do periodo</h2><div class="table-wrap"><table><thead><tr><th>Data</th><th>Tipo</th><th>Quantidade</th><th>Valor</th><th>Status</th></tr></thead><tbody>${rows.sort((a, b) => b.date.localeCompare(a.date)).map((request) => `<tr><td>${formatDate(request.date)}</td><td>${request.mealType}</td><td>${request.quantity}</td><td><strong>${money(requestValue(request))}</strong></td><td><span class="badge ${request.status}">${STATUS_LABEL[request.status]}</span></td></tr>`).join("")}</tbody></table></div></article></section>`;
}

function renderPainel() {
  const date = activeDate();
  const rows = requestsForDate(state, date);
  const totals = totalsByMeal(rows);
  return `
    <section class="admin-stats">
      <div class="stats-grid">
      <div class="stat-card accent"><div class="stat-label">Total geral</div><div class="stat-value">${sumQty(rows)}</div><div class="stat-sub">refeicoes no dia</div></div>
      <div class="stat-card"><div class="stat-label">Marmitas</div><div class="stat-value">${totals["Marmita Campo"] ?? 0}</div><div class="stat-sub">campo</div></div>
      <div class="stat-card"><div class="stat-label">Almocos</div><div class="stat-value">${totals["Buffer Almoco"] ?? 0}</div><div class="stat-sub">restaurantes</div></div>
      <div class="stat-card"><div class="stat-label">Jantas</div><div class="stat-value">${totals.Jantar ?? 0}</div><div class="stat-sub">centro</div></div>
      </div>
      <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">Pendentes</div><div class="stat-value">${countStatus(rows, "rascunho")}</div><div class="stat-sub">rascunhos</div></div>
      <div class="stat-card"><div class="stat-label">Confirmados</div><div class="stat-value">${countStatus(rows, "enviado")}</div><div class="stat-sub">recebidos para consolidar</div></div>
      <div class="stat-card"><div class="stat-label">Entregas</div><div class="stat-value">${countStatus(rows, "entregue")}</div><div class="stat-sub">realizadas</div></div>
      <div class="stat-card"><div class="stat-label">Custo estimado</div><div class="stat-value">${money(rows.reduce((sum, request) => sum + requestValue(request), 0))}</div><div class="stat-sub">conforme tabela de precos</div></div>
      </div>
    </section>
    ${renderAdminLiveOrders(rows)}
    ${topbar("Painel administrativo", `Resumo operacional de ${formatDate(date)}`, `<button class="btn primary" data-view="consolidacao">Consolidar</button>`)}
    <div class="ops-strip">
      <div><span>Janela de pedidos</span><strong>Aberta ate ${state.settings.cutoffTime}</strong></div>
      <div><span>Fornecedor</span><strong>${state.settings.supplierName}</strong></div>
      <div><span>Notificacao</span><strong>${state.settings.notificationChannel}</strong></div>
    </div>
    <div class="filter-bar">
      <input type="date" value="${date}" data-filter-date />
      <select data-filter-leader>
        <option value="">Todos os encarregados</option>
        ${getLeaders(state).map((leader) => `<option value="${leader.id}">${leader.name}</option>`).join("")}
      </select>
      <select data-filter-meal>
        <option value="">Todos os tipos</option>
        ${state.mealTypes.map((meal) => `<option>${meal.label}</option>`).join("")}
      </select>
    </div>
    <div class="report-grid">
      <div class="data-panel">
        <h2 class="section-title">Pedidos recebidos</h2>
        ${renderRequestTable(rows, { showLeader: true, editable: true })}
      </div>
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
  return `
    <article class="admin-priority-order">
      <span class="badge ${request.status}">${STATUS_LABEL[request.status] ?? request.status}</span>
      <h3>${request.mealType}</h3>
      <div class="admin-priority-metrics">
        <div><strong>${request.quantity}</strong><span>refeicoes</span></div>
        <div><strong>${money(requestValue(request))}</strong><span>valor</span></div>
        <div><strong>${formatDate(request.date)}</strong><span>entrega</span></div>
      </div>
      <p>${getUserName(state, request.leaderId)} · ${request.deliveryAddress || request.location}</p>
      <div class="admin-priority-actions">
        ${canEditRequest(state, request) ? `<button class="btn primary small" data-edit-request="${request.id}">Abrir pedido</button>` : ""}
        <button class="btn outline small" data-view="pedidos">Ver todos</button>
      </div>
    </article>`;
}

function renderAdminLiveOrderRow(request) {
  return `
    <button class="admin-live-order" ${canEditRequest(state, request) ? `data-edit-request="${request.id}"` : `data-view="pedidos"`}>
      <span class="badge ${request.status}">${STATUS_LABEL[request.status] ?? request.status}</span>
      <strong>${request.mealType} · ${request.quantity} refeicoes</strong>
      <small>${getUserName(state, request.leaderId)} · ${request.deliveryAddress || request.location}</small>
      <b>${formatDateTime(request.updatedAt)}</b>
    </button>`;
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
    ${topbar("Pedidos", "Filtro por data, encarregado e tipo de refeicao")}
    <div class="filter-bar">
      <input type="date" value="${date}" data-filter-date />
      <select data-filter-leader>
        <option value="">Todos os encarregados</option>
        ${state.users.map((user) => `<option value="${user.id}" ${leader === user.id ? "selected" : ""}>${user.name}</option>`).join("")}
      </select>
      <select data-filter-meal>
        <option value="">Todos os tipos</option>
        ${state.mealTypes.map((item) => `<option ${meal === item.label ? "selected" : ""}>${item.label}</option>`).join("")}
      </select>
      <button class="btn outline" data-export="csv">CSV</button>
      <button class="btn outline" data-export="xlsx">Excel</button>
    </div>
    <div class="table-panel">
      <h2 class="section-title">Lista operacional</h2>
      ${renderRequestTable(rows, { showLeader: true, editable: true })}
    </div>`;
}

function renderConsolidacao() {
  const date = activeDate();
  const consolidation = getConsolidationForDate(state, date);
  const summary = getConsolidationSummary(state, consolidation);
  const suppliers = getSuppliers(state);
  const selectedSupplier = consolidation.supplierId ?? suppliers[0]?.id ?? "";
  return `
    ${topbar("Consolidacao automatica", `Pedido consolidado para ${formatDate(date)}`, `
      <button class="btn outline" data-export="doc">Word</button>
      <button class="btn outline" data-export="pdf">PDF</button>
      <button class="btn primary" data-action="send-consolidation">Enviar ao fornecedor</button>
    `)}
    <div class="filter-bar">
      <input type="date" value="${date}" data-filter-date />
      <select data-supplier-id>
        ${suppliers.map((supplier) => `<option value="${supplier.id}" ${supplier.id === selectedSupplier ? "selected" : ""}>${supplier.name}</option>`).join("")}
      </select>
      <span class="badge ${consolidation.status}">${STATUS_LABEL[consolidation.status] ?? consolidation.status}</span>
    </div>
    <div class="report-grid">
      <div class="data-panel">
        <h2 class="section-title">Pedido consolidado</h2>
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
  return `<article class="supplier-order-detail"><div class="supplier-detail-top"><div><span class="eyebrow">Pedido ${consolidation.id.slice(0, 8).toUpperCase()}</span><h2>${summary.total} refeicoes para ${formatDate(consolidation.date)}</h2></div><span class="badge ${consolidation.status}">${STATUS_LABEL[consolidation.status]}</span></div><div class="supplier-order-highlights"><div><span>Alimentacao</span><strong>${highlights}</strong></div><div><span>Quantidade</span><strong>${summary.total} refeicoes</strong></div><div><span>Valor do pedido</span><strong>${money(consolidationValue(consolidation))}</strong></div><div><span>Entrega prevista</span><strong>${formatDate(consolidation.date)}</strong></div></div><div class="supplier-detail-actions"><button class="btn outline small" data-generate-romaneio="${consolidation.id}">Gerar nota de fornecimento</button>${next ? `<button class="btn primary" data-step="${next.step}" data-id="${consolidation.id}">${next.label}</button>` : ""}</div><div class="supplier-detail-grid"><section><h3>Itens consolidados</h3>${renderConsolidatedSummary(summary)}</section><section><h3>Rastreabilidade</h3>${renderConsolidationTimeline(consolidation)}</section></div><section class="supplier-origin-requests"><h3>Pedidos de origem</h3>${renderRequestTable(summary.rows, { showLeader: true, editable: false })}</section></article>`;
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
        <table><tbody>${byLeader.map(([leader, qty], index) => `<tr><td>${index + 1}</td><td>${leader}</td><td><strong>${qty}</strong></td></tr>`).join("")}</tbody></table>
      </div>
    </div>`;
}

function renderAuditoria() {
  return `
    ${topbar("Auditoria", "Registro de usuario, data e horario em todas as acoes")}
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
  if (!summary.rows.length) return `<div class="empty">Sem pedidos enviados para consolidar.</div>`;
  return `
    ${Object.entries(summary.byMeal).map(([meal, data]) => `
      <div class="consolidated-block">
        <div class="consolidated-row total-line"><span>${meal}</span><span>${data.total}</span></div>
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
  root.querySelectorAll("[data-close-edit-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      editingRequestId = null;
      render();
    });
  });
  root.querySelector("[data-form='edit-request']")?.addEventListener("submit", handleEditRequestSubmit);
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
  root.querySelectorAll("[data-export]").forEach((button) => {
    button.addEventListener("click", () => handleExport(button.dataset.export));
  });
  root.querySelectorAll("[data-export-finance]").forEach((button) => {
    button.addEventListener("click", () => handleFinanceExport(button.dataset.exportFinance));
  });
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
      password: String(form.get("password"))
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
  if (!label || !addressLine) {
    toast("Informe o nome e o endereco completo.");
    return;
  }
  const button = document.querySelector("[data-save-delivery-address]");
  if (button) button.disabled = true;
  try {
    const saved = await createDeliveryAddress({ label, addressLine, reference });
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
    operationNotice = { title: "Pedido cancelado", message: "O pedido foi removido da operacao e nao entrara na proxima consolidacao." };
    render();
  } catch (error) {
    console.error(error);
    toast(`Nao foi possivel cancelar: ${error.message}`);
  }
}

async function duplicateForEdit(id) {
  const request = state.requests.find((item) => item.id === id);
  if (!request || !canEditRequest(state, request)) return;
  editingRequestId = id;
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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function totalsByMeal(rows) {
  return rows.reduce((acc, request) => {
    acc[request.mealType] ??= 0;
    acc[request.mealType] += Number(request.quantity);
    return acc;
  }, {});
}

function sumQty(rows) {
  return rows.reduce((sum, request) => sum + Number(request.quantity), 0);
}

function countStatus(rows, status) {
  return rows.filter((request) => request.status === status).length;
}

function pendingSyncText() {
  const pending = state.syncQueue.filter((item) => !item.synced).length;
  return pending ? `${pending} a sincronizar` : "sincronizado";
}

function nextSupplierStep(status) {
  if (status === "enviado") return { step: "confirmado", label: "Confirmar recebimento" };
  if (status === "confirmado") return { step: "producao", label: "Confirmar producao" };
  if (status === "producao") return { step: "saiu_entrega", label: "Confirmar saida" };
  if (status === "saiu_entrega") return { step: "entregue", label: "Confirmar entrega" };
  return null;
}

function roleName(role) {
  return {
    admin: "Administrador",
    encarregado: "Encarregado",
    fornecedor: "Fornecedor"
  }[role] ?? role;
}

function initials(name) {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function viewLabel(view) {
  return {
    inicio: "Visao geral",
    pedido: "Solicitacao",
    historico: "Historico",
    painel: "Operacao do dia",
    pedidos: "Controle",
    consolidacao: "Fornecedor",
    relatorios: "Inteligencia",
    auditoria: "Rastreabilidade",
    fornecedor: "Producao"
  }[view] ?? "AlimentaObra";
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
  state.mealTypes = data.catalog
    .filter((item) => item.active)
    .map((item) => ({
      id: item.id,
      label: item.name,
      unitPrice: Number(item.unit_price ?? 0),
      locations: (item.meal_locations ?? [])
        .filter((location) => location.active)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((location) => ({ id: location.id, name: location.name }))
    }));
  state.requests = data.requests.map((item) => ({
    id: item.id,
    date: item.meal_date,
    mealTypeId: item.meal_type_id,
    mealType: item.meal_types?.name ?? "",
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
  navigator.serviceWorker.register("/service-worker.js").catch(() => {
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
