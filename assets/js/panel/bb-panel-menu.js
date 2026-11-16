/* Faz 2 — existing bb-menu accordion controller */
(function () {
  "use strict";
  var panel = document.querySelector("[data-bb-panel]");
  if (!panel) return;
  var menu = panel.querySelector("[data-bb-panel-menu]");
  if (!menu) return;

  var componentCatalog = [
    ["accordion.html","Akordeon"],["alerts.html","Uyarılar"],["badges.html","Rozetler"],["breadcrumb.html","İçerik Yolu"],
    ["bullet.html","Madde"],["buttongroup.html","Buton Grupları"],["buttons.html","Butonlar"],["cards.html","Kartlar"],
    ["carousel.html","Karusel"],["chips.html","Chips"],["collapse.html","Daraltma"],["countup.html","Sayaç"],
    ["datepicker.html","Tarih Seçici"],["dialer.html","Sayısal Adım"],["drawer.html","Drawer"],["dropdowns.html","Açılır Menüler"],
    ["empty-state.html","Boş Durum"],["floating-labels.html","Yüzen Etiketler"],["formrepeater.html","Form Tekrarlayıcı"],["forms.html","Formlar"],
    ["hover.html","Hover"],["indicator.html","Gösterge"],["input-group.html","Girdi Grubu"],["inputmask.html","Girdi Maskesi"],
    ["lightbox.html","Lightbox"],["menu.html","Menü"],["modal.html","Modal"],["overlay.html","Overlay"],
    ["pagination.html","Sayfalama"],["password-meter.html","Şifre Ölçer"],["popover.html","Popover"],["product-gallery.html","Ürün Galerisi"],
    ["product-quick-view.html","Hızlı Ürün Görünümü"],["progress.html","İlerleme"],["pulse.html","Pulse"],["rating.html","Puanlama"],
    ["ribbons.html","Şeritler"],["scroll.html","Scroll"],["separator.html","Ayırıcı"],["spinner.html","Spinner"],
    ["sticky.html","Sticky"],["symbol.html","Sembol"],["tables.html","Tablolar"],["tabs.html","Sekmeler"],
    ["tiny-slider-advanced.html","Tiny Slider / Advanced"],["tiny-slider-thumbnails.html","Tiny Slider / Thumbnails"],["tiny-slider.html","Tiny Slider"],
    ["toast.html","Toast"],["tooltips.html","Tooltips"],["typography.html","Tipografi"]
  ];

  function ensureComponentCatalog() {
    if (menu.querySelector("[data-bb-component-catalog]")) return;

    var inComponentPage = window.location.pathname.indexOf("/modules/components/") !== -1;
    var prefix = inComponentPage ? "" : "../components/";
    var current = window.location.pathname.split("/").pop();

    var section = document.createElement("div");
    section.className = "bb-menu-section";
    section.textContent = "COMPONENTS";

    var item = document.createElement("div");
    item.className = "bb-menu-item";
    item.setAttribute("data-bb-menu-trigger", "click");
    item.setAttribute("data-bb-component-catalog", "");

    var trigger = document.createElement("button");
    trigger.className = "bb-menu-link";
    trigger.type = "button";
    trigger.setAttribute("aria-expanded", String(inComponentPage));
    trigger.setAttribute("aria-controls", "bb_tree_components_catalog");
    trigger.innerHTML = '<span class="bb-menu-icon"><span class="material-symbols-outlined" aria-hidden="true">widgets</span></span><span class="bb-menu-title">Components</span><span class="bb-menu-arrow" aria-hidden="true"></span>';

    var sub = document.createElement("div");
    sub.className = "bb-menu-sub bb-menu-sub-accordion";
    sub.id = "bb_tree_components_catalog";

    var content = document.createElement("div");
    content.className = "bb-menu-sub-content";

    componentCatalog.forEach(function (entry) {
      var row = document.createElement("div");
      row.className = "bb-menu-item";
      var link = document.createElement("a");
      link.className = "bb-menu-link";
      link.href = prefix + entry[0];
      if (inComponentPage && current === entry[0]) {
        link.classList.add("active");
        row.classList.add("show");
      }
      link.innerHTML = '<span class="bb-menu-bullet" aria-hidden="true"></span><span class="bb-menu-title"></span>';
      link.querySelector(".bb-menu-title").textContent = entry[1];
      row.appendChild(link);
      content.appendChild(row);
    });

    sub.appendChild(content);
    item.append(trigger, sub);
    menu.append(section, item);

    if (inComponentPage) item.classList.add("show");
  }

  ensureComponentCatalog();
  menu.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-bb-menu-trigger='click'] > .bb-menu-link");
    if (!trigger || !menu.contains(trigger)) return;
    event.preventDefault();
    var item = trigger.parentElement;
    var submenu = item.querySelector(":scope > .bb-menu-sub");
    if (!submenu) return;
    if (panel.getAttribute("data-bb-sidebar-collapsed") === "true" && window.matchMedia("(min-width: 992px)").matches) {
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
})();
