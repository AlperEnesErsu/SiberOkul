---
iddia: "Terraform'da bir değişkeni `sensitive = true` yapınca değeri state dosyasında da korunur."
hukum: yanlis
ozet: "HashiCorp dokümanına göre `sensitive` yalnız Terraform çıktısında değeri gizler; değer state ve plan dosyalarında yine saklanır. State'i korumak ayrı bir iştir."
analoji: "Kitabın kapağını kapatmak gibi: yüzeyde yazı görünmez ama içindeki sayfalar aynen durur; kitabı kilitli dolaba koymak gerekir."
kaynaklar:
  - { ad: "Terraform: hassas veriyi yönetmek", url: "https://developer.hashicorp.com/terraform/language/manage-sensitive-data" }
ilgiliDers: container-010
tarih: "2026-11-25"
---

`terraform plan` çıktısında `(sensitive value)` gördüğünde sırrın güvende olduğunu sanmak kolaydır. Oysa bu yalnız ekrandaki gösterimi etkiler.

Ne yapılmalı:

- State'i şifreli, erişimi kısıtlı ve kilitli bir uzak backend'de tut; Git'e koyma.
- Plan dosyalarını (`-out`) da hassas say.
- Mümkünse sırrı Terraform'a hiç vermeyip çalışma zamanında sır yöneticisinden okut. Dokümanda geçici (ephemeral) değerler de bu amaçla anılır.
- Sır sızmış olabilirse yenile.

Kısacası `sensitive` bir ekran perdesidir, kasa değildir.
