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
  - id: pipeline-005-s2
    soru: "CycloneDX ve SPDX nedir? Birini seçmek zorunda mısın?"
    cevap: "İkisi de SBOM için standart biçimlerdir. CycloneDX güvenlik odaklı doğdu (OWASP/Ecma), SPDX lisans uyumu odaklı doğdu (ISO/IEC 5962). Araçlar çoğunlukla ikisini de üretir; müşterinin ya da düzenlemenin istediği biçimi seçersin."
  - id: pipeline-005-s3
    soru: "SBOM tek başına neden güvenlik sağlamaz? Onu neyle birleştirirsin?"
    cevap: "SBOM yalnız envanterdir; bileşenin açıklı olup olmadığını söylemez. Açık veritabanlarıyla (SCA) eşleştirirsen işe yarar: 'bu envanterde bilinen açık var mı?' sorusunu her yeni duyuruda yeniden sorabilirsin."
  - id: pipeline-005-s4
    soru: "SBOM'u ne zaman ve nerede üretmek gerekir?"
    cevap: "Build sırasında, yayına çıkan artefaktla birlikte (imaj ya da paket). Çünkü gerçekte gönderilen şeyi tarif etmesi gerekir; bir hafta önceki halin SBOM'u bugünkü ürünü doğru anlatmaz."
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

**Güvenlik notu:** SBOM üretmek bileşenlerin güvenli olduğunu kanıtlamaz; yalnız ne taşıdığını bildirir.
