---
kimlik: ag-008
baslik: "Paket okumak"
donem: 2
sira: 8
sure: 35
neden: "Loglar bir şeyin olduğunu söyler; paket yakalama ise telde gerçekte ne geçtiğini gösterir. Olay müdahalesinde şüpheli bir bağlantıyı incelemek, bir servisin neden konuşamadığını anlamak ve düz metin gönderen bir uygulamayı yakalamak için paket okumak gerekir."
analoji:
  baslik: "Paket yakalama, trafik kamerası"
  metin: "Bir kavşağa kamera koyup geçen her aracı kaydetmek gibi: plakaları ve yönleri sonra tek tek izleyebilirsin. Sınır: kamera yalnız önünden geçeni görür; senin makinen dışındaki trafiği her zaman göremezsin ve şifreli trafiğin içi görünmez."
gorev:
  aciklama: "Yalnız kendi makinenin içinde (loopback arayüzü) bir HTTP isteği yakalayacaksın; dışarıdaki kimsenin trafiğine dokunmuyorsun. Üç ayrı terminal sekmesi aç. `tcpdump` yoksa `sudo apt install -y tcpdump` ile kur."
  komutlar:
    - "python3 -m http.server 8080 --bind 127.0.0.1"
    - "sudo tcpdump -i lo -A -n -c 20 'tcp port 8080'"
    - "curl -s http://127.0.0.1:8080/ -o /dev/null"
  soru: "Yakalanan paketlerde ilk üçünde hangi bayraklar (`[S]`, `[S.]`, `[.]`) görünüyor? Sonra `GET / HTTP/1.1` satırını ve `Host:` başlığını bulabildin mi?"
  telefon:
    soru: "tcpdump çıktısında şu üç satırı görüyorsun: `Flags [S]`, `Flags [S.]`, `Flags [.]`. Bu üç satır ne anlatır?"
    cevap: "TCP üçlü el sıkışmasıdır: `[S]` istemcinin SYN'i, `[S.]` sunucunun SYN-ACK'ı, `[.]` istemcinin son ACK'ı. Bundan sonra HTTP isteği gelir."
sorular:
  - id: ag-008-s1
    soru: "`tcpdump` ile Wireshark arasındaki temel fark nedir?"
    cevap: "İkisi de paket yakalar. tcpdump terminalde, hızlı ve sunucularda kullanışlı bir komut satırı aracıdır; Wireshark grafik arayüzle paketleri katman katman ayrıştırıp inceleme sunar. Yakalama dosyası (pcap) ikisi arasında paylaşılabilir."
    ipucu: "Biri terminal, diğeri grafik arayüz; ama ikisi de aynı işi yapıyor."
  - id: ag-008-s2
    soru: "Düz HTTP isteğini yakalayınca neyi okuyabilirsin? Aynısını HTTPS ile yapsan ne görürdün?"
    cevap: "HTTP'de metot, yol, başlıklar ve gövde açıkça okunur, parola ve çerez dahil. HTTPS'te içerik şifreli görünür; yalnız IP adresleri, portlar, boyutlar ve TLS el sıkışmasındaki bazı bilgiler görünür."
    ipucu: "Şifrelenmemiş olan açık okunur, şifrelenmiş olanda ne kalır?"
  - id: ag-008-s3
    soru: "`tcpdump -i lo` komutundaki `lo` arayüzü nedir?"
    cevap: "Loopback arayüzüdür; makinenin kendi kendisiyle konuştuğu sanal arayüz (127.0.0.1). Yerel testlerde dış ağa dokunmadan trafik yakalamak için kullanışlıdır."
    ipucu: "Kendi makinenin kendisiyle konuştuğu sanal arayüz."
  - id: ag-008-s4
    soru: "Paket yakalamak neden yetkili ve izinli ortamlarda yapılmalıdır?"
    cevap: "Yakalanan trafik başkalarının parolalarını, çerezlerini ve özel verisini içerebilir. İzinsiz yakalama hem etik hem yasal sorun doğurur; yakalama dosyalarına da hassas veri gibi davranılır."
    ipucu: "Yakalanan veri kimin verisi?"
  - id: ag-008-s5
    soru: "Bir test sunucusunda yakalama dosyasını (pcap) paylaşmadan önce içinde bir `Authorization: Basic ...` başlığı fark ediyorsun. Ne yaparsın?"
    cevap: "Dosyayı paylaşmam; içinde gerçek bir kimlik bilgisi sızmış demektir. Basic kimlik doğrulama yalnız kodlanmıştır, şifrelenmemiştir. İlgili hesabın parolasını değiştiririm, uygulamanın HTTPS'e geçmesini isterim ve yakalama dosyasını hassas veri gibi saklayıp işim bitince silerim."
    ipucu: "Düz HTTP'de başlıklar açıkça okunur; yakalanan dosya da hassas veridir."
hizliKontrol:
  - soru: "`tcpdump -i lo` hangi trafiği yakalar?"
    secenekler:
      - "Wi-Fi trafiğini"
      - "Makinenin kendi içindeki loopback trafiğini"
      - "Yalnız HTTPS trafiğini"
      - "Yönlendiricinin trafiğini"
    dogru: 1
    aciklama: "`lo` loopback arayüzüdür; makinenin kendisiyle konuştuğu 127.0.0.1 trafiğini gösterir."
    ipucu: "`lo` hangi adresin kısaltması gibi duruyor?"
sikHatalar:
  - hata: "İzin almadan ortak bir ağda paket yakalamak."
    dogrusu: "Yalnız kendi cihazında ya da yazılı izinli ortamlarda yakala; başkalarının trafiği parola ve özel veri içerir."
  - hata: "HTTPS trafiğinde içeriği okumayı beklemek."
    dogrusu: "İçerik şifreli görünür; yalnız IP, port, boyut ve el sıkışmanın bazı bilgileri okunur."
terimler:
  - "Paket yakalama"
  - "HTTP"
  - "TLS"
  - "Paket"
derinDalis:
  - tur: okuma
    baslik: "tcpdump kılavuz sayfası"
    ayrinti: "Bayrakların ve yakalama filtresi söz diziminin resmi açıklaması."
    url: "https://www.tcpdump.org/manpages/tcpdump.1.html"
  - tur: okuma
    baslik: "Wireshark Kullanıcı Kılavuzu"
    ayrinti: "Yakalama, görüntüleme filtreleri ve paket ayrıştırma bölümleri."
    url: "https://www.wireshark.org/docs/wsug_html_chunked/"
---

Şimdiye kadar ağ konuşmalarını araçların özetiyle gördük. **Paket yakalama** (packet capture) ise telden geçen paketleri olduğu gibi kaydedip okumaktır. İki ana araç vardır: komut satırında **tcpdump** ve grafik arayüzlü **Wireshark**.

### Nasıl çalışır?

Ağ kartı normalde yalnız sana gelen paketleri işler. Yakalama araçları, bu paketlerin bir kopyasını işletim sisteminden alır. Bu yüzden yetki gerekir: `sudo tcpdump ...`. Bir ağ arayüzü seçersin (`-i lo` loopback, `-i eth0` ağ kartı) ve istersen bir **filtre** yazarsın.

### tcpdump'ın temel bayrakları

| Bayrak | Anlamı |
|---|---|
| `-i lo` | Hangi arayüzü dinle |
| `-n` | Adları çözme, sayıları göster |
| `-c 20` | 20 paketten sonra dur |
| `-A` | Paket içeriğini ASCII olarak göster |
| `-w dosya.pcap` | Yakalamayı dosyaya yaz |

Yakalama filtresi tırnak içinde yazılır: `'tcp port 8080'`, `'host 10.0.0.5'`, `'udp port 53'`.

### Çıktıyı okumak

Bir satır kabaca şuna benzer:

```
IP 127.0.0.1.45012 > 127.0.0.1.8080: Flags [S], seq 123, length 0
```

Soldan sağa: kaynak adres ve port, ok, hedef adres ve port, TCP bayrakları. Bayraklar üçlü el sıkışmayı gösterir (ag-003): `[S]` SYN, `[S.]` SYN-ACK, `[.]` ACK, `[P.]` veri itme, `[F.]` kapatma. Üç el sıkışmadan sonra `-A` ile `GET / HTTP/1.1` gibi satırlar düz metin olarak görünür.

### Bir HTTP isteğinin anatomisi

Yakalamada ag-005'te anlattığımız yapıyı gözünle görürsün: istek satırı, `Host:` başlığı, `User-Agent:`. Yanıtta `HTTP/1.0 200 OK` ve gövde gelir. Düz HTTP ile bir parola ya da çerez gönderilseydi, aynı şekilde okunurdu. Bu, "HTTPS neden şart" sorusunun somut cevabıdır.

### Wireshark

Wireshark aynı yakalamayı üç bölmede gösterir: paket listesi, seçili paketin katman katman ayrıştırması (Ethernet, IP, TCP, HTTP), ham bayt. `tcp.port == 8080` ya da `http.request` gibi **görüntüleme filtreleri** ile gürültüyü ayıklarsın. Sunucudaki bir yakalamayı `-w` ile dosyaya yazıp kendi bilgisayarında Wireshark'ta açmak yaygın bir iş akışıdır.

### Ne zaman işe yarar?

- Bir uygulamanın hangi adrese, hangi portla bağlanmaya çalıştığını görmek.
- DNS sorgusu çıkıyor mu, yanıt geliyor mu bakmak.
- Düz metin gönderilen parola gibi sızıntıları yakalamak.
- Bir güvenlik duvarının hangi paketi düşürdüğünü anlamak.

Güvenlik notu: Yakalama dosyaları başkalarının parolalarını ve çerezlerini içerebilir. Yalnız kendi ağında ya da yazılı izin verilen ortamlarda yakala; dosyaları hassas veri olarak sakla ve işin bitince sil.
