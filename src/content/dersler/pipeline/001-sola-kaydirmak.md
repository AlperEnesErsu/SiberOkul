---
kimlik: pipeline-001
baslik: "Sola kaydırmak (shift-left)"
donem: 6
sira: 1
sure: 25
neden: "Bir DevSecOps mühendisi güvenliği 'son kontrol' olmaktan çıkarıp geliştirme sürecinin her adımına yayar. Pipeline bölgesinin bütün araçları (sır taraması, SAST, SCA, imaj taraması) bu tek fikrin parçalarıdır. Bu ders haritayı çiziyor."
analoji:
  baslik: "Binayı bitirdikten sonra değil, çizerken denetlemek"
  metin: "Bina bitince 'kolonlar yetersiz' demek, yıkıp yeniden yapmak demektir. Plan aşamasında söylense bir silgi yeter. Sola kaydırma, hatayı ucuz olduğu yerde yakalamaktır. Sınırı: her şeyi erken denetlemek mümkün değil; çalışan sistemi ancak çalışırken test edebilirsin, o yüzden sağdaki kontroller de kalır."
gorev:
  aciklama: "Aşağıdaki komutlar geçici bir klasörde sahte bir 'sızıntıyı' üç farklı noktada yakalamayı dener. Anahtar sahtedir (AWS belgelerindeki örnek değer), hiçbir sisteme ait değildir."
  komutlar:
    - "mkdir -p /tmp/sola && cd /tmp/sola && git init -q && git config user.email a@b.c && git config user.name deneme"
    - 'echo "aws_key=AKIAIOSFODNN7EXAMPLE" > ayar.txt'
    - "git add ayar.txt && git diff --cached | grep -n '^+' | grep -E 'AKIA[0-9A-Z]{16}'"
    - 'git commit -q -m "ayar ekle" && git log --oneline'
    - "git grep -nE 'AKIA[0-9A-Z]{16}' $(git rev-list --all)"
  soru: "Üçüncü komut (commit'ten önce) ile beşinci komut (commit'ten sonra) aynı sırrı buldu. Hangisinde düzeltmek daha ucuzdur ve neden?"
  telefon:
    soru: "Bir sır, geliştirici bilgisayarında, PR'da, ana dala birleştikten sonra ve üretimde fark ediliyor. Dört durumu 'düzeltmesi en ucuzdan en pahalıya' sırala."
    cevap: "Bilgisayarda (commit öncesi) < PR'da < ana dala girdikten sonra < üretimde. Ne kadar sağa gidilirse o kadar çok kişi ve sistem etkilenir; sır ana dala girdiyse geçmişte kalır ve anahtarın döndürülmesi (rotation) gerekir."
sorular:
  - id: pipeline-001-s1
    soru: "'Sola kaydırma' ifadesindeki sol ve sağ neyi gösterir?"
    cevap: "Yazılım yaşam döngüsünü soldan sağa çizersek: planlama, kod, build, test, yayın, işletme. Sol erken adımlar, sağ geç adımlardır. Güvenlik kontrollerini sola, yani erken adımlara çekmek hatayı daha ucuz yakalamayı sağlar."
  - id: pipeline-001-s2
    soru: "Sola kaydırma, güvenlik ekibinin işini bitirdiği anlamına mı gelir?"
    cevap: "Hayır. Kontrolleri otomatikleştirip geliştiricinin önüne getirir; ama tehdit modelleme, bulguları değerlendirme ve çalışan sistemin izlenmesi hâlâ insan ve sağ taraf işidir."
  - id: pipeline-001-s3
    soru: "Bir PR'da çalışan otomatik güvenlik taraması neden sadece son kontrol olarak yapılan taramadan iyidir?"
    cevap: "Geri bildirim, kod henüz yeni yazılmışken ve geliştiricinin aklındayken gelir. Düzeltme küçük olur, başkasının işini etkilemez, ve hatalı kod ana dala hiç girmez."
  - id: pipeline-001-s4
    soru: "Sır sızıntısı için hangi iki ayrı aşamada kontrol koyulabilir?"
    cevap: "Commit öncesinde yerelde (pre-commit kancası) ve PR/CI aşamasında (pipeline). İkisi birlikte gerekir, çünkü yerel kanca atlanabilir; CI atlanamaz."
derinDalis:
  - tur: okuma
    baslik: "OpenSSF Scorecard"
    ayrinti: "Açık kaynak projelerin güvenlik uygulamalarını otomatik puanlayan araç; hangi pipeline kontrollerinin neden önemsendiğini görmek için kontrol listesine bak."
    url: "https://scorecard.dev/"
---

**DevSecOps**, güvenliği geliştirme ve işletme sürecinin içine yerleştirmektir. Eski düzende yazılım hazır olunca bir güvenlik ekibi bakar, bulgu listesi verir, yayın gecikir. Yeni düzende kontroller sürecin içinde, otomatik ve sürekli çalışır.

### Hata ne zaman pahalıdır?

Aynı hatanın maliyeti bulunduğu yere göre büyür:

| Nerede bulundu | Ne gerekir |
|---|---|
| Yazarken (editör, pre-commit) | Bir satırı değiştirmek |
| Pull request (PR) | Kodu düzeltip yeniden itmek |
| Ana dalda | Geri alma, yeni sürüm, bazen sır döndürme |
| Üretimde | Olay müdahalesi, kullanıcı etkisi |

**Sola kaydırma (shift-left)** adı buradan gelir: süreç çizelgesinde sol erken adımdır, kontrolü oraya çekersin.

### Pipeline'ın katmanları

Bu bölgede şu kontrolleri sırayla kuracağız. Her biri farklı bir soruyu cevaplar:

- **Sır taraması:** koda anahtar ya da parola girdi mi?
- **SAST:** yazdığımız kodda tehlikeli kalıp var mı?
- **SCA:** kullandığımız kütüphanelerde bilinen açık var mı?
- **SBOM:** neyi kullandığımızın listesi elimizde mi?
- **DAST:** çalışan uygulama dışarıdan saldırıya açık mı?
- **İmaj taraması:** container içindeki paketler temiz mi?
- **İmzalama ve tedarik zinciri:** elimizdeki artefakt gerçekten bizim build'imizden mi çıktı?

Hiçbiri tek başına yetmez. Biri sızıntıyı yakalar ama yanlış yapılandırmayı göremez; diğeri tersini yapar. Buna **derinlemesine savunma** dendiğini temeller bölgesinden hatırlarsın.

### Ters risk: gürültü

Sola kaydırmanın bir bedeli var: her PR'a on araç ekleyip yüzlerce uyarı üretirsen geliştirici uyarıları okumayı bırakır ve araçları atlamanın yolunu arar. İyi pipeline az ama güvenilir sinyal verir. Hangi bulgunun build'i durduracağı kararını 011. derste ele alacağız.

### GitShield nerede duruyor?

GitShield'i yazarken bu fikri zaten uyguladın: `git diff`'in eklenen satırlarına bakıyor, yani kodun henüz yeni girdiği anda çalışıyor. Bir sonraki derste onu bu haritanın içine yerleştireceğiz.

**Güvenlik notu:** Otomatik araçlar insan incelemesinin yerini almaz; işi ucuzlatır. Aracın "temiz" demesi "güvenli" demek değildir.
