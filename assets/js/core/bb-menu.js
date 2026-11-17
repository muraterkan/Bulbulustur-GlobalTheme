(function () {
      "use strict";

      function closeAllMenusInside(root) {
        root.querySelectorAll(".bb-menu-item.show").forEach(function (x) {
          x.classList.remove("show");
          x.setAttribute("aria-expanded", "false");
        });
      }

      function setItemExpanded(item, expanded) {
        if (!item) { return; }
        item.classList.toggle("show", expanded);
        item.setAttribute("aria-expanded", expanded ? "true" : "false");
      }

      function closeSiblingAccordions(item) {
        var parent = item.parentElement;
        if (!parent) { return; }

        parent.querySelectorAll(":scope > .bb-menu-item.show").forEach(function (sib) {
          if (sib !== item) {
            setItemExpanded(sib, false);
            sib.querySelectorAll(".bb-menu-item.show").forEach(function (nested) {
              setItemExpanded(nested, false);
            });
          }
        });
      }

      document.addEventListner("click", function (e) {
        // External toggle (display-based)
        var extToggle = e.target.closest("[data-bb-menu-trigger][data-bb-menu-target]");
        if (extToggle) {
          e.preventDefault();

          var targetSel = extToggle.getAttribute("data-bb-menu-target");
          var target = document.querySelector(targetSel);
          if (!target) { return; }

          var isHidden = (target.style.display === "none" || target.style.display === "");
          // Close other external menus (only those display-opened)
          document.querySelectorAll("[data-bb-menu='true'][id]").forEach(function (m) {
            if (m !== target && m.style.display === "flex") {
              m.style.display = "none";
            }
          });

          target.style.display = isHidden ? "flex" : "none";
          extToggle.setAttribute("aria-expanded", isHidden ? "true" : "false");
          return;
        }

        // Click-triggered items inside bb-menu
        var link = e.target.closest(".bb-menu-item[data-bb-menu-trigger='click'] > .bb-menu-link");
        if (link) {
          var item = link.parentElement;
          var sub = item.querySelector(":scope > .bb-menu-sub");
          if (!sub) { return; }

          e.preventDefault();

          // Accordion: close siblings if submenu is accordion
          if (sub.classList.contains("bb-menu-sub-accordion")) {
            closeSiblingAccordions(item);
          }

          var willOpen = !item.classList.contains("show");
          setItemExpanded(item, willOpen);
          return;
        }

        // Click outside: close internal .show menus + external display menus
        document.querySelectorAll("[data-bb-menu='true']").forEach(function (root) {
          if (!root.contains(e.target)) {
            closeAllMenusInside(root);
          }
        });

        document.querySelectorAll("[data-bb-menu='true'][id]").forEach(function (m) {
          if (!m.contains(e.target) && m.style.display === "flex") {
            m.style.display = "none";
          }
        });

        document.querySelectorAll("[data-bb-menu-trigger][data-bb-menu-target]").forEach(function (t) {
          if (!t.contains(e.target)) {
            t.setAttribute("aria-expanded", "false");
          }
        });
      });

      // Init: apply aria-expanded -> .show for accordions on load
      document.querySelectorAll(".bb-menu-item[data-bb-menu-trigger='click'][aria-expanded='true']").forEach(function (item) {
        item.classList.add("show");
      });
    })();
