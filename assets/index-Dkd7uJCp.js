var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,a)=>(a=n==null?{}:e(i(n)),s(r||!n||!n.__esModule?t(a,`default`,{value:n,enumerable:!0}):a,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var l=`alimenta-obra-ui-v2`;function u(){return{authenticatedUserId:null,activeUserId:null,activeView:`inicio`,users:[],mealCatalog:[],mealTypes:[],workSections:[],deliveryAddresses:[],deliveryAddressFeatureAvailable:!1,requests:[],consolidations:[],consolidationActuals:[],dailyReports:[],consolidationDocuments:[],settings:{cutoffTime:`18:00`,supplierName:`Fornecedor Central`,defaultMealUnitPrice:18.5,defaultMealDate:new Date().toISOString().slice(0,10),occupancyTarget:100,notificationChannel:`E-mail e push`,offlineSyncEnabled:!1},auditLog:[],syncQueue:[],loading:!0}}function d(){try{return JSON.parse(localStorage.getItem(l)??`{}`)}catch{return{}}}function f(e){localStorage.setItem(l,JSON.stringify({activeView:e.activeView}))}function p(e){return e.users.find(t=>t.id===e.activeUserId)??null}function m(e,t){return e.users.find(e=>e.id===t)?.name??`Usuario removido`}function h(e){return e.users.filter(e=>e.role===`encarregado`)}function g(e){return e.users.filter(e=>e.role===`fornecedor`&&e.active!==!1)}function _(e,t){return Number(e.workSections?.find(e=>e.id===t)?.headcount??0)}function v(e,t=``){let n=(e.workSections??[]).filter(e=>e.active!==!1),r=t?n.filter(e=>!e.leaderId||e.leaderId===t):n;return r.length?r:n}function y(e,t){let n=p(e);if(!n)return!1;let r=e.consolidations?.find(e=>e.status!==`rascunho`&&e.requestIds?.includes(t.id));if(r?.confirmations?.some(e=>e.step===`confirmado`)||r&&![`enviado`,`rascunho`].includes(r.status))return!1;if(n.role===`admin`)return![`cancelado`,`entregue`].includes(t.status);if(t.leaderId!==n.id||[`cancelado`,`entregue`].includes(t.status))return!1;let[i,a]=e.settings.cutoffTime.split(`:`).map(Number),o=new Date(`${t.date}T${String(i).padStart(2,`0`)}:${String(a).padStart(2,`0`)}:00`);return o.setDate(o.getDate()-1),new Date<=o}function b(e,t){return e.requests.filter(e=>e.date===t&&e.status!==`cancelado`)}function x(e,t){let n=e.consolidations.filter(e=>e.date===t&&[`rascunho`,`enviado`].includes(e.status)).sort((e,t)=>new Date(t.createdAt??t.sentAt??0)-new Date(e.createdAt??e.sentAt??0))[0],r=new Set(n?.requestIds??[]),i=new Set((e.consolidations??[]).filter(e=>e.date===t&&e.id!==n?.id).flatMap(e=>e.requestIds??[])),a=b(e,t).filter(e=>e.status===`enviado`).filter(e=>r.has(e.id)||!i.has(e.id)).map(e=>e.id);return n?{...n,requestIds:Array.from(new Set([...n.requestIds??[],...a]))}:{id:``,date:t,status:`rascunho`,sentAt:null,supplierId:g(e)[0]?.id??null,requestIds:a,confirmations:[]}}function S(e,t){let n=t.requestIds.map(t=>e.requests.find(e=>e.id===t)).filter(Boolean).filter(e=>e.status!==`cancelado`),r=n.reduce((n,r)=>{n[r.mealType]??={total:0,actual:0,headcount:0,rows:[],byLocation:{},bySection:{}},n[r.mealType].total+=Number(r.quantity),n[r.mealType].rows.push(r);let i=r.sectionName||r.location,a=ee(e,t.id,r),o=_(e,r.teamId);return n[r.mealType].actual+=a,n[r.mealType].headcount+=o,n[r.mealType].byLocation[i]??=0,n[r.mealType].byLocation[i]+=Number(r.quantity),n[r.mealType].bySection[i]??={requested:0,actual:0,headcount:0,rows:[]},n[r.mealType].bySection[i].requested+=Number(r.quantity),n[r.mealType].bySection[i].actual+=a,n[r.mealType].bySection[i].headcount+=o,n[r.mealType].bySection[i].rows.push(r),n},{}),i=n.reduce((n,r)=>{let i=r.sectionName||r.location,a=ee(e,t.id,r);return n[i]??={requested:0,actual:0,headcount:0,rows:[]},n[i].requested+=Number(r.quantity),n[i].actual+=a,n[i].headcount+=_(e,r.teamId),n[i].rows.push(r),n},{}),a=n.reduce((n,r)=>n+ee(e,t.id,r),0),o=n.reduce((t,n)=>t+_(e,n.teamId),0);return{rows:n,byMeal:r,bySection:i,total:n.reduce((e,t)=>e+Number(t.quantity),0),actualTotal:a,headcountTotal:o}}function ee(e,t,n){let r=e.consolidationActuals?.find(e=>(!t||!e.consolidationId||e.consolidationId===t)&&e.teamId===n.teamId&&e.mealTypeId===n.mealTypeId);return Number(r?.quantity??n.actualQuantity??n.quantity??0)}var C={encarregado:[[`inicio`,`home`,`Home`],[`pedido`,`clipboard`,`Fazer Pedido`],[`historico`,`history`,`Historico`]],admin:[[`painel`,`home`,`Home`],[`pedidos`,`clipboard`,`Pedidos`],[`financeiro`,`chart`,`Financeiro`],[`relatorios`,`chart`,`Relatorios`],[`auditoria`,`history`,`Auditoria`],[`mais`,`settings`,`Mais`]],fornecedor:[[`fornecedor`,`home`,`Home`],[`fornecedor-pedidos`,`clipboard`,`Pedidos`],[`fornecedor-documentos`,`package`,`Documentos`],[`fornecedor-financeiro`,`chart`,`Financeiro`],[`fornecedor-mais`,`settings`,`Mais`]]},w={rascunho:`Rascunho`,enviado:`Enviado`,confirmado:`Confirmado`,producao:`Em producao`,saiu_entrega:`Saiu para entrega`,entregue:`Entregue`,cancelado:`Cancelado`};function te(e){return{inicio:`Home`,pedido:`Fazer pedido`,historico:`Historico`,configuracoes:`Configuracoes`,painel:`Home`,"pedido-detalhe":`Pedido`,pedidos:`Controle`,consolidacao:`Enviar pedido`,mais:`Mais`,financeiro:`Financeiro`,relatorios:`Inteligencia`,auditoria:`Rastreabilidade`,fornecedor:`Producao`,"fornecedor-pedidos":`Pedidos`,"fornecedor-historico":`Historico`,"fornecedor-mais":`Mais`,"fornecedor-documentos":`Documentos`,"fornecedor-financeiro":`Financeiro`}[e]??`AlimentaObra`}var ne=`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,re=new URL(`/alimenta-obra/assets/logo-alimentaobra.png`,window.location.origin).href,ie=new URL(`/alimenta-obra/assets/logo-consag.png`,window.location.origin).href,ae=[`#002060`,`#0070c0`,`#7ea6d8`,`#a6a6a6`,`#d9e2f3`,`#4b76b8`],oe=(e,t)=>{let n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=e,document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(n)},se=(e,t,n)=>{oe(e,new Blob([n],{type:t}))},T=e=>String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&apos;`),E=e=>String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`),ce=(e,t=``)=>{let n=e.mealCatalog?.find(e=>e.id===t)??e.mealTypes?.find(e=>e.id===t);return Number(n?.unitPrice??e.settings?.defaultMealUnitPrice??0)},le=(e,t)=>e.mealCatalog?.find(e=>e.id===t)?.description??``,ue=(e,t)=>Number(e.workSections?.find(e=>e.id===t)?.headcount??0),de=(e,t)=>Number(t.sectionHeadcount??t.headcount??ue(e,t.teamId)),fe=(e,t)=>Number(t.unitPrice??t.unit_price??ce(e,t.mealTypeId)),D=(e,t)=>Number(e.consolidationActuals?.find(e=>e.date===t.date&&e.teamId===t.teamId&&e.mealTypeId===t.mealTypeId)?.quantity??t.actualQuantity??t.quantity??0),pe=e=>e?new Intl.DateTimeFormat(`pt-BR`,{dateStyle:`short`,timeStyle:`short`}).format(new Date(e)):`-`,me=e=>e?new Intl.DateTimeFormat(`pt-BR`,{dateStyle:`short`}).format(new Date(`${e}T12:00:00`)):`-`,O=e=>new Intl.NumberFormat(`pt-BR`,{style:`currency`,currency:`BRL`}).format(Number(e??0)),he=e=>({pedido:`Pedido de refeição`,meal_request:`Pedido de refeição`,tipo_alimentacao:`Tipo de alimentação`,meal_type:`Tipo de alimentação`,consolidacao:`Envio ao fornecedor`,consolidation:`Envio ao fornecedor`,fornecedor:`Fornecedor`,supplier:`Fornecedor`,usuario:`Usuário`,user:`Usuário`,seed:`Carga inicial`})[e]??String(e??`Registro`).replaceAll(`_`,` `);function ge(e,t){let n=S(e,t);se(`pedido-ao-fornecedor-${t.date}.doc`,`application/msword;charset=utf-8`,tt(e,t,n))}function _e(e,t){let n=Ct(`Relatório de refeições`,[[`Data`,`Encarregado`,`Tipo`,`Local`,`Quantidade`,`Status`,`Criado em`,`Atualizado em`],...t.map(t=>[t.date,m(e,t.leaderId),t.mealType,t.location,Number(t.quantity??0),t.status,t.createdAt,t.updatedAt])]);oe(`relatorio-refeicoes.xlsx`,new Blob([n],{type:ne}))}async function ve(e,t,n={}){let r=Me(e,t,n);oe(`medicao-${r.filenamePeriod}.xlsx`,new Blob([nt(r)],{type:ne}))}function ye(e,t,n={}){let r=Ne(e,t,n);oe(`pedidos-${r.filenamePeriod}.xlsx`,new Blob([it(r)],{type:ne}))}function be(e,t,n={}){return Ae(We(e,t,n),`Pedidos ${n.periodLabel??``}`.trim())}function xe(e,t,n={}){let r=Me(e,t,n);return Ae(Ue(r),`Medicao ${r.periodLabel}`)}function Se(e){oe(`auditoria-alimentaobra.xlsx`,new Blob([at(e)],{type:ne}))}async function Ce(e,t){let n=t?.date||new Date().toISOString().slice(0,10),r=Me(e,Pe(e,t),{periodLabel:me(n),filter:{start:n,end:n},scope:`Relatorio diario automatico`});oe(`relatorio-diario-${n}.xlsx`,new Blob([rt(r)],{type:ne}))}function we(e,t){return Ae(Ve(e,t,S(e,t)),`Pedido ao fornecedor ${t.date}`)}function Te(e,t){return Ae(He(e,t,S(e,t)),`Nota de fornecimento ${t.date}`)}function Ee(e,t,n){return Ae($e(e,t,n),n)}function De(e,t,n=`KPIs operacionais`){return Ae(Qe(e,t,n),n)}function Oe(e){return Ae(et(e),`Auditoria do sistema`)}function ke(e,t){let n=t?.date||new Date().toISOString().slice(0,10);return Ae(Ue(Me(e,Pe(e,t),{periodLabel:me(n),filter:{start:n,end:n},scope:`Relatorio diario automatico`})),`Relatorio diario ${n}`)}function Ae(e,t){let n=window.open(``,`_blank`);return n?(n.document.open(),n.document.write(e),n.document.close(),n.document.title=t,!0):!1}function je(e){let t=e.payload??{};return e.action===`Fornecedor alterou status do pedido`?{confirmado:`Fornecedor confirmou o recebimento`,producao:`Fornecedor iniciou a producao`,saiu_entrega:`Fornecedor registrou a saida para entrega`,entregue:`Fornecedor confirmou a entrega`}[t.status]??`Fornecedor alterou o status para ${t.status??`-`}`:e.action===`Bloco diario enviado ou atualizado ao fornecedor`?`Admin enviou ou reenviou o bloco ao fornecedor`:e.action===`Bloco diario criado ou atualizado`?`Admin atualizou a composicao do pedido ao fornecedor`:he(e.entity)}function Me(e,t,n={}){let r=t.filter(e=>e.status!==`cancelado`).sort((e,t)=>`${e.date}-${e.mealType}`.localeCompare(`${t.date}-${t.mealType}`,`pt-BR`)),i=r.map(e=>e.date).filter(Boolean).sort(),a=n.filter?.start||i[0]||e.settings?.defaultMealDate||new Date().toISOString().slice(0,10),o=n.filter?.end||i.at(-1)||a,s=a===o?me(a):`${me(a)} a ${me(o)}`,c=n.periodLabel||s,l=Ie(a,o),u=e.mealCatalog??e.mealTypes??[],d=new Map(u.map((e,t)=>[e.id,t])),f=Object.values(r.reduce((t,n)=>{let r=n.mealTypeId||n.mealType||`refeicao`;return t[r]??={id:r,label:n.mealType||`Refeicao`,description:le(e,r)||n.mealDescription||``,order:d.get(r)??999,quantityTotal:0,valueTotal:0},t},{})).sort((e,t)=>e.order-t.order||e.label.localeCompare(t.label,`pt-BR`));if(f.length<3){let e=new Set(f.map(e=>e.id));u.filter(t=>t.active!==!1&&!e.has(t.id)).slice(0,3-f.length).forEach((e,t)=>{f.push({id:e.id,label:e.label??e.name??`Refeicao`,description:e.description??``,order:t,quantityTotal:0,valueTotal:0})})}let p=new Map;r.forEach(t=>{let n=`${t.date}|${t.mealTypeId||t.mealType||`refeicao`}`,r=fe(e,t),i=D(e,t),a=p.get(n)??{requested:0,consumed:0,effective:0,unitPrice:r,value:0};a.requested+=Number(t.quantity??0),a.consumed+=i,a.effective+=de(e,t),a.unitPrice=r||a.unitPrice,a.value+=i*a.unitPrice,p.set(n,a)});let h=l.map(t=>({date:t,longDate:Le(t),weekday:Re(t),meals:f.map(n=>p.get(`${t}|${n.id}`)??{requested:0,consumed:0,effective:0,unitPrice:ce(e,n.id),value:0})}));h.forEach(e=>{e.meals.forEach((e,t)=>{f[t].quantityTotal+=Number(e.consumed??0),f[t].valueTotal+=Number(e.value??0)})});let _=r.map(t=>{let n=D(e,t),r=fe(e,t);return{date:t.date,weekday:Re(t.date),leader:t.leader||t.leaderName||m(e,t.leaderId),section:t.sectionName||t.location||`Sem equipe`,meal:t.mealType||`Refeicao`,requested:Number(t.quantity??0),consumed:n,effective:de(e,t),unitPrice:r,value:n*r,status:t.status,notes:t.notes??``}}),v=Fe(_,`section`),y=Fe(_,`meal`),b=g(e)[0],x=f.reduce((e,t)=>e+t.valueTotal,0),S=f.reduce((e,t)=>e+t.quantityTotal,0);return{supplierCode:b?.supplierCode||b?.id?.slice(0,10)?.toUpperCase()||`-`,supplierName:b?.name||e.settings?.supplierName||`Fornecedor`,supplierDocument:b?.cnpj||b?.document||`-`,area:n.area||e.settings?.measurementArea||`Administracao`,scope:n.scope||`Servicos de Alimentacao`,revision:n.revision||`001`,periodLabel:c,dateRangeLabel:s,periodStart:a,periodEnd:o,measuredDays:l.length,filenamePeriod:`${a}_a_${o}`.replaceAll(`-`,``),meals:f,dayRows:h,detailRows:_,sectionSummary:v,mealSummary:y,totalQuantity:S,totalValue:x,generatedAt:pe(new Date().toISOString())}}function Ne(e,t,n={}){let r=Me(e,t,n),i=n.periodLabel??r.periodLabel,a=[[`Data`,`Encarregado`,`Equipe/Trecho`,`Tipo`,`Solic.`,`Real.`,`Efetivo`,`Unitario`,`Total`,`Status`],...r.detailRows.map(e=>[e.date,e.leader,e.section,e.meal,e.requested,e.consumed,e.effective||``,e.unitPrice,e.value,e.status])],o=[[`Data`,`Pedidos`,`Solicitadas`,`Realizadas`,`Encarregados`,`Equipes`,`Valor`],...Object.values(r.detailRows.reduce((e,t)=>(e[t.date]??={date:t.date,count:0,requested:0,consumed:0,leaders:new Set,sections:new Set,value:0},e[t.date].count+=1,e[t.date].requested+=t.requested,e[t.date].consumed+=t.consumed,e[t.date].leaders.add(t.leader),e[t.date].sections.add(t.section),e[t.date].value+=t.value,e),{})).map(e=>[e.date,e.count,e.requested,e.consumed,e.leaders.size,e.sections.size,e.value])];return{...r,periodLabel:i,tableRows:a,blockRows:o}}function Pe(e,t){return(t?.items??t?.rows??[]).map((n,r)=>{let i=n.request??n,a=i.date??n.date??t?.date,o=n.meal??i.mealType??i.meal_type??`Refeicao`,s=i.mealTypeId??i.meal_type_id??n.mealTypeId??n.meal_type_id??o,c=Number(n.consumed??n.actualQuantity??i.actualQuantity??i.actual_quantity??i.quantity??0),l=Number(n.unitPrice??n.unit_price??i.unitPrice??i.unit_price??ce(e,s));return{...i,id:i.id??n.id??`daily-${a}-${r}`,date:a,leaderId:i.leaderId??i.leader_id??n.leaderId??n.leader_id??``,leader:n.leader??i.leader??i.leaderName??i.leader_name??``,sectionName:n.section??i.sectionName??i.section_name??i.location??``,location:n.section??i.sectionName??i.section_name??i.location??``,mealType:o,mealTypeId:s,mealDescription:n.mealDescription??i.mealDescription??i.meal_description??``,quantity:Number(n.requested??i.quantity??i.requested??0),actualQuantity:c,headcount:Number(n.effective??i.headcount??i.sectionHeadcount??0),sectionHeadcount:Number(n.effective??i.headcount??i.sectionHeadcount??0),unitPrice:l,status:n.status??i.status??`relatorio`,notes:n.notes??i.notes??``}})}function Fe(e,t){return Object.values(e.reduce((e,n)=>{let r=n[t]||`-`;return e[r]??={label:r,requested:0,consumed:0,effective:0,value:0},e[r].requested+=n.requested,e[r].consumed+=n.consumed,e[r].effective+=Number(n.effective||0),e[r].value+=n.value,e},{})).sort((e,t)=>t.consumed-e.consumed||e.label.localeCompare(t.label,`pt-BR`))}function Ie(e,t){let n=[],r=new Date(`${e}T12:00:00`),i=new Date(`${t}T12:00:00`);if(Number.isNaN(r.getTime())||Number.isNaN(i.getTime()))return n;for(;r<=i&&n.length<370;)n.push(r.toISOString().slice(0,10)),r.setDate(r.getDate()+1);return n}function Le(e){return e?new Intl.DateTimeFormat(`pt-BR`,{dateStyle:`full`}).format(new Date(`${e}T12:00:00`)):`-`}function Re(e){return e?new Intl.DateTimeFormat(`pt-BR`,{weekday:`short`}).format(new Date(`${e}T12:00:00`)).replace(`.`,``):`-`}function ze({title:e,subtitle:t,eyebrow:n=``}){return`<header class="brand-header">
    <div><div class="brand-mark"><img src="${ie}" alt="CONSAG" /><div>${n?`<span>${E(n)}</span>`:``}<h1>${E(e)}</h1></div></div>${t?`<p class="document-subtitle">${E(t)}</p>`:``}</div>
    <div class="system-mark"><img src="${re}" alt="AlimentaObra" /></div>
  </header>`}function Be({title:e,subtitle:t,eyebrow:n=``,children:r,footer:i=``,orientation:a=`portrait`,showHeader:o=!0}){let s=a===`landscape`,c=o?ze({title:e,subtitle:t,eyebrow:n}):``;return i===null&&(i=`<span style="display:none"></span>`),`<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${E(e)}</title>
    <style>
      @page { size: A4 ${s?`landscape`:`portrait`}; margin: 0; }
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { margin: 0; background: #eef3f8; color: #202124; font: 12px Arial, sans-serif; }
      .print-toolbar { position: sticky; top: 0; z-index: 10; display: flex; justify-content: center; gap: 8px; padding: 10px; background: rgba(0,32,96,.94); box-shadow: 0 10px 30px rgba(0,0,0,.2); }
      .print-toolbar button { min-height: 38px; border: 0; border-radius: 4px; background: #0070c0; color: #fff; padding: 0 16px; font-weight: 800; cursor: pointer; }
      .print-toolbar span { display: inline-flex; align-items: center; color: #eaf2ff; font-size: 11px; font-weight: 700; }
      .document { width: min(${s?`297mm`:`210mm`}, calc(100% - 24px)); min-height: ${s?`210mm`:`297mm`}; margin: 12px auto; background: #fff; padding: ${o?`12mm`:`0`}; box-shadow: 0 18px 45px rgba(0,32,96,.16); }
      .brand-header { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 18px; align-items: center; padding-bottom: 12px; border-bottom: 5px solid #002060; }
      .brand-mark { display: flex; align-items: center; gap: 12px; }
      .brand-mark img { width: ${s?`210px`:`182px`}; max-height: 58px; object-fit: contain; object-position: left center; }
      .brand-mark span { display: block; color: #002060; font-size: 10px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
      .system-mark { display: grid; justify-items: end; align-items: center; }
      .system-mark img { width: ${s?`132px`:`116px`}; max-height: ${s?`54px`:`46px`}; object-fit: contain; object-position: right center; }
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
        .document { width: 100%; min-height: ${s?`210mm`:`297mm`}; margin: 0; padding: ${o?`12mm`:`0`}; box-shadow: none; background: #fff; }
      }
    </style></head><body>
      <div class="print-toolbar"><button onclick="window.print()">Imprimir / salvar PDF</button><span>A página do sistema continua livre na aba anterior.</span></div>
      <main class="document">
        ${c}
        ${r}
        <footer class="footer">${i||`Documento gerado pelo AlimentaObra para padronização operacional e rastreabilidade das refeições.`}</footer>
      </main>
    </body></html>`}function Ve(e,t,n){let r=Object.keys(n.byMeal).length,i=Object.entries(n.byMeal).map(([t,n])=>`
    <section>
      <h2 class="section-title">${E(t)}</h2>
      ${le(e,n.rows[0]?.mealTypeId)||n.rows[0]?.mealDescription?`<p class="small-note">${E(le(e,n.rows[0]?.mealTypeId)||n.rows[0]?.mealDescription)}</p>`:``}
      <table>
        <thead><tr><th>Encarregado</th><th>Local</th><th class="number">Quantidade</th></tr></thead>
        <tbody>${n.rows.map(t=>`<tr><td>${E(m(e,t.leaderId))}</td><td>${E(t.location)}</td><td class="number">${Number(t.quantity??0)}</td></tr>`).join(``)}</tbody>
        <tfoot><tr><th colspan="2">Total ${E(t)}</th><th class="number">${n.total}</th></tr></tfoot>
      </table>
    </section>`).join(``);return Be({title:`Pedido ao fornecedor`,subtitle:`Resumo operacional de ${me(t.date)} com distribuição por refeição, local e encarregado.`,children:`<section class="metrics"><div class="metric"><span>Data</span><strong>${me(t.date)}</strong></div><div class="metric"><span>Total geral</span><strong>${n.total}</strong></div><div class="metric"><span>Tipos de refeição</span><strong>${r}</strong></div></section>${i}`})}function He(e,t,n){let r=e.users.find(e=>e.id===t.supplierId),i=r?.cnpj||r?.document||`-`,a=t.status===`confirmado`?`Confirmado (mas nao entregue)`:w[t.status]??t.status??`-`,o=0,s=Object.entries(n.byMeal).flatMap(([t,n])=>Object.entries(n.byLocation).map(([r,i])=>{let a=n.rows.filter(e=>e.location===r),s=fe(e,a[0]??{}),c=le(e,a[0]?.mealTypeId)||a[0]?.mealDescription||r,l=Number(i)*s;return o+=l,`<tr><td><strong>${E(t)}</strong></td><td>${E(c)}<div class="small-note">Frente: ${E(r)}</div></td><td>UN</td><td class="number">${i}</td><td class="number">${O(s)}</td><td class="number">${O(l)}</td></tr>`})).join(``);return Be({title:`Nota fiscal de fornecimento`,subtitle:`Espelho operacional do pedido ${t.id.slice(0,8).toUpperCase()} para ${me(t.date)}.`,children:`
      <section class="two-columns">
        <div class="info-box"><span>Emitente</span><strong>${E(r?.name??`Fornecedor`)}</strong><p class="small-note">CNPJ/CPF: ${E(i)}<br>Responsavel pelo preparo e entrega das refeicoes.</p></div>
        <div class="info-box"><span>Destinatario</span><strong>CONSAG / AlimentaObra</strong><p class="small-note">Operacao registrada para atendimento das frentes de trabalho.</p></div>
      </section>
      <section class="metrics"><div class="metric"><span>Status</span><strong>${E(a)}</strong></div><div class="metric"><span>Quantidade total</span><strong>${n.total}</strong></div><div class="metric"><span>Valor total</span><strong>${O(o)}</strong></div></section>
      <h2 class="section-title">Dados dos produtos / servicos</h2>
      <table><colgroup><col class="meal" /><col /><col class="unit" /><col class="qty" /><col class="money" /><col class="money" /></colgroup><thead><tr><th>Refeicao</th><th>Descricao</th><th>Un.</th><th class="number">Qtd.</th><th class="number">V. unit.</th><th class="number">V. total</th></tr></thead><tbody>${s}</tbody></table>
      <section class="two-columns">
        <div class="info-box"><span>Informacoes complementares</span><p class="small-note">Documento gerado pelo AlimentaObra para conferencia operacional do fornecedor e do recebimento em campo. A apuracao fiscal, impostos e autorizacao SEFAZ devem constar na NF-e/DANFE oficial anexada pelo fornecedor.</p></div>
        <div class="info-box"><span>Recebimento</span><p class="small-note">Declaro que recebi os itens descritos nesta nota de fornecimento.</p><br><br>________________________________</div>
      </section>`,footer:`Este documento acompanha a operacao e nao substitui NF-e, DANFE ou documento fiscal.`})}function Ue(e){let t=(e,t=`00`)=>Number(e??0)?Number(e??0):t,n=e=>Number(e??0)?O(e):`-`,r=e.dayRows.map(e=>`<tr><td>${E(e.longDate)}</td></tr>`).join(``),i=e.meals.map((r,i)=>{let a=e.dayRows.map(e=>{let r=e.meals[i]??{};return`<tr><td class="day">${E(e.weekday)}</td><td class="number">${t(r.consumed)}</td><td class="number">${O(r.unitPrice)}</td><td class="number">${n(r.value)}</td></tr>`}).join(``);return`<table class="measurement-table meal-table"><colgroup><col class="day-col" /><col class="qty-col" /><col class="unit-col" /><col class="total-col" /></colgroup><thead><tr><th colspan="4" class="meal-title">${E(r.label)}</th></tr><tr><th>Dia</th><th>Real.</th><th>V. unit.</th><th>Total</th></tr></thead><tbody>${a}</tbody><tfoot><tr><th></th><th class="number">${t(r.quantityTotal,`0`)}</th><th></th><th class="number">${O(r.valueTotal)}</th></tr></tfoot></table>`}).join(``),a=e.detailRows.map(e=>`<tr><td>${me(e.date)}</td><td>${E(e.leader)}</td><td>${E(e.section)}</td><td>${E(e.meal)}</td><td class="number">${e.requested}</td><td class="number">${e.consumed}</td><td class="number">${e.effective||`-`}</td><td class="number">${O(e.unitPrice)}</td><td class="number">${O(e.value)}</td><td>${E(e.status)}</td></tr>`).join(``),o=e.sectionSummary.map(e=>`<tr><td>${E(e.label)}</td><td class="number">${e.requested}</td><td class="number">${e.consumed}</td><td class="number">${e.effective||`-`}</td><td class="number">${O(e.value)}</td></tr>`).join(``);return Be({title:`Medicao Todo periodo`,orientation:`landscape`,showHeader:!1,footer:null,children:`<style>
      .document { width: 297mm; min-height: auto; margin: 0 auto; padding: 0; box-shadow: none; background: #fff; color: #000; font-family: Arial, sans-serif; }
      .document > .footer { display: none; }
      .measurement-page { width: 297mm; min-height: 210mm; padding: 15mm 14mm 10mm; break-after: page; page-break-after: always; background: #fff; }
      .measurement-page:last-child { break-after: auto; page-break-after: auto; }
      .cover-page { display: flex; flex-direction: column; }
      .measurement-header { display: grid; grid-template-columns: 29% 42.5% 28.5%; min-height: 31mm; border: 2px solid #000; }
      .measurement-logo-box, .measurement-info-box, .measurement-meta-box { min-width: 0; display: grid; align-items: center; border-right: 2px solid #000; }
      .measurement-meta-box { border-right: 0; grid-template-columns: minmax(0,1fr) 92px; column-gap: 12px; padding: 8px 12px; }
      .measurement-logo-box { justify-items: center; padding: 2mm 4mm; }
      .measurement-logo-box img { width: 96%; max-height: 28mm; object-fit: contain; }
      .measurement-system-logo { width: 86px; max-height: 58px; object-fit: contain; justify-self: end; }
      .measurement-title { background: #0b336a; color: #fff; padding: 5px 8px; text-align: center; font-size: 12pt; font-weight: 900; letter-spacing: .02em; }
      .measurement-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 32px; padding: 7px 12px 8px; font-size: 9.5pt; line-height: 1.15; }
      .measurement-label { font-weight: 900; }
      .measurement-meta-list { display: grid; gap: 3px; font-size: 9.5pt; line-height: 1.1; }
      .measurement-layout { display: grid; grid-template-columns: ${`1.04fr repeat(${Math.max(e.meals.length,1)}, 1.22fr)`}; gap: 6px; margin-top: 8px; align-items: start; }
      .measurement-table { width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0; border-radius: 0; font-size: 6.25pt; line-height: 1.1; }
      .measurement-table th, .measurement-table td { border: 1px solid #000; padding: 3px 4px; color: #000; vertical-align: middle; }
      .measurement-table th { background: #b9c2cc; color: #000; text-align: center; font-weight: 900; letter-spacing: 0; text-transform: none; }
      .measurement-table .meal-title, .measurement-table tfoot th { background: #0b336a; color: #fff; }
      .date-table thead th, .date-table tfoot th { height: 17px; background: #0b336a; color: #fff; }
      .date-table tbody th { background: #b9c2cc; }
      .date-table td { height: 17px; background: #c8d0d8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .meal-table th, .meal-table td { height: 17px; }
      .meal-table .day-col { width: 21%; }
      .meal-table .qty-col { width: 19%; }
      .meal-table .unit-col { width: 26%; }
      .meal-table .total-col { width: 34%; }
      .meal-table .number { font-size: 6pt; }
      .meal-table .day { background: #b9c2cc; text-align: center; font-weight: 900; }
      .number { text-align: right; white-space: nowrap; }
      .measurement-total { display: grid; grid-template-columns: 45mm 45mm; width: 90mm; margin-top: 8mm; border: 2px solid #000; font-weight: 950; overflow: hidden; }
      .measurement-total span, .measurement-total strong { min-height: 10mm; display: grid; align-items: center; padding: 0 9px; font-size: 14pt; line-height: 1; white-space: nowrap; }
      .measurement-total span { justify-content: center; background: #b9b4b4; border-right: 2px solid #000; }
      .measurement-total strong { justify-content: end; background: #fff; }
      .measurement-signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 18mm; width: 140mm; margin: auto auto 0; padding-bottom: 7mm; text-align: center; font-size: 13pt; font-weight: 950; }
      .measurement-signature { padding-top: 4mm; border-top: 1px solid #000; }
      .detail-page { padding-top: 14mm; }
      .summary-page { padding-top: 16mm; }
      .measurement-heading { margin: 0 0 5mm; font-size: 17pt; line-height: 1; font-weight: 950; letter-spacing: 0; }
      .detail-table { font-size: 7pt; }
      .detail-table th, .detail-table td { height: 17px; padding: 4px 6px; }
      .detail-table th { background: #0b336a; color: #fff; }
      .detail-table td { background: #fff; }
      .summary-title { margin-top: 7mm; }
      .summary-table { font-size: 7pt; }
      .summary-table th { background: #0b336a; color: #fff; }
      @media print {
        .document { width: 297mm; margin: 0; }
        .measurement-page { width: 297mm; min-height: 210mm; }
      }
    </style>
    <section class="measurement-page cover-page">
      <header class="measurement-header">
        <div class="measurement-logo-box"><img src="${ie}" alt="CONSAG" /></div>
        <div class="measurement-info-box">
          <div class="measurement-title">Memoria de Calculo - Servico Alimentacao</div>
          <div class="measurement-info-grid">
            <div><span class="measurement-label">Empresa:</span> ${E(e.supplierName)}</div>
            <div><span class="measurement-label">Periodo:</span> ${E(e.dateRangeLabel??e.periodLabel)}</div>
            <div><span class="measurement-label">CNPJ:</span> ${E(e.supplierDocument)}</div>
            <div><span class="measurement-label">QTD. dias:</span> ${e.measuredDays}</div>
            <div><span class="measurement-label">Escopo:</span> ${E(e.scope)}</div>
            <div><span class="measurement-label">Area/Setor:</span> ${E(e.area)}</div>
          </div>
        </div>
        <div class="measurement-meta-box">
          <div class="measurement-meta-list">
            <div><span class="measurement-label">Cod. Forn.:</span> ${E(e.supplierCode)}</div>
            <div><span class="measurement-label">Medicao:</span> ${E(e.periodLabel)}</div>
            <div><span class="measurement-label">Revisao:</span> ${E(e.revision)}</div>
            <div><span class="measurement-label">Gerado:</span> ${E(e.generatedAt)}</div>
          </div>
          <img class="measurement-system-logo" src="${re}" alt="AlimentaObra" />
        </div>
      </header>
      <div class="measurement-layout">
        <table class="measurement-table date-table"><thead><tr><th>&nbsp;</th></tr><tr><th>DATA</th></tr></thead><tbody>${r}</tbody><tfoot><tr><th>TOTAL</th></tr></tfoot></table>
        ${i}
      </div>
      <div class="measurement-total"><span>TOTAL</span><strong>${O(e.totalValue)}</strong></div>
      <div class="measurement-signatures"><div class="measurement-signature">Solicitante/Acompanhante</div><div class="measurement-signature">Fornecedor</div></div>
    </section>
    <section class="measurement-page detail-page">
      <h2 class="measurement-heading">Detalhamento completo da medicao</h2>
      <table class="measurement-table detail-table"><thead><tr><th>Data</th><th>Encarregado</th><th>Equipe/Trecho</th><th>Tipo</th><th class="number">Solic.</th><th class="number">Real.</th><th class="number">Efetivo</th><th class="number">Valor unit.</th><th class="number">Total</th><th>Status</th></tr></thead><tbody>${a||`<tr><td colspan="10">Sem movimentacao no periodo.</td></tr>`}</tbody></table>
    </section>
    <section class="measurement-page summary-page">
      <h2 class="measurement-heading">Resumo por equipe/trecho</h2>
      <table class="measurement-table summary-table"><thead><tr><th>Equipe/Trecho</th><th class="number">Solicitado</th><th class="number">Realizado</th><th class="number">Efetivo</th><th class="number">Total</th></tr></thead><tbody>${o||`<tr><td colspan="5">Sem movimentacao no periodo.</td></tr>`}</tbody></table>
    </section>`})}function We(e,t,n={}){let r=Ne(e,t,n),i=Object.values(r.detailRows.reduce((e,t)=>(e[t.date]??={date:t.date,rows:[],requested:0,consumed:0,value:0,leaders:new Set,sections:new Set},e[t.date].rows.push(t),e[t.date].requested+=t.requested,e[t.date].consumed+=t.consumed,e[t.date].value+=t.value,e[t.date].leaders.add(t.leader),e[t.date].sections.add(t.section),e),{})).sort((e,t)=>e.date.localeCompare(t.date)),a=i.map((e,t)=>{let n=e.rows.map(e=>`<tr><td>${me(e.date)}</td><td>${E(e.leader)}</td><td>${E(e.section)}</td><td>${E(e.meal)}</td><td class="number">${e.requested}</td><td class="number">${e.consumed}</td><td class="number">${e.effective||`-`}</td><td class="number">${O(e.unitPrice)}</td><td class="number">${O(e.value)}</td><td>${E(e.status)}</td></tr>`).join(``);return`<section class="order-day-block ${t?`order-day-break`:``}">
      <header class="order-day-header">
        <div><span>Bloco diario</span><strong>${me(e.date)}</strong></div>
        <div class="order-day-pills"><b>${e.rows.length} pedidos</b><b>${e.requested} solicitadas</b><b>${e.consumed} realizadas</b><b>${e.leaders.size} encarregados</b><b>${e.sections.size} equipes</b></div>
      </header>
      <table class="orders-table"><thead><tr><th>Data</th><th>Encarregado</th><th>Equipe/Trecho</th><th>Tipo</th><th class="number">Solic.</th><th class="number">Real.</th><th class="number">Efetivo</th><th class="number">Unitario</th><th class="number">Total</th><th>Status</th></tr></thead><tbody>${n}</tbody><tfoot><tr><th colspan="4">Total do bloco</th><th class="number">${e.requested}</th><th class="number">${e.consumed}</th><th colspan="2"></th><th class="number">${O(e.value)}</th><th></th></tr></tfoot></table>
    </section>`}).join(``);return Be({title:`Relatorio de pedidos`,subtitle:`Pedidos recebidos no periodo ${r.periodLabel}, com a mesma leitura operacional da planilha em PDF.`,orientation:`landscape`,children:`<style>
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
    </style><section class="metrics"><div class="metric"><span>Periodo</span><strong>${E(r.periodLabel)}</strong></div><div class="metric"><span>Pedidos</span><strong>${r.detailRows.length}</strong></div><div class="metric"><span>Blocos</span><strong>${i.length}</strong></div></section><section class="metrics"><div class="metric"><span>Solicitado</span><strong>${r.detailRows.reduce((e,t)=>e+t.requested,0)}</strong></div><div class="metric"><span>Realizado</span><strong>${r.totalQuantity}</strong></div><div class="metric"><span>Valor total</span><strong>${O(r.totalValue)}</strong></div></section>${a||`<p class="small-note">Sem pedidos no periodo.</p>`}`})}function Ge(e,t=20){let n=String(e??``);return n.length>t?`${n.slice(0,t-3)}...`:n}function Ke(e,t){return t?Math.round(Number(e??0)/t*100):0}function qe(e,t=[[`requested`,`Solicitado`,`#002060`],[`consumed`,`Consumido`,`#0070c0`],[`effective`,`Efetivo`,`#a6a6a6`]]){let n=e.length?e:[{label:`Sem dados`,requested:0,consumed:0,effective:0}],r=Math.max(...n.flatMap(e=>t.map(([t])=>Number(e[t]??0))),1),i=e=>191-Number(e??0)/r*163,a=690/n.length,o=Math.min(18,Math.max(8,a/(t.length+2))),s=[0,.25,.5,.75,1].map(e=>{let t=191-e*163,n=Math.round(r*e);return`<line x1="52" y1="${t}" x2="742" y2="${t}" stroke="#d9d9d9" stroke-width="1"/><text x="44" y="${t+4}" text-anchor="end" font-size="10" fill="#6b7280">${n}</text>`}).join(``),c=n.map((e,n)=>{let r=52+a*n+a/2,s=r-(t.length*o+(t.length-1)*8)/2;return`${t.map(([t,,n],r)=>{let a=Number(e[t]??0),c=Math.max(0,191-i(a)),l=s+r*(o+8);return`<rect x="${l}" y="${i(a)}" width="${o}" height="${c}" fill="${n}"/><text x="${l+o/2}" y="${Math.max(12,i(a)-5)}" text-anchor="middle" font-size="10" font-weight="700" fill="#4b5563">${a||``}</text>`}).join(``)}<text x="${r}" y="212" text-anchor="middle" font-size="10" font-weight="700" fill="#4b5563">${E(Ge(e.label,16))}</text>`}).join(``);return`<svg class="kpi-chart" viewBox="0 0 760 235" role="img" aria-label="Grafico comparativo de refeicoes">
    <rect x="0" y="0" width="760" height="235" fill="#fff"/>
    ${t.map(([,e,t],n)=>{let r=760/2-145+n*100;return`<rect x="${r}" y="8" width="9" height="9" fill="${t}"/><text x="${r+13}" y="16" font-size="11" fill="#4b5563">${E(e)}</text>`}).join(``)}${s}
    <line x1="52" y1="191" x2="742" y2="191" stroke="#bfbfbf" stroke-width="1.2"/>
    <text x="14" y="109.5" transform="rotate(-90 14 109.5)" text-anchor="middle" font-size="11" fill="#4b5563">Quantidade</text>
    ${c}
  </svg>`}function Je(e){let t=e.length?e:[[`-`,{requested:0,consumed:0,effective:0}]],n=696/t.length,r=Math.min(34,Math.max(18,n*.42));return`<svg class="kpi-chart" viewBox="0 0 760 250" role="img" aria-label="Taxa de ocupacao diaria">
    <rect x="0" y="0" width="760" height="250" fill="#fff"/>
    ${[0,.25,.5,.75,1].map(e=>{let t=206-e*180;return`<line x1="44" y1="${t}" x2="740" y2="${t}" stroke="#d9d9d9" stroke-width="1"/><text x="36" y="${t+4}" text-anchor="end" font-size="10" fill="#6b7280">${Math.round(e*100)}%</text>`}).join(``)}
    <line x1="44" y1="206" x2="740" y2="206" stroke="#bfbfbf" stroke-width="1.2"/>
    ${t.map(([e,t],i)=>{let a=Number(t.effective||t.requested||0),o=a?Number(t.consumed??0)/a*100:0,s=Math.max(0,Math.min(100,o))/100*180,c=44+n*i+(n-r)/2,l=206-s,u=String(e).includes(`-`)?String(e).slice(5).replace(`-`,`/`):e;return`<rect x="${c}" y="26" width="${r}" height="180" fill="#d9d9d9"/><rect x="${c}" y="${l}" width="${r}" height="${s}" fill="#002060"/><text x="${c+r/2}" y="${Math.max(14,l-6)}" text-anchor="middle" font-size="10" font-weight="800" fill="#4b5563">${Math.round(o)}%</text><text x="${c+r/2}" y="227" text-anchor="middle" font-size="10" font-weight="700" fill="#4b5563">${E(u)}</text>`}).join(``)}
    <rect x="${760/2-90}" y="240" width="10" height="8" fill="#002060"/><text x="${760/2-76}" y="247" font-size="10" fill="#4b5563">Ocupacao</text>
    <rect x="385" y="240" width="10" height="8" fill="#d9d9d9"/><text x="399" y="247" font-size="10" fill="#4b5563">Disponibilidade</text>
  </svg>`}function Ye(e,t){let n=2*Math.PI*52,r=e.reduce((e,t)=>e+Number(t.value??0),0),i=0,a=r?e.map((e,t)=>{let a=Number(e.value??0)/r*n,o=`<circle cx="82" cy="92" r="52" fill="none" stroke="${ae[t%ae.length]}" stroke-width="32" stroke-dasharray="${a} ${n-a}" stroke-dashoffset="${-i}" transform="rotate(-90 82 92)"/>`;return i+=a,o}).join(``):`<circle cx="82" cy="92" r="52" fill="none" stroke="#d9d9d9" stroke-width="32"/>`,o=(e.length?e:[{label:`Sem dados`,value:0}]).slice(0,7).map((e,t)=>{let n=42+t*19;return`<rect x="178" y="${n-8}" width="9" height="9" fill="${ae[t%ae.length]}"/><text x="193" y="${n}" font-size="11" fill="#4b5563">${E(Ge(e.label,19))}</text><text x="340" y="${n}" text-anchor="end" font-size="11" font-weight="800" fill="#202124">${e.value}</text>`}).join(``),s=String(t??``);return`<svg class="kpi-chart" viewBox="0 0 360 190" role="img" aria-label="Grafico de distribuicao">
    <rect x="0" y="0" width="360" height="190" fill="#fff"/>
    ${a}
    <circle cx="82" cy="92" r="31" fill="#fff" stroke="#d9e2f3"/>
    <text x="82" y="97" text-anchor="middle" font-size="${s.length>12?10:s.length>8?12:17}" font-weight="900" fill="#002060">${E(s)}</text>
    ${o}
  </svg>`}function Xe(e){let t=Math.max(180,18+Math.max(e.length,4)*38+18),n=Math.max(...e.map(e=>Number(e.consumed??e.value??0)),1);return`<svg class="kpi-chart" viewBox="0 0 760 ${t}" role="img" aria-label="Ranking operacional">${(e.length?e:[{label:`Sem dados`,consumed:0}]).map((e,t)=>{let r=Number(e.consumed??e.value??0),i=18+t*38,a=Math.max(2,r/n*385);return`<text x="18" y="${i+22}" font-size="13" font-weight="800" fill="#4b5563">${E(Ge(e.label,24))}</text><rect x="255" y="${i+9}" width="385" height="16" fill="#d9e2f3"/><rect x="255" y="${i+9}" width="${a}" height="16" fill="${ae[t%ae.length]}"/><text x="742" y="${i+22}" text-anchor="end" font-size="13" font-weight="900" fill="#202124">${r} ref.</text>`}).join(``)}</svg>`}function Ze(e,t=`value`,n=String,r=28){let i=Math.max(160,16+Math.max(e.length,4)*30+16),a=Math.max(...e.map(e=>Number(e[t]??0)),1);return`<svg class="kpi-chart" viewBox="0 0 760 ${i}" role="img" aria-label="Grafico de valores">${(e.length?e:[{label:`Sem dados`,[t]:0}]).map((e,i)=>{let o=Number(e[t]??0),s=16+i*30,c=Math.max(2,o/a*380);return`<text x="12" y="${s+18}" font-size="10" font-weight="800" fill="#4b5563">${E(Ge(e.label,r))}</text><rect x="180" y="${s+9}" width="380" height="10" fill="#d9e2f3"/><rect x="180" y="${s+9}" width="${c}" height="10" fill="${ae[i%ae.length]}"/><text x="742" y="${s+18}" text-anchor="end" font-size="10" font-weight="900" fill="#202124">${E(n(o))}</text>`}).join(``)}</svg>`}function Qe(e,t,n){let r=Me(e,t,{periodLabel:`periodo filtrado`}),i=r.detailRows.reduce((e,t)=>e+t.requested,0),a=r.totalQuantity,o=r.detailRows.reduce((e,t)=>e+Number(t.effective||0),0),s=r.mealSummary.map(e=>`<tr><td>${E(e.label)}</td><td class="number">${e.requested}</td><td class="number">${e.consumed}</td><td class="number">${e.effective||`-`}</td><td class="number">${O(e.value)}</td></tr>`).join(``),c=r.sectionSummary.map(e=>`<tr><td>${E(e.label)}</td><td class="number">${e.requested}</td><td class="number">${e.consumed}</td><td class="number">${e.effective||`-`}</td><td class="number">${e.consumed-e.requested}</td><td class="number">${O(e.value)}</td></tr>`).join(``),l=Object.entries(r.detailRows.reduce((e,t)=>(e[t.date]??={requested:0,consumed:0,effective:0},e[t.date].requested+=t.requested,e[t.date].consumed+=t.consumed,e[t.date].effective+=Number(t.effective||0),e),{})).sort(([e],[t])=>e.localeCompare(t)),u=Object.entries(r.detailRows.reduce((e,t)=>{let n=w[t.status]??t.status??`Sem status`;return e[n]=(e[n]??0)+1,e},{})).map(([e,t])=>({label:e,value:t})),d=r.mealSummary.slice(0,8),f=r.sectionSummary.slice(0,8),p=r.mealSummary.map(e=>({label:e.label,value:e.consumed})).filter(e=>e.value>0),m=o?`${Ke(a,o)}%`:`-`,h=i?`${Ke(a,i)}%`:`-`,g=O(a?r.totalValue/a:0),_=`Relatorio executivo de refeicoes para reunioes: visao geral, ocupacao, distribuicao e detalhamento por area.`,v=ze({title:n,subtitle:_});return Be({title:n,subtitle:_,footer:null,orientation:`landscape`,showHeader:!1,children:`<section class="kpi-report">
      <section class="report-page">${v}<div class="page-label">Resumo executivo</div><p class="page-subtitle">Leitura consolidada do periodo filtrado no sistema, seguindo a identidade azul CONSAG.</p><div class="kpi-scoreboard"><div class="kpi-score"><span>Solicitado</span><strong>${i}</strong><small>refeicoes planejadas</small></div><div class="kpi-score"><span>Consumido real</span><strong>${a}</strong><small>${h} do solicitado</small></div><div class="kpi-score"><span>Efetivo</span><strong>${o||`-`}</strong><small>base informada por area</small></div><div class="kpi-score"><span>Custo total</span><strong>${O(r.totalValue)}</strong><small>${g} por refeicao</small></div></div><article class="kpi-panel"><h2>Comparativo de refeicoes</h2><div class="kpi-panel-body">${qe(d)}</div></article><div class="kpi-note-grid"><div class="kpi-note"><strong>Diferenca</strong>${a-i} refeicoes entre consumo real e solicitado.</div><div class="kpi-note"><strong>Ocupacao</strong>${m} sobre o efetivo informado no periodo.</div><div class="kpi-note"><strong>Registros</strong>${r.detailRows.length} pedidos considerados no filtro atual.</div></div></section>
      <section class="report-page">${v}<div class="page-label">Ocupacao diaria</div><p class="page-subtitle">Analise diaria do periodo selecionado.</p><article class="kpi-panel"><h2>Taxa de ocupacao diaria</h2><div class="kpi-panel-body">${Je(l)}</div></article></section>
      <section class="report-page">${v}<div class="page-label">Distribuicao e status</div><p class="page-subtitle">Composicao por tipo de refeicao e status dos pedidos no periodo selecionado.</p><div class="kpi-two"><article class="kpi-panel"><h2>Distribuicao por refeicao</h2><div class="kpi-panel-body">${Ye(p,String(a||i))}</div></article><article class="kpi-panel"><h2>Status dos pedidos</h2><div class="kpi-panel-body">${Ye(u,String(r.detailRows.length))}</div></article></div></section>
      <section class="report-page">${v}<div class="page-label">Areas e trechos</div><p class="page-subtitle">Ranking operacional para identificar concentracao de consumo, diferencas e custo por frente.</p><article class="kpi-panel"><h2>Top equipes / trechos por consumo</h2><div class="kpi-panel-body">${Xe(f)}</div></article><article class="kpi-panel"><h2>Detalhamento por equipe / trecho</h2><div class="kpi-panel-body"><table class="kpi-table"><thead><tr><th>Equipe / trecho</th><th class="number">Solic.</th><th class="number">Cons.</th><th class="number">Efetivo</th><th class="number">Dif.</th><th class="number">Custo</th></tr></thead><tbody>${c||`<tr><td colspan="6">Sem dados no periodo.</td></tr>`}</tbody></table></div></article></section>
      <section class="report-page">${v}<div class="page-label">Detalhamento por refeicao</div><p class="page-subtitle">Composicao completa por tipo de refeicao para conferencia em reuniao e rastreabilidade do periodo.</p><article class="kpi-panel"><h2>Composicao por tipo de refeicao</h2><div class="kpi-panel-body"><table class="kpi-table"><thead><tr><th>Tipo</th><th class="number">Solic.</th><th class="number">Cons.</th><th class="number">Efetivo</th><th class="number">Custo</th></tr></thead><tbody>${s||`<tr><td colspan="5">Sem dados no periodo.</td></tr>`}</tbody></table></div></article><div class="kpi-note-grid"><div class="kpi-note"><strong>Fonte</strong>Pedidos, consumo real, efetivo por equipe/trecho e precos cadastrados no AlimentaObra.</div><div class="kpi-note"><strong>Leitura</strong>O consumo real prevalece quando o fornecedor/admin informou medicao final.</div><div class="kpi-note"><strong>Marca</strong>Cores e hierarquia visual seguem a base azul da CONSAG.</div></div></section>
    </section>`})}function $e(e,t,n){let r=[...t].filter(e=>e.status!==`cancelado`).sort((e,t)=>t.date.localeCompare(e.date)),i=r.reduce((t,n)=>t+D(e,n)*fe(e,n),0),a=r.filter(e=>e.status===`entregue`).reduce((t,n)=>t+D(e,n)*fe(e,n),0),o=i-a,s=r.reduce((e,t)=>e+Number(t.quantity??0),0),c=r.reduce((t,n)=>t+D(e,n),0),l=c?i/c:0,u=Object.entries(r.reduce((t,n)=>{let r=n.mealType||`Refeicao`;return t[r]??={label:r,value:0},t[r].value+=D(e,n)*fe(e,n),t},{})).map(([,e])=>e).sort((e,t)=>t.value-e.value),d=Object.entries(r.reduce((t,n)=>{let r=n.date;return t[r]??={label:me(r),value:0},t[r].value+=D(e,n)*fe(e,n),t},{})).map(([,e])=>e).sort((e,t)=>e.label.localeCompare(t.label)),f=Object.entries(r.reduce((t,n)=>{let r=n.sectionName||n.location||`Sem equipe`;return t[r]??={label:r,value:0},t[r].value+=D(e,n)*fe(e,n),t},{})).map(([,e])=>e).sort((e,t)=>t.value-e.value),p=[{label:`Concluido`,value:Math.max(0,a)},{label:`Em aberto`,value:Math.max(0,o)}].filter(e=>e.value>0),m=r.slice(0,24).map(t=>`<tr><td>${me(t.date)}</td><td>${E(t.mealType)}</td><td>${E(t.sectionName||t.location)}</td><td class="number">${Number(t.quantity??0)}</td><td class="number">${D(e,t)}</td><td class="number">${O(fe(e,t))}</td><td class="number">${O(D(e,t)*fe(e,t))}</td><td>${E(t.status)}</td></tr>`).join(``),h=`Relatorio financeiro executivo com custo total, valores concluidos, saldo em aberto e composicao por tipo, dia e frente.`,g=ze({title:n,subtitle:h});return Be({title:n,subtitle:h,footer:null,orientation:`landscape`,showHeader:!1,children:`<section class="kpi-report">
      <section class="report-page">${g}<div class="page-label">Resumo financeiro</div><p class="page-subtitle">Leitura consolidada dos custos de refeicoes no periodo selecionado.</p><div class="kpi-scoreboard"><div class="kpi-score"><span>Total previsto</span><strong>${O(i)}</strong><small>${c} refeicoes consumidas</small></div><div class="kpi-score"><span>Concluido</span><strong>${O(a)}</strong><small>${Ke(a,i)}% do valor total</small></div><div class="kpi-score"><span>Em aberto</span><strong>${O(o)}</strong><small>${Ke(o,i)}% do valor total</small></div><div class="kpi-score"><span>Ticket medio</span><strong>${O(l)}</strong><small>por refeicao consumida</small></div></div><div class="kpi-two"><article class="kpi-panel"><h2>Composicao por refeicao</h2><div class="kpi-panel-body">${Ze(u.slice(0,7),`value`,O)}</div></article><article class="kpi-panel"><h2>Status financeiro</h2><div class="kpi-panel-body">${Ye(p.map(e=>({label:e.label,value:Math.round(e.value)})),`Total`)}</div></article></div><div class="kpi-note-grid"><div class="kpi-note"><strong>Solicitado</strong>${s} refeicoes solicitadas no periodo.</div><div class="kpi-note"><strong>Consumido</strong>${c} refeicoes usadas no calculo financeiro.</div><div class="kpi-note"><strong>Fonte</strong>Pedidos, consumo real e preco unitario cadastrados no sistema.</div></div></section>
      <section class="report-page">${g}<div class="page-label">Evolucao e frentes</div><p class="page-subtitle">Acompanhamento dos valores por data e ranking das frentes com maior impacto financeiro.</p><div class="kpi-two"><article class="kpi-panel"><h2>Evolucao por dia</h2><div class="kpi-panel-body">${Ze(d,`value`,O,18)}</div></article><article class="kpi-panel"><h2>Top equipes / trechos por custo</h2><div class="kpi-panel-body">${Ze(f.slice(0,8),`value`,O)}</div></article></div></section>
      <section class="report-page">${g}<div class="page-label">Movimentacoes</div><p class="page-subtitle">Detalhamento financeiro das movimentacoes consideradas no periodo.</p><article class="kpi-panel"><h2>Movimentacoes do periodo</h2><div class="kpi-panel-body"><table class="kpi-table"><thead><tr><th>Data</th><th>Tipo</th><th>Equipe/Trecho</th><th class="number">Solic.</th><th class="number">Cons.</th><th class="number">Unitario</th><th class="number">Total</th><th>Status</th></tr></thead><tbody>${m||`<tr><td colspan="8">Sem movimentacao no periodo.</td></tr>`}</tbody></table></div></article>${r.length>24?`<p class="small-note">Mostrando as 24 movimentacoes mais recentes. Use a medicao em Excel para conferencia completa linha a linha.</p>`:``}</section>
    </section>`})}function et(e){let t=[...e.auditLog],n=new Set(t.map(e=>e.userId)).size,r=new Set(t.map(e=>he(e.entity))).size,i=t.map(t=>`<div class="timeline-item"><div class="timeline-dot"></div><div><strong>${E(t.action)}</strong><br>${E(m(e,t.userId))} - ${pe(t.at)} - ${E(he(t.entity))}</div></div>`).join(``);return Be({title:`Auditoria do sistema`,subtitle:`Registro de usuário, data e horário das ações realizadas no AlimentaObra.`,children:`<section class="metrics"><div class="metric"><span>Eventos</span><strong>${t.length}</strong></div><div class="metric"><span>Usuários</span><strong>${n}</strong></div><div class="metric"><span>Áreas</span><strong>${r}</strong></div></section><h2 class="section-title">Eventos registrados</h2><section class="timeline">${i||`<p class="small-note">Nenhum evento registrado.</p>`}</section>`})}function tt(e,t,n){let r=Object.entries(n.byMeal).map(([t,n])=>`
    <h2>${E(t)}</h2>
    ${le(e,n.rows[0]?.mealTypeId)||n.rows[0]?.mealDescription?`<p>${E(le(e,n.rows[0]?.mealTypeId)||n.rows[0]?.mealDescription)}</p>`:``}
    <table>
      <tbody>${n.rows.map(t=>`<tr><td>${E(m(e,t.leaderId))}</td><td>${E(t.location)}</td><td>${Number(t.quantity??0)}</td></tr>`).join(``)}</tbody>
      <tfoot><tr><th colspan="2">Total ${E(t)}</th><th>${n.total}</th></tr></tfoot>
    </table>`).join(``);return`<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" /><title>Pedido ao fornecedor ${E(t.date)}</title><style>body{font-family:Arial,sans-serif;color:#1a1a1a;margin:32px}h1{color:#e8520a;margin-bottom:4px}h2{margin-top:24px;border-bottom:2px solid #e8520a;padding-bottom:6px}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:1px solid #ddd;padding:8px;text-align:left}tfoot th{background:#f5f5f3}.total{margin-top:24px;font-size:20px;font-weight:700}</style></head><body><h1>Pedido ao fornecedor</h1><p>Data: ${me(t.date)}</p>${r}<div class="total">Total geral: ${n.total} refeições</div></body></html>`}function nt(e){return ht([ot(e),lt(e),dt(e),ft(e)])}function rt(e){return ht([{...ot(e),name:`Relatorio diario`}])}function it(e){return ht([st(e),ct(e)])}function at(e){return ht([ut(e)])}function ot(e){let t=e.meals.length?e.meals:[{label:`Refeicao`,quantityTotal:0,valueTotal:0}],n=1+t.length*4,r=Math.max(5,n-4),i=r+1,a=8+Math.max(e.dayRows.length,1)-1,o=a+1,s=o+2,c=[];return yt(c,1,1,4,4,1),k(c,1,1,`CONSAG`,1),yt(c,1,5,1,r,5),yt(c,2,5,4,r,4),k(c,1,5,`Memoria de Calculo - Servico Alimentacao`,5),k(c,2,5,`Empresa: ${e.supplierName}`,4),k(c,3,5,`CNPJ: ${e.supplierDocument}`,4),k(c,4,5,`Escopo: ${e.scope} | Periodo: ${me(e.periodStart)} a ${me(e.periodEnd)} | QTD. dias medido: ${e.measuredDays}`,4),yt(c,1,i,4,n,3),k(c,1,i,`AlimentaObra`,3),k(c,2,i,`Medicao: ${e.periodLabel}`,4),k(c,3,i,`Area/Setor: ${e.area}`,4),k(c,4,i,`Revisao: ${e.revision}`,4),k(c,6,1,`DATA`,5),k(c,7,1,`DATA`,6),t.forEach((e,t)=>{let n=2+t*4;yt(c,6,n,6,n+3,5),k(c,6,n,e.label,5),[`Dia`,`REALIZADO`,`VALOR UNITARIO`,`VALOR TOTAL`].forEach((e,t)=>{k(c,7,n+t,e,6)})}),(e.dayRows.length?e.dayRows:[{longDate:`-`,weekday:`-`,meals:t.map(e=>({consumed:0,unitPrice:0,value:0}))}]).forEach((e,n)=>{let r=8+n;k(c,r,1,e.longDate,8),t.forEach((t,n)=>{let i=e.meals[n]??{consumed:0,unitPrice:0,value:0},a=2+n*4,o=a+1,s=a+2,l=a+3;k(c,r,a,e.weekday,8),k(c,r,o,Number(i.consumed??0),4),k(c,r,s,Number(i.unitPrice??0),10),k(c,r,l,Number(i.value??0),10,{formula:`${A(o)}${r}*${A(s)}${r}`})})}),yt(c,o,1,o,n,11),k(c,o,1,`TOTAL`,11),t.forEach((e,n)=>{let r=2+n*4,i=r+1,s=r+3;k(c,o,i,t[n].quantityTotal,12,{formula:`SUM(${A(i)}8:${A(i)}${a})`}),k(c,o,s,t[n].valueTotal,12,{formula:`SUM(${A(s)}8:${A(s)}${a})`})}),yt(c,s,1,s,2,13),yt(c,s,3,s,4,14),k(c,s,1,`TOTAL`,13),k(c,s,3,e.totalValue,14,{formula:t.map((e,t)=>`${A(5+t*4)}${o}`).join(`+`)||`0`}),bt(c,1,1,s,n,4),{name:`Medicao`,rows:c,columnWidths:[34,...t.flatMap(()=>[9,11,14,15])],rowHeights:{1:30,2:15,3:15,4:15,5:15,6:18,7:18,[o]:18,[s]:24},freezeRows:7,merges:[`A1:D4`,`E1:${A(r)}1`,`E2:${A(r)}2`,`E3:${A(r)}3`,`${A(i)}1:${A(n)}1`,`${A(i)}2:${A(n)}2`,`${A(i)}3:${A(n)}3`,`${A(i)}4:${A(n)}4`,...t.map((e,t)=>`${A(2+t*4)}6:${A(5+t*4)}6`),`A${s}:B${s}`,`C${s}:D${s}`].filter(e=>!e.includes(`undefined`)),pageSetup:!0}}function st(e){let t=[];return pt(t,{logoEnd:3,titleStart:4,titleEnd:9,rightStart:10,rightEnd:12,title:`Relatorio de Pedidos`,leftLines:[`Empresa: ${e.supplierName}`,`Periodo: ${e.periodLabel}`,`Gerado: ${e.generatedAt}`],rightLines:[`AlimentaObra`,`Registros: ${e.detailRows.length}`,``,``]}),[`Data`,`Dia`,`Encarregado`,`Equipe/Trecho`,`Tipo`,`Solicitado`,`Realizado`,`Efetivo`,`Valor unitario`,`Valor total`,`Status`,`Observacoes`].forEach((e,n)=>{k(t,6,n+1,e,5)}),e.detailRows.forEach((e,n)=>{let r=n+7;k(t,r,1,Le(e.date),8),k(t,r,2,e.weekday,8),[e.leader,e.section,e.meal].forEach((e,n)=>k(t,r,n+3,e,4)),[e.requested,e.consumed,e.effective||``].forEach((e,n)=>k(t,r,n+6,e,4)),k(t,r,9,e.unitPrice,10),k(t,r,10,e.value,10),k(t,r,11,e.status,4),k(t,r,12,e.notes,4)}),bt(t,1,1,Math.max(6,e.detailRows.length+6),12,4),{name:`Pedidos`,rows:t,columnWidths:[34,12,28,30,24,12,12,12,14,14,16,34],rowHeights:mt(Math.max(6,e.detailRows.length+6)),freezeRows:6,autoFilter:`A6:L${Math.max(6,e.detailRows.length+6)}`,merges:[`A1:C4`,`D1:I1`,`J1:L1`,`D2:I2`,`J2:L2`,`D3:I3`,`J3:L3`,`D4:I4`,`J4:L4`],pageSetup:!0}}function ct(e){let t=[],n=Object.values(e.detailRows.reduce((e,t)=>(e[t.date]??={date:t.date,count:0,requested:0,consumed:0,effective:0,leaders:new Set,sections:new Set,value:0},e[t.date].count+=1,e[t.date].requested+=t.requested,e[t.date].consumed+=t.consumed,e[t.date].effective+=Number(t.effective||0),e[t.date].leaders.add(t.leader),e[t.date].sections.add(t.section),e[t.date].value+=t.value,e),{})).sort((e,t)=>e.date.localeCompare(t.date));return pt(t,{logoEnd:3,titleStart:4,titleEnd:7,rightStart:8,rightEnd:9,title:`Resumo Diario de Pedidos`,leftLines:[`Empresa: ${e.supplierName}`,`Periodo: ${e.periodLabel}`,`Gerado: ${e.generatedAt}`],rightLines:[`AlimentaObra`,`Dias: ${n.length}`,``,``]}),[`Data`,`Dia`,`Pedidos`,`Solicitadas`,`Realizadas`,`Efetivo`,`Encarregados`,`Equipes`,`Valor total`].forEach((e,n)=>{k(t,6,n+1,e,5)}),n.forEach((e,n)=>{let r=n+7;k(t,r,1,Le(e.date),8),k(t,r,2,Re(e.date),8),k(t,r,3,e.count,4),k(t,r,4,e.requested,4),k(t,r,5,e.consumed,4),k(t,r,6,e.effective,4),k(t,r,7,e.leaders.size,4),k(t,r,8,e.sections.size,4),k(t,r,9,e.value,10)}),bt(t,1,1,Math.max(6,n.length+6),9,4),{name:`Resumo diario`,rows:t,columnWidths:[34,10,12,14,14,12,16,14,16],rowHeights:mt(Math.max(6,n.length+6)),freezeRows:6,autoFilter:`A6:I${Math.max(6,n.length+6)}`,merges:[`A1:C4`,`D1:G1`,`H1:I1`,`D2:G2`,`H2:I2`,`D3:G3`,`H3:I3`,`D4:G4`,`H4:I4`],pageSetup:!0}}function lt(e){let t=[];return pt(t,{logoEnd:3,titleStart:4,titleEnd:9,rightStart:10,rightEnd:12,title:`Detalhamento da Medicao`,leftLines:[`Empresa: ${e.supplierName}`,`Periodo: ${e.periodLabel}`,`Gerado: ${e.generatedAt}`],rightLines:[`AlimentaObra`,`Registros: ${e.detailRows.length}`,``,``]}),[`Data`,`Dia`,`Encarregado`,`Equipe/Trecho`,`Tipo`,`Solicitado`,`Realizado`,`Efetivo`,`Valor unitario`,`Valor total`,`Status`,`Observacoes`].forEach((e,n)=>{k(t,6,n+1,e,5)}),e.detailRows.forEach((e,n)=>{let r=n+7;k(t,r,1,Le(e.date),8),k(t,r,2,e.weekday,8),[e.leader,e.section,e.meal].forEach((e,n)=>k(t,r,n+3,e,4)),[e.requested,e.consumed,e.effective||``].forEach((e,n)=>k(t,r,n+6,e,4)),k(t,r,9,e.unitPrice,10),k(t,r,10,e.value,10),k(t,r,11,e.status,4),k(t,r,12,e.notes,4)}),bt(t,1,1,Math.max(6,e.detailRows.length+6),12,4),{name:`Detalhamento`,rows:t,columnWidths:[34,16,28,28,24,12,12,12,14,14,16,34],rowHeights:mt(Math.max(6,e.detailRows.length+6)),freezeRows:6,autoFilter:`A6:L${Math.max(6,e.detailRows.length+6)}`,merges:[`A1:C4`,`D1:I1`,`J1:L1`,`D2:I2`,`J2:L2`,`D3:I3`,`J3:L3`,`D4:I4`,`J4:L4`],pageSetup:!0}}function ut(e){let t=[],n=e.auditLog??[],r=new Set(n.map(e=>e.userId).filter(Boolean)),i=new Set(n.map(e=>he(e.entity)));pt(t,{logoEnd:2,titleStart:3,titleEnd:5,rightStart:5,rightEnd:5,title:`Auditoria do Sistema`,leftLines:[`Eventos: ${n.length}`,`Usuarios: ${r.size}`,`Areas: ${i.size}`],rightLines:[`AlimentaObra`,`Gerado: ${pe(new Date().toISOString())}`,``,``]}),[`Data/Hora`,`Usuario`,`Acao`,`Area`,`Descricao`].forEach((e,n)=>{k(t,6,n+1,e,5)}),n.forEach((n,r)=>{let i=r+7;k(t,i,1,pe(n.at),4),k(t,i,2,m(e,n.userId),4),k(t,i,3,n.action,4),k(t,i,4,he(n.entity),4),k(t,i,5,je(n),4)});let a=Math.max(6,n.length+6);return bt(t,1,1,a,5,4),{name:`Auditoria`,rows:t,columnWidths:[20,24,34,22,54],rowHeights:mt(a),freezeRows:6,autoFilter:`A6:E${a}`,merges:[`A1:B4`,`C1:D1`,`C2:D2`,`C3:D3`,`C4:D4`],pageSetup:!0}}function dt(e){let t=[];return pt(t,{logoEnd:2,titleStart:3,titleEnd:4,rightStart:5,rightEnd:5,title:`Resumo por Equipe/Trecho`,leftLines:[`Empresa: ${e.supplierName}`,`Periodo: ${e.periodLabel}`,`Gerado: ${e.generatedAt}`],rightLines:[`AlimentaObra`,`Equipes: ${e.sectionSummary.length}`,``,``]}),[`Equipe/Trecho`,`Solicitado`,`Realizado`,`Efetivo`,`Valor total`].forEach((e,n)=>{k(t,6,n+1,e,5)}),e.sectionSummary.forEach((e,n)=>{let r=n+7;k(t,r,1,e.label,4),k(t,r,2,e.requested,4),k(t,r,3,e.consumed,4),k(t,r,4,e.effective,4),k(t,r,5,e.value,10)}),bt(t,1,1,Math.max(6,e.sectionSummary.length+6),5,4),{name:`Resumo equipes`,rows:t,columnWidths:[34,14,14,14,16],rowHeights:mt(Math.max(6,e.sectionSummary.length+6)),freezeRows:6,autoFilter:`A6:E${Math.max(6,e.sectionSummary.length+6)}`,merges:[`A1:B4`,`C1:D1`,`C2:D2`,`C3:D3`,`C4:D4`],pageSetup:!0}}function ft(e){let t=[],n=e.meals.length?e.meals:[{label:`Refeicao`,description:``,quantityTotal:0,valueTotal:0}];return pt(t,{logoEnd:1,titleStart:2,titleEnd:3,rightStart:4,rightEnd:4,title:`Resumo por Tipo`,leftLines:[`Empresa: ${e.supplierName}`,`Periodo: ${e.periodLabel}`,`Gerado: ${e.generatedAt}`],rightLines:[`AlimentaObra`,`Tipos: ${n.length}`,``,``]}),[`Tipo`,`Descricao`,`Realizado`,`Valor total`].forEach((e,n)=>{k(t,6,n+1,e,5)}),n.forEach((e,n)=>{let r=n+7;k(t,r,1,e.label,4),k(t,r,2,e.description||``,4),k(t,r,3,e.quantityTotal,4),k(t,r,4,e.valueTotal,10)}),bt(t,1,1,Math.max(6,n.length+6),4,4),{name:`Resumo tipos`,rows:t,columnWidths:[28,42,14,16],rowHeights:mt(Math.max(6,n.length+6)),freezeRows:6,autoFilter:`A6:D${Math.max(6,n.length+6)}`,merges:[`A1:A4`,`B1:C1`,`B2:C2`,`B3:C3`,`B4:C4`],pageSetup:!0}}function pt(e,t){yt(e,1,1,4,t.logoEnd,1),k(e,1,1,`CONSAG`,1),yt(e,1,t.titleStart,1,t.titleEnd,5),yt(e,2,t.titleStart,4,t.titleEnd,4),k(e,1,t.titleStart,t.title,5),t.leftLines.forEach((n,r)=>k(e,r+2,t.titleStart,n,4)),yt(e,1,t.rightStart,4,t.rightEnd,3),t.rightLines.forEach((n,r)=>k(e,r+1,t.rightStart,n,r===0?3:4))}function mt(e){return Object.fromEntries(Array.from({length:e},(e,t)=>{let n=t+1;return[n,{1:28,2:18,3:18,4:18,5:15,6:18}[n]??16]}))}function ht(e){let t=e.map((e,t)=>({...e,name:T(e.name).slice(0,31)||`Planilha ${t+1}`})),n=t.map((e,t)=>`<Override PartName="/xl/worksheets/sheet${t+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join(``),r=t.map((e,t)=>`<sheet name="${e.name}" sheetId="${t+1}" r:id="rId${t+1}"/>`).join(``),i=t.map((e,t)=>`<Relationship Id="rId${t+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${t+1}.xml"/>`).join(``),a={"[Content_Types].xml":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${n}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,"_rels/.rels":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,"xl/workbook.xml":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${r}</sheets><calcPr calcMode="auto"/></workbook>`,"xl/_rels/workbook.xml.rels":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${i}<Relationship Id="rId${t.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,"xl/styles.xml":xt()};return t.forEach((e,t)=>{a[`xl/worksheets/sheet${t+1}.xml`]=gt(e)}),Tt(a)}function gt(e){let t=e.rows.reduce((e,t)=>Math.max(e,t?.length??0),0),n=Object.keys(e.rowHeights??{}).reduce((e,t)=>Math.max(e,Number(t)),0),r=Math.max(1,e.columnWidths?.length??0,t),i=Math.max(1,e.rows.length,n);return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="${`A1:${A(r)}${i}`}"/>${e.freezeRows?`<sheetViews><sheetView workbookViewId="0"><pane ySplit="${e.freezeRows}" topLeftCell="A${e.freezeRows+1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`:`<sheetViews><sheetView workbookViewId="0"/></sheetViews>`}<sheetFormatPr defaultRowHeight="15"/>${`<cols>${Array.from({length:r},(t,n)=>`<col min="${n+1}" max="${n+1}" width="${e.columnWidths?.[n]??14}" customWidth="1"/>`).join(``)}</cols>`}<sheetData>${Array.from({length:i},(t,n)=>{let i=n+1,a=e.rows[n]??[],o=Array.from({length:r},(e,t)=>_t(a[t],i,t+1)).join(``),s=e.rowHeights?.[i];return`<row r="${i}"${s?` ht="${s}" customHeight="1"`:``}>${o}</row>`}).join(``)}</sheetData>${e.autoFilter?`<autoFilter ref="${e.autoFilter}"/>`:``}${e.merges?.length?`<mergeCells count="${e.merges.length}">${e.merges.map(e=>`<mergeCell ref="${e}"/>`).join(``)}</mergeCells>`:``}${e.pageSetup?`<pageMargins left="0.25" right="0.25" top="0.3" bottom="0.3" header="0.1" footer="0.1"/><pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/>`:``}</worksheet>`}function _t(e,t,n){let r=vt(e);if(!r.formula&&!r.style&&(r.value===``||r.value===null||r.value===void 0))return``;let i=`${A(n)}${t}`,a=r.style?` s="${r.style}"`:``;if(r.formula){let e=r.value===``||r.value===null||r.value===void 0?``:`<v>${T(r.value)}</v>`;return`<c r="${i}"${a}><f>${T(String(r.formula).replace(/^=/,``))}</f>${e}</c>`}return typeof r.value==`number`&&Number.isFinite(r.value)?`<c r="${i}"${a}><v>${r.value}</v></c>`:`<c r="${i}" t="inlineStr"${a}><is><t>${T(r.value)}</t></is></c>`}function vt(e){return e&&typeof e==`object`&&(`value`in e||`style`in e||`formula`in e)?e:{value:e??``,style:0}}function k(e,t,n,r,i=0,a={}){e[t-1]??=[],e[t-1][n-1]={value:r,style:i,...a}}function yt(e,t,n,r,i,a){for(let o=t;o<=r;o+=1)for(let t=n;t<=i;t+=1){let n=vt(e[o-1]?.[t-1]);k(e,o,t,n.value,a,n.formula?{formula:n.formula}:{})}}function bt(e,t,n,r,i,a){for(let o=t;o<=r;o+=1)for(let t=n;t<=i;t+=1)e[o-1]?.[t-1]||k(e,o,t,``,a)}function xt(){return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="&quot;R$&quot; #,##0.00"/></numFmts><fonts count="5"><font><sz val="10"/><name val="Arial"/></font><font><b/><sz val="22"/><color rgb="FF2563EB"/><name val="Arial"/></font><font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/></font><font><b/><sz val="10"/><name val="Arial"/></font><font><b/><sz val="12"/><name val="Arial"/></font></fonts><fills count="7"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF062A5E"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFB8C2CE"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFC3CCD6"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0B4778"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFB9B5B5"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FF09090B"/></left><right style="thin"><color rgb="FF09090B"/></right><top style="thin"><color rgb="FF09090B"/></top><bottom style="thin"><color rgb="FF09090B"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="18"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="3" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center"/></xf><xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center"/></xf><xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf><xf numFmtId="0" fontId="2" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center"/></xf><xf numFmtId="164" fontId="2" fillId="5" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf><xf numFmtId="0" fontId="4" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center"/></xf><xf numFmtId="164" fontId="4" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf><xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="bottom"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`}function St(){return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="3"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Arial"/></font><font><b/><sz val="11"/><color rgb="FF002060"/><name val="Arial"/></font></fonts><fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF002060"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9E2F3"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF7F9FC"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFB4C7E7"/></left><right style="thin"><color rgb="FFB4C7E7"/></right><top style="thin"><color rgb="FFB4C7E7"/></top><bottom style="thin"><color rgb="FFB4C7E7"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="5"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1" applyBorder="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`}function Ct(e,t){return Tt({"[Content_Types].xml":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,"_rels/.rels":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,"xl/workbook.xml":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${T(e).slice(0,31)}" sheetId="1" r:id="rId1"/></sheets></workbook>`,"xl/_rels/workbook.xml.rels":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,"xl/styles.xml":St(),"xl/worksheets/sheet1.xml":wt(t)})}function wt(e){let t=Math.max(1,...e.map(e=>e.length)),n=[16,16,28,30,24,12,12,12,15,15,16,34],r=Array.from({length:t},(e,t)=>`<col min="${t+1}" max="${t+1}" width="${n[t]??14}" customWidth="1"/>`).join(``),i=e.findIndex((t,n)=>n>0&&(e[n-1]?.length??0)===0&&t.length>0);return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>${r}</cols><sheetData>${e.map((e,t)=>{let n=e.every(e=>e===``||e==null),r=t===0||t===i?1:t>0&&t<i?2:!n&&i>=0&&t>i?4:0,a=r?` s="${r}"`:``,o=e.map((e,n)=>{let r=`${A(n+1)}${t+1}`;return typeof e==`number`&&Number.isFinite(e)?`<c r="${r}"${a}><v>${e}</v></c>`:`<c r="${r}" t="inlineStr"${a}><is><t>${T(e)}</t></is></c>`}).join(``);return`<row r="${t+1}">${o}</row>`}).join(``)}</sheetData><autoFilter ref="A1:${A(t)}${Math.max(e.length,1)}"/></worksheet>`}function A(e){let t=``;for(;e>0;){let n=(e-1)%26;t=String.fromCharCode(65+n)+t,e=Math.floor((e-n)/26)}return t}function Tt(e){let t=new TextEncoder,n=[],r=[],i=0;Object.entries(e).forEach(([e,a])=>{let o=t.encode(e),s=t.encode(a),c=jt(s),l=Et(o,s.length,c);n.push(l,s),r.push(Dt(o,s.length,c,i)),i+=l.length+s.length});let a=r.reduce((e,t)=>e+t.length,0),o=Ot(Object.keys(e).length,a,i);return kt([...n,...r,o])}function Et(e,t,n){let r=new Uint8Array(30+e.length),i=new DataView(r.buffer);return i.setUint32(0,67324752,!0),i.setUint16(4,20,!0),i.setUint16(6,2048,!0),i.setUint16(8,0,!0),i.setUint32(14,n,!0),i.setUint32(18,t,!0),i.setUint32(22,t,!0),i.setUint16(26,e.length,!0),r.set(e,30),r}function Dt(e,t,n,r){let i=new Uint8Array(46+e.length),a=new DataView(i.buffer);return a.setUint32(0,33639248,!0),a.setUint16(4,20,!0),a.setUint16(6,20,!0),a.setUint16(8,2048,!0),a.setUint16(10,0,!0),a.setUint32(16,n,!0),a.setUint32(20,t,!0),a.setUint32(24,t,!0),a.setUint16(28,e.length,!0),a.setUint32(42,r,!0),i.set(e,46),i}function Ot(e,t,n){let r=new Uint8Array(22),i=new DataView(r.buffer);return i.setUint32(0,101010256,!0),i.setUint16(8,e,!0),i.setUint16(10,e,!0),i.setUint32(12,t,!0),i.setUint32(16,n,!0),r}function kt(e){let t=e.reduce((e,t)=>e+t.length,0),n=new Uint8Array(t),r=0;return e.forEach(e=>{n.set(e,r),r+=e.length}),n}var At=Array.from({length:256},(e,t)=>{let n=t;for(let e=0;e<8;e+=1)n=n&1?3988292384^n>>>1:n>>>1;return n>>>0});function jt(e){let t=4294967295;return e.forEach(e=>{t=At[(t^e)&255]^t>>>8}),(t^4294967295)>>>0}var Mt={home:`<path d="M4 10.8 12 4l8 6.8"/><path d="M6.4 9.7v9.1h11.2V9.7"/><path d="M10 18.8v-5h4v5"/>`,clipboard:`<rect x="6" y="4.8" width="12" height="15.2" rx="2.4"/><path d="M9.3 6.2h5.4"/><path d="M9.2 11h5.6M9.2 14.3h5.6M9.2 17.5h3.2"/>`,dashboard:`<path d="M4.5 11.6a7.5 7.5 0 1 1 15 0"/><path d="M6.8 17.8h10.4"/><path d="m12 12.1 3.2-3.2"/><path d="M7.7 11.6h.1M16.2 11.6h.1M9.2 8.5h.1M14.8 8.5h.1"/>`,package:`<path d="m4.8 7.4 7.2-3.6 7.2 3.6-7.2 3.7-7.2-3.7Z"/><path d="M5 7.6v8.6l7 4 7-4V7.6"/><path d="M12 11.2v8.8"/><path d="m8.2 5.7 7.3 3.7"/>`,chart:`<path d="M4 19.5h16"/><rect x="5.5" y="11" width="2.8" height="6" rx=".9"/><rect x="10.6" y="6" width="2.8" height="11" rx=".9"/><rect x="15.7" y="9" width="2.8" height="8" rx=".9"/>`,history:`<path d="M5.2 8.3A7.8 7.8 0 1 1 4.4 14"/><path d="M4.4 5.2v4.1h4.1"/><path d="M12 8.2v4.2l2.8 1.7"/>`,filter:`<path d="M4.5 6.5h15"/><path d="M7.5 12h9"/><path d="M10.2 17.5h3.6"/><circle cx="8" cy="6.5" r="1.4"/><circle cx="15.8" cy="12" r="1.4"/>`,truck:`<path d="M3.8 7h9.9v8.1H3.8z"/><path d="M13.7 10h3.8l2.7 3.3v1.8h-6.5z"/><path d="M6.8 17.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM17.5 17.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z"/>`,plus:`<path d="M12 5.5v13M5.5 12h13"/>`,arrow:`<path d="M5 12h13.5"/><path d="m13.8 6.8 5.2 5.2-5.2 5.2"/>`,"arrow-left":`<path d="M19 12H5.5"/><path d="M10.2 6.8 5 12l5.2 5.2"/>`,check:`<path d="m4.8 12.6 4.4 4.4 10-10"/>`,"dollar-sign":`<path d="M12 3.8v16.4"/><path d="M16.5 7.2c-.9-.8-2.2-1.3-3.8-1.3-2.2 0-3.7 1.1-3.7 2.8 0 3.8 7.5 2 7.5 5.8 0 1.7-1.5 2.9-3.9 2.9-1.9 0-3.5-.6-4.7-1.7"/>`,inbox:`<path d="M4.8 5.4h14.4l1.4 8.2v4a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2v-4Z"/><path d="M4.1 13.6h4.3l1.2 2.1h4.8l1.2-2.1h4.3"/>`,box:`<path d="m4.8 7.4 7.2-3.6 7.2 3.6-7.2 3.7-7.2-3.7Z"/><path d="M5 7.6v8.6l7 4 7-4V7.6"/><path d="M12 11.2v8.8"/>`,moon:`<path d="M18.4 15.5A7.4 7.4 0 0 1 8.5 5.6 8.2 8.2 0 1 0 18.4 15.5Z"/>`,clock:`<circle cx="12" cy="12" r="8.2"/><path d="M12 7.8v4.6l3 1.7"/>`,utensils:`<path d="M7 4v7.2M4.8 4v4.8c0 1.8 1 2.9 2.2 2.9s2.2-1.1 2.2-2.9V4M7 11.7V20"/><path d="M15.5 4v16"/><path d="M15.5 4c2.5.8 4 3.2 4 6.2h-4"/>`,map:`<path d="m4 6.2 5.3-2.1 5.4 2.1L20 4.1v13.7l-5.3 2.1-5.4-2.1L4 19.9V6.2Z"/><path d="M9.3 4.1v13.7M14.7 6.2v13.7"/>`,users:`<circle cx="9.2" cy="8.2" r="2.8"/><path d="M3.8 19.5c.5-3.5 2.5-5.6 5.4-5.6s4.9 2.1 5.4 5.6"/><path d="M15.4 6.1a2.6 2.6 0 0 1 0 5.1M16.4 14.1c2 .7 3.3 2.6 3.7 5.4"/>`,logout:`<path d="M10.2 5H5.4v14h4.8"/><path d="M14.8 8.2 18.6 12l-3.8 3.8"/><path d="M8.8 12h9.4"/>`,settings:`<circle cx="12" cy="12" r="3.1"/><path d="M18.6 13.3c.1-.4.1-.8.1-1.3s0-.9-.1-1.3l2-1.5-2-3.4-2.4 1a7 7 0 0 0-2.2-1.3L13.7 3h-3.4L10 5.5a7 7 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.5c-.1.4-.1.8-.1 1.3s0 .9.1 1.3l-2 1.5 2 3.4 2.4-1c.7.6 1.4 1 2.2 1.3l.3 2.5h3.4l.3-2.5c.8-.3 1.5-.7 2.2-1.3l2.4 1 2-3.4-2-1.5Z"/>`,eye:`<path d="M3.2 12s3.1-5.2 8.8-5.2 8.8 5.2 8.8 5.2-3.1 5.2-8.8 5.2S3.2 12 3.2 12Z"/><circle cx="12" cy="12" r="2.7"/>`,edit:`<path d="m4.5 19.5 4.2-1 9.5-9.5-3.2-3.2-9.5 9.5-1 4.2Z"/><path d="m13.8 7 3.2 3.2"/>`,trash:`<path d="M5 7.2h14M9.2 7.2V4.8h5.6v2.4M7.2 7.2l.8 12h8l.8-12M10.3 11v5M13.7 11v5"/>`};function j(e,t=18){return`<svg class="icon" width="${t}" height="${t}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${Mt[e]??Mt.clipboard}</svg>`}var Nt=`/alimenta-obra/assets/logo-alimentaobra.png`;function Pt({accessSwitcher:e=``,activeView:t,content:n,editRequestModal:r=``,adminRequestDetailModal:i=``,operationModal:a=``,renderNav:o,roleName:s,initials:c,user:l,workspaceIntro:u=``}){let d=l.role===`admin`?`painel`:l.role===`fornecedor`?`fornecedor`:`inicio`;return`
    <div class="md:hidden fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#1c1d1b]/95 px-3 text-white shadow-[0_14px_30px_rgba(25,27,24,.22)] backdrop-blur role-${l.role}">
      <div class="flex items-center gap-2">
        <button class="inline-flex items-center border-0 bg-transparent p-0" type="button" data-view="${d}" aria-label="Ir para a home">
          <img class="h-12 w-auto max-w-[210px] object-contain" src="${Nt}" alt="AlimentaObra" />
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button class="grid h-9 w-9 place-items-center rounded-r-xl rounded-l-md border border-white/10 bg-white/10 text-white transition hover:border-orange-400/40 hover:bg-orange-500/15" data-view="configuracoes" aria-label="Abrir configurações">
          ${j(`settings`,17)}
        </button>
        <button class="grid h-9 w-9 place-items-center rounded-r-xl rounded-l-md border border-white/10 bg-white/10 text-white transition hover:border-red-300/40 hover:bg-red-500/15" data-action="logout" aria-label="Sair do sistema">
          ${j(`logout`,17)}
        </button>
      </div>
    </div>
    <div class="min-h-screen bg-[#f2f1ec] text-stone-950 app-shell role-${l.role}">
      <aside class="fixed inset-x-2 bottom-2 z-30 flex h-[74px] flex-col rounded-[22px] border border-white/10 bg-[#1c1d1b]/95 px-1.5 py-2 text-white shadow-[0_18px_46px_rgba(25,27,24,.32)] backdrop-blur md:fixed md:inset-y-0 md:left-0 md:right-auto md:top-0 md:h-dvh md:w-[246px] md:rounded-none md:border-0 md:border-r md:border-white/10 md:px-3 md:py-4 sidebar">
        <div class="hidden items-center border-b border-white/10 px-1 pb-5 md:flex">
          <button class="inline-flex w-full items-center border-0 bg-transparent p-0" type="button" data-view="${d}" aria-label="Ir para a home">
            <img class="h-auto w-full max-w-[230px] object-contain" src="${Nt}" alt="AlimentaObra" />
          </button>
        </div>
        <div class="hidden grid-cols-[38px_minmax(0,1fr)] gap-2 rounded-[16px] border border-white/10 bg-white/[.06] px-2 py-3 md:grid">
          <div class="grid h-9 w-9 place-items-center rounded-r-xl rounded-l-md bg-stone-100 text-xs font-black text-stone-900">${c(l.name)}</div>
          <div class="min-w-0">
            <div class="truncate text-sm font-extrabold">${l.name}</div>
            <div class="flex flex-wrap gap-x-2 text-[11px] font-bold text-white/50">
              <span>${s(l.role)}</span>
              ${l.role!==`admin`&&l.team?`<span>${l.team}</span>`:``}
            </div>
          </div>
        </div>
        <nav class="flex flex-1 gap-1 overflow-hidden pb-0.5 md:mt-4 md:grid md:grid-cols-1 md:content-start md:gap-1.5 md:overflow-visible md:pb-0 nav">${o(l)}</nav>
        <div class="hidden gap-2 border-t border-white/10 px-1 pt-4 md:grid">
          <button class="inline-flex min-h-10 items-center gap-2 rounded-r-xl rounded-l-md border border-white/10 bg-white/[.04] px-3 text-sm font-bold text-white/70 transition hover:border-orange-400/35 hover:bg-orange-500/15 hover:text-white sidebar-settings ${t===`configuracoes`?`active !border-orange-500/40 !bg-orange-500/15 !text-white`:``}" data-view="configuracoes">${j(`settings`,16)}<span>Configurações</span></button>
          <button class="inline-flex min-h-10 items-center gap-2 rounded-r-xl rounded-l-md border border-red-300/15 bg-red-500/[.06] px-3 text-sm font-bold text-red-100/80 transition hover:border-red-300/35 hover:bg-red-500/15 hover:text-white sidebar-logout" data-action="logout">${j(`logout`,16)}<span>Sair do sistema</span></button>
        </div>
      </aside>
      <main class="min-w-0 px-3 pb-[98px] pt-[68px] md:ml-[246px] md:px-6 md:pb-10 md:pt-6 lg:px-10 main role-${l.role} view-${t}">
        ${e}
        ${u}
        ${n}
      </main>
    </div>
    ${r}
    ${i}
    ${a}
  `}function M(e){if(!e)return`-`;let[t,n,r]=e.split(`-`);return`${r}/${n}/${t}`}function Ft(e){return e?new Intl.DateTimeFormat(`pt-BR`,{dateStyle:`short`,timeStyle:`short`}).format(new Date(e)):`-`}function It(e){return new Intl.NumberFormat(`pt-BR`,{style:`currency`,currency:`BRL`}).format(e)}function Lt(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}var Rt=`/alimenta-obra/assets/icone-alimentaobra.png`,zt=`/alimenta-obra/assets/logo-alimentaobra.png`;function Bt({initialInviteToken:e,isSupabaseConfigured:t,loginMode:n,loginError:r=``}){return`
    <section class="grid min-h-screen bg-[#1b1c1a] p-4 md:p-8">
      <div class="m-auto grid min-h-[min(720px,calc(100vh-48px))] w-full max-w-6xl overflow-hidden rounded-[18px] border border-white/10 bg-[#262825] shadow-2xl lg:grid-cols-[minmax(0,1fr)_minmax(380px,.72fr)]">
        <div class="relative hidden flex-col justify-between overflow-hidden bg-[#171916] p-10 text-white lg:flex lg:p-16">
          <div class="flex items-center">
            <img class="h-28 w-auto max-w-[460px] object-contain" src="${zt}" alt="AlimentaObra" />
          </div>
          <div>
            <span class="text-[11px] font-black uppercase tracking-[.12em] text-orange-200">Gestão de alimentação</span>
            <h1 class="mt-3 max-w-2xl text-[56px] font-black leading-[.94] tracking-normal">Organize os pedidos da obra com clareza.</h1>
            <p class="mt-4 max-w-lg text-base leading-7 text-white/65">Uma área segura para registrar, acompanhar e manter a rotina de refeições organizada.</p>
          </div>
        </div>
        <div class="flex flex-col justify-center bg-[#fffefa] p-6 md:p-10">
          <div class="mb-7 grid grid-cols-2 gap-1 rounded-xl border border-stone-200 bg-stone-100 p-1">
            <button class="min-h-10 rounded-lg text-sm font-black ${n===`login`?`bg-white text-stone-950 shadow-sm`:`text-stone-500`}" data-login-mode="login">Login</button>
            <button class="min-h-10 rounded-lg text-sm font-black ${n===`cadastro`?`bg-white text-stone-950 shadow-sm`:`text-stone-500`}" data-login-mode="cadastro">Cadastro</button>
          </div>
          ${n===`login`?Vt({isSupabaseConfigured:t,loginError:r}):Ht({initialInviteToken:e,isSupabaseConfigured:t})}
        </div>
      </div>
    </section>
  `}function Vt({isSupabaseConfigured:e,loginError:t=``}){return`
    <div class="mb-6 flex items-start gap-3">
      <img class="h-10 w-10 rounded-xl object-cover shadow-sm" src="${Rt}" alt="AlimentaObra" />
      <div>
        <div class="text-3xl font-black tracking-normal">Entrar</div>
        <p class="mt-1 text-sm text-stone-500">Entre com seu e-mail e senha.</p>
      </div>
    </div>
    ${e?``:`<div class="mb-4 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-4 text-center text-sm font-bold text-stone-500">Configure o arquivo .env.local antes de entrar.</div>`}
    ${t?`<div class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700" role="alert">${Lt(t)}</div>`:``}
    <form class="grid gap-4" data-form="login">
      <div class="grid gap-1.5">
        <label class="text-[10px] font-black uppercase tracking-[.08em] text-stone-500" for="login-email">E-mail</label>
        <input class="min-h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-100" id="login-email" name="email" type="email" autocomplete="email" required />
      </div>
      <div class="grid gap-1.5">
        <label class="text-[10px] font-black uppercase tracking-[.08em] text-stone-500" for="login-pass">Senha</label>
        <div class="relative">
          <input class="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 pr-11 text-sm outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-100" id="login-pass" name="password" type="password" autocomplete="current-password" minlength="8" required />
          <button type="button" class="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-stone-500 hover:bg-orange-50 hover:text-orange-700" data-toggle-password="login-pass" aria-label="Mostrar senha">${j(`eye`,16)}</button>
        </div>
      </div>
      <button class="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-orange-600 px-4 text-sm font-black text-white shadow-[0_10px_22px_rgba(239,91,29,.2)] disabled:opacity-50" type="submit" ${e?``:`disabled`}>Entrar no sistema</button>
    </form>`}function Ht({initialInviteToken:e,isSupabaseConfigured:t}){return`
    <div class="mb-6 flex items-start gap-3">
      <div class="grid h-10 w-10 place-items-center rounded-xl bg-orange-600 text-lg font-black text-white">+</div>
      <div>
        <div class="text-3xl font-black tracking-normal">Criar acesso</div>
        <p class="mt-1 text-sm text-stone-500">${e?`Convite privado detectado.`:`Novos cadastros entram como encarregado.`}</p>
      </div>
    </div>
    ${e?`<div class="mb-4 inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-bold text-orange-700">${j(`settings`,15)}Ao concluir, seu perfil sera liberado conforme o convite.</div>`:``}
    <form class="grid gap-4" data-form="register">
      <input type="hidden" name="inviteToken" value="${Lt(e)}" />
      <div class="grid gap-1.5">
        <label class="text-[10px] font-black uppercase tracking-[.08em] text-stone-500" for="register-name">Nome completo</label>
        <input class="min-h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-100" id="register-name" name="name" placeholder="Ex.: Carlos Almeida" required />
      </div>
      <div class="grid gap-1.5">
        <label class="text-[10px] font-black uppercase tracking-[.08em] text-stone-500" for="register-email">E-mail</label>
        <input class="min-h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-100" id="register-email" name="email" type="email" placeholder="nome@obra.com" required />
      </div>
      <div class="grid gap-1.5">
        <label class="text-[10px] font-black uppercase tracking-[.08em] text-stone-500" for="register-team">Equipe / frente</label>
        <input class="min-h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-100" id="register-team" name="team" placeholder="Frente Sul" required />
      </div>
      <div class="grid gap-1.5">
        <label class="text-[10px] font-black uppercase tracking-[.08em] text-stone-500" for="register-pass">Senha</label>
        <div class="relative">
          <input class="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 pr-11 text-sm outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-100" id="register-pass" name="password" type="password" minlength="8" autocomplete="new-password" required />
          <button type="button" class="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-stone-500 hover:bg-orange-50 hover:text-orange-700" data-toggle-password="register-pass" aria-label="Mostrar senha">${j(`eye`,16)}</button>
        </div>
      </div>
      <button class="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-orange-600 px-4 text-sm font-black text-white shadow-[0_10px_22px_rgba(239,91,29,.2)] disabled:opacity-50" type="submit" ${t?``:`disabled`}>Criar conta</button>
    </form>`}function Ut({getActiveView:e,getExportMenuOpen:t,viewLabel:n}){function r(t,r,i=``){return`
      <div class="topbar app-page-header">
        <div>
          <span class="eyebrow">${n(e())}</span>
          <h1 class="page-title">${t}</h1>
          <div class="page-subtitle">${r}</div>
        </div>
        <div class="actions">${i}</div>
      </div>`}function i(e,t,n,r=``){return`
      <header class="compact-header app-page-header">
        <div>
          <span class="compact-kicker">${e}</span>
          <h1>${t}</h1>
          <p>${n}</p>
        </div>
        ${r?`<div class="compact-actions">${r}</div>`:``}
      </header>`}function a(e,t,n=``){return`
      <div class="leader-empty">
        <span class="leader-empty-icon">${j(`clipboard`,22)}</span>
        <strong>${e}</strong>
        <p>${t}</p>
        ${n}
      </div>`}function o(e,n,r=`Exportar`){let i=t();return`
      <div class="export-menu ${i===e?`open`:``}">
        <button class="btn outline small" type="button" data-export-toggle="${e}">${j(`clipboard`,14)}${r}</button>
        ${i===e?`<div class="export-options">${n.map(([e,t,n])=>`<button type="button" data-export="${e}">${j(n,14)}${t}</button>`).join(``)}</div>`:``}
      </div>`}return{renderCompactHeader:i,renderEmptyState:a,renderExportMenu:o,topbar:r}}function Wt({getState:e,getConsolidationSummary:t}){function n(){return Number(e().settings.defaultMealUnitPrice??0)}function r(e){return Number(e.quantity)*n(e)}function i(t){let n=e();return n.mealCatalog.find(e=>e.id===t)??n.mealTypes.find(e=>e.id===t)??null}function a(e){return i(e.mealTypeId)?.description??e.mealDescription??``}function o(n){return t(e(),n).rows.reduce((e,t)=>e+r(t),0)}function s(){let t=e().syncQueue.filter(e=>!e.synced).length;return t?`${t} a sincronizar`:`sincronizado`}return{consolidationValue:o,mealById:i,pendingSyncText:s,requestMealDescription:a,requestUnitPrice:n,requestValue:r}}function Gt(e){return e.reduce((e,t)=>(e[t.mealType]??=0,e[t.mealType]+=Number(t.quantity),e),{})}function Kt(e){return e.reduce((e,t)=>e+Number(t.quantity),0)}function qt(e,t){return e.filter(e=>e.status===t).length}function Jt(e){return e===`enviado`?{step:`confirmado`,label:`Confirmar recebimento`}:e===`confirmado`?{step:`saiu_entrega`,label:`Registrar saida`}:e===`producao`?{step:`saiu_entrega`,label:`Confirmar saida`}:null}function Yt(e){return{admin:`Administrador`,encarregado:`Encarregado`,fornecedor:`Fornecedor`}[e]??e}function Xt(e){return String(e).split(` `).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase()}var Zt=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.iterator;function m(e){return typeof e!=`object`||!e?null:(e=p&&e[p]||e[`@@iterator`],typeof e==`function`?e:null)}var h={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,_={};function v(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}v.prototype.isReactComponent={},v.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function y(){}y.prototype=v.prototype;function b(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}var x=b.prototype=new y;x.constructor=b,g(x,v.prototype),x.isPureReactComponent=!0;var S=Array.isArray;function ee(){}var C={H:null,A:null,T:null,S:null},w=Object.prototype.hasOwnProperty;function te(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function ne(e,t){return te(e.type,t,e.props)}function re(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function ie(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var ae=/\/+/g;function oe(e,t){return typeof e==`object`&&e&&e.key!=null?ie(``+e.key):t.toString(36)}function se(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(ee,ee):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function T(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,T(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+oe(e,0):a,S(o)?(i=``,c!=null&&(i=c.replace(ae,`$&/`)+`/`),T(o,r,i,``,function(e){return e})):o!=null&&(re(o)&&(o=ne(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(ae,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(S(e))for(var u=0;u<e.length;u++)a=e[u],s=l+oe(a,u),c+=T(a,r,i,s,o);else if(u=m(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+oe(a,u++),c+=T(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return T(se(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function E(e,t,n){if(e==null)return e;var r=[],i=0;return T(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function ce(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var le=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},ue={map:E,forEach:function(e,t,n){E(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return E(e,function(){t++}),t},toArray:function(e){return E(e,function(e){return e})||[]},only:function(e){if(!re(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=ue,e.Component=v,e.Fragment=r,e.Profiler=a,e.PureComponent=b,e.StrictMode=i,e.Suspense=l,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=C,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return C.H.useMemoCache(e)}},e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=g({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!w.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return te(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)w.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return te(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=re,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:ce}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=C.T,n={};C.T=n;try{var r=e(),i=C.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(ee,le)}catch(e){le(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),C.T=t}},e.unstable_useCacheRefresh=function(){return C.H.useCacheRefresh()},e.use=function(e){return C.H.use(e)},e.useActionState=function(e,t,n){return C.H.useActionState(e,t,n)},e.useCallback=function(e,t){return C.H.useCallback(e,t)},e.useContext=function(e){return C.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return C.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return C.H.useEffect(e,t)},e.useEffectEvent=function(e){return C.H.useEffectEvent(e)},e.useId=function(){return C.H.useId()},e.useImperativeHandle=function(e,t,n){return C.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return C.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return C.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return C.H.useMemo(e,t)},e.useOptimistic=function(e,t){return C.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return C.H.useReducer(e,t,n)},e.useRef=function(e){return C.H.useRef(e)},e.useState=function(e){return C.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return C.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return C.H.useTransition()},e.version=`19.2.7`})),Qt=o(((e,t)=>{t.exports=Zt()})),$t=o((e=>{var t=Qt();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var i={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},a=Symbol.for(`react.portal`);function o(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:a,key:r==null?null:``+r,children:e,containerInfo:t,implementation:n}}var s=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function c(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return o(e,t,null,r)},e.flushSync=function(e){var t=s.T,n=i.p;try{if(s.T=null,i.p=2,e)return e()}finally{s.T=t,i.p=n,i.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,i.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&i.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin),a=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?i.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:a,fetchPriority:o}):n===`script`&&i.d.X(e,{crossOrigin:r,integrity:a,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`)if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=c(t.as,t.crossOrigin);i.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0})}}else t??i.d.M(e)},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin);i.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`)if(t){var n=c(t.as,t.crossOrigin);i.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0})}else i.d.m(e)},e.requestFormReset=function(e){i.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return s.H.useFormState(e,t,n)},e.useFormStatus=function(){return s.H.useHostTransitionStatus()},e.version=`19.2.7`})),en=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=$t()})),tn=o((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m)if(n(c)!==null)m=!0,S||(S=!0,re());else{var t=n(l);t!==null&&oe(x,t.startTime-e)}}var S=!1,ee=-1,C=5,w=-1;function te(){return g?!0:!(e.unstable_now()-w<C)}function ne(){if(g=!1,S){var t=e.unstable_now();w=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(ee),ee=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&te());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&oe(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?re():S=!1}}}var re;if(typeof y==`function`)re=function(){y(ne)};else if(typeof MessageChannel<`u`){var ie=new MessageChannel,ae=ie.port2;ie.port1.onmessage=ne,re=function(){ae.postMessage(null)}}else re=function(){_(ne,0)};function oe(t,n){ee=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):C=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(ee),ee=-1):h=!0,oe(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,S||(S=!0,re()))),r},e.unstable_shouldYield=te,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),nn=o(((e,t)=>{t.exports=tn()})),rn=o((e=>{var t=nn(),n=Qt(),r=en();function i(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function a(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function o(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function s(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function c(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function l(e){if(o(e)!==e)throw Error(i(188))}function u(e){var t=e.alternate;if(!t){if(t=o(e),t===null)throw Error(i(188));return t===e?e:null}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var s=a.alternate;if(s===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===s.child){for(s=a.child;s;){if(s===n)return l(a),e;if(s===r)return l(a),t;s=s.sibling}throw Error(i(188))}if(n.return!==r.return)n=a,r=s;else{for(var c=!1,u=a.child;u;){if(u===n){c=!0,n=a,r=s;break}if(u===r){c=!0,r=a,n=s;break}u=u.sibling}if(!c){for(u=s.child;u;){if(u===n){c=!0,n=s,r=a;break}if(u===r){c=!0,r=s,n=a;break}u=u.sibling}if(!c)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function d(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=d(e),t!==null)return t;e=e.sibling}return null}var f=Object.assign,p=Symbol.for(`react.element`),m=Symbol.for(`react.transitional.element`),h=Symbol.for(`react.portal`),g=Symbol.for(`react.fragment`),_=Symbol.for(`react.strict_mode`),v=Symbol.for(`react.profiler`),y=Symbol.for(`react.consumer`),b=Symbol.for(`react.context`),x=Symbol.for(`react.forward_ref`),S=Symbol.for(`react.suspense`),ee=Symbol.for(`react.suspense_list`),C=Symbol.for(`react.memo`),w=Symbol.for(`react.lazy`),te=Symbol.for(`react.activity`),ne=Symbol.for(`react.memo_cache_sentinel`),re=Symbol.iterator;function ie(e){return typeof e!=`object`||!e?null:(e=re&&e[re]||e[`@@iterator`],typeof e==`function`?e:null)}var ae=Symbol.for(`react.client.reference`);function oe(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===ae?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case g:return`Fragment`;case v:return`Profiler`;case _:return`StrictMode`;case S:return`Suspense`;case ee:return`SuspenseList`;case te:return`Activity`}if(typeof e==`object`)switch(e.$$typeof){case h:return`Portal`;case b:return e.displayName||`Context`;case y:return(e._context.displayName||`Context`)+`.Consumer`;case x:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case C:return t=e.displayName||null,t===null?oe(e.type)||`Memo`:t;case w:t=e._payload,e=e._init;try{return oe(e(t))}catch{}}return null}var se=Array.isArray,T=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,E=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ce={pending:!1,data:null,method:null,action:null},le=[],ue=-1;function de(e){return{current:e}}function fe(e){0>ue||(e.current=le[ue],le[ue]=null,ue--)}function D(e,t){ue++,le[ue]=e.current,e.current=t}var pe=de(null),me=de(null),O=de(null),he=de(null);function ge(e,t){switch(D(O,t),D(me,e),D(pe,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Vd(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Vd(t),e=Hd(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}fe(pe),D(pe,e)}function _e(){fe(pe),fe(me),fe(O)}function ve(e){e.memoizedState!==null&&D(he,e);var t=pe.current,n=Hd(t,e.type);t!==n&&(D(me,e),D(pe,n))}function ye(e){me.current===e&&(fe(pe),fe(me)),he.current===e&&(fe(he),Qf._currentValue=ce)}var be,xe;function Se(e){if(be===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);be=t&&t[1]||``,xe=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+be+e+xe}var Ce=!1;function we(e,t){if(!e||Ce)return``;Ce=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}e.call(n.prototype)}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{Ce=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?Se(n):``}function Te(e,t){switch(e.tag){case 26:case 27:case 5:return Se(e.type);case 16:return Se(`Lazy`);case 13:return e.child!==t&&t!==null?Se(`Suspense Fallback`):Se(`Suspense`);case 19:return Se(`SuspenseList`);case 0:case 15:return we(e.type,!1);case 11:return we(e.type.render,!1);case 1:return we(e.type,!0);case 31:return Se(`Activity`);default:return``}}function Ee(e){try{var t=``,n=null;do t+=Te(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var De=Object.prototype.hasOwnProperty,Oe=t.unstable_scheduleCallback,ke=t.unstable_cancelCallback,Ae=t.unstable_shouldYield,je=t.unstable_requestPaint,Me=t.unstable_now,Ne=t.unstable_getCurrentPriorityLevel,Pe=t.unstable_ImmediatePriority,Fe=t.unstable_UserBlockingPriority,Ie=t.unstable_NormalPriority,Le=t.unstable_LowPriority,Re=t.unstable_IdlePriority,ze=t.log,Be=t.unstable_setDisableYieldValue,Ve=null,He=null;function Ue(e){if(typeof ze==`function`&&Be(e),He&&typeof He.setStrictMode==`function`)try{He.setStrictMode(Ve,e)}catch{}}var We=Math.clz32?Math.clz32:qe,Ge=Math.log,Ke=Math.LN2;function qe(e){return e>>>=0,e===0?32:31-(Ge(e)/Ke|0)|0}var Je=256,Ye=262144,Xe=4194304;function Ze(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Qe(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=Ze(n))):i=Ze(o):i=Ze(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=Ze(n))):i=Ze(o)):i=Ze(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function $e(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function et(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function tt(){var e=Xe;return Xe<<=1,!(Xe&62914560)&&(Xe=4194304),e}function nt(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function rt(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function it(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-We(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&at(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function at(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-We(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function ot(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-We(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function st(e,t){var n=t&-t;return n=n&42?1:ct(n),(n&(e.suspendedLanes|t))===0?n:0}function ct(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function lt(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function ut(){var e=E.p;return e===0?(e=window.event,e===void 0?32:mp(e.type)):e}function dt(e,t){var n=E.p;try{return E.p=e,t()}finally{E.p=n}}var ft=Math.random().toString(36).slice(2),pt=`__reactFiber$`+ft,mt=`__reactProps$`+ft,ht=`__reactContainer$`+ft,gt=`__reactEvents$`+ft,_t=`__reactListeners$`+ft,vt=`__reactHandles$`+ft,k=`__reactResources$`+ft,yt=`__reactMarker$`+ft;function bt(e){delete e[pt],delete e[mt],delete e[gt],delete e[_t],delete e[vt]}function xt(e){var t=e[pt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[ht]||n[pt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=df(e);e!==null;){if(n=e[pt])return n;e=df(e)}return t}e=n,n=e.parentNode}return null}function St(e){if(e=e[pt]||e[ht]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Ct(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(i(33))}function wt(e){var t=e[k];return t||=e[k]={hoistableStyles:new Map,hoistableScripts:new Map},t}function A(e){e[yt]=!0}var Tt=new Set,Et={};function Dt(e,t){Ot(e,t),Ot(e+`Capture`,t)}function Ot(e,t){for(Et[e]=t,e=0;e<t.length;e++)Tt.add(t[e])}var kt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),At={},jt={};function Mt(e){return De.call(jt,e)?!0:De.call(At,e)?!1:kt.test(e)?jt[e]=!0:(At[e]=!0,!1)}function j(e,t,n){if(Mt(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,``+n)}}function Nt(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,``+n)}}function Pt(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,``+r)}}function M(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function Ft(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function It(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Lt(e){if(!e._valueTracker){var t=Ft(e)?`checked`:`value`;e._valueTracker=It(e,t,``+e[t])}}function Rt(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=Ft(e)?e.checked?`true`:`false`:e.value),e=r,e===n?!1:(t.setValue(e),!0)}function zt(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}var Bt=/[\n"\\]/g;function Vt(e){return e.replace(Bt,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function Ht(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+M(t)):e.value!==``+M(t)&&(e.value=``+M(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):Wt(e,o,M(n)):Wt(e,o,M(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+M(s):e.removeAttribute(`name`)}function Ut(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){Lt(e);return}n=n==null?``:``+M(n),t=t==null?n:``+M(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),Lt(e)}function Wt(e,t,n){t===`number`&&zt(e.ownerDocument)===e||e.defaultValue===``+n||(e.defaultValue=``+n)}function Gt(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+M(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function Kt(e,t,n){if(t!=null&&(t=``+M(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n==null?``:``+M(n)}function qt(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(i(92));if(se(r)){if(1<r.length)throw Error(i(93));r=r[0]}n=r}n??=``,t=n}n=M(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),Lt(e)}function Jt(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Yt=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function Xt(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||Yt.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function Zt(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(i(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``);for(var a in t)r=t[a],t.hasOwnProperty(a)&&n[a]!==r&&Xt(e,a,r)}else for(var o in t)t.hasOwnProperty(o)&&Xt(e,o,t[o])}function $t(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var tn=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),rn=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function an(e){return rn.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function on(){}var sn=null;function cn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var ln=null,un=null;function N(e){var t=St(e);if(t&&(e=t.stateNode)){var n=e[mt]||null;a:switch(e=t.stateNode,t.type){case`input`:if(Ht(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+Vt(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=r[mt]||null;if(!a)throw Error(i(90));Ht(r,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&Rt(r)}break a;case`textarea`:Kt(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&Gt(e,!!n.multiple,t,!1)}}}var dn=!1;function fn(e,t,n){if(dn)return e(t,n);dn=!0;try{return e(t)}finally{if(dn=!1,(ln!==null||un!==null)&&(wu(),ln&&(t=ln,e=un,un=ln=null,N(t),e)))for(t=0;t<e.length;t++)N(e[t])}}function pn(e,t){var n=e.stateNode;if(n===null)return null;var r=n[mt]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=!(e===`button`||e===`input`||e===`select`||e===`textarea`)),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(i(231,t,typeof n));return n}var mn=!(typeof window>`u`||window.document===void 0||window.document.createElement===void 0),hn=!1;if(mn)try{var gn={};Object.defineProperty(gn,"passive",{get:function(){hn=!0}}),window.addEventListener(`test`,gn,gn),window.removeEventListener(`test`,gn,gn)}catch{hn=!1}var P=null,_n=null,vn=null;function yn(){if(vn)return vn;var e,t=_n,n=t.length,r,i=`value`in P?P.value:P.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return vn=i.slice(e,1<r?1-r:void 0)}function bn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function xn(){return!0}function Sn(){return!1}function Cn(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?xn:Sn,this.isPropagationStopped=Sn,this}return f(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=xn)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=xn)},persist:function(){},isPersistent:xn}),t}var wn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Tn=Cn(wn),En=f({},wn,{view:0,detail:0}),Dn=Cn(En),On,kn,An,jn=f({},En,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Hn,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==An&&(An&&e.type===`mousemove`?(On=e.screenX-An.screenX,kn=e.screenY-An.screenY):kn=On=0,An=e),On)},movementY:function(e){return`movementY`in e?e.movementY:kn}}),Mn=Cn(jn),Nn=Cn(f({},jn,{dataTransfer:0})),Pn=Cn(f({},En,{relatedTarget:0})),Fn=Cn(f({},wn,{animationName:0,elapsedTime:0,pseudoElement:0})),In=Cn(f({},wn,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Ln=Cn(f({},wn,{data:0})),Rn={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},zn={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},Bn={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function Vn(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Bn[e])?!!t[e]:!1}function Hn(){return Vn}var Un=Cn(f({},En,{key:function(e){if(e.key){var t=Rn[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=bn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?zn[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Hn,charCode:function(e){return e.type===`keypress`?bn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?bn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),Wn=Cn(f({},jn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),Gn=Cn(f({},En,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Hn})),Kn=Cn(f({},wn,{propertyName:0,elapsedTime:0,pseudoElement:0})),qn=Cn(f({},jn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),Jn=Cn(f({},wn,{newState:0,oldState:0})),Yn=[9,13,27,32],Xn=mn&&`CompositionEvent`in window,Zn=null;mn&&`documentMode`in document&&(Zn=document.documentMode);var Qn=mn&&`TextEvent`in window&&!Zn,$n=mn&&(!Xn||Zn&&8<Zn&&11>=Zn),er=` `,tr=!1;function nr(e,t){switch(e){case`keyup`:return Yn.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function rr(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var ir=!1;function ar(e,t){switch(e){case`compositionend`:return rr(t);case`keypress`:return t.which===32?(tr=!0,er):null;case`textInput`:return e=t.data,e===er&&tr?null:e;default:return null}}function or(e,t){if(ir)return e===`compositionend`||!Xn&&nr(e,t)?(e=yn(),vn=_n=P=null,ir=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return $n&&t.locale!==`ko`?null:t.data;default:return null}}var sr={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function cr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!sr[e.type]:t===`textarea`}function lr(e,t,n,r){ln?un?un.push(r):un=[r]:ln=r,t=Od(t,`onChange`),0<t.length&&(n=new Tn(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var ur=null,dr=null;function fr(e){xd(e,0)}function pr(e){if(Rt(Ct(e)))return e}function mr(e,t){if(e===`change`)return t}var hr=!1;if(mn){var gr;if(mn){var _r=`oninput`in document;if(!_r){var vr=document.createElement(`div`);vr.setAttribute(`oninput`,`return;`),_r=typeof vr.oninput==`function`}gr=_r}else gr=!1;hr=gr&&(!document.documentMode||9<document.documentMode)}function yr(){ur&&(ur.detachEvent(`onpropertychange`,br),dr=ur=null)}function br(e){if(e.propertyName===`value`&&pr(dr)){var t=[];lr(t,dr,e,cn(e)),fn(fr,t)}}function xr(e,t,n){e===`focusin`?(yr(),ur=t,dr=n,ur.attachEvent(`onpropertychange`,br)):e===`focusout`&&yr()}function Sr(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return pr(dr)}function Cr(e,t){if(e===`click`)return pr(t)}function wr(e,t){if(e===`input`||e===`change`)return pr(t)}function Tr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var Er=typeof Object.is==`function`?Object.is:Tr;function Dr(e,t){if(Er(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!De.call(t,i)||!Er(e[i],t[i]))return!1}return!0}function Or(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function kr(e,t){var n=Or(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Or(n)}}function Ar(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Ar(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function jr(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=zt(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=zt(e.document)}return t}function Mr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var Nr=mn&&`documentMode`in document&&11>=document.documentMode,Pr=null,Fr=null,Ir=null,Lr=!1;function Rr(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Lr||Pr==null||Pr!==zt(r)||(r=Pr,`selectionStart`in r&&Mr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Ir&&Dr(Ir,r)||(Ir=r,r=Od(Fr,`onSelect`),0<r.length&&(t=new Tn(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Pr)))}function zr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var Br={animationend:zr(`Animation`,`AnimationEnd`),animationiteration:zr(`Animation`,`AnimationIteration`),animationstart:zr(`Animation`,`AnimationStart`),transitionrun:zr(`Transition`,`TransitionRun`),transitionstart:zr(`Transition`,`TransitionStart`),transitioncancel:zr(`Transition`,`TransitionCancel`),transitionend:zr(`Transition`,`TransitionEnd`)},Vr={},Hr={};mn&&(Hr=document.createElement(`div`).style,`AnimationEvent`in window||(delete Br.animationend.animation,delete Br.animationiteration.animation,delete Br.animationstart.animation),`TransitionEvent`in window||delete Br.transitionend.transition);function Ur(e){if(Vr[e])return Vr[e];if(!Br[e])return e;var t=Br[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Hr)return Vr[e]=t[n];return e}var Wr=Ur(`animationend`),Gr=Ur(`animationiteration`),Kr=Ur(`animationstart`),qr=Ur(`transitionrun`),Jr=Ur(`transitionstart`),Yr=Ur(`transitioncancel`),Xr=Ur(`transitionend`),Zr=new Map,Qr=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);Qr.push(`scrollEnd`);function $r(e,t){Zr.set(e,t),Dt(t,[e])}var ei=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},ti=[],ni=0,ri=0;function ii(){for(var e=ni,t=ri=ni=0;t<e;){var n=ti[t];ti[t++]=null;var r=ti[t];ti[t++]=null;var i=ti[t];ti[t++]=null;var a=ti[t];if(ti[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&ci(n,i,a)}}function ai(e,t,n,r){ti[ni++]=e,ti[ni++]=t,ti[ni++]=n,ti[ni++]=r,ri|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function oi(e,t,n,r){return ai(e,t,n,r),li(e)}function si(e,t){return ai(e,null,null,t),li(e)}function ci(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-We(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function li(e){if(50<hu)throw hu=0,gu=null,Error(i(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var ui={};function di(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function fi(e,t,n,r){return new di(e,t,n,r)}function pi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function mi(e,t){var n=e.alternate;return n===null?(n=fi(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function hi(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function gi(e,t,n,r,a,o){var s=0;if(r=e,typeof e==`function`)pi(e)&&(s=1);else if(typeof e==`string`)s=Uf(e,n,pe.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(e){case te:return e=fi(31,n,t,a),e.elementType=te,e.lanes=o,e;case g:return _i(n.children,a,o,t);case _:s=8,a|=24;break;case v:return e=fi(12,n,t,a|2),e.elementType=v,e.lanes=o,e;case S:return e=fi(13,n,t,a),e.elementType=S,e.lanes=o,e;case ee:return e=fi(19,n,t,a),e.elementType=ee,e.lanes=o,e;default:if(typeof e==`object`&&e)switch(e.$$typeof){case b:s=10;break a;case y:s=9;break a;case x:s=11;break a;case C:s=14;break a;case w:s=16,r=null;break a}s=29,n=Error(i(130,e===null?`null`:typeof e,``)),r=null}return t=fi(s,n,t,a),t.elementType=e,t.type=r,t.lanes=o,t}function _i(e,t,n,r){return e=fi(7,e,r,t),e.lanes=n,e}function vi(e,t,n){return e=fi(6,e,null,t),e.lanes=n,e}function yi(e){var t=fi(18,null,null,0);return t.stateNode=e,t}function bi(e,t,n){return t=fi(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var xi=new WeakMap;function Si(e,t){if(typeof e==`object`&&e){var n=xi.get(e);return n===void 0?(t={value:e,source:t,stack:Ee(t)},xi.set(e,t),t):n}return{value:e,source:t,stack:Ee(t)}}var Ci=[],wi=0,Ti=null,Ei=0,Di=[],Oi=0,ki=null,Ai=1,ji=``;function Mi(e,t){Ci[wi++]=Ei,Ci[wi++]=Ti,Ti=e,Ei=t}function Ni(e,t,n){Di[Oi++]=Ai,Di[Oi++]=ji,Di[Oi++]=ki,ki=e;var r=Ai;e=ji;var i=32-We(r)-1;r&=~(1<<i),n+=1;var a=32-We(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Ai=1<<32-We(t)+i|n<<i|r,ji=a+e}else Ai=1<<a|n<<i|r,ji=e}function Pi(e){e.return!==null&&(Mi(e,1),Ni(e,1,0))}function Fi(e){for(;e===Ti;)Ti=Ci[--wi],Ci[wi]=null,Ei=Ci[--wi],Ci[wi]=null;for(;e===ki;)ki=Di[--Oi],Di[Oi]=null,ji=Di[--Oi],Di[Oi]=null,Ai=Di[--Oi],Di[Oi]=null}function Ii(e,t){Di[Oi++]=Ai,Di[Oi++]=ji,Di[Oi++]=ki,Ai=t.id,ji=t.overflow,ki=e}var Li=null,Ri=null,F=!1,zi=null,Bi=!1,Vi=Error(i(519));function Hi(e){throw Ji(Si(Error(i(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),Vi}function Ui(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[pt]=e,t[mt]=r,n){case`dialog`:X(`cancel`,t),X(`close`,t);break;case`iframe`:case`object`:case`embed`:X(`load`,t);break;case`video`:case`audio`:for(n=0;n<yd.length;n++)X(yd[n],t);break;case`source`:X(`error`,t);break;case`img`:case`image`:case`link`:X(`error`,t),X(`load`,t);break;case`details`:X(`toggle`,t);break;case`input`:X(`invalid`,t),Ut(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:X(`invalid`,t);break;case`textarea`:X(`invalid`,t),qt(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||Z(t.textContent,n)?(r.popover!=null&&(X(`beforetoggle`,t),X(`toggle`,t)),r.onScroll!=null&&X(`scroll`,t),r.onScrollEnd!=null&&X(`scrollend`,t),r.onClick!=null&&(t.onclick=on),t=!0):t=!1,t||Hi(e,!0)}function Wi(e){for(Li=e.return;Li;)switch(Li.tag){case 5:case 31:case 13:Bi=!1;return;case 27:case 3:Bi=!0;return;default:Li=Li.return}}function Gi(e){if(e!==Li)return!1;if(!F)return Wi(e),F=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!==`form`&&n!==`button`)||Ud(e.type,e.memoizedProps)),n=!n),n&&Ri&&Hi(e),Wi(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));Ri=uf(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));Ri=uf(e)}else t===27?(t=Ri,Zd(e.type)?(e=lf,lf=null,Ri=e):Ri=t):Ri=Li?cf(e.stateNode.nextSibling):null;return!0}function Ki(){Ri=Li=null,F=!1}function qi(){var e=zi;return e!==null&&(ru===null?ru=e:ru.push.apply(ru,e),zi=null),e}function Ji(e){zi===null?zi=[e]:zi.push(e)}var Yi=de(null),Xi=null,Zi=null;function Qi(e,t,n){D(Yi,t._currentValue),t._currentValue=n}function $i(e){e._currentValue=Yi.current,fe(Yi)}function ea(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function ta(e,t,n,r){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){var s=a.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=a;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),ea(o.return,n,e),r||(s=null);break a}o=c.next}}else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),ea(s,n,e),s=null}else s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===e){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}}function na(e,t,n,r){e=null;for(var a=t,o=!1;a!==null;){if(!o){if(a.flags&524288)o=!0;else if(a.flags&262144)break}if(a.tag===10){var s=a.alternate;if(s===null)throw Error(i(387));if(s=s.memoizedProps,s!==null){var c=a.type;Er(a.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(a===he.current){if(s=a.alternate,s===null)throw Error(i(387));s.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e===null?e=[Qf]:e.push(Qf))}a=a.return}e!==null&&ta(t,e,n,r),t.flags|=262144}function ra(e){for(e=e.firstContext;e!==null;){if(!Er(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function ia(e){Xi=e,Zi=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function aa(e){return sa(Xi,e)}function oa(e,t){return Xi===null&&ia(e),sa(e,t)}function sa(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Zi===null){if(e===null)throw Error(i(308));Zi=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Zi=Zi.next=t;return n}var ca=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},la=t.unstable_scheduleCallback,ua=t.unstable_NormalPriority,da={$$typeof:b,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function fa(){return{controller:new ca,data:new Map,refCount:0}}function pa(e){e.refCount--,e.refCount===0&&la(ua,function(){e.controller.abort()})}var I=null,ma=0,ha=0,ga=null;function _a(e,t){if(I===null){var n=I=[];ma=0,ha=pd(),ga={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return ma++,t.then(va,va),t}function va(){if(--ma===0&&I!==null){ga!==null&&(ga.status=`fulfilled`);var e=I;I=null,ha=0,ga=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function ya(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var ba=T.S;T.S=function(e,t){G=Me(),typeof t==`object`&&t&&typeof t.then==`function`&&_a(e,t),ba!==null&&ba(e,t)};var xa=de(null);function Sa(){var e=xa.current;return e===null?Wl.pooledCache:e}function Ca(e,t){t===null?D(xa,xa.current):D(xa,t.pool)}function wa(){var e=Sa();return e===null?null:{parent:da._currentValue,pool:e}}var Ta=Error(i(460)),Ea=Error(i(474)),Da=Error(i(542)),Oa={then:function(){}};function ka(e){return e=e.status,e===`fulfilled`||e===`rejected`}function Aa(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(on,on),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Pa(e),e;default:if(typeof t.status==`string`)t.then(on,on);else{if(e=Wl,e!==null&&100<e.shellSuspendCounter)throw Error(i(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Pa(e),e}throw Ma=t,Ta}}function ja(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(Ma=e,Ta):e}}var Ma=null;function Na(){if(Ma===null)throw Error(i(459));var e=Ma;return Ma=null,e}function Pa(e){if(e===Ta||e===Da)throw Error(i(483))}var Fa=null,Ia=0;function La(e){var t=Ia;return Ia+=1,Fa===null&&(Fa=[]),Aa(Fa,e,t)}function Ra(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function za(e,t){throw t.$$typeof===p?Error(i(525)):(e=Object.prototype.toString.call(t),Error(i(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function Ba(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function a(e,t){return e=mi(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=67108866,n):(r=r.index,r<n?(t.flags|=67108866,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=67108866),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=vi(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===g?d(e,t,n.props.children,r,n.key):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===w&&ja(i)===t.type)?(t=a(t,n.props),Ra(t,n),t.return=e,t):(t=gi(n.type,n.key,n.props,null,e.mode,r),Ra(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=bi(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=_i(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=vi(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case m:return n=gi(t.type,t.key,t.props,null,e.mode,n),Ra(n,t),n.return=e,n;case h:return t=bi(t,e.mode,n),t.return=e,t;case w:return t=ja(t),f(e,t,n)}if(se(t)||ie(t))return t=_i(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,La(t),n);if(t.$$typeof===b)return f(e,oa(e,t),n);za(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case m:return n.key===i?l(e,t,n,r):null;case h:return n.key===i?u(e,t,n,r):null;case w:return n=ja(n),p(e,t,n,r)}if(se(n)||ie(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,La(n),r);if(n.$$typeof===b)return p(e,t,oa(e,n),r);za(e,n)}return null}function _(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case m:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case h:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case w:return r=ja(r),_(e,t,n,r,i)}if(se(r)||ie(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return _(e,t,n,La(r),i);if(r.$$typeof===b)return _(e,t,n,oa(t,r),i);za(t,r)}return null}function v(i,a,s,c){for(var l=null,u=null,d=a,m=a=0,h=null;d!==null&&m<s.length;m++){d.index>m?(h=d,d=null):h=d.sibling;var g=p(i,d,s[m],c);if(g===null){d===null&&(d=h);break}e&&d&&g.alternate===null&&t(i,d),a=o(g,a,m),u===null?l=g:u.sibling=g,u=g,d=h}if(m===s.length)return n(i,d),F&&Mi(i,m),l;if(d===null){for(;m<s.length;m++)d=f(i,s[m],c),d!==null&&(a=o(d,a,m),u===null?l=d:u.sibling=d,u=d);return F&&Mi(i,m),l}for(d=r(d);m<s.length;m++)h=_(d,i,m,s[m],c),h!==null&&(e&&h.alternate!==null&&d.delete(h.key===null?m:h.key),a=o(h,a,m),u===null?l=h:u.sibling=h,u=h);return e&&d.forEach(function(e){return t(i,e)}),F&&Mi(i,m),l}function y(a,s,c,l){if(c==null)throw Error(i(151));for(var u=null,d=null,m=s,h=s=0,g=null,v=c.next();m!==null&&!v.done;h++,v=c.next()){m.index>h?(g=m,m=null):g=m.sibling;var y=p(a,m,v.value,l);if(y===null){m===null&&(m=g);break}e&&m&&y.alternate===null&&t(a,m),s=o(y,s,h),d===null?u=y:d.sibling=y,d=y,m=g}if(v.done)return n(a,m),F&&Mi(a,h),u;if(m===null){for(;!v.done;h++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,h),d===null?u=v:d.sibling=v,d=v);return F&&Mi(a,h),u}for(m=r(m);!v.done;h++,v=c.next())v=_(m,a,h,v.value,l),v!==null&&(e&&v.alternate!==null&&m.delete(v.key===null?h:v.key),s=o(v,s,h),d===null?u=v:d.sibling=v,d=v);return e&&m.forEach(function(e){return t(a,e)}),F&&Mi(a,h),u}function x(e,r,o,c){if(typeof o==`object`&&o&&o.type===g&&o.key===null&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case m:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===g){if(r.tag===7){n(e,r.sibling),c=a(r,o.props.children),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===w&&ja(l)===r.type){n(e,r.sibling),c=a(r,o.props),Ra(c,o),c.return=e,e=c;break a}n(e,r);break}else t(e,r);r=r.sibling}o.type===g?(c=_i(o.props.children,e.mode,c,o.key),c.return=e,e=c):(c=gi(o.type,o.key,o.props,null,e.mode,c),Ra(c,o),c.return=e,e=c)}return s(e);case h:a:{for(l=o.key;r!==null;){if(r.key===l)if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=a(r,o.children||[]),c.return=e,e=c;break a}else{n(e,r);break}else t(e,r);r=r.sibling}c=bi(o,e.mode,c),c.return=e,e=c}return s(e);case w:return o=ja(o),x(e,r,o,c)}if(se(o))return v(e,r,o,c);if(ie(o)){if(l=ie(o),typeof l!=`function`)throw Error(i(150));return o=l.call(o),y(e,r,o,c)}if(typeof o.then==`function`)return x(e,r,La(o),c);if(o.$$typeof===b)return x(e,r,oa(e,o),c);za(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=a(r,o),c.return=e,e=c):(n(e,r),c=vi(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{Ia=0;var i=x(e,t,n,r);return Fa=null,i}catch(t){if(t===Ta||t===Da)throw t;var a=fi(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var Va=Ba(!0),Ha=Ba(!1),Ua=!1;function Wa(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ga(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Ka(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function qa(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,V&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=li(e),ci(e,null,n),t}return ai(e,r,t,n),li(e)}function Ja(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,ot(e,n)}}function Ya(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var Xa=!1;function Za(){if(Xa){var e=ga;if(e!==null)throw e}}function Qa(e,t,n,r){Xa=!1;var i=e.updateQueue;Ua=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var p=s.lane&-536870913,m=p!==s.lane;if(m?(U&p)===p:(r&p)===p){p!==0&&p===ha&&(Xa=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var h=e,g=s;p=t;var _=n;switch(g.tag){case 1:if(h=g.payload,typeof h==`function`){d=h.call(_,d,p);break a}d=h;break a;case 3:h.flags=h.flags&-65537|128;case 0:if(h=g.payload,p=typeof h==`function`?h.call(_,d,p):h,p==null)break a;d=f({},d,p);break a;case 2:Ua=!0}}p=s.callback,p!==null&&(e.flags|=64,m&&(e.flags|=8192),m=i.callbacks,m===null?i.callbacks=[p]:m.push(p))}else m={lane:p,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=m,c=d):u=u.next=m,o|=p;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;m=s,s=m.next,m.next=null,i.lastBaseUpdate=m,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),Zl|=o,e.lanes=o,e.memoizedState=d}}function $a(e,t){if(typeof e!=`function`)throw Error(i(191,e));e.call(t)}function eo(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)$a(n[e],t)}var to=de(null),no=de(0);function ro(e,t){e=Yl,D(no,e),D(to,t),Yl=e|t.baseLanes}function io(){D(no,Yl),D(to,to.current)}function ao(){Yl=no.current,fe(to),fe(no)}var oo=de(null),so=null;function co(e){var t=e.alternate;D(mo,mo.current&1),D(oo,e),so===null&&(t===null||to.current!==null||t.memoizedState!==null)&&(so=e)}function lo(e){D(mo,mo.current),D(oo,e),so===null&&(so=e)}function uo(e){e.tag===22?(D(mo,mo.current),D(oo,e),so===null&&(so=e)):fo(e)}function fo(){D(mo,mo.current),D(oo,oo.current)}function po(e){fe(oo),so===e&&(so=null),fe(mo)}var mo=de(0);function ho(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||af(n)||of(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder===`forwards`||t.memoizedProps.revealOrder===`backwards`||t.memoizedProps.revealOrder===`unstable_legacy-backwards`||t.memoizedProps.revealOrder===`together`)){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var go=0,L=null,_o=null,vo=null,yo=!1,bo=!1,xo=!1,So=0,Co=0,wo=null,To=0;function Eo(){throw Error(i(321))}function Do(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Er(e[n],t[n]))return!1;return!0}function R(e,t,n,r,i,a){return go=a,L=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,T.H=e===null||e.memoizedState===null?Us:Ws,xo=!1,a=n(r,i),xo=!1,bo&&(a=ko(t,n,r,i)),Oo(e),a}function Oo(e){T.H=Hs;var t=_o!==null&&_o.next!==null;if(go=0,vo=_o=L=null,yo=!1,Co=0,wo=null,t)throw Error(i(300));e===null||sc||(e=e.dependencies,e!==null&&ra(e)&&(sc=!0))}function ko(e,t,n,r){L=e;var a=0;do{if(bo&&(wo=null),Co=0,bo=!1,25<=a)throw Error(i(301));if(a+=1,vo=_o=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}T.H=Gs,o=t(n,r)}while(bo);return o}function Ao(){var e=T.H,t=e.useState()[0];return t=typeof t.then==`function`?Lo(t):t,e=e.useState()[0],(_o===null?null:_o.memoizedState)!==e&&(L.flags|=1024),t}function jo(){var e=So!==0;return So=0,e}function Mo(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function No(e){if(yo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}yo=!1}go=0,vo=_o=L=null,bo=!1,Co=So=0,wo=null}function Po(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return vo===null?L.memoizedState=vo=e:vo=vo.next=e,vo}function Fo(){if(_o===null){var e=L.alternate;e=e===null?null:e.memoizedState}else e=_o.next;var t=vo===null?L.memoizedState:vo.next;if(t!==null)vo=t,_o=e;else{if(e===null)throw L.alternate===null?Error(i(467)):Error(i(310));_o=e,e={memoizedState:_o.memoizedState,baseState:_o.baseState,baseQueue:_o.baseQueue,queue:_o.queue,next:null},vo===null?L.memoizedState=vo=e:vo=vo.next=e}return vo}function Io(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Lo(e){var t=Co;return Co+=1,wo===null&&(wo=[]),e=Aa(wo,e,t),t=L,(vo===null?t.memoizedState:vo.next)===null&&(t=t.alternate,T.H=t===null||t.memoizedState===null?Us:Ws),e}function Ro(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return Lo(e);if(e.$$typeof===b)return aa(e)}throw Error(i(438,String(e)))}function zo(e){var t=null,n=L.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=L.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=Io(),L.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=ne;return t.index++,n}function Bo(e,t){return typeof t==`function`?t(e):t}function Vo(e){return Ho(Fo(),_o,e)}function Ho(e,t,n){var r=e.queue;if(r===null)throw Error(i(311));r.lastRenderedReducer=n;var a=e.baseQueue,o=r.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}t.baseQueue=a=o,r.pending=null}if(o=e.baseState,a===null)e.memoizedState=o;else{t=a.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(go&f)===f:(U&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===ha&&(d=!0);else if((go&p)===p){u=u.next,p===ha&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,L.lanes|=p,Zl|=p;f=u.action,xo&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,L.lanes|=f,Zl|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!Er(o,e.memoizedState)&&(sc=!0,d&&(n=ga,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return a===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function Uo(e){var t=Fo(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);Er(o,t.memoizedState)||(sc=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function Wo(e,t,n){var r=L,a=Fo(),o=F;if(o){if(n===void 0)throw Error(i(407));n=n()}else n=t();var s=!Er((_o||a).memoizedState,n);if(s&&(a.memoizedState=n,sc=!0),a=a.queue,hs(qo.bind(null,r,a,e),[e]),a.getSnapshot!==t||s||vo!==null&&vo.memoizedState.tag&1){if(r.flags|=2048,us(9,{destroy:void 0},Ko.bind(null,r,a,n,t),null),Wl===null)throw Error(i(349));o||go&127||Go(r,t,n)}return n}function Go(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=L.updateQueue,t===null?(t=Io(),L.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Ko(e,t,n,r){t.value=n,t.getSnapshot=r,Jo(t)&&Yo(e)}function qo(e,t,n){return n(function(){Jo(t)&&Yo(e)})}function Jo(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Er(e,n)}catch{return!0}}function Yo(e){var t=si(e,2);t!==null&&yu(t,e,2)}function Xo(e){var t=Po();if(typeof e==`function`){var n=e;if(e=n(),xo){Ue(!0);try{n()}finally{Ue(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bo,lastRenderedState:e},t}function Zo(e,t,n,r){return e.baseState=n,Ho(e,_o,typeof r==`function`?r:Bo)}function Qo(e,t,n,r,a){if(zs(e))throw Error(i(485));if(e=t.action,e!==null){var o={payload:a,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};T.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,$o(t,o)):(o.next=n.next,t.pending=n.next=o)}}function $o(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=T.T,o={};T.T=o;try{var s=n(i,r),c=T.S;c!==null&&c(o,s),es(e,t,s)}catch(n){ns(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),T.T=a}}else try{a=n(i,r),es(e,t,a)}catch(n){ns(e,t,n)}}function es(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){ts(e,t,n)},function(n){return ns(e,t,n)}):ts(e,t,n)}function ts(e,t,n){t.status=`fulfilled`,t.value=n,rs(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,$o(e,n)))}function ns(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,rs(t),t=t.next;while(t!==r)}e.action=null}function rs(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function is(e,t){return t}function as(e,t){if(F){var n=Wl.formState;if(n!==null){a:{var r=L;if(F){if(Ri){b:{for(var i=Ri,a=Bi;i.nodeType!==8;){if(!a){i=null;break b}if(i=cf(i.nextSibling),i===null){i=null;break b}}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){Ri=cf(i.nextSibling),r=i.data===`F!`;break a}}Hi(r)}r=!1}r&&(t=n[0])}}return n=Po(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:is,lastRenderedState:t},n.queue=r,n=Is.bind(null,L,r),r.dispatch=n,r=Xo(!1),a=Rs.bind(null,L,!1,r.queue),r=Po(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=Qo.bind(null,L,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function os(e){return ss(Fo(),_o,e)}function ss(e,t,n){if(t=Ho(e,t,is)[0],e=Vo(Bo)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=Lo(t)}catch(e){throw e===Ta?Da:e}else r=t;t=Fo();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(L.flags|=2048,us(9,{destroy:void 0},cs.bind(null,i,n),null)),[r,a,e]}function cs(e,t){e.action=t}function ls(e){var t=Fo(),n=_o;if(n!==null)return ss(t,n,e);Fo(),t=t.memoizedState,n=Fo();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function us(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=L.updateQueue,t===null&&(t=Io(),L.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function ds(){return Fo().memoizedState}function fs(e,t,n,r){var i=Po();L.flags|=e,i.memoizedState=us(1|t,{destroy:void 0},n,r===void 0?null:r)}function ps(e,t,n,r){var i=Fo();r=r===void 0?null:r;var a=i.memoizedState.inst;_o!==null&&r!==null&&Do(r,_o.memoizedState.deps)?i.memoizedState=us(t,a,n,r):(L.flags|=e,i.memoizedState=us(1|t,a,n,r))}function ms(e,t){fs(8390656,8,e,t)}function hs(e,t){ps(2048,8,e,t)}function gs(e){L.flags|=4;var t=L.updateQueue;if(t===null)t=Io(),L.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function _s(e){var t=Fo().memoizedState;return gs({ref:t,nextImpl:e}),function(){if(V&2)throw Error(i(440));return t.impl.apply(void 0,arguments)}}function vs(e,t){return ps(4,2,e,t)}function ys(e,t){return ps(4,4,e,t)}function bs(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function xs(e,t,n){n=n==null?null:n.concat([e]),ps(4,4,bs.bind(null,t,e),n)}function Ss(){}function Cs(e,t){var n=Fo();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&Do(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function z(e,t){var n=Fo();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&Do(t,r[1]))return r[0];if(r=e(),xo){Ue(!0);try{e()}finally{Ue(!1)}}return n.memoizedState=[r,t],r}function ws(e,t,n){return n===void 0||go&1073741824&&!(U&261930)?e.memoizedState=t:(e.memoizedState=n,e=vu(),L.lanes|=e,Zl|=e,n)}function Ts(e,t,n,r){return Er(n,t)?n:to.current===null?!(go&42)||go&1073741824&&!(U&261930)?(sc=!0,e.memoizedState=n):(e=vu(),L.lanes|=e,Zl|=e,t):(e=ws(e,n,r),Er(e,t)||(sc=!0),e)}function Es(e,t,n,r,i){var a=E.p;E.p=a!==0&&8>a?a:8;var o=T.T,s={};T.T=s,Rs(e,!1,t,n);try{var c=i(),l=T.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?Ls(e,t,ya(c,r),_u(e)):Ls(e,t,r,_u(e))}catch(n){Ls(e,t,{then:function(){},status:`rejected`,reason:n},_u())}finally{E.p=a,o!==null&&s.types!==null&&(o.types=s.types),T.T=o}}function Ds(){}function Os(e,t,n,r){if(e.tag!==5)throw Error(i(476));var a=ks(e).queue;Es(e,a,t,ce,n===null?Ds:function(){return As(e),n(r)})}function ks(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:ce,baseState:ce,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bo,lastRenderedState:ce},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bo,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function As(e){var t=ks(e);t.next===null&&(t=e.alternate.memoizedState),Ls(e,t.next.queue,{},_u())}function js(){return aa(Qf)}function Ms(){return Fo().memoizedState}function Ns(){return Fo().memoizedState}function Ps(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=_u();e=Ka(n);var r=qa(t,e,n);r!==null&&(yu(r,t,n),Ja(r,t,n)),t={cache:fa()},e.payload=t;return}t=t.return}}function Fs(e,t,n){var r=_u();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},zs(e)?Bs(t,n):(n=oi(e,t,n,r),n!==null&&(yu(n,e,r),Vs(n,t,r)))}function Is(e,t,n){Ls(e,t,n,_u())}function Ls(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(zs(e))Bs(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,Er(s,o))return ai(e,t,i,0),Wl===null&&ii(),!1}catch{}if(n=oi(e,t,i,r),n!==null)return yu(n,e,r),Vs(n,t,r),!0}return!1}function Rs(e,t,n,r){if(r={lane:2,revertLane:pd(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},zs(e)){if(t)throw Error(i(479))}else t=oi(e,n,r,2),t!==null&&yu(t,e,2)}function zs(e){var t=e.alternate;return e===L||t!==null&&t===L}function Bs(e,t){bo=yo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Vs(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,ot(e,n)}}var Hs={readContext:aa,use:Ro,useCallback:Eo,useContext:Eo,useEffect:Eo,useImperativeHandle:Eo,useLayoutEffect:Eo,useInsertionEffect:Eo,useMemo:Eo,useReducer:Eo,useRef:Eo,useState:Eo,useDebugValue:Eo,useDeferredValue:Eo,useTransition:Eo,useSyncExternalStore:Eo,useId:Eo,useHostTransitionStatus:Eo,useFormState:Eo,useActionState:Eo,useOptimistic:Eo,useMemoCache:Eo,useCacheRefresh:Eo};Hs.useEffectEvent=Eo;var Us={readContext:aa,use:Ro,useCallback:function(e,t){return Po().memoizedState=[e,t===void 0?null:t],e},useContext:aa,useEffect:ms,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),fs(4194308,4,bs.bind(null,t,e),n)},useLayoutEffect:function(e,t){return fs(4194308,4,e,t)},useInsertionEffect:function(e,t){fs(4,2,e,t)},useMemo:function(e,t){var n=Po();t=t===void 0?null:t;var r=e();if(xo){Ue(!0);try{e()}finally{Ue(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=Po();if(n!==void 0){var i=n(t);if(xo){Ue(!0);try{n(t)}finally{Ue(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=Fs.bind(null,L,e),[r.memoizedState,e]},useRef:function(e){var t=Po();return e={current:e},t.memoizedState=e},useState:function(e){e=Xo(e);var t=e.queue,n=Is.bind(null,L,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Ss,useDeferredValue:function(e,t){return ws(Po(),e,t)},useTransition:function(){var e=Xo(!1);return e=Es.bind(null,L,e.queue,!0,!1),Po().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=L,a=Po();if(F){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),Wl===null)throw Error(i(349));U&127||Go(r,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,ms(qo.bind(null,r,o,e),[e]),r.flags|=2048,us(9,{destroy:void 0},Ko.bind(null,r,o,n,t),null),n},useId:function(){var e=Po(),t=Wl.identifierPrefix;if(F){var n=ji,r=Ai;n=(r&~(1<<32-We(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=So++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=To++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:js,useFormState:as,useActionState:as,useOptimistic:function(e){var t=Po();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Rs.bind(null,L,!0,n),n.dispatch=t,[e,t]},useMemoCache:zo,useCacheRefresh:function(){return Po().memoizedState=Ps.bind(null,L)},useEffectEvent:function(e){var t=Po(),n={impl:e};return t.memoizedState=n,function(){if(V&2)throw Error(i(440));return n.impl.apply(void 0,arguments)}}},Ws={readContext:aa,use:Ro,useCallback:Cs,useContext:aa,useEffect:hs,useImperativeHandle:xs,useInsertionEffect:vs,useLayoutEffect:ys,useMemo:z,useReducer:Vo,useRef:ds,useState:function(){return Vo(Bo)},useDebugValue:Ss,useDeferredValue:function(e,t){return Ts(Fo(),_o.memoizedState,e,t)},useTransition:function(){var e=Vo(Bo)[0],t=Fo().memoizedState;return[typeof e==`boolean`?e:Lo(e),t]},useSyncExternalStore:Wo,useId:Ms,useHostTransitionStatus:js,useFormState:os,useActionState:os,useOptimistic:function(e,t){return Zo(Fo(),_o,e,t)},useMemoCache:zo,useCacheRefresh:Ns};Ws.useEffectEvent=_s;var Gs={readContext:aa,use:Ro,useCallback:Cs,useContext:aa,useEffect:hs,useImperativeHandle:xs,useInsertionEffect:vs,useLayoutEffect:ys,useMemo:z,useReducer:Uo,useRef:ds,useState:function(){return Uo(Bo)},useDebugValue:Ss,useDeferredValue:function(e,t){var n=Fo();return _o===null?ws(n,e,t):Ts(n,_o.memoizedState,e,t)},useTransition:function(){var e=Uo(Bo)[0],t=Fo().memoizedState;return[typeof e==`boolean`?e:Lo(e),t]},useSyncExternalStore:Wo,useId:Ms,useHostTransitionStatus:js,useFormState:ls,useActionState:ls,useOptimistic:function(e,t){var n=Fo();return _o===null?(n.baseState=e,[e,n.queue.dispatch]):Zo(n,_o,e,t)},useMemoCache:zo,useCacheRefresh:Ns};Gs.useEffectEvent=_s;function Ks(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:f({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var qs={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=_u(),i=Ka(r);i.payload=t,n!=null&&(i.callback=n),t=qa(e,i,r),t!==null&&(yu(t,e,r),Ja(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=_u(),i=Ka(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=qa(e,i,r),t!==null&&(yu(t,e,r),Ja(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=_u(),r=Ka(n);r.tag=2,t!=null&&(r.callback=t),t=qa(e,r,n),t!==null&&(yu(t,e,n),Ja(t,e,n))}};function Js(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Dr(n,r)||!Dr(i,a):!0}function Ys(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&qs.enqueueReplaceState(t,t.state,null)}function Xs(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=f({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function Zs(e){ei(e)}function Qs(e){console.error(e)}function $s(e){ei(e)}function ec(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function tc(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function nc(e,t,n){return n=Ka(n),n.tag=3,n.payload={element:null},n.callback=function(){ec(e,t)},n}function rc(e){return e=Ka(e),e.tag=3,e}function ic(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){tc(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){tc(t,n,r),typeof i!=`function`&&(su===null?su=new Set([this]):su.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function ac(e,t,n,r,a){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&na(t,n,a,!0),n=oo.current,n!==null){switch(n.tag){case 31:case 13:return so===null?ju():n.alternate===null&&Xl===0&&(Xl=3),n.flags&=-257,n.flags|=65536,n.lanes=a,r===Oa?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),Ju(e,r,a)),!1;case 22:return n.flags|=65536,r===Oa?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),Ju(e,r,a)),!1}throw Error(i(435,n.tag))}return Ju(e,r,a),ju(),!1}if(F)return t=oo.current,t===null?(r!==Vi&&(t=Error(i(423),{cause:r}),Ji(Si(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,r=Si(r,n),a=nc(e.stateNode,r,a),Ya(e,a),Xl!==4&&(Xl=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=a,r!==Vi&&(e=Error(i(422),{cause:r}),Ji(Si(e,n)))),!1;var o=Error(i(520),{cause:r});if(o=Si(o,n),nu===null?nu=[o]:nu.push(o),Xl!==4&&(Xl=2),t===null)return!0;r=Si(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=nc(n.stateNode,r,e),Ya(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(su===null||!su.has(o))))return n.flags|=65536,a&=-a,n.lanes|=a,a=rc(a),ic(a,e,n,r),Ya(n,a),!1}n=n.return}while(n!==null);return!1}var oc=Error(i(461)),sc=!1;function cc(e,t,n,r){t.child=e===null?Ha(t,null,n,r):Va(t,e.child,n,r)}function lc(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return ia(t),r=R(e,t,n,o,a,i),s=jo(),e!==null&&!sc?(Mo(e,t,i),Nc(e,t,i)):(F&&s&&Pi(t),t.flags|=1,cc(e,t,r,i),t.child)}function uc(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!pi(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,dc(e,t,a,r,i)):(e=gi(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!B(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?Dr:n,n(o,r)&&e.ref===t.ref)return Nc(e,t,i)}return t.flags|=1,e=mi(a,r),e.ref=t.ref,e.return=t,t.child=e}function dc(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(Dr(a,r)&&e.ref===t.ref)if(sc=!1,t.pendingProps=r=a,B(e,i))e.flags&131072&&(sc=!0);else return t.lanes=e.lanes,Nc(e,t,i)}return yc(e,t,n,r,i)}function fc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return mc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ca(t,a===null?null:a.cachePool),a===null?io():ro(t,a),uo(t);else return r=t.lanes=536870912,mc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&Ca(t,null),io(),fo(t)):(Ca(t,a.cachePool),ro(t,a),fo(t),t.memoizedState=null);return cc(e,t,i,n),t.child}function pc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function mc(e,t,n,r,i){var a=Sa();return a=a===null?null:{parent:da._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&Ca(t,null),io(),uo(t),e!==null&&na(e,t,r,!0),t.childLanes=i,null}function hc(e,t){return t=Oc({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function gc(e,t,n){return Va(t,e.child,null,n),e=hc(t,t.pendingProps),e.flags|=2,po(t),t.memoizedState=null,e}function _c(e,t,n){var r=t.pendingProps,a=(t.flags&128)!=0;if(t.flags&=-129,e===null){if(F){if(r.mode===`hidden`)return e=hc(t,r),t.lanes=536870912,pc(null,e);if(lo(t),(e=Ri)?(e=rf(e,Bi),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ki===null?null:{id:Ai,overflow:ji},retryLane:536870912,hydrationErrors:null},n=yi(e),n.return=t,t.child=n,Li=t,Ri=null)):e=null,e===null)throw Hi(t);return t.lanes=536870912,null}return hc(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(lo(t),a)if(t.flags&256)t.flags&=-257,t=gc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(i(558));else if(sc||na(e,t,n,!1),a=(n&e.childLanes)!==0,sc||a){if(r=Wl,r!==null&&(s=st(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,si(e,s),yu(r,e,s),oc;ju(),t=gc(e,t,n)}else e=o.treeContext,Ri=cf(s.nextSibling),Li=t,F=!0,zi=null,Bi=!1,e!==null&&Ii(t,e),t=hc(t,r),t.flags|=4096;return t}return e=mi(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function vc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(i(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function yc(e,t,n,r,i){return ia(t),n=R(e,t,n,r,void 0,i),r=jo(),e!==null&&!sc?(Mo(e,t,i),Nc(e,t,i)):(F&&r&&Pi(t),t.flags|=1,cc(e,t,n,i),t.child)}function bc(e,t,n,r,i,a){return ia(t),t.updateQueue=null,n=ko(t,r,n,i),Oo(e),r=jo(),e!==null&&!sc?(Mo(e,t,a),Nc(e,t,a)):(F&&r&&Pi(t),t.flags|=1,cc(e,t,n,a),t.child)}function xc(e,t,n,r,i){if(ia(t),t.stateNode===null){var a=ui,o=n.contextType;typeof o==`object`&&o&&(a=aa(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=qs,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},Wa(t),o=n.contextType,a.context=typeof o==`object`&&o?aa(o):ui,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(Ks(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&qs.enqueueReplaceState(a,a.state,null),Qa(t,r,a,i),Za(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=Xs(n,s);a.props=c;var l=a.context,u=n.contextType;o=ui,typeof u==`object`&&u&&(o=aa(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&Ys(t,a,r,o),Ua=!1;var f=t.memoizedState;a.state=f,Qa(t,r,a,i),Za(),l=t.memoizedState,s||f!==l||Ua?(typeof d==`function`&&(Ks(t,n,d,r),l=t.memoizedState),(c=Ua||Js(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,Ga(e,t),o=t.memoizedProps,u=Xs(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=ui,typeof l==`object`&&l&&(c=aa(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&Ys(t,a,r,c),Ua=!1,f=t.memoizedState,a.state=f,Qa(t,r,a,i),Za();var p=t.memoizedState;o!==d||f!==p||Ua||e!==null&&e.dependencies!==null&&ra(e.dependencies)?(typeof s==`function`&&(Ks(t,n,s,r),p=t.memoizedState),(u=Ua||Js(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&ra(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,vc(e,t),r=(t.flags&128)!=0,a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=Va(t,e.child,null,i),t.child=Va(t,null,n,i)):cc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=Nc(e,t,i),e}function Sc(e,t,n,r){return Ki(),t.flags|=256,cc(e,t,n,r),t.child}var Cc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function wc(e){return{baseLanes:e,cachePool:wa()}}function Tc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=eu),e}function Ec(e,t,n){var r=t.pendingProps,a=!1,o=(t.flags&128)!=0,s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:(mo.current&2)!=0),s&&(a=!0,t.flags&=-129),s=(t.flags&32)!=0,t.flags&=-33,e===null){if(F){if(a?co(t):fo(t),(e=Ri)?(e=rf(e,Bi),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ki===null?null:{id:Ai,overflow:ji},retryLane:536870912,hydrationErrors:null},n=yi(e),n.return=t,t.child=n,Li=t,Ri=null)):e=null,e===null)throw Hi(t);return of(e)?t.lanes=32:t.lanes=536870912,null}var c=r.children;return r=r.fallback,a?(fo(t),a=t.mode,c=Oc({mode:`hidden`,children:c},a),r=_i(r,a,n,null),c.return=t,r.return=t,c.sibling=r,t.child=c,r=t.child,r.memoizedState=wc(n),r.childLanes=Tc(e,s,n),t.memoizedState=Cc,pc(null,r)):(co(t),Dc(t,c))}var l=e.memoizedState;if(l!==null&&(c=l.dehydrated,c!==null)){if(o)t.flags&256?(co(t),t.flags&=-257,t=kc(e,t,n)):t.memoizedState===null?(fo(t),c=r.fallback,a=t.mode,r=Oc({mode:`visible`,children:r.children},a),c=_i(c,a,n,null),c.flags|=2,r.return=t,c.return=t,r.sibling=c,t.child=r,Va(t,e.child,null,n),r=t.child,r.memoizedState=wc(n),r.childLanes=Tc(e,s,n),t.memoizedState=Cc,t=pc(null,r)):(fo(t),t.child=e.child,t.flags|=128,t=null);else if(co(t),of(c)){if(s=c.nextSibling&&c.nextSibling.dataset,s)var u=s.dgst;s=u,r=Error(i(419)),r.stack=``,r.digest=s,Ji({value:r,source:null,stack:null}),t=kc(e,t,n)}else if(sc||na(e,t,n,!1),s=(n&e.childLanes)!==0,sc||s){if(s=Wl,s!==null&&(r=st(s,n),r!==0&&r!==l.retryLane))throw l.retryLane=r,si(e,r),yu(s,e,r),oc;af(c)||ju(),t=kc(e,t,n)}else af(c)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,Ri=cf(c.nextSibling),Li=t,F=!0,zi=null,Bi=!1,e!==null&&Ii(t,e),t=Dc(t,r.children),t.flags|=4096);return t}return a?(fo(t),c=r.fallback,a=t.mode,l=e.child,u=l.sibling,r=mi(l,{mode:`hidden`,children:r.children}),r.subtreeFlags=l.subtreeFlags&65011712,u===null?(c=_i(c,a,n,null),c.flags|=2):c=mi(u,c),c.return=t,r.return=t,r.sibling=c,t.child=r,pc(null,r),r=t.child,c=e.child.memoizedState,c===null?c=wc(n):(a=c.cachePool,a===null?a=wa():(l=da._currentValue,a=a.parent===l?a:{parent:l,pool:l}),c={baseLanes:c.baseLanes|n,cachePool:a}),r.memoizedState=c,r.childLanes=Tc(e,s,n),t.memoizedState=Cc,pc(e.child,r)):(co(t),n=e.child,e=n.sibling,n=mi(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(s=t.deletions,s===null?(t.deletions=[e],t.flags|=16):s.push(e)),t.child=n,t.memoizedState=null,n)}function Dc(e,t){return t=Oc({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function Oc(e,t){return e=fi(22,e,null,t),e.lanes=0,e}function kc(e,t,n){return Va(t,e.child,null,n),e=Dc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Ac(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),ea(e.return,t,n)}function jc(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function Mc(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=mo.current,s=(o&2)!=0;if(s?(o=o&1|2,t.flags|=128):o&=1,D(mo,o),cc(e,t,r,n),r=F?Ei:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Ac(e,n,t);else if(e.tag===19)Ac(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`forwards`:for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&ho(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),jc(t,!1,i,n,a,r);break;case`backwards`:case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&ho(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}jc(t,!0,n,null,a,r);break;case`together`:jc(t,!1,null,null,void 0,r);break;default:t.memoizedState=null}return t.child}function Nc(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Zl|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(na(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=mi(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=mi(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function B(e,t){return(e.lanes&t)===0?(e=e.dependencies,!!(e!==null&&ra(e))):!0}function Pc(e,t,n){switch(t.tag){case 3:ge(t,t.stateNode.containerInfo),Qi(t,da,e.memoizedState.cache),Ki();break;case 27:case 5:ve(t);break;case 4:ge(t,t.stateNode.containerInfo);break;case 10:Qi(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,lo(t),null;break;case 13:var r=t.memoizedState;if(r!==null)return r.dehydrated===null?(n&t.child.childLanes)===0?(co(t),e=Nc(e,t,n),e===null?null:e.sibling):Ec(e,t,n):(co(t),t.flags|=128,null);co(t);break;case 19:var i=(e.flags&128)!=0;if(r=(n&t.childLanes)!==0,r||=(na(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return Mc(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),D(mo,mo.current),r)break;return null;case 22:return t.lanes=0,fc(e,t,n,t.pendingProps);case 24:Qi(t,da,e.memoizedState.cache)}return Nc(e,t,n)}function Fc(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)sc=!0;else{if(!B(e,n)&&!(t.flags&128))return sc=!1,Pc(e,t,n);sc=!!(e.flags&131072)}else sc=!1,F&&t.flags&1048576&&Ni(t,Ei,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=ja(t.elementType),t.type=e,typeof e==`function`)pi(e)?(r=Xs(e,r),t.tag=1,t=xc(null,t,e,r,n)):(t.tag=0,t=yc(null,t,e,r,n));else{if(e!=null){var a=e.$$typeof;if(a===x){t.tag=11,t=lc(null,t,e,r,n);break a}else if(a===C){t.tag=14,t=uc(null,t,e,r,n);break a}}throw t=oe(e)||e,Error(i(306,t,``))}}return t;case 0:return yc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,a=Xs(r,t.pendingProps),xc(e,t,r,a,n);case 3:a:{if(ge(t,t.stateNode.containerInfo),e===null)throw Error(i(387));r=t.pendingProps;var o=t.memoizedState;a=o.element,Ga(e,t),Qa(t,r,null,n);var s=t.memoizedState;if(r=s.cache,Qi(t,da,r),r!==o.cache&&ta(t,[da],n,!0),Za(),r=s.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=Sc(e,t,r,n);break a}else if(r!==a){a=Si(Error(i(424)),t),Ji(a),t=Sc(e,t,r,n);break a}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(Ri=cf(e.firstChild),Li=t,F=!0,zi=null,Bi=!0,n=Ha(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(Ki(),r===a){t=Nc(e,t,n);break a}cc(e,t,r,n)}t=t.child}return t;case 26:return vc(e,t),e===null?(n=kf(t.type,null,t.pendingProps,null))?t.memoizedState=n:F||(n=t.type,e=t.pendingProps,r=Bd(O.current).createElement(n),r[pt]=t,r[mt]=e,$(r,n,e),A(r),t.stateNode=r):t.memoizedState=kf(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return ve(t),e===null&&F&&(r=t.stateNode=ff(t.type,t.pendingProps,O.current),Li=t,Bi=!0,a=Ri,Zd(t.type)?(lf=a,Ri=cf(r.firstChild)):Ri=a),cc(e,t,t.pendingProps.children,n),vc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&F&&((a=r=Ri)&&(r=tf(r,t.type,t.pendingProps,Bi),r===null?a=!1:(t.stateNode=r,Li=t,Ri=cf(r.firstChild),Bi=!1,a=!0)),a||Hi(t)),ve(t),a=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,Ud(a,o)?r=null:s!==null&&Ud(a,s)&&(t.flags|=32),t.memoizedState!==null&&(a=R(e,t,Ao,null,null,n),Qf._currentValue=a),vc(e,t),cc(e,t,r,n),t.child;case 6:return e===null&&F&&((e=n=Ri)&&(n=nf(n,t.pendingProps,Bi),n===null?e=!1:(t.stateNode=n,Li=t,Ri=null,e=!0)),e||Hi(t)),null;case 13:return Ec(e,t,n);case 4:return ge(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Va(t,null,r,n):cc(e,t,r,n),t.child;case 11:return lc(e,t,t.type,t.pendingProps,n);case 7:return cc(e,t,t.pendingProps,n),t.child;case 8:return cc(e,t,t.pendingProps.children,n),t.child;case 12:return cc(e,t,t.pendingProps.children,n),t.child;case 10:return r=t.pendingProps,Qi(t,t.type,r.value),cc(e,t,r.children,n),t.child;case 9:return a=t.type._context,r=t.pendingProps.children,ia(t),a=aa(a),r=r(a),t.flags|=1,cc(e,t,r,n),t.child;case 14:return uc(e,t,t.type,t.pendingProps,n);case 15:return dc(e,t,t.type,t.pendingProps,n);case 19:return Mc(e,t,n);case 31:return _c(e,t,n);case 22:return fc(e,t,n,t.pendingProps);case 24:return ia(t),r=aa(da),e===null?(a=Sa(),a===null&&(a=Wl,o=fa(),a.pooledCache=o,o.refCount++,o!==null&&(a.pooledCacheLanes|=n),a=o),t.memoizedState={parent:r,cache:a},Wa(t),Qi(t,da,a)):((e.lanes&n)!==0&&(Ga(e,t),Qa(t,null,null,n),Za()),a=e.memoizedState,o=t.memoizedState,a.parent===r?(r=o.cache,Qi(t,da,r),r!==a.cache&&ta(t,[da],n,!0)):(a={parent:r,cache:r},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),Qi(t,da,r))),cc(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(i(156,t.tag))}function Ic(e){e.flags|=4}function Lc(e,t,n,r,i){if((t=(e.mode&32)!=0)&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i)if(e.stateNode.complete)e.flags|=8192;else if(Ou())e.flags|=8192;else throw Ma=Oa,Ea}else e.flags&=-16777217}function Rc(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Wf(t))if(Ou())e.flags|=8192;else throw Ma=Oa,Ea}function zc(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:tt(),e.lanes|=t,tu|=t)}function Bc(e,t){if(!F)switch(e.tailMode){case`hidden`:t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case`collapsed`:n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Vc(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&65011712,r|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Hc(e,t,n){var r=t.pendingProps;switch(Fi(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Vc(t),null;case 1:return Vc(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),$i(da),_e(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Gi(t)?Ic(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,qi())),Vc(t),null;case 26:var a=t.type,o=t.memoizedState;return e===null?(Ic(t),o===null?(Vc(t),Lc(t,a,null,r,n)):(Vc(t),Rc(t,o))):o?o===e.memoizedState?(Vc(t),t.flags&=-16777217):(Ic(t),Vc(t),Rc(t,o)):(e=e.memoizedProps,e!==r&&Ic(t),Vc(t),Lc(t,a,e,r,n)),null;case 27:if(ye(t),n=O.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Ic(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Vc(t),null}e=pe.current,Gi(t)?Ui(t,e):(e=ff(a,r,n),t.stateNode=e,Ic(t))}return Vc(t),null;case 5:if(ye(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Ic(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Vc(t),null}if(o=pe.current,Gi(t))Ui(t,o);else{var s=Bd(O.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;default:switch(a){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(a,{is:r.is}):s.createElement(a)}}o[pt]=t,o[mt]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch($(o,a,r),a){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&Ic(t)}}return Vc(t),Lc(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&Ic(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(i(166));if(e=O.current,Gi(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,a=Li,a!==null)switch(a.tag){case 27:case 5:r=a.memoizedProps}e[pt]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||Z(e.nodeValue,n)),e||Hi(t,!0)}else e=Bd(e).createTextNode(r),e[pt]=t,t.stateNode=e}return Vc(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=Gi(t),n!==null){if(e===null){if(!r)throw Error(i(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(557));e[pt]=t}else Ki(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Vc(t),e=!1}else n=qi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(po(t),t):(po(t),null);if(t.flags&128)throw Error(i(558))}return Vc(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=Gi(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a===null?null:a.dehydrated,!a)throw Error(i(317));a[pt]=t}else Ki(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Vc(t),a=!1}else a=qi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(po(t),t):(po(t),null)}return po(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,a=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(a=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==a&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),zc(t,t.updateQueue),Vc(t),null);case 4:return _e(),e===null&&wd(t.stateNode.containerInfo),Vc(t),null;case 10:return $i(t.type),Vc(t),null;case 19:if(fe(mo),r=t.memoizedState,r===null)return Vc(t),null;if(a=(t.flags&128)!=0,o=r.rendering,o===null)if(a)Bc(r,!1);else{if(Xl!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=ho(e),o!==null){for(t.flags|=128,Bc(r,!1),e=o.updateQueue,t.updateQueue=e,zc(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)hi(n,e),n=n.sibling;return D(mo,mo.current&1|2),F&&Mi(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Me()>K&&(t.flags|=128,a=!0,Bc(r,!1),t.lanes=4194304)}else{if(!a)if(e=ho(o),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,zc(t,e),Bc(r,!0),r.tail===null&&r.tailMode===`hidden`&&!o.alternate&&!F)return Vc(t),null}else 2*Me()-r.renderingStartTime>K&&n!==536870912&&(t.flags|=128,a=!0,Bc(r,!1),t.lanes=4194304);r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}return r.tail===null?(Vc(t),null):(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Me(),e.sibling=null,n=mo.current,D(mo,a?n&1|2:n&1),F&&Mi(t,r.treeForkCount),e);case 22:case 23:return po(t),ao(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(Vc(t),t.subtreeFlags&6&&(t.flags|=8192)):Vc(t),n=t.updateQueue,n!==null&&zc(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&fe(xa),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),$i(da),Vc(t),null;case 25:return null;case 30:return null}throw Error(i(156,t.tag))}function Uc(e,t){switch(Fi(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return $i(da),_e(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return ye(t),null;case 31:if(t.memoizedState!==null){if(po(t),t.alternate===null)throw Error(i(340));Ki()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(po(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));Ki()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return fe(mo),null;case 4:return _e(),null;case 10:return $i(t.type),null;case 22:case 23:return po(t),ao(),e!==null&&fe(xa),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return $i(da),null;case 25:return null;default:return null}}function Wc(e,t){switch(Fi(t),t.tag){case 3:$i(da),_e();break;case 26:case 27:case 5:ye(t);break;case 4:_e();break;case 31:t.memoizedState!==null&&po(t);break;case 13:po(t);break;case 19:fe(mo);break;case 10:$i(t.type);break;case 22:case 23:po(t),ao(),e!==null&&fe(xa);break;case 24:$i(da)}}function Gc(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){J(t,t.return,e)}}function Kc(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){J(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){J(t,t.return,e)}}function qc(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{eo(t,n)}catch(t){J(e,e.return,t)}}}function Jc(e,t,n){n.props=Xs(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){J(e,t,n)}}function Yc(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){J(e,t,n)}}function Xc(e,t){var n=e.ref,r=e.refCleanup;if(n!==null)if(typeof r==`function`)try{r()}catch(n){J(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){J(e,t,n)}else n.current=null}function Zc(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){J(e,e.return,t)}}function Qc(e,t,n){try{var r=e.stateNode;Fd(r,e.type,n,t),r[mt]=t}catch(t){J(e,e.return,t)}}function $c(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Zd(e.type)||e.tag===4}function el(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||$c(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Zd(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function tl(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=on));else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(tl(e,t,n),e=e.sibling;e!==null;)tl(e,t,n),e=e.sibling}function nl(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(nl(e,t,n),e=e.sibling;e!==null;)nl(e,t,n),e=e.sibling}function rl(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);$(t,r,n),t[pt]=e,t[mt]=n}catch(t){J(e,e.return,t)}}var il=!1,al=!1,ol=!1,sl=typeof WeakSet==`function`?WeakSet:Set,cl=null;function ll(e,t){if(e=e.containerInfo,Rd=sp,e=jr(e),Mr(e)){if(`selectionStart`in e)var n={start:e.selectionStart,end:e.selectionEnd};else a:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var a=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==n||a!==0&&f.nodeType!==3||(c=s+a),f!==o||r!==0&&f.nodeType!==3||(l=s+r),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===n&&++u===a&&(c=s),p===o&&++d===r&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n||={start:0,end:0}}else n=null;for(zd={focusedElem:e,selectionRange:n},sp=!1,cl=t;cl!==null;)if(t=cl,e=t.child,t.subtreeFlags&1028&&e!==null)e.return=t,cl=e;else for(;cl!==null;){switch(t=cl,o=t.alternate,e=t.flags,t.tag){case 0:if(e&4&&(e=t.updateQueue,e=e===null?null:e.events,e!==null))for(n=0;n<e.length;n++)a=e[n],a.ref.impl=a.nextImpl;break;case 11:case 15:break;case 1:if(e&1024&&o!==null){e=void 0,n=t,a=o.memoizedProps,o=o.memoizedState,r=n.stateNode;try{var h=Xs(n.type,a);e=r.getSnapshotBeforeUpdate(h,o),r.__reactInternalSnapshotBeforeUpdate=e}catch(e){J(n,n.return,e)}}break;case 3:if(e&1024){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)ef(e);else if(n===1)switch(e.nodeName){case`HEAD`:case`HTML`:case`BODY`:ef(e);break;default:e.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if(e&1024)throw Error(i(163))}if(e=t.sibling,e!==null){e.return=t.return,cl=e;break}cl=t.return}}function ul(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:Tl(e,n),r&4&&Gc(5,n);break;case 1:if(Tl(e,n),r&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){J(n,n.return,e)}else{var i=Xs(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){J(n,n.return,e)}}r&64&&qc(n),r&512&&Yc(n,n.return);break;case 3:if(Tl(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{eo(e,t)}catch(e){J(n,n.return,e)}}break;case 27:t===null&&r&4&&rl(n);case 26:case 5:Tl(e,n),t===null&&r&4&&Zc(n),r&512&&Yc(n,n.return);break;case 12:Tl(e,n);break;case 31:Tl(e,n),r&4&&gl(e,n);break;case 13:Tl(e,n),r&4&&_l(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=Zu.bind(null,n),sf(e,n))));break;case 22:if(r=n.memoizedState!==null||il,!r){t=t!==null&&t.memoizedState!==null||al,i=il;var a=al;il=r,(al=t)&&!a?Dl(e,n,(n.subtreeFlags&8772)!=0):Tl(e,n),il=i,al=a}break;case 30:break;default:Tl(e,n)}}function dl(e){var t=e.alternate;t!==null&&(e.alternate=null,dl(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&bt(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var fl=null,pl=!1;function ml(e,t,n){for(n=n.child;n!==null;)hl(e,t,n),n=n.sibling}function hl(e,t,n){if(He&&typeof He.onCommitFiberUnmount==`function`)try{He.onCommitFiberUnmount(Ve,n)}catch{}switch(n.tag){case 26:al||Xc(n,t),ml(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:al||Xc(n,t);var r=fl,i=pl;Zd(n.type)&&(fl=n.stateNode,pl=!1),ml(e,t,n),pf(n.stateNode),fl=r,pl=i;break;case 5:al||Xc(n,t);case 6:if(r=fl,i=pl,fl=null,ml(e,t,n),fl=r,pl=i,fl!==null)if(pl)try{(fl.nodeType===9?fl.body:fl.nodeName===`HTML`?fl.ownerDocument.body:fl).removeChild(n.stateNode)}catch(e){J(n,t,e)}else try{fl.removeChild(n.stateNode)}catch(e){J(n,t,e)}break;case 18:fl!==null&&(pl?(e=fl,Qd(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Np(e)):Qd(fl,n.stateNode));break;case 4:r=fl,i=pl,fl=n.stateNode.containerInfo,pl=!0,ml(e,t,n),fl=r,pl=i;break;case 0:case 11:case 14:case 15:Kc(2,n,t),al||Kc(4,n,t),ml(e,t,n);break;case 1:al||(Xc(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&Jc(n,t,r)),ml(e,t,n);break;case 21:ml(e,t,n);break;case 22:al=(r=al)||n.memoizedState!==null,ml(e,t,n),al=r;break;default:ml(e,t,n)}}function gl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Np(e)}catch(e){J(t,t.return,e)}}}function _l(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Np(e)}catch(e){J(t,t.return,e)}}function vl(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new sl),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new sl),t;default:throw Error(i(435,e.tag))}}function yl(e,t){var n=vl(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=Qu.bind(null,e,t);t.then(r,r)}})}function bl(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var a=n[r],o=e,s=t,c=s;a:for(;c!==null;){switch(c.tag){case 27:if(Zd(c.type)){fl=c.stateNode,pl=!1;break a}break;case 5:fl=c.stateNode,pl=!1;break a;case 3:case 4:fl=c.stateNode.containerInfo,pl=!0;break a}c=c.return}if(fl===null)throw Error(i(160));hl(o,s,a),fl=null,pl=!1,o=a.alternate,o!==null&&(o.return=null),a.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Sl(t,e),t=t.sibling}var xl=null;function Sl(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:bl(t,e),Cl(e),r&4&&(Kc(3,e,e.return),Gc(3,e),Kc(5,e,e.return));break;case 1:bl(t,e),Cl(e),r&512&&(al||n===null||Xc(n,n.return)),r&64&&il&&(e=e.updateQueue,e!==null&&(r=e.callbacks,r!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?r:n.concat(r))));break;case 26:var a=xl;if(bl(t,e),Cl(e),r&512&&(al||n===null||Xc(n,n.return)),r&4){var o=n===null?null:n.memoizedState;if(r=e.memoizedState,n===null)if(r===null)if(e.stateNode===null){a:{r=e.type,n=e.memoizedProps,a=a.ownerDocument||a;b:switch(r){case`title`:o=a.getElementsByTagName(`title`)[0],(!o||o[yt]||o[pt]||o.namespaceURI===`http://www.w3.org/2000/svg`||o.hasAttribute(`itemprop`))&&(o=a.createElement(r),a.head.insertBefore(o,a.querySelector(`head > title`))),$(o,r,n),o[pt]=e,A(o),r=o;break a;case`link`:var s=Vf(`link`,`href`,a).get(r+(n.href||``));if(s){for(var c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&o.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&o.getAttribute(`title`)===(n.title==null?null:n.title)&&o.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){s.splice(c,1);break b}}o=a.createElement(r),$(o,r,n),a.head.appendChild(o);break;case`meta`:if(s=Vf(`meta`,`content`,a).get(r+(n.content||``))){for(c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`content`)===(n.content==null?null:``+n.content)&&o.getAttribute(`name`)===(n.name==null?null:n.name)&&o.getAttribute(`property`)===(n.property==null?null:n.property)&&o.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){s.splice(c,1);break b}}o=a.createElement(r),$(o,r,n),a.head.appendChild(o);break;default:throw Error(i(468,r))}o[pt]=e,A(o),r=o}e.stateNode=r}else Hf(a,e.type,e.stateNode);else e.stateNode=If(a,r,e.memoizedProps);else o===r?r===null&&e.stateNode!==null&&Qc(e,e.memoizedProps,n.memoizedProps):(o===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):o.count--,r===null?Hf(a,e.type,e.stateNode):If(a,r,e.memoizedProps))}break;case 27:bl(t,e),Cl(e),r&512&&(al||n===null||Xc(n,n.return)),n!==null&&r&4&&Qc(e,e.memoizedProps,n.memoizedProps);break;case 5:if(bl(t,e),Cl(e),r&512&&(al||n===null||Xc(n,n.return)),e.flags&32){a=e.stateNode;try{Jt(a,``)}catch(t){J(e,e.return,t)}}r&4&&e.stateNode!=null&&(a=e.memoizedProps,Qc(e,a,n===null?a:n.memoizedProps)),r&1024&&(ol=!0);break;case 6:if(bl(t,e),Cl(e),r&4){if(e.stateNode===null)throw Error(i(162));r=e.memoizedProps,n=e.stateNode;try{n.nodeValue=r}catch(t){J(e,e.return,t)}}break;case 3:if(Bf=null,a=xl,xl=gf(t.containerInfo),bl(t,e),xl=a,Cl(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Np(t.containerInfo)}catch(t){J(e,e.return,t)}ol&&(ol=!1,wl(e));break;case 4:r=xl,xl=gf(e.stateNode.containerInfo),bl(t,e),Cl(e),xl=r;break;case 12:bl(t,e),Cl(e);break;case 31:bl(t,e),Cl(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,yl(e,r)));break;case 13:bl(t,e),Cl(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(au=Me()),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,yl(e,r)));break;case 22:a=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,u=il,d=al;if(il=u||a,al=d||l,bl(t,e),al=d,il=u,Cl(e),r&8192)a:for(t=e.stateNode,t._visibility=a?t._visibility&-2:t._visibility|1,a&&(n===null||l||il||al||El(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(o=l.stateNode,a)s=o.style,typeof s.setProperty==`function`?s.setProperty(`display`,`none`,`important`):s.display=`none`;else{c=l.stateNode;var f=l.memoizedProps.style,p=f!=null&&f.hasOwnProperty(`display`)?f.display:null;c.style.display=p==null||typeof p==`boolean`?``:(``+p).trim()}}catch(e){J(l,l.return,e)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=a?``:l.memoizedProps}catch(e){J(l,l.return,e)}}}else if(t.tag===18){if(n===null){l=t;try{var m=l.stateNode;a?$d(m,!0):$d(l.stateNode,!1)}catch(e){J(l,l.return,e)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break a;for(;t.sibling===null;){if(t.return===null||t.return===e)break a;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}r&4&&(r=e.updateQueue,r!==null&&(n=r.retryQueue,n!==null&&(r.retryQueue=null,yl(e,n))));break;case 19:bl(t,e),Cl(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,yl(e,r)));break;case 30:break;case 21:break;default:bl(t,e),Cl(e)}}function Cl(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if($c(r)){n=r;break}r=r.return}if(n==null)throw Error(i(160));switch(n.tag){case 27:var a=n.stateNode;nl(e,el(e),a);break;case 5:var o=n.stateNode;n.flags&32&&(Jt(o,``),n.flags&=-33),nl(e,el(e),o);break;case 3:case 4:var s=n.stateNode.containerInfo;tl(e,el(e),s);break;default:throw Error(i(161))}}catch(t){J(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function wl(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;wl(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function Tl(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)ul(e,t.alternate,t),t=t.sibling}function El(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Kc(4,t,t.return),El(t);break;case 1:Xc(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount==`function`&&Jc(t,t.return,n),El(t);break;case 27:pf(t.stateNode);case 26:case 5:Xc(t,t.return),El(t);break;case 22:t.memoizedState===null&&El(t);break;case 30:El(t);break;default:El(t)}e=e.sibling}}function Dl(e,t,n){for(n&&=(t.subtreeFlags&8772)!=0,t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags;switch(a.tag){case 0:case 11:case 15:Dl(i,a,n),Gc(4,a);break;case 1:if(Dl(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){J(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var s=r.stateNode;try{var c=i.shared.hiddenCallbacks;if(c!==null)for(i.shared.hiddenCallbacks=null,i=0;i<c.length;i++)$a(c[i],s)}catch(e){J(r,r.return,e)}}n&&o&64&&qc(a),Yc(a,a.return);break;case 27:rl(a);case 26:case 5:Dl(i,a,n),n&&r===null&&o&4&&Zc(a),Yc(a,a.return);break;case 12:Dl(i,a,n);break;case 31:Dl(i,a,n),n&&o&4&&gl(i,a);break;case 13:Dl(i,a,n),n&&o&4&&_l(i,a);break;case 22:a.memoizedState===null&&Dl(i,a,n),Yc(a,a.return);break;case 30:break;default:Dl(i,a,n)}t=t.sibling}}function Ol(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&pa(n))}function kl(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&pa(e))}function Al(e,t,n,r){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)jl(e,t,n,r),t=t.sibling}function jl(e,t,n,r){var i=t.flags;switch(t.tag){case 0:case 11:case 15:Al(e,t,n,r),i&2048&&Gc(9,t);break;case 1:Al(e,t,n,r);break;case 3:Al(e,t,n,r),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&pa(e)));break;case 12:if(i&2048){Al(e,t,n,r),e=t.stateNode;try{var a=t.memoizedProps,o=a.id,s=a.onPostCommit;typeof s==`function`&&s(o,t.alternate===null?`mount`:`update`,e.passiveEffectDuration,-0)}catch(e){J(t,t.return,e)}}else Al(e,t,n,r);break;case 31:Al(e,t,n,r);break;case 13:Al(e,t,n,r);break;case 23:break;case 22:a=t.stateNode,o=t.alternate,t.memoizedState===null?a._visibility&2?Al(e,t,n,r):(a._visibility|=2,Ml(e,t,n,r,(t.subtreeFlags&10256)!=0||!1)):a._visibility&2?Al(e,t,n,r):Nl(e,t),i&2048&&Ol(o,t);break;case 24:Al(e,t,n,r),i&2048&&kl(t.alternate,t);break;default:Al(e,t,n,r)}}function Ml(e,t,n,r,i){for(i&&=(t.subtreeFlags&10256)!=0||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:Ml(a,o,s,c,i),Gc(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,Ml(a,o,s,c,i)):u._visibility&2?Ml(a,o,s,c,i):Nl(a,o),i&&l&2048&&Ol(o.alternate,o);break;case 24:Ml(a,o,s,c,i),i&&l&2048&&kl(o.alternate,o);break;default:Ml(a,o,s,c,i)}t=t.sibling}}function Nl(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:Nl(n,r),i&2048&&Ol(r.alternate,r);break;case 24:Nl(n,r),i&2048&&kl(r.alternate,r);break;default:Nl(n,r)}t=t.sibling}}var Pl=8192;function Fl(e,t,n){if(e.subtreeFlags&Pl)for(e=e.child;e!==null;)Il(e,t,n),e=e.sibling}function Il(e,t,n){switch(e.tag){case 26:Fl(e,t,n),e.flags&Pl&&e.memoizedState!==null&&Gf(n,xl,e.memoizedState,e.memoizedProps);break;case 5:Fl(e,t,n);break;case 3:case 4:var r=xl;xl=gf(e.stateNode.containerInfo),Fl(e,t,n),xl=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Pl,Pl=16777216,Fl(e,t,n),Pl=r):Fl(e,t,n));break;default:Fl(e,t,n)}}function Ll(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Rl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];cl=r,Vl(r,e)}Ll(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)zl(e),e=e.sibling}function zl(e){switch(e.tag){case 0:case 11:case 15:Rl(e),e.flags&2048&&Kc(9,e,e.return);break;case 3:Rl(e);break;case 12:Rl(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Bl(e)):Rl(e);break;default:Rl(e)}}function Bl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];cl=r,Vl(r,e)}Ll(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Kc(8,t,t.return),Bl(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Bl(t));break;default:Bl(t)}e=e.sibling}}function Vl(e,t){for(;cl!==null;){var n=cl;switch(n.tag){case 0:case 11:case 15:Kc(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:pa(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,cl=r;else a:for(n=e;cl!==null;){r=cl;var i=r.sibling,a=r.return;if(dl(r),r===n){cl=null;break a}if(i!==null){i.return=a,cl=i;break a}cl=a}}}var Hl={getCacheForType:function(e){var t=aa(da),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return aa(da).controller.signal}},Ul=typeof WeakMap==`function`?WeakMap:Map,V=0,Wl=null,H=null,U=0,W=0,Gl=null,Kl=!1,ql=!1,Jl=!1,Yl=0,Xl=0,Zl=0,Ql=0,$l=0,eu=0,tu=0,nu=null,ru=null,iu=!1,au=0,G=0,K=1/0,ou=null,su=null,cu=0,lu=null,uu=null,du=0,fu=0,pu=null,mu=null,hu=0,gu=null;function _u(){return V&2&&U!==0?U&-U:T.T===null?ut():pd()}function vu(){if(eu===0)if(!(U&536870912)||F){var e=Ye;Ye<<=1,!(Ye&3932160)&&(Ye=262144),eu=e}else eu=536870912;return e=oo.current,e!==null&&(e.flags|=32),eu}function yu(e,t,n){(e===Wl&&(W===2||W===9)||e.cancelPendingCommit!==null)&&(Eu(e,0),Cu(e,U,eu,!1)),rt(e,n),(!(V&2)||e!==Wl)&&(e===Wl&&(!(V&2)&&(Ql|=n),Xl===4&&Cu(e,U,eu,!1)),ad(e))}function bu(e,t,n){if(V&6)throw Error(i(327));var r=!n&&(t&127)==0&&(t&e.expiredLanes)===0||$e(e,t),a=r?Pu(e,t):Mu(e,t,!0),o=r;do{if(a===0){ql&&!r&&Cu(e,t,0,!1);break}else{if(n=e.current.alternate,o&&!Su(n)){a=Mu(e,t,!1),o=!1;continue}if(a===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;a=nu;var l=c.current.memoizedState.isDehydrated;if(l&&(Eu(c,s).flags|=256),s=Mu(c,s,!1),s!==2){if(Jl&&!l){c.errorRecoveryDisabledLanes|=o,Ql|=o,a=4;break a}o=ru,ru=a,o!==null&&(ru===null?ru=o:ru.push.apply(ru,o))}a=s}if(o=!1,a!==2)continue}}if(a===1){Eu(e,0),Cu(e,t,0,!0);break}a:{switch(r=e,o=a,o){case 0:case 1:throw Error(i(345));case 4:if((t&4194048)!==t)break;case 6:Cu(r,t,eu,!Kl);break a;case 2:ru=null;break;case 3:case 5:break;default:throw Error(i(329))}if((t&62914560)===t&&(a=au+300-Me(),10<a)){if(Cu(r,t,eu,!Kl),Qe(r,0,!0)!==0)break a;du=t,r.timeoutHandle=Kd(xu.bind(null,r,n,ru,ou,iu,t,eu,Ql,tu,Kl,o,`Throttled`,-0,0),a);break a}xu(r,n,ru,ou,iu,t,eu,Ql,tu,Kl,o,null,-0,0)}}break}while(1);ad(e)}function xu(e,t,n,r,i,a,o,s,c,l,u,d,f,p){if(e.timeoutHandle=-1,d=t.subtreeFlags,d&8192||(d&16785408)==16785408){d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:on},Il(t,a,d);var m=(a&62914560)===a?au-Me():(a&4194048)===a?G-Me():0;if(m=qf(d,m),m!==null){du=a,e.cancelPendingCommit=m(q.bind(null,e,t,a,n,r,i,o,s,c,u,d,null,f,p)),Cu(e,a,o,!l);return}}q(e,t,a,n,r,i,o,s,c)}function Su(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!Er(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Cu(e,t,n,r){t&=~$l,t&=~Ql,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-We(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&at(e,n,t)}function wu(){return V&6?!0:(od(0,!1),!1)}function Tu(){if(H!==null){if(W===0)var e=H.return;else e=H,Zi=Xi=null,No(e),Fa=null,Ia=0,e=H;for(;e!==null;)Wc(e.alternate,e),e=e.return;H=null}}function Eu(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,qd(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),du=0,Tu(),Wl=e,H=n=mi(e.current,null),U=t,W=0,Gl=null,Kl=!1,ql=$e(e,t),Jl=!1,tu=eu=$l=Ql=Zl=Xl=0,ru=nu=null,iu=!1,t&8&&(t|=t&32);var r=e.entangledLanes;if(r!==0)for(e=e.entanglements,r&=t;0<r;){var i=31-We(r),a=1<<i;t|=e[i],r&=~a}return Yl=t,ii(),n}function Du(e,t){L=null,T.H=Hs,t===Ta||t===Da?(t=Na(),W=3):t===Ea?(t=Na(),W=4):W=t===oc?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,Gl=t,H===null&&(Xl=1,ec(e,Si(t,e.current)))}function Ou(){var e=oo.current;return e===null?!0:(U&4194048)===U?so===null:(U&62914560)===U||U&536870912?e===so:!1}function ku(){var e=T.H;return T.H=Hs,e===null?Hs:e}function Au(){var e=T.A;return T.A=Hl,e}function ju(){Xl=4,Kl||(U&4194048)!==U&&oo.current!==null||(ql=!0),!(Zl&134217727)&&!(Ql&134217727)||Wl===null||Cu(Wl,U,eu,!1)}function Mu(e,t,n){var r=V;V|=2;var i=ku(),a=Au();(Wl!==e||U!==t)&&(ou=null,Eu(e,t)),t=!1;var o=Xl;a:do try{if(W!==0&&H!==null){var s=H,c=Gl;switch(W){case 8:Tu(),o=6;break a;case 3:case 2:case 9:case 6:oo.current===null&&(t=!0);var l=W;if(W=0,Gl=null,Ru(e,s,c,l),n&&ql){o=0;break a}break;default:l=W,W=0,Gl=null,Ru(e,s,c,l)}}Nu(),o=Xl;break}catch(t){Du(e,t)}while(1);return t&&e.shellSuspendCounter++,Zi=Xi=null,V=r,T.H=i,T.A=a,H===null&&(Wl=null,U=0,ii()),o}function Nu(){for(;H!==null;)Iu(H)}function Pu(e,t){var n=V;V|=2;var r=ku(),a=Au();Wl!==e||U!==t?(ou=null,K=Me()+500,Eu(e,t)):ql=$e(e,t);a:do try{if(W!==0&&H!==null){t=H;var o=Gl;b:switch(W){case 1:W=0,Gl=null,Ru(e,t,o,1);break;case 2:case 9:if(ka(o)){W=0,Gl=null,Lu(t);break}t=function(){W!==2&&W!==9||Wl!==e||(W=7),ad(e)},o.then(t,t);break a;case 3:W=7;break a;case 4:W=5;break a;case 7:ka(o)?(W=0,Gl=null,Lu(t)):(W=0,Gl=null,Ru(e,t,o,7));break;case 5:var s=null;switch(H.tag){case 26:s=H.memoizedState;case 5:case 27:var c=H;if(s?Wf(s):c.stateNode.complete){W=0,Gl=null;var l=c.sibling;if(l!==null)H=l;else{var u=c.return;u===null?H=null:(H=u,zu(u))}break b}}W=0,Gl=null,Ru(e,t,o,5);break;case 6:W=0,Gl=null,Ru(e,t,o,6);break;case 8:Tu(),Xl=6;break a;default:throw Error(i(462))}}Fu();break}catch(t){Du(e,t)}while(1);return Zi=Xi=null,T.H=r,T.A=a,V=n,H===null?(Wl=null,U=0,ii(),Xl):0}function Fu(){for(;H!==null&&!Ae();)Iu(H)}function Iu(e){var t=Fc(e.alternate,e,Yl);e.memoizedProps=e.pendingProps,t===null?zu(e):H=t}function Lu(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=bc(n,t,t.pendingProps,t.type,void 0,U);break;case 11:t=bc(n,t,t.pendingProps,t.type.render,t.ref,U);break;case 5:No(t);default:Wc(n,t),t=H=hi(t,Yl),t=Fc(n,t,Yl)}e.memoizedProps=e.pendingProps,t===null?zu(e):H=t}function Ru(e,t,n,r){Zi=Xi=null,No(t),Fa=null,Ia=0;var i=t.return;try{if(ac(e,i,t,n,U)){Xl=1,ec(e,Si(n,e.current)),H=null;return}}catch(t){if(i!==null)throw H=i,t;Xl=1,ec(e,Si(n,e.current)),H=null;return}t.flags&32768?(F||r===1?e=!0:ql||U&536870912?e=!1:(Kl=e=!0,(r===2||r===9||r===3||r===6)&&(r=oo.current,r!==null&&r.tag===13&&(r.flags|=16384))),Bu(t,e)):zu(t)}function zu(e){var t=e;do{if(t.flags&32768){Bu(t,Kl);return}e=t.return;var n=Hc(t.alternate,t,Yl);if(n!==null){H=n;return}if(t=t.sibling,t!==null){H=t;return}H=t=e}while(t!==null);Xl===0&&(Xl=5)}function Bu(e,t){do{var n=Uc(e.alternate,e);if(n!==null){n.flags&=32767,H=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){H=e;return}H=e=n}while(e!==null);Xl=6,H=null}function q(e,t,n,r,a,o,s,c,l){e.cancelPendingCommit=null;do Gu();while(cu!==0);if(V&6)throw Error(i(327));if(t!==null){if(t===e.current)throw Error(i(177));if(o=t.lanes|t.childLanes,o|=ri,it(e,n,o,s,c,l),e===Wl&&(H=Wl=null,U=0),uu=t,lu=e,du=n,fu=o,pu=a,mu=r,t.subtreeFlags&10256||t.flags&10256?(e.callbackNode=null,e.callbackPriority=0,$u(Ie,function(){return Ku(),null})):(e.callbackNode=null,e.callbackPriority=0),r=(t.flags&13878)!=0,t.subtreeFlags&13878||r){r=T.T,T.T=null,a=E.p,E.p=2,s=V,V|=4;try{ll(e,t,n)}finally{V=s,E.p=a,T.T=r}}cu=1,Vu(),Hu(),Uu()}}function Vu(){if(cu===1){cu=0;var e=lu,t=uu,n=(t.flags&13878)!=0;if(t.subtreeFlags&13878||n){n=T.T,T.T=null;var r=E.p;E.p=2;var i=V;V|=4;try{Sl(t,e);var a=zd,o=jr(e.containerInfo),s=a.focusedElem,c=a.selectionRange;if(o!==s&&s&&s.ownerDocument&&Ar(s.ownerDocument.documentElement,s)){if(c!==null&&Mr(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=kr(s,h),v=kr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}sp=!!Rd,zd=Rd=null}finally{V=i,E.p=r,T.T=n}}e.current=t,cu=2}}function Hu(){if(cu===2){cu=0;var e=lu,t=uu,n=(t.flags&8772)!=0;if(t.subtreeFlags&8772||n){n=T.T,T.T=null;var r=E.p;E.p=2;var i=V;V|=4;try{ul(e,t.alternate,t)}finally{V=i,E.p=r,T.T=n}}cu=3}}function Uu(){if(cu===4||cu===3){cu=0,je();var e=lu,t=uu,n=du,r=mu;t.subtreeFlags&10256||t.flags&10256?cu=5:(cu=0,uu=lu=null,Wu(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(su=null),lt(n),t=t.stateNode,He&&typeof He.onCommitFiberRoot==`function`)try{He.onCommitFiberRoot(Ve,t,void 0,(t.current.flags&128)==128)}catch{}if(r!==null){t=T.T,i=E.p,E.p=2,T.T=null;try{for(var a=e.onRecoverableError,o=0;o<r.length;o++){var s=r[o];a(s.value,{componentStack:s.stack})}}finally{T.T=t,E.p=i}}du&3&&Gu(),ad(e),i=e.pendingLanes,n&261930&&i&42?e===gu?hu++:(hu=0,gu=e):hu=0,od(0,!1)}}function Wu(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,pa(t)))}function Gu(){return Vu(),Hu(),Uu(),Ku()}function Ku(){if(cu!==5)return!1;var e=lu,t=fu;fu=0;var n=lt(du),r=T.T,a=E.p;try{E.p=32>n?32:n,T.T=null,n=pu,pu=null;var o=lu,s=du;if(cu=0,uu=lu=null,du=0,V&6)throw Error(i(331));var c=V;if(V|=4,zl(o.current),jl(o,o.current,s,n),V=c,od(0,!1),He&&typeof He.onPostCommitFiberRoot==`function`)try{He.onPostCommitFiberRoot(Ve,o)}catch{}return!0}finally{E.p=a,T.T=r,Wu(e,t)}}function qu(e,t,n){t=Si(n,t),t=nc(e.stateNode,t,2),e=qa(e,t,2),e!==null&&(rt(e,2),ad(e))}function J(e,t,n){if(e.tag===3)qu(e,e,n);else for(;t!==null;){if(t.tag===3){qu(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(su===null||!su.has(r))){e=Si(n,e),n=rc(2),r=qa(t,n,2),r!==null&&(ic(n,r,t,e),rt(r,2),ad(r));break}}t=t.return}}function Ju(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Ul;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(Jl=!0,i.add(n),e=Yu.bind(null,e,t,n),t.then(e,e))}function Yu(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,Wl===e&&(U&n)===n&&(Xl===4||Xl===3&&(U&62914560)===U&&300>Me()-au?!(V&2)&&Eu(e,0):$l|=n,tu===U&&(tu=0)),ad(e)}function Xu(e,t){t===0&&(t=tt()),e=si(e,t),e!==null&&(rt(e,t),ad(e))}function Zu(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Xu(e,n)}function Qu(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(i(314))}r!==null&&r.delete(t),Xu(e,n)}function $u(e,t){return Oe(e,t)}var ed=null,td=null,nd=!1,Y=!1,rd=!1,id=0;function ad(e){e!==td&&e.next===null&&(td===null?ed=td=e:td=td.next=e),Y=!0,nd||(nd=!0,fd())}function od(e,t){if(!rd&&Y){rd=!0;do for(var n=!1,r=ed;r!==null;){if(!t)if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-We(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,dd(r,a))}else a=U,a=Qe(r,r===Wl?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||$e(r,a)||(n=!0,dd(r,a));r=r.next}while(n);rd=!1}}function sd(){cd()}function cd(){Y=nd=!1;var e=0;id!==0&&Gd()&&(e=id);for(var t=Me(),n=null,r=ed;r!==null;){var i=r.next,a=ld(r,t);a===0?(r.next=null,n===null?ed=i:n.next=i,i===null&&(td=n)):(n=r,(e!==0||a&3)&&(Y=!0)),r=i}cu!==0&&cu!==5||od(e,!1),id!==0&&(id=0)}function ld(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-We(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=et(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=Wl,n=U,n=Qe(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(W===2||W===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&ke(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||$e(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&ke(r),lt(n)){case 2:case 8:n=Fe;break;case 32:n=Ie;break;case 268435456:n=Re;break;default:n=Ie}return r=ud.bind(null,e),n=Oe(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&ke(r),e.callbackPriority=2,e.callbackNode=null,2}function ud(e,t){if(cu!==0&&cu!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Gu()&&e.callbackNode!==n)return null;var r=U;return r=Qe(e,e===Wl?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(bu(e,r,t),ld(e,Me()),e.callbackNode!=null&&e.callbackNode===n?ud.bind(null,e):null)}function dd(e,t){if(Gu())return null;bu(e,t,!0)}function fd(){Yd(function(){V&6?Oe(Pe,sd):cd()})}function pd(){if(id===0){var e=ha;e===0&&(e=Je,Je<<=1,!(Je&261888)&&(Je=256)),id=e}return id}function md(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:an(``+e)}function hd(e,t){var n=t.ownerDocument.createElement(`input`);return n.name=t.name,n.value=t.value,e.id&&n.setAttribute(`form`,e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function gd(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=md((i[mt]||null).action),o=r.submitter;o&&(t=(t=o[mt]||null)?md(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new Tn(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(id!==0){var e=o?hd(i,o):new FormData(i);Os(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=o?hd(i,o):new FormData(i),Os(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var _d=0;_d<Qr.length;_d++){var vd=Qr[_d];$r(vd.toLowerCase(),`on`+(vd[0].toUpperCase()+vd.slice(1)))}$r(Wr,`onAnimationEnd`),$r(Gr,`onAnimationIteration`),$r(Kr,`onAnimationStart`),$r(`dblclick`,`onDoubleClick`),$r(`focusin`,`onFocus`),$r(`focusout`,`onBlur`),$r(qr,`onTransitionRun`),$r(Jr,`onTransitionStart`),$r(Yr,`onTransitionCancel`),$r(Xr,`onTransitionEnd`),Ot(`onMouseEnter`,[`mouseout`,`mouseover`]),Ot(`onMouseLeave`,[`mouseout`,`mouseover`]),Ot(`onPointerEnter`,[`pointerout`,`pointerover`]),Ot(`onPointerLeave`,[`pointerout`,`pointerover`]),Dt(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),Dt(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),Dt(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),Dt(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),Dt(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),Dt(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var yd=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),bd=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(yd));function xd(e,t){t=(t&4)!=0;for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ei(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ei(e)}i.currentTarget=null,a=c}}}}function X(e,t){var n=t[gt];n===void 0&&(n=t[gt]=new Set);var r=e+`__bubble`;n.has(r)||(Td(t,e,2,!1),n.add(r))}function Sd(e,t,n){var r=0;t&&(r|=4),Td(n,e,r,t)}var Cd=`_reactListening`+Math.random().toString(36).slice(2);function wd(e){if(!e[Cd]){e[Cd]=!0,Tt.forEach(function(t){t!==`selectionchange`&&(bd.has(t)||Sd(t,!1,e),Sd(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Cd]||(t[Cd]=!0,Sd(`selectionchange`,!1,t))}}function Td(e,t,n,r){switch(mp(t)){case 2:var i=cp;break;case 8:i=lp;break;default:i=up}n=i.bind(null,t,n,e),i=void 0,!hn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function Ed(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===i)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&s.stateNode.containerInfo===i)return;s=s.return}for(;c!==null;){if(s=xt(c),s===null)return;if(l=s.tag,l===5||l===6||l===26||l===27){r=a=s;continue a}c=c.parentNode}}r=r.return}fn(function(){var r=a,i=cn(n),s=[];a:{var c=Zr.get(e);if(c!==void 0){var l=Tn,u=e;switch(e){case`keypress`:if(bn(n)===0)break a;case`keydown`:case`keyup`:l=Un;break;case`focusin`:u=`focus`,l=Pn;break;case`focusout`:u=`blur`,l=Pn;break;case`beforeblur`:case`afterblur`:l=Pn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:l=Mn;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:l=Nn;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:l=Gn;break;case Wr:case Gr:case Kr:l=Fn;break;case Xr:l=Kn;break;case`scroll`:case`scrollend`:l=Dn;break;case`wheel`:l=qn;break;case`copy`:case`cut`:case`paste`:l=In;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:l=Wn;break;case`toggle`:case`beforetoggle`:l=Jn}var d=(t&4)!=0,f=!d&&(e===`scroll`||e===`scrollend`),p=d?c===null?null:c+`Capture`:c;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=pn(m,p),g!=null&&d.push(Dd(m,g,h))),f)break;m=m.return}0<d.length&&(c=new l(c,u,null,n,i),s.push({event:c,listeners:d}))}}if(!(t&7)){a:{if(c=e===`mouseover`||e===`pointerover`,l=e===`mouseout`||e===`pointerout`,c&&n!==sn&&(u=n.relatedTarget||n.fromElement)&&(xt(u)||u[ht]))break a;if((l||c)&&(c=i.window===i?i:(c=i.ownerDocument)?c.defaultView||c.parentWindow:window,l?(u=n.relatedTarget||n.toElement,l=r,u=u?xt(u):null,u!==null&&(f=o(u),d=u.tag,u!==f||d!==5&&d!==27&&d!==6)&&(u=null)):(l=null,u=r),l!==u)){if(d=Mn,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=Wn,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=l==null?c:Ct(l),h=u==null?c:Ct(u),c=new d(g,m+`leave`,l,n,i),c.target=f,c.relatedTarget=h,g=null,xt(i)===r&&(d=new d(p,m+`enter`,u,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,l&&u)b:{for(d=kd,p=l,m=u,h=0,g=p;g;g=d(g))h++;g=0;for(var _=m;_;_=d(_))g++;for(;0<h-g;)p=d(p),h--;for(;0<g-h;)m=d(m),g--;for(;h--;){if(p===m||m!==null&&p===m.alternate){d=p;break b}p=d(p),m=d(m)}d=null}else d=null;l!==null&&Ad(s,c,l,d,!1),u!==null&&f!==null&&Ad(s,f,u,d,!0)}}a:{if(c=r?Ct(r):window,l=c.nodeName&&c.nodeName.toLowerCase(),l===`select`||l===`input`&&c.type===`file`)var v=mr;else if(cr(c))if(hr)v=wr;else{v=Sr;var y=xr}else l=c.nodeName,!l||l.toLowerCase()!==`input`||c.type!==`checkbox`&&c.type!==`radio`?r&&$t(r.elementType)&&(v=mr):v=Cr;if(v&&=v(e,r)){lr(s,v,n,i);break a}y&&y(e,c,r),e===`focusout`&&r&&c.type===`number`&&r.memoizedProps.value!=null&&Wt(c,`number`,c.value)}switch(y=r?Ct(r):window,e){case`focusin`:(cr(y)||y.contentEditable===`true`)&&(Pr=y,Fr=r,Ir=null);break;case`focusout`:Ir=Fr=Pr=null;break;case`mousedown`:Lr=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:Lr=!1,Rr(s,n,i);break;case`selectionchange`:if(Nr)break;case`keydown`:case`keyup`:Rr(s,n,i)}var b;if(Xn)b:{switch(e){case`compositionstart`:var x=`onCompositionStart`;break b;case`compositionend`:x=`onCompositionEnd`;break b;case`compositionupdate`:x=`onCompositionUpdate`;break b}x=void 0}else ir?nr(e,n)&&(x=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(x=`onCompositionStart`);x&&($n&&n.locale!==`ko`&&(ir||x!==`onCompositionStart`?x===`onCompositionEnd`&&ir&&(b=yn()):(P=i,_n=`value`in P?P.value:P.textContent,ir=!0)),y=Od(r,x),0<y.length&&(x=new Ln(x,e,null,n,i),s.push({event:x,listeners:y}),b?x.data=b:(b=rr(n),b!==null&&(x.data=b)))),(b=Qn?ar(e,n):or(e,n))&&(x=Od(r,`onBeforeInput`),0<x.length&&(y=new Ln(`onBeforeInput`,`beforeinput`,null,n,i),s.push({event:y,listeners:x}),y.data=b)),gd(s,e,r,n,i)}xd(s,t)})}function Dd(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Od(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=pn(e,n),i!=null&&r.unshift(Dd(e,i,a)),i=pn(e,t),i!=null&&r.push(Dd(e,i,a))),e.tag===3)return r;e=e.return}return[]}function kd(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Ad(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=pn(n,a),l!=null&&o.unshift(Dd(n,l,c))):i||(l=pn(n,a),l!=null&&o.push(Dd(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var jd=/\r\n?/g,Md=/\u0000|\uFFFD/g;function Nd(e){return(typeof e==`string`?e:``+e).replace(jd,`
`).replace(Md,``)}function Z(e,t){return t=Nd(t),Nd(e)===t}function Q(e,t,n,r,a,o){switch(n){case`children`:typeof r==`string`?t===`body`||t===`textarea`&&r===``||Jt(e,r):(typeof r==`number`||typeof r==`bigint`)&&t!==`body`&&Jt(e,``+r);break;case`className`:Nt(e,`class`,r);break;case`tabIndex`:Nt(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:Nt(e,n,r);break;case`style`:Zt(e,r,o);break;case`data`:if(t!==`object`){Nt(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)){e.removeAttribute(n);break}if(r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=an(``+r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}else typeof o==`function`&&(n===`formAction`?(t!==`input`&&Q(e,t,`name`,a.name,a,null),Q(e,t,`formEncType`,a.formEncType,a,null),Q(e,t,`formMethod`,a.formMethod,a,null),Q(e,t,`formTarget`,a.formTarget,a,null)):(Q(e,t,`encType`,a.encType,a,null),Q(e,t,`method`,a.method,a,null),Q(e,t,`target`,a.target,a,null)));if(r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=an(``+r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=on);break;case`onScroll`:r!=null&&X(`scroll`,e);break;case`onScrollEnd`:r!=null&&X(`scrollend`,e);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=an(``+r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``+r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:X(`beforetoggle`,e),X(`toggle`,e),j(e,`popover`,r);break;case`xlinkActuate`:Pt(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:Pt(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:Pt(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:Pt(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:Pt(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:Pt(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:Pt(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:Pt(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:Pt(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:j(e,`is`,r);break;case`innerText`:case`textContent`:break;default:(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)&&(n=tn.get(n)||n,j(e,n,r))}}function Pd(e,t,n,r,a,o){switch(n){case`style`:Zt(e,r,o);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`children`:typeof r==`string`?Jt(e,r):(typeof r==`number`||typeof r==`bigint`)&&Jt(e,``+r);break;case`onScroll`:r!=null&&X(`scroll`,e);break;case`onScrollEnd`:r!=null&&X(`scrollend`,e);break;case`onClick`:r!=null&&(e.onclick=on);break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:break;case`innerText`:case`textContent`:break;default:if(!Et.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(a=n.endsWith(`Capture`),t=n.slice(2,a?n.length-7:void 0),o=e[mt]||null,o=o==null?null:o[n],typeof o==`function`&&e.removeEventListener(t,o,a),typeof r==`function`)){typeof o!=`function`&&o!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,r,a);break a}n in e?e[n]=r:!0===r?e.setAttribute(n,``):j(e,n,r)}}}function $(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:X(`error`,e),X(`load`,e);var r=!1,a=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:a=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:Q(e,t,o,s,n,null)}}a&&Q(e,t,`srcSet`,n.srcSet,n,null),r&&Q(e,t,`src`,n.src,n,null);return;case`input`:X(`invalid`,e);var c=o=s=a=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:a=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(i(137,t));break;default:Q(e,t,r,d,n,null)}}Ut(e,o,c,l,u,s,a,!1);return;case`select`:for(a in X(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(a)&&(c=n[a],c!=null))switch(a){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:Q(e,t,a,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&Gt(e,!!r,n,!0):Gt(e,!!r,t,!1);return;case`textarea`:for(s in X(`invalid`,e),o=a=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:a=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(i(91));break;default:Q(e,t,s,c,n,null)}qt(e,r,a,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:Q(e,t,l,r,n,null)}return;case`dialog`:X(`beforetoggle`,e),X(`toggle`,e),X(`cancel`,e),X(`close`,e);break;case`iframe`:case`object`:X(`load`,e);break;case`video`:case`audio`:for(r=0;r<yd.length;r++)X(yd[r],e);break;case`image`:X(`error`,e),X(`load`,e);break;case`details`:X(`toggle`,e);break;case`embed`:case`source`:case`link`:X(`error`,e),X(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:Q(e,t,u,r,n,null)}return;default:if($t(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&Pd(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&Q(e,t,c,r,n,null))}function Fd(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||Q(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:o=m;break;case`name`:a=m;break;case`checked`:u=m;break;case`defaultChecked`:d=m;break;case`value`:s=m;break;case`defaultValue`:c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(i(137,t));break;default:m!==f&&Q(e,t,p,m,r,f)}}Ht(e,s,c,l,u,d,o,a);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||Q(e,t,o,null,r,l)}for(a in r)if(o=r[a],l=n[a],r.hasOwnProperty(a)&&(o!=null||l!=null))switch(a){case`value`:p=o;break;case`defaultValue`:c=o;break;case`multiple`:s=o;default:o!==l&&Q(e,t,a,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?Gt(e,!!n,n?[]:``,!1):Gt(e,!!n,t,!0)):Gt(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(a=n[c],n.hasOwnProperty(c)&&a!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:Q(e,t,c,null,r,a)}for(s in r)if(a=r[s],o=n[s],r.hasOwnProperty(s)&&(a!=null||o!=null))switch(s){case`value`:p=a;break;case`defaultValue`:m=a;break;case`children`:break;case`dangerouslySetInnerHTML`:if(a!=null)throw Error(i(91));break;default:a!==o&&Q(e,t,s,a,r,o)}Kt(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:Q(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:Q(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&Q(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(i(137,t));break;default:Q(e,t,u,p,r,m)}return;default:if($t(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&Pd(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||Pd(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&Q(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||Q(e,t,f,p,r,m)}function Id(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function Ld(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&Id(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&Id(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var Rd=null,zd=null;function Bd(e){return e.nodeType===9?e:e.ownerDocument}function Vd(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function Hd(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function Ud(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Wd=null;function Gd(){var e=window.event;return e&&e.type===`popstate`?e===Wd?!1:(Wd=e,!0):(Wd=null,!1)}var Kd=typeof setTimeout==`function`?setTimeout:void 0,qd=typeof clearTimeout==`function`?clearTimeout:void 0,Jd=typeof Promise==`function`?Promise:void 0,Yd=typeof queueMicrotask==`function`?queueMicrotask:Jd===void 0?Kd:function(e){return Jd.resolve(null).then(e).catch(Xd)};function Xd(e){setTimeout(function(){throw e})}function Zd(e){return e===`head`}function Qd(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Np(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)pf(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,pf(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[yt]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&pf(e.ownerDocument.body);n=i}while(n);Np(t)}function $d(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8)if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++;n=r}while(n)}function ef(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:ef(n),bt(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function tf(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r)if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e;else if(!e[yt])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=cf(e.nextSibling),e===null)break}return null}function nf(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=cf(e.nextSibling),e===null))return null;return e}function rf(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=cf(e.nextSibling),e===null))return null;return e}function af(e){return e.data===`$?`||e.data===`$~`}function of(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function sf(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function cf(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var lf=null;function uf(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return cf(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function df(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function ff(e,t,n){switch(t=Bd(n),e){case`html`:if(e=t.documentElement,!e)throw Error(i(452));return e;case`head`:if(e=t.head,!e)throw Error(i(453));return e;case`body`:if(e=t.body,!e)throw Error(i(454));return e;default:throw Error(i(451))}}function pf(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);bt(e)}var mf=new Map,hf=new Set;function gf(e){return typeof e.getRootNode==`function`?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var _f=E.d;E.d={f:vf,r:yf,D:Sf,C:Cf,L:wf,m:Tf,X:Df,S:Ef,M:Of};function vf(){var e=_f.f(),t=wu();return e||t}function yf(e){var t=St(e);t!==null&&t.tag===5&&t.type===`form`?As(t):_f.r(e)}var bf=typeof document>`u`?null:document;function xf(e,t,n){var r=bf;if(r&&typeof t==`string`&&t){var i=Vt(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),hf.has(i)||(hf.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),$(t,`link`,e),A(t),r.head.appendChild(t)))}}function Sf(e){_f.D(e),xf(`dns-prefetch`,e,null)}function Cf(e,t){_f.C(e,t),xf(`preconnect`,e,t)}function wf(e,t,n){_f.L(e,t,n);var r=bf;if(r&&e&&t){var i=`link[rel="preload"][as="`+Vt(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+Vt(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+Vt(n.imageSizes)+`"]`)):i+=`[href="`+Vt(e)+`"]`;var a=i;switch(t){case`style`:a=Af(e);break;case`script`:a=Pf(e)}mf.has(a)||(e=f({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),mf.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(jf(a))||t===`script`&&r.querySelector(Ff(a))||(t=r.createElement(`link`),$(t,`link`,e),A(t),r.head.appendChild(t)))}}function Tf(e,t){_f.m(e,t);var n=bf;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+Vt(r)+`"][href="`+Vt(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Pf(e)}if(!mf.has(a)&&(e=f({rel:`modulepreload`,href:e},t),mf.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(Ff(a)))return}r=n.createElement(`link`),$(r,`link`,e),A(r),n.head.appendChild(r)}}}function Ef(e,t,n){_f.S(e,t,n);var r=bf;if(r&&e){var i=wt(r).hoistableStyles,a=Af(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(jf(a)))s.loading=5;else{e=f({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=mf.get(a))&&Rf(e,n);var c=o=r.createElement(`link`);A(c),$(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Lf(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function Df(e,t){_f.X(e,t);var n=bf;if(n&&e){var r=wt(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=f({src:e,async:!0},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),A(a),$(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Of(e,t){_f.M(e,t);var n=bf;if(n&&e){var r=wt(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=f({src:e,async:!0,type:`module`},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),A(a),$(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function kf(e,t,n,r){var a=(a=O.current)?gf(a):null;if(!a)throw Error(i(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(t=Af(n.href),n=wt(a).hoistableStyles,r=n.get(t),r||(r={type:`style`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Af(n.href);var o=wt(a).hoistableStyles,s=o.get(e);if(s||(a=a.ownerDocument||a,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=a.querySelector(jf(e)))&&!o._p&&(s.instance=o,s.state.loading=5),mf.has(e)||(n={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},mf.set(e,n),o||Nf(a,e,n,s.state))),t&&r===null)throw Error(i(528,``));return s}if(t&&r!==null)throw Error(i(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(t=Pf(n),n=wt(a).hoistableScripts,r=n.get(t),r||(r={type:`script`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(i(444,e))}}function Af(e){return`href="`+Vt(e)+`"`}function jf(e){return`link[rel="stylesheet"][`+e+`]`}function Mf(e){return f({},e,{"data-precedence":e.precedence,precedence:null})}function Nf(e,t,n,r){e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)?r.loading=1:(t=e.createElement(`link`),r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2}),$(t,`link`,n),A(t),e.head.appendChild(t))}function Pf(e){return`[src="`+Vt(e)+`"]`}function Ff(e){return`script[async]`+e}function If(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+Vt(n.href)+`"]`);if(r)return t.instance=r,A(r),r;var a=f({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),A(r),$(r,`style`,a),Lf(r,n.precedence,e),t.instance=r;case`stylesheet`:a=Af(n.href);var o=e.querySelector(jf(a));if(o)return t.state.loading|=4,t.instance=o,A(o),o;r=Mf(n),(a=mf.get(a))&&Rf(r,a),o=(e.ownerDocument||e).createElement(`link`),A(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),$(o,`link`,r),t.state.loading|=4,Lf(o,n.precedence,e),t.instance=o;case`script`:return o=Pf(n.src),(a=e.querySelector(Ff(o)))?(t.instance=a,A(a),a):(r=n,(a=mf.get(o))&&(r=f({},n),zf(r,a)),e=e.ownerDocument||e,a=e.createElement(`script`),A(a),$(a,`link`,r),e.head.appendChild(a),t.instance=a);case`void`:return null;default:throw Error(i(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Lf(r,n.precedence,e));return t.instance}function Lf(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Rf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function zf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Bf=null;function Vf(e,t,n){if(Bf===null){var r=new Map,i=Bf=new Map;i.set(n,r)}else i=Bf,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[yt]||a[pt]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Hf(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function Uf(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Wf(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Gf(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Af(r.href),a=t.querySelector(jf(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=Jf.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,A(a);return}a=t.ownerDocument||t,r=Mf(r),(i=mf.get(i))&&Rf(r,i),a=a.createElement(`link`),A(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),$(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=Jf.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var Kf=0;function qf(e,t){return e.stylesheets&&e.count===0&&Xf(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&Kf===0&&(Kf=62500*Ld());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>Kf?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function Jf(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Xf(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Yf=null;function Xf(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Yf=new Map,t.forEach(Zf,e),Yf=null,Jf.call(e))}function Zf(e,t){if(!(t.state.loading&4)){var n=Yf.get(e);if(n)var r=n.get(null);else{n=new Map,Yf.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=Jf.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var Qf={$$typeof:b,Provider:null,Consumer:null,_currentValue:ce,_currentValue2:ce,_threadCount:0};function $f(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=nt(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=nt(0),this.hiddenUpdates=nt(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.incompleteTransitions=new Map}function ep(e,t,n,r,i,a,o,s,c,l,u,d){return e=new $f(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=fi(3,null,null,t),e.current=a,a.stateNode=e,t=fa(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},Wa(a),e}function tp(e){return e?(e=ui,e):ui}function np(e,t,n,r,i,a){i=tp(i),r.context===null?r.context=i:r.pendingContext=i,r=Ka(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=qa(e,r,t),n!==null&&(yu(n,e,t),Ja(n,e,t))}function rp(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ip(e,t){rp(e,t),(e=e.alternate)&&rp(e,t)}function ap(e){if(e.tag===13||e.tag===31){var t=si(e,67108864);t!==null&&yu(t,e,67108864),ip(e,67108864)}}function op(e){if(e.tag===13||e.tag===31){var t=_u();t=ct(t);var n=si(e,t);n!==null&&yu(n,e,t),ip(e,t)}}var sp=!0;function cp(e,t,n,r){var i=T.T;T.T=null;var a=E.p;try{E.p=2,up(e,t,n,r)}finally{E.p=a,T.T=i}}function lp(e,t,n,r){var i=T.T;T.T=null;var a=E.p;try{E.p=8,up(e,t,n,r)}finally{E.p=a,T.T=i}}function up(e,t,n,r){if(sp){var i=dp(r);if(i===null)Ed(e,t,r,fp,n),Cp(e,r);else if(Tp(i,e,t,n,r))r.stopPropagation();else if(Cp(e,r),t&4&&-1<Sp.indexOf(e)){for(;i!==null;){var a=St(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=Ze(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-We(o);s.entanglements[1]|=c,o&=~c}ad(a),!(V&6)&&(K=Me()+500,od(0,!1))}}break;case 31:case 13:s=si(a,2),s!==null&&yu(s,a,2),wu(),ip(a,2)}if(a=dp(r),a===null&&Ed(e,t,r,fp,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else Ed(e,t,r,null,n)}}function dp(e){return e=cn(e),pp(e)}var fp=null;function pp(e){if(fp=null,e=xt(e),e!==null){var t=o(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=s(t),e!==null)return e;e=null}else if(n===31){if(e=c(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return fp=e,null}function mp(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`resize`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(Ne()){case Pe:return 2;case Fe:return 8;case Ie:case Le:return 32;case Re:return 268435456;default:return 32}default:return 32}}var hp=!1,gp=null,_p=null,vp=null,yp=new Map,bp=new Map,xp=[],Sp=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Cp(e,t){switch(e){case`focusin`:case`focusout`:gp=null;break;case`dragenter`:case`dragleave`:_p=null;break;case`mouseover`:case`mouseout`:vp=null;break;case`pointerover`:case`pointerout`:yp.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:bp.delete(t.pointerId)}}function wp(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=St(t),t!==null&&ap(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Tp(e,t,n,r,i){switch(t){case`focusin`:return gp=wp(gp,e,t,n,r,i),!0;case`dragenter`:return _p=wp(_p,e,t,n,r,i),!0;case`mouseover`:return vp=wp(vp,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return yp.set(a,wp(yp.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,bp.set(a,wp(bp.get(a)||null,e,t,n,r,i)),!0}return!1}function Ep(e){var t=xt(e.target);if(t!==null){var n=o(t);if(n!==null){if(t=n.tag,t===13){if(t=s(n),t!==null){e.blockedOn=t,dt(e.priority,function(){op(n)});return}}else if(t===31){if(t=c(n),t!==null){e.blockedOn=t,dt(e.priority,function(){op(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Dp(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=dp(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);sn=r,n.target.dispatchEvent(r),sn=null}else return t=St(n),t!==null&&ap(t),e.blockedOn=n,!1;t.shift()}return!0}function Op(e,t,n){Dp(e)&&n.delete(t)}function kp(){hp=!1,gp!==null&&Dp(gp)&&(gp=null),_p!==null&&Dp(_p)&&(_p=null),vp!==null&&Dp(vp)&&(vp=null),yp.forEach(Op),bp.forEach(Op)}function Ap(e,n){e.blockedOn===n&&(e.blockedOn=null,hp||(hp=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,kp)))}var jp=null;function Mp(e){jp!==e&&(jp=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){jp===e&&(jp=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(pp(r||n)===null)continue;break}var a=St(n);a!==null&&(e.splice(t,3),t-=3,Os(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Np(e){function t(t){return Ap(t,e)}gp!==null&&Ap(gp,e),_p!==null&&Ap(_p,e),vp!==null&&Ap(vp,e),yp.forEach(t),bp.forEach(t);for(var n=0;n<xp.length;n++){var r=xp[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<xp.length&&(n=xp[0],n.blockedOn===null);)Ep(n),n.blockedOn===null&&xp.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[mt]||null;if(typeof a==`function`)o||Mp(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[mt]||null)s=o.formAction;else if(pp(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Mp(n)}}}function Pp(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Fp(e){this._internalRoot=e}Ip.prototype.render=Fp.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));var n=t.current;np(n,_u(),e,t,null,null)},Ip.prototype.unmount=Fp.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;np(e.current,2,null,e,null,null),wu(),t[ht]=null}};function Ip(e){this._internalRoot=e}Ip.prototype.unstable_scheduleHydration=function(e){if(e){var t=ut();e={blockedOn:null,target:e,priority:t};for(var n=0;n<xp.length&&t!==0&&t<xp[n].priority;n++);xp.splice(n,0,e),n===0&&Ep(e)}};var Lp=n.version;if(Lp!==`19.2.7`)throw Error(i(527,Lp,`19.2.7`));E.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(i(188)):(e=Object.keys(e).join(`,`),Error(i(268,e)));return e=u(t),e=e===null?null:d(e),e=e===null?null:e.stateNode,e};var Rp={bundleType:0,version:`19.2.7`,rendererPackageName:`react-dom`,currentDispatcherRef:T,reconcilerVersion:`19.2.7`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var zp=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!zp.isDisabled&&zp.supportsFiber)try{Ve=zp.inject(Rp),He=zp}catch{}}e.createRoot=function(e,t){if(!a(e))throw Error(i(299));var n=!1,r=``,o=Zs,s=Qs,c=$s;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=ep(e,1,!1,null,null,n,r,null,o,s,c,Pp),e[ht]=t.current,wd(e),new Fp(t)}})),an=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=rn()})),on=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),sn=o(((e,t)=>{t.exports=on()})),cn=c(Qt(),1),ln=en(),un=an(),N=sn(),dn=`mx-auto grid w-full max-w-5xl gap-3 sm:gap-4`,fn=`rounded-[18px] border border-stone-200/80 bg-white/90 p-3 shadow-[0_12px_30px_rgba(25,27,24,.06)] sm:p-5`,pn=`min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 outline-none shadow-sm transition focus:border-orange-600 focus:ring-4 focus:ring-orange-100`,mn=`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-orange-600 bg-orange-600 px-4 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(239,91,29,.2)] transition hover:-translate-y-0.5 hover:bg-orange-700`,hn=`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 text-sm font-extrabold text-stone-900 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-900`,gn=`inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-xs font-extrabold text-stone-800 transition hover:border-orange-300 hover:bg-orange-50`;function P({className:e=``,icon:t,name:n,size:r=16}){return(0,N.jsx)(`span`,{className:e,dangerouslySetInnerHTML:{__html:t(n,r)}})}function _n({children:e,id:t,label:n,optional:r=!1}){return(0,N.jsxs)(`div`,{className:`grid gap-1.5`,children:[(0,N.jsxs)(`label`,{className:`text-[10px] font-black uppercase tracking-[.08em] text-stone-500`,htmlFor:t,children:[n,` `,r?(0,N.jsx)(`span`,{className:`font-bold normal-case tracking-normal text-stone-400`,children:`Opcional`}):null]}),e]})}function vn({number:e,title:t}){return(0,N.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,N.jsx)(`span`,{className:`grid h-8 w-8 place-items-center rounded-lg bg-orange-600 text-sm font-black text-white`,children:e}),(0,N.jsx)(`h2`,{className:`m-0 text-lg font-black text-stone-950`,children:t})]})}function yn(e){let t={cancelado:`border-red-200 bg-red-50 text-red-700`,confirmado:`border-blue-200 bg-blue-50 text-blue-700`,entregue:`border-emerald-200 bg-emerald-50 text-emerald-700`,enviado:`border-orange-200 bg-orange-50 text-orange-700`,producao:`border-amber-200 bg-amber-50 text-amber-700`,rascunho:`border-stone-200 bg-stone-100 text-stone-600`,saiu_entrega:`border-sky-200 bg-sky-50 text-sky-700`};return`inline-flex h-7 items-center rounded-full border px-2.5 text-[11px] font-black uppercase ${t[e]??t.rascunho}`}function bn(e,t,n=!0){return e.requests.filter(e=>e.leaderId===t.id&&(n||e.status!==`cancelado`)).sort((e,t)=>new Date(t.updatedAt)-new Date(e.updatedAt))}function xn({canEditRequest:e,formatDate:t,formatDateTime:n,icon:r,request:i,requestMealDescription:a,state:o,STATUS_LABEL:s,compact:c=!1}){let l=e(o,i),u=a(i),d=i.sectionName||`Equipe nao informada`;return(0,N.jsxs)(`article`,{className:`${c?`rounded-r-2xl rounded-l-md border-l-2 border-dashed bg-[#fffefa] p-3`:`rounded-2xl bg-white p-3 sm:p-4`} border border-stone-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(34,29,24,.12)]`,children:[(0,N.jsxs)(`div`,{className:`grid grid-cols-[42px_minmax(0,1fr)_auto] gap-3`,children:[(0,N.jsx)(`span`,{className:`${c?`rounded-r-xl rounded-l-md border border-orange-100 bg-orange-50`:`rounded-xl bg-orange-50`} grid h-10 w-10 place-items-center text-orange-700`,children:(0,N.jsx)(P,{icon:r,name:i.mealType?.includes(`Marmita`)?`package`:`utensils`,size:19})}),(0,N.jsxs)(`div`,{className:`min-w-0`,children:[(0,N.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,N.jsx)(`strong`,{className:`min-w-0 text-[15px] text-stone-950`,children:i.mealType}),(0,N.jsx)(`span`,{className:yn(i.status),children:s[i.status]??i.status})]}),(0,N.jsxs)(`div`,{className:`mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-stone-500`,children:[(0,N.jsxs)(`span`,{className:`inline-flex items-center gap-1`,children:[(0,N.jsx)(P,{icon:r,name:`clock`,size:14}),t(i.date)]}),(0,N.jsxs)(`span`,{className:`inline-flex min-w-0 items-center gap-1`,children:[(0,N.jsx)(P,{icon:r,name:`users`,size:14}),d]})]}),u?(0,N.jsx)(`div`,{className:`${c?`border border-dashed border-stone-200 bg-stone-50/70`:`bg-stone-50`} mt-2 rounded-lg px-3 py-2 text-xs font-semibold text-stone-600`,children:u}):null]}),(0,N.jsxs)(`div`,{className:`text-right`,children:[(0,N.jsx)(`strong`,{className:`${c?`text-xl`:`text-2xl`} block font-black leading-none text-stone-950`,children:i.quantity}),(0,N.jsx)(`span`,{className:`text-[10px] font-black uppercase text-stone-500`,children:`refeições`})]})]}),(0,N.jsxs)(`div`,{className:`${c?`mt-2 pt-2`:`mt-3 pt-3`} flex flex-col gap-2 border-t border-stone-100 text-xs font-bold text-stone-500 sm:flex-row sm:items-center sm:justify-between`,children:[(0,N.jsxs)(`span`,{children:[`Atualizado `,n(i.updatedAt)]}),l?(0,N.jsxs)(`div`,{className:`grid grid-cols-2 gap-2 sm:flex`,children:[(0,N.jsxs)(`button`,{className:gn,"data-edit-request":i.id,"aria-label":`Editar pedido`,children:[(0,N.jsx)(P,{icon:r,name:`edit`,size:15}),`Editar`]}),(0,N.jsxs)(`button`,{className:`${gn} border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100`,"data-cancel-request":i.id,"aria-label":`Cancelar pedido`,children:[(0,N.jsx)(P,{icon:r,name:`trash`,size:15}),`Cancelar`]})]}):(0,N.jsxs)(`span`,{className:`inline-flex items-center gap-1 text-stone-500`,children:[(0,N.jsx)(P,{icon:r,name:`clock`,size:14}),`Edição encerrada`]})]})]})}function Sn({icon:e,name:t,size:n=16}){return(0,N.jsx)(`span`,{dangerouslySetInnerHTML:{__html:e(t,n)}})}function Cn({icon:e,iconName:t,label:n,value:r}){return(0,N.jsxs)(`div`,{className:`admin-receipt-chip${String(r).length>10?` is-long-value`:``}`,children:[(0,N.jsx)(`span`,{className:`admin-receipt-chip-icon`,children:(0,N.jsx)(Sn,{icon:e,name:t,size:15})}),(0,N.jsxs)(`div`,{className:`admin-receipt-chip-text`,children:[(0,N.jsx)(`strong`,{children:r}),(0,N.jsx)(`span`,{children:n})]})]})}function wn({actions:e,className:t=``,description:n,kicker:r,metrics:i=[],title:a,totalLabel:o,totalValue:s}){let c=Math.max(i.length,1);return(0,N.jsxs)(`div`,{className:`admin-receipt ${t}`.trim(),children:[(0,N.jsxs)(`header`,{className:`admin-receipt-head`,children:[(0,N.jsxs)(`div`,{className:`admin-receipt-main`,children:[(0,N.jsx)(`span`,{className:`compact-kicker`,children:r}),(0,N.jsx)(`h1`,{children:a}),s===void 0?null:(0,N.jsxs)(`div`,{className:`admin-receipt-total`,children:[(0,N.jsx)(`strong`,{children:s}),(0,N.jsx)(`span`,{children:o})]}),n?(0,N.jsx)(`p`,{children:n}):null]}),e?(0,N.jsx)(`div`,{className:`admin-receipt-actions`,children:e}):null]}),(0,N.jsx)(`div`,{className:`admin-receipt-holes`,children:Array.from({length:14}).map((e,t)=>(0,N.jsx)(`span`,{},t))}),(0,N.jsx)(`div`,{className:`admin-receipt-metrics`,"data-count":c,style:{"--receipt-metric-count":c},children:i.map(e=>(0,cn.createElement)(Cn,{...e,key:`${e.label}-${e.value}`}))})]})}function Tn({icon:e}){return(0,N.jsxs)(`button`,{className:`admin-back-button`,"data-view":`mais`,"aria-label":`Voltar para mais ferramentas`,children:[(0,N.jsx)(Sn,{icon:e,name:`arrow-left`,size:15}),(0,N.jsx)(`span`,{children:`Voltar`})]})}function En({exportMenuOpen:e,icon:t,id:n,items:r}){return(0,N.jsxs)(`div`,{className:`export-menu ${e===n?`open`:``}`,children:[(0,N.jsxs)(`button`,{className:`btn outline small`,type:`button`,"data-export-toggle":n,children:[(0,N.jsx)(Sn,{icon:t,name:`clipboard`,size:14}),`Exportar`]}),e===n?(0,N.jsx)(`div`,{className:`export-options`,children:r.map(([e,n,r])=>(0,N.jsxs)(`button`,{type:`button`,"data-export":e,children:[(0,N.jsx)(Sn,{icon:t,name:r,size:14}),n]},e))}):null]})}function Dn({children:e,icon:t,label:n=`Filtros`}){return(0,N.jsxs)(`details`,{className:`admin-filter-menu`,children:[(0,N.jsxs)(`summary`,{"aria-label":n,children:[(0,N.jsx)(Sn,{icon:t,name:`filter`,size:15}),(0,N.jsx)(`span`,{children:n})]}),(0,N.jsx)(`div`,{className:`admin-filter-popover`,children:e})]})}function On(e,t){return e[t]??t}function kn(e,t){return e.users.find(e=>e.id===t)?.name??`Usuário`}function An(e){return e.users.filter(e=>e.role===`fornecedor`)}function jn(e,t){return e.requests.filter(e=>e.date===t)}function Mn(e,t=0){let n=new Date(`${e}T12:00:00`),r=n.getDay(),i=r===0?-6:1-r;return n.setDate(n.getDate()+i+t*7),n.setHours(12,0,0,0),n}function Nn({canEditRequest:e,request:t,state:n}){return e(n,t)?(0,N.jsxs)(`div`,{className:`button-row`,children:[(0,N.jsx)(`button`,{className:`btn outline small`,"data-edit-request":t.id,children:`Editar`}),(0,N.jsx)(`button`,{className:`btn danger small`,"data-cancel-request":t.id,children:`Cancelar`})]}):(0,N.jsx)(`span`,{className:`page-subtitle`,children:`Bloqueado`})}function Pn({canEditRequest:e,formatDate:t,formatDateTime:n,rows:r,showLeader:i=!1,editable:a=!1,state:o,STATUS_LABEL:s,...c}){return r.length?(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`div`,{className:`admin-request-list`,children:r.map(r=>(0,N.jsxs)(`article`,{className:`admin-request-shell`,children:[i?(0,N.jsxs)(`div`,{className:`admin-request-owner`,children:[`Encarregado `,(0,N.jsx)(`strong`,{children:kn(o,r.leaderId)})]}):null,(0,N.jsx)(xn,{...c,canEditRequest:a?e:()=>!1,formatDate:t,formatDateTime:n,request:r,state:o,STATUS_LABEL:s,compact:!a})]},r.id))}),(0,N.jsx)(`div`,{className:`table-wrap legacy-request-table`,children:(0,N.jsxs)(`table`,{children:[(0,N.jsx)(`thead`,{children:(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`th`,{children:`Data`}),i?(0,N.jsx)(`th`,{children:`Encarregado`}):null,(0,N.jsx)(`th`,{children:`Tipo`}),(0,N.jsx)(`th`,{children:`Local`}),(0,N.jsx)(`th`,{children:`Qtd`}),(0,N.jsx)(`th`,{children:`Status`}),(0,N.jsx)(`th`,{children:`Atualização`}),a?(0,N.jsx)(`th`,{children:`Ações`}):null]})}),(0,N.jsx)(`tbody`,{children:r.map(r=>(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{children:t(r.date)}),i?(0,N.jsx)(`td`,{children:(0,N.jsx)(`strong`,{children:kn(o,r.leaderId)})}):null,(0,N.jsx)(`td`,{children:r.mealType}),(0,N.jsx)(`td`,{children:r.location}),(0,N.jsx)(`td`,{children:(0,N.jsx)(`strong`,{children:r.quantity})}),(0,N.jsx)(`td`,{children:(0,N.jsx)(`span`,{className:`badge ${r.status}`,children:On(s,r.status)})}),(0,N.jsx)(`td`,{children:n(r.updatedAt)}),a?(0,N.jsx)(`td`,{children:(0,N.jsx)(Nn,{canEditRequest:e,request:r,state:o})}):null]},r.id))})]})})]}):(0,N.jsx)(`div`,{className:`empty`,children:`Nenhum pedido encontrado.`})}var Fn=`
  .admin-page .daily-block-list { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); justify-items: center; align-items: start; gap: .75rem; }
  .admin-page .daily-block-card { display: grid; grid-template-rows: auto minmax(0,1fr) auto; width: 100%; max-width: 27rem; max-height: 34rem; min-width: 0; overflow: hidden; border-radius: 14px; border: 1px solid #e7e5e4; border-left: 2px dashed #d6d3d1; background: #fffefa; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .daily-block-head { display: grid; gap: .45rem; border-bottom: 1px solid #f5f5f4; padding: .65rem .7rem; }
  .admin-page .daily-block-head-main { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: start; gap: .6rem; }
  .admin-page .daily-block-head h2 { font-size: .95rem; line-height: 1; color: #1c1917; }
  .admin-page .daily-block-head p { color: #78716c; font-size: .68rem; font-weight: 800; }
  .admin-page .daily-block-total { text-align: right; }
  .admin-page .daily-block-total strong { display: block; font-size: 1.4rem; line-height: .9; font-weight: 950; color: #1c1917; }
  .admin-page .daily-block-total span { display: block; margin-top: .15rem; font-size: 9px; font-weight: 950; text-transform: uppercase; color: #78716c; }
  .admin-page .daily-food-summary { display: flex; flex-wrap: wrap; gap: .3rem; }
  .admin-page .daily-food-chip { display: inline-flex; max-width: 100%; min-width: 0; align-items: center; gap: .28rem; border-radius: 999px; border: 1px solid #fed7aa; background: #fff7ed; padding: .24rem .43rem; color: #c2410c; }
  .admin-page .daily-food-chip strong { font-size: .72rem; line-height: 1; font-weight: 950; }
  .admin-page .daily-food-chip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 950; text-transform: uppercase; }
  .admin-page .daily-block-body { display: grid; gap: .32rem; max-height: 18rem; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: .6rem .7rem; scrollbar-width: thin; scrollbar-color: #d6d3d1 transparent; }
  .admin-page .daily-block-body::-webkit-scrollbar { width: 7px; }
  .admin-page .daily-block-body::-webkit-scrollbar-thumb { border-radius: 999px; background: #d6d3d1; }
  .admin-page .daily-request-row { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: center; gap: .45rem; border-radius: .65rem; background: #fafaf9; padding: .48rem .52rem; }
  .admin-page .daily-request-title { min-width: 0; }
  .admin-page .daily-request-title strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .8rem; color: #1c1917; }
  .admin-page .daily-request-title small { display: block; margin-top: .1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #78716c; font-size: .64rem; font-weight: 800; }
  .admin-page .daily-request-side { display: flex; align-items: center; gap: .32rem; }
  .admin-page .daily-request-qty { min-width: 2.35rem; text-align: right; }
  .admin-page .daily-request-qty strong { display: block; font-size: .95rem; line-height: 1; font-weight: 950; color: #1c1917; }
  .admin-page .daily-request-qty small { font-size: 9px; font-weight: 900; color: #78716c; text-transform: uppercase; }
  .admin-page .daily-request-actions { display: flex; gap: .2rem; }
  .admin-page .daily-request-actions .btn { min-height: 1.85rem; width: 1.85rem; padding: 0; }
  .admin-page .daily-request-actions .daily-action-label { display: none; }
  .admin-page .daily-block-footer { display: grid; gap: .42rem; border-top: 1px solid #f5f5f4; padding: .58rem .7rem .68rem; }
  .admin-page .daily-total-line { display: flex; align-items: center; justify-content: space-between; gap: .6rem; font-size: .78rem; font-weight: 950; color: #1c1917; }
  .admin-page .daily-block-footer .btn.primary { width: 100%; min-height: 2.1rem; }
  .admin-page .daily-status-line { display: flex; align-items: center; justify-content: space-between; gap: .5rem; border-radius: .65rem; background: #fafaf9; padding: .48rem .58rem; }
  .admin-page .daily-status-line span:first-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .72rem; font-weight: 900; color: #57534e; }
  @media (max-width: 767px) {
    .admin-page .daily-block-list { grid-template-columns: 1fr; }
    .admin-page .daily-request-row { grid-template-columns: minmax(0,1fr) auto; }
  }
  @media (min-width: 768px) and (max-width: 1180px) {
    .admin-page .daily-block-list { grid-template-columns: repeat(2,minmax(0,1fr)); }
  }
`;function In(e){return Object.entries(e.reduce((e,t)=>(e[t.date]??=[],e[t.date].push(t),e),{})).sort(([e],[t])=>t.localeCompare(e))}function Ln(e){let{canEditRequest:t,formatDate:n,icon:r,requests:i,state:a,STATUS_LABEL:o}=e,s=i[0]?.date??``,c=(a.consolidations??[]).filter(e=>e.date===s&&e.status!==`rascunho`),l=c.find(e=>[`rascunho`,`enviado`].includes(e.status))??c[0],u=i.filter(e=>e.status!==`cancelado`),d=u.filter(e=>e.status===`enviado`),f=new Set(c.flatMap(e=>e.requestIds??[])),p=d.filter(e=>!f.has(e.id)),m=p.length?p:u,h=m.reduce((e,t)=>e+Number(t.quantity??0),0),g=Object.entries(m.reduce((e,t)=>(e[t.mealType]??=0,e[t.mealType]+=Number(t.quantity??0),e),{})),_=new Set(m.map(e=>e.leaderId)).size,v=new Set(m.map(e=>e.teamId||e.sectionName||e.location)).size;return(0,N.jsxs)(`article`,{className:`daily-block-card`,children:[(0,N.jsxs)(`header`,{className:`daily-block-head`,children:[(0,N.jsxs)(`div`,{className:`daily-block-head-main`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{className:`compact-kicker`,children:`Bloco diario`}),(0,N.jsx)(`h2`,{children:n(s)}),(0,N.jsxs)(`p`,{children:[m.length,` pedidos - `,_,` encarregados - `,v,` equipes`]})]}),(0,N.jsxs)(`div`,{className:`daily-block-total`,children:[(0,N.jsx)(`strong`,{children:h}),(0,N.jsx)(`span`,{children:`refeicoes`})]})]}),(0,N.jsx)(`div`,{className:`daily-food-summary`,children:g.map(([e,t])=>(0,N.jsxs)(`div`,{className:`daily-food-chip`,children:[(0,N.jsx)(`strong`,{children:t}),(0,N.jsx)(`span`,{children:e})]},e))})]}),(0,N.jsx)(`div`,{className:`daily-block-body`,children:m.map(e=>{let n=t(a,e);return(0,N.jsxs)(`div`,{className:`daily-request-row`,children:[(0,N.jsxs)(`div`,{className:`daily-request-title`,children:[(0,N.jsx)(`strong`,{children:kn(a,e.leaderId)}),(0,N.jsxs)(`small`,{children:[e.mealType,` - `,e.sectionName||e.location]})]}),(0,N.jsxs)(`div`,{className:`daily-request-side`,children:[(0,N.jsxs)(`div`,{className:`daily-request-qty`,children:[(0,N.jsx)(`strong`,{children:e.quantity}),(0,N.jsx)(`small`,{children:`ref.`})]}),(0,N.jsx)(`div`,{className:`daily-request-actions`,children:n?(0,N.jsxs)(N.Fragment,{children:[(0,N.jsxs)(`button`,{className:`btn outline small`,type:`button`,"data-edit-request":e.id,"aria-label":`Editar pedido`,children:[(0,N.jsx)(Sn,{icon:r,name:`edit`,size:14}),(0,N.jsx)(`span`,{className:`daily-action-label`,children:`Editar`})]}),(0,N.jsxs)(`button`,{className:`btn danger small`,type:`button`,"data-cancel-request":e.id,"aria-label":`Cancelar pedido`,children:[(0,N.jsx)(Sn,{icon:r,name:`trash`,size:14}),(0,N.jsx)(`span`,{className:`daily-action-label`,children:`Cancelar`})]})]}):(0,N.jsx)(`span`,{className:`badge ${e.status}`,children:On(o,e.status)})})]})]},e.id)})}),(0,N.jsxs)(`footer`,{className:`daily-block-footer`,children:[(0,N.jsxs)(`div`,{className:`daily-total-line`,children:[(0,N.jsx)(`span`,{children:p.length?`Total a enviar`:`Total do dia`}),(0,N.jsxs)(`strong`,{children:[h,` refeicoes`]})]}),l?(0,N.jsxs)(N.Fragment,{children:[(0,N.jsxs)(`div`,{className:`daily-status-line`,children:[(0,N.jsx)(`span`,{children:c.length>1?`${c.length} pedidos ao fornecedor`:`Status do fornecedor`}),(0,N.jsx)(`span`,{className:`badge ${l.status}`,children:On(o,l.status)})]}),p.length?(0,N.jsxs)(`button`,{className:`btn primary`,type:`button`,"data-send-request-date":s,children:[(0,N.jsx)(Sn,{icon:r,name:`truck`,size:15}),l.status===`enviado`?`Enviar pedido extra`:`Enviar novo pedido da data`]}):null]}):d.length?(0,N.jsxs)(`button`,{className:`btn primary`,type:`button`,"data-send-request-date":s,children:[(0,N.jsx)(Sn,{icon:r,name:`truck`,size:15}),`Enviar bloco ao fornecedor`]}):(0,N.jsx)(`span`,{className:`badge enviado`,children:`Bloco sem pendencias de envio`})]})]})}function Rn(e=new Date){let t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?``:new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function zn(e,t){return e.filter(e=>Rn(e.createdAt)===t)}function Bn({adminConsumptionWeekOffset:e,countStatus:t,formatDate:n,icon:r,money:i,requestValue:a,state:o,sumQty:s}){let c=Mn(o.settings.defaultMealDate,e),l=o.settings.defaultMealDate,u=Array.from({length:7},(e,n)=>{let r=new Date(c);r.setDate(c.getDate()+n);let i=r.toISOString().slice(0,10),l=jn(o,i).filter(e=>e.status!==`cancelado`);return{key:i,date:r,label:r.toLocaleDateString(`pt-BR`,{weekday:`short`}).replace(`.`,``),total:s(l),waiting:t(l,`enviado`),delivered:t(l,`entregue`),value:l.reduce((e,t)=>e+a(t),0)}}),d=u.reduce((e,t)=>e+t.total,0),f=u.reduce((e,t)=>e+t.value,0),p=Math.max(...u.map(e=>e.total),1);return(0,N.jsxs)(`div`,{className:`grid gap-2 px-1`,children:[(0,N.jsxs)(`div`,{className:`flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{className:`text-[10px] font-black uppercase tracking-[.12em] text-orange-700`,children:`Consumo recente`}),(0,N.jsx)(`h2`,{className:`text-base font-black leading-tight text-stone-900`,children:`Semana operacional`}),(0,N.jsxs)(`p`,{className:`mt-0.5 text-xs font-bold text-stone-500`,children:[n(u[0].key),` até `,n(u[6].key)]})]}),(0,N.jsxs)(`div`,{className:`grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:items-center`,children:[(0,N.jsxs)(`button`,{className:`inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-stone-300 bg-white px-2 text-[11px] font-bold text-stone-700 shadow-sm transition hover:bg-stone-50 hover:text-orange-700`,"data-week-offset":e-1,children:[(0,N.jsx)(Sn,{icon:r,name:`arrow`,size:12}),` Anterior`]}),(0,N.jsx)(`button`,{className:`inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-stone-300 bg-white px-2 text-[11px] font-bold text-stone-700 shadow-sm transition hover:bg-stone-50`,"data-week-offset":0,children:`Atual`}),(0,N.jsx)(`button`,{className:`inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-stone-300 bg-white px-2 text-[11px] font-bold text-stone-700 shadow-sm transition hover:bg-stone-50`,"data-week-offset":e+1,children:`Próxima`})]})]}),(0,N.jsxs)(`div`,{className:`hidden`,children:[(0,N.jsxs)(`div`,{className:`rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-200 bg-white px-3 py-2`,children:[(0,N.jsx)(`strong`,{className:`text-lg font-black leading-none text-stone-900`,children:d}),(0,N.jsx)(`br`,{}),(0,N.jsx)(`span`,{className:`text-[10px] font-bold uppercase tracking-wider text-stone-500`,children:`Refeições na semana`})]}),(0,N.jsxs)(`div`,{className:`rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-200 bg-white px-3 py-2`,children:[(0,N.jsx)(`strong`,{className:`text-lg font-black leading-none text-stone-900`,children:i(f)}),(0,N.jsx)(`br`,{}),(0,N.jsx)(`span`,{className:`text-[10px] font-bold uppercase tracking-wider text-stone-500`,children:`Custo estimado`})]})]}),(0,N.jsx)(`div`,{className:`grid min-h-[7.25rem] grid-cols-7 items-end gap-1.5 px-1 pt-2`,role:`list`,children:u.map(e=>(0,N.jsxs)(`button`,{className:`group relative flex h-[7rem] appearance-none flex-col items-center justify-end border-0 bg-transparent p-0`,type:`button`,role:`listitem`,"data-filter-date-set":e.key,"aria-label":`${e.label}, ${e.total} refeições`,children:[(0,N.jsx)(`span`,{className:`mb-1 text-[11px] font-black text-stone-500`,children:e.total||`-`}),(0,N.jsx)(`i`,{className:`block w-full max-w-[1.35rem] rounded-t-full transition-all group-hover:opacity-80 ${e.key===l?`bg-orange-600`:`bg-stone-800`}`,style:{height:`${Math.max(6,Math.round(e.total/p*70))}px`}}),(0,N.jsx)(`span`,{className:`mt-1 text-[9px] font-black uppercase ${e.key===l?`text-orange-700`:`text-stone-400`}`,children:e.label}),(0,N.jsx)(`small`,{className:`text-[9px] font-bold text-stone-500`,children:String(e.date.getDate()).padStart(2,`0`)})]},e.key))})]})}function Vn(e){let{countStatus:t,formatDate:n,icon:r,money:i,requestValue:a,state:o,sumQty:s}=e,c=o.settings.defaultMealDate||Rn(),l=zn(o.requests,c),u=l.filter(e=>![`cancelado`,`entregue`].includes(e.status)).sort((e,t)=>t.date.localeCompare(e.date)||new Date(t.createdAt)-new Date(e.createdAt)),d=t(u,`enviado`),f=t(l,`entregue`),p=u.reduce((e,t)=>e+a(t),0),m=In(u);return(0,N.jsxs)(`div`,{className:`grid w-full gap-3 sm:gap-4`,children:[(0,N.jsx)(`style`,{children:Fn}),(0,N.jsx)(wn,{className:`admin-home-receipt`,kicker:`Lancados hoje - ${n(c)}`,title:`Visão geral administrativa`,totalValue:d,totalLabel:`pedidos a enviar`,description:`Pedidos registrados hoje, mesmo quando a refeição está agendada para outra data`,actions:(0,N.jsxs)(`button`,{className:`btn primary`,"data-view":`pedidos`,children:[(0,N.jsx)(Sn,{icon:r,name:`clipboard`,size:16}),`Ver pedidos`]}),metrics:[{icon:r,iconName:`utensils`,value:s(u),label:`Refeições lançadas`},{icon:r,iconName:`clock`,value:d,label:`Aguardando`},{icon:r,iconName:`check`,value:f,label:`Entregas feitas`},{icon:r,iconName:`dollar-sign`,value:i(p),label:`Custo estimado`}]}),(0,N.jsx)(`section`,{className:`admin-live-panel`,children:m.length?(0,N.jsx)(`div`,{className:`daily-block-list`,children:m.map(([t,n])=>(0,cn.createElement)(Ln,{...e,date:t,requests:n,key:t}))}):(0,N.jsxs)(`div`,{className:`grid justify-items-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-center`,children:[(0,N.jsx)(`span`,{className:`grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-700`,children:(0,N.jsx)(Sn,{icon:r,name:`inbox`,size:20})}),(0,N.jsx)(`strong`,{className:`text-stone-900`,children:`Fila vazia`}),(0,N.jsx)(`p`,{className:`m-0 max-w-md text-xs font-semibold text-stone-500`,children:`Nenhum pedido foi enviado hoje. Assim que um encarregado enviar, o bloco aparece aqui automaticamente.`})]})}),(0,N.jsx)(Bn,{...e})]})}var Hn=`
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
`,Un=`
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
  .admin-page .admin-pedidos-receipt .admin-receipt-metrics[data-count="3"] { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
  .admin-page .admin-pedidos-receipt .admin-receipt-metrics[data-count="3"] .admin-receipt-chip:last-child { grid-column: 1 / -1; }
  @media (max-width: 767px) {
    .admin-page .admin-history-hero .admin-history-actions { width: 100%; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }
    .admin-page .admin-pedidos-summary { padding-inline: .75rem; }
    .admin-page .admin-history-chip { padding: .55rem; gap: .35rem; }
    .admin-page .admin-history-chip-icon { height: 1.75rem; width: 1.75rem; }
    .admin-page .admin-history-chip strong { font-size: 1rem; }
  }
`;function Wn(e){let{adminFilters:t,countStatus:n,icon:r,state:i,sumQty:a}=e,o=t.date,s=t.leader,c=t.meal,l=i.requests.filter(e=>(!o||e.date===o)&&(!s||e.leaderId===s)&&(!c||e.mealType===c)).sort((e,t)=>new Date(t.createdAt)-new Date(e.createdAt)),u=l.filter(e=>e.status!==`cancelado`),d=n(l,`enviado`),f=In(l);return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`style`,{children:Hn+Un+Fn}),(0,N.jsxs)(`div`,{className:`grid w-full gap-3 sm:gap-4 admin-history-shell`,children:[(0,N.jsx)(wn,{className:`admin-pedidos-receipt`,kicker:`Pedidos administrativos`,title:`Pedidos recebidos`,totalValue:l.length,totalLabel:`pedidos recebidos`,description:d?`${d} aguardando envio ao fornecedor`:`Fila operacional atualizada`,actions:(0,N.jsxs)(N.Fragment,{children:[(0,N.jsxs)(Dn,{icon:r,children:[(0,N.jsx)(`input`,{type:`date`,defaultValue:o,"data-filter-date":!0,"aria-label":`Filtrar por data`}),(0,N.jsxs)(`select`,{defaultValue:s,"data-filter-leader":!0,"aria-label":`Filtrar encarregado`,children:[(0,N.jsx)(`option`,{value:``,children:`Todos`}),i.users.map(e=>(0,N.jsx)(`option`,{value:e.id,children:e.name},e.id))]}),(0,N.jsxs)(`select`,{defaultValue:c,"data-filter-meal":!0,"aria-label":`Filtrar refeição`,children:[(0,N.jsx)(`option`,{value:``,children:`Tipos`}),i.mealTypes.map(e=>(0,N.jsx)(`option`,{value:e.label,children:e.label},e.id))]}),(0,N.jsx)(`button`,{className:`btn outline small`,type:`button`,"data-clear-admin-request-filters":!0,children:`Todos os dias`})]}),(0,N.jsx)(En,{exportMenuOpen:e.exportMenuOpen,icon:r,id:`pedidos`,items:[[`pdf`,`PDF`,`clipboard`],[`xlsx`,`Excel`,`chart`]]})]}),metrics:[{icon:r,iconName:`clipboard`,value:l.length,label:`Pedidos`},{icon:r,iconName:`utensils`,value:a(u),label:`Refeições`},{icon:r,iconName:`clock`,value:d,label:`A enviar`}]}),l.length?(0,N.jsx)(`section`,{className:`grid gap-3`,children:(0,N.jsx)(`div`,{className:`daily-block-list`,children:f.map(([t,n])=>(0,cn.createElement)(Ln,{...e,date:t,requests:n,key:t}))})}):(0,N.jsxs)(`div`,{className:`grid justify-items-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-white px-6 py-8 text-center shadow-sm`,children:[(0,N.jsx)(`span`,{className:`grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-orange-700`,children:(0,N.jsx)(P,{icon:r,name:`clipboard`,size:22})}),(0,N.jsx)(`strong`,{children:`Nenhum pedido encontrado`}),(0,N.jsx)(`p`,{className:`m-0 text-sm text-stone-500`,children:`Ajuste os filtros ou aguarde o envio dos encarregados.`}),(0,N.jsxs)(`button`,{className:mn,"data-view":`pedidos`,children:[(0,N.jsx)(P,{icon:r,name:`clipboard`,size:15}),`Ver pedidos`]})]})]})]})}var Gn=`
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
`,Kn=`
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
  .admin-page .consolidated-block { border-radius: 0 1rem 1rem .4rem; border: 1px solid #e4ded4; border-left: 2px dashed #d6d3d1; background: #fffefa; padding: .8rem; box-shadow: 0 1px 2px rgba(0,0,0,.035); }
  .admin-page .consolidated-block + .consolidated-block { margin-top: .55rem; }
  .admin-page .consolidated-description { margin: -.1rem 0 .35rem; color: #78716c; font-size: .78rem; font-weight: 700; }
  .admin-page .consolidated-row { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .42rem 0; font-size: .875rem; }
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
`;function qn({requestMealDescription:e,state:t,summary:n}){return n.rows.length?(0,N.jsxs)(N.Fragment,{children:[Object.entries(n.byMeal).map(([n,r])=>(0,N.jsxs)(`div`,{className:`consolidated-block`,children:[(0,N.jsxs)(`div`,{className:`consolidated-row total-line`,children:[(0,N.jsx)(`span`,{children:n}),(0,N.jsx)(`span`,{children:r.total})]}),e(r.rows[0])?(0,N.jsx)(`div`,{className:`consolidated-description`,children:e(r.rows[0])}):null,r.rows.map(e=>(0,N.jsxs)(`div`,{className:`consolidated-row`,children:[(0,N.jsx)(`span`,{children:n===`Marmita Campo`?kn(t,e.leaderId):e.location}),(0,N.jsx)(`strong`,{children:e.quantity})]},e.id))]},n)),(0,N.jsxs)(`div`,{className:`consolidated-row total-line`,children:[(0,N.jsx)(`span`,{children:`Total geral`}),(0,N.jsxs)(`span`,{children:[n.total,` refeições`]})]})]}):(0,N.jsx)(`div`,{className:`empty`,children:`Sem pedidos recebidos para enviar ao fornecedor.`})}function Jn({consolidation:e,formatDateTime:t,state:n}){return(0,N.jsx)(`div`,{className:`timeline`,children:[[`enviado`,`Enviado ao fornecedor`],[`confirmado`,`Fornecedor confirmou recebimento`],[`producao`,`Fornecedor confirmou produção`],[`saiu_entrega`,`Saída para entrega registrada`],[`entregue`,`Entrega concluída`]].map(([r,i])=>{let a=e.confirmations.find(e=>e.step===r);return(0,N.jsxs)(`div`,{className:`timeline-item`,children:[(0,N.jsx)(`div`,{className:`timeline-dot`,style:{background:a?`var(--orange)`:`var(--line)`}}),(0,N.jsxs)(`div`,{className:`timeline-body`,children:[(0,N.jsx)(`strong`,{children:i}),(0,N.jsx)(`br`,{}),a?`${kn(n,a.userId)} - ${t(a.at)}`:`Aguardando`]})]},r)})})}function Yn(e){let{adminFilters:t,formatDate:n,getConsolidationForDate:r,getConsolidationSummary:i,icon:a,state:o,STATUS_LABEL:s}=e,c=t.date,l=r(o,c),u=i(o,l),d=An(o),f=l.supplierId??d[0]?.id??``,p=new Set(u.rows.map(e=>e.leaderId)).size,m=Object.keys(u.byMeal).length;return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`style`,{children:Gn+Kn}),(0,N.jsxs)(`section`,{className:`admin-send-page`,children:[(0,N.jsx)(wn,{className:`admin-send-receipt-card`,kicker:`Enviar pedido`,title:`Pedido ao fornecedor`,totalValue:u.total,totalLabel:`refeições para ${n(c)}`,description:`Revise a comanda consolidada e envie para o fornecedor selecionado.`,actions:(0,N.jsxs)(N.Fragment,{children:[(0,N.jsxs)(`div`,{className:`admin-send-top-actions`,children:[(0,N.jsxs)(Dn,{icon:a,children:[(0,N.jsx)(`input`,{type:`date`,defaultValue:c,"data-filter-date":!0,"aria-label":`Data do pedido`}),(0,N.jsx)(`select`,{defaultValue:f,"data-supplier-id":!0,"aria-label":`Fornecedor`,children:d.map(e=>(0,N.jsx)(`option`,{value:e.id,children:e.name},e.id))}),(0,N.jsx)(`span`,{className:`badge ${l.status}`,children:On(s,l.status)})]}),(0,N.jsx)(En,{exportMenuOpen:e.exportMenuOpen,icon:a,id:`consolidacao`,items:[[`pdf`,`PDF`,`chart`],[`doc`,`Word`,`clipboard`]]})]}),(0,N.jsxs)(`button`,{className:`btn primary admin-send-submit`,"data-action":`send-consolidation`,children:[(0,N.jsx)(Sn,{icon:a,name:`truck`,size:15}),`Enviar`]})]}),metrics:[{icon:a,iconName:`utensils`,value:u.total,label:`Refeições`},{icon:a,iconName:`users`,value:p,label:`Encarregados`},{icon:a,iconName:`package`,value:m,label:`Tipos no pedido`}]}),(0,N.jsxs)(`div`,{className:`report-grid`,children:[(0,N.jsxs)(`div`,{className:`data-panel`,children:[(0,N.jsx)(`h2`,{className:`section-title`,children:`Resumo do pedido`}),(0,N.jsx)(qn,{...e,summary:u})]}),(0,N.jsxs)(`div`,{className:`timeline-panel`,children:[(0,N.jsx)(`h2`,{className:`section-title`,children:`Linha do tempo`}),(0,N.jsx)(Jn,{...e,consolidation:l})]})]}),(0,N.jsxs)(`div`,{className:`table-panel`,children:[(0,N.jsx)(`h2`,{className:`section-title`,children:`Pedidos de origem`}),(0,N.jsx)(Pn,{...e,rows:u.rows,showLeader:!0})]})]})]})}var Xn=`
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
  .admin-page .badge.confirmado { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
  .admin-page .badge.producao { border-color: #fde68a; background: #fffbeb; color: #b45309; }
  .admin-page .badge.saiu_entrega { border-color: #bae6fd; background: #f0f9ff; color: #0369a1; }
  @media (min-width: 640px) { .admin-page h1 { font-size: 34px; } }
`,Zn=`
  .admin-page .finance-page { display: grid; gap: .75rem; }
  .admin-page .finance-page > .finance-hero { display: none; }
  .admin-page .finance-mobile-movements { display: none; }
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
  }
`;function Qn({accent:e=!1,icon:t,iconName:n,label:r,value:i,hint:a}){return(0,N.jsxs)(`article`,{className:`finance-metric ${e?`accent`:``}`,children:[n?(0,N.jsx)(`span`,{className:`data-card-icon`,children:(0,N.jsx)(Sn,{icon:t,name:n,size:15})}):null,(0,N.jsxs)(`div`,{className:`data-card-copy`,children:[(0,N.jsx)(`strong`,{children:i}),(0,N.jsx)(`span`,{children:r}),a?(0,N.jsx)(`small`,{children:a}):null]})]})}function $n(e){let{formatDate:t,icon:n,money:r,requestValue:i,state:a,sumQty:o,STATUS_LABEL:s}=e,c=a.requests.filter(e=>e.status!==`cancelado`),l=a.settings.defaultMealDate.slice(0,7),u=c.filter(e=>e.date.startsWith(l)),d=u.filter(e=>e.status===`entregue`),f=u.reduce((e,t)=>e+i(t),0),p=d.reduce((e,t)=>e+i(t),0),m=f-p,h=o(u),g=a.mealTypes.map(e=>({label:e.label,value:u.filter(t=>t.mealTypeId===e.id).reduce((e,t)=>e+i(t),0)})).filter(e=>e.value>0),_=Math.max(...g.map(e=>e.value),1),v=Array.from({length:7},(e,t)=>{let n=new Date(`${a.settings.defaultMealDate}T12:00:00`);n.setDate(n.getDate()-(6-t));let r=n.toISOString().slice(0,10);return{key:r,label:String(n.getDate()).padStart(2,`0`),value:c.filter(e=>e.date===r).reduce((e,t)=>e+i(t),0)}}),y=Math.max(...v.map(e=>e.value),1),b=[...u].sort((e,t)=>t.date.localeCompare(e.date));return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`style`,{children:Xn+Zn}),(0,N.jsxs)(`section`,{className:`finance-page`,children:[(0,N.jsx)(wn,{kicker:`Financeiro`,title:`Financeiro`,totalValue:r(f),totalLabel:`previsto em ${l}`,description:`Custos, entregas e pendencias do mes.`,actions:(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(Tn,{icon:n}),(0,N.jsxs)(`button`,{className:`btn primary`,"data-export-finance":`admin`,children:[(0,N.jsx)(Sn,{icon:n,name:`chart`,size:15}),`Gerar PDF`]})]}),metrics:[{icon:n,iconName:`chart`,label:`Custo previsto`,value:r(f)},{icon:n,iconName:`truck`,label:`Pago/entregue`,value:r(p)},{icon:n,iconName:`clock`,label:`Em aberto`,value:r(m)},{icon:n,iconName:`utensils`,label:`Ticket medio`,value:r(h?f/h:0)}]}),(0,N.jsxs)(`div`,{className:`finance-hero`,children:[(0,N.jsx)(`div`,{className:`finance-hero-head`,children:(0,N.jsxs)(`div`,{className:`finance-hero-row`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{className:`compact-kicker`,children:`Financeiro`}),(0,N.jsx)(`h1`,{children:`Financeiro administrativo`}),(0,N.jsxs)(`p`,{children:[`Análise de `,l,` com custos, entregas e pendências.`]})]}),(0,N.jsxs)(`div`,{className:`finance-hero-actions`,children:[(0,N.jsx)(Tn,{icon:n}),(0,N.jsxs)(`button`,{className:`btn primary`,"data-export-finance":`admin`,children:[(0,N.jsx)(Sn,{icon:n,name:`chart`,size:15}),`Gerar PDF`]})]})]})}),(0,N.jsx)(`div`,{className:`finance-holes`,children:Array.from({length:14}).map((e,t)=>(0,N.jsx)(`span`,{},t))}),(0,N.jsxs)(`div`,{className:`finance-metrics-strip`,children:[(0,N.jsx)(Qn,{icon:n,iconName:`chart`,label:`Custo previsto`,value:r(f),hint:`${h} refeições no mês`}),(0,N.jsx)(Qn,{icon:n,iconName:`truck`,label:`Pago/entregue`,value:r(p),hint:`${d.length} pedidos entregues`}),(0,N.jsx)(Qn,{icon:n,iconName:`clock`,label:`Em aberto`,value:r(m),hint:`pedidos ainda em operação`}),(0,N.jsx)(Qn,{icon:n,iconName:`utensils`,label:`Ticket médio`,value:r(h?f/h:0),hint:`por refeição`})]})]}),(0,N.jsxs)(`div`,{className:`mt-2 grid gap-3 lg:grid-cols-2`,children:[(0,N.jsxs)(`article`,{className:`group relative overflow-hidden rounded-2xl border border-l-2 border-dashed border-stone-300 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`,children:[(0,N.jsx)(`h2`,{className:`mb-4 text-xs font-black uppercase tracking-widest text-stone-800`,children:`Composição por Refeição`}),(0,N.jsxs)(`div`,{className:`grid gap-3`,children:[g.map(e=>(0,N.jsxs)(`div`,{className:`flex flex-col gap-1.5 rounded-lg border border-stone-100 bg-stone-50 p-3 transition-colors hover:border-blue-200 hover:bg-blue-50/40`,children:[(0,N.jsxs)(`div`,{className:`flex items-center justify-between text-xs font-bold text-stone-600`,children:[(0,N.jsx)(`span`,{className:`uppercase tracking-wider`,children:e.label}),(0,N.jsx)(`strong`,{className:`text-blue-700`,children:r(e.value)})]}),(0,N.jsx)(`div`,{className:`h-1.5 w-full overflow-hidden rounded-full bg-stone-200`,children:(0,N.jsx)(`div`,{className:`h-full rounded-full bg-blue-600 transition-all duration-700 ease-out`,style:{width:`${Math.max(3,Math.round(e.value/_*100))}%`}})})]},e.label)),!g.length&&(0,N.jsx)(`div`,{className:`rounded-lg border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm font-bold text-stone-500`,children:`Sem movimentação no período.`})]})]}),(0,N.jsxs)(`article`,{className:`group relative overflow-hidden rounded-2xl border border-l-2 border-dashed border-stone-300 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`,children:[(0,N.jsx)(`h2`,{className:`mb-4 text-xs font-black uppercase tracking-widest text-stone-800`,children:`Evolução dos últimos 7 dias`}),(0,N.jsx)(`div`,{className:`flex h-44 items-end justify-between gap-1 rounded-xl border border-stone-100 bg-stone-50 p-3 sm:gap-2`,children:v.map(e=>(0,N.jsxs)(`div`,{className:`group/bar relative flex h-full w-full flex-col items-center justify-end gap-1`,children:[(0,N.jsx)(`div`,{className:`absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover/bar:-translate-y-1 group-hover/bar:opacity-100`,children:(0,N.jsx)(`span`,{className:`whitespace-nowrap rounded bg-stone-800 px-2 py-1 text-[10px] font-bold text-white shadow-lg`,children:e.value?r(e.value).replace(`R$`,``):`0,00`})}),(0,N.jsx)(`div`,{className:`relative flex w-full max-w-[2.5rem] flex-1 items-end justify-center rounded-t-md bg-stone-200/50 transition-colors group-hover/bar:bg-stone-200`,children:(0,N.jsx)(`div`,{className:`w-full rounded-t-md bg-stone-400 transition-all duration-700 ease-out group-hover/bar:bg-red-600`,style:{height:`${Math.max(5,Math.round(e.value/y*100))}%`}})}),(0,N.jsx)(`span`,{className:`text-[10px] font-black text-stone-500`,children:e.label})]},e.key))})]})]}),(0,N.jsxs)(`article`,{className:`overflow-hidden rounded-2xl border border-l-2 border-dashed border-stone-300 bg-white p-5 shadow-sm transition-all hover:shadow-md`,children:[(0,N.jsx)(`h2`,{className:`mb-4 text-xs font-black uppercase tracking-widest text-stone-800`,children:`Movimentações do Período`}),(0,N.jsxs)(`div`,{className:`finance-mobile-movements`,children:[b.map(e=>(0,N.jsxs)(`article`,{className:`finance-mobile-row`,children:[(0,N.jsxs)(`div`,{className:`finance-mobile-row-top`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`h3`,{children:e.mealType}),(0,N.jsx)(`time`,{children:t(e.date)})]}),(0,N.jsx)(`span`,{className:`badge ${e.status}`,children:On(s,e.status)})]}),(0,N.jsxs)(`div`,{className:`finance-mobile-row-meta`,children:[(0,N.jsxs)(`span`,{children:[`Quantidade`,(0,N.jsx)(`strong`,{children:e.quantity})]}),(0,N.jsxs)(`span`,{children:[`Valor`,(0,N.jsx)(`strong`,{children:r(i(e))})]})]})]},e.id)),!b.length&&(0,N.jsx)(`div`,{className:`empty`,children:`Nenhuma movimentacao encontrada para o periodo.`})]}),(0,N.jsx)(`div`,{className:`finance-desktop-movements overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 shadow-inner`,children:(0,N.jsxs)(`table`,{className:`w-full min-w-[600px] text-left text-sm`,children:[(0,N.jsx)(`thead`,{className:`border-b border-stone-200 bg-stone-100 text-[10px] uppercase tracking-widest text-stone-500`,children:(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`th`,{className:`px-5 py-3.5 font-black`,children:`Data`}),(0,N.jsx)(`th`,{className:`px-5 py-3.5 font-black`,children:`Tipo`}),(0,N.jsx)(`th`,{className:`px-5 py-3.5 text-center font-black`,children:`Qtd`}),(0,N.jsx)(`th`,{className:`px-5 py-3.5 font-black`,children:`Valor`}),(0,N.jsx)(`th`,{className:`px-5 py-3.5 font-black`,children:`Status`})]})}),(0,N.jsxs)(`tbody`,{className:`divide-y divide-stone-100 bg-white`,children:[b.map(e=>(0,N.jsxs)(`tr`,{className:`group/row cursor-default transition-colors hover:bg-stone-50`,children:[(0,N.jsx)(`td`,{className:`px-5 py-3.5 font-medium text-stone-500`,children:t(e.date)}),(0,N.jsx)(`td`,{className:`px-5 py-3.5 font-bold text-stone-700`,children:e.mealType}),(0,N.jsx)(`td`,{className:`px-5 py-3.5 text-center font-bold text-stone-600`,children:e.quantity}),(0,N.jsx)(`td`,{className:`px-5 py-3.5 font-black text-stone-900 transition-colors group-hover/row:text-blue-700`,children:r(i(e))}),(0,N.jsx)(`td`,{className:`px-5 py-3.5`,children:(0,N.jsx)(`span`,{className:`badge ${e.status}`,children:On(s,e.status)})})]},e.id)),!u.length&&(0,N.jsx)(`tr`,{children:(0,N.jsx)(`td`,{colSpan:`5`,className:`px-5 py-8 text-center text-sm font-bold text-stone-500`,children:`Nenhuma movimentação encontrada para o período.`})})]})]})})]})]})]})}var er=`
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
`,tr=`
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
`,nr=[`#ea580c`,`#1c1917`,`#0f766e`,`#2563eb`,`#a16207`,`#7c3aed`,`#be123c`,`#64748b`],rr=[`Dom`,`Seg`,`Ter`,`Qua`,`Qui`,`Sex`,`Sab`];function ir(e,t=100){return!Number.isFinite(e)||e<=0?0:Math.min(t,Math.max(0,e))}function ar(e){return new Intl.NumberFormat(`pt-BR`,{maximumFractionDigits:0}).format(Number(e??0))}function or(e){return new Intl.NumberFormat(`pt-BR`,{style:`currency`,currency:`BRL`}).format(Number(e??0))}function sr(e){if(!e)return`-`;let[,t,n]=String(e).split(`-`);return t&&n?`${n}/${t}`:String(e)}function cr(e,t){let n=e.consolidationActuals?.find(e=>e.date===t.date&&e.teamId===t.teamId&&e.mealTypeId===t.mealTypeId);return Number(n?.quantity??t.actualQuantity??t.quantity??0)}function lr(e,t){return Number(t.sectionHeadcount??t.headcount??e.workSections?.find(e=>e.id===t.teamId)?.headcount??0)}function ur(e){return Number(e.settings?.defaultMealUnitPrice??0)}function dr(e,t,n={}){let r=ur(e),i=t.reduce((t,i)=>{let a=Number(i.quantity??0),o=cr(e,i),s=lr(e,i),c=o*r,l=i.mealType||`Sem tipo`,u=i.sectionName||i.location||`Sem equipe`,d=n[i.status]??i.status??`Sem status`;t.requested+=a,t.consumed+=o,t.effective+=s,t.value+=c,t.byMeal[l]??={label:l,requested:0,consumed:0,effective:0,value:0},t.byMeal[l].requested+=a,t.byMeal[l].consumed+=o,t.byMeal[l].effective+=s,t.byMeal[l].value+=c,t.bySection[u]??={label:u,requested:0,consumed:0,effective:0,value:0},t.bySection[u].requested+=a,t.bySection[u].consumed+=o,t.bySection[u].effective+=s,t.bySection[u].value+=c,t.byStatus[d]??={label:d,value:0},t.byStatus[d].value+=1,t.byDay[i.date]??={label:sr(i.date),date:i.date,requested:0,consumed:0,effective:0,value:0},t.byDay[i.date].requested+=a,t.byDay[i.date].consumed+=o,t.byDay[i.date].effective+=s,t.byDay[i.date].value+=c;let f=rr[new Date(`${i.date}T12:00:00`).getDay()]??`-`;return t.heatmap[f]??={},t.heatmap[f][l]=(t.heatmap[f][l]??0)+o,t},{requested:0,consumed:0,effective:0,value:0,byMeal:{},bySection:{},byStatus:{},byDay:{},heatmap:{}});return{...i,meals:Object.values(i.byMeal).sort((e,t)=>t.consumed-e.consumed),sections:Object.values(i.bySection).sort((e,t)=>t.consumed-e.consumed),statuses:Object.values(i.byStatus).sort((e,t)=>t.value-e.value),days:Object.values(i.byDay).sort((e,t)=>e.date.localeCompare(t.date))}}function fr({children:e,className:t=``,kicker:n,title:r,subtitle:i,chip:a}){return(0,N.jsxs)(`article`,{className:`report-chart-card ${t}`.trim(),children:[(0,N.jsxs)(`header`,{className:`report-chart-head`,children:[(0,N.jsxs)(`div`,{children:[n?(0,N.jsx)(`span`,{className:`compact-kicker`,children:n}):null,(0,N.jsx)(`h2`,{children:r}),i?(0,N.jsx)(`p`,{children:i}):null]}),a?(0,N.jsx)(`span`,{className:`report-chart-chip`,children:a}):null]}),e]})}function pr(){return(0,N.jsx)(`div`,{className:`report-empty`,children:`Sem dados suficientes no periodo filtrado.`})}function mr({items:e,valueKey:t=`value`,format:n=ar,limit:r=8}){let i=e.slice(0,r),a=Math.max(...i.map(e=>Number(e[t]??0)),1);return i.length?(0,N.jsx)(`div`,{className:`report-bars`,children:i.map((e,r)=>{let i=Number(e[t]??0);return(0,N.jsxs)(`div`,{className:`report-bar-row`,children:[(0,N.jsx)(`span`,{className:`report-bar-label`,title:e.label,children:e.label}),(0,N.jsx)(`span`,{className:`report-bar-track`,children:(0,N.jsx)(`b`,{className:`report-bar-fill`,style:{"--bar-color":nr[r%nr.length],width:`${ir(i/a*100)}%`}})}),(0,N.jsx)(`span`,{className:`report-bar-value`,children:n(i)})]},e.label)})}):(0,N.jsx)(pr,{})}function hr({items:e}){let t=e.slice(0,7),n=Math.max(...t.flatMap(e=>[e.requested,e.consumed,e.effective]).map(Number),1);return t.length?(0,N.jsx)(`div`,{className:`report-grouped-bars`,children:t.map(e=>(0,N.jsxs)(`div`,{className:`report-group-row`,children:[(0,N.jsx)(`span`,{className:`report-bar-label`,title:e.label,children:e.label}),(0,N.jsxs)(`div`,{className:`report-group-stack`,children:[(0,N.jsx)(`span`,{className:`report-mini-track`,title:`Solicitado: ${e.requested}`,children:(0,N.jsx)(`b`,{style:{background:`#ea580c`,width:`${ir(e.requested/n*100)}%`}})}),(0,N.jsx)(`span`,{className:`report-mini-track`,title:`Consumido: ${e.consumed}`,children:(0,N.jsx)(`b`,{style:{background:`#1c1917`,width:`${ir(e.consumed/n*100)}%`}})}),(0,N.jsx)(`span`,{className:`report-mini-track`,title:`Efetivo: ${e.effective||0}`,children:(0,N.jsx)(`b`,{style:{background:`#0f766e`,width:`${ir((e.effective||0)/n*100)}%`}})})]})]},e.label))}):(0,N.jsx)(pr,{})}function gr({items:e,center:t}){let n=e.filter(e=>Number(e.value??e.consumed??0)>0).slice(0,7),r=n.reduce((e,t)=>e+Number(t.value??t.consumed??0),0);if(!n.length||!r)return(0,N.jsx)(pr,{});let i=0,a=n.map((e,t)=>{let n=Number(e.value??e.consumed??0),a=i+n/r*100,o=`${nr[t%nr.length]} ${i}% ${a}%`;return i=a,o}).join(`, `);return(0,N.jsxs)(`div`,{className:`report-donut-wrap`,children:[(0,N.jsx)(`div`,{className:`report-donut`,"data-center":t??ar(r),style:{"--donut-stops":a}}),(0,N.jsx)(`div`,{className:`report-legend`,children:n.map((e,t)=>{let n=Number(e.value??e.consumed??0);return(0,N.jsxs)(`div`,{className:`report-legend-row`,children:[(0,N.jsx)(`span`,{className:`report-legend-dot`,style:{"--dot-color":nr[t%nr.length]}}),(0,N.jsx)(`span`,{className:`report-bar-label`,title:e.label,children:e.label}),(0,N.jsx)(`strong`,{children:ar(n)})]},e.label)})})]})}function _r({items:e,valueKey:t=`consumed`,format:n=ar,limit:r=14}){let i=e.slice(-r),a=Math.max(...i.map(e=>Number(e[t]??0)),1);return i.length?(0,N.jsx)(`div`,{className:`report-column-chart`,children:i.map(e=>{let r=Number(e[t]??0);return(0,N.jsxs)(`div`,{className:`report-column`,title:`${e.label}: ${n(r)}`,children:[(0,N.jsx)(`strong`,{children:n(r)}),(0,N.jsx)(`i`,{style:{height:`${Math.max(4,r/a*100)}%`}}),(0,N.jsx)(`span`,{children:e.label})]},e.date??e.label)})}):(0,N.jsx)(pr,{})}function vr({meals:e,heatmap:t}){let n=e.slice(0,5).map(e=>e.label),r=Math.max(...Object.values(t).flatMap(e=>n.map(t=>Number(e[t]??0))),1);return n.length?(0,N.jsxs)(`div`,{className:`report-heatmap`,style:{"--heat-count":n.length},children:[(0,N.jsxs)(`div`,{className:`report-heat-row`,children:[(0,N.jsx)(`strong`,{children:`Dia`}),n.map(e=>(0,N.jsx)(`strong`,{title:e,children:e.split(` `)[0]},e))]}),rr.map(e=>(0,N.jsxs)(`div`,{className:`report-heat-row`,children:[(0,N.jsx)(`strong`,{children:e}),n.map(n=>{let i=Number(t[e]?.[n]??0);return(0,N.jsx)(`span`,{className:`report-heat-cell`,style:{"--heat":`${ir(i/r*82,82)}%`},children:i||`-`},n)})]},e))]}):(0,N.jsx)(pr,{})}function yr({accent:e=!1,icon:t,iconName:n,label:r,value:i,hint:a}){return(0,N.jsxs)(`article`,{className:`finance-metric ${e?`accent`:``}`,children:[n?(0,N.jsx)(`span`,{className:`data-card-icon`,children:(0,N.jsx)(Sn,{icon:t,name:n,size:15})}):null,(0,N.jsxs)(`div`,{className:`data-card-copy`,children:[(0,N.jsx)(`strong`,{children:i}),(0,N.jsx)(`span`,{children:r}),a?(0,N.jsx)(`small`,{children:a}):null]})]})}function br({currentFilter:e,exportMenuOpen:t,icon:n,isAllPeriod:r,isCustomPeriod:i}){return(0,N.jsxs)(`div`,{className:`export-menu ${t===`relatorios`?`open`:``}`,children:[(0,N.jsxs)(`button`,{className:`btn outline small`,type:`button`,"data-export-toggle":`relatorios`,children:[(0,N.jsx)(Sn,{icon:n,name:`clipboard`,size:14}),`Medicao`]}),t===`relatorios`?(0,N.jsxs)(`div`,{className:`export-options`,children:[(0,N.jsxs)(`label`,{children:[(0,N.jsx)(`span`,{children:`Periodo`}),(0,N.jsxs)(`select`,{"data-report-range":!0,value:e.range,onChange:()=>{},children:[(0,N.jsx)(`option`,{value:`all`,children:`Todo periodo`}),(0,N.jsx)(`option`,{value:`day`,children:`Dia`}),(0,N.jsx)(`option`,{value:`week`,children:`Semana`}),(0,N.jsx)(`option`,{value:`month`,children:`Mes`}),(0,N.jsx)(`option`,{value:`custom`,children:`Periodo personalizado`})]})]}),(0,N.jsxs)(`label`,{children:[(0,N.jsx)(`span`,{children:`Inicio`}),(0,N.jsx)(`input`,{type:`date`,value:e.start||``,"data-report-start":!0,disabled:r,onChange:()=>{}})]}),(0,N.jsxs)(`label`,{children:[(0,N.jsx)(`span`,{children:`Fim`}),(0,N.jsx)(`input`,{type:`date`,value:e.end||e.start||``,"data-report-end":!0,disabled:!i,onChange:()=>{}})]}),(0,N.jsxs)(`button`,{type:`button`,"data-export":`pdf`,children:[(0,N.jsx)(Sn,{icon:n,name:`clipboard`,size:14}),`PDF`]}),(0,N.jsxs)(`button`,{type:`button`,"data-export":`xlsx`,children:[(0,N.jsx)(Sn,{icon:n,name:`chart`,size:14}),`Excel`]})]}):null]})}function xr(e=new Date){let t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?``:new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function Sr(e=xr()){let t=new Date(`${e}T12:00:00`);return t.setDate(t.getDate()-1),t.toISOString().slice(0,10)}function Cr(e){return e?new Intl.DateTimeFormat(`pt-BR`,{dateStyle:`short`}).format(new Date(`${e}T12:00:00`)):`-`}function wr({icon:e,report:t,reportDate:n}){let r=!!t;return(0,N.jsxs)(`article`,{className:`daily-report-card ${r?`is-available`:`is-pending`}`,children:[(0,N.jsxs)(`div`,{className:`daily-report-main`,children:[(0,N.jsx)(`span`,{className:`daily-report-icon`,children:(0,N.jsx)(Sn,{icon:e,name:`clipboard`,size:22})}),(0,N.jsxs)(`div`,{className:`daily-report-copy`,children:[(0,N.jsx)(`span`,{className:`compact-kicker`,children:`Relatorio automatico do dia anterior`}),(0,N.jsx)(`h2`,{children:r?`Relatorio de ${Cr(n)} disponivel`:`Relatorio de ${Cr(n)} em geracao`}),(0,N.jsx)(`p`,{children:r?`Arquivo gerado pelo sistema e pronto para baixar em PDF ou Excel, sem envio automatico por e-mail.`:`O sistema tenta gerar automaticamente este arquivo ao abrir o Admin depois de 00:00.`})]}),(0,N.jsx)(`span`,{className:`daily-report-status`,children:r?`Disponivel`:`Pendente`})]}),(0,N.jsxs)(`div`,{className:`daily-report-actions`,children:[(0,N.jsxs)(`button`,{className:`btn primary`,type:`button`,"data-daily-report-download":`pdf`,"data-report-date":n,disabled:!r,children:[(0,N.jsx)(Sn,{icon:e,name:`clipboard`,size:15}),`PDF`]}),(0,N.jsxs)(`button`,{className:`btn outline`,type:`button`,"data-daily-report-download":`xlsx`,"data-report-date":n,disabled:!r,children:[(0,N.jsx)(Sn,{icon:e,name:`chart`,size:15}),`Excel`]})]})]})}function Tr(e){let{icon:t,reportFilter:n,reportPeriodLabel:r,reportRows:i,state:a,sumQty:o,totalsByMeal:s}=e,c=i??a.requests.filter(e=>e.status!==`cancelado`),l=dr(a,c,e.STATUS_LABEL??{}),u=Sr(),d=a.dailyReports?.find(e=>e.date===u),f=n??{range:`all`,start:a.settings.defaultMealDate,end:a.settings.defaultMealDate},p=o(c),m=s(c),h=f.range===`all`,g=f.range===`custom`,_=l.requested?`${Math.round(l.consumed/l.requested*100)}%`:`-`,v=l.effective?`${Math.round(l.consumed/l.effective*100)}%`:`-`,y=l.consumed?or(l.value/l.consumed):or(0);return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`style`,{children:er+tr}),(0,N.jsx)(wn,{kicker:`Relatórios`,title:`Visão geral e desempenho`,totalValue:p,totalLabel:`refeições no período`,description:`Período: ${r??`Todo período`}`,actions:(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(Tn,{icon:t}),(0,N.jsxs)(Dn,{icon:t,children:[(0,N.jsxs)(`select`,{"data-report-range":!0,value:f.range,onChange:()=>{},children:[(0,N.jsx)(`option`,{value:`all`,children:`Todo periodo`}),(0,N.jsx)(`option`,{value:`day`,children:`Dia`}),(0,N.jsx)(`option`,{value:`week`,children:`Semana`}),(0,N.jsx)(`option`,{value:`month`,children:`Mes`}),(0,N.jsx)(`option`,{value:`custom`,children:`Período personalizado`})]}),(0,N.jsx)(`input`,{type:`date`,value:f.start||a.settings.defaultMealDate,"data-report-start":!0,"aria-label":g?`Inicio do periodo`:`Data de referencia`,disabled:h,onChange:()=>{}}),(0,N.jsx)(`input`,{type:`date`,value:f.end||f.start||a.settings.defaultMealDate,"data-report-end":!0,"aria-label":`Fim do periodo`,disabled:!g,onChange:()=>{}})]}),(0,N.jsxs)(`button`,{className:`btn primary small`,type:`button`,"data-export-kpi":!0,children:[(0,N.jsx)(Sn,{icon:t,name:`chart`,size:14}),`KPI PDF`]}),(0,N.jsx)(br,{currentFilter:f,exportMenuOpen:e.exportMenuOpen,icon:t,isAllPeriod:h,isCustomPeriod:g})]}),metrics:[{icon:t,iconName:`utensils`,label:`Refeições`,value:p},{icon:t,iconName:`clipboard`,label:`Pedidos`,value:c.length},{icon:t,iconName:`box`,label:`Marmitas`,value:m[`Marmita Campo`]??0},{icon:t,iconName:`utensils`,label:`Almoços`,value:m[`Buffer Almoço`]??m[`Buffer Almoco`]??0},{icon:t,iconName:`moon`,label:`Jantas`,value:m.Jantar??0}]}),(0,N.jsx)(wr,{icon:t,report:d,reportDate:u}),(0,N.jsxs)(`div`,{className:`finance-hero mt-2`,children:[(0,N.jsxs)(`div`,{className:`finance-hero-head`,children:[(0,N.jsx)(`div`,{children:(0,N.jsxs)(`button`,{className:`sleek-back-btn`,"data-view":`admin`,children:[(0,N.jsx)(Sn,{icon:t,name:`arrow-left`,size:12}),` Voltar`]})}),(0,N.jsxs)(`div`,{className:`finance-hero-row`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{className:`compact-kicker`,children:`Relatórios`}),(0,N.jsx)(`h1`,{children:`Visão geral e desempenho`}),(0,N.jsx)(`p`,{children:`Filtre por período diário, semanal, mensal ou personalizado.`})]}),(0,N.jsxs)(`div`,{className:`finance-hero-actions`,children:[(0,N.jsxs)(Dn,{icon:t,children:[(0,N.jsxs)(`select`,{"data-report-range":!0,value:f.range,onChange:()=>{},children:[(0,N.jsx)(`option`,{value:`all`,children:`Todo periodo`}),(0,N.jsx)(`option`,{value:`day`,children:`Dia`}),(0,N.jsx)(`option`,{value:`week`,children:`Semana`}),(0,N.jsx)(`option`,{value:`month`,children:`Mês`}),(0,N.jsx)(`option`,{value:`custom`,children:`Período personalizado`})]}),(0,N.jsx)(`input`,{type:`date`,value:f.start||a.settings.defaultMealDate,"data-report-start":!0,"aria-label":g?`Inicio do periodo`:`Data de referencia`,disabled:h,onChange:()=>{}}),(0,N.jsx)(`input`,{type:`date`,value:f.end||f.start||a.settings.defaultMealDate,"data-report-end":!0,"aria-label":`Fim do periodo`,disabled:!g,onChange:()=>{}})]}),(0,N.jsxs)(`button`,{className:`btn primary small`,type:`button`,"data-export-kpi":!0,children:[(0,N.jsx)(Sn,{icon:t,name:`chart`,size:14}),`KPI PDF`]}),(0,N.jsx)(br,{currentFilter:f,exportMenuOpen:e.exportMenuOpen,icon:t,isAllPeriod:h,isCustomPeriod:g})]})]})]}),(0,N.jsx)(`div`,{className:`finance-holes`,children:Array.from({length:14}).map((e,t)=>(0,N.jsx)(`span`,{},t))}),(0,N.jsxs)(`div`,{className:`finance-metrics-strip`,children:[(0,N.jsx)(yr,{accent:!0,icon:t,iconName:`clipboard`,label:`Total`,value:p,hint:`refeições no período`}),(0,N.jsx)(yr,{icon:t,iconName:`box`,label:`Marmitas`,value:s(c)[`Marmita Campo`]??0,hint:`entregas em campo`}),(0,N.jsx)(yr,{icon:t,iconName:`utensils`,label:`Almoços`,value:s(c)[`Buffer Almoço`]??s(c)[`Buffer Almoco`]??0,hint:`refeições no buffer`}),(0,N.jsx)(yr,{icon:t,iconName:`moon`,label:`Jantas`,value:s(c).Jantar??0,hint:`período noturno`})]})]}),(0,N.jsxs)(`section`,{className:`report-analytics mt-3`,children:[(0,N.jsxs)(`div`,{className:`report-insights`,children:[(0,N.jsxs)(`article`,{className:`report-insight`,children:[(0,N.jsx)(`span`,{children:`Consumido real`}),(0,N.jsx)(`strong`,{children:ar(l.consumed)}),(0,N.jsxs)(`p`,{children:[_,` do solicitado no filtro.`]})]}),(0,N.jsxs)(`article`,{className:`report-insight`,children:[(0,N.jsx)(`span`,{children:`Ocupacao`}),(0,N.jsx)(`strong`,{children:v}),(0,N.jsx)(`p`,{children:`Consumo comparado ao efetivo informado.`})]}),(0,N.jsxs)(`article`,{className:`report-insight`,children:[(0,N.jsx)(`span`,{children:`Custo estimado`}),(0,N.jsx)(`strong`,{children:or(l.value)}),(0,N.jsxs)(`p`,{children:[y,` por refeicao consumida.`]})]})]}),(0,N.jsxs)(`div`,{className:`report-chart-grid wide`,children:[(0,N.jsx)(fr,{className:`is-emphasis`,kicker:`KPI operacional`,title:`Solicitado x consumido x efetivo`,subtitle:`Comparacao por tipo de refeicao, seguindo a mesma leitura do KPI em PDF.`,chip:`${l.meals.length} tipos`,children:(0,N.jsx)(hr,{items:l.meals})}),(0,N.jsx)(fr,{kicker:`Distribuicao`,title:`Consumo por refeicao`,subtitle:`Participacao de cada alimentacao no total consumido.`,chip:ar(l.consumed),children:(0,N.jsx)(gr,{items:l.meals.map(e=>({label:e.label,value:e.consumed})),center:ar(l.consumed)})})]}),(0,N.jsxs)(`div`,{className:`report-chart-grid`,children:[(0,N.jsx)(fr,{kicker:`Status`,title:`Situacao dos pedidos`,subtitle:`Visao resumida do funil operacional, sem repetir a lista de pedidos.`,chip:`${c.length} pedidos`,children:(0,N.jsx)(gr,{items:l.statuses,center:String(c.length)})}),(0,N.jsx)(fr,{kicker:`Evolucao`,title:`Consumo diario`,subtitle:`Ultimos dias do periodo filtrado para identificar picos e quedas.`,chip:`${l.days.length} dias`,children:(0,N.jsx)(_r,{items:l.days})})]}),(0,N.jsxs)(`div`,{className:`report-chart-grid`,children:[(0,N.jsx)(fr,{kicker:`Areas e trechos`,title:`Top equipes por consumo`,subtitle:`Frentes com maior volume operacional no periodo.`,chip:`ranking`,children:(0,N.jsx)(mr,{items:l.sections,valueKey:`consumed`})}),(0,N.jsx)(fr,{kicker:`Financeiro`,title:`Custo por refeicao`,subtitle:`Estimativa baseada no preco unitario cadastrado.`,chip:or(l.value),children:(0,N.jsx)(mr,{items:l.meals,valueKey:`value`,format:or})})]}),(0,N.jsxs)(`div`,{className:`report-chart-grid wide`,children:[(0,N.jsx)(fr,{kicker:`Capacidade`,title:`Ocupacao diaria`,subtitle:`Consumo real comparado ao efetivo das equipes/trechos.`,chip:v,children:(0,N.jsx)(_r,{items:l.days.map(e=>({...e,occupancy:e.effective?Math.round(e.consumed/e.effective*100):0})),valueKey:`occupancy`,format:e=>`${e}%`})}),(0,N.jsx)(fr,{kicker:`Mapa de calor`,title:`Dia da semana x refeicao`,subtitle:`Concentracao de consumo por dia e tipo de alimentacao.`,chip:`heatmap`,children:(0,N.jsx)(vr,{meals:l.meals,heatmap:l.heatmap})})]})]})]})}var Er=`
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
`,Dr=`
  .admin-page .audit-panel { border-radius: 1rem; border: 1px solid #e7e5e4; background: rgba(255,255,255,.9); padding: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .timeline { display: grid; gap: .5rem; }
  .admin-page .timeline-item { display: grid; grid-template-columns: 12px minmax(0,1fr); gap: .75rem; border-radius: .75rem; border: 1px solid #e7e5e4; background: #fff; padding: .75rem; }
  .admin-page .timeline-dot { margin-top: .25rem; width: .75rem; height: .75rem; border-radius: 999px; background: #ea580c; }
`,Or=e=>({pedido:`Pedido de refeição`,meal_request:`Pedido de refeição`,tipo_alimentacao:`Tipo de alimentação`,meal_type:`Tipo de alimentação`,consolidacao:`Envio ao fornecedor`,consolidation:`Envio ao fornecedor`,fornecedor:`Fornecedor`,supplier:`Fornecedor`,usuario:`Usuário`,user:`Usuário`,seed:`Carga inicial`})[e]??String(e??`Registro`).replaceAll(`_`,` `);function kr({exportMenuOpen:e,formatDateTime:t,icon:n,state:r}){let i=r.auditLog,a=new Set(i.map(e=>e.userId)).size,o=new Set(i.map(e=>Or(e.entity))).size,s=i[0];return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`style`,{children:Er+Dr}),(0,N.jsx)(wn,{kicker:`Auditoria`,title:`Eventos do sistema`,totalValue:i.length,totalLabel:`eventos registrados`,description:`Registro de usuário, data e horário em todas as ações.`,actions:(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(Tn,{icon:n}),(0,N.jsx)(En,{exportMenuOpen:e,icon:n,id:`auditoria`,items:[[`pdf`,`PDF`,`chart`],[`xlsx`,`Excel`,`clipboard`]]})]}),metrics:[{icon:n,iconName:`history`,value:i.length,label:`Eventos`},{icon:n,iconName:`users`,value:a,label:`Usuários`},{icon:n,iconName:`package`,value:o,label:`Areas`},{icon:n,iconName:`clock`,value:s?t(s.at):`-`,label:`Ultimo registro`}]}),(0,N.jsxs)(`div`,{className:`audit-panel`,children:[(0,N.jsx)(`h2`,{className:`section-title`,children:`Eventos do sistema`}),(0,N.jsx)(`div`,{className:`timeline`,children:i.map(e=>(0,N.jsxs)(`div`,{className:`timeline-item`,children:[(0,N.jsx)(`div`,{className:`timeline-dot`}),(0,N.jsxs)(`div`,{className:`timeline-body`,children:[(0,N.jsx)(`strong`,{children:e.action}),(0,N.jsx)(`br`,{}),kn(r,e.userId),` - `,t(e.at),` - `,Or(e.entity)]})]},e.id))})]})]})}var Ar=`
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
`,jr=`
  .admin-page .admin-home-hero.compact { margin-bottom: .75rem; display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; border-radius: 18px; border: 1px solid #e7e5e4; border-left: 5px solid #ea580c; background: rgba(255,255,255,.9); color: #1c1917; padding: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .admin-more-grid { display: grid; grid-template-columns: minmax(0,1fr); gap: .5rem; }
  .admin-page .admin-more-tile { display: grid; min-height: 4.7rem; grid-template-columns: 3rem minmax(0,1fr); align-items: center; gap: .9rem; border-radius: 1rem; border: 1px solid #e7e5e4; background: rgba(255,255,255,.9); padding: .9rem 1rem; text-align: left; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .admin-page .admin-more-tile:hover { border-color: #fdba74; background: #fff7ed; }
  .admin-page .admin-more-tile strong { min-width: 0; font-size: 1.12rem; line-height: 1.05; color: #78716c; }
`;function Mr(e){let{icon:t}=e;return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`style`,{children:Ar+jr}),(0,N.jsxs)(`section`,{className:`admin-more`,children:[(0,N.jsx)(`header`,{className:`admin-home-hero compact`,children:(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{className:`compact-kicker`,children:`Administração`}),(0,N.jsx)(`h1`,{children:`Mais ferramentas`}),(0,N.jsx)(`p`,{children:`Acesse as áreas de consulta e ajustes sem deixar o rodapé principal carregado.`})]})}),(0,N.jsx)(`div`,{className:`admin-more-grid`,children:[[`financeiro`,`chart`,`Financeiro`],[`relatorios`,`chart`,`Relatórios`],[`auditoria`,`history`,`Auditoria`],[`configuracoes`,`settings`,`Configurações`]].map(([e,n,r])=>(0,N.jsxs)(`button`,{className:`admin-more-tile`,"data-view":e,children:[(0,N.jsx)(`span`,{children:(0,N.jsx)(Sn,{icon:t,name:n,size:24})}),(0,N.jsx)(`strong`,{children:r})]},e))})]})]})}var Nr=`
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
      min-height: 2.05rem;
      padding-inline: .56rem;
      font-size: .7rem;
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
`;function Pr(e){let t;return t=e.page===`painel`?(0,N.jsx)(Vn,{...e}):e.page===`pedidos`?(0,N.jsx)(Wn,{...e}):e.page===`consolidacao`?(0,N.jsx)(Yn,{...e}):e.page===`financeiro`?(0,N.jsx)($n,{...e}):e.page===`relatorios`?(0,N.jsx)(Tr,{...e}):e.page===`auditoria`?(0,N.jsx)(kr,{...e}):(0,N.jsx)(Mr,{...e}),(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`div`,{className:`admin-page`,children:t}),(0,N.jsx)(`style`,{children:Nr})]})}var Fr=new WeakMap;function Ir(e=document){e.querySelectorAll(`[data-admin-react-root]`).forEach(e=>{let t=Fr.get(e);t&&(t.unmount(),Fr.delete(e))})}function Lr(e,t){let n=e.querySelector(`[data-admin-react-root]`);if(!n)return;let r=Fr.get(n);r||(r=(0,un.createRoot)(n),Fr.set(n,r)),(0,ln.flushSync)(()=>{r.render((0,N.jsx)(Pr,{...t}))})}function Rr({icon:e,iconName:t,label:n,value:r}){return(0,N.jsxs)(`div`,{className:`flex min-w-0 flex-col items-start gap-1.5 rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-300 bg-white px-2.5 py-3 shadow-sm sm:flex-row sm:items-center sm:gap-3 sm:px-4`,children:[(0,N.jsx)(`span`,{className:`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-700 sm:h-9 sm:w-9`,children:(0,N.jsx)(P,{icon:e,name:t,size:16})}),(0,N.jsxs)(`div`,{className:`min-w-0 flex-1 leading-tight`,children:[(0,N.jsx)(`strong`,{className:`block truncate text-base font-black text-stone-900`,children:r}),(0,N.jsx)(`span`,{className:`block text-[10px] font-bold uppercase leading-[1.15] tracking-normal text-stone-500`,children:n})]})]})}function zr(e){let{countStatus:t,formatDate:n,icon:r,state:i,sumQty:a,user:o}=e,s=(0,cn.useMemo)(()=>bn(i,o),[i,o]),c=s.filter(e=>e.status!==`cancelado`),l=s[0],u=a(c),d=t(s,`rascunho`);return(0,N.jsxs)(`div`,{className:dn,children:[(0,N.jsxs)(`section`,{className:`overflow-hidden rounded-[22px] border border-stone-800 bg-[#242622] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.55)]`,children:[(0,N.jsxs)(`div`,{className:`relative px-4 pb-7 pt-4 text-white sm:px-6 sm:pt-5`,children:[(0,N.jsx)(`div`,{className:`pointer-events-none absolute inset-0 opacity-[0.05]`,style:{backgroundImage:`radial-gradient(currentColor 1.4px, transparent 1.4px)`,backgroundSize:`16px 16px`}}),(0,N.jsxs)(`div`,{className:`relative flex items-start justify-between gap-3`,children:[(0,N.jsxs)(`div`,{className:`min-w-0`,children:[(0,N.jsx)(`p`,{className:`m-0 text-[10px] font-black uppercase tracking-[.16em] text-orange-200`,children:`Histórico do líder`}),(0,N.jsxs)(`div`,{className:`mt-2 flex items-end gap-2.5`,children:[(0,N.jsx)(`span`,{className:`text-[46px] font-black leading-[0.85] tracking-tight sm:text-[60px]`,children:s.length}),(0,N.jsxs)(`span`,{className:`mb-1 text-[10px] font-extrabold uppercase leading-tight tracking-[.1em] text-white/55 sm:text-xs`,children:[`pedidos`,(0,N.jsx)(`br`,{}),`registrados`]})]}),(0,N.jsx)(`p`,{className:`m-0 mt-1.5 text-xs font-bold text-white/55 sm:text-sm`,children:l?`Ultimo movimento em ${n(l.date)}`:`Nenhum pedido registrado ainda`})]}),(0,N.jsxs)(`button`,{className:`${mn} shrink-0 shadow-lg shadow-orange-950/20`,"data-view":`pedido`,children:[(0,N.jsx)(P,{icon:r,name:`plus`,size:15}),`Novo`]})]}),(0,N.jsx)(`div`,{className:`pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-around px-4`,children:Array.from({length:14}).map((e,t)=>(0,N.jsx)(`span`,{className:`h-2.5 w-2.5 rounded-full bg-white`},t))})]}),(0,N.jsxs)(`div`,{className:`grid grid-cols-3 gap-2 bg-stone-50 px-4 pb-3 pt-5 sm:px-6`,children:[(0,N.jsx)(Rr,{icon:r,iconName:`clipboard`,value:s.length,label:`Pedidos registrados`}),(0,N.jsx)(Rr,{icon:r,iconName:`utensils`,value:u,label:`Refeições`}),(0,N.jsx)(Rr,{icon:r,iconName:`clock`,value:d,label:`Rascunhos`})]})]}),s.length?(0,N.jsx)(`section`,{className:`grid gap-3`,children:(0,N.jsx)(`div`,{className:`grid grid-cols-1 gap-2 lg:grid-cols-2`,children:s.map(t=>(0,cn.createElement)(xn,{...e,request:t,compact:!0,key:t.id}))})}):(0,N.jsxs)(`div`,{className:`grid justify-items-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-white px-6 py-8 text-center shadow-sm`,children:[(0,N.jsx)(`span`,{className:`grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-orange-700`,children:(0,N.jsx)(P,{icon:r,name:`clipboard`,size:22})}),(0,N.jsx)(`strong`,{children:`Histórico vazio`}),(0,N.jsx)(`p`,{className:`m-0 text-sm text-stone-500`,children:`Os pedidos enviados ou salvos como rascunho aparecerão aqui.`}),(0,N.jsxs)(`button`,{className:mn,"data-view":`pedido`,children:[(0,N.jsx)(P,{icon:r,name:`plus`,size:15}),`Novo pedido`]})]})]})}var Br={rascunho:`Rascunho`,pendente:`Pendente`,aprovado:`Aprovado`,cancelado:`Cancelado`},Vr={rascunho:`border-stone-400/60 text-stone-300`,pendente:`border-amber-300/70 text-amber-300`,aprovado:`border-emerald-300/70 text-emerald-300`,cancelado:`border-rose-300/70 text-rose-300`};function Hr({icon:e,iconName:t,value:n,label:r}){return(0,N.jsxs)(`div`,{className:`flex min-w-0 flex-1 items-center gap-2.5 rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-300 bg-white px-3 py-3 shadow-sm sm:gap-3 sm:px-4`,children:[(0,N.jsx)(`span`,{className:`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-700`,children:(0,N.jsx)(P,{icon:e,name:t,size:16})}),(0,N.jsxs)(`div`,{className:`min-w-0 flex-1 leading-tight`,children:[(0,N.jsx)(`div`,{className:`truncate text-base font-black text-stone-900`,children:n}),(0,N.jsx)(`div`,{className:`line-clamp-2 text-[10px] font-bold uppercase leading-[1.15] tracking-normal text-stone-500`,children:r})]})]})}function Ur(e){let{countStatus:t,formatDate:n,icon:r,state:i,sumQty:a,user:o}=e,s=(0,cn.useMemo)(()=>bn(i,o),[i,o]),c=s.filter(e=>e.status!==`cancelado`),l=i.settings.defaultMealDate,u=c.filter(e=>e.date===l),d=u[0]??c[0]??s[0],f=a(u),p=t(c,`rascunho`),m=d?d.date===l?`Pedido de hoje`:`Ultimo pedido`:`Sem pedido ativo`,h=Vr[d?.status]??`border-white/25 text-white/45`;return(0,N.jsxs)(`div`,{className:dn,children:[(0,N.jsxs)(`div`,{className:`flex items-center justify-between px-1`,children:[(0,N.jsx)(`p`,{className:`text-[10px] font-black uppercase tracking-[.16em] text-orange-700`,children:`Painel do lider`}),(0,N.jsxs)(`button`,{className:`inline-flex items-center gap-1 text-xs font-extrabold text-stone-500 transition hover:text-orange-700`,"data-view":`historico`,children:[`Pedidos anteriores`,(0,N.jsx)(P,{icon:r,name:`arrow`,size:13})]})]}),(0,N.jsxs)(`section`,{className:`overflow-hidden rounded-[22px] border border-stone-800 bg-[#242622] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.55)]`,children:[(0,N.jsxs)(`div`,{className:`relative px-4 pb-7 pt-4 text-white sm:px-6 sm:pt-5`,children:[(0,N.jsx)(`div`,{className:`pointer-events-none absolute inset-0 opacity-[0.05]`,style:{backgroundImage:`radial-gradient(currentColor 1.4px, transparent 1.4px)`,backgroundSize:`16px 16px`}}),d?(0,N.jsx)(`span`,{className:`absolute right-4 top-4 -rotate-6 rounded-md border-2 px-2 py-1 text-[9px] font-black uppercase tracking-[.12em] sm:right-6 sm:top-5 ${h}`,children:Br[d.status]??d.status}):null,(0,N.jsxs)(`p`,{className:`relative text-[10px] font-black uppercase tracking-[.16em] text-orange-200`,children:[`Hoje · `,n(l)]}),(0,N.jsxs)(`div`,{className:`relative mt-2 flex items-end gap-2.5`,children:[(0,N.jsx)(`span`,{className:`text-[48px] font-black leading-[0.85] tracking-tight sm:text-[64px]`,children:f}),(0,N.jsxs)(`span`,{className:`mb-1 text-[10px] font-extrabold uppercase leading-tight tracking-[.1em] text-white/55 sm:text-xs`,children:[`refeições`,(0,N.jsx)(`br`,{}),`hoje`]})]}),(0,N.jsxs)(`p`,{className:`relative mt-1.5 text-xs font-bold text-white/55 sm:text-sm`,children:[m,d&&d.date!==l?` \u00b7 ${n(d.date)}`:``]}),(0,N.jsx)(`div`,{className:`pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-around px-4`,children:Array.from({length:14}).map((e,t)=>(0,N.jsx)(`span`,{className:`h-2.5 w-2.5 rounded-full bg-white`},t))})]}),(0,N.jsxs)(`div`,{className:`grid grid-cols-2 gap-2 bg-stone-50 px-4 pb-3 pt-5 sm:px-6`,children:[(0,N.jsx)(Hr,{icon:r,iconName:`utensils`,value:f,label:`Refeicoes hoje`}),(0,N.jsx)(Hr,{icon:r,iconName:`clipboard`,value:p,label:p===1?`Rascunho`:`Rascunhos`})]}),(0,N.jsx)(`div`,{className:`bg-white px-4 pb-3 pt-5 text-stone-900 sm:px-6`,children:d?(0,N.jsx)(xn,{...e,request:d}):(0,N.jsxs)(`div`,{className:`grid justify-items-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-8 text-center`,children:[(0,N.jsx)(`span`,{className:`grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-orange-700`,children:(0,N.jsx)(P,{icon:r,name:`clipboard`,size:22})}),(0,N.jsxs)(`strong`,{className:`text-stone-900`,children:[`Nada pendente para `,n(l)]}),(0,N.jsx)(`p`,{className:`m-0 max-w-md text-sm text-stone-500`,children:`Quando precisar alimentar a equipe, crie o pedido em poucos passos.`})]})}),(0,N.jsxs)(`div`,{className:`flex flex-col gap-3 border-t border-stone-100 bg-stone-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6`,children:[(0,N.jsxs)(`span`,{className:`inline-flex items-center gap-2 text-xs font-bold text-stone-500`,children:[(0,N.jsx)(P,{icon:r,name:`clock`,size:14}),`Prazo: ate `,i.settings.cutoffTime,` do dia anterior`]}),(0,N.jsxs)(`button`,{className:`${mn} w-full justify-center shadow-lg shadow-orange-950/20 transition active:scale-[0.97] sm:w-auto`,"data-view":`pedido`,children:[(0,N.jsx)(P,{icon:r,name:`plus`,size:16}),`Novo pedido`]})]})]})]})}var Wr=`overflow-hidden rounded-[18px] border border-stone-200 bg-white shadow-[0_12px_30px_rgba(25,27,24,.06)]`;function Gr({children:e,number:t,title:n}){return(0,N.jsxs)(`section`,{className:Wr,children:[(0,N.jsx)(`div`,{className:`border-b border-dashed border-stone-200 bg-stone-50 px-4 py-3`,children:(0,N.jsx)(vn,{number:t,title:n})}),(0,N.jsx)(`div`,{className:`p-3 sm:p-4`,children:e})]})}function Kr({icon:e,state:t,user:n}){let[r,i]=(0,cn.useState)(t.mealTypes[0]?.id??``),a=new Date,o=new Date(a.getTime()-a.getTimezoneOffset()*6e4).toISOString().slice(0,10),s=t.mealTypes.find(e=>e.id===r)??t.mealTypes[0],c=v(t,n.id),l=s?.locations?.[0]?.id??``;return(0,cn.useEffect)(()=>{t.mealTypes.some(e=>e.id===r)||i(t.mealTypes[0]?.id??``)},[r,t.mealTypes]),t.mealTypes.length?(0,N.jsxs)(`form`,{className:`grid gap-3 sm:gap-4`,"data-form":`request`,children:[(0,N.jsx)(Gr,{number:`1`,title:`Quando e quantas?`,children:(0,N.jsxs)(`div`,{className:`grid gap-3 sm:grid-cols-2`,children:[(0,N.jsx)(_n,{id:`request-quantity`,label:`Quantidade de refeicoes`,children:(0,N.jsxs)(`div`,{className:`grid grid-cols-[44px_minmax(0,1fr)] overflow-hidden rounded-lg border border-stone-300 bg-white shadow-sm`,children:[(0,N.jsx)(`span`,{className:`grid place-items-center bg-stone-50 text-orange-700`,children:(0,N.jsx)(P,{icon:e,name:`users`,size:20})}),(0,N.jsx)(`input`,{className:`min-h-12 w-full border-0 px-3 text-lg font-black outline-none`,id:`request-quantity`,name:`quantity`,type:`number`,min:`1`,defaultValue:`10`,inputMode:`numeric`,required:!0})]})}),(0,N.jsx)(_n,{id:`request-date`,label:`Data da refeicao`,children:(0,N.jsx)(`input`,{className:pn,id:`request-date`,name:`date`,type:`date`,min:o,defaultValue:o,required:!0})})]})}),(0,N.jsx)(Gr,{number:`2`,title:`Qual refeicao?`,children:(0,N.jsx)(`div`,{className:`grid gap-2 sm:grid-cols-3`,children:t.mealTypes.map((t,n)=>(0,N.jsxs)(`label`,{className:`grid cursor-pointer grid-cols-[34px_minmax(0,1fr)_18px] items-start gap-3 rounded-r-2xl rounded-l-md border border-l-2 border-dashed border-stone-200 bg-white p-3 transition has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50`,children:[(0,N.jsx)(`input`,{className:`sr-only`,type:`radio`,name:`mealTypeId`,value:t.id,checked:r===t.id,onChange:()=>i(t.id)}),(0,N.jsx)(`span`,{className:`grid h-9 w-9 place-items-center rounded-lg bg-stone-100 text-orange-700`,children:(0,N.jsx)(P,{icon:e,name:n===0?`package`:`utensils`,size:20})}),(0,N.jsxs)(`span`,{className:`min-w-0`,children:[(0,N.jsx)(`span`,{className:`block font-black text-stone-950`,children:t.label}),(0,N.jsx)(`span`,{className:`mt-1 block text-xs font-semibold text-stone-500`,children:t.description||`Sem composicao cadastrada`})]}),(0,N.jsx)(`span`,{className:`mt-1 h-4 w-4 rounded-full border border-stone-300 bg-white shadow-inner`})]},t.id))})}),(0,N.jsxs)(Gr,{number:`3`,title:`Equipe / trecho`,children:[(0,N.jsx)(`input`,{type:`hidden`,name:`locationId`,value:l}),(0,N.jsxs)(`div`,{className:`grid gap-3 sm:grid-cols-2`,children:[(0,N.jsx)(_n,{id:`request-team`,label:`Equipe ou trecho`,children:(0,N.jsx)(`select`,{className:pn,id:`request-team`,name:`teamId`,required:!0,children:c.length?c.map(e=>(0,N.jsxs)(`option`,{value:e.id,children:[e.name,` - efetivo `,e.headcount]},e.id)):(0,N.jsx)(`option`,{value:``,children:`Nenhuma equipe ativa`})})}),(0,N.jsx)(_n,{id:`request-leader`,label:`Responsavel`,children:(0,N.jsx)(`input`,{className:`${pn} bg-stone-50 text-stone-500`,id:`request-leader`,value:n.name,disabled:!0,readOnly:!0})})]}),c.length?null:(0,N.jsx)(`div`,{className:`mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700`,children:`Cadastre uma equipe/trecho ativo antes de enviar pedidos.`}),(0,N.jsx)(`div`,{className:`mt-3`,children:(0,N.jsx)(_n,{id:`request-notes`,label:`Observacao`,optional:!0,children:(0,N.jsx)(`textarea`,{className:`${pn} min-h-24 resize-y`,id:`request-notes`,name:`notes`,placeholder:`Ex.: reforco de efetivo, ajuste de equipe ou observacao operacional`})})})]}),(0,N.jsxs)(`div`,{className:`sticky bottom-2 z-[2] grid gap-2 rounded-[18px] border border-stone-800 bg-[#242622]/95 p-3 text-white shadow-[0_18px_44px_rgba(25,27,24,.24)] backdrop-blur sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center`,children:[(0,N.jsxs)(`div`,{className:`inline-flex items-center gap-2 text-xs font-bold text-white/65`,children:[(0,N.jsx)(P,{icon:e,name:`clock`,size:16}),`Limite: `,t.settings.cutoffTime,` do dia anterior`]}),(0,N.jsxs)(`div`,{className:`grid grid-cols-2 gap-2`,children:[(0,N.jsx)(`button`,{className:`${hn} border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/15`,type:`submit`,name:`status`,value:`rascunho`,children:`Salvar rascunho`}),(0,N.jsxs)(`button`,{className:mn,type:`submit`,name:`status`,value:`enviado`,disabled:!c.length,children:[`Enviar pedido `,(0,N.jsx)(P,{icon:e,name:`arrow`,size:16})]})]})]})]}):(0,N.jsxs)(`div`,{className:`${fn} text-center`,children:[(0,N.jsx)(`span`,{className:`mx-auto grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-orange-700`,children:(0,N.jsx)(P,{icon:e,name:`clipboard`,size:22})}),(0,N.jsx)(`strong`,{children:`Nenhuma alimentacao ativa`}),(0,N.jsx)(`p`,{className:`m-0 text-sm text-stone-500`,children:`Administrador ou fornecedor precisa cadastrar um tipo de alimentacao antes do pedido.`})]})}function qr({formatDate:e,icon:t,state:n,...r}){return(0,N.jsxs)(`div`,{className:dn,children:[(0,N.jsx)(`header`,{className:`overflow-hidden rounded-[22px] border border-stone-800 bg-[#242622] text-white shadow-[0_18px_40px_-22px_rgba(0,0,0,0.55)]`,children:(0,N.jsxs)(`div`,{className:`relative px-4 pb-7 pt-4 sm:px-6 sm:pt-5`,children:[(0,N.jsx)(`div`,{className:`pointer-events-none absolute inset-0 opacity-[0.05]`,style:{backgroundImage:`radial-gradient(currentColor 1.4px, transparent 1.4px)`,backgroundSize:`16px 16px`}}),(0,N.jsxs)(`div`,{className:`relative flex items-start justify-between gap-3`,children:[(0,N.jsxs)(`div`,{className:`min-w-0`,children:[(0,N.jsx)(`p`,{className:`m-0 text-[10px] font-black uppercase tracking-[.16em] text-orange-200`,children:`Comanda da obra`}),(0,N.jsx)(`h1`,{className:`m-0 mt-1 text-[24px] font-black leading-none tracking-normal sm:text-[30px]`,children:`Novo pedido`}),(0,N.jsxs)(`p`,{className:`m-0 mt-1.5 text-xs font-bold text-white/55 sm:text-sm`,children:[`Refeição para `,e(n.settings.defaultMealDate)]})]}),(0,N.jsx)(`span`,{className:`grid h-10 w-10 shrink-0 place-items-center rounded-r-xl rounded-l-md border border-white/10 bg-white/8 text-orange-200`,children:(0,N.jsx)(P,{icon:t,name:`clipboard`,size:19})})]}),(0,N.jsx)(`div`,{className:`pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-around px-4`,children:Array.from({length:14}).map((e,t)=>(0,N.jsx)(`span`,{className:`h-2.5 w-2.5 rounded-full bg-white`},t))})]})}),(0,N.jsx)(Kr,{...r,formatDate:e,icon:t,state:n})]})}function Jr(e){return e.page===`inicio`?(0,N.jsx)(Ur,{...e}):e.page===`historico`?(0,N.jsx)(zr,{...e}):(0,N.jsx)(qr,{...e})}var Yr=new WeakMap;function Xr(e=document){e.querySelectorAll(`[data-leader-react-root]`).forEach(e=>{let t=Yr.get(e);t&&(t.unmount(),Yr.delete(e))})}function Zr(e,t){let n=e.querySelector(`[data-leader-react-root]`);if(!n)return;let r=Yr.get(n);r||(r=(0,un.createRoot)(n),Yr.set(n,r)),(0,ln.flushSync)(()=>{r.render((0,N.jsx)(Jr,{...t}))})}function Qr({icon:e,name:t,size:n=16}){return(0,N.jsx)(`span`,{className:`inline-icon`,"aria-hidden":`true`,dangerouslySetInnerHTML:{__html:e(t,n)}})}function $r({icon:e}){return(0,N.jsxs)(`button`,{className:`admin-back-button supplier-back-button`,"data-view":`fornecedor-mais`,"aria-label":`Voltar para mais`,children:[(0,N.jsx)(Qr,{icon:e,name:`arrow-left`,size:15}),(0,N.jsx)(`span`,{children:`Voltar`})]})}function ei({icon:e,iconName:t,label:n,value:r}){return(0,N.jsxs)(`div`,{className:`admin-receipt-chip${String(r).length>12?` is-long-value`:``}`,children:[(0,N.jsx)(`span`,{className:`admin-receipt-chip-icon`,children:(0,N.jsx)(Qr,{icon:e,name:t,size:15})}),(0,N.jsxs)(`div`,{className:`admin-receipt-chip-text`,children:[(0,N.jsx)(`strong`,{children:r}),(0,N.jsx)(`span`,{children:n})]})]})}function ti({actions:e,backAction:t,className:n=``,description:r,kicker:i,metrics:a=[],title:o,totalLabel:s,totalValue:c}){let l=Math.max(a.length,1);return(0,N.jsxs)(`div`,{className:`admin-receipt ${n}`.trim(),children:[(0,N.jsxs)(`header`,{className:`admin-receipt-head`,children:[t,(0,N.jsxs)(`div`,{className:`admin-receipt-main`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{className:`compact-kicker`,children:i}),(0,N.jsx)(`h1`,{children:o}),(0,N.jsx)(`p`,{children:r})]}),(0,N.jsxs)(`div`,{className:`admin-receipt-total`,children:[(0,N.jsx)(`strong`,{children:c}),(0,N.jsx)(`span`,{children:s})]})]}),e?(0,N.jsx)(`div`,{className:`admin-receipt-actions`,children:e}):null]}),a.length?(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`div`,{className:`admin-receipt-holes`,children:Array.from({length:14}).map((e,t)=>(0,N.jsx)(`span`,{},t))}),(0,N.jsx)(`div`,{className:`admin-receipt-metrics`,"data-count":l,style:{"--receipt-metric-count":l},children:a.map(e=>(0,cn.createElement)(ei,{...e,key:`${e.label}-${e.value}`}))})]}):null]})}function ni({children:e,icon:t,label:n=`Filtros`}){return(0,N.jsxs)(`details`,{className:`admin-filter-menu`,children:[(0,N.jsxs)(`summary`,{children:[(0,N.jsx)(Qr,{icon:t,name:`filter`,size:15}),n]}),(0,N.jsx)(`div`,{className:`admin-filter-popover`,children:e})]})}function ri(e,t){return e.users.find(e=>e.id===t)?.name??`Usuario`}function ii(e,t){return e.consolidations.filter(e=>e.supplierId===t?.id).sort((e,t)=>t.date.localeCompare(e.date)||new Date(t.createdAt??0)-new Date(e.createdAt??0))}function ai(e,t){return e.consolidationDocuments.filter(e=>e.consolidationId===t)}function oi(e,t){return e.filter(e=>e.status===t).length}function si(e,t){return e[t]??t}function ci(e){return Object.entries(e.byMeal).map(([e,t])=>`${t.total} ${e}`).join(` - `)}function li({requestMealDescription:e,state:t,summary:n}){return n.rows.length?(0,N.jsxs)(N.Fragment,{children:[Object.entries(n.byMeal).map(([n,r])=>(0,N.jsxs)(`div`,{className:`consolidated-block`,children:[(0,N.jsxs)(`div`,{className:`consolidated-row total-line`,children:[(0,N.jsx)(`span`,{children:n}),(0,N.jsx)(`span`,{children:r.total})]}),e(r.rows[0])?(0,N.jsx)(`div`,{className:`consolidated-description`,children:e(r.rows[0])}):null,r.rows.map(e=>(0,N.jsxs)(`div`,{className:`consolidated-row`,children:[(0,N.jsx)(`span`,{children:e.sectionName||e.location||ri(t,e.leaderId)}),(0,N.jsx)(`strong`,{children:e.quantity})]},e.id))]},n)),(0,N.jsxs)(`div`,{className:`consolidated-row total-line`,children:[(0,N.jsx)(`span`,{children:`Total geral`}),(0,N.jsxs)(`span`,{children:[n.total,` refeicoes`]})]})]}):(0,N.jsx)(`div`,{className:`empty`,children:`Sem pedidos recebidos para enviar ao fornecedor.`})}function ui({consolidation:e,formatDateTime:t,state:n}){return(0,N.jsx)(`div`,{className:`timeline`,children:[[`enviado`,`Enviado ao fornecedor`],[`confirmado`,`Fornecedor confirmou recebimento`],...e.confirmations.some(e=>e.step===`producao`)||e.status===`producao`?[[`producao`,`Fornecedor confirmou producao`]]:[],[`saiu_entrega`,`Saida registrada`]].map(([r,i])=>{let a=e.confirmations.find(e=>e.step===r);return(0,N.jsxs)(`div`,{className:`timeline-item`,children:[(0,N.jsx)(`div`,{className:`timeline-dot`,style:{background:a?`var(--orange)`:`var(--line)`}}),(0,N.jsxs)(`div`,{className:`timeline-body`,children:[(0,N.jsx)(`strong`,{children:i}),(0,N.jsx)(`br`,{}),a?`${ri(n,a.userId)} - ${t(a.at)}`:`Aguardando`]})]},r)})})}function di({formatDate:e,formatDateTime:t,rows:n,state:r,STATUS_LABEL:i}){return n.length?(0,N.jsx)(`div`,{className:`supplier-origin-list`,children:n.map(n=>(0,N.jsxs)(`article`,{className:`supplier-origin-card`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`strong`,{children:n.mealType}),(0,N.jsx)(`span`,{className:`badge ${n.status}`,children:i[n.status]??n.status})]}),(0,N.jsxs)(`p`,{children:[ri(r,n.leaderId),` - `,n.sectionName||n.location]}),(0,N.jsxs)(`footer`,{children:[(0,N.jsx)(`span`,{children:e(n.date)}),(0,N.jsxs)(`b`,{children:[n.quantity,` ref.`]}),(0,N.jsx)(`small`,{children:t(n.updatedAt)})]})]},n.id))}):(0,N.jsx)(`div`,{className:`empty`,children:`Nenhum pedido de origem encontrado.`})}var fi=`
  .supplier-page .supplier-daily-block-list { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); align-items: start; gap: .75rem; }
  .supplier-page .supplier-daily-block-card { display: grid; min-width: 0; overflow: hidden; border-radius: 16px; border: 1px solid #e7e5e4; border-left: 2px dashed #d6d3d1; background: #fffefa; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .supplier-page .supplier-daily-block-card.is-extra { border-color: #fdba74; border-left-color: #ea580c; background: #fff7ed; }
  .supplier-page .supplier-daily-block-head { display: grid; gap: .55rem; border-bottom: 1px solid #f5f5f4; padding: .75rem; }
  .supplier-page .supplier-daily-block-head-main { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: start; gap: .75rem; }
  .supplier-page .supplier-daily-block-head h2 { font-size: 1rem; line-height: 1; color: #1c1917; }
  .supplier-page .supplier-daily-block-head p { color: #78716c; font-size: .72rem; font-weight: 800; }
  .supplier-page .supplier-daily-block-total { text-align: right; }
  .supplier-page .supplier-daily-block-total strong { display: block; font-size: 1.55rem; line-height: .9; font-weight: 950; color: #1c1917; }
  .supplier-page .supplier-daily-block-total span { display: block; margin-top: .15rem; font-size: 9px; font-weight: 950; text-transform: uppercase; color: #78716c; }
  .supplier-page .supplier-daily-food-summary { display: flex; flex-wrap: wrap; gap: .35rem; }
  .supplier-page .supplier-daily-food-chip { display: inline-flex; min-width: 0; align-items: center; gap: .32rem; border-radius: 999px; border: 1px solid #fed7aa; background: #fff7ed; padding: .28rem .48rem; color: #c2410c; }
  .supplier-page .supplier-daily-food-chip strong { font-size: .78rem; line-height: 1; font-weight: 950; }
  .supplier-page .supplier-daily-food-chip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 950; text-transform: uppercase; }
  .supplier-page .supplier-daily-extra-chip { display: inline-flex; width: fit-content; align-items: center; gap: .28rem; border-radius: 999px; border: 1px solid #fb923c; background: #ffedd5; padding: .28rem .5rem; color: #9a3412; font-size: 9px; font-weight: 950; text-transform: uppercase; }
  .supplier-page .supplier-daily-block-body { display: grid; gap: .35rem; padding: .65rem .75rem; }
  .supplier-page .supplier-daily-request-row { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: center; gap: .55rem; border-radius: .75rem; background: #fafaf9; padding: .55rem .6rem; }
  .supplier-page .supplier-daily-request-title { min-width: 0; }
  .supplier-page .supplier-daily-request-title strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .85rem; color: #1c1917; }
  .supplier-page .supplier-daily-request-title small { display: block; margin-top: .12rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #78716c; font-size: .68rem; font-weight: 800; }
  .supplier-page .supplier-daily-request-qty { min-width: 2.75rem; text-align: right; }
  .supplier-page .supplier-daily-request-qty strong { display: block; font-size: 1rem; line-height: 1; font-weight: 950; color: #1c1917; }
  .supplier-page .supplier-daily-request-qty small { font-size: 9px; font-weight: 900; color: #78716c; text-transform: uppercase; }
  .supplier-page .supplier-daily-block-footer { display: grid; gap: .5rem; border-top: 1px solid #f5f5f4; padding: .65rem .75rem .75rem; }
  .supplier-page .supplier-daily-update-alert { display: grid; grid-template-columns: auto minmax(0,1fr); align-items: center; gap: .45rem; border-radius: .75rem; border: 1px solid #fed7aa; background: #fff7ed; padding: .55rem .6rem; color: #9a3412; }
  .supplier-page .supplier-daily-update-alert strong { display: block; font-size: .72rem; font-weight: 950; text-transform: uppercase; }
  .supplier-page .supplier-daily-update-alert span { display: block; margin-top: .08rem; font-size: .68rem; font-weight: 800; color: #c2410c; }
  .supplier-page .supplier-daily-total-line { display: flex; align-items: center; justify-content: space-between; gap: .75rem; font-size: .82rem; font-weight: 950; color: #1c1917; }
  .supplier-page .supplier-daily-actions { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .4rem; }
  .supplier-page .supplier-daily-actions .btn { width: 100%; min-height: 2.35rem; }
  @media (max-width: 767px) {
    .supplier-page .supplier-daily-block-list { grid-template-columns: 1fr; }
  }
  @media (min-width: 768px) and (max-width: 1180px) {
    .supplier-page .supplier-daily-block-list { grid-template-columns: repeat(2,minmax(0,1fr)); }
  }
`;function pi(e){let{consolidation:t,formatDate:n,getConsolidationSummary:r,icon:i,nextSupplierStep:a,STATUS_LABEL:o}=e,s=r(e.state,t),c=a(t.status),l=new Date(t.createdAt??t.sentAt??0).getTime(),u=Number.isFinite(l)&&(e.state.consolidations??[]).some(e=>{if(e.id===t.id||e.date!==t.date||e.supplierId!==t.supplierId||e.status===`rascunho`)return!1;let n=new Date(e.createdAt??e.sentAt??0).getTime();return Number.isFinite(n)&&n<l}),d=Object.entries(s.byMeal),f=new Set(s.rows.map(e=>e.leaderId)).size,p=new Set(s.rows.map(e=>e.teamId||e.sectionName||e.location)).size,m=t.sentAt?s.rows.filter(e=>e.updatedAt&&new Date(e.updatedAt)>new Date(t.sentAt)):[],h=t.status===`enviado`&&(m.length>0||(t.revisions?.length??0)>0);return(0,N.jsxs)(`article`,{className:`supplier-daily-block-card${u?` is-extra`:``}`,children:[(0,N.jsxs)(`header`,{className:`supplier-daily-block-head`,children:[(0,N.jsxs)(`div`,{className:`supplier-daily-block-head-main`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{className:`compact-kicker`,children:u?`Pedido extra`:`Bloco diario`}),(0,N.jsx)(`h2`,{children:n(t.date)}),(0,N.jsxs)(`p`,{children:[s.rows.length,` pedidos - `,f,` encarregados - `,p,` equipes`]})]}),(0,N.jsxs)(`div`,{className:`supplier-daily-block-total`,children:[(0,N.jsx)(`strong`,{children:s.total}),(0,N.jsx)(`span`,{children:`refeicoes`})]})]}),u?(0,N.jsxs)(`span`,{className:`supplier-daily-extra-chip`,children:[(0,N.jsx)(Qr,{icon:i,name:`plus`,size:12}),`Pedido extra da data`]}):null,(0,N.jsx)(`div`,{className:`supplier-daily-food-summary`,children:d.map(([e,t])=>(0,N.jsxs)(`div`,{className:`supplier-daily-food-chip`,children:[(0,N.jsx)(`strong`,{children:t.total}),(0,N.jsx)(`span`,{children:e})]},e))})]}),(0,N.jsx)(`div`,{className:`supplier-daily-block-body`,children:s.rows.map(t=>(0,N.jsxs)(`div`,{className:`supplier-daily-request-row`,children:[(0,N.jsxs)(`div`,{className:`supplier-daily-request-title`,children:[(0,N.jsx)(`strong`,{children:ri(e.state,t.leaderId)}),(0,N.jsxs)(`small`,{children:[t.mealType,` - `,t.sectionName||t.location]})]}),(0,N.jsxs)(`div`,{className:`supplier-daily-request-qty`,children:[(0,N.jsx)(`strong`,{children:t.quantity}),(0,N.jsx)(`small`,{children:`ref.`})]})]},t.id))}),(0,N.jsxs)(`footer`,{className:`supplier-daily-block-footer`,children:[h?(0,N.jsxs)(`div`,{className:`supplier-daily-update-alert`,children:[(0,N.jsx)(Qr,{icon:i,name:`edit`,size:15}),(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`strong`,{children:`Pedido atualizado pelo Admin`}),(0,N.jsx)(`span`,{children:`Confira quantidades e itens antes de confirmar recebimento.`})]})]}):null,(0,N.jsxs)(`div`,{className:`supplier-daily-total-line`,children:[(0,N.jsx)(`span`,{children:u?`Total do extra`:`Total do dia`}),(0,N.jsxs)(`strong`,{children:[s.total,` refeicoes`]})]}),(0,N.jsxs)(`div`,{className:`supplier-daily-actions`,children:[(0,N.jsx)(`button`,{className:`btn outline small`,"data-supplier-select":t.id,children:`Detalhes`}),c?(0,N.jsxs)(`button`,{className:`btn primary small`,"data-step":c.step,"data-id":t.id,children:[(0,N.jsx)(Qr,{icon:i,name:c.iconName??`check`,size:15}),c.label]}):(0,N.jsx)(`span`,{className:`badge ${t.status}`,children:si(o,t.status)})]})]})]})}function mi(e){if(arguments.length>0&&!e)return``;let t=e instanceof Date?e:new Date(arguments.length?e:void 0);return Number.isNaN(t.getTime())?``:new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function hi(e){let{formatDate:t,getConsolidationSummary:n,icon:r,state:i,user:a}=e,o=ii(i,a),s=mi(),c=o.filter(e=>e.status!==`rascunho`&&![`saiu_entrega`,`entregue`].includes(e.status)),l=c.reduce((e,t)=>e+n(i,t).total,0),u=oi(o,`enviado`),d=oi(o,`confirmado`)+oi(o,`producao`),f=oi(o,`saiu_entrega`)+oi(o,`entregue`);return(0,N.jsxs)(`section`,{className:`supplier-dashboard`,children:[(0,N.jsx)(`style`,{children:fi}),(0,N.jsx)(ti,{className:`supplier-home-receipt`,kicker:`Recebidos em tempo real - ${t(s)}`,title:`Visao operacional`,totalValue:u,totalLabel:`pedidos a confirmar`,description:`Pedidos enviados pelo Admin aparecem aqui assim que chegam ao fornecedor.`,actions:(0,N.jsxs)(`button`,{className:`btn primary`,"data-view":`fornecedor-pedidos`,children:[(0,N.jsx)(Qr,{icon:r,name:`clipboard`,size:15}),`Ver todos`]}),metrics:[{icon:r,iconName:`utensils`,label:`Refeicoes ativas`,value:l},{icon:r,iconName:`clipboard`,label:`A confirmar`,value:u},{icon:r,iconName:`clock`,label:`Prontos p/ saida`,value:d},{icon:r,iconName:`check`,label:`Saidas`,value:f}]}),c.length?(0,N.jsx)(`div`,{className:`supplier-daily-block-list`,children:c.map(t=>(0,cn.createElement)(pi,{...e,consolidation:t,key:t.id}))}):(0,N.jsx)(`div`,{className:`empty`,children:`Nenhum pedido ativo no momento. Assim que o Admin enviar, ele aparece aqui em tempo real.`})]})}function gi(e){let{formatDate:t,formatDateTime:n,getConsolidationSummary:r,icon:i,requestMealDescription:a,selectedSupplierConsolidationId:o,state:s,supplierOrderDate:c,supplierOrderStatus:l,STATUS_LABEL:u,user:d}=e,f=ii(s,d).filter(e=>(l===`todos`||(l===`ativos`?![`saiu_entrega`,`entregue`,`rascunho`].includes(e.status):e.status===l))&&(!c||e.date===c)),p=f.filter(e=>![`saiu_entrega`,`entregue`,`rascunho`].includes(e.status)),m=f.reduce((e,t)=>e+r(s,t).total,0),h=oi(f,`enviado`),g=f.find(e=>e.id===o)??null,_=g?r(s,g):null;return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`style`,{children:`
        ${fi}
        .supplier-page .supplier-simple-orders {
          grid-template-columns: repeat(3,minmax(0,1fr));
          align-items: start;
          gap: .75rem;
        }
        .supplier-page .supplier-request-shell { gap: 0; }
        .supplier-page .supplier-request-owner { display: none; }
        @media (max-width: 767px) {
          .supplier-page .supplier-simple-orders { grid-template-columns: 1fr; }
        }
        @media (min-width: 768px) and (max-width: 1180px) {
          .supplier-page .supplier-simple-orders { grid-template-columns: repeat(2,minmax(0,1fr)); }
        }
      `}),(0,N.jsxs)(`section`,{className:`supplier-workspace`,children:[(0,N.jsx)(ti,{kicker:`Pedidos do fornecedor`,title:`Pedidos recebidos`,totalValue:f.length,totalLabel:`pedidos na fila`,description:`Blocos diarios recebidos, consumo real e saida.`,actions:(0,N.jsxs)(ni,{icon:i,children:[(0,N.jsxs)(`select`,{defaultValue:l,"data-supplier-status":!0,children:[(0,N.jsx)(`option`,{value:`ativos`,children:`Pedidos ativos`}),(0,N.jsx)(`option`,{value:`todos`,children:`Todos os pedidos`}),(0,N.jsx)(`option`,{value:`enviado`,children:`A confirmar`}),(0,N.jsx)(`option`,{value:`confirmado`,children:`A registrar saida`}),(0,N.jsx)(`option`,{value:`saiu_entrega`,children:`Saida registrada`}),(0,N.jsx)(`option`,{value:`entregue`,children:`Entregues`})]}),(0,N.jsx)(`input`,{type:`date`,defaultValue:c,"data-supplier-date":!0}),(0,N.jsx)(`button`,{className:`btn outline small`,"data-supplier-clear-filter":!0,children:`Limpar filtros`})]}),metrics:[{icon:i,iconName:`clipboard`,label:`Pedidos`,value:f.length},{icon:i,iconName:`utensils`,label:`Refeicoes`,value:m},{icon:i,iconName:`clock`,label:`A confirmar`,value:h},{icon:i,iconName:`truck`,label:`Ativos`,value:p.length}]}),(0,N.jsx)(`div`,{className:`supplier-daily-block-list`,children:f.length?f.map(t=>(0,N.jsx)(`div`,{className:`supplier-request-shell`,children:(0,N.jsx)(pi,{...e,consolidation:t})},t.id)):(0,N.jsx)(`div`,{className:`empty`,children:`Nenhum pedido encontrado.`})}),g&&_?(0,N.jsx)(`div`,{className:`supplier-detail-modal-backdrop`,"data-supplier-close-detail":!0,children:(0,N.jsxs)(`section`,{className:`supplier-detail-modal`,role:`dialog`,"aria-modal":`true`,"aria-labelledby":`supplier-detail-title`,onClick:e=>e.stopPropagation(),children:[(0,N.jsxs)(`header`,{children:[(0,N.jsxs)(`div`,{children:[(0,N.jsxs)(`span`,{className:`compact-kicker`,children:[`Pedido `,g.id.slice(0,8).toUpperCase()]}),(0,N.jsxs)(`h2`,{id:`supplier-detail-title`,children:[_.total,` refeicoes para `,t(g.date)]}),(0,N.jsxs)(`p`,{children:[`Status: `,si(u,g.status)]})]}),(0,N.jsx)(`button`,{className:`modal-close`,type:`button`,"data-supplier-close-detail":!0,"aria-label":`Fechar`,children:`x`})]}),(0,N.jsxs)(`div`,{className:`supplier-order-highlights`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{children:`Quantidade`}),(0,N.jsx)(`strong`,{children:_.total})]}),(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{children:`Origem`}),(0,N.jsx)(`strong`,{children:_.rows.length})]}),(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{children:`Entrega`}),(0,N.jsx)(`strong`,{children:t(g.date)})]}),(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{children:`Status`}),(0,N.jsx)(`strong`,{children:si(u,g.status)})]})]}),(0,N.jsxs)(`div`,{className:`supplier-detail-grid`,children:[(0,N.jsxs)(`section`,{children:[(0,N.jsx)(`h3`,{children:`Itens do pedido`}),(0,N.jsx)(li,{requestMealDescription:a,state:s,summary:_})]}),(0,N.jsxs)(`section`,{children:[(0,N.jsx)(`h3`,{children:`Rastreabilidade`}),(0,N.jsx)(ui,{consolidation:g,formatDateTime:n,state:s})]})]}),(0,N.jsxs)(`section`,{children:[(0,N.jsx)(`h3`,{children:`Pedidos de origem`}),(0,N.jsx)(di,{formatDate:t,formatDateTime:n,rows:_.rows,state:s,STATUS_LABEL:u})]})]})}):null]})]})}function _i(e){let{formatDate:t,formatDateTime:n,getConsolidationSummary:r,icon:i,state:a,user:o}=e,s=ii(a,o).filter(e=>e.status===`entregue`),c=s.reduce((e,t)=>e+r(a,t).total,0),l=s[0];return(0,N.jsxs)(`section`,{className:`supplier-workspace`,children:[(0,N.jsx)(ti,{className:`supplier-history-receipt`,kicker:`Histórico`,title:`Histórico de entregas`,totalValue:s.length,totalLabel:`entregas concluidas`,description:`Pedidos concluidos pelo fornecedor.`,metrics:[{icon:i,iconName:`check`,label:`Entregas`,value:s.length},{icon:i,iconName:`utensils`,label:`Refeições`,value:c},{icon:i,iconName:`history`,label:`Ultima entrega`,value:l?t(l.date):`-`}]}),(0,N.jsx)(`div`,{className:`supplier-history-list`,children:s.length?s.map(e=>{let o=r(a,e),s=e.confirmations.find(e=>e.step===`entregue`);return(0,N.jsxs)(`article`,{className:`supplier-history-row supplier-order-card`,children:[(0,N.jsxs)(`div`,{className:`supplier-order-card-head`,children:[(0,N.jsx)(`span`,{className:`supplier-order-card-icon`,children:(0,N.jsx)(Qr,{icon:i,name:`check`,size:19})}),(0,N.jsxs)(`div`,{className:`supplier-order-card-title`,children:[(0,N.jsxs)(`div`,{className:`supplier-order-title-row`,children:[(0,N.jsx)(`h2`,{children:ci(o)||`${o.total} refeições`}),(0,N.jsx)(`span`,{className:`badge entregue`,children:`Entregue`})]}),(0,N.jsxs)(`p`,{children:[`Entrega `,t(e.date),` - concluido em `,n(s?.at)]})]}),(0,N.jsxs)(`div`,{className:`supplier-history-actions`,children:[(0,N.jsx)(`button`,{className:`btn outline small`,"data-generate-romaneio":e.id,children:`Nota`}),(0,N.jsx)(`button`,{className:`btn outline small`,"data-view":`fornecedor-documentos`,children:`Documentos`})]})]}),(0,N.jsxs)(`div`,{className:`supplier-order-card-meta`,children:[(0,N.jsxs)(`span`,{children:[`Quantidade`,(0,N.jsx)(`strong`,{children:o.total})]}),(0,N.jsxs)(`span`,{children:[`Origem`,(0,N.jsx)(`strong`,{children:o.rows.length})]}),(0,N.jsxs)(`span`,{children:[`Pedido`,(0,N.jsx)(`strong`,{children:e.id.slice(0,8).toUpperCase()})]}),(0,N.jsxs)(`span`,{children:[`Status`,(0,N.jsx)(`strong`,{children:`Entregue`})]})]})]},e.id)}):(0,N.jsx)(`div`,{className:`empty`,children:`Nenhuma entrega concluida ainda.`})})]})}function vi(e){let{icon:t}=e;return(0,N.jsxs)(`section`,{className:`supplier-more`,children:[(0,N.jsx)(`header`,{className:`admin-home-hero compact supplier-more-hero`,children:(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{className:`compact-kicker`,children:`Fornecedor`}),(0,N.jsx)(`h1`,{children:`Mais ferramentas`}),(0,N.jsx)(`p`,{children:`Acesse documentos, financeiro e configurações sem deixar o rodapé principal carregado.`})]})}),(0,N.jsx)(`div`,{className:`supplier-more-grid`,children:[[`fornecedor-documentos`,`package`,`Documentos`],[`fornecedor-financeiro`,`chart`,`Financeiro`],[`configuracoes`,`settings`,`Configurações`]].map(([e,n,r])=>(0,N.jsxs)(`button`,{className:`supplier-more-tile`,"data-view":e,children:[(0,N.jsx)(`span`,{children:(0,N.jsx)(Qr,{icon:t,name:n,size:24})}),(0,N.jsx)(`strong`,{children:r})]},e))})]})}function yi(e){let{formatDate:t,formatDateTime:n,getConsolidationSummary:r,icon:i,state:a,STATUS_LABEL:o,user:s}=e,c=ii(a,s),l=a.consolidationDocuments.filter(e=>c.some(t=>t.id===e.consolidationId)),u=c.filter(e=>!ai(a,e.id).length);return(0,N.jsxs)(`section`,{className:`supplier-workspace`,children:[(0,N.jsx)(ti,{kicker:`Documentos`,title:`Notas e arquivos`,totalValue:l.length,totalLabel:`arquivos anexados`,description:`Notas de fornecimento e notas fiscais anexadas.`,backAction:(0,N.jsx)($r,{icon:i}),metrics:[{icon:i,iconName:`package`,label:`Pedidos`,value:c.length},{icon:i,iconName:`clipboard`,label:`Arquivos`,value:l.length},{icon:i,iconName:`clock`,label:`Sem anexo`,value:u.length}]}),(0,N.jsx)(`div`,{className:`supplier-documents-list`,children:c.length?c.map(e=>{let s=r(a,e),c=ai(a,e.id);return(0,N.jsxs)(`article`,{className:`supplier-document-card supplier-order-card`,children:[(0,N.jsxs)(`div`,{className:`supplier-order-card-head`,children:[(0,N.jsxs)(`div`,{className:`supplier-order-card-title`,children:[(0,N.jsx)(`span`,{className:`badge ${e.status}`,children:si(o,e.status)}),(0,N.jsx)(`h2`,{children:ci(s)||`Pedido ${e.id.slice(0,8).toUpperCase()}`}),(0,N.jsxs)(`p`,{children:[`Entrega `,t(e.date),` - `,s.total,` refeições`]})]}),(0,N.jsxs)(`div`,{className:`supplier-document-actions`,children:[(0,N.jsx)(`button`,{className:`btn outline small`,"data-generate-romaneio":e.id,children:`Gerar nota`}),(0,N.jsxs)(`label`,{className:`btn primary small supplier-upload-label`,children:[`Anexar PDF`,(0,N.jsx)(`input`,{type:`file`,accept:`application/pdf`,"data-document-upload":e.id,hidden:!0})]})]})]}),(0,N.jsxs)(`div`,{className:`supplier-order-card-meta`,children:[(0,N.jsxs)(`span`,{children:[`Arquivos`,(0,N.jsx)(`strong`,{children:c.length})]}),(0,N.jsxs)(`span`,{children:[`Quantidade`,(0,N.jsx)(`strong`,{children:s.total})]}),(0,N.jsxs)(`span`,{children:[`Pedido`,(0,N.jsx)(`strong`,{children:e.id.slice(0,8).toUpperCase()})]}),(0,N.jsxs)(`span`,{children:[`Situação`,(0,N.jsx)(`strong`,{children:c.length?`Anexado`:`Pendente`})]})]}),c.length?(0,N.jsx)(`div`,{className:`supplier-attached-files`,children:c.map(e=>(0,N.jsxs)(`button`,{className:`supplier-file-row`,"data-download-document":e.id,children:[(0,N.jsx)(Qr,{icon:i,name:`package`,size:16}),(0,N.jsx)(`span`,{children:e.originalName}),(0,N.jsx)(`small`,{children:n(e.createdAt)})]},e.id))}):(0,N.jsx)(`div`,{className:`supplier-no-documents`,children:`Nenhuma nota fiscal anexada.`})]},e.id)}):(0,N.jsx)(`div`,{className:`empty`,children:`Ainda não há pedidos para documentar.`})})]})}function bi(e){let{formatDate:t,icon:n,money:r,requestValue:i,state:a,sumQty:o,user:s,STATUS_LABEL:c}=e,l=ii(a,s).flatMap(t=>e.getConsolidationSummary(a,t).rows),u=a.settings.defaultMealDate.slice(0,7),d=l.filter(e=>e.date.startsWith(u)),f=d.filter(e=>e.status===`entregue`),p=d.reduce((e,t)=>e+i(t),0),m=f.reduce((e,t)=>e+i(t),0),h=p-m,g=o(d),_=a.mealTypes.map(e=>({label:e.label,value:d.filter(t=>t.mealTypeId===e.id).reduce((e,t)=>e+i(t),0)})).filter(e=>e.value>0),v=Math.max(..._.map(e=>e.value),1),y=Array.from({length:7},(e,t)=>{let n=new Date(`${a.settings.defaultMealDate}T12:00:00`);n.setDate(n.getDate()-(6-t));let r=n.toISOString().slice(0,10);return{key:r,label:String(n.getDate()).padStart(2,`0`),value:l.filter(e=>e.date===r).reduce((e,t)=>e+i(t),0)}}),b=Math.max(...y.map(e=>e.value),1),x=[...d].sort((e,t)=>t.date.localeCompare(e.date));return(0,N.jsxs)(`section`,{className:`finance-page`,children:[(0,N.jsx)(ti,{kicker:`Financeiro`,title:`Financeiro do fornecedor`,totalValue:r(p),totalLabel:`previsto em ${u}`,description:`Análise de ${u}.`,backAction:(0,N.jsx)($r,{icon:n}),actions:(0,N.jsxs)(`button`,{className:`btn primary`,"data-export-finance":`fornecedor`,children:[(0,N.jsx)(Qr,{icon:n,name:`chart`,size:15}),`Gerar PDF`]}),metrics:[{icon:n,iconName:`chart`,label:`Faturamento previsto`,value:r(p)},{icon:n,iconName:`truck`,label:`Faturado`,value:r(m)},{icon:n,iconName:`clock`,label:`Em aberto`,value:r(h)},{icon:n,iconName:`utensils`,label:`Ticket medio`,value:r(g?p/g:0)}]}),(0,N.jsxs)(`div`,{className:`finance-grid`,children:[(0,N.jsxs)(`article`,{className:`finance-card`,children:[(0,N.jsx)(`h2`,{children:`Composição por refeição`}),_.length?_.map(e=>(0,N.jsxs)(`div`,{className:`finance-progress`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{children:e.label}),(0,N.jsx)(`strong`,{children:r(e.value)})]}),(0,N.jsx)(`i`,{children:(0,N.jsx)(`b`,{style:{width:`${Math.max(3,Math.round(e.value/v*100))}%`}})})]},e.label)):(0,N.jsx)(`div`,{className:`empty`,children:`Sem movimentação no período.`})]}),(0,N.jsxs)(`article`,{className:`finance-card`,children:[(0,N.jsx)(`h2`,{children:`Evolução dos últimos 7 dias`}),(0,N.jsx)(`div`,{className:`finance-bars`,children:y.map(e=>(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`strong`,{children:e.value?r(e.value).replace(`R$`,``):`-`}),(0,N.jsx)(`i`,{style:{height:`${Math.max(5,Math.round(e.value/b*126))}px`}}),(0,N.jsx)(`span`,{children:e.label})]},e.key))})]})]}),(0,N.jsxs)(`article`,{className:`finance-card finance-table-card`,children:[(0,N.jsx)(`h2`,{children:`Movimentações do período`}),(0,N.jsxs)(`div`,{className:`finance-mobile-movements`,children:[x.map(e=>(0,N.jsxs)(`article`,{className:`finance-mobile-row`,children:[(0,N.jsxs)(`div`,{className:`finance-mobile-row-top`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`h3`,{children:e.mealType}),(0,N.jsx)(`time`,{children:t(e.date)})]}),(0,N.jsx)(`span`,{className:`badge ${e.status}`,children:si(c,e.status)})]}),(0,N.jsxs)(`div`,{className:`finance-mobile-row-meta`,children:[(0,N.jsxs)(`span`,{children:[`Quantidade`,(0,N.jsx)(`strong`,{children:e.quantity})]}),(0,N.jsxs)(`span`,{children:[`Valor`,(0,N.jsx)(`strong`,{children:r(i(e))})]})]})]},e.id)),!x.length&&(0,N.jsx)(`div`,{className:`empty`,children:`Nenhuma movimentação encontrada para o período.`})]}),(0,N.jsx)(`div`,{className:`table-wrap finance-desktop-movements`,children:(0,N.jsxs)(`table`,{children:[(0,N.jsx)(`thead`,{children:(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`th`,{children:`Data`}),(0,N.jsx)(`th`,{children:`Tipo`}),(0,N.jsx)(`th`,{children:`Quantidade`}),(0,N.jsx)(`th`,{children:`Valor`}),(0,N.jsx)(`th`,{children:`Status`})]})}),(0,N.jsx)(`tbody`,{children:x.map(e=>(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{children:t(e.date)}),(0,N.jsx)(`td`,{children:e.mealType}),(0,N.jsx)(`td`,{children:e.quantity}),(0,N.jsx)(`td`,{children:(0,N.jsx)(`strong`,{children:r(i(e))})}),(0,N.jsx)(`td`,{children:(0,N.jsx)(`span`,{className:`badge ${e.status}`,children:si(c,e.status)})})]},e.id))})]})})]})]})}var xi=`
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
  .supplier-page .badge.confirmado { border-color: #bfdbfe; background: #eff6ff; color: #1d4ed8; }
  .supplier-page .badge.producao { border-color: #fde68a; background: #fffbeb; color: #b45309; }
  .supplier-page .badge.saiu_entrega { border-color: #bae6fd; background: #f0f9ff; color: #0369a1; }
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
  .supplier-page .consolidated-row { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .5rem 0; }
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
`;function Si(e){let t;return t=e.page===`fornecedor-pedidos`?(0,N.jsx)(gi,{...e}):e.page===`fornecedor-historico`?(0,N.jsx)(_i,{...e}):e.page===`fornecedor-mais`?(0,N.jsx)(vi,{...e}):e.page===`fornecedor-documentos`?(0,N.jsx)(yi,{...e}):e.page===`fornecedor-financeiro`?(0,N.jsx)(bi,{...e}):(0,N.jsx)(hi,{...e}),(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`style`,{children:xi}),(0,N.jsx)(`div`,{className:`supplier-page`,children:t})]})}var Ci=new WeakMap;function wi(e=document){e.querySelectorAll(`[data-supplier-react-root]`).forEach(e=>{let t=Ci.get(e);t&&(t.unmount(),Ci.delete(e))})}function Ti(e,t){let n=e.querySelector(`[data-supplier-react-root]`);if(!n)return;let r=Ci.get(n);r||(r=(0,un.createRoot)(n),Ci.set(n,r)),(0,ln.flushSync)(()=>{r.render((0,N.jsx)(Si,{...t}))})}function Ei(){function e(){return`<div data-admin-react-root></div>`}return{painel:e,pedidos:e,consolidacao:e,mais:e,financeiro:e,relatorios:e,auditoria:e}}function Di(){function e(){return`<div data-leader-react-root></div>`}return{historico:e,inicio:e,pedido:e}}function Oi(e){let{escapeHtml:t,getGeneratedInviteLink:n,getState:r,icon:i,money:a,renderAdminBackButton:o,renderEmptyState:s,roleName:c}=e;function l(){let e=r(),n=e.users.find(t=>t.id===(e.activeUserId??e.authenticatedUserId));if(!n)return s(`Sessao expirada`,`Entre novamente para alterar suas configuracoes.`);let a=n.role===`admin`||n.role===`fornecedor`,l=n.role===`encarregado`;return`
      <section class="
    mx-auto grid w-full max-w-6xl gap-3 text-stone-950
    [&_.settings-header]:relative [&_.settings-header]:mb-3 [&_.settings-header]:overflow-hidden [&_.settings-header]:rounded-[22px] [&_.settings-header]:border [&_.settings-header]:border-stone-800 [&_.settings-header]:bg-[#242622] [&_.settings-header]:px-4 [&_.settings-header]:pb-7 [&_.settings-header]:pt-4 [&_.settings-header]:text-white [&_.settings-header]:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.55)] sm:[&_.settings-header]:px-6 sm:[&_.settings-header]:pt-5
    [&_.settings-header-main]:relative [&_.settings-header-main]:flex [&_.settings-header-main]:items-start [&_.settings-header-main]:justify-between [&_.settings-header-main]:gap-3
    [&_.settings-header-pattern]:pointer-events-none [&_.settings-header-pattern]:absolute [&_.settings-header-pattern]:inset-0 [&_.settings-header-pattern]:opacity-[0.05]
    [&_.settings-perforation]:pointer-events-none [&_.settings-perforation]:absolute [&_.settings-perforation]:inset-x-0 [&_.settings-perforation]:bottom-0 [&_.settings-perforation]:flex [&_.settings-perforation]:translate-y-1/2 [&_.settings-perforation]:justify-around [&_.settings-perforation]:px-4 [&_.settings-perforation_i]:h-2.5 [&_.settings-perforation_i]:w-2.5 [&_.settings-perforation_i]:rounded-full [&_.settings-perforation_i]:bg-white
    [&_.compact-kicker]:text-[10px] [&_.compact-kicker]:font-black [&_.compact-kicker]:uppercase [&_.compact-kicker]:tracking-[.16em] [&_.compact-kicker]:text-orange-200
    [&_h1]:m-0 [&_h1]:text-[24px] [&_h1]:font-black [&_h1]:leading-none [&_h1]:tracking-normal sm:[&_h1]:text-[30px] [&_.settings-header_h1]:mt-1 [&_.settings-header_h1]:text-white [&_h2]:m-0 [&_h2]:text-lg [&_h2]:font-black [&_p]:m-0 [&_p]:text-sm [&_p]:text-stone-500 [&_.settings-header_p]:mt-1.5 [&_.settings-header_p]:max-w-2xl [&_.settings-header_p]:text-xs [&_.settings-header_p]:font-bold [&_.settings-header_p]:text-white/55 sm:[&_.settings-header_p]:text-sm
    [&_.settings-layout]:grid [&_.settings-layout]:gap-3 lg:[&_.settings-layout]:grid-cols-2
    [&_.settings-panel]:grid [&_.settings-panel]:gap-4 [&_.settings-panel]:overflow-hidden [&_.settings-panel]:rounded-[18px] [&_.settings-panel]:border [&_.settings-panel]:border-stone-200 [&_.settings-panel]:bg-white [&_.settings-panel]:p-4 [&_.settings-panel]:shadow-[0_12px_30px_rgba(25,27,24,.06)]
    [&_.settings-panel-wide]:lg:col-span-2
    [&_.settings-panel-title]:-mx-4 [&_.settings-panel-title]:-mt-4 [&_.settings-panel-title]:flex [&_.settings-panel-title]:items-start [&_.settings-panel-title]:gap-3 [&_.settings-panel-title]:border-b [&_.settings-panel-title]:border-dashed [&_.settings-panel-title]:border-stone-200 [&_.settings-panel-title]:bg-stone-50 [&_.settings-panel-title]:px-4 [&_.settings-panel-title]:py-3 [&_.settings-panel-title>span]:grid [&_.settings-panel-title>span]:h-10 [&_.settings-panel-title>span]:w-10 [&_.settings-panel-title>span]:place-items-center [&_.settings-panel-title>span]:rounded-r-xl [&_.settings-panel-title>span]:rounded-l-md [&_.settings-panel-title>span]:bg-orange-50 [&_.settings-panel-title>span]:text-orange-700
    [&_.form-grid]:grid [&_.form-grid]:gap-3 sm:[&_.form-grid]:grid-cols-2
    [&_.field]:grid [&_.field]:gap-1.5 [&_.field_label]:text-[10px] [&_.field_label]:font-black [&_.field_label]:uppercase [&_.field_label]:tracking-[.08em] [&_.field_label]:text-stone-500
    [&_input]:min-h-11 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-stone-300 [&_input]:bg-white [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none focus:[&_input]:border-orange-600 focus:[&_input]:ring-4 focus:[&_input]:ring-orange-100 disabled:[&_input]:bg-stone-50 disabled:[&_input]:text-stone-500
    [&_select]:min-h-11 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-stone-300 [&_select]:bg-white [&_select]:px-3 [&_select]:text-sm [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-stone-300 [&_textarea]:bg-white [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-sm
    [&_.settings-actions]:flex [&_.settings-actions]:justify-end [&_.btn]:inline-flex [&_.btn]:min-h-10 [&_.btn]:items-center [&_.btn]:justify-center [&_.btn]:gap-2 [&_.btn]:rounded-lg [&_.btn]:border [&_.btn]:border-transparent [&_.btn]:px-4 [&_.btn]:text-sm [&_.btn]:font-extrabold [&_.btn.primary]:border-orange-600 [&_.btn.primary]:bg-orange-600 [&_.btn.primary]:text-white [&_.btn.outline]:border-stone-300 [&_.btn.outline]:bg-white [&_.btn.outline]:text-stone-900 [&_.btn.small]:min-h-9 [&_.btn.small]:px-3 [&_.btn.small]:text-xs
    [&_.settings-back-row]:min-h-6 [&_.settings-back-row]:flex [&_.settings-back-row]:items-center
    [&_.admin-back-button]:inline-flex [&_.admin-back-button]:min-h-5 [&_.admin-back-button]:items-center [&_.admin-back-button]:gap-1.5 [&_.admin-back-button]:border-0 [&_.admin-back-button]:bg-transparent [&_.admin-back-button]:p-0 [&_.admin-back-button]:text-xs [&_.admin-back-button]:font-extrabold [&_.admin-back-button]:text-stone-500 [&_.admin-back-button]:shadow-none [&_.admin-back-button]:transition hover:[&_.admin-back-button]:text-orange-700
    [&_.invite-link-box]:grid [&_.invite-link-box]:gap-2 [&_.invite-link-box]:rounded-xl [&_.invite-link-box]:border [&_.invite-link-box]:border-orange-200 [&_.invite-link-box]:bg-orange-50 [&_.invite-link-box]:p-3 [&_.invite-link-box_span]:text-[10px] [&_.invite-link-box_span]:font-black [&_.invite-link-box_span]:uppercase [&_.invite-link-box_strong]:break-all [&_.invite-link-box_strong]:text-sm
    lg:[&_.work-section-panel]:col-span-2 [&_.work-section-panel]:gap-3 [&_.work-section-panel_.settings-panel-title]:py-2.5 [&_.work-section-panel_.settings-panel-title>span]:h-8 [&_.work-section-panel_.settings-panel-title>span]:w-8 [&_.work-section-panel_h2]:text-base [&_.work-section-panel_p]:text-xs
    [&_.work-section-new]:rounded-xl [&_.work-section-new]:border [&_.work-section-new]:border-orange-200 [&_.work-section-new]:bg-orange-50/60 [&_.work-section-new]:p-3
    [&_.work-section-form]:grid [&_.work-section-form]:gap-2 sm:[&_.work-section-form]:grid-cols-[minmax(0,1.4fr)_90px_minmax(0,1fr)_96px_auto] sm:[&_.work-section-form]:items-end
    [&_.work-section-list]:grid [&_.work-section-list]:grid-cols-1 [&_.work-section-list]:gap-2 sm:[&_.work-section-list]:grid-cols-2 xl:[&_.work-section-list]:grid-cols-3
    [&_.work-section-card]:grid [&_.work-section-card]:gap-2 [&_.work-section-card]:rounded-xl [&_.work-section-card]:border [&_.work-section-card]:border-dashed [&_.work-section-card]:border-stone-200 [&_.work-section-card]:bg-[#fffefa] [&_.work-section-card]:p-3 [&_.work-section-card]:shadow-sm
    [&_.work-section-card-head]:grid [&_.work-section-card-head]:grid-cols-[minmax(0,1fr)_auto] [&_.work-section-card-head]:items-start [&_.work-section-card-head]:gap-2 [&_.work-section-card_strong]:truncate [&_.work-section-card_strong]:text-sm [&_.work-section-card_small]:text-xs [&_.work-section-actions]:grid [&_.work-section-actions]:grid-cols-2 [&_.work-section-actions]:gap-2
    lg:[&_.meal-catalog-panel]:col-span-2 [&_.meal-catalog-panel]:gap-3 [&_.meal-catalog-panel_.settings-panel-title]:py-2.5 [&_.meal-catalog-panel_.settings-panel-title>span]:h-8 [&_.meal-catalog-panel_.settings-panel-title>span]:w-8 [&_.meal-catalog-panel_h2]:text-base [&_.meal-catalog-panel_p]:text-xs
    [&_.meal-catalog-toolbar]:flex [&_.meal-catalog-toolbar]:items-center [&_.meal-catalog-toolbar]:justify-between [&_.meal-catalog-toolbar]:gap-3
    [&_.meal-catalog-list]:grid [&_.meal-catalog-list]:grid-cols-2 [&_.meal-catalog-list]:gap-2 sm:[&_.meal-catalog-list]:grid-cols-2 xl:[&_.meal-catalog-list]:grid-cols-3
    [&_.meal-catalog-card]:grid [&_.meal-catalog-card]:min-w-0 [&_.meal-catalog-card]:gap-2 [&_.meal-catalog-card]:rounded-r-xl [&_.meal-catalog-card]:rounded-l-md [&_.meal-catalog-card]:border [&_.meal-catalog-card]:border-l-2 [&_.meal-catalog-card]:border-dashed [&_.meal-catalog-card]:border-stone-200 [&_.meal-catalog-card]:bg-[#fffefa] [&_.meal-catalog-card]:p-3 [&_.meal-catalog-card]:shadow-sm
    [&_.meal-catalog-card-head]:grid [&_.meal-catalog-card-head]:grid-cols-[minmax(0,1fr)_auto] [&_.meal-catalog-card-head]:items-start [&_.meal-catalog-card-head]:gap-2 [&_.meal-catalog-card-title]:min-w-0 [&_.meal-catalog-card-title_strong]:block [&_.meal-catalog-card-title_strong]:truncate [&_.meal-catalog-card-title_strong]:text-sm [&_.meal-catalog-card-title_strong]:font-black [&_.meal-catalog-card-title_p]:mt-1 [&_.meal-catalog-card-title_p]:line-clamp-2 [&_.meal-catalog-card-title_p]:text-xs [&_.meal-catalog-card-actions]:flex [&_.meal-catalog-card-actions]:gap-1
    [&_.meal-price-chip]:inline-flex [&_.meal-price-chip]:w-max [&_.meal-price-chip]:items-center [&_.meal-price-chip]:rounded-full [&_.meal-price-chip]:border [&_.meal-price-chip]:border-orange-200 [&_.meal-price-chip]:bg-orange-50 [&_.meal-price-chip]:px-2 [&_.meal-price-chip]:py-1 [&_.meal-price-chip]:text-[10px] [&_.meal-price-chip]:font-black [&_.meal-price-chip]:text-orange-700
    [&_.meal-status-chip]:inline-flex [&_.meal-status-chip]:w-max [&_.meal-status-chip]:items-center [&_.meal-status-chip]:rounded-full [&_.meal-status-chip]:border [&_.meal-status-chip]:px-2 [&_.meal-status-chip]:py-1 [&_.meal-status-chip]:text-[10px] [&_.meal-status-chip]:font-black [&_.meal-status-chip]:uppercase [&_.meal-status-chip]:tracking-[.08em] [&_.meal-status-chip.active]:border-emerald-200 [&_.meal-status-chip.active]:bg-emerald-50 [&_.meal-status-chip.active]:text-emerald-700 [&_.meal-status-chip.inactive]:border-stone-200 [&_.meal-status-chip.inactive]:bg-stone-100 [&_.meal-status-chip.inactive]:text-stone-500
    [&_.icon-btn]:grid [&_.icon-btn]:h-9 [&_.icon-btn]:w-9 [&_.icon-btn]:place-items-center [&_.icon-btn]:rounded-lg [&_.icon-btn]:border [&_.icon-btn]:border-stone-300 [&_.icon-btn]:bg-white [&_.icon-btn]:p-0 [&_.icon-btn]:text-stone-800 hover:[&_.icon-btn]:border-orange-300 hover:[&_.icon-btn]:bg-orange-50 hover:[&_.icon-btn]:text-orange-700 [&_.icon-btn.danger]:border-red-200 [&_.icon-btn.danger]:bg-red-50 [&_.icon-btn.danger]:text-red-700 hover:[&_.icon-btn.danger]:border-red-300 hover:[&_.icon-btn.danger]:bg-red-100
    [&_.meal-catalog-edit]:overflow-hidden [&_.meal-catalog-edit]:rounded-xl [&_.meal-catalog-edit]:border [&_.meal-catalog-edit]:border-stone-200 [&_.meal-catalog-edit]:bg-white [&_.meal-catalog-edit_summary]:flex [&_.meal-catalog-edit_summary]:min-h-9 [&_.meal-catalog-edit_summary]:cursor-pointer [&_.meal-catalog-edit_summary]:list-none [&_.meal-catalog-edit_summary]:items-center [&_.meal-catalog-edit_summary]:justify-center [&_.meal-catalog-edit_summary]:gap-2 [&_.meal-catalog-edit_summary]:px-3 [&_.meal-catalog-edit_summary]:text-xs [&_.meal-catalog-edit_summary]:font-black [&_.meal-catalog-edit_summary::-webkit-details-marker]:hidden [&_.meal-catalog-item]:grid [&_.meal-catalog-item]:gap-2 [&_.meal-catalog-item]:border-t [&_.meal-catalog-item]:border-stone-100 [&_.meal-catalog-item]:p-3 [&_.meal-catalog-item_.form-grid]:gap-2 [&_.meal-catalog-item_textarea]:min-h-[4.25rem] [&_.meal-catalog-item_textarea]:py-1.5 [&_.meal-catalog-footer]:flex [&_.meal-catalog-footer]:items-center [&_.meal-catalog-footer]:justify-between [&_.meal-catalog-footer]:gap-2 [&_.meal-catalog-footer]:border-t [&_.meal-catalog-footer]:border-stone-100 [&_.meal-catalog-footer]:pt-2 [&_.meal-catalog-footer_span]:text-xs [&_.meal-catalog-new]:overflow-hidden [&_.meal-catalog-new]:rounded-[14px] [&_.meal-catalog-new]:border [&_.meal-catalog-new]:border-orange-200 [&_.meal-catalog-new]:bg-orange-50/60
    [&_.meal-catalog-new_summary]:flex [&_.meal-catalog-new_summary]:min-h-11 [&_.meal-catalog-new_summary]:cursor-pointer [&_.meal-catalog-new_summary]:list-none [&_.meal-catalog-new_summary]:items-center [&_.meal-catalog-new_summary]:justify-between [&_.meal-catalog-new_summary]:gap-2 [&_.meal-catalog-new_summary]:px-3 [&_.meal-catalog-new_summary]:text-sm [&_.meal-catalog-new_summary]:font-black [&_.meal-catalog-new_summary]:text-orange-700 [&_.meal-catalog-new_summary::-webkit-details-marker]:hidden
    [&_.meal-catalog-new-form]:grid [&_.meal-catalog-new-form]:gap-3 [&_.meal-catalog-new-form]:border-t [&_.meal-catalog-new-form]:border-orange-100 [&_.meal-catalog-new-form]:bg-white/80 [&_.meal-catalog-new-form]:p-3
    [&_.empty]:rounded-xl [&_.empty]:border [&_.empty]:border-dashed [&_.empty]:border-stone-300 [&_.empty]:bg-stone-50 [&_.empty]:p-5 [&_.empty]:text-center [&_.empty]:text-sm [&_.empty]:font-bold [&_.empty]:text-stone-500
  ">
        <div class="settings-back-row">${o()}</div>
        <header class="settings-header">
          <div class="settings-header-pattern" style="background-image: radial-gradient(currentColor 1.4px, transparent 1.4px); background-size: 16px 16px;"></div>
          <div class="settings-header-main">
            <div>
              <span class="compact-kicker">Configuracoes</span>
              <h1>${l?`Minha conta`:a?`Conta e catalogo`:`Minha conta`}</h1>
              <p>${l?`Atualize seus dados de usuario e senha.`:a?`Mantenha dados de acesso, equipes e tipos de alimentacao.`:`Atualize seus dados de acesso e as informacoes que aparecem no sistema.`}</p>
            </div>
          </div>
          <div class="settings-perforation">${Array.from({length:14}).map(()=>`<i></i>`).join(``)}</div>
        </header>
        <div class="settings-layout">
          <form class="settings-panel" data-form="profile-settings">
            <div class="settings-panel-title">
              <span>${i(`users`,18)}</span>
              <div><h2>Dados do usuario</h2><p>Essas informacoes identificam voce nos pedidos e registros.</p></div>
            </div>
            <div class="form-grid">
              <div class="field">
                <label for="settings-name">Nome</label>
                <input id="settings-name" name="name" value="${t(n.name)}" required />
              </div>
              <div class="field">
                <label for="settings-team">Equipe / frente</label>
                <input id="settings-team" name="team" value="${t(n.team||``)}" placeholder="Ex.: Frente Norte" />
              </div>
            </div>
            <div class="form-grid">
              <div class="field">
                <label>E-mail</label>
                <input value="${t(n.email)}" disabled />
              </div>
              <div class="field">
                <label>Perfil</label>
                <input value="${c(n.role)}" disabled />
              </div>
            </div>
            <footer class="settings-actions">
              <button class="btn primary" type="submit">Salvar dados</button>
            </footer>
          </form>
          <form class="settings-panel" data-form="password-settings">
            <div class="settings-panel-title">
              <span>${i(`settings`,18)}</span>
              <div><h2>Senha</h2><p>Use pelo menos 8 caracteres para proteger sua conta.</p></div>
            </div>
            <div class="field">
              <label for="settings-password">Nova senha</label>
              <input id="settings-password" name="password" type="password" minlength="8" autocomplete="new-password" required />
            </div>
            <div class="field">
              <label for="settings-password-confirm">Confirmar nova senha</label>
              <input id="settings-password-confirm" name="passwordConfirm" type="password" minlength="8" autocomplete="new-password" required />
            </div>
            <footer class="settings-actions">
              <button class="btn outline" type="submit">Alterar senha</button>
            </footer>
          </form>
          ${l?``:n.role===`admin`?u():``}
          ${l?``:n.role===`admin`?d():``}
          ${l?``:a?p(n):``}
        </div>
      </section>`}function u(){let e=n();return`
      <form class="settings-panel settings-panel-wide access-invite-panel" data-form="access-invite">
        <div class="settings-panel-title">
          <span>${i(`users`,18)}</span>
          <div><h2>Convidar acesso interno</h2><p>Gere um link privado para criar fornecedor ou administrador.</p></div>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="invite-role">Tipo de acesso</label>
            <select id="invite-role" name="role" required>
              <option value="fornecedor">Fornecedor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div class="field">
            <label for="invite-email">E-mail permitido <span class="optional-label">Opcional</span></label>
            <input id="invite-email" name="email" type="email" placeholder="pessoa@empresa.com" />
          </div>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="invite-team">Equipe / empresa <span class="optional-label">Opcional</span></label>
            <input id="invite-team" name="team" placeholder="Ex.: Cozinha Central" />
          </div>
          <div class="field">
            <label for="invite-days">Validade</label>
            <select id="invite-days" name="expiresInDays">
              <option value="7">7 dias</option>
              <option value="15">15 dias</option>
              <option value="30">30 dias</option>
            </select>
          </div>
        </div>
        ${e?`<div class="invite-link-box"><span>Link gerado</span><strong>${t(e)}</strong><button class="btn outline small" type="button" data-copy-invite-link>Copiar link</button></div>`:``}
        <footer class="settings-actions">
          <button class="btn primary" type="submit">${i(`plus`,15)}Gerar link privado</button>
        </footer>
      </form>`}function d(){let e=r(),n=e.users.filter(e=>e.role===`encarregado`&&e.active!==!1);return`
      <section class="settings-panel work-section-panel">
        <div class="settings-panel-title">
          <span>${i(`users`,18)}</span>
          <div><h2>Equipes e trechos</h2><p>Cadastre apenas equipe, efetivo e encarregado vinculado.</p></div>
        </div>
        <div class="work-section-new">
          <form class="work-section-form" data-form="work-section">
            <input type="hidden" name="id" value="" />
            <div class="field">
              <label for="work-section-name-new">Equipe/trecho</label>
              <input id="work-section-name-new" name="name" placeholder="Ex.: Frente Norte" required />
            </div>
            <div class="field">
              <label for="work-section-headcount-new">Efetivo</label>
              <input id="work-section-headcount-new" name="headcount" type="number" min="0" value="0" required />
            </div>
            <div class="field">
              <label for="work-section-leader-new">Encarregado</label>
              <select id="work-section-leader-new" name="leaderId">
                <option value="">Sem vinculo fixo</option>
                ${n.map(e=>`<option value="${e.id}">${t(e.name)}</option>`).join(``)}
              </select>
            </div>
            <div class="field">
              <label for="work-section-active-new">Status</label>
              <select id="work-section-active-new" name="active">
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
            <button class="btn primary" type="submit">${i(`plus`,15)}Cadastrar</button>
          </form>
        </div>
        <div class="work-section-list">
          ${e.workSections.map(e=>f(e,n)).join(``)||`<div class="empty">Nenhuma equipe cadastrada.</div>`}
        </div>
      </section>`}function f(e,n){let r=n.find(t=>t.id===e.leaderId);return`
      <article class="work-section-card">
        <div class="work-section-card-head">
          <div>
            <strong>${t(e.name)}</strong>
            <small class="block text-stone-500">Efetivo ${Number(e.headcount??0)}${r?` - ${t(r.name)}`:` - sem encarregado fixo`}</small>
          </div>
          <span class="meal-status-chip ${e.active?`active`:`inactive`}">${e.active?`Ativo`:`Inativo`}</span>
        </div>
        <details class="meal-catalog-edit">
          <summary>${i(`edit`,14)}Editar</summary>
          <form class="meal-catalog-item" data-form="work-section">
            <input type="hidden" name="id" value="${e.id}" />
            <div class="form-grid">
              <div class="field">
                <label for="work-section-name-${e.id}">Equipe/trecho</label>
                <input id="work-section-name-${e.id}" name="name" value="${t(e.name)}" required />
              </div>
              <div class="field">
                <label for="work-section-headcount-${e.id}">Efetivo</label>
                <input id="work-section-headcount-${e.id}" name="headcount" type="number" min="0" value="${Number(e.headcount??0)}" required />
              </div>
            </div>
            <div class="form-grid">
              <div class="field">
                <label for="work-section-leader-${e.id}">Encarregado</label>
                <select id="work-section-leader-${e.id}" name="leaderId">
                  <option value="">Sem vinculo fixo</option>
                  ${n.map(n=>`<option value="${n.id}" ${n.id===e.leaderId?`selected`:``}>${t(n.name)}</option>`).join(``)}
                </select>
              </div>
              <div class="field">
                <label for="work-section-active-${e.id}">Status</label>
                <select id="work-section-active-${e.id}" name="active">
                  <option value="true" ${e.active?`selected`:``}>Ativo</option>
                  <option value="false" ${e.active?``:`selected`}>Inativo</option>
                </select>
              </div>
            </div>
            <footer class="settings-actions">
              <button class="btn outline small" type="submit">Salvar</button>
            </footer>
          </form>
        </details>
      </article>`}function p(e){let t=r();return[`admin`,`fornecedor`].includes(e.role)?`
      <section class="settings-panel meal-catalog-panel">
        <div class="settings-panel-title">
          <span>${i(`utensils`,18)}</span>
          <div><h2>Tipos de alimentacao</h2><p>${e.role===`fornecedor`?`Cadastre o tipo e o que vem na marmita.`:`Gerencie tipos e precos individuais.`}</p></div>
        </div>
        <div class="meal-catalog-toolbar">
          <span class="text-xs font-black text-stone-500">${t.mealCatalog.length} tipos cadastrados</span>
          <button class="btn primary small" type="button" data-open-new-meal>${i(`plus`,15)}Novo</button>
        </div>
        <details class="meal-catalog-new" data-new-meal-panel>
          <summary>${i(`plus`,15)}Novo tipo de alimento <span>${i(`arrow`,14)}</span></summary>
          <form class="meal-catalog-new-form" data-form="meal-catalog">
            <input type="hidden" name="id" value="" />
            <div class="form-grid">
              <div class="field">
                <label for="new-meal-name">Nome do tipo</label>
                <input id="new-meal-name" name="name" placeholder="Ex.: Marmita proteica" required />
              </div>
              <div class="field">
                <label for="new-meal-price">Preco unitario</label>
                <input id="new-meal-price" name="unitPrice" type="number" min="0" step="0.01" value="${Number(t.settings.defaultMealUnitPrice??0)}" required />
              </div>
            </div>
            <div class="form-grid">
              <div class="field">
                <label for="new-meal-active">Status</label>
                <select id="new-meal-active" name="active">
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label for="new-meal-description">O que vem nessa marmita</label>
              <textarea id="new-meal-description" name="description" placeholder="Ex.: arroz, feijao, frango grelhado, salada e farofa"></textarea>
            </div>
            <footer class="settings-actions">
              <button class="btn primary" type="submit">${i(`plus`,15)}Cadastrar</button>
            </footer>
          </form>
        </details>
        <div class="meal-catalog-list">
          ${t.mealCatalog.map(m).join(``)||`<div class="empty">Nenhum tipo cadastrado.</div>`}
        </div>
      </section>`:``}function m(e){let n=e.active?`active`:`inactive`;return`
      <article class="meal-catalog-card">
        <div class="meal-catalog-card-head">
          <div class="meal-catalog-card-title">
            <strong>${t(e.label)}</strong>
            <p>${t(e.description||`Sem composicao informada.`)}</p>
          </div>
          <div class="meal-catalog-card-actions">
            <button class="icon-btn danger" type="button" data-delete-meal-type="${e.id}" aria-label="Excluir ${t(e.label)}">${i(`trash`,15)}</button>
          </div>
        </div>
        <div class="flex flex-wrap gap-1">
          <span class="meal-status-chip ${n}">${e.active?`Ativo`:`Inativo`}</span>
          <span class="meal-price-chip">${a(e.unitPrice)}</span>
        </div>
        <details class="meal-catalog-edit">
          <summary>${i(`edit`,14)}Editar</summary>
          <form class="meal-catalog-item" data-form="meal-catalog">
            <input type="hidden" name="id" value="${e.id}" />
            <div class="form-grid">
              <div class="field">
                <label for="meal-name-${e.id}">Tipo</label>
                <input id="meal-name-${e.id}" name="name" value="${t(e.label)}" required />
              </div>
              <div class="field">
                <label for="meal-price-${e.id}">Preco unitario</label>
                <input id="meal-price-${e.id}" name="unitPrice" type="number" min="0" step="0.01" value="${Number(e.unitPrice??0)}" required />
              </div>
            </div>
            <div class="field">
              <label for="meal-active-${e.id}">Status</label>
              <select id="meal-active-${e.id}" name="active">
                <option value="true" ${e.active?`selected`:``}>Ativo</option>
                <option value="false" ${e.active?``:`selected`}>Inativo</option>
              </select>
            </div>
            <div class="field">
              <label for="meal-description-${e.id}">O que vem nessa marmita</label>
              <textarea id="meal-description-${e.id}" name="description">${t(e.description)}</textarea>
            </div>
            <footer class="meal-catalog-footer">
              <span>${e.active?`Disponivel nos pedidos`:`Oculto para novos pedidos`}</span>
              <button class="btn outline small" type="submit">Salvar</button>
            </footer>
          </form>
        </details>
      </article>`}return l}function ki(e){function t(){return`<div data-supplier-react-root></div>`}return{fornecedor:t,"fornecedor-pedidos":t,"fornecedor-historico":t,"fornecedor-mais":t,"fornecedor-documentos":t,"fornecedor-financeiro":t}}function Ai(e){return{...Di(e.leader),...Ei(e),...ki(e),configuracoes:Oi(e.settings)}}function ji(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols==`function`)for(var i=0,r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]]);return n}function Mi(e,t,n,r){function i(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||=Promise)(function(n,a){function o(e){try{c(r.next(e))}catch(e){a(e)}}function s(e){try{c(r.throw(e))}catch(e){a(e)}}function c(e){e.done?n(e.value):i(e.value).then(o,s)}c((r=r.apply(e,t||[])).next())})}var Ni=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),Pi=class extends Error{constructor(e,t=`FunctionsError`,n){super(e),this.name=t,this.context=n}toJSON(){return{name:this.name,message:this.message,context:this.context}}},Fi=class extends Pi{constructor(e){super(`Failed to send a request to the Edge Function`,`FunctionsFetchError`,e)}},Ii=class extends Pi{constructor(e){super(`Relay Error invoking the Edge Function`,`FunctionsRelayError`,e)}},Li=class extends Pi{constructor(e){super(`Edge Function returned a non-2xx status code`,`FunctionsHttpError`,e)}},Ri;(function(e){e.Any=`any`,e.ApNortheast1=`ap-northeast-1`,e.ApNortheast2=`ap-northeast-2`,e.ApSouth1=`ap-south-1`,e.ApSoutheast1=`ap-southeast-1`,e.ApSoutheast2=`ap-southeast-2`,e.CaCentral1=`ca-central-1`,e.EuCentral1=`eu-central-1`,e.EuWest1=`eu-west-1`,e.EuWest2=`eu-west-2`,e.EuWest3=`eu-west-3`,e.SaEast1=`sa-east-1`,e.UsEast1=`us-east-1`,e.UsWest1=`us-west-1`,e.UsWest2=`us-west-2`})(Ri||={});var F=class{constructor(e,{headers:t={},customFetch:n,region:r=Ri.Any}={}){this.url=e,this.headers=t,this.region=r,this.fetch=Ni(n)}setAuth(e){this.headers.Authorization=`Bearer ${e}`}invoke(e){return Mi(this,arguments,void 0,function*(e,t={}){let n,r;try{let{headers:i,method:a,body:o,signal:s,timeout:c}=t,l={},{region:u}=t;u||=this.region;let d=new URL(`${this.url}/${e}`);u&&u!==`any`&&(l[`x-region`]=u,d.searchParams.set(`forceFunctionRegion`,u));let f;o&&(i&&!Object.prototype.hasOwnProperty.call(i,`Content-Type`)||!i)?typeof Blob<`u`&&o instanceof Blob||o instanceof ArrayBuffer?(l[`Content-Type`]=`application/octet-stream`,f=o):typeof o==`string`?(l[`Content-Type`]=`text/plain`,f=o):typeof FormData<`u`&&o instanceof FormData?f=o:(l[`Content-Type`]=`application/json`,f=JSON.stringify(o)):f=o&&typeof o!=`string`&&!(typeof Blob<`u`&&o instanceof Blob)&&!(o instanceof ArrayBuffer)&&!(typeof FormData<`u`&&o instanceof FormData)?JSON.stringify(o):o;let p=s;c&&(r=new AbortController,n=setTimeout(()=>r.abort(),c),s?(p=r.signal,s.addEventListener(`abort`,()=>r.abort())):p=r.signal);let m=yield this.fetch(d.toString(),{method:a||`POST`,headers:Object.assign(Object.assign(Object.assign({},l),this.headers),i),body:f,signal:p}).catch(e=>{throw new Fi(e)}),h=m.headers.get(`x-relay-error`);if(h&&h===`true`)throw new Ii(m);if(!m.ok)throw new Li(m);let g=(m.headers.get(`Content-Type`)??`text/plain`).split(`;`)[0].trim(),_;return _=g===`application/json`?yield m.json():g===`application/octet-stream`||g===`application/pdf`?yield m.blob():g===`text/event-stream`?m:g===`multipart/form-data`?yield m.formData():yield m.text(),{data:_,error:null,response:m}}catch(e){return{data:null,error:e,response:e instanceof Li||e instanceof Ii?e.context:void 0}}finally{n&&clearTimeout(n)}})}},zi=3,Bi=e=>Math.min(1e3*2**e,3e4),Vi=[520,503],Hi=[`GET`,`HEAD`,`OPTIONS`],Ui=class extends Error{constructor(e){super(e.message),this.name=`PostgrestError`,this.details=e.details,this.hint=e.hint,this.code=e.code}toJSON(){return{name:this.name,message:this.message,details:this.details,hint:this.hint,code:this.code}}};function Wi(e,t){return new Promise(n=>{if(t?.aborted){n();return}let r=setTimeout(()=>{t?.removeEventListener(`abort`,i),n()},e);function i(){clearTimeout(r),n()}t?.addEventListener(`abort`,i)})}function Gi(e,t,n,r){return!(!r||n>=zi||!Hi.includes(e)||!Vi.includes(t))}var Ki=class{constructor(e){this.shouldThrowOnError=!1,this.retryEnabled=!0,this.method=e.method,this.url=e.url,this.headers=new Headers(e.headers),this.schema=e.schema,this.body=e.body,this.shouldThrowOnError=e.shouldThrowOnError??!1,this.signal=e.signal,this.isMaybeSingle=e.isMaybeSingle??!1,this.shouldStripNulls=e.shouldStripNulls??!1,this.urlLengthLimit=e.urlLengthLimit??8e3,this.retryEnabled=e.retry??!0,e.fetch?this.fetch=e.fetch:this.fetch=fetch}throwOnError(){return this.shouldThrowOnError=!0,this}stripNulls(){if(this.headers.get(`Accept`)===`text/csv`)throw Error(`stripNulls() cannot be used with csv()`);return this.shouldStripNulls=!0,this}setHeader(e,t){return this.headers=new Headers(this.headers),this.headers.set(e,t),this}retry(e){return this.retryEnabled=e,this}then(e,t){var n=this;if(this.schema===void 0||([`GET`,`HEAD`].includes(this.method)?this.headers.set(`Accept-Profile`,this.schema):this.headers.set(`Content-Profile`,this.schema)),this.method!==`GET`&&this.method!==`HEAD`&&this.headers.set(`Content-Type`,`application/json`),this.shouldStripNulls){let e=this.headers.get(`Accept`);e===`application/vnd.pgrst.object+json`?this.headers.set(`Accept`,`application/vnd.pgrst.object+json;nulls=stripped`):(!e||e===`application/json`)&&this.headers.set(`Accept`,`application/vnd.pgrst.array+json;nulls=stripped`)}let r=this.fetch,i=(async()=>{let e=0;for(;;){let t={};n.headers.forEach((e,n)=>{t[n]=e}),e>0&&(t[`X-Retry-Count`]=String(e));let i;try{i=await r(n.url.toString(),{method:n.method,headers:t,body:JSON.stringify(n.body,(e,t)=>typeof t==`bigint`?t.toString():t),signal:n.signal})}catch(t){if(t?.name===`AbortError`||t?.code===`ABORT_ERR`||!Hi.includes(n.method))throw t;if(n.retryEnabled&&e<zi){let t=Bi(e);e++,await Wi(t,n.signal);continue}throw t}if(Gi(n.method,i.status,e,n.retryEnabled)){let t=i.headers?.get(`Retry-After`)??null,r=t===null?Bi(e):Math.max(0,parseInt(t,10)||0)*1e3;await i.text(),e++,await Wi(r,n.signal);continue}return await n.processResponse(i)}})();return this.shouldThrowOnError||(i=i.catch(e=>{let t=``,n=``,r=``,i=e?.cause;if(i){let n=i?.message??``,r=i?.code??``;t=`${e?.name??`FetchError`}: ${e?.message}`,t+=`\n\nCaused by: ${i?.name??`Error`}: ${n}`,r&&(t+=` (${r})`),i?.stack&&(t+=`\n${i.stack}`)}else t=e?.stack??``;let a=this.url.toString().length;return e?.name===`AbortError`||e?.code===`ABORT_ERR`?(r=``,n=`Request was aborted (timeout or manual cancellation)`,a>this.urlLengthLimit&&(n+=`. Note: Your request URL is ${a} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`)):(i?.name===`HeadersOverflowError`||i?.code===`UND_ERR_HEADERS_OVERFLOW`)&&(r=``,n=`HTTP headers exceeded server limits (typically 16KB)`,a>this.urlLengthLimit&&(n+=`. Your request URL is ${a} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`)),{success:!1,error:{message:`${e?.name??`FetchError`}: ${e?.message}`,details:t,hint:n,code:r},data:null,count:null,status:0,statusText:``}})),i.then(e,t)}async processResponse(e){var t=this;let n=null,r=null,i=null,a=e.status,o=e.statusText;if(e.ok){if(t.method!==`HEAD`){let i=await e.text();if(i!==``)if(t.headers.get(`Accept`)===`text/csv`)r=i;else if(t.headers.get(`Accept`)&&t.headers.get(`Accept`)?.includes(`application/vnd.pgrst.plan+text`))r=i;else try{r=JSON.parse(i)}catch{if(n={message:i},r=null,t.shouldThrowOnError)throw new Ui({message:i,details:``,hint:``,code:``})}}let s=t.headers.get(`Prefer`)?.match(/count=(exact|planned|estimated)/),c=e.headers.get(`content-range`)?.split(`/`);s&&c&&c.length>1&&(i=parseInt(c[1])),t.isMaybeSingle&&Array.isArray(r)&&(r.length>1?(n={code:`PGRST116`,details:`Results contain ${r.length} rows, application/vnd.pgrst.object+json requires 1 row`,hint:null,message:`JSON object requested, multiple (or no) rows returned`},r=null,i=null,a=406,o=`Not Acceptable`):r=r.length===1?r[0]:null)}else{let i=await e.text();try{n=JSON.parse(i),Array.isArray(n)&&e.status===404&&(r=[],n=null,a=200,o=`OK`)}catch{e.status===404&&i===``?(a=204,o=`No Content`):n={message:i}}if(n&&t.shouldThrowOnError)throw new Ui(n)}return{success:n===null,error:n,data:r,count:i,status:a,statusText:o}}returns(){return this}overrideTypes(){return this}},qi=class extends Ki{throwOnError(){return super.throwOnError()}select(e){let t=!1,n=(e??`*`).split(``).map(e=>/\s/.test(e)&&!t?``:(e===`"`&&(t=!t),e)).join(``);return this.url.searchParams.set(`select`,n),this.headers.append(`Prefer`,`return=representation`),this}order(e,{ascending:t=!0,nullsFirst:n,foreignTable:r,referencedTable:i=r}={}){let a=i?`${i}.order`:`order`,o=this.url.searchParams.get(a);return this.url.searchParams.set(a,`${o?`${o},`:``}${e}.${t?`asc`:`desc`}${n===void 0?``:n?`.nullsfirst`:`.nullslast`}`),this}limit(e,{foreignTable:t,referencedTable:n=t}={}){let r=n===void 0?`limit`:`${n}.limit`;return this.url.searchParams.set(r,`${e}`),this}range(e,t,{foreignTable:n,referencedTable:r=n}={}){let i=r===void 0?`offset`:`${r}.offset`,a=r===void 0?`limit`:`${r}.limit`;return this.url.searchParams.set(i,`${e}`),this.url.searchParams.set(a,`${t-e+1}`),this}abortSignal(e){return this.signal=e,this}single(){return this.headers.set(`Accept`,`application/vnd.pgrst.object+json`),this}maybeSingle(){return this.isMaybeSingle=!0,this}csv(){return this.headers.set(`Accept`,`text/csv`),this}geojson(){return this.headers.set(`Accept`,`application/geo+json`),this}explain({analyze:e=!1,verbose:t=!1,settings:n=!1,buffers:r=!1,wal:i=!1,format:a=`text`}={}){let o=[e?`analyze`:null,t?`verbose`:null,n?`settings`:null,r?`buffers`:null,i?`wal`:null].filter(Boolean).join(`|`),s=this.headers.get(`Accept`)??`application/json`;return this.headers.set(`Accept`,`application/vnd.pgrst.plan+${a}; for="${s}"; options=${o};`),this}rollback(){return this.headers.append(`Prefer`,`tx=rollback`),this}returns(){return this}maxAffected(e){return this.headers.append(`Prefer`,`handling=strict`),this.headers.append(`Prefer`,`max-affected=${e}`),this}},Ji=RegExp(`[,()]`),Yi=class extends qi{throwOnError(){return super.throwOnError()}eq(e,t){return this.url.searchParams.append(e,`eq.${t}`),this}neq(e,t){return this.url.searchParams.append(e,`neq.${t}`),this}gt(e,t){return this.url.searchParams.append(e,`gt.${t}`),this}gte(e,t){return this.url.searchParams.append(e,`gte.${t}`),this}lt(e,t){return this.url.searchParams.append(e,`lt.${t}`),this}lte(e,t){return this.url.searchParams.append(e,`lte.${t}`),this}like(e,t){return this.url.searchParams.append(e,`like.${t}`),this}likeAllOf(e,t){return this.url.searchParams.append(e,`like(all).{${t.join(`,`)}}`),this}likeAnyOf(e,t){return this.url.searchParams.append(e,`like(any).{${t.join(`,`)}}`),this}ilike(e,t){return this.url.searchParams.append(e,`ilike.${t}`),this}ilikeAllOf(e,t){return this.url.searchParams.append(e,`ilike(all).{${t.join(`,`)}}`),this}ilikeAnyOf(e,t){return this.url.searchParams.append(e,`ilike(any).{${t.join(`,`)}}`),this}regexMatch(e,t){return this.url.searchParams.append(e,`match.${t}`),this}regexIMatch(e,t){return this.url.searchParams.append(e,`imatch.${t}`),this}is(e,t){return this.url.searchParams.append(e,`is.${t}`),this}isDistinct(e,t){return this.url.searchParams.append(e,`isdistinct.${t}`),this}in(e,t){let n=Array.from(new Set(t)).map(e=>typeof e==`string`&&Ji.test(e)?`"${e}"`:`${e}`).join(`,`);return this.url.searchParams.append(e,`in.(${n})`),this}notIn(e,t){let n=Array.from(new Set(t)).map(e=>typeof e==`string`&&Ji.test(e)?`"${e}"`:`${e}`).join(`,`);return this.url.searchParams.append(e,`not.in.(${n})`),this}contains(e,t){return typeof t==`string`?this.url.searchParams.append(e,`cs.${t}`):Array.isArray(t)?this.url.searchParams.append(e,`cs.{${t.join(`,`)}}`):this.url.searchParams.append(e,`cs.${JSON.stringify(t)}`),this}containedBy(e,t){return typeof t==`string`?this.url.searchParams.append(e,`cd.${t}`):Array.isArray(t)?this.url.searchParams.append(e,`cd.{${t.join(`,`)}}`):this.url.searchParams.append(e,`cd.${JSON.stringify(t)}`),this}rangeGt(e,t){return this.url.searchParams.append(e,`sr.${t}`),this}rangeGte(e,t){return this.url.searchParams.append(e,`nxl.${t}`),this}rangeLt(e,t){return this.url.searchParams.append(e,`sl.${t}`),this}rangeLte(e,t){return this.url.searchParams.append(e,`nxr.${t}`),this}rangeAdjacent(e,t){return this.url.searchParams.append(e,`adj.${t}`),this}overlaps(e,t){return typeof t==`string`?this.url.searchParams.append(e,`ov.${t}`):this.url.searchParams.append(e,`ov.{${t.join(`,`)}}`),this}textSearch(e,t,{config:n,type:r}={}){let i=``;r===`plain`?i=`pl`:r===`phrase`?i=`ph`:r===`websearch`&&(i=`w`);let a=n===void 0?``:`(${n})`;return this.url.searchParams.append(e,`${i}fts${a}.${t}`),this}match(e){return Object.entries(e).filter(([e,t])=>t!==void 0).forEach(([e,t])=>{this.url.searchParams.append(e,`eq.${t}`)}),this}not(e,t,n){return this.url.searchParams.append(e,`not.${t}.${n}`),this}or(e,{foreignTable:t,referencedTable:n=t}={}){let r=n?`${n}.or`:`or`;return this.url.searchParams.append(r,`(${e})`),this}filter(e,t,n){return this.url.searchParams.append(e,`${t}.${n}`),this}},Xi=class{constructor(e,{headers:t={},schema:n,fetch:r,urlLengthLimit:i=8e3,retry:a}){this.url=e,this.headers=new Headers(t),this.schema=n,this.fetch=r,this.urlLengthLimit=i,this.retry=a}cloneRequestState(){return{url:new URL(this.url.toString()),headers:new Headers(this.headers)}}select(e,t){let{head:n=!1,count:r}=t??{},i=n?`HEAD`:`GET`,a=!1,o=(e??`*`).split(``).map(e=>/\s/.test(e)&&!a?``:(e===`"`&&(a=!a),e)).join(``),{url:s,headers:c}=this.cloneRequestState();return s.searchParams.set(`select`,o),r&&c.append(`Prefer`,`count=${r}`),new Yi({method:i,url:s,headers:c,schema:this.schema,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}insert(e,{count:t,defaultToNull:n=!0}={}){let{url:r,headers:i}=this.cloneRequestState();if(t&&i.append(`Prefer`,`count=${t}`),n||i.append(`Prefer`,`missing=default`),Array.isArray(e)){let t=e.reduce((e,t)=>e.concat(Object.keys(t)),[]);if(t.length>0){let e=[...new Set(t)].map(e=>`"${e}"`);r.searchParams.set(`columns`,e.join(`,`))}}return new Yi({method:`POST`,url:r,headers:i,schema:this.schema,body:e,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}upsert(e,{onConflict:t,ignoreDuplicates:n=!1,count:r,defaultToNull:i=!0}={}){let{url:a,headers:o}=this.cloneRequestState();if(o.append(`Prefer`,`resolution=${n?`ignore`:`merge`}-duplicates`),t!==void 0&&a.searchParams.set(`on_conflict`,t),r&&o.append(`Prefer`,`count=${r}`),i||o.append(`Prefer`,`missing=default`),Array.isArray(e)){let t=e.reduce((e,t)=>e.concat(Object.keys(t)),[]);if(t.length>0){let e=[...new Set(t)].map(e=>`"${e}"`);a.searchParams.set(`columns`,e.join(`,`))}}return new Yi({method:`POST`,url:a,headers:o,schema:this.schema,body:e,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}update(e,{count:t}={}){let{url:n,headers:r}=this.cloneRequestState();return t&&r.append(`Prefer`,`count=${t}`),new Yi({method:`PATCH`,url:n,headers:r,schema:this.schema,body:e,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}delete({count:e}={}){let{url:t,headers:n}=this.cloneRequestState();return e&&n.append(`Prefer`,`count=${e}`),new Yi({method:`DELETE`,url:t,headers:n,schema:this.schema,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}};function Zi(e){"@babel/helpers - typeof";return Zi=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},Zi(e)}function Qi(e,t){if(Zi(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(Zi(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function $i(e){var t=Qi(e,`string`);return Zi(t)==`symbol`?t:t+``}function ea(e,t,n){return(t=$i(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function ta(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function na(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?ta(Object(n),!0).forEach(function(t){ea(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ta(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var ra=class e{constructor(e,{headers:t={},schema:n,fetch:r,timeout:i,urlLengthLimit:a=8e3,retry:o}={}){this.url=e,this.headers=new Headers(t),this.schemaName=n,this.urlLengthLimit=a;let s=r??globalThis.fetch;i!==void 0&&i>0?this.fetch=(e,t)=>{let n=new AbortController,r=setTimeout(()=>n.abort(),i),a=t?.signal;if(a){if(a.aborted)return clearTimeout(r),s(e,t);let i=()=>{clearTimeout(r),n.abort()};return a.addEventListener(`abort`,i,{once:!0}),s(e,na(na({},t),{},{signal:n.signal})).finally(()=>{clearTimeout(r),a.removeEventListener(`abort`,i)})}return s(e,na(na({},t),{},{signal:n.signal})).finally(()=>clearTimeout(r))}:this.fetch=s,this.retry=o}from(e){if(!e||typeof e!=`string`||e.trim()===``)throw Error(`Invalid relation name: relation must be a non-empty string.`);return new Xi(new URL(`${this.url}/${e}`),{headers:new Headers(this.headers),schema:this.schemaName,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}schema(t){return new e(this.url,{headers:this.headers,schema:t,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}rpc(e,t={},{head:n=!1,get:r=!1,count:i}={}){let a,o=new URL(`${this.url}/rpc/${e}`),s,c=e=>typeof e==`object`&&!!e&&(!Array.isArray(e)||e.some(c)),l=n&&Object.values(t).some(c);l?(a=`POST`,s=t):n||r?(a=n?`HEAD`:`GET`,Object.entries(t).filter(([e,t])=>t!==void 0).map(([e,t])=>[e,Array.isArray(t)?`{${t.join(`,`)}}`:`${t}`]).forEach(([e,t])=>{o.searchParams.append(e,t)})):(a=`POST`,s=t);let u=new Headers(this.headers);return l?u.set(`Prefer`,i?`count=${i},return=minimal`:`return=minimal`):i&&u.set(`Prefer`,`count=${i}`),new Yi({method:a,url:o,headers:u,schema:this.schemaName,body:s,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}},ia=class{constructor(){}static detectEnvironment(){if(typeof WebSocket<`u`)return{type:`native`,wsConstructor:WebSocket};let e=globalThis;if(typeof globalThis<`u`&&e.WebSocket!==void 0)return{type:`native`,wsConstructor:e.WebSocket};let t=typeof global<`u`?global:void 0;if(t&&t.WebSocket!==void 0)return{type:`native`,wsConstructor:t.WebSocket};if(typeof globalThis<`u`&&e.WebSocketPair!==void 0&&globalThis.WebSocket===void 0)return{type:`cloudflare`,error:`Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.`,workaround:`Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime.`};if(typeof globalThis<`u`&&e.EdgeRuntime||typeof navigator<`u`&&navigator.userAgent?.includes(`Vercel-Edge`))return{type:`unsupported`,error:`Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.`,workaround:`Use serverless functions or a different deployment target for WebSocket functionality.`};let n=globalThis.process;if(n){let e=n.versions;if(e&&e.node){let t=e.node,n=parseInt(t.replace(/^v/,``).split(`.`)[0]);return n>=22?globalThis.WebSocket===void 0?{type:`unsupported`,error:`Node.js ${n} detected but native WebSocket not found.`,workaround:`Provide a WebSocket implementation via the transport option.`}:{type:`native`,wsConstructor:globalThis.WebSocket}:{type:`unsupported`,error:`Node.js ${n} detected without native WebSocket support.`,workaround:`For Node.js < 22, install "ws" package and provide it via the transport option:
import ws from "ws"
new RealtimeClient(url, { transport: ws })`}}}return{type:`unsupported`,error:`Unknown JavaScript runtime without WebSocket support.`,workaround:`Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation.`}}static getWebSocketConstructor(){let e=this.detectEnvironment();if(e.wsConstructor)return e.wsConstructor;let t=e.error||`WebSocket not supported in this environment.`;throw e.workaround&&(t+=`\n\nSuggested solution: ${e.workaround}`),Error(t)}static isWebSocketSupported(){try{let e=this.detectEnvironment();return e.type===`native`||e.type===`ws`}catch{return!1}}},aa=`realtime-js/2.108.2`,oa=`1.0.0`,sa=`2.0.0`,ca=sa,la=1e4,ua={closed:`closed`,errored:`errored`,joined:`joined`,joining:`joining`,leaving:`leaving`},da={close:`phx_close`,error:`phx_error`,join:`phx_join`,reply:`phx_reply`,leave:`phx_leave`,access_token:`access_token`},fa={connecting:`connecting`,open:`open`,closing:`closing`,closed:`closed`},pa=class{constructor(e){this.HEADER_LENGTH=1,this.USER_BROADCAST_PUSH_META_LENGTH=6,this.KINDS={userBroadcastPush:3,userBroadcast:4},this.BINARY_ENCODING=0,this.JSON_ENCODING=1,this.BROADCAST_EVENT=`broadcast`,this.allowedMetadataKeys=[],this.allowedMetadataKeys=e??[]}encode(e,t){if(e.event===this.BROADCAST_EVENT&&!(e.payload instanceof ArrayBuffer)&&typeof e.payload.event==`string`)return t(this._binaryEncodeUserBroadcastPush(e));let n=[e.join_ref,e.ref,e.topic,e.event,e.payload];return t(JSON.stringify(n))}_binaryEncodeUserBroadcastPush(e){return this._isArrayBuffer(e.payload?.payload)?this._encodeBinaryUserBroadcastPush(e):this._encodeJsonUserBroadcastPush(e)}_encodeBinaryUserBroadcastPush(e){let t=e.payload?.payload??new ArrayBuffer(0);return this._encodeUserBroadcastPush(e,this.BINARY_ENCODING,t)}_encodeJsonUserBroadcastPush(e){let t=e.payload?.payload??{},n=new TextEncoder().encode(JSON.stringify(t)).buffer;return this._encodeUserBroadcastPush(e,this.JSON_ENCODING,n)}_encodeUserBroadcastPush(e,t,n){let r=e.topic,i=e.ref??``,a=e.join_ref??``,o=e.payload.event,s=this.allowedMetadataKeys?this._pick(e.payload,this.allowedMetadataKeys):{},c=Object.keys(s).length===0?``:JSON.stringify(s);if(a.length>255)throw Error(`joinRef length ${a.length} exceeds maximum of 255`);if(i.length>255)throw Error(`ref length ${i.length} exceeds maximum of 255`);if(r.length>255)throw Error(`topic length ${r.length} exceeds maximum of 255`);if(o.length>255)throw Error(`userEvent length ${o.length} exceeds maximum of 255`);if(c.length>255)throw Error(`metadata length ${c.length} exceeds maximum of 255`);let l=this.USER_BROADCAST_PUSH_META_LENGTH+a.length+i.length+r.length+o.length+c.length,u=new ArrayBuffer(this.HEADER_LENGTH+l),d=new DataView(u),f=0;d.setUint8(f++,this.KINDS.userBroadcastPush),d.setUint8(f++,a.length),d.setUint8(f++,i.length),d.setUint8(f++,r.length),d.setUint8(f++,o.length),d.setUint8(f++,c.length),d.setUint8(f++,t),Array.from(a,e=>d.setUint8(f++,e.charCodeAt(0))),Array.from(i,e=>d.setUint8(f++,e.charCodeAt(0))),Array.from(r,e=>d.setUint8(f++,e.charCodeAt(0))),Array.from(o,e=>d.setUint8(f++,e.charCodeAt(0))),Array.from(c,e=>d.setUint8(f++,e.charCodeAt(0)));var p=new Uint8Array(u.byteLength+n.byteLength);return p.set(new Uint8Array(u),0),p.set(new Uint8Array(n),u.byteLength),p.buffer}decode(e,t){if(this._isArrayBuffer(e))return t(this._binaryDecode(e));if(typeof e==`string`){let[n,r,i,a,o]=JSON.parse(e);return t({join_ref:n,ref:r,topic:i,event:a,payload:o})}return t({})}_binaryDecode(e){let t=new DataView(e),n=t.getUint8(0),r=new TextDecoder;switch(n){case this.KINDS.userBroadcast:return this._decodeUserBroadcast(e,t,r)}}_decodeUserBroadcast(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=t.getUint8(3),o=t.getUint8(4),s=this.HEADER_LENGTH+4,c=n.decode(e.slice(s,s+r));s+=r;let l=n.decode(e.slice(s,s+i));s+=i;let u=n.decode(e.slice(s,s+a));s+=a;let d=e.slice(s,e.byteLength),f=o===this.JSON_ENCODING?JSON.parse(n.decode(d)):d,p={type:this.BROADCAST_EVENT,event:l,payload:f};return a>0&&(p.meta=JSON.parse(u)),{join_ref:null,ref:null,topic:c,event:this.BROADCAST_EVENT,payload:p}}_isArrayBuffer(e){return e instanceof ArrayBuffer||e?.constructor?.name===`ArrayBuffer`}_pick(e,t){return!e||typeof e!=`object`?{}:Object.fromEntries(Object.entries(e).filter(([e])=>t.includes(e)))}},I;(function(e){e.abstime=`abstime`,e.bool=`bool`,e.date=`date`,e.daterange=`daterange`,e.float4=`float4`,e.float8=`float8`,e.int2=`int2`,e.int4=`int4`,e.int4range=`int4range`,e.int8=`int8`,e.int8range=`int8range`,e.json=`json`,e.jsonb=`jsonb`,e.money=`money`,e.numeric=`numeric`,e.oid=`oid`,e.reltime=`reltime`,e.text=`text`,e.time=`time`,e.timestamp=`timestamp`,e.timestamptz=`timestamptz`,e.timetz=`timetz`,e.tsrange=`tsrange`,e.tstzrange=`tstzrange`})(I||={});var ma=(e,t,n={})=>{let r=n.skipTypes??[];return t?Object.keys(t).reduce((n,i)=>(n[i]=ha(i,e,t,r),n),{}):{}},ha=(e,t,n,r)=>{let i=t.find(t=>t.name===e)?.type,a=n[e];return i&&!r.includes(i)?ga(i,a):_a(a)},ga=(e,t)=>{if(e.charAt(0)===`_`)return xa(t,e.slice(1,e.length));switch(e){case I.bool:return va(t);case I.float4:case I.float8:case I.int2:case I.int4:case I.int8:case I.numeric:case I.oid:return ya(t);case I.json:case I.jsonb:return ba(t);case I.timestamp:return Sa(t);case I.abstime:case I.date:case I.daterange:case I.int4range:case I.int8range:case I.money:case I.reltime:case I.text:case I.time:case I.timestamptz:case I.timetz:case I.tsrange:case I.tstzrange:return _a(t);default:return _a(t)}},_a=e=>e,va=e=>{switch(e){case`t`:return!0;case`f`:return!1;default:return e}},ya=e=>{if(typeof e==`string`){let t=parseFloat(e);if(!Number.isNaN(t))return t}return e},ba=e=>{if(typeof e==`string`)try{return JSON.parse(e)}catch{return e}return e},xa=(e,t)=>{if(typeof e!=`string`)return e;let n=e.length-1,r=e[n];if(e[0]===`{`&&r===`}`){let r,i=e.slice(1,n);try{r=JSON.parse(`[`+i+`]`)}catch{r=i?i.split(`,`):[]}return r.map(e=>ga(t,e))}return e},Sa=e=>typeof e==`string`?e.replace(` `,`T`):e,Ca=e=>{let t=new URL(e);return t.protocol=t.protocol.replace(/^ws/i,`http`),t.pathname=t.pathname.replace(/\/+$/,``).replace(/\/socket\/websocket$/i,``).replace(/\/socket$/i,``).replace(/\/websocket$/i,``),t.pathname===``||t.pathname===`/`?t.pathname=`/api/broadcast`:t.pathname+=`/api/broadcast`,t.href},wa=e=>typeof e==`function`?e:function(){return e},Ta=typeof self<`u`?self:null,Ea=typeof window<`u`?window:null,Da=Ta||Ea||globalThis,Oa=`2.0.0`,ka=1e4,Aa=1e3,ja={connecting:0,open:1,closing:2,closed:3},Ma={closed:`closed`,errored:`errored`,joined:`joined`,joining:`joining`,leaving:`leaving`},Na={close:`phx_close`,error:`phx_error`,join:`phx_join`,reply:`phx_reply`,leave:`phx_leave`},Pa={longpoll:`longpoll`,websocket:`websocket`},Fa={complete:4},Ia=`base64url.bearer.phx.`,La=class{constructor(e,t,n,r){this.channel=e,this.event=t,this.payload=n||function(){return{}},this.receivedResp=null,this.timeout=r,this.timeoutTimer=null,this.recHooks=[],this.sent=!1,this.ref=void 0}resend(e){this.timeout=e,this.reset(),this.send()}send(){this.hasReceived(`timeout`)||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload(),ref:this.ref,join_ref:this.channel.joinRef()}))}receive(e,t){return this.hasReceived(e)&&t(this.receivedResp.response),this.recHooks.push({status:e,callback:t}),this}reset(){this.cancelRefEvent(),this.ref=null,this.refEvent=null,this.receivedResp=null,this.sent=!1}destroy(){this.cancelRefEvent(),this.cancelTimeout()}matchReceive({status:e,response:t,_ref:n}){this.recHooks.filter(t=>t.status===e).forEach(e=>e.callback(t))}cancelRefEvent(){this.refEvent&&this.channel.off(this.refEvent)}cancelTimeout(){clearTimeout(this.timeoutTimer),this.timeoutTimer=null}startTimeout(){this.timeoutTimer&&this.cancelTimeout(),this.ref=this.channel.socket.makeRef(),this.refEvent=this.channel.replyEventName(this.ref),this.channel.on(this.refEvent,e=>{this.cancelRefEvent(),this.cancelTimeout(),this.receivedResp=e,this.matchReceive(e)}),this.timeoutTimer=setTimeout(()=>{this.trigger(`timeout`,{})},this.timeout)}hasReceived(e){return this.receivedResp&&this.receivedResp.status===e}trigger(e,t){this.channel.trigger(this.refEvent,{status:e,response:t})}},Ra=class{constructor(e,t){this.callback=e,this.timerCalc=t,this.timer=void 0,this.tries=0}reset(){this.tries=0,clearTimeout(this.timer)}scheduleTimeout(){clearTimeout(this.timer),this.timer=setTimeout(()=>{this.tries+=1,this.callback()},this.timerCalc(this.tries+1))}},za=class{constructor(e,t,n){this.state=Ma.closed,this.topic=e,this.params=wa(t||{}),this.socket=n,this.bindings=[],this.bindingRef=0,this.timeout=this.socket.timeout,this.joinedOnce=!1,this.joinPush=new La(this,Na.join,this.params,this.timeout),this.pushBuffer=[],this.stateChangeRefs=[],this.rejoinTimer=new Ra(()=>{this.socket.isConnected()&&this.rejoin()},this.socket.rejoinAfterMs),this.stateChangeRefs.push(this.socket.onError(()=>this.rejoinTimer.reset())),this.stateChangeRefs.push(this.socket.onOpen(()=>{this.rejoinTimer.reset(),this.isErrored()&&this.rejoin()})),this.joinPush.receive(`ok`,()=>{this.state=Ma.joined,this.rejoinTimer.reset(),this.pushBuffer.forEach(e=>e.send()),this.pushBuffer=[]}),this.joinPush.receive(`error`,e=>{this.state=Ma.errored,this.socket.hasLogger()&&this.socket.log(`channel`,`error ${this.topic}`,e),this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.onClose(()=>{this.rejoinTimer.reset(),this.socket.hasLogger()&&this.socket.log(`channel`,`close ${this.topic}`),this.state=Ma.closed,this.socket.remove(this)}),this.onError(e=>{this.socket.hasLogger()&&this.socket.log(`channel`,`error ${this.topic}`,e),this.isJoining()&&this.joinPush.reset(),this.state=Ma.errored,this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.joinPush.receive(`timeout`,()=>{this.socket.hasLogger()&&this.socket.log(`channel`,`timeout ${this.topic}`,this.joinPush.timeout),new La(this,Na.leave,wa({}),this.timeout).send(),this.state=Ma.errored,this.joinPush.reset(),this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.on(Na.reply,(e,t)=>{this.trigger(this.replyEventName(t),e)})}join(e=this.timeout){if(this.joinedOnce)throw Error(`tried to join multiple times. 'join' can only be called a single time per channel instance`);return this.timeout=e,this.joinedOnce=!0,this.rejoin(),this.joinPush}teardown(){this.pushBuffer.forEach(e=>e.destroy()),this.pushBuffer=[],this.rejoinTimer.reset(),this.joinPush.destroy(),this.state=Ma.closed,this.bindings=[]}onClose(e){this.on(Na.close,e)}onError(e){return this.on(Na.error,t=>e(t))}on(e,t){let n=this.bindingRef++;return this.bindings.push({event:e,ref:n,callback:t}),n}off(e,t){this.bindings=this.bindings.filter(n=>!(n.event===e&&(t===void 0||t===n.ref)))}canPush(){return this.socket.isConnected()&&this.isJoined()}push(e,t,n=this.timeout){if(t||={},!this.joinedOnce)throw Error(`tried to push '${e}' to '${this.topic}' before joining. Use channel.join() before pushing events`);let r=new La(this,e,function(){return t},n);return this.canPush()?r.send():(r.startTimeout(),this.pushBuffer.push(r)),r}leave(e=this.timeout){this.rejoinTimer.reset(),this.joinPush.cancelTimeout(),this.state=Ma.leaving;let t=()=>{this.socket.hasLogger()&&this.socket.log(`channel`,`leave ${this.topic}`),this.trigger(Na.close,`leave`)},n=new La(this,Na.leave,wa({}),e);return n.receive(`ok`,()=>t()).receive(`timeout`,()=>t()),n.send(),this.canPush()||n.trigger(`ok`,{}),n}onMessage(e,t,n){return t}filterBindings(e,t,n){return!0}isMember(e,t,n,r){return this.topic===e?r&&r!==this.joinRef()?(this.socket.hasLogger()&&this.socket.log(`channel`,`dropping outdated message`,{topic:e,event:t,payload:n,joinRef:r}),!1):!0:!1}joinRef(){return this.joinPush.ref}rejoin(e=this.timeout){this.isLeaving()||(this.socket.leaveOpenTopic(this.topic),this.state=Ma.joining,this.joinPush.resend(e))}trigger(e,t,n,r){let i=this.onMessage(e,t,n,r);if(t&&!i)throw Error(`channel onMessage callbacks must return the payload, modified or unmodified`);let a=this.bindings.filter(r=>r.event===e&&this.filterBindings(r,t,n));for(let e=0;e<a.length;e++)a[e].callback(i,n,r||this.joinRef())}replyEventName(e){return`chan_reply_${e}`}isClosed(){return this.state===Ma.closed}isErrored(){return this.state===Ma.errored}isJoined(){return this.state===Ma.joined}isJoining(){return this.state===Ma.joining}isLeaving(){return this.state===Ma.leaving}},Ba=class{static request(e,t,n,r,i,a,o){if(Da.XDomainRequest){let n=new Da.XDomainRequest;return this.xdomainRequest(n,e,t,r,i,a,o)}else if(Da.XMLHttpRequest){let s=new Da.XMLHttpRequest;return this.xhrRequest(s,e,t,n,r,i,a,o)}else if(Da.fetch&&Da.AbortController)return this.fetchRequest(e,t,n,r,i,a,o);else throw Error(`No suitable XMLHttpRequest implementation found`)}static fetchRequest(e,t,n,r,i,a,o){let s={method:e,headers:n,body:r},c=null;return i&&(c=new AbortController,setTimeout(()=>c.abort(),i),s.signal=c.signal),Da.fetch(t,s).then(e=>e.text()).then(e=>this.parseJSON(e)).then(e=>o&&o(e)).catch(e=>{e.name===`AbortError`&&a?a():o&&o(null)}),c}static xdomainRequest(e,t,n,r,i,a,o){return e.timeout=i,e.open(t,n),e.onload=()=>{let t=this.parseJSON(e.responseText);o&&o(t)},a&&(e.ontimeout=a),e.onprogress=()=>{},e.send(r),e}static xhrRequest(e,t,n,r,i,a,o,s){e.open(t,n,!0),e.timeout=a;for(let[t,n]of Object.entries(r))e.setRequestHeader(t,n);return e.onerror=()=>s&&s(null),e.onreadystatechange=()=>{e.readyState===Fa.complete&&s&&s(this.parseJSON(e.responseText))},o&&(e.ontimeout=o),e.send(i),e}static parseJSON(e){if(!e||e===``)return null;try{return JSON.parse(e)}catch{return console&&console.log(`failed to parse JSON response`,e),null}}static serialize(e,t){let n=[];for(var r in e){if(!Object.prototype.hasOwnProperty.call(e,r))continue;let i=t?`${t}[${r}]`:r,a=e[r];typeof a==`object`?n.push(this.serialize(a,i)):n.push(encodeURIComponent(i)+`=`+encodeURIComponent(a))}return n.join(`&`)}static appendParams(e,t){return Object.keys(t).length===0?e:`${e}${e.match(/\?/)?`&`:`?`}${this.serialize(t)}`}},Va=e=>{let t=``,n=new Uint8Array(e),r=n.byteLength;for(let e=0;e<r;e++)t+=String.fromCharCode(n[e]);return btoa(t)},Ha=class{constructor(e,t){t&&t.length===2&&t[1].startsWith(Ia)&&(this.authToken=atob(t[1].slice(Ia.length))),this.endPoint=null,this.token=null,this.skipHeartbeat=!0,this.reqs=new Set,this.awaitingBatchAck=!1,this.currentBatch=null,this.currentBatchTimer=null,this.batchBuffer=[],this.onopen=function(){},this.onerror=function(){},this.onmessage=function(){},this.onclose=function(){},this.pollEndpoint=this.normalizeEndpoint(e),this.readyState=ja.connecting,setTimeout(()=>this.poll(),0)}normalizeEndpoint(e){return e.replace(`ws://`,`http://`).replace(`wss://`,`https://`).replace(RegExp(`(.*)/`+Pa.websocket),`$1/`+Pa.longpoll)}endpointURL(){return Ba.appendParams(this.pollEndpoint,{token:this.token})}closeAndRetry(e,t,n){this.close(e,t,n),this.readyState=ja.connecting}ontimeout(){this.onerror(`timeout`),this.closeAndRetry(1005,`timeout`,!1)}isActive(){return this.readyState===ja.open||this.readyState===ja.connecting}poll(){let e={Accept:`application/json`};this.authToken&&(e[`X-Phoenix-AuthToken`]=this.authToken),this.ajax(`GET`,e,null,()=>this.ontimeout(),e=>{if(e){var{status:t,token:n,messages:r}=e;if(t===410&&this.token!==null){this.onerror(410),this.closeAndRetry(3410,`session_gone`,!1);return}this.token=n}else t=0;switch(t){case 200:r.forEach(e=>{setTimeout(()=>this.onmessage({data:e}),0)}),this.poll();break;case 204:this.poll();break;case 410:this.readyState=ja.open,this.onopen({}),this.poll();break;case 403:this.onerror(403),this.close(1008,`forbidden`,!1);break;case 0:case 500:this.onerror(500),this.closeAndRetry(1011,`internal server error`,500);break;default:throw Error(`unhandled poll status ${t}`)}})}send(e){typeof e!=`string`&&(e=Va(e)),this.currentBatch?this.currentBatch.push(e):this.awaitingBatchAck?this.batchBuffer.push(e):(this.currentBatch=[e],this.currentBatchTimer=setTimeout(()=>{this.batchSend(this.currentBatch),this.currentBatch=null},0))}batchSend(e){this.awaitingBatchAck=!0,this.ajax(`POST`,{"Content-Type":`application/x-ndjson`},e.join(`
`),()=>this.onerror(`timeout`),e=>{this.awaitingBatchAck=!1,!e||e.status!==200?(this.onerror(e&&e.status),this.closeAndRetry(1011,`internal server error`,!1)):this.batchBuffer.length>0&&(this.batchSend(this.batchBuffer),this.batchBuffer=[])})}close(e,t,n){for(let e of this.reqs)e.abort();this.readyState=ja.closed;let r=Object.assign({code:1e3,reason:void 0,wasClean:!0},{code:e,reason:t,wasClean:n});this.batchBuffer=[],clearTimeout(this.currentBatchTimer),this.currentBatchTimer=null,typeof CloseEvent<`u`?this.onclose(new CloseEvent(`close`,r)):this.onclose(r)}ajax(e,t,n,r,i){let a;a=Ba.request(e,this.endpointURL(),t,n,this.timeout,()=>{this.reqs.delete(a),r()},e=>{this.reqs.delete(a),this.isActive()&&i(e)}),this.reqs.add(a)}},Ua=class e{constructor(t,n={}){let r=n.events||{state:`presence_state`,diff:`presence_diff`};this.state={},this.pendingDiffs=[],this.channel=t,this.joinRef=null,this.caller={onJoin:function(){},onLeave:function(){},onSync:function(){}},this.channel.on(r.state,t=>{let{onJoin:n,onLeave:r,onSync:i}=this.caller;this.joinRef=this.channel.joinRef(),this.state=e.syncState(this.state,t,n,r),this.pendingDiffs.forEach(t=>{this.state=e.syncDiff(this.state,t,n,r)}),this.pendingDiffs=[],i()}),this.channel.on(r.diff,t=>{let{onJoin:n,onLeave:r,onSync:i}=this.caller;this.inPendingSyncState()?this.pendingDiffs.push(t):(this.state=e.syncDiff(this.state,t,n,r),i())})}onJoin(e){this.caller.onJoin=e}onLeave(e){this.caller.onLeave=e}onSync(e){this.caller.onSync=e}list(t){return e.list(this.state,t)}inPendingSyncState(){return!this.joinRef||this.joinRef!==this.channel.joinRef()}static syncState(e,t,n,r){let i=this.clone(e),a={},o={};return this.map(i,(e,n)=>{t[e]||(o[e]=n)}),this.map(t,(e,t)=>{let n=i[e];if(n){let r=t.metas.map(e=>e.phx_ref),i=n.metas.map(e=>e.phx_ref),s=t.metas.filter(e=>i.indexOf(e.phx_ref)<0),c=n.metas.filter(e=>r.indexOf(e.phx_ref)<0);s.length>0&&(a[e]=t,a[e].metas=s),c.length>0&&(o[e]=this.clone(n),o[e].metas=c)}else a[e]=t}),this.syncDiff(i,{joins:a,leaves:o},n,r)}static syncDiff(e,t,n,r){let{joins:i,leaves:a}=this.clone(t);return n||=function(){},r||=function(){},this.map(i,(t,r)=>{let i=e[t];if(e[t]=this.clone(r),i){let n=e[t].metas.map(e=>e.phx_ref),r=i.metas.filter(e=>n.indexOf(e.phx_ref)<0);e[t].metas.unshift(...r)}n(t,i,r)}),this.map(a,(t,n)=>{let i=e[t];if(!i)return;let a=n.metas.map(e=>e.phx_ref);i.metas=i.metas.filter(e=>a.indexOf(e.phx_ref)<0),r(t,i,n),i.metas.length===0&&delete e[t]}),e}static list(e,t){return t||=function(e,t){return t},this.map(e,(e,n)=>t(e,n))}static map(e,t){return Object.getOwnPropertyNames(e).map(n=>t(n,e[n]))}static clone(e){return JSON.parse(JSON.stringify(e))}},Wa={HEADER_LENGTH:1,META_LENGTH:4,KINDS:{push:0,reply:1,broadcast:2},encode(e,t){if(e.payload.constructor===ArrayBuffer)return t(this.binaryEncode(e));{let n=[e.join_ref,e.ref,e.topic,e.event,e.payload];return t(JSON.stringify(n))}},decode(e,t){if(e.constructor===ArrayBuffer)return t(this.binaryDecode(e));{let[n,r,i,a,o]=JSON.parse(e);return t({join_ref:n,ref:r,topic:i,event:a,payload:o})}},binaryEncode(e){let{join_ref:t,ref:n,event:r,topic:i,payload:a}=e,o=this.META_LENGTH+t.length+n.length+i.length+r.length,s=new ArrayBuffer(this.HEADER_LENGTH+o),c=new DataView(s),l=0;c.setUint8(l++,this.KINDS.push),c.setUint8(l++,t.length),c.setUint8(l++,n.length),c.setUint8(l++,i.length),c.setUint8(l++,r.length),Array.from(t,e=>c.setUint8(l++,e.charCodeAt(0))),Array.from(n,e=>c.setUint8(l++,e.charCodeAt(0))),Array.from(i,e=>c.setUint8(l++,e.charCodeAt(0))),Array.from(r,e=>c.setUint8(l++,e.charCodeAt(0)));var u=new Uint8Array(s.byteLength+a.byteLength);return u.set(new Uint8Array(s),0),u.set(new Uint8Array(a),s.byteLength),u.buffer},binaryDecode(e){let t=new DataView(e),n=t.getUint8(0),r=new TextDecoder;switch(n){case this.KINDS.push:return this.decodePush(e,t,r);case this.KINDS.reply:return this.decodeReply(e,t,r);case this.KINDS.broadcast:return this.decodeBroadcast(e,t,r)}},decodePush(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=t.getUint8(3),o=this.HEADER_LENGTH+this.META_LENGTH-1,s=n.decode(e.slice(o,o+r));o+=r;let c=n.decode(e.slice(o,o+i));o+=i;let l=n.decode(e.slice(o,o+a));return o+=a,{join_ref:s,ref:null,topic:c,event:l,payload:e.slice(o,e.byteLength)}},decodeReply(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=t.getUint8(3),o=t.getUint8(4),s=this.HEADER_LENGTH+this.META_LENGTH,c=n.decode(e.slice(s,s+r));s+=r;let l=n.decode(e.slice(s,s+i));s+=i;let u=n.decode(e.slice(s,s+a));s+=a;let d=n.decode(e.slice(s,s+o));s+=o;let f={status:d,response:e.slice(s,e.byteLength)};return{join_ref:c,ref:l,topic:u,event:Na.reply,payload:f}},decodeBroadcast(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=this.HEADER_LENGTH+2,o=n.decode(e.slice(a,a+r));a+=r;let s=n.decode(e.slice(a,a+i));return a+=i,{join_ref:null,ref:null,topic:o,event:s,payload:e.slice(a,e.byteLength)}}},Ga=class{constructor(e,t={}){this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.channels=[],this.sendBuffer=[],this.ref=0,this.fallbackRef=null,this.timeout=t.timeout||ka,this.transport=t.transport||Da.WebSocket||Ha,this.conn=void 0,this.primaryPassedHealthCheck=!1,this.longPollFallbackMs=t.longPollFallbackMs,this.fallbackTimer=null;let n=null;try{n=Da&&Da.sessionStorage}catch{}this.sessionStore=t.sessionStorage||n,this.establishedConnections=0,this.defaultEncoder=Wa.encode.bind(Wa),this.defaultDecoder=Wa.decode.bind(Wa),this.closeWasClean=!0,this.disconnecting=!1,this.binaryType=t.binaryType||`arraybuffer`,this.connectClock=1,this.pageHidden=!1,this.encode=void 0,this.decode=void 0,this.transport===Ha?(this.encode=this.defaultEncoder,this.decode=this.defaultDecoder):(this.encode=t.encode||this.defaultEncoder,this.decode=t.decode||this.defaultDecoder);let r=null;Ea&&Ea.addEventListener&&(Ea.addEventListener(`pagehide`,e=>{this.conn&&(this.disconnect(),r=this.connectClock)}),Ea.addEventListener(`pageshow`,e=>{r===this.connectClock&&(r=null,this.connect())}),Ea.addEventListener(`visibilitychange`,()=>{document.visibilityState===`hidden`?this.pageHidden=!0:(this.pageHidden=!1,!this.isConnected()&&!this.closeWasClean&&this.teardown(()=>this.connect()))})),this.heartbeatIntervalMs=t.heartbeatIntervalMs||3e4,this.autoSendHeartbeat=t.autoSendHeartbeat??!0,this.heartbeatCallback=t.heartbeatCallback??(()=>{}),this.rejoinAfterMs=e=>t.rejoinAfterMs?t.rejoinAfterMs(e):[1e3,2e3,5e3][e-1]||1e4,this.reconnectAfterMs=e=>t.reconnectAfterMs?t.reconnectAfterMs(e):[10,50,100,150,200,250,500,1e3,2e3][e-1]||5e3,this.logger=t.logger||null,!this.logger&&t.debug&&(this.logger=(e,t,n)=>{console.log(`${e}: ${t}`,n)}),this.longpollerTimeout=t.longpollerTimeout||2e4,this.params=wa(t.params||{}),this.endPoint=`${e}/${Pa.websocket}`,this.vsn=t.vsn||Oa,this.heartbeatTimeoutTimer=null,this.heartbeatTimer=null,this.heartbeatSentAt=null,this.pendingHeartbeatRef=null,this.reconnectTimer=new Ra(()=>{if(this.pageHidden){this.log(`Not reconnecting as page is hidden!`),this.teardown();return}this.teardown(async()=>{t.beforeReconnect&&await t.beforeReconnect(),this.connect()})},this.reconnectAfterMs),this.authToken=t.authToken}getLongPollTransport(){return Ha}replaceTransport(e){this.connectClock++,this.closeWasClean=!0,clearTimeout(this.fallbackTimer),this.reconnectTimer.reset(),this.conn&&=(this.conn.close(),null),this.transport=e}protocol(){return location.protocol.match(/^https/)?`wss`:`ws`}endPointURL(){let e=Ba.appendParams(Ba.appendParams(this.endPoint,this.params()),{vsn:this.vsn});return e.charAt(0)===`/`?e.charAt(1)===`/`?`${this.protocol()}:${e}`:`${this.protocol()}://${location.host}${e}`:e}disconnect(e,t,n){this.connectClock++,this.disconnecting=!0,this.closeWasClean=!0,clearTimeout(this.fallbackTimer),this.reconnectTimer.reset(),this.teardown(()=>{this.disconnecting=!1,e&&e()},t,n)}connect(e){e&&(console&&console.log(`passing params to connect is deprecated. Instead pass :params to the Socket constructor`),this.params=wa(e)),!(this.conn&&!this.disconnecting)&&(this.longPollFallbackMs&&this.transport!==Ha?this.connectWithFallback(Ha,this.longPollFallbackMs):this.transportConnect())}log(e,t,n){this.logger&&this.logger(e,t,n)}hasLogger(){return this.logger!==null}onOpen(e){let t=this.makeRef();return this.stateChangeCallbacks.open.push([t,e]),t}onClose(e){let t=this.makeRef();return this.stateChangeCallbacks.close.push([t,e]),t}onError(e){let t=this.makeRef();return this.stateChangeCallbacks.error.push([t,e]),t}onMessage(e){let t=this.makeRef();return this.stateChangeCallbacks.message.push([t,e]),t}onHeartbeat(e){this.heartbeatCallback=e}ping(e){if(!this.isConnected())return!1;let t=this.makeRef(),n=Date.now();this.push({topic:`phoenix`,event:`heartbeat`,payload:{},ref:t});let r=this.onMessage(i=>{i.ref===t&&(this.off([r]),e(Date.now()-n))});return!0}transportName(e){switch(e){case Ha:return`LongPoll`;default:return e.name}}transportConnect(){this.connectClock++,this.closeWasClean=!1;let e;this.authToken&&(e=[`phoenix`,`${Ia}${btoa(this.authToken).replace(/=/g,``)}`]),this.conn=new this.transport(this.endPointURL(),e),this.conn.binaryType=this.binaryType,this.conn.timeout=this.longpollerTimeout,this.conn.onopen=()=>this.onConnOpen(),this.conn.onerror=e=>this.onConnError(e),this.conn.onmessage=e=>this.onConnMessage(e),this.conn.onclose=e=>this.onConnClose(e)}getSession(e){return this.sessionStore&&this.sessionStore.getItem(e)}storeSession(e,t){this.sessionStore&&this.sessionStore.setItem(e,t)}connectWithFallback(e,t=2500){clearTimeout(this.fallbackTimer);let n=!1,r=!0,i,a=this.transportName(e),o=t=>{this.log(`transport`,`falling back to ${a}...`,t),this.off([void 0,i]),r=!1,this.replaceTransport(e),this.transportConnect()};if(this.getSession(`phx:fallback:${a}`))return o(`memorized`);this.fallbackTimer=setTimeout(o,t),i=this.onError(e=>{this.log(`transport`,`error`,e),r&&!n&&(clearTimeout(this.fallbackTimer),o(e))}),this.fallbackRef&&this.off([this.fallbackRef]),this.fallbackRef=this.onOpen(()=>{if(n=!0,!r){let t=this.transportName(e);return this.primaryPassedHealthCheck||this.storeSession(`phx:fallback:${t}`,`true`),this.log(`transport`,`established ${t} fallback`)}clearTimeout(this.fallbackTimer),this.fallbackTimer=setTimeout(o,t),this.ping(e=>{this.log(`transport`,`connected to primary after`,e),this.primaryPassedHealthCheck=!0,clearTimeout(this.fallbackTimer)})}),this.transportConnect()}clearHeartbeats(){clearTimeout(this.heartbeatTimer),clearTimeout(this.heartbeatTimeoutTimer)}onConnOpen(){this.hasLogger()&&this.log(`transport`,`connected to ${this.endPointURL()}`),this.closeWasClean=!1,this.disconnecting=!1,this.establishedConnections++,this.flushSendBuffer(),this.reconnectTimer.reset(),this.autoSendHeartbeat&&this.resetHeartbeat(),this.triggerStateCallbacks(`open`)}heartbeatTimeout(){if(this.pendingHeartbeatRef){this.pendingHeartbeatRef=null,this.heartbeatSentAt=null,this.hasLogger()&&this.log(`transport`,`heartbeat timeout. Attempting to re-establish connection`);try{this.heartbeatCallback(`timeout`)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}this.triggerChanError(Error(`heartbeat timeout`)),this.closeWasClean=!1,this.teardown(()=>this.reconnectTimer.scheduleTimeout(),Aa,`heartbeat timeout`)}}resetHeartbeat(){this.conn&&this.conn.skipHeartbeat||(this.pendingHeartbeatRef=null,this.clearHeartbeats(),this.heartbeatTimer=setTimeout(()=>this.sendHeartbeat(),this.heartbeatIntervalMs))}teardown(e,t,n){if(!this.conn)return e&&e();let r=this.conn;this.waitForBufferDone(r,()=>{t?r.close(t,n||``):r.close(),this.waitForSocketClosed(r,()=>{this.conn===r&&(this.conn.onopen=function(){},this.conn.onerror=function(){},this.conn.onmessage=function(){},this.conn.onclose=function(){},this.conn=null),e&&e()})})}waitForBufferDone(e,t,n=1){if(n===5||!e.bufferedAmount){t();return}setTimeout(()=>{this.waitForBufferDone(e,t,n+1)},150*n)}waitForSocketClosed(e,t,n=1){if(n===5||e.readyState===ja.closed){t();return}setTimeout(()=>{this.waitForSocketClosed(e,t,n+1)},150*n)}onConnClose(e){this.conn&&(this.conn.onclose=()=>{}),this.hasLogger()&&this.log(`transport`,`close`,e),this.triggerChanError(e),this.clearHeartbeats(),this.closeWasClean||this.reconnectTimer.scheduleTimeout(),this.triggerStateCallbacks(`close`,e)}onConnError(e){this.hasLogger()&&this.log(`transport`,`error`,e);let t=this.transport,n=this.establishedConnections;this.triggerStateCallbacks(`error`,e,t,n),(t===this.transport||n>0)&&this.triggerChanError(e)}triggerChanError(e){this.channels.forEach(t=>{t.isErrored()||t.isLeaving()||t.isClosed()||t.trigger(Na.error,e)})}connectionState(){switch(this.conn&&this.conn.readyState){case ja.connecting:return`connecting`;case ja.open:return`open`;case ja.closing:return`closing`;default:return`closed`}}isConnected(){return this.connectionState()===`open`}remove(e){this.off(e.stateChangeRefs),this.channels=this.channels.filter(t=>t!==e)}off(e){for(let t in this.stateChangeCallbacks)this.stateChangeCallbacks[t]=this.stateChangeCallbacks[t].filter(([t])=>e.indexOf(t)===-1)}channel(e,t={}){let n=new za(e,t,this);return this.channels.push(n),n}push(e){if(this.hasLogger()){let{topic:t,event:n,payload:r,ref:i,join_ref:a}=e;this.log(`push`,`${t} ${n} (${a}, ${i})`,r)}this.isConnected()?this.encode(e,e=>this.conn.send(e)):this.sendBuffer.push(()=>this.encode(e,e=>this.conn.send(e)))}makeRef(){let e=this.ref+1;return e===this.ref?this.ref=0:this.ref=e,this.ref.toString()}sendHeartbeat(){if(!this.isConnected()){try{this.heartbeatCallback(`disconnected`)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}return}if(this.pendingHeartbeatRef){this.heartbeatTimeout();return}this.pendingHeartbeatRef=this.makeRef(),this.heartbeatSentAt=Date.now(),this.push({topic:`phoenix`,event:`heartbeat`,payload:{},ref:this.pendingHeartbeatRef});try{this.heartbeatCallback(`sent`)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}this.heartbeatTimeoutTimer=setTimeout(()=>this.heartbeatTimeout(),this.heartbeatIntervalMs)}flushSendBuffer(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(e=>e()),this.sendBuffer=[])}onConnMessage(e){this.decode(e.data,e=>{let{topic:t,event:n,payload:r,ref:i,join_ref:a}=e;if(i&&i===this.pendingHeartbeatRef){let e=this.heartbeatSentAt?Date.now()-this.heartbeatSentAt:void 0;this.clearHeartbeats();try{this.heartbeatCallback(r.status===`ok`?`ok`:`error`,e)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}this.pendingHeartbeatRef=null,this.heartbeatSentAt=null,this.autoSendHeartbeat&&(this.heartbeatTimer=setTimeout(()=>this.sendHeartbeat(),this.heartbeatIntervalMs))}this.hasLogger()&&this.log(`receive`,`${r.status||``} ${t} ${n} ${i&&`(`+i+`)`||``}`.trim(),r);for(let e=0;e<this.channels.length;e++){let o=this.channels[e];o.isMember(t,n,r,a)&&o.trigger(n,r,i,a)}this.triggerStateCallbacks(`message`,e)})}triggerStateCallbacks(e,...t){try{this.stateChangeCallbacks[e].forEach(([n,r])=>{try{r(...t)}catch(t){this.log(`error`,`error in ${e} callback`,t)}})}catch(t){this.log(`error`,`error triggering ${e} callbacks`,t)}}leaveOpenTopic(e){let t=this.channels.find(t=>t.topic===e&&(t.isJoined()||t.isJoining()));t&&(this.hasLogger()&&this.log(`transport`,`leaving duplicate topic "${e}"`),t.leave())}},Ka=class e{constructor(t,n){let r=Ya(n);this.presence=new Ua(t.getChannel(),r),this.presence.onJoin((n,r,i)=>{let a=e.onJoinPayload(n,r,i);t.getChannel().trigger(`presence`,a)}),this.presence.onLeave((n,r,i)=>{let a=e.onLeavePayload(n,r,i);t.getChannel().trigger(`presence`,a)}),this.presence.onSync(()=>{t.getChannel().trigger(`presence`,{event:`sync`})})}get state(){return e.transformState(this.presence.state)}static transformState(e){return e=Ja(e),Object.getOwnPropertyNames(e).reduce((t,n)=>{let r=e[n];return t[n]=qa(r),t},{})}static onJoinPayload(e,t,n){return{event:`join`,key:e,currentPresences:Xa(t),newPresences:qa(n)}}static onLeavePayload(e,t,n){return{event:`leave`,key:e,currentPresences:Xa(t),leftPresences:qa(n)}}};function qa(e){return e.metas.map(e=>(e.presence_ref=e.phx_ref,delete e.phx_ref,delete e.phx_ref_prev,e))}function Ja(e){return JSON.parse(JSON.stringify(e))}function Ya(e){return e?.events&&{events:e.events}}function Xa(e){return e?.metas?qa(e):[]}var Za;(function(e){e.SYNC=`sync`,e.JOIN=`join`,e.LEAVE=`leave`})(Za||={});var Qa=class{get state(){return this.presenceAdapter.state}constructor(e,t){this.channel=e,this.presenceAdapter=new Ka(this.channel.channelAdapter,t)}};function $a(e){if(e instanceof Error)return e;if(typeof e==`string`)return Error(e);if(e&&typeof e==`object`){let t=e;if(typeof t.code==`number`){let n=typeof t.reason==`string`&&t.reason?` (${t.reason})`:``;return Error(`socket closed: ${t.code}${n}`,{cause:e})}return Error(`channel error: transport failure`,{cause:e})}return Error(`channel error: connection lost`)}var eo=class{constructor(e,t,n){let r=to(n);this.channel=e.getSocket().channel(t,r),this.socket=e}get state(){return this.channel.state}set state(e){this.channel.state=e}get joinedOnce(){return this.channel.joinedOnce}get joinPush(){return this.channel.joinPush}get rejoinTimer(){return this.channel.rejoinTimer}on(e,t){return this.channel.on(e,t)}off(e,t){this.channel.off(e,t)}subscribe(e){return this.channel.join(e)}unsubscribe(e){return this.channel.leave(e)}teardown(){this.channel.teardown()}onClose(e){this.channel.onClose(e)}onError(e){return this.channel.onError(e)}push(e,t,n){let r;try{r=this.channel.push(e,t,n)}catch{throw Error(`tried to push '${e}' to '${this.channel.topic}' before joining. Use channel.subscribe() before pushing events`)}if(this.channel.pushBuffer.length>100){let e=this.channel.pushBuffer.shift();e.cancelTimeout(),this.socket.log(`channel`,`discarded push due to buffer overflow: ${e.event}`,e.payload())}return r}updateJoinPayload(e){let t=this.channel.joinPush.payload();this.channel.joinPush.payload=()=>Object.assign(Object.assign({},t),e)}canPush(){return this.socket.isConnected()&&this.state===ua.joined}isJoined(){return this.state===ua.joined}isJoining(){return this.state===ua.joining}isClosed(){return this.state===ua.closed}isLeaving(){return this.state===ua.leaving}updateFilterBindings(e){this.channel.filterBindings=e}updatePayloadTransform(e){this.channel.onMessage=e}getChannel(){return this.channel}};function to(e){return{config:Object.assign({broadcast:{ack:!1,self:!1},presence:{key:``,enabled:!1},private:!1},e.config)}}var no;(function(e){e.ALL=`*`,e.INSERT=`INSERT`,e.UPDATE=`UPDATE`,e.DELETE=`DELETE`})(no||={});var ro;(function(e){e.BROADCAST=`broadcast`,e.PRESENCE=`presence`,e.POSTGRES_CHANGES=`postgres_changes`,e.SYSTEM=`system`})(ro||={});var io;(function(e){e.SUBSCRIBED=`SUBSCRIBED`,e.TIMED_OUT=`TIMED_OUT`,e.CLOSED=`CLOSED`,e.CHANNEL_ERROR=`CHANNEL_ERROR`})(io||={});var ao=class e{get state(){return this.channelAdapter.state}set state(e){this.channelAdapter.state=e}get joinedOnce(){return this.channelAdapter.joinedOnce}get timeout(){return this.socket.timeout}get joinPush(){return this.channelAdapter.joinPush}get rejoinTimer(){return this.channelAdapter.rejoinTimer}constructor(e,t={config:{}},n){if(this.topic=e,this.params=t,this.socket=n,this.bindings={},this.subTopic=e.replace(/^realtime:/i,``),this.params.config=Object.assign({broadcast:{ack:!1,self:!1},presence:{key:``,enabled:!1},private:!1},t.config),this.channelAdapter=new eo(this.socket.socketAdapter,e,this.params),this.presence=new Qa(this),this._onClose(()=>{this.socket._remove(this)}),this._updateFilterTransform(),this.broadcastEndpointURL=Ca(this.socket.socketAdapter.endPointURL()),this.private=this.params.config.private||!1,!this.private&&this.params.config?.broadcast?.replay)throw Error(`tried to use replay on public channel '${this.topic}'. It must be a private channel.`)}subscribe(e,t=this.timeout){if(this.socket.isConnected()||this.socket.connect(),this.channelAdapter.isClosed()){let{config:{broadcast:n,presence:r,private:i}}=this.params,a=this.bindings.postgres_changes?.map(e=>e.filter)??[],o=!!this.bindings[ro.PRESENCE]&&this.bindings[ro.PRESENCE].length>0||this.params.config.presence?.enabled===!0,s={},c={broadcast:n,presence:Object.assign(Object.assign({},r),{enabled:o}),postgres_changes:a,private:i};this.socket.accessTokenValue&&(s.access_token=this.socket.accessTokenValue),this._onError(t=>{e?.(io.CHANNEL_ERROR,$a(t))}),this._onClose(()=>e?.(io.CLOSED)),this.updateJoinPayload(Object.assign({config:c},s)),this._updateFilterMessage(),this.channelAdapter.subscribe(t).receive(`ok`,async({postgres_changes:t})=>{if(this.socket._isManualToken()||this.socket.setAuth(),t===void 0){e?.(io.SUBSCRIBED);return}this._updatePostgresBindings(t,e)}).receive(`error`,t=>{this.state=ua.errored;let n=Object.values(t).join(`, `)||`error`;e?.(io.CHANNEL_ERROR,Error(n,{cause:t}))}).receive(`timeout`,()=>{e?.(io.TIMED_OUT)})}return this}_updatePostgresBindings(t,n){let r=this.bindings.postgres_changes,i=r?.length??0,a=[];for(let o=0;o<i;o++){let i=r[o],{filter:{event:s,schema:c,table:l,filter:u}}=i,d=t&&t[o];if(d&&d.event===s&&e.isFilterValueEqual(d.schema,c)&&e.isFilterValueEqual(d.table,l)&&e.isFilterValueEqual(d.filter,u))a.push(Object.assign(Object.assign({},i),{id:d.id}));else{this.unsubscribe(),this.state=ua.errored,n?.(io.CHANNEL_ERROR,Error(`mismatch between server and client bindings for postgres changes`));return}}this.bindings.postgres_changes=a,this.state!=ua.errored&&n&&n(io.SUBSCRIBED)}presenceState(){return this.presence.state}async track(e,t={}){return await this.send({type:`presence`,event:`track`,payload:e},t.timeout||this.timeout)}async untrack(e={}){return await this.send({type:`presence`,event:`untrack`},e)}on(e,t,n){let r=this.channelAdapter.isJoined()||this.channelAdapter.isJoining(),i=e===ro.PRESENCE||e===ro.POSTGRES_CHANGES;if(r&&i)throw this.socket.log(`channel`,`cannot add \`${e}\` callbacks for ${this.topic} after \`subscribe()\`.`),Error(`cannot add \`${e}\` callbacks for ${this.topic} after \`subscribe()\`.`);return this._on(e,t,n)}async httpSend(e,t,n={}){if(t==null)return Promise.reject(Error(`Payload is required for httpSend()`));let r=t instanceof ArrayBuffer||ArrayBuffer.isView(t),i={apikey:this.socket.apiKey?this.socket.apiKey:``,"Content-Type":r?`application/octet-stream`:`application/json`};this.socket.accessTokenValue&&(i.Authorization=`Bearer ${this.socket.accessTokenValue}`);let a=new URL(this.broadcastEndpointURL);a.pathname+=`/${encodeURIComponent(this.subTopic)}/events/${encodeURIComponent(e)}`,this.private&&a.searchParams.set(`private`,`true`);let o={method:`POST`,headers:i,body:r?t:JSON.stringify(t)},s=await this._fetchWithTimeout(a.toString(),o,n.timeout??this.timeout);if(s.status===202)return{success:!0};if(s.status===404)return Promise.reject(Error(`httpSend() requires Realtime server v2.97.0 or newer; the endpoint returned 404. Update your Supabase CLI to a recent version, or upgrade the Realtime server in your self-hosted setup. See https://github.com/supabase/supabase-js/blob/master/packages/core/realtime-js/migrations/httpsend-server-version.md`));let c=s.statusText;try{let e=await s.json();c=e.error||e.message||c}catch{}return Promise.reject(Error(c))}async send(e,t={}){if(!this.channelAdapter.canPush()&&e.type===`broadcast`){console.warn(`Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.`);let{event:n,payload:r}=e,i={apikey:this.socket.apiKey?this.socket.apiKey:``,"Content-Type":`application/json`};this.socket.accessTokenValue&&(i.Authorization=`Bearer ${this.socket.accessTokenValue}`);let a={method:`POST`,headers:i,body:JSON.stringify({messages:[{topic:this.subTopic,event:n,payload:r,private:this.private}]})};try{let e=await this._fetchWithTimeout(this.broadcastEndpointURL,a,t.timeout??this.timeout);return await e.body?.cancel(),e.ok?`ok`:`error`}catch(e){return e instanceof Error&&e.name===`AbortError`?`timed out`:`error`}}else return new Promise(n=>{let r=this.channelAdapter.push(e.type,e,t.timeout||this.timeout);e.type===`broadcast`&&!this.params?.config?.broadcast?.ack&&n(`ok`),r.receive(`ok`,()=>n(`ok`)),r.receive(`error`,()=>n(`error`)),r.receive(`timeout`,()=>n(`timed out`))})}updateJoinPayload(e){this.channelAdapter.updateJoinPayload(e)}async unsubscribe(e=this.timeout){return new Promise(t=>{this.channelAdapter.unsubscribe(e).receive(`ok`,()=>t(`ok`)).receive(`timeout`,()=>t(`timed out`)).receive(`error`,()=>t(`error`))})}teardown(){this.channelAdapter.teardown()}async _fetchWithTimeout(e,t,n){let r=new AbortController,i=setTimeout(()=>r.abort(),n),a=await this.socket.fetch(e,Object.assign(Object.assign({},t),{signal:r.signal}));return clearTimeout(i),a}_on(e,t,n){let r=e.toLocaleLowerCase(),i={type:r,filter:t,callback:n,ref:this.channelAdapter.on(e,n)};return this.bindings[r]?this.bindings[r].push(i):this.bindings[r]=[i],this._updateFilterMessage(),this}_onClose(e){this.channelAdapter.onClose(e)}_onError(e){this.channelAdapter.onError(e)}_updateFilterMessage(){this.channelAdapter.updateFilterBindings((e,t,n)=>{let r=e.event.toLocaleLowerCase();if(this._notThisChannelEvent(r,n))return!1;let i=this.bindings[r]?.find(t=>t.ref===e.ref);if(!i)return!0;if([`broadcast`,`presence`,`postgres_changes`].includes(r))if(`id`in i){let e=i.id,n=i.filter?.event;return e&&t.ids?.includes(e)&&(n===`*`||n?.toLocaleLowerCase()===t.data?.type.toLocaleLowerCase())}else{let e=(i?.filter?.event)?.toLocaleLowerCase();return e===`*`||e===(t?.event)?.toLocaleLowerCase()}else return i.type.toLocaleLowerCase()===r})}_notThisChannelEvent(e,t){let{close:n,error:r,leave:i,join:a}=da;return t&&[n,r,i,a].includes(e)&&t!==this.joinPush.ref}_updateFilterTransform(){this.channelAdapter.updatePayloadTransform((e,t,n)=>{if(typeof t==`object`&&`ids`in t){let e=t.data,{schema:n,table:r,commit_timestamp:i,type:a,errors:o}=e;return Object.assign(Object.assign({},{schema:n,table:r,commit_timestamp:i,eventType:a,new:{},old:{},errors:o}),this._getPayloadRecords(e))}return t})}copyBindings(e){if(this.joinedOnce)throw Error(`cannot copy bindings into joined channel`);for(let t in e.bindings)for(let n of e.bindings[t])this._on(n.type,n.filter,n.callback)}static isFilterValueEqual(e,t){return(e??void 0)===(t??void 0)}_getPayloadRecords(e){let t={new:{},old:{}};return(e.type===`INSERT`||e.type===`UPDATE`)&&(t.new=ma(e.columns,e.record)),(e.type===`UPDATE`||e.type===`DELETE`)&&(t.old=ma(e.columns,e.old_record)),t}},oo=class{constructor(e,t){this.socket=new Ga(e,t)}get timeout(){return this.socket.timeout}get endPoint(){return this.socket.endPoint}get transport(){return this.socket.transport}get heartbeatIntervalMs(){return this.socket.heartbeatIntervalMs}get heartbeatCallback(){return this.socket.heartbeatCallback}set heartbeatCallback(e){this.socket.heartbeatCallback=e}get heartbeatTimer(){return this.socket.heartbeatTimer}get pendingHeartbeatRef(){return this.socket.pendingHeartbeatRef}get reconnectTimer(){return this.socket.reconnectTimer}get vsn(){return this.socket.vsn}get encode(){return this.socket.encode}get decode(){return this.socket.decode}get reconnectAfterMs(){return this.socket.reconnectAfterMs}get sendBuffer(){return this.socket.sendBuffer}get stateChangeCallbacks(){return this.socket.stateChangeCallbacks}connect(){this.socket.connect()}disconnect(e,t,n,r=1e4){return new Promise(i=>{setTimeout(()=>i(`timeout`),r),this.socket.disconnect(()=>{e(),i(`ok`)},t,n)})}push(e){this.socket.push(e)}log(e,t,n){this.socket.log(e,t,n)}makeRef(){return this.socket.makeRef()}onOpen(e){this.socket.onOpen(e)}onClose(e){this.socket.onClose(e)}onError(e){this.socket.onError(e)}onMessage(e){this.socket.onMessage(e)}isConnected(){return this.socket.isConnected()}isConnecting(){return this.socket.connectionState()==fa.connecting}isDisconnecting(){return this.socket.connectionState()==fa.closing}connectionState(){return this.socket.connectionState()}endPointURL(){return this.socket.endPointURL()}sendHeartbeat(){this.socket.sendHeartbeat()}getSocket(){return this.socket}},so={HEARTBEAT_INTERVAL:25e3,RECONNECT_DELAY:10,HEARTBEAT_TIMEOUT_FALLBACK:100},co=[1e3,2e3,5e3,1e4],lo=1e4;function uo(){let e=new Map;return{get length(){return e.size},clear(){e.clear()},getItem(t){return e.has(t)?e.get(t):null},key(t){return Array.from(e.keys())[t]??null},removeItem(t){e.delete(t)},setItem(t,n){e.set(t,String(n))}}}function fo(){try{if(typeof globalThis<`u`&&globalThis.sessionStorage)return globalThis.sessionStorage}catch{}return uo()}var po=`
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`,mo=class{get endPoint(){return this.socketAdapter.endPoint}get timeout(){return this.socketAdapter.timeout}get transport(){return this.socketAdapter.transport}get heartbeatCallback(){return this.socketAdapter.heartbeatCallback}get heartbeatIntervalMs(){return this.socketAdapter.heartbeatIntervalMs}get heartbeatTimer(){return this.worker?this._workerHeartbeatTimer:this.socketAdapter.heartbeatTimer}get pendingHeartbeatRef(){return this.worker?this._pendingWorkerHeartbeatRef:this.socketAdapter.pendingHeartbeatRef}get reconnectTimer(){return this.socketAdapter.reconnectTimer}get vsn(){return this.socketAdapter.vsn}get encode(){return this.socketAdapter.encode}get decode(){return this.socketAdapter.decode}get reconnectAfterMs(){return this.socketAdapter.reconnectAfterMs}get sendBuffer(){return this.socketAdapter.sendBuffer}get stateChangeCallbacks(){return this.socketAdapter.stateChangeCallbacks}constructor(e,t){if(this.channels=[],this.accessTokenValue=null,this.accessToken=null,this.apiKey=null,this.httpEndpoint=``,this.headers={},this.params={},this.ref=0,this.serializer=new pa,this._manuallySetToken=!1,this._authPromise=null,this._workerHeartbeatTimer=void 0,this._pendingWorkerHeartbeatRef=null,this._pendingDisconnectTimer=null,this._disconnectOnEmptyChannelsAfterMs=0,this._resolveFetch=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),!t?.params?.apikey)throw Error(`API key is required to connect to Realtime`);this.apiKey=t.params.apikey;let n=this._initializeOptions(t);this.socketAdapter=new oo(e,n),this.httpEndpoint=Ca(e),this.fetch=this._resolveFetch(t?.fetch)}connect(){if(!(this.isConnecting()||this.isDisconnecting()||this.isConnected())){this.accessToken&&!this._authPromise&&this._setAuthSafely(`connect`),this._setupConnectionHandlers();try{this.socketAdapter.connect()}catch(e){let t=e.message;throw t.includes(`Node.js`)?Error(`${t}\n\nTo use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`):Error(`WebSocket not available: ${t}`)}this._handleNodeJsRaceCondition()}}endpointURL(){return this.socketAdapter.endPointURL()}async disconnect(e,t){return this._cancelPendingDisconnect(),this.isDisconnecting()?`ok`:await this.socketAdapter.disconnect(()=>{clearInterval(this._workerHeartbeatTimer),this._terminateWorker()},e,t)}getChannels(){return this.channels}async removeChannel(e){let t=await e.unsubscribe();return t===`ok`&&e.teardown(),t}async removeAllChannels(){let e=this.channels.map(async e=>{let t=await e.unsubscribe();return e.teardown(),t}),t=await Promise.all(e);return await this.disconnect(),t}log(e,t,n){this.socketAdapter.log(e,t,n)}connectionState(){return this.socketAdapter.connectionState()||fa.closed}isConnected(){return this.socketAdapter.isConnected()}isConnecting(){return this.socketAdapter.isConnecting()}isDisconnecting(){return this.socketAdapter.isDisconnecting()}channel(e,t={config:{}}){let n=`realtime:${e}`,r=this.getChannels().find(e=>e.topic===n);if(r)return r;{let n=new ao(`realtime:${e}`,t,this);return this._cancelPendingDisconnect(),this.channels.push(n),n}}push(e){this.socketAdapter.push(e)}async setAuth(e=null){this._authPromise=this._performAuth(e);try{await this._authPromise}finally{this._authPromise=null}}_isManualToken(){return this._manuallySetToken}async sendHeartbeat(){this.socketAdapter.sendHeartbeat()}onHeartbeat(e){this.socketAdapter.heartbeatCallback=this._wrapHeartbeatCallback(e)}_makeRef(){return this.socketAdapter.makeRef()}_remove(e){this.channels=this.channels.filter(t=>t.topic!==e.topic),this.channels.length===0&&(this.log(`transport`,`no channels remaining, scheduling disconnect`),this._schedulePendingDisconnect())}_schedulePendingDisconnect(){if(this._cancelPendingDisconnect(),this._disconnectOnEmptyChannelsAfterMs===0){this.log(`transport`,`disconnecting immediately - no channels`),this.disconnect();return}this._pendingDisconnectTimer=setTimeout(()=>{this._pendingDisconnectTimer=null,this.channels.length===0&&(this.log(`transport`,`deferred disconnect fired - no channels, disconnecting`),this.disconnect())},this._disconnectOnEmptyChannelsAfterMs),this.log(`transport`,`deferred disconnect scheduled in ${this._disconnectOnEmptyChannelsAfterMs}ms`)}_cancelPendingDisconnect(){this._pendingDisconnectTimer!==null&&(this.log(`transport`,`pending disconnect cancelled - channel activity detected`),clearTimeout(this._pendingDisconnectTimer),this._pendingDisconnectTimer=null)}async _performAuth(e=null){let t,n=!1;if(e)t=e,n=!0;else if(this.accessToken)try{t=await this.accessToken()}catch(e){this.log(`error`,`Error fetching access token from callback`,e),t=this.accessTokenValue}else t=this.accessTokenValue;n?this._manuallySetToken=!0:this.accessToken&&(this._manuallySetToken=!1),this.accessTokenValue!=t&&(this.accessTokenValue=t,this.channels.forEach(e=>{let n={access_token:t,version:aa};t&&e.updateJoinPayload(n),e.joinedOnce&&e.channelAdapter.isJoined()&&e.channelAdapter.push(da.access_token,{access_token:t})}))}async _waitForAuthIfNeeded(){this._authPromise&&await this._authPromise}_setAuthSafely(e=`general`){this._isManualToken()||this.setAuth().catch(t=>{this.log(`error`,`Error setting auth in ${e}`,t)})}_setupConnectionHandlers(){this.socketAdapter.onOpen(()=>{(this._authPromise||(this.accessToken&&!this.accessTokenValue?this.setAuth():Promise.resolve())).catch(e=>{this.log(`error`,`error waiting for auth on connect`,e)}),this.worker&&!this.workerRef&&this._startWorkerHeartbeat()}),this.socketAdapter.onClose(()=>{this.worker&&this.workerRef&&this._terminateWorker()}),this.socketAdapter.onMessage(e=>{e.ref&&e.ref===this._pendingWorkerHeartbeatRef&&(this._pendingWorkerHeartbeatRef=null)})}_handleNodeJsRaceCondition(){this.socketAdapter.isConnected()&&this.socketAdapter.getSocket().onConnOpen()}_wrapHeartbeatCallback(e){return(t,n)=>{t==`sent`&&this._setAuthSafely(),e&&e(t,n)}}_startWorkerHeartbeat(){this.workerUrl?this.log(`worker`,`starting worker for from ${this.workerUrl}`):this.log(`worker`,`starting default worker`);let e=this._workerObjectUrl(this.workerUrl);this.workerRef=new Worker(e),this.workerRef.onerror=e=>{this.log(`worker`,`worker error`,e.message),this._terminateWorker(),this.disconnect()},this.workerRef.onmessage=e=>{e.data.event===`keepAlive`&&this.sendHeartbeat()},this.workerRef.postMessage({event:`start`,interval:this.heartbeatIntervalMs})}_terminateWorker(){this.workerRef&&=(this.log(`worker`,`terminating worker`),this.workerRef.terminate(),void 0)}_workerObjectUrl(e){let t;if(e)t=e;else{let e=new Blob([po],{type:`application/javascript`});t=URL.createObjectURL(e)}return t}_initializeOptions(e){this.worker=e?.worker??!1,this.accessToken=e?.accessToken??null;let t={};t.timeout=e?.timeout??la,t.heartbeatIntervalMs=e?.heartbeatIntervalMs??so.HEARTBEAT_INTERVAL,this._disconnectOnEmptyChannelsAfterMs=e?.disconnectOnEmptyChannelsAfterMs??2*(e?.heartbeatIntervalMs??so.HEARTBEAT_INTERVAL),t.transport=e?.transport??ia.getWebSocketConstructor(),t.params=e?.params,t.logger=e?.logger,t.heartbeatCallback=this._wrapHeartbeatCallback(e?.heartbeatCallback),t.sessionStorage=e?.sessionStorage??fo(),t.reconnectAfterMs=e?.reconnectAfterMs??(e=>co[e-1]||lo);let n,r,i=e?.vsn??ca;switch(i){case oa:n=(e,t)=>t(JSON.stringify(e)),r=(e,t)=>t(JSON.parse(e));break;case sa:n=this.serializer.encode.bind(this.serializer),r=this.serializer.decode.bind(this.serializer);break;default:throw Error(`Unsupported serializer version: ${t.vsn}`)}if(t.vsn=i,t.encode=e?.encode??n,t.decode=e?.decode??r,t.beforeReconnect=this._reconnectAuth.bind(this),(e?.logLevel||e?.log_level)&&(this.logLevel=e.logLevel||e.log_level,t.params=Object.assign(Object.assign({},t.params),{log_level:this.logLevel})),this.worker){if(typeof window<`u`&&!window.Worker)throw Error(`Web Worker is not supported`);this.workerUrl=e?.workerUrl,t.autoSendHeartbeat=!this.worker}return t}async _reconnectAuth(){await this._waitForAuthIfNeeded(),this.isConnected()||this.connect()}},ho=class extends Error{constructor(e,t){super(e),this.name=`IcebergError`,this.status=t.status,this.icebergType=t.icebergType,this.icebergCode=t.icebergCode,this.details=t.details,this.isCommitStateUnknown=t.icebergType===`CommitStateUnknownException`||[500,502,504].includes(t.status)&&t.icebergType?.includes(`CommitState`)===!0}isNotFound(){return this.status===404}isConflict(){return this.status===409}isAuthenticationTimeout(){return this.status===419}};function go(e,t,n){let r=new URL(t,e);if(n)for(let[e,t]of Object.entries(n))t!==void 0&&r.searchParams.set(e,t);return r.toString()}async function L(e){return!e||e.type===`none`?{}:e.type===`bearer`?{Authorization:`Bearer ${e.token}`}:e.type===`header`?{[e.name]:e.value}:e.type===`custom`?await e.getHeaders():{}}function _o(e){let t=e.fetchImpl??globalThis.fetch;return{async request({method:n,path:r,query:i,body:a,headers:o}){let s=go(e.baseUrl,r,i),c=await L(e.auth),l=await t(s,{method:n,headers:{...a?{"Content-Type":`application/json`}:{},...c,...o},body:a?JSON.stringify(a):void 0}),u=await l.text(),d=(l.headers.get(`content-type`)||``).includes(`application/json`),f=d&&u?JSON.parse(u):u;if(!l.ok){let e=d?f:void 0,t=e?.error;throw new ho(t?.message??`Request failed with status ${l.status}`,{status:l.status,icebergType:t?.type,icebergCode:t?.code,details:e})}return{status:l.status,headers:l.headers,data:f}}}}function vo(e){return e.join(``)}var yo=class{constructor(e,t=``){this.client=e,this.prefix=t}async listNamespaces(e){let t=e?{parent:vo(e.namespace)}:void 0;return(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces`,query:t})).data.namespaces.map(e=>({namespace:e}))}async createNamespace(e,t){let n={namespace:e.namespace,properties:t?.properties};return(await this.client.request({method:`POST`,path:`${this.prefix}/namespaces`,body:n})).data}async dropNamespace(e){await this.client.request({method:`DELETE`,path:`${this.prefix}/namespaces/${vo(e.namespace)}`})}async loadNamespaceMetadata(e){return{properties:(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces/${vo(e.namespace)}`})).data.properties}}async namespaceExists(e){try{return await this.client.request({method:`HEAD`,path:`${this.prefix}/namespaces/${vo(e.namespace)}`}),!0}catch(e){if(e instanceof ho&&e.status===404)return!1;throw e}}async createNamespaceIfNotExists(e,t){try{return await this.createNamespace(e,t)}catch(e){if(e instanceof ho&&e.status===409)return;throw e}}};function bo(e){return e.join(``)}var xo=class{constructor(e,t=``,n){this.client=e,this.prefix=t,this.accessDelegation=n}async listTables(e){return(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces/${bo(e.namespace)}/tables`})).data.identifiers}async createTable(e,t){let n={};return this.accessDelegation&&(n[`X-Iceberg-Access-Delegation`]=this.accessDelegation),(await this.client.request({method:`POST`,path:`${this.prefix}/namespaces/${bo(e.namespace)}/tables`,body:t,headers:n})).data.metadata}async updateTable(e,t){let n=await this.client.request({method:`POST`,path:`${this.prefix}/namespaces/${bo(e.namespace)}/tables/${e.name}`,body:t});return{"metadata-location":n.data[`metadata-location`],metadata:n.data.metadata}}async dropTable(e,t){await this.client.request({method:`DELETE`,path:`${this.prefix}/namespaces/${bo(e.namespace)}/tables/${e.name}`,query:{purgeRequested:String(t?.purge??!1)}})}async loadTable(e){let t={};return this.accessDelegation&&(t[`X-Iceberg-Access-Delegation`]=this.accessDelegation),(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces/${bo(e.namespace)}/tables/${e.name}`,headers:t})).data.metadata}async tableExists(e){let t={};this.accessDelegation&&(t[`X-Iceberg-Access-Delegation`]=this.accessDelegation);try{return await this.client.request({method:`HEAD`,path:`${this.prefix}/namespaces/${bo(e.namespace)}/tables/${e.name}`,headers:t}),!0}catch(e){if(e instanceof ho&&e.status===404)return!1;throw e}}async createTableIfNotExists(e,t){try{return await this.createTable(e,t)}catch(n){if(n instanceof ho&&n.status===409)return await this.loadTable({namespace:e.namespace,name:t.name});throw n}}},So=class{constructor(e){let t=`v1`;e.catalogName&&(t+=`/${e.catalogName}`);let n=e.baseUrl.endsWith(`/`)?e.baseUrl:`${e.baseUrl}/`;this.client=_o({baseUrl:n,auth:e.auth,fetchImpl:e.fetch}),this.accessDelegation=e.accessDelegation?.join(`,`),this.namespaceOps=new yo(this.client,t),this.tableOps=new xo(this.client,t,this.accessDelegation)}async listNamespaces(e){return this.namespaceOps.listNamespaces(e)}async createNamespace(e,t){return this.namespaceOps.createNamespace(e,t)}async dropNamespace(e){await this.namespaceOps.dropNamespace(e)}async loadNamespaceMetadata(e){return this.namespaceOps.loadNamespaceMetadata(e)}async listTables(e){return this.tableOps.listTables(e)}async createTable(e,t){return this.tableOps.createTable(e,t)}async updateTable(e,t){return this.tableOps.updateTable(e,t)}async dropTable(e,t){await this.tableOps.dropTable(e,t)}async loadTable(e){return this.tableOps.loadTable(e)}async namespaceExists(e){return this.namespaceOps.namespaceExists(e)}async tableExists(e){return this.tableOps.tableExists(e)}async createNamespaceIfNotExists(e,t){return this.namespaceOps.createNamespaceIfNotExists(e,t)}async createTableIfNotExists(e,t){return this.tableOps.createTableIfNotExists(e,t)}};function Co(e){"@babel/helpers - typeof";return Co=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},Co(e)}function wo(e,t){if(Co(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(Co(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function To(e){var t=wo(e,`string`);return Co(t)==`symbol`?t:t+``}function Eo(e,t,n){return(t=To(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Do(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function R(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?Do(Object(n),!0).forEach(function(t){Eo(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Do(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var Oo=class extends Error{constructor(e,t=`storage`,n,r){super(e),this.__isStorageError=!0,this.namespace=t,this.name=t===`vectors`?`StorageVectorsError`:`StorageError`,this.status=n,this.statusCode=r}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}};function ko(e){return typeof e==`object`&&!!e&&`__isStorageError`in e}var Ao=class extends Oo{constructor(e,t,n,r=`storage`){super(e,r,t,n),this.name=r===`vectors`?`StorageVectorsApiError`:`StorageApiError`,this.status=t,this.statusCode=n}toJSON(){return R({},super.toJSON())}},jo=class extends Oo{constructor(e,t,n=`storage`){super(e,n),this.name=n===`vectors`?`StorageVectorsUnknownError`:`StorageUnknownError`,this.originalError=t}};function Mo(e,t,n){let r=R({},e),i=t.toLowerCase();for(let e of Object.keys(r))e.toLowerCase()===i&&delete r[e];return r[i]=n,r}function No(e){let t={};for(let[n,r]of Object.entries(e))t[n.toLowerCase()]=r;return t}var Po=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),Fo=e=>{if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)},Io=e=>{if(Array.isArray(e))return e.map(e=>Io(e));if(typeof e==`function`||e!==Object(e))return e;let t={};return Object.entries(e).forEach(([e,n])=>{let r=e.replace(/([-_][a-z])/gi,e=>e.toUpperCase().replace(/[-_]/g,``));t[r]=Io(n)}),t},Lo=e=>!e||typeof e!=`string`||e.length===0||e.length>100||e.trim()!==e||e.includes(`/`)||e.includes(`\\`)?!1:/^[\w!.\*'() &$@=;:+,?-]+$/.test(e),Ro=e=>{if(typeof e==`object`&&e){let t=e;if(typeof t.msg==`string`)return t.msg;if(typeof t.message==`string`)return t.message;if(typeof t.error_description==`string`)return t.error_description;if(typeof t.error==`string`)return t.error;if(typeof t.error==`object`&&t.error!==null){let e=t.error;if(typeof e.message==`string`)return e.message}}return JSON.stringify(e)},zo=async(e,t,n,r)=>{if(typeof e==`object`&&e&&`json`in e&&typeof e.json==`function`){let n=e,i=parseInt(String(n.status),10);Number.isFinite(i)||(i=500),n.json().then(e=>{let n=e?.statusCode||e?.code||i+``;t(new Ao(Ro(e),i,n,r))}).catch(()=>{let e=i+``;t(new Ao(n.statusText||`HTTP ${i} error`,i,e,r))})}else t(new jo(Ro(e),e,r))},Bo=(e,t,n,r)=>{let i={method:e,headers:t?.headers||{}};if(e===`GET`||e===`HEAD`||!r)return R(R({},i),n);if(Fo(r)){let e=t?.headers||{},n;for(let[t,r]of Object.entries(e))t.toLowerCase()===`content-type`&&(n=r);i.headers=Mo(e,`Content-Type`,n??`application/json`),i.body=JSON.stringify(r)}else i.body=r;return t?.duplex&&(i.duplex=t.duplex),R(R({},i),n)};async function Vo(e,t,n,r,i,a,o){return new Promise((s,c)=>{e(n,Bo(t,r,i,a)).then(e=>{if(!e.ok)throw e;if(r?.noResolveJson)return e;if(o===`vectors`){let t=e.headers.get(`content-type`);if(e.headers.get(`content-length`)===`0`||e.status===204||!t||!t.includes(`application/json`))return{}}return e.json()}).then(e=>s(e)).catch(e=>zo(e,c,r,o))})}function Ho(e=`storage`){return{get:async(t,n,r,i)=>Vo(t,`GET`,n,r,i,void 0,e),post:async(t,n,r,i,a)=>Vo(t,`POST`,n,i,a,r,e),put:async(t,n,r,i,a)=>Vo(t,`PUT`,n,i,a,r,e),head:async(t,n,r,i)=>Vo(t,`HEAD`,n,R(R({},r),{},{noResolveJson:!0}),i,void 0,e),remove:async(t,n,r,i,a)=>Vo(t,`DELETE`,n,i,a,r,e)}}var{get:Uo,post:Wo,put:Go,head:Ko,remove:qo}=Ho(`storage`),Jo=Ho(`vectors`),Yo=class{constructor(e,t={},n,r=`storage`){this.shouldThrowOnError=!1,this.url=e,this.headers=No(t),this.fetch=Po(n),this.namespace=r}throwOnError(){return this.shouldThrowOnError=!0,this}setHeader(e,t){return this.headers=Mo(this.headers,e,t),this}async handleOperation(e){var t=this;try{return{data:await e(),error:null}}catch(e){if(t.shouldThrowOnError)throw e;if(ko(e))return{data:null,error:e};throw e}}},Xo=Symbol.toStringTag,Zo=class{constructor(e,t){this.downloadFn=e,this.shouldThrowOnError=t,this[Xo]=`StreamDownloadBuilder`,this.promise=null}then(e,t){return this.getPromise().then(e,t)}catch(e){return this.getPromise().catch(e)}finally(e){return this.getPromise().finally(e)}getPromise(){return this.promise||=this.execute(),this.promise}async execute(){var e=this;try{return{data:(await e.downloadFn()).body,error:null}}catch(t){if(e.shouldThrowOnError)throw t;if(ko(t))return{data:null,error:t};throw t}}},Qo=Symbol.toStringTag,$o=class{constructor(e,t){this.downloadFn=e,this.shouldThrowOnError=t,this[Qo]=`BlobDownloadBuilder`,this.promise=null}asStream(){return new Zo(this.downloadFn,this.shouldThrowOnError)}then(e,t){return this.getPromise().then(e,t)}catch(e){return this.getPromise().catch(e)}finally(e){return this.getPromise().finally(e)}getPromise(){return this.promise||=this.execute(),this.promise}async execute(){var e=this;try{return{data:await(await e.downloadFn()).blob(),error:null}}catch(t){if(e.shouldThrowOnError)throw t;if(ko(t))return{data:null,error:t};throw t}}},es={limit:100,offset:0,sortBy:{column:`name`,order:`asc`}},ts={cacheControl:`3600`,contentType:`text/plain;charset=UTF-8`,upsert:!1},ns=class extends Yo{constructor(e,t={},n,r){super(e,t,r,`storage`),this.bucketId=n}async uploadOrUpdate(e,t,n,r){var i=this;return i.handleOperation(async()=>{let a,o=R(R({},ts),r),s=R(R({},i.headers),e===`POST`&&{"x-upsert":String(o.upsert)}),c=o.metadata;if(typeof Blob<`u`&&n instanceof Blob?(a=new FormData,a.append(`cacheControl`,o.cacheControl),c&&a.append(`metadata`,i.encodeMetadata(c)),a.append(``,n)):typeof FormData<`u`&&n instanceof FormData?(a=n,a.has(`cacheControl`)||a.append(`cacheControl`,o.cacheControl),c&&!a.has(`metadata`)&&a.append(`metadata`,i.encodeMetadata(c))):(a=n,s[`cache-control`]=`max-age=${o.cacheControl}`,s[`content-type`]=o.contentType,c&&(s[`x-metadata`]=i.toBase64(i.encodeMetadata(c))),(typeof ReadableStream<`u`&&a instanceof ReadableStream||a&&typeof a==`object`&&`pipe`in a&&typeof a.pipe==`function`)&&!o.duplex&&(o.duplex=`half`)),r?.headers)for(let[e,t]of Object.entries(r.headers))s=Mo(s,e,t);let l=i._removeEmptyFolders(t),u=i._getFinalPath(l),d=await(e==`PUT`?Go:Wo)(i.fetch,`${i.url}/object/${u}`,a,R({headers:s},o?.duplex?{duplex:o.duplex}:{}));return{path:l,id:d.Id,fullPath:d.Key}})}async upload(e,t,n){return this.uploadOrUpdate(`POST`,e,t,n)}async uploadToSignedUrl(e,t,n,r){var i=this;let a=i._removeEmptyFolders(e),o=i._getFinalPath(a),s=new URL(i.url+`/object/upload/sign/${o}`);return s.searchParams.set(`token`,t),i.handleOperation(async()=>{let e,t=R(R({},ts),r),o=R(R({},i.headers),{"x-upsert":String(t.upsert)}),c=t.metadata;if(typeof Blob<`u`&&n instanceof Blob?(e=new FormData,e.append(`cacheControl`,t.cacheControl),c&&e.append(`metadata`,i.encodeMetadata(c)),e.append(``,n)):typeof FormData<`u`&&n instanceof FormData?(e=n,e.has(`cacheControl`)||e.append(`cacheControl`,t.cacheControl),c&&!e.has(`metadata`)&&e.append(`metadata`,i.encodeMetadata(c))):(e=n,o[`cache-control`]=`max-age=${t.cacheControl}`,o[`content-type`]=t.contentType,c&&(o[`x-metadata`]=i.toBase64(i.encodeMetadata(c))),(typeof ReadableStream<`u`&&e instanceof ReadableStream||e&&typeof e==`object`&&`pipe`in e&&typeof e.pipe==`function`)&&!t.duplex&&(t.duplex=`half`)),r?.headers)for(let[e,t]of Object.entries(r.headers))o=Mo(o,e,t);return{path:a,fullPath:(await Go(i.fetch,s.toString(),e,R({headers:o},t?.duplex?{duplex:t.duplex}:{}))).Key}})}async createSignedUploadUrl(e,t){var n=this;return n.handleOperation(async()=>{let r=n._getFinalPath(e),i=R({},n.headers);t?.upsert&&(i[`x-upsert`]=`true`);let a=await Wo(n.fetch,`${n.url}/object/upload/sign/${r}`,{},{headers:i}),o=new URL(n.url+a.url),s=o.searchParams.get(`token`);if(!s)throw new Oo(`No token returned by API`);return{signedUrl:o.toString(),path:e,token:s}})}async update(e,t,n){return this.uploadOrUpdate(`PUT`,e,t,n)}async move(e,t,n){var r=this;return r.handleOperation(async()=>await Wo(r.fetch,`${r.url}/object/move`,{bucketId:r.bucketId,sourceKey:e,destinationKey:t,destinationBucket:n?.destinationBucket},{headers:r.headers}))}async copy(e,t,n){var r=this;return r.handleOperation(async()=>({path:(await Wo(r.fetch,`${r.url}/object/copy`,{bucketId:r.bucketId,sourceKey:e,destinationKey:t,destinationBucket:n?.destinationBucket},{headers:r.headers})).Key}))}async createSignedUrl(e,t,n){var r=this;return r.handleOperation(async()=>{let i=r._getFinalPath(e),a=typeof n?.transform==`object`&&n.transform!==null&&Object.keys(n.transform).length>0,o=await Wo(r.fetch,`${r.url}/object/sign/${i}`,R({expiresIn:t},a?{transform:n.transform}:{}),{headers:r.headers}),s=new URLSearchParams;n?.download&&s.set(`download`,n.download===!0?``:n.download),n?.cacheNonce!=null&&s.set(`cacheNonce`,String(n.cacheNonce));let c=s.toString();return{signedUrl:encodeURI(`${r.url}${o.signedURL}${c?`&${c}`:``}`)}})}async createSignedUrls(e,t,n){var r=this;return r.handleOperation(async()=>{let i=await Wo(r.fetch,`${r.url}/object/sign/${r.bucketId}`,{expiresIn:t,paths:e},{headers:r.headers}),a=new URLSearchParams;n?.download&&a.set(`download`,n.download===!0?``:n.download),n?.cacheNonce!=null&&a.set(`cacheNonce`,String(n.cacheNonce));let o=a.toString();return i.map(e=>R(R({},e),{},{signedUrl:e.signedURL?encodeURI(`${r.url}${e.signedURL}${o?`&${o}`:``}`):null}))})}download(e,t,n){let r=typeof t?.transform==`object`&&t.transform!==null&&Object.keys(t.transform).length>0?`render/image/authenticated`:`object`,i=new URLSearchParams;t?.transform&&this.applyTransformOptsToQuery(i,t.transform),t?.cacheNonce!=null&&i.set(`cacheNonce`,String(t.cacheNonce));let a=i.toString(),o=this._getFinalPath(e);return new $o(()=>Uo(this.fetch,`${this.url}/${r}/${o}${a?`?${a}`:``}`,{headers:this.headers,noResolveJson:!0},n),this.shouldThrowOnError)}async info(e){var t=this;let n=t._getFinalPath(e);return t.handleOperation(async()=>Io(await Uo(t.fetch,`${t.url}/object/info/${n}`,{headers:t.headers})))}async exists(e){var t=this;let n=t._getFinalPath(e);try{return await Ko(t.fetch,`${t.url}/object/${n}`,{headers:t.headers}),{data:!0,error:null}}catch(e){if(t.shouldThrowOnError)throw e;if(ko(e)){let t=e instanceof Ao?e.status:e instanceof jo?e.originalError?.status:void 0;if(t!==void 0&&[400,404].includes(t))return{data:!1,error:e}}throw e}}getPublicUrl(e,t){let n=this._getFinalPath(e),r=new URLSearchParams;t?.download&&r.set(`download`,t.download===!0?``:t.download),t?.transform&&this.applyTransformOptsToQuery(r,t.transform),t?.cacheNonce!=null&&r.set(`cacheNonce`,String(t.cacheNonce));let i=r.toString(),a=typeof t?.transform==`object`&&t.transform!==null&&Object.keys(t.transform).length>0?`render/image`:`object`;return{data:{publicUrl:encodeURI(`${this.url}/${a}/public/${n}`)+(i?`?${i}`:``)}}}async remove(e){var t=this;return t.handleOperation(async()=>await qo(t.fetch,`${t.url}/object/${t.bucketId}`,{prefixes:e},{headers:t.headers}))}async list(e,t,n){var r=this;return r.handleOperation(async()=>{let i=R(R(R({},es),t),{},{prefix:e||``});return await Wo(r.fetch,`${r.url}/object/list/${r.bucketId}`,i,{headers:r.headers},n)})}async listV2(e,t){var n=this;return n.handleOperation(async()=>{let r=R({},e);return await Wo(n.fetch,`${n.url}/object/list-v2/${n.bucketId}`,r,{headers:n.headers},t)})}encodeMetadata(e){return JSON.stringify(e)}toBase64(e){return typeof Buffer<`u`?Buffer.from(e).toString(`base64`):btoa(e)}_getFinalPath(e){return`${this.bucketId}/${e.replace(/^\/+/,``)}`}_removeEmptyFolders(e){return e.replace(/^\/|\/$/g,``).replace(/\/+/g,`/`)}applyTransformOptsToQuery(e,t){return t.width&&e.set(`width`,t.width.toString()),t.height&&e.set(`height`,t.height.toString()),t.resize&&e.set(`resize`,t.resize),t.format&&e.set(`format`,t.format),t.quality&&e.set(`quality`,t.quality.toString()),e}},rs={"X-Client-Info":`storage-js/2.108.2`},is=class extends Yo{constructor(e,t={},n,r){let i=new URL(e);r?.useNewHostname&&/supabase\.(co|in|red)$/.test(i.hostname)&&!i.hostname.includes(`storage.supabase.`)&&(i.hostname=i.hostname.replace(`supabase.`,`storage.supabase.`));let a=i.href.replace(/\/$/,``),o=R(R({},rs),t);super(a,o,n,`storage`)}async listBuckets(e){var t=this;return t.handleOperation(async()=>{let n=t.listBucketOptionsToQueryString(e);return await Uo(t.fetch,`${t.url}/bucket${n}`,{headers:t.headers})})}async getBucket(e){var t=this;return t.handleOperation(async()=>await Uo(t.fetch,`${t.url}/bucket/${e}`,{headers:t.headers}))}async createBucket(e,t={public:!1}){var n=this;return n.handleOperation(async()=>await Wo(n.fetch,`${n.url}/bucket`,{id:e,name:e,type:t.type,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes},{headers:n.headers}))}async updateBucket(e,t){var n=this;return n.handleOperation(async()=>await Go(n.fetch,`${n.url}/bucket/${e}`,{id:e,name:e,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes},{headers:n.headers}))}async emptyBucket(e){var t=this;return t.handleOperation(async()=>await Wo(t.fetch,`${t.url}/bucket/${e}/empty`,{},{headers:t.headers}))}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await qo(t.fetch,`${t.url}/bucket/${e}`,{},{headers:t.headers}))}listBucketOptionsToQueryString(e){let t={};return e&&(`limit`in e&&(t.limit=String(e.limit)),`offset`in e&&(t.offset=String(e.offset)),e.search&&(t.search=e.search),e.sortColumn&&(t.sortColumn=e.sortColumn),e.sortOrder&&(t.sortOrder=e.sortOrder)),Object.keys(t).length>0?`?`+new URLSearchParams(t).toString():``}},as=class extends Yo{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=R(R({},rs),t);super(r,i,n,`storage`)}async createBucket(e){var t=this;return t.handleOperation(async()=>await Wo(t.fetch,`${t.url}/bucket`,{name:e},{headers:t.headers}))}async listBuckets(e){var t=this;return t.handleOperation(async()=>{let n=new URLSearchParams;e?.limit!==void 0&&n.set(`limit`,e.limit.toString()),e?.offset!==void 0&&n.set(`offset`,e.offset.toString()),e?.sortColumn&&n.set(`sortColumn`,e.sortColumn),e?.sortOrder&&n.set(`sortOrder`,e.sortOrder),e?.search&&n.set(`search`,e.search);let r=n.toString(),i=r?`${t.url}/bucket?${r}`:`${t.url}/bucket`;return await Uo(t.fetch,i,{headers:t.headers})})}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await qo(t.fetch,`${t.url}/bucket/${e}`,{},{headers:t.headers}))}from(e){var t=this;if(!Lo(e))throw new Oo(`Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.`);let n=new So({baseUrl:this.url,catalogName:e,auth:{type:`custom`,getHeaders:async()=>t.headers},fetch:this.fetch}),r=this.shouldThrowOnError;return new Proxy(n,{get(e,t){let n=e[t];return typeof n==`function`?async(...t)=>{try{return{data:await n.apply(e,t),error:null}}catch(e){if(r)throw e;return{data:null,error:e}}}:n}})}},os=class extends Yo{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=R(R({},rs),{},{"Content-Type":`application/json`},t);super(r,i,n,`vectors`)}async createIndex(e){var t=this;return t.handleOperation(async()=>await Jo.post(t.fetch,`${t.url}/CreateIndex`,e,{headers:t.headers})||{})}async getIndex(e,t){var n=this;return n.handleOperation(async()=>await Jo.post(n.fetch,`${n.url}/GetIndex`,{vectorBucketName:e,indexName:t},{headers:n.headers}))}async listIndexes(e){var t=this;return t.handleOperation(async()=>await Jo.post(t.fetch,`${t.url}/ListIndexes`,e,{headers:t.headers}))}async deleteIndex(e,t){var n=this;return n.handleOperation(async()=>await Jo.post(n.fetch,`${n.url}/DeleteIndex`,{vectorBucketName:e,indexName:t},{headers:n.headers})||{})}},ss=class extends Yo{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=R(R({},rs),{},{"Content-Type":`application/json`},t);super(r,i,n,`vectors`)}async putVectors(e){var t=this;if(e.vectors.length<1||e.vectors.length>500)throw Error(`Vector batch size must be between 1 and 500 items`);return t.handleOperation(async()=>await Jo.post(t.fetch,`${t.url}/PutVectors`,e,{headers:t.headers})||{})}async getVectors(e){var t=this;return t.handleOperation(async()=>await Jo.post(t.fetch,`${t.url}/GetVectors`,e,{headers:t.headers}))}async listVectors(e){var t=this;if(e.segmentCount!==void 0){if(e.segmentCount<1||e.segmentCount>16)throw Error(`segmentCount must be between 1 and 16`);if(e.segmentIndex!==void 0&&(e.segmentIndex<0||e.segmentIndex>=e.segmentCount))throw Error(`segmentIndex must be between 0 and ${e.segmentCount-1}`)}return t.handleOperation(async()=>await Jo.post(t.fetch,`${t.url}/ListVectors`,e,{headers:t.headers}))}async queryVectors(e){var t=this;return t.handleOperation(async()=>await Jo.post(t.fetch,`${t.url}/QueryVectors`,e,{headers:t.headers}))}async deleteVectors(e){var t=this;if(e.keys.length<1||e.keys.length>500)throw Error(`Keys batch size must be between 1 and 500 items`);return t.handleOperation(async()=>await Jo.post(t.fetch,`${t.url}/DeleteVectors`,e,{headers:t.headers})||{})}},cs=class extends Yo{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=R(R({},rs),{},{"Content-Type":`application/json`},t);super(r,i,n,`vectors`)}async createBucket(e){var t=this;return t.handleOperation(async()=>await Jo.post(t.fetch,`${t.url}/CreateVectorBucket`,{vectorBucketName:e},{headers:t.headers})||{})}async getBucket(e){var t=this;return t.handleOperation(async()=>await Jo.post(t.fetch,`${t.url}/GetVectorBucket`,{vectorBucketName:e},{headers:t.headers}))}async listBuckets(e={}){var t=this;return t.handleOperation(async()=>await Jo.post(t.fetch,`${t.url}/ListVectorBuckets`,e,{headers:t.headers}))}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await Jo.post(t.fetch,`${t.url}/DeleteVectorBucket`,{vectorBucketName:e},{headers:t.headers})||{})}},ls=class extends cs{constructor(e,t={}){super(e,t.headers||{},t.fetch)}from(e){return new us(this.url,this.headers,e,this.fetch)}async createBucket(e){var t=()=>super.createBucket,n=this;return t().call(n,e)}async getBucket(e){var t=()=>super.getBucket,n=this;return t().call(n,e)}async listBuckets(e={}){var t=()=>super.listBuckets,n=this;return t().call(n,e)}async deleteBucket(e){var t=()=>super.deleteBucket,n=this;return t().call(n,e)}},us=class extends os{constructor(e,t,n,r){super(e,t,r),this.vectorBucketName=n}async createIndex(e){var t=()=>super.createIndex,n=this;return t().call(n,R(R({},e),{},{vectorBucketName:n.vectorBucketName}))}async listIndexes(e={}){var t=()=>super.listIndexes,n=this;return t().call(n,R(R({},e),{},{vectorBucketName:n.vectorBucketName}))}async getIndex(e){var t=()=>super.getIndex,n=this;return t().call(n,n.vectorBucketName,e)}async deleteIndex(e){var t=()=>super.deleteIndex,n=this;return t().call(n,n.vectorBucketName,e)}index(e){return new ds(this.url,this.headers,this.vectorBucketName,e,this.fetch)}},ds=class extends ss{constructor(e,t,n,r,i){super(e,t,i),this.vectorBucketName=n,this.indexName=r}async putVectors(e){var t=()=>super.putVectors,n=this;return t().call(n,R(R({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async getVectors(e){var t=()=>super.getVectors,n=this;return t().call(n,R(R({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async listVectors(e={}){var t=()=>super.listVectors,n=this;return t().call(n,R(R({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async queryVectors(e){var t=()=>super.queryVectors,n=this;return t().call(n,R(R({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async deleteVectors(e){var t=()=>super.deleteVectors,n=this;return t().call(n,R(R({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}},fs=class extends is{constructor(e,t={},n,r){super(e,t,n,r)}from(e){return new ns(this.url,this.headers,e,this.fetch)}get vectors(){return new ls(this.url+`/vector`,{headers:this.headers,fetch:this.fetch})}get analytics(){return new as(this.url+`/iceberg`,this.headers,this.fetch)}},ps=`2.108.2`,ms=30*1e3,hs=3*ms,gs=2*ms,_s=`http://localhost:9999`,vs=`supabase.auth.token`,ys={"X-Client-Info":`gotrue-js/${ps}`},bs=`X-Supabase-Api-Version`,xs={"2024-01-01":{timestamp:Date.parse(`2024-01-01T00:00:00.0Z`),name:`2024-01-01`}},Ss=/^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i,Cs=class extends Error{constructor(e,t,n){super(e),this.__isAuthError=!0,this.name=`AuthError`,this.status=t,this.code=n}toJSON(){return{name:this.name,message:this.message,status:this.status,code:this.code}}};function z(e){return typeof e==`object`&&!!e&&`__isAuthError`in e}var ws=class extends Cs{constructor(e,t,n){super(e,t,n),this.name=`AuthApiError`,this.status=t,this.code=n}};function Ts(e){return z(e)&&e.name===`AuthApiError`}var Es=class extends Cs{constructor(e,t){super(e),this.name=`AuthUnknownError`,this.originalError=t}},Ds=class extends Cs{constructor(e,t,n,r){super(e,n,r),this.name=t,this.status=n}},Os=class extends Ds{constructor(){super(`Auth session missing!`,`AuthSessionMissingError`,400,void 0)}};function ks(e){return z(e)&&e.name===`AuthSessionMissingError`}var As=class extends Ds{constructor(){super(`Auth session or user missing`,`AuthInvalidTokenResponseError`,500,void 0)}},js=class extends Ds{constructor(e){super(e,`AuthInvalidCredentialsError`,400,void 0)}},Ms=class extends Ds{constructor(e,t=null){super(e,`AuthImplicitGrantRedirectError`,500,void 0),this.details=null,this.details=t}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{details:this.details})}};function Ns(e){return z(e)&&e.name===`AuthImplicitGrantRedirectError`}var Ps=class extends Ds{constructor(e,t=null){super(e,`AuthPKCEGrantCodeExchangeError`,500,void 0),this.details=null,this.details=t}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{details:this.details})}},Fs=class extends Ds{constructor(){super(`PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.`,`AuthPKCECodeVerifierMissingError`,400,`pkce_code_verifier_not_found`)}},Is=class extends Ds{constructor(e,t){super(e,`AuthRetryableFetchError`,t,void 0)}};function Ls(e){return z(e)&&e.name===`AuthRetryableFetchError`}var Rs=class extends Ds{constructor(e=`Refresh result discarded: session state changed mid-flight (e.g., concurrent signOut)`){super(e,`AuthRefreshDiscardedError`,409,void 0)}};function zs(e){return z(e)&&e.name===`AuthRefreshDiscardedError`}var Bs=class extends Ds{constructor(e,t,n){super(e,`AuthWeakPasswordError`,t,`weak_password`),this.reasons=n}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{reasons:this.reasons})}},Vs=class extends Ds{constructor(e){super(e,`AuthInvalidJwtError`,400,`invalid_jwt`)}},Hs=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`.split(``),Us=` 	
\r=`.split(``),Ws=(()=>{let e=Array(128);for(let t=0;t<e.length;t+=1)e[t]=-1;for(let t=0;t<Us.length;t+=1)e[Us[t].charCodeAt(0)]=-2;for(let t=0;t<Hs.length;t+=1)e[Hs[t].charCodeAt(0)]=t;return e})();function Gs(e,t,n){if(e!==null)for(t.queue=t.queue<<8|e,t.queuedBits+=8;t.queuedBits>=6;)n(Hs[t.queue>>t.queuedBits-6&63]),t.queuedBits-=6;else if(t.queuedBits>0)for(t.queue<<=6-t.queuedBits,t.queuedBits=6;t.queuedBits>=6;)n(Hs[t.queue>>t.queuedBits-6&63]),t.queuedBits-=6}function Ks(e,t,n){let r=Ws[e];if(r>-1)for(t.queue=t.queue<<6|r,t.queuedBits+=6;t.queuedBits>=8;)n(t.queue>>t.queuedBits-8&255),t.queuedBits-=8;else if(r===-2)return;else throw Error(`Invalid Base64-URL character "${String.fromCharCode(e)}"`)}function qs(e){let t=[],n=e=>{t.push(String.fromCodePoint(e))},r={utf8seq:0,codepoint:0},i={queue:0,queuedBits:0},a=e=>{Xs(e,r,n)};for(let t=0;t<e.length;t+=1)Ks(e.charCodeAt(t),i,a);return t.join(``)}function Js(e,t){if(e<=127){t(e);return}else if(e<=2047){t(192|e>>6),t(128|e&63);return}else if(e<=65535){t(224|e>>12),t(128|e>>6&63),t(128|e&63);return}else if(e<=1114111){t(240|e>>18),t(128|e>>12&63),t(128|e>>6&63),t(128|e&63);return}throw Error(`Unrecognized Unicode codepoint: ${e.toString(16)}`)}function Ys(e,t){for(let n=0;n<e.length;n+=1){let r=e.charCodeAt(n);if(r>55295&&r<=56319){let t=(r-55296)*1024&65535;r=(e.charCodeAt(n+1)-56320&65535|t)+65536,n+=1}Js(r,t)}}function Xs(e,t,n){if(t.utf8seq===0){if(e<=127){n(e);return}for(let n=1;n<6;n+=1)if(!(e>>7-n&1)){t.utf8seq=n;break}if(t.utf8seq===2)t.codepoint=e&31;else if(t.utf8seq===3)t.codepoint=e&15;else if(t.utf8seq===4)t.codepoint=e&7;else throw Error(`Invalid UTF-8 sequence`);--t.utf8seq}else if(t.utf8seq>0){if(e<=127)throw Error(`Invalid UTF-8 sequence`);t.codepoint=t.codepoint<<6|e&63,--t.utf8seq,t.utf8seq===0&&n(t.codepoint)}}function Zs(e){let t=[],n={queue:0,queuedBits:0},r=e=>{t.push(e)};for(let t=0;t<e.length;t+=1)Ks(e.charCodeAt(t),n,r);return new Uint8Array(t)}function Qs(e){let t=[];return Ys(e,e=>t.push(e)),new Uint8Array(t)}function $s(e){let t=[],n={queue:0,queuedBits:0},r=e=>{t.push(e)};return e.forEach(e=>Gs(e,n,r)),Gs(null,n,r),t.join(``)}function ec(e){return Math.round(Date.now()/1e3)+e}function tc(){return Symbol(`auth-callback`)}var nc=()=>typeof window<`u`&&typeof document<`u`,rc={tested:!1,writable:!1},ic=()=>{if(!nc())return!1;try{if(typeof globalThis.localStorage!=`object`)return!1}catch{return!1}if(rc.tested)return rc.writable;let e=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(e,e),globalThis.localStorage.removeItem(e),rc.tested=!0,rc.writable=!0}catch{rc.tested=!0,rc.writable=!1}return rc.writable};function ac(e){let t={},n=new URL(e);if(n.hash&&n.hash[0]===`#`)try{new URLSearchParams(n.hash.substring(1)).forEach((e,n)=>{t[n]=e})}catch{}return n.searchParams.forEach((e,n)=>{t[n]=e}),t}var oc=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),sc=e=>typeof e==`object`&&!!e&&`status`in e&&`ok`in e&&`json`in e&&typeof e.json==`function`,cc=async(e,t,n)=>{await e.setItem(t,JSON.stringify(n))},lc=async(e,t)=>{let n=await e.getItem(t);if(!n)return null;try{return JSON.parse(n)}catch{return null}},uc=async(e,t)=>{await e.removeItem(t)},dc=class e{constructor(){this.promise=new e.promiseConstructor((e,t)=>{this.resolve=e,this.reject=t})}};dc.promiseConstructor=Promise;function fc(e){let t=e.split(`.`);if(t.length!==3)throw new Vs(`Invalid JWT structure`);for(let e=0;e<t.length;e++)if(!Ss.test(t[e]))throw new Vs(`JWT not in base64url format`);return{header:JSON.parse(qs(t[0])),payload:JSON.parse(qs(t[1])),signature:Zs(t[2]),raw:{header:t[0],payload:t[1]}}}async function pc(e){return await new Promise(t=>{setTimeout(()=>t(null),e)})}function mc(e,t){return new Promise((n,r)=>{(async()=>{for(let i=0;i<1/0;i++)try{let r=await e(i);if(!t(i,null,r)){n(r);return}}catch(e){if(!t(i,e)){r(e);return}}})()})}function hc(e){return(`0`+e.toString(16)).substr(-2)}function gc(){let e=new Uint32Array(56);if(typeof crypto>`u`){let e=``;for(let t=0;t<56;t++)e+=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~`.charAt(Math.floor(Math.random()*66));return e}return crypto.getRandomValues(e),Array.from(e,hc).join(``)}async function _c(e){let t=new TextEncoder().encode(e),n=await crypto.subtle.digest(`SHA-256`,t),r=new Uint8Array(n);return Array.from(r).map(e=>String.fromCharCode(e)).join(``)}async function vc(e){if(!(typeof crypto<`u`&&crypto.subtle!==void 0&&typeof TextEncoder<`u`))return console.warn(`WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.`),e;let t=await _c(e);return btoa(t).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}async function yc(e,t,n=!1){let r=gc(),i=r;n&&(i+=`/recovery`),await cc(e,`${t}-code-verifier`,i);let a=await vc(r);return[a,r===a?`plain`:`s256`]}var bc=/^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;function xc(e){let t=e.headers.get(bs);if(!t||!t.match(bc))return null;try{return new Date(`${t}T00:00:00.0Z`)}catch{return null}}function Sc(e){if(!e)throw Error(`Missing exp claim`);if(e<=Math.floor(Date.now()/1e3))throw Error(`JWT has expired`)}function Cc(e){switch(e){case`RS256`:return{name:`RSASSA-PKCS1-v1_5`,hash:{name:`SHA-256`}};case`ES256`:return{name:`ECDSA`,namedCurve:`P-256`,hash:{name:`SHA-256`}};default:throw Error(`Invalid alg claim`)}}var wc=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;function Tc(e){if(!wc.test(e))throw Error(`@supabase/auth-js: Expected parameter to be UUID but is not`)}function Ec(e){if(!e.passkey)throw Error("@supabase/auth-js: the passkey API is experimental and disabled by default. Enable it by passing `auth: { experimental: { passkey: true } }` to createClient (or to the GoTrueClient constructor).")}function Dc(){return new Proxy({},{get:(e,t)=>{if(t===`__isUserNotAvailableProxy`)return!0;if(typeof t==`symbol`){let e=t.toString();if(e===`Symbol(Symbol.toPrimitive)`||e===`Symbol(Symbol.toStringTag)`||e===`Symbol(util.inspect.custom)`)return}throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${t}" property of the session object is not supported. Please use getUser() instead.`)},set:(e,t)=>{throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)},deleteProperty:(e,t)=>{throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)}})}function Oc(e,t){return new Proxy(e,{get:(e,n,r)=>{if(n===`__isInsecureUserWarningProxy`)return!0;if(typeof n==`symbol`){let t=n.toString();if(t===`Symbol(Symbol.toPrimitive)`||t===`Symbol(Symbol.toStringTag)`||t===`Symbol(util.inspect.custom)`||t===`Symbol(nodejs.util.inspect.custom)`)return Reflect.get(e,n,r)}return!t.value&&typeof n==`string`&&(console.warn(`Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.`),t.value=!0),Reflect.get(e,n,r)}})}function kc(e){return JSON.parse(JSON.stringify(e))}var Ac=e=>{if(typeof e==`object`&&e){let t=e;if(typeof t.msg==`string`)return t.msg;if(typeof t.message==`string`)return t.message;if(typeof t.error_description==`string`)return t.error_description;if(typeof t.error==`string`)return t.error}return JSON.stringify(e)},jc=[500,501,502,503,504,520,521,522,523,524,525,526,527,528,529,530];async function Mc(e){if(!sc(e))throw new Is(Ac(e),0);if(jc.includes(e.status))throw new Is(Ac(e),e.status);let t;try{t=await e.json()}catch(e){throw new Es(Ac(e),e)}let n,r=xc(e);if(r&&r.getTime()>=xs[`2024-01-01`].timestamp&&typeof t==`object`&&t&&typeof t.code==`string`?n=t.code:typeof t==`object`&&t&&typeof t.error_code==`string`&&(n=t.error_code),!n){if(typeof t==`object`&&t&&typeof t.weak_password==`object`&&t.weak_password&&Array.isArray(t.weak_password.reasons)&&t.weak_password.reasons.length&&t.weak_password.reasons.reduce((e,t)=>e&&typeof t==`string`,!0))throw new Bs(Ac(t),e.status,t.weak_password.reasons)}else if(n===`weak_password`)throw new Bs(Ac(t),e.status,t.weak_password?.reasons||[]);else if(n===`session_not_found`)throw new Os;throw new ws(Ac(t),e.status||500,n)}var Nc=(e,t,n,r)=>{let i={method:e,headers:t?.headers||{}};return e===`GET`?i:(i.headers=Object.assign({"Content-Type":`application/json;charset=UTF-8`},t?.headers),i.body=JSON.stringify(r),Object.assign(Object.assign({},i),n))};async function B(e,t,n,r){let i=Object.assign({},r?.headers);i[`X-Supabase-Api-Version`]||(i[bs]=xs[`2024-01-01`].name),r?.jwt&&(i.Authorization=`Bearer ${r.jwt}`);let a=r?.query??{};r?.redirectTo&&(a.redirect_to=r.redirectTo);let o=await Pc(e,t,n+(Object.keys(a).length?`?`+new URLSearchParams(a).toString():``),{headers:i,noResolveJson:r?.noResolveJson},{},r?.body);return r?.xform?r?.xform(o):{data:Object.assign({},o),error:null}}async function Pc(e,t,n,r,i,a){let o=Nc(t,r,i,a),s;try{s=await e(n,Object.assign({},o))}catch(e){throw console.error(e),new Is(Ac(e),0)}if(s.ok||await Mc(s),r?.noResolveJson)return s;try{return await s.json()}catch(e){await Mc(e)}}function Fc(e){let t=null;Vc(e)&&(t=Object.assign({},e),e.expires_at||(t.expires_at=ec(e.expires_in)));let n=e.user??(typeof e?.id==`string`?e:null);return{data:{session:t,user:n},error:null}}function Ic(e){let t=Fc(e);return!t.error&&e.weak_password&&typeof e.weak_password==`object`&&Array.isArray(e.weak_password.reasons)&&e.weak_password.reasons.length&&e.weak_password.message&&typeof e.weak_password.message==`string`&&e.weak_password.reasons.reduce((e,t)=>e&&typeof t==`string`,!0)&&(t.data.weak_password=e.weak_password),t}function Lc(e){return{data:{user:e.user??e},error:null}}function Rc(e){return{data:e,error:null}}function zc(e){let{action_link:t,email_otp:n,hashed_token:r,redirect_to:i,verification_type:a}=e,o=ji(e,[`action_link`,`email_otp`,`hashed_token`,`redirect_to`,`verification_type`]);return{data:{properties:{action_link:t,email_otp:n,hashed_token:r,redirect_to:i,verification_type:a},user:Object.assign({},o)},error:null}}function Bc(e){return e}function Vc(e){return!!e.access_token&&!!e.refresh_token&&!!e.expires_in}var Hc=[`global`,`local`,`others`],Uc=class{constructor({url:e=``,headers:t={},fetch:n,experimental:r}){this.url=e,this.headers=t,this.fetch=oc(n),this.experimental=r??{},this.mfa={listFactors:this._listFactors.bind(this),deleteFactor:this._deleteFactor.bind(this)},this.oauth={listClients:this._listOAuthClients.bind(this),createClient:this._createOAuthClient.bind(this),getClient:this._getOAuthClient.bind(this),updateClient:this._updateOAuthClient.bind(this),deleteClient:this._deleteOAuthClient.bind(this),regenerateClientSecret:this._regenerateOAuthClientSecret.bind(this)},this.customProviders={listProviders:this._listCustomProviders.bind(this),createProvider:this._createCustomProvider.bind(this),getProvider:this._getCustomProvider.bind(this),updateProvider:this._updateCustomProvider.bind(this),deleteProvider:this._deleteCustomProvider.bind(this)},this.passkey={listPasskeys:this._adminListPasskeys.bind(this),deletePasskey:this._adminDeletePasskey.bind(this)}}async signOut(e,t=Hc[0]){if(Hc.indexOf(t)<0)throw Error(`@supabase/auth-js: Parameter scope must be one of ${Hc.join(`, `)}`);try{return await B(this.fetch,`POST`,`${this.url}/logout?scope=${t}`,{headers:this.headers,jwt:e,noResolveJson:!0}),{data:null,error:null}}catch(e){if(z(e))return{data:null,error:e};throw e}}async inviteUserByEmail(e,t={}){try{return await B(this.fetch,`POST`,`${this.url}/invite`,{body:{email:e,data:t.data},headers:this.headers,redirectTo:t.redirectTo,xform:Lc})}catch(e){if(z(e))return{data:{user:null},error:e};throw e}}async generateLink(e){try{let{options:t}=e,n=ji(e,[`options`]),r=Object.assign(Object.assign({},n),t);return`newEmail`in n&&(r.new_email=n?.newEmail,delete r.newEmail),await B(this.fetch,`POST`,`${this.url}/admin/generate_link`,{body:r,headers:this.headers,xform:zc,redirectTo:t?.redirectTo})}catch(e){if(z(e))return{data:{properties:null,user:null},error:e};throw e}}async createUser(e){try{return await B(this.fetch,`POST`,`${this.url}/admin/users`,{body:e,headers:this.headers,xform:Lc})}catch(e){if(z(e))return{data:{user:null},error:e};throw e}}async listUsers(e){try{let t={nextPage:null,lastPage:0,total:0},n=await B(this.fetch,`GET`,`${this.url}/admin/users`,{headers:this.headers,noResolveJson:!0,query:{page:(e?.page)?.toString()??``,per_page:(e?.perPage)?.toString()??``},xform:Bc});if(n.error)throw n.error;let r=await n.json(),i=n.headers.get(`x-total-count`)??0,a=n.headers.get(`link`)?.split(`,`)??[];return a.length>0&&(a.forEach(e=>{let n=parseInt(e.split(`;`)[0].split(`=`)[1].substring(0,1)),r=JSON.parse(e.split(`;`)[1].split(`=`)[1]);t[`${r}Page`]=n}),t.total=parseInt(i)),{data:Object.assign(Object.assign({},r),t),error:null}}catch(e){if(z(e))return{data:{users:[]},error:e};throw e}}async getUserById(e){Tc(e);try{return await B(this.fetch,`GET`,`${this.url}/admin/users/${e}`,{headers:this.headers,xform:Lc})}catch(e){if(z(e))return{data:{user:null},error:e};throw e}}async updateUserById(e,t){Tc(e);try{return await B(this.fetch,`PUT`,`${this.url}/admin/users/${e}`,{body:t,headers:this.headers,xform:Lc})}catch(e){if(z(e))return{data:{user:null},error:e};throw e}}async deleteUser(e,t=!1){Tc(e);try{return await B(this.fetch,`DELETE`,`${this.url}/admin/users/${e}`,{headers:this.headers,body:{should_soft_delete:t},xform:Lc})}catch(e){if(z(e))return{data:{user:null},error:e};throw e}}async _listFactors(e){Tc(e.userId);try{let{data:t,error:n}=await B(this.fetch,`GET`,`${this.url}/admin/users/${e.userId}/factors`,{headers:this.headers,xform:e=>({data:{factors:e},error:null})});return{data:t,error:n}}catch(e){if(z(e))return{data:null,error:e};throw e}}async _deleteFactor(e){Tc(e.userId),Tc(e.id);try{return{data:await B(this.fetch,`DELETE`,`${this.url}/admin/users/${e.userId}/factors/${e.id}`,{headers:this.headers}),error:null}}catch(e){if(z(e))return{data:null,error:e};throw e}}async _listOAuthClients(e){try{let t={nextPage:null,lastPage:0,total:0},n=await B(this.fetch,`GET`,`${this.url}/admin/oauth/clients`,{headers:this.headers,noResolveJson:!0,query:{page:(e?.page)?.toString()??``,per_page:(e?.perPage)?.toString()??``},xform:Bc});if(n.error)throw n.error;let r=await n.json(),i=n.headers.get(`x-total-count`)??0,a=n.headers.get(`link`)?.split(`,`)??[];return a.length>0&&(a.forEach(e=>{let n=parseInt(e.split(`;`)[0].split(`=`)[1].substring(0,1)),r=JSON.parse(e.split(`;`)[1].split(`=`)[1]);t[`${r}Page`]=n}),t.total=parseInt(i)),{data:Object.assign(Object.assign({},r),t),error:null}}catch(e){if(z(e))return{data:{clients:[]},error:e};throw e}}async _createOAuthClient(e){try{return await B(this.fetch,`POST`,`${this.url}/admin/oauth/clients`,{body:e,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(z(e))return{data:null,error:e};throw e}}async _getOAuthClient(e){try{return await B(this.fetch,`GET`,`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(z(e))return{data:null,error:e};throw e}}async _updateOAuthClient(e,t){try{return await B(this.fetch,`PUT`,`${this.url}/admin/oauth/clients/${e}`,{body:t,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(z(e))return{data:null,error:e};throw e}}async _deleteOAuthClient(e){try{return await B(this.fetch,`DELETE`,`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(e){if(z(e))return{data:null,error:e};throw e}}async _regenerateOAuthClientSecret(e){try{return await B(this.fetch,`POST`,`${this.url}/admin/oauth/clients/${e}/regenerate_secret`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(z(e))return{data:null,error:e};throw e}}async _listCustomProviders(e){try{let t={};return e?.type&&(t.type=e.type),await B(this.fetch,`GET`,`${this.url}/admin/custom-providers`,{headers:this.headers,query:t,xform:e=>({data:{providers:e?.providers??[]},error:null})})}catch(e){if(z(e))return{data:{providers:[]},error:e};throw e}}async _createCustomProvider(e){try{return await B(this.fetch,`POST`,`${this.url}/admin/custom-providers`,{body:e,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(z(e))return{data:null,error:e};throw e}}async _getCustomProvider(e){try{return await B(this.fetch,`GET`,`${this.url}/admin/custom-providers/${e}`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(z(e))return{data:null,error:e};throw e}}async _updateCustomProvider(e,t){try{return await B(this.fetch,`PUT`,`${this.url}/admin/custom-providers/${e}`,{body:t,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(z(e))return{data:null,error:e};throw e}}async _deleteCustomProvider(e){try{return await B(this.fetch,`DELETE`,`${this.url}/admin/custom-providers/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(e){if(z(e))return{data:null,error:e};throw e}}async _adminListPasskeys(e){Ec(this.experimental),Tc(e.userId);try{return await B(this.fetch,`GET`,`${this.url}/admin/users/${e.userId}/passkeys`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(z(e))return{data:null,error:e};throw e}}async _adminDeletePasskey(e){Ec(this.experimental),Tc(e.userId),Tc(e.passkeyId);try{return await B(this.fetch,`DELETE`,`${this.url}/admin/users/${e.userId}/passkeys/${e.passkeyId}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(e){if(z(e))return{data:null,error:e};throw e}}};function Wc(e={}){return{getItem:t=>e[t]||null,setItem:(t,n)=>{e[t]=n},removeItem:t=>{delete e[t]}}}globalThis&&ic()&&globalThis.localStorage&&globalThis.localStorage.getItem(`supabase.gotrue-js.locks.debug`);var Gc=class extends Error{constructor(e){super(e),this.isAcquireTimeout=!0}};function Kc(){if(typeof globalThis!=`object`)try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<`u`&&(self.globalThis=self)}}function qc(e){if(!/^0x[a-fA-F0-9]{40}$/.test(e))throw Error(`@supabase/auth-js: Address "${e}" is invalid.`);return e.toLowerCase()}function Jc(e){return parseInt(e,16)}function Yc(e){let t=new TextEncoder().encode(e);return`0x`+Array.from(t,e=>e.toString(16).padStart(2,`0`)).join(``)}function Xc(e){let{chainId:t,domain:n,expirationTime:r,issuedAt:i=new Date,nonce:a,notBefore:o,requestId:s,resources:c,scheme:l,uri:u,version:d}=e;if(!Number.isInteger(t))throw Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${t}`);if(!n)throw Error(`@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.`);if(a&&a.length<8)throw Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${a}`);if(!u)throw Error(`@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.`);if(d!==`1`)throw Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${d}`);if(e.statement?.includes(`
`))throw Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${e.statement}`);let f=qc(e.address),p=`${l?`${l}://${n}`:n} wants you to sign in with your Ethereum account:\n${f}\n\n${e.statement?`${e.statement}\n`:``}`,m=`URI: ${u}\nVersion: ${d}\nChain ID: ${t}${a?`\nNonce: ${a}`:``}\nIssued At: ${i.toISOString()}`;if(r&&(m+=`\nExpiration Time: ${r.toISOString()}`),o&&(m+=`\nNot Before: ${o.toISOString()}`),s&&(m+=`\nRequest ID: ${s}`),c){let e=`
Resources:`;for(let t of c){if(!t||typeof t!=`string`)throw Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${t}`);e+=`\n- ${t}`}m+=e}return`${p}\n${m}`}var Zc=class extends Error{constructor({message:e,code:t,cause:n,name:r}){super(e,{cause:n}),this.__isWebAuthnError=!0,this.name=r??(n instanceof Error?n.name:void 0)??`Unknown Error`,this.code=t}toJSON(){return{name:this.name,message:this.message,code:this.code}}},Qc=class extends Zc{constructor(e,t){super({code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:t,message:e}),this.name=`WebAuthnUnknownError`,this.originalError=t}};function $c({error:e,options:t}){let{publicKey:n}=t;if(!n)throw Error(`options was missing required publicKey property`);if(e.name===`AbortError`){if(t.signal instanceof AbortSignal)return new Zc({message:`Registration ceremony was sent an abort signal`,code:`ERROR_CEREMONY_ABORTED`,cause:e})}else if(e.name===`ConstraintError`){if(n.authenticatorSelection?.requireResidentKey===!0)return new Zc({message:`Discoverable credentials were required but no available authenticator supported it`,code:`ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT`,cause:e});if(t.mediation===`conditional`&&n.authenticatorSelection?.userVerification===`required`)return new Zc({message:`User verification was required during automatic registration but it could not be performed`,code:`ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE`,cause:e});if(n.authenticatorSelection?.userVerification===`required`)return new Zc({message:`User verification was required but no available authenticator supported it`,code:`ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT`,cause:e})}else if(e.name===`InvalidStateError`)return new Zc({message:`The authenticator was previously registered`,code:`ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED`,cause:e});else if(e.name===`NotAllowedError`)return new Zc({message:e.message,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e});else if(e.name===`NotSupportedError`)return n.pubKeyCredParams.filter(e=>e.type===`public-key`).length===0?new Zc({message:`No entry in pubKeyCredParams was of type "public-key"`,code:`ERROR_MALFORMED_PUBKEYCREDPARAMS`,cause:e}):new Zc({message:`No available authenticator supported any of the specified pubKeyCredParams algorithms`,code:`ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG`,cause:e});else if(e.name===`SecurityError`){let t=window.location.hostname;if(!ol(t))return new Zc({message:`${window.location.hostname} is an invalid domain`,code:`ERROR_INVALID_DOMAIN`,cause:e});if(n.rp.id!==t)return new Zc({message:`The RP ID "${n.rp.id}" is invalid for this domain`,code:`ERROR_INVALID_RP_ID`,cause:e})}else if(e.name===`TypeError`){if(n.user.id.byteLength<1||n.user.id.byteLength>64)return new Zc({message:`User ID was not between 1 and 64 characters`,code:`ERROR_INVALID_USER_ID_LENGTH`,cause:e})}else if(e.name===`UnknownError`)return new Zc({message:`The authenticator was unable to process the specified options, or could not create a new credential`,code:`ERROR_AUTHENTICATOR_GENERAL_ERROR`,cause:e});return new Zc({message:`a Non-Webauthn related error has occurred`,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e})}function el({error:e,options:t}){let{publicKey:n}=t;if(!n)throw Error(`options was missing required publicKey property`);if(e.name===`AbortError`){if(t.signal instanceof AbortSignal)return new Zc({message:`Authentication ceremony was sent an abort signal`,code:`ERROR_CEREMONY_ABORTED`,cause:e})}else if(e.name===`NotAllowedError`)return new Zc({message:e.message,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e});else if(e.name===`SecurityError`){let t=window.location.hostname;if(!ol(t))return new Zc({message:`${window.location.hostname} is an invalid domain`,code:`ERROR_INVALID_DOMAIN`,cause:e});if(n.rpId!==t)return new Zc({message:`The RP ID "${n.rpId}" is invalid for this domain`,code:`ERROR_INVALID_RP_ID`,cause:e})}else if(e.name===`UnknownError`)return new Zc({message:`The authenticator was unable to process the specified options, or could not create a new assertion signature`,code:`ERROR_AUTHENTICATOR_GENERAL_ERROR`,cause:e});return new Zc({message:`a Non-Webauthn related error has occurred`,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e})}var tl=new class{createNewAbortSignal(){if(this.controller){let e=Error(`Cancelling existing WebAuthn API call for new one`);e.name=`AbortError`,this.controller.abort(e)}let e=new AbortController;return this.controller=e,e.signal}cancelCeremony(){if(this.controller){let e=Error(`Manually cancelling existing WebAuthn API call`);e.name=`AbortError`,this.controller.abort(e),this.controller=void 0}}};function nl(e){if(!e)throw Error(`Credential creation options are required`);if(typeof PublicKeyCredential<`u`&&`parseCreationOptionsFromJSON`in PublicKeyCredential&&typeof PublicKeyCredential.parseCreationOptionsFromJSON==`function`)return PublicKeyCredential.parseCreationOptionsFromJSON(e);let{challenge:t,user:n,excludeCredentials:r}=e,i=ji(e,[`challenge`,`user`,`excludeCredentials`]),a=Zs(t).buffer,o=Object.assign(Object.assign({},n),{id:Zs(n.id).buffer}),s=Object.assign(Object.assign({},i),{challenge:a,user:o});if(r&&r.length>0){s.excludeCredentials=Array(r.length);for(let e=0;e<r.length;e++){let t=r[e];s.excludeCredentials[e]=Object.assign(Object.assign({},t),{id:Zs(t.id).buffer,type:t.type||`public-key`,transports:t.transports})}}return s}function rl(e){if(!e)throw Error(`Credential request options are required`);if(typeof PublicKeyCredential<`u`&&`parseRequestOptionsFromJSON`in PublicKeyCredential&&typeof PublicKeyCredential.parseRequestOptionsFromJSON==`function`)return PublicKeyCredential.parseRequestOptionsFromJSON(e);let{challenge:t,allowCredentials:n}=e,r=ji(e,[`challenge`,`allowCredentials`]),i=Zs(t).buffer,a=Object.assign(Object.assign({},r),{challenge:i});if(n&&n.length>0){a.allowCredentials=Array(n.length);for(let e=0;e<n.length;e++){let t=n[e];a.allowCredentials[e]=Object.assign(Object.assign({},t),{id:Zs(t.id).buffer,type:t.type||`public-key`,transports:t.transports})}}return a}function il(e){if(`toJSON`in e&&typeof e.toJSON==`function`)return e.toJSON();let t=e;return{id:e.id,rawId:e.id,response:{attestationObject:$s(new Uint8Array(e.response.attestationObject)),clientDataJSON:$s(new Uint8Array(e.response.clientDataJSON))},type:`public-key`,clientExtensionResults:e.getClientExtensionResults(),authenticatorAttachment:t.authenticatorAttachment??void 0}}function al(e){if(`toJSON`in e&&typeof e.toJSON==`function`)return e.toJSON();let t=e,n=e.getClientExtensionResults(),r=e.response;return{id:e.id,rawId:e.id,response:{authenticatorData:$s(new Uint8Array(r.authenticatorData)),clientDataJSON:$s(new Uint8Array(r.clientDataJSON)),signature:$s(new Uint8Array(r.signature)),userHandle:r.userHandle?$s(new Uint8Array(r.userHandle)):void 0},type:`public-key`,clientExtensionResults:n,authenticatorAttachment:t.authenticatorAttachment??void 0}}function ol(e){return e===`localhost`||/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e)}function sl(){return!!(nc()&&`PublicKeyCredential`in window&&window.PublicKeyCredential&&`credentials`in navigator&&typeof(navigator==null?void 0:navigator.credentials)?.create==`function`&&typeof(navigator==null?void 0:navigator.credentials)?.get==`function`)}async function cl(e){try{let t=await navigator.credentials.create(e);return t?t instanceof PublicKeyCredential?{data:t,error:null}:{data:null,error:new Qc(`Browser returned unexpected credential type`,t)}:{data:null,error:new Qc(`Empty credential response`,t)}}catch(t){return{data:null,error:$c({error:t,options:e})}}}async function ll(e){try{let t=await navigator.credentials.get(e);return t?t instanceof PublicKeyCredential?{data:t,error:null}:{data:null,error:new Qc(`Browser returned unexpected credential type`,t)}:{data:null,error:new Qc(`Empty credential response`,t)}}catch(t){return{data:null,error:el({error:t,options:e})}}}var ul={hints:[`security-key`],authenticatorSelection:{authenticatorAttachment:`cross-platform`,requireResidentKey:!1,userVerification:`preferred`,residentKey:`discouraged`},attestation:`direct`},dl={userVerification:`preferred`,hints:[`security-key`],attestation:`direct`};function fl(...e){let t=e=>typeof e==`object`&&!!e&&!Array.isArray(e),n=e=>e instanceof ArrayBuffer||ArrayBuffer.isView(e),r={};for(let i of e)if(i)for(let e in i){let a=i[e];if(a!==void 0)if(Array.isArray(a))r[e]=a;else if(n(a))r[e]=a;else if(t(a)){let n=r[e];t(n)?r[e]=fl(n,a):r[e]=fl(a)}else r[e]=a}return r}function pl(e,t){return fl(ul,e,t||{})}function ml(e,t){return fl(dl,e,t||{})}var hl=class{constructor(e){this.client=e,this.enroll=this._enroll.bind(this),this.challenge=this._challenge.bind(this),this.verify=this._verify.bind(this),this.authenticate=this._authenticate.bind(this),this.register=this._register.bind(this)}async _enroll(e){return this.client.mfa.enroll(Object.assign(Object.assign({},e),{factorType:`webauthn`}))}async _challenge({factorId:e,webauthn:t,friendlyName:n,signal:r},i){try{let{data:a,error:o}=await this.client.mfa.challenge({factorId:e,webauthn:t});if(!a)return{data:null,error:o};let s=r??tl.createNewAbortSignal();if(a.webauthn.type===`create`){let{user:e}=a.webauthn.credential_options.publicKey;if(!e.name){let t=n;if(t)e.name=`${e.id}:${t}`;else{let t=(await this.client.getUser()).data.user,n=t?.user_metadata?.name||t?.email||t?.id||`User`;e.name=`${e.id}:${n}`}}e.displayName||=e.name}switch(a.webauthn.type){case`create`:{let{data:t,error:n}=await cl({publicKey:pl(a.webauthn.credential_options.publicKey,i?.create),signal:s});return t?{data:{factorId:e,challengeId:a.id,webauthn:{type:a.webauthn.type,credential_response:t}},error:null}:{data:null,error:n}}case`request`:{let t=ml(a.webauthn.credential_options.publicKey,i?.request),{data:n,error:r}=await ll(Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:t,signal:s}));return n?{data:{factorId:e,challengeId:a.id,webauthn:{type:a.webauthn.type,credential_response:n}},error:null}:{data:null,error:r}}}}catch(e){return z(e)?{data:null,error:e}:{data:null,error:new Es(`Unexpected error in challenge`,e)}}}async _verify({challengeId:e,factorId:t,webauthn:n}){return this.client.mfa.verify({factorId:t,challengeId:e,webauthn:n})}async _authenticate({factorId:e,webauthn:{rpId:t=typeof window<`u`?window.location.hostname:void 0,rpOrigins:n=typeof window<`u`?[window.location.origin]:void 0,signal:r}={}},i){if(!t)return{data:null,error:new Cs(`rpId is required for WebAuthn authentication`)};try{if(!sl())return{data:null,error:new Es(`Browser does not support WebAuthn`,null)};let{data:a,error:o}=await this.challenge({factorId:e,webauthn:{rpId:t,rpOrigins:n},signal:r},{request:i});if(!a)return{data:null,error:o};let{webauthn:s}=a;return this._verify({factorId:e,challengeId:a.challengeId,webauthn:{type:s.type,rpId:t,rpOrigins:n,credential_response:s.credential_response}})}catch(e){return z(e)?{data:null,error:e}:{data:null,error:new Es(`Unexpected error in authenticate`,e)}}}async _register({friendlyName:e,webauthn:{rpId:t=typeof window<`u`?window.location.hostname:void 0,rpOrigins:n=typeof window<`u`?[window.location.origin]:void 0,signal:r}={}},i){if(!t)return{data:null,error:new Cs(`rpId is required for WebAuthn registration`)};try{if(!sl())return{data:null,error:new Es(`Browser does not support WebAuthn`,null)};let{data:a,error:o}=await this._enroll({friendlyName:e});if(!a)return await this.client.mfa.listFactors().then(t=>t.data?.all.find(t=>t.factor_type===`webauthn`&&t.friendly_name===e&&t.status!==`unverified`)).then(e=>e?this.client.mfa.unenroll({factorId:e?.id}):void 0),{data:null,error:o};let{data:s,error:c}=await this._challenge({factorId:a.id,friendlyName:a.friendly_name,webauthn:{rpId:t,rpOrigins:n},signal:r},{create:i});return s?this._verify({factorId:a.id,challengeId:s.challengeId,webauthn:{rpId:t,rpOrigins:n,type:s.webauthn.type,credential_response:s.webauthn.credential_response}}):{data:null,error:c}}catch(e){return z(e)?{data:null,error:e}:{data:null,error:new Es(`Unexpected error in register`,e)}}}};Kc();var gl={url:_s,storageKey:vs,autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,headers:ys,flowType:`implicit`,debug:!1,hasCustomAuthorizationHeader:!1,throwOnError:!1,lockAcquireTimeout:5e3,skipAutoInitialize:!1,experimental:{}},_l={},vl=class e{get jwks(){return _l[this.storageKey]?.jwks??{keys:[]}}set jwks(e){_l[this.storageKey]=Object.assign(Object.assign({},_l[this.storageKey]),{jwks:e})}get jwks_cached_at(){return _l[this.storageKey]?.cachedAt??-(2**53-1)}set jwks_cached_at(e){_l[this.storageKey]=Object.assign(Object.assign({},_l[this.storageKey]),{cachedAt:e})}constructor(t){var n;this.userStorage=null,this.memoryStorage=null,this.stateChangeEmitters=new Map,this.autoRefreshTicker=null,this.autoRefreshTickTimeout=null,this.visibilityChangedCallback=null,this.refreshingDeferred=null,this.lastRefreshFailure=null,this._sessionRemovalEpoch=0,this.initializePromise=null,this.detectSessionInUrl=!0,this.hasCustomAuthorizationHeader=!1,this.suppressGetSessionWarning=!1,this.lock=null,this.lockAcquired=!1,this.pendingInLock=[],this.broadcastChannel=null,this.logger=console.log;let r=Object.assign(Object.assign({},gl),t);if(this.storageKey=r.storageKey,this.instanceID=e.nextInstanceID[this.storageKey]??0,e.nextInstanceID[this.storageKey]=this.instanceID+1,this.logDebugMessages=!!r.debug,typeof r.debug==`function`&&(this.logger=r.debug),this.instanceID>0&&nc()){let e=`${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;console.warn(e),this.logDebugMessages&&console.trace(e)}if(this.persistSession=r.persistSession,this.autoRefreshToken=r.autoRefreshToken,this.experimental=r.experimental??{},this.admin=new Uc({url:r.url,headers:r.headers,fetch:r.fetch,experimental:this.experimental}),this.url=r.url,this.headers=r.headers,this.fetch=oc(r.fetch),this.detectSessionInUrl=r.detectSessionInUrl,this.flowType=r.flowType,this.hasCustomAuthorizationHeader=r.hasCustomAuthorizationHeader,this.throwOnError=r.throwOnError,this.lockAcquireTimeout=r.lockAcquireTimeout,r.lock!=null&&(this.lock=r.lock),this.jwks||(this.jwks={keys:[]},this.jwks_cached_at=-(2**53-1)),this.mfa={verify:this._verify.bind(this),enroll:this._enroll.bind(this),unenroll:this._unenroll.bind(this),challenge:this._challenge.bind(this),listFactors:this._listFactors.bind(this),challengeAndVerify:this._challengeAndVerify.bind(this),getAuthenticatorAssuranceLevel:this._getAuthenticatorAssuranceLevel.bind(this),webauthn:new hl(this)},this.oauth={getAuthorizationDetails:this._getAuthorizationDetails.bind(this),approveAuthorization:this._approveAuthorization.bind(this),denyAuthorization:this._denyAuthorization.bind(this),listGrants:this._listOAuthGrants.bind(this),revokeGrant:this._revokeOAuthGrant.bind(this)},this.passkey={startRegistration:this._startPasskeyRegistration.bind(this),verifyRegistration:this._verifyPasskeyRegistration.bind(this),startAuthentication:this._startPasskeyAuthentication.bind(this),verifyAuthentication:this._verifyPasskeyAuthentication.bind(this),list:this._listPasskeys.bind(this),update:this._updatePasskey.bind(this),delete:this._deletePasskey.bind(this)},this.persistSession?(r.storage?this.storage=r.storage:ic()?this.storage=globalThis.localStorage:(this.memoryStorage={},this.storage=Wc(this.memoryStorage)),r.userStorage&&(this.userStorage=r.userStorage)):(this.memoryStorage={},this.storage=Wc(this.memoryStorage)),nc()&&globalThis.BroadcastChannel&&this.persistSession&&this.storageKey){try{this.broadcastChannel=new globalThis.BroadcastChannel(this.storageKey)}catch(e){console.error(`Failed to create a new BroadcastChannel, multi-tab state changes will not be available`,e)}(n=this.broadcastChannel)==null||n.addEventListener(`message`,async e=>{this._debug(`received broadcast notification from other tab or client`,e),(e.data.event===`TOKEN_REFRESHED`||e.data.event===`SIGNED_IN`)&&(this.lastRefreshFailure=null);try{await this._notifyAllSubscribers(e.data.event,e.data.session,!1)}catch(e){this._debug(`#broadcastChannel`,`error`,e)}})}r.skipAutoInitialize||this.initialize().catch(e=>{this._debug(`#initialize()`,`error`,e)})}isThrowOnErrorEnabled(){return this.throwOnError}_returnResult(e){if(this.throwOnError&&e&&e.error)throw e.error;return e}_logPrefix(){return`GoTrueClient@${this.storageKey}:${this.instanceID} (${ps}) ${new Date().toISOString()}`}_debug(...e){return this.logDebugMessages&&this.logger(this._logPrefix(),...e),this}async initialize(){return this.initializePromise||=(async()=>this.lock==null?await this._initialize():await this._acquireLock(this.lockAcquireTimeout,async()=>await this._initialize()))(),await this.initializePromise}async _initialize(){try{let e={},t=`none`;if(nc()&&(e=ac(window.location.href),this._isImplicitGrantCallback(e)?t=`implicit`:await this._isPKCECallback(e)&&(t=`pkce`)),nc()&&this.detectSessionInUrl&&t!==`none`){let{data:n,error:r}=await this._getSessionFromURL(e,t);if(r){if(this._debug(`#_initialize()`,`error detecting session from URL`,r),Ns(r)){let e=r.details?.code;if(e===`identity_already_exists`||e===`identity_not_found`||e===`single_identity_not_deletable`)return{error:r}}return{error:r}}let{session:i,redirectType:a}=n;return this._debug(`#_initialize()`,`detected session in URL`,i,`redirect type`,a),await this._saveSession(i),setTimeout(async()=>{a===`recovery`?await this._notifyAllSubscribers(`PASSWORD_RECOVERY`,i):await this._notifyAllSubscribers(`SIGNED_IN`,i)},0),{error:null}}return await this._recoverAndRefresh(),{error:null}}catch(e){return z(e)?this._returnResult({error:e}):this._returnResult({error:new Es(`Unexpected error during initialization`,e)})}finally{await this._handleVisibilityChange(),this._debug(`#_initialize()`,`end`)}}async signInAnonymously(e){try{let{data:t,error:n}=await B(this.fetch,`POST`,`${this.url}/signup`,{headers:this.headers,body:{data:e?.options?.data??{},gotrue_meta_security:{captcha_token:e?.options?.captchaToken}},xform:Fc});if(n||!t)return this._returnResult({data:{user:null,session:null},error:n});let r=t.session,i=t.user;return t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers(`SIGNED_IN`,r)),this._returnResult({data:{user:i,session:r},error:null})}catch(e){if(z(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signUp(e){try{let t;if(`email`in e){let{email:n,password:r,options:i}=e,a=null,o=null;this.flowType===`pkce`&&([a,o]=await yc(this.storage,this.storageKey)),t=await B(this.fetch,`POST`,`${this.url}/signup`,{headers:this.headers,redirectTo:i?.emailRedirectTo,body:{email:n,password:r,data:i?.data??{},gotrue_meta_security:{captcha_token:i?.captchaToken},code_challenge:a,code_challenge_method:o},xform:Fc})}else if(`phone`in e){let{phone:n,password:r,options:i}=e;t=await B(this.fetch,`POST`,`${this.url}/signup`,{headers:this.headers,body:{phone:n,password:r,data:i?.data??{},channel:i?.channel??`sms`,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:Fc})}else throw new js(`You must provide either an email or phone number and a password`);let{data:n,error:r}=t;if(r||!n)return await uc(this.storage,`${this.storageKey}-code-verifier`),this._returnResult({data:{user:null,session:null},error:r});let i=n.session,a=n.user;return n.session&&(await this._saveSession(n.session),await this._notifyAllSubscribers(`SIGNED_IN`,i)),this._returnResult({data:{user:a,session:i},error:null})}catch(e){if(await uc(this.storage,`${this.storageKey}-code-verifier`),z(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithPassword(e){try{let t;if(`email`in e){let{email:n,password:r,options:i}=e;t=await B(this.fetch,`POST`,`${this.url}/token?grant_type=password`,{headers:this.headers,body:{email:n,password:r,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:Ic})}else if(`phone`in e){let{phone:n,password:r,options:i}=e;t=await B(this.fetch,`POST`,`${this.url}/token?grant_type=password`,{headers:this.headers,body:{phone:n,password:r,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:Ic})}else throw new js(`You must provide either an email or phone number and a password`);let{data:n,error:r}=t;if(r)return this._returnResult({data:{user:null,session:null},error:r});if(!n||!n.session||!n.user){let e=new As;return this._returnResult({data:{user:null,session:null},error:e})}return n.session&&(await this._saveSession(n.session),await this._notifyAllSubscribers(`SIGNED_IN`,n.session)),this._returnResult({data:Object.assign({user:n.user,session:n.session},n.weak_password?{weakPassword:n.weak_password}:null),error:r})}catch(e){if(z(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithOAuth(e){return await this._handleProviderSignIn(e.provider,{redirectTo:e.options?.redirectTo,scopes:e.options?.scopes,queryParams:e.options?.queryParams,skipBrowserRedirect:e.options?.skipBrowserRedirect})}async exchangeCodeForSession(e){return await this.initializePromise,this.lock==null?this._exchangeCodeForSession(e):this._acquireLock(this.lockAcquireTimeout,async()=>this._exchangeCodeForSession(e))}async signInWithWeb3(e){let{chain:t}=e;switch(t){case`ethereum`:return await this.signInWithEthereum(e);case`solana`:return await this.signInWithSolana(e);default:throw Error(`@supabase/auth-js: Unsupported chain "${t}"`)}}async signInWithEthereum(e){let t,n;if(`message`in e)t=e.message,n=e.signature;else{let{chain:r,wallet:i,statement:a,options:o}=e,s;if(!nc()){if(typeof i!=`object`||!o?.url)throw Error(`@supabase/auth-js: Both wallet and url must be specified in non-browser environments.`);s=i}else if(typeof i==`object`)s=i;else{let e=window;if(`ethereum`in e&&typeof e.ethereum==`object`&&`request`in e.ethereum&&typeof e.ethereum.request==`function`)s=e.ethereum;else throw Error(`@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.`)}let c=new URL(o?.url??window.location.href),l=await s.request({method:`eth_requestAccounts`}).then(e=>e).catch(()=>{throw Error(`@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid`)});if(!l||l.length===0)throw Error(`@supabase/auth-js: No accounts available. Please ensure the wallet is connected.`);let u=qc(l[0]),d=o?.signInWithEthereum?.chainId;d||=Jc(await s.request({method:`eth_chainId`})),t=Xc({domain:c.host,address:u,statement:a,uri:c.href,version:`1`,chainId:d,nonce:o?.signInWithEthereum?.nonce,issuedAt:o?.signInWithEthereum?.issuedAt??new Date,expirationTime:o?.signInWithEthereum?.expirationTime,notBefore:o?.signInWithEthereum?.notBefore,requestId:o?.signInWithEthereum?.requestId,resources:o?.signInWithEthereum?.resources}),n=await s.request({method:`personal_sign`,params:[Yc(t),u]})}try{let{data:r,error:i}=await B(this.fetch,`POST`,`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:`ethereum`,message:t,signature:n},e.options?.captchaToken?{gotrue_meta_security:{captcha_token:e.options?.captchaToken}}:null),xform:Fc});if(i)throw i;if(!r||!r.session||!r.user){let e=new As;return this._returnResult({data:{user:null,session:null},error:e})}return r.session&&(await this._saveSession(r.session),await this._notifyAllSubscribers(`SIGNED_IN`,r.session)),this._returnResult({data:Object.assign({},r),error:i})}catch(e){if(z(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithSolana(e){let t,n;if(`message`in e)t=e.message,n=e.signature;else{let{chain:r,wallet:i,statement:a,options:o}=e,s;if(!nc()){if(typeof i!=`object`||!o?.url)throw Error(`@supabase/auth-js: Both wallet and url must be specified in non-browser environments.`);s=i}else if(typeof i==`object`)s=i;else{let e=window;if(`solana`in e&&typeof e.solana==`object`&&(`signIn`in e.solana&&typeof e.solana.signIn==`function`||`signMessage`in e.solana&&typeof e.solana.signMessage==`function`))s=e.solana;else throw Error(`@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.`)}let c=new URL(o?.url??window.location.href);if(`signIn`in s&&s.signIn){let e=await s.signIn(Object.assign(Object.assign(Object.assign({issuedAt:new Date().toISOString()},o?.signInWithSolana),{version:`1`,domain:c.host,uri:c.href}),a?{statement:a}:null)),r;if(Array.isArray(e)&&e[0]&&typeof e[0]==`object`)r=e[0];else if(e&&typeof e==`object`&&`signedMessage`in e&&`signature`in e)r=e;else throw Error(`@supabase/auth-js: Wallet method signIn() returned unrecognized value`);if(`signedMessage`in r&&`signature`in r&&(typeof r.signedMessage==`string`||r.signedMessage instanceof Uint8Array)&&r.signature instanceof Uint8Array)t=typeof r.signedMessage==`string`?r.signedMessage:new TextDecoder().decode(r.signedMessage),n=r.signature;else throw Error(`@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields`)}else{if(!(`signMessage`in s)||typeof s.signMessage!=`function`||!(`publicKey`in s)||typeof s!=`object`||!s.publicKey||!(`toBase58`in s.publicKey)||typeof s.publicKey.toBase58!=`function`)throw Error(`@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API`);t=[`${c.host} wants you to sign in with your Solana account:`,s.publicKey.toBase58(),...a?[``,a,``]:[``],`Version: 1`,`URI: ${c.href}`,`Issued At: ${o?.signInWithSolana?.issuedAt??new Date().toISOString()}`,...o?.signInWithSolana?.notBefore?[`Not Before: ${o.signInWithSolana.notBefore}`]:[],...o?.signInWithSolana?.expirationTime?[`Expiration Time: ${o.signInWithSolana.expirationTime}`]:[],...o?.signInWithSolana?.chainId?[`Chain ID: ${o.signInWithSolana.chainId}`]:[],...o?.signInWithSolana?.nonce?[`Nonce: ${o.signInWithSolana.nonce}`]:[],...o?.signInWithSolana?.requestId?[`Request ID: ${o.signInWithSolana.requestId}`]:[],...o?.signInWithSolana?.resources?.length?[`Resources`,...o.signInWithSolana.resources.map(e=>`- ${e}`)]:[]].join(`
`);let e=await s.signMessage(new TextEncoder().encode(t),`utf8`);if(!e||!(e instanceof Uint8Array))throw Error(`@supabase/auth-js: Wallet signMessage() API returned an recognized value`);n=e}}try{let{data:r,error:i}=await B(this.fetch,`POST`,`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:`solana`,message:t,signature:$s(n)},e.options?.captchaToken?{gotrue_meta_security:{captcha_token:e.options?.captchaToken}}:null),xform:Fc});if(i)throw i;if(!r||!r.session||!r.user){let e=new As;return this._returnResult({data:{user:null,session:null},error:e})}return r.session&&(await this._saveSession(r.session),await this._notifyAllSubscribers(`SIGNED_IN`,r.session)),this._returnResult({data:Object.assign({},r),error:i})}catch(e){if(z(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async _exchangeCodeForSession(e){let[t,n]=(await lc(this.storage,`${this.storageKey}-code-verifier`)??``).split(`/`);try{if(!t&&this.flowType===`pkce`)throw new Fs;let{data:r,error:i}=await B(this.fetch,`POST`,`${this.url}/token?grant_type=pkce`,{headers:this.headers,body:{auth_code:e,code_verifier:t},xform:Fc});if(await uc(this.storage,`${this.storageKey}-code-verifier`),i)throw i;if(!r||!r.session||!r.user){let e=new As;return this._returnResult({data:{user:null,session:null,redirectType:null},error:e})}return r.session&&(await this._saveSession(r.session),await this._notifyAllSubscribers(n===`recovery`?`PASSWORD_RECOVERY`:`SIGNED_IN`,r.session)),this._returnResult({data:Object.assign(Object.assign({},r),{redirectType:n??null}),error:i})}catch(e){if(await uc(this.storage,`${this.storageKey}-code-verifier`),z(e))return this._returnResult({data:{user:null,session:null,redirectType:null},error:e});throw e}}async signInWithIdToken(e){try{let{options:t,provider:n,token:r,access_token:i,nonce:a}=e,{data:o,error:s}=await B(this.fetch,`POST`,`${this.url}/token?grant_type=id_token`,{headers:this.headers,body:{provider:n,id_token:r,access_token:i,nonce:a,gotrue_meta_security:{captcha_token:t?.captchaToken}},xform:Fc});if(s)return this._returnResult({data:{user:null,session:null},error:s});if(!o||!o.session||!o.user){let e=new As;return this._returnResult({data:{user:null,session:null},error:e})}return o.session&&(await this._saveSession(o.session),await this._notifyAllSubscribers(`SIGNED_IN`,o.session)),this._returnResult({data:o,error:s})}catch(e){if(z(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithOtp(e){try{if(`email`in e){let{email:t,options:n}=e,r=null,i=null;this.flowType===`pkce`&&([r,i]=await yc(this.storage,this.storageKey));let{error:a}=await B(this.fetch,`POST`,`${this.url}/otp`,{headers:this.headers,body:{email:t,data:n?.data??{},create_user:n?.shouldCreateUser??!0,gotrue_meta_security:{captcha_token:n?.captchaToken},code_challenge:r,code_challenge_method:i},redirectTo:n?.emailRedirectTo});return this._returnResult({data:{user:null,session:null},error:a})}if(`phone`in e){let{phone:t,options:n}=e,{data:r,error:i}=await B(this.fetch,`POST`,`${this.url}/otp`,{headers:this.headers,body:{phone:t,data:n?.data??{},create_user:n?.shouldCreateUser??!0,gotrue_meta_security:{captcha_token:n?.captchaToken},channel:n?.channel??`sms`}});return this._returnResult({data:{user:null,session:null,messageId:r?.message_id},error:i})}throw new js(`You must provide either an email or phone number.`)}catch(e){if(await uc(this.storage,`${this.storageKey}-code-verifier`),z(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async verifyOtp(e){try{let t,n;`options`in e&&(t=e.options?.redirectTo,n=e.options?.captchaToken);let{data:r,error:i}=await B(this.fetch,`POST`,`${this.url}/verify`,{headers:this.headers,body:Object.assign(Object.assign({},e),{gotrue_meta_security:{captcha_token:n}}),redirectTo:t,xform:Fc});if(i)throw i;if(!r)throw Error(`An error occurred on token verification.`);let a=r.session,o=r.user;return a?.access_token&&(await this._saveSession(a),await this._notifyAllSubscribers(e.type==`recovery`?`PASSWORD_RECOVERY`:`SIGNED_IN`,a)),this._returnResult({data:{user:o,session:a},error:null})}catch(e){if(z(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithSSO(e){try{let t=null,n=null;this.flowType===`pkce`&&([t,n]=await yc(this.storage,this.storageKey));let r=await B(this.fetch,`POST`,`${this.url}/sso`,{body:Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},`providerId`in e?{provider_id:e.providerId}:null),`domain`in e?{domain:e.domain}:null),{redirect_to:e.options?.redirectTo??void 0}),e?.options?.captchaToken?{gotrue_meta_security:{captcha_token:e.options.captchaToken}}:null),{skip_http_redirect:!0,code_challenge:t,code_challenge_method:n}),headers:this.headers,xform:Rc});return r.data?.url&&nc()&&!e.options?.skipBrowserRedirect&&window.location.assign(r.data.url),this._returnResult(r)}catch(e){if(await uc(this.storage,`${this.storageKey}-code-verifier`),z(e))return this._returnResult({data:null,error:e});throw e}}async reauthenticate(){return await this.initializePromise,this.lock==null?await this._reauthenticate():await this._acquireLock(this.lockAcquireTimeout,async()=>await this._reauthenticate())}async _reauthenticate(){try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;if(n)throw n;if(!t)throw new Os;let{error:r}=await B(this.fetch,`GET`,`${this.url}/reauthenticate`,{headers:this.headers,jwt:t.access_token});return this._returnResult({data:{user:null,session:null},error:r})})}catch(e){if(z(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async resend(e){try{let t=`${this.url}/resend`;if(`email`in e){let{email:n,type:r,options:i}=e,a=null,o=null;this.flowType===`pkce`&&([a,o]=await yc(this.storage,this.storageKey));let{error:s}=await B(this.fetch,`POST`,t,{headers:this.headers,body:{email:n,type:r,gotrue_meta_security:{captcha_token:i?.captchaToken},code_challenge:a,code_challenge_method:o},redirectTo:i?.emailRedirectTo});return s&&await uc(this.storage,`${this.storageKey}-code-verifier`),this._returnResult({data:{user:null,session:null},error:s})}else if(`phone`in e){let{phone:n,type:r,options:i}=e,{data:a,error:o}=await B(this.fetch,`POST`,t,{headers:this.headers,body:{phone:n,type:r,gotrue_meta_security:{captcha_token:i?.captchaToken}}});return this._returnResult({data:{user:null,session:null,messageId:a?.message_id},error:o})}throw new js(`You must provide either an email or phone number and a type`)}catch(e){if(await uc(this.storage,`${this.storageKey}-code-verifier`),z(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async getSession(){return await this.initializePromise,this.lock==null?await this._useSession(async e=>e):await this._acquireLock(this.lockAcquireTimeout,async()=>this._useSession(async e=>e))}async _acquireLock(e,t){this._debug(`#_acquireLock`,`begin`,e);try{if(this.lockAcquired){let e=this.pendingInLock.length?this.pendingInLock[this.pendingInLock.length-1]:Promise.resolve(),n=(async()=>(await e,await t()))();return this.pendingInLock.push((async()=>{try{await n}catch{}})()),n}return await this.lock(`lock:${this.storageKey}`,e,async()=>{this._debug(`#_acquireLock`,`lock acquired for storage key`,this.storageKey);try{this.lockAcquired=!0;let e=t();for(this.pendingInLock.push((async()=>{try{await e}catch{}})()),await e;this.pendingInLock.length;){let e=[...this.pendingInLock];await Promise.all(e),this.pendingInLock.splice(0,e.length)}return await e}finally{this._debug(`#_acquireLock`,`lock released for storage key`,this.storageKey),this.lockAcquired=!1}})}finally{this._debug(`#_acquireLock`,`end`)}}async _useSession(e){this._debug(`#_useSession`,`begin`);try{return await e(await this.__loadSession())}finally{this._debug(`#_useSession`,`end`)}}async __loadSession(){this._debug(`#__loadSession()`,`begin`),this.lock!=null&&!this.lockAcquired&&this._debug(`#__loadSession()`,`used outside of an acquired lock!`,Error().stack);try{let e=null,t=await lc(this.storage,this.storageKey);if(this._debug(`#getSession()`,`session from storage`,t),t!==null&&(this._isValidSession(t)?e=t:(this._debug(`#getSession()`,`session from storage is not valid`),await this._removeSession())),!e)return{data:{session:null},error:null};let n=e.expires_at?e.expires_at*1e3-Date.now()<hs:!1;if(this._debug(`#__loadSession()`,`session has${n?``:` not`} expired`,`expires_at`,e.expires_at),!n){if(this.userStorage){let t=await lc(this.userStorage,this.storageKey+`-user`);t?.user?e.user=t.user:e.user=Dc()}if(this.storage.isServer&&e.user&&!e.user.__isUserNotAvailableProxy){let t={value:this.suppressGetSessionWarning};e.user=Oc(e.user,t),t.value&&(this.suppressGetSessionWarning=!0)}return{data:{session:e},error:null}}let{data:r,error:i}=await this._callRefreshToken(e.refresh_token);if(i){if(e.expires_at&&e.expires_at*1e3>Date.now()){let t=await lc(this.storage,this.storageKey);if(t&&t.refresh_token===e.refresh_token)return this._returnResult({data:{session:e},error:null})}return this._returnResult({data:{session:null},error:i})}return this._returnResult({data:{session:r},error:null})}finally{this._debug(`#__loadSession()`,`end`)}}async getUser(e){if(e)return await this._getUser(e);await this.initializePromise;let t;return t=this.lock==null?await this._getUser():await this._acquireLock(this.lockAcquireTimeout,async()=>await this._getUser()),t.data.user&&(this.suppressGetSessionWarning=!0),t}async _getUser(e){try{return e?await B(this.fetch,`GET`,`${this.url}/user`,{headers:this.headers,jwt:e,xform:Lc}):await this._useSession(async e=>{let{data:t,error:n}=e;if(n)throw n;return!t.session?.access_token&&!this.hasCustomAuthorizationHeader?{data:{user:null},error:new Os}:await B(this.fetch,`GET`,`${this.url}/user`,{headers:this.headers,jwt:t.session?.access_token??void 0,xform:Lc})})}catch(e){if(z(e))return ks(e)&&(await this._removeSession(),await uc(this.storage,`${this.storageKey}-code-verifier`)),this._returnResult({data:{user:null},error:e});throw e}}async updateUser(e,t={}){return await this.initializePromise,this.lock==null?await this._updateUser(e,t):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._updateUser(e,t))}async _updateUser(e,t={}){try{return await this._useSession(async n=>{let{data:r,error:i}=n;if(i)throw i;if(!r.session)throw new Os;let a=r.session,o=null,s=null;this.flowType===`pkce`&&e.email!=null&&([o,s]=await yc(this.storage,this.storageKey));let{data:c,error:l}=await B(this.fetch,`PUT`,`${this.url}/user`,{headers:this.headers,redirectTo:t?.emailRedirectTo,body:Object.assign(Object.assign({},e),{code_challenge:o,code_challenge_method:s}),jwt:a.access_token,xform:Lc});if(l)throw l;return a.user=c.user,await this._saveSession(a),await this._notifyAllSubscribers(`USER_UPDATED`,a),this._returnResult({data:{user:a.user},error:null})})}catch(e){if(await uc(this.storage,`${this.storageKey}-code-verifier`),z(e))return this._returnResult({data:{user:null},error:e});throw e}}async setSession(e){return await this.initializePromise,this.lock==null?await this._setSession(e):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._setSession(e))}async _setSession(e){try{if(!e.access_token||!e.refresh_token)throw new Os;let t=Date.now()/1e3,n=t,r=!0,i=null,{payload:a}=fc(e.access_token);if(a.exp&&(n=a.exp,r=n<=t),r){let{data:t,error:n}=await this._callRefreshToken(e.refresh_token);if(n)return this._returnResult({data:{user:null,session:null},error:n});if(!t)return{data:{user:null,session:null},error:null};i=t}else{let{data:r,error:a}=await this._getUser(e.access_token);if(a)return this._returnResult({data:{user:null,session:null},error:a});i={access_token:e.access_token,refresh_token:e.refresh_token,user:r.user,token_type:`bearer`,expires_in:n-t,expires_at:n},await this._saveSession(i),await this._notifyAllSubscribers(`SIGNED_IN`,i)}return this._returnResult({data:{user:i.user,session:i},error:null})}catch(e){if(z(e))return this._returnResult({data:{session:null,user:null},error:e});throw e}}async refreshSession(e){return await this.initializePromise,this.lock==null?await this._refreshSession(e):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._refreshSession(e))}async _refreshSession(e){try{return await this._useSession(async t=>{if(!e){let{data:n,error:r}=t;if(r)throw r;e=n.session??void 0}if(!e?.refresh_token)throw new Os;let{data:n,error:r}=await this._callRefreshToken(e.refresh_token);return r?this._returnResult({data:{user:null,session:null},error:r}):n?this._returnResult({data:{user:n.user,session:n},error:null}):this._returnResult({data:{user:null,session:null},error:null})})}catch(e){if(z(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async _getSessionFromURL(e,t){try{if(!nc())throw new Ms(`No browser detected.`);if(e.error||e.error_description||e.error_code)throw new Ms(e.error_description||`Error in URL with unspecified error_description`,{error:e.error||`unspecified_error`,code:e.error_code||`unspecified_code`});switch(t){case`implicit`:if(this.flowType===`pkce`)throw new Ps(`Not a valid PKCE flow url.`);break;case`pkce`:if(this.flowType===`implicit`)throw new Ms(`Not a valid implicit grant flow url.`);break;default:}if(t===`pkce`){if(this._debug(`#_initialize()`,`begin`,`is PKCE flow`,!0),!e.code)throw new Ps(`No code detected.`);let{data:t,error:n}=await this._exchangeCodeForSession(e.code);if(n)throw n;let r=new URL(window.location.href);return r.searchParams.delete(`code`),window.history.replaceState(window.history.state,``,r.toString()),{data:{session:t.session,redirectType:t.redirectType??null},error:null}}let{provider_token:n,provider_refresh_token:r,access_token:i,refresh_token:a,expires_in:o,expires_at:s,token_type:c}=e;if(!i||!o||!a||!c)throw new Ms(`No session defined in URL`);let l=Math.round(Date.now()/1e3),u=parseInt(o),d=l+u;s&&(d=parseInt(s));let f=d-l;f*1e3<=3e4&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${f}s, should have been closer to ${u}s`);let p=d-u;l-p>=120?console.warn(`@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale`,p,d,l):l-p<0&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew`,p,d,l);let{data:m,error:h}=await this._getUser(i);if(h)throw h;let g={provider_token:n,provider_refresh_token:r,access_token:i,expires_in:u,expires_at:d,refresh_token:a,token_type:c,user:m.user};return window.location.hash=``,this._debug(`#_getSessionFromURL()`,`clearing window.location.hash`),this._returnResult({data:{session:g,redirectType:e.type},error:null})}catch(e){if(z(e))return this._returnResult({data:{session:null,redirectType:null},error:e});throw e}}_isImplicitGrantCallback(e){return typeof this.detectSessionInUrl==`function`?this.detectSessionInUrl(new URL(window.location.href),e):!!(e.access_token||e.error||e.error_description||e.error_code)}async _isPKCECallback(e){let t=await lc(this.storage,`${this.storageKey}-code-verifier`);return!!(e.code&&t)}async signOut(e={scope:`global`}){return await this.initializePromise,this.lock==null?await this._signOut(e):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._signOut(e))}async _signOut({scope:e}={scope:`global`}){return await this._useSession(async t=>{let{data:n,error:r}=t;if(r&&!ks(r))return this._returnResult({error:r});let i=n.session?.access_token;if(i){let{error:t}=await this.admin.signOut(i,e);if(t&&!(Ts(t)&&(t.status===404||t.status===401||t.status===403)||ks(t)))return this._returnResult({error:t})}return e!==`others`&&(await this._removeSession(),await uc(this.storage,`${this.storageKey}-code-verifier`)),this._returnResult({error:null})})}onAuthStateChange(e){let t=tc(),n={id:t,callback:e,unsubscribe:()=>{this._debug(`#unsubscribe()`,`state change callback with id removed`,t),this.stateChangeEmitters.delete(t)}};return this._debug(`#onAuthStateChange()`,`registered callback with id`,t),this.stateChangeEmitters.set(t,n),(async()=>{await this.initializePromise,this.lock==null?await this._emitInitialSession(t):await this._acquireLock(this.lockAcquireTimeout,async()=>{this._emitInitialSession(t)})})(),{data:{subscription:n}}}async _emitInitialSession(e){return await this._useSession(async t=>{try{let{data:{session:n},error:r}=t;if(r)throw r;await this.stateChangeEmitters.get(e)?.callback(`INITIAL_SESSION`,n),this._debug(`INITIAL_SESSION`,`callback id`,e,`session`,n)}catch(t){await this.stateChangeEmitters.get(e)?.callback(`INITIAL_SESSION`,null),this._debug(`INITIAL_SESSION`,`callback id`,e,`error`,t),ks(t)?console.warn(t):console.error(t)}})}async resetPasswordForEmail(e,t={}){let n=null,r=null;this.flowType===`pkce`&&([n,r]=await yc(this.storage,this.storageKey,!0));try{return await B(this.fetch,`POST`,`${this.url}/recover`,{body:{email:e,code_challenge:n,code_challenge_method:r,gotrue_meta_security:{captcha_token:t.captchaToken}},headers:this.headers,redirectTo:t.redirectTo})}catch(e){if(await uc(this.storage,`${this.storageKey}-code-verifier`),z(e))return this._returnResult({data:null,error:e});throw e}}async getUserIdentities(){try{let{data:e,error:t}=await this.getUser();if(t)throw t;return this._returnResult({data:{identities:e.user.identities??[]},error:null})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async linkIdentity(e){return`token`in e?this.linkIdentityIdToken(e):this.linkIdentityOAuth(e)}async linkIdentityOAuth(e){try{let{data:t,error:n}=await this._useSession(async t=>{let{data:n,error:r}=t;if(r)throw r;let i=await this._getUrlForProvider(`${this.url}/user/identities/authorize`,e.provider,{redirectTo:e.options?.redirectTo,scopes:e.options?.scopes,queryParams:e.options?.queryParams,skipBrowserRedirect:!0});return await B(this.fetch,`GET`,i,{headers:this.headers,jwt:n.session?.access_token??void 0})});if(n)throw n;return nc()&&!e.options?.skipBrowserRedirect&&window.location.assign(t?.url),this._returnResult({data:{provider:e.provider,url:t?.url},error:null})}catch(t){if(z(t))return this._returnResult({data:{provider:e.provider,url:null},error:t});throw t}}async linkIdentityIdToken(e){return await this._useSession(async t=>{try{let{error:n,data:{session:r}}=t;if(n)throw n;let{options:i,provider:a,token:o,access_token:s,nonce:c}=e,{data:l,error:u}=await B(this.fetch,`POST`,`${this.url}/token?grant_type=id_token`,{headers:this.headers,jwt:r?.access_token??void 0,body:{provider:a,id_token:o,access_token:s,nonce:c,link_identity:!0,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:Fc});return u?this._returnResult({data:{user:null,session:null},error:u}):!l||!l.session||!l.user?this._returnResult({data:{user:null,session:null},error:new As}):(l.session&&(await this._saveSession(l.session),await this._notifyAllSubscribers(`USER_UPDATED`,l.session)),this._returnResult({data:l,error:u}))}catch(e){if(await uc(this.storage,`${this.storageKey}-code-verifier`),z(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}})}async unlinkIdentity(e){try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)throw r;return await B(this.fetch,`DELETE`,`${this.url}/user/identities/${e.identity_id}`,{headers:this.headers,jwt:n.session?.access_token??void 0})})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async _refreshAccessToken(e){let t=`#_refreshAccessToken()`;this._debug(t,`begin`);try{let n=Date.now();return await mc(async n=>(n>0&&await pc(200*2**(n-1)),this._debug(t,`refreshing attempt`,n),await B(this.fetch,`POST`,`${this.url}/token?grant_type=refresh_token`,{body:{refresh_token:e},headers:this.headers,xform:Fc})),(e,t)=>{let r=200*2**e;return t&&Ls(t)&&Date.now()+r-n<3e4})}catch(e){if(this._debug(t,`error`,e),z(e))return this._returnResult({data:{session:null,user:null},error:e});throw e}finally{this._debug(t,`end`)}}_isValidSession(e){return typeof e==`object`&&!!e&&`access_token`in e&&`refresh_token`in e&&`expires_at`in e}async _handleProviderSignIn(e,t){let n=await this._getUrlForProvider(`${this.url}/authorize`,e,{redirectTo:t.redirectTo,scopes:t.scopes,queryParams:t.queryParams});return this._debug(`#_handleProviderSignIn()`,`provider`,e,`options`,t,`url`,n),nc()&&!t.skipBrowserRedirect&&window.location.assign(n),{data:{provider:e,url:n},error:null}}async _recoverAndRefresh(){let e=`#_recoverAndRefresh()`;this._debug(e,`begin`);try{let t=await lc(this.storage,this.storageKey);if(t&&this.userStorage){let e=await lc(this.userStorage,this.storageKey+`-user`);!this.storage.isServer&&Object.is(this.storage,this.userStorage)&&!e&&(e={user:t.user},await cc(this.userStorage,this.storageKey+`-user`,e)),t.user=e?.user??Dc()}else if(t&&!t.user&&!t.user){let e=await lc(this.storage,this.storageKey+`-user`);e&&e?.user?(t.user=e.user,await uc(this.storage,this.storageKey+`-user`),await cc(this.storage,this.storageKey,t)):t.user=Dc()}if(this._debug(e,`session from storage`,t),!this._isValidSession(t)){this._debug(e,`session is not valid`),t!==null&&await this._removeSession();return}let n=(t.expires_at??1/0)*1e3-Date.now()<hs;if(this._debug(e,`session has${n?``:` not`} expired with margin of ${hs}s`),n){if(this.autoRefreshToken&&t.refresh_token){let{error:n}=await this._callRefreshToken(t.refresh_token);n&&(zs(n)?this._debug(e,`refresh discarded by commit guard`,n):this._debug(e,`refresh failed`,n))}}else if(t.user&&t.user.__isUserNotAvailableProxy===!0)try{let{data:n,error:r}=await this._getUser(t.access_token);!r&&n?.user?(t.user=n.user,await this._saveSession(t),await this._notifyAllSubscribers(`SIGNED_IN`,t)):this._debug(e,`could not get user data, skipping SIGNED_IN notification`)}catch(t){console.error(`Error getting user data:`,t),this._debug(e,`error getting user data, skipping SIGNED_IN notification`,t)}else await this._notifyAllSubscribers(`SIGNED_IN`,t)}catch(t){this._debug(e,`error`,t),console.error(t);return}finally{this._debug(e,`end`)}}async _callRefreshToken(e){var t,n;if(!e)throw new Os;if(this.refreshingDeferred)return this.refreshingDeferred.promise;if(this.lastRefreshFailure&&this.lastRefreshFailure.refreshToken===e&&Date.now()<this.lastRefreshFailure.expiresAt)return this._debug(`#_callRefreshToken()`,`returning cached failure (cooldown active)`),this.lastRefreshFailure.result;let r=`#_callRefreshToken()`;this._debug(r,`begin`);try{this.refreshingDeferred=new dc;let t=await lc(this.storage,this.storageKey),{data:n,error:i}=await this._refreshAccessToken(e);if(i)throw i;if(!n.session)throw new Os;let a=await lc(this.storage,this.storageKey);if(t!==null&&(a===null||a.refresh_token!==t.refresh_token)){this._debug(r,`commit guard: storage changed since refresh started, discarding rotated tokens`,{startedWith:`present`,nowHolds:a?`replaced`:`cleared`});let e={data:null,error:new Rs};return this.refreshingDeferred.resolve(e),e}let o=this._sessionRemovalEpoch;if(await this._saveSession(n.session),this._sessionRemovalEpoch!==o){this._debug(r,`commit guard (post-save): _removeSession ran during _saveSession, undoing write`),await uc(this.storage,this.storageKey),this.userStorage&&await uc(this.userStorage,this.storageKey+`-user`);let e={data:null,error:new Rs};return this.refreshingDeferred.resolve(e),e}await this._notifyAllSubscribers(`TOKEN_REFRESHED`,n.session);let s={data:n.session,error:null};return this.lastRefreshFailure=null,this.refreshingDeferred.resolve(s),s}catch(i){if(this._debug(r,`error`,i),z(i)){let n={data:null,error:i};if(!Ls(i)){let e=await lc(this.storage,this.storageKey);e?.expires_at&&e.expires_at*1e3>Date.now()?this._debug(r,`proactive refresh failed, access token still valid — preserving session`):await this._removeSession()}return this.lastRefreshFailure={refreshToken:e,result:n,expiresAt:Date.now()+gs},(t=this.refreshingDeferred)==null||t.resolve(n),n}throw(n=this.refreshingDeferred)==null||n.reject(i),i}finally{this.refreshingDeferred=null,this._debug(r,`end`)}}async _notifyAllSubscribers(e,t,n=!0){let r=`#_notifyAllSubscribers(${e})`;this._debug(r,`begin`,t,`broadcast = ${n}`);try{this.broadcastChannel&&n&&this.broadcastChannel.postMessage({event:e,session:t});let r=[],i=Array.from(this.stateChangeEmitters.values()).map(async n=>{try{await n.callback(e,t)}catch(e){r.push(e)}});if(await Promise.all(i),r.length>0){for(let e=0;e<r.length;e+=1)console.error(r[e]);throw r[0]}}finally{this._debug(r,`end`)}}async _saveSession(e){this._debug(`#_saveSession()`,e),this.suppressGetSessionWarning=!0,await uc(this.storage,`${this.storageKey}-code-verifier`);let t=Object.assign({},e),n=t.user&&t.user.__isUserNotAvailableProxy===!0;if(this.userStorage){!n&&t.user&&await cc(this.userStorage,this.storageKey+`-user`,{user:t.user});let e=Object.assign({},t);delete e.user;let r=kc(e);await cc(this.storage,this.storageKey,r)}else{let e=kc(t);await cc(this.storage,this.storageKey,e)}}async _removeSession(){this._sessionRemovalEpoch+=1,this._debug(`#_removeSession()`),this.lastRefreshFailure=null,this.suppressGetSessionWarning=!1,await uc(this.storage,this.storageKey),await uc(this.storage,this.storageKey+`-code-verifier`),await uc(this.storage,this.storageKey+`-user`),this.userStorage&&await uc(this.userStorage,this.storageKey+`-user`),await this._notifyAllSubscribers(`SIGNED_OUT`,null)}_removeVisibilityChangedCallback(){this._debug(`#_removeVisibilityChangedCallback()`);let e=this.visibilityChangedCallback;this.visibilityChangedCallback=null;try{e&&nc()&&window!=null&&window.removeEventListener&&window.removeEventListener(`visibilitychange`,e)}catch(e){console.error(`removing visibilitychange callback failed`,e)}}async _startAutoRefresh(){await this._stopAutoRefresh(),this._debug(`#_startAutoRefresh()`);let e=setInterval(()=>this._autoRefreshTokenTick(),ms);this.autoRefreshTicker=e,e&&typeof e==`object`&&typeof e.unref==`function`?e.unref():typeof Deno<`u`&&typeof Deno.unrefTimer==`function`&&Deno.unrefTimer(e);let t=setTimeout(async()=>{await this.initializePromise,await this._autoRefreshTokenTick()},0);this.autoRefreshTickTimeout=t,t&&typeof t==`object`&&typeof t.unref==`function`?t.unref():typeof Deno<`u`&&typeof Deno.unrefTimer==`function`&&Deno.unrefTimer(t)}async _stopAutoRefresh(){this._debug(`#_stopAutoRefresh()`);let e=this.autoRefreshTicker;this.autoRefreshTicker=null,e&&clearInterval(e);let t=this.autoRefreshTickTimeout;this.autoRefreshTickTimeout=null,t&&clearTimeout(t)}async startAutoRefresh(){this._removeVisibilityChangedCallback(),await this._startAutoRefresh()}async stopAutoRefresh(){this._removeVisibilityChangedCallback(),await this._stopAutoRefresh()}async dispose(){var e;this._removeVisibilityChangedCallback(),await this._stopAutoRefresh(),(e=this.broadcastChannel)==null||e.close(),this.broadcastChannel=null,this.stateChangeEmitters.clear()}async _autoRefreshTokenTick(){if(this._debug(`#_autoRefreshTokenTick()`,`begin`),this.lock!=null){try{await this._acquireLock(0,async()=>{try{let e=Date.now();try{return await this._useSession(async t=>{let{data:{session:n}}=t;if(!n||!n.refresh_token||!n.expires_at){this._debug(`#_autoRefreshTokenTick()`,`no session`);return}let r=Math.floor((n.expires_at*1e3-e)/ms);this._debug(`#_autoRefreshTokenTick()`,`access token expires in ${r} ticks, a tick lasts ${ms}ms, refresh threshold is 3 ticks`),r<=3&&await this._callRefreshToken(n.refresh_token)})}catch(e){console.error(`Auto refresh tick failed with error. This is likely a transient error.`,e)}}finally{this._debug(`#_autoRefreshTokenTick()`,`end`)}})}catch(e){if(e instanceof Gc)this._debug(`auto refresh token tick lock not available`);else throw e}return}if(this.refreshingDeferred!==null){this._debug(`#_autoRefreshTokenTick()`,`refresh already in flight, skipping`);return}try{let e=Date.now();try{await this._useSession(async t=>{let{data:{session:n}}=t;if(!n||!n.refresh_token||!n.expires_at){this._debug(`#_autoRefreshTokenTick()`,`no session`);return}let r=Math.floor((n.expires_at*1e3-e)/ms);this._debug(`#_autoRefreshTokenTick()`,`access token expires in ${r} ticks, a tick lasts ${ms}ms, refresh threshold is 3 ticks`),r<=3&&await this._callRefreshToken(n.refresh_token)})}catch(e){console.error(`Auto refresh tick failed with error. This is likely a transient error.`,e)}}finally{this._debug(`#_autoRefreshTokenTick()`,`end`)}}async _handleVisibilityChange(){if(this._debug(`#_handleVisibilityChange()`),!nc()||!(window!=null&&window.addEventListener))return this.autoRefreshToken&&this.startAutoRefresh(),!1;try{this.visibilityChangedCallback=async()=>{try{await this._onVisibilityChanged(!1)}catch(e){this._debug(`#visibilityChangedCallback`,`error`,e)}},window==null||window.addEventListener(`visibilitychange`,this.visibilityChangedCallback),await this._onVisibilityChanged(!0)}catch(e){console.error(`_handleVisibilityChange`,e)}}async _onVisibilityChanged(e){let t=`#_onVisibilityChanged(${e})`;if(this._debug(t,`visibilityState`,document.visibilityState),document.visibilityState===`visible`){if(this.autoRefreshToken&&this._startAutoRefresh(),!e)if(await this.initializePromise,this.lock!=null)await this._acquireLock(this.lockAcquireTimeout,async()=>{if(document.visibilityState!==`visible`){this._debug(t,`acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting`);return}await this._recoverAndRefresh()});else{if(document.visibilityState!==`visible`){this._debug(t,`visibilityState is no longer visible, skipping recovery`);return}await this._recoverAndRefresh()}}else document.visibilityState===`hidden`&&this.autoRefreshToken&&this._stopAutoRefresh()}async _getUrlForProvider(e,t,n){let r=[`provider=${encodeURIComponent(t)}`];if(n?.redirectTo&&r.push(`redirect_to=${encodeURIComponent(n.redirectTo)}`),n?.scopes&&r.push(`scopes=${encodeURIComponent(n.scopes)}`),this.flowType===`pkce`){let[e,t]=await yc(this.storage,this.storageKey),n=new URLSearchParams({code_challenge:`${encodeURIComponent(e)}`,code_challenge_method:`${encodeURIComponent(t)}`});r.push(n.toString())}if(n?.queryParams){let e=new URLSearchParams(n.queryParams);r.push(e.toString())}return n?.skipBrowserRedirect&&r.push(`skip_http_redirect=${n.skipBrowserRedirect}`),`${e}?${r.join(`&`)}`}async _unenroll(e){try{return await this._useSession(async t=>{let{data:n,error:r}=t;return r?this._returnResult({data:null,error:r}):await B(this.fetch,`DELETE`,`${this.url}/factors/${e.factorId}`,{headers:this.headers,jwt:n?.session?.access_token})})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async _enroll(e){try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let i=Object.assign({friendly_name:e.friendlyName,factor_type:e.factorType},e.factorType===`phone`?{phone:e.phone}:e.factorType===`totp`?{issuer:e.issuer}:{}),{data:a,error:o}=await B(this.fetch,`POST`,`${this.url}/factors`,{body:i,headers:this.headers,jwt:n?.session?.access_token});return o?this._returnResult({data:null,error:o}):(e.factorType===`totp`&&a.type===`totp`&&a?.totp?.qr_code&&(a.totp.qr_code=`data:image/svg+xml;utf-8,${a.totp.qr_code}`),this._returnResult({data:a,error:null}))})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async _verify(e){let t=async()=>{try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let i=Object.assign({challenge_id:e.challengeId},`webauthn`in e?{webauthn:Object.assign(Object.assign({},e.webauthn),{credential_response:e.webauthn.type===`create`?il(e.webauthn.credential_response):al(e.webauthn.credential_response)})}:{code:e.code}),{data:a,error:o}=await B(this.fetch,`POST`,`${this.url}/factors/${e.factorId}/verify`,{body:i,headers:this.headers,jwt:n?.session?.access_token});return o?this._returnResult({data:null,error:o}):(await this._saveSession(Object.assign({expires_at:Math.round(Date.now()/1e3)+a.expires_in},a)),await this._notifyAllSubscribers(`MFA_CHALLENGE_VERIFIED`,a),this._returnResult({data:a,error:o}))})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}};return this.lock==null?t():this._acquireLock(this.lockAcquireTimeout,t)}async _challenge(e){let t=async()=>{try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let i=await B(this.fetch,`POST`,`${this.url}/factors/${e.factorId}/challenge`,{body:e,headers:this.headers,jwt:n?.session?.access_token});if(i.error)return i;let{data:a}=i;if(a.type!==`webauthn`)return{data:a,error:null};switch(a.webauthn.type){case`create`:return{data:Object.assign(Object.assign({},a),{webauthn:Object.assign(Object.assign({},a.webauthn),{credential_options:Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:nl(a.webauthn.credential_options.publicKey)})})}),error:null};case`request`:return{data:Object.assign(Object.assign({},a),{webauthn:Object.assign(Object.assign({},a.webauthn),{credential_options:Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:rl(a.webauthn.credential_options.publicKey)})})}),error:null}}})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}};return this.lock==null?t():this._acquireLock(this.lockAcquireTimeout,t)}async _challengeAndVerify(e){let{data:t,error:n}=await this._challenge({factorId:e.factorId});return n?this._returnResult({data:null,error:n}):await this._verify({factorId:e.factorId,challengeId:t.id,code:e.code})}async _listFactors(){let{data:{user:e},error:t}=await this.getUser();if(t)return{data:null,error:t};let n={all:[],phone:[],totp:[],webauthn:[]};for(let t of e?.factors??[])n.all.push(t),t.status===`verified`&&n[t.factor_type].push(t);return{data:n,error:null}}async _getAuthenticatorAssuranceLevel(e){if(e)try{let{payload:t}=fc(e),n=null;t.aal&&(n=t.aal);let r=n,{data:{user:i},error:a}=await this.getUser(e);if(a)return this._returnResult({data:null,error:a});((i?.factors)?.filter(e=>e.status===`verified`)??[]).length>0&&(r=`aal2`);let o=t.amr||[];return{data:{currentLevel:n,nextLevel:r,currentAuthenticationMethods:o},error:null}}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}let{data:{session:t},error:n}=await this.getSession();if(n)return this._returnResult({data:null,error:n});if(!t)return{data:{currentLevel:null,nextLevel:null,currentAuthenticationMethods:[]},error:null};let{payload:r}=fc(t.access_token),i=null;r.aal&&(i=r.aal);let a=i;(t.user.factors?.filter(e=>e.status===`verified`)??[]).length>0&&(a=`aal2`);let o=r.amr||[];return{data:{currentLevel:i,nextLevel:a,currentAuthenticationMethods:o},error:null}}async _getAuthorizationDetails(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;return r?this._returnResult({data:null,error:r}):n?await B(this.fetch,`GET`,`${this.url}/oauth/authorizations/${e}`,{headers:this.headers,jwt:n.access_token,xform:e=>({data:e,error:null})}):this._returnResult({data:null,error:new Os})})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async _approveAuthorization(e,t){try{return await this._useSession(async n=>{let{data:{session:r},error:i}=n;if(i)return this._returnResult({data:null,error:i});if(!r)return this._returnResult({data:null,error:new Os});let a=await B(this.fetch,`POST`,`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:r.access_token,body:{action:`approve`},xform:e=>({data:e,error:null})});return a.data&&a.data.redirect_url&&nc()&&!t?.skipBrowserRedirect&&window.location.assign(a.data.redirect_url),a})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async _denyAuthorization(e,t){try{return await this._useSession(async n=>{let{data:{session:r},error:i}=n;if(i)return this._returnResult({data:null,error:i});if(!r)return this._returnResult({data:null,error:new Os});let a=await B(this.fetch,`POST`,`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:r.access_token,body:{action:`deny`},xform:e=>({data:e,error:null})});return a.data&&a.data.redirect_url&&nc()&&!t?.skipBrowserRedirect&&window.location.assign(a.data.redirect_url),a})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async _listOAuthGrants(){try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;return n?this._returnResult({data:null,error:n}):t?await B(this.fetch,`GET`,`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:t.access_token,xform:e=>({data:e,error:null})}):this._returnResult({data:null,error:new Os})})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async _revokeOAuthGrant(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;return r?this._returnResult({data:null,error:r}):n?(await B(this.fetch,`DELETE`,`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:n.access_token,query:{client_id:e.clientId},noResolveJson:!0}),{data:{},error:null}):this._returnResult({data:null,error:new Os})})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async fetchJwk(e,t={keys:[]}){let n=t.keys.find(t=>t.kid===e);if(n)return n;let r=Date.now();if(n=this.jwks.keys.find(t=>t.kid===e),n&&this.jwks_cached_at+6e5>r)return n;let{data:i,error:a}=await B(this.fetch,`GET`,`${this.url}/.well-known/jwks.json`,{headers:this.headers});if(a)throw a;return!i.keys||i.keys.length===0||(this.jwks=i,this.jwks_cached_at=r,n=i.keys.find(t=>t.kid===e),!n)?null:n}async getClaims(e,t={}){try{let n=e;if(!n){let{data:e,error:t}=await this.getSession();if(t||!e.session)return this._returnResult({data:null,error:t});n=e.session.access_token}let{header:r,payload:i,signature:a,raw:{header:o,payload:s}}=fc(n);if(!t?.allowExpired)try{Sc(i.exp)}catch(e){throw new Vs(e instanceof Error?e.message:`JWT validation failed`)}let c=!r.alg||r.alg.startsWith(`HS`)||!r.kid||!(`crypto`in globalThis&&`subtle`in globalThis.crypto)?null:await this.fetchJwk(r.kid,t?.keys?{keys:t.keys}:t?.jwks);if(!c){let{error:e}=await this.getUser(n);if(e)throw e;return{data:{claims:i,header:r,signature:a},error:null}}let l=Cc(r.alg),u=await crypto.subtle.importKey(`jwk`,c,l,!0,[`verify`]);if(!await crypto.subtle.verify(l,u,a,Qs(`${o}.${s}`)))throw new Vs(`Invalid JWT signature`);return{data:{claims:i,header:r,signature:a},error:null}}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async signInWithPasskey(e){Ec(this.experimental);try{if(!sl())return this._returnResult({data:null,error:new Es(`Browser does not support WebAuthn`,null)});let{data:t,error:n}=await this._startPasskeyAuthentication({options:{captchaToken:e?.options?.captchaToken}});if(n||!t)return this._returnResult({data:null,error:n});let{data:r,error:i}=await ll({publicKey:rl(t.options),signal:e?.options?.signal??tl.createNewAbortSignal()});if(i||!r)return this._returnResult({data:null,error:i??new Es(`WebAuthn ceremony failed`,null)});let a=al(r);return this._verifyPasskeyAuthentication({challengeId:t.challenge_id,credential:a})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async registerPasskey(e){Ec(this.experimental);try{if(!sl())return this._returnResult({data:null,error:new Es(`Browser does not support WebAuthn`,null)});let{data:t,error:n}=await this._startPasskeyRegistration();if(n||!t)return this._returnResult({data:null,error:n});let{data:r,error:i}=await cl({publicKey:nl(t.options),signal:e?.options?.signal??tl.createNewAbortSignal()});if(i||!r)return this._returnResult({data:null,error:i??new Es(`WebAuthn ceremony failed`,null)});let a=il(r);return this._verifyPasskeyRegistration({challengeId:t.challenge_id,credential:a})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async _startPasskeyRegistration(){Ec(this.experimental);try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;if(n)return this._returnResult({data:null,error:n});if(!t)return this._returnResult({data:null,error:new Os});let{data:r,error:i}=await B(this.fetch,`POST`,`${this.url}/passkeys/registration/options`,{headers:this.headers,jwt:t.access_token,body:{}});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async _verifyPasskeyRegistration(e){Ec(this.experimental);try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!n)return this._returnResult({data:null,error:new Os});let{data:i,error:a}=await B(this.fetch,`POST`,`${this.url}/passkeys/registration/verify`,{headers:this.headers,jwt:n.access_token,body:{challenge_id:e.challengeId,credential:e.credential}});return a?this._returnResult({data:null,error:a}):this._returnResult({data:i,error:null})})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async _startPasskeyAuthentication(e){Ec(this.experimental);try{let{data:t,error:n}=await B(this.fetch,`POST`,`${this.url}/passkeys/authentication/options`,{headers:this.headers,body:{gotrue_meta_security:{captcha_token:e?.options?.captchaToken}}});return n?this._returnResult({data:null,error:n}):this._returnResult({data:t,error:null})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async _verifyPasskeyAuthentication(e){Ec(this.experimental);try{let{data:t,error:n}=await B(this.fetch,`POST`,`${this.url}/passkeys/authentication/verify`,{headers:this.headers,body:{challenge_id:e.challengeId,credential:e.credential},xform:Fc});return n?this._returnResult({data:null,error:n}):(t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers(`SIGNED_IN`,t.session)),this._returnResult({data:t,error:null}))}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async _listPasskeys(){Ec(this.experimental);try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;if(n)return this._returnResult({data:null,error:n});if(!t)return this._returnResult({data:null,error:new Os});let{data:r,error:i}=await B(this.fetch,`GET`,`${this.url}/passkeys`,{headers:this.headers,jwt:t.access_token,xform:e=>({data:e,error:null})});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async _updatePasskey(e){Ec(this.experimental);try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!n)return this._returnResult({data:null,error:new Os});let{data:i,error:a}=await B(this.fetch,`PATCH`,`${this.url}/passkeys/${e.passkeyId}`,{headers:this.headers,jwt:n.access_token,body:{friendly_name:e.friendlyName}});return a?this._returnResult({data:null,error:a}):this._returnResult({data:i,error:null})})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}async _deletePasskey(e){Ec(this.experimental);try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!n)return this._returnResult({data:null,error:new Os});let{error:i}=await B(this.fetch,`DELETE`,`${this.url}/passkeys/${e.passkeyId}`,{headers:this.headers,jwt:n.access_token,noResolveJson:!0});return i?this._returnResult({data:null,error:i}):this._returnResult({data:null,error:null})})}catch(e){if(z(e))return this._returnResult({data:null,error:e});throw e}}};vl.nextInstanceID={};var yl=vl,bl=`modulepreload`,xl=function(e){return`/alimenta-obra/`+e},Sl={},Cl=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=xl(t,n),t in Sl)return;Sl[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:bl,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},wl=`2.108.2`,Tl=``,El;typeof Deno<`u`?(Tl=`deno`,El=Deno.version?.deno):typeof document<`u`?Tl=`web`:typeof navigator<`u`&&navigator.product===`ReactNative`?Tl=`react-native`:(Tl=`node`,El=typeof process<`u`?process.version?.replace(/^v/,``):void 0);var Dl=[`runtime=${Tl}`];El&&Dl.push(`runtime-version=${El}`);var Ol={headers:{"X-Client-Info":`supabase-js/${wl}; ${Dl.join(`; `)}`}},kl={schema:`public`},Al={autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,flowType:`implicit`},jl={},Ml={enabled:!1,respectSamplingDecision:!0};function Nl(e,t,n,r){function i(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||=Promise)(function(n,a){function o(e){try{c(r.next(e))}catch(e){a(e)}}function s(e){try{c(r.throw(e))}catch(e){a(e)}}function c(e){e.done?n(e.value):i(e.value).then(o,s)}c((r=r.apply(e,t||[])).next())})}var Pl=null,Fl=`@opentelemetry/api`;function Il(){return Pl===null&&(Pl=Cl(()=>import(Fl),[]).catch(()=>null)),Pl}function Ll(){return Nl(this,void 0,void 0,function*(){try{let e=yield Il();if(!e||!e.propagation||!e.context)return null;let t={};e.propagation.inject(e.context.active(),t);let n=t.traceparent;return n?{traceparent:n,tracestate:t.tracestate,baggage:t.baggage}:null}catch{return null}})}function Rl(e){if(!e||typeof e!=`string`)return null;let t=e.split(`-`);if(t.length!==4)return null;let[n,r,i,a]=t;if(n.length!==2||r.length!==32||i.length!==16||a.length!==2)return null;let o=/^[0-9a-f]+$/i;return!o.test(n)||!o.test(r)||!o.test(i)||!o.test(a)||r===`00000000000000000000000000000000`||i===`0000000000000000`?null:{version:n,traceId:r,parentId:i,traceFlags:a,isSampled:(parseInt(a,16)&1)==1}}function zl(e,t){if(!e||!t||t.length===0)return!1;let n;if(e instanceof URL)n=e;else try{n=new URL(e)}catch{return!1}for(let e of t)try{if(typeof e==`string`){if(Bl(n.hostname,e))return!0}else if(e instanceof RegExp){if(e.test(n.hostname))return!0}else if(typeof e==`function`&&e(n))return!0}catch{continue}return!1}function Bl(e,t){if(t===e)return!0;if(t.startsWith(`*.`)){let n=t.slice(2);if(e.endsWith(n)&&(e===n||e.endsWith(`.`+n)))return!0}return!1}function Vl(e){let t=[];try{let n=new URL(e);t.push(n.hostname)}catch{}return t.push(`*.supabase.co`,`*.supabase.in`),t.push(`localhost`,`127.0.0.1`,`[::1]`),t}function Hl(e){"@babel/helpers - typeof";return Hl=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},Hl(e)}function Ul(e,t){if(Hl(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(Hl(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function V(e){var t=Ul(e,`string`);return Hl(t)==`symbol`?t:t+``}function Wl(e,t,n){return(t=V(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function H(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function U(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?H(Object(n),!0).forEach(function(t){Wl(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):H(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var W=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),Gl=()=>Headers,Kl=(e,t,n,r,i)=>{let a=W(r),o=Gl(),s=i?.enabled===!0,c=i?.respectSamplingDecision!==!1,l=s?Vl(t):null;return async(t,r)=>{let i=await n()??e,s=new o(r?.headers);if(s.has(`apikey`)||s.set(`apikey`,e),s.has(`Authorization`)||s.set(`Authorization`,`Bearer ${i}`),l){let e=await ql(t,l,c);e&&(e.traceparent&&!s.has(`traceparent`)&&s.set(`traceparent`,e.traceparent),e.tracestate&&!s.has(`tracestate`)&&s.set(`tracestate`,e.tracestate),e.baggage&&!s.has(`baggage`)&&s.set(`baggage`,e.baggage))}return a(t,U(U({},r),{},{headers:s}))}};async function ql(e,t,n){if(!zl(typeof e==`string`||e instanceof URL?e:e.url,t))return null;let r=await Ll();if(!r||!r.traceparent)return null;if(n){let e=Rl(r.traceparent);if(e&&!e.isSampled)return null}return r}function Jl(e){return typeof e==`boolean`?{enabled:e}:e}function Yl(e){return e.endsWith(`/`)?e:e+`/`}function Xl(e,t){let{db:n,auth:r,realtime:i,global:a}=e,{db:o,auth:s,realtime:c,global:l}=t,u=Jl(e.tracePropagation),d=Jl(t.tracePropagation),f={db:U(U({},o),n),auth:U(U({},s),r),realtime:U(U({},c),i),storage:{},global:U(U(U({},l),a),{},{headers:U(U({},l?.headers??{}),a?.headers??{})}),tracePropagation:{enabled:u?.enabled??d?.enabled??!1,respectSamplingDecision:u?.respectSamplingDecision??d?.respectSamplingDecision??!0},accessToken:async()=>``};return e.accessToken?f.accessToken=e.accessToken:delete f.accessToken,f}function Zl(e){let t=e?.trim();if(!t)throw Error(`supabaseUrl is required.`);if(!t.match(/^https?:\/\//i))throw Error(`Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.`);try{return new URL(Yl(t))}catch{throw Error(`Invalid supabaseUrl: Provided URL is malformed.`)}}var Ql=class extends yl{constructor(e){super(e)}},$l=class{constructor(e,t,n){this.supabaseUrl=e,this.supabaseKey=t;let r=Zl(e);if(!t)throw Error(`supabaseKey is required.`);this.realtimeUrl=new URL(`realtime/v1`,r),this.realtimeUrl.protocol=this.realtimeUrl.protocol.replace(`http`,`ws`),this.authUrl=new URL(`auth/v1`,r),this.storageUrl=new URL(`storage/v1`,r),this.functionsUrl=new URL(`functions/v1`,r);let i=`sb-${r.hostname.split(`.`)[0]}-auth-token`,a={db:kl,realtime:jl,auth:U(U({},Al),{},{storageKey:i}),global:Ol,tracePropagation:Ml},o=Xl(n??{},a);this.settings=o,this.storageKey=o.auth.storageKey??``,this.headers=o.global.headers??{},o.accessToken?(this.accessToken=o.accessToken,this.auth=new Proxy({},{get:(e,t)=>{throw Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(t)} is not possible`)}})):this.auth=this._initSupabaseAuthClient(o.auth??{},this.headers,o.global.fetch),this.fetch=Kl(t,e,this._getAccessToken.bind(this),o.global.fetch,o.tracePropagation),this.realtime=this._initRealtimeClient(U({headers:this.headers,accessToken:this._getAccessToken.bind(this),fetch:this.fetch},o.realtime)),this.accessToken&&Promise.resolve(this.accessToken()).then(e=>this.realtime.setAuth(e)).catch(e=>console.warn(`Failed to set initial Realtime auth token:`,e)),this.rest=new ra(new URL(`rest/v1`,r).href,{headers:this.headers,schema:o.db.schema,fetch:this.fetch,timeout:o.db.timeout,urlLengthLimit:o.db.urlLengthLimit}),this.storage=new fs(this.storageUrl.href,this.headers,this.fetch,n?.storage),o.accessToken||this._listenForAuthEvents()}get functions(){return new F(this.functionsUrl.href,{headers:this.headers,customFetch:this.fetch})}from(e){return this.rest.from(e)}schema(e){return this.rest.schema(e)}rpc(e,t={},n={head:!1,get:!1,count:void 0}){return this.rest.rpc(e,t,n)}channel(e,t={config:{}}){return this.realtime.channel(e,t)}getChannels(){return this.realtime.getChannels()}removeChannel(e){return this.realtime.removeChannel(e)}removeAllChannels(){return this.realtime.removeAllChannels()}async _getAccessToken(){var e=this;if(e.accessToken)return await e.accessToken();let{data:t}=await e.auth.getSession();return t.session?.access_token??e.supabaseKey}_initSupabaseAuthClient({autoRefreshToken:e,persistSession:t,detectSessionInUrl:n,storage:r,userStorage:i,storageKey:a,flowType:o,lock:s,debug:c,throwOnError:l,experimental:u,lockAcquireTimeout:d,skipAutoInitialize:f},p,m){let h={Authorization:`Bearer ${this.supabaseKey}`,apikey:`${this.supabaseKey}`};return new Ql({url:this.authUrl.href,headers:U(U({},h),p),storageKey:a,autoRefreshToken:e,persistSession:t,detectSessionInUrl:n,storage:r,userStorage:i,flowType:o,lock:s,debug:c,throwOnError:l,experimental:u,fetch:m,lockAcquireTimeout:d,skipAutoInitialize:f,hasCustomAuthorizationHeader:Object.keys(this.headers).some(e=>e.toLowerCase()===`authorization`)})}_initRealtimeClient(e){return new mo(this.realtimeUrl.href,U(U({},e),{},{params:U(U({},{apikey:this.supabaseKey}),e?.params)}))}_listenForAuthEvents(){return this.auth.onAuthStateChange((e,t)=>{this._handleTokenChanged(e,`CLIENT`,t?.access_token)})}_handleTokenChanged(e,t,n){(e===`TOKEN_REFRESHED`||e===`SIGNED_IN`)&&this.changedAccessToken!==n?(this.changedAccessToken=n,this.realtime.setAuth(n)):e===`SIGNED_OUT`&&(this.realtime.setAuth(),t==`STORAGE`&&this.auth.signOut(),this.changedAccessToken=void 0)}},eu=(e,t,n)=>new $l(e,t,n);function tu(){if(typeof window<`u`)return!1;let e=globalThis.process;if(!e)return!1;let t=e.version;if(t==null)return!1;let n=t.match(/^v(\d+)\./);return n?parseInt(n[1],10)<=18:!1}tu()&&console.warn(`⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217`);var nu=`https://nahretmwgwuqjhhqwjpd.supabase.co`,ru=`sb_publishable_BSJvqj2wFE5v7lEFLTgCiQ_pTkHnNIN`,iu=!!ru,au=iu?eu(nu,ru,{auth:{persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}}):null;function G(){if(!au)throw Error(`Supabase não configurado. Copie .env.example para .env.local e informe a URL e a chave publicável.`);return au}function K(e,t){if(t)throw t.code===`42703`&&String(t.message).includes(`profiles.name`)?Error(`O Supabase configurado não possui o banco do AlimentaObra. Verifique se o .env.local aponta para o projeto correto e execute a migração inicial.`):t.code===`42P01`||t.code===`PGRST205`?Error(`As tabelas do AlimentaObra ainda não existem neste Supabase. Execute a migração inicial no SQL Editor.`):t;return e}function ou(e){return[`42P01`,`PGRST200`,`PGRST205`].includes(e?.code)||String(e?.message??``).includes(`delivery_addresses`)}function su(e){return[`42703`,`42P01`,`PGRST200`,`PGRST202`,`PGRST205`].includes(e?.code)||String(e?.message??``).includes(`work_sections`)||String(e?.message??``).includes(`consolidation_actuals`)||String(e?.message??``).includes(`daily_reports`)||String(e?.message??``).includes(`team_id`)||String(e?.message??``).includes(`unit_price`)}function cu(e){let t=String(e?.message??``);return e?.code===`23505`||t.includes(`delivery_addresses_leader_id_label_key`)?`Ja existe um endereco com esse nome para este encarregado.`:[`PGRST202`,`42883`].includes(e?.code)||t.includes(`create_delivery_address_as_user`)?`A função de cadastro de endereço ainda não foi aplicada no Supabase. Execute as migrações.`:t.includes(`Sessao expirada`)?`Sessão expirada. Entre novamente.`:t.includes(`Apenas administradores`)?`Apenas administradores podem cadastrar endereco para outro usuario.`:t.includes(`Encarregado invalido`)?`Encarregado invalido ou inativo.`:t.includes(`perfil nao pode`)?`Seu perfil não pode cadastrar endereços.`:t.includes(`row-level security`)?`Seu usuário não tem permissão para salvar este endereço.`:t||`Falha ao salvar endereco.`}function lu(e){let t=String(e?.message??``),n=String(e?.code??e?.status??``),r=t.toLowerCase();return r.includes(`jwt`)||r.includes(`session`)||r.includes(`not authenticated`)?`Sessão expirada. Entre novamente antes de alterar a senha.`:n===`same_password`||r.includes(`same password`)||r.includes(`different from the old password`)?`A nova senha precisa ser diferente da senha atual.`:n===`weak_password`||n===`422`||r.includes(`password`)&&(r.includes(`weak`)||r.includes(`short`)||r.includes(`least`))?`A senha precisa ter pelo menos 8 caracteres e atender a politica de seguranca do Supabase.`:r.includes(`rate limit`)||r.includes(`too many`)?`Muitas tentativas. Aguarde um pouco e tente novamente.`:t||`Falha ao alterar senha.`}function uu(e,t=!0){return e.from(`meal_requests`).select(`
      id, meal_date, meal_type_id, location_id, team_id, ${t?`delivery_address_id,`:``} leader_id, quantity,
      status, notes, created_at, updated_at,
      meal_types(id, name, description, unit_price),
      meal_locations!meal_requests_location_id_fkey(id, name),
      work_sections(id, name, headcount)
      ${t?`, delivery_addresses(id, label, address_line)`:``}
    `).order(`meal_date`,{ascending:!1}).order(`created_at`,{ascending:!1})}function du(e,t=!0){return e.from(`meal_requests`).select(`
      id, meal_date, meal_type_id, location_id, ${t?`delivery_address_id,`:``} leader_id, quantity,
      status, notes, created_at, updated_at,
      meal_types(id, name, description),
      meal_locations!meal_requests_location_id_fkey(id, name)
      ${t?`, delivery_addresses(id, label, address_line)`:``}
    `).order(`meal_date`,{ascending:!1}).order(`created_at`,{ascending:!1})}async function fu(e){let t=await uu(e,!0);if(!t.error)return t;if(su(t.error)){let t=await du(e,!0);return!t.error||!ou(t.error)?t:du(e,!1)}if(!ou(t.error))return t;let n=await uu(e,!1);return!n.error||!su(n.error)?n:du(e,!1)}async function pu(){let{error:e}=await G().from(`meal_types`).select(`id`).limit(1);if(e)throw e.code===`42P01`||e.code===`PGRST205`?Error(`Este Supabase não possui o banco do AlimentaObra. Use um projeto separado e execute a migração inicial.`):e}async function mu(){let{data:e,error:t}=await G().auth.getSession();return K(e?.session??null,t)}async function hu(){let{data:e,error:t}=await G().auth.getUser();return K(e?.user??null,t)}async function gu(e,t){let{data:n,error:r}=await G().auth.signInWithPassword({email:e,password:t});return K(n,r)}async function _u({email:e,password:t,name:n,team:r,inviteToken:i=``}){let a=String(e).normalize(`NFKC`).replace(/[\s\u200B-\u200D\uFEFF]/g,``).replace(/[^\x21-\x7E]/g,``).toLowerCase(),o={name:n,team:r};i&&(o.invite_token=i);let{data:s,error:c}=await G().auth.signUp({email:a,password:t,options:{data:o}});return K(s,c)}async function vu(){let{error:e}=await G().auth.signOut();K(null,e)}async function yu({name:e,team:t}){let{data:n,error:r}=await G().rpc(`update_current_profile`,{p_name:String(e).trim(),p_team:String(t??``).trim()});return K(n,r)}async function bu(e,t=null){let n=await mu();if(!n)throw Error(`Sessão expirada. Entre novamente antes de alterar a senha.`);if(t&&t!==n.user.id){let{error:n}=await G().rpc(`admin_update_user_password_v2`,{p_user_id:String(t),p_password:e});if(n)throw Error(lu(n));return null}let{data:r,error:i}=await G().auth.updateUser({password:e});if(i)throw Error(lu(i));return r}async function xu(e){let{data:t,error:n}=await G().from(`profiles`).select(`id, name, email, role, team, active`).eq(`id`,e).single();return K(t,n)}async function Su(){let e=G(),t=e.from(`delivery_addresses`).select(`id, leader_id, label, address_line, reference, active, created_at`).order(`label`),n=e.from(`consolidation_documents`).select(`id, consolidation_id, document_type, storage_path, original_name, mime_type, size_bytes, uploaded_by, created_at`).order(`created_at`,{ascending:!1}),r=e.from(`work_sections`).select(`id, name, headcount, leader_id, active, created_at, updated_at`).order(`name`),i=e.from(`consolidation_actuals`).select(`id, consolidation_id, meal_date, team_id, meal_type_id, quantity, notes, recorded_by, recorded_at`).order(`meal_date`,{ascending:!1}),a=e.from(`daily_reports`).select(`id, report_date, status, totals, snapshot, generated_at, generated_by`).order(`report_date`,{ascending:!1}).limit(90),[o,s,c,l,u,d,f,p,m,h,g]=await Promise.all([e.from(`profiles`).select(`id, name, email, role, team, active`).order(`name`),e.from(`meal_types`).select(`id, name, description, unit_price, active, sort_order, meal_locations(id, name, active, sort_order)`).order(`sort_order`),e.from(`app_settings`).select(`*`).eq(`id`,!0).single(),fu(e),e.from(`consolidations`).select(`
        id, meal_date, supplier_id, status, sent_at, created_by, created_at, updated_at,
        consolidation_items(meal_request_id),
        supplier_confirmations(step, confirmed_by, confirmed_at, metadata),
        consolidation_revisions(id, edited_by, edited_at, reason, snapshot)
      `).order(`meal_date`,{ascending:!1}),e.from(`audit_log`).select(`id, actor_id, action, entity, entity_id, payload, created_at`).order(`created_at`,{ascending:!1}).limit(200),n,t,r,i,a]),_=f.error&&[`42P01`,`PGRST205`].includes(f.error.code)?[]:K(f.data,f.error),v=!p.error,y=p.error&&ou(p.error)?[]:K(p.data,p.error),b=m.error&&su(m.error)?[]:K(m.data,m.error),x=h.error&&su(h.error)?[]:K(h.data,h.error),S=g.error&&su(g.error)?[]:K(g.data,g.error);return{profiles:K(o.data,o.error),catalog:K(s.data,s.error),settings:K(c.data,c.error),requests:K(l.data,l.error),consolidations:K(u.data,u.error),audit:K(d.data,d.error),documents:_,addresses:y,addressFeatureAvailable:v,workSections:b,actuals:x,reports:S}}async function Cu(e,t){let n={p_leader_id:t,p_meal_date:e.date,p_meal_type_id:e.mealTypeId,p_location_id:e.locationId||null,p_team_id:e.teamId||null,p_quantity:Number(e.quantity),p_status:e.status,p_notes:e.notes},{data:r,error:i}=await G().rpc(`create_meal_request_as_user`,n);if(!i)return r;if(!su(i)&&!String(i?.message??``).includes(`p_team_id`))return K(r,i);let a={...n};delete a.p_team_id;let o=await G().rpc(`create_meal_request_as_user`,a);return K(o.data,o.error)}async function wu({leaderId:e,label:t,addressLine:n,reference:r=``}){let{data:i,error:a}=await G().rpc(`create_delivery_address_as_user`,{p_leader_id:e,p_label:String(t).trim(),p_address_line:String(n).trim(),p_reference:String(r).trim()});if(a)throw Error(cu(a));return i}async function Tu({id:e=null,name:t,description:n=``,unitPrice:r=0,active:i=!0}){let{data:a,error:o}=await G().rpc(`upsert_meal_type_catalog`,{p_id:e,p_name:String(t).trim(),p_description:String(n??``).trim(),p_unit_price:Number(r??0),p_active:!!i});if(!o)return a;if(!su(o)&&!String(o?.message??``).includes(`p_unit_price`))return K(a,o);let s=await G().rpc(`upsert_meal_type_catalog`,{p_id:e,p_name:String(t).trim(),p_description:String(n??``).trim(),p_active:!!i});return K(s.data,s.error)}async function Eu({id:e=null,name:t,headcount:n=0,leaderId:r=null,active:i=!0}){let{data:a,error:o}=await G().rpc(`upsert_work_section`,{p_id:e,p_name:String(t).trim(),p_headcount:Number(n??0),p_leader_id:r||null,p_active:!!i});return K(a,o)}async function Du(e){let{data:t,error:n}=await G().rpc(`update_default_meal_unit_price`,{p_unit_price:Number(e)});return K(t,n)}async function Ou({token:e,role:t,email:n=``,team:r=``,expiresInDays:i=7}){let{data:a,error:o}=await G().rpc(`create_access_invite`,{p_token:e,p_role:t,p_email:String(n??``).trim()||null,p_team:String(r??``).trim()||null,p_expires_in_days:Number(i)});return K(a,o)}async function ku(e,t){let{error:n}=await G().rpc(`change_request_status`,{p_request_id:e,p_status:t});K(null,n)}async function Au(e,t){let n={meal_date:t.date,meal_type_id:t.mealTypeId,location_id:t.locationId||null,team_id:t.teamId||null,quantity:Number(t.quantity),notes:String(t.notes??``)},r=await G().from(`meal_requests`).update(n).eq(`id`,e).select(`id`).single();if(!r.error)return r.data;if(!su(r.error))return K(r.data,r.error);let i={...n};delete i.team_id;let a=await G().from(`meal_requests`).update(i).eq(`id`,e).select(`id`).single();return K(a.data,a.error)}async function ju(e,t){let{data:n,error:r}=await G().rpc(`send_consolidation`,{p_meal_date:e,p_supplier_id:t});return K(n,r)}async function Mu(e,t){let{error:n}=await G().rpc(`confirm_supplier_step`,{p_consolidation_id:e,p_step:t,p_metadata:{}});K(null,n)}async function Nu(e,t){let{data:n,error:r}=await G().rpc(`save_consolidation_actuals`,{p_consolidation_id:e,p_actuals:t});return K(n,r)}async function Pu(e){let{data:t,error:n}=await G().rpc(`generate_daily_report`,{p_report_date:e});return K(t,n)}async function Fu(e,t){if(!t||t.type!==`application/pdf`)throw Error(`Envie uma nota fiscal em formato PDF.`);if(t.size>10*1024*1024)throw Error(`A nota fiscal deve ter no maximo 10 MB.`);let n=G(),r=await hu();if(!r)throw Error(`Sessão expirada. Entre novamente.`);let i=t.name.replace(/[^a-zA-Z0-9._-]/g,`-`),a=`${r.id}/${e}/${crypto.randomUUID()}-${i}`,{error:o}=await n.storage.from(`supplier-documents`).upload(a,t,{contentType:`application/pdf`,upsert:!1});if(o)throw o;let{data:s,error:c}=await n.from(`consolidation_documents`).insert({consolidation_id:e,document_type:`nota_fiscal`,storage_path:a,original_name:t.name,mime_type:t.type,size_bytes:t.size,uploaded_by:r.id}).select(`id`).single();if(c)throw await n.storage.from(`supplier-documents`).remove([a]),c;return s}async function Iu(e){let{data:t,error:n}=await G().storage.from(`supplier-documents`).createSignedUrl(e,60);return K(t?.signedUrl??null,n)}async function Lu(e){let{error:t}=await G().rpc(`log_supplier_romaneio`,{p_consolidation_id:e});K(null,t)}function Ru(e){return G().channel(`alimenta-obra-live`).on(`postgres_changes`,{event:`*`,schema:`public`,table:`meal_requests`},e).on(`postgres_changes`,{event:`*`,schema:`public`,table:`consolidations`},e).on(`postgres_changes`,{event:`*`,schema:`public`,table:`supplier_confirmations`},e).on(`postgres_changes`,{event:`*`,schema:`public`,table:`consolidation_documents`},e).on(`postgres_changes`,{event:`*`,schema:`public`,table:`consolidation_actuals`},e).on(`postgres_changes`,{event:`*`,schema:`public`,table:`work_sections`},e).on(`postgres_changes`,{event:`*`,schema:`public`,table:`daily_reports`},e).on(`postgres_changes`,{event:`*`,schema:`public`,table:`meal_types`},e).on(`postgres_changes`,{event:`*`,schema:`public`,table:`app_settings`},e).subscribe()}async function zu(e){e&&await G().removeChannel(e)}var Bu=d(),q={...u(),activeView:Bu.activeView??`inicio`},Vu=null,Hu=!1,Uu=!1,Wu=null,Gu=null,Ku=null,qu=``,J=null,Ju=null,Yu=0,Xu=``,Zu={range:`all`,start:``,end:``},Qu=``;function $u(e=new Date){let t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?``:new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function ed(e=$u()){let t=new Date(`${e}T12:00:00`);return t.setDate(t.getDate()-1),t.toISOString().slice(0,10)}function td(){return q.settings.defaultMealDate||$u()}function nd(e){if(!e||String(e)<td())throw Error(`Não é permitido criar ou alterar pedido para data passada.`)}var Y=document.querySelector(`#app-root`),rd=document.querySelector(`#toast-root`),id=new URLSearchParams(window.location.search).get(`invite`)??``,ad=`/alimenta-obra/assets/logo-alimentaobra.png`,od=`fixed inset-0 z-50 grid place-items-end bg-stone-950/50 p-0 backdrop-blur-sm sm:place-items-center sm:p-4`,sd=`max-h-[92vh] w-full max-w-2xl overflow-auto rounded-t-3xl border border-white/70 bg-white p-4 shadow-2xl sm:rounded-3xl sm:p-5 [&_header]:mb-4 [&_header]:flex [&_header]:items-start [&_header]:justify-between [&_header]:gap-3 [&_header]:border-b [&_header]:border-stone-100 [&_header]:pb-3 [&_.eyebrow]:text-[10px] [&_.eyebrow]:font-black [&_.eyebrow]:uppercase [&_.eyebrow]:tracking-[.12em] [&_.eyebrow]:text-orange-700 [&_h2]:m-0 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:leading-none [&_p]:m-0 [&_p]:text-sm [&_p]:text-stone-500 [&_.modal-close]:grid [&_.modal-close]:h-9 [&_.modal-close]:w-9 [&_.modal-close]:place-items-center [&_.modal-close]:rounded-full [&_.modal-close]:border [&_.modal-close]:border-stone-200 [&_.modal-close]:bg-white [&_.modal-close]:text-xl [&_.modal-close]:font-black [&_.modal-close]:text-stone-500 [&_.admin-request-detail-card]:grid [&_.admin-request-detail-card]:gap-3 [&_.admin-request-detail-hero]:grid [&_.admin-request-detail-hero]:grid-cols-[48px_minmax(0,1fr)] [&_.admin-request-detail-hero]:gap-3 [&_.admin-request-detail-hero]:rounded-2xl [&_.admin-request-detail-hero]:border [&_.admin-request-detail-hero]:border-stone-200 [&_.admin-request-detail-hero]:bg-stone-50 [&_.admin-request-detail-hero]:p-3 [&_.request-meal-icon]:grid [&_.request-meal-icon]:h-12 [&_.request-meal-icon]:w-12 [&_.request-meal-icon]:place-items-center [&_.request-meal-icon]:rounded-xl [&_.request-meal-icon]:bg-orange-50 [&_.request-meal-icon]:text-orange-700 [&_.badge]:inline-flex [&_.badge]:min-h-7 [&_.badge]:items-center [&_.badge]:rounded-full [&_.badge]:border [&_.badge]:border-stone-200 [&_.badge]:bg-white [&_.badge]:px-2.5 [&_.badge]:text-[11px] [&_.badge]:font-black [&_.badge]:uppercase [&_.badge]:text-stone-600 [&_.admin-request-detail-grid]:grid [&_.admin-request-detail-grid]:gap-2 sm:[&_.admin-request-detail-grid]:grid-cols-2 [&_.admin-request-detail-grid>div]:rounded-xl [&_.admin-request-detail-grid>div]:border [&_.admin-request-detail-grid>div]:border-stone-200 [&_.admin-request-detail-grid>div]:bg-white [&_.admin-request-detail-grid>div]:p-3 [&_.admin-request-detail-grid_span]:text-[10px] [&_.admin-request-detail-grid_span]:font-black [&_.admin-request-detail-grid_span]:uppercase [&_.admin-request-detail-grid_span]:text-stone-500 [&_.admin-request-detail-grid_strong]:block [&_.admin-request-notes]:rounded-xl [&_.admin-request-notes]:border [&_.admin-request-notes]:border-stone-200 [&_.admin-request-notes]:bg-white [&_.admin-request-notes]:p-3 [&_.admin-request-notes_span]:text-[10px] [&_.admin-request-notes_span]:font-black [&_.admin-request-notes_span]:uppercase [&_.admin-request-notes_span]:text-stone-500 [&_footer]:mt-4 [&_footer]:flex [&_footer]:justify-end [&_footer]:gap-2 [&_footer]:border-t [&_footer]:border-stone-100 [&_footer]:pt-3 [&_.btn]:inline-flex [&_.btn]:min-h-10 [&_.btn]:items-center [&_.btn]:justify-center [&_.btn]:gap-2 [&_.btn]:rounded-lg [&_.btn]:border [&_.btn]:px-4 [&_.btn]:text-sm [&_.btn]:font-extrabold [&_.btn.primary]:border-orange-600 [&_.btn.primary]:bg-orange-600 [&_.btn.primary]:text-white [&_.btn.outline]:border-stone-300 [&_.btn.outline]:bg-white [&_.btn.outline]:text-stone-900`,cd=`mb-4 flex items-start justify-between gap-3 border-b border-stone-100 pb-3`,ld=`m-0 text-2xl font-black leading-none tracking-normal text-stone-950`,ud=`text-[10px] font-black uppercase tracking-[.12em] text-orange-700`,dd=`grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-white text-xl font-black text-stone-500`,fd=`grid gap-1.5`,pd=`text-[10px] font-black uppercase tracking-[.08em] text-stone-500`,md=`min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-100`,hd=`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-orange-600 bg-orange-600 px-4 text-sm font-extrabold text-white`,gd=`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 text-sm font-extrabold text-stone-900`,_d=`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-extrabold text-red-700`,vd=id?`register`:`login`,yd=``,bd=`todos`,xd=``,X=null,Sd=null,{consolidationValue:Cd,mealById:wd,pendingSyncText:Td,requestMealDescription:Ed,requestUnitPrice:Dd,requestValue:Od}=Wt({getState:()=>q,getConsolidationSummary:S}),{renderCompactHeader:kd,renderEmptyState:Ad,renderExportMenu:jd,topbar:Md}=Ut({getActiveView:()=>q.activeView,getExportMenuOpen:()=>Ku,viewLabel:te});function Nd(e){f(q),$(),e&&Z(e)}function Z(e){let t=document.createElement(`div`);t.className=`toast`,t.textContent=e,rd.appendChild(t),setTimeout(()=>t.remove(),3400)}function Q(){let e=document.querySelector(`[data-filter-date]`)?.value;return q.activeView===`pedidos`?e??Xu:e||q.settings.defaultMealDate}function Pd(e){Gu=null,Ku=null,q.activeView=e,e!==`painel`&&(Yu=0),Nd()}function $(){let e={date:q.activeView===`pedidos`?Xu:Q(),leader:document.querySelector(`[data-filter-leader]`)?.value??``,meal:document.querySelector(`[data-filter-meal]`)?.value??``};if(Ir(Y),Xr(Y),wi(Y),q.loading){Y.innerHTML=`<section class="grid min-h-screen place-content-center justify-items-center gap-4 bg-[#1b1c1a] p-6 text-white" aria-live="polite"><img class="h-24 w-auto max-w-[360px] object-contain brightness-110" src="${ad}" alt="AlimentaObra" /><div class="h-1 w-40 overflow-hidden rounded-full bg-white/15" aria-hidden="true"><i class="block h-full w-1/2 animate-pulse rounded-full bg-orange-600"></i></div><p class="m-0 text-xs font-black uppercase tracking-[.08em] text-white/60">Preparando sua operação</p></section>`;return}let t=p(q);if(!t){Fd();return}let n=t.role===`fornecedor`?[`fornecedor-documentos`,`fornecedor-financeiro`]:t.role===`admin`?[`financeiro`,`relatorios`,`auditoria`]:[],r=[...C[t.role].map(([e])=>e),...n,`configuracoes`];t.role===`admin`&&q.activeView===`consolidacao`&&(q.activeView=`pedidos`),t.role===`fornecedor`&&q.activeView===`fornecedor-historico`&&(q.activeView=`fornecedor-pedidos`),r.includes(q.activeView)||(q.activeView=r[0],f(q)),Y.innerHTML=Pt({accessSwitcher:zd(t),activeView:q.activeView,adminRequestDetailModal:af(),content:Vd(t),editRequestModal:Ud(),initials:Xt,operationModal:Gd(),renderNav:Id,roleName:Yt,user:t,workspaceIntro:Hd(t)}),Zr(Y,{STATUS_LABEL:w,canEditRequest:y,countStatus:qt,formatDate:M,formatDateTime:Ft,getLeaderAddressFormOpen:()=>Uu,icon:j,page:q.activeView,requestMealDescription:Ed,state:q,sumQty:Kt,user:t}),Lr(Y,{STATUS_LABEL:w,adminConsumptionWeekOffset:Yu,adminFilters:e,canEditRequest:y,consolidationValue:Cd,countStatus:qt,exportMenuOpen:Ku,formatDate:M,formatDateTime:Ft,getConsolidationForDate:x,getConsolidationSummary:S,icon:j,money:It,page:q.activeView,requestMealDescription:Ed,requestValue:Od,reportFilter:Zu,reportPeriodLabel:$d(),reportRows:Qd(),state:q,sumQty:Kt,totalsByMeal:Gt,user:t}),Ti(Y,{STATUS_LABEL:w,consolidationValue:Cd,formatDate:M,formatDateTime:Ft,getConsolidationSummary:S,icon:j,money:It,nextSupplierStep:Jt,page:q.activeView,requestMealDescription:Ed,requestValue:Od,selectedSupplierConsolidationId:X,state:q,sumQty:Kt,supplierOrderDate:xd,supplierOrderStatus:bd,user:t}),Mf()}function Fd(){Y.innerHTML=Bt({initialInviteToken:id,isSupabaseConfigured:iu,loginMode:vd,loginError:yd}),Mf()}function Id(e){let t=[`financeiro`,`relatorios`,`auditoria`,`configuracoes`],n=[`fornecedor-mais`,`fornecedor-documentos`,`fornecedor-financeiro`,`configuracoes`];return C[e.role].map(([r,i,a])=>{let o=q.activeView===r||r===`mais`&&t.includes(q.activeView)||r===`fornecedor-mais`&&n.includes(q.activeView);return`
    <button class="group relative grid min-w-0 flex-1 place-items-center gap-0.5 rounded-[16px] border border-white/10 !bg-[#242622] px-1 py-1 text-center text-[8px] font-black leading-tight text-white/65 transition hover:!bg-[#2f312d] hover:text-white md:flex md:min-h-11 md:w-full md:flex-none md:justify-start md:gap-3 md:rounded-r-2xl md:rounded-l-md md:px-2.5 md:text-left md:text-sm ${e.role===`admin`&&r===`mais`?`md:hidden`:e.role===`admin`&&t.includes(r)?`hidden md:flex`:e.role===`fornecedor`&&r===`fornecedor-mais`?`md:hidden`:e.role===`fornecedor`&&[`fornecedor-documentos`,`fornecedor-financeiro`].includes(r)?`hidden md:flex`:``} ${o?`active !border-orange-500 !bg-orange-600 !text-white shadow-[0_10px_18px_rgba(239,91,29,.25)] md:shadow-[inset_4px_0_0_rgba(249,115,22,.95)]`:``}" data-view="${r}">
      <span class="grid h-7 w-7 place-items-center rounded-[12px] bg-white/10 text-white/75 transition group-hover:bg-orange-500/15 group-hover:text-orange-100 md:h-8 md:w-8 md:rounded-r-xl md:rounded-l-md ${o?`!bg-white/18 !text-white`:``}">${j(i,17)}</span>
      <span class="max-w-full truncate">${a}</span>
    </button>`}).join(``)}function Ld(){return p(q)?.role===`admin`?`<button class="admin-back-button" data-view="mais" aria-label="Voltar para mais ferramentas">${j(`arrow-left`,15)}<span>Voltar</span></button>`:``}function Rd(){return p(q)?.role===`fornecedor`?`<button class="admin-back-button supplier-back-button" data-view="fornecedor-mais" aria-label="Voltar para mais">${j(`arrow-left`,15)}<span>Voltar</span></button>`:``}function zd(e){let t=q.users.find(e=>e.id===q.authenticatedUserId);if(t?.role!==`admin`)return``;let n=e.id!==t.id,r=q.users.filter(e=>e.active!==!1).sort((e,t)=>e.role===`admin`&&t.role!==`admin`?-1:e.role!==`admin`&&t.role===`admin`?1:e.name.localeCompare(t.name,`pt-BR`)).map(t=>`
      <option value="${t.id}" ${t.id===e.id?`selected`:``}>
        ${t.name} - ${Yt(t.role)}
      </option>`).join(``);return`
    <section class="mb-3 grid gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto] ${n?`is-representing`:``}">
      <div>
        <span class="text-[10px] font-black uppercase tracking-[.12em] text-orange-700">${n?`Modo de acesso ativo`:`Acesso administrativo`}</span>
        <strong class="block text-base font-black">${n?`Voce esta acessando como ${e.name}`:`Escolha qual usuario deseja acessar`}</strong>
        <small class="text-xs font-semibold text-stone-500">A identidade autenticada continua sendo ${t.name}; todas as ações permanecem rastreáveis.</small>
      </div>
      <div class="grid gap-2 sm:grid-cols-[minmax(180px,1fr)_auto] sm:items-end">
        <label class="grid gap-1 text-[10px] font-black uppercase tracking-[.08em] text-stone-500" for="access-user">Usuário<select class="min-h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-stone-950" id="access-user" data-access-user>${r}</select></label>
        ${n?`<button class="inline-flex min-h-10 items-center justify-center rounded-lg border border-stone-300 bg-white px-3 text-xs font-extrabold text-stone-900" type="button" data-action="return-admin">Voltar ao administrador</button>`:``}
      </div>
    </section>`}var Bd=Ai({leader:{canEditRequest:y,countStatus:qt,escapeHtml:Lt,formatDate:M,formatDateTime:Ft,getLeaderAddressFormOpen:()=>Uu,getState:()=>q,icon:j,locationOptions:fp,renderEmptyState:Ad,renderRequestTable:Of,requestMealDescription:Ed,STATUS_LABEL:w,sumQty:Kt,topbar:Md},settings:{escapeHtml:Lt,getGeneratedInviteLink:()=>qu,getState:()=>q,icon:j,money:It,renderAdminBackButton:Ld,renderEmptyState:Ad,roleName:Yt},renderAdminMore:lf,renderAuditoria:Df,renderConsolidacao:uf,renderFinanceiro:Kd,renderFornecedor:gf,renderPainel:qd,renderPedidosAdmin:of,renderRelatorios:Ef,renderSupplierDocuments:Tf,renderSupplierHistory:wf,renderSupplierOrders:bf});function Vd(e){return(Bd[q.activeView]??Bd.pedido)(e)}function Hd(e){return``}function Ud(){let e=q.requests.find(e=>e.id===Wu);if(!e)return``;let t=v(q,e.leaderId),n=q.mealTypes.find(t=>t.id===e.mealTypeId)??q.mealTypes[0],r=e.locationId||n?.locations?.[0]?.id||``,i=t.length?t.map(t=>`<option value="${t.id}" ${t.id===e.teamId?`selected`:``}>${Lt(t.name)} - efetivo ${Number(t.headcount??0)}</option>`).join(``):`<option value="">Nenhuma equipe ativa</option>`;return`<div class="${od}" data-close-edit-modal><section class="${sd}" role="dialog" aria-modal="true" aria-labelledby="edit-request-title" onclick="event.stopPropagation()"><header class="${cd}"><div><span class="${ud}">Edicao de pedido</span><h2 class="${ld}" id="edit-request-title">Atualizar solicitacao</h2><p class="mt-1 text-sm text-stone-500">Permitido somente antes da confirmacao do fornecedor.</p></div><button class="${dd}" type="button" data-close-edit-modal aria-label="Fechar">x</button></header><form class="grid gap-3" data-form="edit-request"><input type="hidden" id="edit-request-location" name="locationId" value="${r}" /><div class="grid gap-3 sm:grid-cols-2"><div class="${fd}"><label class="${pd}" for="edit-request-date">Data da refeicao</label><input class="${md}" id="edit-request-date" name="date" type="date" min="${td()}" value="${e.date}" required /></div><div class="${fd}"><label class="${pd}" for="edit-request-quantity">Quantidade</label><input class="${md}" id="edit-request-quantity" name="quantity" type="number" min="1" value="${e.quantity}" required /></div></div><div class="grid gap-3 sm:grid-cols-2"><div class="${fd}"><label class="${pd}" for="edit-request-meal">Tipo de refeicao</label><select class="${md}" id="edit-request-meal" name="mealTypeId">${q.mealTypes.map(t=>`<option value="${t.id}" ${t.id===e.mealTypeId?`selected`:``}>${Lt(t.label)}</option>`).join(``)}</select></div><div class="${fd}"><label class="${pd}" for="edit-request-team">Equipe / trecho</label><select class="${md}" id="edit-request-team" name="teamId" required>${i}</select></div></div><div class="${fd}"><label class="${pd}" for="edit-request-notes">Observacao</label><textarea class="${md} min-h-24 py-2" id="edit-request-notes" name="notes">${Lt(e.notes)}</textarea></div><footer class="flex justify-end gap-2 border-t border-stone-100 pt-3"><button class="${gd}" type="button" data-close-edit-modal>Cancelar</button><button class="${hd}" type="submit" ${t.length?``:`disabled`}>Salvar alteracoes</button></footer></form></section></div>`}function Wd(){let e=q.consolidations.find(e=>e.id===Sd);if(!e)return``;let t=S(q,e),n=new Map;t.rows.forEach(e=>{let t=`${e.teamId||e.sectionName||e.leaderId}:${e.mealTypeId}`,r=n.get(t)??{teamId:e.teamId||``,teamName:e.sectionName||e.location||m(q,e.leaderId),mealTypeId:e.mealTypeId,mealType:e.mealType,requested:0,actual:0,headcount:e.sectionHeadcount??0};r.requested+=Number(e.quantity??0),r.actual+=Number(e.actualQuantity??e.quantity??0),n.set(t,r)});let r=Array.from(n.values());return`<div class="${od}" data-close-actuals-modal><section class="${sd}" role="dialog" aria-modal="true" aria-labelledby="actuals-title" onclick="event.stopPropagation()"><header class="${cd}"><div><span class="${ud}">Consumo real</span><h2 class="${ld}" id="actuals-title">Registrar saida do bloco</h2><p class="mt-1 text-sm text-stone-500">Informe o consumido por equipe/trecho e alimentacao antes de concluir a saida.</p></div><button class="${dd}" type="button" data-close-actuals-modal aria-label="Fechar">x</button></header><form class="grid gap-3" data-form="actuals"><input type="hidden" name="consolidationId" value="${e.id}" /><div class="grid gap-2">${r.map((e,t)=>`<div class="grid gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_110px] sm:items-end"><input type="hidden" name="teamId-${t}" value="${e.teamId}" /><input type="hidden" name="mealTypeId-${t}" value="${e.mealTypeId}" /><div><span class="${pd}">Equipe / trecho</span><strong class="block text-sm">${Lt(e.teamName)}</strong><small class="text-xs font-bold text-stone-500">Solicitado ${e.requested} - efetivo ${e.headcount||`-`}</small></div><div><span class="${pd}">Alimentacao</span><strong class="block text-sm">${Lt(e.mealType)}</strong></div><div class="${fd}"><label class="${pd}" for="actual-${t}">Consumido</label><input class="${md}" id="actual-${t}" name="quantity-${t}" type="number" min="0" value="${e.actual}" required /></div></div>`).join(``)}</div><footer class="flex justify-end gap-2 border-t border-stone-100 pt-3"><button class="${gd}" type="button" data-close-actuals-modal>Cancelar</button><button class="${hd}" type="submit">Salvar e registrar saida</button></footer></form></section></div>`}function Gd(){let e=Wd();if(e)return e;let t=q.requests.find(e=>e.id===J);return t?`<div class="${od}"><section class="w-full max-w-md rounded-t-3xl border border-white/70 bg-white p-5 text-center shadow-2xl sm:rounded-3xl"><span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-700">${j(`trash`,23)}</span><span class="${ud} mt-3 block">Confirmar cancelamento</span><h2 class="${ld} mt-1">Cancelar este pedido?</h2><p class="mt-2 text-sm text-stone-500">O pedido de ${t.quantity} refeições para ${M(t.date)} será cancelado e não entrará no envio ao fornecedor.</p><div class="mt-4 grid grid-cols-2 gap-2"><button class="${gd}" data-dismiss-operation>Voltar</button><button class="${_d}" data-confirm-cancel="${t.id}">Cancelar pedido</button></div></section></div>`:Ju?`<div class="${od}"><section class="w-full max-w-md rounded-t-3xl border border-white/70 bg-white p-5 text-center shadow-2xl sm:rounded-3xl"><span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-orange-50 text-orange-700">${j(`clipboard`,23)}</span><span class="${ud} mt-3 block">Operacao registrada</span><h2 class="${ld} mt-1">${Ju.title}</h2><p class="mt-2 text-sm text-stone-500">${Ju.message}</p><button class="${hd} mt-4 w-full" data-dismiss-operation>Continuar</button></section></div>`:``}function Kd(e){let t=e===`fornecedor`,n=t?df().flatMap(e=>S(q,e).rows):q.requests.filter(e=>e.status!==`cancelado`),r=q.settings.defaultMealDate.slice(0,7),i=n.filter(e=>e.date.startsWith(r)),a=i.filter(e=>e.status===`entregue`),o=i.reduce((e,t)=>e+Od(t),0),s=a.reduce((e,t)=>e+Od(t),0),c=o-s,l=q.mealTypes.map(e=>({label:e.label,value:i.filter(t=>t.mealTypeId===e.id).reduce((e,t)=>e+Od(t),0)})).filter(e=>e.value>0),u=Math.max(...l.map(e=>e.value),1),d=Array.from({length:7},(e,t)=>{let r=new Date(`${q.settings.defaultMealDate}T12:00:00`);r.setDate(r.getDate()-(6-t));let i=r.toISOString().slice(0,10);return{key:i,label:String(r.getDate()).padStart(2,`0`),value:n.filter(e=>e.date===i).reduce((e,t)=>e+Od(t),0)}}),f=Math.max(...d.map(e=>e.value),1);return`<section class="finance-page">${Md(t?`Financeiro do fornecedor`:`Financeiro administrativo`,`Análise de ${r}`,`${t?Rd():Ld()}<button class="btn primary" data-export-finance="${e}">Gerar PDF</button>`)}<div class="finance-metrics"><article class="finance-metric accent"><span>${t?`Faturamento previsto`:`Custo previsto`}</span><strong>${It(o)}</strong><small>${Kt(i)} refeições no mês</small></article><article class="finance-metric"><span>${t?`Faturado`:`Pago/entregue`}</span><strong>${It(s)}</strong><small>${a.length} pedidos entregues</small></article><article class="finance-metric"><span>Em aberto</span><strong>${It(c)}</strong><small>pedidos ainda em operação</small></article><article class="finance-metric"><span>Ticket médio</span><strong>${It(i.length?o/Kt(i):0)}</strong><small>por refeicao</small></article></div><div class="finance-grid"><article class="finance-card"><h2>Composição por refeição</h2>${l.map(e=>`<div class="finance-progress"><div><span>${e.label}</span><strong>${It(e.value)}</strong></div><i><b style="width:${Math.max(3,Math.round(e.value/u*100))}%"></b></i></div>`).join(``)||`<div class="empty">Sem movimentação no período.</div>`}</article><article class="finance-card"><h2>Evolução dos últimos 7 dias</h2><div class="finance-bars">${d.map(e=>`<div><strong>${e.value?It(e.value).replace(`R$`,``):`-`}</strong><i style="height:${Math.max(5,Math.round(e.value/f*126))}px"></i><span>${e.label}</span></div>`).join(``)}</div></article></div><article class="finance-card finance-table-card"><h2>Movimentações do período</h2><div class="table-wrap"><table><thead><tr><th>Data</th><th>Tipo</th><th>Quantidade</th><th>Valor</th><th>Status</th></tr></thead><tbody>${i.sort((e,t)=>t.date.localeCompare(e.date)).map(e=>`<tr><td>${M(e.date)}</td><td>${e.mealType}</td><td>${e.quantity}</td><td><strong>${It(Od(e))}</strong></td><td><span class="badge ${e.status}">${w[e.status]}</span></td></tr>`).join(``)}</tbody></table></div></article></section>`}function qd(){let e=Q(),t=b(q,e),n=qt(t,`enviado`),r=qt(t,`entregue`),i=t.reduce((e,t)=>e+Od(t),0);return`
    <section class="admin-home">
      <header class="admin-home-hero">
        <div>
          <span class="compact-kicker">Home</span>
          <h1>Resumo de ${M(e)}</h1>
          <p>${n} pedido${n===1?``:`s`} recebido${n===1?``:`s`} para envio ao fornecedor.</p>
        </div>
        <button class="btn primary" data-view="pedidos">${j(`truck`,16)}Enviar pedido</button>
      </header>
      <section class="admin-stats">
        <div class="stats-grid admin-metrics-grid admin-home-metrics">
          <div class="stat-card accent"><div class="stat-label">Total</div><div class="stat-value">${Kt(t)}</div><div class="stat-sub">refeições</div></div>
          <div class="stat-card"><div class="stat-label">A enviar</div><div class="stat-value">${n}</div><div class="stat-sub">aguardando</div></div>
          <div class="stat-card"><div class="stat-label">Entregas</div><div class="stat-value">${r}</div><div class="stat-sub">realizadas</div></div>
          <div class="stat-card"><div class="stat-label">Custo</div><div class="stat-value">${It(i)}</div><div class="stat-sub">estimado</div></div>
        </div>
      </section>
      ${tf(t)}
    </section>
    <div class="report-grid">
      <div class="insight-panel">
        ${Jd(e)}
      </div>
    </div>`}function Jd(e){let t=Yd(e,Yu),n=Array.from({length:7},(e,n)=>{let r=new Date(t);r.setDate(t.getDate()+n);let i=r.toISOString().slice(0,10),a=q.requests.filter(e=>e.date===i&&e.status!==`cancelado`);return{date:r,key:i,label:new Intl.DateTimeFormat(`pt-BR`,{weekday:`short`}).format(r).replace(`.`,``),total:Kt(a),value:a.reduce((e,t)=>e+Od(t),0),waiting:qt(a,`enviado`),delivered:qt(a,`entregue`)}}),r=Math.max(...n.map(e=>e.total),1),i=n.reduce((e,t)=>e+t.total,0),a=n.reduce((e,t)=>e+t.value,0),o=new Date().toISOString().slice(0,10);return`
    <div class="weekly-consumption-card">
      <div class="weekly-consumption-head">
        <div>
          <h2 class="section-title">Consumo semanal</h2>
          <p>${`${M(n[0].key)} a ${M(n[6].key)}`}</p>
        </div>
        <div class="week-nav" aria-label="Navegar semanas">
          <button class="icon-action" type="button" data-week-nav="-1" aria-label="Semana anterior">${j(`arrow`,14)}</button>
          <button class="btn outline small" type="button" data-week-nav="0">Semana atual</button>
          <button class="icon-action next" type="button" data-week-nav="1" aria-label="Próxima semana">${j(`arrow`,14)}</button>
        </div>
      </div>
      <div class="weekly-consumption-summary">
        <span><strong>${i}</strong> refeições</span>
        <span><strong>${It(a)}</strong> custo previsto</span>
      </div>
      <div class="weekly-chart" role="list" aria-label="Consumo semanal por dia">
        ${n.map(e=>`
          <button class="weekly-bar ${e.key===o?`today`:``}" type="button" role="listitem" data-filter-date-set="${e.key}" aria-label="${e.label}, ${e.total} refeições">
            <span class="weekly-bar-value">${e.total||`-`}</span>
            <i style="height:${Math.max(8,Math.round(e.total/r*150))}px"></i>
            <span class="weekly-bar-label">${e.label}</span>
            <small>${e.date.getDate().toString().padStart(2,`0`)}</small>
            <b class="weekly-tooltip">${M(e.key)}<br>${e.total} refeições<br>${e.waiting} a enviar · ${e.delivered} entregues</b>
          </button>`).join(``)}
      </div>
    </div>`}function Yd(e,t=0){let n=new Date(`${e}T12:00:00`),r=n.getDay(),i=r===0?-6:1-r;return n.setDate(n.getDate()+i+t*7),n.setHours(12,0,0,0),n}function Xd(e){return e.toISOString().slice(0,10)}function Zd(e=Zu){let t=e.start||q.settings.defaultMealDate;if(e.range===`all`)return{range:`all`,start:``,end:``};if(e.range===`day`)return{range:`day`,start:t,end:t};if(e.range===`week`){let e=Yd(t),n=new Date(e);return n.setDate(e.getDate()+6),{range:`week`,start:Xd(e),end:Xd(n)}}if(e.range===`month`){let[e,n]=t.split(`-`).map(Number),r=new Date(e,n-1,1,12),i=new Date(e,n,0,12);return{range:`month`,start:Xd(r),end:Xd(i)}}let n=e.start||q.settings.defaultMealDate,r=e.end||n;return n<=r?{range:`custom`,start:n,end:r}:{range:`custom`,start:r,end:n}}function Qd(){let e=Zd(Zu);return q.requests.filter(e=>e.status!==`cancelado`).filter(t=>e.range===`all`||t.date>=e.start&&t.date<=e.end)}function $d(){let e=Zd(Zu);return e.range===`all`?`Todo período`:e.start===e.end?M(e.start):`${M(e.start)} a ${M(e.end)}`}function ef(e){return{pedido:`Pedido de refeição`,meal_request:`Pedido de refeição`,tipo_alimentacao:`Tipo de alimentação`,meal_type:`Tipo de alimentação`,consolidacao:`Envio ao fornecedor`,consolidation:`Envio ao fornecedor`,fornecedor:`Fornecedor`,supplier:`Fornecedor`,usuario:`Usuário`,user:`Usuário`,seed:`Carga inicial`}[e]??String(e??`Registro`).replaceAll(`_`,` `)}function tf(e){let t=e.filter(e=>e.status!==`cancelado`).sort((e,t)=>new Date(t.updatedAt)-new Date(e.updatedAt)),n=t.filter(e=>e.status===`enviado`),r=t.filter(e=>e.status===`rascunho`),i=t.slice(0,6),a=n[0]??r[0]??i[0];return i.length?`
    <section class="admin-live-panel">
      <div class="admin-live-heading">
        <div>
          <span class="eyebrow">Pedidos em tempo real</span>
          <h2>${n.length?`${n.length} pedido${n.length>1?`s`:``} aguardando conferencia`:`Fila operacional atualizada`}</h2>
          <p>Pedidos novos entram aqui sem precisar recarregar a pagina.</p>
        </div>
        <span class="live-pill">${j(`clock`,14)}Ao vivo</span>
      </div>
      <div class="admin-live-grid">
        ${a?nf(a):``}
        <div class="admin-live-list">
          ${i.map(rf).join(``)}
        </div>
      </div>
    </section>`:`
      <section class="admin-live-panel is-empty">
        <div class="admin-live-heading">
          <div><span class="eyebrow">Pedidos em tempo real</span><h2>Nenhum pedido chegou para esta data</h2><p>Assim que um encarregado enviar, ele aparece aqui automaticamente.</p></div>
          <span class="live-pill">${j(`clock`,14)}Ao vivo</span>
        </div>
      </section>`}function nf(e){let t=e.sectionName||`Equipe nao informada`;return`
    <article class="admin-priority-order">
      <div class="admin-priority-main">
        <span class="request-meal-icon">${j(e.mealType?.includes(`Marmita`)?`package`:`utensils`,17)}</span>
        <div>
          <span class="badge ${e.status}">${w[e.status]??e.status}</span>
          <h3>${e.mealType}</h3>
          <p>${m(q,e.leaderId)} - ${t}</p>
        </div>
        <strong>${e.quantity}<small>ref.</small></strong>
      </div>
      <div class="admin-priority-metrics legacy-hidden">
        <div><strong>${e.quantity}</strong><span>refeições</span></div>
        <div><strong>${It(Od(e))}</strong><span>valor</span></div>
        <div><strong>${M(e.date)}</strong><span>entrega</span></div>
      </div>
      <p>${m(q,e.leaderId)} · ${e.deliveryAddress||e.location}</p>
      <div class="admin-priority-actions">
        <button class="btn outline small" data-open-request="${e.id}">Abrir pedido</button>
        ${y(q,e)?`<button class="btn primary small" data-send-request-date="${e.date}">${j(`truck`,14)}Enviar</button>`:``}
        <button class="btn outline small" data-view="pedidos">Ver todos</button>
      </div>
    </article>`}function rf(e){return`
    <article class="admin-live-order">
      <button class="admin-live-order-main" data-open-request="${e.id}">
      <span class="badge ${e.status}">${w[e.status]??e.status}</span>
      <strong>${e.mealType} · ${e.quantity} refeições</strong>
      <small>${m(q,e.leaderId)} · ${e.deliveryAddress||e.location}</small>
      <b>${Ft(e.updatedAt)}</b>
      </button>
      ${y(q,e)?`<button class="icon-action admin-live-send" data-send-request-date="${e.date}" aria-label="Enviar pedido ao fornecedor">${j(`truck`,15)}Enviar</button>`:``}
    </article>`}function af(){let e=q.requests.find(e=>e.id===Gu);if(!e)return``;let t=e.sectionName||`Equipe nao informada`,n=Ed(e);return`
    <div class="${od}" data-close-request-detail>
    <section class="${sd}" role="dialog" aria-modal="true" aria-labelledby="request-detail-title" onclick="event.stopPropagation()">
      <header>
        <div>
          <span class="eyebrow">Detalhe do pedido</span>
          <h2 id="request-detail-title">${m(q,e.leaderId)}</h2>
          <p>${M(e.date)} - ${w[e.status]??e.status}</p>
        </div>
        <button class="modal-close" type="button" data-close-request-detail aria-label="Fechar">×</button>
      </header>
      <article class="admin-request-detail-card">
        <div class="admin-request-detail-hero">
          <span class="request-meal-icon">${j(e.mealType?.includes(`Marmita`)?`package`:`utensils`,22)}</span>
          <div>
            <span class="badge ${e.status}">${w[e.status]??e.status}</span>
            <h2>${e.mealType}</h2>
            <p>${e.quantity} refeições solicitadas${n?` - ${Lt(n)}`:``}</p>
          </div>
        </div>
        <div class="admin-request-detail-grid">
          <div><span>Encarregado</span><strong>${m(q,e.leaderId)}</strong></div>
          <div><span>Entrega</span><strong>${t}</strong></div>
          <div><span>Data</span><strong>${M(e.date)}</strong></div>
          <div><span>Valor estimado</span><strong>${It(Od(e))}</strong></div>
        </div>
        <div class="admin-request-notes">
          <span>Observação</span>
          <p>${e.notes||`Sem observacoes para este pedido.`}</p>
        </div>
        ${n?`<div class="admin-request-notes"><span>Composição</span><p>${Lt(n)}</p></div>`:``}
      </article>
      <footer>
        ${y(q,e)?`<button class="btn outline" data-edit-request="${e.id}">${j(`edit`,14)}Editar</button>`:``}
        ${y(q,e)?`<button class="btn primary" data-send-request-date="${e.date}">${j(`truck`,14)}Enviar pedido</button>`:``}
      </footer>
    </section>
    </div>`}function of(){let e=Q(),t=document.querySelector(`[data-filter-leader]`)?.value??``,n=document.querySelector(`[data-filter-meal]`)?.value??``,r=q.requests.filter(r=>{let i=!e||r.date===e,a=!t||r.leaderId===t,o=!n||r.mealType===n;return i&&a&&o});return`
    <header class="admin-list-header">
      <div>
        <span class="compact-kicker">Pedidos</span>
        <h1>Pedidos recebidos</h1>
      </div>
      <div class="admin-list-actions">
        <input type="date" value="${e}" data-filter-date aria-label="Filtrar por data" />
        <select data-filter-leader aria-label="Filtrar encarregado">
          <option value="">Todos</option>
          ${q.users.map(e=>`<option value="${e.id}" ${t===e.id?`selected`:``}>${e.name}</option>`).join(``)}
        </select>
        <select data-filter-meal aria-label="Filtrar refeicao">
          <option value="">Tipos</option>
          ${q.mealTypes.map(e=>`<option ${n===e.label?`selected`:``}>${e.label}</option>`).join(``)}
        </select>
        ${jd(`pedidos`,[[`pdf`,`PDF`,`clipboard`],[`xlsx`,`Excel`,`chart`]])}
      </div>
    </header>
    <div class="table-panel admin-requests-panel">
      <h2 class="section-title">Lista operacional</h2>
      ${sf(r)}
      ${r.length?Of(r,{showLeader:!0,editable:!0}):``}
    </div>`}function sf(e){return e.length?`<div class="admin-request-list">${e.map(cf).join(``)}</div>`:`<div class="admin-request-list"><div class="empty">Nenhum pedido encontrado.</div></div>`}function cf(e){let t=y(q,e);return`
    <article class="admin-request-card">
      <div class="admin-request-main">
        <span class="request-meal-icon">${j(e.mealType?.includes(`Marmita`)?`package`:`utensils`,18)}</span>
        <div>
          <div class="request-card-title"><strong>${m(q,e.leaderId)}</strong><span class="badge ${e.status}">${w[e.status]??e.status}</span></div>
          <small>${e.mealType} · ${e.deliveryAddress||e.location}</small>
        </div>
        <div class="request-card-quantity"><strong>${e.quantity}</strong><span>ref.</span></div>
      </div>
      <footer>
        <span>${M(e.date)} · ${Ft(e.updatedAt)}</span>
        <div class="request-card-actions">
          ${t?`<button class="icon-action" data-edit-request="${e.id}" aria-label="Editar pedido">${j(`edit`,15)}Editar</button><button class="icon-action danger" data-cancel-request="${e.id}" aria-label="Cancelar pedido">${j(`trash`,15)}Cancelar</button>`:`<span class="locked-label">${j(`clock`,14)}Bloqueado</span>`}
        </div>
      </footer>
    </article>`}function lf(){return`
    <section class="admin-more">
      <header class="admin-home-hero compact">
        <div>
          <span class="compact-kicker">Administração</span>
          <h1>Mais ferramentas</h1>
          <p>Acesse as áreas de consulta e ajustes sem deixar o rodapé principal carregado.</p>
        </div>
      </header>
      <div class="admin-more-grid">
        ${[[`financeiro`,`chart`,`Financeiro`],[`relatorios`,`chart`,`Relatórios`],[`auditoria`,`history`,`Auditoria`],[`configuracoes`,`settings`,`Configurações`]].map(([e,t,n])=>`
          <button class="admin-more-tile" data-view="${e}">
            <span>${j(t,24)}</span>
            <strong>${n}</strong>
          </button>`).join(``)}
      </div>
    </section>`}function uf(){let e=Q(),t=x(q,e),n=S(q,t),r=g(q),i=t.supplierId??r[0]?.id??``;return`
    <header class="admin-send-header">
      <div class="admin-send-title">
        <span class="compact-kicker">Enviar pedido</span>
        <h1>Pedido ao fornecedor</h1>
        <p>${n.total} refeições para ${M(e)}</p>
      </div>
      <div class="admin-send-actions">
        <div class="admin-send-filters">
          <input type="date" value="${e}" data-filter-date aria-label="Data do pedido" />
          <select data-supplier-id aria-label="Fornecedor">
            ${r.map(e=>`<option value="${e.id}" ${e.id===i?`selected`:``}>${e.name}</option>`).join(``)}
          </select>
          <span class="badge ${t.status}">${w[t.status]??t.status}</span>
        </div>
        ${jd(`consolidacao`,[[`pdf`,`PDF`,`chart`],[`doc`,`Word`,`clipboard`]])}
        <button class="btn primary admin-send-submit" data-action="send-consolidation">${j(`truck`,15)}Enviar</button>
      </div>
    </header>
    <div class="report-grid">
      <div class="data-panel">
        <h2 class="section-title">Resumo do pedido</h2>
        ${Af(n)}
      </div>
      <div class="timeline-panel">
        <h2 class="section-title">Linha do tempo</h2>
        ${jf(t)}
      </div>
    </div>
    <div class="table-panel">
      <h2 class="section-title">Pedidos de origem</h2>
      ${Of(n.rows,{showLeader:!0,editable:!1})}
    </div>`}function df(){let e=p(q);return q.consolidations.filter(t=>t.supplierId===e?.id).sort((e,t)=>new Date(t.date)-new Date(e.date))}function ff(e){return q.consolidationDocuments.filter(t=>t.consolidationId===e)}function pf(e,t){return e.filter(e=>e.status===t).length}function mf(e){return Jt(e.status)?.label??`Entrega concluida`}function hf(e,t,n,r=``){return`<article class="supplier-metric ${r}"><span>${e}</span><strong>${t}</strong><small>${n}</small></article>`}function gf(){let e=df(),t=e.filter(e=>![`entregue`,`rascunho`].includes(e.status)),n=[...t].sort((e,t)=>{let n={enviado:0,confirmado:1,producao:2,saiu_entrega:3};return(n[e.status]??9)-(n[t.status]??9)||new Date(e.date)-new Date(t.date)})[0];return`
    <section class="supplier-dashboard">
      <header class="supplier-heading">
        <div><span class="eyebrow">Operação do fornecedor</span><h1>Visão de hoje</h1><p>Produza, despache e acompanhe cada pedido em tempo real.</p></div>
        <button class="btn outline" data-view="fornecedor-pedidos">Ver pedidos</button>
      </header>
      <div class="supplier-metrics-grid">
        ${hf(`Refeições do dia`,e.filter(e=>e.date===q.settings.defaultMealDate).reduce((e,t)=>e+S(q,t).total,0),`para ${M(q.settings.defaultMealDate)}`,`accent`)}
        ${hf(`A confirmar`,pf(e,`enviado`),`pedidos recebidos`)}
        ${hf(`Em produção`,pf(e,`confirmado`)+pf(e,`producao`),`em preparo`)}
        ${hf(`Em rota`,pf(e,`saiu_entrega`),`aguardando entrega`)}
        ${hf(`Entregues`,pf(e,`entregue`),`histórico total`)}
      </div>
      ${n?vf(n):_f()}
      <section class="supplier-panel-card supplier-queue-card">
        <div class="supplier-section-heading"><div><span class="eyebrow">Fila operacional</span><h2>Pedidos prioritários</h2></div><button class="text-action" data-view="fornecedor-pedidos">Ver todos ${j(`arrow`,15)}</button></div>
        <div class="supplier-queue">${t.slice(0,5).map(yf).join(``)||`<div class="empty">Nenhum pedido pendente no momento.</div>`}</div>
      </section>
    </section>`}function _f(){return`<section class="supplier-next-action is-empty"><span class="supplier-next-icon">${j(`package`,22)}</span><div><span class="eyebrow">Tudo em dia</span><h2>Sem ação pendente</h2><p>Quando o administrador enviar um pedido ao fornecedor, ele aparecerá aqui.</p></div></section>`}function vf(e){let t=S(q,e),n=Jt(e.status),r=Object.entries(t.byMeal).map(([e,t])=>`${t.total} ${e}`).join(` · `),i=Cd(e);return`<section class="supplier-next-action">
    <span class="supplier-next-icon">${j(e.status===`saiu_entrega`?`truck`:`clipboard`,22)}</span>
    <div class="supplier-next-copy"><span class="eyebrow">Próxima ação</span><h2>${mf(e)}</h2><div class="supplier-next-order"><strong>${r}</strong><span>Pedido ${e.id.slice(0,8).toUpperCase()}</span><span>${t.total} refeições</span><span>${It(i)}</span><span>Entrega: ${M(e.date)}</span></div></div>
    <div class="supplier-next-actions"><button class="btn outline small" data-supplier-select="${e.id}">Detalhes</button>${n?`<button class="btn primary" data-step="${n.step}" data-id="${e.id}">${n.label}</button>`:``}</div>
  </section>`}function yf(e){let t=S(q,e),n=Object.entries(t.byMeal).map(([e,t])=>`${t.total} ${e}`).join(` · `);return`<button class="supplier-queue-row" data-supplier-select="${e.id}"><span><strong>${n}</strong><small>Pedido ${e.id.slice(0,8).toUpperCase()} · ${t.total} refeições · ${It(Cd(e))}</small></span><span class="supplier-queue-delivery">Entrega<br><b>${M(e.date)}</b></span><span class="badge ${e.status}">${w[e.status]}</span>${j(`arrow`,16)}</button>`}function bf(){let e=df().filter(e=>(bd===`todos`||(bd===`ativos`?![`entregue`,`rascunho`].includes(e.status):e.status===bd))&&(!xd||e.date===xd)),t=e.find(e=>e.id===X)??e[0]??null;return`<section class="supplier-workspace">
    ${Md(`Pedidos`,`Fila de produção, entrega e acompanhamento`,`<div class="filter-bar supplier-filter-bar"><select data-supplier-status><option value="ativos" ${bd===`ativos`?`selected`:``}>Pedidos ativos</option><option value="todos" ${bd===`todos`?`selected`:``}>Todos os pedidos</option><option value="enviado" ${bd===`enviado`?`selected`:``}>A confirmar</option><option value="confirmado" ${bd===`confirmado`?`selected`:``}>Em produção</option><option value="saiu_entrega" ${bd===`saiu_entrega`?`selected`:``}>Em rota</option><option value="entregue" ${bd===`entregue`?`selected`:``}>Entregues</option></select><input type="date" value="${xd}" data-supplier-date /><button class="btn outline small" data-supplier-clear-filter>Limpar filtros</button></div>`)}
    <div class="supplier-orders-layout"><div class="supplier-order-list">${e.map(e=>xf(e,e.id===t?.id)).join(``)||`<div class="empty">Nenhum pedido encontrado.</div>`}</div>${t?Sf(t):`<div class="empty supplier-detail-empty">Selecione um pedido para ver os detalhes.</div>`}</div>
  </section>`}function xf(e,t){let n=S(q,e),r=Object.entries(n.byMeal).map(([e,t])=>`${t.total} ${e}`).join(` · `);return`<button class="supplier-order-list-item ${t?`selected`:``}" data-supplier-select="${e.id}"><span class="badge ${e.status}">${w[e.status]}</span><strong>${r}</strong><small>${n.total} refeições · ${It(Cd(e))} · Entrega ${M(e.date)}</small></button>`}function Sf(e){let t=S(q,e),n=Jt(e.status),r=Object.entries(t.byMeal).map(([e,t])=>`${e}: ${t.total}`).join(` · `),i=Object.entries(t.byMeal).map(([e,t])=>{let n=Ed(t.rows[0]);return n?`<p><strong>${Lt(e)}:</strong> ${Lt(n)}</p>`:``}).join(``);return`<article class="supplier-order-detail"><div class="supplier-detail-top"><div><span class="eyebrow">Pedido ${e.id.slice(0,8).toUpperCase()}</span><h2>${t.total} refeições para ${M(e.date)}</h2></div><span class="badge ${e.status}">${w[e.status]}</span></div><div class="supplier-order-highlights"><div><span>Alimentação</span><strong>${r}</strong></div><div><span>Quantidade</span><strong>${t.total} refeições</strong></div><div><span>Valor do pedido</span><strong>${It(Cd(e))}</strong></div><div><span>Entrega prevista</span><strong>${M(e.date)}</strong></div></div>${i?`<section class="supplier-composition"><h3>Composição das marmitas</h3>${i}</section>`:``}<div class="supplier-detail-actions"><button class="btn outline small" data-generate-romaneio="${e.id}">Gerar nota de fornecimento</button>${n?`<button class="btn primary" data-step="${n.step}" data-id="${e.id}">${n.label}</button>`:``}</div><div class="supplier-detail-grid"><section><h3>Itens do pedido</h3>${Af(t)}</section><section><h3>Rastreabilidade</h3>${jf(e)}</section></div><section class="supplier-origin-requests"><h3>Pedidos de origem</h3>${Cf(t.rows)}</section></article>`}function Cf(e){return e.length?`<div class="supplier-origin-list">${e.map(e=>`<article class="supplier-origin-card"><div><strong>${e.mealType}</strong><span class="badge ${e.status}">${w[e.status]??e.status}</span></div><p>${m(q,e.leaderId)} - ${e.location}</p><footer><span>${M(e.date)}</span><b>${e.quantity} ref.</b><small>${Ft(e.updatedAt)}</small></footer></article>`).join(``)}</div>`:`<div class="empty">Nenhum pedido de origem encontrado.</div>`}function wf(){let e=df().filter(e=>e.status===`entregue`);return`<section class="supplier-workspace">${Md(`Histórico de entregas`,`Pedidos concluídos pelo fornecedor`)}<div class="supplier-history-list">${e.map(e=>{let t=S(q,e),n=e.confirmations.find(e=>e.step===`entregue`);return`<article class="supplier-history-row"><div><span class="badge entregue">Entregue</span><h2>${M(e.date)} · ${t.total} refeições</h2><p>Concluído em ${Ft(n?.at)}</p></div><div class="supplier-history-actions"><button class="btn outline small" data-generate-romaneio="${e.id}">Nota de fornecimento</button><button class="btn outline small" data-view="fornecedor-documentos">Documentos</button></div></article>`}).join(``)||`<div class="empty">Nenhuma entrega concluída ainda.</div>`}</div></section>`}function Tf(){let e=df();return`<section class="supplier-workspace">${Md(`Documentos`,`Notas de fornecimento e notas fiscais anexadas`,Rd())}<div class="supplier-documents-list">${e.map(e=>{let t=S(q,e),n=ff(e.id);return`<article class="supplier-document-card"><div class="supplier-document-title"><div><span class="eyebrow">${M(e.date)}</span><h2>Pedido ${e.id.slice(0,8).toUpperCase()}</h2><p>${t.total} refeições · ${w[e.status]}</p></div><button class="btn outline small" data-generate-romaneio="${e.id}">Gerar nota</button></div><div class="supplier-document-body"><div><strong>Nota fiscal</strong><small>Anexe o PDF fiscal emitido fora do sistema.</small></div><label class="btn primary small supplier-upload-label">Anexar PDF<input type="file" accept="application/pdf" data-document-upload="${e.id}" hidden /></label></div>${n.length?`<div class="supplier-attached-files">${n.map(e=>`<button class="supplier-file-row" data-download-document="${e.id}">${j(`package`,16)}<span>${e.originalName}</span><small>${Ft(e.createdAt)}</small></button>`).join(``)}</div>`:`<div class="supplier-no-documents">Nenhuma nota fiscal anexada.</div>`}</article>`}).join(``)||`<div class="empty">Ainda não há pedidos para documentar.</div>`}</div></section>`}function Ef(){let e=Zd(Zu),t=Qd(),n=Kt(t),r=Object.entries(t.reduce((e,t)=>{let n=m(q,t.leaderId);return e[n]??=0,e[n]+=Number(t.quantity),e},{})).sort((e,t)=>t[1]-e[1]),i=Object.entries(Gt(t)).sort((e,t)=>t[1]-e[1]),a=Object.entries(t.reduce((e,t)=>{let n=w[t.status]??t.status;return e[n]??=0,e[n]+=1,e},{})).sort((e,t)=>t[1]-e[1]),o=Object.entries(t.reduce((e,t)=>(e[t.date]??=0,e[t.date]+=Number(t.quantity),e),{})).sort((e,t)=>e[0].localeCompare(t[0])).slice(-10),s=Math.max(...i.map(([,e])=>e),1),c=Math.max(...r.map(([,e])=>e),1),l=Math.max(...o.map(([,e])=>e),1);return`
    ${Md(`Relatórios`,`Período: ${$d()}`,`
      <div class="filter-bar report-filter-bar">
      <select data-report-range>
        <option value="all" ${e.range===`all`?`selected`:``}>Todo período</option>
        <option value="day" ${e.range===`day`?`selected`:``}>Dia</option>
        <option value="week" ${e.range===`week`?`selected`:``}>Semana</option>
        <option value="month" ${e.range===`month`?`selected`:``}>Mes</option>
        <option value="custom" ${e.range===`custom`?`selected`:``}>Período personalizado</option>
      </select>
      <input type="date" value="${e.start||q.settings.defaultMealDate}" data-report-start ${e.range===`all`?`disabled`:``} />
      <input type="date" value="${e.end||e.start||q.settings.defaultMealDate}" data-report-end ${e.range===`custom`?``:`disabled`} />
      <select>
        <option>Todos os encarregados</option>
        ${h(q).map(e=>`<option>${e.name}</option>`).join(``)}
      </select>
      </div>
      <button class="btn primary small" type="button" data-export-kpi>${j(`chart`,14)}KPI PDF</button>
      ${jd(`relatorios`,[[`pdf`,`PDF`,`clipboard`],[`xlsx`,`Excel`,`chart`]],`Medicao`)}
      ${Ld()}
    `)}
    <div class="stats-grid report-metrics-grid">
      <div class="stat-card accent"><div class="stat-label">Total</div><div class="stat-value">${n}</div><div class="stat-sub">refeições no periodo</div></div>
      <div class="stat-card"><div class="stat-label">Marmitas</div><div class="stat-value">${Gt(t)[`Marmita Campo`]??0}</div></div>
      <div class="stat-card"><div class="stat-label">Almocos</div><div class="stat-value">${Gt(t)[`Buffer Almoco`]??0}</div></div>
      <div class="stat-card"><div class="stat-label">Jantas</div><div class="stat-value">${Gt(t).Jantar??0}</div></div>
    </div>
    <div class="report-grid">
      <div class="insight-panel">
        <h2 class="section-title">Distribuicao por refeicao</h2>
        ${i.map(([e,t])=>`<div class="finance-progress"><div><span>${e}</span><strong>${t}</strong></div><i><b style="width:${Math.max(3,Math.round(t/s*100))}%"></b></i></div>`).join(``)||`<div class="empty">Sem dados no periodo.</div>`}
      </div>
      <div class="insight-panel">
        <h2 class="section-title">Status dos pedidos</h2>
        ${a.map(([e,n])=>`<div class="finance-progress"><div><span>${e}</span><strong>${n}</strong></div><i><b style="width:${Math.max(3,Math.round(n/t.length*100))}%"></b></i></div>`).join(``)||`<div class="empty">Sem dados no periodo.</div>`}
      </div>
      <div class="insight-panel">
        <h2 class="section-title">Ranking por encarregado</h2>
        ${r.slice(0,8).map(([e,t])=>`<div class="finance-progress"><div><span>${e}</span><strong>${t}</strong></div><i><b style="width:${Math.max(3,Math.round(t/c*100))}%"></b></i></div>`).join(``)||`<div class="empty">Sem dados no periodo.</div>`}
      </div>
      <div class="insight-panel">
        <h2 class="section-title">Evolucao diaria</h2>
        <div class="finance-bars">${o.map(([e,t])=>`<div><strong>${t}</strong><i style="height:${Math.max(5,Math.round(t/l*126))}px"></i><span>${e.slice(5).replace(`-`,`/`)}</span></div>`).join(``)||`<div class="empty">Sem dados no periodo.</div>`}</div>
      </div>
    </div>`}function Df(){return`
    ${Md(`Auditoria`,`Registro de usuario, data e horario em todas as acoes`,Ld())}
    <div class="audit-panel">
      <h2 class="section-title">Eventos do sistema</h2>
      <div class="timeline">
        ${q.auditLog.map(e=>`
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-body"><strong>${e.action}</strong><br>${m(q,e.userId)} · ${Ft(e.at)} · ${ef(e.entity)}</div>
          </div>`).join(``)}
      </div>
    </div>`}function Of(e,t={}){return e.length?`
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            ${t.showLeader?`<th>Encarregado</th>`:``}
            <th>Tipo</th>
            <th>Local</th>
            <th>Qtd</th>
            <th>Status</th>
            <th>Atualização</th>
            ${t.editable?`<th>Ações</th>`:``}
          </tr>
        </thead>
        <tbody>
          ${e.map(e=>`
            <tr>
              <td>${M(e.date)}</td>
              ${t.showLeader?`<td><strong>${m(q,e.leaderId)}</strong></td>`:``}
              <td>${e.mealType}</td>
              <td>${e.location}</td>
              <td><strong>${e.quantity}</strong></td>
              <td><span class="badge ${e.status}">${w[e.status]??e.status}</span></td>
              <td>${Ft(e.updatedAt)}</td>
              ${t.editable?`<td>${kf(e)}</td>`:``}
            </tr>`).join(``)}
        </tbody>
      </table>
    </div>`:`<div class="empty">Nenhum pedido encontrado.</div>`}function kf(e){return y(q,e)?`
    <div class="button-row">
      <button class="btn outline small" data-edit-request="${e.id}">Editar</button>
      <button class="btn danger small" data-cancel-request="${e.id}">Cancelar</button>
    </div>`:`<span class="page-subtitle">Bloqueado</span>`}function Af(e){return e.rows.length?`
    ${Object.entries(e.byMeal).map(([e,t])=>`
      <div class="consolidated-block">
        <div class="consolidated-row total-line"><span>${e}</span><span>${t.total}</span></div>
        ${Ed(t.rows[0])?`<div class="consolidated-description">${Lt(Ed(t.rows[0]))}</div>`:``}
        ${t.rows.map(t=>`<div class="consolidated-row"><span>${e===`Marmita Campo`?m(q,t.leaderId):t.location}</span><strong>${t.quantity}</strong></div>`).join(``)}
      </div>`).join(``)}
    <div class="consolidated-row total-line"><span>Total geral</span><span>${e.total} refeições</span></div>`:`<div class="empty">Sem pedidos recebidos para enviar ao fornecedor.</div>`}function jf(e){return`
    <div class="timeline">
      ${[[`enviado`,`Enviado ao fornecedor`],[`confirmado`,`Fornecedor confirmou recebimento`],[`producao`,`Fornecedor confirmou produção`],[`saiu_entrega`,`Saida para entrega registrada`],[`entregue`,`Entrega concluida`]].map(([t,n])=>{let r=e.confirmations.find(e=>e.step===t);return`
          <div class="timeline-item">
            <div class="timeline-dot" style="background:${r?`var(--orange)`:`var(--line)`}"></div>
            <div class="timeline-body"><strong>${n}</strong><br>${r?`${m(q,r.userId)} · ${Ft(r.at)}`:`Aguardando`}</div>
          </div>`}).join(``)}
    </div>`}function Mf(){Y.querySelectorAll(`[data-view]`).forEach(e=>{e.addEventListener(`click`,()=>{e.dataset.ordersTab?e.dataset.ordersTab:e.dataset.view,Pd(e.dataset.view)})}),Y.querySelectorAll(`[data-orders-tab]`).forEach(e=>{e.dataset.view||e.addEventListener(`click`,()=>{e.dataset.ordersTab,$()})}),Y.querySelector(`[data-form='login']`)?.addEventListener(`submit`,Ff),Y.querySelectorAll(`[data-login-mode]`).forEach(e=>{e.addEventListener(`click`,()=>{vd=e.dataset.loginMode,yd=``,Fd()})}),Y.querySelector(`[data-form='register']`)?.addEventListener(`submit`,If),Y.querySelectorAll(`[data-toggle-password]`).forEach(e=>{e.addEventListener(`click`,()=>Nf(e))}),Y.querySelectorAll(`[data-action='logout']`).forEach(e=>{e.addEventListener(`click`,Lf)}),Y.querySelector(`[data-access-user]`)?.addEventListener(`change`,e=>{Pf(e.currentTarget.value)}),Y.querySelector(`[data-action='return-admin']`)?.addEventListener(`click`,()=>{Pf(q.authenticatedUserId)}),Y.querySelector(`[data-form='request']`)?.addEventListener(`submit`,Rf),Y.querySelector(`[data-address-form-toggle]`)?.addEventListener(`click`,()=>{Uu=!0,$()}),Y.querySelector(`[data-address-form-cancel]`)?.addEventListener(`click`,()=>{Uu=!1,$()}),Y.querySelector(`[data-save-delivery-address]`)?.addEventListener(`click`,zf),Y.querySelectorAll(`[data-filter-date], [data-filter-leader], [data-filter-meal]`).forEach(e=>{e.addEventListener(`change`,e=>{q.activeView===`pedidos`&&e.currentTarget.matches(`[data-filter-date]`)&&(Xu=e.currentTarget.value),$()})}),Y.querySelector(`[data-clear-admin-request-filters]`)?.addEventListener(`click`,()=>{Xu=``,$()}),Y.querySelectorAll(`[data-report-range]`).forEach(e=>{e.addEventListener(`change`,e=>{Zu=Zd({...Zu,range:e.currentTarget.value}),$()})}),Y.querySelectorAll(`[data-report-start]`).forEach(e=>{e.addEventListener(`change`,e=>{Zu=Zd({...Zu,start:e.currentTarget.value}),$()})}),Y.querySelectorAll(`[data-report-end]`).forEach(e=>{e.addEventListener(`change`,e=>{Zu=Zd({...Zu,end:e.currentTarget.value}),$()})}),Y.querySelectorAll(`[data-cancel-request]`).forEach(e=>{e.addEventListener(`click`,()=>Jf(e.dataset.cancelRequest))}),Y.querySelectorAll(`[data-dismiss-operation]`).forEach(e=>{e.addEventListener(`click`,()=>{J=null,Ju=null,$()})}),Y.querySelector(`[data-confirm-cancel]`)?.addEventListener(`click`,()=>{let e=J;J=null,Jf(e,!0)}),Y.querySelectorAll(`[data-edit-request]`).forEach(e=>{e.addEventListener(`click`,()=>Yf(e.dataset.editRequest))}),Y.querySelectorAll(`[data-open-request]`).forEach(e=>{e.addEventListener(`click`,()=>Xf(e.dataset.openRequest))}),Y.querySelectorAll(`[data-close-request-detail]`).forEach(e=>{e.addEventListener(`click`,()=>{Gu=null,$()})}),Y.querySelectorAll(`[data-send-request-date]`).forEach(e=>{e.addEventListener(`click`,()=>$f(e.dataset.sendRequestDate))}),Y.querySelectorAll(`[data-close-edit-modal]`).forEach(e=>{e.addEventListener(`click`,()=>{Wu=null,$()})}),Y.querySelector(`[data-form='edit-request']`)?.addEventListener(`submit`,Zf),Y.querySelector(`[data-form='profile-settings']`)?.addEventListener(`submit`,Bf),Y.querySelector(`[data-form='password-settings']`)?.addEventListener(`submit`,Vf),Y.querySelector(`[data-form='meal-price-settings']`)?.addEventListener(`submit`,Hf),Y.querySelector(`[data-form='access-invite']`)?.addEventListener(`submit`,Kf),Y.querySelector(`[data-copy-invite-link]`)?.addEventListener(`click`,qf),Y.querySelectorAll(`[data-form='work-section']`).forEach(e=>{e.addEventListener(`submit`,Uf)}),Y.querySelectorAll(`[data-form='meal-catalog']`).forEach(e=>{e.addEventListener(`submit`,Wf)}),Y.querySelector(`[data-open-new-meal]`)?.addEventListener(`click`,()=>{let e=Y.querySelector(`[data-new-meal-panel]`);e&&(e.open=!0)}),Y.querySelectorAll(`[data-delete-meal-type]`).forEach(e=>{e.addEventListener(`click`,()=>Gf(e.dataset.deleteMealType))}),Y.querySelector(`[data-edit-meal]`)?.addEventListener(`change`,e=>{let t=Y.querySelector(`#edit-request-location`);t&&(t.innerHTML=fp(e.currentTarget.value))}),Y.querySelector(`[data-action='send-consolidation']`)?.addEventListener(`click`,Qf),Y.querySelector(`[data-form='actuals']`)?.addEventListener(`submit`,dp),Y.querySelectorAll(`[data-close-actuals-modal]`).forEach(e=>{e.addEventListener(`click`,()=>{Sd=null,$()})}),Y.querySelectorAll(`[data-step]`).forEach(e=>{e.addEventListener(`click`,()=>ep(e.dataset.id,e.dataset.step))}),Y.querySelectorAll(`[data-supplier-select]`).forEach(e=>{e.addEventListener(`click`,()=>{X=e.dataset.supplierSelect,q.activeView=`fornecedor-pedidos`,$()})}),Y.querySelectorAll(`[data-supplier-close-detail]`).forEach(e=>{e.addEventListener(`click`,()=>{X=null,$()})}),Y.querySelector(`[data-supplier-status]`)?.addEventListener(`change`,e=>{bd=e.currentTarget.value,X=null,$()}),Y.querySelector(`[data-supplier-date]`)?.addEventListener(`change`,e=>{xd=e.currentTarget.value,X=null,$()}),Y.querySelector(`[data-supplier-clear-filter]`)?.addEventListener(`click`,()=>{bd=`todos`,xd=``,X=null,$()}),Y.querySelectorAll(`[data-generate-romaneio]`).forEach(e=>{e.addEventListener(`click`,()=>tp(e.dataset.generateRomaneio))}),Y.querySelectorAll(`[data-document-upload]`).forEach(e=>{e.addEventListener(`change`,()=>np(e.dataset.documentUpload,e.files?.[0]))}),Y.querySelectorAll(`[data-download-document]`).forEach(e=>{e.addEventListener(`click`,()=>rp(e.dataset.downloadDocument))}),Y.querySelectorAll(`[data-daily-report-download]`).forEach(e=>{e.addEventListener(`click`,()=>ip(e.dataset.reportDate,e.dataset.dailyReportDownload))}),Y.querySelectorAll(`[data-export-toggle]`).forEach(e=>{e.addEventListener(`click`,()=>{Ku=Ku===e.dataset.exportToggle?null:e.dataset.exportToggle,$()})}),Y.querySelectorAll(`[data-export]`).forEach(e=>{e.addEventListener(`click`,()=>{Ku=null,ap(e.dataset.export)})}),Y.querySelectorAll(`[data-export-kpi]`).forEach(e=>{e.addEventListener(`click`,op)}),Y.querySelectorAll(`[data-export-finance]`).forEach(e=>{e.addEventListener(`click`,()=>cp(e.dataset.exportFinance))}),Y.querySelectorAll(`[data-export-audit]`).forEach(e=>{e.addEventListener(`click`,()=>lp(e.dataset.exportAudit||`pdf`))}),Y.querySelectorAll(`[data-week-nav]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.weekNav);Yu=t===0?0:Yu+t,$()})}),Y.querySelectorAll(`[data-filter-date-set]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Y.querySelector(`[data-filter-date]`);t&&(t.value=e.dataset.filterDateSet),q.settings.defaultMealDate=e.dataset.filterDateSet,$()})})}function Nf(e){let t=document.getElementById(e.dataset.togglePassword);if(!t)return;let n=t.type===`password`;t.type=n?`text`:`password`,e.classList.toggle(`active`,n),e.setAttribute(`aria-label`,n?`Ocultar senha`:`Mostrar senha`)}function Pf(e){let t=q.users.find(e=>e.id===q.authenticatedUserId),n=q.users.find(t=>t.id===e&&t.active!==!1);if(t?.role!==`admin`||!n){Z(`Este usuário não pode ser acessado.`);return}q.activeUserId=n.id,q.activeView=C[n.role][0][0],$(),Z(n.id===t.id?`Voce voltou ao acesso administrativo.`:`Agora voce esta acessando como ${n.name}.`)}async function Ff(e){e.preventDefault(),yd=``;let t=new FormData(e.currentTarget),n=e.submitter;n&&(n.disabled=!0);try{await pu();let e=pp(t.get(`email`));if(!hp(e)){yd=`Informe um e-mail valido, por exemplo nome@empresa.com.`,Fd();return}await gu(e,String(t.get(`password`))),await vp(),Z(`Acesso realizado.`)}catch(e){let t=String(e?.message??``),n=String(e?.status??``)===`400`||t.toLowerCase().includes(`invalid login credentials`);yd=`E-mail ou senha invalidos. Confira os dados e tente novamente.`,n||console.error(e),Fd()}finally{n&&(n.disabled=!1)}}async function If(e){e.preventDefault();let t=new FormData(e.currentTarget),n=e.submitter;n&&(n.disabled=!0);try{await pu();let e=pp(t.get(`email`));if(!hp(e)){Z(`Informe um e-mail valido, por exemplo pedro@empresa.com.`);return}if(!(await _u({name:String(t.get(`name`)).trim(),email:e,team:String(t.get(`team`)).trim(),password:String(t.get(`password`)),inviteToken:String(t.get(`inviteToken`)??``)})).session){vd=`login`,Fd(),Z(`Conta criada. Confirme seu e-mail antes de entrar.`);return}await vp(),Z(`Conta criada. Bem-vindo ao AlimentaObra.`)}catch(e){console.error(e),String(e.message).toLowerCase().includes(`email address`)?Z(`O Supabase recusou este e-mail. Digite-o novamente sem espacos ou caracteres especiais.`):Z(e.message)}finally{n&&(n.disabled=!1)}}async function Lf(){try{await zu(Vu),Vu=null,await vu()}catch(e){console.error(e)}q={...u(),loading:!1},Fd()}async function Rf(e){e.preventDefault();let t=e.submitter;t&&(t.disabled=!0);let n=new FormData(e.currentTarget),r=p(q),i=t?.value??`enviado`;try{nd(n.get(`date`)),await Cu({date:n.get(`date`),mealTypeId:n.get(`mealTypeId`),locationId:n.get(`locationId`),teamId:n.get(`teamId`),quantity:n.get(`quantity`),status:i,notes:String(n.get(`notes`)??``)},r.id),await _p(),Ju=i===`enviado`?{title:`Pedido enviado`,message:`Seu pedido foi registrado e ja apareceu para a administracao em tempo real.`}:{title:`Rascunho salvo`,message:`Seu pedido ficou salvo como rascunho e pode ser editado antes do envio.`},$()}catch(e){console.error(e),Z(`Não foi possível salvar: ${e.message}`)}finally{t&&(t.disabled=!1)}}async function zf(){let e=document.querySelector(`#delivery-address-label`)?.value.trim(),t=document.querySelector(`#delivery-address-line`)?.value.trim(),n=document.querySelector(`#delivery-address-reference`)?.value.trim()??``,r=p(q);if(!e||!t){Z(`Informe o nome e o endereço completo.`);return}if(!r?.id){Z(`Não foi possível identificar o encarregado deste endereço.`);return}let i=document.querySelector(`[data-save-delivery-address]`);i&&(i.disabled=!0);try{let i=await wu({leaderId:r.id,label:e,addressLine:t,reference:n});Uu=!1,await _p();let a=document.querySelector(`#request-delivery-address`);a&&(a.value=i.id),Z(`Endereço salvo para próximas entregas.`)}catch(e){console.error(e),Z(`Não foi possível salvar o endereço: ${e.message}`)}finally{i&&(i.disabled=!1)}}async function Bf(e){e.preventDefault();let t=new FormData(e.currentTarget),n=e.submitter;n&&(n.disabled=!0);try{await yu({name:t.get(`name`),team:t.get(`team`)}),await _p(),Z(`Configurações salvas.`)}catch(e){console.error(e),Z(`Não foi possível salvar os dados: ${e.message}`)}finally{n&&(n.disabled=!1)}}async function Vf(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),r=String(n.get(`password`)??``);if(r!==String(n.get(`passwordConfirm`)??``)){Z(`As senhas não conferem.`);return}if(r.length<8){Z(`A senha precisa ter pelo menos 8 caracteres.`);return}let i=p(q),a=e.submitter;a&&(a.disabled=!0);try{await bu(r,i?.id),t.reset(),Z(`Senha alterada com sucesso.`)}catch(e){Z(`Não foi possível alterar a senha: ${e.message}`)}finally{a&&(a.disabled=!1)}}async function Hf(e){e.preventDefault();let t=new FormData(e.currentTarget),n=e.submitter;n&&(n.disabled=!0);try{await Du(t.get(`unitPrice`)),await _p(),Z(`Preco unico atualizado.`)}catch(e){console.error(e),Z(`Não foi possível salvar o preco: ${e.message}`)}finally{n&&(n.disabled=!1)}}async function Uf(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),r=e.submitter;r&&(r.disabled=!0);try{await Eu({id:String(n.get(`id`)??``)||null,name:n.get(`name`),headcount:n.get(`headcount`),leaderId:String(n.get(`leaderId`)??``)||null,active:n.get(`active`)===`true`}),n.get(`id`)||t.reset(),await _p(),Z(`Equipe/trecho salvo.`)}catch(e){console.error(e),Z(`Nao foi possivel salvar a equipe: ${e.message}`)}finally{r&&(r.disabled=!1)}}async function Wf(e){e.preventDefault();let t=e.currentTarget,n=new FormData(t),r=e.submitter;r&&(r.disabled=!0);try{await Tu({id:String(n.get(`id`)??``)||null,name:n.get(`name`),description:n.get(`description`),unitPrice:n.get(`unitPrice`),active:n.get(`active`)===`true`}),n.get(`id`)||t.reset(),await _p(),Z(`Tipo de alimentacao salvo.`)}catch(e){console.error(e),Z(`Não foi possível salvar o tipo: ${e.message}`)}finally{r&&(r.disabled=!1)}}async function Gf(e){let t=q.mealCatalog.find(t=>t.id===e);if(!t)return;let n=Y.querySelector(`[data-delete-meal-type="${e}"]`);n&&(n.disabled=!0);try{await Tu({id:t.id,name:t.label,description:t.description,unitPrice:t.unitPrice,active:!1}),await _p(),Z(`Tipo removido dos novos pedidos.`)}catch(e){console.error(e),Z(`Não foi possível remover o tipo: ${e.message}`)}finally{n&&(n.disabled=!1)}}async function Kf(e){e.preventDefault();let t=new FormData(e.currentTarget),n=e.submitter;n&&(n.disabled=!0);try{let e=mp();await Ou({token:e,role:t.get(`role`),email:t.get(`email`),team:t.get(`team`),expiresInDays:t.get(`expiresInDays`)});let n=new URL(window.location.href);n.search=``,n.hash=``,n.searchParams.set(`invite`,e),qu=n.toString(),$(),Z(`Link privado gerado.`)}catch(e){console.error(e),Z(`Não foi possível gerar o convite: ${e.message}`)}finally{n&&(n.disabled=!1)}}async function qf(){if(qu)try{await navigator.clipboard.writeText(qu),Z(`Link copiado.`)}catch{Z(`Não foi possível copiar automaticamente. Selecione o link na tela.`)}}async function Jf(e,t=!1){let n=q.requests.find(t=>t.id===e);if(!(!n||!y(q,n))){if(!t){J=e,$();return}try{await ku(e,`cancelado`),await _p(),Ju={title:`Pedido cancelado`,message:`O pedido foi removido da operação e nao entrara no proximo envio ao fornecedor.`},$()}catch(e){console.error(e),Z(`Não foi possível cancelar: ${e.message}`)}}}async function Yf(e){let t=q.requests.find(t=>t.id===e);if(t){if(!y(q,t)){Z(`Este pedido nao pode mais ser editado porque o fornecedor ja confirmou ou a operacao foi encerrada.`);return}Gu=null,Wu=e,$()}}function Xf(e){q.requests.find(t=>t.id===e)&&(Gu=e,$())}async function Zf(e){e.preventDefault();let t=q.requests.find(e=>e.id===Wu);if(!t)return;if(!y(q,t)){Wu=null,$(),Z(`Edicao bloqueada: o fornecedor ja confirmou este pedido.`);return}let n=new FormData(e.currentTarget),r=e.submitter;r&&(r.disabled=!0);try{nd(n.get(`date`)),await Au(t.id,{date:n.get(`date`),quantity:n.get(`quantity`),mealTypeId:n.get(`mealTypeId`),locationId:n.get(`locationId`),teamId:n.get(`teamId`),notes:n.get(`notes`)}),Wu=null,await _p(),Z(`Pedido atualizado.`)}catch(e){console.error(e),Z(`Não foi possível atualizar o pedido: ${e.message}`)}finally{r&&(r.disabled=!1)}}async function Qf(){let e=Q(),t=document.querySelector(`[data-supplier-id]`)?.value;if(!t){Z(`Cadastre e selecione um fornecedor.`);return}try{await ju(e,t),await _p(),Z(`Fornecedor notificado com o pedido.`)}catch(e){console.error(e),Z(`Não foi possível enviar: ${e.message}`)}}async function $f(e){let t=x(q,e)?.supplierId??g(q)[0]?.id;if(!t){q.activeView=`pedidos`,Nd(`Selecione um fornecedor para enviar este pedido.`);return}try{await ju(e,t),await _p(),Z(`Pedido enviado ao fornecedor.`)}catch(e){console.error(e),Z(`Não foi possível enviar: ${e.message}`)}}async function ep(e,t){if(t===`saiu_entrega`){Sd=e,$();return}try{await Mu(e,t),await _p(),Ju={title:w[t]??`Etapa confirmada`,message:`Confirmacao registrada com data e hora. A operação foi atualizada para todos os envolvidos.`},$()}catch(e){console.error(e),Z(`Não foi possível confirmar: ${e.message}`)}}async function tp(e){let t=q.consolidations.find(t=>t.id===e);if(t){if(!Te(q,t)){Z(`Permita a abertura de janela para gerar o romaneio.`);return}try{await Lu(e)}catch(e){console.warn(`Não foi possível registrar a geração do romaneio.`,e)}}}async function np(e,t){if(t)try{await Fu(e,t),await _p(),Z(`Nota fiscal anexada ao pedido.`)}catch(e){console.error(e),Z(`Não foi possível anexar o PDF: ${e.message}`)}}async function rp(e){let t=q.consolidationDocuments.find(t=>t.id===e);if(t)try{let e=await Iu(t.storagePath);window.open(e,`_blank`,`noopener`)}catch(e){console.error(e),Z(`Não foi possível abrir o documento: ${e.message}`)}}async function ip(e,t){let n=q.dailyReports.find(t=>t.date===e);if(!n){Z(`O relatorio diario ainda nao esta disponivel.`);return}try{if(t===`xlsx`){await Ce(q,n),Z(`Excel do relatorio diario preparado.`);return}if(!ke(q,n)){Z(`Permita a abertura de janela para gerar o PDF.`);return}Z(`PDF do relatorio diario preparado.`)}catch(e){console.error(e),Z(`Nao foi possivel baixar o relatorio diario: ${e.message}`)}}async function ap(e){if(q.activeView===`auditoria`){lp(e);return}let t=Q(),n=q.activeView===`relatorios`?Qd():q.requests.filter(e=>{let n=document.querySelector(`[data-filter-leader]`)?.value??``,r=document.querySelector(`[data-filter-meal]`)?.value??``;return(!t||e.date===t)&&(!n||e.leaderId===n)&&(!r||e.mealType===r)}),r=x(q,t);if(e===`xlsx`&&q.activeView===`pedidos`?ye(q,n,{periodLabel:sp(n,`Pedidos`)}):e===`xlsx`&&q.activeView===`relatorios`?ve(q,n,{periodLabel:$d(),filter:Zd(Zu)}):e===`xlsx`&&_e(q,n),e===`doc`&&ge(q,r),!(e===`pdf`&&q.activeView===`pedidos`?be(q,n,{periodLabel:sp(n,`Pedidos`)}):e===`pdf`&&q.activeView===`relatorios`?xe(q,n,{periodLabel:$d(),filter:Zd(Zu)}):e!==`pdf`||we(q,r))){Z(`Permita a abertura de janela para gerar o PDF.`);return}Z(`Exportacao preparada.`)}function op(){let e=Qd();if(!De(q,e,`KPIs operacionais`)){Z(`Permita a abertura de janela para gerar o PDF de KPI.`);return}Z(`KPI em PDF preparado.`)}function sp(e,t=`Periodo`){let n=e.map(e=>e.date).filter(Boolean).sort();if(!n.length)return`${t} vazio`;let r=M(n[0]),i=M(n.at(-1));return r===i?`${t} ${r}`:`${t} ${r} a ${i}`}function cp(e){let t=e===`fornecedor`?df().flatMap(e=>S(q,e).rows):q.requests.filter(e=>e.status!==`cancelado`);Ee(q,t,e===`fornecedor`?`Financeiro do fornecedor`:`Financeiro administrativo`)||Z(`Permita a abertura de janela para gerar o PDF.`)}function lp(e=`pdf`){if(e===`xlsx`){Se(q),Z(`Excel de auditoria preparado.`);return}if(!Oe(q)){Z(`Permita a abertura de janela para gerar o PDF de auditoria.`);return}Z(`PDF de auditoria preparado.`)}async function up(e){if(e?.role!==`admin`)return;let t=ed();if(!(!t||Qu===t)&&!q.dailyReports.some(e=>e.date===t)){Qu=t;try{await Pu(t),gp(await Su(),e),$(),Z(`Relatorio diario automatico gerado.`)}catch(e){console.error(`Nao foi possivel gerar o relatorio diario.`,e),Z(`Nao foi possivel gerar o relatorio diario: ${e.message}`)}}}async function dp(e){e.preventDefault();let t=new FormData(e.currentTarget),n=String(t.get(`consolidationId`)??``),r=[];for(let[e,n]of t.entries()){if(!e.startsWith(`quantity-`))continue;let i=e.replace(`quantity-`,``);r.push({team_id:t.get(`teamId-${i}`),meal_type_id:t.get(`mealTypeId-${i}`),quantity:Number(n??0)})}let i=e.submitter;i&&(i.disabled=!0);try{await Nu(n,r),await Mu(n,`saiu_entrega`),Sd=null,await _p(),Ju={title:`Saida registrada`,message:`Consumo real salvo e bloco diario concluido para os indicadores.`},$()}catch(e){console.error(e),Z(`Nao foi possivel salvar o consumo real: ${e.message}`)}finally{i&&(i.disabled=!1)}}function fp(e,t=``){return((q.mealTypes.find(t=>t.id===e)??q.mealTypes[0])?.locations??[]).map(e=>`<option value="${e.id}" ${e.id===t?`selected`:``}>${e.name}</option>`).join(``)}function pp(e){return String(e??``).normalize(`NFKC`).replace(/[\s\u200B-\u200D\uFEFF]/g,``).replace(/[^\x21-\x7E]/g,``).toLowerCase()}function mp(){let e=new Uint8Array(32);return crypto.getRandomValues(e),Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``)}function hp(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}function gp(e,t){let n=q.activeUserId;q.users=e.profiles.map(e=>({id:e.id,name:e.name,email:e.email,role:e.role,team:e.team??``,active:e.active}));let r=e.catalog.map(t=>({id:t.id,label:t.name,description:t.description??``,unitPrice:Number(t.unit_price??e.settings?.default_meal_unit_price??0),active:t.active,locations:(t.meal_locations??[]).filter(e=>e.active).sort((e,t)=>e.sort_order-t.sort_order).map(e=>({id:e.id,name:e.name}))}));q.mealCatalog=r,q.mealTypes=r.filter(e=>e.active),q.workSections=e.workSections?.length?e.workSections.map(e=>({id:e.id,name:e.name,headcount:Number(e.headcount??0),leaderId:e.leader_id,active:e.active,createdAt:e.created_at,updatedAt:e.updated_at})):q.users.filter(e=>e.role===`encarregado`).map(e=>({id:e.id,name:e.team||e.name,headcount:0,leaderId:e.id,active:!0,derived:!0})),q.requests=e.requests.map(t=>({id:t.id,date:t.meal_date,mealTypeId:t.meal_type_id,mealType:t.meal_types?.name??``,mealDescription:t.meal_types?.description??``,unitPrice:Number(t.meal_types?.unit_price??e.settings?.default_meal_unit_price??0),locationId:t.location_id,location:t.meal_locations?.name??``,teamId:t.team_id??``,sectionName:t.work_sections?.name??t.meal_locations?.name??``,sectionHeadcount:Number(t.work_sections?.headcount??0),deliveryAddressId:t.delivery_address_id,deliveryAddress:t.delivery_addresses?.label??``,deliveryAddressLine:t.delivery_addresses?.address_line??``,leaderId:t.leader_id,quantity:t.quantity,status:t.status,notes:t.notes??``,createdAt:t.created_at,updatedAt:t.updated_at})),q.consolidations=e.consolidations.map(e=>({id:e.id,date:e.meal_date,supplierId:e.supplier_id,status:e.status,sentAt:e.sent_at,createdAt:e.created_at,updatedAt:e.updated_at,requestIds:(e.consolidation_items??[]).map(e=>e.meal_request_id),confirmations:[...e.sent_at?[{step:`enviado`,userId:e.created_by,at:e.sent_at}]:[],...(e.supplier_confirmations??[]).map(e=>({step:e.step,userId:e.confirmed_by,at:e.confirmed_at,metadata:e.metadata}))],revisions:(e.consolidation_revisions??[]).map(e=>({id:e.id,userId:e.edited_by,at:e.edited_at,reason:e.reason,snapshot:e.snapshot}))})),q.consolidationActuals=(e.actuals??[]).map(e=>({id:e.id,consolidationId:e.consolidation_id,date:e.meal_date,teamId:e.team_id,mealTypeId:e.meal_type_id,quantity:Number(e.quantity??0),notes:e.notes??``,recordedBy:e.recorded_by,recordedAt:e.recorded_at})),q.dailyReports=(e.reports??[]).map(e=>({id:e.id,date:e.report_date,status:e.status,totals:e.totals??{},snapshot:e.snapshot??{},items:e.snapshot?.items??e.snapshot?.rows??e.snapshot?.requests??[],rows:e.snapshot?.rows??e.snapshot?.items??e.snapshot?.requests??[],generatedAt:e.generated_at,generatedBy:e.generated_by})),q.auditLog=e.audit.map(e=>({id:e.id,action:e.action,entity:e.entity,entityId:e.entity_id,payload:e.payload,userId:e.actor_id,at:e.created_at})),q.consolidationDocuments=e.documents.map(e=>({id:e.id,consolidationId:e.consolidation_id,type:e.document_type,storagePath:e.storage_path,originalName:e.original_name,mimeType:e.mime_type,sizeBytes:e.size_bytes,uploadedBy:e.uploaded_by,createdAt:e.created_at})),q.deliveryAddresses=e.addresses.map(e=>({id:e.id,leaderId:e.leader_id,label:e.label,addressLine:e.address_line,reference:e.reference??``,active:e.active,createdAt:e.created_at})),q.deliveryAddressFeatureAvailable=e.addressFeatureAvailable,q.settings={cutoffTime:String(e.settings.cutoff_time).slice(0,5),supplierName:e.settings.supplier_name,defaultMealUnitPrice:Number(e.settings.default_meal_unit_price??0),defaultMealDate:$u(),occupancyTarget:Number(e.settings.occupancy_target??100),notificationChannel:e.settings.notification_channel,offlineSyncEnabled:e.settings.offline_sync_enabled},q.authenticatedUserId=t.id;let i=t.role===`admin`&&q.users.some(e=>e.id===n&&e.active!==!1);q.activeUserId=i?n:t.id,q.loading=!1}async function _p({silent:e=!1}={}){if(!Hu){Hu=!0;try{let e=await hu();if(!e)return;let t=await xu(e.id);if(!t.active)throw Error(`Este usuario esta desativado.`);gp(await Su(),t),$(),await up(t)}catch(t){console.error(t),q.loading=!1,$(),e||Z(`Erro ao carregar dados: ${t.message}`)}finally{Hu=!1}}}async function vp(){q.loading=!0,$(),await _p(),Vu||=Ru(()=>_p({silent:!0}))}async function yp(){if(!iu){q.loading=!1,Fd();return}try{if(!await mu()){q.loading=!1,Fd();return}await vp()}catch(e){console.error(e),q.loading=!1,Fd(),Z(`Falha ao iniciar: ${e.message}`)}}window.addEventListener(`online`,()=>{Z(`Conexao restaurada.`),_p({silent:!0})}),window.addEventListener(`offline`,$),`serviceWorker`in navigator&&navigator.serviceWorker.register(`/alimenta-obra/service-worker.js`).catch(()=>{console.warn(`Service worker indisponivel neste ambiente.`)}),`serviceWorker`in navigator,au?.auth.onAuthStateChange((e,t)=>{(e===`SIGNED_OUT`||!t)&&(q={...u(),loading:!1},Fd())}),yp();