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
| P1-5 | `b2c-special222222222222222222222.scss` | YAPILDI | Web Razor kullanımı doğrulandı. `stage-label`, empty icon/link, pagination wrapper aktif `b2c-product-special.scss` içine taşındı; markup uyumu için `is-active` ve sınıfsız empty `h2/p` desteği de eklendi. Eski `222...` dosyası silindi. |
| P1-6 | Import adı sadeleştirme | YAPILDI | `.scss` uzantılı ve `_` önekli 4 `@use` düzeltildi. |
| P2-7 | Popular categories varyantları | YAPILDI | Web Razor doğrulamasında bunların aynı componentin iki kuşağı olmadığı görüldü: `_B2CPopularProductCategories` `row/item`, `_B2CLevf/_B2CLevsPopularProductCategories` `grid/card` markup kullanıyor. İki varyant korundu; dosyalar `b2c-popular-product-categories-row.scss` ve `b2c-popular-product-categories-grid.scss` olarak net adlandırıldı, `111` ve belirsiz `_` adı kaldırıldı. |
| P2-8 | `b2c-product-reviews.scss` (aktif, 30 KB, 37 `!important`) | AÇIK | Eski kuşaklar silindi. Sayfa sayfa `!important` sadeleştirme. |
| P2-9 | `:root` token sızıntısı | YAPILDI | Web Razor kökleri doğrulandı. Review page tokenları `.bb-b2c-review-page`, detail review tokenları outer `.bb-b2c-detail-review-section` altına scope edildi; dark token blokları da aynı köklere bağlandı. |
| P3-10 | `!important` borcu | AÇIK | Web Header + Footer Faz 2 kapsamında 37 → 1 oldu; kalan tek kullanım Bootstrap `.text-muted` utility override'ı. En yüksek kalanlar: `b2c-product-reviews` 37, `b2c-product-details` 35, `_help` 22, `order-contract` 19, `home` 17, `us-blog` 17, `_b2c-product-list-filters` 16, `order-checkout` 14. Toplu silme yok; sayfa sayfa, görünüm doğrulamasıyla. |
| P3-11 | Sabit renk borcu | AÇIK | `product-card` Faz 1 içinde temizlendi: 23 benzersiz hex + 15 ham rgba → 0. Kalan yoğun alanlar: `b2b-category-page`, `_b2b-homepage-slider`, `b2b-special`, `b2b-home`, `_b2b-homepage-stats`, `_help`, `_cookie-consent-banner`. B2B hero sahneleri gerçek tasarım rengi ise kalabilir. |
| P4-12 | Paket mimarisini ayırma | AÇIK (en son) | Bugün tek `main.css` kabul. Kalıcı hedef: Core → Panel / Status / Web / Draugr ayrı paketler. Panel 2 MB Web CSS'i, Status checkout/B2B CSS'ini indirmemeli. |

## Tasarım standardizasyon fazları

Bu bölüm Web katmanının yeni Core üzerinde görsel ve yapısal olarak tek aileye dönüştürülmesi için çalışma sırasıdır. Fazlar sırayla uygulanır. Bir fazın kabul kriterleri geçmeden sonraki faza başlanmaz.

### Faz 0 — Web contract koruması

**Amaç:** Web uygulamasının Core layout sözleşmesini ezmesini engellemek ve sonraki tasarım çalışmalarına güvenli zemin hazırlamak.

**Kapsam:**
- Bütün aktif Web layoutsında `<body class="bb-web-page">` kökü doğrulanır.
- Web'e özgü kararlar `.bb-web-page`, `bb-web-*`, `bb-b2b-*`, `bb-b2c-*`, `bb-account-*`, `bb-company-*`, `bb-store-*` scopesında tutulur.
- `bb-main`, `bb-wrapper`, `bb-container` layout/sizing görevi görür; default görsel surface üretmez.
- Surface yalnız section/card/component seviyesinde verilir.
- Web dosyaları çıplak Core selectorlarını yeniden tanımlamaz.
- `:root` altında Web/component tokenı bırakılmaz; ilgili application/component root'una taşınır.

**Kabul kriteri:**
- Panel ve Status görünümleri Web importlarından etkilenmez.
- Web sayfaları `body → main → wrapper → container → section → card/component` contract'ına aykırı global override üretmez.
- Build CSS başarılıdır.

**Durum:** DEVAM EDİYOR. `.bb-section` scope ve review token scope işleri tamamlandı; aktif layout kökleri faz çalıştırılırken yeniden doğrulanacak.

---

### Faz 1 — Product Card standardizasyonu

**Amaç:** B2C/B2B/store/campaign ekranlarında tekrar kullanılan en kritik Web bileşenini tek görsel dile bağlamak.

**Kapsam:**
- `components/product-card.scss` anatomisi çıkarılır.
- Kart surface, border, radius, shadow, spacing ve hover davranışları Core semantic tokenlarına bağlanır.
- Sale/success/info/sponsored/MOQ vb. badge renkleri önce `--bb-product-card-*` component tokenlarına alınır.
- Uygun olan component tokenları Core semantic tokenlarından beslenir.
- B2B/B2C farkları modifier veya component tokenlarıyla çözülür; ayrı kart motorları oluşturulmaz.
- Dark mode için kartın kendi ham renk tamiratları azaltılır.
- Gereksiz `!important` kuralları kullanım doğrulamasıyla kaldırılır.

**Kabul kriteri:**
- Product card kullanılan B2C liste/detail yardımcı alanları, B2B liste alanları, store ve campaign görünümleri bozulmaz.
- Aynı state aynı görsel anlamı taşır.
- Hardcoded renk sayısı belirgin biçimde azalır.
- Light/dark ve responsive temel ekranlar doğrulanır.

**Durum:** KOD / CONTRACT TAMAMLANDI — görsel Web smoke testi bekliyor.

**18.11.2026 sonucu:**
- Gerçek Web Razor kullanımı doğrulandı: B2C kart 16, B2B kart 15 görünüm/component içinde kullanılıyor.
- 65 adet `bb-product-card*` class contract'ı aynen korundu; selector kaldırılmadı veya yeni markup zorunluluğu getirilmedi.
- 23 benzersiz ham hex ve 15 benzersiz ham `rgba()` renk kaldırıldı; Product Card kaynak dosyasında ham renk kalmadı.
- Deal/sale → Core danger tokenları; interest/success/verified → success tokenları; MOQ/info → info tokenları ile bağlandı.
- Rating ve trust renkleri component tokenları üzerinden Core/brand tokenlarına bağlandı.
- Özel light/dark shadow değerleri `--bb-shadow-xs/sm` zincirine taşındı.
- Ayrı Product Card dark palette bloğu kaldırıldı; surface/shadow/state renkleri Core light/dark token engine'den miras alıyor.
- B2B/B2C ayrımı tek kart motorunda modifier/component tokenlarıyla korunuyor.
- Ölü çift `padding` declaration temizlendi.
- Dosya Sass partial contract'ına uygun olarak `components/_product-card.scss` oldu; import `components/product-card` şeklinde sadeleşti.
- GitHub Build CSS başarılı.
- Derlenmiş `main.css`: 2.925.985 → 2.924.813 bayt (-1.172 bayt).
- Gerçek tarayıcı light/dark + responsive smoke testi bu repo ortamında yapılmadı; Web uygulama ayağa kaldırıldığında yalnız görsel regresyon kontrolü kalıyor.

---

### Faz 2 — Web Header + Footer standardizasyonu

**Amaç:** Web uygulamasının en görünür ortak kabuğunu Core token sistemiyle sadeleştirmek.

**Kapsam:**
- `_web-header.scss`, header-top, account dropdown, category menu, mobile category menu ve basket dropdown birlikte ele alınır.
- Header'daki yüksek `!important` borcu selector/cascade düzeltilerek azaltılır.
- Header yükseklikleri, spacing, icon boyutları, border ve surface kararları tokenlaştırılır.
- Desktop/mobile header varyantları aynı contract altında tutulur.
- Footer spacing, typography, link hierarchy, language selector ve surface davranışı standardize edilir.
- Header/footer Web scope dışına selector sızdırmaz.

**Kabul kriteri:**
- Desktop + tablet + mobile header navigasyonu çalışır.
- Dropdown/basket/category/mobile menüler bozulmaz.
- Footer light/dark görünümü tutarlıdır.
- Header ve footer Core/Panel/Status selectorlarını ezmez.

**Durum:** KOD / CONTRACT TAMAMLANDI — görsel Web smoke testi bekliyor.

**18.11.2026 sonucu:**
- Gerçek Web Razor contract'ı doğrulandı: `_Header`, `_HeaderTop`, `_CategoryMenuTop`, `_B2BMobileCategoryMenuMainCssPilot`, `_BasketDropdown` ve `_Footer` aktif uygulamada mevcut.
- Faz kapsamındaki 8 SCSS dosyası birlikte tarandı; `_web-header-top.scss` ve `_web-mobile-category-menu.scss` mevcut contract açısından değişiklik gerektirmedi.
- Account dropdown dosyasındaki iki ayrı jenerasyon tek kanonik tanıma indirildi; dosya 12.769 → 6.544 bayt oldu.
- Header'ın basket componentini `#basketInvoker` / `#headerBasketCount` ID selectorları ve `!important` ile yeniden yazan katmanı kaldırıldı. Görsel contract `_web-basket-dropdown.scss` içine taşındı ve header action tokenlarını miras alıyor.
- Header surface, border, shadow, spacing, logo/search/action boyutları `--bb-web-header-*` component tokenlarına alındı; Core `--bb-header-*`, `--bb-shadow-*`, `--bb-space-*` ve semantic token zincirinden besleniyor.
- Header'a özel light/dark ham shadow tamiratı kaldırıldı; tema adaptasyonu Core shadow/surface tokenlarından geliyor.
- Global `.is-desktop-only` selector sızıntısı `.bb-web-header .is-desktop-only` scope'una kapatıldı.
- Account/language dropdown gölgeleri Core `--bb-shadow-xs/lg` tokenlarına bağlandı; ayrı dark shadow blokları kaldırıldı.
- Category overlay rengi component tokenına alındı ve içerik state geçişlerindeki gereksiz `!important` kaldırıldı.
- Footer language dropup'ta selector specificity düzeltilerek `!important` kaldırıldı; footer surface/link/typography yapısı mevcut `--bb-footer-*` token contract'ında korundu.
- Faz kapsamındaki `!important` sayısı 37 → 1 oldu. Kalan tek kullanım `_web-header-top.scss` içindeki Bootstrap `.text-muted` utility override'ıdır; cascade gereği bilinçli bırakıldı.
- Faz kapsamındaki ham sayısal `rgba()` kullanımı 23 → 0; ham hex kullanımı 0.
- Kod commitleri: `a1fd6843` — `refactor(web): standardize header and footer shell`; `a08bfbcd` — `fix(web): preserve account dropdown popper spacing`.
- GitHub Build CSS iki kod commit'inde de başarılı; final derlenmiş `main.css` commit'i: `787ae6a4`.
- Derlenmiş `main.css`: 2.927.504 → 2.921.558 bayt (-5.946 bayt).
- Gerçek tarayıcı light/dark + desktop/tablet/mobile smoke testi bu repo ortamında yapılmadı; Web uygulama ayağa kaldırıldığında yalnız görsel regresyon kontrolü kalıyor.

---

### Faz 3 — Form dili ve etkileşim standardizasyonu

**Amaç:** Account, RFQ, checkout, company ve logon ekranlarını Core form motoruna bağlamak.

**Kapsam:**
- Core `forms`, `input-group`, `floating-labels`, `forms-final` önce referans alınır.
- Web'e özgü input height, padding, border, radius, label, placeholder, focus ve validation tekrarları bulunur.
- Aynı davranışı Core zaten sağlıyorsa Web override kaldırılır.
- Gerçek Web ihtiyacı modifier/application tokenı olarak tutulur.
- Account/RFQ/checkout/company/logon sayfalarında form anatomisi aynılaştırılır.
- Focus-visible ve error/success durumları semantic tokenlara bağlanır.

**Kabul kriteri:**
- Form control ölçüleri ve focus dili sayfalar arasında tutarlıdır.
- Validation/error/success halleri aynı sistemle görünür.
- Web form CSS'i Core form motorunu yeniden yazmaz.

**Durum:** KOD / STATIC CONTRACT TAMAMLANDI — gerçek Web smoke testi ve repo check scriptleri bekliyor.

**18.11.2026 sonucu:**
- Core referans zinciri doğrulandı: `components/_forms.scss`, `_input-group.scss`, `_floating-labels.scss` ve en sonda application guard olarak `_forms-final.scss`.
- Gerçek Web Razor contract'ı doğrulandı: Account/Company ekranları `form-control`, `form-select`, `form-label`, `input-group` ve büyük ölçüde `bb-input-group` / `bb-input-group-solid` kullanıyor; yeni markup veya yeni form motoru eklenmedi.
- Account, Company, Logon, RFQ ve Checkout kapsamında 20 SCSS dosyası temizlendi.
- Account/Company input gruplarında renk, surface, border-color, typography, focus ve validation tekrarları kaldırıldı; yalnız birleşik input geometrisi, IBAN harf düzeni, readonly görünümü ve password toggle gibi gerçek application ihtiyaçları bırakıldı.
- Readonly telefon alanı ham surface karışımı yerine `--bb-form-control-disabled-color` ve `--bb-form-control-readonly-bg` semantic tokenlarına bağlandı.
- Password toggle surface/border/focus dili `--bb-form-control-*` token zincirine taşındı; `box-shadow: none !important` kaldırıldı.
- Account Disable destructive seçiminde özel focus ihtiyacı selector override yerine `--bb-ig-focus-border-color` application tokenı olarak korundu.
- Company Contact koyu yüzeyindeki beyaz label niyeti doğrudan `.form-label` override yerine form root'unda `--bb-form-label-color` / `--bb-form-label-font-weight` tokenlarıyla tanımlandı.
- Logon ailesinde (`login`, `register`, `forgot-password`, `set-new-password`, `firstdoor`) Web'e özgü `form-control/form-select/form-label` yeniden yazımı 0'a indirildi; yalnız input-group addon geometrisi kaldı.
- RFQ'da Core ile aynı textarea/validation tekrarları kaldırıldı; Checkout'ta Core tarafından zaten ezilen payment input-group surface override'ı kaldırıldı.
- Cleannen source SCSS toplamı yaklaşık 23.137 bayt küçüldü.
- Derlenmiş `main.css`: 2.921.558 → 2.903.469 bayt (-18.089 bayt).
- Kod commitleri: `73970e06` — `refactor(web): align account and company forms with core`; `25d578af` — `refactor(web): align auth and transaction forms with core`; `1a46294e` — `refactor(web): finish form token handoff`.
- GitHub Build CSS üç kod commit'inde de başarılı; final derlenmiş `main.css` commit'i: `ade35869`.
- `npm run check:contracts` ve `npm run check:css` scriptleri repoda mevcut fakat mevcut GitHub workflow yalnız `build:css` çalıştırıyor. Bu oturumun container ortamında GitHub erişimi olmadığı için bu iki script gerçekten çalıştırılamadı; çalıştırılmış sayılmıyor.
- Gerçek tarayıcı light/dark + Account/RFQ/Checkout/Company/Logon responsive smoke testi yapılmadı; kalan iş görsel regresyon kontrolüdür.
- `forms-final` kaldırılmadı veya mimarisi değiştirilmedi; bu fazda yalnız mevcut application guard olarak kullanıldı.

---

### Faz 4 — Card anatomisi: Account + Company

**Amaç:** Web içindeki en yoğun panel-benzeri sayfalarda kart/surface dilini tekleştirmek.

**Kapsam:**
- Account ve Company SCSSsindeki tekrar eden card/head/icon/body/actions kalıpları çıkarılır.
- Uygun yerlerde Core `bb-card` anatomisi kullanılır.
- Application'a özgü composition classsı korunur.
- Padding, radius, border, shadow ve heading ritmi ortak Web card tokenlarına çekilir.
- Gereksiz page-specific kart motorları azaltılır.
- Store ve subscription kartlarıyla ortak desenler ayrıca değerlendirilir.

**Kabul kriteri:**
- Account ve Company ekranları aynı ürün ailesinden görünür.
- Core card yeniden yazılmaz; Web yalnız composition/varyant verir.
- Aynı görsel rol için farklı radius/shadow/padding değerleri azaltılır.

**Durum:** KOD / STATIC CONTRACT TAMAMLANDI — gerçek Web light/dark + responsive smoke testi bekliyor.

**18.11.2026 sonucu:**
- Core `components/_cards.scss` contract'ı referans alındı; yeni bir Web card component/motoru üretilmedi.
- Web App tarafında 27 Razor dosyasında eski `bb-account-*` / `bb-b2b-company-*` class contractsı korunarak additive biçimde Core `bb-card`, `bb-card-bordered`, `bb-card-body`, `bb-card-header`, `bb-card-px-0` ve gerektiği yerde `bb-card-hover-elevate` anatomisi eklendi.
- Account overview, profile, company, subscription list/detail, address, bank account, e-posta/şifre, review, disable, phone, recovery email ve subscription create nötr kartları Core surface motoruna bağlandı.
- Company create/edit, profile component, contact person/info, home component, products sidebar, reviews summary/review nötr kartları Core surface motoruna bağlandı.
- Account Company ve Subscription Detail info kartlarında gerçek Core header/body anatomisi kullanıldı; liste bodysinde `bb-card-px-0` ve `--bb-card-body-py: 0` ile satır tablosu geometrisi korundu.
- Stat kartlarında farklı bir kart motoru tutulmadı; yalnız gerçek varyant ihtiyacı olarak `--bb-card-bg: var(--bb-tertiary-bg)` bırakıldı.
- Account Subscription ve Company Review hover davranışı Core `bb-card-hover-elevate` sistemine devredildi; page-specific transform/shadow transition tekrarları kaldırıldı.
- Faz 3'ten kalan form sayfalarının page-specific `bb-layout-light-card` border/shadow ve card-body padding overridesı kaldırıldı; ortak `_layout-light.scss` yeniden tek sahibi oldu.
- Promo/identity kartları bilinçli olarak Core nötr kart ailesine zorlanmadı: company/subscription summary, subscription-create info, company profile side/trust, company contact message, company home trust ve company reviews hero/info kartları kendi composition rollerini koruyor.
- Store kartları ayrıca incelendi. `store-index` hero/storefront kartları ve `store-profile` category/product kartları Account/Company nötr content kartıyla aynı görsel role sahip olmadığı için bu fazda zorla birleştirilmedi; storefront-specific legacy surface borcu ayrı temizlik olarak bırakıldı.
- Subscription tarafında nötr panel/detail kartları Core'a taşındı; satış/plan kartının dekoratif gradient composition'ı korundu fakat Core card body + hover davranışını kullanıyor.
- GlobalTheme'de 21 hedef SCSS dosyası toplam yaklaşık 13.185 bayt küçüldü.
- Aynı 21 SCSS dosyasında toplam property sayımı: `background 206 → 179`, `border 463 → 382`, `border-radius 230 → 190`, `box-shadow 80 → 40`, `padding 168 → 130`.
- Derlenmiş `assets/css/main.css`: 2.903.469 → 2.893.883 bayt (-9.586 bayt).
- Web App commitleri: `7263fa87` — `refactor(web): adopt core card anatomy in account surfaces`; `085b1200` — `refactor(web): adopt core card shell in account forms`; `ff5e22e5` — `refactor(web): adopt core card shell in company and account detail views`.
- GlobalTheme commitleri: `addc1d12` — `refactor(web): hand account card surfaces to core`; `03b156c9` — `refactor(web): remove page card engines from account forms`; `f6655fc7` — `refactor(web): hand company neutral cards to core`.
- Final GitHub Build CSS başarılı; final generated CSS commit'i: `88d24967` — `build(css): regenerate from main.scss`.
- Aradaki `03b156c9` workflow run'ı tamamlanmadan iptal edildi; sonraki final commit'in Build CSS run'ı başarıyla tamamlandı.
- Web App repository'sinde bu üç Razor commit için GitHub Actions run oluşmadı; CI sonucu varmış gibi kabul edilmedi.
- `npm run check:contracts` / `npm run check:css` bu oturumda çalıştırılmış sayılmıyor; GlobalTheme workflow hâlâ yalnız `build:css` çalıştırıyor.
- Gerçek tarayıcı light/dark ve desktop/tablet/mobile smoke testi yapılmadı; kalan iş görsel regresyon kontrolüdür.

---

### Faz 5 — Hero ailesini 3–4 ana varyanta düşürme

**Amaç:** B2B, B2C, US, company, campaign ve special sayfalarındaki hero çeşitliliğini kontrollü bir aileye dönüştürmek.

**Hedef varyantlar:**
1. **Editorial** — US/blog/news/about/career gibi içerik sayfaları.
2. **Marketplace** — B2B/B2C kategori, kampanya, discovery sayfaları.
3. **Detail** — product/store/company/detail bağlamları.
4. **Branded** — özel kampanya/special/brand görsel sahneleri; yalnız gerçekten farklı kimlik gerektiğinde.

**Kapsam:**
- Hero anatomy: eyebrow/kicker, title, text, actions, media, breadcrumb, background layer.
- Ortak spacing/typography/layout Core/Web semantic tokenlarına bağlanır.
- Sayfa özel görsel renkler yalnız branded/composition katmanında bırakılır.
- Her sayfanın sıfırdan hero CSS yazması engellenir.

**Kabul kriteri:**
- Hero sayısı azalır fakat içerik tiplerinin kimliği kaybolmaz.
- B2B/B2C/US sayfaları aynı tasarım sistemine ait görünür.
- Hero componentleri Core selectorlarını ezmez.

**Durum:** KOD / STATIC CONTRACT TAMAMLANDI — gerçek Web light/dark + responsive smoke testi bekliyor.

**18.11.2026 sonucu:**
- Faz, kullanıcının IDE'den gönderdiği güncel GlobalTheme `main` baseline'ı `77693f57` üzerinden yürütüldü; önceki generated CSS'e geri dönülmedi.
- Ortak `web-page-hero.scss` motoruna dört semantic family eklendi: `bb-hero-editorial`, `bb-hero-marketplace`, `bb-hero-detail`, `bb-hero-branded`.
- Base `bb-hero` padding, background, border, title ve lead kararları semantic tokenlara taşındı: `--bb-hero-padding-*`, `--bb-hero-title-*`, `--bb-hero-lead-size`, `--bb-hero-bg`, `--bb-hero-border-color`.
- Mevcut `plain / soft / muted / dark / split` modifier contract'ı korunarak semantic family'lerle birlikte çalışacak hale getirildi.
- Editorial family blog/news/about/career/story/investor/forum/our-team gibi içerik yüzeylerine; Marketplace family B2B/B2C category, campaign, sponsored/discovery ve supplier-directory yüzeylerine; Detail family company/store/product bağlamlarına; Branded family brand/special sahnelerine bağlandı.
- Toplam 42 aktif Razor hero yüzeyi semantic family contract'ına alındı. Eski page-specific class'lar kaldırılmadı; application selector contract'ı additive biçimde korundu.
- Campaign index'te hero sınıfları yalnız içerik div'inde duruyordu; gerçek `section.bb-hero.bb-hero-marketplace` anatomisine geçirildi.
- Newsroom, Blog, Blog Detail, Career Jobs, Company detail ve Product Questions gibi sayfalarda title/lead/inner/actions yapıları ortak `bb-hero-*` anatomy sınıflarına bağlandı.
- B2B/B2C Special için dinamik renk/görsel sözleşmesi page-specific variable'lardan generic `--bb-hero-branded-bg-color`, `--bb-hero-branded-image`, `--bb-hero-branded-color` contract'ına taşındı. B2B product special da aynı branded variable zincirini kullanıyor.
- Branded family dinamik background image + color değerlerini ortak motor üzerinden tüketiyor; brand/special kimliği korunurken ayrı hero engine ihtiyacı kaldırıldı.
- Blog'daki iki ayrı hero nesli, Newsroom/Career/B2B Category/Campaign Detail/Store/Product Reviews/Special sayfalarındaki generic surface/spacing/title/grid tekrarları ve Company detail/directory generic typography override'ları temizlendi.
- Page-specific hero SCSS katmanlarından toplam yaklaşık 34.757 bayt tekrar kod kaldırıldı. Ortak `web-page-hero.scss` dört semantic family ve branded contract nedeniyle bilinçli olarak büyüdü.
- Güncel kullanıcı baseline'ındaki derlenmiş `assets/css/main.css`: 2.893.935 → 2.867.270 bayt; net **-26.665 bayt**.
- Web App commitleri: `50345aa4` — editorial/brand family; `3405cfad` — marketplace/detail/branded family; `09e56570` — shared hero anatomy; `cf3cf271` — remaining anatomy + campaign index; `e2af2fde` — generic branded variables; `3b55c46f` — remaining editorial coverage; `58c026e3` — remaining marketplace/detail coverage; `6998ec44` — remaining detail typography.
- GlobalTheme commitleri: `ba92aa5a` — semantic hero families; `fc15ed7a` — duplicate semantic engines cleanup; `c0b93f97` — generic branded contract; `2cab84e1` — special heroes handoff; `190163cf` — editorial/brand consolidation; `2172206f` — remaining generic detail overrides cleanup.
- Tüm Faz 5 GlobalTheme kod commitlerinin GitHub Build CSS run'ları başarılı. Final generated CSS commit'i: `f75c1411` — `build(css): regenerate from main.scss`.
- Web App repository'sinde bu Razor commitleri için GitHub Actions run oluşmadı; CI sonucu varmış gibi kabul edilmedi.
- `npm run check:contracts` / `npm run check:css` çalıştırılmış sayılmıyor; mevcut GlobalTheme workflow yalnız `build:css` çalıştırıyor.
- Gerçek tarayıcı light/dark ve desktop/tablet/mobile smoke testi yapılmadı; kalan iş görsel regresyon kontrolüdür.

---

### Faz 6 — Spacing + Typography ritmi

**Amaç:** Sayfaların farklı dönemlerde yazılmış hissini ortadan kaldırmak.

**Spacing kapsamı:**
- Web'deki `1rem / 1.125rem / 1.375rem / 1.5rem / 1.75rem / 2.125rem` gibi ara değerler envanterlenir.
- Görsel anlamı olmayan ara değerler Core `--bb-space-*` skalasına yaklaştırılır.
- Section/card/form/list iç ritimleri ayrı ayrı standardize edilir.
- Tasarım gereği özel olan ölçüler korunabilir; fakat nedeni component tokenıyla açık olur.

**Typography kapsamı:**
- Web'de semantic roller belirlenir: display/hero, page title, section title, body, meta/kicker, control.
- Aynı rol için farklı dosyalarda ayrı `clamp()` ve font-size sistemleri azaltılır.
- Size büyütmek yerine size + weight + line-height + contrast birlikte ele alınır.
- Core typography tokenları mümkün olan her yerde kaynak olur.

**Kabul kriteri:**
- Aynı seviyedeki başlıklar farklı sayfalarda aynı ağırlık ve ritme sahiptir.
- Section aralıkları gözle tutarlı hale gelir.
- Rastgele spacing literal sayısı belirgin biçimde azalır.

---

### Faz 7 — Dark mode sadeleştirme

**Amaç:** Web'in kendi dark-mode tamiratlarını azaltıp Core token engine'e güvenmesini sağlamak.

**Kapsam:**
- Tüm `[data-bs-theme="dark"]` ve `html[data-bs-theme="dark"]` blokları envanterlenir.
- Core semantic token değişiminden otomatik çözülen dark overrides kaldırılır.
- Gerçek component-state ihtiyacı olan dark overrides component scope'unda bırakılır.
- Ham dark renkler mümkünse semantic/component tokenlarına taşınır.
- Light/dark arasında surface hierarchy ve contrast korunur.

**Kabul kriteri:**
- Dark mode özel override sayısı azalır.
- Componentler Core tema değişiminden doğal şekilde renk alır.
- Light/dark state anlamları aynı kalır.

---

### Faz 8 — Responsive davranış standardizasyonu

**Amaç:** Desktop'ta çalışan fakat tablet/mobile'da eski CSS kuşaklarının çarpıştığı noktaları temizlemek.

**Kapsam:**
- `1199.98 / 991.98 / 767.98 / 575.98` breakpoint kullanımları envanterlenir.
- Aynı componentin farklı dosyalardaki çelişkili breakpoint kuralları birleştirilir.
- Header, product card/list, hero, account/company forms, checkout ve modal/drawer önceliklidir.
- Responsive değişiklik layout/composition düzeyinde tutulur; token ve Core component davranışı gereksiz yere breakpoint ile ezilmez.
- Mobilde yatay taşma, kırık grid, gereksiz fixed width ve viewport overflow kontrol edilir.

**Kabul kriteri:**
- Desktop/tablet/mobile ana senaryolar kırılmaz.
- Aynı breakpoint'te birbirini geri alan duplicate kurallar azaltılır.
- Horizontal overflow yalnız bilinçli carousel/scroll bölgelerinde kalır.

---

### Faz 9 — Paket mimarisi ve son izolasyon

**Amaç:** Tasarım borcu temizlendikten sonra tek `main.css` monolitini application paketlerine ayırmak.

**Hedef:**

```text
Core
├── Panel
├── Status
├── Web
└── Draugr
```

**Kapsam:**
- Core bağımlılık sınırı kesinleştirilir.
- Panel yalnız Core + Panel CSS alır.
- Status yalnız Core + Status CSS alır.
- Web yalnız Core + Web CSS alır.
- Draugr yalnız Core + Draugr CSS alır.
- Ortak olduğu kanıtlanmamış hiçbir application CSS Core'a taşınmaz.
- Build scriptleri ve CI application bundlesını ayrı doğrular.

**Kabul kriteri:**
- Panel Web marketplace CSS'i indirmez.
- Status checkout/B2B/product CSS'i indirmez.
- Application bundlesı ayrı build edilir.
- Core hiçbir application katmanına bağımlı değildir.

---

## Faz çalışma kuralı

Her fazda aynı sıra uygulanır:

1. İlgili gerçek Razor/HTML markup repo üzerinden doğrulanır.
2. Core'da mevcut component/token/layout karşılığı aranır.
3. Duplicate/application override envanteri çıkarılır.
4. En dar kapsamlı SCSS değişikliği yapılır.
5. `npm run build:css` / CI sonucu doğrulanır.
6. İlgili light/dark ve responsive sayfalar kontrol edilir.
7. Fazın sonucu bu dokümana yazılır.
8. Kabul kriterleri geçerse sonraki faza başlanır.

Toplu "güzelleştirme" yapılmaz. Her değişiklik hangi component, token veya layout sorumluluğunu sadeleştirdiği belli olacak şekilde yapılır.


## Ölçüler (18.11.2026)

- `main.css`: Web eklenmeden önce 848.011 bayt, Web ile 2.924.857 bayt.
- Web SCSS: 205 dosya, 2.249.596 bayt; import edilen 194.
- Derleme ve mimari kontrol: geçiyor. Kontrat: 20/22. Kalan 2 başarısızlık bu temizlikten önce de vardı: `status`/`web-page-hero` içinde ham metin renkleri; `product-card`, `brand-product-featureds`, `us-news-detail`, `product-low-price-report` alt çizgisiz adlı (partial olmayan) dosyalar olduğu için kontrat bunları "bulunamadı" sayıyor.

## Kural

Web'e özgü hiçbir şey çıplak `.bb-*` Core sınıfını (`.bb-section`, `.bb-container`, `.bb-card`, `.bb-btn` …) yeniden tanımlamaz. Web kararları `.bb-web-page` altında veya `bb-web-*` / `bb-b2b-*` / `bb-b2c-*` sınıflarıyla verilir.
