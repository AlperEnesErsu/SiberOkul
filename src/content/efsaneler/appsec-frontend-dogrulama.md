---
iddia: "Formu tarayıcıda (frontend) doğruladıysam sunucuda ayrıca doğrulamama gerek yok."
hukum: yanlis
ozet: "OWASP Input Validation rehberi, tarayıcı kontrolleri aynı alanları denetlese bile sunucuda da doğrulama yapılmasını ister ve istemci doğrulamasının atlatılabileceğini belirtir. Tarayıcı kontrolü kullanıcıya hızlı geri bildirim içindir, güvenlik önlemi değildir."
analoji: "Kapıdaki 'lütfen ayakkabılarınızı çıkarın' tabelası gibi: nazik insanlar uyar, ama kararlı biri tabelayı görmeden içeri girer. Asıl kontrol, içerideki görevlidir."
kaynaklar:
  - { ad: "OWASP Input Validation Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html" }
ilgiliDers: appsec-002
tarih: "2026-11-25"
---

Tarayıcıdaki doğrulama (JavaScript ya da HTML öznitelikleri), kullanıcının hata yaptığında hemen uyarılması için çok yararlıdır. Güvenlik açısından ise değeri yoktur, çünkü tarayıcı saldırganın kontrolündedir.

Saldırgan:

- Geliştirici araçlarıyla doğrulama kodunu değiştirebilir ya da devre dışı bırakabilir.
- Formu hiç kullanmadan, `curl` gibi bir araçla isteği doğrudan sunucuya gönderebilir.

İstek sunucuya ulaştığında sunucu, bunun senin formundan mı yoksa elle hazırlanmış bir istekten mi geldiğini bilemez.

Bu yüzden doğru yaklaşım iki katmanlıdır:

1. **İstemcide:** Kullanıcı deneyimi için hızlı kontrol (zorunlu alan, e-posta biçimi).
2. **Sunucuda:** Güvenlik için asıl doğrulama; tür, uzunluk, aralık ve biçim kontrolü, mümkünse izin listesiyle.

Sunucu doğrulaması tek başına da yeterli değildir: SQL ve HTML gibi hedef bağlamlar için parametreli sorgu ve çıktı kodlama gerekir (ders 2 ve 3). Ama sunucuda doğrulama olmadan, istemci kontrolü hiçbir şeyi korumaz.
