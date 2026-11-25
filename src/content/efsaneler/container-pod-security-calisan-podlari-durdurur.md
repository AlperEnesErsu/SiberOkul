---
iddia: "İsim alanına `enforce` Pod Security etiketi koymak, kurala uymayan çalışan pod'ları hemen durdurur."
hukum: yanlis
ozet: "Kubernetes dokümanına göre enforce etiketi eklenince mevcut pod'lar yeni politikaya karşı test edilir ve ihlaller kullanıcıya uyarı olarak döner; pod'lar silinmez. Kural pod oluşturulurken ya da güncellenirken uygulanır."
analoji: "Otoparka yeni bir yükseklik sınırı koymak gibi: içerideki araçlar çıkarılmaz ama yeni gelenler sınırı geçemez."
kaynaklar:
  - { ad: "Kubernetes: Ad alanı etiketleriyle Pod Security Standards uygulamak", url: "https://kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/" }
  - { ad: "Kubernetes: Pod Security Admission", url: "https://kubernetes.io/docs/concepts/security/pod-security-admission/" }
ilgiliDers: container-008
tarih: "2026-11-25"
---

Tuzak şu: kuralı koyduktan sonra eski pod'ların hâlâ ihlalli olabileceğini unutmak kolaydır.

Güvenli geçiş:

- Önce `--dry-run=server` ile etiketin mevcut pod'lara etkisini gör; dokümandaki önerilen yöntemdir.
- `warn` ve `audit` modlarıyla ihlalleri topla ve düzelt.
- Sonra `enforce` aç. Bundan sonra ihlalli yeni pod'lar reddedilir.
- Eski iş yüklerini yeniden dağıtınca (rollout) yeni pod'lar kurala karşı denetlenir.

Yani enforce yeni girişleri korur; mevcut durumu temizlemek senin işindir.
