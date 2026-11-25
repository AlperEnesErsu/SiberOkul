# SiberOkul v2 Uygulama Planı — Günlük oturum ve görünüm

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Siteyi tek bir günlük öğrenme oturumu etrafında yeniden kurmak; masaüstünü dolduran oyunlaştırılmış pano, kitap düzeninde okuma ekranları, XP/seviye/rozet ve tema düğmesi.

**Architecture:** Yeni hesaplar `src/lib/` altında saf fonksiyonlar (oyun.ts, oturum.ts); tarayıcı betikleri yalnız okur ve çizer. Oturum adımları kendi sayfalarında açılır, `?oturum` sorgusu ve localStorage'daki oturum kaydı ile adım çerçevesi gösterilir.

**Tech Stack:** Mevcut: Astro 7.4.10, TypeScript, Vitest 5.1.0.

**Spec:** `docs/superpowers/specs/2026-11-25-siberokul-v2-oturum-tasarim.md` (önceki: `2026-11-25-siberokul-design.md`)

## Global Constraints

- v1'in bütün kısıtları geçerli (Türkçe ASCII tanımlayıcılar, try/catch'li depolama, `BASE_URL`, `// Korur:` satırları, yalnız `src/lib/` testlenir).
- XP değerleri: ders 50; ilk puan bildim 10 / kismen 5 / bilemedim 0; sonraki günde yeniden puan 5; aynı gün ikinci puan 0; kart 10. Seviye `floor(XP/200)+1`.
- Kayıt geriye uyumlu: `surum` 1 kalır; yeni alanlar isteğe bağlı; eski kayıt ve yedek kodları geçerli.
- Kesme noktaları: telefon < 768px, tablet 768-1023px, masaüstü ≥ 1024px.
- Tema anahtarı `siberokul.tema` (`'acik' | 'koyu'`, yoksa sistem). `<html data-tema>` ile uygulanır; ilk boyamadan önce satır içi küçük betikle (yanıp sönme olmasın).
- Oturum anahtarı `siberokul.oturum`.

## Review Focus

1. Eski (v1) ilerleme kaydı ya da yedek kodu yeni alanlar olmadan gelir → okunur, XP doğru hesaplanır (ilkPuan = puan, puanSayisi = 1). (Görev 1-2 testi)
2. Dünden kalma oturum kaydı → yok sayılır, yeni oturum planlanır. (Görev 3 testi)
3. Oturum ortasında ders sayfası doğrudan (`?oturum` olmadan) açılır → normal ders sayfası; puanlar yine oturum kapısını karşılar. (Görev 3 testi: kapılar ilerleme kaydına bakar, sayfaya değil)
4. Bütün dersler bitmiş, tekrar yok, kart yok → oturum yalnız Isınma + Özet. (Görev 3 testi)
5. Bozuk oturum kaydı → yok sayılır, çökmez. (Görev 3 testi)

---

### Görev 1: Kayıt genişletme

**Files:** Modify `src/lib/ilerleme/model.ts`, `tekrar.ts`, `yedek.ts`; Test `tests/ilerleme/tekrar.test.ts`, `yedek.test.ts`

**Interfaces — Produces:**
- `SoruDurumu` + `ilkPuan?: Puan; puanSayisi?: number; sonGun?: Gun`.
- `Ilerleme` + `okunanKartlar?: string[]` (kart kimliği: `efsane:<id>` ya da `atolye:<id>`).
- `puanla(eski, puan, bugun)` artık `ilkPuan` (yeni soruda `puan`, sonra korunur), `puanSayisi` (yeni 1; `sonGun !== bugun` ise +1, aynı gün değişmez), `sonGun = bugun` da yazar. Seviye/sonraki kuralı aynen.
- `ilerlemeyiDogrula` isteğe bağlı alanları doğrular (varsa tipleri doğru olmalı).

- [ ] Testler: yeni soru → `{ilkPuan:'kismen', puanSayisi:1, sonGun:B}`; ertesi gün tekrar → `puanSayisi:2`, `ilkPuan` korunur; aynı gün ikinci puan → `puanSayisi` değişmez; v1 biçimli kayıt doğrulanır; `okunanKartlar: [1]` reddedilir. Mevcut tekrar testleri `toMatchObject` ile güncellenir. RED → uygula → GREEN → commit.

### Görev 2: XP, seviye, rozet

**Files:** Create `src/lib/oyun.ts`; Test `tests/oyun.test.ts`

**Interfaces — Produces:**
- `xpHesapla(i: Ilerleme): number`.
- `seviye(xp: number): { no: number; ad: string; buSeviyeXp: number; sonrakiIcin: number }` (`buSeviyeXp` = seviye içindeki XP, `sonrakiIcin` = 200).
- `SEVIYE_ADLARI: string[]` (spec'teki 10 ad; 10+ son ad).
- `type RozetKimligi = 'ilk-ders' | 'tam-hafta' | 'on-tekrar' | 'donem-bitti' | 'uc-hafta-seri'`; `ROZETLER: { kimlik: RozetKimligi; ad: string; aciklama: string; simge: string }[]`.
- `rozetler(i: Ilerleme, bolgeTamamlandi: boolean): RozetKimligi[]`.
- `tekrarSayisi(i)` = Σ(puanSayisi − 1).

- [ ] Testler: boş → 0 XP, seviye 1 "Çaylak"; 1 ders + bildim/kismen/bilemedim ilk puan → 65; puanSayisi 3 olan soru → ilk + 10; 2 okunan kart → +20; v1 kaydı (alansız) → ilkPuan=puan; 200 XP → seviye 2; 2500 XP → 10+ adı; rozetler: her biri sınırında açılır/açılmaz; `uc-hafta-seri` geçmişteki art arda 3 tam haftayla. RED → GREEN → commit.

### Görev 3: Oturum mantığı

**Files:** Create `src/lib/oturum.ts`; Test `tests/oturum.test.ts`

**Interfaces — Produces:**
- `type AdimTuru = 'isinma' | 'tekrar' | 'ders' | 'kart' | 'ozet'`.
- `interface KartOzet { kimlik: string /* efsane:x | atolye:x */; tur: 'efsane'|'atolye'; baslik: string; url: string; ilgiliDers?: string; no?: number }`.
- `interface Oturum { surum: 1; gun: Gun; adimlar: AdimTuru[]; konum: number; tekrarlar: string[]; ders: string | null; kart: string | null; baslangicXp: number; bitti: boolean }`.
- `oturumPlanla(dersler: DersOzet[], kartlar: KartOzet[], i: Ilerleme, bugun: Gun): Oturum`.
- `kartSec(kartlar, i, dersKimligi | null): string | null` (spec kuralı).
- `adimTamamMi(o: Oturum, i: Ilerleme, bugun: Gun): boolean` (isinma/ozet hep true; tekrar: bütün `tekrarlar` için `sonGun === bugun`; ders: `ders in bitenDersler`; kart: `okunanKartlar` içinde).
- `ilerlet(o, i, bugun): Oturum` (adım tamamsa konum+1; son adımda `bitti: true`).
- `OTURUM_ANAHTARI = 'siberokul.oturum'`; `oturumOku(bugun, depo?): Oturum | null` (yok/bozuk/eski gün → null); `oturumYaz(o, depo?): boolean`.

- [ ] Testler: boş ilerleme → `['isinma','ders','kart','ozet']`; tekrar varsa tekrar adımı ve listesi; her şey bitmiş → `['isinma','ozet']`; kart seçimi üç kural sırası; kapılar; ilerlet kapalı kapıda konumu değiştirmez; son adımda bitti; oturumOku dünkü/bozuk/yok → null; gidiş-dönüş. RED → GREEN → commit.

### Görev 4: Düzen, tema, gezinme

**Files:** Rewrite `src/layouts/Temel.astro`, `src/styles/genel.css`; Create `src/scripts/tema.ts`, `src/data/donem-gorsel.ts`

**Interfaces — Produces:**
- `Temel.astro` props `{ baslik; aciklama?; duzen?: 'pano' | 'okuma' }`; slot'lar: varsayılan, `sag` (yalnız pano).
- `DONEM_GORSEL: Record<number, { simge: string; renk: string }>` (8 dönem; renkler iki temada AA).
- Tema düğmesi (`#tema-dugmesi`), `tema.ts` tıklamada `data-tema`'yı değiştirir ve kaydeder.

- [ ] Uygula; 1440/768/375 genişlikte boş bir sayfayla kontrol; commit.

### Görev 5: Pano sayfaları

**Files:** Rewrite `src/pages/index.astro`, `src/scripts/bugun.ts`, `src/pages/yolculuk.astro`, `src/scripts/yolculuk.ts`, `src/pages/ilerleme.astro`; Create `src/components/DurumPaneli.astro`, `src/scripts/durum-paneli.ts`, `src/lib/kart-listesi.ts`

**Interfaces — Consumes:** Görev 2, 3. **Produces:** `kartOzetleri(): Promise<KartOzet[]>`; DersVerisi JSON'a `kartlar` eklenir.

Ana sayfa = oturum kapısı: üst şerit (🔥 seri · ⭐ XP · Seviye çubuğu); büyük kart: oturum yoksa "Bugünün oturumunu başlat (~N dk)" + adım önizlemesi, sürüyorsa "Kaldığın yerden devam et (Adım k/n)", bittiyse özet + "Yarın görüşürüz". Sağ panel: hafta halkası, tekrar sayısı, rozetler. Yolculuk: patika + dönem simge/renkleri + ders taşları.

- [ ] Uygula; tarayıcıda üç durumla (yeni, sürüyor, bitti) kontrol; commit.

### Görev 6: Oturum akışı ve kitap düzeni

**Files:** Create `src/pages/oturum.astro`, `src/scripts/oturum.ts`, `src/components/OturumCercevesi.astro`, `src/scripts/oturum-cercevesi.ts`; Modify ders, efsane, atölye sayfaları ve `src/scripts/ders.ts`

- `/oturum/`: konuma göre Isınma, Tekrar (bütün soruların metni ve cevabı sayfaya gömülü JSON'dan; aynı puanlama düğmeleri), Özet.
- Ders/kart sayfaları `?oturum` ile açıldığında solda adım listesi + altta "Sonraki adım →" (kapı açılınca etkin). Kart sayfalarında "Okudum ✓" düğmesi `okunanKartlar`'a ekler.
- Ders, efsane, atölye sayfaları `duzen="okuma"`: içindekiler / adım listesi solda yapışkan.

- [ ] Uygula; tam bir oturumu baştan sona tarayıcıda oyna; commit.

### Görev 7: Doğrulama ve inceleme

- [ ] 1440, 768, 375 × açık/koyu ekran görüntüleri; taşma, kontrast, odak halkası.
- [ ] `npm run check && npm run build`.
- [ ] Bağımsız son inceleme; Critical/Important düzeltilir (testle).
