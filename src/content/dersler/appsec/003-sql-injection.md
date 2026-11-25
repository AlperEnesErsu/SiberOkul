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
  - id: appsec-003-s2
    soru: "Parametreli sorgu (prepared statement) neden güvenlidir?"
    cevap: "Sorgu şablonu ve değerler veri tabanına ayrı iletilir. Değer her zaman veri olarak ele alınır, içinde SQL sözdizimi olsa bile komut olarak çalışmaz."
  - id: appsec-003-s3
    soru: "Tablo adı ya da `ORDER BY` sütunu kullanıcıdan geliyorsa parametre kullanılabilir mi? Ne yaparsın?"
    cevap: "Hayır, parametreler yalnız değerler içindir; tablo ve sütun adları parametre olamaz. Kullanıcı seçimini uygulamanın tanımladığı sabit bir izin listesine eşlersin, listede olmayanı reddedersin."
  - id: appsec-003-s4
    soru: "Veri tabanı hesabına en az yetki vermek, SQL injection karşısında nasıl yardımcı olur?"
    cevap: "Açık oluşsa bile saldırgan yalnız uygulamanın hesabının izin verdiği işlemleri yapabilir. Salt okunur ya da yalnız gerekli tablolara erişimi olan bir hesap, hasarı sınırlar. Bu, ana savunmanın (parametreli sorgu) yerine geçmez, ek katmandır."
derinDalis:
  - tur: okuma
    baslik: "OWASP SQL Injection Prevention Cheat Sheet"
    ayrinti: "Parametreli sorgu, izin listesi ve neden elle kaçırmanın (escaping) önerilmediği."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
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
