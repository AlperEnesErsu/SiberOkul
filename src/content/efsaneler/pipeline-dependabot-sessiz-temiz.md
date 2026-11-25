---
iddia: "Dependabot hiç uyarı vermiyorsa bağımlılıklarımda güvenlik açığı yoktur."
hukum: yanlis
ozet: "GitHub'ın belgesine göre Dependabot yalnız GitHub Advisory Database'deki bilinen zafiyetler için uyarı verir ve uyarıların her güvenlik sorununu yakalayamayacağı belirtilir. Sessizlik 'temiz' demek değil, 'bilinen bir kayıt yok' demektir."
analoji: "Kapıdaki fotoğraflı aranan listesi gibi: listede olmayan biri geçebilir. Liste sessizse kimse aranmıyor demek değil, tanıdıkların içinde kimse yok demektir."
kaynaklar:
  - { ad: "GitHub Docs: About Dependabot alerts", url: "https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts" }
ilgiliDers: pipeline-004
tarih: "2026-11-25"
---

Dependabot depodaki bağımlılıkları (manifest ve kilit dosyalarını) GitHub Advisory Database'deki kayıtlarla eşleştirir. Bu yüzden üç sınır vardır:

- **Yalnız bilinen açıklar:** Henüz keşfedilmemiş ya da veritabanına girmemiş bir açık için uyarı gelmez.
- **Zamanlama:** Yeni bir kayıt eklendiğinde uyarı sonradan gelebilir; dünkü sessizlik bugünkü durumu garanti etmez.
- **Kapsam:** Doğru algılama için manifest ve kilit dosyalarının güncel olması gerekir; depoya girmeyen bir bileşen taranmaz.

Bu yüzden uyarıları açık tut ama tek savunma sayma: SAST, imaj taraması ve kod incelemesiyle birlikte kullan, güncellemeleri düzenli yap.
