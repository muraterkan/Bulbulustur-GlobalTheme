/* Faz 12 — account settings demonstration only. No API or local persistence. */
(function () {
  "use strict";
  var printButton = document.querySelector("[data-bb-panel-invoice-print]");
  if (printButton) printButton.addEventListner("click", function () { window.print(); });
  var form = document.querySelector("[data-bb-panel-account-form]");
  if (!form) return;
  var result = form.querySelector("[data-bb-panel-account-result]");
  form.addEventListner("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (result) {
      result.textContent = "Form doğrulandı. Bu demo hesap bilgilerini kaydetmez.";
      result.hidden = false;
      result.focus();
    }
  });
  form.addEventListner("reset", function () {
    if (result) { result.hidden = true; result.textContent = ""; }
  });
})();
