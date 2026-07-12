export function createSettingsPage(ctx) {
  const {
    escapeHtml,
    getGeneratedInviteLink,
    getState,
    icon,
    money,
    renderAdminBackButton,
    renderEmptyState,
    roleName
  } = ctx;

  const settingsPageClass = `
    mx-auto grid w-full max-w-6xl gap-3 text-stone-950
    [&_.settings-header]:relative [&_.settings-header]:mb-3 [&_.settings-header]:overflow-hidden [&_.settings-header]:rounded-[22px] [&_.settings-header]:border [&_.settings-header]:border-stone-800 [&_.settings-header]:bg-[#242622] [&_.settings-header]:px-4 [&_.settings-header]:pb-7 [&_.settings-header]:pt-4 [&_.settings-header]:text-white [&_.settings-header]:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.55)] sm:[&_.settings-header]:px-6 sm:[&_.settings-header]:pt-5
    [&_.settings-header-main]:relative [&_.settings-header-main]:flex [&_.settings-header-main]:items-start [&_.settings-header-main]:justify-between [&_.settings-header-main]:gap-3
    [&_.settings-header-pattern]:pointer-events-none [&_.settings-header-pattern]:absolute [&_.settings-header-pattern]:inset-0 [&_.settings-header-pattern]:opacity-[0.05]
    [&_.settings-perforation]:pointer-events-none [&_.settings-perforation]:absolute [&_.settings-perforation]:inset-x-0 [&_.settings-perforation]:bottom-0 [&_.settings-perforation]:flex [&_.settings-perforation]:translate-y-1/2 [&_.settings-perforation]:justify-around [&_.settings-perforation]:px-4 [&_.settings-perforation_i]:h-2.5 [&_.settings-perforation_i]:w-2.5 [&_.settings-perforation_i]:rounded-full [&_.settings-perforation_i]:bg-white
    [&_.compact-kicker]:text-[10px] [&_.compact-kicker]:font-black [&_.compact-kicker]:uppercase [&_.compact-kicker]:tracking-[.16em] [&_.compact-kicker]:text-orange-200
    [&_h1]:m-0 [&_h1]:text-[24px] [&_h1]:font-black [&_h1]:leading-none [&_h1]:tracking-normal sm:[&_h1]:text-[30px] [&_.settings-header_h1]:mt-1 [&_.settings-header_h1]:text-white [&_h2]:m-0 [&_h2]:text-lg [&_h2]:font-black [&_p]:m-0 [&_p]:text-sm [&_p]:text-stone-500 [&_.settings-header_p]:mt-1.5 [&_.settings-header_p]:max-w-2xl [&_.settings-header_p]:text-xs [&_.settings-header_p]:font-bold [&_.settings-header_p]:text-white/55 sm:[&_.settings-header_p]:text-sm
    [&_.settings-layout]:grid [&_.settings-layout]:gap-3 lg:[&_.settings-layout]:grid-cols-2
    [&_.settings-panel]:grid [&_.settings-panel]:gap-4 [&_.settings-panel]:overflow-hidden [&_.settings-panel]:rounded-[18px] [&_.settings-panel]:border [&_.settings-panel]:border-stone-200 [&_.settings-panel]:bg-white [&_.settings-panel]:p-4 [&_.settings-panel]:shadow-[0_12px_30px_rgba(25,27,24,.06)]
    [&_.settings-panel-wide]:lg:col-span-2
    [&_.settings-panel-title]:-mx-4 [&_.settings-panel-title]:-mt-4 [&_.settings-panel-title]:flex [&_.settings-panel-title]:items-start [&_.settings-panel-title]:gap-3 [&_.settings-panel-title]:border-b [&_.settings-panel-title]:border-dashed [&_.settings-panel-title]:border-stone-200 [&_.settings-panel-title]:bg-stone-50 [&_.settings-panel-title]:px-4 [&_.settings-panel-title]:py-3 [&_.settings-panel-title>span]:grid [&_.settings-panel-title>span]:h-10 [&_.settings-panel-title>span]:w-10 [&_.settings-panel-title>span]:place-items-center [&_.settings-panel-title>span]:rounded-r-xl [&_.settings-panel-title>span]:rounded-l-md [&_.settings-panel-title>span]:bg-orange-50 [&_.settings-panel-title>span]:text-orange-700
    [&_.form-grid]:grid [&_.form-grid]:gap-3 sm:[&_.form-grid]:grid-cols-2
    [&_.field]:grid [&_.field]:gap-1.5 [&_.field_label]:text-[10px] [&_.field_label]:font-black [&_.field_label]:uppercase [&_.field_label]:tracking-[.08em] [&_.field_label]:text-stone-500
    [&_input]:min-h-11 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-stone-300 [&_input]:bg-white [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none focus:[&_input]:border-orange-600 focus:[&_input]:ring-4 focus:[&_input]:ring-orange-100 disabled:[&_input]:bg-stone-50 disabled:[&_input]:text-stone-500
    [&_select]:min-h-11 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-stone-300 [&_select]:bg-white [&_select]:px-3 [&_select]:text-sm [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-stone-300 [&_textarea]:bg-white [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-sm
    [&_.settings-actions]:flex [&_.settings-actions]:justify-end [&_.btn]:inline-flex [&_.btn]:min-h-10 [&_.btn]:items-center [&_.btn]:justify-center [&_.btn]:gap-2 [&_.btn]:rounded-lg [&_.btn]:border [&_.btn]:border-transparent [&_.btn]:px-4 [&_.btn]:text-sm [&_.btn]:font-extrabold [&_.btn.primary]:border-orange-600 [&_.btn.primary]:bg-orange-600 [&_.btn.primary]:text-white [&_.btn.outline]:border-stone-300 [&_.btn.outline]:bg-white [&_.btn.outline]:text-stone-900 [&_.btn.small]:min-h-9 [&_.btn.small]:px-3 [&_.btn.small]:text-xs
    [&_.settings-back-row]:min-h-6 [&_.settings-back-row]:flex [&_.settings-back-row]:items-center
    [&_.admin-back-button]:inline-flex [&_.admin-back-button]:min-h-5 [&_.admin-back-button]:items-center [&_.admin-back-button]:gap-1.5 [&_.admin-back-button]:border-0 [&_.admin-back-button]:bg-transparent [&_.admin-back-button]:p-0 [&_.admin-back-button]:text-xs [&_.admin-back-button]:font-extrabold [&_.admin-back-button]:text-stone-500 [&_.admin-back-button]:shadow-none [&_.admin-back-button]:transition hover:[&_.admin-back-button]:text-orange-700
    [&_.invite-link-box]:grid [&_.invite-link-box]:gap-2 [&_.invite-link-box]:rounded-xl [&_.invite-link-box]:border [&_.invite-link-box]:border-orange-200 [&_.invite-link-box]:bg-orange-50 [&_.invite-link-box]:p-3 [&_.invite-link-box_span]:text-[10px] [&_.invite-link-box_span]:font-black [&_.invite-link-box_span]:uppercase [&_.invite-link-box_strong]:break-all [&_.invite-link-box_strong]:text-sm
    lg:[&_.work-section-panel]:col-span-2 [&_.work-section-panel]:gap-3 [&_.work-section-panel_.settings-panel-title]:py-2.5 [&_.work-section-panel_.settings-panel-title>span]:h-8 [&_.work-section-panel_.settings-panel-title>span]:w-8 [&_.work-section-panel_h2]:text-base [&_.work-section-panel_p]:text-xs
    [&_.work-section-new]:rounded-xl [&_.work-section-new]:border [&_.work-section-new]:border-orange-200 [&_.work-section-new]:bg-orange-50/60 [&_.work-section-new]:p-3
    [&_.work-section-form]:grid [&_.work-section-form]:gap-2 sm:[&_.work-section-form]:grid-cols-[minmax(0,1.4fr)_90px_minmax(0,1fr)_96px_auto] sm:[&_.work-section-form]:items-end
    [&_.work-section-list]:grid [&_.work-section-list]:grid-cols-1 [&_.work-section-list]:gap-2 sm:[&_.work-section-list]:grid-cols-2 xl:[&_.work-section-list]:grid-cols-3
    [&_.work-section-card]:grid [&_.work-section-card]:gap-2 [&_.work-section-card]:rounded-xl [&_.work-section-card]:border [&_.work-section-card]:border-dashed [&_.work-section-card]:border-stone-200 [&_.work-section-card]:bg-[#fffefa] [&_.work-section-card]:p-3 [&_.work-section-card]:shadow-sm
    [&_.work-section-card-head]:grid [&_.work-section-card-head]:grid-cols-[minmax(0,1fr)_auto] [&_.work-section-card-head]:items-start [&_.work-section-card-head]:gap-2 [&_.work-section-card_strong]:truncate [&_.work-section-card_strong]:text-sm [&_.work-section-card_small]:text-xs [&_.work-section-actions]:grid [&_.work-section-actions]:grid-cols-2 [&_.work-section-actions]:gap-2
    lg:[&_.meal-catalog-panel]:col-span-2 [&_.meal-catalog-panel]:gap-3 [&_.meal-catalog-panel_.settings-panel-title]:py-2.5 [&_.meal-catalog-panel_.settings-panel-title>span]:h-8 [&_.meal-catalog-panel_.settings-panel-title>span]:w-8 [&_.meal-catalog-panel_h2]:text-base [&_.meal-catalog-panel_p]:text-xs
    [&_.meal-catalog-toolbar]:flex [&_.meal-catalog-toolbar]:items-center [&_.meal-catalog-toolbar]:justify-between [&_.meal-catalog-toolbar]:gap-3
    [&_.meal-catalog-list]:grid [&_.meal-catalog-list]:grid-cols-2 [&_.meal-catalog-list]:gap-2 sm:[&_.meal-catalog-list]:grid-cols-2 xl:[&_.meal-catalog-list]:grid-cols-3
    [&_.meal-catalog-card]:grid [&_.meal-catalog-card]:min-w-0 [&_.meal-catalog-card]:gap-2 [&_.meal-catalog-card]:rounded-r-xl [&_.meal-catalog-card]:rounded-l-md [&_.meal-catalog-card]:border [&_.meal-catalog-card]:border-l-2 [&_.meal-catalog-card]:border-dashed [&_.meal-catalog-card]:border-stone-200 [&_.meal-catalog-card]:bg-[#fffefa] [&_.meal-catalog-card]:p-3 [&_.meal-catalog-card]:shadow-sm
    [&_.meal-catalog-card-head]:grid [&_.meal-catalog-card-head]:grid-cols-[minmax(0,1fr)_auto] [&_.meal-catalog-card-head]:items-start [&_.meal-catalog-card-head]:gap-2 [&_.meal-catalog-card-title]:min-w-0 [&_.meal-catalog-card-title_strong]:block [&_.meal-catalog-card-title_strong]:truncate [&_.meal-catalog-card-title_strong]:text-sm [&_.meal-catalog-card-title_strong]:font-black [&_.meal-catalog-card-title_p]:mt-1 [&_.meal-catalog-card-title_p]:line-clamp-2 [&_.meal-catalog-card-title_p]:text-xs [&_.meal-catalog-card-actions]:flex [&_.meal-catalog-card-actions]:gap-1
    [&_.meal-price-chip]:inline-flex [&_.meal-price-chip]:w-max [&_.meal-price-chip]:items-center [&_.meal-price-chip]:rounded-full [&_.meal-price-chip]:border [&_.meal-price-chip]:border-orange-200 [&_.meal-price-chip]:bg-orange-50 [&_.meal-price-chip]:px-2 [&_.meal-price-chip]:py-1 [&_.meal-price-chip]:text-[10px] [&_.meal-price-chip]:font-black [&_.meal-price-chip]:text-orange-700
    [&_.meal-status-chip]:inline-flex [&_.meal-status-chip]:w-max [&_.meal-status-chip]:items-center [&_.meal-status-chip]:rounded-full [&_.meal-status-chip]:border [&_.meal-status-chip]:px-2 [&_.meal-status-chip]:py-1 [&_.meal-status-chip]:text-[10px] [&_.meal-status-chip]:font-black [&_.meal-status-chip]:uppercase [&_.meal-status-chip]:tracking-[.08em] [&_.meal-status-chip.active]:border-emerald-200 [&_.meal-status-chip.active]:bg-emerald-50 [&_.meal-status-chip.active]:text-emerald-700 [&_.meal-status-chip.inactive]:border-stone-200 [&_.meal-status-chip.inactive]:bg-stone-100 [&_.meal-status-chip.inactive]:text-stone-500
    [&_.icon-btn]:grid [&_.icon-btn]:h-9 [&_.icon-btn]:w-9 [&_.icon-btn]:place-items-center [&_.icon-btn]:rounded-lg [&_.icon-btn]:border [&_.icon-btn]:border-stone-300 [&_.icon-btn]:bg-white [&_.icon-btn]:p-0 [&_.icon-btn]:text-stone-800 hover:[&_.icon-btn]:border-orange-300 hover:[&_.icon-btn]:bg-orange-50 hover:[&_.icon-btn]:text-orange-700 [&_.icon-btn.danger]:border-red-200 [&_.icon-btn.danger]:bg-red-50 [&_.icon-btn.danger]:text-red-700 hover:[&_.icon-btn.danger]:border-red-300 hover:[&_.icon-btn.danger]:bg-red-100
    [&_.meal-catalog-edit]:overflow-hidden [&_.meal-catalog-edit]:rounded-xl [&_.meal-catalog-edit]:border [&_.meal-catalog-edit]:border-stone-200 [&_.meal-catalog-edit]:bg-white [&_.meal-catalog-edit_summary]:flex [&_.meal-catalog-edit_summary]:min-h-9 [&_.meal-catalog-edit_summary]:cursor-pointer [&_.meal-catalog-edit_summary]:list-none [&_.meal-catalog-edit_summary]:items-center [&_.meal-catalog-edit_summary]:justify-center [&_.meal-catalog-edit_summary]:gap-2 [&_.meal-catalog-edit_summary]:px-3 [&_.meal-catalog-edit_summary]:text-xs [&_.meal-catalog-edit_summary]:font-black [&_.meal-catalog-edit_summary::-webkit-details-marker]:hidden [&_.meal-catalog-item]:grid [&_.meal-catalog-item]:gap-2 [&_.meal-catalog-item]:border-t [&_.meal-catalog-item]:border-stone-100 [&_.meal-catalog-item]:p-3 [&_.meal-catalog-item_.form-grid]:gap-2 [&_.meal-catalog-item_textarea]:min-h-[4.25rem] [&_.meal-catalog-item_textarea]:py-1.5 [&_.meal-catalog-footer]:flex [&_.meal-catalog-footer]:items-center [&_.meal-catalog-footer]:justify-between [&_.meal-catalog-footer]:gap-2 [&_.meal-catalog-footer]:border-t [&_.meal-catalog-footer]:border-stone-100 [&_.meal-catalog-footer]:pt-2 [&_.meal-catalog-footer_span]:text-xs [&_.meal-catalog-new]:overflow-hidden [&_.meal-catalog-new]:rounded-[14px] [&_.meal-catalog-new]:border [&_.meal-catalog-new]:border-orange-200 [&_.meal-catalog-new]:bg-orange-50/60
    [&_.meal-catalog-new_summary]:flex [&_.meal-catalog-new_summary]:min-h-11 [&_.meal-catalog-new_summary]:cursor-pointer [&_.meal-catalog-new_summary]:list-none [&_.meal-catalog-new_summary]:items-center [&_.meal-catalog-new_summary]:justify-between [&_.meal-catalog-new_summary]:gap-2 [&_.meal-catalog-new_summary]:px-3 [&_.meal-catalog-new_summary]:text-sm [&_.meal-catalog-new_summary]:font-black [&_.meal-catalog-new_summary]:text-orange-700 [&_.meal-catalog-new_summary::-webkit-details-marker]:hidden
    [&_.meal-catalog-new-form]:grid [&_.meal-catalog-new-form]:gap-3 [&_.meal-catalog-new-form]:border-t [&_.meal-catalog-new-form]:border-orange-100 [&_.meal-catalog-new-form]:bg-white/80 [&_.meal-catalog-new-form]:p-3
    [&_.empty]:rounded-xl [&_.empty]:border [&_.empty]:border-dashed [&_.empty]:border-stone-300 [&_.empty]:bg-stone-50 [&_.empty]:p-5 [&_.empty]:text-center [&_.empty]:text-sm [&_.empty]:font-bold [&_.empty]:text-stone-500
  `;

  function renderConfiguracoes() {
    const state = getState();
    const user = state.users.find((item) => item.id === (state.activeUserId ?? state.authenticatedUserId));
    if (!user) return renderEmptyState("Sessao expirada", "Entre novamente para alterar suas configuracoes.");
    const canManageCatalog = user.role === "admin" || user.role === "fornecedor";
    const isLeader = user.role === "encarregado";

    return `
      <section class="${settingsPageClass}">
        <div class="settings-back-row">${renderAdminBackButton()}</div>
        <header class="settings-header">
          <div class="settings-header-pattern" style="background-image: radial-gradient(currentColor 1.4px, transparent 1.4px); background-size: 16px 16px;"></div>
          <div class="settings-header-main">
            <div>
              <span class="compact-kicker">Configuracoes</span>
              <h1>${isLeader ? "Minha conta" : canManageCatalog ? "Conta e catalogo" : "Minha conta"}</h1>
              <p>${isLeader ? "Atualize seus dados de usuario e senha." : canManageCatalog ? "Mantenha dados de acesso, equipes e tipos de alimentacao." : "Atualize seus dados de acesso e as informacoes que aparecem no sistema."}</p>
            </div>
          </div>
          <div class="settings-perforation">${Array.from({ length: 14 }).map(() => "<i></i>").join("")}</div>
        </header>
        <div class="settings-layout">
          <form class="settings-panel" data-form="profile-settings">
            <div class="settings-panel-title">
              <span>${icon("users", 18)}</span>
              <div><h2>Dados do usuario</h2><p>Essas informacoes identificam voce nos pedidos e registros.</p></div>
            </div>
            <div class="form-grid">
              <div class="field">
                <label for="settings-name">Nome</label>
                <input id="settings-name" name="name" value="${escapeHtml(user.name)}" required />
              </div>
              <div class="field">
                <label for="settings-team">Equipe / frente</label>
                <input id="settings-team" name="team" value="${escapeHtml(user.team || "")}" placeholder="Ex.: Frente Norte" />
              </div>
            </div>
            <div class="form-grid">
              <div class="field">
                <label>E-mail</label>
                <input value="${escapeHtml(user.email)}" disabled />
              </div>
              <div class="field">
                <label>Perfil</label>
                <input value="${roleName(user.role)}" disabled />
              </div>
            </div>
            <footer class="settings-actions">
              <button class="btn primary" type="submit">Salvar dados</button>
            </footer>
          </form>
          <form class="settings-panel" data-form="password-settings">
            <div class="settings-panel-title">
              <span>${icon("settings", 18)}</span>
              <div><h2>Senha</h2><p>Use pelo menos 8 caracteres para proteger sua conta.</p></div>
            </div>
            <div class="field">
              <label for="settings-password">Nova senha</label>
              <input id="settings-password" name="password" type="password" minlength="8" autocomplete="new-password" required />
            </div>
            <div class="field">
              <label for="settings-password-confirm">Confirmar nova senha</label>
              <input id="settings-password-confirm" name="passwordConfirm" type="password" minlength="8" autocomplete="new-password" required />
            </div>
            <footer class="settings-actions">
              <button class="btn outline" type="submit">Alterar senha</button>
            </footer>
          </form>
          ${isLeader ? "" : user.role === "admin" ? renderAccessInvitePanel() : ""}
          ${isLeader ? "" : user.role === "admin" ? renderWorkSectionsPanel() : ""}
          ${isLeader ? "" : canManageCatalog ? renderMealCatalogPanel(user) : ""}
        </div>
      </section>`;
  }

  function renderAccessInvitePanel() {
    const generatedInviteLink = getGeneratedInviteLink();
    return `
      <form class="settings-panel settings-panel-wide access-invite-panel" data-form="access-invite">
        <div class="settings-panel-title">
          <span>${icon("users", 18)}</span>
          <div><h2>Convidar acesso interno</h2><p>Gere um link privado para criar fornecedor ou administrador.</p></div>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="invite-role">Tipo de acesso</label>
            <select id="invite-role" name="role" required>
              <option value="fornecedor">Fornecedor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div class="field">
            <label for="invite-email">E-mail permitido <span class="optional-label">Opcional</span></label>
            <input id="invite-email" name="email" type="email" placeholder="pessoa@empresa.com" />
          </div>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="invite-team">Equipe / empresa <span class="optional-label">Opcional</span></label>
            <input id="invite-team" name="team" placeholder="Ex.: Cozinha Central" />
          </div>
          <div class="field">
            <label for="invite-days">Validade</label>
            <select id="invite-days" name="expiresInDays">
              <option value="7">7 dias</option>
              <option value="15">15 dias</option>
              <option value="30">30 dias</option>
            </select>
          </div>
        </div>
        ${generatedInviteLink ? `<div class="invite-link-box"><span>Link gerado</span><strong>${escapeHtml(generatedInviteLink)}</strong><button class="btn outline small" type="button" data-copy-invite-link>Copiar link</button></div>` : ""}
        <footer class="settings-actions">
          <button class="btn primary" type="submit">${icon("plus", 15)}Gerar link privado</button>
        </footer>
      </form>`;
  }

  function renderWorkSectionsPanel() {
    const state = getState();
    const leaders = state.users.filter((item) => item.role === "encarregado" && item.active !== false);
    return `
      <section class="settings-panel work-section-panel">
        <div class="settings-panel-title">
          <span>${icon("users", 18)}</span>
          <div><h2>Equipes e trechos</h2><p>Cadastre apenas equipe, efetivo e encarregado vinculado.</p></div>
        </div>
        <div class="work-section-new">
          <form class="work-section-form" data-form="work-section">
            <input type="hidden" name="id" value="" />
            <div class="field">
              <label for="work-section-name-new">Equipe/trecho</label>
              <input id="work-section-name-new" name="name" placeholder="Ex.: Frente Norte" required />
            </div>
            <div class="field">
              <label for="work-section-headcount-new">Efetivo</label>
              <input id="work-section-headcount-new" name="headcount" type="number" min="0" value="0" required />
            </div>
            <div class="field">
              <label for="work-section-leader-new">Encarregado</label>
              <select id="work-section-leader-new" name="leaderId">
                <option value="">Sem vinculo fixo</option>
                ${leaders.map((leader) => `<option value="${leader.id}">${escapeHtml(leader.name)}</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label for="work-section-active-new">Status</label>
              <select id="work-section-active-new" name="active">
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
            <button class="btn primary" type="submit">${icon("plus", 15)}Cadastrar</button>
          </form>
        </div>
        <div class="work-section-list">
          ${state.workSections.map((section) => renderWorkSectionItem(section, leaders)).join("") || `<div class="empty">Nenhuma equipe cadastrada.</div>`}
        </div>
      </section>`;
  }

  function renderWorkSectionItem(section, leaders) {
    const leader = leaders.find((item) => item.id === section.leaderId);
    return `
      <article class="work-section-card">
        <div class="work-section-card-head">
          <div>
            <strong>${escapeHtml(section.name)}</strong>
            <small class="block text-stone-500">Efetivo ${Number(section.headcount ?? 0)}${leader ? ` - ${escapeHtml(leader.name)}` : " - sem encarregado fixo"}</small>
          </div>
          <span class="meal-status-chip ${section.active ? "active" : "inactive"}">${section.active ? "Ativo" : "Inativo"}</span>
        </div>
        <details class="meal-catalog-edit">
          <summary>${icon("edit", 14)}Editar</summary>
          <form class="meal-catalog-item" data-form="work-section">
            <input type="hidden" name="id" value="${section.id}" />
            <div class="form-grid">
              <div class="field">
                <label for="work-section-name-${section.id}">Equipe/trecho</label>
                <input id="work-section-name-${section.id}" name="name" value="${escapeHtml(section.name)}" required />
              </div>
              <div class="field">
                <label for="work-section-headcount-${section.id}">Efetivo</label>
                <input id="work-section-headcount-${section.id}" name="headcount" type="number" min="0" value="${Number(section.headcount ?? 0)}" required />
              </div>
            </div>
            <div class="form-grid">
              <div class="field">
                <label for="work-section-leader-${section.id}">Encarregado</label>
                <select id="work-section-leader-${section.id}" name="leaderId">
                  <option value="">Sem vinculo fixo</option>
                  ${leaders.map((leader) => `<option value="${leader.id}" ${leader.id === section.leaderId ? "selected" : ""}>${escapeHtml(leader.name)}</option>`).join("")}
                </select>
              </div>
              <div class="field">
                <label for="work-section-active-${section.id}">Status</label>
                <select id="work-section-active-${section.id}" name="active">
                  <option value="true" ${section.active ? "selected" : ""}>Ativo</option>
                  <option value="false" ${!section.active ? "selected" : ""}>Inativo</option>
                </select>
              </div>
            </div>
            <footer class="settings-actions">
              <button class="btn outline small" type="submit">Salvar</button>
            </footer>
          </form>
        </details>
      </article>`;
  }

  function renderMealCatalogPanel(user) {
    const state = getState();
    if (!["admin", "fornecedor"].includes(user.role)) return "";
    return `
      <section class="settings-panel meal-catalog-panel">
        <div class="settings-panel-title">
          <span>${icon("utensils", 18)}</span>
          <div><h2>Tipos de alimentacao</h2><p>${user.role === "fornecedor" ? "Cadastre o tipo e o que vem na marmita." : "Gerencie tipos e precos individuais."}</p></div>
        </div>
        <div class="meal-catalog-toolbar">
          <span class="text-xs font-black text-stone-500">${state.mealCatalog.length} tipos cadastrados</span>
          <button class="btn primary small" type="button" data-open-new-meal>${icon("plus", 15)}Novo</button>
        </div>
        <details class="meal-catalog-new" data-new-meal-panel>
          <summary>${icon("plus", 15)}Novo tipo de alimento <span>${icon("arrow", 14)}</span></summary>
          <form class="meal-catalog-new-form" data-form="meal-catalog">
            <input type="hidden" name="id" value="" />
            <div class="form-grid">
              <div class="field">
                <label for="new-meal-name">Nome do tipo</label>
                <input id="new-meal-name" name="name" placeholder="Ex.: Marmita proteica" required />
              </div>
              <div class="field">
                <label for="new-meal-price">Preco unitario</label>
                <input id="new-meal-price" name="unitPrice" type="number" min="0" step="0.01" value="${Number(state.settings.defaultMealUnitPrice ?? 0)}" required />
              </div>
            </div>
            <div class="form-grid">
              <div class="field">
                <label for="new-meal-active">Status</label>
                <select id="new-meal-active" name="active">
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label for="new-meal-description">O que vem nessa marmita</label>
              <textarea id="new-meal-description" name="description" placeholder="Ex.: arroz, feijao, frango grelhado, salada e farofa"></textarea>
            </div>
            <footer class="settings-actions">
              <button class="btn primary" type="submit">${icon("plus", 15)}Cadastrar</button>
            </footer>
          </form>
        </details>
        <div class="meal-catalog-list">
          ${state.mealCatalog.map(renderMealCatalogItem).join("") || `<div class="empty">Nenhum tipo cadastrado.</div>`}
        </div>
      </section>`;
  }

  function renderMealCatalogItem(meal) {
    const statusClass = meal.active ? "active" : "inactive";
    return `
      <article class="meal-catalog-card">
        <div class="meal-catalog-card-head">
          <div class="meal-catalog-card-title">
            <strong>${escapeHtml(meal.label)}</strong>
            <p>${escapeHtml(meal.description || "Sem composicao informada.")}</p>
          </div>
          <div class="meal-catalog-card-actions">
            <button class="icon-btn danger" type="button" data-delete-meal-type="${meal.id}" aria-label="Excluir ${escapeHtml(meal.label)}">${icon("trash", 15)}</button>
          </div>
        </div>
        <div class="flex flex-wrap gap-1">
          <span class="meal-status-chip ${statusClass}">${meal.active ? "Ativo" : "Inativo"}</span>
          <span class="meal-price-chip">${money(meal.unitPrice)}</span>
        </div>
        <details class="meal-catalog-edit">
          <summary>${icon("edit", 14)}Editar</summary>
          <form class="meal-catalog-item" data-form="meal-catalog">
            <input type="hidden" name="id" value="${meal.id}" />
            <div class="form-grid">
              <div class="field">
                <label for="meal-name-${meal.id}">Tipo</label>
                <input id="meal-name-${meal.id}" name="name" value="${escapeHtml(meal.label)}" required />
              </div>
              <div class="field">
                <label for="meal-price-${meal.id}">Preco unitario</label>
                <input id="meal-price-${meal.id}" name="unitPrice" type="number" min="0" step="0.01" value="${Number(meal.unitPrice ?? 0)}" required />
              </div>
            </div>
            <div class="field">
              <label for="meal-active-${meal.id}">Status</label>
              <select id="meal-active-${meal.id}" name="active">
                <option value="true" ${meal.active ? "selected" : ""}>Ativo</option>
                <option value="false" ${!meal.active ? "selected" : ""}>Inativo</option>
              </select>
            </div>
            <div class="field">
              <label for="meal-description-${meal.id}">O que vem nessa marmita</label>
              <textarea id="meal-description-${meal.id}" name="description">${escapeHtml(meal.description)}</textarea>
            </div>
            <footer class="meal-catalog-footer">
              <span>${meal.active ? "Disponivel nos pedidos" : "Oculto para novos pedidos"}</span>
              <button class="btn outline small" type="submit">Salvar</button>
            </footer>
          </form>
        </details>
      </article>`;
  }

  return renderConfiguracoes;
}
