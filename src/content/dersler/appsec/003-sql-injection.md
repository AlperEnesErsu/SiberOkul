---
kimlik: appsec-003
baslik: "SQL injection"
donem: 5
sira: 3
sure: 35
neden: "SQL injection yıllardır en yıkıcı uygulama açıklarından biri; tek bir sorgu bütün veri tabanını okutabilir. Çözümü de bilinen ve basit: parametreli sorgu. DevSecOps mühendisi olarak hem kodda bu deseni tanıyacak hem de SAST bulgularını yorumlayacaksın."
analoji:
  baslik: "Çekin boş satırına eklenen yazı"
  metin: "Bir banka çeki düşün: 'Ödenecek tutar: ___'. Parametreli sorgu, boşluğa yalnız bir sayı yazılmasına izin verir. Injection ise boşluğa 've ayrıca şu hesabı da boşalt' diye talimat yazılabilmesidir; banka görevlisi veriyi komuttan ayıramaz. Sınırı: gerçek çekte talimat yazmak kolay fark edilir; yazılımda veri ve komut aynı metin içinde karışır."
gorev:
  aciklama: "Bellekte çalışan bir SQLite veri tabanı ile önce açıklı, sonra düzeltilmiş sorguyu dene. Python'un yerleşik `sqlite3` modülü yeterli; kurulum gerekmez."
  komutlar:
    - "mkdir -p ~/appsec && cd ~/appsec"
    - |
      cat > sqli.py <<'EOF'
      import sqlite3
      db = sqlite3.connect(":memory:")
      db.execute("CREATE TABLE kullanici (ad TEXT, parola TEXT)")
      db.execute("INSERT INTO kullanici VALUES ('ayse', 'gizli1'), ('can', 'gizli2')")

      girdi = "x' OR '1'='1"

      acikli = f"SELECT ad FROM kullanici WHERE ad = '{girdi}'"
      print("ACIKLI sorgu:", acikli)
      print("sonuc:", db.execute(acikli).fetchall())

      guvenli = "SELECT ad FROM kullanici WHERE ad = ?"
      print("GUVENLI sonuc:", db.execute(guvenli, (girdi,)).fetchall())
      EOF
    - "python3 sqli.py"
  soru: "Açıklı sorguda `WHERE` koşulu neden herkes için doğru oldu? Güvenli sürümde aynı girdi neden hiçbir satır döndürmedi?"
  telefon:
    soru: "Sorgu `\"SELECT * FROM urun WHERE id = \" + id` biçiminde kuruluyor ve `id` değerine `1 OR 1=1` yazılıyor. Sorgu ne olur ve nasıl düzeltilir?"
    cevap: "Sorgu `WHERE id = 1 OR 1=1` olur; koşul her satır için doğru olduğundan tüm ürünler döner. Düzeltme: `WHERE id = ?` ile parametreli sorgu kullanmak, değeri ayrı vermek."
sorular:
  - id: appsec-003-s1
    soru: "SQL injection neden oluşur?"
    cevap: "Kullanıcı girdisi, SQL komutunun metnine doğrudan eklendiğinde veri tabanı girdinin bir kısmını komut olarak yorumlar. Veri ile komut aynı string içinde karıştığı için olur."
    ipucu: "Komut ve veri aynı metinde karışırsa veri tabanı hangisini ayırt eder?"
  - id: appsec-003-s2
    soru: "Parametreli sorgu (prepared statement) neden güvenlidir?"
    cevap: "Sorgu şablonu ve değerler veri tabanına ayrı iletilir. Değer her zaman veri olarak ele alınır, içinde SQL sözdizimi olsa bile komut olarak çalışmaz."
    ipucu: "Şablon ile değerin veri tabanına ayrı gitmesinin sonucunu düşün."
  - id: appsec-003-s3
    soru: "Tablo adı ya da `ORDER BY` sütunu kullanıcıdan geliyorsa parametre kullanılabilir mi? Ne yaparsın?"
    cevap: "Hayır, parametreler yalnız değerler içindir; tablo ve sütun adları parametre olamaz. Kullanıcı seçimini uygulamanın tanımladığı sabit bir izin listesine eşlersin, listede olmayanı reddedersin."
    ipucu: "Parametre yalnız hangi tür parçalar için olur?"
  - id: appsec-003-s4
    soru: "Veri tabanı hesabına en az yetki vermek, SQL injection karşısında nasıl yardımcı olur?"
    cevap: "Açık oluşsa bile saldırgan yalnız uygulamanın hesabının izin verdiği işlemleri yapabilir. Salt okunur ya da yalnız gerekli tablolara erişimi olan bir hesap, hasarı sınırlar. Bu, ana savunmanın (parametreli sorgu) yerine geçmez, ek katmandır."
    ipucu: "Hasarı sınırlayan ek katman, savunmanın yerine geçer mi?"
  - id: appsec-003-s5
    soru: Gece nöbetinde WAF günlüğünde `id=1 UNION SELECT ad,parola FROM kullanici--` içeren yüzlerce istek görüyorsun. İlk ne yaparsın?
    cevap: Önce isteklerin başarılı olup olmadığına bakarsın (yanıt kodu, yanıt boyutu, veri tabanı günlüğü). Kaynak IP'yi engelleyip olayı güvenlik ekibine bildirirsin. Sonra ilgili uç noktanın kodunu bulup string birleştirmeyi parametreli sorguya çevirirsin; veri sızmış olabilirse olay müdahale sürecini başlatırsın.
    ipucu: Saldırı denemesi ile başarılı saldırı arasındaki farkı günlükten nasıl anlarsın?
derinDalis:
  - tur: okuma
    baslik: "OWASP SQL Injection Prevention Cheat Sheet"
    ayrinti: "Parametreli sorgu, izin listesi ve neden elle kaçırmanın (escaping) önerilmediği."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
hizliKontrol:
  - soru: Parametreli sorguda SQL şablonu ve kullanıcı değeri nasıl iletilir?
    secenekler:
      - Tek bir metin olarak birleştirilip
      - Değerin tırnakları silinerek
      - Büyük harfe çevrilerek
      - Ayrı ayrı; değer her zaman veri sayılır
    dogru: 3
    aciklama: Şablon ve değer ayrı gittiği için değer içindeki SQL sözdizimi komut olarak çalışmaz.
    ipucu: Güvenliği sağlayan şey, ayrılık ilkesidir.
  - soru: Sıralama sütunu kullanıcıdan geliyorsa en uygun önlem hangisi?
    secenekler:
      - Sütun adını parametre olarak bağlamak
      - Uygulamada tanımlı bir izin listesine eşlemek
      - Sütun adından boşlukları silmek
      - Sorguyu iki kez çalıştırmak
    dogru: 1
    aciklama: Parametreler yalnız değerler içindir; yapısal parçalar sabit bir listeden seçilir.
    ipucu: Parametre bağlama değerler içindir; yapıyı başka nasıl kısıtlarsın?
sikHatalar:
  - hata: Tırnak işaretlerini elle kaçırarak sorguyu 'güvenli' saymak.
    dogrusu: Elle kaçırma kırılgandır; parametreli sorgu kullan.
  - hata: ORM kullandığı için ham sorguda da güvende olduğunu sanmak.
    dogrusu: ORM'in ham sorgu fonksiyonuna string birleştirirsen açık geri gelir.
sema:
  baslik: Bir SQL injection girdisi nasıl yol alır?
  adimlar:
    - etiket: Girdi
      aciklama: Saldırgan form alanına `x' OR '1'='1` yazar.
    - etiket: Birleştirme
      aciklama: Uygulama girdiyi sorgu metnine doğrudan ekler.
    - etiket: Sorgu
      aciklama: Ortaya `WHERE ad = 'x' OR '1'='1'` çıkar.
    - etiket: Yorumlama
      aciklama: Veri tabanı girdinin bir kısmını komut olarak çalıştırır.
    - etiket: Sonuç
      aciklama: Koşul herkes için doğru olur ve tüm satırlar döner.
terimler:
  - SQL injection
  - Parametreli sorgu
  - ORM
---

SQL injection'ın kökeni, ders 2'deki ilkenin ihlalidir: güvenilmeyen girdi bir **komut diline** karışır. Aşağıdaki kod açıklıdır:

```python
sorgu = "SELECT ad FROM kullanici WHERE ad = '" + girdi + "'"
```

Kullanıcı `x' OR '1'='1` yazarsa sorgu şu hale gelir:

```sql
SELECT ad FROM kullanici WHERE ad = 'x' OR '1'='1'
```

`'1'='1'` her zaman doğrudur; sonuç, tüm kullanıcılardır. Gerçek saldırılar daha ileri gider: başka tabloları okumak, veriyi değiştirmek, bazı yapılandırmalarda sunucuda komut çalıştırmak.

### Doğru çözüm: parametreli sorgu

```python
db.execute("SELECT ad FROM kullanici WHERE ad = ?", (girdi,))
```

Burada sorgu **şablonu** ve **değer** veri tabanına ayrı iletilir. Değer içinde `'` ya da `OR` olsa da yalnız veri olarak aranır. Her dilin ve kütüphanenin karşılığı var: Python'da `?` ya da `%s` yer tutucuları, Java'da `PreparedStatement`, JavaScript'te sürücünün `$1` yer tutucuları.

### Sık yapılan yanlışlar

- **String birleştirme ya da f-string** ile sorgu kurmak. Kod incelemesinde en büyük kırmızı bayrak.
- **Elle kaçırma:** Tırnakları kendin değiştirmek kırılgandır; veri tabanı ve karakter kümesine göre atlatılabilir. OWASP bunu güçlü biçimde önermez.
- **"ORM kullanıyorum, güvendeyim":** ORM'ler çoğu zaman parametre kullanır, ama ham sorgu (raw query) ya da dinamik sorgu dili (HQL, JPQL) yazarken string birleştirirsen aynı açık geri gelir.
- **Sütun/tablo adı** için parametre kullanmaya çalışmak. Bunlar için izin listesi kullanılır.

### Ek katmanlar

1. **En az yetki:** Uygulamanın veri tabanı hesabı yalnız gereken tablolara ve işlemlere yetkili olsun; `DROP` ya da yönetici yetkisi olmasın.
2. **Hata mesajları:** Ham SQL hatasını kullanıcıya gösterme (ders 8).
3. **Tarama:** SAST araçları ve kod incelemesi string birleştirmeli sorguları yakalar (Pipeline bölgesi).

Bu ek katmanlar, parametreli sorgunun yerine geçmez; onunla birlikte çalışır.

Güvenlik notu: Bu dersteki deneme bellekte, kendi makinende çalışan bir veri tabanıdır. Başka bir sitenin giriş formuna `' OR '1'='1` yazmak, kendi sitenin dışında izinsiz erişim denemesidir ve yasal sorun doğurur.
