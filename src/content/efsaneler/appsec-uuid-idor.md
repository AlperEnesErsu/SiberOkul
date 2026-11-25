---
iddia: "Kimlikleri tahmin edilemeyen UUID yaparsam IDOR açığı kapanır."
hukum: yanlis
ozet: "UUID tahmini zorlaştırır ama erişim kontrolünün yerini tutmaz. OWASP, karmaşık kimliklerde bile erişim denetimlerinin şart olduğunu ve saldırgan başka bir nesnenin adresini ele geçirse de uygulamanın erişimi engellemesi gerektiğini söyler."
analoji: "Kapıya çok uzun ve karışık bir numara vermek gibi: kimse tahmin edemez, ama numarayı öğrenen biri kapıyı kilitsiz bulursa içeri girer. Çözüm kilittir, numara değil."
kaynaklar:
  - { ad: "OWASP IDOR Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html" }
ilgiliDers: appsec-007
tarih: "2026-11-25"
---

IDOR, sunucunun "bu kayıt bu kullanıcıya ait mi?" sorusunu sormamasıyla oluşur. Sıralı numaralar (`/fatura/1042`) açığı denemeyi kolaylaştırır; bu yüzden birçok geliştirici kimlikleri rastgele UUID yapar.

UUID işe yarar ama yalnız **tahmin etmeyi** zorlaştırır. Kimlikler başka yollardan sızabilir: paylaşılan bir bağlantı, tarayıcı geçmişi, günlük dosyaları, başka bir API yanıtı. Kimliği öğrenen kullanıcı, sunucu sahiplik denetimi yapmıyorsa kaydı yine açar.

OWASP'ın rehberi bunu açıkça söyler: karmaşık kimliklerle bile erişim denetimi şarttır.

Doğru savunma sırası:

1. **Sunucuda sahiplik/yetki denetimi** her istekte yapılır.
2. Mümkünse kimlik istekten değil **oturumdan** türetilir (`/profilim`).
3. UUID gibi tahmini zor kimlikler **ek katman** olarak kullanılır.

Kod incelemesinde "kimlik rastgele, sorun yok" yorumunu görürsen şunu sor: bu uç nokta, isteği yapanın kaydın sahibi olduğunu nerede doğruluyor? (ders 7)
