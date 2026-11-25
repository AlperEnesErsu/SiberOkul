---
kimlik: linux-007
baslik: "sudo ve en az yetki"
donem: 1
sira: 7
sure: 30
neden: "Root yetkisiyle yapılan her hata ve her saldırı sistemin tamamını etkiler. Bu yüzden modern sistemlerde yönetici işleri tek tek, kayıt altına alınarak yapılır. `sudo` kural dosyalarını yazmak, CI sunucularında ve container'larda yetkiyi daraltmak işinin parçasıdır."
analoji:
  baslik: "Bankada kasa dairesi"
  metin: "Root kasa dairesinin ana anahtarıdır; onu her gün cebinde gezdiren biri, kaybederse bankanın tamamını riske atar. `sudo` ise her seferinde görevliye imza atıp tek bir işlem için kasaya girmendir: kim, ne zaman, ne yaptı kayıtlıdır. Sınır: imza yalnızca kayıt tutar; kasaya girmeye yetkili biri kötü niyetliyse kayıt onu tek başına durdurmaz."
gorev:
  aciklama: "Aşağıdaki komutlar zararsızdır; ilk parola istemine kendi Ubuntu parolanı yaz (yazarken ekranda görünmez). Parolan yoksa ya da `sudo` çalışmıyorsa bunu not al ve telefon sorusunu çöz."
  komutlar:
    - id
    - cat /etc/shadow
    - sudo whoami
    - sudo wc -l /etc/shadow
    - sudo -l
    - ls -l /etc/sudoers
    - sudo -k
  soru: "`cat /etc/shadow` neden hata verdi ama `sudo wc -l /etc/shadow` çalıştı? `sudo whoami` çıktısı neden senin adın değil?"
  telefon:
    soru: "Bir meslektaşın 'servis hesabımız `sudo ALL=(ALL) NOPASSWD:ALL` ile çalışsın, uğraşmayalım' dedi. Neden riskli, ne önerirsin?"
    cevap: "Hesap parolasız ve her komutu root olarak çalıştırabilir; hesap ele geçirilirse saldırgan bütün sistemi alır. Öneri: yalnız gereken tek komuta izin ver (örneğin belirli bir `systemctl restart ...` komutu) ve `/etc/sudoers.d/` altında `visudo` ile kural yaz."
sorular:
  - id: linux-007-s1
    soru: "Ubuntu'da root hesabı neden varsayılan olarak doğrudan oturum açmaya kapalıdır?"
    cevap: "Tek bir paylaşılan, sınırsız yetkili hesap hem kimin ne yaptığını belirsizleştirir hem de parolası ele geçirilirse tam yetki verir. Ubuntu bunun yerine sıradan kullanıcının `sudo` ile tek tek komutu yükseltmesini ve bunun kayıt altına alınmasını tercih eder."
  - id: linux-007-s2
    soru: "`sudo` kimin hangi komutu çalıştırabileceğini nereden öğrenir ve bu dosya neden `nano` ile düzenlenmez?"
    cevap: "`/etc/sudoers` ve `/etc/sudoers.d/` altındaki dosyalardan. Bunlar `visudo` ile düzenlenir, çünkü `visudo` kaydetmeden önce sözdizimini denetler. Hatalı bir sudoers dosyası herkesi `sudo` dışında bırakıp sistemi yönetilemez hale getirebilir."
  - id: linux-007-s3
    soru: "`sudo -i` ya da `sudo su` ile kalıcı bir root kabuğu açmak yerine her komuta ayrı `sudo` yazmak neden daha iyidir?"
    cevap: "Root kabuğunda her komut yetkili çalışır; bir yazım hatası ya da yanlış yapıştırma felakete dönüşebilir ve ne yapıldığı kayıtta ayrıntılı görünmez. Komut başına `sudo` yalnız o komutu yükseltir, her kullanım loga yazılır ve dikkatini yüksek yetkinin gerektiği yere toplar."
  - id: linux-007-s4
    soru: "'En az yetki' (least privilege) ilkesi nedir? Bir örnekle açıkla."
    cevap: "Bir kullanıcıya ya da sürece işini yapmak için gereken en küçük yetkiyi vermek. Örnek: bir yedekleme betiği yalnız yedek dizinini okuyabilsin, root olmasın. Saldırgan o hesabı ele geçirse bile erişebileceği alan dardır."
derinDalis:
  - tur: okuma
    baslik: "Ubuntu Server: kullanıcı yönetimi"
    ayrinti: "Root hesabının neden kapalı olduğu ve `sudo` kullanımı."
    url: "https://ubuntu.com/server/docs/how-to/security/user-management/"
  - tur: okuma
    baslik: "Sudoers kılavuzu"
    ayrinti: "`sudoers` dosyasının kural sözdizimi; ilk bölümleri okumak yeterli."
    url: "https://www.sudo.ws/docs/man/sudoers.man/"
---

Önceki iki derste hesapları ve dosya izinlerini öğrendin. Bu ders, bu bilgilerin en kritik uygulamasını anlatır: **yönetici yetkisi**.

### Root nedir?

**root**, UID'si 0 olan kullanıcıdır. Dosya izinleri onu durdurmaz: her dosyayı okur, her süreci öldürür, her ayarı değiştirir. Bu güç, hatanın da bedelini büyütür. Root olarak yazılan bir `rm -r` komutu sistemi çalışmaz hale getirebilir.

### sudo ne yapar?

`sudo` (superuser do), **tek bir komutu** başka bir kullanıcının, genellikle root'un yetkisiyle çalıştırır. Kendi parolanı sorar, root parolasını değil. Birkaç dakika boyunca tekrar sormaz.

```
$ cat /etc/shadow
cat: /etc/shadow: Permission denied
$ sudo wc -l /etc/shadow
```

İlk komut yetkisiz olduğu için reddedilir. İkincisi root yetkisiyle çalışır.

Ubuntu varsayılan olarak root hesabını doğrudan oturum açmaya kapalı tutar ve yönetici işlerini `sudo` ile yaptırır. Bunun iki faydası var: **hesap verebilirlik** (kim ne yaptı kayıtlıdır) ve **sınırlama** (kimin ne çalıştırabileceği ayrı ayrı belirlenebilir).

### Kuralları kim yazar?

`/etc/sudoers` dosyası ve `/etc/sudoers.d/` dizini. Ubuntu'da `sudo` grubundaki herkes her komutu çalıştırabilir. Bir satırın okunuşu:

```
ayse  ALL=(ALL:ALL)  /usr/bin/systemctl restart nginx
```

"`ayse` kullanıcısı, herhangi bir makinede, herhangi bir kullanıcı olarak yalnızca bu komutu çalıştırabilir." Bu **en az yetki ilkesidir**: işe yetecek kadar yetki, fazlası değil.

Sudoers dosyası yalnız `visudo` ile düzenlenir. Çünkü `visudo` kaydetmeden önce sözdizimini kontrol eder; bozuk bir dosya `sudo`'yu çalışmaz hale getirir.

### Alışkanlıklar

- Yalnızca gerektiğinde `sudo` kullan. `sudo` ile her şeyi çalıştırmak, hatanı da root yapar.
- Kalıcı root kabuğundan (`sudo -i`, `sudo su`) kaçın.
- İnternetten kopyaladığın bir komutta `sudo` görürsen, ne yaptığını anlamadan çalıştırma.
- `NOPASSWD:ALL` gibi kuralları üretim sistemlerinde yazma.

### Container bağlantısı

Aynı fikir ileride container güvenliğinde de karşına çıkacak: process root olarak çalışmamalıdır. Yetkiyi daraltmak, DevSecOps'un temel alışkanlığıdır.

Güvenlik notu: Bir sunucuda `/etc/sudoers.d/` altında tanımadığın bir dosya bulursan bu, kalıcı yetki yükseltme bırakıldığının işareti olabilir. Kuralları arada bir okumak iyi bir denetim alışkanlığıdır.
