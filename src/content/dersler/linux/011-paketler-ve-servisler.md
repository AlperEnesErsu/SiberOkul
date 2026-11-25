---
kimlik: linux-011
baslik: "Paketler ve servisler"
donem: 1
sira: 11
sure: 35
neden: "Sunucuya yazılım kurmak ve servisleri yönetmek günlük iştir. Güvenlik açıklarının büyük kısmı eski paketlerden gelir; ayrıca her kurulan paket, güvenmeyi seçtiğin bir depoya ve imzacıya bağlıdır. Kuruluma ve servis durumuna hâkim olmak savunmanın temelidir."
analoji:
  baslik: "Uygulama mağazası ve apartman görevlisi"
  metin: "`apt` bir uygulama mağazasıdır: yazılımı güvenilir bir depodan, imzası kontrol edilerek indirir. Servis yöneticisi (`systemctl`) ise apartman görevlisidir: kapıyı açar (start), kapatır (stop), sabah kendiliğinden açılmasını sağlar (enable) ve 'bugün durum nasıl?' (status) sorusuna cevap verir. Sınır: mağaza yalnız eklediğin depolara güvenir; yanlış depo eklersen mağaza seni korumaz."
gorev:
  aciklama: "Aşağıdaki komutların ilk bölümü sadece okur. `sudo apt install` kısmı küçük, zararsız bir araç (`tree`) kurar. WSL'de `systemctl` komutları, systemd etkin değilse hata verebilir; hata alırsan bunu not et ve telefon sorusunu çöz."
  komutlar:
    - cat /etc/apt/sources.list | head -n 8
    - ls /etc/apt/sources.list.d
    - apt-cache policy curl
    - sudo apt update
    - sudo apt install -y tree
    - tree -L 1 /etc | head -n 15
    - apt list --installed 2> /dev/null | wc -l
    - ps -p 1 -o comm=
    - systemctl list-units --type=service --no-pager | head -n 10
  soru: "`ps -p 1 -o comm=` ne yazdı? Çıktı `systemd` ise `systemctl` çalışır; değilse neden çalışmaz?"
  telefon:
    soru: "`sudo apt update` komutu çalıştırdın ve yeni paket kurulmadı ama internet trafiği oldu. Neden? `apt update` ile `apt upgrade` farkı nedir?"
    cevap: "`apt update` yalnız depolardan güncel paket listesini (hangi sürüm var) indirir; yazılım kurmaz. `apt upgrade` ise o listeye göre kurulu paketleri günceller. Önce `update`, sonra `upgrade` çalıştırılır."
sorular:
  - id: linux-011-s1
    soru: "`apt install paket` çalıştırdığında paket nereden gelir ve gerçek paket olduğundan nasıl emin olunur?"
    cevap: "Paket, `/etc/apt/sources.list` ve `sources.list.d` altında tanımlı depolardan gelir. Depolar ve paketler kriptografik imzalarla doğrulanır; apt imzası eşleşmeyen paketi kurmaz. Güven, eklediğin depo ve onun imza anahtarına dayanır."
    ipucu: "`update` ile `upgrade`'in neyi güncellediğini ayır."
  - id: linux-011-s2
    soru: "Bir blogda 'şu komutla kur: curl ... | sudo bash' dendi. Neden `apt install` kadar güvenli değildir?"
    cevap: "Doğrudan internetten gelen bir betiği root olarak çalıştırır; ne içerdiğini görmez, imza ya da sürüm doğrulaması yoktur. Sunucu ele geçirilmişse ya da komut değiştirilmişse sistem tehlikeye girer. Betiği önce indirip okumak ya da depodan kurmak daha güvenlidir."
    ipucu: "Paketin kaynağını ve imzasını düşün."
  - id: linux-011-s3
    soru: "`systemctl status ssh` komutu çıktısında `active (running)` ve `enabled` ifadeleri ne anlama gelir?"
    cevap: "`active (running)` servisin şu an çalıştığını söyler. `enabled` ise açılışta otomatik başlayacak şekilde ayarlı olduğunu söyler. İkisi bağımsızdır: servis çalışıyor ama `disabled` olabilir ya da `enabled` olup durmuş olabilir."
    ipucu: "İnternetten gelen betiği root yetkisiyle çalıştırmanın sonucunu düşün."
  - id: linux-011-s4
    soru: "Gereksiz servisleri kapatmak neden güvenlik açısından iyi bir alışkanlıktır?"
    cevap: "Çalışan her servis dinleyen bir kapı ve saldırılabilecek kod demektir. Kullanılmayan servis hem saldırı yüzeyini büyütür hem de güncellenmediğinde açık bırakır. Kapatmak (`systemctl disable --now`) yüzeyi küçültür."
    ipucu: "`active` ve `enabled` aynı şey mi?"
  - id: linux-011-s5
    soru: "Güvenlik ekibi 'sunucuda gereksiz bir FTP servisi dinliyor' diyor. Nasıl ilerlersin?"
    cevap: "`systemctl status` ile servisin durumuna bakıp gerçekten kullanılmadığını doğrularsın. Sonra `sudo systemctl disable --now servis` ile durdurup açılışta kapatırsın. Paket de gerekmiyorsa `apt remove` ile kaldırırsın."
    ipucu: "`--now` neyi aynı anda yapıyor?"
hizliKontrol:
  - soru: "`systemctl enable ssh` ne yapar?"
    secenekler: ["Servisi hemen durdurur","Servisi açılışta başlayacak şekilde ayarlar","Paketi siler","Parolayı sıfırlar"]
    dogru: 1
    aciklama: "`enable` açılışta otomatik başlatmayı ayarlar; hemen başlatmak için `start` ya da `--now` gerekir."
    ipucu: "Açılış ayarı mı, şimdiki durum mu?"
sikHatalar:
  - hata: "`apt update` yaptım, paketler güncellendi sanmak."
    dogrusu: "`update` yalnız listeyi yeniler; `upgrade` paketleri günceller."
  - hata: "`curl ... | sudo bash` ile kurulum yapmak."
    dogrusu: "Betiği indirip oku; mümkünse `apt` gibi imzalı kaynak kullan."
terimler:
  - "Paket yöneticisi"
  - "systemd"
  - "Saldırı yüzeyi"
  - "root"
sema:
  baslik: "apt ile paket kurma"
  adimlar:
    - etiket: "Liste"
      aciklama: "`sudo apt update` ile paket listesi yenilenir."
    - etiket: "Arama"
      aciklama: "`sudo apt install paket` ile paket depoda bulunur."
    - etiket: "İmza"
      aciklama: "Paket imzaları doğrulanır."
    - etiket: "Kurulum"
      aciklama: "Paket indirilir ve kurulur."
    - etiket: "Servis"
      aciklama: "Paket bir servisse `systemctl` ile başlatılır ve izlenir."
olay:
  baslik: "XZ Utils arka kapısı"
  yil: 2024
  ozet: "CISA, 29 Mart 2024 uyarısında XZ Utils 5.6.0 ve 5.6.1 sürümlerine kötü amaçlı kod gömüldüğünü (CVE-2024-3094) bildirdi. Kod, etkilenen sistemlere yetkisiz erişime izin verebilirdi; öneri 5.4.6 gibi temiz bir sürüme dönmekti."
  ders: "Güvenilir dağıtımdan gelen bir paketin zinciri bile zehirlenebilir. Dağıtım ve CISA uyarılarını izlemek, kurulu sürümleri bilmek gerekir."
  kaynak:
    ad: "CISA uyarısı"
    url: "https://www.cisa.gov/news-events/alerts/2024/03/29/reported-supply-chain-compromise-affecting-xz-utils-data-compression-library-cve-2024-3094"
derinDalis:
  - tur: okuma
    baslik: "Ubuntu Server: paket yönetimi"
    ayrinti: "`apt` ile paket kurma, güncelleme ve depolar."
  - tur: kitap
    baslik: "How Linux Works, 3. baskı (Brian Ward)"
    ayrinti: "systemd ile servis ve birim (unit) yönetimi konusu."
---

Linux'ta yazılım tek tek siteden indirilen kurulum dosyalarıyla değil, **paket yöneticisi** ile kurulur. Ubuntu'da bu araç `apt`'tır.

### apt nasıl çalışır?

- **Depo** (repository): paketlerin tutulduğu sunucu. Adresleri `/etc/apt/sources.list` ve `/etc/apt/sources.list.d/` içindedir.
- **Paket**: yazılım ve onun bağımlılık bilgisi. `apt` bağımlılıkları kendisi çözer.
- **İmza**: Depolar ve paketler anahtarlarla imzalanır; `apt` imza doğrulanamayan paketi kurmaz.

Temel komutlar:

| Komut | Ne yapar |
|---|---|
| `sudo apt update` | Paket listesini yeniler (kurmaz) |
| `sudo apt upgrade` | Kurulu paketleri günceller |
| `apt search kelime` | Paket arar |
| `apt show paket` | Paket ayrıntısı |
| `sudo apt install paket` | Kurar |
| `sudo apt remove paket` | Kaldırır |

`apt-cache policy paket` hangi sürümün kurulu, hangisinin depoda olduğunu ve hangi depodan geleceğini gösterir.

### Güven zinciri

Bir paketi kurmak, o depoya ve imzalayan kişiye güvenmek demektir. Bu yüzden:

- Rastgele bir blogun söylediği depoyu ya da anahtarı eklemeden önce kim olduğuna bak.
- `curl ... | sudo bash` kalıbı, hiçbir doğrulama yapmadan internetten gelen betiği root olarak çalıştırır. Betiği önce indir, oku, sonra çalıştır.
- Güncellemeleri geciktirme: bilinen açıkların çoğu güncel paketle kapanır.

### Servisler ve systemd

**Servis** (service), arka planda sürekli çalışan programdır (web sunucusu, SSH sunucusu, veritabanı). Ubuntu'da servisleri **systemd** yönetir ve `systemctl` komutu onun arayüzüdür:

```
systemctl status ssh          # durumu göster
sudo systemctl start ssh      # şimdi başlat
sudo systemctl stop ssh       # şimdi durdur
sudo systemctl enable ssh     # açılışta otomatik başlasın
sudo systemctl disable ssh    # açılışta başlamasın
sudo systemctl restart ssh    # yeniden başlat
```

`status` çıktısında iki şeye bak: **active (running)** servis çalışıyor mu, **enabled** açılışta başlıyor mu. Altında servisin son log satırları da görünür; bu satırlar sorun giderirken ilk bakılacak yerdir.

### WSL notu

WSL'de systemd varsayılan olarak her kurulumda etkin olmayabilir. Etkin değilse `systemctl` "System has not been booted with systemd" benzeri bir hata verir. Bu bir hata değil, ortamın durumudur. Bu dersin amacı mantığı öğrenmek; sunucularda ve gerçek Ubuntu kurulumlarında komutlar aynen çalışır.

Güvenlik notu: Çalışan her servis bir saldırı yüzeyidir. Kullanmadığın servisi kapatmak, açığı kapatmaktan önce açığın doğma ihtimalini azaltır. Hangi servislerin çalıştığını bilmek, denetimin ilk adımıdır.
