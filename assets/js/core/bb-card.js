/* Bulbulustur Theme - Card behaviour */
(function () {
  "use strict";

  document.querySelectorAll(".bb-card-collapsible[role='button']").forEach(function (element) {
    element.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        element.click();
      }
    });
  });
})();
