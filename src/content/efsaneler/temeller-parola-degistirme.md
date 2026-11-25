---
iddia: "Parolayı düzenli aralıklarla değiştirmek güvenliği artırır."
hukum: yanlis
ozet: "NIST'in güncel kimlik doğrulama rehberi (SP 800-63B-4), doğrulayıcı kurumların kullanıcıları parolalarını periyodik olarak değiştirmeye zorlamamasını şart koşar. Değişim yalnız parolanın ele geçirildiğine dair kanıt varsa istenmelidir."
analoji: "Her ay evin kilidini değiştirmek yerine, kilit çalındığında değiştirmek gibi: sürekli yenilenen kilidi insanlar akılda tutamaz, 'Parola1', 'Parola2' diye gider ve bu zaten tahmin edilir."
kaynaklar:
  - { ad: "NIST SP 800-63B-4: Authentication and Authenticator Management", url: "https://pages.nist.gov/800-63-4/sp800-63b.html" }
ilgiliDers: temeller-004
tarih: "2026-11-25"
---

Eskiden kurumlar her 60-90 günde bir parola değiştirtirdi. Mantık şuydu: çalınan parola bir süre sonra geçersiz olur. Pratikte ise tersi oldu. İnsanlar yeni parolayı hatırlamak için eskisine küçük bir ek yapar (`Yaz2025!` yerine `Yaz2026!`) ya da parolayı bir yere yazar. Saldırganlar bu kalıpları bilir ve eski parolalardan yenisini kolayca türetir.

NIST'in rehberi bu yüzden açık konuşur: doğrulayıcı taraflar kullanıcılardan parolalarını periyodik olarak değiştirmesini istememeli. Değiştirme zorunluluğu ancak parolanın ele geçirildiğine dair bir işaret olduğunda doğrudur.

Peki ne işe yarar?

- **Uzun ve benzersiz parola**: her hesap için ayrı, rastgele ve uzun. Parola yöneticisi bunu kolaylaştırır.
- **Sızıntı kontrolü**: parolan bilinen bir sızıntıda göründüyse hemen değiştir.
- **Çok faktörlü doğrulama**: parola çalınsa bile ikinci faktör girişi engeller.

Kısacası "değiştirmek" tek başına bir koruma değildir; **ne zaman** değiştirdiğin önemlidir. Bir sızıntı bildirimi geldiğinde, bir cihazın kaybolduğunda ya da başka bir yerde aynı parolayı kullandığını fark ettiğinde değiştir; takvim geldi diye değil.
