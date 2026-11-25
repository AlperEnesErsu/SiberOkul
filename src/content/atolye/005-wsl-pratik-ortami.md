---
no: 5
baslik: "Pratik ortamı: WSL2 üzerinde Ubuntu"
tarih: "2026-11-25"
sorun: "Terminal görevleri için gerçek bir Linux gerekiyor; bilgisayar Windows."
secenekler:
  - { ad: "WSL2 + Ubuntu", aciklama: "Windows'un içinde gerçek Linux. Zaten kurulu (Ubuntu 22.04).", secildi: true }
  - { ad: "Sanal makine (VirtualBox)", aciklama: "Tam izole, ama kurulumu ağır ve bilgisayarı yavaşlatır.", secildi: false }
  - { ad: "Tarayıcı içinde terminal", aciklama: "Siteye gömülü bir Linux. Siteyi çok karmaşıklaştırır ve gerçek bir sistem değildir.", secildi: false }
neden: "Gerçek bir sistemde öğrenmek; kurulum derdi yok. Windows kullanan geliştiriciler Linux araçlarına genellikle WSL ile ulaşır."
bedel: "Bazı ağ ve donanım konuları WSL'de gerçek bir sunucudan biraz farklı davranır; o derslerde ayrıca belirtilecek."
yoklamaSorusu:
  soru: "Windows'ta hangi komut kurulu Linux dağıtımlarını ve WSL sürümlerini listeler?"
  cevap: "`wsl --list --verbose` (kısaca `wsl -l -v`)."
ilgiliDers: linux-001
---
