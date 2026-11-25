---
iddia: "Bir imaj etiketi (ör. python:3.12) her zaman aynı imajı gösterir."
hukum: yanlis
ozet: "Docker belgelerine göre imaj etiketleri değişkendir: yayıncı bir etiketi yeni bir imaja kaydırabilir. Aynı imajı garanti eden şey digest ile sabitlemedir."
analoji: "Raftaki 'Yeni baskı' yazısı gibi: yarın aynı yazının altında başka bir kitap durabilir. ISBN ise kitabın kendisini tanımlar."
kaynaklar:
  - { ad: "Docker Docs: Build best practices", url: "https://docs.docker.com/build/building/best-practices/" }
ilgiliDers: devops-010
tarih: "2026-11-25"
---

Docker'ın en iyi uygulamalar sayfası şunu söyler: imaj etiketleri değişkendir, yani bir yayıncı etiketi yeni bir imaja işaret ettirebilir. Aynı sayfa, etikete dayalı build'lerde her seferinde aynı imajı alacağının garanti edilmediğini de belirtir.

Bu yüzden iddia yanlıştır. Bugün `python:3.12` ile aldığın imaj, aylar sonra güvenlik yamalarıyla güncellenmiş başka bir imaj olabilir. Bu bazen iyidir, çünkü yamayı otomatik alırsın; bazen de beklenmedik bir davranış değişikliğidir.

Belgeye göre tedarik zinciri bütünlüğünü sağlamak için imajı belirli bir digest'e sabitleyebilirsin. Bedeli de yazılıdır: sabitleyince otomatik güvenlik düzeltmelerini kendin takip etmek zorunda kalırsın. Docker, bunun için Dependabot gibi araçlarla etiket ve digest güncellemelerini PR olarak almayı önerir.

Pratik öneriler:

- Üretimde `latest` yerine sürüm etiketi, daha sıkı kontrol için digest kullan.
- Digest'i güncel tutacak bir otomasyon kur.
- Resmi ya da doğrulanmış yayıncıların imajlarını tercih et.
