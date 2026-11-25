---
kimlik: devops-004
baslik: "GitHub ve PR akışı"
donem: 4
sira: 4
sure: 30
neden: "Kod çoğu ekipte GitHub gibi bir platformda durur ve her değişiklik bir çekme isteği (pull request, PR) ile ana dala girer. PR, hem kod incelemesinin hem de otomatik kontrollerin yapıldığı yerdir; güvenlik açısından 'kimse tek başına ana dala kod sokamaz' kuralının uygulandığı kapıdır."
analoji:
  baslik: "Yayınevinde editör onayı"
  metin: "Yazar kitabı doğrudan basıma gönderemez; önce editör okur, düzeltme ister, sonra basıma onay verir. PR, değişikliğin 'basılmadan önceki editör masası'dır. Korumalı dal ise 'editör onayı olmadan baskı makinesi çalışmaz' kuralıdır. Sınır: yazılımda editör çoğu zaman bir makinedir de (testler)."
gorev:
  aciklama: "Bu görev GitHub hesabı gerektirir ve yalnız okuma/örnek amaçlıdır. Önce `/tmp` altında yerel bir 'uzak depo' taklidi kurup `push` mantığını deneyeceksin; hesaba hiçbir şey göndermiyorsun:"
  komutlar:
    - mkdir -p /tmp/pr-deneme && cd /tmp/pr-deneme
    - git init --bare uzak.git
    - git clone uzak.git calisma && cd calisma
    - git config user.name "Deneme" && git config user.email "deneme@example.com"
    - git switch -c ozellik
    - echo "merhaba" > a.txt && git add a.txt && git commit -m "a eklendi"
    - git push -u origin ozellik
    - git branch -vv
  soru: "`origin` neyi gösteriyor? `push` etmeden önce ve sonra `git branch -vv` çıktısı nasıl farklı?"
  telefon:
    soru: "PR açmadan doğrudan `main`e push yapabilen bir ekip arkadaşı hesabı çalınırsa ne olur? Korumalı dal bunu nasıl engeller?"
    cevap: "Saldırgan doğrudan ana dala kod sokabilir. Korumalı dal, PR ve onay şartı koyarak bunu engeller; tek bir hesap ele geçirilse bile kod başkasının incelemesinden geçmeden birleşmez."
sorular:
  - id: devops-004-s1
    soru: "`git clone`, `git push` ve `git pull` ne yapar?"
    cevap: "`clone` uzak depoyu bilgisayarına kopyalar. `push` yerel commitlerini uzak depoya gönderir. `pull` uzaktaki yeni commitleri alıp yerel dala birleştirir."
    ipucu: "Üç komutun yönlerini düşün: uzaktan yerele, yerelden uzağa, kopyalama."
  - id: devops-004-s2
    soru: "Pull request nedir ve neden doğrudan birleştirmek yerine PR kullanılır?"
    cevap: "PR, bir dalın başka bir dala birleştirilmesi için açılan tekliftir. İnceleme, tartışma ve otomatik testler birleştirmeden önce yapılsın diye kullanılır."
    ipucu: "Birleştirmeden önce hangi şeylerin yapılması istenir?"
  - id: devops-004-s3
    soru: "Korumalı dal (protected branch) hangi kuralları getirebilir?"
    cevap: "Örneğin birleştirmeden önce onaylı inceleme, geçen durum kontrolleri (CI), çözülmüş yorumlar zorunluluğu; ayrıca zorla push (force push) ve dalı silme yasağı."
    ipucu: "Tek bir hesabın ele geçirildiği durumu düşün."
  - id: devops-004-s4
    soru: "İyi bir kod incelemesi güvenlik açısından neye bakar?"
    cevap: "Kullanıcı girdisinin doğrulanıp doğrulanmadığına, yetki kontrolünün atlanıp atlanmadığına, koda yanlışlıkla giren sırlara ve beklenmedik yeni bağımlılıklara."
    ipucu: "Bir saldırganın kodun içine bırakabileceği şeyleri listele."
  - id: devops-004-s5
    soru: "Bir PR'da 1800 satırlık değişiklik var; içinde yeni bir bağımlılık ve bir workflow değişikliği de duruyor. Birleştirme baskısı yüksek. İnceleyen olarak ne yaparsın?"
    cevap: "PR'ın küçük, tek amaçlı parçalara bölünmesini isterim. Workflow ve yeni bağımlılık değişikliklerini ayrıca özenle incelerim, çünkü bunlar kod çalıştırma yetkisi ve sır erişimi taşır. Büyük PR'ı \"iyi görünüyor\" diye onaylamam."
    ipucu: "Küçük görünse de çok yetkili olan dosyaları düşün."
derinDalis:
  - tur: okuma
    baslik: "GitHub: korumalı dallar hakkında"
    ayrinti: "Hangi kuralların konabildiğini resmi dokümandan oku."
    url: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches"
hizliKontrol:
  - soru: "Aşağıdakilerden hangisi korumalı dalın getirebileceği bir kuraldır?"
    secenekler: 
      - "Commit mesajının en az 10 kelime olması"
      - "Dalın her gün yeniden oluşturulması"
      - "Yalnız yöneticinin kod yazabilmesi"
      - "Birleştirmeden önce onaylı inceleme ve geçen durum kontrolleri"
    dogru: 3
    aciklama: "Dal koruma kuralı inceleme, durum kontrolü ve çözülmüş yorum gibi şartlar koyabilir."
    ipucu: "Kural kodun ana dala girmeden önce geçeceği kapılarla ilgilidir."
  - soru: "`origin` nedir?"
    secenekler: 
      - "Uzak deponun varsayılan takma adı"
      - "Yerel dalın adı"
      - "Bir commit'in kimliği"
      - "GitHub kullanıcı adın"
    dogru: 0
    aciklama: "`git clone` ile gelen uzak depoya varsayılan olarak `origin` denir."
    ipucu: "Yerel depon kiminle konuşuyor?"
sikHatalar:
  - hata: "Commit yazarının adına bakıp kimin yazdığından emin olmak."
    dogrusu: "`git config user.name` herkesin yazabileceği bir isimdir; hesabına 2FA aç, yazar adını kanıt sayma."
  - hata: "PR'ı okumadan \"onayla\"ya basmak."
    dogrusu: "Küçük PR'ı dikkatle oku; girdi doğrulama, yetki kontrolü, sır ve yeni bağımlılığa bak."
terimler:
  - "Pull request"
  - "Branch protection"
  - "Branch"
sema:
  baslik: "PR akışı"
  adimlar:
    - etiket: "Dal aç"
      aciklama: "`main`den yeni bir dal açıp değişikliği yaparsın."
    - etiket: "Push"
      aciklama: "Dalı `git push -u origin dal-adi` ile gönderirsin."
    - etiket: "PR aç"
      aciklama: "GitHub'da dalı `main`e birleştirme teklifi açarsın."
    - etiket: "İnceleme"
      aciklama: "Takım kodu okur ve yorum yapar."
    - etiket: "Kontroller"
      aciklama: "Testler ve taramalar otomatik çalışır."
    - etiket: "Birleştir"
      aciklama: "Onay ve yeşil kontrollerle birleştirilir, dal silinir."
---

Git yereldir; **GitHub** ise Git depolarını barındıran, işbirliği araçları ekleyen bir platformdur. Aynı işi GitLab ya da Bitbucket de yapar, kavramlar aynıdır.

### Uzak depo (remote)

Yerel depon, GitHub'daki depoyla bir **uzak depo** (remote) üzerinden konuşur. Varsayılan adı `origin`dir.

- `git clone <adres>`: Uzak depoyu kopyalar.
- `git push`: Yerel commitleri uzağa yollar.
- `git pull`: Uzaktaki yenilikleri alır.

### PR akışı

1. `main`den bir dal aç, değişikliğini yap, commitle.
2. Dalı `git push -u origin dal-adi` ile gönder.
3. GitHub'da **pull request** aç: "şu dalı `main`e birleştirmek istiyorum".
4. Takım arkadaşların kodu okur, yorum yapar, değişiklik ister.
5. Otomatik kontroller (testler, taramalar) çalışır.
6. Onay ve yeşil kontrollerle birleştirilir, dal silinir.

### Korumalı dal

`main` dalına kuralla koruma koyabilirsin. Bir **dal koruma kuralı** (branch protection rule) örneğin şunları isteyebilir: birleştirmeden önce onaylı inceleme, geçen durum kontrolleri, çözülmüş yorumlar. Varsayılan olarak zorla push'u (force push) ve dalın silinmesini de engeller.

Bu kural DevSecOps için önemli bir "iki kişi kuralı"dır: tek bir hesabın ele geçirilmesi, kötü niyetli kodun doğrudan yayına gitmesi anlamına gelmez.

### Küçük PR, iyi PR

Bin satırlık PR'ı kimse dikkatle okuyamaz; "iyi görünüyor" deyip geçer. Küçük ve tek amaçlı PR'lar hem hataları hem güvenlik sorunlarını yakalamayı kolaylaştırır.

Güvenlik notu: Hesabına iki adımlı doğrulama (2FA) aç. Git commitlerini atan kimlik ile GitHub hesabın ayrı şeylerdir; `git config user.name` herkesin yazabileceği bir isimdir, yani commit yazarı tek başına kanıt değildir.
