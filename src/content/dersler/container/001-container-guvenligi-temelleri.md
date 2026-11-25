---
kimlik: container-001
baslik: "Container güvenliği temelleri"
donem: 7
sira: 1
sure: 35
neden: "Uygulamaların çoğu bugün container içinde çalışır; imajı yazan kişi, saldırı yüzeyini de yazmış olur. DevSecOps mühendisi olarak Dockerfile incelemelerinde 'root mu çalışıyor, imaj şişkin mi, dosya sistemi yazılabilir mi' sorularını ilk günden sorarsın."
analoji:
  baslik: "Container, kiralık depo odası"
  metin: "Container bir apartmandaki kilitli depo odası gibidir: eşyaların kendi odanda, komşunun odasına giremezsin. Ama odaya anahtarla 'yönetici' olarak girersen ve duvar ince ise (ayrıcalıklar çok geniş ise) komşuya geçmek kolaylaşır. Benzetmenin sınırı: depo odasının duvarı gerçek bir duvardır, container'ın duvarı ise çekirdeğin (kernel) kurallarıdır ve çekirdek hepsinde ortaktır."
gorev:
  aciklama: "Docker Desktop kurulu ve çalışıyor olmalı (WSL2 entegrasyonu açık). Komutlar küçük `alpine` imajını indirir (birkaç MB) ve hemen siler (`--rm`). Sırayla çalıştır ve her çıktıyı yorumla:"
  komutlar:
    - docker run --rm alpine id
    - docker run --rm --user 1000:1000 alpine id
    - "docker run --rm --read-only alpine sh -c 'touch /deneme'"
    - "docker run --rm --read-only --tmpfs /tmp alpine sh -c 'touch /tmp/deneme && echo yazildi'"
    - docker run --rm --cap-drop ALL --security-opt no-new-privileges alpine id
  soru: "İlk komutta kullanıcı `uid=0(root)` çıktı. Üçüncü komut neden hata verdi, dördüncü neden çalıştı?"
  telefon:
    soru: "Bir Dockerfile'da hiç `USER` satırı yok. Bu imajdan başlatılan container hangi kullanıcıyla çalışır ve neden sorun olabilir?"
    cevap: "Root (uid 0) ile çalışır, çünkü varsayılan kullanıcı root'tur. Uygulamada bir açık bulunursa saldırgan container içinde root yetkisi kazanır; yapılandırma hatası ya da çekirdek açığıyla bu, konağa (host) sıçrama riskini büyütür."
sorular:
  - id: container-001-s1
    soru: "Dockerfile'a `USER` satırı eklemek neden iyi bir savunmadır?"
    cevap: "Uygulama root olmayan bir kullanıcıyla çalışır. Uygulamadaki bir açık sömürülse bile saldırganın yetkisi sınırlı kalır; dosya sistemini değiştirmek, paket kurmak ya da konak kaynaklarına yaklaşmak zorlaşır."
  - id: container-001-s2
    soru: "`--read-only` bayrağı ne sağlar ve uygulama yine de geçici dosya yazması gerekiyorsa ne yapılır?"
    cevap: "Container'ın kök dosya sistemini salt okunur yapar; saldırgan zararlı dosya bırakamaz. Geçici yazma gerekiyorsa yalnız gereken yola `--tmpfs /tmp` gibi bellekte yazılabilir bir alan ya da volume bağlanır."
  - id: container-001-s3
    soru: "Minimal imaj (ör. `alpine`, `distroless`) neden güvenlik açısından avantajlıdır?"
    cevap: "İçinde daha az paket ve araç vardır: sömürülecek kütüphane, kabuk ya da indirme aracı azdır. Taranınca çıkan zafiyet sayısı da düşer; ayrıca imaj küçüldüğü için indirmesi hızlıdır."
  - id: container-001-s4
    soru: "`--cap-drop ALL` ve `no-new-privileges` ne işe yarar?"
    cevap: "`--cap-drop ALL` container'ın Linux yetkilerini (capabilities) sıfırlar; yalnız gerekenler tek tek geri eklenir. `no-new-privileges` süreçlerin `setuid` gibi yollarla sonradan yetki kazanmasını engeller."
derinDalis:
  - tur: okuma
    baslik: "Docker: Dockerfile en iyi uygulamalar"
    ayrinti: "`USER`, minimal temel imaj ve çok aşamalı build bölümlerine bak."
    url: "https://docs.docker.com/build/building/best-practices/"
  - tur: okuma
    baslik: "Docker Engine güvenlik sayfası"
    ayrinti: "Container'ların çekirdek özellikleriyle nasıl izole edildiğinin genel resmi."
    url: "https://docs.docker.com/engine/security/"
---

**Container** (kap), bir uygulamayı bağımlılıklarıyla birlikte paketleyip izole bir süreç olarak çalıştıran yapıdır. İzole demek güvenli demek değildir: container, konak makinenin çekirdeğini (kernel) paylaşır. Bu yüzden onu sıkılaştırmak (hardening) senin işindir. Bugün dört temel ayar var.

### 1. Root olmayan kullanıcı

Docker'da bir imaj `USER` belirtmediyse süreç **root** (uid 0) olarak başlar. Container içindeki root, konaktaki root ile aynı kişi değildir ama bir yapılandırma hatasında (ör. konak dizini bağlamak, `--privileged`) aradaki duvar incelir. Çözüm basit: uygulamayı sıradan bir kullanıcıyla çalıştır.

```dockerfile
FROM python:3.12-slim
RUN useradd --create-home --uid 10001 uygulama
WORKDIR /app
COPY --chown=uygulama:uygulama . .
USER 10001
CMD ["python", "app.py"]
```

Sayısal uid kullanmak, Kubernetes'in sonradan "bu kullanıcı root mu?" denetimini yapabilmesini kolaylaştırır.

### 2. Minimal imaj

İmajda ne varsa saldırganın da elinde olur. `ubuntu` tabanlı imajda `curl`, `bash`, paket yöneticisi hazırdır. `alpine` ya da `distroless` imajlarında bunların çoğu yoktur. Çok aşamalı build (multi-stage build) ile derleyiciyi ilk aşamada bırakıp yalnız sonucu son imaja kopyalarsın.

### 3. Salt okunur dosya sistemi

`--read-only` ile kök dosya sistemi yazılamaz olur. Saldırgan bir betik ya da arka kapı bırakamaz. Uygulama gerçekten geçici dosya yazıyorsa yalnız o yolu (`/tmp`) yazılabilir yaparsın. Bugünkü görevde bunun iki yüzünü göreceksin: yazma reddedilir, `tmpfs` ile izin verilir.

### 4. Gereksiz yetkileri kaldırmak

Linux, root'un güçlerini küçük parçalara böler: **capability** (yetki). Docker varsayılan olarak bir kısmını verir. En iyi yöntem `--cap-drop ALL` ile hepsini kaldırıp gerekeni eklemektir. `--security-opt no-new-privileges` de süreçlerin sonradan yetki yükseltmesini engeller.

| Ayar | Neyi kapatır |
|---|---|
| `USER` (root olmayan) | Container içinde tam yetki |
| Minimal imaj | Saldırganın hazır araçları |
| `--read-only` | Zararlı dosya bırakma |
| `--cap-drop ALL` | Gereksiz çekirdek yetkileri |

Bunların hiçbiri tek başına yeterli değildir; katman katman savunma (defense in depth) mantığıyla birlikte kullanılırlar. Kubernetes'te aynı ayarları `securityContext` ile yazacaksın (container-008).

Güvenlik notu: `--privileged` bayrağı bütün bu savunmaları kapatır; container'a neredeyse konak kadar yetki verir. Bir Dockerfile ya da Compose dosyasında gördüğünde sebebini sor, makul bir sebep yoksa kaldır.
