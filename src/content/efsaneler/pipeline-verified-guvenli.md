---
iddia: "GitHub'da 'Verified' rozetli bir commit'teki kod güvenlidir."
hukum: yanlis
ozet: "GitHub'ın belgesi imzanın bir değişikliğin nereden geldiğine dair güven verdiğini söyler: 'Verified', imzanın GitHub'a eklenmiş güvenilir bir anahtarla doğrulandığı anlamına gelir. Belge kodun doğruluğu ya da güvenliği hakkında bir iddiada bulunmaz."
analoji: "Zarfın üstündeki imzalı mühür gibi: zarfı gönderenin kimliğini gösterir, içindeki mektubun doğru ya da zararsız olduğunu göstermez."
kaynaklar:
  - { ad: "GitHub Docs: About commit signature verification", url: "https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification" }
ilgiliDers: pipeline-010
tarih: "2026-11-25"
---

Git'te `user.name` ve `user.email` herkesin yazabildiği metindir; imza, commit'in gerçekten senin anahtarınla atıldığını gösterir. Bu **kimlik ve kaynak** bilgisidir. Kodun hatasız, testli ya da güvenli olduğuna dair bir şey söylemez.

İmzalı commit'in işe yaradığı yer: başkasının senin adınla commit atmasını fark etmek. Ama hesabı ele geçirilmiş bir geliştirici de kendi anahtarıyla imzalı kötü kod gönderebilir.

Bu yüzden imzalı commit zorunluluğunu kod incelemesi, zorunlu durum kontrolleri (tarama) ve en az yetki ile birlikte düşün. İmza bir kapının kilidi gibidir; içeri giren eşyanın ne olduğuna bakmaz.
