/* Alpha 21.5: retire downstream modules without mutating legacy save data. */
(function(){
const retired=new Set(['group','refinery','retail','fleet']);
const retiredNames=/^(холдинг|нпз|азс|логистика топлива|дочерние предприятия|нефтепереработка)$/i;
function clean(){
 document.querySelectorAll('[data-tab],[data-a213-tab],[data-a212-tab]').forEach(el=>{
   const id=el.getAttribute('data-tab')||el.getAttribute('data-a213-tab')||el.getAttribute('data-a212-tab');
   if(retired.has(id))el.remove();
 });
 document.querySelectorAll('#v11sideitems button, #v13nav button').forEach(el=>{if(retiredNames.test(el.textContent.trim()))el.remove()});
 document.querySelectorAll('[data-v5a201-subtab],[data-v5a201-tab]').forEach(el=>{const id=el.dataset.v5a201Subtab||el.dataset.v5a201Tab;if(retired.has(id))el.remove()});
}
const prior=window.render;
if(typeof prior==='function')window.render=function(){if(retired.has(window.tab))window.tab='finance';prior();clean()};
document.addEventListener('DOMContentLoaded',clean);
})();
