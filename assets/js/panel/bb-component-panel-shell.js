/* Component catalog adapter — PANEL ONLY.
   Keeps modules/components/*.html as the single demo source and presents them inside the panel shell. */
(function () {
  "use strict";

  var body = document.body;
  if (!body || body.hasAttribute("data-bb-component-panel-ready")) return;

  var path = window.location.pathname;
  if (path.indexOf("/modules/components/") === -1) return;

  var file = path.split("/").pop() || "component.html";
  var slug = file.replace(/\.html$/i, "");
  var pageHeading = body.querySelector("h1");
  var title = pageHeading && pageHeading.textContent.trim()
    ? pageHeading.textContent.trim()
    : (document.title || slug).replace(/\s*[|–—-].*$/, "").trim();

  function removeDemoControls() {
    var selectors = [
      "[data-bb-theme]",
      "[data-bb-theme-btn]",
      "#bbThemeToggle",
      "#bbDensityToggle",
      "#btnThemeLight",
      "#btnThemeDark"
    ];

    selectors.forEach(function (selector) {
      body.querySelectorAll(selector).forEach(function (element) {
        var group = element.closest(".btn-group");
        if (group && group.querySelector(selector)) {
          group.remove();
          return;
        }

        var controls = element.closest(".d-flex, .bb-toolbar, header");
        if (controls && controls !== body && controls.querySelectorAll("button, a").length <= 4) {
          controls.remove();
          return;
        }

        element.remove();
      });
    });

    var heading = body.querySelector("h1");
    if (heading) {
      var toolbar = heading.closest(".d-flex.justify-content-between, .d-flex.flex-wrap.justify-content-between, header, .bb-toolbar");
      if (toolbar && !toolbar.closest(".bb-card")) {
        toolbar.remove();
      } else {
        var block = heading.parentElement;
        if (block && block !== body && !block.classList.contains("bb-card") && !block.closest(".bb-card")) block.remove();
        else heading.remove();
      }
    }

    body.querySelectorAll(".d-flex, .btn-group").forEach(function (element) {
      if (!element.children.length && !(element.textContent || "").trim()) element.remove();
    });

    body.querySelectorAll(".text-body-secondary.small, .text-muted.small").forEach(function (note) {
      var text = (note.textContent || "").toLocaleLowerCase("tr-TR");
      if (text.indexOf("theme switcher") !== -1 || text.indexOf("density toggle") !== -1 || text.indexOf("component test") !== -1) {
        note.remove();
      }
    });
  }

  removeDemoControls();

  var preserved = [];
  Array.from(body.childNodes).forEach(function (node) {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "SCRIPT") return;
    preserved.push(node);
  });

  body.replaceChildren();
  body.className = "";
  body.setAttribute("data-bb-component-panel-ready", "true");

  var app = document.createElement("div");
  app.className = "bb-app bb-panel";
  app.setAttribute("data-bb-panel", "");
  app.setAttribute("data-bb-sidebar-open", "false");
  app.setAttribute("data-bb-sidebar-collapsed", "false");
  app.setAttribute("data-bb-panel-default-page", "component-" + slug);

  app.innerHTML = [
    '<aside class="bb-sidebar" id="bb_panel_sidebar" aria-label="Panel kenar menüsü">',
      '<div class="bb-sidebar-header">',
        '<a class="bb-sidebar-logo" href="../panel/dashboard.html" aria-label="Bulbulustur panel ana sayfa"><span class="bb-panel-brand-text">Bulbulustur</span></a>',
        '<button class="bb-panel-icon-button d-none d-lg-inline-flex" type="button" data-bb-panel-sidebar-collapse aria-label="Kenar çubuğunu daralt" aria-pressed="false" title="Daralt / genişlet"><span class="material-symbols-outlined" aria-hidden="true">left_panel_close</span></button>',
        '<button class="bb-panel-icon-button d-lg-none" type="button" data-bb-panel-sidebar-close aria-label="Menüyü kapat"><span class="material-symbols-outlined" aria-hidden="true">close</span></button>',
      '</div>',
      '<div class="bb-sidebar-body">',
        '<nav class="bb-menu bb-menu-column bb-menu-hover-bg bb-menu-active-bg bb-menu-sub-indention" data-bb-panel-menu aria-label="Panel gezinme">',
          '<div class="bb-menu-section">GÖSTERGE PANELLERİ</div>',
          '<div class="bb-menu-item"><a class="bb-menu-link" href="../panel/dashboard.html"><span class="bb-menu-icon"><span class="material-symbols-outlined" aria-hidden="true">dashboard</span></span><span class="bb-menu-title">Gösterge Paneli</span></a></div>',
        '</nav>',
      '</div>',
      '<div class="bb-sidebar-footer"><a class="bb-panel-sidebar-docs" href="buttons.html"><span class="material-symbols-outlined" aria-hidden="true">widgets</span><span>Components</span></a></div>',
    '</aside>',
    '<button class="bb-panel-backdrop" type="button" data-bb-panel-backdrop aria-label="Menüyü kapat" aria-hidden="true" tabindex="-1"></button>',
    '<div class="bb-shell">',
      '<header class="bb-shell-header">',
        '<div class="bb-shell-header-inner">',
          '<div class="bb-shell-header-left">',
            '<button class="bb-panel-icon-button d-lg-none" type="button" data-bb-panel-sidebar-toggle aria-controls="bb_panel_sidebar" aria-expanded="false" aria-label="Menüyü aç"><span class="material-symbols-outlined" aria-hidden="true">menu</span></button>',
            '<span class="bb-panel-brand-text">Bulbulustur / Component Kataloğu</span>',
          '</div>',
          '<div class="bb-shell-header-right">',
            '<button class="bb-panel-icon-button" type="button" id="bb_panel_theme_toggle" aria-label="Açık veya koyu temayı değiştir"><span class="material-symbols-outlined" aria-hidden="true">contrast</span></button>',
            '<span class="bb-symbol bb-symbol-35" aria-label="Örnek kullanıcı"><img src="../../assets/media/avatars/300-3.jpg" alt="Örnek kullanıcı avatarı"></span>',
          '</div>',
        '</div>',
      '</header>',
      '<main class="bb-main">',
        '<div class="bb-main-inner">',
          '<div class="bb-toolbar">',
            '<div class="bb-panel-content-container">',
              '<div class="bb-toolbar-row">',
                '<div class="bb-toolbar-col-left">',
                  '<h1 class="bb-page-title"></h1>',
                  '<nav class="bb-breadcrumb" aria-label="İçerik yolu"><ol class="breadcrumb mb-0"><li class="breadcrumb-item"><a href="../panel/dashboard.html">Panel</a></li><li class="breadcrumb-item">Components</li><li class="breadcrumb-item active" aria-current="page"></li></ol></nav>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
          '<section class="bb-content bb-component-showcase" data-bb-component-showcase>',
            '<div class="bb-panel-content-container bb-component-showcase-content"></div>',
          '</section>',
        '</div>',
      '</main>',
      '<footer class="bb-shell-footer bb-footer"><div class="bb-footer-bar"><div class="bb-footer-inner"><div class="bb-footer-left"><span>2026 ©</span><a class="bb-footer-brand" href="../panel/dashboard.html">Bulbulustur</a></div><div class="bb-footer-right"><span class="bb-footer-link">Core component demo / Panel shell</span></div></div></div></footer>',
    '</div>'
  ].join("");

  body.appendChild(app);

  var contentHost = app.querySelector(".bb-component-showcase-content");
  preserved.forEach(function (node) {
    contentHost.appendChild(node);
  });

  contentHost.querySelectorAll(":scope > .container, :scope > main > .container").forEach(function (container) {
    container.classList.remove("container");
    container.classList.add("bb-component-showcase-root");
  });

  var pageTitle = app.querySelector(".bb-page-title");
  var breadcrumbCurrent = app.querySelector(".breadcrumb-item.active");
  pageTitle.textContent = title;
  breadcrumbCurrent.textContent = title;
  document.title = "Bulbulustur — " + title;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      var script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  var base = "../../assets/js/panel/";
  Promise.resolve()
    .then(function () { return loadScript(base + "bb-panel.js"); })
    .then(function () { return loadScript(base + "bb-panel-theme.js"); })
    .then(function () { return loadScript(base + "bb-panel-menu.js"); })
    .catch(function () {
      var note = document.createElement("div");
      note.className = "alert alert-warning";
      note.textContent = "Panel davranış dosyalarından biri yüklenemedi.";
      contentHost.prepend(note);
    });
}());
