(function () {
  "use strict";

  function formatCardNumber(raw) {
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function detectCardBrand(digits) {
    if (digits.startsWith("5")) return "MC";
    if (digits.startsWith("9")) return "TROY";
    if (digits.startsWith("3")) return "AMEX";
    return "VISA";
  }

  function formatExpiry(raw) {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    // 1. Inline Düzenle (İletişim & Teslimat Adresi)
    document.querySelectorAll("[data-ec-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-ec-edit");
        const isContact = target === "contact";
        const editor = document.getElementById(isContact ? "ecContactEditor" : "ecAddressEditor");
        const display = document.getElementById(isContact ? "ecContactDisplay" : "ecAddressDisplay");
        const input = document.getElementById(isContact ? "ecContactInput" : "ecAddressInput");
        if (!editor || !display || !input) return;

        const opening = editor.hasAttribute("hidden");
        if (opening) {
          editor.removeAttribute("hidden");
          btn.textContent = "Kaydet";
          input.focus();
        } else {
          const val = input.value.trim();
          if (val) display.textContent = val;
          editor.setAttribute("hidden", "");
          btn.textContent = "Düzenle";
        }
      });
    });

    // 2. "Farklı bir kart kullan" Akordeon Aç/Kapa
    const altToggle = document.getElementById("ecAltCardToggle");
    const altBody = document.getElementById("ecAltCardBody");
    const altChevron = document.getElementById("ecAltChevron");

    function setAltCardOpen(open) {
      if (!altToggle || !altBody || !altChevron) return;
      if (open) {
        altBody.removeAttribute("hidden");
        altChevron.classList.add("is-open");
        altToggle.setAttribute("aria-expanded", "true");
      } else {
        altBody.setAttribute("hidden", "");
        altChevron.classList.remove("is-open");
        altToggle.setAttribute("aria-expanded", "false");
      }
    }

    altToggle?.addEventListener("click", () => {
      const isCurrentlyOpen = !altBody?.hasAttribute("hidden");
      setAltCardOpen(!isCurrentlyOpen);
    });

    document.getElementById("ecSwitchToAltBtn")?.addEventListener("click", () => {
      setAltCardOpen(true);
      document.getElementById("ecCardNumberInput")?.focus();
    });

    // 3. Yeni Kart Numarası & Son Kullanma Formatlama
    const cardNumInput = document.getElementById("ecCardNumberInput");
    const brandTag = document.getElementById("ecCardBrandTag");
    const expInput = document.getElementById("ecCardExpInput");

    cardNumInput?.addEventListener("input", () => {
      const digits = cardNumInput.value.replace(/\D/g, "");
      cardNumInput.value = formatCardNumber(digits);
      if (brandTag) brandTag.textContent = detectCardBrand(digits);
    });

    expInput?.addEventListener("input", () => {
      expInput.value = formatExpiry(expInput.value);
    });

    // 4. CVV & Demo Ödeme Ön İzleme Durumu
    const payForm = document.getElementById("ecPayForm");
    const cvvInput = document.getElementById("ecCvvInput");
    const submitBtn = document.getElementById("ecPaySubmitBtn");
    const btnLabel = document.getElementById("ecPayBtnLabel");

    cvvInput?.addEventListener("input", () => {
      cvvInput.value = cvvInput.value.replace(/\D/g, "").slice(0, 4);
    });

    payForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!cvvInput || cvvInput.value.length < 3 || !submitBtn || !btnLabel) {
        cvvInput?.focus();
        return;
      }

      const prevText = btnLabel.textContent;
      submitBtn.classList.add("is-confirmed");
      btnLabel.textContent = "Doğrulandı (Demo Ön İzleme)";

      window.setTimeout(() => {
        submitBtn.classList.remove("is-confirmed");
        btnLabel.textContent = prevText;
      }, 2000);
    });
  });
})();