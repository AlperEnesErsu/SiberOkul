---
kimlik: pipeline-008
baslik: "Tedarik zinciri ve imzalama"
donem: 6
sira: 8
sure: 35
neden: "Saldırganlar bazen kodunu değil, kodunun yolunu hedefler: build sunucusunu, bağımlılığı ya da yayın kanalını. İmza ve kaynak kanıtı (provenance), elindeki artefaktın gerçekten beklediğin yerden ve değişmeden geldiğini doğrulamanı sağlar."
analoji:
  baslik: "Mühürlü koli ve kargo takibi"
  metin: "Bir koli mühürlüyse açılmadığını anlarsın; kargo takibi de nereden çıkıp hangi depodan geçtiğini gösterir. İmza mühür, provenance takip kaydıdır. Sınırı: mühür kolinin içindeki ürünün sağlam olduğunu söylemez; yalnız yolda değiştirilmediğini söyler."
gorev:
  aciklama: "İmzanın mantığını openssl ile küçük ölçekte yaşayacaksın: dosyayı imzala, doğrula, sonra dosyayı değiştirip doğrulamanın başarısız olduğunu gör. Bu bir cosign değildir ama aynı fikirdir. Her şey /tmp altında, anahtarlar deneme anahtarlarıdır."
  komutlar:
    - "mkdir -p /tmp/imza && cd /tmp/imza && echo 'surum 1.0' > artefakt.txt"
    - "openssl genpkey -algorithm ed25519 -out gizli.pem && openssl pkey -in gizli.pem -pubout -out acik.pem"
    - "openssl pkeyutl -sign -inkey gizli.pem -rawin -in artefakt.txt -out artefakt.sig"
    - "openssl pkeyutl -verify -pubin -inkey acik.pem -rawin -in artefakt.txt -sigfile artefakt.sig"
    - "echo 'surum 1.0 + arka kapi' > artefakt.txt"
    - "openssl pkeyutl -verify -pubin -inkey acik.pem -rawin -in artefakt.txt -sigfile artefakt.sig"
  soru: "Son doğrulama neden başarısız oldu? Bu, bir saldırgan build çıktısını yolda değiştirirse sana ne kazandırır?"
  telefon:
    soru: "Bir ekip imzalama anahtarını depoya koyuyor. İmzalar hâlâ geçerli doğrulanıyor. Bu neden kötü bir durumdur ve cosign'ın 'anahtarsız' (keyless) yaklaşımı bunu nasıl çözer?"
    cevap: "Anahtarı okuyan herkes onların adına imza atabilir; imza artık 'bu ekipten' kanıtı olmaz. Keyless yöntemde uzun ömürlü anahtar yoktur: kısa ömürlü bir sertifika CI kimliğine (OIDC) bağlanır ve imza olayı herkese açık bir kayda (Rekor) yazılır."
sorular:
  - id: pipeline-008-s1
    soru: "Yazılım tedarik zinciri saldırısı nedir? Bir örnek yol söyle."
    cevap: "Hedef yazılımın kendisi yerine onu üreten ya da dağıtan halkaya saldırmaktır: ele geçirilmiş bir bağımlılık, bozulmuş build sunucusu, çalınmış yayın anahtarı ya da değiştirilmiş bir paket. Kullanıcı resmi kanaldan indirdiğini sanır."
    ipucu: "En zayıf halka kaynak koddan kullanıcıya giden yolun neresi olabilir?"
  - id: pipeline-008-s2
    soru: "İmza ile provenance (kaynak kanıtı) arasındaki fark nedir?"
    cevap: "İmza artefaktın belirli bir kimlik tarafından onaylandığını ve değişmediğini kanıtlar. Provenance ise onun nerede, hangi kaynaktan, hangi süreçle build edildiğini anlatan imzalı kayıttır. İmza kim, provenance nasıl sorusunu cevaplar."
    ipucu: "Biri 'kim onayladı', diğeri 'nasıl üretildi' sorusunu cevaplar."
  - id: pipeline-008-s3
    soru: "SLSA nedir? Build L1, L2 ve L3 kabaca neyi ayırır?"
    cevap: "SLSA, build sürecinin bütünlüğü için seviyeli bir çerçevedir. L1: provenance üretilir. L2: build ayrı bir platformda yapılır ve provenance imzalıdır. L3: build'ler birbirinden güçlü biçimde yalıtılır ve imza sırrı kullanıcı adımlarından saklanır."
    ipucu: "Seviyeler basamak basamak: her basamak build'e ne ekler?"
  - id: pipeline-008-s4
    soru: "Yüksek bir SLSA seviyesi yazılımın zafiyetsiz olduğunu gösterir mi?"
    cevap: "Hayır. SLSA artefaktın değiştirilmediğini ve beklenen platformda üretildiğini gösterir; kodun güvenli yazıldığı hakkında bir şey söylemez. SAST, SCA ve inceleme yine gerekir."
    ipucu: "Bütünlük ile kod kalitesi aynı şey mi?"
  - id: pipeline-008-s5
    soru: "Bir müşteri 'indirdiğimiz ikili dosyanın gerçekten sizin build'inizden çıktığını nasıl doğrularız?' diye soruyor. Ne yaparsın?"
    cevap: "Sürüm artefaktını CI'da imzalarsın (ör. cosign ile anahtarsız imza) ve imzalı provenance üretirsin. Müşteriye doğrulama komutunu ve beklenen kimliği (hangi depo ve workflow) belgelersin. Böylece dosyanın değişmediğini ve beklenen build'den çıktığını doğrulayabilir; yine de içinin zafiyetsiz olduğuna dair kanıt için tarama sonuçlarını ve SBOM'u da paylaşırsın."
    ipucu: "İmza hangi iki şeyi doğrular, tarama neden hâlâ gerekli?"
hizliKontrol:
  - soru: Provenance neyi söyler?
    secenekler:
      - Artefaktın nasıl, nereden ve hangi girdilerle üretildiğini
      - Artefaktın hiç açığı olmadığını
      - Artefaktın lisansını
      - Artefaktın kaç kez indirildiğini
    dogru: 0
    aciklama: Provenance, üretim kaynağının kanıtıdır (depo, commit, build platformu).
    ipucu: "'Nasıl üretildi'."
  - soru: Cosign'ın anahtarsız imzalamasında gizli anahtar neden saklanmaz?
    secenekler:
      - İmza hiç atılmaz
      - Anahtarı herkes bilir
      - Anahtar birkaç dakika yaşar ve CI kimliğine bağlı sertifika kullanılır
      - İmzayı kullanıcı elle atar
    dogru: 2
    aciklama: Kısa ömürlü anahtar ve sertifika kullanıldığından saklanacak ve çalınabilecek uzun ömürlü anahtar yoktur.
    ipucu: Anahtarın ömrü ne kadar?
sikHatalar:
  - hata: İmzalı imajı zafiyetsiz sanıp taramayı bırakmak.
    dogrusu: İmza kaynak ve bütünlüğü gösterir; içeriğin güvenliği için tarama ayrıca gerekir.
  - hata: İmza anahtarını depoda ya da herkesin okuyabildiği değişkende tutmak.
    dogrusu: Anahtarsız imzalama kullan ya da anahtarı yalnız yayın workflow'una verilen korumalı bir sırda tut.
olay:
  baslik: XZ Utils arka kapısı (CVE-2024-3094)
  yil: 2024
  ozet: Mart 2024'te yaygın kullanılan XZ Utils sıkıştırma kütüphanesinin 5.6.0 ve 5.6.1 sürümlerine kötü amaçlı kod eklendiği bildirildi (CVE-2024-3094). CISA, etkilenen sistemlerin 5.4.6 gibi etkilenmemiş bir sürüme geçmesini ve olası kötüye kullanım belirtilerini aramasını önerdi.
  ders: Yaygın kullanılan bir açık kaynak bileşen bile tedarik zincirinin zayıf halkası olabilir. Bağımlılıkları sürüm sabitleyip izlemek, kaynağı ve üretim yolunu doğrulanabilir kılmak bu tür olaylarda etkilenen sürümleri hızlı bulmayı sağlar.
  kaynak:
    ad: "CISA: Reported Supply Chain Compromise Affecting XZ Utils (CVE-2024-3094)"
    url: https://www.cisa.gov/news-events/alerts/2024/03/29/reported-supply-chain-compromise-affecting-xz-utils-data-compression-library-cve-2024-3094
sema:
  baslik: Anahtarsız imzalama ve doğrulama
  adimlar:
    - etiket: CI kimliği
      aciklama: Workflow bir OIDC kimlik belgesi alır; kimin çalıştığını kanıtlar.
    - etiket: Kısa ömürlü sertifika
      aciklama: Sigstore bu kimliği birkaç dakikalık bir sertifikaya bağlar.
    - etiket: İmzala
      aciklama: Cosign artefaktı geçici anahtarla imzalar.
    - etiket: Şeffaflık kaydı
      aciklama: İmza olayı herkese açık bir kayda (Rekor) yazılır.
    - etiket: Doğrula
      aciklama: Kullanıcı imzayı ve beklenen kimliği doğrulayıp sonra imajı çalıştırır.
terimler:
  - Provenance
  - Sigstore
  - SLSA
  - Tedarik zinciri saldırısı
  - Dijital imza
derinDalis:
  - tur: okuma
    baslik: "SLSA: build seviyeleri"
    ayrinti: "Build L1 ile L3 arasındaki gereksinimler. Önce 'about' sayfasından bakmak da faydalı."
    url: "https://slsa.dev/spec/v1.0/levels"
  - tur: okuma
    baslik: "Sigstore cosign: imzalamaya genel bakış"
    ayrinti: "Anahtarsız imzalama, Fulcio sertifikaları ve Rekor şeffaflık kaydının anlatımı."
    url: "https://docs.sigstore.dev/cosign/signing/overview/"
---

**Tedarik zinciri** (supply chain), kodun yazılmasından kullanıcıya ulaşmasına kadar geçen bütün halkalardır: kaynak depo, bağımlılıklar, build sistemi, kayıt defteri, dağıtım. Saldırgan en zayıf halkayı seçer. Bu yüzden "kodum temiz" cümlesi yetmez; "elimdeki artefakt benim temiz kodumdan mı çıktı?" sorusuna da cevap gerekir.

### İmzalama

Temeller bölgesinde dijital imzayı öğrendin (temeller-007): gizli anahtarla imzalarsın, herkes açık anahtarla doğrular. Yazılımda aynı fikir artefakta uygulanır: container imajı, ikili dosya, paket. Doğrulayan taraf iki şeyi öğrenir:

1. İçerik imzalandığından beri değişmedi.
2. İmzayı atan kimlik beklediğin kimlik.

Zor kısım anahtar yönetimidir. Uzun ömürlü gizli anahtar çalınabilir ya da sızar. **Sigstore** projesi ve onun aracı **cosign** bunu "anahtarsız" imzalama ile çözer: kısa ömürlü bir anahtar çifti üretilir, CI'ın kimliği (OIDC) kısa ömürlü bir sertifikaya bağlanır, imza olayı herkese açık bir şeffaflık kaydına (Rekor) yazılır. Gizli anahtar saklanmaz, çünkü yaşamı birkaç dakikadır.

### Provenance

İmza "kim onayladı" der. **Provenance** ise "nasıl üretildi" der: hangi depo, hangi commit, hangi build platformu, hangi girdilerle. İmzalı provenance, "bu imaj bu depodan, bu workflow ile çıktı" kanıtıdır. Dışarıdan biri imajı kendi makinesinde build edip yayınlamış olsa, provenance uyuşmaz.

### SLSA

**SLSA** (Supply-chain Levels for Software Artifacts, "salsa" okunur), build güvenliği için seviyeli bir çerçevedir:

| Seviye | Ne ister |
|---|---|
| Build L1 | Tutarlı bir build süreci ve provenance üretilmesi |
| Build L2 | Ayrılmış build platformu ve imzalı provenance |
| Build L3 | Build'lerin güçlü yalıtımı; imza sırrının kullanıcı adımlarından saklanması |

Seviyeler bir hedef merdivenidir; hepsini bir anda çıkmak gerekmez. GitHub Actions ile L2'ye yaklaşmak mümkündür.

### Ne yapmaz?

SLSA'nın kendi belgeleri bile bu sınırı söyler: SLSA, kodu yazanların güvenli kodlama yaptığı hakkında bir şey söylemez. Yani bir imaj imzalı ve L3 olsa da içinde açıklı bir kütüphane taşıyabilir. İmza ve tarama birbirinin yerine geçmez; ikisi birlikte "doğru yerden geldi" ve "içi temiz" kanıtlarını verir.

### Pratik adımlar

- Sürüm artefaktlarını imzala; kullanıcıya doğrulama komutunu belgele.
- Bağımlılıkları sabitle (kilit dosyası, imaj digest'i).
- Build'i geliştirici makinesinde değil, CI'da yap.
- İmzalama izinlerini yalnız yayın workflow'una ver (009. dersin konusu).

### Doğrulamayı kullanıcı tarafı yapmazsa imza işe yaramaz

İmzalamak yarım iştir. Kullanıcı ya da dağıtım sistemi imzayı **doğrulamıyorsa** imza süs olur. Doğrulamayı otomatikleştirmenin yolu, kümede ya da dağıtım adımında "yalnız belirli bir kimlikten imzalı imajlar çalışır" kuralı koymaktır (bunu container bölgesinde görüntüleyeceksin).

Doğrulama sırasında **kimliği de** denetle: sadece "imza geçerli" demek yetmez, imzayı atanın beklenen depo ve workflow olduğunu kontrol etmelisin. Aksi halde herhangi biri kendi anahtarıyla imzalayıp geçerli bir imza üretebilir.

Başlangıç için gerçekçi hedef: sürüm artefaktlarını CI'da imzala, provenance üret, bağımlılık ve taban imajları sabitle. SLSA seviyeleri sonra kendiliğinden yükselir.

**Güvenlik notu:** İmza anahtarı, imzalanan her şeyin güvenini taşır. Onu depoya, sohbete ya da herkesin okuyabildiği bir ortam değişkenine koyma.
