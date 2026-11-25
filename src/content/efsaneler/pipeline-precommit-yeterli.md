---
iddia: "Pre-commit kancası kurulduysa depoya sır girmesi imkânsızdır."
hukum: yanlis
ozet: "pre-commit çerçevesinin belgeleri kancaların `SKIP` ortam değişkeniyle ya da `git commit --no-verify` ile atlanabildiğini açıkça gösterir. Kancayı hiç kurmamış bir geliştirici de korumasızdır; bu yüzden CI'da aynı taramayı zorunlu çalıştırmak gerekir."
analoji: "Evin kapısındaki kilit iyi bir ilk önlemdir; ama anahtarı kapı önündeki paspasın altına koymuşsan ya da kilidi hiç takmamışsan işe yaramaz."
kaynaklar:
  - { ad: "pre-commit: framework for managing git hooks", url: "https://pre-commit.com/" }
ilgiliDers: pipeline-002
tarih: "2026-11-25"
---

Git kancaları (hooks) geliştiricinin kendi makinesinde çalışır. Bu, onların hem avantajı hem sınırıdır: sır commit'e girmeden hızlı geri bildirim verirler, ama kontrol tamamen geliştiricinin elindedir.

**Atlama yolları nelerdir?** pre-commit belgeleri, tek bir kancayı `SKIP=kanca-adi git commit` ile, bütün kancaları `git commit --no-verify` ile atlamanın mümkün olduğunu gösterir. Ayrıca kanca `pre-commit install` çalıştırılmadıkça etkin değildir; yeni klonlanan her depoda bu adım unutulabilir.

**Neden hâlâ değerli?** Çoğu sızıntı kasıtlı değildir; kanca unutkanlığı ve dikkatsizliği yakalar, geri bildirimi de en erken noktada verir. Ama kuruluşun asıl güvencesi olacak kontrol, tek bir kişinin kararıyla atlanamamalı.

**Ne yapmalı?** İki katman kur: yerelde pre-commit kancası (hızlı, erken), CI'da aynı taramayı zorunlu durum kontrolü olarak (atlanamaz). Bir sır yine de sızarsa tarama yerine önce anahtarı iptal edip döndür. GitShield'in hem pre-commit kancası hem GitHub Action olarak çalışması bu yüzden önemlidir.
