---
kimlik: temeller-002
baslik: "Tehdit, zafiyet, risk"
donem: 3
sira: 2
sure: 30
neden: "Güvenlik ekipleri her gün yüzlerce zafiyet bildirimiyle karşılaşır ve hepsini aynı gün düzeltemez. Hangisinin önce ele alınacağını belirlemek için tehdit, zafiyet ve risk kelimelerini doğru kullanmak ve bir CVSS puanını okuyabilmek gerekir. DevSecOps'ta bu, bir pipeline'ın build'i durdurup durdurmayacağına karar verirken doğrudan işine yarar."
analoji:
  baslik: "Evin kilidi"
  metin: "Kapının kilidi zayıfsa bu bir zafiyettir. Mahallede hırsızlık olması tehdittir. Risk ise ikisinin birleşimidir: zayıf kilitli bir ev, hırsızların çok dolaştığı bir mahallede ve içinde değerli eşya varsa risk yüksektir. Benzetmenin sınırı: dijital dünyada 'mahalle' internettir ve saldırgan sayısı kimin evinde olduğundan bağımsız, otomatik taramalarla çok yüksektir."
gorev:
  aciklama: "Terminalde kısa bir not dosyası tutacaksın. Önce kendi bilgisayarındaki bir senaryo için küçük bir risk tablosu çiz: bir varlık seç (ör. telefonun), bir tehdit, bir zafiyet. Sonra olasılık ve etkiyi 1-5 arası puanla ve çarp."
  komutlar:
    - mkdir -p ~/temeller && cd ~/temeller
    - echo "varlik=telefon; tehdit=calinma; zafiyet=ekran kilidi yok; olasilik=3; etki=5" > risk.txt
    - |-
      echo "risk skoru: $((3 * 5))" >> risk.txt
    - cat risk.txt
  soru: "Ekran kilidi koyarsan hangi değer (olasılık ya da etki) düşer? Etki neden büyük ölçüde aynı kalır?"
  telefon:
    soru: "Bir kütüphanede CVSS 9.8 puanlı bir zafiyet var ama bu kütüphane yalnızca internete kapalı bir test makinesinde çalışıyor. Aynı kütüphanede 6.5 puanlı bir zafiyet ise internete açık üretim sunucusunda. Hangisini önce düzeltirsin ve neden?"
    cevap: "Çoğu durumda 6.5'lik olanı. CVSS puanı zafiyetin teknik şiddetini ölçer, ortamını değil. Kapalı bir makinede olasılık çok düşüktür, internete açık üretimde ise yüksektir. Risk = olasılık × etki olduğu için bağlam puanı geçebilir."
sorular:
  - id: temeller-002-s1
    soru: "Tehdit, zafiyet ve risk arasındaki farkı birer cümleyle anlat."
    cevap: "Tehdit, zarar verebilecek bir olay ya da aktördür (ör. fidye grubu). Zafiyet, sistemdeki bir zayıflıktır (ör. yamalanmamış yazılım). Risk, bir tehdidin bir zafiyeti kullanarak zarar verme ihtimali ile o zararın büyüklüğünün birleşimidir."
    ipucu: "Üç kavramdan biri dış tehlike, biri sistemdeki açık, biri de sonuçtur."
  - id: temeller-002-s2
    soru: "Risk = olasılık × etki formülünde zafiyet yamalandı ama hâlâ risk kaldı. Bu nasıl olabilir?"
    cevap: "Yama bir zafiyeti kapatır ama başka zafiyetler, insan hataları ya da henüz bilinmeyen açıklar kalabilir. Risk hiçbir zaman sıfırlanmaz; amaç onu kabul edilebilir seviyeye indirmektir."
    ipucu: "Risk iki şeyin çarpımı; yamalanan zafiyet bunlardan hangisini sıfırlar, hangisini etkilemez?"
  - id: temeller-002-s3
    soru: "CVE nedir, CVSS nedir? İkisi aynı şey mi?"
    cevap: "CVE, herkese açık bilinen bir zafiyete verilen kimliktir (ör. CVE-YYYY-NNNN biçiminde). CVSS ise zafiyetin teknik şiddetini 0-10 arası puanlayan sistemdir. CVE 'hangi zafiyet', CVSS 'ne kadar ciddi' sorusunu yanıtlar; farklı şeylerdir."
    ipucu: "Biri bir kaydın adı, diğeri ona verilen puan."
  - id: temeller-002-s4
    soru: "Bir riskle başa çıkmanın dört yolu nedir? Kısaca birer örnek ver."
    cevap: "Azaltmak (yama, güvenlik duvarı), kaçınmak (riskli özelliği hiç sunmamak), aktarmak (siber sigorta), kabul etmek (maliyeti riskten büyük ve etkisi küçükse bilinçli olarak bırakmak)."
    ipucu: "Riski kabul etmek, azaltmak, aktarmak ya da kaçınmak; her biri için günlük hayattan bir örnek düşün."
  - id: temeller-002-s5
    soru: "Haftalık tarama raporunda iki bulgu var: internete açık ödeme servisinde CVSS 7.5'lik bir zafiyet ve içeride, sadece bir geliştirici laptopunda duran bir araçta CVSS 9.8'lik bir zafiyet. Sabah toplantısında hangisini önce yamalayacağını nasıl savunursun?"
    cevap: "Önce internete açık ödeme servisini yamalarım. CVSS teknik şiddeti gösterir; risk ise olasılık ve etkiyle belirlenir. Dışarıdan erişilebilen ve para akışına dokunan serviste olasılık ve etki yüksektir. Laptoptaki zafiyeti de takvime alırım, ama ikinci sıraya koyarım."
    ipucu: "Puan tek başına karar vermez; zafiyete kimin ulaşabildiğine bak."
hizliKontrol:
  - soru: "Risk için doğru ifade hangisidir?"
    secenekler: ["Zafiyetin CVSS puanına eşittir","Yalnızca saldırganın niyetidir","Olasılık ile etkinin birlikte düşünülmesidir","Yama yapıldığında her zaman sıfırdır"]
    dogru: 2
    aciklama: "Risk, bir olayın gerçekleşme olasılığı ile gerçekleşirse yaratacağı etkinin birleşimidir."
    ipucu: "Formülde iki çarpan var."
  - soru: "Bir yönetici, riskli bir eski sistemi tamamen kapatmaya karar verdi. Bu, dört yoldan hangisidir?"
    secenekler: ["Riski aktarmak","Riski kabul etmek","Riski azaltmak","Riskten kaçınmak"]
    dogru: 3
    aciklama: "Riskli faaliyeti tamamen bırakmak riskten kaçınmaktır. Sigorta aktarma, önlem almak azaltma, bilerek yaşamak kabuldür."
    ipucu: "Sistemi ortadan kaldırınca risk de ortadan kalkıyor."
sikHatalar:
  - hata: "En yüksek CVSS puanlı zafiyeti her zaman ilk yamalamak."
    dogrusu: "Puana ek olarak sistemin internete açık olup olmadığına ve etkisine bak; sonra sırala."
  - hata: "CVE ile CVSS'i aynı şey sanmak."
    dogrusu: "CVE zafiyetin kimliğidir, CVSS ona verilen ciddiyet puanıdır."
terimler:
  - "Tehdit"
  - "Zafiyet"
  - "Risk"
  - "CVE"
  - "CVSS"
derinDalis:
  - tur: okuma
    baslik: "FIRST: CVSS"
    ayrinti: "CVSS'in resmi sayfası. Puanın hangi ölçütlerden (saldırı yolu, karmaşıklık, etki) hesaplandığına bak."
    url: "https://www.first.org/cvss/"
  - tur: kitap
    baslik: "Security Engineering (Ross Anderson)"
    ayrinti: "Tehdit modelleme ve risk üzerine bölümler. Konu adıyla ara, ücretsiz sürümü yazarın sitesinde bulunur."
---

Güvenlik dilinde üç kelime sık karışır. Doğru kullanmak, doğru önceliği seçmenin ilk adımıdır.

### Üç tanım

- **Tehdit** (threat): Zarar verebilecek bir kişi, grup ya da olay. Fidye çetesi, kötü niyetli çalışan, hatta bir sel de tehdittir.
- **Zafiyet** (vulnerability): Sistemdeki bir zayıflık. Yamalanmamış yazılım, varsayılan parola, kontrolsüz bir giriş alanı.
- **Risk**: Bir tehdidin bir zafiyeti kullanarak zarar verme ihtimali ve o zararın büyüklüğü.

Basit bir formül işe yarar: **risk = olasılık × etki**. Olasılık düşük ama etki çok büyükse (ör. tüm müşteri verisi) risk yine ciddi olabilir. Etki küçükse ve olasılık da düşükse bilinçli olarak kabul edilebilir.

### Zafiyetlerin ortak dili: CVE ve CVSS

Herkesin aynı zafiyetten bahsettiğini bilmesi için bilinen zafiyetlere **CVE** (Common Vulnerabilities and Exposures) kimliği verilir. Biçimi `CVE-YIL-NUMARA`. Bir CVE'yi arayarak zafiyetin açıklamasını, etkilenen sürümleri ve düzeltmeyi bulursun.

**CVSS** (Common Vulnerability Scoring System) ise zafiyetin teknik şiddetini 0 ile 10 arasında puanlar. Genel olarak yaklaşık şöyle okunur: 0.1-3.9 düşük, 4.0-6.9 orta, 7.0-8.9 yüksek, 9.0-10.0 kritik. Puan; saldırının ağdan yapılıp yapılamadığı, kimlik bilgisi gerektirip gerektirmediği, CIA üçlüsüne etkisi gibi ölçütlerden çıkar.

### Puan körü körüne izlenmez

CVSS zafiyetin kendisini puanlar, senin ortamını değil. Aynı CVE için:

| Ortam | Gerçek risk |
|---|---|
| İnternete açık üretim sunucusu | Yüksek |
| İnternete kapalı test makinesi | Düşük |
| Zafiyetli bileşenin hiç çağrılmadığı uygulama | Çok düşük |

Bu yüzden iyi bir mühendis puanın yanında şunlara bakar: Bu zafiyet bizde gerçekten kullanılabilir mi? İnternetten erişilebiliyor mu? Aktif olarak sömürüldüğü biliniyor mu? Etkilenen varlık ne kadar değerli?

### Riske verilen dört cevap

1. **Azalt**: Yama uygula, erişimi kısıtla.
2. **Kaçın**: Riskli özelliği hiç sunma.
3. **Aktar**: Sigorta ya da dış hizmet.
4. **Kabul et**: Maliyet riskten büyükse, bilinçli ve yazılı olarak.

Dördüncü seçenek "görmezden gelmek" değildir; bilinçli kabul bir kayıt ve bir sahip gerektirir.

Güvenlik notu: Zafiyet taramaları yalnızca sana ait ya da yazılı izin aldığın sistemlerde yapılır. Başkasının sistemini "sadece bakmak için" taramak yasal sorun doğurabilir.
