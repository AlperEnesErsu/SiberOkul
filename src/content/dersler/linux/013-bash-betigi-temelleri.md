---
kimlik: linux-013
baslik: "Bash betiği temelleri"
donem: 1
sira: 13
sure: 40
neden: "CI/CD adımları, kurulum işleri, yedekleme ve log özetleri küçük Bash betikleriyle otomatikleştirilir. Hatalı yazılmış bir betik sessizce yanlış sonuç üretebilir ya da yıkıcı komutu yanlış dizinde çalıştırabilir. Güvenli betik alışkanlıkları bu yüzden bir mühendislik becerisidir."
analoji:
  baslik: "Yemek tarifi"
  metin: "Betik bir tariftir: malzeme listesi (değişkenler), 'tuz yoksa komşudan al' (if) ve 'her tabak için bir kez tekrarla' (for) gibi adımlardan oluşur. Tarif ne kadar açık yazılırsa, aşçı değişse de sonuç aynı olur. Sınır: insan aşçı tarifte bir şey eksikse durup sorar; kabuk ise sormaz, yazdığın hatayı aynen uygular. `set -euo pipefail` onu daha dikkatli yapar."
gorev:
  aciklama: "Küçük bir örnek log dosyası ve onu özetleyen bir betik oluşturup çalıştıracaksın. Her şey `/tmp/lab013` altında; zararsızdır."
  komutlar:
    - mkdir -p /tmp/lab013
    - cd /tmp/lab013
    - |-
      echo 'Nov 25 10:00:01 sunucu sshd[1]: Failed password for invalid user admin from 203.0.113.5 port 1 ssh2' > ornek.log
    - |-
      echo 'Nov 25 10:00:05 sunucu sshd[2]: Failed password for root from 203.0.113.5 port 2 ssh2' >> ornek.log
    - |-
      echo 'Nov 25 10:01:10 sunucu sshd[3]: Failed password for invalid user test from 198.51.100.7 port 3 ssh2' >> ornek.log
    - |-
      echo 'Nov 25 10:02:00 sunucu sshd[4]: Accepted publickey for alper from 192.0.2.10 port 4 ssh2' >> ornek.log
    - |-
      cat > ozet.sh <<'EOF'
      #!/usr/bin/env bash
      set -euo pipefail
      log="${1:?Kullanim: $0 log-dosyasi}"
      if [ ! -f "$log" ]; then
        echo "Dosya yok: $log" >&2
        exit 1
      fi
      toplam=$(grep -c 'Failed password' "$log" || true)
      echo "Basarisiz giris sayisi: $toplam"
      for ip in $(grep 'Failed password' "$log" | awk '{print $(NF-3)}' | sort -u); do
        sayi=$(grep -c "from $ip " "$log")
        echo "$ip -> $sayi deneme"
      done
      EOF
    - chmod +x ozet.sh
    - ./ozet.sh ornek.log
    - ./ozet.sh yok.log
    - cd /tmp
    - rm -r /tmp/lab013
  soru: "`./ozet.sh yok.log` neden hata mesajı yazıp durdu ve `$?` değeri kaç? `set -u` olmasaydı `log` değişkeni boş kalınca ne olurdu?"
  telefon:
    soru: "Betikte `rm -rf $DIZIN/tmp` var ve `DIZIN` değişkeni tanımlanmayı unutuldu. `set -u` yoksa ve varsa ne olur?"
    cevap: "`set -u` yoksa `$DIZIN` boş sayılır ve komut `rm -rf /tmp` olur: istemediğin bir dizini silersin. `set -u` varsa kabuk tanımsız değişkende hata verip betiği durdurur ve hiçbir şey silinmez."
sorular:
  - id: linux-013-s1
    soru: "Betiğin ilk satırındaki `#!/usr/bin/env bash` (shebang) ne işe yarar?"
    cevap: "Betiğin hangi yorumlayıcıyla çalıştırılacağını söyler. Dosya çalıştırılabilir yapılıp `./betik.sh` olarak başlatılınca sistem bu satıra bakıp betiği bash'e verir."
  - id: linux-013-s2
    soru: "`set -euo pipefail` içindeki üç parçayı ayrı ayrı açıkla."
    cevap: "`-e` bir komut hata (sıfırdan farklı çıkış kodu) verirse betiği durdurur. `-u` tanımsız bir değişken kullanılırsa hata verir. `-o pipefail` boru hattında herhangi bir komut hata verirse tüm hattı hatalı sayar; yoksa yalnız sondaki komutun sonucuna bakılır."
  - id: linux-013-s3
    soru: "`rm -rf $DIR/*` yazan bir betikte neden `$DIR`'i tırnak içine alıp varlığını kontrol etmelisin?"
    cevap: "Değişken boşsa ya da boşluk içeriyorsa komut yanlış yolları siler (`/*` gibi). `\"$DIR\"` boşluklu adlarda parçalanmayı önler; `set -u` ve bir `if [ -d \"$DIR\" ]` kontrolü de tanımsız ya da yanlış değeri yakalar."
  - id: linux-013-s4
    soru: "Bir komutun çıkış kodu nedir ve `$?` neyi gösterir?"
    cevap: "Her komut bittiğinde bir sayı döndürür: 0 başarı, başka bir sayı hata demektir. `$?` son komutun çıkış kodunu tutar. `if`, `&&` ve `set -e` bu koda göre karar verir."
derinDalis:
  - tur: kitap
    baslik: "The Linux Command Line (William Shotts)"
    ayrinti: "Shell scripting bölümleri: değişkenler, `if`, döngüler ve hata ayıklama."
    url: "https://linuxcommand.org/tlcl.php"
  - tur: okuma
    baslik: "GNU Bash Kılavuzu: The Set Builtin"
    ayrinti: "`set -e`, `-u` ve `-o pipefail` seçeneklerinin resmi tanımı."
---

**Betik** (script), art arda çalışacak komutları bir dosyaya yazıp tek komutla çalıştırmandır. Bash betikleri CI adımlarının, kurulum işlerinin ve log özetlerinin temelidir.

### İlk betik

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "Merhaba, $USER"
```

- `#!/usr/bin/env bash` (**shebang**): bu dosyanın bash ile çalışacağını söyler.
- `set -euo pipefail`: güvenli çalışma modu (aşağıda).
- Çalıştırmak için `chmod +x betik.sh`, sonra `./betik.sh`.

### Değişkenler

```bash
isim="alper"          # eşittir etrafında boşluk YOK
echo "Merhaba $isim"
sayi=$(wc -l < dosya) # komut çıktısını değişkene al
```

Değişken kullanırken tırnak içine al: `"$isim"`. Aksi halde boşluk içeren değerler parçalanır. Betiğe verilen argümanlar `$1`, `$2` ile gelir; `$0` betiğin adıdır.

### if ve for

```bash
if [ -f "$dosya" ]; then
  echo "dosya var"
else
  echo "dosya yok" >&2
fi

for ip in 10.0.0.1 10.0.0.2; do
  echo "$ip kontrol ediliyor"
done
```

`[ -f x ]` dosya mı, `[ -d x ]` dizin mi, `[ -z "$x" ]` boş mu diye bakar. `>&2` mesajı hata akışına (008. ders) gönderir.

### Çıkış kodu

Her komut bir **çıkış kodu** döner: 0 başarı, diğerleri hata. `$?` son komutunkini verir. `exit 1` betiği hata koduyla bitirir. CI sistemleri adımın başarılı olup olmadığına bu koda bakar.

### set -euo pipefail neden?

Varsayılan bash hataları görmezden gelip devam eder. Üç ayar bunu değiştirir:

- `-e`: bir komut hata verirse betiği durdur.
- `-u`: tanımsız değişken kullanılırsa hata ver.
- `-o pipefail`: boru hattında herhangi bir adım hata verirse hattı hatalı say.

Bu, `rm -rf "$DIR"/tmp` gibi satırlarda `DIR` boşsa yanlış yeri silmeyi engeller. Not: `grep -c` hiç eşleşme bulamayınca 1 döner. `-e` açıkken beklenen bir "bulunamadı" durumunu `|| true` ile karşılamak gerekir.

### Ders görevindeki mini araç

Görevde 008, 009 ve 012. derslerin parçalarını birleştirip bir log özeti çıkaran betik yazıyorsun: başarısız giriş sayısını ve IP başına denemeleri sayar. Böyle bir betik, zamanla loglar üzerinde otomatik kontrol yapan bir araca dönüşür.

Güvenlik notu: Betikte kullanıcıdan ya da dosyadan gelen değeri hiçbir zaman tırnaksız komuta verme ve internetten kopyaladığın betiği çalıştırmadan önce oku. Silme komutlarından önce değişkenin dolu olduğunu ve beklediğin dizini gösterdiğini kontrol et.
