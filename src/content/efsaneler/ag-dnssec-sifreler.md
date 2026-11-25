---
iddia: "DNSSEC, DNS sorgularımı şifreler ve kimse ne sorduğumu göremez."
hukum: yanlis
ozet: "DNSSEC cevapların kimden geldiğini ve değişmediğini doğrulatır; sorguları ya da cevapları şifrelemez. Gizlilik için ayrı bir yöntem gerekir."
analoji: "Mühürlü zarf yerine imzalı kartpostal gibi: kimin yazdığı ve değişmediği doğrulanır, ama yoldaki herkes yazıyı okuyabilir."
kaynaklar:
  - { ad: "RFC 4033: DNS Security Introduction and Requirements", url: "https://www.rfc-editor.org/rfc/rfc4033" }
ilgiliDers: ag-004
tarih: "2026-11-25"
---

DNSSEC'in temel tanımını yapan RFC 4033 belgesi konuda açık: bu uzantılar gizlilik sağlamıyor. Belgeye göre DNSSEC'in sağladıkları **köken doğrulaması** (verinin gerçekten o alan adının yetkili sunucusundan geldiği) ve **veri bütünlüğüdür** (yolda değişmediği). Gizliliğin dışarıda bırakılması da bilinçli bir tasarım tercihidir.

Bu fark pratikte şöyle görünür:

- **DNSSEC açık olunca**: Önbellek zehirleme gibi sahte cevap saldırıları zorlaşır, çünkü imzası doğrulanamayan cevap reddedilir.
- **DNSSEC açık olsa bile**: Ağı yöneten biri hangi alan adlarını sorduğunu yine görebilir.

Sorgu gizliliği için DNS trafiğini şifreli bir kanaldan taşıyan ayrı yöntemler vardır; bunlar DNSSEC'ten bağımsız bir katmandır ve çoğu zaman birlikte düşünülür. Yani "imzalı" ile "gizli" aynı şey değildir. DNS dersindeki güvenlik notunu hatırla: sorgular varsayılan olarak şifresizdir ve DNSSEC bunu değiştirmez.
