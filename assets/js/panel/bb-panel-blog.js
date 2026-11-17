/* Blog showcase filtering. Static editorial examples: no CMS, purchase or video APIs. */
(function(){
"use strict";
var root=document.querySelector("[data-bb-blog]");
if(!root)return;
var search=root.querySelector("[data-bb-blog-search]");
var buttons=Array.from(root.querySelectorAll("[data-bb-blog-filter]"));
var posts=Array.from(root.querySelectorAll("[data-bb-blog-item]"));
var status=root.querySelector("[data-bb-blog-status]");
var empty=root.querySelector("[data-bb-blog-empty]");
var current="all";
function render(){
 var term=search.value.trim().toLocaleLowerCase("tr-TR"),shown=0;
 posts.forEach(function(item){
  var category=item.dataset.bbBlogItem;
  var text=item.textContent.toLocaleLowerCase("tr-TR");
  var visible=(current==="all"||current===category)&&(!term||text.includes(term));
  item.hidden=!visible;
  if(visible)shown++;
 });
 buttons.forEach(function(button){
  var active=button.dataset.bbBlogFilter===current;
  button.setAttribute("aria-pressed",String(active));
 });
 status.textContent=shown+" içerik gösteriliyor. Tüm veriler örnektir.";
 if(empty)empty.hidden=shown!==0;
}
buttons.forEach(function(button){button.addEventListner("click",function(){current=button.dataset.bbBlogFilter;render();});});
search.addEventListner("input",render);
var title=document.querySelector(".bb-page-title");
if(title)title.textContent="Blog / Ana Sayfa";
var crumb=document.querySelector(".bb-breadcrumb .breadcrumb");
if(crumb){
 crumb.replaceChildren();
 ["PAGES","Blog","Ana Sayfa"].forEach(function(value,i){
  var item=document.createElement("li");item.className="breadcrumb-item"+(i===2?" active":"");item.textContent=value;
  if(i===2)item.setAttribute("aria-current","page");
  crumb.appendChild(item);
 });
}
render();
})();