/* Pricing plan comparison — demonstration only, no purchases or subscription creation. */
(function(){
"use strict";
var root=document.querySelector("[data-bb-pricing]");
if(!root)return;
var cycle="month",cycles=Array.from(root.querySelectorAll("[data-bb-pricing-cycle]"));
var amounts=Array.from(root.querySelectorAll("[data-bb-pricing-amount]"));
var result=root.querySelector("[data-bb-pricing-result]");
function render(){
 cycles.forEach(function(button){button.setAttribute("aria-pressed",String(button.dataset.bbPricingCycle===cycle));});
 amounts.forEach(function(label){
  var price=Number(label.dataset[cycle==="month"?"monthPrice":"yearPrice"]);
  label.textContent=new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",maximumFractionDigits:0}).format(price);
 });
 root.querySelectorAll("[data-bb-pricing-period]").forEach(function(label){label.textContent=cycle==="month"?"/ ay":"/ yıl";});
 var note=root.querySelector("[data-bb-pricing-saving]");
 if(note)note.textContent=cycle==="year"?"Yıllık tutarlar demo amaçlı %20 indirimli hesaplanmıştır.":"Yıllık plana geçerek örnek %20 avantajı görebilirsiniz.";
}
cycles.forEach(function(button){button.addEventListener("click",function(){cycle=button.dataset.bbPricingCycle;render();});});
root.querySelectorAll("[data-bb-pricing-select]").forEach(function(button){
 button.addEventListener("click",function(){
  result.hidden=false;
  result.textContent=button.dataset.bbPricingSelect+" planı seçildi ("+(cycle==="month"?"aylık":"yıllık")+"). Bu yalnızca arayüz demosudur; ödeme veya abonelik oluşturulmadı.";
  result.focus();
 });
});
var title=document.querySelector(".bb-page-title");
if(title)title.textContent="Fiyatlandırma / Planlar";
var crumb=document.querySelector(".bb-breadcrumb .breadcrumb");
if(crumb){crumb.replaceChildren();["SAYFALAR","Fiyatlandırma","Planlar"].forEach(function(value,i){var li=document.createElement("li");li.className="breadcrumb-item"+(i===2?" active":"");li.textContent=value;if(i===2)li.setAttribute("aria-current","page");crumb.appendChild(li);});}
render();
})();