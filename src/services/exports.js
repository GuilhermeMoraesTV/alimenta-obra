import { getConsolidationSummary, getUserName } from "./store.js";

const download = (filename, mime, content) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export function exportCsv(state, rows, filename = "relatorio-refeicoes.csv") {
  const header = ["Data", "Encarregado", "Tipo", "Local", "Quantidade", "Status", "Criado em", "Atualizado em"];
  const lines = rows.map((request) => [
    request.date,
    getUserName(state, request.leaderId),
    request.mealType,
    request.location,
    request.quantity,
    request.status,
    request.createdAt,
    request.updatedAt
  ]);
  const csv = [header, ...lines]
    .map((line) => line.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(";"))
    .join("\n");
  download(filename, "text/csv;charset=utf-8", `\ufeff${csv}`);
}

export function exportWord(state, consolidation) {
  const summary = getConsolidationSummary(state, consolidation);
  const html = renderReportHtml(state, consolidation, summary);
  download(`pedido-consolidado-${consolidation.date}.doc`, "application/msword;charset=utf-8", html);
}

export function exportExcel(state, rows) {
  const tableRows = rows.map((request) => `
    <tr>
      <td>${request.date}</td>
      <td>${getUserName(state, request.leaderId)}</td>
      <td>${request.mealType}</td>
      <td>${request.location}</td>
      <td>${request.quantity}</td>
      <td>${request.status}</td>
    </tr>`).join("");
  const html = `
    <html><head><meta charset="UTF-8"></head><body>
      <table>
        <thead><tr><th>Data</th><th>Encarregado</th><th>Tipo</th><th>Local</th><th>Quantidade</th><th>Status</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body></html>`;
  download("relatorio-refeicoes.xlsx", "application/vnd.ms-excel;charset=utf-8", html);
}

export function exportPdf(state, consolidation) {
  const summary = getConsolidationSummary(state, consolidation);
  const html = renderReportHtml(state, consolidation, summary);
  const popup = window.open("", "_blank");
  popup.document.write(html);
  popup.document.close();
  popup.focus();
  popup.print();
}

function renderReportHtml(state, consolidation, summary) {
  const sections = Object.entries(summary.byMeal).map(([meal, data]) => `
    <h2>${meal}</h2>
    <table>
      <tbody>
        ${data.rows.map((request) => `<tr><td>${getUserName(state, request.leaderId)}</td><td>${request.location}</td><td>${request.quantity}</td></tr>`).join("")}
      </tbody>
      <tfoot><tr><th colspan="2">Total ${meal}</th><th>${data.total}</th></tr></tfoot>
    </table>`).join("");

  return `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Pedido consolidado ${consolidation.date}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #1a1a1a; margin: 32px; }
          h1 { color: #e8520a; margin-bottom: 4px; }
          h2 { margin-top: 24px; border-bottom: 2px solid #e8520a; padding-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          tfoot th { background: #f5f5f3; }
          .total { margin-top: 24px; font-size: 20px; font-weight: 700; }
        </style>
      </head>
      <body>
        <h1>Pedido Consolidado</h1>
        <p>Data: ${consolidation.date}</p>
        ${sections}
        <div class="total">Total geral: ${summary.total} refeicoes</div>
      </body>
    </html>`;
}
