---
iddia: "HTTPS kullanınca ağ yöneticisi hangi siteye girdiğimi göremez."
hukum: kismen
ozet: "HTTPS, siteye gönderdiğin ve siteden aldığın içeriği şifreler; yöneticiler hangi sayfayı ya da formu kullandığını göremez. Ama sitenin alan adı hâlâ görünür; bunu DNS'i de şifreleyerek zorlaştırabilirsin."
analoji: "Zarfın içi kapalıdır, ama zarfın üstündeki alıcı adı posta görevlisine görünür."
kaynaklar:
  - { ad: "EFF Surveillance Self-Defense: Understanding and Circumventing Network Censorship", url: "https://ssd.eff.org/module/understanding-and-circumventing-network-censorship" }
ilgiliDers: ag-006
tarih: "2026-11-25"
---

EFF'nin ağ sansürü rehberi şunu anlatıyor: HTTPS ile içerik şifrelenir, ama sitenin adı açık kalır. Ağ yöneticisi alan adını (örneğin eff.org) görebilir, adresin eğik çizgiden sonraki kısmını ve hangi sayfada olduğunu göremez.

Yani iddia **kısmen** doğru:

- **Gizlenen**: Gittiğin sayfa, yazdığın form, parola, çerez, indirdiğin içerik.
- **Görünen**: Bağlandığın alan adı, zamanı ve ne kadar veri aktardığın.

Rehber ayrıca alan adının DNS sorgularında da sızabildiğini, varsayılan çözücünün çoğu zaman internet sağlayıcıya ait olduğunu söylüyor. Şifreli DNS bu sızıntıyı zorlaştırır.

Bunun pratik anlamı: Okul ya da iş ağında hangi sitelere girdiğin kayıt altına alınabilir. Bu, ag-004'teki DNS ve ag-006'daki TLS derslerinin birleşim noktasıdır.
