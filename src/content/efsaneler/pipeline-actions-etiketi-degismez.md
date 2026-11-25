---
iddia: "GitHub Actions'ta `@v4` gibi bir etiketle çağırdığım aksiyon her zaman aynı kodu çalıştırır."
hukum: yanlis
ozet: "GitHub'ın Actions güvenli kullanım belgesi, bir etiketin aksiyonun deposuna erişen kötü niyetli biri tarafından taşınabileceğini ya da silinebileceğini söyler. Tam uzunlukta commit SHA'sı ile sabitlemeyi önerir."
analoji: "Kapıdaki 'Ahmet Bey'in odası' tabelası: tabelayı kimse değiştirmediği sürece doğrudur, ama tabelayı değiştirebilen biri seni başka bir odaya yönlendirebilir. SHA ise oda numarasının kendisidir."
kaynaklar:
  - { ad: "GitHub Docs: Secure use reference (Using third-party actions)", url: "https://docs.github.com/en/actions/reference/security/secure-use" }
ilgiliDers: pipeline-009
tarih: "2026-11-25"
---

`uses: actions/checkout@v4` yazdığında Git'in bir **etiketine** (tag) başvuruyorsun. Etiket, bir commit'e işaret eden hareketli bir etikettir; aksiyonun sahibi onu başka bir commit'e kaydırabilir. Bu normalde sürüm güncellemesi için kullanışlıdır, ama hesabı ele geçirilen bir sahip ya da yanlış yönetilen bir depo aynı yolla zararlı bir kodu sana ulaştırabilir.

**Belge ne diyor?** GitHub, tam commit SHA'sına sabitlemeyi bir aksiyonu değişmez bir sürüm gibi kullanmanın yolu olarak önerir; etikete ancak yaratıcıya güveniyorsan başvurmanı söyler. Belge ayrıca bağımlılık kilit dosyası (lockfile) kullanabilen depolar için daha güçlü bir koruma tarif eder. SHA'nın aksiyonun asıl deposundan alındığını (bir fork'tan değil) doğrulamak da gerekir.

**Ne yapmalı?** Aksiyonları 40 karakterlik SHA ile sabitle, yanına sürümü yorum olarak yaz, güncellemeleri Dependabot (`github-actions` ekosistemi) ile PR olarak al. Böylece her değişikliği sen onaylarsın.
