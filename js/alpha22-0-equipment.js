/* Alpha 22.0: render each registered well, tank, pump and KTP separately. */
(function(){
 let equipmentPage=0;
 window.v5cards=function(){
  if(!s?.small)return '';
  ensureAssets();
  const wells=s.assets.wellList||[], infra=s.assets.infrastructure||[];
  const tanks=(typeof v30init==='function'?v30init().tanks:[])||[];
  const status=o=>!o?'stop':/ремонт/i.test(String(o.status||''))?'repair':/останов|отключ|авари/i.test(String(o.status||''))?'stop':Number(o.health??o.condition??100)<35?'repair':'work';
  const perPage=12,wellPages=Math.max(1,Math.ceil(wells.length/perPage));
  v5WellPage=Math.max(0,Math.min(v5WellPage,wellPages-1));
  const wellCards=wells.slice(v5WellPage*perPage,(v5WellPage+1)*perPage).map(w=>v5card('Скважина №'+w.id,'well',status(w),(w.status==='Работает'?f(Number(w.rate)||0):'0')+' т/сут · '+(w.status||'Не определён'))).join('');
  const eq=[],registered=new Set();
  tanks.forEach((o,i)=>{const id=String(o.id??i+1),cap=Number(o.capacity)||1000,level=Number(o.level)||0;registered.add(id);eq.push({title:o.name||'РВС №'+id,type:'tank',status:status(o),metric:f(level)+' / '+f(cap)+' т · '+f(100*level/cap)+'%',level:100*level/cap})});
  const seen=new Set();
  infra.forEach(o=>{
   const id=String(o.id||''),name=String(o.type||''),full=id+' '+name;
   let type=/РВС|резервуар/i.test(full)?'tank':/КТП|трансформатор|подстанц/i.test(full)?'power':/насос|ДНС|БКНС|НПС/i.test(full)?'pump':null;
   if(!type||seen.has(id))return;seen.add(id);
   if(type==='tank'&&tanks.length&&(/РВС[- №]*1\b/i.test(id)||registered.has(id.replace(/\D/g,''))))return;
   eq.push({title:id||name,type,status:status(o),metric:'Готовность '+f(Number(o.health??o.condition??0))+'%'+(o.status?' · '+o.status:''),level:Number(o.levelPct)||0});
  });
  const eqPages=Math.max(1,Math.ceil(eq.length/perPage));equipmentPage=Math.max(0,Math.min(equipmentPage,eqPages-1));
  // v5card uses tank #1's fill level; replace its tank SVG for each distinct RVS.
  const eqCards=eq.slice(equipmentPage*perPage,(equipmentPage+1)*perPage).map(o=>{
   let html=v5card(o.title,o.type,o.status,o.metric);
   if(o.type==='tank')html=html.replace(/<svg viewBox="0 0 150 100"[\s\S]*?<\/svg>/,v5svg('tank',o.status,Math.max(0,Math.min(100,o.level))));
   return html;
  }).join('');
  const pager=(kind,page,pages,count)=>pages>1?'<div class="a218-pages"><button data-v220-page="'+kind+'" data-dir="prev" '+(page===0?'disabled':'')+'>←</button><span>'+(page+1)+' / '+pages+' · всего '+count+'</span><button data-v220-page="'+kind+'" data-dir="next" '+(page===pages-1?'disabled':'')+'>→</button></div>':'';
  return '<section class="v5-operations" data-v220-cards="1"><div class="v5-operations-title"><h2>Скважины · '+wells.length+'</h2><span>Индивидуальный дебит и статус</span></div><div class="v5-equipment-grid">'+wellCards+'</div>'+pager('well',v5WellPage,wellPages,wells.length)+'<div class="v5-operations-title"><h2>РВС · насосы · КТП · '+eq.length+'</h2><span>По факту ввода в эксплуатацию</span></div><div class="v5-equipment-grid">'+eqCards+'</div>'+pager('equipment',equipmentPage,eqPages,eq.length)+'</section>';
 };
 document.addEventListener('click',function(e){const b=e.target.closest('[data-v220-page]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const n=b.dataset.dir==='next'?1:-1;if(b.dataset.v220Page==='well')v5WellPage=Math.max(0,v5WellPage+n);else equipmentPage=Math.max(0,equipmentPage+n);render()},true);
})();
