import { icon } from "./icons.js";
import { escapeHtml } from "../utils/formatters.js";

export function renderLoginScreen({ initialInviteToken, isSupabaseConfigured, loginMode }) {
  return `
    <section class="login-screen">
      <div class="login-showcase">
        <div class="login-hero">
          <div class="brand brand-large">
            <div class="brand-mark">AO</div>
            <div class="brand-name">Alimenta<span>Obra</span></div>
          </div>
          <div class="login-hero-copy">
            <span class="login-kicker">Gestao de alimentacao</span>
            <h1>Organize os pedidos da obra com clareza.</h1>
            <p>Uma area segura para registrar, acompanhar e manter a rotina de refeicoes organizada.</p>
          </div>
        </div>
        <div class="login-card">
          <div class="login-tabs">
            <button class="${loginMode === "login" ? "active" : ""}" data-login-mode="login">Login</button>
            <button class="${loginMode === "cadastro" ? "active" : ""}" data-login-mode="cadastro">Cadastro</button>
          </div>
          ${loginMode === "login"
            ? renderLoginForm({ isSupabaseConfigured })
            : renderRegisterForm({ initialInviteToken, isSupabaseConfigured })}
        </div>
      </div>
    </section>
  `;
}

function renderLoginForm({ isSupabaseConfigured }) {
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
        <div class="password-field">
          <input id="login-pass" name="password" type="password" autocomplete="current-password" minlength="8" required />
          <button type="button" class="password-toggle" data-toggle-password="login-pass" aria-label="Mostrar senha">${icon("eye", 16)}</button>
        </div>
      </div>
      <button class="btn primary full" type="submit" ${isSupabaseConfigured ? "" : "disabled"}>Entrar no sistema</button>
    </form>`;
}

function renderRegisterForm({ initialInviteToken, isSupabaseConfigured }) {
  return `
    <div class="brand login-brand">
      <div class="brand-mark">+</div>
      <div>
        <div class="brand-name">Criar acesso</div>
        <p class="login-subtitle">${initialInviteToken ? "Convite privado detectado." : "Novos cadastros entram como encarregado."}</p>
      </div>
    </div>
    ${initialInviteToken ? `<div class="invite-notice">${icon("settings", 15)}Ao concluir, seu perfil sera liberado conforme o convite.</div>` : ""}
    <form data-form="register">
      <input type="hidden" name="inviteToken" value="${escapeHtml(initialInviteToken)}" />
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
        <div class="password-field">
          <input id="register-pass" name="password" type="password" minlength="8" autocomplete="new-password" required />
          <button type="button" class="password-toggle" data-toggle-password="register-pass" aria-label="Mostrar senha">${icon("eye", 16)}</button>
        </div>
      </div>
      <button class="btn primary full" type="submit" ${isSupabaseConfigured ? "" : "disabled"}>Criar conta</button>
    </form>`;
}
