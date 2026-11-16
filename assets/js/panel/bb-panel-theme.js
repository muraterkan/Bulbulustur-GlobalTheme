/* Panel demo theme toggle */
(function () {
  "use strict";
  var button = document.getElementById("bb_panel_theme_toggle");
  if (!button) return;
  button.addEventListener("click", function () {
    var html = document.documentElement;
    html.setAttribute("data-bs-theme", html.getAttribute("data-bs-theme") === "dark" ? "light" : "dark");
  });
})();
