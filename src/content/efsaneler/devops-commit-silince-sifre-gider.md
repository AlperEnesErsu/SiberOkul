---
iddia: "Yanlışlıkla commitlenen şifreyi sonraki committe silersem sorun biter."
hukum: yanlis
ozet: "GitHub'ın rehberi, sızan parola ya da token için ilk adımın sırrı iptal edip döndürmek olduğunu söyler. Geçmişi yeniden yazmak bile klonlarda, fork'larda ve önbelleklerde kopyaları ortadan kaldırmayı garanti etmez."
analoji: "Kapıya yapıştırdığın anahtar fotoğrafını sonradan çıkarmak gibi: kimin fotoğrafını çektiğini bilemezsin, çözüm kilidi değiştirmektir."
kaynaklar:
  - { ad: "GitHub Docs: Removing sensitive data from a repository", url: "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository" }
ilgiliDers: devops-005
tarih: "2026-11-25"
---

Git tarihçeyi saklamak için tasarlanmıştır. Dosyayı silen yeni bir commit atarsan, yeni sürümde sır yoktur ama onu ekleyen eski commit hâlâ depodadır ve `git log -p` ile okunur.

Durum yalnız sizin deponuzla da sınırlı değildir. Depoyu klonlamış biri, fork etmiş biri ya da bir önbellek eski sürümü taşıyor olabilir. GitHub'ın belgesi de bu yüzden sır parola ya da token ise önce onu iptal etmeyi ve döndürmeyi (rotation) öneriyor; geçmişi temizlemek bunun yerine geçmez.

Doğru sıra şudur:

1. Sırrı kaynak serviste iptal et, yenisini üret.
2. Servisin kayıtlarında kötüye kullanım var mı bak.
3. İstersen geçmişi `git filter-repo` gibi bir araçla temizle (ekibin klonlarını etkiler).

Önlem tarafında `.gitignore`, commit öncesi sır taraması ve platformun sır tarama özelliği hatayı erken yakalar. Ama bunların hiçbiri döndürme alışkanlığının yerini almaz.
