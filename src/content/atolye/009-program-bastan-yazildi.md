---
no: 9
baslik: "Bütün program baştan yazıldı, günlük otomatik görev iptal"
tarih: "2026-11-25"
sorun: "Dersleri her sabah otomatik bir görevle yazdırmayı planlamıştık (Karar 008). Ama Alper çoğunlukla telefondan çalışacak ve bütün bölgeleri baştan görmek, sınavlarla ilerlemek istiyor."
secenekler:
  - { ad: "Yoğun program, hepsi baştan (~97 ders)", aciklama: "8 bölge, bölge başına ~12 ders; bütün içerik ve sınavlar yayından önce yazılır.", secildi: true }
  - { ad: "Tam program (205 ders)", aciklama: "Daha derin ama yazması ve doğrulaması çok daha uzun ve pahalı.", secildi: false }
  - { ad: "Günlük otomatik görev", aciklama: "Her sabah bir ders yazılır; uğraşmadan ama içerik parça parça gelir ve her çalışma kullanım hakkı harcar.", secildi: false }
neden: "Önce bütün yolun haritası tamamlansın: her bölgeyi bitirince ne öğrenmiş olacağın belli olsun. İçerik baştan yazıldığı için her gün çalışan bir otomasyona da gerek kalmadı; yayın tek seferde yapılacak."
bedel: "97 dersi aynı anda yazmak hata kaçırma riskini artırır. Bu yüzden her bölge ayrı yazıldı, bir denetleyici (`scripts/icerik-denetle.mjs`) bütün dosyaları kontrol etti ve ayrıca doğruluk incelemesi yapıldı. Yine de bir hata görürsen her ders sayfasında 'Hata bildir' bağlantısı var."
yoklamaSorusu:
  soru: "Karar 008 neden artık geçerli değil?"
  cevap: "Çünkü içerik artık her gün parça parça değil, yayından önce bütün olarak yazıldı. Tamponu doldurmak için her sabah çalışan bir göreve gerek kalmadı."
---
