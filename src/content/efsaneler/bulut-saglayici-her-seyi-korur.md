---
iddia: "Bulut sağlayıcı her şeyin güvenliğinden sorumludur."
hukum: yanlis
ozet: "AWS'nin kendi anlatımına göre AWS bulutun altyapısını korur; bulut içindeki güvenlik (kimlikler, izinler, veri, yapılandırma) müşterinin sorumluluğunun parçasıdır ve hangi servisi seçtiğine göre değişir."
analoji: "Apartman yönetimi dış kapıyı ve asansörü korur; dairenin kapısını kilitlemek sana aittir."
kaynaklar:
  - { ad: "AWS: Paylaşılan Sorumluluk Modeli", url: "https://aws.amazon.com/compliance/shared-responsibility-model/" }
ilgiliDers: bulut-001
tarih: "2026-11-25"
---

AWS bu modeli iki cümleyle özetler: AWS bulutun güvenliğinden (security *of* the cloud), müşteri ise bulut içindeki güvenlikten (security *in* the cloud) sorumludur. Kaynağa göre AWS, bulutta sunulan tüm servislerin üzerinde çalıştığı altyapıyı korur. Müşterinin sorumluluğu ise seçtiği AWS servislerine göre belirlenir.

Bunun pratik anlamı: Veri merkezinin fiziksel güvenliği, sunucu donanımı ve temel servis altyapısı AWS'dedir. Ama hesabındaki IAM izinleri, herkese açık bıraktığın bir bucket, internete açık bir yönetim portu ya da koda gömülü bir anahtar senin sorumluluğundadır.

Çizgi servise göre kayar. Sanal makinede (EC2) işletim sistemi yamaları sende, sunucusuz bir serviste (Lambda) bu katmanı AWS yönetir. Ama hangi serviste olursan ol, veri ve erişim yönetimi müşteride kalır.

Bu yüzden "bulutta olduğumuz için güvenlik hallolmuştur" düşüncesi tehlikelidir. Doğru soru şudur: bu serviste benim payıma düşen satırlar hangileri ve onları kim kapatıyor?
