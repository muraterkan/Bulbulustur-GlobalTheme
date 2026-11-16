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
      collapseButton.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
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

  /* Shared shell branding: one source for panel and component catalog. */
  var sidebarLogo = panel.querySelector(".bb-sidebar-logo");
  if (sidebarLogo && !sidebarLogo.querySelector(".bb-template-logo-mark")) {
    var logoMark = document.createElement("span");
    logoMark.className = "bb-template-logo-mark";
    logoMark.setAttribute("aria-hidden", "true");
    logoMark.innerHTML = "<span>K</span>";
    sidebarLogo.prepend(logoMark);
  }

  /* Shared compact footer inspired by the reference template. */
  var footer = panel.querySelector(".bb-shell-footer");
  if (footer) {
    footer.classList.add("bb-panel-template-footer");
    footer.innerHTML =
      '<div class="bb-footer-bar">' +
        '<div class="bb-footer-inner">' +
          '<div class="bb-footer-left"><span>2026 ©</span><a class="bb-footer-brand" href="dashboard.html">Bulbulustur</a></div>' +
          '<nav class="bb-footer-right" aria-label="Alt bağlantılar">' +
            '<a class="bb-footer-link" href="pages.html?page=corporate-about">Hakkımızda</a>' +
            '<a class="bb-footer-link" href="support-center.html">Destek</a>' +
            '<a class="bb-footer-link" href="../components/cards.html">Bileşenler</a>' +
          '</nav>' +
        '</div>' +
      '</div>';
  }

  /* Scroll-to-top: panel content uses its own scroll container; support window too. */
  var contentScroll = panel.querySelector(".bb-content");
  var backToTop = document.createElement("button");
  backToTop.type = "button";
  backToTop.className = "bb-panel-back-to-top";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.title = "Back to top";
  backToTop.hidden = true;
  var backIcon = document.createElement("span");
  backIcon.className = "material-symbols-outlined";
  backIcon.textContent = "keyboard_arrow_up";
  backIcon.setAttribute("aria-hidden", "true");
  backToTop.appendChild(backIcon);
  panel.appendChild(backToTop);

  function updateBackToTop() {
    var inContent = contentScroll && contentScroll.scrollTop > 160;
    var inWindow = window.scrollY > 160;
    backToTop.hidden = !(inContent || inWindow);
  }
  if (contentScroll) contentScroll.addEventListener("scroll", updateBackToTop, { passive: true });
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  backToTop.addEventListener("click", function () {
    var behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (contentScroll) contentScroll.scrollTo({ top: 0, behavior: behavior });
    window.scrollTo({ top: 0, behavior: behavior });
  });
  updateBackToTop();
})();
