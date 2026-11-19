/* Panel user-management showcase. No API or persistent writes. */
(function () {
  "use strict";

  const directory = document.querySelector("[data-bb-users-list]");
  const profile = document.querySelector("[data-bb-users-detail]");
  if (!directory && !profile) return;

  const users = [
    {id:1,name:"Emma Smith",email:"smith@kpmg.com",avatar:"300-2.webp",role:"Yönetici",team:"Pazarlama",status:"Aktif",auth:"Doğrulayıcı",last:"Dün",joined:"25 Tem 2025",order:1},
    {id:2,name:"Melody Macy",email:"melody@altbox.com",avatar:"",role:"Analist",team:"Ürün",status:"Aktif",auth:"Şifre",last:"20 dk önce",joined:"20 Ara 2025",order:2},
    {id:3,name:"Max Smith",email:"max@kt.com",avatar:"300-5.webp",role:"Geliştirici",team:"Mühendislik",status:"Aktif",auth:"Passkey",last:"3 gün önce",joined:"10 Mar 2025",order:3},
    {id:4,name:"Sean Bean",email:"sean@dellito.com",avatar:"300-6.webp",role:"Destek",team:"Destek",status:"Aktif",auth:"Doğrulayıcı",last:"5 saat önce",joined:"19 Ağu 2025",order:4},
    {id:5,name:"Brian Cox",email:"brian@exchange.com",avatar:"300-12.webp",role:"Geliştirici",team:"Mühendislik",status:"Aktif",auth:"Passkey",last:"2 gün önce",joined:"10 Kas 2025",order:5},
    {id:6,name:"Mikaela Collins",email:"mik@pex.com",avatar:"",role:"Yönetici",team:"Ürün",status:"Davetli",auth:"Şifre",last:"Davet gönderildi",joined:"20 Haz 2025",order:6},
    {id:7,name:"Francis Mitcham",email:"f.mit@kpmg.com",avatar:"300-11.webp",role:"Deneme",team:"Pazarlama",status:"Aktif",auth:"Şifre",last:"3 hafta önce",joined:"22 Eyl 2025",order:7},
    {id:8,name:"Olivia Wild",email:"olivia@corpmail.com",avatar:"",role:"Yönetici",team:"Finans",status:"Askıda",auth:"Şifre",last:"Dün",joined:"24 Haz 2025",order:8},
    {id:9,name:"Neil Owen",email:"owen.neil@gmail.com",avatar:"",role:"Analist",team:"Tasarım",status:"Aktif",auth:"Doğrulayıcı",last:"20 dk önce",joined:"21 Şub 2025",order:9},
    {id:10,name:"Dan Wilson",email:"dam@consulting.com",avatar:"300-8.webp",role:"Geliştirici",team:"Mühendislik",status:"Aktif",auth:"Şifre",last:"3 gün önce",joined:"15 Nis 2025",order:10},
    {id:11,name:"Nora Vale",email:"nora.vale@acmecloud.com",avatar:"300-9.webp",role:"Yönetici",team:"Tasarım",status:"Aktif",auth:"Passkey",last:"3 saat önce",joined:"12 Nis 2026",order:11},
    {id:12,name:"David Kim",email:"david.kim@acmecloud.com",avatar:"300-14.webp",role:"Geliştirici",team:"Mühendislik",status:"Davetli",auth:"Şifre",last:"Davet gönderildi",joined:"02 May 2026",order:12}
  ];

  const avatarPath = "../../assets/media/avatars/";
  const selected = new Set();
  const pageState = {page:1,size:10,key:"order",ascending:true};

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function appendIcon(element, icon) {
    const glyph = node("span", "material-symbols-outlined", icon);
    glyph.setAttribute("aria-hidden", "true");
    element.prepend(glyph);
    return element;
  }

  function avatar(user, size) {
    const host = node("span", "bb-symbol size-" + size + " is-circle");
    if (user.avatar) {
      const image = node("img");
      image.src = avatarPath + user.avatar;
      image.alt = "";
      image.loading = "lazy";
      image.addEventListener("error", () => {
        host.replaceChildren(node("span", "bb-symbol-label", user.name.charAt(0)));
      }, {once:true});
      host.append(image);
    } else {
      host.append(node("span", "bb-symbol-label", user.name.charAt(0)));
    }
    return host;
  }

  function badge(text, kind) {
    return node("span", "bb-badge bb-badge-light-" + kind, text);
  }

  function statusBadge(status) {
    return badge(status, status === "Aktif" ? "success" : status === "Davetli" ? "warning" : "danger");
  }

  function notify(text) {
    const target = document.querySelector("[data-bb-users-feedback]");
    if (target) target.textContent = text;
  }

  if (directory) {
    const rows = directory.querySelector("[data-bb-users-rows]");
    const search = directory.querySelector("[data-bb-users-search]");
    const roleFilter = directory.querySelector("[data-bb-users-role]");
    const statusFilter = directory.querySelector("[data-bb-users-status]");
    const pageSize = directory.querySelector("[data-bb-users-size]");
    const all = directory.querySelector("[data-bb-users-select-all]");
    const pageButtons = directory.querySelector("[data-bb-users-pages]");
    const filterArea = directory.querySelector("[data-bb-users-filter-area]");
    const filterToggle = document.querySelector("[data-bb-users-filter-toggle]");
    const dialog = document.querySelector("[data-bb-users-create-dialog]");

    function filteredUsers() {
      const query = search.value.trim().toLocaleLowerCase("tr-TR");
      const results = users.filter(user =>
        (!query || (user.name + " " + user.email + " " + user.team + " " + user.role).toLocaleLowerCase("tr-TR").includes(query)) &&
        (!roleFilter.value || roleFilter.value === user.role) &&
        (!statusFilter.value || statusFilter.value === user.status)
      );
      results.sort((a, b) => {
        const left = a[pageState.key], right = b[pageState.key];
        const cmp = typeof left === "number" ? left - right : String(left).localeCompare(String(right), "tr");
        return pageState.ascending ? cmp : -cmp;
      });
      return results;
    }

    function render() {
      const found = filteredUsers();
      const pageCount = Math.max(1, Math.ceil(found.length / pageState.size));
      pageState.page = Math.min(pageState.page, pageCount);
      const start = (pageState.page - 1) * pageState.size;
      const visible = found.slice(start, start + pageState.size);
      rows.replaceChildren();

      visible.forEach(user => {
        const tr = node("tr");
        if (selected.has(user.id)) tr.classList.add("bb-panel-list-selected");
        const selectCell = node("td");
        const check = node("input", "form-check-input");
        check.type = "checkbox";
        check.checked = selected.has(user.id);
        check.setAttribute("aria-label", user.name + " kullanıcısını seç");
        check.addEventListener("change", () => {
          if (check.checked) selected.add(user.id); else selected.delete(user.id);
          render();
        });
        selectCell.append(check);
        tr.append(selectCell);

        const personCell = node("td");
        const person = node("div", "bb-users-person");
        const text = node("span", "bb-users-person-copy");
        const link = node("a", "bb-users-person-name", user.name);
        link.href = "user-details.html?id=" + encodeURIComponent(user.id);
        text.append(link, node("small", "", user.email));
        person.append(avatar(user, 40), text);
        personCell.append(person);
        tr.append(personCell);

        const role = node("td");
        role.append(badge(user.role, user.role === "Yönetici" ? "primary" : "info"));
        tr.append(role);
        const team = node("td");
        team.append(node("span", "bb-users-team", user.team));
        tr.append(team);
        const state = node("td");
        state.append(statusBadge(user.status));
        tr.append(state);
        const auth = node("td");
        auth.append(node("span", "bb-users-auth", user.auth));
        tr.append(auth);
        tr.append(node("td", "bb-users-muted", user.last));
        const operation = node("td");
        const actions = node("details", "bb-users-actions");
        actions.append(node("summary", "btn bb-btn-secondary btn-sm", "İşlemler"));
        const menu = node("div", "bb-users-actions-menu");
        const view = node("a", "", "Kullanıcı detayları");
        view.href = "user-details.html?id=" + encodeURIComponent(user.id);
        menu.append(view);
        const toggle = node("button", "", user.status === "Askıda" ? "Etkinleştir (demo)" : "Askıya al (demo)");
        toggle.type = "button";
        toggle.addEventListener("click", () => {
          user.status = user.status === "Askıda" ? "Aktif" : "Askıda";
          notify(user.name + ": örnek durum " + user.status.toLocaleLowerCase("tr-TR") + " olarak değiştirildi. Sunucuya kaydedilmedi.");
          render();
        });
        menu.append(toggle);
        actions.append(menu);
        operation.append(actions);
        tr.append(operation);
        rows.append(tr);
      });

      pageButtons.replaceChildren();
      const pageItem = (label, target, disabled, current) => {
        const li = node("li", "page-item");
        if (disabled) li.classList.add("disabled");
        const btn = node("button", "page-link", label);
        btn.type = "button";
        btn.disabled = disabled;
        if (current) btn.setAttribute("aria-current", "page");
        btn.addEventListener("click", () => { pageState.page = target; render(); });
        li.append(btn);
        pageButtons.append(li);
      };
      pageItem("‹", pageState.page - 1, pageState.page === 1, false);
      for (let i = 1; i <= pageCount; i++) pageItem(String(i), i, false, i === pageState.page);
      pageItem("›", pageState.page + 1, pageState.page === pageCount, false);

      const selectedOnPage = visible.filter(user => selected.has(user.id)).length;
      all.checked = visible.length > 0 && selectedOnPage === visible.length;
      all.indeterminate = selectedOnPage > 0 && selectedOnPage < visible.length;
      directory.querySelector("[data-bb-users-range]").textContent =
        (found.length ? start + 1 : 0) + "–" + Math.min(start + pageState.size, found.length) + " / " + found.length;
      directory.querySelector("[data-bb-users-selected-count]").textContent = selected.size + " seçili";
      directory.querySelector("[data-bb-users-total]").textContent = users.length + " kullanıcı";
      directory.querySelector("[data-bb-users-empty]").hidden = found.length !== 0;
      directory.querySelector("[data-bb-users-bulk]").disabled = selected.size === 0;
    }

    search.addEventListener("input", () => { pageState.page = 1; render(); });
    [roleFilter, statusFilter].forEach(filter => filter.addEventListener("change", () => { pageState.page = 1; render(); }));
    pageSize.addEventListener("change", () => { pageState.size = Number(pageSize.value); pageState.page = 1; render(); });
    all.addEventListener("change", () => {
      filteredUsers().slice((pageState.page - 1) * pageState.size, pageState.page * pageState.size)
        .forEach(user => { if (all.checked) selected.add(user.id); else selected.delete(user.id); });
      render();
    });
    directory.querySelectorAll("[data-bb-users-sort]").forEach(button => {
      button.addEventListener("click", () => {
        const key = button.dataset.bbUsersSort;
        pageState.ascending = pageState.key === key ? !pageState.ascending : true;
        pageState.key = key;
        directory.querySelectorAll("[data-bb-users-sort]").forEach(control => {
          control.closest("th").setAttribute("aria-sort", control === button ? (pageState.ascending ? "ascending" : "descending") : "none");
        });
        render();
      });
    });
    filterToggle.addEventListener("click", () => {
      filterArea.hidden = !filterArea.hidden;
      filterToggle.setAttribute("aria-expanded", String(!filterArea.hidden));
    });
    directory.querySelector("[data-bb-users-reset]").addEventListener("click", () => {
      search.value = "";
      roleFilter.value = "";
      statusFilter.value = "";
      pageState.page = 1;
      render();
    });
    directory.querySelector("[data-bb-users-bulk]").addEventListener("click", () => {
      users.forEach(user => { if (selected.has(user.id)) user.status = "Askıda"; });
      const count = selected.size;
      selected.clear();
      notify(count + " örnek kullanıcı askıya alındı. Bu değişiklikler sunucuya gönderilmedi.");
      render();
    });
    document.querySelectorAll("[data-bb-users-create]").forEach(button =>
      button.addEventListener("click", () => dialog.showModal()));
    dialog.querySelector("[data-bb-users-cancel]").addEventListener("click", () => dialog.close());
    const createForm = dialog.querySelector("form");
    createForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!createForm.reportValidity()) return;
      const values = new FormData(createForm);
      const name = String(values.get("name") || "").trim();
      const email = String(values.get("email") || "").trim();
      if (!name || !email) return;
      if (users.some(user => user.email.toLocaleLowerCase("tr-TR") === email.toLocaleLowerCase("tr-TR"))) {
        notify("Bu e-posta ile örnek kullanıcı zaten mevcut.");
        return;
      }
      users.unshift({id:Date.now(),name,email,avatar:"",role:String(values.get("role")),team:String(values.get("team")),status:"Davetli",auth:"Şifre",last:"Davet gönderilmedi",joined:"Bugün",order:0});
      createForm.reset();
      dialog.close();
      pageState.page = 1;
      notify(name + " örnek listeye eklendi. Davet gönderilmedi; sunucuda kayıt oluşturulmadı.");
      render();
    });
    directory.querySelector("[data-bb-users-export]").addEventListener("click", () => {
      const columns = ["Kullanıcı","E-posta","Rol","Ekip","Durum","Kimlik doğrulama","Son etkinlik"];
      const quote = value => '"' + String(value).replace(/"/g, '""') + '"';
      const content = [columns, ...filteredUsers().map(user => [user.name,user.email,user.role,user.team,user.status,user.auth,user.last])]
        .map(row => row.map(quote).join(",")).join("\r\n");
      const blob = new Blob(["\uFEFF",content], {type:"text/csv;charset=utf-8"});
      const url = URL.createObjectURL(blob);
      const link = node("a");
      link.href = url;
      link.download = "kullanicilar-demo.csv";
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      notify("Görünür filtre kapsamındaki örnek kullanıcılar CSV olarak dışa aktarıldı.");
    });
    render();
  }

  if (profile) {
    const id = Number(new URLSearchParams(window.location.search).get("id")) || 11;
    const user = users.find(person => person.id === id) || users[10];
    profile.querySelectorAll("[data-bb-user-name]").forEach(element => { element.textContent = user.name; });
    profile.querySelectorAll("[data-bb-user-email]").forEach(element => { element.textContent = user.email; });
    profile.querySelector("[data-bb-user-role]").textContent = user.role + " · " + user.team;
    profile.querySelector("[data-bb-user-status]").replaceWith(statusBadge(user.status));
    profile.querySelector("[data-bb-user-avatar]").append(avatar(user, 60));
    profile.querySelector("[data-bb-user-last]").textContent = user.last;
    profile.querySelector("[data-bb-user-joined]").textContent = user.joined;

    profile.querySelectorAll("[data-bb-users-demo-action]").forEach(button => {
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-bb-users-demo-action");
        if (action === "remove") {
          const accepted = window.confirm("Bu yalnız bir demo işlemidir. Örnek kullanıcıyı kaldırma simülasyonunu onaylıyor musunuz?");
          if (!accepted) return;
        }
        if (action === "suspend" || action === "deactivate") {
          const accepted = window.confirm("Bu işlem yalnız demo görünümünü değiştirir. Devam edilsin mi?");
          if (!accepted) return;
          const next = action === "suspend" ? "Askıda" : "Devre dışı";
          profile.querySelector("[data-bb-user-status-display]").replaceChildren(statusBadge(next));
        }
        notify("Demo işlemi: " + button.textContent.trim() + ". Gerçek kullanıcı hesabında işlem yapılmadı.");
      });
    });
    document.querySelector(".bb-page-title").textContent = "Kullanıcı / " + user.name;
  }
})();