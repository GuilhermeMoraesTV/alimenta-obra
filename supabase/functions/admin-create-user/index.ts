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
  const action = String(body.action ?? "create");
  const userId = body.userId ? String(body.userId) : null;
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const name = String(body.name ?? "").trim();
  const role = String(body.role ?? "encarregado");
  const team = String(body.team ?? "").trim();
  const supplierCompanyId = body.supplierCompanyId ? String(body.supplierCompanyId) : null;
  const active = body.active !== false;

  if (!["create", "update", "delete"].includes(action)) {
    return new Response(JSON.stringify({ error: "Acao invalida." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  if ((action === "update" || action === "delete") && !userId) {
    return new Response(JSON.stringify({ error: "Usuario nao informado." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  if (action === "delete") {
    if (userId === callerData.user.id) {
      return new Response(JSON.stringify({ error: "Nao e possivel excluir o proprio usuario logado." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { data: targetProfile } = await adminClient
      .from("profiles")
      .select("id, name, email, role")
      .eq("id", userId)
      .maybeSingle();

    const ignore = async (operation: Promise<{ error: { message: string } | null }>) => {
      const { error } = await operation;
      if (error && !/does not exist|schema cache|column .* does not exist/i.test(error.message)) throw error;
    };

    const targetConsolidations = await adminClient
      .from("consolidations")
      .select("id")
      .or(`supplier_id.eq.${userId},created_by.eq.${userId}`);
    if (targetConsolidations.error) throw targetConsolidations.error;

    const targetRequests = await adminClient
      .from("meal_requests")
      .select("id")
      .or(`leader_id.eq.${userId},created_by.eq.${userId},updated_by.eq.${userId}`);
    if (targetRequests.error) throw targetRequests.error;

    const consolidationIds = (targetConsolidations.data ?? []).map((row) => row.id);
    const requestIds = (targetRequests.data ?? []).map((row) => row.id);

    await ignore(adminClient.from("consolidation_documents").delete().eq("uploaded_by", userId));
    await ignore(adminClient.from("supplier_confirmations").delete().eq("confirmed_by", userId));
    if (consolidationIds.length) await ignore(adminClient.from("consolidation_items").delete().in("consolidation_id", consolidationIds));
    if (requestIds.length) await ignore(adminClient.from("consolidation_items").delete().in("meal_request_id", requestIds));
    if (consolidationIds.length) await ignore(adminClient.from("consolidations").delete().in("id", consolidationIds));
    if (requestIds.length) await ignore(adminClient.from("meal_requests").delete().in("id", requestIds));

    await ignore(adminClient.from("supplier_company_users").delete().eq("user_id", userId));
    await ignore(adminClient.from("work_sections").update({ leader_id: null }).eq("leader_id", userId));
    await ignore(adminClient.from("supplier_companies").update({ legacy_profile_id: null }).eq("legacy_profile_id", userId));
    await ignore(adminClient.from("supplier_companies").update({ created_by: null }).eq("created_by", userId));
    await ignore(adminClient.from("app_settings").update({ updated_by: null }).eq("updated_by", userId));
    await ignore(adminClient.from("audit_log").update({ actor_id: null }).eq("actor_id", userId));
    await ignore(adminClient.from("access_invites").update({ created_by: null }).eq("created_by", userId));
    await ignore(adminClient.from("access_invites").update({ used_by: null }).eq("used_by", userId));
    await ignore(adminClient.from("consolidation_actuals").update({ recorded_by: null }).eq("recorded_by", userId));
    await ignore(adminClient.from("consolidation_revisions").update({ edited_by: null }).eq("edited_by", userId));
    await ignore(adminClient.from("daily_reports").update({ generated_by: null }).eq("generated_by", userId));

    await adminClient.from("audit_log").insert({
      actor_id: callerData.user.id,
      action: "Usuario excluido permanentemente pelo Admin",
      entity: "usuario",
      entity_id: userId,
      payload: {
        deletedAuthUser: true,
        removedProfile: targetProfile,
        removedRequests: requestIds.length,
        removedConsolidations: consolidationIds.length
      }
    });

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ id: userId, deleted: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  if (!email || !name || (action === "create" && !password)) {
    return new Response(JSON.stringify({ error: action === "create" ? "Informe nome, login/e-mail e senha inicial." : "Informe nome e login/e-mail." }), {
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

  if (action === "update") {
    const authUpdate: Record<string, unknown> = {
      email,
      user_metadata: { name, team }
    };
    if (password) authUpdate.password = password;
    const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(userId, authUpdate);
    if (authUpdateError) {
      return new Response(JSON.stringify({ error: authUpdateError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { error: profileUpdateError } = await adminClient
      .from("profiles")
      .update({ name, email, role, team, active })
      .eq("id", userId);
    if (profileUpdateError) {
      return new Response(JSON.stringify({ error: profileUpdateError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    await adminClient.from("audit_log").insert({
      actor_id: callerData.user.id,
      action: "Usuario atualizado pelo Admin",
      entity: "usuario",
      entity_id: userId,
      payload: { role, active }
    });

    return new Response(JSON.stringify({ id: userId, email, role }), {
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
