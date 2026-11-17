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
      toggle.textContent = visible ? "Göster" : "Gizle";
      toggle.setAttribute("aria-pressed", String(!visible));
    });
  }
  var confirm = form.querySelector("[data-bb-auth-confirm]");
  if (password && confirm) {
    confirm.addEventListener("input", function () {
      confirm.setCustomValidity(confirm.value && confirm.value !== password.value ? "Şifreler eşleşmiyor." : "");
    });
    password.addEventListener("input", function () {
      confirm.setCustomValidity(confirm.value && confirm.value !== password.value ? "Şifreler eşleşmiyor." : "");
    });
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (result) {
      var messages = {
        login: "Giriş formu doğrulandı. Oturum açılmadı; bu yalnızca arayüz demosudur.",
        register: "Register formu doğrulandı. Hesap oluşturulmadı.",
        reset: "E-posta biçimi doğrulandı. Sıfırlama bağlantısı gönderilmedi."
      };
      result.textContent = messages[form.dataset.bbAuthForm] || "Form doğrulandı.";
      result.hidden = false;
      result.focus();
    }
  });
})();
