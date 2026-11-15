/* Faz 3 — header overlays and top menu */
(function () {
"use strict";
var panel = document.querySelector("[data-bb-panel]"); if (!panel) return;
var hosts = Array.from(panel.querySelectorAll("[data-bb-panel-popup]"));
function close(host, focus) { var p=host.querySelector("[data-bb-panel-popup-content]"),b=host.querySelector("[data-bb-panel-popup-toggle]"); if(!p||!b)return; p.hidden=true;b.setAttribute("aria-expanded","false");if(focus)b.focus(); }
hosts.forEach(function(host){var p=host.querySelector("[data-bb-panel-popup-content]"),b=host.querySelector("[data-bb-panel-popup-toggle]");if(!p||!b)return;p.hidden=true;b.setAttribute("aria-expanded","false");b.addEventListener("click",function(){var open=p.hidden;hosts.forEach(function(h){close(h,false)});p.hidden=!open;b.setAttribute("aria-expanded",String(open));if(open){var field=p.querySelector("input,a[href],button");if(field)field.focus();}});});
document.addEventListener("click",function(e){hosts.forEach(function(h){if(!h.contains(e.target))close(h,false);});});
document.addEventListener("keydown",function(e){if(e.key!=="Escape")return;hosts.forEach(function(h){var p=h.querySelector("[data-bb-panel-popup-content]");if(p&&!p.hidden){e.preventDefault();close(h,true);}});});
var nav=panel.querySelector("[data-bb-panel-topnav]");if(!nav)return;
function closeNav(){nav.querySelectorAll(".bb-menu-item.show").forEach(function(i){i.classList.remove("show");var b=i.querySelector(":scope > .bb-menu-link");if(b)b.setAttribute("aria-expanded","false");});}
nav.addEventListener("click",function(e){var b=e.target.closest("[data-bb-menu-trigger='click'] > .bb-menu-link");if(!b||!nav.contains(b))return;e.preventDefault();var i=b.parentElement,open=!i.classList.contains("show");closeNav();i.classList.toggle("show",open);b.setAttribute("aria-expanded",String(open));});
document.addEventListener("click",function(e){if(!nav.contains(e.target))closeNav();});document.addEventListener("keydown",function(e){if(e.key==="Escape")closeNav();});
})();
