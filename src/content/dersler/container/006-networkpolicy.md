---
kimlik: container-006
baslik: "NetworkPolicy"
donem: 7
sira: 6
sure: 35
neden: "Varsayılan Kubernetes ağında her pod her pod'a erişebilir. Bir pod ele geçirilirse saldırgan kümenin geri kalanına serbestçe gezebilir. NetworkPolicy ile 'varsayılan reddet, gerekeni aç' kurmak, yanal hareketi (lateral movement) sınırlayan temel savunmadır."
analoji:
  baslik: "Apartman kapıcısı ve ziyaretçi listesi"
  metin: "Varsayılan durum, her dairenin kapısının açık olduğu bir apartmandır: herkes her kapıdan girebilir. NetworkPolicy, kapıcıya 'yalnız bu listedekiler girsin' talimatı vermektir. Önce herkesi reddedersin, sonra ihtiyaç duyulan ziyaretçileri tek tek yazarsın. Sınırı: kapıcının görevi için bina yönetiminin (ağ eklentisinin) kuralı uygulaması gerekir; yönetim uygulamazsa liste kağıtta kalır."
gorev:
  aciklama: "Yerel `kind` kümesi ve `kubectl` gerekir. ÖNEMLİ: NetworkPolicy'yi uygulayan bir ağ eklentisi (CNI) gerekir; kind v0.24.0 ve sonrasında varsayılan eklenti (kindnetd) NetworkPolicy'yi uygular; `kind version` ile sürümünü kontrol et. Daha eski bir sürümde yasak sonrası bağlantı hâlâ başarılı olur; bu, kuralın uygulanması için CNI desteği gerektiğini gösterir. Komutlar küçük bir `nginx` ve `busybox` test pod'u kullanır; ücretsizdir, sonda temizlenir."
  komutlar:
    - kubectl create deployment api --image=nginx:1.27
    - kubectl expose deployment api --port=80
    - kubectl run test1 --rm -it --restart=Never --image=busybox:1.36 -- wget -qO- -T 3 http://api
    - |
      kubectl apply -f - <<'EOF'
      apiVersion: networking.k8s.io/v1
      kind: NetworkPolicy
      metadata:
        name: hepsini-reddet
      spec:
        podSelector: {}
        policyTypes: ["Ingress"]
      EOF
    - kubectl run test2 --rm -it --restart=Never --image=busybox:1.36 -- wget -qO- -T 3 http://api
    - kubectl delete networkpolicy hepsini-reddet && kubectl delete deployment,service api
  soru: "İlk `wget` neden başarılı oldu? Politika uygulandıktan sonra ikinci `wget`'in zaman aşımına uğramasını bekleriz; senin sonucun ne oldu ve bu ağ eklentisi hakkında ne söylüyor?"
  telefon:
    soru: "Bir isim alanında hiç NetworkPolicy yok. A pod'u B pod'una bağlanabilir mi? Aynı isim alanında bir 'hepsini reddet' politikası uygulanırsa ne değişir?"
    cevap: "Politika yoksa evet, bağlanabilir: pod'lar varsayılan olarak 'izole değildir' ve her bağlantı serbesttir. 'Hepsini reddet' (podSelector boş, gelen trafik) uygulanınca, ayrıca izin veren başka bir politika yoksa bu pod'lara gelen bütün bağlantılar reddedilir."
sorular:
  - id: container-006-s1
    soru: "Kubernetes'te varsayılan ağ davranışı nedir ve bu neden risktir?"
    cevap: "Hiçbir politika yokken bütün pod'lar birbirine ve dışarıya serbestçe bağlanabilir. Bir pod ele geçirilirse saldırgan diğer servislere (veri tabanları, iç API'ler) doğrudan ulaşabilir."
  - id: container-006-s2
    soru: "`podSelector: {}` boş seçici ne anlama gelir?"
    cevap: "Politikanın bulunduğu isim alanındaki bütün pod'ları seçer. Boş seçici ve boş kural listesiyle birleşince 'bu pod'lara hiçbir gelen bağlantıya izin verme' demek olur."
  - id: container-006-s3
    soru: "Bir NetworkPolicy yazdım ama hiçbir şey değişmedi. İlk neyi kontrol edersin?"
    cevap: "Kümenin ağ eklentisinin (CNI) NetworkPolicy'yi destekleyip desteklemediğini. Uygulayan bir eklenti yoksa politika nesnesi oluşur ama hiçbir etkisi olmaz."
  - id: container-006-s4
    soru: "'Varsayılan reddet' kurulduktan sonra uygulama DNS çözemiyorsa ne olmuş olabilir?"
    cevap: "Çıkış (egress) trafiği de kapatıldıysa pod, küme DNS servisine erişemez. Çıkış politikalarında DNS (genellikle 53 numaralı port) için açıkça izin verilmelidir."
derinDalis:
  - tur: okuma
    baslik: "Kubernetes: Ağ politikaları"
    ayrinti: "İzole olmayan/izole pod kavramı, varsayılan politikalar ve örnek YAML'lar."
    url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/"
---

Kubernetes ağının varsayılanı **düzdür**: her pod, küme içindeki her pod'la konuşabilir. Bu geliştirmeyi kolaylaştırır ama bir pod'un ele geçirilmesi durumunda saldırgana küme içinde serbest dolaşma izni verir. Buna **yanal hareket** (lateral movement) denir.

### NetworkPolicy nedir

**NetworkPolicy**, hangi pod'ların hangi pod'larla, isim alanlarıyla ya da IP aralıklarıyla konuşabileceğini tanımlayan bir Kubernetes nesnesidir. Önemli noktalar:

- Politika **pod seçer** (etiketle) ve o pod'lar için **gelen** (ingress) ve/veya **giden** (egress) trafiği tanımlar.
- Bir pod'u seçen **hiçbir politika yoksa** pod "izole değildir": her bağlantıya izin verilir.
- Bir pod'u seçen en az bir politika varsa pod o yönde **izole** olur: yalnız politikalarda yazan bağlantılara izin verilir. Politikalar toplanarak çalışır (birleşim).
- Politikayı gerçekten **ağ eklentisi** (CNI) uygular. Eklenti desteklemiyorsa nesne oluşur ama etkisiz kalır.

### Önce hepsini reddet

En sağlıklı model iki adımdır:

1. Her isim alanına bir "hepsini reddet" politikası koy.
2. Sonra yalnız gerekli bağlantılar için izin politikası ekle.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: hepsini-reddet
spec:
  podSelector: {}
  policyTypes: ["Ingress", "Egress"]
```

Boş `podSelector` isim alanındaki bütün pod'ları seçer. Kural listesi olmadığı için hiçbir gelen ya da giden bağlantıya izin yoktur.

Sonra örneğin yalnız `web` pod'larının `api` pod'larına 8080 portundan bağlanmasına izin verirsin:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: web-den-api-ye
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes: ["Ingress"]
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: web
      ports:
        - port: 8080
```

### Egress ve DNS tuzağı

Çıkış trafiğini de kapattığında pod DNS'e ulaşamaz ve uygulama "ad çözülemiyor" hatası verir. DNS için küme DNS pod'larına (genellikle `kube-system` isim alanında) 53 portu izni vermen gerekir. Çıkışı kısıtlamak, ele geçirilmiş bir pod'un dışarıya veri kaçırmasını ya da komuta sunucusuna bağlanmasını zorlaştırdığı için değerlidir.

### Pratik öneriler

- Veri tabanı gibi hassas servisleri yalnız onlara ihtiyaç duyan pod'lara aç.
- Politikaları kod olarak sakla (Git'te), değişiklikleri inceleme sürecinden geçir.
- Politikayı canlıya almadan önce test isim alanında dene; yanlış bir "reddet" üretimi kesebilir.
- Bulut meta veri servisine (ör. `169.254.169.254`) çıkışı kısıtlamayı düşün; SSRF (appsec-010) saldırılarında kullanılır.

Güvenlik notu: Politikanın yazılı olması uygulandığı anlamına gelmez. Ağ eklentisinin NetworkPolicy desteğini ve uygulamayı bir test pod'uyla (ya da araçlarla) doğrulamadan "korunuyoruz" deme.
