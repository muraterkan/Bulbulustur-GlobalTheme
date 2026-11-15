/* Faz 3 — header overlays and top menu */
(function () {
"use strict";
var panel = document.querySelector("[data-bb-panel]"); if (!panel) return;
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
