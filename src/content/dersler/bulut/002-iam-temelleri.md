---
kimlik: bulut-002
baslik: "IAM temelleri"
donem: 8
sira: 2
sure: 30
neden: "Bulutta ağ sınırı kadar önemli bir sınır daha vardır: kimlik. Bir saldırgan çoğu zaman ağa değil, çalınmış bir anahtara ya da aşırı yetkili bir role ihtiyaç duyar. IAM'i doğru kurmak bir DevSecOps mühendisinin en yüksek getirili işidir."
analoji:
  baslik: "Otel kartı sistemi"
  metin: "Otelde herkese aynı anahtar verilmez. Misafirin kartı yalnız kendi odasını açar, temizlik görevlisinin kartı kat odalarını, müdürün kartı her yeri. Kök hesap (root) ise bina sahibinin ana anahtarıdır; kasada durur, günlük işte kullanılmaz. Sınır: bulutta kart saniyeler içinde başka birine devredilebilir (rol üstlenme), otelde bu yoktur."
gorev:
  aciklama: "Bu görev yereldir, bulutta hiçbir şey oluşturmaz. `jq` kuracaksın (`sudo apt install -y jq`), sonra örnek bir kullanıcı ve rol JSON'unu okuyup içindeki bilgileri çekeceksin. Kullanıcı anahtarı örnek (sahte) bir metindir."
  komutlar:
    - sudo apt install -y jq
    - |-
      cat > /tmp/iam-ornek.json <<'EOF'
      {"Users":[
       {"UserName":"ayse","MFA":true,"AccessKeys":[]},
       {"UserName":"ci-bot","MFA":false,"AccessKeys":[{"Id":"AKIAEXAMPLE0000000001","Status":"Active","AgeDays":412}]},
       {"UserName":"eski-stajyer","MFA":false,"AccessKeys":[{"Id":"AKIAEXAMPLE0000000002","Status":"Active","AgeDays":900}]}
      ]}
      EOF
    - jq -r '.Users[] | select(.MFA==false) | .UserName' /tmp/iam-ornek.json
    - jq -r '.Users[] | .UserName as $u | .AccessKeys[] | select(.AgeDays>365) | "\($u) \(.Id) \(.AgeDays) gun"' /tmp/iam-ornek.json
    - aws iam create-access-key help | head -30
  soru: "İkinci jq komutunun çıktısında kimler var ve her biri için bir sonraki adım ne olmalı (silmek, anahtarı yenilemek, rolle değiştirmek)?"
  telefon:
    soru: "Bir CI sunucusu AWS'ye erişmek için IAM kullanıcısının 400 günlük bir erişim anahtarını (access key) kullanıyor. Daha güvenli ve bakımı kolay bir alternatif nedir?"
    cevap: "IAM rolü. CI platformu, kısa ömürlü geçici kimlik bilgileriyle rolü üstlenir; saklanan uzun ömürlü anahtar olmaz, sızsa bile kısa sürede geçersiz kalır."
sorular:
  - id: bulut-002-s1
    soru: "IAM kullanıcısı (user) ile IAM rolü (role) arasındaki temel fark nedir?"
    cevap: "Kullanıcının kalıcı kimlik bilgileri (parola, erişim anahtarı) vardır. Rolün yoktur; üstlenildiğinde (assume) geçici kimlik bilgileri verilir. Bu yüzden rol, uygulamalar ve otomasyon için tercih edilir."
  - id: bulut-002-s2
    soru: "Kök hesap (root user) neden günlük iş için kullanılmamalı? Ona karşı ne yapılmalı?"
    cevap: "Kök hesap her şeye sınırsız erişir ve kısıtlanamaz. Günlük işler için yönetici kimliği oluşturulur; köke güçlü parola ve MFA konur, kök için erişim anahtarı üretilmez, kullanımı izlenir."
  - id: bulut-002-s3
    soru: "IAM politikası (policy) ne işe yarar ve varsayılan durum nedir?"
    cevap: "Hangi kimliğin hangi kaynak üzerinde hangi eylemi yapabileceğini JSON ile söyler. Varsayılan her şey yasaktır; izin yalnız bir politika açıkça verirse oluşur."
  - id: bulut-002-s4
    soru: "MFA nedir ve parola sızarsa neyi korur?"
    cevap: "Çok faktörlü doğrulama (multi-factor authentication), parolaya ek bir kanıt ister (uygulama kodu, güvenlik anahtarı). Parola çalınsa bile saldırgan ikinci faktör olmadan giriş yapamaz."
derinDalis:
  - tur: okuma
    baslik: "AWS: IAM'de güvenlik en iyi uygulamaları"
    ayrinti: "Geçici kimlik bilgileri, MFA, en az yetki ve erişim anahtarı yönetimi tek sayfada."
    url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
  - tur: okuma
    baslik: "AWS: Kök kullanıcı için en iyi uygulamalar"
    ayrinti: "Kök hesabı neden ve nasıl kilitleyeceğin."
    url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html"
---

**IAM** (Identity and Access Management, kimlik ve erişim yönetimi), AWS'de "kim, neyi, hangi koşulda yapabilir?" sorusunu yöneten servistir. Dört temel kavramı bil:

- **Kullanıcı** (user): Bir insanı ya da uygulamayı temsil eden kalıcı kimlik. Parolası ve/veya erişim anahtarı olabilir.
- **Grup** (group): Kullanıcıları toplar; izni gruba verirsin, kullanıcılar devralır.
- **Rol** (role): Kalıcı kimlik bilgisi taşımayan, üstlenildiğinde geçici bilgi veren kimlik. EC2 sunucuları, CI işleri ve başka hesaplar roller üstlenir.
- **Politika** (policy): İzinleri tanımlayan JSON belgesi. Kullanıcıya, gruba ya da role bağlanır.

### Varsayılan: yasak

IAM'de bir izin açıkça verilmedikçe yoktur. Bir istek geldiğinde şu sırayla düşünülür: açık bir **Deny** varsa red; yoksa bir **Allow** varsa kabul; ikisi de yoksa zımni red. Açık Deny her zaman kazanır.

### Kök hesap

Hesabı ilk açtığında bir **kök kullanıcı** (root user) oluşur. Her şeyi yapabilir ve kısıtlanamaz. AWS'nin önerisi: kökü yalnız onu gerektiren nadir işler için kullan, yerine yönetici bir kimlik oluştur; köke güçlü parola ve MFA ekle, **kök için erişim anahtarı üretme**, kullanımını izle.

### Uzun ömürlü anahtar yerine rol

Erişim anahtarı (access key) bir `AKIA...` kimliği ve gizli bir anahtardan oluşur. Bir dosyada, repoda ya da log'da kalırsa herkes senin yerine konuşabilir. Bu yüzden insanlar için kimlik sağlayıcıyla federasyon, uygulamalar için roller önerilir; geçici bilgiler kısa süre sonra kendiliğinden geçersiz olur.

### MFA

Parola tek başına yeterli değildir. MFA, ikinci bir kanıt ister. Kök hesap ve yetkili kullanıcılar için zorunlu say; mümkünse oltalamaya dayanıklı olan güvenlik anahtarlarını ve passkey'leri seç.

### Hızlı kontrol listesi

1. Kökte MFA var mı, kök için anahtar var mı (olmamalı)?
2. İnsanlar tek tek kullanıcıyla mı, merkezi kimlikle mi giriyor?
3. Uygulamalar rol mü kullanıyor, saklanmış anahtar mı?
4. Kullanılmayan kullanıcı ve anahtarlar temizleniyor mu?

Güvenlik notu: Gerçek bir erişim anahtarını asla sohbete, repoya ya da ekran görüntüsüne koyma. Derslerdeki `AKIAEXAMPLE...` gibi değerler uydurmadır.
