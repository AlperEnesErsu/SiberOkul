---
kimlik: devops-001
baslik: "DevOps ve CI/CD fikri"
donem: 4
sira: 1
sure: 25
neden: "DevSecOps, güvenlik kontrollerini yazılımın üretim hattının içine koymaktır. Hattın ne olduğunu bilmeden kontrolü nereye koyacağını bilemezsin. Her mühendislik ekibinde bir CI/CD hattıyla karşılaşırsın ve saldırganlar da bu hattı hedef alır."
analoji:
  baslik: "Fabrikadaki üretim bandı"
  metin: "Eskiden her işçi parçayı elle birleştirir, hatayı en sonda fark ederdi. Üretim bandında her istasyon kendi kontrolünü yapar: vida takıldı mı, boya tuttu mu. Hata ilk istasyonda yakalanır. CI/CD hattı bu banttır, kod parçaları istasyonlardan geçer. Benzetmenin sınırı: fabrika fiziksel bir ürün yapar, yazılım hattı ise aynı bandı günde onlarca kez çalıştırır."
gorev:
  aciklama: "Bu derste kurulum yok; yalnız bir hattın aşamalarını kendin yazacaksın. Ubuntu terminalinde `/tmp` altında bir not dosyası oluşturup hat aşamalarını sırala:"
  komutlar:
    - mkdir -p /tmp/hat && cd /tmp/hat
    - "printf 'kod yaz\\nderle\\ntest et\\nguvenlik tara\\nyayinla\\n' > asamalar.txt"
    - cat -n asamalar.txt
  soru: "Güvenlik taramasını listede neden en sona değil, testin yanına koydun? Kendi cümlenle açıkla."
  telefon:
    soru: "Bir ekip yazılımı yılda iki kez elle yayınlıyor ve her seferinde yüzlerce değişiklik birikmiş oluyor. Bir hata çıkarsa neden bulması zordur?"
    cevap: "Çünkü hatayı yüzlerce değişikliğin hangisinin yaptığı belirsizdir. Küçük ve sık değişiklikte suçlu bir iki değişikliğe daralır."
sorular:
  - id: devops-001-s1
    soru: "DevOps'un çözmeye çalıştığı temel sorun nedir?"
    cevap: "Yazılımı geliştiren ekiple onu çalıştıran ekibin ayrı ve birbirini bekleyen iki dünya olması. DevOps ortak sorumluluk, otomasyon ve hızlı geri bildirim ister."
    ipucu: "Geliştirme ve operasyon ekiplerinin birbirini beklemesinin sonucunu düşün."
  - id: devops-001-s2
    soru: "Sürekli entegrasyon (CI) ile sürekli teslim (CD) arasındaki fark nedir?"
    cevap: "CI, herkesin kodunu sık sık ortak yere birleştirip her birleşmede otomatik derleme ve test çalıştırmaktır. CD, bu doğrulanmış kodu yayına alınabilir halde tutmak ya da otomatik yayına çıkarmaktır."
    ipucu: "Biri her birleşmede otomatik doğrulama, diğeri yayına hazır olma durumuyla ilgilidir."
  - id: devops-001-s3
    soru: "Geri bildirim döngüsü neden kısa olmalı?"
    cevap: "Hatayı yazdığın anda öğrenirsen bağlam taze olduğu için düzeltmesi dakikalar sürer. Haftalar sonra öğrenirsen neyin neden yazıldığını hatırlamak bile zorlaşır."
    ipucu: "Hatayı yazdığın an ile fark ettiğin an arasındaki süreyi düşün."
  - id: devops-001-s4
    soru: "Saldırgan için CI/CD hattı neden cazip bir hedeftir?"
    cevap: "Hat kodu derleyip yayına çıkarma yetkisine ve genellikle sırlara (anahtar, parola) sahiptir. Hatta girebilen biri, kodun içine zararlı bir şey sokup herkese ulaştırabilir."
    ipucu: "Hattın sahip olduğu yetkilere ve sırlara bak."
  - id: devops-001-s5
    soru: "Ekibiniz güvenlik taramasını hattın en sonuna, yayından hemen önceye koymuş. Taramalar 40 dakika sürüyor ve geliştiriciler acil yayınlarda bu adımı atlamaya başladı. Ne önerirsin?"
    cevap: "Güvenlik adımlarını hattın içinde daha erken çekerim (shift left): hızlı olanlar, yani sır ve bağımlılık taraması, her PR'da çalışsın; yavaş olanlar paralel ya da gece çalışsın. Adımı atlamak yerine kırmızı sonuç yayını durdursun. Böylece güvenlik darboğaz olmaktan çıkar."
    ipucu: "Kontrol yavaş ve en sonda olunca insanların ne yaptığını düşün; kontrolü nereye çekebilirsin?"
derinDalis:
  - tur: kitap
    baslik: "The Phoenix Project (Gene Kim ve ark.)"
    ayrinti: "BT operasyonlarını bir roman üzerinden anlatan, DevOps fikrinin ruhunu veren kitap."
  - tur: okuma
    baslik: "GitHub Actions kavramları"
    ayrinti: "Workflow, job, step ve event tanımlarını resmi dokümandan oku."
    url: "https://docs.github.com/en/actions/get-started/understanding-github-actions"
hizliKontrol:
  - soru: "Testlerden geçen kod insan onayı olmadan otomatik olarak yayına çıkıyorsa bu hangisidir?"
    secenekler: 
      - "Yalnız sürekli entegrasyon"
      - "Elle yayın"
      - "Sürekli teslim (continuous delivery)"
      - "Sürekli dağıtım (continuous deployment)"
    dogru: 3
    aciklama: "Sürekli teslimde yayına çıkma kararı insanındır; sürekli dağıtımda doğrulanmış kod otomatik yayına çıkar."
    ipucu: "Yayın kararını kimin verdiğine bak."
sikHatalar:
  - hata: "DevOps'u satın alınan bir araç sanmak."
    dogrusu: "DevOps bir çalışma biçimidir: ortak sorumluluk, otomasyon, küçük ve sık değişiklik. Araçlar bunu destekler."
  - hata: "Güvenlik taramasını hep yayından hemen önceye koymak."
    dogrusu: "Kontrolleri hattın başına doğru çek; geliştirici sorunu kodu yazdığı gün görsün."
terimler:
  - "CI/CD"
  - "Pipeline"
  - "Shift left"
sema:
  baslik: "Tipik bir CI/CD hattı"
  adimlar:
    - etiket: "Kod"
      aciklama: "Geliştirici değişikliği ortak depoya gönderir."
    - etiket: "Derle"
      aciklama: "Makine kodu otomatik derler."
    - etiket: "Test"
      aciklama: "Otomatik testler çalışır."
    - etiket: "Güvenlik taraması"
      aciklama: "Sır ve bağımlılık taramaları çalışır."
    - etiket: "Paketle"
      aciklama: "Uygulama dağıtılabilir pakete dönüşür."
    - etiket: "Yayınla"
      aciklama: "Paket ortama çıkar; adımlardan biri kırmızıysa hat durur."
---

Eskiden yazılım dünyası ikiye bölünmüştü: **geliştiriciler** kodu yazar, **operasyon** ekibi onu sunucuya koyup çalışır tutardı. Geliştirici "bende çalışıyor" der, operasyon "bende çalışmıyor" derdi. Yayın birkaç ayda bir, büyük bir olay olarak yapılırdı ve her yayın sancılıydı.

**DevOps** (Development + Operations) bu duvarı yıkma fikridir. Ortak sorumluluk, otomasyon ve sık, küçük değişiklikler ister. Bir araç değil, bir çalışma biçimidir.

### CI/CD nedir?

- **Sürekli entegrasyon (Continuous Integration, CI):** Herkes kodunu günde birçok kez ortak depoya birleştirir. Her birleşmede bir makine kodu otomatik derler ve testleri çalıştırır. Bozuk bir değişiklik hemen kırmızı ışık yakar.
- **Sürekli teslim (Continuous Delivery):** CI'dan geçen kod her an yayına çıkabilecek durumda tutulur. Yayına çıkma kararı bir insanındır.
- **Sürekli dağıtım (Continuous Deployment):** Aynısı, ama testlerden geçen kod insan onayı olmadan otomatik yayına çıkar.

İkisine birden **CI/CD** denir.

### Hat (pipeline) nasıl görünür?

```text
kod → derle → test et → güvenlik taraması → paketle → yayınla
```

Her aşama bir öncekinden geçerse devam eder, geçemezse hat durur ve ekibe haber gider. Bu **geri bildirim döngüsüdür** (feedback loop): hata ne kadar erken bulunursa düzeltmesi o kadar ucuzdur.

### DevSecOps nerede devreye girer?

Güvenliği "yayından önceki son kontrol" olarak bırakırsan darboğaz olur ve ekipler onu atlamaya başlar. DevSecOps yaklaşımında güvenlik kontrolleri hattın içine gömülür: sır taraması, bağımlılık taraması, imaj taraması. Geliştirici sorunu kodu yazdığı gün öğrenir. "Sola kaydırma" (shift left) denen şey budur: kontrolü hattın sonundan başına doğru çekmek.

Bu bölgede sırayla Git ile değişiklikleri izlemeyi, GitHub Actions ile hattı kurmayı ve Docker ile uygulamayı paketlemeyi öğreneceksin.

Güvenlik notu: Hat, kodu derleme ve yayınlama yetkisine sahip olduğu için kendisi de değerli bir hedeftir. Hattın sırlarını ve kimin neyi değiştirebileceğini ileride özenle yöneteceğiz.
