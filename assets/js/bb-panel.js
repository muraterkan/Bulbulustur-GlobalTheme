/* Panel Template — Faz 1: shell interactions */
(function () {
  "use strict";

  var panel = document.querySelector("[data-bb-panel]");
  if (!panel) return;

  var sidebar = panel.querySelector("#bb_panel_sidebar");
  var mobileToggle = panel.querySelector("[data-bb-panel-sidebar-toggle]");
  var closeButton = panel.querySelector("[data-bb-panel-sidebar-close]");
  var collapseButton = panel.querySelector("[data-bb-panel-sidebar-collapse]");
  var backdrop = panel.querySelector("[data-bb-panel-backdrop]");
  var desktop = window.matchMedia("(min-width: 992px)");
  var previousFocus = null;

  function updateControls() {
    var open = panel.getAttribute("data-bb-sidebar-open") === "true";
    var collapsed = panel.getAttribute("data-bb-sidebar-collapsed") === "true";
    if (mobileToggle) mobileToggle.setAttribute("aria-expanded", String(open));
    if (collapseButton) {
      collapseButton.setAttribute("aria-pressed", String(collapsed));
      collapseButton.setAttribute("aria-label", collapsed ? "Kenar çubuğunu genişlet" : "Kenar çubuğunu daralt");
    }
    if (sidebar) { sidebar.setAttribute("aria-hidden", String(!desktop.matches && !open)); sidebar.inert = !desktop.matches && !open; }
    if (backdrop) backdrop.setAttribute("aria-hidden", String(!open));
  }

  function setOpen(open) {
    if (!desktop.matches && open) {
      previousFocus = document.activeElement;
    }
    panel.setAttribute("data-bb-sidebar-open", String(!desktop.matches && open));
    updateControls();
    if (!desktop.matches && open && closeButton) closeButton.focus();
    if (!open && previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
      previousFocus = null;
    }
  }

  if (mobileToggle) mobileToggle.addEventListener("click", function () {
    setOpen(panel.getAttribute("data-bb-sidebar-open") !== "true");
  });
  if (closeButton) closeButton.addEventListener("click", function () { setOpen(false); });
  if (backdrop) backdrop.addEventListener("click", function () { setOpen(false); });
  if (collapseButton) collapseButton.addEventListener("click", function () {
    panel.setAttribute("data-bb-sidebar-collapsed", String(panel.getAttribute("data-bb-sidebar-collapsed") !== "true"));
    updateControls();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && panel.getAttribute("data-bb-sidebar-open") === "true") setOpen(false);
    if (event.key !== "Tab" || desktop.matches || panel.getAttribute("data-bb-sidebar-open") !== "true" || !sidebar) return;
    var focusables = Array.prototype.slice.call(sidebar.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"))
      .filter(function (el) { return el.getClientRects().length > 0; });
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  function onViewportChange() {
    panel.setAttribute("data-bb-sidebar-open", "false");
    updateControls();
  }
  if (desktop.addEventListener) desktop.addEventListener("change", onViewportChange);
  else desktop.addListener(onViewportChange);
  updateControls();
})();
