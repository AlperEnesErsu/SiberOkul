---
kimlik: bulut-012
baslik: "Bitirme: uçtan uca DevSecOps"
donem: 8
sira: 12
sure: 40
neden: "DevSecOps tek bir araç değil, kodun yazıldığı andan üretimde izlendiği ana kadar süren bir zincirdir. Mülakatta ya da işte 'bir değişiklik bu zincirde nasıl güvenli ilerler?' sorusuna cevap verebilmek, bütün öğrendiklerini birleştirdiğini gösterir."
analoji:
  baslik: "Fabrika üretim hattı"
  metin: "Bir otomobil hattında her istasyonda bir kalite kontrolü vardır: parça gelirken, montajda, boyada, son testte. Hatayı hatta ne kadar erken yakalarsan düzeltmesi o kadar ucuzdur. Yine de müşteriye teslim sonrası da izlenir. Sınır: hat ne kadar iyi olursa olsun, tek bir istasyon atlanırsa zincir o noktadan zayıflar."
gorev:
  aciklama: "Yereldir, hiçbir şey kurmaz. `jq` gerekir (`sudo apt install -y jq`). Zincirin her halkasını bir kontrol listesine yazıp, küçük bir betikle hangi halkada kanıtın eksik olduğunu bulacaksın."
  komutlar:
    - |-
      cat > /tmp/zincir.json <<'EOF'
      [
       {"halka":"kod","kontrol":"sir taramasi (pre-commit)","kanit":true},
       {"halka":"pipeline","kontrol":"bagimlilik ve IaC taramasi","kanit":true},
       {"halka":"container","kontrol":"imaj taramasi, root olmayan kullanici","kanit":true},
       {"halka":"bulut-kimlik","kontrol":"en az yetkili IAM, rol kullanimi","kanit":true},
       {"halka":"bulut-ag","kontrol":"guvenlik grubunda 0.0.0.0/0 yok","kanit":false},
       {"halka":"depolama","kontrol":"Block Public Access + sifreleme","kanit":true},
       {"halka":"izleme","kontrol":"CloudTrail + alarm + SIEM kurali","kanit":false},
       {"halka":"kurtarma","kontrol":"degistirilemez yedek + geri yukleme denemesi","kanit":false}
      ]
      EOF
    - |-
      jq -r '.[] | select(.kanit==false) | "EKSIK: \(.halka) -> \(.kontrol)"' /tmp/zincir.json
    - |-
      jq -r '[.[] | select(.kanit==true)] | length as $ok | "\($ok)/8 halka kanitli"' /tmp/zincir.json
  soru: "Hangi üç halka eksik çıktı? Bunlardan hangisi bir olay anında en pahalıya mal olurdu, hangi dersin içeriğiyle kapatırdın?"
  telefon:
    soru: "Bir geliştirici koda sabit bir AWS anahtarı yazıp pull request açıyor. Zincirde bunu hangi iki halka yakalayabilir ve üçüncüsü neden son çare olur?"
    cevap: "Commit öncesi sır taraması ve pipeline'daki sır/IaC taraması yakalar. Üçüncüsü, yani CloudTrail ve alarm, sızıntı gerçekleşip anahtar kullanıldıktan sonra devreye girer; hasarı sınırlar ama önlemez."
sorular:
  - id: bulut-012-s1
    soru: "'Sola kaydırma' (shift left) ne demektir?"
    cevap: "Güvenlik kontrollerini sürecin başına, yani kod yazılırken ve derlenirken yapmak. Hata ne kadar erken bulunursa düzeltme maliyeti o kadar düşük olur."
  - id: bulut-012-s2
    soru: "Neden yalnız önleme değil, aynı zamanda izleme ve tespit de gerekir?"
    cevap: "Hiçbir önleme kusursuz değildir. Bir kontrol atlandığında ya da yeni bir zafiyet çıktığında izleme olayı fark ettirir, müdahale ve yedek de zararı sınırlar."
  - id: bulut-012-s3
    soru: "Zincirde bir halka zayıfsa diğerleri onu telafi eder mi? Örnek ver."
    cevap: "Kısmen. Örneğin sır taraması atlanıp anahtar sızsa, en az yetkili rol ve alarm hasarı küçültebilir. Ama hiçbir halka tamamen yerine geçmez; bu yüzden katmanlı savunma hedeflenir."
  - id: bulut-012-s4
    soru: "Bu programdaki bölgeleri DevSecOps zincirinde nereye yerleştirirsin?"
    cevap: "Linux ve ağ bölgeleri altyapı temelini, kod ve güvenlik bölgeleri geliştirme ve pipeline taramalarını, konteyner/Kubernetes üretim katmanını, bulut ve izleme bölgesi ise kimlik, depolama, kayıt, uyarı ve kurtarmayı oluşturur."
derinDalis:
  - tur: kitap
    baslik: "Accelerate (Forsgren, Humble, Kim)"
    ayrinti: "Yazılım teslim performansını etkileyen pratikler; güvenlik pratiklerinin teslim hızıyla nasıl birlikte gittiği."
---

Bu program boyunca parçaları ayrı ayrı gördün. Şimdi tek bir değişikliğin hayatını baştan sona izleyelim: bir geliştirici bir özellik ekliyor.

### 1. Kod

Geliştirici yeni kodu yazarken **commit öncesi taramalar** sır kaçağını (anahtar, parola) yakalar. Kodlama standartları ve inceleme (code review), aşırı yetkili bir IAM politikasının ya da `0.0.0.0/0` kuralının sızmasını durdurur (3. ve 4. dersler).

### 2. Pipeline

Pull request açılınca otomasyon çalışır: bağımlılık taraması, statik analiz, Terraform ya da CloudFormation dosyalarında altyapı güvenliği taraması (`Principal: "*"`, herkese açık bucket, şifresiz disk), testler. Pipeline bulutla **rolle** konuşur; uzun ömürlü anahtar saklamaz (2 ve 6. dersler).

### 3. Container

İmaj, bilinen zafiyetler için taranır, root olmayan kullanıcıyla çalıştırılır, imzalanır ve yalnız onaylı bir kayıt defterinden çekilir.

### 4. Bulut

İmaj; dar izinli bir rolle, özel alt ağda, güvenlik grubu yalnız gereken kaynağa izin verecek şekilde çalışır. Depolama herkese kapalı ve şifreli (5. ders). Sırlar Secrets Manager'dan gelir (6. ders).

### 5. İzleme ve tespit

CloudTrail açık, kayıtlar korumalı hesapta. Alarmlar belirti üzerine kurulu (8. ders). SIEM'de korelasyon kuralları kimlik ele geçirme, kalıcılık ve kayıt susturma desenlerini arar (9. ders); LogSentry'yi yazarken yaptığın işin büyük ölçekli hali.

### 6. Müdahale ve kurtarma

Bir şey ters giderse yazılı bir plan var: sınırla, kapsamı belirle, temizle, kurtar, öğren (10. ders). Yedekler ayrı hesapta, değiştirilemez ve denenmiş (11. ders).

### Zinciri tersten oku

Her olay bir halkanın eksikliğinden doğar. Bir olay incelemesinde şu soruyu sor: "Hangi halka bunu yakalayabilirdi ve neden yakalamadı?" Cevap, bir sonraki sprintin güvenlik işi olur.

### Ölçmek

Zincirin sağlığını sayılarla izle: sırların kaç dakikada rotasyona girdiği, açık yüksek riskli bulguların yaşı, alarmdan müdahaleye geçen süre, geri yükleme tatbikatının başarı oranı. Sayı yoksa iyileştirme de yoktur.

### Bundan sonrası

Bu program seni bir başlangıç noktasına getirdi. Bir sonraki adım, kendi küçük projeni baştan sona bu zincirle güvenli teslim etmek: gerçek bir repo, bir pipeline, bir container, bir (ücretsiz katman sınırlarında ve bütçe uyarısı kurulmuş) bulut hesabı ve LogSentry gibi kendi izleme aracın. Her halkada neyi neden yaptığını anlatabilirsen DevSecOps'un temelini öğrenmişsin demektir.

Güvenlik notu: Gerçek bir bulut hesabında deneme yapmadan önce faturalandırma uyarısı kur ve kök hesabı MFA ile koru; hata yapmanın bedeli burada ücrettir.
