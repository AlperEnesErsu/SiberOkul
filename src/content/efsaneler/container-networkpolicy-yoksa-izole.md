---
iddia: "Farklı pod'lar varsayılan olarak birbirinden izoledir; NetworkPolicy yazmaya gerek yoktur."
hukum: yanlis
ozet: "Kubernetes dokümanına göre bir pod'u seçen hiçbir NetworkPolicy yoksa pod gelen ve giden yönde izole değildir: bütün bağlantılara izin verilir. İzolasyon için politika yazılması ve ağ eklentisinin bunu desteklemesi gerekir."
analoji: "Her dairenin kapısı açık bir apartman gibi: kapıcıya liste vermeden kimse kimseyi durdurmaz."
kaynaklar:
  - { ad: "Kubernetes: Ağ politikaları", url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/" }
ilgiliDers: container-006
tarih: "2026-11-25"
---

Kubernetes ağı varsayılan olarak düzdür: her pod, kümedeki diğer pod'larla konuşabilir. Kubernetes dokümanı bunu "izole olmayan pod" kavramıyla anlatır: bir pod'u seçen hiçbir NetworkPolicy yoksa, o yönde (gelen ya da giden) tüm bağlantılara izin verilir.

Bu yüzden ele geçirilmiş tek bir pod, kümedeki veri tabanına ya da iç API'lere doğrudan bağlanmayı deneyebilir. Buna yanal hareket denir.

İzolasyon için:

- Bir pod'u seçen en az bir NetworkPolicy yazılmalıdır; o zaman pod yalnız politikalarda izin verilen bağlantıları kabul eder.
- İyi bir başlangıç, isim alanına "hepsini reddet" politikası koyup gerekli bağlantıları tek tek açmaktır.
- Politikayı **ağ eklentisi** (CNI) uygular. Eklenti desteklemiyorsa, NetworkPolicy nesnesi oluşturulur ama hiçbir etkisi olmaz.

Namespace ayırmak da tek başına izolasyon sağlamaz; isim alanları arasında da varsayılan olarak trafik serbesttir. Politikayı yazdıktan sonra bir test pod'uyla gerçekten engellendiğini doğrula.
