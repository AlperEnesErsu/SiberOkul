---
iddia: "SAST aracı temiz rapor verdiyse kod güvenlidir."
hukum: yanlis
ozet: "OWASP'ın kaynak kod analiz araçları sayfası bu araçların sınırlı olduğunu söyler: güvenlik kusurlarının yalnız küçük bir bölümünü güvenilir biçimde bulabilirler, kimlik doğrulama, erişim kontrolü ve kriptografi gibi alanları otomatik yakalamak zordur. Temiz rapor 'kural kümesindeki kalıplar bulunamadı' demektir."
analoji: "Yazım denetimi kırmızı çizgi çekmediyse cümlede yazım hatası yoktur, ama cümlenin doğru ya da mantıklı olduğunu söylemez."
kaynaklar:
  - { ad: "OWASP Community: Source Code Analysis Tools", url: "https://community.owasp.org/Source_Code_Analysis_Tools" }
ilgiliDers: pipeline-003
tarih: "2026-11-25"
---

SAST araçları kodu çalıştırmadan, tanıdıkları kalıpları arayarak çalışır. Bu, `eval` kullanımı ya da SQL'i metin birleştirerek kurmak gibi bilinen tehlikeli yapılar için çok değerlidir. Ama sınırı da buradan gelir.

**Araç neyi göremez?** Bir kullanıcının başkasının verisini görebilmesi (yetkilendirme mantığı), yanlış yapılandırılmış bir sunucu ya da iş kuralındaki bir boşluk koda bakarak anlaşılabilecek kalıplar değildir. OWASP'ın sayfası da bu tür sorunların otomatik yakalanmasının zor olduğunu, ayrıca yanlış pozitiflerin yaygın olduğunu belirtir.

**Temiz rapor ne anlama gelir?** Yalnızca aracın kurallarındaki bilinen kalıplar bu kodda eşleşmedi. Kural yazılmamış bir sorun, aracın analiz edemediği bir kod yolu ya da çalışma zamanındaki bir yapılandırma hatası raporda görünmez.

**Ne yapmalı?** SAST'ı tek kapı değil, katmanlardan biri olarak kullan: SCA ile bağımlılıkları, sır taramasıyla anahtarları, DAST ile çalışan uygulamayı, insan incelemesiyle de mantığı kontrol et. Temiz rapor güven artırır, güvenlik kanıtı olmaz.
