---
kimlik: appsec-005
baslik: "CSRF ve SameSite"
donem: 5
sira: 5
sure: 30
neden: "Tarayıcı, bir siteye giden her isteğe o siteye ait çerezi kendiliğinden ekler; isteği kimin başlattığına bakmaz. Bu davranış CSRF'nin kaynağıdır. DevSecOps'ta çerez ayarlarını ve token mekanizmasını incelemen, bu sınıfı kapatmanın en kısa yoludur."
analoji:
  baslik: "İmzalı çek defteri"
  metin: "Cebindeki imzalı çek defterini bir yabancı sana 'şu kâğıdı bana ver' diye kandırıp doldursa, banka imzayı görüp ödemeyi yapar. CSRF'de tarayıcı çek defterini (çerezi) otomatik sunar. Token ise çekin üzerine yalnız senin bildiğin bir kod yazılmasıdır. Sınırı: gerçek hayatta imza taklit edilir, CSRF'de imza gerçektir, sahte olan isteğin niyetidir."
gorev:
  aciklama: "Yerel bir Python sunucusu başlat; çerezi `SameSite` ve `HttpOnly` ile gönderen bir yanıtı `curl` ile incele. Sunucu yalnız 127.0.0.1'de dinler ve iş bitince kapatılır."
  komutlar:
    - "mkdir -p ~/appsec && cd ~/appsec"
    - |
      cat > cerez_sunucu.py <<'EOF'
      from http.server import BaseHTTPRequestHandler, HTTPServer

      class H(BaseHTTPRequestHandler):
          def do_GET(self):
              self.send_response(200)
              self.send_header("Set-Cookie", "oturum=abc123; HttpOnly; SameSite=Lax; Path=/")
              self.send_header("Content-Type", "text/plain; charset=utf-8")
              self.end_headers()
              self.wfile.write(b"merhaba")

      HTTPServer(("127.0.0.1", 8000), H).serve_forever()
      EOF
    - "python3 cerez_sunucu.py & sleep 1"
    - "curl -i http://127.0.0.1:8000/"
    - "kill %1"
  soru: "`Set-Cookie` satırında `HttpOnly` ve `SameSite=Lax` ne yapar? Eksik olan `Secure` neden gerçek bir sitede olmalı?"
  telefon:
    soru: "Banka sitesi `POST /havale` isteğini yalnız çerezle doğruluyor, token yok, çerez `SameSite` belirtmiyor. Kötü bir sitedeki gizli form seni nasıl etkiler ve hangi iki önlem alınmalı?"
    cevap: "Kötü sitedeki form, banka adresine otomatik POST gönderir; tarayıcı çerezi ekler, havale gerçekleşebilir. Önlem: CSRF token (formda sunucunun doğrulayacağı rastgele değer) ve çerezde SameSite=Lax ya da Strict."
sorular:
  - id: appsec-005-s1
    soru: "CSRF saldırısı nasıl işler?"
    cevap: "Kullanıcı bir sitede oturum açıkken kötü bir sayfayı ziyaret eder. Kötü sayfa, hedef siteye bir istek (ör. form gönderimi) tetikler. Tarayıcı oturum çerezini ekler, sunucu isteği meşru sanar ve işlemi yapar."
    ipucu: "Tarayıcı, çerezi isteği kimin başlattığına bakmadan eklerse ne olur?"
  - id: appsec-005-s2
    soru: "CSRF token nasıl korur?"
    cevap: "Sunucu, oturuma bağlı rastgele ve tahmin edilemez bir değeri forma ekler ve istekte geri bekler. Saldırgan başka bir sitede bu değeri okuyamadığı için geçerli bir istek hazırlayamaz."
    ipucu: "Token'ı saldırganın başka siteden bilememesinin sonucunu düşün."
  - id: appsec-005-s3
    soru: "`SameSite=Lax` ve `Strict` arasındaki fark nedir?"
    cevap: "Strict: çerez, başka bir siteden gelen hiçbir istekte gönderilmez. Lax: çerez üst düzey, güvenli gezintilerde (ör. bağlantıya tıklama) gönderilir ama çapraz site POST ve gömülü isteklerde gönderilmez. Her ikisi de CSRF'yi azaltır."
    ipucu: "İki değerden hangisi başka siteden gelen bağlantı tıklamasında çerezi gönderir?"
  - id: appsec-005-s4
    soru: "SameSite varken neden yine de CSRF token kullanılır?"
    cevap: "SameSite bir ek savunma katmanıdır; OWASP, çoğu kurulumda uygun bir CSRF savunmasının yerini tutmadığını belirtir. Ayrıca aynı site içinde başka bir alt alan adı ele geçirilirse ya da XSS varsa SameSite yetmeyebilir."
    ipucu: "SameSite'ın kapsamadığı durumları ve eski tarayıcıları düşün."
  - id: appsec-005-s5
    soru: Bir ürün yöneticisi 'SameSite=Lax çerez ayarını açtık, artık CSRF token koduna gerek yok, silelim' diyor. Ne cevap verirsin?
    cevap: "SameSite güçlü bir ek katmandır ama tek başına yeterli sayılmaz: tarayıcı desteği ve davranış farkları, aynı site içindeki alt alan adları ve bazı istekler (ör. üst düzey GET gezintisi) kapsam dışında kalabilir. Durumu değiştiren isteklerde token doğrulamasını koruyup SameSite'ı ikinci katman olarak bırakırsın."
    ipucu: Tek savunma katmanı yetmediğinde savunma derinliği ilkesini hatırla.
derinDalis:
  - tur: okuma
    baslik: "OWASP CSRF Prevention Cheat Sheet"
    ayrinti: "Token desenleri, SameSite'ın rolü, XSS'in CSRF savunmalarını nasıl boşa çıkardığı."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html"
hizliKontrol:
  - soru: CSRF token neden CSRF'yi engeller?
    secenekler:
      - Çerezi şifreler
      - Saldırganın başka siteden bilemeyeceği bir değeri istekte arar
      - Parolayı uzatır
      - İsteği yalnız HTTPS'e yönlendirir
    dogru: 1
    aciklama: Doğru token olmayan istek sunucuda reddedilir; saldırgan bu değeri bilemez.
    ipucu: Saldırganın elinde olmayan şeyi düşün.
sikHatalar:
  - hata: Durumu değiştiren işlemi (silme, havale) GET isteğiyle yaptırmak.
    dogrusu: Durumu değiştiren işlemler POST/PUT/DELETE olmalı ve token ile doğrulanmalı.
  - hata: "'Çerez var, o halde istek kullanıcıdan geliyor' diye düşünmek."
    dogrusu: Tarayıcı çerezi başka sitenin isteğine de ekleyebilir; kullanıcının niyetini token kanıtlar.
sema:
  baslik: CSRF isteği nasıl akar?
  adimlar:
    - etiket: Giriş
      aciklama: Kullanıcı bankada oturum açar; tarayıcı oturum çerezini saklar.
    - etiket: Tuzak
      aciklama: Kullanıcı başka bir siteyi açar; sayfada gizli bir form vardır.
    - etiket: İstek
      aciklama: Form, bankanın havale adresine otomatik olarak gönderilir.
    - etiket: Çerez
      aciklama: Tarayıcı bankaya giden isteğe oturum çerezini kendiliğinden ekler.
    - etiket: Sonuç
      aciklama: Token yoksa banka isteği meşru sayar ve havaleyi yapar.
terimler:
  - CSRF
  - CSRF token
  - SameSite
---

**CSRF** (cross-site request forgery, siteler arası istek sahteciliği), tarayıcının çerezleri kendiliğinden göndermesini kötüye kullanır. Sen bir bankada oturum açıkken kötü bir sayfa açarsan, o sayfa bankaya senin adına istek gönderebilir. Banka yalnız çereze bakıyorsa isteği gerçek sanır.

Önemli ayrım: saldırgan yanıtı **okuyamaz**, yalnız **durumu değiştiren bir istek** tetikler (havale, parola değiştirme, e-posta güncelleme). Bu yüzden CSRF, `GET` ile bile işlem yapan uygulamalarda ve `POST` formlarında tehlikelidir.

### Savunma 1: CSRF token

Sunucu her oturum için rastgele bir değer üretir, forma gizli alan olarak koyar:

```html
<input type="hidden" name="csrf_token" value="b2f7...rastgele">
```

İstek geldiğinde değer doğrulanır. Kötü site bu değeri bilemez (başka bir sitenin sayfasını okuyamaz, tarayıcı buna izin vermez). Modern çerçeveler (Django, Rails, Spring) bunu yerleşik olarak sunar; açık bırakmak yerine **etkin tut**.

### Savunma 2: SameSite çerezleri

```
Set-Cookie: oturum=...; Secure; HttpOnly; SameSite=Lax
```

`SameSite` tarayıcıya çerezi hangi isteklerde göndereceğini söyler:

| Değer | Davranış |
|---|---|
| `Strict` | Yalnız aynı siteden gelen isteklerde gönderir |
| `Lax` | Başka siteden yalnız güvenli üst düzey gezintilerde gönderir |
| `None` | Her yerde gönderir; `Secure` zorunlu, genelde gereksiz risk |

`Lax`, çoğu modern tarayıcıda varsayılana yakın bir davranıştır, ama davranışa güvenmek yerine açıkça belirt.

### SameSite yetmez, neden?

- Aynı sitenin başka bir alt alan adı ya da sayfası ele geçirilirse "aynı site" kuralı atlatılır.
- **XSS varsa** (ders 4), saldırganın betiği zaten senin sitenin içinden istek gönderir; token'ı okur ve kullanır. XSS, CSRF savunmalarını boşa çıkarır.
- Durumu değiştiren işlemleri `GET` ile yapma. `POST` kullanmak tek başına koruma değildir.

### Kontrol listesi

1. Durumu değiştiren her istekte token doğrulanıyor mu?
2. Oturum çerezinde `Secure`, `HttpOnly`, `SameSite` var mı?
3. Önemli işlemlerde (parola değişikliği, para transferi) yeniden doğrulama isteniyor mu?

Güvenlik notu: Bu dersteki sunucu yalnız `127.0.0.1` üzerinde, kısa süreliğine çalışır. Sunucuyu `0.0.0.0` üzerinde açıp bırakmak, aynı ağdaki herkesin erişimine kapı açar.
