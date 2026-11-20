/* Faz 11 — authentication UI demonstration only: no API, session or real account. */
(function () {
  "use strict";
  var form = document.querySelector("[data-bb-auth-form]");
  if (!form) return;
  var result = document.querySelector("[data-bb-auth-result]");
  var toggle = document.querySelector("[data-bb-auth-password-toggle]");
  var password = form.querySelector("[data-bb-auth-password]");
  if (toggle && password) {
    toggle.addEventListener("click", function () {
      var visible = password.type === "text";
      password.type = visible ? "password" : "text";
      var label = toggle.querySelector("[data-bb-auth-toggle-label]");
      var icon = toggle.querySelector("[data-bb-auth-toggle-icon]");
      if (label) label.textContent = visible ? "Göster" : "Gizle";
      else toggle.textContent = visible ? "Göster" : "Gizle";
      if (icon) icon.textContent = visible ? "visibility" : "visibility_off";
      if (label) toggle.setAttribute("aria-label", visible ? "Şifreyi göster" : "Şifreyi gizle");
      toggle.setAttribute("aria-pressed", String(!visible));
    });
  }
  var confirm = form.querySelector("[data-bb-auth-confirm]");
  if (password && confirm) {
    confirm.addEventListener("input", function () {
      confirm.setCustomValidity(confirm.value && confirm.value !== password.value ? "Passwordler eşleşmiyor." : "");
    });
    password.addEventListener("input", function () {
      confirm.setCustomValidity(confirm.value && confirm.value !== password.value ? "Passwordler eşleşmiyor." : "");
    });
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (result) {
      var messages = {
        login: "Giriş formu doğrulandı. Oturum açılmadı; bu yalnızca arayüz demosudur.",
        register: "Register formu doğrulandı. Hesap oluşturulmadı.",
        reset: "E-mail biçimi doğrulandı. Sıfırlama bağlantısı gönderilmedi."
      };
      result.textContent = messages[form.dataset.bbAuthForm] || "Form doğrulandı.";
      result.hidden = false;
      result.focus();
    }
  });
})();
