(function () {
      "use strict";

      function findIndicatorRoot(buttonEl) {
        if (!buttonEl) {
          return null;
        }
        return buttonEl.querySelector("[data-bb-indicator-root]") || buttonEl;
      }

      function setIndicatorOn(buttonEl, isOn) {
        var root = findIndicatorRoot(buttonEl);
        if (!root) {
          return;
        }

        if (isOn) {
          root.setAttribute("data-bb-indicator", "on");
          buttonEl.setAttribute("aria-busy", "true");
        } else {
          root.removeAttribute("data-bb-indicator");
          buttonEl.removeAttribute("aria-busy");
        }
      }

      function runIndicator(buttonEl, ms) {
        if (!buttonEl) {
          return;
        }

        setIndicatorOn(buttonEl, true);

        window.setTimeout(function () {
          setIndicatorOn(buttonEl, false);
        }, ms);
      }

      var btnSubmit = document.querySelector("#bb_indicator_btn_submit");
      var btnProcess = document.querySelector("#bb_indicator_btn_process");
      var btnSync = document.querySelector("#bb_indicator_btn_sync");
      var btnRefresh = document.querySelector("#bb_indicator_btn_refresh");
      var btnFormSave = document.querySelector("#bb_indicator_btn_form_save");
      var forceOffAll = document.querySelector("#bb_indicator_force_off_all");

      if (btnSubmit) {
        btnSubmit.addEventListener("click", function () { runIndicator(btnSubmit, 1800); });
      }

      if (btnProcess) {
        btnProcess.addEventListener("click", function () { runIndicator(btnProcess, 2400); });
      }

      if (btnSync) {
        btnSync.addEventListener("click", function () { runIndicator(btnSync, 2000); });
      }

      if (btnRefresh) {
        btnRefresh.addEventListener("click", function () { runIndicator(btnRefresh, 1200); });
      }

      if (btnFormSave) {
        btnFormSave.addEventListener("click", function () { runIndicator(btnFormSave, 2200); });
      }

      if (forceOffAll) {
        forceOffAll.addEventListener("click", function () {
          [btnSubmit, btnProcess, btnSync, btnRefresh, btnFormSave].forEach(function (b) {
            setIndicatorOn(b, false);
          });
        });
      }
    })();
