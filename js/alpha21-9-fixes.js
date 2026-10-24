/* Alpha 21.9: production-focused dispatch, optional crude sales contracts, and accurate shop KPI history. */
(function(){
 'use strict';
 const priorOps=opsMonth;
 opsMonth=function(){
  const o=ensureOperations(),v=v8init();
  // The monthly ledger is closed before opsMonth. Use the just-closed production month,
  // rather than the legacy aggregate s.volume, which can be zero for valid daily production.
  const completed=v.monthHistory?.[v.monthHistory.length-1];
  const recentActual=Number(completed?.actual);
  if(Number.isFinite(recentActual)&&recentActual>0){s.volume=recentActual;}
  const oilShops=o.shops.filter(x=>x.kind==='oil');
  if(oilShops.length){
   const target=Number(completed?.plan)||Number(v8plan())||0;
   for(const sh of oilShops){if(!(Number(sh.plan)>0)&&target>0)sh.plan=Math.round(target/oilShops.length);}
  }
  priorOps();
 };
 // Sales require a real signed contract; remove only auto-created starter contracts.
 const previousDispatch=v33dispatch;
 v33dispatch=function(available){return previousDispatch(available);};
 v33view=function(){
  const d=v33init(),b=v32init(),last=b.days[b.days.length-1];
  let h='<section class="a219-sales"><h2>Реализация товарной нефти · договоры покупателей</h2><p class="muted">Продажа нефти возможна только по действующим договорам. На старте договоров нет. Без договора нефть остаётся в РВС в пределах ёмкости.</p>';
  h+='<div class="actions"><button class="mini-btn" data-v33-new>Заключить договор реализации</button></div>';
  h+=row('Действующие договоры',String(d.contracts.filter(c=>c.status==='Действует'&&c.remaining>0).length));
  if(last)h+=row('Последняя отгрузка',f(last.sold||0)+' т')+row('Остаток в РВС',f(last.stored||0)+' т');
  h+='<div class="table-scroll"><table><thead><tr><th>№</th><th>Покупатель</th><th>Лимит т/сут</th><th>Остаток, т</th><th>Цена</th><th>Оплата</th><th>Статус</th><th>Действие</th></tr></thead><tbody>';
  for(const c of d.contracts)h+='<tr><td>'+c.id+'</td><td>'+esc(c.buyer)+'</td><td>'+f(c.daily)+'</td><td>'+f(c.remaining)+'</td><td>'+Math.round((c.priceMultiplier||1)*100)+'% рынка</td><td>'+c.terms+' дн.</td><td>'+esc(c.status)+'</td><td>'+(c.status==='Действует'?'<button class="mini-btn" data-v33-pause="'+c.id+'">Пауза</button>':c.status==='Приостановлен'?'<button class="mini-btn" data-v33-resume="'+c.id+'">Возобновить</button>':'—')+'</td></tr>';
  if(!d.contracts.length)h+='<tr><td colspan="8">Договоров нет. Заключите первый договор с выбранным покупателем.</td></tr>';
  return h+'</tbody></table></div></section>';
 };
 function wellPanel(){
  ensureAssets();const wells=s.assets.wellList||[],count=wells.length,per=12;
  if(!Number.isFinite(window.a219Page))window.a219Page=0;
  window.a219Page=Math.max(0,Math.min(window.a219Page,Math.max(0,Math.ceil(count/per)-1)));
  const page=window.a219Page,items=wells.slice(page*per,(page+1)*per);
  let h='<section class="a219-wells"><h3>Скважины · '+count+' в фонде</h3><div class="v5-equipment-grid">';
  for(const w of items){const st=w.status==='Работает'?v5status(w):'stop';h+=v5card('Скважина №'+w.id,'well',st,(w.status==='Работает'?f(w.rate||0):'0')+' т/сут · '+esc(w.status));}
  h+='</div>';
  if(count>per)h+='<div class="a218-pages"><button data-a219-page="prev" '+(!page?'disabled':'')+'>← Назад</button><span>'+(page*per+1)+'–'+Math.min(count,(page+1)*per)+' из '+count+'</span><button data-a219-page="next" '+((page+1)*per>=count?'disabled':'')+'>Далее →</button></div>';
  return h+'</section>';
 }
 const oldRender=window.render;
 window.render=function(){
  oldRender();if(!s)return;
  if(tab==='dispatch'){
   const host=document.getElementById('body');if(host){
    // One production registry, one equipment panel, no duplicated legacy accordions.
    host.innerHTML=v11hero()+wellPanel()+dispatchView();
    host.querySelectorAll('[data-well]').forEach(x=>x.onclick=()=>dispatchAction(x.dataset.well,x.dataset.op));
    host.querySelectorAll('[data-v13-page]').forEach(x=>x.onclick=()=>{v13Page=Math.max(0,v13Page+(x.dataset.v13Page==='next'?1:-1));render()});
   }
  }
  if(tab==='workshops'){
   const host=document.getElementById('body');
   if(host){const rows=host.querySelectorAll('.small-table tbody tr');for(const tr of rows){const cells=tr.querySelectorAll('td');if(cells.length>=6&&cells[1].textContent.trim()==='0'&&cells[2].textContent.trim()==='0'){for(let i=1;i<=4;i++)cells[i].textContent='—';tr.title='В старом сохранении нет подтверждённых данных плана и добычи за этот месяц';}}
    const note=document.createElement('p');note.className='muted';note.textContent='Старые месяцы без подтверждённых данных отмечены прочерком. Новые месяцы рассчитываются по фактической добыче и плану.';host.querySelector('.small-table')?.after(note);
   }
  }
 };
 document.addEventListener('click',e=>{
  const pg=e.target.closest('[data-a219-page]');if(pg){e.preventDefault();e.stopImmediatePropagation();window.a219Page+=pg.dataset.a219Page==='next'?1:-1;render();}
 },true);
})();
