(function(){
"use strict";
var page=document.querySelector("[data-bb-draugr-page]"); if(!page)return;
var views={
 dashboard:{title:"Draugr Dashboard",label:"Dashboard"},
 storefront:{title:"Draugr / Vitrin",label:"Vitrin"},
 navigation:{title:"Draugr / Kategoriler & Navigasyon",label:"Kategoriler & Navigasyon"},
 content:{title:"Draugr / Sayfalar & İçerik",label:"Sayfalar & İçerik"},
 theme:{title:"Draugr / Tema & View Mode",label:"Tema & View Mode"},
 domain:{title:"Draugr / Domain & SEO",label:"Domain & SEO"},
 localization:{title:"Draugr / Dil & Yerelleştirme",label:"Dil & Yerelleştirme"},
 settings:{title:"Draugr / Kanal Ayarları",label:"Kanal Ayarları"},
 subscription:{title:"Draugr / Abonelik",label:"Abonelik"}
};
var view=new URLSearchParams(location.search).get("view")||"dashboard";
if(!views[view])view="dashboard";
page.querySelectorAll("[data-bb-draugr-view]").forEach(function(node){node.hidden=node.dataset.bbDraugrView!==view;});
var title=document.querySelector(".bb-page-title"); if(title)title.textContent=views[view].title;
var crumb=document.querySelector(".bb-breadcrumb .breadcrumb");
if(crumb)crumb.innerHTML='<li class="breadcrumb-item"><a href="draugr.html?view=dashboard">Draugr</a></li><li class="breadcrumb-item active" aria-current="page">'+views[view].label+'</li>';
var currentId="draugr-"+view;
document.querySelectorAll("[data-bb-draugr-view-link]").forEach(function(link){
 var active=link.dataset.bbDraugrViewLink===view;
 link.classList.toggle("active",active);
 if(active){link.setAttribute("aria-current","page"); var item=link.closest("[data-bb-menu-trigger]"); if(item){item.classList.add("show"); var button=item.querySelector(":scope > .bb-menu-link"); var sub=item.querySelector(":scope > .bb-menu-sub"); if(button)button.setAttribute("aria-expanded","true"); if(sub){sub.setAttribute("aria-hidden","false");sub.inert=false;}}} else link.removeAttribute("aria-current");
});
page.querySelectorAll("[data-bb-draugr-form]").forEach(function(form){form.addEventListener("submit",function(e){e.preventDefault();if(!form.reportValidity())return;var status=form.querySelector("[data-bb-draugr-status]")||page.querySelector("[data-bb-draugr-status]");if(status)status.textContent="Değişiklikler demo olarak kaydedildi.";});});
page.querySelectorAll("[data-bb-draugr-theme]").forEach(function(button){button.addEventListener("click",function(){page.querySelectorAll("[data-bb-draugr-theme]").forEach(function(item){item.setAttribute("aria-pressed",String(item===button));});var status=page.querySelector("[data-bb-draugr-status]");if(status)status.textContent=button.dataset.bbDraugrTheme+" tema yönü seçildi.";});});
page.querySelectorAll("[data-bb-draugr-demo-action]").forEach(function(button){button.addEventListener("click",function(){var status=page.querySelector("[data-bb-draugr-status]");if(status)status.textContent=button.dataset.bbDraugrDemoAction+" demo aksiyonu çalıştırıldı.";});});
}());
