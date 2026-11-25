---
iddia: "Linux'ta parolalar herkesin okuyabildiği /etc/passwd dosyasında saklanır."
hukum: yanlis
ozet: "Modern Linux'ta `/etc/passwd` herkese okunur ama parola alanında yalnız `x` vardır; parola özetleri yalnız root'un okuyabildiği `/etc/shadow` dosyasındadır."
analoji: "Apartman zilindeki isim listesi herkese açıktır ama kapı anahtarları yönetici odasındaki kilitli dolaptadır."
kaynaklar:
  - { ad: "Linux man-pages: passwd(5)", url: "https://man7.org/linux/man-pages/man5/passwd.5.html" }
ilgiliDers: linux-005
tarih: "2026-11-25"
---

Eskiden parola özetleri gerçekten `/etc/passwd` içinde dururdu. Bu dosya kullanıcı adlarını eşlemek için herkesin okuyabilmesi gereken bir dosya olduğundan, özetler de herkese açık oluyordu ve çevrimdışı tahmin saldırılarına imkân veriyordu.

Linux man-pages belgesi bugünkü düzeni anlatır: gölge (shadow) parolalar kullanılıyorsa parola alanı `x` içerir ve şifrelenmiş parolalar `/etc/shadow` dosyasındadır; belge bu dosyanın yalnız süper kullanıcı tarafından okunabildiğini söyler. `/etc/passwd` ise tüm kullanıcılara okuma izni vermeli, yazma izni yalnız root'ta olmalıdır.

Dolayısıyla iddia bugün yanlıştır. Yine de `/etc/passwd` herkese açıktır: kullanıcı adlarını, UID'leri, ev dizinlerini ve kabukları sızdırır; bu da saldırgan için değerli bir keşif bilgisidir. `/etc/shadow` okunabilir olsaydı özetler kırılmaya açık kalırdı, bu yüzden izinleri sıkı tutulur.
