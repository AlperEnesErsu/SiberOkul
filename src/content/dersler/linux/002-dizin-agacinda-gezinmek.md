---
kimlik: linux-002
baslik: "Dizin ağacında gezinmek"
donem: 1
sira: 2
sure: 30
neden: "Bir sunucuda log dosyasını bulmak, bir yapılandırma dosyasını açmak ya da bir saldırganın bıraktığı dosyayı aramak için önce dizinler arasında rahatça gezinebilmen gerekir. Mutlak ve göreli yol ayrımı, betik yazarken yapılan hataların da en sık kaynağıdır."
analoji:
  baslik: "Adres tarifi: tam adres ve 'buradan iki sokak ileri'"
  metin: "Mutlak yol, mektup zarfına yazılan tam adrestir: 'Türkiye / İstanbul / Kadıköy / Moda Caddesi 5'. Kim nerede olursa olsun aynı yere götürür. Göreli yol ise sokakta birine verdiğin tariftir: 'buradan bir sokak geri, sonra sağa'. Tarif ancak nerede durduğunu biliyorsan işe yarar. `..` 'bir sokak geri' demektir."
gorev:
  aciklama: "Ubuntu terminalinde sırayla çalıştır ve her adımdan sonra istem satırının nasıl değiştiğine bak:"
  komutlar:
    - pwd
    - cd /
    - ls
    - cd /var/log
    - pwd
    - cd ..
    - pwd
    - cd
    - ls -a
  soru: "`ls` ile `ls -a` arasındaki fark ne? Noktayla başlayan dosyalar kimin için orada?"
  telefon:
    soru: "`/home/ayse/notlar` dizinindesin. Sırayla `cd ..`, `cd ..`, `pwd` yazarsan ekranda ne görürsün?"
    cevap: "`/home`. İlk `cd ..` seni `/home/ayse`ye, ikincisi `/home`a çıkarır; `pwd` bulunduğun yeri yazar."
sorular:
  - id: linux-002-s1
    soru: "`/var/log` ile `var/log` arasındaki fark nedir?"
    cevap: "`/var/log` mutlak yoldur; kök dizinden (`/`) başlar ve nerede olursan ol aynı yeri gösterir. `var/log` göreli yoldur; bulunduğun dizinin içindeki `var` dizinini arar. Ev dizinindeysen öyle bir dizin büyük ihtimalle yoktur ve hata alırsın."
  - id: linux-002-s2
    soru: "`cd ..` ve tek başına `cd` ne yapar?"
    cevap: "`cd ..` bir üst dizine çıkar (`..` üst dizin demektir). Argümansız `cd` seni doğrudan ev dizinine (`~`) götürür; `cd ~` ile aynıdır."
  - id: linux-002-s3
    soru: "`ls -a` ile görünen `.bashrc` gibi dosyalar neden normal `ls` ile görünmez?"
    cevap: "Adı nokta (`.`) ile başlayan dosyalar gizli sayılır. Genellikle ayar dosyalarıdır ve kalabalık yapmasınlar diye `ls` onları göstermez. `-a` (all) seçeneği hepsini gösterir."
  - id: linux-002-s4
    soru: "`ls -a` çıktısının en başındaki `.` ve `..` ne anlama gelir?"
    cevap: "`.` bulunduğun dizinin kendisi, `..` bir üst dizindir. Her dizinde bu iki özel girdi vardır; göreli yollar bunlar sayesinde çalışır."
derinDalis:
  - tur: kitap
    baslik: "The Linux Command Line (William Shotts)"
    ayrinti: "Bölüm 2 'Navigation'."
    url: "https://linuxcommand.org/tlcl.php"
  - tur: kitap
    baslik: "How Linux Works, 3. baskı (Brian Ward)"
    ayrinti: "Bölüm 2 'Basic Commands and Directory Hierarchy' içindeki dizin hiyerarşisi kısmı."
---

Linux'ta bütün dosyalar tek bir ağacın dallarıdır. Ağacın kökü `/` dizinidir (kök, İngilizcesi *root*). Diskin farklı yerleri, USB bellekler, hatta Windows sürücülerin bile bu ağacın bir dalına bağlanır. WSL'de Windows'un `C:` sürücüsünü `/mnt/c` altında bulursun.

**Yol**, ağaçta bir yeri gösteren adrestir ve dizin adları `/` ile ayrılır:

- **Mutlak yol** `/` ile başlar: `/home/alper/notlar`. Nerede olursan ol aynı yeri gösterir.
- **Göreli yol** `/` ile başlamaz: `notlar` ya da `../tmp`. Bulunduğun dizine göre çözülür.

Gezinmenin üç temel komutu:

- `pwd`: Neredeyim?
- `ls`: Burada ne var?
- `cd <yol>`: Şuraya git.

Kısayollar:

| Yazılış | Anlamı |
|---|---|
| `~` | Ev dizinin (`/home/kullanici`) |
| `.` | Bulunduğun dizin |
| `..` | Bir üst dizin |
| `cd -` | Bir önceki bulunduğun dizine dön |

İpucu: Yol yazarken **Tab** tuşuna bas. Kabuk adı tamamlar; birden fazla seçenek varsa iki kez Tab'a basınca listeler. Yazım hatalarını azaltır ve hızlandırır.

Güvenlik notu: Göreli yollar, bir betik beklemediğin bir dizinde çalıştığında yanlış dosyaya dokunmasına yol açabilir. Önemli işlemlerde (özellikle silme) mutlak yol kullanmak iyi bir alışkanlıktır.
