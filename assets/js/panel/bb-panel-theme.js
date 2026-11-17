/* Panel theme state — shared by panel and component catalog pages. */
(function () {
  "use strict";

  var STORAGE_KEY = "bb-panel-theme";
  var html = document.documentElement;
  var button = document.getElementById("bb_panel_theme_toggle");

  function readStoredTheme() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return value === "dark" || value === "light" ? value : null;
    } catch (_) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (_) {
      /* Storage can be unavailable in restricted/private contexts. */
    }
  }

  function applyTheme(value, persist) {
    var next = value === "dark" ? "dark" : "light";
    html.setAttribute("data-bs-theme", next);
    if (persist) storeTheme(next);
    document.dispatchEvent(new CustomEvent("bb:panel-theme-change", {
      detail: { theme: next }
    }));
  }

  var stored = readStoredTheme();
  if (stored) applyTheme(stored, false);

  if (!button) return;

  button.addEventListener("click", function () {
    var current = html.getAttribute("data-bs-theme") === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark", true);
  });
}());
