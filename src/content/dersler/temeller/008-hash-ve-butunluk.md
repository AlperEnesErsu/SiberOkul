---
kimlik: temeller-008
baslik: "Hash ve bütünlük"
donem: 3
sira: 8
sure: 25
neden: "İndirdiğin bir araç, bir imaj ya da bir bağımlılık gerçekten yayıncının yayımladığı dosya mı? Cevap çoğu zaman bir hash karşılaştırmasıdır. DevSecOps'ta CI çıktıları, container digest'leri ve bağımlılık kilit dosyaları aynı fikre yaslanır: içerik değiştiyse parmak izi de değişir."
analoji:
  baslik: "Parmak izi"
  metin: "Bir dosyanın hash'i onun parmak izi gibidir: kısa, sabit uzunlukta ve dosyaya özgüdür. Parmak izinden kişiyi yeniden yaratamazsın, ama iki parmak izini karşılaştırarak aynı kişi mi olduğunu anlarsın. Sınır: hash dosyanın kimin elinden çıktığını söylemez; sahte bir dosya ve sahte hash'i birlikte sunan biri seni kandırabilir. Bu yüzden hash'in kendisi güvenilir bir kanaldan gelmelidir."
gorev:
  aciklama: "`sha256sum` ile bir dosyanın hash'ini al, değiştir ve farkı gör. Sonra hash listesini kaydedip `-c` ile doğrula. Hepsi `~/temeller/hash` altında."
  komutlar:
    - mkdir -p ~/temeller/hash && cd ~/temeller/hash
    - echo "rapor v1" > rapor.txt
    - sha256sum rapor.txt
    - sha256sum rapor.txt > liste.sha256
    - sha256sum -c liste.sha256
    - echo "rapor v1 (degistirildi)" > rapor.txt
    - sha256sum -c liste.sha256
  soru: "İkinci `sha256sum -c` neden 'FAILED' dedi? Saldırgan hem dosyayı hem `liste.sha256` dosyasını aynı yerden değiştirebiliyorsa bu kontrol neden yetmez?"
  telefon:
    soru: "Bir yazılımın indirme sayfasında dosya ile birlikte SHA-256 değeri de yayımlanmış, ikisi de aynı sunucuda duruyor. Sunucu ele geçirilirse bu hash seni korur mu? Neyin eklenmesi korumayı sağlar?"
    cevap: "Korumaz. Saldırgan dosyayı değiştirirken sayfadaki hash'i de aynı anda günceller. Hash'in ayrı ve güvenilir bir kanaldan alınması ya da yayıncının imzasının doğrulanması gerekir; imza saldırganın üretemeyeceği bir kanıttır."
sorular:
  - id: temeller-008-s1
    soru: "Bir hash fonksiyonunun üç temel özelliğini söyle."
    cevap: "Aynı girdi hep aynı çıktıyı verir. Girdideki küçük bir değişiklik çıktıyı büyük ölçüde değiştirir. Çıktıdan girdiye geri dönmek (ve aynı çıktıyı veren başka bir girdi bulmak) pratikte imkânsızdır."
  - id: temeller-008-s2
    soru: "Hash şifreleme midir? Bir hash'ten özgün dosyayı geri alabilir misin?"
    cevap: "Hayır. Şifreleme anahtarla geri çevrilebilir; hash tek yönlüdür ve girdiyi geri vermez. Hash gizlilik için değil, değişikliği fark etmek (bütünlük) için kullanılır."
  - id: temeller-008-s3
    soru: "MD5 ve SHA-1 neden artık güvenlik amacıyla kullanılmamalı, SHA-256 kullanılmalı?"
    cevap: "MD5 ve SHA-1'de iki farklı girdinin aynı hash'i vermesini (çakışma) sağlayan pratik saldırılar gösterildi. Bu, sahte dosyayı gerçeğiyle aynı hash'e sokmayı mümkün kılar. SHA-256 için böyle bir saldırı bilinmiyor."
  - id: temeller-008-s4
    soru: "Bir container imajına etiket (ör. `:latest`) yerine digest ile başvurmak güvenliği nasıl artırır?"
    cevap: "Etiket zamanla başka bir imajı gösterecek şekilde değiştirilebilir. Digest, imajın içeriğinin hash'idir; içerik değişirse digest de değişir. Digest ile başvurmak her seferinde birebir aynı içeriği almanı garanti eder."
derinDalis:
  - tur: kitap
    baslik: "Serious Cryptography (Jean-Philippe Aumasson)"
    ayrinti: "Hash fonksiyonları bölümü: çakışma direnci ve SHA ailesi."
  - tur: lab
    baslik: "İki dosya, aynı hash mi?"
    ayrinti: "`/tmp` altında içeriği aynı iki dosya oluştur, farklı adlarla `sha256sum` al ve hash'in dosya adına değil içeriğe bağlı olduğunu doğrula."
---

**Hash** (özet fonksiyonu), herhangi büyüklükteki veriyi sabit uzunlukta bir çıktıya çevirir. SHA-256 ile çıktı hep 64 onaltılık karakterdir; ister tek harflik bir dosya, ister bir film olsun.

### Özellikleri

- **Deterministik**: Aynı girdi her zaman aynı hash'i verir.
- **Çığ etkisi**: Tek bir karakter değişince hash baştan sona değişir.
- **Tek yönlü**: Hash'ten girdiye dönülemez.
- **Çakışmaya dirençli**: Aynı hash'i veren iki farklı girdi bulmak pratikte mümkün olmamalı.

Hash bir **şifreleme değildir**. Anahtarı yoktur ve geri çevrilemez. Amacı bir verinin değişip değişmediğini hızlıca anlamaktır, yani CIA'nın bütünlük ayağı.

### Hangi algoritma?

| Algoritma | Durum |
|---|---|
| MD5 | Güvenlik için kırık; çakışma üretmek kolay. Yalnız eski sistemlerde karşına çıkar. |
| SHA-1 | Güvenlik için artık önerilmez; çakışma saldırısı gösterildi. |
| SHA-256 (SHA-2 ailesi) | Bugün yaygın ve güvenli kabul edilir. |

### Dosya doğrulama

Yazılım yayımlayan taraflar genelde dosyayla birlikte hash değerini de yayımlar. İndirdiğin dosyanın hash'ini hesaplayıp karşılaştırırsın:

```
sha256sum indirilen.iso
```

Çıktı yayımlanan değerle birebir aynıysa dosya bozulmadan ya da değiştirilmeden gelmiştir. Birkaç dosyayı bir listeyle toplu kontrol etmek için `sha256sum -c liste.sha256` kullanılır.

### Sınırı

Hash tek başına **kimin yayımladığını** söylemez. Saldırgan bir sunucuyu ele geçirirse hem dosyayı hem yanındaki hash değerini değiştirir. Çözüm iki parçalıdır:

1. Hash'i, dosyadan farklı ve güvenilir bir kanaldan al.
2. Mümkünse yayıncının **dijital imzasını** doğrula; imza hash üzerine atılır ve saldırgan onu üretemez.

### DevSecOps'ta nerede?

- **Container digest**: `sha256:...` ile başlayan değer imajın içeriğinin hash'idir. Etiketler değişebilir, digest değişmez.
- **Bağımlılık kilit dosyaları**: Paketlerin hash'ini tutarak indirilenin beklenenle aynı olduğunu doğrular.
- **Build çıktıları**: Aynı kaynaktan üretilen çıktının hash'i değiştiyse bir şey değişmiştir.
- **Dosya bütünlüğü izleme**: Kritik dosyaların hash'i periyodik kontrol edilir; beklenmeyen değişiklik alarm üretir.

Güvenlik notu: Hash'leri karşılaştırırken gözle bakmak yerine komutla karşılaştır (`sha256sum -c`). İlk ve son birkaç karakteri kontrol etmek, yakın hash üretilmiş sahte dosyalara karşı yetersiz kalabilir.
