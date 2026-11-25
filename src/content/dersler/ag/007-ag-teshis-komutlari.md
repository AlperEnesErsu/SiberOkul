---
kimlik: ag-007
baslik: "Ağ teşhis komutları"
donem: 2
sira: 7
sure: 30
neden: "Bir servis ulaşılamadığında 'ağ mı, DNS mi, port mu, uygulama mı?' sorusunu dakikalar içinde daraltabilmek, olay müdahalesinde ve gece nöbetinde en çok işe yarayan beceridir. Bu dört komut o daraltmanın temel araçlarıdır."
analoji:
  baslik: "Teşhis komutları, doktorun muayenesi"
  metin: "Doktor önce nabza bakar (ping: canlı mı?), sonra rahatsızlığın nerede olduğunu arar (traceroute: yolun neresinde?), sonra tek tek organı dinler (nc: o port açık mı?) ve en sonunda tam muayene yapar (curl: uygulama düzgün konuşuyor mu?). Sınır: nabız normal diye hasta sağlıklı olmayabilir; ping yanıtı da uygulamanın çalıştığını göstermez."
gorev:
  aciklama: "Gerekirse `sudo apt update && sudo apt install -y traceroute netcat-openbsd` ile eksik araçları kur. Sonra yalnız herkese açık, zararsız hedeflere bağlan:"
  komutlar:
    - "ping -c 4 1.1.1.1"
    - "ping -c 2 example.com"
    - "traceroute -m 10 example.com"
    - "nc -zv -w 3 example.com 443"
    - "curl -sS -o /dev/null -w \"%{http_code} %{time_total}s\\n\" https://example.com"
  soru: "`ping 1.1.1.1` çalışıp `ping example.com` 'Name or service not known' verirse sorun hangi katmandadır?"
  telefon:
    soru: "`nc -zv -w 3 sunucu 22` komutu 'Connection timed out' yazıyor, `nc -zv -w 3 sunucu 80` ise 'Connection refused' yazıyor. Bu iki sonuç ne anlatıyor?"
    cevap: "Refused: makineye ulaşıldı ama o portta dinleyen program yok (port kapalı). Timed out: paketler cevap almadı; çoğunlukla bir güvenlik duvarı sessizce düşürüyor ya da makineye hiç ulaşılamıyor. Birincisi 'kapı var ama kimse yok', ikincisi 'kapıya ulaşamıyorum'."
sorular:
  - id: ag-007-s1
    soru: "`ping` hangi protokolü kullanır ve ne zaman yanıltıcı olabilir?"
    cevap: "ICMP echo isteği kullanır. Birçok güvenlik duvarı ICMP'yi engeller; yanıt gelmemesi makinenin kapalı olduğunu göstermez. Yanıt gelmesi de uygulamanın çalıştığını göstermez."
  - id: ag-007-s2
    soru: "`traceroute` çıktısında bir satırda `* * *` görürsen sorun mu var?"
    cevap: "Her zaman değil. O duraktaki yönlendirici yanıt vermemeyi seçmiş olabilir; sonraki duraklara ulaşılıyorsa yol çalışıyordur. Yolun sonunda da `* * *` sürüyorsa engel orada olabilir."
  - id: ag-007-s3
    soru: "`nc -zv host 443` neyi test eder ve `-z` bayrağı ne işe yarar?"
    cevap: "Hedef makinede 443 portuna bir TCP bağlantısı kurulup kurulamadığını test eder. `-z` veri göndermeden yalnız bağlantıyı dener, `-v` sonucu ayrıntılı yazar."
  - id: ag-007-s4
    soru: "Bir sitenin açılmadığı durumda teşhisi hangi sırayla yaparsın?"
    cevap: "Önce IP'ye ping (ağ var mı), sonra adla ping ya da `dig` (DNS çalışıyor mu), sonra `nc -zv` (port açık mı), en sonda `curl -v` (uygulama ne diyor). Her adım bir katmanı eler."
derinDalis:
  - tur: kitap
    baslik: "Computer Networking: A Top-Down Approach (Kurose, Ross)"
    ayrinti: "ICMP ve ağ katmanı bölümleri; ping ve traceroute'un arkasındaki mantığı anlatır."
---

Ağ sorunlarında hedef, "çalışmıyor"u katman katman daraltmaktır. Bu derste dört temel aracı tanıyoruz.

### ping: canlı mı?

`ping`, hedefe **ICMP** adlı küçük bir protokolle "echo" isteği yollar; hedef yanıt verirse "ulaşılabilir" sayarsın. Çıktıda `time=` gidiş-dönüş süresini, sondaki satır kaç paketin kaybolduğunu söyler. `-c 4` dört paket gönderir ve durur; yoksa sonsuza kadar sürer.

Sınır: pek çok güvenlik duvarı ICMP'yi bilerek engeller. Yanıt yoksa "kapalı" deme; yanıt varsa "uygulama çalışıyor" deme.

### traceroute: yol nereden geçiyor?

`traceroute`, paketin TTL (yaşam süresi) alanını 1, 2, 3 diye artırarak hedefe giden yoldaki her yönlendiriciyi açığa çıkarır. Her satır bir duraktır ve üç ölçüm süresi gösterir. `* * *` o durağın yanıt vermediğini söyler; yol orada kopmuş olabilir ya da yönlendirici sessiz kalıyordur. Gecikmenin birdenbire arttığı yer, yavaşlığın kaynağına dair ipucudur.

### nc: port açık mı?

`nc` (netcat), ağda ham bağlantı kuran bir "İsviçre çakısı"dır. Port testi için şöyle kullanırsın:

```
nc -zv -w 3 example.com 443
```

Üç olası sonuç:

- **succeeded**: Port açık, bağlantı kuruldu.
- **Connection refused**: Makineye ulaşıldı ama orada dinleyen yok.
- **timed out**: Cevap gelmedi; genelde bir güvenlik duvarı paketleri sessizce düşürüyor.

Refused ile timed out arasındaki fark teşhis için çok değerlidir. Refused, sorunun makinenin kendisinde; timed out ise ağda ya da güvenlik duvarında olduğunu düşündürür.

### curl: uygulama düzgün mü?

ag-005'te gördüğün `curl` burada son adımdır. `-w` ile yalnız ihtiyacın olan bilgiyi alabilirsin:

```
curl -sS -o /dev/null -w "%{http_code} %{time_total}s\n" https://example.com
```

Bu, durum kodunu ve toplam süreyi yazar. `-m 5` ile 5 saniyede zaman aşımı, `-sS` ile sessiz ama hatayı gösteren mod kullanılır.

### Teşhis merdiveni

1. `ping 1.1.1.1`: Ağ bağlantım var mı?
2. `ping example.com` ya da `dig example.com`: DNS çalışıyor mu?
3. `nc -zv example.com 443`: Port açık mı?
4. `curl -v https://example.com`: Uygulama ve TLS ne diyor?

Her adımda başarısız olan, sorunun hangi katmanda olduğunu gösterir.

Güvenlik notu: Bu araçları yalnız kendi sistemlerinde ya da izinli hedeflerde kullan. Bir portu tek tek denemek bile, izinsiz yapılırsa keşif sayılabilir; ag-012'de sınırları konuşacağız.
