---
iddia: "CSP başlığı varsa çıktı kodlama ya da girdi temizleme yapmama gerek kalmaz."
hukum: yanlis
ozet: "MDN, CSP'nin girdi temizlemenin alternatifi olmadığını, ikisinin birlikte kullanılması gerektiğini söyler. CSP, temizleme başarısız olsa bile XSS karşısında ek bir savunma katmanı sağlar."
analoji: "Evin kapısına kilit takmak yerine yalnız alarm kurmak gibi: alarm hırsızın vereceği zararı sınırlar, ama kilidin işini yapmaz. İkisi birlikte olmalı."
kaynaklar:
  - { ad: "MDN: Content Security Policy (CSP)", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP" }
ilgiliDers: appsec-004
tarih: "2026-11-25"
---

İçerik Güvenlik Politikası (CSP), tarayıcıya sayfanın hangi kaynaklardan betik yükleyebileceğini söyler. Katı bir CSP, saldırganın sayfaya yerleştirdiği betiğin çalışmasını çoğu durumda engeller. Bu yüzden "CSP koydum, XSS bitti" düşüncesi kolayca doğar.

MDN'nin ifadesiyle CSP, **savunma derinliği** sağlar: web siteleri girdiyi temizlemeli **ve** CSP koymalıdır. CSP girdi temizlemenin yerini almaz; temizleme başarısız olsa bile koruma sağlayan ikinci katmandır.

Neden yetmez?

- CSP yanlış yazılırsa (ör. her yerden betiğe izin verirse) koruma kalmaz.
- Betik çalışmasa bile enjekte edilen HTML, sayfanın görünümünü ve formlarını değiştirebilir.
- Her tarayıcıda ve her durumda aynı davranış garanti değildir.

Doğru sıra: bağlama uygun **çıktı kodlaması** asıl çözümdür, CSP ve `HttpOnly` çerez ek katmandır (ders 4).
