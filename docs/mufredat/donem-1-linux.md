# Dönem 1 — Linux + Bash (40 ders)

Zamanlanmış görev sıradaki yayımlanmamış dersi bu listeden yazar. Numaralar yayımlandıktan sonra
değişmez; araya ders gerekirse listenin sonuna yeni numarayla eklenir.

Biçim: `NNN · Başlık — tek satır amaç`

## Kabuğa giriş
001 · Ubuntu'ya merhaba — WSL'de Ubuntu'yu açmak, istem satırını okumak, `pwd`, `whoami`, `ls`.
002 · Dizin ağacında gezinmek — `cd`, mutlak ve göreli yol, `~`, `..`, `ls -a` ile gizli dosyalar.
003 · Sistemi keşfetmek — `ls -l` çıktısını okumak, `file`, `less` ile dosya görüntülemek.
004 · Linux dizin haritası — `/etc`, `/home`, `/var`, `/tmp`, `/usr`, `/proc`: neyin nerede durduğu.
005 · Yardım almak — `man`, `--help`, `type`, `which`, `apropos`.

## Dosyalarla çalışmak
006 · Dosya ve dizin oluşturmak — `touch`, `mkdir -p`, `echo >`.
007 · Kopyalamak, taşımak, silmek — `cp`, `mv`, `rm`, `rm -r` ve neden geri dönüşüm kutusu yok.
008 · Joker karakterler — `*`, `?`, `[ ]` ile çok dosyayı birden seçmek.
009 · Bağlantılar — sert ve sembolik bağlantı (`ln`, `ln -s`), inode fikri.
010 · Metin dosyasını görüntülemek — `cat`, `head`, `tail`, `tail -f`.
011 · Terminalde metin düzenlemek — `nano` temel kullanım.

## Kim neye dokunabilir
012 · Kullanıcılar ve gruplar — `id`, `/etc/passwd`, `/etc/group`.
013 · Dosya izinleri — `rwx`, sahibi/grup/diğerleri, `ls -l` izin sütunu.
014 · İzinleri değiştirmek — `chmod` (sembolik ve sayısal), `chown`.
015 · `sudo` ve root — en az yetki ilkesi, neden her şeyi root ile yapmıyoruz.
016 · Özel izinler — `setuid`, `setgid`, yapışkan bit; `/tmp` neden yapışkan.
017 · `umask` — yeni dosyaların varsayılan izinleri.

## Komutları birleştirmek
018 · Girdi, çıktı, hata akışları — `stdin`, `stdout`, `stderr`, `>`, `>>`, `2>`.
019 · Boru hattı — `|` ile komut zinciri, `wc`, `sort`, `uniq`.
020 · Metin aramak — `grep`, `grep -r`, `grep -i`, `grep -v`.
021 · Dosya aramak — `find` ad, tür, boyut, izin ölçütleriyle.
022 · Metni kesip biçmek — `cut`, `tr`, `sed` ile basit değiştirme.
023 · `awk`'a ilk bakış — sütun seçmek, log satırlarını özetlemek.

## Sistem nasıl çalışır
024 · Süreçler — `ps`, `top`/`htop`, PID ve üst süreç.
025 · Süreçleri yönetmek — sinyaller, `kill`, `&`, `jobs`, `fg`.
026 · Paket yönetimi — `apt update`, `apt install`, depolar ve güven.
027 · Servisler — `systemd`, `systemctl status/start/enable`.
028 · Loglar — `journalctl`, `/var/log`, `auth.log` ile giriş denemelerini görmek.
029 · Disk ve bellek — `df`, `du`, `free`.
030 · Ortam değişkenleri — `env`, `PATH`, `export`, `~/.bashrc`.

## Bash betikleri
031 · İlk betik — shebang, çalıştırma izni, `./betik.sh`.
032 · Değişkenler ve argümanlar — `$1`, `$@`, tırnak kuralları.
033 · Koşullar — `if`, `test`, çıkış kodu `$?`.
034 · Döngüler — `for`, `while`, dosyalar üzerinde döngü.
035 · Fonksiyonlar ve hata yönetimi — `set -euo pipefail`.

## Uzak makineler ve otomasyon
036 · SSH ile bağlanmak — `ssh`, ilk Bandit seviyesi (bandit0).
037 · SSH anahtarları — `ssh-keygen`, açık/gizli anahtar, parolasız giriş.
038 · Zamanlanmış işler — `cron`, `crontab -e`.
039 · Mini proje I — `auth.log` benzeri bir dosyadan başarısız girişleri sayan betik.
040 · Mini proje II — betiği cron'a bağlamak, rapor dosyası üretmek; LogSentry'ye köprü.
