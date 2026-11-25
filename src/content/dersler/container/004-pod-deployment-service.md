---
kimlik: container-004
baslik: "Pod, Deployment, Service"
donem: 7
sira: 4
sure: 35
neden: "Kubernetes'te hemen her şey Pod, Deployment ve Service üçlüsüyle başlar. Bir DevSecOps mühendisi YAML incelerken bu nesnelerin ne yaptığını ve hangisinin dış dünyaya açıldığını bir bakışta okuyabilmelidir."
analoji:
  baslik: "Restoran: aşçı, vardiya amiri, kasa"
  metin: "Pod bir aşçıdır: işi yapan en küçük birim, hasta olursa yerine yenisi gelir. Deployment vardiya amiridir: 'her an 3 aşçı mutfakta olsun' der ve biri giderse yenisini çağırır. Service servis penceresidir: aşçılar değişse de müşteri hep aynı pencereye gider. Sınırı: aşçıların isimleri vardır, pod'lar ise geçicidir ve numarası değişir; bu yüzden pencereye (Service) güvenilir, tek tek pod'a değil."
gorev:
  aciklama: "Yerel bir `kind` kümesi ve `kubectl` gerekir (container-003'teki kurulum). Küme yoksa önce `kind create cluster --name siberokul` ile aç. Komutlar küme içinde `nginx` imajından küçük bir web uygulaması başlatır; ücretsizdir, sonda temizlenir."
  komutlar:
    - kubectl create deployment web --image=nginx:1.27 --replicas=2
    - kubectl get deployment,pod -l app=web
    - kubectl expose deployment web --port=80
    - kubectl get service web
    - kubectl delete pod -l app=web --wait=false
    - kubectl get pod -l app=web
    - kubectl delete deployment,service web
  soru: "Pod'ları sildikten hemen sonra `get pod` çıktısında ne gördün ve bu Deployment hakkında ne söylüyor?"
  telefon:
    soru: "Bir Deployment `replicas: 3` diyor. Üç pod'dan biri çöküp yok oluyor. Kubernetes ne yapar ve bunu hangi nesne yapar?"
    cevap: "Deployment (aslında altındaki ReplicaSet) istenen sayıyı (3) gerçekle karşılaştırır, eksik olanın yerine yeni bir pod başlatır. İstenen durum 3, gerçek durum 2 olduğu için fark kapanana kadar yeni pod üretilir."
sorular:
  - id: container-004-s1
    soru: "Pod nedir ve neden doğrudan Pod yazmak yerine Deployment kullanırız?"
    cevap: "Pod, bir ya da birkaç container'ı birlikte çalıştıran en küçük birimdir ve geçicidir. Doğrudan açılan pod çökerse ya da düğüm giderse kimse yenisini başlatmaz. Deployment istenen kopya sayısını korur, güncellemeyi kademeli yapar."
  - id: container-004-s2
    soru: "Service neden gereklidir? Pod'un IP'sine doğrudan bağlanmak neden sorun?"
    cevap: "Pod'lar yeniden oluşunca IP'leri değişir. Service, etiketle seçtiği pod'lara sabit bir ad ve adres üzerinden yük dağıtarak erişim sağlar."
  - id: container-004-s3
    soru: "Service türlerinden `ClusterIP`, `NodePort` ve `LoadBalancer` hangisi dış dünyaya açılma riski taşır?"
    cevap: "`NodePort` düğümlerin bir portunu, `LoadBalancer` ise bulut sağlayıcıdan genel bir adres açar. `ClusterIP` (varsayılan) yalnız küme içinden erişilebilir. Dışarı açılan her Service bilinçli ve gerekçeli olmalı."
  - id: container-004-s4
    soru: "Üretimde imaj etiketi olarak neden `nginx:latest` yerine `nginx:1.27` gibi sabit sürüm yazılır?"
    cevap: "`latest` zamanla farklı içeriğe işaret edebilir; aynı YAML'dan farklı zamanlarda farklı imaj çıkar, geri dönüş ve denetim zorlaşır. Sabit sürüm (daha iyisi digest) tekrarlanabilir ve incelenebilir dağıtım sağlar."
derinDalis:
  - tur: okuma
    baslik: "Kubernetes: Pod'lar"
    ayrinti: "Pod yaşam döngüsü ve tek container'lı / çok container'lı pod kavramları."
    url: "https://kubernetes.io/docs/concepts/workloads/pods/"
  - tur: okuma
    baslik: "Kubernetes: Deployment"
    ayrinti: "Kademeli güncelleme (rolling update) ve geri alma."
    url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/"
  - tur: okuma
    baslik: "Kubernetes: Service"
    ayrinti: "Servis türleri ve etiket seçicileri."
    url: "https://kubernetes.io/docs/concepts/services-networking/service/"
---

Kubernetes'i konuşurken üç nesneyi sürekli duyacaksın. Üçü birlikte "uygulamam çalışsın, kopyası olsun, erişilebilsin" ihtiyacını karşılar.

### Pod

**Pod**, Kubernetes'in en küçük dağıtım birimidir. İçinde bir (bazen birkaç) container vardır; pod içindeki container'lar aynı ağı ve depolamayı paylaşır. Pod **geçicidir**: çökerse ya da düğüm giderse kaybolur, yerine yenisi (başka IP ile) gelir. Bu yüzden pod'u elle başlatmak yerine onu yöneten bir üst nesne kullanılır.

### Deployment

**Deployment**, "bu imajdan şu kadar kopya her zaman çalışsın" diyen nesnedir. Arkasında bir **ReplicaSet** çalışır; kopya sayısını sabit tutar. Yeni sürüm çıkarsan Deployment pod'ları kademeli değiştirir (rolling update); sorun çıkarsa `kubectl rollout undo` ile eskiye dönersin.

Örnek bir Deployment YAML'ı:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: nginx:1.27
          ports:
            - containerPort: 80
```

`selector` ile `template.labels` eşleşmeli: Deployment hangi pod'ların kendisine ait olduğunu **etiketle** (label) bilir. Etiketler Kubernetes'in yapıştırıcısıdır; Service ve NetworkPolicy de aynı yolla pod seçer.

### Service

Pod'lar değiştikçe IP'leri değişir. **Service**, etiketle seçtiği pod'lar için sabit bir ad ve sanal adres verir; isteği pod'lara dağıtır. Küme içinden `http://web` diyerek erişebilirsin.

| Tür | Kime açık |
|---|---|
| ClusterIP (varsayılan) | Yalnız küme içi |
| NodePort | Her düğümün bir portu üzerinden dışarı |
| LoadBalancer | Bulut sağlayıcının genel yük dengeleyicisi |

### kubectl ile okumak

`kubectl`, kümeyle konuştuğun komut satırı aracıdır. En çok işine yarayacak dörtlü:

- `kubectl get <tür>`: listele.
- `kubectl describe <tür> <ad>`: ayrıntı ve olaylar (hata ayıklamanın ilk adımı).
- `kubectl logs <pod>`: container günlükleri.
- `kubectl apply -f dosya.yaml`: YAML'daki istenen durumu uygula.

### Güvenlik gözüyle

Bir YAML okurken şunlara bak: imaj etiketi sabit mi? Hangi Service türü dışarı açıyor? Pod `privileged` mi, root mu çalışıyor? Bu soruların cevabı sonraki derslerde (RBAC, NetworkPolicy, Pod Security) denetim noktalarına dönüşecek.

Güvenlik notu: `kubectl` komutlarını yanlış kümede çalıştırmak klasik bir kazadır. Çalıştırmadan önce `kubectl config current-context` ile hangi kümede olduğunu kontrol etme alışkanlığı edin; özellikle `delete` komutlarından önce.
