---
donem: 5
baslik: "Uygulama güvenliği bölgesi sınavı"
sorular:
  - soru: "Bir tarama raporu 'A01 Broken Access Control' diyor. Bu başlık için aşağıdakilerden hangisi doğru bir yorumdur?"
    secenekler: [ "Parolalar zayıf hash'leniyor", "Kullanıcılar yapmaması gereken kayıtlara ya da işlevlere erişebiliyor", "Sunucuda eski bir kütüphane var", "Sayfada güvenlik başlıkları eksik" ]
    dogru: 1
    aciklama: "Erişim kontrolü bozukluğu, yetkisiz erişim demektir (ör. IDOR). Diğer şıklar kimlik doğrulama, bağımlılık ve yanlış yapılandırma sınıflarını anlatır."
    ipucu: "Başlığın adındaki 'erişim' sözcüğüne ve hangi güvenlik özelliğinin bozulduğuna odaklan."
  - soru: "Bir formda telefon alanı yalnız tarayıcıdaki JavaScript ile doğrulanıyor. Sunucu hiçbir şey kontrol etmiyor. Sorun nedir?"
    secenekler: [ "Saldırgan isteği doğrudan sunucuya göndererek kontrolü atlayabilir", "Sorun yok, tarayıcı kontrolü yeterlidir", "JavaScript yavaş olduğu için doğrulama başarısız olur", "Yalnız mobil tarayıcılarda sorun çıkar" ]
    dogru: 0
    aciklama: "İstemci saldırganın kontrolündedir; doğrulama sunucuda yapılmalıdır. İstemci kontrolü yalnız kullanıcıya geri bildirim içindir."
    ipucu: "İstemci tarafı kodunu kimin kontrol ettiğini düşün."
  - soru: "Kullanıcı girdisi HTML sayfasına yazılırken hangi önlem doğru bağlamdadır?"
    secenekler: [ "SQL parametresi kullanmak", "Girdiyi küçük harfe çevirmek", "Girdiden yalnız tırnakları silmek", "HTML çıktı kodlaması yapmak" ]
    dogru: 3
    aciklama: "HTML bağlamında `<` gibi karakterler kodlanır. Parametreli sorgu SQL içindir; küçük harfe çevirmek ve tırnak silmek yetersizdir."
    ipucu: "Çıktının yazıldığı bağlamı (HTML) ve o bağlama uygun önlemi eşleştir."
  - soru: "Kodda `db.execute(f\"SELECT * FROM urun WHERE ad = '{ad}'\")` satırını görüyorsun ve `ad` kullanıcıdan geliyor. En iyi düzeltme hangisi?"
    secenekler: [ "`ad` içindeki tırnakları silmek", "Veri tabanı adını gizlemek", "Sorguyu parametreli hale getirmek: `WHERE ad = ?` ve değeri ayrı vermek", "Sorguyu büyük harfle yazmak" ]
    dogru: 2
    aciklama: "Parametreli sorgu veriyi komuttan ayırır. Elle kaçırma kırılgandır; diğer şıklar sorunu çözmez."
    ipucu: "Veriyi komuttan ayıran yaklaşımı hatırla."
  - soru: "Bir geliştirici ham SQL yerine ORM kullandığı için SQL injection'dan korunduğunu düşünüyor, ama bazı yerlerde ORM'in ham sorgu fonksiyonuna string birleştiriyor. Ne olur?"
    secenekler: [ "ORM her durumda korur", "Birleştirilen kısım yine enjeksiyona açıktır", "Yalnız INSERT sorgularında risk olur", "Veri tabanı otomatik olarak engeller" ]
    dogru: 1
    aciklama: "ORM'ler çoğunlukla parametre kullanır, ama string birleştirilen ham ya da dinamik sorgularda açık geri gelir."
    ipucu: "ORM ham sorguya inildiğinde kendi korumasını da bırakır mı?"
  - soru: "Bir yorum alanı, kaydedilen yorumu HTML olarak kodlamadan her ziyaretçiye gösteriyor. Bu hangi açık türüdür?"
    secenekler: [ "Depolanan XSS", "CSRF", "Yansıyan XSS", "SSRF" ]
    dogru: 0
    aciklama: "Kötü girdi veri tabanında saklanıp sayfayı açan herkese sunulduğu için depolanan XSS'tir. Yansıyan XSS'te girdi isteğin içinden geri döner."
    ipucu: "Kötü girdinin nerede saklandığına ve kimlere sunulduğuna bak."
  - soru: "XSS açığı bulunan bir sitede ek katman olarak CSP başlığı eklendi. Doğru ifade hangisi?"
    secenekler: [ "CSP artık çıktı kodlamayı gereksiz kılar", "CSP varken XSS mümkün değildir", "CSP yalnız CSRF'yi engeller", "CSP açığın zararını sınırlar ama çıktı kodlamanın yerini tutmaz" ]
    dogru: 3
    aciklama: "CSP bir ek savunma katmanıdır; asıl çözüm bağlama uygun çıktı kodlamasıdır."
    ipucu: "Ek katman ile asıl çözüm arasındaki farkı düşün."
  - soru: "Banka, havale isteğini yalnız oturum çerezine bakarak onaylıyor. Kullanıcı başka bir sitedeki gizli forma maruz kaldığında havale gerçekleşiyor. Hangi savunma bunu en doğrudan önler?"
    secenekler: [ "Sayfa başlığını kısaltmak", "Havale sayfasında renkleri değiştirmek", "Durumu değiştiren isteklerde CSRF token doğrulamak", "Yalnız HTTP/1.1 kullanmak" ]
    dogru: 2
    aciklama: "Token, saldırganın başka bir siteden bilemeyeceği bir değerdir. SameSite çerezi ek katmandır."
    ipucu: "Saldırganın başka siteden bilemeyeceği bir değeri düşün."
  - soru: "`Set-Cookie: oturum=...; Secure; HttpOnly; SameSite=Lax` içindeki `HttpOnly` neyi sağlar?"
    secenekler: [ "Çerez yalnız HTTPS ile gönderilir", "JavaScript çerezi `document.cookie` ile okuyamaz", "Çerez hiçbir istekte gönderilmez", "Çerez otomatik olarak yenilenir" ]
    dogru: 1
    aciklama: "HttpOnly, XSS durumunda çerezin çalınmasını zorlaştırır. HTTPS zorunluluğunu `Secure` sağlar."
    ipucu: "Bayrağın adı hangi saldırı yolunu (betik erişimi) kapattığını söyler."
  - soru: "Bir saldırgan kurbanın tarayıcısına bildiği bir oturum kimliği yerleştiriyor, kurban giriş yapınca aynı kimlikle oturuma giriyor. En doğrudan önlem nedir?"
    secenekler: [ "Girişten sonra oturum kimliğini yenilemek", "Çerezi küçük harfle yazmak", "Parolayı uzatmak", "Giriş sayfasına resim eklemek" ]
    dogru: 0
    aciklama: "Oturum sabitleme, giriş sonrası kimliğin yenilenmesiyle önlenir; eski kimlik geçersiz olur."
    ipucu: "Saldırganın önceden bildiği kimliğin giriş sonrası ne olması gerekir?"
  - soru: "Giriş sayfası yanlış parolada 'Parola hatalı', kayıtsız e-postada 'Bu e-posta kayıtlı değil' diyor. Bu neye yol açar?"
    secenekler: [ "Hız sınırı gerekmez", "CSRF açığına", "Parolaların düz metin saklanmasına", "Saldırganın kayıtlı e-postaları öğrenmesine (kullanıcı numaralandırma)" ]
    dogru: 3
    aciklama: "Hata mesajları farklıysa hesabın var olup olmadığı sızar. Her iki durumda aynı genel mesaj verilmelidir."
    ipucu: "İki farklı mesajın dışarıya ne sızdırdığını düşün."
  - soru: "`GET /siparis/501` isteğinde sayıyı 502 yapan kullanıcı başkasının siparişini görüyor. En doğru düzeltme nedir?"
    secenekler: [ "Sipariş sayfasına CAPTCHA koymak", "Siparis numaralarını gizli tutmak için sayfa adını değiştirmek", "Sunucuda her istekte siparişin o kullanıcıya ait olduğunu denetlemek", "Yalnız yönetici arayüzünde butonu gizlemek" ]
    dogru: 2
    aciklama: "Bu bir IDOR'dur; çözüm sunucu tarafında sahiplik denetimidir. UUID kullanmak yalnız tahmini zorlaştırır, gizlenen buton güvenlik değildir."
    ipucu: "Karar sunucuda mı verilmeli, istemcide mi? Sahipliği kim denetler?"
  - soru: "Üretimdeki bir uygulama hata anında kullanıcıya yığın izi ve SQL sorgusu gösteriyor. Hangi yaklaşım doğrudur?"
    secenekler: [ "Aynen bırakmak, geliştirici için faydalıdır", "Kullanıcıya genel mesaj göstermek, ayrıntıyı sunucu günlüğüne yazmak", "Hata mesajını İngilizceye çevirmek", "Hataları tamamen yok saymak ve günlüğe de yazmamak" ]
    dogru: 1
    aciklama: "Ayrıntılı hata saldırgana bilgi verir; ama hata yine de günlüğe yazılmalıdır ki ekip sorunu görebilsin."
    ipucu: "Hata ayrıntısı kime yarar ve hata kaydı nereye yazılmalı?"
  - soru: "Hangi başlık, tarayıcıya siteye belirtilen süre boyunca yalnız HTTPS ile bağlanmasını söyler?"
    secenekler: [ "`Strict-Transport-Security`", "`X-Frame-Options`", "`X-Content-Type-Options`", "`Cache-Control`" ]
    dogru: 0
    aciklama: "HSTS, düz HTTP isteklerinin tarayıcı tarafında HTTPS'e yükseltilmesini sağlar."
    ipucu: "Başlığın adındaki 'Transport' ve 'Security' sözcüklerini düşün."
  - soru: "`pip-audit` projendeki bir paket için bilinen bir açık ve düzeltilmiş sürüm bildiriyor. Doğru adım hangisidir?"
    secenekler: [ "Kilit dosyasını silmek", "Raporu yok saymak, çünkü çalışıyor", "Tüm bağımlılıkları silmek", "Paketi düzeltilmiş sürüme yükseltmek, testleri çalıştırmak ve taramayı tekrarlamak" ]
    dogru: 3
    aciklama: "Araçlar açığı bulur ama düzeltmez; yükseltme ve doğrulama senin işindir."
    ipucu: "Araç bulur ama kim düzeltir? Düzeltmeden sonra doğrulama gerekir mi?"
  - soru: "Bir özellik kullanıcıdan URL alıp sunucuda o adresten içerik indiriyor. Saldırgan URL olarak bulut meta veri adresini veriyor. Bu hangi açık sınıfıdır ve en güçlü savunma hangisidir?"
    secenekler: [ "XSS; çıktı kodlama", "CSRF; SameSite çerezi", "SSRF; yalnız izin verilen hedeflere istek atmak", "SQL injection; parametreli sorgu" ]
    dogru: 2
    aciklama: "Sunucuyu kendi seçtiği adrese istek atmaya yönlendirmek SSRF'dir. İzin listesi, iç adresleri reddetme ve ağ kısıtları birlikte kullanılır."
    ipucu: "Sunucunun kullanıcı adına kendi ağından istek atması hangi sınıfı çağrıştırır?"
  - soru: "Tehdit modellemede 'saldırgan başka bir kullanıcının kimliğine bürünüyor' tehdidi STRIDE'ın hangi harfine karşılık gelir?"
    secenekler: [ "T (Tampering)", "S (Spoofing)", "D (Denial of service)", "R (Repudiation)" ]
    dogru: 1
    aciklama: "Kimlik taklidi Spoofing'dir. Tampering veriyi değiştirmek, Repudiation eylemi inkâr etmektir."
    ipucu: "STRIDE harflerinden hangisi bir kimliğin taklidiyle ilgili?"
  - soru: "PR'da `subprocess.run(\"convert \" + dosya, shell=True)` görüyorsun ve `dosya` kullanıcıdan geliyor. İncelemede en doğru yorum hangisidir?"
    secenekler: [ "Komut enjeksiyonu riski var: kabuk kullanmadan argüman listesiyle çağır ve girdiyi doğrula", "Sorun yok, subprocess güvenlidir", "Yalnız dosya adını büyük harfe çevir", "Komutu `eval` ile çalıştır" ]
    dogru: 0
    aciklama: "`shell=True` ile string birleştirmek komut enjeksiyonuna yol açar. Argüman listesi kullanmak ve girdiyi doğrulamak çözümdür."
    ipucu: "Kullanıcı girdisi bir kabuk komutuna ulaşırsa ne olur; kabuk gerçekten gerekli mi?"
---
