---
kimlik: ag-006
baslik: "TLS ve sertifikalar"
donem: 2
sira: 6
sure: 35
neden: "Süresi dolmuş bir sertifika üretimde servisin durmasına, yanlış yapılandırılmış TLS ise veri sızıntısına yol açar. Bir DevSecOps mühendisi sertifika zincirini okuyabilmeli, süresini izleyebilmeli ve 'HTTPS var' demenin neyi garanti edip neyi etmediğini bilmelidir."
analoji:
  baslik: "Sertifika, noter onaylı kimlik"
  metin: "Biri 'ben bu şirketin sahibiyim' diyor; sen kimliğine değil, devletin verdiği kimliğe bakıyorsun. Sertifika, güvendiğin bir kurumun (sertifika otoritesi) 'bu anahtar bu alan adına aittir' diye attığı imzadır. Sınır: kimlik belgesi kişinin dürüst olduğunu göstermez; sertifika da sitenin iyi niyetli olduğunu göstermez, yalnız adresin doğru olduğunu gösterir."
gorev:
  aciklama: "Bir sitenin sertifikasını terminalden oku. Bu komutlar yalnızca TLS el sıkışması yapar ve veri göndermez:"
  komutlar:
    - "openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates"
    - "openssl s_client -connect example.com:443 -servername example.com -showcerts </dev/null 2>/dev/null | grep -E '^ *[0-9] s:|^   i:'"
    - "openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | grep -E 'Protocol|Verification'"
  soru: "Sertifikayı kim imzalamış (`issuer`)? Geçerlilik tarihleri (`notBefore`, `notAfter`) ne kadarlık bir süreyi kapsıyor?"
  telefon:
    soru: "Bir tarayıcı 'Bu bağlantı gizli değil, sertifikanın süresi dolmuş' uyarısı verdi. Neden sadece 'devam et'e basmamalısın?"
    cevap: "Süresi dolmuş sertifika, sitenin kimliğini doğrulayamadığın anlamına gelir. Araya girmiş biri sahte bir sertifika sunuyor da olabilir. Uyarıyı geçersen parolanı yanlış kişiye verebilirsin. Önce sahibine haber ver ya da güvenli bir ağdan tekrar dene."
sorular:
  - id: ag-006-s1
    soru: "HTTPS, düz HTTP'ye kıyasla neyi korur?"
    cevap: "Gizlilik (yoldakiler içeriği okuyamaz), bütünlük (içerik yolda değiştirilemez) ve sunucu kimliği (doğru siteyle konuştuğunu doğrular). Ama sitenin güvenilir ya da zararsız olduğunu garanti etmez."
  - id: ag-006-s2
    soru: "Sertifika zinciri nedir? Kök, ara ve yaprak sertifika ne anlama gelir?"
    cevap: "Yaprak sertifika sitenindir; bir ara sertifika otoritesi onu imzalar, ara sertifikayı da tarayıcının ya da işletim sisteminin güvendiği kök sertifika otoritesi imzalar. Tarayıcı zinciri yukarı doğru köke kadar doğrular."
  - id: ag-006-s3
    soru: "Bir saldırgan `ornekbank.com` benzeri `ornekbank-giris.com` alan adı alıp ona geçerli bir sertifika alabilir mi? Bunun anlamı ne?"
    cevap: "Evet; sertifika otoritesi yalnız alan adının sahibinin siz olduğunuzu doğrular. Yani adres çubuğundaki kilit, sitenin güvenilir ya da dürüst olduğunu değil, bağlantının şifreli olduğunu gösterir."
  - id: ag-006-s4
    soru: "Üretimde sertifika süresi dolarsa ne olur? Nasıl önlenir?"
    cevap: "Tarayıcılar uyarı verir, API istemcileri bağlantıyı reddeder ve servis fiilen durur. Otomatik yenileme (ACME, certbot gibi) ve bitiş tarihine karşı izleme alarmı kurulur."
derinDalis:
  - tur: okuma
    baslik: "Let's Encrypt: Nasıl çalışır"
    ayrinti: "Alan adı doğrulaması ve otomatik sertifika verme akışına kısa bir bakış."
    url: "https://letsencrypt.org/how-it-works/"
  - tur: okuma
    baslik: "RFC 8446: TLS 1.3"
    ayrinti: "TLS 1.3'ün standardı. Çok uzun; yalnız giriş ve el sıkışma özetini oku. Sayfa, belgenin daha yeni bir RFC ile değiştirildiğini de belirtiyor."
    url: "https://www.rfc-editor.org/rfc/rfc8446"
---

ag-005'te HTTP'nin açık metin olduğunu gördük. **TLS** (Transport Layer Security) o konuşmayı şifreli bir tünelin içine alır. HTTP'nin TLS üzerinden çalışan haline **HTTPS** denir (port 443). Eski adı SSL'dir; bugün kullanılan sürümler TLS 1.2 ve TLS 1.3'tür.

### TLS ne sağlar?

- **Gizlilik**: İçerik şifrelenir; yoldaki cihaz ne gönderdiğini okuyamaz.
- **Bütünlük**: Yolda değiştirilirse fark edilir.
- **Kimlik doğrulama**: Karşındaki sunucunun gerçekten istenen alan adının sahibi olduğundan emin olursun.

Üçüncüsü, sertifikalar sayesinde olur.

### El sıkışma, kısaca

Bağlantı kurulurken istemci ile sunucu desteklenen şifreleme yöntemleri üzerinde anlaşır, sunucu sertifikasını gönderir, istemci onu doğrular ve iki taraf ortak bir oturum anahtarı üretir. Sonraki trafik bu anahtarla hızlı (simetrik) şifreleme ile korunur. Anahtar anlaşması ve imzalar asimetrik şifrelemeye dayanır; bunun matematiğini temeller bölgesinde göreceğiz.

### Sertifika

**Sertifika** (certificate), bir alan adı ile bir açık anahtarı birbirine bağlayan, güvenilir bir tarafın imzaladığı dijital belgedir. İçinde şunlar bulunur: konu (alan adı), veren (`issuer`), geçerlilik tarihleri, açık anahtar ve imza.

Sertifikayı imzalayan kuruma **sertifika otoritesi** (CA) denir. İşletim sistemin ve tarayıcın, güvenilir kök CA'ların listesini taşır.

### Zincir

Kök CA'lar anahtarlarını nadiren kullanır; günlük işi **ara CA'lar** yapar. Bu yüzden bir site sertifikası zincir şeklindedir:

```
kök CA  ->  ara CA  ->  siteniz.com (yaprak)
```

İstemci, yaprak sertifikanın imzasını ara CA ile, ara CA'nınkini kök ile doğrular. Zincirin bir halkası eksik ya da süresi dolmuşsa doğrulama başarısız olur. `openssl s_client -showcerts` zinciri gösterir.

### Kilit simgesi neyi gösterir?

Çok yanlış anlaşılan nokta: kilit, **bağlantının şifreli ve alan adının doğrulanmış** olduğunu gösterir. Sitenin güvenilir, dürüst ya da zararsız olduğunu göstermez. Dolandırıcılar da kendi alan adları için geçerli sertifika alabilir. Bu konuyu "Efsane mi?" kartında ele aldık.

### Hataları okumak

- **Süresi dolmuş** (expired): Yenileme unutulmuştur.
- **Alan adı uyuşmuyor** (name mismatch): Sertifika başka bir ad içindir.
- **Bilinmeyen otorite**: Zincir güvenilir bir köke bağlanmıyor ya da kendinden imzalıdır (self-signed).

Test ortamında kendinden imzalı sertifikaya `curl -k` ile izin vermek kolaydır, ama bu alışkanlık üretim betiklerine sızarsa doğrulamayı tamamen kapatmış olursun.

Güvenlik notu: HTTPS'in içeriği koruması, kiminle konuştuğunu gizlediği anlamına gelmez; ağ yöneticisi çoğu durumda hangi alan adına bağlandığını görür (ag-011).
