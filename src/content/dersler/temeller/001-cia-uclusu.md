---
kimlik: temeller-001
baslik: "CIA üçlüsü"
donem: 3
sira: 1
sure: 25
neden: "Bir DevSecOps mühendisi her güvenlik kararında aslında şunu sorar: hangi özelliği koruyoruz? CIA üçlüsü, bir olayı ve bir önlemi aynı dille konuşmanı sağlar. Rapor yazarken, risk değerlendirirken ve öncelik belirlerken hep bu üç kelimeye geri döneceksin."
analoji:
  baslik: "Banka kasası"
  metin: "Kasadaki belgeleri yalnız yetkililer görebilmeli (gizlilik). Biri içine girip belgeleri değiştirmemeli (bütünlük). Sen ihtiyaç duyduğunda kasa açılabilmeli (erişilebilirlik). Üçünü birden en sıkı yapmak mümkün değil: kasayı betona gömersen kimse ulaşamaz. Benzetmenin sınırı şu: dijital dünyada 'kasa' çoğu zaman bir sunucu ya da hizmettir ve hırsız uzaktan gelir."
gorev:
  aciklama: "WSL terminalinde küçük bir deney yap. Bir dosya oluştur, onu yalnız senin okuyabileceğin hale getir, sonra değiştirmeyi dene. Her adımda hangi CIA ögesine dokunduğunu düşün."
  komutlar:
    - mkdir -p ~/cia && cd ~/cia
    - echo "gizli not" > not.txt
    - chmod 600 not.txt
    - ls -l not.txt
    - chmod 000 not.txt
    - cat not.txt
    - chmod 600 not.txt
  soru: "`chmod 600` hangi CIA ögesini, `chmod 000` ise hangisini zedeledi? Neden?"
  telefon:
    soru: "Bir fidye yazılımı sunucudaki bütün dosyaları şifreleyip kilitledi. Dosyaları kimse okumuş ya da değiştirmiş değil, sadece açılamıyor. CIA'nın hangi ögesi ihlal edildi?"
    cevap: "Erişilebilirlik. Veri çalınmadı (gizlilik şart değil) ve içeriği değiştirilmedi (bütünlük bozulmadı); ama sahibi ona ulaşamıyor. Not: bazı fidye saldırıları veriyi önce çalıp sızdırır, o zaman gizlilik de ihlal edilir."
sorular:
  - id: temeller-001-s1
    soru: "CIA üçlüsündeki üç harf neyi ifade eder ve her biri tek cümleyle ne demektir?"
    cevap: "Confidentiality (gizlilik): bilgiye yalnız yetkililer ulaşır. Integrity (bütünlük): bilgi izinsiz değişmez, doğruluğu korunur. Availability (erişilebilirlik): bilgi ve hizmet ihtiyaç duyulduğunda kullanılabilir."
  - id: temeller-001-s2
    soru: "Bir çalışan müşteri listesini yanlış kişiye e-postayla gönderdi. Hangi CIA ögesi ihlal edildi?"
    cevap: "Gizlilik. Bilgi yetkisiz birinin eline geçti. Bilgi değişmediği ve hizmet çalıştığı için bütünlük ve erişilebilirlik bu olayda sağlam."
  - id: temeller-001-s3
    soru: "Bir saldırgan veritabanındaki fiyatları gizlice değiştirdi, kimse fark etmedi. Bu neden bütünlük ihlalidir ve neden tehlikeli?"
    cevap: "Veri yerinde duruyor ve erişilebiliyor ama artık doğru değil. Tehlikesi, bozulmanın fark edilmemesidir: yanlış veriye güvenerek kararlar verilir. Bu yüzden değişiklik kayıtları ve doğrulama gerekir."
  - id: temeller-001-s4
    soru: "Neden her şeyi aynı anda en üst seviyede korumak genelde mümkün değildir? Bir örnek ver."
    cevap: "Önlemler birbirinin aleyhine çalışabilir. Örneğin sistemi çok sıkı kilitlemek gizliliği artırır ama meşru kullanıcıların işini zorlaştırıp erişilebilirliği düşürür. Bu yüzden her varlık için hangisinin daha önemli olduğuna karar verilir."
derinDalis:
  - tur: kitap
    baslik: "Security Engineering (Ross Anderson)"
    ayrinti: "Giriş bölümleri güvenlik hedeflerini ve gerçek olaylar üzerinden neden bu kadar zor olduğunu anlatır. Yazar kitabın büyük kısmını ücretsiz yayımlıyor; arama motorunda kitabın adını yaz."
  - tur: okuma
    baslik: "Kendi olay örneğini bul"
    ayrinti: "Son yıllarda haberlere çıkmış bir veri sızıntısı, bir DDoS ve bir fidye olayı seç. Her birinin CIA'da hangi ögeyi vurduğunu bir cümleyle yaz."
---

**CIA üçlüsü** (CIA triad), bilgi güvenliğinin üç temel hedefidir. İstihbarat kurumuyla ilgisi yok; harfler şu kelimelerin baş harfleridir.

### Gizlilik (Confidentiality)

Bilgiyi yalnız görmeye yetkili olanlar görür. Parola, kişisel veri, müşteri listesi, kaynak kodu buna örnektir. Gizliliği koruyan şeyler: şifreleme, erişim kontrolü, kimlik doğrulama. Gizlilik ihlali çoğu zaman haberlere "veri sızıntısı" diye yansır.

### Bütünlük (Integrity)

Bilgi izinsiz ya da fark edilmeden değişmez. Bir faturanın tutarı, bir yazılım paketinin içeriği, bir günlük (log) kaydı buna örnektir. Bütünlüğü koruyan şeyler: hash ile doğrulama, dijital imza, sürüm kontrolü, değişiklik kayıtları. Bütünlük ihlali sinsidir; veri duruyor ve çalışıyor gibi görünür ama artık doğru değildir.

### Erişilebilirlik (Availability)

Doğru kişi, ihtiyaç duyduğunda bilgiye ve hizmete ulaşabilir. Yedekler, yedekli (redundant) sunucular ve DDoS korumaları bunu sağlar. Fidye yazılımı ve hizmeti çökerten saldırılar bu ögeyi hedefler.

### Üçü bir arada

| Olay | Zedelenen öge |
|---|---|
| Müşteri verisi yanlış kişiye gitti | Gizlilik |
| Fiyat tablosu gizlice değiştirildi | Bütünlük |
| Sitenin üzerine sahte trafik yığıldı | Erişilebilirlik |
| Sunucu ele geçirildi, veri çalındı ve silindi | Hepsi |

Önlemler birbiriyle gerilim yaratır. Sistemi aşırı sıkı kilitlemek gizliliği artırır, ama gerçek kullanıcılar da giremezse erişilebilirlik düşer. Güvenlik mühendisliği bu dengeyi kurmaktır: her varlık için hangi öge daha önemli? Bir hastane kayıt sistemi için erişilebilirlik hayati olabilir; bir kripto cüzdanı için gizlilik ve bütünlük.

### Bu bölgede nereye gidiyoruz?

Sonraki derslerde her kavramı bir CIA ögesine bağlayacaksın. Şifreleme gizliliği, hash bütünlüğü, yedekleme ve olay müdahalesi erişilebilirliği korur. Bir kavramı öğrenirken "bu hangi ögeyi koruyor?" diye sorman, onu ezberlemekten çok daha kalıcı olur.

Bir olayı değerlendirirken şu üç soruyu sırayla sor: Yetkisiz biri gördü mü? Yetkisiz biri değiştirdi mi? Yetkili kişi kullanamadı mı? Cevaplar olayın gerçek boyutunu verir. Çoğu olay tek bir öge gibi başlar ama zincirleme yayılır: bir kimlik bilgisi sızıntısı (gizlilik) saldırganın veriyi değiştirmesine (bütünlük) ve sonunda sistemi kapatmasına (erişilebilirlik) yol açabilir.

Güvenlik notu: Raporlarda "veri sızdı" demek yetmez; hangi ögenin, nasıl ve ne kadar zedelendiğini yaz. Bu hem müdahaleyi hem öncelik sırasını belirler.
