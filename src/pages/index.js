import { createAdminPages } from "./admin/index.js";
import { createLeaderPages } from "./encarregado/index.js";
import { createSettingsPage } from "./settings.js";
import { createSupplierPages } from "./fornecedor/index.js";

export function createPageRegistry(renderers) {
  return {
    ...createLeaderPages(renderers.leader),
    ...createAdminPages(renderers),
    ...createSupplierPages(renderers),
    configuracoes: createSettingsPage(renderers.settings)
  };
}
