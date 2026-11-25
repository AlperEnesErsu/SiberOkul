---
kimlik: linux-010
baslik: "Süreçler ve sinyaller"
donem: 1
sira: 10
sure: 30
neden: "Bir sunucuda bir şey yanlış gittiğinde ilk sorulardan biri 'hangi süreç, ne kadar kaynak yiyor?' olur. Takılan bir servisi durdurmak, şüpheli bir süreci bulmak ve CI'da arka planda iş yürütmek bu dersin konusudur. Container'lar da sonuçta birer süreçtir."
analoji:
  baslik: "Restoran mutfağı"
  metin: "Mutfaktaki her sipariş bir süreçtir ve sipariş numarası (PID) taşır. Şef bir siparişe 'bitir' der (`SIGTERM`): aşçı tezgâhı toplar ve bırakır. 'Hemen bırak' (`SIGKILL`) ise ocağı fişten çekmektir: iş yarım kalır. `&` ile bir yemeği arka ocağa koyarsın, sen başka işe bakarsın. Sınır: mutfakta şef siparişi görür, Linux'ta ise sürece yalnız sahibi (ya da root) sinyal gönderebilir."
gorev:
  aciklama: "Bir süreç başlatıp onu bulacak ve sonlandıracaksın. Komutlar zararsız: yalnızca `sleep` çalıştırıyoruz. `top` açıldığında `q` ile çık."
  komutlar:
    - ps
    - ps aux | head -n 5
    - sleep 300 &
    - jobs
    - pgrep -a sleep
    - "ps -o pid,ppid,stat,cmd -p $!"
    - kill $!
    - jobs
    - top
  soru: "`sleep 300 &` yazınca terminalin sana ne gösterdi (`[1] 12345` gibi)? Bu iki sayı ne anlama geliyor?"
  telefon:
    soru: "`ps aux` çıktısında bir sürecin `%CPU` değeri 99.8 ve komutu `./miner`. Bu sürecin sahibi `www-data`. Ne düşünürsün, ilk üç adımın ne olur?"
    cevap: "Bir web servisi hesabının kendi başına yüksek CPU kullanan, tanımadığın bir program çalıştırması şüphelidir (kripto madencisi gibi). Adımlar: 1) kanıtı kaybetmeden süreç ayrıntısını kaydet (`ps`, `ls -l /proc/<PID>/exe`), 2) süreci `kill` ile durdur ve nasıl başladığını (log, zamanlanmış görev) araştır, 3) sistemi olay olarak ele al: parolaları ve erişimi gözden geçir."
sorular:
  - id: linux-010-s1
    soru: "Süreç (process) ve program arasındaki fark nedir? PID ne işe yarar?"
    cevap: "Program diskteki bir dosyadır; süreç, o programın çalışmakta olan örneğidir. Her sürece çekirdek benzersiz bir numara verir: PID (process ID). Sinyal göndermek ve izlemek için süreç bu numarayla adreslenir."
  - id: linux-010-s2
    soru: "`kill PID` ile `kill -9 PID` arasındaki fark nedir? Hangisini önce denemelisin?"
    cevap: "`kill PID` varsayılan olarak SIGTERM (15) gönderir: süreç temizlik yapıp kapanabilir. `kill -9` SIGKILL'dir: süreç yakalayamaz, anında öldürülür, açık dosyalar ve geçici veriler temizlenmez. Önce SIGTERM, olmazsa SIGKILL denenir."
  - id: linux-010-s3
    soru: "`Ctrl+C`, `Ctrl+Z` ve komutun sonuna `&` eklemek ne yapar?"
    cevap: "`Ctrl+C` ön plandaki sürece SIGINT gönderip genellikle sonlandırır. `Ctrl+Z` süreci durdurur (askıya alır); `bg` ile arka planda devam ettirilir, `fg` ile öne alınır. `&` komutu baştan arka planda başlatır."
  - id: linux-010-s4
    soru: "Terminali kapatınca `sleep 300 &` ile başlattığın süreç neden çoğu zaman ölür ve bunu önlemek için ne kullanılır?"
    cevap: "Terminal kapanınca kabuk, çocuk süreçlerine SIGHUP (kapanma) gönderir ve onlar sonlanır. Arka planda kalmasını istediğin işler için `nohup komut &` ya da `tmux` gibi araçlar kullanılır. Servisler için doğru çözüm `systemd` ile yönetmektir (011. ders)."
derinDalis:
  - tur: kitap
    baslik: "The Linux Command Line (William Shotts)"
    ayrinti: "Processes ve Signals konularını anlatan bölümler."
    url: "https://linuxcommand.org/tlcl.php"
  - tur: okuma
    baslik: "man7.org: signal(7)"
    ayrinti: "Sinyallerin tam listesi ve ne anlama geldikleri."
---

Çalışan her program Linux'ta bir **süreçtir** (process). Süreç, programın bellekteki canlı halidir ve çekirdek ona bir **PID** (process ID) verir. Başka bir sürecin başlattığı süreçlerin **PPID**'si (parent PID, ebeveyn) olur. Bir bakıma aile ağacı kurulur.

### Süreçlere bakmak

- `ps`: Yalnız bu terminalin süreçleri.
- `ps aux`: Sistemdeki tüm süreçler. Sütunlardan `USER` kimin, `PID` numara, `%CPU` ve `%MEM` kaynak kullanımı, `COMMAND` komuttur.
- `pgrep -a ad`: Adı eşleşen süreçlerin PID'lerini ve komutlarını bulur.
- `top`: Canlı, sürekli güncellenen liste. `q` ile çıkılır. `htop` daha rahat okunur ama kurulum gerektirir.

Olay incelemede "kim, hangi komutla, ne kadar kaynak kullanıyor?" sorusunun ilk cevabı `ps aux`'tur.

### Sinyaller

**Sinyal**, çekirdeğin ya da bir kullanıcının sürece gönderdiği kısa mesajdır. En önemlileri:

| Sinyal | Numara | Anlamı |
|---|---|---|
| `SIGINT` | 2 | Kes (`Ctrl+C`) |
| `SIGTERM` | 15 | Nazikçe kapan (`kill` varsayılanı) |
| `SIGKILL` | 9 | Zorla öldür, yakalanamaz |
| `SIGSTOP` | 19 | Durdur (yakalanamaz) |
| `SIGHUP` | 1 | Terminal kapandı; servisler ayarı yeniden okur |

```
kill 12345        # SIGTERM gönder
kill -9 12345     # SIGKILL: son çare
pkill sleep       # adıyla sinyal gönder
```

Önce `kill` (SIGTERM), süreç inatla kapanmazsa `kill -9`. SIGKILL süreci temizlik yapmadan keser; yarım yazılmış dosyalar ve açık kalan kilitler bırakabilir.

### Arka plan işleri

- `komut &`: Komutu arka planda başlatır, terminal hemen sana döner. `$!` son arka plan işinin PID'idir.
- `jobs`: Bu terminalin arka plan işleri.
- `Ctrl+Z`: Ön plandaki işi durdurur. `bg` arka planda devam ettirir, `fg` öne getirir.
- `nohup komut &`: Terminal kapansa da komut devam eder.

Arka plan işleri bu terminale bağlıdır; kalıcı servisler için `systemd` kullanılır (bir sonraki ders).

### Sahiplik

Bir kullanıcı yalnız kendi süreçlerine sinyal gönderebilir. Başkasının sürecini durdurmak için `sudo` gerekir. Bu, 005. ve 006. derslerdeki kullanıcı ve izin mantığının devamıdır.

Güvenlik notu: Yüksek CPU kullanan, tanımadığın bir süreç (özellikle servis hesabı altında) ele geçirilmiş bir sistemin işareti olabilir. Süreci hemen `kill -9` ile öldürmek yerine önce komut satırını ve dosya yolunu kaydet; sonra durdur. Kanıtı yok etmek incelemeyi zorlaştırır.
