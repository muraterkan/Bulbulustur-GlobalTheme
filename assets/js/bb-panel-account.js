/* Faz 12 — account settings demonstration only. No API or local persistence. */
(function () {
  "use strict";
  var form = document.querySelector("[data-bb-panel-account-form]");
  if (!form) return;
  var result = form.querySelector("[data-bb-panel-account-result]");
  var initial = {};
  Array.from(form.elements).forEach(function (field) {
    if (field.name) initial[field.name] = field.type === "checkbox" ? field.checked : field.value;
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (result) {
      result.textContent = "Form doğrulandı. Bu demo hesap bilgilerini kaydetmez.";
      result.hidden = false;
      result.focus();
    }
  });
  form.addEventListener("reset", function () {
    if (result) { result.hidden = true; result.textContent = ""; }
  });
})();
