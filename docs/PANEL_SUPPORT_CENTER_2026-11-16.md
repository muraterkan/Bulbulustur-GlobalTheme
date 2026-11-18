# GlobalTheme Panel — Support Center

Date: 2026-11-16
Dal: `main`

## Geliştirilen

- `modules/panel/support-center.html`: Bulbulustur referansındaki karşılama/arama alanı, 6 sekme (Overview, Requests, Trainings, SSS, Licenses, Contact), Popular Requests/SSS/Trainings/Videos/Dokümantasyon kartları ve örnek destek talebi formu.
- `assets/scss/layout/_panel-support.scss`: yalnız panel Support Center kapsamında responsive yerleşim, soru/cevap ve arama tasarımı. Ana `bb-card`, Bootstrap form ve semantik renk/spacing tokenları korunur.
- `assets/js/bb-panel-support.js`: sekme geçişi, soru arama, açılır cevaplar, talep formu istemci doğrulaması, başlık/breadcrumb düzeni.
- `assets/scss/main.scss`: SCSS partial import edildi.
- Panel sidebarsında `support-tickets` ve `support-faq` bağlantıları `support-center.html?tab=tickets` ve `support-center.html?tab=faq` adreslerine yönlendirildi.

## Kapsam

Bu statik demo gerçek destek talebi oluşturmaz, e-posta/API gönderimi yapmaz, video oynatıcı uydurmaz. Videos kartında kaynak bağlı olmadığını belirtir. Dokümantasyon alanı mevcut component ve panel demo sayfalarına link verir. Görsellerdeki özel Bulbulustur illüstrasyonu kopyalanmadı; mevcut Material Symbols ile temsil edildi.

## Kaynak kontrolü

- New HTML'de açık/kapalı etiket sayımları eşleşti.
- Tekrarlı `id` ve eksik `aria-controls` hedefi: yok.
- 6 tab/tabpanel bağlantısı var, JS V8 sözdizimi kontrolünden geçti.
- CSS partial, `main.scss` içinde.
- **Henüz yerel Sass derlemesi, `check:panel`, `check:contracts`, `check:css` ve tarayıcı görünümü test edilmedi.**

## User testi

```powershell
git pull origin main
npm run build:css
npm run check:panel
npm run check:contracts
```

VS Code Live Server ile `modules/panel/support-center.html` aç. 6 sekme, örnek arama, açılır soru cevapları, Requests/SSS sidebar yönlendirmeleri, talep formu ve mobil/dark/light görünümünü test et.

Derleme başarılı olursa `assets/css/main.css` için commit ve push; ardından `npm run check:css`.
