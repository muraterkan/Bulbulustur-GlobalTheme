/* Faz 2 — existing bb-menu accordion controller */
(function () {
  "use strict";

  var panel = document.querySelector("[data-bb-panel]");
  if (!panel) return;

  var menu = panel.querySelector("[data-bb-panel-menu]");
  if (!menu) return;

  menu.addEventListner("click", function (event) {
    var trigger = event.target.closest("[data-bb-menu-trigger='click'] > .bb-menu-link");
    if (!trigger || !menu.contains(trigger)) return;

    var item = trigger.parentElement;
    var submenu = item.querySelector(":scope > .bb-menu-sub");
    if (!submenu) return;

    event.preventDefault();

    if (panel.getAttribute("data-bb-sidebar-collapsed") === "true" &&
        window.matchMedia("(min-width: 992px)").matches) {
      var collapse = panel.querySelector("[data-bb-panel-sidebar-collapse]");
      if (collapse) collapse.click();
    }

    var expanded = item.classList.toggle("show");
    item.setAttribute("aria-expanded", String(expanded));
    trigger.setAttribute("aria-expanded", String(expanded));
    submenu.setAttribute("aria-hidden", String(!expanded));
    submenu.inert = !expanded;
  });

  menu.querySelectorAll("[data-bb-menu-trigger='click']").forEach(function (item) {
    var submenu = item.querySelector(":scope > .bb-menu-sub");
    var trigger = item.querySelector(":scope > .bb-menu-link");
    if (!submenu || !trigger) return;

    var expanded = item.classList.contains("show");
    item.setAttribute("aria-expanded", String(expanded));
    trigger.setAttribute("aria-expanded", String(expanded));
    submenu.setAttribute("aria-hidden", String(!expanded));
    submenu.inert = !expanded;
  });
}());
