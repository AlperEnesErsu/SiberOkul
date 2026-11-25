---
donem: 6
baslik: "Pipeline güvenliği bölgesi sınavı"
sorular:
  - soru: "Bir ekip güvenlik kontrollerini PR aşamasına çekti; önceden yayından hemen önce yapılıyordu. Bu değişikliğin temel kazancı nedir?"
    secenekler: [ "Güvenlik ekibine artık hiç ihtiyaç kalmaması", "Hataların kod henüz tazeyken, daha ucuza düzeltilmesi", "Çalışan uygulamanın artık test edilmesine gerek kalmaması", "Bütün bulguların otomatik olarak kapanması" ]
    dogru: 1
    aciklama: "Sola kaydırma, hatayı ucuz olduğu erken adımda yakalamaktır. Güvenlik ekibi ve çalışma zamanı testleri (DAST, izleme) yine gerekir; araçlar bulguyu kendiliğinden kapatmaz."
  - soru: "Bir geliştirici pre-commit kancasını kurmadan commit attı ve kodda sahte olmayan bir API anahtarı var. Hangi önlem bunu yine de yakalar?"
    secenekler: [ "Aynı sır taramasını PR'da CI job'ı olarak zorunlu çalıştırmak", "Kancayı yalnız geliştiricilere öğütlemek", "Anahtarı README'ye not etmek", "Commit mesajına uyarı yazmak" ]
    dogru: 0
    aciklama: "Yerel kanca atlanabilir (kurulmaması, `--no-verify`). CI'daki tarama atlanamaz ve zorunlu durum kontrolü yapılırsa birleştirmeyi engeller."
  - soru: "Taramada gerçek bir bulut anahtarı bulundu ve kod hemen silinip yeni commit atıldı. Asıl eksik ne?"
    secenekler: [ "Commit mesajının daha açıklayıcı olması", "Dalın adının değiştirilmesi", "Taramanın daha sık çalıştırılması", "Anahtarın sağlayıcıda iptal edilip döndürülmesi (rotation)" ]
    dogru: 3
    aciklama: "Anahtar git geçmişinde ve olası kopyalarda durur. İlk iş iptal edip yenisini üretmektir; geçmiş temizliği sonra gelir."
  - soru: "Semgrep bir kodda `eval(girdi)` buldu, fakat `girdi` sabit bir metin. Geliştirici bunun yanlış pozitif olduğunu doğruladı. En doğru davranış hangisidir?"
    secenekler: [ "Aracı kapatmak", "Bulguyu hiç okumadan yok saymak", "Satırı gerekçeli bir yorumla işaretleyip kararı kayda geçirmek", "Tüm kuralları devre dışı bırakmak" ]
    dogru: 2
    aciklama: "Gerekçeli istisna (ör. `nosemgrep` yorumu) kararı kayıtlı tutar ve aynı bulgunun yeniden çıkmasını engeller. Aracı kapatmak gerçek bulguları da kaybettirir."
  - soru: "SAST aracı bir projede hiç bulgu vermedi. Bundan hangi sonucu çıkarabilirsin?"
    secenekler: [ "Kod güvenlidir", "Aracın kurallarındaki bilinen kalıplar bulunamadı", "Yetkilendirme mantığında hata olamaz", "DAST'a gerek yoktur" ]
    dogru: 1
    aciklama: "SAST yalnız kurallarının tanıdığı kalıpları arar; erişim kontrolü, yapılandırma ve iş mantığı hatalarını çoğunlukla göremez. Temiz rapor güvenlik kanıtı değildir."
  - soru: "`package.json`'da 5 bağımlılık var, ama SBOM'da 80 bileşen listeleniyor. Bunun en olası nedeni nedir?"
    secenekler: [ "Geçişli (transitive) bağımlılıklar da listeleniyor", "Ekip yanlışlıkla 75 paket daha kurmuş", "SBOM yalnız test paketlerini sayıyor", "SBOM aracı hatalı" ]
    dogru: 0
    aciklama: "Her paket kendi bağımlılıklarını da getirir. Zafiyetler çoğu zaman bu görünmeyen katmandadır, bu yüzden tarama ve SBOM bütün ağacı kapsar."
  - soru: "Yeni bir kütüphane zafiyeti duyuruldu. Elinde 40 uygulamanın güncel SBOM'ları var. En hızlı doğru adım nedir?"
    secenekler: [ "Her depoyu açıp elle aramak", "Zafiyetin kendiliğinden düzeleceğini beklemek", "Bütün uygulamaları kapatmak", "SBOM'larda bileşen adı ve sürümü aratıp etkilenen uygulamaları listelemek" ]
    dogru: 3
    aciklama: "SBOM'un asıl değeri, 'bunu kullanıyor muyuz?' sorusunu bir arama işine çevirmesidir."
  - soru: "Bir bağımlılık taramasında kritik bir açık çıktı; ancak ilgili kütüphane fonksiyonu uygulamada hiç çağrılmıyor. Doğru yaklaşım hangisidir?"
    secenekler: [ "Bulguyu tamamen silmek", "Her zaman en yüksek öncelik vermek, doğrulamadan", "Erişilebilirliği doğrulayıp önceliği buna göre belirlemek, yine de güncellemeyi planlamak", "Kütüphaneyi olduğu gibi bırakıp hiç izlememek" ]
    dogru: 2
    aciklama: "Açığın sömürülebilmesi için kodun erişilebilir olması gerekir; ama bu varsayılmaz, doğrulanır. Kullanım sonradan değişebileceği için güncelleme yine planlanır."
  - soru: "Ekip, canlı üretim sitesine ZAP ile aktif (full) tarama yapmak istiyor. En doğru değerlendirme hangisidir?"
    secenekler: [ "Sorun yok, DAST zararsızdır", "İzinli ve ayrı bir test ortamında yapılmalı; aktif tarama veriyi bozup siteyi yavaşlatabilir", "SAST yapıldıysa DAST gereksizdir", "Yalnız gece yarısı yapılırsa risksizdir" ]
    dogru: 1
    aciklama: "Aktif tarama zararlı girdiler gönderir; canlı sistemde istenmeyen etkiler doğurabilir. İzin ve ayrı test ortamı şarttır. Üretimde en fazla pasif tarama düşünülür."
  - soru: "ZAP baseline taraması bir testte 'eksik güvenlik başlığı' buldu ama SQL injection denemedi. Neden?"
    secenekler: [ "Baseline yalnız gezip pasif kurallarla yanıtlara bakar, saldırı denemez", "ZAP SQL injection'ı bilmiyor", "Uygulama SQL kullanmıyor olmalı", "Başlıklar SQL injection'dan daha önemlidir" ]
    dogru: 0
    aciklama: "Baseline spider ve pasif tarama yapar; saldırı kuralları yalnız full (aktif) taramada çalışır."
  - soru: "Bir imaj taramasında `HIGH` ağırlıkta 15 bulgu çıktı, hepsi taban imajın işletim sistemi paketlerinde. Hangi hamle genellikle en çok bulguyu azaltır?"
    secenekler: [ "Uygulama kodunu yeniden yazmak", "İmajın etiketini değiştirmek", "Bulguları görmezden gelmek", "Daha küçük (slim/alpine/distroless) bir taban imajına geçip imajı yeniden build etmek" ]
    dogru: 3
    aciklama: "Daha az paket daha az açık yüzeyi demektir. Bulgular taban imajdan geliyorsa kodu değiştirmek işe yaramaz. Küçük imajın uyumluluğunu yine de test etmek gerekir."
  - soru: "Bir imaj imzalı ve provenance'ı var. Ekip 'artık zafiyet taramasına gerek yok' diyor. Bu çıkarım neden hatalı?"
    secenekler: [ "İmza yalnız dosya adını kanıtlar", "İmzalı imajlar otomatik olarak taranır", "İmza ve provenance imajın değişmediğini ve nereden geldiğini gösterir, içinin zafiyetsiz olduğunu göstermez", "Provenance zafiyetleri listeler" ]
    dogru: 2
    aciklama: "SLSA da kodun güvenli yazıldığı hakkında bir şey söylemez; yalnız tedarik zinciri bütünlüğünü hedefler. İmza ve tarama birbirinin yerine geçmez."
  - soru: "Cosign'ın 'anahtarsız' (keyless) imzalama yaklaşımının ana avantajı nedir?"
    secenekler: [ "İmzanın hiç doğrulanmasına gerek kalmaz", "Uzun ömürlü gizli anahtar saklama ve çalınma riski ortadan kalkar", "İmzalar daha küçük olur", "Anahtar herkese açık olur" ]
    dogru: 1
    aciklama: "Kısa ömürlü sertifika CI'ın kimliğine bağlanır, imza olayı şeffaflık kaydına yazılır; saklanacak ve sızabilecek uzun ömürlü bir anahtar yoktur."
  - soru: "Bir workflow'da `uses: some/action@v2` yazıyor ve aksiyonun deposunun sahibinin hesabı ele geçirildi. Neden bu risk SHA ile sabitlemeyle azalır?"
    secenekler: [ "Etiket taşınabilir ya da silinebilir, commit SHA'sı ise değişmez bir kayda işaret eder", "SHA daha kısa olduğu için hızlıdır", "SHA ile sabitlenen aksiyonlar sırlara erişemez", "Etiketler hiç çalışmaz" ]
    dogru: 0
    aciklama: "Saldırgan etiketi kötü commit'e taşıyabilir; sabitlediğin SHA aynı kalır. SHA'nın asıl depodan geldiğini doğrulamak gerekir. Sabitlemek sırlara erişimi kaldırmaz."
  - soru: "Bir workflow `pull_request_target` ile tetikleniyor ve fork'tan gelen PR'ın kodunu checkout edip `npm install` çalıştırıyor. Sorun nedir?"
    secenekler: [ "Fork PR'ları hiç tetiklenemez", "Hata yok, bu önerilen desendir", "npm install yavaştır", "Saldırganın kontrol ettiği kod, sırlara ve yazma yetkisine sahip ortamda çalışır" ]
    dogru: 3
    aciklama: "`pull_request_target` hedef depo bağlamında, sırlarla çalışır; PR kodunu orada çalıştırmak saldırgana bu yetkileri verir. Güvenli desen: yetkisiz `pull_request` ile test, ayrıcalıklı iş için ayrı `workflow_run`."
  - soru: "Ana dalda 'inceleme zorunlu' ve 'durum kontrolleri zorunlu' kuralları var, ama yöneticiler bunları atlayıp doğrudan push yapabiliyor. En önemli düzeltme hangisidir?"
    secenekler: [ "Yöneticileri silmek", "Yalnız commit mesajı kuralı eklemek", "Kuralı yöneticilere de uygulatmak (bypass'ı kapatmak)", "Dalı herkese açmak" ]
    dogru: 2
    aciklama: "Ele geçirilmiş ya da acele eden tek bir yönetici hesabı bütün kapıları aşabilir. Kuralı herkese uygulamak, acil durum için ayrı ve kayıtlı bir yol bırakmak daha güvenlidir."
  - soru: "Bir ekip yeni bir tarayıcı ekledi, ilk taramada 400 bulgu çıktı. Hepsini hemen build'i durduran kapıya bağlarlarsa ne olur ve daha iyi başlangıç nedir?"
    secenekler: [ "Hiçbir şey olmaz, ekip hepsini hemen çözer", "Kimse birleştiremez, araç atlatılır; mevcutları taban çizgisi yapıp yalnız yeni ve yüksek güvenli bulguları engellemek daha iyidir", "Kapı her zaman gevşek bırakılmalıdır", "Araç otomatik olarak yanlış pozitifleri siler" ]
    dogru: 1
    aciklama: "Aşırı katı kapı kullanılmaz hale gelir. Taban çizgisi ve kademeli sıkılaştırma, hem gürültüyü hem eski borcu yönetilebilir tutar."
  - soru: "Pipeline'a eklediğin GitShield GitHub Action'ı kırmızı sonuç veriyor, ancak PR yine de birleştirilebiliyor. Neyi unuttun?"
    secenekler: [ "Dal korumada bu job'ı zorunlu durum kontrolü yapmayı", "GitShield'in SARIF üretmesini", "Dependabot'u kapatmayı", "Workflow'u `pull_request_target`'a çevirmeyi" ]
    dogru: 0
    aciklama: "Kontrol yalnız sonuç gösteriyorsa kapı değildir. Zorunlu durum kontrolü, kırmızı sonuçta birleştirmeyi dal koruma düzeyinde engeller."
---
