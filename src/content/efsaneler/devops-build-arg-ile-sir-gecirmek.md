---
iddia: "Docker build sırasında sırrı ARG ya da ENV ile vermek güvenlidir, çünkü son imajda görünmez."
hukum: yanlis
ozet: "Docker belgeleri, build argümanları ve ortam değişkenleriyle geçirilen sırların son imajda kalıcı olabileceği konusunda uyarır ve bunun yerine secret ya da SSH mount kullanmayı önerir."
analoji: "Not defterine yazdığın şifreyi sonraki sayfada karalamak gibi: sayfa hâlâ defterde, kalem izi okunur."
kaynaklar:
  - { ad: "Docker Docs: Build secrets", url: "https://docs.docker.com/build/building/secrets/" }
ilgiliDers: devops-012
tarih: "2026-11-25"
---

Dockerfile'daki `ARG` ve `ENV` değerleri imajın kayıtlarına işlenebilir. Docker'ın build sırları sayfası, bu yöntemlerle geçirilen sırların son imajda kalabileceğini söyler ve secret mount ya da SSH mount önerir.

Neden önemli: imajı çeken herkes `docker history` ya da `docker inspect` ile bu kayıtlara bakabilir. Herkese açık bir registry'ye yüklenmiş imajda bu, sırrı doğrudan yayınlamak demektir.

Sırrı bir katmana kopyalayıp sonraki katmanda silmek de işe yaramaz: önceki katman imajın içinde durur.

Doğru yaklaşım:

- Build sırasında gereken sırlar için `RUN --mount=type=secret` kullan; sır katmana yazılmaz.
- Çalışma zamanı sırlarını imaja gömme; container başlarken dışarıdan ver.
- `.dockerignore` ile `.env` gibi dosyaları build bağlamından çıkar.
- Sızdığından şüphelenirsen sırrı iptal et ve döndür.
