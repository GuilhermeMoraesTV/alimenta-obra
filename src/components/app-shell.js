import { icon } from "./icons.js";

export function renderAppShell({
  accessSwitcher = "",
  activeView,
  content,
  editRequestModal = "",
  adminRequestDetailModal = "",
  operationModal = "",
  renderNav,
  roleName,
  initials,
  user,
  workspaceIntro = ""
}) {
  return `
    <div class="mobile-header role-${user.role}">
      <div class="brand">
        <div class="brand-mark">AO</div>
        <div class="brand-name">Alimenta<span>Obra</span></div>
      </div>
      <div class="mobile-actions">
        <button class="mobile-profile mobile-settings" data-view="configuracoes" aria-label="Abrir configuracoes">
          ${icon("settings", 17)}
        </button>
        <button class="mobile-profile" data-action="logout" aria-label="Sair do sistema">
          ${icon("logout", 17)}
        </button>
      </div>
    </div>
    <div class="app-shell role-${user.role}">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">AO</div>
          <div class="brand-name">Alimenta<span>Obra</span></div>
        </div>
        <div class="profile-box">
          <div class="profile-avatar">${initials(user.name)}</div>
          <div class="profile-main">
            <div class="profile-name">${user.name}</div>
            <div class="profile-meta">
              <span>${roleName(user.role)}</span>
              ${user.role !== "admin" && user.team ? `<span>${user.team}</span>` : ""}
            </div>
          </div>
        </div>
        <nav class="nav">${renderNav(user)}</nav>
        <div class="sidebar-footer">
          <button class="btn ghost sidebar-settings ${activeView === "configuracoes" ? "active" : ""}" data-view="configuracoes">${icon("settings", 16)}<span>Configuracoes</span></button>
          <button class="btn ghost sidebar-logout" data-action="logout">${icon("logout", 16)}<span>Sair do sistema</span></button>
        </div>
      </aside>
      <main class="main role-${user.role} view-${activeView}">
        ${accessSwitcher}
        ${workspaceIntro}
        ${content}
      </main>
    </div>
    ${editRequestModal}
    ${adminRequestDetailModal}
    ${operationModal}
  `;
}
