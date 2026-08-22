import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : "";
const legacyStorageKey = supabaseHost ? `sb-${supabaseHost.split(".")[0]}-auth-token` : "";
export const supabaseStorageKey = "alimenta-obra-auth-token";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: supabaseStorageKey
      }
    })
  : null;

export function clearLocalSupabaseSession() {
  if (typeof localStorage === "undefined") return;
  try {
    [supabaseStorageKey, `${supabaseStorageKey}-code-verifier`, `${supabaseStorageKey}-user`,
      legacyStorageKey, `${legacyStorageKey}-code-verifier`, `${legacyStorageKey}-user`]
      .filter(Boolean)
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // Storage can be blocked in injected/embedded browser contexts.
  }
}

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase não configurado. Copie .env.example para .env.local e informe a URL e a chave publicável."
    );
  }
  return supabase;
}
