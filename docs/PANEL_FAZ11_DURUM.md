# GlobalTheme Panel — Faz 11 Teslim

Tarih: 2026-11-16
Dal: `main`

## Dosyalar

- `assets/scss/layout/_panel-auth.scss`: mevcut bb-app, bb-panel, bb-card, form ve token altyapısı üzerinde auth/hata yüzeyleri.
- `assets/js/bb-panel-auth.js`: tarayıcı tarafında giriş/kayıt/şifre sıfırlama form doğrulama, şifre göster/gizle, şifre tekrar karşılaştırma, sonuç mesajı.
- `modules/panel/giris.html`: giriş formu.
- `modules/panel/kayit.html`: kayıt formu.
- `modules/panel/sifre-sifirla.html`: şifre sıfırlama talebi demo formu.
- `modules/panel/404.html`: 404 örneği.
- `modules/panel/500.html`: 500 örneği.
- `assets/scss/main.scss`: Faz 11 partial'ı eklendi.
- `modules/panel/sayfalar.html`, `dashboard.html`, `listeler.html`, `formlar.html`: Authentication ve 404/500 menü girişleri gerçek demo sayfa bağlantılarına taşındı.

## Kapsam sınırı

Bu sürüm yalnız statik UI demolarıdır. Girişte oturum açılmaz, kayıt oluşturulmaz, şifre sıfırlama e-postası gönderilmez. JS hiçbir API çağrısı yapmaz. Metronic kodu kopyalanmadı; mevcut `bb-` ve token yapılarına bağlı kalındı.

## Kaynak kontrolü

- Beş HTML dosyasının temel açık/kapalı etiket sayıları eşleşti.
- `bb-panel-auth.js` V8 sözdizimi kontrolünü geçti.
- `main.scss` içinde auth partial çağrısı doğrulandı.
- **Henüz yapılmayanlar:** Faz 11 sonrası Sass derlemesi; `check:contracts`, `check:css`; gerçek tarayıcıda açık/koyu, mobil ve klavye odağı testleri.
- Kullanıcının önceki `build:css`, `22/22` ve `check:css` çıktıları Faz 10'a aittir, Faz 11'i kapsamaz.
- Derlenmiş `assets/css/main.css` bu değişikliklerle GitHub'a eklenmedi.

## VS Code üzerinden doğrulama

```powershell
git pull origin main
npm run build:css
npm run check:contracts
```

Live Server ile `modules/panel/giris.html`, `kayit.html`, `sifre-sifirla.html`, `404.html`, `500.html` dosyalarını aç. Girişte boş e-posta, kısa şifre; kayıtta farklı tekrar şifresi ve şart kutusu; şifre sıfırlamada geçersiz e-posta kontrollerini dene. Açık/koyu ve dar ekran görünümüne bak.

```powershell
git add assets/css/main.css
git commit -m "build(css): faz 11 auth stilleri"
npm run check:css
git push origin main
```

## Sonraki faz

Faz 12: Profil, hesap ve fatura sayfaları. Kullanıcı doğrulayıp onaylamadan başlatılmaz.
