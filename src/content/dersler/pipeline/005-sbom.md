---
kimlik: pipeline-005
baslik: "SBOM"
donem: 6
sira: 5
sure: 30
neden: "Yeni bir zafiyet duyurulduğunda ilk soru 'Biz bunu kullanıyor muyuz?' olur. SBOM'u olmayan ekip bunu günlerce elle araştırır; olan ekip birkaç dakikada sorgular. Müşteriler ve düzenlemeler de giderek SBOM istiyor."
analoji:
  baslik: "Paketli gıdanın içindekiler listesi"
  metin: "Etikete bakarak fıstık alerjin olup olmadığını anlarsın. SBOM, yazılımın içindekiler listesidir: hangi bileşen, hangi sürüm, nereden. Sınırı: etiket yalnız ne olduğunu söyler, ürünün güvenli olduğunu söylemez; ayrıca etiket eskirse yanlış bilgi verir, o yüzden her build'de yeniden üretilir."
gorev:
  aciklama: "Syft ile bir dizinin SBOM'unu üreteceksin. Syft'i kurmak için aracın GitHub sayfasındaki (anchore/syft) kurulum yönergesini izle. Komutlar geçici klasörde çalışır, hiçbir şey değiştirmez. İnternet gerekebilir (Node paketi kuruyorsun)."
  komutlar:
    - "rm -rf /tmp/sbom && mkdir -p /tmp/sbom && cd /tmp/sbom && npm init -y >/dev/null && npm install lodash@4.17.21 --silent"
    - "syft . -o cyclonedx-json=sbom.cdx.json -o spdx-json=sbom.spdx.json"
    - "ls -l sbom.*"
    - "python3 -c \"import json;d=json.load(open('sbom.cdx.json'));print(d['bomFormat'],len(d['components']));[print(c['name'],c.get('version')) for c in d['components'][:5]]\""
  soru: "SBOM'daki bileşen sayısı, `package.json`'da yazdığın bağımlılık sayısından büyük çıktı mı? Neden?"
  telefon:
    soru: "Bir sabah yeni bir zafiyet duyuruldu: 'log4j-core 2.14 etkileniyor'. Elinde 40 uygulamanın SBOM dosyaları varsa ne yaparsın, yoksa ne olur?"
    cevap: "SBOM'larda 'log4j-core' ve sürümü aranır; etkilenen uygulamalar dakikalar içinde çıkar. SBOM yoksa her depoyu tek tek açıp elle bakmak gerekir. Bu hem yavaştır hem de geçişli bağımlılıklar kaçırılır."
sorular:
  - id: pipeline-005-s1
    soru: "SBOM'un açılımı nedir ve içinde ne bulunur?"
    cevap: "Software Bill of Materials, yani yazılım malzeme listesi. İçinde bileşenlerin adı, sürümü, kaynağı, lisansı ve çoğu zaman aralarındaki bağımlılık ilişkileri bulunur."
    ipucu: "Kelimeleri aç: 'bill of materials' bir malzeme listesidir."
  - id: pipeline-005-s2
    soru: "CycloneDX ve SPDX nedir? Birini seçmek zorunda mısın?"
    cevap: "İkisi de SBOM için standart biçimlerdir. CycloneDX güvenlik odaklı doğdu (OWASP/Ecma), SPDX lisans uyumu odaklı doğdu (ISO/IEC 5962). Araçlar çoğunlukla ikisini de üretir; müşterinin ya da düzenlemenin istediği biçimi seçersin."
    ipucu: "Biri güvenlik ve tedarik zinciri, diğeri lisans uyumu ile doğmuştu."
  - id: pipeline-005-s3
    soru: "SBOM tek başına neden güvenlik sağlamaz? Onu neyle birleştirirsin?"
    cevap: "SBOM yalnız envanterdir; bileşenin açıklı olup olmadığını söylemez. Açık veritabanlarıyla (SCA) eşleştirirsen işe yarar: 'bu envanterde bilinen açık var mı?' sorusunu her yeni duyuruda yeniden sorabilirsin."
    ipucu: "Liste ne söyler, bir şeyin güvenli olduğunu söyler mi? Listeyi neyle karşılaştırırsın?"
  - id: pipeline-005-s4
    soru: "SBOM'u ne zaman ve nerede üretmek gerekir?"
    cevap: "Build sırasında, yayına çıkan artefaktla birlikte (imaj ya da paket). Çünkü gerçekte gönderilen şeyi tarif etmesi gerekir; bir hafta önceki halin SBOM'u bugünkü ürünü doğru anlatmaz."
    ipucu: "Veritabanı her gün değişir; liste ne zaman üretilmeli?"
  - id: pipeline-005-s5
    soru: "Sabah yeni bir kütüphane açığı duyuruldu. Yöneticin 'bizde var mı, kaç uygulama etkileniyor?' diye soruyor. 30 servisin SBOM'ları depoda duruyor. Ne yaparsın?"
    cevap: "SBOM dosyalarında kütüphane adını ve etkilenen sürüm aralığını ararsın; bu bir toplu arama işidir. Etkilenen servislerin listesini çıkarır, önceliği internete açık olanlara verirsin. SBOM'ları ayrıca güncel zafiyet veritabanıyla yeniden taratırsın; SBOM eskiyse (bir süredir üretilmemişse) önce güncel build'lerden yenisini üretirsin."
    ipucu: "SBOM'un asıl değeri, soruyu elle arama yerine neye çevirmesiydi?"
hizliKontrol:
  - soru: SBOM'un temel işlevi hangisidir?
    secenekler:
      - Zafiyetleri otomatik yamalamak
      - Yazılımın hangi bileşenlerden oluştuğunu makine okunur biçimde listelemek
      - Koda saldırı denemek
      - Parolaları saklamak
    dogru: 1
    aciklama: SBOM bir envanterdir; ne taşıdığını söyler, güvenli olup olmadığını söylemez.
    ipucu: Malzeme listesi.
  - soru: Dün temiz çıkan bir SBOM bugün neden açıklı görünebilir?
    secenekler:
      - SBOM kendiliğinden değişir
      - Zafiyet veritabanı her gün yeni açıklarla güncellenir
      - Bileşenler gece sürüm atlar
      - Taranan dosya silinmiştir
    dogru: 1
    aciklama: SBOM sabittir ama veritabanı değişir; bu yüzden periyodik yeniden tarama gerekir.
    ipucu: Hangisi sabit, hangisi değişiyor?
sikHatalar:
  - hata: SBOM'u bir kez üretip dosyalamak.
    dogrusu: Her build'de yeniden üret ve eskileri düzenli olarak güncel veritabanlarıyla tara.
  - hata: SBOM'daki bileşenlerin güvenli olduğunu varsaymak.
    dogrusu: SBOM yalnız neyin içerildiğini söyler; açık var mı sorusu için bir tarayıcı ve veritabanı gerekir.
olay:
  baslik: Log4Shell (CVE-2021-44228)
  yil: 2021
  ozet: Aralık 2021'de Apache Log4j kütüphanesinde, kimlik doğrulaması gerektirmeden uzaktan kod çalıştırmaya izin veren kritik bir açık (CVE-2021-44228, 2.0-beta9 ile 2.14.1 arası sürümler) duyuruldu ve hızla istismar edildi. CISA kuruluşlara kendi geliştirdikleri yazılımlar, SaaS ve bulut kaynakları dahil bütün örnekleri bulmalarını önerdi.
  ders: Kütüphane başka yazılımların içinde gömülü olabildiği için 'nerede kullanıyoruz?' sorusu zordur. Güncel SBOM'lar bu soruyu bir aramaya çevirir.
  kaynak:
    ad: "CISA: Apache Log4j Vulnerability Guidance"
    url: https://www.cisa.gov/news-events/news/apache-log4j-vulnerability-guidance
terimler:
  - SBOM
  - CycloneDX
  - SPDX
  - SCA
derinDalis:
  - tur: lab
    baslik: "Syft"
    ayrinti: "Anchore'un SBOM üretme aracı. Kurulum ve `-o` ile çıktı biçimi seçme örnekleri README'de."
    url: "https://github.com/anchore/syft"
  - tur: okuma
    baslik: "CycloneDX"
    ayrinti: "OWASP ve Ecma tarafından geliştirilen SBOM standardı; hangi tür bileşen listelerini (SaaS, kripto, VEX) desteklediğine bak."
    url: "https://cyclonedx.org/"
  - tur: okuma
    baslik: "SPDX hakkında"
    ayrinti: "ISO/IEC 5962:2021 olan SBOM standardı; amacı ve kökeni."
    url: "https://spdx.dev/about/"
---

**SBOM** (Software Bill of Materials, yazılım malzeme listesi), bir yazılımın hangi bileşenlerden oluştuğunun makine tarafından okunabilir listesidir. Kendi yazdığın kod, çektiğin kütüphaneler, onların kütüphaneleri, bazen container imajındaki sistem paketleri.

### Neden gerekli?

Log4Shell gibi büyük bir zafiyet duyurulduğunda kuruluşlar "log4j'yi nerede kullanıyoruz?" sorusunu cevaplamak için haftalarca uğraştı. Çünkü kütüphane başka bir kütüphanenin içinde saklı olabiliyordu. SBOM bu soruyu bir arama işine çevirir.

Üç kullanım:

- **Zafiyet yanıtı:** Duyuru gelince envanterde ara.
- **Lisans uyumu:** Kullandığın bileşenlerin lisansları ürününle uyumlu mu?
- **Müşteri ve denetim:** Kamu ve büyük müşteriler giderek SBOM istiyor.

### İki standart

| | CycloneDX | SPDX |
|---|---|---|
| Doğuş amacı | Güvenlik ve tedarik zinciri | Lisans uyumu |
| Yönetim | OWASP + Ecma (ECMA-424) | Linux Vakfı, ISO/IEC 5962:2021 |
| Biçim | JSON, XML | JSON, tag-value ve diğerleri |

Hangisini seçeceğin çoğunlukla karşı tarafın isteğine bağlı. Syft gibi araçlar ikisini de üretir.

### Pipeline'da nasıl yer alır?

1. Build bitince artefakt (imaj ya da paket) için SBOM üret.
2. SBOM'u artefaktın yanında sakla (CI artefaktı ya da imaja iliştirilmiş kayıt).
3. Periyodik olarak SBOM'ları güncel zafiyet veritabanlarıyla yeniden tara. SBOM değişmez ama veritabanı her gün değişir; dün temiz olan bugün açıklı çıkabilir.

### Dikkat edilecekler

- **Doğruluk:** Araçlar bileşenleri paket yöneticisi dosyalarından bulur. Elle kopyalanmış bir kütüphane ya da derlemeye gömülmüş kod kaçabilir. SBOM "eksiksiz" demek değil, "bilinen en iyi liste" demektir.
- **Güncellik:** Eski SBOM yanıltıcıdır; her build'de yeniden üret.
- **Hassasiyet:** SBOM sürüm bilgilerini içerir; saldırgana yol gösterebilir. Dışarı verirken kime ne verdiğini düşün.

SBOM'u tek başına bir güvenlik kontrolü sanma: sorulara cevap vermeye yarayan bir **veri**dir, sonucu onu kullanan süreç belirler.

### SBOM ile zafiyet bilgisini birleştirmek: VEX

SBOM "içinde ne var" der. Ama bir bileşende açık olması, ürünün o açıktan **etkilendiği** anlamına gelmez: zayıf fonksiyon hiç çağrılmıyor olabilir. Bu ayrım için **VEX** (Vulnerability Exploitability eXchange) adlı ayrı bir belge türü kullanılır; üretici, belirli bir zafiyet için ürününün etkilenip etkilenmediğini bildirir. CISA da SBOM sayfasında VEX'i SBOM'dan ayrı bir kavram olarak anar. Yani SBOM envanter, VEX ise o envanterdeki bir bulgunun yorumudur.

Pratikte başlamak için: Syft gibi bir araçla imajdan SBOM üret, çıktıyı CI artefaktı olarak sakla, ve bir tarayıcıyla (ör. Grype ya da Trivy) bu SBOM'u zafiyet veritabanıyla eşleştir. Önce kendi küçük projende dene, sonra sürece bağla.

**Güvenlik notu:** SBOM üretmek bileşenlerin güvenli olduğunu kanıtlamaz; yalnız ne taşıdığını bildirir.
