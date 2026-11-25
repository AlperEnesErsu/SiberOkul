---
kimlik: devops-005
baslik: "Git'te sır kazaları"
donem: 4
sira: 5
sure: 30
neden: "Depoya yanlışlıkla giren API anahtarı, parola ya da özel anahtar, güvenlik olaylarının en sık nedenlerindendir. DevSecOps mühendisi hem bunu önleyen kuralları kurar hem de olay olduğunda doğru müdahaleyi (önce döndürme) bilir."
analoji:
  baslik: "Fotokopi makinesine konan anahtar"
  metin: "Ev anahtarını ofisin fotokopi makinesinde yanlışlıkla kopyaladın. Sayfayı çöpe atman yetmez; kopyalar çoktan birilerinin elinde olabilir. Asıl yapman gereken kilidi değiştirmektir. Sızan sır için kilidi değiştirmek, anahtarı döndürmek (rotation) demektir. Sınır: kopyaları toplamaya çalışmak yine de yararlıdır ama güvenceyi o vermez."
gorev:
  aciklama: "`/tmp` altında çöp bir depo kur, sahte bir 'sır' commitle, sonra silinse de tarihçede durduğunu gör. Gerçek bir anahtar kullanma, aşağıdaki değer uydurmadır:"
  komutlar:
    - mkdir -p /tmp/sir-deneme && cd /tmp/sir-deneme && git init -b main
    - git config user.name "Deneme" && git config user.email "deneme@example.com"
    - echo "API_ANAHTARI=sahte-123456" > .env
    - git add .env && git commit -m "yanlislikla sir eklendi"
    - git rm .env && git commit -m "sir silindi"
    - git log --oneline
    - git log -p -- .env
    - echo ".env" >> .gitignore && cat .gitignore
  soru: "Dosya silindikten sonra bile `git log -p -- .env` sahte anahtarı gösterdi mi? Bu neden gerçek bir anahtarda tehlikelidir?"
  telefon:
    soru: "Bir geliştirici sırrı yanlışlıkla commitledi, fark edince hemen yeni bir commitle sildi. Sır güvende mi? Önce ne yapmalı?"
    cevap: "Güvende değil; eski commit tarihçede duruyor ve klonlarda olabilir. Önce sırrı iptal edip yenisini üretmek (döndürmek) gerekir. Tarihçeyi temizlemek ikinci adımdır."
sorular:
  - id: devops-005-s1
    soru: "Sır, depoya girdikten sonra dosyadan silinirse neden hâlâ risklidir?"
    cevap: "Git tarihçeyi saklar. Eski commit okunabilir durumdadır ve başkalarının klonlarında, fork'larda kopyası olabilir."
  - id: devops-005-s2
    soru: "Sızan bir anahtar için doğru sıra nedir?"
    cevap: "Önce anahtarı iptal edip yenisiyle değiştir (rotation), sonra kullanım kayıtlarında kötüye kullanım var mı bak, en son istersen tarihçeyi temizle. Temizlik tek başına yetmez."
  - id: devops-005-s3
    soru: "`.gitignore` ne işe yarar ve neyi korumaz?"
    cevap: "Git'in izlemeyeceği dosya desenlerini söyler, böylece `git add` yanlışlıkla sırlı dosyayı almaz. Ama dosya zaten commitlenmişse onu tarihçeden silmez."
  - id: devops-005-s4
    soru: "Sızıntıları baştan yakalamak için hangi önlemler kullanılır?"
    cevap: "Commit öncesi sır taraması (pre-commit kancası), CI'da sır tarayıcıları ve platformun sır tarama özelliği. Hiçbiri kusursuz değildir, bu yüzden döndürme alışkanlığı yine de gerekir."
derinDalis:
  - tur: okuma
    baslik: "GitHub: Depodan hassas veriyi kaldırmak"
    ayrinti: "Sızan sır için önce iptal/döndürme önerisini ve geçmişi temizleme adımlarını anlatır."
    url: "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository"
  - tur: okuma
    baslik: "GitHub: Secret scanning hakkında"
    ayrinti: "Platformun depolardaki sızan kimlik bilgilerini nasıl taradığı."
    url: "https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning"
---

Bir önceki derslerde Git'in tarihçeyi silmemek üzere tasarlandığını gördün. Bu, sırlar için kötü haberdir.

### Kaza nasıl olur?

- `.env` ya da `config.json` gibi bir dosya `git add .` ile toplu eklenir.
- Hata ayıklarken koda yazılan parola unutulur.
- Bir betikte bulut anahtarı sabit yazılır.
- Özel anahtar (`id_rsa`) bir klasörle birlikte depoya girer.

### Neden silmek yetmiyor?

Dosyayı silip yeni commit atarsan, **yeni** sürümde sır yoktur. Ama **eski commit** tarihçede durur ve `git log -p` ile okunur. Depoyu klonlamış herkes, fork edenler ve önbellekler de bu eski sürümü taşıyabilir. Otomatik tarayıcılar herkese açık depolardaki anahtarları dakikalar içinde bulabilir.

### Doğru müdahale sırası

1. **İptal et ve döndür (rotate).** Sızan anahtarı kaynak serviste devre dışı bırak, yenisini üret. Bu adım yalnız "yeni anahtar" değil, "eski anahtar artık çalışmıyor" demektir.
2. **Kullanımı incele.** Servisin günlüklerinde anahtarın yetkisiz kullanılıp kullanılmadığına bak.
3. **Tarihçeyi temizle** (isteğe bağlı): `git filter-repo` gibi araçlarla geçmişi yeniden yazmak mümkündür; ama ekibin herkesinin kopyasını etkiler ve ilk iki adımın yerini tutmaz.

GitHub'ın kendi rehberi de önce sırrın iptal edilmesini/döndürülmesini söyler.

### Önleme

- **`.gitignore`:** `.env`, `*.pem`, `id_rsa` gibi desenleri ekle. Bu, *henüz commitlenmemiş* dosyayı korur.
- **Örnek dosya:** Gerçek `.env` yerine değerleri boş `.env.example` commitle.
- **Commit öncesi tarama:** pre-commit kancasıyla (hook) çalışan sır tarayıcıları.
- **CI taraması ve platform taraması:** GitHub gibi platformların sır tarama (secret scanning) özelliği.
- **Kısa ömürlü ve dar yetkili anahtarlar:** Sızsa bile zararı sınırlı olur.

Güvenlik notu: "Depo özel (private), sorun yok" demek tehlikeli bir kolaylıktır. Özel depo yarın herkese açılabilir, bir çalışan hesabı ele geçirilebilir ya da depo klonlanıp başka yere gönderilebilir. Sırrın yeri depo değildir.
