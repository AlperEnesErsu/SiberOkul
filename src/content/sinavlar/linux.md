---
donem: 1
baslik: "Linux + Bash bölgesi sınavı"
sorular:
  - soru: "İstem satırın `ayse@lab:~$` ve `pwd` komutu `/home/ayse` yazdırıyor. Buradan ne anlarsın?"
    secenekler: [ "Ayşe root kullanıcısıdır", "`~` işareti ev dizinini gösterir ve Ayşe ev dizinindedir", "`lab` kullanıcının adıdır, `ayse` makinenin adıdır", "`$` işareti dizinin boş olduğunu gösterir" ]
    dogru: 1
    aciklama: "`~` ev dizinin için kısaltmadır ve `/home/ayse` ile aynı yeri gösterir. Root'ta `$` yerine `#` görünür; `ayse` kullanıcı, `lab` makine adıdır."
    ipucu: "İstemdeki `~` işaretinin ne anlama geldiğini düşün."
  - soru: "`/home/ayse/notlar` dizinindesin ve `../belgeler` yoluna gitmek istiyorsun. Bu yol neyi gösterir?"
    secenekler: [ "`/home/ayse/belgeler`", "`/home/ayse/notlar/belgeler`", "`/home/belgeler`", "`/belgeler`" ]
    dogru: 0
    aciklama: "`..` bir üst dizin demektir: `/home/ayse`. Onun altındaki `belgeler` dizini `/home/ayse/belgeler` olur. Göreli yol bulunduğun dizine göre çözülür."
    ipucu: "`..` işaretinin hangi dizine çıktığını adım adım çöz."
  - soru: "Bir betiği test ederken `rm *.log` yazacaksın ama yanlış dizinde olabilirsin. En güvenli ilk adım hangisi?"
    secenekler: [ "Hemen `rm *.log` çalıştırıp hata varsa geri almak", "Dizinin adını değiştirmek", "`rm -rf *` yazmak", "`ls *.log` ile neyin eşleştiğine bakıp sonra silmek" ]
    dogru: 3
    aciklama: "Joker karakteri kabuk açar; aynı desenle `ls` çalıştırmak neyin silineceğini gösterir. `rm` geri alınamaz, çöp kutusu yoktur."
    ipucu: "Silmeden önce neyin eşleşeceğini görmenin yolunu düşün."
  - soru: "Bir uygulama hata veriyor ve log dosyasına yazıyor. Hatayı tetikleyip aynı anda mesajı görmek istiyorsun. Hangi komut uygundur?"
    secenekler: [ "`cat /var/log/uygulama.log`", "`head -n 5 /var/log/uygulama.log`", "`tail -f /var/log/uygulama.log`", "`man uygulama`" ]
    dogru: 2
    aciklama: "`tail -f` dosyanın sonunu açık tutar ve yeni satırları gelir gelmez yazar. `cat` ve `head` yalnız o anki içeriği gösterir."
    ipucu: "Dosyanın sonunu canlı izleyen seçeneği hatırla."
  - soru: "`/etc/passwd` dosyasında `backup:x:34:34:backup:/var/backups:/usr/sbin/nologin` satırı var. Bu hesap için hangisi doğrudur?"
    secenekler: [ "Parolası bu dosyada düz metin olarak saklanıyor", "Bir servis hesabıdır, oturum açılamaz", "Root yetkisine sahiptir", "Ev dizini `/usr/sbin/nologin` dizinidir" ]
    dogru: 1
    aciklama: "Kabuk alanı `nologin` olduğu için hesapla oturum açılmaz. `x` parolanın `/etc/shadow`da olduğunu söyler; root'un UID'si 0'dır."
    ipucu: "`passwd` satırında kabuk alanındaki programın adına bak."
  - soru: "Bir dosyanın `ls -l` çıktısı `-rwxr-x---`. Sayısal izni nedir?"
    secenekler: [ "`750`", "`755`", "`640`", "`570`" ]
    dogru: 0
    aciklama: "Sahip rwx = 7, grup r-x = 5, diğerleri --- = 0. `755` olsaydı diğerleri de okuyup çalıştırabilirdi."
    ipucu: "Üç rakamı sahip, grup, diğerleri diye ayır ve her harfin değerini topla."
  - soru: "Bir SSH özel anahtar dosyasının izni `644`. Doğru değerlendirme hangisi?"
    secenekler: [ "Sorun yok, çünkü yalnız sahibi yazabiliyor", "Anahtar için `777` en güvenli değerdir", "Dosya çalıştırılabilir olduğu için tehlikelidir", "Grup ve diğer kullanıcılar da anahtarı okuyabiliyor; `chmod 600` gerekir" ]
    dogru: 3
    aciklama: "`644` herkese okuma izni verir; özel anahtar sızmış sayılır. `600` yalnız sahibine okuma ve yazma verir."
    ipucu: "Özel anahtarı kimlerin okuyabilmesi gerektiğini düşün."
  - soru: "Bir dizinde `x` izni olmayan bir kullanıcı ne yapamaz?"
    secenekler: [ "Dizini sadece kopyalayabilir", "Dizinin adını görüntüleyemez", "Dizinin içine giremez ve içindeki dosyalara adıyla erişemez", "Hiçbir kısıtlama yoktur" ]
    dogru: 2
    aciklama: "Dizinde `x` (çalıştırma) izni içine girmeyi ve dosyalara yol boyunca erişmeyi sağlar. `r` listelemek, `w` dosya oluşturmak/silmek içindir."
    ipucu: "Dizin için `x` izninin neyi mümkün kıldığını hatırla."
  - soru: "Ubuntu'da `cat /etc/shadow` 'Permission denied' veriyor. Doğru yaklaşım hangisi?"
    secenekler: [ "`chmod 777 /etc/shadow` çalıştırmak", "Gerçekten gerekiyorsa `sudo` ile yalnız o komutu çalıştırmak", "Root hesabıyla parolasız oturum açmak", "Dosyayı silmek" ]
    dogru: 1
    aciklama: "Parola özetleri bilerek kısıtlıdır. İhtiyaç varsa `sudo` komutu yükseltir ve kayıt bırakır. İzni açmak güvenliği bozar."
    ipucu: "İzni açmak ile yetkiyi tek komutla yükseltmek arasındaki farkı düşün."
  - soru: "`sudo` yapılandırmasını düzenlerken neden `visudo` önerilir?"
    secenekler: [ "Sözdizimini kaydetmeden önce denetler; bozuk dosya sudo'yu kullanılamaz yapabilir", "Dosyayı şifreler", "Daha hızlı açıldığı için", "Root parolasını sıfırlar" ]
    dogru: 0
    aciklama: "Hatalı bir sudoers dosyası sudo'yu işlevsiz bırakabilir. `visudo` kaydetmeden önce hatayı yakalar."
    ipucu: "Bozuk bir sudoers dosyasının sonucunu düşün."
  - soru: "Bir komutun hata mesajlarını `hatalar.txt` dosyasına, normal çıktısını ekrana yazdırmak için hangisini kullanırsın?"
    secenekler: [ "`komut > hatalar.txt`", "`komut >> 2 hatalar.txt`", "`komut | hatalar.txt`", "`komut 2> hatalar.txt`" ]
    dogru: 3
    aciklama: "`2>` stderr'i (akış 2) yönlendirir. `>` yalnız stdout'u yönlendirir; `|` bir dosyaya değil başka bir komuta bağlar."
    ipucu: "Hata akışının numarasını hatırla."
  - soru: "Bir log dosyasında IP başına denemeleri sayıp en çoktan aza sıralamak istiyorsun. IP'leri çıkardıktan sonra hangi zincir doğrudur?"
    secenekler: [ "`uniq -c | sort -rn`", "`sort -rn | uniq`", "`sort | uniq -c | sort -rn`", "`wc -l | sort`" ]
    dogru: 2
    aciklama: "`uniq` yalnız bitişik aynı satırları birleştirir; önce `sort` gerekir. `uniq -c` sayar, son `sort -rn` en çoktan aza dizer."
    ipucu: "`uniq`'in hangi satırları birleştirdiğini ve ondan önce ne gerektiğini düşün."
  - soru: "`/etc` altında içinde 'parola' geçen dosyaları ve satır numaralarını bulmak istiyorsun, büyük-küçük harf fark etmesin. Hangi komut uygundur?"
    secenekler: [ "`find /etc -name parola`", "`grep -rin parola /etc 2> /dev/null`", "`ls -a /etc | parola`", "`cat /etc | grep -v parola`" ]
    dogru: 1
    aciklama: "`-r` alt dizinleri tarar, `-i` harf farkını yok sayar, `-n` satır numarası yazar. `find -name` dosya adına bakar, içeriğe değil."
    ipucu: "Dosya içeriğini aramak ile dosya adını aramak farklı araçlar."
  - soru: "`find /usr/bin -perm -4000 -type f` neyi listeler ve neden önemlidir?"
    secenekler: [ "Setuid bitli programları; sahibinin yetkisiyle çalıştıkları için denetlenir", "Son 4000 saniyede değişen dosyaları", "Herkesin yazabildiği dosyaları", "4000 baytlık dosyaları" ]
    dogru: 0
    aciklama: "`-perm -4000` setuid bitini arar. Root'a ait setuid programlar yetki yükseltme riski taşır; beklenmedik bir üye alarm sebebidir."
    ipucu: "`-perm -4000` hangi özel biti arıyor?"
  - soru: "Bir süreç `kill 4321` ile kapanmıyor. Sıra nasıl olmalı?"
    secenekler: [ "Önce `kill -9 4321`, sonra `kill 4321`", "`rm /proc/4321`", "Bilgisayarı yeniden başlatmak", "Önce `kill 4321` (SIGTERM), kapanmazsa `kill -9 4321` (SIGKILL)" ]
    dogru: 3
    aciklama: "SIGTERM sürece temizlik yapma şansı verir. SIGKILL yakalanamaz ve süreç temizlik yapamaz; son çare olarak kullanılır."
    ipucu: "Önce nazik, sonra zorla: hangi sinyal hangisi?"
  - soru: "Bir sunucuda `ps aux` çıktısında `www-data` kullanıcısına ait, %99 CPU kullanan tanımadığın bir `./miner` süreci var. İlk yaklaşım ne olmalı?"
    secenekler: [ "Hiçbir şey yapmamak, çünkü servis hesabı güvenilirdir", "Sunucudaki tüm dosyaları `rm -r` ile silmek", "Bilgileri (komut, dosya yolu, PID) kaydedip süreci durdurmak ve nasıl başladığını araştırmak", "Yalnız süreci sessizce `kill -9` yapıp konuyu kapatmak" ]
    dogru: 2
    aciklama: "Servis hesabında beklenmeyen bir program ele geçirilme belirtisidir. Kanıtı kaydet, durdur, kaynağı (log, zamanlanmış görev) bul. Kanıtsız silmek incelemeyi zorlaştırır."
    ipucu: "Servis hesabında beklenmeyen bir program neyin belirtisi? Kanıtı ne yapmalısın?"
  - soru: "`sudo apt update` ve `sudo apt upgrade` arasındaki fark nedir?"
    secenekler: [ "İkisi aynı işi yapar", "`update` paket listesini yeniler, `upgrade` kurulu paketleri günceller", "`update` sistemi yeniden başlatır, `upgrade` paketleri siler", "`upgrade` yalnız çekirdeği günceller" ]
    dogru: 1
    aciklama: "`update` depodaki güncel paket bilgilerini indirir ve yazılım kurmaz; `upgrade` o bilgilere göre kurulu paketleri günceller."
    ipucu: "`update` ile `upgrade`'in neyi güncellediğini ayır."
  - soru: "`systemctl status ssh` çıktısında `active (running)` ve `disabled` yazıyor. Ne anlama gelir?"
    secenekler: [ "Servis çalışıyor ama açılışta otomatik başlamaz", "Servis durmuş ve açılışta başlayacak", "Servis kaldırılmış", "Servis hem çalışıyor hem açılışta başlayacak" ]
    dogru: 0
    aciklama: "`active (running)` şu anki durumu, `enabled/disabled` açılışta otomatik başlama ayarını söyler; ikisi bağımsızdır."
    ipucu: "`active` ile `enabled` ayrı ayrı neyi anlatıyor?"
  - soru: "Bir logda şu satırı gördün: `Failed password for invalid user admin from 203.0.113.5 port 52114 ssh2`. Bu satırdan çıkarım hangisidir?"
    secenekler: [ "`52114` kullanıcının UID'sidir", "`admin` kullanıcısı başarıyla giriş yapmış", "Sunucu `203.0.113.5` adresine bağlanmaya çalışmış", "`203.0.113.5` adresinden sistemde olmayan `admin` kullanıcısıyla parola denenmiş ve başarısız olmuş" ]
    dogru: 3
    aciklama: "`Failed password` başarısız deneme, `invalid user` hesabın olmadığı, `from` kaynak IP demektir. Çok sayıda böyle satır kaba kuvvet işaretidir. Başarılı giriş `Accepted` ile görünür."
    ipucu: "Satırdaki `Failed`, `invalid user` ve `from` sözcüklerini tek tek oku."
  - soru: "Bir betikte `rm -rf \"$DIR\"/tmp` var ve `DIR` tanımsız. Betikte `set -u` varsa ne olur?"
    secenekler: [ "`rm -rf /tmp` çalışır", "Hiçbir şey olmaz, komut sessizce atlanır", "Kabuk tanımsız değişken hatası verip betiği durdurur", "Kök dizin silinir" ]
    dogru: 2
    aciklama: "`set -u` tanımsız değişkende hata verir ve betik durur. Olmasaydı `$DIR` boş sayılır ve komut yanlış yolu silebilirdi."
    ipucu: "Tanımsız değişken boş sayılırsa komut neye dönüşür?"
---
