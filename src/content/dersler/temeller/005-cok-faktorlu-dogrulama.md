---
kimlik: temeller-005
baslik: "Çok faktörlü doğrulama"
donem: 3
sira: 5
sure: 30
neden: "Çalınan parolalar saldırıların en yaygın giriş kapısıdır; ikinci bir faktör bu kapıyı büyük ölçüde kapatır. Bir DevSecOps mühendisi GitHub, bulut konsolu ve CI sistemleri gibi yüksek yetkili hesaplarda doğru faktörü seçmek zorundadır. Hangi faktörün hangi saldırıya dayanıklı olduğunu bilmek bu seçimin temelidir."
analoji:
  baslik: "Evin iki kilidi"
  metin: "Kapıda hem anahtarla açılan bir kilit hem de şifreli bir kilit olsun. Hırsız anahtarı kopyalasa bile şifreyi bilmiyorsa giremez. Ama şifre bir ekranda çıkıp 'bana şunu söyle' diye soran sahte bir görevliye söylenirse iki kilit de işe yaramaz. Sınır: faktörler birbirinden bağımsız olmalı; ikisi de aynı yerden çalınabiliyorsa iki kilit sayılmaz."
gorev:
  aciklama: "TOTP kodları (Authenticator uygulamalarındaki 6 haneli kodlar), paylaşılan bir gizli anahtar ile şimdiki zamandan üretilir. Kodun neden 30 saniyede bir değiştiğini zaman bölmesini hesaplayarak gör. Bu görevde gerçek bir kod üretmiyoruz; yalnız mantığı inceliyoruz."
  komutlar:
    - date +%s
    - echo $(( $(date +%s) / 30 ))
    - sleep 31
    - echo $(( $(date +%s) / 30 ))
  soru: "İki bölme sonucu neden farklı çıktı? TOTP kodu bu sayıdan nasıl türetilir ve kodu bilen ama gizli anahtarı bilmeyen biri sonraki kodu tahmin edebilir mi?"
  telefon:
    soru: "Bir saldırgan sahte bir giriş sayfası kurdu. Kurban parolasını ve Authenticator'daki 6 haneli kodu bu sayfaya yazıyor; saldırgan bunları anında gerçek siteye iletiyor. TOTP bu saldırıyı durdurur mu? Passkey durdurur mu?"
    cevap: "TOTP durdurmaz: kod 30 saniye geçerlidir ve saldırgan onu hemen kullanır. Passkey durdurur, çünkü kimlik bilgisi yalnızca gerçek site adresine bağlıdır; sahte sitede çalışmaz."
sorular:
  - id: temeller-005-s1
    soru: "Üç faktör türünü say ve her birine örnek ver."
    cevap: "Bildiğin şey (parola, PIN), sahip olduğun şey (telefon, güvenlik anahtarı), olduğun şey (parmak izi, yüz). İki faktör aynı türden olursa (iki parola) çok faktörlü sayılmaz."
  - id: temeller-005-s2
    soru: "TOTP nasıl çalışır? Telefonla sunucu aynı kodu nasıl üretir?"
    cevap: "Kurulum sırasında sunucu ve uygulama bir gizli anahtar paylaşır. Her ikisi de bu anahtar ile şu anki zaman dilimini (genelde 30 saniye) bir hash fonksiyonuna sokup aynı 6 haneli kodu üretir. Kod ağ üzerinden gönderilmeden eşleşir."
  - id: temeller-005-s3
    soru: "SIM swap saldırısı nedir ve SMS ile doğrulamayı neden zayıflatır?"
    cevap: "Saldırgan operatörü kandırıp senin numaranı kendi SIM kartına taşıtır. Böylece SMS ile gelen kodlar ona gider. Bu yüzden SMS, uygulama tabanlı kod ya da güvenlik anahtarından daha zayıf bir faktördür; yine de hiç faktör olmamasından iyidir."
  - id: temeller-005-s4
    soru: "Passkey (geçiş anahtarı) neden oltalamaya dayanıklıdır?"
    cevap: "Passkey bir açık/gizli anahtar çiftidir. Gizli anahtar cihazdan çıkmaz ve yalnız kayıtlı alan adı için çalışır. Sahte bir siteye giriş yapmaya çalışsan bile cihaz doğru siteyi tanımadığı için imzalamaz."
derinDalis:
  - tur: okuma
    baslik: "FIDO Alliance: Passkeys"
    ayrinti: "Passkey'in ne olduğunu ve hangi cihazlarda nasıl çalıştığını anlatan sayfa."
    url: "https://fidoalliance.org/passkeys/"
  - tur: okuma
    baslik: "NIST SP 800-63B-4"
    ayrinti: "Doğrulayıcı türleri ve telefon hatlarıyla (SMS/sesli) gönderilen kodların neden kısıtlı sayıldığı (bölüm 3.1.3.3)."
    url: "https://pages.nist.gov/800-63-4/sp800-63b.html"
---

Parola tek başına bir kapı kilididir. Çalındığında, tahmin edildiğinde ya da sızdığında kapı açılır. **Çok faktörlü doğrulama** (multi-factor authentication, MFA) bir ikinci kilit ekler.

### Faktör türleri

| Tür | Örnek |
|---|---|
| Bildiğin şey | Parola, PIN |
| Sahip olduğun şey | Telefon, güvenlik anahtarı |
| Olduğun şey | Parmak izi, yüz |

Önemli olan farklı **türden** iki kanıttır. İki ayrı parola iki faktör sayılmaz.

### Yaygın MFA yöntemleri

- **SMS kodu**: Kolay ama en zayıf yöntemlerden biri. SIM swap, numara taşıma ve ağdaki zayıflıklara açıktır. NIST telefon hattı üzerinden gönderilen kodları "kısıtlı" sayar ve alternatif yöntem sunulmasını ister.
- **TOTP** (Time-based One-Time Password): Authenticator uygulamasındaki 30 saniyelik kodlar. Gizli anahtar kurulumda paylaşılır; kod, zamandan ve anahtardan hesaplanır. SMS'ten daha güvenlidir ama kullanıcı sahte siteye kodu yazarsa saldırgan onu hemen kullanabilir.
- **Push bildirimi**: "Giriş yapıyor musun? Onayla". Saldırgan arka arkaya bildirim yağdırıp kullanıcıyı yorarak onay aldırabilir (MFA yorgunluğu).
- **Güvenlik anahtarı ve passkey**: Açık anahtar kriptografisine dayanır; gizli anahtar cihazdan çıkmaz ve yalnız doğru alan adı için çalışır. Oltalamaya dayanıklı tek yaygın yöntemdir.

### Sıralama

Genel bir sıralama: passkey/güvenlik anahtarı > TOTP > SMS. Ama her şeyden önemli kural şudur: **hiç MFA olmamasından her MFA iyidir**. Mükemmeli beklerken hiç açmamak en büyük hatadır.

### Saldırı örnekleri

- **SIM swap**: Saldırgan operatörü kandırıp numaranı kendi SIM'ine taşır. SMS kodları ona gider.
- **Gerçek zamanlı oltalama proxy'si**: Sahte site parolayı ve kodu alıp hemen gerçek siteye iletir. TOTP ve SMS bunu durduramaz, passkey durdurur.
- **Kurtarma yolu**: Hesabını telefon numarası ya da e-posta ile kurtarabiliyorsan, saldırgan MFA'yı atlayıp "parolamı unuttum" yolundan girebilir. Kurtarma kodlarını güvenli bir yerde sakla.

### Pratik öneri

1. E-posta hesabınla başla; diğer tüm hesapların sıfırlama anahtarı odur.
2. Mümkün olan yerde passkey veya güvenlik anahtarı kullan, yoksa TOTP.
3. Kurtarma kodlarını yazdırıp ya da parola yöneticisinde sakla.
4. Bir MFA isteği sen başlatmadığın halde gelirse **onaylama** ve parolanı değiştir.

Güvenlik notu: Bir kodu sana telefonla ya da mesajla "doğrulama için" isteyen biri, ne kadar resmi görünürse görünsün, saldırgandır. Doğrulama kodu hiç kimseyle paylaşılmaz.
