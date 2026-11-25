---
kimlik: bulut-006
baslik: "Sır ve anahtar yönetimi"
donem: 8
sira: 6
sure: 30
neden: "Repoya yanlışlıkla işlenen bir erişim anahtarı, saatler içinde otomatik tarayıcılar tarafından bulunabilir. Sırları koddan çıkarmak, rotasyonla ömürlerini kısaltmak ve şifreleme anahtarlarının kullanımını sınırlamak DevSecOps'un temel görevlerindendir."
analoji:
  baslik: "Kasa ve anahtar kartı"
  metin: "KMS, bankanın ana kasasıdır: anahtarlar kasadan hiç çıkmaz, sen yalnız 'şunu şifrele' dersin. Secrets Manager ise emanet kasası ve görevlisidir: parolayı sen not defterine yazmazsın, her ihtiyacında görevliden ister, görevli de parolayı düzenli değiştirir. Sınır: kasa görevlisine 'herkese ver' izni verirsen kasa boşa gider."
gorev:
  aciklama: "Bulutta sır oluşturmaz. Bir örnek proje dizini yapıp içine sahte anahtarlar koyacak, sonra `grep` ile AWS erişim anahtarı desenini arayacaksın. AWS'nin belgelerindeki örnek anahtar kimliği (`AKIAIOSFODNN7EXAMPLE`) gerçek bir anahtar değildir."
  komutlar:
    - mkdir -p /tmp/proje/src && cd /tmp/proje
    - |-
      cat > src/ayar.py <<'EOF'
      AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE"
      DB_URL = "postgres://app:parola123@db.ornek.local/app"
      EOF
    - echo 'KULLANICI=ayse' > src/notlar.txt
    - grep -rnE 'AKIA[0-9A-Z]{16}' /tmp/proje
    - grep -rniE '(password|parola|secret)' /tmp/proje
    - aws secretsmanager rotate-secret help | sed -n '1,25p'
  soru: "İki tarama hangi dosyada neleri buldu? Bu sırları koddan çıkarmanın doğru yolu ne olurdu ve zaten commit edilmişlerse yalnızca silmek yeter mi?"
  telefon:
    soru: "Bir geliştirici yanlışlıkla gerçek bir erişim anahtarını public repoya push etti ve 5 dakika sonra sildi. Sorun çözüldü mü?"
    cevap: "Hayır. Anahtar git geçmişinde ve kopyalarda durur; tarayıcılar dakikalar içinde bulabilir. Anahtarı derhal devre dışı bırakıp yenisini üret, CloudTrail'de kullanımını incele. Geçmişi temizlemek ek bir adımdır; ama asıl çare anahtarın iptalidir."
sorular:
  - id: bulut-006-s1
    soru: "KMS ne işe yarar ve anahtarın kendisi neden dışarı çıkmaz?"
    cevap: "KMS (Key Management Service) şifreleme anahtarlarını güvenli donanımda tutar. Uygulama anahtarı almaz; şifrele ya da çöz isteği gönderir. Anahtar sızma riski ve erişim denetimi bu şekilde azalır."
    ipucu: "Anahtarın servis dışına çıkıp çıkmadığını düşün."
  - id: bulut-006-s2
    soru: "Zarf şifrelemesi (envelope encryption) kısaca nedir?"
    cevap: "Veri, veri anahtarıyla şifrelenir; veri anahtarı da KMS'teki ana anahtarla şifrelenip veriyle birlikte saklanır. Böylece büyük veri KMS'e gönderilmez ve ana anahtar sende kontrol altında kalır."
    ipucu: "İki katmanlı anahtar yapısını hatırla: veri anahtarı ve ana anahtar."
  - id: bulut-006-s3
    soru: "Secrets Manager rotasyonu neden önemlidir?"
    cevap: "Sır düzenli aralıklarla otomatik değiştirilir. Bir sır sızsa bile geçerlilik süresi sınırlıdır, ayrıca kimse eski parolayı elle bilmek zorunda kalmaz. Rotasyon hem sırın hem hizmetin kimlik bilgisini günceller."
    ipucu: "Sızan sırrın geçerli kalma süresini kısaltan şey ne?"
  - id: bulut-006-s4
    soru: "Sırları ortam değişkenine koymak ile Secrets Manager'dan çalışma anında çekmek arasındaki fark nedir?"
    cevap: "Ortam değişkeni dağıtım ya da süreç dökümünde görünebilir ve değiştirmek için yeniden dağıtım gerekir. Secrets Manager'da erişim IAM ile kısıtlanır, kayıt altındadır, sır güncellenebilir ve rotasyon desteklenir."
    ipucu: "Hangisinde erişim kısıtlanır, kayıt tutulur ve değerler yenilenir?"
  - id: bulut-006-s5
    soru: "Bir geliştirici veritabanı parolasını yanlışlıkla public repoya push etti, 10 dakika sonra commit'i sildi. Ne yaparsın?"
    cevap: "Silmek yetmez: parolayı hemen değiştirir (iptal ve rotasyon) ve sırrı kullanan servisleri güncellerim. Sonra veritabanı erişim kayıtlarında yabancı bağlantı ararım. Gelecek için commit öncesi sır taraması ve Secrets Manager kullanımını öneririm."
    ipucu: "Git geçmişini ve botların tarama hızını düşün."
derinDalis:
  - tur: okuma
    baslik: "AWS: Secrets Manager sırlarını döndürmek"
    ayrinti: "Yönetilen rotasyon ile Lambda tabanlı rotasyon arasındaki fark."
    url: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html"
hizliKontrol:
  - soru: "Zarf şifrelemesinde veri anahtarı nasıl saklanır?"
    secenekler: ["Düz metin olarak veriyle birlikte","KMS ana anahtarıyla şifrelenip veriyle birlikte","Kod deposunda","Hiç saklanmaz, her seferinde üretilir"]
    dogru: 1
    aciklama: "Veri anahtarı ana anahtarla şifrelenir ve veriyle birlikte saklanır."
    ipucu: "Zarfın içinde bir anahtar, dışında bir kilit düşün."
sikHatalar:
  - hata: "Sırrı sızdıktan sonra yalnız dosyadan silmek."
    dogrusu: "Sırrı iptal et ve değiştir; geçmişi temizlemek ikincil adımdır."
  - hata: "Parolayı `.env` dosyasında repoya koymak."
    dogrusu: "Sırları Secrets Manager'dan çalışma anında çek; `.env` repoya girmesin."
terimler:
  - "KMS"
  - "Zarf şifrelemesi"
  - "Secrets Manager"
  - "Rotasyon"
---

**Sır** (secret), bir sistemin kimliğini kanıtlayan her değerdir: parola, API anahtarı, erişim anahtarı, veritabanı bağlantı adresi, özel anahtar. Sırlarda üç kural vardır: **kodda durmasın, ömrü kısa olsun, kim kullandı bilinsin.**

### Sır neden koda girer?

Çünkü kolay. Hızlıca denemek için bir dosyaya yazılır, commit edilir. Git geçmişi silmeyi unutur: dosyayı sonradan silsen bile eski commit'te durur. Public repoda ise bot tarayıcılar yeni commit'leri sürekli tarar.

### AWS'de iki araç

**KMS** (Key Management Service) şifreleme anahtarlarını tutar. Anahtar servisin dışına çıkmaz; sen "şu veriyi şifrele" ya da "çöz" diye istek gönderirsin. Hangi kimliğin hangi anahtarı kullanabileceğini IAM ve anahtar politikasıyla sınırlarsın; her kullanım kayıt altına girer.

Büyük veri için **zarf şifrelemesi** (envelope encryption) kullanılır: veri, bir veri anahtarıyla şifrelenir; o anahtar da KMS ana anahtarıyla şifrelenip yanında saklanır. S3'ün SSE-KMS seçeneği bunu senin yerine yapar.

**Secrets Manager** parola ve API anahtarı gibi sırları saklar. Uygulama sırrı çalışma anında çağırır; IAM izniyle kısıtlıdır. En büyük artısı **rotasyon** (rotation): sırrı düzenli olarak değiştirir ve hem sırrı hem hedef servisi günceller. Bazı servisler için bu yönetilen olarak gelir, diğerleri bir Lambda fonksiyonu ister.

### Yaklaşım karşılaştırması

| Yöntem | Sızma riski | Not |
|---|---|---|
| Koda gömülü | Çok yüksek | Git geçmişinde kalır |
| `.env` dosyası repoda | Yüksek | `.gitignore` unutulursa sızar |
| Ortam değişkeni | Orta | Süreç dökümlerinde görünebilir |
| Secrets Manager + rol | Düşük | İzin, kayıt ve rotasyon var |

### Sızdırılmışsa

Yalnız dosyayı silmek yetmez. Sırrı **iptal et ve değiştir**. Sonra kullanımını logda ara (7. ders). Geçmişi yeniden yazmak ikincil bir temizliktir.

### Önleme zinciri

1. **Commit öncesi tarama** (pre-commit): yerel bir araç yeni değişikliklerde sır desenlerini arar.
2. **Pipeline taraması**: repoya girmeden yakalar.
3. **Kısa ömürlü kimlik bilgisi**: Sızsa bile süresi dolar.

Güvenlik notu: AWS erişim anahtarı kimlikleri belirli bir önekle başlar (ör. `AKIA`); tarayıcılar bu deseni arar. Desen taraması kaçırabilir (rastgele parolalar gibi), bu yüzden tek savunma olarak görme.
