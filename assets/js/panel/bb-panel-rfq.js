/* Seller RFQ preview. Requests, access modes and submitted offers are demo data. */
(function () {
  "use strict";

  var root = document.querySelector("[data-bb-rfq]");
  if (!root) return;

  var day = 86400000;
  var now = Date.now();
  var params = new URLSearchParams(window.location.search);
  var subscribed = params.get("demo") === "abone";
  var storageKey = "bb-rfq-demo-offers";
  var offers = new Map();
  if (subscribed) {
    try {
      offers = new Map(JSON.parse(sessionStorage.getItem(storageKey) || "[]"));
    } catch (_) {
      // Session storage is optional for the demo.
    }
  }

  var requests = [
    { id: "2418", product: "Çift oluklu sevkiyat kolisi", category: "Ambalaj", buyer: "Kuzey Dağıtım", city: "Kocaeli", quantity: 2500, unit: "adet", target: 24.50, currency: "TRY", deadline: 1, age: 1, terms: "DAP · Depo teslim", description: "60 × 40 × 40 cm, BC dalga ve en az 25 kg taşıma kapasiteli. Baskısız, paletli teslim tercih edilir. Teklifte numune ve sevkiyat koşullarını belirtin." },
    { id: "2417", product: "304 kalite paslanmaz çelik sac", category: "Metal", buyer: "Arma Endüstri", city: "Bursa", quantity: 1800, unit: "kg", target: 3.10, currency: "EUR", deadline: 2, age: 2, terms: "EXW · Fabrika teslim", description: "2 mm, 2B yüzeyli sac. Standart plaka ölçüsü 1.250 × 2.500 mm. Malzeme sertifikası ve stoktan teslim süresini teklife ekleyin." },
    { id: "2416", product: "Nitril kaplı iş eldiveni", category: "İş güvenliği", buyer: "Eksen Yapı", city: "Ankara", quantity: 1200, unit: "çift", target: 38, currency: "TRY", deadline: 3, age: 1, terms: "DAP · Depo teslim", description: "EN 388 belgeli, 9 ve 10 numara karışık. Koli başına adet ve belgelerin temin süresini paylaşın." },
    { id: "2415", product: "Endüstriyel raf sistemi", category: "Depo ekipmanı", buyer: "Rota Lojistik", city: "İzmir", quantity: 48, unit: "modül", currency: "TRY", deadline: 4, age: 2, terms: "DAP · Saha teslim", description: "Dört katlı, raf başı 800 kg taşıma kapasiteli. Montaj dahil ve montaj hariç koşulları teklif notunda belirtin." },
    { id: "2414", product: "EPAL ahşap palet", category: "Depo ekipmanı", buyer: "Bora Gıda", city: "Tekirdağ", quantity: 600, unit: "adet", target: 9, currency: "EUR", deadline: 5, age: 4, terms: "DAP · Depo teslim", description: "80 × 120 cm, ısıl işlemli ve damgalı palet. İlk teslimat için 300 adetlik parti kabul edilir." },
    { id: "2413", product: "Kraft kâğıt çanta", category: "Ambalaj", buyer: "Sahil Perakende", city: "İstanbul", quantity: 10000, unit: "adet", target: 8, currency: "TRY", deadline: 6, age: 3, terms: "DAP · Depo teslim", description: "32 × 16 × 40 cm, burgu saplı, tek renk logo baskılı. Baskı prova süresini belirtin." },
    { id: "2412", product: "Galvanizli bağlantı elemanı", category: "Metal", buyer: "Atlas Makina", city: "Konya", quantity: 8000, unit: "adet", currency: "TRY", deadline: 7, age: 5, terms: "EXW · Fabrika teslim", description: "M10 × 35, 8.8 sınıfı. Somun ve rondela set fiyatı üzerinden teklif verin." },
    { id: "2411", product: "Yüksek görünürlüklü yelek", category: "İş güvenliği", buyer: "Mira Tesis Yönetimi", city: "Eskişehir", quantity: 350, unit: "adet", target: 89, currency: "TRY", deadline: 8, age: 5, terms: "DAP · Saha teslim", description: "EN ISO 20471, turuncu, M–XXL beden dağılımlı. Sırt baskısı opsiyonunu belirtin." },
    { id: "2410", product: "Streç ambalaj filmi", category: "Ambalaj", buyer: "Delta Sevkiyat", city: "Sakarya", quantity: 300, unit: "rulo", currency: "TRY", deadline: -1, age: 8, terms: "DAP · Depo teslim", description: "50 cm × 300 m, en az 23 mikron, şeffaf el tipi streç film." }
  ].map(function (request) {
    request.dueAt = now + request.deadline * day;
    return request;
  });

  var drawer = document.querySelector("#bb_rfq_drawer");
  var panel = root.closest("[data-bb-panel]");
  var container = root.closest(".bb-container");
  var drawerTitle = drawer.querySelector("#bb_rfq_drawer_title");
  var form = drawer.querySelector("#bb_rfq_offer_form");
  var fields = form.elements;
  var search = root.querySelector("[data-bb-rfq-search]");
  var category = root.querySelector("[data-bb-rfq-category]");
  var sort = root.querySelector("[data-bb-rfq-sort]");
  var size = root.querySelector("[data-bb-rfq-page-size]");
  var rows = root.querySelector("[data-bb-rfq-rows]");
  var prev = root.querySelector("[data-bb-rfq-prev]");
  var next = root.querySelector("[data-bb-rfq-next]");
  var metrics = Array.from(root.querySelectorAll("[data-bb-rfq-status]"));
  var selected = null;
  var page = 1;
  var status = "all";
  var refreshOnClose = false;
  var returnFocus = null;

  var formatCount = new Intl.NumberFormat("tr-TR");
  var shortDate = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", timeZone: "Europe/Istanbul" });
  var fullDate = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" });

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function setText(scope, key, value) {
    scope.querySelector("[data-bb-rfq-" + key + "]").textContent = value;
  }

  function hide(scope, key, value) {
    var node = scope.querySelector("[data-bb-rfq-" + key + "]");
    node.hidden = value;
  }

  function money(value, currency) {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: currency }).format(value);
  }

  function quantity(request) {
    return formatCount.format(request.quantity) + " " + request.unit;
  }

  function isOpen(request) {
    return request.dueAt > Date.now();
  }

  function isUrgent(request) {
    return isOpen(request) && request.dueAt - Date.now() <= 2 * day;
  }

  function sentOffer(request) {
    return subscribed ? offers.get(request.id) : undefined;
  }

  function canOffer(request) {
    return subscribed && isOpen(request) && !sentOffer(request);
  }

  function stateBadge(request) {
    var state = sentOffer(request) ? ["Teklif verildi", "info"] : isOpen(request) ? ["Açık", "success"] : ["Kapandı", "secondary"];
    return element("span", "badge bb-badge bb-badge-light-" + state[1], state[0]);
  }

  function matchesStatus(request, filter) {
    if (filter === "offered") return Boolean(sentOffer(request));
    if (filter === "soon") return isUrgent(request);
    if (filter === "open") return isOpen(request);
    return true;
  }

  function matchingRequests() {
    var query = search.value.trim().toLocaleLowerCase("tr-TR").replace(/^#/, "");
    return requests.filter(function (request) {
      var haystack = ["RFQ-" + request.id, request.product, request.category, request.buyer, request.city].join(" ").toLocaleLowerCase("tr-TR");
      return matchesStatus(request, status) && (!category.value || category.value === request.category) && haystack.includes(query);
    }).sort(function (a, b) {
      if (sort.value === "newest") return a.age - b.age || Number(b.id) - Number(a.id);
      return Number(isOpen(b)) - Number(isOpen(a)) || a.dueAt - b.dueAt;
    });
  }

  function renderRow(request) {
    var row = element("tr");
    var requestCell = element("th");
    requestCell.scope = "row";
    var button = element("button", "bb-rfq-request-button", request.product);
    button.type = "button";
    button.dataset.bbRfqRequest = request.id;
    button.dataset.bbDrawerToggle = "#" + drawer.id;
    button.setAttribute("aria-controls", drawer.id);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-haspopup", "dialog");
    button.addEventListener("click", function () {
      returnFocus = button;
      openRequest(request);
    });
    requestCell.append(button, element("small", "bb-rfq-muted", "RFQ-" + request.id + " · " + request.category));

    var buyer = element("td");
    buyer.append(element("strong", "", request.buyer), element("small", "bb-rfq-muted", request.city));
    var deadline = element("td", "bb-rfq-deadline");
    var time = element("time", "", shortDate.format(request.dueAt));
    time.dateTime = new Date(request.dueAt).toISOString();
    deadline.appendChild(time);
    if (isUrgent(request)) {
      deadline.appendChild(element("small", "bb-rfq-deadline-soon", "Son 48 saat"));
    }

    var state = element("td");
    state.appendChild(stateBadge(request));
    row.append(requestCell, buyer, element("td", "text-end bb-rfq-number", quantity(request)), deadline, state);
    return row;
  }

  function render() {
    var matching = matchingRequests();
    var pageSize = Number(size.value);
    var pageCount = Math.max(1, Math.ceil(matching.length / pageSize));
    page = Math.min(page, pageCount);
    var start = (page - 1) * pageSize;
    var visible = matching.slice(start, start + pageSize);

    metrics.forEach(function (button) {
      var filter = button.dataset.bbRfqStatus;
      button.setAttribute("aria-pressed", String(status === filter));
      button.querySelector("[data-bb-rfq-count]").textContent = requests.filter(function (request) {
        return matchesStatus(request, filter);
      }).length;
    });
    rows.replaceChildren.apply(rows, visible.map(renderRow));
    prev.disabled = page === 1;
    next.disabled = page === pageCount;
    setText(root, "result", matching.length + " talep");
    setText(root, "range", visible.length ? (start + 1) + "–" + (start + visible.length) + " / " + matching.length : "0 kayıt");
    setText(root, "empty-text", status === "offered" && !subscribed ? "Teklif gönderme, RFQ aboneliğiyle açılır." : "Eşleşen talep bulunamadı.");
    hide(root, "empty", visible.length > 0);
  }

  function showPreviewLink(request) {
    drawer.querySelector("[data-bb-rfq-preview]").href = request
      ? "rfq.html?demo=abone&talep=" + encodeURIComponent(request.id)
      : "rfq.html?demo=abone";
  }

  function renderQuote() {
    var offer = sentOffer(selected);
    var priceCents = offer ? offer.priceCents : Math.round(Number(fields.price.value) * 100);
    var lead = offer ? offer.lead : Number(fields.lead.value);
    var unitPrice = priceCents > 0 ? money(priceCents / 100, selected.currency) : "—";
    var total = priceCents > 0 ? money(priceCents * selected.quantity / 100, selected.currency) : "—";
    setText(drawer, "quote-price", unitPrice);
    setText(drawer, "quote-lead", lead > 0 ? lead + " gün" : "—");
    setText(drawer, "quote-total", total);
  }

  function openRequest(request) {
    selected = request;
    var offer = sentOffer(request);
    var editable = canOffer(request);
    var note = offer ? "Demo teklif kaydedildi. Teklif " + offer.validity + " gün geçerli." : "Bu talep teklif alımına kapandı.";
    if (offer && offer.note) note += " Teklif notu: " + offer.note;

    drawerTitle.textContent = request.product;
    setText(drawer, "drawer-id", "RFQ-" + request.id + " · " + request.category);
    drawer.querySelector("[data-bb-rfq-drawer-status]").replaceChildren(stateBadge(request));
    setText(drawer, "drawer-buyer", request.buyer + " · " + request.city);
    setText(drawer, "request-quantity", quantity(request));
    setText(drawer, "request-target", request.target ? money(request.target, request.currency) : "Belirtilmedi");
    setText(drawer, "request-location", request.city);
    setText(drawer, "request-deadline", fullDate.format(request.dueAt));
    setText(drawer, "request-description", request.description);
    setText(drawer, "request-terms", request.terms);
    setText(drawer, "quote-quantity", quantity(request));
    setText(drawer, "currency", request.currency);
    setText(drawer, "detail-feedback", note);
    form.reset();
    form.inert = !editable;

    hide(drawer, "detail", false);
    hide(drawer, "plan-body", true);
    hide(drawer, "back", true);
    hide(drawer, "preview", true);
    hide(drawer, "offer-editor", !editable);
    hide(drawer, "send", !editable);
    hide(drawer, "detail-feedback", !offer && isOpen(request));
    hide(drawer, "lock", subscribed || !isOpen(request));
    hide(drawer, "plan", subscribed || !isOpen(request));
    renderQuote();
  }

  function openPlan() {
    drawerTitle.textContent = "RFQ aboneliği";
    setText(drawer, "drawer-id", "B2B");
    drawer.querySelector("[data-bb-rfq-drawer-status]").replaceChildren();
    setText(drawer, "drawer-buyer", subscribed ? "Aktif abonelik · Demo" : "Şirketiniz için teklif verme erişimi");
    hide(drawer, "detail", true);
    hide(drawer, "plan-body", false);
    hide(drawer, "plan", true);
    hide(drawer, "send", true);
    hide(drawer, "back", !selected);
    hide(drawer, "preview", subscribed);
    showPreviewLink(selected);
  }

  container.querySelector("[data-bb-rfq-plan]").addEventListener("click", function (event) {
    selected = null;
    returnFocus = event.currentTarget;
    openPlan();
  });
  drawer.querySelector("[data-bb-rfq-plan]").addEventListener("click", function () {
    openPlan();
    drawer.focus();
  });
  drawer.querySelector("[data-bb-rfq-back]").addEventListener("click", function () {
    openRequest(selected);
    drawer.focus();
  });

  form.addEventListener("input", renderQuote);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!selected || !canOffer(selected) || !form.reportValidity()) return;

    offers.set(selected.id, {
      priceCents: Math.round(Number(fields.price.value) * 100),
      lead: Number(fields.lead.value),
      validity: Number(fields.validity.value),
      note: fields.note.value.trim()
    });
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(Array.from(offers)));
    } catch (_) {
      // The current preview can still show the offer.
    }
    refreshOnClose = true;
    openRequest(selected);
    drawer.focus();
  });

  new MutationObserver(function () {
    var open = drawer.getAttribute("aria-hidden") === "false";
    panel.inert = open;
    if (open) {
      if (!drawer.contains(document.activeElement)) drawer.focus();
      return;
    }

    var focus = returnFocus;
    if (refreshOnClose) {
      render();
      focus = rows.querySelector('[data-bb-rfq-request="' + selected.id + '"]') || metrics.find(function (button) {
        return button.dataset.bbRfqStatus === status;
      });
      refreshOnClose = false;
    }
    if (focus) focus.focus();
    returnFocus = null;
  }).observe(drawer, { attributes: true, attributeFilter: ["aria-hidden"] });

  drawer.addEventListener("keydown", function (event) {
    if (event.key !== "Tab") return;
    var items = Array.from(drawer.querySelectorAll("a[href], button, input, textarea")).filter(function (node) {
      return !node.disabled && node.getClientRects().length;
    });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (document.activeElement === drawer || (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  });

  Array.from(new Set(requests.map(function (request) { return request.category; }))).sort(function (a, b) {
    return a.localeCompare(b, "tr");
  }).forEach(function (name) {
    var option = element("option", "", name);
    option.value = name;
    category.appendChild(option);
  });

  function resetPage() {
    page = 1;
    render();
  }
  search.addEventListener("input", resetPage);
  [category, sort, size].forEach(function (control) { control.addEventListener("change", resetPage); });
  prev.addEventListener("click", function () { page--; render(); });
  next.addEventListener("click", function () { page++; render(); });
  metrics.forEach(function (button) {
    button.addEventListener("click", function () {
      status = button.dataset.bbRfqStatus;
      resetPage();
    });
  });
  root.querySelector("[data-bb-rfq-clear]").addEventListener("click", function () {
    status = "all";
    search.value = "";
    category.value = "";
    sort.value = "deadline";
    resetPage();
  });

  if (subscribed) {
    setText(root, "access-icon", "verified");
    setText(root, "access-title", "RFQ aboneliği aktif · Demo");
    setText(root, "access-description", "Açık taleplere teklif hazırlayabilir, demo tekliflerinizi takip edebilirsiniz.");
    var previewLink = container.querySelector("[data-bb-rfq-preview]");
    previewLink.href = "rfq.html";
    previewLink.textContent = "Abonesiz görünümü önizle";
  }

  var requested = params.get("talep");
  var position = matchingRequests().findIndex(function (request) { return request.id === requested; });
  if (position !== -1) page = Math.floor(position / Number(size.value)) + 1;
  render();
  if (position !== -1) rows.querySelector('[data-bb-rfq-request="' + requested + '"]').click();
})();
