---
kimlik: container-003
baslik: "Kubernetes mimarisi"
donem: 7
sira: 3
sure: 35
neden: "Üretimdeki container'ların çoğu Kubernetes üzerinde çalışır. Hangi bileşenin neyi yönettiğini bilmeden RBAC, ağ politikası ya da sır yönetimi konularını güvenli kuramazsın; saldırganın hedefi de çoğu zaman API sunucusu ya da etcd olur."
analoji:
  baslik: "Konteyner limanı"
  metin: "Kontrol düzlemi liman yönetim binasıdır: hangi gemi nereye yanaşacak, hangi konteyner nerede duracak orada karar verilir. Düğümler (node) rıhtımlardır; kubelet her rıhtımdaki sorumludur ve yönetimin talimatını uygular. Sınırı: gerçek limanda yönetim bir kez karar verir, Kubernetes ise sürekli 'istenen durum ile gerçek durum aynı mı?' diye bakar ve fark görürse düzeltir."
gorev:
  aciklama: "Yerel bir küme için `kind` (Kubernetes in Docker) ve `kubectl` gerekir. Windows'ta Docker Desktop çalışırken WSL'de kurabilirsin; kurulum için https://kind.sigs.k8s.io/docs/user/quick-start/ ve https://kubernetes.io/docs/tasks/tools/ sayfalarına bak. Küme birkaç dakikada açılır ve bilgisayarında container olarak çalışır; ücretsizdir. İşin bitince son komutla sil."
  komutlar:
    - kind create cluster --name siberokul
    - kubectl cluster-info
    - kubectl get nodes -o wide
    - kubectl get pods -n kube-system
    - docker ps --format "table {{.Names}}\t{{.Image}}"
    - kind delete cluster --name siberokul
  soru: "`kube-system` içindeki pod'lardan hangileri kontrol düzleminin parçası (API sunucusu, etcd, zamanlayıcı, controller manager)? `docker ps` çıktısında düğümün neye benzediğini yorumla."
  telefon:
    soru: "Bir saldırgan `etcd` veritabanına doğrudan erişebiliyor. Kümenin hangi bilgilerini okuyabilir ve bu neden bu kadar kritik?"
    cevap: "etcd kümenin bütün durumunu tutar: nesne tanımları, yapılandırmalar ve Secret'lar. Varsayılan olarak Secret'lar etcd'de şifrelenmemiştir; erişen kişi sırları okur, nesneleri değiştirirse kümeyi ele geçirir. Bu yüzden etcd'ye erişim sıkı kısıtlanır, ağ erişimi ve istemci sertifikasıyla korunur."
sorular:
  - id: container-003-s1
    soru: "Kontrol düzlemi (control plane) ile düğüm (node) arasındaki fark nedir?"
    cevap: "Kontrol düzlemi kümeyi yönetir ve kararları verir (API sunucusu, etcd, zamanlayıcı, controller manager). Düğümler ise iş yüklerinin gerçekten çalıştığı makinelerdir; üzerlerinde kubelet, ağ vekili ve container çalıştırma ortamı bulunur."
  - id: container-003-s2
    soru: "`kube-apiserver` neden kümenin 'ön kapısı' sayılır?"
    cevap: "Bütün istekler (kubectl, kubelet, controller'lar) ona gelir; kimlik doğrulama, yetkilendirme ve doğrulama orada yapılır. API sunucusuna yetkisiz erişim kümenin tamamına erişim demektir; bu yüzden en sıkı korunan bileşendir."
  - id: container-003-s3
    soru: "`kubelet` ne yapar?"
    cevap: "Her düğümde çalışan ajandır. API sunucusundan kendi düğümüne atanan pod tanımlarını alır, container'ların çalıştığından emin olur ve durumunu API sunucusuna bildirir."
  - id: container-003-s4
    soru: "'İstenen durum' (desired state) fikrini bir cümleyle açıkla."
    cevap: "Sen 'şu imajdan 3 kopya olsun' diye bildirirsin; Kubernetes gerçek durumu bununla sürekli karşılaştırır ve fark varsa (bir pod çökmüşse) eksik olanı yeniden oluşturur. Komut vermezsin, hedefi söylersin."
derinDalis:
  - tur: okuma
    baslik: "Kubernetes: bileşenler"
    ayrinti: "Kontrol düzlemi ve düğüm bileşenlerinin resmi tanıtımı."
    url: "https://kubernetes.io/docs/concepts/overview/components/"
  - tur: lab
    baslik: "kind hızlı başlangıç"
    ayrinti: "Yerelde küme kurmak, birden çok düğümlü küme yapılandırması."
    url: "https://kind.sigs.k8s.io/docs/user/quick-start/"
---

**Kubernetes**, container'ları birçok makine üzerinde çalıştırıp yöneten bir **orkestrasyon** (orchestration) sistemidir. Bir container çökerse yenisini başlatır, yük artınca kopya sayısını çoğaltır, yeni sürümü kesintisiz devreye alır. Bir Kubernetes kurulumuna **küme** (cluster) denir ve iki parçadan oluşur.

### Kontrol düzlemi (control plane)

Kümenin beynidir. Başlıca bileşenler:

- **kube-apiserver**: Kümenin tek ön kapısı. `kubectl`, kubelet ve diğer bileşenler yalnız onunla konuşur. Kimlik doğrulama ve yetkilendirme burada yapılır.
- **etcd**: Kümenin bütün durumunu saklayan anahtar-değer veritabanı. Nesne tanımları ve Secret'lar burada durur.
- **kube-scheduler** (zamanlayıcı): Yeni bir pod'un hangi düğümde çalışacağına karar verir.
- **kube-controller-manager**: "İstenen durum ile gerçek durum aynı mı?" döngülerini çalıştıran denetleyiciler (controller) toplamı.

### Düğümler (nodes)

İşin gerçekten yapıldığı makineler. Her düğümde:

- **kubelet**: Düğümdeki ajan. API sunucusunun verdiği pod tanımlarını uygular, container'ların sağlıklı çalışmasını sağlar.
- **container çalıştırma ortamı** (container runtime), ör. containerd: container'ı fiilen başlatan yazılım.
- **kube-proxy**: Servis (Service) trafiğini pod'lara yönlendiren ağ kuralları.

### Bir isteğin yolu

`kubectl apply -f uygulama.yaml` dediğinde şunlar olur:

1. `kubectl` isteği API sunucusuna gönderir.
2. API sunucusu kimliğini doğrular, yetkini denetler ve nesneyi etcd'ye yazar.
3. Zamanlayıcı pod'a bir düğüm seçer.
4. O düğümdeki kubelet pod'u görür, container'ı başlatır ve durumu bildirir.

Burada iki güvenlik dersi vardır. Birincisi, **API sunucusu ve etcd kümenin tacıdır**: ikisine erişen kümenin sahibidir. İkincisi, her adım bir saldırı yüzeyi: kubelet'in kendi API'si, API sunucusuna anonim erişim ya da herkese açık bırakılmış kontrol paneli gerçek olaylarda sık görülen hatalardır.

### Bugünkü ortam

`kind`, her Kubernetes düğümünü bir Docker container'ı olarak çalıştırır; bu yüzden bilgisayarında küçük bir küme kurmak kolaydır. Görevde `docker ps` çıktısında düğümün bir container olduğunu göreceksin: container içinde container'lar. Yerel öğrenme için idealdir, üretim için değildir.

### Başlıca nesne türleri (sonraki ders)

Kümede çalışan her şey bir **nesne** (object) olarak tanımlanır: Pod, Deployment, Service, ConfigMap, Secret. Hepsi YAML ile yazılır ve API sunucusuna gönderilir. Bir sonraki derste ilk üçünü kuracağız.

Güvenlik notu: Kümenin API sunucusuna internetten, kimlik doğrulaması zayıf biçimde erişilebilmesi ciddi bir hatadır. Bulut sağlayıcılarda API uç noktasını yalnız bilinen IP aralıklarına açmak ya da özel ağa almak standart önlemdir.
