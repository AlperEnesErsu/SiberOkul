---
iddia: "Parolaları SHA-256 ile hash'lersem güvenli saklamış olurum."
hukum: yanlis
ozet: "OWASP Password Storage rehberi, SHA-256 gibi hızlı algoritmaların parola saklama için uygun olmadığını söyler; çünkü saldırganın çok hızlı tahmin yapmasına izin verirler. Önerilen yöntem Argon2id gibi yavaş, parola için tasarlanmış algoritmalardır."
analoji: "Az sayıda kombinasyonu olan bir kilidi dakikada binlerce kez denemek gibi: kilit sağlam görünür ama deneme hızı yüksek olduğu için kırılır. Parola için kilit bilerek yavaş olmalıdır."
kaynaklar:
  - { ad: "OWASP Password Storage Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" }
ilgiliDers: appsec-006
tarih: "2026-11-25"
---

SHA-256 sağlam bir hash fonksiyonudur; dosya bütünlüğü ya da dijital imza gibi işlerde yerindedir. Parola saklamada ise sorun **hızıdır**. Veri tabanı sızarsa saldırgan, yaygın parolaları saniyede çok sayıda deneyip hash'lerle karşılaştırabilir.

OWASP rehberi, SHA-256 gibi hızlı algoritmaların parola saklamaya uygun olmadığını belirtir; MD5 ve SHA-1 de hız için tasarlandığından aynı sebeple elenir.

Rehberin önerdiği sıra:

- **Argon2id** birinci tercihtir.
- **scrypt** Argon2id yoksa alternatiftir.
- **bcrypt** eski sistemler içindir.
- **PBKDF2** FIPS uyumu gerektiğinde kullanılır.

Bu algoritmalar kasıtlı olarak yavaştır ve her parola için benzersiz tuz (salt) kullanır; böylece aynı parola iki kullanıcıda farklı hash üretir ve hazır tablolar işe yaramaz.

Kod incelemesinde `hashlib.sha256(parola)` ya da `md5(parola)` görürsen bunu bulgu olarak yaz ve yavaş bir parola algoritmasına geçmeyi öner (ders 6).
