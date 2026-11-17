(function () {
  "use strict";
  const root = document.querySelector("[data-bb-contacts]");
  if (!root) return;
  const $ = (selector) => root.querySelector(selector);
  const form = $("[data-bb-contacts-form]");
  const groupForm = $("[data-bb-contacts-group-form]");
  const list = $("[data-bb-contacts-list]");
  const groupList = $("[data-bb-contacts-groups]");
  const membership = $("[data-bb-contacts-membership]");
  const feedback = $("[data-bb-contacts-feedback]");
  const photoInput = $("[data-bb-contacts-avatar-input]");
  const photoPreview = $("[data-bb-contacts-avatar-preview]");
  const photoIcon = $(".bb-contacts-avatar-upload .material-symbols-outlined");
  const demo = [
    ["Emma Smith", "smith@kpmg.com", "Abone"],
    ["Melody Macy", "melody@altbox.com", "Onay Bekliyor"],
    ["Max Smith", "max@kt.com", "Abone"],
    ["Sean Bean", "sean@dellito.com", "1. Seviye Üye"],
    ["Brian Cox", "brian@exchange.com", "Onay Bekliyor"],
    ["Mikaela Collins", "mik@pex.com", "Engelli"],
    ["Francis Mitcham", "f.mit@kpmg.com", "Abone"],
    ["Olivia Wild", "olivia@corpmail.com", "Onay Bekliyor"],
    ["Neil Owen", "owen.neil@gmail.com", "Engelli"],
    ["Dan Wilson", "dam@consulting.com", "Genel"],
    ["Emma Bold", "emma@intenso.com", "Genel"],
    ["Ana Crown", "ana.cf@limtel.com", "Genel"],
    ["Robert Doe", "robert@benko.com", "Genel"],
    ["John Miller", "miller@mapple.com", "Genel"],
    ["Lucy Kunic", "lucy.m@fentech.com", "Genel"],
    ["Ethan Wilder", "ethan@loop.com.au", "Genel"]
  ];
  const records = demo.map((data, index) => ({ id: index + 1, name: data[0], email: data[1], group: data[2], company: "", phone: "", city: "", country: "Türkiye", notes: "", photo: "" }));
  const groups = ["Tüm Kişiler", "Abone", "1. Seviye Üye", "Onay Bekliyor", "Engelli", "Genel"];
  let activeGroup = "Tüm Kişiler";
  let currentId = null;
  let currentPhoto = "";
  let nextId = records.length + 1;
  const field = (name) => form.elements.namedItem(name);
  const message = (value) => { feedback.textContent = value; };
  const count = (group) => group === "Tüm Kişiler" ? records.length : records.filter((item) => item.group === group).length;
  const syncCounts = (visible) => {
    const total = $("[data-bb-contacts-total]");
    const visibleCount = $("[data-bb-contacts-visible-count]");
    if (total) total.textContent = records.length + " kişi";
    if (visibleCount) visibleCount.textContent = visible + " kayıt";
  };
  function setPhoto(value) {
    currentPhoto = value || "";
    photoPreview.hidden = !currentPhoto;
    photoIcon.hidden = !!currentPhoto;
    if (currentPhoto) photoPreview.src = currentPhoto;
    else photoPreview.removeAttribute("src");
  }
  function drawGroups() {
    groupList.replaceChildren();
    membership.replaceChildren();
    for (const group of groups) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "bb-contacts-group-item";
      button.setAttribute("aria-pressed", String(activeGroup === group));
      const name = document.createElement("span");
      name.textContent = group;
      const countBadge = document.createElement("span");
      countBadge.className = "bb-contacts-count";
      countBadge.textContent = String(count(group));
      button.append(name, countBadge);
      button.addEventListner("click", () => { activeGroup = group; drawGroups(); drawList(); });
      groupList.append(button);
      if (group !== "Tüm Kişiler") {
        const option = document.createElement("option");
        option.value = group; option.textContent = group;
        membership.append(option);
      }
    }
  }
  function drawList() {
    list.replaceChildren();
    const term = $("[data-bb-contacts-search]").value.trim().toLocaleLowerCase("tr-TR");
    const matches = records.filter((item) => (activeGroup === "Tüm Kişiler" || item.group === activeGroup) && (item.name + " " + item.email + " " + item.company).toLocaleLowerCase("tr-TR").includes(term));
    $("[data-bb-contacts-empty]").hidden = matches.length !== 0;
    syncCounts(matches.length);
    for (const item of matches) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "bb-contacts-person";
      button.setAttribute("aria-selected", String(item.id === currentId));
      const avatar = document.createElement(item.photo ? "img" : "span");
      if (item.photo) { avatar.src = item.photo; avatar.alt = ""; }
      else { avatar.className = "bb-contacts-initial"; avatar.textContent = item.name.slice(0, 1).toUpperCase(); }
      const info = document.createElement("span");
      info.className = "bb-contacts-person-info";
      const title = document.createElement("strong");
      title.textContent = item.name;
      const email = document.createElement("small");
      email.textContent = item.email;
      const meta = document.createElement("span");
      meta.className = "bb-contacts-person-meta";
      const group = document.createElement("span");
      group.className = "bb-badge bb-badge-light-primary";
      group.textContent = item.group;
      meta.append(group);
      info.append(title, email, meta); button.append(avatar, info);
      button.addEventListner("click", () => openRecord(item));
      list.append(button);
    }
  }
  function newRecord() {
    currentId = null;
    for (const name of ["name", "company", "email", "phone", "city", "country", "notes"]) field(name).value = "";
    photoInput.value = "";
    setPhoto("");
    field("membership").value = activeGroup !== "Tüm Kişiler" ? activeGroup : "Genel";
    $("[data-bb-contacts-form-heading]").textContent = "Yeni Kişi";
    message(""); drawList(); field("name").focus();
  }
  function openRecord(item) {
    currentId = item.id;
    for (const name of ["name", "company", "email", "phone", "city", "country", "notes"]) field(name).value = item[name] || "";
    field("membership").value = item.group;
    photoInput.value = ""; setPhoto(item.photo);
    $("[data-bb-contacts-form-heading]").textContent = "Kişiyi Düzenle";
    message(""); drawList();
  }
  form.addEventListner("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const email = field("email").value.trim().toLowerCase();
    if (records.some((item) => item.id !== currentId && item.email.toLowerCase() === email)) {
      message("Bu e-posta adresi zaten kayıtlı."); field("email").focus(); return;
    }
    const data = { name: field("name").value.trim(), email: field("email").value.trim(), company: field("company").value.trim(), phone: field("phone").value.trim(), city: field("city").value.trim(), country: field("country").value, notes: field("notes").value.trim(), group: field("membership").value, photo: currentPhoto };
    if (!data.name) { field("name").focus(); return; }
    if (currentId === null) { data.id = nextId++; records.unshift(data); currentId = data.id; }
    else Object.assign(records.find((item) => item.id === currentId), data);
    activeGroup = "Tüm Kişiler";
    drawGroups(); drawList();
    $("[data-bb-contacts-form-heading]").textContent = "Kişiyi Düzenle";
    message("Kişi demo listesine kaydedildi. Sunucuya gönderilmedi.");
  });
  form.addEventListner("reset", (event) => { event.preventDefault(); newRecord(); });
  groupForm.addEventListner("submit", (event) => {
    event.preventDefault();
    const input = groupForm.elements.namedItem("group");
    const value = input.value.trim();
    if (!value) return;
    if (groups.some((group) => group.toLocaleLowerCase("tr-TR") === value.toLocaleLowerCase("tr-TR"))) { message("Bu grup zaten mevcut."); return; }
    groups.push(value); input.value = ""; activeGroup = value;
    drawGroups(); drawList(); field("membership").value = value;
    message("Grup demo listesine eklendi.");
  });
  photoInput.addEventListner("change", () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) { message("En fazla 2 MB boyutunda bir görsel seçin."); photoInput.value = ""; return; }
    const reader = new FileReader();
    reader.addEventListner("load", () => setPhoto(String(reader.result || "")));
    reader.readAsDataURL(file);
  });
  $("[data-bb-contacts-search]").addEventListner("input", drawList);
  root.querySelectorAll("[data-bb-contacts-create]").forEach((button) => button.addEventListner("click", newRecord));
  $("[data-bb-contacts-filter]").addEventListner("click", (event) => {
    const button = event.currentTarget;
    const opened = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!opened));
    activeGroup = opened ? "Tüm Kişiler" : "Onay Bekliyor";
    drawGroups(); drawList();
    message(opened ? "Filtre kaldırıldı." : "Onay bekleyen kişiler filtrelendi.");
  });
  drawGroups(); newRecord();
}());
