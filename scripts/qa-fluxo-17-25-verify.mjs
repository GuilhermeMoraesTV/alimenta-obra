import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function readEnv() {
  return Object.fromEntries(
    readFileSync(".env.local", "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1).replace(/^"|"$/g, "")];
      })
  );
}

function summarizeError(error) {
  if (!error) return null;
  return {
    name: error.name ?? null,
    message: error.message ?? null,
    status: error.status ?? null,
    code: error.code ?? null,
    keys: Object.keys(error)
  };
}

async function signIn(label, email, password = "admin123") {
  const env = readEnv();
  const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  const user = data?.user ?? null;
  let profile = null;
  let counts = {};

  if (user && !error) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id,name,email,role,team,active")
      .eq("id", user.id)
      .maybeSingle();
    profile = profileData;

    const [{ count: requestCount }, { count: consolidationCount }, { count: supplierCount }] = await Promise.all([
      supabase.from("meal_requests").select("id", { count: "exact", head: true }),
      supabase.from("consolidations").select("id", { count: "exact", head: true }),
      supabase.from("supplier_companies").select("id", { count: "exact", head: true })
    ]);
    counts = { requestCount, consolidationCount, supplierCount };
  }

  return {
    label,
    ok: Boolean(user && !error),
    email,
    userId: user?.id ?? null,
    profile,
    counts,
    error: summarizeError(error)
  };
}

const users = [
  ["Admin", "admin@admin.com"],
  ["Encarregado Campo", "encarregado.campo@teste.com"],
  ["Encarregado Canteiro", "encarregado.canteiro@teste.com"],
  ["Fornecedor Marmita", "fornecedor.marmita@teste.com"],
  ["Fornecedor Buffet", "fornecedor.buffet@teste.com"],
  ["Fornecedor Janta", "fornecedor.janta@teste.com"]
];

const results = [];
for (const [label, email] of users) {
  results.push(await signIn(label, email));
}

console.log(JSON.stringify({ results }, null, 2));
