---
kimlik: appsec-002
baslik: "Girdi doğrulama ve çıktı kodlama"
donem: 5
sira: 2
sure: 30
neden: "Web açıklarının büyük kısmı tek bir hatadan doğar: dışarıdan gelen veriye güvenmek. Bir DevSecOps mühendisi kod incelemesinde 'bu veri nereden geliyor, nereye gidiyor?' sorusunu sürekli sorar. Bu ders, sonraki enjeksiyon derslerinin temeli."
analoji:
  baslik: "Mutfağa gelen malzeme ve servise çıkan tabak"
  metin: "Mutfağa gelen her malzeme kapıda kontrol edilir (girdi doğrulama): bozuk mu, sipariş edilen mi? Servise çıkan tabak ise müşterinin damak ve alerjisine göre hazırlanır (çıktı kodlama). Birini yapıp diğerini atlamak yetmez. Sınırı: kapıdaki kontrol her zararlı malzemeyi yakalayamaz, bu yüzden tabak hazırlanırken de önlem alınır."
gorev:
  aciklama: "Python ile iki küçük deneme yap: önce bir girdiyi izin listesiyle doğrula, sonra tehlikeli bir metni HTML için kodla. Her şey yerelde çalışır."
  komutlar:
    - "mkdir -p ~/appsec && cd ~/appsec"
    - |
      cat > dogrula.py <<'EOF'
      import re, html

      def yas_dogrula(deger):
          if not re.fullmatch(r"[0-9]{1,3}", deger):
              raise ValueError("gecersiz yas")
          yas = int(deger)
          if not 0 <= yas <= 130:
              raise ValueError("aralik disi")
          return yas

      for deneme in ["25", "abc", "999", "25; DROP TABLE"]:
          try:
              print(deneme, "->", yas_dogrula(deneme))
          except ValueError as e:
              print(deneme, "-> RED:", e)

      kullanici_metni = '<script>alert("merhaba")</script>'
      print(html.escape(kullanici_metni))
      EOF
    - "python3 dogrula.py"
  soru: "Çıktının son satırında `<` ve `>` karakterleri ne olmuş? Tarayıcı bu satırı gösterirken neden betik çalışmaz?"
  telefon:
    soru: "Bir form 'telefon' alanına `+90 555 123 45 67` yazılmasını bekliyor. İzin listesi (allow-list) yaklaşımıyla mı, yasak listesi (deny-list) yaklaşımıyla mı doğrulamak daha güvenli ve neden?"
    cevap: "İzin listesi. Kabul edilebilecek biçimi tanımlarsın (rakam, boşluk, +); bunun dışındaki her şey reddedilir. Yasak listesi, saldırganın aklına gelen her kötü karakteri öngörmeni gerektirir ve genellikle atlatılır."
sorular:
  - id: appsec-002-s1
    soru: "Girdi doğrulama ile çıktı kodlama (output encoding) arasındaki fark nedir?"
    cevap: "Girdi doğrulama, veri sisteme girerken biçimini ve aralığını denetler. Çıktı kodlama, veri bir bağlama (HTML, SQL, kabuk komutu) yazılırken özel karakterlerin anlamını nötrler. İkisi birbirinin yerine geçmez."
    ipucu: "Biri veriyi içeri alırken, öteki dışarı yazarken devreye girer."
  - id: appsec-002-s2
    soru: "Tarayıcıda JavaScript ile yapılan doğrulama neden güvenlik önlemi sayılmaz?"
    cevap: "İstemci saldırganın kontrolündedir; kodu devre dışı bırakabilir ya da isteği doğrudan sunucuya (ör. curl ile) gönderebilir. İstemci doğrulaması yalnız kullanıcıya hızlı geri bildirim içindir; asıl doğrulama sunucuda yapılır."
    ipucu: "Saldırgan tarayıcıyı atlayıp isteği doğrudan gönderebilir; kontrolü kim yapmalı?"
  - id: appsec-002-s3
    soru: "Kullanıcı girdisini `<div>` içine yazarken hangi kodlama, bir SQL sorgusuna yazarken hangi önlem gerekir?"
    cevap: "HTML bağlamında HTML kodlaması (`<` → `&lt;`). SQL bağlamında kodlama yerine parametreli sorgu. Her bağlamın kendi özel karakterleri olduğu için önlem de bağlama göre seçilir."
    ipucu: "Her hedef dilin özel karakterleri farklıdır; HTML ve SQL için araçlar aynı mı?"
  - id: appsec-002-s4
    soru: "'Bütün girdilerden tırnak işaretlerini silerim' yaklaşımı neden zayıftır?"
    cevap: "Kötü niyetli girdi yalnız tırnakla sınırlı değildir; farklı bağlamlar farklı karakterleri tehlikeli kılar. Ayrıca meşru veri bozulur (ör. O'Brien soyadı). Doğru yol: bağlama uygun kodlama ve izin listesiyle doğrulama."
    ipucu: "Silinen karakterin başka bir biçimde geri gelip gelemeyeceğini düşün."
  - id: appsec-002-s5
    soru: Bir PR'da, kullanıcı adının `<h1>` içine kodlamadan yazıldığını görüyorsun. Geliştirici 'girişte zaten sadece harf kabul ediyoruz' diyor. Ne yazarsın?
    cevap: "Giriş doğrulaması iyi bir ilk katmandır ama yeterli değildir: kural bir gün gevşetilebilir, veri başka bir yoldan (içe aktarma, API) gelebilir. Çıktı noktasında HTML kodlaması şart; bunu şablon motorunun otomatik kodlamasıyla yapmasını öner. İki katman birlikte çalışır."
    ipucu: Veri sisteme başka bir yoldan girerse giriş kuralı ne işe yarar?
derinDalis:
  - tur: okuma
    baslik: "OWASP Input Validation Cheat Sheet"
    ayrinti: "Sözdizimsel ve anlamsal doğrulama, izin listesi mantığı, sunucu tarafı vurgusu."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
hizliKontrol:
  - soru: Kullanıcı girdisi bir HTML sayfasına yazılırken hangi işlem uygulanır?
    secenekler:
      - SQL parametresi bağlamak
      - Büyük harfe çevirmek
      - Bağlama uygun çıktı kodlaması (HTML kodlama)
      - Girdiyi şifrelemek
    dogru: 2
    aciklama: Kodlama, `<` gibi karakterlerin kod değil metin olarak gösterilmesini sağlar.
    ipucu: Önlem, verinin yazıldığı bağlama göre seçilir.
sikHatalar:
  - hata: Girdiyi yalnız tarayıcıda (JavaScript ile) doğrulamak.
    dogrusu: Doğrulama sunucuda yapılır; tarayıcı kontrolü yalnız kullanıcıya hızlı geri bildirim içindir.
  - hata: Yasak listesi yazıp 'tehlikeli' kelimeleri silmek.
    dogrusu: "İzin listesi kullan: neyin kabul edileceğini tanımla, gerisini reddet."
terimler:
  - Girdi doğrulama
  - İzin listesi
  - Çıktı kodlama
---

Uygulamana dışarıdan giren her veri **güvenilmezdir**: form alanları, URL parametreleri, başlıklar, çerezler, yüklenen dosyalar, hatta başka bir servisten gelen yanıtlar. İki savunma birlikte çalışır.

### 1. Girdi doğrulama (input validation)

Veri sisteme girdiği anda kontrol edilir: doğru **tür**, **uzunluk**, **aralık** ve **biçim** mi?

```python
import re
def kullanici_adi(deger):
    if not re.fullmatch(r"[a-z0-9_]{3,20}", deger):
        raise ValueError("geçersiz kullanıcı adı")
    return deger
```

Kural: **izin listesi (allow-list)**. "İşte kabul ettiklerim" diye tanımla, gerisini reddet. "Kötü karakterleri çıkar" (yasak listesi) yaklaşımı her zaman bir açıkta kalır: saldırgan listede olmayan bir yol bulur.

Doğrulama **sunucuda** yapılmalıdır. Tarayıcıdaki kontrol (örneğin bir `pattern` özelliği) kullanıcıya kolaylık sağlar ama güvenlik değildir; saldırgan formu hiç kullanmadan isteği doğrudan gönderebilir.

### 2. Çıktı kodlama (output encoding)

Veri bir yere **yazılırken** o bağlamın özel karakterleri etkisizleştirilir:

| Hedef bağlam | Doğru önlem |
|---|---|
| HTML içeriği | HTML kodlama (`<` → `&lt;`) |
| HTML özniteliği | Öznitelik kodlaması, tırnak içinde yaz |
| SQL sorgusu | Parametreli sorgu (ders 3) |
| Kabuk komutu | Kabuğa hiç string verme; argüman listesi kullan |
| URL | URL kodlama |

Her bağlam kendi dilini konuşur. HTML'de zararsız bir karakter SQL'de tehlikeli olabilir. Bu yüzden "tek bir temizleme fonksiyonu ile her şeyi çöz" fikri yanlıştır.

### Neden ikisi birlikte?

Doğrulama, kötü veriyi mümkün olduğunca erken durdurur ve uygulamanın veri modelini temiz tutar. Ama doğrulama geçen bir veri de başka bağlamda tehlikeli olabilir: `O'Brien` soyadı geçerli bir isimdir, ama SQL'e doğrudan yapıştırılırsa sorguyu bozar. Çıktı kodlama bu son adımı güvenceye alır.

### Kod incelemesi için sorular

- Bu veri nereden geldi, kim kontrol ediyor?
- Nereye gidiyor (HTML, SQL, dosya yolu, komut)?
- Gittiği bağlam için doğru kodlama ya da parametre kullanılmış mı?

Güvenlik notu: Doğrulama kodunu kendin yazmak yerine çerçevenin (framework) hazır doğrulayıcılarını ve otomatik kodlayan şablon motorlarını tercih et; kendi yazdığın düzenli ifadeler (regex) de hata ve yavaşlık (ReDoS) riski taşır.
