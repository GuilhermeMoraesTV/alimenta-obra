import { icon } from "./icons.js";
import { escapeHtml } from "../utils/formatters.js";

const appIcon = `${import.meta.env.BASE_URL}assets/icone-alimentaobra.png`;
const appLogo = `${import.meta.env.BASE_URL}assets/logo-alimentaobra.png`;

export function renderLoginScreen({ initialInviteToken, isSupabaseConfigured, loginMode }) {
  return `
    <section class="grid min-h-screen bg-[#1b1c1a] p-4 md:p-8">
      <div class="m-auto grid min-h-[min(720px,calc(100vh-48px))] w-full max-w-6xl overflow-hidden rounded-[18px] border border-white/10 bg-[#262825] shadow-2xl lg:grid-cols-[minmax(0,1fr)_minmax(380px,.72fr)]">
        <div class="relative hidden flex-col justify-between overflow-hidden bg-[#171916] p-10 text-white lg:flex lg:p-16">
          <div class="flex items-center">
            <img class="h-28 w-auto max-w-[460px] object-contain" src="${appLogo}" alt="AlimentaObra" />
          </div>
          <div>
            <span class="text-[11px] font-black uppercase tracking-[.12em] text-orange-200">Gestao de alimentacao</span>
            <h1 class="mt-3 max-w-2xl text-[56px] font-black leading-[.94] tracking-normal">Organize os pedidos da obra com clareza.</h1>
            <p class="mt-4 max-w-lg text-base leading-7 text-white/65">Uma area segura para registrar, acompanhar e manter a rotina de refeicoes organizada.</p>
          </div>
        </div>
        <div class="flex flex-col justify-center bg-[#fffefa] p-6 md:p-10">
          <div class="mb-7 grid grid-cols-2 gap-1 rounded-xl border border-stone-200 bg-stone-100 p-1">
            <button class="min-h-10 rounded-lg text-sm font-black ${loginMode === "login" ? "bg-white text-stone-950 shadow-sm" : "text-stone-500"}" data-login-mode="login">Login</button>
            <button class="min-h-10 rounded-lg text-sm font-black ${loginMode === "cadastro" ? "bg-white text-stone-950 shadow-sm" : "text-stone-500"}" data-login-mode="cadastro">Cadastro</button>
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
    <div class="mb-6 flex items-start gap-3">
      <img class="h-10 w-10 rounded-xl object-cover shadow-sm" src="${appIcon}" alt="AlimentaObra" />
      <div>
        <div class="text-3xl font-black tracking-normal">Entrar</div>
        <p class="mt-1 text-sm text-stone-500">Entre com seu e-mail e senha.</p>
      </div>
    </div>
    ${!isSupabaseConfigured ? `<div class="mb-4 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-4 text-center text-sm font-bold text-stone-500">Configure o arquivo .env.local antes de entrar.</div>` : ""}
    <form class="grid gap-4" data-form="login">
      <div class="grid gap-1.5">
        <label class="text-[10px] font-black uppercase tracking-[.08em] text-stone-500" for="login-email">E-mail</label>
        <input class="min-h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-100" id="login-email" name="email" type="email" autocomplete="email" required />
      </div>
      <div class="grid gap-1.5">
        <label class="text-[10px] font-black uppercase tracking-[.08em] text-stone-500" for="login-pass">Senha</label>
        <div class="relative">
          <input class="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 pr-11 text-sm outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-100" id="login-pass" name="password" type="password" autocomplete="current-password" minlength="8" required />
          <button type="button" class="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-stone-500 hover:bg-orange-50 hover:text-orange-700" data-toggle-password="login-pass" aria-label="Mostrar senha">${icon("eye", 16)}</button>
        </div>
      </div>
      <button class="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-orange-600 px-4 text-sm font-black text-white shadow-[0_10px_22px_rgba(239,91,29,.2)] disabled:opacity-50" type="submit" ${isSupabaseConfigured ? "" : "disabled"}>Entrar no sistema</button>
    </form>`;
}

function renderRegisterForm({ initialInviteToken, isSupabaseConfigured }) {
  return `
    <div class="mb-6 flex items-start gap-3">
      <div class="grid h-10 w-10 place-items-center rounded-xl bg-orange-600 text-lg font-black text-white">+</div>
      <div>
        <div class="text-3xl font-black tracking-normal">Criar acesso</div>
        <p class="mt-1 text-sm text-stone-500">${initialInviteToken ? "Convite privado detectado." : "Novos cadastros entram como encarregado."}</p>
      </div>
    </div>
    ${initialInviteToken ? `<div class="mb-4 inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-bold text-orange-700">${icon("settings", 15)}Ao concluir, seu perfil sera liberado conforme o convite.</div>` : ""}
    <form class="grid gap-4" data-form="register">
      <input type="hidden" name="inviteToken" value="${escapeHtml(initialInviteToken)}" />
      <div class="grid gap-1.5">
        <label class="text-[10px] font-black uppercase tracking-[.08em] text-stone-500" for="register-name">Nome completo</label>
        <input class="min-h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-100" id="register-name" name="name" placeholder="Ex.: Carlos Almeida" required />
      </div>
      <div class="grid gap-1.5">
        <label class="text-[10px] font-black uppercase tracking-[.08em] text-stone-500" for="register-email">E-mail</label>
        <input class="min-h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-100" id="register-email" name="email" type="email" placeholder="nome@obra.com" required />
      </div>
      <div class="grid gap-1.5">
        <label class="text-[10px] font-black uppercase tracking-[.08em] text-stone-500" for="register-team">Equipe / frente</label>
        <input class="min-h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-100" id="register-team" name="team" placeholder="Frente Sul" required />
      </div>
      <div class="grid gap-1.5">
        <label class="text-[10px] font-black uppercase tracking-[.08em] text-stone-500" for="register-pass">Senha</label>
        <div class="relative">
          <input class="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 pr-11 text-sm outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-100" id="register-pass" name="password" type="password" minlength="8" autocomplete="new-password" required />
          <button type="button" class="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-stone-500 hover:bg-orange-50 hover:text-orange-700" data-toggle-password="register-pass" aria-label="Mostrar senha">${icon("eye", 16)}</button>
        </div>
      </div>
      <button class="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-orange-600 px-4 text-sm font-black text-white shadow-[0_10px_22px_rgba(239,91,29,.2)] disabled:opacity-50" type="submit" ${isSupabaseConfigured ? "" : "disabled"}>Criar conta</button>
    </form>`;
}
