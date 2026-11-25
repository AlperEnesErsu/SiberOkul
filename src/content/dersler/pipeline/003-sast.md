---
kimlik: pipeline-003
baslik: "SAST"
donem: 6
sira: 3
sure: 35
neden: "Kod incelemesinde gözden kaçan tehlikeli kalıpları (`eval`, SQL string birleştirme, zayıf kripto) makine her PR'da yakalayabilir. SAST aracı seçmek, kural yazmak ve en önemlisi gürültüyü yönetmek DevSecOps işinin günlük parçasıdır."
analoji:
  baslik: "Yazım denetimi"
  metin: "Word'ün yazım denetimi kırmızı çizgi çeker; bazıları gerçek hatadır, bazıları özel isimdir. Cümlenin anlamını, yani mantık hatasını bilmez. SAST de kodu çalıştırmadan kalıplara bakar: bilinen tehlikeli yapıları bulur ama 'bu kullanıcı bu veriyi görmeye yetkili mi?' sorusunu çoğu zaman anlayamaz."
gorev:
  aciklama: "Semgrep ile kendi yazdığın küçük bir kural çalıştıracaksın. Önce Semgrep'i kur: `pipx install semgrep` (pipx yoksa `sudo apt install pipx`). Hepsi /tmp altında çalışır, hiçbir şeyi değiştirmez."
  komutlar:
    - "mkdir -p /tmp/sast && cd /tmp/sast"
    - |
      cat > hedef.py <<'EOF'
      import os
      def calistir(kullanici_girdisi):
          return eval(kullanici_girdisi)
      def guvenli(x):
          return int(x) + 1
      EOF
    - |
      cat > kural.yml <<'EOF'
      rules:
        - id: eval-kullanimi
          pattern: eval(...)
          message: "eval kullanıcı girdisiyle kod çalıştırmaya yol açabilir"
          languages: [python]
          severity: ERROR
      EOF
    - "semgrep --config kural.yml hedef.py"
  soru: "Semgrep `guvenli` fonksiyonuna dokunmadı, `calistir` içindeki `eval`'i buldu. Ama `eval`'e verilen değer sabit bir metin olsaydı, sen bunu bulgu sayar mıydın? Aracın bunu ayırt etmesi için ne gerekir?"
  telefon:
    soru: "SAST aracı 200 bulgu üretti, bunların 180'i geliştiricilerce 'ilgisiz' bulundu. Bu durumun iki sonucu ne olur ve ne yaparsın?"
    cevap: "Geliştiriciler bulguları okumayı bırakır, gerçek 20 bulgu da kaybolur. Çözüm: gürültülü kuralları kapatmak ya da önemlerini düşürmek, yalnız yüksek güvenli kuralları PR'ı durduracak şekilde ayarlamak, kasıtlı istisnaları gerekçeyle işaretlemek."
sorular:
  - id: pipeline-003-s1
    soru: "SAST 'statik' ne demektir ve DAST'tan temel farkı nedir?"
    cevap: "Statik: kod çalıştırılmadan, kaynağı okunarak analiz edilir. DAST ise çalışan uygulamaya dışarıdan istek gönderir. SAST erken ve ucuzdur; DAST çalışma zamanı sorunlarını görür."
  - id: pipeline-003-s2
    soru: "Yanlış pozitif (false positive) ve yanlış negatif (false negative) nedir? Hangisi daha tehlikelidir?"
    cevap: "Yanlış pozitif: sorun olmayan yerde uyarı. Yanlış negatif: gerçek sorunu kaçırmak. Yanlış negatif daha tehlikelidir çünkü sahte bir güven verir; ama çok yanlış pozitif de uyarıların yok sayılmasına yol açar."
  - id: pipeline-003-s3
    soru: "SAST aracı 'temiz' çıktı. Bundan ne sonucu çıkarabilirsin, ne çıkaramazsın?"
    cevap: "Aracın kurallarındaki bilinen kalıplar bulunamadı sonucunu çıkarırsın. Kodun güvenli olduğunu çıkaramazsın; yetkilendirme mantığı, yapılandırma ve iş akışı hataları gibi sorunları SAST çoğu zaman göremez."
  - id: pipeline-003-s4
    soru: "Bir bulgunun gerçekten yanlış pozitif olduğuna karar verdin. Bunu nasıl kaydedersin?"
    cevap: "Satırı kural ya da araca özgü bir yorumla (ör. Semgrep'te `nosemgrep`) işaretleyip gerekçeyi yazarsın. Böylece karar kayıtlı kalır ve aynı bulgu her PR'da yeniden çıkmaz."
derinDalis:
  - tur: okuma
    baslik: "OWASP: Source Code Analysis Tools"
    ayrinti: "SAST araçlarının listesi ve sınırlamaları; hangi tür açıkları bulup hangilerini bulamadıklarını anlatır."
    url: "https://community.owasp.org/Source_Code_Analysis_Tools"
  - tur: lab
    baslik: "Semgrep CLI"
    ayrinti: "Kurulum, çıktı biçimleri (SARIF dahil) ve çıkış kodu davranışı. `semgrep scan` bulgu olsa da 0 döner; build'i durdurmak için `--error` gerekir."
    url: "https://docs.semgrep.dev/getting-started/cli"
---

**SAST** (Static Application Security Testing), uygulamayı çalıştırmadan kaynak koduna bakarak güvenlik sorunu arar. Pipeline'da genellikle her PR'da, testlerden önce ya da yanında çalışır.

### Nasıl çalışır?

Araç kodu bir **ağaca** (AST) çevirir ve kalıp arar. Üç seviye vardır:

- **Metin eşleşmesi:** `eval(` geçen satırlar. Hızlı ama kaba.
- **Yapısal eşleşme:** Semgrep gibi araçlar kodun yapısına bakar; boşluk ya da satır sonu farkı onları şaşırtmaz.
- **Veri akışı (taint) analizi:** Kullanıcı girdisi (kaynak) bir tehlikeli çağrıya (hedef) filtrelenmeden ulaşıyor mu? En güçlüsü ama en zor kısmı.

### Neyi bulur, neyi bulamaz?

İyi bulduğu: tehlikeli fonksiyonlar, sabit yazılmış kripto zayıflıkları, SQL'i metin birleştirerek kurma, basit XSS kalıpları.

Zor bulduğu: kimlik doğrulama ve erişim kontrolü mantığı, yapılandırma hataları, uygulamanın iş kuralları. OWASP'ın kendi sayfası da SAST'ın bu alanlarda sınırlı kaldığını söyler. Bu yüzden "araç temiz dedi" cümlesi güvenlik kanıtı değildir (bunu Efsane mi? kartında da göreceksin).

### Yanlış pozitifleri yönetmek

Her araç yanlış pozitif üretir. Yönetim yolları:

1. **Kural seçimi:** Başta az sayıda, yüksek güvenli kural aç; zamanla genişlet.
2. **Önem derecesi:** Yalnız `ERROR` seviyesi PR'ı kırsın, diğerleri bilgi olsun.
3. **Gerekçeli istisna:** Yanlış pozitifi yorumla işaretle, nedenini yaz.
4. **Geri bildirim:** Geliştiricilerden gelen "bu kural hep yanlış" itirazlarını dinle; yoksa araç terk edilir.

### Kendi kuralını yazmak

Semgrep kuralı kısa bir YAML'dir: `pattern`, `message`, `languages`, `severity`. Görevdeki gibi tek satırlık bir kural, şirkete özgü bir kuralı (örneğin "kendi şifreleme kütüphanemiz dışında kripto çağrısı yapma") yazmaya başlamak için yeterlidir. GitShield'in YAML kural dosyasına benzer bir mantık: veriyle tanımlanan kurallar, kodu değiştirmeden eklenir.

**Güvenlik notu:** Çıktıdaki bulgu bir iddiadır, kanıt değil. Her bulguyu kodu okuyarak doğrula; doğrulamadan "düzelttim" demek yeni hata ekleyebilir.
