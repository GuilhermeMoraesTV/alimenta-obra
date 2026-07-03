import { getConsolidationSummary, getUserName } from "./store-v2.js";

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const LOGO_URL = new URL(`${import.meta.env.BASE_URL}assets/logo-alimentaobra.png`, window.location.origin).href;

const downloadBlob = (filename, blob) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const download = (filename, mime, content) => {
  downloadBlob(filename, new Blob([content], { type: mime }));
};

const escapeXml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const mealUnitPrice = (state) => Number(state.settings?.defaultMealUnitPrice ?? 0);
const mealDescription = (state, mealTypeId) => state.mealCatalog?.find((meal) => meal.id === mealTypeId)?.description ?? "";
const formatDateTime = (value) => value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "-";
const formatDate = (value) => value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(`${value}T12:00:00`)) : "-";
const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value ?? 0));
const auditEntityLabel = (entity) => ({
  pedido: "Pedido de refeicao",
  meal_request: "Pedido de refeicao",
  tipo_alimentacao: "Tipo de alimentacao",
  meal_type: "Tipo de alimentacao",
  consolidacao: "Envio ao fornecedor",
  consolidation: "Envio ao fornecedor",
  fornecedor: "Fornecedor",
  supplier: "Fornecedor",
  usuario: "Usuario",
  user: "Usuario",
  seed: "Carga inicial"
}[entity] ?? String(entity ?? "Registro").replaceAll("_", " "));

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
  download(`pedido-ao-fornecedor-${consolidation.date}.doc`, "application/msword;charset=utf-8", renderWordReportHtml(state, consolidation, summary));
}

export function exportExcel(state, rows) {
  const headers = ["Data", "Encarregado", "Tipo", "Local", "Quantidade", "Status", "Criado em", "Atualizado em"];
  const dataRows = rows.map((request) => [
    request.date,
    getUserName(state, request.leaderId),
    request.mealType,
    request.location,
    Number(request.quantity ?? 0),
    request.status,
    request.createdAt,
    request.updatedAt
  ]);
  const workbook = createXlsxWorkbook("Relatorio de refeicoes", [headers, ...dataRows]);
  downloadBlob("relatorio-refeicoes.xlsx", new Blob([workbook], { type: XLSX_MIME }));
}

export function exportPdf(state, consolidation) {
  const summary = getConsolidationSummary(state, consolidation);
  return openPrintDocument(renderConsolidationPdfHtml(state, consolidation, summary), `Pedido ao fornecedor ${consolidation.date}`);
}

export function exportSupplierRomaneio(state, consolidation) {
  const summary = getConsolidationSummary(state, consolidation);
  return openPrintDocument(renderSupplierRomaneioHtml(state, consolidation, summary), `Nota de fornecimento ${consolidation.date}`);
}

export function exportFinancialPdf(state, rows, title) {
  return openPrintDocument(renderFinancialPdfHtml(state, rows, title), title);
}

export function exportAuditPdf(state) {
  return openPrintDocument(renderAuditPdfHtml(state), "Auditoria do sistema");
}

function openPrintDocument(html, title) {
  const popup = window.open("", "_blank");
  if (!popup) return false;
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
  popup.document.title = title;
  return true;
}

function renderPrintablePage({ title, subtitle, eyebrow = "AlimentaObra", children, footer = "" }) {
  const generatedAt = formatDateTime(new Date().toISOString());
  return `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page { size: A4; margin: 12mm; }
      * { box-sizing: border-box; }
      body { margin: 0; background: #f5f2ec; color: #1c1917; font: 12px Arial, sans-serif; }
      .print-toolbar { position: sticky; top: 0; z-index: 10; display: flex; justify-content: center; gap: 8px; padding: 10px; background: rgba(28,25,23,.92); box-shadow: 0 10px 30px rgba(0,0,0,.2); }
      .print-toolbar button { min-height: 38px; border: 0; border-radius: 8px; background: #ea580c; color: #fff; padding: 0 16px; font-weight: 800; cursor: pointer; }
      .print-toolbar span { display: inline-flex; align-items: center; color: #f5f2ec; font-size: 11px; font-weight: 700; }
      .document { width: min(210mm, calc(100% - 24px)); min-height: 297mm; margin: 12px auto; background: #fffdf8; padding: 14mm; box-shadow: 0 18px 45px rgba(28,25,23,.16); }
      .brand-header { display: grid; grid-template-columns: 1fr auto; gap: 18px; align-items: center; padding-bottom: 16px; border-bottom: 4px solid #ea580c; }
      .brand-mark { display: flex; align-items: center; gap: 12px; }
      .brand-mark img { width: 122px; max-height: 46px; object-fit: contain; object-position: left center; }
      .brand-mark span { display: block; color: #c2410c; font-size: 10px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
      h1 { margin: 6px 0 0; font-size: 25px; line-height: 1.05; letter-spacing: 0; }
      .document-subtitle { max-width: 420px; margin: 7px 0 0; color: #57534e; line-height: 1.45; }
      .generated { text-align: right; color: #78716c; font-size: 10px; font-weight: 800; text-transform: uppercase; }
      .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; margin: 18px 0; }
      .metric { min-height: 66px; border: 1px solid #e7e5e4; border-left: 5px solid #ea580c; border-radius: 8px; background: #fff; padding: 10px; }
      .metric span { display: block; color: #78716c; font-size: 9px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
      .metric strong { display: block; margin-top: 7px; font-size: 19px; color: #1c1917; }
      .section-title { margin: 18px 0 8px; font-size: 13px; font-weight: 900; text-transform: uppercase; color: #c2410c; letter-spacing: .08em; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; overflow: hidden; border-radius: 8px; }
      th { background: #292524; color: #fff7ed; padding: 8px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: .07em; }
      td { border: 1px solid #e7e5e4; padding: 8px; vertical-align: top; }
      tbody tr:nth-child(even) td { background: #fafaf9; }
      tfoot th { background: #fff7ed; color: #9a3412; border: 1px solid #fed7aa; }
      .number { text-align: right; white-space: nowrap; }
      .small-note { margin-top: 6px; color: #78716c; font-size: 10px; line-height: 1.45; }
      .two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 14px 0; }
      .info-box { border: 1px solid #e7e5e4; border-radius: 8px; background: #fff; padding: 10px; }
      .info-box span { display: block; color: #78716c; font-size: 9px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
      .info-box strong { display: block; margin-top: 5px; font-size: 13px; }
      .timeline { display: grid; gap: 8px; }
      .timeline-item { display: grid; grid-template-columns: 10px 1fr; gap: 10px; border: 1px solid #e7e5e4; border-radius: 8px; background: #fff; padding: 9px; }
      .timeline-dot { width: 10px; height: 10px; margin-top: 3px; border-radius: 50%; background: #ea580c; }
      .footer { margin-top: 18px; padding-top: 10px; border-top: 1px solid #e7e5e4; color: #78716c; font-size: 10px; line-height: 1.4; }
      @media print {
        body { background: #fff; }
        .print-toolbar { display: none; }
        .document { width: auto; min-height: auto; margin: 0; padding: 0; box-shadow: none; background: #fff; }
      }
    </style></head><body>
      <div class="print-toolbar"><button onclick="window.print()">Imprimir / salvar PDF</button><span>A pagina do sistema continua livre na aba anterior.</span></div>
      <main class="document">
        <header class="brand-header">
          <div><div class="brand-mark"><img src="${LOGO_URL}" alt="AlimentaObra" /><div><span>${escapeHtml(eyebrow)}</span><h1>${escapeHtml(title)}</h1></div></div>${subtitle ? `<p class="document-subtitle">${escapeHtml(subtitle)}</p>` : ""}</div>
          <div class="generated">Gerado em<br>${generatedAt}</div>
        </header>
        ${children}
        <footer class="footer">${footer || "Documento gerado pelo AlimentaObra para padronizacao operacional e rastreabilidade das refeicoes."}</footer>
      </main>
    </body></html>`;
}

function renderConsolidationPdfHtml(state, consolidation, summary) {
  const mealTypeCount = Object.keys(summary.byMeal).length;
  const sections = Object.entries(summary.byMeal).map(([meal, data]) => `
    <section>
      <h2 class="section-title">${escapeHtml(meal)}</h2>
      ${mealDescription(state, data.rows[0]?.mealTypeId) || data.rows[0]?.mealDescription ? `<p class="small-note">${escapeHtml(mealDescription(state, data.rows[0]?.mealTypeId) || data.rows[0]?.mealDescription)}</p>` : ""}
      <table>
        <thead><tr><th>Encarregado</th><th>Local</th><th class="number">Quantidade</th></tr></thead>
        <tbody>${data.rows.map((request) => `<tr><td>${escapeHtml(getUserName(state, request.leaderId))}</td><td>${escapeHtml(request.location)}</td><td class="number">${Number(request.quantity ?? 0)}</td></tr>`).join("")}</tbody>
        <tfoot><tr><th colspan="2">Total ${escapeHtml(meal)}</th><th class="number">${data.total}</th></tr></tfoot>
      </table>
    </section>`).join("");

  return renderPrintablePage({
    title: "Pedido ao fornecedor",
    subtitle: `Resumo operacional de ${formatDate(consolidation.date)} com distribuicao por refeicao, local e encarregado.`,
    children: `<section class="metrics"><div class="metric"><span>Data</span><strong>${formatDate(consolidation.date)}</strong></div><div class="metric"><span>Total geral</span><strong>${summary.total}</strong></div><div class="metric"><span>Tipos de refeicao</span><strong>${mealTypeCount}</strong></div></section>${sections}`
  });
}

function renderSupplierRomaneioHtml(state, consolidation, summary) {
  const supplier = state.users.find((user) => user.id === consolidation.supplierId);
  let documentTotal = 0;
  const rows = Object.entries(summary.byMeal).flatMap(([meal, data], groupIndex) => Object.entries(data.byLocation).map(([location, total], index) => {
    const matchingRows = data.rows.filter((row) => row.location === location);
    const unitPrice = mealUnitPrice(state);
    const description = mealDescription(state, matchingRows[0]?.mealTypeId) || matchingRows[0]?.mealDescription || location;
    const lineTotal = Number(total) * unitPrice;
    documentTotal += lineTotal;
    return `<tr><td>${String(groupIndex + 1).padStart(3, "0")}.${index + 1}</td><td>${escapeHtml(meal)}<div class="small-note">${escapeHtml(description)}</div></td><td>UN</td><td class="number">${total}</td><td class="number">${money(unitPrice)}</td><td class="number">${money(lineTotal)}</td></tr>`;
  })).join("");

  return renderPrintablePage({
    title: "Nota de fornecimento",
    subtitle: `Documento operacional do pedido ${consolidation.id.slice(0, 8).toUpperCase()} para ${formatDate(consolidation.date)}.`,
    children: `
      <section class="two-columns">
        <div class="info-box"><span>Fornecedor</span><strong>${escapeHtml(supplier?.name ?? "Fornecedor")}</strong><p class="small-note">Responsavel pelo fornecimento e entrega das refeicoes.</p></div>
        <div class="info-box"><span>Destinatario</span><strong>AlimentaObra</strong><p class="small-note">Pedido enviado para atendimento das frentes de trabalho.</p></div>
      </section>
      <section class="metrics"><div class="metric"><span>Data de producao</span><strong>${formatDate(consolidation.date)}</strong></div><div class="metric"><span>Quantidade total</span><strong>${summary.total}</strong></div><div class="metric"><span>Valor total</span><strong>${money(documentTotal)}</strong></div></section>
      <h2 class="section-title">Dados dos produtos / servicos</h2>
      <table><thead><tr><th>Item</th><th>Descricao</th><th>Un.</th><th class="number">Quantidade</th><th class="number">Valor unit.</th><th class="number">Valor total</th></tr></thead><tbody>${rows}</tbody></table>
      <section class="two-columns">
        <div class="info-box"><span>Informacoes complementares</span><p class="small-note">Fornecimento conforme pedido enviado ao fornecedor. Valores comerciais e tributos devem constar na nota fiscal oficial anexada pelo fornecedor.</p></div>
        <div class="info-box"><span>Recebimento</span><p class="small-note">Declaro que recebi os itens descritos nesta nota de fornecimento.</p><br><br>________________________________</div>
      </section>`,
    footer: "Este documento acompanha a operacao e nao substitui NF-e, DANFE ou documento fiscal."
  });
}

function renderFinancialPdfHtml(state, rows, title) {
  const unitPrice = () => mealUnitPrice(state);
  const sortedRows = [...rows].sort((a, b) => b.date.localeCompare(a.date));
  const total = sortedRows.reduce((sum, request) => sum + Number(request.quantity) * unitPrice(request), 0);
  const delivered = sortedRows.filter((request) => request.status === "entregue").reduce((sum, request) => sum + Number(request.quantity) * unitPrice(request), 0);
  const table = sortedRows.map((request) => `<tr><td>${formatDate(request.date)}</td><td>${escapeHtml(request.mealType)}</td><td class="number">${Number(request.quantity ?? 0)}</td><td class="number">${money(unitPrice(request))}</td><td class="number">${money(Number(request.quantity) * unitPrice(request))}</td><td>${escapeHtml(request.status)}</td></tr>`).join("");

  return renderPrintablePage({
    title,
    subtitle: "Relatorio financeiro de refeicoes com totais previstos, entregues e em aberto.",
    children: `<section class="metrics"><div class="metric"><span>Total previsto</span><strong>${money(total)}</strong></div><div class="metric"><span>Entregue</span><strong>${money(delivered)}</strong></div><div class="metric"><span>Em aberto</span><strong>${money(total - delivered)}</strong></div></section><h2 class="section-title">Movimentacoes</h2><table><thead><tr><th>Data</th><th>Tipo</th><th class="number">Qtd.</th><th class="number">Unitario</th><th class="number">Total</th><th>Status</th></tr></thead><tbody>${table}</tbody></table>`
  });
}

function renderAuditPdfHtml(state) {
  const auditRows = [...state.auditLog];
  const userCount = new Set(auditRows.map((item) => item.userId)).size;
  const entityCount = new Set(auditRows.map((item) => auditEntityLabel(item.entity))).size;
  const timeline = auditRows.map((item) => `<div class="timeline-item"><div class="timeline-dot"></div><div><strong>${escapeHtml(item.action)}</strong><br>${escapeHtml(getUserName(state, item.userId))} - ${formatDateTime(item.at)} - ${escapeHtml(auditEntityLabel(item.entity))}</div></div>`).join("");

  return renderPrintablePage({
    title: "Auditoria do sistema",
    subtitle: "Registro de usuario, data e horario das acoes realizadas no AlimentaObra.",
    children: `<section class="metrics"><div class="metric"><span>Eventos</span><strong>${auditRows.length}</strong></div><div class="metric"><span>Usuarios</span><strong>${userCount}</strong></div><div class="metric"><span>Areas</span><strong>${entityCount}</strong></div></section><h2 class="section-title">Eventos registrados</h2><section class="timeline">${timeline || "<p class=\"small-note\">Nenhum evento registrado.</p>"}</section>`
  });
}

function renderWordReportHtml(state, consolidation, summary) {
  const sections = Object.entries(summary.byMeal).map(([meal, data]) => `
    <h2>${escapeHtml(meal)}</h2>
    ${mealDescription(state, data.rows[0]?.mealTypeId) || data.rows[0]?.mealDescription ? `<p>${escapeHtml(mealDescription(state, data.rows[0]?.mealTypeId) || data.rows[0]?.mealDescription)}</p>` : ""}
    <table>
      <tbody>${data.rows.map((request) => `<tr><td>${escapeHtml(getUserName(state, request.leaderId))}</td><td>${escapeHtml(request.location)}</td><td>${Number(request.quantity ?? 0)}</td></tr>`).join("")}</tbody>
      <tfoot><tr><th colspan="2">Total ${escapeHtml(meal)}</th><th>${data.total}</th></tr></tfoot>
    </table>`).join("");

  return `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" /><title>Pedido ao fornecedor ${escapeHtml(consolidation.date)}</title><style>body{font-family:Arial,sans-serif;color:#1a1a1a;margin:32px}h1{color:#e8520a;margin-bottom:4px}h2{margin-top:24px;border-bottom:2px solid #e8520a;padding-bottom:6px}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:1px solid #ddd;padding:8px;text-align:left}tfoot th{background:#f5f5f3}.total{margin-top:24px;font-size:20px;font-weight:700}</style></head><body><h1>Pedido ao fornecedor</h1><p>Data: ${formatDate(consolidation.date)}</p>${sections}<div class="total">Total geral: ${summary.total} refeicoes</div></body></html>`;
}

function createXlsxWorkbook(sheetName, rows) {
  const entries = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${escapeXml(sheetName).slice(0, 31)}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    "xl/styles.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Arial"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFEA580C"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
    "xl/worksheets/sheet1.xml": createWorksheetXml(rows)
  };
  return createZip(entries);
}

function createWorksheetXml(rows) {
  const cols = [14, 28, 22, 30, 12, 16, 24, 24].map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`).join("");
  const sheetRows = rows.map((row, rowIndex) => {
    const cells = row.map((cell, cellIndex) => {
      const ref = `${columnName(cellIndex + 1)}${rowIndex + 1}`;
      if (typeof cell === "number" && Number.isFinite(cell)) return `<c r="${ref}"><v>${cell}</v></c>`;
      return `<c r="${ref}" t="inlineStr"${rowIndex === 0 ? ' s="1"' : ""}><is><t>${escapeXml(cell)}</t></is></c>`;
    }).join("");
    return `<row r="${rowIndex + 1}">${cells}</row>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>${cols}</cols><sheetData>${sheetRows}</sheetData><autoFilter ref="A1:H${Math.max(rows.length, 1)}"/></worksheet>`;
}

function columnName(index) {
  let name = "";
  while (index > 0) {
    const remainder = (index - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    index = Math.floor((index - remainder) / 26);
  }
  return name;
}

function createZip(entries) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  Object.entries(entries).forEach(([filename, content]) => {
    const nameBytes = encoder.encode(filename);
    const data = encoder.encode(content);
    const crc = crc32(data);
    const localHeader = zipLocalHeader(nameBytes, data.length, crc);
    localParts.push(localHeader, data);
    centralParts.push(zipCentralHeader(nameBytes, data.length, crc, offset));
    offset += localHeader.length + data.length;
  });
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = zipEndRecord(Object.keys(entries).length, centralSize, offset);
  return concatUint8Arrays([...localParts, ...centralParts, end]);
}

function zipLocalHeader(nameBytes, size, crc) {
  const header = new Uint8Array(30 + nameBytes.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x04034b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 0x0800, true);
  view.setUint16(8, 0, true);
  view.setUint32(14, crc, true);
  view.setUint32(18, size, true);
  view.setUint32(22, size, true);
  view.setUint16(26, nameBytes.length, true);
  header.set(nameBytes, 30);
  return header;
}

function zipCentralHeader(nameBytes, size, crc, offset) {
  const header = new Uint8Array(46 + nameBytes.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x02014b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 20, true);
  view.setUint16(8, 0x0800, true);
  view.setUint16(10, 0, true);
  view.setUint32(16, crc, true);
  view.setUint32(20, size, true);
  view.setUint32(24, size, true);
  view.setUint16(28, nameBytes.length, true);
  view.setUint32(42, offset, true);
  header.set(nameBytes, 46);
  return header;
}

function zipEndRecord(entryCount, centralSize, centralOffset) {
  const header = new Uint8Array(22);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(8, entryCount, true);
  view.setUint16(10, entryCount, true);
  view.setUint32(12, centralSize, true);
  view.setUint32(16, centralOffset, true);
  return header;
}

function concatUint8Arrays(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  parts.forEach((part) => {
    output.set(part, offset);
    offset += part.length;
  });
  return output;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});

function crc32(bytes) {
  let crc = 0xffffffff;
  bytes.forEach((byte) => {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  });
  return (crc ^ 0xffffffff) >>> 0;
}
