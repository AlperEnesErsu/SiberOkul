---
kimlik: linux-001
baslik: "Ubuntu'ya merhaba"
donem: 1
sira: 1
sure: 30
neden: "İnternetteki sunucuların büyük çoğunluğu Linux çalıştırır; CI/CD makineleri, Docker container'ları ve bulut sunucuları da öyle. Bir DevSecOps mühendisi günün önemli kısmını bir Linux terminalinde geçirir. Bugün o terminale ilk kez giriyoruz."
analoji:
  baslik: "Terminal, bir otelin resepsiyonu"
  metin: "Masaüstünde dosyalara tıklamak, otelde koridorlarda kendin dolaşıp kapıları denemek gibidir. Terminal ise resepsiyondur: ne istediğini cümleyle söylersin (komut), görevli işi yapar ve sonucu söyler (çıktı). Resepsiyonist her seferinde önce kim olduğunu ve hangi katta durduğunu hatırlatır; bu hatırlatma, istem satırıdır."
gorev:
  aciklama: "Windows'ta Başlat menüsüne `wsl` yaz ve Enter'a bas (ya da PowerShell'de `wsl` komutunu çalıştır). Ubuntu terminali açılınca sırayla şunları yaz:"
  komutlar:
    - whoami
    - hostname
    - pwd
    - ls
    - echo "Merhaba SiberOkul"
  soru: "`pwd` çıktısındaki yol ile istem satırındaki `~` işareti arasında nasıl bir ilişki var?"
  telefon:
    soru: "İstem satırı `ayse@lab:~$` ise `whoami` ve `pwd` komutları büyük ihtimalle ne yazar?"
    cevap: "`whoami` → `ayse`. `pwd` → `/home/ayse`, çünkü `~` kullanıcının ev dizini demek ve Ubuntu'da ev dizinleri `/home/<kullanıcı>` altındadır."
sorular:
  - id: linux-001-s1
    soru: "`kullanici@makine:~$` istem satırında `kullanici`, `makine`, `~` ve `$` ne anlatır?"
    cevap: "`kullanici` oturum açmış kullanıcının adı, `makine` bilgisayarın adı (hostname), `~` şu an bulunduğun dizin (ev dizinin), `$` ise sıradan bir kullanıcı olduğunu ve komut beklendiğini gösterir. Root kullanıcısında `$` yerine `#` görünür."
    ipucu: "Prompt'ta `@` işaretinin sağında ve solunda ne olduğunu düşün."
  - id: linux-001-s2
    soru: "`pwd` komutu ne yapar ve adı neyin kısaltmasıdır?"
    cevap: "Bulunduğun dizinin tam yolunu yazar. Adı 'print working directory', yani 'çalışma dizinini yazdır' demektir."
    ipucu: "`pwd` kısaltmasının açılımını ve ne döndürdüğünü hatırla."
  - id: linux-001-s3
    soru: "WSL nedir ve bu okulda neden onu kullanıyoruz?"
    cevap: "Windows Subsystem for Linux: Windows'un içinde gerçek bir Linux çekirdeği çalıştıran katman. Ayrı bir bilgisayar ya da ağır bir sanal makine kurmadan gerçek Ubuntu komutlarını çalıştırmamızı sağlar."
    ipucu: "WSL'in Windows ile ilişkisini ve neden sanal makine kadar ağır olmadığını düşün."
  - id: linux-001-s4
    soru: "Linux komutlarında büyük-küçük harf fark eder mi? `PWD` yazsan ne olur?"
    cevap: "Fark eder. Linux büyük-küçük harfe duyarlıdır; `PWD` diye bir komut yoktur, terminal 'command not found' (komut bulunamadı) der. Dosya adları için de aynı kural geçerlidir: `Notlar.txt` ile `notlar.txt` iki ayrı dosyadır."
    ipucu: "Linux ve Windows'ta büyük-küçük harfe bakış farkını hatırla."
  - id: linux-001-s5
    soru: "Bir arkadaşın WSL'de `Whoami` yazdı ve hata aldı, 'Linux bozuk' diyor. Ne söylersin?"
    cevap: "Linux büyük-küçük harfe duyarlıdır: komut `whoami` (hepsi küçük). `Whoami` diye bir program olmadığı için 'command not found' alır. Hata mesajını okumasını, yazımı düzeltmesini ve gerekirse `ls` ile adlara bakmasını önerirsin."
    ipucu: "Hata metninin tam olarak ne dediğine ve komut adındaki harflere bak."
hizliKontrol:
  - soru: "`ayse@lab:~$` isteminde `~` neyi gösterir?"
    secenekler: ["Root kullanıcısını","Ev dizinini","Makinenin adını","Boş bir dizini"]
    dogru: 1
    aciklama: "`~` kullanıcının ev dizininin kısaltmasıdır; `ayse` için `/home/ayse`."
    ipucu: "Ev dizininin kısa gösterimi hangisiydi?"
sikHatalar:
  - hata: "Komutları büyük harfle yazmak (`LS`, `PWD`)."
    dogrusu: "Linux büyük-küçük harfe duyarlıdır; komutlar çoğunlukla küçük harfle yazılır: `ls`, `pwd`."
  - hata: "İstem satırındaki `$` veya `~` işaretlerini de komutun parçası sanıp yazmak."
    dogrusu: "İstem satırı terminalin sana gösterdiği süstür; yalnız komutun kendisini yaz."
terimler:
  - "Terminal"
  - "Kabuk (shell)"
  - "WSL"
  - "Ev dizini"
derinDalis:
  - tur: kitap
    baslik: "The Linux Command Line (William Shotts)"
    ayrinti: "Bölüm 1 'What Is the Shell?'. Kitap yazarın sitesinde ücretsiz PDF olarak var."
    url: "https://linuxcommand.org/tlcl.php"
  - tur: okuma
    baslik: "Microsoft Learn: WSL temel komutları"
    ayrinti: "`wsl --list --verbose`, `wsl ~` gibi Windows tarafındaki komutlar."
    url: "https://learn.microsoft.com/en-us/windows/wsl/basic-commands"
---

**Kabuk** (shell), yazdığın komutu alıp işletim sistemine ileten programdır. Ubuntu'da varsayılan kabuk **bash**'tir. **Terminal** ise kabukla konuştuğun penceredir. Günlük dilde ikisi karıştırılır; şimdilik "terminal" demek yeterli.

Terminal açıldığında seni bir **istem satırı** (prompt) karşılar:

```
alper@makine:~$
```

Bu satır üç soruyu cevaplar: *Kimim?* (`alper`), *Hangi makinedeyim?* (`makine`), *Neredeyim?* (`~`). Sondaki `$`, kabuğun komut beklediğini söyler.

Bir komut genellikle bir kelimedir ve Enter'a basınca çalışır. Bugünkü dört komut:

- `whoami`: "Ben kimim?" Oturumdaki kullanıcının adını yazar.
- `hostname`: Makinenin adını yazar.
- `pwd`: Şu an hangi dizinde (klasörde) olduğunu tam yol olarak yazar, ör. `/home/alper`.
- `ls`: Bulunduğun dizindeki dosya ve dizinleri listeler. Yeni bir Ubuntu'da ev dizinin boş olabilir; çıktı vermemesi normal.

`~` işareti senin **ev dizinin** için kısaltmadır. Her kullanıcının kendi ev dizini vardır ve terminal seni oraya açar.

Linux'ta Windows'taki `C:\` yerine her şey tek bir kökten, `/` dizininden başlar. Yarın bu ağaçta gezinmeyi öğreneceğiz.
