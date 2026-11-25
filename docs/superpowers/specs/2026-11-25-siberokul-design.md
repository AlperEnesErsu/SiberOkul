# SiberOkul — Tasarım Belgesi

Tarih: 2026-11-25 · Durum: Onay bekliyor

## 1. Amaç ve neden

SiberOkul, Alper'in kendi siber güvenlik okulu: sıfırdan başlayıp **DevSecOps mühendisi** olmaya giden
yolu günlük derslerle yürüten, GitHub'da duran statik bir web sitesi.

Neden:

- Hedef net: DevSecOps mühendisi olmak. Bunu belirleyecek olan şey, her gün siteyi açıp ~30 dakika çalışmak.
- Alper eski projelerde "neyi neden yaptık" takibini kaybettiğini söyledi. Bu proje, süreci görünür
  kılmayı kendi parçası yapar: her teknik karar sade Türkçeyle sitede yazılı durur (Atölye).
- Önceki projeler (Undustit, AISigner) panel, rol, auth ve yasal metinlerle büyüyüp bakım işine döndü.
  Bu proje bilerek küçük kalır.

Başarı: Alper siteyi açınca bugün ne yapacağını bilir, dersi bitirir, unuttuğu sorular geri gelir;
aylar içinde Linux → Ağ → Temeller → DevOps → AppSec → Pipeline → Container/IaC → Bulut yolunu yürür.

## 2. Hedefler, hedef olmayanlar, anti-hedefler

**Hedefler**

- Günlük ders: kavram, analoji, terminal görevi, kendini puanlanan sorular, isteğe bağlı derin dalış.
- "Bugün" odaklı ana sayfa; `/yolculuk` sayfasında dönemleri bölge olarak gösteren harita.
- Tarayıcıda tutulan ilerleme; aralıklı tekrar, seri, takvim, yedek kodu.
- "Efsane mi?" bölümü: teknoloji ve güvenlik iddialarına kaynaklı hüküm.
- "Atölye" bölümü: her teknik kararın ne/neden/bedel kaydı.
- Dersler her zaman Alper'in önünde: o N. gündeyken N+1 hazır.

**Hedef olmayanlar**

- Başka kullanıcılar, hesap, giriş, sunucu, veritabanı.
- Tarayıcı içinde Linux terminali (pratik WSL2 Ubuntu'da yapılır).
- Genel kültür (sağlık, tarih vb.) iddiaları. "Efsane mi?" yalnız teknoloji ve güvenlik.
- Başlangıçta güvenlik taramaları, e2e testler, coverage eşikleri. Bunlar Dönem 4-6'da Alper'in eliyle,
  ders olarak eklenir.

**Anti-hedefler** (çalışsa bile başarısızlık sayılır)

- Site, ders yazmaktan çok bakım isteyen bir platforma dönüşürse.
- Kitap içeriği kopyalanırsa. Ders metinleri, sorular ve analojiler özgün yazılır; kitaplar yalnız
  "hangi bölümü oku" olarak anılır.
- "Efsane mi?" kartında kaynaksız hüküm.
- Seri sistemi bir günü kaçırınca her şeyi sıfırlayıp bıraktırırsa.

## 3. Kısıtlar

- Alper sıfır bilgi varsayımıyla başlar; dil Türkçe, sade.
- Pratik ortamı: Windows üzerinde WSL2, Ubuntu 22.04 (kurulu; `docker-desktop` da var).
- Repo: `github.com/AlperEnesErsu/SiberOkul` (boş `BrickByBrick` deposu yeniden adlandırıldı), public,
  `main` dalı. Yerel kopya `C:\dev\SiberOkul`.
- Yayın: GitHub Pages (`alperenesersu.github.io/SiberOkul`, alt yol `base` ayarı gerektirir).
- Telefonda da okunabilir olmalı.

## 4. Değerlendirilen yaklaşımlar

| Yaklaşım | Artısı | Bedeli | Karar |
|---|---|---|---|
| **A) Astro + Markdown dersler + GitHub Pages** | Ders = bir dosya = bir commit; sunucu/DB yok, saldırı yüzeyi küçük | İlerleme tek cihazda | **Seçildi** |
| B) Next.js + Supabase | Hesap, senkron ilerleme | Tek kullanıcı için fazla; auth/RLS yüzeyi; "platform şişmesi" | Elendi |
| C) Düz HTML/JS, build yok | Öğrenecek yeni şey yok | Ders yazmak yorucu, içerik kontrolü yok | Elendi |

İlerleme için: **localStorage (geliştirilmiş)** seçildi; git'te not dosyası yöntemi daha zahmetli
bulundu. Zayıf yanlar (kaybolma, "bitirdim"in hiçbir şey kanıtlamaması) yedek kodu ve puanlama
kapısıyla kapatıldı.

Ana sayfa için: "Bugün önce" seçildi; harita ayrı sayfada; terminal havası ders görevlerinde.

## 5. Alper'in verdiği kararlar

1. Web sitesi (oyun değil), ama harita ile oyun hissi korunur.
2. Ana sayfa "Bugün" odaklı; harita `/yolculuk`'ta.
3. "Efsane mi?" bölümü, yalnız teknoloji ve güvenlik iddiaları. Hüküm: ✅ Doğru / ⚠ Kısmen / ❌ Yanlış,
   açıklama, analoji, kaynak, ilgili ders.
4. Ders sayfası yapısı (sırasıyla): Neden önemli → Kavram → Analoji → Terminal görevi → Sorular →
   Derin dalış → "Dersi bitirdim".
5. İlerleme tarayıcıda, şu dört geliştirmeyle:
   1. Her soru cevabı açıldıktan sonra `Bildim / Kısmen / Bilemedim` diye puanlanır; hepsi
      puanlanmadan "Dersi bitirdim" açılmaz.
   2. Aralıklı tekrar: zayıf sorular sonraki günlerde "Bugün"de geri gelir.
   3. Tek tıkla yedek kodu / dosyası; başka cihazda yapıştırınca geri yüklenir.
   4. GitHub tarzı çalışma takvimi; seri kuralı: haftada 5 gün çalışıldıysa seri sürer.
   Ders içi not alanı sonraya bırakıldı.
6. Atölye: ilk ay kayıtları Claude yazar, her kaydın sonunda bir "kendini yokla" sorusu olur;
   Dönem 4'ten itibaren "Neden" kısmını Alper yazar. PR açıklamaları "Ne / Nasıl / Neden" başlıklı ve
   ilgili Atölye kaydına bağlı.
7. Müfredat (DevSecOps hedefli, 8 dönem):
   1. Linux + Bash · 2. Ağ · 3. Güvenlik temelleri · 4. Git, CI/CD, Docker · 5. Uygulama güvenliği ·
   6. Pipeline güvenliği · 7. Container, Kubernetes, IaC · 8. Bulut ve izleme.
   GitShield ve LogSentry bitirme projeleri olarak müfredata bağlanır.
8. Günlük ders biçimi: çekirdek ~30 dk (1 kavram, 1 analoji, 1 terminal görevi, 3-5 soru) + isteğe
   bağlı derin dalış (kitap bölümü, lab, OverTheWire Bandit / TryHackMe).
9. Teknik yapı (aşağıda) ve test politikası: test yalnız `ilerleme.ts` mantığına.
10. İçerik akışı: ilk yüklemede 2 günlük ders; sonrasında dersleri Claude yazar, Alper uğraşmaz;
    Alper N. derste iken N+1 hazır olur. Tetikleyici her sabah çalışan zamanlanmış görev; ders PR'ları
    CI geçince otomatik birleşir (ayrıntı: bölüm 7).

## 6. Teknik tasarım

```
SiberOkul/
├── src/
│   ├── content/
│   │   ├── dersler/<donem>/<NNN>-<slug>.md
│   │   ├── efsaneler/<slug>.md
│   │   └── atolye/<NNN>-<slug>.md
│   ├── content.config.ts      içerik şemaları (zod)
│   ├── pages/
│   │   ├── index.astro         /            Bugün
│   │   ├── yolculuk.astro      /yolculuk    harita
│   │   ├── dersler/[...slug].astro
│   │   ├── efsaneler/index.astro, [slug].astro
│   │   ├── atolye/index.astro, [slug].astro
│   │   └── ilerleme.astro      /ilerleme    takvim, seri, yedek
│   ├── components/            Soru, Analoji, TerminalGorevi, Harita, Takvim, ...
│   └── scripts/ilerleme.ts    tarayıcıda çalışan tek kod
├── tests/ilerleme.test.ts
└── .github/workflows/yayinla.yml
```

**İçerik ve kod ayrı.** Günlük iş yalnız `src/content/` altına bir `.md` eklemektir.

**Şema bir kapıdır.** Ders frontmatter'ı zorunlu alanlar: `baslik`, `donem` (1-8), `sira`,
`sure` (dk), `neden`, `sorular` (en az 3; her biri `id`, `soru`, `cevap`), isteğe bağlı `derinDalis`
(kitap/bölüm, lab bağlantısı). Soru `id` biçimi `<donem-slug>-<NNN>-s<k>` (ör. `linux-013-s2`) ve site
genelinde tekil olmalı. Eksik/yanlış alan build'i durdurur ("fail fast").
Efsane şeması: `iddia`, `hukum` (`dogru|kismen|yanlis`), `kaynaklar` (en az 1 URL), isteğe bağlı
`ilgiliDers`. Atölye şeması: `baslik`, `tarih`, `sorun`, `secenekler`, `karar`, `neden`, `bedel`,
`yoklamaSorusu`, isteğe bağlı `ilgiliDers`.

**Tarayıcı kodu.** Sayfalar saf HTML; yalnız `ilerleme.ts` çalışır. localStorage erişimi try/catch
içinde; veri yoksa/okunamazsa site yine çalışır, ilerleme boş görünür.

**İlerleme verisi** (localStorage, sürümlü tek anahtar):

- Biten dersler ve bitiş tarihleri.
- Her soru için son puan, tekrar seviyesi, sonraki tekrar tarihi.
- Çalışılan günler (takvim ve seri için).

**"Bugün"**: sıradaki bitmemiş ders + bugün tekrarı gelen sorular.

**Yedek kodu**: ilerleme verisinin sürüm alanlı, sıkıştırılmış/kodlanmış metni; dosya olarak indirme
ve metin olarak kopyalama; içe aktarmada sürüm ve biçim doğrulanır, bozuksa mevcut veri ezilmez.

**Test politikası.** Yalnız `ilerleme.ts` içindeki hesaplara birim testi: aralıklı tekrar tarihleri,
seri kuralı, "Bugün" seçimi, yedek kodu gidiş-dönüş ve bozuk kod reddi. Her testin üstünde "bu test
neyi korur" satırı. Sayfa görünümleri test edilmez.

**CI / yayın.** `main`'e push ve PR'da: kurulum, build (şema kontrolü dahil), testler. `main`'de
başarılıysa GitHub Pages'e yayın.

## 7. İçerik akışı (Claude'un önde yazması)

- İlk yükleme: Linux Ders 001 ("Ubuntu'ya merhaba": WSL'i açmak, nerede olduğunu anlamak) ve Ders 002;
  Atölye 001-006 (bu belgedeki kararlar); 2-3 "Efsane mi?" kartı.
- Sonrası: Alper'in ilerlemesi tarayıcıda olduğundan Claude onu göremez. Bu yüzden takvime dayalı tampon:
  yayımlanmış ders sayısı her zaman `başlangıçtan beri geçen gün + 2` veya üstünde tutulur. Alper günde
  bir ders yaptıkça önünde hep en az bir ders hazır olur; daha hızlı giderse Claude'dan ek ders ister.
- **Tetikleyici (Alper'in kararı): zamanlanmış görev.** Her sabah bulutta bir Claude görevi çalışır:
  1. Başlangıç tarihini (ilk yayın günü, repoda sabit olarak durur) ve yayımlanmış ders sayısını okur.
  2. Tampon eksikse Dönem 1 ders listesindeki sıradaki dersi yazar, bir dal açıp PR gönderir
     ("Ne / Nasıl / Neden" şablonuyla).
  3. Açık "Hata bildir" issue'su varsa önce onu düzeltir.
- **Ders PR'ları otomatik birleşir**: CI (şema kontrolü + build + testler) geçerse auto-merge. Alper
  dersleri yayından önce okumaz; bunun dengesi her ders sayfasındaki **"Hata bildir"** bağlantısıdır
  (ders kimliği önceden doldurulmuş bir GitHub issue açar).
- Bedel: her çalışma Claude kullanım hakkından harcar. Görev yalnız tampon eksikse ders yazar; değilse
  hemen biter.

## 8. Claude'un verdiği kararlar (Alper düzeltebilir)

- **Atölye "kendini yokla" soruları puanlanmaz.** Sayfada "önce düşün, sonra aç" olarak durur;
  aralıklı tekrara ve "Bugün"e girmez. Neden: ilerleme sistemi tek içerik türüyle (dersler) basit kalır.
- **Müfredat dönem dönem ayrıntılanır.** İlk planda yalnız Dönem 1 (Linux + Bash) için sıralı ders
  listesi (~40 ders, başlık + tek satır amaç) çıkarılır. Diğer dönemler, öncekinin sonuna gelince
  ayrıntılanır. Dönem adları, sıraları ve planlanan ders sayıları `src/content/donemler` (veya eşdeğer
  veri dosyası) içinde durur; harita bunu okur. Ders kimlikleri (`linux-013`) yayımlandıktan sonra
  değişmez; araya ders eklenirse yeni numara alır, yeniden numaralandırma yapılmaz.
- **Kod değişiklikleri PR ile** ("Ne / Nasıl / Neden" şablonu, `.github/pull_request_template.md`).
  CI şablonu denetlemez; şablon yol göstericidir.

## 9. Builder'a kalanlar

- Görsel tasarım (renkler, tipografi, harita çizimi), karanlık mod, erişilebilirlik ayrıntıları.
- Aralıklı tekrar aralıklarının tam değerleri ve `Kısmen` puanının etkisi.
- Harita bölgelerinin durum kuralı (tamamlandı / devam / kilitli) ayrıntısı.
- Seri kuralının hafta sınırı tanımı.
- Yedek kodunun biçimi.
- Kitap önerilerinin güncel baskılarının doğrulanması (ders yazarken).
