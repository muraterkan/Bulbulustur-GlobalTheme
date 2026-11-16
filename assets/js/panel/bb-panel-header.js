/* Faz 3 — header overlays and top menu */
(function () {
"use strict";
var panel = document.querySelector("[data-bb-panel]"); if (!panel) return;

/* Shared top navigation: every panel page gets the same icon-led mega menu.
   Physical page links stay in the panel layer; core menu remains project-agnostic. */
var topnav = panel.querySelector("[data-bb-panel-topnav]");
if (topnav) {
  topnav.innerHTML = `
    <div class="bb-menu bb-menu-hover-bg bb-menu-active-bg" data-bb-panel-topnav-menu>
      <div class="bb-menu-item">
        <a class="bb-menu-link" href="dashboard.html">Gösterge Paneli</a>
      </div>

      <div class="bb-menu-item" data-bb-menu-trigger="click" data-bb-panel-nav-group="pages">
        <button class="bb-menu-link" type="button" aria-expanded="false" aria-haspopup="true" aria-controls="bb_panel_topnav_pages">
          Sayfalar <span class="bb-menu-arrow" aria-hidden="true"></span>
        </button>
        <div class="bb-menu-sub bb-menu-sub-dropdown bb-panel-mega" id="bb_panel_topnav_pages" data-bb-menu-placement="bottom-start">
          <div class="bb-panel-mega-layout">
            <div class="bb-panel-mega-main">
              <div class="bb-panel-mega-items">
                <a class="bb-panel-mega-link bb-panel-mega-link-primary" href="profil.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">person</span></span>
                  <span><strong>Profil</strong><small>Kullanıcı görünümü ve etkinlikler</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-success" href="hesap.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">manage_accounts</span></span>
                  <span><strong>Hesap</strong><small>Ayarlar, güvenlik ve tercihler</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-warning" href="fatura.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">receipt_long</span></span>
                  <span><strong>Faturalar</strong><small>Fatura listesi ve detayları</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-danger" href="fiyatlandirma.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">payments</span></span>
                  <span><strong>Fiyatlandırma</strong><small>Plan ve paket karşılaştırmaları</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-violet" href="ekibimiz.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">groups</span></span>
                  <span><strong>Ekibimiz</strong><small>Kurumsal ekip ve kültür sayfası</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-info" href="blog.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">article</span></span>
                  <span><strong>Blog</strong><small>İçerik ve yayın ekranları</small></span>
                </a>
              </div>
            </div>
            <aside class="bb-panel-mega-side" aria-label="Daha fazla sayfa">
              <strong>Daha Fazla Sayfa</strong>
              <a href="sosyal-akis.html">Sosyal Akış</a>
              <a href="destek-merkezi.html">Destek Merkezi</a>
              <a href="istatistikler.html">İstatistikler</a>
              <a href="grafikler.html">Grafikler</a>
              <a href="widget-listeleri.html">Widget Listeleri</a>
            </aside>
          </div>
          <div class="bb-panel-mega-footer">
            <span><strong>Panel sayfa şablonları</strong><small>Hazır ekranları aynı kabuk ve component sistemiyle kullan.</small></span>
            <a class="btn bb-btn-bg-primary btn-sm" href="layoutlar.html">Keşfet</a>
          </div>
        </div>
      </div>

      <div class="bb-menu-item" data-bb-menu-trigger="click" data-bb-panel-nav-group="apps">
        <button class="bb-menu-link" type="button" aria-expanded="false" aria-haspopup="true" aria-controls="bb_panel_topnav_apps">
          Uygulamalar <span class="bb-menu-arrow" aria-hidden="true"></span>
        </button>
        <div class="bb-menu-sub bb-menu-sub-dropdown bb-panel-mega" id="bb_panel_topnav_apps" data-bb-menu-placement="bottom-start">
          <div class="bb-panel-mega-layout">
            <div class="bb-panel-mega-main">
              <div class="bb-panel-mega-items">
                <a class="bb-panel-mega-link bb-panel-mega-link-primary" href="siparisler.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">shopping_bag</span></span>
                  <span><strong>Siparişler</strong><small>Liste ve sipariş detay akışı</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-success" href="urun-olustur.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">add_box</span></span>
                  <span><strong>Ürün Oluştur</strong><small>Ürün formu ve içerik alanları</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-warning" href="kisiler.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">contacts</span></span>
                  <span><strong>Kişiler</strong><small>Kişi kartları ve liste görünümü</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-danger" href="abonelik.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">subscriptions</span></span>
                  <span><strong>Abonelik</strong><small>Plan durumu ve abonelik detayları</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-violet" href="roller.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">admin_panel_settings</span></span>
                  <span><strong>Roller</strong><small>Rol listesi ve yönetim görünümü</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-info" href="yetkiler.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">verified_user</span></span>
                  <span><strong>Yetkiler</strong><small>Yetki matrisi ve erişim alanları</small></span>
                </a>
              </div>
            </div>
            <aside class="bb-panel-mega-side" aria-label="Araçlar ve örnekler">
              <strong>Araçlar ve Örnekler</strong>
              <a href="listeler.html">Liste / Tablo</a>
              <a href="formlar.html">Formlar</a>
              <a href="grafikler.html">Grafikler</a>
              <a href="istatistikler.html">İstatistikler</a>
              <a href="widget-listeleri.html">Widget Listeleri</a>
            </aside>
          </div>
          <div class="bb-panel-mega-footer">
            <span><strong>Uygulama ekranları</strong><small>Gerçek panel akışlarına bağlanmış hazır örnekleri incele.</small></span>
            <a class="btn bb-btn-bg-primary btn-sm" href="siparisler.html">Keşfet</a>
          </div>
        </div>
      </div>

      <div class="bb-menu-item" data-bb-menu-trigger="click" data-bb-panel-nav-group="layouts">
        <button class="bb-menu-link" type="button" aria-expanded="false" aria-haspopup="true" aria-controls="bb_panel_topnav_layouts">
          Düzenler <span class="bb-menu-arrow" aria-hidden="true"></span>
        </button>
        <div class="bb-menu-sub bb-menu-sub-dropdown bb-panel-nav-menu" id="bb_panel_topnav_layouts" data-bb-menu-placement="bottom-start">
          <a class="bb-panel-nav-menu-link" href="layoutlar.html"><span class="material-symbols-outlined" aria-hidden="true">dashboard_customize</span><span><strong>Yerleşim Planları</strong><small>Sidebar, üst menü ve auth düzenleri</small></span></a>
          <a class="bb-panel-nav-menu-link" href="header.html"><span class="material-symbols-outlined" aria-hidden="true">web_asset</span><span><strong>Üst Bar</strong><small>Header ve üst navigasyon</small></span></a>
          <a class="bb-panel-nav-menu-link" href="sidebar.html"><span class="material-symbols-outlined" aria-hidden="true">left_panel_open</span><span><strong>Sidebar</strong><small>Panel kenar menüsü</small></span></a>
          <a class="bb-panel-nav-menu-link" href="toolbar.html"><span class="material-symbols-outlined" aria-hidden="true">toolbar</span><span><strong>Toolbar</strong><small>Başlık, breadcrumb ve aksiyonlar</small></span></a>
        </div>
      </div>

      <div class="bb-menu-item">
        <a class="bb-menu-link" href="destek-merkezi.html">Yardım</a>
      </div>
    </div>
  `;

  var currentPage = (window.location.pathname.split("/").pop() || "").toLowerCase();
  topnav.querySelectorAll("a[href]").forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#" || href.indexOf("../") === 0) return;
    var targetPage = href.split(/[?#]/)[0].split("/").pop().toLowerCase();
    if (targetPage !== currentPage) return;
    link.setAttribute("aria-current", "page");
    var group = link.closest("[data-bb-panel-nav-group]");
    if (group) group.classList.add("active");
  });
}

/* One notification template powers every panel page. The source HTML keeps its fallback. */
var notificationHost = panel.querySelector('[aria-controls="bb_notifications_pop"]')?.closest("[data-bb-panel-popup]");
var notificationPanel = notificationHost?.querySelector("#bb_notifications_pop");
if (notificationPanel) {
  notificationPanel.classList.add("bb-panel-notifications");
  notificationPanel.setAttribute("aria-label", "Bildirimler");
  notificationPanel.innerHTML = `
    <div class="bb-panel-notifications-head">
      <div class="bb-panel-notifications-heading">
        <h2 id="bb_notifications_title">Bildirimler</h2>
        <span class="bb-panel-notifications-count" data-bb-notification-count>3 yeni</span>
      </div>
      <div class="bb-panel-notifications-tabs" role="tablist" aria-label="Bildirim kategorileri">
        <button type="button" id="bb_notifications_tab_alerts" class="bb-panel-notifications-tab" role="tab" aria-selected="true" aria-controls="bb_notifications_alerts" data-bb-notification-tab="alerts" tabindex="0">Uyarılar</button>
        <button type="button" id="bb_notifications_tab_updates" class="bb-panel-notifications-tab" role="tab" aria-selected="false" aria-controls="bb_notifications_updates" data-bb-notification-tab="updates" tabindex="-1">Güncellemeler</button>
        <button type="button" id="bb_notifications_tab_logs" class="bb-panel-notifications-tab" role="tab" aria-selected="false" aria-controls="bb_notifications_logs" data-bb-notification-tab="logs" tabindex="-1">Geçmiş</button>
      </div>
    </div>
    <div class="bb-panel-notifications-body">
      <div role="tabpanel" id="bb_notifications_alerts" aria-labelledby="bb_notifications_tab_alerts" data-bb-notification-panel="alerts">
        <div class="bb-panel-notification-row" data-bb-notification-unread>
          <span class="bb-panel-notification-icon" aria-hidden="true"><span class="material-symbols-outlined">shopping_bag</span></span>
          <div class="bb-panel-notification-copy"><strong>Yeni sipariş alındı</strong><p>Bir sipariş onay bekliyor.</p><small>5 dakika önce · Demo</small></div><span class="bb-panel-notification-dot" aria-label="Okunmadı"></span>
        </div>
        <div class="bb-panel-notification-row" data-bb-notification-unread>
          <span class="bb-panel-notification-icon" aria-hidden="true"><span class="material-symbols-outlined">inventory_2</span></span>
          <div class="bb-panel-notification-copy"><strong>Stok uyarısı</strong><p>Bir ürünün stok seviyesi azaldı.</p><small>25 dakika önce · Demo</small></div><span class="bb-panel-notification-dot" aria-label="Okunmadı"></span>
        </div>
        <div class="bb-panel-notification-row">
          <span class="bb-panel-notification-icon" aria-hidden="true"><span class="material-symbols-outlined">task_alt</span></span>
          <div class="bb-panel-notification-copy"><strong>Günlük kontrol tamamlandı</strong><p>İşlem kuyruğu kontrol edildi.</p><small>Dün · Demo</small></div>
        </div>
      </div>
      <div role="tabpanel" id="bb_notifications_updates" aria-labelledby="bb_notifications_tab_updates" data-bb-notification-panel="updates" hidden>
        <div class="bb-panel-notification-row" data-bb-notification-unread>
          <span class="bb-panel-notification-icon" aria-hidden="true"><span class="material-symbols-outlined">system_update</span></span>
          <div class="bb-panel-notification-copy"><strong>Sistem güncellemesi</strong><p>Panel bileşenleri güncellendi.</p><small>2 saat önce · Demo</small></div><span class="bb-panel-notification-dot" aria-label="Okunmadı"></span>
        </div>
        <div class="bb-panel-notification-row"><span class="bb-panel-notification-icon" aria-hidden="true"><span class="material-symbols-outlined">palette</span></span><div class="bb-panel-notification-copy"><strong>Tema seçenekleri</strong><p>Açık ve koyu görünüm kullanılabilir.</p><small>Dün · Demo</small></div></div>
      </div>
      <div role="tabpanel" id="bb_notifications_logs" aria-labelledby="bb_notifications_tab_logs" data-bb-notification-panel="logs" hidden>
        <div class="bb-panel-notification-row"><span class="bb-panel-notification-icon" aria-hidden="true"><span class="material-symbols-outlined">history</span></span><div class="bb-panel-notification-copy"><strong>Son etkinlik</strong><p>Örnek geçmiş kaydı görüntüleniyor.</p><small>15 Kasım · Demo</small></div></div>
      </div>
    </div>
    <div class="bb-panel-notifications-foot"><span>Örnek veriler</span><button type="button" class="bb-panel-notifications-clear" data-bb-notification-read>Tümünü okundu işaretle</button></div>
  `;

  var notificationTabs = Array.from(notificationPanel.querySelectorAll("[data-bb-notification-tab]"));
  function selectNotificationTab(tab, focus) {
    notificationTabs.forEach(function (button) {
      var active = button === tab;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      var section = notificationPanel.querySelector('[data-bb-notification-panel="' + button.dataset.bbNotificationTab + '"]');
      if (section) section.hidden = !active;
    });
    if (focus) tab.focus();
  }
  notificationTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { selectNotificationTab(tab, false); });
    tab.addEventListener("keydown", function (event) {
      var offset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
      if (!offset && event.key !== "Home" && event.key !== "End") return;
      event.preventDefault();
      var next = event.key === "Home" ? 0 : event.key === "End" ? notificationTabs.length - 1 : (index + offset + notificationTabs.length) % notificationTabs.length;
      selectNotificationTab(notificationTabs[next], true);
    });
  });
  var markRead = notificationPanel.querySelector("[data-bb-notification-read]");
  function refreshNotificationCount() {
    var unread = notificationPanel.querySelectorAll("[data-bb-notification-unread]").length;
    var count = notificationPanel.querySelector("[data-bb-notification-count]");
    if (count) count.textContent = unread ? unread + " yeni" : "Tümü okundu";
    var indicator = notificationHost.querySelector(".bb-panel-indicator");
    if (indicator) indicator.hidden = unread === 0;
    if (markRead) markRead.disabled = unread === 0;
  }
  markRead.addEventListener("click", function () {
    notificationPanel.querySelectorAll("[data-bb-notification-unread]").forEach(function (row) {
      row.removeAttribute("data-bb-notification-unread");
      var dot = row.querySelector(".bb-panel-notification-dot");
      if (dot) dot.remove();
    });
    refreshNotificationCount();
  });
  refreshNotificationCount();
}

/* Replace the tiny Messages popup with the existing bb-drawer pattern.
   Demo messages live in this page session only; no persistence or network. */
var messageToggle = panel.querySelector('[aria-controls="bb_messages_pop"]');
var messageHost = messageToggle?.closest("[data-bb-panel-popup]");
if (messageToggle && messageHost) {
  var oldMessagePopup = messageHost.querySelector("#bb_messages_pop");
  if (oldMessagePopup) oldMessagePopup.remove();
  messageHost.removeAttribute("data-bb-panel-popup");
  messageToggle.removeAttribute("data-bb-panel-popup-toggle");
  messageToggle.setAttribute("aria-haspopup", "dialog");
  messageToggle.setAttribute("aria-expanded", "false");

  var chatBackdrop = document.createElement("div");
  chatBackdrop.className = "bb-drawer-backdrop";
  chatBackdrop.setAttribute("data-bb-panel-chat-backdrop", "");
  chatBackdrop.setAttribute("aria-hidden", "true");

  var chatDrawer = document.createElement("section");
  chatDrawer.id = "bb_messages_pop";
  chatDrawer.className = "bb-drawer bb-drawer-end bb-panel-chat-drawer";
  chatDrawer.setAttribute("role", "dialog");
  chatDrawer.setAttribute("aria-modal", "true");
  chatDrawer.setAttribute("aria-label", "Mesajlar");
  chatDrawer.setAttribute("aria-hidden", "true");
  chatDrawer.innerHTML = `
    <div class="bb-drawer-header">
      <div class="bb-panel-chat-head">
        <strong>Destek görüşmesi</strong>
        <small><span class="bb-panel-chat-presence" aria-hidden="true"></span>Çevrimiçi · Demo sohbet</small>
      </div>
      <button class="bb-drawer-close" type="button" aria-label="Mesajları kapat" data-bb-chat-close><span class="material-symbols-outlined" aria-hidden="true">close</span></button>
    </div>
    <div class="bb-drawer-body" data-bb-chat-history role="log" aria-live="polite" aria-label="Konuşma geçmişi">
      <div class="bb-panel-chat-message" data-side="in">
        <div class="bb-panel-chat-author">Destek Ekibi <small>09:15</small></div>
        <div class="bb-panel-chat-bubble">Merhaba, size nasıl yardımcı olabiliriz?</div>
      </div>
      <div class="bb-panel-chat-message" data-side="out">
        <div class="bb-panel-chat-author">Siz <small>09:18</small></div>
        <div class="bb-panel-chat-bubble">Panelin yeni bileşenlerini inceliyorum.</div>
      </div>
      <div class="bb-panel-chat-message" data-side="in">
        <div class="bb-panel-chat-author">Destek Ekibi <small>09:20</small></div>
        <div class="bb-panel-chat-bubble">Harika! Herhangi bir sorunuz olursa buradan yazabilirsiniz. Bu bir demo sohbetidir.</div>
      </div>
    </div>
    <form class="bb-panel-chat-compose" data-bb-chat-compose>
      <label class="visually-hidden" for="bb_chat_text">Mesajınız</label>
      <textarea id="bb_chat_text" class="form-control form-control-solid" data-bb-chat-input rows="2" maxlength="1000" placeholder="Bir mesaj yazın..." required></textarea>
      <div class="bb-panel-chat-compose-actions">
        <span class="bb-panel-chat-compose-note">Mesajlar sadece bu sayfada görünür.</span>
        <button class="btn btn-primary btn-sm" type="submit">Gönder</button>
      </div>
    </form>
  `;
  panel.append(chatBackdrop, chatDrawer);

  var chatClose = chatDrawer.querySelector("[data-bb-chat-close]");
  var chatForm = chatDrawer.querySelector("[data-bb-chat-compose]");
  var chatInput = chatDrawer.querySelector("[data-bb-chat-input]");
  var chatHistory = chatDrawer.querySelector("[data-bb-chat-history]");
  var chatOpen = false;
  var focusBeforeChat = null;

  function setChatOpen(open) {
    if (chatOpen === open) return;
    chatOpen = open;
    if (open) focusBeforeChat = document.activeElement;
    chatDrawer.classList.toggle("is-open", open);
    chatBackdrop.classList.toggle("is-open", open);
    chatDrawer.setAttribute("aria-hidden", String(!open));
    messageToggle.setAttribute("aria-expanded", String(open));
    if (open) {
      chatClose.focus();
      chatHistory.scrollTop = chatHistory.scrollHeight;
    } else if (focusBeforeChat && typeof focusBeforeChat.focus === "function") {
      focusBeforeChat.focus();
      focusBeforeChat = null;
    }
  }
  messageToggle.addEventListener("click", function () { setChatOpen(!chatOpen); });
  chatClose.addEventListener("click", function () { setChatOpen(false); });
  chatBackdrop.addEventListener("click", function () { setChatOpen(false); });
  document.addEventListener("keydown", function (event) {
    if (!chatOpen) return;
    if (event.key === "Escape") { event.preventDefault(); setChatOpen(false); return; }
    if (event.key !== "Tab") return;
    var focusable = Array.from(chatDrawer.querySelectorAll('button:not([disabled]), textarea:not([disabled]), a[href], input:not([disabled])'))
      .filter(function (item) { return item.getClientRects().length > 0; });
    if (!focusable.length) return;
    if (event.shiftKey && document.activeElement === focusable[0]) {
      event.preventDefault(); focusable[focusable.length - 1].focus();
    } else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
      event.preventDefault(); focusable[0].focus();
    }
  });

  chatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!chatForm.reportValidity()) return;
    var value = chatInput.value.trim();
    if (!value) return;
    var item = document.createElement("div");
    item.className = "bb-panel-chat-message";
    item.dataset.side = "out";
    var author = document.createElement("div");
    author.className = "bb-panel-chat-author";
    author.textContent = "Siz";
    var time = document.createElement("small");
    time.textContent = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    author.appendChild(time);
    var bubble = document.createElement("div");
    bubble.className = "bb-panel-chat-bubble";
    bubble.textContent = value;
    item.append(author, bubble);
    chatHistory.appendChild(item);
    chatForm.reset();
    chatHistory.scrollTop = chatHistory.scrollHeight;
    chatInput.focus();
  });
}

var hosts = Array.from(panel.querySelectorAll("[data-bb-panel-popup]"));
function close(host, focus) { var p=host.querySelector("[data-bb-panel-popup-content]"),b=host.querySelector("[data-bb-panel-popup-toggle]"); if(!p||!b)return; p.hidden=true;b.setAttribute("aria-expanded","false");if(focus)b.focus(); }
hosts.forEach(function(host){var p=host.querySelector("[data-bb-panel-popup-content]"),b=host.querySelector("[data-bb-panel-popup-toggle]");if(!p||!b)return;p.hidden=true;b.setAttribute("aria-expanded","false");b.addEventListener("click",function(){var open=p.hidden;hosts.forEach(function(h){close(h,false)});p.hidden=!open;b.setAttribute("aria-expanded",String(open));if(open){var field=p.querySelector("input,a[href],button");if(field)field.focus();}});});
document.addEventListener("click",function(e){hosts.forEach(function(h){if(!h.contains(e.target))close(h,false);});});
document.addEventListener("keydown",function(e){if(e.key!=="Escape")return;hosts.forEach(function(h){var p=h.querySelector("[data-bb-panel-popup-content]");if(p&&!p.hidden){e.preventDefault();close(h,true);}});});
var nav=panel.querySelector("[data-bb-panel-topnav]");if(!nav)return;
function closeNav(){nav.querySelectorAll(".bb-menu-item.show").forEach(function(i){i.classList.remove("show");var b=i.querySelector(":scope > .bb-menu-link");if(b)b.setAttribute("aria-expanded","false");});}
nav.addEventListener("click",function(e){var b=e.target.closest("[data-bb-menu-trigger='click'] > .bb-menu-link");if(!b||!nav.contains(b))return;e.preventDefault();var i=b.parentElement,open=!i.classList.contains("show");closeNav();i.classList.toggle("show",open);b.setAttribute("aria-expanded",String(open));});
document.addEventListener("click",function(e){if(!nav.contains(e.target))closeNav();});document.addEventListener("keydown",function(e){if(e.key==="Escape")closeNav();});
})();
