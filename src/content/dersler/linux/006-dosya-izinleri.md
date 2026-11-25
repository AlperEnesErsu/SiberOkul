---
kimlik: linux-006
baslik: "Dosya izinleri"
donem: 1
sira: 6
sure: 35
neden: "Yanlış dosya izni, sunucu sızıntılarının en sık nedenlerinden biridir: herkesin okuyabildiği bir SSH özel anahtarı ya da herkesin yazabildiği bir betik. DevSecOps mühendisi izinleri okuyabilmeli, doğru ayarlayabilmeli ve yanlış olanı fark edebilmelidir."
analoji:
  baslik: "Ev anahtarları"
  metin: "Bir evin üç tür kapısı olduğunu düşün: oturma odası (okuma), kilitli çalışma masası (yazma) ve garaj kapısı (çalıştırma). Ev sahibi hepsinin anahtarını taşır, aile bireylerinin (grup) bir kısmı vardır, misafirlerin (diğerleri) çoğu yoktur. Sınır: gerçek evde anahtar fiziksel bir şeydir; Linux'ta izin dosyanın üzerindeki bir etikettir ve onu etiketi yazmaya yetkili biri değiştirebilir."
gorev:
  aciklama: "`/tmp` altında bir deneme dosyası oluşturup izinlerini adım adım değiştireceksin. Her `chmod` sonrası `ls -l` ile sonucu oku."
  komutlar:
    - mkdir -p /tmp/lab006
    - cd /tmp/lab006
    - touch betik.sh gizli.txt
    - ls -l
    - chmod u+x betik.sh
    - ls -l betik.sh
    - chmod 600 gizli.txt
    - ls -l gizli.txt
    - chmod g+w,o-r gizli.txt
    - ls -l gizli.txt
    - chown "$USER" gizli.txt
    - cd /tmp
    - rm -r /tmp/lab006
  soru: "`chmod 600 gizli.txt` sonrası `ls -l` çıktısında izin bölümü nasıl görünür? Her üç rakam hangi kullanıcı sınıfına ait?"
  telefon:
    soru: "`ls -l` çıktısında `-rwxr-x---` gördün. Bu dosyanın sayısal (octal) izni nedir ve diğer kullanıcılar ne yapabilir?"
    cevap: "`750`. Sahip rwx (4+2+1=7), grup r-x (4+1=5), diğerleri hiçbir şey (0). Diğer kullanıcılar dosyayı okuyamaz, yazamaz, çalıştıramaz."
sorular:
  - id: linux-006-s1
    soru: "`-rw-r--r--` ne anlama gelir? Parçalarına ayır."
    cevap: "İlk karakter `-` normal dosya demektir (dizin için `d`). Sonraki üç harf sahibin izni: `rw-` okur ve yazar. Sonraki üçü grubunki: `r--` yalnız okur. Son üçü diğer herkesinki: `r--` yalnız okur. Sayısal karşılığı `644`."
    ipucu: "Üçlü grupları sırayla oku: sahip, grup, diğerleri."
  - id: linux-006-s2
    soru: "`chmod 755 betik.sh` ile `chmod u+x betik.sh` arasındaki fark nedir?"
    cevap: "Sayısal biçim izinleri tamamen ayarlar (sahibe rwx, gruba r-x, diğerlerine r-x). Sembolik `u+x` yalnız sahibe çalıştırma iznini ekler, geri kalanı olduğu gibi bırakır."
    ipucu: "Sayısal ve sembolik biçimin neyi değiştirdiğine bak."
  - id: linux-006-s3
    soru: "Bir SSH özel anahtar dosyasının izni `644` olsun. Bu neden sorun ve düzeltmek için ne yapılır?"
    cevap: "`644` grup ve diğer kullanıcılara okuma izni verir, yani sunucudaki herkes özel anahtarı okuyabilir. Anahtar bu durumda sızmış sayılır; `ssh` de bu izinleri görünce anahtarı kullanmayı reddeder. Düzeltmek için `chmod 600` uygulanır."
    ipucu: "Anahtar dosyasını kimlerin okuyabildiğine bak."
  - id: linux-006-s4
    soru: "Bir dizin için `x` (çalıştırma) izni ne anlama gelir?"
    cevap: "Dizinin içine girebilmeyi (`cd`) ve içindeki dosyalara adıyla erişebilmeyi sağlar. `r` yalnızca içeriği listelemeye, `w` ise içinde dosya oluşturmaya ve silmeye izin verir. Dizinde `x` yoksa içindeki dosyaların kendi izinleri açık olsa bile ulaşamazsın."
    ipucu: "Dizin için `x` neyi mümkün kılar?"
  - id: linux-006-s5
    soru: "CI'da betik 'Permission denied' veriyor. `ls -l betik.sh` çıktısı `-rw-r--r--`. Ne yaparsın?"
    cevap: "Dosyada çalıştırma biti yok. Sahibine ekleyen `chmod u+x betik.sh` yeterlidir; gerekirse depoda da bu izinle commit'lenir. `chmod 777` vermezsin; fazladan yetki güvenlik açığıdır."
    ipucu: "Çıktıdaki hangi harf eksik?"
hizliKontrol:
  - soru: "`chmod 640 dosya` sonrası grup ne yapabilir?"
    secenekler: ["Yalnız okuyabilir","Okuyup yazabilir","Çalıştırabilir","Hiçbir şey yapamaz"]
    dogru: 0
    aciklama: "6 = rw- sahibe, 4 = r-- gruba, 0 = diğerlerine; grup yalnız okur."
    ipucu: "Ortadaki rakamın bitlerini aç."
  - soru: "Hangisi özel SSH anahtarı için uygundur?"
    secenekler: ["`644`","`666`","`600`","`755`"]
    dogru: 2
    aciklama: "Özel anahtarı yalnız sahibi okumalıdır."
    ipucu: "Yalnız sahibine ne vermelisin?"
sikHatalar:
  - hata: "Her 'izin yok' hatasında `chmod 777` yazmak."
    dogrusu: "Önce kimin hangi izne ihtiyacı olduğunu bul, yalnız onu ver."
  - hata: "Dizinlere `x` vermeden içine girilebileceğini sanmak."
    dogrusu: "Dizinde `x`, içine girme ve dosyalara erişme izni demektir."
terimler:
  - "Dosya izni"
  - "chmod"
  - "UID"
  - "En az yetki"
derinDalis:
  - tur: okuma
    baslik: "man7.org: chmod kılavuz sayfası"
    ayrinti: "Sayısal ve sembolik modların resmi açıklaması."
    url: "https://man7.org/linux/man-pages/man1/chmod.1.html"
  - tur: kitap
    baslik: "The Linux Command Line (William Shotts)"
    ayrinti: "Permissions bölümü: `chmod`, `umask` ve `chown`."
    url: "https://linuxcommand.org/tlcl.php"
---

`ls -l` çıktısının ilk sütunu izinleri gösterir:

```
-rwxr-x--- 1 alper alper 120 Nov 25 10:00 betik.sh
```

### Dört parça

`-rwxr-x---` on karakterdir:

| Konum | Anlamı |
|---|---|
| 1. karakter | Tür: `-` dosya, `d` dizin, `l` sembolik bağ |
| 2-4 | **Sahibin** (user, `u`) izinleri |
| 5-7 | **Grubun** (group, `g`) izinleri |
| 8-10 | **Diğerlerinin** (others, `o`) izinleri |

Her üçlü `r` (okuma), `w` (yazma), `x` (çalıştırma) harflerinden oluşur; yetki yoksa `-` yazar. Satırın devamında dosyanın sahibi (`alper`) ve grubu (`alper`) yer alır.

### Dosya mı, dizin mi?

- Dosyada `r` içeriği okur, `w` değiştirir, `x` programı çalıştırır.
- Dizinde `r` içindekileri listeler, `w` içinde dosya oluşturur/siler, `x` dizine girmeyi sağlar.

### chmod: izni değiştirmek

**Sembolik biçim**: kime, ne yapılacak, hangi izin.

```
chmod u+x betik.sh      # sahibe çalıştırma ekle
chmod g-w dosya         # gruptan yazmayı al
chmod o= dosya          # diğerlerinin tüm iznini kaldır
```

`u` sahip, `g` grup, `o` diğerleri, `a` herkes. `+` ekler, `-` kaldırır, `=` tam olarak o değere ayarlar.

**Sayısal biçim**: `r=4`, `w=2`, `x=1`; toplanır. Üç rakam sırayla sahip, grup, diğerleri içindir.

| Sayı | İzin | Tipik kullanım |
|---|---|---|
| `600` | `rw-------` | Özel anahtar, gizli dosya |
| `644` | `rw-r--r--` | Normal dosya |
| `755` | `rwxr-xr-x` | Çalıştırılabilir betik, dizin |
| `700` | `rwx------` | Yalnız sana ait dizin |

### chown: sahibi değiştirmek

`chown kullanici:grup dosya` sahibi ve grubu değiştirir. Başka birine vermek için root yetkisi (`sudo`) gerekir; sudo'yu bir sonraki ders ile birlikte 007'de göreceksin. Ders görevinde kendi adına yapılan `chown` zararsızdır.

### Güvenlik notu

"Çalışmıyor, `chmod 777` yapayım" refleksinden kaçın. `777` herkese her yetkiyi verir; başka kullanıcılar (ya da ele geçirilmiş bir servis) dosyayı değiştirebilir. Doğru yaklaşım, hatanın neden olduğunu bulup yalnızca gereken izni vermektir. Bu dersin kuralı: **gerekenden fazlasını verme**.
