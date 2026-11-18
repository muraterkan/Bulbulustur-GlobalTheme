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

  var setupDrawer = document.getElementById("bb_integration_setup_drawer");
  var setupName = setupDrawer && setupDrawer.querySelector("[data-bb-integration-setup-name]");
  var setupType = setupDrawer && setupDrawer.querySelector("[data-bb-integration-setup-type]");
  var setupLogo = setupDrawer && setupDrawer.querySelector("[data-bb-integration-setup-logo]");
  var setupStatus = setupDrawer && setupDrawer.querySelector("[data-bb-integration-setup-status]");
  var setupForm = setupDrawer && setupDrawer.querySelector("[data-bb-integration-setup-form]");

  root.querySelectorAll("[data-bb-integration-start]").forEach(function (button) {
    button.addEventListener("click", function () {
      var card = button.closest("[data-bb-integration-card]");
      if (!card || !setupDrawer) return;
      var name = card.dataset.integrationName;
      var type = card.querySelector(".bb-integration-card-title small")?.textContent || "Integration";
      var sourceImg = card.querySelector(".bb-integration-logo img");
      var targetImg = setupLogo?.querySelector("img");
      var fallback = setupLogo?.querySelector(".bb-integration-logo-fallback");

      if (setupName) setupName.textContent = name;
      if (setupType) setupType.textContent = type + " · Bağlantı ayarları";
      if (targetImg && sourceImg) {
        targetImg.src = sourceImg.src;
        targetImg.alt = name;
      }
      if (fallback) fallback.textContent = name.charAt(0);
      if (setupLogo) setupLogo.removeAttribute("data-bb-logo-failed");
      if (setupStatus) setupStatus.textContent = "";
      if (setupForm) setupForm.reset();
      window.BBDrawer.open("#bb_integration_setup_drawer");
    });
  });

  if (setupLogo) {
    var setupImg = setupLogo.querySelector("img");
    if (setupImg) setupImg.addEventListener("error", function () {
      setupLogo.setAttribute("data-bb-logo-failed", "true");
    });
  }

  if (setupForm) {
    setupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!setupForm.reportValidity()) return;
      if (setupStatus) setupStatus.textContent = (setupName?.textContent || "Integration") + " için demo bağlantı isteği hazırlandı.";
    });
  }

  applyFilter();
}());
