---
iddia: "Bir süreci durdurmanın en doğru yolu doğrudan kill -9 kullanmaktır."
hukum: kismen
ozet: "SIGKILL süreç tarafından yakalanamaz ve süreci kesin sonlandırır; ama aynı nedenle süreç temizlik yapamaz. Önce SIGTERM denemek iyi alışkanlıktır."
analoji: "Dükkânı kapatırken önce müşterilere 'kapanıyoruz' demek ile elektriği doğrudan kesmek arasındaki fark gibi."
kaynaklar:
  - { ad: "Linux man-pages: signal(7)", url: "https://man7.org/linux/man-pages/man7/signal.7.html" }
ilgiliDers: linux-010
tarih: "2026-11-25"
---

Linux man-pages belgesi, SIGKILL ve SIGSTOP sinyallerinin yakalanamayacağını, engellenemeyeceğini ve yok sayılamayacağını söyler. SIGTERM ise kapanma isteğidir ve süreç onu yakalayıp kendi kapanış işlemini yapabilir. İddianın "işe yarar" tarafı doğrudur: `kill -9` süreci kesin sonlandırır.

Ama bu kesinliğin bir bedeli vardır. Süreç sinyali yakalayamadığı için geçici dosyalarını silemez, açık kayıtları düzgün kapatamaz. Bu belgenin doğrudan söylediği bir şey değil, sinyalin yakalanamamasının doğal sonucudur. Bir veritabanı gibi yarım iş bırakması sorun olan programlarda risklidir.

Pratik kural: önce `kill PID` (SIGTERM), süreç bir süre sonra hâlâ duruyorsa `kill -9 PID`. Yani `kill -9` bir son çaredir, ilk adım değil. Bu yüzden hüküm kısmen doğru.
