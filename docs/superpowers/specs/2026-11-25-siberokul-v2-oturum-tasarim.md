# SiberOkul v2 — Günlük oturum ve görünüm yenilemesi

Tarih: 2026-11-25 · Durum: Onaylandı (Alper, 2026-11-25) · Önceki: `2026-11-25-siberokul-design.md`

## 1. Neden

İlk sürümü yerelde deneyen Alper'in geri bildirimi:

- Tema öğrenmeye katkı sağlamıyor.
- Masaüstünde site 46rem'lik dar bir sütunda kalıyor ve ekranın çoğu boş.
- Kullanıcı tek kişi ve siteyi her gün kullanacak. Sayfa sayfa gezmek istemiyor: o günün her şeyi
  tek bir öğrenme akışında önüne gelmeli.

## 2. Alper'in verdiği kararlar

1. **Görünüm:** Pano sayfaları (ana sayfa, Yolculuk, İlerleme) oyunlaştırılmış (A); ders ve okuma
   ekranları kitap/defter düzeninde (B).
2. **Günlük oturum:** Tek akış. Adımlar sırasıyla Isınma → Tekrar → Ders → Efsane/Atölye kartı → Özet.
   Ana sayfa oturumun kapısıdır: "Bugünün oturumunu başlat", "Kaldığın yerden devam et" ya da
   (bittiyse) özet ve "Yarın görüşürüz". Diğer sayfalar kalır, ama ikincildir.
3. **XP, seviye, rozet** eklendi; değerler bu belgedeki gibi.
4. **Açık/koyu tema** bir düğmeyle seçilir; seçim yoksa sistem tercihine uyar.

## 3. Düzen

- **Masaüstü (≥ 1024px):** Solda sabit, dar gezinme çubuğu (marka, Bugün, Yolculuk, Efsane mi?,
  Atölye, İlerleme; altta tema düğmesi). Pano sayfalarında sağda durum paneli (bu haftanın 5 günü,
  tekrar sayısı, son rozetler). Ana içerik ekranı doldurur.
- **Tablet (768-1023px):** Gezinme üstte yatay; sağ panel içeriğin altına iner.
- **Telefon (< 768px):** Gezinme alta sabit sekme çubuğu; tek sütun.
- **Okuma ekranları (ders, efsane, atölye, oturum adımları):** Varsayılan açık "kâğıt" zemin hissi
  (koyu temada da yumuşak zemin), okuma sütunu ~70 karakter. Solda yapışkan içindekiler / oturum adım
  listesi. Analoji kenar notu kutusu, terminal görevi pencere görünümlü.
- **Dönem kimliği:** Her dönemin bir rengi ve simgesi: 🐧 Linux, 🌐 Ağ, 🛡 Temeller, ⚙ DevOps,
  🧩 AppSec, 🏭 Pipeline, 📦 Container, ☁ Bulut.
- **Yolculuk:** Dönemler bir patika üzerinde bölge düğümleri; ders taşları (bitti / sıradaki / kilitli).

## 4. XP, seviye, rozet

XP ayrı bir sayaç olarak tutulmaz; ilerleme kaydından hesaplanır.

- Ders bitirmek: **50 XP**.
- Bir soru ilk kez puanlanınca: `bildim` **10**, `kismen` **5**, `bilemedim` **0**.
- Aynı soru sonraki bir günde yeniden puanlanınca (tekrar): puan ne olursa olsun **5**. Aynı gün ikinci
  puanlama XP vermez.
- Efsane/Atölye kartını okuyup işaretlemek: **10 XP** (kart başına bir kez).
- **Seviye** = `floor(XP / 200) + 1`. Adlar: 1 Çaylak, 2 Terminal Çırağı, 3 Kabuk Kaşifi,
  4 İzin Bekçisi, 5 Betik Ustası, 6 Ağ Gezgini, 7 Paket Avcısı, 8 Kale Mimarı, 9 Pipeline Bekçisi,
  10+ DevSecOps Adayı.
- **Rozetler:** İlk ders (1 ders bitti) · Tam hafta (herhangi bir haftada 5 çalışma günü) ·
  10 tekrar (toplam 10 tekrar puanlaması) · Dönem bitti (bir bölge tamamlandı) ·
  3 hafta seri (art arda 3 tam hafta, geçmişte herhangi bir zaman).

Kayıt biçimi geriye uyumlu genişler: soru durumuna isteğe bağlı `ilkPuan`, `puanSayisi`, `sonGun`;
ilerlemeye isteğe bağlı `okunanKartlar`. Eski kayıtlar ve yedek kodları geçerli kalır.

## 5. Oturum

- Oturum o günün ilk başlatılışında **planlanır ve saklanır** (ayrı localStorage anahtarı); gün
  boyunca sabit kalır. Ertesi gün yeni oturum.
- Plan: Isınma (her zaman) → Tekrar (bugün zamanı gelen soru varsa) → Ders (bitmemiş ders varsa) →
  Kart (okunmamış kart varsa) → Özet (her zaman).
- **Kart seçimi:** Bugünün dersine bağlı okunmamış efsane; yoksa en küçük numaralı okunmamış Atölye
  kaydı; yoksa okunmamış herhangi bir efsane; yoksa adım yok.
- **Geçiş kapıları:** Tekrar adımı, listedeki bütün sorular bugün puanlanınca; Ders adımı, ders
  bitirilince (bütün sorular puanlanmış); Kart adımı, "Okudum" işaretlenince geçilir.
- Oturum adımları kendi sayfalarında açılır (ders → ders sayfası, kart → efsane/atölye sayfası;
  ısınma, tekrar, özet → `/oturum/`). Oturumdayken bu sayfalarda solda adım listesi ve altta
  "Sonraki adım" görünür.
- Özet: oturumda kazanılan XP (başlangıç XP'si saklanır), seviye çubuğu, yeni rozetler, seri,
  yarının dersi.

## 6. Kapsam dışı

Ses, animasyonlu karakter, liderlik tablosu, hesap/senkron.

## 7. Doğrulama

- XP, seviye, rozet, oturum planı ve oturum kaydı saf fonksiyonlar; önce testle yazılır.
- 1440px, 768px, 375px genişlikte, açık ve koyu temada ekran görüntüsüyle kontrol.

## 8. Değişiklik (2026-11-25, Alper)

- **Koyu tema kaldırıldı.** Tek, açık tema; tema düğmesi yok.
- **XP ve seviye kaldırıldı.** Sayaç yok. Ana sayfada seri, biten ders ve rozet sayısı; oturum
  özetinde "bugün kaç soru puanladın, kaç ders bitirdin, bu hafta kaç gün". Rozetler (XP'ye bağlı
  değiller) kalıyor.
- Kayıt alanları (`ilkPuan`, `puanSayisi`, `sonGun`, `okunanKartlar`) kalıyor: tekrar sayısı, oturum
  kapıları ve özet bunlara dayanıyor.
