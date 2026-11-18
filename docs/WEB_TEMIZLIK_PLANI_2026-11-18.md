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
| P3-10 | `!important` borcu | AÇIK | En yüksekler: `b2c-product-reviews` 37, `b2c-product-details` 35, `_web-header` 28, `_help` 22, `order-contract` 19, `home` 17, `us-blog` 17, `_b2c-product-list-filters` 16, `order-checkout` 14. Toplu silme yok; sayfa sayfa, görünüm doğrulamasıyla. |
| P3-11 | Sabit renk borcu | AÇIK | En çok: `b2b-category-page` 62, `_b2b-homepage-slider` 53, `b2b-special` 42, `b2b-home` 32, `_b2b-homepage-stats` 30, `_help` 30, `_cookie-consent-banner` 29, `components/product-card` 28. `product-card` renkleri önce bileşen tokenına (`--bb-product-card-sale-color` vb.), mümkünse Core semantic tokenına bağlanır. B2B hero sahneleri tasarım rengi olarak kalabilir. |
| P4-12 | Paket mimarisini ayırma | AÇIK (en son) | Bugün tek `main.css` kabul. Kalıcı hedef: Core → Panel / Status / Web / Draugr ayrı paketler. Panel 2 MB Web CSS'i, Status checkout/B2B CSS'ini indirmemeli. |

## Tasarım standardizasyon fazları

Bu bölüm Web katmanının yeni Core üzerinde görsel ve yapısal olarak tek aileye dönüştürülmesi için çalışma sırasıdır. Fazlar sırayla uygulanır. Bir fazın kabul kriterleri geçmeden sonraki faza başlanmaz.

### Faz 0 — Web contract koruması

**Amaç:** Web uygulamasının Core layout sözleşmesini ezmesini engellemek ve sonraki tasarım çalışmalarına güvenli zemin hazırlamak.

**Kapsam:**
- Bütün aktif Web layout'larında `<body class="bb-web-page">` kökü doğrulanır.
- Web'e özgü kararlar `.bb-web-page`, `bb-web-*`, `bb-b2b-*`, `bb-b2c-*`, `bb-account-*`, `bb-company-*`, `bb-store-*` scope'larında tutulur.
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

---

### Faz 4 — Card anatomisi: Account + Company

**Amaç:** Web içindeki en yoğun panel-benzeri sayfalarda kart/surface dilini tekleştirmek.

**Kapsam:**
- Account ve Company SCSS'lerindeki tekrar eden card/head/icon/body/actions kalıpları çıkarılır.
- Uygun yerlerde Core `bb-card` anatomisi kullanılır.
- Application'a özgü composition class'ları korunur.
- Padding, radius, border, shadow ve heading ritmi ortak Web card tokenlarına çekilir.
- Gereksiz page-specific kart motorları azaltılır.
- Store ve subscription kartlarıyla ortak desenler ayrıca değerlendirilir.

**Kabul kriteri:**
- Account ve Company ekranları aynı ürün ailesinden görünür.
- Core card yeniden yazılmaz; Web yalnız composition/varyant verir.
- Aynı görsel rol için farklı radius/shadow/padding değerleri azaltılır.

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
- Core semantic token değişiminden otomatik çözülen dark override'lar kaldırılır.
- Gerçek component-state ihtiyacı olan dark override'lar component scope'unda bırakılır.
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
- Build scriptleri ve CI application bundle'larını ayrı doğrular.

**Kabul kriteri:**
- Panel Web marketplace CSS'i indirmez.
- Status checkout/B2B/product CSS'i indirmez.
- Application bundle'ları ayrı build edilir.
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
