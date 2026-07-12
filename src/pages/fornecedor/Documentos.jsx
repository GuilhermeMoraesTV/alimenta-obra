import React from "react";
import { Icon, SupplierBackButton, SupplierReceiptHeader, foodSummary, statusLabel, supplierConsolidations, supplierDocuments } from "./shared.jsx";

export function Documents(props) {
  const { formatDate, formatDateTime, getConsolidationSummary, icon, state, STATUS_LABEL, user } = props;
  const rows = supplierConsolidations(state, user);
  const documents = state.consolidationDocuments.filter((item) => rows.some((row) => row.id === item.consolidationId));
  const withoutDocuments = rows.filter((row) => !supplierDocuments(state, row.id).length);
  return (
    <section className="supplier-workspace">
      <SupplierReceiptHeader
        kicker="Documentos"
        title="Notas e arquivos"
        totalValue={documents.length}
        totalLabel="arquivos anexados"
        description="Notas de fornecimento e notas fiscais anexadas."
        backAction={<SupplierBackButton icon={icon} />}
        metrics={[
          { icon, iconName: "package", label: "Pedidos", value: rows.length },
          { icon, iconName: "clipboard", label: "Arquivos", value: documents.length },
          { icon, iconName: "clock", label: "Sem anexo", value: withoutDocuments.length },
        ]}
      />
      <div className="supplier-documents-list">{rows.length ? rows.map((consolidation) => { const summary = getConsolidationSummary(state, consolidation); const docs = supplierDocuments(state, consolidation.id); return (
        <article className="supplier-document-card supplier-order-card" key={consolidation.id}>
          <div className="supplier-order-card-head">
            <div className="supplier-order-card-title">
              <span className={`badge ${consolidation.status}`}>{statusLabel(STATUS_LABEL, consolidation.status)}</span>
              <h2>{foodSummary(summary) || `Pedido ${consolidation.id.slice(0, 8).toUpperCase()}`}</h2>
              <p>Entrega {formatDate(consolidation.date)} - {summary.total} refeições</p>
            </div>
            <div className="supplier-document-actions">
              <button className="btn outline small" data-generate-romaneio={consolidation.id}>Gerar nota</button>
              <label className="btn primary small supplier-upload-label">Anexar PDF<input type="file" accept="application/pdf" data-document-upload={consolidation.id} hidden /></label>
            </div>
          </div>
          <div className="supplier-order-card-meta">
            <span>Arquivos<strong>{docs.length}</strong></span>
            <span>Quantidade<strong>{summary.total}</strong></span>
            <span>Pedido<strong>{consolidation.id.slice(0, 8).toUpperCase()}</strong></span>
            <span>Situação<strong>{docs.length ? "Anexado" : "Pendente"}</strong></span>
          </div>
          {docs.length ? <div className="supplier-attached-files">{docs.map((doc) => <button className="supplier-file-row" data-download-document={doc.id} key={doc.id}><Icon icon={icon} name="package" size={16} /><span>{doc.originalName}</span><small>{formatDateTime(doc.createdAt)}</small></button>)}</div> : <div className="supplier-no-documents">Nenhuma nota fiscal anexada.</div>}
        </article>
      ); }) : <div className="empty">Ainda não há pedidos para documentar.</div>}</div>
    </section>
  );
}
