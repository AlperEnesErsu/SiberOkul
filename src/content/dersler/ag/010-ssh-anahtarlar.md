---
kimlik: ag-010
baslik: "SSH ve anahtarlar"
donem: 2
sira: 10
sure: 40
neden: "Sunucuları yönetmenin standart yolu SSH'tir; CI/CD makineleri ve Git de SSH anahtarı kullanır. İnternete açık her sunucu günde yüzlerce SSH parola denemesi alır. Anahtarla giriş ve temel sertleştirme, bir DevSecOps mühendisinin ilk refleksidir."
analoji:
  baslik: "SSH anahtarı, kilit ve anahtar"
  metin: "Açık anahtarını (kilit) istediğin kapıya taktırırsın, gizli anahtarını (anahtar) cebinde tutarsın. Kapı, sana özel anahtarın uyduğunu doğrulayınca açılır ve anahtarın kendisini asla göstermezsin. Sınır: gizli anahtar çalınırsa kapıyı kim açarsa o 'sen' olur; bu yüzden anahtara parola koyulur."
gorev:
  aciklama: "Önce /tmp altında deneme anahtarı üret (gerçek hesaplarına dokunmaz). Sonra Bandit oyununun 0. seviyesine giriş yap. Bu, OverTheWire'ın herkese açık ve izin verdiği bir eğitim sunucusudur; kullanıcı adı ve parolayı seviyenin sayfasında bulursun (`https://overthewire.org/wargames/bandit/bandit0.html`). Parolayı sayfadan okuyup kendin yazarsın."
  komutlar:
    - "ssh-keygen -t ed25519 -f /tmp/deneme_anahtar -C \"deneme\" -N \"\""
    - "ls -l /tmp/deneme_anahtar /tmp/deneme_anahtar.pub"
    - "cat /tmp/deneme_anahtar.pub"
    - "ssh -p 2220 bandit0@bandit.labs.overthewire.org"
    - "rm -f /tmp/deneme_anahtar /tmp/deneme_anahtar.pub"
  soru: "`ls -l` çıktısında gizli anahtarın (`deneme_anahtar`) izinleri nasıl? `.pub` dosyasıyla farkı ne? Bandit 0'da girişten sonra `ls` ile hangi dosyayı görüyorsun?"
  telefon:
    soru: "Bir `ssh` bağlantısında `WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!` uyarısı çıktı. Neden dikkatli olmalısın?"
    cevap: "Bu sunucunun parmak izi, daha önce kaydedilenle uyuşmuyor. Sunucu yeniden kurulmuş olabilir, ama araya biri girmiş olabilir (ortadaki adam). Sunucunun sahibinden yeni parmak izini başka bir kanaldan doğrulamadan uyarıyı geçme."
sorular:
  - id: ag-010-s1
    soru: "SSH anahtar çiftinde açık ve gizli anahtar neyi yapar? Hangisi paylaşılır?"
    cevap: "Açık anahtar (.pub) sunucuya konur, paylaşılabilir. Gizli anahtar cihazında kalır ve asla paylaşılmaz. Sunucu, gizli anahtara sahip olduğunu kanıtlayan istemciyi içeri alır."
  - id: ag-010-s2
    soru: "Parola yerine anahtarla giriş neden daha güvenlidir?"
    cevap: "Anahtar tahmin edilemeyecek kadar uzundur ve ağda gönderilmez; kaba kuvvetle denenemez. Parola ise zayıfsa denemelerle bulunabilir ya da sahte bir sunucuya yazılıp çalınabilir."
  - id: ag-010-s3
    soru: "`~/.ssh/known_hosts` dosyası ne işe yarar?"
    cevap: "Daha önce bağlandığın sunucuların parmak izlerini saklar. Sonraki bağlantıda parmak izi değişmişse uyarı verir; sahte sunucuya karşı korur."
  - id: ag-010-s4
    soru: "Bir sunucuda `sshd_config` içinde hangi üç ayar sertleştirme için akla gelir?"
    cevap: "`PasswordAuthentication no` (yalnız anahtar), `PermitRootLogin no` (doğrudan root girişi yok) ve gerekirse `AllowUsers` ile izinli kullanıcıları sınırlamak. Değişiklikten sonra servisi yeniden başlatmadan önce ikinci bir oturum açık tut."
derinDalis:
  - tur: lab
    baslik: "OverTheWire Bandit, seviye 0"
    ayrinti: "SSH ile ilk giriş. Seviyeleri sırayla ilerleyen, Linux komutlarını pekiştiren bir oyun."
    url: "https://overthewire.org/wargames/bandit/bandit0.html"
  - tur: okuma
    baslik: "OpenSSH kılavuz sayfaları"
    ayrinti: "ssh, ssh-keygen ve sshd_config belgeleri."
    url: "https://www.openssh.com/manual.html"
---

**SSH** (Secure Shell), başka bir makinede güvenli şekilde terminal açmanı sağlar. Varsayılan portu 22'dir. İçerik şifrelenir ve sunucunun kimliği doğrulanır. Telnet gibi eski araçların açık metin sorununu çözer.

### Sunucuyu tanımak: parmak izi

İlk bağlandığında SSH, sunucunun **parmak izini** (fingerprint) gösterir ve sorar. Evet dersen `~/.ssh/known_hosts` dosyasına yazılır. Sonraki bağlantıda parmak iz değişmişse SSH büyük bir uyarı verir. Sunucunun gerçekten yeniden kurulduğunu bilmiyorsan, bu bir ortadaki adam saldırısının işareti olabilir.

### Anahtar çifti

Parola yerine bir **anahtar çifti** (key pair) kullanabilirsin:

```
ssh-keygen -t ed25519
```

İki dosya oluşur: `id_ed25519` (**gizli** anahtar) ve `id_ed25519.pub` (**açık** anahtar). Açık anahtarı sunucudaki `~/.ssh/authorized_keys` dosyasına eklersin. Bağlanırken sunucu bir meydan okuma yollar; yalnız gizli anahtara sahip olan doğru cevabı verebilir. Gizli anahtar ağdan asla geçmez.

Kurallar:

- Gizli anahtarın izinleri sıkı olmalı (`-rw-------`); SSH aksi halde reddeder. linux-006'daki izinleri hatırla.
- Gizli anahtarı kimseyle paylaşma, Git deposuna koyma.
- Gizli anahtarı bir **parola ifadesi** (passphrase) ile koru. Bu derste /tmp'deki deneme anahtarında kısalık için boş bıraktık; gerçek anahtarda bırakma.

### Anahtarı sunucuya koymak

Bir sunucuda genelde `ssh-copy-id kullanici@sunucu` ile açık anahtar eklenir. Elle de yapılabilir: `.pub` dosyasının tek satırını `authorized_keys`e eklemek yeter.

### Sunucu sertleştirme

Sunucu tarafında ayarlar `/etc/ssh/sshd_config` dosyasındadır. İyi bir başlangıç:

- `PasswordAuthentication no`: Parolayla giriş kapalı; yalnız anahtar.
- `PermitRootLogin no`: Doğrudan root girişi yok; önce sıradan kullanıcı, sonra `sudo` (linux-007).
- `AllowUsers ayse`: Yalnız belirli kullanıcılar girebilir.

Ayrıca güvenlik duvarında 22'yi yalnız gerektiği adreslere aç (ag-009). Servisi yeniden başlatmadan önce ikinci bir oturumu açık tut; yapılandırma hatası seni dışarıda bırakabilir.

### Neden bu kadar önemli?

İnternete açık bir SSH portu kısa sürede saldırganların taramalarına girer. `/var/log/auth.log` içinde (linux-012) çok sayıda başarısız giriş görmen normaldir. Anahtarla giriş ve parolanın kapatılması, bu denemeleri etkisiz kılar.

### Bandit

**OverTheWire Bandit**, SSH ve Linux komutlarını oyunla öğreten bir eğitim sunucusudur. Seviye 0 bunun ilk adımı: `ssh -p 2220 bandit0@bandit.labs.overthewire.org`. Parolayı seviye sayfasında bulursun. Bu sunucu bu iş için herkese açıktır; başka sunuculara izinsiz bağlanma.

Güvenlik notu: Gizli anahtarı sohbetlere, e-postaya ya da depolara yapıştırma. Sızdığını düşünürsen anahtarı hemen sunuculardan çıkarıp yenisini üret.
