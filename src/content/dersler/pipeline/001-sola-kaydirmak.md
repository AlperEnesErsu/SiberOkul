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
    ipucu: "Zaman çizelgesini çiz: soldaki adımlar sağdakilerden önce gelir."
  - id: pipeline-001-s2
    soru: "Sola kaydırma, güvenlik ekibinin işini bitirdiği anlamına mı gelir?"
    cevap: "Hayır. Kontrolleri otomatikleştirip geliştiricinin önüne getirir; ama tehdit modelleme, bulguları değerlendirme ve çalışan sistemin izlenmesi hâlâ insan ve sağ taraf işidir."
    ipucu: "Araç neyi otomatikleştirir, neyi hâlâ insan karar verir? Düşün."
  - id: pipeline-001-s3
    soru: "Bir PR'da çalışan otomatik güvenlik taraması neden sadece son kontrol olarak yapılan taramadan iyidir?"
    cevap: "Geri bildirim, kod henüz yeni yazılmışken ve geliştiricinin aklındayken gelir. Düzeltme küçük olur, başkasının işini etkilemez, ve hatalı kod ana dala hiç girmez."
    ipucu: "Kodun henüz taze olduğu anı ve düzeltmenin kimi etkilediğini düşün."
  - id: pipeline-001-s4
    soru: "Sır sızıntısı için hangi iki ayrı aşamada kontrol koyulabilir?"
    cevap: "Commit öncesinde yerelde (pre-commit kancası) ve PR/CI aşamasında (pipeline). İkisi birlikte gerekir, çünkü yerel kanca atlanabilir; CI atlanamaz."
    ipucu: "Yerel bir kanca ile merkezi bir sistem arasındaki atlanabilirlik farkını hatırla."
  - id: pipeline-001-s5
    soru: "Yeni katıldığın ekipte güvenlik taraması yalnız yayından bir gün önce, elle çalıştırılıyor ve her seferinde yüzlerce bulgu çıkıyor; yayın hep gecikiyor. Sola kaydırma ilkesiyle ne önerirsin?"
    cevap: "Taramaları her PR'da otomatik çalıştır, böylece bulgular kod tazeyken ve küçük parçalar hâlinde gelir. Başta yalnız az sayıda, güvenilir kuralı build'i durduracak şekilde aç, kalanları uyarı yap. Yayın öncesi kontrolü kaldırma ama bir son kontrol olarak tut; çalışan sistemi test etmek (DAST, izleme) sağ tarafta kalır."
    ipucu: "Hatanın maliyeti nerede bulunursa o kadar artıyordu; bulguları hangi adıma dağıtırsan yükü azaltırsın?"
hizliKontrol:
  - soru: Aşağıdakilerden hangisi 'sola kaydırma'ya örnektir?
    secenekler:
      - Güvenlik testini yayından hemen önce tek seferde yapmak
      - Bir kullanıcı şikâyet edince açığa bakmak
      - Sır taramasını PR açılır açılmaz otomatik çalıştırmak
      - Taramayı üretim sunucusunda gece çalıştırmak
    dogru: 2
    aciklama: Sola kaydırma kontrolü sürecin erken adımlarına (PR, commit) çekmektir; diğer seçenekler geç adımlardır.
    ipucu: Çizelgede 'erken' olan adımı seç.
  - soru: Sola kaydırmanın en önemli riski hangisidir?
    secenekler:
      - Araçların hiç çalışmaması
      - Fazla gürültüyle geliştiricinin uyarıları yok saymaya başlaması
      - Kodun daha yavaş yazılması
      - Yanlış pozitiflerin hiç oluşmaması
    dogru: 1
    aciklama: Çok sayıda güvenilmez uyarı, araçların atlanmasına yol açar. İyi pipeline az ama güvenilir sinyal verir.
    ipucu: Dersteki 'Ters risk' başlığını hatırla.
sikHatalar:
  - hata: Sola kaydırdık, artık güvenlik ekibine ya da üretim izlemesine gerek yok.
    dogrusu: Erken kontroller ucuzdur ama her şeyi yakalamaz; tehdit modelleme, bulgu değerlendirme ve çalışan sistemin izlenmesi devam eder.
  - hata: On tane aracı hemen her PR'a ekleyip hepsini zorunlu yapmak.
    dogrusu: Önce az sayıda güvenilir kontrolle başla, bulguların kalitesini gör, sonra kapıyı sıkılaştır.
sema:
  baslik: Bir değişikliğin yolu ve kontrol noktaları
  adimlar:
    - etiket: Editör
      aciklama: Geliştirici yazarken uyarı alır; düzeltmek bir satırdır.
    - etiket: Pre-commit
      aciklama: Yerel kanca sırrı commit'e girmeden yakalar ama atlanabilir.
    - etiket: Pull request
      aciklama: CI taramaları çalışır; atlanamaz ve birleştirmeyi engelleyebilir.
    - etiket: Ana dal
      aciklama: Birleştirdikten sonra bulunan hata geri alma ve yeni sürüm gerektirir.
    - etiket: Üretim
      aciklama: Bulunan her hata kullanıcıyı etkiler; olay müdahalesi başlar.
terimler:
  - Shift left
  - Secret scanning
  - Pre-commit kancası
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

### Sola kaydırmayı işe yarar yapan üç kural

1. **Geri bildirim hızlı olsun.** Geliştirici PR'ı açtıktan birkaç dakika içinde sonucu görmeli; bir gün sonra gelen uyarı artık başka bir işin ortasında karşılanır ve ertelenir.
2. **Sonuç geliştiricinin çalıştığı yerde görünsün.** Ayrı bir güvenlik panosu yerine PR üzerindeki yorum ya da satıra bağlı uyarı çok daha çabuk okunur.
3. **Sorumluluk paylaşılsın.** Güvenlik ekibi kuralları ve eşikleri belirler, kodu yazan düzeltir. Güvenlik ekibi her bulguyu tek başına çözmeye çalışırsa darboğaz olur.

Ayrıca "sağa da bak" demek gerekir: çalışan uygulamayı izlemek (loglar, uyarılar) ve olay müdahalesi hâlâ gerekir; çünkü hiçbir erken kontrol her hatayı yakalamaz. Sola kaydırma, sağdaki işi azaltır, ortadan kaldırmaz.

**Güvenlik notu:** Otomatik araçlar insan incelemesinin yerini almaz; işi ucuzlatır. Aracın "temiz" demesi "güvenli" demek değildir.
