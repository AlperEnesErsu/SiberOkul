---
kimlik: linux-003
baslik: "Dosya ve dizin işlemleri"
donem: 1
sira: 3
sure: 30
neden: "Bir DevSecOps mühendisi sunucuda yapılandırma dosyalarını yedekler, log dizinlerini düzenler, eski dosyaları temizler. Bir yanlış `rm` ya da yanlış yere `mv`, canlı bir sistemi bozabilir. Bu dersin komutları günlük işin en sık kullanılan araçlarıdır."
analoji:
  baslik: "Ofis arşivi"
  metin: "Dizin bir klasör, dosya içindeki kâğıttır. `mkdir` yeni klasör açar, `touch` boş bir kâğıt koyar, `cp` fotokopi çeker, `mv` kâğıdı başka klasöre taşır ya da üstündeki adı değiştirir. `rm` ise kâğıdı çöpe değil doğrudan kâğıt öğütücüye atar: geri dönüşüm kutusu yoktur. Benzetmenin sınırı: gerçek ofiste öğütücüye atmadan önce el yordamıyla bakarsın, terminal ise sormadan siler."
gorev:
  aciklama: "Ubuntu terminalinde `/tmp` altında bir çalışma alanı kurup içinde dolaşacaksın. Her komuttan sonra `ls` ile sonucu kontrol et. `rm -r` yalnızca bu derste oluşturduğun dizinde kullanılacak."
  komutlar:
    - mkdir -p /tmp/lab003/notlar/2026
    - cd /tmp/lab003
    - touch a.txt b.txt c.log
    - ls
    - cp a.txt notlar/a-yedek.txt
    - mv b.txt notlar/
    - mv c.log eski.log
    - ls *.txt
    - ls notlar
    - rm -i a.txt
    - cd /tmp
    - rm -r /tmp/lab003
  soru: "`mv c.log eski.log` komutu dosyayı başka dizine taşımadığı halde neden 'taşıma' komutuyla yapılıyor? Bu işlem için ayrı bir 'yeniden adlandır' komutu olmaması neyi gösterir?"
  telefon:
    soru: "Bir dizinde `rapor1.txt`, `rapor2.txt`, `rapor10.txt` ve `rapor.log` var. `ls rapor?.txt` hangilerini listeler?"
    cevap: "Yalnız `rapor1.txt` ve `rapor2.txt`. `?` tam olarak bir karakterin yerini tutar; `rapor10.txt`de iki karakter (`10`) olduğu için eşleşmez, `rapor.log` de uzantı farklı olduğu için eşleşmez."
sorular:
  - id: linux-003-s1
    soru: "`mkdir -p a/b/c` komutunda `-p` ne işe yarar?"
    cevap: "Eksik üst dizinleri de oluşturur. `-p` olmadan `a` yoksa komut hata verir. `-p` ile `a`, `a/b` ve `a/b/c` birlikte yaratılır ve dizin zaten varsa da hata vermez."
  - id: linux-003-s2
    soru: "`rm` ile silinen dosya neden Windows'taki gibi geri dönüşüm kutusundan kurtarılamaz?"
    cevap: "`rm` dosyayı doğrudan dosya sisteminden kaldırır; çöp kutusu diye bir ara basamak yoktur. Bu yüzden silmeden önce yolu kontrol etmek, gerekirse `rm -i` ile onay istemek önemlidir."
  - id: linux-003-s3
    soru: "`*.txt` yazdığında joker karakteri kim açar: `ls` komutu mu, kabuk mu? Bunun pratik sonucu ne?"
    cevap: "Kabuk açar. `ls`, `*.txt` yerine kabuğun bulduğu dosya adlarının listesini alır. Sonuç: eşleşen dosya yoksa komut beklenmedik bir argümanla çalışabilir, `rm *` yazarsan o dizindeki her şeyi silersin. Komutu çalıştırmadan önce aynı joker karakterle `ls` deneyerek ne eşleştiğine bak."
  - id: linux-003-s4
    soru: "`cp notlar yedek` komutu bir dizin için hata verir. Dizini kopyalamak için ne gerekir?"
    cevap: "`-r` (recursive, özyinelemeli) seçeneği: `cp -r notlar yedek`. Bu seçenek dizinin içindeki her şeyi kopyalar. `-r` olmadan `cp` dizinleri atlar ve uyarı verir."
derinDalis:
  - tur: kitap
    baslik: "The Linux Command Line (William Shotts)"
    ayrinti: "Dosya ve dizin işlemleri ile joker karakterler (wildcards) konusunu işleyen bölüm."
    url: "https://linuxcommand.org/tlcl.php"
---

Önceki derste dizin ağacında gezinmeyi öğrendin. Şimdi o ağaçta bir şeyler **oluşturmayı, kopyalamayı, taşımayı ve silmeyi** öğreniyoruz.

### Beş temel komut

| Komut | Ne yapar | Örnek |
|---|---|---|
| `touch` | Boş dosya yaratır (varsa zaman damgasını günceller) | `touch not.txt` |
| `mkdir` | Dizin yaratır | `mkdir proje` |
| `cp` | Kopyalar | `cp not.txt yedek.txt` |
| `mv` | Taşır ya da yeniden adlandırır | `mv not.txt arsiv/` |
| `rm` | Siler | `rm yedek.txt` |

`mkdir -p` iç içe dizinleri tek seferde açar: `mkdir -p proje/src/test`. Dizin zaten varsa şikayet etmez; betiklerde bu çok işe yarar.

Dizinler için `cp` ve `rm` komutlarına **`-r`** (recursive: içindekilerle birlikte) eklemen gerekir: `cp -r proje proje-yedek`, `rm -r eski-proje`.

`mv` iki iş yapar: hedef bir dizinse dosyayı oraya taşır, hedef yeni bir addır ve aynı dizindeysen dosyayı yeniden adlandırır. Ayrı bir "rename" komutu yoktur, çünkü Linux'ta yeniden adlandırmak, dosyanın dizindeki kaydını değiştirmektir.

### Joker karakterler (globbing)

Birçok dosyayı tek seferde seçmek için:

- `*` her şey, sıfır ya da daha fazla karakter: `*.log`
- `?` tam bir karakter: `rapor?.txt`
- `[abc]` köşeli parantez içindeki karakterlerden biri: `dosya[12].txt`

Bunları komut değil **kabuk** açar: `ls *.txt` yazınca kabuk önce `a.txt b.txt` gibi gerçek adları bulur, sonra komuta bunları verir. Bu yüzden `rm *` bulunduğun dizindeki her şeyi siler.

### Silmeden önce iki alışkanlık

1. Silmeden önce aynı joker karakterle `ls` çalıştır, neyin eşleştiğini gör.
2. Şüpheli durumda `rm -i` kullan; her dosya için onay ister.

Güvenlik notu: `rm -r` ile yanlış dizini silmek, olay sonrası kanıt dosyalarını ya da bir servisin ayarlarını yok edebilir. Üretim sunucusunda silme komutunu yazarken yolun önüne `ls` koyup önce sonucu gör, sonra `ls`'i `rm`'ye çevir. Özellikle `rm -r` ile kök (`/`) ya da ev dizini (`~`) gibi yollar yazmak çok pahalı hatalardır.
