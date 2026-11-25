---
kimlik: container-012
baslik: "Policy-as-code"
donem: 7
sira: 12
sure: 35
neden: "Kuralların kâğıtta ('latest etiketi kullanma') kalması yetmez; makine tarafından denetlenmesi gerekir. Policy-as-code, güvenlik kurallarını koda dökerek her dağıtımda otomatik uygular. DevSecOps'ta en çok kullanılan iki araç Kyverno ve OPA'dır."
analoji:
  baslik: "Otomatik turnike"
  metin: "Kural bir levhaya yazılıdır: 'bilet olmadan geçilmez'. Herkes uymaya çalışır, ama biri unutur. Policy-as-code, levhayı turnikeye çevirmektir: bilet yoksa kapı açılmaz. Sınırı: turnike yalnız bilet var mı diye bakar; biletin sahte olup olmadığını (imaj içeriğinin güvenli olup olmadığını) başka bir sistem denetler."
gorev:
  aciklama: "Kyverno komut satırı aracı (CLI) kurulu olmalı; kurulum için https://kyverno.io/docs/introduction/ sayfasına bak. Aşağıda kümeye hiçbir şey kurmadan, yalnız yerel dosyalar üzerinde politika testi yapılır; ücretsizdir. Çıktı biçimi sürüme göre biraz değişebilir."
  komutlar:
    - mkdir -p /tmp/kyverno-deneme && cd /tmp/kyverno-deneme
    - |
      cat > politika.yaml <<'EOF'
      apiVersion: kyverno.io/v1
      kind: ClusterPolicy
      metadata:
        name: latest-etiketi-yasak
      spec:
        validationFailureAction: Enforce
        rules:
          - name: sabit-etiket
            match:
              any:
                - resources:
                    kinds: ["Pod"]
            validate:
              message: "latest etiketi kullanilamaz, sabit surum yazin."
              pattern:
                spec:
                  containers:
                    - image: "!*:latest"
      EOF
    - |
      cat > pod.yaml <<'EOF'
      apiVersion: v1
      kind: Pod
      metadata:
        name: deneme
      spec:
        containers:
          - name: web
            image: nginx:latest
      EOF
    - kyverno apply politika.yaml --resource pod.yaml
    - sed -i 's/nginx:latest/nginx:1.27/' pod.yaml
    - kyverno apply politika.yaml --resource pod.yaml
  soru: "Birinci çalıştırmada pod neden politikayı geçemedi, ikincisinde ne değişti? Sonuç satırları ne diyor?"
  telefon:
    soru: "Bir politika 'imajlar yalnız bizim kayıt defterimizden gelsin' diyor. Bir geliştirici `docker.io/nginx` kullanan bir Deployment uyguluyor. Politika `Enforce` modunda. Ne olur?"
    cevap: "İstek API sunucusuna gelince admission denetleyicisi politikayı çalıştırır, imaj kuralı sağlanmadığı için isteği reddeder ve mesajı kullanıcıya gösterir. Nesne kümeye hiç girmez. `Audit` modunda ise kabul edilir ama ihlal rapora yazılır."
sorular:
  - id: container-012-s1
    soru: "Policy-as-code ne demektir ve klasik güvenlik belgesinden farkı nedir?"
    cevap: "Güvenlik kuralları makinece çalıştırılabilir kod olarak yazılır, Git'te sürümlenir ve her dağıtımda otomatik uygulanır. Belge ise insanın hatırlamasına bağlıdır; uygulanıp uygulanmadığı sürekli denetlenemez."
    ipucu: "Belge okunur; kod ise otomatik uygulanır."
  - id: container-012-s2
    soru: "Admission controller (kabul denetleyicisi) nedir ve policy motoru onu nasıl kullanır?"
    cevap: "API sunucusunda, nesne kaydedilmeden hemen önce çalışan denetim noktasıdır. Kyverno ve OPA Gatekeeper bu noktaya bağlanır; kurala uymayan isteği reddeder ya da değiştirir."
    ipucu: "İstek API sunucusuna girerken hangi katman araya girer?"
  - id: container-012-s3
    soru: "Kyverno ile OPA'nın yaklaşım farkı nedir?"
    cevap: "Kyverno Kubernetes'e özgüdür ve politikalar YAML ile yazılır; öğrenmesi kolaydır. OPA genel amaçlı bir motordur ve politikalar Rego dilindedir; Kubernetes dışında da (Terraform planı, API yetkilendirme) kullanılır, ama öğrenme eğrisi daha diktir."
    ipucu: "Biri YAML ile, diğeri ayrı bir dil ile politika yazar."
  - id: container-012-s4
    soru: "Yeni bir politikayı doğrudan `Enforce` modunda açmak neden riskli, nasıl daha güvenli açılır?"
    cevap: "Mevcut ya da kritik iş yükleri kurala uymuyorsa dağıtımlar kesilebilir. Önce `Audit` (yalnız raporla) modunda açıp ihlalleri görür, düzeltir, sonra `Enforce`'a geçersin."
    ipucu: "Önce raporla, sonra zorla: hangi mod ilk adım?"
  - id: container-012-s5
    soru: "Kyverno politikası 'etiket `owner` zorunlu' diyor ve `Enforce` açılınca dün çalışan bir CI dağıtımı reddedilmeye başladı. Ne yaparsın?"
    cevap: "Reddedilen nesnenin eksiğini (etiket) hızla düzeltirsin; acil ise politikayı geçici olarak `Audit`'e alırsın. Sonra ekibe duyurup CI şablonlarını günceller ve politikayı yeniden `Enforce` yaparsın."
    ipucu: "Politikayı bozmak yerine nesneyi düzelt; acil durumda moda dön."
hizliKontrol:
  - soru: "Admission controller ne zaman çalışır?"
    secenekler: ["Pod çalışırken sürekli","API sunucusu isteği etcd'ye yazmadan önce","Düğüm açılırken","İmaj build edilirken"]
    dogru: 1
    aciklama: "Kabul denetimi, kimlik doğrulama ve yetkilendirmeden sonra, nesne kalıcı olmadan önce çalışır."
    ipucu: "İstek yolunda etcd'den önceki adım."
sikHatalar:
  - hata: "Yeni politikayı doğrudan Enforce modunda açmak."
    dogrusu: "Önce Audit ile ihlalleri gör, düzelt, sonra Enforce'a geç."
  - hata: "Yöneticileri bütün politikalardan muaf tutmak."
    dogrusu: "Muafiyetleri dar ve gerekçeli tut; geniş istisna kuralı etkisiz bırakır."
sema:
  baslik: "Admission denetiminin yeri"
  adimlar:
    - etiket: "İstek"
      aciklama: "kubectl nesneyi API sunucusuna gönderir."
    - etiket: "Kimlik ve yetki"
      aciklama: "Kim olduğun ve izninin olup olmadığı denetlenir."
    - etiket: "Admission"
      aciklama: "Politika motoru (Kyverno/OPA) nesneyi kurallara göre inceler."
    - etiket: "Karar"
      aciklama: "Uygunsa devam, değilse Enforce modunda reddedilir (Audit'te yalnız kaydedilir)."
    - etiket: "etcd"
      aciklama: "Kabul edilen nesne kalıcı olarak yazılır."
terimler:
  - "Policy-as-code"
  - "Admission controller"
  - "Kyverno"
derinDalis:
  - tur: okuma
    baslik: "Kyverno: giriş"
    ayrinti: "Kyverno'nun ne olduğu, politika türleri (doğrula, değiştir, üret) ve nasıl çalıştığı."
    url: "https://kyverno.io/docs/introduction/"
  - tur: okuma
    baslik: "OPA: Kubernetes'e giriş"
    ayrinti: "Open Policy Agent ile admission denetimi ve Rego diline kısa bakış."
    url: "https://www.openpolicyagent.org/docs/latest/kubernetes-introduction/"
---

Önceki derslerde birçok kural gördün: root çalışma, `latest` etiketi kullanma, `privileged` pod yok, her Secret şifreli. Bu kuralları bir belgeye yazmak kolaydır; ama gerçek dünyada biri bir gün bunu unutur. **Policy-as-code** (kural olarak kod), kuralları makinenin çalıştırdığı koda çevirir.

### Fikir

Kuralı bir kez yazarsın. Sistem, her istekte ya da her çekme isteğinde otomatik değerlendirir:

- Uyuyorsa geçer.
- Uymuyorsa reddedilir (engeller) ya da yalnız raporlanır (denetler).

Kural Git'te durduğu için sürümlenir, incelenir ve herkese aynı şekilde uygulanır.

### Admission denetimi

Kubernetes'te her nesne API sunucusuna geldiğinde, kayda geçmeden önce **admission denetleyicilerinden** geçer. Policy motorları bu noktaya bağlanır. Kullanıcı `kubectl apply` yaptığında politikaya aykırı pod daha kümeye girmeden reddedilir ve nedeni ekranda yazar. Bu, bir **önleyici** (preventive) kontroldür: hatayı sonradan bulmak yerine oluşmasını engeller.

### İki yaygın araç

| Özellik | Kyverno | OPA / Gatekeeper |
|---|---|---|
| Dil | YAML (Kubernetes diline benzer) | Rego (ayrı bir dil) |
| Kapsam | Kubernetes odaklı | Genel amaçlı (Kubernetes, Terraform, API) |
| Yetenek | Doğrula, değiştir (mutate), kaynak üret | Ağırlıklı doğrulama |
| Öğrenme | Daha kolay | Daha dik |

Hangisini seçeceğin ekibe ve kullanım alanına bağlıdır. İkisi de aynı problemi çözer.

### Örnek bir kural

Görevdeki Kyverno politikası şunu der: Pod'larda imaj etiketi `latest` olamaz. `pattern` bloğu, pod'un şeklini tarif eder; `"!*:latest"` "latest ile biten hiçbir şey" demektir. Birinci denemede `nginx:latest` kural dışı kaldı, ikincisinde `nginx:1.27` geçti.

### Politika türleri

- **Doğrula** (validate): Kurala uymayanı reddet ya da raporla.
- **Değiştir** (mutate): Eksik ayarı otomatik ekle (ör. varsayılan `securityContext`).
- **Üret** (generate): Yeni isim alanı açıldığında otomatik NetworkPolicy oluştur.
- **İmaj doğrula**: İmajın imzasını denetle (pipeline-008'deki imzalamanın uygulama yeri).

### Güvenli devreye alma

1. Önce **Audit** modunda aç; ihlalleri listele.
2. Sahiplerle konuş, düzelt, gerekli istisnaları gerekçeyle tanımla.
3. Sonra **Enforce** moduna geç.
4. Politika değişikliklerini normal kod gibi çekme isteğiyle incele.

### Kodda da uygula

Aynı kurallar yalnız kümede değil, CI'da da çalışabilir: Kyverno CLI ile YAML'ı kümeye gitmeden test edersin (görevde yaptığın gibi), OPA ile de Terraform planını denetleyebilirsin. Böylece geri bildirim geliştiriciye en erken anda ulaşır.

### Sınırlar

Politika motoru senin yazdığın kuralı uygular; eksik kuralı bulmaz. Ayrıca motorun kendisi bir bileşendir: yanlış yapılandırılırsa hizmet kesintisine yol açar ya da atlatılabilir. Politikayı yazmak bir kez, sahiplenmek sürekli bir iştir.

Güvenlik notu: Politika istisnalarını (exception) ve yönetici hesaplarının politikalardan muaf tutulmasını sınırlı ve denetlenebilir tut; yaygın bir istisna, kuralın fiilen yok olması demektir.
