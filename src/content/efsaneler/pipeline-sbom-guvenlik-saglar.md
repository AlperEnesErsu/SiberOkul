---
iddia: "Ürünüm için bir SBOM ürettiysem yazılımım güvenlidir."
hukum: yanlis
ozet: "CISA, SBOM'u yazılımı oluşturan bileşenlerin iç içe bir envanteri, yani 'içindekiler listesi' olarak tanımlar. Envanter bir şeyin güvenli olduğunu söylemez; bir bileşende bilinen açık olup olmadığını ayrıca veritabanıyla eşleştirmek gerekir."
analoji: "Yiyecek paketindeki içindekiler listesi: ne olduğunu gösterir ama ürünün taze ya da zararsız olduğunu garanti etmez. Alerjin varsa listeyi okuyup kararı sen verirsin."
kaynaklar:
  - { ad: "CISA: Software Bill of Materials (SBOM)", url: "https://www.cisa.gov/sbom" }
ilgiliDers: pipeline-005
tarih: "2026-11-25"
---

CISA'nın SBOM sayfası SBOM'u bir şeffaflık ve tedarik zinciri risk yönetimi aracı olarak anlatır. Aynı sayfada, bir ürünün belirli bir zafiyetten etkilenip etkilenmediğini bildiren VEX (Vulnerability Exploitability eXchange) kavramı SBOM'dan ayrı bir belge olarak geçer. Yani envanter ile zafiyet bilgisi ayrı şeylerdir.

SBOM'un işe yaradığı yerler:

- Yeni bir açık duyurulduğunda "bizde var mı?" sorusunu aramaya çevirir.
- Lisans ve müşteri denetimlerinde bileşenleri gösterir.

SBOM'un yapmadıkları: bileşenleri yamalamaz, açıkları kendiliğinden bulmaz, listenin eksiksiz olduğunu garanti etmez. Onu bir zafiyet tarayıcısı ve düzenli güncellemeyle birlikte kullan.
