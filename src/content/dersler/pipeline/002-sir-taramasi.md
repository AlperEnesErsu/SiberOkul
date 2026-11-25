---
kimlik: pipeline-002
baslik: "Sır taraması"
donem: 6
sira: 2
sure: 35
neden: "Sızan bir API anahtarı en sık görülen ve en çabuk sömürülen pipeline hatalarından biridir. Sır taraması, anahtar daha repoya girmeden ya da girer girmez yakalamayı sağlar. Kendi yazdığın GitShield tam bu işi yapıyor; bu derste neden öyle tasarlandığını göreceksin."
analoji:
  baslik: "Havalimanı güvenlik kapısı"
  metin: "Kapıdaki cihaz yasak eşyayı arar; ne aradığı kurallarla (liste) ve şüpheli görünüme (şekil) bakarak belirlenir. Sır tarayıcısı da kurallarla bilinen anahtar biçimlerini, entropiyle de 'rastgele görünen' dizgileri arar. Sınırı: cihaz bilmediği bir eşyayı kaçırabilir, ve bir kez uçağa binen yolcuyu geri çağırmaz. Sızan anahtarı da taramayla geri alamazsın, döndürürsün."
gorev:
  aciklama: "Geçici bir repoda sahte bir anahtarı hem elle hem GitShield'inle yakalayacaksın. Anahtar AWS belgelerindeki örnek değerdir, gerçek değildir. GitShield'in kurulu olduğunu varsayıyorum; kurulu değilse yalnız ilk beş komutu çalıştır."
  komutlar:
    - "rm -rf /tmp/sir && mkdir -p /tmp/sir && cd /tmp/sir && git init -q && git config user.email a@b.c && git config user.name deneme"
    - 'echo "x=1" > app.py && git add app.py && git commit -q -m ilk'
    - 'echo "AWS_KEY = \"AKIAIOSFODNN7EXAMPLE\"" >> app.py'
    - |-
      git diff | grep '^+' | grep -vE '^\+\+\+' | grep -E 'AKIA[0-9A-Z]{16}'
    - "git diff | grep '^+' | grep -c ."
    - "gitshield scan"
  soru: "Tarama yalnız eklenen satırlara (`+` ile başlayanlara) baktı. Bu seçimin avantajı ve riski nedir?"
  telefon:
    soru: "Bir tarayıcı 'AKIAIOSFODNN7EXAMPLE' gibi sabit biçimli bir anahtarı kural (regex) ile bulur. Ama 'x9fK2LmQ8vTz...' gibi rastgele 40 karakterlik bir dizgiyi hangi yöntemle yakalar, ve bu yöntemin yan etkisi ne olur?"
    cevap: "Shannon entropisi ile: dizgideki karakterler ne kadar rastgele dağılmışsa entropi o kadar yüksektir. Yan etkisi yanlış pozitiflerdir: bir hash, bir UUID ya da base64 veri de rastgele görünür ve sır sanılabilir."
sorular:
  - id: pipeline-002-s1
    soru: "Regex kuralı ile entropi kontrolü arasındaki fark nedir? Biri neyi iyi, diğeri neyi iyi yakalar?"
    cevap: "Regex biçimi bilinen sırları (AWS anahtarı, GitHub token öneki) kesin bulur ve az yanlış pozitif verir. Entropi biçimi bilinmeyen ama rastgele görünen dizgileri yakalar; daha çok yanlış pozitif üretir. İkisi birbirini tamamlar."
    ipucu: "Biri 'biçimi bilinen' sırrı, diğeri 'rastgele görünen' dizgiyi hedefler."
  - id: pipeline-002-s2
    soru: "Pre-commit kancası neden tek başına yeterli koruma değildir?"
    cevap: "Geliştirici kancayı kurmamış olabilir ya da `git commit --no-verify` ile atlayabilir. Bu yüzden aynı taramayı CI'da (GitHub Action olarak) da çalıştırırsın; orası atlanamaz."
    ipucu: "Geliştiricinin elindeki bir komut bayrağını ve CI'ın farkını düşün."
  - id: pipeline-002-s3
    soru: "Taramada bir gerçek anahtar bulundu. Kodu silip yeni commit atmak neden yetmez, ilk yapılacak iş nedir?"
    cevap: "Anahtar git geçmişinde durur ve herkes (ve botlar) onu görebilir. İlk iş, anahtarı sağlayıcıda iptal edip yenisini üretmek (döndürmek, rotation). Geçmişi temizlemek ikinci adımdır."
    ipucu: "Anahtar artık herkesin görebileceği bir yerde; önce kimin elinden almalısın?"
  - id: pipeline-002-s4
    soru: "Sır tarayıcıları neden yalnız son commit'e değil, geçmişteki tüm commit'lere de bakabilmelidir?"
    cevap: "Bir sır eski bir commit'te eklenip sonra silinmiş olabilir; yine de depoyu klonlayan herkes onu geçmişten okur. Tam geçmiş taraması bu unutulmuş sızıntıları bulur."
    ipucu: "Silinmiş bir dosya git'te gerçekten silinir mi?"
  - id: pipeline-002-s5
    soru: "Sabah bir meslektaşın 'dün akşam yanlışlıkla bir bulut anahtarını public depoya itmişim, 10 dakika sonra silip yeni commit attım, sorun yok' diyor. Ne yaparsın?"
    cevap: "Sorun var: anahtar git geçmişinde ve olası kopyalarda duruyor, botlar dakikalar içinde public depoları tarar. Önce anahtarı sağlayıcıda iptal edip yenisini üretirsin, sonra sağlayıcının denetim kayıtlarında anahtarın kullanılıp kullanılmadığına bakarsın. Geçmiş temizliği en son gelir; ardından aynı hatayı önlemek için pre-commit kancası ve CI taraması eklersin."
    ipucu: "Silmek mi, iptal etmek mi önce gelir? Anahtarı başkası kopyalamış olabileceğini varsay."
hizliKontrol:
  - soru: Rastgele görünen ama bilinen bir biçimi olmayan bir dizgiyi hangi yöntem yakalar?
    secenekler:
      - Entropi ölçümü
      - Dosya adına bakmak
      - Satır sayısını saymak
      - Yalnız sabit regex kuralları
    dogru: 0
    aciklama: Entropi rastgeleliğin ölçüsüdür; biçimi bilinmeyen sırlarda işe yarar ama hash ve UUID gibi değerlerde yanlış pozitif verebilir.
    ipucu: Shannon'ı hatırla.
  - soru: GitShield yalnız `git diff`'in eklenen satırlarını tarıyor. Bu seçimin bir sınırı nedir?
    secenekler:
      - Geliştiriciye gereğinden fazla bulgu gösterir
      - Hızlıdır ama eski commit'lerdeki sızıntıları görmez
      - Yalnız sırları değil bütün hataları bulur
      - Pre-commit'te çalışamaz
    dogru: 1
    aciklama: Yeni değişikliği hızla tarar; geçmişteki sızıntılar için ayrıca tam geçmiş taraması gerekir.
    ipucu: Tabloda 'periyodik geçmiş taraması' neden ayrı bir satır?
sikHatalar:
  - hata: Sızan anahtarın bulunduğu dosyayı silip yeni commit atınca iş bitti sanmak.
    dogrusu: Anahtar geçmişte durur; önce sağlayıcıda iptal et ve döndür, sonra kodu düzelt.
  - hata: Pre-commit kancasını tek koruma saymak.
    dogrusu: Kanca atlanabilir; aynı taramayı CI'da da zorunlu çalıştır.
olay:
  baslik: Codecov Bash Uploader olayı
  yil: 2021
  ozet: Codecov'un açıklamasına göre, bir saldırgan Codecov'un Bash Uploader betiğini 31 Ocak 2021'den itibaren değiştirdi; betik, kullanıcıların CI ortamındaki `env` ve `git remote -v` çıktısını dış bir sunucuya gönderiyordu. Olay 1 Nisan 2021'de, bir müşterinin indirdiği betiğin sağlama toplamının (checksum) GitHub'dakiyle uyuşmadığını bildirmesiyle fark edildi.
  ders: CI ortamındaki ortam değişkenleri sırlarla doludur; üçüncü taraf bir betik o ortamda çalıştığında hepsini görebilir. Sır taraması kadar, sırların CI'a ne kadar verildiği ve indirilen betiklerin doğrulanması da önemlidir.
  kaynak:
    ad: "Codecov: Bash Uploader Security Update"
    url: https://about.codecov.io/security-update/
terimler:
  - Secret scanning
  - Pre-commit kancası
  - Entropi
  - Rotation
derinDalis:
  - tur: lab
    baslik: "gitleaks"
    ayrinti: "Bu alanın en yaygın açık kaynak aracı. README'de `git` ve `dir` komutlarına, pre-commit kullanımına ve SARIF çıktısına bak; GitShield'ini onunla karşılaştır."
    url: "https://github.com/gitleaks/gitleaks"
  - tur: okuma
    baslik: "pre-commit çerçevesi"
    ayrinti: "Kancaları `.pre-commit-config.yaml` ile tanımlamak ve `SKIP`/`--no-verify` ile atlamanın nasıl olduğunu gösterir."
    url: "https://pre-commit.com/"
---

**Sır** (secret), kimliğini kanıtlayan ve bir sisteme erişim veren gizli değerdir: API anahtarı, veritabanı parolası, token, özel anahtar. Kod deposuna girerse, depoyu görebilen herkes (ve kamuya açıksa botlar) onu kullanabilir. Devops bölgesinde bu kazayı görmüştün; şimdi otomatik yakalamayı kuruyoruz.

### Tarayıcı nasıl bulur?

Üç yaygın yöntem var:

- **Kural (regex) eşleşmesi:** `AKIA` ile başlayıp 16 büyük harf/rakamla devam eden dizgi bir AWS erişim anahtarı kimliğine benzer. Bilinen servislerin biçimleri için iyi çalışır.
- **Entropi:** Shannon entropisi bir dizgideki rastgeleliğin ölçüsüdür. `parola` düşük, `x9fK2LmQ8vTz` yüksektir. Biçimi bilinmeyen sırları yakalar ama hash ve UUID'leri de sır sanabilir.
- **Bağlam:** `password =`, `secret:`, `token` gibi anahtar kelimelerin yanındaki değerlere bakmak.

GitShield bu yaklaşımları birleştirir: kuralları YAML dosyasında tutar, rastgele görünen dizgiler için entropiye bakar, OWASP kalıplarını da kural olarak kullanır. Ayrıca tüm depoyu değil, `git diff`'in **eklenen satırlarını** tarar. Bu hızlıdır ve geliştiriciye yalnız kendi yeni değişikliğinin sonucunu gösterir. Riski: eski sızıntıları görmez; onlar için ayrıca geçmiş taraması gerekir.

### Nerede çalıştırılır?

| Nokta | Güçlü yanı | Zayıf yanı |
|---|---|---|
| Pre-commit kancası | Sır commit'e hiç girmez | Atlanabilir (`--no-verify`) |
| CI'da (GitHub Action) | Atlanamaz, herkes için zorunlu | Sır PR dalına itilmiş olur |
| Periyodik geçmiş taraması | Eski sızıntıları bulur | Geç haber verir |

GitShield'in üç kullanımı bu tabloya oturur: `gitshield scan` komutu, pre-commit kancası ve GitHub Action. Doğru kurulum üçünün birlikte olmasıdır.

### Bulunca ne yapılır?

1. Anahtarı sağlayıcıda **iptal et ve döndür**. Bu her şeyden önce gelir.
2. Anahtar neye erişiyordu, kullanıldı mı? Sağlayıcının denetim kayıtlarına bak.
3. Kodu düzelt: sırrı ortam değişkenine ya da sır yöneticisine taşı.
4. Geçmişi temizlemek istersen bunu en sonda yap; zaten yayılmış bir anahtar için asıl çözüm döndürmedir.

### Yanlış pozitifleri azaltmak

Sır tarayıcılarının en sık şikâyet edilen yanı gürültüdür: test dosyalarındaki sahte anahtarlar, hash değerleri, örnek yapılandırmalar. Üç basit önlem işe yarar:

- **İzin listesi (allowlist):** Bilinen sahte değerleri ya da test klasörlerini gerekçesiyle tarama dışında tut. Listeyi de kod incelemesinden geçir.
- **Önce kural, sonra entropi:** Kesin biçimli bulguları (AWS, GitHub token) engelleyici yap; entropi bulgularını yalnız uyarı olarak göster.
- **Örnek değer kullan:** Dokümanda ve testte açıkça sahte olan değerler (`AKIAIOSFODNN7EXAMPLE` gibi) yaz; gerçek anahtarın değiştirilmiş hâlini koyma.

Unutma: bulunan sırrın gerçek olup olmadığını araç söylemez. Gerçek olduğundan şüphe varsa sağlayıcıda geçerliliğine bakmak ya da doğrudan döndürmek, "belki sahtedir" diye beklemekten güvenlidir.

**Güvenlik notu:** Bu derste yalnız sahte anahtarlarla çalış. Gerçek bir anahtarı bir aracın çıktısına, sohbete ya da ekran görüntüsüne koyma.
