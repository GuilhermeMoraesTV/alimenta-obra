import assert from "node:assert/strict";
import { countStatus, initials, nextSupplierStep, roleName, sumQty, totalsByMeal } from "../src/features/operations/metrics.js";
import { getActiveWorkSections, getConsolidationForDate, getSupplierCompanies, getSuppliersForMeal, getActualQuantity, requestOriginLabel, requestUnitPrice } from "../src/services/store-v2.js";

const rows = [
  { id: "r1", mealType: "Almoco", quantity: 10, status: "enviado" },
  { id: "r2", mealType: "Jantar", quantity: "4", status: "rascunho" },
  { id: "r3", mealType: "Almoco", quantity: 6, status: "enviado" }
];

assert.equal(sumQty(rows), 20);
assert.deepEqual(totalsByMeal(rows), { Almoco: 16, Jantar: 4 });
assert.equal(countStatus(rows, "enviado"), 2);
assert.deepEqual(nextSupplierStep("enviado"), { step: "confirmado", label: "Confirmar recebimento" });
assert.equal(nextSupplierStep("entregue"), null);
assert.equal(roleName("admin"), "Administrador");
assert.equal(initials("Maria Souza Lima"), "MS");

const workState = {
  workSections: [
    { id: "s1", leaderId: "u1", active: true },
    { id: "s2", leaderId: "u2", active: true },
    { id: "s3", active: true },
    { id: "s4", leaderId: "u1", active: false }
  ],
  users: [{ id: "f1", role: "fornecedor", active: true }]
};

assert.deepEqual(getActiveWorkSections(workState, "u1").map((item) => item.id), ["s1", "s3"]);

const supplierState = {
  ...workState,
  settings: { defaultMealUnitPrice: 18.5 },
  mealCatalog: [
    { id: "m1", label: "Marmita", active: true, unitPrice: 20 },
    { id: "m2", label: "Buffet", active: true, unitPrice: 30 }
  ],
  mealTypes: [
    { id: "m1", label: "Marmita", active: true, unitPrice: 20 },
    { id: "m2", label: "Buffet", active: true, unitPrice: 30 }
  ],
  supplierCompanies: [
    { id: "sc1", legalName: "Fornecedor Ativo", active: true },
    { id: "sc2", legalName: "Fornecedor Inativo", active: false }
  ],
  supplierMealTypes: [
    { supplierCompanyId: "sc1", mealTypeId: "m1", active: true, unitPrice: 21 },
    { supplierCompanyId: "sc1", mealTypeId: "m2", active: false, unitPrice: 31 },
    { supplierCompanyId: "sc2", mealTypeId: "m1", active: true, unitPrice: 19 }
  ],
  consolidationActuals: [
    { consolidationId: "c9", date: "2026-07-16", teamId: "s1", mealTypeId: "m1", quantity: 7 }
  ]
};

assert.deepEqual(getSupplierCompanies(supplierState, { includeInactive: false }).map((item) => item.id), ["sc1"]);
assert.deepEqual(getSuppliersForMeal(supplierState, "m1", { includeInactive: false }).map((item) => item.id), ["sc1"]);
assert.deepEqual(getSuppliersForMeal(supplierState, "m2", { includeInactive: false }).map((item) => item.id), []);
assert.equal(requestOriginLabel({ originRole: "admin", leaderId: null }), "Admin");
assert.equal(requestOriginLabel({ originRole: "admin", leaderId: "u1" }), "Encarregado");
assert.equal(requestUnitPrice(supplierState, { supplierCompanyId: "sc1", mealTypeId: "m1", unitPrice: 20 }), 21);
assert.equal(getActualQuantity(supplierState, "c9", { date: "2026-07-16", teamId: "s1", mealTypeId: "m1", quantity: 100 }), 7);

const blockState = {
  ...workState,
  requests: [
    { id: "r1", date: "2026-07-16", status: "enviado" },
    { id: "r2", date: "2026-07-16", status: "cancelado" },
    { id: "r3", date: "2026-07-16", status: "enviado" }
  ],
  consolidations: [
    { id: "c1", date: "2026-07-16", status: "entregue", requestIds: ["r1"] },
    { id: "c2", date: "2026-07-16", status: "rascunho", requestIds: [] }
  ]
};

assert.deepEqual(getConsolidationForDate(blockState, "2026-07-16").requestIds, ["r3"]);

console.log("Testes de regras passaram.");
