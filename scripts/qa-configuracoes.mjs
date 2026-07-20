import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function readEnv() {
  const text = readFileSync(".env.local", "utf8");
  return Object.fromEntries(
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1).replace(/^"|"$/g, "")];
      })
  );
}

function fail(label, error) {
  const message = error?.message || error?.error_description || JSON.stringify(error);
  throw new Error(`${label}: ${message}`);
}

function assert(condition, label) {
  if (!condition) throw new Error(label);
}

async function rpc(client, name, params) {
  const { data, error } = await client.rpc(name, params);
  if (error) fail(`RPC ${name}`, error);
  return data;
}

async function selectOk(client, table, query = "id") {
  const { data, error } = await client.from(table).select(query).limit(3);
  if (error) fail(`SELECT ${table}`, error);
  return data;
}

const env = readEnv();
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const adminEmail = process.env.QA_ADMIN_EMAIL;
const adminPassword = process.env.QA_ADMIN_PASSWORD;
const userPassword = "CodexQaUser2026!";
const domain = "alimentaobra.local";

if (!adminEmail || !adminPassword) {
  throw new Error("Informe QA_ADMIN_EMAIL e QA_ADMIN_PASSWORD com um login Admin valido para rodar este teste.");
}

const emails = {
  leader: `codex.qa.leader.${stamp}@${domain}`,
  supplier: `codex.qa.supplier.${stamp}@${domain}`,
  admin: `codex.qa.created-admin.${stamp}@${domain}`
};

const { error: signInError } = await supabase.auth.signInWithPassword({
  email: adminEmail,
  password: adminPassword
});
if (signInError) fail("Login Admin QA", signInError);

await selectOk(supabase, "supplier_companies");
await selectOk(supabase, "supplier_company_users", "supplier_company_id,user_id,active");
await selectOk(supabase, "supplier_meal_types", "supplier_company_id,meal_type_id,active,unit_price");
await selectOk(supabase, "work_section_meal_types", "work_section_id,meal_type_id,active");

const inviteToken = `codex-qa-${stamp}`;
await rpc(supabase, "create_access_invite", {
  p_token: inviteToken,
  p_role: "fornecedor",
  p_email: emails.supplier,
  p_team: "QA Fornecedor",
  p_expires_in_days: 7
});

const supplierId = await rpc(supabase, "upsert_supplier_company", {
  p_id: null,
  p_legal_name: `Codex QA Fornecedor ${stamp}`,
  p_trade_name: `QA Restaurante ${stamp}`,
  p_cnpj: "",
  p_state_registration: "",
  p_municipal_registration: "",
  p_address_line: "Rua QA, 100",
  p_city: "Salvador",
  p_state: "BA",
  p_zip_code: "40000-000",
  p_phone: "(71) 99999-0000",
  p_email: `qa.fornecedor.${stamp}@${domain}`,
  p_contact_name: "Contato QA",
  p_bank_details: "Banco QA",
  p_notes: "Registro criado por teste automatizado Codex",
  p_active: true
});
assert(supplierId, "Fornecedor nao retornou id");

await rpc(supabase, "upsert_supplier_company", {
  p_id: supplierId,
  p_legal_name: `Codex QA Fornecedor ${stamp}`,
  p_trade_name: `QA Restaurante Editado ${stamp}`,
  p_cnpj: "",
  p_state_registration: "",
  p_municipal_registration: "",
  p_address_line: "Rua QA, 101",
  p_city: "Salvador",
  p_state: "BA",
  p_zip_code: "40000-001",
  p_phone: "(71) 99999-0001",
  p_email: `qa.fornecedor.editado.${stamp}@${domain}`,
  p_contact_name: "Contato QA Editado",
  p_bank_details: "Banco QA",
  p_notes: "Registro editado por teste automatizado Codex",
  p_active: true
});

const mealId = await rpc(supabase, "upsert_meal_type_catalog", {
  p_id: null,
  p_name: `Codex QA Refeicao ${stamp}`,
  p_description: "Arroz, feijao, proteina e salada",
  p_unit_price: 19.75,
  p_active: true,
  p_category: "marmita"
});
assert(mealId, "Refeicao nao retornou id");

await rpc(supabase, "upsert_meal_type_catalog", {
  p_id: mealId,
  p_name: `Codex QA Refeicao Editada ${stamp}`,
  p_description: "Arroz, feijao, proteina, salada e fruta",
  p_unit_price: 21.5,
  p_active: true,
  p_category: "marmita"
});

await rpc(supabase, "upsert_supplier_meal_type", {
  p_supplier_company_id: supplierId,
  p_meal_type_id: mealId,
  p_active: true,
  p_unit_price: 22.25,
  p_notes: "Vinculo QA ativo"
});

const sectionId = await rpc(supabase, "upsert_work_section", {
  p_id: null,
  p_name: `Codex QA Equipe ${stamp}`,
  p_headcount: 12,
  p_leader_id: null,
  p_active: true,
  p_area_type: "campo",
  p_meal_type_ids: [mealId]
});
assert(sectionId, "Efetivo nao retornou id");

async function createUser(email, role, name, supplierCompanyId = null) {
  const { data, error } = await supabase.functions.invoke("admin-create-user", {
    body: {
      email,
      password: userPassword,
      name,
      role,
      team: `QA ${role}`,
      supplierCompanyId,
      active: true
    }
  });
  if (error || data?.error) fail(`Function admin-create-user ${role}`, data?.error ? new Error(data.error) : error);
  assert(data?.id, `Usuario ${role} nao retornou id`);
  return data.id;
}

const leaderUserId = await createUser(emails.leader, "encarregado", `Codex QA Encarregado ${stamp}`);
const supplierUserId = await createUser(emails.supplier, "fornecedor", `Codex QA Fornecedor Login ${stamp}`, supplierId);
const adminUserId = await createUser(emails.admin, "admin", `Codex QA Admin Criado ${stamp}`);

await rpc(supabase, "upsert_supplier_company_user", {
  p_supplier_company_id: supplierId,
  p_user_id: supplierUserId,
  p_active: true
});

const { data: createdProfiles, error: profileError } = await supabase
  .from("profiles")
  .select("id,email,role,active")
  .in("email", Object.values(emails));
if (profileError) fail("Conferencia profiles", profileError);
assert(createdProfiles.length === 3, "Nem todos os usuarios de teste apareceram em profiles");

const { data: linkedRows, error: linkError } = await supabase
  .from("supplier_company_users")
  .select("supplier_company_id,user_id,active")
  .eq("supplier_company_id", supplierId)
  .eq("user_id", supplierUserId);
if (linkError) fail("Conferencia vinculo login fornecedor", linkError);
assert(linkedRows.length === 1 && linkedRows[0].active, "Login fornecedor nao ficou vinculado");

console.log(JSON.stringify({
  ok: true,
  stamp,
  supplierId,
  mealId,
  sectionId,
  userIds: { leaderUserId, supplierUserId, adminUserId },
  emails
}, null, 2));
