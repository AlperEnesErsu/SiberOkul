---
iddia: "Container içinde root olmak zararsızdır, çünkü container izoledir."
hukum: yanlis
ozet: "Docker dokümanı, container içindeki bir uygulamanın yetkisiz kullanıcıyla çalıştırılmasını ayrıcalık yükseltme saldırılarına karşı en iyi yöntem olarak anar. Container izolasyonu aynı çekirdeği paylaşır; yapılandırma hatası ya da çekirdek açığı root'u tehlikeli yapar."
analoji: "Kiralık depoda yönetici anahtarıyla dolaşmak gibi: duvarlar sağlam olduğu sürece sorun yok, ama duvarda çatlak varsa yönetici anahtarı kapıları açar."
kaynaklar:
  - { ad: "Docker: userns-remap (kullanıcı namespace eşlemesi)", url: "https://docs.docker.com/engine/security/userns-remap/" }
  - { ad: "Docker: Dockerfile en iyi uygulamalar (USER)", url: "https://docs.docker.com/build/building/best-practices/" }
ilgiliDers: container-001
tarih: "2026-11-25"
---

Container'ın izole olduğu doğrudur, ama izolasyon mutlak değildir. Container'lar konağın çekirdeğini paylaşır; sınır, çekirdeğin namespace, cgroup ve yetki mekanizmalarıyla çizilir.

Docker dokümanı bunu şöyle özetler: container içinden gelen ayrıcalık yükseltme saldırılarını önlemenin en iyi yolu, uygulamaları yetkisiz kullanıcılarla çalıştırmaktır. Root olarak çalışması şart olan süreçler için de root'u konakta daha az yetkili bir kullanıcıya eşlemek (user namespace remap) önerilir. Yani Docker'ın kendisi, container içinde root'un risk olduğunu varsayar.

Neden risk artar:

- `--privileged`, konak dizini ya da Docker soketi bağlamak gibi yapılandırmalarda root, konağa doğrudan erişim anlamına gelebilir.
- Çekirdek ya da çalıştırma ortamı açıklarında root olan süreç, kaçış (container escape) için daha uygun konumdadır.
- Root, container içinde paket kurabilir, dosyaları değiştirebilir, ağı dinleyebilir.

Çözüm ucuzdur: Dockerfile'a `USER` satırı ekle, gereksiz yetkileri düşür, salt okunur dosya sistemi kullan. Kubernetes'te `runAsNonRoot` ve Pod Security `restricted` profili bunu zorunlu kılar.
