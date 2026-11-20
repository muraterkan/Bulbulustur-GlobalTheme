/* Render the panel's demo catalog with the shared plan comparison markup. */
(function () {
  "use strict";

  var root = document.querySelector("[data-bb-pricing]");
  if (!root) return;

  var catalog = window.BBPanelServicePlans;
  var requested = new URLSearchParams(window.location.search).get("product");
  var service = requested === "posb" || requested === "posx" ? "posb" : "draugr";
  var product = catalog[service];
  var table = root.querySelector("[data-bb-pricing-table]");
  var head = root.querySelector("[data-bb-pricing-head]");
  var format = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

  function element(tag, className, value) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  }

  function featured(cell, plan) {
    if (plan.id === product.recommended) cell.setAttribute("data-featured", "");
  }

  function planCell(plan) {
    var cell = element("th", "bb-plan-comparison__plan");
    cell.scope = "col";
    featured(cell, plan);

    var action = element("a", "btn btn-sm bb-plan-comparison__action " + (cell.hasAttribute("data-featured") ? "btn-primary" : "bb-btn-secondary"), "Sepete ekle");
    var link = new URL("cart.html", window.location.href);
    link.searchParams.set("product", service);
    link.searchParams.set("plan", plan.id);
    action.href = link.href;
    action.setAttribute("aria-label", plan.name + " paketini sepete ekle");
    var actionRow = element("div");
    actionRow.appendChild(action);
    cell.append(
      element("h2", "bb-plan-comparison__heading", plan.name),
      element("p", "bb-plan-comparison__description", plan.desc),
      element("strong", "bb-plan-comparison__price", format.format(plan.year)),
      element("span", "bb-plan-comparison__period", "Yıllık · Demo"),
      actionRow
    );
    if (cell.hasAttribute("data-featured")) {
      cell.appendChild(element("div", "bb-plan-comparison__tag", "Önerilen"));
    }
    return cell;
  }

  function featureCell(value, plan) {
    var cell = element("td");
    featured(cell, plan);
    if (typeof value === "boolean") {
      var mark = element("span", value ? "material-symbols-outlined bb-plan-comparison__included" : "bb-plan-comparison__excluded", value ? "check" : "—");
      mark.setAttribute("aria-hidden", "true");
      cell.append(mark, element("span", "visually-hidden", value ? "Dahil" : "Dahil değil"));
    } else {
      cell.textContent = value;
    }
    return cell;
  }

  var label = element("th", "bb-plan-comparison__feature");
  label.scope = "col";
  label.append(
    element("h2", "bb-plan-comparison__heading", product.label),
    element("p", "bb-plan-comparison__intro", product.intro)
  );
  head.append(label, ...product.plans.map(planCell));

  product.comparison.forEach(function (group) {
    var body = element("tbody");
    var heading = element("tr");
    var groupLabel = element("th", "bb-plan-comparison__group", group.title);
    groupLabel.scope = "rowgroup";
    groupLabel.colSpan = product.plans.length + 1;
    heading.appendChild(groupLabel);
    body.appendChild(heading);

    group.rows.forEach(function (feature) {
      var row = element("tr");
      var label = element("th", "bb-plan-comparison__feature", feature[0]);
      label.scope = "row";
      row.append(label, ...product.plans.map(function (plan, index) {
        return featureCell(feature[index + 1], plan);
      }));
      body.appendChild(row);
    });
    table.appendChild(body);
  });

  root.querySelector('[data-bb-pricing-service="' + service + '"]').setAttribute("aria-current", "page");
  var title = document.querySelector(".bb-page-title");
  if (title) title.textContent = product.title;

  var crumb = document.querySelector(".bb-breadcrumb .breadcrumb");
  if (crumb) {
    var current = element("li", "breadcrumb-item active", product.label);
    current.setAttribute("aria-current", "page");
    crumb.replaceChildren(element("li", "breadcrumb-item", "Hizmet paketleri"), current);
  }
})();
