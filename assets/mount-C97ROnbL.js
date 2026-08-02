import{a as e,i as t,n,r,t as i}from"./jsx-runtime-CZ6FoN0z.js";import{a,c as o,i as s,l as c}from"./index-BxHmFsnj.js";import{l,r as u,t as d}from"./RequestCard-CUNEklkB.js";var f=r(),p=n(),m=e(t(),1),h=i();function g({icon:e,name:t,size:n=16}){return(0,h.jsx)(`span`,{dangerouslySetInnerHTML:{__html:e(t,n)}})}function _({icon:e,iconName:t,label:n,value:r}){return(0,h.jsxs)(`div`,{className:`admin-receipt-chip${String(r).length>10?` is-long-value`:``}`,children:[(0,h.jsx)(`span`,{className:`admin-receipt-chip-icon`,children:(0,h.jsx)(g,{icon:e,name:t,size:15})}),(0,h.jsxs)(`div`,{className:`admin-receipt-chip-text`,children:[(0,h.jsx)(`strong`,{children:r}),(0,h.jsx)(`span`,{children:n})]})]})}function v({actions:e,className:t=``,description:n,kicker:r,metrics:i=[],title:a,totalLabel:o,totalValue:s}){let c=Math.max(i.length,1);return(0,h.jsxs)(`div`,{className:`admin-receipt ${t}`.trim(),children:[(0,h.jsxs)(`header`,{className:`admin-receipt-head`,children:[(0,h.jsxs)(`div`,{className:`admin-receipt-main`,children:[(0,h.jsx)(`span`,{className:`compact-kicker`,children:r}),(0,h.jsx)(`h1`,{children:a}),s===void 0?null:(0,h.jsxs)(`div`,{className:`admin-receipt-total`,children:[(0,h.jsx)(`strong`,{children:s}),(0,h.jsx)(`span`,{children:o})]}),n?(0,h.jsx)(`p`,{children:n}):null]}),e?(0,h.jsx)(`div`,{className:`admin-receipt-actions`,children:e}):null]}),(0,h.jsx)(`div`,{className:`admin-receipt-holes`,children:Array.from({length:14}).map((e,t)=>(0,h.jsx)(`span`,{},t))}),(0,h.jsx)(`div`,{className:`admin-receipt-metrics`,"data-count":c,style:{"--receipt-metric-count":c},children:i.map(e=>(0,m.createElement)(_,{...e,key:`${e.label}-${e.value}`}))})]})}function y({icon:e}){return(0,h.jsxs)(`button`,{className:`admin-back-button`,"data-view":`mais`,"aria-label":`Voltar para mais ferramentas`,children:[(0,h.jsx)(g,{icon:e,name:`arrow-left`,size:15}),(0,h.jsx)(`span`,{children:`Voltar`})]})}function b({exportMenuOpen:e,icon:t,id:n,items:r}){return(0,h.jsxs)(`div`,{className:`export-menu ${e===n?`open`:``}`,children:[(0,h.jsxs)(`button`,{className:`btn outline small`,type:`button`,"data-export-toggle":n,children:[(0,h.jsx)(g,{icon:t,name:`clipboard`,size:14}),`Exportar`]}),e===n?(0,h.jsx)(`div`,{className:`export-options`,children:r.map(([e,n,r])=>(0,h.jsxs)(`button`,{type:`button`,"data-export":e,children:[(0,h.jsx)(g,{icon:t,name:r,size:14}),n]},e))}):null]})}function x({children:e,icon:t,label:n=`Filtros`}){return(0,h.jsxs)(`details`,{className:`admin-filter-menu`,children:[(0,h.jsxs)(`summary`,{"aria-label":n,children:[(0,h.jsx)(g,{icon:t,name:`filter`,size:15}),(0,h.jsx)(`span`,{children:n})]}),(0,h.jsx)(`div`,{className:`admin-filter-popover`,children:e})]})}function S(e,t){return e[t]??t}function C(e,t){return e.users.find(e=>e.id===t)?.name??`Usuário`}function w(e,t){return e.requests.filter(e=>e.date===t)}function T(e,t=0){let n=new Date(`${e}T12:00:00`),r=n.getDay(),i=r===0?-6:1-r;return n.setDate(n.getDate()+i+t*7),n.setHours(12,0,0,0),n}function E({canEditRequest:e,request:t,state:n}){return e(n,t)?(0,h.jsxs)(`div`,{className:`button-row`,children:[(0,h.jsx)(`button`,{className:`btn outline small`,"data-edit-request":t.id,children:`Editar`}),(0,h.jsx)(`button`,{className:`btn danger small`,"data-cancel-request":t.id,children:`Cancelar`})]}):(0,h.jsx)(`span`,{className:`page-subtitle`,children:`Bloqueado`})}function D({canEditRequest:e,formatDate:t,formatDateTime:n,rows:r,showLeader:i=!1,editable:a=!1,state:o,STATUS_LABEL:s,...c}){return r.length?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(`div`,{className:`admin-request-list`,children:r.map(r=>(0,h.jsxs)(`article`,{className:`admin-request-shell`,children:[i?(0,h.jsxs)(`div`,{className:`admin-request-owner`,children:[`Encarregado `,(0,h.jsx)(`strong`,{children:C(o,r.leaderId)})]}):null,(0,h.jsx)(d,{...c,canEditRequest:a?e:()=>!1,formatDate:t,formatDateTime:n,request:r,state:o,STATUS_LABEL:s,compact:!a})]},r.id))}),(0,h.jsx)(`div`,{className:`table-wrap legacy-request-table`,children:(0,h.jsxs)(`table`,{children:[(0,h.jsx)(`thead`,{children:(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`th`,{children:`Data`}),i?(0,h.jsx)(`th`,{children:`Encarregado`}):null,(0,h.jsx)(`th`,{children:`Tipo`}),(0,h.jsx)(`th`,{children:`Local`}),(0,h.jsx)(`th`,{children:`Qtd`}),(0,h.jsx)(`th`,{children:`Status`}),(0,h.jsx)(`th`,{children:`Atualização`}),a?(0,h.jsx)(`th`,{children:`Ações`}):null]})}),(0,h.jsx)(`tbody`,{children:r.map(r=>(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`td`,{children:t(r.date)}),i?(0,h.jsx)(`td`,{children:(0,h.jsx)(`strong`,{children:C(o,r.leaderId)})}):null,(0,h.jsx)(`td`,{children:r.mealType}),(0,h.jsx)(`td`,{children:r.location}),(0,h.jsx)(`td`,{children:(0,h.jsx)(`strong`,{children:r.quantity})}),(0,h.jsx)(`td`,{children:(0,h.jsx)(`span`,{className:`badge ${r.status}`,children:S(s,r.status)})}),(0,h.jsx)(`td`,{children:n(r.updatedAt)}),a?(0,h.jsx)(`td`,{children:(0,h.jsx)(E,{canEditRequest:e,request:r,state:o})}):null]},r.id))})]})})]}):(0,h.jsx)(`div`,{className:`empty`,children:`Nenhum pedido encontrado.`})}function O(e,t=`Outro`){return e===`marmita`?`Marmita`:e===`buffet`?`Buffer`:e===`janta`?`Janta`:t}function k(e,t){return t.mealCategory===`marmita`?c(e,t):t.sectionName||t.location||c(e,t)}function ee(e){let t={marmita:0,buffet:1,janta:2,outro:3};return Object.values(e.reduce((e,t)=>{let n=t.mealCategory||t.mealType||`outro`;return e[n]??={key:n,label:O(t.mealCategory,t.mealType),total:0,rows:[]},e[n].total+=Number(t.quantity??0),e[n].rows.push(t),e},{})).sort((e,n)=>(t[e.key]??9)-(t[n.key]??9))}function A(e){return e&&new Date(e).getTime()||0}function j(e){return Math.max(A(e?.updatedAt),A(e?.sentAt),A(e?.createdAt))}function M(e){return{saiu_entrega:3,producao:2,confirmado:1}[e.status]??0}var N=`
  .admin-page .daily-block-list { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); justify-items: center; align-items: start; gap: .75rem; }
  .admin-page .daily-block-card { display: grid; grid-template-rows: auto minmax(0,1fr) auto; width: 100%; max-width: 27rem; max-height: 36rem; min-width: 0; overflow: hidden; border-radius: 14px; border: 1px solid #e7e5e4; border-left: 2px dashed #d6d3d1; background: #fffefa; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .daily-block-head { display: grid; gap: .45rem; border-bottom: 1px solid #f5f5f4; padding: .65rem .7rem; }
  .admin-page .daily-block-head-main { display: grid; align-items: start; gap: .6rem; }
  .admin-page .daily-block-head h2 { font-size: .95rem; line-height: 1; color: #1c1917; }
  .admin-page .daily-block-head p { color: #78716c; font-size: .68rem; font-weight: 800; }
  .admin-page .daily-block-body { display: grid; gap: .45rem; max-height: 19rem; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: .6rem .7rem; scrollbar-width: thin; scrollbar-color: #d6d3d1 transparent; }
  .admin-page .daily-block-body::-webkit-scrollbar { width: 7px; }
  .admin-page .daily-block-body::-webkit-scrollbar-thumb { border-radius: 999px; background: #d6d3d1; }
  .admin-page .daily-meal-block { display: grid; gap: .35rem; border-radius: .75rem; border: 1px solid #eee8df; background: #fff; padding: .55rem; }
  .admin-page .daily-meal-title { display: flex; align-items: center; justify-content: space-between; gap: .6rem; color: #1c1917; }
  .admin-page .daily-meal-title strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .82rem; font-weight: 950; }
  .admin-page .daily-meal-title span { border-radius: 999px; background: #fff7ed; padding: .18rem .48rem; color: #c2410c; font-size: .75rem; font-weight: 950; }
  .admin-page .daily-cancelled-block { display: grid; gap: .35rem; border-radius: .75rem; border: 1px solid #fecaca; background: #fef2f2; padding: .55rem; }
  .admin-page .daily-cancelled-title { display: flex; align-items: center; justify-content: space-between; gap: .6rem; color: #991b1b; }
  .admin-page .daily-cancelled-title strong { font-size: .78rem; font-weight: 950; text-transform: uppercase; }
  .admin-page .daily-cancelled-title span { border-radius: 999px; background: #fff; padding: .16rem .46rem; color: #991b1b; font-size: .72rem; font-weight: 950; }
  .admin-page .daily-request-row { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: center; gap: .55rem; border-radius: .55rem; background: #fafaf9; padding: .42rem .5rem; }
  .admin-page .daily-request-row.is-cancelled { background: #fff; opacity: .92; }
  .admin-page .daily-request-title { min-width: 0; }
  .admin-page .daily-request-title strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .8rem; color: #1c1917; }
  .admin-page .daily-request-title small { display: block; margin-top: .1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #78716c; font-size: .64rem; font-weight: 800; }
  .admin-page .daily-request-side { display: flex; align-items: center; justify-content: flex-end; gap: .32rem; }
  .admin-page .daily-request-qty { min-width: 2.35rem; text-align: right; }
  .admin-page .daily-request-qty strong { display: block; font-size: .95rem; line-height: 1; font-weight: 950; color: #1c1917; }
  .admin-page .daily-request-qty small { font-size: 9px; font-weight: 900; color: #78716c; text-transform: uppercase; }
  .admin-page .daily-request-actions { display: flex; gap: .2rem; }
  .admin-page .daily-request-actions .btn { min-height: 1.85rem; width: 1.85rem; padding: 0; }
  .admin-page .daily-request-actions .daily-action-label { display: none; }
  .admin-page .daily-block-footer { display: grid; gap: .42rem; border-top: 1px solid #f5f5f4; padding: .58rem .7rem .68rem; }
  .admin-page .daily-final-summary { display: flex; flex-wrap: wrap; gap: .35rem; }
  .admin-page .daily-final-row { display: inline-flex; align-items: center; gap: .32rem; border-radius: 999px; border: 1px solid #fed7aa; background: #fff7ed; color: #c2410c; font-size: .7rem; font-weight: 950; }
  .admin-page .daily-final-row + .daily-final-row { border-top: 0; }
  .admin-page .daily-final-row span,
  .admin-page .daily-final-row strong { min-width: 0; padding: .24rem .42rem; }
  .admin-page .daily-final-row span { text-align: left; }
  .admin-page .daily-final-row strong { padding-left: 0; }
  .admin-page .daily-total-line { display: flex; align-items: center; justify-content: space-between; gap: .6rem; font-size: .78rem; font-weight: 950; color: #1c1917; }
  .admin-page .daily-block-footer .btn.primary { width: 100%; min-height: 2.1rem; }
  .admin-page .daily-status-line { display: flex; align-items: center; justify-content: space-between; gap: .5rem; border-radius: .65rem; background: #fafaf9; padding: .48rem .58rem; }
  .admin-page .daily-status-line span:first-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .72rem; font-weight: 900; color: #57534e; }
  .admin-page .daily-cancel-note { display: flex; align-items: center; justify-content: space-between; gap: .55rem; border-radius: .65rem; border: 1px solid #fecaca; background: #fef2f2; padding: .5rem .58rem; color: #991b1b; font-size: .72rem; font-weight: 900; }
  .admin-page .daily-cancel-note strong { color: #7f1d1d; }
  @media (max-width: 767px) {
    .admin-page .daily-block-list { grid-template-columns: 1fr; }
    .admin-page .daily-request-row { grid-template-columns: minmax(0,1fr) auto; }
  }
  @media (min-width: 768px) and (max-width: 1180px) {
    .admin-page .daily-block-list { grid-template-columns: repeat(2,minmax(0,1fr)); }
  }
`;function P(e){return Object.entries(e.reduce((e,t)=>(e[t.date]??=[],e[t.date].push(t),e),{})).sort(([e],[t])=>t.localeCompare(e))}function F(e){let{canEditRequest:t,formatDate:n,icon:r,requests:i,state:s,STATUS_LABEL:c}=e,l=i[0]?.date??``,u=(s.consolidations??[]).filter(e=>e.date===l&&e.status!==`rascunho`),d=u.find(e=>[`rascunho`,`enviado`].includes(e.status))??u[0],f=i.filter(e=>e.status!==`cancelado`),p=i.filter(e=>e.status===`cancelado`),m=f.filter(e=>e.status===`enviado`),_=new Set(u.flatMap(e=>e.requestIds??[])),v=Math.max(...u.map(e=>A(e.sentAt)),0),y=m.filter(e=>_.has(e.id)?!1:v?Math.max(A(e.updatedAt),A(e.createdAt))>v:!0),b=y.length?y:f,x=b.reduce((e,t)=>e+Number(t.quantity??0),0),C=ee(b),w=new Set(b.map(e=>e.leaderId)).size,T=new Set(b.map(e=>e.teamId||e.sectionName||e.location)).size,E=new Set(b.map(e=>e.supplierCompanyId||e.supplierId).filter(Boolean)).size,D=s.users.find(e=>e.id===s.activeUserId),O=u.filter(e=>e.status===`cancelado_confirmado`),N=[...D?.role===`admin`?u.filter(e=>[`confirmado`,`producao`,`saiu_entrega`].includes(e.status)):[]].sort((e,t)=>M(t)-M(e)||j(t)-j(e))[0];return(0,h.jsxs)(`article`,{className:`daily-block-card`,children:[(0,h.jsx)(`header`,{className:`daily-block-head`,children:(0,h.jsx)(`div`,{className:`daily-block-head-main`,children:(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`span`,{className:`compact-kicker`,children:`Bloco diario`}),(0,h.jsx)(`h2`,{children:n(l)}),(0,h.jsxs)(`p`,{children:[b.length,` pedidos - `,w,` encarregados - `,T,` equipes - `,E,` fornecedores`]})]})})}),(0,h.jsxs)(`div`,{className:`daily-block-body`,children:[C.map(e=>(0,h.jsxs)(`section`,{className:`daily-meal-block`,children:[(0,h.jsxs)(`div`,{className:`daily-meal-title`,children:[(0,h.jsx)(`strong`,{children:e.label}),(0,h.jsx)(`span`,{children:e.total})]}),e.rows.map(e=>{let n=t(s,e);return(0,h.jsxs)(`div`,{className:`daily-request-row`,children:[(0,h.jsxs)(`div`,{className:`daily-request-title`,children:[(0,h.jsx)(`strong`,{children:k(s,e)}),(0,h.jsxs)(`small`,{children:[o(e),` - `,e.sectionName||e.location,` - `,a(s,e.supplierCompanyId,e.supplierId)]})]}),(0,h.jsxs)(`div`,{className:`daily-request-side`,children:[(0,h.jsx)(`div`,{className:`daily-request-qty`,children:(0,h.jsx)(`strong`,{children:e.quantity})}),(0,h.jsx)(`div`,{className:`daily-request-actions`,children:n?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)(`button`,{className:`btn outline small`,type:`button`,"data-edit-request":e.id,"aria-label":`Editar pedido`,children:[(0,h.jsx)(g,{icon:r,name:`edit`,size:14}),(0,h.jsx)(`span`,{className:`daily-action-label`,children:`Editar`})]}),(0,h.jsxs)(`button`,{className:`btn danger small`,type:`button`,"data-cancel-request":e.id,"aria-label":`Cancelar pedido`,children:[(0,h.jsx)(g,{icon:r,name:`trash`,size:14}),(0,h.jsx)(`span`,{className:`daily-action-label`,children:`Cancelar`})]})]}):(0,h.jsx)(`span`,{className:`badge ${e.status}`,children:S(c,e.status)})})]})]},e.id)})]},e.key)),p.length?(0,h.jsxs)(`section`,{className:`daily-cancelled-block`,children:[(0,h.jsxs)(`div`,{className:`daily-cancelled-title`,children:[(0,h.jsx)(`strong`,{children:`Pedidos cancelados`}),(0,h.jsx)(`span`,{children:p.length})]}),p.map(e=>(0,h.jsxs)(`div`,{className:`daily-request-row is-cancelled`,children:[(0,h.jsxs)(`div`,{className:`daily-request-title`,children:[(0,h.jsx)(`strong`,{children:k(s,e)}),(0,h.jsxs)(`small`,{children:[o(e),` - `,e.sectionName||e.location,` - `,a(s,e.supplierCompanyId,e.supplierId)]})]}),(0,h.jsxs)(`div`,{className:`daily-request-side`,children:[(0,h.jsx)(`div`,{className:`daily-request-qty`,children:(0,h.jsx)(`strong`,{children:e.quantity})}),(0,h.jsx)(`span`,{className:`badge ${e.status}`,children:S(c,e.status)})]})]},e.id))]}):null]}),(0,h.jsxs)(`footer`,{className:`daily-block-footer`,children:[(0,h.jsx)(`div`,{className:`daily-final-summary`,children:C.map(e=>(0,h.jsxs)(`div`,{className:`daily-final-row`,children:[(0,h.jsx)(`span`,{children:e.label}),(0,h.jsx)(`strong`,{children:e.total})]},e.key))}),(0,h.jsxs)(`div`,{className:`daily-total-line`,children:[(0,h.jsx)(`span`,{children:y.length?`Total a enviar`:`Total do dia`}),(0,h.jsxs)(`strong`,{children:[x,` refeicoes`]})]}),d?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)(`div`,{className:`daily-status-line`,children:[(0,h.jsx)(`span`,{children:u.length>1?`${u.length} pedidos ao fornecedor`:`Status do fornecedor`}),(0,h.jsx)(`span`,{className:`badge ${d.status}`,children:S(c,d.status)})]}),O.length?(0,h.jsxs)(`div`,{className:`daily-cancel-note`,children:[(0,h.jsx)(`span`,{children:`Consumo real`}),(0,h.jsx)(`strong`,{children:`0 refeicoes`})]}):null,y.length?(0,h.jsxs)(`button`,{className:`btn primary`,type:`button`,"data-send-request-date":l,children:[(0,h.jsx)(g,{icon:r,name:`truck`,size:15}),d.status===`enviado`?`Enviar pedido extra`:`Enviar novo pedido da data`]}):null,N?(0,h.jsxs)(`button`,{className:`btn danger`,type:`button`,"data-cancel-confirmed-consolidation":N.id,children:[(0,h.jsx)(g,{icon:r,name:`trash`,size:15}),`Cancelar envio ao fornecedor`]}):null]}):m.length?(0,h.jsxs)(`button`,{className:`btn primary`,type:`button`,"data-send-request-date":l,children:[(0,h.jsx)(g,{icon:r,name:`truck`,size:15}),`Enviar bloco ao fornecedor`]}):(0,h.jsx)(`span`,{className:`badge enviado`,children:`Bloco sem pendencias de envio`})]})]})}function I(e=new Date){let t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?``:new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function te(e,t){return e.filter(e=>I(e.createdAt)===t)}function ne({adminConsumptionWeekOffset:e,countStatus:t,formatDate:n,icon:r,money:i,requestValue:a,state:o,sumQty:s}){let c=T(o.settings.defaultMealDate,e),l=o.settings.defaultMealDate,u=Array.from({length:7},(e,n)=>{let r=new Date(c);r.setDate(c.getDate()+n);let i=r.toISOString().slice(0,10),l=w(o,i).filter(e=>e.status!==`cancelado`);return{key:i,date:r,label:r.toLocaleDateString(`pt-BR`,{weekday:`short`}).replace(`.`,``),total:s(l),waiting:t(l,`enviado`),delivered:t(l,`entregue`),value:l.reduce((e,t)=>e+a(t),0)}}),d=u.reduce((e,t)=>e+t.total,0),f=u.reduce((e,t)=>e+t.value,0),p=Math.max(...u.map(e=>e.total),1);return(0,h.jsxs)(`div`,{className:`grid gap-2 px-1`,children:[(0,h.jsxs)(`div`,{className:`flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`span`,{className:`text-[10px] font-black uppercase tracking-[.12em] text-orange-700`,children:`Consumo recente`}),(0,h.jsx)(`h2`,{className:`text-base font-black leading-tight text-stone-900`,children:`Semana operacional`}),(0,h.jsxs)(`p`,{className:`mt-0.5 text-xs font-bold text-stone-500`,children:[n(u[0].key),` até `,n(u[6].key)]})]}),(0,h.jsxs)(`div`,{className:`grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:items-center`,children:[(0,h.jsxs)(`button`,{className:`inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-stone-300 bg-white px-2 text-[11px] font-bold text-stone-700 shadow-sm transition hover:bg-stone-50 hover:text-orange-700`,"data-week-offset":e-1,children:[(0,h.jsx)(g,{icon:r,name:`arrow`,size:12}),` Anterior`]}),(0,h.jsx)(`button`,{className:`inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-stone-300 bg-white px-2 text-[11px] font-bold text-stone-700 shadow-sm transition hover:bg-stone-50`,"data-week-offset":0,children:`Atual`}),(0,h.jsx)(`button`,{className:`inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-stone-300 bg-white px-2 text-[11px] font-bold text-stone-700 shadow-sm transition hover:bg-stone-50`,"data-week-offset":e+1,children:`Próxima`})]})]}),(0,h.jsxs)(`div`,{className:`hidden`,children:[(0,h.jsxs)(`div`,{className:`rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-200 bg-white px-3 py-2`,children:[(0,h.jsx)(`strong`,{className:`text-lg font-black leading-none text-stone-900`,children:d}),(0,h.jsx)(`br`,{}),(0,h.jsx)(`span`,{className:`text-[10px] font-bold uppercase tracking-wider text-stone-500`,children:`Refeições na semana`})]}),(0,h.jsxs)(`div`,{className:`rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-200 bg-white px-3 py-2`,children:[(0,h.jsx)(`strong`,{className:`text-lg font-black leading-none text-stone-900`,children:i(f)}),(0,h.jsx)(`br`,{}),(0,h.jsx)(`span`,{className:`text-[10px] font-bold uppercase tracking-wider text-stone-500`,children:`Custo estimado`})]})]}),(0,h.jsx)(`div`,{className:`grid min-h-[7.25rem] grid-cols-7 items-end gap-1.5 px-1 pt-2`,role:`list`,children:u.map(e=>(0,h.jsxs)(`button`,{className:`group relative flex h-[7rem] appearance-none flex-col items-center justify-end border-0 bg-transparent p-0`,type:`button`,role:`listitem`,"data-filter-date-set":e.key,"aria-label":`${e.label}, ${e.total} refeições`,children:[(0,h.jsx)(`span`,{className:`mb-1 text-[11px] font-black text-stone-500`,children:e.total||`-`}),(0,h.jsx)(`i`,{className:`block w-full max-w-[1.35rem] rounded-t-full transition-all group-hover:opacity-80 ${e.key===l?`bg-orange-600`:`bg-stone-800`}`,style:{height:`${Math.max(6,Math.round(e.total/p*70))}px`}}),(0,h.jsx)(`span`,{className:`mt-1 text-[9px] font-black uppercase ${e.key===l?`text-orange-700`:`text-stone-400`}`,children:e.label}),(0,h.jsx)(`small`,{className:`text-[9px] font-bold text-stone-500`,children:String(e.date.getDate()).padStart(2,`0`)})]},e.key))})]})}function re(e){let{countStatus:t,formatDate:n,icon:r,money:i,requestValue:a,state:o,sumQty:s}=e,c=o.settings.defaultMealDate||I(),l=te(o.requests,c),u=l.filter(e=>![`cancelado`,`entregue`].includes(e.status)).sort((e,t)=>t.date.localeCompare(e.date)||new Date(t.createdAt)-new Date(e.createdAt)),d=t(u,`enviado`),f=t(l,`entregue`),p=u.reduce((e,t)=>e+a(t),0),_=P(u);return(0,h.jsxs)(`div`,{className:`grid w-full gap-3 sm:gap-4`,children:[(0,h.jsx)(`style`,{children:N}),(0,h.jsx)(v,{className:`admin-home-receipt`,kicker:`Lancados hoje - ${n(c)}`,title:`Visão geral`,totalValue:d,totalLabel:`pedidos a enviar`,description:`Pedidos registrados hoje, mesmo quando a refeição está agendada para outra data`,actions:(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)(`button`,{className:`btn primary`,"data-open-admin-order":!0,children:[(0,h.jsx)(g,{icon:r,name:`plus`,size:16}),`Fazer pedido`]}),(0,h.jsxs)(`button`,{className:`btn outline`,"data-view":`pedidos`,children:[(0,h.jsx)(g,{icon:r,name:`clipboard`,size:16}),`Ver pedidos`]})]}),metrics:[{icon:r,iconName:`utensils`,value:s(u),label:`Refeições lançadas`},{icon:r,iconName:`clock`,value:d,label:`Aguardando`},{icon:r,iconName:`check`,value:f,label:`Entregas feitas`},{icon:r,iconName:`dollar-sign`,value:i(p),label:`Custo estimado`}]}),(0,h.jsx)(`section`,{className:`admin-live-panel`,children:_.length?(0,h.jsx)(`div`,{className:`daily-block-list`,children:_.map(([t,n])=>(0,m.createElement)(F,{...e,date:t,requests:n,key:t}))}):(0,h.jsxs)(`div`,{className:`grid justify-items-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-center`,children:[(0,h.jsx)(`span`,{className:`grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-700`,children:(0,h.jsx)(g,{icon:r,name:`inbox`,size:20})}),(0,h.jsx)(`strong`,{className:`text-stone-900`,children:`Fila vazia`}),(0,h.jsx)(`p`,{className:`m-0 max-w-md text-xs font-semibold text-stone-500`,children:`Nenhum pedido foi enviado hoje. Assim que um encarregado enviar, o bloco aparece aqui automaticamente.`})]})}),(0,h.jsx)(ne,{...e})]})}var ie=`
  .admin-page {
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    display: grid;
    gap: 0.75rem;
    color: #1c1917;
  }
  .admin-page h1,
  .admin-page h2,
  .admin-page h3,
  .admin-page p { margin: 0; }
  .admin-page h1 { font-size: 26px; line-height: 1; font-weight: 900; letter-spacing: 0; }
  .admin-page h2 { font-size: 1.125rem; font-weight: 900; color: #1c1917; }
  .admin-page h3 { font-weight: 900; }
  .admin-page p { font-size: 0.875rem; color: #78716c; }
  .admin-page .eyebrow,
  .admin-page .compact-kicker,
  .admin-page .stat-label,
  .admin-page .finance-metric span,
  .admin-page .request-card-quantity span {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: #c2410c;
  }
  .admin-page .page-subtitle,
  .admin-page .stat-sub,
  .admin-page .finance-metric small,
  .admin-page .request-card-quantity span { color: #78716c; font-size: .75rem; font-weight: 700; }
  .admin-page .section-title { margin-bottom: .75rem; font-size: 1rem; font-weight: 900; color: #1c1917; }
  .admin-page .app-page-header,
  .admin-page .admin-list-header,
  .admin-page .admin-send-header {
    position: relative;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border-radius: 18px;
    border: 1px solid #e7e5e4;
    border-left: 5px solid #ea580c;
    background: rgba(255,255,255,.9);
    padding: 1rem;
    box-shadow: 0 12px 30px rgba(25,27,24,.055);
  }
  .admin-page .actions,
  .admin-page .button-row,
  .admin-page .admin-list-actions,
  .admin-page .admin-send-actions,
  .admin-page .request-card-actions,
  .admin-page .week-nav { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
  .admin-page .admin-list-actions,
  .admin-page .admin-send-actions { justify-content: flex-end; }
  .admin-page .btn,
  .admin-page .icon-action,
  .admin-page .admin-back-button {
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
  .admin-page .btn:hover,
  .admin-page .icon-action:hover { transform: translateY(-2px); }
  .admin-page .btn.primary { border-color: #ea580c; background: #ea580c; color: #fff; box-shadow: 0 10px 22px rgba(239,91,29,.2); }
  .admin-page .btn.primary:hover { background: #c2410c; }
  .admin-page .btn.outline,
  .admin-page .icon-action,
  .admin-page .admin-back-button { border-color: #d6d3d1; background: #fff; color: #1c1917; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .btn.danger,
  .admin-page .icon-action.danger { border-color: #fecaca; background: #fef2f2; color: #b91c1c; }
  .admin-page .btn.small { min-height: 2.25rem; padding: 0 .75rem; font-size: .75rem; }
  .admin-page .badge { display: inline-flex; min-height: 1.75rem; align-items: center; border-radius: 999px; border: 1px solid #e7e5e4; background: #f5f5f4; padding: 0 .625rem; font-size: 11px; font-weight: 900; text-transform: uppercase; color: #57534e; }
  .admin-page .badge.enviado { border-color: #fed7aa; background: #fff7ed; color: #c2410c; }
  .admin-page .badge.entregue { border-color: #a7f3d0; background: #ecfdf5; color: #047857; }
  .admin-page .badge.cancelado { border-color: #fecaca; background: #fef2f2; color: #b91c1c; }
  .admin-page .badge.cancelado_confirmado { border-color: #fecaca; background: #fef2f2; color: #991b1b; }
  .admin-page .badge.confirmado { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
  .admin-page .badge.producao { border-color: #fde68a; background: #fffbeb; color: #b45309; }
  .admin-page .badge.saiu_entrega { border-color: #bae6fd; background: #f0f9ff; color: #0369a1; }
  .admin-page .table-wrap { overflow-x: auto; border-radius: .75rem; border: 1px solid #e7e5e4; background: #fff; }
  .admin-page table { width: 100%; border-collapse: collapse; }
  .admin-page th { background: #fafaf9; padding: .75rem; text-align: left; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .admin-page td { border-top: 1px solid #f5f5f4; padding: .75rem; font-size: .875rem; }
  .admin-page input,
  .admin-page select,
  .admin-page textarea { min-height: 2.5rem; border-radius: .5rem; border: 1px solid #d6d3d1; background: #fff; padding: 0 .75rem; font-size: .875rem; }
  .admin-page textarea { min-height: 6rem; padding-top: .5rem; padding-bottom: .5rem; }
  .admin-page .admin-filter-menu,
  .admin-page .export-menu { position: relative; }
  .admin-page .admin-filter-menu summary { display: inline-flex; min-height: 2.5rem; align-items: center; gap: .5rem; border-radius: .5rem; border: 1px solid #d6d3d1; background: #fff; padding: 0 1rem; font-size: .875rem; font-weight: 800; cursor: pointer; }
  .admin-page .admin-filter-popover,
  .admin-page .export-options { position: absolute; right: 0; z-index: 20; margin-top: .5rem; display: grid; min-width: 10rem; gap: .5rem; border-radius: 1rem; border: 1px solid #e7e5e4; background: #fff; padding: .75rem; box-shadow: 0 25px 50px rgba(0,0,0,.18); }
  .admin-page .empty { border-radius: .75rem; border: 1px dashed #d6d3d1; background: #fafaf9; padding: 1.25rem; text-align: center; font-size: .875rem; font-weight: 700; color: #78716c; }
  @media (min-width: 640px) { .admin-page h1 { font-size: 34px; } }
`,ae=`
  .admin-page .admin-history-shell { position: relative; overflow: visible; }
  .admin-page .admin-history-hero { overflow: visible; isolation: isolate; }
  .admin-page .admin-history-actions { position: relative; z-index: 80; display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: .5rem; }
  .admin-page .admin-history-actions .admin-filter-menu,
  .admin-page .admin-history-actions .export-menu { position: relative; z-index: 90; }
  .admin-page .admin-history-actions .admin-filter-popover,
  .admin-page .admin-history-actions .export-options { z-index: 999; top: 100%; right: 0; left: auto; min-width: min(19rem, calc(100vw - 2rem)); }
  .admin-page .admin-pedidos-summary { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: .5rem; border-radius: 0 0 20px 20px; background: #f5f5f4; padding: 1.25rem 1rem .75rem; }
  .admin-page .admin-history-chip { display: flex; min-width: 0; align-items: center; gap: .5rem; border-radius: 0 1rem 1rem .375rem; border: 1px solid #d6d3d1; border-left-width: 2px; border-left-style: dashed; background: #fff; padding: .75rem; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .admin-history-chip-icon { display: grid; height: 2rem; width: 2rem; flex-shrink: 0; place-items: center; border-radius: 999px; background: #fff7ed; color: #c2410c; }
  .admin-page .admin-history-chip strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 1.125rem; font-weight: 950; line-height: 1; color: #1c1917; }
  .admin-page .admin-history-chip span:last-child { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 950; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .admin-page .admin-request-list { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,32rem),1fr)); align-items: start; gap: .75rem; }
  .admin-page .admin-request-shell { display: grid; min-width: 0; gap: .35rem; }
  .admin-page .admin-request-owner { display: inline-flex; width: max-content; max-width: 100%; align-items: center; gap: .45rem; border-radius: .5rem; border: 1px dashed #d6d3d1; background: #fffefa; padding: .35rem .55rem; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .admin-page .admin-request-owner strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #1c1917; }
  .admin-page .admin-pedidos-receipt .admin-receipt-metrics[data-count="3"] { grid-template-columns: repeat(3,minmax(0,1fr)) !important; }
  .admin-page .admin-pedidos-receipt .admin-receipt-metrics[data-count="3"] .admin-receipt-chip:last-child { grid-column: auto; }
  @media (max-width: 767px) {
    .admin-page .admin-pedidos-receipt .admin-receipt-metrics[data-count="3"] { grid-template-columns: repeat(3,minmax(0,1fr)) !important; }
    .admin-page .admin-pedidos-receipt .admin-receipt-metrics[data-count="3"] .admin-receipt-chip:last-child { grid-column: auto; }
    .admin-page .admin-pedidos-receipt .admin-receipt-chip { min-width: 0; }
    .admin-page .admin-history-hero .admin-history-actions { width: 100%; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }
    .admin-page .admin-pedidos-summary { padding-inline: .75rem; }
    .admin-page .admin-history-chip { padding: .55rem; gap: .35rem; }
    .admin-page .admin-history-chip-icon { height: 1.75rem; width: 1.75rem; }
    .admin-page .admin-history-chip strong { font-size: 1rem; }
  }
`;function oe(e){let{adminFilters:t,countStatus:n,icon:r,state:i,sumQty:a}=e,o=t.date,s=t.leader,c=t.meal,d=i.requests.filter(e=>(!o||e.date===o)&&(!s||e.leaderId===s)&&(!c||e.mealType===c)).sort((e,t)=>new Date(t.createdAt)-new Date(e.createdAt)),f=d.filter(e=>e.status!==`cancelado`),p=n(d,`enviado`),g=P(d);return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(`style`,{children:ie+ae+N}),(0,h.jsxs)(`div`,{className:`grid w-full gap-3 sm:gap-4 admin-history-shell`,children:[(0,h.jsx)(v,{className:`admin-pedidos-receipt`,kicker:`Pedidos administrativos`,title:`Pedidos recebidos`,totalValue:d.length,totalLabel:`pedidos recebidos`,description:p?`${p} aguardando envio ao fornecedor`:`Fila operacional atualizada`,actions:(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)(`button`,{className:`btn primary small`,type:`button`,"data-open-admin-order":!0,children:[(0,h.jsx)(u,{icon:r,name:`plus`,size:14}),`Fazer pedido`]}),(0,h.jsxs)(x,{icon:r,children:[(0,h.jsx)(`input`,{type:`date`,defaultValue:o,"data-filter-date":!0,"aria-label":`Filtrar por data`}),(0,h.jsxs)(`select`,{defaultValue:s,"data-filter-leader":!0,"aria-label":`Filtrar encarregado`,children:[(0,h.jsx)(`option`,{value:``,children:`Todos`}),i.users.map(e=>(0,h.jsx)(`option`,{value:e.id,children:e.name},e.id))]}),(0,h.jsxs)(`select`,{defaultValue:c,"data-filter-meal":!0,"aria-label":`Filtrar refeição`,children:[(0,h.jsx)(`option`,{value:``,children:`Tipos`}),i.mealTypes.map(e=>(0,h.jsx)(`option`,{value:e.label,children:e.label},e.id))]}),(0,h.jsx)(`button`,{className:`btn outline small`,type:`button`,"data-clear-admin-request-filters":!0,children:`Todos os dias`})]}),(0,h.jsx)(b,{exportMenuOpen:e.exportMenuOpen,icon:r,id:`pedidos`,items:[[`pdf`,`PDF`,`clipboard`],[`xlsx`,`Excel`,`chart`]]})]}),metrics:[{icon:r,iconName:`clipboard`,value:d.length,label:`Pedidos`},{icon:r,iconName:`utensils`,value:a(f),label:`Refeições`},{icon:r,iconName:`clock`,value:p,label:`A enviar`}]}),d.length?(0,h.jsx)(`section`,{className:`grid gap-3`,children:(0,h.jsx)(`div`,{className:`daily-block-list`,children:g.map(([t,n])=>(0,m.createElement)(F,{...e,date:t,requests:n,key:t}))})}):(0,h.jsxs)(`div`,{className:`grid justify-items-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-white px-6 py-8 text-center shadow-sm`,children:[(0,h.jsx)(`span`,{className:`grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-orange-700`,children:(0,h.jsx)(u,{icon:r,name:`clipboard`,size:22})}),(0,h.jsx)(`strong`,{children:`Nenhum pedido encontrado`}),(0,h.jsx)(`p`,{className:`m-0 text-sm text-stone-500`,children:`Ajuste os filtros ou aguarde o envio dos encarregados.`}),(0,h.jsxs)(`button`,{className:l,"data-view":`pedidos`,children:[(0,h.jsx)(u,{icon:r,name:`clipboard`,size:15}),`Ver pedidos`]})]})]})]})}var se=`
  .admin-page {
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    display: grid;
    gap: 0.75rem;
    color: #1c1917;
  }
  .admin-page h1,
  .admin-page h2,
  .admin-page h3,
  .admin-page p { margin: 0; }
  .admin-page h1 { font-size: 26px; line-height: 1; font-weight: 900; letter-spacing: 0; }
  .admin-page h2 { font-size: 1.125rem; font-weight: 900; color: #1c1917; }
  .admin-page h3 { font-weight: 900; }
  .admin-page p { font-size: 0.875rem; color: #78716c; }
  .admin-page .eyebrow,
  .admin-page .compact-kicker,
  .admin-page .stat-label,
  .admin-page .finance-metric span,
  .admin-page .request-card-quantity span {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: #c2410c;
  }
  .admin-page .page-subtitle,
  .admin-page .stat-sub,
  .admin-page .finance-metric small,
  .admin-page .request-card-quantity span { color: #78716c; font-size: .75rem; font-weight: 700; }
  .admin-page .section-title { margin-bottom: .75rem; font-size: 1rem; font-weight: 900; color: #1c1917; }
  .admin-page .app-page-header,
  .admin-page .admin-list-header,
  .admin-page .admin-send-header {
    position: relative;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border-radius: 18px;
    border: 1px solid #e7e5e4;
    border-left: 5px solid #ea580c;
    background: rgba(255,255,255,.9);
    padding: 1rem;
    box-shadow: 0 12px 30px rgba(25,27,24,.055);
  }
  .admin-page .actions,
  .admin-page .button-row,
  .admin-page .admin-list-actions,
  .admin-page .admin-send-actions,
  .admin-page .request-card-actions,
  .admin-page .week-nav { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
  .admin-page .admin-list-actions,
  .admin-page .admin-send-actions { justify-content: flex-end; }
  .admin-page .btn,
  .admin-page .icon-action,
  .admin-page .admin-back-button {
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
  .admin-page .btn:hover,
  .admin-page .icon-action:hover { transform: translateY(-2px); }
  .admin-page .btn.primary { border-color: #ea580c; background: #ea580c; color: #fff; box-shadow: 0 10px 22px rgba(239,91,29,.2); }
  .admin-page .btn.primary:hover { background: #c2410c; }
  .admin-page .btn.outline,
  .admin-page .icon-action,
  .admin-page .admin-back-button { border-color: #d6d3d1; background: #fff; color: #1c1917; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .btn.danger,
  .admin-page .icon-action.danger { border-color: #fecaca; background: #fef2f2; color: #b91c1c; }
  .admin-page .btn.small { min-height: 2.25rem; padding: 0 .75rem; font-size: .75rem; }
  .admin-page .badge { display: inline-flex; min-height: 1.75rem; align-items: center; border-radius: 999px; border: 1px solid #e7e5e4; background: #f5f5f4; padding: 0 .625rem; font-size: 11px; font-weight: 900; text-transform: uppercase; color: #57534e; }
  .admin-page .badge.enviado { border-color: #fed7aa; background: #fff7ed; color: #c2410c; }
  .admin-page .badge.entregue { border-color: #a7f3d0; background: #ecfdf5; color: #047857; }
  .admin-page .badge.cancelado { border-color: #fecaca; background: #fef2f2; color: #b91c1c; }
  .admin-page .badge.cancelado_confirmado { border-color: #fecaca; background: #fef2f2; color: #991b1b; }
  .admin-page .badge.confirmado { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
  .admin-page .badge.producao { border-color: #fde68a; background: #fffbeb; color: #b45309; }
  .admin-page .badge.saiu_entrega { border-color: #bae6fd; background: #f0f9ff; color: #0369a1; }
  .admin-page .table-wrap { overflow-x: auto; border-radius: .75rem; border: 1px solid #e7e5e4; background: #fff; }
  .admin-page table { width: 100%; border-collapse: collapse; }
  .admin-page th { background: #fafaf9; padding: .75rem; text-align: left; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .admin-page td { border-top: 1px solid #f5f5f4; padding: .75rem; font-size: .875rem; }
  .admin-page input,
  .admin-page select,
  .admin-page textarea { min-height: 2.5rem; border-radius: .5rem; border: 1px solid #d6d3d1; background: #fff; padding: 0 .75rem; font-size: .875rem; }
  .admin-page textarea { min-height: 6rem; padding-top: .5rem; padding-bottom: .5rem; }
  .admin-page .admin-filter-menu,
  .admin-page .export-menu { position: relative; }
  .admin-page .admin-filter-menu summary { display: inline-flex; min-height: 2.5rem; align-items: center; gap: .5rem; border-radius: .5rem; border: 1px solid #d6d3d1; background: #fff; padding: 0 1rem; font-size: .875rem; font-weight: 800; cursor: pointer; }
  .admin-page .admin-filter-popover,
  .admin-page .export-options { position: absolute; right: 0; z-index: 20; margin-top: .5rem; display: grid; min-width: 10rem; gap: .5rem; border-radius: 1rem; border: 1px solid #e7e5e4; background: #fff; padding: .75rem; box-shadow: 0 25px 50px rgba(0,0,0,.18); }
  .admin-page .empty { border-radius: .75rem; border: 1px dashed #d6d3d1; background: #fafaf9; padding: 1.25rem; text-align: center; font-size: .875rem; font-weight: 700; color: #78716c; }
  @media (min-width: 640px) { .admin-page h1 { font-size: 34px; } }
`,ce=`
  .admin-page .admin-send-page { display: grid; gap: .75rem; }
  .admin-page .admin-send-receipt { overflow: visible; border-radius: 22px; border: 1px solid #27251f; background: #242622; box-shadow: 0 18px 40px -22px rgba(0,0,0,.55); isolation: isolate; }
  .admin-page .admin-send-receipt .admin-send-header { display: grid; margin: 0; border: 0; border-radius: 22px 22px 0 0; box-shadow: none; }
  .admin-page .admin-send-total { margin-top: .45rem; display: flex; align-items: end; gap: .55rem; color: #fff; }
  .admin-page .admin-send-total strong { font-size: clamp(2.7rem, 2rem + 3vw, 4.25rem); line-height: .82; font-weight: 950; letter-spacing: 0; }
  .admin-page .admin-send-total span { padding-bottom: .28rem; max-width: 8rem; font-size: 10px; line-height: 1.12; font-weight: 950; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.58); }
  .admin-page .admin-send-holes { pointer-events: none; display: flex; justify-content: space-around; padding: 0 1rem; transform: translateY(50%); }
  .admin-page .admin-send-holes span { width: .65rem; height: .65rem; border-radius: 999px; background: #fffefa; }
  .admin-page .admin-send-summary { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: .5rem; border-radius: 0 0 20px 20px; background: #f5f1ea; padding: 1.25rem 1rem .85rem; }
  .admin-page .admin-send-top-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: .5rem; }
  .admin-page .admin-send-chip { display: flex; min-width: 0; align-items: center; gap: .65rem; border-radius: 0 1rem 1rem .375rem; border: 1px solid #d6d3d1; border-left: 2px dashed #d6d3d1; background: #fffefa; padding: .78rem; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .admin-send-chip-icon { display: grid; width: 2rem; height: 2rem; flex-shrink: 0; place-items: center; border-radius: 999px; background: #fff0e8; color: #c2410c; }
  .admin-page .admin-send-chip strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 1.15rem; line-height: 1; font-weight: 950; color: #1c1917; }
  .admin-page .admin-send-chip span:last-child { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 950; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .admin-page .report-grid { display: grid; gap: .75rem; }
  .admin-page .data-panel,
  .admin-page .timeline-panel,
  .admin-page .table-panel { border-radius: 18px; border: 1px solid #ded9d1; background: rgba(255,254,250,.94); padding: 1rem; box-shadow: 0 12px 30px rgba(25,27,24,.055); }
  .admin-page .consolidated-summary { display: grid; gap: .65rem; }
  .admin-page .consolidated-block { display: grid; gap: .4rem; overflow: hidden; border-radius: 0 1rem 1rem .4rem; border: 1px solid #e4ded4; border-left: 2px dashed #d6d3d1; background: #fffefa; padding: .65rem; box-shadow: 0 1px 2px rgba(0,0,0,.035); }
  .admin-page .consolidated-block + .consolidated-block { margin-top: .55rem; }
  .admin-page .consolidated-block-title,
  .admin-page .consolidated-distribution-head,
  .admin-page .consolidated-row,
  .admin-page .consolidated-resume-row { display: grid; grid-template-columns: minmax(0,1fr) 4.5rem; align-items: center; }
  .admin-page .consolidated-block-title,
  .admin-page .consolidated-resume-row { color: #1c1917; font-size: .8rem; font-weight: 950; }
  .admin-page .consolidated-block-title { display: flex; align-items: center; justify-content: space-between; gap: .65rem; }
  .admin-page .consolidated-block-title span { border-radius: 999px; background: #fff7ed; padding: .18rem .5rem; color: #c2410c; font-size: .78rem; }
  .admin-page .consolidated-distribution-head { display: none; }
  .admin-page .consolidated-description { color: #78716c; font-size: .78rem; font-weight: 700; }
  .admin-page .consolidated-distribution { display: grid; gap: .3rem; }
  .admin-page .consolidated-row { display: flex; align-items: center; justify-content: space-between; gap: .75rem; border-radius: .55rem; background: #fafaf9; padding: .42rem .5rem; font-size: .875rem; }
  .admin-page .consolidated-row span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .admin-page .consolidated-resume { display: flex; flex-wrap: wrap; gap: .35rem; }
  .admin-page .consolidated-resume-row { display: inline-flex; align-items: center; gap: .32rem; border-radius: 999px; border: 1px solid #fed7aa; background: #fff7ed; color: #c2410c; font-size: .72rem; font-weight: 950; }
  .admin-page .consolidated-resume-row span,
  .admin-page .consolidated-resume-row strong { min-width: 0; padding: .24rem .44rem; }
  .admin-page .consolidated-resume-row strong { padding-left: 0; }
  .admin-page .total-line { font-weight: 950; color: #1c1917; }
  .admin-page .timeline { display: grid; gap: .5rem; }
  .admin-page .timeline-item { display: grid; grid-template-columns: 12px minmax(0,1fr); gap: .75rem; border-radius: 0 1rem 1rem .4rem; border: 1px solid #e4ded4; border-left: 2px dashed #d6d3d1; background: #fffefa; padding: .78rem; }
  .admin-page .timeline-dot { margin-top: .25rem; width: .75rem; height: .75rem; border-radius: 999px; background: #ea580c; box-shadow: 0 0 0 4px #fff0e8; }
  .admin-page .timeline-body { color: #78716c; font-size: .82rem; font-weight: 700; }
  .admin-page .timeline-body strong { color: #1c1917; font-size: .88rem; }
  .admin-page .admin-send-receipt-card .admin-receipt-metrics[data-count="3"] { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
  .admin-page .admin-send-receipt-card .admin-receipt-metrics[data-count="3"] .admin-receipt-chip:last-child { grid-column: 1 / -1; }
  @media (max-width: 767px) {
    .admin-page .admin-send-summary { grid-template-columns: 1fr; padding-inline: .75rem; }
    .admin-page .admin-send-receipt-card .admin-receipt-actions {
      display: grid;
      grid-template-columns: minmax(0,1fr) auto;
      align-items: center;
      gap: .35rem;
      width: auto;
      max-width: none;
    }
    .admin-page .admin-send-top-actions {
      grid-column: 1;
      display: flex;
      min-width: 0;
      justify-self: start;
      gap: .35rem;
    }
    .admin-page .admin-send-top-actions > *,
    .admin-page .admin-send-top-actions .admin-filter-menu summary,
    .admin-page .admin-send-top-actions .btn {
      width: auto;
      min-width: 0;
    }
    .admin-page .admin-send-receipt-card .admin-receipt-actions .admin-send-submit {
      grid-column: 2;
      justify-self: end;
      width: auto;
      max-width: 100%;
      min-height: 2.08rem;
      padding-inline: .75rem;
      font-size: .7rem;
    }
  }
  @media (min-width: 1024px) { .admin-page .report-grid { grid-template-columns: minmax(0,1fr) minmax(320px,.42fr); } .admin-page .admin-send-header { grid-template-columns: minmax(0,1fr) auto; } }
`;function le(e,t){let n=e?.mealCategory;return n===`marmita`?`Marmita`:n===`buffet`?`Buffer`:n===`janta`?`Janta`:t||`Outro`}function ue(e,t){return t.mealCategory===`marmita`?C(e,t.leaderId):t.sectionName||t.location||C(e,t.leaderId)}function de(e){let t={marmita:0,buffet:1,janta:2,outro:3};return Object.values(e.reduce((e,t)=>{let n=t.mealCategory||t.mealType||`outro`;return e[n]??={key:n,label:le(t,t.mealType),total:0,rows:[]},e[n].total+=Number(t.quantity??0),e[n].rows.push(t),e},{})).sort((e,n)=>(t[e.key]??9)-(t[n.key]??9))}function fe({requestMealDescription:e,state:t,summary:n}){if(!n.rows.length)return(0,h.jsx)(`div`,{className:`empty`,children:`Sem pedidos recebidos para enviar ao fornecedor.`});let r=de(n.rows);return(0,h.jsxs)(`div`,{className:`consolidated-summary`,children:[r.map(n=>(0,h.jsxs)(`div`,{className:`consolidated-block`,children:[(0,h.jsxs)(`div`,{className:`consolidated-block-title`,children:[(0,h.jsx)(`strong`,{children:n.label}),(0,h.jsx)(`span`,{children:n.total})]}),e(n.rows[0])?(0,h.jsx)(`div`,{className:`consolidated-description`,children:e(n.rows[0])}):null,(0,h.jsx)(`div`,{className:`consolidated-distribution`,children:n.rows.map(e=>(0,h.jsxs)(`div`,{className:`consolidated-row`,children:[(0,h.jsx)(`span`,{children:ue(t,e)}),(0,h.jsx)(`strong`,{children:e.quantity})]},e.id))})]},n.key)),(0,h.jsx)(`div`,{className:`consolidated-resume`,"aria-label":`Resumo por refeicao`,children:r.map(e=>(0,h.jsxs)(`div`,{className:`consolidated-resume-row`,children:[(0,h.jsx)(`span`,{children:e.label}),(0,h.jsx)(`strong`,{children:e.total})]},e.key))})]})}function pe({consolidation:e,formatDateTime:t,state:n}){let r=[[`enviado`,`Enviado ao fornecedor`],[`confirmado`,`Fornecedor confirmou recebimento`],[`producao`,`Fornecedor confirmou produção`],[`saiu_entrega`,`Saída para entrega registrada`],[`entregue`,`Entrega concluída`]];return e.status===`cancelado_confirmado`&&r.push([`cancelado_confirmado`,`Cancelado apos confirmacao`]),(0,h.jsx)(`div`,{className:`timeline`,children:r.map(([r,i])=>{let a=e.confirmations.find(e=>e.step===r),o=r===`cancelado_confirmado`&&e.status===`cancelado_confirmado`;return(0,h.jsxs)(`div`,{className:`timeline-item`,children:[(0,h.jsx)(`div`,{className:`timeline-dot`,style:{background:a||o?`var(--orange)`:`var(--line)`}}),(0,h.jsxs)(`div`,{className:`timeline-body`,children:[(0,h.jsx)(`strong`,{children:i}),(0,h.jsx)(`br`,{}),a?`${C(n,a.userId)} - ${t(a.at)}`:o?t(e.updatedAt):`Aguardando`]})]},r)})})}function me(e){let{adminFilters:t,formatDate:n,getConsolidationForDate:r,getConsolidationSummary:i,icon:a,state:o,STATUS_LABEL:c}=e,l=t.date,u=r(o,l),d=i(o,u),f=s(o,{includeInactive:!1}),p=u.supplierCompanyId??f[0]?.id??``,m=new Set(d.rows.map(e=>e.leaderId)).size,_=Object.keys(d.byMeal).length;return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(`style`,{children:se+ce}),(0,h.jsxs)(`section`,{className:`admin-send-page`,children:[(0,h.jsx)(v,{className:`admin-send-receipt-card`,kicker:`Enviar pedido`,title:`Pedido ao fornecedor`,totalValue:d.total,totalLabel:`refeições para ${n(l)}`,description:`Revise a comanda consolidada e envie para o fornecedor selecionado.`,actions:(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)(`div`,{className:`admin-send-top-actions`,children:[(0,h.jsxs)(x,{icon:a,children:[(0,h.jsx)(`input`,{type:`date`,defaultValue:l,"data-filter-date":!0,"aria-label":`Data do pedido`}),(0,h.jsx)(`select`,{defaultValue:p,"data-supplier-id":!0,"aria-label":`Fornecedor`,children:f.map(e=>(0,h.jsx)(`option`,{value:e.id,children:e.tradeName||e.legalName},e.id))}),(0,h.jsx)(`span`,{className:`badge ${u.status}`,children:S(c,u.status)})]}),(0,h.jsx)(b,{exportMenuOpen:e.exportMenuOpen,icon:a,id:`consolidacao`,items:[[`pdf`,`PDF`,`chart`],[`doc`,`Word`,`clipboard`]]})]}),(0,h.jsxs)(`button`,{className:`btn primary admin-send-submit`,"data-action":`send-consolidation`,children:[(0,h.jsx)(g,{icon:a,name:`truck`,size:15}),`Enviar`]})]}),metrics:[{icon:a,iconName:`utensils`,value:d.total,label:`Refeições`},{icon:a,iconName:`users`,value:m,label:`Encarregados`},{icon:a,iconName:`package`,value:_,label:`Tipos no pedido`}]}),(0,h.jsxs)(`div`,{className:`report-grid`,children:[(0,h.jsxs)(`div`,{className:`data-panel`,children:[(0,h.jsx)(`h2`,{className:`section-title`,children:`Resumo do pedido`}),(0,h.jsx)(fe,{...e,summary:d})]}),(0,h.jsxs)(`div`,{className:`timeline-panel`,children:[(0,h.jsx)(`h2`,{className:`section-title`,children:`Linha do tempo`}),(0,h.jsx)(pe,{...e,consolidation:u})]})]}),(0,h.jsxs)(`div`,{className:`table-panel`,children:[(0,h.jsx)(`h2`,{className:`section-title`,children:`Pedidos de origem`}),(0,h.jsx)(D,{...e,rows:d.rows,showLeader:!0})]})]})]})}var he=`
  .admin-page {
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    display: grid;
    gap: 0.75rem;
    color: #1c1917;
  }
  .admin-page h1,
  .admin-page h2,
  .admin-page h3,
  .admin-page p { margin: 0; }
  .admin-page h1 { font-size: 26px; line-height: 1; font-weight: 900; letter-spacing: 0; }
  .admin-page h2 { font-size: 1.125rem; font-weight: 900; color: #1c1917; }
  .admin-page h3 { font-weight: 900; }
  .admin-page p { font-size: 0.875rem; color: #78716c; }
  .admin-page .eyebrow,
  .admin-page .compact-kicker,
  .admin-page .stat-label,
  .admin-page .finance-metric span,
  .admin-page .request-card-quantity span {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: #c2410c;
  }
  .admin-page .page-subtitle,
  .admin-page .stat-sub,
  .admin-page .finance-metric small,
  .admin-page .request-card-quantity span { color: #78716c; font-size: .75rem; font-weight: 700; }
  .admin-page .section-title { margin-bottom: .75rem; font-size: 1rem; font-weight: 900; color: #1c1917; }
  .admin-page .app-page-header,
  .admin-page .admin-list-header,
  .admin-page .admin-send-header {
    position: relative;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border-radius: 18px;
    border: 1px solid #e7e5e4;
    border-left: 5px solid #ea580c;
    background: rgba(255,255,255,.9);
    padding: 1rem;
    box-shadow: 0 12px 30px rgba(25,27,24,.055);
  }
  .admin-page .actions,
  .admin-page .button-row,
  .admin-page .admin-list-actions,
  .admin-page .admin-send-actions,
  .admin-page .request-card-actions,
  .admin-page .week-nav { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
  .admin-page .admin-list-actions,
  .admin-page .admin-send-actions { justify-content: flex-end; }
  .admin-page .btn,
  .admin-page .icon-action,
  .admin-page .admin-back-button {
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
  .admin-page .btn:hover,
  .admin-page .icon-action:hover { transform: translateY(-2px); }
  .admin-page .btn.primary { border-color: #ea580c; background: #ea580c; color: #fff; box-shadow: 0 10px 22px rgba(239,91,29,.2); }
  .admin-page .btn.primary:hover { background: #c2410c; }
  .admin-page .btn.outline,
  .admin-page .icon-action,
  .admin-page .admin-back-button { border-color: #d6d3d1; background: #fff; color: #1c1917; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .btn.danger,
  .admin-page .icon-action.danger { border-color: #fecaca; background: #fef2f2; color: #b91c1c; }
  .admin-page .btn.small { min-height: 2.25rem; padding: 0 .75rem; font-size: .75rem; }
  .admin-page .badge { display: inline-flex; min-height: 1.75rem; align-items: center; border-radius: 999px; border: 1px solid #e7e5e4; background: #f5f5f4; padding: 0 .625rem; font-size: 11px; font-weight: 900; text-transform: uppercase; color: #57534e; }
  .admin-page .badge.enviado { border-color: #fed7aa; background: #fff7ed; color: #c2410c; }
  .admin-page .badge.entregue { border-color: #a7f3d0; background: #ecfdf5; color: #047857; }
  .admin-page .badge.cancelado { border-color: #fecaca; background: #fef2f2; color: #b91c1c; }
  .admin-page .badge.cancelado_confirmado { border-color: #fecaca; background: #fef2f2; color: #991b1b; }
  .admin-page .badge.confirmado { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
  .admin-page .badge.producao { border-color: #fde68a; background: #fffbeb; color: #b45309; }
  .admin-page .badge.saiu_entrega { border-color: #bae6fd; background: #f0f9ff; color: #0369a1; }
  @media (min-width: 640px) { .admin-page h1 { font-size: 34px; } }
`,ge=`
  .admin-page .finance-page { display: grid; gap: .75rem; }
  .admin-page .finance-page > .finance-hero { display: none; }
  .admin-page .finance-mobile-movements { display: none; }
  .admin-page .finance-movements-card { max-height: 30rem; display: grid; grid-template-rows: auto minmax(0,1fr); }
  .admin-page .finance-movements-scroll { min-height: 0; overflow: auto; padding-right: .15rem; }
  .admin-page .finance-hero { overflow: visible; border-radius: 22px; border: 1px solid #27251f; background: #242622; box-shadow: 0 18px 40px -22px rgba(0,0,0,.55); isolation: isolate; }
  .admin-page .finance-hero-head { position: relative; display: grid; gap: .85rem; border-radius: 22px 22px 0 0; background: linear-gradient(135deg, #242622, #1c1d1b); padding: 1rem; color: #fff; }
  .admin-page .finance-hero-head::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .055; background-image: radial-gradient(currentColor 1.4px, transparent 1.4px); background-size: 16px 16px; }
  .admin-page .finance-hero-head > * { position: relative; z-index: 1; }
  .admin-page .finance-hero-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
  .admin-page .finance-hero-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: .5rem; }
  .admin-page .finance-hero .compact-kicker { color: #fed7aa; }
  .admin-page .finance-hero h1 { color: #fff; }
  .admin-page .finance-hero p { max-width: 32rem; color: rgba(255,255,255,.58); font-size: .86rem; font-weight: 700; }
  .admin-page .finance-holes { pointer-events: none; display: flex; justify-content: space-around; padding: 0 1rem; transform: translateY(50%); }
  .admin-page .finance-holes span { width: .65rem; height: .65rem; border-radius: 999px; background: #fffefa; }
  .admin-page .finance-metrics-strip { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: .5rem; border-radius: 0 0 20px 20px; background: #f5f1ea; padding: 1.25rem 1rem .85rem; }
  .admin-page .finance-metric { border-radius: 18px; border: 1px solid #ded9d1; background: rgba(255,254,250,.94); padding: 1rem; box-shadow: 0 12px 30px rgba(25,27,24,.055); }
  .admin-page .finance-metrics-strip .finance-metric { border-radius: 0 1rem 1rem .375rem; border-left: 2px dashed #d6d3d1; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .finance-metric.accent { border-color: #ea580c; background: #ea580c; color: #fff; }
  .admin-page .finance-metric.accent span,
  .admin-page .finance-metric.accent small { color: rgba(255,255,255,.72); }
  .admin-page .finance-metric strong { display: block; margin-top: .42rem; overflow-wrap: anywhere; font-size: clamp(1.05rem, .84rem + .62vw, 1.45rem); line-height: 1; font-weight: 950; color: inherit; }
  .admin-page .report-chart-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .75rem; }
  .admin-page .report-chart-card { min-width: 0; display: grid; gap: .85rem; border-radius: 16px; border: 1px solid #ded9d1; border-left: 2px dashed #d6d3d1; background: #fffefa; padding: 1rem; box-shadow: 0 12px 30px rgba(25,27,24,.055); }
  .admin-page .report-chart-card.is-emphasis { border-color: #fed7aa; background: #fff7ed; }
  .admin-page .report-chart-head { display: flex; align-items: flex-start; justify-content: space-between; gap: .75rem; }
  .admin-page .report-chart-head div { min-width: 0; display: grid; gap: .18rem; }
  .admin-page .report-chart-head h2 { font-size: .95rem; line-height: 1.1; }
  .admin-page .report-chart-head p { font-size: .76rem; font-weight: 700; line-height: 1.35; }
  .admin-page .report-chart-chip { border-radius: 999px; background: #1c1917; padding: .36rem .52rem; color: #fff; font-size: 10px; font-weight: 950; white-space: nowrap; }
  .admin-page .report-bars { display: grid; gap: .55rem; }
  .admin-page .report-bar-row { display: grid; grid-template-columns: minmax(5.8rem,.72fr) minmax(0,1fr) auto; align-items: center; gap: .55rem; }
  .admin-page .report-bar-label { min-width: 0; overflow: hidden; color: #44403c; font-size: .76rem; font-weight: 900; text-overflow: ellipsis; white-space: nowrap; }
  .admin-page .report-bar-track { overflow: hidden; height: .72rem; border-radius: 999px; background: #e7e5e4; }
  .admin-page .report-bar-fill { display: block; height: 100%; min-width: 3px; border-radius: inherit; background: var(--bar-color, #c2410c); }
  .admin-page .report-bar-value { color: #1c1917; font-size: .76rem; font-weight: 950; text-align: right; white-space: nowrap; }
  .admin-page .report-column-chart { min-height: 12rem; display: grid; grid-auto-flow: column; grid-auto-columns: minmax(1.8rem,1fr); align-items: end; gap: .38rem; border-bottom: 1px solid #d6d3d1; padding-top: .5rem; }
  .admin-page .report-column { min-width: 0; display: grid; grid-template-rows: auto minmax(1rem,1fr) auto; align-items: end; gap: .32rem; height: 100%; text-align: center; }
  .admin-page .report-column strong { color: #44403c; font-size: .62rem; font-weight: 900; }
  .admin-page .report-column i { display: block; width: 100%; min-height: .18rem; border-radius: .45rem .45rem 0 0; background: linear-gradient(180deg, #ea580c, #9a3412); }
  .admin-page .report-column span { overflow: hidden; color: #78716c; font-size: .62rem; font-weight: 900; text-overflow: ellipsis; white-space: nowrap; }
  .admin-page .report-empty { border-radius: .9rem; border: 1px dashed #d6d3d1; background: #fafaf9; padding: 1rem; color: #78716c; font-size: .82rem; font-weight: 800; text-align: center; }
  @media (max-width: 767px) {
    .admin-page .finance-hero-row { display: grid; gap: .8rem; }
    .admin-page .finance-hero-actions { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }
    .admin-page .finance-metrics-strip { grid-template-columns: repeat(2,minmax(0,1fr)); padding-inline: .75rem; }
    .admin-page .finance-desktop-movements { display: none; }
    .admin-page .finance-mobile-movements { display: grid; gap: .5rem; }
    .admin-page .finance-mobile-row { display: grid; gap: .45rem; border-radius: .85rem; border: 1px solid #e7e5e4; border-left: 2px dashed #d6d3d1; background: #fffefa; padding: .65rem; }
    .admin-page .finance-mobile-row-top { display: flex; align-items: flex-start; justify-content: space-between; gap: .55rem; }
    .admin-page .finance-mobile-row h3 { margin: 0; font-size: .84rem; font-weight: 950; color: #1c1917; }
    .admin-page .finance-mobile-row time { font-size: .68rem; font-weight: 800; color: #78716c; }
    .admin-page .finance-mobile-row-meta { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .35rem; }
    .admin-page .finance-mobile-row-meta span { border-radius: .55rem; background: #f5f1ea; padding: .38rem .45rem; font-size: .68rem; font-weight: 850; color: #78716c; }
    .admin-page .finance-mobile-row-meta strong { display: block; margin-top: .12rem; overflow-wrap: anywhere; font-size: .82rem; line-height: 1; font-weight: 950; color: #1c1917; }
    .admin-page .finance-mobile-row .badge { width: max-content; min-height: 1.45rem; padding-inline: .5rem; font-size: 9px; }
    .admin-page .report-chart-grid { grid-template-columns: 1fr; }
    .admin-page .report-chart-card { padding: .75rem; border-radius: 14px; }
    .admin-page .report-chart-head { display: grid; }
    .admin-page .report-chart-chip { justify-self: start; }
    .admin-page .report-bar-row { grid-template-columns: minmax(4.9rem,.64fr) minmax(0,1fr) auto; gap: .4rem; }
    .admin-page .report-column-chart { overflow-x: auto; grid-auto-columns: 2.2rem; }
  }
`,L=[`#ea580c`,`#1c1917`,`#0f766e`,`#2563eb`,`#a16207`,`#7c3aed`,`#be123c`,`#64748b`];function _e(e,t=100){return!Number.isFinite(e)||e<=0?0:Math.min(t,Math.max(0,e))}function R(e,t){let n=e.consolidationActuals?.find(e=>e.date===t.date&&e.teamId===t.teamId&&e.mealTypeId===t.mealTypeId);return Number(n?.quantity??t.actualQuantity??t.quantity??0)}function ve(e,t){return Number(e.mealCatalog?.find(e=>e.id===t.mealTypeId)?.unitPrice??t.unitPrice??e.settings?.defaultMealUnitPrice??0)}function z({children:e,className:t=``,kicker:n,title:r,subtitle:i,chip:a}){return(0,h.jsxs)(`article`,{className:`report-chart-card ${t}`.trim(),children:[(0,h.jsxs)(`header`,{className:`report-chart-head`,children:[(0,h.jsxs)(`div`,{children:[n?(0,h.jsx)(`span`,{className:`compact-kicker`,children:n}):null,(0,h.jsx)(`h2`,{children:r}),i?(0,h.jsx)(`p`,{children:i}):null]}),a?(0,h.jsx)(`span`,{className:`report-chart-chip`,children:a}):null]}),e]})}function ye(){return(0,h.jsx)(`div`,{className:`report-empty`,children:`Sem dados suficientes no periodo filtrado.`})}function B({items:e,format:t,limit:n=8}){let r=e.slice(0,n),i=Math.max(...r.map(e=>Number(e.value??0)),1);return r.length?(0,h.jsx)(`div`,{className:`report-bars`,children:r.map((e,n)=>{let r=Number(e.value??0);return(0,h.jsxs)(`div`,{className:`report-bar-row`,children:[(0,h.jsx)(`span`,{className:`report-bar-label`,title:e.label,children:e.label}),(0,h.jsx)(`span`,{className:`report-bar-track`,children:(0,h.jsx)(`b`,{className:`report-bar-fill`,style:{"--bar-color":L[n%L.length],width:`${_e(r/i*100)}%`}})}),(0,h.jsx)(`span`,{className:`report-bar-value`,children:t(r)})]},e.label)})}):(0,h.jsx)(ye,{})}function be(e){let{financeFilter:t,financePeriodLabel:n,financeRows:r,formatDate:i,icon:a,money:o,state:s,STATUS_LABEL:c}=e,l=t??{range:`all`,start:``,end:``},u=r??[],d=n??`Todo periodo`,f=l.range===`all`,p=l.range===`custom`,m=u.filter(e=>e.status===`entregue`),_=e=>R(s,e)*ve(s,e),b=u.reduce((e,t)=>e+_(t),0),C=m.reduce((e,t)=>e+_(t),0),w=b-C,T=u.reduce((e,t)=>e+R(s,t),0),E=Object.values(u.reduce((e,t)=>{let n=t.mealType||`Sem tipo`;return e[n]??={label:n,value:0},e[n].value+=_(t),e},{})).sort((e,t)=>t.value-e.value),D=Object.values(u.reduce((e,t)=>{let n=t.sectionName||t.location||`Sem equipe`;return e[n]??={label:n,value:0},e[n].value+=_(t),e},{})).sort((e,t)=>t.value-e.value),O=[...u].sort((e,t)=>t.date.localeCompare(e.date));return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(`style`,{children:he+ge}),(0,h.jsxs)(`section`,{className:`finance-page`,children:[(0,h.jsx)(v,{className:`admin-corner-action-receipt`,kicker:`Financeiro`,title:`Financeiro`,totalValue:o(b),totalLabel:`previsto em ${d}`,description:`Custos, entregas e pendencias. Periodo: ${d}.`,actions:(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(y,{icon:a}),(0,h.jsxs)(x,{icon:a,children:[(0,h.jsxs)(`select`,{"data-finance-range":!0,defaultValue:l.range,children:[(0,h.jsx)(`option`,{value:`all`,children:`Todo periodo`}),(0,h.jsx)(`option`,{value:`day`,children:`Dia`}),(0,h.jsx)(`option`,{value:`week`,children:`Semana`}),(0,h.jsx)(`option`,{value:`month`,children:`Mes`}),(0,h.jsx)(`option`,{value:`custom`,children:`Periodo personalizado`})]}),(0,h.jsx)(`input`,{type:`date`,defaultValue:l.start||s.settings.defaultMealDate,"data-finance-start":!0,"aria-label":p?`Inicio do periodo`:`Data de referencia`,disabled:f}),(0,h.jsx)(`input`,{type:`date`,defaultValue:l.end||l.start||s.settings.defaultMealDate,"data-finance-end":!0,"aria-label":`Fim do periodo`,disabled:!p}),(0,h.jsxs)(`select`,{"data-finance-supplier":!0,defaultValue:l.supplierCompanyId||``,"aria-label":`Fornecedor`,children:[(0,h.jsx)(`option`,{value:``,children:`Todos fornecedores`}),(s.supplierCompanies??[]).map(e=>(0,h.jsx)(`option`,{value:e.id,children:e.tradeName||e.legalName},e.id))]}),(0,h.jsxs)(`select`,{"data-finance-meal":!0,defaultValue:l.mealTypeId||``,"aria-label":`Tipo de refeicao`,children:[(0,h.jsx)(`option`,{value:``,children:`Todas refeicoes`}),(s.mealCatalog??s.mealTypes??[]).map(e=>(0,h.jsx)(`option`,{value:e.id,children:e.label},e.id))]}),(0,h.jsxs)(`select`,{"data-finance-team":!0,defaultValue:l.teamId||``,"aria-label":`Efetivo ou local`,children:[(0,h.jsx)(`option`,{value:``,children:`Todos locais`}),(s.workSections??[]).map(e=>(0,h.jsx)(`option`,{value:e.id,children:e.name},e.id))]}),(0,h.jsxs)(`select`,{"data-finance-origin":!0,defaultValue:l.originRole||``,"aria-label":`Origem do pedido`,children:[(0,h.jsx)(`option`,{value:``,children:`Todas origens`}),(0,h.jsx)(`option`,{value:`admin`,children:`Admin`}),(0,h.jsx)(`option`,{value:`encarregado`,children:`Encarregado`})]}),(0,h.jsx)(`button`,{className:`btn primary small`,type:`button`,"data-finance-apply":!0,children:`Aplicar`})]}),(0,h.jsxs)(`button`,{className:`btn primary`,"data-export-finance":`admin`,children:[(0,h.jsx)(g,{icon:a,name:`chart`,size:15}),`Gerar PDF`]})]}),metrics:[{icon:a,iconName:`chart`,label:`Custo total`,value:o(b)},{icon:a,iconName:`truck`,label:`Pago/entregue`,value:o(C)},{icon:a,iconName:`clock`,label:`Em aberto`,value:o(w)},{icon:a,iconName:`utensils`,label:`Ticket medio`,value:o(T?b/T:0)}]}),(0,h.jsxs)(`div`,{className:`report-chart-grid`,children:[(0,h.jsx)(z,{kicker:`Financeiro`,title:`Custo por refeicao`,subtitle:`Estimativa baseada no preco unitario cadastrado.`,chip:o(b),children:(0,h.jsx)(B,{items:E,format:o})}),(0,h.jsx)(z,{kicker:`Financeiro`,title:`Custo por equipe / trecho`,subtitle:`Frentes com maior impacto financeiro no periodo filtrado.`,chip:o(b),children:(0,h.jsx)(B,{items:D,format:o})})]}),(0,h.jsxs)(`article`,{className:`finance-movements-card overflow-hidden rounded-2xl border border-l-2 border-dashed border-stone-300 bg-white p-5 shadow-sm transition-all hover:shadow-md`,children:[(0,h.jsx)(`h2`,{className:`mb-4 text-xs font-black uppercase tracking-widest text-stone-800`,children:`Movimentações do Período`}),(0,h.jsxs)(`div`,{className:`finance-movements-scroll`,children:[(0,h.jsxs)(`div`,{className:`finance-mobile-movements`,children:[O.map(e=>(0,h.jsxs)(`article`,{className:`finance-mobile-row`,children:[(0,h.jsxs)(`div`,{className:`finance-mobile-row-top`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`h3`,{children:e.mealType}),(0,h.jsx)(`time`,{children:i(e.date)})]}),(0,h.jsx)(`span`,{className:`badge ${e.status}`,children:S(c,e.status)})]}),(0,h.jsxs)(`div`,{className:`finance-mobile-row-meta`,children:[(0,h.jsxs)(`span`,{children:[`Consumido`,(0,h.jsx)(`strong`,{children:R(s,e)})]}),(0,h.jsxs)(`span`,{children:[`Valor`,(0,h.jsx)(`strong`,{children:o(_(e))})]})]})]},e.id)),!O.length&&(0,h.jsx)(`div`,{className:`empty`,children:`Nenhuma movimentacao encontrada para o periodo.`})]}),(0,h.jsx)(`div`,{className:`finance-desktop-movements overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 shadow-inner`,children:(0,h.jsxs)(`table`,{className:`w-full min-w-[600px] text-left text-sm`,children:[(0,h.jsx)(`thead`,{className:`border-b border-stone-200 bg-stone-100 text-[10px] uppercase tracking-widest text-stone-500`,children:(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`th`,{className:`px-5 py-3.5 font-black`,children:`Data`}),(0,h.jsx)(`th`,{className:`px-5 py-3.5 font-black`,children:`Tipo`}),(0,h.jsx)(`th`,{className:`px-5 py-3.5 text-center font-black`,children:`Consumido`}),(0,h.jsx)(`th`,{className:`px-5 py-3.5 font-black`,children:`Valor`}),(0,h.jsx)(`th`,{className:`px-5 py-3.5 font-black`,children:`Status`})]})}),(0,h.jsxs)(`tbody`,{className:`divide-y divide-stone-100 bg-white`,children:[O.map(e=>(0,h.jsxs)(`tr`,{className:`group/row cursor-default transition-colors hover:bg-stone-50`,children:[(0,h.jsx)(`td`,{className:`px-5 py-3.5 font-medium text-stone-500`,children:i(e.date)}),(0,h.jsx)(`td`,{className:`px-5 py-3.5 font-bold text-stone-700`,children:e.mealType}),(0,h.jsx)(`td`,{className:`px-5 py-3.5 text-center font-bold text-stone-600`,children:R(s,e)}),(0,h.jsx)(`td`,{className:`px-5 py-3.5 font-black text-stone-900 transition-colors group-hover/row:text-blue-700`,children:o(_(e))}),(0,h.jsx)(`td`,{className:`px-5 py-3.5`,children:(0,h.jsx)(`span`,{className:`badge ${e.status}`,children:S(c,e.status)})})]},e.id)),!u.length&&(0,h.jsx)(`tr`,{children:(0,h.jsx)(`td`,{colSpan:`5`,className:`px-5 py-8 text-center text-sm font-bold text-stone-500`,children:`Nenhuma movimentação encontrada para o período.`})})]})]})})]})]})]})]})}var xe=`
  .admin-page {
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    display: grid;
    gap: 0.75rem;
    color: #1c1917;
  }
  .admin-page h1,
  .admin-page h2,
  .admin-page h3,
  .admin-page p { margin: 0; }
  .admin-page h1 { font-size: 26px; line-height: 1; font-weight: 900; letter-spacing: 0; }
  .admin-page h2 { font-size: 1.125rem; font-weight: 900; color: #1c1917; }
  .admin-page h3 { font-weight: 900; }
  .admin-page p { font-size: 0.875rem; color: #78716c; }
  .admin-page .compact-kicker,
  .admin-page .finance-metric span {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: #c2410c;
  }
  .admin-page .finance-metric small { color: #78716c; font-size: .75rem; font-weight: 700; }

  .admin-page .admin-filter-menu,
  .admin-page .export-menu { position: relative; }
  .admin-page .admin-filter-popover,
  .admin-page .export-options { position: absolute; right: 0; z-index: 20; margin-top: .5rem; display: grid; min-width: 10rem; gap: .5rem; border-radius: 1rem; border: 1px solid #e7e5e4; background: #fff; padding: .75rem; box-shadow: 0 25px 50px rgba(0,0,0,.18); }
  .admin-page .finance-hero-actions .admin-filter-popover,
  .admin-page .finance-hero-actions .export-options,
  .admin-page .admin-receipt-actions .admin-filter-popover,
  .admin-page .admin-receipt-actions .export-options {
    min-width: 11.5rem;
    width: 11.5rem;
    gap: .4rem;
    border-radius: .75rem;
    padding: .55rem;
    box-shadow: 0 16px 34px rgba(25,27,24,.2);
  }
  .admin-page .finance-hero-actions .export-options label {
    display: grid;
    gap: .18rem;
  }
  .admin-page .admin-receipt-actions .export-options label,
  .admin-page .admin-receipt-actions .admin-filter-popover label {
    display: grid;
    gap: .18rem;
  }
  .admin-page .finance-hero-actions .export-options label span,
  .admin-page .admin-receipt-actions .export-options label span,
  .admin-page .admin-receipt-actions .admin-filter-popover label span {
    color: #78716c;
    font-size: 8.5px;
    font-weight: 950;
    letter-spacing: .06em;
    text-transform: uppercase;
  }
  .admin-page .finance-hero-actions .admin-filter-popover input,
  .admin-page .finance-hero-actions .admin-filter-popover select,
  .admin-page .finance-hero-actions .admin-filter-popover button,
  .admin-page .finance-hero-actions .export-options input,
  .admin-page .finance-hero-actions .export-options select,
  .admin-page .finance-hero-actions .export-options button,
  .admin-page .admin-receipt-actions .admin-filter-popover input,
  .admin-page .admin-receipt-actions .admin-filter-popover select,
  .admin-page .admin-receipt-actions .admin-filter-popover button,
  .admin-page .admin-receipt-actions .export-options input,
  .admin-page .admin-receipt-actions .export-options select,
  .admin-page .admin-receipt-actions .export-options button {
    min-height: 1.9rem;
    border-radius: .5rem;
    padding-inline: .5rem;
    font-size: .72rem;
  }
`,Se=`
  .admin-page > .finance-hero { display: none; }
  .admin-page .finance-hero { overflow: visible; border-radius: 18px; border: 1px solid #27251f; background: #242622; box-shadow: 0 12px 30px -15px rgba(0,0,0,.5); isolation: isolate; }
  .admin-page .finance-hero-head { position: relative; display: flex; flex-direction: column; gap: 0.85rem; border-radius: 18px 18px 0 0; background: linear-gradient(135deg, #242622, #1c1d1b); padding: 1.25rem; color: #fff; }
  .admin-page .finance-hero-head::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .055; background-image: radial-gradient(currentColor 1.4px, transparent 1.4px); background-size: 16px 16px; }
  .admin-page .finance-hero-head > * { position: relative; z-index: 1; }

  .admin-page .finance-hero-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }

  /* Botão de Voltar Redesenhado e Apontando para fora */
  .admin-page .sleek-back-btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.5rem 0.25rem 0; color: #a8a29e; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; background: transparent; border: none; cursor: pointer; transition: color 0.2s; margin-bottom: 0.25rem; }
  .admin-page .sleek-back-btn:hover { color: #fff; }

  .admin-page .finance-hero .compact-kicker { color: #fed7aa; display: block; margin-bottom: 0.25rem; }
  .admin-page .finance-hero h1 { color: #fff; font-size: 1.5rem; margin-bottom: 0.25rem; }
  .admin-page .finance-hero p { max-width: 32rem; color: rgba(255,255,255,.58); font-size: .85rem; font-weight: 600; }

  /* Botões de Ação (Filtro e Exportar) mais bonitos e proporcionais */
  .admin-page .finance-hero-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 0.5rem; }
  .admin-page .finance-hero-actions summary,
  .admin-page .finance-hero-actions .btn { display: inline-flex; min-height: 2rem; align-items: center; gap: 0.4rem; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.08); padding: 0 0.75rem; font-size: 0.75rem; font-weight: 800; color: #fff; cursor: pointer; transition: all 0.2s; }
  .admin-page .finance-hero-actions summary:hover,
  .admin-page .finance-hero-actions .btn:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.25); }

  .admin-page .finance-holes { pointer-events: none; display: flex; justify-content: space-around; padding: 0 1rem; transform: translateY(50%); }
  .admin-page .finance-holes span { width: .5rem; height: .5rem; border-radius: 999px; background: #fffefa; }

  .admin-page .finance-metrics-strip { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: .5rem; border-radius: 0 0 16px 16px; background: #f5f1ea; padding: 1.25rem 1rem 1rem; }
  .admin-page .finance-metric { border-radius: 12px; border: 1px solid #ded9d1; background: rgba(255,254,250,.94); padding: 0.85rem; box-shadow: 0 4px 12px rgba(25,27,24,.03); }
  .admin-page .finance-metrics-strip .finance-metric { border-radius: 0 .75rem .75rem .25rem; border-left: 2px dashed #d6d3d1; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .finance-metric.accent { border-color: #ea580c; background: #ea580c; color: #fff; }
  .admin-page .finance-metric.accent span,
  .admin-page .finance-metric.accent small { color: rgba(255,255,255,.72); }
  .admin-page .finance-metric strong { display: block; margin-top: 0.25rem; overflow-wrap: anywhere; font-size: 1.25rem; line-height: 1; font-weight: 950; color: inherit; }
  .admin-page .daily-report-card { display: grid; gap: .85rem; border-radius: 18px; border: 1px solid #ded9d1; border-left: 2px dashed #d6d3d1; background: #fffefa; padding: 1rem; box-shadow: 0 12px 30px rgba(25,27,24,.055); }
  .admin-page .daily-report-card.is-pending { background: #fafaf9; }
  .admin-page .daily-report-main { display: grid; grid-template-columns: 3rem minmax(0,1fr) auto; align-items: center; gap: .85rem; }
  .admin-page .daily-report-icon { display: grid; width: 3rem; height: 3rem; place-items: center; border-radius: .9rem; background: #fff0e8; color: #c2410c; }
  .admin-page .daily-report-copy { min-width: 0; display: grid; gap: .22rem; }
  .admin-page .daily-report-copy h2 { font-size: 1rem; line-height: 1.1; }
  .admin-page .daily-report-copy p { max-width: 48rem; font-size: .82rem; font-weight: 700; line-height: 1.35; }
  .admin-page .daily-report-status { justify-self: end; border-radius: 999px; border: 1px solid #bbf7d0; background: #ecfdf5; padding: .45rem .7rem; color: #047857; font-size: 10px; font-weight: 950; text-transform: uppercase; letter-spacing: .08em; white-space: nowrap; }
  .admin-page .daily-report-card.is-pending .daily-report-status { border-color: #fed7aa; background: #fff7ed; color: #c2410c; }
  .admin-page .daily-report-actions { display: flex; flex-wrap: wrap; gap: .5rem; }

  /* COMPACTAÇÃO EXTREMA PARA O MOBILE */
  .admin-page .report-analytics { display: grid; gap: .75rem; }
  .admin-page .report-chart-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .75rem; }
  .admin-page .report-chart-grid.wide { grid-template-columns: 1.08fr .92fr; }
  .admin-page .report-chart-card { min-width: 0; display: grid; gap: .85rem; border-radius: 16px; border: 1px solid #ded9d1; border-left: 2px dashed #d6d3d1; background: #fffefa; padding: 1rem; box-shadow: 0 12px 30px rgba(25,27,24,.055); }
  .admin-page .report-chart-card.is-emphasis { border-color: #fed7aa; background: #fff7ed; }
  .admin-page .report-chart-head { display: flex; align-items: flex-start; justify-content: space-between; gap: .75rem; }
  .admin-page .report-chart-head div { min-width: 0; display: grid; gap: .18rem; }
  .admin-page .report-chart-head h2 { font-size: .95rem; line-height: 1.1; }
  .admin-page .report-chart-head p { font-size: .76rem; font-weight: 700; line-height: 1.35; }
  .admin-page .report-chart-chip { border-radius: 999px; background: #1c1917; padding: .36rem .52rem; color: #fff; font-size: 10px; font-weight: 950; white-space: nowrap; }
  .admin-page .report-bars { display: grid; gap: .55rem; }
  .admin-page .report-bar-row { display: grid; grid-template-columns: minmax(5.8rem,.72fr) minmax(0,1fr) auto; align-items: center; gap: .55rem; }
  .admin-page .report-bar-label { min-width: 0; overflow: hidden; color: #44403c; font-size: .76rem; font-weight: 900; text-overflow: ellipsis; white-space: nowrap; }
  .admin-page .report-bar-track { overflow: hidden; height: .72rem; border-radius: 999px; background: #e7e5e4; }
  .admin-page .report-bar-fill { display: block; height: 100%; min-width: 3px; border-radius: inherit; background: var(--bar-color, #c2410c); }
  .admin-page .report-bar-value { color: #1c1917; font-size: .76rem; font-weight: 950; text-align: right; white-space: nowrap; }
  .admin-page .report-grouped-bars { display: grid; gap: .68rem; }
  .admin-page .report-group-row { display: grid; grid-template-columns: minmax(5.8rem,.62fr) minmax(0,1fr); gap: .65rem; align-items: center; }
  .admin-page .report-group-stack { display: grid; gap: .28rem; }
  .admin-page .report-mini-track { height: .55rem; overflow: hidden; border-radius: 999px; background: #e7e5e4; }
  .admin-page .report-mini-track b { display: block; height: 100%; min-width: 3px; border-radius: inherit; }
  .admin-page .report-donut-wrap { display: grid; grid-template-columns: 9rem minmax(0,1fr); align-items: center; gap: 1rem; }
  .admin-page .report-donut { width: 9rem; aspect-ratio: 1; border-radius: 999px; background: conic-gradient(var(--donut-stops, #d6d3d1 0 100%)); position: relative; box-shadow: inset 0 0 0 1px rgba(0,0,0,.04); }
  .admin-page .report-donut::after { content: attr(data-center); position: absolute; inset: 1.95rem; display: grid; place-items: center; border-radius: inherit; background: #fffefa; color: #1c1917; font-size: 1rem; font-weight: 950; text-align: center; }
  .admin-page .report-legend { display: grid; gap: .45rem; }
  .admin-page .report-legend-row { display: grid; grid-template-columns: .55rem minmax(0,1fr) auto; align-items: center; gap: .45rem; color: #57534e; font-size: .76rem; font-weight: 850; }
  .admin-page .report-legend-dot { width: .55rem; height: .55rem; border-radius: 999px; background: var(--dot-color, #c2410c); }
  .admin-page .report-column-chart { min-height: 12rem; display: grid; grid-auto-flow: column; grid-auto-columns: minmax(1.8rem,1fr); align-items: end; gap: .38rem; border-bottom: 1px solid #d6d3d1; padding-top: .5rem; }
  .admin-page .report-column { min-width: 0; display: grid; grid-template-rows: auto minmax(1rem,1fr) auto; align-items: end; gap: .32rem; height: 100%; text-align: center; }
  .admin-page .report-column strong { color: #44403c; font-size: .62rem; font-weight: 900; }
  .admin-page .report-column i { display: block; width: 100%; min-height: .18rem; border-radius: .45rem .45rem 0 0; background: linear-gradient(180deg, #ea580c, #9a3412); }
  .admin-page .report-column span { overflow: hidden; color: #78716c; font-size: .62rem; font-weight: 900; text-overflow: ellipsis; white-space: nowrap; }
  .admin-page .report-heatmap { display: grid; gap: .38rem; }
  .admin-page .report-heat-row { display: grid; grid-template-columns: 5.5rem repeat(var(--heat-count), minmax(2.2rem,1fr)); gap: .32rem; align-items: center; }
  .admin-page .report-heat-row strong { color: #44403c; font-size: .7rem; font-weight: 950; }
  .admin-page .report-heat-cell { min-height: 2rem; display: grid; place-items: center; border-radius: .45rem; background: color-mix(in srgb, #ea580c var(--heat, 0%), #f5f5f4); color: #1c1917; font-size: .68rem; font-weight: 950; }
  .admin-page .report-insights { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: .75rem; }
  .admin-page .report-insight { display: grid; gap: .25rem; border-radius: 14px; border: 1px solid #e7e5e4; background: #fff; padding: .85rem; }
  .admin-page .report-insight span { color: #c2410c; font-size: 10px; font-weight: 950; text-transform: uppercase; letter-spacing: .08em; }
  .admin-page .report-insight strong { color: #1c1917; font-size: 1.15rem; line-height: 1; }
  .admin-page .report-empty { border-radius: .9rem; border: 1px dashed #d6d3d1; background: #fafaf9; padding: 1rem; color: #78716c; font-size: .82rem; font-weight: 800; text-align: center; }

  @media (max-width: 767px) {
    .admin-page .finance-hero-head { padding: 0.75rem; gap: 0.5rem; }
    .admin-page .sleek-back-btn { font-size: 0.65rem; padding-bottom: 0; margin-bottom: 0; }
    .admin-page .finance-hero .compact-kicker { font-size: 9px; margin-bottom: 0.15rem; }
    .admin-page .finance-hero h1 { font-size: 1.15rem; margin-bottom: 0.15rem; }
    .admin-page .finance-hero p { font-size: 0.7rem; line-height: 1.2; }

    .admin-page .finance-hero-row { flex-direction: column; gap: 0.6rem; }
    .admin-page .finance-hero-actions { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; }
    .admin-page .finance-hero-actions summary,
    .admin-page .finance-hero-actions .btn { width: 100%; justify-content: center; min-height: 1.8rem; font-size: 0.7rem; padding: 0 0.5rem; }

    .admin-page .finance-metrics-strip { grid-template-columns: repeat(2,minmax(0,1fr)); padding: 1rem 0.5rem 0.6rem; gap: 0.4rem; }
    .admin-page .finance-metric { padding: 0.5rem; }
    .admin-page .finance-metric span { font-size: 9px; }
    .admin-page .finance-metric strong { font-size: 1.05rem; margin-top: 0.15rem; }
    .admin-page .finance-metric small { font-size: 0.65rem; }
    .admin-page .daily-report-main { grid-template-columns: 2.5rem minmax(0,1fr); align-items: start; }
    .admin-page .daily-report-icon { width: 2.5rem; height: 2.5rem; border-radius: .75rem; }
    .admin-page .daily-report-status { grid-column: 1 / -1; justify-self: start; }
    .admin-page .daily-report-actions { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }
    .admin-page .daily-report-actions .btn { width: 100%; }
    .admin-page .report-chart-grid,
    .admin-page .report-chart-grid.wide,
    .admin-page .report-insights { grid-template-columns: 1fr; }
    .admin-page .report-chart-card { padding: .75rem; border-radius: 14px; }
    .admin-page .report-chart-head { display: grid; }
    .admin-page .report-chart-chip { justify-self: start; }
    .admin-page .report-bar-row { grid-template-columns: minmax(4.9rem,.64fr) minmax(0,1fr) auto; gap: .4rem; }
    .admin-page .report-donut-wrap { grid-template-columns: 1fr; justify-items: center; }
    .admin-page .report-legend { width: 100%; }
    .admin-page .report-column-chart { overflow-x: auto; grid-auto-columns: 2.2rem; }
    .admin-page .report-heat-row { grid-template-columns: 4.6rem repeat(var(--heat-count), minmax(2rem,1fr)); gap: .24rem; }
    .admin-page .report-heat-row strong,
    .admin-page .report-heat-cell { font-size: .62rem; }
  }
`,V=[`#ea580c`,`#1c1917`,`#0f766e`,`#2563eb`,`#a16207`,`#7c3aed`,`#be123c`,`#64748b`],H=[`Dom`,`Seg`,`Ter`,`Qua`,`Qui`,`Sex`,`Sab`];function U(e,t=100){return!Number.isFinite(e)||e<=0?0:Math.min(t,Math.max(0,e))}function W(e){return new Intl.NumberFormat(`pt-BR`,{maximumFractionDigits:0}).format(Number(e??0))}function G(e){return new Intl.NumberFormat(`pt-BR`,{style:`currency`,currency:`BRL`}).format(Number(e??0))}function Ce(e){if(!e)return`-`;let[,t,n]=String(e).split(`-`);return t&&n?`${n}/${t}`:String(e)}function we(e,t){let n=e.consolidationActuals?.find(e=>e.date===t.date&&e.teamId===t.teamId&&e.mealTypeId===t.mealTypeId);return Number(n?.quantity??t.actualQuantity??t.quantity??0)}function Te(e,t){return Number(t.sectionHeadcount??t.headcount??e.workSections?.find(e=>e.id===t.teamId)?.headcount??0)}function Ee(e,t){return Number(e.mealCatalog?.find(e=>e.id===t.mealTypeId)?.unitPrice??t.unitPrice??e.settings?.defaultMealUnitPrice??0)}function De(e,t,n={}){let r=t.reduce((t,r)=>{let i=Number(r.quantity??0),a=we(e,r),o=Te(e,r),s=a*Ee(e,r),c=r.mealType||`Sem tipo`,l=r.sectionName||r.location||`Sem equipe`,u=n[r.status]??r.status??`Sem status`;t.requested+=i,t.consumed+=a,t.effective+=o,t.value+=s,t.byMeal[c]??={label:c,requested:0,consumed:0,effective:0,value:0},t.byMeal[c].requested+=i,t.byMeal[c].consumed+=a,t.byMeal[c].effective+=o,t.byMeal[c].value+=s,t.bySection[l]??={label:l,requested:0,consumed:0,effective:0,value:0},t.bySection[l].requested+=i,t.bySection[l].consumed+=a,t.bySection[l].effective+=o,t.bySection[l].value+=s,t.byStatus[u]??={label:u,value:0},t.byStatus[u].value+=1,t.byDay[r.date]??={label:Ce(r.date),date:r.date,requested:0,consumed:0,effective:0,value:0},t.byDay[r.date].requested+=i,t.byDay[r.date].consumed+=a,t.byDay[r.date].effective+=o,t.byDay[r.date].value+=s;let d=H[new Date(`${r.date}T12:00:00`).getDay()]??`-`;return t.heatmap[d]??={},t.heatmap[d][c]=(t.heatmap[d][c]??0)+a,t},{requested:0,consumed:0,effective:0,value:0,byMeal:{},bySection:{},byStatus:{},byDay:{},heatmap:{}});return{...r,meals:Object.values(r.byMeal).sort((e,t)=>t.consumed-e.consumed),sections:Object.values(r.bySection).sort((e,t)=>t.consumed-e.consumed),statuses:Object.values(r.byStatus).sort((e,t)=>t.value-e.value),days:Object.values(r.byDay).sort((e,t)=>e.date.localeCompare(t.date))}}function K({children:e,className:t=``,kicker:n,title:r,subtitle:i,chip:a}){return(0,h.jsxs)(`article`,{className:`report-chart-card ${t}`.trim(),children:[(0,h.jsxs)(`header`,{className:`report-chart-head`,children:[(0,h.jsxs)(`div`,{children:[n?(0,h.jsx)(`span`,{className:`compact-kicker`,children:n}):null,(0,h.jsx)(`h2`,{children:r}),i?(0,h.jsx)(`p`,{children:i}):null]}),a?(0,h.jsx)(`span`,{className:`report-chart-chip`,children:a}):null]}),e]})}function q(){return(0,h.jsx)(`div`,{className:`report-empty`,children:`Sem dados suficientes no periodo filtrado.`})}function Oe({items:e,valueKey:t=`value`,format:n=W,limit:r=8}){let i=e.slice(0,r),a=Math.max(...i.map(e=>Number(e[t]??0)),1);return i.length?(0,h.jsx)(`div`,{className:`report-bars`,children:i.map((e,r)=>{let i=Number(e[t]??0);return(0,h.jsxs)(`div`,{className:`report-bar-row`,children:[(0,h.jsx)(`span`,{className:`report-bar-label`,title:e.label,children:e.label}),(0,h.jsx)(`span`,{className:`report-bar-track`,children:(0,h.jsx)(`b`,{className:`report-bar-fill`,style:{"--bar-color":V[r%V.length],width:`${U(i/a*100)}%`}})}),(0,h.jsx)(`span`,{className:`report-bar-value`,children:n(i)})]},e.label)})}):(0,h.jsx)(q,{})}function ke({items:e}){let t=e.slice(0,7),n=Math.max(...t.flatMap(e=>[e.requested,e.consumed,e.effective]).map(Number),1);return t.length?(0,h.jsx)(`div`,{className:`report-grouped-bars`,children:t.map(e=>(0,h.jsxs)(`div`,{className:`report-group-row`,children:[(0,h.jsx)(`span`,{className:`report-bar-label`,title:e.label,children:e.label}),(0,h.jsxs)(`div`,{className:`report-group-stack`,children:[(0,h.jsx)(`span`,{className:`report-mini-track`,title:`Solicitado: ${e.requested}`,children:(0,h.jsx)(`b`,{style:{background:`#ea580c`,width:`${U(e.requested/n*100)}%`}})}),(0,h.jsx)(`span`,{className:`report-mini-track`,title:`Consumido: ${e.consumed}`,children:(0,h.jsx)(`b`,{style:{background:`#1c1917`,width:`${U(e.consumed/n*100)}%`}})}),(0,h.jsx)(`span`,{className:`report-mini-track`,title:`Efetivo: ${e.effective||0}`,children:(0,h.jsx)(`b`,{style:{background:`#0f766e`,width:`${U((e.effective||0)/n*100)}%`}})})]})]},e.label))}):(0,h.jsx)(q,{})}function J({items:e,center:t}){let n=e.filter(e=>Number(e.value??e.consumed??0)>0).slice(0,7),r=n.reduce((e,t)=>e+Number(t.value??t.consumed??0),0);if(!n.length||!r)return(0,h.jsx)(q,{});let i=0,a=n.map((e,t)=>{let n=Number(e.value??e.consumed??0),a=i+n/r*100,o=`${V[t%V.length]} ${i}% ${a}%`;return i=a,o}).join(`, `);return(0,h.jsxs)(`div`,{className:`report-donut-wrap`,children:[(0,h.jsx)(`div`,{className:`report-donut`,"data-center":t??W(r),style:{"--donut-stops":a}}),(0,h.jsx)(`div`,{className:`report-legend`,children:n.map((e,t)=>{let n=Number(e.value??e.consumed??0);return(0,h.jsxs)(`div`,{className:`report-legend-row`,children:[(0,h.jsx)(`span`,{className:`report-legend-dot`,style:{"--dot-color":V[t%V.length]}}),(0,h.jsx)(`span`,{className:`report-bar-label`,title:e.label,children:e.label}),(0,h.jsx)(`strong`,{children:W(n)})]},e.label)})})]})}function Y({items:e,valueKey:t=`consumed`,format:n=W,limit:r=14}){let i=e.slice(-r),a=Math.max(...i.map(e=>Number(e[t]??0)),1);return i.length?(0,h.jsx)(`div`,{className:`report-column-chart`,children:i.map(e=>{let r=Number(e[t]??0);return(0,h.jsxs)(`div`,{className:`report-column`,title:`${e.label}: ${n(r)}`,children:[(0,h.jsx)(`strong`,{children:n(r)}),(0,h.jsx)(`i`,{style:{height:`${Math.max(4,r/a*100)}%`}}),(0,h.jsx)(`span`,{children:e.label})]},e.date??e.label)})}):(0,h.jsx)(q,{})}function Ae({meals:e,heatmap:t}){let n=e.slice(0,5).map(e=>e.label),r=Math.max(...Object.values(t).flatMap(e=>n.map(t=>Number(e[t]??0))),1);return n.length?(0,h.jsxs)(`div`,{className:`report-heatmap`,style:{"--heat-count":n.length},children:[(0,h.jsxs)(`div`,{className:`report-heat-row`,children:[(0,h.jsx)(`strong`,{children:`Dia`}),n.map(e=>(0,h.jsx)(`strong`,{title:e,children:e.split(` `)[0]},e))]}),H.map(e=>(0,h.jsxs)(`div`,{className:`report-heat-row`,children:[(0,h.jsx)(`strong`,{children:e}),n.map(n=>{let i=Number(t[e]?.[n]??0);return(0,h.jsx)(`span`,{className:`report-heat-cell`,style:{"--heat":`${U(i/r*82,82)}%`},children:i||`-`},n)})]},e))]}):(0,h.jsx)(q,{})}function je({currentFilter:e,exportMenuOpen:t,icon:n,isAllPeriod:r,isCustomPeriod:i}){return(0,h.jsxs)(`div`,{className:`export-menu ${t===`relatorios`?`open`:``}`,children:[(0,h.jsxs)(`button`,{className:`btn outline small`,type:`button`,"data-export-toggle":`relatorios`,children:[(0,h.jsx)(g,{icon:n,name:`clipboard`,size:14}),`Medicao`]}),t===`relatorios`?(0,h.jsxs)(`div`,{className:`export-options`,children:[(0,h.jsxs)(`label`,{children:[(0,h.jsx)(`span`,{children:`Periodo`}),(0,h.jsxs)(`select`,{"data-report-range":!0,defaultValue:e.range,children:[(0,h.jsx)(`option`,{value:`all`,children:`Todo periodo`}),(0,h.jsx)(`option`,{value:`day`,children:`Dia`}),(0,h.jsx)(`option`,{value:`week`,children:`Semana`}),(0,h.jsx)(`option`,{value:`month`,children:`Mes`}),(0,h.jsx)(`option`,{value:`custom`,children:`Periodo personalizado`})]})]}),(0,h.jsxs)(`label`,{children:[(0,h.jsx)(`span`,{children:`Inicio`}),(0,h.jsx)(`input`,{type:`date`,defaultValue:e.start||``,"data-report-start":!0,disabled:r})]}),(0,h.jsxs)(`label`,{children:[(0,h.jsx)(`span`,{children:`Fim`}),(0,h.jsx)(`input`,{type:`date`,defaultValue:e.end||e.start||``,"data-report-end":!0,disabled:!i})]}),(0,h.jsx)(`button`,{type:`button`,"data-report-apply":!0,children:`Definir`}),(0,h.jsxs)(`button`,{type:`button`,"data-export":`pdf`,children:[(0,h.jsx)(g,{icon:n,name:`clipboard`,size:14}),`PDF`]}),(0,h.jsxs)(`button`,{type:`button`,"data-export":`xlsx`,children:[(0,h.jsx)(g,{icon:n,name:`chart`,size:14}),`Excel`]})]}):null]})}function Me(e=new Date){let t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?``:new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function Ne(e=Me()){let t=new Date(`${e}T12:00:00`);return t.setDate(t.getDate()-1),t.toISOString().slice(0,10)}function X(e){return e?new Intl.DateTimeFormat(`pt-BR`,{dateStyle:`short`}).format(new Date(`${e}T12:00:00`)):`-`}function Pe({icon:e,report:t,reportDate:n}){let r=!!t;return(0,h.jsxs)(`article`,{className:`daily-report-card ${r?`is-available`:`is-pending`}`,children:[(0,h.jsxs)(`div`,{className:`daily-report-main`,children:[(0,h.jsx)(`span`,{className:`daily-report-icon`,children:(0,h.jsx)(g,{icon:e,name:`clipboard`,size:22})}),(0,h.jsxs)(`div`,{className:`daily-report-copy`,children:[(0,h.jsx)(`span`,{className:`compact-kicker`,children:`Relatorio automatico do dia anterior`}),(0,h.jsx)(`h2`,{children:r?`Relatorio de ${X(n)} disponivel`:`Relatorio de ${X(n)} em geracao`}),(0,h.jsx)(`p`,{children:r?`Arquivo gerado pelo sistema e pronto para baixar em PDF ou Excel, sem envio automatico por e-mail.`:`O sistema tenta gerar automaticamente este arquivo ao abrir o Admin depois de 00:00.`})]}),(0,h.jsx)(`span`,{className:`daily-report-status`,children:r?`Disponivel`:`Pendente`})]}),(0,h.jsxs)(`div`,{className:`daily-report-actions`,children:[(0,h.jsxs)(`button`,{className:`btn primary`,type:`button`,"data-daily-report-download":`pdf`,"data-report-date":n,disabled:!r,children:[(0,h.jsx)(g,{icon:e,name:`clipboard`,size:15}),`PDF`]}),(0,h.jsxs)(`button`,{className:`btn outline`,type:`button`,"data-daily-report-download":`xlsx`,"data-report-date":n,disabled:!r,children:[(0,h.jsx)(g,{icon:e,name:`chart`,size:15}),`Excel`]})]})]})}function Fe(e){let{icon:t,reportFilter:n,reportPeriodLabel:r,reportRows:i,state:a,sumQty:o,totalsByMeal:s}=e,c=i??a.requests.filter(e=>e.status!==`cancelado`),l=De(a,c,e.STATUS_LABEL??{}),u=Ne(),d=a.dailyReports?.find(e=>e.date===u),f=n??{range:`all`,start:a.settings.defaultMealDate,end:a.settings.defaultMealDate},p=o(c),m=s(c),_=f.range===`all`,b=f.range===`custom`,S=l.requested?`${Math.round(l.consumed/l.requested*100)}%`:`-`,C=l.effective?`${Math.round(l.consumed/l.effective*100)}%`:`-`,w=l.consumed?G(l.value/l.consumed):G(0),T=(a.consolidations??[]).filter(e=>{if(e.status!==`cancelado_confirmado`)return!1;if(!f.start&&!f.end)return!0;let t=f.start||f.end,n=f.end||f.start;return e.date>=t&&e.date<=n}).length;return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(`style`,{children:xe+Se}),(0,h.jsx)(v,{kicker:`Relatórios`,title:`Visão geral e desempenho`,totalValue:p,totalLabel:`refeições no período`,description:`Período: ${r??`Todo período`}`,actions:(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(y,{icon:t}),(0,h.jsxs)(x,{icon:t,children:[(0,h.jsxs)(`select`,{"data-report-range":!0,defaultValue:f.range,children:[(0,h.jsx)(`option`,{value:`all`,children:`Todo periodo`}),(0,h.jsx)(`option`,{value:`day`,children:`Dia`}),(0,h.jsx)(`option`,{value:`week`,children:`Semana`}),(0,h.jsx)(`option`,{value:`month`,children:`Mes`}),(0,h.jsx)(`option`,{value:`custom`,children:`Período personalizado`})]}),(0,h.jsx)(`input`,{type:`date`,defaultValue:f.start||a.settings.defaultMealDate,"data-report-start":!0,"aria-label":b?`Inicio do periodo`:`Data de referencia`,disabled:_}),(0,h.jsx)(`input`,{type:`date`,defaultValue:f.end||f.start||a.settings.defaultMealDate,"data-report-end":!0,"aria-label":`Fim do periodo`,disabled:!b}),(0,h.jsxs)(`select`,{"data-report-supplier":!0,defaultValue:f.supplierCompanyId||``,"aria-label":`Fornecedor`,children:[(0,h.jsx)(`option`,{value:``,children:`Todos fornecedores`}),(a.supplierCompanies??[]).map(e=>(0,h.jsx)(`option`,{value:e.id,children:e.tradeName||e.legalName},e.id))]}),(0,h.jsxs)(`select`,{"data-report-meal":!0,defaultValue:f.mealTypeId||``,"aria-label":`Tipo de refeicao`,children:[(0,h.jsx)(`option`,{value:``,children:`Todas refeicoes`}),(a.mealCatalog??a.mealTypes??[]).map(e=>(0,h.jsx)(`option`,{value:e.id,children:e.label},e.id))]}),(0,h.jsxs)(`select`,{"data-report-team":!0,defaultValue:f.teamId||``,"aria-label":`Efetivo ou local`,children:[(0,h.jsx)(`option`,{value:``,children:`Todos locais`}),(a.workSections??[]).map(e=>(0,h.jsx)(`option`,{value:e.id,children:e.name},e.id))]}),(0,h.jsxs)(`select`,{"data-report-origin":!0,defaultValue:f.originRole||``,"aria-label":`Origem do pedido`,children:[(0,h.jsx)(`option`,{value:``,children:`Todas origens`}),(0,h.jsx)(`option`,{value:`admin`,children:`Admin`}),(0,h.jsx)(`option`,{value:`encarregado`,children:`Encarregado`})]})]}),(0,h.jsxs)(`button`,{className:`btn primary small`,type:`button`,"data-export-kpi":!0,children:[(0,h.jsx)(g,{icon:t,name:`chart`,size:14}),`KPI PDF`]}),(0,h.jsx)(je,{currentFilter:f,exportMenuOpen:e.exportMenuOpen,icon:t,isAllPeriod:_,isCustomPeriod:b})]}),metrics:[{icon:t,iconName:`utensils`,label:`Refeições`,value:p},{icon:t,iconName:`clipboard`,label:`Pedidos`,value:c.length},{icon:t,iconName:`box`,label:`Marmitas`,value:m[`Marmita Campo`]??0},{icon:t,iconName:`utensils`,label:`Almoços`,value:m[`Buffer Almoço`]??m[`Buffer Almoco`]??0},{icon:t,iconName:`moon`,label:`Jantas`,value:m.Jantar??0},{icon:t,iconName:`trash`,label:`Cancel. confirm.`,value:T}]}),(0,h.jsx)(Pe,{icon:t,report:d,reportDate:u}),null,(0,h.jsxs)(`section`,{className:`report-analytics mt-3`,children:[(0,h.jsxs)(`div`,{className:`report-insights`,children:[(0,h.jsxs)(`article`,{className:`report-insight`,children:[(0,h.jsx)(`span`,{children:`Consumido real`}),(0,h.jsx)(`strong`,{children:W(l.consumed)}),(0,h.jsxs)(`p`,{children:[S,` do solicitado no filtro.`]})]}),(0,h.jsxs)(`article`,{className:`report-insight`,children:[(0,h.jsx)(`span`,{children:`Ocupacao`}),(0,h.jsx)(`strong`,{children:C}),(0,h.jsx)(`p`,{children:`Consumo comparado ao efetivo informado.`})]}),(0,h.jsxs)(`article`,{className:`report-insight`,children:[(0,h.jsx)(`span`,{children:`Custo estimado`}),(0,h.jsx)(`strong`,{children:G(l.value)}),(0,h.jsxs)(`p`,{children:[w,` por refeicao consumida.`]})]})]}),(0,h.jsxs)(`div`,{className:`report-chart-grid wide`,children:[(0,h.jsx)(K,{className:`is-emphasis`,kicker:`KPI operacional`,title:`Solicitado x consumido x efetivo`,subtitle:`Comparacao por tipo de refeicao, seguindo a mesma leitura do KPI em PDF.`,chip:`${l.meals.length} tipos`,children:(0,h.jsx)(ke,{items:l.meals})}),(0,h.jsx)(K,{kicker:`Distribuicao`,title:`Consumo por refeicao`,subtitle:`Participacao de cada alimentacao no total consumido.`,chip:W(l.consumed),children:(0,h.jsx)(J,{items:l.meals.map(e=>({label:e.label,value:e.consumed})),center:W(l.consumed)})})]}),(0,h.jsxs)(`div`,{className:`report-chart-grid`,children:[(0,h.jsx)(K,{kicker:`Status`,title:`Situacao dos pedidos`,subtitle:`Visao resumida do funil operacional, sem repetir a lista de pedidos.`,chip:`${c.length} pedidos`,children:(0,h.jsx)(J,{items:l.statuses,center:String(c.length)})}),(0,h.jsx)(K,{kicker:`Evolucao`,title:`Consumo diario`,subtitle:`Ultimos dias do periodo filtrado para identificar picos e quedas.`,chip:`${l.days.length} dias`,children:(0,h.jsx)(Y,{items:l.days})})]}),(0,h.jsx)(K,{kicker:`Areas e trechos`,title:`Top equipes por consumo`,subtitle:`Frentes com maior volume operacional no periodo.`,chip:`ranking`,children:(0,h.jsx)(Oe,{items:l.sections,valueKey:`consumed`})}),(0,h.jsxs)(`div`,{className:`report-chart-grid wide`,children:[(0,h.jsx)(K,{kicker:`Capacidade`,title:`Ocupacao diaria`,subtitle:`Consumo real comparado ao efetivo das equipes/trechos.`,chip:C,children:(0,h.jsx)(Y,{items:l.days.map(e=>({...e,occupancy:e.effective?Math.round(e.consumed/e.effective*100):0})),valueKey:`occupancy`,format:e=>`${e}%`})}),(0,h.jsx)(K,{kicker:`Mapa de calor`,title:`Dia da semana x refeicao`,subtitle:`Concentracao de consumo por dia e tipo de alimentacao.`,chip:`heatmap`,children:(0,h.jsx)(Ae,{meals:l.meals,heatmap:l.heatmap})})]})]})]})}var Ie=`
  .admin-page {
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    display: grid;
    gap: 0.75rem;
    color: #1c1917;
  }
  .admin-page h1,
  .admin-page h2,
  .admin-page h3,
  .admin-page p { margin: 0; }
  .admin-page h1 { font-size: 26px; line-height: 1; font-weight: 900; letter-spacing: 0; }
  .admin-page h2 { font-size: 1.125rem; font-weight: 900; color: #1c1917; }
  .admin-page h3 { font-weight: 900; }
  .admin-page p { font-size: 0.875rem; color: #78716c; }
  .admin-page .eyebrow,
  .admin-page .compact-kicker,
  .admin-page .stat-label,
  .admin-page .finance-metric span,
  .admin-page .request-card-quantity span {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: #c2410c;
  }
  .admin-page .page-subtitle,
  .admin-page .stat-sub,
  .admin-page .finance-metric small,
  .admin-page .request-card-quantity span { color: #78716c; font-size: .75rem; font-weight: 700; }
  .admin-page .section-title { margin-bottom: .75rem; font-size: 1rem; font-weight: 900; color: #1c1917; }
  .admin-page .app-page-header,
  .admin-page .admin-list-header,
  .admin-page .admin-send-header {
    position: relative;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border-radius: 18px;
    border: 1px solid #e7e5e4;
    border-left: 5px solid #ea580c;
    background: rgba(255,255,255,.9);
    padding: 1rem;
    box-shadow: 0 12px 30px rgba(25,27,24,.055);
  }
  .admin-page .actions,
  .admin-page .button-row,
  .admin-page .admin-list-actions,
  .admin-page .admin-send-actions,
  .admin-page .request-card-actions,
  .admin-page .week-nav { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
  .admin-page .admin-list-actions,
  .admin-page .admin-send-actions { justify-content: flex-end; }
  .admin-page .btn,
  .admin-page .icon-action,
  .admin-page .admin-back-button {
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
  .admin-page .btn:hover,
  .admin-page .icon-action:hover { transform: translateY(-2px); }
  .admin-page .btn.primary { border-color: #ea580c; background: #ea580c; color: #fff; box-shadow: 0 10px 22px rgba(239,91,29,.2); }
  .admin-page .btn.primary:hover { background: #c2410c; }
  .admin-page .btn.outline,
  .admin-page .icon-action,
  .admin-page .admin-back-button { border-color: #d6d3d1; background: #fff; color: #1c1917; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .btn.danger,
  .admin-page .icon-action.danger { border-color: #fecaca; background: #fef2f2; color: #b91c1c; }
  .admin-page .btn.small { min-height: 2.25rem; padding: 0 .75rem; font-size: .75rem; }
  .admin-page .badge { display: inline-flex; min-height: 1.75rem; align-items: center; border-radius: 999px; border: 1px solid #e7e5e4; background: #f5f5f4; padding: 0 .625rem; font-size: 11px; font-weight: 900; text-transform: uppercase; color: #57534e; }
  .admin-page .badge.enviado { border-color: #fed7aa; background: #fff7ed; color: #c2410c; }
  .admin-page .badge.entregue { border-color: #a7f3d0; background: #ecfdf5; color: #047857; }
  .admin-page .badge.cancelado { border-color: #fecaca; background: #fef2f2; color: #b91c1c; }
  .admin-page .badge.cancelado_confirmado { border-color: #fecaca; background: #fef2f2; color: #991b1b; }
  .admin-page .badge.confirmado { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
  .admin-page .badge.producao { border-color: #fde68a; background: #fffbeb; color: #b45309; }
  .admin-page .badge.saiu_entrega { border-color: #bae6fd; background: #f0f9ff; color: #0369a1; }
  .admin-page .table-wrap { overflow-x: auto; border-radius: .75rem; border: 1px solid #e7e5e4; background: #fff; }
  .admin-page table { width: 100%; border-collapse: collapse; }
  .admin-page th { background: #fafaf9; padding: .75rem; text-align: left; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .admin-page td { border-top: 1px solid #f5f5f4; padding: .75rem; font-size: .875rem; }
  .admin-page input,
  .admin-page select,
  .admin-page textarea { min-height: 2.5rem; border-radius: .5rem; border: 1px solid #d6d3d1; background: #fff; padding: 0 .75rem; font-size: .875rem; }
  .admin-page textarea { min-height: 6rem; padding-top: .5rem; padding-bottom: .5rem; }
  .admin-page .admin-filter-menu,
  .admin-page .export-menu { position: relative; }
  .admin-page .admin-filter-menu summary { display: inline-flex; min-height: 2.5rem; align-items: center; gap: .5rem; border-radius: .5rem; border: 1px solid #d6d3d1; background: #fff; padding: 0 1rem; font-size: .875rem; font-weight: 800; cursor: pointer; }
  .admin-page .admin-filter-popover,
  .admin-page .export-options { position: absolute; right: 0; z-index: 20; margin-top: .5rem; display: grid; min-width: 10rem; gap: .5rem; border-radius: 1rem; border: 1px solid #e7e5e4; background: #fff; padding: .75rem; box-shadow: 0 25px 50px rgba(0,0,0,.18); }
  .admin-page .empty { border-radius: .75rem; border: 1px dashed #d6d3d1; background: #fafaf9; padding: 1.25rem; text-align: center; font-size: .875rem; font-weight: 700; color: #78716c; }
  @media (min-width: 640px) { .admin-page h1 { font-size: 34px; } }
`,Le=`
  .admin-page .audit-panel { border-radius: 1rem; border: 1px solid #e7e5e4; background: rgba(255,255,255,.9); padding: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .timeline { display: grid; gap: .5rem; }
  .admin-page .timeline-item { display: grid; grid-template-columns: 12px minmax(0,1fr); gap: .75rem; border-radius: .75rem; border: 1px solid #e7e5e4; background: #fff; padding: .75rem; }
  .admin-page .timeline-dot { margin-top: .25rem; width: .75rem; height: .75rem; border-radius: 999px; background: #ea580c; }
`,Z=e=>({pedido:`Pedido de refeição`,meal_request:`Pedido de refeição`,tipo_alimentacao:`Tipo de alimentação`,meal_type:`Tipo de alimentação`,consolidacao:`Envio ao fornecedor`,consolidation:`Envio ao fornecedor`,fornecedor:`Fornecedor`,supplier:`Fornecedor`,usuario:`Usuário`,user:`Usuário`,seed:`Carga inicial`})[e]??String(e??`Registro`).replaceAll(`_`,` `);function Re({exportMenuOpen:e,formatDateTime:t,icon:n,state:r}){let i=r.auditLog,a=new Set(i.map(e=>e.userId)).size,o=new Set(i.map(e=>Z(e.entity))).size,s=i[0];return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(`style`,{children:Ie+Le}),(0,h.jsx)(v,{className:`admin-corner-action-receipt`,kicker:`Auditoria`,title:`Eventos do sistema`,totalValue:i.length,totalLabel:`eventos registrados`,description:`Registro de usuário, data e horário em todas as ações.`,actions:(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(y,{icon:n}),(0,h.jsx)(b,{exportMenuOpen:e,icon:n,id:`auditoria`,items:[[`pdf`,`PDF`,`chart`],[`xlsx`,`Excel`,`clipboard`]]})]}),metrics:[{icon:n,iconName:`history`,value:i.length,label:`Eventos`},{icon:n,iconName:`users`,value:a,label:`Usuários`},{icon:n,iconName:`package`,value:o,label:`Areas`},{icon:n,iconName:`clock`,value:s?t(s.at):`-`,label:`Ultimo registro`}]}),(0,h.jsx)(`div`,{className:`audit-panel`,children:(0,h.jsx)(`div`,{className:`timeline`,children:i.map(e=>(0,h.jsxs)(`div`,{className:`timeline-item`,children:[(0,h.jsx)(`div`,{className:`timeline-dot`}),(0,h.jsxs)(`div`,{className:`timeline-body`,children:[(0,h.jsx)(`strong`,{children:e.action}),(0,h.jsx)(`br`,{}),C(r,e.userId),` - `,t(e.at),` - `,Z(e.entity)]})]},e.id))})})]})}var Q=`
  .admin-page {
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    display: grid;
    gap: 0.75rem;
    color: #1c1917;
  }
  .admin-page h1,
  .admin-page h2,
  .admin-page h3,
  .admin-page p { margin: 0; }
  .admin-page h1 { font-size: 26px; line-height: 1; font-weight: 900; letter-spacing: 0; }
  .admin-page h2 { font-size: 1.125rem; font-weight: 900; color: #1c1917; }
  .admin-page h3 { font-weight: 900; }
  .admin-page p { font-size: 0.875rem; color: #78716c; }
  .admin-page .eyebrow,
  .admin-page .compact-kicker,
  .admin-page .stat-label,
  .admin-page .finance-metric span,
  .admin-page .request-card-quantity span {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: #c2410c;
  }
  .admin-page .page-subtitle,
  .admin-page .stat-sub,
  .admin-page .finance-metric small,
  .admin-page .request-card-quantity span { color: #78716c; font-size: .75rem; font-weight: 700; }
  .admin-page .section-title { margin-bottom: .75rem; font-size: 1rem; font-weight: 900; color: #1c1917; }
  .admin-page .app-page-header,
  .admin-page .admin-list-header,
  .admin-page .admin-send-header {
    position: relative;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border-radius: 18px;
    border: 1px solid #e7e5e4;
    border-left: 5px solid #ea580c;
    background: rgba(255,255,255,.9);
    padding: 1rem;
    box-shadow: 0 12px 30px rgba(25,27,24,.055);
  }
  .admin-page .actions,
  .admin-page .button-row,
  .admin-page .admin-list-actions,
  .admin-page .admin-send-actions,
  .admin-page .request-card-actions,
  .admin-page .week-nav { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
  .admin-page .admin-list-actions,
  .admin-page .admin-send-actions { justify-content: flex-end; }
  .admin-page .btn,
  .admin-page .icon-action,
  .admin-page .admin-back-button {
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
  .admin-page .btn:hover,
  .admin-page .icon-action:hover { transform: translateY(-2px); }
  .admin-page .btn.primary { border-color: #ea580c; background: #ea580c; color: #fff; box-shadow: 0 10px 22px rgba(239,91,29,.2); }
  .admin-page .btn.primary:hover { background: #c2410c; }
  .admin-page .btn.outline,
  .admin-page .icon-action,
  .admin-page .admin-back-button { border-color: #d6d3d1; background: #fff; color: #1c1917; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .btn.danger,
  .admin-page .icon-action.danger { border-color: #fecaca; background: #fef2f2; color: #b91c1c; }
  .admin-page .btn.small { min-height: 2.25rem; padding: 0 .75rem; font-size: .75rem; }
  .admin-page .badge { display: inline-flex; min-height: 1.75rem; align-items: center; border-radius: 999px; border: 1px solid #e7e5e4; background: #f5f5f4; padding: 0 .625rem; font-size: 11px; font-weight: 900; text-transform: uppercase; color: #57534e; }
  .admin-page .badge.enviado { border-color: #fed7aa; background: #fff7ed; color: #c2410c; }
  .admin-page .badge.entregue { border-color: #a7f3d0; background: #ecfdf5; color: #047857; }
  .admin-page .badge.cancelado { border-color: #fecaca; background: #fef2f2; color: #b91c1c; }
  .admin-page .badge.cancelado_confirmado { border-color: #fecaca; background: #fef2f2; color: #991b1b; }
  .admin-page .badge.confirmado { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
  .admin-page .badge.producao { border-color: #fde68a; background: #fffbeb; color: #b45309; }
  .admin-page .badge.saiu_entrega { border-color: #bae6fd; background: #f0f9ff; color: #0369a1; }
  .admin-page .table-wrap { overflow-x: auto; border-radius: .75rem; border: 1px solid #e7e5e4; background: #fff; }
  .admin-page table { width: 100%; border-collapse: collapse; }
  .admin-page th { background: #fafaf9; padding: .75rem; text-align: left; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
  .admin-page td { border-top: 1px solid #f5f5f4; padding: .75rem; font-size: .875rem; }
  .admin-page input,
  .admin-page select,
  .admin-page textarea { min-height: 2.5rem; border-radius: .5rem; border: 1px solid #d6d3d1; background: #fff; padding: 0 .75rem; font-size: .875rem; }
  .admin-page textarea { min-height: 6rem; padding-top: .5rem; padding-bottom: .5rem; }
  .admin-page .admin-filter-menu,
  .admin-page .export-menu { position: relative; }
  .admin-page .admin-filter-menu summary { display: inline-flex; min-height: 2.5rem; align-items: center; gap: .5rem; border-radius: .5rem; border: 1px solid #d6d3d1; background: #fff; padding: 0 1rem; font-size: .875rem; font-weight: 800; cursor: pointer; }
  .admin-page .admin-filter-popover,
  .admin-page .export-options { position: absolute; right: 0; z-index: 20; margin-top: .5rem; display: grid; min-width: 10rem; gap: .5rem; border-radius: 1rem; border: 1px solid #e7e5e4; background: #fff; padding: .75rem; box-shadow: 0 25px 50px rgba(0,0,0,.18); }
  .admin-page .empty { border-radius: .75rem; border: 1px dashed #d6d3d1; background: #fafaf9; padding: 1.25rem; text-align: center; font-size: .875rem; font-weight: 700; color: #78716c; }
  @media (min-width: 640px) { .admin-page h1 { font-size: 34px; } }
`,ze=`
  .admin-page .admin-home-hero.compact { margin-bottom: .75rem; display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; border-radius: 18px; border: 1px solid #e7e5e4; border-left: 5px solid #ea580c; background: rgba(255,255,255,.9); color: #1c1917; padding: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .admin-more-grid { display: grid; grid-template-columns: minmax(0,1fr); gap: .5rem; }
  .admin-page .admin-more-tile { display: grid; min-height: 4.7rem; grid-template-columns: 3rem minmax(0,1fr); align-items: center; gap: .9rem; border-radius: 1rem; border: 1px solid #e7e5e4; background: rgba(255,255,255,.9); padding: .9rem 1rem; text-align: left; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .admin-more-tile:hover { border-color: #fdba74; background: #fff7ed; }
  .admin-page .admin-more-tile strong { min-width: 0; font-size: 1.12rem; line-height: 1.05; color: #78716c; }
`;function Be(e){let{icon:t}=e;return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(`style`,{children:Q+ze}),(0,h.jsxs)(`section`,{className:`admin-more`,children:[(0,h.jsx)(`header`,{className:`admin-home-hero compact`,children:(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`span`,{className:`compact-kicker`,children:`Administração`}),(0,h.jsx)(`h1`,{children:`Mais ferramentas`}),(0,h.jsx)(`p`,{children:`Acesse as áreas de consulta e ajustes sem deixar o rodapé principal carregado.`})]})}),(0,h.jsx)(`div`,{className:`admin-more-grid`,children:[[`financeiro`,`chart`,`Financeiro`],[`relatorios`,`chart`,`Relatórios`],[`auditoria`,`history`,`Auditoria`],[`configuracoes`,`settings`,`Configurações`]].map(([e,n,r])=>(0,h.jsxs)(`button`,{className:`admin-more-tile`,"data-view":e,children:[(0,h.jsx)(`span`,{children:(0,h.jsx)(g,{icon:t,name:n,size:24})}),(0,h.jsx)(`strong`,{children:r})]},e))})]})]})}var Ve=`
  .admin-page {
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    display: grid;
    gap: .95rem;
    color: #1c1917;
  }

  .admin-page h1,
  .admin-page h2,
  .admin-page h3,
  .admin-page p { margin: 0; letter-spacing: 0; }

  .admin-page h1 {
    font-size: clamp(1.46rem, 1.05rem + 1vw, 2.14rem);
    line-height: .96;
    font-weight: 950;
  }

  .admin-page h2 { font-size: 1.12rem; line-height: 1.1; font-weight: 950; color: #1c1917; }
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
    min-height: 2.7rem;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    border-radius: .55rem;
    border: 1px solid transparent;
    padding: 0 .9rem;
    font-size: .9rem;
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
    border-color: #d6d3d1;
    background: #fff;
    color: #1c1917;
  }

  .admin-page .stat-card.accent .stat-label,
  .admin-page .stat-card.accent .stat-sub,
  .admin-page .finance-metric.accent span,
  .admin-page .finance-metric.accent small { color: #78716c; }

  .admin-page .admin-send-summary,
  .admin-page .admin-pedidos-summary,
  .admin-page .finance-metrics-strip,
  .admin-page .admin-receipt-metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: .5rem;
    border-radius: 0 0 20px 20px;
    background: #fafaf9;
    padding: 1.25rem 1rem .75rem;
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
    font-size: clamp(2.25rem, 1.7rem + 2.2vw, 3.55rem);
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
  .admin-page .stat-card,
  .admin-page .finance-metric,
  .admin-page .finance-metrics-strip .finance-metric,
  .admin-page .admin-receipt-chip {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: .75rem;
    border-radius: .375rem 1rem 1rem .375rem;
    border: 1px dashed #d6d3d1;
    border-left-width: 2px;
    background: #fff;
    padding: .75rem 1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }

  .admin-page .admin-receipt-chip,
  .admin-page .finance-metric {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: .5rem;
  }

  .admin-page .admin-receipt-chip-icon,
  .admin-page .admin-send-chip-icon,
  .admin-page .admin-history-chip-icon,
  .admin-page .data-card-icon {
    display: grid;
    width: 2.25rem;
    height: 2.25rem;
    flex-shrink: 0;
    place-items: center;
    border-radius: 999px;
    background: #fff0e8;
    color: #c2410c;
  }

  .admin-page .admin-receipt-chip-icon svg,
  .admin-page .admin-send-chip-icon svg,
  .admin-page .admin-history-chip-icon svg,
  .admin-page .data-card-icon svg {
    color: #c2410c;
    stroke: #c2410c;
  }

  .admin-page .admin-receipt-chip-text,
  .admin-page .data-card-copy {
    min-width: 0;
    line-height: 1;
  }

  .admin-page .admin-receipt-chip strong,
  .admin-page .admin-send-chip strong,
  .admin-page .admin-history-chip strong,
  .admin-page .finance-metric strong {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1rem;
    line-height: 1;
    font-weight: 950;
    color: #1c1917;
  }

  .admin-page .admin-receipt-chip.is-long-value strong {
    font-size: .82rem;
    letter-spacing: 0;
  }

  .admin-page .admin-receipt-chip span:last-child,
  .admin-page .admin-send-chip span:last-child,
  .admin-page .admin-history-chip span:last-child,
  .admin-page .finance-metric .data-card-copy span {
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

  .admin-page .finance-metric small {
    display: none;
  }

  .admin-page .stat-value,
  .admin-page .finance-metric strong {
    margin-top: 0;
    font-size: 1.12rem;
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
  .admin-page .badge.cancelado_confirmado { border-color: #fecaca; background: #fef2f2; color: #991b1b; }
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
    display: grid;
    min-height: 4.7rem;
    grid-template-columns: 3rem minmax(0,1fr);
    align-items: center;
    gap: .9rem;
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
      gap: .7rem;
    }

    .admin-page h1 {
      font-size: 1.38rem;
      line-height: 1.02;
    }

    .admin-page h2 {
      font-size: 1.04rem;
    }

    .admin-page p,
    .admin-page small,
    .admin-page .page-subtitle {
      font-size: .78rem;
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
      padding: .78rem;
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
      padding: .64rem .76rem .58rem;
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
      font-size: 1.92rem;
      line-height: .86;
    }

    .admin-page .admin-receipt-total span {
      max-width: 6rem;
      padding-bottom: .12rem;
      font-size: 8.5px;
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
      grid-column: 1 / -1;
      width: 100%;
      max-width: none;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      justify-self: stretch;
      align-self: stretch;
      justify-content: stretch;
      gap: .35rem;
    }

    .admin-page .admin-receipt-actions > *,
    .admin-page .admin-receipt-actions .btn,
    .admin-page .admin-receipt-actions .admin-filter-menu summary,
    .admin-page .admin-receipt-actions .export-menu > button {
      width: 100%;
      min-width: 0;
    }

    .admin-page .admin-receipt-actions .btn,
    .admin-page .admin-receipt-actions .admin-filter-menu summary,
    .admin-page .admin-receipt-actions .export-menu > button {
      min-height: 2.05rem;
      padding-inline: .56rem;
      font-size: .7rem;
      gap: .28rem;
      white-space: nowrap;
    }

    .admin-page .admin-receipt-actions .btn.primary {
      padding-inline: .68rem;
    }

    .admin-page .admin-receipt-actions .admin-filter-menu[open],
    .admin-page .admin-receipt-actions .export-menu.open {
      z-index: 1000;
    }

    .admin-page .admin-corner-action-receipt .admin-receipt-actions {
      grid-column: 2;
      grid-row: 1;
      width: auto;
      max-width: 7.8rem;
      display: flex;
      justify-self: end;
      align-self: start;
      justify-content: flex-end;
    }

    .admin-page .admin-corner-action-receipt .admin-receipt-actions > *,
    .admin-page .admin-corner-action-receipt .admin-receipt-actions .btn,
    .admin-page .admin-corner-action-receipt .admin-receipt-actions .export-menu > button {
      width: auto;
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
      min-height: 2.22rem;
      border-radius: .48rem;
      padding-inline: .58rem;
      font-size: .74rem;
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
      min-height: 2.25rem;
      border-radius: .52rem;
      padding-inline: .58rem;
      font-size: .8rem;
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

    .admin-page .export-menu {
      position: relative;
    }

    .admin-page .export-menu.open .export-options {
      position: absolute;
      top: calc(100% + .35rem);
      right: 0;
      left: auto;
      width: min(14rem, calc(100vw - 1.3rem));
      min-width: 0;
      max-width: none;
      max-height: none;
      overflow: visible;
      gap: .4rem;
      border-radius: .8rem;
      padding: .55rem;
    }

    .admin-page .export-menu.open .export-options label {
      display: grid;
      gap: .18rem;
    }

    .admin-page .export-menu.open .export-options label span {
      font-size: 8.5px;
      font-weight: 900;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: #78716c;
    }

    .admin-page .export-menu.open .export-options input,
    .admin-page .export-menu.open .export-options select,
    .admin-page .export-menu.open .export-options button {
      min-height: 2rem;
      border-radius: .55rem;
      padding-inline: .5rem;
      font-size: .72rem;
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
      padding: 1.2rem .75rem .75rem;
    }

    .admin-page .admin-receipt-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    .admin-page .admin-receipt-metrics[data-count="3"] {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }

    .admin-page .admin-receipt-metrics[data-count="5"] .admin-receipt-chip:last-child {
      grid-column: 1 / -1;
    }

    .admin-page .admin-send-summary {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .admin-page .admin-send-chip,
    .admin-page .admin-history-chip,
    .admin-page .stat-card,
    .admin-page .finance-metric,
    .admin-page .finance-metrics-strip .finance-metric,
    .admin-page .admin-receipt-chip {
      min-height: 3.55rem;
      gap: .52rem;
      padding: .62rem .68rem;
      border-radius: .375rem 1rem 1rem .375rem;
    }

    .admin-page .admin-receipt-chip-icon,
    .admin-page .admin-send-chip-icon,
    .admin-page .admin-history-chip-icon,
    .admin-page .data-card-icon {
      display: grid;
      width: 1.9rem;
      height: 1.9rem;
    }

    .admin-page .admin-send-chip strong,
    .admin-page .admin-history-chip strong,
    .admin-page .finance-metric strong {
      font-size: 1rem;
      line-height: 1;
    }

    .admin-page .admin-receipt-chip strong {
      font-size: 1rem;
      line-height: 1;
    }

    .admin-page .admin-send-chip span:last-child,
    .admin-page .admin-history-chip span:last-child,
    .admin-page .finance-metric .data-card-copy span,
    .admin-page .compact-kicker,
    .admin-page .eyebrow {
      font-size: 8.5px;
      letter-spacing: .07em;
    }

    .admin-page .admin-receipt-chip span:last-child {
      font-size: 8.5px;
      line-height: 1.08;
      letter-spacing: .07em;
      white-space: normal;
    }

    .admin-page .admin-receipt-metrics[data-count="3"] .admin-receipt-chip span:last-child,
    .admin-page .admin-receipt-metrics[data-count="4"] .admin-receipt-chip span:last-child,
    .admin-page .admin-receipt-metrics[data-count="5"] .admin-receipt-chip span:last-child {
      font-size: 7.2px;
      line-height: 1.05;
      letter-spacing: .045em;
      -webkit-line-clamp: 2;
    }

    .admin-page .admin-receipt-chip.is-long-value strong {
      font-size: .72rem;
      line-height: 1.05;
    }

    .admin-page .admin-receipt-metrics[data-count="4"] .admin-receipt-chip,
    .admin-page .admin-receipt-metrics[data-count="5"] .admin-receipt-chip {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      text-align: left;
    }

    .admin-page .admin-more-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: .42rem;
    }

    .admin-page .admin-more-tile {
      min-height: 4.2rem;
      grid-template-columns: 2.35rem minmax(0,1fr);
      align-items: center;
      gap: .75rem;
      padding: .68rem .75rem;
      border-radius: .75rem;
    }

    .admin-page .admin-more-tile span:first-child {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: .55rem;
    }

    .admin-page .admin-more-tile strong {
      min-width: 0;
      font-size: 1.04rem;
      line-height: 1.05;
      color: #78716c;
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
`;function He(e){let t;return t=e.page===`painel`?(0,h.jsx)(re,{...e}):e.page===`pedidos`?(0,h.jsx)(oe,{...e}):e.page===`consolidacao`?(0,h.jsx)(me,{...e}):e.page===`financeiro`?(0,h.jsx)(be,{...e}):e.page===`relatorios`?(0,h.jsx)(Fe,{...e}):e.page===`auditoria`?(0,h.jsx)(Re,{...e}):(0,h.jsx)(Be,{...e}),(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(`div`,{className:`admin-page`,children:t}),(0,h.jsx)(`style`,{children:Ve})]})}var $=new WeakMap;function Ue(e=document){e.querySelectorAll(`[data-admin-react-root]`).forEach(e=>{let t=$.get(e);t&&(t.unmount(),$.delete(e))})}function We(e,t){let n=e.querySelector(`[data-admin-react-root]`);if(!n)return;let r=$.get(n);r||(r=(0,p.createRoot)(n),$.set(n,r)),(0,f.flushSync)(()=>{r.render((0,h.jsx)(He,{...t}))})}export{We as mountAdminReactPage,Ue as unmountAdminReactPage};