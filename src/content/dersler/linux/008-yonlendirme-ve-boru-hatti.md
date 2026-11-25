---
kimlik: linux-008
baslik: "Yönlendirme ve boru hattı"
donem: 1
sira: 8
sure: 35
neden: "Bir sunucu günde yüz binlerce log satırı üretir. Aradığını bulmak için komutları birbirine bağlamak, çıktıyı dosyaya yazmak ve hataları ayırmak gerekir. Bu dersin kalıpları, ileride log analizi, CI betikleri ve olay incelemede her gün kullanılır."
analoji:
  baslik: "Fabrika bandı"
  metin: "Her komut bir makinedir: girişten ham madde alır, çıkıştan ürün verir. Boru (`|`) bir makinenin çıkışını bir sonrakinin girişine bağlayan banttır. `>` ise ürünü bandın sonunda bir kutuya (dosyaya) koymaktır. Hatalı ürünler ayrı bir kanaldan (stderr) çıkar. Sınır: banttaki her makine kendi başına çalışır; birinde hata olsa bile bant devam edebilir, bu yüzden betiklerde ek önlem alırız (013. ders)."
gorev:
  aciklama: "`/tmp` altında çalışıp çıktıları dosyalara yönlendireceksin ve kabuk satırındaki kullanıcıların hangi kabuğu kullandığını sayacaksın."
  komutlar:
    - mkdir -p /tmp/lab008
    - cd /tmp/lab008
    - ls /etc > etc-listesi.txt
    - wc -l etc-listesi.txt
    - echo "ikinci satır" >> notlar.txt
    - ls /olmayan-dizin 2> hata.txt
    - cat hata.txt
    - ls /etc /olmayan-dizin > cikti.txt 2> /dev/null
    - "cut -d: -f7 /etc/passwd | sort | uniq -c | sort -rn"
    - cd /tmp
    - rm -r /tmp/lab008
  soru: "`ls /olmayan-dizin 2> hata.txt` komutunu çalıştırdığında ekranda neden hiçbir şey görünmedi? Hata mesajı nerede?"
  telefon:
    soru: "`cut -d: -f7 /etc/passwd | sort | uniq -c | sort -rn` komutunun çıktısında en üstte `18 /usr/sbin/nologin` yazıyor. Bu ne demek?"
    cevap: "Sistemde kabuğu `/usr/sbin/nologin` olan 18 hesap var; yani oturum açılamayan 18 servis hesabı. `cut` yedinci alanı (kabuk) alır, `sort` eşitleri yan yana getirir, `uniq -c` sayar, son `sort -rn` en kalabalığı en üste koyar."
sorular:
  - id: linux-008-s1
    soru: "`>` ile `>>` arasındaki fark nedir? Hangisini yanlışlıkla kullanmak veri kaybettirir?"
    cevap: "`>` dosyayı sıfırlayıp üzerine yazar, `>>` sona ekler. Mevcut bir log ya da notu `>` ile yönlendirirsen eski içerik silinir; bu yüzden ekleme niyetindeysen `>>` kullan."
    ipucu: "`>` ve `>>`'ın dosyaya ne yaptığını karşılaştır."
  - id: linux-008-s2
    soru: "stdin, stdout ve stderr nedir? Numaraları kaçtır?"
    cevap: "Her programın üç standart akışı vardır: stdin (0) girdi, stdout (1) normal çıktı, stderr (2) hata mesajları. `>` stdout'u, `2>` stderr'i yönlendirir. İkisinin ayrı olması, hataları normal çıktıdan ayırmayı mümkün kılar."
    ipucu: "Üç akışın numaralarını say."
  - id: linux-008-s3
    soru: "`komut > dosya 2>&1` ne yapar?"
    cevap: "Önce stdout'u dosyaya yönlendirir, sonra stderr'i (2) stdout'un (1) gittiği yere, yani aynı dosyaya bağlar. Böylece hem normal çıktı hem hatalar tek dosyada toplanır. Sıralama önemlidir: `2>&1` önce yazılırsa hata hâlâ ekrana gider."
    ipucu: "Sıra önemli: önce hangisini yönlendiriyor?"
  - id: linux-008-s4
    soru: "`sort | uniq -c` birlikte neden kullanılır? Yalnız `uniq -c` yazsan ne olur?"
    cevap: "`uniq` yalnızca art arda gelen aynı satırları birleştirir. Önce `sort` ile aynı satırlar yan yana getirilmezse sayım yanlış çıkar. `sort | uniq -c`, her satırdan kaç tane olduğunu verir."
    ipucu: "`uniq`'in hangi satırları birleştirdiğini hatırla."
  - id: linux-008-s5
    soru: "Gece çalışan betiğin ekrana yazdığı hatalar kayboluyor. Hataları bir dosyada toplamak istiyorsun. Ne yazarsın?"
    cevap: "`betik.sh > cikti.log 2>&1` ile hem normal çıktıyı hem hatayı aynı dosyaya alırsın; yalnız hatalar için `2> hatalar.log` yeterlidir. Her çalıştırmada eski kayıt silinmesin diye `>>` kullanırsın."
    ipucu: "Hatalar hangi akıştan gidiyor?"
hizliKontrol:
  - soru: "`komut 2> hata.txt` neyi dosyaya yazar?"
    secenekler: ["stdout'u","stdin'i","stderr'i","Hepsini"]
    dogru: 2
    aciklama: "`2>` hata akışını (stderr) yönlendirir."
    ipucu: "2 numaralı akış hangisi?"
sikHatalar:
  - hata: "Önemli bir dosyaya `>` ile yönlendirip eski içeriği silmek."
    dogrusu: "Eklemek istiyorsan `>>` kullan."
  - hata: "`uniq -c`'yi `sort` olmadan kullanmak."
    dogrusu: "`uniq` yalnız bitişik satırları sayar; önce `sort`."
terimler:
  - "Standart akış"
  - "Yönlendirme"
  - "Boru hattı"
  - "Kabuk (shell)"
sema:
  baslik: "Boru hattı akışı"
  adimlar:
    - etiket: "Okuma"
      aciklama: "`cat log` dosyayı okur ve stdout'a yazar."
    - etiket: "Bağlama"
      aciklama: "`"
    - etiket: "` stdout'u sonraki komutun stdin'ine bağlar."
      aciklama: ""
    - etiket: "Sıralama"
      aciklama: "`sort` satırları sıralar."
    - etiket: "Sayma"
      aciklama: "`uniq -c` bitişik aynı satırları sayar."
    - etiket: "Sonuç"
      aciklama: "Son çıktı ekrana ya da `>` ile dosyaya yazılır."
derinDalis:
  - tur: kitap
    baslik: "The Linux Command Line (William Shotts)"
    ayrinti: "Redirection bölümü: standart girdi/çıktı yönlendirme ve boru hatları."
    url: "https://linuxcommand.org/tlcl.php"
  - tur: okuma
    baslik: "GNU Bash Kılavuzu: Yönlendirmeler"
    ayrinti: "Bash'in `>`, `>>`, `2>`, `&>` yönlendirmelerini tanımlayan resmi bölüm."
---

Her Linux programı üç **standart akışla** çalışır:

| Akış | Numara | Görevi |
|---|---|---|
| stdin | 0 | Girdi (varsayılan: klavye) |
| stdout | 1 | Normal çıktı (varsayılan: ekran) |
| stderr | 2 | Hata mesajları (varsayılan: ekran) |

Varsayılan olarak üçü de terminale bağlıdır. **Yönlendirme** (redirection) bu akışları dosyalara ya da başka programlara çevirmektir.

### Dosyaya yönlendirme

```
ls /etc > liste.txt        # stdout'u dosyaya yaz (üzerine yazar)
echo "yeni" >> liste.txt   # dosyanın sonuna ekle
ls /yok 2> hata.txt        # yalnız hata mesajlarını dosyaya yaz
komut > hepsi.txt 2>&1     # hem çıktı hem hata aynı dosyaya
komut 2> /dev/null         # hataları at
```

`/dev/null` her yazılanı yutan özel bir dosyadır; gürültülü hataları susturmak için kullanılır. Ama hatayı susturmak sorunu çözmez; neyi susturduğunu bil.

### Boru hattı: komutları zincirlemek

`|` işareti soldaki komutun stdout'unu sağdaki komutun stdin'ine verir. Büyük işler küçük araçların birleşiminden oluşur:

- `wc -l`: satır sayar (`wc -w` kelime, `wc -c` bayt).
- `sort`: satırları sıralar (`-n` sayısal, `-r` ters).
- `uniq`: **art arda** gelen aynı satırları birleştirir (`-c` kaç kez olduğunu sayar).
- `cut -d: -f1`: ayırıcıya göre alan seçer.

Klasik kalıp: **sırala, say, sırala**.

```
cut -d: -f7 /etc/passwd | sort | uniq -c | sort -rn
```

Kabukların listesini çıkarır, aynı olanları sayar, en sık olanı üste koyar. `uniq` yalnızca bitişik satırlara baktığı için önce `sort` gerekir. Bu kalıbı log dosyalarında "hangi IP kaç kez denedi" sorusunun cevabı için aynen kullanacaksın.

### Sık hatalar

- `>` ile var olan bir dosyanın üstüne yazmak. Önemli bir dosyada ihtiyatlı ol; çoğu kabukta `set -o noclobber` bunu engeller.
- `2>&1` sırasını karıştırmak: `komut 2>&1 > dosya` yazarsan hata ekrana gider.
- `sudo komut > /root/dosya` yazmak: `sudo` yalnız komuta uygulanır, yönlendirmeyi senin yetkinle kabuk yapar ve çoğu zaman "izin yok" hatası alırsın.

Güvenlik notu: Hataları `/dev/null`'a göndermek bazen güvenlik ipuçlarını (reddedilen erişimler, eksik izinler) gizler. Bir betikte hata çıktısını kaybetmek yerine log dosyasına yönlendirmek daha güvenlidir.
