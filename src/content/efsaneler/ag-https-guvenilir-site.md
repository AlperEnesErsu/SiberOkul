---
iddia: "Adres çubuğunda kilit varsa site güvenilirdir."
hukum: yanlis
ozet: "Kilit, bağlantının şifreli olduğunu ve alan adının doğrulandığını gösterir. Sitenin iyi niyetli, dolandırıcılık yapmayan ya da güvenli olduğunu göstermez; oltalama siteleri de geçerli sertifika alabilir."
analoji: "Kapıdaki kimlik kontrolü gibi: kimliğin gerçek olduğunu gösterir, kişinin dürüst olduğunu göstermez."
kaynaklar:
  - { ad: "Let's Encrypt: Certificate Authorities and Phishing/Malware (2015)", url: "https://letsencrypt.org/2015/10/29/phishing-and-malware.html" }
ilgiliDers: ag-006
tarih: "2026-11-25"
---

Alan adı doğrulamalı (DV) sertifika veren bir otorite olan Let's Encrypt, kendi yazısında bunu açıkça söylüyor: DV sertifikalar bir sitenin itibarı, gerçek dünyadaki kimliği ya da güvenliği hakkında bilgi içermez. Sertifikayı bir "onay damgası" gibi görmek yanlış bir okumadır.

Sertifika otoritesi yalnız şunu sorar: *Bu alan adını kontrol eden kişi bu mu?* Bir dolandırıcı `ornekbank-giris.com` gibi bir ad alırsa ve ona sahipse, o ad için geçerli bir sertifika alabilir. Sonuç: sahte sayfa da kilitli görünür.

Kilit gerçekten neyi söyler:

- Bağlantı şifreli: Yoldaki biri içeriği okuyamaz.
- Alan adı doğrulandı: Gördüğün adres ile sertifika uyuşuyor.

Yani kilit "bu adres gerçekten bu adres" der, "bu adres iyi biri" demez. Adresi dikkatle oku; oltalama bağlantılarına tıklamadan önce yazımı kontrol et. Sertifikaların nasıl çalıştığını TLS dersinde adım adım görüyoruz.
