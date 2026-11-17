/* Table widgets demo interactions — no server mutations. */
(function () {
  "use strict";
  var root = document.querySelector("[data-bb-table-widgets]");
  if (!root) return;

  var feedback = root.querySelector("[data-bb-table-feedback]");
  var say = function (message) {
    if (feedback) feedback.textContent = message;
  };

  root.querySelectorAll("[data-bb-selectable-table]").forEach(function (table) {
    var checkAll = table.querySelector("[data-bb-table-check-all]");
    var checks = Array.from(table.querySelectorAll("[data-bb-table-check]"));
    if (!checkAll) return;

    var sync = function () {
      var selected = checks.filter(function (check) { return check.checked; }).length;
      checkAll.checked = checks.length > 0 && selected === checks.length;
      checkAll.indeterminate = selected > 0 && selected < checks.length;
    };

    checkAll.addEventListener("change", function () {
      checks.forEach(function (check) { check.checked = checkAll.checked; });
      sync();
      say(checkAll.checked ? "Görünen satırlar seçildi." : "Satır seçimi temizlendi.");
    });

    checks.forEach(function (check) {
      check.addEventListener("change", sync);
    });
  });

  root.querySelectorAll("[data-bb-table-period]").forEach(function (button) {
    button.addEventListener("click", function () {
      var group = button.closest(".bb-table-periods");
      if (group) {
        group.querySelectorAll("[data-bb-table-period]").forEach(function (item) {
          item.setAttribute("aria-pressed", String(item === button));
        });
      }
      say(button.textContent.trim() + " dönemi seçildi. Veriler örnektir.");
    });
  });

  root.querySelectorAll("[data-bb-table-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      var action = button.getAttribute("data-bb-table-action");
      var id = button.getAttribute("data-id");
      var labels = {
        view: "Görüntüleme",
        edit: "Düzenleme",
        delete: "Silme",
        grid: "View Mode",
        new: "New Record",
        filter: "Filtre",
        create: "Oluşturma"
      };
      say((labels[action] || "Action") + (id ? " · " + id : "") + " yalnız demo olarak tetiklendi.");
    });
  });
}());
