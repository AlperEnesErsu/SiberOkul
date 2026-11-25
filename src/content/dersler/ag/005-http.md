---
kimlik: ag-005
baslik: "HTTP"
donem: 2
sira: 5
sure: 30
neden: "Web uygulamaları, API'ler, sağlık kontrolleri, webhook'lar: hepsi HTTP konuşur. Bir DevSecOps mühendisi başlıklara ve durum kodlarına bakarak bir uygulamanın yanlış yapılandırmasını, eksik güvenlik başlığını ya da yönlendirme döngüsünü hızla bulur."
analoji:
  baslik: "HTTP, restoranda sipariş"
  metin: "Garsona 'menüdeki çorbayı getir' (istek), o da 'buyur, çorba' ya da 'çorba bitti' (yanıt) der. Her sipariş ayrı ayrı yapılır; garson önceki siparişini kendiliğinden hatırlamaz. Sınır: gerçekte garson seni tanır, HTTP ise çerez gibi ek mekanizmalar olmadan seni tanımaz (stateless)."
gorev:
  aciklama: "`curl` ile bir HTTP isteği/yanıtını ayrıntılı gör. Sadece okuma amaçlı bir örnek siteye istek atılıyor:"
  komutlar:
    - "curl -v http://example.com -o /dev/null"
    - "curl -sI https://example.com"
    - "curl -s -o /dev/null -w \"%{http_code}\\n\" https://example.com/yok-boyle-bir-sayfa"
    - "curl -sI http://example.com | grep -i -E 'server|content-type'"
  soru: "`curl -v` çıktısında `>` ile başlayan satırlar ile `<` ile başlayan satırlar neyi gösteriyor? Yanıtın ilk satırında hangi durum kodu var?"
  telefon:
    soru: "Bir `curl -sI` çıktısında `HTTP/1.1 301 Moved Permanently` ve `Location: https://example.com/` görüyorsun. Ne anlamalısın?"
    cevap: "İstek yapılan adres kalıcı olarak taşınmış; tarayıcı `Location` başlığındaki adrese gitmeli. Burada büyük olasılıkla HTTP'den HTTPS'e yönlendirme var."
sorular:
  - id: ag-005-s1
    soru: "Bir HTTP isteği hangi parçalardan oluşur?"
    cevap: "Bir istek satırı (metot, yol, sürüm), başlıklar ve gerekiyorsa bir gövde. Örneğin `GET /index.html HTTP/1.1` satırı, ardından `Host: example.com` gibi başlıklar."
    ipucu: "İlk satırda üç şey var: ne yapılacak, nerede, hangi sürüm."
  - id: ag-005-s2
    soru: "GET ile POST arasındaki fark nedir? Parola gibi bir bilgiyi neden URL'ye koymamalısın?"
    cevap: "GET veri okumak, POST veri göndermek içindir. URL; tarayıcı geçmişinde, sunucu loglarında ve yönlendirmelerde saklanabildiği için parola oraya konmamalı."
    ipucu: "Adres çubuğuna yazılan her şey nerelerde kayıt olur?"
  - id: ag-005-s3
    soru: "200, 301, 403, 404 ve 500 durum kodları ne söyler?"
    cevap: "200 başarılı, 301 kalıcı yönlendirme, 403 yetkin yok, 404 kaynak bulunamadı, 500 sunucu tarafında hata. Sınıf mantığı: 2xx başarı, 3xx yönlendirme, 4xx istemci hatası, 5xx sunucu hatası."
    ipucu: "Kodun ilk rakamı sınıfı söyler."
  - id: ag-005-s4
    soru: "Bir yanıtta `Server: Apache/2.4.1` gibi ayrıntılı bir başlık görmek neden bir güvenlik ipucu sayılır?"
    cevap: "Saldırgana kullanılan yazılımın adını ve sürümünü verir; bilinen zafiyetleri aramasını kolaylaştırır. Gereksiz bilgi sızıntısı olduğu için üretimde sürüm bilgisini kısmak iyi pratiktir."
    ipucu: "Yanıt başlığı bilmen gerekenden fazlasını ele veriyor olabilir."
  - id: ag-005-s5
    soru: "Bir API'nin loglarında bir istemcinin kısa sürede binlerce `401` ve ardından tek bir `200` aldığını görüyorsun. Bu ne anlama gelebilir ve ne yaparsın?"
    cevap: "Kaba kuvvetle parola ya da token deneniyor olabilir ve sonunda biri tutmuş olabilir. İlgili hesabı ya da anahtarı hemen iptal ederim, kaynak adresi engellerim, giriş denemelerine sınır (rate limit) koyarım ve o `200` sonrasındaki istekleri inceleyip veri okunup okunmadığına bakarım."
    ipucu: "401 ve sonra 200: kimlik doğrulama tek seferde mi tutmuş görünüyor?"
hizliKontrol:
  - soru: "Bir yanıtta `404` görürsen bu neyi gösterir?"
    secenekler:
      - "Sunucu hatası"
      - "İstenen kaynak bulunamadı"
      - "Kalıcı yönlendirme"
      - "Yetkin yok"
    dogru: 1
    aciklama: "4xx sınıfı istemci tarafı sorunudur; 404 kaynağın bulunamadığını söyler."
    ipucu: "İlk rakamın sınıfını hatırla."
sikHatalar:
  - hata: "Parolayı ya da token'ı URL'de `GET` parametresi olarak göndermek."
    dogrusu: "URL geçmişte, loglarda ve yönlendirmelerde saklanır; gizli veriyi gövdede ya da `Authorization` başlığında gönder."
  - hata: "401 ile 403'ü aynı sanmak."
    dogrusu: "401 kimliğin yok ya da geçersiz, 403 kimliğin var ama yetkin yok demektir."
terimler:
  - "HTTP"
  - "TCP"
  - "TLS"
sema:
  baslik: "Bir HTTP isteğinin akışı"
  adimlar:
    - etiket: "İstek"
      aciklama: "İstemci metot, yol ve başlıkları yollar."
    - etiket: "İşleme"
      aciklama: "Sunucu isteği okur ve işler."
    - etiket: "Yanıt"
      aciklama: "Sunucu durum kodu, başlıklar ve gövdeyi döner."
    - etiket: "Kapanış"
      aciklama: "Bağlantı kapanır ya da yeniden kullanılır."
derinDalis:
  - tur: okuma
    baslik: "MDN: HTTP'ye genel bakış"
    ayrinti: "İstek ve yanıt mesajlarının yapısı, örneklerle."
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview"
  - tur: okuma
    baslik: "MDN: HTTP yanıt durum kodları"
    ayrinti: "Beş durum kodu sınıfı ve her kodun açıklaması."
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
---

**HTTP** (HyperText Transfer Protocol) web'in dilidir. TCP üzerinde çalışır (ag-003'ten hatırla; varsayılan port 80, HTTPS için 443) ve çok basit bir fikre dayanır: istemci **istek** yollar, sunucu **yanıt** verir.

### İstek

HTTP/1.1'de bir istek insanın okuyabileceği düz metindir:

```
GET /index.html HTTP/1.1
Host: example.com
User-Agent: curl/8.5.0
Accept: */*
```

İlk satırda **metot** (ne yapmak istiyorsun), **yol** (hangi kaynak) ve sürüm vardır. Altındaki satırlar **başlıklardır** (headers): isteğe dair ek bilgiler. Gerekirse bir **gövde** (body) olur, örneğin bir formun verisi.

Başlıca metotlar:

| Metot | Anlamı |
|---|---|
| GET | Bir kaynağı oku |
| POST | Veri gönder, yeni kaynak oluştur |
| PUT | Kaynağı değiştir |
| DELETE | Kaynağı sil |
| HEAD | Yalnız başlıkları getir |

### Yanıt

```
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1256
```

İlk satırda **durum kodu** (status code) vardır. Beş sınıf:

- **1xx**: bilgi
- **2xx**: başarı (200 OK)
- **3xx**: yönlendirme (301 kalıcı, 302 geçici)
- **4xx**: istemci hatası (400 hatalı istek, 401 kimlik yok, 403 yasak, 404 bulunamadı)
- **5xx**: sunucu hatası (500 genel hata, 502/503 arka uç sorunu)

Bu sınıfı bilmek teşhiste çok işe yarar: 4xx görüyorsan genelde isteği, 5xx görüyorsan sunucuyu incelersin.

### Başlıklar

Güvenlik açısından önemli başlıklar:

- `Host`: Hangi siteye istek atıldığı (bir IP'de birden çok site olabilir).
- `Set-Cookie` / `Cookie`: Oturum bilgisini taşır.
- `Authorization`: Kimlik bilgisi ya da token.
- `Location`: Yönlendirme hedefi.
- `Strict-Transport-Security`: Tarayıcıya "bu siteye hep HTTPS ile gel" der (appsec bölgesinde işleyeceğiz).

### Durumsuzluk

HTTP **durumsuzdur** (stateless): sunucu her isteği bağımsız sayar. Giriş yaptığını hatırlaması için çerez ya da token gibi bir mekanizma kullanılır; bunlar her istekte başlıkla gönderilir. Bu yüzden bir çerezin çalınması, kullanıcının oturumunun çalınması demektir.

### curl ile görmek

`curl -v` gönderdiğin satırları `>`, aldığın satırları `<` işaretiyle gösterir. `-I` yalnız başlıkları ister. `-o /dev/null` gövdeyi ekrana basmaz. Bu üç bayrak, günlük HTTP teşhisinin çoğunu karşılar.

Güvenlik notu: Düz HTTP'de her şey (başlıklar, çerezler, parola) yoldaki herkes tarafından okunabilir. Bu yüzden bir sonraki ders olan TLS ile şifreleme standart hale geldi.
