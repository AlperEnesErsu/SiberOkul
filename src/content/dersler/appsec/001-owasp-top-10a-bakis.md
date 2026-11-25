---
kimlik: appsec-001
baslik: "OWASP Top 10'a bakış"
donem: 5
sira: 1
sure: 25
neden: "Güvenlik açıklarının sayısı çok, zamanın az. OWASP Top 10, web uygulamalarında en sık ve en zararlı çıkan risk sınıflarının ortak dilidir. Kod incelemesinde, güvenlik taramalarının raporunda ve iş görüşmelerinde bu başlıklarla karşılaşırsın."
analoji:
  baslik: "Hastane acil servisinin triyaj panosu"
  metin: "Acil serviste her hastaya aynı anda bakılamaz; en sık ve en tehlikeli durumlar önce ele alınır. Top 10 de uygulama güvenliğinin triyaj panosudur: neye önce bakacağını söyler. Sınırı: panoda olmayan bir hastalık yok demek değildir; Top 10 tam bir kontrol listesi değil, bir başlangıçtır."
gorev:
  aciklama: "WSL'de bir çalışma klasörü aç, Top 10:2025 başlıklarını bir dosyaya yaz ve dosyada arama yap. Hepsi yerel; ağa bağlanmaz."
  komutlar:
    - "mkdir -p ~/appsec && cd ~/appsec"
    - |
      cat > top10.txt <<'EOF'
      A01 Broken Access Control
      A02 Security Misconfiguration
      A03 Software Supply Chain Failures
      A04 Cryptographic Failures
      A05 Injection
      A06 Insecure Design
      A07 Authentication Failures
      A08 Software or Data Integrity Failures
      A09 Security Logging and Alerting Failures
      A10 Mishandling of Exceptional Conditions
      EOF
    - "wc -l top10.txt"
    - "grep -n -i 'access\\|injection' top10.txt"
  soru: "Bu bölgedeki 12 dersten hangisi hangi Top 10 başlığına denk geliyor? En az üç eşleştirme yaz (ör. SQL injection → A05)."
  telefon:
    soru: "Bir uygulamada, giriş yapmış herhangi bir kullanıcı adres çubuğundaki sayıyı değiştirip başkasının faturasını görebiliyor. Hangi Top 10 başlığı?"
    cevap: "A01 Broken Access Control (erişim kontrolü bozukluğu). Sunucu, isteği yapanın o kayda erişme hakkını denetlemiyor."
sorular:
  - id: appsec-001-s1
    soru: "OWASP Top 10 nedir ve ne değildir?"
    cevap: "Web uygulamalarındaki en kritik risk sınıflarının, topluluk verisine dayanan, belli aralıklarla güncellenen bir farkındalık listesidir. Eksiksiz bir güvenlik standardı ya da 'bunları kapattım, güvendeyim' kontrol listesi değildir."
  - id: appsec-001-s2
    soru: "Liste neden zamanla değişir? Bir örnek ver."
    cevap: "Yazılım dünyası ve saldırı yöntemleri değişir. 2025 sürümünde yazılım tedarik zinciri sorunları ve istisnai durumların kötü yönetimi gibi başlıklar listede yer aldı; bu, risklerin kaydığını gösterir."
  - id: appsec-001-s3
    soru: "Bir tarama aracı 'A05 Injection' bulgusu veriyor. Bu bilgiyle ne yaparsın?"
    cevap: "Başlık yalnız sınıfı söyler. Bulgunun hangi dosya ve satırda olduğuna bakar, girdinin sorguya nasıl karıştığını anlar, sonra uygun düzeltmeyi (ör. parametreli sorgu) uygularsın."
  - id: appsec-001-s4
    soru: "Top 10'u bir uygulamanın tek güvenlik hedefi yapmak neden yetersizdir?"
    cevap: "Liste en yaygın riskleri kapsar, tüm riskleri değil. İş mantığı hataları ya da uygulamaya özgü tehditler listede olmayabilir; bunlar tehdit modelleme ve kod incelemesiyle bulunur."
derinDalis:
  - tur: okuma
    baslik: "OWASP Top 10:2025"
    ayrinti: "Her başlığın açıklaması, örnekleri ve önlemleri resmi sayfada."
    url: "https://top10.owasp.org/2025/"
  - tur: okuma
    baslik: "OWASP Cheat Sheet Series"
    ayrinti: "Aşağıdaki derslerde adım adım kullanacağımız, konu başına kısa uygulama rehberleri."
    url: "https://cheatsheetseries.owasp.org/"
---

**OWASP** (Open Worldwide Application Security Project) kâr amacı gütmeyen bir topluluktur. En bilinen çıktısı **Top 10** listesi: web uygulamalarında en kritik güvenlik risklerinin on başlıkta özeti. Veriler, güvenlik firmalarından ve topluluktan gelen gerçek bulgulara dayanır ve liste birkaç yılda bir güncellenir.

### Liste neyi gösterir?

Başlıklar tek tek açık değil, **risk sınıflarıdır**. "Injection" bir tek açığın adı değil; SQL, komut ya da şablon enjeksiyonu gibi pek çok açığı kapsayan bir aile.

Güncel (2025) sürümde başlıklar şunlar: erişim kontrolü bozukluğu, yanlış yapılandırma, yazılım tedarik zinciri hataları, kriptografik hatalar, injection, güvensiz tasarım, kimlik doğrulama hataları, yazılım ve veri bütünlüğü hataları, günlükleme ve uyarı eksikleri, istisnai durumların kötü yönetimi. Bu bölgede hepsinin önemli parçalarını tek tek işleyeceğiz.

### Nasıl kullanılır?

- **Ortak dil:** Bir bulguyu "A01" diye etiketlemek, ekibin aynı şeyden söz etmesini sağlar.
- **Önceliklendirme:** Zamanın kısıtlı olduğunda önce en yaygın sınıfları kapat.
- **Eğitim:** Geliştiricilere "bu sınıfta şu hata sık yapılır" demek için iyi bir çerçeve.
- **Araç raporları:** SAST, DAST ve SCA araçları (Pipeline bölgesinde göreceğiz) bulguları çoğunlukla bu başlıklara eşler.

### Neyi yapmamalı?

Top 10 bir **uyumluluk kontrol listesi** değildir. "On maddeyi kapattım, güvendeyim" demek yanıltıcıdır. Listede olmayan riskler de var; uygulamanın kendi iş mantığına özgü hatalar özellikle. Bunları bulmak için tehdit modelleme (ders 11) ve kod incelemesi (ders 12) gerekir.

### Bu bölgenin haritası

| Ders | Konu | Top 10 ile ilişki |
|---|---|---|
| 002-003 | Girdi doğrulama, SQL injection | Injection |
| 004 | XSS | Injection |
| 005-006 | CSRF, kimlik doğrulama | Authentication Failures |
| 007 | IDOR | Broken Access Control |
| 008 | Güvenlik başlıkları | Security Misconfiguration |
| 009 | Savunmasız bağımlılıklar | Supply Chain Failures |

Güvenlik notu: Bu bölgedeki açık örnekleri yalnız kendi bilgisayarındaki küçük deneme uygulamalarında çalıştır. Başkasına ait bir siteye "deneme" amaçlı bile olsa saldırı yasa dışıdır.
