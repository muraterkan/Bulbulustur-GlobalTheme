# GlobalTheme CSS Analizi — 15.11.2026

Kapsam: yalnız CSS/SCSS (core: `main.scss` ile derlenen 70+ partial). Flag/avatar medyası ve örnek (demo) sayfalar kapsam dışı, yerinde kalır.
Yöntem: `main.scss` → sass 1.93.2 ile derlenen çıktı postcss ile ayrıştırıldı; SCSS dosyaları tek tek tarandı; html/cshtml/js ve diğer repolarda çağrı araması yapıldı.

## A. Gerçek hatalar (düzeltilecek)

| # | Yer | Sorun | Etki | Çağıran var mı? / Karar |
|---|-----|-------|------|-------------------------|
| A1 | `components/_inputmask.scss:20` | `--bb-inputmask-hint-font-size: (--bb-fs-sm)` — noktalı virgül yok, değer bozuk. Sonraki satır (`--bb-inputmask-hint-color`) bu bildirime yutuluyor, çıktıda tanımsız kalıyor. | Hint yazısının boyutu ve rengi uygulanmıyor. | `.bb-inputmask-hint` kullanıyor. DÜZELT: `var(--bb-fs-sm);` |
| A2 | `components/_rating.scss:24`, `_dialer.scss:34` | `--bb-*-focus-ring: var(--bs-focus-ring-box-shadow)` fallback'siz. Bootstrap 5.3 bu değişkeni tanımlamıyor. | Klavye odak halkası (focus) görünmüyor. | `_menu`, `_modals`, `_nav` aynı değişkeni fallback ile kullanıyor. DÜZELT: aynı fallback eklenecek. |
| A3 | `components/_carousel.scss:28` | `var(--bb-dark, var(--bs-black))` iç fallback `--bs-black` Bootstrap'ta tanımlı ama GlobalTheme kendi başına bu fallback'e bağımlı olmamalı. | Bugün etkisi yok (`--bb-dark` her zaman tanımlı). | DÜZELT: `var(--bb-black)` (token kendi içinde). |

## B. Yapısal sorunlar (düzeltilecek)

| # | Sorun | Doğrulama | Karar |
|---|-------|-----------|-------|
| B1 | `main.scss`'te `@use` edilmeyen 11 partial: `product-gallery`, `product-gallery-sef`, `product-rail-sef`, `product-filter-sef`, `product-item-sef`, `auth-sef`, `layout-sef`, `layout/_hero`, `utilities/_sticky1`, `base/_colors` (0 satır), `utilities/_transition` (0 satır) | `@use/@import/@forward` ile başka scss'ten çağrılmıyor. `package.json`/CI çağırmıyor. Diğer repolarda yalnız sınıf adları geçiyor (Draugr şablonu/Ortobella kendi CSS'ini derliyor, bu partial'ları çağırmıyor). `_sticky1` ile `components/_sticky` aynı 14 seçiciyi tanımlıyor; `_sticky1`'de eşsiz sınıf yok. `layout-sef` içindeki `.bb-empty-state` zaten `_empty-state`'te var. | SİL (git geçmişinde kalır). |
| B2 | `scss/pages/admin.bulbulustur.com/media` (292 dosya) | `assets/media` ile birebir aynı (`diff -rq` farksız). | Mükerrer kopya SİL; flag/avatar `assets/media`'da kalır. |
| B3 | `scss/pages/admin.bulbulustur.com/pages/account` | `pages/demo1/account` ile birebir aynı. | Mükerrer kopya SİL. |
| B4 | `scss/pages/.../js` altında 6 JS | SCSS kaynağı olmayan klasörde. Demo sayfaları `assets/js/...` altından çağırıyor; `bb-lightbox.js` zaten `assets/js`'te (birebir aynı), `bb-dialer`/`bb-toast`/`bb.drawer` orada YOK → demolar bozuk. | `assets/js`'e taşı; lightbox kopyasını sil. |
| B5 | Demo script yolları: `lightbox.html` `../../../../assets/js/` (repo dışına çıkıyor), `dialer.html` `/assets/js/components/bb-dialer.js` | Dosya bu yollarda yok. | Yollar `assets/js`'e düzeltilecek. |
| B6 | ChatGPT'nin `scripts/check-helix-contracts.mjs` ve `check:css`/`check:contracts` komutları yeni repoya gelmedi. | Eski `helix/ana`'da var. | Yeni repoya uyarlanmış sürümü eklenecek (ölü partial koruması dahil). |

## C. Kontrol edildi, hata DEĞİL

- Derleme çıktısında aynı seçici + aynı bağlamda tamamen aynı bildirim: 0. Birleşmemiş çok bloklu seçiciler (`.bb-menu` 16, `.bb-accordion` 6, `.bb-carousel` 5, `.btn-group.bb-btn-group` 4): bloklar yalnız yorum içeren boş kural; aralarında çakışan property yok.
- Boş kural: 31, hepsi yorum satırından geliyor, zararsız.
- `min-width/min-height: auto`: geçerli CSS (`max-*: auto` hatası ChatGPT düzeltmesiyle 0).
- Aynı `:root` bağlamında çift `--bb-*` tanımı: ardışık `rgba(...)` → `color-mix(...)` fallback çiftleri (bilinçli ilerleyici iyileştirme).
- `--bs-*` kullanımı: demolar Bootstrap 5.3.8 yüklüyor; GlobalTheme Bootstrap üstüne yazılıyor (`.btn`, `.form-control`, `.btn-group` yeniden tanımları bundan).
- 197 CSS içinde kullanılmayan `--bb-*` değişkeni: token kütüphanesi, hata değil.
- 9 tanımsız `--bb-*` (`--bb-header-height`, `--bb-layout-gap`, `--bb-main-max-width`, `--bb-radius-md`, `--bb-shell-header-height`, `--bb-wrapper-padding-top-spaced`, `--bb-overlay-color`, `--bb-overlay-blur`, `--bb-letter-spacing-tight`): hepsi fallback ile çağrılıyor, dışarıdan ayar kancası. Değişiklik yok.
- `!important` 1031: çoğu `utilities/` (text 76, border 60, transform 36...). Utility için normal.

## D. Murat kararı gereken (dokunulmadı)

| # | Konu | Not |
|---|------|-----|
| D1 | `base/_zindex.scss` derlenmiyor | Değerleri Bootstrap ölçeğiyle çakışır (sticky 100 / drawer 900 / modal 1000; Bootstrap 1020/1055). Derlenirse z-index davranışı değişir. Şimdilik fallback'ler (1020/1055) geçerli. |
| D2 | `components/forms-final` | ChatGPT sözleşmesinde ana girişten ayrıydı; senin `main.scss`'inde "Final Overrides" olarak bağlı. |
| D3 | `components/product-quick-view` (579 satır) | Panel için gerekmeyebilir; "sonra bakarız" demiştin. |
| D4 | `js/bb-modal.js` | ES module (`export class`), hiçbir sayfa/repo çağırmıyor; Bootstrap modal kullanılıyor. `assets/js`'e taşınır, silinmez. |
| D5 | Eski depoya (`muraterkan/bulbulustur.theme`) işaret eden yerler | `draugr.ortobella/RawTemplate/Styles/theme.lock.json` ve AI bilgi SQL'leri (`20261102`, `20261106`, `20261111`) "Tema deposu = bulbulustur.theme main" diyor; Draugr hattı main.css'i oradan klonluyor. Eski depo `e7836fd`'e geri alındı. Karar: Draugr main.css kaynağı hangi depo olacak? |
| D6 | 9 tanımsız `--bb-*` kanca | Panel şablonunda token olarak tanımlamak istersen eklenir. |

## E. Uygulama kaydı (15.11.2026)

- A1, A2, A3 düzeltildi. Derleme çıktısında tam 4 bildirim değişti, başka fark yok.
- B1: 11 ölü partial silindi (derleme çıktısı değişmedi). B2/B3: mükerrer media ve pages silindi. B4/B5: 5 JS `assets/js`'e taşındı, lightbox kopyası silindi, demo yolları düzeltildi. B6: `scripts/check-contracts.mjs` + `npm run check:contracts` / `check:css` eklendi (16/16 geçti; yapay yetim partial ile FAIL verdiği görüldü).
- Derleme: sass 1.93.2, uyarısız, 451838 → 451982 bayt.
- Yapılmadı: tarayıcıda görsel kontrol; D1–D6 kararları.

## F. Ek bulgu (renk paketi çalışmasında)

- D7: `themes/_token-engine.scss` ile `base/_theme.scss` aynı türetilmiş tokenları (`--bb-primary-hover/active/light/clarity`, `--bb-link-color`) tanımlıyor. `html[data-bs-theme]` varsa base (özgüllük 0,1,1) kazanıyor; öznitelik yoksa token-engine kazanıyor. Doğrulama: `data-bs-theme="light"` ile `--bb-primary-hover` = `#e6c300` (base değeri), token-engine'in %90 karışımı değil. Tek sahip seçilmeli (karar bekliyor, dokunulmadı).
- Renk paketi `atolye` eklendi: `themes/_pack-atolye.scss`, demo `modules/pack-atolye.html`. Paket seçilmezse çıktı değişmez (`?pack=off` ile sarı varsayılan doğrulandı).

### D7 çözümü (15.11.2026)

Karar: türetilmiş durum tokenlarının (`--bb-*-hover/active/light/clarity`, 8 renk) TEK sahibi `themes/_token-engine.scss`. `base/_theme.scss` ve renk paketleri yalnız girdi verir.
- `base/_theme.scss`: 72 türetilmiş satır silindi (açık + koyu).
- `themes/_token-engine.scss`: base ile birebir aynı alias (`--bb-primary: var(--bb-theme-primary)`...) ve inverse blokları silindi; link tokenları kaldırıldı (engine'de link = primary idi, öznitelik yokken sarı link üretiyordu; link base/paket sahipliğinde); `dark-*` türevleri sabit `--bb-coal-300` yerine `--bb-dark` tabanlı.
- `themes/_pack-atolye.scss`: 34 türev satır silindi, yalnız girdi kaldı.
- Doğrulama (Chrome headless, 6 yapılandırma × 36 token, önce/sonra): `data-bs-theme` yokken yalnız link (sarı → mavi `#1d4ed8`) ve `dark-*` değişti. Açık temada hover/active/light değerleri engine formülüne geçti: örn. `danger-hover` `#b91c1c` → `#d73d3d` (daha yumuşak), `success-light` düz `#dcfce7` → %12 saydam yeşil. Yeşil/mavi/kırmızı hover'ın daha koyu olması istenirse `--bb-hover-mix` oranı engine'de tek yerden ayarlanır.
- Sözleşme: 4 yeni kontrol (türev tokenlar yalnız engine'de).
