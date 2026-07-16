import assert from "node:assert/strict";
import { countStatus, initials, nextSupplierStep, roleName, sumQty, totalsByMeal } from "../src/features/operations/metrics.js";
import { getActiveWorkSections, getConsolidationForDate } from "../src/services/store-v2.js";

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
