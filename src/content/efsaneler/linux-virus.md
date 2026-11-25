---
iddia: "Linux'a virüs ve saldırı bulaşmaz."
hukum: yanlis
ozet: "Linux sunucuları gerçek saldırıların hedefidir. MITRE ATT&CK, Linux çalıştıran sistemleri hedef aldığı bilinen teknikleri ayrı bir matriste listeler."
analoji: "Sağlam kilitli bir ev gibi: kilit işe yarar ama kapıyı kendin açıp yabancıyı içeri alırsan ya da pencere açık kalırsa hırsızlık yine olur."
kaynaklar:
  - { ad: "MITRE ATT&CK: Enterprise Linux Matrix", url: "https://attack.mitre.org/matrices/enterprise/linux/" }
ilgiliDers: linux-010
tarih: "2026-11-25"
---

MITRE ATT&CK, saldırganların kullandığı taktik ve teknikleri derleyen herkese açık bir bilgi tabanıdır. Bu tabanın Linux matrisi, sayfanın kendi ifadesiyle Linux çalıştıran makineleri hedef aldığı bilinen teknikleri toplar. Matriste kalıcılık (persistence), yetki yükseltme (privilege escalation) ve savunmayı zayıflatma gibi sütunlar vardır. Yani saldırganların Linux için ayrı bir araç kutusu var.

Efsanenin doğru olan tarafı: masaüstü Linux'ta bulaşan klasik "virüs" tarihsel olarak az görülmüştür ve açık kaynak kod, açıkların hızlı bulunup kapatılmasına yardım eder. Ama bu "bulaşmaz" demek değildir. İnternetteki sunucuların büyük kısmı Linux çalıştırdığı için saldırganlar için çekici hedeflerdir.

Linux'ta tehlike çoğu zaman bir "virüs" değil, **yanlış yapılandırmadır**: zayıf SSH parolası, güncellenmemiş paket, fazla izinli dosya ya da kullanıcının internetten kopyalayıp root olarak çalıştırdığı bir komut. Bu yüzden bu bölgede izinleri, `sudo`yu, logları ve paket güncellemelerini öğreniyoruz.
