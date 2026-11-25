---
kimlik: appsec-012
baslik: "Güvenli kod incelemesi"
donem: 5
sira: 12
sure: 35
neden: "Araçlar çok şeyi yakalar ama 'bu uç noktada sahiplik kontrolü unutulmuş' gibi bağlama özgü hataları bir insan görür. DevSecOps mühendisi pull request'lerde hızlı ve sistemli güvenlik bakışı yapabilmeli. Bu ders, bölgenin tüm konularını bir inceleme listesine toplar."
analoji:
  baslik: "Uçak öncesi kontrol listesi"
  metin: "Deneyimli pilot bile kalkıştan önce listeyi madde madde okur, çünkü acelede akıl atlatır. Kod incelemesi kontrol listesi de aynıdır: her seferinde aynı soruları sormanı sağlar. Sınırı: liste bilinen hatalar içindir; yeni türden bir sorun için dikkatli düşünmek gerekir."
gorev:
  aciklama: "Birkaç kasıtlı açık içeren küçük bir Python dosyası oluştur ve `grep` ile kırmızı bayrakları ara. Dosya hiç çalıştırılmaz, yalnız okunur."
  komutlar:
    - "mkdir -p ~/appsec && cd ~/appsec"
    - |
      cat > inceleme_ornek.py <<'EOF'
      import os, subprocess, sqlite3

      API_KEY = "sk_live_ornek1234567890"

      def ara(db, ad):
          return db.execute(f"SELECT * FROM kullanici WHERE ad = '{ad}'").fetchall()

      def ping(host):
          return subprocess.run("ping -c1 " + host, shell=True)

      def hesapla(ifade):
          return eval(ifade)

      def notu_getir(not_id):
          return db.execute("SELECT * FROM notlar WHERE id = ?", (not_id,)).fetchone()
      EOF
    - "grep -n -E 'execute\\(f|shell=True|eval\\(|exec\\(' inceleme_ornek.py"
    - "grep -n -i -E 'api_key|secret|password|token' inceleme_ornek.py"
  soru: "Taramanın bulduğu satırlardan her biri hangi açık sınıfına girer ve nasıl düzeltilir? Aramanın yakalayamadığı, ama yine de sorunlu olan bir satır var mı (ipucu: `notu_getir`)?"
  telefon:
    soru: "PR'da şu satırı görüyorsun: `os.system(\"convert \" + dosya_adi + \" out.png\")` ve `dosya_adi` kullanıcıdan geliyor. Kırmızı bayrak nedir, nasıl düzeltirsin?"
    cevap: "Komut enjeksiyonu: dosya adı kabuk komutuna birleştiriliyor (`; rm ...` gibi eklemeler çalışabilir). Düzeltme: kabuk kullanmadan argüman listesiyle çağırmak (`subprocess.run([\"convert\", dosya_adi, \"out.png\"])`) ve dosya adını doğrulamak."
sorular:
  - id: appsec-012-s1
    soru: "Güvenlik odaklı kod incelemesinde ilk bakılacak üç yer neresidir?"
    cevap: "Dış girdinin girdiği noktalar (istek parametreleri, dosya yükleme), girdinin gittiği tehlikeli yerler (sorgu, komut, dosya yolu, HTML çıktısı) ve kimlik doğrulama/yetkilendirme kontrolleri."
    ipucu: "Kullanıcıdan gelen veri kodda nereye ulaşıyor? Veriyi izle."
  - id: appsec-012-s2
    soru: "Kodda sabit yazılmış sır (API anahtarı) bulunca ne yaparsın?"
    cevap: "Anahtarı koddan çıkarıp ortam değişkeni ya da sır yöneticisine taşırsın. Depoya girdiyse, geçmişte kaldığı için anahtarı iptal edip yenisini üretirsin (döndürme)."
    ipucu: "Sırrı koda yazan kişi sırrı sızdırmış sayılır; sonra ne gerekir?"
  - id: appsec-012-s3
    soru: "`grep` ve otomatik araçlar neden insan incelemesinin yerini tutmaz?"
    cevap: "Araçlar kalıpları yakalar ama iş mantığını bilmez: 'bu kaydı bu kullanıcı görebilir mi?' gibi hatalar kalıp olarak görünmez. Ayrıca yanlış pozitifler ve kaçırılan bulgular olur."
    ipucu: "Araç ne yakalar, ne kaçırır? İş mantığı hatalarını düşün."
  - id: appsec-012-s4
    soru: "İnceleme yorumunu nasıl yazarsın ki geliştirici anlasın ve düzeltsin?"
    cevap: "Yeri (dosya, satır), sorunu (hangi girdi nereye gidiyor), riski ve somut düzeltmeyi (örnek kodla) yaz. Kişiyi değil kodu eleştir; örneğin 'Bu sorgu parametrelenmeli, şu şekilde:' gibi."
    ipucu: "Yorum geliştiriciye hem ne yanlış hem nasıl düzelir diye söylemeli."
  - id: appsec-012-s5
    soru: PR'da `yaml.load(istek.govde)` ve `subprocess.run(komut, shell=True)` görüyorsun. İkisi için kısa inceleme yorumları nasıl olur?
    cevap: "`yaml.load` için: güvenilmeyen girdiyi güvenli yükleyiciyle (ör. `yaml.safe_load`) işle, aksi halde nesne oluşturma yoluyla kod çalıştırılabilir. `shell=True` için: kullanıcı girdisi kabuğa gidiyor, komut enjeksiyonu riski var; argüman listesiyle çağır, girdiyi izin listesiyle doğrula. Her yorumda risk, neden ve önerilen düzeltme yer alır."
    ipucu: Her yorumda sorun, sebep ve çözüm olsun.
derinDalis:
  - tur: okuma
    baslik: "OWASP Secure Code Review Cheat Sheet"
    ayrinti: "İnceleme yöntemi, yaygın zafiyet kalıpları ve kontrol listeleri."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html"
hizliKontrol:
  - soru: Güvenli kod incelemesinde en verimli yaklaşım hangisidir?
    secenekler:
      - Yalnız değişen satırların biçimine bakmak
      - Kullanıcı girdisinin kodda nereye aktığını izlemek
      - Yalnız araç çıktısına güvenmek
      - Testleri silip yeniden yazmak
    dogru: 1
    aciklama: Güvenlik açıklarının çoğu, güvenilmeyen verinin tehlikeli bir noktaya ulaşmasıyla oluşur.
    ipucu: Kaynaktan hedefe giden veri yolunu düşün.
sikHatalar:
  - hata: Koda yanlışlıkla yazılan API anahtarını silip commit etmekle yetinmek.
    dogrusu: "Anahtar sızmış sayılır: iptal et, yenisini üret ve geçmişteki kullanımları kontrol et."
  - hata: "'Araç bir şey bulmadı, kod temiz' demek."
    dogrusu: Araçlar iş mantığı ve yetki hatalarının çoğunu kaçırır; insan incelemesi tamamlayıcıdır.
terimler:
  - Komut enjeksiyonu
  - SAST
---

Güvenli kod incelemesi, bir değişikliğe saldırgan gözüyle bakmaktır. Amaç kod stilini düzeltmek değil, **güvenlik hatasını yayına çıkmadan yakalamak**. Otomatik araçlar (SAST, bağımlılık taraması) iyi bir ilk süzgeçtir; ama iş mantığı ve bağlam hataları için insan bakışı gerekir.

### Yöntem: veriyi izle

İncelemede tek soru: **güvenilmeyen veri nereden girer, nereye gider?**

1. **Girişler:** İstek parametreleri, başlıklar, çerezler, dosyalar, harici servis yanıtları.
2. **Hedefler (sink):** SQL sorgusu, kabuk komutu, dosya yolu, HTML çıktısı, URL isteği, serileştirme.
3. **Arada:** doğrulama, kodlama, parametreleme var mı? Bağlama uygun mu?

### Kırmızı bayrak tablosu

| Gördüğün | Muhtemel sorun | Ders |
|---|---|---|
| Sorguda string birleştirme / f-string | SQL injection | 3 |
| `innerHTML`, `\|safe`, `dangerouslySetInnerHTML` | XSS | 4 |
| Durumu değiştiren istekte token yok | CSRF | 5 |
| `random` ile oturum kimliği, düz metin parola | Kimlik doğrulama hatası | 6 |
| ID ile kayıt getirip sahipliğe bakmama | IDOR | 7 |
| `DEBUG=True`, ham hata gösterimi | Yanlış yapılandırma | 8 |
| Eski sürüm sabitleri, kilit dosyası yok | Savunmasız bağımlılık | 9 |
| Kullanıcı URL'sine `requests.get` | SSRF | 10 |
| `shell=True`, `os.system`, `eval` | Komut/kod enjeksiyonu | 2 |
| Koda gömülü anahtar | Sır sızıntısı | DevOps bölgesi |

### İnceleme kontrol listesi

- **Girdi:** Sunucuda, izin listesiyle doğrulanıyor mu?
- **Çıktı:** Bağlama uygun kodlanıyor mu?
- **Kimlik doğrulama:** Giriş, parola saklama, oturum doğru mu?
- **Yetkilendirme:** Her uç noktada, sunucuda ve sahiplik düzeyinde mi?
- **Sırlar:** Kodda ya da günlükte yok mu?
- **Hata ve günlük:** Hata kullanıcıya ayrıntı sızdırıyor mu? Önemli olaylar kaydediliyor mu, ama sır yazılmıyor mu?
- **Bağımlılık:** Yeni paket güvenilir mi, gerekli mi?
- **Test:** Güvenlik davranışı için test eklenmiş mi (yetkisiz kullanıcı reddediliyor mu)?

### İyi inceleme yorumu

Kötü: "Bu güvensiz."
İyi: "`ara()` içinde sorgu f-string ile kuruluyor; `ad` kullanıcıdan geliyor. Parametreli sorguya çevirelim: `db.execute(\"... WHERE ad = ?\", (ad,))`."

Yeri, nedeni ve çözümü yaz. Kişiye değil koda odaklan; kimse hata yapmamış olmaz.

### Araçlarla birlikte

`grep` basit ama etkili bir başlangıçtır; Pipeline bölgesinde Semgrep gibi araçlarla bunu otomatikleştireceğiz. Araç bulgusu inceleme için bir ipucudur, hüküm değil: yanlış pozitifleri ayıkla, kaçanları insan gözüyle yakala.

Güvenlik notu: Gerçek bir sır (anahtar, parola) bulursan inceleme yorumuna ya da günlüğe değerini yazma; yalnız yerini belirt. Yorumlar ve günlükler kopyalanır, saklanır.
