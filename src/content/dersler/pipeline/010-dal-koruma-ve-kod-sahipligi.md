---
kimlik: pipeline-010
baslik: "Dal koruma ve kod sahipliği"
donem: 6
sira: 10
sure: 30
neden: "Bütün pipeline kontrolleri, birinin bunları atlayıp ana dala doğrudan kod itebildiği yerde anlamsızdır. Dal koruma ve CODEOWNERS, insan incelemesini ve otomatik kapıları zorunlu hale getirir. Güvenlik ayarlarının bypass edilememesi DevSecOps'un temel işlerinden biridir."
analoji:
  baslik: "Bankada çift imza"
  metin: "Büyük bir havalede tek kişi onay veremez; ikinci bir yetkili de imza atar, ve belirli tutarlarda mutlaka belirli bir departman bakar. Dal koruma çift imza, CODEOWNERS ise 'bu belgeyi hukuk görmeli' kuralıdır. Sınırı: iki kişi de aynı hatayı atlayabilir ya da anlaşabilir; mekanizma hatayı değil, tek kişilik hatayı azaltır."
gorev:
  aciklama: "Geçici bir depoda CODEOWNERS dosyası yazıp imzalı commit durumunu okuyacaksın. Gerçek GitHub ayarlarına dokunmuyorsun. Dal koruma kuralları web arayüzünden ayarlanır (Settings, Branches ya da Rules); orası için aşağıdaki telefon sorusunu çöz."
  komutlar:
    - "rm -rf /tmp/sahip && mkdir -p /tmp/sahip/.github && cd /tmp/sahip && git init -q -b main && git config user.email a@b.c && git config user.name deneme"
    - |-
      printf '%s\n' '# her şeyin sahibi' '* @alper-ornek' '# pipeline dosyalarını güvenlik ekibi görmeli' '/.github/workflows/ @guvenlik-ekibi' > .github/CODEOWNERS
    - "cat .github/CODEOWNERS"
    - "git add -A && git commit -q -m 'CODEOWNERS ekle'"
    - "git log --pretty='%h %G? %s'"
  soru: "`git log` çıktısındaki `%G?` alanı `N` gösterdi. Bu ne demek ve `N` olması commit'in sahte olduğu anlamına gelir mi?"
  telefon:
    soru: "Bir depoda ana dalda 'inceleme zorunlu' kuralı var ama yönetici (admin) bu kuralı atlayıp doğrudan push yapabiliyor. Bu neden bir güvenlik sorunudur ve hangi ayarla düzeltilir?"
    cevap: "Çalınmış bir yönetici hesabı ya da acele eden bir yönetici bütün kapıları atlar. Kuralın yöneticilere de uygulanması (GitHub'da 'Do not allow bypassing the above settings') bunu önler; acil durum için ayrı ve kayıtlı bir yol tanımlanır."
sorular:
  - id: pipeline-010-s1
    soru: "Dal koruma kuralıyla hangi üç şeyi zorunlu kılabilirsin?"
    cevap: "Örneğin birleştirmeden önce onaylı inceleme, geçmesi gereken durum kontrolleri (CI/tarama), ve imzalı commit. Ayrıca force push ve dalı silmeyi engelleyebilir, kuralı yöneticilere de uygulatabilirsin."
    ipucu: "Üç şey: kim onaylar, ne geçmeli, geçmiş yeniden yazılabilir mi?"
  - id: pipeline-010-s2
    soru: "CODEOWNERS dosyası ne işe yarar ve nerede durur?"
    cevap: "Hangi dosya ya da klasör için kimin inceleme yapması gerektiğini belirtir. `.github/`, kök ya da `docs/` dizinindedir. Dal korumada 'kod sahibi onayı' seçilirse, o dosyaları değiştiren PR'a ilgili sahip onay vermeden birleştirilemez."
    ipucu: "Dosya yoluna göre sahip atayan bir dosyayı düşün."
  - id: pipeline-010-s3
    soru: "Workflow dosyalarını (`.github/workflows/`) neden özellikle CODEOWNERS ile korumak istersin?"
    cevap: "Workflow, pipeline'ın yetkilerini ve adımlarını tanımlar. Değiştirebilen biri güvenlik taramasını kapatabilir ya da sırları çalan bir adım ekleyebilir. Bu yüzden bu dosyalar güvenlik ekibinin onayına bağlanır; CODEOWNERS dosyasının kendisi de sahiplenilmelidir."
    ipucu: "Workflow dosyasını değiştiren, pipeline'ın yetkisini de değiştirir."
  - id: pipeline-010-s4
    soru: "İmzalı commit neyi kanıtlar, neyi kanıtlamaz?"
    cevap: "Commit'in, imza anahtarının sahibi tarafından yapıldığını kanıtlar; başkası senin adınla commit atamaz. Kodun güvenli ya da hatasız olduğunu kanıtlamaz."
    ipucu: "Git'te kimliği gösteren metni herkes değiştirebilir; bunu neyle kanıtlarsın?"
  - id: pipeline-010-s5
    soru: "Bir PR'da geliştirici `.github/workflows/ci.yml` içindeki güvenlik taraması adımını silmiş ve 'hızlandırdım' demiş. Ne yaparsın?"
    cevap: "Workflow dosyalarının CODEOWNERS ile güvenlik ekibine ait olması gerekir; böylece bu PR onların onayı olmadan birleşemez. Silmenin nedenini sor: gürültü sorunuysa kuralı ayarla, taramayı kaldırma. Bir de ilgili job'ın zorunlu durum kontrolü olduğundan emin ol; öyleyse job yoksa PR birleştirilemez."
    ipucu: "Bu dosyaya kimlerin dokunabilmesi gerektiğini ve hangi ayarın dosya sahibi onayını zorunlu kıldığını düşün."
hizliKontrol:
  - soru: CODEOWNERS neden kendisini de korumalıdır?
    secenekler:
      - Dosya kullanılmadığı için
      - Başkası dosyayı değiştirip kendini sahip yapabilir
      - Git bunu gerektirir
      - Dosya çok büyüktür
    dogru: 1
    aciklama: CODEOWNERS dosyasını değiştirebilen, kimin neyi onaylayacağını da değiştirebilir.
    ipucu: Kural dosyasına kim dokunabilir?
  - soru: "'Verified' rozeti neyi gösterir?"
    secenekler:
      - Kodun hatasız olduğunu
      - Commit'in beklenen bir anahtarla imzalandığını
      - Testlerin geçtiğini
      - PR'ın onaylandığını
    dogru: 1
    aciklama: İmza commit'in kaynağını gösterir; kod kalitesini ya da güvenliğini göstermez.
    ipucu: Rozet kimlik içindir.
sikHatalar:
  - hata: Dal koruma kuralını yöneticilere uygulamamak.
    dogrusu: Kuralı herkese uygula; acil durum için ayrı ve kayıtlı bir yol bırak.
  - hata: Onaydan sonra gelen commit'te eski onayın geçerli kalması.
    dogrusu: Yeni commit'te eski onayları geçersiz kıl ki onaylanmış PR'a sonradan kod eklenemesin.
terimler:
  - Branch protection
  - CODEOWNERS
  - Güvenlik kapısı
  - Pull request
derinDalis:
  - tur: okuma
    baslik: "GitHub: Korumalı dallar hakkında"
    ayrinti: "Zorunlu inceleme, durum kontrolü, imzalı commit, doğrusal geçmiş ve yöneticilerin atlamasını engelleme seçenekleri."
    url: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches"
  - tur: okuma
    baslik: "GitHub: Kod sahipleri hakkında"
    ayrinti: "CODEOWNERS biçimi, konumu ve zorunlu kod sahibi incelemesiyle birlikte çalışması."
    url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners"
---

devops-004'te PR akışını ve korumalı dalı tanıdın. Şimdi güvenlik gözüyle: bu mekanizmalar hangi saldırı ya da hatayı önler?

### Dal koruma: kapıyı kilitlemek

Bir dal koruma kuralı (branch protection ya da yeni adıyla ruleset) ana dala girebilecek değişikliğe koşul koyar. Güvenlik açısından önemli olanlar:

- **Zorunlu inceleme:** En az bir (kritik depolarda iki) onay. Kod kendi yazarı tarafından onaylanamaz.
- **Zorunlu durum kontrolleri:** Sır taraması, SAST, SCA, testler yeşil olmadan birleştirme olmaz. Bu, önceki derslerdeki araçlarına dişlerini veren ayardır; kontrol yalnız uyarı veriyorsa, atlanabilir.
- **Eski onayları geçersiz kılmak:** Onaydan sonra yeni commit gelirse onay düşer; yoksa onaylandıktan sonra kötü kod eklenebilir.
- **Force push ve silmeyi kapatmak:** Geçmiş yeniden yazılamaz.
- **İmzalı commit zorunluluğu:** Commit'lerin kimden geldiği doğrulanabilir.
- **Yöneticiler dahil herkese uygulamak:** Kural, "bypass" izni olanlar için de geçerli olmalı. Yoksa tek bir ele geçirilmiş yönetici hesabı her şeyi aşar.

### CODEOWNERS: doğru kişi baksın

`CODEOWNERS` dosyası kimin hangi yolun sahibi olduğunu yazar. Örnek:

```
*                         @takim
/.github/workflows/       @guvenlik-ekibi
/terraform/               @altyapi-ekibi
```

Dal korumada "kod sahibi incelemesi zorunlu" seçilirse, o yolları değiştiren PR'a ilgili sahip onay vermelidir. En değerli koruma noktaları: workflow dosyaları, altyapı kodu, kimlik/yetki kodu, bağımlılık dosyaları ve **CODEOWNERS dosyasının kendisi**. Aksi halde biri dosyayı değiştirip kendini sahip yapabilir.

### İmzalı commit

Git'te `user.name` ve `user.email` herkesin yazabildiği metindir; başkası senin adınla commit atabilir. İmza (GPG, SSH ya da Sigstore) bunu önler: GitHub imzayı doğrularsa commit'in yanında "Verified" yazar. `git log --pretty='%G?'` imza durumunu gösterir (`G` geçerli, `N` imzasız). Dikkat: "Verified" yalnız kimlik içindir, kodun iyi olduğunu söylemez. Bu bağlantıyı 008. dersteki imzalama mantığıyla kur: aynı fikir, commit düzeyinde.

### İnsan faktörü

İnceleme yorgunluk ve alışkanlıkla zayıflar: 3000 satırlık PR'a "LGTM" denir. Küçük PR'lar, kontrol listesi ve otomatik araçların ilk eleği yapması incelemenin kalitesini korur. Otomasyon insanın yerine geçmez; ona zaman kazandırır.

### Bu bölgeyle bağlantı

GitShield'in GitHub Action'ı ancak zorunlu durum kontrolü yapılırsa bir kapı olur. Aksi halde bulgu görürsün ama kimse birleştirmeyi durdurmaz. Bu ayrımı bir sonraki derste "güvenlik kapısı" olarak ele alacağız.

### Kural setleri (rulesets) ve kapsam

GitHub'da dal koruma artık **ruleset** olarak da tanımlanabilir. Avantajı: aynı kuralı birden fazla depoya ve dal kalıbına (ör. `main` ile `release/*`) tek yerden uygulayabilir, ve uygulama modunu önce "değerlendir" olarak deneyip sonra "zorla"ya geçirebilirsin. Bu, 011. dersteki "önce uyar, sonra engelle" yaklaşımının dal koruma karşılığıdır.

Birkaç pratik not: zorunlu durum kontrolü olarak işaretlediğin job'ın **adı** değişirse kural bozulur ve birleştirme kilitlenir ya da kontrol atlanır. Job adlarını sabit tut. Kod sahiplerinin tek bir kişi olmamasına dikkat et; kişi izne çıkınca PR'lar kilitlenmesin, ekip adı kullan.

**Güvenlik notu:** Koruma kuralını değiştirme izni olan hesaplar, kuralların kendisinden daha değerlidir. Bu hesapları ek doğrulama (MFA) ile koru ve sayısını az tut.
