---
iddia: "Kubernetes Secret nesnesi şifrelenmiş bir sırdır."
hukum: yanlis
ozet: "Kubernetes dokümanına göre Secret değerleri base64 ile kodlanır ve varsayılan olarak şifrelenmeden saklanır; base64 bir şifreleme yöntemi değildir. Şifreleme için etcd'de encryption at rest ayrıca yapılandırılmalıdır."
analoji: "Yapışkanı olmayan bir zarf gibi: kapağı kapalı görünür ama açmak için anahtar gerekmez. Gerçek koruma zarfı kasaya koymaktır."
kaynaklar:
  - { ad: "Kubernetes: Secret'lar için iyi uygulamalar", url: "https://kubernetes.io/docs/concepts/security/secrets-good-practices/" }
  - { ad: "Kubernetes: Secrets", url: "https://kubernetes.io/docs/concepts/configuration/secret/" }
ilgiliDers: container-007
tarih: "2026-11-25"
---

İsim yanıltıcıdır. Bir Secret YAML'ında `parola: R2l6bGkxMjM=` gibi bir değer görünce "şifrelenmiş" sanmak kolaydır. Oysa bu base64 kodlamasıdır: anahtarsız, tek komutla (`base64 -d`) geri çevrilir. Kubernetes'in kendi dokümanı da değerlerin base64 ile kodlandığını, varsayılan olarak şifresiz saklandığını ve base64'ün gizlilik sağlamadığını söyler.

Bundan üç sonuç çıkar:

- Secret YAML'ını Git'e koymak, parolayı düz metin koymakla aynıdır.
- Kümenin veri deposuna (etcd) erişen biri sırları okuyabilir; bunu önlemek için etcd'de **encryption at rest** (bekleyen veriyi şifreleme) ayrıca açılmalıdır.
- `secrets` kaynağında `get` ya da `list` yetkisi, sırrı okuma yetkisidir; RBAC ile dar tutulmalıdır.

Daha güçlü çözümler: harici sır yöneticileri ya da sırrı depoya şifreli koyan araçlar.

Secret'ın faydası boşa değil: ConfigMap'ten ayrı yetkilendirilebilir ve Kubernetes onu özenle ele alır. Ama "Secret = şifreli" düşüncesi, sırrın korunmuş olduğuna dair yanlış bir güven yaratır. Ders: kodlama ile şifrelemeyi karıştırma.
