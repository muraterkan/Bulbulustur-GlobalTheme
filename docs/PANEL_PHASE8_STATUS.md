# Panel Template — Faz 8 teslim

Tarih: 2026-11-15
Dal: `main`

## Faz 7

Approvenan yapı uygulandı: Türkçe, Gösterge Panelleri / Pages / Applications / Layouts, Material Symbols. `modules/panel/pages.html` içerisinde 58 bağlantı var. Slug kimlikleri değişmedi, yalnız görünür adlar Türkçeleştirildi. Menü seçimi `assets/js/bb-panel-pages.js` üzerinden başlık, breadcrumb ve aktif durumu açar.

## Faz 8 — Dashboard

Demo: `modules/panel/dashboard.html`

| Adım | Partial | Gerçekleştirilen |
|---|---|---|
| 8.1 | `layout/_panel-dashboard-kpi.scss` | 4 KPI kartı, değişim etiketleri, hedef gerçekleşme |
| 8.2 | `layout/_panel-dashboard-donut.scss` | Renkleri `--bb-chart-1..4` ile tanımlı halka grafik ve açıklama |
| 8.3 | `layout/_panel-dashboard-calendar.scss` | Haftalık takvim şeridi ve randevu listesi |
| 8.4 | `layout/_panel-dashboard-table.scss` | Proje tablosu, bütçe, ilerleme, durum ve mikro grafik |
| 8.5 | `layout/_panel-dashboard-timeline.scss` | Görev zaman çizelgesi |
| 8.6 | `layout/_panel-dashboard-promo.scss` | Token tabanlı vurgu kartı |

Tüm partial'lar `assets/scss/main.scss` üzerinden derlenecek şekilde bağlandı. Sıfır ilave harici UI bağımlılığı. Dashboard rakamları ve ajanda girişleri **temsili**, canlı veriden çekilmiyor.

## Kod ve statik kontrol

- GitHub üzerinden `pages.html`, `dashboard.html`, `bb-panel-pages.js`, `main.scss`, altı partial tekrar okundu.
- 58 link / 58 benzersiz ID; JS'de 58 kayıt ve eşleşmeyen link/ID yok.
- Dört menü bölümü, yardımcı menü kaldırıldı.
- Her iki HTML dosyasında ana açılış/kapanış etiket sayıları eşleşti.
- `bb-panel-pages.js` sözdizimi V8 ile kontrol edildi.
- Dashboard'da altı widget sınıfı bulunuyor ve altı SCSS `@use` kaydı doğrulandı.
- `npm run build:css`, `npm run check:contracts`, `npm run check:css`, gerçek browser responsive/klavye ve açık/koyu tema testleri **bu değişiklikler için çalıştırılmadı**.
- Usernın daha önce sağladığı başarılı 22/22 kontrat çıktısı **Faz 7/8 değişikliklerini kapsamıyor**.
- Derlenmiş `assets/css/main.css` repoya gönderilmedi.

## Murat'ın yapacakları

```powershell
cd C:\DEV\FRONTENT\Bulbulustur-GlobalTheme
git pull origin main
npm run build:css
npm run check:contracts
git add assets/css/main.css
git commit -m "build(css): faz 7 ve 8 derlenmiş panel stilleri"
npm run check:css
```

Gerçek tarayıcıda `modules/panel/dashboard.html` ve `modules/panel/pages.html?page=ecommerce-products` sayfaları açılmalı; light/dark, desktop sidebar collapse, mobile drawer, klavye odak ve tüm grafik/tablo düzenleri kontrol edilmeli.

## Sıradaki iş

Faz 9: liste/tablo sayfaları (sıralama, seçim, satır işlemleri, filtreleme, sayfalama). User talimatına kadar Faz 9'a başlanmaz.
