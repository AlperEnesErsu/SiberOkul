---
kimlik: ag-002
baslik: "IP adresleri ve alt ağlar"
donem: 2
sira: 2
sure: 30
neden: "Güvenlik duvarı kuralları, bulut ağları (VPC) ve Kubernetes ağ politikaları hep IP aralıklarıyla yazılır. '10.0.1.0/24' gibi bir ifadeyi okuyamazsan hangi makinelerin kurala girdiğini bilemezsin; hatalı bir kural fazla geniş bir erişim açabilir."
analoji:
  baslik: "IP adresi, posta adresi"
  metin: "Adres 'Gül Sokak No: 12' gibi iki parçalıdır: sokak (ağ kısmı) ve kapı numarası (cihaz kısmı). CIDR'daki `/24`, adresin ne kadarının 'sokak' olduğunu söyler. Sınır: gerçek adres değişmez, IP adresi ise ağa bağlanınca verilir ve değişebilir."
gorev:
  aciklama: "Kendi ağ adreslerine bak ve bir alt ağın büyüklüğünü hesaplat. Hepsi yalnızca okuma ve hesaplamadır:"
  komutlar:
    - "ip -4 addr show"
    - "ip route"
    - "python3 -c \"import ipaddress; n = ipaddress.ip_network('192.168.1.0/24'); print(n.netmask, n.num_addresses, n.network_address, n.broadcast_address)\""
    - "python3 -c \"import ipaddress; print(ipaddress.ip_address('172.20.5.9').is_private, ipaddress.ip_address('8.8.8.8').is_private)\""
  soru: "WSL'deki IP adresin özel aralıklardan birinde mi? Hangisi ve `/` işaretinden sonraki sayı kaç?"
  telefon:
    soru: "`10.0.1.0/24` ağında kaç adres vardır ve `10.0.1.77` bu ağın içinde midir?"
    cevap: "/24, ilk 24 bitin ağ kısmı olduğunu, kalan 8 bitin cihazlar için kullanıldığını söyler: 2^8 = 256 adres (kullanılabilir 254). 10.0.1.77'nin ilk üç sayısı aynı olduğu için bu ağın içindedir."
sorular:
  - id: ag-002-s1
    soru: "Özel (private) IPv4 aralıkları hangileridir ve neden vardır?"
    cevap: "10.0.0.0/8, 172.16.0.0/12 ve 192.168.0.0/16 (RFC 1918). İnternette yönlendirilmezler; böylece her ev ya da şirket aynı adresleri kendi içinde yeniden kullanabilir ve genel adres tasarrufu sağlanır."
    ipucu: "RFC 1918'i hatırla: üç blok var, biri 172.16 ile başlıyor."
  - id: ag-002-s2
    soru: "`192.168.1.0/24` yazımında `/24` ne anlama gelir?"
    cevap: "Adresin ilk 24 bitinin ağı belirttiğini gösterir. Kalan 8 bit cihaz içindir: 256 adres, kullanılabilir 254 cihaz."
    ipucu: "Slash'tan sonraki sayı, adresin kaç bitinin sabit olduğunu söylüyor."
  - id: ag-002-s3
    soru: "`10.0.0.0/16` ağı `10.0.0.0/24` ağından kaç kat büyüktür ve neden?"
    cevap: "256 kat. /16'da cihaz için 16 bit (65.536 adres), /24'te 8 bit (256 adres) kalır. Sayı küçüldükçe ağ büyür."
    ipucu: "Cihaz için kalan bit sayısını bul, sonra 2 üzeri o sayı."
  - id: ag-002-s4
    soru: "Bir güvenlik duvarı kuralını `0.0.0.0/0` kaynağına açmak ne demektir ve neden dikkat gerektirir?"
    cevap: "Bütün IPv4 adreslerini kapsar, yani tüm internete açmaktır. Bir yönetim portunu (ör. SSH) böyle açmak herkesin deneme yapabilmesi demektir."
    ipucu: "Slash'tan önceki sıfırlar tek bir sayıyı mı yoksa tüm interneti mi gösteriyor?"
  - id: ag-002-s5
    soru: "Bulutta bir güvenlik grubunda veritabanı portunun kaynağı `0.0.0.0/0` olarak ayarlanmış görüyorsun. Uygulama sunucuları `10.0.1.0/24` alt ağında. Ne yaparsın?"
    cevap: "Kuralı hemen `10.0.1.0/24` ile sınırlarım; veritabanının tüm internete açık olması kabul edilemez. Sonra bu kurala bağlı sunucunun erişim loglarına bakıp dışarıdan bağlantı denenip denenmediğini kontrol ederim ve bulguyu ekibe bildiririm."
    ipucu: "Kaynak aralığını, bağlanması gereken gerçek istemcilere kadar daralt."
hizliKontrol:
  - soru: "`10.0.5.0/24` ağında kaç adres vardır?"
    secenekler:
      - "254"
      - "65.536"
      - "256"
      - "24"
    dogru: 2
    aciklama: "/24'te 8 bit cihaza kalır: 2^8 = 256 adres. Bunların ikisi ağ ve yayın adresi olduğundan 254 cihaz bağlanır."
    ipucu: "Önce cihaza kalan bit sayısını bul."
sikHatalar:
  - hata: "`/24` ile `/16` karşılaştırırken sayısı büyük olan ağın daha büyük olduğunu sanmak."
    dogrusu: "Slash sonrası sayı büyüdükçe ağ küçülür: /16 ağı /24 ağından 256 kat büyüktür."
  - hata: "Güvenlik duvarı kuralında `/` kısmını unutmak ya da `/0` yazmak."
    dogrusu: "Kuralı yazınca adres aralığını iki kez oku; `/0` bütün interneti, `/32` tek makineyi gösterir."
terimler:
  - "IP adresi"
  - "Özel IP adresi"
  - "CIDR"
  - "Alt ağ"
derinDalis:
  - tur: okuma
    baslik: "RFC 1918: Özel internetler için adres tahsisi"
    ayrinti: "Özel adres bloklarının resmi tanımı. Kısa bir belge."
    url: "https://www.rfc-editor.org/rfc/rfc1918"
---

Ağdaki her cihazın, paketlerin doğru yere gitmesi için bir **IP adresi** (Internet Protocol address) vardır. En yaygın sürüm **IPv4**'tür ve `192.168.1.25` gibi, noktalarla ayrılmış dört sayıdır. Her sayı 0-255 arasındadır; yani adres toplam 32 bittir. IPv4 yaklaşık 4,3 milyar adres sunar. Bu bugün yetmediği için **IPv6** (128 bit, `2001:db8::1` gibi) geliştirildi.

### Özel ve genel adresler

İnternette yönlendirilen adreslere **genel** (public) adres denir. Evdeki ya da şirketteki cihazlar çoğunlukla **özel** (private) adres kullanır. IPv4'te üç özel blok vardır:

- `10.0.0.0/8`
- `172.16.0.0/12` (172.16.x.x - 172.31.x.x)
- `192.168.0.0/16`

Özel adresler internette yönlendirilmez. Evdeki yönlendirici, çıkışta bu adresleri tek bir genel adrese çevirir; buna ag-011'de değineceğiz. Ayrıca `127.0.0.1` ("localhost") her makinenin kendisini gösteren adrestir.

### Alt ağ ve CIDR

Bir **alt ağ** (subnet), birbirini doğrudan görebilen adresler grubudur. Bir adresin ne kadarının "ağ", ne kadarının "cihaz" olduğunu **CIDR** gösterimi söyler:

```
192.168.1.0/24
```

`/24`, ilk 24 bitin ağı belirttiğini söyler. Geriye 8 bit kalır: 2^8 = 256 adres. İlk adres ağın kendi adı, son adres yayın (broadcast) adresi olduğu için pratikte 254 cihaz bağlanır. Birkaç örnek:

| CIDR | Cihaz bitleri | Adres sayısı |
|---|---|---|
| /24 | 8 | 256 |
| /16 | 16 | 65.536 |
| /32 | 0 | 1 (tek adres) |
| /0 | 32 | hepsi |

Kural kolay: **sayı büyüdükçe ağ küçülür**. `/32` tek bir makineyi, `/0` bütün interneti gösterir.

### Neden bir güvenlikçi için önemli?

Bulutta bir VPC'yi `10.0.0.0/16` olarak açar, içini `10.0.1.0/24` (web) ve `10.0.2.0/24` (veritabanı) gibi alt ağlara bölersin. Güvenlik duvarında "yalnız `10.0.1.0/24` veritabanına erişsin" dediğinde CIDR'ı okuyabilmek hayati olur. Alt ağlara bölmek, bir makine ele geçirilirse saldırganın her yere yürümesini zorlaştırır.

### Komutlar

`ip addr` (kısaca `ip a`) cihazının adreslerini gösterir. Çıktıda `inet 172.22.10.5/20` görürsen adresin `172.22.10.5`, alt ağ uzunluğu 20 bittir. `ip route` ise paketlerin nereye gideceğini söyler; `default via ...` satırı varsayılan çıkış kapısıdır.

Güvenlik notu: Bir kuralda `/` işaretini unutmak ya da `/0` yazmak çok geniş erişim açar. Kuralları yazarken adres aralığını iki kez oku.
