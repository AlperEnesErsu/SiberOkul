---
iddia: "sudo komutu root'un parolasını sorar."
hukum: yanlis
ozet: "sudo varsayılan olarak komutu çalıştıran kullanıcının kendi parolasını ister; root parolası paylaşılmaz."
analoji: "Otel görevlisi ana anahtarı sana vermez; kimliğini doğrular, kapıyı senin için açar ve deftere yazar."
kaynaklar:
  - { ad: "Sudo kılavuzu: sudoers(5)", url: "https://www.sudo.ws/docs/man/sudoers.man/" }
ilgiliDers: linux-007
tarih: "2026-11-25"
---

Sudoers kılavuzuna göre sudo, çağıran kullanıcının kimlik bilgilerini doğrular, hedef kullanıcınınkini değil. `rootpw`, `targetpw` ve `runaspw` seçenekleri varsayılan olarak kapalıdır; yani başka bir hesabın parolasını sordurmak için özel olarak açılmaları gerekir.

Bu tasarımın bir sebebi var: root parolası kimseyle paylaşılmaz. Kullanıcı kendi parolasıyla kimliğini kanıtlar, `sudoers` kuralları da hangi komutları çalıştırabileceğini belirler. Böylece her yetkili komut bir kişiye bağlanır ve kayıt bırakır.

Bu yüzden Ubuntu'da root parolasını bilmeden de yönetici işi yapabilirsin; zaten root hesabı varsayılan olarak doğrudan oturum açmaya kapalıdır. Karışıklık, `su` komutunun hedef kullanıcının parolasını istemesinden gelir.
