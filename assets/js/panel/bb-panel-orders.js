/* Order listing demo: filters, paging and row actions; no API or persistence. */
(function(){
"use strict";
var root=document.querySelector("[data-bb-orders]");if(!root)return;
var search=root.querySelector("[data-bb-orders-search]"),from=root.querySelector("[data-bb-orders-from]"),to=root.querySelector("[data-bb-orders-to]"),status=root.querySelector("[data-bb-orders-status]"),limit=root.querySelector("[data-bb-orders-limit]");
var body=root.querySelector("[data-bb-orders-body]"),pages=root.querySelector("[data-bb-orders-pages]"),range=root.querySelector("[data-bb-orders-range]"),count=root.querySelector("[data-bb-orders-count]"),selectedCount=root.querySelector("[data-bb-orders-selected]"),checkAll=root.querySelector("[data-bb-orders-check-all]"),bulk=root.querySelector("[data-bb-orders-bulk]"),notice=root.querySelector("[data-bb-orders-notice]"),empty=root.querySelector("[data-bb-orders-empty]");
var customers=["Francis Mitcham","Ethan Wilder","John Miller","Neil Owen","Brian Cox","Sean Bean","Ayşe Demir","Mehmet Kaya","Zeynep Arslan","Deniz Yılmaz"];
var statuses=["Tamamlandı","Beklemede","Tamamlandı","Beklemede","Tamamlandı","Cancel","Tamamlandı","Tamamlandı","İade","Beklemede"];
var orders=Array.from({length:50},function(_,i){
 var date=new Date(Date.UTC(2026,9,31-Math.floor(i/2)));var updated=new Date(date.getTime()+86400000*(i%5));
 var iso=function(d){return d.toISOString().slice(0,10);};
 return{id:String(14328+i),customer:customers[i%customers.length],status:statuses[i%statuses.length],total:129+(i*37)%510,created:iso(date),modified:iso(updated)};
});
var selection=new Set(),page=1;
function labelDate(value){var p=value.split("-");return p[2]+"."+p[1]+"."+p[0];}
function money(value){return new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY"}).format(value);}
function element(tag,cls,txt){var node=document.createElement(tag);if(cls)node.className=cls;if(txt!==undefined)node.textContent=txt;return node;}
function info(message){notice.hidden=false;notice.textContent=message;notice.focus();}
function filtered(){var query=search.value.trim().toLocaleLowerCase("tr-TR");return orders.filter(function(o){return(!query||(o.id+" "+o.customer).toLocaleLowerCase("tr-TR").includes(query))&&(!status.value||o.status===status.value)&&(!from.value||o.created>=from.value)&&(!to.value||o.created<=to.value);});}
function render(){
 var filteredOrders=filtered(),size=Number(limit.value),maxPage=Math.max(1,Math.ceil(filteredOrders.length/size));page=Math.min(page,maxPage);
 var visible=filteredOrders.slice((page-1)*size,page*size);body.replaceChildren();pages.replaceChildren();
 visible.forEach(function(o){
  var tr=element("tr");
  var select=element("td"),checkbox=element("input","form-check-input");checkbox.type="checkbox";checkbox.dataset.bbOrdersSelect=o.id;checkbox.checked=selection.has(o.id);checkbox.setAttribute("aria-label","Sipariş "+o.id+" seç");select.append(checkbox);
  var id=element("td"),link=element("a","bb-orders-id","#"+o.id);link.href="order-details.html";link.title="Örnek sipariş #14534 detayını görüntüle";id.append(link);
  var customer=element("td"),person=element("div","bb-orders-customer"),avatar=element("span","bb-symbol size-40 is-circle"),avLabel=element("span","bb-symbol-label",o.customer.split(" ").map(function(x){return x[0];}).join(""));avatar.append(avLabel);
  var name=element("a","",o.customer);name.href=link.href;person.append(avatar,name);customer.append(person);
  var state=element("td"),badge=element("span","badge bb-badge "+(o.status==="Tamamlandı"?"bb-badge-light-success":o.status==="Beklemede"?"bb-badge-light-warning":o.status==="İade"?"bb-badge-light-primary":"bb-badge-light-danger"),o.status);state.append(badge);
  var total=element("td","",money(o.total)),added=element("td","",labelDate(o.created)),modified=element("td","",labelDate(o.modified));
  var actions=element("td"),dropdown=element("div","dropdown bb-action-menu"),trigger=element("button","btn bb-btn-secondary btn-sm bb-action-menu-toggle","Actionler");trigger.type="button";trigger.setAttribute("data-bs-toggle","dropdown");trigger.setAttribute("aria-expanded","false");trigger.setAttribute("aria-label","Sipariş "+o.id+" işlemleri");
  var menu=element("ul","dropdown-menu dropdown-menu-end bb-dropdown-menu bb-action-menu-list");
  [["Görüntüle","view"],["Edit","edit"],["Sil","delete"]].forEach(function(action){var li=element("li");if(action[1]==="view"){var a=element("a","dropdown-item",action[0]);a.href=link.href;a.title="Örnek sipariş #14534 (bu satırın gerçek detayı değil)";li.append(a);}else{var b=element("button","dropdown-item",action[0]);b.type="button";b.dataset.bbOrdersAction=action[1];b.dataset.bbOrdersId=o.id;li.append(b);}menu.append(li);});dropdown.append(trigger,menu);actions.append(dropdown);
  tr.append(select,id,customer,state,total,added,modified,actions);body.append(tr);
 });
 var start=visible.length?(page-1)*size+1:0,end=start+visible.length-1;
 range.textContent=start+"–"+Math.max(0,end)+" / "+filteredOrders.length;
 count.textContent=filteredOrders.length+" sipariş";empty.hidden=filteredOrders.length!==0;
 checkAll.checked=visible.length>0&&visible.every(function(o){return selection.has(o.id);});
 checkAll.indeterminate=!checkAll.checked&&visible.some(function(o){return selection.has(o.id);});
 selectedCount.textContent=selection.size+" sipariş seçildi";bulk.disabled=selection.size===0;
 function pageButton(label,target,disabled,active){var li=element("li","page-item"+(disabled?" disabled":"")+(active?" active":""));var button=element("button","page-link",label);button.type="button";button.disabled=disabled;button.dataset.bbOrdersPage=String(target);if(active)button.setAttribute("aria-current","page");li.append(button);pages.append(li);}
 pageButton("‹",page-1,page===1,false);for(var i=1;i<=maxPage;i++)pageButton(String(i),i,false,i===page);pageButton("›",page+1,page===maxPage,false);
}
[search,from,to,status,limit].forEach(function(control){control.addEventListener(control===search?"input":"change",function(){page=1;render();});});
root.addEventListener("change",function(event){var selected=event.target.closest("[data-bb-orders-select]");if(selected){if(selected.checked)selection.add(selected.dataset.bbOrdersSelect);else selection.delete(selected.dataset.bbOrdersSelect);render();}});
checkAll.addEventListener("change",function(){var size=Number(limit.value);filtered().slice((page-1)*size,page*size).forEach(function(o){if(checkAll.checked)selection.add(o.id);else selection.delete(o.id);});render();});
root.addEventListener("click",function(event){var button=event.target.closest("[data-bb-orders-page]");if(button&&!button.disabled){page=Number(button.dataset.bbOrdersPage);render();return;}
 var action=event.target.closest("[data-bb-orders-action]");if(action){info(action.dataset.bbOrdersAction==="edit"?"#"+action.dataset.bbOrdersId+" düzenleme demosu: Sipariş değiştirilmedi.":"#"+action.dataset.bbOrdersId+" silme demosu: Hiçbir kayıt silinmedi.");return;}
 if(event.target.closest("[data-bb-orders-bulk]")){info(selection.size+" seçili sipariş. Toplu işlem demo kapsamındadır; veri değiştirilmedi.");return;}
 if(event.target.closest("[data-bb-orders-new]"))info("Yeni sipariş işlemi demo kapsamındadır; kayıt oluşturulmadı.");
 if(event.target.closest("[data-bb-orders-clear]")){search.value="";from.value="";to.value="";status.value="";limit.value="10";selection.clear();page=1;notice.hidden=true;render();}
});
var title=document.querySelector(".bb-page-title");if(title)title.textContent="Order List";
var crumb=document.querySelector(".bb-breadcrumb .breadcrumb");if(crumb){crumb.replaceChildren();["APPLICATIONS","e-Ticaret","Siparişler"].forEach(function(value,i){var li=element("li","breadcrumb-item"+(i===2?" active":""),value);if(i===2)li.setAttribute("aria-current","page");crumb.append(li);});}
render();
})();