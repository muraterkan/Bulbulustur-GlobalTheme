(function () {
  "use strict";

  const rows = document.querySelector("[data-brand-rows]");
  if (!rows) return;

  const brands = [
    { id: 1, name: "Ortobella", category: "Ayakkabı", owned: true },
    { id: 2, name: "Mavi Rota", category: "Spor ve outdoor" },
    { id: 3, name: "Atlas Ev", category: "Ev ve yaşam" },
    { id: 4, name: "Luna Tasarım", category: "Aksesuar" },
    { id: 5, name: "Kuzey Atölye", category: "Giyim" }
  ];
  const ownership = [{ id: 1042, brand: brands[2], value: "Tescil belgesi alındı", status: "İncelemede" }];
  const contents = [{ id: 2018, brand: brands[0], value: "Yeni sezon deri koleksiyonu", status: "Yayında" }];
  const reports = [{ id: 3051, brand: brands[0], value: "Örnek ürün ilanı", status: "CRM incelemesinde" }];
  const sections = {
    catalog: { title: "Marka kataloğu", column: "Kategori" },
    mine: { title: "Yetkili olduğunuz markalar", column: "Kategori" },
    ownership: { title: "Sahiplik başvurularınız", column: "Başvuru özeti" },
    content: { title: "Markadan içerikleri", column: "İçerik başlığı" },
    reports: { title: "Marka ihlali başvuruları", column: "Bildirilen ilan" }
  };
  const actions = {
    add: { title: "Marka ekle", fields: ["name", "category"], submit: "Markayı ekle" },
    apply: { title: "Sahiplik başvurusu", fields: ["brand", "file"], submit: "Başvuruyu kaydet" },
    content: { title: "Markadan içerik ekle", fields: ["brand", "title", "description"], submit: "İçeriği yayınla" },
    report: { title: "Marka ihlali bildir", fields: ["brand", "listing", "description"], submit: "Bildirimi kaydet" }
  };
  const search = document.getElementById("bb_brand_search");
  const count = document.querySelector("[data-brand-count]");
  const notice = document.querySelector("[data-brand-notice]");
  const title = document.getElementById("bb_brand_table_title");
  const column = document.querySelector("[data-brand-column]");
  const empty = document.querySelector("[data-brand-empty]");
  const publish = document.querySelector("[data-brand-publish]");
  const drawerTitle = document.getElementById("bb_brand_drawer_title");
  const detail = document.querySelector("[data-brand-detail]");
  const form = document.getElementById("bb_brand_form");
  const select = document.getElementById("bb_brand_select");
  const submit = document.querySelector("[data-brand-submit]");
  const error = document.querySelector("[data-brand-error]");
  const tabs = document.querySelectorAll("[data-brand-view]");
  let view = "catalog";
  let action = "";

  function normalize(value) {
    return value.trim().toLocaleLowerCase("tr");
  }

  function records() {
    if (view === "content") return contents;
    if (view === "reports") return reports;
    if (view === "ownership") return ownership;

    return brands.filter(brand => view !== "mine" || brand.owned).map(brand => ({
      brand,
      value: brand.category,
      status: brand.owned ? "Yetki doğrulandı" : "Katalogda"
    }));
  }

  function drawerButton(label, operation, record) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn bb-btn-secondary btn-sm";
    button.textContent = label;
    button.dataset.brandAction = operation;
    button.dataset.brandId = record.brand.id;
    if (record.id) button.dataset.brandRecord = record.id;
    button.setAttribute("data-bb-drawer-toggle", "#bb_brand_drawer");
    button.setAttribute("aria-label", record.brand.name + " " + label.toLocaleLowerCase("tr"));
    return button;
  }

  function render() {
    const query = normalize(search.value);
    const items = records().filter(item => normalize(item.brand.name + " " + item.value + " " + item.status).includes(query));
    title.textContent = sections[view].title;
    column.textContent = sections[view].column;
    count.textContent = String(items.length);
    count.setAttribute("aria-label", items.length + " kayıt");
    empty.hidden = items.length > 0;
    publish.hidden = view !== "content" || !brands.some(brand => brand.owned);

    rows.replaceChildren(...items.map(item => {
      const row = document.createElement("tr");
      row.insertCell().textContent = item.brand.name;
      row.insertCell().textContent = item.value;
      const badge = document.createElement("span");
      const tone = ["Yetki doğrulandı", "Yayında"].includes(item.status) ? "light-success" : item.status === "Katalogda" ? "outline" : "light-warning";
      badge.className = "badge bb-badge bb-badge-" + tone;
      badge.textContent = item.status;
      row.insertCell().append(badge);

      const cell = row.insertCell();
      const pending = ownership.some(record => record.brand === item.brand);
      const canApply = view === "catalog" && !item.brand.owned && !pending;
      cell.append(drawerButton(canApply ? "Sahiplik başvurusu" : "Detay", canApply ? "apply" : "detail", item));
      return row;
    }));
  }

  function selectView(next) {
    view = next;
    search.value = "";
    tabs.forEach(tab => {
      const active = tab.dataset.brandView === view;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-pressed", String(active));
    });
    render();
  }

  tabs.forEach(tab => tab.addEventListener("click", () => selectView(tab.dataset.brandView)));
  search.addEventListener("input", render);
  document.querySelector("[data-brand-clear]").addEventListener("click", () => {
    search.value = "";
    render();
    search.focus();
  });

  document.body.addEventListener("click", event => {
    const button = event.target.closest("[data-brand-action]");
    if (!button) return;

    action = button.dataset.brandAction;
    const brand = brands.find(item => item.id === Number(button.dataset.brandId));
    const config = actions[action];
    const record = records().find(item => item.brand === brand && (!item.id || item.id === Number(button.dataset.brandRecord)));
    drawerTitle.textContent = config ? config.title : brand.name;
    detail.hidden = Boolean(config);
    detail.textContent = config ? "" : [record.value, record.status, record.description].filter(Boolean).join(" · ");
    form.hidden = !config;
    submit.hidden = !config;
    if (!config) return;

    form.reset();
    error.hidden = true;
    submit.textContent = config.submit;
    form.querySelectorAll("[data-brand-field]").forEach(field => {
      field.hidden = !config.fields.includes(field.dataset.brandField);
      field.querySelector("input, select, textarea").disabled = field.hidden;
    });

    const available = brands.filter(item => action === "content" ? item.owned : action !== "apply" || !item.owned);
    select.replaceChildren(...available.map(item => new Option(item.name, item.id)));
    if (brand) select.value = String(brand.id);
    if (action === "add") form.elements.name.value = search.value;
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const value = new FormData(form);
    const brand = brands.find(item => item.id === Number(value.get("brand")));
    const name = String(value.get("name") || "").trim();
    const category = String(value.get("category") || "").trim();
    const description = String(value.get("description") || "").trim();
    const contentTitle = String(value.get("title") || "").trim();
    let message;

    if ((action === "content" && (!contentTitle || !description)) || (action === "report" && !description)) {
      error.textContent = "Zorunlu alanları doldurun.";
      error.hidden = false;
      return;
    }

    if (action === "add") {
      if (!name || !category || brands.some(item => normalize(item.name) === normalize(name))) {
        error.textContent = "Yeni bir marka adı ve kategori girin. Aynı adla bir kayıt olabilir.";
        error.hidden = false;
        return;
      }
      brands.push({ id: brands.length + 1, name, category });
      selectView("catalog");
      message = "Marka demo kataloğuna eklendi.";
    } else if (action === "apply" && brand) {
      if (brand.owned || ownership.some(item => item.brand === brand)) {
        error.textContent = "Bu marka için mevcut bir yetki veya başvuru var.";
        error.hidden = false;
        return;
      }
      ownership.push({ id: 1042 + ownership.length, brand, value: "Tescil belgesi seçildi", status: "İncelemede" });
      selectView("ownership");
      message = "Sahiplik başvurusu demo listesine eklendi.";
    } else if (action === "content" && brand && brand.owned) {
      contents.push({ id: 2018 + contents.length, brand, value: contentTitle, status: "Yayında", description });
      selectView("content");
      message = "İçerik demo listesine eklendi.";
    } else if (action === "report" && brand) {
      const listing = new URL(String(value.get("listing")));
      if (!["http:", "https:"].includes(listing.protocol)) {
        error.textContent = "Bir HTTP veya HTTPS ürün bağlantısı girin.";
        error.hidden = false;
        return;
      }
      reports.push({ id: 3051 + reports.length, brand, value: listing.hostname, status: "CRM incelemesinde", description });
      selectView("reports");
      message = "İhlal bildirimi demo listesine eklendi.";
    }

    if (message) {
      notice.textContent = message;
      window.BBDrawer.close();
    }
  });

  render();
})();
