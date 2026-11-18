# Panel Template — Faz 12 Teslim

Tarih: 2026-11-16
Dal: `main`

## Yapılanlar

- `modules/panel/profile.html`: avatar, kullanıcı özeti, temel profil bilgileri, son etkinlik zaman çizelgesi.
- `modules/panel/account.html`: ad/soyad, e-posta, telefon, dil, açıklama, bildirim tercihi; zorunlu alan kontrolü, sıfırlama ve demo sonucu.
- `modules/panel/invoices.html`: temsili fatura numarası, alıcı, tarih, kalem tablosu, örnek vergi/toplam; tarayıcı yazdır/PDF akışı.
- `assets/scss/layout/_panel-account.scss`: yalnız faza özgü yerleşim farkları ve yazdırma görünümü. Mevcut `bb-card`, `bb-symbol`, `bb-nav`, `bb-table` ve Bootstrap form sınıfları tekrar kullanılır.
- `assets/js/bb-panel-account.js`: form doğrulama (sunucuya göndermez) ve yazdırma.
- `assets/scss/main.scss`: Faz 12 SCSS importu eklendi.
- Faz 7–12 mevcut panel demolarındaki profil/hesap/fatura bağlantıları yeni sayfalara bağlandı.
- Eski `pages/demo1/account/overview.html` ve `settings.html` kaynaklarına dokunulmadı.

## Doğrulananlar

- Üç HTML sayfasının ana etiket açılış/kapanış sayımları uyumlu.
- JavaScript V8 sözdizimi denetimi geçti.
- SCSS `@use` hedefi ve sayfa `data-bb-panel-default-page` eşleşmeleri okundu.
- Yazdırma olayı ayrı JS dosyasında, inline event kullanılmadı.

## Henüz doğrulanmayanlar

- Faz 12 için `npm run build:css`, `npm run check:contracts`, `npm run check:css` çalıştırılmadı.
- Gerçek tarayıcıda light/dark, mobil ve klavye, yazdırma önizlemesi test edilmedi.
- Derlenmiş `assets/css/main.css` GitHub'a yazılmadı.
- Invoice ve profil bilgileri örnektir; gerçek API, veritabanı, GİB veya hesap kaydı yoktur.

## Yerel test

```powershell
git pull origin main
npm run build:css
npm run check:contracts
```

VS Code Live Server: `modules/panel/profile.html`, `account.html`, `invoices.html`.

Hesap formunda geçersiz e-posta, sıfırla/doğrula, dark/light ve mobil; fatura sayfasında Yazdır/PDF ve baskı görünümünü dene.

```powershell
git add assets/css/main.css
git commit -m "build(css): faz 12 profil hesap fatura stilleri"
npm run check:css
git push origin main
```

## Next iş

Faz 12 tamamlanınca iş planındaki 0–12 fazları kod bazında sonlanır. Görsel, erişilebilirlik ve fonksiyonel kabul kontrolleri planın genel doğrulama gereği açık kalır. Next faz kendiliğinden açılmaz.
