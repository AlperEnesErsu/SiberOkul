---
iddia: "İmzalı ve SLSA seviyeli bir yazılım artefaktı zafiyetsizdir."
hukum: yanlis
ozet: "SLSA belgeleri, çerçevenin yazılımı geliştiren kişilerin güvenli kodlama yapıp yapmadığını söylemediğini belirtir. SLSA artefaktın değiştirilmediğini ve beklenen platformda üretildiğini göstermeyi hedefler, kodun kalitesini değil."
analoji: "Mühürlü bir koli, yolda açılmadığını gösterir; içindeki ürünün bozuk olmadığını göstermez."
kaynaklar:
  - { ad: "SLSA v1.0: About SLSA", url: "https://slsa.dev/spec/v1.0/about" }
  - { ad: "SLSA v1.0: Security levels", url: "https://slsa.dev/spec/v1.0/levels" }
ilgiliDers: pipeline-008
tarih: "2026-11-25"
---

İmza ve provenance (kaynak kanıtı) tedarik zinciri güvenliği içindir. İmza, artefaktın belirli bir kimlik tarafından onaylandığını ve değişmediğini gösterir. Provenance, nerede ve nasıl build edildiğini kayda geçirir. SLSA'nın build seviyeleri ise bu kanıtların ne kadar güçlü olduğunu derecelendirir: L1'de provenance var, L2'de imzalı ve ayrı platformda, L3'te build'ler güçlü yalıtılmış.

**Neyi garanti etmez?** SLSA'nın kendi tanıtım sayfası, kodu yazanların güvenli kodlama uygulayıp uygulamadığını söylemediğini açıkça belirtir. Yani en yüksek seviyede imzalanmış bir imaj, içinde açıklı bir kütüphane ya da hatalı bir yetkilendirme mantığı taşıyabilir.

**Neden yine de önemli?** Saldırganın build sunucusunu ya da dağıtım kanalını ele geçirip sana zararlı bir sürüm vermesini zorlaştırır.

**Ne yapmalı?** İmzalamayı tarama araçlarının yerine değil, yanına koy. SAST, SCA, imaj taraması "içi temiz mi?" sorusunu, imza ve provenance "doğru yerden mi geldi?" sorusunu cevaplar.
