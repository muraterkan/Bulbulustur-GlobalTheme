# Kullanıcı Profili — Metronic referanslı tam demo sayfalar

Tarih: 2026-11-16
Dal: `main`

## Uygulanan ortak profil düzeni

Metronic referans görsellerindeki düzen esas alındı. Tek `assets/js/bb-panel-profile.js` bütün profil ekranlarının ortak kimlik kartını, yatay 9 sekmeli menüsünü ve ilgili içerik bölümünü oluşturuyor. HTML dosyaları mevcut panel shell/toolbar/header/sidebar/footer sistemini koruyor.

Ortak kart: kare avatar ve aktiflik göstergesi, ad/doğrulama ikonu, rol/konum/e-posta meta bilgileri, Takip et/Profili Düzenle aksiyonları, üç KPI ve %50 örnek profil tamamlanma çubuğu.

Stiller ayrı, bağımsız bir tema olarak değil `assets/scss/layout/_panel-account.scss` içinde bb-card, bb-table, bb-nav, bb-symbol, Bootstrap form ve var olan `bb-*` renk/spacing tokenlarına dayanır. Aynı tanımsız spacing isimleri yaratılmadı.

## 9 profil sekmesi

| Sekme | Dosya | İçerik |
|---|---|---|
| Genel Bakış | `modules/panel/profil.html` | Profil bilgileri, durum ve bilgilendirme kartı |
| Ayarlar | `modules/panel/profil-ayarlar.html` | Gerçek form alanları, tarayıcı doğrulaması |
| Güvenlik | `modules/panel/profil-guvenlik.html` | Özet metrikler, grafik, uyarı kartları ve oturum tablosu |
| Etkinlik | `modules/panel/profil-etkinlik.html` | Zaman çizelgesi ve etkinlik metrikleri |
| Faturalandırma | `modules/panel/profil-faturalandirma.html` | Abonelik, kullanıcı kota barı, örnek ödeme yöntemleri |
| Ekstreler | `modules/panel/profil-ekstreler.html` | Dönemsel örnek ekstre tablosu |
| Referanslar | `modules/panel/profil-referanslar.html` | Davet kodu, kopyalama aksiyonu, metrikler |
| API Anahtarları | `modules/panel/profil-api.html` | API genel bakış, test modu, geliştirici araçları, 2FA notu |
| Kayıtlar | `modules/panel/profil-kayitlar.html` | Denetim kayıtları tablosu |

## Mevcut profil sidebar bağlantıları

Önceden yapım aşaması şablonuna giden aşağıdaki profil alt menülerinin her biri için ayrıca içerik sayfası oluşturuldu:

- `profil-projeler.html`: proje listesi ve istatistik
- `profil-kampanyalar.html`: kampanya kartları
- `profil-belgeler.html`: belge tablosu
- `profil-takipciler.html`: takipçi kartları

Böylece toplam 13 profil HTML sayfası oluştu. Profil sidebar linkleri 14 panel shell dosyasında gözden geçirildi; ilgili eski placeholder linkleri gerçek sayfalara geçirildi. Menü kimlikleri `assets/js/bb-panel-pages.js` içinde tutulur.

## Demo / gerçek işlev sınırları

Tüm kişiler, metrikler, oturum kayıtları, kart maskelemesi, API URL ve durumlar örnektir. Gerçek ödeme bilgisi, API anahtarı, güvenlik kaydı ya da kimlik doğrulama verisi kullanılmaz. Ayarlar kaydetmez; demo kopyalama ve takip işlemi tarayıcı oturumunda gerçekleşir. Güvenlik grafiği ve ödeme bilgileri örnek değerlerle gösterilir.

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

Live Server ile `modules/panel/profil.html` açıp profil kartının avatar/istatikler/sekme yerleşimini ve 9 sekme bağlantısının farklı içerik açtığını kontrol et. Özellikle `profil-guvenlik.html`, `profil-faturalandirma.html`, `profil-api.html` ve 375px mobil görünümünü Metronic ekranlarıyla karşılaştır.

```powershell
git add assets/css/main.css
git commit -m "build(css): user profile Metronic layout"
npm run check:css
git push origin main
```

Gerçek tarayıcı kabulü geçene kadar profil tasarımı görsel olarak doğrulanmış sayılmaz.
