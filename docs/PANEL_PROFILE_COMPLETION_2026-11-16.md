# User Profili — Metronic referanslı tam demo sayfalar

Tarih: 2026-11-16
Dal: `main`

## Uygulanan ortak profil düzeni

Metronic referans görsellerindeki düzen esas alındı. Tek `assets/js/bb-panel-profile.js` bütün profil ekranlarının ortak kimlik kartını, yatay 9 sekmeli menüsünü ve ilgili içerik bölümünü oluşturuyor. HTML dosyaları mevcut panel shell/toolbar/header/sidebar/footer sistemini koruyor.

Ortak kart: kare avatar ve aktiflik göstergesi, ad/doğrulama ikonu, rol/konum/e-posta meta bilgileri, Takip et/Profle Edit aksiyonları, üç KPI ve %50 örnek profil tamamlanma çubuğu.

Stiller ayrı, bağımsız bir tema olarak değil `assets/scss/layout/_panel-account.scss` içinde bb-card, bb-table, bb-nav, bb-symbol, Bootstrap form ve var olan `bb-*` renk/spacing tokenlarına dayanır. Aynı tanımsız spacing isimleri yaratılmadı.

## 9 profil sekmesi

| Sekme | Dosya | İçerik |
|---|---|---|
| Genel Bakış | `modules/panel/profile.html` | Profil bilgileri, durum ve bilgilendirme kartı |
| Settings | `modules/panel/profile-settings.html` | Gerçek form alanları, tarayıcı doğrulaması |
| Security | `modules/panel/profile-security.html` | Summary metrikler, grafik, uyarı kartları ve oturum tablosu |
| Activity | `modules/panel/profile-activity.html` | Zaman çizelgesi ve etkinlik metrikleri |
| Invoicelandırma | `modules/panel/profile-billing.html` | Subscription, kullanıcı kota barı, örnek ödeme yöntemleri |
| Ekstreler | `modules/panel/profile-statements.html` | Dönemsel örnek ekstre tablosu |
| References | `modules/panel/profile-referrals.html` | Davet kodu, kopyalama aksiyonu, metrikler |
| API Anahtarları | `modules/panel/profile-api.html` | API genel bakış, test modu, geliştirici araçları, 2FA notu |
| Logs | `modules/panel/profile-logs.html` | Denetim kayıtları tablosu |

## Mevcut profil sidebar bağlantıları

Önceden yapım aşaması şablonuna giden aşağıdaki profil alt menülerinin her biri için ayrıca içerik sayfası oluşturuldu:

- `profile-projects.html`: proje listesi ve istatistik
- `profile-campaigns.html`: kampanya kartları
- `profile-documents.html`: belge tablosu
- `profile-followers.html`: takipçi kartları

Böylece toplam 13 profil HTML sayfası oluştu. Profil sidebar linkleri 14 panel shell dosyasında gözden geçirildi; ilgili eski placeholder linkleri gerçek sayfalara geçirildi. Menü kimlikleri `assets/js/bb-panel-pages.js` içinde tutulur.

## Demo / gerçek işlev sınırları

Tüm kişiler, metrikler, oturum kayıtları, kart maskelemesi, API URL ve durumlar örnektir. Gerçek ödeme bilgisi, API anahtarı, güvenlik kaydı ya da kimlik doğrulama verisi kullanılmaz. Settings kaydetmez; demo kopyalama ve takip işlemi tarayıcı oturumunda gerçekleşir. Security grafiği ve ödeme bilgileri örnek değerlerle gösterilir.

## Kontroller

- 13 HTML sayfası GitHub üzerinden tekrar okunarak `data-bb-profile-view` ve statik etiket dengeleri doğrulandı.
- 13 içerik fonksiyonu, 9 yatay sekme ve kullanılan sayfa kimlikleri kontrol edildi.
- `bb-panel-profile.js` ve `bb-panel-pages.js` V8 sözdizimi kontrolünü geçti.
- SCSS'teki tanımsız `--bb-space-5` referansları mevcut token bileşimine değiştirildi.
- **Henüz bu değişikliklerden sonra Sass build, `check:panel`, `check:contracts`, `check:css` veya gerçek tarayıcı görünümü çalıştırılmadı.** Bunlar yerel kabul kontrolünde tamamlanmalı.

## Yerel test

```powershell
git pull origin main
npm run build:css
npm run check:panel
npm run check:contracts
```

Live Server ile `modules/panel/profile.html` açıp profil kartının avatar/istatikler/sekme yerleşimini ve 9 sekme bağlantısının farklı içerik açtığını kontrol et. Özellikle `profile-security.html`, `profile-billing.html`, `profile-api.html` ve 375px mobil görünümünü Metronic ekranlarıyla karşılaştır.

```powershell
git add assets/css/main.css
git commit -m "build(css): user profile Metronic layout"
npm run check:css
git push origin main
```

Gerçek tarayıcı kabulü geçene kadar profil tasarımı görsel olarak doğrulanmış sayılmaz.
