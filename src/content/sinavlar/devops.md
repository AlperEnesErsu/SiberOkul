---
donem: 4
baslik: "Git, CI/CD ve Docker bölgesi sınavı"
sorular:
  - soru: "Bir ekip yılda iki kez, yüzlerce değişikliği birlikte yayınlıyor ve her yayında sorun çıkıyor. DevOps yaklaşımı ne önerir?"
    secenekler: [ "Yayın sayısını daha da azaltmak", "Küçük değişiklikleri sık sık, otomatik testlerle yayınlamak", "Testleri yalnız yayından önce elle yapmak", "Geliştirici ve operasyon ekiplerini iyice ayırmak" ]
    dogru: 1
    aciklama: "Küçük ve sık değişiklikte hata az sayıda değişikliğe daralır ve otomasyon geri bildirimi hızlandırır. Yılda iki büyük yayın hatanın kaynağını bulmayı zorlaştırır."
    ipucu: "Hatanın kaynağını daraltmak için değişiklik sayısının ne olması gerektiğini düşün."
  - soru: "CI ile CD arasındaki fark hangisidir?"
    secenekler: [ "CI her birleşmede otomatik derleme ve test yapar; CD doğrulanmış kodu yayına hazır tutar ya da çıkarır", "CI yayına çıkar, CD kodu derler", "İkisi aynı şeyin iki adıdır", "CI yalnız güvenlik taramasıdır" ]
    dogru: 0
    aciklama: "Sürekli entegrasyon birleşmeleri otomatik doğrular. Sürekli teslim/dağıtım ise doğrulanmış kodun yayına hazır tutulması veya çıkarılmasıdır."
    ipucu: "Biri her birleşmede doğrulama yapar, diğeri doğrulanmış kodun yayına hazır oluşuyla ilgilidir."
  - soru: "`git add notlar.txt` komutunu yazdın ama `git commit` yazmadın. `git log` bu değişikliği gösterir mi?"
    secenekler: [ "Evet, add commit yapar", "Hayır, çünkü dosya silinmiştir", "Evet ama yalnız uzak depoda", "Hayır, dosya yalnız hazırlık alanındadır; kayıt commit ile oluşur" ]
    dogru: 3
    aciklama: "add dosyayı hazırlık alanına (staging) alır. Tarihçeye girmesi için commit gerekir."
    ipucu: "`add` komutunun kodu hangi alana koyduğunu hatırla."
  - soru: "`git diff` hazırlık alanına eklenmemiş bir değişiklik için ne gösterir?"
    secenekler: [ "Yalnız dosya adlarını", "Uzak depodaki commit listesini", "Satır satır eklenen ve silinen içeriği", "Dalların listesini" ]
    dogru: 2
    aciklama: "git diff, çalışma dizinindeki değişikliği satır bazında gösterir. Dosya adları için git status, kayıtlar için git log kullanılır."
    ipucu: "Henüz hazırlanmamış değişikliklerin ayrıntı düzeyini düşün."
  - soru: "İki dalı birleştirirken Git `<<<<<<< HEAD` işaretleri içeren bir dosya bıraktı. Ne yapmalısın?"
    secenekler: [ "Hiçbir şey, Git kendisi çözecek", "Doğru sürüme karar verip işaretleri silmek, `git add` ile çözümü bildirmek ve commit atmak", "Dosyayı olduğu gibi commitlemek", "Depoyu silip yeniden klonlamak" ]
    dogru: 1
    aciklama: "İşaretlerin kalması dosyayı bozar. İnsan kararıyla düzeltip add + commit yaparsın; vazgeçmek için git merge --abort vardır."
    ipucu: "İşaret satırları dosyada kalırsa ne olur ve kararı kim verir?"
  - soru: "Bir yeni özelliği ana dalı bozmadan geliştirmek için ilk adım hangisidir?"
    secenekler: [ "`git switch -c ozellik` ile yeni dal açmak", "Doğrudan main üzerinde çalışmak", "Depoyu silip yeniden başlatmak", "`git merge` çalıştırmak" ]
    dogru: 0
    aciklama: "Yeni dal ana dalı etkilemeden izole çalışma sağlar; iş bitince PR ile birleştirilir."
    ipucu: "Ana dalı bozmadan denemek için önce bir izolasyon gerekir."
  - soru: "Ekip, `main` dalının hiçbir değişiklik inceleme ve CI kontrolü olmadan değişmemesini istiyor. Hangisi uygundur?"
    secenekler: [ "Herkese doğrudan push yetkisi vermek", "main dalını silmek", "Yalnız commit mesajı kuralı koymak", "Korumalı dal kuralı: PR, onaylı inceleme ve geçen durum kontrolleri zorunlu" ]
    dogru: 3
    aciklama: "Dal koruma kuralı inceleme ve durum kontrolü zorunluluğu getirir; tek bir hesap ele geçirilse bile kod doğrudan ana dala giremez."
    ipucu: "Tek hesap ele geçse bile kodun kimden geçmesi gerektiğini düşün."
  - soru: "Bir PR'da 1500 satırlık değişiklik var ve inceleyen 'iyi görünüyor' deyip onaylıyor. Bu neden sorundur?"
    secenekler: [ "İnceleme güvenlik için gereksizdir", "PR'da satır sınırı Git tarafından zorunludur", "Büyük PR'lar yeterince dikkatle okunamaz; küçük, tek amaçlı PR'lar tercih edilmeli", "Onay yalnız bir bot tarafından verilmelidir" ]
    dogru: 2
    aciklama: "Büyük değişiklikler dikkatle incelenmez ve açıklar gözden kaçar. Küçük PR'lar hem hata hem güvenlik sorununu yakalamayı kolaylaştırır."
    ipucu: "Bir insanın büyük bir değişikliği gerçekçi olarak ne kadar dikkatle okuyabileceğini düşün."
  - soru: "Bir geliştirici yanlışlıkla bulut anahtarını commitledi, sonra bir sonraki commitle dosyayı sildi. Önce ne yapılmalı?"
    secenekler: [ "Hiçbir şey, dosya silindi", "Anahtarı iptal edip yenisini üretmek (rotation)", "Depoyu private yapmak", "Yeni bir dal açmak" ]
    dogru: 1
    aciklama: "Eski commit tarihçede durur ve klonlarda olabilir. Önce anahtar iptal edilip döndürülür; tarihçe temizliği ikinci adımdır."
    ipucu: "Silinen dosya eski commit'te durur; ilk adım depoyla değil anahtarla ilgili."
  - soru: "`.gitignore` hakkında hangisi doğrudur?"
    secenekler: [ "Henüz izlenmeyen dosyaların yanlışlıkla eklenmesini önler", "Zaten commitlenmiş bir dosyayı tarihçeden siler", "Uzak depoyu şifreler", "Yalnız klasörleri gizler" ]
    dogru: 0
    aciklama: "`.gitignore` izlenmeyen dosyaların git add ile alınmasını engeller. Zaten commitlenmiş dosyayı ya da geçmişi etkilemez."
    ipucu: "`.gitignore` izlenen mi izlenmeyen dosyalar üzerinde etkilidir?"
  - soru: "GitHub Actions'ta `.github/workflows/ci.yml` dosyasında `on: pull_request` yazıyor. Bu ne anlama gelir?"
    secenekler: [ "Workflow her gece çalışır", "Workflow hiç çalışmaz", "Workflow yalnız elle başlatılır", "Workflow bir PR açıldığında ya da güncellendiğinde çalışır" ]
    dogru: 3
    aciklama: "`on` tetikleyiciyi belirler; pull_request, PR olaylarında çalıştırır. Zamanlı çalıştırma için schedule, elle için workflow_dispatch kullanılır."
    ipucu: "`on` anahtarının neyi belirlediğini düşün."
  - soru: "Workflow, job ve step ilişkisi hangisidir?"
    secenekler: [ "Step, job'ları içerir", "Job ve step aynı şeydir", "Workflow job'lardan, job step'lerden oluşur", "Workflow yalnız tek bir komuttur" ]
    dogru: 2
    aciklama: "Workflow bir olayla tetiklenen bütündür; içinde bir runner'da çalışan job'lar, job'ların içinde sıralı step'ler bulunur."
    ipucu: "En dıştan en içe: bütün süreç, iş, adım."
  - soru: "CI'da bir PR kırmızı ama geliştirici 'bende çalışıyor' diyor. Hangisi olası bir nedendir?"
    secenekler: [ "CI yalnız kırmızı sonuç verir", "CI temiz bir ortamda çalışır; sürüm, eksik ortam değişkeni ya da kararsız test farkı olabilir", "Test dosyaları depoda olamaz", "GitHub testleri çalıştırmaz" ]
    dogru: 1
    aciklama: "CI temiz makinede ve bildirilmiş sürümlerle çalışır. Fark genellikle ortamdan ya da kararsız testten gelir."
    ipucu: "CI'ın çalıştığı ortamla senin makinen arasındaki farkları say."
  - soru: "Bir ekip arkadaşı 'Container içinde çalışan uygulama sanal makine kadar izoledir, ekstra önlem gerekmez' diyor. Doğru cevap hangisi?"
    secenekler: [ "Yanlış, container host'un çekirdeğini paylaşır; izolasyonu zayıftır ve ek önlemler gerekir", "Doğru, container kendi çekirdeğini çalıştırır", "Doğru, çünkü container root'tur", "Yanlış, container hiç izolasyon sağlamaz" ]
    dogru: 0
    aciklama: "Container izole bir süreçtir ama çekirdek ortaktır. Çekirdek açıkları ya da aşırı yetkili ayarlar host'a etki edebilir."
    ipucu: "Container ile VM'in çekirdek konusundaki farkını hatırla."
  - soru: "`docker run --rm alpine echo merhaba` komutu bittiğinde container'a ne olur?"
    secenekler: [ "Arka planda çalışmaya devam eder", "Dondurulur", "İmajıyla birlikte silinir", "Otomatik silinir" ]
    dogru: 3
    aciklama: "`--rm` container çıkınca onu siler. İmaj yerel olarak kalır."
    ipucu: "`--rm` bayrağının imajı mı container'ı mı etkilediğini düşün."
  - soru: "Bir Dockerfile'da `COPY . .` en üste, bağımlılık kurulumu altına yazılmış. Build her seferinde yavaş. Neden ve nasıl düzeltilir?"
    secenekler: [ "RUN komutu COPY'den önce olmak zorundadır", "Docker önbellek kullanamaz, düzeltilemez", "Kodda her değişiklik altındaki katmanları geçersiz kılar; önce yalnız bağımlılık dosyasını kopyalayıp kur, sonra kodu kopyala", "`.dockerignore` yazmak yeterlidir" ]
    dogru: 2
    aciklama: "Katman önbelleği, değişen bir satırdan sonraki katmanları yeniden yapar. Seyrek değişeni üste, sık değişeni alta koymak önbelleği korur."
    ipucu: "Katman önbelleği değişen satırdan sonrasını ne yapar?"
  - soru: "Neden üretim imajında `FROM python:latest` yerine sabit sürüm ya da digest kullanılır?"
    secenekler: [ "latest etiketi Docker'da yasaktır", "Etiketler taşınabilir; sabitleme tekrarlanabilir build verir ve beklenmedik değişikliği engeller", "Digest imajı küçültür", "Sabit sürüm sırları saklar" ]
    dogru: 1
    aciklama: "Etiket sonradan başka imaja kayabilir. Sabit sürüm ya da digest aynı imajı almanı sağlar; bedel, yamaları kendin takip etmendir."
    ipucu: "Etiketin sonradan başka imaja taşınıp taşınamayacağını düşün."
  - soru: "Compose dosyasında veritabanı servisine `ports: - \"5432:5432\"` yazılmış ve servisi yalnız aynı dosyadaki web servisi kullanıyor. En iyi düzeltme hangisi?"
    secenekler: [ "Port yayınını kaldırmak (ya da `127.0.0.1:` ile sınırlamak); servisler Compose ağından adıyla erişir", "Portu olduğu gibi bırakmak", "Portu 5433'e değiştirmek", "Veritabanını web ile aynı container'a koymak" ]
    dogru: 0
    aciklama: "Yayınlanan port host'un ağına açılır. Servisler Compose ağında birbirine zaten adıyla ulaşır."
    ipucu: "Yayınlanan portun hangi arayüzlere açıldığını düşün; servisler ağda birbirini nasıl bulur?"
  - soru: "Bir Dockerfile'da `ARG API_KEY` ile build sırasında anahtar geçiriliyor. Sorun nedir ve doğru yol nedir?"
    secenekler: [ "Sorun yok, ARG gizlidir", "Anahtarı COPY ile ekleyip sonra silmek yeterlidir", "ARG yerine ENV daha güvenlidir", "Değer imaj kayıtlarında kalabilir; build sırları için secret mount, çalışma zamanı sırları için dışarıdan verme kullanılmalı" ]
    dogru: 3
    aciklama: "ARG ve ENV değerleri imajda kalır; sonraki katmanda silmek önceki katmanı yok etmez. Docker secret mount önerir."
    ipucu: "ARG ve ENV değerlerinin imajda ne olduğunu düşün; build sırları için özel bir mekanizma var."
---
