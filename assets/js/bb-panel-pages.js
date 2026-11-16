/* Faz 7 — menu tree demo page routing (static local HTML) */
(function () {
  "use strict";
  var panel = document.querySelector("[data-bb-panel]");
  if (!panel) return;
  var pages = {
    "dashboard-overview": {title:"Genel Bakış", group:"Gösterge Paneli", section:"GÖSTERGE PANELLERİ"},
    "dashboard-analytics": {title:"Analitik", group:"Gösterge Paneli", section:"GÖSTERGE PANELLERİ"},
    "profile-overview": {title:"Genel Bakış", group:"Kullanıcı Profili", section:"SAYFALAR"},
    "profile-projects": {title:"Projeler", group:"Kullanıcı Profili", section:"SAYFALAR"},
    "profile-campaigns": {title:"Kampanyalar", group:"Kullanıcı Profili", section:"SAYFALAR"},
    "profile-documents": {title:"Belgeler", group:"Kullanıcı Profili", section:"SAYFALAR"},
    "profile-followers": {title:"Takipçiler", group:"Kullanıcı Profili", section:"SAYFALAR"},
    "profile-activity": {title:"Etkinlik", group:"Kullanıcı Profili", section:"SAYFALAR"},
    "profile-settings": {title:"Ayarlar", group:"Kullanıcı Profili", section:"SAYFALAR"},
    "profile-security": {title:"Güvenlik", group:"Kullanıcı Profili", section:"SAYFALAR"},
    "profile-billing": {title:"Faturalandırma", group:"Kullanıcı Profili", section:"SAYFALAR"},
    "profile-statements": {title:"Ekstreler", group:"Kullanıcı Profili", section:"SAYFALAR"},
    "profile-referrals": {title:"Referanslar", group:"Kullanıcı Profili", section:"SAYFALAR"},
    "profile-api": {title:"API Anahtarları", group:"Kullanıcı Profili", section:"SAYFALAR"},
    "profile-logs": {title:"Kayıtlar", group:"Kullanıcı Profili", section:"SAYFALAR"},
    "account-overview": {title:"Genel Bakış", group:"Hesap", section:"SAYFALAR"},
    "account-settings": {title:"Ayarlar", group:"Hesap", section:"SAYFALAR"},
    "account-security": {title:"Güvenlik", group:"Hesap", section:"SAYFALAR"},
    "account-billing": {title:"Faturalandırma", group:"Hesap", section:"SAYFALAR"},
    "auth-corporate-signin": {title:"Giriş Yap", group:"Kimlik Doğrulama", section:"SAYFALAR"},
    "auth-corporate-signup": {title:"Kayıt Ol", group:"Kimlik Doğrulama", section:"SAYFALAR"},
    "auth-corporate-reset": {title:"Şifre Sıfırla", group:"Kimlik Doğrulama", section:"SAYFALAR"},
    "auth-general-signin": {title:"Giriş Yap", group:"Kimlik Doğrulama", section:"SAYFALAR"},
    "auth-general-signup": {title:"Kayıt Ol", group:"Kimlik Doğrulama", section:"SAYFALAR"},
    "auth-general-reset": {title:"Şifre Sıfırla", group:"Kimlik Doğrulama", section:"SAYFALAR"},
    "corporate-about": {title:"Hakkımızda", group:"Kurumsal", section:"SAYFALAR"},
    "corporate-contact": {title:"İletişim", group:"Kurumsal", section:"SAYFALAR"},
    "corporate-team": {title:"Ekip", group:"Kurumsal", section:"SAYFALAR"},
    "social-feed": {title:"Akış", group:"Sosyal", section:"SAYFALAR"},
    "social-activity": {title:"Etkinlik", group:"Sosyal", section:"SAYFALAR"},
    "blog-posts": {title:"Yazılar", group:"Blog", section:"SAYFALAR"},
    "blog-details": {title:"Yazı Detayı", group:"Blog", section:"SAYFALAR"},
    "faq-overview": {title:"Genel Bakış", group:"Sık Sorulan Sorular", section:"SAYFALAR"},
    "pricing-plans": {title:"Planlar", group:"Fiyatlandırma", section:"SAYFALAR"},
    "careers-open": {title:"Açık Pozisyonlar", group:"Kariyer", section:"SAYFALAR"},
    "utility-404": {title:"404", group:"Yardımcı Sayfalar", section:"SAYFALAR"},
    "utility-500": {title:"500", group:"Yardımcı Sayfalar", section:"SAYFALAR"},
    "utility-maintenance": {title:"Bakım", group:"Yardımcı Sayfalar", section:"SAYFALAR"},
    "widgets-statistics": {title:"İstatistikler", group:"Widget'lar", section:"SAYFALAR"},
    "widgets-tables": {title:"Tablolar", group:"Widget'lar", section:"SAYFALAR"},
    "widgets-charts": {title:"Grafikler", group:"Widget'lar", section:"SAYFALAR"},
    "projects-list": {title:"Liste", group:"Projeler", section:"UYGULAMALAR"},
    "projects-overview": {title:"Genel Bakış", group:"Projeler", section:"UYGULAMALAR"},
    "projects-create": {title:"Oluştur", group:"Projeler", section:"UYGULAMALAR"},
    "ecommerce-products": {title:"Ürünler", group:"e-Ticaret", section:"UYGULAMALAR"},
    "ecommerce-categories": {title:"Kategoriler", group:"e-Ticaret", section:"UYGULAMALAR"},
    "ecommerce-orders": {title:"Siparişler", group:"e-Ticaret", section:"UYGULAMALAR"},
    "ecommerce-order-details": {title:"Sipariş Detayı", group:"e-Ticaret", section:"UYGULAMALAR"},
    "ecommerce-customers": {title:"Müşteriler", group:"e-Ticaret", section:"UYGULAMALAR"},
    "contacts-list": {title:"Liste", group:"Kişiler", section:"UYGULAMALAR"},
    "support-tickets": {title:"Talepler", group:"Destek Merkezi", section:"UYGULAMALAR"},
    "support-faq": {title:"Sık Sorulan Sorular", group:"Destek Merkezi", section:"UYGULAMALAR"},
    "users-list": {title:"Kullanıcılar", group:"Kullanıcı Yönetimi", section:"UYGULAMALAR"},
    "users-roles": {title:"Roller", group:"Kullanıcı Yönetimi", section:"UYGULAMALAR"},
    "users-permissions": {title:"Yetkiler", group:"Kullanıcı Yönetimi", section:"UYGULAMALAR"},
    "customers-list": {title:"Liste", group:"Müşteriler", section:"UYGULAMALAR"},
    "customers-details": {title:"Detaylar", group:"Müşteriler", section:"UYGULAMALAR"},
    "subscription-overview": {title:"Genel Bakış", group:"Abonelik", section:"UYGULAMALAR"},
    "invoice-list": {title:"Faturalar", group:"Fatura Yönetimi", section:"UYGULAMALAR"},
    "files-list": {title:"Dosyalar", group:"Dosya Yöneticisi", section:"UYGULAMALAR"},
    "inbox-messages": {title:"Mesajlar", group:"Gelen Kutusu", section:"UYGULAMALAR"},
    "chat-conversations": {title:"Konuşmalar", group:"Sohbet", section:"UYGULAMALAR"},
    "calendar-overview": {title:"Genel Bakış", group:"Takvim", section:"UYGULAMALAR"},
    "layout-sidebar": {title:"Kenar Menüsü", group:"Düzenler", section:"DÜZENLER"},
    "layout-header": {title:"Üst Menü", group:"Düzenler", section:"DÜZENLER"},
    "layout-auth": {title:"Kimlik Doğrulama", group:"Düzenler", section:"DÜZENLER"},
  };
  var id = new URLSearchParams(window.location.search).get("page") || panel.getAttribute("data-bb-panel-default-page") || "dashboard-overview";
  var selected = Object.prototype.hasOwnProperty.call(pages, id) ? pages[id] : null;
  var title = selected ? selected.title : "Sayfa Şablonları";
  var heading = selected ? selected.group + " / " + selected.title : "Sayfa Şablonları";
  var pageTitle = panel.querySelector(".bb-page-title");
  var cardTitle = panel.querySelector("#bb_page_card_title");
  var desc = panel.querySelector("#bb_page_empty_description");
  var crumb = panel.querySelector(".bb-breadcrumb .breadcrumb");
  if (pageTitle) pageTitle.textContent = heading;
  if (cardTitle) cardTitle.textContent = title;
  if (desc) desc.textContent = selected ? selected.section + " / " + selected.group + " / " + selected.title + " — yapım aşamasında." : "Menüden bir sayfa seçin.";
  if (crumb) {
    while (crumb.firstChild) crumb.removeChild(crumb.firstChild);
    [selected ? selected.section : "Sayfalar", selected ? selected.group : "Şablonlar", title].forEach(function (label, index, arr) {
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
