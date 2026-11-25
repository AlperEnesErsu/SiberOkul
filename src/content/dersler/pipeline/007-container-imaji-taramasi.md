---
kimlik: pipeline-007
baslik: "Container imajı taraması"
donem: 6
sira: 7
sure: 30
neden: "Bir container imajı, senin kodunun yanında işletim sistemi paketlerini ve kütüphaneleri de taşır; bunların çoğunu sen seçmedin. İmaj taraması bu gizli bagajdaki açıkları yayına çıkmadan bulur. Temel imaj seçimi de bulgu sayısını doğrudan belirler."
analoji:
  baslik: "Valiz kontrolü"
  metin: "Uçağa binmeden önce valiz taranır; içinde senin koyduğun eşyalar da vardır, daha önce kimin koyduğunu bilmediğin şeyler de. İmaj taraması valizin tamamına bakar. Sınırı: tarama yalnız bilinen yasaklı eşyaları tanır, ve valiz yola çıktıktan sonra yeni bir eşya yasaklanabilir."
gorev:
  aciklama: "Trivy ile üç farklı temel imajı karşılaştıracaksın. Docker gerekir. Trivy'yi kurmak için trivy.dev'deki kurulum yönergesini izle. İmajlar halka açık, tarama yerel yapılır; çıktıdaki sayılar zamanla değişir."
  komutlar:
    - "trivy image --severity HIGH,CRITICAL --scanners vuln python:3.12"
    - "trivy image --severity HIGH,CRITICAL --scanners vuln python:3.12-slim"
    - "trivy image --severity HIGH,CRITICAL --scanners vuln python:3.12-alpine"
    - "docker images python"
  soru: "Üç imajın bulgu sayısı ve boyutu birbirinden farklı çıktı. Bu farkın nedeni ne ve 'en az bulgu en güvenli imaj' sonucuna güvenmeli misin?"
  telefon:
    soru: "Bir imajda 'yüksek' ağırlıkta 12 bulgu var; hepsi taban imajın işletim sistemi paketlerinde ve 'düzeltme yok' (fix not available) yazıyor. Ne yaparsın?"
    cevap: "Önce paketin imajda gerçekten kullanılıp kullanılmadığına bakarsın; kullanılmıyorsa daha küçük bir taban imajına geçersin. Düzeltme yoksa riski kabul edip kayda geçer, yamalı sürüm çıkınca güncellersin. Bulguyu sessizce yok saymak yerine gerekçeli istisna yazılır."
sorular:
  - id: pipeline-007-s1
    soru: "İmaj taraması ne zaman ve nerede çalışmalıdır?"
    cevap: "Build'den sonra, imaj kayıt defterine itilmeden önce CI'da; ayrıca kayıt defterindeki imajlar periyodik yeniden taranır. Çünkü imaj değişmese bile yeni açıklar bildirilir."
  - id: pipeline-007-s2
    soru: "Daha küçük bir taban imajı (slim ya da alpine) neden genellikle daha az bulgu verir?"
    cevap: "İçinde daha az paket vardır; her paket potansiyel açık yüzeyidir. Küçük imaj aynı zamanda saldırgana daha az araç bırakır. Ama uyumluluk (ör. farklı libc) sorunları çıkabilir."
  - id: pipeline-007-s3
    soru: "Taramada 'düzeltilmiş sürüm var' yazan bir paket görüyorsun. Çözüm genellikle nedir?"
    cevap: "Taban imajı güncel etikete yeniden build etmek ya da paketi yükseltmek. İmajı bir kez build edip aylarca yeniden build etmemek açıkların birikmesinin yaygın nedenidir."
  - id: pipeline-007-s4
    soru: "Trivy imajda hangi tür sorunlara bakabilir?"
    cevap: "İşletim sistemi ve dil paketlerindeki bilinen zafiyetlere, imaja gömülmüş sırlara, yapılandırma hatalarına (misconfiguration) ve lisanslara. Hangi tarayıcıların açık olduğu `--scanners` ile seçilir."
derinDalis:
  - tur: okuma
    baslik: "Trivy: container imajı tarama"
    ayrinti: "`trivy image` komutu ve tarayıcı türleri (zafiyet, yapılandırma, sır, lisans)."
    url: "https://trivy.dev/latest/docs/target/container_image/"
---

Bir **container imajı** katmanlardan oluşur: taban imaj (ör. `python:3.12`), onun üstüne kurulan paketler, en üstte senin kodun. Taramada bu katmanların hepsi incelenir. Docker temellerini devops bölgesinde gördün; şimdi güvenlik tarafı.

### Taramadan ne beklenir?

**Trivy** gibi bir tarayıcı imajın içeriğini açar ve bulduğu paketleri zafiyet veritabanlarıyla eşleştirir. Üç tür sonuç verir:

- **Zafiyet:** İşletim sistemi (apt/apk) ve dil paketlerindeki bilinen açıklar.
- **Yapılandırma hatası:** Root kullanıcıyla çalışmak gibi Dockerfile zayıflıkları.
- **Sır:** İmaj katmanına girmiş anahtarlar. Bu yüzden devops-012'de sırları imaja koymamayı öğrenmiştin.

### Temel imaj seçimi: asıl kaldıraç

Bulguların çoğu senin kodundan değil, taban imajdan gelir. Seçenekler:

| Seçenek | Boyut | Bulgu | Not |
|---|---|---|---|
| Tam imaj (`python:3.12`) | Büyük | Çok | Hata ayıklama araçları dahil |
| `-slim` | Orta | Daha az | Genelde iyi denge |
| `-alpine` | Küçük | Genelde en az | Farklı C kütüphanesi, bazı paketlerle uyum sorunu |
| Distroless | Çok küçük | Çok az | Kabuk yok, hata ayıklaması zor |

Kural: **ihtiyacın olandan fazlasını imajda taşıma.** Her paket hem boyut hem saldırı yüzeyidir. Yine de "en az bulgu = en güvenli" demek yanlıştır: tarayıcı yalnız bilinen açıkları sayar.

### Bulguları nasıl yorumlarsın?

1. **Düzeltme var mı?** Varsa imajı yeniden build et.
2. **Paket kullanılıyor mu?** Çalışma zamanında yüklenmeyen bir paketteki açık daha az acildir.
3. **Düzeltme yoksa:** Daha küçük bir imaj dene, ya da riski gerekçeyle kabul edip kayda geç.
4. **Ağırlık eşiği:** CI'da yalnız `HIGH` ve `CRITICAL` bulgularda build'i durdurmak yaygın bir başlangıçtır.

### Zaman faktörü

Dün temiz olan imaj bugün açıklı çıkabilir, çünkü yeni açıklar keşfedilir. Bu yüzden iki şeyi birlikte yaparsın: her build'de tara, ve kayıt defterindeki canlı imajları düzenli yeniden tara.

### Tekrarlanabilirlik

Taban imajı `python:3.12` gibi bir etiketle çekersen, etiket zamanla başka bir imaja işaret edebilir. devops-010'da gördüğün **digest** ile sabitlersen tarama ve üretim aynı imajı ifade eder.

**Güvenlik notu:** Tarama imajın içindekini sınar, onu kimin yaptığını doğrulamaz. Bunun için bir sonraki dersteki imzalama gerekir.
