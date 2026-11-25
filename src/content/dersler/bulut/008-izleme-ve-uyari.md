---
kimlik: bulut-008
baslik: "İzleme ve uyarı"
donem: 8
sira: 8
sure: 30
neden: "Sistem bozulduğunda ya da saldırı altında olduğunda bunu kullanıcıdan önce sen bilmelisin. Ama her şeye alarm kurarsan kimse bakmaz. Doğru metriği seçmek, eşiği ayarlamak ve gürültüyü azaltmak, nöbet tutan her mühendisin gündelik işidir."
analoji:
  baslik: "Ev duman dedektörü"
  metin: "Dedektör dumanı ölçer (metrik), eşiği geçince öter (alarm). Her tost yakışında ötüyorsa bir süre sonra pili çıkarırsın; asıl yangında sessiz kalır. İyi alarm, gerçek yangında öter, tostta ötmez. Sınır: dedektör yangını önlemez, yalnız haber verir; haberi alınca ne yapılacağı ayrıca planlanmalıdır."
gorev:
  aciklama: "Bulutta alarm kurmaz. Bir CSV içinde 'dakikada başarısız giriş sayısı' ölçümü yazıp, bir CloudWatch alarmının 'son 5 ölçümden 3'ü eşiği aşarsa' mantığını `awk` ile kendin hesaplayacaksın."
  komutlar:
    - |-
      cat > /tmp/metrik.csv <<'EOF'
      dakika,basarisiz_giris
      1,2
      2,1
      3,40
      4,3
      5,55
      6,60
      7,2
      8,1
      9,70
      10,80
      EOF
    - |-
      awk -F, 'NR>1 {v[NR-1]=$2; n=NR-1} END {esik=20; for(i=5;i<=n;i++){c=0; for(j=i-4;j<=i;j++) if(v[j]>esik) c++; print "dakika "i": "c"/5 asim -> " (c>=3 ? "ALARM" : "OK")}}' /tmp/metrik.csv
    - |-
      awk -F, 'NR>1 && $2>20 {print "tek olcum asimi: dakika "$1}' /tmp/metrik.csv
    - aws cloudwatch put-metric-alarm help | sed -n '1,25p'
  soru: "Tek ölçümde eşik aşılınca alarm ile 'son 5 ölçümden 3'ü' kuralı arasında kaç farklı dakikada alarm çıkıyor? Hangisi daha az yanlış alarm üretir, hangisi geç haber verir?"
  telefon:
    soru: "Bir CPU alarmı her gece yedekleme çalışırken 2 dakika ötüp kapanıyor, ekip artık mesajları görmüyor. Ne yaparsın?"
    cevap: "Alarmı değerlendirme süresini uzatırım (ör. 5 ölçümden 3'ü) ya da bakım penceresinde bastırırım. Böylece geçici ve beklenen artış alarm üretmez; ekip gerçek sorunda yeniden alarma güvenir."
sorular:
  - id: bulut-008-s1
    soru: "Metrik (metric) ile log arasındaki fark nedir?"
    cevap: "Metrik, zaman içinde ölçülen bir sayıdır (CPU yüzdesi, dakikadaki hata sayısı). Log, belirli bir olayın ayrıntılı metinsel kaydıdır. Metrik 'bir şey var' der, log 'ne olduğunu' anlatır."
  - id: bulut-008-s2
    soru: "CloudWatch alarmı hangi üç durumdan birinde olur?"
    cevap: "OK (eşik aşılmadı), ALARM (eşik koşula göre aşıldı) ve INSUFFICIENT_DATA (karar vermeye yetecek veri yok). Veri yoksa alarmın 'iyi' sayılmayacağını bilmek önemlidir."
  - id: bulut-008-s3
    soru: "Alarm yorgunluğu (alert fatigue) nedir ve nasıl azaltılır?"
    cevap: "Çok fazla ve çoğu önemsiz alarm, ekibin hepsini görmezden gelmesine yol açar. Azaltmak için eşik ve değerlendirme süresi ayarlanır, her alarma bir eylem tanımlanır, harekete geçirmeyen alarmlar silinir ya da düşük öncelikli yapılır."
  - id: bulut-008-s4
    soru: "Güvenlik için hangi metrikleri izlemek mantıklıdır?"
    cevap: "Başarısız giriş sayısı, kök hesap kullanımı, IAM değişiklikleri, güvenlik grubu değişiklikleri, beklenmedik bölgede kaynak oluşması ve CloudTrail'in kapatılması. Bunların çoğu CloudTrail log'larından metrik filtreleriyle üretilir."
derinDalis:
  - tur: kitap
    baslik: "Site Reliability Engineering (Google)"
    ayrinti: "'Monitoring Distributed Systems' bölümü: neyin, neden ve ne sıklıkla izlenmesi gerektiği üzerine."
---

İzleme üç parçadan oluşur: **ölçmek**, **kaydetmek** ve **haber vermek**.

### Metrik

**Metrik** (metric), zamana bağlı sayısal ölçümdür: bir sunucunun CPU yüzdesi, dakikadaki istek sayısı, hata sayısı. AWS'de bu işi **CloudWatch** yapar. Çoğu AWS servisi kendi metriklerini otomatik gönderir; kendi uygulamanın metriklerini de gönderebilirsin.

### Log

**Log**, tek bir olayın metin kaydıdır. Uygulama log'ları, sistem log'ları ve CloudTrail olayları CloudWatch Logs'a akıtılabilir. Log'lardan **metrik filtreleri** yazarak sayı üretebilirsin: "ConsoleLogin ve Failure içeren satır sayısı" gibi. Böylece bir log deseni, alarm kurulabilen bir metriğe döner.

### Alarm

**Alarm**, bir metriği bir eşikle karşılaştırır. Üç durumu vardır:

| Durum | Anlamı |
|---|---|
| OK | Koşul sağlanmadı |
| ALARM | Koşul sağlandı, bildirim gider |
| INSUFFICIENT_DATA | Karar için yeterli veri yok |

Alarm tek bir ölçümde değil, **birkaç ölçüm penceresinde** değerlendirilebilir: "5 ölçümden 3'ü eşiği aşarsa". Bu, anlık dalgalanmaları süzer. Bildirim bir SNS konusuna (ve oradan e-posta, mesaj ya da otomasyona) gider.

### Gürültü yönetimi

Gürültülü alarm, alarm olmamasından kötüdür; çünkü güven kaybettirir. Üç kural:

1. **Her alarm bir eylem doğurmalı.** Ne yapılacağı söylenemiyorsa alarm değildir; panoya ait bir bilgidir.
2. **Belirti üzerine alarm kur, neden üzerine değil.** "Kullanıcılar hata alıyor" önemlidir; "CPU %80" tek başına belki değildir.
3. **Eşiği gerçek veriyle ayarla.** Bir hafta ölçüm topla, normal aralığı gör, eşiği ona göre koy.

### Güvenlik izlemesine uygulamak

Örnek: son 5 dakikada 3 ya da daha fazla ölçümde başarısız giriş sayısı eşiği aşarsa uyar. Ölçüyü CloudTrail'den, kökü kullanımı, `StopLogging` ve politika değişikliklerini ise ayrı alarmlar olarak izle. Alarmlar "bir şeyler oldu" der; kimin yaptığını ve bağlamı log'lar gösterir. Bu yüzden izleme ve log'lama birlikte çalışır.

Alarmın zincir halkaları: **metrik, eşik, bildirim, kişi, eylem**. Zincirin herhangi bir halkası kopuksa (bildirim yanlış adrese gidiyor, nöbetçi belli değil) alarm işe yaramaz.

Güvenlik notu: Alarmı kuran kişi alarmı sessize alabilen kişidir. Alarm ve bildirim yapılandırmalarının değişimi de kayıt altında ve izlenir olsun.
