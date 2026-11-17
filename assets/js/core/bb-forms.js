/* Bulbulustur Theme — Form demo-compatible behaviour */
(function () {
  "use strict";

  // Indeterminate demo
      (function () {
        var el = document.getElementById("bb_check_indeterminate");
        if (el) {
          el.indeterminate = true;
        }
      })();
  
      // Lightweight image check buttons (Metronic data-kt-buttons benzeri)
      (function () {
        var groups = document.querySelectorAll('[data-bb-buttons="true"]');
        groups.forEach(function (group) {
          group.addEventListener("change", function (e) {
            var input = e.target;
            if (!input.classList.contains("form-check-input")) {
              return;
            }
  
            var items = group.querySelectorAll(".form-check-image");
            items.forEach(function (x) {
              x.classList.remove("active");
            });
  
            var label = input.closest(".form-check-image");
            if (label) {
              label.classList.add("active");
            }
          });
        });
      })();
})();
