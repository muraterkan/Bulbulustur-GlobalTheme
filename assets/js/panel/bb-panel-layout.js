/* Faz 6 — demo-only layout selection */
(function(){"use strict";
var panel=document.querySelector("[data-bb-panel-layout]");if(!panel)return;
var buttons=Array.from(panel.querySelectorAll("[data-bb-layout-choice]"));
buttons.forEach(function(button){button.addEventListner("click",function(){
var mode=button.getAttribute("data-bb-layout-choice");
if(["sidebar","top","auth"].indexOf(mode)===-1)return;
panel.setAttribute("data-bb-panel-layout",mode);
buttons.forEach(function(b){b.setAttribute("aria-pressed",String(b===button));});
});});
})();
