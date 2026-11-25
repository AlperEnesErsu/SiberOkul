---
kimlik: temeller-009
baslik: "Sosyal mühendislik ve oltalama"
donem: 3
sira: 9
sure: 25
neden: "Güvenlik zincirinin en kolay kırılan halkası çoğu zaman teknoloji değil insandır. DevSecOps mühendisleri, yetkili hesapları ve pipeline erişimlerini hedefleyen oltalamanın ilk hedefidir; tek bir kandırılmış geliştirici bütün üretim ortamını açabilir. Taktikleri tanımak ve ekibe öğretmek işinin bir parçasıdır."
analoji:
  baslik: "Resmi kıyafetli sahte görevli"
  metin: "Kapıya gaz şirketinden geldiğini söyleyen, yeleği ve kartı olan biri, kapıyı açtırmak için kimlik kontrolünden önce güveni kullanır. Oltalama da aynıdır: kilidi kırmaz, seni kapıyı kendin açmaya ikna eder. Sınır: kapıdaki görevliyi yüz yüze görürsün; e-postada gönderen adı, logo ve dil kolayca taklit edilir."
gorev:
  aciklama: "Bir bağlantının gerçekte nereye gittiğini görmeyi çalış. Aşağıdaki komutlar bağlantıyı açmaz; yalnız adres metnini parçalar. Alan adı, ilk `/` işaretinden önce ve üst alan adının hemen solundaki kısımdır."
  komutlar:
    - echo "https://giris.banka.com.guvenlik-dogrula.example/hesap" | cut -d/ -f3
    - echo "https://banka.com/giris" | cut -d/ -f3
    - echo "https://banka.com@kotu.example/giris" | cut -d/ -f3
    - echo "https://banka-com.example/giris" | cut -d/ -f3
  soru: "Dört adresin gerçek alan adı hangisinin sonunda duruyor? Hangi adres 'banka.com' gibi görünüp aslında başka bir siteye ait?"
  telefon:
    soru: "Telefonuna 'Kargonuz gümrükte bekliyor, 24 saat içinde ödeme yapın: kisa.example/abc' diye SMS geldi. Hangi işaretler bunun oltalama olabileceğini düşündürür ve ilk ne yaparsın?"
    cevap: "Aciliyet baskısı (24 saat), beklemediğin bir kargo, kısaltılmış bağlantı ve ödeme talebi. Bağlantıya tıklama; kargo firmasının uygulamasını ya da sitesini kendin açıp kontrol et, SMS'i bildir ve sil."
sorular:
  - id: temeller-009-s1
    soru: "Sosyal mühendislik nedir ve oltalama (phishing) bunun neresindedir?"
    cevap: "Sosyal mühendislik, teknik açık yerine insanın güvenini, aciliyet hissini ya da yardım isteğini kullanarak bilgi ya da erişim koparmaktır. Oltalama, bunun e-posta, SMS ya da sahte site üzerinden yapılan en yaygın biçimidir."
    ipucu: "Saldırgan teknik açığı değil, insanın hangi eğilimini kullanıyor?"
  - id: temeller-009-s2
    soru: "Oltalama mesajlarında en sık görülen üç işaret nedir?"
    cevap: "Aciliyet ya da korku yaratan dil, kişisel/finansal bilgi ya da şifre talebi, uyuşmayan gönderen adresi ya da benzer görünen sahte alan adı ve kısaltılmış bağlantılar."
    ipucu: "Acele ettiren, korkutan ya da ödül vaat eden mesajların ortak yanı nedir?"
  - id: temeller-009-s3
    soru: "Hedefli oltalama (spear phishing) toplu oltalamadan nasıl farklıdır, neden daha tehlikelidir?"
    cevap: "Belirli bir kişi ya da kurum için hazırlanır; adını, görevini, iş arkadaşlarını bilir. Kişiselleştirildiği için şüphe uyandırmaz. Geliştiricilere gelen 'sahte işe alım' ya da 'repo daveti' mesajları buna örnektir."
    ipucu: "Genel bir mesaj ile sana özel hazırlanmış bir mesajın inandırıcılığını kıyasla."
  - id: temeller-009-s4
    soru: "Şüpheli bir mesaj aldığında hangi sırayla ne yaparsın?"
    cevap: "Tıklama, bağlantı açma, eki indirme. Göndereni başka bir kanaldan (bilinen telefon, resmi site) doğrula. Kurumsa güvenlik ekibine bildir. Yanlışlıkla tıkladıysan ya da bilgi girdiysen hemen parolayı değiştir ve bildir."
    ipucu: "Mesajdaki bağlantıya tıklamadan önce hangi bağımsız kanala dönebilirsin?"
  - id: temeller-009-s5
    soru: "Mali işler çalışanı, CEO'nun e-posta adresine çok benzeyen bir adresten 'acil, bir tedarikçiye hemen transfer yap, kimseye söyleme' mesajı aldı ve sana danıştı. İlk ne yaparsın?"
    cevap: "Transferi durdurmasını, mesajdaki bağlantıya ya da numaraya güvenmeden CEO'yu bilinen bir kanaldan (telefon, şirket içi sohbet) aramasını isterim. Gönderen adresini ve başlıkları inceler, mesajı güvenlik ekibine bildirir, benzer mesajı alan başkaları varsa uyarırım."
    ipucu: "Aciliyet ve gizlilik baskısı ne işaretidir ve doğrulama hangi kanaldan yapılmalı?"
hizliKontrol:
  - soru: "Hedefli oltalama (spear phishing) toplu oltalamadan en çok neyle ayrılır?"
    secenekler: ["Daha uzun e-posta olmasıyla","Belirli bir kişiye özel bilgilerle hazırlanmasıyla","Yalnız SMS ile yapılmasıyla","Her zaman ek içermesiyle"]
    dogru: 1
    aciklama: "Hedefli oltalama kişiye özel bilgilerle hazırlandığı için daha inandırıcıdır."
    ipucu: "Mesajın içeriği kimin için yazılmış?"
  - soru: "Şüpheli bir bağlantıyla karşılaştığında en güvenli ilk adım hangisidir?"
    secenekler: ["Bağlantıya tıklayıp sayfaya bakmak","Mesajı bir arkadaşına iletmek","Bağlantıya tıklamadan, kurumun bilinen resmi kanalından doğrulamak","Parolanı hemen değiştirmek"]
    dogru: 2
    aciklama: "Mesajdaki bağlantı ya da numara yerine kurumu bilinen kanaldan doğrulamak güvenlidir."
    ipucu: "Doğrulamayı saldırganın verdiği kanaldan yapmak mantıklı mı?"
sikHatalar:
  - hata: "Mesajdaki 'doğrulama' numarasını arayıp bilgi vermek."
    dogrusu: "Kurumu kendi bildiğin, resmi kanaldan ara; mesajdaki numaraya güvenme."
  - hata: "Yalnız yazım hatası olan mesajlara şüphelenmek."
    dogrusu: "İyi hazırlanmış mesajlar hatasız olabilir; aciliyet, bilgi talebi ve alan adı gibi işaretlere de bak."
terimler:
  - "Oltalama"
  - "Sosyal mühendislik"
  - "Çok faktörlü doğrulama"
sema:
  baslik: "Şüpheli mesajda izlenecek sıra"
  adimlar:
    - etiket: "Dur"
      aciklama: "Acele etme; aciliyet baskısı bir işarettir."
    - etiket: "İncele"
      aciklama: "Gönderen adresine ve bağlantının gerçek alan adına bak."
    - etiket: "Tıklama"
      aciklama: "Bağlantıya ve eke dokunma."
    - etiket: "Doğrula"
      aciklama: "Kurumu bilinen resmi kanaldan ara ya da ilgili kişiye ikinci kanaldan sor."
    - etiket: "Bildir"
      aciklama: "Güvenlik ekibine haber ver, bilgi verdiysen parolayı hemen değiştir."
derinDalis:
  - tur: okuma
    baslik: "CISA: Recognize and Report Phishing"
    ayrinti: "Oltalama işaretlerini ve bildirme adımlarını sade anlatan sayfa."
    url: "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing"
  - tur: kitap
    baslik: "Social Engineering: The Science of Human Hacking (Christopher Hadnagy)"
    ayrinti: "Taktiklerin psikolojisini anlatan kitap; bölüm numarası vermeden konu başlıklarına göz at."
---

**Sosyal mühendislik** (social engineering), bir sisteme teknik yoldan girmek yerine insanı ikna ederek bilgi ya da erişim almaktır. Saldırgan kilidi kırmaz; kapıyı sana açtırır.

### Neden işe yarar?

Beyin bazı durumlarda düşünmeden tepki verir. Saldırganlar şu kolları çeker:

- **Aciliyet**: "Hesabın 2 saat içinde kapanacak."
- **Otorite**: "Ben müdürünüzüm, hemen şu ödemeyi yap."
- **Korku ya da merak**: "Hesabında şüpheli işlem var" ya da "Maaş listesi ektedir."
- **Yardımseverlik**: "Telefonum bozuldu, şu kodu iletir misin?"
- **Güven**: Tanıdık bir logo, bir iş arkadaşının adı.

### Başlıca türler

| Tür | Kanal |
|---|---|
| Oltalama (phishing) | E-posta, sahte site |
| Hedefli oltalama (spear phishing) | Belirli bir kişiye özel e-posta |
| Smishing | SMS |
| Vishing | Telefon araması |
| Bahaneleme (pretexting) | Uydurma bir hikâye ve rol |

Geliştiricilere yönelik yaygın tuzaklar: sahte iş teklifi ile "kodlama testi" diye zararlı proje göndermek, sahte GitHub uyarısı, bir bağımlılık güncellemesi gibi görünen zararlı paket.

### Alan adını okumak

Bir bağlantıda gerçek sahip, alan adının sağdan sola okunan kısmıdır. `giris.banka.com.guvenlik.example` adresinin sahibi `guvenlik.example`'dır; başa eklenen `banka.com` yalnız aldatmacadır. Dikkat edilecek hileler:

- Benzer alan adları (harf değişimi, ek kelime, tire).
- `@` ile gizleme: `banka.com@kotu.example` adresinde gerçek hedef `@` işaretinden sonrasıdır.
- Kısaltılmış bağlantılar hedefi saklar.
- Logo, imza ve dil kolay taklit edilir; görünüş kanıt değildir.

### Savunma

1. **Dur ve düşün.** Aciliyet baskısı başlı başına bir uyarıdır.
2. **Başka kanaldan doğrula.** Mesajdaki numarayı arama; resmi siteyi kendin aç.
3. **Bağlantıya tıklama, uygulamayı ya da yer imini kullan.**
4. **Çok faktörlü doğrulama aç.** Parola kaptırılsa bile tek başına yetmez; passkey sahte siteye hiç çalışmaz.
5. **Parola yöneticisi kullan.** Yönetici sahte sitede parolayı otomatik doldurmaz; bu sinyal kıymetlidir.
6. **Bildir.** Kurumunda bir bildirim yolu varsa kullan; sessiz kalmak diğerlerini tehlikede bırakır.

### Hata yaparsan

Herkes bir gün tıklar. Önemli olan hızdır: parolayı değiştir, açık oturumları kapat, güvenlik ekibine haber ver. Utanmak ve saklamak saldırganın işine yarar.

Güvenlik notu: Oltalama farkındalığı egzersizi yapacaksan yalnız yetkili olduğun bir kurum içinde ve yazılı izinle yap. İzinsiz sahte mesaj göndermek suçtur.
