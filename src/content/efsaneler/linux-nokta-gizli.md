---
iddia: "Adı noktayla başlayan (gizli) bir dosyayı kimse göremez, bu yüzden güvenlidir."
hukum: yanlis
ozet: "Nokta ile başlayan dosyalar yalnızca `ls` tarafından varsayılan olarak listelenmez. `ls -a` hepsini gösterir; gizli olmak erişimi engellemez."
analoji: "Kitaplığın en alt rafına konan kitap gibi: gözün önünde değildir ama eğilen herkes bulur. Kilitli dolap olmadan saklanmış sayılmaz."
kaynaklar:
  - { ad: "man7.org: ls kılavuz sayfası", url: "https://man7.org/linux/man-pages/man1/ls.1.html" }
ilgiliDers: linux-002
tarih: "2026-11-25"
---

`ls` komutunun kılavuz sayfasında `-a` (`--all`) seçeneği, adı noktayla başlayan girdileri **yok saymamak** olarak tanımlanır. Yani `ls` bu dosyaları varsayılan olarak yalnızca listeden çıkarır; dosyalar diskte durur, açılabilir ve okunabilir.

Noktalı dosyalar geleneksel olarak kullanıcı ayarları (ör. `.bashrc`) içindir ve dizin listesini kalabalık etmesin diye gizlenir. Bu bir **kolaylık**, güvenlik önlemi değil. Bir dosyayı koruyan şey adı değil, **izinleridir** (006. ders).

Saldırganlar da bu alışkanlığı bilir: bir sistemde bırakılan kötü niyetli dosyalar sıklıkla noktalı adlarla saklanır. Bu yüzden bir sistemi incelerken `ls -a` ve `find` kullanmak gerekir. Bir dosyayı gerçekten korumak için doğru izni (`chmod 600`) ve gerekiyorsa şifrelemeyi kullan.
