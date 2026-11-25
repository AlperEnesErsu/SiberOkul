---
kimlik: linux-012
baslik: "Loglar"
donem: 1
sira: 12
sure: 35
neden: "Bir güvenlik olayında 'ne oldu?' sorusunun cevabı loglardadır: kim ne zaman giriş yaptı, hangi servis çöktü, kaç başarısız deneme oldu. SOC analistleri ve DevSecOps mühendisleri logları okuyup örüntüyü yakalayabilmelidir. Bulut ve SIEM derslerinin temeli de budur."
analoji:
  baslik: "Binanın giriş defteri ve kamera kaydı"
  metin: "Log, binanın kapı defteri gibidir: kim, ne zaman, hangi kapıdan girdi ya da giremedi yazar. Defterin işe yaraması için dolu, tarihli ve değiştirilemez olması gerekir. Sınır: defteri okumak olayı önlemez; yalnız sonradan anlamayı sağlar. Ayrıca saldırgan yetkiliyse defteri silmeye de çalışabilir, bu yüzden loglar başka bir yere de gönderilir."
gorev:
  aciklama: "Sistemin kendi loglarına bakacaksın. Bazı komutlar `sudo` ister. WSL'de `auth.log` ya da journal boş olabilir; bu normaldir. Son iki komut, kasten yanlış parola girerek bir başarısız giriş kaydı oluşturmanı sağlar: istem çıkınca yanlış bir şey yazıp Enter'a bas."
  komutlar:
    - ls /var/log
    - sudo journalctl -n 15 --no-pager
    - sudo journalctl -p err -n 10 --no-pager
    - sudo journalctl --since "1 hour ago" --no-pager | head -n 10
    - sudo -k
    - sudo true
    - sudo grep -i "authentication failure" /var/log/auth.log | tail -n 3
  soru: "`sudo journalctl -p err` ile `sudo journalctl -n 15` arasındaki fark nedir? Hangisini olay incelemenin başında önce çalıştırırdın?"
  telefon:
    soru: "Şu log satırını gördün: `Nov 25 10:12:01 sunucu sshd[1234]: Failed password for invalid user admin from 203.0.113.5 port 52114 ssh2`. Ne olmuş, hangi bilgiler çıkar, ne yaparsın?"
    cevap: "203.0.113.5 adresinden SSH üzerinden `admin` adlı, sistemde olmayan bir kullanıcıyla parola denemesi yapılmış ve başarısız olmuş. Bilgiler: zaman, servis (sshd), kaynak IP, port. Aynı IP'den çok sayıda deneme varsa kaba kuvvet (brute force) saldırısıdır; IP'yi engelle, SSH'ta parola girişini kapatıp anahtar kullan."
sorular:
  - id: linux-012-s1
    soru: "`/var/log/auth.log` hangi olayları içerir?"
    cevap: "Kimlik doğrulama ve yetkilendirme olaylarını: SSH girişleri, başarısız parola denemeleri, `sudo` kullanımları, kullanıcı değişiklikleri. Güvenlik incelemesinde en çok bakılan log dosyalarından biridir (Ubuntu'da)."
    ipucu: "Satırdaki `invalid user` ifadesini yorumla."
  - id: linux-012-s2
    soru: "`journalctl -u ssh --since today` ne yapar?"
    cevap: "systemd günlüğünden yalnız `ssh` servisinin bugünkü kayıtlarını getirir. `-u` birimi (servisi) seçer, `--since` zaman aralığını daraltır."
    ipucu: "Kimlik doğrulama olayları hangi dosyada tutulur?"
  - id: linux-012-s3
    soru: "Bir logda aynı IP adresinden dakikada onlarca `Failed password` satırı görüyorsun. Bu ne anlama gelir ve ilk savunma adımların nedir?"
    cevap: "Büyük olasılıkla kaba kuvvet ya da parola tahmin saldırısıdır. İlk adımlar: kaynak IP'yi güvenlik duvarında engellemek, SSH'ta parola girişini kapatıp anahtar tabanlı girişe geçmek ve başarılı bir giriş olup olmadığını (`Accepted`) kontrol etmek."
    ipucu: "`-u` ve `--since` neyi daraltıyor?"
  - id: linux-012-s4
    soru: "Saldırganlar neden logları silmeye ya da değiştirmeye çalışır ve savunma olarak ne yapılır?"
    cevap: "İzlerini kapatmak, olayın incelenmesini zorlaştırmak için. Savunma: logları yalnız yerelde tutmamak, merkezi bir log sunucusuna ya da buluta gerçek zamanlı göndermek ve log dosyalarını yazmaya kapalı tutmak (izinler)."
    ipucu: "Aynı kaynaktan çok sayıda başarısız denemenin anlamını düşün."
  - id: linux-012-s5
    soru: "Gece 3'te alarm: `auth.log`'ta aynı IP'den dakikada 60 `Failed password`, ardından bir `Accepted password`. İlk ne yaparsın?"
    cevap: "Kabul edilen girişi öncelikli sayarsın: hangi hesap, hangi IP? O hesabın oturumunu sonlandırır, parolasını sıfırlar ve anahtar tabanlı girişe geçmeyi planlarsın. Logları dışarıya kopyalayıp kanıtı korur, IP'yi engeller ve olayı raporlarsın."
    ipucu: "Başarılı giriş ne anlama gelebilir?"
hizliKontrol:
  - soru: "`auth.log` ne içerir?"
    secenekler: ["Kimlik doğrulama ve sudo olayları","Disk kullanımı","Ağ hızı","Paket listesi"]
    dogru: 0
    aciklama: "auth.log giriş, başarısız deneme ve sudo kayıtlarını tutar."
    ipucu: "Kimlik doğrulama olayları nerede?"
sikHatalar:
  - hata: "Log'ta yalnız `Failed` satırlarına bakıp `Accepted` satırını aramamak."
    dogrusu: "Başarılı girişler asıl tehlikeyi gösterir; ikisini birlikte incele."
  - hata: "Logları yalnız sunucuda tutmak."
    dogrusu: "Merkezi bir sunucuya gönder; saldırgan yerel logu silebilir."
terimler:
  - "Log"
  - "Kaba kuvvet saldırısı"
  - "systemd"
  - "grep"
sema:
  baslik: "Log ile olay inceleme"
  adimlar:
    - etiket: "Belirti"
      aciklama: "Alarm ya da şüpheli bir belirti gelir."
    - etiket: "Zaman"
      aciklama: "`journalctl` ya da `auth.log` ile ilgili zaman aralığına bakılır."
    - etiket: "Süzme"
      aciklama: "`grep` ile IP ve kullanıcı süzülür."
    - etiket: "Başarı"
      aciklama: "Başarılı girişleri bulmak için `Accepted` satırları aranır."
    - etiket: "Müdahale"
      aciklama: "Engelleme, parola sıfırlama ve kanıt kaydı yapılır."
derinDalis:
  - tur: kitap
    baslik: "The Linux Command Line (William Shotts)"
    ayrinti: "Log dosyalarını okuma ve metin işleme araçlarının birlikte kullanımı."
    url: "https://linuxcommand.org/tlcl.php"
  - tur: okuma
    baslik: "man7.org: journalctl"
    ayrinti: "`-u`, `-p`, `--since` gibi seçeneklerin resmi açıklaması."
---

**Log**, sistemin ve servislerin tuttuğu zaman damgalı olay kayıtlarıdır. Güvenlikte log, olay sonrası elinde kalan **tek tanıktır**.

### Logların yeri

İki yaygın kaynak vardır:

1. **Düz metin dosyalar**: `/var/log/` altında. Önemlileri:
   - `auth.log`: kimlik doğrulama (SSH girişleri, `sudo`, başarısız denemeler).
   - `syslog`: genel sistem mesajları.
   - `dpkg.log`, `apt/`: paket kurulumları.
2. **systemd günlüğü** (journal): ikili biçimde tutulur, `journalctl` ile okunur.

Ubuntu'nun sürümüne ve yapılandırmasına göre bazı dosyalar olmayabilir; WSL'de çoğu zaman azdır.

### journalctl

```
sudo journalctl -n 50                    # son 50 kayıt
sudo journalctl -u ssh                   # yalnız ssh servisi
sudo journalctl -p err                   # hata ve daha ciddileri
sudo journalctl --since "1 hour ago"     # son bir saat
sudo journalctl -f                       # canlı izle (Ctrl+C ile çık)
```

`-p` önem düzeyini filtreler (`err`, `warning`, `info` gibi). `-u` servis seçer. Seçenekler birlikte kullanılabilir: `sudo journalctl -u ssh -p warning --since today`.

### Bir saldırı izi nasıl görünür?

Başarısız bir SSH denemesi şuna benzer:

```
Nov 25 10:12:01 sunucu sshd[1234]: Failed password for invalid user admin from 203.0.113.5 port 52114 ssh2
```

Satırı soldan oku: **zaman**, **makine**, **servis** (`sshd`) ve **mesaj**. Mesajdan çıkan bilgiler: parola yanlış, kullanıcı `admin` sistemde yok, kaynak IP `203.0.113.5` (belgelerde örnek olarak ayrılmış bir adres).

Bir IP'den kaç deneme geldiğini 008. dersteki kalıpla sayabilirsin:

```
grep "Failed password" auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn
```

`awk '{print $(NF-3)}'` satırın sondan dördüncü alanını yazar; bu biçimde o alan IP adresidir. Bir IP'nin yüzlerce denemesi varsa kaba kuvvet saldırısı vardır. Başarılı girişler `Accepted password` ya da `Accepted publickey` ile görünür; saldırı sonrası asıl bakılan şey, denemelerden sonra bir `Accepted` olup olmadığıdır.

### İyi log alışkanlıkları

- Logları yalnızca makinenin içinde tutma; merkezi bir yere gönder.
- Disk dolmasın diye log dönüşümü (rotation) yapılır; eski kayıtlar `auth.log.1`, `.gz` olarak arşivlenir.
- Parola, anahtar ya da kişisel veriyi loga yazma.

Güvenlik notu: Log dosyaları kendi başına saldırıyı durdurmaz; kimsenin okumadığı log işe yaramaz. İzlemeyi otomatikleştirmek (bulut bölgesindeki uyarı ve SIEM dersleri) bu yüzden önemlidir.
