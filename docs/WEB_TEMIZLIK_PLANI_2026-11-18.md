# Web katmanı temizlik planı (18.11.2026)

Karar (Murat): Core + Panel + Status yeni Global temadır. Web katmanı buna uyarlanır, Web'e özgü fazlalıklar temizlenir; ilk başta hata olması sorun değil. Kaynak: ChatGPT analizi + repo doğrulaması (Claude).

Genel hüküm: Core motoru doğru çalışıyor. Web SCSS (194 import edilen dosya, ~2,1 MB) çoğunlukla kendi ad alanında (`bb-account-*`, `bb-b2b-*`, `bb-b2c-*`, `bb-web-*`, `bb-company-*`, `bb-store-*`). Sorun: birkaç global override, kopya dosyalar, `!important` ve sabit renk borcu.

## Durum

| # | İş | Durum | Not |
|---|----|-------|-----|
| P0-1 | `.bb-section` Web override'ını kapsamla | YAPILDI | `web-page-sections.scss`: 4 temel + 2 responsive kural `:where(.bb-web-page) .bb-section…` oldu (özgüllük eskisiyle aynı). Core `.bb-section` (base/_page.scss) artık ezilmiyor. Status'taki `section.bb-section` 3rem boşluk almıyor. Web `<body class="bb-web-page">` `_Layout`, `_LayoutLight`, form pilotunda var; `_LayoutMain` ve `_LayoutSupport` gövdesinde YOK (şu an hiçbir görünüm bunları kullanmıyor). |
| P0-2 | `web.scss` Bootstrap container bridge kopyası | YAPILDI | `themes/_bootstrap-bridge.scss` ile birebir aynıydı (30px / 1200 / 1430). Silindi. `bb-web-container` bloğu korundu. |
| P1-3 | Boş 3 import + dosya | YAPILDI | `_supplier.scss`, `b2c-home.scss`, `components/_b2c-product-customer-question.scss` (0 bayt) silindi, `@use` satırları kalktı. |
| P1-4 | Orphan dosyalar | YAPILDI (10/11) | Silinen: `_b2c-special`, `_cookie-settings`, `_order-detail`, `account-orders`, `b2b-page`, `b2c-product-reviews222222`, `components/_b2c-popular-product-categories`, `components/_b2c-product-reviews`, `components/_b2c-product-reviews1`, `web-page-main`. Kontrol: dosyalardaki sınıfların hepsi derlenmiş CSS'te var veya Web görünümlerinde kullanılmıyor; derlenmiş `main.css` silme öncesi ve sonrası birebir aynı. |
| P1-5 | `b2c-special222222222222222222222.scss` | AÇIK | Import edilmiyor ama 4 sınıfı görünümlerde kullanılıyor ve aktif CSS'te yok: `bb-b2c-special-empty-icon`, `-empty-link`, `-pagination-wrap`, `-stage-label`. Dosya bilerek silinmedi. Bu 4 sınıf aktif b2c special dosyasına taşınıp dosya silinecek. |
| P1-6 | Import adı sadeleştirme | YAPILDI | `.scss` uzantılı ve `_` önekli 4 `@use` düzeltildi. |
| P2-7 | Aynı bileşenin iki kuşağı: `components/b2c-popular-product-categories111.scss` (aktif) ile kök `_b2c-popular-product-categories.scss` (aktif) | AÇIK | Selector'ların ~%63'ü ortak. Web markup'ına göre güncel olan seçilip tek dosyaya düşürülecek; `111` adı kalkacak. |
| P2-8 | `b2c-product-reviews.scss` (aktif, 30 KB, 37 `!important`) | AÇIK | Eski kuşaklar silindi. Sayfa sayfa `!important` sadeleştirme. |
| P2-9 | `:root` token sızıntısı | AÇIK | `b2c-product-reviews.scss` ve `components/_b2c-product-detail-review.scss` içindeki `--bb-b2c-review-*` tokenları `.bb-b2c-review-page` altına, koyu tema `[data-bs-theme="dark"] .bb-b2c-review-page` altına alınacak. Önce Web markup'ında bu sınıfın tüm yerlerde olduğu doğrulanacak. |
| P3-10 | `!important` borcu | AÇIK | En yüksekler: `b2c-product-reviews` 37, `b2c-product-details` 35, `_web-header` 28, `_help` 22, `order-contract` 19, `home` 17, `us-blog` 17, `_b2c-product-list-filters` 16, `order-checkout` 14. Toplu silme yok; sayfa sayfa, görünüm doğrulamasıyla. |
| P3-11 | Sabit renk borcu | AÇIK | En çok: `b2b-category-page` 62, `_b2b-homepage-slider` 53, `b2b-special` 42, `b2b-home` 32, `_b2b-homepage-stats` 30, `_help` 30, `_cookie-consent-banner` 29, `components/product-card` 28. `product-card` renkleri önce bileşen tokenına (`--bb-product-card-sale-color` vb.), mümkünse Core semantic tokenına bağlanır. B2B hero sahneleri tasarım rengi olarak kalabilir. |
| P4-12 | Paket mimarisini ayırma | AÇIK (en son) | Bugün tek `main.css` kabul. Kalıcı hedef: Core → Panel / Status / Web / Draugr ayrı paketler. Panel 2 MB Web CSS'i, Status checkout/B2B CSS'ini indirmemeli. |

## Ölçüler (18.11.2026)

- `main.css`: Web eklenmeden önce 848.011 bayt, Web ile 2.924.857 bayt.
- Web SCSS: 205 dosya, 2.249.596 bayt; import edilen 194.
- Derleme ve mimari kontrol: geçiyor. Kontrat: 20/22. Kalan 2 başarısızlık bu temizlikten önce de vardı: `status`/`web-page-hero` içinde ham metin renkleri; `product-card`, `brand-product-featureds`, `us-news-detail`, `product-low-price-report` alt çizgisiz adlı (partial olmayan) dosyalar olduğu için kontrat bunları "bulunamadı" sayıyor.

## Kural

Web'e özgü hiçbir şey çıplak `.bb-*` Core sınıfını (`.bb-section`, `.bb-container`, `.bb-card`, `.bb-btn` …) yeniden tanımlamaz. Web kararları `.bb-web-page` altında veya `bb-web-*` / `bb-b2b-*` / `bb-b2c-*` sınıflarıyla verilir.
