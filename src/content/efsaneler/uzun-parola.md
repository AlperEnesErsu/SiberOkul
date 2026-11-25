---
iddia: "Uzun parola, karmaşık paroladan daha güvenlidir."
hukum: dogru
ozet: "NIST'in güncel kimlik doğrulama rehberi (SP 800-63B-4) tek başına kullanılan parolalar için en az 15 karakter ister ve 'farklı karakter türlerini karıştır' gibi kuralların dayatılmasını yasaklar. Uzunluk, karmaşıklıktan daha çok iş görür."
analoji: "Kilitte pim sayısını artırmak gibi: `P@ss1!` süslü ama az pimli bir kilittir; dört rastgele kelimeden oluşan uzun bir cümle ise sade ama çok daha fazla pimli bir kilit."
kaynaklar:
  - { ad: "NIST SP 800-63B-4: Authentication and Authenticator Management", url: "https://pages.nist.gov/800-63-4/sp800-63b.html" }
tarih: "2026-11-25"
---

Neden uzunluk kazanıyor: Bir parolayı tahminle kırmak için denenecek olasılık sayısı, her karakterle katlanarak artar. Karışım kuralları ise insanları tahmin edilebilir kalıplara iter: `Parola1!`, `Yaz2026!` gibi. Saldırganlar bu kalıpları ilk sırada dener.

Ama uzun olması tek başına yetmez:

- **Bilinen bir cümle** (şarkı sözü, ünlü bir söz) uzun olsa da saldırganların listelerinde vardır.
- **Aynı parolayı her yerde kullanmak**, bir site sızdırıldığında diğerlerini de açar.
- NIST bu yüzden yeni parolaların bilinen ve sızdırılmış parola listelerine karşı kontrol edilmesini de ister.

En pratik çözüm: her site için ayrı, uzun ve rastgele parolalar üreten bir parola yöneticisi ve mümkün olan her yerde iki adımlı doğrulama.
