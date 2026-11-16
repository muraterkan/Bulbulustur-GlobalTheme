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
        <a class="bb-menu-link" href="dashboard.html">Dashboard</a>
      </div>

      <div class="bb-menu-item" data-bb-menu-trigger="click" data-bb-panel-nav-group="pages">
        <button class="bb-menu-link" type="button" aria-expanded="false" aria-haspopup="true" aria-controls="bb_panel_topnav_pages">
          Pages <span class="bb-menu-arrow" aria-hidden="true"></span>
        </button>
        <div class="bb-menu-sub bb-menu-sub-dropdown bb-panel-mega" id="bb_panel_topnav_pages" data-bb-menu-placement="bottom-start">
          <div class="bb-panel-mega-layout">
            <div class="bb-panel-mega-main">
              <div class="bb-panel-mega-items">
                <a class="bb-panel-mega-link bb-panel-mega-link-primary" href="profile.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">person</span></span>
                  <span><strong>Profile</strong><small>User overview and activity</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-success" href="account.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">manage_accounts</span></span>
                  <span><strong>Account</strong><small>Settings, security and preferences</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-warning" href="invoices.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">receipt_long</span></span>
                  <span><strong>Invoices</strong><small>Invoice list and details</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-danger" href="pricing.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">payments</span></span>
                  <span><strong>Pricing</strong><small>Compare plans and packages</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-violet" href="team.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">groups</span></span>
                  <span><strong>Our Team</strong><small>Corporate team and culture page</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-info" href="blog.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">article</span></span>
                  <span><strong>Blog</strong><small>Content and publishing screens</small></span>
                </a>
              </div>
            </div>
            <aside class="bb-panel-mega-side" aria-label="Daha fazla sayfa">
              <strong>More Pages</strong>
              <a href="social-feed.html">Social Feed</a>
              <a href="profile-settings.html">Profile Settings</a>
              <a href="statistics.html">Statistics</a>
              <a href="charts.html">Charts</a>
              <a href="widget-lists.html">Widget Lists</a>
            </aside>
          </div>
          <div class="bb-panel-mega-footer">
            <span><strong>Panel page templates</strong><small>Use ready-made screens with the same shell and component system.</small></span>
            <a class="btn bb-btn-bg-primary btn-sm" href="layouts.html">Explore</a>
          </div>
        </div>
      </div>

      <div class="bb-menu-item" data-bb-menu-trigger="click" data-bb-panel-nav-group="apps">
        <button class="bb-menu-link" type="button" aria-expanded="false" aria-haspopup="true" aria-controls="bb_panel_topnav_apps">
          Applications <span class="bb-menu-arrow" aria-hidden="true"></span>
        </button>
        <div class="bb-menu-sub bb-menu-sub-dropdown bb-panel-mega" id="bb_panel_topnav_apps" data-bb-menu-placement="bottom-start">
          <div class="bb-panel-mega-layout">
            <div class="bb-panel-mega-main">
              <div class="bb-panel-mega-items">
                <a class="bb-panel-mega-link bb-panel-mega-link-primary" href="orders.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">shopping_bag</span></span>
                  <span><strong>Orders</strong><small>Order list and detail flow</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-success" href="create-product.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">add_box</span></span>
                  <span><strong>Create Product</strong><small>Product form and content fields</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-warning" href="contacts.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">contacts</span></span>
                  <span><strong>Contacts</strong><small>Contact cards and list view</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-danger" href="subscription.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">subscriptions</span></span>
                  <span><strong>Subscription</strong><small>Plan status and subscription details</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-violet" href="roles.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">admin_panel_settings</span></span>
                  <span><strong>Roles</strong><small>Role list and management view</small></span>
                </a>
                <a class="bb-panel-mega-link bb-panel-mega-link-info" href="permissions.html">
                  <span class="bb-panel-mega-icon"><span class="material-symbols-outlined" aria-hidden="true">verified_user</span></span>
                  <span><strong>Permissions</strong><small>Permission matrix and access scopes</small></span>
                </a>
              </div>
            </div>
            <aside class="bb-panel-mega-side" aria-label="Tools and examples">
              <strong>Tools and Examples</strong>
              <a href="lists.html">List / Table</a>
              <a href="forms.html">Formlar</a>
              <a href="charts.html">Charts</a>
              <a href="statistics.html">Statistics</a>
              <a href="widget-lists.html">Widget Lists</a>
            </aside>
          </div>
          <div class="bb-panel-mega-footer">
            <span><strong>Application screens</strong><small>Explore ready-made examples connected to real panel flows.</small></span>
            <a class="btn bb-btn-bg-primary btn-sm" href="orders.html">Explore</a>
          </div>
        </div>
      </div>

      <div class="bb-menu-item" data-bb-menu-trigger="click" data-bb-panel-nav-group="layouts">
        <button class="bb-menu-link" type="button" aria-expanded="false" aria-haspopup="true" aria-controls="bb_panel_topnav_layouts">
          Layouts <span class="bb-menu-arrow" aria-hidden="true"></span>
        </button>
        <div class="bb-menu-sub bb-menu-sub-dropdown bb-panel-nav-menu" id="bb_panel_topnav_layouts" data-bb-menu-placement="bottom-start">
          <a class="bb-panel-nav-menu-link" href="layouts.html"><span class="material-symbols-outlined" aria-hidden="true">dashboard_customize</span><span><strong>Layout Plans</strong><small>Sidebar, top navigation and auth layouts</small></span></a>
          <a class="bb-panel-nav-menu-link" href="header.html"><span class="material-symbols-outlined" aria-hidden="true">web_asset</span><span><strong>Header</strong><small>Header and top navigation</small></span></a>
          <a class="bb-panel-nav-menu-link" href="sidebar.html"><span class="material-symbols-outlined" aria-hidden="true">left_panel_open</span><span><strong>Sidebar</strong><small>Panel sidebar</small></span></a>
          <a class="bb-panel-nav-menu-link" href="toolbar.html"><span class="material-symbols-outlined" aria-hidden="true">toolbar</span><span><strong>Toolbar</strong><small>Title, breadcrumb and actions</small></span></a>
        </div>
      </div>

      <div class="bb-menu-item">
        <a class="bb-menu-link" href="support-center.html">Help</a>
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
  notificationPanel.setAttribute("aria-label", "Notifications");
  notificationPanel.innerHTML = `
    <div class="bb-panel-notifications-head">
      <div class="bb-panel-notifications-heading">
        <h2 id="bb_notifications_title">Notifications</h2>
        <span class="bb-panel-notifications-count" data-bb-notification-count>3 new</span>
      </div>
      <div class="bb-panel-notifications-tabs" role="tablist" aria-label="Notification categories">
        <button type="button" id="bb_notifications_tab_alerts" class="bb-panel-notifications-tab" role="tab" aria-selected="true" aria-controls="bb_notifications_alerts" data-bb-notification-tab="alerts" tabindex="0">Alerts</button>
        <button type="button" id="bb_notifications_tab_updates" class="bb-panel-notifications-tab" role="tab" aria-selected="false" aria-controls="bb_notifications_updates" data-bb-notification-tab="updates" tabindex="-1">Updates</button>
        <button type="button" id="bb_notifications_tab_logs" class="bb-panel-notifications-tab" role="tab" aria-selected="false" aria-controls="bb_notifications_logs" data-bb-notification-tab="logs" tabindex="-1">History</button>
      </div>
    </div>
    <div class="bb-panel-notifications-body">
      <div role="tabpanel" id="bb_notifications_alerts" aria-labelledby="bb_notifications_tab_alerts" data-bb-notification-panel="alerts">
        <div class="bb-panel-notification-row" data-bb-notification-unread>
          <span class="bb-panel-notification-icon" aria-hidden="true"><span class="material-symbols-outlined">shopping_bag</span></span>
          <div class="bb-panel-notification-copy"><strong>New order received</strong><p>An order is awaiting approval.</p><small>5 minutes ago · Demo</small></div><span class="bb-panel-notification-dot" aria-label="Unread"></span>
        </div>
        <div class="bb-panel-notification-row" data-bb-notification-unread>
          <span class="bb-panel-notification-icon" aria-hidden="true"><span class="material-symbols-outlined">inventory_2</span></span>
          <div class="bb-panel-notification-copy"><strong>Stock alert</strong><p>A product stock level is low.</p><small>25 minutes ago · Demo</small></div><span class="bb-panel-notification-dot" aria-label="Unread"></span>
        </div>
        <div class="bb-panel-notification-row">
          <span class="bb-panel-notification-icon" aria-hidden="true"><span class="material-symbols-outlined">task_alt</span></span>
          <div class="bb-panel-notification-copy"><strong>Daily check completed</strong><p>The processing queue was checked.</p><small>Yesterday · Demo</small></div>
        </div>
      </div>
      <div role="tabpanel" id="bb_notifications_updates" aria-labelledby="bb_notifications_tab_updates" data-bb-notification-panel="updates" hidden>
        <div class="bb-panel-notification-row" data-bb-notification-unread>
          <span class="bb-panel-notification-icon" aria-hidden="true"><span class="material-symbols-outlined">system_update</span></span>
          <div class="bb-panel-notification-copy"><strong>System update</strong><p>Panel components were updated.</p><small>2 hours ago · Demo</small></div><span class="bb-panel-notification-dot" aria-label="Unread"></span>
        </div>
        <div class="bb-panel-notification-row"><span class="bb-panel-notification-icon" aria-hidden="true"><span class="material-symbols-outlined">palette</span></span><div class="bb-panel-notification-copy"><strong>Theme options</strong><p>Light and dark modes are available.</p><small>Yesterday · Demo</small></div></div>
      </div>
      <div role="tabpanel" id="bb_notifications_logs" aria-labelledby="bb_notifications_tab_logs" data-bb-notification-panel="logs" hidden>
        <div class="bb-panel-notification-row"><span class="bb-panel-notification-icon" aria-hidden="true"><span class="material-symbols-outlined">history</span></span><div class="bb-panel-notification-copy"><strong>Recent activity</strong><p>A demo history entry is displayed.</p><small>November 15 · Demo</small></div></div>
      </div>
    </div>
    <div class="bb-panel-notifications-foot"><span>Demo data</span><button type="button" class="bb-panel-notifications-clear" data-bb-notification-read>Mark all as read</button></div>
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
    if (count) count.textContent = unread ? unread + " new" : "All read";
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

  var chatAvatarPool = [
    "../../assets/media/avatars/300-12.webp",
    "../../assets/media/avatars/300-2.webp",
    "../../assets/media/avatars/300-5.webp",
    "../../assets/media/avatars/300-6.webp"
  ];
  var supportAvatar = chatAvatarPool[Math.floor(Math.random() * chatAvatarPool.length)];
  var userAvatarChoices = chatAvatarPool.filter(function (avatar) { return avatar !== supportAvatar; });
  var userAvatar = userAvatarChoices[Math.floor(Math.random() * userAvatarChoices.length)];

  function chatAuthorMarkup(name, time, avatar) {
    return '<div class="bb-panel-chat-author">' +
      '<img class="bb-panel-chat-author-avatar" src="' + avatar + '" alt="">' +
      '<span class="bb-panel-chat-author-copy"><strong>' + name + '</strong><small>' + time + '</small></span>' +
    '</div>';
  }

  var chatDrawer = document.createElement("section");
  chatDrawer.id = "bb_messages_pop";
  chatDrawer.className = "bb-drawer bb-drawer-end bb-panel-chat-drawer";
  chatDrawer.setAttribute("role", "dialog");
  chatDrawer.setAttribute("aria-modal", "true");
  chatDrawer.setAttribute("aria-label", "Messages");
  chatDrawer.setAttribute("aria-hidden", "true");
  chatDrawer.innerHTML = `
    <div class="bb-drawer-header">
      <div class="bb-panel-chat-head">
        <strong>Support conversation</strong>
        <small><span class="bb-panel-chat-presence" aria-hidden="true"></span>Online · Demo chat</small>
      </div>
      <button class="bb-drawer-close" type="button" aria-label="Close messages" data-bb-chat-close><span class="material-symbols-outlined" aria-hidden="true">close</span></button>
    </div>
    <div class="bb-drawer-body" data-bb-chat-history role="log" aria-live="polite" aria-label="Conversation history">
      <div class="bb-panel-chat-message" data-side="in">
        ${chatAuthorMarkup("Support Team", "09:15", supportAvatar)}
        <div class="bb-panel-chat-bubble">Hello, how can we help you?</div>
      </div>
      <div class="bb-panel-chat-message" data-side="out">
        ${chatAuthorMarkup("You", "09:18", userAvatar)}
        <div class="bb-panel-chat-bubble">I am reviewing the new panel components.</div>
      </div>
      <div class="bb-panel-chat-message" data-side="in">
        ${chatAuthorMarkup("Support Team", "09:20", supportAvatar)}
        <div class="bb-panel-chat-bubble">Harika! Herhangi bir sorunuz olursa buradan yazabilirsiniz. Bu bir demo sohbetidir.</div>
      </div>
    </div>
    <form class="bb-panel-chat-compose" data-bb-chat-compose>
      <label class="visually-hidden" for="bb_chat_text">Your message</label>
      <textarea id="bb_chat_text" class="form-control form-control-solid" data-bb-chat-input rows="2" maxlength="1000" placeholder="Write a message..." required></textarea>
      <div class="bb-panel-chat-compose-actions">
        <span class="bb-panel-chat-compose-note">Messages are visible only on this page.</span>
        <button class="btn btn-primary btn-sm" type="submit">Send</button>
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
    var authorAvatar = document.createElement("img");
    authorAvatar.className = "bb-panel-chat-author-avatar";
    authorAvatar.src = userAvatar;
    authorAvatar.alt = "";
    var authorCopy = document.createElement("span");
    authorCopy.className = "bb-panel-chat-author-copy";
    var authorName = document.createElement("strong");
    authorName.textContent = "You";
    var time = document.createElement("small");
    time.textContent = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    authorCopy.append(authorName, time);
    author.append(authorAvatar, authorCopy);
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
