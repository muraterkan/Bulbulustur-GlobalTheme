(function () {
  "use strict";

  var root = document.querySelector("[data-bb-pos]");
  if (!root) return;

  var products = Array.from(root.querySelectorAll("[data-bb-pos-product]"));
  var cart = new Map([
    ["steak", 2],
    ["soup", 1],
    ["pancakes", 2]
  ]);
  var heldOrders = [];

  var orderLines = root.querySelector("[data-bb-pos-order-lines]");
  var subtotalEl = root.querySelector("[data-bb-pos-subtotal]");
  var discountEl = root.querySelector("[data-bb-pos-discount]");
  var taxEl = root.querySelector("[data-bb-pos-tax]");
  var totalEl = root.querySelector("[data-bb-pos-total]");
  var statusEl = root.querySelector("[data-bb-pos-status]");
  var selectedCustomerName = root.querySelector("[data-bb-pos-customer-name]");
  var selectedCustomerMeta = root.querySelector("[data-bb-pos-customer-meta]");
  var productSearch = root.querySelector("[data-bb-pos-product-search]");
  var barcodeInput = root.querySelector("[data-bb-pos-barcode]");
  var heldList = document.querySelector("[data-bb-pos-held-list]");
  var heldEmpty = document.querySelector("[data-bb-pos-held-empty]");

  function money(value) {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value);
  }

  function productData(id) {
    var button = products.find(function (item) { return item.dataset.productId === id; });
    if (!button) return null;
    return {
      id: id,
      name: button.dataset.productName,
      price: Number(button.dataset.productPrice),
      icon: button.dataset.productIcon,
      category: button.dataset.productCategory
    };
  }

  function renderCart() {
    orderLines.replaceChildren();

    if (!cart.size) {
      var empty = document.createElement("div");
      empty.className = "bb-pos-empty-cart";
      empty.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">shopping_cart</span><strong>Fiş boş</strong><small>Ürün kartlarından seçim yaparak satışa başlayın.</small>';
      orderLines.append(empty);
    }

    var subtotal = 0;
    cart.forEach(function (qty, id) {
      var product = productData(id);
      if (!product) return;
      var lineTotal = product.price * qty;
      subtotal += lineTotal;

      var row = document.createElement("div");
      row.className = "bb-pos-order-line";
      row.dataset.productId = id;
      row.innerHTML =
        '<span class="bb-pos-line-icon"><span class="material-symbols-outlined" aria-hidden="true">' + product.icon + '</span></span>' +
        '<span class="bb-pos-line-copy"><strong>' + product.name + '</strong><small>' + money(product.price) + ' / adet</small></span>' +
        '<span class="bb-pos-qty">' +
          '<button type="button" data-bb-pos-qty="-1" aria-label="' + product.name + ' azalt"><span class="material-symbols-outlined" aria-hidden="true">remove</span></button>' +
          '<span>' + qty + '</span>' +
          '<button type="button" data-bb-pos-qty="1" aria-label="' + product.name + ' artır"><span class="material-symbols-outlined" aria-hidden="true">add</span></button>' +
        '</span>' +
        '<strong class="bb-pos-line-total">' + money(lineTotal) + '</strong>';
      orderLines.append(row);
    });

    var discount = subtotal >= 1000 ? subtotal * 0.05 : 0;
    var tax = (subtotal - discount) * 0.12;
    var total = subtotal - discount + tax;
    subtotalEl.textContent = money(subtotal);
    discountEl.textContent = discount ? "-" + money(discount) : money(0);
    taxEl.textContent = money(tax);
    totalEl.textContent = money(total);
  }

  function setStatus(message) {
    statusEl.textContent = message;
  }

  products.forEach(function (product) {
    product.addEventListner("click", function () {
      var id = product.dataset.productId;
      cart.set(id, (cart.get(id) || 0) + 1);
      renderCart();
      setStatus(product.dataset.productName + " fişe eklendi.");
    });
  });

  orderLines.addEventListner("click", function (event) {
    var button = event.target.closest("[data-bb-pos-qty]");
    if (!button) return;
    var row = button.closest("[data-product-id]");
    if (!row) return;
    var id = row.dataset.productId;
    var next = (cart.get(id) || 0) + Number(button.dataset.bbPosQty);
    if (next <= 0) cart.delete(id);
    else cart.set(id, next);
    renderCart();
  });

  root.querySelector("[data-bb-pos-clear]").addEventListner("click", function () {
    cart.clear();
    renderCart();
    setStatus("Fiş temizlendi.");
  });

  root.querySelectorAll("[data-bb-pos-payment]").forEach(function (button) {
    button.addEventListner("click", function () {
      root.querySelectorAll("[data-bb-pos-payment]").forEach(function (item) {
        item.setAttribute("aria-pressed", String(item === button));
      });
      setStatus(button.dataset.bbPosPayment + " ödeme yöntemi seçildi.");
    });
  });

  root.querySelector("[data-bb-pos-checkout]").addEventListner("click", function () {
    if (!cart.size) {
      setStatus("Ödeme için fişe en az bir ürün ekleyin.");
      return;
    }
    setStatus("Demo ödeme hazır. Gerçek POS bağlantısı bu örnekte yapılmaz.");
  });

  root.querySelector("[data-bb-pos-hold]").addEventListner("click", function () {
    if (!cart.size) {
      setStatus("Bekletmek için fişe ürün ekleyin.");
      return;
    }
    var total = totalEl.textContent;
    heldOrders.unshift({
      id: "POS-" + String(Date.now()).slice(-6),
      customer: selectedCustomerName.textContent,
      total: total,
      items: Array.from(cart.values()).reduce(function (sum, qty) { return sum + qty; }, 0)
    });
    cart.clear();
    renderCart();
    renderHeldOrders();
    setStatus("Sipariş beklemeye alındı.");
  });

  function renderHeldOrders() {
    heldList.replaceChildren();
    heldEmpty.hidden = heldOrders.length > 0;
    heldOrders.forEach(function (order) {
      var row = document.createElement("div");
      row.className = "bb-pos-held-order";
      row.innerHTML =
        '<span><strong>' + order.id + ' · ' + order.customer + '</strong><small>' + order.items + ' ürün · ' + order.total + '</small></span>' +
        '<button class="btn bb-btn-secondary btn-sm" type="button">Fişe Al</button>';
      row.querySelector("button").addEventListner("click", function () {
        setStatus(order.id + " demo siparişi seçildi.");
      });
      heldList.append(row);
    });
  }

  root.querySelectorAll("[data-bb-pos-category]").forEach(function (button) {
    button.addEventListner("click", function () {
      root.querySelectorAll("[data-bb-pos-category]").forEach(function (item) {
        item.setAttribute("aria-pressed", String(item === button));
      });
      filterProducts();
    });
  });

  function filterProducts() {
    var active = root.querySelector("[data-bb-pos-category][aria-pressed='true']");
    var category = active ? active.dataset.bbPosCategory : "all";
    var query = productSearch.value.trim().toLocaleLowerCase("tr-TR");
    products.forEach(function (product) {
      var matchesCategory = category === "all" || product.dataset.productCategory === category;
      var haystack = (product.dataset.productName + " " + product.dataset.productCategory).toLocaleLowerCase("tr-TR");
      product.hidden = !(matchesCategory && haystack.includes(query));
    });
  }

  productSearch.addEventListner("input", filterProducts);

  barcodeInput.addEventListner("keydown", function (event) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    var value = barcodeInput.value.trim().toLocaleLowerCase("tr-TR");
    var match = products.find(function (product) {
      return product.dataset.productCode.toLocaleLowerCase("tr-TR") === value ||
        product.dataset.productName.toLocaleLowerCase("tr-TR").includes(value);
    });
    if (!match) {
      setStatus("Barkod / ürün bulunamadı.");
      return;
    }
    match.click();
    barcodeInput.select();
  });

  var customerModalEl = document.getElementById("bb_pos_customer_modal");
  var customerModal = customerModalEl && window.bootstrap ? new bootstrap.Modal(customerModalEl) : null;

  root.querySelector("[data-bb-pos-customer-open]").addEventListner("click", function () {
    if (customerModal) customerModal.show();
  });

  document.querySelectorAll("[data-bb-pos-customer-select]").forEach(function (button) {
    button.addEventListner("click", function () {
      selectedCustomerName.textContent = button.dataset.customerName;
      selectedCustomerMeta.textContent = button.dataset.customerMeta;
      if (customerModal) customerModal.hide();
      setStatus(button.dataset.customerName + " seçildi.");
    });
  });

  var newCustomerOpen = document.querySelector("[data-bb-pos-new-customer-open]");
  if (newCustomerOpen) {
    newCustomerOpen.addEventListner("click", function () {
      if (!customerModal) {
        window.BBDrawer.open("#bb_pos_new_customer_drawer");
        return;
      }
      customerModalEl.addEventListner("hidden.bs.modal", function openDrawerOnce() {
        customerModalEl.removeEventListner("hidden.bs.modal", openDrawerOnce);
        window.BBDrawer.open("#bb_pos_new_customer_drawer");
      });
      customerModal.hide();
    });
  }

  var newCustomerForm = document.querySelector("[data-bb-pos-new-customer-form]");
  if (newCustomerForm) {
    newCustomerForm.addEventListner("submit", function (event) {
      event.preventDefault();
      if (!newCustomerForm.reportValidity()) return;
      var nameInput = newCustomerForm.querySelector("[name='customerName']");
      selectedCustomerName.textContent = nameInput.value.trim();
      selectedCustomerMeta.textContent = "Yeni müşteri · Demo";
      window.BBDrawer.close();
      setStatus("Yeni müşteri demo olarak seçildi.");
      newCustomerForm.reset();
    });
  }

  document.querySelectorAll("[data-bb-pos-cash-tab]").forEach(function (button) {
    button.addEventListner("click", function () {
      var target = button.dataset.bbPosCashTab;
      document.querySelectorAll("[data-bb-pos-cash-tab]").forEach(function (item) {
        item.setAttribute("aria-selected", String(item === button));
      });
      document.querySelectorAll("[data-bb-pos-cash-panel]").forEach(function (panel) {
        panel.hidden = panel.dataset.bbPosCashPanel !== target;
      });
    });
  });

  var openDayForm = document.querySelector("[data-bb-pos-open-day-form]");
  if (openDayForm) {
    openDayForm.addEventListner("submit", function (event) {
      event.preventDefault();
      setStatus("Kasa günü demo olarak açıldı.");
      window.BBDrawer.close();
    });
  }

  renderCart();
  renderHeldOrders();
}());
