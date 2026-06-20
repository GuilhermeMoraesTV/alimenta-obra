import { MEAL_TYPES } from "./data/seed.js";
import { exportCsv, exportExcel, exportPdf, exportWord } from "./services/exports.js";
import {
  addAudit,
  canEditRequest,
  consolidateRequests,
  getActiveUser,
  getConsolidationSummary,
  getLeaders,
  getUserName,
  loadState,
  markConsolidationStep,
  requestsForDate,
  resetState,
  saveState,
  upsertRequest
} from "./services/store.js";

let state = loadState();

const root = document.querySelector("#app-root");
const toastRoot = document.querySelector("#toast-root");

const NAV_BY_ROLE = {
  encarregado: [
    ["pedido", "P", "Novo Pedido"],
    ["historico", "H", "Historico"]
  ],
  admin: [
    ["painel", "D", "Painel"],
    ["pedidos", "P", "Pedidos"],
    ["consolidacao", "C", "Consolidacao"],
    ["relatorios", "R", "Relatorios"],
    ["auditoria", "A", "Auditoria"]
  ],
  fornecedor: [
    ["fornecedor", "F", "Pedido Recebido"],
    ["auditoria", "A", "Historico"]
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

function persist(message) {
  saveState(state);
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

function setUser(userId) {
  state.activeUserId = userId;
  const user = getActiveUser(state);
  state.activeView = NAV_BY_ROLE[user.role][0][0];
  persist();
}

function render() {
  const user = getActiveUser(state);
  if (!user) {
    renderLogin();
    return;
  }
  const allowedViews = NAV_BY_ROLE[user.role].map(([view]) => view);
  if (!allowedViews.includes(state.activeView)) {
    state.activeView = allowedViews[0];
    saveState(state);
  }
  root.innerHTML = `
    <div class="mobile-header">
      <div class="brand">
        <div class="brand-mark">AO</div>
        <div class="brand-name">Alimenta<span>Obra</span></div>
      </div>
      <button class="btn ghost small" data-action="logout">Sair</button>
    </div>
    <div class="app-shell">
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
          <button class="btn ghost" data-action="logout">Sair</button>
        </div>
      </aside>
      <main class="main role-${user.role} view-${state.activeView}">
        ${renderWorkspaceIntro(user)}
        ${renderView(user)}
      </main>
    </div>
    <div class="sync-strip ${navigator.onLine ? "" : "offline"}">${navigator.onLine ? "Online" : "Offline"} · ${pendingSyncText()}</div>
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
        <p class="login-subtitle">Acesse por perfil para testar o sistema completo.</p>
      </div>
    </div>
    <div class="field">
      <label for="login-user">Usuario</label>
      <select id="login-user">
        ${state.users.map((user) => `<option value="${user.id}">${user.name} - ${roleName(user.role)}</option>`).join("")}
      </select>
    </div>
    <div class="field">
      <label for="login-pass">Senha</label>
      <input id="login-pass" type="password" value="123456" />
    </div>
    <button class="btn primary full" data-action="login">Entrar no sistema</button>
    <div class="demo-row">
      <button class="btn outline small" data-demo="u-joaquim">Encarregado</button>
      <button class="btn outline small" data-demo="u-admin">Administrador</button>
      <button class="btn outline small" data-demo="u-fornecedor">Fornecedor</button>
    </div>`;
}

function renderRegisterForm() {
  return `
    <div class="brand login-brand">
      <div class="brand-mark">+</div>
      <div>
        <div class="brand-name">Criar acesso</div>
        <p class="login-subtitle">Cadastre um usuario para operar pedidos, consolidacao ou fornecedor.</p>
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
      <div class="form-grid compact">
        <div class="field">
          <label for="register-team">Equipe / frente</label>
          <input id="register-team" name="team" placeholder="Frente Sul" required />
        </div>
        <div class="field">
          <label for="register-role">Perfil</label>
          <select id="register-role" name="role">
            <option value="encarregado">Encarregado</option>
            <option value="admin">Administrador</option>
            <option value="fornecedor">Fornecedor</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label for="register-pass">Senha</label>
        <input id="register-pass" name="password" type="password" value="123456" required />
      </div>
      <button class="btn primary full" type="submit">Criar conta e entrar</button>
    </form>`;
}

function renderNav(user) {
  return NAV_BY_ROLE[user.role].map(([view, icon, label]) => `
    <button class="${state.activeView === view ? "active" : ""}" data-view="${view}">
      <span class="nav-icon">${icon}</span>
      <span>${label}</span>
    </button>`).join("");
}

function renderView(user) {
  const view = state.activeView;
  if (view === "pedido") return renderPedido(user);
  if (view === "historico") return renderHistorico(user);
  if (view === "painel") return renderPainel();
  if (view === "pedidos") return renderPedidosAdmin();
  if (view === "consolidacao") return renderConsolidacao();
  if (view === "relatorios") return renderRelatorios();
  if (view === "fornecedor") return renderFornecedor();
  if (view === "auditoria") return renderAuditoria();
  return renderPedido(user);
}

function renderWorkspaceIntro(user) {
  const date = state.settings.defaultMealDate;
  const rows = requestsForDate(state, date);
  const consolidation = consolidateRequests(state, date);
  const summary = getConsolidationSummary(state, consolidation);

  if (user.role === "admin") {
    return `
      <section class="command-center">
        <div>
          <span class="eyebrow">Central administrativa</span>
          <h2>Hoje voce controla ${sumQty(rows)} refeicoes para ${formatDate(date)}.</h2>
          <p>Pedidos recebidos, consolidacao, envio ao fornecedor e relatorios ficam sincronizados no mesmo painel.</p>
        </div>
        <div class="command-metrics">
          <div><strong>${rows.length}</strong><span>pedidos</span></div>
          <div><strong>${summary.total}</strong><span>consolidado</span></div>
          <div><strong>${STATUS_LABEL[consolidation.status] ?? consolidation.status}</strong><span>status</span></div>
        </div>
      </section>`;
  }

  if (user.role === "fornecedor") {
    const current = [...state.consolidations].find((item) => ["enviado", "confirmado", "producao"].includes(item.status)) ?? state.consolidations[0];
    const currentSummary = current ? getConsolidationSummary(state, current) : { total: 0 };
    return `
      <section class="command-center supplier">
        <div>
          <span class="eyebrow">Operacao fornecedor</span>
          <h2>${current ? `${currentSummary.total} refeicoes em acompanhamento` : "Aguardando pedido consolidado"}</h2>
          <p>Confirme recebimento, producao e saida para entrega com data e hora automaticas.</p>
        </div>
        <div class="command-metrics">
          <div><strong>${current ? formatDate(current.date) : "--"}</strong><span>data</span></div>
          <div><strong>${current ? (STATUS_LABEL[current.status] ?? current.status) : "Sem pedido"}</strong><span>etapa</span></div>
          <div><strong>${current?.confirmations.length ?? 0}/4</strong><span>registros</span></div>
        </div>
      </section>`;
  }

  const myRows = state.requests.filter((request) => request.leaderId === user.id && request.status !== "cancelado");
  const todayMine = myRows.filter((request) => request.date === date);
  return `
    <section class="command-center leader">
      <div>
        <span class="eyebrow">Area do encarregado</span>
        <h2>${user.name}, solicite a refeicao da equipe sem WhatsApp e sem planilha.</h2>
        <p>Prazo limite ${state.settings.cutoffTime} do dia anterior. Voce pode salvar rascunho, enviar e acompanhar o historico.</p>
      </div>
      <div class="command-metrics">
        <div><strong>${sumQty(todayMine)}</strong><span>refeicoes</span></div>
        <div><strong>${todayMine.length}</strong><span>pedidos ativos</span></div>
        <div><strong>${state.settings.cutoffTime}</strong><span>limite</span></div>
      </div>
    </section>`;
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

function renderPedido(user) {
  const date = state.settings.defaultMealDate;
  return `
    ${topbar("Novo pedido de refeicao", `Solicitacao para ${formatDate(date)} · limite ${state.settings.cutoffTime} do dia anterior`)}
    <form class="card" data-form="request">
      <h2 class="section-title">Dados do pedido</h2>
      <div class="form-grid">
        <div class="field">
          <label for="request-date">Data da refeicao</label>
          <input id="request-date" name="date" type="date" value="${date}" required />
        </div>
        <div class="field">
          <label for="request-quantity">Quantidade</label>
          <input id="request-quantity" name="quantity" type="number" min="1" value="10" required />
        </div>
      </div>
      <div class="field">
        <label>Tipo de refeicao</label>
        <div class="type-grid">
          ${MEAL_TYPES.map((meal, index) => `
            <label class="choice">
              <input type="radio" name="mealType" value="${meal.label}" ${index === 0 ? "checked" : ""} />
              <span>
                <span class="choice-title">${meal.label}</span>
                <span class="choice-sub">${meal.locations.join(" ou ")}</span>
              </span>
            </label>`).join("")}
        </div>
      </div>
      <div class="form-grid">
        <div class="field">
          <label for="request-location">Local</label>
          <select id="request-location" name="location">${locationOptions("Marmita Campo")}</select>
        </div>
        <div class="field">
          <label for="request-leader">Encarregado</label>
          <input id="request-leader" value="${user.name}" disabled />
        </div>
      </div>
      <div class="field">
        <label for="request-notes">Observacao</label>
        <textarea id="request-notes" name="notes" placeholder="Ex.: equipe extra, frente de servico, ajuste de entrega"></textarea>
      </div>
      <div class="button-row">
        <button class="btn outline" type="submit" name="status" value="rascunho">Salvar rascunho</button>
        <button class="btn primary" type="submit" name="status" value="enviado">Enviar pedido</button>
      </div>
    </form>
    ${renderHistorico(user, true)}
  `;
}

function renderHistorico(user, embedded = false) {
  const rows = state.requests.filter((request) => request.leaderId === user.id);
  return `
    ${embedded ? "" : topbar("Historico de pedidos", "Solicitacoes feitas pela sua equipe")}
    <div class="card">
      <h2 class="section-title">${embedded ? "Pedidos recentes" : "Todos os pedidos"}</h2>
      ${renderRequestTable(rows, { showLeader: false, editable: true })}
    </div>`;
}

function renderPainel() {
  const date = activeDate();
  const rows = requestsForDate(state, date);
  const totals = totalsByMeal(rows);
  return `
    ${topbar("Painel administrativo", `Resumo operacional de ${formatDate(date)}`, `<button class="btn primary" data-view="consolidacao">Consolidar</button>`)}
    <div class="ops-strip">
      <div><span>Janela de pedidos</span><strong>Aberta ate ${state.settings.cutoffTime}</strong></div>
      <div><span>Fornecedor</span><strong>${state.settings.supplierName}</strong></div>
      <div><span>Notificacao</span><strong>${state.settings.notificationChannel}</strong></div>
    </div>
    <div class="filter-bar card">
      <input type="date" value="${date}" data-filter-date />
      <select data-filter-leader>
        <option value="">Todos os encarregados</option>
        ${getLeaders(state).map((leader) => `<option value="${leader.id}">${leader.name}</option>`).join("")}
      </select>
      <select data-filter-meal>
        <option value="">Todos os tipos</option>
        ${MEAL_TYPES.map((meal) => `<option>${meal.label}</option>`).join("")}
      </select>
    </div>
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
      <div class="stat-card"><div class="stat-label">Custo estimado</div><div class="stat-value">${money(sumQty(rows) * 14)}</div><div class="stat-sub">R$ 14,00 por refeicao</div></div>
    </div>
    <div class="report-grid">
      <div class="card">
        <h2 class="section-title">Pedidos recebidos</h2>
        ${renderRequestTable(rows, { showLeader: true, editable: true })}
      </div>
      <div class="card">
        <h2 class="section-title">Consumo recente</h2>
        <div class="chart">${[42, 65, 58, 71, 89, 94, 78, 88, 102, 115, 109, 130, sumQty(rows), 0].map((value, index) => `
          <div class="bar ${index === 12 ? "today" : ""}">
            <span style="height:${Math.max(4, Math.round((value / 140) * 150))}px"></span>
            <span>${index + 1}</span>
          </div>`).join("")}</div>
      </div>
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
    ${topbar("Pedidos", "Filtro por data, encarregado e tipo de refeicao")}
    <div class="filter-bar card">
      <input type="date" value="${date}" data-filter-date />
      <select data-filter-leader>
        <option value="">Todos os encarregados</option>
        ${state.users.map((user) => `<option value="${user.id}" ${leader === user.id ? "selected" : ""}>${user.name}</option>`).join("")}
      </select>
      <select data-filter-meal>
        <option value="">Todos os tipos</option>
        ${MEAL_TYPES.map((item) => `<option ${meal === item.label ? "selected" : ""}>${item.label}</option>`).join("")}
      </select>
      <button class="btn outline" data-export="csv">CSV</button>
      <button class="btn outline" data-export="xlsx">Excel</button>
    </div>
    <div class="card">
      <h2 class="section-title">Lista operacional</h2>
      ${renderRequestTable(rows, { showLeader: true, editable: true })}
    </div>`;
}

function renderConsolidacao() {
  const date = activeDate();
  const consolidation = consolidateRequests(state, date);
  const summary = getConsolidationSummary(state, consolidation);
  return `
    ${topbar("Consolidacao automatica", `Pedido consolidado para ${formatDate(date)}`, `
      <button class="btn outline" data-export="doc">Word</button>
      <button class="btn outline" data-export="pdf">PDF</button>
      <button class="btn primary" data-action="send-consolidation" data-id="${consolidation.id}">Enviar ao fornecedor</button>
    `)}
    <div class="filter-bar card">
      <input type="date" value="${date}" data-filter-date />
      <span class="badge ${consolidation.status}">${STATUS_LABEL[consolidation.status] ?? consolidation.status}</span>
    </div>
    <div class="report-grid">
      <div class="card">
        <h2 class="section-title">Pedido consolidado</h2>
        ${renderConsolidatedSummary(summary)}
      </div>
      <div class="card">
        <h2 class="section-title">Linha do tempo</h2>
        ${renderConsolidationTimeline(consolidation)}
      </div>
    </div>
    <div class="card">
      <h2 class="section-title">Pedidos de origem</h2>
      ${renderRequestTable(summary.rows, { showLeader: true, editable: false })}
    </div>`;
}

function renderFornecedor() {
  const consolidation = [...state.consolidations].find((item) => ["enviado", "confirmado", "producao"].includes(item.status)) ?? state.consolidations[0];
  if (!consolidation) {
    return `${topbar("Fornecedor", "Nenhum pedido enviado no momento")}<div class="card empty">Aguardando envio do administrador.</div>`;
  }
  const summary = getConsolidationSummary(state, consolidation);
  const next = nextSupplierStep(consolidation.status);
  return `
    ${topbar("Fornecedor", `Pedido consolidado de ${formatDate(consolidation.date)}`, next ? `<button class="btn success" data-step="${next.step}" data-id="${consolidation.id}">${next.label}</button>` : "")}
    <div class="supplier-steps">
      ${renderSupplierStepCard(consolidation, "enviado", "Pedido", "Demanda enviada")}
      ${renderSupplierStepCard(consolidation, "confirmado", "Recebimento", "Ciencia registrada")}
      ${renderSupplierStepCard(consolidation, "producao", "Producao", "Refeicoes prontas")}
      ${renderSupplierStepCard(consolidation, "saiu_entrega", "Saida", "Entrega em rota")}
    </div>
    <div class="report-grid">
      <div class="card">
        <h2 class="section-title">Pedido recebido</h2>
        ${renderConsolidatedSummary(summary)}
      </div>
      <div class="card">
        <h2 class="section-title">Confirmacoes</h2>
        ${renderConsolidationTimeline(consolidation)}
      </div>
    </div>`;
}

function renderSupplierStepCard(consolidation, step, title, subtitle) {
  const done = step === "enviado"
    ? Boolean(consolidation.sentAt || consolidation.confirmations.find((item) => item.step === "enviado"))
    : Boolean(consolidation.confirmations.find((item) => item.step === step));
  return `
    <div class="supplier-step ${done ? "done" : ""}">
      <span>${done ? "OK" : "--"}</span>
      <strong>${title}</strong>
      <small>${subtitle}</small>
    </div>`;
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
    <div class="filter-bar card">
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
      <div class="card">
        <h2 class="section-title">Historico completo</h2>
        ${renderRequestTable(rows, { showLeader: true, editable: false })}
      </div>
      <div class="card">
        <h2 class="section-title">Ranking por encarregado</h2>
        <table><tbody>${byLeader.map(([leader, qty], index) => `<tr><td>${index + 1}</td><td>${leader}</td><td><strong>${qty}</strong></td></tr>`).join("")}</tbody></table>
      </div>
    </div>`;
}

function renderAuditoria() {
  return `
    ${topbar("Auditoria", "Registro de usuario, data e horario em todas as acoes", `<button class="btn outline" data-action="reset">Restaurar demo</button>`)}
    <div class="card">
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
    ["saiu_entrega", "Saida para entrega registrada"]
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
    button.addEventListener("click", () => setView(button.dataset.view));
  });
  root.querySelector("[data-action='login']")?.addEventListener("click", () => {
    state.activeUserId = document.querySelector("#login-user").value;
    state.activeView = NAV_BY_ROLE[getActiveUser(state).role][0][0];
    persist("Acesso realizado.");
  });
  root.querySelectorAll("[data-demo]").forEach((button) => {
    button.addEventListener("click", () => setUser(button.dataset.demo));
  });
  root.querySelectorAll("[data-login-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      loginMode = button.dataset.loginMode;
      renderLogin();
    });
  });
  root.querySelector("[data-form='register']")?.addEventListener("submit", handleRegisterSubmit);
  root.querySelectorAll("[data-action='logout']").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeUserId = null;
      persist();
    });
  });
  root.querySelector("[data-form='request']")?.addEventListener("submit", handleRequestSubmit);
  root.querySelectorAll("input[name='mealType']").forEach((input) => {
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
  root.querySelectorAll("[data-edit-request]").forEach((button) => {
    button.addEventListener("click", () => duplicateForEdit(button.dataset.editRequest));
  });
  root.querySelector("[data-action='send-consolidation']")?.addEventListener("click", (event) => sendConsolidation(event.currentTarget.dataset.id));
  root.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => supplierStep(button.dataset.id, button.dataset.step));
  });
  root.querySelectorAll("[data-export]").forEach((button) => {
    button.addEventListener("click", () => handleExport(button.dataset.export));
  });
  root.querySelector("[data-action='reset']")?.addEventListener("click", () => {
    state = resetState();
    toast("Dados de demonstracao restaurados.");
    render();
  });
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const role = form.get("role");
  const user = {
    id: crypto.randomUUID(),
    name: String(form.get("name")).trim(),
    role,
    email: String(form.get("email")).trim(),
    team: String(form.get("team")).trim()
  };
  state.users.push(user);
  state.activeUserId = user.id;
  state.activeView = NAV_BY_ROLE[role][0][0];
  addAudit(state, "Usuario cadastrado", "usuario", { userId: user.id, role });
  loginMode = "login";
  persist("Conta criada. Bem-vindo ao AlimentaObra.");
}

function handleRequestSubmit(event) {
  event.preventDefault();
  const submitter = event.submitter;
  const form = new FormData(event.currentTarget);
  const user = getActiveUser(state);
  const status = submitter?.value ?? "enviado";
  const request = {
    id: crypto.randomUUID(),
    date: form.get("date"),
    mealType: form.get("mealType"),
    quantity: Number(form.get("quantity")),
    location: form.get("location"),
    leaderId: user.id,
    status,
    notes: form.get("notes") ?? "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  upsertRequest(state, request);
  addAudit(state, status === "enviado" ? "Pedido enviado" : "Rascunho salvo", "pedido", { requestId: request.id });
  persist(status === "enviado" ? "Pedido enviado ao administrador." : "Rascunho salvo.");
}

function cancelRequest(id) {
  const request = state.requests.find((item) => item.id === id);
  if (!request || !canEditRequest(state, request)) return;
  request.status = "cancelado";
  request.updatedAt = new Date().toISOString();
  addAudit(state, "Pedido cancelado", "pedido", { requestId: id });
  persist("Pedido cancelado.");
}

function duplicateForEdit(id) {
  const request = state.requests.find((item) => item.id === id);
  if (!request || !canEditRequest(state, request)) return;
  request.status = "rascunho";
  request.updatedAt = new Date().toISOString();
  addAudit(state, "Pedido liberado para edicao", "pedido", { requestId: id });
  persist("Pedido voltou para rascunho.");
}

function sendConsolidation(id) {
  markConsolidationStep(state, id, "enviado");
  addAudit(state, "Pedido consolidado enviado ao fornecedor", "consolidacao", { consolidationId: id });
  persist("Fornecedor notificado com o pedido consolidado.");
}

function supplierStep(id, step) {
  markConsolidationStep(state, id, step);
  addAudit(state, `Fornecedor registrou: ${STATUS_LABEL[step]}`, "fornecedor", { consolidationId: id });
  persist("Confirmacao registrada com data e hora.");
}

function handleExport(type) {
  const date = activeDate();
  const rows = state.requests.filter((request) => !date || request.date === date);
  const consolidation = consolidateRequests(state, date);
  if (type === "csv") exportCsv(state, rows);
  if (type === "xlsx") exportExcel(state, rows);
  if (type === "doc") exportWord(state, consolidation);
  if (type === "pdf") exportPdf(state, consolidation);
  addAudit(state, `Exportacao ${type.toUpperCase()} solicitada`, "relatorio", { date });
  persist("Exportacao preparada.");
}

function locationOptions(mealType) {
  const meal = MEAL_TYPES.find((item) => item.label === mealType) ?? MEAL_TYPES[0];
  return meal.locations.map((location) => `<option>${location}</option>`).join("");
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

window.addEventListener("online", () => {
  state.syncQueue = state.syncQueue.map((item) => ({ ...item, synced: true, syncedAt: new Date().toISOString() }));
  saveState(state);
  toast("Conexao restaurada. Fila sincronizada.");
  render();
});
window.addEventListener("offline", render);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").catch(() => {
    console.warn("Service worker indisponivel neste ambiente.");
  });
}

render();
