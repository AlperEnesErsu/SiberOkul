---
kimlik: bulut-004
baslik: "Bulut ağları"
donem: 8
sira: 4
sure: 30
neden: "Bir sunucuyu internete açmak tek bir kuralla olur: güvenlik grubunda `0.0.0.0/0`. Bulutta ağ, bir kablo çekmek yerine birkaç satır yapılandırmadır; yanlışı da aynı hızla yayılır. Ağ katmanını okuyabilmek, hem tasarımda hem denetimde temel iştir."
analoji:
  baslik: "Site, bina ve kapıcı"
  metin: "VPC, çevresi çitle çevrili bir site gibidir. Alt ağlar sitedeki binalar; bazılarının caddeye açılan kapısı var (genel alt ağ), bazıları yalnız site içinden girilen binalar (özel alt ağ). Güvenlik grubu, her dairenin kapısındaki kapıcıdır: listede olmayana kapıyı açmaz. Sınır: kapıcıya 'herkes girsin' yazarsan o da herkesi içeri alır."
gorev:
  aciklama: "Bulutta ağ kurmaz. Bir güvenlik grubunun `aws ec2 describe-security-groups` çıktısına benzer örnek JSON'unu yazıp `jq` ile dünyaya açık portları bulacaksın (`sudo apt install -y jq`)."
  komutlar:
    - |-
      cat > /tmp/sg.json <<'EOF'
      {"SecurityGroups":[
       {"GroupId":"sg-web","GroupName":"web","IpPermissions":[
         {"IpProtocol":"tcp","FromPort":443,"ToPort":443,"IpRanges":[{"CidrIp":"0.0.0.0/0"}]},
         {"IpProtocol":"tcp","FromPort":22,"ToPort":22,"IpRanges":[{"CidrIp":"0.0.0.0/0"}]}]},
       {"GroupId":"sg-db","GroupName":"db","IpPermissions":[
         {"IpProtocol":"tcp","FromPort":5432,"ToPort":5432,"UserIdGroupPairs":[{"GroupId":"sg-web"}]}]}
      ]}
      EOF
    - jq -r '.SecurityGroups[] | .GroupId as $g | .IpPermissions[] | select(.IpRanges[]?.CidrIp=="0.0.0.0/0") | "\($g) port \(.FromPort) dunyaya acik"' /tmp/sg.json
    - jq -r '.SecurityGroups[] | select(.GroupId=="sg-db") | .IpPermissions[].UserIdGroupPairs[].GroupId' /tmp/sg.json
  soru: "Çıktıdaki iki satırdan hangisi meşru, hangisi düzeltilmeli? Veritabanı grubunun kaynağı IP yerine başka bir güvenlik grubu olması neden iyi bir fikirdir?"
  telefon:
    soru: "Bir EC2 sunucusunun güvenlik grubunda SSH (22) portu `0.0.0.0/0` için açık. Ne olur ve nasıl düzeltirsin?"
    cevap: "İnternetteki herkes SSH denemesi yapabilir; botlar saatler içinde parola ve anahtar denemeye başlar. Kaynağı yalnız kendi sabit IP aralığına daraltırsın ya da SSH yerine Systems Manager Session Manager gibi portsuz bir erişim kullanırsın."
sorular:
  - id: bulut-004-s1
    soru: "VPC, alt ağ (subnet) ve güvenlik grubunu bir cümleyle ilişkilendir."
    cevap: "VPC senin izole sanal ağındır, alt ağlar onun IP aralığından dilimlerdir, güvenlik grubu ise içindeki kaynaklara gelen ve giden trafiği filtreleyen sanal güvenlik duvarıdır."
  - id: bulut-004-s2
    soru: "Genel (public) ve özel (private) alt ağ arasındaki fark nedir?"
    cevap: "Genel alt ağın yönlendirme tablosunda internet geçidine (internet gateway) giden bir yol vardır. Özel alt ağda bu yol yoktur; dışarı çıkmak gerekiyorsa NAT gibi kontrollü bir yol kullanılır. Veritabanları özel alt ağa konur."
  - id: bulut-004-s3
    soru: "Güvenlik grupları 'durumlu' (stateful) ne demektir?"
    cevap: "İzin verilen bir isteğin yanıtı, ayrıca kural yazılmadan geri geçer. Güvenlik grubunda yalnız izin kuralları vardır; kuralı olmayan trafik varsayılan olarak engellenir."
  - id: bulut-004-s4
    soru: "Yönetim portları (SSH 22, RDP 3389) için en güvenli yaklaşım nedir?"
    cevap: "Dünyaya açmamak. Yalnız bilinen IP aralıklarına izin ver ya da portu hiç açmadan oturum yöneticisi gibi bir servis kullan."
derinDalis:
  - tur: okuma
    baslik: "AWS: Güvenlik grupları"
    ayrinti: "Durumlu çalışma, en iyi uygulamalar ve 22/3389 portları için uyarılar."
    url: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html"
---

Bulutta ağ da koddur: birkaç satırla bir ağ doğar. Üç parçayı tanımak yeterli bir başlangıçtır.

### VPC

**VPC** (Virtual Private Cloud, sanal özel bulut), hesabında ayırdığın izole bir ağdır. Kendi IP aralığını (CIDR, ör. `10.0.0.0/16`) seçersin. Başka müşterilerin ağlarıyla aynı fiziksel altyapıyı paylaşsa da mantıksal olarak ayrıdır.

### Alt ağlar

VPC'yi dilimlere ayırırsın. İki tür düşün:

- **Genel alt ağ** (public subnet): Yönlendirme tablosunda internet geçidine bir yol var. Yük dengeleyici gibi dışarıya bakan kaynaklar buradadır.
- **Özel alt ağ** (private subnet): İnternetten doğrudan erişilemeyen kaynaklar. Veritabanı, iç servisler ve çoğu uygulama sunucusu buraya konur.

Bir alt ağın genel mi özel mi olduğunu adı değil **yönlendirme tablosu** belirler.

### Güvenlik grupları

**Güvenlik grubu** (security group) kaynağa bağlanan sanal bir güvenlik duvarıdır. İki özelliğini bil:

1. Yalnız **izin** kuralları vardır. Kuralı olmayan trafik engellenir.
2. **Durumludur** (stateful): izin verilen bir bağlantının yanıt trafiği kendiliğinden geçer.

Kurallar kaynak, port ve protokolü belirtir. Kaynak olarak bir IP aralığı ya da **başka bir güvenlik grubu** verebilirsin. Veritabanı grubuna "yalnız web grubundan 5432" yazmak, IP listesi tutmaktan çok daha dayanıklıdır; web sunucusu yeni bir IP alsa da kural çalışır.

### Ağ ACL'leri

Alt ağ düzeyinde bir ikinci katman daha vardır: **ağ ACL'si** (network ACL). Güvenlik grubunun aksine durumsuzdur ve hem izin hem red kuralı içerir. Çoğu zaman güvenlik grupları ve iyi bir alt ağ tasarımı işi görür; ACL ek bir katmandır.

### En sık yapılan hatalar

| Hata | Sonuç |
|---|---|
| SSH/RDP'yi `0.0.0.0/0`'a açmak | Sürekli kaba kuvvet denemesi |
| Veritabanını genel alt ağa koymak | Yanlış bir kuralla doğrudan internete açılır |
| Büyük port aralıklarını açmak | Gereksiz saldırı yüzeyi |
| Tüm kaynaklar için tek bir güvenlik grubu | Her kural herkese uygulanır |

### DevSecOps için

Ağ kurallarını elle değil, kodla (örneğin Terraform) tanımla; böylece bir `0.0.0.0/0` satırı pull request'te göze çarpar ve pipeline'daki bir kontrol onu durdurabilir. Mimarinin kaba çizimi: internet, yük dengeleyici (genel alt ağ), uygulama (özel), veritabanı (daha da kısıtlı).

Güvenlik notu: Bir güvenlik grubunda `0.0.0.0/0` ile yalnız 80/443 gibi bilerek herkese açtığın portları kullan. Yönetim ve veritabanı portları için bu kural bir olay habercisidir.
