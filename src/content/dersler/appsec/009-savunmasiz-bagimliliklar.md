---
kimlik: appsec-009
baslik: "Savunmasız bağımlılıklar"
donem: 5
sira: 9
sure: 30
neden: "Modern bir uygulamanın kodunun büyük kısmı senin değil; başkalarının yazdığı kütüphanelerdir. Birinde bilinen bir açık çıkınca senin uygulaman da etkilenir. Bağımlılıkları takip etmek, DevSecOps işinin en otomatikleştirilebilir ve en değerli parçalarından biridir."
analoji:
  baslik: "Yemeğin malzeme listesi ve geri çağırma"
  metin: "Bir restoran, kullandığı hazır sosta sorun çıktığında geri çağırma haberini duymazsa yemeği servis etmeye devam eder. Bağımlılık takibi, hangi 'hazır sosları' kullandığını bilmen ve geri çağırma duyurularını izlemendir. Sınırı: yemekte geri çağırma tek duyuruyla gelir; yazılımda seni uyaran bir tarama aracı kurmak sana düşer."
gorev:
  aciklama: "Geçici bir sanal ortam (venv) kur, eski bir `requests` sürümünü yazıp `pip-audit` aracıyla tara. Kurulum: Python paketleri `~/appsec/venv` içine iner, sistemi etkilemez; internet bağlantısı gerekir."
  komutlar:
    - "mkdir -p ~/appsec && cd ~/appsec"
    - "python3 -m venv venv && . venv/bin/activate"
    - "pip install pip-audit"
    - "printf 'requests==2.19.1\\n' > requirements.txt"
    - "pip-audit -r requirements.txt"
    - "deactivate"
  soru: "Araç bulguları hangi bilgiyle listeledi (paket, sürüm, açık kimliği, düzeltilmiş sürüm)? Bu çıktıdan sonra ilk eylemin ne olur?"
  telefon:
    soru: "Bir tarama raporunda 'lodash 4.17.10 → düzeltme 4.17.21' yazıyor. Bu bilgiyle ne yaparsın ve değişiklikten sonra neyi kontrol edersin?"
    cevap: "Bağımlılığı 4.17.21 ya da üstüne yükseltirsin (kilit dosyasını da güncelleyerek). Sonra testleri çalıştırır, uygulamanın hâlâ doğru çalıştığını ve taramanın artık bulgu vermediğini doğrularsın."
sorular:
  - id: appsec-009-s1
    soru: "Doğrudan ve dolaylı (transitive) bağımlılık arasındaki fark nedir ve neden önemlidir?"
    cevap: "Doğrudan bağımlılığı sen eklersin; dolaylı olan, onun kullandığı kütüphanelerdir. Açık çoğunlukla dolaylı bağımlılıkta çıkar; ona doğrudan dokunamazsın, doğrudan bağımlılığı güncellemek ya da üst sürüm zorlamak gerekir."
  - id: appsec-009-s2
    soru: "Kilit dosyası (lockfile) ve sürüm sabitleme ne işe yarar?"
    cevap: "Hangi sürümlerin kullanıldığını sabitler; derlemeler tekrarlanabilir olur ve bir kütüphanenin beklenmedik yeni (ya da ele geçirilmiş) sürümü sessizce içeri girmez. Güncellemeler bilinçli ve incelenerek yapılır."
  - id: appsec-009-s3
    soru: "Her şeyi sabitleyip hiç güncellememek neden bir çözüm değildir?"
    cevap: "Sabit sürümler zamanla bilinen açıklar biriktirir. Sabitleme tekrarlanabilirlik içindir; düzenli tarama ve güncelleme olmadan eski ve açıklı sürümlerde kalırsın."
  - id: appsec-009-s4
    soru: "Bir tarama aracı bulgu verdi ama kod o zafiyetli fonksiyonu hiç çağırmıyor. Bulgu yine de ele alınmalı mı?"
    cevap: "Önce etkilenebilirliği değerlendir: kullanılmıyorsa risk düşüktür ve gerekçesiyle belgeli bir istisna olabilir. Ama kod sonradan değişebilir ve araç her durumu bilemez; kalıcı çözüm yine de güncellemektir."
derinDalis:
  - tur: okuma
    baslik: "OWASP Vulnerable Dependency Management Cheat Sheet"
    ayrinti: "Bağımlılık taramasının nasıl kurulacağı ve bulgularla nasıl çalışılacağı."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html"
  - tur: okuma
    baslik: "pip-audit"
    ayrinti: "Python bağımlılıkları için açık tarama aracının sayfası ve kullanımı (PyPI)."
    url: "https://pypi.org/project/pip-audit/"
---

Bir web uygulaması genellikle düzinelerce doğrudan, yüzlerce dolaylı bağımlılık kullanır. Her biri senin uygulamanın saldırı yüzeyine eklenir. 2025 Top 10'daki "yazılım tedarik zinciri hataları" başlığı bu sorunu da kapsar.

### Açıklar nasıl duyurulur?

Bir kütüphanede açık bulunursa, açık **CVE** gibi bir kimlikle bir veri tabanına girer (temeller bölgesinde CVE/CVSS'i gördük), kütüphane güncellenir ve duyuru yapılır. Senin işin, **hangi sürümleri kullandığını bilmek** ve duyuru gelince fark etmektir.

### Bağımlılık taraması (SCA)

Yazılım bileşen analizi (SCA, software composition analysis) araçları, bağımlılık listeni açık veri tabanlarıyla karşılaştırır:

```bash
pip-audit -r requirements.txt     # Python
npm audit                         # Node.js
```

OWASP, taramanın projenin başından itibaren otomatik olmasını ve araçların açıkları **bulduğunu, düzeltmediğini** hatırlatır. Düzeltme sende: yükseltme, test, yayın.

### Sürüm sabitleme ve kilit dosyaları

```
# requirements.txt: sabit sürüm
requests==2.32.3
```

Kilit dosyaları (`package-lock.json`, `poetry.lock` gibi) dolaylı bağımlılıkların bile tam sürümlerini kaydeder. Faydası:

- Derleme her yerde aynı sonucu verir.
- Bir paketin beklenmedik yeni sürümü gizlice girmez.
- Hangi sürümü kullandığını kanıtlayabilirsin.

Ama sabitleme **yenilemeyi iptal etmez**. Düzenli güncelleme (ör. haftalık otomatik PR) ve düzenli tarama gerekir.

### Öncelik nasıl verilir?

1. **Ciddiyet (CVSS):** Kritik ve yüksek olanlar önce.
2. **Erişilebilirlik:** Zafiyetli kod yolu gerçekten kullanılıyor mu? İnternete açık servis mi?
3. **Düzeltme var mı?** Yoksa geçici önlem (devre dışı bırakma, kural) ve takip.
4. **Gürültü yönetimi:** İstisna tanımlıyorsan gerekçeyi ve bitiş tarihini yaz.

### Tedarik zinciri riskleri

Sadece bilinen açıklar değil, kötü niyetli paketler de vardır: yazım hatası taklitçileri (typosquatting), ele geçirilen paketler. Bu yüzden:

- Yalnız güvendiğin kaynaklardan ve bilinçli seçtiğin paketleri kullan.
- Kullanılmayan bağımlılıkları kaldır.
- Pipeline bölgesinde SBOM ve imzalama konularını göreceğiz.

Güvenlik notu: Bu dersteki `requests==2.19.1` örneği kasıtlı olarak eski bir sürümdür. Sadece tarama için kullanıldı, bir uygulamada çalıştırma. Gerçek projelerde her zaman güncel ve desteklenen sürümü seç.
