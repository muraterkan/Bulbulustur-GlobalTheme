/* Panel service cart — client-side visual demo. No payment, order or subscription writes. */
(function () {
  "use strict";

  const root = document.querySelector("[data-bb-cart]");
  if (!root) return;
  const catalog = window.BBPanelServicePlans;
  if (!catalog) throw new Error("Panel package catalog is required by the cart.");
  const STORAGE_KEY = "bb-panel-service-cart-v1";
  const $ = selector => root.querySelector(selector);
  const format = amount => new Intl.NumberFormat("tr-TR", {style:"currency",currency:"TRY",minimumFractionDigits:2}).format(amount);
  const params = new URLSearchParams(window.location.search);

  function resolveLine(data) {
    if (!data || typeof data !== "object") return null;
    const service = data.product === "posx" ? "posb" : data.product;
    const plan = catalog[service]?.plans.find(item => item.id === data.plan);
    if (!plan) return null;
    const quantity = Number(data.quantity);
    return {product:service,plan:plan.id,quantity:Number.isInteger(quantity) ? Math.min(5,Math.max(1,quantity)) : 1};
  }
  function readSaved() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
      if (saved && Array.isArray(saved.items)) {
        return {
          items:saved.items.map(resolveLine).filter(Boolean),
          coupon:saved.coupon === true,
          method:saved.method === "bank" ? "bank" : "card"
        };
      }
    } catch (_) { /* Demo remains functional in memory. */ }
    return null;
  }
  let state = readSaved();
  const chosenProduct = params.get("product");
  const chosenPlan = params.get("plan");
  const chosen = resolveLine({product:chosenProduct,plan:chosenPlan,quantity:1});
  if (!state) {
    state = chosen ?
      {items:[chosen],coupon:false,method:"card"} :
      {items:[{product:"draugr",plan:"pro",quantity:1},{product:"posb",plan:"basic",quantity:1}],coupon:false,method:"card"};
  } else if (chosen) {
    // A plan selection replaces the previous plan for that service, not a second subscription.
    state.items = state.items.filter(item => item.product !== chosen.product);
    state.items.push(chosen);
  }
  function persist() {
    try { sessionStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }
    catch (_) { /* Storage can be disabled. */ }
  }
  function node(tag,className,text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function icon(name) {
    const span = node("span","material-symbols-outlined",name);
    span.setAttribute("aria-hidden","true");
    return span;
  }
  function button(text,iconName,className) {
    const el = node("button",className,text);
    el.type = "button";
    if (iconName) el.prepend(icon(iconName));
    return el;
  }
  function notice(message) { $("[data-bb-cart-status]").textContent = message; }
  function detail(line) {
    const item = catalog[line.product].plans.find(plan => plan.id === line.plan);
    return {...item,product:line.product,quantity:line.quantity};
  }
  function totals() {
    const subtotal = state.items.reduce((sum,line) => sum + detail(line).year * line.quantity,0);
    const discount = state.coupon ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
    const tax = Math.round((subtotal - discount) * 0.2 * 100) / 100;
    return {subtotal,discount,tax,total:Math.round((subtotal - discount + tax) * 100) / 100};
  }
  function remove(index) {
    const line = state.items[index];
    if (!line) return;
    const name = detail(line).name;
    state.items.splice(index,1);
    if (!state.items.length) state.coupon = false;
    persist();render();notice(name + " sepetten kaldırıldı (demo).");
  }
  function updateQuantity(index,value) {
    const line = state.items[index];
    if (!line || value < 1 || value > 5) return;
    line.quantity = value;
    persist();render();notice(detail(line).name + ": " + value + " örnek hizmet adedi.");
  }
  function makeRow(line,index) {
    const item = detail(line);
    const service = catalog[line.product];
    const row = node("article","bb-cart-item");
    const info = node("div","bb-cart-item-info");
    const symbol = node("span","bb-symbol size-60 is-circle");
    symbol.setAttribute("aria-hidden","true");
    const symbolText = node("span","bb-symbol-label");
    symbolText.append(icon(service.icon));
    symbol.append(symbolText);
    const copy = node("div","bb-cart-item-copy");
    copy.append(node("small","bb-cart-item-category",service.label.toUpperCase()));
    copy.append(node("h4","bb-cart-item-title",item.name));
    copy.append(node("p","bb-cart-muted mb-0",item.description));
    const period = node("span","bb-badge bb-badge-light-primary","1 yıl · Demo");
    copy.append(period);
    const edit = node("a","bb-cart-edit-link","Paket değiştir");
    edit.href = "pricing.html?product=" + line.product;
    copy.append(edit);
    info.append(symbol,copy);

    const qty = node("div","bb-cart-quantity");
    const minus = button("","remove","bb-cart-quantity-button");
    minus.setAttribute("aria-label",item.name + " adedini azalt");
    minus.disabled = line.quantity <= 1;
    minus.addEventListener("click",() => updateQuantity(index,line.quantity - 1));
    const count = node("output","bb-cart-quantity-value",String(line.quantity));
    count.setAttribute("aria-label",item.name + " adedi");
    const plus = button("","add","bb-cart-quantity-button");
    plus.setAttribute("aria-label",item.name + " adedini artır");
    plus.disabled = line.quantity >= 5;
    plus.addEventListener("click",() => updateQuantity(index,line.quantity + 1));
    qty.append(minus,count,plus);

    const money = node("div","bb-cart-item-money");
    money.append(node("strong","",format(item.year * line.quantity)));
    if (line.quantity > 1) money.append(node("small","bb-cart-muted",format(item.year) + " / adet"));
    const removeButton = button("","delete_outline","bb-cart-remove");
    removeButton.setAttribute("aria-label",item.name + " paketini sepetten kaldır");
    removeButton.title = "Sepetten kaldır";
    removeButton.addEventListener("click",() => remove(index));
    row.append(info,qty,money,removeButton);
    return row;
  }
  function render() {
    const container = $("[data-bb-cart-items]");
    container.replaceChildren(...state.items.map(makeRow));
    const count = state.items.reduce((sum,line) => sum + line.quantity,0);
    $("[data-bb-cart-count]").textContent = count + " hizmet adedi · " + state.items.length + " paket";
    $("[data-bb-cart-empty]").hidden = state.items.length > 0;
    $("[data-bb-cart-checkout]").disabled = state.items.length === 0;
    $("[data-bb-cart-coupon-clear]").hidden = !state.coupon;
    $("[data-bb-cart-coupon-status]").textContent = state.coupon ?
      "DEMO10: %10 örnek indirim uygulandı." : "DEMO10 kodu örnek %10 indirim uygular.";

    const lines = $("[data-bb-cart-summary-lines]");
    lines.replaceChildren(...state.items.map(line => {
      const item = detail(line);
      const li = node("li");
      const name = node("span","",line.quantity + " × " + item.name);
      li.append(name,node("strong","",format(item.year * line.quantity)));
      return li;
    }));
    const sum = totals();
    $("[data-bb-cart-subtotal]").textContent = format(sum.subtotal);
    $("[data-bb-cart-discount]").textContent = sum.discount ? "−" + format(sum.discount) : format(0);
    $("[data-bb-cart-tax]").textContent = format(sum.tax);
    $("[data-bb-cart-total]").textContent = format(sum.total);
    root.querySelectorAll("[name='cartPayment']").forEach(radio => {
      radio.checked = radio.value === state.method;
    });
  }
  $("[data-bb-cart-coupon-form]").addEventListener("submit",event => {
    event.preventDefault();
    const value = $("[data-bb-cart-coupon]").value.trim().toUpperCase();
    if (value !== "DEMO10") {
      state.coupon = false;
      notice("Bu demoda yalnız DEMO10 kodu geçerli.");
    } else {
      state.coupon = true;
      notice("Örnek %10 indirim uygulandı. Gerçek kupon doğrulaması yapılmadı.");
    }
    persist();render();
  });
  $("[data-bb-cart-coupon-clear]").addEventListener("click",() => {
    state.coupon = false;
    $("[data-bb-cart-coupon]").value = "";
    persist();render();notice("Örnek indirim kaldırıldı.");
  });
  root.querySelectorAll("[name='cartPayment']").forEach(radio => radio.addEventListener("change",() => {
    state.method = radio.value === "bank" ? "bank" : "card";
    persist();
  }));
  $("[data-bb-cart-checkout]").addEventListener("click",() => {
    if (!state.items.length) return;
    persist();
    window.location.assign("checkout.html?source=cart&method=" + encodeURIComponent(state.method));
  });
  persist();
  render();
  notice("Bu demo sepeti geçici tarayıcı oturumunda tutulur. Gerçek sipariş veya ödeme yapılmaz.");
})();