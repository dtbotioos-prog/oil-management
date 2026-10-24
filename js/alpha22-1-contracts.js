/* Alpha 22.1: remove starter deals from legacy saves, preserve user contracts. */
(function(){
 const previousInit=v33init;
 v33init=function(){
  const d=previousInit();
  if(!d.starterContractsRemoved){
   d.contracts=d.contracts.filter(c=>c.created!=='Начальный договор' && c.id!==0);
   d.starterContractsRemoved=true;
  }
  return d;
 };
})();
