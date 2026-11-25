---
donem: 3
baslik: "Güvenlik temelleri bölgesi sınavı"
sorular:
  - soru: "Bir saldırgan, bir e-ticaret sitesinin veritabanındaki ürün fiyatlarını gizlice düşürdü. Site çalışıyor ve kimse veri okumadı. Hangi CIA ögesi ihlal edildi?"
    secenekler: [ "Gizlilik", "Bütünlük", "Erişilebilirlik", "Yetkilendirme" ]
    dogru: 1
    aciklama: "Veri değiştirildiği için bütünlük bozuldu. Gizlilik, bilginin okunmasıyla; erişilebilirlik, kullanılamamasıyla ilgilidir. Yetkilendirme CIA'nın ögesi değildir."
    ipucu: "Veri okunmadı ve hizmet çalışıyor; değişen şeyin ne olduğuna bak."
  - soru: "Bir ekip, sistemi aşırı sıkı kilitledi; meşru kullanıcılar da giriş yapamıyor. Bu durumda hangi CIA ögesi zayıfladı?"
    secenekler: [ "Erişilebilirlik", "Gizlilik", "Hash", "Bütünlük" ]
    dogru: 0
    aciklama: "Meşru kullanıcıların hizmete ulaşamaması erişilebilirlik kaybıdır. Gizlilik artmış olabilir; bu, önlemlerin birbiriyle dengelenmesi gerektiğini gösterir."
    ipucu: "Önlemi sertleştirmenin meşru kullanıcıya etkisini düşün."
  - soru: "Bir raporda 'Bu kütüphanedeki zafiyetin CVSS puanı 9.8' yazıyor. Ancak kütüphane internete kapalı bir test makinesinde çalışıyor. Doğru yorum hangisidir?"
    secenekler: [ "CVSS puanı yalnızca etkiyi ölçer, olasılığı değil ve bu yüzden güvenilmezdir", "Puan 9.8 olduğu için her koşulda en acil iştir", "Kapalı makinede zafiyet yoktur", "Puan ortama bakmaz; gerçek risk için erişilebilirlik ve etki de değerlendirilmeli" ]
    dogru: 3
    aciklama: "CVSS zafiyetin teknik şiddetini ölçer. Risk, olasılık ve etkiye de bağlıdır; internete kapalı bir ortamda olasılık düşer. Zafiyet yine vardır, yalnız öncelik değişebilir."
    ipucu: "Puan tek başına neyi ölçer; ortam hangi iki etkeni değiştirir?"
  - soru: "Bir ekip yeni bir yazılımdaki 'CVE-YYYY-NNNN' kaydını inceliyor. CVE kimliği tam olarak neyi tanımlar?"
    secenekler: [ "Zafiyetin ne kadar ciddi olduğunu", "Zafiyeti kapatan yamayı", "Bilinen belirli bir zafiyeti, herkesin aynı şeyden bahsetmesi için", "Saldırıyı yapan grubu" ]
    dogru: 2
    aciklama: "CVE bir zafiyet kimliğidir. Ciddiyeti puanlayan şey CVSS'tir; yama ve saldırgan bilgisi ayrı kayıtlarda tutulur."
    ipucu: "CVE bir numara/etiket mi, puan mı, yama mı?"
  - soru: "Bir API'ye istek attın ve '403 Forbidden' aldın. Neyi gösterir?"
    secenekler: [ "Kimliğin doğrulanamadı", "Kimliğin biliniyor ama bu işlem için yetkin yok", "Sunucu çöktü", "İstek biçimi hatalı" ]
    dogru: 1
    aciklama: "403 yetkilendirme sorunudur. Kimlik doğrulanamadığında genelde 401 dönülür."
    ipucu: "Kimliğin tanındığı ama izin verilmediği durum hangi kavram?"
  - soru: "Bir saldırgan geçerli bir oturum token'ını ele geçirdi. Parolayı bilmediği halde hesaba neden girebilir?"
    secenekler: [ "Sunucu token'ı gösteren kişiyi zaten doğrulanmış sayar", "Token parolanın şifreli halidir", "Token hesabın parolasını sıfırlar", "Oturum açıkken parola kontrolü her zaman kapatılır" ]
    dogru: 0
    aciklama: "Token, 'bu kişi doğrulandı' kanıtı olarak çalışır. Bu yüzden gizli tutulmalı, kısa ömürlü olmalı ve gerektiğinde iptal edilebilmelidir."
    ipucu: "Sunucu her istekte parolayı değil neyi kontrol ediyor?"
  - soru: "Bir sızıntıda iki farklı kullanıcının parola hash'i birebir aynı çıktı. Bu sistemle ilgili en olası sonuç nedir?"
    secenekler: [ "Argon2id kullanılıyor", "Parolalar şifreli saklanıyor ve anahtar aynı", "İki kullanıcı aynı kişidir", "Hash'ler tuzsuz saklanıyor" ]
    dogru: 3
    aciklama: "Doğru tuzlamada aynı parola farklı hash verir. Aynı hash, tuz kullanılmadığını gösterir ve bir hash kırılınca aynı parolayı kullanan herkesinki açılır."
    ipucu: "Doğru tuzlamada aynı parola aynı hash'i verir miydi?"
  - soru: "Parola saklamak için neden SHA-256 yerine bcrypt ya da Argon2 tercih edilir?"
    secenekler: [ "SHA-256 çok yavaştır", "SHA-256 şifreleme olduğu için geri çevrilebilir", "Bcrypt ve Argon2 bilerek yavaştır, böylece her tahmin saldırgana pahalıya gelir", "Bcrypt hash üretmez, şifreler" ]
    dogru: 2
    aciklama: "Hızlı hash saldırgana saniyede milyarlarca tahmin sağlar. Parola için tasarlanmış algoritmalar bunu kasıtlı olarak yavaşlatır."
    ipucu: "Bu amaçta hızın saldırgana ne sağladığını düşün."
  - soru: "NIST'in güncel rehberi parola politikaları konusunda hangisini önerir?"
    secenekler: [ "Parolayı her 90 günde değiştirmeye zorlamak", "Yalnızca ele geçirildiğine dair kanıt varsa değiştirmeyi istemek", "Yapıştırma (paste) işlemini engellemek", "Karakter türlerini karıştırmayı zorunlu kılmak" ]
    dogru: 1
    aciklama: "NIST periyodik zorunlu değişimi yasaklar; yalnız ele geçirme kanıtı olduğunda değişim ister. Karışım kuralları da önerilmez, uzunluk önemlidir."
    ipucu: "NIST son yıllarda kuralları sadeleştirdi; hangi alışkanlığı bıraktırdı?"
  - soru: "Bir saldırgan sahte bir giriş sayfası kurup kurbanın parolasını ve Authenticator kodunu anında gerçek siteye iletiyor. Hangisi bu saldırıya karşı en dayanıklıdır?"
    secenekler: [ "Passkey", "TOTP kodu", "Güvenlik sorusu", "SMS kodu" ]
    dogru: 0
    aciklama: "Passkey kimlik bilgisini yalnızca gerçek alan adına bağlar; sahte sitede çalışmaz. SMS ve TOTP kodları kurbandan alınıp anında kullanılabilir."
    ipucu: "Kodun anında iletilebildiği durumda hangi yöntem alan adına bağlıdır?"
  - soru: "SIM swap saldırısı hangi doğrulama yöntemini en çok zayıflatır?"
    secenekler: [ "Güvenlik anahtarı", "Passkey", "Parola yöneticisi", "SMS ile gönderilen kod" ]
    dogru: 3
    aciklama: "Saldırgan numarayı kendi SIM'ine taşıdığı için SMS kodları ona ulaşır. Güvenlik anahtarı ve passkey telefon numarasına bağlı değildir."
    ipucu: "Saldırı telefon numarasının kime ait olduğunu değiştiriyor."
  - soru: "Bir ekip veritabanı yedeğini AES-256 ile şifreledi ama anahtarı yedekle aynı klasöre koydu. Sorun nedir?"
    secenekler: [ "AES-256 yeterince güçlü değil", "Anahtar uzunluğu yetersiz", "Yedeğe erişen herkes anahtara da erişir, şifreleme koruma sağlamaz", "Şifreli yedek geri yüklenemez" ]
    dogru: 2
    aciklama: "Simetrik şifrelemede güvenlik anahtarın gizliliğine bağlıdır. Anahtar veriden ayrı ve daha sıkı korunan bir yerde tutulmalıdır."
    ipucu: "Güvenliği algoritma mı, anahtarın nerede durduğu mu belirliyor?"
  - soru: "Bir yazılım güncellemesi imzalanmış. Saldırgan güncelleme sunucusunu ele geçirip dosyaya zararlı kod ekledi ama imza anahtarına erişemedi. İstemci ne yapar?"
    secenekler: [ "Güncellemeyi kabul eder, çünkü sunucu güvenilir", "İmza doğrulaması başarısız olur ve güncelleme reddedilir", "Hash'i otomatik düzeltir", "Dosyayı yeni bir anahtarla yeniden imzalar" ]
    dogru: 1
    aciklama: "İmza belirli içeriğe aittir; içerik değişince doğrulama başarısız olur. Saldırgan gizli anahtar olmadan geçerli imza üretemez."
    ipucu: "İmza hangi şeye bağlıdır ve içerik değişince ne olur?"
  - soru: "Bir indirme sayfasında dosya ve SHA-256 değeri aynı sunucuda yayımlanmış. Sunucu ele geçirilirse hash seni neden korumaz?"
    secenekler: [ "Saldırgan dosyayla birlikte hash'i de değiştirir", "Hash her zaman dosyadan farklı çıkar", "Hash yalnız .iso dosyalarında çalışır", "SHA-256 kırılmış bir algoritmadır" ]
    dogru: 0
    aciklama: "Hash ayrı, güvenilir bir kanaldan gelmeli ya da yayıncının imzası doğrulanmalıdır. Aynı yerde duran hash, saldırgan tarafından da güncellenebilir."
    ipucu: "Hash ile dosya aynı yerden geliyorsa saldırganın elinde ne var?"
  - soru: "Bir çalışana 'hesabınız 2 saat içinde kapanacak, hemen doğrulayın' diye e-posta geldi. Bağlantıdaki adres 'giris.banka.com.dogrula.example'. Bu adres kime aittir?"
    secenekler: [ "banka.com", "Adres geçersizdir", "giris.banka.com", "dogrula.example" ]
    dogru: 3
    aciklama: "Gerçek sahip, alan adının sağ tarafındaki kısımdır (dogrula.example). Başa eklenen banka.com yalnız aldatmacadır. Aciliyet baskısı da oltalamanın klasik işaretidir."
    ipucu: "Alan adı sağdan sola okunur; gerçek sahibini bul."
  - soru: "Bir kullanıcı, 'faydalı bir ekran görüntüsü aracı' diye bir program indirip kurdu ve program arka planda parolaları toplamaya başladı. Bu hangi tür zararlıdır?"
    secenekler: [ "Solucan", "Rootkit", "Truva atı", "Fidye yazılımı" ]
    dogru: 2
    aciklama: "Faydalı görünüp içinde zararlı işlev taşıyan ve kullanıcının kendi eliyle kurduğu yazılıma truva atı denir. Solucan kendi başına yayılır."
    ipucu: "Yararlı görünüp kullanıcının kendi eliyle kurulan yazılım hangi türdür?"
  - soru: "Bir CI hattı üretim veritabanında yalnız test sonuçlarını okuyor ama yönetici hesabıyla bağlanıyor. Hangi ilke ihlal edilmiştir?"
    secenekler: [ "Sıfır güven", "En az yetki", "Çığ etkisi", "Tuzlama" ]
    dogru: 1
    aciklama: "Hat yalnız gerekli yetkiyle çalışmalıdır. Aksi halde hesap sızarsa saldırgan veritabanını silebilir ya da değiştirebilir."
    ipucu: "Hattın ihtiyacı olan yetki ile sahip olduğu yetkiyi karşılaştır."
  - soru: "Sunucuda tanımadığın, sürekli yüksek CPU kullanan bir işlem gördün. Olay müdahalesi açısından ilk doğru adım hangisidir?"
    secenekler: [ "Bilgi toplayıp sistemi ağdan ayırarak sınırlamak ve ilgili ekibe haber vermek", "İşlemi ve dizinini hemen silmek", "Sunucuyu yeniden başlatıp bakmak", "Hiçbir şey yapmadan bir hafta izlemek" ]
    dogru: 0
    aciklama: "Önce kanıtı ve zamanlamayı kaydet, sonra yayılmayı sınırla ve haber ver. Hemen silmek ya da yeniden başlatmak kanıtı yok eder, hiçbir şey yapmamak saldırgana zaman tanır."
    ipucu: "Önce kanıt ve yayılma: silmeden önce ne yapılmalı?"
---
