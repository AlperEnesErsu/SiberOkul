---
kimlik: bulut-010
baslik: "Bulutta olay müdahalesi"
donem: 8
sira: 10
sure: 35
neden: "Sızan bir erişim anahtarı, bulutta en sık karşılaşılan olay senaryosudur. Doğru sırada, soğukkanlı atılan adımlar zararı saatlerle ölçülen farklar kadar azaltır. Müdahale planın yoksa olay sırasında plan yaparsın; en kötü anda."
analoji:
  baslik: "Çalınan kredi kartı"
  metin: "Kartın çalındığını fark edince önce kartı bloke ettirirsin, sonra ekstreye bakıp hangi harcamaların sana ait olmadığını bulursun, sonra yeni kart alırsın ve bankayla süreci kapatırsın. Önce blokaj, sonra inceleme; tersi değil. Sınır: bulutta çalınan kimlikle açılmış 'yeni kartlar' (yeni kullanıcılar, anahtarlar) olabilir; bunları da bulman gerekir."
gorev:
  aciklama: "Bulutta hiçbir şey çalıştırmaz. `jq` gerekir (`sudo apt install -y jq`). Sızdığı varsayılan bir erişim anahtarının (sahte) CloudTrail kayıtlarını yazıp, anahtarın ne yaptığını çıkaracaksın."
  komutlar:
    - |-
      cat > /tmp/sizinti.json <<'EOF'
      {"Records":[
       {"eventTime":"2026-11-21T02:00:05Z","eventName":"GetCallerIdentity","userIdentity":{"accessKeyId":"AKIAEXAMPLE0000000001","userName":"ci-bot"},"sourceIPAddress":"198.51.100.7"},
       {"eventTime":"2026-11-21T02:00:40Z","eventName":"ListBuckets","userIdentity":{"accessKeyId":"AKIAEXAMPLE0000000001","userName":"ci-bot"},"sourceIPAddress":"198.51.100.7"},
       {"eventTime":"2026-11-21T02:03:10Z","eventName":"CreateUser","userIdentity":{"accessKeyId":"AKIAEXAMPLE0000000001","userName":"ci-bot"},"sourceIPAddress":"198.51.100.7"},
       {"eventTime":"2026-11-21T02:03:30Z","eventName":"CreateAccessKey","userIdentity":{"accessKeyId":"AKIAEXAMPLE0000000001","userName":"ci-bot"},"sourceIPAddress":"198.51.100.7"},
       {"eventTime":"2026-11-20T10:00:00Z","eventName":"PutObject","userIdentity":{"accessKeyId":"AKIAEXAMPLE0000000009","userName":"ayse"},"sourceIPAddress":"203.0.113.10"}
      ]}
      EOF
    - jq -r '.Records[] | select(.userIdentity.accessKeyId=="AKIAEXAMPLE0000000001") | "\(.eventTime) \(.eventName) \(.sourceIPAddress)"' /tmp/sizinti.json | sort
    - jq -r '.Records[] | select(.userIdentity.accessKeyId=="AKIAEXAMPLE0000000001") | .eventName' /tmp/sizinti.json | grep -E '^(Create|Attach|Put|Delete|Stop)' 
    - aws iam update-access-key help | sed -n '1,25p'
  soru: "Saldırgan anahtarla hangi 'kalıcılık' adımlarını attı? Anahtarı devre dışı bırakmakla yetinmek neden eksik olurdu, başka neleri temizlemelisin?"
  telefon:
    soru: "Sızan bir erişim anahtarını fark ettin. Silmeden önce neden önce devre dışı bırakıp (inactive) kayıtlara bakmak daha iyi olabilir?"
    cevap: "Devre dışı bırakmak saldırganı hemen durdurur ama anahtarın kimliğini ve kayıtlarını korur; hangi kimliğin ne yaptığını araştırırken referans kaybolmaz. Gerekirse sonra silinir."
sorular:
  - id: bulut-010-s1
    soru: "Sızan erişim anahtarı için ilk adım nedir?"
    cevap: "Anahtarı hemen devre dışı bırakmak (iptal etmek) ve ilgili kişilere haber vermek. Sonra inceleme ve temizlik gelir. Önce kanamayı durdur."
    ipucu: "Silmek mi, devre dışı bırakmak mı kanıtı korur?"
  - id: bulut-010-s2
    soru: "Anahtarı iptal ettikten sonra neden CloudTrail'e bakmalısın?"
    cevap: "Saldırganın o anahtarla ne yaptığını görmek için: hangi kaynaklara dokundu, yeni kullanıcı ya da anahtar oluşturdu mu, veri okudu mu. Aksi halde arka kapılar kalır."
    ipucu: "İptalden sonra 'ne yaptı' sorusunun cevabı hangi kayıtta?"
  - id: bulut-010-s3
    soru: "Saldırgan kendine yeni bir IAM kullanıcısı ya da anahtarı oluşturduysa ne yaparsın?"
    cevap: "Bunları listeler, yetkisiz olanları devre dışı bırakır ve siler, bağlı politikaları incelersin. Üstlenilmiş rol oturumları varsa onları da geçersiz kılarsın. Kalıcılık bırakıldıysa tek anahtarı değiştirmek yetmez."
    ipucu: "Saldırganın bıraktığı kalıcılık izlerini düşün."
  - id: bulut-010-s4
    soru: "Olay sonrası inceleme (post-incident review) neden suçlu aramaz?"
    cevap: "Amaç aynı olayın tekrarını önlemektir: anahtar nasıl sızdı, neden daha önce fark edilmedi, hangi kontrol eksikti. Suçlu aramak insanları gerçeği saklamaya iter."
    ipucu: "İncelemenin amacı kişi mi, süreç mi?"
  - id: bulut-010-s5
    soru: "Bir geliştirici erişim anahtarını yanlışlıkla public repoya yükledi; AWS bir uyarı gönderdi. Sırayla ne yaparsın?"
    cevap: "Anahtarı devre dışı bırakır, CloudTrail'de `accessKeyId`'ye göre ne yapıldığına bakarım. Saldırganın açtığı kullanıcı, anahtar ve kaynakları temizler, yeni kimlik bilgisini rol ile veririm. Zaman çizelgesini tutar, sonunda kısa inceleme yaparım."
    ipucu: "Önce sınırla, sonra kapsamı belirle."
derinDalis:
  - tur: okuma
    baslik: "NIST SP 800-61 Rev. 3 (Nisan 2025)"
    ayrinti: "Olay müdahalesinin güncel NIST rehberi (CSF 2.0 ile hizalı). Hazırlık, tespit, sınırlama, giderme ve olay sonrası öğrenme iskeleti bulutta da geçerli."
    url: "https://csrc.nist.gov/pubs/sp/800/61/r3/final"
hizliKontrol:
  - soru: "Sızan anahtar için sınırlama aşamasında ne yapılır?"
    secenekler: ["Anahtar hemen silinir ve kayıtlar temizlenir","Anahtar devre dışı bırakılır, kanıt korunur","Hiçbir şey yapılmaz, izlenir","Kök hesabın parolası paylaşılır"]
    dogru: 1
    aciklama: "Silme yerine devre dışı bırakmak kimlik ve kayıt referansını korur."
    ipucu: "Sırayı hatırla: sınırla, kapsam, temizle, kurtar, öğren."
sikHatalar:
  - hata: "Anahtarı silip olayı kapatmak."
    dogrusu: "Kapsamı belirle: anahtar neler yaptı, hangi kalıcılık izlerini bıraktı?"
  - hata: "Olay sırasında ne yaptığını yazmamak."
    dogrusu: "Zaman çizelgesi tut; hem inceleme hem öğrenme için değerlidir."
  - hata: "İncelemede kişiyi suçlamak."
    dogrusu: "Süreç ve kontroller aranır: hangi halka yakalayabilirdi?"
sema:
  baslik: "Bulutta olay müdahalesi akışı"
  adimlar:
    - { etiket: "Sınırla", aciklama: "Anahtarı devre dışı bırak, oturumları iptal et, kanıtı koru." }
    - { etiket: "Kapsam", aciklama: "CloudTrail'de kimliğin eylemlerini ara." }
    - { etiket: "Temizle", aciklama: "Saldırganın kullanıcı, anahtar ve kaynaklarını kaldır." }
    - { etiket: "Kurtar", aciklama: "Gerekirse temiz yedekten dön, izleyerek aç." }
    - { etiket: "Öğren", aciklama: "Kısa inceleme yap, bulguları işe çevir." }
terimler:
  - "Olay müdahalesi"
  - "Erişim anahtarı"
  - "CloudTrail"
---

Olay müdahalesi, sakin kalıp önceden belirlenmiş adımları sırayla yapma işidir. Bulutta en sık görülen senaryo: **bir erişim anahtarı sızdı.** Adım adım ilerleyelim.

### 1. Sınırla

Hedef, saldırganın erişimini hemen kesmektir.

- Anahtarı **devre dışı bırak** (silme değil). Böylece kimlik ve kayıt referansı kalır.
- Kimlik bir rol oturumu ise etkin oturumları iptal et.
- Ortamı izole etmen gerekiyorsa, etkilenen kaynağı güvenlik grubuyla kapat; kapatmadan önce kanıtı (disk görüntüsü, log) koru.

### 2. Kapsamı belirle

Kayıtlara bak: bu anahtar ne yaptı, ne zaman, hangi IP'den? CloudTrail'de `accessKeyId` alanına göre filtrele. Şunlar arama listendir:

- Kalıcılık: `CreateUser`, `CreateAccessKey`, `AttachUserPolicy`, rol güven politikası değişikliği.
- Veri erişimi: yoğun `GetObject`, `ListBuckets`.
- Kaynak oluşturma: tanımadığın bölgede sunucular (kripto madenciliği tipik).
- Kayıt susturma: `StopLogging`, `DeleteTrail`.

### 3. Temizle

Saldırganın bıraktığı **her şeyi** kaldır: yeni kullanıcılar, anahtarlar, roller, tanımadığın kaynaklar. Sızan anahtarın yerine yenisini üret ve uygulamayı güncelle; mümkünse anahtar yerine rol kullanımına geç. Etkilenen sırları (parola, token) döndür.

### 4. Kurtar

Gerekirse temiz yedekten geri dön (11. ders). Sistemi izleyerek yeniden aç.

### 5. Öğren

Olay sonrası kısa bir inceleme yap: anahtar nasıl sızdı (repo mu, log mu, laptop mu), neden daha önce fark edilmedi, hangi kural ya da kontrol bunu yakalardı. Çıktıyı somut işlere çevir: sır taraması, anahtar yaşı alarmı, kök kullanımı uyarısı.

### Zaman çizelgesi tut

Olay sırasında ne yaptığını ve ne zaman yaptığını yaz. Hem inceleme için, hem de sonradan neyin işe yaradığını görmek için çok değerlidir.

### Önceden hazırlık

Müdahalenin yarısı olaydan önce yapılır: CloudTrail açık, uyarılar kurulu, kimin kimi arayacağı yazılı, yetkili bir kişinin "anahtarı kapat" izni tanımlı. Hazırlıksız bir ekip aynı adımları iki kat yavaş atar.

Güvenlik notu: Gerçek bir olayda kanıtı değiştirmemeye dikkat et. Ve hesap üzerinde kesin bir şüphe varsa kurumun güvenlik ekibine ve bulut sağlayıcının destek kanalına haber ver.
