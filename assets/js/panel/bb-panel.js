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

  /* Normalize the legacy dashboard group in templates that still carry it. */
  panel.querySelectorAll("#bb_tree_dashboard").forEach(function (tree) {
    var group = tree.closest(".bb-menu-item");
    var overview = tree.querySelector('a[data-bb-panel-page="dashboard-overview"]');
    if (!group || !overview) return;

    var icon = group.querySelector(".bb-menu-icon");
    var title = overview.querySelector(".bb-menu-title");
    title.textContent = "Mağaza panosu";
    overview.replaceChildren(icon, title);
    group.removeAttribute("data-bb-menu-trigger");
    group.replaceChildren(overview);
    var section = group.previousElementSibling;
    if (section && section.classList.contains("bb-menu-section")) section.textContent = "MAĞAZA";
  });

  var overviewLink = panel.querySelector('[data-bb-panel-menu] a[data-bb-panel-page="dashboard-overview"]');
  if (overviewLink) {
    var rfqItem = document.createElement("div");
    rfqItem.className = "bb-menu-item";
    rfqItem.innerHTML = '<a class="bb-menu-link" href="rfq.html" data-bb-panel-page="rfq-overview">' +
      '<span class="bb-menu-icon"><span class="material-symbols-outlined" aria-hidden="true">request_quote</span></span>' +
      '<span class="bb-menu-title">Teklif talepleri (RFQ)</span></a>';
    overviewLink.closest(".bb-menu-item").after(rfqItem);
    var financeItem = document.createElement("div");
    financeItem.className = "bb-menu-item";
    financeItem.innerHTML = '<a class="bb-menu-link" href="sales-finance.html" data-bb-panel-page="sales-finance">' +
      '<span class="bb-menu-icon"><span class="material-symbols-outlined" aria-hidden="true">account_balance_wallet</span></span>' +
      '<span class="bb-menu-title">Satış Finansmanı</span></a>';
    overviewLink.closest(".bb-menu-item").after(financeItem);
    var brandsItem = document.createElement("div");
    brandsItem.className = "bb-menu-item";
    brandsItem.innerHTML = '<a class="bb-menu-link" href="brands.html" data-bb-panel-page="brand-management">' +
      '<span class="bb-menu-icon"><span class="material-symbols-outlined" aria-hidden="true">verified</span></span>' +
      '<span class="bb-menu-title">Marka Yönetimi</span></a>';
    rfqItem.after(brandsItem);
  }

  /* Shared shell branding: use only the canonical Bulbulustur logo asset. */
  var sidebarLogo = panel.querySelector(".bb-sidebar-logo");
  if (sidebarLogo) {
    sidebarLogo.querySelectorAll(".bb-template-logo-mark, .bb-sidebar-brand-logo, .bb-panel-brand-text").forEach(function (node) { node.remove(); });
    var brandLogo = document.createElement("img");
    brandLogo.className = "bb-sidebar-brand-logo";
    brandLogo.src = "../../assets/media/logos/logo-light.png";
    brandLogo.alt = "Bulbulustur";
    sidebarLogo.prepend(brandLogo);
  }

  /* Shared compact footer inspired by the reference template. */
  var footer = panel.querySelector(".bb-shell-footer");
  if (footer) {
    var componentContext = (window.location.pathname || "").indexOf("/modules/components/") !== -1;
    var panelPrefix = componentContext ? "../panel/" : "";
    var componentPrefix = componentContext ? "" : "../components/";
    footer.classList.add("bb-panel-template-footer");
    footer.innerHTML =
      '<div class="bb-footer-bar">' +
        '<div class="bb-footer-inner">' +
          '<div class="bb-footer-left"><span>2015-2026 ©</span><span>Copyright © 2026</span><a class="bb-footer-brand" href="' + panelPrefix + 'dashboard.html">Bulbulustur</a></div>' +
          '<nav class="bb-footer-right" aria-label="Sub Links">' +
            '<a class="bb-footer-link" href="' + panelPrefix + 'about.html">About</a>' +
            '<a class="bb-footer-link" href="' + panelPrefix + 'integrations.html">Integration</a>' +
            '<a class="bb-footer-link" href="' + panelPrefix + 'product-draugr.html">Draugr</a>' +
            '<a class="bb-footer-link" href="' + panelPrefix + 'product-posb.html">PosB</a>' +
            '<a class="bb-footer-link" href="' + panelPrefix + 'updates.html">Changelog</a>' +
            '<a class="bb-footer-link" href="' + panelPrefix + 'support-center.html">Destek</a>' +
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

  /* The POS keeps its own document so panel and register scripts stay independent. */
  var posDialog = null;
  var posFrame = null;
  var posOpener = null;

  function sendToPOS(message) {
    if (posFrame) posFrame.contentWindow.postMessage(message, window.location.origin);
  }

  function openPOS(url, opener) {
    if (posDialog) return;

    posOpener = opener;
    posDialog = document.createElement("dialog");
    posDialog.className = "bb-panel-pos-dialog";
    posDialog.setAttribute("aria-label", "PosB satış kasası");

    posFrame = document.createElement("iframe");
    posFrame.title = "PosB satış kasası";
    posFrame.addEventListener("load", function () {
      sendToPOS({
        type: "bb:pos:activate",
        theme: document.documentElement.getAttribute("data-bs-theme")
      });
    });
    url.searchParams.set("embed", "1");
    posFrame.src = url.href;

    posDialog.addEventListener("cancel", function (event) {
      event.preventDefault();
      sendToPOS({ type: "bb:pos:request-close" });
    });
    posDialog.addEventListener("close", function () {
      posDialog.remove();
      posDialog = null;
      posFrame = null;
      document.body.classList.remove("bb-panel-pos-open");
      posOpener.focus();
      posOpener = null;
    });

    posDialog.appendChild(posFrame);
    document.body.appendChild(posDialog);
    posDialog.showModal();
    document.body.classList.add("bb-panel-pos-open");
  }

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest("a[href]");
    if (!link || !panel.contains(link) || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
    var url = new URL(link.href);
    if (url.origin !== window.location.origin || !url.pathname.endsWith("/modules/panel/pos-system.html")) return;
    if (window.location.origin === "null" || typeof HTMLDialogElement.prototype.showModal !== "function") return;

    event.preventDefault();
    openPOS(url, link);
  });

  window.addEventListener("message", function (event) {
    if (!posFrame || event.origin !== window.location.origin || event.source !== posFrame.contentWindow) return;
    if (event.data && event.data.type === "bb:pos:close") posDialog.close();
  });

  var entry = new URL(window.location.href);
  var dashboardView = entry.searchParams.get("view");
  var dashboardPosLink = panel.querySelector("a[data-bb-draugr-pos][href]");
  if (dashboardPosLink && (!dashboardView || dashboardView === "dashboard") &&
      entry.searchParams.get("pos") === "open" && window.location.origin !== "null" &&
      typeof HTMLDialogElement.prototype.showModal === "function") {
    openPOS(new URL(dashboardPosLink.href), dashboardPosLink);
    entry.searchParams.delete("pos");
    window.history.replaceState(window.history.state, "", entry);
  }
})();
