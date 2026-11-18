/* Lists Widgets showcase — client-only interactions, no storage or network. */
(function(){
"use strict";
var root=document.querySelector("[data-bb-widget-lists]");
if(!root)return;
var input=root.querySelector("[data-bb-widget-search]");
var status=root.querySelector("[data-bb-widget-status]");
var empty=root.querySelector("[data-bb-widget-empty]");
var cards=Array.from(root.querySelectorAll("[data-bb-widget-card]"));
function update(){
 var query=input.value.trim().toLocaleLowerCase("tr-TR"),count=0;
 cards.forEach(function(card){
  var hiddenByUser=card.dataset.bbWidgetDismissed==="true";
  var rows=Array.from(card.querySelectorAll("[data-bb-widget-row]")),matched=0;
  rows.forEach(function(row){var hit=!query||row.textContent.toLocaleLowerCase("tr-TR").includes(query);row.hidden=!hit;if(hit)matched++;});
  var show=!hiddenByUser&&(!query||matched>0);
  card.hidden=!show;if(show)count++;
 });
 empty.hidden=count>0;
 status.textContent=count+" / "+cards.length+" widget gösteriliyor · Demo";
}
input.addEventListener("input",update);
root.addEventListener("click",function(event){
 var hidden=event.target.closest("[data-bb-widget-hide]");
 if(hidden){var card=hidden.closest("[data-bb-widget-card]");if(card)card.dataset.bbWidgetDismissed="true";update();return;}
 var reset=event.target.closest("[data-bb-widget-reset]");
 if(reset){var parent=reset.closest("[data-bb-widget-card]");if(parent){parent.querySelectorAll("[data-bb-widget-todo]").forEach(function(checkbox){checkbox.checked=false;});parent.dataset.bbWidgetDismissed="false";}update();return;}
 if(event.target.closest("[data-bb-widget-show-all]")){
  cards.forEach(function(card){delete card.dataset.bbWidgetDismissed;card.querySelectorAll("[data-bb-widget-todo]").forEach(function(checkbox){checkbox.checked=false;});});
  input.value="";update();return;
 }
});
var title=document.querySelector(".bb-page-title");if(title)title.textContent="Widgets / Listler";
var crumb=document.querySelector(".bb-breadcrumb .breadcrumb");
if(crumb){crumb.replaceChildren();["PAGES","Widgets","Listler"].forEach(function(value,i){var li=document.createElement("li");li.className="breadcrumb-item"+(i===2?" active":"");li.textContent=value;if(i===2)li.setAttribute("aria-current","page");crumb.appendChild(li);});}
update();
})();