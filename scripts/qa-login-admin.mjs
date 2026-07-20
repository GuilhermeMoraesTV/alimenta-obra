import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1).replace(/^"|"$/g, "")];
    })
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const { data, error } = await supabase.auth.signInWithPassword({
  email: process.env.QA_ADMIN_EMAIL,
  password: process.env.QA_ADMIN_PASSWORD
});

console.log(JSON.stringify({
  ok: !error,
  error: error?.message ?? null,
  user: data?.user?.email ?? null
}, null, 2));
