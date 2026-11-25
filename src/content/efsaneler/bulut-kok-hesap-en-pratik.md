---
iddia: "Bulut hesabında en pratik yol, her işi kök (root) hesapla yapmaktır."
hukum: yanlis
ozet: "AWS, kök kullanıcıyı yalnız onu gerektiren görevler dışında kullanmamayı şiddetle önerir; günlük işler için yönetici bir kimlik oluşturulmalı, köke MFA konmalı ve kök için erişim anahtarı oluşturulmamalıdır."
analoji: "Bina sahibinin ana anahtarı kasada durur; kapıcı her gün onu taşırsa kaybolma riski her gün vardır."
kaynaklar:
  - { ad: "AWS IAM: Kök kullanıcı için en iyi uygulamalar", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html" }
ilgiliDers: bulut-002
tarih: "2026-11-25"
---

Hesabı ilk açtığında kök kullanıcı hazır gelir, her şeyi yapabilir ve ayrıca bir kurulum gerektirmez. Bu yüzden pratik görünür. Ama AWS'nin kök kullanıcı rehberi açık konuşur: kök kullanıcıya, onu gerektiren görevler dışında erişmemeyi şiddetle önerir.

Önerilenler: günlük işler için ayrı bir yönetici kimliği oluşturmak; kök için güçlü ve benzersiz bir parola ve MFA kullanmak (AWS artık kök için MFA'yı gerektiriyor); kök için erişim anahtarı oluşturmamak, çünkü kök hesap faturalama dahil her şeye tam erişim sağlar; kök kullanımını izleyip alarm kurmak.

Neden önemli: kök kısıtlanamaz. Kök kimlik bilgisi çalınırsa saldırganı durduracak bir izin sınırı yoktur. Dar yetkili bir kimliğin çalınması ise zararı o kimliğin izinleriyle sınırlar.

Rehber ayrıca insanlar için geçici kimlik bilgilerinin (roller, IAM Identity Center) tercih edilmesini söyler. Bu, uzun ömürlü parola ve anahtarların yönetim yükünü ve sızma riskini azaltır.

Hüküm: kök hesabı kullanmak pratik değil, riskli. Pratik olan, bir kez doğru kurulum yapıp kökü kilitli tutmaktır.
