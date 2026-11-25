---
kimlik: pipeline-006
baslik: "DAST"
donem: 6
sira: 6
sure: 35
neden: "Kod temiz görünse bile çalışan uygulama eksik başlık, açık yönetim sayfası ya da yanlış yapılandırma yüzünden savunmasız olabilir. DAST, uygulamaya dışarıdan bir saldırganın gözüyle bakar ve SAST'ın göremediği çalışma zamanı sorunlarını yakalar."
analoji:
  baslik: "Evin dışından kapı pencere denemek"
  metin: "SAST evin planına bakmaktır, DAST ise dışarı çıkıp kapıları ve pencereleri tek tek denemektir. Planda kilit görünür ama kapı aslında kapanmıyor olabilir. Sınırı: yalnız dışarıdan erişebildiğin kapıları denersin; içerideki gizli odaları, yani kodun hiç çalışmayan yollarını göremezsin."
gorev:
  aciklama: "Kendi bilgisayarında basit bir web sunucusu başlatıp ZAP'ın baseline taramasını yalnız ona karşı çalıştıracaksın. Docker gerekir (Docker Desktop WSL entegrasyonu açık olmalı). Tarama sadece senin makinendeki sunucuya gider. Başkasının sitesini izinsiz asla tarama. Not: `--bind 0.0.0.0` sunucuyu ZAP container'ının erişebilmesi için bütün ağ arayüzlerine açar, yani aynı ağdaki başka cihazlar da kısa süreliğine görebilir; klasörde gizli bir şey tutma ve işin bitince sunucuyu kapat."
  komutlar:
    - "mkdir -p /tmp/dast && cd /tmp/dast && echo '<h1>deneme</h1>' > index.html"
    - "python3 -m http.server 8000 --bind 0.0.0.0 > /dev/null 2>&1 &"
    - "docker pull ghcr.io/zaproxy/zaproxy:stable"
    - "docker run --rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:8000"
    - "kill %1"
  soru: "ZAP baseline taraması 'eksik güvenlik başlığı' gibi bulgular verdi ama SQL injection denemedi. Bunun nedeni ne?"
  telefon:
    soru: "Bir ekip DAST'ı doğrudan canlı üretim sitesinde çalıştırmak istiyor. Hangi iki riski ve hangi önlemi söylersin?"
    cevap: "Risk: aktif tarama istek yağdırıp siteyi yavaşlatabilir ya da veri bozabilir; ayrıca izin yoksa yasal sorun doğar. Önlem: tarama ayrı bir test/staging ortamında, sahte veriyle ve yazılı izinle yapılır; üretimde yalnız pasif tarama düşünülür."
sorular:
  - id: pipeline-006-s1
    soru: "DAST ile SAST'ın en temel farkı nedir ve birbirlerinin yerini tutabilir mi?"
    cevap: "SAST kodu çalıştırmadan okur, DAST çalışan uygulamaya istek gönderir. Tutmaz: SAST kod içi kalıpları, DAST yapılandırma ve çalışma zamanı sorunlarını bulur. Biri diğerinin kaçırdığını yakalayabilir."
  - id: pipeline-006-s2
    soru: "Pasif tarama ile aktif tarama arasındaki fark nedir?"
    cevap: "Pasif tarama normal trafiğe bakıp yanıtları inceler (eksik başlık gibi), saldırı denemez. Aktif tarama zararlı girdiler gönderip uygulamanın tepkisine bakar; daha çok bulur ama risklidir, bu yüzden yalnız izinli test ortamında yapılır."
  - id: pipeline-006-s3
    soru: "DAST'ı CI'da çalıştırmak için uygulamanın neye ihtiyacı vardır?"
    cevap: "Çalışan bir örneğe: pipeline uygulamayı bir test ortamında (ör. container olarak) ayağa kaldırır, sonra taramayı o adrese yöneltir, bitince kapatır. Sahte veri ve ayrı ortam kullanılır."
  - id: pipeline-006-s4
    soru: "Bir tarama aracını bir siteye karşı çalıştırmadan önce hangi koşul sağlanmalıdır?"
    cevap: "Hedefin sahibinden açık izin. İzinsiz tarama çoğu ülkede yasal sorun yaratabilir. Kendi makinen ya da senin işlettiğin test ortamı güvenlidir."
derinDalis:
  - tur: lab
    baslik: "ZAP baseline taraması"
    ayrinti: "Docker ile `zap-baseline.py` kullanımı, ne yaptığı (spider + pasif tarama) ve CI'da çalıştırma örnekleri."
    url: "https://www.zaproxy.org/docs/docker/baseline-scan/"
---

**DAST** (Dynamic Application Security Testing), çalışmakta olan uygulamaya dışarıdan istek gönderip yanıtlarını inceleyerek açık arar. Kaynak kodu görmez; bir saldırganın göreceği şeyi görür.

### Ne bulur?

- Eksik ya da zayıf **güvenlik başlıkları** (appsec-008'deki HSTS, CSP gibi).
- Açıkta kalmış yönetim sayfaları, dizin listeleri, ayrıntılı hata mesajları.
- Yansıyan XSS ya da bazı injection biçimleri (aktif taramada).
- Çerezlerin `Secure` ve `HttpOnly` bayraklarının eksikliği.

Bulamadıkları: tarayıcının hiç ulaşamadığı kod yolları, giriş yapmadan erişilemeyen sayfalardaki iş mantığı hataları, yetki aşımı (IDOR) gibi uygulamaya özgü sorunlar.

### OWASP ZAP

**ZAP** (Zed Attack Proxy), OWASP'ın açık kaynak DAST aracıdır. İki ana modu pipeline için önemlidir:

- **Baseline scan:** Örümcek (spider) siteyi kısa süre gezer, sonra pasif kurallar yanıtlara bakar. Saldırı denemez, birkaç dakikada biter. CI için uygundur.
- **Full scan:** Aktif saldırı kuralları da çalışır. Daha derin ama yavaş ve riskli; ayrı test ortamı ister.

Docker ile çalıştırmak kurulum derdini ortadan kaldırır: araç container içinde gelir.

### Pipeline'a yerleştirmek

1. Build edilen imajı test ortamında ayağa kaldır.
2. ZAP baseline'ı o adrese yönelt.
3. Bulguları rapor (HTML ya da SARIF) olarak sakla; kritik olanlarda job'ı durdur.
4. Test ortamını kapat.

DAST yavaştır, o yüzden her commit yerine PR birleşmeden önce ya da geceleyin çalıştırmak yaygındır. SAST ve SCA hızlıdır, her commit'te koşar.

### Etik ve hukuk

Tarama bir sistemi yoklamaktır. **Yalnız kendi ya da yazılı izin aldığın sistemlere** yönelt. ag-012'de gördüğün etik çerçeve burada da geçerli: izin, kapsam ve zararsızlık. Aktif taramayı canlı sistemde çalıştırmak veri bozabilir.

### Yanlış pozitifler

DAST yanıtlara bakarak tahmin yürüttüğü için yanlış pozitif üretir. Örneğin eksik bir başlık, sayfa zaten hassas bir şey içermiyorsa önemsizdir. Bulguları SAST'ta olduğu gibi gerekçeyle sınıflandır ve kasıtlı istisnaları kayda al.

**Güvenlik notu:** Tarama aracı da bir saldırı aracıdır. İzinsiz hedefe karşı çalıştırmak suçtur; her taramadan önce hedefin senin olduğundan emin ol.
