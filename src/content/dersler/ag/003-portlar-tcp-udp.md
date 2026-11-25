---
kimlik: ag-003
baslik: "Portlar, TCP ve UDP"
donem: 2
sira: 3
sure: 30
neden: "Bir sunucuyu sertleştirirken ilk sorun 'hangi portlar açık, hangi program dinliyor?' olur. Beklenmedik bir açık port, ya unutulmuş bir servis ya da bir saldırganın bıraktığı arka kapı olabilir. `ss` bu soruyu saniyeler içinde cevaplar."
analoji:
  baslik: "IP adresi bina, port daire numarası"
  metin: "Binanın adresi (IP) postacıyı kapıya getirir; paketin hangi daireye gideceğini daire numarası (port) belirler. TCP, 'teslim aldım' imzası isteyen kayıtlı posta; UDP ise imzasız, hızlı bırakılan broşürdür. Sınır: gerçekte daireler yalnız dinleyen bir program varsa 'açıktır'; boş daire kapıyı çalana yanıt vermez."
gorev:
  aciklama: "Makinende hangi portların dinlendiğine bak. Gerekirse test için bir yerel sunucu başlat (kapatmak için Ctrl+C):"
  komutlar:
    - "ss -tulpn"
    - "ss -tn"
    - "python3 -m http.server 8000 --bind 127.0.0.1"
    - "ss -tlnp | grep 8000"
  soru: "`python3 -m http.server` çalışırken `ss -tlnp | grep 8000` ne gösteriyor? `127.0.0.1:8000` ile `0.0.0.0:8000` arasındaki fark ne olurdu?"
  telefon:
    soru: "Bir sunucuda `ss -tulpn` çıktısında `0.0.0.0:3306 LISTEN mysqld` görüyorsun. Bu neden güvenlik açısından dikkat çekicidir?"
    cevap: "3306 MySQL portudur. `0.0.0.0` bütün ağ arayüzlerinde dinlediğini, yani dışarıdan erişilebileceğini gösterir. Veritabanı yalnız aynı makinedeki uygulamaya hizmet ediyorsa `127.0.0.1`'e bağlanmalı ya da güvenlik duvarı ile kapatılmalıdır."
sorular:
  - id: ag-003-s1
    soru: "Port numarası ne işe yarar? Bir IP adresi tek başına neden yetmez?"
    cevap: "IP adresi hangi makineye gidileceğini söyler; port ise o makinede hangi programa (servise) gidileceğini. Bir makinede aynı anda web, SSH ve veritabanı çalışabilir."
  - id: ag-003-s2
    soru: "TCP ile UDP arasındaki temel fark nedir? Her biri için bir kullanım örneği ver."
    cevap: "TCP bağlantı kurar, sıra ve teslimi garanti eder (web, SSH). UDP bağlantısızdır, garanti vermez ama hızlı ve hafiftir (DNS sorguları, canlı yayın)."
  - id: ag-003-s3
    soru: "TCP üçlü el sıkışmanın adımlarını sırala."
    cevap: "İstemci SYN yollar, sunucu SYN-ACK ile yanıtlar, istemci ACK gönderir. Ondan sonra bağlantı kurulmuş sayılır ve veri akar."
  - id: ag-003-s4
    soru: "22, 80 ve 443 numaralı portlar hangi servislerin varsayılan portlarıdır?"
    cevap: "22 SSH, 80 HTTP, 443 HTTPS. Bunlar ezber olmasa da çok görürsün; DNS için 53 de aynı listeye eklenir."
derinDalis:
  - tur: okuma
    baslik: "RFC 9293: Transmission Control Protocol (TCP)"
    ayrinti: "TCP'nin güncel standardı. Bölüm 3.5 üçlü el sıkışmayı anlatıyor; hepsini okumana gerek yok."
    url: "https://www.rfc-editor.org/rfc/rfc9293"
---

Bir IP adresi paketi doğru makineye ulaştırır. Makinede ise aynı anda onlarca program ağ kullanır. Paketi doğru programa vermek için **port** numarası kullanılır. Port 0-65535 arası bir sayıdır. Bir program ağdan gelen istekleri beklemeye başlayınca belli bir porta **bağlanır** ve o port "dinliyor" (listening) olur.

Yaygın portlar:

| Port | Servis |
|---|---|
| 22 | SSH |
| 53 | DNS |
| 80 | HTTP |
| 443 | HTTPS |

0-1023 arası "iyi bilinen" portlardır. Bunları dinlemek için Linux'ta genelde yönetici yetkisi gerekir.

### TCP

**TCP** (Transmission Control Protocol) iki taraf arasında güvenilir bir bağlantı kurar. Veri sıra numaralarıyla gider; kaybolan parça yeniden gönderilir. Bağlantı **üçlü el sıkışma** (three-way handshake) ile başlar:

1. İstemci: `SYN` ("konuşmak istiyorum").
2. Sunucu: `SYN-ACK` ("duydum, ben de hazırım").
3. İstemci: `ACK` ("tamam, başlıyoruz").

Bu bedel, güvenilirliğin karşılığıdır. Web, SSH ve e-posta TCP kullanır.

### UDP

**UDP** (User Datagram Protocol) el sıkışmaz; paketi yollar ve unutur. Kaybolan paket geri gelmez. Bunun karşılığı hız ve düşük yüktür. DNS sorguları, canlı video ve oyunlar için uygundur. Küçük DNS sorgusunda bir paket kaybolursa istemci sorguyu basitçe tekrar eder.

### Bağlantının durumu

Bir TCP bağlantısı yaşam döngüsünde farklı durumlarda olur: `LISTEN` (sunucu bekliyor), `ESTABLISHED` (konuşma sürüyor), `TIME-WAIT` (kapanıştan sonra kısa süre bekleme). `ss` bu durumları gösterir.

### ss ile bakmak

`ss -tulpn` bayraklarının anlamı:

- `-t` TCP, `-u` UDP
- `-l` yalnız dinleyenler
- `-p` hangi program (kendi süreçlerini görmek için yetki gerekebilir; `sudo` ile başa ekle)
- `-n` isimleri çözme, sayıları göster

Çıktıdaki **yerel adres** kritiktir. `127.0.0.1:8000` yalnız aynı makineden erişilebildiğini, `0.0.0.0:8000` ya da `*:8000` bütün arayüzlerden erişilebildiğini gösterir. Bir veritabanının `0.0.0.0` üzerinde dinlemesi sık görülen bir yanlış yapılandırmadır.

### Güvenlik gözüyle

Saldırı yüzeyi (attack surface) kabaca açık portlar demektir. Bir servis ne kadar az portta dinlerse, saldırgan o kadar az yer dener. Kural basit: **gerekmeyen servisi durdur, gereken servisi yalnız gereken adrese aç.**

Güvenlik notu: "Port açık" demek "zafiyet var" demek değildir; ama gereksiz her açık port, bakımını yapmadığın bir kapıdır. Düzenli olarak `ss -tulpn` çıktını gözden geçir.
