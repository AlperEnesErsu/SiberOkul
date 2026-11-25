---
kimlik: devops-006
baslik: "GitHub Actions'a giriş"
donem: 4
sira: 6
sure: 35
neden: "GitHub Actions, CI/CD hattını depodaki bir YAML dosyasıyla tanımlamanı sağlar. DevSecOps'ta güvenlik taramalarını, testleri ve dağıtımı hep böyle dosyalarda tanımlarsın; bu dosyalar da kod gibi incelenmelidir."
analoji:
  baslik: "Yemek tarifi ve otomatik mutfak"
  metin: "Workflow bir tarifedir: hangi olayda (sipariş geldi) hangi adımlar (doğra, pişir, tabağa koy) çalışır. Runner, tarifi uygulayan mutfak robotudur. Tarif depodadır, yani herkes okuyabilir ve değiştirmek için onay gerekir. Sınır: robot her seferinde temiz bir mutfakta başlar; önceki yemeğin artıkları kalmaz."
gorev:
  aciklama: "Bu görevde GitHub'a hiçbir şey göndermiyorsun; yalnız örnek bir workflow dosyası yazıp yapısını okuyacaksın. Dosyayı `/tmp` altında oluştur:"
  komutlar:
    - mkdir -p /tmp/actions-deneme/.github/workflows && cd /tmp/actions-deneme
    - "printf 'name: Selam\\non:\\n  push:\\n    branches: [main]\\njobs:\\n  merhaba:\\n    runs-on: ubuntu-latest\\n    steps:\\n      - run: echo Merhaba\\n' > .github/workflows/selam.yml"
    - cat .github/workflows/selam.yml
  soru: "Dosyada `on`, `jobs`, `runs-on` ve `steps` satırları sırasıyla neyi söylüyor?"
  telefon:
    soru: "`on: pull_request` yazan bir workflow'u hangi olay çalıştırır? `on: push` ile farkı ne?"
    cevap: "`pull_request` bir PR açıldığında ya da güncellendiğinde çalışır. `push` bir dala commit gönderildiğinde çalışır."
sorular:
  - id: devops-006-s1
    soru: "Workflow, job ve step arasındaki hiyerarşi nedir?"
    cevap: "Workflow bir olayla tetiklenen bütün süreçtir. İçinde bir ya da daha fazla job (iş) vardır; her job bir runner üzerinde çalışır. Job'ın içinde sırayla çalışan step'ler (adımlar) bulunur."
    ipucu: "En dıştan en içe düşün: bütün süreç, iş, komut."
  - id: devops-006-s2
    soru: "Workflow dosyaları depoda nerede durur?"
    cevap: "`.github/workflows/` klasöründe, `.yml` ya da `.yaml` uzantılı dosyalar olarak."
    ipucu: "Klasör adı noktayla başlar ve GitHub'a özeldir."
  - id: devops-006-s3
    soru: "`push`, `pull_request` ve `schedule` tetikleyicilerinin farkı nedir?"
    cevap: "`push` commit gönderilince, `pull_request` PR açılınca ya da güncellenince, `schedule` cron ifadesiyle zamana bağlı olarak çalıştırır."
    ipucu: "Üçü: commit gelince, PR açılınca, saat gelince."
  - id: devops-006-s4
    soru: "Workflow dosyasındaki bir değişiklik neden güvenlik açısından incelenmelidir?"
    cevap: "Workflow kod çalıştırır ve sırlara erişebilir. Kötü niyetli bir değişiklik sırları dışarı sızdırabilir, bu yüzden workflow dosyaları da kod gibi PR ile incelenir."
    ipucu: "Workflow dosyasının hangi yetkilerle çalıştığını düşün."
  - id: devops-006-s5
    soru: "Bir PR'da workflow dosyasına `uses: yeni-kullanici/hizli-tarama@v1` satırı eklenmiş ve bu job depo sırlarına erişiyor. İnceleyen olarak ne yaparsın?"
    cevap: "Eylemin sahibini ve kaynağını araştırırım; güvenilir değilse reddederim. Kabul edilecekse etiket yerine commit SHA ile sabitlenmesini ve job'ın sırlara ve token izinlerine yalnız gerektiği kadar erişmesini isterim. Workflow değişikliği kod çalıştırma yetkisi değişikliğidir."
    ipucu: "`@v1` etiketinin sonradan neye işaret edebileceğini düşün."
derinDalis:
  - tur: okuma
    baslik: "GitHub Actions'ı anlamak"
    ayrinti: "Workflow, event, job, step ve runner kavramlarının resmi tanımı."
    url: "https://docs.github.com/en/actions/get-started/understanding-github-actions"
hizliKontrol:
  - soru: "Aynı workflow içindeki birden fazla job varsayılan olarak nasıl çalışır?"
    secenekler: 
      - "Sırayla, biri bitince diğeri"
      - "Paralel olarak"
      - "Yalnız ilki çalışır"
      - "Elle seçilir"
    dogru: 1
    aciklama: "Job'lar varsayılan olarak paraleldir; sıra istenirse bağımlılık tanımlanır. Step'ler ise job içinde sıralıdır."
    ipucu: "Hız için varsayılan nedir?"
  - soru: "Bir workflow'u elle başlatmak için hangi tetikleyici kullanılır?"
    secenekler: 
      - "push"
      - "schedule"
      - "pull_request"
      - "workflow_dispatch"
    dogru: 3
    aciklama: "`workflow_dispatch` elle başlatmadır; `schedule` zamana bağlı çalıştırır."
    ipucu: "Adındaki \"dispatch\" sözcüğüne dikkat et."
sikHatalar:
  - hata: "Üçüncü taraf eylemi `@v4` gibi etiketle çağırıp güvenli saymak."
    dogrusu: "Etiket sonradan başka koda taşınabilir; sır kullanan hatlarda commit SHA ile sabitle."
  - hata: "Workflow YAML'ını \"sadece ayar dosyası\" sanıp incelemeden geçirmek."
    dogrusu: "Workflow kod çalıştırır ve sırlara erişebilir; kod gibi PR ile incele."
terimler:
  - "Workflow"
  - "Runner"
  - "GitHub Action"
  - "Pipeline"
sema:
  baslik: "Bir workflow nasıl çalışır"
  adimlar:
    - etiket: "Olay"
      aciklama: "Push, PR ya da zamanlayıcı gibi bir olay olur."
    - etiket: "Tetiklenme"
      aciklama: "`on:` bölümü eşleşen workflow'u başlatır."
    - etiket: "Runner"
      aciklama: "Her job için temiz bir makine hazırlanır."
    - etiket: "Job'lar"
      aciklama: "Job'lar varsayılan olarak paralel çalışır."
    - etiket: "Step'ler"
      aciklama: "Her job içinde adımlar sırayla çalışır."
    - etiket: "Sonuç"
      aciklama: "Hepsi geçerse yeşil, biri düşerse kırmızı işaret görünür."
olay:
  baslik: "tj-actions/changed-files eyleminin ele geçirilmesi"
  yil: 2025
  ozet: "Mart 2025'te çok kullanılan bir GitHub eylemi olan tj-actions/changed-files ele geçirildi. Eylemi çalıştıran workflow'larda erişim anahtarları, GitHub kişisel erişim token'ları, npm token'ları ve özel RSA anahtarları gibi sırlar Actions günlüklerinden okunabilecek hale geldi. CISA olayı CVE-2025-30066 olarak duyurdu."
  ders: "Hazır eylem, hattında çalışan başkasının kodudur ve sırlarına erişebilir. Eylemleri bilerek seç, güvenmediğini kullanma ve böyle bir olayda etkilenen sırları hemen döndür; CISA da bunu önerdi."
  kaynak: 
    ad: "CISA: tj-actions/changed-files ve reviewdog/action-setup tedarik zinciri ihlali"
    url: "https://www.cisa.gov/news-events/alerts/2025/03/18/supply-chain-compromise-third-party-tj-actionschanged-files-cve-2025-30066-and-reviewdogaction"
---

**GitHub Actions**, GitHub'ın kendi CI/CD hizmetidir. Bir olay olduğunda (ör. push) depoda tanımlı bir iş akışını GitHub'ın sunduğu sanal makinelerde çalıştırır.

### Kavramlar

- **Olay (event):** Bir şeyin olması: push, PR açılması, zamanlayıcı, elle başlatma.
- **Workflow:** Bir olayla tetiklenen, YAML dosyasıyla tanımlanmış süreç.
- **Job (iş):** Aynı makinede (runner) çalışan adımlar grubu. Birden fazla job varsayılan olarak paralel çalışır.
- **Step (adım):** Bir komut (`run`) ya da hazır bir eylem (`uses`, action).
- **Runner:** İşi çalıştıran makine. `ubuntu-latest` GitHub'ın barındırdığı Ubuntu'dur.

### Örnek

```yaml
name: Selam
on:
  push:
    branches: [main]
jobs:
  merhaba:
    runs-on: ubuntu-latest
    steps:
      - run: echo Merhaba
```

Okuyuşu: "`main` dalına push gelirse, Ubuntu'lu bir makinede `merhaba` adlı işi çalıştır; tek adımı `echo Merhaba` komutu."

### Hazır eylemler (actions)

`uses: actions/checkout@v4` gibi bir satır, başkasının yazdığı bir eylemi çağırır. Bu örnekte `checkout`, depo kodunu runner'a indirir. Hazır eylemler işi kolaylaştırır ama dışarıdan kod çalıştırmak demektir.

### Tetikleyiciler

| Tetikleyici | Ne zaman |
|---|---|
| `push` | Bir dala commit gelince |
| `pull_request` | PR açılınca ya da güncellenince |
| `schedule` | Cron ifadesiyle belirli zamanlarda |
| `workflow_dispatch` | Elle başlatınca |

### Temizlik ve kapsam

Her çalıştırma temiz bir makinede başlar. Dosyalar, önceki çalıştırmadan gelmez (önbellek ayrı bir konudur, devops-007).

Güvenlik notu: Üçüncü taraf eylemleri `@v4` gibi etiketle çağırmak, etiketin sonradan başka koda taşınabileceği anlamına gelir. Özellikle sır kullanan hatlarda eylemleri commit karmasıyla (SHA) sabitlemek ve yalnız güvendiğin kaynakları kullanmak iyi bir alışkanlıktır.
