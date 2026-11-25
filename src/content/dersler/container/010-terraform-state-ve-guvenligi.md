---
kimlik: container-010
baslik: "Terraform state ve güvenliği"
donem: 7
sira: 10
sure: 35
neden: "Terraform'un state dosyası, yönettiği altyapının tam bir haritasıdır ve çoğu zaman parolalar, anahtarlar gibi sırları düz metin olarak içerir. State'in Git'e düşmesi, gerçek dünyada sık görülen bir sızıntı yoludur."
analoji:
  baslik: "Mutfak defteri"
  metin: "State, aşçının defteridir: hangi tencerede ne pişiyor, hangi malzemeden ne kadar kaldı yazar. Defter olmadan aşçı neyin zaten pişirildiğini bilemez. Ama deftere sırlar da yazılmışsa (restoranın gizli sosu gibi) defteri her önüne gelen okuyabilmemeli. Sınırı: defter bir kişidedir; iki aşçı aynı anda deftere yazarsa karışır, bu yüzden kilit gerekir."
gorev:
  aciklama: "Terraform kurulu olmalı. Deney `/tmp` altında yerel `random` sağlayıcısıyla rastgele bir parola üretir ve state'e bakar; bulutla ilgisi yoktur, ücretsizdir. `init` sağlayıcıyı internetten indirir. Üretilen parola yalnız deneme içindir."
  komutlar:
    - mkdir -p /tmp/tf-state && cd /tmp/tf-state
    - |
      cat > main.tf <<'EOF'
      terraform {
        required_providers {
          random = { source = "hashicorp/random" }
        }
      }
      resource "random_password" "db" {
        length = 16
      }
      output "parola" {
        value     = random_password.db.result
        sensitive = true
      }
      EOF
    - terraform init
    - terraform apply -auto-approve
    - terraform output parola
    - grep '"result"' terraform.tfstate
    - terraform destroy -auto-approve
  soru: "`terraform apply` çıktısında parola neden `<sensitive>` göründü? `grep` ile state dosyasında ne gördün ve bu `sensitive = true` hakkında ne söylüyor?"
  telefon:
    soru: "Bir ekip arkadaşın `terraform.tfstate` dosyasını Git'e eklemiş. Parola içeren bir kaynak varsa bu ne anlama gelir ve ne yaparsın?"
    cevap: "State düz metin olduğundan parola depoyu okuyan herkesçe görülür; sızmış say. Sırrı değiştir (rotasyon), state'i depodan ve geçmişten çıkar, `.gitignore`'a ekle ve state'i erişim kontrollü ve şifreli bir uzak backend'e taşı."
sorular:
  - id: container-010-s1
    soru: "State dosyası ne işe yarar?"
    cevap: "Terraform'un hangi gerçek kaynakları yönettiğini ve onların son bilinen özelliklerini kaydeder. `plan` sırasında kodla gerçek durumu bu kayıt üzerinden karşılaştırır."
    ipucu: "State, Terraform'un gerçek dünyayı nasıl hatırladığıdır; içinde ne olabilir?"
  - id: container-010-s2
    soru: "`sensitive = true` işaretlemek sırrı state'ten siler mi?"
    cevap: "Hayır. Yalnız terminal çıktısında ve planda değerin gösterilmesini engeller. Değer yine de state dosyasında düz metin saklanır; bu yüzden state'in kendisi korunmalıdır."
    ipucu: "'Sensitive' etiketi nerede gizler, nerede gizlemez?"
  - id: container-010-s3
    soru: "Yerel state yerine uzak backend (remote backend) kullanmanın güvenlik avantajları nelerdir?"
    cevap: "State merkezi, şifreli ve erişim kontrollü bir yerde durur; kişisel bilgisayarlara dağılmaz, Git'e kaza ile girmez. Ayrıca sürümlenir ve denetim günlüğü tutulabilir."
    ipucu: "Uzak, şifreli ve erişimi kısıtlı bir yer neleri kazandırır?"
  - id: container-010-s4
    soru: "State kilidi (locking) neden gerekir?"
    cevap: "İki kişi ya da iki CI işi aynı anda `apply` ederse state bozulabilir ya da değişiklikler birbirini ezer. Kilit, aynı anda tek işlemin state'i değiştirmesini sağlar."
    ipucu: "İki kişi aynı anda apply çalıştırırsa ne olur?"
  - id: container-010-s5
    soru: "Git geçmişinde `terraform.tfstate` dosyasının commit edildiğini fark ettin; içinde veritabanı parolası var. Ne yaparsın?"
    cevap: "Parolayı sızmış sayıp hemen yenilersin. Dosyayı geçmişten temizler, `.gitignore`'a ekler ve state'i şifreli, erişimi kısıtlı uzak backend'e taşırsın. Gelecekte pre-commit ya da CI sır taramasıyla tekrarlanmasını engellersin."
    ipucu: "Depoya girmiş sırrı 'silmek' yetmez."
hizliKontrol:
  - soru: "`sensitive = true` değeri state'ten siler mi?"
    secenekler: ["Evet, state'e hiç yazılmaz","Hayır; yalnız çıktılarda gizler, state'te düz metin kalabilir","Evet, state şifrelenir","Yalnız yerel backend'de siler"]
    dogru: 1
    aciklama: "sensitive bir görüntüleme ayarıdır; state ve plan dosyaları yine değeri içerir."
    ipucu: "Gizlemek ile saklamamak farklıdır."
sikHatalar:
  - hata: "State dosyasını Git'e eklemek."
    dogrusu: "State'i şifreli, kilitli ve erişimi kısıtlı uzak backend'de tut; `.gitignore`'a ekle."
  - hata: "`sensitive = true` yazınca sırrın korunduğunu sanmak."
    dogrusu: "Bu yalnız çıktıları gizler; state'in kendisini koru."
terimler:
  - "Terraform state"
  - "Terraform"
  - "Secret"
derinDalis:
  - tur: okuma
    baslik: "Terraform: state'te hassas veri"
    ayrinti: "State'in neden düz metin olduğu ve nasıl korunacağı."
    url: "https://developer.hashicorp.com/terraform/language/state/sensitive-data"
  - tur: okuma
    baslik: "Terraform: state kilitleme"
    ayrinti: "Eşzamanlı çalışmaları engelleyen kilit mekanizması."
    url: "https://developer.hashicorp.com/terraform/language/state/locking"
  - tur: okuma
    baslik: "Terraform: backend yapılandırması"
    ayrinti: "State'in nerede saklanacağını seçmek."
    url: "https://developer.hashicorp.com/terraform/language/backend"
---

Geçen derste `terraform apply` sonrası dizinde bir `terraform.tfstate` dosyası belirdi. Bu dosya sıradan bir yan ürün değildir: Terraform'un belleğidir.

### State ne tutar

State, koddaki her kaynağın gerçek dünyadaki karşılığını eşler: kimliğini, bütün özelliklerini, bağımlılıklarını. `plan` sırasında "kodda şu var, gerçekte şu var, fark şu" hesabı bu dosya sayesinde yapılır. State kaybolursa Terraform neyi yönettiğini bilmez ve her şeyi yeniden oluşturmaya çalışabilir.

### Sır sorunu

Bir kaynağın özellikleri arasında parola, erişim anahtarı ya da özel anahtar varsa, bu değerler state'e yazılır. HashiCorp dokümanı bunu açıkça belirtir: yerel çalışırken state **düz metin** bir dosyadır ve yapılandırmadaki sır değerlerini içerir.

Görevde bunu gördün: çıktıda `<sensitive>` yazdı, ama `grep` ile state dosyasında parolayı düz metin buldun. **`sensitive = true` bir görüntüleme ayarıdır**, saklama ayarı değildir. Ekranda, planda ve günlüklerde değeri gizler; dosyada gizlemez.

### State'i korumak

1. **Git'e koyma.** `.gitignore` dosyasına `*.tfstate`, `*.tfstate.*` ve `.terraform/` ekle.
2. **Uzak backend** (remote backend) kullan: bulut depolama (şifreli bir bucket), Terraform Cloud/HCP gibi çözümler. State orada şifreli ve erişim kontrollü durur.
3. **Erişimi daralt.** State'i okuyabilen herkes içindeki sırları okur. Okuma yetkisi, dağıtım yetkisi kadar hassastır.
4. **Sürümleme ve yedek.** Bozulursa önceki sürüme dönebil.
5. **Kilit** (locking). Uzak backend'lerin çoğu kilidi destekler: aynı anda tek `apply` çalışır.
6. **Sırrı hiç state'e almamaya çalış.** Güncel Terraform sürümleri bazı sırları state'e yazmayan özellikler sunar (ephemeral değerler, write-only argümanlar); ayrıntı için dokümana bak. En sağlam yaklaşım, sırrı kodda tanımlamayıp harici bir sır yöneticisinde tutmaktır.

### Yan konu: plan dosyaları

Kaydedilmiş bir plan dosyası da hassas veri içerebilir; onu da sır gibi ele al ve CI çıktılarına koyma.

### Tehlikeli komutlar

`terraform output -json` ve `-raw` bayrakları `sensitive` değerleri düz metin yazdırır. CI günlüklerinde bu komutu kullanırsan sırrı günlüğe dökersin.

### İş akışında yer

Güvenli bir akış şöyle görünür: kod Git'te, state uzak ve şifreli backend'de, `plan` çekme isteğinde incelenir, `apply` yalnız onaydan sonra ve en az yetkili bir kimlikle yapılır.

Güvenlik notu: State'e sızmış bir sırrı silmek yetmez; Git geçmişinde kalır. Sızan sırrı **her zaman değiştir** ve geçmişi temizlemeyi ayrıca düşün.
