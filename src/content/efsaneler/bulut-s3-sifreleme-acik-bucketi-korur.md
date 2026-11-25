---
iddia: "S3'te nesneler şifreli olduğu için herkese açık bir bucket'taki veri de güvendedir."
hukum: yanlis
ozet: "S3 nesneleri disk üzerinde varsayılan olarak şifreler, ama yetkili bir istek geldiğinde veriyi sizin için çözer. Bucket herkese açıksa 'yetkili' herkestir; şifreleme erişim kontrolünün yerini tutmaz."
analoji: "Kasanın içindeki belgeler kilitli bir çekmecede olsa da kasanın kapısını herkese açık bırakırsan, kapıdan giren çekmeceyi senin adına açtırır."
kaynaklar:
  - { ad: "AWS S3: Sunucu tarafı şifreleme ile veri koruma", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/serv-side-encryption.html" }
  - { ad: "AWS S3: Güvenlik en iyi uygulamaları", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html" }
ilgiliDers: bulut-005
tarih: "2026-11-25"
---

AWS, 5 Ocak 2023'ten beri S3'e yüklenen yeni nesneleri varsayılan olarak SSE-S3 ile otomatik şifreler. Bu iyi bir koruma gibi görünür, o yüzden "veri şifreli, demek ki açık bucket sorun olmaz" düşüncesi yaygındır.

Ama AWS'nin kendi anlatımı şunu söyler: S3 veriyi diske yazarken şifreler ve siz eriştiğinizde sizin için çözer. İsteğinizi doğrulayıp erişim izniniz varsa şifreli ya da şifresiz nesneye erişim şekli arasında fark yoktur. Yani şifreleme, **durağan veriyi** (diskin ele geçirilmesi gibi durumları) korur.

Bir bucket politikası `Principal: "*"` ile okumaya izin veriyorsa isteği yapan herkes yetkili sayılır ve nesne çözülmüş halde gelir. AWS'nin güvenlik rehberi bu yüzden bucket'ların herkese açık olmaması için Block Public Access kullanmayı, `Principal: "*"` içeren politikaları aramayı ve Access Analyzer gibi araçlarla açık kaynakları izlemeyi önerir.

Hüküm: şifreleme gerekli ama yetersiz. Önce kim okuyabilir sorusunu doğru yanıtla (Block Public Access, dar politikalar), şifrelemeyi ek katman olarak düşün.
