---
kimlik: devops-007
baslik: "CI'da test ve build"
donem: 4
sira: 7
sure: 35
neden: "CI'nin değeri, her PR'da aynı kontrollerin insan emeği olmadan çalışmasındadır. Bir DevSecOps mühendisi test, derleme ve güvenlik adımlarını hatta ekler; korumalı dalla birleşince 'kontrolden geçmeyen kod ana dala giremez' garantisi doğar."
analoji:
  baslik: "Havalimanı güvenlik kapısı"
  metin: "Herkes, ne kadar güvenilir olursa olsun, aynı kapıdan geçer. Kapı kişiye bakmaz, kurala bakar. PR'da çalışan testler de böyledir: yazan kıdemli de olsa yeni de olsa aynı kontrolleri geçmek zorundadır. Sınır: kapı yalnız aradığı şeyi bulur; testin yazmadığın bir hatayı yakalamasını bekleyemezsin."
gorev:
  aciklama: "Kurulum gerekmez; yalnız yazarak çalış. `/tmp` altında, bir PR'da test çalıştıran örnek bir workflow dosyası yaz ve yapısını incele:"
  komutlar:
    - mkdir -p /tmp/ci-deneme/.github/workflows && cd /tmp/ci-deneme
    - "printf 'name: CI\\non:\\n  pull_request:\\njobs:\\n  test:\\n    runs-on: ubuntu-latest\\n    steps:\\n      - uses: actions/checkout@v4\\n      - run: echo testler calisir\\n' > .github/workflows/ci.yml"
    - cat .github/workflows/ci.yml
  soru: "Bu workflow hangi olayla çalışır ve `checkout` adımı olmasaydı sonraki adımlar neden kodu göremezdi?"
  telefon:
    soru: "Bir PR'daki CI kırmızı ama geliştirici 'yerelimde çalışıyor' diyor. Bunun olası iki nedeni nedir?"
    cevap: "Yerelde olan ama CI'da olmayan bir şey olabilir: farklı sürüm, eksik ortam değişkeni ya da kurulu olmayan bir araç. Ya da test kararsızdır (flaky) ve bazen geçer, bazen kalır."
sorular:
  - id: devops-007-s1
    soru: "PR'da otomatik test çalıştırmanın avantajı nedir?"
    cevap: "Her değişiklik birleşmeden önce aynı koşullarda denenir. Hata ana dala girmeden yakalanır ve insan incelemesi iş mantığına odaklanabilir."
  - id: devops-007-s2
    soru: "CI'da önbellek (cache) neden kullanılır ve riski nedir?"
    cevap: "Bağımlılıkları her seferinde yeniden indirmek yavaştır; önbellek süreyi kısaltır. Risk: eski ya da bozuk bir önbellek hatalı sonuç verebilir, o yüzden önbellek anahtarı bağımlılık dosyasına bağlanır."
  - id: devops-007-s3
    soru: "Durum rozeti (status badge) ne gösterir?"
    cevap: "Depo sayfasında, son workflow çalışmasının geçip geçmediğini gösteren küçük bir görseldir. Projenin sağlığını tek bakışta gösterir."
  - id: devops-007-s4
    soru: "Testler geçiyorsa kod güvenlidir diyebilir miyiz?"
    cevap: "Hayır. Testler yalnız yazılan senaryoları kontrol eder. Güvenlik için ayrıca bağımlılık taraması, sır taraması, statik analiz gibi adımlar da hatta olmalıdır."
derinDalis:
  - tur: okuma
    baslik: "GitHub Actions: Workflow'lar"
    ayrinti: "Workflow dosyalarının yapısı ve tetikleyiciler (devops-006'daki sayfadan devam)."
    url: "https://docs.github.com/en/actions/get-started/understanding-github-actions"
---

CI hattının görevi basittir: kod değiştiğinde **aynı kontroller** her seferinde otomatik çalışsın.

### Tipik PR hattı

1. **checkout:** Kodu runner'a indir.
2. **Kurulum:** Dil ortamını (Python, Node vb.) hazırla.
3. **Bağımlılıklar:** Gerekli paketleri kur.
4. **Test:** Birim testlerini çalıştır.
5. **Build:** Uygulamayı derle ya da paketle.
6. **Güvenlik adımları:** Sır taraması, bağımlılık taraması.

Herhangi bir adım hata verirse job durur ve PR'da kırmızı işaret görünür.

### Neden her PR'da?

Test yalnız yazarın kendi bilgisayarında koşarsa, "bende çalışıyor" sorununu çözmez. CI temiz bir makinede, bildirilmiş sürümlerle çalışır; sonuç herkes için aynıdır. Bu, devops-004'teki korumalı dalla birleşir: "durum kontrolü geçmeden birleştirme" kuralı koyarsan kırmızı PR ana dala giremez.

### Önbellek (cache)

Her çalıştırma temiz makinede başladığı için paketler hep yeniden iner. Önbellek, indirilen bağımlılıkları çalıştırmalar arasında saklar. Önbellek anahtarı genelde bağımlılık dosyasının özetinden (hash) üretilir; dosya değişince eski önbellek kullanılmaz.

### Durum rozeti

README'ye konan küçük bir görsel, son çalışmanın başarılı mı başarısız mı olduğunu gösterir. Küçük ama etkili bir şeffaflık: proje sağlığı herkesin gözü önündedir.

### Kararsız (flaky) testler

Bazen geçip bazen kalan testlere flaky denir. Bunları "bir daha çalıştır" diyerek geçiştirmek, gerçek hataları da gizleyen kötü bir alışkanlıktır. Kök nedeni bul ya da testi karantinaya al ve takip et.

### Hızlı geri bildirim

Hat ne kadar yavaşsa insanlar onu o kadar atlamak ister. Hızlı ve güvenilir testler önce, yavaş taramalar sonra çalışsın; hızlı hata erken görünsün.

Güvenlik notu: CI'da çalışan her şey bir kod çalıştırmadır. Fork'tan gelen bir PR'ın workflow'u, depo sırlarına erişmeden çalıştırılmalıdır. GitHub, fork PR'larında `GITHUB_TOKEN` dışında sırları varsayılan olarak iletmez; bu korumayı bilinçsizce kapatma.
