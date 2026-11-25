---
iddia: "`docker compose down` komutu veritabanı verimi de siler."
hukum: kismen
ozet: "Docker belgelerine göre `down` varsayılan olarak container'ları ve ağları kaldırır, isimli volume'ları kaldırmaz. Volume'lar yalnız `-v` bayrağıyla silinir."
analoji: "Evi boşaltırken mobilyaları atarsın ama depodaki kutular yerinde kalır; depoyu da boşaltmak için ayrıca 'hepsini' demen gerekir."
kaynaklar:
  - { ad: "Docker Docs: docker compose down", url: "https://docs.docker.com/reference/cli/docker/compose/down/" }
ilgiliDers: devops-011
tarih: "2026-11-25"
---

Docker'ın `docker compose down` sayfasına göre komut varsayılan olarak Compose dosyasında tanımlı servislerin container'larını ve ağları kaldırır. İsimli volume'lar ve anonim volume'lar varsayılan olarak kaldırılmaz. Dış (`external`) olarak tanımlanmış ağ ve volume'lar ise hiçbir zaman silinmez.

Bu yüzden iddia kısmen doğrudur. Veritabanı verin isimli bir volume'da duruyorsa düz `down` onu silmez. Ama `docker compose down -v` yazarsan isimli volume'lar da silinir ve veri gider. Veriyi volume yerine container'ın kendi dosya sistemine yazdıysan, container silinince o veri de gider.

Pratik öneriler:

- Veriyi her zaman isimli bir volume'a koy.
- `-v` bayrağını yalnız gerçekten sıfırdan başlamak istediğinde kullan.
- Önemli veriyi ayrıca yedekle; volume kalıcıdır ama yedek değildir.
