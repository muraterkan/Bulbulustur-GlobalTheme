/* Faz 7 — menu tree demo page routing (static local HTML) */
(function () {
  "use strict";
  var panel = document.querySelector("[data-bb-panel]");
  if (!panel) return;
  var demoRoutes = {"contacts-list":"kisiler.html","users-roles":"roller.html","users-permissions":"yetkiler.html","subscription-overview":"abonelik-detay.html","invoice-list":"fatura-detay.html"};
  var requestedPage = new URLSearchParams(window.location.search).get("page");
  if (/\/sayfalar\.html$/.test(window.location.pathname) && requestedPage && demoRoutes[requestedPage]) {
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
    "auth-general-signin": {title:"Sign In", group:"Authentication", section:"PAGES"},
    "auth-general-signup": {title:"Sign Up", group:"Authentication", section:"PAGES"},
    "auth-general-reset": {title:"Reset Password", group:"Authentication", section:"PAGES"},
    "corporate-about": {title:"About", group:"Corporate", section:"PAGES"},
    "corporate-contact": {title:"Contact", group:"Corporate", section:"PAGES"},
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
    "widgets-tables": {title:"Tables", group:"Widget'lar", section:"PAGES"},
    "widgets-lists": {title:"Lists", group:"Widget'lar", section:"PAGES"},
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
    "invoice-list": {title:"Invoices", group:"Invoice Management", section:"APPLICATIONS"},
    "files-list": {title:"Files", group:"File Manager", section:"APPLICATIONS"},
    "inbox-messages": {title:"Messages", group:"Inbox", section:"APPLICATIONS"},
    "chat-conversations": {title:"Conversations", group:"Chat", section:"APPLICATIONS"},
    "calendar-overview": {title:"Overview", group:"Calendar", section:"APPLICATIONS"},
    "layout-sidebar": {title:"Sidebar", group:"Layouts", section:"LAYOUTS"},
    "layout-header": {title:"Header", group:"Layouts", section:"LAYOUTS"},
    "layout-auth": {title:"Authentication", group:"Layouts", section:"LAYOUTS"},
  };
  var id = new URLSearchParams(window.location.search).get("page") || panel.getAttribute("data-bb-panel-default-page") || "dashboard-overview";
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
