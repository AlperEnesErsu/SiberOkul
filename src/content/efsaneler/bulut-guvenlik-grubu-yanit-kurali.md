---
iddia: "Güvenlik grubunda bir bağlantıya izin versem bile yanıt trafiğinin geri dönmesi için ayrıca kural yazmam gerekir."
hukum: yanlis
ozet: "Güvenlik grupları durumludur (stateful): bir istek için verilen izin, yanıt trafiğini de kendiliğinden geçirir. Kural yazmak gereken şey, hangi yeni bağlantıların başlatılabileceğidir."
analoji: "Resepsiyon bir misafire kapıdan girme izni verdiyse, onun çıkışını ayrıca onaylamaya gerek yoktur."
kaynaklar:
  - { ad: "AWS VPC: Güvenlik grupları ile trafiği denetlemek", url: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html" }
ilgiliDers: bulut-004
tarih: "2026-11-25"
---

AWS belgesi güvenlik gruplarının durumlu olduğunu açıkça söyler. Bir örnekten yaptığın istek için yanıt trafiği, gelen kural ne olursa olsun örneğe ulaşabilir. İzin verilen gelen trafiğe verilen yanıtlar da giden kurallara bakılmaksızın çıkabilir.

Bu yüzden "gelen 443'e izin verdim, şimdi giden yanıt için de kural lazım" düşüncesi yanlıştır. Kuralları bağlantıyı **başlatan** yöne göre yazarsın. Ağ ACL'leri ise durumsuzdur; orada dönüş trafiği için ayrı kural gerekir. Karışıklık çoğu zaman bu ikisinin birbirine benzetilmesinden gelir.

Belge ayrıca güvenlik grubunun trafiği süzmediği bazı durumları sayar: Amazon DNS, DHCP, örnek meta verisi gibi. Güvenlik önerileri arasında 22 (SSH) ve 3389 (RDP) için yalnız belirli IP aralıklarına izin vermek, `0.0.0.0/0` açmamak ve büyük port aralıkları açmamak da vardır.

Hüküm: durumlu çalışma bir kolaylık; riskli olan, gereğinden geniş gelen kuraldır.
