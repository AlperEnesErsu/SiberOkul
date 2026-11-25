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
  - id: pipeline-002-s2
    soru: "Pre-commit kancası neden tek başına yeterli koruma değildir?"
    cevap: "Geliştirici kancayı kurmamış olabilir ya da `git commit --no-verify` ile atlayabilir. Bu yüzden aynı taramayı CI'da (GitHub Action olarak) da çalıştırırsın; orası atlanamaz."
  - id: pipeline-002-s3
    soru: "Taramada bir gerçek anahtar bulundu. Kodu silip yeni commit atmak neden yetmez, ilk yapılacak iş nedir?"
    cevap: "Anahtar git geçmişinde durur ve herkes (ve botlar) onu görebilir. İlk iş, anahtarı sağlayıcıda iptal edip yenisini üretmek (döndürmek, rotation). Geçmişi temizlemek ikinci adımdır."
  - id: pipeline-002-s4
    soru: "Sır tarayıcıları neden yalnız son commit'e değil, geçmişteki tüm commit'lere de bakabilmelidir?"
    cevap: "Bir sır eski bir commit'te eklenip sonra silinmiş olabilir; yine de depoyu klonlayan herkes onu geçmişten okur. Tam geçmiş taraması bu unutulmuş sızıntıları bulur."
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

**Güvenlik notu:** Bu derste yalnız sahte anahtarlarla çalış. Gerçek bir anahtarı bir aracın çıktısına, sohbete ya da ekran görüntüsüne koyma.
