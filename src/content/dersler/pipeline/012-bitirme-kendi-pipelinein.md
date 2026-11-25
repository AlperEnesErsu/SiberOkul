---
kimlik: pipeline-012
baslik: "Bitirme: kendi pipeline'ın"
donem: 6
sira: 12
sure: 40
neden: "Araçları tek tek bilmek ile bunları bir repoda çalışan, anlaşılır bir pipeline'a bağlamak farklı beceridir. Mülakatta ve işte seni ayıracak şey, gösterebileceğin gerçek bir güvenlik pipeline'ıdır."
analoji:
  baslik: "Binaya çok katmanlı giriş"
  metin: "Bir binada kapıda kimlik, lobide turnike, asansörde kart, katta kilit vardır; hiçbiri tek başına yeterli değildir ama birlikte sızmayı zorlaştırır. Pipeline'ın katmanları (sır, SAST, SCA, imaj taraması, dal koruma) böyledir. Sınırı: katman eklemek bakım yükü getirir; her katman sahibi olan, anlaşılır bir kontrol olmalı."
gorev:
  aciklama: "Geçici bir klasörde örnek bir proje oluşturup güvenlik pipeline'ının iskeletini yazacaksın. Yer tutucuları (`<...>`) kendi GitShield Action'ının yolu ve sabitlenecek SHA'larla doldurman gerekir; ben GitShield Action'ının adını bilmiyorum, uydurmuyorum. Gerçek bir GitHub deposuna koyacaksan önce kendi test deponda dene."
  komutlar:
    - "rm -rf /tmp/bitirme && mkdir -p /tmp/bitirme/.github/workflows && cd /tmp/bitirme && git init -q -b main"
    - |-
      cat > .github/dependabot.yml <<'EOF'
      version: 2
      updates:
        - package-ecosystem: "github-actions"
          directory: "/"
          schedule:
            interval: "weekly"
        - package-ecosystem: "pip"
          directory: "/"
          schedule:
            interval: "weekly"
      EOF
    - |-
      cat > .github/workflows/guvenlik.yml <<'EOF'
      name: guvenlik
      on:
        pull_request:
      permissions:
        contents: read
      jobs:
        sir-taramasi:
          runs-on: ubuntu-latest
          permissions:
            contents: read
            security-events: write
          steps:
            - uses: actions/checkout@<SHA>  # v4
              with:
                fetch-depth: 0
                persist-credentials: false
            # Kendi GitShield Action'ın:
            - uses: AlperEnesErsu/GitShield@<commit-SHA>
              with:
                format: sarif
                fail-on-high: true
        bagimlilik-taramasi:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@<SHA>  # v4
              with:
                persist-credentials: false
            - uses: google/osv-scanner-action/osv-scanner-action@<SHA>
        imaj-taramasi:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@<SHA>  # v4
              with:
                persist-credentials: false
            - run: docker build -t uygulama:pr .
            - uses: aquasecurity/trivy-action@<SHA>
              with:
                image-ref: uygulama:pr
                severity: HIGH,CRITICAL
                exit-code: "1"
      EOF
    - |-
      python3 -c "import yaml; [yaml.safe_load(open(f)) for f in ('.github/dependabot.yml','.github/workflows/guvenlik.yml')]; print('YAML geçerli')"
    - "grep -nE 'uses:' .github/workflows/guvenlik.yml"
  soru: "Yazdığın workflow'daki yer tutucuları doldurmak için her aksiyonun SHA'sını nereden ve nasıl güvenle alırsın? Bu SHA'lar ne zaman eskir?"
  telefon:
    soru: "Pipeline'ında GitShield, SCA ve Trivy var ama dal korumada 'zorunlu durum kontrolü' yok. Bir geliştirici kırmızı çıkan PR'ı birleştirebiliyor. Neyi eksik bıraktın ve tek ayarla nasıl düzelir?"
    cevap: "Kapı yok: araçlar sonucu gösteriyor ama birleştirmeyi engelleyen bir zorunluluk yok. Ana dala dal koruma kuralı ekleyip bu üç job'ı 'zorunlu durum kontrolü' yaparsın; yöneticiler dahil herkese uygulanacak şekilde."
sorular:
  - id: pipeline-012-s1
    soru: "Pipeline'ındaki üç tarama (sır, bağımlılık, imaj) hangi riskleri birbirinden ayrı kapatır?"
    cevap: "Sır taraması koda giren kimlik bilgilerini, bağımlılık taraması kullanılan kütüphanelerdeki bilinen açıkları, imaj taraması container içindeki işletim sistemi ve paket açıklarını yakalar. Biri diğerinin işini yapmaz."
  - id: pipeline-012-s2
    soru: "Bu pipeline'da hangi dört yerde 'en az yetki' ilkesini uyguladın?"
    cevap: "Workflow varsayılan izni `contents: read`; yazma izni (SARIF yüklemek için `security-events: write`) yalnız ilgili job'da; `persist-credentials: false` ile token diskte bırakılmıyor; ve aksiyonlar SHA ile sabit. Tetikleyici olarak `pull_request` seçildi, `pull_request_target` değil."
  - id: pipeline-012-s3
    soru: "Dependabot'u neden `github-actions` ekosistemi için de açtın?"
    cevap: "Aksiyonlar da bağımlılıktır ve SHA ile sabitlenince kendiliğinden güncellenmezler. Dependabot yeni sürümleri PR olarak getirir; böylece sabitleme güvenliğini yamaların gecikmesi pahasına kaybetmezsin."
  - id: pipeline-012-s4
    soru: "Pipeline'ı bir mülakatta anlatırken hangi üç soruya cevap hazırlamalısın?"
    cevap: "Neden bu araçlar ve eşikler? Yanlış pozitifleri nasıl yönettin? Pipeline'ın kendisini nasıl korudun (izinler, sabitleme, dal koruma)? Bu üçü, araç adlarını saymaktan çok olgunluğunu gösterir."
derinDalis:
  - tur: lab
    baslik: "Kendi deponda uygula"
    ayrinti: "Küçük bir test deposu aç, bu bölgedeki araçları sırayla ekle, bilerek sahte bir sır ve eski bir bağımlılık koyup kapının kapandığını gör. Sonra düzelt, yeşile dönmesini izle."
  - tur: okuma
    baslik: "OpenSSF Scorecard"
    ayrinti: "Kendi deponu Scorecard'ın kontrol listesiyle karşılaştır: dal koruma, sabitlenmiş bağımlılıklar, token izinleri, imzalı sürümler."
    url: "https://scorecard.dev/"
---

Bu bölgenin son dersi yeni bir kavram getirmiyor: öğrendiklerini bir **çalışan pipeline**'a bağlıyorsun. Hedef, mülakatta ya da portfolyoda gösterebileceğin küçük ama düzgün bir güvenlik hattı.

### Hedef mimari

Bir PR açıldığında paralel çalışan üç job:

1. **Sır taraması:** GitShield, GitHub Action olarak. PR'ın eklediği satırlara bakar, bulguları SARIF olarak GitHub'a yükleyebilir. (Pre-commit kancası da geliştirici makinesinde ilk katmandır.)
2. **Bağımlılık taraması (SCA):** OSV-Scanner ya da Dependabot alert'leri; kilit dosyasındaki sürümleri bilinen açıklarla karşılaştırır.
3. **İmaj taraması:** Uygulamanın imajını build edip Trivy ile `HIGH`/`CRITICAL` bulgularda başarısız olur.

Ek olarak: Dependabot ayar dosyası, dal koruma kuralı ve isteğe bağlı olarak SAST ve SBOM üretimi.

### Sıra ve tasarım kararları

**Hızlı olanlar PR'da, yavaşlar sonra.** Sır, SCA ve imaj taraması dakikalar içinde biter. DAST yavaştır; ayrı bir zamanlanmış job'a ya da birleştirme sonrasına bırakılabilir.

**Eşik kararı.** 011. dersteki gibi: gerçek sır, kritik bağımlılık ve yüksek imaj bulgusu durdurur; kalan uyarıdır. Mevcut bir projede önce "uyar" modunda başla.

**Pipeline'ı da koru.** 009. dersteki kuralları uygula: varsayılan `contents: read`, yazma yalnız gereken job'da, aksiyonlar SHA ile sabit, `pull_request_target` yok, girdi komuta gömülmüyor.

**Kapıyı zorunlu yap.** 010. dersteki dal korumada bu job'ları zorunlu durum kontrolü olarak işaretle ve kuralı yöneticilere de uygula. Aksi halde araç var, kapı yok.

### Yer tutucular hakkında

Görevdeki workflow'da `<SHA>` gördüğün yerleri kendi doğrulayacağın değerlerle doldurursun: her aksiyonun kendi deposundan, istediğin sürümün commit SHA'sı. `git ls-remote https://github.com/<sahip>/<depo> refs/tags/<sürüm>` komutu bir etiketin işaret ettiği commit'i verir; bunun resmi depodan geldiğini kontrol et. Bazı etiketler "annotated" olabilir ve `^{}` ile biten satır asıl commit'i gösterir. GitShield Action'ının kendi adını bilmiyorum; kendi deponda ne ise onu yaz.

### Tamamlandı kontrol listesi

- [ ] Sahte bir sır içeren PR, GitShield job'ını kırmızıya çevirdi.
- [ ] Eski sürümlü bir bağımlılık SCA job'ında bulgu verdi.
- [ ] Dal koruma, kırmızı PR'ın birleştirilmesini engelledi.
- [ ] Workflow'da `permissions`, SHA sabitleme ve `persist-credentials: false` var.
- [ ] Bir bulguyu gerekçeyle kapatmayı denedin ve kaydı bıraktın.

### Sonra ne?

Yedinci bölgede aynı düşünceyi container ve Kubernetes düzeyine, altyapı kodunun (IaC) taranmasına taşıyacaksın. Sekizinci bölgede ise bu pipeline'ın çıktısı bulut ve izleme zincirinin başlangıcı olacak.

**Güvenlik notu:** Bu derste gerçek anahtar kullanma. Test için yalnız sahte ve belgeli örnek değerler kullan, ve denemeleri yalnız kendi test deponda yap.
