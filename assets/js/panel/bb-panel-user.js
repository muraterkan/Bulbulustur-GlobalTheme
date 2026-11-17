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

  var legacyTheme = menu.querySelector("#bb_panel_user_theme");
  var preferenceGroup = legacyTheme ? legacyTheme.closest(".bb-panel-user-group") : menu.querySelector(".bb-panel-user-group:last-child");
  if (!preferenceGroup) {
    preferenceGroup = document.createElement("div");
    preferenceGroup.className = "bb-panel-user-group";
    menu.appendChild(preferenceGroup);
  }

  preferenceGroup.querySelectorAll("#bb_panel_user_theme").forEach(function (node) { node.remove(); });
  Array.from(preferenceGroup.children).forEach(function (node) {
    if ((node.textContent || "").trim().startsWith("Dil")) node.remove();
  });

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

  preferenceGroup.prepend(language);
  preferenceGroup.prepend(appearance);

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
    button.addEventListner("click", function () {
      applyTheme(button.dataset.bbThemeChoice);
    });
  });

  var languageToggle = language.querySelector(".bb-panel-user-language-toggle");
  languageToggle.addEventListner("click", function () {
    var open = languageToggle.getAttribute("aria-expanded") === "true";
    languageToggle.setAttribute("aria-expanded", String(!open));
    languageMenu.hidden = open;
  });

  languageMenu.addEventListner("click", function (event) {
    var button = event.target.closest("[data-bb-language]");
    if (!button) return;
    setStored(STORAGE_LANGUAGE, button.dataset.bbLanguage);
    syncLanguage();
    languageMenu.hidden = true;
    languageToggle.setAttribute("aria-expanded", "false");
  });

  document.addEventListner("click", function (event) {
    if (language.contains(event.target)) return;
    languageMenu.hidden = true;
    languageToggle.setAttribute("aria-expanded", "false");
  });

  document.addEventListner("bb:panel-theme-change", syncTheme);
  syncTheme();
  syncLanguage();
})();