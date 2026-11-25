---
iddia: "Terraform state dosyası sır içermez, o yüzden Git'e konabilir."
hukum: yanlis
ozet: "HashiCorp dokümanına göre Terraform, yerel çalışırken state'i düz metin bir dosya olarak saklar ve yapılandırmadaki sır değerlerini içerir. State hassas veri gibi ele alınmalı ve Git'ten uzak tutulmalıdır."
analoji: "Mutfak defterine restoranın gizli sosunun tarifini de yazmak gibi: defteri okuyan herkes tarifi de okur."
kaynaklar:
  - { ad: "Terraform: state'te hassas veri", url: "https://developer.hashicorp.com/terraform/language/state/sensitive-data" }
ilgiliDers: container-010
tarih: "2026-11-25"
---

State dosyası Terraform'un belleğidir: yönettiği her kaynağın kimliğini ve özelliklerini kaydeder. Bir kaynağın özellikleri arasında veri tabanı parolası ya da API anahtarı varsa, bunlar da state'e yazılır.

HashiCorp dokümanı net konuşur: yerel çalışırken state düz metin bir dosyadır ve yapılandırmada tanımladığın sır değerlerini içerir; bu dosyayı hassas veri gibi ele alıp Git akışlarının dışında tutmalısın. Ayrıca `terraform output` komutunu `-json` ya da `-raw` ile çalıştırırsan hassas değerler de düz metin görünür.

Sık yapılan bir yanılgı da `sensitive = true` ayarının sırrı state'ten sildiğini sanmaktır. Bu ayar değerin ekranda ve planda gösterilmesini engeller; state'teki saklamayı değiştirmez.

Ne yapmalı:

- `*.tfstate` dosyalarını `.gitignore`'a ekle.
- State'i erişimi kısıtlı, şifreli bir uzak backend'de tut.
- State'i okuma yetkisini, dağıtım yetkisi kadar hassas say.
- Sır Git'e ya da state'e sızdıysa değiştir.
