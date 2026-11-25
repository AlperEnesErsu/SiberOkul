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
    ipucu: "Hem her build'i hem zaman içinde değişen veritabanını düşün."
  - id: pipeline-007-s2
    soru: "Daha küçük bir taban imajı (slim ya da alpine) neden genellikle daha az bulgu verir?"
    cevap: "İçinde daha az paket vardır; her paket potansiyel açık yüzeyidir. Küçük imaj aynı zamanda saldırgana daha az araç bırakır. Ama uyumluluk (ör. farklı libc) sorunları çıkabilir."
    ipucu: "Daha az paket ne demektir: açık yüzey açısından?"
  - id: pipeline-007-s3
    soru: "Taramada 'düzeltilmiş sürüm var' yazan bir paket görüyorsun. Çözüm genellikle nedir?"
    cevap: "Taban imajı güncel etikete yeniden build etmek ya da paketi yükseltmek. İmajı bir kez build edip aylarca yeniden build etmemek açıkların birikmesinin yaygın nedenidir."
    ipucu: "Bulgu hangi paketten geliyor, yamalı sürüm nerede çıkıyor?"
  - id: pipeline-007-s4
    soru: "Trivy imajda hangi tür sorunlara bakabilir?"
    cevap: "İşletim sistemi ve dil paketlerindeki bilinen zafiyetlere, imaja gömülmüş sırlara, yapılandırma hatalarına (misconfiguration) ve lisanslara. Hangi tarayıcıların açık olduğu `--scanners` ile seçilir."
    ipucu: "Zafiyetin dışında imaja girebilecek başka şeyleri düşün (Dockerfile, sırlar)."
  - id: pipeline-007-s5
    soru: "Trivy, `python:3.12` tabanlı imajında 40 HIGH bulgu veriyor; hepsi işletim sistemi paketlerinde. Ekip kodu yeniden yazmayı düşünüyor. Ne önerirsin?"
    cevap: "Bulgular kodundan değil taban imajdan geliyor, kodu yeniden yazmak işe yaramaz. Önce taban imajı güncelle ve yeniden build et; hâlâ çoksa `-slim` ya da distroless gibi daha küçük bir imaja geç ve uygulamanın çalıştığını test et. Çalışma zamanında kullanılmayan paketlerin bulgularını değerlendirip kalanı gerekçeyle kaydet."
    ipucu: "Bulgunun kaynağı katmanlardan hangisi? Kaldıraç orada."
hizliKontrol:
  - soru: Tarama imajda hangi sonuç türlerini verebilir?
    secenekler:
      - Yalnız ağ trafiği kayıtlarını
      - Zafiyet, yapılandırma hatası ve gömülü sır
      - Yalnız lisans metinlerini
      - Yalnız imajın boyutunu
    dogru: 1
    aciklama: Trivy paket zafiyetlerini, Dockerfile yapılandırma hatalarını ve katmanlara girmiş sırları arayabilir.
    ipucu: Dersteki üç madde.
  - soru: Neden 'en az bulgu = en güvenli' demek yanlıştır?
    secenekler:
      - Tarayıcılar hiç bulgu vermez
      - Tarayıcı yalnız bilinen açıkları sayar
      - Küçük imajlar çalışmaz
      - Bulgu sayısı zaten önemsizdir
    dogru: 1
    aciklama: Bilinmeyen açıklar ve mantık hataları sayılmaz; sıfır bulgu risk yok demek değildir.
    ipucu: Veritabanında olmayan şeyi tarayıcı bulur mu?
sikHatalar:
  - hata: Taban imajı `latest` ya da hareketli bir etiketle çekmek.
    dogrusu: Digest ile sabitle ve düzenli güncelle; tarama ile üretimde çalışan imaj aynı olsun.
  - hata: İmaj bir kez taranıp temiz çıktı diye sonsuza kadar güvenli saymak.
    dogrusu: Yeni açıklar keşfedilir; kayıt defterindeki imajları da düzenli yeniden tara.
sema:
  baslik: İmaj tarama akışı
  adimlar:
    - etiket: Build
      aciklama: CI imajı Dockerfile'dan oluşturur.
    - etiket: Tara
      aciklama: Trivy katmanlardaki paketleri zafiyet veritabanıyla eşleştirir.
    - etiket: Karar
      aciklama: HIGH/CRITICAL bulgu varsa ve düzeltmesi mevcutsa job başarısız olur.
    - etiket: Düzelt
      aciklama: Taban imaj güncellenir ya da daha küçük bir imaja geçilir.
    - etiket: Yayınla
      aciklama: Temiz imaj kayıt defterine gönderilir ve düzenli yeniden taranır.
terimler:
  - Trivy
  - Taban imaj
  - SCA
  - Digest
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

### Çok aşamalı build ile imajı küçültmek

Küçük imajın en pratik yolu **çok aşamalı build**'dir (multi-stage build). Birinci aşamada derleyici ve geliştirme araçlarıyla uygulamayı derlersin; ikinci aşamada yalnız çalışması gereken dosyaları temiz, küçük bir imaja kopyalarsın. Derleyici, paket önbelleği ve test araçları son imaja hiç girmez; bunlarla birlikte onların açıkları da girmez.

Bir de **kullanıcı** meselesi: imajda uygulamayı root olarak çalıştırmak, bir açık sömürülürse saldırgana geniş yetki verir. Dockerfile'da `USER` ile yetkisiz bir kullanıcıya geçmek, tarayıcının da işaretlediği basit ve etkili bir iyileştirmedir.

Son olarak sırlar: build sırasında bir parolayı `ENV` ya da `COPY` ile imaja koyarsan katmanda kalır ve imajı çeken herkes okur. Tarayıcı bunu "sır" olarak bulabilir ama en iyisi hiç koymamaktır.

**Güvenlik notu:** Tarama imajın içindekini sınar, onu kimin yaptığını doğrulamaz. Bunun için bir sonraki dersteki imzalama gerekir.
