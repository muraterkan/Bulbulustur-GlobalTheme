(function () {
  "use strict";

  var dashboard = document.querySelector("[data-bb-merchant-dashboard]");
  if (!dashboard) return;

  var demo = window.BBMerchantDemo;
  var channels = new Map(demo.channels.map(function (channel) { return [channel.id, channel]; }));
  var drawer = document.querySelector("#merchant-task-drawer");
  var drawerList = drawer.querySelector("[data-bb-merchant-drawer-list]");
  var formatMoney = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });

  var tasks = [
    { name: "Hazırlanacak sipariş", icon: "inventory_2", tone: "primary", records: ordersIn("prepare") },
    { name: "Kargolanacak sipariş", icon: "local_shipping", tone: "info", records: ordersIn("ship") },
    { name: "Fatura bekleyen", icon: "receipt_long", tone: "warning", records: ordersIn("invoice") },
    { name: "Cevap bekleyen soru", icon: "forum", tone: "info", records: demo.questions },
    { name: "Bekleyen iade", icon: "assignment_return", tone: "danger", records: ordersIn("return") }
  ];

  function ordersIn(state) {
    return demo.orders.filter(function (order) { return order.state === state; });
  }

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function icon(name) {
    var glyph = element("span", "material-symbols-outlined", name);
    glyph.setAttribute("aria-hidden", "true");
    return glyph;
  }

  function badge(label, tone) {
    return element("span", "badge bb-badge bb-badge-light-" + tone, label);
  }

  function orderLink(order, label) {
    var link = element("a", "bb-merchant-order-link", label);
    link.href = "orders.html?q=" + encodeURIComponent(order.id);
    return link;
  }

  function setValue(key, value) {
    dashboard.querySelector("[data-bb-merchant-" + key + "]").textContent = value;
  }

  function openTask(task) {
    drawer.querySelector("#merchant-drawer-title").textContent = task.name;
    drawer.querySelector("[data-bb-merchant-drawer-summary]").textContent = task.records.length + " kayıt · Örnek veriler";
    drawerList.replaceChildren();

    if (!task.records.length) {
      drawerList.appendChild(element("li", "bb-merchant-meta", "Bekleyen kayıt yok."));
    }

    task.records.forEach(function (record) {
      var item = element("li", "bb-card bb-merchant-task-record");
      var heading = element("div", "bb-merchant-record-heading");
      var text = element("div", "");
      var title = record.id ? "Sipariş #" + record.id : record.product;
      var description = channels.get(record.channel).name + " · " + record.customer + " · " + record.time;
      text.append(element("strong", "", title), element("p", "bb-merchant-meta", description));
      heading.appendChild(text);
      if (record.id) heading.appendChild(badge(formatMoney.format(record.total), task.tone));
      item.appendChild(heading);

      var detail = record.detail || demo.returnReasons[record.id];
      if (detail) item.appendChild(element("p", "bb-merchant-record-detail", detail));
      if (record.id) item.appendChild(orderLink(record, "Siparişi listede aç"));
      drawerList.appendChild(item);
    });
  }

  var taskList = dashboard.querySelector("[data-bb-merchant-tasks]");
  tasks.forEach(function (task) {
    var button = element("button", "bb-merchant-task");
    button.type = "button";
    button.dataset.tone = task.tone;
    button.setAttribute("aria-controls", drawer.id);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-haspopup", "dialog");
    button.dataset.bbDrawerToggle = "#" + drawer.id;

    var lead = element("span", "bb-merchant-task-lead");
    var graphic = element("span", "bb-merchant-task-icon");
    graphic.appendChild(icon(task.icon));
    lead.append(graphic, element("strong", "", String(task.records.length)));
    button.append(lead, element("span", "bb-merchant-task-label", task.name));
    var action = element("span", "bb-merchant-task-action", "İncele");
    action.appendChild(icon("arrow_forward"));
    button.appendChild(action);
    button.addEventListener("click", function () { openTask(task); });
    taskList.appendChild(button);
  });

  var orderBody = dashboard.querySelector("[data-bb-merchant-orders]");
  demo.orders.slice(0, 6).forEach(function (order) {
    var row = element("tr");
    var orderCell = element("td");
    orderCell.append(orderLink(order, "#" + order.id), element("small", "bb-merchant-meta", order.customer + " · " + order.time));
    var channelCell = element("td", "", channels.get(order.channel).name);
    var statusCell = element("td");
    var state = demo.states[order.state];
    statusCell.appendChild(badge(state.label, state.tone));
    row.append(orderCell, channelCell, statusCell, element("td", "text-end bb-merchant-amount", formatMoney.format(order.total)));
    orderBody.appendChild(row);
  });

  var channelList = dashboard.querySelector("[data-bb-merchant-channels]");
  demo.channels.forEach(function (channel) {
    var active = channel.health === "active";
    var count = demo.orders.filter(function (order) { return order.channel === channel.id; }).length;
    var item = element("li", "bb-merchant-channel");
    var link = element("a", "bb-merchant-channel-link");
    link.href = channel.href;
    var graphic = element("span", "bb-merchant-channel-icon");
    graphic.appendChild(icon(channel.icon));
    var copy = element("span", "bb-merchant-channel-copy");
    copy.append(element("strong", "", channel.name), element("small", "bb-merchant-meta", channel.type));
    var status = element("span", "bb-merchant-channel-status");
    status.append(badge(active ? "Aktif" : "Bağlantıyı incele", active ? "success" : "warning"), element("small", "bb-merchant-meta", count + " sipariş"));
    link.append(graphic, copy, status, icon("chevron_right"));
    item.appendChild(link);
    channelList.appendChild(item);
  });

  var stockList = dashboard.querySelector("[data-bb-merchant-stock]");
  demo.stock.forEach(function (product) {
    var item = element("li");
    var copy = element("div");
    copy.append(element("strong", "", product.name), element("small", "bb-merchant-meta", product.sku));
    item.append(copy, badge(product.quantity + " adet", "warning"));
    stockList.appendChild(item);
  });

  setValue("order-count", demo.orders.length);
  setValue("sales", formatMoney.format(demo.orders.reduce(function (total, order) {
    return order.state === "return" ? total : total + order.total;
  }, 0)));
  setValue("paid", formatMoney.format(demo.payout.paid));
  setValue("pending", formatMoney.format(demo.payout.pending));
  setValue("reversed", formatMoney.format(-demo.payout.reversed));
})();
