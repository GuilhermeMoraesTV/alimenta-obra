import { getConsolidationSummary, getUserName } from "./store-v2.js";

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

const mealUnitPrice = (state) => Number(state.settings?.defaultMealUnitPrice ?? 0);
const mealDescription = (state, mealTypeId) => state.mealCatalog?.find((meal) => meal.id === mealTypeId)?.description ?? "";

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

export function exportSupplierRomaneio(state, consolidation) {
  const summary = getConsolidationSummary(state, consolidation);
  const supplier = state.users.find((user) => user.id === consolidation.supplierId);
  const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  const issueDate = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date());
  let documentTotal = 0;
  const sections = Object.entries(summary.byMeal).flatMap(([meal, data], groupIndex) => Object.entries(data.byLocation).map(([location, total], index) => {
    const matchingRows = data.rows.filter((row) => row.location === location);
    const unitPrice = mealUnitPrice(state);
    const description = mealDescription(state, matchingRows[0]?.mealTypeId) || matchingRows[0]?.mealDescription;
    const lineTotal = Number(total) * unitPrice;
    documentTotal += lineTotal;
    return `<tr><td>${String(groupIndex + 1).padStart(3, "0")}.${index + 1}</td><td>${meal}<small>${description || location}</small></td><td>UN</td><td class="number">${total}</td><td class="number">${money(unitPrice)}</td><td class="number">${money(lineTotal)}</td></tr>`;
  })).join("");
  const popup = window.open("", "_blank");
  if (!popup) return false;
  popup.document.write(`
    <!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" />
    <title>Nota de fornecimento ${consolidation.date}</title><style>
      @page { size:A4 portrait; margin:10mm; } * { box-sizing:border-box; } body { margin:0; color:#111; font:10px Arial, sans-serif; } .document { border:1px solid #151515; min-height:275mm; } .top { display:grid; grid-template-columns:1.5fr .8fr; border-bottom:1px solid #151515; } .issuer { display:flex; gap:11px; padding:12px; border-right:1px solid #151515; } .mark { display:grid; width:42px; height:42px; place-items:center; color:#fff; background:#ef5b1d; font-size:15px; font-weight:900; } .issuer h1 { margin:0 0 4px; font-size:17px; } .issuer p { margin:2px 0; color:#444; } .doc-type { display:grid; place-items:center; align-content:center; gap:3px; text-align:center; } .doc-type strong { font-size:16px; } .doc-type span { font-size:8px; letter-spacing:.08em; } .access-key { display:grid; grid-template-columns:repeat(4, 1fr); border-bottom:1px solid #151515; } .cell { min-height:42px; padding:6px 8px; border-right:1px solid #151515; } .cell:last-child { border:0; } .label { display:block; margin-bottom:3px; color:#555; font-size:7px; font-weight:bold; letter-spacing:.04em; text-transform:uppercase; } .value { font-size:11px; font-weight:bold; } .parties { display:grid; grid-template-columns:1fr 1fr; border-bottom:1px solid #151515; } .party { min-height:68px; padding:8px; } .party + .party { border-left:1px solid #151515; } h2 { margin:0; padding:5px 8px; border-bottom:1px solid #151515; background:#f0f0f0; font-size:8px; letter-spacing:.06em; text-transform:uppercase; } table { width:100%; border-collapse:collapse; } th { padding:6px; border-right:1px solid #151515; border-bottom:1px solid #151515; background:#f7f7f7; font-size:7px; text-align:left; text-transform:uppercase; } td { min-height:31px; padding:7px 6px; border-right:1px solid #ccc; border-bottom:1px solid #ccc; vertical-align:top; } th:last-child, td:last-child { border-right:0; } td small { display:block; margin-top:3px; color:#555; } .number { text-align:right; white-space:nowrap; } .totals { display:grid; grid-template-columns:1fr 220px; border-top:1px solid #151515; } .observation { min-height:90px; padding:8px; border-right:1px solid #151515; } .total-box { display:grid; align-content:start; } .total-box div { display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #151515; } .total-box strong { font-size:14px; } .footer { padding:8px; border-top:1px solid #151515; color:#555; font-size:8px; } .receipt { display:grid; grid-template-columns:1.2fr .8fr; min-height:55px; border-top:1px solid #151515; } .receipt div { padding:8px; } .receipt div + div { border-left:1px solid #151515; }
    </style></head><body>
      <main class="document"><section class="top"><div class="issuer"><div class="mark">AO</div><div><h1>${supplier?.name ?? "Fornecedor"}</h1><p>Documento de fornecimento de refeicoes</p><p>Emitido pelo sistema AlimentaObra</p></div></div><div class="doc-type"><strong>NOTA DE FORNECIMENTO</strong><span>DOCUMENTO OPERACIONAL</span><b>Nº ${consolidation.id.slice(0, 8).toUpperCase()}</b></div></section><section class="access-key"><div class="cell"><span class="label">Data de emissao</span><span class="value">${issueDate}</span></div><div class="cell"><span class="label">Data de producao</span><span class="value">${new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(`${consolidation.date}T12:00:00`))}</span></div><div class="cell"><span class="label">Status</span><span class="value">${consolidation.status.toUpperCase()}</span></div><div class="cell"><span class="label">Controle interno</span><span class="value">${consolidation.id}</span></div></section><section class="parties"><div class="party"><span class="label">Emitente / fornecedor</span><span class="value">${supplier?.name ?? "Fornecedor"}</span><p>Responsavel pelo fornecimento e pela entrega das refeicoes.</p></div><div class="party"><span class="label">Destinatario</span><span class="value">AlimentaObra - Gestao de Refeicoes</span><p>Pedido consolidado para atendimento das frentes de trabalho.</p></div></section><h2>Dados dos produtos / servicos</h2><table><thead><tr><th>Item</th><th>Descricao</th><th>Un.</th><th>Quantidade</th><th>Valor unit.</th><th>Valor total</th></tr></thead><tbody>${sections}</tbody></table><section class="totals"><div class="observation"><span class="label">Informacoes complementares</span>Fornecimento conforme pedido consolidado para ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(`${consolidation.date}T12:00:00`))}. Valores comerciais e tributos devem constar na nota fiscal oficial anexada pelo fornecedor.</div><div class="total-box"><div><span>Quantidade total</span><strong>${summary.total}</strong></div><div><span>Valor total do documento</span><strong>${money(documentTotal)}</strong></div><div><span>Natureza da operacao</span><strong>Fornecimento</strong></div></div></section><div class="footer">Este documento acompanha a operacao e possui layout de nota de fornecimento. Nao substitui NF-e, DANFE ou documento fiscal.</div><section class="receipt"><div><span class="label">Recebimento</span>Declaro que recebi os itens descritos nesta nota de fornecimento.</div><div><span class="label">Data e assinatura</span><br><br>________________________________</div></section></main>
      <script>window.onload = () => window.print();<\/script></body></html>`);
  popup.document.close();
  return true;
}

export function exportFinancialPdf(state, rows, title) {
  const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  const unitPrice = () => mealUnitPrice(state);
  const total = rows.reduce((sum, request) => sum + Number(request.quantity) * unitPrice(request), 0);
  const delivered = rows.filter((request) => request.status === "entregue").reduce((sum, request) => sum + Number(request.quantity) * unitPrice(request), 0);
  const table = rows.sort((a, b) => b.date.localeCompare(a.date)).map((request) => `<tr><td>${request.date}</td><td>${request.mealType}</td><td>${request.quantity}</td><td>${money(unitPrice(request))}</td><td>${money(Number(request.quantity) * unitPrice(request))}</td><td>${request.status}</td></tr>`).join("");
  const popup = window.open("", "_blank");
  if (!popup) return false;
  popup.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${title}</title><style>@page { size:A4; margin:14mm; } body { font:11px Arial,sans-serif; color:#1d211d; } header { display:flex; justify-content:space-between; align-items:end; padding-bottom:14px; border-bottom:3px solid #ef5b1d; } h1 { margin:0; font-size:25px; } p { margin:4px 0 0; color:#666; } .metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin:18px 0; } .metric { padding:12px; border:1px solid #d8d7cf; } .metric span,.metric strong { display:block; } .metric span { color:#666; font-size:9px; text-transform:uppercase; } .metric strong { margin-top:6px; font-size:19px; } table { width:100%; border-collapse:collapse; } th,td { padding:8px; border:1px solid #d8d7cf; text-align:left; } th { background:#f2f1ec; font-size:9px; text-transform:uppercase; } .footer { margin-top:18px; color:#666; font-size:9px; }</style></head><body><header><div><h1>${title}</h1><p>Relatorio financeiro de refeicoes</p></div><strong>AlimentaObra</strong></header><section class="metrics"><div class="metric"><span>Total previsto</span><strong>${money(total)}</strong></div><div class="metric"><span>Entregue</span><strong>${money(delivered)}</strong></div><div class="metric"><span>Em aberto</span><strong>${money(total - delivered)}</strong></div></section><table><thead><tr><th>Data</th><th>Tipo</th><th>Qtd.</th><th>Unitario</th><th>Total</th><th>Status</th></tr></thead><tbody>${table}</tbody></table><p class="footer">Relatorio gerado em ${new Intl.DateTimeFormat("pt-BR", { dateStyle:"short", timeStyle:"short" }).format(new Date())}.</p><script>window.onload=()=>window.print();<\/script></body></html>`);
  popup.document.close();
  return true;
}

function renderReportHtml(state, consolidation, summary) {
  const sections = Object.entries(summary.byMeal).map(([meal, data]) => `
    <h2>${meal}</h2>
    ${mealDescription(state, data.rows[0]?.mealTypeId) || data.rows[0]?.mealDescription ? `<p>${mealDescription(state, data.rows[0]?.mealTypeId) || data.rows[0]?.mealDescription}</p>` : ""}
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
