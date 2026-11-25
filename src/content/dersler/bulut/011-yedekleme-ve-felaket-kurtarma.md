---
kimlik: bulut-011
baslik: "Yedekleme ve felaket kurtarma"
donem: 8
sira: 11
sure: 30
neden: "Fidye yazılımı çoğu zaman yedekleri de arar ve siler ya da şifreler. Yedeği olmak değil, o yedekten çalışır bir sisteme geri dönebilmek önemlidir. Bir DevSecOps mühendisi yedeği ve geri dönüş denemesini de otomasyon ve pipeline'ın parçası yapar."
analoji:
  baslik: "Önemli belgelerin kopyaları"
  metin: "Pasaportunun fotokopisini aynı çantada taşırsan çanta çalınınca ikisini birden kaybedersin. Birini evde, birini bir arkadaşında, birini bulutta tutarsan biri gitse de diğerleri kalır. Ama hiç denemediysen kopyanın okunaklı olduğunu bilemezsin. Sınır: kopya çoğaldıkça gizlilik riski de çoğalır; yedeği de korumalısın."
gorev:
  aciklama: "Her şey yereldir, WSL'de /tmp altında. 3-2-1 mantığını küçük ölçekte deneyeceksin: bir veri dizini, iki yedek kopya ve doğrulama. Sonra veriyi bozup yedekten geri dönmeyi deneyeceksin."
  komutlar:
    - mkdir -p /tmp/yedek-lab/veri /tmp/yedek-lab/kopya1 /tmp/yedek-lab/kopya2
    - echo "musteri listesi v1" > /tmp/yedek-lab/veri/musteri.txt
    - cp /tmp/yedek-lab/veri/musteri.txt /tmp/yedek-lab/kopya1/ && cp /tmp/yedek-lab/veri/musteri.txt /tmp/yedek-lab/kopya2/
    - cd /tmp/yedek-lab && sha256sum veri/musteri.txt kopya1/musteri.txt kopya2/musteri.txt
    - echo "SIFRELENDI-FIDYE" > /tmp/yedek-lab/veri/musteri.txt
    - cd /tmp/yedek-lab && sha256sum -c <(sha256sum kopya1/musteri.txt | sed 's#kopya1/#veri/#') ; cp kopya1/musteri.txt veri/musteri.txt && cat veri/musteri.txt
  soru: "Bozulmuş veriyi hangi komut gösterdi ve yedekten geri dönüş sonrası içerik nasıl göründü? Bu deneyde aynı disk üzerindeki kopyalar gerçek 3-2-1'e neden uymaz?"
  telefon:
    soru: "Şirketin tek yedeği, üretim sunucusuyla aynı hesapta ve aynı yönetici kimliğiyle silinebilen bir bucket'ta. Fidye yazılımı yönetici anahtarını ele geçirirse ne olur?"
    cevap: "Saldırgan yedekleri de silebilir ya da şifreleyebilir, çünkü aynı yetkiyle ulaşıyor. Yedek farklı bir hesapta, silinmesi zor (Object Lock gibi değiştirilemez) ve ayrı yetkilerle korunmalı."
sorular:
  - id: bulut-011-s1
    soru: "3-2-1 yedekleme kuralı nedir?"
    cevap: "Verinin en az 3 kopyası, 2 farklı ortamda, 1 tanesi farklı bir yerde (ya da çevrimdışı) olmalı. Böylece tek bir olay tüm kopyaları aynı anda yok edemez."
    ipucu: "Üç sayının her birinin neyi temsil ettiğini düşün: kopya, ortam, yer."
  - id: bulut-011-s2
    soru: "Yedeğin 'varlığı' ile 'çalışması' arasındaki fark nedir ve ne yapılır?"
    cevap: "Alınmış ama hiç geri yüklenmemiş yedeğin çalıştığı garanti değildir. Geri yükleme düzenli olarak denenir ve sonuç ölçülür; bu, yedeklemenin bir parçasıdır."
    ipucu: "Yedeği almak ile geri yüklemek arasındaki farkı düşün."
  - id: bulut-011-s3
    soru: "RPO ve RTO ne anlama gelir?"
    cevap: "RPO (recovery point objective): En çok ne kadar veri kaybı kabul edilir (son yedekten bu yana geçen süre). RTO (recovery time objective): Sistemin en geç ne kadar sürede yeniden ayakta olması gerekir."
    ipucu: "Biri veri kaybıyla, diğeri süreyle ilgili."
  - id: bulut-011-s4
    soru: "Fidye yazılımına karşı yedekleri nasıl korursun?"
    cevap: "Yedekleri ayrı hesapta, ayrı kimlikle tut; değiştirilemez depolama (S3 Object Lock gibi) kullan; çevrimdışı ya da ayrı bir kopya bulundur; yedek silme işlemlerini izle ve alarm kur; geri yüklemeyi düzenli dene."
    ipucu: "Saldırgan yönetici yetkisini ele geçirirse hangi yedek yine ayakta kalır?"
  - id: bulut-011-s5
    soru: "Fidye yazılımı üretim verisini şifreledi ve saldırgan yedek bucket'ını da silmeye çalışıyor. Yedekler aynı hesapta. Ne yaparsın?"
    cevap: "Önce erişimi keser, saldırganın kimliğini devre dışı bırakırım. Sonra ayrı hesaptaki ya da Object Lock'lu temiz yedekleri ararım; yoksa sürüm geçmişine bakarım. Geri yüklemeyi test ederek yaparım; sonrasında yedekleri ayrı hesaba ve değiştirilemez depolamaya taşırım."
    ipucu: "Silinemeyen ve ayrı yerdeki kopyayı hatırla."
derinDalis:
  - tur: okuma
    baslik: "CISA #StopRansomware Guide"
    ayrinti: "Fidye yazılımı öncesi hazırlık: çevrimdışı, şifreli ve test edilmiş yedekler dahil kontrol listesi."
    url: "https://www.cisa.gov/stopransomware/ransomware-guide"
hizliKontrol:
  - soru: "Saatlik yedek alan bir sistemin RPO'su yaklaşık nedir?"
    secenekler: ["Geri dönüş süresi 1 saat","Veri kaybı sıfır","En çok yaklaşık 1 saatlik veri kaybı","Bir gün"]
    dogru: 2
    aciklama: "RPO, kabul edilen azami veri kaybıdır; saatlik yedekte yaklaşık 1 saattir."
    ipucu: "RPO veri, RTO süredir."
sikHatalar:
  - hata: "Yedeği hiç geri yüklemeyi denememek."
    dogrusu: "Geri yüklemeyi düzenli dene; çalışmayan yedek yedek değildir."
  - hata: "Yedeği üretimle aynı hesapta tutmak."
    dogrusu: "Ayrı hesap ve ayrı kimlik kullan; silmeyi zorlaştır."
sema:
  baslik: "3-2-1 yedekleme kuralı"
  adimlar:
    - { etiket: "3 kopya", aciklama: "Üretimdeki asıl veri artı iki yedek." }
    - { etiket: "2 ortam", aciklama: "Yedekler iki farklı ortam ya da serviste durur." }
    - { etiket: "1 uzak", aciklama: "Bir kopya başka bölge ya da başka hesapta durur." }
    - { etiket: "Sına", aciklama: "Geri yüklemeyi düzenli dene, süreyi ölç." }
terimler:
  - "3-2-1 kuralı"
  - "RPO"
  - "RTO"
  - "Nesne kilidi"
---

Yedekleme güvenliğin son savunma hattıdır. Önceki derslerdeki her şey ters gitse bile, temiz bir yedekten geri dönebiliyorsan olay kurtarılabilir bir olaydır.

### 3-2-1 kuralı

- **3** kopya veri (üretimdeki asıl kopya dahil).
- **2** farklı ortam ya da servis.
- **1** kopya farklı bir yerde (başka bir bölge, başka bir hesap ya da çevrimdışı).

Bulutta "farklı yer" çoğunlukla **farklı bölge ve farklı hesap** demektir. Aynı hesapta, aynı yöneticinin silebildiği bir yedek, saldırgan için ek bir hedeften ibarettir.

### Bulutta yedekleme araçları

- **Sürümleme** (S3 versioning): Üzerine yazılan ya da silinen nesne eski sürümden geri gelir.
- **Anlık görüntüler** (snapshot): Disk ve veritabanlarının belirli andaki kopyası.
- **Bölgeler arası kopya**: Bir bölgedeki sorunlara karşı.
- **Nesne kilidi** (Object Lock): Belirli süre silmeyi ve değiştirmeyi engeller (WORM, bir kez yaz, çok kez oku).
- **Merkezi yedekleme politikaları**: Yedek alma zamanlaması, saklama süresi ve kopya hedefini kodla tanımlamak.

### RPO ve RTO

İki sayıyla düşün:

| Terim | Soru |
|---|---|
| RPO | En çok ne kadar veri kaybını kaldırabilirim? |
| RTO | Sistem en geç ne kadar sürede geri gelmeli? |

Saatlik yedek, en çok 1 saatlik veri kaybı demektir. Her gece yedek alıyorsan, RPO'n bir gündür. Daha sıkı hedef daha pahalıdır; iş birimleriyle konuşup gerçekçi bir hedef belirlenir.

### Fidye yazılımı ve yedekler

Modern fidye saldırılarında saldırganlar önce yedekleri arar, silmeye ya da şifrelemeye çalışır; çünkü yedek varsa fidye ödemek zorunda kalmazsın. CISA'nın rehberi bu yüzden çevrimdışı, şifreli ve **test edilmiş** yedekleri ister. Savunma:

1. Yedekleri ayrı hesapta ve ayrı kimlikle tut.
2. Silmeyi zorlaştır: değiştirilemez depolama, MFA ile silme onayı.
3. Yedek silme ve politika değiştirme olaylarına alarm kur (7 ve 8. dersler).
4. Geri yüklemeyi **düzenli** dene.

### Felaket kurtarma planı

Plan dört soruya cevap verir: Neyi, hangi sırayla geri getiririm? Kim karar verir? Nasıl iletişim kurulur? Ne kadar sürer (RTO)? Planı kâğıtta bırakma; yılda en az bir kez tatbikat yap, süreyi ölç.

Güvenlik notu: Yedek verisi de canlı veri kadar hassastır. Yedekleri de şifrele ve erişimini kısıtla; yedekten sızan veri de sızıntıdır.
