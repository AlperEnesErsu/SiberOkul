---
kimlik: linux-005
baslik: "Kullanıcılar ve gruplar"
donem: 1
sira: 5
sure: 30
neden: "Linux'ta 'kim bu işi yaptı?' ve 'kim buna erişebilir?' sorularının cevabı kullanıcı ve grup kimliklerindedir. Servislerin ayrı kullanıcılarla çalıştırılması, container'larda root olmayan kullanıcı seçmek ve olay incelemede şüpheli bir hesap bulmak bu bilgiye dayanır."
analoji:
  baslik: "Apartman: daire sahipleri ve kat komiteleri"
  metin: "Her kullanıcı apartmanda bir dairenin sahibidir ve kendi anahtarı vardır. Gruplar ise kat komiteleri gibidir: 'çatı katı anahtarına komite üyeleri girebilir'. Bir kişi birden fazla komitede olabilir. Sınır: apartmanda yönetici tektir, Linux'ta ise 'root' dışında yönetici yetkisi `sudo` grubu gibi mekanizmalarla paylaştırılabilir (yetkiyi 007. derste göreceğiz)."
gorev:
  aciklama: "Aşağıdaki komutlar yalnızca bilgi okur. Kendi kullanıcı numaranı (UID), gruplarını ve sistemdeki hesap listesini göreceksin."
  komutlar:
    - id
    - id root
    - groups
    - whoami
    - getent passwd "$USER"
    - "cut -d: -f1,3,7 /etc/passwd | head -n 10"
    - grep '^sudo' /etc/group
  soru: "`id` çıktısındaki `uid`, `gid` ve `groups` bölümleri neyi anlatıyor? Kendi hesabının UID değeri nedir ve root'unkinden neden farklı?"
  telefon:
    soru: "`/etc/passwd` içinde şu satırı gördün: `www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin`. Bu hesap bir insan kullanıcısı mı, servis hesabı mı? Hangi alanlardan anladın?"
    cevap: "Servis hesabı. Kabuk alanı `/usr/sbin/nologin` olduğu için bu hesapla terminalde oturum açılamaz. Ayrıca UID 33 düşük bir sistem numarasıdır ve ev dizini `/var/www` (web sunucusunun dosyaları) olarak ayarlanmıştır."
sorular:
  - id: linux-005-s1
    soru: "`/etc/passwd` dosyasındaki bir satır hangi bilgi alanlarını içerir?"
    cevap: "İki nokta üst üste ile ayrılmış yedi alan: kullanıcı adı, parola yer tutucusu (`x`), UID, birincil GID, açıklama, ev dizini ve oturum kabuğu."
    ipucu: "Kabuk alanındaki programın adına bak."
  - id: linux-005-s2
    soru: "`/etc/passwd` herkes tarafından okunabiliyor, peki parolalar nerede saklanır?"
    cevap: "`/etc/shadow` dosyasında, parolanın kendisi değil hash'i (özet) saklanır. Bu dosyayı yalnızca root ve ilgili ayrıcalıklı gruplar okuyabilir. `/etc/passwd` içindeki `x`, parolanın orada tutulmadığını gösterir."
    ipucu: "`/etc/passwd`'de kaç alan olduğunu say."
  - id: linux-005-s3
    soru: "Neden bir web sunucusu `www-data` gibi ayrı bir kullanıcıyla çalışır da root ile çalışmaz?"
    cevap: "Sunucuda bir açık bulunur ve saldırgan süreci ele geçirirse, saldırganın yetkisi sürecin kullanıcısı kadar olur. Süreç `www-data` ise sistemin geri kalanına dokunamaz; root olsaydı her şeye dokunabilirdi. Bu, en az yetki ilkesinin uygulamasıdır."
    ipucu: "Parola dosyasının herkese açık olması ile parola özetinin saklandığı yeri ayır."
  - id: linux-005-s4
    soru: "Bir kullanıcıyı `sudo` grubuna eklemek ne anlama gelir ve `id` ile bunu nasıl doğrularsın?"
    cevap: "Ubuntu'da `sudo` grubunun üyeleri yönetici komutlarını `sudo` ile çalıştırabilir. Kullanıcı eklendiğinde `id kullanici` çıktısındaki `groups` listesinde `sudo` görünür (kullanıcı oturumu yeniden açınca etkili olur)."
    ipucu: "Bir servis ele geçirilirse saldırganın yetkisinin neye bağlı olduğunu düşün."
  - id: linux-005-s5
    soru: "Yeni bir geliştirici 'sudo yetkisi' istiyor. Önce hangi komutla mevcut durumuna bakar, sonra nasıl eklersin?"
    cevap: "`id kullanici` ile hangi gruplarda olduğuna bakarsın. Gerçekten gerekiyorsa `sudo usermod -aG sudo kullanici` ile ekler ve tekrar `id` ile doğrularsın. Gerek yoksa tam yetki yerine yalnız ihtiyaç duyduğu komutlar için sudoers kuralı tercih edilir."
    ipucu: "`-aG` içindeki `a` neyi korur?"
hizliKontrol:
  - soru: "Hangisi `/etc/shadow` hakkında doğrudur?"
    secenekler: ["Herkes okuyabilir","Parola özetlerini tutar ve yalnız ayrıcalıklı kullanıcılar okuyabilir","Kullanıcıların ev dizinlerini listeler","Gruplar burada tutulur"]
    dogru: 1
    aciklama: "`/etc/shadow` parola özetlerini tutar; herkes okuyabilseydi özetler kırılmaya açık olurdu."
    ipucu: "`shadow` neden kısıtlı tutulur?"
sikHatalar:
  - hata: "`/etc/passwd`'de parolaların düz metin saklandığını sanmak."
    dogrusu: "Orada `x` yer tutucudur; parola özeti `/etc/shadow`'dadır."
  - hata: "Servis için oturum açılabilen bir hesap açmak."
    dogrusu: "Servis hesaplarının kabuğu `nologin` olmalı; oturum açılamasın."
terimler:
  - "UID"
  - "Servis hesabı"
  - "Parola özeti"
  - "root"
derinDalis:
  - tur: kitap
    baslik: "The Linux Command Line (William Shotts)"
    ayrinti: "Kullanıcı kimliği, grup ve izinler konusuna giriş bölümü (Permissions)."
    url: "https://linuxcommand.org/tlcl.php"
  - tur: okuma
    baslik: "man7.org: passwd(5) dosya biçimi"
    ayrinti: "`/etc/passwd` alanlarının resmi açıklaması."
---

Linux çok kullanıcılı bir sistemdir. Her **kullanıcı** (user) bir ad ve bir sayıdan oluşur: **UID** (user ID). Çekirdek (kernel) adları değil sayıları kullanır. Aynı şekilde her **grup** bir **GID** taşır.

### Kimim ve hangi gruplardayım?

`id` komutu üçünü birden gösterir:

```
uid=1000(alper) gid=1000(alper) groups=1000(alper),27(sudo)
```

- `uid=1000(alper)`: kullanıcı numaran ve adın.
- `gid=1000(alper)`: birincil grubun. Yeni dosyalar varsayılan olarak bu gruba ait olur.
- `groups=...`: üye olduğun tüm gruplar.

Root'un UID'si her zaman **0**'dır. Bir hesabın "ne kadar güçlü" olduğunu adı değil UID'si belirler. Sıradan insan kullanıcıları genelde 1000'den başlar; küçük numaralar sistem ve servis hesaplarına ayrılmıştır.

### Hesapların kayıt defterleri

- `/etc/passwd`: Her satır bir hesaptır. Yedi alan `:` ile ayrılır: `ad:x:UID:GID:açıklama:ev dizini:kabuk`. Dosya herkes tarafından okunabilir, çünkü programlar UID'leri adlara çevirmek için ona bakar.
- `/etc/shadow`: Parola özetlerinin (hash) tutulduğu dosya. Yalnız root okuyabilir. `/etc/passwd`'deki `x` "parola orada değil" demektir.
- `/etc/group`: Gruplar ve üyeleri. Satır biçimi `grupadı:x:GID:üye1,üye2`.

Kabuk alanında `/usr/sbin/nologin` ya da `/bin/false` görürsen o hesaba oturum açılamaz. Servis hesaplarının çoğu böyledir.

### Yeni kullanıcı eklemek

`sudo useradd -m ayse` komutu `ayse` adlı hesabı ve ev dizinini (`-m`) oluşturur; `sudo passwd ayse` ile parolası belirlenir. Ubuntu'da etkileşimli ve daha kolay olanı `adduser`dır. Bu derste kullanıcı **eklemiyoruz**; yalnız mantığı öğreniyoruz. Bir kullanıcıyı gruba eklemek için `sudo usermod -aG grup kullanici` kullanılır; buradaki `-a` (append: ekle) unutulursa kullanıcı öbür gruplardan çıkarılır.

### Neden önemli?

Bir sunucuda yeni ve beklenmeyen bir kullanıcı ya da UID'si 0 olan ikinci bir hesap, ciddi bir saldırı işaretidir. `/etc/passwd`'i düzenli okumak, sistemin normal halini tanımanı sağlar.

Güvenlik notu: Her servisi kendi kullanıcısıyla çalıştırmak, bir açık sömürüldüğünde zararı sınırlar. Container derslerinde de aynı fikri "root olmayan kullanıcı" olarak göreceksin.
