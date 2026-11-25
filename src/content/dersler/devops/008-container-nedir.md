---
kimlik: devops-008
baslik: "Container nedir"
donem: 4
sira: 8
sure: 35
neden: "Modern uygulamaların çoğu container içinde çalışır. DevSecOps'ta hem imajı hem container'ın çalışma ayarlarını güvence altına alırsın; bunun için container'ın ne olduğunu, sanal makineden farkını ve izolasyonun sınırlarını bilmen gerekir."
analoji:
  baslik: "Apartmandaki daireler ve müstakil evler"
  metin: "Sanal makine müstakil evdir: kendi çatısı, tesisatı, her şeyi var; pahalı ve yavaş yapılır. Container apartman dairesidir: bina (çekirdek, kernel) ortaktır, ama her dairenin kendi kapısı ve duvarı vardır. Ucuz ve hızlıdır. Sınır: ortak bina ortak risk demektir; temeldeki bir çatlak bütün daireleri etkiler."
gorev:
  aciklama: "Docker kurulu olmalı. WSL2'de en kolay yol Windows'a Docker Desktop kurup WSL entegrasyonunu açmaktır (ya da Ubuntu'ya `docker.io` paketi). `docker --version` çalışıyorsa hazırsın. `hello-world` ve `alpine` imajları küçük ve zararsızdır:"
  komutlar:
    - docker --version
    - docker run hello-world
    - docker run --rm alpine echo "container icinden selam"
    - docker run --rm alpine cat /etc/os-release
    - docker ps -a
    - docker images
  soru: "`docker run --rm alpine ...` komutu bittikten sonra container'a ne oldu (`docker ps -a`)? `--rm` ne işe yarıyor? Neden iki satırlık komut bile imaj indirdi?"
  telefon:
    soru: "Bir container'da `uname -r` komutu çalıştırsan, çıktıdaki çekirdek (kernel) sürümü host'unkiyle aynı mı farklı mı olur? Neden?"
    cevap: "Aynı olur. Container'lar host'un çekirdeğini paylaşır; kendi çekirdeklerini çalıştırmazlar. Sanal makine ise kendi çekirdeğini başlatır."
sorular:
  - id: devops-008-s1
    soru: "Container ile sanal makine (VM) arasındaki temel fark nedir?"
    cevap: "VM kendi işletim sistemi ve çekirdeğini başlatır. Container ise host'un çekirdeğini paylaşan, izole çalıştırılan sıradan bir süreçtir; bu yüzden küçük ve hızlıdır."
    ipucu: "Çekirdeği (kernel) kimin çalıştırdığını düşün."
  - id: devops-008-s2
    soru: "İmaj (image) ile container arasındaki ilişki nedir?"
    cevap: "İmaj, uygulamayı ve ihtiyaçlarını içeren salt okunur bir şablondur. Container, o imajdan başlatılmış çalışan örneğidir. Bir imajdan çok sayıda container çıkabilir."
    ipucu: "Tarif ile pişmiş yemek arasındaki ilişkiyi hatırla."
  - id: devops-008-s3
    soru: "`docker run --rm alpine echo merhaba` komutunda `--rm` ne yapar?"
    cevap: "Container işini bitirince onu otomatik siler. Böylece diskte kullanılmayan durmuş container birikmez."
    ipucu: "Bittikten sonra diskte neyin kalmamasını istiyorsun?"
  - id: devops-008-s4
    soru: "Container izolasyonu neden VM izolasyonundan zayıf kabul edilir?"
    cevap: "Çekirdek ortaktır. Çekirdekteki bir açık ya da fazla yetkili ayar, container'dan host'a geçişe yol açabilir. VM'de ise arada bir sanallaştırma katmanı vardır."
    ipucu: "Ortak olan bir şeyin zayıflığı hepsini etkiler."
  - id: devops-008-s5
    soru: "Bir ekip arkadaşın, tanımadığın bir kullanıcının Docker Hub imajını `docker run --privileged -v /:/host` ile denemeyi öneriyor. Ne dersin?"
    cevap: "Hayır derim. `--privileged` ve host kök dizinini bağlamak izolasyonu fiilen kaldırır; imaj zararlıysa host'un tamamı risktedir. Resmi ya da doğrulanmış imaj kullanır, yetkileri kısar, gerekirse izole bir sanal makinede denerim."
    ipucu: "Container'ın host ile paylaştığı şeyleri ve bu seçeneklerin onları ne kadar açtığını düşün."
derinDalis:
  - tur: okuma
    baslik: "Docker: Container nedir?"
    ayrinti: "Container'ın izole bir süreç olduğunu ve çekirdeği paylaştığını anlatır."
    url: "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/"
  - tur: okuma
    baslik: "Docker Engine güvenliği"
    ayrinti: "Daemon'a kimin erişebileceği ve izolasyonun dayanağı."
    url: "https://docs.docker.com/engine/security/"
hizliKontrol:
  - soru: "Container'ı sanal makineden ayıran temel özellik hangisidir?"
    secenekler: 
      - "Kendi işletim sistemi çekirdeğini çalıştırması"
      - "Host'un çekirdeğini paylaşması"
      - "Her zaman root olarak çalışması"
      - "Yalnız Linux'ta çalışması"
    dogru: 1
    aciklama: "Container izole bir süreçtir ve host'un çekirdeğini paylaşır; VM ise kendi çekirdeğini başlatır."
    ipucu: "Boot edilen bir işletim sistemi var mı?"
  - soru: "İmaj ile container arasındaki ilişki hangisidir?"
    secenekler: 
      - "Container, imajdan başlatılmış çalışan örnektir"
      - "İmaj, container'ın çalışan halidir"
      - "İkisi aynı şeydir"
      - "Container imajı siler"
    dogru: 0
    aciklama: "İmaj salt okunur şablondur; bir imajdan çok sayıda container çıkabilir."
    ipucu: "Tarif ve yemek benzetmesini hatırla."
sikHatalar:
  - hata: "Container'ın sanal makine kadar izole olduğunu sanmak."
    dogrusu: "Çekirdek ortaktır; yetkileri kıs, imajı sınırlı çalıştır, ek önlemleri unutma."
  - hata: "Container silinince içine yazılan verinin kalacağını sanmak."
    dogrusu: "Container geçicidir; kalıcı veri için volume kullan."
terimler:
  - "Container"
  - "Image"
  - "Volume"
sema:
  baslik: "`docker run alpine echo merhaba` ne yapar"
  adimlar:
    - etiket: "İmaj var mı"
      aciklama: "Docker yerelde `alpine` imajı olup olmadığına bakar."
    - etiket: "İndir"
      aciklama: "Yoksa kayıt defterinden çeker."
    - etiket: "Container oluştur"
      aciklama: "İmajdan yeni bir container başlatılır."
    - etiket: "Komut çalışır"
      aciklama: "`echo merhaba` çalışır ve çıkar."
    - etiket: "Temizlik"
      aciklama: "`--rm` varsa container silinir; imaj yerelde kalır."
---

**Container**, bir uygulamayı ve çalışması için gereken her şeyi (kütüphaneler, ayarlar) paketleyip diğerlerinden **izole** çalıştırma yöntemidir. "Bende çalışıyor" sorununu çözer: paket, nerede çalışırsa çalışsın aynı davranır.

### VM ile fark

| | Sanal makine | Container |
|---|---|---|
| Çekirdek | Kendi çekirdeği | Host'un çekirdeğini paylaşır |
| Açılma | Dakikalar | Saniyeler |
| Boyut | Gigabaytlar | Megabaytlar |
| İzolasyon | Güçlü | Daha zayıf |

Docker'ın tanımına göre container, izole çalışan sıradan bir süreçtir ve her container makinenin çekirdeğini paylaşır; bu yüzden boot edilecek bir işletim sistemi yoktur.

### İmaj ve container

- **İmaj (image):** Salt okunur şablon. Uygulama kodu, kütüphaneler ve temel dosya sistemi içinde.
- **Container:** İmajdan başlatılan çalışan örnek.

Bunu "tarif" ve "pişmiş yemek" gibi düşünebilirsin: bir tariften birçok yemek çıkar.

### Temel komutlar

```text
docker run <imaj>       # imajdan container başlat
docker ps               # çalışan container'lar
docker ps -a            # durmuşlar dahil hepsi
docker images           # yerel imajlar
docker rm <kimlik>      # container sil
```

`docker run alpine echo merhaba` yerelde `alpine` imajı yoksa önce kayıt defterinden indirir, sonra container'ı başlatır, komutu çalıştırır ve çıkar. `--rm` eklersen çıkışta container silinir.

### Dikkat edilecek yerler

- Container **geçicidir**: silinince içindeki yazılan veri de gider (kalıcılık için volume, devops-011).
- Container sanal makine değildir; "container içinde çalıştırdım, güvende" demek yanlıştır.

Güvenlik notu: Docker daemon'u genellikle root yetkisiyle çalışır ve Docker belgeleri yalnız güvenilir kullanıcıların daemon'u kontrol etmesi gerektiğini söyler. Bir kullanıcıya Docker erişimi vermek pratikte ona yüksek yetki vermek demektir. Ayrıca bilmediğin kaynaklardan gelen imajları çalıştırma; imaj da bir yazılımdır.
