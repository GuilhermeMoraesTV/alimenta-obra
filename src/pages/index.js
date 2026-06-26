import { createAdminPages } from "./admin.js";
import { createLeaderPages } from "./encarregado.js";
import { createSettingsPage } from "./settings.js";
import { createSupplierPages } from "./fornecedor.js";

export function createPageRegistry(renderers) {
  return {
    ...createLeaderPages(renderers.leader),
    ...createAdminPages(renderers),
    ...createSupplierPages(renderers),
    configuracoes: createSettingsPage(renderers.settings)
  };
}
