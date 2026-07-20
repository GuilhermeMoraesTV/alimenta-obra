import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Metodo nao permitido." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Function sem variaveis Supabase configuradas." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } }
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: callerData, error: callerError } = await userClient.auth.getUser();
  if (callerError || !callerData.user) {
    return new Response(JSON.stringify({ error: "Sessao expirada. Entre novamente." }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const { data: callerProfile, error: profileError } = await userClient
    .from("profiles")
    .select("role, active")
    .eq("id", callerData.user.id)
    .single();
  if (profileError || callerProfile?.role !== "admin" || callerProfile?.active === false) {
    return new Response(JSON.stringify({ error: "Apenas administradores podem criar usuarios." }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const name = String(body.name ?? "").trim();
  const role = String(body.role ?? "encarregado");
  const team = String(body.team ?? "").trim();
  const supplierCompanyId = body.supplierCompanyId ? String(body.supplierCompanyId) : null;
  const active = body.active !== false;

  if (!email || !password || !name) {
    return new Response(JSON.stringify({ error: "Informe nome, login/e-mail e senha inicial." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  if (!["encarregado", "admin", "fornecedor"].includes(role)) {
    return new Response(JSON.stringify({ error: "Perfil invalido." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, team }
  });
  if (createError || !created.user) {
    return new Response(JSON.stringify({ error: createError?.message ?? "Nao foi possivel criar usuario." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const { error: upsertError } = await adminClient
    .from("profiles")
    .upsert({
      id: created.user.id,
      name,
      email,
      role,
      team,
      active
    }, { onConflict: "id" });
  if (upsertError) {
    await adminClient.auth.admin.deleteUser(created.user.id);
    return new Response(JSON.stringify({ error: upsertError.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  if (role === "fornecedor" && supplierCompanyId) {
    const { error: linkError } = await adminClient
      .from("supplier_company_users")
      .upsert({
        supplier_company_id: supplierCompanyId,
        user_id: created.user.id,
        active: true
      }, { onConflict: "supplier_company_id,user_id" });
    if (linkError) {
      return new Response(JSON.stringify({ error: linkError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }

  await adminClient.from("audit_log").insert({
    actor_id: callerData.user.id,
    action: "Usuario criado pelo Admin",
    entity: "usuario",
    entity_id: created.user.id,
    payload: { role, supplierCompanyId, active }
  });

  return new Response(JSON.stringify({ id: created.user.id, email, role }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});
