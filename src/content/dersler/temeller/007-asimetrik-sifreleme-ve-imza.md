---
kimlik: temeller-007
baslik: "Asimetrik şifreleme ve imza"
donem: 3
sira: 7
sure: 35
neden: "SSH anahtarları, TLS sertifikaları, imzalı commit'ler ve imzalı container imajları aynı fikre dayanır: açık/gizli anahtar çifti. DevSecOps'ta 'bu yazılımı gerçekten doğru kişi mi yayımladı?' sorusunu dijital imza ile cevaplarsın. Bu ders, ileride göreceğin SSH, HTTPS ve yazılım tedarik zinciri güvenliğinin ortak temelidir."
analoji:
  baslik: "Posta kutusu ve mühür"
  metin: "Açık anahtar, sokağa asılmış bir posta kutusu gibidir: herkes içine mektup atabilir ama yalnız anahtarı elinde tutan sen açabilirsin (şifreleme). İmza ise tersidir: yalnız senin elindeki mühürle basılır, herkes mührün gerçek olduğunu görebilir ama sahtesini basamaz. Sınır: gerçek mühür sahtesi yapılabilir; dijital imzada gizli anahtar çalınmadıkça sahtesi pratikte yapılamaz."
gorev:
  aciklama: "OpenSSL ile bir anahtar çifti üret, bir dosyayı imzala ve imzayı doğrula. Sonra dosyayı değiştirip doğrulamanın başarısız olduğunu gör. Her şey `~/temeller/imza` altında kalır; gizli anahtarı hiçbir yere gönderme."
  komutlar:
    - mkdir -p ~/temeller/imza && cd ~/temeller/imza
    - openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out gizli.pem
    - openssl pkey -in gizli.pem -pubout -out acik.pem
    - echo "surum 1.0 yayinlandi" > duyuru.txt
    - openssl dgst -sha256 -sign gizli.pem -out duyuru.imza duyuru.txt
    - openssl dgst -sha256 -verify acik.pem -signature duyuru.imza duyuru.txt
    - echo "surum 9.9 yayinlandi" > duyuru.txt
    - openssl dgst -sha256 -verify acik.pem -signature duyuru.imza duyuru.txt
  soru: "İlk doğrulama 'Verified OK' verdi, ikincisi vermedi. Dosyada tek bir kelime değişince imza neden geçersiz oldu? Bu hangi CIA ögesini kanıtlar?"
  telefon:
    soru: "Bir ekip yazılım güncellemesini imzalıyor. Saldırgan güncelleme sunucusunu ele geçirip içine zararlı kod koydu ama imzalama anahtarına erişemedi. İstemciler bu güncellemeyi kabul eder mi?"
    cevap: "Hayır. İstemci açık anahtarla imzayı doğrular; saldırgan değiştirilmiş dosya için geçerli imza üretemez, doğrulama başarısız olur. Ancak imza anahtarı da çalınsaydı sahte güncelleme kabul edilirdi."
sorular:
  - id: temeller-007-s1
    soru: "Asimetrik şifrelemede açık anahtar ve gizli anahtar ne işe yarar?"
    cevap: "Bir anahtar çiftidir. Açık anahtar herkese verilebilir; gizli anahtar yalnız sahibinde kalır. Açık anahtarla şifrelenen veriyi yalnız gizli anahtar çözer. Gizli anahtarla atılan imzayı açık anahtar doğrular."
    ipucu: "Biri herkese verilir, biri yalnız sende kalır; hangisi ne işe yarar?"
  - id: temeller-007-s2
    soru: "Simetrik şifrelemenin anahtar dağıtımı sorununu asimetrik şifreleme nasıl hafifletir?"
    cevap: "Önceden gizli bir kanal gerekmez. Karşı taraf açık anahtarını herkese açık verir; sen bununla şifrelersin, o kendi gizli anahtarıyla çözer. Pratikte asimetrik yöntem bir simetrik oturum anahtarını güvenle paylaşmak için kullanılır ve verinin kendisi hızlı simetrik şifreleme ile taşınır."
    ipucu: "Anahtarı önceden gizlice paylaşmak zorunda kalmak yerine ne paylaşılabilir?"
  - id: temeller-007-s3
    soru: "Dijital imza hangi iki şeyi kanıtlar?"
    cevap: "Mesajın imzalandıktan sonra değişmediğini (bütünlük) ve imzayı gizli anahtarın sahibinin attığını (kaynak doğrulama, inkâr edilememe)."
    ipucu: "İmza hem 'kim yaptı' hem 'değişti mi' sorusuna cevap verir."
  - id: temeller-007-s4
    soru: "Açık anahtarın gerçekten o kişiye ait olduğunu nasıl bilirsin? Sertifika bu soruya nasıl cevap verir?"
    cevap: "Açık anahtarı tek başına gören biri kime ait olduğunu bilemez; sahte bir anahtar sunulabilir. Sertifika, güvenilir bir otoritenin 'bu anahtar bu alan adına/kişiye aittir' diye imzaladığı bir belgedir. TLS dersinde ayrıntısını göreceksin."
    ipucu: "Açık anahtarın sahibine ait olduğuna kim şahitlik eder?"
  - id: temeller-007-s5
    soru: "Bir ekip arkadaşın, 'imzalı güncelleme olduğu için güvenli' diyerek bir güncellemeyi hiç incelemeden dağıtmak istiyor. Haberlerde imzalama altyapısının ele geçirildiği bir olay okumuştun. Neyi hatırlatırsın?"
    cevap: "İmza paketin imzalayan anahtar sahibinden geldiğini ve sonradan değişmediğini kanıtlar; kodun zararsız olduğunu kanıtlamaz. İmzalama süreci ya da anahtar ele geçirilirse saldırganın zararlı kodu da geçerli imzayla çıkar. Bu yüzden anahtarı sıkı korur, yapı sürecini izler, güncellemeleri kademeli dağıtır ve sapma tespitini sürdürürüm."
    ipucu: "İmza 'kimden geldi'yi söyler, 'iyi niyetli mi'yi söylemez."
hizliKontrol:
  - soru: "Dijital imza oluşturmak için hangi anahtar kullanılır?"
    secenekler: ["Alıcının açık anahtarı","Gönderenin gizli anahtarı","Alıcının gizli anahtarı","Herkesin bildiği ortak parola"]
    dogru: 1
    aciklama: "İmzayı yalnız gizli anahtarın sahibi üretebilir; herkes açık anahtarla doğrular."
    ipucu: "İmzayı sadece sahibi atabilmeli."
  - soru: "Sertifikanın temel görevi nedir?"
    secenekler: ["Verileri şifrelemek","Bir açık anahtarın belirli bir kimliğe ait olduğunu güvenilen bir kurumun imzasıyla bağlamak","Parolayı hash'lemek","Ağ hızını artırmak"]
    dogru: 1
    aciklama: "Sertifika, açık anahtar ile sahibi arasındaki bağı güvenilen bir otoritenin imzasıyla belgeler."
    ipucu: "Açık anahtara kim şahitlik ediyor?"
sikHatalar:
  - hata: "Gizli anahtarı e-postayla ya da depoya yükleyerek paylaşmak."
    dogrusu: "Gizli anahtar kimseyle paylaşılmaz; paylaşılan yalnız açık anahtardır."
  - hata: "İmzalı olan her yazılımı zararsız saymak."
    dogrusu: "İmza kaynağı ve bütünlüğü doğrular; imzalayan taraf ele geçirilmişse zararlı kod da imzalı olabilir."
terimler:
  - "Asimetrik şifreleme"
  - "Dijital imza"
  - "Sertifika"
sema:
  baslik: "Dijital imzanın akışı"
  adimlar:
    - etiket: "Hash"
      aciklama: "Gönderen mesajın hash'ini hesaplar."
    - etiket: "İmzalama"
      aciklama: "Hash, gönderenin gizli anahtarıyla imzalanır."
    - etiket: "Gönderim"
      aciklama: "Mesaj ve imza alıcıya birlikte gider."
    - etiket: "Doğrulama"
      aciklama: "Alıcı imzayı gönderenin açık anahtarıyla çözüp hash ile karşılaştırır."
    - etiket: "Sonuç"
      aciklama: "Eşleşirse mesaj o anahtardan gelmiştir ve değişmemiştir."
olay:
  baslik: "SolarWinds Orion güncellemelerinin kötüye kullanılması"
  yil: 2020
  ozet: "Saldırganlar SolarWinds Orion'un yapı sürecine uzun süre gizlice erişti ve Orion sürümlerine SUNBURST/TEARDROP adlı bir arka kapı yerleştirdi. Bu güncellemeler kurumlara normal yazılım güncellemesi olarak ulaştı; CISA Aralık 2020'de etkilenen sürümlerin kapatılmasını isteyen acil bir direktif yayımladı."
  ders: "Yazılımı üreticisinden gelen güncelleme olarak doğrulamak yetmez; imzalama ve yapı süreci ele geçirilirse zararlı kod güvenilir kanaldan gelir. Bu yüzden yapı sürecinin ve anahtarların korunması şarttır."
  kaynak:
    ad: "CISA: ED 21-01, Mitigate SolarWinds Orion Code Compromise"
    url: "https://www.cisa.gov/news-events/directives/ed-21-01-mitigate-solarwinds-orion-code-compromise"
derinDalis:
  - tur: kitap
    baslik: "Serious Cryptography (Jean-Philippe Aumasson)"
    ayrinti: "RSA ve eliptik eğri tabanlı imza konularını kapsayan bölümler."
  - tur: lab
    baslik: "SSH anahtar çiftini incele"
    ayrinti: "`ssh-keygen -t ed25519 -f /tmp/deneme` ile bir anahtar üretip `.pub` dosyasının içeriğine bak. Gizli anahtarın hangi dosyada olduğunu ve neden paylaşılmaması gerektiğini not et."
---

Simetrik şifrelemede iki taraf aynı anahtarı paylaşıyordu. Bu bir ikilem yaratır: anahtarı karşı tarafa nasıl güvenle ulaştıracaksın? **Asimetrik şifreleme** (public-key cryptography) bu ikilemi iki anahtarla çözer.

### Anahtar çifti

Her taraf matematiksel olarak bağlı iki anahtar üretir:

- **Açık anahtar** (public key): Herkese verilebilir.
- **Gizli anahtar** (private key): Yalnız sahibinde kalır, asla paylaşılmaz.

Bir anahtarla yapılan işlemi yalnız diğeri tersine çevirebilir. Gizli anahtarı açık anahtardan hesaplamak pratikte mümkün değildir.

### İki kullanım

**1. Şifreleme (gizlilik).** Ayşe'ye mesaj göndereceksen onun açık anahtarıyla şifrelersin. Mesajı yalnız Ayşe'nin gizli anahtarı çözer. Anahtarı herkes bilse bile kimse mesajı okuyamaz.

**2. İmza (bütünlük ve kaynak).** Ayşe bir dosyanın özetini (hash) kendi gizli anahtarıyla imzalar. Herkes onun açık anahtarıyla imzayı doğrulayabilir. Doğrulama iki şeyi gösterir: dosya imzalandığından beri değişmedi ve imzayı gerçekten Ayşe attı.

### Hash neden imzanın parçası?

Büyük bir dosyanın kendisini imzalamak yavaştır. Bu yüzden önce dosyanın hash'i alınır, imza o hash üzerine atılır. Dosyada tek bir bit değişirse hash değişir ve imza doğrulaması başarısız olur. Bir sonraki ders hash'i ayrıntılı işleyecek.

### Pratikte ikisi bir arada

Asimetrik işlemler yavaştır. Bu yüzden gerçek sistemler (ör. HTTPS) önce asimetrik yöntemle ortak bir simetrik anahtar üzerinde anlaşır, sonra veriyi hızlı simetrik şifreleme ile taşır.

### Güven problemi

Bir açık anahtarı gördüğünde kime ait olduğunu bilmiyorsun. Saldırgan kendi anahtarını başkasınınmış gibi sunabilir. İşte **sertifikalar** burada devreye girer: güvenilir bir otorite, bir anahtarın bir kimliğe ait olduğunu imzayla onaylar. Aynı sorunun SSH'taki karşılığı, bir sunucuya ilk bağlanışta sorulan parmak izi onayıdır.

### Nerede karşına çıkar?

- SSH anahtarıyla sunucuya giriş.
- HTTPS sertifikaları.
- Git'te imzalı commit'ler ve imzalı yazılım sürümleri.
- Container imajlarının imzalanması.

Güvenlik notu: Gizli anahtar çalınırsa imza ve kimlik tamamen çöker. Gizli anahtarı parola ile korumak, repoya koymamak, mümkünse donanım anahtarında tutmak ve ele geçirildiğinde hemen iptal etmek gerekir.
