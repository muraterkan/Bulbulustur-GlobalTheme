# Panel Template — Faz 1 Teslim ve Kontrol

Tarih: 2026-11-15

## Yapılanlar

- `assets/scss/layout/_panel-shell.scss`: mevcut `bb-app`, `bb-sidebar`, `bb-shell`, `bb-main`, `bb-toolbar`, `bb-footer` sınıfları üzerinden responsive panel kabuğu; desktop ikon-only mod; mobil off-canvas/sidebar backdrop.
- `assets/scss/main.scss`: `@use "layout/panel-shell";` bağlantısı.
- `assets/js/bb-panel.js`: `data-bb-*` tabanlı açma/kapatma, daraltma, Escape, klavye odak yönetimi, mobil kapalı sidebar için `inert`, `aria-expanded` ve `aria-pressed`.
- `assets/js/bb-panel-theme.js`: demo için açık/koyu tema anahtarı.
- `modules/panel/shell.html`: boş panel sayfası Example (header/sidebar/toolbar/content/footer). Menü ağacı Faz 2'de.

## Doğrulama

- GitHub'a dosyalar yazıldı ve yeniden okundu; `main.scss` bağlantısı doğrulandı.
- JavaScript dosyalarının sözdizimi V8 `Function` ayrıştırmasıyla kontrol edildi, hata yok.
- **Çalıştırılamadı:** `npm run build:css`, `npm run check:contracts`, `npm run check:css`, browser'da responsive/light/dark/klavye etkileşimi. Bu ortamda GitHub'a bağlantı connector üzerinden sağlanıyor; yerel `git clone` DNS nedeniyle gerçekleşmedi, Sass kurulumu yok. Dolayısıyla `assets/css/main.css` henüz yeniden derlenmedi. Demo yeni panel stillerini yerel CSS derlemesinden sonra gösterecek.

## Murat'ın doğrulayacağı

```bash
npm ci
npm run build:css
npm run check:contracts
npm run check:css
```

`modules/panel/shell.html` bir yerel HTTP sunucusunda açılarak açık/koyu tema, mobil aç/kapat, Escape, Tab ve desktop daraltma kontrol edilmeli. `main.css` derleme çıktısı repoya eklenmeli.

## Dokunulmadı

- `base/_zindex.scss`, dokuz fallback kancası, `forms-final`, `product-quick-view`, mevcut component/menu davranışları.

## Sıradaki faz

Faz 2: sidebar menü ağacı ve çok seviyeli navigasyon. Faz onayı olmadan başlanmaz.
