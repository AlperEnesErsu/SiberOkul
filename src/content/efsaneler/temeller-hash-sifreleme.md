---
iddia: "Parolalar veritabanında şifreli saklanır; gerekirse çözüp bakarız."
hukum: yanlis
ozet: "OWASP'a göre parolalar şifrelenmez, modern ve uyarlanabilir bir algoritmayla hash'lenir. Hash tek yönlüdür; şifreleme ise anahtarla geri çevrilir ve anahtar sızarsa bütün parolalar açılır."
analoji: "Hash, kâğıdı kıyma makinesinden geçirmek gibidir: parçalardan kâğıt geri çıkmaz ama aynı kâğıt hep aynı yığını verir. Şifreleme ise kilitli kutudur: anahtarı bulan herkes açar."
kaynaklar:
  - { ad: "OWASP Password Storage Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" }
ilgiliDers: temeller-004
tarih: "2026-11-25"
---

"Parolalar şifreli tutuluyor" cümlesi gündelik dilde sık kurulur, ama doğru tasarımı anlatmaz. OWASP'ın parola saklama rehberi açıkça şunu söyler: parolalar düz metin ya da şifreli değil, modern ve uyarlanabilir (adaptive) algoritmalarla hash'lenmiş olarak saklanmalıdır.

Fark şudur:

- **Şifreleme çift yönlüdür.** Anahtarla çözülür. Anahtar sızarsa ya da veritabanıyla aynı yerde durursa tüm parolalar tek hamlede okunur.
- **Hash tek yönlüdür.** Sistem parolanın kendisini bilmez; girişte yazılanı hash'leyip kayıtlı değerle karşılaştırır. Saldırgan hash'i ele geçirse bile onunla doğrudan giriş yapamaz, tahmin yürütmek zorundadır.

Bu yüzden "gerekirse çözüp bakarız" diye bir ihtiyaç zaten olmamalıdır. "Parolamı unuttum" akışı eski parolayı göstermez, yenisini belirletir. Eski parolayı e-postayla yollayan bir site, parolaları geri çevrilebilir tutuyor demektir ve kırmızı bayraktır.

Hash'lemek de tek başına yetmez. Rehber, ilk tercih olarak Argon2id'yi önerir ve tuz kullanımını bekler; hızlı genel amaçlı hash'ler (ör. düz SHA-256) parola için uygun değildir. Ders 4'te tuz ve yavaş algoritmaların neden gerekli olduğunu görmüştün.
