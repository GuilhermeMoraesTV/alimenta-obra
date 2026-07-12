import { getConsolidationSummary, getSuppliers, getUserName } from "./store-v2.js";
import { STATUS_LABEL } from "../core/navigation.js";

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const SYSTEM_LOGO_URL = new URL(`${import.meta.env.BASE_URL}assets/logo-alimentaobra.png`, window.location.origin).href;
const CONSAG_LOGO_URL = new URL(`${import.meta.env.BASE_URL}assets/logo-consag.png`, window.location.origin).href;
const KPI_CHART_COLORS = ["#002060", "#0070c0", "#7ea6d8", "#a6a6a6", "#d9e2f3", "#4b76b8"];

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

const mealUnitPrice = (state, mealTypeId = "") => {
  const meal = state.mealCatalog?.find((item) => item.id === mealTypeId)
    ?? state.mealTypes?.find((item) => item.id === mealTypeId);
  return Number(meal?.unitPrice ?? state.settings?.defaultMealUnitPrice ?? 0);
};
const mealDescription = (state, mealTypeId) => state.mealCatalog?.find((meal) => meal.id === mealTypeId)?.description ?? "";
const sectionHeadcount = (state, sectionId) => Number(state.workSections?.find((section) => section.id === sectionId)?.headcount ?? 0);
const requestHeadcount = (state, request) => Number(request.sectionHeadcount ?? request.headcount ?? sectionHeadcount(state, request.teamId));
const requestUnitPrice = (state, request) => Number(request.unitPrice ?? request.unit_price ?? mealUnitPrice(state, request.mealTypeId));
const actualQuantity = (state, request) => Number(state.consolidationActuals?.find((item) => item.date === request.date && item.teamId === request.teamId && item.mealTypeId === request.mealTypeId)?.quantity ?? request.actualQuantity ?? request.quantity ?? 0);
const formatDateTime = (value) => value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "-";
const formatDate = (value) => value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(`${value}T12:00:00`)) : "-";
const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value ?? 0));
const auditEntityLabel = (entity) => ({
  pedido: "Pedido de refeição",
  meal_request: "Pedido de refeição",
  tipo_alimentacao: "Tipo de alimentação",
  meal_type: "Tipo de alimentação",
  consolidacao: "Envio ao fornecedor",
  consolidation: "Envio ao fornecedor",
  fornecedor: "Fornecedor",
  supplier: "Fornecedor",
  usuario: "Usuário",
  user: "Usuário",
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
  const workbook = createXlsxWorkbook("Relatório de refeições", [headers, ...dataRows]);
  downloadBlob("relatorio-refeicoes.xlsx", new Blob([workbook], { type: XLSX_MIME }));
}

export async function exportMeasurementExcel(state, rows, options = {}) {
  const model = buildMeasurementModel(state, rows, options);
  downloadBlob(`medicao-${model.filenamePeriod}.xlsx`, new Blob([createMeasurementWorkbook(model)], { type: XLSX_MIME }));
}

export function exportOrdersExcel(state, rows, options = {}) {
  const model = buildOrdersModel(state, rows, options);
  const workbook = createMultiSheetWorkbook([
    { name: "Pedidos", rows: model.tableRows },
    { name: "Resumo diario", rows: model.blockRows }
  ]);
  downloadBlob(`pedidos-${model.filenamePeriod}.xlsx`, new Blob([workbook], { type: XLSX_MIME }));
}

export function exportOrdersPdf(state, rows, options = {}) {
  return openPrintDocument(renderOrdersPdfHtml(state, rows, options), `Pedidos ${options.periodLabel ?? ""}`.trim());
}

export function exportMeasurementPdf(state, rows, options = {}) {
  const model = buildMeasurementModel(state, rows, options);
  return openPrintDocument(renderMeasurementPdfHtml(model), `Medicao ${model.periodLabel}`);
}

export function exportAuditExcel(state) {
  const rows = [
    ["Data/Hora", "Usuario", "Acao", "Area", "Descricao"],
    ...(state.auditLog ?? []).map((item) => [
      formatDateTime(item.at),
      getUserName(state, item.userId),
      item.action,
      auditEntityLabel(item.entity),
      auditDescription(item)
    ])
  ];
  downloadBlob("auditoria-alimentaobra.xlsx", new Blob([createXlsxWorkbook("Auditoria", rows)], { type: XLSX_MIME }));
}

export async function exportDailyReportExcel(state, report) {
  const rows = dailyReportRows(state, report);
  const totals = report?.totals ?? {};
  const sheetRows = [
    ["CONSAG", "", "", "Relatorio Diario Automatico", "", "", "", "", "AlimentaObra"],
    ["", "", "", `Data: ${formatDate(report.date)}`, "", "", "", "", `Efetivo: ${Number(totals.headcount ?? 0) || "-"}`],
    ["", "", "", `Solicitado: ${Number(totals.requested ?? 0)} | Realizado: ${Number(totals.consumed ?? 0)}`, "", "", "", "", `Custo: ${money(totals.cost ?? 0)}`],
    ["", "", "", `Gerado: ${formatDateTime(report.generatedAt)}`],
    [],
    ["Data", "Dia", "Encarregado", "Equipe/Trecho", "Tipo", "Solicitado", "Realizado", "Efetivo", "Valor unitario", "Valor total", "Status"],
    ...rows.map((row) => [row.date, row.weekday, row.leader, row.section, row.meal, row.requested, row.consumed, row.effective || "", row.unitPrice, row.value, row.status])
  ];
  downloadBlob(`relatorio-diario-${report.date}.xlsx`, new Blob([createXlsxWorkbook("Relatorio diario", sheetRows)], { type: XLSX_MIME }));
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
  return openPrintDocument(renderExecutiveFinancialPdfHtml(state, rows, title), title);
}

export function exportKpiPdf(state, rows, title = "KPIs operacionais") {
  return openPrintDocument(renderKpiPdfHtml(state, rows, title), title);
}

export function exportAuditPdf(state) {
  return openPrintDocument(renderAuditPdfHtml(state), "Auditoria do sistema");
}

export function exportDailyReportPdf(report) {
  return openPrintDocument(renderDailyReportPdfHtml(report), `Relatorio diario ${report.date}`);
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

function auditDescription(item) {
  const payload = item.payload ?? {};
  if (item.action === "Fornecedor alterou status do pedido") {
    const labels = {
      confirmado: "Fornecedor confirmou o recebimento",
      producao: "Fornecedor iniciou a producao",
      saiu_entrega: "Fornecedor registrou a saida para entrega",
      entregue: "Fornecedor confirmou a entrega"
    };
    return labels[payload.status] ?? `Fornecedor alterou o status para ${payload.status ?? "-"}`;
  }
  if (item.action === "Bloco diario enviado ou atualizado ao fornecedor") return "Admin enviou ou reenviou o bloco ao fornecedor";
  if (item.action === "Bloco diario criado ou atualizado") return "Admin atualizou a composicao do pedido ao fornecedor";
  return auditEntityLabel(item.entity);
}

function buildMeasurementModel(state, rows, options = {}) {
  const activeRows = rows.filter((request) => request.status !== "cancelado")
    .sort((a, b) => `${a.date}-${a.mealType}`.localeCompare(`${b.date}-${b.mealType}`, "pt-BR"));
  const rowDates = activeRows.map((request) => request.date).filter(Boolean).sort();
  const periodStart = options.filter?.start || rowDates[0] || state.settings?.defaultMealDate || new Date().toISOString().slice(0, 10);
  const periodEnd = options.filter?.end || rowDates.at(-1) || periodStart;
  const periodLabel = options.periodLabel || (periodStart === periodEnd ? formatDate(periodStart) : `${formatDate(periodStart)} a ${formatDate(periodEnd)}`);
  const days = dateRange(periodStart, periodEnd);
  const catalog = state.mealCatalog ?? state.mealTypes ?? [];
  const catalogOrder = new Map(catalog.map((meal, index) => [meal.id, index]));
  const meals = Object.values(activeRows.reduce((acc, request) => {
    const id = request.mealTypeId || request.mealType || "refeicao";
    acc[id] ??= {
      id,
      label: request.mealType || "Refeicao",
      description: mealDescription(state, id) || request.mealDescription || "",
      order: catalogOrder.get(id) ?? 999,
      quantityTotal: 0,
      valueTotal: 0
    };
    return acc;
  }, {})).sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, "pt-BR"));

  if (meals.length < 3) {
    const existingIds = new Set(meals.map((meal) => meal.id));
    catalog.filter((meal) => meal.active !== false && !existingIds.has(meal.id)).slice(0, 3 - meals.length).forEach((meal, index) => {
      meals.push({ id: meal.id, label: meal.label ?? meal.name ?? "Refeicao", description: meal.description ?? "", order: index, quantityTotal: 0, valueTotal: 0 });
    });
  }

  const byDateMeal = new Map();
  activeRows.forEach((request) => {
    const key = `${request.date}|${request.mealTypeId || request.mealType || "refeicao"}`;
    const unitPrice = requestUnitPrice(state, request);
    const quantity = actualQuantity(state, request);
    const current = byDateMeal.get(key) ?? { requested: 0, consumed: 0, effective: 0, unitPrice, value: 0 };
    current.requested += Number(request.quantity ?? 0);
    current.consumed += quantity;
    current.effective += requestHeadcount(state, request);
    current.unitPrice = unitPrice || current.unitPrice;
    current.value += quantity * current.unitPrice;
    byDateMeal.set(key, current);
  });

  const dayRows = days.map((date) => ({
    date,
    longDate: longDate(date),
    weekday: weekdayShort(date),
    meals: meals.map((meal) => byDateMeal.get(`${date}|${meal.id}`) ?? {
      requested: 0,
      consumed: 0,
      effective: 0,
      unitPrice: mealUnitPrice(state, meal.id),
      value: 0
    })
  }));

  dayRows.forEach((day) => {
    day.meals.forEach((item, index) => {
      meals[index].quantityTotal += Number(item.consumed ?? 0);
      meals[index].valueTotal += Number(item.value ?? 0);
    });
  });

  const detailRows = activeRows.map((request) => {
    const consumed = actualQuantity(state, request);
    const unitPrice = requestUnitPrice(state, request);
    return {
      date: request.date,
      weekday: weekdayShort(request.date),
      leader: getUserName(state, request.leaderId),
      section: request.sectionName || request.location || "Sem equipe",
      meal: request.mealType || "Refeicao",
      requested: Number(request.quantity ?? 0),
      consumed,
      effective: requestHeadcount(state, request),
      unitPrice,
      value: consumed * unitPrice,
      status: request.status,
      notes: request.notes ?? ""
    };
  });

  const sectionSummary = summarizeBy(detailRows, "section");
  const mealSummary = summarizeBy(detailRows, "meal");
  const supplier = getSuppliers(state)[0];
  const totalValue = meals.reduce((sum, meal) => sum + meal.valueTotal, 0);
  const totalQuantity = meals.reduce((sum, meal) => sum + meal.quantityTotal, 0);
  return {
    supplierCode: supplier?.supplierCode || supplier?.id?.slice(0, 10)?.toUpperCase() || "-",
    supplierName: supplier?.name || state.settings?.supplierName || "Fornecedor",
    supplierDocument: supplier?.cnpj || supplier?.document || "-",
    area: options.area || state.settings?.measurementArea || "Administracao",
    scope: options.scope || "Servicos de Alimentacao",
    revision: options.revision || "001",
    periodLabel,
    periodStart,
    periodEnd,
    measuredDays: days.length,
    filenamePeriod: `${periodStart}_a_${periodEnd}`.replaceAll("-", ""),
    meals,
    dayRows,
    detailRows,
    sectionSummary,
    mealSummary,
    totalQuantity,
    totalValue,
    generatedAt: formatDateTime(new Date().toISOString())
  };
}

function buildOrdersModel(state, rows, options = {}) {
  const model = buildMeasurementModel(state, rows, options);
  const period = options.periodLabel ?? model.periodLabel;
  const tableRows = [
    ["Data", "Encarregado", "Equipe/Trecho", "Tipo", "Solic.", "Real.", "Efetivo", "Unitario", "Total", "Status"],
    ...model.detailRows.map((row) => [row.date, row.leader, row.section, row.meal, row.requested, row.consumed, row.effective || "", row.unitPrice, row.value, row.status])
  ];
  const blockRows = [
    ["Data", "Pedidos", "Solicitadas", "Realizadas", "Encarregados", "Equipes", "Valor"],
    ...Object.values(model.detailRows.reduce((acc, row) => {
      acc[row.date] ??= { date: row.date, count: 0, requested: 0, consumed: 0, leaders: new Set(), sections: new Set(), value: 0 };
      acc[row.date].count += 1;
      acc[row.date].requested += row.requested;
      acc[row.date].consumed += row.consumed;
      acc[row.date].leaders.add(row.leader);
      acc[row.date].sections.add(row.section);
      acc[row.date].value += row.value;
      return acc;
    }, {})).map((row) => [row.date, row.count, row.requested, row.consumed, row.leaders.size, row.sections.size, row.value])
  ];
  return { ...model, periodLabel: period, tableRows, blockRows };
}

function dailyReportRows(state, report) {
  return (report?.items ?? report?.rows ?? []).map((item) => {
    const request = item.request ?? item;
    const consumed = Number(item.consumed ?? item.actualQuantity ?? request.actualQuantity ?? request.quantity ?? 0);
    const unitPrice = Number(item.unitPrice ?? request.unitPrice ?? mealUnitPrice(state, request.mealTypeId));
    return {
      date: request.date ?? report.date,
      weekday: weekdayShort(request.date ?? report.date),
      leader: item.leader ?? getUserName(state, request.leaderId),
      section: item.section ?? request.sectionName ?? request.location ?? "",
      meal: item.meal ?? request.mealType ?? "",
      requested: Number(item.requested ?? request.quantity ?? 0),
      consumed,
      effective: Number(item.effective ?? requestHeadcount(state, request)) || "",
      unitPrice,
      value: consumed * unitPrice,
      status: item.status ?? request.status ?? ""
    };
  });
}

function summarizeBy(rows, key) {
  return Object.values(rows.reduce((acc, row) => {
    const label = row[key] || "-";
    acc[label] ??= { label, requested: 0, consumed: 0, effective: 0, value: 0 };
    acc[label].requested += row.requested;
    acc[label].consumed += row.consumed;
    acc[label].effective += Number(row.effective || 0);
    acc[label].value += row.value;
    return acc;
  }, {})).sort((a, b) => b.consumed - a.consumed || a.label.localeCompare(b.label, "pt-BR"));
}

function dateRange(start, end) {
  const output = [];
  const cursor = new Date(`${start}T12:00:00`);
  const limit = new Date(`${end}T12:00:00`);
  if (Number.isNaN(cursor.getTime()) || Number.isNaN(limit.getTime())) return output;
  while (cursor <= limit && output.length < 370) {
    output.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return output;
}

function longDate(value) {
  return value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" }).format(new Date(`${value}T12:00:00`)) : "-";
}

function weekdayLong(value) {
  return value ? new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(new Date(`${value}T12:00:00`)) : "-";
}

function weekdayShort(value) {
  return value ? new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(new Date(`${value}T12:00:00`)).replace(".", "") : "-";
}

function renderDocumentHeader({ title, subtitle, eyebrow = "" }) {
  return `<header class="brand-header">
    <div><div class="brand-mark"><img src="${CONSAG_LOGO_URL}" alt="CONSAG" /><div>${eyebrow ? `<span>${escapeHtml(eyebrow)}</span>` : ""}<h1>${escapeHtml(title)}</h1></div></div>${subtitle ? `<p class="document-subtitle">${escapeHtml(subtitle)}</p>` : ""}</div>
    <div class="system-mark"><img src="${SYSTEM_LOGO_URL}" alt="AlimentaObra" /></div>
  </header>`;
}

function renderPrintablePage({ title, subtitle, eyebrow = "", children, footer = "", orientation = "portrait", showHeader = true }) {
  const isLandscape = orientation === "landscape";
  const header = showHeader ? renderDocumentHeader({ title, subtitle, eyebrow }) : "";
  if (footer === null) footer = '<span style="display:none"></span>';
  return `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page { size: A4 ${isLandscape ? "landscape" : "portrait"}; margin: 0; }
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { margin: 0; background: #eef3f8; color: #202124; font: 12px Arial, sans-serif; }
      .print-toolbar { position: sticky; top: 0; z-index: 10; display: flex; justify-content: center; gap: 8px; padding: 10px; background: rgba(0,32,96,.94); box-shadow: 0 10px 30px rgba(0,0,0,.2); }
      .print-toolbar button { min-height: 38px; border: 0; border-radius: 4px; background: #0070c0; color: #fff; padding: 0 16px; font-weight: 800; cursor: pointer; }
      .print-toolbar span { display: inline-flex; align-items: center; color: #eaf2ff; font-size: 11px; font-weight: 700; }
      .document { width: min(${isLandscape ? "297mm" : "210mm"}, calc(100% - 24px)); min-height: ${isLandscape ? "210mm" : "297mm"}; margin: 12px auto; background: #fff; padding: ${showHeader ? "12mm" : "0"}; box-shadow: 0 18px 45px rgba(0,32,96,.16); }
      .brand-header { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 18px; align-items: center; padding-bottom: 12px; border-bottom: 5px solid #002060; }
      .brand-mark { display: flex; align-items: center; gap: 12px; }
      .brand-mark img { width: ${isLandscape ? "210px" : "182px"}; max-height: 58px; object-fit: contain; object-position: left center; }
      .brand-mark span { display: block; color: #002060; font-size: 10px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
      .system-mark { display: grid; justify-items: end; align-items: center; }
      .system-mark img { width: ${isLandscape ? "132px" : "116px"}; max-height: ${isLandscape ? "54px" : "46px"}; object-fit: contain; object-position: right center; }
      h1 { margin: 6px 0 0; font-size: 25px; line-height: 1.05; letter-spacing: 0; }
      .document-subtitle { max-width: 520px; margin: 7px 0 0; color: #5f6368; line-height: 1.45; }
      .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; margin: 18px 0; }
      .metric { min-height: 66px; border: 1px solid #d9e2f3; border-left: 5px solid #002060; border-radius: 4px; background: #fff; padding: 10px; }
      .metric span { display: block; color: #5f6368; font-size: 9px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
      .metric strong { display: block; margin-top: 7px; font-size: 19px; color: #002060; }
      .section-title { margin: 18px 0 8px; border-bottom: 2px solid #002060; padding-bottom: 5px; font-size: 13px; font-weight: 900; text-transform: uppercase; color: #002060; letter-spacing: .08em; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; overflow: hidden; border-radius: 8px; }
      th { background: #002060; color: #fff; padding: 8px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: .07em; }
      td { border: 1px solid #d9e2f3; padding: 8px; vertical-align: top; }
      tbody tr:nth-child(even) td { background: #f7f9fc; }
      tfoot th { background: #d9e2f3; color: #002060; border: 1px solid #b4c7e7; }
      .number { text-align: right; white-space: nowrap; }
      .small-note { margin-top: 6px; color: #5f6368; font-size: 10px; line-height: 1.45; }
      .two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 14px 0; }
      .info-box { border: 1px solid #d9e2f3; border-radius: 4px; background: #fff; padding: 10px; }
      .info-box span { display: block; color: #5f6368; font-size: 9px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
      .info-box strong { display: block; margin-top: 5px; font-size: 13px; }
      .timeline { display: grid; gap: 8px; }
      .timeline-item { display: grid; grid-template-columns: 10px 1fr; gap: 10px; border: 1px solid #d9e2f3; border-radius: 4px; background: #fff; padding: 9px; }
      .timeline-dot { width: 10px; height: 10px; margin-top: 3px; border-radius: 50%; background: #0070c0; }
      .footer { margin-top: 14px; padding-top: 8px; border-top: 1px solid #d9e2f3; color: #5f6368; font-size: 10px; line-height: 1.4; }
      .kpi-report { display: grid; gap: 8px; }
      .kpi-report .report-page { padding: 12mm; }
      .report-page { display: grid; align-content: start; gap: 8px; }
      .report-page + .report-page { break-before: page; }
      .page-label { border-left: 7px solid #002060; background: #d9e2f3; padding: 6px 10px; color: #002060; font-size: 15px; font-weight: 900; letter-spacing: .04em; text-transform: uppercase; }
      .page-subtitle { margin: -3px 0 0; color: #5f6368; font-size: 10px; line-height: 1.3; }
      .kpi-scoreboard { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
      .kpi-score { min-height: 62px; border: 1px solid #b4c7e7; border-top: 5px solid #002060; background: #fff; padding: 7px; }
      .kpi-score span { display: block; color: #5f6368; font-size: 9px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
      .kpi-score strong { display: block; margin-top: 6px; color: #002060; font-size: 18px; line-height: 1; }
      .kpi-score small { display: block; margin-top: 4px; color: #5f6368; font-size: 8px; font-weight: 800; }
      .kpi-two { display: grid; grid-template-columns: 1.08fr .92fr; gap: 8px; align-items: stretch; }
      .kpi-panel { break-inside: auto; border: 1px solid #b4c7e7; background: #fff; }
      .kpi-panel h2 { margin: 0; border-bottom: 1px solid #b4c7e7; background: #d9d9d9; padding: 6px 9px; color: #202124; font-size: 11px; font-weight: 900; text-align: center; text-transform: uppercase; letter-spacing: .06em; }
      .kpi-panel-body { padding: 7px; }
      .kpi-chart { display: block; width: 100%; height: auto; }
      .kpi-note-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
      .kpi-note { min-height: 50px; border: 1px solid #b4c7e7; background: #f7f9fc; padding: 10px; color: #3c4043; font-size: 10px; line-height: 1.3; }
      .kpi-note strong { display: block; margin-bottom: 5px; color: #002060; font-size: 11px; text-transform: uppercase; }
      .kpi-table { margin: 0; border: 1px solid #b4c7e7; border-collapse: collapse; border-radius: 0; font-size: 9px; }
      .kpi-table th { border: 1px solid #b4c7e7; background: #d9d9d9; color: #202124; padding: 6px 7px; text-align: center; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .04em; }
      .kpi-table td { border: 1px solid #b4c7e7; padding: 6px 7px; background: #fff; }
      .kpi-table tbody tr:nth-child(even) td { background: #f7f9fc; }
      @media print {
        html, body { background: #fff; }
        .print-toolbar { display: none; }
        .document { width: 100%; min-height: ${isLandscape ? "210mm" : "297mm"}; margin: 0; padding: ${showHeader ? "12mm" : "0"}; box-shadow: none; background: #fff; }
      }
    </style></head><body>
      <div class="print-toolbar"><button onclick="window.print()">Imprimir / salvar PDF</button><span>A página do sistema continua livre na aba anterior.</span></div>
      <main class="document">
        ${header}
        ${children}
        <footer class="footer">${footer || "Documento gerado pelo AlimentaObra para padronização operacional e rastreabilidade das refeições."}</footer>
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
    subtitle: `Resumo operacional de ${formatDate(consolidation.date)} com distribuição por refeição, local e encarregado.`,
    children: `<section class="metrics"><div class="metric"><span>Data</span><strong>${formatDate(consolidation.date)}</strong></div><div class="metric"><span>Total geral</span><strong>${summary.total}</strong></div><div class="metric"><span>Tipos de refeição</span><strong>${mealTypeCount}</strong></div></section>${sections}`
  });
}

function renderSupplierRomaneioHtml(state, consolidation, summary) {
  const supplier = state.users.find((user) => user.id === consolidation.supplierId);
  const supplierDocument = supplier?.cnpj || supplier?.document || "-";
  const statusLabel = consolidation.status === "confirmado"
    ? "Confirmado (mas nao entregue)"
    : STATUS_LABEL[consolidation.status] ?? consolidation.status ?? "-";
  let documentTotal = 0;
  const rows = Object.entries(summary.byMeal).flatMap(([meal, data]) => Object.entries(data.byLocation).map(([location, total]) => {
    const matchingRows = data.rows.filter((row) => row.location === location);
    const unitPrice = requestUnitPrice(state, matchingRows[0] ?? {});
    const description = mealDescription(state, matchingRows[0]?.mealTypeId) || matchingRows[0]?.mealDescription || location;
    const lineTotal = Number(total) * unitPrice;
    documentTotal += lineTotal;
    return `<tr><td><strong>${escapeHtml(meal)}</strong></td><td>${escapeHtml(description)}<div class="small-note">Frente: ${escapeHtml(location)}</div></td><td>UN</td><td class="number">${total}</td><td class="number">${money(unitPrice)}</td><td class="number">${money(lineTotal)}</td></tr>`;
  })).join("");

  return renderPrintablePage({
    title: "Nota fiscal de fornecimento",
    subtitle: `Espelho operacional do pedido ${consolidation.id.slice(0, 8).toUpperCase()} para ${formatDate(consolidation.date)}.`,
    children: `
      <section class="two-columns">
        <div class="info-box"><span>Emitente</span><strong>${escapeHtml(supplier?.name ?? "Fornecedor")}</strong><p class="small-note">CNPJ/CPF: ${escapeHtml(supplierDocument)}<br>Responsavel pelo preparo e entrega das refeicoes.</p></div>
        <div class="info-box"><span>Destinatario</span><strong>CONSAG / AlimentaObra</strong><p class="small-note">Operacao registrada para atendimento das frentes de trabalho.</p></div>
      </section>
      <section class="metrics"><div class="metric"><span>Status</span><strong>${escapeHtml(statusLabel)}</strong></div><div class="metric"><span>Quantidade total</span><strong>${summary.total}</strong></div><div class="metric"><span>Valor total</span><strong>${money(documentTotal)}</strong></div></section>
      <h2 class="section-title">Dados dos produtos / servicos</h2>
      <table><colgroup><col class="meal" /><col /><col class="unit" /><col class="qty" /><col class="money" /><col class="money" /></colgroup><thead><tr><th>Refeicao</th><th>Descricao</th><th>Un.</th><th class="number">Qtd.</th><th class="number">V. unit.</th><th class="number">V. total</th></tr></thead><tbody>${rows}</tbody></table>
      <section class="two-columns">
        <div class="info-box"><span>Informacoes complementares</span><p class="small-note">Documento gerado pelo AlimentaObra para conferencia operacional do fornecedor e do recebimento em campo. A apuracao fiscal, impostos e autorizacao SEFAZ devem constar na NF-e/DANFE oficial anexada pelo fornecedor.</p></div>
        <div class="info-box"><span>Recebimento</span><p class="small-note">Declaro que recebi os itens descritos nesta nota de fornecimento.</p><br><br>________________________________</div>
      </section>`
    ,
    footer: "Este documento acompanha a operacao e nao substitui NF-e, DANFE ou documento fiscal."
  });
}
function renderMeasurementPdfHtml(model) {
  const mealHeaders = model.meals.map((meal) => `<th colspan="4">${escapeHtml(meal.label)}</th>`).join("");
  const subHeaders = model.meals.map(() => `<th>Dia</th><th class="number">Real.</th><th class="number">V. unit.</th><th class="number">Total</th>`).join("");
  const rows = model.dayRows.map((day) => `<tr><td>${escapeHtml(day.longDate)}</td>${day.meals.map((meal) => `<td>${escapeHtml(day.weekday)}</td><td class="number">${meal.consumed || "00"}</td><td class="number">${money(meal.unitPrice)}</td><td class="number">${meal.value ? money(meal.value) : "-"}</td>`).join("")}</tr>`).join("");
  const totals = `<tr><th>TOTAL</th>${model.meals.map((meal) => `<th></th><th class="number">${meal.quantityTotal}</th><th></th><th class="number">${money(meal.valueTotal)}</th>`).join("")}</tr>`;
  const detail = model.detailRows.map((row) => `<tr><td>${formatDate(row.date)}</td><td>${escapeHtml(row.leader)}</td><td>${escapeHtml(row.section)}</td><td>${escapeHtml(row.meal)}</td><td class="number">${row.requested}</td><td class="number">${row.consumed}</td><td class="number">${row.effective || "-"}</td><td class="number">${money(row.unitPrice)}</td><td class="number">${money(row.value)}</td><td>${escapeHtml(row.status)}</td></tr>`).join("");

  return renderPrintablePage({
    title: "Memoria de Calculo - Servico Alimentacao",
    subtitle: `Empresa: ${model.supplierName} | Periodo: ${model.periodLabel} | Medicao: ${model.periodLabel}`,
    eyebrow: `Cod. Forn.: ${model.supplierCode}`,
    children: `<section class="metrics"><div class="metric"><span>CNPJ</span><strong>${escapeHtml(model.supplierDocument)}</strong></div><div class="metric"><span>Qtd. dias</span><strong>${model.measuredDays}</strong></div><div class="metric"><span>Total</span><strong>${money(model.totalValue)}</strong></div></section><section class="two-columns"><div class="info-box"><span>Escopo</span><strong>${escapeHtml(model.scope)}</strong></div><div class="info-box"><span>Area/Setor</span><strong>${escapeHtml(model.area)}</strong></div></section><table><thead><tr><th>DATA</th>${mealHeaders}</tr><tr><th>DATA</th>${subHeaders}</tr></thead><tbody>${rows}${totals}</tbody></table><div class="two-columns"><div class="info-box"><br><br>________________________________<p class="small-note">Solicitante/Acompanhante</p></div><div class="info-box"><br><br>________________________________<p class="small-note">Fornecedor</p></div></div><h2 class="section-title">Detalhamento completo da medicao</h2><table><thead><tr><th>Data</th><th>Encarregado</th><th>Equipe/Trecho</th><th>Tipo</th><th class="number">Solic.</th><th class="number">Real.</th><th class="number">Efetivo</th><th class="number">Valor unit.</th><th class="number">Total</th><th>Status</th></tr></thead><tbody>${detail || "<tr><td colspan=\"10\">Sem movimentacao no periodo.</td></tr>"}</tbody></table>`,
    footer: "Relatorio operacional gerado pelo AlimentaObra."
  });
}

function renderOrdersPdfHtml(state, rows, options = {}) {
  const model = buildOrdersModel(state, rows, options);
  const blocks = Object.values(model.detailRows.reduce((acc, row) => {
    acc[row.date] ??= { date: row.date, rows: [], requested: 0, consumed: 0, value: 0, leaders: new Set(), sections: new Set() };
    acc[row.date].rows.push(row);
    acc[row.date].requested += row.requested;
    acc[row.date].consumed += row.consumed;
    acc[row.date].value += row.value;
    acc[row.date].leaders.add(row.leader);
    acc[row.date].sections.add(row.section);
    return acc;
  }, {})).sort((a, b) => a.date.localeCompare(b.date));
  const blockHtml = blocks.map((block, index) => {
    const table = block.rows.map((row) => `<tr><td>${formatDate(row.date)}</td><td>${escapeHtml(row.leader)}</td><td>${escapeHtml(row.section)}</td><td>${escapeHtml(row.meal)}</td><td class="number">${row.requested}</td><td class="number">${row.consumed}</td><td class="number">${row.effective || "-"}</td><td class="number">${money(row.unitPrice)}</td><td class="number">${money(row.value)}</td><td>${escapeHtml(row.status)}</td></tr>`).join("");
    return `<section class="order-day-block ${index ? "order-day-break" : ""}">
      <header class="order-day-header">
        <div><span>Bloco diario</span><strong>${formatDate(block.date)}</strong></div>
        <div class="order-day-pills"><b>${block.rows.length} pedidos</b><b>${block.requested} solicitadas</b><b>${block.consumed} realizadas</b><b>${block.leaders.size} encarregados</b><b>${block.sections.size} equipes</b></div>
      </header>
      <table class="orders-table"><thead><tr><th>Data</th><th>Encarregado</th><th>Equipe/Trecho</th><th>Tipo</th><th class="number">Solic.</th><th class="number">Real.</th><th class="number">Efetivo</th><th class="number">Unitario</th><th class="number">Total</th><th>Status</th></tr></thead><tbody>${table}</tbody><tfoot><tr><th colspan="4">Total do bloco</th><th class="number">${block.requested}</th><th class="number">${block.consumed}</th><th colspan="2"></th><th class="number">${money(block.value)}</th><th></th></tr></tfoot></table>
    </section>`;
  }).join("");
  return renderPrintablePage({
    title: "Relatorio de pedidos",
    subtitle: `Pedidos recebidos no periodo ${model.periodLabel}, com a mesma leitura operacional da planilha em PDF.`,
    orientation: "landscape",
    children: `<style>
      .order-day-block { break-inside: auto; page-break-inside: auto; margin: 22px 0 0; overflow: hidden; border: 1px solid #b4c7e7; border-radius: 6px; background: #fff; box-shadow: 0 8px 18px rgba(0,32,96,.06); }
      .order-day-break { margin-top: 26px; }
      .order-day-header { break-after: avoid; page-break-after: avoid; display: grid; grid-template-columns: auto minmax(0,1fr); gap: 12px; align-items: center; background: #002060; color: #fff; padding: 10px 12px; }
      .order-day-header span { display: block; color: #b4c7e7; font-size: 9px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
      .order-day-header strong { display: block; margin-top: 3px; font-size: 18px; line-height: 1; }
      .order-day-pills { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
      .order-day-pills b { border: 1px solid rgba(255,255,255,.28); border-radius: 999px; background: rgba(255,255,255,.1); padding: 5px 8px; font-size: 9px; text-transform: uppercase; white-space: nowrap; }
      .orders-table { margin: 0; border-radius: 0; table-layout: fixed; }
      .orders-table th, .orders-table td { padding: 7px 8px; }
      .orders-table th { background: #d9e2f3; color: #002060; border-color: #b4c7e7; }
      .orders-table thead { display: table-header-group; }
      .orders-table tfoot { display: table-row-group; }
      .orders-table tfoot th { background: #002060; color: #fff; }
      @media print { .order-day-block { box-shadow: none; } .order-day-header { break-after: avoid; page-break-after: avoid; } .orders-table { break-before: avoid; page-break-before: avoid; } }
    </style><section class="metrics"><div class="metric"><span>Periodo</span><strong>${escapeHtml(model.periodLabel)}</strong></div><div class="metric"><span>Pedidos</span><strong>${model.detailRows.length}</strong></div><div class="metric"><span>Blocos</span><strong>${blocks.length}</strong></div></section><section class="metrics"><div class="metric"><span>Solicitado</span><strong>${model.detailRows.reduce((sum, row) => sum + row.requested, 0)}</strong></div><div class="metric"><span>Realizado</span><strong>${model.totalQuantity}</strong></div><div class="metric"><span>Valor total</span><strong>${money(model.totalValue)}</strong></div></section>${blockHtml || "<p class=\"small-note\">Sem pedidos no periodo.</p>"}`
  });
}

function compactLabel(value, max = 20) {
  const text = String(value ?? "");
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

function percent(value, total) {
  return total ? Math.round((Number(value ?? 0) / total) * 100) : 0;
}

function renderGroupedBarSvg(items, keys = [
  ["requested", "Solicitado", "#002060"],
  ["consumed", "Consumido", "#0070c0"],
  ["effective", "Efetivo", "#a6a6a6"]
]) {
  const width = 760;
  const height = 235;
  const left = 52;
  const right = 18;
  const top = 28;
  const bottom = 44;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const safeItems = items.length ? items : [{ label: "Sem dados", requested: 0, consumed: 0, effective: 0 }];
  const maxValue = Math.max(...safeItems.flatMap((item) => keys.map(([key]) => Number(item[key] ?? 0))), 1);
  const y = (value) => top + plotHeight - (Number(value ?? 0) / maxValue) * plotHeight;
  const groupWidth = plotWidth / safeItems.length;
  const barWidth = Math.min(18, Math.max(8, groupWidth / (keys.length + 2)));
  const grid = [0, .25, .5, .75, 1].map((step) => {
    const yy = top + plotHeight - (step * plotHeight);
    const label = Math.round(maxValue * step);
    return `<line x1="${left}" y1="${yy}" x2="${width - right}" y2="${yy}" stroke="#d9d9d9" stroke-width="1"/><text x="${left - 8}" y="${yy + 4}" text-anchor="end" font-size="10" fill="#6b7280">${label}</text>`;
  }).join("");
  const bars = safeItems.map((item, index) => {
    const center = left + groupWidth * index + groupWidth / 2;
    const start = center - (keys.length * barWidth + (keys.length - 1) * 8) / 2;
    const barSet = keys.map(([key, , color], keyIndex) => {
      const value = Number(item[key] ?? 0);
      const barHeight = Math.max(0, top + plotHeight - y(value));
      const x = start + keyIndex * (barWidth + 8);
      return `<rect x="${x}" y="${y(value)}" width="${barWidth}" height="${barHeight}" fill="${color}"/><text x="${x + barWidth / 2}" y="${Math.max(12, y(value) - 5)}" text-anchor="middle" font-size="10" font-weight="700" fill="#4b5563">${value || ""}</text>`;
    }).join("");
    return `${barSet}<text x="${center}" y="${height - 23}" text-anchor="middle" font-size="10" font-weight="700" fill="#4b5563">${escapeHtml(compactLabel(item.label, 16))}</text>`;
  }).join("");
  const legend = keys.map(([, label, color], index) => {
    const x = width / 2 - 145 + index * 100;
    return `<rect x="${x}" y="8" width="9" height="9" fill="${color}"/><text x="${x + 13}" y="16" font-size="11" fill="#4b5563">${escapeHtml(label)}</text>`;
  }).join("");

  return `<svg class="kpi-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafico comparativo de refeicoes">
    <rect x="0" y="0" width="${width}" height="${height}" fill="#fff"/>
    ${legend}${grid}
    <line x1="${left}" y1="${top + plotHeight}" x2="${width - right}" y2="${top + plotHeight}" stroke="#bfbfbf" stroke-width="1.2"/>
    <text x="14" y="${top + plotHeight / 2}" transform="rotate(-90 14 ${top + plotHeight / 2})" text-anchor="middle" font-size="11" fill="#4b5563">Quantidade</text>
    ${bars}
  </svg>`;
}

function renderOccupancySvg(days) {
  const width = 760;
  const height = 250;
  const left = 44;
  const right = 20;
  const top = 26;
  const bottom = 44;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const safeDays = days.length ? days : [["-", { requested: 0, consumed: 0, effective: 0 }]];
  const groupWidth = plotWidth / safeDays.length;
  const barWidth = Math.min(34, Math.max(18, groupWidth * .42));
  const grid = [0, .25, .5, .75, 1].map((step) => {
    const yy = top + plotHeight - (step * plotHeight);
    return `<line x1="${left}" y1="${yy}" x2="${width - right}" y2="${yy}" stroke="#d9d9d9" stroke-width="1"/><text x="${left - 8}" y="${yy + 4}" text-anchor="end" font-size="10" fill="#6b7280">${Math.round(step * 100)}%</text>`;
  }).join("");
  const bars = safeDays.map(([date, item], index) => {
    const denominator = Number(item.effective || item.requested || 0);
    const raw = denominator ? (Number(item.consumed ?? 0) / denominator) * 100 : 0;
    const capped = Math.max(0, Math.min(100, raw));
    const h = (capped / 100) * plotHeight;
    const x = left + groupWidth * index + (groupWidth - barWidth) / 2;
    const y = top + plotHeight - h;
    const label = String(date).includes("-") ? String(date).slice(5).replace("-", "/") : date;
    return `<rect x="${x}" y="${top}" width="${barWidth}" height="${plotHeight}" fill="#d9d9d9"/><rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="#002060"/><text x="${x + barWidth / 2}" y="${Math.max(14, y - 6)}" text-anchor="middle" font-size="10" font-weight="800" fill="#4b5563">${Math.round(raw)}%</text><text x="${x + barWidth / 2}" y="${height - 23}" text-anchor="middle" font-size="10" font-weight="700" fill="#4b5563">${escapeHtml(label)}</text>`;
  }).join("");
  return `<svg class="kpi-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Taxa de ocupacao diaria">
    <rect x="0" y="0" width="${width}" height="${height}" fill="#fff"/>
    ${grid}
    <line x1="${left}" y1="${top + plotHeight}" x2="${width - right}" y2="${top + plotHeight}" stroke="#bfbfbf" stroke-width="1.2"/>
    ${bars}
    <rect x="${width / 2 - 90}" y="${height - 10}" width="10" height="8" fill="#002060"/><text x="${width / 2 - 76}" y="${height - 3}" font-size="10" fill="#4b5563">Ocupacao</text>
    <rect x="${width / 2 + 5}" y="${height - 10}" width="10" height="8" fill="#d9d9d9"/><text x="${width / 2 + 19}" y="${height - 3}" font-size="10" fill="#4b5563">Disponibilidade</text>
  </svg>`;
}

function renderDonutSvg(items, centerLabel) {
  const width = 360;
  const height = 190;
  const cx = 82;
  const cy = 92;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const total = items.reduce((sum, item) => sum + Number(item.value ?? 0), 0);
  let offset = 0;
  const circles = total ? items.map((item, index) => {
    const value = Number(item.value ?? 0);
    const length = (value / total) * circumference;
    const circle = `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${KPI_CHART_COLORS[index % KPI_CHART_COLORS.length]}" stroke-width="32" stroke-dasharray="${length} ${circumference - length}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
    offset += length;
    return circle;
  }).join("") : `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#d9d9d9" stroke-width="32"/>`;
  const legend = (items.length ? items : [{ label: "Sem dados", value: 0 }]).slice(0, 7).map((item, index) => {
    const y = 42 + index * 19;
    return `<rect x="178" y="${y - 8}" width="9" height="9" fill="${KPI_CHART_COLORS[index % KPI_CHART_COLORS.length]}"/><text x="193" y="${y}" font-size="11" fill="#4b5563">${escapeHtml(compactLabel(item.label, 19))}</text><text x="340" y="${y}" text-anchor="end" font-size="11" font-weight="800" fill="#202124">${item.value}</text>`;
  }).join("");
  const centerText = String(centerLabel ?? "");
  const centerSize = centerText.length > 12 ? 10 : centerText.length > 8 ? 12 : 17;
  return `<svg class="kpi-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafico de distribuicao">
    <rect x="0" y="0" width="${width}" height="${height}" fill="#fff"/>
    ${circles}
    <circle cx="${cx}" cy="${cy}" r="31" fill="#fff" stroke="#d9e2f3"/>
    <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="${centerSize}" font-weight="900" fill="#002060">${escapeHtml(centerText)}</text>
    ${legend}
  </svg>`;
}

function renderHorizontalRankingSvg(items) {
  const width = 760;
  const rowHeight = 38;
  const top = 18;
  const height = Math.max(180, top + Math.max(items.length, 4) * rowHeight + 18);
  const labelWidth = 255;
  const barWidth = 385;
  const maxValue = Math.max(...items.map((item) => Number(item.consumed ?? item.value ?? 0)), 1);
  const rows = (items.length ? items : [{ label: "Sem dados", consumed: 0 }]).map((item, index) => {
    const value = Number(item.consumed ?? item.value ?? 0);
    const y = top + index * rowHeight;
    const w = Math.max(2, (value / maxValue) * barWidth);
    return `<text x="18" y="${y + 22}" font-size="13" font-weight="800" fill="#4b5563">${escapeHtml(compactLabel(item.label, 24))}</text><rect x="${labelWidth}" y="${y + 9}" width="${barWidth}" height="16" fill="#d9e2f3"/><rect x="${labelWidth}" y="${y + 9}" width="${w}" height="16" fill="${KPI_CHART_COLORS[index % KPI_CHART_COLORS.length]}"/><text x="${width - 18}" y="${y + 22}" text-anchor="end" font-size="13" font-weight="900" fill="#202124">${value} ref.</text>`;
  }).join("");
  return `<svg class="kpi-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Ranking operacional">${rows}</svg>`;
}

function renderValueBarSvg(items, key = "value", formatValue = String, maxLabel = 28) {
  const width = 760;
  const rowHeight = 30;
  const top = 16;
  const height = Math.max(160, top + Math.max(items.length, 4) * rowHeight + 16);
  const labelWidth = 180;
  const barWidth = 380;
  const maxValue = Math.max(...items.map((item) => Number(item[key] ?? 0)), 1);
  const rows = (items.length ? items : [{ label: "Sem dados", [key]: 0 }]).map((item, index) => {
    const value = Number(item[key] ?? 0);
    const y = top + index * rowHeight;
    const w = Math.max(2, (value / maxValue) * barWidth);
    return `<text x="12" y="${y + 18}" font-size="10" font-weight="800" fill="#4b5563">${escapeHtml(compactLabel(item.label, maxLabel))}</text><rect x="${labelWidth}" y="${y + 9}" width="${barWidth}" height="10" fill="#d9e2f3"/><rect x="${labelWidth}" y="${y + 9}" width="${w}" height="10" fill="${KPI_CHART_COLORS[index % KPI_CHART_COLORS.length]}"/><text x="${width - 18}" y="${y + 18}" text-anchor="end" font-size="10" font-weight="900" fill="#202124">${escapeHtml(formatValue(value))}</text>`;
  }).join("");
  return `<svg class="kpi-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafico de valores">${rows}</svg>`;
}

function renderKpiPdfHtml(state, rows, title) {
  const model = buildMeasurementModel(state, rows, { periodLabel: "periodo filtrado" });
  const requested = model.detailRows.reduce((sum, row) => sum + row.requested, 0);
  const consumed = model.totalQuantity;
  const effective = model.detailRows.reduce((sum, row) => sum + Number(row.effective || 0), 0);
  const mealRows = model.mealSummary.map((row) => `<tr><td>${escapeHtml(row.label)}</td><td class="number">${row.requested}</td><td class="number">${row.consumed}</td><td class="number">${row.effective || "-"}</td><td class="number">${money(row.value)}</td></tr>`).join("");
  const sectionRows = model.sectionSummary.map((row) => `<tr><td>${escapeHtml(row.label)}</td><td class="number">${row.requested}</td><td class="number">${row.consumed}</td><td class="number">${row.effective || "-"}</td><td class="number">${row.consumed - row.requested}</td><td class="number">${money(row.value)}</td></tr>`).join("");
  const byDay = Object.entries(model.detailRows.reduce((acc, row) => {
    acc[row.date] ??= { requested: 0, consumed: 0, effective: 0 };
    acc[row.date].requested += row.requested;
    acc[row.date].consumed += row.consumed;
    acc[row.date].effective += Number(row.effective || 0);
    return acc;
  }, {})).sort(([a], [b]) => a.localeCompare(b));
  const byStatus = Object.entries(model.detailRows.reduce((acc, row) => {
    const label = STATUS_LABEL[row.status] ?? row.status ?? "Sem status";
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {})).map(([label, value]) => ({ label, value }));
  const mealChartRows = model.mealSummary.slice(0, 8);
  const sectionChartRows = model.sectionSummary.slice(0, 8);
  const mealItems = model.mealSummary.map((row) => ({ label: row.label, value: row.consumed })).filter((item) => item.value > 0);
  const occupancy = effective ? `${percent(consumed, effective)}%` : "-";
  const adherence = requested ? `${percent(consumed, requested)}%` : "-";
  const averageCost = consumed ? money(model.totalValue / consumed) : money(0);
  const subtitle = "Relatorio executivo de refeicoes para reunioes: visao geral, ocupacao, distribuicao e detalhamento por area.";
  const pageHeader = renderDocumentHeader({ title, subtitle });

  return renderPrintablePage({
    title,
    subtitle,
    footer: null,
    orientation: "landscape",
    showHeader: false,
    children: `<section class="kpi-report">
      <section class="report-page">${pageHeader}<div class="page-label">Resumo executivo</div><p class="page-subtitle">Leitura consolidada do periodo filtrado no sistema, seguindo a identidade azul CONSAG.</p><div class="kpi-scoreboard"><div class="kpi-score"><span>Solicitado</span><strong>${requested}</strong><small>refeicoes planejadas</small></div><div class="kpi-score"><span>Consumido real</span><strong>${consumed}</strong><small>${adherence} do solicitado</small></div><div class="kpi-score"><span>Efetivo</span><strong>${effective || "-"}</strong><small>base informada por area</small></div><div class="kpi-score"><span>Custo total</span><strong>${money(model.totalValue)}</strong><small>${averageCost} por refeicao</small></div></div><article class="kpi-panel"><h2>Comparativo de refeicoes</h2><div class="kpi-panel-body">${renderGroupedBarSvg(mealChartRows)}</div></article><div class="kpi-note-grid"><div class="kpi-note"><strong>Diferenca</strong>${consumed - requested} refeicoes entre consumo real e solicitado.</div><div class="kpi-note"><strong>Ocupacao</strong>${occupancy} sobre o efetivo informado no periodo.</div><div class="kpi-note"><strong>Registros</strong>${model.detailRows.length} pedidos considerados no filtro atual.</div></div></section>
      <section class="report-page">${pageHeader}<div class="page-label">Ocupacao diaria</div><p class="page-subtitle">Analise diaria do periodo selecionado.</p><article class="kpi-panel"><h2>Taxa de ocupacao diaria</h2><div class="kpi-panel-body">${renderOccupancySvg(byDay)}</div></article></section>
      <section class="report-page">${pageHeader}<div class="page-label">Distribuicao e status</div><p class="page-subtitle">Composicao por tipo de refeicao e status dos pedidos no periodo selecionado.</p><div class="kpi-two"><article class="kpi-panel"><h2>Distribuicao por refeicao</h2><div class="kpi-panel-body">${renderDonutSvg(mealItems, String(consumed || requested))}</div></article><article class="kpi-panel"><h2>Status dos pedidos</h2><div class="kpi-panel-body">${renderDonutSvg(byStatus, String(model.detailRows.length))}</div></article></div></section>
      <section class="report-page">${pageHeader}<div class="page-label">Areas e trechos</div><p class="page-subtitle">Ranking operacional para identificar concentracao de consumo, diferencas e custo por frente.</p><article class="kpi-panel"><h2>Top equipes / trechos por consumo</h2><div class="kpi-panel-body">${renderHorizontalRankingSvg(sectionChartRows)}</div></article><article class="kpi-panel"><h2>Detalhamento por equipe / trecho</h2><div class="kpi-panel-body"><table class="kpi-table"><thead><tr><th>Equipe / trecho</th><th class="number">Solic.</th><th class="number">Cons.</th><th class="number">Efetivo</th><th class="number">Dif.</th><th class="number">Custo</th></tr></thead><tbody>${sectionRows || "<tr><td colspan=\"6\">Sem dados no periodo.</td></tr>"}</tbody></table></div></article></section>
      <section class="report-page">${pageHeader}<div class="page-label">Detalhamento por refeicao</div><p class="page-subtitle">Composicao completa por tipo de refeicao para conferencia em reuniao e rastreabilidade do periodo.</p><article class="kpi-panel"><h2>Composicao por tipo de refeicao</h2><div class="kpi-panel-body"><table class="kpi-table"><thead><tr><th>Tipo</th><th class="number">Solic.</th><th class="number">Cons.</th><th class="number">Efetivo</th><th class="number">Custo</th></tr></thead><tbody>${mealRows || "<tr><td colspan=\"5\">Sem dados no periodo.</td></tr>"}</tbody></table></div></article><div class="kpi-note-grid"><div class="kpi-note"><strong>Fonte</strong>Pedidos, consumo real, efetivo por equipe/trecho e precos cadastrados no AlimentaObra.</div><div class="kpi-note"><strong>Leitura</strong>O consumo real prevalece quando o fornecedor/admin informou medicao final.</div><div class="kpi-note"><strong>Marca</strong>Cores e hierarquia visual seguem a base azul da CONSAG.</div></div></section>
    </section>`
  });
}

function renderDailyReportPdfHtml(report) {
  const rows = (report?.items ?? report?.rows ?? []).map((item) => {
    const request = item.request ?? item;
    return `<tr><td>${escapeHtml(request.sectionName ?? request.location ?? "")}</td><td>${escapeHtml(request.mealType ?? item.meal ?? "")}</td><td class="number">${Number(item.requested ?? request.quantity ?? 0)}</td><td class="number">${Number(item.consumed ?? request.actualQuantity ?? request.quantity ?? 0)}</td><td class="number">${Number(item.effective ?? request.headcount ?? 0) || "-"}</td><td>${escapeHtml(item.status ?? request.status ?? "")}</td></tr>`;
  }).join("");
  const itemCount = (report?.items ?? report?.rows ?? []).length;
  const totals = report?.totals ?? {};
  return renderPrintablePage({
    title: "Relatorio diario",
    subtitle: `Relatorio automatico referente a ${formatDate(report.date)}.`,
    children: `<section class="metrics"><div class="metric"><span>Data</span><strong>${formatDate(report.date)}</strong></div><div class="metric"><span>Solicitado</span><strong>${Number(totals.requested ?? 0)}</strong></div><div class="metric"><span>Consumido</span><strong>${Number(totals.consumed ?? 0)}</strong></div></section><section class="metrics"><div class="metric"><span>Efetivo</span><strong>${Number(totals.headcount ?? 0) || "-"}</strong></div><div class="metric"><span>Custo</span><strong>${money(totals.cost ?? 0)}</strong></div><div class="metric"><span>Registros</span><strong>${itemCount}</strong></div></section><h2 class="section-title">Detalhamento operacional</h2><table><thead><tr><th>Equipe/Trecho</th><th>Tipo</th><th class="number">Solic.</th><th class="number">Cons.</th><th class="number">Efetivo</th><th>Status</th></tr></thead><tbody>${rows || "<tr><td colspan=\"6\">Sem movimentacao no dia.</td></tr>"}</tbody></table>`
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
    subtitle: "Relatório financeiro de refeições com totais previstos, entregues e em aberto.",
    children: `<section class="metrics"><div class="metric"><span>Total previsto</span><strong>${money(total)}</strong></div><div class="metric"><span>Entregue</span><strong>${money(delivered)}</strong></div><div class="metric"><span>Em aberto</span><strong>${money(total - delivered)}</strong></div></section><h2 class="section-title">Movimentações</h2><table><thead><tr><th>Data</th><th>Tipo</th><th class="number">Qtd.</th><th class="number">Unitário</th><th class="number">Total</th><th>Status</th></tr></thead><tbody>${table}</tbody></table>`
  });
}

function renderExecutiveFinancialPdfHtml(state, rows, title) {
  const sortedRows = [...rows].filter((request) => request.status !== "cancelado").sort((a, b) => b.date.localeCompare(a.date));
  const total = sortedRows.reduce((sum, request) => sum + actualQuantity(state, request) * requestUnitPrice(state, request), 0);
  const delivered = sortedRows.filter((request) => request.status === "entregue").reduce((sum, request) => sum + actualQuantity(state, request) * requestUnitPrice(state, request), 0);
  const open = total - delivered;
  const requested = sortedRows.reduce((sum, request) => sum + Number(request.quantity ?? 0), 0);
  const consumed = sortedRows.reduce((sum, request) => sum + actualQuantity(state, request), 0);
  const averageTicket = consumed ? total / consumed : 0;
  const byMeal = Object.entries(sortedRows.reduce((acc, request) => {
    const key = request.mealType || "Refeicao";
    acc[key] ??= { label: key, value: 0 };
    acc[key].value += actualQuantity(state, request) * requestUnitPrice(state, request);
    return acc;
  }, {})).map(([, item]) => item).sort((a, b) => b.value - a.value);
  const byDay = Object.entries(sortedRows.reduce((acc, request) => {
    const key = request.date;
    acc[key] ??= { label: formatDate(key), value: 0 };
    acc[key].value += actualQuantity(state, request) * requestUnitPrice(state, request);
    return acc;
  }, {})).map(([, item]) => item).sort((a, b) => a.label.localeCompare(b.label));
  const bySection = Object.entries(sortedRows.reduce((acc, request) => {
    const key = request.sectionName || request.location || "Sem equipe";
    acc[key] ??= { label: key, value: 0 };
    acc[key].value += actualQuantity(state, request) * requestUnitPrice(state, request);
    return acc;
  }, {})).map(([, item]) => item).sort((a, b) => b.value - a.value);
  const statusItems = [
    { label: "Concluido", value: Math.max(0, delivered) },
    { label: "Em aberto", value: Math.max(0, open) }
  ].filter((item) => item.value > 0);
  const table = sortedRows.slice(0, 24).map((request) => `<tr><td>${formatDate(request.date)}</td><td>${escapeHtml(request.mealType)}</td><td>${escapeHtml(request.sectionName || request.location)}</td><td class="number">${Number(request.quantity ?? 0)}</td><td class="number">${actualQuantity(state, request)}</td><td class="number">${money(requestUnitPrice(state, request))}</td><td class="number">${money(actualQuantity(state, request) * requestUnitPrice(state, request))}</td><td>${escapeHtml(request.status)}</td></tr>`).join("");
  const subtitle = "Relatorio financeiro executivo com custo total, valores concluidos, saldo em aberto e composicao por tipo, dia e frente.";
  const pageHeader = renderDocumentHeader({ title, subtitle });

  return renderPrintablePage({
    title,
    subtitle,
    footer: null,
    orientation: "landscape",
    showHeader: false,
    children: `<section class="kpi-report">
      <section class="report-page">${pageHeader}<div class="page-label">Resumo financeiro</div><p class="page-subtitle">Leitura consolidada dos custos de refeicoes no periodo selecionado.</p><div class="kpi-scoreboard"><div class="kpi-score"><span>Total previsto</span><strong>${money(total)}</strong><small>${consumed} refeicoes consumidas</small></div><div class="kpi-score"><span>Concluido</span><strong>${money(delivered)}</strong><small>${percent(delivered, total)}% do valor total</small></div><div class="kpi-score"><span>Em aberto</span><strong>${money(open)}</strong><small>${percent(open, total)}% do valor total</small></div><div class="kpi-score"><span>Ticket medio</span><strong>${money(averageTicket)}</strong><small>por refeicao consumida</small></div></div><div class="kpi-two"><article class="kpi-panel"><h2>Composicao por refeicao</h2><div class="kpi-panel-body">${renderValueBarSvg(byMeal.slice(0, 7), "value", money)}</div></article><article class="kpi-panel"><h2>Status financeiro</h2><div class="kpi-panel-body">${renderDonutSvg(statusItems.map((item) => ({ label: item.label, value: Math.round(item.value) })), "Total")}</div></article></div><div class="kpi-note-grid"><div class="kpi-note"><strong>Solicitado</strong>${requested} refeicoes solicitadas no periodo.</div><div class="kpi-note"><strong>Consumido</strong>${consumed} refeicoes usadas no calculo financeiro.</div><div class="kpi-note"><strong>Fonte</strong>Pedidos, consumo real e preco unitario cadastrados no sistema.</div></div></section>
      <section class="report-page">${pageHeader}<div class="page-label">Evolucao e frentes</div><p class="page-subtitle">Acompanhamento dos valores por data e ranking das frentes com maior impacto financeiro.</p><div class="kpi-two"><article class="kpi-panel"><h2>Evolucao por dia</h2><div class="kpi-panel-body">${renderValueBarSvg(byDay, "value", money, 18)}</div></article><article class="kpi-panel"><h2>Top equipes / trechos por custo</h2><div class="kpi-panel-body">${renderValueBarSvg(bySection.slice(0, 8), "value", money)}</div></article></div></section>
      <section class="report-page">${pageHeader}<div class="page-label">Movimentacoes</div><p class="page-subtitle">Detalhamento financeiro das movimentacoes consideradas no periodo.</p><article class="kpi-panel"><h2>Movimentacoes do periodo</h2><div class="kpi-panel-body"><table class="kpi-table"><thead><tr><th>Data</th><th>Tipo</th><th>Equipe/Trecho</th><th class="number">Solic.</th><th class="number">Cons.</th><th class="number">Unitario</th><th class="number">Total</th><th>Status</th></tr></thead><tbody>${table || "<tr><td colspan=\"8\">Sem movimentacao no periodo.</td></tr>"}</tbody></table></div></article>${sortedRows.length > 24 ? `<p class="small-note">Mostrando as 24 movimentacoes mais recentes. Use a medicao em Excel para conferencia completa linha a linha.</p>` : ""}</section>
    </section>`
  });
}

function renderAuditPdfHtml(state) {
  const auditRows = [...state.auditLog];
  const userCount = new Set(auditRows.map((item) => item.userId)).size;
  const entityCount = new Set(auditRows.map((item) => auditEntityLabel(item.entity))).size;
  const timeline = auditRows.map((item) => `<div class="timeline-item"><div class="timeline-dot"></div><div><strong>${escapeHtml(item.action)}</strong><br>${escapeHtml(getUserName(state, item.userId))} - ${formatDateTime(item.at)} - ${escapeHtml(auditEntityLabel(item.entity))}</div></div>`).join("");

  return renderPrintablePage({
    title: "Auditoria do sistema",
    subtitle: "Registro de usuário, data e horário das ações realizadas no AlimentaObra.",
    children: `<section class="metrics"><div class="metric"><span>Eventos</span><strong>${auditRows.length}</strong></div><div class="metric"><span>Usuários</span><strong>${userCount}</strong></div><div class="metric"><span>Áreas</span><strong>${entityCount}</strong></div></section><h2 class="section-title">Eventos registrados</h2><section class="timeline">${timeline || "<p class=\"small-note\">Nenhum evento registrado.</p>"}</section>`
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

  return `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" /><title>Pedido ao fornecedor ${escapeHtml(consolidation.date)}</title><style>body{font-family:Arial,sans-serif;color:#1a1a1a;margin:32px}h1{color:#e8520a;margin-bottom:4px}h2{margin-top:24px;border-bottom:2px solid #e8520a;padding-bottom:6px}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:1px solid #ddd;padding:8px;text-align:left}tfoot th{background:#f5f5f3}.total{margin-top:24px;font-size:20px;font-weight:700}</style></head><body><h1>Pedido ao fornecedor</h1><p>Data: ${formatDate(consolidation.date)}</p>${sections}<div class="total">Total geral: ${summary.total} refeições</div></body></html>`;
}

function createMeasurementWorkbook(model) {
  const measurementRows = [
    ["CONSAG", "", "", "", "Memoria de Calculo - Servico Alimentacao", "", "", "", "", "", "", "", "", `Cod. Forn.: ${model.supplierCode} | AlimentaObra`],
    ["", "", "", "", `Empresa: ${model.supplierName}`, "", "", "", "", "", "", "", "", `Medicao: ${model.periodLabel}`],
    ["", "", "", "", `CNPJ: ${model.supplierDocument}`, "", "", "", "", "", "", "", "", `Area/Setor: ${model.area}`],
    ["", "", "", "", `Escopo: ${model.scope} | Periodo: ${formatDate(model.periodStart)} a ${formatDate(model.periodEnd)} | QTD. dias medido: ${model.measuredDays}`, "", "", "", "", "", "", "", "", `Revisao: ${model.revision}`],
    [],
    ["DATA", ...model.meals.flatMap((meal) => [meal.label, "", "", ""])],
    ["DATA", ...model.meals.flatMap(() => ["Dia", "REALIZADO", "VALOR UNITARIO", "VALOR TOTAL"])],
    ...model.dayRows.map((day) => [day.longDate, ...day.meals.flatMap((meal) => [day.weekday, meal.consumed, meal.unitPrice, meal.value])]),
    ["TOTAL", ...model.meals.flatMap((meal) => ["", meal.quantityTotal, "", meal.valueTotal])],
    [],
    ["TOTAL", model.totalValue]
  ];
  const detailRows = [
    ["CONSAG", "", "", "Detalhamento da Medicao", "", "", "", "", "", `Cod. Forn.: ${model.supplierCode}`],
    ["", "", "", `Empresa: ${model.supplierName}`, "", "", "", "", "", `Registros: ${model.detailRows.length}`],
    ["", "", "", `Periodo: ${model.periodLabel}`, "", "", "", "", "", "AlimentaObra"],
    ["", "", "", `Gerado: ${model.generatedAt}`],
    [],
    ["Data", "Dia", "Encarregado", "Equipe/Trecho", "Tipo", "Solicitado", "Realizado", "Efetivo", "Valor unitario", "Valor total", "Status", "Observacoes"],
    ...model.detailRows.map((row) => [row.date, row.weekday, row.leader, row.section, row.meal, row.requested, row.consumed, row.effective || "", row.unitPrice, row.value, row.status, row.notes])
  ];
  const sectionRows = [
    ["CONSAG", "", "", "Resumo por Equipe/Trecho", "", "", "", "", "", `Cod. Forn.: ${model.supplierCode}`],
    ["", "", "", `Empresa: ${model.supplierName}`, "", "", "", "", "", `Equipes: ${model.sectionSummary.length}`],
    ["", "", "", `Periodo: ${model.periodLabel}`, "", "", "", "", "", "AlimentaObra"],
    ["", "", "", `Gerado: ${model.generatedAt}`],
    [],
    ["Equipe/Trecho", "Solicitado", "Realizado", "Efetivo", "Valor total"],
    ...model.sectionSummary.map((row) => [row.label, row.requested, row.consumed, row.effective, row.value])
  ];
  const mealRows = [
    ["CONSAG", "", "", "Resumo por Tipo", "", "", "", "", "", `Cod. Forn.: ${model.supplierCode}`],
    ["", "", "", `Empresa: ${model.supplierName}`, "", "", "", "", "", `Tipos: ${model.mealSummary.length}`],
    ["", "", "", `Periodo: ${model.periodLabel}`, "", "", "", "", "", "AlimentaObra"],
    ["", "", "", `Gerado: ${model.generatedAt}`],
    [],
    ["Tipo", "Solicitado", "Realizado", "Efetivo", "Valor total"],
    ...model.mealSummary.map((row) => [row.label, row.requested, row.consumed, row.effective, row.value])
  ];
  return createMultiSheetWorkbook([
    { name: "Medicao", rows: measurementRows },
    { name: "Detalhamento", rows: detailRows },
    { name: "Resumo por Equipe", rows: sectionRows },
    { name: "Resumo por Tipo", rows: mealRows }
  ]);
}

function createMultiSheetWorkbook(sheets) {
  const safeSheets = sheets.map((sheet, index) => ({ ...sheet, name: escapeXml(sheet.name).slice(0, 31) || `Planilha ${index + 1}` }));
  const worksheetOverrides = safeSheets.map((_, index) => `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("");
  const workbookSheets = safeSheets.map((sheet, index) => `<sheet name="${sheet.name}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`).join("");
  const workbookRels = safeSheets.map((_, index) => `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`).join("");
  const entries = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${worksheetOverrides}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${workbookSheets}</sheets></workbook>`,
    "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${workbookRels}<Relationship Id="rId${safeSheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    "xl/styles.xml": basicStylesXml()
  };
  safeSheets.forEach((sheet, index) => {
    entries[`xl/worksheets/sheet${index + 1}.xml`] = createWorksheetXml(sheet.rows);
  });
  return createZip(entries);
}

function basicStylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="3"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Arial"/></font><font><b/><sz val="11"/><color rgb="FF002060"/><name val="Arial"/></font></fonts><fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF002060"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9E2F3"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF7F9FC"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFB4C7E7"/></left><right style="thin"><color rgb="FFB4C7E7"/></right><top style="thin"><color rgb="FFB4C7E7"/></top><bottom style="thin"><color rgb="FFB4C7E7"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="5"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1" applyBorder="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
}

function createXlsxWorkbook(sheetName, rows) {
  const entries = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${escapeXml(sheetName).slice(0, 31)}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    "xl/styles.xml": basicStylesXml(),
    "xl/worksheets/sheet1.xml": createWorksheetXml(rows)
  };
  return createZip(entries);
}

function createWorksheetXml(rows) {
  const columnCount = Math.max(1, ...rows.map((row) => row.length));
  const defaultWidths = [16, 16, 28, 30, 24, 12, 12, 12, 15, 15, 16, 34];
  const cols = Array.from({ length: columnCount }, (_, index) => `<col min="${index + 1}" max="${index + 1}" width="${defaultWidths[index] ?? 14}" customWidth="1"/>`).join("");
  const tableHeaderIndex = rows.findIndex((row, index) => index > 0 && (rows[index - 1]?.length ?? 0) === 0 && row.length > 0);
  const sheetRows = rows.map((row, rowIndex) => {
    const isEmptyRow = row.every((cell) => cell === "" || cell === null || typeof cell === "undefined");
    const styleId = rowIndex === 0 || rowIndex === tableHeaderIndex
      ? 1
      : rowIndex > 0 && rowIndex < tableHeaderIndex
        ? 2
        : !isEmptyRow && tableHeaderIndex >= 0 && rowIndex > tableHeaderIndex
          ? 4
          : 0;
    const styleAttr = styleId ? ` s="${styleId}"` : "";
    const cells = row.map((cell, cellIndex) => {
      const ref = `${columnName(cellIndex + 1)}${rowIndex + 1}`;
      if (typeof cell === "number" && Number.isFinite(cell)) return `<c r="${ref}"${styleAttr}><v>${cell}</v></c>`;
      return `<c r="${ref}" t="inlineStr"${styleAttr}><is><t>${escapeXml(cell)}</t></is></c>`;
    }).join("");
    return `<row r="${rowIndex + 1}">${cells}</row>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>${cols}</cols><sheetData>${sheetRows}</sheetData><autoFilter ref="A1:${columnName(columnCount)}${Math.max(rows.length, 1)}"/></worksheet>`;
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
