---
kimlik: devops-009
baslik: "Dockerfile yazmak"
donem: 4
sira: 9
sure: 35
neden: "İmajı Dockerfile tanımlar. Orada yapılan seçimler (temel imaj, kullanıcı, kopyalanan dosyalar) uygulamanın saldırı yüzeyini belirler. DevSecOps mühendisi Dockerfile'ı kod incelemesinde okuyabilmeli."
analoji:
  baslik: "Kat kat pasta"
  metin: "Dockerfile pasta tarifidir ve her satır bir katman ekler: önce tabanı, sonra kremayı, sonra süsü. Alttaki bir katman değişirse üstündekilerin hepsini yeniden yapmak gerekir; bu yüzden az değişen şeyi alta koyarsın. Sınır: pastada bir katmanı yutup çıkarmak mümkün olmaz; imajda da bir katmana giren sırrı sonraki katmanda silmek onu yok etmez."
gorev:
  aciklama: "Docker kurulu olmalı (devops-008). `/tmp` altında küçük bir imaj yap:"
  komutlar:
    - mkdir -p /tmp/docker-deneme && cd /tmp/docker-deneme
    - echo 'echo "Merhaba imajdan"' > selam.sh
    - printf 'FROM alpine:3.20\nCOPY selam.sh /selam.sh\nCMD ["sh", "/selam.sh"]\n' > Dockerfile
    - cat Dockerfile
    - docker build -t selam-deneme .
    - docker run --rm selam-deneme
    - docker history selam-deneme
  soru: "`docker history` çıktısında kaç katman gördün ve hangisi senin yazdığın satırlara denk geliyor? `selam.sh`i değiştirip yeniden build edersen hangi katmanlar önbellekten gelir?"
  telefon:
    soru: "Bir Dockerfile'da `COPY . .` en üstte, `RUN pip install -r requirements.txt` altında. Bu sıra neden verimsiz?"
    cevap: "Kodda küçük bir değişiklik bile `COPY . .` katmanını geçersiz kılar ve altındaki paket kurulumu her seferinde yeniden çalışır. Önce yalnız `requirements.txt` kopyalayıp kurmak, sonra kodu kopyalamak önbelleği korur."
sorular:
  - id: devops-009-s1
    soru: "`FROM`, `COPY` ve `RUN` satırları ne yapar?"
    cevap: "`FROM` temel imajı seçer. `COPY` host'taki dosyaları imaja kopyalar. `RUN` imaj oluşturulurken bir komut çalıştırır ve sonucu yeni bir katman olarak kaydeder."
  - id: devops-009-s2
    soru: "`RUN` ile `CMD` arasındaki fark nedir?"
    cevap: "`RUN` imajı oluştururken (build sırasında) çalışır. `CMD` container başlayınca çalışacak varsayılan komuttur."
  - id: devops-009-s3
    soru: "`.dockerignore` neden önemlidir?"
    cevap: "Build bağlamına hangi dosyaların girmeyeceğini söyler. `.git`, `.env`, `node_modules` gibi gereksiz ya da hassas dosyaların imaja kopyalanmasını önler ve build'i hızlandırır."
  - id: devops-009-s4
    soru: "Bir katmanda sır olan dosyayı sonraki katmanda silmek neden yetmez?"
    cevap: "Her katman değişmez bir kayıttır. Silme, yeni bir katmanda dosyayı gizler ama önceki katman imajın içinde durur ve çıkartılabilir."
derinDalis:
  - tur: okuma
    baslik: "Docker: Build en iyi uygulamaları"
    ayrinti: "Temel imaj sabitleme, .dockerignore ve katman düzeni önerileri."
    url: "https://docs.docker.com/build/building/best-practices/"
---

**Dockerfile**, bir imajın nasıl yapılacağını adım adım yazan metin dosyasıdır. `docker build` onu okur ve imajı üretir.

### En küçük örnek

```dockerfile
FROM alpine:3.20
COPY selam.sh /selam.sh
CMD ["sh", "/selam.sh"]
```

- `FROM`: Başlangıç imajı. Her Dockerfile bir temel imajla başlar.
- `COPY`: Host'taki dosyayı imaja kopyalar.
- `RUN`: Build sırasında komut çalıştırır (paket kurmak gibi).
- `CMD`: Container başlayınca çalışacak varsayılan komut.

### Katmanlar ve önbellek

Her komut bir **katman** üretir. Docker katmanları önbelleğe alır: bir satır ve üstündekiler değişmediyse onları yeniden yapmaz. Bu yüzden sık değişen şeyi (kodunuzu) en sona, seyrek değişen şeyi (bağımlılıkları) öne koyarsın:

```dockerfile
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
```

Böylece kod değişince paket kurulumu yeniden çalışmaz.

### `.dockerignore`

Build bağlamına (klasörün imaja gönderilen kısmı) girmesini istemediğin dosyaları `.dockerignore`a yazarsın; sözdizimi `.gitignore`a benzer. `.git`, `.env`, `*.pem` gibi şeyleri buraya koymak, `COPY . .` ile yanlışlıkla sır göndermeyi engeller.

### Güvenli Dockerfile alışkanlıkları

- **Küçük temel imaj** seç; az paket, az açık demektir.
- **Sürümü sabitle:** `alpine:3.20` gibi, `latest` yerine. Daha da sıkı sabitleme için digest kullanılır (devops-010).
- **Root olarak çalıştırma:** `USER` ile yetkisiz bir kullanıcıya geç.
- **Sırları imaja koyma:** Sır, katmanda kalıcı olarak durur (devops-012).
- Paket kurulumlarından sonra gereksiz önbelleği temizle ve komutları mantıklı birleştir.

Güvenlik notu: `COPY . .` yazan her Dockerfile, `.dockerignore` kontrol edilmeden tehlikelidir. Bir imaja giren `.env` ya da `.git` klasörü, imajı çeken herkesin eline geçer.
