import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1).replace(/^"|"$/g, "")];
    })
);

const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
const headers = { apikey: key, authorization: `Bearer ${key}` };

for (const table of ["supplier_companies", "supplier_company_users", "supplier_meal_types", "work_section_meal_types"]) {
  const response = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, { headers });
  const body = await response.text();
  console.log(JSON.stringify({ target: table, status: response.status, body: body.slice(0, 180) }));
}

const functionResponse = await fetch(`${url}/functions/v1/admin-create-user`, {
  method: "POST",
  headers: { ...headers, "content-type": "application/json" },
  body: JSON.stringify({
    email: "nobody@example.com",
    password: "x",
    name: "Teste",
    role: "encarregado"
  })
});
console.log(JSON.stringify({
  target: "admin-create-user",
  status: functionResponse.status,
  body: (await functionResponse.text()).slice(0, 180)
}));
