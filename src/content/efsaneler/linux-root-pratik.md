---
iddia: "Sürekli root olarak çalışmak daha pratiktir ve sorun çıkarmaz."
hukum: yanlis
ozet: "Ubuntu geliştiricileri root hesabını varsayılan olarak bilerek kapalı tutar; yönetici işleri `sudo` ile tek tek yapılır ve kimin ne yaptığı kayıt altına alınır."
analoji: "Bankada ana kasa anahtarını sürekli cebinde taşımak gibi: işin hızlanır, ama bir yanlış hamle ya da çalınma bütün bankayı etkiler."
kaynaklar:
  - { ad: "Ubuntu Server dokümantasyonu: Kullanıcı yönetimi", url: "https://ubuntu.com/server/docs/how-to/security/user-management/" }
ilgiliDers: linux-007
tarih: "2026-11-25"
---

Ubuntu Server belgeleri, Ubuntu geliştiricilerinin yönetici (root) hesabını tüm kurulumlarda varsayılan olarak devre dışı bıraktığını söyler. Hesap vardır ama doğrudan oturum açmaya kapalıdır; yönetici işleri için kullanıcı, kendi parolasıyla `sudo` kullanır. Belge bunun iki faydasını belirtir: kullanıcı eylemleri hesap verebilir hale gelir ve yöneticiler her kullanıcının hangi işlemleri yapabileceğini denetleyebilir.

"Pratik" olan tarafı gerçek: sürekli root olarak çalışınca "izin yok" hatası almazsın. Ama bunun bedeli büyüktür. Root yetkisinde bir yazım hatası (`rm -r` ile yanlış yol) sistemi bozabilir. Root olarak çalışan bir süreç ele geçirilirse saldırgan da root olur. Ayrıca kimin ne yaptığını ayırt etmek zorlaşır.

Sağlıklı yaklaşım **en az yetki**: sıradan kullanıcıyla çalış, yalnız gereken komutu `sudo` ile yükselt. Hata mesajı bir şey söylemek için oradadır; çözüm çoğu zaman yetkiyi artırmak değil, doğru izni vermektir.
