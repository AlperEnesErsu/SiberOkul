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
  - id: pipeline-008-s2
    soru: "İmza ile provenance (kaynak kanıtı) arasındaki fark nedir?"
    cevap: "İmza artefaktın belirli bir kimlik tarafından onaylandığını ve değişmediğini kanıtlar. Provenance ise onun nerede, hangi kaynaktan, hangi süreçle build edildiğini anlatan imzalı kayıttır. İmza kim, provenance nasıl sorusunu cevaplar."
  - id: pipeline-008-s3
    soru: "SLSA nedir? Build L1, L2 ve L3 kabaca neyi ayırır?"
    cevap: "SLSA, build sürecinin bütünlüğü için seviyeli bir çerçevedir. L1: provenance üretilir. L2: build ayrı bir platformda yapılır ve provenance imzalıdır. L3: build'ler birbirinden güçlü biçimde yalıtılır ve imza sırrı kullanıcı adımlarından saklanır."
  - id: pipeline-008-s4
    soru: "Yüksek bir SLSA seviyesi yazılımın zafiyetsiz olduğunu gösterir mi?"
    cevap: "Hayır. SLSA artefaktın değiştirilmediğini ve beklenen platformda üretildiğini gösterir; kodun güvenli yazıldığı hakkında bir şey söylemez. SAST, SCA ve inceleme yine gerekir."
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

**Güvenlik notu:** İmza anahtarı, imzalanan her şeyin güvenini taşır. Onu depoya, sohbete ya da herkesin okuyabildiği bir ortam değişkenine koyma.
