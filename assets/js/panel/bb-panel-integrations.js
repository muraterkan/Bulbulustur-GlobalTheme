(function () {
  "use strict";

  var root = document.querySelector("[data-bb-integrations]");
  if (!root) return;

  var search = root.querySelector("[data-bb-integrations-search]");
  var cards = Array.from(root.querySelectorAll("[data-bb-integration-card]"));
  var filters = Array.from(root.querySelectorAll("[data-bb-integrations-filter]"));
  var sections = Array.from(root.querySelectorAll("[data-bb-integrations-section]"));
  var count = root.querySelector("[data-bb-integrations-count]");
  var empty = root.querySelector("[data-bb-integrations-empty]");

  root.querySelectorAll(".bb-integration-logo img").forEach(function (img) {
    img.addEventListener("error", function () {
      var host = img.closest(".bb-integration-logo");
      if (host) host.setAttribute("data-bb-logo-failed", "true");
    });
  });

  function normalize(value) {
    return String(value || "").toLocaleLowerCase("tr-TR");
  }

  function applyFilter() {
    var active = root.querySelector("[data-bb-integrations-filter][aria-pressed='true']");
    var category = active ? active.dataset.bbIntegrationsFilter : "all";
    var query = normalize(search.value.trim());
    var visible = 0;

    cards.forEach(function (card) {
      var cardCategory = card.dataset.integrationCategory;
      var text = normalize(card.dataset.integrationSearch);
      var show = (category === "all" || cardCategory === category) && text.includes(query);
      card.hidden = !show;
      if (show) visible += 1;
    });

    sections.forEach(function (section) {
      var sectionCards = Array.from(section.querySelectorAll("[data-bb-integration-card]"));
      section.hidden = !sectionCards.some(function (card) { return !card.hidden; });
    });

    count.textContent = visible + " entegrasyon";
    empty.hidden = visible !== 0;
  }

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      filters.forEach(function (item) {
        item.setAttribute("aria-pressed", String(item === button));
      });
      applyFilter();
    });
  });

  search.addEventListener("input", applyFilter);

  root.querySelectorAll("[data-bb-integration-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      var card = button.closest("[data-bb-integration-card]");
      if (!card) return;
      var name = card.dataset.integrationName;
      var previous = button.innerHTML;
      button.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">check</span>';
      button.setAttribute("aria-label", name + " seçildi");
      window.setTimeout(function () {
        button.innerHTML = previous;
        button.setAttribute("aria-label", name + " seçenekleri");
      }, 900);
    });
  });

  applyFilter();
}());
