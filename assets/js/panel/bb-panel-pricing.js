/* Pricing plan comparison — demonstration only, no purchases or subscription creation. */
(function(){
"use strict";
var root=document.querySelector("[data-bb-pricing]");
if(!root)return;
var product=new URLSearchParams(window.location.search).get("product");
if(product==="posx")product="posb";
var cycle="month",cycles=Array.from(root.querySelectorAll("[data-bb-pricing-cycle]"));
var amounts=Array.from(root.querySelectorAll("[data-bb-pricing-amount]"));
var result=root.querySelector("[data-bb-pricing-result]");

var productPlans=window.BBPanelServicePlans || {};

function applyProductContext(){
 var config=productPlans[product];
 if(!config)return;
 cycle="year";
 var introTitle=root.querySelector(".bb-pricing-intro h2");
 var introCopy=root.querySelector(".bb-pricing-intro p");
 if(introTitle)introTitle.textContent=config.title;
 if(introCopy)introCopy.textContent=config.intro;
 var switcher=root.querySelector(".bb-pricing-switch");
 if(switcher)switcher.hidden=true;
 var planEls=Array.from(root.querySelectorAll(".bb-pricing-plan"));
 planEls.forEach(function(planEl,index){
  var plan=config.plans[index];
  if(!plan)return;
  var heading=planEl.querySelector("h3");
  var desc=planEl.querySelector(".bb-pricing-desc");
  var amount=planEl.querySelector("[data-bb-pricing-amount]");
  var features=planEl.querySelector(".bb-pricing-features");
  var select=planEl.querySelector("[data-bb-pricing-select]");
  if(heading)heading.textContent=plan.name;
  if(desc)desc.textContent=plan.desc;
  if(amount){
   amount.dataset.yearPrice=String(plan.year);
   amount.dataset.monthPrice=String(Math.round(plan.year/12));
  }
  if(features){
   features.replaceChildren();
   plan.features.forEach(function(text){
    var li=document.createElement("li");
    li.dataset.unavailable="false";
    li.innerHTML='<span>'+text+'</span><span class="material-symbols-outlined" aria-label="Dahil">check_circle</span>';
    features.appendChild(li);
   });
  }
  if(select){
   select.dataset.bbPricingSelect=plan.name;
   select.textContent="Sepete Ekle";
  }
 });
 var pageTitle=document.querySelector(".bb-page-title");
 if(pageTitle)pageTitle.textContent=config.title;
 var saving=root.querySelector("[data-bb-pricing-saving]");
 if(saving)saving.textContent="Paket içerikleri ve fiyatlar ürün bağlamına göre gösterilir.";
}
applyProductContext();
function render(){
 cycles.forEach(function(button){button.setAttribute("aria-pressed",String(button.dataset.bbPricingCycle===cycle));});
 amounts.forEach(function(label){
  var price=Number(label.dataset[cycle==="month"?"monthPrice":"yearPrice"]);
  label.textContent=new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",maximumFractionDigits:0}).format(price);
 });
 root.querySelectorAll("[data-bb-pricing-period]").forEach(function(label){label.textContent=cycle==="month"?"/ ay":"/ yıl";});
 var note=root.querySelector("[data-bb-pricing-saving]");
 if(note)note.textContent=productPlans[product]?"Paket tutarları temsili olup gerçek fiyat ve vergiler ödeme sisteminde belirlenir.":(cycle==="year"?"Annual tutarlar demo amaçlı %20 indirimli hesaplanmıştır.":"Annual plana geçerek örnek %20 avantajı görebilirsiniz.");
}
cycles.forEach(function(button){button.addEventListener("click",function(){cycle=button.dataset.bbPricingCycle;render();});});
root.querySelectorAll("[data-bb-pricing-select]").forEach(function(button){
 button.addEventListener("click",function(){
  if(productPlans[product]){
   var index=Array.from(root.querySelectorAll(".bb-pricing-plan")).indexOf(button.closest(".bb-pricing-plan"));
   var keys=product==="draugr"?["basic","pro","custom"]:["basic","pro","enterprise"];
   if(index>=0 && keys[index]){
    window.location.assign("cart.html?product="+encodeURIComponent(product)+"&plan="+encodeURIComponent(keys[index]));
    return;
   }
  }
  result.hidden=false;
  result.textContent=button.dataset.bbPricingSelect+" planı seçildi ("+(cycle==="month"?"aylık":"yıllık")+"). Bu yalnızca arayüz demosudur; ödeme veya abonelik oluşturulmadı.";
  result.focus();
 });
});
var title=document.querySelector(".bb-page-title");
if(title&&!productPlans[product])title.textContent="Pricing / Planlar";
var crumb=document.querySelector(".bb-breadcrumb .breadcrumb");
if(crumb){
 var crumbValues=productPlans[product]?["HİZMETLER",product==="draugr"?"Draugr":"PosB","Paketler"]:["PAGES","Pricing","Planlar"];
 crumb.replaceChildren();
 crumbValues.forEach(function(value,i){var li=document.createElement("li");li.className="breadcrumb-item"+(i===2?" active":"");li.textContent=value;if(i===2)li.setAttribute("aria-current","page");crumb.appendChild(li);});
}
render();
})();