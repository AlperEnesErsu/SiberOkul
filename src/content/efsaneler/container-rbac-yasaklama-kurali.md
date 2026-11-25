---
iddia: "Kubernetes RBAC'ta bir kullanıcıya özel yasaklama (deny) kuralı yazabilirsin."
hukum: yanlis
ozet: "Kubernetes dokümanı RBAC izinlerinin tamamen toplayıcı (additive) olduğunu, yani 'deny' kuralı bulunmadığını söyler. Erişim ancak bir kuralla açıkça verilmişse vardır; kısıtlamak için verilen izinleri daraltırsın."
analoji: "Kapıda yalnız 'giriş listesi' olan bir bina gibi: listede adın yoksa giremezsin ama 'bu kişi girmesin' diye ayrı bir liste yoktur; yetkiyi listeden çıkararak kısarsın."
kaynaklar:
  - { ad: "Kubernetes: RBAC yetkilendirmesi", url: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/" }
ilgiliDers: container-005
tarih: "2026-11-25"
---

Neden önemli: Bir kullanıcı birden çok Role ve ClusterRole'e bağlı olabilir ve bütün izinleri **birleşir**. Birine verilen geniş bir izni başka bir kural ile geri alamazsın.

Pratik sonuçlar:

- Kısıtlamak için geniş rolü (ör. `cluster-admin`) bağlamayı bırakıp gerekli fiil ve kaynaklardan oluşan dar bir rol yazarsın.
- `kubectl auth can-i --list --as=<kullanıcı>` ile bir hesabın toplam yetkisini görürsün.
- 'Şu işlemi yasaklayalım' ihtiyacı için RBAC değil, kabul denetimi (Kyverno/OPA gibi policy-as-code) kullanılır.

Kural: en az yetkiyle başla, gerektikçe ekle.
