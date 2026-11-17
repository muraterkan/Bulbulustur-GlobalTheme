// Tooltips init
    (() => {
      "use strict";

      const triggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      if (!triggers.length) {
        return;
      }

      const instances = [];

      triggers.forEach((el) => {
        const tip = new bootstrap.Tooltip(el);
        instances.push(tip);

        // Custom dismiss: data-bs-dismiss="click"
        if (el.getAttribute("data-bs-dismiss") === "click") {
          el.addEventListener("click", () => {
            tip.hide();
          });
        }
      });
    })();
