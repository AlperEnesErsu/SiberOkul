---
no: 8
baslik: "Yeni dersler her sabah otomatik yazılacak"
tarih: "2026-11-25"
sorun: "Dersler hep bir gün önde olmalı ve bunun için her gün elle bir şey yapmak istemiyoruz. Ama ilerleme tarayıcıda; hangi derste olduğun sunucudan görülemiyor."
secenekler:
  - { ad: "Zamanlanmış görev + otomatik birleşme", aciklama: "Her sabah bir Claude görevi tamponu kontrol eder, eksikse dersi yazar, PR açar; CI geçerse PR birleşir.", secildi: true }
  - { ad: "Elle istemek", aciklama: "Her ders bitince 'sıradakini yaz' demek. Ücretsiz ve kontrollü, ama unutulduğu gün tampon azalır.", secildi: false }
neden: "Uğraşmadan her gün hazır ders. İlerleme görülemediği için takvime dayalı bir tampon kullanılıyor: yayımlanmış ders sayısı her zaman 'başlangıçtan beri geçen gün + 2' veya üstünde."
bedel: "Her çalışma Claude kullanım hakkından harcar. Dersler sen okumadan yayına girer; her ders sayfasındaki 'Hata bildir' bağlantısı bunun dengesi."
yoklamaSorusu:
  soru: "Başlangıçtan 3 gün sonra yayında 2 ders varsa görev kaç ders yazar?"
  cevap: "3. Gereken: 3 + 2 = 5 ders; mevcut 2; eksik 3."
---
