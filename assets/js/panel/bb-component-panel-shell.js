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

  var componentTitles = {
    "accordion": "Accordion",
    "alerts": "Alerts",
    "badges": "Badges",
    "breadcrumb": "Breadcrumb",
    "bullet": "Bullet",
    "buttongroup": "Button Group",
    "buttons": "Buttons",
    "cards": "Cards",
    "carousel": "Carousel",
    "chips": "Chips",
    "collapse": "Collapse",
    "countup": "Countup",
    "datepicker": "Datetime",
    "dialer": "Dialer",
    "drawer": "Drawer",
    "dropdowns": "Dropdowns",
    "empty-state": "Empty State",
    "floating-labels": "Floating Labels",
    "formrepeater": "Form Repeater",
    "forms": "Forms",
    "indicator": "Indicator",
    "input-group": "Input Group",
    "inputmask": "Input Mask",
    "lightbox": "Lightbox",
    "menu": "Menu",
    "modal": "Modal",
    "overlay": "Overlay",
    "pagination": "Pagination",
    "password-meter": "Password Meter",
    "popover": "Popover",
    "progress": "Progress",
    "pulse": "Pulse",
    "rating": "Rating",
    "ribbons": "Ribbons",
    "scroll": "Scroll",
    "separator": "Separator",
    "spinner": "Spinner",
    "sticky": "Sticky",
    "symbol": "Symbol",
    "tables": "Tables",
    "tabs": "Tabs",
    "tiny-slider-advanced": "Tiny Slider / Advanced",
    "tiny-slider-thumbnails": "Tiny Slider / Thumbnails",
    "tiny-slider": "Tiny Slider",
    "toast": "Toast",
    "tooltips": "Tooltips",
    "typography": "Typography",
    "tokens": "Core Tokens"
  };
  var title = componentTitles[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });

  var componentCatalog = [
    ["tokens.html","Core Tokens"],
    ["accordion.html","Accordion"],["alerts.html","Alerts"],["badges.html","Badges"],["breadcrumb.html","Breadcrumb"],
    ["bullet.html","Bullet"],["buttongroup.html","Button Group"],["buttons.html","Buttons"],["cards.html","Cards"],
    ["carousel.html","Carousel"],["chips.html","Chips"],["collapse.html","Collapse"],["countup.html","Countup"],
    ["datepicker.html","Datetime"],["dialer.html","Dialer"],["drawer.html","Drawer"],["dropdowns.html","Dropdowns"],
    ["empty-state.html","Empty State"],["floating-labels.html","Floating Labels"],["formrepeater.html","Form Repeater"],["forms.html","Forms"],
    ["indicator.html","Indicator"],["input-group.html","Input Group"],["inputmask.html","Input Mask"],
    ["lightbox.html","Lightbox"],["menu.html","Menu"],["modal.html","Modal"],["overlay.html","Overlay"],
    ["pagination.html","Pagination"],["password-meter.html","Password Meter"],["popover.html","Popover"],
    ["progress.html","Progress"],["pulse.html","Pulse"],["rating.html","Rating"],
    ["ribbons.html","Ribbons"],["scroll.html","Scroll"],["separator.html","Separator"],["spinner.html","Spinner"],
    ["sticky.html","Sticky"],["symbol.html","Symbol"],["tables.html","Tables"],["tabs.html","Tabs"],
    ["tiny-slider-advanced.html","Tiny Slider / Advanced"],["tiny-slider-thumbnails.html","Tiny Slider / Thumbnails"],["tiny-slider.html","Tiny Slider"],
    ["toast.html","Toast"],["tooltips.html","Tooltips"],["typography.html","Typography"]
  ];

  function renderComponentSidebar() {
    return componentCatalog.map(function (entry) {
      var active = entry[0] === file;
      return '<div class="bb-menu-item">' +
        '<a class="bb-menu-link' + (active ? ' active' : '') + '" href="' + entry[0] + '"' +
        (active ? ' aria-current="page"' : '') + '>' +
        '<span class="bb-menu-bullet" aria-hidden="true"></span>' +
        '<span class="bb-menu-title">' + entry[1] + '</span>' +
        '</a></div>';
    }).join("");
  }


  function normalizeStylesheetOrder() {
    var mainTheme = document.head && document.head.querySelector('link[rel="stylesheet"][href*="/assets/css/main.css"]');
    if (mainTheme) document.head.appendChild(mainTheme);
  }

  normalizeStylesheetOrder();

  function removeDemoControls() {
    var selectors = [
      "[data-bb-theme]",
      "[data-bb-theme-btn]",
      "#bbThemeToggle",
      "#bb_theme_toggle",
      "#bb_theme_light",
      "#bb_theme_dark",
      "#bbDensityToggle",
      "#btnThemeLight",
      "#btnThemeDark",
      "#btnLight",
      "#btnDark"
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
        var safeWrapper = block && block !== body && !block.matches("main, .container, .container-fluid, [class*='col-']") && !block.classList.contains("bb-card") && !block.closest(".bb-card");
        var meaningfulChildren = block ? Array.from(block.children).filter(function (child) {
          return child !== heading && (child.textContent || "").trim();
        }) : [];
        if (safeWrapper && meaningfulChildren.length === 0) block.remove();
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
    '<aside class="bb-sidebar" id="bb_panel_sidebar" aria-label="Panel sidebar">',
      '<div class="bb-sidebar-header">',
        '<a class="bb-sidebar-logo" href="../panel/dashboard.html" aria-label="Bulbulustur panel ana sayfa"><span class="bb-panel-brand-text">Bulbulustur</span></a>',
        '<button class="bb-panel-icon-button d-none d-lg-inline-flex" type="button" data-bb-panel-sidebar-collapse aria-label="Collapse sidebar" aria-pressed="false" title="Collapse / expand"><span class="material-symbols-outlined" aria-hidden="true">left_panel_close</span></button>',
        '<button class="bb-panel-icon-button d-lg-none" type="button" data-bb-panel-sidebar-close aria-label="Close menu"><span class="material-symbols-outlined" aria-hidden="true">close</span></button>',
      '</div>',
      '<div class="bb-sidebar-body">',
        '<nav class="bb-menu bb-menu-column bb-menu-hover-bg bb-menu-active-bg" data-bb-panel-menu aria-label="Component navigation">',
          '<div class="bb-menu-section">COMPONENTS</div>',
          renderComponentSidebar(),
        '</nav>',
      '</div>',
      '<div class="bb-sidebar-footer"><a class="bb-panel-sidebar-docs" href="../panel/support-center.html"><span class="material-symbols-outlined" aria-hidden="true">support_agent</span><span>Get Support</span></a></div>',
    '</aside>',
    '<button class="bb-panel-backdrop" type="button" data-bb-panel-backdrop aria-label="Close menu" aria-hidden="true" tabindex="-1"></button>',
    '<div class="bb-shell">',
      '<header class="bb-shell-header">',
        '<div class="bb-shell-header-inner">',
          '<div class="bb-shell-header-left">',
            '<button class="bb-panel-icon-button d-lg-none" type="button" data-bb-panel-sidebar-toggle aria-controls="bb_panel_sidebar" aria-expanded="false" aria-label="Open menu"><span class="material-symbols-outlined" aria-hidden="true">menu</span></button>',
            '<span class="bb-panel-brand-text">Bulbulustur / Component Catalog</span>',
          '</div>',
          '<div class="bb-shell-header-right bb-panel-header-actions">',
            '<button class="bb-panel-icon-button" type="button" id="bb_panel_theme_toggle" aria-label="Toggle light or dark theme"><span class="material-symbols-outlined" aria-hidden="true">contrast</span></button>',
            '<div class="bb-panel-overlay-host" data-bb-panel-popup>',
              '<button class="bb-panel-icon-button" type="button" data-bb-panel-popup-toggle aria-controls="bb_component_user_pop" aria-label="User menu"><span class="bb-symbol bb-symbol-35"><img src="../../assets/media/avatars/300-3.jpg" alt="Demo user avatar"></span></button>',
              '<div id="bb_component_user_pop" class="bb-panel-popover bb-panel-user-menu" data-bb-panel-popup-content hidden>',
                '<div class="bb-panel-user-summary"><span class="bb-symbol size-50 is-circle"><img src="../../assets/media/avatars/300-3.jpg" alt=""></span><span class="bb-panel-user-info"><span class="bb-panel-user-name">Demo User <span class="bb-badge bb-badge-success">Demo</span></span><small>demo@example.com</small></span></div>',
                '<div class="bb-panel-user-group"><a class="bb-panel-user-item" href="../panel/profile.html"><span>Prifilee</span></a><a class="bb-panel-user-item" href="../panel/account.html"><span>Account Settings</span></a></div>',
                '<div class="bb-panel-user-group"><button class="bb-panel-user-item" type="button" id="bb_panel_user_theme"><span>Appearance</span><span class="bb-panel-user-meta"><span data-bb-panel-user-mode-text>Light</span><span class="material-symbols-outlined" data-bb-panel-user-mode-icon aria-hidden="true">light_mode</span></span></button><div class="bb-panel-user-item"><span>Languages</span><span class="bb-panel-user-meta">Türkçe</span></div></div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',
      '</header>',
      '<!--::Main--><main class="bb-main">',
        '<div class="bb-main-inner">',
          '<div class="bb-toolbar bb-component-toolbar">',
            '<div class="bb-panel-content-container">',
              '<div class="bb-toolbar-row">',
                '<div class="bb-toolbar-col-left">',
                  '<h1 class="bb-page-title"></h1>',
                  '<nav class="bb-breadcrumb" aria-label="Breadcrumb"><ol class="breadcrumb mb-0"><li class="breadcrumb-item"><a href="../panel/dashboard.html">Panel</a></li><li class="breadcrumb-item">Components</li><li class="breadcrumb-item active" aria-current="page"></li></ol></nav>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
          '<section class="bb-content bb-component-showcase" data-bb-component-showcase>',
            '<div class="bb-panel-content-container bb-component-showcase-content"></div>',
          '</section>',
        '</div>',
      '</main><!--/::Main-->',
      '<!--::Footer--><footer class="bb-shell-footer bb-footer"><div class="bb-footer-bar"><div class="bb-footer-inner"><div class="bb-footer-left"><span>2026 ©</span><a class="bb-footer-brand" href="../panel/dashboard.html">Bulbulustur</a></div><div class="bb-footer-right"><span class="bb-footer-link">Core component demo / Panel shell</span></div></div></div></footer><!--/::Footer-->',
    '</div>'
  ].join("");

  body.appendChild(app);

  var contentHost = app.querySelector(".bb-component-showcase-content");
  var demoRoot = document.createElement("div");
  demoRoot.className = "bb-component-demo-root";
  preserved.forEach(function (node) {
    demoRoot.appendChild(node);
  });
  contentHost.appendChild(demoRoot);

  function removeUtilityClasses(element, pattern) {
    Array.from(element.classList).forEach(function (name) {
      if (pattern.test(name)) element.classList.remove(name);
    });
  }

  function unwrapElement(element) {
    var parent = element.parentNode;
    if (!parent) return;
    while (element.firstChild) parent.insertBefore(element.firstChild, element);
    element.remove();
  }

  demoRoot.querySelectorAll(":scope > main").forEach(function (main) {
    unwrapElement(main);
  });

  demoRoot.querySelectorAll(
    ":scope > .container, :scope > .container-fluid, :scope > .container-sm, :scope > .container-md, :scope > .container-lg, :scope > .container-xl, :scope > .container-xxl, :scope > .demo-shell"
  ).forEach(function (wrapper) {
    Array.from(wrapper.classList).forEach(function (name) {
      if (/^container(?:-(?:fluid|sm|md|lg|xl|xxl))?$/.test(name) || name === "demo-shell") {
        wrapper.classList.remove(name);
      }
    });
    removeUtilityClasses(wrapper, /^(?:p|px|py|pt|pb|ps|pe|m|mx|my|mt|mb|ms|me)-[0-5]$/);
    wrapper.classList.remove("min-vh-100", "bb-main");
    wrapper.classList.add("bb-component-showcase-root");
  });

  var directElements = Array.from(demoRoot.children);
  if (directElements.length === 1 &&
      directElements[0].tagName === "DIV" &&
      !directElements[0].classList.contains("bb-app") &&
      !directElements[0].classList.contains("row")) {
    directElements[0].classList.add("bb-component-showcase-root");
  }

  function normalizeDemoCards(root) {
    root.querySelectorAll(".card, .bb-card").forEach(function (card) {
      var hadLegacyPadding = Array.from(card.classList).some(function (name) {
        return /^(?:p|px|py|pt|pb|ps|pe)-[0-5]$/.test(name);
      });

      card.classList.add("bb-card");
      card.classList.remove("shadow", "shadow-sm", "shadow-lg");
      removeUtilityClasses(card, /^(?:p|px|py|pt|pb|ps|pe|mb)-[0-5]$/);

      card.querySelectorAll(":scope > .card-header, :scope > .bb-card-header").forEach(function (section) {
        section.classList.add("bb-card-header");
        removeUtilityClasses(section, /^(?:p|px|py|pt|pb|ps|pe)-[0-5]$/);
      });
      card.querySelectorAll(":scope > .card-body, :scope > .bb-card-body").forEach(function (section) {
        section.classList.add("bb-card-body");
        removeUtilityClasses(section, /^(?:p|px|py|pt|pb|ps|pe)-[0-5]$/);
      });
      card.querySelectorAll(":scope > .card-footer, :scope > .bb-card-footer").forEach(function (section) {
        section.classList.add("bb-card-footer");
        removeUtilityClasses(section, /^(?:p|px|py|pt|pb|ps|pe)-[0-5]$/);
      });
      card.querySelectorAll(".card-title, .bb-card-title").forEach(function (titleElement) {
        titleElement.classList.add("bb-card-title");
      });

      var hasCanonicalSection = card.querySelector(":scope > .bb-card-header, :scope > .bb-card-body, :scope > .bb-card-footer");
      if (!hasCanonicalSection && hadLegacyPadding) {
        var bodySection = document.createElement("div");
        bodySection.className = "bb-card-body";
        while (card.firstChild) bodySection.appendChild(card.firstChild);
        card.appendChild(bodySection);
      }
    });
  }

  normalizeDemoCards(demoRoot);

  function removeLegacyPageIntro() {
    var root = demoRoot.querySelector(".bb-component-showcase-root") || demoRoot;
    var first = root.firstElementChild;
    if (!first) return;

    if (slug === "ribbons" && first.classList.contains("mb-4")) {
      first.remove();
      return;
    }

    if (slug === "tiny-slider-advanced" && first.querySelector("h4")) {
      first.remove();
    }
  }

  removeLegacyPageIntro();

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
    .then(function () { return loadScript(base + "bb-panel-header.js"); })
    .then(function () { return loadScript(base + "bb-panel-user.js"); })
    .then(function () { return loadScript(base + "bb-panel-menu.js"); })
    .catch(function () {
      var note = document.createElement("div");
      note.className = "alert alert-warning";
      note.textContent = "A panel behavior script could not be loaded.";
      contentHost.prepend(note);
    });
}());
