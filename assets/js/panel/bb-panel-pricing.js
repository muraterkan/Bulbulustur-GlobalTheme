/* Pricing plan comparison — demonstration only, no purchases or subscription creation. */
(function(){
"use strict";
var root=document.querySelector("[data-bb-pricing]");
if(!root)return;
var product=new URLSearchParams(window.location.search).get("product");
var cycle="month",cycles=Array.from(root.querySelectorAll("[data-bb-pricing-cycle]"));
var amounts=Array.from(root.querySelectorAll("[data-bb-pricing-amount]"));
var result=root.querySelector("[data-bb-pricing-result]");

var productPlans={
 draugr:{
  title:"Draugr Paketleri",
  intro:"Kendi domaininizde çalışan Draugr mağazanız için uygun paketi seçin.",
  plans:[
   {name:"Draugr Basic",desc:"Hızlı başlangıç ve temel marka görünümü",year:2500,features:["Kendi domaini","Hazır tema","Temel içerik yönetimi","Merkezi ürün ve stok"]},
   {name:"Draugr Pro",desc:"Büyüyen mağazalar için içerik ve SEO kontrolü",year:10000,features:["Gelişmiş tema ayarları","Sayfa ve içerik yönetimi","Dil ve SEO araçları","Kategori Router"]},
   {name:"Draugr Custom",desc:"Özel tasarım ve daha ileri ihtiyaçlar",year:100000,features:["Özel tema çalışması","İleri içerik yapısı","Özel entegrasyon ihtiyaçları","Öncelikli destek"]}
  ]
 },
 posb:{
  title:"PosB Paketleri",
  intro:"Fiziksel mağaza, kasa ve şube operasyonunuz için uygun PosB paketini seçin.",
  plans:[
   {name:"PosB Basic",desc:"Tek mağaza ve temel hızlı satış akışı",year:499,features:["Hızlı satış ekranı","Temel stok görünümü","1 şube / kasa yapısı","Merkezi müşteri verisi"]},
   {name:"PosB Pro",desc:"Çoklu şube, kasa ve operasyon yönetimi",year:999,features:["Çoklu şube & kasa","Depo ve transfer","Fatura ayarları","Vardiya & gün yönetimi"]},
   {name:"PosB Enterprise",desc:"Daha büyük mağaza operasyonları için",year:1999,features:["Gelişmiş şube yapısı","Öncelikli entegrasyonlar","Gelişmiş raporlama","Öncelikli destek"]}
  ]
 }
};

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
   select.textContent="Bu Pakete Başvur";
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
 if(note)note.textContent=cycle==="year"?"Yıllık tutarlar demo amaçlı %20 indirimli hesaplanmıştır.":"Yıllık plana geçerek örnek %20 avantajı görebilirsiniz.";
}
cycles.forEach(function(button){button.addEventListner("click",function(){cycle=button.dataset.bbPricingCycle;render();});});
root.querySelectorAll("[data-bb-pricing-select]").forEach(function(button){
 button.addEventListner("click",function(){
  result.hidden=false;
  result.textContent=button.dataset.bbPricingSelect+" planı seçildi ("+(cycle==="month"?"aylık":"yıllık")+"). Bu yalnızca arayüz demosudur; ödeme veya abonelik oluşturulmadı.";
  result.focus();
 });
});
var title=document.querySelector(".bb-page-title");
if(title&&!productPlans[product])title.textContent="Fiyatlandırma / Planlar";
var crumb=document.querySelector(".bb-breadcrumb .breadcrumb");
if(crumb){
 var crumbValues=productPlans[product]?["HİZMETLER",product==="draugr"?"Draugr":"PosB","Paketler"]:["PAGES","Fiyatlandırma","Planlar"];
 crumb.replaceChildren();
 crumbValues.forEach(function(value,i){var li=document.createElement("li");li.className="breadcrumb-item"+(i===2?" active":"");li.textContent=value;if(i===2)li.setAttribute("aria-current","page");crumb.appendChild(li);});
}
render();
})();