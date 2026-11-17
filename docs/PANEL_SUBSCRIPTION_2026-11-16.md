# Panel — Subscription Detayları demo sayfası

Tarih: 2026-11-16
Dal: `main`

## Gerçekleştirilen

- `modules/panel/subscription.html`: Metronic Subscription Details ekranındaki iki kolonlu düzen. Sol kolon: Müşteri, Ürünler, Ödeme Yöntemi, Gelişmiş Seçenekler. Sağ kolon: Özet.
- `assets/scss/layout/_panel-subscription.scss`: GlobalTheme renk, spacing, typography tokenlarıyla responsive abonelik ekranı.
- `assets/js/bb-panel-subscription.js`: müşteri ve ödeme yöntemi seçimi, plan ekle/kaldır, örnek özel alan ekle/kaldır, özet ve aylık toplam güncelleme, form doğrulama ve demo uyarısı.
- `assets/scss/main.scss`: ilgili partial `@use` ile dahil edildi.
- Mevcut panel demolarında Subscription/Genel Bakış bağlantıları `subscription.html` sayfasına çevrildi.

## Kapsam ve veri sınırı

Bu yalnız arayüz örneğidir. Müşteri ve kart bilgileri temsili, ödeme tutarları TRY bazında örnektir; herhangi bir abonelik oluşturma, ödeme tahsilatı, fatura düzenleme veya API isteği yapılmaz. Yeni ödeme yöntemi butonu kullanım dışı olduğunu açıkça söyler.

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

`modules/panel/subscription.html` dosyasını Live Server'da aç. Müşteri, plan ve ödeme seçimi sırasında özeti kontrol et. Ürün kaldırıp tekrar ekle, özel alan oluştur/kaldır, form gönder ve responsive dark/light görünümünü incele.

CSS derlenince:

```powershell
git add assets/css/main.css
git commit -m "build(css): abonelik detaylari"
npm run check:css
git push origin main
```
