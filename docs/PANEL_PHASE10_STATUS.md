# Panel Template — Faz 10 teslim

Date: 2026-11-15
Dal: `main`

## Gerçekleştirilen

- `assets/scss/layout/_panel-form.scss`: üç adımlı sihirbaz (stepper), dosya sürükle-bırak alanı, ön izleme yüzeyi.
- `assets/js/bb-panel-form.js`: adım geçişi, zorunlu alan kontrolü, örnek dosya seçimi (PNG, JPEG, PDF; 5 MB ve 4 dosya sınırı), özeti oluşturma, sıfırlama ve yalnızca tarayıcı içi tamamlama.
- `modules/panel/forms.html`: GlobalTheme panel kabuğu içinde ürün formu demosu. Mevcut `form-control`, `form-select`, `bb-card`, Bootstrap etiket ve form tipleri.
- `assets/scss/main.scss`: `layout/panel-form` eklendi.
- `assets/js/bb-panel-pages.js`: panel demo sayfalarında varsayılan aktif menüyü `data-bb-panel-default-page` ile belirleyebilme.
- `modules/panel/dashboard.html`, `modules/panel/pages.html`, `modules/panel/lists.html`: Projeler/Oluştur menü bağlantısı form demosuna yönlendirildi.

## Doğrulama

- GitHub'da oluşturulup tekrar okunan dosyalarda yeni HTML'nin ana etiket açma/kapatma sayıları eşleşti.
- `bb-panel-form.js` ve güncellenen `bb-panel-pages.js` JavaScript sözdizimi V8 tarafından kabul edildi.
- Üç form adımı ve ilgili fieldsets HTML kaynağında mevcut; dosya alanı ve form script linki var; SCSS partial `main.scss` içine ekli.
- **Yerel CSS derlemesi, kontrat ve gerçek tarayıcı davranış kontrolleri Faz 10 için yapılmadı.**
- Last kullanıcı çıktısındaki `check:css` başarısı Faz 8 koduna aittir. Bu çalışma için yeniden test edilmelidir.
- `assets/css/main.css` henüz yeniden üretilip GitHub'a konmadı.
- Demo verileri sunucuya göndermez. Sürüklenen veya seçilen dosyalar yüklenmez.

## Git merge uyarısı

Usernın son `git status` çıktısı merge devam ettiğini, tüm çatışmalar çözülmüş olmasına rağmen commit henüz atılmadığını gösteriyor. O durum temizlenmeden `git pull` / `git push` tekrarlanmamalı. Önce `git commit -m "merge: yerel ve uzak main"` ile merge sonlandırılmalı. `package-lock.json` üzerinde merge'e dahil edilmemiş yerel değişiklik var; otomatik silinmemeli.

## VS Code testi

1. Önce merge'i bitir, sonra `git pull origin main`.
2. `npm run build:css`, `npm run check:contracts`.
3. VS Code Live Server ile `modules/panel/forms.html` dosyasını aç.
4. Boş alanlarla İleri, ardından valid form; sonraki adımda PDF/PNG/JPEG seçimi, limit hataları, ön izleme, geri ve sıfırlama etkileşimlerini dene.
5. Tarayıcıda mobil genişlik, dark/light ve klavye odağı kontrolü.
6. Derlenen CSS için commit, ardından `npm run check:css`, son olarak `git push origin main`.

## Sıradaki faz

Faz 11: Giriş/kayıt/şifre sıfırlama ve 404/500 sayfaları. Onaysız başlanmadı.
