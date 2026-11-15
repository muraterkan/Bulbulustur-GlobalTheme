# Panel Menü Ağacı — Faz 7 Onaylı Kararlar

Tarih: 2026-11-15

## Murat'ın kesinleştirdiği kararlar

- Menü dili: **Türkçe**.
- Ana bölüm kapsamı: **Gösterge Panelleri, Sayfalar, Uygulamalar, Düzenler**.
- İkon: **Material Symbols** (mevcut yapı devam eder).
- Yardım bölümü ilk sürüm sidebar ağacına dahil değildir. Mevcut component demoları kendi adreslerinde kalır.

## Gerçekleştirme

- `modules/panel/sayfalar.html`: dört bölümün altında toplam **58** sayfa girişi; 3 seviyeli `bb-menu` grupları.
- `assets/js/bb-panel-pages.js`: Türkçe başlık ve breadcrumb, sayfa kimliği ve aktif menü eşleştirmesi.
- `modules/panel/dashboard.html`: dashboard genel bakış girişi doğrudan Faz 8 içerik demosuna bağlanır.
- Diğer 57 menü girişi ortak, parametrik boş sayfa şablonuna gider (`sayfalar.html?page=<id>`). Bu yöntem sayfaların iskeletini tek örnekte tutar; gerçek içerikler ilgili fazlarda geliştirilecektir.
- Menu id'leri ve link parametreleri kalıcı, İngilizce slug biçiminde tutulmuştur. Görünen metin Türkçedir.
- Önceki Faz 1–6 demo sayfaları geçmiş aşamaları gösteren örnekler olarak korunmuştur.

## Test

Statik denetimde 58 benzersiz link, 58 tanımlı sayfa kimliği, sıfır bozuk sayfa referansı ve dört bölüm doğrulandı. JavaScript V8 sözdizimi geçti. Sayfa HTML etiket eşleşmeleri kontrol edildi.

Gerçek tarayıcı etkileşimi, yeni CSS derlemesi ve kontrat testleri bu oturumda çalıştırılamadı. Önceki kullanıcı çıktısındaki 22/22 sonucu Faz 8 öncesine aittir.
