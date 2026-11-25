# SiberOkul Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Günlük derslerle DevSecOps yolunu yürüten, tarayıcıda ilerleme tutan statik Astro sitesi; ilk 2 ders, Atölye kayıtları ve "Efsane mi?" kartlarıyla, yerelde çalışır halde.

**Architecture:** İçerik `src/content/` altında Markdown + zod şemalı frontmatter; Astro bunu build'de saf HTML'e çevirir. Tarayıcıda çalışan kod yalnız ilerleme mantığıdır (`src/lib/ilerleme/` saf fonksiyonlar + `src/scripts/` sayfa bağlayıcıları). Testler yalnız `src/lib/` saf fonksiyonlarına.

**Tech Stack:** Astro `7.4.10`, TypeScript, Vitest `5.1.0`, Node 24 (yerelde v24.22.1), GitHub Actions + GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-25-siberokul-design.md`

## Global Constraints

- Dil: arayüz ve içerik Türkçe, sade. Kod tanımlayıcıları Türkçe, ASCII (ör. `bugunSec`, `seriHesapla`).
- Sürümler tam sabitlenir (`"astro": "7.4.10"`, `"vitest": "5.1.0"`), aralık (`^`) yok.
- Sunucu, veritabanı, hesap, giriş yok. Tarayıcıda çalışan kod yalnız `src/scripts/*` ve onların içe aktardığı `src/lib/*`.
- localStorage erişimi her zaman try/catch içinde; erişilemezse site çalışır, ilerleme boş görünür.
- Yayın adresi `https://alperenesersu.github.io/SiberOkul/`; Astro `site` ve `base: '/SiberOkul'`. Tüm iç bağlantılar `import.meta.env.BASE_URL` ile kurulur.
- Ders/kitap metinleri özgün yazılır; kitaplar yalnız "hangi bölümü oku" olarak anılır.
- Her "Efsane mi?" kartında en az 1 kaynak URL'si.
- Telefon genişliğinde (≈400px) okunabilir; açık/koyu tema `prefers-color-scheme` ile.
- Test politikası: yalnız `src/lib/` testlenir; her testin üstünde `// Korur: ...` satırı.
- Astro 7 API'leri (content layer `glob` loader, `astro/zod`, `render`) kurulan sürümün dokümanına göre doğrulanır; plan imzaları kavramsaldır.

## Review Focus

1. localStorage kapalı ya da içinde bozuk JSON var → site açılır, ilerleme boş görünür, hata fırlamaz. (Görev 4 testi)
2. Bozuk, kesik ya da başka sürüm yedek kodu yapıştırılır → reddedilir, mevcut ilerleme ezilmez. (Görev 4 testi)
3. Tarih hesabı ay/yıl sınırında ve saat dilimi farkında kayar → gün ekleme ve hafta başı her zaman YYYY-MM-DD üzerinde UTC ile yapılır. (Görev 3 testi)
4. İlerlemede artık var olmayan bir ders/soru kimliği → "Bugün" bunu yok sayar, çökmez. (Görev 3 testi)
5. Yayımlanan bütün dersler bitti → "Bugün" ders yerine "Yeni ders yarın burada" der, tekrarları yine gösterir. (Görev 3 testi + Görev 6 arayüzü)

---

### Görev 1: Proje iskeleti, temel düzen, CI

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `.nvmrc` (`24`)
- Create: `src/layouts/Temel.astro` (başlık, gezinme: Bugün · Yolculuk · Efsane mi? · Atölye · İlerleme)
- Create: `src/styles/genel.css` (renk/tipografi değişkenleri, açık + koyu)
- Create: `src/pages/index.astro` (geçici "SiberOkul" sayfası)
- Create: `.github/workflows/kontrol.yml`, `.github/pull_request_template.md`
- Create: `vitest.config.ts`, `tests/duman.test.ts`

**Interfaces:**
- Produces: `Temel.astro` props `{ baslik: string; aciklama?: string }`, `<slot />`. npm betikleri: `dev`, `build`, `preview`, `test` (`vitest run`), `check` (`astro check && vitest run`).

- [ ] **Adım 1:** `package.json`'u tam sürümlerle yaz: `astro@7.4.10`, `vitest@5.1.0`, `@astrojs/check@0.9.12`, `typescript`. `npm install`.
- [ ] **Adım 2:** `astro.config.mjs`: `site: 'https://alperenesersu.github.io'`, `base: '/SiberOkul'`, `trailingSlash: 'always'`.
- [ ] **Adım 3:** `Temel.astro` + `genel.css`. Görsel dil uygulayıcının; kullanıcının tasarım kuralları için `design-flow` becerisini yükle. Gezinme bağlantıları `BASE_URL` ile.
- [ ] **Adım 4:** `tests/duman.test.ts`: `// Korur: test altyapısının çalıştığını` + `expect(1 + 1).toBe(2)`. Çalıştır: `npm test` → PASS.
- [ ] **Adım 5:** `npm run build` → `dist/index.html` oluşur, hata yok.
- [ ] **Adım 6:** `kontrol.yml`: `push` (main) ve `pull_request`'te Node 24, `npm ci`, `npm run check`, `npm run build`. Yayın adımı yok (Görev 10).
- [ ] **Adım 7:** PR şablonu: `## Ne`, `## Nasıl`, `## Neden`, `İlgili Atölye kaydı:` satırları.
- [ ] **Adım 8:** Commit: `chore: Astro iskeleti, temel düzen ve CI`.

---

### Görev 2: İçerik şemaları ve dönem verisi

**Files:**
- Create: `src/content.config.ts`
- Create: `src/data/donemler.ts`
- Create: `src/lib/icerik.ts`, `tests/icerik.test.ts`

**Interfaces:**
- Produces:
  - Koleksiyonlar `dersler` (`src/content/dersler/**/*.md`), `efsaneler`, `atolye`.
  - Ders frontmatter: `kimlik` (`/^[a-z]+-\d{3}$/`, ör. `linux-001`), `baslik`, `donem` (1-8), `sira` (int ≥1), `sure` (dk), `neden` (string), `analoji: { baslik, metin }`, `gorev: { aciklama, komutlar: string[], soru }`, `sorular: { id, soru, cevap }[]` (en az 3; her `id` `^<kimlik>-s\d+$`), `derinDalis?: { tur: 'kitap'|'lab'|'okuma', baslik, ayrinti, url? }[]`. Gövde = Kavram bölümü.
  - Efsane frontmatter: `iddia`, `hukum: 'dogru'|'kismen'|'yanlis'`, `ozet`, `analoji?`, `kaynaklar: { ad, url }[]` (en az 1), `ilgiliDers?` (kimlik), `tarih`.
  - Atölye frontmatter: `no` (int), `baslik`, `tarih`, `sorun`, `secenekler: { ad, aciklama, secildi: boolean }[]`, `neden`, `bedel`, `yoklamaSorusu: { soru, cevap }`, `ilgiliDers?`.
  - `donemler.ts`: `export const DONEMLER: Donem[]`, `Donem = { no: number; slug: string; ad: string; planlananDers: number; aciklama: string }`. Değerler: `1 linux "Linux + Bash" 40`, `2 ag "Ağ" 25`, `3 temeller "Güvenlik temelleri" 25`, `4 devops "Git, CI/CD, Docker" 25`, `5 appsec "Uygulama güvenliği" 25`, `6 pipeline "Pipeline güvenliği" 20`, `7 container "Container, Kubernetes, IaC" 25`, `8 bulut "Bulut ve izleme" 20`.
  - `icerik.ts`: `soruKimlikleriniDenetle(dersler: { kimlik: string; sorular: { id: string }[] }[]): void` (tekrar eden ders kimliği ya da soru id'si varsa `Error` fırlatır, mesajda çakışan kimlik geçer); `sirala<T extends { donem: number; sira: number }>(d: T[]): T[]`.

- [ ] **Adım 1:** `tests/icerik.test.ts` yaz:
  - `// Korur: aynı soru id'sinin iki derste kullanılmasını` → iki derste `linux-001-s1` → `toThrow(/linux-001-s1/)`.
  - `// Korur: aynı ders kimliğinin iki dosyada kullanılmasını` → `toThrow(/linux-002/)`.
  - `// Korur: ders sırasının dönem, sonra sıra ile kurulmasını` → `[{donem:2,sira:1},{donem:1,sira:2},{donem:1,sira:1}]` → `[{1,1},{1,2},{2,1}]`.
- [ ] **Adım 2:** `npm test` → FAIL (modül yok).
- [ ] **Adım 3:** `icerik.ts`, `donemler.ts`, `content.config.ts` yaz. Soru id ön eki kuralı şemada `superRefine` ile.
- [ ] **Adım 4:** `npm test` → PASS.
- [ ] **Adım 5:** Şema kapısını doğrula: `src/content/dersler/linux/999-deneme.md` dosyasına 2 soruluk ders koy, `npm run build` → şema hatası ("sorular" en az 3). Dosyayı sil, build tekrar geçer.
- [ ] **Adım 6:** Commit: `feat(icerik): ders, efsane ve atölye şemaları`.

---

### Görev 3: İlerleme mantığı — tarih, tekrar, seri, Bugün

**Files:**
- Create: `src/lib/ilerleme/tarih.ts`, `model.ts`, `tekrar.ts`, `seri.ts`, `bugun.ts`
- Test: `tests/ilerleme/tarih.test.ts`, `tekrar.test.ts`, `seri.test.ts`, `bugun.test.ts`

**Interfaces:**
- Produces:
  - `tarih.ts`: `type Gun = string` (YYYY-MM-DD); `bugunStr(d?: Date): Gun` (yerel takvim günü); `gunEkle(g: Gun, n: number): Gun`; `gunFarki(a: Gun, b: Gun): number` (b − a); `haftaBasi(g: Gun): Gun` (Pazartesi).
  - `model.ts`: `type Puan = 'bildim'|'kismen'|'bilemedim'`; `interface SoruDurumu { puan: Puan; seviye: number; sonraki: Gun }`; `interface Ilerleme { surum: 1; bitenDersler: Record<string, Gun>; sorular: Record<string, SoruDurumu>; calisilanGunler: Gun[] }`; `bosIlerleme(): Ilerleme`.
  - `tekrar.ts`: `ARALIKLAR = [1, 3, 7, 14, 30, 60]`; `puanla(eski: SoruDurumu | undefined, puan: Puan, bugun: Gun): SoruDurumu`.
  - `seri.ts`: `HAFTALIK_HEDEF = 5`; `seriHesapla(calisilanGunler: Gun[], bugun: Gun): { seriHafta: number; buHaftaGun: number }`.
  - `bugun.ts`: `interface DersOzet { kimlik: string; baslik: string; donem: number; sira: number; sure: number; url: string; soruIdleri: string[] }`; `bugunSec(dersler: DersOzet[], ilerleme: Ilerleme, bugun: Gun): { ders: DersOzet | null; tekrarlar: string[] }`; `dersiBitir(i: Ilerleme, kimlik: string, bugun: Gun): Ilerleme` (bitenDersler'e ve calisilanGunler'e tekil ekler).

Tekrar kuralı (tam):
- `bilemedim` → `seviye 0`, `sonraki = bugun + 1`.
- `kismen` → seviye değişmez (yeni soruda 0), `sonraki = bugun + ARALIKLAR[seviye]`.
- `bildim` → `seviye = min((eski?.seviye ?? 0) + 1, 5)`, `sonraki = bugun + ARALIKLAR[seviye]`.

Seri kuralı (tam): hafta Pazartesi başlar. `buHaftaGun` = bugünün haftasındaki tekil çalışılan gün sayısı. `seriHafta` = bugünün haftasından önceki haftalardan geriye doğru kesintisiz ≥5 günlük hafta sayısı; bu hafta ≥5 ise ona +1. Bu haftanın <5 olması seriyi bozmaz (hafta sürüyor).

`bugunSec`: `ders` = sıralı listede `bitenDersler`'de olmayan ilk ders (yoksa `null`). `tekrarlar` = `ilerleme.sorular` içinde `sonraki <= bugun` olan ve bir `DersOzet.soruIdleri` içinde hâlâ bulunan id'ler, `sonraki`'ye göre artan.

- [ ] **Adım 1:** Testleri yaz (her birinin üstünde `// Korur:`):
  - tarih: `gunEkle('2026-12-31', 1) === '2027-01-01'`; `gunEkle('2028-02-28', 1) === '2028-02-29'`; `gunEkle('2026-03-01', -1) === '2026-02-28'`; `gunFarki('2026-11-25','2026-12-02') === 7`; `haftaBasi('2026-11-29') === '2026-11-23'` (Pazar → Pazartesi); `haftaBasi('2026-11-23') === '2026-11-23'`; `bugunStr(new Date(2026, 10, 25, 23, 59)) === '2026-11-25'`.
  - tekrar: yeni + bilemedim, `bugun '2026-11-25'` → `{seviye:0, sonraki:'2026-11-26'}`; yeni + kismen → `{0, '2026-11-26'}`; yeni + bildim → `{1, '2026-11-28'}`; seviye 2 + bildim → `{3, '2026-12-09'}`; seviye 5 + bildim → `{5, +60 gün}`; seviye 3 + bilemedim → `{0, +1}`; seviye 3 + kismen → `{3, +14}`.
  - seri: boş → `{0,0}`; bugün `2026-11-25` (Çarşamba), önceki iki haftada 5'er gün, bu hafta 2 gün → `{seriHafta:2, buHaftaGun:2}`; önceki hafta 4 gün, ondan önceki 5 → `{0, ...}`; bu hafta 5 gün + önceki 1 hafta 5 → `{2,5}`; aynı gün iki kez listede → bir sayılır.
  - bugun: hiç bitmemiş → ilk ders; `linux-001` bitmiş → `linux-002`; hepsi bitmiş → `ders: null`; tekrar zamanı gelmiş `linux-001-s2` (`sonraki` dün) → `tekrarlar` içinde; ilerlemede `silinmis-001-s1` var → yok sayılır, hata yok; `sonraki` yarın olan dahil edilmez.
- [ ] **Adım 2:** `npm test` → FAIL.
- [ ] **Adım 3:** Modülleri yaz. Tarih aritmetiği `Date.UTC` ile YYYY-MM-DD üzerinde; yalnız `bugunStr` yerel saati okur.
- [ ] **Adım 4:** `npm test` → PASS.
- [ ] **Adım 5:** Commit: `feat(ilerleme): aralıklı tekrar, seri ve Bugün seçimi`.

---

### Görev 4: Depo ve yedek kodu

**Files:**
- Create: `src/lib/ilerleme/depo.ts`, `src/lib/ilerleme/yedek.ts`
- Test: `tests/ilerleme/depo.test.ts`, `tests/ilerleme/yedek.test.ts`

**Interfaces:**
- Consumes: `Ilerleme`, `bosIlerleme` (Görev 3).
- Produces:
  - `depo.ts`: `ANAHTAR = 'siberokul.ilerleme'`; `ilerlemeOku(depo?: Storage | null): Ilerleme`; `ilerlemeYaz(i: Ilerleme, depo?: Storage | null): boolean` (başarısızsa `false`). Varsayılan depo `globalThis.localStorage` (erişim de try/catch içinde).
  - `yedek.ts`: `ONEK = 'SO1.'`; `class YedekHatasi extends Error`; `yedekKoduOlustur(i: Ilerleme): string` (`ONEK` + JSON'un UTF-8 base64url'i); `yedekKodunuCoz(kod: string): Ilerleme` (boşlukları kırpar; önek, base64, JSON, `surum === 1` ve alan tiplerini doğrular; değilse `YedekHatasi`).
  - `ilerlemeyiDogrula(x: unknown): x is Ilerleme` `yedek.ts` içinde; `depo.ts` de bunu kullanır.

- [ ] **Adım 1:** Testleri yaz:
  - `// Korur: localStorage yoksa sitenin boş ilerlemeyle açılmasını` → `ilerlemeOku(null)` → `bosIlerleme()`.
  - `// Korur: getItem hata fırlatırsa çökmemeyi` → `getItem` fırlatan sahte depo → `bosIlerleme()`.
  - `// Korur: bozuk JSON'un boş ilerleme sayılmasını` → `'{bozuk'` → `bosIlerleme()`.
  - `// Korur: yazma başarısızlığının bildirilmesini` → `setItem` fırlatır → `false`.
  - `// Korur: yaz/oku gidiş-dönüşü` → aynı nesne.
  - `// Korur: yedek kodunun gidiş-dönüşü (Türkçe karakter dahil)` → kimlik `'linux-001'`, `calisilanGunler` dolu → eşit.
  - `// Korur: yanlış önek, kesik kod, geçersiz JSON, surum 2, eksik alanın reddi` → her biri `toThrow(YedekHatasi)`.
  - `// Korur: başta/sonda boşluklu kodun kabulü`.
- [ ] **Adım 2:** `npm test` → FAIL.
- [ ] **Adım 3:** Modülleri yaz. base64url için `TextEncoder` + `btoa`; Node'da da çalışır.
- [ ] **Adım 4:** `npm test` → PASS.
- [ ] **Adım 5:** Commit: `feat(ilerleme): tarayıcı deposu ve yedek kodu`.

---

### Görev 5: Ders sayfası

**Files:**
- Create: `src/pages/dersler/[...slug].astro`
- Create: `src/components/Analoji.astro`, `TerminalGorevi.astro`, `Sorular.astro`, `DerinDalis.astro`, `HataBildir.astro`
- Create: `src/scripts/ders.ts`

**Interfaces:**
- Consumes: koleksiyon `dersler`, `sirala`, `soruKimlikleriniDenetle` (Görev 2); `ilerlemeOku`, `ilerlemeYaz` (Görev 4); `puanla`, `dersiBitir`, `bugunStr` (Görev 3).
- Produces: ders adresi `${BASE_URL}dersler/<kimlik>/` (ör. `/SiberOkul/dersler/linux-001/`). Görev 6 bu biçimi kullanır.

Sayfa sırası (spec): üst bilgi (dönem · ders no · süre · önceki/sonraki) → **Neden önemli** → **Kavram** (gövde) → **Analoji** → **Terminal görevi** (komutlar kopyalanabilir `<pre>`) → **Sorular** → **Derin dalış** → **Dersi bitirdim** → Hata bildir.

Davranış (`ders.ts`):
- Her soruda "Cevabı göster" düğmesi; açılınca `Bildim / Kısmen / Bilemedim` görünür; seçim `puanla` ile kaydedilir.
- Bütün sorular puanlanmadan "Dersi bitirdim" `disabled`; yanında "Önce soruları puanla (2/4)" sayacı.
- Bitirince `dersiBitir`; düğme "Bitti ✓ · Sıradaki ders →" olur. Ders zaten bitmişse sayfa bu halde açılır, puanlar yeniden verilebilir.
- `ilerlemeYaz` `false` dönerse: "İlerleme kaydedilemedi (tarayıcı depolaması kapalı olabilir)" uyarısı.
- JS kapalıyken sorular ve cevaplar `<details>` ile okunabilir kalır.

`HataBildir.astro`: `https://github.com/AlperEnesErsu/SiberOkul/issues/new?labels=ders-hatasi&title=` + `encodeURIComponent('Hata: ' + kimlik)`.

`getStaticPaths` içinde `soruKimlikleriniDenetle` çağrılır (çakışma build'i durdurur).

- [ ] **Adım 1:** Bileşenleri ve sayfayı yaz; geçici bir test dersiyle `npm run dev`.
- [ ] **Adım 2:** Tarayıcıda doğrula: puanlamadan bitir düğmesi kapalı; hepsi puanlanınca açılır; sayfa yenilenince durum korunur; DevTools'ta `localStorage` anahtarı `siberokul.ilerleme` görünür; telefon genişliğinde taşma yok.
- [ ] **Adım 3:** `npm run check && npm run build` → geçer.
- [ ] **Adım 4:** Commit: `feat(ders): ders sayfası, puanlama kapısı ve hata bildirimi`.

---

### Görev 6: Ana sayfa (Bugün), Yolculuk haritası, İlerleme sayfası

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/pages/yolculuk.astro`, `src/pages/ilerleme.astro`
- Create: `src/components/Harita.astro`, `src/components/Takvim.astro`
- Create: `src/scripts/bugun.ts`, `src/scripts/yolculuk.ts`, `src/scripts/ilerleme-sayfasi.ts`
- Create: `src/lib/ders-listesi.ts`

**Interfaces:**
- Consumes: `DersOzet`, `bugunSec`, `seriHesapla` (Görev 3); `ilerlemeOku`, `ilerlemeYaz`, `yedekKoduOlustur`, `yedekKodunuCoz`, `YedekHatasi` (Görev 4); `DONEMLER` (Görev 2).
- Produces: `dersOzetleri(): Promise<DersOzet[]>` (`ders-listesi.ts`, sıralı). Sayfalar bunu `<script type="application/json" id="ders-listesi">` olarak gömer; istemci betikleri buradan okur.

Ana sayfa (spec taslağı): üstte seri (`🔥 N hafta · bu hafta X/5`); **BUGÜN** kartı (ders no, başlık, süre, soru sayısı, "Derse başla →"); varsa **Tekrar** kartı ("Bugün tekrar edilecek N soru", her biri dersine bağlantılı); **Yolculuk** şeridi (dönem başına ilerleme çubuğu, `bitmiş / planlananDers`); son Atölye kaydı bağlantısı. `ders: null` ise "Yayımlanan bütün dersleri bitirdin. Yeni ders yarın burada." JS kapalıyken: ilk ders bağlantısı statik olarak görünür.

Yolculuk: 8 dönem bölge olarak (SVG ya da CSS ızgara; çizim uygulayıcının). Bölge durumu: o dönemde biten ders yoksa ve önceki dönem bitmediyse `kilitli`; bütün yayımlanmış dersleri bitti ve yayımlanan = planlanan ise `tamamlandi`; aksi halde `devam`. Bölgeye tıklayınca o dönemin yayımlanmış ders listesi.

İlerleme sayfası: son 26 haftalık takvim (gün başına kare, çalışılan gün dolu); seri özeti; **Yedek**: "Kodu kopyala", "Dosya olarak indir" (`siberokul-yedek-YYYY-MM-DD.txt`), "Kodu yapıştır → Geri yükle". Geri yüklemeden önce onay satırı ("Mevcut ilerlemenin yerine geçecek: N ders, M soru. Onayla"); `YedekHatasi`'nda "Bu kod okunamadı, mevcut ilerlemen değişmedi."

- [ ] **Adım 1:** `ders-listesi.ts` ve sayfaları yaz.
- [ ] **Adım 2:** Tarayıcıda doğrula: boş ilerlemede Bugün = Ders 001; 001'i bitirince Bugün = 002; bir soruyu "Bilemedim" yapıp sistem tarihini ertesi güne alınca (ya da DevTools'ta `sonraki`yi dünü yapınca) Tekrar kartı görünür; yedek kodunu kopyala → `localStorage.clear()` → yapıştır → ilerleme geri gelir; bozuk kod → hata mesajı, ilerleme değişmez.
- [ ] **Adım 3:** `npm run check && npm run build` → geçer.
- [ ] **Adım 4:** Commit: `feat: Bugün ana sayfası, Yolculuk haritası ve İlerleme sayfası`.

---

### Görev 7: "Efsane mi?" ve Atölye sayfaları

**Files:**
- Create: `src/pages/efsaneler/index.astro`, `src/pages/efsaneler/[slug].astro`
- Create: `src/pages/atolye/index.astro`, `src/pages/atolye/[slug].astro`
- Create: `src/components/HukumRozeti.astro`

**Interfaces:**
- Consumes: koleksiyonlar `efsaneler`, `atolye` (Görev 2).

Efsane kartı (spec taslağı): İDDİA → HÜKÜM rozeti (✅ Doğru / ⚠ Kısmen / ❌ Yanlış; renk + metin, yalnız renk değil) → özet → analoji → kaynaklar → ilgili ders bağlantısı. Liste sayfasında hükme göre filtre gerekmez (YAGNI).

Atölye kaydı: Karar NNN · tarih · başlık → SORUN → SEÇENEKLER (seçilen işaretli) → NEDEN → BEDELİ → "Kendini yokla" (`<details>`; puanlanmaz) → ilgili ders. Liste `no`'ya göre azalan.

- [ ] **Adım 1:** Sayfaları ve rozeti yaz; geçici birer içerikle `npm run dev`'de bak.
- [ ] **Adım 2:** `npm run check && npm run build` → geçer.
- [ ] **Adım 3:** Commit: `feat: Efsane mi? ve Atölye bölümleri`.

---

### Görev 8: İlk içerik

**Files:**
- Create: `docs/mufredat/donem-1-linux.md`
- Create: `src/content/dersler/linux/001-ubuntuya-merhaba.md`, `src/content/dersler/linux/002-<slug>.md`
- Create: `src/content/atolye/001-statik-site.md` … `008-zamanlanmis-gorev.md`
- Create: `src/content/efsaneler/gizli-sekme.md`, `mac-virus.md`, `uzun-parola.md`

İçerik kuralları:
- **Dönem 1 listesi:** 40 ders, her satır `NNN · Başlık — tek satır amaç`. Sıra: WSL/Ubuntu'yu açmak, nerede olduğunu anlamak → gezinme → dosya/dizin işlemleri → metin görüntüleme → yardım alma (`man`, `--help`) → izinler → kullanıcı/grup → süreçler → paket yönetimi (`apt`) → servisler (`systemctl`) → loglar (`journalctl`, `/var/log`) → boru hattı ve yönlendirme → `grep`/`find` → ortam değişkenleri → bash betiği temelleri → SSH ve anahtarlar → cron → Bandit seviyelerine bağlı alıştırmalar. Son dersler bir mini proje: kendi log özetleme betiğini yazmak (LogSentry'ye köprü).
- **Ders 001:** "Ubuntu'ya merhaba": Windows'tan WSL'de Ubuntu-22.04'ü açmak (`wsl`), istem satırını okumak (`kullanici@makine:~$`), `pwd`, `whoami`, `ls`. Neden önemli: DevSecOps'ta sunucuların büyük çoğunluğu Linux. 4 soru.
- **Ders 002:** Listeden 002. 3-5 soru.
- Her derste `derinDalis` içinde kitap bölümü ve gerekiyorsa Bandit seviyesi. Kitap adları/baskıları web'den doğrulanır (*The Linux Command Line*, Shotts — ücretsiz sürümün resmi adresi; *How Linux Works*, Ward, 3. baskı). Kitaptan metin kopyalanmaz.
- **Atölye 001-008:** spec'teki kararlar: 001 statik site (Astro; Next.js+Supabase ve düz HTML elendi), 002 ana sayfa "Bugün" önce, 003 ilerleme tarayıcıda + 4 geliştirme, 004 "Efsane mi?" kapsamı, 005 WSL2 pratik ortamı, 006 boş repoyu yeniden kullanmak, 007 test politikası (neden yalnız `src/lib/`), 008 zamanlanmış görev + otomatik birleşme. Her biri `yoklamaSorusu` ile; dil sıfırdan başlayan biri için.
- **Efsaneler:** gizli sekme (`kismen`), "Mac'e virüs bulaşmaz" (`yanlis`), "Uzun parola karmaşık paroladan iyidir" (hükmü kaynaklara göre ver; NIST SP 800-63B). Kaynaklar birincil (NIST, Apple/Google resmi yardım sayfaları), URL'ler açılıp doğrulanır.

- [ ] **Adım 1:** Kitap ve kaynak URL'lerini web'den doğrula; doğrulanamayanı kullanma.
- [ ] **Adım 2:** Dosyaları yaz; geçici test içeriklerini sil.
- [ ] **Adım 3:** `npm run build` → şema hatası yok; `npm run dev`'de her sayfayı aç: Ders 001, 002, 8 Atölye, 3 Efsane; Yolculuk'ta Linux bölgesi `2/40`.
- [ ] **Adım 4:** Commit: `content: Dönem 1 listesi, ilk iki ders, Atölye 001-008, üç efsane`.

---

### Görev 9: Tampon hesabı ve günlük görev talimatı

**Files:**
- Create: `src/data/baslangic.ts` (`export const BASLANGIC: Gun = '2026-11-25'`; Görev 10'da ilk yayın günüyle güncellenir)
- Create: `src/lib/tampon.ts`, `tests/tampon.test.ts`
- Create: `scripts/tampon.mjs` (yayımlanmış ders dosyalarını sayar, sonucu JSON basar)
- Create: `docs/rutin/gunluk-ders.md`

**Interfaces:**
- Consumes: `gunFarki` (Görev 3).
- Produces: `TAMPON = 2`; `tamponEksigi(baslangic: Gun, bugun: Gun, mevcutDers: number): number` = `max(0, gunFarki(baslangic, bugun) + TAMPON − mevcutDers)`. `node scripts/tampon.mjs` çıktısı: `{"gerekli":N,"mevcut":M,"eksik":K}`; npm betiği `tampon`.

- [ ] **Adım 1:** Testler: `// Korur: ilk gün 2 dersin yetmesini` → `tamponEksigi('2026-11-25','2026-11-25',2) === 0`; 3 gün sonra 2 ders → `3`; fazla ders → `0`; başlangıçtan önceki tarih → `0`.
- [ ] **Adım 2:** `npm test` → FAIL; `tampon.ts` yaz; → PASS.
- [ ] **Adım 3:** `scripts/tampon.mjs`; `npm run tampon` → `{"gerekli":2,"mevcut":2,"eksik":0}` (başlangıç günü).
- [ ] **Adım 4:** `docs/rutin/gunluk-ders.md`: zamanlanmış görevin talimatı, adım adım:
  1. `main`'i çek, `npm ci`, `npm run tampon`.
  2. Açık `ders-hatasi` etiketli issue varsa önce onları düzelt (ayrı PR, issue'yu PR'da `Fixes #N` ile kapat).
  3. `eksik > 0` ise `docs/mufredat/` listesindeki sıradaki yayımlanmamış dersleri yaz (en çok `eksik` kadar); şema ve içerik kuralları Görev 8'deki gibi; kitap metni kopyalanmaz.
  4. `npm run check && npm run build` geçmeli.
  5. `ders/<kimlik>` dalında PR aç ("Ne / Nasıl / Neden"), auto-merge'ü aç.
  6. `eksik == 0` ve açık hata yoksa hiçbir şey yapmadan bitir.
  7. Dönem listesi bitmek üzereyse (son 3 ders) sonraki dönemin listesini yazıp ayrı PR aç.
- [ ] **Adım 5:** Commit: `feat(tampon): ders tamponu hesabı ve günlük görev talimatı`.

---

### Görev 10: Yayın ve zamanlanmış görev (kullanıcının yerel testinden SONRA)

Bu görev dışa dönük işler içerir; kullanıcı yerelde test edip onay verene kadar başlamaz. Her alt adım ayrı onay ister.

**Files:**
- Create: `.github/workflows/yayinla.yml`
- Modify: `src/data/baslangic.ts` (ilk yayın günü)

- [ ] **Adım 1:** `yayinla.yml`: `main`'e push'ta `npm ci`, `npm run check`, `npm run build`, `actions/upload-pages-artifact` + `actions/deploy-pages`. İzinler en dar: `pages: write`, `id-token: write`, `contents: read`.
- [ ] **Adım 2 (onay):** `git push origin main`.
- [ ] **Adım 3 (onay):** Repo ayarları: Pages kaynağı "GitHub Actions"; "Allow auto-merge" açık; `main` için kural: `kontrol` işi geçmeden birleşme yok. `ders-hatasi` etiketi oluştur.
- [ ] **Adım 4:** Yayını doğrula: `https://alperenesersu.github.io/SiberOkul/` açılır, Ders 001 bağlantısı çalışır.
- [ ] **Adım 5 (onay):** `schedule` becerisiyle her sabah 07:00 (Europe/Istanbul) çalışan bulut görevi; talimat `docs/rutin/gunluk-ders.md`'yi okuyup uygulamak.
- [ ] **Adım 6:** `BASLANGIC`'ı yayın günüyle güncelle, PR ile birleştir.
