---
kimlik: devops-012
baslik: "Ortam değişkenleri ve sır yönetimi"
donem: 4
sira: 12
sure: 35
neden: "Uygulamalar veritabanı parolası, API anahtarı gibi sırlara ihtiyaç duyar. Bunları koda, imaja ya da depoya gömmeden güvenle iletmek DevSecOps'un temel işidir. Bu ders bölgeyi bağlar: Git, CI ve Docker'ın hepsinde sırlar farklı biçimde tehlikeye girer."
analoji:
  baslik: "Otel kasası ve oda anahtarı"
  metin: "Değerli eşyayı odanın kapısına yapıştırmazsın; kasaya koyarsın ve kasanın şifresini yalnız ihtiyacı olana verirsin. Sır yöneticisi (CI sırları, bulut sır servisleri) bu kasadır. Kodun içine gömülen sır kapıya yapıştırılmış notla aynıdır. Sınır: kasanın kendisi de çalınabilir; bu yüzden sırlara yetkiyi dar tutar ve düzenli döndürürüz."
gorev:
  aciklama: "Docker kurulu olmalı (devops-008). `/tmp` altında bir sırrı ortam değişkeniyle iletip imajın kayıtlarında görünüp görünmediğine bak. Sır uydurma bir değerdir:"
  komutlar:
    - mkdir -p /tmp/sir-docker && cd /tmp/sir-docker
    - echo "SIR=sahte-deger-123" > .env
    - echo ".env" > .gitignore
    - docker run --rm --env-file .env alpine sh -c 'echo $SIR'
    - |-
      printf 'FROM alpine:3.20\nARG SIR\nRUN echo "kurulum" > /k.txt\n' > Dockerfile
    - docker build --build-arg SIR=sahte-deger-123 -t sir-deneme .
    - docker history --no-trunc sir-deneme
  soru: "`docker history` çıktısında `ARG` ile verdiğin değer bir yerde göründü mü? Bu, build sırasında sır geçirmenin neden önerilmediğini nasıl gösteriyor?"
  telefon:
    soru: "Bir Dockerfile'da `ENV API_KEY=abc123` satırı var. İmajı herkese açık registry'ye yükleyen kişi ne yapmış olur?"
    cevap: "Anahtarı imajın içine gömmüş ve imajı çeken herkese vermiş olur. `ENV` değeri imaj metadata'sında kalır ve `docker inspect` ile okunur. Anahtar iptal edilmeli."
sorular:
  - id: devops-012-s1
    soru: "Ortam değişkenleri (environment variables) neden yapılandırma için kullanılır?"
    cevap: "Aynı kod, farklı ortamlarda (geliştirme, test, üretim) farklı ayarlarla çalışsın diye ayarlar koddan ayrılır. Değer ortamdan okunur, kodun içinde yazmaz."
  - id: devops-012-s2
    soru: "CI'da sırlar nerede tutulur ve nasıl kullanılır?"
    cevap: "Platformun sır deposunda (ör. GitHub Actions secrets) şifreli saklanır, workflow'da yalnız çalışma zamanında okunur. Depoya ya da workflow dosyasına düz metin yazılmaz."
  - id: devops-012-s3
    soru: "Sırrı Dockerfile'da `ARG` ya da `ENV` ile vermek neden kötü fikirdir?"
    cevap: "Değer imajın katmanlarında ve metadata'sında kalır; imaja erişen herkes okuyabilir. Docker belgeleri build sırları için `secret` ya da SSH mount kullanmayı önerir."
  - id: devops-012-s4
    soru: "Sır sızarsa ilk yapılacak şey nedir?"
    cevap: "Sırrı iptal edip yenisini üretmek (rotation). Sonra nerede kullanıldığını ve kötüye kullanılıp kullanılmadığını incelemek."
derinDalis:
  - tur: okuma
    baslik: "Docker: Build sırları"
    ayrinti: "Build sırasında sırların imaja sızmadan nasıl iletileceğini anlatır."
    url: "https://docs.docker.com/build/building/secrets/"
  - tur: okuma
    baslik: "GitHub Actions'ta sırları kullanmak"
    ayrinti: "Fork PR'larında sırların iletilmemesi ve günlüklerde maskeleme."
    url: "https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions"
---

Sır (secret), bilinirse sistemin güvenliğini bozan değerdir: parola, API anahtarı, özel anahtar, token. Bu bölgede sırların üç ayrı yerde sızabildiğini gördün: **Git tarihçesinde** (devops-005), **CI günlüklerinde** ve **imajın katmanlarında**.

### Ortam değişkeni

Uygulamaya ayarı koddan ayırıp ortam üzerinden vermenin yoludur:

```text
docker run --env-file .env uygulama
```

Kod değeri `SIR` adlı değişkenden okur. `.env` dosyası depoya **girmez** (`.gitignore`), yerine `.env.example` gibi boş bir örnek commitlenir.

Ortam değişkeni sır için ideal değildir ama basittir: süreç içinde, hata raporlarında ve `docker inspect` çıktısında görünebilir. Daha olgun ortamlarda sır yöneticileri ve dosya olarak bağlanan sırlar tercih edilir.

### CI sırları

GitHub Actions gibi platformlar sırları şifreli saklar ve workflow'a çalışma zamanında verir. Dikkat edilecekler:

- Sırları **günlüğe yazdırma**; platform maskelemeye çalışır ama garanti değildir.
- Fork'tan gelen PR'larda `GITHUB_TOKEN` dışında sırlar iletilmez; bu korumayı gevşetme.
- Yetkiyi dar tut: yalnız gereken işi yapabilen, kısa ömürlü anahtarlar kullan.

### İmajda sır

- `ENV` ve `ARG` ile gelen değerler imajın kaydında kalır.
- Bir katmana kopyalanan sırrı sonraki katmanda silmek onu yok etmez.
- Çözüm: build sırasında gereken sırlar için Docker'ın **secret mount** özelliğini kullan; çalışma zamanındaki sırları ise imaja gömmek yerine container başlarken dışarıdan ver.
- `.dockerignore` ile `.env` gibi dosyaları imaj bağlamından çıkar.

### Bölgenin özeti

| Yer | Sızma biçimi | Önlem |
|---|---|---|
| Git | Commit'e giren dosya | `.gitignore`, tarama, döndürme |
| CI | Günlüğe yazılan değer | Maskeleme, dar yetki |
| İmaj | `ENV`/`ARG`, katman | Secret mount, çalışma zamanında verme |

Güvenlik notu: Her sır sonunda sızabilir kabulüyle tasarla: kısa ömürlü, dar yetkili ve kolayca döndürülebilir olsun. Sızdığında "iptal et ve yenile" dakikalar içinde yapılabiliyorsa olay küçük kalır.
