/* Alpha 21.3 focused UI repairs; original save schema remains unchanged. */
(function(){
 const oldCards=window.v5cards;
 if(typeof oldCards==='function')window.v5cards=function(){
  if(typeof s==="undefined"||!s?.small)return oldCards();
  const wells=s.assets?.wellList||[];
  const cards=wells.map(w=>{const state=w.status==='Работает'?(typeof v5status==='function'?v5status(w):'work'):'stop';return v5card('Скважина №'+w.id,'well',state,(w.status==='Работает'?f(w.rate||0):'0')+' т/сут')}).join('');
  const old=oldCards();
  return old.replace(/<div class="v5-equipment-grid">[\s\S]*?<\/div><\/section>/,()=>'<div class="v5-equipment-grid">'+cards+'</div></section>');
 };
 const oldProjects=window.fx420ProjectHtml;
 if(typeof oldProjects==='function')window.fx420ProjectHtml=function(){
  const html=oldProjects();return '<details class="a213-invest"><summary>Результат инвестиций · до и после</summary>'+html.replace('<h3>Результат инвестиций · до и после</h3>','')+'</details>';
 };
 const oldRender=window.render;
 window.render=function(){
  oldRender();if(typeof s==="undefined"||!s)return;
  const nav=document.getElementById('v11sideitems');
  if(nav&&typeof a212Sections!=='undefined'){
   const open={};nav.querySelectorAll('details[data-a213-group]').forEach(d=>open[d.dataset.a213Group]=d.open);
   nav.innerHTML=a212Sections.map(([group,entries])=>'<details data-a213-group="'+group+'" '+(open[group]!==false?'open':'')+'><summary>'+group+'</summary>'+entries.map(([id,ico,label])=>'<button type="button" class="v11sidebtn '+(tab===id?'active':'')+'" data-a213-tab="'+id+'"><span class="ico">'+ico+'</span><span class="txt">'+label+'</span></button>').join('')+'</details>').join('');
   nav.querySelectorAll('[data-a213-tab]').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.a213Tab;window.render()}));
  }
  if(tab==='career'){
   const host=document.getElementById('body');
   if(host&&!host.querySelector('[data-v11-hire]')&&typeof v11candidates==='function')host.insertAdjacentHTML('beforeend','<h3>Подбор работников</h3>'+v11candidates());
  }
 };
 document.addEventListener('click',e=>{const b=e.target.closest('[data-v11-hire]');if(b&&typeof v11hire==='function'){e.preventDefault();e.stopImmediatePropagation();v11hire(Number(b.dataset.v11Hire));}},true);
})();
