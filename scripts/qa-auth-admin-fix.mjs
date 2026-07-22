import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const emails = [
  "admin@admin.com",
  "encarregado.campo@teste.com",
  "encarregado.canteiro@teste.com",
  "encarregado.escritorio@teste.com",
  "encarregado.noite@teste.com",
  "fornecedor.marmita@teste.com",
  "fornecedor.buffet@teste.com",
  "fornecedor.janta@teste.com"
];

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

const env = readEnv();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY ausente.");

const supabase = createClient(env.VITE_SUPABASE_URL, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const results = [];
for (const email of emails) {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,name,email,role,team,active")
    .eq("email", email)
    .maybeSingle();
  if (profileError) throw profileError;
  if (!profile?.id) {
    results.push({ email, ok: false, reason: "profile_not_found" });
    continue;
  }

  const { data, error } = await supabase.auth.admin.updateUserById(profile.id, {
    email,
    password: "admin123",
    email_confirm: true,
    user_metadata: {
      sub: profile.id,
      email,
      email_verified: true,
      phone_verified: false,
      name: profile.name,
      team: profile.team
    },
    app_metadata: {
      provider: "email",
      providers: ["email"]
    }
  });
  results.push({ email, ok: !error, userId: data?.user?.id ?? null, error: error?.message ?? null });
}

console.log(JSON.stringify({ results }, null, 2));
