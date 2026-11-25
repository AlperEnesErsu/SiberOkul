---
kimlik: devops-010
baslik: "İmajlar ve kayıt defterleri"
donem: 4
sira: 10
sure: 30
neden: "İmajlar bir kayıt defterinden (registry) çekilir ve çoğu zaman sürümü bir etiketle belirtilir. Etiketin ne kadar güvenilir olduğunu, imajı digest ile sabitlemeyi ve boyutun neden güvenlik konusu olduğunu bilmek, tedarik zinciri güvenliğinin ilk adımıdır."
analoji:
  baslik: "Kütüphane ve ISBN"
  metin: "Registry bir kütüphanedir. Etiket (`1.2`) raftaki 'Yeni baskı' yazısı gibidir: yarın aynı yazının altına başka bir kitap konabilir. Digest ise ISBN gibi o kitabın içeriğine özgü kimliktir; içerik değişirse numara da değişir. Sınır: ISBN kitabın iyi olduğunu söylemez, yalnız aynı kitap olduğunu söyler."
gorev:
  aciklama: "Docker kurulu olmalı. Küçük, resmi imajları çekip etiket, digest ve boyutlarını karşılaştır:"
  komutlar:
    - docker pull alpine:3.20
    - docker pull alpine:latest
    - docker images --digests alpine
    - docker image inspect alpine:3.20 --format '{{.Size}}'
    - docker tag alpine:3.20 benim-alpine:deneme
    - docker images
    - docker rmi benim-alpine:deneme
  soru: "`alpine:3.20` ve `alpine:latest` aynı digest'e sahip mi? Neden `latest` üretimde tehlikeli bir etikettir?"
  telefon:
    soru: "Bir Dockerfile `FROM python:3.12` ile başlıyor. Bugün build ettiğin imajla altı ay sonra build ettiğin aynı olur mu?"
    cevap: "Olmayabilir. Etiket taşınabilir; yayıncı aynı etiketin altına güncellenmiş bir imaj koyabilir. Birebir aynı imaj için digest ile sabitlemek gerekir."
sorular:
  - id: devops-010-s1
    soru: "Etiket (tag) ile digest arasındaki fark nedir?"
    cevap: "Etiket insanın okuyacağı, sonradan başka imaja taşınabilen bir isimdir. Digest imaj içeriğinin özetidir ve içerik değişirse değişir; bu yüzden değişmez bir kimlik gibi kullanılır."
  - id: devops-010-s2
    soru: "Registry nedir? Örnekler ver."
    cevap: "İmajların saklandığı ve dağıtıldığı sunucudur. Docker Hub, GitHub Container Registry ve bulut sağlayıcılarının kendi kayıt defterleri örnektir."
  - id: devops-010-s3
    soru: "İmaj boyutu neden güvenliği de ilgilendirir?"
    cevap: "İmajdaki her paket olası bir açıktır. Küçük imaj daha az bileşen, daha az açık ve daha hızlı indirme demektir."
  - id: devops-010-s4
    soru: "Bilinmeyen bir kullanıcının Docker Hub imajını doğrudan çalıştırmak neden risklidir?"
    cevap: "İmajın içinde ne olduğunu bilmezsin; zararlı yazılım ya da arka kapı bulunabilir. Resmi ya da doğrulanmış yayıncıları tercih et ve imajı tara."
derinDalis:
  - tur: okuma
    baslik: "Docker: Temel imajı sabitleme"
    ayrinti: "Build en iyi uygulamalarındaki 'Pin base image versions' bölümü etiket ve digest tartışmasını anlatır."
    url: "https://docs.docker.com/build/building/best-practices/"
---

Bir **imaj** (image) birçok katmandan oluşan, değişmez bir pakettir. İmajlar **kayıt defteri**nde (registry) saklanır; `docker pull` ile indirilir, `docker push` ile yüklenir.

### İmaj adı nasıl okunur?

```text
ghcr.io/kullanici/uygulama:1.4
```

- `ghcr.io`: kayıt defteri (yazılmazsa Docker Hub varsayılır)
- `kullanici/uygulama`: depo adı
- `1.4`: etiket (tag)

### Etiket taşınabilir

Etiket bir **işaretçidir**: yayıncı aynı etiketi başka bir imaja kaydırabilir. `latest` özellikle yanıltıcıdır; "en son" değil, yalnız "etiket belirtilmediğinde varsayılan" anlamına gelir. Bugün çektiğin `python:3.12` ile altı ay sonra çekeceğin farklı olabilir, güvenlik yamaları buna dahil.

### Digest

Her imajın içeriğinden hesaplanan bir **digest**'i vardır (`sha256:...`). İçerik bir bit bile değişirse digest değişir. İmajı şöyle sabitleyebilirsin:

```dockerfile
FROM alpine:3.20@sha256:<digest>
```

Bu tekrarlanabilir build verir. Bedeli: yamaları artık otomatik almazsın, digest'i sen güncellemelisin (Dependabot gibi araçlar bunu otomatikleştirir).

### Boyut

Küçük imajın (alpine, distroless gibi) içinde daha az paket vardır: daha az saldırı yüzeyi, daha hızlı indirme. Çok aşamalı build (multi-stage) ile derleme araçlarını son imajdan dışarıda bırakabilirsin.

### Güvenilir kaynak

- Docker Hub'daki **resmi** (Docker Official) ve **doğrulanmış yayıncı** imajlarını tercih et.
- İmajı kullanmadan önce açık taraması (vulnerability scanning) yap.
- Kurumsal ortamda kendi özel registry'ni kullanıp yalnız onaylı imajlara izin ver.

Güvenlik notu: İmaj bir yazılım paketidir ve aynı tedarik zinciri riskleri geçerlidir: ele geçirilmiş hesap, taşınan etiket, benzer isimli sahte imaj. Adı tam kontrol et (typosquatting).
