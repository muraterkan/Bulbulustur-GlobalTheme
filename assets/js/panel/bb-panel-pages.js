/* Faz 7 — menu tree demo page routing (static local HTML) */
(function () {
  "use strict";
  var panel = document.querySelector("[data-bb-panel]");
  if (!panel) return;
  var demoRoutes = {"corporate-team":"team.html","widgets-statistics":"statistics.html","widgets-charts":"charts.html","dashboard-channels":"channels.html","footer-draugr":"product-draugr.html","footer-about":"about.html","corporate-about":"about.html","footer-integrations":"integrations.html","posb-quick-sale":"pos-system.html","footer-posb":"product-posb.html","contacts-list":"contacts.html","calendar-overview":"calendar.html","files-list":"files.html","cart":"cart.html","subscription-cart":"cart.html","draugr-cart":"cart.html?product=draugr&plan=basic","posb-cart":"cart.html?product=posb&plan=basic","checkout":"checkout.html","subscription-checkout":"checkout.html","draugr-checkout":"checkout.html?product=draugr","posb-checkout":"checkout.html?product=posb","posx-checkout":"checkout.html?product=posb","users-list":"users.html","users-roles":"roles.html","users-permissions":"permissions.html","subscription-overview":"subscription-details.html","invoice-list":"invoice-details.html","inbox-messages":"chat.html","chat-conversations":"chat.html","layout-blank":"blank-app.html"};
  var requestedPage = new URLSearchParams(window.location.search).get("page");
  if (/\/pages\.html$/.test(window.location.pathname) && requestedPage && demoRoutes[requestedPage]) {
    window.location.replace(demoRoutes[requestedPage]);
    return;
  }
  panel.querySelectorAll("a[data-bb-panel-page]").forEach(function (link) {
    var destination = demoRoutes[link.getAttribute("data-bb-panel-page")];
    if (destination) link.setAttribute("href", destination);
  });
  var pages = {
    "dashboard-overview": {title:"Overview", group:"Dashboard", section:"DASHBOARDS"},
    "dashboard-analytics": {title:"Analitik", group:"Dashboard", section:"DASHBOARDS"},
    "dashboard-channels": {title:"Channels", group:"Gösterge Paneli", section:"DASHBOARDS"},
    "footer-about": {title:"About", group:"Ecosystem", section:"PAGES"},
    "footer-integrations": {title:"Integration Center", group:"Ecosystem", section:"PAGES"},
    "footer-draugr": {title:"Draugr", group:"Ecosystem", section:"PAGES"},
    "footer-posb": {title:"PosB", group:"Ecosystem", section:"PAGES"},
    "product-draugr": {title:"Draugr", group:"Hizmetler", section:"PAGES"},
    "product-posb": {title:"PosB", group:"Hizmetler", section:"PAGES"},
    "draugr-dashboard": {title:"Dashboard", group:"Draugr", section:"DRAUGR"},
    "draugr-storefront": {title:"Vitrin", group:"Draugr", section:"DRAUGR"},
    "draugr-navigation": {title:"Categories & Navigasyon", group:"Draugr", section:"DRAUGR"},
    "draugr-content": {title:"Pages & İçerik", group:"Draugr", section:"DRAUGR"},
    "draugr-theme": {title:"Tema & View Mode", group:"Draugr", section:"DRAUGR"},
    "draugr-domain": {title:"Domain & SEO", group:"Draugr", section:"DRAUGR"},
    "draugr-localization": {title:"Dil & Yerelleştirme", group:"Draugr", section:"DRAUGR"},
    "draugr-settings": {title:"Channel Settings", group:"Draugr", section:"DRAUGR"},
    "draugr-subscription": {title:"Subscription", group:"Draugr", section:"DRAUGR"},
    "posb-dashboard": {title:"Dashboard", group:"PosB", section:"PosB"},
    "posb-quick-sale": {title:"Quick Sale", group:"PosB", section:"PosB"},
    "posb-branches": {title:"Branches", group:"PosB / Branch & Kasa", section:"PosB"},
    "posb-registers": {title:"Cash Registers", group:"PosB / Branch & Kasa", section:"PosB"},
    "posb-shifts": {title:"Vardiya & Gün", group:"PosB / Branch & Kasa", section:"PosB"},
    "posb-invoices": {title:"Invoices", group:"PosB / Invoice", section:"PosB"},
    "posb-invoice-settings": {title:"Invoice Settings", group:"PosB / Invoice", section:"PosB"},
    "posb-warehouses": {title:"Warehouses", group:"PosB / Stock & Transfer", section:"PosB"},
    "posb-stock": {title:"Stock", group:"PosB / Stock & Transfer", section:"PosB"},
    "posb-transfers": {title:"Transferler", group:"PosB / Stock & Transfer", section:"PosB"},
    "posb-customers": {title:"Customerler", group:"PosB / Customer & Supplier", section:"PosB"},
    "posb-suppliers": {title:"Suppliers", group:"PosB / Customer & Supplier", section:"PosB"},
    "profile-overview": {title:"Overview", group:"User Profile", section:"PAGES"},
    "profile-projects": {title:"Projects", group:"User Profile", section:"PAGES"},
    "profile-campaigns": {title:"Campaigns", group:"User Profile", section:"PAGES"},
    "profile-documents": {title:"Documents", group:"User Profile", section:"PAGES"},
    "profile-followers": {title:"Followers", group:"User Profile", section:"PAGES"},
    "profile-activity": {title:"Activity", group:"User Profile", section:"PAGES"},
    "profile-settings": {title:"Settings", group:"User Profile", section:"PAGES"},
    "profile-security": {title:"Security", group:"User Profile", section:"PAGES"},
    "profile-billing": {title:"Billing", group:"User Profile", section:"PAGES"},
    "profile-statements": {title:"Statements", group:"User Profile", section:"PAGES"},
    "profile-referrals": {title:"Referrals", group:"User Profile", section:"PAGES"},
    "profile-api": {title:"API Keys", group:"User Profile", section:"PAGES"},
    "profile-logs": {title:"Logs", group:"User Profile", section:"PAGES"},
    "account-overview": {title:"Overview", group:"Account", section:"PAGES"},
    "account-settings": {title:"Settings", group:"Account", section:"PAGES"},
    "account-security": {title:"Security", group:"Account", section:"PAGES"},
    "account-billing": {title:"Billing", group:"Account", section:"PAGES"},
    "auth-corporate-signin": {title:"Sign In", group:"Authentication", section:"PAGES"},
    "auth-corporate-signup": {title:"Sign Up", group:"Authentication", section:"PAGES"},
    "auth-corporate-reset": {title:"Reset Password", group:"Authentication", section:"PAGES"},
    "auth-creative-signin": {title:"Sign In", group:"Authentication / Creative", section:"PAGES"},
    "auth-creative-signup": {title:"Sign Up", group:"Authentication / Creative", section:"PAGES"},
    "auth-creative-reset": {title:"Reset Password", group:"Authentication / Creative", section:"PAGES"},
    "corporate-about": {title:"About", group:"Corporate", section:"PAGES"},
    "corporate-contact": {title:"Contact", group:"Corporate", section:"PAGES"},
    "corporate-team": {title:"Team", group:"Corporate", section:"PAGES"},
    "social-feed": {title:"Feed", group:"Social", section:"PAGES"},
    "social-activity": {title:"Activity", group:"Social", section:"PAGES"},
    "blog-posts": {title:"Posts", group:"Blog", section:"PAGES"},
    "blog-details": {title:"Post Details", group:"Blog", section:"PAGES"},
    "faq-overview": {title:"Overview", group:"FAQ", section:"PAGES"},
    "pricing-plans": {title:"Plans", group:"Pricing", section:"PAGES"},
    "careers-open": {title:"Open Positions", group:"Careers", section:"PAGES"},
    "utility-404": {title:"404", group:"Utility Pages", section:"PAGES"},
    "utility-500": {title:"500", group:"Utility Pages", section:"PAGES"},
    "utility-maintenance": {title:"Maintenance", group:"Utility Pages", section:"PAGES"},
    "widgets-tables": {title:"Tables", group:"Widgets", section:"PAGES"},
    "widgets-lists": {title:"Lists", group:"Widgets", section:"PAGES"},
    "widgets-statistics": {title:"Statistics", group:"Widget\s", section:"PAGES"},
    "widgets-charts": {title:"Charts", group:"Widget\s", section:"PAGES"},
    "projects-list": {title:"List", group:"Projects", section:"APPLICATIONS"},
    "projects-overview": {title:"Overview", group:"Projects", section:"APPLICATIONS"},
    "projects-create": {title:"Create", group:"Projects", section:"APPLICATIONS"},
    "ecommerce-products": {title:"Products", group:"e-Ticaret", section:"APPLICATIONS"},
    "ecommerce-categories": {title:"Categories", group:"e-Ticaret", section:"APPLICATIONS"},
    "ecommerce-orders": {title:"Orders", group:"e-Ticaret", section:"APPLICATIONS"},
    "ecommerce-order-details": {title:"Order Details", group:"e-Ticaret", section:"APPLICATIONS"},
    "ecommerce-customers": {title:"Customers", group:"e-Ticaret", section:"APPLICATIONS"},
    "contacts-list": {title:"List", group:"Contacts", section:"APPLICATIONS"},
    "support-tickets": {title:"Tickets", group:"Support Center", section:"APPLICATIONS"},
    "support-faq": {title:"FAQ", group:"Support Center", section:"APPLICATIONS"},
    "users-list": {title:"Users", group:"User Management", section:"APPLICATIONS"},
    "users-roles": {title:"Roles", group:"User Management", section:"APPLICATIONS"},
    "users-permissions": {title:"Permissions", group:"User Management", section:"APPLICATIONS"},
    "customers-list": {title:"List", group:"Customers", section:"APPLICATIONS"},
    "customers-details": {title:"Details", group:"Customers", section:"APPLICATIONS"},
    "subscription-overview": {title:"Overview", group:"Subscription", section:"APPLICATIONS"},
    "subscription-cart": {title:"Sepet", group:"Subscription", section:"APPLICATIONS"},
    "subscription-checkout": {title:"Checkout", group:"Subscription", section:"APPLICATIONS"},
    "invoice-list": {title:"Invoices", group:"Invoice Management", section:"APPLICATIONS"},
    "files-list": {title:"Files", group:"File Manager", section:"APPLICATIONS"},
    "inbox-messages": {title:"Messages", group:"Inbox", section:"APPLICATIONS"},
    "chat-conversations": {title:"Conversations", group:"Chat", section:"APPLICATIONS"},
    "calendar-overview": {title:"Overview", group:"Calendar", section:"APPLICATIONS"},
    "layout-blank": {title:"Boş Uygulama", group:"Layouts", section:"LAYOUTS"},
    "layout-sidebar": {title:"Sidebar", group:"Layouts", section:"LAYOUTS"},
    "layout-header": {title:"Header", group:"Layouts", section:"LAYOUTS"},
    "layout-auth": {title:"Authentication", group:"Layouts", section:"LAYOUTS"},
  };
  var id = new URLSearchParams(window.location.search).get("page") || panel.getAttribute("data-bb-panel-default-page") || "dashboard-overview";
  if (/\/posb\.html$/.test(window.location.pathname)) {
    var posbView = new URLSearchParams(window.location.search).get("view") || "dashboard";
    id = "posb-" + posbView;
  }
  if (/\/draugr\.html$/.test(window.location.pathname)) {
    var draugrView = new URLSearchParams(window.location.search).get("view") || "dashboard";
    id = "draugr-" + draugrView;
  }
  var selected = Object.prototype.hasOwnProperty.call(pages, id) ? pages[id] : null;
  var title = selected ? selected.title : "Page Templates";
  var heading = selected ? selected.group + " / " + selected.title : "Page Templates";
  var pageTitle = panel.querySelector(".bb-page-title");
  var cardTitle = panel.querySelector("#bb_page_card_title");
  var desc = panel.querySelector("#bb_page_empty_description");
  var crumb = panel.querySelector(".bb-breadcrumb .breadcrumb");
  if (pageTitle) pageTitle.textContent = heading;
  if (cardTitle) cardTitle.textContent = title;
  if (desc) desc.textContent = selected ? selected.section + " / " + selected.group + " / " + selected.title + " — under construction." : "Select a page from the menu.";
  if (crumb) {
    while (crumb.firstChild) crumb.removeChild(crumb.firstChild);
    [selected ? selected.section : "Pages", selected ? selected.group : "Templates", title].forEach(function (label, index, arr) {
      var li = document.createElement("li");
      li.className = index === arr.length - 1 ? "breadcrumb-item active" : "breadcrumb-item";
      li.textContent = label;
      if (index === arr.length - 1) li.setAttribute("aria-current", "page");
      crumb.appendChild(li);
    });
  }
  panel.querySelectorAll("[data-bb-panel-page]").forEach(function (link) {
    var active = link.getAttribute("data-bb-panel-page") === id;
    link.classList.toggle("active", active);
    if (active) {
      link.setAttribute("aria-current", "page");
      var parent = link.closest(".bb-menu-item");
      if (parent) parent.classList.add("active");
      var node = link.parentElement;
      while (node && node !== panel) {
        if (node.classList && node.classList.contains("bb-menu-item") && node.hasAttribute("data-bb-menu-trigger")) {
          node.classList.add("show");
          node.setAttribute("aria-expanded", "true");
          var button = node.querySelector(":scope > .bb-menu-link");
          var sub = node.querySelector(":scope > .bb-menu-sub");
          if (button) button.setAttribute("aria-expanded", "true");
          if (sub) { sub.setAttribute("aria-hidden", "false"); sub.inert = false; }
        }
        node = node.parentElement;
      }
    } else link.removeAttribute("aria-current");
  });
})();
