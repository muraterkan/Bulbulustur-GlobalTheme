/* Apply persisted panel theme before stylesheets paint to prevent theme flash. */
(function () {
  "use strict";
  try {
    var value = window.localStorage.getItem("bb-panel-theme");
    if (value === "dark" || value === "light") {
      document.documentElement.setAttribute("data-bs-theme", value);
    }
  } catch (_) {
    /* Storage may be unavailable; keep the page-declared fallback theme. */
  }
}());
