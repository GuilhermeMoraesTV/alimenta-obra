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

  function renderConfiguracoes() {
    const state = getState();
    const user = state.users.find((item) => item.id === state.authenticatedUserId);
    if (!user) return renderEmptyState("Sessao expirada", "Entre novamente para alterar suas configuracoes.");
    const canManageCatalog = ["admin", "fornecedor"].includes(user.role);

    return `
      <section class="settings-page">
        <header class="settings-header">
          <div>
            <span class="compact-kicker">Configuracoes</span>
            <h1>${canManageCatalog ? "Conta e catalogo" : "Minha conta"}</h1>
            <p>${canManageCatalog ? "Mantenha dados de acesso, tipos de alimentacao e composicao das marmitas." : "Atualize seus dados de acesso e as informacoes que aparecem no sistema."}</p>
          </div>
          ${renderAdminBackButton()}
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
                <input id="settings-name" name="name" value="${user.name}" required />
              </div>
              <div class="field">
                <label for="settings-team">Equipe / frente</label>
                <input id="settings-team" name="team" value="${user.team || ""}" placeholder="Ex.: Frente Norte" />
              </div>
            </div>
            <div class="form-grid">
              <div class="field">
                <label>E-mail</label>
                <input value="${user.email}" disabled />
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
          ${user.role === "admin" ? renderMealPricePanel() : ""}
          ${user.role === "admin" ? renderAccessInvitePanel() : ""}
          ${canManageCatalog ? renderMealCatalogPanel(user) : ""}
        </div>
      </section>`;
  }

  function renderMealPricePanel() {
    const state = getState();
    return `
      <form class="settings-panel settings-panel-wide" data-form="meal-price-settings">
        <div class="settings-panel-title">
          <span>${icon("chart", 18)}</span>
          <div><h2>Preco unico</h2><p>Valor aplicado a todos os tipos de alimentacao.</p></div>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="settings-meal-price">Preco por refeicao</label>
            <input id="settings-meal-price" name="unitPrice" type="number" min="0" step="0.01" value="${state.settings.defaultMealUnitPrice}" required />
          </div>
          <div class="settings-price-preview">
            <span>Referencia atual</span>
            <strong>${money(state.settings.defaultMealUnitPrice)}</strong>
            <small>por refeicao, independente do tipo</small>
          </div>
        </div>
        <footer class="settings-actions">
          <button class="btn primary" type="submit">Salvar preco</button>
        </footer>
      </form>`;
  }

  function renderMealCatalogPanel(user) {
    const state = getState();
    return `
      <section class="settings-panel settings-panel-wide meal-catalog-panel">
        <div class="settings-panel-title">
          <span>${icon("utensils", 18)}</span>
          <div><h2>Tipos de alimentacao</h2><p>${user.role === "fornecedor" ? "Cadastre o tipo e o que vem na marmita." : "Gerencie os tipos disponiveis para pedidos."}</p></div>
        </div>
        <div class="meal-catalog-list">
          ${state.mealCatalog.map(renderMealCatalogItem).join("") || `<div class="empty">Nenhum tipo cadastrado.</div>`}
        </div>
        <form class="meal-catalog-new" data-form="meal-catalog">
          <input type="hidden" name="id" value="" />
          <div class="form-grid">
            <div class="field">
              <label for="new-meal-name">Novo tipo</label>
              <input id="new-meal-name" name="name" placeholder="Ex.: Marmita proteica" required />
            </div>
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
            <button class="btn primary" type="submit">${icon("plus", 15)}Cadastrar tipo</button>
          </footer>
        </form>
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

  function renderMealCatalogItem(meal) {
    return `
      <form class="meal-catalog-item" data-form="meal-catalog">
        <input type="hidden" name="id" value="${meal.id}" />
        <div class="form-grid">
          <div class="field">
            <label for="meal-name-${meal.id}">Tipo</label>
            <input id="meal-name-${meal.id}" name="name" value="${escapeHtml(meal.label)}" required />
          </div>
          <div class="field">
            <label for="meal-active-${meal.id}">Status</label>
            <select id="meal-active-${meal.id}" name="active">
              <option value="true" ${meal.active ? "selected" : ""}>Ativo</option>
              <option value="false" ${!meal.active ? "selected" : ""}>Inativo</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label for="meal-description-${meal.id}">O que vem nessa marmita</label>
          <textarea id="meal-description-${meal.id}" name="description">${escapeHtml(meal.description)}</textarea>
        </div>
        <footer class="meal-catalog-footer">
          <span>${meal.active ? "Disponivel nos pedidos" : "Oculto para novos pedidos"}</span>
          <button class="btn outline small" type="submit">Salvar</button>
        </footer>
      </form>`;
  }

  return renderConfiguracoes;
}
