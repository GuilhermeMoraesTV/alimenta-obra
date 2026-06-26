import { icon } from "./icons.js";

export function createSharedUi({ getActiveView, getExportMenuOpen, viewLabel }) {
  function topbar(title, subtitle, actions = "") {
    return `
      <div class="topbar app-page-header">
        <div>
          <span class="eyebrow">${viewLabel(getActiveView())}</span>
          <h1 class="page-title">${title}</h1>
          <div class="page-subtitle">${subtitle}</div>
        </div>
        <div class="actions">${actions}</div>
      </div>`;
  }

  function renderCompactHeader(kicker, title, subtitle, actions = "") {
    return `
      <header class="compact-header app-page-header">
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

  function renderExportMenu(id, options) {
    const exportMenuOpen = getExportMenuOpen();
    return `
      <div class="export-menu ${exportMenuOpen === id ? "open" : ""}">
        <button class="btn outline small" type="button" data-export-toggle="${id}">${icon("clipboard", 14)}Exportar</button>
        ${exportMenuOpen === id ? `<div class="export-options">${options.map(([type, label, iconName]) => `<button type="button" data-export="${type}">${icon(iconName, 14)}${label}</button>`).join("")}</div>` : ""}
      </div>`;
  }

  return {
    renderCompactHeader,
    renderEmptyState,
    renderExportMenu,
    topbar
  };
}
