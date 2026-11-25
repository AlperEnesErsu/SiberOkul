---
iddia: "Çerezde SameSite kullanıyorsam CSRF token'a gerek kalmaz."
hukum: kismen
ozet: "OWASP CSRF rehberi, SameSite'ı ek bir savunma katmanı olarak tanımlar ve çoğu kurulumda uygun bir CSRF savunmasının yerini tutmadığını söyler. Ayrıca XSS varsa CSRF savunmalarının hepsi aşılabilir."
analoji: "Kapıya ikinci bir kilit takmak gibi: faydalı, ama asıl kilidi kaldırmak için yeterli bir sebep değil."
kaynaklar:
  - { ad: "OWASP Cross-Site Request Forgery Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html" }
ilgiliDers: appsec-005
tarih: "2026-11-25"
---

`SameSite` özniteliği, tarayıcıya çerezin başka bir siteden gelen isteklerde gönderilip gönderilmeyeceğini söyler. `Lax` ve `Strict` değerleri, klasik CSRF saldırılarının büyük kısmını zorlaştırır. Bu yüzden değerli bir önlemdir.

Ama OWASP'a göre tek başına yeterli sayılmaz:

- SameSite, **derinlemesine savunmanın** bir katmanıdır; çoğu uygulamada uygun bir CSRF savunmasının yerini almaz.
- Aynı sitenin başka bir parçası (örneğin ele geçirilen bir alt alan adı) "aynı site" sayılabilir.
- **XSS** varsa saldırganın betiği zaten sitenin içinden çalışır; token'ı okuyup kullanabilir. XSS, CSRF savunmalarının hepsini aşabilir.

Güvenli yaklaşım: durumu değiştiren isteklerde CSRF token doğrula, çerezlere `SameSite` ekle, XSS'i ayrıca kapat. Çerçevelerin yerleşik CSRF korumasını açık tut (ders 5).
