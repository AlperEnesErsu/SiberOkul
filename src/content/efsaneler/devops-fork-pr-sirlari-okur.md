---
iddia: "Dışarıdan biri depoyu fork edip PR açınca, workflow'um depo sırlarımı okuyabilir."
hukum: yanlis
ozet: "GitHub belgelerine göre fork edilmiş bir depodan tetiklenen workflow'larda GITHUB_TOKEN dışındaki sırlar runner'a iletilmez. Ancak bu koruma, ayarları gevşetirsen ya da riskli tetikleyiciler kullanırsan zayıflayabilir."
analoji: "Misafir ofise girer ama kasa anahtarı ona verilmez; anahtarı kendi elinle uzatırsan koruma biter."
kaynaklar:
  - { ad: "GitHub Docs: Using secrets in GitHub Actions", url: "https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions" }
ilgiliDers: devops-012
tarih: "2026-11-25"
---

GitHub'ın sırlar belgesi şöyle der: `GITHUB_TOKEN` dışında, fork edilmiş bir depodan tetiklenen workflow'a sırlar iletilmez. Yani sıradan bir `pull_request` tetikleyicisiyle, yabancının açtığı PR'ın workflow'u depo sırlarını göremez.

Bu iddiayı bu yüzden "yanlış" sayıyoruz, ama dikkat gereken sınır vardır: korumayı sen sulandırabilirsin. Örneğin fork PR'larının sırlara ulaşmasına izin veren ayarlar ya da yabancı kodu yetkili bağlamda çalıştıran tetikleyici seçimleri bu garantiyi bozabilir. Bu ayrıntılar belgede ayrıca tartışılır; kararlarını oradaki güncel anlatıma göre ver.

Pratik öneriler:

- Fork PR'ları için sır gerektirmeyen test hattı kullan.
- Sırları yalnız gereken iş ve ortamla sınırla.
- Workflow dosyasındaki değişiklikleri de kod gibi incele.
- Günlüğe sır yazdırma; platform maskelemeye çalışır ama garanti vermez.
