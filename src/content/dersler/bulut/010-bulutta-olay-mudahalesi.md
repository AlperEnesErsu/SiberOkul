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
  - id: bulut-010-s2
    soru: "Anahtarı iptal ettikten sonra neden CloudTrail'e bakmalısın?"
    cevap: "Saldırganın o anahtarla ne yaptığını görmek için: hangi kaynaklara dokundu, yeni kullanıcı ya da anahtar oluşturdu mu, veri okudu mu. Aksi halde arka kapılar kalır."
  - id: bulut-010-s3
    soru: "Saldırgan kendine yeni bir IAM kullanıcısı ya da anahtarı oluşturduysa ne yaparsın?"
    cevap: "Bunları listeler, yetkisiz olanları devre dışı bırakır ve siler, bağlı politikaları incelersin. Üstlenilmiş rol oturumları varsa onları da geçersiz kılarsın. Kalıcılık bırakıldıysa tek anahtarı değiştirmek yetmez."
  - id: bulut-010-s4
    soru: "Olay sonrası inceleme (post-incident review) neden suçlu aramaz?"
    cevap: "Amaç aynı olayın tekrarını önlemektir: anahtar nasıl sızdı, neden daha önce fark edilmedi, hangi kontrol eksikti. Suçlu aramak insanları gerçeği saklamaya iter."
derinDalis:
  - tur: okuma
    baslik: "NIST SP 800-61: Computer Security Incident Handling Guide"
    ayrinti: "Hazırlık, tespit, sınırlama, giderme ve olay sonrası öğrenme aşamaları; bulutta da aynı iskelet geçerli."
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
