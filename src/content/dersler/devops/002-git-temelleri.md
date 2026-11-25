---
kimlik: devops-002
baslik: "Git temelleri"
donem: 4
sira: 2
sure: 35
neden: "Git, kodun ve altyapı dosyalarının (YAML, Dockerfile, betikler) tarihçesini tutan araçtır. Bir DevSecOps mühendisi olarak her gün Git kullanacak, bir saldırının ya da hatalı değişikliğin izini `git log` ve `git diff` ile süreceksin."
analoji:
  baslik: "Oyun kayıt noktaları"
  metin: "Bir oyunda zor bir bölüme girmeden önce kayıt alırsın; işler ters giderse o noktaya dönersin. Her commit bir kayıt noktasıdır ve yanında 'ne yaptım' notu durur. Sınır: oyundaki kayıt genelde üzerine yazılır, Git ise bütün kayıtları yan yana saklar ve istediğine bakmana izin verir."
gorev:
  aciklama: "Git, Ubuntu'da genellikle hazır gelir; `git --version` ile kontrol et, yoksa `sudo apt install git` kur. Her şeyi `/tmp` altında, çöpe atılabilir bir depoda yapacaksın:"
  komutlar:
    - mkdir -p /tmp/git-deneme && cd /tmp/git-deneme
    - git init
    - git config user.name "Deneme" && git config user.email "deneme@example.com"
    - echo "merhaba" > notlar.txt
    - git status
    - git add notlar.txt
    - git commit -m "ilk not"
    - echo "ikinci satir" >> notlar.txt
    - git diff
    - git commit -am "ikinci satir eklendi"
    - git log --oneline
  soru: "`git diff` ikinci satırı eklemeden önce ne gösterdi? `git status` ile `git log` arasındaki fark nedir?"
  telefon:
    soru: "`git add dosya` yazdın ama `git commit` yazmadın. Dosya tarihçeye girdi mi? Neden?"
    cevap: "Hayır. `add` dosyayı yalnız hazırlık alanına (staging) koyar. Tarihçeye kayıt `commit` ile girer."
sorular:
  - id: devops-002-s1
    soru: "Çalışma dizini, hazırlık alanı (staging) ve depo arasındaki ilişki nedir?"
    cevap: "Dosyayı çalışma dizininde değiştirirsin, `git add` ile hazırlık alanına koyarsın, `git commit` ile hazırlık alanındakileri depoya kalıcı bir kayıt olarak yazarsın."
  - id: devops-002-s2
    soru: "Commit mesajı neden önemlidir?"
    cevap: "Altı ay sonra bir değişikliğin neden yapıldığını yalnız mesaj anlatır. İyi mesaj, hata aramayı ve güvenlik incelemesini hızlandırır."
  - id: devops-002-s3
    soru: "`git diff` ne gösterir?"
    cevap: "Çalışma dizinindeki, henüz hazırlık alanına eklenmemiş değişiklikleri satır satır gösterir: hangi satır silindi, hangisi eklendi."
  - id: devops-002-s4
    soru: "Git her dosyanın yalnız farkını mı yoksa tamamını mı tutar? Bunun güvenlik açısından sonucu ne?"
    cevap: "Kavramsal olarak her commit projenin o anki bir görüntüsüdür. Sonuç: bir dosyayı sonradan silsen bile eski committe içeriği durur. Bu yüzden sızan bir sır silmekle gitmez (devops-005'te göreceğiz)."
derinDalis:
  - tur: kitap
    baslik: "Pro Git (Scott Chacon, Ben Straub)"
    ayrinti: "Ücretsiz çevrimiçi kitap; 'Git Basics' bölümü bu dersin konusudur."
    url: "https://git-scm.com/book/en/v2"
---

**Git**, bir klasördeki dosyaların tarihçesini tutan dağıtık bir **sürüm kontrol sistemidir** (version control system). "Dağıtık" demek, projenin bütün tarihçesinin her kullanıcıdaki kopyada bulunması demektir.

### Üç alan

Git'i anlamanın anahtarı üç yeri ayırmaktır:

1. **Çalışma dizini:** Dosyaları düzenlediğin yer.
2. **Hazırlık alanı (staging area):** Bir sonraki kayda neyin gireceğini seçtiğin sepet.
3. **Depo (repository):** Kalıcı kayıtların (commit) durduğu yer; `.git` klasöründe yaşar.

### Temel komutlar

| Komut | Ne yapar |
|---|---|
| `git init` | Bulunduğun klasörü Git deposu yapar |
| `git status` | Hangi dosya değişti, hangisi hazırlandı? |
| `git add <dosya>` | Dosyayı hazırlık alanına koyar |
| `git commit -m "mesaj"` | Hazırlananları kayıt olarak depoya yazar |
| `git log --oneline` | Kayıtların kısa listesi |
| `git diff` | Hazırlanmamış değişiklikler |
| `git diff --staged` | Hazırlanmış ama commitlenmemiş değişiklikler |

Her commit'in benzersiz bir kimliği vardır: uzun bir karma değeri (hash), örneğin `3f2a9c1...`. `git log --oneline` bunun ilk birkaç karakterini gösterir.

### İyi commit nasıl olur?

- **Küçük ve tek amaçlı.** "Giriş formu eklendi" bir committir; "bir sürü şey" değildir.
- **Mesaj ne ve neden söyler.** "Düzeltme" yerine "Süresi dolan token'ı reddet".
- Mesaj kısa bir özetle başlar; gerekirse boş bir satırdan sonra ayrıntı gelir.

### Neden bu kadar önemli?

Git tarihçeyi **silmemek** üzere tasarlanmıştır. Eski bir sürüme dönebilir, iki sürüm arasındaki farkı görebilir, kim neyi ne zaman değiştirdi sorusunu yanıtlayabilirsin. Bu iyi bir şey, ama bir bedeli var: depoya bir kez girmiş bilgi (örneğin bir parola) sonradan dosyadan silinse bile eski committe durur. Bunu devops-005'te ele alacağız.

Güvenlik notu: Commit atmadan önce `git status` ve `git diff --staged` ile ne gönderdiğine bak. Yanlışlıkla eklenen bir `.env` dosyası ya da anahtar, ilk savunma hattında yakalanabilecek en ucuz hatadır.
