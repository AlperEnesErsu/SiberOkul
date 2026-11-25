---
kimlik: temeller-004
baslik: "Parolalar ve hash"
donem: 3
sira: 4
sure: 30
neden: "Sızan veritabanlarının çoğunda parolalar bulunur ve hasarı belirleyen şey bu parolaların nasıl saklandığıdır. Bir DevSecOps mühendisi hem kendi hesaplarını hem de geliştirdiği uygulamaların parola saklama yöntemini denetler. Doğru saklama bilgisi, bir kod incelemesinde yakalayacağın en önemli hatalardan birini görmeni sağlar."
analoji:
  baslik: "Kıyma makinesi"
  metin: "Hash, eti kıymaya çeviren makine gibidir: ete bakıp aynı kıymayı her seferinde elde edersin ama kıymadan ete geri dönemezsin. Tuz (salt), her müşterinin etine kendine özgü baharat eklemek gibidir: iki kişi aynı eti getirse bile kıymaları farklı çıkar. Sınır: kıyma makinesi hızlıdır, oysa parola için bilerek yavaş bir makine isteriz ki saldırgan milyarlarca deneme yapamasın."
gorev:
  aciklama: "Aynı girdinin hep aynı hash'i verdiğini ve küçük bir değişikliğin hash'i tamamen değiştirdiğini gör. Sonra tuzun ne işe yaradığını simüle et. Burada kullanılan parolalar örnektir; gerçek parolalarını terminale yazma."
  komutlar:
    - echo -n "parola123" | sha256sum
    - echo -n "parola123" | sha256sum
    - echo -n "parola124" | sha256sum
    - echo -n "ab12parola123" | sha256sum
    - echo -n "cd34parola123" | sha256sum
  soru: "İlk iki komutun çıktısı neden aynı? Son iki komutta aynı parolaya farklı tuz eklenince ne oldu ve bu saldırgana ne kaybettirir?"
  telefon:
    soru: "Bir sızıntıda iki kullanıcının hash değeri birebir aynı çıktı. Sistem tuz kullanıyor olsaydı bu olur muydu? Sızıntı hakkında ne anlarsın?"
    cevap: "Doğru tuzlama yapılsaydı olmazdı, çünkü her kullanıcının tuzu farklıdır. Aynı hash, sistemin tuz kullanmadığını gösterir; bu da bir hash'i kıran saldırganın aynı parolayı kullanan herkesin parolasını bir anda bulması demektir."
sorular:
  - id: temeller-004-s1
    soru: "Parolalar neden düz metin olarak saklanmaz, hash olarak saklanır?"
    cevap: "Veritabanı sızarsa düz metin parolalar anında kullanılır. Hash tek yönlüdür; saldırgan parolayı ancak tahmin ederek bulabilir. Giriş sırasında girilen parolanın hash'i alınır ve saklanan hash ile karşılaştırılır."
    ipucu: "Veritabanı sızarsa saldırganın elinde ne kalmasını istersin?"
  - id: temeller-004-s2
    soru: "Tuz (salt) ne işe yarar ve gizli tutulması gerekir mi?"
    cevap: "Tuz, hash alınmadan önce parolaya eklenen kullanıcıya özgü rastgele değerdir. Aynı parolaların farklı hash vermesini sağlar ve hazır hash tablolarını (rainbow table) işe yaramaz hale getirir. Gizli tutulması gerekmez; hash ile birlikte saklanabilir."
    ipucu: "Aynı parola her kullanıcıda aynı hash'i verirse ne olur? Tuz bunu nasıl değiştirir?"
  - id: temeller-004-s3
    soru: "Parola saklamak için neden SHA-256 yerine bcrypt ya da Argon2 kullanılır?"
    cevap: "SHA-256 hızlı olmak için tasarlandı; saldırgan saniyede milyarlarca deneme yapabilir. bcrypt ve Argon2 bilerek yavaş ve (Argon2'de) bellek yoğun çalışır, her tahmini pahalı kılar."
    ipucu: "Saldırgan saniyede kaç tahmin yapabilir; algoritmanın hızı sana yarar mı?"
  - id: temeller-004-s4
    soru: "Parolanı bir sızıntı bildirim servisinde sızmış olarak gördün. Ne yaparsın ve neden başka hesapları da kontrol edersin?"
    cevap: "O parolayı hemen değiştirirsin ve sızıntı listesindeki aynı parolayı kullandığın her yerde de değiştirirsin. Saldırganlar sızan parolaları başka sitelerde dener (credential stuffing); aynı parolayı yeniden kullanmak tek sızıntıyı birçok hesaba yayar."
    ipucu: "Aynı parolayı başka yerde de kullandıysan sızıntının etkisi ne kadar yayılır?"
  - id: temeller-004-s5
    soru: "Yeni bir hizmetin kayıt formunu geliştiriyorsun. Meslektaşın parolaları SHA-256 ile hash'leyip saklamayı öneriyor. Ne dersin ve ne önerirsin?"
    cevap: "SHA-256 hızlıdır; sızıntıda saldırgan saniyede milyarlarca tahmin yapabilir. Parola için bilerek yavaş ve tuzlu bir algoritma (Argon2id, bcrypt ya da scrypt) öneririm; tuz her kullanıcı için ayrı ve rastgele olur. Ayrıca uzun parolalara izin verir, sızıntı listelerinde bulunan parolaları reddederim."
    ipucu: "Parola saklamada hızın avantaj mı, dezavantaj mı olduğunu düşün."
hizliKontrol:
  - soru: "Tuzun (salt) asıl faydası nedir?"
    secenekler: ["Hash'i geri çevrilebilir yapar","Aynı parolaların farklı hash üretmesini sağlar ve önceden hesaplanmış tabloları işe yaramaz kılar","Parolayı otomatik uzatır","Sunucunun hızını artırır"]
    dogru: 1
    aciklama: "Tuz, kullanıcıya özel rastgele değerdir; aynı parola bile farklı hash verir ve hazır tablolar işe yaramaz. Gizli tutulması gerekmez."
    ipucu: "Aynı parolayı kullanan iki kişinin hash'lerine ne olur?"
  - soru: "Parola saklamada neden yavaş hash tercih edilir?"
    secenekler: ["Kullanıcı girişi daha güvenli görünsün diye","Sunucu yükünü artırmak için","Saldırganın her tahmininin maliyeti artsın diye","Hash'in geri çevrilebilmesi için"]
    dogru: 2
    aciklama: "Meşru girişte yavaşlık fark edilmez; kaba kuvvet denemesinde ise milyarlarca tahmini pahalı hale getirir."
    ipucu: "Yavaşlığı kimin için dezavantaj yapmak istiyoruz?"
sikHatalar:
  - hata: "Parolayı 'şifreleyip' saklamak."
    dogrusu: "Parola şifrelenmez, tuzlu ve yavaş bir algoritmayla hash'lenir; geri çevrilebilir saklama sızıntıyı büyütür."
  - hata: "Sızan bir parolayı yalnız o hesapta değiştirmek."
    dogrusu: "Aynı parolayı kullandığın bütün hesaplarda değiştir ve bir parola yöneticisiyle her hesaba ayrı parola ver."
terimler:
  - "Hash"
  - "Tuz"
  - "Gizlilik"
sema:
  baslik: "Parolanın doğrulanması"
  adimlar:
    - etiket: "Kayıt"
      aciklama: "Sistem her kullanıcı için rastgele bir tuz üretir."
    - etiket: "Hash"
      aciklama: "Parola ve tuz yavaş bir algoritmayla hash'lenir."
    - etiket: "Saklama"
      aciklama: "Veritabanında yalnız tuz ve hash durur, parola durmaz."
    - etiket: "Giriş"
      aciklama: "Kullanıcının yazdığı parola aynı tuzla hash'lenir."
    - etiket: "Karşılaştırma"
      aciklama: "Çıkan hash kayıtlıyla aynıysa giriş kabul edilir."
derinDalis:
  - tur: okuma
    baslik: "OWASP Password Storage Cheat Sheet"
    ayrinti: "Hangi algoritmanın hangi ayarlarla önerildiğini gösteren güncel rehber."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"
  - tur: okuma
    baslik: "NIST SP 800-63B-4"
    ayrinti: "Parola uzunluğu, sızıntı listesi kontrolü ve zorunlu değişim konusundaki resmi öneriler (bölüm 3.1.1)."
    url: "https://pages.nist.gov/800-63-4/sp800-63b.html"
---

Parola güvenliği iki ayrı tarafa bakar: **kullanıcı** parolayı nasıl seçer, **sistem** onu nasıl saklar.

### Hash nedir?

Hash fonksiyonu, herhangi uzunluktaki girdiyi sabit uzunlukta bir çıktıya çevirir. Üç özelliği önemlidir:

- Aynı girdi her zaman aynı çıktıyı verir.
- Girdideki küçücük değişiklik çıktıyı tamamen değiştirir.
- Çıktıdan girdiye geri dönülemez (tek yönlü).

Bir site parolanı düz metin saklamaz; hash'ini saklar. Giriş yaptığında yazdığın parolanın hash'ini alır ve kayıtlı olanla karşılaştırır. Veritabanı çalınsa bile elde parolalar değil hash'ler olur.

### Yetmez: tahmin saldırıları

Saldırgan hash'ten geri dönemez ama tahmin edebilir. Yaygın parolaları tek tek hash'ler ve çalınan hash'lerle karşılaştırır. Hazır **rainbow table**'lar bunu daha da hızlandırır. İki önlem gerekir:

1. **Tuz** (salt): her kullanıcı için rastgele bir değer parolaya eklenir. Aynı parola farklı hash verir; hazır tablolar işe yaramaz. Tuzun gizli olması gerekmez, hash'in yanında saklanır.
2. **Yavaş algoritma**: SHA-256 gibi hızlı hash'ler parola için uygun değildir. **Argon2id** ve **bcrypt** gibi özel olarak yavaş tasarlanmış algoritmalar kullanılır. Böylece her tahmin pahalıdır. OWASP şu anda Argon2id'i önceliklendiriyor.

### Kullanıcı tarafı: NIST ne diyor?

NIST'in güncel kimlik doğrulama rehberi (SP 800-63B) şunları söyler:

- Uzunluk, karmaşıklıktan daha önemlidir.
- Yeni parolalar bilinen sızıntı listelerine karşı kontrol edilmeli.
- Parolayı düzenli aralıklarla değiştirmeye zorlanmamalı; yalnız ele geçirildiğine dair kanıt varsa değiştirilmeli.
- Parola yöneticisi ve yapıştırma (paste) engellenmemeli.

### Sızıntı listeleri ve yeniden kullanım

Sızan hesaplar, sızıntı listelerinde toplanır. Saldırganlar bu listedeki e-posta-parola çiftlerini başka sitelerde dener; buna **credential stuffing** denir. Aynı parolayı iki yerde kullanmak bu yüzden tehlikelidir. Çözüm: her hesap için farklı, uzun, rastgele parola ve bir parola yöneticisi.

Kendi sızıntı durumunu Have I Been Pwned gibi bir servisle kontrol edebilirsin; yine de parolanı o sitelere yazma, e-posta adresiyle sorgula.

Güvenlik notu: Kendi yazdığın bir uygulamada parolaları asla düz metin ya da hızlı bir hash ile saklama; kendi hash algoritmanı da icat etme. Kanıtlanmış bir kütüphane ve güncel ayarlar kullan.
