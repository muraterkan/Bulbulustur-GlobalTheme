/* Prifilee pages — shared visual structure and content-only demo interactions. */
(function () {
"use strict";
var root = document.querySelector("[data-bb-profile-root]");
if (!root) return;
var view = root.dataset.bbPrifileeView || "overview";
var pages = [
  ["overview", "Genel Bakış", "profile.html"],
  ["settings", "Adjustr", "profile-settings.html"],
  ["security", "Güvenlik", "profile-security.html"],
  ["activity", "Etkinlik", "profile-activity.html"],
  ["billing", "Faturalandırma", "profile-billing.html"],
  ["statements", "Ekstreler", "profile-statements.html"],
  ["referrals", "Referanslar", "profile-referrals.html"],
  ["api", "API Anahtarları", "profile-api.html"],
  ["logs", "Registerlar", "profile-logs.html"]
];
var extras = [
  ["projects", "Projeler"],
  ["campaigns", "Kampanyalar"],
  ["documents", "Belgeler"],
  ["followers", "Takipçiler"]
];
var title = (pages.find(function(p){return p[0] === view;}) || extras.find(function(p){return p[0] === view;}) || ["", "Prifile"])[1];
var outer = document.createElement("div");
outer.className = "bb-panel-content-container";
root.appendChild(outer);

function card(title, body, actions, extraClass) {
  return '<section class="bb-card ' + (extraClass || '') + '">' +
    '<div class="bb-card-header"><h2 class="bb-card-title">' + title + '</h2>' + (actions || '') + '</div>' +
    '<div class="bb-card-body">' + body + '</div></section>';
}
function detailRows(items) {
  return '<dl class="bb-profile-details">' + items.map(function(r) {
    return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
  }).join("") + '</dl>';
}
function table(headers, rows) {
  return '<div class="bb-dashboard-table-wrap"><table class="table bb-table table-hover"><thead><tr>' +
    headers.map(function(h){return '<th scope="col">' + h + '</th>';}).join("") +
    '</tr></thead><tbody>' + rows.map(function(r){return '<tr>' + r.map(function(v){return '<td>' + v + '</td>';}).join("") + '</tr>';}).join("") +
    '</tbody></table></div>';
}
function note(h, body) {
  return '<div class="bb-alert bb-alert-warning" role="alert">' +
    '<div class="bb-alert-icon" aria-hidden="true"><span class="material-symbols-outlined">warning</span></div>' +
    '<div class="bb-alert-body"><h3 class="bb-alert-title">' + h + '</h3><div class="bb-alert-text">' + body + '</div></div></div>';
}
function metric(label, value, tone) {
  return '<div class="bb-profile-metric"><span>' + label + '</span><strong' + (tone ? ' style="color: var(--bb-' + tone + '-text)"' : '') + '>' + value + '</strong></div>';
}
/* Reusable action menu markup: Bootstrap dropdown + canonical bb-dropdown-menu. */
function profileActionsMenu() {
  return '<div class="dropdown bb-action-menu">' +
    '<button type="button" class="btn bb-btn-secondary btn-sm bb-action-menu-toggle" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Diğer profil işlemleri">' +
    '<span class="material-symbols-outlined" aria-hidden="true">more_horiz</span></button>' +
    '<ul class="dropdown-menu dropdown-menu-end bb-dropdown-menu bb-action-menu-list">' +
    '<li><h3 class="dropdown-header">ÖDEMELER</h3></li>' +
    '<li><a class="dropdown-item" href="invoices.html">Fatura ön izlemesi</a></li>' +
    '<li><a class="dropdown-item" href="profile-billing.html">Ödeme yöntemleri</a></li>' +
    '<li><a class="dropdown-item" href="profile-statements.html">Ekstreler</a></li>' +
    '<li><a class="dropdown-item bb-action-menu-has-arrow" href="profile-billing.html"><span>Subscription</span><span class="material-symbols-outlined" aria-hidden="true">chevron_right</span></a></li>' +
    '<li><hr class="dropdown-divider"></li>' +
    '<li><a class="dropdown-item" href="profile-settings.html">Adjustr</a></li>' +
    '</ul></div>';
}
function profileHero() {
  var tabs = pages.map(function(p) {
    return '<a href="' + p[2] + '"' + (view === p[0] ? ' aria-current="page"' : '') + '>' + p[1] + '</a>';
  }).join("");
  return '<section class="bb-card bb-profile-hero mb-4" aria-label="User profil kartı">' +
    '<div class="bb-card-body"><div class="bb-profile-hero-main">' +
    '<div class="bb-profile-portrait"><img src="../../assets/media/avatars/300-3.jpg" alt="Örnek kullanıcı profil fotoğrafı"><span class="bb-profile-presence" title="Çevrimiçi" aria-label="Çevrimiçi"></span></div>' +
    '<div class="bb-profile-hero-content"><div class="bb-profile-hero-top">' +
    '<div><h2 class="bb-profile-hero-name">Örnek User <span class="material-symbols-outlined" aria-label="Demo doğrulama işareti">verified</span></h2>' +
    '<div class="bb-profile-hero-meta"><span><span class="material-symbols-outlined" aria-hidden="true">person</span>Developer</span>' +
    '<span><span class="material-symbols-outlined" aria-hidden="true">location_on</span>İstanbul, Türkiye</span>' +
    '<span><span class="material-symbols-outlined" aria-hidden="true">mail</span>demo@example.com</span></div></div>' +
    '<div class="bb-profile-hero-actions"><button type="button" class="btn bb-btn-secondary btn-sm" data-bb-profile-follow aria-pressed="false">Takip et</button>' +
    '<a href="profile-settings.html" class="btn btn-primary btn-sm">Prifilei Düzenle</a>' +
    profileActionsMenu() + '</div>' +
    '</div><div class="bb-profile-hero-bottom"><div class="bb-profile-stat-list">' +
    '<div class="bb-profile-stat"><strong>₺4.500</strong><small>Kazanç (demo)</small></div>' +
    '<div class="bb-profile-stat"><strong>80</strong><small>Proje (demo)</small></div>' +
    '<div class="bb-profile-stat"><strong>%60</strong><small>Başarı (demo)</small></div></div>' +
    '<div class="bb-profile-completion"><div class="bb-profile-completion-line"><span>Prifile tamamlanma oranı</span><strong>%50</strong></div>' +
    '<div class="bb-profile-completion-track" role="progressbar" aria-label="Prifile tamamlanma" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"><span></span></div></div>' +
    '</div></div></div></div>' +
    '<nav class="bb-profile-tabs" aria-label="Prifile sayfaları">' + tabs + '</nav></section>';
}
function pageOverview() {
  return '<div class="row g-4"><div class="col-xl-8">' + card("Prifile Detayları",detailRows([
    ["Tam ad", "Örnek User"],["Şirket","Bulbulustur (demo)"],["Telefon","+90 555 000 00 00"],
    ["Web sitesi","bulbulustur.com"],["Ülke","Türkiye"],["İletişim","E-posta, Telefon"],["Değişiklik izni","Evet"]
  ]) + '<div class="mt-4">' + note("Prifile bilgilerini tamamlayın", "Eksik alanları Adjustr sayfasından güncelleyebilirsiniz. Bu örnekte veriler kaydedilmez.") + '</div>',
  '<a href="profile-settings.html" class="btn btn-primary btn-sm">Prifilei Düzenle</a>') +
  '</div><div class="col-xl-4">' + card("Prifile Durumu",'<div class="bb-profile-metric-grid">' +
    metric("Aktif projeler","12") + metric("Takipçi","86") + metric("Bildirim","3") +
    '</div><p class="text-body-secondary mt-4 mb-0">İstatistikler örnek verilerden oluşur.</p>') + '</div></div>';
}
function pageSettings() {
  return card("Prifile Adjustrı",'<form data-bb-profile-form><div class="row g-4">' +
    '<div class="col-md-6"><label class="form-label" for="profile_name">Ad soyad</label><input class="form-control form-control-solid" id="profile_name" name="name" value="Örnek User" maxlength="120" required></div>' +
    '<div class="col-md-6"><label class="form-label" for="profile_email">E-posta</label><input type="email" class="form-control form-control-solid" id="profile_email" name="email" value="demo@example.com" required></div>' +
    '<div class="col-md-6"><label class="form-label" for="profile_city">Şehir</label><input class="form-control form-control-solid" id="profile_city" name="city" value="İstanbul"></div>' +
    '<div class="col-md-6"><label class="form-label" for="profile_language">Languages</label><select class="form-select form-select-solid" id="profile_language" name="language"><option>Türkçe</option><option>English</option></select></div>' +
    '<div class="col-12"><label class="form-label" for="profile_about">Hakkımda</label><textarea class="form-control form-control-solid" id="profile_about" name="about" rows="4" maxlength="1000">Panel tasarım sistemi üzerinde çalışıyorum.</textarea></div>' +
    '<div class="col-12"><div class="form-check"><input class="form-check-input" type="checkbox" id="profile_notify" checked><label class="form-check-label" for="profile_notify">Notificationsi etkinleştir</label></div></div>' +
    '</div><div class="d-flex gap-2 justify-content-end mt-4"><button type="reset" class="btn bb-btn-secondary">Sıfırla</button><button type="submit" class="btn btn-primary">Değişiklikleri kontrol et</button></div>' +
    '<p class="text-body-secondary mt-3" data-bb-profile-status role="status">Bu sayfa demo formudur; bilgileri kaydetmez.</p></form>');
}
function pageSecurity() {
  var heights=[41,59,72,90,65,53,64,75,92,76,56,68];
  return '<div class="row g-4"><div class="col-xl-8">' +
    card("Güvenlik Özeti", '<div class="bb-profile-metric-grid">' +
      metric("User girişi","36.899","success") + metric("Yönetici girişi","72","primary") + metric("Başarısız deneme","291","danger") +
      '</div><h3 class="h6 mt-4">Etkinlik Grafiği</h3><div class="bb-profile-activity-bars" role="img" aria-label="Ocaktan Aralığa örnek güvenlik etkinliği çubuk grafiği">' +
      heights.map(function(h){return '<div style="--bar-height:'+h+'%"></div>';}).join("") + '</div>' +
      '<div class="bb-profile-activity-labels">Oca Şub Mar Nis May Haz Tem Ağu Eyl Eki Kas Ara</div>' +
      '<small class="text-body-secondary d-block mt-3">Tüm istatistikler temsilidir.</small>') +
    '</div><div class="col-xl-4">' +
    card("Son Uyarılar",'<strong>Hesap güvenliği</strong><p class="text-body-secondary mt-2">Hesabınız için güçlü parola ve iki aşamalı doğrulama önerilir.</p>' +
      '<div class="mt-4"><span class="badge bb-badge bb-badge-light-primary">Güvenlik önerisi</span></div>') +
    '<div class="mt-4">' + card("Güvenlik Kuralları",'<strong>Oturum koruması</strong><p class="text-body-secondary mt-2 mb-0">Oturumların ve cihazların düzenli kontrolü önerilir.</p>') + '</div></div></div>' +
    '<div class="mt-4">' + card("Oturumlar",table(["Konum","Durum","Cihaz","IP adresi","Zaman"],[
    ["İstanbul, TR",'<span class="badge bb-badge bb-badge-light-success">Başarılı</span>',"Chrome · Windows","192.0.2.10","2 dakika önce"],
    ["Ankara, TR",'<span class="badge bb-badge bb-badge-light-success">Başarılı</span>',"Safari · macOS","192.0.2.20","Dün"],
    ["Berlin, DE",'<span class="badge bb-badge bb-badge-light-danger">Başarısız</span>',"Firefox · Linux","192.0.2.30","3 gün önce"]
  ])) + '</div>';
}
function pageActivity() {
  return '<div class="row g-4"><div class="col-xl-8">' +
    card("Son Etkinlikler", '<ol class="bb-dashboard-timeline">' + [
      ["Ürün bilgileri güncellendi","Katalog üzerinde örnek değişiklik yapıldı","Bugün 11:20"],
      ["Prifile görüntülendi","Genel bakış sayfası açıldı","Dün 16:45"],
      ["Proje tamamlandı","Panel bileşen düzeni incelendi","14 Kasım 2026"],
      ["Yeni bildirim","Örnek görev bildirimi oluşturuldu","12 Kasım 2026"]
    ].map(function(r,i){return '<li><span class="bb-dashboard-timeline-rail"><span class="bb-dashboard-timeline-marker"></span><span class="bb-dashboard-timeline-line"></span></span>' +
      '<div class="bb-dashboard-timeline-content"><strong>'+r[0]+'</strong><p>'+r[1]+'</p><small>'+r[2]+'</small></div></li>';}).join("")+'</ol>') +
    '</div><div class="col-xl-4">' + card("Etkinlik Dağılımı",'<div class="bb-profile-metric-grid">'+metric("Bugün","4")+metric("Bu hafta","12")+metric("Bu ay","48")+'</div><p class="text-body-secondary mt-4 mb-0">Örnek aktivite kayıtlarıdır.</p>')+'</div></div>';
}
function pageBilling() {
  return '<div class="bb-card mb-4"><div class="bb-card-body">' + note("Ödeme bilgileri örnektir", "Bu tasarım gerçek abonelik veya ödeme yönetimi yapmaz.") +
    '<div class="row g-4 mt-2"><div class="col-lg-6"><h3 class="h6">Aktif plan · Pro</h3><p class="text-body-secondary">Sonraki yenileme: 09 Aralık 2026 (demo)</p><strong>₺799 / ay</strong><small class="d-block text-body-secondary">Örnek abonelik bedeli</small></div>' +
    '<div class="col-lg-6"><div class="d-flex justify-content-between"><span>User kullanımı</span><strong>86 / 100</strong></div><div class="bb-profile-plan-usage mt-2"><span></span></div><small class="text-body-secondary">14 kullanıcı kontenjanı kaldı</small></div></div></div></div>' +
    '<div class="mt-4">' + card("Ödeme Yöntemleri",'<h3 class="h6 mb-3">Registerlı kart örnekleri</h3><div class="row g-3">' +
      '<div class="col-lg-6"><div class="bb-profile-method"><span class="material-symbols-outlined" aria-hidden="true">credit_card</span><div><strong>Visa •••• 1679</strong><small>09/2028 · Birincil (demo)</small></div></div></div>' +
      '<div class="col-lg-6"><div class="bb-profile-method"><span class="material-symbols-outlined" aria-hidden="true">credit_card</span><div><strong>Mastercard •••• 2040</strong><small>10/2029 · Örnek</small></div></div></div></div>' +
      '<p class="text-body-secondary mt-3 mb-0">Kart verisi saklanmaz; işlemler örnektir.</p>')+'</div>';
}
function pageStatements() {
  return card("Ekstreler", '<p class="text-body-secondary">Dönem bazlı örnek hesap hareketleri. Belgeler gerçek mali kayıt değildir.</p>' +
    table(["Dönem","Belge","Tutar","Durum"], [
      ["Kasım 2026","EKSTRE-DEMO-011","₺1.850,00",'<span class="badge bb-badge bb-badge-light-success">Hazır</span>'],
      ["Ekim 2026","EKSTRE-DEMO-010","₺1.690,00",'<span class="badge bb-badge bb-badge-light-success">Hazır</span>'],
      ["Eylül 2026","EKSTRE-DEMO-009","₺1.250,00",'<span class="badge bb-badge bb-badge-light-primary">Örnek</span>']
    ]));
}
function pageReferrals() {
  return '<div class="row g-4"><div class="col-xl-8">' +
    card("Referans Programı",'<p class="text-body-secondary">Örnek davet bağlantısı. Yönlendirme veya ödül kazanımı yapılmaz.</p>' +
      '<label class="form-label" for="bb_profile_referral">Davet kodunuz</label><div class="input-group"><input class="form-control" id="bb_profile_referral" value="BB-DEMO-2026" readonly>' +
      '<button class="btn bb-btn-secondary" type="button" data-bb-profile-copy>Kopyala</button></div>' +
      '<p class="text-body-secondary mt-3 mb-0" data-bb-profile-status role="status">Bu kod yalnız demo amaçlıdır.</p>') +
    '</div><div class="col-xl-4">' + card("Referans Özeti",'<div class="bb-profile-metric-grid">'+metric("Davet","18")+metric("Katılım","7")+metric("Beklemede","3")+'</div>')+'</div></div>';
}
function pageApi() {
  return card("API Genel Bakış",'<div class="d-flex justify-content-end align-items-center gap-2 mb-4"><label class="form-check form-switch"><input class="form-check-input" type="checkbox" data-bb-profile-api-test checked>' +
    '<span class="form-check-label">Test modu</span></label></div>' +
    '<div class="row g-4"><div class="col-lg-6"><h3 class="h6">API kurulumu</h3><p class="text-body-secondary">Uygulamanın API ile bağlantısı için gerekli yetkiler ve örnek endpoint yapısı burada gösterilir.</p>' +
    '<code>/api/v1/example</code></div><div class="col-lg-6"><h3 class="h6">Developer Araçları</h3><p class="text-body-secondary">Uygulama anahtarları ve erişim kurallarını merkezi olarak yönetin.</p>' +
    '<button class="btn bb-btn-secondary btn-sm" type="button" data-bb-profile-rule>Örnek kural oluştur</button></div></div>' +
    '<div class="mt-4">' + note("İki aşamalı doğrulama", "Üretim API erişiminde gerekli güvenlik kontrolleri ayrıca uygulanmalıdır.") + '</div>' +
    '<p class="text-body-secondary mt-3 mb-0" role="status" data-bb-profile-status>Test modu örneği; gerçek anahtar veya API çağrısı yok.</p>');
}
function pageLogs() {
  return card("Action Registerları",'<p class="text-body-secondary">Temsili denetim kayıtları; gerçek kullanıcı izleme verisi içermez.</p>' +
    table(["Action","Kaynak","Sonuç","Tarih"],[
      ["Prifile görüntüleme","Web Panel",'<span class="badge bb-badge bb-badge-light-success">Başarılı</span>',"16.11.2026"],
      ["Giriş kontrolü","Web Panel",'<span class="badge bb-badge bb-badge-light-success">Başarılı</span>',"15.11.2026"],
      ["API demo isteği","Developer",'<span class="badge bb-badge bb-badge-light-warning">Test</span>',"14.11.2026"],
      ["Şifre kontrolü","Web Panel",'<span class="badge bb-badge bb-badge-light-danger">Reddedildi</span>',"13.11.2026"]
    ]));
}
function pageProjects() {
  return card("Projeler", '<div class="bb-profile-metric-grid mb-4">'+metric("Aktif","12")+metric("Tamamlanan","64")+metric("Bekleyen","4")+'</div>' +
    table(["Proje","Durum","İlerleme"],[
      ["GlobalTheme Panel",'<span class="badge bb-badge bb-badge-light-primary">Geliştiriliyor</span>',"%80"],
      ["Mağaza Arayüzü",'<span class="badge bb-badge bb-badge-light-success">Tamamlandı</span>',"%100"],
      ["Katalog Düzeni",'<span class="badge bb-badge bb-badge-light-warning">Planlandı</span>',"%25"]
    ]));
}
function pageCampaigns() {
  return card("Kampanyalar", '<div class="row g-3">' + [
    ["Yeni sezon", "Planlandı", "Aralık 2026", "Örnek kampanya vitrini"],
    ["Butik tasarımlar", "Aktif", "Kasım 2026", "Sample Content gösterimi"],
    ["Özel koleksiyon", "Tamamlandı", "Ekim 2026", "Arşiv demo kaydı"]
  ].map(function(r){return '<div class="col-lg-4"><div class="bb-profile-method h-100"><span class="material-symbols-outlined" aria-hidden="true">campaign</span><div><strong>'+r[0]+'</strong><small>'+r[1]+' · '+r[2]+'</small><p class="text-body-secondary mt-2 mb-0">'+r[3]+'</p></div></div></div>';}).join("") + '</div>');
}
function pageDocuments() {
  return card("Belgeler", '<p class="text-body-secondary">Örnek belge kayıtları. İndirilecek gerçek dosya bulunmuyor.</p>' +
    table(["Belge adı","Tür","Güncelleme","Durum"],[
      ["Proje planı","PDF","15.11.2026",'<span class="badge bb-badge bb-badge-light-success">Hazır</span>'],
      ["Tema yönergesi","DOCX","12.11.2026",'<span class="badge bb-badge bb-badge-light-primary">Örnek</span>'],
      ["Bileşen envanteri","XLSX","10.11.2026",'<span class="badge bb-badge bb-badge-light-primary">Örnek</span>']
    ]));
}
function pageFollowers() {
  return card("Takipçiler", '<div class="row g-3">' + [
    ["Ayşe Yılmaz","UI Tasarımcı","AY"],
    ["Mehmet Kaya","Frontend Developer","MK"],
    ["Zeynep Demir","Proje Yöneticisi","ZD"],
    ["Deniz Arslan","Ürün Tasarımcısı","DA"]
  ].map(function(r){return '<div class="col-md-6"><div class="bb-profile-method">' +
    '<span class="bb-symbol size-50 is-circle"><span class="bb-symbol-label">'+r[2]+'</span></span>' +
    '<div><strong>'+r[0]+'</strong><small>'+r[1]+'</small></div>' +
    '<span class="badge bb-badge bb-badge-light-primary">Demo</span></div></div>';}).join("")+'</div>');
}
var content = {
  overview:pageOverview, settings:pageSettings, security:pageSecurity,
  activity:pageActivity, billing:pageBilling, statements:pageStatements,
  referrals:pageReferrals, api:pageApi, logs:pageLogs,
  projects:pageProjects, campaigns:pageCampaigns, documents:pageDocuments, followers:pageFollowers
};
outer.innerHTML = profileHero() + '<div data-bb-profile-page-content>' +
  (content[view] || pageOverview)() + '</div>';
var pageTitle = document.querySelector(".bb-page-title");
if (pageTitle) pageTitle.textContent = "User Prifilei / " + title;
var breadcrumb = document.querySelector(".bb-breadcrumb .breadcrumb");
if (breadcrumb) {
  breadcrumb.replaceChildren();
  ["PAGES","User Prifilei",title].forEach(function(t,i,items){
    var li=document.createElement("li");
    li.className="breadcrumb-item" + (i===items.length-1 ? " active":"");
    li.textContent=t;
    if(i===items.length-1)li.setAttribute("aria-current","page");
    breadcrumb.appendChild(li);
  });
}
/* Keep the User Prifilee sidebar group expanded on tabs without direct sidebar links. */
var profileMenuLink = document.querySelector('[data-bb-panel-page="profile-overview"]');
if (profileMenuLink) {
  var groupNode = profileMenuLink.parentElement;
  while (groupNode && !groupNode.hasAttribute("data-bb-panel")) {
    if (groupNode.classList && groupNode.classList.contains("bb-menu-item") && groupNode.hasAttribute("data-bb-menu-trigger")) {
      groupNode.classList.add("show");
      var groupButton = groupNode.querySelector(":scope > .bb-menu-link");
      var groupSub = groupNode.querySelector(":scope > .bb-menu-sub");
      if (groupButton) groupButton.setAttribute("aria-expanded", "true");
      if (groupSub) { groupSub.setAttribute("aria-hidden", "false"); groupSub.inert = false; }
    }
    groupNode = groupNode.parentElement;
  }
}

var form = root.querySelector("[data-bb-profile-form]");
if (form) form.addEventListener("submit",function(event){
  event.preventDefault();
  if (!form.reportValidity()) return;
  var status=form.querySelector("[data-bb-profile-status]");
  if(status) status.textContent="Form doğrulandı. Demo verileri kaydedilmedi.";
});
var follow = root.querySelector("[data-bb-profile-follow]");
if(follow) follow.addEventListener("click",function(){
  var active=follow.getAttribute("aria-pressed")==="true";
  follow.setAttribute("aria-pressed",String(!active));
  follow.textContent=active?"Takip et":"Takip ediliyor";
});
var copy=root.querySelector("[data-bb-profile-copy]");
if(copy) copy.addEventListener("click",function(){
  var status=root.querySelector("[data-bb-profile-status]");
  var input=root.querySelector("#bb_profile_referral");
  if(navigator.clipboard && window.isSecureContext){
    navigator.clipboard.writeText(input.value).then(function(){
      if(status)status.textContent="Demo davet kodu kopyalandı.";
    }).catch(function(){if(status)status.textContent="Kopyalama engellendi. Kod alanından elle kopyalayabilirsiniz.";});
  } else {input.focus();input.select();if(status)status.textContent="Kodu seçip kopyalayabilirsiniz.";}
});
var rule=root.querySelector("[data-bb-profile-rule]");
if(rule)rule.addEventListener("click",function(){
  var status=root.querySelector("[data-bb-profile-status]");
  if(status)status.textContent="Örnek kural görüntülendi; gerçek API kuralı oluşturulmadı.";
});
var toggle=root.querySelector("[data-bb-profile-api-test]");
if(toggle)toggle.addEventListener("change",function(){
  var status=root.querySelector("[data-bb-profile-status]");
  if(status)status.textContent=toggle.checked?"Test modu açık (demo).":"Test modu kapalı (demo).";
});
})();