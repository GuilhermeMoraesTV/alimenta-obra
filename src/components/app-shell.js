import { icon } from "./icons.js";

const appLogo = `${import.meta.env.BASE_URL}assets/logo-alimentaobra.png`;

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
  const homeView = user.role === "admin" ? "painel" : user.role === "fornecedor" ? "fornecedor" : "inicio";

  return `
    <div class="md:hidden fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#1c1d1b]/95 px-3 text-white shadow-[0_14px_30px_rgba(25,27,24,.22)] backdrop-blur role-${user.role}">
      <div class="flex items-center gap-2">
        <button class="inline-flex items-center border-0 bg-transparent p-0" type="button" data-view="${homeView}" aria-label="Ir para a home">
          <img class="h-12 w-auto max-w-[210px] object-contain" src="${appLogo}" alt="AlimentaObra" />
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button class="grid h-9 w-9 place-items-center rounded-r-xl rounded-l-md border border-white/10 bg-white/10 text-white transition hover:border-orange-400/40 hover:bg-orange-500/15" data-view="configuracoes" aria-label="Abrir configuracoes">
          ${icon("settings", 17)}
        </button>
        <button class="grid h-9 w-9 place-items-center rounded-r-xl rounded-l-md border border-white/10 bg-white/10 text-white transition hover:border-red-300/40 hover:bg-red-500/15" data-action="logout" aria-label="Sair do sistema">
          ${icon("logout", 17)}
        </button>
      </div>
    </div>
    <div class="min-h-screen bg-[#f2f1ec] text-stone-950 app-shell role-${user.role}">
      <aside class="fixed inset-x-2 bottom-2 z-30 flex h-[74px] flex-col rounded-[22px] border border-white/10 bg-[#1c1d1b]/95 px-1.5 py-2 text-white shadow-[0_18px_46px_rgba(25,27,24,.32)] backdrop-blur md:fixed md:inset-y-0 md:left-0 md:right-auto md:top-0 md:h-dvh md:w-[246px] md:rounded-none md:border-0 md:border-r md:border-white/10 md:px-3 md:py-4 sidebar">
        <div class="hidden items-center border-b border-white/10 px-1 pb-5 md:flex">
          <button class="inline-flex w-full items-center border-0 bg-transparent p-0" type="button" data-view="${homeView}" aria-label="Ir para a home">
            <img class="h-auto w-full max-w-[230px] object-contain" src="${appLogo}" alt="AlimentaObra" />
          </button>
        </div>
        <div class="hidden grid-cols-[38px_minmax(0,1fr)] gap-2 rounded-[16px] border border-white/10 bg-white/[.06] px-2 py-3 md:grid">
          <div class="grid h-9 w-9 place-items-center rounded-r-xl rounded-l-md bg-stone-100 text-xs font-black text-stone-900">${initials(user.name)}</div>
          <div class="min-w-0">
            <div class="truncate text-sm font-extrabold">${user.name}</div>
            <div class="flex flex-wrap gap-x-2 text-[11px] font-bold text-white/50">
              <span>${roleName(user.role)}</span>
              ${user.role !== "admin" && user.team ? `<span>${user.team}</span>` : ""}
            </div>
          </div>
        </div>
        <nav class="flex flex-1 gap-1 overflow-hidden pb-0.5 md:mt-4 md:grid md:grid-cols-1 md:content-start md:gap-1.5 md:overflow-visible md:pb-0 nav">${renderNav(user)}</nav>
        <div class="hidden gap-2 border-t border-white/10 px-1 pt-4 md:grid">
          <button class="inline-flex min-h-10 items-center gap-2 rounded-r-xl rounded-l-md border border-white/10 bg-white/[.04] px-3 text-sm font-bold text-white/70 transition hover:border-orange-400/35 hover:bg-orange-500/15 hover:text-white sidebar-settings ${activeView === "configuracoes" ? "active !border-orange-500/40 !bg-orange-500/15 !text-white" : ""}" data-view="configuracoes">${icon("settings", 16)}<span>Configuracoes</span></button>
          <button class="inline-flex min-h-10 items-center gap-2 rounded-r-xl rounded-l-md border border-red-300/15 bg-red-500/[.06] px-3 text-sm font-bold text-red-100/80 transition hover:border-red-300/35 hover:bg-red-500/15 hover:text-white sidebar-logout" data-action="logout">${icon("logout", 16)}<span>Sair do sistema</span></button>
        </div>
      </aside>
      <main class="min-w-0 px-3 pb-[98px] pt-[68px] md:ml-[246px] md:px-6 md:pb-10 md:pt-6 lg:px-10 main role-${user.role} view-${activeView}">
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
