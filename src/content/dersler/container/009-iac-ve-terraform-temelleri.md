---
kimlik: container-009
baslik: "IaC ve Terraform temelleri"
donem: 7
sira: 9
sure: 35
neden: "Altyapıyı elle tıklayarak kurmak tekrarlanamaz ve denetlenemez. Altyapıyı kod olarak yazınca (IaC) değişiklikler Git'te incelenir, test edilir, geri alınır. DevSecOps'ta güvenlik denetimleri de bu kodun üstüne kurulur."
analoji:
  baslik: "Yemek tarifi ve aşçı"
  metin: "Elle altyapı kurmak, ustanın 'gözüm ölçüsüyle' yaptığı yemek gibidir: bir daha aynısı çıkmaz. IaC bir tariftir: ne istediğini yazarsın, Terraform malzeme listesine bakıp eksikleri tamamlar. `plan` aşçının 'şunları yapacağım' demesi, `apply` pişirmesidir. Sınırı: tarif yazılı olsa da mutfakta (gerçek altyapıda) başkası elle tuz atarsa tarifle yemek ayrışır; buna 'drift' denir."
gorev:
  aciklama: "Bilgisayarında Terraform kurulu olmalı (https://developer.hashicorp.com/terraform/install). Aşağıdaki deney yalnız yerel `local` sağlayıcısıyla `/tmp` altında bir dosya oluşturur; bulutla ilgisi yoktur, ücretsizdir. `init` sağlayıcı eklentisini internetten indirir."
  komutlar:
    - mkdir -p /tmp/tf-deneme && cd /tmp/tf-deneme
    - |
      cat > main.tf <<'EOF'
      terraform {
        required_providers {
          local = { source = "hashicorp/local" }
        }
      }
      resource "local_file" "merhaba" {
        content  = "Merhaba SiberOkul"
        filename = "${path.module}/merhaba.txt"
      }
      EOF
    - terraform init
    - terraform plan
    - terraform apply -auto-approve
    - terraform plan
    - terraform destroy -auto-approve
  soru: "İlk `plan` ne gösterdi (kaç kaynak eklenecek)? `apply` sonrasındaki ikinci `plan` neden 'No changes' dedi?"
  telefon:
    soru: "Bir `terraform plan` çıktısında `1 to add, 0 to change, 1 to destroy` yazıyor. Bunu uygulamadan önce neden dikkatle okursun?"
    cevap: "Bir kaynak silinecek (destroy) ve yeniden oluşturulacak olabilir; veri tabanı gibi kaynaklarda bu veri kaybı demektir. `plan` neyin değişeceğini önceden gösterdiği için, özellikle `destroy` satırlarını `apply`'dan önce insan gözüyle incelemek temel güvenlik adımıdır."
sorular:
  - id: container-009-s1
    soru: "Bildirimsel (declarative) altyapı ile elle komut çalıştırma arasındaki fark nedir?"
    cevap: "Bildirimsel yaklaşımda 'son durum şu olsun' yazılır, araç oraya nasıl gidileceğini hesaplar. Elle komutlarda adımları sen sırayla yaparsın; tekrar ve denetim zordur."
    ipucu: "`destroy` sayısı sıfırdan büyükse neyin silineceğini düşün."
  - id: container-009-s2
    soru: "`terraform plan` ve `terraform apply` arasındaki fark nedir ve neden `plan` ayrı bir adımdır?"
    cevap: "`plan` neyin eklenip değişeceğini ve silineceğini hiçbir şeyi değiştirmeden gösterir. `apply` değişiklikleri gerçekten yapar. Ayrı olması, değişikliği uygulamadan önce incelemeyi (ve CI'da otomatik denetlemeyi) mümkün kılar."
    ipucu: "Plan neden ayrı bir adım?"
  - id: container-009-s3
    soru: "IaC'ın güvenlik açısından üç faydasını say."
    cevap: "Değişiklikler Git'te incelenir ve izlenir; aynı ortam tekrar tekrar aynı şekilde kurulur; kodu kuruluma geçmeden önce otomatik tarayıp yanlış yapılandırmaları yakalayabilirsin."
    ipucu: "Kodla yönetilen altyapının denetlenebilirliğini düşün."
  - id: container-009-s4
    soru: "'Drift' (sapma) nedir ve neden risktir?"
    cevap: "Gerçek altyapının koddaki tanımdan elle yapılan değişikliklerle ayrışmasıdır. Kod 'kapalı' derken konsolda elle açılmış bir güvenlik kuralı denetimi atlatır; bu yüzden sapma düzenli tespit edilir."
    ipucu: "Kodda yazan ile gerçekte çalışan ayrışırsa ne olur?"
  - id: container-009-s5
    soru: "Bir PR'da `terraform plan` çıktısı bir veritabanı için `must be replaced` diyor. Ne yaparsın?"
    cevap: "Uygulamayı durdurur ve nedeni (hangi alanın değişmesi yeniden oluşturmayı zorluyor) incelersin. Veri kaybı olacaksa yedek alır, `prevent_destroy` ya da alanı değiştirmeden bir yol ararsın. Ancak bilinçli onaydan sonra `apply` edersin."
    ipucu: "Plan, kaybı uygulamadan önce gösterir."
hizliKontrol:
  - soru: "`terraform plan` ne yapar?"
    secenekler: ["Altyapıyı hemen değiştirir","State dosyasını siler","Yalnız sözdizimini biçimlendirir","Neyin değişeceğini uygulamadan gösterir"]
    dogru: 3
    aciklama: "Plan, mevcut durum ile istenen durumu karşılaştırıp değişiklikleri önceden gösterir."
    ipucu: "Adın anlamı: planlamak."
  - soru: "'Drift' nedir?"
    secenekler: ["Kod ile gerçek altyapı arasındaki sapma (örn. elle yapılan değişiklik)","Terraform sürümünün eskimesi","Plan'ın yavaş çalışması","State dosyasının şifrelenmesi"]
    dogru: 0
    aciklama: "Elle yapılan değişiklikler kodla gerçek durumu ayrıştırır; denetim ve tekrarlanabilirlik bozulur."
    ipucu: "Koddan 'kayma' düşün."
sikHatalar:
  - hata: "Plan çıktısını okumadan `apply -auto-approve` çalıştırmak."
    dogrusu: "Plan'ı oku, silinen/yenilenen kaynaklara özellikle bak ve onayı bilinçli ver."
  - hata: "Acelen var diye konsoldan elle değişiklik yapmak."
    dogrusu: "Değişikliği koda yaz; elle yapılan sapma (drift) denetimi bozar."
sema:
  baslik: "Terraform iş akışı"
  adimlar:
    - etiket: "init"
      aciklama: "Sağlayıcıları ve backend'i hazırlar."
    - etiket: "write"
      aciklama: "Altyapıyı .tf dosyalarına yaz."
    - etiket: "plan"
      aciklama: "Mevcut durum ile istenen durumu karşılaştırıp değişiklikleri göster."
    - etiket: "review"
      aciklama: "Planı insan gözüyle incele, riskli silmeleri yakala."
    - etiket: "apply"
      aciklama: "Onaylanan değişiklikleri uygula ve state'i güncelle."
terimler:
  - "IaC"
  - "Terraform"
  - "Drift"
derinDalis:
  - tur: okuma
    baslik: "Terraform: giriş"
    ayrinti: "Terraform'un ne olduğu ve temel iş akışı (yaz, planla, uygula)."
    url: "https://developer.hashicorp.com/terraform/intro"
  - tur: okuma
    baslik: "Terraform: plan komutu"
    ayrinti: "Planın neyi gösterdiği ve planı kaydedip sonra uygulamak."
    url: "https://developer.hashicorp.com/terraform/cli/commands/plan"
---

**Altyapı kod olarak** (Infrastructure as Code, IaC), sunucuları, ağları ve veri tabanlarını bir metin dosyasıyla tanımlamaktır. Elle yapılan tıklamaların yerini, Git'te saklanan, incelenen, test edilen dosyalar alır.

### Neden önemli

- **Tekrarlanabilirlik**: Aynı dosyadan test ve üretim ortamı birebir kurulur.
- **İzlenebilirlik**: Kim neyi ne zaman değiştirdi? Git geçmişi söyler.
- **İnceleme**: Değişiklik, uygulanmadan önce çekme isteğiyle (pull request) gözden geçirilir.
- **Güvenlik denetimi**: Yanlış yapılandırmalar (herkese açık depolama gibi) kod aşamasında yakalanabilir (container-011).

### Terraform

**Terraform** (HashiCorp), en yaygın IaC araçlarındandır. **Bildirimsel**dir: "bu kaynak şöyle olsun" yazarsın; Terraform mevcut durumla farkı bulur ve gereken adımları hesaplar. Dil HCL'dir:

```hcl
resource "local_file" "merhaba" {
  content  = "Merhaba SiberOkul"
  filename = "${path.module}/merhaba.txt"
}
```

Anahtar kavramlar:

| Kavram | Anlam |
|---|---|
| Provider (sağlayıcı) | Terraform'un bir sistemle (bulut, Kubernetes, yerel dosya) konuşmasını sağlayan eklenti |
| Resource (kaynak) | Yönetilen şey: sunucu, bucket, dosya |
| Variable (değişken) | Dışarıdan verilen girdi |
| Output (çıktı) | Çalışma sonrası dışarı verilen değer |
| State (durum) | Terraform'un neyi yönettiğini hatırladığı kayıt (sonraki ders) |

### İş akışı

1. `terraform init`: Sağlayıcıları indirir, çalışma dizinini hazırlar.
2. `terraform plan`: Mevcut durumla kodu karşılaştırıp yapılacakları listeler. Hiçbir şeyi değiştirmez.
3. `terraform apply`: Planı uygular (onay ister).
4. `terraform destroy`: Yönettiği her şeyi siler.

Bugünkü görevde sağlayıcı olarak `local` kullanıyoruz: yalnız bilgisayarında bir metin dosyası oluşturur. Mantık bulut kaynaklarında da aynıdır; yalnız sağlayıcı değişir. Bu ders bilerek bulut hesabı istemiyor.

### Idempotent: aynı komut, aynı sonuç

`apply`'ı iki kez çalıştırmak ikinci kez bir şey yapmaz, çünkü durum zaten istenen gibidir. İkinci `plan` "No changes" der. Bu özellik, otomasyonu güvenli kılar.

### Plan'ı okumak bir güvenlik becerisidir

Plan çıktısında `+` (ekle), `~` (değiştir), `-` (sil) ve `-/+` (sil, yeniden oluştur) işaretlerini oku. Silme ve yeniden oluşturma satırları veri kaybı ve kesinti demek olabilir. CI'da planı çekme isteğine yorum olarak ekleyip insanın onayından sonra `apply` etmek yaygın bir yoldur.

### Tuzaklar

- Elle yapılan değişiklikler koddan sapar (**drift**).
- Kod içine sır yazmak (parola, anahtar); bu hem Git'e hem state'e sızar (container-010).
- `apply -auto-approve` komutunu insan onayı olmadan üretimde kullanmak.

Güvenlik notu: `terraform destroy` ve `apply` gerçek kaynakları siler ya da değiştirir. Hangi çalışma dizininde ve hangi hesapla çalıştığından emin olmadan çalıştırma; özellikle bulut sağlayıcı kimlik bilgileri ortamda tanımlıysa.
