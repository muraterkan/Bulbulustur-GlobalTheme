/* File Manager demo — panel-only client-side composition; no storage API or network transfers. */
(function () {
  "use strict";

  const app = document.querySelector("[data-bb-files]");
  if (!app) return;

  const avatarBase = "../../assets/media/avatars/";
  const owners = [
    {name:"Nora Vale", avatar:"300-2.webp"},
    {name:"Leo Grant", avatar:"300-5.webp"},
    {name:"Priya Patel", avatar:"300-6.webp"},
    {name:"Kenji Tan", avatar:"300-12.webp"},
    {name:"Mira Stone", avatar:"2ab21709-aa5c-451e-8be7-3b8c56c59a3c.webp"}
  ];
  const folders = [
    {id:"root",parent:null,name:"Dosyalarım",owner:0,modified:13,shared:false,starred:false,trash:false},
    {id:"campaign",parent:"root",name:"Bahar Kampanyası",owner:1,modified:12,shared:true,starred:true,trash:false},
    {id:"client",parent:"root",name:"Müşteri Teslimleri",owner:2,modified:11,shared:true,starred:false,trash:false},
    {id:"studio",parent:"root",name:"Stüdyo Operasyonları",owner:0,modified:10,shared:false,starred:false,trash:false},
    {id:"brand",parent:"root",name:"Marka Kütüphanesi",owner:3,modified:9,shared:true,starred:false,trash:false},
    {id:"creative",parent:"campaign",name:"Sosyal Medya",owner:1,modified:8,shared:true,starred:false,trash:false},
    {id:"contracts",parent:"client",name:"Sözleşmeler",owner:2,modified:7,shared:true,starred:false,trash:false}
  ];
  const files = [
    {id:"brand-tokens",parent:"root",name:"brand-tokens.json",type:"JSON",size:64000,owner:3,modified:10,shared:true,starred:false,trash:false},
    {id:"onboarding",parent:"root",name:"Yeni Ekip Rehberi.pdf",type:"PDF",size:16000000,owner:4,modified:6,shared:false,starred:false,trash:false},
    {id:"media-kit",parent:"root",name:"Basın Kiti.zip",type:"ZIP",size:28000000,owner:1,modified:5,shared:true,starred:false,trash:false},
    {id:"quarter-plan",parent:"root",name:"3. Çeyrek Planı.pdf",type:"PDF",size:11800000,owner:0,modified:13,shared:true,starred:true,trash:false},
    {id:"studio-reel",parent:"studio",name:"Stüdyo Tanıtım.mp4",type:"MP4",size:64000000,owner:1,modified:12,shared:false,starred:false,trash:false},
    {id:"brand-book",parent:"brand",name:"Marka Kılavuzu.pdf",type:"PDF",size:8800000,owner:3,modified:11,shared:true,starred:true,trash:false},
    {id:"logo-png",parent:"brand",name:"Logo Önizleme.png",type:"PNG",size:1800000,owner:2,modified:6,shared:true,starred:false,trash:false},
    {id:"campaign-brief",parent:"campaign",name:"Kampanya Briefi.docx",type:"DOCX",size:420000,owner:1,modified:9,shared:true,starred:false,trash:false},
    {id:"campaign-banner",parent:"creative",name:"Kampanya Vitrini.jpg",type:"JPG",size:3200000,owner:0,modified:8,shared:true,starred:true,trash:false},
    {id:"agreement",parent:"contracts",name:"Hizmet Sözleşmesi.pdf",type:"PDF",size:740000,owner:2,modified:7,shared:true,starred:false,trash:false},
    {id:"roadmap",parent:"root",name:"Ürün Yol Haritası.xlsx",type:"XLSX",size:1290000,owner:0,modified:12,shared:false,starred:false,trash:false},
    {id:"notes",parent:"root",name:"Toplantı Notları.txt",type:"TXT",size:12000,owner:4,modified:4,shared:false,starred:false,trash:false}
  ];

  const state = {view:"drive", folder:"root", layout:"list", query:"", type:"all", sort:"name", desc:false};
  const selected = new Set();
  let dialogItem = null;
  let droppedFiles = [];

  const $ = selector => app.querySelector(selector);
  const $$ = selector => Array.from(app.querySelectorAll(selector));

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function icon(name, className) {
    const glyph = element("span","material-symbols-outlined" + (className ? " " + className : ""),name);
    glyph.setAttribute("aria-hidden","true");
    return glyph;
  }
  function action(label, iconName, className) {
    const button = element("button",className || "btn bb-btn-secondary btn-sm");
    button.type = "button";
    if (iconName) button.append(icon(iconName),document.createTextNode(" " + label));
    else button.textContent = label;
    return button;
  }
  function notify(text) { $("[data-bb-files-status]").textContent = text; }
  function currentItems() { return folders.slice(1).concat(files); }
  function byId(id) { return currentItems().find(item => item.id === id) || null; }
  function isFolder(item) { return !!item && folders.includes(item); }
  function fileIcon(item) {
    if (isFolder(item)) return "folder";
    return {PDF:"picture_as_pdf",ZIP:"folder_zip",JPG:"image",PNG:"image",MP4:"movie",JSON:"data_object",DOCX:"description",XLSX:"table_chart",TXT:"article"}[item.type] || "insert_drive_file";
  }
  function fmtSize(bytes) {
    if (!bytes) return "—";
    if (bytes < 1000) return bytes + " B";
    if (bytes < 1000000) return (bytes / 1000).toFixed(1) + " KB";
    if (bytes < 1000000000) return (bytes / 1000000).toFixed(1) + " MB";
    return (bytes / 1000000000).toFixed(1) + " GB";
  }
  function folderCount(folder) { return currentItems().filter(item => item.parent === folder.id && !item.trash).length; }
  function totalSize(item) {
    if (!isFolder(item)) return item.size;
    return currentItems().filter(child => child.parent === item.id && !child.trash).reduce((sum,child) => sum + totalSize(child),0);
  }
  function modified(item) { return item.modified >= 12 ? "Bugün" : item.modified >= 10 ? "Dün" : item.modified >= 7 ? "Bu hafta" : "Geçen hafta"; }
  function person(owner) {
    const item = owners[owner] || owners[0];
    const host = element("span","bb-files-person");
    const avatar = element("span","bb-symbol size-25 is-circle");
    const img = element("img");
    img.src = avatarBase + item.avatar;
    img.alt = "";
    img.loading = "lazy";
    avatar.append(img);
    host.append(avatar,element("span","",item.name));
    return host;
  }
  function isDescendant(target, ancestor) {
    let parent = target;
    while (parent && parent !== "root") {
      if (parent === ancestor) return true;
      parent = folders.find(folder => folder.id === parent)?.parent || null;
    }
    return false;
  }

  function visibleItems() {
    let collection = currentItems().filter(item => {
      if (state.view === "trash") return item.trash;
      if (item.trash) return false;
      if (state.view === "drive") return item.parent === state.folder;
      if (state.view === "shared") return item.shared;
      if (state.view === "starred") return item.starred;
      return true;
    });
    const q = state.query.toLocaleLowerCase("tr-TR").trim();
    if (q) collection = collection.filter(item => item.name.toLocaleLowerCase("tr-TR").includes(q));
    if (state.type !== "all") {
      collection = collection.filter(item => {
        if (state.type === "folder") return isFolder(item);
        if (isFolder(item)) return false;
        if (state.type === "document") return ["PDF","DOCX","XLSX","TXT"].includes(item.type);
        if (state.type === "image") return ["JPG","PNG"].includes(item.type);
        return item.type.toLowerCase() === state.type;
      });
    }
    collection.sort((a,b) => {
      if (state.view === "recent" && state.sort === "name") return b.modified - a.modified;
      let value = state.sort === "size" ? totalSize(a) - totalSize(b) :
        state.sort === "modified" ? a.modified - b.modified : a.name.localeCompare(b.name,"tr");
      return state.desc ? -value : value;
    });
    return collection;
  }
  function openFolder(id) {
    const folder = folders.find(entry => entry.id === id && !entry.trash);
    if (!folder) return;
    state.view = "drive";
    state.folder = id;
    state.query = "";
    state.type = "all";
    $("[data-bb-files-search]").value = "";
    $("[data-bb-files-type]").value = "all";
    selected.clear();
    render();
  }
  function activate(item) {
    if (isFolder(item)) openFolder(item.id);
    else { dialogItem = item; showFileInfo(); }
  }
  function navigate(view) {
    state.view = view;
    state.query = "";
    state.type = "all";
    $("[data-bb-files-search]").value = "";
    $("[data-bb-files-type]").value = "all";
    selected.clear();
    render();
  }

  function renderTree() {
    const container = $("[data-bb-files-tree]");
    container.replaceChildren();
    function recurse(parent, depth) {
      folders.filter(folder => folder.parent === parent && !folder.trash).forEach(folder => {
        const button = action(folder.name,"folder","bb-files-tree-link");
        button.dataset.depth = String(depth);
        if (state.view === "drive" && state.folder === folder.id) button.setAttribute("aria-current","page");
        button.addEventListener("click",() => openFolder(folder.id));
        container.append(button);
        recurse(folder.id,depth + 1);
      });
    }
    recurse("root",0);
  }
  function renderBreadcrumb() {
    const crumb = $("[data-bb-files-crumb]");
    crumb.replaceChildren();
    if (state.view !== "drive") {
      crumb.append(element("span","",({shared:"Paylaşılanlar",recent:"Son Kullanılanlar",starred:"Yıldızlılar",trash:"Çöp Kutusu"})[state.view]));
      return;
    }
    const chain = [];
    let id = state.folder;
    while (id) {
      const folder = folders.find(entry => entry.id === id);
      if (!folder) break;
      chain.unshift(folder);
      id = folder.parent;
    }
    chain.forEach((folder,index) => {
      if (index) crumb.append(icon("chevron_right"));
      if (index === chain.length - 1) crumb.append(element("strong","",folder.name));
      else {
        const link = action(folder.name,null,"bb-files-crumb-link");
        link.addEventListener("click",() => openFolder(folder.id));
        crumb.append(link);
      }
    });
  }
  function itemActions(item) {
    const details = element("details","bb-files-actions");
    const summary = element("summary","bb-panel-icon-button");
    summary.setAttribute("aria-label",item.name + " işlemleri");
    summary.append(icon("more_vert"));
    details.append(summary);
    const menu = element("div","bb-files-actions-menu");
    const actions = [
      ["Aç / ayrıntı","open",true],
      [item.starred ? "Yıldızı kaldır" : "Yıldızla","star",state.view !== "trash"],
      ["Yeniden adlandır","rename",state.view !== "trash"],
      ["Taşı","move",state.view !== "trash"],
      ["Paylaş","share",state.view !== "trash"],
      [state.view === "trash" ? "Geri yükle" : "Çöp kutusuna taşı",state.view === "trash" ? "restore":"trash",true]
    ];
    actions.forEach(([label,verb,enabled]) => {
      if (!enabled) return;
      const button = action(label,null,"");
      button.addEventListener("click",() => {
        details.open = false;
        handleItemAction(item,verb);
      });
      menu.append(button);
    });
    details.append(menu);
    return details;
  }
  function handleItemAction(item,verb) {
    if (verb === "open") return activate(item);
    if (verb === "star") { item.starred = !item.starred; render(); notify(item.name + " yıldız durumu güncellendi (demo)."); return; }
    if (verb === "restore") { item.trash = false; render(); notify(item.name + " geri yüklendi (demo)."); return; }
    if (verb === "trash") {
      if (isFolder(item)) {
        const queue = [item.id];
        for (let i = 0; i < queue.length; i++) {
          currentItems().filter(entry => entry.parent === queue[i]).forEach(child => {
            child.trash = true;
            if (isFolder(child)) queue.push(child.id);
          });
        }
      }
      item.trash = true; selected.delete(item.id); render(); notify(item.name + " çöp kutusuna taşındı (demo)."); return;
    }
    dialogItem = item;
    if (verb === "rename") {
      $("[data-bb-files-rename-input]").value = item.name;
      $("[data-bb-files-rename-dialog]").showModal();
    }
    if (verb === "share") {
      $("[data-bb-files-share-name]").textContent = item.name;
      $("[data-bb-files-share-state]").textContent = item.shared ? "Paylaşılıyor (örnek)" : "Özel (örnek)";
      $("[data-bb-files-share-toggle]").textContent = item.shared ? "Paylaşımı kapat (demo)" : "Paylaşımı aç (demo)";
      $("[data-bb-files-share-dialog]").showModal();
    }
    if (verb === "move") {
      const select = $("[data-bb-files-move-target]");
      select.replaceChildren();
      folders.filter(folder => !folder.trash && folder.id !== item.id && !isDescendant(folder.id,item.id))
        .forEach(folder => {
          const option = element("option","",folder.name);
          option.value = folder.id;
          option.selected = folder.id === item.parent;
          select.append(option);
        });
      $("[data-bb-files-move-dialog]").showModal();
    }
  }
  function showFileInfo() {
    $("[data-bb-files-info-name]").textContent = dialogItem.name;
    $("[data-bb-files-info-type]").textContent = dialogItem.type;
    $("[data-bb-files-info-size]").textContent = fmtSize(dialogItem.size);
    $("[data-bb-files-info-modified]").textContent = modified(dialogItem);
    $("[data-bb-files-info-dialog]").showModal();
  }
  function fileRow(item) {
    const tr = element("tr");
    if (selected.has(item.id)) tr.classList.add("bb-panel-list-selected");
    const checkboxCell = element("td");
    const checkbox = element("input","form-check-input");
    checkbox.type = "checkbox";
    checkbox.checked = selected.has(item.id);
    checkbox.setAttribute("aria-label",item.name + " seç");
    checkbox.addEventListener("change",() => { checkbox.checked ? selected.add(item.id) : selected.delete(item.id); renderSelection(); });
    checkboxCell.append(checkbox);
    tr.append(checkboxCell);
    const name = element("td");
    const entry = element("div","bb-files-name");
    entry.append(icon(fileIcon(item),"bb-files-type-icon"));
    const button = action(item.name,null,"bb-files-name-button");
    button.addEventListener("click",() => activate(item));
    entry.append(button);
    if (item.starred) entry.append(icon("star","bb-files-star"));
    name.append(entry);
    tr.append(name);
    const owner = element("td"); owner.append(person(item.owner)); tr.append(owner);
    tr.append(element("td","",isFolder(item) ? "Klasör" : item.type));
    tr.append(element("td","",isFolder(item) ? folderCount(item) + " öğe" : fmtSize(item.size)));
    tr.append(element("td","",modified(item)));
    const actions = element("td");actions.append(itemActions(item));tr.append(actions);
    return tr;
  }
  function folderTile(item) {
    const wrapper = element("article","bb-files-folder-tile");
    const btn = action("",null,"bb-files-folder-open");
    btn.append(icon("folder","bb-files-folder-icon"));
    const text = element("span","bb-files-folder-copy");
    text.append(element("strong","",item.name),element("small","",folderCount(item) + " öğe · " + fmtSize(totalSize(item))));
    btn.append(text);
    btn.addEventListener("click",() => activate(item));
    wrapper.append(btn,itemActions(item));
    return wrapper;
  }
  function fileCard(item) {
    const article = element("article","bb-files-file-card");
    const badge = element("span","bb-badge bb-badge-light-primary",isFolder(item) ? "Klasör" : item.type);
    const opener = action(item.name,null,"bb-files-card-opener");
    opener.prepend(icon(fileIcon(item),"bb-files-file-card-icon"));
    opener.addEventListener("click",() => activate(item));
    article.append(opener,badge);
    article.append(element("small","bb-files-muted",fmtSize(totalSize(item)) + " · " + modified(item)));
    const foot = element("div","bb-files-card-footer");
    foot.append(person(item.owner),itemActions(item));
    article.append(foot);
    return article;
  }
  function renderSelection() {
    const items = visibleItems();
    const onPage = items.filter(item => selected.has(item.id)).length;
    const all = $("[data-bb-files-all]");
    all.checked = !!items.length && onPage === items.length;
    all.indeterminate = onPage > 0 && onPage < items.length;
    $("[data-bb-files-selected-count]").textContent = selected.size + " öğe seçili";
    $("[data-bb-files-bulk-trash]").disabled = !selected.size || state.view === "trash";
  }
  function render() {
    renderTree();
    renderBreadcrumb();
    $$("[data-bb-files-nav]").forEach(nav => {
      const active = nav.dataset.bbFilesNav === state.view && (state.view !== "drive" || state.folder === "root");
      if (active) nav.setAttribute("aria-current","page");
      else nav.removeAttribute("aria-current");
    });
    $$("[data-bb-files-layout]").forEach(button => {
      button.setAttribute("aria-pressed",String(button.dataset.bbFilesLayout === state.layout));
    });
    const items = visibleItems();
    const childrenFolders = state.view === "drive" ? items.filter(isFolder) : [];
    const fileItems = state.view === "drive" ? items.filter(item => !isFolder(item)) : items;
    const folderSection = $("[data-bb-files-folder-section]");
    folderSection.hidden = state.layout !== "list" || state.view !== "drive" || !childrenFolders.length;
    const tiles = $("[data-bb-files-folders]");
    tiles.replaceChildren(...childrenFolders.map(folderTile));
    const table = $("[data-bb-files-table]");
    const grid = $("[data-bb-files-grid]");
    table.hidden = state.layout !== "list";
    grid.hidden = state.layout !== "grid";
    const tbody = $("[data-bb-files-rows]");
    tbody.replaceChildren(...fileItems.map(fileRow));
    grid.replaceChildren(...items.map(fileCard));
    const empty = !items.length;
    $("[data-bb-files-empty]").hidden = !empty;
    $("[data-bb-files-main-title]").textContent =
      state.view === "drive" ? (folders.find(folder => folder.id === state.folder)?.name || "Dosyalarım") :
      ({shared:"Benimle paylaşılanlar",recent:"Son kullanılanlar",starred:"Yıldızlılar",trash:"Çöp kutusu"})[state.view];
    $("[data-bb-files-count]").textContent = items.length + " öğe";
    $("[data-bb-files-create-folder]").disabled = state.view !== "drive";
    renderSelection();
  }

  $$("[data-bb-files-nav]").forEach(btn => btn.addEventListener("click",() => {
    if (btn.dataset.bbFilesNav === "drive") openFolder("root"); else navigate(btn.dataset.bbFilesNav);
  }));
  $("[data-bb-files-search]").addEventListener("input",event => { state.query = event.target.value; selected.clear(); render(); });
  $("[data-bb-files-type]").addEventListener("change",event => { state.type = event.target.value; selected.clear(); render(); });
  $("[data-bb-files-sort]").addEventListener("change",event => {
    state.sort = event.target.value; render();
  });
  $("[data-bb-files-sort-direction]").addEventListener("click",event => {
    state.desc = !state.desc; event.currentTarget.setAttribute("aria-pressed",String(state.desc)); render();
  });
  $$("[data-bb-files-layout]").forEach(btn => btn.addEventListener("click",() => {
    state.layout = btn.dataset.bbFilesLayout; render();
  }));
  $("[data-bb-files-all]").addEventListener("change",event => {
    const checked = event.target.checked;
    visibleItems().forEach(item => checked ? selected.add(item.id) : selected.delete(item.id));
    renderSelection();
  });
  $("[data-bb-files-bulk-trash]").addEventListener("click",() => {
    if (!selected.size || !window.confirm(selected.size + " öğe çöp kutusuna taşınsın mı? (Yalnız demo)")) return;
    const count = selected.size;
    Array.from(selected).forEach(id => {
      const item = byId(id);
      if (item && !item.trash) handleItemAction(item,"trash");
    });
    selected.clear(); render(); notify(count + " öğe çöp kutusuna taşındı (demo).");
  });

  function connectDialog(dialogSelector, formSelector, onSubmit) {
    const dialog = $(dialogSelector);
    const form = $(formSelector);
    form.addEventListener("submit",event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      onSubmit(form,dialog);
    });
    dialog.querySelectorAll("[data-bb-files-dialog-close]").forEach(button =>
      button.addEventListener("click",() => dialog.close()));
  }
  document.querySelector("[data-bb-files-create-folder]").addEventListener("click",() => {
    $("[data-bb-files-folder-name]").value = "";
    $("[data-bb-files-new-folder-dialog]").showModal();
  });
  connectDialog("[data-bb-files-new-folder-dialog]","[data-bb-files-new-folder-form]",(form,dialog) => {
    const name = $("[data-bb-files-folder-name]").value.trim();
    if (!name) return;
    if (folders.some(folder => !folder.trash && folder.parent === state.folder && folder.name.toLocaleLowerCase("tr-TR") === name.toLocaleLowerCase("tr-TR"))) {
      notify("Bu konumda aynı isimde klasör var."); return;
    }
    folders.push({id:"folder-" + Date.now(),parent:state.folder,name,owner:0,modified:13,shared:false,starred:false,trash:false});
    dialog.close();form.reset();render();notify(name + " klasörü örnek olarak oluşturuldu.");
  });
  connectDialog("[data-bb-files-rename-dialog]","[data-bb-files-rename-form]",(_form,dialog) => {
    if (!dialogItem) return;
    const name = $("[data-bb-files-rename-input]").value.trim();
    if (!name) return;
    dialogItem.name = name;
    dialog.close();render();notify("Ad değiştirildi (demo).");
  });
  connectDialog("[data-bb-files-move-dialog]","[data-bb-files-move-form]",(_form,dialog) => {
    if (!dialogItem) return;
    dialogItem.parent = $("[data-bb-files-move-target]").value;
    dialog.close();render();notify("Öğe hedef klasöre taşındı (demo).");
  });
  $("[data-bb-files-share-toggle]").addEventListener("click",() => {
    if (!dialogItem) return;
    dialogItem.shared = !dialogItem.shared;
    $("[data-bb-files-share-state]").textContent = dialogItem.shared ? "Paylaşılıyor (örnek)" : "Özel (örnek)";
    $("[data-bb-files-share-toggle]").textContent = dialogItem.shared ? "Paylaşımı kapat (demo)" : "Paylaşımı aç (demo)";
    render();
    notify("Paylaşım görünümü değiştirildi. Gerçek erişim izni verilmedi.");
  });
  $("[data-bb-files-share-copy]").addEventListener("click",async () => {
    if (!dialogItem) return;
    const value = location.href.split("#")[0] + "#file-" + encodeURIComponent(dialogItem.id);
    try {
      await navigator.clipboard.writeText(value);
      notify("Örnek bağlantı kopyalandı; gerçek erişim sağlamaz.");
    } catch (_) {
      const input = $("[data-bb-files-share-link]");
      input.value = value;
      input.focus();input.select();
      notify("Bağlantıyı seçip kopyalayabilirsiniz. Örnek bağlantı gerçek erişim sağlamaz.");
    }
  });
  document.querySelector("[data-bb-files-upload-open]").addEventListener("click",() => {
    droppedFiles = [];renderQueue();$("[data-bb-files-upload-dialog]").showModal();
  });
  const uploadField = $("[data-bb-files-upload-input]");
  const uploadZone = $("[data-bb-files-dropzone]");
  function queueFiles(incoming) {
    const available = Array.from(incoming || []).filter(file => file.size <= 25 * 1000 * 1000);
    droppedFiles.push(...available);
    renderQueue();
    notify(available.length + " dosya yükleme kuyruğuna alındı (demo, sunucuya gönderilmez).");
  }
  function renderQueue() {
    const queue = $("[data-bb-files-upload-queue]");
    queue.replaceChildren();
    droppedFiles.forEach((file,index) => {
      const line = element("li","bb-files-queue-item");
      line.append(element("span","",file.name + " · " + fmtSize(file.size)));
      const remove = action("Kaldır",null,"btn bb-btn-secondary btn-sm");
      remove.addEventListener("click",() => { droppedFiles.splice(index,1);renderQueue(); });
      line.append(remove);queue.append(line);
    });
    $("[data-bb-files-upload-count]").textContent = droppedFiles.length + " dosya seçildi";
    $("[data-bb-files-upload-save]").disabled = !droppedFiles.length;
  }
  uploadField.addEventListener("change",() => { queueFiles(uploadField.files);uploadField.value = ""; });
  ["dragover","dragenter"].forEach(type => uploadZone.addEventListener(type,event => {
    event.preventDefault(); uploadZone.dataset.dragover = "true";
  }));
  uploadZone.addEventListener("dragleave",() => { uploadZone.dataset.dragover = "false"; });
  uploadZone.addEventListener("drop",event => {
    event.preventDefault();uploadZone.dataset.dragover = "false";queueFiles(event.dataTransfer.files);
  });
  $("[data-bb-files-upload-save]").addEventListener("click",() => {
    const amount = droppedFiles.length;
    droppedFiles.forEach((file,index) => {
      const ext = file.name.split(".").pop().toUpperCase();
      files.push({id:"local-" + Date.now() + "-" + index,parent:state.folder,name:file.name,type:ext,size:file.size,owner:0,modified:13,shared:false,starred:false,trash:false});
    });
    $("[data-bb-files-upload-dialog]").close();
    droppedFiles = [];
    render();notify(amount + " dosyanın yalnızca adı ve boyutu bu demo listeye eklendi; içerik yüklenmedi.");
  });
  $$("[data-bb-files-dialog-close]").forEach(button => {
    const dialog = button.closest("dialog");
    if (!dialog || dialog.matches("[data-bb-files-new-folder-dialog],[data-bb-files-rename-dialog],[data-bb-files-move-dialog]")) return;
    button.addEventListener("click",() => dialog.close());
  });
  render();
})();