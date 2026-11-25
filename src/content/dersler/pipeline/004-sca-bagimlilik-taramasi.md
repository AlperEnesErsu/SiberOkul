---
kimlik: pipeline-004
baslik: "SCA ve bağımlılık taraması"
donem: 6
sira: 4
sure: 30
neden: "Modern bir uygulamanın kodunun büyük kısmı senin yazdığın değil, çektiğin kütüphanelerdir. Birinde açık çıktığında senin de açığın olur. Bağımlılık taramasını otomatikleştirmek, bu riski haberdar olarak yönetmenin en ucuz yoludur."
analoji:
  baslik: "Ürün geri çağırma duyurusu"
  metin: "Bir arabada kullanılan fren parçası üreticisi hata bildirirse, araba üreticisi hangi araçlarda o parçanın olduğunu bilmek zorundadır. SCA, hangi kütüphanenin hangi sürümünü kullandığını bilir ve geri çağırma listesiyle (zafiyet veritabanı) karşılaştırır. Sınırı: liste yalnız bilinen hataları içerir; henüz keşfedilmemiş bir açığı göstermez."
gorev:
  aciklama: "Geçici bir Node projesinde bilinen açığı olan eski bir lodash sürümü kuracak ve taratacaksın. Node.js ve npm kurulu olmalı (`sudo apt install nodejs npm`). Ağ erişimi gerekir; her şey /tmp altında kalır. Çıktı sürüme göre değişir."
  komutlar:
    - "rm -rf /tmp/sca && mkdir -p /tmp/sca && cd /tmp/sca && npm init -y >/dev/null"
    - "npm install lodash@4.17.15"
    - "npm audit"
    - "npm audit --audit-level=high; echo \"çıkış kodu: $?\""
    - "npm ls lodash"
  soru: "`npm audit` raporunda bir güvenlik açığı için 'fix available' yazıyor. Bunu uygulamadan önce hangi iki şeyi kontrol edersin?"
  telefon:
    soru: "Dependabot sana 'lodash 4.17.15 → 4.17.21' diye bir PR açtı. PR'ı birleştirmeden önce hangi güvence gerekir ve neden doğrudan 'merge' demek riskli olabilir?"
    cevap: "Testlerin geçmesi gerekir; sürüm atlaması uygulamayı bozan bir değişiklik içerebilir. Ayrıca değişiklik notuna bakılır. Otomatik PR güvenlik yaması içeriyor olsa bile testsiz birleştirmek üretimi kırabilir."
sorular:
  - id: pipeline-004-s1
    soru: "Doğrudan (direct) ve geçişli (transitive) bağımlılık nedir? Neden geçişli olanlar daha sinsidir?"
    cevap: "Doğrudan: senin listeye yazdığın paket. Geçişli: o paketin kendi çektiği paketler. Listede görmediğin bir kütüphanedeki açık de seni etkiler; bu yüzden tarama kilit dosyasındaki (lockfile) tüm ağaca bakmalıdır."
    ipucu: "Listene yazdığın paket ile o paketin çektiği paketler aynı şey değil."
  - id: pipeline-004-s2
    soru: "Dependabot alert ile Dependabot version/security update PR'ı arasındaki fark nedir?"
    cevap: "Alert, açık olduğunu haber verir ve düzeltme sürümü varsa gösterir. Güncelleme PR'ı ise sürümü yükselten değişikliği senin için hazırlar. İkisi ayrı ayarlardır ve birlikte kullanılır."
    ipucu: "Biri haber verir, diğeri senin yerine değişikliği hazırlar."
  - id: pipeline-004-s3
    soru: "Taramada 'kritik' çıkan bir açık, uygulamandaki kodun o kısmı hiç çağrılmıyorsa da acil midir?"
    cevap: "Her zaman değil. Açığın sömürülebilmesi için o kodun erişilebilir olması gerekir. Ama bunu varsaymak yerine doğrulamalısın; çağrılmıyorsa öncelik düşer, yine de güncelleme planlanır, çünkü kullanım sonradan değişebilir."
    ipucu: "Açığın sömürülebilmesi için kodun hangi şartı sağlaması gerekir?"
  - id: pipeline-004-s4
    soru: "Kilit dosyası (`package-lock.json`) neden SCA için önemlidir?"
    cevap: "Kilit dosyası tam olarak hangi sürümlerin kurulduğunu sabitler. Tarayıcı 'gerçekte hangi sürüm çalışıyor' sorusunu ancak onunla cevaplar; kilit yoksa her kurulumda farklı sürüm gelebilir."
    ipucu: "Tarayıcı 'gerçekte kurulan' sürümü nereden öğrenir?"
  - id: pipeline-004-s5
    soru: "Dependabot sabah 'lodash'ta kritik açık' alert'i verdi, ama senin package.json'da lodash yok. Ne yaparsın?"
    cevap: "Büyük olasılıkla geçişli bağımlılıktır: başka bir paket lodash'ı getiriyor. `npm ls lodash` ile hangi paketin çektiğini bul. Üst paketin lodash'ı güncelleyen bir sürümü varsa onu yükselt; yoksa kilit dosyasında sürüm zorlayan bir yöntem (override) düşün ve sonrasında testleri çalıştır. Açığın uygulamada erişilebilir olup olmadığını da değerlendirip önceliği buna göre belirle."
    ipucu: "Görmediğin bir paket hangi yoldan projeye girmiş olabilir; ağaca bakan bir komutu düşün."
hizliKontrol:
  - soru: Bir projede 5 doğrudan bağımlılık var ama kilit dosyasında 80 paket görünüyor. Fark nereden gelir?
    secenekler:
      - Kilit dosyası hatalıdır
      - Geçişli bağımlılıklar da kilit dosyasında listelenir
      - npm rastgele paket ekler
      - Test paketleri sayıyı iki katına çıkarır
    dogru: 1
    aciklama: Her paket kendi bağımlılıklarını getirir; açıklar çoğu zaman bu katmandadır.
    ipucu: Paketlerin paketleri var.
  - soru: SCA aracı hangi iki veriyi eşleştirir?
    secenekler:
      - Kod satırlarını ve commit mesajlarını
      - Envanterdeki paket sürümlerini ve zafiyet veritabanındaki etkilenen sürüm aralıklarını
      - Sunucu loglarını ve parolaları
      - Dockerfile'ı ve lisansı
    dogru: 1
    aciklama: "Envanter + veritabanı + eşleştirme: sürüm bir açığın etkilenen aralığındaysa bulgu çıkar."
    ipucu: "Üç parçayı hatırla: envanter, veritabanı, eşleştirme."
sikHatalar:
  - hata: Dependabot PR'ını testlere bakmadan birleştirmek.
    dogrusu: Güncelleme de bir kod değişikliğidir; testler geçmeli ve değişiklik notu okunmalı.
  - hata: Kilit dosyasını (`package-lock.json`) depoya koymamak.
    dogrusu: Kilit dosyası sürümleri sabitler; olmazsa taranan sürüm ile üretimdeki sürüm farklı olabilir.
  - hata: Geliştirme araçlarındaki düşük önemli bulgu ile üretim bağımlılığındaki kritik bulguyu aynı sayıp kafayı karıştırmak.
    dogrusu: Her bulguyu ağırlık, erişilebilirlik ve düzeltme durumuna göre sırala.
terimler:
  - SCA
  - Geçişli bağımlılık
  - Kilit dosyası
  - OSV
derinDalis:
  - tur: okuma
    baslik: "GitHub: Dependabot alerts hakkında"
    ayrinti: "Uyarıların GitHub Advisory Database'den nasıl geldiğini ve nerede göründüğünü anlatır."
    url: "https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts"
  - tur: lab
    baslik: "OSV-Scanner"
    ayrinti: "Google'ın açık kaynak aracı; projenin bağımlılıklarını OSV veritabanındaki açıklarla eşleştirir. Birçok dil ekosistemini tek araçla taramak için iyi bir seçenek."
    url: "https://google.github.io/osv-scanner/"
---

**SCA** (Software Composition Analysis, yazılım bileşen analizi), projenin kullandığı üçüncü taraf kütüphanelerini listeler ve bilinen açıklarla karşılaştırır. SAST senin yazdığın koda bakar; SCA senin yazmadığın koda.

### Üç parça

1. **Envanter:** Hangi paket, hangi sürüm? Kaynağı manifest (`package.json`) ve kilit dosyasıdır (`package-lock.json`, `requirements.txt` ile sabit sürümler vb.).
2. **Veritabanı:** Bilinen açıkların listesi. Ana kaynaklar GitHub Advisory Database, **OSV** (Open Source Vulnerabilities, açık biçimli ortak veritabanı) ve CVE/NVD'dir.
3. **Eşleştirme:** Envanterdeki sürüm, bir açığın etkilenen aralığında mı?

### Araçlar

- `npm audit`: npm'e yerleşik; kilit dosyasındaki ağacı tarar.
- **Dependabot:** GitHub'ın hem uyarı üreten hem de güncelleme PR'ı açan servisi. Ayar dosyası `.github/dependabot.yml`.
- **OSV-Scanner:** Çok dilli, OSV veritabanını kullanır.

### Bulguyu okumak

Her bulgu için üç soru sor:

- **Ağırlık (severity):** CVSS puanı genel bir fikir verir ama senin kullanımını bilmez.
- **Erişilebilirlik:** Zayıf kod yolu uygulamanda gerçekten kullanılıyor mu?
- **Düzeltme var mı?** Yamalı sürüm varsa yükselt. Yoksa geçici önlem (özelliği kapatmak, girdiyi filtrelemek) ve takip gerekir.

### Yaygın tuzaklar

- **Gürültü:** Geliştirme araçlarında (yalnız test sırasında kullanılan paketlerde) çıkan düşük önemli bulguları üretim açığıyla eşit tutmak.
- **Güncellemeyi ertelemek:** Küçük, sık güncellemeler büyük ve riskli bir sıçramadan ucuzdur.
- **Sürüm sabitlememek:** Kilit dosyası yoksa tarama sonucu ile üretimde çalışan sürüm farklı olabilir. Bu konuyu appsec-009'da da görmüştün.
- **Güvenin kaynağı:** Bir paketin popüler olması açıksız olduğunu göstermez. Güvenlik veritabanı sorgusu, popülerlikten daha güçlü bir sinyaldir.

### Pipeline'a koymak

CI'da `npm audit --audit-level=high` gibi bir adım, yüksek ve kritik bulguda sıfırdan farklı çıkış kodu döndürerek job'ı durdurur. Neyin build'i durdurması gerektiği kararını 011. derste ele alacağız; şimdilik kural: tarama sadece çalışmakla kalmasın, sonucu birinin sorumluluğunda olsun.

### Dependabot alert, güvenlik güncellemesi ve sürüm güncellemesi

Üç ayrı özellik karıştırılır. **Alert** yalnız haber verir. **Güvenlik güncellemesi** açığı kapatan sürüm için otomatik PR açar. **Sürüm güncellemesi** (`dependabot.yml` ile) güvenlik açığı olmasa bile bağımlılıkları düzenli aralıklarla yükseltir. Güvenlik güncellemeleri gerekirse sürüm güncellemelerinden bağımsız açık tutulabilir.

Aklında tut: Dependabot yalnız **bilinen** ve veritabanına girmiş açıkları gösterir. Yeni bir açık yayımlandığında, depoda hiçbir şey değişmese bile yeni bir alert gelebilir; yani dünkü "temiz" sonuç bugünkü sonucu garanti etmez. Bu yüzden taramayı bir kez değil, sürekli çalıştırırsın.

Küçük bir kural: bir bulguyu **kapatırken** (örneğin "kullanılmıyor") nedenini yaz. Altı ay sonra o kodun kullanımı değişirse o not seni uyarır.

**Güvenlik notu:** Bağımlılık güncellemesi de bir kod değişikliğidir. Güncelleme PR'larını da testten ve incelemeden geçir; ele geçirilmiş bir paket yeni sürümle gelebilir.
