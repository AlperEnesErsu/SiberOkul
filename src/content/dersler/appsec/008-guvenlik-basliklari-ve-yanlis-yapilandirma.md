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
  - id: appsec-008-s2
    soru: "`X-Content-Type-Options: nosniff` neyi önler?"
    cevap: "Tarayıcının, sunucunun bildirdiği içerik türünü yok sayıp dosyanın içeriğine bakarak türü tahmin etmesini (MIME sniffing) engeller; örneğin yüklenen bir metin dosyasının betik gibi çalıştırılmasını."
  - id: appsec-008-s3
    soru: "Üretim ortamında ayrıntılı hata sayfası ve yığın izi (stack trace) göstermek neden sorundur?"
    cevap: "Dosya yolları, sürüm bilgileri, sorgu parçaları gibi bilgiler saldırgana yol haritası verir. Kullanıcıya genel bir hata mesajı gösterilir, ayrıntı yalnız sunucu günlüğüne yazılır."
  - id: appsec-008-s4
    soru: "Yanlış yapılandırmaya örnek üç şey say."
    cevap: "Değiştirilmemiş varsayılan şifreler, açık bırakılmış hata ayıklama (debug) modu, herkese açık bulut depolama alanı ya da gereksiz açık portlar/servisler. Hepsi kodda değil, ayarlarda olur."
derinDalis:
  - tur: okuma
    baslik: "OWASP HTTP Security Response Headers Cheat Sheet"
    ayrinti: "Hangi başlık ne işe yarar ve önerilen değerler."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html"
  - tur: okuma
    baslik: "OWASP Error Handling Cheat Sheet"
    ayrinti: "Genel hata yanıtı, ayrıntının sunucuda günlüğe yazılması."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html"
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
