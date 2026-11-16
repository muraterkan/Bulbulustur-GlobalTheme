/* Panel component catalog: show resolved core token values for the active theme. */
(function () {
  "use strict";

  function syncTokenValues() {
    var styles = window.getComputedStyle(document.documentElement);
    document.querySelectorAll("[data-bb-token-value]").forEach(function (node) {
      var token = node.getAttribute("data-bb-token-value");
      node.textContent = styles.getPropertyValue(token).trim() || "—";
    });
  }

  document.addEventListener("bb:panel-theme-change", syncTokenValues);
  syncTokenValues();
}());
