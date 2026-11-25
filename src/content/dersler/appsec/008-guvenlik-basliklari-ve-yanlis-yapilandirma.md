---
kimlik: appsec-008
baslik: "Güvenlik başlıkları ve yanlış yapılandırma"
donem: 5
sira: 8
sure: 30
neden: "Kodun kusursuz olsa bile yanlış yapılandırılmış bir sunucu, açık bırakılmış hata ayıklama modu ya da değiştirilmemiş varsayılan şifre kapıyı açar. Güvenlik başlıklarını ve yapılandırmayı denetlemek, DevSecOps'ta en sık otomatikleştirilen kontrollerdendir."
analoji:
  baslik: "Evin kapısı, penceresi ve yedek anahtarı"
  metin: "Sağlam bir kapı taktın ama pencere açık, yedek anahtar paspasın altında. Yanlış yapılandırma budur: güvenli yapı, güvensiz ayarla boşa gider. Güvenlik başlıkları ise tarayıcıya verdiğin kapanış talimatlarıdır: 'yalnız HTTPS ile gel', 'yalnız şu kaynaklardan betik yükle'. Sınırı: başlıklar tarayıcıyı yönlendirir; sunucudaki gerçek açıkları kapatmaz."
gorev:
  aciklama: "Önce yerel bir sunucuya güvenlik başlıkları ekleyip `curl -I` ile gör. Sonra `example.com` adresinin başlıklarına bak (yalnız başlık okuyoruz, saldırı yok). Kendi sitenin başlıklarını da aynı yöntemle inceleyebilirsin."
  komutlar:
    - "mkdir -p ~/appsec && cd ~/appsec"
    - |
      cat > baslik_sunucu.py <<'EOF'
      from http.server import BaseHTTPRequestHandler, HTTPServer

      class H(BaseHTTPRequestHandler):
          def do_GET(self):
              self.send_response(200)
              self.send_header("Content-Type", "text/html; charset=utf-8")
              self.send_header("X-Content-Type-Options", "nosniff")
              self.send_header("Content-Security-Policy", "default-src 'self'")
              self.send_header("X-Frame-Options", "DENY")
              self.end_headers()
              self.wfile.write(b"<h1>merhaba</h1>")
          def log_message(self, *a):
              pass

      HTTPServer(("127.0.0.1", 8001), H).serve_forever()
      EOF
    - "python3 baslik_sunucu.py & sleep 1"
    - "curl -sI http://127.0.0.1:8001/"
    - "kill %1"
    - "curl -sI https://example.com | head -15"
  soru: "Yerel sunucunun yanıtında hangi üç koruma başlığı var? `example.com` yanıtında hangileri eksik?"
  telefon:
    soru: "Bir sitenin yanıtında `Strict-Transport-Security: max-age=63072000; includeSubDomains` başlığı var. Bu başlık tarayıcıya ne söyler ve neyi önler?"
    cevap: "Tarayıcıya, bu siteye (ve alt alan adlarına) uzun süre yalnız HTTPS ile bağlanmasını söyler. Kullanıcı yanlışlıkla http:// yazsa bile tarayıcı HTTPS'e çevirir; bağlantıyı düşük sürüme çekme saldırılarını (downgrade) zorlaştırır."
sorular:
  - id: appsec-008-s1
    soru: "HSTS (Strict-Transport-Security) başlığı ne işe yarar?"
    cevap: "Tarayıcıya siteye belirtilen süre boyunca yalnız HTTPS üzerinden bağlanmasını söyler; düz HTTP istekleri tarayıcı tarafında HTTPS'e yükseltilir."
    ipucu: "Tarayıcıya 'bu siteye hep HTTPS ile git' diyen başlığı hatırla."
  - id: appsec-008-s2
    soru: "`X-Content-Type-Options: nosniff` neyi önler?"
    cevap: "Tarayıcının, sunucunun bildirdiği içerik türünü yok sayıp dosyanın içeriğine bakarak türü tahmin etmesini (MIME sniffing) engeller; örneğin yüklenen bir metin dosyasının betik gibi çalıştırılmasını."
    ipucu: "Tarayıcı dosya türünü tahmin etmeye kalkarsa ne olur?"
  - id: appsec-008-s3
    soru: "Üretim ortamında ayrıntılı hata sayfası ve yığın izi (stack trace) göstermek neden sorundur?"
    cevap: "Dosya yolları, sürüm bilgileri, sorgu parçaları gibi bilgiler saldırgana yol haritası verir. Kullanıcıya genel bir hata mesajı gösterilir, ayrıntı yalnız sunucu günlüğüne yazılır."
    ipucu: "Hata ayrıntısı kime yarar: kullanıcıya mı, saldırgana mı?"
  - id: appsec-008-s4
    soru: "Yanlış yapılandırmaya örnek üç şey say."
    cevap: "Değiştirilmemiş varsayılan şifreler, açık bırakılmış hata ayıklama (debug) modu, herkese açık bulut depolama alanı ya da gereksiz açık portlar/servisler. Hepsi kodda değil, ayarlarda olur."
    ipucu: "Varsayılan parola, açık yönetim paneli ya da gereksiz servisler hangi sınıfa girer?"
  - id: appsec-008-s5
    soru: "Yeni bir ürün canlıya alınmadan önce güvenlik taramasında `Server: Apache/2.4.x` ve `X-Powered-By` başlıkları, herkese açık `/admin` ve varsayılan hata sayfası bulundu. Önceliği nasıl belirlersin?"
    cevap: Önce herkese açık `/admin` kapatılır ya da kimlik doğrulama ve ağ kısıtıyla korunur; çünkü doğrudan erişim sağlar. Sonra ayrıntılı hata sayfaları genel mesaja çevrilir ve hatalar sunucu günlüğüne yazılır. Sürüm bilgisi veren başlıklar en son temizlenir; tek başına açık değildir ama saldırgana keşif kolaylığı verir.
    ipucu: Doğrudan erişim sağlayan bulgu, bilgi sızdıran bulgudan önce gelir.
derinDalis:
  - tur: okuma
    baslik: "OWASP HTTP Security Response Headers Cheat Sheet"
    ayrinti: "Hangi başlık ne işe yarar ve önerilen değerler."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html"
  - tur: okuma
    baslik: "OWASP Error Handling Cheat Sheet"
    ayrinti: "Genel hata yanıtı, ayrıntının sunucuda günlüğe yazılması."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html"
hizliKontrol:
  - soru: HSTS başlığı tarayıcıya ne söyler?
    secenekler:
      - Sayfayı iframe içinde açma
      - Dosya türünü tahmin etme
      - Siteye belirtilen süre boyunca yalnız HTTPS ile bağlan
      - Çerezleri sil
    dogru: 2
    aciklama: HSTS, düz HTTP isteklerini tarayıcı tarafında HTTPS'e yükseltir.
    ipucu: Başlığın adındaki 'Transport' ve 'Security' sözcüklerine bak.
sikHatalar:
  - hata: Üretimde hata ayrıntısını (yığın izi, SQL) kullanıcıya göstermek.
    dogrusu: Kullanıcıya genel mesaj göster, ayrıntıyı sunucu günlüğüne yaz.
  - hata: Varsayılan parolaları ve örnek hesapları canlıya bırakmak.
    dogrusu: Kurulumdan sonra varsayılan hesapları kapat ya da parolayı değiştir; sertleştirme kontrol listesi uygula.
olay:
  baslik: Capital One veri ihlali
  yil: 2019
  ozet: Capital One, 22-23 Mart 2019'da yetkisiz erişim olduğunu, bir güvenlik araştırmacısının 17 Temmuz'da bildirimiyle öğrendiğini ve 19 Temmuz'da olayı belirlediğini açıkladı. Şirket olayı bir yapılandırma açığı olarak tanımladı. ABD'de yaklaşık 100 milyon, Kanada'da yaklaşık 6 milyon kişi etkilendi; kredi kartı başvuru bilgileri ve bazı kişilerin kimlik numaraları erişilen veriler arasındaydı.
  ders: Tek bir yanlış yapılandırma, bulut ortamındaki çok büyük bir veri kümesini açabilir. Bu derstaki sertleştirme alışkanlıkları ve düzenli yapılandırma denetimi bu risk türünü azaltır.
  kaynak:
    ad: Capital One, 2019 siber olayı bilgi sayfası
    url: https://www.capitalone.com/digital/facts2019/
terimler:
  - Güvenlik başlığı
  - HSTS
---

Yanlış yapılandırma (security misconfiguration), kodun değil **ayarların** güvensiz olmasıdır. Top 10'da üst sıralardadır, çünkü sayısız ayar vardır ve varsayılanlar çoğu zaman güvenlik değil kolaylık için seçilmiştir.

### Tipik örnekler

- Kurulumdan sonra değiştirilmeyen varsayılan hesap ve şifreler (`admin/admin`).
- Üretimde açık bırakılmış **debug modu** ya da ayrıntılı hata sayfaları.
- Gereksiz açık servisler, örnek uygulamalar, dizin listeleme.
- Bulutta herkese açık depolama alanları (Bulut bölgesinde göreceğiz).
- Eksik ya da yanlış güvenlik başlıkları.

### Hata mesajları

Kullanıcıya ham hata göstermek, saldırgana bilgi verir:

```
Traceback ... File "/srv/app/db.py", line 41 ... sqlite3.OperationalError: no such column: parola
```

Bu çıktı tablo yapısını, dosya yolunu ve kullanılan veri tabanını ele verir. Kullanıcıya "Bir sorun oluştu" gibi genel bir mesaj ve bir hata kimliği göster; ayrıntıyı sunucu günlüğüne yaz.

### Önemli güvenlik başlıkları

| Başlık | Ne yapar |
|---|---|
| `Strict-Transport-Security` (HSTS) | Siteye yalnız HTTPS ile bağlanmayı zorlar |
| `Content-Security-Policy` (CSP) | Hangi kaynaklardan betik, görsel, çerçeve yükleneceğini sınırlar; XSS zararını azaltır |
| `X-Content-Type-Options: nosniff` | Tarayıcının içerik türünü tahmin etmesini engeller |
| `X-Frame-Options: DENY` ya da CSP `frame-ancestors` | Sayfanın başka sitelerde çerçeve içine gömülmesini (clickjacking) engeller |

Bunlar tarayıcı tarafında ek koruma sağlar; hataları kapatmaz ama saldırıyı zorlaştırır. Örneğin HSTS'i etkinleştirmeden önce sitenin tüm alt alan adlarının HTTPS'i desteklediğinden emin ol; yanlış kullanımı siteyi erişilemez kılabilir.

### Bir başlığı nasıl denetlersin?

```bash
curl -sI https://siten.example | grep -i -E "strict-transport|content-security|x-content-type|x-frame"
```

DevSecOps'ta bu kontrol otomatikleştirilir: CI hattında yayın sonrası ya da bir test ortamında başlıklar taranır, eksikler bulgu olarak raporlanır (Pipeline bölgesinde DAST ile).

### Sertleştirme alışkanlıkları

1. Varsayılan hesapları ve şifreleri kurulumda değiştir ya da kapat.
2. Gereksiz özellik, port ve örnek uygulamaları kaldır.
3. Geliştirme ve üretim ayarlarını ayır; debug yalnız geliştirmede açık.
4. Yapılandırmayı kodla yönet (IaC) ve değişiklikleri incele.

Güvenlik notu: `curl -I` yalnız yanıt başlıklarını okur, bu yüzden `example.com` ya da kendi sitende kullanımı zararsızdır. Başkasının sitesini yük bindirecek biçimde tekrar tekrar sorgulamak ya da tarayıcı araçlarıyla açık aramak izin gerektirir.
