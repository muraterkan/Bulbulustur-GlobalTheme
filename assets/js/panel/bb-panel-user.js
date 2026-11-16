/* Faz 4 — user menu theme control; uses the existing panel theme toggle. */
(function () {
  "use strict";
  var button = document.getElementById("bb_panel_user_theme");
  var themeToggle = document.getElementById("bb_panel_theme_toggle");
  if (!button || !themeToggle) return;
  var label = button.querySelector("[data-bb-panel-user-mode-text]");
  var icon = button.querySelector("[data-bb-panel-user-mode-icon]");

  function sync() {
    var dark = document.documentElement.getAttribute("data-bs-theme") === "dark";
    if (label) label.textContent = dark ? "Dark" : "Light";
    if (icon) icon.textContent = dark ? "dark_mode" : "light_mode";
    button.setAttribute("aria-label", dark ? "Appearance: dark theme; switch to light" : "Appearance: light theme; switch to dark");
  }

  button.addEventListener("click", function () {
    themeToggle.click();
  });
  document.addEventListener("bb:panel-theme-change", sync);
  sync();
})();
