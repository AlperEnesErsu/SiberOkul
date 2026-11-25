---
kimlik: pipeline-011
baslik: "Güvenlik kapıları ve bulgu yönetimi"
donem: 6
sira: 11
sure: 35
neden: "Her bulguda build'i durduran pipeline kullanılmaz hale gelir; hiçbir şeyi durdurmayan pipeline ise süs olur. Eşiği doğru koymak ve bulguları takip etmek, güvenlik araçlarını gerçekten işe yarar kılan olgunluk işidir."
analoji:
  baslik: "Havalimanında kontrol noktası"
  metin: "Her yolcuyu durdurup bavulunu açsan hat kilitlenir; kimseyi durdurmasan kontrolün anlamı kalmaz. Kapı, belirli bir riskin üstündekileri durdurur, geri kalanını not alır. Sınırı: eşik bir karardır, hatasızlık garantisi değil; çok gevşek ya da çok sıkı koymak ikisi de zarar verir."
gorev:
  aciklama: "Elle küçük bir SARIF dosyası yazıp bir 'kapı' betiğiyle ağırlığa göre build'i durdurup durdurmayacağına karar vereceksin. Python3 yeterli. Dosya /tmp altında, veriler uydurmadır."
  komutlar:
    - |-
      mkdir -p /tmp/kapi && cd /tmp/kapi && cat > rapor.sarif <<'EOF'
      {"version":"2.1.0","runs":[{"tool":{"driver":{"name":"deneme-araci"}},"results":[
      {"ruleId":"gizli-anahtar","level":"error","message":{"text":"AWS anahtarı"},"locations":[{"physicalLocation":{"artifactLocation":{"uri":"app.py"},"region":{"startLine":3}}}]},
      {"ruleId":"zayif-hash","level":"warning","message":{"text":"md5 kullanımı"},"locations":[{"physicalLocation":{"artifactLocation":{"uri":"util.py"},"region":{"startLine":10}}}]},
      {"ruleId":"stil","level":"note","message":{"text":"uzun satır"},"locations":[{"physicalLocation":{"artifactLocation":{"uri":"util.py"},"region":{"startLine":40}}}]}
      ]}]}
      EOF
    - |-
      python3 - <<'EOF'
      import json, collections
      d = json.load(open('/tmp/kapi/rapor.sarif'))
      sonuc = d['runs'][0]['results']
      sayim = collections.Counter(r['level'] for r in sonuc)
      print(dict(sayim))
      for r in sonuc:
          loc = r['locations'][0]['physicalLocation']
          print(r['level'], r['ruleId'], loc['artifactLocation']['uri'], loc['region']['startLine'])
      EOF
    - |-
      python3 -c "import json,sys; d=json.load(open('/tmp/kapi/rapor.sarif')); n=sum(1 for r in d['runs'][0]['results'] if r['level']=='error'); print('KAPI KAPALI' if n else 'KAPI ACIK'); sys.exit(1 if n else 0)"; echo "çıkış kodu: $?"
  soru: "Kapı yalnız `error` seviyesinde kapanıyor. `warning` bulguları ne olacak ve onları kimin, ne zamana kadar çözmesi gerekir?"
  telefon:
    soru: "Bir ekip yeni bir tarayıcı ekledi ve ilk gün 400 bulgu çıktı. Hepsini hemen build'i durduran kapıya bağlarsan ne olur ve daha iyi bir başlangıç nasıl olur?"
    cevap: "Kimse PR birleştiremez, ekip aracı kapatır ya da atlatır. Daha iyi başlangıç: mevcut bulguları 'taban çizgisi' olarak kaydedip yalnız yeni gelenleri engellemek, önce yüksek ağırlık ve yüksek güvenli bulgularda kapıyı kapatmak, geri kalanlar için tarihli bir iyileştirme planı yapmaktır."
sorular:
  - id: pipeline-011-s1
    soru: "Bir bulgu build'i durdurmalı mı, yoksa sadece uyarı mı vermeli? Hangi ölçütlere bakarsın?"
    cevap: "Ağırlık, güvenilirlik (yanlış pozitif oranı), istismar kolaylığı ve düzeltme maliyeti. Yüksek ağırlıklı, güvenilir ve sömürülebilir bulgu (ör. gerçek bir sır) durdurur; düşük ağırlıklı ya da gürültülü bulgu uyarı olarak izlenir."
  - id: pipeline-011-s2
    soru: "SARIF nedir ve neden araçlar ortak bir biçim kullanır?"
    cevap: "Statik analiz sonuçları için standart bir JSON biçimidir. Her araç aynı biçimle bulgu üretince, GitHub gibi platformlar bulguları ortak biçimde okuyup PR üzerinde dosya ve satıra bağlı uyarıya çevirebilir, farklı araçlar tek ekranda toplanır."
  - id: pipeline-011-s3
    soru: "Bir bulguyu 'yanlış pozitif' ya da 'riski kabul ettim' diye kapatırken ne kaydetmelisin?"
    cevap: "Karar gerekçesini, kararı veren kişiyi, tarihi ve gerekiyorsa bitiş tarihini. Kayıtsız kapatılan bulgu, altı ay sonra kimsenin hatırlamadığı bir kör noktaya dönüşür."
  - id: pipeline-011-s4
    soru: "'Taban çizgisi' (baseline) yaklaşımı nedir ve ne zaman işe yarar?"
    cevap: "Var olan bulguların bir listesini kaydedip yalnız yeni eklenen bulgularda kapıyı kapatmaktır. Eski kodda yüzlerce bulgu bulunan bir projede aracı devreye almanın gerçekçi yoludur; eski borç ayrı bir planla eritilir."
derinDalis:
  - tur: okuma
    baslik: "GitHub: Code scanning için SARIF desteği"
    ayrinti: "GitHub'ın SARIF dosyalarından nasıl uyarı ürettiği, tekrar eden uyarıları nasıl eşleştirdiği ve yükleme sınırları."
    url: "https://docs.github.com/en/code-security/code-scanning/integrating-with-code-scanning/sarif-support-for-code-scanning"
  - tur: okuma
    baslik: "Semgrep CLI: çıkış kodları"
    ayrinti: "Bulguda build'i durdurmanın bir ayar gerektirdiğini gösterir: `semgrep scan` bulgu olsa da 0 döner, `--error` ile 1 döner."
    url: "https://docs.semgrep.dev/getting-started/cli"
---

Önceki derslerde bir sürü araç kurdun. Hepsi sonuç üretir; soru, sonucun **ne yapacağı**. Bu ders pipeline'ın "kapı" kısmını ve bulguların yaşam döngüsünü anlatıyor.

### Güvenlik kapısı (security gate)

Kapı, belirli bir koşulda pipeline'ı başarısız yapan kuraldır. Teknik olarak basit: araç sıfırdan farklı çıkış kodu döner, job kırmızı olur, dal korumasındaki "zorunlu durum kontrolü" birleştirmeyi engeller. Zor olan **eşiği** seçmektir.

Üç tipik seviye:

| Seviye | Ne olur | Örnek |
|---|---|---|
| Engelle | Build durur | Gerçek bir sır, kritik zafiyet, imzasız artefakt |
| Uyar | PR'a yorum, build geçer | Orta ağırlıklı SAST bulgusu |
| Kaydet | Panoda görünür | Düşük ağırlık, stil, bilgi |

Eşiği belirlerken: **yanlış pozitif oranı** (gürültülü kural engelleyemez), **düzeltme maliyeti** ve **istismar kolaylığı** dikkate alınır. Yeni bir aracı önce yalnız "uyar" modunda çalıştır, bulguların kalitesini gör, sonra güvenilir olanları "engelle"ye yükselt.

### Geliştirici deneyimi

Kapı herkesin işini etkiler. Kuralları:

- Hata mesajı **ne olduğunu, nerede olduğunu ve nasıl düzeltileceğini** söylesin.
- Araç hızlı olsun; 20 dakikalık tarama beklenmez, atlanır.
- İstisna yolu olsun (gerekçe ve onayla); yoksa insanlar kapıyı kapatmanın yolunu arar.

### SARIF

**SARIF** (Static Analysis Results Interchange Format), analiz sonuçları için JSON tabanlı standart biçimdir. Her sonuçta kural kimliği, ağırlık seviyesi (`error`, `warning`, `note`), mesaj ve dosya/satır konumu bulunur. GitHub bir SARIF dosyasını yükleyince bulguları "code scanning alerts" olarak PR üzerinde dosya ve satıra bağlı gösterir, aynı bulguyu çalışmalar arasında eşleştirerek tekrarı önler. Yükleme sınırları vardır (sıkıştırılmış dosya için 10 MB gibi), büyük raporlar kesilir.

GitShield de bulgularını SARIF olarak üretir; yani aynı sonuçlar yalnız terminalde kalmaz, GitHub'da PR'ın içinde görünür. Semgrep, Trivy ve gitleaks da SARIF verebildiği için bir araya getirmek kolaydır.

### Bulgunun yaşam döngüsü

1. **Tespit:** Araç bulur.
2. **Sınıflandırma:** Gerçek mi (true positive), yanlış pozitif mi? Önceliği ne?
3. **Atama:** Birinin adı olmalı. Sahipsiz bulgu çözülmez.
4. **Düzeltme ya da kabul:** Düzelt, ya da riski gerekçe ve bitiş tarihiyle kabul et.
5. **Doğrulama:** Sonraki taramada bulgu kaybolmalı.

### Metrikler

İyi bir pano şunları gösterir: açık bulgu sayısı ağırlığa göre, **düzeltme süresi** (bulunmadan kapanmaya), eski bulguların yaşı. "Bu ay 500 tarama yaptık" değil, "kritik bulguların ortalama düzeltme süresi 3 gün" anlamlıdır.

**Güvenlik notu:** Kapıyı yalnız "yeşil olsun" diye gevşetmek, bulguları gizlemektir. Eşiği veriye bakarak ve kayıt tutarak değiştir.
