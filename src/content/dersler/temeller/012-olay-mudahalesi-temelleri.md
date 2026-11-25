---
kimlik: temeller-012
baslik: "Olay müdahalesi temelleri"
donem: 3
sira: 12
sure: 30
neden: "Her sistem bir gün saldırıya uğrar; fark yaratan, ilk saatlerde ne yaptığındır. Bir DevSecOps mühendisi çoğu zaman olayı ilk fark eden ve ilk müdahale eden kişidir. Hazırlıklı bir ekip panik yerine sırayla ve kayıt tutarak ilerler; bu bölgenin son dersi tüm önceki konuları bu çerçeveye bağlar."
analoji:
  baslik: "Yangın tatbikatı"
  metin: "Yangın çıkmadan önce söndürücüler yerleştirilir, çıkışlar planlanır, tatbikat yapılır (hazırlık). Duman görünce alarm çalar (tespit). Kapılar kapatılıp yayılma durdurulur (sınırlama). Ateş söndürülür ve bina güvenli hale getirilir (temizleme). Sonra neden çıktığı incelenir (ders çıkarma). Sınır: yangında kanıt aramazsın; siber olayda kanıtı korumak müdahalenin parçasıdır."
gorev:
  aciklama: "Şüpheli bir sistemde ilk bakılacak bilgileri topla ve bir olay notuna yaz. Komutlar yalnız okur; hiçbir şey silmez. Sonuç `/tmp` altındaki not dosyasına yazılır. Bu sadece bir tatbikattır, gerçek bir olay değil."
  komutlar:
    - mkdir -p /tmp/olay && cd /tmp/olay
    - date -u > not.txt
    - whoami >> not.txt
    - who >> not.txt
    - last -n 5 >> not.txt
    - ss -tulpn >> not.txt
    - ps aux --sort=-%cpu | head -n 6 >> not.txt
    - cat not.txt
  soru: "Notta hangi bilgiler 'ne zaman, kim, nerede, ne çalışıyor' sorularını cevaplıyor? Bu bilgiyi neden müdahale sırasında değil de ilk dakikalarda toplamak önemli?"
  telefon:
    soru: "Bir geliştirici, CI sunucusunda tanımadığı bir işlem fark etti ve hemen işlemi sonlandırıp ilgili dizini sildi. Neyi doğru, neyi yanlış yaptı?"
    cevap: "Fark etmesi ve harekete geçmesi doğru. Ama kanıtı topladan silmek yanlış: girişin nasıl olduğunu ve ne kadar yayıldığını anlamak zorlaşır. Önce sınırla (ağdan ayır), kanıtı koru, sonra temizle ve güvenlik ekibine haber ver."
sorular:
  - id: temeller-012-s1
    soru: "Olay müdahalesinin beş aşamasını sırayla say."
    cevap: "Hazırlık, tespit (ve analiz), sınırlama, temizleme (kök neden giderme ve geri yükleme), olay sonrası ders çıkarma."
  - id: temeller-012-s2
    soru: "Sınırlama aşaması neden temizlemeden önce gelir?"
    cevap: "Önce yayılmayı ve zararı durdurmak gerekir; saldırgan hâlâ içerideyse temizlik çabası boşa gider ve o fark ederse izlerini siler ya da daha da zarar verir. Sınırlama zaman kazandırır, temizlik sonra düzgünce yapılır."
  - id: temeller-012-s3
    soru: "Müdahale sırasında kanıtı korumak neden önemlidir? Bunun için ne yaparsın?"
    cevap: "Kanıt, saldırganın nasıl girdiğini ve nereye ulaştığını gösterir; bu olmadan aynı açık kapanmaz. Günlükleri ve gerekirse disk/bellek kopyasını alırsın, değiştirmeden saklarsın, yaptığın her adımı zaman damgasıyla kaydedersin."
  - id: temeller-012-s4
    soru: "Suçlayıcı olmayan olay sonrası değerlendirmenin (post-incident review) amacı nedir?"
    cevap: "Kimin hata yaptığını bulmak değil, süreçte ve sistemde neyin açık bıraktığını anlamak ve tekrarlanmasını önleyecek somut iyileştirmeler çıkarmaktır. Suçlanmaktan korkan ekip olayı saklar, öğrenme biter."
derinDalis:
  - tur: okuma
    baslik: "NIST SP 800-61: Computer Security Incident Handling Guide"
    ayrinti: "Olay müdahale yaşam döngüsünün temel kaynağı. Rev. 2 geri çekildi ve yerini Rev. 3 aldı; sayfadan güncel sürüme ulaşabilirsin."
    url: "https://csrc.nist.gov/pubs/sp/800/61/r2/final"
  - tur: kitap
    baslik: "Building Secure and Reliable Systems (Google)"
    ayrinti: "Olay yönetimi ve olay sonrası inceleme bölümleri; kitap ücretsiz yayımlanıyor."
---

Bir **güvenlik olayı** (security incident), sistemin gizliliğini, bütünlüğünü ya da erişilebilirliğini tehdit eden ya da zedeleyen bir durumdur. **Olay müdahalesi** (incident response), bu durumda sırayla ve planlı hareket etme disiplinidir. Beş aşamadan oluşur.

### 1. Hazırlık

Olaydan önce yapılır ve en değerli aşamadır:

- Kimin ne yapacağı, kime haber verileceği yazılı olsun.
- Günlükler (log) toplanıyor ve saklanıyor olsun; olmayan kaydı sonradan bulamazsın.
- Yedekler var ve geri yükleme **denenmiş** olsun.
- İletişim listesi (güvenlik, yönetim, hukuk) güncel olsun.

### 2. Tespit ve analiz

Bir şeyin olup olmadığını anlama aşaması. Kaynaklar: alarmlar, kullanıcı şikayetleri, olağandışı günlükler, dışarıdan bildirim. İlk sorular:

- Ne oldu ve ne zaman başladı?
- Hangi sistemler, hesaplar ve veriler etkilendi?
- Bu gerçek bir olay mı, yanlış alarm mı?
- CIA'nın hangi ögesi zedelendi?

Her adımı zaman damgasıyla bir olay notuna yaz. Hafıza, stres altında güvenilmezdir.

### 3. Sınırlama (containment)

Zararın yayılmasını durdur. Etkilenen makineyi ağdan ayırmak, ele geçirilen hesabı kilitlemek, sızan anahtarı iptal etmek tipik adımlardır. Kısa vadeli sınırlama hızlıdır; sistemi kapatmak gibi kanıtı yok edebilecek adımları atmadan önce düşün. Gerekirse disk ya da bellek kopyası al.

### 4. Temizleme ve kurtarma

Saldırganın girişini ve kalıcılığını (arka kapılar, yeni hesaplar) bul ve kaldır. **Kök neden** kapanmadan geri yüklersen saldırgan geri gelir. Temiz yedekten geri yükle, parolaları ve anahtarları yenile, sistemi yoğun izleme altında devreye al.

### 5. Ders çıkarma

Olaydan sonra suçlayıcı olmayan bir değerlendirme yapılır: ne oldu, neden fark edilmedi, neyi daha iyi yapabilirdik? Çıktı, somut ve sahibi olan iyileştirmelerdir (alarm ekle, yetkiyi daralt, yama sürecini hızlandır).

### Yapılacaklar ve yapılmayacaklar

| Yap | Yapma |
|---|---|
| Sakin ol, kaydet | Panikle silme, yeniden başlatma |
| Önce sınırla | Şüpheli sistemde gelişigüzel komut çalıştırma |
| Ekibi bilgilendir | Olayı sessizce çözmeye çalışma |
| Kanıtı koru | Saldırgana karşılık verme |

Bu bölgenin tüm konuları burada birleşir: kimlik doğrulama ve MFA saldırıyı zorlaştırır, şifreleme ve hash veriyi ve bütünlüğü korur, derinlemesine savunma zararı sınırlar, günlükler ve hazırlık olayın hızlı çözülmesini sağlar.

Güvenlik notu: Gerçek bir olayda hukuki ve yasal yükümlülükler (veri ihlali bildirimi gibi) devreye girebilir. Bunları tek başına karara bağlama; kurumundaki güvenlik ve hukuk ekibine bildir.
