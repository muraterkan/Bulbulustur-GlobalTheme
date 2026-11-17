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

  /* Channel Registry dashboard: one list for owned and connected sales channels. */
  var channelDashboardMenu = panel.querySelector("#bb_tree_dashboard .bb-menu-sub-content");
  if (channelDashboardMenu && !channelDashboardMenu.querySelector("[data-bb-panel-page='dashboard-channels']")) {
    var channelDashboardItem = document.createElement("div");
    channelDashboardItem.className = "bb-menu-item";
    channelDashboardItem.innerHTML = '<a class="bb-menu-link" href="channels.html" data-bb-panel-page="dashboard-channels"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Kanallar</span></a>';
    channelDashboardMenu.appendChild(channelDashboardItem);
  }

  /* Draugr SaaS channel management: site-specific screens only.
     Shared product/order/customer master data stays in the common panel menus. */
  var panelMenu = panel.querySelector("[data-bb-panel-menu]");
  if (panelMenu && !panelMenu.querySelector("#bb_tree_draugr")) {
    var applicationsSection = Array.from(panelMenu.querySelectorAll(".bb-menu-section")).find(function (node) {
      return node.textContent.trim() === "APPLICATIONS";
    });
    var draugrSection = document.createElement("div");
    draugrSection.className = "bb-menu-section";
    draugrSection.textContent = "DRAUGR";
    var draugrMenuItem = document.createElement("div");
    draugrMenuItem.className = "bb-menu-item";
    draugrMenuItem.setAttribute("data-bb-menu-trigger", "click");
    draugrMenuItem.innerHTML =
      '<button class="bb-menu-link" type="button" aria-expanded="false" aria-controls="bb_tree_draugr"><span class="bb-menu-icon"><span class="material-symbols-outlined" aria-hidden="true">language</span></span><span class="bb-menu-title">Draugr</span><span class="bb-menu-arrow" aria-hidden="true"></span></button>' +
      '<div class="bb-menu-sub bb-menu-sub-accordion" id="bb_tree_draugr"><div class="bb-menu-sub-content">' +
        '<div class="bb-menu-item"><a class="bb-menu-link" href="draugr.html?view=dashboard" data-bb-panel-page="draugr-dashboard" data-bb-draugr-view-link="dashboard"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Dashboard</span></a></div>' +
        '<div class="bb-menu-item"><a class="bb-menu-link" href="draugr.html?view=storefront" data-bb-panel-page="draugr-storefront" data-bb-draugr-view-link="storefront"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Vitrin</span></a></div>' +
        '<div class="bb-menu-item"><a class="bb-menu-link" href="draugr.html?view=navigation" data-bb-panel-page="draugr-navigation" data-bb-draugr-view-link="navigation"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Kategoriler & Navigasyon</span></a></div>' +
        '<div class="bb-menu-item"><a class="bb-menu-link" href="draugr.html?view=content" data-bb-panel-page="draugr-content" data-bb-draugr-view-link="content"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Pages & İçerik</span></a></div>' +
        '<div class="bb-menu-item"><a class="bb-menu-link" href="draugr.html?view=theme" data-bb-panel-page="draugr-theme" data-bb-draugr-view-link="theme"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Tema & View Mode</span></a></div>' +
        '<div class="bb-menu-item"><a class="bb-menu-link" href="draugr.html?view=domain" data-bb-panel-page="draugr-domain" data-bb-draugr-view-link="domain"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Domain & SEO</span></a></div>' +
        '<div class="bb-menu-item"><a class="bb-menu-link" href="draugr.html?view=localization" data-bb-panel-page="draugr-localization" data-bb-draugr-view-link="localization"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Languages & Yerelleştirme</span></a></div>' +
        '<div class="bb-menu-item"><a class="bb-menu-link" href="draugr.html?view=settings" data-bb-panel-page="draugr-settings" data-bb-draugr-view-link="settings"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Kanal Adjustrı</span></a></div>' +
        '<div class="bb-menu-item"><a class="bb-menu-link" href="draugr.html?view=subscription" data-bb-panel-page="draugr-subscription" data-bb-draugr-view-link="subscription"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Subscription</span></a></div>' +
      '</div></div>';
    if (applicationsSection) {
      panelMenu.insertBefore(draugrSection, applicationsSection);
      panelMenu.insertBefore(draugrMenuItem, applicationsSection);
    } else {
      panelMenu.append(draugrSection, draugrMenuItem);
    }
  }

  /* POSB physical retail channel: dashboard, quick sale and definitions. */
  var posbPanelMenu = panel.querySelector("[data-bb-panel-menu]");
  if (posbPanelMenu && !posbPanelMenu.querySelector("#bb_tree_posb")) {
    var posbApplicationsSection = Array.from(posbPanelMenu.querySelectorAll(".bb-menu-section")).find(function (node) {
      return node.textContent.trim() === "APPLICATIONS";
    });
    var posbSection = document.createElement("div");
    posbSection.className = "bb-menu-section";
    posbSection.textContent = "POSB";

    var posbMenuItem = document.createElement("div");
    posbMenuItem.className = "bb-menu-item";
    posbMenuItem.setAttribute("data-bb-menu-trigger", "click");
    posbMenuItem.innerHTML =
      '<button class="bb-menu-link" type="button" aria-expanded="false" aria-controls="bb_tree_posb"><span class="bb-menu-icon"><span class="material-symbols-outlined" aria-hidden="true">point_of_sale</span></span><span class="bb-menu-title">POSB</span><span class="bb-menu-arrow" aria-hidden="true"></span></button>' +
      '<div class="bb-menu-sub bb-menu-sub-accordion" id="bb_tree_posb"><div class="bb-menu-sub-content">' +
        '<div class="bb-menu-item"><a class="bb-menu-link" href="posb.html?view=dashboard" data-bb-panel-page="posb-dashboard" data-bb-posb-view-link="dashboard"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Dashboard</span></a></div>' +
        '<div class="bb-menu-item"><a class="bb-menu-link" href="pos-system.html" data-bb-panel-page="posb-quick-sale"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Hızlı Satış</span></a></div>' +

        '<div class="bb-menu-item" data-bb-menu-trigger="click"><button class="bb-menu-link" type="button" aria-expanded="false" aria-controls="bb_tree_posb_branch"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Şube & Kasa</span><span class="bb-menu-arrow" aria-hidden="true"></span></button><div class="bb-menu-sub bb-menu-sub-accordion" id="bb_tree_posb_branch"><div class="bb-menu-sub-content">' +
          '<div class="bb-menu-item"><a class="bb-menu-link" href="posb.html?view=branches" data-bb-panel-page="posb-branches" data-bb-posb-view-link="branches"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Şubeler</span></a></div>' +
          '<div class="bb-menu-item"><a class="bb-menu-link" href="posb.html?view=registers" data-bb-panel-page="posb-registers" data-bb-posb-view-link="registers"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Kasalar</span></a></div>' +
          '<div class="bb-menu-item"><a class="bb-menu-link" href="posb.html?view=shifts" data-bb-panel-page="posb-shifts" data-bb-posb-view-link="shifts"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Vardiya & Gün</span></a></div>' +
        '</div></div></div>' +

        '<div class="bb-menu-item" data-bb-menu-trigger="click"><button class="bb-menu-link" type="button" aria-expanded="false" aria-controls="bb_tree_posb_invoice"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Fatura</span><span class="bb-menu-arrow" aria-hidden="true"></span></button><div class="bb-menu-sub bb-menu-sub-accordion" id="bb_tree_posb_invoice"><div class="bb-menu-sub-content">' +
          '<div class="bb-menu-item"><a class="bb-menu-link" href="posb.html?view=invoices" data-bb-panel-page="posb-invoices" data-bb-posb-view-link="invoices"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Invoices</span></a></div>' +
          '<div class="bb-menu-item"><a class="bb-menu-link" href="posb.html?view=invoice-settings" data-bb-panel-page="posb-invoice-settings" data-bb-posb-view-link="invoice-settings"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Fatura Adjustrı</span></a></div>' +
        '</div></div></div>' +

        '<div class="bb-menu-item" data-bb-menu-trigger="click"><button class="bb-menu-link" type="button" aria-expanded="false" aria-controls="bb_tree_posb_stock"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Stok & Transfer</span><span class="bb-menu-arrow" aria-hidden="true"></span></button><div class="bb-menu-sub bb-menu-sub-accordion" id="bb_tree_posb_stock"><div class="bb-menu-sub-content">' +
          '<div class="bb-menu-item"><a class="bb-menu-link" href="posb.html?view=warehouses" data-bb-panel-page="posb-warehouses" data-bb-posb-view-link="warehouses"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Depolar</span></a></div>' +
          '<div class="bb-menu-item"><a class="bb-menu-link" href="posb.html?view=stock" data-bb-panel-page="posb-stock" data-bb-posb-view-link="stock"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Stok</span></a></div>' +
          '<div class="bb-menu-item"><a class="bb-menu-link" href="posb.html?view=transfers" data-bb-panel-page="posb-transfers" data-bb-posb-view-link="transfers"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Transferler</span></a></div>' +
        '</div></div></div>' +

        '<div class="bb-menu-item" data-bb-menu-trigger="click"><button class="bb-menu-link" type="button" aria-expanded="false" aria-controls="bb_tree_posb_partners"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Müşteri & Tedarikçi</span><span class="bb-menu-arrow" aria-hidden="true"></span></button><div class="bb-menu-sub bb-menu-sub-accordion" id="bb_tree_posb_partners"><div class="bb-menu-sub-content">' +
          '<div class="bb-menu-item"><a class="bb-menu-link" href="posb.html?view=customers" data-bb-panel-page="posb-customers" data-bb-posb-view-link="customers"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Müşteriler</span></a></div>' +
          '<div class="bb-menu-item"><a class="bb-menu-link" href="posb.html?view=suppliers" data-bb-panel-page="posb-suppliers" data-bb-posb-view-link="suppliers"><span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title">Tedarikçiler</span></a></div>' +
        '</div></div></div>' +
      '</div></div>';

    if (posbApplicationsSection) {
      posbPanelMenu.insertBefore(posbSection, posbApplicationsSection);
      posbPanelMenu.insertBefore(posbMenuItem, posbApplicationsSection);
    } else {
      posbPanelMenu.append(posbSection, posbMenuItem);
    }
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
            '<a class="bb-footer-link" href="' + panelPrefix + 'integrations.html">Entegrasyon</a>' +
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
})();
