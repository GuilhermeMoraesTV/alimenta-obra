import { requireSupabase } from "./supabase.js";

function ensure(data, error) {
  if (error) {
    if (error.code === "42703" && String(error.message).includes("profiles.name")) {
      throw new Error(
        "O Supabase configurado não possui o banco do AlimentaObra. Verifique se o .env.local aponta para o projeto correto e execute a migração inicial."
      );
    }
    if (error.code === "42P01" || error.code === "PGRST205") {
      throw new Error(
        "As tabelas do AlimentaObra ainda não existem neste Supabase. Execute a migração inicial no SQL Editor."
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

function isMissingOperationSchema(error) {
  return ["42703", "42P01", "PGRST200", "PGRST202", "PGRST205"].includes(error?.code)
    || String(error?.message ?? "").includes("work_sections")
    || String(error?.message ?? "").includes("consolidation_actuals")
    || String(error?.message ?? "").includes("daily_reports")
    || String(error?.message ?? "").includes("team_id")
    || String(error?.message ?? "").includes("unit_price");
}

function isMissingSupplierCompanySchema(error) {
  return ["42703", "42P01", "PGRST200", "PGRST202", "PGRST205"].includes(error?.code)
    || String(error?.message ?? "").includes("supplier_companies")
    || String(error?.message ?? "").includes("supplier_company_users")
    || String(error?.message ?? "").includes("supplier_meal_types")
    || String(error?.message ?? "").includes("work_section_meal_types")
    || String(error?.message ?? "").includes("supplier_company_id")
    || String(error?.message ?? "").includes("origin_role")
    || String(error?.message ?? "").includes("category")
    || String(error?.message ?? "").includes("area_type");
}

function isMissingMealCategorySchema(error) {
  return Number(error?.status) === 404
    || ["42703", "42P01", "PGRST200", "PGRST202", "PGRST205"].includes(error?.code)
    || String(error?.message ?? "").includes("meal_categories")
    || String(error?.message ?? "").includes("can_record_actuals");
}

function isMissingWorkAreaTypeSchema(error) {
  return Number(error?.status) === 404
    || ["42703", "42P01", "PGRST200", "PGRST202", "PGRST205"].includes(error?.code)
    || String(error?.message ?? "").includes("work_area_types")
    || String(error?.message ?? "").includes("work_area_type_categories")
    || String(error?.message ?? "").includes("upsert_work_area_type");
}

function deliveryAddressErrorMessage(error) {
  const message = String(error?.message ?? "");
  if (error?.code === "23505" || message.includes("delivery_addresses_leader_id_label_key")) {
    return "Ja existe um endereco com esse nome para este encarregado.";
  }
  if (["PGRST202", "42883"].includes(error?.code) || message.includes("create_delivery_address_as_user")) {
    return "A função de cadastro de endereço ainda não foi aplicada no Supabase. Execute as migrações.";
  }
  if (message.includes("Sessao expirada")) return "Sessão expirada. Entre novamente.";
  if (message.includes("Apenas administradores")) return "Apenas administradores podem cadastrar endereco para outro usuario.";
  if (message.includes("Encarregado invalido")) return "Encarregado invalido ou inativo.";
  if (message.includes("perfil nao pode")) return "Seu perfil não pode cadastrar endereços.";
  if (message.includes("row-level security")) return "Seu usuário não tem permissão para salvar este endereço.";
  return message || "Falha ao salvar endereco.";
}

function passwordErrorMessage(error) {
  const message = String(error?.message ?? "");
  const code = String(error?.code ?? error?.status ?? "");
  const lower = message.toLowerCase();
  if (lower.includes("jwt") || lower.includes("session") || lower.includes("not authenticated")) {
    return "Sessão expirada. Entre novamente antes de alterar a senha.";
  }
  if (code === "same_password" || lower.includes("same password") || lower.includes("different from the old password")) {
    return "A nova senha precisa ser diferente da senha atual.";
  }
  if (code === "weak_password" || code === "422" || (lower.includes("password") && (lower.includes("weak") || lower.includes("short") || lower.includes("least")))) {
    return "A senha precisa ter pelo menos 8 caracteres e atender a politica de seguranca do Supabase.";
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
      id, meal_date, meal_type_id, location_id, team_id, supplier_company_id, origin_role, ${includeDeliveryAddress ? "delivery_address_id," : ""} leader_id, quantity,
      meal_name_snapshot, meal_description_snapshot, meal_category_snapshot, can_record_actuals_snapshot, unit_price_snapshot,
      section_name_snapshot, section_headcount_snapshot, supplier_name_snapshot,
      status, notes, created_by, created_at, updated_at,
      meal_types(id, name, description, unit_price, category),
      meal_locations!meal_requests_location_id_fkey(id, name),
      supplier_companies(id, legal_name, trade_name, active),
      work_sections(id, name, headcount)
      ${includeDeliveryAddress ? ", delivery_addresses(id, label, address_line)" : ""}
    `)
    .order("meal_date", { ascending: false })
    .order("created_at", { ascending: false });
}

function legacyMealRequestsQuery(client, includeDeliveryAddress = true) {
  return client
    .from("meal_requests")
    .select(`
      id, meal_date, meal_type_id, location_id, ${includeDeliveryAddress ? "delivery_address_id," : ""} leader_id, quantity,
      status, notes, created_by, created_at, updated_at,
      meal_types(id, name, description),
      meal_locations!meal_requests_location_id_fkey(id, name)
      ${includeDeliveryAddress ? ", delivery_addresses(id, label, address_line)" : ""}
    `)
    .order("meal_date", { ascending: false })
    .order("created_at", { ascending: false });
}

async function fetchMealRequestsWithCompatibility(client) {
  const response = await mealRequestsQuery(client, true);
  if (!response.error) return response;
  if (isMissingOperationSchema(response.error) || isMissingSupplierCompanySchema(response.error)) {
    const legacy = await legacyMealRequestsQuery(client, true);
    if (!legacy.error || !isMissingDeliveryAddressSchema(legacy.error)) return legacy;
    return legacyMealRequestsQuery(client, false);
  }
  if (!isMissingDeliveryAddressSchema(response.error)) return response;
  const retry = await mealRequestsQuery(client, false);
  if (!retry.error || !isMissingOperationSchema(retry.error)) return retry;
  return legacyMealRequestsQuery(client, false);
}

async function fetchConsolidationsWithCompatibility(client) {
  const response = await client
    .from("consolidations")
    .select(`
      id, meal_date, supplier_id, supplier_company_id, status, sent_at, created_by, created_at, updated_at,
      consolidation_items(meal_request_id),
      supplier_confirmations(step, confirmed_by, confirmed_at, metadata),
      consolidation_revisions(id, edited_by, edited_at, reason, snapshot)
    `)
    .order("meal_date", { ascending: false });
  if (!response.error) return response;
  if (!isMissingSupplierCompanySchema(response.error) && !isMissingOperationSchema(response.error)) return response;
  return client
    .from("consolidations")
    .select(`
      id, meal_date, supplier_id, status, sent_at, created_by, created_at, updated_at,
      consolidation_items(meal_request_id),
      supplier_confirmations(step, confirmed_by, confirmed_at, metadata),
      consolidation_revisions(id, edited_by, edited_at, reason, snapshot)
    `)
    .order("meal_date", { ascending: false });
}

async function fetchMealCatalogWithCompatibility(client) {
  const response = await client
    .from("meal_types")
    .select("id, name, description, unit_price, category, active, sort_order, meal_locations(id, name, active, sort_order)")
    .order("sort_order");
  if (!response.error) return response;
  if (!isMissingSupplierCompanySchema(response.error) && !isMissingOperationSchema(response.error)) return response;
  return client
    .from("meal_types")
    .select("id, name, description, unit_price, active, sort_order, meal_locations(id, name, active, sort_order)")
    .order("sort_order");
}

async function fetchWorkSectionsWithCompatibility(client) {
  const response = await client
    .from("work_sections")
    .select("id, name, headcount, leader_id, area_type, active, created_at, updated_at")
    .order("name");
  if (!response.error) return response;
  if (!isMissingSupplierCompanySchema(response.error) && !isMissingOperationSchema(response.error)) return response;
  return client
    .from("work_sections")
    .select("id, name, headcount, leader_id, active, created_at, updated_at")
    .order("name");
}

async function fetchMealCategoriesWithCompatibility(client) {
  const response = await client
    .from("meal_categories")
    .select("id, label, can_record_actuals, active, sort_order, created_at, updated_at")
    .order("sort_order");
  if (!response.error) return response;
  if (!isMissingMealCategorySchema(response.error)) return response;
  return { data: [], error: null, schemaMissing: true };
}

async function fetchWorkAreaTypesWithCompatibility(client) {
  const response = await client
    .from("work_area_types")
    .select("id, label, active, sort_order, created_at, updated_at")
    .order("sort_order");
  if (!response.error) return response;
  if (!isMissingWorkAreaTypeSchema(response.error)) return response;
  return { data: [], error: null, schemaMissing: true };
}

async function fetchWorkAreaTypeCategoriesWithCompatibility(client) {
  const response = await client
    .from("work_area_type_categories")
    .select("area_type_id, meal_category_id, active, created_at")
    .order("area_type_id");
  if (!response.error) return response;
  if (!isMissingWorkAreaTypeSchema(response.error)) return response;
  return { data: [], error: null, schemaMissing: true };
}

export async function validateAlimentaObraSchema() {
  const { error } = await requireSupabase()
    .from("meal_types")
    .select("id")
    .limit(1);

  if (error) {
    if (error.code === "42P01" || error.code === "PGRST205") {
      throw new Error(
        "Este Supabase não possui o banco do AlimentaObra. Use um projeto separado e execute a migração inicial."
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

export async function updateUserPassword(password, targetUserId = null) {
  const session = await getSession();
  if (!session) throw new Error("Sessão expirada. Entre novamente antes de alterar a senha.");
  if (targetUserId && targetUserId !== session.user.id) {
    const { error } = await requireSupabase().rpc("admin_update_user_password_v2", {
      p_user_id: String(targetUserId),
      p_password: password
    });
    if (error) throw new Error(passwordErrorMessage(error));
    return null;
  }
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
  const workSectionsPromise = fetchWorkSectionsWithCompatibility(client);
  const actualsPromise = client
    .from("consolidation_actuals")
    .select("id, consolidation_id, meal_date, team_id, meal_type_id, quantity, notes, recorded_by, recorded_at")
    .order("meal_date", { ascending: false });
  const reportsPromise = client
    .from("daily_reports")
    .select("id, report_date, status, totals, snapshot, generated_at, generated_by")
    .order("report_date", { ascending: false })
    .limit(90);
  const supplierCompaniesPromise = client
    .from("supplier_companies")
    .select("id, legal_name, trade_name, cnpj, state_registration, municipal_registration, address_line, city, state, zip_code, phone, email, contact_name, bank_details, notes, active, legacy_profile_id, created_at, updated_at")
    .order("legal_name");
  const supplierCompanyUsersPromise = client
    .from("supplier_company_users")
    .select("supplier_company_id, user_id, active, created_at");
  const supplierMealTypesPromise = client
    .from("supplier_meal_types")
    .select("supplier_company_id, meal_type_id, active, unit_price, notes, updated_at");
  const sectionMealTypesPromise = client
    .from("work_section_meal_types")
    .select("work_section_id, meal_type_id, active");
  const mealCategoriesPromise = fetchMealCategoriesWithCompatibility(client);
  const workAreaTypesPromise = fetchWorkAreaTypesWithCompatibility(client);
  const workAreaTypeCategoriesPromise = fetchWorkAreaTypeCategoriesWithCompatibility(client);
  const results = await Promise.all([
    client.from("profiles").select("id, name, email, role, team, active").order("name"),
    fetchMealCatalogWithCompatibility(client),
    client.from("app_settings").select("*").eq("id", true).single(),
    fetchMealRequestsWithCompatibility(client),
    fetchConsolidationsWithCompatibility(client),
    client
      .from("audit_log")
      .select("id, actor_id, action, entity, entity_id, payload, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    documentsPromise,
    addressesPromise,
    workSectionsPromise,
    actualsPromise,
    reportsPromise,
    supplierCompaniesPromise,
    supplierCompanyUsersPromise,
    supplierMealTypesPromise,
    sectionMealTypesPromise,
    mealCategoriesPromise,
    workAreaTypesPromise,
    workAreaTypeCategoriesPromise
  ]);
  const [profiles, catalog, settings, requests, consolidations, audit, documents, addresses, workSections, actuals, reports, supplierCompanies, supplierCompanyUsers, supplierMealTypes, sectionMealTypes, mealCategories, workAreaTypes, workAreaTypeCategories] = results;
  const documentRows = documents.error && ["42P01", "PGRST205"].includes(documents.error.code)
    ? []
    : ensure(documents.data, documents.error);
  const addressFeatureAvailable = !addresses.error;
  const addressRows = addresses.error && isMissingDeliveryAddressSchema(addresses.error)
    ? []
    : ensure(addresses.data, addresses.error);
  const workSectionRows = workSections.error && isMissingOperationSchema(workSections.error)
    ? []
    : ensure(workSections.data, workSections.error);
  const actualRows = actuals.error && isMissingOperationSchema(actuals.error)
    ? []
    : ensure(actuals.data, actuals.error);
  const reportRows = reports.error && isMissingOperationSchema(reports.error)
    ? []
    : ensure(reports.data, reports.error);
  const supplierCompanyRows = supplierCompanies.error && isMissingSupplierCompanySchema(supplierCompanies.error)
    ? []
    : ensure(supplierCompanies.data, supplierCompanies.error);
  const supplierCompanyUserRows = supplierCompanyUsers.error && isMissingSupplierCompanySchema(supplierCompanyUsers.error)
    ? []
    : ensure(supplierCompanyUsers.data, supplierCompanyUsers.error);
  const supplierMealTypeRows = supplierMealTypes.error && isMissingSupplierCompanySchema(supplierMealTypes.error)
    ? []
    : ensure(supplierMealTypes.data, supplierMealTypes.error);
  const sectionMealTypeRows = sectionMealTypes.error && isMissingSupplierCompanySchema(sectionMealTypes.error)
    ? []
    : ensure(sectionMealTypes.data, sectionMealTypes.error);
  const mealCategoryRows = mealCategories.error && isMissingMealCategorySchema(mealCategories.error)
    ? []
    : ensure(mealCategories.data, mealCategories.error);
  const workAreaTypeRows = workAreaTypes.error && isMissingWorkAreaTypeSchema(workAreaTypes.error)
    ? []
    : ensure(workAreaTypes.data, workAreaTypes.error);
  const workAreaTypeCategoryRows = workAreaTypeCategories.error && isMissingWorkAreaTypeSchema(workAreaTypeCategories.error)
    ? []
    : ensure(workAreaTypeCategories.data, workAreaTypeCategories.error);
  return {
    profiles: ensure(profiles.data, profiles.error),
    catalog: ensure(catalog.data, catalog.error),
    settings: ensure(settings.data, settings.error),
    requests: ensure(requests.data, requests.error),
    consolidations: ensure(consolidations.data, consolidations.error),
    audit: ensure(audit.data, audit.error),
    documents: documentRows,
    addresses: addressRows,
    addressFeatureAvailable,
    workSections: workSectionRows,
    actuals: actualRows,
    reports: reportRows,
    supplierCompanies: supplierCompanyRows,
    supplierCompanyUsers: supplierCompanyUserRows,
    supplierMealTypes: supplierMealTypeRows,
    sectionMealTypes: sectionMealTypeRows,
    mealCategories: mealCategoryRows,
    mealCategoryFeatureAvailable: mealCategories.schemaMissing !== true,
    workAreaTypes: workAreaTypeRows,
    workAreaTypeCategories: workAreaTypeCategoryRows,
    workAreaTypeFeatureAvailable: workAreaTypes.schemaMissing !== true
  };
}

export async function createMealRequest(input, userId) {
  const params = {
    p_leader_id: input.leaderId === undefined ? userId : input.leaderId || null,
    p_meal_date: input.date,
    p_meal_type_id: input.mealTypeId,
    p_location_id: input.locationId || null,
    p_team_id: input.teamId || null,
    p_quantity: Number(input.quantity),
    p_status: input.status,
    p_notes: input.notes,
    p_supplier_company_id: input.supplierCompanyId || null,
    p_origin_role: input.originRole || null
  };
  const { data, error } = await requireSupabase().rpc("create_meal_request_as_user", params);
  if (!error) return data;
  if (!isMissingOperationSchema(error) && !isMissingSupplierCompanySchema(error) && !String(error?.message ?? "").includes("p_team_id")) {
    return ensure(data, error);
  }
  const legacyParams = { ...params };
  delete legacyParams.p_team_id;
  delete legacyParams.p_supplier_company_id;
  delete legacyParams.p_origin_role;
  const retry = await requireSupabase().rpc("create_meal_request_as_user", legacyParams);
  return ensure(retry.data, retry.error);
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

export async function saveMealTypeCatalog({ id = null, name, description = "", unitPrice = 0, active = true, category = "outro" }) {
  const { data, error } = await requireSupabase().rpc("upsert_meal_type_catalog", {
    p_id: id,
    p_name: String(name).trim(),
    p_description: String(description ?? "").trim(),
    p_unit_price: Number(unitPrice ?? 0),
    p_active: Boolean(active),
    p_category: category || "outro"
  });
  if (!error) return data;
  if (!isMissingOperationSchema(error) && !isMissingSupplierCompanySchema(error) && !String(error?.message ?? "").includes("p_unit_price")) {
    return ensure(data, error);
  }
  const retry = await requireSupabase().rpc("upsert_meal_type_catalog", {
    p_id: id,
    p_name: String(name).trim(),
    p_description: String(description ?? "").trim(),
    p_active: Boolean(active)
  });
  return ensure(retry.data, retry.error);
}

export async function saveMealCategoryCatalog({ id, label, canRecordActuals = false, active = true }) {
  const { data, error } = await requireSupabase().rpc("upsert_meal_category", {
    p_id: String(id ?? "").trim().toLowerCase(),
    p_label: String(label ?? "").trim(),
    p_can_record_actuals: Boolean(canRecordActuals),
    p_active: Boolean(active)
  });
  return ensure(data, error);
}

export async function deleteMealCategory(id) {
  const { data, error } = await requireSupabase().rpc("delete_meal_category", {
    p_id: String(id ?? "").trim().toLowerCase()
  });
  return ensure(data, error);
}

export async function saveWorkAreaTypeCatalog({ id, label, categoryIds = [], active = true }) {
  const { data, error } = await requireSupabase().rpc("upsert_work_area_type", {
    p_id: String(id ?? "").trim().toLowerCase(),
    p_label: String(label ?? "").trim(),
    p_category_ids: Array.isArray(categoryIds) ? categoryIds.map((item) => String(item)) : [],
    p_active: Boolean(active)
  });
  return ensure(data, error);
}

export async function deleteWorkAreaType(id) {
  const { data, error } = await requireSupabase().rpc("delete_work_area_type", {
    p_id: String(id ?? "").trim().toLowerCase()
  });
  return ensure(data, error);
}

export async function deleteMealTypeCatalog(id) {
  const { data, error } = await requireSupabase().rpc("delete_meal_type_catalog", {
    p_id: id
  });
  return ensure(data, error);
}

export async function saveWorkSection({ id = null, name, headcount = 0, leaderId = null, active = true, areaType = "campo", mealTypeIds = null }) {
  const { data, error } = await requireSupabase().rpc("upsert_work_section", {
    p_id: id,
    p_name: String(name).trim(),
    p_headcount: Number(headcount ?? 0),
    p_leader_id: leaderId || null,
    p_active: Boolean(active),
    p_area_type: areaType || "campo",
    p_meal_type_ids: Array.isArray(mealTypeIds) ? mealTypeIds : null
  });
  if (!error) return data;
  if (!isMissingSupplierCompanySchema(error) && !String(error?.message ?? "").includes("p_area_type")) return ensure(data, error);
  const retry = await requireSupabase().rpc("upsert_work_section", {
    p_id: id,
    p_name: String(name).trim(),
    p_headcount: Number(headcount ?? 0),
    p_leader_id: leaderId || null,
    p_active: Boolean(active)
  });
  return ensure(retry.data, retry.error);
}

export async function saveWorkSectionMealTypeLink({ sectionId, mealTypeId, active = true }) {
  const { data, error } = await requireSupabase().rpc("upsert_work_section_meal_type", {
    p_work_section_id: sectionId,
    p_meal_type_id: mealTypeId,
    p_active: Boolean(active)
  });
  return ensure(data, error);
}

export async function deleteWorkSection(id) {
  const { data, error } = await requireSupabase().rpc("delete_work_section", {
    p_id: id
  });
  return ensure(data, error);
}

export async function saveSupplierCompany(input) {
  const { data, error } = await requireSupabase().rpc("upsert_supplier_company", {
    p_id: input.id || null,
    p_legal_name: String(input.legalName ?? "").trim(),
    p_trade_name: String(input.tradeName ?? "").trim(),
    p_cnpj: String(input.cnpj ?? "").trim(),
    p_state_registration: String(input.stateRegistration ?? "").trim(),
    p_municipal_registration: String(input.municipalRegistration ?? "").trim(),
    p_address_line: String(input.addressLine ?? "").trim(),
    p_city: String(input.city ?? "").trim(),
    p_state: String(input.state ?? "").trim(),
    p_zip_code: String(input.zipCode ?? "").trim(),
    p_phone: String(input.phone ?? "").trim(),
    p_email: String(input.email ?? "").trim(),
    p_contact_name: String(input.contactName ?? "").trim(),
    p_bank_details: String(input.bankDetails ?? "").trim(),
    p_notes: String(input.notes ?? "").trim(),
    p_active: input.active !== false
  });
  return ensure(data, error);
}

export async function deleteSupplierCompany(id) {
  const { data, error } = await requireSupabase().rpc("delete_supplier_company", {
    p_id: id
  });
  return ensure(data, error);
}

export async function saveSupplierMealTypeLink({ supplierCompanyId, mealTypeId, active = true, unitPrice = null, notes = "" }) {
  const { data, error } = await requireSupabase().rpc("upsert_supplier_meal_type", {
    p_supplier_company_id: supplierCompanyId,
    p_meal_type_id: mealTypeId,
    p_active: Boolean(active),
    p_unit_price: unitPrice === "" || unitPrice === null || unitPrice === undefined ? null : Number(unitPrice),
    p_notes: String(notes ?? "").trim()
  });
  return ensure(data, error);
}

export async function saveSupplierCompanyUser({ supplierCompanyId, userId, active = true }) {
  const { data, error } = await requireSupabase().rpc("upsert_supplier_company_user", {
    p_supplier_company_id: supplierCompanyId,
    p_user_id: userId,
    p_active: Boolean(active)
  });
  return ensure(data, error);
}

export async function updateUserActiveStatus({ userId, active }) {
  const { data, error } = await requireSupabase().rpc("admin_update_user_active_status", {
    p_user_id: userId,
    p_active: Boolean(active)
  });
  return ensure(data, error);
}

export async function createAdminManagedUser({ email, password, name, role, supplierCompanyId = null, team = "", active = true }) {
  const { data, error } = await requireSupabase().functions.invoke("admin-create-user", {
    body: {
      action: "create",
      email: String(email ?? "").trim(),
      password,
      name: String(name ?? "").trim(),
      role,
      supplierCompanyId,
      team: String(team ?? "").trim(),
      active: Boolean(active)
    }
  });
  if (data?.error) throw new Error(data.error);
  if (error) {
    const response = error.context;
    if (response?.json) {
      let payload = null;
      try {
        payload = await response.json();
      } catch {}
      if (payload?.error) throw new Error(payload.error);
    }
    throw error;
  }
  return data;
}

export async function updateAdminManagedUser({ userId, email, password = "", name, role, team = "", active = true }) {
  const { data, error } = await requireSupabase().functions.invoke("admin-create-user", {
    body: {
      action: "update",
      userId,
      email: String(email ?? "").trim(),
      password,
      name: String(name ?? "").trim(),
      role,
      team: String(team ?? "").trim(),
      active: Boolean(active)
    }
  });
  if (data?.error) throw new Error(data.error);
  if (error) {
    const response = error.context;
    if (response?.json) {
      let payload = null;
      try {
        payload = await response.json();
      } catch {}
      if (payload?.error) throw new Error(payload.error);
    }
    throw error;
  }
  return data;
}

export async function deleteAdminManagedUser({ userId }) {
  const { data, error } = await requireSupabase().functions.invoke("admin-create-user", {
    body: {
      action: "delete",
      userId
    }
  });
  if (data?.error) throw new Error(data.error);
  if (error) {
    const response = error.context;
    if (response?.json) {
      let payload = null;
      try {
        payload = await response.json();
      } catch {}
      if (payload?.error) throw new Error(payload.error);
    }
    throw error;
  }
  return data;
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

export async function cancelConfirmedConsolidation(consolidationId, reason) {
  const { data, error } = await requireSupabase().rpc("cancel_confirmed_consolidation", {
    p_consolidation_id: consolidationId,
    p_reason: String(reason ?? "").trim()
  });
  return ensure(data, error);
}

export async function updateMealRequest(requestId, input) {
  const payload = {
    meal_date: input.date,
    meal_type_id: input.mealTypeId,
    location_id: input.locationId || null,
    team_id: input.teamId || null,
    quantity: Number(input.quantity),
    notes: String(input.notes ?? "")
  };
  const response = await requireSupabase()
    .from("meal_requests")
    .update(payload)
    .eq("id", requestId)
    .select("id")
    .single();
  if (!response.error) return response.data;
  if (!isMissingOperationSchema(response.error)) return ensure(response.data, response.error);
  const legacyPayload = { ...payload };
  delete legacyPayload.team_id;
  const retry = await requireSupabase()
    .from("meal_requests")
    .update(legacyPayload)
    .eq("id", requestId)
    .select("id")
    .single();
  return ensure(retry.data, retry.error);
}

export async function sendDailyConsolidation(mealDate, supplierCompanyId, supplierUserId = null) {
  const { data, error } = await requireSupabase().rpc("send_consolidation", {
    p_meal_date: mealDate,
    p_supplier_company_id: supplierCompanyId,
    p_supplier_user_id: supplierUserId
  });
  if (!error) return data;
  if (!isMissingSupplierCompanySchema(error) && !String(error?.message ?? "").includes("p_supplier_company_id")) return ensure(data, error);
  const retry = await requireSupabase().rpc("send_consolidation", {
    p_meal_date: mealDate,
    p_supplier_id: supplierCompanyId
  });
  return ensure(retry.data, retry.error);
}

export async function confirmSupplierStep(consolidationId, step) {
  const { error } = await requireSupabase().rpc("confirm_supplier_step", {
    p_consolidation_id: consolidationId,
    p_step: step,
    p_metadata: {}
  });
  ensure(null, error);
}

export async function saveConsolidationActuals(consolidationId, actuals) {
  const { data, error } = await requireSupabase().rpc("save_consolidation_actuals", {
    p_consolidation_id: consolidationId,
    p_actuals: actuals
  });
  return ensure(data, error);
}

export async function generateDailyReport(reportDate) {
  const { data, error } = await requireSupabase().rpc("generate_daily_report", {
    p_report_date: reportDate
  });
  return ensure(data, error);
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
  if (!user) throw new Error("Sessão expirada. Entre novamente.");
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
    .on("postgres_changes", { event: "*", schema: "public", table: "consolidation_actuals" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "work_sections" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "daily_reports" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "meal_types" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "meal_categories" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "work_area_types" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "work_area_type_categories" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "supplier_companies" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "supplier_meal_types" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "work_section_meal_types" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "app_settings" }, onChange)
    .subscribe();
}

export async function removeSubscription(channel) {
  if (channel) await requireSupabase().removeChannel(channel);
}
