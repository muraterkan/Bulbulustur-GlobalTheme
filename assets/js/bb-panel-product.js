/* Product editor demo: validation, tabs, image previews; never uploads or saves. */
(function(){
"use strict";
var root=document.querySelector("[data-bb-product]");
if(!root)return;
var form=root.querySelector("[data-bb-product-form]");
var pageTitle=document.querySelector(".bb-page-title");
if(pageTitle)pageTitle.textContent="Ürün Oluştur";
var crumb=document.querySelector(".bb-breadcrumb .breadcrumb");
if(crumb){
 crumb.replaceChildren();
 ["UYGULAMALAR","e-Ticaret","Ürün Oluştur"].forEach(function(value,i){
  var item=document.createElement("li");item.className="breadcrumb-item"+(i===2?" active":"");item.textContent=value;
  if(i===2)item.setAttribute("aria-current","page");
  crumb.appendChild(item);
 });
}
var tabs=Array.from(root.querySelectorAll("[data-bb-product-tab]"));
function selectTab(name,focus){
 tabs.forEach(function(tab){var active=tab.dataset.bbProductTab===name;tab.setAttribute("aria-selected",String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus();});
 root.querySelectorAll("[data-bb-product-pane]").forEach(function(p){p.hidden=p.dataset.bbProductPane!==name;});
}
tabs.forEach(function(tab,i){
 tab.addEventListener("click",function(){selectTab(tab.dataset.bbProductTab,false);});
 tab.addEventListener("keydown",function(e){var n=e.key==="ArrowRight"?(i+1)%tabs.length:e.key==="ArrowLeft"?(i+tabs.length-1)%tabs.length:e.key==="Home"?0:e.key==="End"?tabs.length-1:-1;if(n<0)return;e.preventDefault();selectTab(tabs[n].dataset.bbProductTab,true);});
});
var files=root.querySelector("[data-bb-product-files]"),thumb=root.querySelector("[data-bb-product-thumb]"),list=root.querySelector("[data-bb-product-media-list]"),upload=root.querySelector("[data-bb-product-upload]");
var urls=[];
function release(){urls.forEach(URL.revokeObjectURL);urls=[];}
function accept(incoming){
 var items=Array.from(incoming||[]).slice(0,10),valid=items.filter(function(file){return ["image/png","image/jpeg"].includes(file.type)&&file.size<=5*1024*1024;});
 release();list.replaceChildren();thumb.replaceChildren();
 if(!valid.length){var icon=document.createElement("span");icon.className="material-symbols-outlined";icon.textContent="imagesmode";thumb.append(icon);}
 valid.forEach(function(file,index){var url=URL.createObjectURL(file);urls.push(url);var li=document.createElement("li"),img=document.createElement("img");img.src=url;img.alt="Seçilen görsel "+(index+1);var span=document.createElement("span");span.textContent=file.name;li.append(img,span);list.append(li);if(index===0){var preview=document.createElement("img");preview.src=url;preview.alt="Ürün küçük görsel ön izlemesi";thumb.append(preview);}});
 root.querySelector("[data-bb-product-file-status]").textContent=valid.length+" / 10 geçerli görsel seçildi. PNG/JPEG, en fazla 5 MB. Dosyalar gönderilmez.";
}
files.addEventListener("change",function(){accept(files.files);});
["dragenter","dragover"].forEach(function(name){upload.addEventListener(name,function(e){e.preventDefault();upload.dataset.dragover="true";});});
["dragleave","drop"].forEach(function(name){upload.addEventListener(name,function(e){e.preventDefault();delete upload.dataset.dragover;if(name==="drop")accept(e.dataTransfer.files);});});
window.addEventListener("pagehide",release);
var price=root.querySelector("[data-bb-product-price]"),discount=root.querySelector("[data-bb-product-discount]"),value=root.querySelector("[data-bb-product-discount-value]"),result=root.querySelector("[data-bb-product-result]");
function updateDiscount(){
 var type=root.querySelector('[name="discountType"]:checked').value;
 value.hidden=type==="none";value.required=type!=="none";value.min=type==="percentage"?"0":"0.01";value.max=type==="percentage"?"100":"";value.placeholder=type==="percentage"?"Yüzde (%)":"İndirimli fiyat";
 discount.textContent=type==="none"?"İndirim uygulanmıyor":type==="percentage"?"Yüzde indirim":"Sabit indirimli fiyat";
}
root.querySelectorAll('[name="discountType"]').forEach(function(r){r.addEventListener("change",updateDiscount);});
root.querySelectorAll("[data-bb-product-editor-command]").forEach(function(button){button.addEventListener("click",function(){var field=root.querySelector("[data-bb-product-description]");var mark=button.dataset.bbProductEditorCommand;var start=field.selectionStart,end=field.selectionEnd,selected=field.value.slice(start,end)||"metin";var prefix=mark==="bold"?"**":mark==="italic"?"*":"__";field.setRangeText(prefix+selected+prefix,start,end,"select");field.focus();});});
form.addEventListener("submit",function(e){
 e.preventDefault();selectTab("general",false);
 if(!form.reportValidity()){var invalid=form.querySelector(":invalid");if(invalid){var pane=invalid.closest("[data-bb-product-pane]");if(pane)selectTab(pane.dataset.bbProductPane,false);invalid.focus();}return;}
 result.hidden=false;result.textContent="Ürün bilgileri doğrulandı. Bu ekran demo olduğu için ürün oluşturulmadı veya kaydedilmedi.";result.focus();
});
root.querySelector("[data-bb-product-reset]").addEventListener("click",function(){form.reset();accept([]);result.hidden=true;selectTab("general",false);updateDiscount();});
updateDiscount();selectTab("general",false);
})();