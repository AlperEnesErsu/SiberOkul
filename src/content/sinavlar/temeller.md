---
donem: 3
baslik: "Güvenlik temelleri bölgesi sınavı"
sorular:
  - soru: "Bir saldırgan, bir e-ticaret sitesinin veritabanındaki ürün fiyatlarını gizlice düşürdü. Site çalışıyor ve kimse veri okumadı. Hangi CIA ögesi ihlal edildi?"
    secenekler: ["Gizlilik","Bütünlük","Erişilebilirlik","Yetkilendirme"]
    dogru: 1
    aciklama: "Veri değiştirildiği için bütünlük bozuldu. Gizlilik, bilginin okunmasıyla; erişilebilirlik, kullanılamamasıyla ilgilidir. Yetkilendirme CIA'nın ögesi değildir."
  - soru: "Bir ekip, sistemi aşırı sıkı kilitledi; meşru kullanıcılar da giriş yapamıyor. Bu durumda hangi CIA ögesi zayıfladı?"
    secenekler: ["Bütünlük","Gizlilik","Hash","Erişilebilirlik"]
    dogru: 3
    aciklama: "Meşru kullanıcıların hizmete ulaşamaması erişilebilirlik kaybıdır. Gizlilik artmış olabilir; bu, önlemlerin birbiriyle dengelenmesi gerektiğini gösterir."
  - soru: "Bir raporda 'Bu kütüphanedeki zafiyetin CVSS puanı 9.8' yazıyor. Ancak kütüphane internete kapalı bir test makinesinde çalışıyor. Doğru yorum hangisidir?"
    secenekler: ["Puan ortama bakmaz; gerçek risk için erişilebilirlik ve etki de değerlendirilmeli","Puan 9.8 olduğu için her koşulda en acil iştir","Kapalı makinede zafiyet yoktur","CVSS puanı yalnızca etkiyi ölçer, olasılığı değil ve bu yüzden güvenilmezdir"]
    dogru: 0
    aciklama: "CVSS zafiyetin teknik şiddetini ölçer. Risk, olasılık ve etkiye de bağlıdır; internete kapalı bir ortamda olasılık düşer. Zafiyet yine vardır, yalnız öncelik değişebilir."
  - soru: "Bir ekip yeni bir yazılımdaki 'CVE-YYYY-NNNN' kaydını inceliyor. CVE kimliği tam olarak neyi tanımlar?"
    secenekler: ["Zafiyetin ne kadar ciddi olduğunu","Zafiyeti kapatan yamayı","Bilinen belirli bir zafiyeti, herkesin aynı şeyden bahsetmesi için","Saldırıyı yapan grubu"]
    dogru: 2
    aciklama: "CVE bir zafiyet kimliğidir. Ciddiyeti puanlayan şey CVSS'tir; yama ve saldırgan bilgisi ayrı kayıtlarda tutulur."
  - soru: "Bir API'ye istek attın ve '403 Forbidden' aldın. Neyi gösterir?"
    secenekler: ["Kimliğin doğrulanamadı","Sunucu çöktü","Kimliğin biliniyor ama bu işlem için yetkin yok","İstek biçimi hatalı"]
    dogru: 2
    aciklama: "403 yetkilendirme sorunudur. Kimlik doğrulanamadığında genelde 401 dönülür."
  - soru: "Bir saldırgan geçerli bir oturum token'ını ele geçirdi. Parolayı bilmediği halde hesaba neden girebilir?"
    secenekler: ["Sunucu token'ı gösteren kişiyi zaten doğrulanmış sayar","Token parolanın şifreli halidir","Token hesabın parolasını sıfırlar","Oturum açıkken parola kontrolü her zaman kapatılır"]
    dogru: 0
    aciklama: "Token, 'bu kişi doğrulandı' kanıtı olarak çalışır. Bu yüzden gizli tutulmalı, kısa ömürlü olmalı ve gerektiğinde iptal edilebilmelidir."
  - soru: "Bir sızıntıda iki farklı kullanıcının parola hash'i birebir aynı çıktı. Bu sistemle ilgili en olası sonuç nedir?"
    secenekler: ["Argon2id kullanılıyor","Parolalar şifreli saklanıyor ve anahtar aynı","İki kullanıcı aynı kişidir","Hash'ler tuzsuz saklanıyor"]
    dogru: 3
    aciklama: "Doğru tuzlamada aynı parola farklı hash verir. Aynı hash, tuz kullanılmadığını gösterir ve bir hash kırılınca aynı parolayı kullanan herkesinki açılır."
  - soru: "Parola saklamak için neden SHA-256 yerine bcrypt ya da Argon2 tercih edilir?"
    secenekler: ["SHA-256 çok yavaştır","Bcrypt ve Argon2 bilerek yavaştır, böylece her tahmin saldırgana pahalıya gelir","SHA-256 şifreleme olduğu için geri çevrilebilir","Bcrypt hash üretmez, şifreler"]
    dogru: 1
    aciklama: "Hızlı hash saldırgana saniyede milyarlarca tahmin sağlar. Parola için tasarlanmış algoritmalar bunu kasıtlı olarak yavaşlatır."
  - soru: "NIST'in güncel rehberi parola politikaları konusunda hangisini önerir?"
    secenekler: ["Yalnızca ele geçirildiğine dair kanıt varsa değiştirmeyi istemek","Parolayı her 90 günde değiştirmeye zorlamak","Yapıştırma (paste) işlemini engellemek","Karakter türlerini karıştırmayı zorunlu kılmak"]
    dogru: 0
    aciklama: "NIST periyodik zorunlu değişimi yasaklar; yalnız ele geçirme kanıtı olduğunda değişim ister. Karışım kuralları da önerilmez, uzunluk önemlidir."
  - soru: "Bir saldırgan sahte bir giriş sayfası kurup kurbanın parolasını ve Authenticator kodunu anında gerçek siteye iletiyor. Hangisi bu saldırıya karşı en dayanıklıdır?"
    secenekler: ["SMS kodu","TOTP kodu","Güvenlik sorusu","Passkey"]
    dogru: 3
    aciklama: "Passkey kimlik bilgisini yalnızca gerçek alan adına bağlar; sahte sitede çalışmaz. SMS ve TOTP kodları kurbandan alınıp anında kullanılabilir."
  - soru: "SIM swap saldırısı hangi doğrulama yöntemini en çok zayıflatır?"
    secenekler: ["Güvenlik anahtarı","Passkey","SMS ile gönderilen kod","Parola yöneticisi"]
    dogru: 2
    aciklama: "Saldırgan numarayı kendi SIM'ine taşıdığı için SMS kodları ona ulaşır. Güvenlik anahtarı ve passkey telefon numarasına bağlı değildir."
  - soru: "Bir ekip veritabanı yedeğini AES-256 ile şifreledi ama anahtarı yedekle aynı klasöre koydu. Sorun nedir?"
    secenekler: ["AES-256 yeterince güçlü değil","Yedeğe erişen herkes anahtara da erişir, şifreleme koruma sağlamaz","Anahtar uzunluğu yetersiz","Şifreli yedek geri yüklenemez"]
    dogru: 1
    aciklama: "Simetrik şifrelemede güvenlik anahtarın gizliliğine bağlıdır. Anahtar veriden ayrı ve daha sıkı korunan bir yerde tutulmalıdır."
  - soru: "Bir yazılım güncellemesi imzalanmış. Saldırgan güncelleme sunucusunu ele geçirip dosyaya zararlı kod ekledi ama imza anahtarına erişemedi. İstemci ne yapar?"
    secenekler: ["Güncellemeyi kabul eder, çünkü sunucu güvenilir","Hash'i otomatik düzeltir","İmza doğrulaması başarısız olur ve güncelleme reddedilir","Dosyayı yeni bir anahtarla yeniden imzalar"]
    dogru: 2
    aciklama: "İmza belirli içeriğe aittir; içerik değişince doğrulama başarısız olur. Saldırgan gizli anahtar olmadan geçerli imza üretemez."
  - soru: "Bir indirme sayfasında dosya ve SHA-256 değeri aynı sunucuda yayımlanmış. Sunucu ele geçirilirse hash seni neden korumaz?"
    secenekler: ["SHA-256 kırılmış bir algoritmadır","Hash her zaman dosyadan farklı çıkar","Hash yalnız .iso dosyalarında çalışır","Saldırgan dosyayla birlikte hash'i de değiştirir"]
    dogru: 3
    aciklama: "Hash ayrı, güvenilir bir kanaldan gelmeli ya da yayıncının imzası doğrulanmalıdır. Aynı yerde duran hash, saldırgan tarafından da güncellenebilir."
  - soru: "Bir çalışana 'hesabınız 2 saat içinde kapanacak, hemen doğrulayın' diye e-posta geldi. Bağlantıdaki adres 'giris.banka.com.dogrula.example'. Bu adres kime aittir?"
    secenekler: ["banka.com","dogrula.example","giris.banka.com","Adres geçersizdir"]
    dogru: 1
    aciklama: "Gerçek sahip, alan adının sağ tarafındaki kısımdır (dogrula.example). Başa eklenen banka.com yalnız aldatmacadır. Aciliyet baskısı da oltalamanın klasik işaretidir."
  - soru: "Bir kullanıcı, 'faydalı bir ekran görüntüsü aracı' diye bir program indirip kurdu ve program arka planda parolaları toplamaya başladı. Bu hangi tür zararlıdır?"
    secenekler: ["Solucan","Rootkit","Truva atı","Fidye yazılımı"]
    dogru: 2
    aciklama: "Faydalı görünüp içinde zararlı işlev taşıyan ve kullanıcının kendi eliyle kurduğu yazılıma truva atı denir. Solucan kendi başına yayılır."
  - soru: "Bir CI hattı üretim veritabanında yalnız test sonuçlarını okuyor ama yönetici hesabıyla bağlanıyor. Hangi ilke ihlal edilmiştir?"
    secenekler: ["En az yetki","Sıfır güven","Çığ etkisi","Tuzlama"]
    dogru: 0
    aciklama: "Hat yalnız gerekli yetkiyle çalışmalıdır. Aksi halde hesap sızarsa saldırgan veritabanını silebilir ya da değiştirebilir."
  - soru: "Sunucuda tanımadığın, sürekli yüksek CPU kullanan bir işlem gördün. Olay müdahalesi açısından ilk doğru adım hangisidir?"
    secenekler: ["Bilgi toplayıp sistemi ağdan ayırarak sınırlamak ve ilgili ekibe haber vermek","İşlemi ve dizinini hemen silmek","Sunucuyu yeniden başlatıp bakmak","Hiçbir şey yapmadan bir hafta izlemek"]
    dogru: 0
    aciklama: "Önce kanıtı ve zamanlamayı kaydet, sonra yayılmayı sınırla ve haber ver. Hemen silmek ya da yeniden başlatmak kanıtı yok eder, hiçbir şey yapmamak saldırgana zaman tanır."
---
