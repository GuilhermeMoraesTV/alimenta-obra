import React from "react";
import { Painel } from "./Painel.jsx";
import { Pedidos } from "./Pedidos.jsx";
import { Consolidacao } from "./Consolidacao.jsx";
import { Financeiro } from "./Financeiro.jsx";
import { Relatorios } from "./Relatorios.jsx";
import { Auditoria } from "./Auditoria.jsx";
import { Mais } from "./Mais.jsx";

const adminDesignStyles = `
  .admin-page {
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    display: grid;
    gap: .85rem;
    color: #1c1917;
  }

  .admin-page h1,
  .admin-page h2,
  .admin-page h3,
  .admin-page p { margin: 0; letter-spacing: 0; }

  .admin-page h1 {
    font-size: clamp(1.35rem, 1rem + .9vw, 2rem);
    line-height: .96;
    font-weight: 950;
  }

  .admin-page h2 { font-size: 1.05rem; line-height: 1.1; font-weight: 950; color: #1c1917; }
  .admin-page h3 { font-weight: 950; color: #1c1917; }
  .admin-page p,
  .admin-page small { color: #6f6b63; }

  .admin-page .finance-hero,
  .admin-page .admin-history-hero,
  .admin-page .admin-send-receipt,
  .admin-page .admin-receipt {
    overflow: visible;
    border-radius: 22px;
    border: 1px solid #27251f;
    background: #242622;
    box-shadow: 0 18px 40px -22px rgba(0,0,0,.55);
    isolation: isolate;
  }

  .admin-page .finance-hero-head,
  .admin-page .admin-history-hero > div:first-child,
  .admin-page .admin-send-receipt .admin-send-header,
  .admin-page .admin-receipt-head {
    position: relative;
    border-radius: 22px 22px 0 0;
    background: linear-gradient(135deg, #242622, #1c1d1b);
    color: #fff;
    padding: 1rem;
  }

  .admin-page .finance-hero-head::before,
  .admin-page .admin-history-hero > div:first-child::before,
  .admin-page .admin-send-receipt .admin-send-header::before,
  .admin-page .admin-receipt-head::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: .055;
    background-image: radial-gradient(currentColor 1.4px, transparent 1.4px);
    background-size: 16px 16px;
  }

  .admin-page .finance-hero-head > *,
  .admin-page .admin-history-hero > div:first-child > *,
  .admin-page .admin-send-receipt .admin-send-header > *,
  .admin-page .admin-receipt-head > * {
    position: relative;
    z-index: 1;
  }

  .admin-page .eyebrow,
  .admin-page .compact-kicker,
  .admin-page .stat-label,
  .admin-page .finance-metric span,
  .admin-page .request-card-quantity span {
    display: inline-flex;
    align-items: center;
    gap: .35rem;
    font-size: 10px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: #c2410c;
  }

  .admin-page .app-page-header,
  .admin-page .admin-list-header,
  .admin-page .admin-send-header,
  .admin-page .admin-home-hero,
  .admin-page .admin-home-hero.compact {
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

  .admin-page .app-page-header::before,
  .admin-page .admin-list-header::before,
  .admin-page .admin-send-header::before,
  .admin-page .admin-home-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: .055;
    background-image: radial-gradient(currentColor 1.4px, transparent 1.4px);
    background-size: 16px 16px;
  }

  .admin-page .app-page-header > *,
  .admin-page .admin-list-header > *,
  .admin-page .admin-send-header > *,
  .admin-page .admin-home-hero > * { position: relative; z-index: 1; }

  .admin-page .app-page-header h1,
  .admin-page .admin-list-header h1,
  .admin-page .admin-send-header h1,
  .admin-page .admin-home-hero h1,
  .admin-page .finance-hero h1,
  .admin-page .admin-history-hero h1,
  .admin-page .admin-receipt h1 { color: #fff; }

  .admin-page .app-page-header p,
  .admin-page .app-page-header .page-subtitle,
  .admin-page .admin-list-header p,
  .admin-page .admin-send-header p,
  .admin-page .admin-home-hero p,
  .admin-page .finance-hero p,
  .admin-page .admin-history-hero p,
  .admin-page .admin-receipt p {
    max-width: 42rem;
    color: rgba(255,255,255,.62);
    font-weight: 700;
  }

  .admin-page .app-page-header .eyebrow,
  .admin-page .admin-list-header .compact-kicker,
  .admin-page .admin-send-header .compact-kicker,
  .admin-page .admin-home-hero .compact-kicker,
  .admin-page .finance-hero .compact-kicker,
  .admin-page .admin-history-hero .compact-kicker,
  .admin-page .admin-receipt .compact-kicker { color: #fed7aa; }

  .admin-page .actions,
  .admin-page .button-row,
  .admin-page .admin-list-actions,
  .admin-page .admin-send-actions,
  .admin-page .finance-hero-actions,
  .admin-page .admin-history-actions,
  .admin-page .admin-receipt-actions,
  .admin-page .request-card-actions,
  .admin-page .week-nav {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: .5rem;
  }

  .admin-page .btn,
  .admin-page .icon-action,
  .admin-page .admin-back-button,
  .admin-page .admin-filter-menu summary,
  .admin-page .export-options button {
    display: inline-flex;
    min-height: 2.55rem;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    border-radius: .55rem;
    border: 1px solid transparent;
    padding: 0 .9rem;
    font-size: .84rem;
    font-weight: 900;
    color: #1c1917;
    transition: transform .18s ease, border-color .18s ease, background .18s ease, color .18s ease, box-shadow .18s ease;
  }

  .admin-page .btn:hover,
  .admin-page .icon-action:hover,
  .admin-page .admin-back-button:hover,
  .admin-page .admin-filter-menu summary:hover,
  .admin-page .export-options button:hover {
    transform: translateY(-1px);
  }

  .admin-page .btn.primary {
    border-color: #ea580c;
    background: #ea580c;
    color: #fff;
    box-shadow: 0 10px 22px rgba(239,91,29,.22);
  }

  .admin-page .btn.primary:hover { background: #c2410c; }

  .admin-page .btn.outline,
  .admin-page .icon-action,
  .admin-page .admin-back-button,
  .admin-page .admin-filter-menu summary {
    border-color: #ddd8cf;
    background: #fffefa;
    color: #1c1917;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }

  .admin-page .app-page-header .btn.outline,
  .admin-page .app-page-header .admin-back-button,
  .admin-page .app-page-header .admin-filter-menu summary,
  .admin-page .admin-list-header .btn.outline,
  .admin-page .admin-list-header .admin-filter-menu summary,
  .admin-page .admin-send-header .btn.outline,
  .admin-page .admin-send-header .admin-filter-menu summary,
  .admin-page .finance-hero .btn.outline,
  .admin-page .finance-hero .admin-back-button,
  .admin-page .finance-hero .admin-filter-menu summary,
  .admin-page .admin-history-hero .btn.outline,
  .admin-page .admin-history-hero .admin-filter-menu summary,
  .admin-page .admin-receipt .btn.outline,
  .admin-page .admin-receipt .admin-filter-menu summary {
    border-color: rgba(255,255,255,.16);
    background: rgba(255,255,255,.1);
    color: #fff;
  }

  .admin-page .btn.danger,
  .admin-page .icon-action.danger {
    border-color: #fecaca;
    background: #fff1f1;
    color: #b91c1c;
  }

  .admin-page .btn.small,
  .admin-page .icon-action {
    min-height: 2.25rem;
    padding-inline: .72rem;
    font-size: .76rem;
  }

  .admin-page input,
  .admin-page select,
  .admin-page textarea {
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

  .admin-page textarea {
    min-height: 6rem;
    padding-block: .65rem;
  }

  .admin-page input:focus,
  .admin-page select:focus,
  .admin-page textarea:focus {
    border-color: #ea580c;
    box-shadow: 0 0 0 4px rgba(234,88,12,.13);
  }

  .admin-page .admin-filter-menu,
  .admin-page .export-menu { position: relative; }

  .admin-page .admin-filter-popover,
  .admin-page .export-options {
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

  .admin-page .export-options { min-width: 11rem; }

  .admin-page .stat-card,
  .admin-page .insight-panel,
  .admin-page .admin-live-panel,
  .admin-page .table-panel,
  .admin-page .admin-request-card,
  .admin-page .data-panel,
  .admin-page .timeline-panel,
  .admin-page .finance-metric,
  .admin-page .finance-card,
  .admin-page .audit-panel,
  .admin-page .admin-more-tile,
  .admin-page .weekly-consumption-card {
    border-radius: 18px;
    border: 1px solid #ded9d1;
    background: rgba(255,254,250,.94);
    box-shadow: 0 12px 30px rgba(25,27,24,.055);
  }

  .admin-page .stat-card,
  .admin-page .insight-panel,
  .admin-page .admin-live-panel,
  .admin-page .table-panel,
  .admin-page .data-panel,
  .admin-page .timeline-panel,
  .admin-page .finance-metric,
  .admin-page .finance-card,
  .admin-page .audit-panel,
  .admin-page .weekly-consumption-card { padding: 1rem; }

  .admin-page .stat-card.accent,
  .admin-page .finance-metric.accent {
    border-color: #ea580c;
    background: #ea580c;
    color: #fff;
  }

  .admin-page .stat-card.accent .stat-label,
  .admin-page .stat-card.accent .stat-sub,
  .admin-page .finance-metric.accent span,
  .admin-page .finance-metric.accent small { color: rgba(255,255,255,.74); }

  .admin-page .admin-send-summary,
  .admin-page .admin-pedidos-summary,
  .admin-page .finance-metrics-strip,
  .admin-page .admin-receipt-metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: .5rem;
    border-radius: 0 0 20px 20px;
    background: #f5f1ea;
    padding: 1.18rem 1rem .85rem;
  }

  .admin-page .finance-metrics-strip {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .admin-page .admin-receipt-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: .65rem;
    padding: .82rem 1rem .78rem;
  }

  .admin-page .admin-receipt-main {
    min-width: 0;
  }

  .admin-page .admin-receipt-total {
    margin-top: .28rem;
    display: flex;
    align-items: end;
    gap: .45rem;
    color: #fff;
  }

  .admin-page .admin-receipt-total strong {
    font-size: clamp(2rem, 1.5rem + 2vw, 3.15rem);
    line-height: .82;
    font-weight: 950;
  }

  .admin-page .admin-receipt-total span {
    max-width: 7.5rem;
    padding-bottom: .28rem;
    color: rgba(255,255,255,.58);
    font-size: 9px;
    font-weight: 950;
    line-height: 1.12;
    text-transform: uppercase;
    letter-spacing: .1em;
  }

  .admin-page .admin-receipt-holes {
    pointer-events: none;
    display: flex;
    justify-content: space-around;
    padding: 0 1rem;
    transform: translateY(50%);
  }

  .admin-page .admin-receipt-holes span {
    width: .65rem;
    height: .65rem;
    border-radius: 999px;
    background: #fffefa;
  }

  .admin-page .admin-receipt-metrics {
    grid-template-columns: repeat(var(--receipt-metric-count), minmax(0, 1fr));
  }

  .admin-page .admin-send-chip,
  .admin-page .admin-history-chip,
  .admin-page .finance-metrics-strip .finance-metric,
  .admin-page .admin-receipt-chip {
    border-radius: 0 1rem 1rem .375rem;
    border: 1px solid #ded9d1;
    border-left: 2px dashed #d6d3d1;
    background: #fffefa;
    padding: .78rem;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }

  .admin-page .admin-receipt-chip {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: .65rem;
  }

  .admin-page .admin-receipt-chip-icon {
    display: grid;
    width: 1.85rem;
    height: 1.85rem;
    flex-shrink: 0;
    place-items: center;
    border-radius: 999px;
    background: #fff0e8;
    color: #c2410c;
  }

  .admin-page .admin-receipt-chip-text {
    min-width: 0;
    line-height: 1;
  }

  .admin-page .admin-receipt-chip strong {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1rem;
    line-height: 1;
    font-weight: 950;
    color: #1c1917;
  }

  .admin-page .admin-receipt-chip span:last-child {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 9px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: #78716c;
  }

  .admin-page .stat-value,
  .admin-page .finance-metric strong {
    margin-top: .25rem;
    font-size: clamp(1.55rem, 1.1rem + 1vw, 2.15rem);
    line-height: 1;
    font-weight: 950;
  }

  .admin-page .badge {
    display: inline-flex;
    min-height: 1.75rem;
    align-items: center;
    border-radius: 999px;
    border: 1px solid #e4ded4;
    background: #f5f1ea;
    padding: 0 .62rem;
    font-size: 10.5px;
    font-weight: 950;
    text-transform: uppercase;
    color: #57534e;
  }

  .admin-page .badge.enviado { border-color: #fed7aa; background: #fff7ed; color: #c2410c; }
  .admin-page .badge.entregue { border-color: #a7f3d0; background: #ecfdf5; color: #047857; }
  .admin-page .badge.cancelado { border-color: #fecaca; background: #fef2f2; color: #b91c1c; }
  .admin-page .badge.confirmado { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
  .admin-page .badge.producao { border-color: #fde68a; background: #fffbeb; color: #b45309; }
  .admin-page .badge.saiu_entrega { border-color: #bae6fd; background: #f0f9ff; color: #0369a1; }

  .admin-page .request-meal-icon {
    border-radius: .8rem;
    border: 1px dashed #fdba74;
    background: #fff7ed;
    color: #c2410c;
  }

  .admin-page .table-wrap {
    overflow-x: auto;
    border-radius: .9rem;
    border: 1px solid #e4ded4;
    background: #fffefa;
  }

  .admin-page table {
    width: 100%;
    border-collapse: collapse;
  }

  .admin-page th {
    background: #f6f1ea;
    padding: .78rem;
    text-align: left;
    font-size: 10px;
    font-weight: 950;
    text-transform: uppercase;
    color: #746f66;
  }

  .admin-page td {
    border-top: 1px solid #eee8df;
    padding: .78rem;
    font-size: .88rem;
  }

  .admin-page .empty {
    border-radius: 1rem;
    border: 1px dashed #d8d1c7;
    background: #f8f5ef;
    padding: 1rem;
    text-align: center;
    font-size: .88rem;
    font-weight: 800;
    color: #746f66;
  }

  .admin-page .admin-request-list {
    display: grid;
    gap: .65rem;
  }

  .admin-page .admin-request-shell {
    display: grid;
    gap: .35rem;
    min-width: 0;
  }

  .admin-page .admin-request-owner,
  .admin-page .admin-live-owner {
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
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: #78716c;
  }

  .admin-page .admin-request-owner strong,
  .admin-page .admin-live-owner strong {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #1c1917;
  }

  .admin-page .legacy-request-table {
    display: none;
  }

  .admin-page .section-title {
    margin-bottom: .75rem;
    font-size: 1rem;
    font-weight: 950;
    color: #1c1917;
  }

  .admin-page .admin-more-tile {
    min-height: 8rem;
    display: grid;
    gap: .45rem;
    padding: 1rem;
    text-align: left;
  }

  .admin-page .admin-more-tile span:first-child {
    display: grid;
    width: 2.5rem;
    height: 2.5rem;
    place-items: center;
    border-radius: .8rem;
    background: #fff0e8;
    color: #c2410c;
  }

  @media (max-width: 767px) {
    .admin-page {
      gap: .55rem;
    }

    .admin-page h1 {
      font-size: 1.22rem;
      line-height: 1.02;
    }

    .admin-page h2 {
      font-size: .96rem;
    }

    .admin-page p,
    .admin-page small,
    .admin-page .page-subtitle {
      font-size: .72rem;
      line-height: 1.25;
    }

    .admin-page .app-page-header,
    .admin-page .admin-list-header,
    .admin-page .admin-send-header,
    .admin-page .admin-home-hero,
    .admin-page .admin-home-hero.compact {
      align-items: stretch;
      flex-direction: column;
      border-radius: 16px;
      gap: .55rem;
      padding: .68rem;
    }

    .admin-page .finance-hero,
    .admin-page .admin-history-hero,
    .admin-page .admin-send-receipt,
    .admin-page .admin-receipt {
      border-radius: 16px;
    }

    .admin-page .finance-hero-head,
    .admin-page .admin-history-hero > div:first-child,
    .admin-page .admin-send-receipt .admin-send-header,
    .admin-page .admin-receipt-head {
      border-radius: 16px 16px 0 0;
      padding: .5rem .62rem .46rem;
      gap: .42rem;
    }

    .admin-page .admin-receipt-head {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: start;
    }

    .admin-page .admin-receipt-total {
      margin-top: .14rem;
      gap: .32rem;
    }

    .admin-page .admin-receipt-total strong {
      font-size: 1.56rem;
      line-height: .86;
    }

    .admin-page .admin-receipt-total span {
      max-width: 6rem;
      padding-bottom: .12rem;
      font-size: 7.5px;
      line-height: 1.05;
    }

    .admin-page .admin-receipt p {
      display: none;
    }

    .admin-page .admin-receipt:has(.admin-back-button) {
      margin-top: 1.75rem;
    }

    .admin-page .admin-receipt-head:has(.admin-back-button) {
      overflow: visible;
    }

    .admin-page .admin-receipt-head:has(.admin-back-button) .admin-receipt-main {
      min-height: 0;
      padding-left: 0;
    }

    .admin-page .admin-receipt-head:has(.admin-back-button) .admin-receipt-actions {
      position: static;
    }

    .admin-page .admin-receipt-head .admin-back-button {
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

    .admin-page .admin-receipt-actions {
      width: auto;
      max-width: min(100%, 13.5rem);
      display: flex;
      flex-wrap: nowrap;
      justify-self: end;
      align-self: start;
      justify-content: flex-end;
      gap: .35rem;
    }

    .admin-page .admin-receipt-actions > *,
    .admin-page .admin-receipt-actions .btn,
    .admin-page .admin-receipt-actions .admin-filter-menu summary {
      width: auto;
      min-width: 0;
    }

    .admin-page .admin-receipt-actions .btn,
    .admin-page .admin-receipt-actions .admin-filter-menu summary {
      min-height: 1.9rem;
      padding-inline: .5rem;
      font-size: .66rem;
      gap: .28rem;
      white-space: nowrap;
    }

    .admin-page .admin-receipt-actions .btn.primary {
      padding-inline: .68rem;
    }

    .admin-page .admin-home-receipt .admin-receipt-actions {
      max-width: 10.5rem;
    }

    .admin-page .admin-send-total {
      margin-top: .22rem;
      gap: .4rem;
    }

    .admin-page .admin-send-total strong,
    .admin-page .admin-history-hero [class*="text-[46px]"] {
      font-size: 2.05rem;
    }

    .admin-page .admin-send-total span {
      max-width: 7rem;
      font-size: 8.5px;
      line-height: 1.08;
    }

    .admin-page .actions,
    .admin-page .admin-list-actions,
    .admin-page .admin-send-actions,
    .admin-page .finance-hero-actions,
    .admin-page .admin-history-actions,
    .admin-page .week-nav {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      justify-content: stretch;
      gap: .45rem;
    }

    .admin-page .actions > *,
    .admin-page .admin-list-actions > *,
    .admin-page .admin-send-actions > *,
    .admin-page .finance-hero-actions > *,
    .admin-page .admin-history-actions > *,
    .admin-page .week-nav > *,
    .admin-page .btn,
    .admin-page .icon-action,
    .admin-page .admin-back-button,
    .admin-page .admin-filter-menu summary {
      width: 100%;
      min-width: 0;
    }

    .admin-page .btn,
    .admin-page .icon-action,
    .admin-page .admin-back-button,
    .admin-page .admin-filter-menu summary,
    .admin-page .export-options button {
      min-height: 2.08rem;
      border-radius: .48rem;
      padding-inline: .58rem;
      font-size: .7rem;
      gap: .34rem;
    }

    .admin-page .admin-receipt-head .admin-back-button {
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

    .admin-page input,
    .admin-page select,
    .admin-page textarea {
      min-height: 2.12rem;
      border-radius: .52rem;
      padding-inline: .58rem;
      font-size: .75rem;
    }

    .admin-page .admin-filter-popover,
    .admin-page .export-options {
      left: 0;
      right: auto;
      min-width: min(18rem, calc(100vw - 1.5rem));
    }

    .admin-page .admin-receipt-actions .admin-filter-popover,
    .admin-page .admin-receipt-actions .export-options {
      left: auto;
      right: 0;
    }

    .admin-page .stats-grid,
    .admin-page .finance-metrics,
    .admin-page .report-metrics-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: .5rem;
    }

    .admin-page .admin-send-summary,
    .admin-page .admin-pedidos-summary,
    .admin-page .finance-metrics-strip,
    .admin-page .admin-receipt-metrics {
      gap: .42rem;
      padding: .95rem .55rem .55rem;
    }

    .admin-page .admin-receipt-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    .admin-page .admin-receipt-metrics[data-count="3"] .admin-receipt-chip:last-child,
    .admin-page .admin-receipt-metrics[data-count="5"] .admin-receipt-chip:last-child {
      grid-column: 1 / -1;
    }

    .admin-page .admin-send-summary {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .admin-page .admin-send-chip,
    .admin-page .admin-history-chip,
    .admin-page .finance-metrics-strip .finance-metric,
    .admin-page .admin-receipt-chip {
      gap: .38rem;
      padding: .52rem .58rem;
      border-radius: 0 .62rem .62rem .24rem;
    }

    .admin-page .admin-receipt-chip-icon {
      display: none;
    }

    .admin-page .admin-send-chip-icon,
    .admin-page .admin-history-chip-icon {
      width: 1.2rem;
      height: 1.2rem;
    }

    .admin-page .admin-send-chip strong,
    .admin-page .admin-history-chip strong,
    .admin-page .finance-metric strong {
      font-size: .76rem;
      line-height: 1;
    }

    .admin-page .admin-receipt-chip strong {
      font-size: .98rem;
      line-height: 1;
    }

    .admin-page .admin-send-chip span:last-child,
    .admin-page .admin-history-chip span:last-child,
    .admin-page .finance-metric span,
    .admin-page .compact-kicker,
    .admin-page .eyebrow {
      font-size: 8.5px;
      letter-spacing: .045em;
    }

    .admin-page .admin-receipt-chip span:last-child {
      font-size: 8px;
      line-height: 1.08;
      letter-spacing: .045em;
      white-space: normal;
    }

    .admin-page .admin-receipt-metrics[data-count="4"] .admin-receipt-chip,
    .admin-page .admin-receipt-metrics[data-count="5"] .admin-receipt-chip {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      text-align: left;
    }

    .admin-page .admin-more-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: .42rem;
    }

    .admin-page .admin-more-tile {
      min-height: 4.45rem;
      gap: .18rem;
      padding: .55rem;
      border-radius: .75rem;
    }

    .admin-page .admin-more-tile span:first-child {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: .55rem;
    }

    .admin-page .admin-more-tile strong {
      font-size: .82rem;
      line-height: 1;
    }

    .admin-page .admin-more-tile b {
      font-size: .72rem;
      line-height: 1.05;
    }

    .admin-page .admin-more-tile small {
      display: none;
    }

    .admin-page .stat-card,
    .admin-page .finance-metric,
    .admin-page .table-panel,
    .admin-page .data-panel,
    .admin-page .timeline-panel,
    .admin-page .finance-card,
    .admin-page .audit-panel,
    .admin-page .insight-panel,
    .admin-page .admin-live-panel,
    .admin-page .admin-request-card {
      border-radius: 15px;
      padding: .68rem;
    }

    .admin-page .admin-request-main,
    .admin-page .admin-priority-main,
    .admin-page .admin-live-order {
      grid-template-columns: 36px minmax(0,1fr) auto;
      gap: .6rem;
    }

    .admin-page .admin-request-card footer,
    .admin-page .admin-priority-actions {
      display: grid;
      grid-template-columns: 1fr;
      gap: .45rem;
    }

    .admin-page .table-wrap {
      max-width: 100%;
    }
  }

  @media (min-width: 1024px) {
    .admin-page .admin-request-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 768px) {
    .admin-page .admin-back-button { display: none; }
  }
`;

export function AdminReactPage(props) {
  let content;
  if (props.page === "painel") content = <Painel {...props} />;
  else if (props.page === "pedidos") content = <Pedidos {...props} />;
  else if (props.page === "consolidacao") content = <Consolidacao {...props} />;
  else if (props.page === "financeiro") content = <Financeiro {...props} />;
  else if (props.page === "relatorios") content = <Relatorios {...props} />;
  else if (props.page === "auditoria") content = <Auditoria {...props} />;
  else content = <Mais {...props} />;

  return (
    <>
      <div className="admin-page">{content}</div>
      <style>{adminDesignStyles}</style>
    </>
  );
}
