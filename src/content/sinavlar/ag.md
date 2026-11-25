---
donem: 2
baslik: "Ağ bölgesi sınavı"
sorular:
  - soru: "Bir web sitesine girerken verinin yolculuğunu doğru sırayla anlatan seçenek hangisidir?"
    secenekler:
      - "TCP bağlantısı, DNS sorgusu, HTTP isteği"
      - "DNS sorgusu, TCP bağlantısı, (HTTPS ise TLS), HTTP isteği"
      - "HTTP isteği, DNS sorgusu, TCP bağlantısı"
      - "TLS el sıkışması, DNS sorgusu, ping"
    dogru: 1
    aciklama: "Önce alan adı IP'ye çevrilir, sonra TCP bağlantısı kurulur, HTTPS ise TLS el sıkışması yapılır ve en sonda HTTP isteği gider. Diğer sıralar, adresi bilmeden bağlantı kurmayı varsayar."
    ipucu: "Önce alan adının IP'ye çevrilmesi gerektiğini düşün; sonra bağlantı, en son istek."
  - soru: "Bir paket ağda ilerlerken hangi katman, 'hangi makineye, hangi yoldan' sorusuna cevap verir?"
    secenekler:
      - "İnternet katmanı (IP)"
      - "Taşıma katmanı"
      - "Bağlantı katmanı"
      - "Uygulama katmanı"
    dogru: 0
    aciklama: "IP adresleme ve yönlendirme internet katmanının işidir. Taşıma katmanı hangi programa gidileceğini (port), bağlantı katmanı ise yan yana iki cihaz arası iletimi çözer."
    ipucu: "Hangi katman 'hangi programa' değil, 'hangi makineye' sorusuna bakar?"
  - soru: "Aşağıdakilerden hangisi özel (private) bir IPv4 adresidir?"
    secenekler:
      - "172.32.4.9"
      - "11.0.0.1"
      - "192.169.1.1"
      - "172.20.4.9"
    dogru: 3
    aciklama: "172.16.0.0/12 bloğu 172.16-172.31 arasıdır; 172.20 bu aralıkta. 172.32 ve 192.169 aralığın dışındadır, 11.0.0.1 genel adrestir."
    ipucu: "RFC 1918'deki üç bloğun sınırlarını hatırla; 172 bloğunun nerede bittiğine dikkat et."
  - soru: "Bir güvenlik kuralında kaynak olarak `10.0.1.0/24` yazılmıştır. Aşağıdakilerden hangisi bu kapsama girer?"
    secenekler:
      - "10.0.2.15"
      - "10.1.1.7"
      - "10.0.1.200"
      - "192.168.1.5"
    dogru: 2
    aciklama: "/24 ilk üç sayının sabit olduğunu söyler: 10.0.1.x. Yalnız 10.0.1.200 uyar; ötekilerde ilk üç sayıdan en az biri farklıdır."
    ipucu: "/24 için ilk üç sayı sabit; seçeneklerin üçünü bu kurala göre ele."
  - soru: "Bir sunucuda `ss -tulpn` çıktısında `0.0.0.0:5432 LISTEN postgres` görüyorsun. Veritabanı yalnız aynı makinedeki uygulamaya hizmet ediyor. Ne yaparsın?"
    secenekler:
      - "Bir şey yapmazsın; 0.0.0.0 yalnız yerel erişim demektir"
      - "Servisi yalnız 127.0.0.1'e bağlayıp ya da güvenlik duvarıyla dış erişimi kapatırsın"
      - "Portu 5433'e taşırsın; numara değişince güvenli olur"
      - "ss çıktısını güvenilmez sayıp görmezden gelirsin"
    dogru: 1
    aciklama: "0.0.0.0 bütün arayüzlerden erişim demektir. Yalnız yerel kullanım için 127.0.0.1'e bağlamak ya da dışarıyı güvenlik duvarıyla kapatmak gerekir. Port numarasını değiştirmek erişimi kısıtlamaz."
    ipucu: "0.0.0.0 ile 127.0.0.1 farkını düşün: kim bağlanabilmeli, kim bağlanmamalı?"
  - soru: "TCP üçlü el sıkışmada paketlerin sırası hangisidir?"
    secenekler:
      - "SYN, SYN-ACK, ACK"
      - "ACK, SYN, SYN-ACK"
      - "SYN, ACK, SYN-ACK"
      - "SYN-ACK, SYN, ACK"
    dogru: 0
    aciklama: "İstemci SYN yollar, sunucu SYN-ACK ile yanıtlar, istemci ACK gönderir. Diğer sıralamalar bu akışı bozar."
    ipucu: "İstemci ilk mesajı gönderir; sunucu iki şeyi birden yapan bir cevap verir."
  - soru: "`dig example.com` çıktısında `status: NXDOMAIN` görüyorsun. Bu ne anlama gelir?"
    secenekler:
      - "DNS sunucusuna ulaşılamıyor"
      - "Hedef sunucu 500 hatası veriyor"
      - "Sertifikanın süresi dolmuş"
      - "Alan adı mevcut değil; DNS çalışıyor ve bunu söylüyor"
    dogru: 3
    aciklama: "NXDOMAIN, DNS'in cevap verdiğini ve böyle bir ad bulunmadığını söyler. Ulaşılamayan DNS farklı bir hata (zaman aşımı) verir; sertifika ve 500 hatası DNS ile ilgili değildir."
    ipucu: "Bu durum kodu bir hata mı yoksa 'böyle bir kayıt yok' bilgisi mi?"
  - soru: "Bir saldırgan, bir kuruma ait bulut kaynağı silindiği halde hâlâ ona işaret eden bir CNAME kaydını sahiplenip o alt alan adında içerik yayınlıyor. Bu nedir?"
    secenekler:
      - "SSH kaba kuvvet saldırısı"
      - "TCP SYN seli"
      - "Sarkan DNS kaydının (dangling record) ele geçirilmesi"
      - "NAT geçidi hatası"
    dogru: 2
    aciklama: "Silinmiş kaynağa işaret eden kayıt temizlenmediğinde başkası o kaynağı sahiplenebilir. SYN seli, SSH kaba kuvvet ve NAT hatası bu senaryoyu anlatmaz."
    ipucu: "Kaydı başka bir ad işaret ediyor ama işaret edilen kaynak artık sahipsiz."
  - soru: "Bir istekte `POST /giris HTTP/1.1` gönderildi ve yanıt `403 Forbidden` geldi. Aşağıdakilerden hangisi doğrudur?"
    secenekler:
      - "İstek başarılı oldu ve sunucu yönlendirme yaptı"
      - "Sunucu isteği anladı ama bu kaynak için izin vermedi"
      - "Sunucu çöktü ve istek işlenemedi"
      - "İstenen adres bulunamadı"
    dogru: 1
    aciklama: "403 bir istemci hatasıdır (4xx) ve yetkisizlik anlamına gelir. Yönlendirme 3xx, sunucu hatası 5xx, bulunamadı 404'tür."
    ipucu: "4xx ve 5xx sınıfları farklı tarafı işaret eder; 401 ile 403'ü de ayır."
  - soru: "Bir yanıtta `Server: Apache/2.4.1 (Ubuntu) PHP/5.6` başlığı görüyorsun. Güvenlik gözüyle en doğru yorum hangisidir?"
    secenekler:
      - "Saldırgana yazılım ve sürüm bilgisi verir; üretimde gereksiz ayrıntıyı kısmak iyi olur"
      - "Zararsızdır; sürüm bilgisi saldırganlar için işe yaramaz"
      - "Sunucunun HTTPS kullandığını kanıtlar"
      - "Yanıtın sunucudan değil bir proxy'den geldiğini gösterir"
    dogru: 0
    aciklama: "Sürüm bilgisi bilinen zafiyetlerin aranmasını kolaylaştırır. Başlık HTTPS'i kanıtlamaz ve proxy'yi göstermez."
    ipucu: "Sürüm bilgisi saldırgana ne kazandırır?"
  - soru: "Bir sitede tarayıcı kilit simgesi gösteriyor. Hangi çıkarım doğrudur?"
    secenekler:
      - "Site güvenilir ve dolandırıcılık içermez"
      - "Site hiçbir çerez kullanmaz"
      - "Sitenin sahibi devlet tarafından doğrulanmıştır"
      - "Bağlantı şifreli ve alan adı bir sertifikayla doğrulanmış; sitenin niyeti hakkında bir şey söylemez"
    dogru: 3
    aciklama: "Kilit, bağlantının şifreli ve alan adının doğrulanmış olduğunu gösterir. Dolandırıcılar da geçerli sertifika alabildiği için sitenin dürüst olduğunu göstermez."
    ipucu: "Kilit simgesi hangi soruya cevap verir: bağlantı mı, sitenin kendisi mi?"
  - soru: "Bir sertifika zincirinde doğrulama sırası hangisidir?"
    secenekler:
      - "Yalnız yaprak sertifikanın kendi imzası yeter"
      - "Kök sertifika yaprak sertifika ile doğrulanır"
      - "Yaprak sertifika ara CA ile, ara CA güvenilir kök ile doğrulanır"
      - "Tarayıcı sertifikayı sitenin kendisine sorarak doğrular"
    dogru: 2
    aciklama: "Yaprak, ara CA tarafından imzalanır; ara CA da tarayıcının güvendiği bir kök tarafından. Kendinden imzalı olması güveni sağlamaz."
    ipucu: "Zinciri tarayıcı hangi uçtan hangi uca doğrular?"
  - soru: "`nc -zv sunucu 8443` için `Connection refused` aldın. En olası açıklama hangisidir?"
    secenekler:
      - "Bir güvenlik duvarı paketleri sessizce düşürüyor"
      - "Makineye ulaşıldı ama o portta dinleyen program yok"
      - "DNS adı çözülemiyor"
      - "TLS sertifikası geçersiz"
    dogru: 1
    aciklama: "Refused, makinenin cevap verdiğini ama portta dinleyen olmadığını gösterir. Sessiz düşürme zaman aşımı verir; DNS ve TLS hataları farklı mesajlarla gelir."
    ipucu: "'Reddedildi' ile 'cevap yok' arasındaki farkı düşün; port kimin elinde?"
  - soru: "`tcpdump -i lo -A` ile yerel bir HTTP isteğini yakaladın ve parola düz metin göründü. Aynı isteği HTTPS ile yapsaydın ne görürdün?"
    secenekler:
      - "İçerik şifreli görünürdü; adresler, portlar ve boyutlar yine görülebilirdi"
      - "Aynı düz metin görünürdü"
      - "Hiçbir paket yakalanamazdı"
      - "Yalnız DNS sorguları şifreli olurdu"
    dogru: 0
    aciklama: "TLS içeriği şifreler ama paketin kimden kime gittiği ve boyutu görünür. Paketler yine yakalanabilir; DNS ayrı bir konudur."
    ipucu: "Şifreli trafikte yakalayıcı hangi bilgilere hâlâ ulaşabilir?"
  - soru: "Uzak bir sunucuda ufw'yu yeni kuruyorsun. Doğru sıra hangisidir?"
    secenekler:
      - "ufw enable, sonra SSH iznini ekle"
      - "Önce sunucuyu yeniden başlat, sonra kuralları yaz"
      - "Varsayılanı izin ver yap ve tehlikeli portları tek tek engelle"
      - "Varsayılanı reddet yap, 22/tcp'ye izin ver, sonra enable"
    dogru: 3
    aciklama: "Önce varsayılan reddet ve SSH izni verilir, sonra etkinleştirilir; aksi halde kendi bağlantın kesilir. Varsayılan izin yaklaşımı unutulan her şeyi açık bırakır."
    ipucu: "Uzak sunucuda güvenlik duvarını açarken kendi bağlantını nasıl korursun?"
  - soru: "Bir güvenlik duvarında DROP ile REJECT arasındaki fark nedir?"
    secenekler:
      - "DROP trafiği kaydeder, REJECT kaydetmez"
      - "DROP yalnız UDP'de, REJECT yalnız TCP'de çalışır"
      - "DROP paketi sessizce atar, REJECT karşı tarafa bir hata cevabı döner"
      - "İkisi birebir aynıdır"
    dogru: 2
    aciklama: "DROP zaman aşımına, REJECT 'connection refused' benzeri anlık hataya yol açar. Protokol ya da kayıtla ilgili bir ayrım değildir."
    ipucu: "Biri karşı tarafa 'kapalı' diye bildirir, diğeri sessiz kalır."
  - soru: "Bir sunucunun `sshd_config` dosyasında hangi değişiklik sertleştirme için en doğrudur?"
    secenekler:
      - "PermitRootLogin yes yapmak"
      - "PasswordAuthentication no yapıp yalnız anahtarla girişe izin vermek"
      - "SSH portunu 22'de bırakıp parolaları kısaltmak"
      - "known_hosts dosyasını silmek"
    dogru: 1
    aciklama: "Parola girişini kapatıp anahtara geçmek kaba kuvveti etkisiz kılar. Root girişini açmak riski artırır; known_hosts istemci tarafındadır ve silmek korumayı azaltır."
    ipucu: "Parolayı ve doğrudan root girişini hangi ayar kapatır?"
  - soru: "Bir SSH bağlantısında 'REMOTE HOST IDENTIFICATION HAS CHANGED' uyarısı çıkıyor. Doğru davranış hangisidir?"
    secenekler:
      - "Sunucunun yeni parmak izini sahibinden başka bir kanaldan doğrulamak"
      - "Uyarıyı yok sayıp bağlanmaya devam etmek"
      - "Parolanı yenisiyle değiştirmek"
      - "known_hosts dosyasının tamamını silip denemek"
    dogru: 0
    aciklama: "Parmak izi değişimi, sunucunun yeniden kurulduğunu ya da araya girildiğini gösterebilir; bağımsız bir yolla doğrulanmalıdır. Uyarıyı geçmek ya da dosyayı silmek ortadaki adam riskini kabul etmektir."
    ipucu: "Parmak izi neden değişmiş olabilir ve bunu nasıl doğrularsın?"
  - soru: "Ev yönlendiricisi arkasındaki üç cihaz aynı siteye aynı genel IP ile görünüyor. Bunun nedeni nedir ve VPN ile ilişkisi nasıldır?"
    secenekler:
      - "DNS her cihaza aynı adresi verir"
      - "VPN tüm cihazları anonim yapar; NAT de aynı işi görür"
      - "Proxy sitenin kayıtlarını siler"
      - "NAT özel adresleri tek genel adrese çevirir; VPN ise çıkış adresini sağlayıcının sunucusuna kaydırır ve güveni sağlayıcıya taşır"
    dogru: 3
    aciklama: "NAT adres çevirisidir; VPN ise trafiği şifreli bir tünelden geçirir, ama sağlayıcı trafiği görebilir. VPN tam anonimlik sağlamaz."
    ipucu: "Aynı genel adresi paylaşan cihazları hangi teknik yönetir?"
  - soru: "Bir güvenlik ekibi müşteri adına bir ağda nmap taraması yapacak. Aşağıdakilerden hangisi doğru uygulamadır?"
    secenekler:
      - "Kısa sürdüğü için izin almadan hızlıca taramak"
      - "Sadece açık portlara baktığı için izin gerekmediğini varsaymak"
      - "Kapsam, tarih ve adresleri içeren yazılı izin alıp yalnız o kapsamda taramak"
      - "Tarama aracının varsayılan ayarlarının yasal olduğunu varsaymak"
    dogru: 2
    aciklama: "Yazılı izin ve kapsam hem hukuki koruma sağlar hem de kazara zarar vermeyi önler. 'Sadece bakıyorum' izin yerine geçmez."
    ipucu: "Yazılı izin ve kapsam belgesi olmadan hangi eylem meşru sayılmaz?"
---
