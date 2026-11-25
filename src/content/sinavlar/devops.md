---
donem: 4
baslik: "Git, CI/CD ve Docker bölgesi sınavı"
sorular:
  - soru: "Bir ekip yılda iki kez, yüzlerce değişikliği birlikte yayınlıyor ve her yayında sorun çıkıyor. DevOps yaklaşımı ne önerir?"
    secenekler: ["Yayın sayısını daha da azaltmak", "Küçük değişiklikleri sık sık, otomatik testlerle yayınlamak", "Testleri yalnız yayından önce elle yapmak", "Geliştirici ve operasyon ekiplerini iyice ayırmak"]
    dogru: 1
    aciklama: "Küçük ve sık değişiklikte hata az sayıda değişikliğe daralır ve otomasyon geri bildirimi hızlandırır. Yılda iki büyük yayın hatanın kaynağını bulmayı zorlaştırır."
  - soru: "CI ile CD arasındaki fark hangisidir?"
    secenekler: ["CI yayına çıkar, CD kodu derler", "CI her birleşmede otomatik derleme ve test yapar; CD doğrulanmış kodu yayına hazır tutar ya da çıkarır", "İkisi aynı şeyin iki adıdır", "CI yalnız güvenlik taramasıdır"]
    dogru: 1
    aciklama: "Sürekli entegrasyon birleşmeleri otomatik doğrular. Sürekli teslim/dağıtım ise doğrulanmış kodun yayına hazır tutulması veya çıkarılmasıdır."
  - soru: "`git add notlar.txt` komutunu yazdın ama `git commit` yazmadın. `git log` bu değişikliği gösterir mi?"
    secenekler: ["Evet, add commit yapar", "Hayır, dosya yalnız hazırlık alanındadır; kayıt commit ile oluşur", "Evet ama yalnız uzak depoda", "Hayır, çünkü dosya silinmiştir"]
    dogru: 1
    aciklama: "add dosyayı hazırlık alanına (staging) alır. Tarihçeye girmesi için commit gerekir."
  - soru: "`git diff` hazırlık alanına eklenmemiş bir değişiklik için ne gösterir?"
    secenekler: ["Yalnız dosya adlarını", "Satır satır eklenen ve silinen içeriği", "Uzak depodaki commit listesini", "Dalların listesini"]
    dogru: 1
    aciklama: "git diff, çalışma dizinindeki değişikliği satır bazında gösterir. Dosya adları için git status, kayıtlar için git log kullanılır."
  - soru: "İki dalı birleştirirken Git `<<<<<<< HEAD` işaretleri içeren bir dosya bıraktı. Ne yapmalısın?"
    secenekler: ["Hiçbir şey, Git kendisi çözecek", "Doğru sürüme karar verip işaretleri silmek, `git add` ile çözümü bildirmek ve commit atmak", "Dosyayı olduğu gibi commitlemek", "Depoyu silip yeniden klonlamak"]
    dogru: 1
    aciklama: "İşaretlerin kalması dosyayı bozar. İnsan kararıyla düzeltip add + commit yaparsın; vazgeçmek için git merge --abort vardır."
  - soru: "Bir yeni özelliği ana dalı bozmadan geliştirmek için ilk adım hangisidir?"
    secenekler: ["Doğrudan main üzerinde çalışmak", "`git switch -c ozellik` ile yeni dal açmak", "Depoyu silip yeniden başlatmak", "`git merge` çalıştırmak"]
    dogru: 1
    aciklama: "Yeni dal ana dalı etkilemeden izole çalışma sağlar; iş bitince PR ile birleştirilir."
  - soru: "Ekip, `main` dalının hiçbir değişiklik inceleme ve CI kontrolü olmadan değişmemesini istiyor. Hangisi uygundur?"
    secenekler: ["Herkese doğrudan push yetkisi vermek", "Korumalı dal kuralı: PR, onaylı inceleme ve geçen durum kontrolleri zorunlu", "Yalnız commit mesajı kuralı koymak", "main dalını silmek"]
    dogru: 1
    aciklama: "Dal koruma kuralı inceleme ve durum kontrolü zorunluluğu getirir; tek bir hesap ele geçirilse bile kod doğrudan ana dala giremez."
  - soru: "Bir PR'da 1500 satırlık değişiklik var ve inceleyen 'iyi görünüyor' deyip onaylıyor. Bu neden sorundur?"
    secenekler: ["Büyük PR'lar yeterince dikkatle okunamaz; küçük, tek amaçlı PR'lar tercih edilmeli", "PR'da satır sınırı Git tarafından zorunludur", "İnceleme güvenlik için gereksizdir", "Onay yalnız bir bot tarafından verilmelidir"]
    dogru: 0
    aciklama: "Büyük değişiklikler dikkatle incelenmez ve açıklar gözden kaçar. Küçük PR'lar hem hata hem güvenlik sorununu yakalamayı kolaylaştırır."
  - soru: "Bir geliştirici yanlışlıkla bulut anahtarını commitledi, sonra bir sonraki commitle dosyayı sildi. Önce ne yapılmalı?"
    secenekler: ["Hiçbir şey, dosya silindi", "Anahtarı iptal edip yenisini üretmek (rotation)", "Depoyu private yapmak", "Yeni bir dal açmak"]
    dogru: 1
    aciklama: "Eski commit tarihçede durur ve klonlarda olabilir. Önce anahtar iptal edilip döndürülür; tarihçe temizliği ikinci adımdır."
  - soru: "`.gitignore` hakkında hangisi doğrudur?"
    secenekler: ["Zaten commitlenmiş bir dosyayı tarihçeden siler", "Henüz izlenmeyen dosyaların yanlışlıkla eklenmesini önler", "Uzak depoyu şifreler", "Yalnız klasörleri gizler"]
    dogru: 1
    aciklama: "`.gitignore` izlenmeyen dosyaların git add ile alınmasını engeller. Zaten commitlenmiş dosyayı ya da geçmişi etkilemez."
  - soru: "GitHub Actions'ta `.github/workflows/ci.yml` dosyasında `on: pull_request` yazıyor. Bu ne anlama gelir?"
    secenekler: ["Workflow her gece çalışır", "Workflow bir PR açıldığında ya da güncellendiğinde çalışır", "Workflow yalnız elle başlatılır", "Workflow hiç çalışmaz"]
    dogru: 1
    aciklama: "`on` tetikleyiciyi belirler; pull_request, PR olaylarında çalıştırır. Zamanlı çalıştırma için schedule, elle için workflow_dispatch kullanılır."
  - soru: "Workflow, job ve step ilişkisi hangisidir?"
    secenekler: ["Step, job'ları içerir", "Workflow job'lardan, job step'lerden oluşur", "Job ve step aynı şeydir", "Workflow yalnız tek bir komuttur"]
    dogru: 1
    aciklama: "Workflow bir olayla tetiklenen bütündür; içinde bir runner'da çalışan job'lar, job'ların içinde sıralı step'ler bulunur."
  - soru: "CI'da bir PR kırmızı ama geliştirici 'bende çalışıyor' diyor. Hangisi olası bir nedendir?"
    secenekler: ["CI yalnız kırmızı sonuç verir", "CI temiz bir ortamda çalışır; sürüm, eksik ortam değişkeni ya da kararsız test farkı olabilir", "Test dosyaları depoda olamaz", "GitHub testleri çalıştırmaz"]
    dogru: 1
    aciklama: "CI temiz makinede ve bildirilmiş sürümlerle çalışır. Fark genellikle ortamdan ya da kararsız testten gelir."
  - soru: "Bir ekip arkadaşı 'Container içinde çalışan uygulama sanal makine kadar izoledir, ekstra önlem gerekmez' diyor. Doğru cevap hangisi?"
    secenekler: ["Doğru, container kendi çekirdeğini çalıştırır", "Yanlış, container host'un çekirdeğini paylaşır; izolasyonu zayıftır ve ek önlemler gerekir", "Doğru, çünkü container root'tur", "Yanlış, container hiç izolasyon sağlamaz"]
    dogru: 1
    aciklama: "Container izole bir süreçtir ama çekirdek ortaktır. Çekirdek açıkları ya da aşırı yetkili ayarlar host'a etki edebilir."
  - soru: "`docker run --rm alpine echo merhaba` komutu bittiğinde container'a ne olur?"
    secenekler: ["Arka planda çalışmaya devam eder", "Otomatik silinir", "İmajıyla birlikte silinir", "Dondurulur"]
    dogru: 1
    aciklama: "`--rm` container çıkınca onu siler. İmaj yerel olarak kalır."
  - soru: "Bir Dockerfile'da `COPY . .` en üste, bağımlılık kurulumu altına yazılmış. Build her seferinde yavaş. Neden ve nasıl düzeltilir?"
    secenekler: ["Kodda her değişiklik altındaki katmanları geçersiz kılar; önce yalnız bağımlılık dosyasını kopyalayıp kur, sonra kodu kopyala", "Docker önbellek kullanamaz, düzeltilemez", "RUN komutu COPY'den önce olmak zorundadır", "`.dockerignore` yazmak yeterlidir"]
    dogru: 0
    aciklama: "Katman önbelleği, değişen bir satırdan sonraki katmanları yeniden yapar. Seyrek değişeni üste, sık değişeni alta koymak önbelleği korur."
  - soru: "Neden üretim imajında `FROM python:latest` yerine sabit sürüm ya da digest kullanılır?"
    secenekler: ["latest etiketi Docker'da yasaktır", "Etiketler taşınabilir; sabitleme tekrarlanabilir build verir ve beklenmedik değişikliği engeller", "Digest imajı küçültür", "Sabit sürüm sırları saklar"]
    dogru: 1
    aciklama: "Etiket sonradan başka imaja kayabilir. Sabit sürüm ya da digest aynı imajı almanı sağlar; bedel, yamaları kendin takip etmendir."
  - soru: "Compose dosyasında veritabanı servisine `ports: - \"5432:5432\"` yazılmış ve servisi yalnız aynı dosyadaki web servisi kullanıyor. En iyi düzeltme hangisi?"
    secenekler: ["Portu olduğu gibi bırakmak", "Port yayınını kaldırmak (ya da `127.0.0.1:` ile sınırlamak); servisler Compose ağından adıyla erişir", "Portu 5433'e değiştirmek", "Veritabanını web ile aynı container'a koymak"]
    dogru: 1
    aciklama: "Yayınlanan port host'un ağına açılır. Servisler Compose ağında birbirine zaten adıyla ulaşır."
  - soru: "Bir Dockerfile'da `ARG API_KEY` ile build sırasında anahtar geçiriliyor. Sorun nedir ve doğru yol nedir?"
    secenekler: ["Sorun yok, ARG gizlidir", "Değer imaj kayıtlarında kalabilir; build sırları için secret mount, çalışma zamanı sırları için dışarıdan verme kullanılmalı", "ARG yerine ENV daha güvenlidir", "Anahtarı COPY ile ekleyip sonra silmek yeterlidir"]
    dogru: 1
    aciklama: "ARG ve ENV değerleri imajda kalır; sonraki katmanda silmek önceki katmanı yok etmez. Docker secret mount önerir."
---
