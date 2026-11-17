/* Faz 9 — demo table interactions. No API calls or persistence. */
(function () {
  "use strict";
  var root = document.querySelector("[data-bb-panel-list]");
  if (!root) return;
  var records = [
    ["PRD-1001", "Keten Elbise", "Giyim", 1290, "Aktif", "2026-11-14"],
    ["PRD-1002", "Seramik Kupa", "Ev & Yaşam", 420, "Aktif", "2026-11-12"],
    ["PRD-1003", "Deri Defter", "Kırtasiye", 650, "Taslak", "2026-11-10"],
    ["PRD-1004", "Pamuk Gömlek", "Giyim", 890, "Aktif", "2026-11-09"],
    ["PRD-1005", "Ahşap Tepsi", "Ev & Yaşam", 740, "Pasif", "2026-11-08"],
    ["PRD-1006", "Yün Şal", "Aksesuar", 980, "Aktif", "2026-11-07"],
    ["PRD-1007", "Minimal Kolye", "Aksesuar", 1150, "Taslak", "2026-11-06"],
    ["PRD-1008", "Kanaviçe Çanta", "Aksesuar", 560, "Aktif", "2026-11-05"],
    ["PRD-1009", "Cam Vazo", "Ev & Yaşam", 860, "Pasif", "2026-11-04"],
    ["PRD-1010", "Organik Sabun", "Kozmetik", 210, "Aktif", "2026-11-03"],
    ["PRD-1011", "Makrome Askı", "Ev & Yaşam", 340, "Taslak", "2026-11-02"],
    ["PRD-1012", "Döküm Mum", "Ev & Yaşam", 320, "Aktif", "2026-11-01"],
    ["PRD-1013", "İpek Fular", "Aksesuar", 1750, "Pasif", "2026-10-30"],
    ["PRD-1014", "El Yapımı Tabak", "Ev & Yaşam", 580, "Aktif", "2026-10-28"],
    ["PRD-1015", "Örme Bere", "Aksesuar", 390, "Taslak", "2026-10-26"],
    ["PRD-1016", "Bambu Sepet", "Ev & Yaşam", 990, "Aktif", "2026-10-25"],
    ["PRD-1017", "Doğal Krem", "Kozmetik", 490, "Pasif", "2026-10-22"],
    ["PRD-1018", "Keten Örtü", "Ev & Yaşam", 1190, "Aktif", "2026-10-20"]
  ].map(function (r) {
    return { id: r[0], name: r[1], category: r[2], price: r[3], status: r[4], date: r[5] };
  });
  var selected = new Set();
  var sort = { field: "date", direction: "desc" };
  var page = 1;
  var search = root.querySelector("[data-bb-list-search]");
  var status = root.querySelector("[data-bb-list-status]");
  var perPage = root.querySelector("[data-bb-list-size]");
  var body = root.querySelector("[data-bb-list-body]");
  var all = root.querySelector("[data-bb-list-all]");
  var count = root.querySelector("[data-bb-list-count]");
  var selectedCount = root.querySelector("[data-bb-list-selected-count]");
  var bulk = root.querySelector("[data-bb-list-bulk]");
  var pages = root.querySelector("[data-bb-list-pages]");
  var range = root.querySelector("[data-bb-list-range]");
  var detail = root.querySelector("[data-bb-list-detail]");
  var detailName = root.querySelector("[data-bb-list-detail-name]");
  var detailBody = root.querySelector("[data-bb-list-detail-body]");
  var announcement = root.querySelector("[data-bb-list-announcement]");
  var money = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });
  var collator = new Intl.Collator("tr", { numeric: true, sensitivity: "base" });

  function element(tag, className, content) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = String(content);
    return node;
  }
  function button(label, icon, action, id) {
    var b = element("button", "bb-panel-list-action");
    b.type = "button";
    b.title = label;
    b.setAttribute("aria-label", label);
    b.dataset.bbListAction = action;
    if (id) b.dataset.id = id;
    var i = element("span", "material-symbols-outlined", icon);
    i.setAttribute("aria-hidden", "true");
    b.appendChild(i);
    return b;
  }
  function filtered() {
    var query = search.value.trim().toLocaleLowerCase("tr");
    var state = status.value;
    return records.filter(function (r) {
      return (!query || [r.name, r.id, r.category].join(" ").toLocaleLowerCase("tr").includes(query))
        && (!state || r.status === state);
    }).sort(function (a, b) {
      var one = a[sort.field], two = b[sort.field];
      var cmp = typeof one === "number" ? one - two : collator.compare(one, two);
      if (cmp === 0) cmp = collator.compare(a.id, b.id);
      return sort.direction === "asc" ? cmp : -cmp;
    });
  }
  function filteredPage() {
    var rows = filtered();
    var size = Number(perPage.value);
    var totalPages = Math.max(1, Math.ceil(rows.length / size));
    page = Math.min(Math.max(1, page), totalPages);
    return { rows: rows, pageRows: rows.slice((page - 1) * size, page * size), size: size, totalPages: totalPages };
  }
  function render() {
    var result = filteredPage();
    body.replaceChildren();
    result.pageRows.forEach(function (r) {
      var tr = element("tr", selected.has(r.id) ? "bb-panel-list-selected" : "");
      var checkCell = element("td");
      var checkbox = element("input", "form-check-input");
      checkbox.type = "checkbox";
      checkbox.checked = selected.has(r.id);
      checkbox.setAttribute("aria-label", r.name + " seç");
      checkbox.dataset.bbListSelect = r.id;
      checkCell.appendChild(checkbox);
      tr.appendChild(checkCell);

      var title = element("td");
      var titleWrap = element("span", "bb-panel-list-cell");
      var ico = element("span", "material-symbols-outlined", "inventory_2");
      ico.setAttribute("aria-hidden", "true");
      var info = element("span");
      info.appendChild(element("strong", "", r.name));
      info.appendChild(element("small", "", r.id));
      titleWrap.append(ico, info);
      title.appendChild(titleWrap);
      tr.appendChild(title);
      tr.appendChild(element("td", "", r.category));
      tr.appendChild(element("td", "", money.format(r.price)));
      var state = element("td");
      var badgeName = r.status === "Aktif" ? "bb-badge-light-success" : r.status === "Pasif" ? "bb-badge-light-danger" : "bb-badge-light-warning";
      state.appendChild(element("span", "badge bb-badge " + badgeName, r.status));
      tr.appendChild(state);
      tr.appendChild(element("td", "", new Date(r.date + "T12:00:00").toLocaleDateString("tr-TR")));
      var actions = element("td");
      var wrap = element("div", "bb-panel-list-operations");
      wrap.appendChild(button("Detay: " + r.name, "visibility", "detail", r.id));
      wrap.appendChild(button("Durum değiştir: " + r.name, "sync", "toggle", r.id));
      actions.appendChild(wrap);
      tr.appendChild(actions);
      body.appendChild(tr);
    });
    if (!result.rows.length) {
      var empty = element("tr"), cell = element("td", "text-center", "Arama ve filtrelerle eşleşen kayıt bulunamadı.");
      cell.colSpan = 7;
      empty.appendChild(cell);
      body.appendChild(empty);
    }
    var visibleSelected = result.pageRows.filter(function (r) { return selected.has(r.id); }).length;
    all.checked = result.pageRows.length > 0 && visibleSelected === result.pageRows.length;
    all.indeterminate = visibleSelected > 0 && visibleSelected < result.pageRows.length;
    all.disabled = result.pageRows.length === 0;
    selectedCount.textContent = selected.size + " kayıt seçildi";
    bulk.disabled = selected.size === 0;
    count.textContent = result.rows.length + " kayıt bulundu";
    var first = result.rows.length ? (page - 1) * result.size + 1 : 0;
    var last = Math.min(page * result.size, result.rows.length);
    range.textContent = first + "–" + last + " / " + result.rows.length;
    pages.replaceChildren();
    function pageButton(label, target, disabled, current) {
      var b = element("button", "page-link", label);
      b.type = "button";
      b.disabled = disabled;
      b.dataset.bbListPage = String(target);
      if (current) b.setAttribute("aria-current", "page");
      var li = element("li", "page-item" + (current ? " active" : "") + (disabled ? " disabled" : ""));
      li.appendChild(b);
      pages.appendChild(li);
    }
    pageButton("Önceki", page - 1, page === 1, false);
    for (var n = 1; n <= result.totalPages; n++) pageButton(String(n), n, false, n === page);
    pageButton("Sonraki", page + 1, page === result.totalPages, false);
    root.querySelectorAll("[data-bb-list-sort]").forEach(function (button) {
      var active = button.dataset.bbListSort === sort.field;
      button.setAttribute("aria-pressed", String(active));
      button.querySelector(".material-symbols-outlined").textContent = !active ? "unfold_more" : sort.direction === "asc" ? "arrow_upward" : "arrow_downward";
      var th = button.closest("th");
      if (th) th.setAttribute("aria-sort", active ? (sort.direction === "asc" ? "ascending" : "descending") : "none");
    });
  }
  root.addEventListener("click", function (e) {
    var heading = e.target.closest("[data-bb-list-sort]");
    if (heading) {
      var field = heading.dataset.bbListSort;
      sort.direction = sort.field === field && sort.direction === "asc" ? "desc" : "asc";
      sort.field = field;
      page = 1;
      render();
      return;
    }
    var pageButton = e.target.closest("[data-bb-list-page]");
    if (pageButton && !pageButton.disabled) { page = Number(pageButton.dataset.bbListPage); render(); return; }
    var action = e.target.closest("[data-bb-list-action]");
    if (!action) return;
    var row = records.find(function (r) { return r.id === action.dataset.id; });
    if (!row) return;
    if (action.dataset.bbListAction === "toggle") {
      row.status = row.status === "Aktif" ? "Pasif" : "Aktif";
      announcement.textContent = row.name + " durumu: " + row.status + " (yalnız demo).";
      render();
    } else if (action.dataset.bbListAction === "detail") {
      detail.hidden = false;
      detailName.textContent = row.name;
      detailBody.textContent = row.id + " · " + row.category + " · " + money.format(row.price) + " · " + row.status;
      detail.querySelector("[data-bb-list-close]").focus();
    }
  });
  body.addEventListener("change", function (e) {
    var box = e.target.closest("[data-bb-list-select]");
    if (!box) return;
    if (box.checked) selected.add(box.dataset.bbListSelect);
    else selected.delete(box.dataset.bbListSelect);
    render();
  });
  all.addEventListener("change", function () {
    filteredPage().pageRows.forEach(function (r) {
      if (all.checked) selected.add(r.id);
      else selected.delete(r.id);
    });
    render();
  });
  [search, status, perPage].forEach(function (input) {
    input.addEventListener(input === search ? "input" : "change", function () {
      page = 1;
      render();
    });
  });
  bulk.addEventListener("click", function () {
    records.forEach(function (r) { if (selected.has(r.id)) r.status = "Aktif"; });
    announcement.textContent = selected.size + " kayıt aktifleştirildi (yalnız demo).";
    selected.clear();
    render();
  });
  root.querySelector("[data-bb-list-reset]").addEventListener("click", function () {
    search.value = "";
    status.value = "";
    perPage.value = "5";
    sort = { field: "date", direction: "desc" };
    selected.clear();
    page = 1;
    detail.hidden = true;
    announcement.textContent = "Filters sıfırlandı.";
    render();
  });
  detail.querySelector("[data-bb-list-close]").addEventListener("click", function () { detail.hidden = true; });
  render();
})();
