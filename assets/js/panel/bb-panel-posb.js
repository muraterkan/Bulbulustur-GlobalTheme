(function(){
"use strict";
var page=document.querySelector("[data-bb-posb-page]");if(!page)return;
var views={
dashboard:{title:"POSB Dashboard",label:"Dashboard"},
branches:{title:"POSB / Şubeler",label:"Şubeler"},
registers:{title:"POSB / Kasalar",label:"Kasalar"},
shifts:{title:"POSB / Vardiya & Gün",label:"Vardiya & Gün"},
invoices:{title:"POSB / Faturalar",label:"Faturalar"},
"invoice-settings":{title:"POSB / Fatura Ayarları",label:"Fatura Ayarları"},
warehouses:{title:"POSB / Depolar",label:"Depolar"},
stock:{title:"POSB / Stok",label:"Stok"},
transfers:{title:"POSB / Transferler",label:"Transferler"},
customers:{title:"POSB / Müşteriler",label:"Müşteriler"},
suppliers:{title:"POSB / Tedarikçiler",label:"Tedarikçiler"}
};
var view=new URLSearchParams(location.search).get("view")||"dashboard";if(!views[view])view="dashboard";
page.querySelectorAll("[data-bb-posb-view]").forEach(function(n){n.hidden=n.dataset.bbPosbView!==view;});
var t=document.querySelector(".bb-page-title");if(t)t.textContent=views[view].title;
var crumb=document.querySelector(".bb-breadcrumb .breadcrumb");if(crumb)crumb.innerHTML='<li class="breadcrumb-item"><a href="posb.html?view=dashboard">POSB</a></li><li class="breadcrumb-item active" aria-current="page">'+views[view].label+'</li>';
document.querySelectorAll("[data-bb-posb-view-link]").forEach(function(link){var active=link.dataset.bbPosbViewLink===view;link.classList.toggle("active",active);if(active){link.setAttribute("aria-current","page");var node=link.parentElement;while(node&&node!==document.querySelector("[data-bb-panel]")){if(node.classList&&node.classList.contains("bb-menu-item")&&node.hasAttribute("data-bb-menu-trigger")){node.classList.add("show");var b=node.querySelector(":scope > .bb-menu-link");var sub=node.querySelector(":scope > .bb-menu-sub");if(b)b.setAttribute("aria-expanded","true");if(sub){sub.setAttribute("aria-hidden","false");sub.inert=false;}}node=node.parentElement;}}else link.removeAttribute("aria-current");});
page.querySelectorAll("[data-bb-posb-form]").forEach(function(form){form.addEventListener("submit",function(e){e.preventDefault();if(!form.reportValidity())return;var s=form.querySelector("[data-bb-posb-status]")||page.querySelector("[data-bb-posb-status]");if(s)s.textContent="Değişiklikler demo olarak kaydedildi.";});});
page.querySelectorAll("[data-bb-posb-action]").forEach(function(btn){btn.addEventListener("click",function(){var s=page.querySelector("[data-bb-posb-status]");if(s)s.textContent=btn.dataset.bbPosbAction+" demo aksiyonu çalıştırıldı.";});});
}());
