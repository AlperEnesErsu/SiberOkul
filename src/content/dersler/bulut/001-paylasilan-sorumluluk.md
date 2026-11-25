---
kimlik: bulut-001
baslik: "Paylaşılan sorumluluk modeli"
donem: 8
sira: 1
sure: 25
neden: "Bulut ihlallerinin büyük kısmı sağlayıcının hatasından değil, müşterinin yanlış yapılandırmasından çıkar. Bir DevSecOps mühendisi göreve başlarken ilk sorusunu şöyle sorar: bu serviste ne bana ait, ne sağlayıcıya? Cevabı bilmeden hiçbir kontrol doğru yere konmaz."
analoji:
  baslik: "Apartman ve daire"
  metin: "Bina yönetimi dış kapıyı, asansörü, çatıyı ve elektrik şebekesini korur. Dairenin kapısını kilitlemek, pencereyi kapatmak ve anahtarı kime vereceğin sana aittir. Hırsız kilitsiz daireden girerse suçu bina yönetimine atamazsın. Sınır: bulutta kat mülkiyeti servise göre değişir; yönetilen bir serviste yönetim daha çok iş üstlenir, ama anahtarlar yine senin."
gorev:
  aciklama: "Bu görev tamamen yereldir; hiçbir bulut hesabı açmaz, ücret doğurmaz. WSL terminalinde `/tmp` altında küçük bir sorumluluk tablosu yazıp `grep` ile 'bana ait' satırları süzeceksin."
  komutlar:
    - |-
      cat > /tmp/sorumluluk.csv <<'EOF'
      servis,madde,sahip
      EC2,fiziksel veri merkezi,AWS
      EC2,hipervizor,AWS
      EC2,isletim sistemi yamalari,SEN
      EC2,guvenlik grubu kurallari,SEN
      EC2,uygulama kodu,SEN
      Lambda,isletim sistemi yamalari,AWS
      Lambda,fonksiyon kodu,SEN
      Lambda,IAM izinleri,SEN
      S3,disk ve donanim,AWS
      S3,bucket erisim politikasi,SEN
      S3,verinin siniflandirilmasi,SEN
      EOF
    - grep -c ',SEN$' /tmp/sorumluluk.csv
    - grep -c ',AWS$' /tmp/sorumluluk.csv
    - grep '^Lambda' /tmp/sorumluluk.csv
  soru: "EC2'dan Lambda'ya geçince 'işletim sistemi yamaları' satırının sahibi neden değişti? Bu değişim senin işini azaltır mı, tamamen kaldırır mı?"
  telefon:
    soru: "Bir S3 bucket'ı yanlışlıkla internete açık kaldı ve içindeki müşteri verisi sızdı. AWS'nin disklerinin fiziksel güvenliği kusursuz. Sorumlu kim ve neden?"
    cevap: "Bucket sahibi, yani müşteri. Fiziksel güvenlik 'bulutun güvenliği' (AWS), bucket erişim politikası ise 'bulutun içindeki güvenlik' (müşteri) kapsamındadır. AWS'nin donanımı sağlam olsa da yapılandırma müşteriye aittir."
sorular:
  - id: bulut-001-s1
    soru: "'Bulutun güvenliği' (security of the cloud) ile 'bulut içindeki güvenlik' (security in the cloud) arasındaki fark nedir?"
    cevap: "Birincisi sağlayıcının işi: veri merkezleri, donanım, ağ altyapısı ve servislerin çalıştığı temel katman. İkincisi müşterinin işi: hesabındaki kimlikler, izinler, veri, ağ kuralları ve uygulama yapılandırması."
    ipucu: "Hangi tarafın elinde fiziksel donanım, hangisinin elinde hesap ayarları var diye düşün."
  - id: bulut-001-s2
    soru: "Sorumluluk bölümü neden servise göre değişir? Bir örnek ver."
    cevap: "Serviste sağlayıcı ne kadar katman yönetirse müşterinin payı o kadar küçülür. EC2'da işletim sistemi yaması müşteriye aittir; Lambda'da işletim sistemini AWS yönetir, müşteri kod ve izinlerle ilgilenir."
    ipucu: "EC2 ile Lambda'da işletim sistemini kimin yönettiğini karşılaştır."
  - id: bulut-001-s3
    soru: "Hangi sorumluluk hangi serviste olursa olsun hep müşteridedir?"
    cevap: "Verinin kendisi, kimlik ve erişim yönetimi (kim neye erişebilir) ve hesabın yapılandırması. Servis ne kadar yönetilen olursa olsun bu üçü senin elinde kalır."
    ipucu: "Servis ne kadar yönetilirse yönetilsin değişmeyen şeyleri say: veri, kimlik, yapılandırma."
  - id: bulut-001-s4
    soru: "Bir ekip arkadaşın 'zaten AWS'de çalışıyoruz, güvenlik onların işi' diyor. Ona ne dersin?"
    cevap: "AWS yalnız altyapıyı korur. Bizim hesabımızdaki IAM politikaları, açık portlar, şifrelenmemiş veri ve sızan anahtarlar bize ait. Hangi kontrolün kimde olduğunu bu modele bakarak belirleriz."
    ipucu: "Cümledeki 'zaten' sözcüğünün neyi görmezden getirdiğini sor: hesabın içindekiler kimin?"
  - id: bulut-001-s5
    soru: "Yeni bir ekip arkadaşı bir S3 bucket'ına müşteri dosyaları yükleyip bucket'ı herkese açık bıraktı; bir hafta sonra dışarıdan okunduğunu fark ettin. Sorumluluk tablosuna göre bu kimin işiydi ve ilk adımın ne olur?"
    cevap: "Yapılandırma müşteriye ait olduğu için sorumluluk bizdedir (AWS'de değil). İlk adım açıklığı kapatmak: Block Public Access'i açıp politikayı düzeltmek. Sonra erişim kayıtlarına bakıp verinin okunup okunmadığını anlar, olayı raporlar ve aynı hatayı pipeline kontrolüyle önlersin."
    ipucu: "Bucket erişim politikası tabloda kimin satırında?"
derinDalis:
  - tur: okuma
    baslik: "AWS: Paylaşılan Sorumluluk Modeli"
    ayrinti: "AWS'nin kendi anlatımı; 'bulutun güvenliği' ve 'bulut içindeki güvenlik' ayrımını kaynağından oku."
    url: "https://aws.amazon.com/compliance/shared-responsibility-model/"
hizliKontrol:
  - soru: "Müşteri olarak hangisi her serviste sende kalır?"
    secenekler: ["Veri merkezinin fiziksel güvenliği","Verinin kendisi ve kimlik/erişim yönetimi","Hipervizör yamaları","Ağ kablolarının bakımı"]
    dogru: 1
    aciklama: "Veri, kimlik ve hesap yapılandırması servis ne olursa olsun müşteriye aittir; diğerleri sağlayıcıdır."
    ipucu: "Tablodaki 'her zaman Sen' satırlarını düşün."
sikHatalar:
  - hata: "'AWS'de çalışıyoruz, güvenlik onların işi' diye düşünmek."
    dogrusu: "AWS yalnız altyapıyı korur; hesaptaki IAM, ağ kuralları, veri ve yapılandırma sana aittir."
  - hata: "Sorumluluk tablosunu bir kez yazıp bırakmak."
    dogrusu: "Yeni servis eklendikçe tablo güncellenir; her servis için 'benim payım hangi satırlar?' sorulur."
olay:
  baslik: "Capital One veri ihlali"
  yil: 2019
  ozet: "Capital One, 2019'da bir dış araştırmacının bildirdiği bir 'yapılandırma açığı' sonrası yetkisiz erişimi doğruladı. Şirketin açıklamasına göre ABD'de yaklaşık 100 milyon, Kanada'da yaklaşık 6 milyon kişi etkilendi."
  ders: "Olay, bulut içindeki güvenliğin müşterinin payı olduğunu gösterir: sorun altyapıda değil, müşterinin yapılandırmasında aranır."
  kaynak: { ad: "Capital One: 2019 siber olay bilgilendirmesi", url: "https://www.capitalone.com/digital/facts2019/" }
terimler:
  - "Paylaşılan sorumluluk modeli"
---

Bulutta bir servis kullandığında güvenlik işi iki tarafa bölünür. Buna **paylaşılan sorumluluk modeli** (shared responsibility model) denir. AWS bunu iki cümleyle özetler: AWS **bulutun güvenliğinden** (security *of* the cloud), müşteri ise **bulut içindeki güvenlikten** (security *in* the cloud) sorumludur.

### Sağlayıcı ne korur?

Veri merkezlerinin fiziksel güvenliği, sunucular, depolama donanımı, ağ altyapısı ve servislerin çalıştığı temel yazılım katmanı. Bunların hiçbirini senin konfigüre etmen mümkün değildir; sağlayıcı bunu zaten dışarıdan denetlenen süreçlerle yapar.

### Sen ne korursun?

Hesabındaki her şeyi: kimler giriş yapabilir (IAM), hangi izinlere sahip, hangi portlar açık, hangi veri şifrelenmiş, hangi log tutuluyor. Bunlar bulut sağlayıcının varsayılan ayarlarıyla başlar ama sorumluluğu sende kalır.

### Çizgi servise göre kayar

| Katman | EC2 (sanal makine) | Lambda (sunucusuz) |
|---|---|---|
| Fiziksel altyapı | AWS | AWS |
| İşletim sistemi yamaları | **Sen** | AWS |
| Uygulama kodu | **Sen** | **Sen** |
| Ağ ve erişim kuralları | **Sen** | **Sen** |
| Veri ve şifreleme | **Sen** | **Sen** |

Servis ne kadar "yönetilen" olursa o kadar az katmanla uğraşırsın. Ama tablonun alt üç satırı hiçbir zaman kaybolmaz. Bu yüzden "yönetilen servis kullanıyoruz, güvenlik halledildi" cümlesi tehlikelidir.

### DevSecOps için pratik sonuç

Yeni bir servisi kullanmaya başlamadan önce kendine şu soruyu sor: "Bu serviste benim payım hangi satırlar?" Cevabı yazılı bir listeye çevir. İzleme, yedekleme, anahtar yönetimi gibi sonraki derslerin hepsi bu listedeki satırları kapatmaktan ibarettir.

Bir de şunu hatırla: ihlallerin büyük bir kısmı sağlayıcıdaki bir açıktan değil, müşterinin yaptığı yapılandırma hatasından doğar: herkese açık bir bucket, her şeye izin veren bir rol, internete açık bir yönetim portu. Bu bölgenin geri kalanı o hataların nasıl oluştuğunu ve nasıl önlendiğini anlatır.

Güvenlik notu: Sorumluluk tablosunu kendi hesabın için bir kez yazıp bırakma. Yeni bir servis eklediğinde tabloya yeni satırlar girer; listeni güncel tut.
