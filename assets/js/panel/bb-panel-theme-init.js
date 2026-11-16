/* Apply persisted panel theme before stylesheets paint to prevent theme flash. */
(function () {
  "use strict";
  try {
    var path = window.location.pathname || "";
    if (path.indexOf("/modules/panel/") !== -1 || path.indexOf("/modules/components/") !== -1) {
      document.documentElement.setAttribute("data-bb-ui-profile", "neutral");
    }
    var value = window.localStorage.getItem("bb-panel-theme");
    if (value === "dark" || value === "light") {
      document.documentElement.setAttribute("data-bs-theme", value);
    }
  } catch (_) {
    /* Storage may be unavailable; keep the page-declared fallback theme. */
  }
}());
