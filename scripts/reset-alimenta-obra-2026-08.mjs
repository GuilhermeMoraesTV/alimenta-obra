import { createClient } from "@supabase/supabase-js";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const projectRef = "nahretmwgwuqjhhqwjpd";
const adminEmail = "admin@gmail.com";
const adminPassword = "admin123";
const outputDir = "output";
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const snapshotPath = path.join(outputDir, `reset-snapshot-before-${timestamp}.json`);
const summaryPath = path.join(outputDir, `reset-summary-${timestamp}.json`);

const users = [
  {
    email: "fornecedor.marmita@alimentaobra.com",
    password: "FornMarmita#2026",
    name: "Fornecedor Marmitas",
    role: "fornecedor",
    team: "Fornecedor Marmitas"
  },
  {
    email: "fornecedor.buffer@alimentaobra.com",
    password: "FornBuffer#2026",
    name: "Fornecedor Buffer",
    role: "fornecedor",
    team: "Fornecedor Buffer"
  },
  {
    email: "fornecedor.janta@alimentaobra.com",
    password: "FornJanta#2026",
    name: "Fornecedor Janta",
    role: "fornecedor",
    team: "Fornecedor Janta"
  },
  {
    email: "encarregado.campo1@alimentaobra.com",
    password: "EncCampo1#2026",
    name: "Encarregado Campo Norte",
    role: "encarregado",
    team: "Campo Norte"
  },
  {
    email: "encarregado.campo2@alimentaobra.com",
    password: "EncCampo2#2026",
    name: "Encarregado Campo Sul",
    role: "encarregado",
    team: "Campo Sul"
  },
  {
    email: "encarregado.canteiro1@alimentaobra.com",
    password: "EncCant1#2026",
    name: "Encarregado Canteiro Central",
    role: "encarregado",
    team: "Canteiro Central"
  },
  {
    email: "encarregado.canteiro2@alimentaobra.com",
    password: "EncCant2#2026",
    name: "Encarregado Canteiro Apoio",
    role: "encarregado",
    team: "Canteiro Apoio"
  },
  {
    email: "encarregado.escritorio@alimentaobra.com",
    password: "EncEscrit#2026",
    name: "Encarregado Escritorio Administrativo",
    role: "encarregado",
    team: "Escritorio Administrativo"
  }
];

function readEnv() {
  if (!existsSync(".env.local")) throw new Error(".env.local nao encontrado.");
  return Object.fromEntries(
    readFileSync(".env.local", "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1).replace(/^"|"$/g, "")];
      })
  );
}

function parseCliJson(stdout) {
  const text = String(stdout ?? "");
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Nao foi possivel interpretar JSON do Supabase CLI: ${text}`);
  }
  return JSON.parse(text.slice(start, end + 1));
}

function dbQuery(sqlOrFile, { file = false } = {}) {
  const args = ["supabase@latest", "db", "query", "--linked"];
  if (file) {
    args.push("--file", sqlOrFile);
  } else {
    args.push(sqlOrFile);
  }

  const command = process.platform === "win32" ? "cmd.exe" : "npx";
  const commandArgs = process.platform === "win32" ? ["/c", "npx", ...args] : args;
  const result = spawnSync(command, commandArgs, {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 20
  });
  if (result.status !== 0) {
    throw new Error(
      [
        `Supabase CLI falhou (${result.status}) em ${file ? sqlOrFile : "query"}.`,
        result.error ? `Erro do processo: ${result.error.message}` : "",
        result.signal ? `Sinal: ${result.signal}` : "",
        result.stdout,
        result.stderr
      ]
        .filter(Boolean)
        .join("\n")
    );
  }
  return parseCliJson(result.stdout);
}

async function signIn(supabase, email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { email, ok: false, error: error?.message ?? "Usuario nao retornado." };
  }
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,name,email,role,team,active")
    .eq("id", data.user.id)
    .maybeSingle();
  await supabase.auth.signOut();
  return {
    email,
    ok: !profileError && Boolean(profile),
    userId: data.user.id,
    profile,
    error: profileError?.message ?? null
  };
}

async function emptyStoragePrefix(bucket, client, prefix = "") {
  const { data, error } = await client.storage.from(bucket).list(prefix, {
    limit: 1000,
    sortBy: { column: "name", order: "asc" }
  });
  if (error) {
    if (/bucket not found|not found/i.test(error.message)) return [];
    throw new Error(`Falha ao listar storage ${bucket}/${prefix}: ${error.message}`);
  }

  const removed = [];
  const files = [];
  for (const item of data ?? []) {
    const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id || item.metadata) {
      files.push(itemPath);
    } else {
      removed.push(...(await emptyStoragePrefix(bucket, client, itemPath)));
    }
  }

  if (files.length) {
    const { data: removedData, error: removeError } = await client.storage.from(bucket).remove(files);
    if (removeError) throw new Error(`Falha ao remover storage ${bucket}: ${removeError.message}`);
    removed.push(...(removedData ?? []).map((item) => item.name ?? item.id ?? null).filter(Boolean));
  }
  return removed;
}

async function main() {
  const env = readEnv();
  if (env.VITE_SUPABASE_URL !== `https://${projectRef}.supabase.co`) {
    throw new Error(`Projeto inesperado em .env.local: ${env.VITE_SUPABASE_URL}`);
  }
  if (!env.VITE_SUPABASE_PUBLISHABLE_KEY) throw new Error("VITE_SUPABASE_PUBLISHABLE_KEY ausente.");
  mkdirSync(outputDir, { recursive: true });

  const adminClient = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const adminLogin = await signIn(adminClient, adminEmail, adminPassword);
  if (!adminLogin.ok || adminLogin.profile?.role !== "admin") {
    throw new Error(`Login admin invalido antes do reset: ${JSON.stringify(adminLogin)}`);
  }

  const snapshot = dbQuery("scripts/reset-alimenta-obra-snapshot.sql", { file: true }).rows[0].snapshot;
  writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));

  const storageClient = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { error: storageLoginError } = await storageClient.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword
  });
  if (storageLoginError) {
    throw new Error(`Nao foi possivel autenticar admin para limpar Storage: ${storageLoginError.message}`);
  }
  const removedStorageObjects = await emptyStoragePrefix("supplier-documents", storageClient);
  await storageClient.auth.signOut();

  dbQuery("scripts/reset-alimenta-obra-clean.sql", { file: true });

  const caller = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data: sessionData, error: sessionError } = await caller.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword
  });
  if (sessionError || !sessionData.session) {
    throw new Error(`Nao foi possivel autenticar admin apos limpeza: ${sessionError?.message}`);
  }

  const createdUsers = [];
  for (const user of users) {
    const response = await fetch(`${env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`, {
      method: "POST",
      headers: {
        apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${sessionData.session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action: "create", ...user })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`admin-create-user falhou para ${user.email}: ${JSON.stringify(body)}`);
    }
    createdUsers.push({ email: user.email, role: user.role, id: body.id });
  }
  await caller.auth.signOut();

  dbQuery("scripts/reset-alimenta-obra-seed.sql", { file: true });

  const verification = dbQuery("scripts/reset-alimenta-obra-verify.sql", { file: true }).rows[0].verification;

  const loginClient = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const loginChecks = [];
  loginChecks.push(await signIn(loginClient, adminEmail, adminPassword));
  loginChecks.push(await signIn(loginClient, "fornecedor.marmita@alimentaobra.com", "FornMarmita#2026"));
  loginChecks.push(await signIn(loginClient, "encarregado.campo1@alimentaobra.com", "EncCampo1#2026"));

  const summary = {
    projectRef,
    snapshotPath,
    removedStorageObjects,
    createdUsers,
    verification,
    loginChecks,
    credentials: [
      { email: adminEmail, password: adminPassword, role: "admin" },
      ...users.map(({ email, password, role }) => ({ email, password, role }))
    ]
  };
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({ snapshotPath, summaryPath, verification, loginChecks }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
