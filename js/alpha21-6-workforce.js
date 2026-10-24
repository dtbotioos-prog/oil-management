/* Alpha 21.6: demand-based field workforce, separate from legacy office HR. */
(function(){
 const roles=[
  {id:'operator',name:'Оператор добычи',base:1,per:5,pay:.48},
  {id:'mechanic',name:'Слесарь-ремонтник',base:1,per:12,pay:.43},
  {id:'electric',name:'Электромонтёр',base:1,per:20,pay:.45},
  {id:'master',name:'Мастер участка',base:1,per:25,pay:.68},
  {id:'driver',name:'Водитель',base:1,per:35,pay:.36},
  {id:'hse',name:'Инженер БиОТ',base:1,per:80,pay:.61}
 ];
 const surnames=['Ахметов','Сериков','Омаров','Ержанов','Нуртаев','Абдрахманов','Садыков','Ибраев','Касымов','Тлеубаев','Кенжебаев','Мухтаров'];
 const names=['Ерлан','Арман','Нуржан','Тимур','Данияр','Азамат','Бекзат','Марат','Айдос','Руслан','Алибек','Самат'];
 function workforce(){if(!s)return null; if(!s.fieldWorkforce||!Array.isArray(s.fieldWorkforce.staff))s.fieldWorkforce={staff:[],seq:0,history:[]};return s.fieldWorkforce}
 function demand(role){const n=Math.max(1,Number(s?.assets?.wellList?.length||s?.wells||1));return Math.max(role.base,Math.ceil(n/role.per))}
 function active(role){return workforce().staff.filter(x=>x.role===role&&x.status==='Работает')}
 function candidate(role,index){const seed=(index+roles.findIndex(r=>r.id===role)*3)%names.length;return {name:surnames[(seed+index*2)%surnames.length]+' '+names[seed]+' '+['Ермекович','Серикович','Маратович'][index%3],experience:2+(seed*3+index)%19,skill:64+(seed*7+index*9)%32, salary:Math.round(roles.find(r=>r.id===role).pay*(.86+((seed+index)%6)*.055)*100)/100}}
 function escapeText(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
 function view(){const wf=workforce();if(!wf)return '';const count=roles.reduce((n,r)=>n+active(r.id).length,0),need=roles.reduce((n,r)=>n+demand(r),0),pay=wf.staff.filter(x=>x.status==='Работает').reduce((n,x)=>n+x.salary,0);
 let out='<section class="a216-workforce"><h2>Подбор и увольнение · производство</h2><p class="muted">Потребность автоматически зависит от действующего фонда скважин. Зарплаты указаны в млн ₸/мес.</p><div class="a216-summary"><b>Работают: '+count+'</b><b>Требуется: '+need+'</b><b>Дефицит: '+Math.max(0,need-count)+'</b><b>ФОТ: '+pay.toFixed(2)+' млн ₸</b></div>';
 for(const r of roles){const have=active(r.id).length,required=demand(r),gap=Math.max(0,required-have);out+='<details class="a216-role" '+(gap?'open':'')+'><summary><b>'+r.name+'</b> · '+have+'/'+required+(gap?' · Нехватка '+gap:' · Укомплектовано')+'</summary><div class="a216-inner">';
 if(gap){out+='<p>Кандидаты на вакансию:</p>';for(let i=0;i<3;i++){const c=candidate(r.id,i);out+='<div class="a216-person"><span><b>'+escapeText(c.name)+'</b><small>Стаж '+c.experience+' лет · компетентность '+c.skill+'% · оклад '+c.salary.toFixed(2)+' млн ₸</small></span><button type="button" data-a216-hire="'+r.id+'" data-a216-index="'+i+'">Нанять</button></div>'}}else out+='<p class="muted">Штат укомплектован. При вводе новых скважин потребность пересчитается.</p>';
 for(const emp of active(r.id))out+='<div class="a216-person"><span><b>'+escapeText(emp.name)+'</b><small>Оклад '+emp.salary.toFixed(2)+' млн ₸ · стаж '+emp.experience+' лет</small></span><button type="button" data-a216-fire="'+emp.id+'">Уволить</button></div>';
 out+='</div></details>'}return out+'<p class="muted">Нехватка операторов снижает эффективную добычу; нехватка ремонтников увеличивает производственные потери. Данные персонала сохраняются вместе с карьерой.</p></section>'}
 // Place recruitment on both personnel screens and provide a dedicated sidebar entry.
 if(typeof a212Sections!=='undefined'){
  for(const section of a212Sections){section[1].splice(0,section[1].length,...section[1].filter(item=>!['group','refinery','retail','fleet'].includes(item[0])));}
  const personnel=a212Sections.find(section=>section[0]==='Персонал');
  if(personnel&&!personnel[1].some(item=>item[0]==='workforce'))personnel[1].splice(1,0,['workforce','🧰','Подбор производственного персонала']);
 }
 const oldRender=render;render=function(){
  const dedicated=tab==='workforce';
  if(dedicated)tab='career';
  oldRender();
  if(dedicated)tab='workforce';
  if(!s||!['staff','career','workforce'].includes(tab))return;
  const body=document.getElementById('body');
  if(body){
   if(dedicated)body.innerHTML=view();
   else body.insertAdjacentHTML('afterbegin',view());
  }
  if(dedicated){
   document.querySelectorAll('[data-a213-tab],[data-a212-tab]').forEach(b=>b.classList.toggle('active',b.dataset.a213Tab==='workforce'||b.dataset.a212Tab==='workforce'));
  }
 };
 document.addEventListener('click',async function(e){const b=e.target.closest('[data-a216-hire],[data-a216-fire]');if(!b||!s)return;e.preventDefault();e.stopImmediatePropagation();const wf=workforce();
 if(b.dataset.a216Hire){const role=b.dataset.a216Hire,idx=Number(b.dataset.a216Index),r=roles.find(x=>x.id===role);if(!r||active(role).length>=demand(r))return;const c=candidate(role,idx);if(wf.staff.some(x=>x.status==='Работает'&&x.name===c.name))return uiAlert('Этот кандидат уже работает');if(!await uiConfirm('Нанять '+c.name+' · '+r.name+'? Оклад '+c.salary+' млн ₸/мес.'))return;const fee=Math.round(c.salary*.25*100)/100;if(s.cash<fee)return uiAlert('Недостаточно средств на подбор');s.cash-=fee;wf.staff.push({...c,id:'F'+(++wf.seq),role,status:'Работает'});wf.history.unshift('Нанят '+c.name+' · '+r.name);}
 else {const emp=wf.staff.find(x=>x.id===b.dataset.a216Fire&&x.status==='Работает');if(!emp||!await uiConfirm('Уволить '+emp.name+'? Должность станет вакантной.'))return;emp.status='Уволен';wf.history.unshift('Уволен '+emp.name);}
 wf.history=wf.history.slice(0,80);save();render();},true);
 // Charge workforce wages once per in-game month, not once per day.
 const oldNext=next;next=function(){
  const before=s?{year:s.year,month:s.month,day:s.day,period:s.monthIndex,stamp:typeof v8date==='function'?v8date():''}:null;
  oldNext();
  if(!s||!before||s.dead)return;
  const after=typeof v8date==='function'?v8date():'';
  const monthChanged=(Number.isFinite(before.month)&&s.month!==before.month)||(Number.isFinite(before.monthIndex)&&s.monthIndex!==before.monthIndex)||(before.stamp&&after&&before.stamp.slice(3)!==after.slice(3));
  if(!monthChanged)return;
  const wf=workforce();const payroll=wf.staff.filter(x=>x.status==='Работает').reduce((n,x)=>n+x.salary,0);
  if(!payroll)return;
  s.cash-=payroll;
  if(Number.isFinite(s.profit))s.profit-=payroll;
  if(typeof log==='function')log('Зарплата производственного персонала: '+payroll.toFixed(2)+' млн ₸');
  save();render();
 };
})();
