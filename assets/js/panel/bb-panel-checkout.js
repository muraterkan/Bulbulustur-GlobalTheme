/* Panel SaaS checkout preview — Draugr / PosB. No payment API, PAN/CVV collection or server writes. */
(function () {
  "use strict";

  const root = document.querySelector("[data-bb-checkout]");
  if (!root) return;

  const catalog = {
    draugr: {
      title: "Draugr", icon: "storefront", summary: "Kendi alan adınızda mağaza",
      plans: [
        {id:"basic",name:"Draugr Basic",amount:2500,description:"Temel mağaza ve tema yönetimi"},
        {id:"pro",name:"Draugr Pro",amount:10000,description:"İçerik, SEO ve gelişmiş kontrol"},
        {id:"custom",name:"Draugr Custom",amount:100000,description:"Özel tasarım ve ileri ihtiyaçlar"}
      ]
    },
    posb: {
      title: "PosB", icon: "point_of_sale", summary: "Şube, kasa ve stok yönetimi",
      plans: [
        {id:"basic",name:"PosB Basic",amount:499,description:"Tek mağaza için kasa operasyonu"},
        {id:"pro",name:"PosB Pro",amount:999,description:"Çoklu şube ve kasa yönetimi"},
        {id:"enterprise",name:"PosB Enterprise",amount:1999,description:"Büyük mağaza operasyonları"}
      ]
    }
  };

  const params = new URLSearchParams(window.location.search);
  const requested = (params.get("product") || "draugr").toLocaleLowerCase("tr-TR");
  const productKey = requested === "posx" ? "posb" : requested in catalog ? requested : "draugr";
  const product = catalog[productKey];
  const requestedPlan = (params.get("plan") || "basic").toLowerCase();
  const selectedPlan = product.plans.find(plan => plan.id === requestedPlan) ||
    product.plans[Number(requestedPlan)] || product.plans[0];

  const $ = selector => root.querySelector(selector);
  const $$ = selector => Array.from(root.querySelectorAll(selector));
  const fmt = amount => new Intl.NumberFormat("tr-TR", {style:"currency",currency:"TRY",minimumFractionDigits:2}).format(amount);
  let current = 0;
  let maximumVisited = 0;
  let couponApplied = false;
  let completed = false;

  function announce(message, error) {
    const status = $("[data-bb-checkout-status]");
    status.textContent = message;
    status.dataset.level = error ? "error" : "info";
  }
  function price() {
    const subtotal = selectedPlan.amount;
    const discount = couponApplied ? Math.round(subtotal * 10) / 100 : 0;
    const tax = Math.round((subtotal - discount) * 20) / 100;
    return {subtotal,discount,tax,total:Math.round((subtotal - discount + tax) * 100) / 100};
  }
  function bindProduct() {
    $$("[data-bb-checkout-product-name]").forEach(el => { el.textContent = product.title; });
    $$("[data-bb-checkout-product-description]").forEach(el => { el.textContent = product.summary; });
    $$("[data-bb-checkout-plan-name]").forEach(el => { el.textContent = selectedPlan.name; });
    $("[data-bb-checkout-plan-description]").textContent = selectedPlan.description;
    $("[data-bb-checkout-product-icon]").textContent = product.icon;
    $("[data-bb-checkout-product-link]").href = "pricing.html?product=" + productKey;
    const returnLink = document.querySelector("[data-bb-checkout-back-pricing]");
    if (returnLink) returnLink.href = "pricing.html?product=" + productKey;
    $$("[data-bb-checkout-service]").forEach(link => {
      const active = link.dataset.bbCheckoutService === productKey;
      if (active) link.setAttribute("aria-current","page");
      else link.removeAttribute("aria-current");
    });
  }
  function renderTotals() {
    const totals = price();
    $("[data-bb-checkout-subtotal]").textContent = fmt(totals.subtotal);
    $("[data-bb-checkout-discount]").textContent = totals.discount ? "−" + fmt(totals.discount) : fmt(0);
    $("[data-bb-checkout-tax]").textContent = fmt(totals.tax);
    $$("[data-bb-checkout-total]").forEach(el => { el.textContent = fmt(totals.total); });
    $("[data-bb-checkout-coupon-text]").textContent = couponApplied ?
      "DEMO10: %10 örnek indirim uygulandı." : "Yalnız DEMO10 kodu arayüz demosunda geçerlidir.";
    $("[data-bb-checkout-remove-coupon]").hidden = !couponApplied;
    $("[data-bb-checkout-price-note]").textContent = selectedPlan.name +
      " · Yıllık paket · Temsilî fiyat ve KDV";
  }
  function validateStep() {
    const pane = $("[data-bb-checkout-pane='" + current + "']");
    const inputs = Array.from(pane.querySelectorAll("input, select, textarea"))
      .filter(input => !input.disabled && !input.closest("[hidden]"));
    for (const input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        announce("Devam etmek için bu adımdaki zorunlu alanları tamamlayın.",true);
        return false;
      }
    }
    if (current === 2 && !$("[name='paymentMethod']:checked")) {
      announce("Bir ödeme yöntemi seçin.",true);
      return false;
    }
    return true;
  }
  function field(name) {
    const element = root.querySelector("[name='" + name + "']");
    return element ? element.value.trim() : "";
  }
  function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value;
  }
  function renderReview() {
    const fullname = [field("firstName"),field("lastName")].filter(Boolean).join(" ") || "—";
    setText("[data-bb-checkout-review-contact]",fullname + " · " + (field("email") || "—"));
    const type = root.querySelector("[name='invoiceType']:checked")?.value || "personal";
    setText("[data-bb-checkout-review-billing]",(type === "business" ? field("companyName") : fullname) +
      " · " + [field("invoiceAddress"),field("invoiceCity"),field("invoiceCountry")].filter(Boolean).join(", "));
    const method = root.querySelector("[name='paymentMethod']:checked")?.value || "card";
    setText("[data-bb-checkout-review-payment]",method === "card" ? "Güvenli kart ödeme alanı (demo)" : "Banka havalesi (demo)");
    setText("[data-bb-checkout-review-plan]",selectedPlan.name + " · 1 yıl");
    setText("[data-bb-checkout-review-total]",fmt(price().total));
  }
  function renderStep() {
    $$("[data-bb-checkout-pane]").forEach(pane => { pane.hidden = Number(pane.dataset.bbCheckoutPane) !== current; });
    $$("[data-bb-checkout-step]").forEach((item,index) => {
      item.dataset.complete = String(index < current);
      if (index === current) item.setAttribute("aria-current","step");
      else item.removeAttribute("aria-current");
      const button = item.querySelector("button");
      button.disabled = index > maximumVisited || completed;
      button.setAttribute("aria-label",(index + 1) + ". adıma git: " + item.dataset.stepLabel);
    });
    $("[data-bb-checkout-previous]").hidden = current === 0 || completed;
    $("[data-bb-checkout-next]").hidden = current === 3 || completed;
    $("[data-bb-checkout-submit]").hidden = current !== 3 || completed;
    $("[data-bb-checkout-progress]").textContent = (current + 1) + " / 4";
    if (current === 3) renderReview();
  }
  function goStep(index) {
    if (completed) return;
    if (index > current) {
      if (!validateStep()) return;
      if (index > current + 1) return;
    }
    current = Math.max(0,Math.min(3,index));
    maximumVisited = Math.max(maximumVisited,current);
    announce("Adım " + (current + 1) + " / 4: " + $("[data-bb-checkout-step='" + current + "']").dataset.stepLabel);
    renderStep();
    $("[data-bb-checkout-form-title]").focus();
  }
  $$("[data-bb-checkout-step]").forEach(item => {
    item.querySelector("button").addEventListener("click",() => {
      const index = Number(item.dataset.bbCheckoutStep);
      if (index <= maximumVisited && index < current) goStep(index);
    });
  });
  $("[data-bb-checkout-next]").addEventListener("click",() => goStep(current + 1));
  $("[data-bb-checkout-previous]").addEventListener("click",() => goStep(current - 1));

  $$("[name='invoiceType']").forEach(radio => radio.addEventListener("change",() => {
    const business = root.querySelector("[name='invoiceType']:checked")?.value === "business";
    const businessFields = $("[data-bb-checkout-business-fields]");
    businessFields.hidden = !business;
    businessFields.querySelectorAll("input").forEach(input => { input.required = business; });
  }));
  $$("[name='paymentMethod']").forEach(radio => radio.addEventListener("change",() => {
    const card = root.querySelector("[name='paymentMethod']:checked")?.value === "card";
    $("[data-bb-checkout-card-method]").hidden = !card;
    $("[data-bb-checkout-bank-method]").hidden = card;
  }));

  $("[data-bb-checkout-coupon-form]").addEventListener("submit",event => {
    event.preventDefault();
    const code = field("coupon").toUpperCase();
    if (code === "DEMO10") {
      couponApplied = true;
      renderTotals();
      announce("DEMO10 kodu ile örnek %10 indirim uygulandı. Gerçek kupon doğrulanmadı.");
    } else {
      couponApplied = false;
      renderTotals();
      announce("Bu demo için geçerli tek kod DEMO10.",true);
    }
  });
  $("[data-bb-checkout-remove-coupon]").addEventListener("click",() => {
    couponApplied = false;
    root.querySelector("[name='coupon']").value = "";
    renderTotals();
    announce("Örnek indirim kaldırıldı.");
  });

  $("[data-bb-checkout-form]").addEventListener("submit",event => {
    event.preventDefault();
    if (completed || current !== 3 || !validateStep()) return;
    completed = true;
    $("[data-bb-checkout-confirmation]").hidden = false;
    $("[data-bb-checkout-workflow]").hidden = true;
    $("[data-bb-checkout-summary]").hidden = true;
    $("[data-bb-checkout-confirmation-product]").textContent = selectedPlan.name;
    $("[data-bb-checkout-confirmation-total]").textContent = fmt(price().total);
    announce("Demo akışı tamamlandı. Gerçek ödeme alınmadı, sipariş ve abonelik oluşturulmadı.");
    $("[data-bb-checkout-confirmation-heading]").focus();
  });
  $("[data-bb-checkout-reset]").addEventListener("click",() => {
    window.location.assign("checkout.html?product=" + productKey + "&plan=" + encodeURIComponent(selectedPlan.id));
  });

  bindProduct();
  renderTotals();
  renderStep();
  announce("Bu ekran demo amaçlıdır. Gerçek ödeme, kart saklama veya abonelik oluşturma işlemi yapılmaz.");
})();