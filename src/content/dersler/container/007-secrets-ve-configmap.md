---
kimlik: container-007
baslik: "Secrets ve ConfigMap"
donem: 7
sira: 7
sure: 35
neden: "Uygulamaların parola, anahtar ve ayar bilgisine ihtiyacı vardır. Kubernetes'te bunlar ConfigMap ve Secret ile taşınır; ama Secret'ın adı yanıltıcıdır. Bir DevSecOps mühendisi 'base64 şifreleme değildir' bilgisini ve gerçek çözümleri bilmelidir."
analoji:
  baslik: "Zarf ve şeffaf poşet"
  metin: "ConfigMap, üzerine yazı yazılmış şeffaf bir poşettir: içindekini herkes görür, sorun değil. Secret ise zarftır; ama Kubernetes'te varsayılan zarf yapışkansızdır: kapağı kapalı görünür, fakat açmak için hiçbir şey gerekmez. Gerçek koruma, zarfı kasaya koymaktır (şifreleme, harici sır yöneticisi). Sınırı: base64 sadece 'başka alfabeye çevirme'dir, anahtar gerektirmez."
gorev:
  aciklama: "Yerel `kind` kümesi ve `kubectl` gerekir (container-003). Komutlar sahte bir parola ile Secret oluşturur, okur ve siler; gerçek parola kullanma. Ücretsizdir."
  komutlar:
    - kubectl create secret generic veritabani --from-literal=parola=Gizli123
    - kubectl get secret veritabani -o yaml
    - kubectl get secret veritabani -o jsonpath='{.data.parola}'
    - echo 'R2l6bGkxMjM=' | base64 -d
    - kubectl create configmap ayar --from-literal=ortam=test
    - kubectl delete secret veritabani && kubectl delete configmap ayar
  soru: "`get secret -o yaml` çıktısında parola nasıl görünüyor? `base64 -d` ile elde ettiğin sonuç sana bu 'koruma' hakkında ne söylüyor?"
  telefon:
    soru: "Bir Git deposunda `password: R2l6bGkxMjM=` yazan bir Secret YAML'ı buldun. Bu güvenli mi? Ne yaparsın?"
    cevap: "Güvenli değil: base64 şifreleme değil, kodlamadır; `base64 -d` ile parola anında okunur. Parolayı sızmış say, değiştir (rotasyon), Git geçmişinden temizlemeyi düşün ve sırları depoya hiç koymayan bir yönteme (harici sır yöneticisi, şifreli sır) geç."
sorular:
  - id: container-007-s1
    soru: "ConfigMap ile Secret arasındaki fark nedir?"
    cevap: "ConfigMap gizli olmayan ayarlar içindir; Secret parola, token, anahtar gibi hassas veri içindir. Secret'ın ek avantajı: erişim ayrıca yetkilendirilebilir ve şifreleme ile korunabilir; ama varsayılan olarak içeriği şifreli değildir."
    ipucu: "Biri hassas olmayan ayar, diğeri hassas veri içindir."
  - id: container-007-s2
    soru: "Secret'taki base64 neden güvenlik sağlamaz?"
    cevap: "Base64 bir kodlama biçimidir, anahtarı yoktur; herkes tek komutla geri çevirir. Yalnız ikili veriyi metne uygun hale getirmek için vardır."
    ipucu: "Base64'ü geri çevirmek için anahtar gerekir mi?"
  - id: container-007-s3
    soru: "Secret'ları daha güvenli tutmak için hangi üç önlem alınabilir?"
    cevap: "(1) etcd'de şifreleme (encryption at rest) etkinleştirmek, (2) RBAC ile Secret okuma yetkisini daraltmak, (3) harici bir sır yöneticisi (Vault, bulut sağlayıcı yöneticileri) ya da şifreli Git yaklaşımı kullanmak."
    ipucu: "Sırrı hem depoda hem etcd'de korumayı düşün."
  - id: container-007-s4
    soru: "Sırrı ortam değişkeni yerine dosya olarak (volume) bağlamanın avantajı nedir?"
    cevap: "Ortam değişkenleri hata günlüklerine, çökme raporlarına ve alt süreçlere kolayca sızar. Dosya olarak bağlanan sır daha dar bir yüzeyde tutulur ve güncellendiğinde yeniden başlatma olmadan yenilenebilir."
    ipucu: "Süreç ortamı ile dosya arasında sızma yolları neler?"
  - id: container-007-s5
    soru: "Bir pull request'te Secret YAML'ı içinde base64 yazılı gerçek bir veritabanı parolası var. Ne yaparsın?"
    cevap: "PR'ı birleştirmeden durdurursun; parolayı sızmış sayıp hemen değiştirirsin ve Git geçmişinden temizlenmesini sağlarsın. Sonra sırrı harici bir sır yöneticisine ya da şifreli sır yöntemine taşırsın ve depoya gizli tarama (secret scanning) eklersin."
    ipucu: "Depoya giren sır için tek güvenli varsayım nedir?"
hizliKontrol:
  - soru: "Secret içindeki base64 değer için hangisi doğrudur?"
    secenekler: ["Güçlü bir şifreleme yöntemidir","Yalnız kubelet açabilir","Anahtarsız geri çevrilen bir kodlamadır","RBAC ile otomatik şifrelenir"]
    dogru: 2
    aciklama: "Base64 kodlamadır, şifreleme değil; `base64 -d` ile açılır."
    ipucu: "Kodlama ile şifreleme arasındaki farkı düşün."
sikHatalar:
  - hata: "Secret'ı base64 olduğu için güvenli saymak."
    dogrusu: "Base64 şifreleme değildir. etcd şifrelemesi, sıkı RBAC ve harici sır yöneticisi kullan."
  - hata: "Parolayı ConfigMap'e koymak."
    dogrusu: "Hassas veriyi Secret'ta (ve mümkünse harici yöneticide) tut; ConfigMap yalnız hassas olmayan ayarlar içindir."
terimler:
  - "Secret"
  - "ConfigMap"
  - "etcd"
derinDalis:
  - tur: okuma
    baslik: "Kubernetes: Secrets"
    ayrinti: "Secret türleri, kullanım yolları ve varsayılan şifresiz saklama uyarısı."
    url: "https://kubernetes.io/docs/concepts/configuration/secret/"
  - tur: okuma
    baslik: "Kubernetes: Secret'lar için iyi uygulamalar"
    ayrinti: "Yöneticiler ve geliştiriciler için öneriler."
    url: "https://kubernetes.io/docs/concepts/security/secrets-good-practices/"
  - tur: okuma
    baslik: "Kubernetes: Secret verisini etcd'de şifrelemek"
    ayrinti: "Encryption at rest yapılandırması."
    url: "https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/"
---

Bir uygulama çalışırken ayarlara (veri tabanı adresi, özellik bayrakları) ve sırlara (parola, API anahtarı) ihtiyaç duyar. İkisini imaja gömmek yanlıştır: ayar değişince imaj yeniden üretilir, sır ise imajı çeken herkese açılır. Kubernetes bunun için iki nesne sunar.

### ConfigMap

**ConfigMap**, gizli olmayan ayarları anahtar-değer olarak tutar. Pod'a ortam değişkeni ya da dosya olarak verilir. Örnek: `ortam=uretim`, `log_seviyesi=info`. İçinde parola olmaz.

### Secret

**Secret**, hassas veriler için tasarlanmış nesnedir. Kullanımı ConfigMap'e benzer; ama Kubernetes onu farklı ele alır: günlüklerde yazdırmaz, yalnız gereken düğüme gönderir, ayrıca yetkilendirilebilir. Sorun şurada: değerler **base64** ile kodlanır ve etcd'de **varsayılan olarak şifrelenmeden** saklanır.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: veritabani
type: Opaque
data:
  parola: R2l6bGkxMjM=
```

`R2l6bGkxMjM=` değeri `Gizli123` metninin base64 halidir. `echo 'R2l6bGkxMjM=' | base64 -d` ile açılır. Anahtar yok, sır yok: kodlama bir **gizleme**, şifreleme değildir. Resmî dokümanlar da bu konuda uyarır: Secret'lar varsayılan olarak şifresiz saklanır, ek önlem gerekir.

### Sırrı gerçekten korumak

1. **Etcd'de şifreleme** (encryption at rest): API sunucusu Secret'ları etcd'ye yazmadan önce şifreler. Yapılandırma gerekir.
2. **RBAC**: `secrets` kaynağında `get`/`list` yetkisi çok az hesaba verilmeli. `list` yetkisi isim alanındaki bütün sırların değerlerini döker.
3. **Harici sır yöneticisi**: HashiCorp Vault, bulut sağlayıcıların sır servisleri (bulut-006'da göreceğiz) ya da External Secrets gibi araçlar sırrı Kubernetes dışında tutar ve pod'a anlık ulaştırır.
4. **Git'te şifreli sır**: Sealed Secrets, SOPS gibi araçlar sırları şifreli hâliyle depoya koymayı sağlar.
5. **Kullanım biçimi**: Mümkünse sırrı ortam değişkeni yerine dosya olarak bağla; ortam değişkenleri günlüklere ve çökme raporlarına kolay sızar.

### Sık yapılan hatalar

- Secret YAML'ını Git'e koymak (base64 görünce "şifreli" sanmak).
- `kubectl get secret -o yaml` çıktısını sohbete ya da bilet sistemine yapıştırmak.
- Sırrı hiç döndürmemek (rotasyon). Bir sır bir kez sızarsa yenilenene kadar geçerlidir.
- Aynı sırrı bütün ortamlarda (test, üretim) kullanmak.

### Ders çıkarma: iki ayrı sorun

"Sırrı korumak" iki parçadır: **depolama** (etcd'de şifreli mi?) ve **erişim** (kim okuyabilir?). Birini çözüp öbürünü unutmak yaygın hatadır. Etcd şifreli olsa bile `secrets` okuma yetkisi geniş bir hizmet hesabı sırrı olduğu gibi okur.

Güvenlik notu: Bir sır başka birinin gözüne düştüyse (sohbet, depo, ekran görüntüsü), sır artık sır değildir. Önce değiştir, sonra temizle; sırayı ters yapma.
