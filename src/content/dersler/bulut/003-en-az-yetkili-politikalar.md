---
kimlik: bulut-003
baslik: "En az yetkili IAM politikaları"
donem: 8
sira: 3
sure: 30
neden: "Bir pipeline'a ya da role 'şimdilik her şeye izin' verilir ve o 'şimdilik' yıllarca kalır. Çalınan bir kimliğin zararı, o kimliğin izinleri kadardır. Politikayı okuyup aşırı yetkiyi fark etmek her code review'da ve her denetimde karşına çıkacak bir beceridir."
analoji:
  baslik: "Ev anahtarı ve çilingir"
  metin: "Süt alsın diye komşuya sadece balkon kapısının anahtarını verirsin; bütün evin, kasanın ve arabanın anahtarını değil. Joker karakter (*) ise 'bütün anahtarlar sende kalsın' demektir. Sınır: bulutta anahtar kopyalamak bedavadır ve fark edilmeyebilir; bu yüzden baştan dar vermek gerekir."
gorev:
  aciklama: "Bulutta bir şey oluşturmaz. `jq` gerekir (`sudo apt install -y jq`). Üç örnek politikayı dosyaya yazıp joker karakterli ifadeleri otomatik bulacaksın. Gerçek bir hesapta politika doğrulama için `aws accessanalyzer validate-policy` komutu vardır; burada yalnız yardım çıktısını okuyoruz."
  komutlar:
    - |-
      cat > /tmp/politika.json <<'EOF'
      {"Version":"2012-10-17","Statement":[
       {"Sid":"Genis","Effect":"Allow","Action":"*","Resource":"*"},
       {"Sid":"S3Hepsi","Effect":"Allow","Action":"s3:*","Resource":"arn:aws:s3:::rapor-bucket/*"},
       {"Sid":"Dar","Effect":"Allow","Action":["s3:GetObject"],"Resource":"arn:aws:s3:::rapor-bucket/rapor/*"}
      ]}
      EOF
    - |-
      jq -r '.Statement[] | select(.Effect=="Allow") | select((.Action|tostring|test("\\*")) ) | "\(.Sid): Action=\(.Action) Resource=\(.Resource)"' /tmp/politika.json
    - jq -r '.Statement[] | select(.Action=="*" and .Resource=="*") | .Sid' /tmp/politika.json
    - aws accessanalyzer validate-policy help | head -25
  soru: "Üç ifadeden hangisi en tehlikeli, hangisi 'yarı tehlikeli' ve neden? 'S3Hepsi' ifadesini nasıl daraltırdın?"
  telefon:
    soru: "Bir rapor uygulaması yalnız `rapor/` klasöründeki dosyaları okuyacak. Hangi `Action` ve `Resource` yeterli olur?"
    cevap: "Action: `s3:GetObject`; Resource: `arn:aws:s3:::rapor-bucket/rapor/*`. Okuma dışında (yazma, silme, listeleme) hiçbir izin gerekmiyorsa verilmez."
sorular:
  - id: bulut-003-s1
    soru: "En az yetki ilkesi (least privilege) nedir?"
    cevap: "Bir kimliğe yalnız işini yapmak için gereken eylemleri, gereken kaynaklar üzerinde vermek. Gerisi varsayılan olarak yasak kalır."
  - id: bulut-003-s2
    soru: "`\"Action\": \"*\", \"Resource\": \"*\"` neden tehlikelidir?"
    cevap: "Hesaptaki her servise ve kaynağa tam yetki verir. Bu kimlik çalınırsa saldırgan veriyi silebilir, kendine yeni kullanıcı açabilir ve izleri temizleyebilir."
  - id: bulut-003-s3
    soru: "Bir politikada Allow ve Deny çakışırsa sonuç ne olur?"
    cevap: "Açık Deny her zaman kazanır. Bu yüzden Deny, kritik kısıtları (ör. belirli bölgeler dışı yasağı) güvenceye almak için kullanılır."
  - id: bulut-003-s4
    soru: "Doğru izinleri bilmiyorsam nasıl yaklaşırım?"
    cevap: "Geniş bir başlangıç yerine denemelerle başlar, sonra gerçek erişim kayıtlarından (CloudTrail) yararlanarak daraltırım. IAM Access Analyzer, kullanılan eylemlere göre politika üretebilir. Kullanılmayan izinleri düzenli temizlerim."
derinDalis:
  - tur: okuma
    baslik: "AWS: IAM en iyi uygulamaları, en az yetki bölümü"
    ayrinti: "Access Analyzer ile politika doğrulama ve son erişim bilgisine göre daraltma."
    url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
---

Bir IAM politikası JSON'dur ve her **ifade** (statement) dört şeye bakar:

- **Effect**: `Allow` ya da `Deny`.
- **Action**: Hangi eylem? (`s3:GetObject`, `ec2:StartInstances`)
- **Resource**: Hangi kaynak üzerinde? (ARN adlı kimlik biçimiyle yazılır)
- **Condition** (isteğe bağlı): Hangi koşulda? (belirli IP, MFA'lı oturum, TLS)

### Okuma alışkanlığı

Bir politikayı üç soruyla oku: **Ne yapabilir?** (Action), **Neye?** (Resource), **Hangi koşulda?** (Condition). Üçünde de `*` görüyorsan alarm çalar.

```json
{"Effect":"Allow","Action":"*","Resource":"*"}
```

Bu ifade "hesaptaki her şeyi yap" demektir. Yönetici politikası olarak bilinçli kullanılabilir; ama bir uygulamaya, CI işine ya da stajyere verilmesi neredeyse her zaman hatadır.

### Joker karakter kademeleri

| İfade | Anlamı | Risk |
|---|---|---|
| `Action: "*"` | Her eylem | Çok yüksek |
| `Action: "s3:*"` | S3'teki her eylem (silme, politika değiştirme dahil) | Yüksek |
| `Action: "s3:Get*"` | S3'te okuma eylemleri | Orta, kaynağa bağlı |
| `Action: "s3:GetObject"` | Tek eylem | Düşük |
| `Resource: "*"` | Hesaptaki tüm kaynaklar | Eyleme göre değişir |

Bir ifadede hem eylem hem kaynak geniş olursa risk çarpılır, toplanmaz.

### Daraltma yöntemi

1. **Adım adım ilerle**: işi ilk çalıştırırken bir log (CloudTrail) tut.
2. **Gerçek kullanıma bak**: hangi eylemler gerçekten çağrıldı?
3. **Daralt**: yalnız onlara izin ver, kaynakları adıyla yaz.
4. **Doğrula**: IAM Access Analyzer politikanın hatalarını ve riskli ifadelerini söyler.
5. **Düzenli temizle**: AWS'nin "son erişim bilgisi" kullanılmayan izinleri ortaya çıkarır.

### Koşullar ve sınırlar

Condition ile izni daraltabilirsin: yalnız MFA ile açılmış oturumda, yalnız belirli ağdan, yalnız TLS ile. Çok hesaplı bir kurumda ayrıca organizasyon düzeyinde guardrail'ler (SCP) üst sınır koyar; bunlar izin vermez, yalnız sınırlar.

### Kod incelemesi (code review) ipucu

Bir pull request'te IAM politikası görünce önce `*` ara. `Action: "*"` ya da `Resource: "*"` bulursan nedenini sor; gerekçe yoksa daralt. Bu kontrolü sonraki derslerde pipeline'a da koyacağız.

Güvenlik notu: "Önce çalışsın, sonra daraltırız" cümlesi, daraltmanın hiç yapılmadığı bir ortamın başlangıcıdır. İşe başlarken dar başla, gerekirse ekle.
