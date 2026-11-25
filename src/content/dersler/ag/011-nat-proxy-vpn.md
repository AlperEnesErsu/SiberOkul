---
kimlik: ag-011
baslik: "NAT, proxy ve VPN"
donem: 2
sira: 11
sure: 30
neden: "Şirket ağlarında trafiğin proxy'den geçmesi, uzaktan erişimin VPN ile yapılması ve bulutta NAT geçidi kullanılması olağandır. Bu araçların neyi sakladığını ve neyi saklamadığını bilmezsen ya yanlış güven duyarsın ya da kayıt ve olay incelemesinde yanlış adrese bakarsın."
analoji:
  baslik: "Resepsiyon, vekil ve özel tünel"
  metin: "NAT, şirketin santrali gibidir: dışarıya hep aynı numaradan arar, dönen cevabı içerideki doğru kişiye bağlar. Proxy, senin yerine alışverişe giden vekildir. VPN ise evden işe giden özel bir tüneldir: tünelin içini yol boyunca kimse görmez, ama tünelin çıkışındaki kişi ne aldığını ve nereye gittiğini bilir. Sınır: tüneli işleten kuruma güvenmek zorundasın."
gorev:
  aciklama: "Kendi iç adresini ve internetin senin için gördüğü adresi karşılaştır. İkinci komut, bir dış sitenin (ifconfig.me) senin genel IP adresini göstermesini ister; ona yalnız bu sorgu gider."
  komutlar:
    - "ip -4 -br addr"
    - "ip route get 1.1.1.1"
    - "curl -s https://ifconfig.me ; echo"
    - "env | grep -i proxy || echo 'proxy ayarı yok'"
  soru: "`ip addr` ile `curl ifconfig.me` aynı adresi mi gösteriyor? Farklıysa bu fark NAT'ı nasıl anlatıyor?"
  telefon:
    soru: "Evdeki telefon, laptop ve TV aynı anda internete çıkıyor ama bir siteye hepsi aynı genel IP ile görünüyor. Bunu hangi mekanizma sağlıyor?"
    cevap: "NAT (Network Address Translation). Yönlendirici, içerideki özel adresleri çıkışta tek bir genel adrese çevirir ve hangi cevabın hangi cihaza ait olduğunu bir tabloda tutar."
sorular:
  - id: ag-011-s1
    soru: "NAT neyi çözer ve güvenlik için neden 'tek başına güvenlik duvarı' sayılmaz?"
    cevap: "Çok sayıda özel adresli cihazın tek genel adres üzerinden internete çıkmasını sağlar. Gelen istekleri tablo dışında engellemesi bir yan etkidir; kural tabanlı, denetlenebilir bir güvenlik duvarının yerini tutmaz."
    ipucu: "NAT'ın asıl amacı güvenlik miydi?"
  - id: ag-011-s2
    soru: "İleri proxy (forward proxy) ile ters proxy (reverse proxy) arasındaki fark nedir?"
    cevap: "İleri proxy istemciler adına dışarıya erişir (şirket içinden internete çıkış denetimi). Ters proxy sunucular adına gelen istekleri karşılar ve arkadaki sunuculara dağıtır (yük dengeleme, TLS sonlandırma)."
    ipucu: "Biri istemci adına, diğeri sunucu adına çalışır."
  - id: ag-011-s3
    soru: "VPN kullanınca internet sağlayıcın neyi göremez, VPN sağlayıcı neyi görür?"
    cevap: "Sağlayıcı trafiğin içeriğini ve hedef siteleri (şifreli tünel yüzünden) göremez, yalnız VPN'e bağlandığını görür. VPN sağlayıcısı ise tüneli çözdüğü için hedef siteleri ve şifrelenmemiş içeriği görebilir. Güven sağlayıcıya kaymış olur."
    ipucu: "Tünelin iki ucunu düşün: kim neyi çözebiliyor?"
  - id: ag-011-s4
    soru: "Şirket VPN'i ile ticari 'gizlilik VPN'i' amaç olarak nasıl ayrılır?"
    cevap: "Şirket VPN'i uzaktan çalışanı şirket iç ağına güvenle bağlar. Ticari VPN çıkış adresini değiştirir ve yerel ağdaki dinlemeyi zorlaştırır. Hiçbiri tam anonimlik sağlamaz."
    ipucu: "Şirkete bağlanmak ile siteden gizlenmek aynı amaç mı?"
  - id: ag-011-s5
    soru: "Bir çalışan 'şirket VPN'i açıkken bile sitelerin beni tanıdığını' söylüyor ve VPN'in anonim yaptığını sanıyor. Ona ne dersin?"
    cevap: "VPN yerel ağdaki ve sağlayıcıdaki gözlemciyi uzaklaştırır, ama hesabına girdiyse çerezler ve oturum seni zaten tanıtır. Şirket VPN'i de seni gizlemez; şirket iç ağına güvenli erişim sağlar ve şirket trafiği görebilir. Anonimlik için ayrı bir tehdit modeli gerekir."
    ipucu: "VPN'in 'kim gözlüyor' sorusunun cevabını değiştirdiğini, kaldırmadığını hatırla."
hizliKontrol:
  - soru: "Ters proxy (reverse proxy) hangi işi yapar?"
    secenekler:
      - "Sunucular adına gelen istekleri karşılar ve arkadaki sunuculara dağıtır"
      - "İstemcilerin internete çıkışını gizler"
      - "Trafiği yakalayıp dosyaya kaydeder"
      - "Alan adlarını IP'ye çevirir"
    dogru: 0
    aciklama: "Ters proxy sunucu tarafında durur; yük dengeleme ve TLS sonlandırma gibi işler yapar."
    ipucu: "Hangi taraf adına çalıştığına bak."
sikHatalar:
  - hata: "NAT'ı güvenlik duvarı yerine koymak."
    dogrusu: "NAT'ın engellemesi bir yan etkidir; kural tabanlı, denetlenebilir bir güvenlik duvarı yine gerekir."
  - hata: "VPN açıkken tamamen anonim olduğunu varsaymak."
    dogrusu: "Güven yalnız internet sağlayıcıdan VPN sağlayıcıya kayar; hesap ve tarayıcı izleri sürer."
terimler:
  - "NAT"
  - "Proxy"
  - "VPN"
  - "IP adresi"
  - "Özel IP adresi"
derinDalis:
  - tur: okuma
    baslik: "EFF Surveillance Self-Defense: Doğru VPN'i seçmek"
    ayrinti: "VPN'in neyi korur, neyi korumaz ve sağlayıcıya neden güvenilmesi gerektiği."
    url: "https://ssd.eff.org/module/choosing-vpn-thats-right-you"
---

Bu derste üç araç var ve üçü de "adres" ile ilgili bir şeyi değiştirir. Hepsinin ortak sorusu: *Kim, kimi görüyor?*

### NAT

ag-002'de özel adresleri gördük; bunlar internette yönlendirilmez. Evdeki yönlendirici **NAT** (Network Address Translation) ile çıkış paketlerindeki özel kaynak adresi kendi genel adresiyle değiştirir ve bir tabloya yazar: "10.0.0.5'in 51000 numaralı bağlantısı bu paketti". Cevap gelince tablodan bakıp doğru cihaza iletir. Sonuç: yüzlerce cihaz tek genel adrese sığar, ama dışarıdan yalnız o tek adres görünür.

Güvenlik açısından bir yan etki: dışarıdan gelen, içeriden başlamamış bağlantılar tabloda karşılık bulmaz ve düşer. Ancak bu bir tasarım sonucudur, kurallarını yazıp denetleyebildiğin bir güvenlik duvarı değildir. Bulutta da aynı fikir görülür: özel alt ağdaki sunucular, internete **NAT geçidi** üzerinden çıkar.

### Proxy

**Proxy**, istemci ile hedef sunucu arasına giren aracıdır.

- **İleri proxy** (forward): İstemci adına internete çıkar. Şirketler zararlı sitelere erişimi engellemek, trafiği kaydetmek için kullanır. Terminalde `HTTPS_PROXY` gibi ortam değişkenleriyle ayarlanır.
- **Ters proxy** (reverse): Sunucu adına istekleri karşılar. nginx ya da bir yük dengeleyici gibi; TLS'i sonlandırır, istekleri arkadaki uygulamalara dağıtır.

Proxy trafiği gördüğü için, hem bir koruma hem de bir yoğunlaşma noktasıdır: ele geçirilirse içindeki trafiğe erişim sağlar.

### VPN

**VPN** (Virtual Private Network), cihazınla bir VPN sunucusu arasında şifreli bir tünel kurar; trafiğin tünel içinden gider. İki yaygın kullanım:

1. **Kurumsal erişim**: Uzaktan çalışanı şirket iç ağına bağlar.
2. **Ticari/gizlilik VPN'i**: Trafiği bir sağlayıcının sunucusu üzerinden çıkarır.

VPN'in koruduğu: yerel ağdaki (kafe Wi-Fi'ı gibi) ve internet sağlayıcıdaki gözlemcinin trafiğine bakışı. Hedef sitenin gördüğü kaynak adres de VPN sunucusunun adresi olur.

### Neyi gizlemez?

- Trafiği çözen **VPN sağlayıcısı** her şeyi görebilir; yani güveni sağlayıcıya taşırsın.
- Çerezler, hesaba giriş, tarayıcı parmak izi gibi başka yollar seni yine tanıtır.
- Cihazındaki kötü amaçlı yazılımı VPN durdurmaz.

Bu yüzden VPN, "anonim olmak" için değil, **gözlemciyi değiştirmek** için bir araçtır. İlgili efsane kartında kaynakla ele alıyoruz.

### Kayıtlarda adres

NAT ve proxy arkasındaki bir sunucuda log tutarken, gördüğün kaynak adres gerçek istemci olmayabilir. Ters proxy kullanılıyorsa gerçek adres `X-Forwarded-For` gibi bir başlıkta taşınır. Olay incelemesinde bu fark kritik olur.

Güvenlik notu: Bilinmeyen, ücretsiz bir VPN ya da proxy kullanmak, tüm trafiğini tanımadığın birine teslim etmektir. Güvenmediğin hizmeti kullanma.
