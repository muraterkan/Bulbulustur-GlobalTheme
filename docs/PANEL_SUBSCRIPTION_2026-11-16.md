# Panel — Subscription Details demo sayfası

Date: 2026-11-16
Dal: `main`

## Gerçekleştirilen

- `modules/panel/subscription.html`: Bulbulustur Subscription Details ekranındaki iki kolonlu düzen. Sol kolon: Customer, Products, Payment Methods, Gelişmiş Selectenekler. Sağ kolon: Summary.
- `assets/scss/layout/_panel-subscription.scss`: GlobalTheme renk, spacing, typography tokenlarıyla responsive abonelik ekranı.
- `assets/js/bb-panel-subscription.js`: müşteri ve ödeme yöntemi seçimi, plan ekle/kaldır, örnek özel alan ekle/kaldır, özet ve aylık toplam güncelleme, form doğrulama ve demo uyarısı.
- `assets/scss/main.scss`: ilgili partial `@use` ile dahil edildi.
- Mevcut panel demolarında Subscription/Overview bağlantıları `subscription.html` sayfasına çevrildi.

## Kapsam ve veri sınırı

Bu yalnız arayüz Exampledir. Customer ve kart bilgileri temsili, ödeme tutarları TRY bazında örnektir; herhangi bir abonelik oluşturma, ödeme tahsilatı, fatura düzenleme veya API isteği yapılmaz. New ödeme yöntemi butonu kullanım dışı olduğunu açıkça söyler.

## Kaynak doğrulaması

- HTML açık/kapat etiketleri eşleşti; tekrarlanan ID ve eksik aria-controls hedefi yok.
- `bb-panel-subscription.js` JavaScript sözdizimi V8 tarafından kabul edildi.
- JS için gerekli data-bb hookları HTML'de mevcut.
- SCSS partial `main.scss` içine eklendi.
- **Yerel Sass build, check:panel, check:contracts, check:css ve gerçek tarayıcı görünümü henüz bu değişikliklerden sonra çalıştırılmadı.**

## VS Code test

```powershell
git pull origin main
npm run build:css
npm run check:panel
npm run check:contracts
```

`modules/panel/subscription.html` dosyasını Live Server'da aç. Customer, plan ve ödeme seçimi sırasında özeti kontrol et. Product kaldırıp tekrar ekle, özel alan oluştur/kaldır, form gönder ve responsive dark/light görünümünü incele.

CSS derlenince:

```powershell
git add assets/css/main.css
git commit -m "build(css): abonelik detaylari"
npm run check:css
git push origin main
```
