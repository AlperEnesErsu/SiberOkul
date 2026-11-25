---
donem: 8
baslik: "Bulut ve izleme bölgesi sınavı"
sorular:
  - soru: "Ekibin bir EC2 sunucusunu Lambda fonksiyonuna taşıyor. İşletim sistemi yamalarının sorumluluğu nasıl değişir?"
    secenekler: [ "Yamalar yine tamamen sende kalır", "Lambda'da işletim sistemini AWS yönetir, kod ve izinler sende kalır", "Sorumluluk müşteri ile üçüncü bir firmaya geçer", "Yamalar bir daha kimsenin sorumluluğu olmaz" ]
    dogru: 1
    aciklama: "Paylaşılan sorumluluk servise göre kayar: EC2'da işletim sistemi yamaları müşteriye aittir, Lambda'da AWS yönetir. Kod, veri ve IAM izinleri her durumda müşteridedir."
    ipucu: "EC2'da işletim sistemini kimin yönettiğini Lambda'yla karşılaştır."
  - soru: "Bir bucket'taki müşteri verisi herkese açık olduğu için sızdı. AWS donanımı ve veri merkezi güvenliği sorunsuz. Sorumluluk kimde?"
    secenekler: [ "Bucket'ı yapılandıran müşteride", "AWS'de, çünkü S3 onların servisi", "Müşteri ve AWS eşit paylaşır", "Veri merkezi sağlayıcısında" ]
    dogru: 0
    aciklama: "Erişim politikası 'bulut içindeki güvenlik' kapsamındadır ve müşteriye aittir. AWS yalnız altyapıyı (bulutun güvenliğini) korur."
    ipucu: "Fiziksel güvenlik ile bucket erişim politikasının hangi tarafın payı olduğunu düşün."
  - soru: "Yeni bir güvenlik mühendisi hesaptaki kök kullanıcıyı (root) günlük işlerde kullanmayı öneriyor. En doğru cevap hangisi?"
    secenekler: [ "Olur, kökte MFA varsa sorun yoktur", "Olur, çünkü kök kısıtlanabilir", "Olmaz, çünkü kök hesap MFA kabul etmez", "Olmaz; yönetici bir kimlik kullanılır, kök yalnız onu gerektiren nadir işlerde açılır" ]
    dogru: 3
    aciklama: "Kök her şeye sınırsız erişir ve IAM politikalarıyla kısıtlanamaz. AWS, kökü yalnız gerektiren işlerde kullanmayı, MFA koymayı ve köke erişim anahtarı üretmemeyi önerir. MFA kabul eder."
    ipucu: "Kökün IAM politikalarıyla ilişkisini ve AWS'nin kök için önerilerini hatırla."
  - soru: "Bir CI işi uzun süredir 14 aylık bir IAM kullanıcı anahtarıyla AWS'ye bağlanıyor. En iyi iyileştirme hangisi?"
    secenekler: [ "Anahtarı bir not dosyasına yazıp ekibe dağıtmak", "Kullanıcıyı yönetici yapıp anahtarı uzatmak", "İşin geçici kimlik bilgileriyle bir rolü üstlenmesini sağlamak", "Anahtarı repoya şifreli olarak koymak" ]
    dogru: 2
    aciklama: "Roller geçici kimlik bilgileri verir; saklanan uzun ömürlü anahtar kalmaz ve sızsa bile kısa sürede geçersiz olur. Diğer seçenekler riski artırır."
    ipucu: "Saklanan uzun ömürlü anahtar yerine geçici bilgi veren bir kimlik türü düşün."
  - soru: "Pull request'te şu ifadeyi görüyorsun: Effect Allow, Action \"*\", Resource \"*\" ve bu bir uygulama rolüne bağlanıyor. Ne yaparsın?"
    secenekler: [ "Onaylarım, uygulama çalışsın diye geniş olması normal", "İzinleri uygulamanın gerçekten kullandığı eylem ve kaynaklara daraltmasını isterim", "Politikanın adını daha anlaşılır yapmasını isterim", "Yalnız Resource'u dar yapıp Action'ı * bırakırım" ]
    dogru: 1
    aciklama: "Her şeye izin veren politika, kimlik çalınırsa hesabın tamamını riske atar. En az yetki ilkesi gereği eylem ve kaynak daraltılır; kullanım için CloudTrail ve Access Analyzer yardımcı olur."
    ipucu: "Hem eylemde hem kaynakta joker olursa kimlik çalındığında neler yapılabilir?"
  - soru: "Bir politikada aynı eylem için hem Allow hem Deny ifadesi eşleşiyor. Sonuç ne olur?"
    secenekler: [ "Deny kazanır", "Hangisi önce yazıldıysa o geçerlidir", "Allow kazanır", "İstek rastgele reddedilir ya da kabul edilir" ]
    dogru: 0
    aciklama: "IAM'de açık Deny her zaman kazanır. Bu yüzden kritik kısıtlar Deny ile güvenceye alınır."
    ipucu: "Çakışan Allow ve Deny için IAM'in değerlendirme kuralını hatırla."
  - soru: "Bir veritabanı sunucusu için en güvenli ağ tasarımı hangisi?"
    secenekler: [ "Özel alt ağda ama güvenlik grubunda tüm portlar herkese açık", "Genel alt ağda, güvenlik grubunda 0.0.0.0/0'dan 5432 açık", "Genel alt ağda, parola uzun diye hiçbir kural yok", "Özel alt ağda, güvenlik grubu yalnız uygulama grubundan 5432'ye izin veriyor" ]
    dogru: 3
    aciklama: "Veritabanı özel alt ağda olmalı ve yalnız ihtiyacı olan kaynaktan gelen trafiğe izin vermeli. Kaynağı başka bir güvenlik grubu olarak yazmak IP değişimlerine karşı da dayanıklıdır."
    ipucu: "Hem alt ağın türünü hem güvenlik grubunun kaynak kuralını düşün."
  - soru: "Bir EC2 güvenlik grubunda SSH (22) portu 0.0.0.0/0 için açık. Bu neden sorundur?"
    secenekler: [ "Güvenlik grupları SSH'yi kabul etmez", "Sunucu otomatik kapanır", "İnternetteki herkes sürekli parola ya da anahtar denemesi yapabilir", "SSH trafiği şifrelenmez" ]
    dogru: 2
    aciklama: "Yönetim portlarının dünyaya açılması kaba kuvvet denemelerini davet eder. Kaynak bilinen IP aralıklarına daraltılmalı ya da portsuz erişim yöntemi kullanılmalı. SSH şifrelidir."
    ipucu: "Yönetim portunu tüm internete açmanın sonucunu düşün; SSH'nin kendisi şifreli midir?"
  - soru: "Bir bucket politikasında Principal olarak \"*\" ve Action olarak s3:GetObject var. Bucket müşteri yedeği içeriyor. En doğru ilk adım?"
    secenekler: [ "Hiçbir şey, nesnelerin adını kimse bilmez", "Politikayı kaldırıp Block Public Access'i açarak erişimi kapatmak, ardından erişim kayıtlarını incelemek", "Şifrelemeyi kapatmak", "Bucket'ın adını değiştirmek" ]
    dogru: 1
    aciklama: "Principal * herkesin okuyabilmesi demektir. Önce açıklığı kapat, sonra olay olup olmadığını anlamak için log'lara bak. Gizli ad güvenlik önlemi değildir."
    ipucu: "Principal * kimleri kapsar? Gizli bir ad güvenlik önlemi midir?"
  - soru: "S3 yeni nesneleri varsayılan olarak SSE-S3 ile şifreler. İzinli bir kimlik yanlışlıkla nesneyi okursa bu şifreleme ne yapar?"
    secenekler: [ "Bir şey yapmaz; yetkili kimlik için nesne otomatik çözülür", "Okumayı kayıt altına alıp reddeder", "Okumayı engeller", "Nesneyi siler" ]
    dogru: 0
    aciklama: "Sunucu tarafı şifreleme durağan veriyi korur (disk ele geçirilirse). Yetkili bir istek geldiğinde S3 nesneyi otomatik çözer, bu yüzden şifreleme yanlış erişim politikasının yerine geçmez."
    ipucu: "Şifreleme diski mi, yetkili okuyucuyu mu hedef alır?"
  - soru: "Bir geliştirici gerçek bir erişim anahtarını public repoya push etti ve birkaç dakika sonra commit'i sildi. Ne yapmalısın?"
    secenekler: [ "Yalnız geliştiriciye uyarı e-postası atmak", "Silindiği için sorun yoktur", "Repoyu private yapıp beklemek", "Anahtarı devre dışı bırakıp yenisini üretmek ve CloudTrail'de kullanımını incelemek" ]
    dogru: 3
    aciklama: "Anahtar git geçmişinde ve kopyalarda durur, tarayıcılar dakikalar içinde bulabilir. Anahtarı iptal edip döndürmek ve kullanımı incelemek gerekir."
    ipucu: "Git geçmişi ve sızan sırrın geçerliliği hakkında düşün: silmek yeter mi?"
  - soru: "Secrets Manager'daki bir parolanın otomatik rotasyonu neyi sağlar?"
    secenekler: [ "Parola hiç sızamaz", "Parolanın uzunluğu iki katına çıkar", "Sır düzenli aralıklarla değişir, bir sızıntının geçerlilik süresi sınırlı kalır", "Uygulama parolayı artık hiç kullanmaz" ]
    dogru: 2
    aciklama: "Rotasyon sırrı periyodik olarak değiştirir ve hedef servisi de günceller. Sızıntıyı önlemez ama ömrünü kısaltır."
    ipucu: "Rotasyon, sızan bir sırrın hangi özelliğini sınırlar?"
  - soru: "Hesapta tanımadığın bir IAM kullanıcısı görüyorsun. Kimin, ne zaman, nereden oluşturduğunu nerede bulursun?"
    secenekler: [ "S3 bucket politikasında", "CloudTrail'deki CreateUser olayında", "VPC yönlendirme tablosunda", "KMS anahtar politikasında" ]
    dogru: 1
    aciklama: "CloudTrail kimin hangi API çağrısını ne zaman ve hangi IP'den yaptığını kaydeder. CreateUser olayının userIdentity ve sourceIPAddress alanları cevabı verir."
    ipucu: "Hesaptaki işlemleri kim, ne zaman, nereden yaptı diye kaydeden servisi düşün."
  - soru: "Bir saldırgan hesaba girdikten sonra izlerini silmek için önce hangi olaya yönelirdi, sen hangisi için alarm kurarsın?"
    secenekler: [ "StopLogging ya da DeleteTrail", "GetCallerIdentity", "ListBuckets", "DescribeInstances" ]
    dogru: 0
    aciklama: "Kayıtları susturan olaylar yüksek değerlidir ve alarmı hak eder. Diğer üçü olağan okuma çağrılarıdır; tek başlarına şüpheli değildir."
    ipucu: "Saldırgan izini silmek için hangi kayıt mekanizmasını susturmak ister?"
  - soru: "Bir CPU alarmı her gece yedek alınırken 2 dakika ötüp kapanıyor ve ekip artık bakmıyor. En uygun çözüm?"
    secenekler: [ "Eşiği %100'e çıkarmak", "Alarmı silmek ve bir daha kurmamak", "Alarmı sadece yöneticiye göndermek", "Değerlendirme penceresini uzatmak ya da bakım penceresinde bastırmak" ]
    dogru: 3
    aciklama: "Beklenen ve geçici artışlar için değerlendirme süresi ayarlanır ya da bakım penceresi tanımlanır. Alarm yorgunluğu gerçek alarmları da kaçırtır; silmek ya da eşiği anlamsızlaştırmak çözüm değildir."
    ipucu: "Her gece beklenen ve tekrarlayan bir olay için alarm nasıl akıllı hale getirilir?"
  - soru: "Aynı IP'den 10 dakikada 3 başarısız giriş ve ardından başarılı giriş görüyorsun. Bu desene ne denir ve neden tek satırlık kurallar yetmez?"
    secenekler: [ "Rotasyon; anahtarlar değişmiştir", "Şifreleme; satırlar şifrelenmiştir", "Korelasyon; her satır tek başına olağandır, sıra ve zaman birlikte şüphelidir", "Yedekleme; satırlar kopyalanmıştır" ]
    dogru: 2
    aciklama: "Korelasyon kuralı birden çok olayı bir zaman penceresinde birleştirir. Tek tek bakılan satırlar bu hikayeyi göstermez. Pencere ve eşik gerçek veriyle ayarlanır."
    ipucu: "Tek satır yerine olayları desen, pencere ve anahtarla bağlayan kavramı düşün."
  - soru: "Sızdığından emin olduğun bir erişim anahtarı için müdahalede doğru sıra hangisi?"
    secenekler: [ "Önce anahtarı sil, sonra herkesten gizle, loglara hiç bakma", "Önce anahtarı devre dışı bırak, sonra kayıtlardan kapsamı çıkar, yeni oluşturulan kimlikleri temizle, anahtarı yenile, öğren", "Önce hesabı sil", "Önce raporu yaz, sonra gerekirse anahtarı kapat" ]
    dogru: 1
    aciklama: "Önce sınırla (devre dışı bırak), sonra kapsamı belirle (CloudTrail), saldırganın bıraktıklarını temizle, yeni kimlik bilgisi üret ve olaydan öğren. Kayıtlara bakmak atlanırsa arka kapılar kalır."
    ipucu: "Önce sınırla, sonra kapsamı belirle; sıralamaya dikkat et."
  - soru: "Şirketin tek yedeği üretimle aynı hesapta ve yöneticinin silebildiği bir bucket'ta. Fidye yazılımı yönetici anahtarını ele geçirirse ne olur ve düzeltme nedir?"
    secenekler: [ "Yedek de silinebilir; yedeği ayrı hesapta, değiştirilemez depolamada tutup geri yüklemeyi denemek gerekir", "Yedek zarar görmez, çünkü bulutta", "Yedek otomatik olarak daha güvenli hale gelir", "Fidye ödemek tek seçenek olur" ]
    dogru: 0
    aciklama: "Saldırganlar önce yedekleri hedefler. Ayrı hesap, Object Lock gibi değiştirilemez depolama ve düzenli geri yükleme denemesi savunmayı oluşturur; aynı yetkiyle silinebilen yedek koruma sağlamaz."
    ipucu: "Saldırgan yönetici yetkisini ele geçirince hangi yedek yine erişilemez kalır?"
---
