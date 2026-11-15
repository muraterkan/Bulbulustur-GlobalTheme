# GlobalTheme Panel — Destek Merkezi

Tarih: 2026-11-16
Dal: `main`

## Geliştirilen

- `modules/panel/destek-merkezi.html`: Metronic referansındaki karşılama/arama alanı, 6 sekme (Genel Bakış, Talepler, Eğitimler, SSS, Lisanslar, İletişim), Popüler Talepler/SSS/Eğitimler/Videolar/Dokümantasyon kartları ve örnek destek talebi formu.
- `assets/scss/layout/_panel-support.scss`: yalnız panel Support Center kapsamında responsive yerleşim, soru/cevap ve arama tasarımı. Ana `bb-card`, Bootstrap form ve semantik renk/spacing tokenları korunur.
- `assets/js/bb-panel-support.js`: sekme geçişi, soru arama, açılır cevaplar, talep formu istemci doğrulaması, başlık/breadcrumb düzeni.
- `assets/scss/main.scss`: SCSS partial import edildi.
- Panel sidebar'larında `support-tickets` ve `support-faq` bağlantıları `destek-merkezi.html?tab=tickets` ve `destek-merkezi.html?tab=faq` adreslerine yönlendirildi.

## Kapsam

Bu statik demo gerçek destek talebi oluşturmaz, e-posta/API gönderimi yapmaz, video oynatıcı uydurmaz. Videolar kartında kaynak bağlı olmadığını belirtir. Dokümantasyon alanı mevcut component ve panel demo sayfalarına link verir. Görsellerdeki özel Metronic illüstrasyonu kopyalanmadı; mevcut Material Symbols ile temsil edildi.

## Kaynak kontrolü

- Yeni HTML'de açık/kapalı etiket sayımları eşleşti.
- Tekrarlı `id` ve eksik `aria-controls` hedefi: yok.
- 6 tab/tabpanel bağlantısı var, JS V8 sözdizimi kontrolünden geçti.
- CSS partial, `main.scss` içinde.
- **Henüz yerel Sass derlemesi, `check:panel`, `check:contracts`, `check:css` ve tarayıcı görünümü test edilmedi.**

## Kullanıcı testi

```powershell
git pull origin main
npm run build:css
npm run check:panel
npm run check:contracts
```

VS Code Live Server ile `modules/panel/destek-merkezi.html` aç. 6 sekme, örnek arama, açılır soru cevapları, Talepler/SSS sidebar yönlendirmeleri, talep formu ve mobil/dark/light görünümünü test et.

Derleme başarılı olursa `assets/css/main.css` için commit ve push; ardından `npm run check:css`.
