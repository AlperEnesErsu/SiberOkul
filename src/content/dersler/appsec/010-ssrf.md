---
kimlik: appsec-010
baslik: "SSRF"
donem: 5
sira: 10
sure: 30
neden: "Bulutta uygulamalar çoğu zaman 'şu URL'yi getir' diye istek atar (önizleme, webhook, içe aktarma). Saldırgan bu özelliği, sunucunun iç ağındaki ya da bulut meta veri servisindeki gizli kaynaklara erişmek için kullanabilir. Bulut güvenliğinin klasik örneklerinden biridir."
analoji:
  baslik: "Kuryeyi kandırıp şirket içine sokmak"
  metin: "Dışarıdan bir kişi şirkete giremez, ama şirketin kuryesi her kapıdan geçer. Dışarıdaki biri kuryeye 'şu adresteki paketi al getir' derse ve adres şirketin içindeki gizli bir oda ise kurye güvenle alıp getirir. SSRF'de kurye senin sunucundur. Sınırı: kuryeyi insan olarak düşün; sunucu 'bu adres şüpheli mi' diye düşünmez, kurallarla yönlendirilmelidir."
gorev:
  aciklama: "Bir URL doğrulama fonksiyonu yaz: yalnız izin verilen sunuculara ve yalnız genel (public) IP'lere izin versin. Fonksiyon yalnız URL'yi analiz eder, hiçbir adrese istek göndermez."
  komutlar:
    - "mkdir -p ~/appsec && cd ~/appsec"
    - |
      cat > ssrf.py <<'EOF'
      import ipaddress
      from urllib.parse import urlparse

      IZINLI_SUNUCULAR = {"api.example.com", "cdn.example.com"}

      def url_guvenli_mi(url):
          p = urlparse(url)
          if p.scheme != "https":
              return False
          if p.hostname in IZINLI_SUNUCULAR:
              return True
          try:
              ip = ipaddress.ip_address(p.hostname)
          except (ValueError, TypeError):
              return False
          return not (ip.is_private or ip.is_loopback or ip.is_link_local)

      for u in [
          "https://api.example.com/veri",
          "http://api.example.com/veri",
          "https://127.0.0.1:8080/admin",
          "https://169.254.169.254/latest/meta-data/",
          "https://10.0.0.5/",
          "https://ornek-site.test/",
      ]:
          print(u, "->", "IZIN" if url_guvenli_mi(u) else "RED")
      EOF
    - "python3 ssrf.py"
  soru: "`169.254.169.254` adresi neden reddedildi? Bu fonksiyon sunucu adı verilen adresleri (ör. `ornek-site.test`) neden reddediyor ve daha esnek bir politika için neye dikkat etmek gerekir?"
  telefon:
    soru: "Bir uygulama 'profil resmi URL'si gir, biz indirelim' özelliği sunuyor. Saldırgan resim URL'si olarak `http://169.254.169.254/...` verirse hangi risk doğar ve hangi savunma önceliklidir?"
    cevap: "Sunucu, bulut meta veri servisine istek atar ve geçici kimlik bilgilerini saldırgana döndürebilir. Öncelikli savunma: izin listesi (yalnız bilinen alan adları), iç ve link-local adresleri reddetme, yönlendirmeleri takip etmeme ve ağ düzeyinde meta veri erişimini kısıtlama (ör. IMDSv2)."
sorular:
  - id: appsec-010-s1
    soru: "SSRF nedir?"
    cevap: "Sunucu tarafı istek sahteciliği: saldırgan, uygulamayı kendi seçtiği bir adrese (genellikle iç ağ ya da meta veri servisi) istek göndermeye yönlendirir. İstek sunucudan çıktığı için dışarıdan erişilemeyen kaynaklara ulaşılabilir."
  - id: appsec-010-s2
    soru: "Bulut meta veri servisi (ör. 169.254.169.254) neden SSRF'de hedef olur?"
    cevap: "Sanal makine içinden erişilen bu servis, makineye bağlı rolün geçici kimlik bilgilerini verebilir. SSRF ile sunucuya bu adrese istek attırılırsa bilgiler dışarı sızabilir ve bulut hesabına erişim doğabilir."
  - id: appsec-010-s3
    soru: "Yasak listesi (127.0.0.1, 10.x.x.x'i engelle) yerine izin listesi neden daha güvenlidir?"
    cevap: "Adresler çeşitli biçimlerde yazılabilir ve DNS ile yeniden yönlendirilebilir; yasak listesi atlatılır. İzin listesi yalnız bildiğin hedefleri kabul eder, bilinmeyen her şey reddedilir."
  - id: appsec-010-s4
    soru: "Yönlendirmeleri (redirect) takip etmek SSRF savunmasında neden sorun olabilir?"
    cevap: "İzinli bir adres, saldırganın kontrolündeki bir sunucuya, o da iç bir adrese yönlendirebilir. Kontrol yalnız ilk URL'ye uygulanırsa son hedef denetlenmemiş olur. Yönlendirmeleri kapatmak ya da her adımı yeniden doğrulamak gerekir."
derinDalis:
  - tur: okuma
    baslik: "OWASP Server-Side Request Forgery Prevention Cheat Sheet"
    ayrinti: "İzin listesi yaklaşımı, DNS yeniden bağlama (rebinding), bulut meta veri koruması."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html"
---

**SSRF** (server-side request forgery), uygulamanın kullanıcıdan aldığı bir URL'ye **sunucu tarafından** istek göndermesini kötüye kullanır. Dışarıdan erişemediğin iç servisler, sunucunun gözünden erişilebilirdir.

### Nerede çıkar?

Kullanıcıdan URL alan özelliklerde: bağlantı önizlemesi, resim indirme, webhook, PDF oluşturma, içe aktarma, "adresten yükle". Kod şuna benzer:

```python
# Açıklı
yanit = requests.get(kullanici_url)
return yanit.content
```

Saldırgan `kullanici_url` olarak `http://localhost:8080/admin` ya da bulut meta veri adresini verir. Sunucu isteği kendi iç ağından yapar ve yanıtı döndürür.

### Neden bulutta kritik?

Bulut sanal makinelerinde `169.254.169.254` adresindeki meta veri servisi, makineye bağlı rolün geçici kimlik bilgilerini verebilir. SSRF ile bu bilgiler sızarsa saldırgan bulut hesabında işlem yapabilir. (Bulut bölgesinde IAM ve olay müdahalesini göreceğiz.) AWS'de bunun için IMDSv2'ye geçmek ve IMDSv1'i kapatmak önerilir.

### Savunma

1. **İzin listesi:** Yalnız bilinen alan adlarına ya da adres aralıklarına istek at. Kullanıcıdan tam URL almak yerine yalnız seçim (ör. "sağlayıcı: A veya B") al.
2. **Şema ve port sınırla:** Yalnız `https`, beklenen portlar.
3. **İç adresleri reddet:** Loopback (`127.0.0.0/8`), özel aralıklar (`10/8`, `172.16/12`, `192.168/16`) ve link-local (`169.254/16`). Bu ek savunmadır, tek başına yeterli değildir.
4. **Yönlendirmeleri kapat** ya da her adımı yeniden doğrula.
5. **DNS çözümlemesini doğrula:** Adı IP'ye çevirdikten sonra o IP'yi denetle ve isteği o IP'ye gönder (DNS yeniden bağlama saldırısına karşı).
6. **Ağ katmanı:** Uygulama sunucusunun gidebileceği yerleri güvenlik duvarı ya da güvenlik grubuyla kısıtla (derinlemesine savunma).
7. **Yanıtı olduğu gibi döndürme:** Sunucu dönen içeriği kullanıcıya iletirse ayrıntı sızar.

### Kod incelemesinde kırmızı bayrak

`requests.get(`, `urllib`, `fetch(`, `HttpClient` gibi çağrılarda URL'nin **bir parçası bile** kullanıcıdan geliyorsa dur ve sor: bu adres bir izin listesinden mi geliyor? İç adresler engelli mi?

Güvenlik notu: Bu dersteki betik hiçbir adrese bağlanmaz; yalnız metin olarak URL'yi analiz eder. Başkalarının sunucularında SSRF denemek, iç ağ ya da meta veri adreslerine istek attırmak izinsiz erişimdir.
