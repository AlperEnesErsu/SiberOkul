---
kimlik: temeller-006
baslik: "Simetrik şifreleme"
donem: 3
sira: 6
sure: 30
neden: "Diskteki veri, veritabanı yedekleri, TLS oturumunun içindeki trafik ve bulut depolama; hepsi arka planda simetrik şifreleme kullanır. DevSecOps mühendisi olarak algoritmayı sen yazmazsın ama anahtarların nerede durduğunu, kimin görebildiğini ve nasıl döndürüldüğünü sen yönetirsin. Asıl zorluk şifrelemede değil anahtar yönetimindedir."
analoji:
  baslik: "Ortak anahtarlı kutu"
  metin: "Bir kutuyu tek bir anahtarla hem kilitler hem açarsın. Kutuyu arkadaşına göndereceksen anahtarın bir kopyasını da ona vermen gerekir. Anahtar yolda çalınırsa kutunun kilidi boşuna. Sınır: gerçek kutuda anahtar fiziksel olarak bir yerden bir yere gider; dijital dünyada anahtarı güvenli iletmek çözülmesi gereken ayrı ve zor bir problemdir."
gorev:
  aciklama: "OpenSSL ile bir metni AES-256 ile şifrele, sonra çöz. Parola yalnız bu deney için uydurulmuş bir örnek; kendi gerçek parolanı kullanma. Her şey `~/temeller` altında kalır."
  komutlar:
    - mkdir -p ~/temeller && cd ~/temeller
    - echo "bu bir gizli mesajdir" > mesaj.txt
    - openssl enc -aes-256-cbc -pbkdf2 -salt -in mesaj.txt -out mesaj.enc -pass pass:deneme-anahtari
    - cat mesaj.enc | head -c 60 | xxd | head -3
    - openssl enc -d -aes-256-cbc -pbkdf2 -in mesaj.enc -out cozuldu.txt -pass pass:deneme-anahtari
    - cat cozuldu.txt
    - openssl enc -d -aes-256-cbc -pbkdf2 -in mesaj.enc -pass pass:yanlis-anahtar
  soru: "Yanlış anahtarla çözmeye çalışınca ne oldu? Bu, saldırganın şifreli dosyayı eline geçirmesinin tek başına neden yetmediğini nasıl gösterir?"
  telefon:
    soru: "Bir ekip veritabanı yedeğini AES-256 ile şifreledi ama şifreleme anahtarını yedeğin yanındaki aynı depolama klasörüne koydu. Bu düzen neden güvensizdir?"
    cevap: "Yedeğe erişen herkes anahtara da erişir, yani şifrelemenin hiçbir koruması kalmaz. Anahtar, veriden ayrı ve daha sıkı korunan bir yerde (anahtar yönetim servisi, ayrı yetkiler) tutulmalı."
sorular:
  - id: temeller-006-s1
    soru: "Simetrik şifrelemede hangi anahtar kullanılır ve en büyük pratik sorun nedir?"
    cevap: "Şifrelemek ve çözmek için aynı anahtar kullanılır. En büyük sorun, bu anahtarı iletişim kuran taraflara güvenli biçimde ulaştırmak ve saklamaktır (anahtar dağıtımı ve yönetimi)."
    ipucu: "Şifreleyen ve çözen anahtarın aynı olduğunu hatırla; asıl yük nerede?"
  - id: temeller-006-s2
    soru: "AES nedir ve neden kendi şifreleme algoritmanı yazmamalısın?"
    cevap: "AES, yıllarca açık biçimde incelenmiş standart bir blok şifreleme algoritmasıdır. Kendi algoritmanı yazarsan uzmanlar bile hata yapar ve açık gözden kaçar. Kanıtlanmış algoritma ve kütüphane kullanılır."
    ipucu: "Kasayı koruyan şey kilidin gücü mü, anahtarın nerede durduğu mu?"
  - id: temeller-006-s3
    soru: "Şifreleme bir dosyanın bütünlüğünü de garanti eder mi?"
    cevap: "Her zaman değil. Bazı kipler (ör. CBC) şifreli veride değişiklik yapılmasını tek başına yakalamaz. Gizlilik ile bütünlüğü birlikte sağlayan kipler (ör. GCM) ya da ayrı bir doğrulama kodu tercih edilir."
    ipucu: "Şifreleme veriyi gizler; verinin değişmediğini ayrıca ne kanıtlar?"
  - id: temeller-006-s4
    soru: "Bir anahtarın ele geçirildiğinden şüphelendin. Ne yapman gerekir?"
    cevap: "Anahtarı hemen iptal edip yenisini üretirsin (anahtar döndürme, rotation) ve eski anahtarla şifrelenmiş veriyi yeni anahtarla yeniden şifrelersin. Ele geçirilen anahtarın erişimi olduğu süre de olay incelemesine eklenir."
    ipucu: "Anahtar sızmış olabilir; hangi veriler tehlikede ve ne yenilenmeli?"
  - id: temeller-006-s5
    soru: "Bir depoda şifreli bir veri yedeği ve yanında 'anahtar.txt' dosyası olduğunu fark ettin. Ekip 'AES-256 kullanıyoruz, güvenli' diyor. Ne yaparsın?"
    cevap: "AES güçlü olsa da anahtar yedekle aynı yerdeyse şifreleme koruma sağlamaz: depoya erişen herkes ikisini de alır. Anahtarı yedekten ayırıp bir anahtar yönetim hizmetine ya da gizli yönetimi aracına taşırım, erişimini sıkılaştırırım ve açıkta kalan anahtarı sızmış sayıp yenisini üretir, veriyi yeniden şifrelerim."
    ipucu: "Anahtar nerede durursa şifrenin değeri biter?"
hizliKontrol:
  - soru: "Simetrik şifrelemede en büyük pratik sorun nedir?"
    secenekler: ["Algoritmaların çok yavaş olması","Aynı anahtarın tarafların arasında güvenle paylaşılması ve saklanması","Verinin geri çözülememesi","Anahtarın her seferinde otomatik değişmesi"]
    dogru: 1
    aciklama: "Algoritmalar hızlıdır; zor olan, ortak anahtarı güvenle dağıtmak ve korumaktır."
    ipucu: "İki taraf aynı sırrı nasıl paylaşır?"
  - soru: "Kendi şifreleme algoritmanı yazmak neden önerilmez?"
    secenekler: ["Standart algoritmalar yasal olarak zorunludur","Yıllarca incelenmiş algoritmalar bile hatasız değilken yeni bir tasarım çok daha kırılgan olur","Kendi algoritman her zaman daha yavaştır","Algoritmalar telifli olduğu için"]
    dogru: 1
    aciklama: "Güvenlik gizli algoritmadan değil, geniş inceleme görmüş yöntemlerden ve gizli anahtardan gelir."
    ipucu: "Binlerce uzmanın incelediği bir şeyle tek kişinin yazdığı şeyi kıyasla."
sikHatalar:
  - hata: "Anahtarı kodun ya da yedeğin yanında saklamak."
    dogrusu: "Anahtar veriden ayrı ve daha sıkı korunan bir yerde (anahtar yönetim hizmeti, gizli yönetimi) tutulur."
  - hata: "Şifrelemenin içeriğin değişmediğini de kanıtladığını sanmak."
    dogrusu: "Şifreleme gizliliği korur; bütünlük için doğrulamalı mod (ör. AES-GCM), hash ya da imza gerekir."
terimler:
  - "Simetrik şifreleme"
  - "Gizlilik"
  - "Bütünlük"
derinDalis:
  - tur: kitap
    baslik: "Serious Cryptography (Jean-Philippe Aumasson)"
    ayrinti: "Blok şifreler ve şifreleme kipleri üzerine bölümler. Konuyu pratik ve anlaşılır anlatan bir kitap."
  - tur: lab
    baslik: "Kendi dosyanı şifrele"
    ayrinti: "Aynı dosyayı `-aes-256-cbc` ile iki kez farklı tuzla şifrele ve çıktıların neden farklı olduğunu açıkla."
---

**Simetrik şifreleme** (symmetric encryption), veriyi şifrelerken ve çözerken **aynı anahtarı** kullanır. Okunabilir metne **düz metin** (plaintext), şifrelenmiş haline **şifreli metin** (ciphertext) denir.

### Nasıl çalışır?

Bir algoritma ve bir anahtar girer, anlamsız görünen şifreli veri çıkar. Anahtarı bilen biri işlemi tersine çevirip düz metne ulaşır. Algoritmanın kendisi gizli değildir; güvenlik **yalnız anahtarın gizli kalmasına** dayanır. Bu ilke, 19. yüzyıldan beri geçerli olan bir kuraldır: bir sistem, algoritma bilinse bile güvenli olmalıdır.

### AES

Bugün kullanılan standart algoritma **AES**'tir (Advanced Encryption Standard). Anahtar uzunluğu 128, 192 ya da 256 bit olabilir. AES-256 bugün bilinen yöntemlerle pratik olarak kırılamaz; gerçek dünyadaki sorunlar neredeyse hiçbir zaman algoritmada değil, anahtarın yönetiminde çıkar.

### Şifreleme kipi

AES bir seferde küçük bir bloğu şifreler. Uzun veriyi şifrelemek için blokların nasıl bağlanacağını belirleyen **kip** (mode) seçilir. Eski ve güvensiz kullanıma açık kipler vardır (ör. ECB, aynı blokları aynı şifreler ve desenleri sızdırır). Modern uygulamalarda **GCM** gibi kimlik doğrulamalı kipler tercih edilir; bunlar hem gizliliği hem de verinin değiştirilmediğini sağlar.

### Anahtar yönetimi: asıl problem

Gerçekte zor olan kısım şunlardır:

1. **Dağıtım**: Karşı tarafa anahtarı güvenli yoldan nasıl ulaştırırsın? İnternetten düz göndersen bütün şifreleme boşa gider. Bunun çözümü bir sonraki dersin konusu, asimetrik şifreleme.
2. **Saklama**: Anahtar kodun içine, repoya ya da yedeğin yanına konmaz. Bir sır yöneticisi ya da anahtar yönetim servisi kullanılır.
3. **Döndürme** (rotation): Anahtarlar belirli aralıklarla ya da ele geçirilme şüphesinde yenilenir.
4. **Erişim**: Anahtarı kimin kullanabileceği en az yetki ilkesiyle sınırlanır.
5. **Ölçek**: 100 kişi birbirleriyle gizli konuşacaksa her çift için ayrı anahtar gerekir; sayı hızla büyür.

### Nerede karşına çıkar?

- Disk şifreleme (Windows BitLocker, Linux LUKS).
- HTTPS bağlantısı kurulduktan sonra trafik simetrik şifreleme ile taşınır.
- Bulut depolama ve veritabanlarında "bekleyen veri şifreleme" (encryption at rest).

Güvenlik notu: Komut satırında `-pass pass:...` ile parola yazmak, komutun işlem listesinde ve kabuk geçmişinde görünmesine yol açar. Bu görevde yalnız örnek bir anahtar kullandığımız için sorun değil; gerçek sırlar için bu yöntemi kullanma.
