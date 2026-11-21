(function () {
  "use strict";

  const panel = document.querySelector("[data-bb-sales-finance]");
  if (!panel) return;

  const el = id => document.getElementById("bb_fin_" + id);
  const slot = name => document.querySelector("[data-fin-" + name + "]");
  const money = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });
  const dateLabel = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Istanbul" }).format(new Date());
  const sessionKey = "bb-panel-sales-finance-demo-v1";
  const all = selector => [...panel.querySelectorAll(selector)];
  const financeIcon = name => {
    const icon = node("span", "material-symbols-outlined", name);
    icon.setAttribute("aria-hidden", "true");
    return icon;
  };
  const channels = {
    bulbulustur: { label: "Bulbulustur", icon: "storefront", tone: "primary" },
    draugr: { label: "Draugr", icon: "language", tone: "info" },
    pos: { label: "POS", icon: "point_of_sale", tone: "success" }
  };
  const accountNames = { cash: "Merkez kasa", bank: "İşletme banka hesabı" };
  const documents = {
    missing: ["Fatura bekliyor", "light-warning"],
    draft: ["Taslak", "outline"],
    queued: ["Kuyrukta", "light-primary"],
    failed: ["Gönderim hatası", "light-danger"],
    issued: ["Düzenlendi", "light-success"],
    receipt: ["POS fişi var", "light-success"]
  };
  const sales = [
    {
      id: "BB-10824", channel: "bulbulustur", days: 0, customer: "Kuzey Tasarım", item: "Lina seramik servis seti", qty: 2,
      amount: 248000, paid: true, method: "Pazaryeri ödemesi", document: "missing", type: "e-Fatura",
      payout: { commission: 22320, withholding: 2480, state: "pending", day: -3 }
    },
    {
      id: "DR-20418", channel: "draugr", days: 0, customer: "Deniz Akın", item: "Arden masa lambası", qty: 1,
      amount: 189000, paid: true, method: "Kart", document: "failed", type: "e-Arşiv Fatura"
    },
    {
      id: "POS-00381", channel: "pos", days: 0, customer: "Perakende müşteri", item: "Lina espresso fincanı", qty: 2,
      amount: 58000, paid: true, method: "Nakit", document: "receipt", type: "POS fişi", documentNo: "00381", register: "Merkez mağaza · Kasa 01"
    },
    {
      id: "DR-20411", channel: "draugr", days: 1, customer: "Aylin Yılmaz", item: "Lina kahve fincanı", qty: 4,
      amount: 116000, paid: false, method: "Havale", document: "missing", type: "e-Arşiv Fatura"
    },
    {
      id: "BB-10809", channel: "bulbulustur", days: 2, customer: "Nova Atölye", item: "Arden masa lambası", qty: 2,
      amount: 378000, paid: true, method: "Pazaryeri ödemesi", document: "issued", type: "e-Fatura", documentNo: "SF2026000000021",
      payout: { commission: 34020, withholding: 3780, state: "held", day: -2 },
      refund: { amount: 189000, state: "open" }
    },
    {
      id: "POS-00375", channel: "pos", days: 4, customer: "Perakende müşteri", item: "Arden ayaklı lamba", qty: 1,
      amount: 225000, paid: true, method: "Kart", settlementDay: 3, document: "receipt", type: "POS fişi", documentNo: "00375", register: "Merkez mağaza · Kasa 02"
    },
    {
      id: "DR-20392", channel: "draugr", days: 5, customer: "Can Kaya", item: "Lina seramik servis seti", qty: 1,
      amount: 124000, paid: true, method: "Kart", settlementDay: 4, document: "issued", type: "e-Arşiv Fatura", documentNo: "SA2026000000084",
      refund: { amount: 31000, state: "completed", day: 2 }
    },
    {
      id: "BB-10768", channel: "bulbulustur", days: 12, customer: "Tuna Stüdyo", item: "Arden ayaklı lamba", qty: 3,
      amount: 675000, paid: true, method: "Pazaryeri ödemesi", document: "issued", type: "e-Fatura", documentNo: "SF2026000000007",
      payout: { commission: 60750, withholding: 6750, state: "paid", day: 5 }
    },
    {
      id: "POS-00312", channel: "pos", days: 16, customer: "Perakende müşteri", item: "Lina servis tabağı", qty: 3,
      amount: 174000, paid: true, method: "Nakit", document: "receipt", type: "POS fişi", documentNo: "00312", register: "Merkez mağaza · Kasa 01"
    }
  ].map(sale => ({ ...sale, date: day(sale.days) }));

  let saved = loadState();
  let params = new URLSearchParams(window.location.search);
  let view;
  let period;
  let activeSale = null;
  let movementSource = "";
  let detailDirty = false;
  const drawer = el("detail");
  const detailBody = slot("detail-body");
  const detailAction = slot("detail-action");
  const voucherForm = el("voucher_form");
  const search = el("search");
  const channelFilter = el("channel");
  const stateFilter = el("state");
  const notices = slot("status");
  const filters = {
    invoice: sale => ["missing", "draft"].includes(documentState(sale)),
    failed: sale => documentState(sale) === "failed",
    collection: sale => !sale.paid,
    collected: sale => sale.paid,
    payout: sale => sale.payout?.state === "pending",
    refund: sale => sale.refund?.state === "open"
  };
  const tasks = [
    { key: "invoice", title: "Fatura bekleyenler", icon: "receipt_long", tone: "primary" },
    { key: "failed", title: "Fatura gönderim hataları", icon: "error", tone: "danger" },
    { key: "collection", title: "Tahsilat bekleyenler", icon: "schedule", tone: "warning" },
    { key: "payout", title: "Bekleyen hakedişler", icon: "account_balance_wallet", tone: "info" },
    { key: "refund", title: "Açık iadeler", icon: "assignment_return", tone: "warning" }
  ];

  function loadState() {
    try {
      const value = JSON.parse(sessionStorage.getItem(sessionKey));
      if (Array.isArray(value?.vouchers) && value?.documents && typeof value.documents === "object") return value;
    } catch (error) {
      if (!(error instanceof SyntaxError || error instanceof DOMException)) throw error;
    }
    return { vouchers: [], documents: {} };
  }

  function saveState() {
    try {
      sessionStorage.setItem(sessionKey, JSON.stringify(saved));
    } catch (error) {
      if (!(error instanceof DOMException)) throw error;
    }
  }

  function day(offset) {
    const date = new Date(today + "T12:00:00Z");
    date.setUTCDate(date.getUTCDate() - offset);
    return date.toISOString().slice(0, 10);
  }

  function dateText(value) {
    return dateLabel.format(new Date(value + "T12:00:00Z"));
  }

  function amount(value) {
    return money.format(value / 100);
  }

  function node(tag, className, value) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value !== undefined) element.textContent = value;
    return element;
  }

  function badge(label, tone) {
    return node("span", "badge bb-badge bb-badge-" + tone, label);
  }

  function saleDocument(sale) {
    return documents[documentState(sale)];
  }

  function documentState(sale) {
    const state = saved.documents[sale.id];
    return state === "draft" || state === "queued" ? state : sale.document;
  }

  function netPayout(sale) {
    return sale.amount - sale.payout.commission - sale.payout.withholding;
  }

  function total(items, getValue) {
    return items.reduce((sum, item) => sum + getValue(item), 0);
  }

  function periodSales() {
    return sales.filter(sale => sale.days < period);
  }

  function url(next, extra = {}) {
    return "?" + new URLSearchParams({ view: next, period: String(period), ...extra });
  }

  function paymentBadge(sale) {
    if (!sale.paid) return badge("Bekliyor", "light-warning");
    return sale.refund?.state === "completed" ? badge("Kısmi iade", "light-warning") : badge("Tahsil edildi", "light-success");
  }

  function metric(name, value, caption, icon, tone, action, filter) {
    const card = node("article", "bb-pt-card bb-fin-metric");
    const mark = node("span", "bb-fin-icon");
    mark.dataset.tone = tone;
    mark.append(financeIcon(icon));
    const top = node("div", "bb-fin-metric-top");
    top.append(mark, node("h2", "bb-fin-metric-name", name));
    const link = node("a", "bb-fin-metric-link");
    link.href = url("sales", filter ? { status: filter } : {});
    link.append(document.createTextNode(action + " "), financeIcon("arrow_forward"));
    card.append(top, node("strong", "bb-fin-metric-value", value), node("span", "bb-fin-meta", caption), link);
    return card;
  }

  function renderDashboard() {
    const items = periodSales();
    const gross = total(items, sale => sale.amount);
    const paid = items.filter(sale => sale.paid);
    const pending = items.filter(filters.payout);
    const returns = items.filter(filters.refund);
    slot("metrics").replaceChildren(
      metric("Brüt satış", amount(gross), items.length + " satış · iadeler öncesi", "storefront", "primary", "Tüm satışlar"),
      metric("Tahsil edilen", amount(total(paid, sale => sale.amount)), "Alıcı ödemeleri · iadeler öncesi", "payments", "success", "Tahsilatları incele", "collected"),
      metric("Bekleyen hakediş", amount(total(pending, netPayout)), pending.length + " Bulbulustur satışı", "account_balance_wallet", "info", "Hakedişleri incele", "payout"),
      metric("Açık iade tutarı", amount(total(returns, sale => sale.refund.amount)), returns.length + " açık iade", "assignment_return", "warning", "İadeleri incele", "refund")
    );

    slot("channels").replaceChildren(...Object.entries(channels).map(([key, channel]) => {
      const channelSales = items.filter(sale => sale.channel === key);
      const sum = total(channelSales, sale => sale.amount);
      const percentage = gross ? Math.round(sum * 100 / gross) : 0;
      const link = node("a", "bb-fin-channel");
      link.href = url("sales", { channel: key });
      const icon = node("span", "bb-fin-icon");
      icon.dataset.tone = channel.tone;
      icon.append(financeIcon(channel.icon));
      const label = node("div", "bb-fin-channel-label");
      label.append(node("strong", "", channel.label), node("span", "bb-fin-meta", channelSales.length + " satış"));
      const summary = node("div", "bb-fin-channel-summary");
      summary.append(node("strong", "", amount(sum)), node("span", "bb-fin-meta", "%" + percentage));
      const progress = node("div", "bb-progress bb-progress--sm bb-progress--" + channel.tone);
      const track = node("div", "bb-progress__track");
      const fill = node("div", "bb-progress__bar");
      progress.setAttribute("aria-hidden", "true");
      fill.style.width = percentage + "%";
      track.append(fill);
      progress.append(track);
      link.append(icon, label, summary, financeIcon("chevron_right"), progress);
      return link;
    }));

    let pendingCount = 0;
    slot("tasks").replaceChildren(...tasks.map(task => {
      const count = items.filter(filters[task.key]).length;
      pendingCount += count;
      const link = node("a", "bb-fin-task");
      link.href = url("sales", { status: task.key });
      const icon = node("span", "bb-fin-icon");
      icon.dataset.tone = task.tone;
      icon.append(financeIcon(task.icon));
      link.append(icon, node("strong", "", task.title), node("span", "bb-pt-count-pill", count), financeIcon("chevron_right"));
      return link;
    }));
    slot("task-count").textContent = pendingCount;
    slot("task-count").setAttribute("aria-label", pendingCount + " takip kaydı");
  }

  function cell(row, item, className) {
    const td = row.insertCell();
    if (className) td.className = className;
    td.append(item);
  }

  function titleAndSubtitle(title, subtitle) {
    const item = node("div", "bb-fin-row-title");
    item.append(node("strong", "bb-pt-entity-title", title), node("span", "bb-pt-entity-sub", subtitle));
    return item;
  }

  function detailButton(sale, label = "Detay") {
    const button = node("button", "btn bb-btn-secondary btn-sm text-nowrap", label);
    button.type = "button";
    button.dataset.finSale = sale.id;
    button.setAttribute("aria-label", sale.id + " satış detayı");
    button.setAttribute("data-bb-drawer-toggle", "#bb_fin_detail");
    button.setAttribute("aria-controls", "bb_fin_detail");
    button.setAttribute("aria-expanded", "false");
    return button;
  }

  function renderSales() {
    const items = periodSales();
    const query = search.value.trim().toLocaleLowerCase("tr-TR");
    const filter = filters[stateFilter.value];
    const selected = view === "dashboard" ? items.slice(0, 4) : items.filter(sale =>
      (!channelFilter.value || sale.channel === channelFilter.value) &&
      (!filter || filter(sale)) &&
      (sale.id + " " + sale.customer).toLocaleLowerCase("tr-TR").includes(query));
    el("sales_title").textContent = view === "dashboard" ? "Son Satışlar" : "Satışlar";
    el("sales_count").textContent = view === "dashboard" && items.length > selected.length
      ? selected.length + " / " + items.length + " satış"
      : selected.length + " satış";
    slot("sale-empty").hidden = selected.length !== 0;

    slot("sale-rows").replaceChildren(...selected.map(sale => {
      const row = node("tr");
      cell(row, titleAndSubtitle(sale.id, dateText(sale.date)));
      cell(row, badge(channels[sale.channel].label, "outline"));
      cell(row, sale.customer);
      cell(row, amount(sale.amount), "text-end text-nowrap fw-semibold");
      cell(row, paymentBadge(sale));
      cell(row, badge(...saleDocument(sale)));
      cell(row, detailButton(sale), "text-end");
      return row;
    }));
  }

  function movements() {
    const output = [...saved.vouchers];
    for (const sale of sales) {
      if (sale.payout?.state === "paid") {
        output.push({ id: sale.id, date: day(sale.payout.day), account: "bank", description: "Net satıcı hakedişi", value: netPayout(sale), sale });
      } else if (sale.channel !== "bulbulustur" && sale.paid) {
        const account = sale.method === "Nakit" ? "cash" : "bank";
        if (account === "cash" || sale.settlementDay !== undefined) {
          const date = account === "cash" ? sale.date : day(sale.settlementDay);
          output.push({ id: sale.id, date, account, description: "Satış tahsilatı · " + sale.method, value: sale.amount, sale });
        }
        if (sale.refund?.state === "completed") {
          output.push({ id: sale.id, date: day(sale.refund.day), account, description: "Müşteriye iade", value: -sale.refund.amount, sale });
        }
      }
    }

    return output.filter(item => item.date >= day(period - 1) && item.date <= today &&
      (!movementSource || (item.sale ? "sale" : "manual") === movementSource))
      .sort((first, second) => second.date.localeCompare(first.date));
  }

  function renderMovements() {
    const items = movements();
    slot("in").textContent = amount(total(items, item => Math.max(0, item.value)));
    slot("out").textContent = amount(total(items, item => Math.max(0, -item.value)));
    slot("movement-empty").hidden = items.length !== 0;
    slot("movement-rows").replaceChildren(...items.map(item => {
      const row = node("tr");
      cell(row, titleAndSubtitle(item.id, dateText(item.date)));
      cell(row, accountNames[item.account]);
      cell(row, item.description, "bb-fin-movement-description");
      cell(row, item.sale ? badge(channels[item.sale.channel].label, "outline") : badge("Manuel", "outline"));
      cell(row, (item.value > 0 ? "+" : "−") + amount(Math.abs(item.value)), "text-end text-nowrap fw-semibold " +
        (item.value > 0 ? "bb-fin-inflow" : "bb-fin-outflow"));
      cell(row, item.sale ? detailButton(item.sale, "Satışı gör") : "—", "text-end");
      return row;
    }));
  }

  function detailSection(title, facts) {
    const section = node("section", "bb-pt-card bb-fin-detail-section");
    const heading = node("h3", "bb-pt-title", title);
    const list = node("dl", "bb-fin-facts");
    for (const [label, value] of facts) {
      const entry = node("div");
      const data = node("dd");
      data.append(value);
      entry.append(node("dt", "", label), data);
      list.append(entry);
    }
    section.append(heading, list);
    return section;
  }

  function showSale(sale) {
    activeSale = sale;
    el("detail_title").textContent = "Satış " + sale.id;
    slot("detail-subtitle").textContent = channels[sale.channel].label + " · " + dateText(sale.date);
    const payment = [["Durum", paymentBadge(sale)], ["Ödeme yöntemi", sale.method]];
    if (sale.register) payment.push(["Kasa", sale.register]);
    if (sale.method === "Kart" && sale.paid) {
      payment.push(["Banka aktarımı", sale.settlementDay === undefined ? "Bekliyor" : dateText(day(sale.settlementDay))]);
    }

    detailBody.replaceChildren(
      detailSection("Satış bilgileri", [
        ["Müşteri", sale.customer], ["Ürün", sale.item], ["Miktar", sale.qty + " adet"], ["Satış tutarı", amount(sale.amount)]
      ]),
      detailSection("Tahsilat", payment)
    );

    if (sale.payout) {
      const payoutState = { pending: "Bekliyor", paid: "Ödendi", held: "İade nedeniyle bekliyor" };
      detailBody.append(detailSection("Satıcı hakedişi", [
        ["Durum", payoutState[sale.payout.state]], [sale.payout.state === "paid" ? "Ödeme tarihi" : "Planlanan tarih", dateText(day(sale.payout.day))],
        ["Brüt satış", amount(sale.amount)], ["Komisyon", amount(sale.payout.commission)],
        ["Stopaj", amount(sale.payout.withholding)], ["Net hakediş", amount(netPayout(sale))]
      ]));
    }

    const state = documentState(sale);
    const documentFacts = [["Belge türü", sale.type], ["Durum", badge(...saleDocument(sale))]];
    if (sale.documentNo) documentFacts.push(["Belge numarası", sale.documentNo]);
    if (state === "failed") documentFacts.push(["Gönderim notu", "Örnek sağlayıcı hatası. Gönderim yeniden denenebilir."]);
    if (state === "queued") documentFacts.push(["Gönderim", "Demo kuyruğunda. Sağlayıcıya iletilmedi."]);
    detailBody.append(detailSection("Satış belgesi", documentFacts));

    if (sale.refund) {
      const complete = sale.refund.state === "completed";
      detailBody.append(detailSection("İade", [
        ["İade tutarı", amount(sale.refund.amount)], ["Para iadesi", complete ? "Tamamlandı" : "İşlem bekliyor"],
        ["Belge işlemi", complete ? "Örnekte eşleştirildi" : "Bekliyor"]
      ]));
    }

    const labels = { missing: "Fatura taslağı oluştur", draft: "Demo kuyruğuna al", failed: "Demo gönderimini yeniden dene" };
    detailAction.hidden = !Object.hasOwn(labels, state);
    detailAction.textContent = labels[state] || "";
  }

  function renderView() {
    view = ["sales", "movements"].includes(params.get("view")) ? params.get("view") : "dashboard";
    period = params.get("period") === "7" ? 7 : 30;
    el("period").value = String(period);
    channelFilter.value = Object.hasOwn(channels, params.get("channel") || "") ? params.get("channel") : "";
    stateFilter.value = Object.hasOwn(filters, params.get("status") || "") ? params.get("status") : "";
    search.value = "";
    all("[data-fin-view]").forEach(section => { section.hidden = section.dataset.finView !== view; });
    slot("sales").hidden = view === "movements";
    slot("filters").hidden = view !== "sales";
    slot("all").hidden = view !== "dashboard";
    all("[data-fin-link]").forEach(link => {
      link.href = url(link.dataset.finLink);
      if (!link.closest("nav")) return;
      const active = link.dataset.finLink === view;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    if (view === "dashboard") renderDashboard();
    if (view === "movements") renderMovements();
    else renderSales();
  }

  panel.addEventListener("input", event => {
    if (event.target === search) renderSales();
  });

  slot("filters").addEventListener("submit", event => event.preventDefault());
  [[channelFilter, "channel"], [stateFilter, "status"]].forEach(([field, key]) => {
    field.addEventListener("change", () => {
      if (field.value) params.set(key, field.value);
      else params.delete(key);
      history.replaceState({}, "", "?" + params);
      renderSales();
    });
  });
  slot("clear").addEventListener("click", () => {
    params.delete("channel");
    params.delete("status");
    history.replaceState({}, "", "?" + params);
    search.value = "";
    channelFilter.value = "";
    stateFilter.value = "";
    renderSales();
  });

  el("period").addEventListener("change", event => {
    params.set("period", event.target.value);
    history.replaceState({}, "", "?" + params);
    renderView();
  });

  window.addEventListener("popstate", () => {
    params = new URLSearchParams(window.location.search);
    renderView();
  });

  all("[data-fin-movement-source]").forEach(button => button.addEventListener("click", () => {
    movementSource = button.dataset.finMovementSource;
    all("[data-fin-movement-source]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    renderMovements();
  }));

  document.body.addEventListener("click", event => {
    const trigger = event.target.closest("[data-fin-sale]");
    if (trigger) {
      const sale = sales.find(item => item.id === trigger.dataset.finSale);
      if (sale) showSale(sale);
    }

    if (event.target.closest("[data-fin-voucher]")) {
      voucherForm.reset();
      el("voucher_date").value = today;
      slot("error").hidden = true;
    }
  });

  detailAction.addEventListener("click", () => {
    const state = documentState(activeSale);
    if (!["missing", "draft", "failed"].includes(state)) return;
    saved.documents[activeSale.id] = state === "missing" ? "draft" : "queued";
    saveState();
    notices.textContent = state === "missing" ? "Fatura taslağı oluşturuldu (demo)." : "Fatura demo kuyruğuna alındı.";
    detailDirty = true;
    showSale(activeSale);
    if (detailAction.hidden) drawer.querySelector("[data-bb-drawer-close]").focus();
  });

  new MutationObserver(() => {
    if (!detailDirty || drawer.getAttribute("aria-hidden") !== "true") return;
    detailDirty = false;
    const focused = document.activeElement;
    if (view === "dashboard") renderDashboard();
    if (view !== "movements") renderSales();
    if (focused && !focused.isConnected) {
      const replacement = panel.querySelector('[data-fin-sale="' + activeSale.id + '"]');
      (replacement || panel.querySelector('nav [aria-current="page"]'))?.focus();
    }
  }).observe(drawer, { attributes: true, attributeFilter: ["aria-hidden"] });

  function readAmount(input) {
    const value = input.trim();
    const match = /^(\d{1,9}|\d{1,3}(?:\.\d{3}){1,2})(?:,(\d{1,2}))?$/.exec(value);
    if (!match) return 0;
    const whole = Number(match[1].replaceAll(".", ""));
    return whole * 100 + Number((match[2] || "").padEnd(2, "0"));
  }

  el("voucher_date").max = today;
  voucherForm.addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(voucherForm);
    const value = readAmount(String(form.get("amount")));
    const account = form.get("account");
    const description = String(form.get("description")).trim();
    const date = String(form.get("date"));
    const direction = form.get("direction");
    const error = slot("error");
    if (value <= 0 || !description || !Object.hasOwn(accountNames, account) || !["in", "out"].includes(direction)) {
      error.textContent = "Hesap, açıklama ve pozitif bir tutar girin (ör. 1.250,50).";
      error.hidden = false;
      return;
    }

    saved.vouchers.unshift({
      id: "FİŞ-" + String(saved.vouchers.length + 1).padStart(3, "0"),
      date, account, description, value: direction === "out" ? -value : value
    });
    saveState();
    movementSource = "manual";
    all("[data-fin-movement-source]").forEach(button =>
      button.setAttribute("aria-pressed", String(button.dataset.finMovementSource === movementSource)));
    if (date < day(period - 1) && date >= day(29)) period = 30;
    const next = url("movements");
    history.pushState({}, "", next);
    params = new URLSearchParams(next);
    window.BBDrawer.close();
    renderView();
    notices.textContent = date >= day(period - 1) ? "Manuel fiş kaydedildi (demo)." : "Manuel fiş kaydedildi (demo). İşlem tarihi görüntülenen dönemin dışında.";
  });

  renderView();
})();
