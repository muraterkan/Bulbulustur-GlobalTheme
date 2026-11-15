/* Sosyal akış demo etkileşimleri — yalnız sayfa belleği; API çağrısı yok. */
(function () {
  "use strict";
  var root = document.querySelector("[data-bb-social-feed]");
  if (!root) return;
  var form = root.querySelector("[data-bb-social-compose]");
  var textarea = form.querySelector("textarea");
  var list = root.querySelector("[data-bb-social-posts]");
  var status = root.querySelector("[data-bb-social-status]");
  var selected = "all";
  function refresh() {
    var count = 0;
    list.querySelectorAll("[data-bb-social-post]").forEach(function (post) {
      var visible = selected === "all" || post.dataset.followed === "true";
      post.hidden = !visible;
      if (visible) count++;
    });
    root.querySelectorAll("[data-bb-social-filter]").forEach(function (button) {
      var active = button.dataset.bbSocialFilter === selected;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    status.textContent = count + " örnek paylaşım gösteriliyor.";
  }
  root.addEventListener("click", function (event) {
    var filter = event.target.closest("[data-bb-social-filter]");
    if (filter) { selected = filter.dataset.bbSocialFilter; refresh(); return; }
    var like = event.target.closest("[data-bb-social-like]");
    if (!like) return;
    var count = like.querySelector("[data-bb-social-like-count]");
    var liked = like.getAttribute("aria-pressed") === "true";
    like.setAttribute("aria-pressed", String(!liked));
    count.textContent = String(Number(count.textContent) + (liked ? -1 : 1));
    like.classList.toggle("btn-primary", !liked);
    like.classList.toggle("bb-btn-secondary", liked);
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var article = document.createElement("article");
    article.className = "bb-card mb-3";
    article.dataset.bbSocialPost = "";
    article.dataset.followed = "true";
    var body = document.createElement("div");
    body.className = "bb-card-body";
    var title = document.createElement("strong"); title.textContent = "Örnek Kullanıcı";
    var note = document.createElement("div"); note.className = "text-body-secondary small mb-3"; note.textContent = "Az önce · Yerel demo paylaşımı";
    var text = document.createElement("p"); text.className = "mb-3"; text.textContent = textarea.value.trim();
    if (!text.textContent) return;
    var badge = document.createElement("span"); badge.className = "badge bb-badge bb-badge-light-primary"; badge.textContent = "Yeni paylaşım";
    body.append(title, note, text, badge);
    article.appendChild(body);
    list.prepend(article);
    form.reset();
    refresh();
    article.scrollIntoView({ block: "nearest", behavior: "auto" });
  });
  refresh();
})();
