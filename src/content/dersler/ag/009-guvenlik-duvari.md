---
kimlik: ag-009
baslik: "Güvenlik duvarı"
donem: 2
sira: 9
sure: 30
neden: "Her sunucunun ilk savunma hattı güvenlik duvarıdır; bulutta güvenlik grupları, Kubernetes'te NetworkPolicy aynı fikrin başka biçimleridir. 'Varsayılan reddet, gerekeni aç' ilkesini içselleştirmek, ilerideki birçok dersin temelidir."
analoji:
  baslik: "Güvenlik duvarı, site kapısındaki görevli"
  metin: "Görevli listeye bakar: adın listede varsa girersin, yoksa kapıdan dönersin. En güvenli kural, 'listede yoksa giremez'dir. Sınır: görevli kapıdaki kimlik ve plakaya bakar, ama içeri girdikten sonra ne yaptığını denetlemez; güvenlik duvarı da uygulama içindeki saldırıyı tek başına durdurmaz."
gorev:
  aciklama: "WSL'de güvenlik duvarını açıp kapatmayacağız; yalnız okuyacağız ve kuralları kuru çalıştırma ile deneyeceğiz. `ufw` yoksa `sudo apt install -y ufw` ile kur (kurmak etkinleştirmez)."
  komutlar:
    - "sudo ufw status verbose"
    - "sudo ufw --dry-run allow 22/tcp"
    - "sudo ufw --dry-run default deny incoming"
    - "sudo iptables -L -n | head -20"
  soru: "`ufw status` ne diyor (`inactive` ya da `active`)? `--dry-run` çıktısında ufw, kuralı gerçekten uygulamadan neyi göstermiş olabilir?"
  telefon:
    soru: "Bir sunucuda `ufw status` şunu gösteriyor: `Default: deny (incoming), allow (outgoing)`, `22/tcp ALLOW IN Anywhere`. Hangi trafik içeri girebilir?"
    cevap: "Yalnız 22/tcp (SSH). Diğer bütün gelen bağlantılar reddedilir; giden bağlantılar serbesttir. Daha sıkı olması için 22'yi yalnız belirli bir IP aralığına açmak düşünülebilir."
sorular:
  - id: ag-009-s1
    soru: "'Varsayılan reddet' (default deny) ilkesi nedir ve neden 'varsayılan izin ver'den iyidir?"
    cevap: "Açıkça izin verilmeyen her şey engellenir. Bir şeyi unutursan sonuç 'erişilemiyor' olur (güvenli hata); 'varsayılan izin'de unutulan her şey açık kalır."
  - id: ag-009-s2
    soru: "Durum izlemeli (stateful) güvenlik duvarı ne demek?"
    cevap: "Hangi bağlantıların içeriden başlatıldığını hatırlar; dönüş trafiğine otomatik izin verir. Böylece yalnız yeni gelen bağlantılar kural kontrolüne takılır, cevap paketleri için ayrı kural yazmak gerekmez."
  - id: ag-009-s3
    soru: "ufw kuralı `ufw allow from 10.0.1.0/24 to any port 5432` neyi sağlar?"
    cevap: "Yalnız 10.0.1.0/24 alt ağındaki makinelerin bu sunucunun 5432 portuna (PostgreSQL) bağlanmasına izin verir. Diğer kaynaklar varsayılan reddedilir."
  - id: ag-009-s4
    soru: "Uzaktaki bir sunucuda `ufw enable` demeden önce neye dikkat etmelisin?"
    cevap: "SSH portuna (genelde 22) izni önceden eklemelisin. Aksi halde güvenlik duvarı açılır açılmaz kendi bağlantını keser ve sunucuya erişemez hale gelirsin."
derinDalis:
  - tur: okuma
    baslik: "Ubuntu Server belgeleri: Güvenlik duvarları"
    ayrinti: "ufw'nin temel kullanımı ve iptables ile ilişkisi."
    url: "https://ubuntu.com/server/docs/how-to/security/firewalls/"
---

**Güvenlik duvarı** (firewall), ağ trafiğine kurallara göre izin veren ya da engelleyen yazılım veya cihazdır. Her paket için sorulan soru basit: *Bu paket kural listemden birine uyuyor mu?* Uyuyorsa kural der ki: izin ver ya da reddet.

### Kural neye bakar?

Çoğu kural şu bilgilere bakar: kaynak adres, hedef adres, protokol (TCP/UDP), hedef port ve yön (gelen ya da giden). Örnek bir cümle: "10.0.1.0/24 ağından gelen TCP 5432'ye izin ver." Önceki derslerdeki CIDR ve port bilgisi burada işe yarıyor.

### En önemli ilke: varsayılan reddet

İki yaklaşım vardır:

- **Varsayılan izin ver**: Her şey açık, tehlikeli olanı sen engellersin. Unuttuğun her şey açık kalır.
- **Varsayılan reddet** (default deny): Her şey kapalı, gerekeni sen açarsın. Unuttuğun şey en kötü ihtimalle "çalışmıyor" hatası verir.

Güvenlik için ikincisi doğrudur. Gelen trafikte **varsayılan reddet, giden trafikte genelde izin ver** yaygın bir başlangıçtır.

### ufw

Ubuntu'da **ufw** (Uncomplicated Firewall), karmaşık kural yazımını basitleştiren bir ön yüzdür. Arkada çekirdeğin paket süzgecini (iptables/nftables) yönetir. Birkaç temel komut:

```
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow from 10.0.1.0/24 to any port 5432
sudo ufw enable
sudo ufw status verbose
```

Bu komutları yalnız anlamak için okuyoruz; WSL'de ya da önemli bir makinede alıştırma olarak `enable` çalıştırma. Uzaktaki bir sunucuda, SSH iznini vermeden `enable` demek, kendi bağlantını kesmektir.

### iptables mantığı

iptables'ta kurallar **zincirler** (chains) içinde yukarıdan aşağı sırayla denenir; ilk eşleşen kural uygulanır. Başlıca zincirler: `INPUT` (makineye gelen), `OUTPUT` (makineden giden), `FORWARD` (makineden geçen). Hiçbir kural eşleşmezse zincirin **varsayılan politikası** (ACCEPT ya da DROP) uygulanır. Kuralların sırası önemlidir: geniş bir "izin ver" kuralı, altındaki dar "reddet" kuralını anlamsızlaştırabilir.

### Durum izleme

Modern güvenlik duvarları **durum izler** (stateful): içeriden başlattığın bağlantının dönüş paketlerine otomatik izin verir. Yalnız yeni gelen bağlantı denemeleri kurallara takılır.

### DROP ve REJECT

Reddetmenin iki türü vardır. **DROP** paketi sessizce atar; karşı taraf zaman aşımına uğrar (ag-007'deki *timed out*). **REJECT** bir hata yanıtı döner (*connection refused*). DROP saldırgana daha az bilgi verir, REJECT ise meşru kullanıcıya hızlı geri bildirim sağlar.

### Sınırları

Güvenlik duvarı bir **katmandır**, çözümün tamamı değil. Açık bıraktığın bir porttan gelen uygulama saldırısını (SQL injection gibi) durdurmaz. Bu yüzden derinlemesine savunma ile birlikte düşünülür.

Güvenlik notu: Kuralı eklerken tarih ve gerekçeyi bir yere not et. "Geçici" açılan portlar çoğu zaman yıllarca açık kalır.
