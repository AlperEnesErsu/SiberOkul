---
kimlik: container-005
baslik: "Kubernetes RBAC"
donem: 7
sira: 5
sure: 35
neden: "Kubernetes kümelerindeki ihlallerin büyük kısmı fazla geniş yetkiden büyür: her şeye yetkili bir hizmet hesabı, 'cluster-admin' verilmiş bir CI aracı. DevSecOps mühendisi olarak RBAC kurallarını okuyup en az yetkiye indirmek en çok yapacağın işlerden biri."
analoji:
  baslik: "Otel anahtar kartları"
  metin: "Role, 'şu odalara girebilir' yazan kart şablonudur. RoleBinding, o kartı belirli bir kişiye (ya da hizmet hesabına) teslim etmektir. Temizlik görevlisinin kartı 3. kat odalarını açar, ama kasa dairesini açmaz. Sınırı: otel kartı kapıları açar, RBAC ise 'ne yapabilirsin' (listele, oku, sil) ayrıntısını da söyler."
gorev:
  aciklama: "Yerel `kind` kümesi ve `kubectl` gerekir (container-003'teki kurulum). Komutlar yalnız kümedeki `default` isim alanında küçük yetki nesneleri oluşturur; ücretsizdir. Sonda temizlenir."
  komutlar:
    - kubectl create serviceaccount okuyucu
    - kubectl create role pod-okuyucu --verb=get,list --resource=pods
    - kubectl create rolebinding okuyucu-baglantisi --role=pod-okuyucu --serviceaccount=default:okuyucu
    - kubectl auth can-i list pods --as=system:serviceaccount:default:okuyucu
    - kubectl auth can-i delete pods --as=system:serviceaccount:default:okuyucu
    - kubectl auth can-i list secrets --as=system:serviceaccount:default:okuyucu
    - kubectl delete rolebinding okuyucu-baglantisi && kubectl delete role pod-okuyucu && kubectl delete serviceaccount okuyucu
  soru: "Üç `can-i` komutu neden `yes`, `no`, `no` döndü? İlk komut tek başına neden 'yes' veriyor?"
  telefon:
    soru: "Bir Role'de `verbs: [\"*\"]`, `resources: [\"*\"]` yazıyor ve bir CI hizmet hesabına bağlı. Bu neden kötü ve ne yaparsın?"
    cevap: "Hizmet hesabı o isim alanındaki her kaynakta her işlemi yapabilir (Secret'ları okumak dahil); hesap ele geçirilirse hasar çok büyük olur. Çözüm: CI'ın gerçekten yaptığı işlemleri (ör. deployments için get, update) ve kaynakları tek tek yaz."
sorular:
  - id: container-005-s1
    soru: "Role ile ClusterRole arasındaki fark nedir?"
    cevap: "Role tek bir isim alanı (namespace) içindeki kaynaklar için geçerlidir. ClusterRole bütün kümeyi ya da isim alanına bağlı olmayan kaynakları (düğümler gibi) kapsar. Mümkünse Role tercih edilir; çünkü kapsamı dardır."
  - id: container-005-s2
    soru: "RBAC kuralları 'izin verir' mi 'yasaklar' mı? Yasaklama kuralı yazılabilir mi?"
    cevap: "RBAC yalnız izin verir; varsayılan 'yasak', yani kural yoksa erişim yoktur. Yasaklama (deny) kuralı yazılamaz; yetkiyi eksiltmek için ilgili izni vermemek ya da bağlantıyı kaldırmak gerekir."
  - id: container-005-s3
    soru: "ServiceAccount nedir ve pod'larda neden önemlidir?"
    cevap: "Pod içinde çalışan sürecin API sunucusuna kendini tanıtmak için kullandığı kimliktir. Pod ele geçirilirse saldırgan bu kimliğin yetkileriyle API'ye erişir; bu yüzden hizmet hesabına yalnız gereken yetki verilmeli."
  - id: container-005-s4
    soru: "`kubectl auth can-i ... --as=...` neden güvenlik denetiminde yararlıdır?"
    cevap: "Bir kimliğin fiilen ne yapabildiğini kural dosyalarını tek tek okumadan sorgulatır. 'Bu hesap Secret okuyabiliyor mu?' sorusuna hızlı ve kanıtlı cevap verir."
derinDalis:
  - tur: okuma
    baslik: "Kubernetes: RBAC yetkilendirmesi"
    ayrinti: "Role, ClusterRole, bağlantılar ve varsayılan roller."
    url: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/"
  - tur: okuma
    baslik: "Kubernetes: RBAC iyi uygulamalar"
    ayrinti: "Gereğinden geniş yetkiler, joker karakter ve yetki yükseltme yolları."
    url: "https://kubernetes.io/docs/concepts/security/rbac-good-practices/"
---

Kubernetes'te her istek API sunucusundan geçer. Sunucu iki soru sorar: *Sen kimsin?* (kimlik doğrulama, authentication) ve *Buna iznin var mı?* (yetkilendirme, authorization). İkincisini **RBAC** (Role-Based Access Control, rol tabanlı erişim kontrolü) yapar.

### Dört nesne

| Nesne | Ne yapar |
|---|---|
| Role | Bir isim alanında hangi kaynaklarda hangi işlemlerin yapılabileceğini listeler |
| ClusterRole | Aynısı, ama bütün küme için |
| RoleBinding | Bir Role'ü bir kullanıcıya, gruba ya da hizmet hesabına bağlar |
| ClusterRoleBinding | Bir ClusterRole'ü bütün kümede bağlar |

Bir kural üç parçadan oluşur: **apiGroups** (API grubu), **resources** (kaynak: pods, secrets, deployments) ve **verbs** (fiil: get, list, watch, create, update, delete).

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-okuyucu
  namespace: default
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list"]
```

Bu Role tek başına bir şey yapmaz; bir `RoleBinding` ile bir kimliğe bağlanması gerekir.

### Varsayılan: yasak

RBAC **yalnız izin verir**. Kural yoksa erişim yoktur. Bu "varsayılan olarak reddet" yaklaşımı güvenlik açısından doğru bir başlangıçtır. Aksine, tek bir joker kural (`*`) bunu bozar.

### Hizmet hesapları (ServiceAccount)

İnsanların kullanıcıları dışında, **pod'lar** da API'yle konuşur ve bunun için bir **ServiceAccount** kullanır. Pod ele geçirilirse saldırgan bu kimliği kullanır. İyi uygulamalar:

- Her uygulama için ayrı hizmet hesabı oluştur; `default` hesabı paylaşma.
- API'ye hiç ihtiyacı olmayan pod'larda `automountServiceAccountToken: false` yap.
- Hizmet hesabına yalnız ihtiyaç duyduğu kaynakları ve fiilleri ver.

### En çok yapılan RBAC hataları

1. **`cluster-admin` bağlamak.** Hızlı çözüm olarak başlar, kalıcı açığa döner.
2. **Joker karakter** (`*`) kullanmak, özellikle `resources` ya da `verbs` alanında.
3. **`secrets` için `list` / `get` vermek.** Bir isim alanındaki bütün sırların okunması demektir.
4. **Pod oluşturma yetkisini küçümsemek.** Pod oluşturabilen biri, hizmet hesaplarını kullanan bir pod başlatıp onların yetkilerine ulaşabilir; bu "dolaylı yetki yükseltmedir".
5. Kimin hangi yetkiye sahip olduğunu hiç gözden geçirmemek.

### Denetim

`kubectl auth can-i <fiil> <kaynak> --as=<kimlik>` ile bir kimliğin yetkisini sorgularsın. `--list` ile tüm yetkilerini dökebilirsin. Üretimde bu sorguları düzenli denetim listesinin parçası yap.

Güvenlik notu: `cluster-admin` rolü kümedeki her şeyi yapma yetkisidir. Bir CI aracına ya da hizmet hesabına bu rolü bağlamak, o aracın sızmasının kümenin tamamının sızması anlamına geldiğini unutma.
