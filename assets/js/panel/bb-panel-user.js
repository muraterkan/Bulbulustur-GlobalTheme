/* Shared panel/component user preferences: explicit appearance + language menu. */
(function () {
  "use strict";

  var STORAGE_THEME = "bb-panel-theme";
  var STORAGE_LANGUAGE = "bb-panel-language";
  var html = document.documentElement;
  var menu = document.querySelector(".bb-panel-user-menu");
  if (!menu) return;

  var languages = [
    { code: "tr", label: "Türkçe", flag: "../../assets/media/flags/turkey.svg" },
    { code: "en", label: "English", flag: "../../assets/media/flags/United States of America.svg" },
    { code: "es", label: "Español", flag: "../../assets/media/flags/spain.svg" },
    { code: "de", label: "Deutsch", flag: "../../assets/media/flags/germany.svg" },
    { code: "ja", label: "日本語", flag: "../../assets/media/flags/japan.svg" },
    { code: "fr", label: "Français", flag: "../../assets/media/flags/france.svg" }
  ];

  function getStored(key, fallback) {
    try { return window.localStorage.getItem(key) || fallback; }
    catch (_) { return fallback; }
  }

  function setStored(key, value) {
    try { window.localStorage.setItem(key, value); }
    catch (_) { /* Storage may be unavailable. */ }
  }

  function applyTheme(value) {
    var next = value === "dark" ? "dark" : "light";
    html.setAttribute("data-bs-theme", next);
    setStored(STORAGE_THEME, next);
    document.dispatchEvent(new CustomEvent("bb:panel-theme-change", { detail: { theme: next } }));
    syncTheme();
  }

  function currentLanguage() {
    var code = getStored(STORAGE_LANGUAGE, "tr");
    return languages.some(function (item) { return item.code === code; }) ? code : "tr";
  }

  function currentLanguageItem() {
    var code = currentLanguage();
    return languages.find(function (item) { return item.code === code; }) || languages[0];
  }

  var routes = [
    { id: "draugr", label: "Draugr", icon: "language", links: [
      ["draugr.html?view=dashboard", "Dashboard"],
      ["draugr.html?view=storefront", "Vitrin"],
      ["draugr.html?view=navigation", "Kategori ve navigasyon"],
      ["draugr.html?view=content", "Sayfalar ve içerik"],
      ["draugr.html?view=theme", "Tema ve görünüm"],
      ["draugr.html?view=domain", "Alan adı ve SEO"],
      ["draugr.html?view=localization", "Dil ve yerelleştirme"],
      ["draugr.html?view=settings", "Kanal ayarları"],
      ["draugr.html?view=subscription", "Abonelik"]
    ] },
    { id: "posb", label: "PosB", icon: "point_of_sale", links: [
      ["pos-system.html", "POS ekranını aç"]
    ], groups: [
      { label: "Şube ve kasa", links: [
        ["posb.html?view=branches", "Şubeler"],
        ["posb.html?view=registers", "Kasalar"],
        ["posb.html?view=shifts", "Vardiya ve gün"]
      ] },
      { label: "Fatura", links: [
        ["posb.html?view=invoices", "Faturalar"],
        ["posb.html?view=invoice-settings", "Fatura ayarları"]
      ] },
      { label: "Stok ve transfer", links: [
        ["posb.html?view=warehouses", "Depolar"],
        ["posb.html?view=stock", "Stok"],
        ["posb.html?view=transfers", "Transferler"]
      ] },
      { label: "Müşteri ve tedarikçi", links: [
        ["posb.html?view=customers", "Müşteriler"],
        ["posb.html?view=suppliers", "Tedarikçiler"]
      ] }
    ] }
  ];

  function menuIcon(icon) {
    return icon ? `<span class="bb-menu-icon"><span class="material-symbols-outlined" aria-hidden="true">${icon}</span></span>` : "";
  }

  var current = new URL(window.location.href);
  if (current.pathname.endsWith("/draugr.html") && !current.searchParams.has("view")) {
    current.searchParams.set("view", "dashboard");
  }

  function isCurrent(href) {
    var target = new URL(href, document.baseURI);
    return target.pathname === current.pathname && target.searchParams.get("view") === current.searchParams.get("view");
  }

  function menuLink(link) {
    var href = link[0].startsWith("../") ? link[0] : "../panel/" + link[0];
    var active = isCurrent(href);
    return `
      <div class="bb-menu-item">
        <a class="bb-menu-link${active ? " active" : ""}" href="${href}"${active ? ' aria-current="page"' : ""}>
          ${menuIcon(link[2])}<span class="bb-menu-title">${link[1]}</span>
        </a>
      </div>`;
  }

  function submenu(label, items, icon, service) {
    return `
      <details class="bb-menu-item bb-panel-user-disclosure"${service ? ` data-bb-panel-service="${service}"` : ""}${items.includes('aria-current="page"') ? " open" : ""}>
        <summary class="bb-menu-link">
          ${menuIcon(icon)}<span class="bb-menu-title">${label}</span><span class="bb-menu-arrow" aria-hidden="true"></span>
        </summary>
        <div class="bb-panel-user-submenu">${items}
        </div>
      </details>`;
  }

  var navigation = document.createElement("nav");
  navigation.className = "bb-panel-user-group bb-panel-user-navigation bb-menu bb-menu-column bb-menu-sm bb-menu-hover-bg bb-menu-active-bg";
  navigation.setAttribute("aria-label", "Kullanıcı menüsü");
  navigation.innerHTML = [
    menuLink(["profile.html", "Profilim", "account_circle"]),
    menuLink(["account.html", "Hesap ayarları", "manage_accounts"]),
    menuLink(["subscription.html", "Aboneliklerim", "workspace_premium"]),
    menuLink(["orders.html", "Siparişlerim", "shopping_bag"]),
    menuLink(["support-center.html", "Yardım ve destek", "help"]),
    '<div class="bb-menu-section">Uygulamalar</div>',
    ...routes.map(function (route) {
      var links = route.links.map(menuLink).join("");
      var groups = (route.groups || []).map(function (group) {
        return submenu(group.label, group.links.map(menuLink).join(""));
      }).join("");
      return submenu(route.label, links + groups, route.icon, route.id);
    }),
    menuLink(["../components/menu.html", "Components", "menu_book"])
  ].join("");

  // Keep the server-rendered user summary and replace the demo links and preferences.
  menu.querySelectorAll(".bb-panel-user-group").forEach(function (group) { group.remove(); });
  var preferenceGroup = document.createElement("div");
  preferenceGroup.className = "bb-panel-user-group";
  menu.append(navigation, preferenceGroup);

  var appearance = document.createElement("div");
  appearance.className = "bb-panel-user-preference";
  appearance.innerHTML =
    '<span class="bb-panel-user-preference-label">View Mode</span>' +
    '<div class="bb-panel-user-theme-choices" role="group" aria-label="Tema seçimi">' +
      '<button type="button" data-bb-theme-choice="light"><span class="material-symbols-outlined" aria-hidden="true">light_mode</span>Açık</button>' +
      '<button type="button" data-bb-theme-choice="dark"><span class="material-symbols-outlined" aria-hidden="true">dark_mode</span>Koyu</button>' +
    '</div>';

  var language = document.createElement("div");
  language.className = "bb-panel-user-language";
  language.innerHTML =
    '<button class="bb-panel-user-language-toggle" type="button" aria-expanded="false" aria-controls="bb_panel_language_menu">' +
      '<span class="bb-panel-user-preference-label">Languages</span>' +
      '<span class="bb-panel-user-language-current" data-bb-language-current></span>' +
      '<span class="material-symbols-outlined" aria-hidden="true">expand_more</span>' +
    '</button>' +
    '<div class="bb-panel-user-language-menu" id="bb_panel_language_menu" hidden></div>';

  preferenceGroup.append(appearance, language);

  var session = document.createElement("div");
  session.className = navigation.className;
  session.innerHTML = menuLink(["sign-in.html", "Çıkış yap", "logout"]);
  menu.appendChild(session);

  var languageMenu = language.querySelector(".bb-panel-user-language-menu");
  languages.forEach(function (item) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "bb-panel-user-language-option";
    button.dataset.bbLanguage = item.code;
    button.innerHTML = '<img class="bb-panel-language-flag" src="' + item.flag + '" alt=""><span>' + item.label + '</span><span class="material-symbols-outlined bb-panel-language-check" aria-hidden="true">check</span>';
    languageMenu.appendChild(button);
  });

  function syncTheme() {
    var current = html.getAttribute("data-bs-theme") === "dark" ? "dark" : "light";
    menu.querySelectorAll("[data-bb-theme-choice]").forEach(function (button) {
      var active = button.dataset.bbThemeChoice === current;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function syncLanguage() {
    var selected = currentLanguageItem();
    var current = language.querySelector("[data-bb-language-current]");
    if (current) current.innerHTML = '<img class="bb-panel-language-flag" src="' + selected.flag + '" alt=""> <span>' + selected.label + '</span>';
    languageMenu.querySelectorAll("[data-bb-language]").forEach(function (button) {
      var active = button.dataset.bbLanguage === selected.code;
      button.classList.toggle("active", active);
      button.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  appearance.querySelectorAll("[data-bb-theme-choice]").forEach(function (button) {
    button.addEventListener("click", function () {
      applyTheme(button.dataset.bbThemeChoice);
    });
  });

  var languageToggle = language.querySelector(".bb-panel-user-language-toggle");
  languageToggle.addEventListener("click", function () {
    var open = languageToggle.getAttribute("aria-expanded") === "true";
    languageToggle.setAttribute("aria-expanded", String(!open));
    languageMenu.hidden = open;
  });

  languageMenu.addEventListener("click", function (event) {
    var button = event.target.closest("[data-bb-language]");
    if (!button) return;
    setStored(STORAGE_LANGUAGE, button.dataset.bbLanguage);
    syncLanguage();
    languageMenu.hidden = true;
    languageToggle.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("click", function (event) {
    if (language.contains(event.target)) return;
    languageMenu.hidden = true;
    languageToggle.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("bb:panel-theme-change", syncTheme);
  syncTheme();
  syncLanguage();
})();