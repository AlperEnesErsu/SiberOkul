---
kimlik: bulut-007
baslik: "Denetim kayıtları"
donem: 8
sira: 7
sure: 30
neden: "Bir olay olduğunda ilk sorular hep aynıdır: kim, ne yaptı, ne zaman, nereden? Bulutta bu soruların cevabı denetim kaydında yatar. Kaydı hiç açmamışsan olaydan sonra yapabileceğin tek şey tahmin yürütmektir."
analoji:
  baslik: "Bina giriş kamerası ve kayıt defteri"
  metin: "Her kapı geçişini kaydeden defter, kim girdi, hangi kapıdan, saat kaçta bilgisini tutar. Defter olmadan hırsızlığın olduğunu geç fark edersin, kimin yaptığını hiç bilemezsin. Sınır: defteri hırsızın erişebildiği yerde tutarsan sayfaları yırtar; kayıtlar ayrı ve korumalı yerde durmalıdır."
gorev:
  aciklama: "Bulutta log açmaz. `jq` gerekir (`sudo apt install -y jq`). Gerçek CloudTrail dosyalarının biçimine benzeyen küçük bir örnek yazıp içinde şüpheli giriş denemelerini arayacaksın."
  komutlar:
    - |-
      cat > /tmp/trail.json <<'EOF'
      {"Records":[
       {"eventTime":"2026-11-20T09:01:10Z","eventSource":"signin.amazonaws.com","eventName":"ConsoleLogin","userIdentity":{"type":"IAMUser","userName":"ayse"},"sourceIPAddress":"203.0.113.10","responseElements":{"ConsoleLogin":"Success"}},
       {"eventTime":"2026-11-20T03:12:01Z","eventSource":"signin.amazonaws.com","eventName":"ConsoleLogin","userIdentity":{"type":"IAMUser","userName":"ci-bot"},"sourceIPAddress":"198.51.100.7","responseElements":{"ConsoleLogin":"Failure"}},
       {"eventTime":"2026-11-20T03:12:09Z","eventSource":"signin.amazonaws.com","eventName":"ConsoleLogin","userIdentity":{"type":"IAMUser","userName":"ci-bot"},"sourceIPAddress":"198.51.100.7","responseElements":{"ConsoleLogin":"Failure"}},
       {"eventTime":"2026-11-20T03:30:44Z","eventSource":"iam.amazonaws.com","eventName":"CreateUser","userIdentity":{"type":"IAMUser","userName":"ci-bot"},"sourceIPAddress":"198.51.100.7"}
      ]}
      EOF
    - jq -r '.Records[] | select(.eventName=="ConsoleLogin" and .responseElements.ConsoleLogin=="Failure") | "\(.eventTime) \(.userIdentity.userName) \(.sourceIPAddress)"' /tmp/trail.json
    - jq -r '.Records[] | select(.eventSource=="iam.amazonaws.com") | "\(.eventTime) \(.eventName) by \(.userIdentity.userName) from \(.sourceIPAddress)"' /tmp/trail.json
    - aws cloudtrail lookup-events help | sed -n '1,25p'
  soru: "Sırasıyla ne olmuş olabilir? Başarısız girişlerle IAM kullanıcı oluşturma olayı arasında bir ilişki kurabiliyor musun, ve bu hikaye hangi iki kayıt türünün birleşmesinden çıktı?"
  telefon:
    soru: "Bir sabah hesapta tanımadığın bir IAM kullanıcısı görüyorsun. Kimin oluşturduğunu nereden bulursun?"
    cevap: "CloudTrail'de `CreateUser` olayına bakarsın. Kaydın `userIdentity` alanı hangi kimliğin, `sourceIPAddress` hangi IP'den, `eventTime` ne zaman yaptığını söyler."
sorular:
  - id: bulut-007-s1
    soru: "CloudTrail neyi kaydeder?"
    cevap: "Hesapta bir kullanıcı, rol ya da servis tarafından yapılan eylemleri (konsol, CLI, SDK ve API çağrıları). Kayıt kim, ne yaptı, hangi kaynakta, ne zaman ve hangi IP'den bilgisini içerir."
    ipucu: "Kimin, neyi, ne zaman yaptığını kaydeden kayıt türünü düşün."
  - id: bulut-007-s2
    soru: "Event history ile iz (trail) arasındaki fark nedir?"
    cevap: "Event history, yönetim olaylarının son 90 gününü hazır sunar. Trail olayları kendi S3 bucket'ına (ve istersen CloudWatch Logs'a) yazar; böylece 90 günden uzun saklar ve başka araçlara besleyebilirsin."
    ipucu: "Hangisi her hesapta otomatik gelir ve kaç gün geriye gider?"
  - id: bulut-007-s3
    soru: "Denetim kayıtlarını neden ayrı bir hesapta ve korumalı bir bucket'ta tutarız?"
    cevap: "Saldırgan kayıtları silmeye ya da kapatmaya çalışır. Ayrı hesap ve kısıtlı izinler bu riski azaltır. CloudTrail'in log dosyası bütünlük doğrulaması da dosyaların değiştirilip değiştirilmediğini anlamana yardım eder."
    ipucu: "Saldırgan önce neyi silmek ister?"
  - id: bulut-007-s4
    soru: "Yönetim olayı (management event) ile veri olayı (data event) nedir?"
    cevap: "Yönetim olayları kaynakları yönetir (kullanıcı oluşturmak, güvenlik grubu değiştirmek). Veri olayları kaynağın içindeki işlemlerdir (S3 nesne okuma, Lambda çağırma). Veri olayları çok hacimli olduğundan ayrıca açılır ve ücretlendirilir."
    ipucu: "Hesap ayarlarını değiştiren işlemler ile nesne okumaları ayrı kategorilerdir."
  - id: bulut-007-s5
    soru: "CloudTrail'de bir `StopLogging` olayı görüyorsun. Ne yaparsın?"
    cevap: "Önce kimin ve hangi IP'den yaptığını olaydan bulur, kayıt almayı hemen yeniden başlatırım. Aynı kimliğin diğer eylemlerine (yeni kullanıcı, anahtar) bakar, kimlik şüpheliyse devre dışı bırakır ve olay müdahalesini başlatırım."
    ipucu: "Kaydı susturmak saldırganın tipik hamlesidir."
derinDalis:
  - tur: okuma
    baslik: "AWS CloudTrail kullanım kılavuzu"
    ayrinti: "Event history, Trails ve CloudTrail Lake farkı; olay biçimleri."
    url: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html"
hizliKontrol:
  - soru: "CloudTrail log dosyası bütünlük doğrulaması neyi yakalar?"
    secenekler: ["Kayıt dosyasının değiştirilmesini ya da silinmesini","Parola tahminlerini","Açık portları","Maliyet artışını"]
    dogru: 0
    aciklama: "Her saat imzalı özet dosyası üretilir; değişiklik ya da silme fark edilir."
    ipucu: "İmzalı özet fikrini hash zincirinden hatırla."
sikHatalar:
  - hata: "Yalnız event history'ye güvenmek."
    dogrusu: "Event history yalnız yönetim olaylarının son 90 gününü gösterir; uzun saklama için trail kur."
  - hata: "Kayıtları aynı hesapta tutup yöneticilere silme izni vermek."
    dogrusu: "Kayıtları ayrı hesapta, korumalı bucket'ta tut."
terimler:
  - "CloudTrail"
  - "Log dosyası bütünlük doğrulaması"
---

**CloudTrail**, AWS hesabındaki işlemlerin denetim kaydını tutar. Konsoldan, CLI'dan ya da SDK'dan yapılan her API çağrısı bir olay olarak kaydedilir. Bir güvenlik mühendisi için hesabın "kara kutusu"dur.

### Bir olay neye benzer?

Her kayıt JSON'dur ve şu alanları içerir:

- `eventTime`: Ne zaman (UTC).
- `eventSource` ve `eventName`: Hangi servis, hangi eylem (`iam.amazonaws.com` / `CreateUser`).
- `userIdentity`: Kim? Kullanıcı mı, rol mü, hangi anahtar mı?
- `sourceIPAddress`: Nereden?
- `errorCode`: Eylem reddedildiyse neden (ör. izin yok).
- `requestParameters`: Eylemin ayrıntıları.

Bu alanlar **kim, ne, ne zaman, nereden** sorusunu cevaplar.

### Üç kayıt yöntemi

1. **Event history**: Her hesapta otomatik gelir, yönetim olaylarının son 90 gününü gösterir. Açmak için yapman gereken bir şey yok.
2. **Trail** (iz): Olayları S3'e (ve isteğe bağlı CloudWatch Logs'a) sürekli yazar. 90 günden uzun saklama ve kendi araçlarınla analiz için trail gerekir. Çok hesaplı kurumlarda tek bir organizasyon izi kurulur.
3. **CloudTrail Lake**: Olayları sorgulanabilir bir veri gölünde tutar, ücretlidir.

### Neyi arayacaksın?

Başlangıç için yüksek değerli olaylar:

| Olay | Neden önemli |
|---|---|
| Kök kullanıcı girişi | Normalde hiç görülmemeli |
| Başarısız ConsoleLogin patlaması | Parola deneme belirtisi |
| `CreateUser`, `CreateAccessKey`, `AttachUserPolicy` | Kalıcılık kurma girişimi |
| `StopLogging`, `DeleteTrail` | Saldırganın izleri silmesi |
| `PutBucketPolicy`, güvenlik grubu değişikliği | Dışarı açılma |

### Kaydın kendisini koru

Kayıtlar bir saldırganın ilk hedefidir. Önlemler: kayıtları ayrı bir hesaptaki bucket'a gönder, bucket'a yazma ve silme izinlerini daralt, CloudTrail'in **log dosyası bütünlük doğrulamasını** aç. Bu, kayıt dosyalarının imzalı özetlerini tutar; bir dosya değiştirilirse fark edilir. Bu fikir sana tanıdık gelmeli: LogSentry'nin arşivindeki hash zinciriyle aynı mantık, yani her halka öncekinin özetini taşır, bozulursa zincir kopar.

### Kayıt tek başına yetmez

Log toplamak ile log'a bakmak farklı işlerdir. Sonraki iki derste kayıtları nasıl izleyeceğimizi, alarm kuracağımızı ve bunları nasıl ilişkilendireceğimizi göreceğiz.

Güvenlik notu: Kayıtlar kullanıcı adları, IP'ler ve kaynak adlarını içerir; hassas veri sayılır. Erişimi dar tut.
