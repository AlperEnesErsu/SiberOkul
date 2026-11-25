---
iddia: "ORM kullanırsam SQL injection olmaz."
hukum: kismen
ozet: "ORM'ler genellikle parametreli sorgu kullandığı için riski azaltır. Ancak OWASP, ORM'lerin kendi sorgu dillerinde (ör. HQL, JPQL) kullanıcı girdisi string olarak birleştirilirse uygulamanın yine enjeksiyona açık olabileceğini belirtir."
analoji: "Emniyet kemeri takmak gibi: kazada koruyucu, ama kemeri hiç bağlamadan oturursan işe yaramaz. ORM güvenli yolu varsayılan yapar; ham sorguda kemeri sen çıkarırsın."
kaynaklar:
  - { ad: "OWASP SQL Injection Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" }
ilgiliDers: appsec-003
tarih: "2026-11-25"
---

ORM (nesne-ilişkisel eşleyici), sorguları senin yerine üretir ve çoğu zaman değerleri parametre olarak bağlar. Bu yüzden normal kullanımda SQL injection riskini ciddi biçimde azaltır. "Olmaz" demek ise fazla iddialıdır.

Risk şu durumlarda geri gelir:

- **Ham sorgu fonksiyonları:** ORM'in `raw`, `execute` gibi fonksiyonuna kullanıcı girdisini string birleştirerek vermek.
- **ORM'in kendi sorgu dili:** Hibernate'te HQL dizesine girdiyi eklemek. OWASP bunu açıkça güvensiz örnek olarak gösterir.
- **Dinamik kısımlar:** Sıralama sütunu, tablo adı gibi parametre olamayan parçaları doğrudan kullanıcıdan almak. Bunlar için izin listesi gerekir.

Güvenli kalıp hep aynı: değerleri parametre olarak bağla (`?` ya da adlı parametre), yapısal parçaları izin listesiyle seç, elle kaçırmaya güvenme.

Kod incelemesinde ORM kullanan projede bile "raw", "execute", "createQuery" gibi çağrıları ara ve içinde string birleştirme olup olmadığına bak (ders 12).
