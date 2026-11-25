---
kimlik: temeller-010
baslik: "Zararlı yazılım türleri"
donem: 3
sira: 10
sure: 25
neden: "Üretim sunucularına, CI çalıştırıcılarına ve geliştirici makinelerine bulaşan zararlı yazılım doğrudan senin sorumluluk alanındadır. Türleri ve yayılma yollarını bilmek, bir belirtiyi gördüğünde ne olduğunu anlamanı ve doğru sınırlamayı yapmanı sağlar. Yazılım tedarik zinciri saldırılarında zararlı kod çoğu zaman bağımlılık yoluyla girer."
analoji:
  baslik: "Hastalık türleri"
  metin: "Virüs, bir konağa yapışıp o konak çalışınca yayılır (ev sahibi dosya gerekir). Solucan kendi başına, kişiden kişiye geçer. Truva atı iyi bir hediye gibi görünür ama içinde bir şey saklar. Fidye yazılımı ise bir kapıyı kilitleyip anahtarı karşılığında para ister. Sınır: biyolojik hastalıkların aksine zararlı yazılımlar çoğunlukla bir insan tarafından, belirli bir amaçla yazılır ve türler iç içe geçebilir."
gorev:
  aciklama: "Zararlı yazılım indirmeyeceğiz. Bunun yerine bir sistemde 'normal' neye benzer, bunu görmeyi çalış; sapmayı ancak normali bilen fark eder. Komutlar yalnız okur."
  komutlar:
    - ps aux --sort=-%cpu | head -n 6
    - ss -tulpn
    - ls -la ~
    - find ~ -maxdepth 2 -type f -mtime -2 2>/dev/null | head
    - sha256sum /bin/ls
  soru: "En çok CPU kullanan işlemler tanıdık mı? `ss -tulpn` çıktısında dinleyen bir servis var mı ve sen onu tanıyor musun? Tanımadığın bir şey görsen ilk adımın ne olurdu?"
  telefon:
    soru: "Sunucundaki bir işlem gece boyunca sürekli %95 CPU kullanıyor, adı sistem işlemlerine benziyor ama hiç bilmediğin bir yoldan çalışıyor. Bu neyin işareti olabilir ve silmeden önce ne yaparsın?"
    cevap: "Kripto madenci gibi yetkisiz bir yazılımın işareti olabilir. Silmeden önce kanıt topla: işlem yolu, kullanıcı, ağ bağlantıları, ne zaman başladı. Sonra sistemi ağdan ayırıp güvenlik ekibini bilgilendir; körlemesine silmek kanıtı ve girişin yolunu yok eder."
sorular:
  - id: temeller-010-s1
    soru: "Virüs ile solucan arasındaki temel fark nedir?"
    cevap: "Virüs, bir dosyaya ya da programa yapışır ve o program çalıştırılınca yayılır; kullanıcı eylemi gerekir. Solucan kendi başına, genelde ağdaki açıklardan yararlanarak başka makinelere kendiliğinden yayılır."
  - id: temeller-010-s2
    soru: "Truva atı (trojan) kendini nasıl yayar?"
    cevap: "Kendiliğinden yayılmaz. Kullanıcı onu yararlı ya da zararsız sanıp kendisi yükler (sahte program, korsan yazılım, zararlı eklenti). İçinde gizli bir zararlı işlev vardır."
  - id: temeller-010-s3
    soru: "Fidye yazılımı bir kuruma genelde hangi yoldan girer ve en etkili hazırlık nedir?"
    cevap: "Yaygın yollar: oltalama e-postası, açık bırakılmış uzak erişim servisleri, çalınmış kimlik bilgileri ve yamalanmamış sistemler. En etkili hazırlık, saldırganın değiştiremeyeceği yerde tutulan, düzenli test edilen yedeklerdir; ayrıca yama ve MFA."
  - id: temeller-010-s4
    soru: "Yazılım tedarik zinciri saldırısında zararlı kod bir kuruma nasıl girer?"
    cevap: "Kurum, güvendiği bir bağımlılığı ya da güncellemeyi alır ve o bileşenin içine saldırgan önceden zararlı kod yerleştirmiştir. Kod yetkili bir kanaldan geldiği için kontrolleri aşar; bu yüzden bağımlılıkları doğrulamak ve sürüm sabitlemek gerekir."
derinDalis:
  - tur: kitap
    baslik: "Practical Malware Analysis (Sikorski, Honig)"
    ayrinti: "Zararlı yazılım türlerine ve analiz yaklaşımına giriş; ileri düzey, şimdilik sadece ilk bölümlere göz at."
  - tur: okuma
    baslik: "CISA: StopRansomware"
    ayrinti: "Fidye yazılımı hakkında CISA'nın rehberleri ve kontrol listeleri; sayfayı gezerek önleme önerilerine bak."
    url: "https://www.cisa.gov/stopransomware"
---

**Zararlı yazılım** (malware), sahibinin isteği ve bilgisi dışında zarar vermek için yazılmış her yazılımın genel adıdır. Türler, nasıl yayıldıklarına ve ne yaptıklarına göre ayrılır; bir yazılım birden fazla türün özelliğini taşıyabilir.

### Yayılma biçimine göre

- **Virüs**: Bir dosyaya ya da programa yapışır. O program çalışınca kendini başka dosyalara kopyalar. Kullanıcı eylemi gerekir.
- **Solucan** (worm): Kendi başına, genelde ağdaki bir açığı kullanarak makineden makineye yayılır. Kullanıcıya ihtiyacı yoktur, bu yüzden çok hızlı yayılabilir.
- **Truva atı** (trojan): Faydalı ya da zararsız görünür ama içinde zararlı işlev vardır. Kullanıcı onu kendi eliyle kurar.

### Amacına göre

- **Fidye yazılımı** (ransomware): Dosyaları şifreler ya da erişimi kilitler, açmak için ödeme ister. Birçok grup önce veriyi çalıp yayımlamakla da tehdit eder.
- **Casus yazılım** (spyware) ve **keylogger**: Gizlice izler, tuş vuruşlarını ve parolaları toplar.
- **Arka kapı** (backdoor): Saldırganın sisteme sonradan gizlice girmesini sağlar.
- **Botnet**: Ele geçirilmiş makinelerin saldırgan tarafından uzaktan yönetilen ağı; DDoS ve spam için kullanılır.
- **Kripto madenci**: Senin işlemci gücünle gizlice kripto para üretir; belirtisi sürekli yüksek CPU'dur.
- **Rootkit**: Kendini ve diğer zararlıları işletim sisteminden gizler.

### Nasıl bulaşır?

| Yol | Örnek |
|---|---|
| Oltalama eki ya da bağlantısı | Sahte fatura, "CV" dosyası |
| Yamalanmamış açık | İnternete açık güncellenmemiş servis |
| Zayıf ya da çalınmış kimlik | Ele geçirilmiş uzak erişim hesabı |
| Güvenilmeyen kaynaktan yazılım | Korsan program, sahte eklenti |
| Tedarik zinciri | Zararlı bağımlılık, ele geçirilmiş güncelleme |
| Çıkarılabilir medya | Bulunan USB bellek |

### Belirtiler

Beklenmeyen yavaşlama ve yüksek CPU, bilmediğin işlemler, bilinmeyen bağlantılar, dosyaların uzantı değiştirmesi, kapalıyken ağ trafiği, kapanan güvenlik araçları. Hiçbiri tek başına kanıt değildir; ama ikisi üçü bir arada ciddiye alınır.

### Korunma: katmanlı

Yama uygula, en az yetkiyle çalış, MFA aç, yazılımı güvenilir kaynaktan kur, bağımlılıkları doğrula, ağı bölümle, yedekleri saldırganın erişemeyeceği yerde tut ve **geri yüklemeyi dene**. Antivirüs bir katmandır ama tek başına yetmez; bilinen imzalara bakar ve yenisini kaçırabilir.

Güvenlik notu: Zararlı yazılım örnekleriyle ancak yalıtılmış bir laboratuvarda ve ne yaptığını bilerek çalış. Gerçek bir zararlıyı kendi bilgisayarında "bakmak için" çalıştırma.
