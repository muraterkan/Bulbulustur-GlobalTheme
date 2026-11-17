/* Support Center demo. No API calls, stored tickets or external embeds. */
(function () {
  "use strict";
  var root = document.querySelector("[data-bb-support]");
  if (!root) return;
  var search = root.querySelector("[data-bb-support-search]");
  var status = root.querySelector("[data-bb-support-status]");
  var views = Array.from(root.querySelectorAll("[data-bb-support-view]"));
  var tabs = Array.from(root.querySelectorAll("[data-bb-support-tab]"));
  var questions = Array.from(root.querySelectorAll("[data-bb-support-item]"));
  var empty = root.querySelector("[data-bb-support-empty]");
  var ticket = root.querySelector("[data-bb-support-ticket]");
  var selected = new URLSearchParams(location.search).get("tab") || "overview";
  if (!tabs.some(function (t) { return t.dataset.bbSupportTab === selected; })) selected = "overview";
  var heading = document.querySelector(".bb-page-title");
  if (heading) heading.textContent = "Destek Merkezi / Genel Bakış";
  var breadcrumb = document.querySelector(".bb-breadcrumb .breadcrumb");
  if (breadcrumb) {
    breadcrumb.replaceChildren();
    ["APPLICATIONS", "Destek Merkezi", "Genel Bakış"].forEach(function (label, i) {
      var li = document.createElement("li");
      li.className = "breadcrumb-item" + (i === 2 ? " active" : "");
      li.textContent = label;
      if (i === 2) li.setAttribute("aria-current", "page");
      breadcrumb.appendChild(li);
    });
  }

  function selectTab(name, focus) {
    selected = name;
    tabs.forEach(function (tab) {
      var active = tab.dataset.bbSupportTab === name;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    views.forEach(function (view) { view.hidden = name !== "overview" && view.dataset.bbSupportView !== name; });
    applySearch();
  }
  function applySearch() {
    var q = search.value.trim().toLocaleLowerCase("tr-TR"), found = 0;
    questions.forEach(function (item) {
      var hit = !q || item.textContent.toLocaleLowerCase("tr-TR").includes(q);
      item.hidden = !hit;
      if (hit) found++;
    });
    if (empty) empty.hidden = !q || found > 0;
    if (status) status.textContent = q ? found + " eşleşen örnek içerik" : "Örnek Destek Merkezi · Gerçek talep verisi bulunmuyor";
  }
  root.addEventListener("click", function (event) {
    var tab = event.target.closest("[data-bb-support-tab]");
    if (tab) { selectTab(tab.dataset.bbSupportTab, false); return; }
    var toggle = event.target.closest("[data-bb-support-question]");
    if (!toggle) return;
    var answer = document.getElementById(toggle.getAttribute("aria-controls"));
    if (!answer) return;
    var next = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(next));
    answer.hidden = !next;
  });
  tabs.forEach(function (tab, i) {
    tab.addEventListener("keydown", function (event) {
      var next = event.key === "ArrowRight" ? (i + 1) % tabs.length : event.key === "ArrowLeft" ? (i + tabs.length - 1) % tabs.length : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : -1;
      if (next < 0) return;
      event.preventDefault();
      selectTab(tabs[next].dataset.bbSupportTab, true);
    });
  });
  search.addEventListener("input", applySearch);
  if (ticket) ticket.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!ticket.reportValidity()) return;
    var result = root.querySelector("[data-bb-support-ticket-result]");
    if (result) {
      result.hidden = false;
      result.textContent = "Talep formu doğrulandı. Demo sürümünde talep oluşturulmadı veya gönderilmedi.";
      result.focus();
    }
  });
  selectTab(selected, false);
})();
