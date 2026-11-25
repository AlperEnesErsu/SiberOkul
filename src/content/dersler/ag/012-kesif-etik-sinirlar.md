---
kimlik: ag-012
baslik: "Keşif ve etik sınırlar"
donem: 2
sira: 12
sure: 35
neden: "Kendi sistemlerinde hangi portların açık olduğunu görmek, sızma testinin ve zafiyet yönetiminin ilk adımıdır. Aynı araç izinsiz kullanılınca hem etik hem hukuki sorun olur. Bir DevSecOps mühendisi için araç kadar sınırı bilmek de mesleğin parçasıdır."
analoji:
  baslik: "Keşif, kendi evinin kapılarını denemek"
  metin: "Kendi evinde bütün kapı ve pencerelerin kilitli olup olmadığına bakmak sorumluluktur. Aynı şeyi komşunun kapısında yapmak, niyetin iyi olsa bile 'kapı kurcalamak'tır. Sınır: kapıyı denemek ile içeri girmek ayrı şeylerdir, ama izin olmadan ikisi de sorunludur."
gorev:
  aciklama: "Yalnız kendi makinenin kendisini (127.0.0.1) tarayacaksın. Başkasının makinesini ya da ağını tarama. `nmap` yoksa `sudo apt install -y nmap` ile kur ve ag-003'teki gibi bir yerel sunucuyu ayrı bir sekmede çalıştır (Ctrl+C ile kapat)."
  komutlar:
    - "python3 -m http.server 8000 --bind 127.0.0.1"
    - "nmap -p 1-1024 127.0.0.1"
    - "nmap -sV -p 8000 127.0.0.1"
    - "ss -tlnp"
  soru: "nmap'in bulduğu açık portlar ile `ss -tlnp` çıktısı aynı mı? nmap `8000` için hangi servisi ve sürümü tahmin etti?"
  telefon:
    soru: "nmap çıktısında `22/tcp open ssh`, `3306/tcp filtered mysql`, `8080/tcp closed http-proxy` yazıyor. Üçünün farkı nedir?"
    cevap: "open: o portta bir program dinliyor. closed: porta ulaşıldı ama dinleyen yok. filtered: nmap cevap alamadı; çoğunlukla bir güvenlik duvarı paketleri düşürüyor, bu yüzden portun durumu belirsiz."
sorular:
  - id: ag-012-s1
    soru: "Keşif (reconnaissance) saldırının ve savunmanın neresinde yer alır?"
    cevap: "Saldırgan için ilk adımdır: hangi makine, port ve servis var diye bakar. Savunmacı da aynı işi kendi sistemine yaparak saldırı yüzeyini önce görür ve gereksiz açık portları kapatır."
  - id: ag-012-s2
    soru: "nmap bir portu `open`, `closed` ve `filtered` olarak raporlarsa bu üç durum ne demektir?"
    cevap: "open: dinleyen servis var. closed: erişilebilir ama dinleyen yok. filtered: cevap yok, bir güvenlik duvarı ya da filtre engelliyor olabilir."
  - id: ag-012-s3
    soru: "Bir sistemi taramadan önce hangi izin gerekir? 'Sadece bakıyorum' neden yeterli bir gerekçe değildir?"
    cevap: "Sistem sahibinden yazılı izin (kapsam, tarih, IP aralığı) gerekir. Tarama hukuken ülkeden ülkeye farklı yorumlanır ve izinsiz yapılınca suç, iş sözleşmesi ihlali ya da hizmet aksaması sayılabilir. Niyet iyi olsa da sorumluluk seninle kalır."
  - id: ag-012-s4
    soru: "Yazılı bir 'kapsam' (scope) belgesinde neler bulunur ve neden önemlidir?"
    cevap: "Hangi adreslerin, hangi yöntemlerle, hangi tarihlerde test edileceği ve kimin yetkili olduğu yazar. Kapsam dışına çıkmamak hem hukuki korumadır hem de üretim sistemlerinin kazara zarar görmesini önler."
derinDalis:
  - tur: okuma
    baslik: "Nmap: Hukuki konular"
    ayrinti: "Port taramasının yasal durumu ve tarama öncesi yazılı izin almanın önemi."
    url: "https://nmap.org/book/legal-issues.html"
  - tur: okuma
    baslik: "Nmap Referans Kılavuzu"
    ayrinti: "Tarama türleri, port belirtme ve servis sürümü tespiti bölümleri."
    url: "https://nmap.org/book/man.html"
---

Bir sistemi korumak için önce ne olduğunu bilmek gerekir. **Keşif** (reconnaissance), bir hedefte hangi makinelerin, portların ve servislerin bulunduğunu çıkarma işidir. Saldırganlar da savunmacılar da bunu yapar; fark **izinde** ve **amaçtadır**.

### nmap

**nmap**, bir hedefe paketler yollayıp cevaplardan portların durumunu çıkaran, yaygın bir ağ tarayıcısıdır. En basit kullanım:

```
nmap 127.0.0.1
```

Bu komut en sık 1000 portu dener. Birkaç yararlı seçenek:

- `-p 1-1024` ya da `-p 22,80,443`: Hangi portlara bakılacak.
- `-sV`: Açık portlardaki servisin adını ve sürümünü tahmin etmeye çalışır.
- `-Pn`: "Önce ping atma, makine açıkmış gibi dene" (ping engelleyen hedeflerde).

### Çıktıyı okumak

Her port için üç durumdan biri raporlanır:

| Durum | Anlamı |
|---|---|
| open | O portta bir program dinliyor |
| closed | Porta ulaşıldı, dinleyen yok |
| filtered | Cevap yok; büyük olasılıkla bir güvenlik duvarı engelliyor |

ag-007'deki *refused* ile *timed out* ayrımını hatırla: closed ≈ refused, filtered ≈ timed out. nmap bu ayrımı kendi yapar.

### Savunmacı için kullanımı

- Kendi sunucunda **beklenmeyen açık portu** bulmak (ör. unutulmuş bir test servisi).
- Güvenlik duvarı kurallarının gerçekten işlediğini dışarıdan doğrulamak.
- Servis sürümü listesini çıkarıp güncelleme gerekenleri belirlemek.

Bu, ag-003'teki `ss`'in bir **dışarıdan bakış** karşılığıdır: `ss` içeriden neyin dinlediğini, nmap dışarıdan neyin görüldüğünü söyler. İkisinin farkı da bilgi verir: içeride dinleyen ama dışarıdan görünmeyen bir port, güvenlik duvarının işe yaradığını gösterir.

### Etik ve hukuki sınır

Tarama kendi içinde bir saldırı değildir ama izinsiz tarama sorun yaratır:

- Hukuk ülkeden ülkeye değişir ve net bir cevap yoktur. İzinsiz taramaya hukuken dayanak aramak yerine **izin almak** gerekir.
- Hizmet sağlayıcılar kullanım şartlarıyla taramayı yasaklayabilir; hesabın kapanabilir.
- Hassas sistemler (sağlık cihazları, endüstriyel kontrol) tarama yüzünden bozulabilir.

Sızma testi ve zafiyet taramasında bu yüzden bir **kapsam belgesi** olur: kim yetkili, hangi adresler, hangi yöntemler, hangi tarihler. Bu belge seni hem hukuken hem de kazara üretimi çökertmekten korur. Yalnız kendi makinen, kendi laboratuvarın ya da açıkça tarama izni veren hedefler üzerinde çalış.

### Bölge özeti

12 dersin sonunda zinciri biliyorsun: paket ve katman (001), adres (002), port ve TCP (003), ad çözme (004), HTTP (005), şifreleme (006), teşhis (007), paket okuma (008), güvenlik duvarı (009), SSH (010), NAT/VPN (011) ve keşif (012). Sıradaki bölge güvenliğin temel kavramlarına geçiyor.

Güvenlik notu: "Sadece merak ettim" bir izin değildir. Emin değilsen tarama; izin iste, yazılı olsun.
