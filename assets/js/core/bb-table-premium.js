(function () {
  "use strict";

  var phases = ["approved", "preparing", "shipped", "delivered", "cancelled"];
  var formatNumber = new Intl.NumberFormat(document.documentElement.lang || "tr");
  var compareText = new Intl.Collator(document.documentElement.lang || "tr");

  function summarize(rows) {
    var totals = [0, 0, 0, 0, 0];
    rows.forEach(function (row) {
      phases.forEach(function (phase, index) { totals[index] += row[phase] || 0; });
    });
    return totals;
  }

  function sum(values) {
    return values.reduce(function (total, value) { return total + value; }, 0);
  }

  function element(tag, text, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text;
    return node;
  }

  function appendValues(row, values, heat) {
    var total = sum(values);
    row.appendChild(element("td", formatNumber.format(total), "bb-pt-total"));
    values.forEach(function (value, index) {
      var cell = element("td", formatNumber.format(value));
      if (heat && value > 0 && total > 0) {
        var level = Math.ceil(value / total * 4);
        cell.className = "bb-pt-heat-cell";
        cell.dataset.level = level;
        cell.classList.toggle("is-cancelled", phases[index] === "cancelled");
      }
      row.appendChild(cell);
    });
  }

  function init(root) {
    var tabs = Array.from(root.querySelectorAll("[data-view]"));
    var body = root.querySelector("tbody");
    var foot = root.querySelector("tfoot");
    var scope = root.querySelector("[data-bb-pt-scope]");
    var search = root.querySelector("[data-bb-pt-search]");
    var notes = root.querySelector("[data-bb-pt-notes]");
    var toggleAll = root.querySelector("[data-bb-pt-toggle-all]");
    var panel = root.querySelector('[role="tabpanel"]');
    var total = root.querySelector("[data-bb-pt-total]");
    var alerts = root.querySelector("[data-bb-pt-alerts]");
    var source = root.querySelector("template[data-bb-pt-data]");
    if (!tabs.length || !body || !foot || !scope || !search || !notes || !toggleAll || !panel || !total || !alerts || !source) return;

    var data;
    try {
      data = JSON.parse(source.content.textContent);
    } catch (_) {
      data = [];
    }
    if (!Array.isArray(data)) data = [];

    var tab = tabs.find(function (item) { return item.getAttribute("aria-selected") === "true"; }) || tabs[0];
    var collapsed = new Set();

    function groupsForView() {
      var groups = new Map();
      var query = search.value.trim().toLocaleLowerCase(document.documentElement.lang || "tr");

      data.forEach(function (row) {
        var group = row[tab.dataset.view];
        if (typeof group !== "string" || typeof row.label !== "string") return;
        if (scope.value === "active" && !(row.approved || row.preparing || row.shipped)) return;
        if (scope.value === "cancelled" && !row.cancelled) return;
        if (query && !(group + " " + row.label).toLocaleLowerCase(document.documentElement.lang || "tr").includes(query)) return;

        if (!groups.has(group)) groups.set(group, []);
        groups.get(group).push(row);
      });
      return Array.from(groups.entries()).sort(function (a, b) { return compareText.compare(a[0], b[0]); });
    }

    function render() {
      var groups = groupsForView();
      var visibleRows = groups.flatMap(function (entry) { return entry[1]; });
      var totals = summarize(visibleRows);

      body.replaceChildren();
      foot.replaceChildren();
      total.textContent = formatNumber.format(sum(totals));
      alerts.textContent = formatNumber.format(visibleRows.reduce(function (count, row) {
        return count + (row.alerts || 0);
      }, 0));

      groups.forEach(function (entry) {
        var name = entry[0];
        var items = entry[1];
        var expanded = !collapsed.has(name);
        var groupRow = element("tr", "", "bb-pt-group");
        var heading = element("th", "");
        heading.scope = "row";
        var toggle = element("button", "", "bb-pt-group-toggle");
        toggle.type = "button";
        toggle.setAttribute("aria-expanded", String(expanded));
        var icon = element("span", "chevron_right", "material-symbols-outlined");
        icon.setAttribute("aria-hidden", "true");
        toggle.append(icon, document.createTextNode(name));
        heading.appendChild(toggle);
        groupRow.appendChild(heading);
        appendValues(groupRow, summarize(items), true);
        body.appendChild(groupRow);

        var childRows = items.map(function (item) {
          var row = element("tr", "", "bb-pt-child");
          row.hidden = !expanded;
          var label = element("th", item.label);
          label.scope = "row";
          if (notes.checked && item.note) label.appendChild(element("small", item.note, "bb-pt-note"));
          row.appendChild(label);
          appendValues(row, summarize([item]), true);
          body.appendChild(row);
          return row;
        });

        toggle.addEventListener("click", function () {
          var open = collapsed.delete(name);
          if (!open) collapsed.add(name);
          toggle.setAttribute("aria-expanded", String(open));
          childRows.forEach(function (row) { row.hidden = !open; });
          updateToggleAll(groups);
        });
      });

      if (!groups.length) {
        var row = element("tr", "");
        var empty = element("td", "Bu filtrelerle eşleşen işlem yok.", "bb-pt-empty");
        empty.colSpan = phases.length + 2;
        row.appendChild(empty);
        body.appendChild(row);
      }

      var summary = element("tr", "");
      var caption = element("th", "Genel toplam");
      caption.scope = "row";
      summary.appendChild(caption);
      appendValues(summary, totals, false);
      foot.appendChild(summary);
      updateToggleAll(groups);
    }

    function updateToggleAll(groups) {
      var allExpanded = groups.every(function (entry) { return !collapsed.has(entry[0]); });
      toggleAll.textContent = allExpanded ? "Tümünü kapat" : "Tümünü aç";
      toggleAll.disabled = !groups.length;
      return allExpanded;
    }

    function select(next, focus) {
      if (tab !== next) collapsed.clear();
      tab = next;
      tabs.forEach(function (item) {
        var selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      panel.setAttribute("aria-labelledby", tab.id);
      render();
      if (focus) tab.focus();
    }

    tabs.forEach(function (item, index) {
      item.addEventListener("click", function () { select(item, false); });
      item.addEventListener("keydown", function (event) {
        var destinations = {
          ArrowRight: (index + 1) % tabs.length,
          ArrowLeft: (index + tabs.length - 1) % tabs.length,
          Home: 0,
          End: tabs.length - 1
        };
        if (!Object.hasOwn(destinations, event.key)) return;
        event.preventDefault();
        select(tabs[destinations[event.key]], true);
      });
    });

    scope.addEventListener("change", render);
    search.addEventListener("input", render);
    notes.addEventListener("change", render);
    toggleAll.addEventListener("click", function () {
      var groups = groupsForView();
      var close = updateToggleAll(groups);
      groups.forEach(function (entry) {
        if (close) collapsed.add(entry[0]);
        else collapsed.delete(entry[0]);
      });
      render();
    });
    select(tab, false);
  }

  document.querySelectorAll("[data-bb-table-premium]").forEach(init);
})();
