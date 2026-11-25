---
kimlik: appsec-011
baslik: "Tehdit modelleme"
donem: 5
sira: 11
sure: 30
neden: "Açıkların bir kısmı kodda değil tasarımdadır; sonradan yamayla düzeltilemez. Tehdit modelleme, kod yazılmadan önce 'ne ters gidebilir?' sorusunu sistematik sorar. DevSecOps mühendisi tasarım toplantılarında bu soruyu soran kişidir."
analoji:
  baslik: "Evin planına bakıp 'hırsız nereden girer?' demek"
  metin: "Ev inşa edilmeden plana bakıp pencerelerin, kapıların, çatı kapağının yerini düşünürsün. Hırsız nereden girer, değerli eşya nerede, kim anahtarı taşır? Duvarları yıkıp yeniden yapmaktan ucuzdur. Sınırı: plan kusursuz olsa da inşaat hatalıysa açık kalır; tehdit modelleme kod incelemesi ve testin yerine geçmez."
gorev:
  aciklama: "Basit bir 'not defteri' uygulaması için metin tabanlı bir veri akış diyagramı ve STRIDE tablosu yaz; dosyada arama yap. Yalnız dosya işlemi, güvenli."
  komutlar:
    - "mkdir -p ~/appsec && cd ~/appsec"
    - |
      cat > tehdit_modeli.txt <<'EOF'
      VERI AKISI
      Kullanici (tarayici) --HTTPS--> Web sunucusu --SQL--> Veri tabani
      Guven siniri 1: internet | sunucu
      Guven siniri 2: sunucu | veri tabani

      STRIDE
      S Spoofing        : Baskasinin oturumunu calma -> MFA, guvenli cerez
      T Tampering       : Istegi degistirme (not_id) -> sahiplik kontrolu
      R Repudiation     : "Ben silmedim" -> denetim kaydi
      I Info disclosure : Hata mesajinda SQL -> genel hata mesaji
      D Denial of service: Sinirsiz istek -> hiz siniri
      E Elevation       : Kullanici admin islevine erisir -> rol kontrolu
      EOF
    - "cat tehdit_modeli.txt"
    - "grep -c '^[STRIDE] ' tehdit_modeli.txt"
  soru: "Kendi seçtiğin bir uygulama için (ör. fotoğraf paylaşım sitesi) iki güven sınırı ve üç tehdit yaz. Her tehdit için bir önlem öner."
  telefon:
    soru: "Bir tehdit modelinde 'saldırgan, başka bir kullanıcı adına işlem yapabilir' yazıyor. Bu STRIDE'ın hangi harfidir ve tipik bir önlem nedir?"
    cevap: "S, Spoofing (kimlik taklidi). Önlem: güçlü kimlik doğrulama, MFA, güvenli oturum çerezi ve oturum yönetimi."
sorular:
  - id: appsec-011-s1
    soru: "Tehdit modellemenin dört temel sorusu nedir?"
    cevap: "Ne üzerinde çalışıyoruz? Ne ters gidebilir? Bunun için ne yapacağız? Yeterince iyi yaptık mı? (Tehdit Modelleme Manifestosu'ndaki yaklaşım.)"
    ipucu: "Dört sorunun ilkini hatırla: ne üzerinde çalışıyoruz?"
  - id: appsec-011-s2
    soru: "STRIDE'ın altı harfi neyi temsil eder?"
    cevap: "Spoofing (kimlik taklidi), Tampering (veriyi değiştirme), Repudiation (inkâr), Information disclosure (bilgi sızması), Denial of service (hizmet engelleme), Elevation of privilege (yetki yükseltme)."
    ipucu: "Her harf bir güvenlik özelliğinin ihlalidir; bunu eşleştir."
  - id: appsec-011-s3
    soru: "Veri akış diyagramında 'güven sınırı' (trust boundary) neden önemlidir?"
    cevap: "Verinin güven düzeyi değiştiği yeri gösterir (ör. internet → sunucu). Tehditlerin çoğu, veri bu sınırı geçerken doğrulanmadığında ortaya çıkar; savunmalar bu noktalara konur."
    ipucu: "Güven düzeyinin değiştiği yerde saldırgan ne yapabilir?"
  - id: appsec-011-s4
    soru: "Tehdit modelleme neden tasarım aşamasında yapılırsa daha değerlidir?"
    cevap: "Tasarım hataları (ör. yetkilendirmenin hiç düşünülmemesi) sonradan kodu yamamakla çözülemez, pahalı yeniden tasarım gerektirir. Erken fark etmek, maliyeti ve riski düşürür."
    ipucu: "Tasarım aşamasında düzeltmek ile canlıda düzeltmek maliyetçe kıyaslanır mı?"
  - id: appsec-011-s5
    soru: Yeni bir ödeme özelliği iki hafta sonra yayına çıkıyor ve henüz güvenlik gözden geçirmesi yapılmadı. Tek bir saatlik toplantı yapabilsen ne yaparsın?
    cevap: "Ekranda hızlı bir veri akış diyagramı çizersin: kullanıcı, uygulama, ödeme sağlayıcısı, veri tabanı ve güven sınırları. Her sınırda STRIDE'ın altı harfini dolaşıp tehditleri listeler, en riskli üçünü seçip sahip ve önlem atarsın. Çıkan işleri iş listesine yazar, yayından önce kapatılacak olanları işaretlersin."
    ipucu: Küçük bir çizim, STRIDE ve sahipli aksiyonlar.
derinDalis:
  - tur: okuma
    baslik: "OWASP Threat Modeling Cheat Sheet"
    ayrinti: "Dört soru, veri akış diyagramları, STRIDE ile tehdit belirleme."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
hizliKontrol:
  - soru: Veri akış diyagramında güven sınırı neyi gösterir?
    secenekler:
      - Verinin sıkıştırıldığı yeri
      - Güven düzeyinin değiştiği, verinin bir tarafından ötekine geçtiği yeri
      - Veri tabanı yedeklerini
      - Yalnız ağ güvenlik duvarını
    dogru: 1
    aciklama: Saldırıların çoğu, güvenilmeyen verinin güvenilen bölgeye girdiği sınırlarda aranır.
    ipucu: Veri 'güvenilmeyen' taraftan 'güvenilen' tarafa geçerken ne olur?
sikHatalar:
  - hata: Tehdit modellemeyi canlıya çıkıştan hemen önce yapmak.
    dogrusu: Tasarım aşamasında yap; düzeltme maliyeti en düşük o zamandır.
  - hata: Tehditleri bulup listeleyip bırakmak.
    dogrusu: Her tehdit için önlem, sahip ve tarih belirle; yoksa liste işe yaramaz.
sema:
  baslik: Tehdit modelleme adımları
  adimlar:
    - etiket: Kapsam
      aciklama: Neyi modellediğini ve neyi korumak istediğini belirle.
    - etiket: DFD
      aciklama: Veri akış diyagramını çiz ve güven sınırlarını işaretle.
    - etiket: STRIDE
      aciklama: Her öğe ve akış için altı tehdit türünü sorgula.
    - etiket: Önlem
      aciklama: Her tehdide azaltma, kabul ya da devretme kararı ver.
    - etiket: Kayıt
      aciklama: Kararları sahip ve tarihle kaydet, değişiklikte yeniden gözden geçir.
terimler:
  - Tehdit modelleme
  - STRIDE
  - Güven sınırı
---

**Tehdit modelleme**, bir sistemi saldırgan gözüyle incelemenin yapılandırılmış yoludur. Amaç, açıkları tek tek değil, **tasarım düzeyinde** önceden görmek. "Güvensiz tasarım" Top 10'da ayrı bir başlıktır; çünkü mükemmel kodlanmış kötü tasarım yine de savunmasızdır.

### Dört soru

1. **Ne üzerinde çalışıyoruz?** Sistemi çiz.
2. **Ne ters gidebilir?** Tehditleri say.
3. **Bunun için ne yapacağız?** Önlem ya da kabul kararı ver.
4. **Yeterince iyi yaptık mı?** Gözden geçir, güncelle.

### Adım 1: Veri akış diyagramı (DFD)

Sistemin parçalarını ve aralarındaki veri akışını çizersin:

- **Dış varlıklar:** kullanıcı, harici servis.
- **Süreçler:** web sunucusu, API.
- **Veri depoları:** veri tabanı, dosya deposu.
- **Veri akışları:** oklar.
- **Güven sınırları:** güven düzeyinin değiştiği çizgiler (internet ile sunucu arası gibi).

Tehditler en çok güven sınırlarını geçen akışlarda yoğunlaşır; incelemeni oraya odakla.

### Adım 2: STRIDE ile tehdit bulma

Her bileşen ve akış için altı soruyu sor:

| Harf | Tehdit | Zedelenen özellik | Örnek önlem |
|---|---|---|---|
| S | Spoofing (taklit) | Kimlik doğrulama | MFA |
| T | Tampering (değiştirme) | Bütünlük | İmza, doğrulama |
| R | Repudiation (inkâr) | İnkâr edilemezlik | Denetim kayıtları |
| I | Information disclosure | Gizlilik | Şifreleme, yetki |
| D | Denial of service | Erişilebilirlik | Hız sınırı |
| E | Elevation of privilege | Yetkilendirme | En az yetki |

STRIDE'ı bir kontrol listesi gibi kullan: her akış için "burada T olabilir mi?" diye bak.

### Adım 3: Önlem ve kayıt

Her tehdit için dört seçenek vardır: **azalt** (kontrol ekle), **ortadan kaldır** (özelliği çıkar), **aktar** (sigorta, sağlayıcı), **kabul et** (bilinçli, kayıtlı). Kararı yazılı tut; bir tabloda, depodaki bir dosyada.

### Pratikte

- Her yeni özellikte küçük bir model yap; 30 dakikayı geçmesin.
- Diyagramı ve tehdit listesini kodla birlikte depoda tut.
- Bulduğun önlemleri görev (issue) olarak aç, test yaz.
- Mimari değiştikçe modeli güncelle.

Güvenlik notu: Tehdit modeli hassas bilgi içerir (zayıf noktaların listesi). Bu belgeyi herkese açık bir depoya koyma; erişimini projeyle sınırla.
