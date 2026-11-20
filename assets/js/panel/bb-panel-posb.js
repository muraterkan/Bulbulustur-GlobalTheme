(function(){
"use strict";
var page=document.querySelector("[data-bb-posb-page]");if(!page)return;
var views={
branches:{title:"PosB / Branches",label:"Branches"},
registers:{title:"PosB / Cash Registers",label:"Cash Registers"},
shifts:{title:"PosB / Vardiya & Gün",label:"Vardiya & Gün"},
invoices:{title:"PosB / Invoices",label:"Invoices"},
"invoice-settings":{title:"PosB / Invoice Settings",label:"Invoice Settings"},
warehouses:{title:"PosB / Warehouses",label:"Warehouses"},
stock:{title:"PosB / Stock",label:"Stock"},
transfers:{title:"PosB / Transferler",label:"Transferler"},
customers:{title:"PosB / Customerler",label:"Customerler"},
suppliers:{title:"PosB / Suppliers",label:"Suppliers"}
};
var view = new URLSearchParams(location.search).get("view");
if (!Object.hasOwn(views, view)) {
  window.location.replace("pos-system.html");
  return;
}
page.querySelectorAll("[data-bb-posb-view]").forEach(function(n){n.hidden=n.dataset.bbPosbView!==view;});
var t=document.querySelector(".bb-page-title");if(t)t.textContent=views[view].title;
var crumb=document.querySelector(".bb-breadcrumb .breadcrumb");if(crumb)crumb.innerHTML='<li class="breadcrumb-item"><a href="pos-system.html">PosB</a></li><li class="breadcrumb-item active" aria-current="page">'+views[view].label+'</li>';
page.querySelectorAll("[data-bb-posb-form]").forEach(function(form){form.addEventListener("submit",function(e){e.preventDefault();if(!form.reportValidity())return;var s=form.querySelector("[data-bb-posb-status]")||page.querySelector("[data-bb-posb-status]");if(s)s.textContent="Değişiklikler demo olarak kaydedildi.";});});
page.querySelectorAll("[data-bb-posb-action]").forEach(function(btn){btn.addEventListener("click",function(){var s=page.querySelector("[data-bb-posb-status]");if(s)s.textContent=btn.dataset.bbPosbAction+" demo aksiyonu çalıştırıldı.";});});
}());
