/* Order details UI demo. All order/customer/payment data is illustrative. */
(function () {
  "use strict";
  var root = document.querySelector("[data-bb-order-details]");
  if (!root) return;

  var tabs = Array.from(root.querySelectorAll("[data-bb-order-tab]"));
  var panes = Array.from(root.querySelectorAll("[data-bb-order-panel]"));
  function showTab(name, focus) {
    tabs.forEach(function (tab) {
      var active = tab.dataset.bbOrderTab === name;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panes.forEach(function (pane) { pane.hidden = pane.dataset.bbOrderPanel !== name; });
  }
  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { showTab(tab.dataset.bbOrderTab, false); });
    tab.addEventListener("keydown", function (event) {
      var next = event.key === "ArrowRight" ? (index + 1) % tabs.length :
        event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length :
        event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : -1;
      if (next === -1) return;
      event.preventDefault();
      showTab(tabs[next].dataset.bbOrderTab, true);
    });
  });

  var result = root.querySelector("[data-bb-order-result]");
  var edit = root.querySelector("[data-bb-order-edit]");
  if (edit) edit.addEventListener("click", function () {
    result.hidden = false;
    result.textContent = "Sipariş düzenleme işlemi bu statik demoda bulunmuyor. Hiçbir sipariş değiştirilmedi.";
    result.focus();
  });
  var next = root.querySelector("[data-bb-order-new]");
  if (next) next.addEventListener("click", function () {
    result.hidden = false;
    result.textContent = "Yeni sipariş formu bu demoda henüz bağlı değil. Herhangi bir kayıt oluşturulmadı.";
    result.focus();
  });

  var title = document.querySelector(".bb-page-title");
  if (title) title.textContent = "Sipariş Detayları";
  var breadcrumb = document.querySelector(".bb-breadcrumb .breadcrumb");
  if (breadcrumb) {
    breadcrumb.replaceChildren();
    ["APPLICATIONS", "e-Ticaret", "Siparişler", "Detaylar"].forEach(function (value, i, items) {
      var item = document.createElement("li");
      item.className = "breadcrumb-item" + (i === items.length - 1 ? " active" : "");
      item.textContent = value;
      if (i === items.length - 1) item.setAttribute("aria-current", "page");
      breadcrumb.appendChild(item);
    });
  }
  showTab(new URLSearchParams(location.search).get("tab") === "history" ? "history" : "summary", false);
})();
