---
iddia: "NAT zaten güvenlik duvarı görevi görür, ayrıca kural yazmama gerek yok."
hukum: yanlis
ozet: "Adres çevirisi tek başına güvenlik sağlamaz. NAT'ın dışarıdan gelen bağlantıları engellemesi, bağlantı durumunu tutmasının yan etkisidir; bu yüzden gerçek bir güvenlik duvarının yerini tutmaz."
analoji: "Apartmanın tek ortak kapı zili gibi: dışarıdan gelen kimse hangi daireyi çaldığını bilemez, ama bu kapıyı kilitlemiş olmanız anlamına gelmez."
kaynaklar:
  - { ad: "RFC 4864: Local Network Protection for IPv6", url: "https://www.rfc-editor.org/rfc/rfc4864" }
ilgiliDers: ag-011
tarih: "2026-11-25"
---

İnternet standartlarını yayımlayan IETF'in RFC 4864 belgesi, NAT'a atfedilen "güvenlik"in kaynağını inceliyor. Belgenin 2.2. bölümüne göre bu algılanan güvenlik, adres çevirisinden değil, **bağlantı durumunu izleyen filtrelemeden** geliyor. Aynı belge, adres bitlerini çevirmenin kendi başına güvenlik sağlamadığını da söylüyor.

Pratikte NAT arkasındaki cihazlara dışarıdan başlatılan bağlantılar kabul edilmez, çünkü tabloda karşılığı yoktur. Bu gerçek bir koruma gibi görünür, ama:

- **Kural değildir**: Neye izin verildiğini yazıp denetleyemezsin.
- **İçeriden gelen tehdide işlemez**: Bir cihaz zararlı bir sunucuya kendisi bağlanırsa NAT bunu engellemez.
- **Yerini tutmaz**: Aynı korumayı durum izlemeli bir güvenlik duvarı kurallı ve loglanabilir biçimde verir.

Kısacası NAT'ın sağladığı engelleme bir yan etkidir. Evde ya da şirkette NAT kullanıyor olman, güvenlik duvarı kurallarını yazmaktan seni kurtarmaz. Ağ bölgesindeki NAT, proxy ve VPN dersinde farkı görüyoruz.
