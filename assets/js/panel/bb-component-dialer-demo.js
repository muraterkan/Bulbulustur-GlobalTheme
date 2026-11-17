/* Component demo only — Dialer event log */
(function () {
  "use strict";

  // event demo
      document.querySelectorAll(".bb-dialer").forEach(function (el) {
        el.addEventListener("bb.dialer.changed", function () {
          const inst = window.BBDialer.getInstance(el);
          if (!inst) { return; }
          console.log("Dialer changed:", inst.getValue());
        });
      });
})();
