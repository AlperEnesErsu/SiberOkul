---
kimlik: bulut-005
baslik: "Depolama güvenliği"
donem: 8
sira: 5
sure: 30
neden: "Nesne depolama (S3 gibi) bulutun en yaygın veri deposudur; yanlış bir bucket politikası, tek bir satırla milyonlarca kaydı herkese açabilir. Bir DevSecOps mühendisi hem kodda bu satırı yakalar hem de hesap düzeyinde bu hatanın oluşmasını engeller."
analoji:
  baslik: "Kiralık depo ünitesi"
  metin: "Depo ünitesinin kapısını şirket yapar, kilidi ve kimin anahtar kopyasına sahip olduğunu sen belirlersin. Kapıyı açık bırakırsan şirket 'kapıyı biz yaptık' diyemez. Şifreleme ise eşyaları kilitli sandıklara koymaktır: kapı açık kalsa da sandığın anahtarı olmayan içini göremez. Sınır: sandığın anahtarını da aynı kapıya asarsan sandık işe yaramaz."
gorev:
  aciklama: "Bulutta bucket oluşturmaz. `jq` gerekir (`sudo apt install -y jq`). İki örnek bucket politikasını yazıp herkese açık olanı otomatik bulacaksın. `aws s3api put-public-access-block help` yalnız yardım çıktısıdır, çalıştırılmaz."
  komutlar:
    - |-
      cat > /tmp/bucket-a.json <<'EOF'
      {"Version":"2012-10-17","Statement":[{"Sid":"Herkes","Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::musteri-yedek/*"}]}
      EOF
    - |-
      cat > /tmp/bucket-b.json <<'EOF'
      {"Version":"2012-10-17","Statement":[{"Sid":"Uygulama","Effect":"Allow","Principal":{"AWS":"arn:aws:iam::111122223333:role/rapor-uygulamasi"},"Action":"s3:GetObject","Resource":"arn:aws:s3:::rapor-bucket/*"}]}
      EOF
    - |-
      for f in /tmp/bucket-a.json /tmp/bucket-b.json; do echo "$f:"; jq -r '.Statement[] | select(.Effect=="Allow" and (.Principal=="*" or .Principal.AWS=="*")) | "  HERKESE ACIK: " + .Sid' "$f"; done
    - aws s3api put-public-access-block help | sed -n '1,30p'
  soru: "Hangi dosya herkese açık bir ifade içeriyor? Bu açıklığı hesap düzeyinde önleyen ayar neydi ve kodda hangi satır bunu sezdirir?"
  telefon:
    soru: "Bir bucket politikasında `\"Principal\": \"*\"` ve `\"Action\": \"s3:GetObject\"` görüyorsun. Bunun anlamı nedir ve ne yaparsın?"
    cevap: "İnternetteki herkes bucket'taki nesneleri okuyabilir (listeleme olmasa bile adı bilinen nesneyi). Bilerek yayınlanan bir site değilse politikayı kaldırır, Block Public Access'i açar ve CloudTrail'de bucket'a kimin eriştiğine bakarsın."
sorular:
  - id: bulut-005-s1
    soru: "S3 Block Public Access ne işe yarar?"
    cevap: "Bucket ya da hesap düzeyinde, ACL ve politikalarla herkese açıklık verilmesini engelleyen bir güvenlik ağıdır. Politika yanlış yazılsa bile açıklık oluşmaz; ayar kapatılırsa eski politika yeniden etkinleşir."
    ipucu: "Bucket ve hesap düzeyinde politikalardan bağımsız çalışan bir güvenlik ağını düşün."
  - id: bulut-005-s2
    soru: "S3 varsayılan olarak nesneleri şifreler mi? Bu seni neyden korur, neyden korumaz?"
    cevap: "Evet, yeni nesneler varsayılan olarak SSE-S3 ile şifrelenir. Bu, depolama diskinin ele geçirilmesine karşı korur; ama izni olan bir kimlik nesneyi şifresiz okur. Yani yanlış erişim politikasına karşı koruma değildir."
    ipucu: "Şifreleme diskteki veriyi mi korur, yetkili okuyanı mı engeller?"
  - id: bulut-005-s3
    soru: "SSE-S3 ile SSE-KMS arasındaki pratik fark nedir?"
    cevap: "SSE-S3'te anahtarı S3 yönetir. SSE-KMS'de anahtar sendeki KMS anahtarıdır; kimin kullanabileceğini ayrıca politikayla sınırlarsın ve anahtar kullanımı kayda geçer."
    ipucu: "Anahtarı kimin yönettiği ve kullanımın kaydedilip kaydedilmediği farkı belirler."
  - id: bulut-005-s4
    soru: "Silinen ya da üzerine yazılan nesneye karşı hangi özellik yardım eder?"
    cevap: "Sürümleme (versioning): her değişiklik yeni bir sürüm olarak saklanır; silinen nesne eski sürümden geri getirilebilir. Daha güçlüsü için nesne kilidi (Object Lock) sürümlerin silinmesini de engeller."
    ipucu: "Silineni geri getirmek için her değişikliğin saklanması gerekir."
  - id: bulut-005-s5
    soru: "Access Analyzer, müşteri yedeği tutan bir bucket'ın internete açık olduğunu bildiriyor. İlk ne yaparsın?"
    cevap: "Block Public Access'i açıp açık politikayı kaldırırım. Sonra CloudTrail ve erişim kayıtlarından kimin ne okuduğuna bakarım. Veri okunmuşsa olay müdahale sürecini başlatır, ayarın kodla zorlanmasını sağlarım."
    ipucu: "Önce açıklığı kapat, sonra kayıtlara bak."
derinDalis:
  - tur: okuma
    baslik: "AWS: S3 erişimini herkese kapatmak (Block Public Access)"
    ayrinti: "Dört ayarın anlamı, 'herkese açık' tanımı ve hesap/organizasyon düzeyi uygulama."
    url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"
  - tur: okuma
    baslik: "AWS: S3 varsayılan şifreleme SSS"
    ayrinti: "Yeni nesnelerin SSE-S3 ile otomatik şifrelenmesi ve mevcut nesneler için yapılması gerekenler."
    url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-encryption-faq.html"
hizliKontrol:
  - soru: "S3 Object Lock hangi önkoşulu ister?"
    secenekler: ["Bucket'ta sürümleme açık olmalı","Bucket şifreli olmamalı","Bucket genel alt ağda olmalı","Yalnız kök kullanıcı yazabilmeli"]
    dogru: 0
    aciklama: "Object Lock yalnız sürümlemenin açık olduğu bucket'larda çalışır."
    ipucu: "Kilit, nesnenin belirli bir sürümüne uygulanır."
sikHatalar:
  - hata: "Şifreleme açık, öyleyse bucket'ı herkese açmak sorun değil sanmak."
    dogrusu: "Yetkili kimlik nesneyi şifresiz okur; erişim politikası ve Block Public Access şarttır."
  - hata: "'Bucket adını kimse bilmez' diye güvenmek."
    dogrusu: "Adlar tahmin edilir ve sızar; güvenlik ad gizlemekle sağlanmaz."
terimler:
  - "Block Public Access"
  - "Sürümleme"
  - "Nesne kilidi"
---

Depolama güvenliği üç soruya iner: **Kim okuyabilir? Veri diskte nasıl durur? Bir şey silinir ya da bozulursa geri dönebilir miyim?**

### Kim okuyabilir?

S3'te erişim; IAM politikaları, **bucket politikası** ve ACL'lerle belirlenir. En tehlikeli ifade şudur:

```json
{"Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::bucket/*"}
```

`Principal: "*"` "herkes" demektir. Statik bir web sitesini bilerek yayınlıyorsan doğru olabilir; müşteri yedeği için kesinlikle yanlıştır.

Bunu önlemek için **Block Public Access** (herkese açıklığı engelleme) vardır. Dört ayar halinde bucket ya da hesap düzeyinde çalışır ve politikalardan bağımsız bir güvenlik ağı kurar. AWS, hesap düzeyinde dördünün de açılmasını önerir. Yeni bucket'lar varsayılan olarak herkese açık değildir; açıklık, birinin politika ya da ACL değiştirmesiyle doğar. Bu yüzden ayar kodla zorlanmalıdır.

İkinci sigorta: **IAM Access Analyzer**, herkese ya da başka hesaplara açık kaynakları bulur ve uyarı üretir.

### Diskte nasıl durur?

S3, yeni nesneleri varsayılan olarak **SSE-S3** ile şifreler (2023'ten beri, bu kapatılamaz). Daha fazla kontrol istersen:

| Seçenek | Anahtarı kim yönetir | Ne zaman |
|---|---|---|
| SSE-S3 | S3 | Temel koruma, ek iş yok |
| SSE-KMS | Sen (KMS anahtarı) | Anahtar erişimini ayrıca sınırlamak ve kaydetmek |

Şifreleme **durağan veriyi** (data at rest) korur. Yetkili bir kimlik nesneyi okuyunca S3 otomatik çözer. Dolayısıyla şifreleme, yanlış IAM politikasının yerini tutmaz. Taşıma sırasında (data in transit) TLS kullanımını bir bucket politikasıyla zorunlu kılabilirsin.

### Geri dönülebilirlik

- **Sürümleme** (versioning): Her yazma yeni sürüm olur; silmek yalnız bir silme işareti koyar.
- **Nesne kilidi** (Object Lock): Bir süre boyunca silme ve üzerine yazmayı engeller. Fidye yazılımına karşı 11. derste yeniden karşımıza çıkacak.
- **Yaşam döngüsü kuralları**: Eski sürümleri ve gereksiz nesneleri belirli süre sonra temizler; maliyet de düşer.

### Pipeline'a koyabileceğin kontroller

1. Terraform ya da CloudFormation dosyasında `Principal: "*"` arayan bir kural.
2. Her bucket için Block Public Access'in kodda açıkça yazılması.
3. Hesapta herkese açık kaynak bulan bir Access Analyzer bildirimi.

Güvenlik notu: "Bucket'ın adını kimse bilmez" bir güvenlik önlemi değildir. Adlar tahmin edilir, log'lardan ve kodlardan sızar.
