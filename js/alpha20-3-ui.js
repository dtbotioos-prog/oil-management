/* Independent bootstrap: menu stays visible if the game bundle fails. */
(function(){'use strict';
const root=document.getElementById('v5a202-home');
if(!root)return;
const $=id=>document.getElementById(id);
function error(message){const el=$('v5a202-detail');if(el)el.textContent=message;}
function ready(){return typeof window.v5a202Main==='function' && typeof window.show==='function';}
// The game bundle uses top-level lexical declarations, which are not window properties.
function invoke(code){try{return (0,eval)(code);}catch(e){error('Ошибка игры: '+e.message);return null;}}
function hide(){root.classList.add('hide');}
function setup(){if(!$('setup'))return error('Форма компании не найдена.');hide();$('game')?.classList.add('hide');$('setup').classList.remove('hide');}
function load(){if(typeof v5a202Main==='function'){v5a202Main();root.querySelector('[data-a202="load"]')?.click();return;}error('Модуль сохранений не загрузился. Обновите страницу.');}
function bindFallback(){root.querySelector('[data-a202="new"]')?.addEventListener('click',setup);root.querySelector('[data-a202="load"]')?.addEventListener('click',load);root.querySelector('[data-a202="about"]')?.addEventListener('click',()=>error('Симулятор нефтяного бизнеса: добыча, НПЗ, логистика, АЗС, персонал и финансы. Параметры условные.'));root.querySelector('[data-a202="share"]')?.addEventListener('click',()=>{const url=location.href.split('?')[0];if(navigator.share)navigator.share({title:'Oil Management Simulator',url}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(url).then(()=>error('Ссылка скопирована')).catch(()=>error(url));else error(url);});}
// If the game successfully initialized, it owns the menu handlers. Otherwise use the safe fallback.
if(typeof v5a202Main!=='function')bindFallback();
else {try{v5a202Main();}catch(e){bindFallback();error('Ошибка запуска: '+e.message);}}
function makeQuick(){if($('v5a203-quick'))return;const host=document.querySelector('header');if(!host)return;const bar=document.createElement('div');bar.id='v5a203-quick';bar.innerHTML='<button type="button" data-q="save">💾 Сохранить</button><button type="button" data-q="as">Сохранить как</button><button type="button" data-q="home">⌂ Главное меню</button>';host.insertAdjacentElement('afterend',bar);bar.addEventListener('click',e=>{const b=e.target.closest('[data-q]');if(!b)return;const op=b.dataset.q;if(op==='home'){if(typeof v5a202Main==='function')v5a202Main();else root.classList.remove('hide');return;}if(!document.querySelector('#game:not(.hide)'))return alert('Сначала начните игру.');if(op==='save'){if(typeof v5a202SaveCurrent!=='function')return alert('Сохранение недоступно');const r=v5a202SaveCurrent();alert(r.ok?'Игра сохранена':r.error);}if(op==='as'){if(typeof v5a202SaveAsUI==='function')v5a202SaveAsUI();else alert('Сохранение недоступно');}});}
makeQuick();
})();
