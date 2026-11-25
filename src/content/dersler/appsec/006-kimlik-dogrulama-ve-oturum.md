---
kimlik: appsec-006
baslik: "Kimlik doğrulama hataları ve oturum yönetimi"
donem: 5
sira: 6
sure: 35
neden: "Giriş sayfası saldırganın ilk denediği yerdir: kaba kuvvet, çalıntı parola listeleri, çalınan oturum çerezleri. DevSecOps mühendisi olarak giriş akışının ve oturum çerezinin doğru kurulup kurulmadığını denetleyebilmen gerekir."
analoji:
  baslik: "Otel kartı ve kapı kilidi"
  metin: "Otel odasının kartı (oturum kimliği) tahmin edilebilir bir numaraysa ya da girişte verilen kart, check-in öncesi bir yabancıya da gösterilmişse kilit işe yaramaz. Kart her girişte yenisi basılmalı, kopyalanması zor olmalı ve kaybolursa iptal edilmeli. Sınırı: otel kartı fizikseldir; oturum kimliği ağ üzerinde dolaşır, bu yüzden Secure ve HttpOnly gerekir."
gorev:
  aciklama: "Python'un yerleşik `hashlib.scrypt` fonksiyonuyla parola saklamayı ve sabit zamanlı karşılaştırmayı dene; ardından giriş hatasında aynı mesajın verilmesini gör."
  komutlar:
    - "mkdir -p ~/appsec && cd ~/appsec"
    - |
      cat > giris.py <<'EOF'
      import hashlib, hmac, os, secrets

      def hashle(parola, tuz):
          return hashlib.scrypt(parola.encode(), salt=tuz, n=2**14, r=8, p=1)

      tuz = os.urandom(16)
      kayitli = hashle("kedi-bulut-masa-cay", tuz)

      def giris(kullanici_var, parola):
          if kullanici_var and hmac.compare_digest(hashle(parola, tuz), kayitli):
              return "Giris basarili"
          return "Kullanici adi veya parola hatali"

      print(giris(True, "kedi-bulut-masa-cay"))
      print(giris(True, "yanlis"))
      print(giris(False, "kedi-bulut-masa-cay"))
      print("Oturum kimligi:", secrets.token_urlsafe(32))
      EOF
    - "python3 giris.py"
  soru: "Yanlış parola ile var olmayan kullanıcı için neden aynı hata mesajı verilmeli? Oturum kimliği neden `random` yerine `secrets` ile üretilir?"
  telefon:
    soru: "Giriş sayfası 'Bu e-posta kayıtlı değil' ve 'Parola yanlış' diye iki ayrı mesaj veriyor. Bu bir saldırgana ne kazandırır?"
    cevap: "Hangi e-postaların kayıtlı olduğunu öğrenmesini (kullanıcı numaralandırma). Böylece parola denemelerini yalnız gerçek hesaplara yoğunlaştırabilir. Çözüm: her iki durumda aynı genel mesaj, mümkünse yanıt süresi de benzer."
sorular:
  - id: appsec-006-s1
    soru: "Kaba kuvvet (brute force) saldırısına karşı hangi önlemler alınır?"
    cevap: "Giriş denemesi hız sınırlaması, hesap bazında kademeli kilitleme ya da gecikme, MFA, genel hata mesajları ve başarısız girişlerin kaydedilmesi. Kilitleme, saldırganın hesabı kasıtlı kilitlemesine (hizmet engelleme) yol açmayacak şekilde ayarlanır."
    ipucu: "Hata mesajının hesabın var olup olmadığını sızdırıp sızdırmadığına bak."
  - id: appsec-006-s2
    soru: "Oturum sabitleme (session fixation) nedir ve nasıl önlenir?"
    cevap: "Saldırgan, kurbanın tarayıcısına bildiği bir oturum kimliği yerleştirir; kurban bu kimlikle giriş yapınca saldırgan da aynı oturuma erişir. Önlem: giriş (ve yetki değişimi) sonrası oturum kimliğini yenilemek, eskisini geçersiz kılmak."
    ipucu: "Saldırgan kimlik bilgisini önceden ayarlarsa, giriş sonrası ne değişmeli?"
  - id: appsec-006-s3
    soru: "Oturum çerezinde `Secure`, `HttpOnly` ve `SameSite` ne işe yarar?"
    cevap: "`Secure`: çerez yalnız HTTPS'te gönderilir. `HttpOnly`: JavaScript çerezi okuyamaz (XSS'te çalmayı zorlaştırır). `SameSite`: çapraz site isteklerinde çerezin gönderilmesini sınırlar (CSRF'ye karşı ek katman)."
    ipucu: "Her bayrağın hangi saldırı yolunu kapattığını ayrı ayrı düşün."
  - id: appsec-006-s4
    soru: "Parolalar veri tabanında neden düz metin ya da hızlı bir hash (MD5, SHA-256) ile saklanmaz?"
    cevap: "Veri tabanı sızarsa düz metin parolalar doğrudan kullanılır; hızlı hash'ler saniyede milyarlarca denemeyle kırılır. Argon2id, scrypt gibi kasıtlı yavaş ve tuzlu algoritmalar kullanılır."
    ipucu: "Hızlı bir hash'i saniyede kaç kez deneyebilirsin?"
  - id: appsec-006-s5
    soru: Günlükte tek bir IP'den birkaç dakika içinde 5.000 farklı e-postayla başarısız giriş denemesi görüyorsun. Ne yaparsın?
    cevap: Bu kimlik bilgisi doldurma (credential stuffing) ya da kaba kuvvet saldırısına benziyor. IP ve hesap bazında hız sınırı ya da geçici kilit, şüpheli IP'yi engelleme, varsa CAPTCHA ve çok faktörlü doğrulama devreye alınır. Başarılı girişleri ayrıca inceler, etkilenen kullanıcılara parola sıfırlamayı önerirsin.
    ipucu: Hem denemeyi yavaşlat hem başarılı olanları ayıkla.
derinDalis:
  - tur: okuma
    baslik: "OWASP Session Management Cheat Sheet"
    ayrinti: "Oturum kimliği özellikleri, çerez öznitelikleri, yenileme ve sonlandırma."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"
  - tur: okuma
    baslik: "OWASP Authentication Cheat Sheet"
    ayrinti: "Genel hata mesajları, kilitleme, MFA ve diğer giriş savunmaları."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"
  - tur: okuma
    baslik: "OWASP Password Storage Cheat Sheet"
    ayrinti: "Hangi algoritma, hangi parametrelerle; Argon2id öncelikli."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"
hizliKontrol:
  - soru: Oturum sabitleme saldırısına karşı en doğrudan önlem hangisidir?
    secenekler:
      - Parolayı sık değiştirmek
      - Giriş yapıldığında oturum kimliğini yenilemek
      - Çerezi küçük harfle yazmak
      - Giriş sayfasını gizlemek
    dogru: 1
    aciklama: Yenileme, saldırganın önceden bildiği kimliği geçersiz kılar.
    ipucu: Saldırganın bildiği kimlik giriş sonrası da geçerli kalmamalı.
sikHatalar:
  - hata: Parolaları MD5 ya da SHA-256 ile saklamak.
    dogrusu: Parolalar için Argon2id, scrypt ya da bcrypt gibi yavaş, tuzlu algoritmalar kullan.
  - hata: Giriş hatalarında 'e-posta kayıtlı değil' diye ayrı mesaj vermek.
    dogrusu: Her iki durumda aynı genel mesajı ver; kullanıcı numaralandırmasını önle.
terimler:
  - Kaba kuvvet saldırısı
  - Oturum sabitleme
  - HttpOnly
  - Tuz
---

Kimlik doğrulama (authentication) "bu kişi kim?" sorusunu cevaplar. Oturum yönetimi ise cevaplandıktan sonra "bu kişiyi her istekte nasıl hatırlıyoruz?" sorusunu. İkisi de hata kaldırmaz. (Parola hash'inin temelini temeller bölgesinde gördük; burada uygulama tarafına bakıyoruz.)

### Kimlik doğrulama hataları

- **Kaba kuvvet ve parola doldurma (credential stuffing):** Saldırgan sızdırılmış kullanıcı-parola listelerini senin sitende dener. Hız sınırlama, MFA ve bilinen sızdırılmış parolaları reddetmek en etkili savunmalardır.
- **Kullanıcı numaralandırma:** "Bu e-posta kayıtlı değil" mesajı, kayıtlı e-postaları ifşa eder. Her başarısızlıkta aynı genel mesajı ver; parola sıfırlama sayfasında da.
- **Zayıf parola saklama:** Parolalar Argon2id gibi yavaş ve tuzlu bir algoritmayla hash'lenir, kendi algoritmanı yazma.
- **Varsayılan hesaplar:** `admin/admin` gibi hesaplar kurulumdan sonra kapatılmalı.

### Oturum yönetimi

Giriş sonrası sunucu bir **oturum kimliği** üretir, tarayıcı bunu çerezle geri gönderir. Kimliği ele geçiren, kullanıcının yerine geçer. Bu yüzden:

1. **Tahmin edilemez ol:** Kriptografik rastgelelik kullan (`secrets`, `crypto.randomBytes`); `random` ya da sıra numarası değil.
2. **Giriş sonrası yenile:** Yetki düzeyi değişince (giriş, yönetici moduna geçiş) kimliği yeniden üret. Böylece oturum sabitleme çalışmaz.
3. **Çerezi koru:**

```
Set-Cookie: oturum=...; Secure; HttpOnly; SameSite=Lax; Path=/
```

4. **Kimliği URL'ye koyma:** Adres çubuğu, günlükler ve `Referer` başlığı üzerinden sızar.
5. **Düzgün çıkış:** Çıkışta oturum sunucu tarafında da geçersiz kılınmalı, yalnız çerez silinmemeli.
6. **Zaman aşımı:** Boşta ve mutlak süre sınırları koy.

### Hızlı örnek

```python
# Kötü: tahmin edilebilir
oturum_id = str(kullanici_id) + str(time.time())

# İyi: kriptografik rastgele
oturum_id = secrets.token_urlsafe(32)
```

Güvenlik notu: Kendi yazdığın bir giriş sistemi yerine mümkünse çerçevenin ya da tanınmış bir kimlik sağlayıcının hazır çözümünü kullan; oturum ve parola işleri ince ayrıntılar içerir.
