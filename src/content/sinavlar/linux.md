---
donem: 1
baslik: "Linux + Bash bölgesi sınavı"
sorular:
  - soru: "İstem satırın `ayse@lab:~$` ve `pwd` komutu `/home/ayse` yazdırıyor. Buradan ne anlarsın?"
    secenekler: ["`~` işareti ev dizinini gösterir ve Ayşe ev dizinindedir", "Ayşe root kullanıcısıdır", "`lab` kullanıcının adıdır, `ayse` makinenin adıdır", "`$` işareti dizinin boş olduğunu gösterir"]
    dogru: 0
    aciklama: "`~` ev dizinin için kısaltmadır ve `/home/ayse` ile aynı yeri gösterir. Root'ta `$` yerine `#` görünür; `ayse` kullanıcı, `lab` makine adıdır."
  - soru: "`/home/ayse/notlar` dizinindesin ve `../belgeler` yoluna gitmek istiyorsun. Bu yol neyi gösterir?"
    secenekler: ["`/belgeler`", "`/home/ayse/notlar/belgeler`", "`/home/belgeler`", "`/home/ayse/belgeler`"]
    dogru: 3
    aciklama: "`..` bir üst dizin demektir: `/home/ayse`. Onun altındaki `belgeler` dizini `/home/ayse/belgeler` olur. Göreli yol bulunduğun dizine göre çözülür."
  - soru: "Bir betiği test ederken `rm *.log` yazacaksın ama yanlış dizinde olabilirsin. En güvenli ilk adım hangisi?"
    secenekler: ["Hemen `rm *.log` çalıştırıp hata varsa geri almak", "`ls *.log` ile neyin eşleştiğine bakıp sonra silmek", "`rm -rf *` yazmak", "Dizinin adını değiştirmek"]
    dogru: 1
    aciklama: "Joker karakteri kabuk açar; aynı desenle `ls` çalıştırmak neyin silineceğini gösterir. `rm` geri alınamaz, çöp kutusu yoktur."
  - soru: "Bir uygulama hata veriyor ve log dosyasına yazıyor. Hatayı tetikleyip aynı anda mesajı görmek istiyorsun. Hangi komut uygundur?"
    secenekler: ["`cat /var/log/uygulama.log`", "`head -n 5 /var/log/uygulama.log`", "`man uygulama`", "`tail -f /var/log/uygulama.log`"]
    dogru: 3
    aciklama: "`tail -f` dosyanın sonunu açık tutar ve yeni satırları gelir gelmez yazar. `cat` ve `head` yalnız o anki içeriği gösterir."
  - soru: "`/etc/passwd` dosyasında `backup:x:34:34:backup:/var/backups:/usr/sbin/nologin` satırı var. Bu hesap için hangisi doğrudur?"
    secenekler: ["Parolası bu dosyada düz metin olarak saklanıyor", "Bir servis hesabıdır, oturum açılamaz", "Root yetkisine sahiptir", "Ev dizini `/usr/sbin/nologin` dizinidir"]
    dogru: 1
    aciklama: "Kabuk alanı `nologin` olduğu için hesapla oturum açılmaz. `x` parolanın `/etc/shadow`da olduğunu söyler; root'un UID'si 0'dır."
  - soru: "Bir dosyanın `ls -l` çıktısı `-rwxr-x---`. Sayısal izni nedir?"
    secenekler: ["`755`", "`750`", "`640`", "`570`"]
    dogru: 1
    aciklama: "Sahip rwx = 7, grup r-x = 5, diğerleri --- = 0. `755` olsaydı diğerleri de okuyup çalıştırabilirdi."
  - soru: "Bir SSH özel anahtar dosyasının izni `644`. Doğru değerlendirme hangisi?"
    secenekler: ["Sorun yok, çünkü yalnız sahibi yazabiliyor", "Grup ve diğer kullanıcılar da anahtarı okuyabiliyor; `chmod 600` gerekir", "Dosya çalıştırılabilir olduğu için tehlikelidir", "Anahtar için `777` en güvenli değerdir"]
    dogru: 1
    aciklama: "`644` herkese okuma izni verir; özel anahtar sızmış sayılır. `600` yalnız sahibine okuma ve yazma verir."
  - soru: "Bir dizinde `x` izni olmayan bir kullanıcı ne yapamaz?"
    secenekler: ["Dizinin içine giremez ve içindeki dosyalara adıyla erişemez", "Dizinin adını görüntüleyemez", "Dizini sadece kopyalayabilir", "Hiçbir kısıtlama yoktur"]
    dogru: 0
    aciklama: "Dizinde `x` (çalıştırma) izni içine girmeyi ve dosyalara yol boyunca erişmeyi sağlar. `r` listelemek, `w` dosya oluşturmak/silmek içindir."
  - soru: "Ubuntu'da `cat /etc/shadow` 'Permission denied' veriyor. Doğru yaklaşım hangisi?"
    secenekler: ["`chmod 777 /etc/shadow` çalıştırmak", "Root hesabıyla parolasız oturum açmak", "Gerçekten gerekiyorsa `sudo` ile yalnız o komutu çalıştırmak", "Dosyayı silmek"]
    dogru: 2
    aciklama: "Parola özetleri bilerek kısıtlıdır. İhtiyaç varsa `sudo` komutu yükseltir ve kayıt bırakır. İzni açmak güvenliği bozar."
  - soru: "`sudo` yapılandırmasını düzenlerken neden `visudo` önerilir?"
    secenekler: ["Daha hızlı açıldığı için", "Dosyayı şifreler", "Sözdizimini kaydetmeden önce denetler; bozuk dosya sudo'yu kullanılamaz yapabilir", "Root parolasını sıfırlar"]
    dogru: 2
    aciklama: "Hatalı bir sudoers dosyası sudo'yu işlevsiz bırakabilir. `visudo` kaydetmeden önce hatayı yakalar."
  - soru: "Bir komutun hata mesajlarını `hatalar.txt` dosyasına, normal çıktısını ekrana yazdırmak için hangisini kullanırsın?"
    secenekler: ["`komut > hatalar.txt`", "`komut 2> hatalar.txt`", "`komut | hatalar.txt`", "`komut >> 2 hatalar.txt`"]
    dogru: 1
    aciklama: "`2>` stderr'i (akış 2) yönlendirir. `>` yalnız stdout'u yönlendirir; `|` bir dosyaya değil başka bir komuta bağlar."
  - soru: "Bir log dosyasında IP başına denemeleri sayıp en çoktan aza sıralamak istiyorsun. IP'leri çıkardıktan sonra hangi zincir doğrudur?"
    secenekler: ["`uniq -c | sort -rn`", "`sort | uniq -c | sort -rn`", "`sort -rn | uniq`", "`wc -l | sort`"]
    dogru: 1
    aciklama: "`uniq` yalnız bitişik aynı satırları birleştirir; önce `sort` gerekir. `uniq -c` sayar, son `sort -rn` en çoktan aza dizer."
  - soru: "`/etc` altında içinde 'parola' geçen dosyaları ve satır numaralarını bulmak istiyorsun, büyük-küçük harf fark etmesin. Hangi komut uygundur?"
    secenekler: ["`find /etc -name parola`", "`grep -rin parola /etc 2> /dev/null`", "`ls -a /etc | parola`", "`cat /etc | grep -v parola`"]
    dogru: 1
    aciklama: "`-r` alt dizinleri tarar, `-i` harf farkını yok sayar, `-n` satır numarası yazar. `find -name` dosya adına bakar, içeriğe değil."
  - soru: "`find /usr/bin -perm -4000 -type f` neyi listeler ve neden önemlidir?"
    secenekler: ["Herkesin yazabildiği dosyaları", "Son 4000 saniyede değişen dosyaları", "Setuid bitli programları; sahibinin yetkisiyle çalıştıkları için denetlenir", "4000 baytlık dosyaları"]
    dogru: 2
    aciklama: "`-perm -4000` setuid bitini arar. Root'a ait setuid programlar yetki yükseltme riski taşır; beklenmedik bir üye alarm sebebidir."
  - soru: "Bir süreç `kill 4321` ile kapanmıyor. Sıra nasıl olmalı?"
    secenekler: ["Önce `kill -9 4321`, sonra `kill 4321`", "Önce `kill 4321` (SIGTERM), kapanmazsa `kill -9 4321` (SIGKILL)", "Bilgisayarı yeniden başlatmak", "`rm /proc/4321`"]
    dogru: 1
    aciklama: "SIGTERM sürece temizlik yapma şansı verir. SIGKILL yakalanamaz ve süreç temizlik yapamaz; son çare olarak kullanılır."
  - soru: "Bir sunucuda `ps aux` çıktısında `www-data` kullanıcısına ait, %99 CPU kullanan tanımadığın bir `./miner` süreci var. İlk yaklaşım ne olmalı?"
    secenekler: ["Hiçbir şey yapmamak, çünkü servis hesabı güvenilirdir", "Bilgileri (komut, dosya yolu, PID) kaydedip süreci durdurmak ve nasıl başladığını araştırmak", "Sunucudaki tüm dosyaları `rm -r` ile silmek", "Yalnız süreci sessizce `kill -9` yapıp konuyu kapatmak"]
    dogru: 1
    aciklama: "Servis hesabında beklenmeyen bir program ele geçirilme belirtisidir. Kanıtı kaydet, durdur, kaynağı (log, zamanlanmış görev) bul. Kanıtsız silmek incelemeyi zorlaştırır."
  - soru: "`sudo apt update` ve `sudo apt upgrade` arasındaki fark nedir?"
    secenekler: ["İkisi aynı işi yapar", "`update` paket listesini yeniler, `upgrade` kurulu paketleri günceller", "`update` sistemi yeniden başlatır, `upgrade` paketleri siler", "`upgrade` yalnız çekirdeği günceller"]
    dogru: 1
    aciklama: "`update` depodaki güncel paket bilgilerini indirir ve yazılım kurmaz; `upgrade` o bilgilere göre kurulu paketleri günceller."
  - soru: "`systemctl status ssh` çıktısında `active (running)` ve `disabled` yazıyor. Ne anlama gelir?"
    secenekler: ["Servis çalışıyor ama açılışta otomatik başlamaz", "Servis durmuş ve açılışta başlayacak", "Servis kaldırılmış", "Servis hem çalışıyor hem açılışta başlayacak"]
    dogru: 0
    aciklama: "`active (running)` şu anki durumu, `enabled/disabled` açılışta otomatik başlama ayarını söyler; ikisi bağımsızdır."
  - soru: "Bir logda şu satırı gördün: `Failed password for invalid user admin from 203.0.113.5 port 52114 ssh2`. Bu satırdan çıkarım hangisidir?"
    secenekler: ["`203.0.113.5` adresinden sistemde olmayan `admin` kullanıcısıyla parola denenmiş ve başarısız olmuş", "`admin` kullanıcısı başarıyla giriş yapmış", "Sunucu `203.0.113.5` adresine bağlanmaya çalışmış", "`52114` kullanıcının UID'sidir"]
    dogru: 0
    aciklama: "`Failed password` başarısız deneme, `invalid user` hesabın olmadığı, `from` kaynak IP demektir. Çok sayıda böyle satır kaba kuvvet işaretidir. Başarılı giriş `Accepted` ile görünür."
  - soru: "Bir betikte `rm -rf \"$DIR\"/tmp` var ve `DIR` tanımsız. Betikte `set -u` varsa ne olur?"
    secenekler: ["`rm -rf /tmp` çalışır", "Hiçbir şey olmaz, komut sessizce atlanır", "Kabuk tanımsız değişken hatası verip betiği durdurur", "Kök dizin silinir"]
    dogru: 2
    aciklama: "`set -u` tanımsız değişkende hata verir ve betik durur. Olmasaydı `$DIR` boş sayılır ve komut yanlış yolu silebilirdi."
---
