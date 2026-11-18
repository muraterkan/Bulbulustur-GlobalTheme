# Panel Template — Faz 0 Envanter

Tarih: 2026-11-15  
Depo: `muraterkan/Bulbulustur-GlobalTheme` / `main`

## Examinenen kaynaklar

- `assets/scss/main.scss`, `layout/_layout.scss`, `_sidebar.scss`, `_header.scss`, `_toolbar1.scss`, `_footer.scss`
- `components/_menu.scss`, `_dropdowns.scss`, `_drawer.scss`, `_cards.scss`
- `base/_theme.scss`, `base/_page.scss`, `base/_zindex.scss`
- `modules/components/menu.html`, `pages/demo1/account/overview.html`, `modules/panel-tokens.html`
- `docs/CSS_ANALYSIS_2026-11-15.md`, `package.json`

## Var olan parçalar

| Parça | Depodaki durum | Fazlarda kullanılacak yol |
|---|---|---|
| Temel iskelet | `.bb-app`, `.bb-shell`, `.bb-main`, `.bb-main-inner`, `.bb-content` mevcut | Faz 1 mevcut kabuğu tamamlar; ikinci kabuk yazılmaz |
| Sidebar | `.bb-sidebar` ile header/body/footer mevcut | Faz 1 mobil/daraltma; Faz 2 menü içeriği |
| Header | `.bb-header`, `.bb-header-nav`; ayrıca `.bb-shell-header` mevcut | Faz 3 üst menü ve aksiyonlar |
| Toolbar | `.bb-toolbar`, `.bb-toolbar-row` mevcut | Faz 5 varyantları |
| Footer | `.bb-footer`, `.bb-footer-bar` mevcut | Faz 1 Examplende kullanılır |
| Menü | `.bb-menu`, accordion/submenu/bullet/arrow stilleri mevcut | Faz 2, eksik davranışın JS ile bağlanması |
| Dropdown / drawer | `.bb-dropdown-menu`, `.bb-drawer`, backdrop mevcut | Faz 3–4 |
| Kart / formlar | `.bb-card` ve bileşen seti mevcut | Faz 8+; kabuk sırasında kopyalanmaz |
| Tokenlar | `base/_theme.scss`, `themes/_token-engine.scss` | Tüm fazlarda öncelikli |
| Demolar | `modules/components/menu.html` ve `pages/demo1/account/*.html` | Mevcut markuplar örnek olarak alınır, kopya tema oluşturulmaz |

## Eksik veya karar bekleyen

1. Mobil sidebar aç/kapat, ikon-only daraltma modu ve klavye durum yönetimi Faz 1 için hazırlanmalı. `assets/js/` altında ayrı bir panel-menü script'i mevcut değil.
2. Sidebar menü ağacı ve aktif rota için ortak demonstrasyon Faz 2'de hazırlanmalı; panelin mevcut menu.html Example davranış kalıbıdır.
3. `--bb-header-height`, `--bb-layout-gap`, `--bb-main-max-width`, `--bb-radius-md`, `--bb-shell-header-height`, `--bb-wrapper-padding-top-spaced`, `--bb-overlay-color`, `--bb-overlay-blur`, `--bb-letter-spacing-tight` dışarıdan verilebilen fallback kancalarıdır. `CSS_ANALYSIS_2026-11-15.md` bunları bilinçli ve şimdilik değişmeyecek olarak belgeliyor. Faz 1'de gereksiz yere tanımlanmaz; farklı karar gerekiyorsa mimar onayı alınır.
4. `base/_zindex.scss` `main.scss` içinden kullanılmıyor; Bootstrap ölçeğiyle çakışma riski var. Onaysız bağlanmaz.
5. `forms-final` ve `product-quick-view` şimdilik dokunulmaz.
6. Planın açık kararları: ikon seti, menü başlıklarının dili, ilk sürüm menü kapsamı.

## Faz dosya planı

- Faz 1: `assets/scss/layout/_panel-shell.scss`, `modules/panel/shell.html`, gerekli olursa `assets/js/bb-panel.js`; `main.scss` üzerinden bağlanır.
- Faz 2: `assets/scss/layout/_panel-sidebar.scss`, `modules/panel/sidebar.html`. Menü nesnesi için mevcut `bb-menu` kullanılacak; yeni bağımsız menü sistemi kurulmayacak.
- Faz 3–6: Ayrı SCSS partial + `modules/panel/<faz>.html`; mevcut header/dropdown/drawer/toolbar/footer sınıflarını tamamlayan kurallar.
- Faz 7: Onaylı menü ağacı belgesi ve boş sayfa şablonları.
- Faz 8 ve sonrası: İçerik bileşenleri ve sayfa demoları.

## Kontrol ve geçiş

Faz 0 yalnız inceleme ve dokümantasyon; CSS, JS ve HTML çalışması yapılmadı. Derleme ve test çalıştırılmadı. `IS_PLANI.md` uyarınca Faz 1'e geçiş için onay beklenir; sonraki fazlar da kendi başına onaylanır.
