---
kimlik: temeller-011
baslik: "Derinlemesine savunma ve en az yetki"
donem: 3
sira: 11
sure: 30
neden: "Hiçbir tek önlem kusursuz değildir; olgun bir savunma, bir katman düşünce diğerinin yakalaması üzerine kuruludur. En az yetki ilkesi ise CI hesabından Kubernetes servis hesabına kadar her yerde 'ele geçirilirse en fazla ne kaybederiz?' sorusunun cevabını küçültür. Bu iki fikir, sonraki bölgelerdeki hemen her tasarım kararının arkasındadır."
analoji:
  baslik: "Kale"
  metin: "Bir kalede hendek, sur, kapı, muhafız ve en içte kasa vardır. Biri aşılırsa sıradaki devreye girer. Ayrıca herkesin her odaya anahtarı yoktur: aşçı silah odasına giremez. Sınır: kale çevresi belliydi; bugünkü sistemlerde içeri ve dışarı ayrımı bulanıktır, bu yüzden sıfır güven fikri 'içerdeyse güvenilir' varsayımını reddeder."
gorev:
  aciklama: "Linux'ta en az yetkiyi dosya izinleriyle dene. `/tmp` altında bir dizin ve dosya oluştur, izinleri daralt ve ne olduğunu gör. Sıradan kullanıcı olarak çalışmak da bir katmandır."
  komutlar:
    - id
    - mkdir -p /tmp/yetki && cd /tmp/yetki
    - echo "sir" > gizli.txt
    - ls -l gizli.txt
    - chmod 600 gizli.txt
    - ls -l gizli.txt
    - chmod 666 gizli.txt
    - ls -l gizli.txt
    - chmod 600 gizli.txt
    - sudo -l
  soru: "600 ile 666 arasındaki fark ne? Herkesin yazabildiği bir dosya hangi CIA ögesini tehdit eder? `sudo -l` çıktısı sana ne kadar yetki tanıdığını nasıl gösteriyor?"
  telefon:
    soru: "Bir CI hattı üretim veritabanına bağlanmak için yönetici hesabı kullanıyor, oysa yalnız test sonuçlarını okuyor. Bu hesap sızarsa ne olur ve en az yetki ilkesine göre ne değişmeli?"
    cevap: "Saldırgan veritabanını silebilir, değiştirebilir. Hat için yalnız gereken tabloları okuyabilen ayrı, kısıtlı bir hesap oluşturulmalı; hatta test sonuçları için üretim veritabanına hiç erişimi olmamalı."
sorular:
  - id: temeller-011-s1
    soru: "Derinlemesine savunma (defense in depth) nedir ve neden tek bir güçlü önleme güvenmekten iyidir?"
    cevap: "Birden fazla bağımsız güvenlik katmanı kullanmaktır (ağ, kimlik, uygulama, veri, izleme). Tek önlem kusursuz olamaz ve atlatılabilir; katmanlar sayesinde biri düşse diğeri saldırıyı yavaşlatır ya da yakalar."
    ipucu: "Tek bir kapının kırılması durumunda geriye ne kalmalı?"
  - id: temeller-011-s2
    soru: "En az yetki ilkesi nedir? Bir örnek ver."
    cevap: "Bir kullanıcıya, servise ya da sürece yalnızca işini yapmak için gerekli yetkiyi, gerekli süre kadar vermektir. Örneğin yedek alan servis yalnız okuma izni alır; silme ve yazma izni almaz."
    ipucu: "Bir hesabın yetkisi genişse sızması ne kadar zarar verir?"
  - id: temeller-011-s3
    soru: "Katmanlı savunmada bir katmanın başarısız olduğunu fark etmek için ne gerekir?"
    cevap: "İzleme ve günlükleme. Hangi katmanın atlatıldığını görmek için alarm ve kayıt gerekir; aksi halde saldırgan fark edilmeden ilerler ve diğer katmanların hâlâ çalıştığına güvenilir."
    ipucu: "Bir katman çökerse bunu fark edecek şey ne olmalı?"
  - id: temeller-011-s4
    soru: "Sıfır güven (zero trust) 'ağın içindekilere güven' anlayışından nasıl ayrılır?"
    cevap: "Eski anlayış çevreyi korur ve içeridekine güvenir. Sıfır güven konumdan bağımsız hiçbir kullanıcıya ya da cihaza varsayılan güven vermez; her istek doğrulanır ve yetkilendirilir. Böylece içeri girmiş saldırgan serbestçe dolaşamaz."
    ipucu: "Ağın içinde olmak neden artık güven sebebi sayılmıyor?"
  - id: temeller-011-s5
    soru: "Pipeline'daki dağıtım hesabının yalnız bir ortama yazması gerekirken bütün üretim hesaplarında yönetici yetkisi var. Kod incelemesinde bunu fark ettin. Ne önerirsin?"
    cevap: "Hesabın yetkisini yalnız gereken ortama ve gereken işlemlere indirgemeyi (en az yetki) öneririm. Ek olarak kimlik bilgilerini kısa ömürlü yaparım, hesap kullanımını kayda alırım ve başka bir katman olarak üretime dağıtım için onay adımı eklerim. Böylece hesap sızsa bile etki sınırlı kalır."
    ipucu: "Hesap sızarsa saldırganın neleri yapabilmesini istemezsin?"
hizliKontrol:
  - soru: "Derinlemesine savunmanın temel fikri nedir?"
    secenekler: ["Tek ve çok güçlü bir önleme güvenmek","Bir katman başarısız olursa diğerlerinin korumaya devam etmesi için birden çok katman kurmak","Yalnız ağ çevresini sertleştirmek","Güvenlik duvarını yedeklemek"]
    dogru: 1
    aciklama: "Hiçbir önlem kusursuz değildir; katmanlar biri aşıldığında diğerlerinin devreye girmesini sağlar."
    ipucu: "Hiçbir kapı tek başına kusursuz değil."
  - soru: "Sıfır güven yaklaşımı hangi varsayımı reddeder?"
    secenekler: ["Her isteğin doğrulanması gerektiğini","Ağın içindekilerin otomatik olarak güvenilir olduğunu","Yetkilerin sınırlanması gerektiğini","Kayıt tutmanın gerekliliğini"]
    dogru: 1
    aciklama: "Sıfır güven, 'içerideysen güvenilirsin' fikrini bırakır; her istek kimlik ve bağlama göre doğrulanır."
    ipucu: "Eski modelde ağın içine girmek neyi sağlıyordu?"
sikHatalar:
  - hata: "Kolaylık olsun diye servis hesabına yönetici yetkisi vermek."
    dogrusu: "Önce gereken en küçük izinle başla; ihtiyaç doğdukça tek tek ekle."
  - hata: "Katmanlar var diye izleme kurmamak."
    dogrusu: "Bir katmanın çöktüğünü fark etmek için günlük kayıtları ve uyarılar gerekir."
terimler:
  - "Derinlemesine savunma"
  - "En az yetki"
  - "Sıfır güven"
derinDalis:
  - tur: okuma
    baslik: "CISA Zero Trust Maturity Model"
    ayrinti: "Sıfır güven fikrinin sütunlara ve olgunluk aşamalarına bölünmüş resmi çerçevesi."
    url: "https://www.cisa.gov/zero-trust-maturity-model"
  - tur: kitap
    baslik: "Building Secure and Reliable Systems (Google)"
    ayrinti: "En az yetki ve savunma katmanlarını gerçek sistemlerde anlatan bölümler; kitap Google tarafından ücretsiz yayımlanıyor."
---

Güvenlik tek bir kilitle olmaz. Bu ders iki tamamlayıcı fikri anlatır.

### Derinlemesine savunma (defense in depth)

Her önlemin bir açığı olabilir, bir gün biri atlatılacaktır. Bunu kabul eden yaklaşım, birbirinden **bağımsız katmanlar** koymaktır. Bir web uygulaması için örnek:

| Katman | Örnek önlem |
|---|---|
| Ağ | Güvenlik duvarı, gereksiz portların kapalı olması |
| Kimlik | MFA, güçlü parola |
| Uygulama | Girdi doğrulama, güncel bağımlılıklar |
| Veri | Şifreleme, yedekleme |
| Cihaz/sunucu | Yama, minimum kurulum |
| İzleme | Günlük, alarm |

Katmanların işe yarayabilmesi için **bağımsız** olması gerekir: ikisi de aynı parolaya bağlıysa tek katmandır. Ve **izleme** kritiktir; hangi katmanın atlatıldığını göremiyorsan diğerlerinin ayakta olduğunu da bilemezsin.

### En az yetki (least privilege)

Her kullanıcı, servis ve süreç, işini yapmaya yetecek **en küçük yetkiyle** çalışır:

- Günlük işler için yönetici (root) hesabı kullanılmaz.
- Yedekleme servisi okur ama silmez.
- CI hattının üretime erişimi yoksa ya da çok daralmışsa, hattın sızması felaket olmaz.
- Yetkiler **süreyle** de sınırlanır: işi biten geçici izin kaldırılır.

Sorulacak soru: "Bu hesap ele geçirilirse saldırgan en fazla ne yapar?" Cevap büyükse yetki fazladır. Buna **patlama yarıçapını** (blast radius) küçültmek de denir.

Yaygın hata: "Çalışmıyor, şimdilik hepsine izin verelim." Bu geçici ayar çoğu zaman kalıcı olur. Sonraki bölgelerde bunun karşılıkları var: Docker'da root olmayan kullanıcı, Kubernetes RBAC, bulut IAM politikaları.

### Sıfır güven (zero trust)

Eski model kale gibiydi: dışarısı tehlikeli, içerisi güvenilir. Uzaktan çalışma, bulut ve mobil cihazlarla çevre silindi. **Sıfır güven** şunu der: ağın içinde olmak güven sebebi değildir. Her istekte kimlik, cihaz durumu ve yetki doğrulanır; yetkiler dar tutulur; ihlal olmuş gibi tasarlanır.

### Üç fikir birlikte

Katmanlar saldırganı yavaşlatır. En az yetki, bir katman düştüğünde zararı sınırlar. Sıfır güven, içeri sızmanın otomatik olarak her kapıyı açmamasını sağlar. İzleme üçünün de çalıştığını gösterir.

Güvenlik notu: Güvenliği tek bir ürüne ("güvenlik duvarımız var") bağlamak sahte güven doğurur. Katman say, her katmanın başarısız olduğunu varsay ve bir sonrakinin ne yapacağını sor.
