/* Subscription detail demo; no server-side billing or payment operations. */
(function () {
"use strict";
var root=document.querySelector("[data-bb-subscription]");
if(!root)return;
var customer=root.querySelector("[data-bb-sub-customer]");
var products=root.querySelector("[data-bb-sub-products]");
var methods=root.querySelectorAll('[name="subscriptionPayment"]');
var custom=root.querySelector("[data-bb-sub-custom]");
var status=root.querySelector("[data-bb-sub-result]");
var plans={basic:{name:"Başlangıç Planı",price:149.99},pro:{name:"Pro Plan",price:499.99},team:{name:"Ekip Planı",price:999.99}};
var selected=["basic","pro"];
var money=function(v){return new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY"}).format(v);};
function rows(){
  products.replaceChildren();
  selected.forEach(function(id){
    var plan=plans[id],tr=document.createElement("tr");
    var name=document.createElement("td");name.textContent=plan.name;
    var qty=document.createElement("td");qty.textContent="1";
    var price=document.createElement("td");price.textContent=money(plan.price)+" / ay";
    var action=document.createElement("td");
    var button=document.createElement("button");button.type="button";button.dataset.bbSubRemove=id;button.setAttribute("aria-label",plan.name+" ürününü kaldır");
    var icon=document.createElement("span");icon.className="material-symbols-outlined";icon.textContent="delete";icon.setAttribute("aria-hidden","true");button.append(icon);action.append(button);
    tr.append(name,qty,price,action);products.append(tr);
  });
  root.querySelector("[data-bb-sub-empty]").hidden=selected.length!==0;
  var total=selected.reduce(function(sum,id){return sum+plans[id].price;},0);
  root.querySelector("[data-bb-sub-total]").textContent=money(total)+" / ay";
  root.querySelector("[data-bb-sub-plan-summary]").textContent=selected.length?selected.map(function(id){return plans[id].name;}).join(", "):"Plan seçilmedi";
  root.querySelector("[data-bb-sub-create]").disabled=selected.length===0;
}
function sync(){
  var option=customer.options[customer.selectedIndex];
  root.querySelector("[data-bb-sub-customer-name]").textContent=option.dataset.name||"Müşteri seçilmedi";
  root.querySelector("[data-bb-sub-customer-email]").textContent=option.dataset.email||"";
  var method=root.querySelector('[name="subscriptionPayment"]:checked');
  root.querySelector("[data-bb-sub-payment-summary]").textContent=method?method.dataset.label:"Ödeme yöntemi seçilmedi";
  root.querySelectorAll("[data-bb-sub-payment-detail]").forEach(function(el){el.hidden=!method||el.dataset.bbSubPaymentDetail!==method.value;});
}
root.addEventListener("click",function(event){
 var remove=event.target.closest("[data-bb-sub-remove]");
 if(remove){selected=selected.filter(function(id){return id!==remove.dataset.bbSubRemove;});rows();return;}
 if(event.target.closest("[data-bb-sub-add-custom]")){
  var row=document.createElement("div");row.className="bb-subscription-custom-row";
  var key=document.createElement("input");key.className="form-control form-control-solid";key.name="customKey[]";key.maxLength=80;key.placeholder="Alan adı";key.setAttribute("aria-label","Özel alan adı");
  var value=document.createElement("input");value.className="form-control form-control-solid";value.name="customValue[]";value.maxLength=150;value.placeholder="Değer";value.setAttribute("aria-label","Özel alan değeri");
  var button=document.createElement("button");button.type="button";button.className="btn bb-btn-secondary btn-sm";button.textContent="Kaldır";button.dataset.bbSubRemoveCustom="";
  row.append(key,value,button);custom.append(row);return;
 }
 var removeCustom=event.target.closest("[data-bb-sub-remove-custom]");
 if(removeCustom){removeCustom.closest(".bb-subscription-custom-row").remove();return;}
 if(event.target.closest("[data-bb-sub-new-method]")){status.hidden=false;status.textContent="Yeni ödeme yöntemi ekleme bu statik demoda kullanılmıyor.";return;}
});
root.querySelector("[data-bb-sub-add]").addEventListener("click",function(){
 var control=root.querySelector("[data-bb-sub-plan-select]"),id=control.value;
 if(id&&plans[id]&&!selected.includes(id)){selected.push(id);rows();}
});
customer.addEventListener("change",sync);
methods.forEach(function(method){method.addEventListener("change",sync);});
root.querySelector("[data-bb-sub-form]").addEventListener("submit",function(event){
 event.preventDefault();
 if(!event.currentTarget.reportValidity()||!selected.length)return;
 status.hidden=false;status.textContent="Abonelik bilgileri doğrulandı. Demo sürümünde abonelik oluşturulmadı, ödeme alınmadı.";
 status.focus();
});
rows();sync();
})();
