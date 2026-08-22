import React from "react";
import { Dashboard } from "./Dashboard.jsx";
import { Orders } from "./Pedidos.jsx";
import { History } from "./Historico.jsx";
import { More } from "./Mais.jsx";
import { Documents } from "./Documentos.jsx";
import { Financeiro } from "./Financeiro.jsx";

const supplierPageStyles = `
  .supplier-page {
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    display: grid;
    gap: 0.75rem;
    color: #1c1917;
  }
  .supplier-page h1,
  .supplier-page h2,
  .supplier-page h3,
  .supplier-page p { margin: 0; }
  .supplier-page h1 { font-size: 26px; line-height: 1; font-weight: 900; letter-spacing: 0; }
  .supplier-page h2 { font-size: 1.25rem; font-weight: 900; }
  .supplier-page h3 { font-weight: 900; }
  .supplier-page p { font-size: .875rem; color: #78716c; }
  .supplier-page .app-page-header {
    position: relative;
    margin-bottom: .75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: .75rem;
    border-radius: 18px;
    border: 1px solid #e7e5e4;
    border-left: 5px solid #ea580c;
    background: rgba(255,255,255,.9);
    padding: 1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }
  .supplier-page .eyebrow { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .12em; color: #c2410c; }
  .supplier-page .page-subtitle { font-size: .75rem; font-weight: 700; color: #78716c; }
  .supplier-page .btn,
  .supplier-page .supplier-back-button {
    display: inline-flex;
    min-height: 2.5rem;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    border-radius: .5rem;
    border: 1px solid transparent;
    padding: 0 1rem;
    font-size: .875rem;
    font-weight: 800;
    transition: transform .18s ease, border-color .18s ease, background .18s ease;
  }
  .supplier-page .btn:hover { transform: translateY(-2px); }
  .supplier-page .btn.primary { border-color: #ea580c; background: #ea580c; color: #fff; box-shadow: 0 10px 22px rgba(239,91,29,.2); }
  .supplier-page .btn.outline,
  .supplier-page .supplier-back-button { border-color: #d6d3d1; background: #fff; color: #1c1917; }
  .supplier-page .btn.small { min-height: 2.25rem; padding: 0 .75rem; font-size: .75rem; }
  .supplier-page .badge { display: inline-flex; min-height: 1.75rem; align-items: center; border-radius: 999px; border: 1px solid #e7e5e4; background: #f5f5f4; padding: 0 .625rem; font-size: 11px; font-weight: 900; text-transform: uppercase; color: #57534e; }
  .supplier-page .badge.enviado { border-color: #fed7aa; background: #fff7ed; color: #c2410c; }
  .supplier-page .badge.entregue { border-color: #a7f3d0; background: #ecfdf5; color: #047857; }
  .supplier-page .badge.cancelamento_pendente { border-color: #fecaca; background: #fef2f2; color: #991b1b; }
  .supplier-page .badge.cancelado_confirmado { border-color: #fecaca; background: #fef2f2; color: #991b1b; }
  .supplier-page .badge.confirmado { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
  .supplier-page .badge.producao { border-color: #fde68a; background: #fffbeb; color: #b45309; }
  .supplier-page .badge.saiu_entrega { border-color: #a7f3d0; background: #ecfdf5; color: #047857; }
  .supplier-page .supplier-dashboard,
  .supplier-page .supplier-workspace,
  .supplier-page .supplier-queue,
  .supplier-page .supplier-order-list,
  .supplier-page .supplier-origin-list,
  .supplier-page .supplier-history-list,
  .supplier-page .supplier-documents-list,
  .supplier-page .supplier-attached-files { display: grid; gap: .75rem; }
  .supplier-page .supplier-heading {
    margin-bottom: .75rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: .75rem;
    border-radius: 18px;
    border: 1px solid #292524;
    border-left: 5px solid #ea580c;
    background: #242622;
    color: #fff;
    padding: 1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }
  .supplier-page .supplier-heading p { color: rgba(255,255,255,.65); }
  .supplier-page .supplier-metrics-grid,
  .supplier-page .finance-metrics,
  .supplier-page .supplier-order-highlights { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .5rem; }
  .supplier-page .supplier-metric,
  .supplier-page .supplier-next-action,
  .supplier-page .supplier-panel-card,
  .supplier-page .supplier-queue-row,
  .supplier-page .supplier-order-list-item,
  .supplier-page .supplier-order-detail,
  .supplier-page .supplier-origin-card,
  .supplier-page .supplier-history-row,
  .supplier-page .supplier-more-tile,
  .supplier-page .supplier-document-card,
  .supplier-page .finance-metric,
  .supplier-page .finance-card,
  .supplier-page .consolidated-block {
    border-radius: 1rem;
    border: 1px solid #e7e5e4;
    background: #fff;
    padding: 1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }
  .supplier-page .supplier-metric,
  .supplier-page .finance-metric,
  .supplier-page .supplier-order-highlights > div {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: .5rem;
    border-radius: .375rem 1rem 1rem .375rem;
    border: 1px dashed #d6d3d1;
    border-left-width: 2px;
    background: #fff;
    padding: .75rem 1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }
  .supplier-page .supplier-data-icon {
    display: grid;
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
    place-items: center;
    border-radius: 999px;
    background: #fff0e8;
    color: #c2410c;
  }
  .supplier-page .supplier-data-copy {
    min-width: 0;
    line-height: 1;
  }
  .supplier-page .supplier-metric .supplier-data-copy span,
  .supplier-page .supplier-order-highlights span { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .supplier-page .supplier-metric strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 1.12rem; line-height: 1; font-weight: 950; color: #1c1917; }
  .supplier-page .supplier-metric small { display: none; }
  .supplier-page .supplier-metric.accent,
  .supplier-page .finance-metric.accent { border-color: #d6d3d1; background: #fff; color: #1c1917; }
  .supplier-page .supplier-metric.accent .supplier-data-copy span,
  .supplier-page .supplier-metric.accent small { color: #78716c; }
  .supplier-page .supplier-next-action { display: grid; gap: .75rem; }
  .supplier-page .supplier-next-icon { display: grid; width: 3rem; height: 3rem; place-items: center; border-radius: .75rem; background: #fff7ed; color: #c2410c; }
  .supplier-page .supplier-next-order,
  .supplier-page .supplier-next-actions,
  .supplier-page .filter-bar,
  .supplier-page .supplier-detail-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
  .supplier-page .supplier-next-order span { border-radius: 999px; background: #f5f5f4; padding: .25rem .625rem; font-size: .75rem; font-weight: 700; }
  .supplier-page .supplier-section-heading,
  .supplier-page .supplier-detail-top,
  .supplier-page .supplier-origin-card > div,
  .supplier-page .supplier-document-title,
  .supplier-page .supplier-document-body,
  .supplier-page .supplier-history-row { display: flex; align-items: center; justify-content: space-between; gap: .75rem; }
  .supplier-page .text-action { display: inline-flex; align-items: center; gap: .25rem; border: 0; background: transparent; color: #c2410c; font-size: .875rem; font-weight: 800; }
  .supplier-page .supplier-queue-row { display: grid; grid-template-columns: minmax(0,1fr) auto auto auto; align-items: center; text-align: left; }
  .supplier-page .supplier-orders-layout,
  .supplier-page .supplier-detail-grid,
  .supplier-page .supplier-more-grid,
  .supplier-page .finance-grid { display: grid; gap: .75rem; }
  .supplier-page .supplier-order-list-item { display: grid; gap: .5rem; text-align: left; }
  .supplier-page .supplier-order-list-item.selected { border-color: #f97316; background: #fff7ed; }
  .supplier-page .supplier-detail-grid section,
  .supplier-page .supplier-document-body { border-radius: .75rem; border: 1px solid #e7e5e4; background: #fafaf9; padding: .75rem; }
  .supplier-page .consolidated-summary { display: grid; gap: .65rem; }
  .supplier-page .consolidated-block { display: grid; gap: .4rem; overflow: hidden; padding: .65rem; }
  .supplier-page .consolidated-block-title,
  .supplier-page .consolidated-distribution-head,
  .supplier-page .consolidated-row,
  .supplier-page .consolidated-resume-row { display: grid; grid-template-columns: minmax(0,1fr) 4.5rem; align-items: center; }
  .supplier-page .consolidated-block-title { display: flex; align-items: center; justify-content: space-between; gap: .65rem; color: #1c1917; font-size: .86rem; font-weight: 950; }
  .supplier-page .consolidated-block-title span { border-radius: 999px; background: #fff7ed; padding: .18rem .5rem; color: #c2410c; font-size: .78rem; }
  .supplier-page .consolidated-distribution-head { display: none; }
  .supplier-page .consolidated-description { color: #78716c; font-size: .78rem; font-weight: 700; }
  .supplier-page .consolidated-distribution { display: grid; gap: .3rem; }
  .supplier-page .consolidated-row { display: flex; align-items: center; justify-content: space-between; gap: .75rem; border-radius: .55rem; background: #fafaf9; padding: .42rem .5rem; font-size: .875rem; }
  .supplier-page .consolidated-row span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .supplier-page .consolidated-resume { display: flex; flex-wrap: wrap; gap: .35rem; }
  .supplier-page .consolidated-resume-row { display: inline-flex; align-items: center; gap: .32rem; border-radius: 999px; border: 1px solid #fed7aa; background: #fff7ed; color: #c2410c; font-size: .72rem; font-weight: 950; }
  .supplier-page .consolidated-resume-row span,
  .supplier-page .consolidated-resume-row strong { min-width: 0; padding: .24rem .44rem; }
  .supplier-page .consolidated-resume-row strong { padding-left: 0; }
  .supplier-page .total-line { font-weight: 900; }
  .supplier-page .timeline { display: grid; gap: .5rem; }
  .supplier-page .timeline-item { display: grid; grid-template-columns: 12px minmax(0,1fr); gap: .75rem; border-radius: .75rem; border: 1px solid #e7e5e4; background: #fff; padding: .75rem; }
  .supplier-page .timeline-dot { margin-top: .25rem; width: .75rem; height: .75rem; border-radius: 999px; background: #ea580c; }
  .supplier-page .supplier-origin-card footer { margin-top: .5rem; display: flex; flex-wrap: wrap; gap: .5rem; font-size: .75rem; font-weight: 700; color: #78716c; }
  .supplier-page input,
  .supplier-page select { min-height: 2.5rem; border-radius: .5rem; border: 1px solid #d6d3d1; background: #fff; padding: 0 .75rem; font-size: .875rem; }
  .supplier-page .supplier-more-tile { display: grid; grid-template-columns: 44px minmax(0,1fr) auto 20px; align-items: center; gap: .75rem; text-align: left; }
  .supplier-page .supplier-file-row { display: grid; grid-template-columns: 20px minmax(0,1fr) auto; align-items: center; gap: .5rem; border-radius: .75rem; border: 1px solid #e7e5e4; background: #fff; padding: .75rem; text-align: left; }
  .supplier-page .finance-metric strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 1.12rem; line-height: 1; font-weight: 950; color: #1c1917; }
  .supplier-page .finance-metric .supplier-data-copy span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 950; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .supplier-page .finance-metric small { display: none; }
  .supplier-page .finance-progress { display: grid; gap: .5rem; padding: .5rem 0; }
  .supplier-page .finance-progress > div { display: flex; align-items: center; justify-content: space-between; }
  .supplier-page .finance-progress i { display: block; height: .5rem; overflow: hidden; border-radius: 999px; background: #f5f5f4; }
  .supplier-page .finance-progress b { display: block; height: 100%; border-radius: 999px; background: #ea580c; }
  .supplier-page .finance-bars { display: grid; height: 11rem; grid-template-columns: repeat(7,minmax(0,1fr)); align-items: end; gap: .5rem; }
  .supplier-page .finance-bars > div { display: grid; justify-items: center; }
  .supplier-page .finance-bars i { display: block; width: 1.5rem; border-radius: 999px 999px 0 0; background: #ea580c; }
  .supplier-page .table-wrap { overflow-x: auto; border-radius: .75rem; border: 1px solid #e7e5e4; background: #fff; }
  .supplier-page table { width: 100%; border-collapse: collapse; }
  .supplier-page th { background: #fafaf9; padding: .75rem; text-align: left; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #78716c; }
  .supplier-page td { border-top: 1px solid #f5f5f4; padding: .75rem; }
  .supplier-page .empty { border-radius: .75rem; border: 1px dashed #d6d3d1; background: #fafaf9; padding: 1.25rem; text-align: center; font-size: .875rem; font-weight: 700; color: #78716c; }
  @media (min-width: 640px) {
    .supplier-page h1 { font-size: 34px; }
    .supplier-page .supplier-next-actions { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }
  }
  @media (max-width: 767px) {
    .supplier-page .app-page-header:has(.supplier-back-button),
    .supplier-page .supplier-heading:has(.supplier-back-button) {
      margin-top: 1.75rem;
      overflow: visible;
    }
    .supplier-page .app-page-header:has(.supplier-back-button) > div:first-child,
    .supplier-page .supplier-heading:has(.supplier-back-button) > div:first-child {
      min-height: 0;
      padding-left: 0;
    }
    .supplier-page .supplier-back-button {
      position: absolute;
      top: -1.72rem;
      left: 0;
      z-index: 3;
      width: auto;
      min-height: 1.25rem;
      padding: 0;
      border: 0;
      background: transparent;
      box-shadow: none;
      color: #78716c;
      font-size: .75rem;
      font-weight: 800;
      gap: .25rem;
    }
  }
  @media (min-width: 1024px) {
    .supplier-page .supplier-metrics-grid,
    .supplier-page .supplier-order-highlights,
    .supplier-page .finance-metrics { grid-template-columns: repeat(4,minmax(0,1fr)); }
    .supplier-page .supplier-next-action { grid-template-columns: 48px minmax(0,1fr) auto; }
    .supplier-page .supplier-orders-layout { grid-template-columns: 360px minmax(0,1fr); }
    .supplier-page .supplier-detail-grid,
    .supplier-page .supplier-more-grid,
    .supplier-page .finance-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
    .supplier-page .supplier-documents-list {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 34rem), 1fr));
      align-items: start;
    }
    .supplier-page .supplier-document-card {
      gap: .75rem;
      padding: .9rem;
    }
    .supplier-page .supplier-document-card .supplier-order-card-head {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: start;
    }
    .supplier-page .supplier-document-card .supplier-order-card-title {
      min-width: 0;
      grid-template-columns: minmax(0, 1fr);
    }
    .supplier-page .supplier-document-card .supplier-order-card-title .badge {
      width: max-content;
      max-width: 100%;
    }
    .supplier-page .supplier-document-card .supplier-order-card-title h2 {
      max-width: none;
      overflow-wrap: normal;
      word-break: normal;
      font-size: 1rem;
      line-height: 1.16;
    }
    .supplier-page .supplier-document-card .supplier-order-card-title p {
      display: block;
    }
    .supplier-page .supplier-document-card .supplier-document-actions {
      justify-content: flex-end;
      flex-wrap: nowrap;
    }
    .supplier-page .supplier-document-card .supplier-order-card-meta {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  .supplier-page {
    gap: .95rem;
    min-width: 0;
  }

  .supplier-page *,
  .supplier-page .admin-receipt,
  .supplier-page .admin-receipt-head,
  .supplier-page .admin-receipt-main,
  .supplier-page .supplier-dashboard,
  .supplier-page .supplier-workspace,
  .supplier-page .supplier-more,
  .supplier-page .finance-page,
  .supplier-page .finance-card,
  .supplier-page .table-wrap {
    min-width: 0;
  }

  .supplier-page h1,
  .supplier-page h2,
  .supplier-page h3,
  .supplier-page p {
    letter-spacing: 0;
  }

  .supplier-page h1 {
    font-size: clamp(1.46rem, 1.05rem + 1vw, 2.14rem);
    line-height: .96;
    font-weight: 950;
  }

  .supplier-page h2 {
    font-size: 1.12rem;
    line-height: 1.1;
    font-weight: 950;
    color: #1c1917;
  }

  .supplier-page h3 {
    font-size: .96rem;
    line-height: 1.12;
    font-weight: 950;
    color: #1c1917;
  }

  .supplier-page p,
  .supplier-page small {
    color: #6f6b63;
  }

  .supplier-page .supplier-heading,
  .supplier-page .app-page-header,
  .supplier-page .admin-receipt {
    overflow: visible;
    border-radius: 22px;
    border: 1px solid #27251f;
    border-left: 0;
    background: #242622;
    box-shadow: 0 18px 40px -22px rgba(0,0,0,.55);
    isolation: isolate;
  }

  .supplier-page .supplier-heading,
  .supplier-page .app-page-header,
  .supplier-page .admin-receipt-head {
    position: relative;
    background: linear-gradient(135deg, #242622, #1c1d1b);
    color: #fff;
  }

  .supplier-page .admin-receipt-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: .65rem;
    border-radius: 22px 22px 0 0;
    padding: .82rem 1rem .78rem;
  }

  .supplier-page .supplier-heading::before,
  .supplier-page .app-page-header::before,
  .supplier-page .admin-receipt-head::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: .055;
    background-image: radial-gradient(currentColor 1.4px, transparent 1.4px);
    background-size: 16px 16px;
  }

  .supplier-page .supplier-heading > *,
  .supplier-page .app-page-header > *,
  .supplier-page .admin-receipt-head > * {
    position: relative;
    z-index: 1;
  }

  .supplier-page .supplier-heading h1,
  .supplier-page .app-page-header h1,
  .supplier-page .admin-receipt h1 {
    color: #fff;
  }

  .supplier-page .supplier-heading p,
  .supplier-page .app-page-header .page-subtitle,
  .supplier-page .admin-receipt p {
    max-width: 42rem;
    color: rgba(255,255,255,.62);
    font-weight: 700;
  }

  .supplier-page .supplier-heading .eyebrow,
  .supplier-page .app-page-header .eyebrow,
  .supplier-page .admin-receipt .compact-kicker {
    color: #fed7aa;
  }

  .supplier-page .eyebrow,
  .supplier-page .compact-kicker,
  .supplier-page .supplier-data-copy span,
  .supplier-page .supplier-order-highlights span,
  .supplier-page .finance-metric .supplier-data-copy span {
    display: inline-flex;
    align-items: center;
    gap: .35rem;
    font-size: 10px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: .1em;
  }

  .supplier-page .actions,
  .supplier-page .supplier-next-actions,
  .supplier-page .supplier-detail-actions,
  .supplier-page .supplier-history-actions,
  .supplier-page .filter-bar,
  .supplier-page .admin-receipt-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: .5rem;
  }

  .supplier-page .btn,
  .supplier-page .supplier-back-button,
  .supplier-page .admin-filter-menu summary {
    min-height: 2.7rem;
    border-radius: .55rem;
    padding: 0 .9rem;
    font-size: .9rem;
    font-weight: 900;
    color: #1c1917;
    transition: transform .18s ease, border-color .18s ease, background .18s ease, color .18s ease, box-shadow .18s ease;
  }

  .supplier-page .btn:hover,
  .supplier-page .supplier-back-button:hover,
  .supplier-page .admin-filter-menu summary:hover {
    transform: translateY(-1px);
  }

  .supplier-page .btn.primary:hover {
    background: #c2410c;
  }

  .supplier-page .btn.outline,
  .supplier-page .supplier-back-button,
  .supplier-page .admin-filter-menu summary {
    border-color: #ddd8cf;
    background: #fffefa;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }

  .supplier-page .supplier-heading .btn.outline,
  .supplier-page .app-page-header .btn.outline,
  .supplier-page .app-page-header .supplier-back-button,
  .supplier-page .admin-receipt .btn.outline,
  .supplier-page .admin-receipt .supplier-back-button,
  .supplier-page .admin-receipt .admin-filter-menu summary {
    border-color: rgba(255,255,255,.16);
    background: rgba(255,255,255,.1);
    color: #fff;
  }

  .supplier-page .admin-filter-menu {
    position: relative;
  }

  .supplier-page .admin-filter-menu summary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    border: 1px solid transparent;
    list-style: none;
    cursor: pointer;
    font-weight: 900;
  }

  .supplier-page .admin-filter-menu summary::-webkit-details-marker {
    display: none;
  }

  .supplier-page .admin-filter-popover {
    position: absolute;
    right: 0;
    z-index: 30;
    margin-top: .5rem;
    display: grid;
    min-width: min(20rem, calc(100vw - 1.5rem));
    gap: .55rem;
    border-radius: 1rem;
    border: 1px solid #ded9d1;
    background: #fffefa;
    padding: .75rem;
    box-shadow: 0 24px 54px rgba(25,27,24,.22);
  }

  .supplier-page .btn.small {
    min-height: 2.25rem;
    padding-inline: .72rem;
    font-size: .76rem;
  }

  .supplier-page input,
  .supplier-page select {
    min-height: 2.65rem;
    width: 100%;
    border-radius: .65rem;
    border: 1px solid #d7d2ca;
    background: #fffefa;
    padding: 0 .78rem;
    font-size: .88rem;
    font-weight: 700;
    color: #1c1917;
    outline: none;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.8), 0 1px 2px rgba(0,0,0,.035);
  }

  .supplier-page input:focus,
  .supplier-page select:focus {
    border-color: #ea580c;
    box-shadow: 0 0 0 4px rgba(234,88,12,.13);
  }

  .supplier-page .admin-receipt-main {
    min-width: 0;
  }

  .supplier-page .admin-receipt-total {
    margin-top: .28rem;
    display: flex;
    align-items: end;
    gap: .45rem;
    color: #fff;
  }

  .supplier-page .admin-receipt-total strong {
    font-size: clamp(2.25rem, 1.7rem + 2.2vw, 3.55rem);
    line-height: .82;
    font-weight: 950;
  }

  .supplier-page .admin-receipt-total span {
    max-width: 7.5rem;
    padding-bottom: .28rem;
    color: rgba(255,255,255,.58);
    font-size: 9px;
    font-weight: 950;
    line-height: 1.12;
    text-transform: uppercase;
    letter-spacing: .1em;
  }

  .supplier-page .admin-receipt-holes {
    pointer-events: none;
    display: flex;
    justify-content: space-around;
    padding: 0 1rem;
    transform: translateY(50%);
  }

  .supplier-page .admin-receipt-holes span {
    width: .65rem;
    height: .65rem;
    border-radius: 999px;
    background: #fffefa;
  }

  .supplier-page .admin-receipt-metrics {
    display: grid;
    grid-template-columns: repeat(var(--receipt-metric-count), minmax(0, 1fr));
    gap: .5rem;
    border-radius: 0 0 20px 20px;
    background: #fafaf9;
    padding: 1.25rem 1rem .75rem;
  }

  .supplier-page .admin-receipt-chip,
  .supplier-page .supplier-metric,
  .supplier-page .finance-metric,
  .supplier-page .supplier-order-highlights > div {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: .5rem;
    border-radius: .375rem 1rem 1rem .375rem;
    border: 1px dashed #d6d3d1;
    border-left-width: 2px;
    background: #fff;
    padding: .75rem 1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }

  .supplier-page .admin-receipt-chip-icon,
  .supplier-page .supplier-data-icon {
    display: grid;
    width: 2.25rem;
    height: 2.25rem;
    flex-shrink: 0;
    place-items: center;
    border-radius: 999px;
    background: #fff0e8;
    color: #c2410c;
  }

  .supplier-page .admin-receipt-chip-icon svg,
  .supplier-page .supplier-data-icon svg {
    color: #c2410c;
    stroke: #c2410c;
  }

  .supplier-page .admin-receipt-chip-text,
  .supplier-page .supplier-data-copy {
    min-width: 0;
    line-height: 1;
  }

  .supplier-page .admin-receipt-chip strong,
  .supplier-page .supplier-metric strong,
  .supplier-page .finance-metric strong,
  .supplier-page .supplier-order-highlights strong {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.12rem;
    line-height: 1;
    font-weight: 950;
    color: #1c1917;
  }

  .supplier-page .admin-receipt-chip.is-long-value strong {
    font-size: .82rem;
    letter-spacing: 0;
  }

  .supplier-page .admin-receipt-chip span:last-child,
  .supplier-page .supplier-metric .supplier-data-copy span,
  .supplier-page .finance-metric .supplier-data-copy span,
  .supplier-page .supplier-order-highlights span {
    display: block;
    display: -webkit-box;
    overflow: hidden;
    white-space: normal;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .08em;
    line-height: 1.08;
    color: #78716c;
  }

  .supplier-page .supplier-dashboard,
  .supplier-page .supplier-workspace,
  .supplier-page .supplier-more,
  .supplier-page .finance-page,
  .supplier-page .supplier-queue,
  .supplier-page .supplier-order-list,
  .supplier-page .supplier-origin-list,
  .supplier-page .supplier-history-list,
  .supplier-page .supplier-documents-list,
  .supplier-page .supplier-attached-files {
    display: grid;
    gap: .75rem;
  }

  .supplier-page .supplier-next-action,
  .supplier-page .supplier-panel-card,
  .supplier-page .supplier-queue-row,
  .supplier-page .supplier-order-list-item,
  .supplier-page .supplier-order-detail,
  .supplier-page .supplier-origin-card,
  .supplier-page .supplier-history-row,
  .supplier-page .supplier-more-tile,
  .supplier-page .supplier-document-card,
  .supplier-page .finance-card,
  .supplier-page .consolidated-block {
    border-radius: 18px;
    border: 1px solid #ded9d1;
    background: rgba(255,254,250,.94);
    padding: 1rem;
    box-shadow: 0 12px 30px rgba(25,27,24,.055);
  }

  .supplier-page .supplier-next-action {
    align-items: center;
  }

  .supplier-page .supplier-next-icon,
  .supplier-page .supplier-more-tile > span:first-child {
    display: grid;
    width: 2.5rem;
    height: 2.5rem;
    place-items: center;
    border-radius: .8rem;
    background: #fff0e8;
    color: #c2410c;
  }

  .supplier-page .supplier-next-order span {
    background: #f5f1ea;
    color: #57534e;
    font-size: .72rem;
    font-weight: 800;
  }

  .supplier-page .supplier-section-heading,
  .supplier-page .supplier-detail-top,
  .supplier-page .supplier-origin-card > div,
  .supplier-page .supplier-document-title,
  .supplier-page .supplier-document-body,
  .supplier-page .supplier-history-row {
    align-items: flex-start;
  }

  .supplier-page .text-action {
    min-height: 2.25rem;
    border-radius: .55rem;
    border: 1px solid #ddd8cf;
    background: #fffefa;
    padding: 0 .72rem;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
    color: #c2410c;
    font-size: .76rem;
    font-weight: 900;
  }

  .supplier-page .supplier-queue-row {
    grid-template-columns: minmax(5rem, .6fr) minmax(0,1.5fr) auto auto;
    gap: .75rem;
    border-radius: .85rem;
    padding: .75rem;
  }

  .supplier-page .supplier-queue-row small,
  .supplier-page .supplier-order-list-item small,
  .supplier-page .supplier-more-tile small,
  .supplier-page .supplier-file-row small {
    display: block;
    margin-top: .15rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: .74rem;
    font-weight: 750;
  }

  .supplier-page .supplier-order-list-item {
    border-left: 2px dashed #d6d3d1;
  }

  .supplier-page .supplier-simple-orders {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 32rem), 1fr));
    align-items: start;
    gap: .75rem;
  }

  .supplier-page .supplier-request-shell {
    display: grid;
    min-width: 0;
    gap: .35rem;
  }

  .supplier-page .supplier-request-owner {
    display: inline-flex;
    width: max-content;
    max-width: 100%;
    align-items: center;
    gap: .45rem;
    border-radius: .5rem;
    border: 1px dashed #d6d3d1;
    background: #fffefa;
    padding: .35rem .55rem;
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: #78716c;
  }

  .supplier-page .supplier-request-owner strong {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #1c1917;
  }

  .supplier-page .supplier-order-card {
    display: grid;
    gap: .65rem;
    border: 1px solid #e7e5e4;
    border-left: 2px dashed #d6d3d1;
    background: #fffefa;
    padding: .75rem;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
    transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  }

  .supplier-page .supplier-order-card:hover {
    transform: translateY(-2px);
    border-color: #fdba74;
    box-shadow: 0 18px 34px rgba(34,29,24,.12);
  }

  .supplier-page .supplier-order-card-head,
  .supplier-page .supplier-order-card-actions,
  .supplier-page .supplier-order-card-meta,
  .supplier-page .supplier-document-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: .5rem;
  }

  .supplier-page .supplier-order-card-head {
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr) auto;
    justify-content: stretch;
    align-items: flex-start;
    gap: .75rem;
  }

  .supplier-page .supplier-order-card-icon {
    display: grid;
    height: 2.5rem;
    width: 2.5rem;
    place-items: center;
    border-radius: .85rem;
    border: 1px solid #ffedd5;
    background: #fff7ed;
    color: #c2410c;
  }

  .supplier-page .supplier-order-card-title {
    min-width: 0;
    display: grid;
    gap: .28rem;
  }

  .supplier-page .supplier-order-card-title h2 {
    max-width: 42rem;
    overflow-wrap: anywhere;
    font-size: .98rem;
    line-height: 1.12;
  }

  .supplier-page .supplier-order-title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: .5rem;
  }

  .supplier-page .supplier-order-card-meta {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: .48rem;
  }

  .supplier-page .supplier-order-card-meta span {
    display: grid;
    gap: .18rem;
    border-radius: .7rem;
    background: #f5f1ea;
    padding: .52rem .6rem;
    color: #746f66;
    font-size: .7rem;
    font-weight: 850;
  }

  .supplier-page .supplier-order-card-meta strong {
    overflow-wrap: anywhere;
    color: #1c1917;
    font-size: .92rem;
    line-height: 1;
    font-weight: 950;
  }

  .supplier-page .supplier-order-card-actions {
    justify-content: flex-end;
  }

  .supplier-page .supplier-order-card-actions .btn {
    min-height: 2.25rem;
  }

  .supplier-page .supplier-order-details {
    border-radius: .85rem;
    border: 1px dashed #d8d1c7;
    background: #fffefa;
  }

  .supplier-page .supplier-order-details summary {
    display: flex;
    min-height: 2.45rem;
    cursor: pointer;
    align-items: center;
    justify-content: space-between;
    gap: .75rem;
    padding: 0 .8rem;
    color: #1c1917;
    font-size: .78rem;
    font-weight: 950;
    list-style: none;
  }

  .supplier-page .supplier-order-details summary::-webkit-details-marker {
    display: none;
  }

  .supplier-page .supplier-order-details summary::after {
    content: "+";
    color: #c2410c;
    font-size: 1rem;
    line-height: 1;
  }

  .supplier-page .supplier-order-details[open] summary::after {
    content: "-";
  }

  .supplier-page .supplier-order-details-body {
    display: grid;
    gap: .65rem;
    border-top: 1px dashed #d8d1c7;
    padding: .75rem;
  }

  .supplier-page .supplier-order-items-summary {
    display: grid;
    gap: .45rem;
  }

  .supplier-page .supplier-order-item-line {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: .75rem;
    border-radius: .75rem;
    background: #f5f1ea;
    padding: .55rem .65rem;
  }

  .supplier-page .supplier-order-item-line span {
    min-width: 0;
    display: grid;
    gap: .18rem;
  }

  .supplier-page .supplier-order-item-line strong {
    overflow-wrap: anywhere;
    color: #1c1917;
    font-size: .88rem;
    line-height: 1.12;
    font-weight: 950;
  }

  .supplier-page .supplier-order-item-line small {
    color: #746f66;
    font-size: .74rem;
    font-weight: 750;
    line-height: 1.18;
  }

  .supplier-page .supplier-order-item-line b {
    flex-shrink: 0;
    color: #1c1917;
    font-weight: 950;
  }

  .supplier-page .supplier-order-detail-section {
    display: grid;
    gap: .45rem;
  }

  .supplier-page .supplier-order-detail-section h3 {
    font-size: .78rem;
    text-transform: uppercase;
    color: #746f66;
  }

  .supplier-page .supplier-order-list-item.selected {
    border-color: #fdba74;
    background: #fff7ed;
  }

  .supplier-page .supplier-detail-grid section,
  .supplier-page .supplier-document-body,
  .supplier-page .timeline-item,
  .supplier-page .supplier-file-row {
    border-radius: .9rem;
    border: 1px solid #e4ded4;
    background: #fffefa;
  }

  .supplier-page .supplier-composition,
  .supplier-page .supplier-origin-requests {
    display: grid;
    gap: .55rem;
  }

  .supplier-page .consolidated-row {
    border-top: 1px solid #eee8df;
  }

  .supplier-page .consolidated-row:first-child,
  .supplier-page .total-line {
    border-top: 0;
  }

  .supplier-page .table-wrap {
    border-radius: .9rem;
    border-color: #e4ded4;
    background: #fffefa;
  }

  .supplier-page th {
    background: #f6f1ea;
    font-weight: 950;
    color: #746f66;
  }

  .supplier-page td {
    border-top: 1px solid #eee8df;
    font-size: .88rem;
  }

  .supplier-page .empty,
  .supplier-page .supplier-no-documents {
    border-radius: 1rem;
    border: 1px dashed #d8d1c7;
    background: #f8f5ef;
    padding: 1rem;
    text-align: center;
    font-size: .88rem;
    font-weight: 800;
    color: #746f66;
  }

  .supplier-page .supplier-more-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .supplier-page .supplier-more {
    gap: 0;
  }

  .supplier-page .supplier-more-hero.compact,
  .supplier-page .admin-home-hero.compact {
    position: relative;
    overflow: hidden;
    margin-bottom: .35rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    border-radius: 22px;
    border: 1px solid #27251f;
    border-left: 0;
    background: linear-gradient(135deg, #242622, #1c1d1b);
    color: #fff;
    padding: 1rem;
    box-shadow: 0 18px 40px -24px rgba(0,0,0,.65);
  }

  .supplier-page .supplier-more-hero.compact::before,
  .supplier-page .admin-home-hero.compact::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: .055;
    background-image: radial-gradient(currentColor 1.4px, transparent 1.4px);
    background-size: 16px 16px;
  }

  .supplier-page .supplier-more-hero.compact > *,
  .supplier-page .admin-home-hero.compact > * {
    position: relative;
    z-index: 1;
  }

  .supplier-page .supplier-more-hero.compact h1,
  .supplier-page .admin-home-hero.compact h1 {
    color: #fff;
  }

  .supplier-page .supplier-more-hero.compact p,
  .supplier-page .admin-home-hero.compact p {
    max-width: 42rem;
    color: rgba(255,255,255,.62);
    font-weight: 700;
  }

  .supplier-page .supplier-more-hero.compact .compact-kicker,
  .supplier-page .admin-home-hero.compact .compact-kicker {
    color: #fed7aa;
  }

  .supplier-page .supplier-history-receipt .admin-receipt-metrics[data-count="3"] {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }

  .supplier-page .supplier-history-receipt .admin-receipt-metrics[data-count="3"] .admin-receipt-chip:last-child {
    grid-column: 1 / -1;
  }

  .supplier-page .supplier-history-receipt .admin-receipt-metrics[data-count="3"] .admin-receipt-chip:last-child strong {
    overflow: visible;
    text-overflow: clip;
    white-space: normal;
  }

  .supplier-page .supplier-history-list {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 32rem), 1fr));
    align-items: start;
  }

  .supplier-page .supplier-more-tile {
    min-height: 4.7rem;
    grid-template-columns: 3rem minmax(0,1fr);
    align-items: center;
    gap: .9rem;
    border-radius: 1rem;
    border: 1px solid #e7e5e4;
    background: rgba(255,255,255,.9);
    padding: .9rem 1rem;
    text-align: left;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }

  .supplier-page .supplier-more-tile:hover {
    border-color: #fdba74;
    background: #fff7ed;
  }

  .supplier-page .supplier-more-tile b {
    display: none;
  }

  .supplier-page .supplier-more-tile i,
  .supplier-page .supplier-more-tile small {
    display: none;
  }

  .supplier-page .supplier-more-tile strong {
    min-width: 0;
    font-size: 1.12rem;
    line-height: 1.05;
    color: #78716c;
  }

  .supplier-page .supplier-more-tile > span:first-child {
    display: grid;
    width: 2.5rem;
    height: 2.5rem;
    place-items: center;
    border-radius: .8rem;
    background: #fff0e8;
    color: #c2410c;
  }

  .supplier-page .finance-bars strong,
  .supplier-page .finance-bars span,
  .supplier-page .finance-progress span {
    font-size: .72rem;
    font-weight: 800;
    color: #746f66;
  }

  .supplier-page .finance-bars i,
  .supplier-page .finance-progress b {
    background: #ea580c;
  }

  .supplier-page .finance-mobile-movements {
    display: none;
  }

  .supplier-page .finance-mobile-row {
    display: grid;
    gap: .45rem;
    border-radius: .85rem;
    border: 1px solid #e7e5e4;
    border-left: 2px dashed #d6d3d1;
    background: #fffefa;
    padding: .65rem;
  }

  .supplier-page .finance-mobile-row-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: .55rem;
  }

  .supplier-page .finance-mobile-row h3 {
    margin: 0;
    font-size: .84rem;
    font-weight: 950;
    color: #1c1917;
  }

  .supplier-page .finance-mobile-row time {
    font-size: .68rem;
    font-weight: 800;
    color: #78716c;
  }

  .supplier-page .finance-mobile-row-meta {
    display: grid;
    grid-template-columns: repeat(2,minmax(0,1fr));
    gap: .35rem;
  }

  .supplier-page .finance-mobile-row-meta span {
    border-radius: .55rem;
    background: #f5f1ea;
    padding: .38rem .45rem;
    font-size: .68rem;
    font-weight: 850;
    color: #78716c;
  }

  .supplier-page .finance-mobile-row-meta strong {
    display: block;
    margin-top: .12rem;
    overflow-wrap: anywhere;
    font-size: .82rem;
    line-height: 1;
    font-weight: 950;
    color: #1c1917;
  }

  @media (max-width: 767px) {
    .supplier-page {
      gap: .7rem;
    }

    .supplier-page h1 {
      font-size: 1.38rem;
      line-height: 1.02;
    }

    .supplier-page h2 {
      font-size: 1.04rem;
    }

    .supplier-page p,
    .supplier-page small,
    .supplier-page .page-subtitle {
      font-size: .78rem;
      line-height: 1.25;
    }

    .supplier-page .supplier-heading,
    .supplier-page .app-page-header,
    .supplier-page .admin-receipt {
      border-radius: 16px;
    }

    .supplier-page .supplier-heading,
    .supplier-page .app-page-header {
      align-items: stretch;
      flex-direction: column;
      gap: .55rem;
      padding: .78rem;
    }

    .supplier-page .admin-receipt-head {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: start;
      border-radius: 16px 16px 0 0;
      padding: .64rem .76rem .58rem;
      gap: .42rem;
    }

    .supplier-page .admin-receipt-total {
      margin-top: .14rem;
      gap: .32rem;
      flex-wrap: wrap;
    }

    .supplier-page .admin-receipt-total strong {
      max-width: 100%;
      overflow-wrap: anywhere;
      white-space: normal;
      font-size: clamp(1.42rem, 7.2vw, 1.92rem);
      line-height: .86;
    }

    .supplier-page .admin-receipt-total span {
      max-width: 6rem;
      padding-bottom: .12rem;
      font-size: 8.5px;
      line-height: 1.05;
    }

    .supplier-page .admin-receipt p {
      display: none;
    }

    .supplier-page .admin-receipt:has(.supplier-back-button) {
      margin-top: 1.75rem;
    }

    .supplier-page .admin-receipt-head:has(.supplier-back-button) {
      overflow: visible;
    }

    .supplier-page .admin-receipt-head:has(.supplier-back-button) .admin-receipt-main {
      min-height: 0;
      padding-left: 0;
    }

    .supplier-page .admin-receipt-head .supplier-back-button,
    .supplier-page .app-page-header .supplier-back-button,
    .supplier-page .supplier-heading .supplier-back-button {
      position: absolute;
      top: -1.72rem;
      left: 0;
      z-index: 3;
      width: auto;
      min-width: 0;
      min-height: 1.25rem;
      padding: 0;
      border: 0;
      background: transparent;
      box-shadow: none;
      color: #78716c;
      font-size: .75rem;
      font-weight: 800;
      gap: .25rem;
    }

    .supplier-page .actions,
    .supplier-page .supplier-next-actions,
    .supplier-page .supplier-detail-actions,
    .supplier-page .supplier-history-actions,
    .supplier-page .filter-bar {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      justify-content: stretch;
      gap: .45rem;
    }

    .supplier-page .admin-receipt-actions {
      width: auto;
      max-width: min(100%, 13.5rem);
      display: flex;
      flex-wrap: nowrap;
      justify-self: end;
      align-self: start;
      justify-content: flex-end;
      gap: .35rem;
    }

    .supplier-page .actions > *,
    .supplier-page .supplier-next-actions > *,
    .supplier-page .supplier-detail-actions > *,
    .supplier-page .supplier-history-actions > *,
    .supplier-page .filter-bar > *,
    .supplier-page .btn {
      width: 100%;
      min-width: 0;
    }

    .supplier-page .admin-receipt-actions > *,
    .supplier-page .admin-receipt-actions .btn {
      width: auto;
      min-width: 0;
    }

    .supplier-page .btn {
      min-height: 2.22rem;
      border-radius: .48rem;
      padding-inline: .58rem;
      font-size: .74rem;
      gap: .34rem;
    }

    .supplier-page .admin-filter-menu summary {
      min-height: 2.22rem;
      border-radius: .48rem;
      padding-inline: .58rem;
      font-size: .74rem;
      gap: .34rem;
    }

    .supplier-page .admin-filter-popover {
      left: 0;
      right: auto;
      min-width: min(18rem, calc(100vw - 1.5rem));
    }

    .supplier-page .admin-receipt-actions .btn {
      min-height: 2.05rem;
      padding-inline: .56rem;
      font-size: .7rem;
      gap: .28rem;
      white-space: nowrap;
    }

    .supplier-page input,
    .supplier-page select {
      min-height: 2.25rem;
      border-radius: .52rem;
      padding-inline: .58rem;
      font-size: .8rem;
    }

    .supplier-page .supplier-metrics-grid,
    .supplier-page .finance-metrics,
    .supplier-page .supplier-order-highlights {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: .5rem;
    }

    .supplier-page .admin-receipt-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: .42rem;
      padding: 1.2rem .75rem .75rem;
    }

    .supplier-page .admin-receipt-metrics[data-count="3"] {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }

    .supplier-page .admin-receipt-chip,
    .supplier-page .supplier-metric,
    .supplier-page .finance-metric,
    .supplier-page .supplier-order-highlights > div {
      min-height: 3.55rem;
      gap: .52rem;
      padding: .62rem .68rem;
      border-radius: .375rem 1rem 1rem .375rem;
    }

    .supplier-page .admin-receipt-chip-icon,
    .supplier-page .supplier-data-icon {
      width: 1.9rem;
      height: 1.9rem;
    }

    .supplier-page .admin-receipt-chip strong,
    .supplier-page .supplier-metric strong,
    .supplier-page .finance-metric strong,
    .supplier-page .supplier-order-highlights strong {
      font-size: 1rem;
      line-height: 1;
    }

    .supplier-page .admin-receipt-chip span:last-child,
    .supplier-page .supplier-metric .supplier-data-copy span,
    .supplier-page .finance-metric .supplier-data-copy span,
    .supplier-page .supplier-order-highlights span,
    .supplier-page .compact-kicker,
    .supplier-page .eyebrow {
      font-size: 8.5px;
      line-height: 1.08;
      letter-spacing: .07em;
    }

    .supplier-page .admin-receipt-metrics[data-count="3"] .admin-receipt-chip span:last-child,
    .supplier-page .admin-receipt-metrics[data-count="4"] .admin-receipt-chip span:last-child,
    .supplier-page .admin-receipt-metrics[data-count="5"] .admin-receipt-chip span:last-child {
      font-size: 7.2px;
      line-height: 1.05;
      letter-spacing: .045em;
      -webkit-line-clamp: 2;
    }

    .supplier-page .supplier-next-action,
    .supplier-page .supplier-panel-card,
    .supplier-page .supplier-queue-row,
    .supplier-page .supplier-order-list-item,
    .supplier-page .supplier-order-detail,
    .supplier-page .supplier-origin-card,
    .supplier-page .supplier-history-row,
    .supplier-page .supplier-more-tile,
    .supplier-page .supplier-document-card,
    .supplier-page .finance-card,
    .supplier-page .consolidated-block {
      border-radius: 15px;
      padding: .68rem;
    }

    .supplier-page .supplier-next-action {
      grid-template-columns: 36px minmax(0, 1fr);
      gap: .6rem;
    }

    .supplier-page .supplier-next-actions {
      grid-column: 1 / -1;
    }

    .supplier-page .supplier-next-icon,
    .supplier-page .supplier-more-tile > span:first-child {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: .55rem;
    }

    .supplier-page .supplier-queue-row {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: .5rem;
    }

    .supplier-page .supplier-queue-row > span:nth-child(2) {
      grid-column: 1 / -1;
      order: 3;
    }

    .supplier-page .supplier-queue-row > .badge {
      justify-self: end;
    }

    .supplier-page .supplier-section-heading,
    .supplier-page .supplier-detail-top,
    .supplier-page .supplier-document-title,
    .supplier-page .supplier-document-body,
    .supplier-page .supplier-history-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: .5rem;
    }

    .supplier-page .supplier-order-card-head {
      grid-template-columns: 34px minmax(0, 1fr);
      gap: .55rem;
    }

    .supplier-page .supplier-order-card-icon {
      height: 2.125rem;
      width: 2.125rem;
      border-radius: .7rem;
    }

    .supplier-page .supplier-order-card-actions,
    .supplier-page .supplier-history-actions {
      grid-column: 1 / -1;
    }

    .supplier-page .supplier-history-row .supplier-order-card-icon {
      display: none;
    }

    .supplier-page .supplier-history-row .supplier-order-card-head {
      grid-template-columns: minmax(0, 1fr);
      gap: .45rem;
    }

    .supplier-page .supplier-history-row .supplier-order-title-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: .45rem;
      align-items: start;
    }

    .supplier-page .supplier-history-row .supplier-order-card-title h2 {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: .92rem;
    }

    .supplier-page .supplier-history-row .supplier-order-card-title p {
      display: none;
    }

    .supplier-page .supplier-history-row .supplier-order-card-meta {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .supplier-page .supplier-history-row .supplier-order-card-meta span:nth-child(2),
    .supplier-page .supplier-history-row .supplier-order-card-meta span:nth-child(3) {
      display: none;
    }

    .supplier-page .supplier-history-row .supplier-history-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
    }

    .supplier-page .supplier-document-card .supplier-order-card-head {
      grid-template-columns: minmax(0, 1fr);
      gap: .5rem;
    }

    .supplier-page .supplier-document-card .supplier-order-card-title {
      grid-template-columns: minmax(0, 1fr);
      gap: .35rem;
    }

    .supplier-page .supplier-document-card .supplier-order-card-title h2 {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: .95rem;
      line-height: 1.08;
      overflow-wrap: anywhere;
    }

    .supplier-page .supplier-document-card .supplier-order-card-title p {
      display: none;
    }

    .supplier-page .supplier-document-card .supplier-document-actions {
      grid-column: auto;
    }

    .supplier-page .supplier-document-card .supplier-order-card-meta {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .supplier-page .supplier-document-card .supplier-order-card-meta span:nth-child(3) {
      display: none;
    }

    .supplier-page .supplier-document-card .supplier-no-documents {
      padding: .72rem;
      font-size: .78rem;
    }

    .supplier-page .supplier-order-details-body {
      gap: .5rem;
      padding: .58rem;
    }

    .supplier-page .supplier-order-item-line {
      padding: .48rem .55rem;
      border-radius: .65rem;
    }

    .supplier-page .supplier-order-item-line strong {
      font-size: .82rem;
    }

    .supplier-page .supplier-order-item-line small {
      display: none;
    }

    .supplier-page .supplier-more-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: .42rem;
    }

    .supplier-page .supplier-more-tile {
      min-height: 4.7rem;
      grid-template-columns: 3rem minmax(0, 1fr);
      gap: .9rem;
      padding: .9rem 1rem;
      border-radius: 1rem;
    }

    .supplier-page .supplier-more-tile strong {
      font-size: 1.12rem;
      line-height: 1.05;
    }

    .supplier-page .supplier-more-tile > span:first-child {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: .8rem;
    }

    .supplier-page .supplier-file-row {
      grid-template-columns: 20px minmax(0, 1fr);
    }

    .supplier-page .supplier-file-row small {
      grid-column: 2;
    }

    .supplier-page .supplier-order-card-meta {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .supplier-page .supplier-order-card-actions,
    .supplier-page .supplier-document-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
    }

    .supplier-page .supplier-order-card-actions > *,
    .supplier-page .supplier-document-actions > * {
      width: 100%;
    }

    .supplier-page .table-wrap {
      max-width: 100%;
    }

    .supplier-page .finance-desktop-movements {
      display: none;
    }

    .supplier-page .finance-mobile-movements {
      display: grid;
      gap: .5rem;
    }

    .supplier-page .finance-page .admin-receipt-head {
      grid-template-columns: minmax(0, 1fr);
    }

    .supplier-page .finance-page .admin-receipt-actions {
      width: 100%;
      max-width: none;
      display: grid;
      grid-template-columns: 1fr;
      justify-self: stretch;
    }

    .supplier-page .finance-page .admin-receipt-actions .btn {
      width: 100%;
    }

    .supplier-page .finance-page .admin-receipt-actions .admin-filter-popover,
    .supplier-page .admin-receipt-actions .admin-filter-popover {
      left: auto;
      right: 0;
    }
  }

  @media (min-width: 1024px) {
    .supplier-page .supplier-documents-list {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 34rem), 1fr));
      align-items: start;
    }

    .supplier-page .supplier-document-card {
      gap: .75rem;
      padding: .9rem;
    }

    .supplier-page .supplier-document-card .supplier-order-card-head {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: start;
    }

    .supplier-page .supplier-document-card .supplier-order-card-title h2 {
      display: block;
      max-width: none;
      overflow: visible;
      overflow-wrap: normal;
      word-break: normal;
      font-size: 1rem;
      line-height: 1.16;
    }

    .supplier-page .supplier-document-card .supplier-order-card-title p {
      display: block;
    }

    .supplier-page .supplier-document-card .supplier-document-actions {
      width: auto;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-end;
    }

    .supplier-page .supplier-document-card .supplier-document-actions > * {
      width: auto;
    }

    .supplier-page .supplier-document-card .supplier-order-card-meta {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  @media (min-width: 640px) {
    .supplier-page .supplier-more-grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (min-width: 768px) {
    .supplier-page .supplier-back-button {
      display: none;
    }
  }
`;


export function SupplierReactPage(props) {
  let content;
  if (props.page === "fornecedor-pedidos") content = <Orders {...props} />;
  else if (props.page === "fornecedor-historico") content = <History {...props} />;
  else if (props.page === "fornecedor-mais") content = <More {...props} />;
  else if (props.page === "fornecedor-documentos") content = <Documents {...props} />;
  else if (props.page === "fornecedor-financeiro") content = <Financeiro {...props} />;
  else content = <Dashboard {...props} />;
  return <><style>{supplierPageStyles}</style><div className="supplier-page">{content}</div></>;
}
