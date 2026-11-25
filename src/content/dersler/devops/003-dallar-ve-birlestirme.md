---
kimlik: devops-003
baslik: "Dallar ve birleştirme"
donem: 4
sira: 3
sure: 35
neden: "Takımlar her özelliği, her düzeltmeyi ayrı bir dalda geliştirir ve sonra ana dala birleştirir. CI hattı da genellikle dallar üzerinde çalışır. Birleştirme çakışmasını çözebilmek günlük işin parçasıdır."
analoji:
  baslik: "Ortak belgenin kopyası"
  metin: "Bir rapor üzerinde çalışırken ortak dosyayı bozmamak için kendine bir kopya alırsın, orada denersin. Beğenirsen değişikliklerini ana belgeye taşırsın. Dal (branch) bu kopyadır. Birleştirme (merge) taşıma işlemidir. İki kişi aynı paragrafı farklı değiştirdiyse çakışma çıkar. Sınır: Git kopya dosyalar çoğaltmaz, sadece hafif bir işaretçi ekler."
gorev:
  aciklama: "Yine `/tmp` altında, çöp bir depoda çalış. Önce küçük bir depo kur, sonra bilerek bir çakışma üret ve çöz:"
  komutlar:
    - mkdir -p /tmp/dal-deneme && cd /tmp/dal-deneme && git init -b main
    - git config user.name "Deneme" && git config user.email "deneme@example.com"
    - 'echo "renk: mavi" > ayar.txt && git add ayar.txt && git commit -m "ayar eklendi"'
    - git switch -c yesil-deneme
    - 'echo "renk: yesil" > ayar.txt && git commit -am "renk yesil yapildi"'
    - git switch main
    - 'echo "renk: kirmizi" > ayar.txt && git commit -am "renk kirmizi yapildi"'
    - git merge yesil-deneme
    - cat ayar.txt
  soru: "`git merge` çakışma bildirdi. `cat ayar.txt` ne gösteriyor ve işaretler (`<<<<<<<`, `=======`, `>>>>>>>`) neyi ayırıyor? Dosyayı düzeltip `git add ayar.txt` ve `git commit` ile birleştirmeyi bitir."
  telefon:
    soru: "Çakışma işaretlerinde `<<<<<<< HEAD` ile `=======` arasındaki kısım hangi dala aittir?"
    cevap: "Üzerinde bulunduğun dala (HEAD, yani birleştirmeyi yaptığın dal). `=======` ile `>>>>>>>` arasındaki kısım ise içeri aldığın daldan gelir."
sorular:
  - id: devops-003-s1
    soru: "Dal (branch) açmanın faydası nedir?"
    cevap: "Ana dalı bozmadan bir özelliği ya da düzeltmeyi izole geliştirirsin. İş bitip test edilince ana dala birleştirirsin; olmazsa dalı atarsın."
  - id: devops-003-s2
    soru: "`git switch -c yeni` ne yapar?"
    cevap: "`yeni` adında bir dal oluşturur (`-c` create) ve hemen o dala geçer."
  - id: devops-003-s3
    soru: "Birleştirme çakışması ne zaman çıkar?"
    cevap: "İki dalda aynı satırlar farklı biçimde değiştirildiyse Git hangisinin doğru olduğuna karar veremez ve seni çağırır. Farklı dosyalardaki ya da farklı satırlardaki değişiklikler kendiliğinden birleşir."
  - id: devops-003-s4
    soru: "Çakışmayı çözerken işaretleri dosyada bırakırsan ne olur?"
    cevap: "`<<<<<<<` gibi satırlar kodun parçası olur; yapılandırma bozulur ya da program derlenmez. Çözümden sonra işaretlerin hepsini silip son hali kendin yazmalısın."
derinDalis:
  - tur: kitap
    baslik: "Pro Git, 'Git Branching' bölümü"
    ayrinti: "Dal ve birleştirme mantığının ayrıntılı anlatımı."
    url: "https://git-scm.com/book/en/v2"
  - tur: lab
    baslik: "Learn Git Branching"
    ayrinti: "Dalları görsel olarak deneyebileceğin etkileşimli bir oyun (arama motorunda adıyla bulabilirsin)."
---

Git'te **dal** (branch), bir commit'i gösteren hafif bir isimdir. Yeni dal açmak dosyaları kopyalamaz; yalnız yeni bir işaretçi oluşturur. Bu yüzden saniyeler sürer ve ucuzdur. Varsayılan dal genellikle `main` adını taşır.

### Temel komutlar

| Komut | Anlamı |
|---|---|
| `git branch` | Dalları listele |
| `git switch -c ozellik` | Yeni dal aç ve geç |
| `git switch main` | Var olan dala geç |
| `git merge ozellik` | `ozellik` dalını bulunduğun dala birleştir |
| `git branch -d ozellik` | Birleşmiş dalı sil |

### Tipik çalışma akışı

1. `main` güncel olsun.
2. `git switch -c giris-formu` ile dal aç.
3. Küçük commitler at.
4. İş bitince `main`e birleştir (ileride bunu PR ile yapacağız).
5. Dalı sil.

### Birleştirme türleri

Eğer `main` dalı, sen dal açtığından beri hiç ilerlemediyse Git yalnız işaretçiyi öne alır: buna **ileri sarma** (fast-forward) denir. `main` de ilerlediyse Git iki tarihçeyi bir **birleştirme commit'iyle** (merge commit) bağlar.

### Çakışma (conflict)

İki dalda **aynı satır** farklı değiştirildiyse Git bilemez ve durur. Dosyaya işaretler koyar:

```text
<<<<<<< HEAD
renk: kirmizi
=======
renk: yesil
>>>>>>> yesil-deneme
```

Yapman gerekenler:

1. Dosyayı aç, hangi sürümün (ya da ikisinin karışımının) doğru olduğuna karar ver.
2. Üç işaret satırını da sil.
3. `git add dosya` ile "çözdüm" de.
4. `git commit` ile birleştirmeyi bitir.

Vazgeçmek istersen `git merge --abort` birleştirmeden önceki duruma döner.

Çakışma bir hata değil, Git'in "burada insan kararı lazım" demesidir. Küçük, kısa ömürlü dallar çakışmayı azaltır.

Güvenlik notu: Çakışma çözerken güvenlikle ilgili bir satırı (örneğin yetki kontrolü) alelacele silme. "İkisini de al" ya da "benimkini al" refleksiyle kontrol kaldırılan çakışmalar gerçek açıkların kaynağı olmuştur. Emin değilsen değişikliği yapan kişiye sor.
