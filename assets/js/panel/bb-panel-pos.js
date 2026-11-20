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
  var storageKey = "bb-pos-demo-session";
  var embedded = window.parent !== window && new URLSearchParams(window.location.search).get("embed") === "1";

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

  var currency = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });
  var defaultCustomer = { name: selectedCustomerName.textContent, meta: selectedCustomerMeta.textContent };
  var currentCustomer = defaultCustomer;
  var paymentOptions = Array.from(root.querySelectorAll("[data-bb-pos-payment]"));
  var payment = paymentOptions.find(function (button) { return button.getAttribute("aria-pressed") === "true"; }).dataset.bbPosPayment;
  var heldCount = root.querySelector("[data-bb-pos-held-count]");
  var heldStatus = document.querySelector("[data-bb-pos-held-status]");
  var posExit = root.querySelector("[data-bb-pos-exit]");
  var exitDialog = document.querySelector("[data-bb-pos-exit-dialog]");
  var exitStatus = exitDialog.querySelector("[data-bb-pos-exit-status]");

  function money(value) {
    return currency.format(value);
  }

  function snapshot() {
    return { lines: Array.from(cart), customer: currentCustomer, payment: payment };
  }

  function save(active, pending) {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ active: active, held: pending }));
      return true;
    } catch (_) {
      return false;
    }
  }

  function restore(receipt) {
    cart = new Map(receipt.lines.filter(function (line) {
      return Array.isArray(line) && productData(line[0]) && Number.isInteger(line[1]) && line[1] > 0;
    }));
    setCustomer(receipt.customer || defaultCustomer);
    selectPayment(receipt.payment);
  }

  function setCustomer(customer) {
    currentCustomer = customer;
    selectedCustomerName.textContent = customer.name;
    selectedCustomerMeta.textContent = customer.meta;
  }

  function selectPayment(method) {
    if (!paymentOptions.some(function (button) { return button.dataset.bbPosPayment === method; })) return;
    payment = method;
    paymentOptions.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.bbPosPayment === payment));
    });
  }

  try {
    var session = JSON.parse(sessionStorage.getItem(storageKey));
    if (session && Array.isArray(session.held)) {
      heldOrders = session.held.filter(function (order) { return order && Array.isArray(order.lines) && order.customer; });
    }
    if (session && session.active && Array.isArray(session.active.lines)) restore(session.active);
  } catch (_) {
    // The demo still works in the current view when storage is unavailable.
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
      empty.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">shopping_cart</span><strong>Fiş boş</strong><small>Ürün seçin veya barkod okutun.</small>';
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
    save(snapshot(), heldOrders);
  }

  function setStatus(message) {
    statusEl.textContent = message;
  }

  products.forEach(function (product) {
    product.addEventListener("click", function () {
      var id = product.dataset.productId;
      cart.set(id, (cart.get(id) || 0) + 1);
      renderCart();
      setStatus(product.dataset.productName + " fişe eklendi.");
    });
  });

  orderLines.addEventListener("click", function (event) {
    var button = event.target.closest("[data-bb-pos-qty]");
    if (!button) return;
    var row = button.closest("[data-product-id]");
    if (!row) return;
    var id = row.dataset.productId;
    var next = (cart.get(id) || 0) + Number(button.dataset.bbPosQty);
    if (next <= 0) cart.delete(id);
    else cart.set(id, next);
    renderCart();
    var replacement = orderLines.querySelector('[data-product-id="' + id + '"] [data-bb-pos-qty="' + button.dataset.bbPosQty + '"]');
    (replacement || root.querySelector("[data-bb-pos-clear]")).focus();
  });

  root.querySelector("[data-bb-pos-clear]").addEventListener("click", function () {
    cart.clear();
    renderCart();
    setStatus("Fiş temizlendi.");
  });

  paymentOptions.forEach(function (button) {
    button.addEventListener("click", function () {
      selectPayment(button.dataset.bbPosPayment);
      save(snapshot(), heldOrders);
      setStatus(payment + " ödeme yöntemi seçildi.");
    });
  });

  root.querySelector("[data-bb-pos-checkout]").addEventListener("click", function () {
    if (!cart.size) {
      setStatus("Ödeme için fişe en az bir ürün ekleyin.");
      return;
    }
    setStatus("Demo ödeme hazır. Gerçek POS bağlantısı bu örnekte yapılmaz.");
  });

  function holdReceipt(requireStorage) {
    var order = snapshot();
    order.id = "POS-" + String(Date.now()).slice(-6);
    order.total = totalEl.textContent;
    var pending = [order].concat(heldOrders);
    var saved = save({ lines: [], customer: defaultCustomer, payment: payment }, pending);
    if (requireStorage && !saved) return false;

    heldOrders = pending;
    cart.clear();
    setCustomer(defaultCustomer);
    renderCart();
    renderHeldOrders();
    setStatus("Fiş beklemeye alındı.");
    return true;
  }

  root.querySelector("[data-bb-pos-hold]").addEventListener("click", function () {
    if (cart.size) holdReceipt(false);
    else setStatus("Beklemeye almak için fişe ürün ekleyin.");
  });

  function renderHeldOrders() {
    heldList.replaceChildren();
    heldEmpty.hidden = heldOrders.length > 0;
    heldCount.hidden = !heldOrders.length;
    heldCount.textContent = heldOrders.length;

    heldOrders.forEach(function (order, index) {
      var row = document.createElement("div");
      row.className = "bb-pos-held-order";
      var copy = document.createElement("span");
      var title = document.createElement("strong");
      var description = document.createElement("small");
      var items = order.lines.reduce(function (sum, line) { return sum + line[1]; }, 0);
      title.textContent = order.id + " · " + order.customer.name;
      description.textContent = items + " ürün · " + order.total;
      copy.append(title, description);

      var button = document.createElement("button");
      button.className = "btn bb-btn-secondary";
      button.type = "button";
      button.textContent = "Fişe al";
      button.addEventListener("click", function () {
        if (cart.size) {
          heldStatus.textContent = "Önce aktif fişi beklemeye alın veya temizleyin.";
          return;
        }
        restore(order);
        heldOrders.splice(index, 1);
        renderCart();
        renderHeldOrders();
        setStatus(order.id + " aktif fişe alındı.");
        window.BBDrawer.close();
      });
      row.append(copy, button);
      heldList.append(row);
    });
  }

  function leavePOS() {
    save(snapshot(), heldOrders);
    if (embedded) window.parent.postMessage({ type: "bb:pos:close" }, window.location.origin);
    else window.location.assign(posExit.href);
  }

  function requestExit() {
    if (root.inert || exitDialog.open) return;
    if (!cart.size) {
      leavePOS();
      return;
    }
    exitStatus.hidden = true;
    exitDialog.showModal();
  }

  posExit.addEventListener("click", function (event) {
    event.preventDefault();
    requestExit();
  });

  exitDialog.querySelector("[data-bb-pos-hold-exit]").addEventListener("click", function () {
    if (holdReceipt(true)) {
      exitDialog.close();
      leavePOS();
    } else {
      exitStatus.hidden = false;
      exitStatus.textContent = "Fiş sekme oturumuna kaydedilemedi. Fiş kasada açık kaldı.";
    }
  });

  if (embedded) {
    window.addEventListener("message", function (event) {
      if (event.origin !== window.location.origin || event.source !== window.parent || !event.data) return;
      if (event.data.type === "bb:pos:activate") {
        if (event.data.theme === "light" || event.data.theme === "dark") {
          document.documentElement.setAttribute("data-bs-theme", event.data.theme);
        }
        barcodeInput.focus();
      }
      if (event.data.type === "bb:pos:request-close") requestExit();
    });
  }

  root.querySelectorAll("[data-bb-pos-category]").forEach(function (button) {
    button.addEventListener("click", function () {
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
    var visible = 0;
    products.forEach(function (product) {
      var matchesCategory = category === "all" || product.dataset.productCategory === category;
      var haystack = (product.dataset.productName + " " + product.dataset.productCategory).toLocaleLowerCase("tr-TR");
      product.hidden = !(matchesCategory && haystack.includes(query));
      if (!product.hidden) visible++;
    });
    root.querySelector("[data-bb-pos-product-count]").textContent = visible + " ürün";
    root.querySelector("[data-bb-pos-no-products]").hidden = visible !== 0;
  }

  productSearch.addEventListener("input", filterProducts);

  barcodeInput.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    var value = barcodeInput.value.trim().toLocaleLowerCase("tr-TR");
    if (!value) return;
    var match = products.find(function (product) {
      return product.dataset.productCode.toLocaleLowerCase("tr-TR") === value;
    }) || products.find(function (product) {
      return product.dataset.productName.toLocaleLowerCase("tr-TR").includes(value);
    });
    if (!match) {
      setStatus("Barkod / ürün bulunamadı.");
      return;
    }
    match.click();
    barcodeInput.select();
  });

  var customerDrawer = document.querySelector("#bb_pos_customer_drawer");
  var customerSearch = customerDrawer.querySelector("[data-bb-pos-customer-search]");
  var customerChoices = Array.from(customerDrawer.querySelectorAll("[data-bb-pos-customer-select]"));
  var customerEmpty = customerDrawer.querySelector("[data-bb-pos-customer-empty]");
  var customerList = customerDrawer.querySelector("[data-bb-pos-customer-list]");
  var customerCreate = customerDrawer.querySelector("[data-bb-pos-customer-create]");
  var newCustomerOpen = customerDrawer.querySelector("[data-bb-pos-new-customer-open]");
  var newCustomerForm = customerDrawer.querySelector("[data-bb-pos-new-customer-form]");

  function filterCustomers() {
    var query = customerSearch.value.trim().toLocaleLowerCase("tr-TR");
    customerChoices.forEach(function (button) {
      var text = button.dataset.customerName + " " + button.dataset.customerMeta;
      button.hidden = !text.toLocaleLowerCase("tr-TR").includes(query);
    });
    customerEmpty.hidden = customerChoices.some(function (button) { return !button.hidden; });
  }

  function showCustomerForm(show) {
    customerCreate.hidden = !show;
    newCustomerOpen.hidden = show;
    customerList.hidden = show;
  }

  function chooseCustomer(name, meta) {
    setCustomer({ name: name, meta: meta });
    save(snapshot(), heldOrders);
    window.BBDrawer.close();
    setStatus(name + " seçildi.");
  }

  customerSearch.addEventListener("input", filterCustomers);
  customerChoices.forEach(function (button) {
    button.addEventListener("click", function () {
      chooseCustomer(button.dataset.customerName, button.dataset.customerMeta);
    });
  });
  newCustomerOpen.addEventListener("click", function () {
    showCustomerForm(true);
    newCustomerForm.elements.customerName.focus();
  });
  newCustomerForm.querySelector("[data-bb-pos-customer-back]").addEventListener("click", function () {
    showCustomerForm(false);
    newCustomerOpen.focus();
  });
  var customerNameInput = newCustomerForm.elements.customerName;
  customerNameInput.addEventListener("input", function () { customerNameInput.setCustomValidity(""); });
  newCustomerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = customerNameInput.value.trim();
    if (!name) {
      customerNameInput.setCustomValidity("Müşteri adını girin.");
      customerNameInput.reportValidity();
      return;
    }
    chooseCustomer(name, "Yeni müşteri · Demo");
  });

  var drawers = Array.from(document.querySelectorAll(".bb-pos-drawer"));
  var activeDrawer = null;
  var drawerTrigger = null;
  var drawerObserver = new MutationObserver(function () {
    var next = drawers.find(function (drawer) { return drawer.getAttribute("aria-hidden") === "false"; }) || null;
    if (next === activeDrawer) return;

    drawers.forEach(function (drawer) { drawer.inert = drawer !== next; });
    root.inert = Boolean(next);
    activeDrawer = next;
    if (!next) {
      if (drawerTrigger) drawerTrigger.focus();
      drawerTrigger = null;
      return;
    }

    if (next === customerDrawer) {
      customerDrawer.querySelector("[data-bb-pos-customer-summary-name]").textContent = currentCustomer.name;
      customerDrawer.querySelector("[data-bb-pos-customer-summary-meta]").textContent = currentCustomer.meta;
      customerSearch.value = "";
      newCustomerForm.reset();
      customerNameInput.setCustomValidity("");
      showCustomerForm(false);
      filterCustomers();
    } else {
      heldStatus.textContent = "";
    }
    function focusDrawer() {
      if (activeDrawer !== next || next.contains(document.activeElement)) return;
      (next === customerDrawer ? customerSearch : next).focus();
    }
    next.addEventListener("transitionend", focusDrawer, { once: true });
    requestAnimationFrame(focusDrawer);
  });
  drawers.forEach(function (drawer) { drawerObserver.observe(drawer, { attributes: true, attributeFilter: ["aria-hidden"] }); });

  root.addEventListener("click", function (event) {
    var toggle = event.target.closest("[data-bb-drawer-toggle]");
    if (toggle) drawerTrigger = toggle;
  });

  document.addEventListener("keydown", function (event) {
    if (!activeDrawer) return;
    if (event.key === "Escape") {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab") return;
    var tabbable = Array.from(activeDrawer.querySelectorAll("button, input, textarea, select, a[href]"))
      .filter(function (node) { return !node.disabled && node.getClientRects().length; });
    var next = event.shiftKey ? tabbable.at(-1) : tabbable[0];
    var edge = event.shiftKey ? tabbable[0] : tabbable.at(-1);
    if (next && (document.activeElement === activeDrawer || document.activeElement === edge)) {
      event.preventDefault();
      next.focus();
    }
  }, true);

  document.querySelectorAll("[data-bb-pos-cash-tab]").forEach(function (button) {
    button.addEventListener("click", function () {
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
    openDayForm.addEventListener("submit", function (event) {
      event.preventDefault();
      setStatus("Kasa günü demo olarak açıldı.");
      window.BBDrawer.close();
    });
  }

  renderCart();
  renderHeldOrders();
}());
