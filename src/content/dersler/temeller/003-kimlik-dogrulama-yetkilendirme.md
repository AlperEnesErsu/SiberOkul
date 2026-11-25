---
kimlik: temeller-003
baslik: "Kimlik doğrulama ve yetkilendirme"
donem: 3
sira: 3
sure: 30
neden: "Uygulama güvenliği hatalarının büyük kısmı iki sorunun karışmasından çıkar: 'bu kişi kim?' ve 'bu kişi bunu yapabilir mi?'. Bir DevSecOps mühendisi, API anahtarlarından Kubernetes rollerine kadar her yerde bu ikisini ayrı ayrı kontrol eder. Oturum ve token kavramı da web uygulamalarının her gününde karşına çıkar."
analoji:
  baslik: "Otel girişi"
  metin: "Resepsiyonda kimliğini gösterirsin; görevli seni kayıtla eşleştirir (kimlik doğrulama). Sana bir oda anahtar kartı verir; kart yalnız senin odanı ve ortak alanları açar (yetkilendirme). Kartı her kapıda kimlik göstermeden kullanırsın; bu da oturum gibidir. Sınırı: kartı kaybedip biri bulursa kapıyı açar, çünkü kart seni değil kartı gösteren kişiyi tanır; token'lar da böyledir."
gorev:
  aciklama: "Linux'ta bu iki kavram yan yana yaşar. Giriş yaparken kimliğin doğrulanmıştır; ne yapabileceğin ise dosya izinleriyle belirlenir. Terminalde ikisini gör."
  komutlar:
    - whoami
    - id
    - ls -l /etc/passwd
    - ls -l /etc/shadow
    - cat /etc/shadow
    - head -n 3 /etc/passwd
  soru: "`cat /etc/shadow` neden 'Permission denied' verdi? Bu kimlik doğrulama mı, yetkilendirme mi hatası?"
  telefon:
    soru: "Bir API'ye geçerli token'ınla istek attın ve '401 Unauthorized' aldın. Başka bir istekte '403 Forbidden' aldın. İkisinin farkı nedir?"
    cevap: "401, kimliğin doğrulanamadığı (token yok ya da geçersiz) demektir: kimlik doğrulama sorunu. 403 ise kim olduğun biliniyor ama bu işe izninin olmadığı demektir: yetkilendirme sorunu."
sorular:
  - id: temeller-003-s1
    soru: "Kimlik doğrulama (authentication) ile yetkilendirme (authorization) arasındaki fark nedir?"
    cevap: "Kimlik doğrulama 'sen kimsin?' sorusunu yanıtlar ve iddia edilen kimliği kanıtlar. Yetkilendirme 'bu kimlik ne yapabilir?' sorusunu yanıtlar. Önce doğrulama, sonra yetkilendirme gelir."
  - id: temeller-003-s2
    soru: "Bir kullanıcı giriş yaptıktan sonra neden her istekte parolasını yeniden girmek zorunda kalmaz? Bunu ne sağlar?"
    cevap: "Giriş başarılı olunca sunucu bir oturum (session) başlatır ve tarayıcıya bir oturum kimliği ya da token verir. Tarayıcı bunu her istekle gönderir; böylece parola tekrar tekrar iletilmez."
  - id: temeller-003-s3
    soru: "Bir oturum token'ı çalınırsa saldırgan neden parolayı bilmeden hesaba girebilir?"
    cevap: "Token, 'bu kişi zaten doğrulandı' kanıtıdır. Sunucu onu gösteren kişiyi doğrulanmış sayar. Bu yüzden token gizli tutulmalı, süresi kısa olmalı ve gerektiğinde iptal edilebilmelidir."
  - id: temeller-003-s4
    soru: "'Herkes giriş yaptıysa her sayfayı görebilir' tasarımı hangi sorunu doğurur?"
    cevap: "Yetkilendirme eksikliği. Kimliği doğrulanmış bir kullanıcı, yetkisi olmayan verilere (başkasının kaydı, yönetici paneli) erişebilir. Her işlemde 'bu kullanıcı bunu yapabilir mi?' ayrıca kontrol edilmelidir."
derinDalis:
  - tur: kitap
    baslik: "Web Application Security (Andrew Hoffman)"
    ayrinti: "Kimlik doğrulama, oturum yönetimi ve yetkilendirme hatalarını anlatan bölümlere göz at; bölüm numarası için kitabın içindekiler sayfasına bak."
  - tur: lab
    baslik: "PortSwigger Web Security Academy"
    ayrinti: "Authentication ve access control konuları, tarayıcıdan çalışan ücretsiz laboratuvarlar içerir. Sitede 'Web Security Academy' diye arayarak bul."
---

İki kelime sık karışır ve çoğu güvenlik açığı bu karışıklıktan doğar.

### Kimlik doğrulama (authentication)

"Sen kimsin?" sorusudur ve kanıt ister. Üç tür kanıt vardır:

- **Bildiğin şey**: parola, PIN.
- **Sahip olduğun şey**: telefon, güvenlik anahtarı.
- **Olduğun şey**: parmak izi, yüz.

Bir sonraki derslerde parolaları ve bunları birleştirmeyi (çok faktörlü doğrulama) ayrıntılı göreceksin.

### Yetkilendirme (authorization)

"Bu kimlik, bu işi yapabilir mi?" sorusudur. Kimliğin doğrulanmış olması her şeyi yapabileceği anlamına gelmez. Bir müşteri yalnız kendi siparişlerini görür, bir yönetici hepsini. Yetkilendirme kuralları rol, grup ya da izin listeleriyle yazılır. Linux'ta dosya izinleri, bulutta IAM politikaları, Kubernetes'te RBAC aynı fikrin farklı yüzleridir.

Sıra her zaman şöyledir: önce doğrulama, sonra her işlem için yetkilendirme.

### HTTP'de iki hata kodu

| Kod | Anlamı | Hangi sorun |
|---|---|---|
| 401 | Kimliğin doğrulanamadı | Kimlik doğrulama |
| 403 | Kimliğin belli ama izin yok | Yetkilendirme |

### Oturum ve token

HTTP her isteği önceki istekten bağımsız ele alır. Sunucu "bu kişi az önce giriş yaptı" bilgisini bir yerde tutmalıdır. İki yaygın yol:

1. **Oturum çerezi** (session cookie): sunucu bir oturum kaydı tutar, tarayıcıya yalnız rastgele bir kimlik verir.
2. **Token** (ör. JWT): bilgi token'ın içinde taşınır ve sunucu imzasını doğrular. Sunucunun oturum saklaması gerekmez.

Her iki yolda da ortak gerçek şu: **token'ı elinde tutan kişi, doğrulanmış sayılır**. Bu yüzden token'lar:

- Gizli tutulmalı (günlüklere, URL'ye yazılmamalı).
- Kısa ömürlü olmalı.
- Çalındığı anlaşılırsa iptal edilebilmeli.

### Servisler de kimlik sahibidir

DevSecOps'ta kimlik yalnız insan değildir. CI/CD hattı, bir container ya da bir bot da bir kimlik kullanır: API anahtarı, servis hesabı, token. Bunlara yalnız gerekli yetkiyi vermek, ilerleyen derslerde göreceğin en az yetki ilkesinin temelidir.

Güvenlik notu: Doğrulama yapıldı diye yetkilendirmeyi atlamak, "kırık erişim kontrolü" denen yaygın açığın tam kaynağıdır. Her istekte kontrol sunucuda yapılmalı; arayüzde bir düğmeyi gizlemek koruma sayılmaz.
