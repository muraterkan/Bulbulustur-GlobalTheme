// Bulbulustur Mini Scroll (Auto Height)
    // - Very small subset of Metronic KTScroll idea
    // - Supports:
    //   data-bb-scroll="true"
    //   data-bb-scroll-height="auto" | "300px" | "60vh"
    //   data-bb-scroll-wrappers="#id, .class"
    //   data-bb-scroll-dependencies="#id, .class"
    //   data-bb-scroll-offset="24"

    (function () {
      "use strict";

      function qsa(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      }

      function getOuterHeight(el) {
        if (!el) { return 0; }
        var rect = el.getBoundingClientRect();
        var styles = window.getComputedStyle(el);
        var mt = parseFloat(styles.marginTop) || 0;
        var mb = parseFloat(styles.marginBottom) || 0;
        return rect.height + mt + mb;
      }

      function sumElementsHeight(selectors) {
        if (!selectors) { return 0; }

        var total = 0;
        selectors.split(",").forEach(function (s) {
          var sel = s.trim();
          if (!sel) { return; }

          var el = document.querySelector(sel);
          total += getOuterHeight(el);
        });

        return total;
      }

      function sumWrapperSpaces(selectors) {
        if (!selectors) { return 0; }

        var total = 0;
        selectors.split(",").forEach(function (s) {
          var sel = s.trim();
          if (!sel) { return; }

          var el = document.querySelector(sel);
          if (!el) { return; }

          var styles = window.getComputedStyle(el);
          var pt = parseFloat(styles.paddingTop) || 0;
          var pb = parseFloat(styles.paddingBottom) || 0;
          var bt = parseFloat(styles.borderTopWidth) || 0;
          var bb = parseFloat(styles.borderBottomWidth) || 0;
          var mt = parseFloat(styles.marginTop) || 0;
          var mb = parseFloat(styles.marginBottom) || 0;

          total += pt + pb + bt + bb + mt + mb;
        });

        return total;
      }

      function parseOffset(value) {
        if (!value) { return 0; }
        var n = parseFloat(value);
        if (isNaN(n)) { return 0; }
        return n;
      }

      function updateAutoHeight(el) {
        if (!el) { return; }

        var height = el.getAttribute("data-bb-scroll-height") || "";
        if (height !== "auto") {
          el.style.maxHeight = height;
          return;
        }

        var deps = el.getAttribute("data-bb-scroll-dependencies") || "";
        var wraps = el.getAttribute("data-bb-scroll-wrappers") || "";
        var offset = parseOffset(el.getAttribute("data-bb-scroll-offset"));

        var viewport = window.innerHeight;
        var depsH = sumElementsHeight(deps);
        var wrapsH = sumWrapperSpaces(wraps);

        var calc = viewport - depsH - wrapsH - offset;
        if (calc < 120) { calc = 120; }

        el.style.maxHeight = calc + "px";
      }

      function init() {
        qsa('[data-bb-scroll="true"]').forEach(function (el) {
          updateAutoHeight(el);
        });
      }

      // Buttons (demo)
      var scrollEl = document.getElementById("bb_scroll_auto");
      var btnTop = document.getElementById("bb_scroll_top");
      var btnBottom = document.getElementById("bb_scroll_bottom");
      var btnUpdate = document.getElementById("bb_scroll_update");

      if (btnTop && scrollEl) {
        btnTop.addEventListener("click", function () {
          scrollEl.scrollTop = 0;
        });
      }

      if (btnBottom && scrollEl) {
        btnBottom.addEventListener("click", function () {
          scrollEl.scrollTop = scrollEl.scrollHeight;
        });
      }

      if (btnUpdate && scrollEl) {
        btnUpdate.addEventListener("click", function () {
          init();
        });
      }

      // Auto update on resize
      window.addEventListener("resize", function () {
        init();
      });

      init();
    })();
