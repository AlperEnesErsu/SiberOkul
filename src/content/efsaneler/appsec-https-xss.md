---
iddia: "Sitem HTTPS kullanıyorsa XSS saldırısı olamaz."
hukum: yanlis
ozet: "HTTPS, tarayıcı ile sunucu arasındaki trafiği korur. OWASP'ın XSS önleme rehberinde savunmalar çıktı kodlama, güvenli API'ler, HTML temizleme ve ek katman olarak CSP gibi önlemlerdir; HTTPS bir XSS savunması olarak sayılmaz."
analoji: "Zırhlı bir aracın içinde zehirli yemek taşımak gibi: araç yolda yemeği korur, ama yemeğin zehirli olmasını engellemez."
kaynaklar:
  - { ad: "OWASP Cross Site Scripting Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" }
ilgiliDers: appsec-004
tarih: "2026-11-25"
---

XSS, uygulamanın kullanıcı girdisini kodlamadan kendi ürettiği HTML'e koymasıyla oluşur. Zararlı betik, sayfanın bir parçası olarak sunucudan gelir. Bu sayfanın HTTPS ile iletilmesi, içeriğini değiştirmez; tarayıcı betiği olduğu gibi, güvenli kanaldan alır ve çalıştırır.

HTTPS'in yaptığı: trafiği dinlemeye ve yolda değiştirmeye karşı korumak, sunucunun kimliğini doğrulamak. Bunlar önemlidir ama başka bir sorunu çözer.

XSS için gerçek savunmalar:

1. Bağlama uygun **çıktı kodlama** ve otomatik kodlayan şablon motorları.
2. **Güvenli API'ler**: `innerHTML` yerine `textContent`.
3. HTML gerekiyorsa bakımı yapılan bir **temizleyici** kütüphane.
4. Ek katman olarak **CSP** ve `HttpOnly` çerezler.

HTTPS yine de gereklidir; yalnız XSS'e karşı değil, genel güvenlik için. Ama "HTTPS var, XSS yok" diye düşünmek, açığı fark edilmeden bırakır (ders 4).
