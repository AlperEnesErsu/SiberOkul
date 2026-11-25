---
kimlik: linux-004
baslik: "Metin okumak ve yardım almak"
donem: 1
sira: 4
sure: 30
neden: "Linux'ta ayarların ve logların neredeyse tamamı düz metin dosyasıdır. Bir servis neden çöktü sorusunun cevabı çoğu zaman bir log dosyasının son satırlarındadır. Her komutu ezberlemek mümkün değil; yardım sayfalarını okumayı bilmek seni internete bağımlı olmaktan kurtarır."
analoji:
  baslik: "Kitap okumanın dört yolu"
  metin: "`cat` kitabın tamamını ekrana döker. `less` sayfa sayfa çevirmeni sağlar. `head` kitabın ilk sayfalarına, `tail` son sayfalarına bakar. `tail -f` ise son sayfanın başında bekleyip, yazar yeni satır ekledikçe onu sana okur. Sınırı: gerçek kitap değişmez, log dosyası ise sen okurken büyür."
gorev:
  aciklama: "Ubuntu terminalinde sistemin kendi dosyalarını okuyacaksın (okumak zararsızdır, hiçbir şeyi değiştirmez). `less` ve `man` açıldığında çıkmak için `q` tuşuna bas."
  komutlar:
    - head -n 3 /etc/passwd
    - tail -n 3 /etc/passwd
    - cat /etc/os-release
    - less /etc/services
    - ls --help | head -n 5
    - man ls
    - man -k password | head -n 5
  soru: "`cat` ile `less` arasında hangisini 5000 satırlık bir dosya için tercih edersin ve neden? `less` içinde bir kelimeyi nasıl ararsın?"
  telefon:
    soru: "Bir servis sürekli hata veriyor ve `/var/log/uygulama.log` dosyasına yazıyor. Hatalar oluşurken canlı izlemek için hangi komutu yazarsın, izlemeyi nasıl durdurursun?"
    cevap: "`tail -f /var/log/uygulama.log`. Yeni satırlar eklendikçe ekranda görünür. Durdurmak için `Ctrl+C` basılır. Dosya okuma izni istiyorsa başına `sudo` gerekebilir."
sorular:
  - id: linux-004-s1
    soru: "`head -n 5 dosya` ve `tail -n 5 dosya` komutları ne yapar?"
    cevap: "`head` dosyanın ilk 5 satırını, `tail` son 5 satırını yazar. `-n` satır sayısını belirler; sayı verilmezse varsayılan 10 satırdır."
  - id: linux-004-s2
    soru: "`tail -f` neden log izlerken özellikle işe yarar?"
    cevap: "`-f` (follow) komutu açık tutar ve dosyaya eklenen yeni satırları gelir gelmez gösterir. Böylece bir hatayı tetikleyip aynı anda log'a düşen mesajı görebilirsin. Çıkmak için `Ctrl+C`."
  - id: linux-004-s3
    soru: "Bir komutun seçeneklerini hatırlamıyorsun. Hangi iki yolu denersin?"
    cevap: "`komut --help` kısa bir özet verir. `man komut` ise tam kılavuz sayfasını açar. Kılavuz içinde `/aranan` ile arama yapılır, `q` ile çıkılır."
  - id: linux-004-s4
    soru: "Bir dizindeki 50 MB'lık log dosyasına `cat` çekersen ne olur ve daha iyi bir yöntem nedir?"
    cevap: "Dosyanın tamamı ekrana akar, terminal dolar ve işine yarayan kısım kaybolur. `less dosya` ile sayfa sayfa gezmek ya da `tail -n 100 dosya` ile yalnız son satırlara bakmak daha iyidir."
derinDalis:
  - tur: kitap
    baslik: "The Linux Command Line (William Shotts)"
    ayrinti: "Komutların ne olduğunu keşfetmeyi ve yardım almayı anlatan bölüm."
    url: "https://linuxcommand.org/tlcl.php"
  - tur: okuma
    baslik: "man7.org: tail kılavuz sayfası"
    ayrinti: "`-f` ve `-n` seçeneklerinin resmi açıklaması."
---

Linux'ta yapılandırma, kullanıcı listesi, loglar: hepsi **düz metin** dosyalarıdır. Bu yüzden metin okuma komutları günde onlarca kez kullanılır.

### Dosya okuma komutları

- `cat dosya`: Dosyanın tamamını ekrana yazar. Kısa dosyalar için iyidir. Adı "concatenate" (birleştirmek) sözcüğünden gelir; birden fazla dosyayı art arda yazdırabilir.
- `less dosya`: Dosyayı sayfa sayfa açar. Ok tuşları ve Boşluk ile gezilir, `/kelime` ile arama yapılır, `n` sonraki eşleşmeye atlar, `q` çıkar. Uzun dosyalar için doğru araçtır.
- `head -n 5 dosya`: İlk 5 satır.
- `tail -n 5 dosya`: Son 5 satır. Log dosyalarında en yeni olaylar sonda olduğu için en sık kullanılandır.
- `tail -f dosya`: Son satırları gösterir ve yeni eklenenleri canlı yazar. `Ctrl+C` ile çıkılır.

### Yardım nasıl alınır

Her komutun seçeneklerini bilmek zorunda değilsin; bakmayı bilmen yeter.

1. `komut --help`: Kısa kullanım özeti. Çok uzunsa `komut --help | less` ya da `| head` ile kısalt (boru işaretini 008. derste öğreneceksin, şimdilik bu kalıbı kopyala).
2. `man komut`: Kılavuz (manual) sayfası. İçinde `less` gibi gezilir. Başlıklar: NAME (ne işe yarar), SYNOPSIS (nasıl yazılır), DESCRIPTION (seçenekler).
3. `man -k kelime`: Kılavuz sayfalarında kelimeye göre arama yapar.

SYNOPSIS içinde köşeli parantez `[ ]` isteğe bağlı kısımları gösterir. Örneğin `ls [OPTION]... [FILE]...` ifadesi, seçenek ve dosya adının yazılmasının zorunlu olmadığını söyler.

### Bir log okuma alışkanlığı

Bir şey bozulduğunda önce `tail -n 50` ile son 50 satıra bak. Hata mesajı genellikle oradadır. Daha çok bağlam gerekirse `less` ile aç ve `/error` diye ara.

Güvenlik notu: Sistem dosyalarını okumak çoğu zaman güvenlidir, ama `cat` ile ikili (binary) bir dosyayı ekrana dökmek terminalini bozabilir. Böyle bir şey olursa `reset` yazmak terminali düzeltir. Ayrıca log ve ayar dosyalarında parola ya da anahtar bulunabilir; ekran görüntüsü paylaşmadan önce içeriğe dikkat et.
