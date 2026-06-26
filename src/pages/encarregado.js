export function createLeaderPages(ctx) {
  const {
    canEditRequest,
    countStatus,
    escapeHtml,
    formatDate,
    formatDateTime,
    getLeaderAddressFormOpen,
    getState,
    icon,
    locationOptions,
    renderEmptyState,
    renderRequestTable,
    requestMealDescription,
    STATUS_LABEL,
    sumQty,
    topbar
  } = ctx;

  function leaderRequests(user, includeCancelled = true) {
    return getState().requests
      .filter((request) => request.leaderId === user.id && (includeCancelled || request.status !== "cancelado"))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  function renderLeaderHome(user) {
    const state = getState();
    const rows = leaderRequests(user);
    const activeRows = rows.filter((request) => request.status !== "cancelado");
    const mealDate = state.settings.defaultMealDate;
    const todayRows = activeRows.filter((request) => request.date === mealDate);
    const featuredRequest = todayRows[0] ?? activeRows[0] ?? rows[0];
    const todayQuantity = sumQty(todayRows);
    const homeStatus = featuredRequest
      ? (featuredRequest.date === mealDate ? "Pedido de hoje" : "Ultimo pedido")
      : "Sem pedido ativo";

    return `
      <div class="leader-page leader-home">
        <section class="leader-today-hero">
          <div class="leader-today-top">
            <div>
              <span class="compact-kicker">Hoje</span>
              <h1>${featuredRequest ? homeStatus : "Sem pedido ativo"}</h1>
            </div>
            <button class="btn primary leader-primary-action" data-view="pedido">${icon("plus", 17)}Novo pedido</button>
          </div>
          <div class="leader-today-deadline">
            <span>${icon("clock", 15)}Prazo: ate ${state.settings.cutoffTime} do dia anterior</span>
            <span>${icon("utensils", 15)}${todayQuantity} refeicoes hoje</span>
          </div>
        </section>
        <section class="today-focus">
          <div class="today-focus-head">
            <button class="text-action" data-view="historico">Pedidos anteriores ${icon("arrow", 15)}</button>
          </div>
          ${featuredRequest
            ? renderLeaderRequestCard(featuredRequest)
            : `<div class="today-empty">
                <span class="leader-empty-icon">${icon("clipboard", 22)}</span>
                <strong>Nada pendente para ${formatDate(mealDate)}</strong>
                <p>Quando precisar alimentar a equipe, crie o pedido em poucos passos.</p>
                <button class="btn primary" data-view="pedido">${icon("plus", 15)}Novo pedido</button>
              </div>`}
          <div class="today-mini-strip">
            <span>${icon("utensils", 14)}${todayQuantity} refeicoes para hoje</span>
            <span>${icon("clipboard", 14)}${countStatus(activeRows, "rascunho")} rascunho${countStatus(activeRows, "rascunho") === 1 ? "" : "s"}</span>
          </div>
        </section>
      </div>`;
  }

  function renderPedido(user) {
    const date = getState().settings.defaultMealDate;
    return `
      <div class="leader-page leader-orders">
        <header class="leader-order-header">
          <div>
            <span class="compact-kicker">Fazer pedido</span>
            <h1>Novo pedido</h1>
          </div>
        </header>
        ${renderLeaderRequestForm(user, date)}
      </div>`;
  }

  function renderLeaderRequestForm(user, date) {
    const state = getState();
    const authenticatedUser = state.users.find((item) => item.id === state.authenticatedUserId);
    const canManageAddresses = user.id === state.authenticatedUserId || authenticatedUser?.role === "admin";

    if (!state.mealTypes.length) {
      return renderEmptyState(
        "Nenhuma alimentacao ativa",
        "Administrador ou fornecedor precisa cadastrar um tipo de alimentacao antes do pedido."
      );
    }

    return `
      <form class="leader-request-form" data-form="request">
        <section class="form-section form-section-emphasis">
          <div class="form-section-title">
            <span>1</span>
            <div><h2>Quando e quantas?</h2></div>
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
            <span>2</span>
            <div><h2>Qual refeicao?</h2></div>
          </div>
          <div class="type-grid leader-type-grid">
            ${state.mealTypes.map((meal, index) => `
              <label class="meal-choice">
                <input type="radio" name="mealTypeId" value="${meal.id}" ${index === 0 ? "checked" : ""} />
                <span class="meal-choice-icon">${icon(index === 0 ? "package" : "utensils", 20)}</span>
                <span class="meal-choice-copy">
                  <span class="choice-title">${escapeHtml(meal.label)}</span>
                  <span class="choice-sub">${escapeHtml(meal.description || meal.locations.map((item) => item.name).join(" ou "))}</span>
                </span>
                <span class="meal-choice-check"></span>
              </label>`).join("")}
          </div>
        </section>
        <section class="form-section">
          <div class="form-section-title">
            <span>3</span>
            <div><h2>Onde entrega?</h2></div>
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
              ${canManageAddresses && getLeaderAddressFormOpen() ? renderDeliveryAddressForm() : ""}
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
    const rows = getState().deliveryAddresses.filter((address) => address.leaderId === leaderId && address.active !== false);
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
        `<button class="btn primary small" data-view="pedido">${icon("plus", 15)}Novo pedido</button>`
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
    const editable = canEditRequest(getState(), request);
    const composition = requestMealDescription(request);
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
            ${composition ? `<div class="request-card-composition">${escapeHtml(composition)}</div>` : ""}
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

  function renderHistorico(user, embedded = false) {
    const rows = leaderRequests(user);
    if (user.role === "encarregado" && !embedded) {
      return `
        <div class="leader-page leader-orders">
          <header class="leader-order-header">
            <div>
              <span class="compact-kicker">Historico</span>
              <h1>Pedidos anteriores</h1>
            </div>
            <button class="btn primary small" data-view="pedido">${icon("plus", 15)}Novo pedido</button>
          </header>
          ${renderLeaderHistory(user, rows)}
        </div>`;
    }

    return `
      ${embedded ? "" : topbar("Historico de pedidos", "Solicitacoes feitas pela sua equipe")}
      <div class="table-panel">
        <h2 class="section-title">${embedded ? "Pedidos recentes" : "Todos os pedidos"}</h2>
        ${renderRequestTable(rows, { showLeader: false, editable: true })}
      </div>`;
  }

  return {
    historico: renderHistorico,
    inicio: renderLeaderHome,
    pedido: renderPedido
  };
}
