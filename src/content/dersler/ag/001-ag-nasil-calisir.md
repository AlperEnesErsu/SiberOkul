---
kimlik: ag-001
baslik: "Ağ nasıl çalışır"
donem: 2
sira: 1
sure: 30
neden: "Bir uygulama 'yavaş' ya da 'erişilemiyor' dediğinde sorunun nerede olduğunu bulmak için verinin nasıl yolculuk ettiğini bilmen gerekir. Güvenlik duvarı kuralı, DNS hatası, sertifika sorunu: hepsi ağın bir katmanında yaşar. Bu ders, sonraki 11 dersin haritasıdır."
analoji:
  baslik: "Ağ, posta sistemi"
  metin: "Uzun bir mektubu sayfa sayfa, her biri numaralı ve adresli zarflara koyup yolladığını düşün. Zarflar farklı yollardan gidebilir, alıcı numaralara bakıp sayfaları sıraya dizer. Paketler de böyledir. Sınır: gerçek postada zarfı kimse açıp okumaz; ağda yolun üzerindeki cihazlar şifrelenmemiş içeriği okuyabilir."
gorev:
  aciklama: "WSL Ubuntu terminalinde bilgisayarının ağ görünümüne bak ve bir paketin gidip gelmesini izle:"
  komutlar:
    - "ip -br link"
    - "ip -br addr"
    - "ip route"
    - "ping -c 3 example.com"
  soru: "`ip route` çıktısındaki `default via ...` satırı ne anlatıyor? Paketler internete çıkarken ilk hangi cihaza gider?"
  telefon:
    soru: "`ping -c 3 example.com` çıktısında 3 satır `64 bytes from ... time=20 ms` ve sonda `0% packet loss` görüyorsun. Bu ne demek?"
    cevap: "3 paket gönderildi, 3 yanıt geldi, hiçbiri kaybolmadı. Hedefe ulaşılabiliyor ve gidiş-dönüş süresi yaklaşık 20 milisaniye. Ağ bu yol için çalışıyor."
sorular:
  - id: ag-001-s1
    soru: "Veri neden tek parça yerine paketlere bölünerek gönderilir?"
    cevap: "Paketler farklı yollardan gidebilir, kaybolan küçük bir parça yeniden gönderilebilir ve bir hat birçok kişi arasında paylaşılabilir. Büyük tek parça bütün hattı uzun süre meşgul ederdi."
    ipucu: "Paketin başlığıyla yükünü zarf ve mektup olarak düşün: hangisi yol bilgisi taşır?"
  - id: ag-001-s2
    soru: "TCP/IP modelinin dört katmanını sırala ve her birine bir örnek ver."
    cevap: "Uygulama (HTTP, DNS), taşıma (TCP, UDP), internet (IP) ve bağlantı (Ethernet, Wi-Fi). Üstteki katman altındakini kullanır."
    ipucu: "Dört katmanı aşağıdan yukarı sırala: önce kablo/Wi-Fi, sonra adres."
  - id: ag-001-s3
    soru: "İstemci ile sunucu arasındaki fark nedir? Tarayıcın ne, bir web sitesi ne?"
    cevap: "İstemci (client) hizmet isteyen, sunucu (server) isteği karşılayan taraftır. Tarayıcın istemci, web sitesini sunan program sunucudur. Aynı makine bir durumda istemci, başka durumda sunucu olabilir."
    ipucu: "Aynı makinede hem web sitesi çalışıp hem tarayıcı açık olabilir; rol neye göre değişir?"
  - id: ag-001-s4
    soru: "Bir site açılmıyor. Sorunun olabileceği iki farklı katmanı ve nedenini söyle."
    cevap: "Bağlantı katmanında Wi-Fi kopmuş olabilir; taşıma katmanında bir güvenlik duvarı portu kapatmış olabilir; uygulama katmanında DNS adı çözmüyor ya da sunucu hata veriyor olabilir."
    ipucu: "Her katman farklı bir soruyu yanıtlar: kablo mu, adres mi, port mu, uygulama mı?"
  - id: ag-001-s5
    soru: "Bir meslektaşın 'sunucuya erişemiyorum' diyor. Tarayıcıda sayfa açılmıyor, ama aynı Wi-Fi'daki başka siteler açılıyor. Katman fikrini kullanarak ilk hangi soruları sorarsın?"
    cevap: "Katmanları aşağıdan yukarı elerim: Wi-Fi bağlı mı ve diğer siteler açıldığına göre bağlantı ve IP katmanı büyük olasılıkla sağlam. Sonra bu siteye özel sorulara geçerim: ad IP'ye çözülüyor mu (DNS), porta ulaşılıyor mu (güvenlik duvarı), sunucu uygulaması hata mı veriyor? Böylece her adım bir katmanı eler."
    ipucu: "Diğer sitelerin açılması hangi katmanların çalıştığını kanıtlıyor?"
hizliKontrol:
  - soru: "Ağdaki bir paket hangi iki kısımdan oluşur?"
    secenekler:
      - "Yük ve sertifika"
      - "Başlık ve yük"
      - "Port ve protokol"
      - "İstemci ve sunucu"
    dogru: 1
    aciklama: "Başlıkta kimden kime gittiği gibi bilgiler, yükte asıl veri bulunur."
    ipucu: "Zarfın üstündeki adres ile içindeki mektubu düşün."
sikHatalar:
  - hata: "'Site açılmıyor' sorununun hep sunucudan kaynaklandığını varsaymak."
    dogrusu: "Sorun kablo, adres, port ya da uygulama katmanında olabilir; aşağıdan yukarı sırayla eleyerek bul."
  - hata: "Yoldaki cihazların paket içeriğini göremediğini sanmak."
    dogrusu: "Şifrelenmemiş protokollerde (düz HTTP) yoldaki cihazlar içeriği okuyabilir; bu yüzden şifreleme gerekir."
terimler:
  - "Paket"
  - "İstemci-sunucu"
  - "IP adresi"
  - "TCP"
sema:
  baslik: "Bir web sitesine giden yolculuk"
  adimlar:
    - etiket: "DNS"
      aciklama: "Ad, IP adresine çevrilir."
    - etiket: "TCP"
      aciklama: "Sunucuyla bağlantı kurulur."
    - etiket: "TLS"
      aciklama: "HTTPS ise bağlantı şifrelenir."
    - etiket: "HTTP"
      aciklama: "İstek gider, yanıt gelir."
derinDalis:
  - tur: kitap
    baslik: "Computer Networking: A Top-Down Approach (Kurose, Ross)"
    ayrinti: "Giriş bölümü: paket anahtarlama ve katmanlı mimari. Üniversitelerde yaygın kullanılan bir ders kitabı."
---

Bir ağ, birbirine kablo ya da radyo dalgasıyla bağlı cihazlardan oluşur. Cihazlar birbirine **paket** (packet) denen küçük parçalar halinde veri yollar. Bir fotoğrafı ya da web sayfasını indirdiğinde aslında yüzlerce paket sırayla gelir ve alıcıda birleştirilir.

Her paketin iki kısmı vardır: **başlık** (header) ve **yük** (payload). Başlıkta kimden kime gittiği, sıra numarası gibi bilgiler, yükte asıl veri bulunur. Zarfın üstündeki adres başlık, içindeki mektup yüktür.

### Katman fikri

Her şeyi tek bir kural kitabıyla çözmek imkânsız olurdu. Bu yüzden iş **katmanlara** bölünür; her katman yalnız kendi işini yapar. İnternetin kullandığı **TCP/IP modeli** dört katmandan oluşur:

| Katman | İşi | Örnek |
|---|---|---|
| Uygulama | Programların konuştuğu dil | HTTP, DNS, SSH |
| Taşıma | Hangi programa, güvenilir mi | TCP, UDP |
| İnternet | Hangi makineye, hangi yoldan | IP |
| Bağlantı | Yan yana iki cihaz arası | Ethernet, Wi-Fi |

Bir paket gönderilirken her katman kendi başlığını ekler; buna **kapsülleme** (encapsulation) denir. Alıcıda başlıklar sırayla soyulur. Soğan gibi düşün: dıştaki kabuk, içindekinin ne olduğunu bilmek zorunda değildir.

Katmanlar teşhiste de işe yarar. Sorun "kablo mu, adres mi, port mu, uygulama mı?" diye aşağıdan yukarı sorgulanır. Güvenlik tarafında da aynı haritayı kullanırsın: güvenlik duvarı taşıma ve internet katmanında, TLS uygulamanın hemen altında, DNS saldırıları uygulama katmanında çalışır.

### İstemci ve sunucu

Ağdaki çoğu konuşma **istemci-sunucu** (client-server) biçimindedir. İstemci bir istek yollar, sunucu yanıtlar. Sunucu, belirli bir **port** üzerinde dinleyen bir programdır (ag-003'te ayrıntısı var). Tarayıcın istemci; web sitesini sunan program sunucudur.

### Yolculuğun özeti

`example.com` yazdığında önce adın hangi IP adresine karşılık geldiği öğrenilir (DNS). Sonra o adrese bir TCP bağlantısı kurulur. HTTPS ise bağlantı şifrelenir, ardından HTTP isteği gider. Bu bölümün dersleri tam olarak bu zincirin halkalarıdır.

Evdeki cihazlar bir **yönlendirici** (router) üzerinden internete çıkar. Hedef kendi ağında değilse paket, bilinen "varsayılan çıkış kapısı"na (default gateway) verilir. Bunu `ip route` ile görürsün.

Güvenlik notu: Paketler yolda birçok cihazdan geçer. Şifrelenmemiş protokollerde (örneğin düz HTTP) yoldaki biri içeriği okuyabilir ya da değiştirebilir. Şifreleme bu yüzden ağ güvenliğinin temelidir.
