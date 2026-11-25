---
donem: 7
baslik: "Container, Kubernetes ve IaC bölgesi sınavı"
sorular:
  - soru: "Bir Dockerfile incelerken hiç `USER` satırı olmadığını görüyorsun. Bu imajdan başlayan container hangi kullanıcıyla çalışır ve ne yaparsın?"
    secenekler: ["Root (uid 0) ile çalışır; root olmayan bir kullanıcı oluşturup `USER` ile geçmeni istersin","Otomatik olarak yetkisiz bir kullanıcıyla çalışır; bir şey yapmana gerek yok","Kubernetes çalıştırırken rastgele bir kullanıcı atar","Kullanıcı olmadan çalışır, bu yüzden risk yoktur"]
    dogru: 0
    aciklama: "USER belirtilmezse süreç root olarak başlar. Uygulamadaki bir açık sömürülürse saldırgan container içinde tam yetki kazanır. Root olmayan kullanıcıya geçmek en temel sıkılaştırmadır. Kubernetes kendiliğinden kullanıcı atamaz; bunu securityContext ya da Pod Security ile zorunlu kılmak gerekir."
  - soru: "`docker run --read-only` ile başlattığın uygulama `/tmp` altına geçici dosya yazamadığı için çöküyor. En güvenli düzeltme hangisi?"
    secenekler: ["`--read-only` bayrağını kaldırmak","Container'ı `--privileged` çalıştırmak","Yalnız `/tmp` için `--tmpfs /tmp` eklemek","Konaktaki `/` dizinini container'a bağlamak"]
    dogru: 2
    aciklama: "Salt okunur kök dosya sistemini koruyup yalnız gereken yola bellekte yazılabilir alan (tmpfs) eklemek, saldırganın kalıcı dosya bırakmasını yine zorlaştırır. Bayrağı kaldırmak ya da privileged/konak bağlamak korumayı ortadan kaldırır."
  - soru: "Bir container'da `ps` komutu yalnız birkaç süreç gösteriyor, konakta ise yüzlerce süreç var. Bu görünümü hangi çekirdek özelliği sağlar?"
    secenekler: ["cgroup bellek sınırı","PID namespace'i","seccomp profili","Docker imaj katmanları"]
    dogru: 1
    aciklama: "PID namespace'i container'a kendi süreç numarası alanını verir. cgroup kaynak miktarını sınırlar, neyi göreceğini değil. seccomp sistem çağrılarını filtreler. İmaj katmanları dosya içeriğiyle ilgilidir."
  - soru: "Bir ekip container'a hiç bellek sınırı koymadı. Hatalı bir uygulama belleği tüketince diğer iş yükleri de çöktü. Eksik olan mekanizma hangisi?"
    secenekler: ["Namespace izolasyonu","Salt okunur dosya sistemi","Kullanıcı namespace'i","cgroup kaynak sınırı"]
    dogru: 3
    aciklama: "Cgroup, bir süreç grubunun kullanabileceği bellek, işlemci ve süreç sayısı gibi kaynaklara tavan koyar. Namespace neyi gördüğünü sınırlar ama kaynak tüketimini sınırlamaz."
  - soru: "Bir saldırgan Kubernetes kümesinin `etcd` veritabanına doğrudan eriştiğini varsayalım. Neden bu en kritik sızıntılardandır?"
    secenekler: ["etcd yalnız log tutar, önemsizdir","etcd yalnız imajları saklar","etcd kümenin bütün durumunu ve (şifrelenmemişse) Secret'ları tutar","etcd düğümlerin işlemci sayısını tutar"]
    dogru: 2
    aciklama: "etcd nesne tanımlarını, yapılandırmaları ve Secret'ları saklar. Varsayılan olarak Secret'lar şifrelenmeden yazılır; erişen kişi sırları okur ve nesneleri değiştirirse kümeyi ele geçirebilir."
  - soru: "`kubectl delete pod web-abc12` komutunu bir Deployment'ın pod'una uyguladın. Birkaç saniye sonra yeni bir pod görüyorsun. Neden?"
    secenekler: ["Deployment istenen kopya sayısını korur ve eksik pod'un yerine yenisini açar","kubectl hata verdi ve silmedi","Service yeni pod'u oluşturur","Düğümdeki kubelet pod'u geri yükler"]
    dogru: 0
    aciklama: "Deployment (ReplicaSet üzerinden) istenen durumla gerçek durumu karşılaştırır; eksik kopyayı yeniden oluşturur. Service yalnız trafiği yönlendirir; pod üretmez."
  - soru: "Bir Service `type: NodePort` olarak tanımlanmış. Güvenlik gözüyle ilk akla gelen soru ne olmalı?"
    secenekler: ["Pod sayısı yeterli mi?","İmaj etiketi sabit mi?","Servis adı Türkçe karakter içeriyor mu?","Bu servis düğümlerin portu üzerinden kümenin dışına açılıyor; gerçekten gerekli mi ve korunuyor mu?"]
    dogru: 3
    aciklama: "NodePort ve LoadBalancer türleri servisi küme dışına açar. Dışarı açılan her servis bilinçli, gerekçeli ve korunmuş (ağ politikası, kimlik doğrulama) olmalıdır. ClusterIP yalnız küme içidir."
  - soru: "Bir CI hizmet hesabına `cluster-admin` bağlanmış. Hesabın anahtarı sızarsa ne olur ve en iyi düzeltme nedir?"
    secenekler: ["Yalnız CI etkilenir; düzeltmeye gerek yok","Saldırgan kümede her şeyi yapabilir; hesabı yalnız gereken kaynak ve fiillerle sınırlı bir Role'e bağlamak gerekir","Kubernetes yetkiyi otomatik daraltır","Kimlik doğrulama (authentication) yetkilendirmeyi iptal eder"]
    dogru: 1
    aciklama: "cluster-admin her kaynakta her işlemi yapma yetkisidir. En az yetki ilkesine göre, CI'ın gerçekten yaptığı işlemler (ör. belirli bir isim alanında deployments için get/update) tek tek yazılmalıdır."
  - soru: "RBAC hakkında hangisi doğrudur?"
    secenekler: ["Yasaklama (deny) kuralı yazılabilir","Kural yoksa varsayılan olarak erişim izinlidir","Yalnız izin verilir; kural yoksa erişim yoktur","RBAC yalnız pod ağını kontrol eder"]
    dogru: 2
    aciklama: "RBAC yalnız izin verir (additive); yasaklama kuralı yoktur ve kural olmayan erişim reddedilir. Ağ trafiğini ise NetworkPolicy kontrol eder."
  - soru: "Bir isim alanına hiç NetworkPolicy uygulanmamış. İki pod arasındaki bağlantı için ne söylenebilir?"
    secenekler: ["Pod'lar izole değildir; bağlantılara izin verilir","Hepsi varsayılan olarak reddedilir","Yalnız aynı düğümdeki pod'lar konuşabilir","Yalnız Service üzerinden konuşabilirler"]
    dogru: 0
    aciklama: "Pod'u seçen politika yoksa pod gelen ve giden yönde izole değildir ve her bağlantıya izin verilir. Bu yüzden 'varsayılan reddet' politikası güvenli başlangıçtır."
  - soru: "Bir NetworkPolicy yazıp uyguladın, ama beklenen bağlantılar hâlâ açık. En olası sebep hangisi?"
    secenekler: ["Pod'un etiketi yok","Politika dosyası çok kısa","Service türü ClusterIP","Kümenin ağ eklentisi (CNI) NetworkPolicy'yi uygulamıyor"]
    dogru: 3
    aciklama: "NetworkPolicy'yi ağ eklentisi uygular. Desteklemeyen bir eklentiyle nesne oluşur ama etkisizdir. Bu yüzden politikayı bir test pod'uyla doğrulamak gerekir."
  - soru: "Bir Git deposunda `data: { parola: R2l6bGkxMjM= }` yazan bir Secret YAML'ı buldun. Doğru değerlendirme hangisi?"
    secenekler: ["Güvenli: değer base64 ile şifrelenmiş","Güvenli değil: base64 kodlamadır, `base64 -d` ile açılır; parola sızmış sayılıp değiştirilmeli","Güvenli: Secret nesneleri otomatik şifreler","Yalnız ConfigMap'te risk vardır"]
    dogru: 1
    aciklama: "Base64 şifreleme değildir; anahtarı yoktur ve tek komutla geri çevrilir. Depoya giren sır sızmış kabul edilir: değiştirilir, geçmişten temizlenir ve harici sır yöneticisi ya da şifreli sır yöntemine geçilir."
  - soru: "Bir isim alanında `pod-security.kubernetes.io/enforce=restricted` etiketi var. Kullanıcı `privileged: true` olan bir pod oluşturmaya çalışıyor. Ne olur?"
    secenekler: ["Pod kabul edilir, uyarı gösterilir","Pod kabul edilir ama root olmayan kullanıcıya çevrilir","Pod reddedilir","Etiket yalnız audit kaydı tutar"]
    dogru: 2
    aciklama: "enforce modu kurala uymayan pod'u reddeder. warn yalnız uyarır, audit yalnız günlüğe yazar. Privileged ayar hem baseline hem restricted tarafından yasaktır."
  - soru: "Mevcut ve kritik uygulamaların çalıştığı bir kümede Pod Security profilini ilk kez açıyorsun. En güvenli geçiş yolu hangisi?"
    secenekler: ["Doğrudan `enforce=restricted` açmak","Hiç açmamak","Önce kube-system'i restricted yapmak","Önce `warn` ve `audit` ile bakıp ihlalleri düzeltmek, sonra `enforce` açmak"]
    dogru: 3
    aciklama: "warn ve audit mevcut iş yüklerini bozmadan neyin kurala uymadığını gösterir. Düzeltmelerden sonra enforce açılınca kesinti riski azalır."
  - soru: "`terraform plan` çıktısında bir veri tabanı kaynağı için `-/+` (sil ve yeniden oluştur) işareti var. Ne yaparsın?"
    secenekler: ["Verinin kaybolup kaybolmayacağını inceler, gerekirse yedek alır ve değişikliği bilinçli onaylarsın","Doğrudan `apply -auto-approve` ile uygularsın","Planı yok sayıp state'i silersin","`destroy` komutuyla her şeyi silersin"]
    dogru: 0
    aciklama: "Silip yeniden oluşturma veri kaybı ve kesinti demek olabilir. Plan'ın amacı bunu uygulamadan önce göstermesidir; insan onayı güvenlik adımıdır."
  - soru: "Terraform değişkeninde `sensitive = true` yazdın. Bu, değerin state dosyasında nasıl saklanacağını nasıl etkiler?"
    secenekler: ["State'te şifreli saklanır","Yalnız çıktılarda ve planda gizlenir; state'te düz metin kalabilir","State'e hiç yazılmaz","Yalnız uzak backend'de gizlenir"]
    dogru: 1
    aciklama: "sensitive bir görüntüleme ayarıdır. State dosyası sır değerlerini düz metin içerebilir; bu yüzden state'in kendisi uzak, şifreli ve erişimi kısıtlı bir backend'de korunmalı, Git'e girmemelidir."
  - soru: "Bir çekme isteğinde Checkov, `0.0.0.0/0` kaynağına açık SSH portu bulgusu verdi. Doğru tepki hangisi?"
    secenekler: ["Bulguyu sessizce bastırmak","Aracı CI'dan kaldırmak","Erişimi bilinen yönetici IP aralığıyla sınırlayıp taramayı yeniden çalıştırmak","Portu 2222'ye çevirmek"]
    dogru: 2
    aciklama: "Bulgu gerçek bir risktir: SSH'ın tüm internete açık olması kaba kuvvet saldırılarına kapı açar. Düzeltip taramayı tekrarlayarak bulgunun kalktığını doğrularsın. Sessiz bastırma ya da port değiştirmek asıl sorunu çözmez."
  - soru: "Kyverno politikasını yeni yazdın ve üretim kümesine uygulamak istiyorsun. En güvenli ilk adım hangisi?"
    secenekler: ["Önce `Audit` modunda çalıştırıp ihlalleri görmek, sonra `Enforce`'a geçmek","Hemen `Enforce` modunda açmak","Politikayı yalnız belgeye yazmak","Yönetici hesaplarını tüm politikalardan muaf yapmak"]
    dogru: 0
    aciklama: "Audit modu mevcut iş yüklerini kesmeden ihlalleri raporlar. Düzeltmelerden sonra Enforce'a geçmek kesinti riskini azaltır. Geniş muafiyetler kuralı fiilen etkisiz kılar."
---
