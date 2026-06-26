export const USERS = [
  { id: "u-admin", name: "Mariana Costa", role: "admin", email: "admin@alimentaobra.local", team: "Administracao" },
  { id: "u-fornecedor", name: "Fornecedor Central", role: "fornecedor", email: "fornecedor@alimentaobra.local", team: "Cozinha Central" },
  { id: "u-wiliam", name: "Wiliam Barbosa", role: "encarregado", email: "wiliam@obra.local", team: "Frente Norte" },
  { id: "u-rilley", name: "Rilley Oliveira", role: "encarregado", email: "rilley@obra.local", team: "Terraplenagem" },
  { id: "u-jacquelino", name: "Jacquelino", role: "encarregado", email: "jacquelino@obra.local", team: "Estrutura" },
  { id: "u-joaquim", name: "Joaquim", role: "encarregado", email: "joaquim@obra.local", team: "Acabamento" },
  { id: "u-joao-pedro", name: "Joao Pedro", role: "encarregado", email: "joaopedro@obra.local", team: "Eletrica" },
  { id: "u-uanderson", name: "Uanderson Novais", role: "encarregado", email: "uanderson@obra.local", team: "Hidraulica" }
];

export const MEAL_TYPES = [
  { id: "marmita-campo", label: "Marmita Campo", description: "Marmita individual para entrega em campo.", active: true, locations: ["Campo"], leaderOnly: true },
  { id: "buffer-almoco", label: "Buffer Almoco", description: "Refeicao servida em ponto de apoio ou restaurante.", active: true, locations: ["Restaurante BR", "Restaurante Centro"] },
  { id: "jantar", label: "Jantar", description: "Refeicao noturna para equipes programadas.", active: true, locations: ["Restaurante Centro"] }
];

export const INITIAL_SETTINGS = {
  cutoffTime: "18:00",
  supplierName: "Fornecedor Central",
  defaultMealUnitPrice: 18.5,
  defaultMealDate: "2026-06-18",
  notificationChannel: "E-mail e push",
  offlineSyncEnabled: true
};

export const INITIAL_REQUESTS = [
  { id: "req-001", date: "2026-06-18", mealType: "Marmita Campo", quantity: 10, location: "Campo", leaderId: "u-wiliam", status: "enviado", notes: "", createdAt: "2026-06-17T07:10:00-03:00", updatedAt: "2026-06-17T07:10:00-03:00" },
  { id: "req-002", date: "2026-06-18", mealType: "Marmita Campo", quantity: 2, location: "Campo", leaderId: "u-rilley", status: "enviado", notes: "", createdAt: "2026-06-17T07:22:00-03:00", updatedAt: "2026-06-17T07:22:00-03:00" },
  { id: "req-003", date: "2026-06-18", mealType: "Marmita Campo", quantity: 9, location: "Campo", leaderId: "u-jacquelino", status: "enviado", notes: "", createdAt: "2026-06-17T08:05:00-03:00", updatedAt: "2026-06-17T08:05:00-03:00" },
  { id: "req-004", date: "2026-06-18", mealType: "Marmita Campo", quantity: 9, location: "Campo", leaderId: "u-joaquim", status: "enviado", notes: "", createdAt: "2026-06-17T08:18:00-03:00", updatedAt: "2026-06-17T08:18:00-03:00" },
  { id: "req-005", date: "2026-06-18", mealType: "Marmita Campo", quantity: 13, location: "Campo", leaderId: "u-joao-pedro", status: "enviado", notes: "", createdAt: "2026-06-17T08:50:00-03:00", updatedAt: "2026-06-17T08:50:00-03:00" },
  { id: "req-006", date: "2026-06-18", mealType: "Marmita Campo", quantity: 28, location: "Campo", leaderId: "u-uanderson", status: "enviado", notes: "", createdAt: "2026-06-17T09:02:00-03:00", updatedAt: "2026-06-17T09:02:00-03:00" },
  { id: "req-007", date: "2026-06-18", mealType: "Marmita Campo", quantity: 23, location: "Campo", leaderId: "u-admin", status: "enviado", notes: "Equipe apoio administrativo", createdAt: "2026-06-17T09:20:00-03:00", updatedAt: "2026-06-17T09:20:00-03:00" },
  { id: "req-008", date: "2026-06-18", mealType: "Buffer Almoco", quantity: 35, location: "Restaurante BR", leaderId: "u-wiliam", status: "enviado", notes: "", createdAt: "2026-06-17T10:00:00-03:00", updatedAt: "2026-06-17T10:00:00-03:00" },
  { id: "req-009", date: "2026-06-18", mealType: "Buffer Almoco", quantity: 18, location: "Restaurante Centro", leaderId: "u-joaquim", status: "enviado", notes: "", createdAt: "2026-06-17T10:11:00-03:00", updatedAt: "2026-06-17T10:11:00-03:00" },
  { id: "req-010", date: "2026-06-18", mealType: "Jantar", quantity: 42, location: "Restaurante Centro", leaderId: "u-jacquelino", status: "enviado", notes: "", createdAt: "2026-06-17T11:30:00-03:00", updatedAt: "2026-06-17T11:30:00-03:00" },
  { id: "req-011", date: "2026-06-17", mealType: "Marmita Campo", quantity: 12, location: "Campo", leaderId: "u-joaquim", status: "entregue", notes: "", createdAt: "2026-06-16T08:00:00-03:00", updatedAt: "2026-06-17T06:25:00-03:00" },
  { id: "req-012", date: "2026-06-17", mealType: "Jantar", quantity: 16, location: "Restaurante Centro", leaderId: "u-joaquim", status: "confirmado", notes: "", createdAt: "2026-06-16T09:20:00-03:00", updatedAt: "2026-06-16T09:20:00-03:00" }
];

export const INITIAL_CONSOLIDATIONS = [
  {
    id: "cons-2026-06-17",
    date: "2026-06-17",
    status: "saiu_entrega",
    sentAt: "2026-06-16T18:15:00-03:00",
    supplierId: "u-fornecedor",
    requestIds: ["req-011", "req-012"],
    confirmations: [
      { step: "recebido", userId: "u-fornecedor", at: "2026-06-16T18:22:00-03:00" },
      { step: "producao", userId: "u-fornecedor", at: "2026-06-17T05:40:00-03:00" },
      { step: "saiu_entrega", userId: "u-fornecedor", at: "2026-06-17T06:25:00-03:00" }
    ]
  }
];
