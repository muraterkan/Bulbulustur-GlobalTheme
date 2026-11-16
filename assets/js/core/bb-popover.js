/* Bulbulustur Theme - Popover integration */
(function () {
  "use strict";

  // init popovers
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function (el) {
      new bootstrap.Popover(el);
    });
})();
