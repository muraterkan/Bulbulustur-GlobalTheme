# NASIL GELİŞTİRİLİR?

> Bulbulustur UI geliştirme prensipleri  
> Bu dosya, Core ve Application katmanlarında CSS/UI geliştirirken izlenecek karar sırasını sabitler.

---

## 1. Temel Mimari

Bulbulustur UI sistemi **Core → Application → Composition** katmanlarıyla geliştirilir.

```text
CORE
  ↓ miras
APPLICATION
  ↓ kompozisyon
PAGE / FEATURE
```

### Core

Core bütün uygulamaların ortak UI altyapısıdır.

Core'un sorumlulukları:

- primitive ve semantic tokenlar
- typography
- spacing
- radius
- shadow
- motion
- color / surface sistemi
- light / dark davranışı
- responsive yardımcılar
- accessibility state'leri
- genel UI component omurgaları
- component state'leri
- component density / sizing sistemi

Örnek Core componentleri:

- button
- button group
- card
- form
- input
- select
- dropdown
- menu
- chip
- badge
- notice / alert
- tabs
- accordion
- table
- pagination
- modal
- drawer
- toast
- tooltip
- progress
- skeleton
- spinner
- empty state
- overlay
- carousel
- rating
- breadcrumb

Core hiçbir application'ı bilmez.

**Core → Panel bağımlılığı olamaz.**

---

## 2. Application Nedir?

Core dışındaki ürünlerin tamamı application'dır.

Örnek:

```text
applications/
  panel/
  web/
  status/
  ...
```

Application, Core'dan gelen component ve tokenları **kullanır, compose eder ve gerektiğinde kendi görsel profilini uygular**.

Application'ın sorumlulukları:

- shell
- sidebar / application navigation
- application-specific header
- dashboard kompozisyonu
- application'a özel page layout
- feature ekranları
- application'a özel yoğunluk / görsel profil
- yalnız o ürüne ait interaction composition

Örnek:

```text
applications/panel/
  shell/
  pages/
  features/
```

Panel bir Core değildir.

Panel, Core'un en kapsamlı **reference application**'ıdır.

---

# 3. CORE-FIRST KURALI

## Her UI problemi önce Core'da aranır.

Panelde, Web'de veya başka bir application'da yeni CSS yazmadan önce şu soru sorulur:

> **Bu ihtiyacın omurgası Core'da zaten var mı?**

Cevap bulunmadan application seviyesinde yeni component icat edilmez.

### Örnek

Bir sayfada chip gerekiyorsa:

```text
Önce:
assets/scss/components/_chips.scss

Sonra:
mevcut chip markup / state / token sistemi incelenir.
```

Notice gerekiyorsa:

```text
Önce:
assets/scss/components/_alerts.scss
assets/scss/components/_status.scss
assets/scss/components/_empty-state.scss
```

Tab gerekiyorsa:

```text
Önce:
assets/scss/components/_tabs.scss
```

Table gerekiyorsa:

```text
Önce:
assets/scss/components/_tables.scss
```

Drawer gerekiyorsa:

```text
Önce:
assets/scss/components/_drawer.scss
```

Dropdown / menu gerekiyorsa:

```text
Önce:
assets/scss/components/_dropdowns.scss
assets/scss/components/_menu.scss
```

Button gerekiyorsa:

```text
Önce:
assets/scss/components/_buttons.scss
assets/scss/components/_buttongroups.scss
```

Form gerekiyorsa:

```text
Önce:
assets/scss/components/_forms.scss
assets/scss/components/_input-group.scss
assets/scss/components/_floating-labels.scss
```

Progress gerekiyorsa:

```text
Önce:
assets/scss/components/_progress.scss
```

Modal / overlay gerekiyorsa:

```text
Önce:
assets/scss/components/_modals.scss
assets/scss/components/_overlay.scss
```

No-screen / veri yok / boş durum gerekiyorsa:

```text
Önce:
assets/scss/components/_empty-state.scss
assets/scss/components/_skeleton.scss
assets/scss/components/_status.scss
```

---

# 4. YENİ BİR ŞEY YAZMADAN ÖNCE KARAR AĞACI

Her UI değişikliğinde aşağıdaki sıra uygulanır.

```text
1. Problem / ihtiyaç nedir?
        ↓
2. Core'da buna karşılık gelen component var mı?
        ↓
   EVET ---------------------- HAYIR
    ↓                          ↓
3. Core component doğru mu?   5. Bu ihtiyaç genellenebilir mi?
    ↓                          ↓
 EVET / HAYIR             EVET / HAYIR
    ↓                          ↓
4A. Kullan               6A. EVET → Core component oluştur
4B. Eksikse Core'u düzelt 6B. HAYIR → Application katmanında yaz
```

Son soru her zaman:

> **Yazdığım CSS yalnız bu application'a mı ait, yoksa başka Bulbulustur uygulamaları da bundan faydalanabilir mi?**

Başka uygulamalar da faydalanabiliyorsa, kural application CSS'ine gömülmez.

Core'a **promote** edilir.

---

# 5. PROMOTION RULE

Bir problem application içinde fark edilmiş olabilir.

Bu, problemin application'a ait olduğu anlamına gelmez.

Örnek:

### Yanlış

POSB tablosunda font büyük göründü.

```scss
.bb-posb .table {
  font-size: 14px;
}
```

Bu yalnız semptomu kapatır.

### Doğru

Problemin bütün düz `.table` kullanımlarında olduğunu gördük.

Çözüm:

```text
assets/scss/components/_tables.scss
assets/scss/base/_typography.scss
```

Core düzeltilir.

Böylece:

- Panel
- POSB
- Draugr yönetimi
- gelecekte Web
- başka application'lar

aynı düzeltmeden faydalanır.

---

# 6. COMPONENT OMURGASI CORE'DA OLMALIDIR

Application bir componentin yeni bir kopyasını üretmemelidir.

Examplen aşağıdakiler Core'dan gelmelidir:

- shape
- base padding
- size scale
- typography scale
- focus state
- disabled state
- hover state
- active state
- validation state
- light/dark behavior
- border
- surface
- shadow baseline
- transition
- accessibility behavior

Application yalnız gerektiğinde şunları değiştirebilir:

- composition
- page-specific spacing
- placement
- layout
- application-specific visual emphasis
- feature-specific content arrangement

---

# 7. "SPECIAL STYLE" İLE "NEW COMPONENT" AYRIMI

Özel sayfa tasarımı yasak değildir.

Ancak özel tasarım, Core componenti yeniden icat etmemelidir.

### Doğru

```html
<div class="bb-card order-summary">
  ...
</div>
```

```scss
.bb-panel .order-summary {
  grid-template-columns: ...;
}
```

Burada card omurgası Core'dan gelir.

Application yalnız kompozisyonu belirler.

### Yanlış

```scss
.order-summary {
  border: ...;
  border-radius: ...;
  background: ...;
  box-shadow: ...;
  padding: ...;
  color: ...;
}
```

Eğer bunların tamamı zaten `.bb-card` tarafından çözülüyorsa Core yeniden yazılmış olur.

---

# 8. APPLICATION ROOT NAMESPACE

Application-specific CSS mümkün olduğunca application root altında yaşar.

Örnek:

```html
<body class="bb-panel">
```

```scss
.bb-panel .channel-grid { ... }
.bb-panel .profile-hero { ... }
.bb-panel .order-summary { ... }
```

Her class adına sürekli application adı eklemek gerekmez.

### Gereksiz uzun

```css
.bb-panel-dashboard-order-summary-card-header
```

### Tercih edilen

```css
.bb-panel .order-summary
```

Klasör ve root namespace ownership'i zaten belirtir.

---

# 9. TOKEN-FIRST KURALI

Yeni sabit değer yazmadan önce mevcut token aranır.

### Önce

```text
assets/scss/base/
assets/scss/themes/
```

kontrol edilir.

Özellikle:

- font size
- font weight
- line height
- spacing
- radius
- border
- surface
- color
- shadow
- motion

için doğrudan magic value yazmak son seçenektir.

### Tercih edilen

```scss
padding: var(--bb-space-4);
border-radius: var(--bb-radius);
color: var(--bb-secondary-color);
background: var(--bb-surface-elevated);
```

### Kaçınılacak

```scss
padding: 17px;
border-radius: 11px;
color: #6b7280;
background: #ffffff;
```

Yeni token gerçekten gerekiyorsa mevcut token hiyerarşisine uygun olarak Core'a eklenir.

---

# 10. CORE COMPONENT KONTROL LİSTESİ

Yeni component veya önemli Core değişikliği aşağıdakileri düşünmelidir:

- light theme
- dark theme
- hover
- focus-visible
- active
- disabled
- loading gerekiyorsa loading
- error / success / warning gerekiyorsa semantic state
- responsive davranış
- keyboard kullanımı
- reduced motion gerekiyorsa motion davranışı
- typography
- density
- token kullanımı
- Bootstrap bridge ile çakışma
- başka application'larda kullanım

---

# 11. PANELİN ROLÜ

Panel, Core'un en yoğun test alanıdır.

Panel geliştirirken bulunan genel problemler Core'u geliştirmek için kullanılmalıdır.

Bu nedenle:

```text
Panel problemi
    ↓
Core analizi
    ↓
Genel problem mi?
    ├─ Evet → Core düzelt
    └─ Hayır → Panel katmanında çöz
```

Panel geliştirmesi tamamlandığında Core daha olgun hale gelmelidir.

Aynı prensip daha sonra Web application geliştirilirken devam eder.

Web geliştirmesi sırasında bulunan genel eksikler de Core'a promote edilir.

Ama Web'in görsel kimliği Core'a taşınmaz.

---

# 12. CORE'UN HEDEFİ

Core'un amacı bütün uygulamaları birbirine benzetmek değildir.

Core'un amacı:

> Aynı UI problemini her projede tekrar çözmemektir.

Panel yoğun bir operasyon arayüzü olabilir.

Web editorial / storefront ağırlıklı olabilir.

Status minimal olabilir.

Bunların görünümü farklı olabilir.

Ama hepsi:

- aynı button contract
- aynı form contract
- aynı accessibility yaklaşımı
- aynı semantic color sistemi
- aynı state sistemi
- aynı token altyapısı
- aynı temel component davranışı

üzerinden yükselebilir.

---

# 13. MAIN.CSS KURALI

Nihai hedef:

```text
main.css = Core
```

Application-specific kod Core artifact içine kalıcı olarak karıştırılmamalıdır.

Hedef build modeli:

```text
main.css + applications/panel.css
main.css + applications/web.css
main.css + applications/status.css
```

Buradaki application CSS'leri main.css'in kopyası değildir.

Sadece application layer'dır.

Core değiştiğinde tek Core artifact güncellenir.

---

# 14. DOSYA SAHİPLİĞİ

Hedef klasörleme:

```text
assets/scss/
  base/
  themes/
  utilities/
  components/

  applications/
    panel/
      _index.scss
      _profile.scss
      shell/
      pages/
      features/

    web/
    status/
```

Dosyanın bulunduğu klasör zaten ownership'i anlattığı için dosya isimlerini gereksiz uzatmayız.

### Tercih edilen

```text
applications/panel/shell/_sidebar.scss
applications/panel/pages/_orders.scss
applications/panel/features/_draugr.scss
```

### Gereksiz

```text
_panel-sidebar.scss
_panel-orders-page.scss
_panel-draugr-feature.scss
```

---

# 15. YAPILMAMASI GEREKENLER

## Application içinde Core component kopyalamak

Yapma.

## Sayfa düzeltmek için global tokenı rastgele değiştirmek

Yapma.

Önce etkinin bütün ekosistemde doğru olup olmadığını değerlendir.

## Bir component varken benzer yeni component üretmek

Yapma.

Önce mevcut componenti genişletmenin doğru olup olmadığını değerlendir.

## Her sayfada özel notice / badge / button / table üretmek

Yapma.

Core component kullan.

## `!important` ile mimari problemi kapatmak

Yapma.

Cascade ve ownership problemini çöz.

## Application CSS'ini Core'a fark edilmeden taşımak

Yapma.

Core application bilmemelidir.

## Core problemini application override ile sonsuza kadar saklamak

Yapma.

Genellenebilir problem Core'a promote edilmelidir.

---

# 16. UI GELİŞTİRMEYE BAŞLAMADAN ÖNCE

Bir ekran/component işi geldiğinde geliştirici veya AI şu sırayla hareket eder:

1. Bu dosyayı oku.
2. İlgili Core component dosyasını bul.
3. Component örnek/demo sayfasına bak.
4. Mevcut tokenları kontrol et.
5. Problemin Core mu Application mı olduğunu sınıflandır.
6. Core problemi ise önce Core'u düzelt.
7. Application ihtiyacı ise Core primitive/componentleri kullanarak compose et.
8. Özel CSS'i minimumda tut.
9. Light/dark ve responsive etkisini kontrol et.
10. Aynı çözümün başka application'da tekrar yazılıp yazılmayacağını sorgula.

---

# 17. DEĞİŞİKLİK SONRASI KONTROL

Her önemli UI değişikliğinden sonra en azından şu sorular sorulur:

- Core component gereksiz yere tekrar edildi mi?
- Yeni magic value eklendi mi?
- Yeni class aslında mevcut bir componentin varyantı mıydı?
- Panel'e özel çözüm Core problemini saklıyor mu?
- Dark theme doğru mu?
- Light theme doğru mu?
- Keyboard/focus davranışı korundu mu?
- Responsive davranış bozuldu mu?
- Aynı değişiklik Web veya başka bir application için de faydalı mı?

Eğer son sorunun cevabı **evet** ise değişiklik tekrar Core açısından değerlendirilir.

---

# 18. KISA FORMÜL

```text
Önce Core'a bak.
Varsa kullan.
Eksikse düzelt.
Yoksa genellenebilirliğini sorgula.
Genelse Core'a ekle.
Özelse Application'da compose et.
Core'u kopyalama.
Application'ı Core'a sızdırma.
```

---

## Component sayfalarında "How do I use it?" bölümü

Her `modules/components/*.html` sayfasının sonunda `<!--::Usage-->` bloğu bulunur: `bb-usage` bileşeni (başlık, açıklama, `bb-usage-code` kod bloğu, Copy düğmesi). Kod Example sayfadaki gerçek demo işaretlemesinden alınır; yeni component eklerken aynı bloğu ekleyin ve sayfaya `assets/js/core/bb-usage.js` bağlayın. Stil: `assets/scss/components/_usage.scss` (yalnız token).

## Katman sırası (z-index)

`--bb-z-sticky` 1020 < `--bb-z-header` 1030 < `--bb-z-dropdown` 1050 < `--bb-z-drawer` 1055. Header (`.bb-header`, `.bb-shell-header`) sticky içeriğin üstündedir; header menüleri sayfa nesnelerinin altında kalmaz. Sayfa içi sticky değerleri 1030'un altında tutulur.

## Son İlke

> **Core yöntemleri ve component omurgasını tanımlar.  
> Application bunları miras alır ve kendi görsel/işlevsel dünyasını kurar.  
> Page ise bu parçaları yalnızca compose eder.**

Bu repo geliştirilirken varsayılan düşünce biçimi budur.
