---
kimlik: container-008
baslik: "Pod Security Standards"
donem: 7
sira: 8
sure: 35
neden: "Container-001'de öğrendiğin sıkılaştırmaları Kubernetes'te kümenin kendisi zorunlu kılabilir. Pod Security Standards ile ayrıcalıklı ya da root çalışan pod'ların kümeye girmesini engellemek, DevSecOps'un 'baştan güvenli' yaklaşımının merkezidir."
analoji:
  baslik: "Bina giriş denetimi"
  metin: "Privileged, kapıda kimse kontrol etmeyen bir binadır: her şey içeri girer. Baseline, bariz tehlikeli şeyleri (silah) kapıdan çeviren denetimdir. Restricted ise tam kimlik, çanta aramasıdır: yalnız kurallara tam uyanlar girer. Sınırı: kapı denetimi içeri girmeyi engeller; içeridekilerin sonradan ne yaptığını izlemek ayrı bir iştir."
gorev:
  aciklama: "Yerel `kind` kümesi ve `kubectl` gerekir. Komutlar yeni bir isim alanı açıp `restricted` profilini zorunlu kılar, kurala uymayan bir pod'u denemenizi ve uyan bir pod'u çalıştırmanızı sağlar. Ücretsizdir; sonda isim alanı silinir."
  komutlar:
    - kubectl create namespace siki
    - kubectl label namespace siki pod-security.kubernetes.io/enforce=restricted
    - kubectl run kotu --image=nginx:1.27 -n siki
    - |
      kubectl apply -n siki -f - <<'EOF'
      apiVersion: v1
      kind: Pod
      metadata:
        name: iyi
      spec:
        securityContext:
          runAsNonRoot: true
          runAsUser: 10001
          seccompProfile:
            type: RuntimeDefault
        containers:
          - name: iyi
            image: busybox:1.36
            command: ["sleep", "3600"]
            securityContext:
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
      EOF
    - kubectl get pod -n siki
    - kubectl delete namespace siki
  soru: "`kotu` pod'u neden reddedildi? Hata mesajı hangi alanların eksik olduğunu söylüyor ve `iyi` pod'unda bunların karşılığı ne?"
  telefon:
    soru: "Bir pod YAML'ında `securityContext: { privileged: true }` yazıyor. Hangi Pod Security profili bunu engeller, hangisi izin verir?"
    cevap: "Baseline ve Restricted engeller; Privileged profili izin verir. Ayrıcalıklı container neredeyse konak yetkisine sahiptir, bu yüzden yalnız gerçekten zorunlu sistem bileşenlerinde ve kontrollü olarak kabul edilir."
sorular:
  - id: container-008-s1
    soru: "Üç Pod Security profilini (privileged, baseline, restricted) bir cümleyle ayır."
    cevap: "Privileged hiçbir kısıtlama koymaz; baseline bilinen yetki yükseltme yollarını engeller ama gündelik uygulamalara uyumludur; restricted güncel sıkılaştırma kurallarını (root olmayan, yetkisiz, seccomp) zorunlu kılar."
  - id: container-008-s2
    soru: "Pod Security Admission'da `enforce`, `audit` ve `warn` modları ne yapar?"
    cevap: "`enforce` kurala uymayan pod'u reddeder; `audit` ihlali denetim günlüğüne yazar; `warn` kullanıcıya uyarı gösterir ama pod'u kabul eder. Geçiş sırasında önce `warn`/`audit`, sonra `enforce` kullanmak güvenli yoldur."
  - id: container-008-s3
    soru: "Restricted profilde `allowPrivilegeEscalation: false` ve `capabilities.drop: [ALL]` neden istenir?"
    cevap: "İlki süreçlerin sonradan yetki yükseltmesini (setuid vb.) engeller, ikincisi gereksiz Linux yetkilerini sıfırlar. İkisi saldırganın container içinde elde edebileceği gücü azaltır."
  - id: container-008-s4
    soru: "Pod Security Standards tek başına neyi çözmez?"
    cevap: "Pod'un çalışma anında ne yaptığını izlemez, imajdaki zafiyetleri taramaz, ağ erişimini sınırlamaz. Yalnız pod tanımının güvenli ayarları taşıyıp taşımadığını kontrol eder; diğer katmanlarla (RBAC, NetworkPolicy, tarama) birlikte düşünülmelidir."
derinDalis:
  - tur: okuma
    baslik: "Kubernetes: Pod Security Standards"
    ayrinti: "Üç profilin ve her birinin kısıtlamalarının tam listesi."
    url: "https://kubernetes.io/docs/concepts/security/pod-security-standards/"
  - tur: okuma
    baslik: "Kubernetes: Pod Security Admission"
    ayrinti: "İsim alanı etiketleriyle profillerin zorunlu kılınması."
    url: "https://kubernetes.io/docs/concepts/security/pod-security-admission/"
  - tur: okuma
    baslik: "Kubernetes: securityContext yapılandırması"
    ayrinti: "Pod ve container düzeyinde güvenlik ayarlarının nasıl yazıldığı."
    url: "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/"
---

container-001'de tek bir container'ı sıkılaştırmayı öğrendin. Kümede yüzlerce pod'u tek tek denetlemek mümkün değildir; **Pod Security Standards** (Pod Güvenlik Standartları) bu denetimi küme otomatik yapsın diye vardır. Kubernetes üç **profil** tanımlar.

### Üç profil

| Profil | Anlamı | Ne zaman |
|---|---|---|
| Privileged | Hiçbir kısıtlama yok | Yalnız güvenilir sistem bileşenleri (ağ eklentisi, depolama sürücüsü) |
| Baseline | Bilinen yetki yükseltme yollarını engeller | Çoğu gündelik uygulama için asgari düzey |
| Restricted | Sıkılaştırma en iyi uygulamalarını zorunlu kılar | Yeni, güvenliğe duyarlı uygulamalar |

Profiller birikimlidir: restricted, baseline'ın üstüne ek kurallar koyar.

### Baseline neyi yasaklar

Birkaç örnek: `privileged: true` container'lar, konağın ağ ya da süreç alanını paylaşmak (`hostNetwork`, `hostPID`), konak dizinlerini (`hostPath`) bağlamak, tehlikeli Linux yetkileri eklemek. Yani izolasyonu doğrudan delen ayarlar.

### Restricted ek olarak ne ister

- Container root olarak çalışmayacak: `runAsNonRoot: true` ve `runAsUser` 0 olmayacak.
- `allowPrivilegeEscalation: false`.
- Linux yetkileri `drop: [ALL]` ile bırakılacak (yalnız çok sınırlı ekleme serbest).
- `seccompProfile` `RuntimeDefault` ya da `Localhost` olacak.
- Hacim türleri sınırlı olacak.

Bunlar container-001'de elle verdiğin bayrakların Kubernetes'teki karşılığıdır.

### Nasıl uygulanır: Pod Security Admission

Kubernetes'in yerleşik **Pod Security Admission** denetleyicisi, **isim alanı etiketleriyle** çalışır:

```
kubectl label namespace uygulamam pod-security.kubernetes.io/enforce=restricted
```

Üç mod vardır:

- **enforce**: Kurala uymayan pod'u reddeder.
- **audit**: İhlali denetim günlüğüne yazar, pod'u kabul eder.
- **warn**: Kullanıcıya uyarı gösterir, pod'u kabul eder.

Mevcut bir kümeye geçerken önce `warn` ve `audit` ile bakıp neyin bozulacağını görürsün, sonra `enforce` açarsın.

### securityContext

Kuralları sağlamak için pod ve container tanımına `securityContext` yazarsın. Görevdeki `iyi` pod'u bunun asgari örneğidir: root olmayan uid, `seccomp` profili, yetki yükseltme kapalı, bütün yetkiler düşürülmüş.

### Sınırları

Pod Security yalnız **pod tanımına** bakar. İmaj zafiyet taramasından geçmiş mi, ağ trafiği kısıtlı mı, çalışırken şüpheli davranış var mı sorularına cevap vermez. Daha ince kurallar (ör. 'yalnız şu kayıt defterindeki imajlar') için sonraki ders olan Policy-as-code araçları gerekir.

Güvenlik notu: Sistem isim alanlarını (kube-system gibi) `restricted` yapmak ağ eklentisi gibi bileşenleri bozabilir; profili isim alanı bazında düşün ve önce `warn` ile dene.
