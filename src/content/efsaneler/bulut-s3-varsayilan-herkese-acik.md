---
iddia: "S3 bucket'ları varsayılan olarak herkese açıktır."
hukum: yanlis
ozet: "AWS belgelerine göre yeni bucket'lar, erişim noktaları ve nesneler varsayılan olarak herkese açık erişime izin vermez. Açıklık, birinin bucket politikası, erişim noktası politikası ya da nesne izinlerini değiştirmesiyle oluşur."
analoji: "Yeni teslim edilen depo kilitli gelir; kapıyı ardına kadar açan kişi senin ekibinden biridir."
kaynaklar:
  - { ad: "AWS: Amazon S3 depolamasına herkese açık erişimi engellemek", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html" }
ilgiliDers: bulut-005
tarih: "2026-11-25"
---

Bu efsane, haberlerdeki "açık bucket" olaylarından doğuyor. Ama o olaylarda bucket kendiliğinden açık gelmedi. AWS'nin Block Public Access belgesi şunu söylüyor: yeni bucket'lar, erişim noktaları ve nesneler varsayılan olarak herkese açık erişime izin vermez; ancak kullanıcılar bucket politikalarını, erişim noktası politikalarını ya da nesne izinlerini değiştirerek herkese açık erişim verebilir.

Yani sorun varsayılan ayar değil, sonradan yapılan değişikliktir: `Principal: "*"` içeren bir politika, herkese açık bir ACL. Bunu hesap ve bucket düzeyinde engelleyen mekanizma Block Public Access'tir; AWS dört ayarın da açılmasını önerir. Bu ayar politikaları ve ACL'leri geçersiz kılar.

Dikkat: Block Public Access kapatılırsa eski herkese açık politika yeniden etkinleşir. Ayrıca statik web sitesi gibi bilerek herkese açık içerik yayınlıyorsan ayarları özelleştirmen gerekebilir.

Kısacası: bucket kendiliğinden açılmaz, ama kolayca açılabilir. Kodda `Principal: "*"` arayan bir kontrol ve hesap düzeyinde Block Public Access, bu yanlışı büyük ölçüde önler.
