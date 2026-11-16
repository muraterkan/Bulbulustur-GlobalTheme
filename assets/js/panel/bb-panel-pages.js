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
    "profile-overview": {title:"Overview", group:"User Profile", section:"SAYFALAR"},
    "profile-projects": {title:"Projects", group:"User Profile", section:"SAYFALAR"},
    "profile-campaigns": {title:"Campaigns", group:"User Profile", section:"SAYFALAR"},
    "profile-documents": {title:"Documents", group:"User Profile", section:"SAYFALAR"},
    "profile-followers": {title:"Followers", group:"User Profile", section:"SAYFALAR"},
    "profile-activity": {title:"Activity", group:"User Profile", section:"SAYFALAR"},
    "profile-settings": {title:"Settings", group:"User Profile", section:"SAYFALAR"},
    "profile-security": {title:"Security", group:"User Profile", section:"SAYFALAR"},
    "profile-billing": {title:"Billing", group:"User Profile", section:"SAYFALAR"},
    "profile-statements": {title:"Statements", group:"User Profile", section:"SAYFALAR"},
    "profile-referrals": {title:"Referrals", group:"User Profile", section:"SAYFALAR"},
    "profile-api": {title:"API Keys", group:"User Profile", section:"SAYFALAR"},
    "profile-logs": {title:"Logs", group:"User Profile", section:"SAYFALAR"},
    "account-overview": {title:"Overview", group:"Account", section:"SAYFALAR"},
    "account-settings": {title:"Settings", group:"Account", section:"SAYFALAR"},
    "account-security": {title:"Security", group:"Account", section:"SAYFALAR"},
    "account-billing": {title:"Billing", group:"Account", section:"SAYFALAR"},
    "auth-corporate-signin": {title:"Sign In", group:"Authentication", section:"SAYFALAR"},
    "auth-corporate-signup": {title:"Sign Up", group:"Authentication", section:"SAYFALAR"},
    "auth-corporate-reset": {title:"Reset Password", group:"Authentication", section:"SAYFALAR"},
    "auth-general-signin": {title:"Sign In", group:"Authentication", section:"SAYFALAR"},
    "auth-general-signup": {title:"Sign Up", group:"Authentication", section:"SAYFALAR"},
    "auth-general-reset": {title:"Reset Password", group:"Authentication", section:"SAYFALAR"},
    "corporate-about": {title:"About", group:"Corporate", section:"SAYFALAR"},
    "corporate-contact": {title:"Contact", group:"Corporate", section:"SAYFALAR"},
    "social-feed": {title:"Feed", group:"Social", section:"SAYFALAR"},
    "social-activity": {title:"Activity", group:"Social", section:"SAYFALAR"},
    "blog-posts": {title:"Posts", group:"Blog", section:"SAYFALAR"},
    "blog-details": {title:"Post Details", group:"Blog", section:"SAYFALAR"},
    "faq-overview": {title:"Overview", group:"FAQ", section:"SAYFALAR"},
    "pricing-plans": {title:"Plans", group:"Pricing", section:"SAYFALAR"},
    "careers-open": {title:"Open Positions", group:"Careers", section:"SAYFALAR"},
    "utility-404": {title:"404", group:"Utility Pages", section:"SAYFALAR"},
    "utility-500": {title:"500", group:"Utility Pages", section:"SAYFALAR"},
    "utility-maintenance": {title:"Maintenance", group:"Utility Pages", section:"SAYFALAR"},
    "widgets-tables": {title:"Tables", group:"Widget'lar", section:"SAYFALAR"},
    "widgets-lists": {title:"Lists", group:"Widget'lar", section:"SAYFALAR"},
    "projects-list": {title:"List", group:"Projects", section:"UYGULAMALAR"},
    "projects-overview": {title:"Overview", group:"Projects", section:"UYGULAMALAR"},
    "projects-create": {title:"Create", group:"Projects", section:"UYGULAMALAR"},
    "ecommerce-products": {title:"Products", group:"e-Ticaret", section:"UYGULAMALAR"},
    "ecommerce-categories": {title:"Categories", group:"e-Ticaret", section:"UYGULAMALAR"},
    "ecommerce-orders": {title:"Orders", group:"e-Ticaret", section:"UYGULAMALAR"},
    "ecommerce-order-details": {title:"Order Details", group:"e-Ticaret", section:"UYGULAMALAR"},
    "ecommerce-customers": {title:"Customers", group:"e-Ticaret", section:"UYGULAMALAR"},
    "contacts-list": {title:"List", group:"Contacts", section:"UYGULAMALAR"},
    "support-tickets": {title:"Tickets", group:"Support Center", section:"UYGULAMALAR"},
    "support-faq": {title:"FAQ", group:"Support Center", section:"UYGULAMALAR"},
    "users-list": {title:"Users", group:"User Management", section:"UYGULAMALAR"},
    "users-roles": {title:"Roles", group:"User Management", section:"UYGULAMALAR"},
    "users-permissions": {title:"Permissions", group:"User Management", section:"UYGULAMALAR"},
    "customers-list": {title:"List", group:"Customers", section:"UYGULAMALAR"},
    "customers-details": {title:"Details", group:"Customers", section:"UYGULAMALAR"},
    "subscription-overview": {title:"Overview", group:"Subscription", section:"UYGULAMALAR"},
    "invoice-list": {title:"Invoices", group:"Invoice Management", section:"UYGULAMALAR"},
    "files-list": {title:"Files", group:"File Manager", section:"UYGULAMALAR"},
    "inbox-messages": {title:"Messages", group:"Inbox", section:"UYGULAMALAR"},
    "chat-conversations": {title:"Conversations", group:"Chat", section:"UYGULAMALAR"},
    "calendar-overview": {title:"Overview", group:"Calendar", section:"UYGULAMALAR"},
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
