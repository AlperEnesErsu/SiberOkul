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
  - id: devops-006-s2
    soru: "Workflow dosyaları depoda nerede durur?"
    cevap: "`.github/workflows/` klasöründe, `.yml` ya da `.yaml` uzantılı dosyalar olarak."
  - id: devops-006-s3
    soru: "`push`, `pull_request` ve `schedule` tetikleyicilerinin farkı nedir?"
    cevap: "`push` commit gönderilince, `pull_request` PR açılınca ya da güncellenince, `schedule` cron ifadesiyle zamana bağlı olarak çalıştırır."
  - id: devops-006-s4
    soru: "Workflow dosyasındaki bir değişiklik neden güvenlik açısından incelenmelidir?"
    cevap: "Workflow kod çalıştırır ve sırlara erişebilir. Kötü niyetli bir değişiklik sırları dışarı sızdırabilir, bu yüzden workflow dosyaları da kod gibi PR ile incelenir."
derinDalis:
  - tur: okuma
    baslik: "GitHub Actions'ı anlamak"
    ayrinti: "Workflow, event, job, step ve runner kavramlarının resmi tanımı."
    url: "https://docs.github.com/en/actions/get-started/understanding-github-actions"
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
