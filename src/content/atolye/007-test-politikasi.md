---
no: 7
baslik: "Testler yalnız hesap yapan koda"
tarih: "2026-11-25"
sorun: "Eski projelerde testlerin neyi koruduğunu takip etmek zorlaşmıştı. Bu projede neyi test edelim?"
secenekler:
  - { ad: "Yalnız `src/lib/` (hesap yapan kod)", aciklama: "Aralıklı tekrar, seri, Bugün seçimi, yedek kodu, harita durumu, HTML kaçırma.", secildi: true }
  - { ad: "Her şey, sayfa görünümleri dahil", aciklama: "Daha çok güven, ama bakım yükü ve 'bu test neyi koruyor' karmaşası.", secildi: false }
neden: "Hesap yapan kod bozulunca sessizce yanlış sonuç verir; bir soru hiç geri gelmez ve fark etmezsin. Sayfa görünümü bozulursa açıp bakınca görürsün. Her testin üstünde `// Korur: ...` satırı var; testi okumadan neyi koruduğunu anlarsın."
bedel: "Sayfa düzeni bozulursa test yakalamaz; gözle fark edilir."
yoklamaSorusu:
  soru: "Bir testin önce başarısız (kırmızı) çalıştığını görmek neden önemli?"
  cevap: "Hiç başarısız olmadığını gördüğün bir test, gerçekten bir şeyi kontrol ettiğini kanıtlamaz. Kodu yazmadan önce testi çalıştırıp başarısız olduğunu görmek, testin doğru şeyi ölçtüğünü gösterir."
---
