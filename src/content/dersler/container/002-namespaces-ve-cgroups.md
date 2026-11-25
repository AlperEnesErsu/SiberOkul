---
kimlik: container-002
baslik: "Namespaces ve cgroups"
donem: 7
sira: 2
sure: 35
neden: "Container güvenliğini anlamak, izolasyonun nereden geldiğini bilmeye bağlı: bir container sanal makine değil, çekirdeğin özel kurallarla sınırladığı bir süreçtir. Container kaçışı haberlerini ya da 'privileged' uyarılarını bu bilgiyle doğru okursun."
analoji:
  baslik: "Otel odası ve elektrik sayacı"
  metin: "Namespace, otel odasının kapısı ve perdesidir: konuk yalnız kendi odasını görür, koridordaki diğer odaları görmez. Cgroup ise odanın elektrik ve su sayacıdır: konuk ne kadar tüketebileceğini aşamaz. Sınırı: aynı otelin binası (çekirdek) herkes için ortaktır; binanın yapısında bir çatlak varsa perdeler yetmez."
gorev:
  aciklama: "Docker Desktop çalışıyor olmalı. Komutlar küçük `alpine` imajıyla geçici container başlatır. cgroup v2 kullanan güncel Docker Desktop varsayılır; dosya yolları eski sistemlerde farklı olabilir."
  komutlar:
    - docker run --rm alpine ps
    - docker run --rm alpine ls /proc/self/ns
    - docker run --rm alpine hostname
    - docker run --rm --memory 64m alpine cat /sys/fs/cgroup/memory.max
    - docker run --rm --pids-limit 20 alpine cat /sys/fs/cgroup/pids.max
  soru: "`ps` çıktısında neden yalnız birkaç süreç görünüyor ve `memory.max` neden 67108864 yazıyor?"
  telefon:
    soru: "Bir container içinde `ps` komutu yalnız PID 1 ve kendisini gösteriyor. Konakta ise yüzlerce süreç var. Bunu hangi mekanizma sağlıyor?"
    cevap: "PID namespace'i. Container'a kendine ait bir süreç numarası alanı verilir; içeriden yalnız o alandaki süreçler görünür. Konak ise aynı süreçleri farklı numaralarla görebilir."
sorular:
  - id: container-002-s1
    soru: "Namespace ve cgroup arasındaki fark nedir?"
    cevap: "Namespace bir sürecin neyi görebildiğini sınırlar (süreçler, ağ, dosya bağlama noktaları, kullanıcılar). Cgroup ise ne kadar kaynak kullanabileceğini sınırlar (bellek, işlemci, süreç sayısı)."
  - id: container-002-s2
    soru: "Container bir sanal makineden nasıl ayrılır ve bu güvenliği nasıl etkiler?"
    cevap: "Sanal makinenin kendi çekirdeği vardır; container'lar konağın çekirdeğini paylaşır. Çekirdekteki bir açık, bütün container'ları etkileyebilir; bu yüzden container izolasyonu sanal makineden daha ince bir sınır sayılır."
  - id: container-002-s3
    soru: "Bellek sınırı (`--memory`) koymamak hangi saldırı ya da hataya kapı açar?"
    cevap: "Hizmet reddi (denial of service): bir container ya da sızılan uygulama konağın belleğini tüketip diğer container'ları ve konağı çökertebilir. Sınır varsa çekirdek yalnız o container'ı durdurur."
  - id: container-002-s4
    soru: "`--privileged` ya da `--pid=host` gibi bayraklar neden tehlikelidir?"
    cevap: "Namespace izolasyonunu kaldırır ya da deler: container konağın süreçlerini görür, aygıtlarına ulaşır. Böylece 'container kaçışı' için gereken duvar fiilen yok olur."
derinDalis:
  - tur: okuma
    baslik: "Linux man sayfası: namespaces(7)"
    ayrinti: "Namespace türlerinin (PID, ağ, mount, kullanıcı ...) resmi açıklaması."
    url: "https://man7.org/linux/man-pages/man7/namespaces.7.html"
  - tur: okuma
    baslik: "Linux man sayfası: cgroups(7)"
    ayrinti: "Kontrol gruplarının ne olduğu ve v1/v2 farkı."
    url: "https://man7.org/linux/man-pages/man7/cgroups.7.html"
---

Bir container'ı çalıştırmak için özel bir "container teknolojisi" gerekmez: Linux çekirdeğinin iki özelliği yeter. Docker ve Kubernetes bunları kullanışlı hale getirir.

### Namespace: neyi görürsün

**Namespace** (isim alanı), bir sürecin sistemin belirli bir parçasını yalnız kendi sürümüyle görmesini sağlar. Başlıca türler:

| Namespace | İzole ettiği şey |
|---|---|
| PID | Süreç numaraları: container'da ilk süreç PID 1'dir |
| Network | Ağ arayüzleri, IP adresleri, portlar |
| Mount | Dosya sistemi bağlama noktaları: container'ın kendi kökü |
| UTS | Makine adı (`hostname`) |
| IPC | Süreçler arası haberleşme kaynakları |
| User | Kullanıcı ve grup numaraları |

Bugünkü görevde `ls /proc/self/ns` bu isim alanlarının listesini gösterir. `ps` komutunun az süreç göstermesi PID namespace'inin etkisidir; `hostname` komutunun rastgele bir kimlik yazması UTS namespace'inin.

### Cgroup: ne kadar kullanırsın

**Cgroup** (control group, kontrol grubu), süreç gruplarına kaynak tavanı koyar: bellek, işlemci, süreç sayısı, disk hızı. `--memory 64m` dediğinde Docker bir cgroup oluşturur ve bellek tavanını 64 MiB'a ayarlar. Sınırı aşan süreç çekirdek tarafından sonlandırılır. Bunu bir "güvenlik duvarı" gibi düşün: kaynak tüketen bir saldırının ya da hatalı döngünün diğer iş yüklerini boğmasını önler.

### Container = süreç + namespace + cgroup + dosya sistemi

Container'ın içindeki bir süreç aslında konağın normal bir sürecidir. Konaktan bakınca görürsün. Çekirdek ona sınırlı bir bakış açısı ve kaynak tavanı verir. Bundan iki sonuç çıkar:

1. **Çekirdek ortaktır.** Çekirdekte bir açık varsa izolasyon aşılabilir. Buna **container kaçışı** (container escape) denir. Gerçek dünyada kaçışlar genellikle iki yoldan olur: çekirdek ya da çalıştırma ortamındaki (runtime) bir zafiyet, ya da kötü yapılandırma.
2. **Kötü yapılandırma en yaygın yoldur.** `--privileged`, konağın Docker soketini (`/var/run/docker.sock`) container'a bağlamak, `--pid=host` ya da `--network=host` gibi bayraklar izolasyonu kendi elinle delmek demektir.

### Savunma

- Root olmayan kullanıcıyla çalış (container-001).
- Bellek ve süreç sayısı sınırı koy.
- `--privileged` ve konak namespace'lerini paylaşan bayrakları kullanma.
- Çekirdeği ve container çalıştırma ortamını güncel tut.
- Çok hassas iş yükleri için kullanıcı namespace'i, rootless mod ya da sanal makine tabanlı izolasyon gibi ek katmanları düşün.

Güvenlik notu: Docker soketini bir container'a bağlamak, o container'a konak üzerinde root'a yakın yetki vermek demektir; çünkü soket üzerinden yeni, ayrıcalıklı container'lar başlatılabilir. CI araçlarında bu pratik sık görülür; riskini bilerek karar ver.
