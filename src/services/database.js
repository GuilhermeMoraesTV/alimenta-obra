import { requireSupabase } from "./supabase.js";

function ensure(data, error) {
  if (error) {
    if (error.code === "42703" && String(error.message).includes("profiles.name")) {
      throw new Error(
        "O Supabase configurado nao possui o banco do AlimentaObra. Verifique se o .env.local aponta para o projeto correto e execute a migracao inicial."
      );
    }
    if (error.code === "42P01" || error.code === "PGRST205") {
      throw new Error(
        "As tabelas do AlimentaObra ainda nao existem neste Supabase. Execute a migracao inicial no SQL Editor."
      );
    }
    throw error;
  }
  return data;
}

function isMissingDeliveryAddressSchema(error) {
  return ["42P01", "PGRST200", "PGRST205"].includes(error?.code)
    || String(error?.message ?? "").includes("delivery_addresses");
}

function deliveryAddressErrorMessage(error) {
  const message = String(error?.message ?? "");
  if (error?.code === "23505" || message.includes("delivery_addresses_leader_id_label_key")) {
    return "Ja existe um endereco com esse nome para este encarregado.";
  }
  if (["PGRST202", "42883"].includes(error?.code) || message.includes("create_delivery_address_as_user")) {
    return "A funcao de cadastro de endereco ainda nao foi aplicada no Supabase. Execute as migracoes.";
  }
  if (message.includes("Sessao expirada")) return "Sessao expirada. Entre novamente.";
  if (message.includes("Apenas administradores")) return "Apenas administradores podem cadastrar endereco para outro usuario.";
  if (message.includes("Encarregado invalido")) return "Encarregado invalido ou inativo.";
  if (message.includes("perfil nao pode")) return "Seu perfil nao pode cadastrar enderecos.";
  if (message.includes("row-level security")) return "Seu usuario nao tem permissao para salvar este endereco.";
  return message || "Falha ao salvar endereco.";
}

function passwordErrorMessage(error) {
  const message = String(error?.message ?? "");
  const lower = message.toLowerCase();
  if (lower.includes("jwt") || lower.includes("session") || lower.includes("not authenticated")) {
    return "Sessao expirada. Entre novamente antes de alterar a senha.";
  }
  if (lower.includes("same password") || lower.includes("different from the old password")) {
    return "A nova senha precisa ser diferente da senha atual.";
  }
  if (lower.includes("password") && (lower.includes("weak") || lower.includes("short") || lower.includes("least"))) {
    return "A senha precisa ter pelo menos 8 caracteres.";
  }
  if (lower.includes("rate limit") || lower.includes("too many")) {
    return "Muitas tentativas. Aguarde um pouco e tente novamente.";
  }
  return message || "Falha ao alterar senha.";
}

function mealRequestsQuery(client, includeDeliveryAddress = true) {
  return client
    .from("meal_requests")
    .select(`
      id, meal_date, meal_type_id, location_id, ${includeDeliveryAddress ? "delivery_address_id," : ""} leader_id, quantity,
      status, notes, created_at, updated_at,
      meal_types(id, name, description),
      meal_locations!meal_requests_location_id_fkey(id, name)
      ${includeDeliveryAddress ? ", delivery_addresses(id, label, address_line)" : ""}
    `)
    .order("meal_date", { ascending: false })
    .order("created_at", { ascending: false });
}

async function fetchMealRequestsWithCompatibility(client) {
  const response = await mealRequestsQuery(client, true);
  if (!response.error || !isMissingDeliveryAddressSchema(response.error)) return response;
  return mealRequestsQuery(client, false);
}

export async function validateAlimentaObraSchema() {
  const { error } = await requireSupabase()
    .from("meal_types")
    .select("id")
    .limit(1);

  if (error) {
    if (error.code === "42P01" || error.code === "PGRST205") {
      throw new Error(
        "Este Supabase nao possui o banco do AlimentaObra. Use um projeto separado e execute a migracao inicial."
      );
    }
    throw error;
  }
}

export async function getSession() {
  const { data, error } = await requireSupabase().auth.getSession();
  return ensure(data?.session ?? null, error);
}

export async function getAuthenticatedUser() {
  const { data, error } = await requireSupabase().auth.getUser();
  return ensure(data?.user ?? null, error);
}

export async function signIn(email, password) {
  const { data, error } = await requireSupabase().auth.signInWithPassword({ email, password });
  return ensure(data, error);
}

export async function signUp({ email, password, name, team, inviteToken = "" }) {
  const normalizedEmail = String(email)
    .normalize("NFKC")
    .replace(/[\s\u200B-\u200D\uFEFF]/g, "")
    .replace(/[^\x21-\x7E]/g, "")
    .toLowerCase();

  const metadata = { name, team };
  if (inviteToken) metadata.invite_token = inviteToken;

  const { data, error } = await requireSupabase().auth.signUp({
    email: normalizedEmail,
    password,
    options: { data: metadata }
  });
  return ensure(data, error);
}

export async function signOut() {
  const { error } = await requireSupabase().auth.signOut();
  ensure(null, error);
}

export async function updateCurrentProfile({ name, team }) {
  const { data, error } = await requireSupabase().rpc("update_current_profile", {
    p_name: String(name).trim(),
    p_team: String(team ?? "").trim()
  });
  return ensure(data, error);
}

export async function updateUserPassword(password) {
  const session = await getSession();
  if (!session) throw new Error("Sessao expirada. Entre novamente antes de alterar a senha.");
  const { data, error } = await requireSupabase().auth.updateUser({ password });
  if (error) throw new Error(passwordErrorMessage(error));
  return data;
}

export async function fetchProfile(userId) {
  const { data, error } = await requireSupabase()
    .from("profiles")
    .select("id, name, email, role, team, active")
    .eq("id", userId)
    .single();
  return ensure(data, error);
}

export async function fetchApplicationData() {
  const client = requireSupabase();
  const addressesPromise = client
    .from("delivery_addresses")
    .select("id, leader_id, label, address_line, reference, active, created_at")
    .order("label");
  const documentsPromise = client
    .from("consolidation_documents")
    .select("id, consolidation_id, document_type, storage_path, original_name, mime_type, size_bytes, uploaded_by, created_at")
    .order("created_at", { ascending: false });
  const results = await Promise.all([
    client.from("profiles").select("id, name, email, role, team, active").order("name"),
    client
      .from("meal_types")
      .select("id, name, description, active, sort_order, meal_locations(id, name, active, sort_order)")
      .order("sort_order"),
    client.from("app_settings").select("*").eq("id", true).single(),
    fetchMealRequestsWithCompatibility(client),
    client
      .from("consolidations")
      .select(`
        id, meal_date, supplier_id, status, sent_at, created_by, created_at, updated_at,
        consolidation_items(meal_request_id),
        supplier_confirmations(step, confirmed_by, confirmed_at, metadata)
      `)
      .order("meal_date", { ascending: false }),
    client
      .from("audit_log")
      .select("id, actor_id, action, entity, entity_id, payload, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    documentsPromise,
    addressesPromise
  ]);
  const [profiles, catalog, settings, requests, consolidations, audit, documents, addresses] = results;
  const documentRows = documents.error && ["42P01", "PGRST205"].includes(documents.error.code)
    ? []
    : ensure(documents.data, documents.error);
  const addressFeatureAvailable = !addresses.error;
  const addressRows = addresses.error && isMissingDeliveryAddressSchema(addresses.error)
    ? []
    : ensure(addresses.data, addresses.error);
  return {
    profiles: ensure(profiles.data, profiles.error),
    catalog: ensure(catalog.data, catalog.error),
    settings: ensure(settings.data, settings.error),
    requests: ensure(requests.data, requests.error),
    consolidations: ensure(consolidations.data, consolidations.error),
    audit: ensure(audit.data, audit.error),
    documents: documentRows,
    addresses: addressRows,
    addressFeatureAvailable
  };
}

export async function createMealRequest(input, userId) {
  const params = {
    p_leader_id: userId,
    p_meal_date: input.date,
    p_meal_type_id: input.mealTypeId,
    p_location_id: input.locationId,
    p_quantity: Number(input.quantity),
    p_status: input.status,
    p_notes: input.notes
  };
  if (input.deliveryAddressId) params.p_delivery_address_id = input.deliveryAddressId;
  const { data, error } = await requireSupabase().rpc("create_meal_request_as_user", params);
  return ensure(data, error);
}

export async function createDeliveryAddress({ leaderId, label, addressLine, reference = "" }) {
  const { data, error } = await requireSupabase().rpc("create_delivery_address_as_user", {
    p_leader_id: leaderId,
    p_label: String(label).trim(),
    p_address_line: String(addressLine).trim(),
    p_reference: String(reference).trim()
  });
  if (error) throw new Error(deliveryAddressErrorMessage(error));
  return data;
}

export async function saveMealTypeCatalog({ id = null, name, description = "", active = true }) {
  const { data, error } = await requireSupabase().rpc("upsert_meal_type_catalog", {
    p_id: id,
    p_name: String(name).trim(),
    p_description: String(description ?? "").trim(),
    p_active: Boolean(active)
  });
  return ensure(data, error);
}

export async function updateDefaultMealUnitPrice(unitPrice) {
  const { data, error } = await requireSupabase().rpc("update_default_meal_unit_price", {
    p_unit_price: Number(unitPrice)
  });
  return ensure(data, error);
}

export async function createAccessInvite({ token, role, email = "", team = "", expiresInDays = 7 }) {
  const { data, error } = await requireSupabase().rpc("create_access_invite", {
    p_token: token,
    p_role: role,
    p_email: String(email ?? "").trim() || null,
    p_team: String(team ?? "").trim() || null,
    p_expires_in_days: Number(expiresInDays)
  });
  return ensure(data, error);
}

export async function changeRequestStatus(requestId, status) {
  const { error } = await requireSupabase().rpc("change_request_status", {
    p_request_id: requestId,
    p_status: status
  });
  ensure(null, error);
}

export async function updateMealRequest(requestId, input) {
  const payload = {
    meal_date: input.date,
    meal_type_id: input.mealTypeId,
    location_id: input.locationId,
    quantity: Number(input.quantity),
    notes: String(input.notes ?? "")
  };
  if (input.deliveryAddressId) payload.delivery_address_id = input.deliveryAddressId;
  const { data, error } = await requireSupabase()
    .from("meal_requests")
    .update(payload)
    .eq("id", requestId)
    .select("id")
    .single();
  return ensure(data, error);
}

export async function sendDailyConsolidation(mealDate, supplierId) {
  const { data, error } = await requireSupabase().rpc("send_consolidation", {
    p_meal_date: mealDate,
    p_supplier_id: supplierId
  });
  return ensure(data, error);
}

export async function confirmSupplierStep(consolidationId, step) {
  const { error } = await requireSupabase().rpc("confirm_supplier_step", {
    p_consolidation_id: consolidationId,
    p_step: step,
    p_metadata: {}
  });
  ensure(null, error);
}

export async function uploadSupplierInvoice(consolidationId, file) {
  if (!file || file.type !== "application/pdf") {
    throw new Error("Envie uma nota fiscal em formato PDF.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("A nota fiscal deve ter no maximo 10 MB.");
  }

  const client = requireSupabase();
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Sessao expirada. Entre novamente.");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const storagePath = `${user.id}/${consolidationId}/${crypto.randomUUID()}-${safeName}`;
  const { error: uploadError } = await client.storage
    .from("supplier-documents")
    .upload(storagePath, file, { contentType: "application/pdf", upsert: false });
  if (uploadError) throw uploadError;

  const { data, error } = await client
    .from("consolidation_documents")
    .insert({
      consolidation_id: consolidationId,
      document_type: "nota_fiscal",
      storage_path: storagePath,
      original_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by: user.id
    })
    .select("id")
    .single();

  if (error) {
    await client.storage.from("supplier-documents").remove([storagePath]);
    throw error;
  }
  return data;
}

export async function getSupplierDocumentUrl(storagePath) {
  const { data, error } = await requireSupabase().storage
    .from("supplier-documents")
    .createSignedUrl(storagePath, 60);
  return ensure(data?.signedUrl ?? null, error);
}

export async function logSupplierRomaneio(consolidationId) {
  const { error } = await requireSupabase().rpc("log_supplier_romaneio", {
    p_consolidation_id: consolidationId
  });
  ensure(null, error);
}

export function subscribeToChanges(onChange) {
  return requireSupabase()
    .channel("alimenta-obra-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "meal_requests" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "consolidations" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "supplier_confirmations" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "consolidation_documents" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "meal_types" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "app_settings" }, onChange)
    .subscribe();
}

export async function removeSubscription(channel) {
  if (channel) await requireSupabase().removeChannel(channel);
}
