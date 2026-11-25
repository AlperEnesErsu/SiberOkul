---
kimlik: devops-011
baslik: "Docker Compose"
donem: 4
sira: 11
sure: 35
neden: "Gerçek uygulamalar tek container'dan oluşmaz: web, veritabanı, önbellek gibi parçalar vardır. Compose bu parçaları tek dosyada tanımlar; hem yerel geliştirmede hem test ortamlarında kullanırsın. Ağ ve volume ayarları güvenlik açısından da önemlidir."
analoji:
  baslik: "Orkestra şefi ve nota"
  metin: "Her müzisyen (container) kendi çalgısını çalar; nota (compose.yaml) kimin ne zaman gireceğini ve kiminle konuşacağını yazar. Tek komutla herkes aynı notaya göre başlar. Sınır: Compose tek bir makinede çalışır; yüzlerce makineye yayılan büyük orkestralar için başka araçlar gerekir."
gorev:
  aciklama: "Docker ve Compose eklentisi kurulu olmalı (`docker compose version`). `/tmp` altında iki servislik bir uygulama kur:"
  komutlar:
    - mkdir -p /tmp/compose-deneme && cd /tmp/compose-deneme
    - docker compose version
    - |-
      cat > compose.yaml <<'EOF'
      services:
        web:
          image: nginx:1.27-alpine
          ports:
            - "127.0.0.1:8080:80"
        arac:
          image: alpine:3.20
          command: sleep 600
      EOF
    - docker compose up -d
    - docker compose ps
    - docker compose exec arac wget -qO- http://web
    - docker compose down
  soru: "`arac` servisi `web`e neden `http://web` adresiyle ulaşabildi? `ports` satırındaki `127.0.0.1:` parçası ne işe yarıyor?"
  telefon:
    soru: "Bir compose dosyasında veritabanı servisine `ports: - \"5432:5432\"` yazılmış. Bu neden gereksiz bir risk olabilir?"
    cevap: "Veritabanı portu host'un bütün ağ arayüzlerine açılır; dışarıdan erişilebilir. Servisler birbirine Compose ağı üzerinden zaten ulaşır; port yayınlamaya gerek yoktur ya da `127.0.0.1:` ile sınırlanmalıdır."
sorular:
  - id: devops-011-s1
    soru: "Docker Compose ne işe yarar?"
    cevap: "Birden çok container'dan oluşan uygulamayı (servisler, ağlar, volume'lar) tek bir YAML dosyasında tanımlayıp tek komutla ayağa kaldırıp kapatmanı sağlar."
  - id: devops-011-s2
    soru: "Compose'taki servisler birbirini nasıl bulur?"
    cevap: "Compose varsayılan bir ağ kurar ve servisleri bu ağa bağlar. Her servis diğerine kendi adıyla (ör. `web`, `db`) ulaşır."
  - id: devops-011-s3
    soru: "Volume neden gerekir?"
    cevap: "Container silinince içindeki veri gider. Volume veriyi container'ın dışında tutar; veritabanı gibi kalıcı olması gereken veriler için kullanılır."
  - id: devops-011-s4
    soru: "`ports` ile bir servisi dışarı açmanın riski nedir ve nasıl azaltılır?"
    cevap: "Port host'un ağına açılır ve ağdaki herkes erişebilir. Yalnızca gerekenleri yayınla, geliştirmede `127.0.0.1:` ile yalnız kendi makinene bağla."
derinDalis:
  - tur: okuma
    baslik: "Docker Compose genel bakış"
    ayrinti: "Compose'un ne olduğu ve hangi ortamlarda kullanıldığı."
    url: "https://docs.docker.com/compose/"
---

**Docker Compose**, birden çok container'ı tek bir dosyada tanımlayıp birlikte yönetmeni sağlar. Docker'ın tanımıyla: servisleri, ağları ve volume'ları bir YAML dosyasında anlatırsın, tek komutla hepsini başlatırsın.

### Küçük bir dosya

```yaml
services:
  web:
    image: nginx:1.27-alpine
    ports:
      - "127.0.0.1:8080:80"
  db:
    image: postgres:16-alpine
    volumes:
      - veri:/var/lib/postgresql/data
volumes:
  veri:
```

- **services:** Her biri bir container (ya da çoğaltılabilir bir grup).
- **ports:** `host:container` biçiminde port yayınlama.
- **volumes:** Kalıcı veri.

### Temel komutlar

| Komut | Anlamı |
|---|---|
| `docker compose up -d` | Servisleri arka planda başlat |
| `docker compose ps` | Durumları göster |
| `docker compose logs web` | Bir servisin günlüğü |
| `docker compose down` | Durdur ve container'ları sil |

### Ağ

Compose, projen için varsayılan bir ağ oluşturur. Servisler birbirine **servis adıyla** ulaşır: `web` içinden veritabanına `db:5432` ile bağlanılır. Bu yüzden veritabanı portunu host'a açmana gerek olmaz.

### Volume

Container silinince içi gider. İsimli **volume** veriyi container dışında saklar; `down` komutu volume'ları varsayılan olarak silmez (`-v` eklenirse siler).

### Güvenlik

- Yalnız dışarıdan erişilmesi gereken portu yayınla; geliştirmede `127.0.0.1:` kullan.
- Sürümü sabit imaj kullan (`latest` değil).
- Parolaları compose dosyasına gömme; devops-012'de nasıl yönetileceğini göreceksin.
- Compose dosyasındaki volume ve bind mount'lar (host klasörünü bağlama) container'a host dosyalarına erişim verir; `/` ya da Docker soketi gibi hassas yolları bağlama.

Güvenlik notu: `/var/run/docker.sock` dosyasını container'a bağlamak, o container'a Docker daemon'u, yani pratikte host üzerinde yüksek yetki vermektir. Bunu yalnız gerçekten gerekliyse ve güvendiğin bir imajla yap.
