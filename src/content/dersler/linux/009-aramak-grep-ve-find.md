---
kimlik: linux-009
baslik: "Aramak: grep ve find"
donem: 1
sira: 9
sure: 35
neden: "Sızıntı arayan bir mühendis 'bu parola hangi dosyada?' ve 'son bir günde hangi dosyalar değişti?' sorularını sorar. `grep` içeriği, `find` dosyaların kendisini arar. İkisi birlikte olay incelemede ve yapılandırma denetiminde en sık kullanılan araçlardır."
analoji:
  baslik: "Kütüphane: katalog ve raf taraması"
  metin: "`find` kütüphane kataloğudur: yazarına, türüne, tarihine göre hangi kitabın nerede olduğunu söyler. `grep` ise kitabı açıp içinde bir cümle aramaktır. Katalogdan kitabı bulup içinde cümle ararsan iki araç birleşir. Sınır: katalog yalnızca kayıtlı bilgiyi tutar; `find` ise her seferinde rafları gerçekten dolaşır, büyük dizinlerde yavaş olabilir."
gorev:
  aciklama: "`/tmp` altında küçük bir deneme alanı kurup `grep` ve `find` ile arama yapacaksın. Son iki komut sisteme zarar vermez, yalnızca okur."
  komutlar:
    - mkdir -p /tmp/lab009/ayar
    - cd /tmp/lab009
    - echo "kullanici=ayse" > ayar/uygulama.conf
    - echo "parola=Deneme123" >> ayar/uygulama.conf
    - echo "bilgi satiri" > ayar/not.txt
    - grep -rin "parola" .
    - find . -type f -name "*.conf"
    - find /etc -maxdepth 1 -type f -name "*.conf" 2> /dev/null | head -n 5
    - find /usr/bin -perm -4000 -type f 2> /dev/null
    - cd /tmp
    - rm -r /tmp/lab009
  soru: "`grep -rin \"parola\" .` komutunda `-r`, `-i` ve `-n` ne işe yarıyor? Çıktıdaki satır numarası neden faydalı?"
  telefon:
    soru: "`find /usr/bin -perm -4000 -type f` ile listelenen dosyalar için ne söylenebilir? Neden güvenlik denetimlerinde bu liste incelenir?"
    cevap: "`-perm -4000` setuid bitli dosyaları bulur: bu programlar, çalıştıranın değil dosya sahibinin (çoğunlukla root) yetkisiyle çalışır. Yanlış ya da zafiyetli bir setuid programı yetki yükseltmeye yol açabileceği için listenin beklenmedik bir üyeyi içerip içermediğine bakılır."
sorular:
  - id: linux-009-s1
    soru: "`grep -rin \"parola\" /etc/uygulama` komutundaki üç seçeneği açıkla."
    cevap: "`-r` dizinin içini özyinelemeli (alt dizinler dahil) arar, `-i` büyük-küçük harf farkını yok sayar, `-n` eşleşen satırın numarasını yazar. Birlikte, bir kelimenin hangi dosyanın hangi satırında geçtiğini bulur."
    ipucu: "Üç seçeneğin ayrı ayrı ne yaptığını düşün."
  - id: linux-009-s2
    soru: "`find . -name \"*.log\"` komutunda tırnak neden önemlidir?"
    cevap: "Tırnak yoksa kabuk `*.log` ifadesini bulunduğun dizindeki dosya adlarına çevirir ve `find`a yanlış argüman gider. Tırnak içinde kalan desen `find`a olduğu gibi ulaşır ve `find` alt dizinlerde arama yapar."
    ipucu: "Desen tırnaksız yazılırsa kabuk ne yapar?"
  - id: linux-009-s3
    soru: "`grep`'in çıktısını `wc -l`'e bağlarsan ne öğrenirsin? Bunu `grep -c` ile karşılaştır."
    cevap: "Eşleşen satır sayısını öğrenirsin: `grep \"hata\" log | wc -l`. `grep -c \"hata\" log` aynı sayıyı doğrudan verir. Boru birden çok dosyanın toplamı gibi daha esnek işlemler için kullanışlıdır."
    ipucu: "`wc -l` neyi sayar?"
  - id: linux-009-s4
    soru: "Son 24 saatte değişen, boyutu 1 MB'tan büyük dosyaları bulmak için `find`'ı nasıl kurarsın?"
    cevap: "`find /yol -type f -mtime -1 -size +1M`. `-mtime -1` son 1 gün içinde değişmiş, `-size +1M` 1 MB'tan büyük demektir. Ölçütler `ve` ile birleşir; hepsi sağlanan dosya listelenir."
    ipucu: "`-mtime` ve `-size` işaretlerine dikkat et."
  - id: linux-009-s5
    soru: "Web dizininde şüpheli bir `.php` dosyası olduğundan şüpheleniyorsun. Son 2 günde değişenleri nasıl bulursun?"
    cevap: "`find /var/www -type f -name \"*.php\" -mtime -2` ile son 2 günde değişen PHP dosyalarını listelersin. Sonra içeriğinde `eval` gibi şüpheli ifadeleri `grep -rn` ile ararsın. Bulduğunu silmeden önce kaydını alırsın."
    ipucu: "`-2` hangi zaman aralığını verir?"
hizliKontrol:
  - soru: "`find . -name \"*.log\"` komutunda tırnak ne sağlar?"
    secenekler: ["Kabuğun deseni açmasını önler, desen `find`'a gider","Dosyaları gizler","Aramayı hızlandırır","Yalnız büyük harfle arar"]
    dogru: 0
    aciklama: "Tırnaksız desen kabuk tarafından açılır; tırnakla `find` deseni kendisi yorumlar."
    ipucu: "Joker karakteri kim açardı?"
sikHatalar:
  - hata: "`find -name *.log` yazıp tırnağı unutmak."
    dogrusu: "Deseni tırnağa al: `find -name \"*.log\"`."
  - hata: "`grep`'te `-i` olmadan büyük harfle yazılmış sonucu kaçırmak."
    dogrusu: "Harf farkı önemli değilse `-i` ekle."
terimler:
  - "grep"
  - "Joker karakter"
  - "Setuid"
  - "Dosya izni"
derinDalis:
  - tur: kitap
    baslik: "The Linux Command Line (William Shotts)"
    ayrinti: "Searching for Files bölümü (`locate`, `find`) ve `grep` ile metin arama."
    url: "https://linuxcommand.org/tlcl.php"
  - tur: lab
    baslik: "OverTheWire: Bandit"
    ayrinti: "İlk seviyeler `find`, `grep` ve dosya izinlerini gerçekçi bir oyunla pekiştirir. SSH gerektirdiği için ağ bölgesindeki ders 010'dan sonra başlamak daha rahat."
    url: "https://overthewire.org/wargames/bandit/"
---

Ağaçta gezmeyi biliyorsun. Şimdi o ağacın içinde **bir şeyi bulmayı** öğreniyoruz. İki ayrı soru, iki ayrı araç:

- **İçinde ne yazıyor?** → `grep`
- **Dosya nerede, hangi özelliklerde?** → `find`

### grep: içerikte arama

```
grep "hata" uygulama.log           # "hata" geçen satırları yaz
grep -i "hata" uygulama.log        # büyük/küçük harf fark etmesin
grep -n "hata" uygulama.log        # satır numarasını da göster
grep -v "debug" uygulama.log       # "debug" GEÇMEYEN satırlar
grep -c "hata" uygulama.log        # kaç satır eşleşti
grep -r "parola" /etc/uygulama     # dizinin tamamında ara
grep -rin "parola" .               # üçü birlikte
```

`grep` ilk argümanı **desen** (pattern) olarak alır. Boşluk ya da özel karakter varsa tırnak içine al. Düzenli ifadeler (regex) ileride ayrıca konu olacak; şimdilik düz kelime yeterli.

### find: dosyaları ölçütle bulmak

`find nereden ölçütler` biçiminde yazılır:

```
find . -name "*.conf"              # adı .conf ile biten
find /var/log -type f              # yalnız dosyalar (d = dizin)
find . -type d -name "test*"       # adı test ile başlayan dizinler
find /tmp -mtime -1                # son 1 günde değişenler
find . -size +10M                  # 10 MB'tan büyükler
find /usr/bin -perm -4000          # setuid bitli dosyalar
```

Ölçütler yan yana yazılınca hepsi birden sağlanmalıdır. `-name` desenini daima **tırnak içine** yaz; yoksa kabuk deseni sen daha `find`'a vermeden açar.

`/etc` gibi dizinlerde yetkin olmayan klasörler yüzünden "Permission denied" mesajları çıkar. `2> /dev/null` bunları susturur (008. ders).

### İkisini birlikte kullanmak

```
find /etc -name "*.conf" 2> /dev/null | head
grep -rl "parola" /etc 2> /dev/null
```

`grep -l` yalnız eşleşen dosyaların adlarını yazar. Olay incelemede "şu IP bu sistemde hangi dosyalarda geçiyor?" sorusu tam böyle sorulur.

### Güvenlik denetimlerinde

- **Setuid dosyalar** (`-perm -4000`): root yetkisiyle çalışan programlar; listenin beklenmedik bir üyesi alarm sebebidir.
- **Herkesin yazabildiği dosyalar** (`-perm -o+w`): yanlış izin göstergesi.
- **Yakın zamanda değişenler** (`-mtime -1`): saldırıdan sonra neyin değiştiğini bulmaya yarar.

Güvenlik notu: `grep -r "parola"` gibi aramalar, bulduğun gizli bilgileri terminalde ve kabuk geçmişinde bırakır. Gerçek bir sistemde sonuçları ekran görüntüsü ya da sohbet yoluyla paylaşma; bulunan sırrı değiştir.
