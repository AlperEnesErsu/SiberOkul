---
iddia: "Güvenlik duvarında ICMP'yi tamamen kapatmak her zaman daha güvenlidir."
hukum: yanlis
ozet: "ICMP yalnız ping değildir. Özellikle IPv6'da bazı ICMP mesajları iletişimin çalışması için gereklidir; hepsini kör biçimde engellemek bağlantıları bozar."
analoji: "Yoldaki tüm uyarı tabelalarını sökmek gibi: tabelaların bir kısmı gereksizdir, ama 'yol daraldı' tabelası olmadan araçlar kaza yapar."
kaynaklar:
  - { ad: "RFC 4890: Recommendations for Filtering ICMPv6 Messages in Firewalls", url: "https://www.rfc-editor.org/rfc/rfc4890" }
ilgiliDers: ag-007
tarih: "2026-11-25"
---

`ping` ICMP kullandığı için çoğumuz ICMP'yi "ping" sanır ve güvenlik duvarında kapatırız. IETF'in RFC 4890 belgesi ise IPv6 için bunun risk taşıdığını anlatıyor: giriş bölümü, güvenlik duvarlarının ICMPv6'yı fazla agresif filtrelemesinin iletişimi olumsuz etkileyebileceği uyarısını yapıyor.

Belgede özellikle **Packet Too Big** mesajı, düşürülmemesi gereken trafik arasında sayılıyor. Çünkü bu mesaj, yol boyunca uygun paket boyutunun bulunmasını sağlayan mekanizma için hayati. Engellersen bazı bağlantılar kurulup sonra takılabilir.

Doğru yaklaşım hepsini açmak ya da kapatmak değil, **türe göre karar vermektir**:

- Gerekli hata ve yol mesajlarına izin ver.
- Gereksiz ya da riskli türleri engelle ya da sınırla.
- Dışarıdan gelen ping'e izin verip vermemeyi ayrıca, bilinçli seç.

Teşhis dersinde gördüğün gibi, ping'e yanıt gelmemesi makinenin kapalı olduğunu da göstermez.
