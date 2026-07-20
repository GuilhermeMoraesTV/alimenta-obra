import { requestUnitPrice as resolveRequestUnitPrice } from "../../services/store-v2.js";

export function createMealDomain({ getState, getConsolidationSummary }) {
  function requestUnitPrice(request = {}) {
    return resolveRequestUnitPrice(getState(), request);
  }

  function requestValue(request) {
    return Number(request.quantity) * requestUnitPrice(request);
  }

  function mealById(mealTypeId) {
    const state = getState();
    return state.mealCatalog.find((meal) => meal.id === mealTypeId)
      ?? state.mealTypes.find((meal) => meal.id === mealTypeId)
      ?? null;
  }

  function requestMealDescription(request) {
    return mealById(request.mealTypeId)?.description ?? request.mealDescription ?? "";
  }

  function consolidationValue(consolidation) {
    const state = getState();
    return getConsolidationSummary(state, consolidation).rows.reduce((sum, request) => sum + requestValue(request), 0);
  }

  function pendingSyncText() {
    const pending = getState().syncQueue.filter((item) => !item.synced).length;
    return pending ? `${pending} a sincronizar` : "sincronizado";
  }

  return {
    consolidationValue,
    mealById,
    pendingSyncText,
    requestMealDescription,
    requestUnitPrice,
    requestValue
  };
}
