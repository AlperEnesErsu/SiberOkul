---
iddia: "VPN beni tamamen anonim yapar."
hukum: yanlis
ozet: "VPN yerel ağdaki ve internet sağlayıcındaki gözlemciyi trafiğinden uzaklaştırır, ama gözlemciyi ortadan kaldırmaz: bu kez VPN sağlayıcısı trafiğini görür. Anonimlik için bir araç değildir."
analoji: "Evden işe giden özel bir tünel gibi: yol boyunca kimse içini görmez, ama tünelin işletmecisi kimin girip çıktığını bilir."
kaynaklar:
  - { ad: "EFF Surveillance Self-Defense: Choosing the VPN That's Right for You", url: "https://ssd.eff.org/module/choosing-vpn-thats-right-you" }
ilgiliDers: ag-011
tarih: "2026-11-25"
---

EFF'nin Surveillance Self-Defense rehberi, bu konuda net bir cümle kuruyor: VPN anonimlik aracı değildir. Aynı rehber, VPN'in internet sağlayıcından gizlediği bilgilerin VPN sağlayıcısına görünür olduğunu da belirtiyor ve güvenmediğin bir VPN'i kullanma uyarısı yapıyor.

VPN'in gerçekten yaptığı:

- **Yerel gözlemciyi uzaklaştırır**: Kafe Wi-Fi'ında ya da sağlayıcında kimse hangi sitelere girdiğini bu yoldan göremez.
- **Çıkış adresini değiştirir**: Sitenin gördüğü adres VPN sunucusunundur.

VPN'in yapmadığı:

- **Seni siteden gizlemez**: Hesabına girdiysen, çerezlerin ve tarayıcı özelliklerin seni zaten tanıtır.
- **Güveni ortadan kaldırmaz**: Güven, internet sağlayıcıdan VPN sağlayıcısına kayar.
- **Cihazını korumaz**: Bilgisayardaki zararlı yazılım VPN'le birlikte de çalışır.

Kısacası VPN, "kim gözlüyor?" sorusunun cevabını değiştirir; "kimse gözlemiyor" yapmaz. Ağ dönemindeki NAT, proxy ve VPN dersinde farkı ayrıntısıyla görüyoruz.
