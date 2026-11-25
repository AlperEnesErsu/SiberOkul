---
kimlik: bulut-009
baslik: "SIEM ve log korelasyonu"
donem: 8
sira: 9
sure: 35
neden: "Tek bir log satırı çoğu zaman masumdur; saldırı, birkaç satırın zaman içindeki birleşiminde görünür. Korelasyon kuralı yazmak, bir SIEM'i ve bir güvenlik operasyon merkezini (SOC) anlamanın özüdür. LogSentry'yi yazarken bunu zaten yaşadın."
analoji:
  baslik: "Dedektif panosu"
  metin: "Bir dedektif, tek bir ayak izine bakıp sonuca varmaz. Ayak izini, kırık camı ve komşunun gördüğü arabayı aynı panoda, zaman sırasıyla yan yana koyar. SIEM bu panodur. Sınır: pano kanıt bulmaz, yalnız bağlantıyı gösterir; yorumu analist yapar."
gorev:
  aciklama: "Bulutta bir şey çalıştırmaz. `jq` gerekir (`sudo apt install -y jq`). CloudTrail benzeri satır satır JSON (JSONL) bir dosya yazıp, aynı IP'den 3 başarısız girişin ardından başarılı giriş gelen deseni 10 dakikalık pencerede arayacaksın. Bu, LogSentry'de yaptığın kayan zaman penceresinin küçük bir benzeridir."
  komutlar:
    - |-
      cat > /tmp/olaylar.jsonl <<'EOF'
      {"t":1000,"ip":"198.51.100.7","olay":"giris_basarisiz"}
      {"t":1060,"ip":"198.51.100.7","olay":"giris_basarisiz"}
      {"t":1100,"ip":"203.0.113.9","olay":"giris_basarisiz"}
      {"t":1180,"ip":"198.51.100.7","olay":"giris_basarisiz"}
      {"t":1300,"ip":"198.51.100.7","olay":"giris_basarili"}
      {"t":5000,"ip":"203.0.113.9","olay":"giris_basarili"}
      EOF
    - |-
      jq -s -r '
        . as $o | $o[] | select(.olay=="giris_basarili") as $s
        | ([ $o[] | select(.ip==$s.ip and .olay=="giris_basarisiz" and .t<$s.t and ($s.t-.t)<=600) ] | length) as $n
        | select($n>=3) | "UYARI: \($s.ip) \($n) basarisizdan sonra giris yapti (t=\($s.t))"' /tmp/olaylar.jsonl
    - jq -r 'select(.olay=="giris_basarisiz") | .ip' /tmp/olaylar.jsonl | sort | uniq -c
  soru: "Hangi IP için uyarı çıktı, diğer IP neden çıkmadı? Pencereyi 600 saniyeden 60 saniyeye indirirsen ne olur ve bu ayarın kural gürültüsü ile kaçırma riski arasında nasıl bir ödünleşimi vardır?"
  telefon:
    soru: "Bir IP'den 10 dakikada 3 başarısız ve ardından 1 başarılı giriş görüyorsun. İki ayrı kayıt olarak masum, birlikte ne anlama gelebilir?"
    cevap: "Kaba kuvvetle ya da parola doldurmayla (credential stuffing) hesap ele geçirilmiş olabilir. Her satır tek başına olağandır; sıra ve zaman birlikte şüpheli bir desen oluşturur. Bu yüzden korelasyon gerekir."
sorular:
  - id: bulut-009-s1
    soru: "SIEM'in temel işi nedir?"
    cevap: "Farklı kaynaklardan log toplamak, ortak biçime getirmek, kurallarla ilişkilendirmek (korelasyon), uyarı üretmek ve kanıt olarak saklamaktır."
    ipucu: "Log'ların tek yerde toplanıp birbirine bağlandığı sistemi düşün."
  - id: bulut-009-s2
    soru: "Korelasyon kuralı hangi üç parçadan oluşur?"
    cevap: "Bir desen (hangi olaylar), bir zaman penceresi (ne kadar süre içinde) ve bir eşik (kaç kez ya da hangi sırayla). Ek olarak bir önem derecesi ve ne yapılacağı tanımlanır."
    ipucu: "Desen, pencere, eşik gibi parçaları say."
  - id: bulut-009-s3
    soru: "Zaman penceresi çok dar ya da çok geniş olursa ne olur?"
    cevap: "Çok dar pencere yavaş saldırıları kaçırır (yanlış negatif). Çok geniş pencere masum olayları birleştirip gürültü üretir (yanlış pozitif). Pencere gerçek veriye bakılarak ayarlanır."
    ipucu: "Pencere dar olunca yavaş saldırıya, geniş olunca gürültüye ne olur?"
  - id: bulut-009-s4
    soru: "LogSentry'de yaptığın hangi iş, bir SIEM'in hangi işlevine karşılık gelir?"
    cevap: "Web sunucusu log'unu izlemen log toplamaya, kayan zaman pencereleriyle saldırı deseni bulman korelasyona, ekran/JSONL/Telegram bildirimleri uyarıya, hash zincirli SQLite arşivi ise bütünlüğü korunan saklamaya karşılık gelir."
    ipucu: "LogSentry'deki hash zinciri ile bir SIEM'in hangi işlevi örtüşüyor?"
  - id: bulut-009-s5
    soru: "SIEM'de aynı kimlik hiç kullanmadığı bir bölgede 20 sunucu başlattı. Ne yaparsın?"
    cevap: "Kimliğin sahibine ulaşırım; meşru değilse anahtarı devre dışı bırakır, sunucuları kapatırım (önce kanıtı korurum). Aynı kimliğin yeni kullanıcı ya da politika değişikliklerine bakar ve olay müdahalesini başlatırım."
    ipucu: "Kripto madenciliği bulutta tipik bir kötüye kullanımdır."
derinDalis:
  - tur: kitap
    baslik: "The Practice of Network Security Monitoring (Richard Bejtlich)"
    ayrinti: "Güvenlik izleme mantığı ve olay tespiti; log toplama ve analiz fikirleri için okunacak bir kaynak."
hizliKontrol:
  - soru: "Korelasyon kuralındaki 'anahtar' alanı ne işe yarar?"
    secenekler: ["Şifreleme anahtarı belirtir","Olayları aynı kaynağa (ör. IP) göre gruplar","Alarm sesini seçer","Log dosyasını imzalar"]
    dogru: 1
    aciklama: "Anahtar, hangi olayların aynı hikayenin parçası sayılacağını belirler."
    ipucu: "Tabloda IP'nin hangi satırda geçtiğine bak."
sikHatalar:
  - hata: "Her olağandışı olaya yüksek önem vermek."
    dogrusu: "Önem derecesi ver; her uyarı aynı acil değildir."
  - hata: "Kuralı yalnız saldırı örneğiyle test etmek."
    dogrusu: "Normal veriyle de dene; yanlış alarm oranını gör."
terimler:
  - "SIEM"
  - "Korelasyon kuralı"
---

**SIEM** (Security Information and Event Management), farklı kaynaklardan gelen log'ları tek yerde toplayan, ortak biçime getiren, aralarında bağ kuran ve uyarı üreten sistemdir. Bu bölgede gördüğün CloudTrail, CloudWatch ve uygulama log'ları, SIEM'in beslendiği kaynaklardır.

### LogSentry'ye dönüş

LogSentry'yi yazarken aslında küçük bir SIEM yaptın: web sunucusu log'larını izledin, kayan zaman pencereleriyle saldırı desenlerini buldun, bildirimi ekrana, JSONL dosyasına ya da Telegram'a gönderdin ve olayları hash zincirli bir SQLite arşivine yazdın. Bulutta fark, **kaynağın** değişmesidir: web sunucusu satırları yerine CloudTrail olayları, VPC akış kayıtları ve uygulama log'ları. Mantık aynıdır: topla, ilişkilendir, haber ver, sakla.

### Korelasyon neden gerekli?

Tek bir "başarısız giriş" olağandır. Ama aynı IP'den 10 dakikada üç başarısız giriş ve ardından başarılı giriş, aynı olayın dört satırı değildir; bir **hikayedir**. Korelasyon kuralı bu hikayeyi tanımlar:

| Parça | Örnek |
|---|---|
| Desen | başarısız giriş, sonra başarılı giriş |
| Pencere | 10 dakika |
| Eşik | en az 3 başarısız |
| Anahtar | aynı kaynak IP |
| Eylem | yüksek önem, nöbetçiye bildir |

### İyi kural yazmak

1. **Hedefle başla**: Neyi yakalamak istiyorsun? (hesap ele geçirme, kalıcılık kurma, veri dışarı çıkarma)
2. **Normali bil**: Gerçek veriyi incele. Gece çalışan bir CI işi, "olağandışı saat" kuralını sürekli tetikleyebilir.
3. **Pencereyi dene**: Dar pencere yavaş saldırıyı kaçırır, geniş pencere gürültü yapar.
4. **Önem derecesi ver**: Her uyarı aynı acil değildir.
5. **Kuralı test et**: Hem saldırı örneğiyle (yakalıyor mu) hem normal veriyle (yanlış alarm veriyor mu).

### Bulut için örnek kurallar

- Aynı kimlik, kısa sürede hiç kullanmadığı bir bölgede kaynak oluşturdu.
- `StopLogging` ya da `DeleteTrail` olayı (kayıtları susturma).
- Yeni bir kullanıcı oluşturuldu ve hemen ardından ona yönetici politikası bağlandı.
- Erişim anahtarı, bilinen IP aralığı dışından kullanıldı.

### Bütünlük

Uyarının işe yaraması, arkasındaki kaydın güvenilir olmasına bağlıdır. LogSentry'de hash zinciri bunu sağlıyordu; bulutta CloudTrail'in log dosyası bütünlük doğrulaması ve korumalı depolama aynı rolü oynar.

Güvenlik notu: SIEM'e girdi olarak güvendiğin log'ların kendisi saldırganın etkileyebileceği veri olabilir (ör. bir isteğin başlığına yazılan metin). Log içeriğini komut ya da kod gibi çalıştırma; her zaman veri olarak ele al.
