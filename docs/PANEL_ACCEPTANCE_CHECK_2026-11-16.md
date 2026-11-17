# GlobalTheme Panel — Görsel ve Fonksiyonel Kabul Kontrolü

Tarih: 2026-11-16
Dal: `main`
Durum: **Kabul süreci açık; tarayıcı testleri henüz sonuçlandırılmadı.**

## Kapsam ve referans

`PROJE_BAGLAMI.md`, `KURALLAR.md` ve `IS_PLANI.md` çalışma koşullarına göre Faz 0–12 kod teslimi tamamlandı. Metronic ekran görüntüleri yapı ve davranış referansıdır, kod/CSS kopyalama kaynağı değildir. Yerel derleme ve SCSS kontratları kullanıcının paylaştığı son çıktıda başarılı: `build:css`, `check:contracts` 22/22, `check:css`, derlenmiş CSS push `5c7c417`.

### Kaynak denetiminin ilk sonucu

- GitHub üzerinden 18 panel demo HTML sayfası incelendi.
- Aynı sayfada tekrar eden `id`: 0; var olmayan `aria-controls` hedefi: 0.
- Mevcut form, kart, menü, tablo, sayfalama ve chart renk tokenları yerinde bırakıldı.
- `scripts/check-panel.mjs` ve `npm run check:panel` eklendi. Link/script dosyası varlığı, ID/aria-controls, menü ID eşleştirmesi ve JS sözdizimi testleri için yerel çalıştırma komutu; **bu dosya doğrulama betiği henüz kullanıcının yerel deposunda çalıştırılmadı**.
- Gerçek ekran görüntüsü karşılaştırması, mobil CSS görünümü, popup odak yönetimi, form etkileşimi ve yazıcı çıktısı henüz gözlemlenmedi.

## 2026-11-16 — User ekran görüntüsü sonrası somut kusurlar

- **Kritik / düzeltildi (kaynak):** `_menu.scss` içerisindeki yatay `.bb-menu-item` flex düzeni sidebar accordion alt öğelerini sağa, içerik alanına taşıyordu. `layout/_panel-sidebar.scss` içinde yalnız sidebar öğelerine `flex-direction: column`, genişlik ve min-width sınırlaması eklendi. Tarayıcıda yeniden test gerekli.
- **Kritik / düzeltildi (kaynak):** 13 panel sayfası depoda olmayan `assets/media/logos/default-dark.svg` görüntüsünü çağırıyordu. `bb-panel-brand-text` ile metin marka başlığına geçildi.
- **Kullanılabilir demo / eklendi:** `modules/panel/social-feed.html`, `assets/js/bb-panel-social.js`. Üç örnek gönderi, paylaşım yazma, takip filtresi, beğenme, profil/konu kartları. Tüm işlemler bellekte; gerçek sosyal API değil.
- **AÇIK KAPSAM:** 58 menü kimliğinden yalnız belirli sayfalar (Dashboard, Ürünler, Oluştur, giriş/kayıt/sıfırlama, 404/500, profil/hesap/fatura, sosyal akış) içerik demosuna bağlandı. Kalan sayfalar `pages.html?page=...` üzerinden `Yapım aşamasında` şablonunu gösteriyor. Bu menüler **tamamlanmış içerik sayfası sayılmaz**. Önceki Faz 0–12 "tamamlandı" değerlendirmesi yalnız fazların örnek dosyaları için geçerlidir.
- **KABUL BEKLİYOR:** CSS derlemesi ve canlı tarayıcı görsel kontrolü bu düzeltmelerden sonra henüz yapılmadı. Tam kabul kapatılamaz.

## Otomatik kontroller

- [x] Faz 12'ye kadar Sass derlemesi — kullanıcının terminal çıktısı
- [x] SCSS kontratları 22/22 — kullanıcının terminal çıktısı
- [x] `check:css` — kullanıcının terminal çıktısı
- [x] 18 HTML'de ID ve aria-controls kaynak taraması — GitHub kaynak incelemesi
- [ ] `npm run check:panel` — kullanıcı yerel ortamında çalıştıracak
- [ ] CSS güncelleme sonrası `npm run check:css` — yeni bir SCSS değişikliği gerekirse tekrar

## Tarayıcı kabul matrisi

İlk olarak VS Code Live Server'da `modules/panel/dashboard.html` aç.

Ekran genişlikleri: 375px, 768px, 1024px, 1440px. Her genişlikte `data-bs-theme="dark"` ve `light` kontrol edilecek. Klavye için `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape` kullanılacak.

- [ ] **Faz 1–2 Shell/sidebar:** 1440px daralt/genişlet, 375px drawer aç/kapat, backdrop ve Escape, odak geri döner, 3 seviye menü ve aktif öğe
- [ ] **Faz 3–4 Header/popup:** arama, bildirim, mesaj, uygulamalar, avatar popup; açılma, kapanma, tema; dışarı tıkla ve Escape; tab odak sırası
- [ ] **Faz 5–7 Toolbar/layout/menü:** breadcrumb, aksiyon butonları, sidebar/top/auth varyantları, boş sayfa fallback, Türkçe menü ve 58 sayfa kimliği
- [ ] **Faz 8 Dashboard:** 4 KPI, halka grafik/legend, hafta şeridi, proje tablosu, timeline, vurgu kartı; yatay taşma yok; light/dark renkleri
- [ ] **Faz 9 List:** arama, durum filtreleme, sıralama, 5/10/20 kayıt, tekli/toplu seçim, toplu güncelleme (demo), detay; 375px tabloda kaydırma
- [ ] **Faz 10 Form:** gerekli alanları boş bırakınca ilerleme engeli; geçerli giriş, dosya tür ve boyut sınırları, sürükle-bırak, özet, geri ve sıfırla
- [ ] **Faz 11 Auth/error:** giriş/kayıt/e-posta sıfırlama alan doğrulaması, şifre eşleme, görünür şifre, gerçek oturum olmadığının mesajı; 404/500 yönlendirme
- [ ] **Faz 12 Profil/hesap/fatura:** profil başlığı ve avatar, hesap e-posta doğrulaması, tercihler/sıfırla, fatura tutarları ve Yazdır/PDF baskı görünümü
- [ ] Görsel referansla son karşılaştırma: sol sidebar, header yükseklikleri, kart yüzeyleri, boşluklar, koyu/açık renklerde kontrast
- [ ] DevTools Console: JavaScript hata ve beklenmeyen ağ isteği bulunmuyor
- [ ] Klavye ile gizlenmiş menü bağlantısına ulaşılmıyor; sidebar/popup Escape sonrası odak mantıklı öğeye dönüyor

## Varsayımsız bekleyen kararlar

Kaynak `PROJE_BAGLAMI.md` içinde açık bırakılmış olan `base/_zindex.scss`, `forms-final`, `product-quick-view`, eski `bb-modal.js` ve tanımsız fallback kancaları karara bağlanmadan toplu refactor edilmez. Bu kabul işi o mimari kararları değiştirmez.

## VS Code / PowerShell

```powershell
cd C:\DEV\FRONTENT\Bulbulustur-GlobalTheme
git pull origin main
npm run check:panel
npm run check:contracts
npm run check:css
```

Statik betik FAIL raporlarsa çıktısını paylaş; tek tek somut hatalar düzeltilir. Bu turda SCSS değişmediği için yeniden CSS commit'i gerekmez. Görsel referans karşılaştırması veya ekran görüntüsü için kullanıcı gerçek tarayıcı çıktısı sağlayabilir.

## Kabul ölçütü

`check:panel`, `check:contracts`, `check:css` başarılı ve tarayıcı matrisi tamam olduğunda panel kabulü kapatılabilir. Şu anda henüz **tam kabul** durumunda değildir.
