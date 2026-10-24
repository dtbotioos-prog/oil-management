/* Alpha 21.8: render-consistent well pagination and accessible workforce navigation. */
(function(){
 const previous=window.render;
 window.render=function(){
  previous();
  if(typeof s==='undefined'||!s)return;
  const nav=document.getElementById('v11sideitems');
  if(nav){
   const personnel=[...nav.querySelectorAll('details')].find(d=>/Персонал/.test(d.querySelector('summary')?.textContent||''));
   if(personnel){const items=personnel.querySelectorAll('[data-a213-tab="workforce"],[data-a212-tab="workforce"]');
    if(!items.length){const b=document.createElement('button');b.type='button';b.className='v11sidebtn'+(tab==='workforce'?' active':'');b.innerHTML='<span class="ico">🧰</span><span class="txt">Подбор и увольнение</span>';b.onclick=()=>{tab='workforce';render()};personnel.appendChild(b);}
   }
  }
 };
 document.addEventListener('click',e=>{const b=e.target.closest('[data-v5-well-page]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();v5WellPage+=b.dataset.v5WellPage==='next'?1:-1;render()},true);
})();
