# SiberOkul içerik yazım rehberi

Bu rehber ders, bölge sınavı ve "Efsane mi?" kartı yazan herkes (insan ya da ajan) içindir.

## Okur

Alper: sıfırdan başlayan, hedefi **DevSecOps mühendisi** olmak. Çoğunlukla **telefondan** okuyacak;
terminal görevlerini bilgisayarda (Windows + WSL2, Ubuntu 22.04) yapacak. Dil **sade Türkçe**.
Teknik terimin İngilizcesini ilk geçtiği yerde parantez içinde ver: "kimlik doğrulama (authentication)".

## Program

`docs/mufredat/program.md`: her dersin kimliği, başlığı ve amacı orada. Sırayı ve kimlikleri değiştirme.
Bir ders yalnız kendi amacını anlatır; önceki derslerde anlatılanı kısaca hatırlatabilir, sonrakileri
anlatmaz.

## Ders dosyası

Yol: `src/content/dersler/<bolge-slug>/<NNN>-<kisa-slug>.md` (ör. `ag/004-dns.md`).
Örnekler: `src/content/dersler/linux/001-ubuntuya-merhaba.md`, `002-dizin-agacinda-gezinmek.md`.
Şema: `src/content.config.ts` (koleksiyon `dersler`). Frontmatter alanları:

- `kimlik`: programdaki kimlik (ör. `ag-004`).
- `baslik`: programdaki başlık.
- `donem`: bölge numarası (1-8). `sira`: NNN'nin sayısı (ör. 4).
- `sure`: 20-40 dk.
- `neden`: 2-3 cümle; bu konu bir DevSecOps mühendisinin işinde nerede karşısına çıkar.
- `analoji`: `{ baslik, metin }`. Günlük hayattan, tek bir net benzetme; sınırını da söyle.
- `gorev`: `{ aciklama, komutlar: [...], soru, telefon: { soru, cevap } }`.
  - Komutlar WSL/Ubuntu'da **güvenle** çalıştırılabilir olmalı (zarar vermeyen, ev dizininde ya da
    `/tmp` altında). Gerçek bir sisteme saldırı, izinsiz tarama yok. Docker/Kubernetes/bulut
    derslerinde kurulum gerektiren komutlarda ne kurulacağını `aciklama`da söyle; bulut derslerinde
    ücret doğurabilecek bir şey yaptırma (yerel araç, okuma, örnek JSON/YAML üzerinde çalışma tercih et).
  - **`telefon` zorunlu**: telefondan okurken yapılabilecek bir düşünme sorusu, ör. "Bu komutun çıktısı
    ne olur ve neden?" ya da verilen bir çıktıyı yorumlama. `cevap` net olsun.
- `sorular`: **4 soru**, `id` biçimi `<kimlik>-s<n>` (ör. `ag-004-s1`). Ezber değil anlama soruları;
  cevaplar 1-3 cümle.
- `derinDalis`: 1-3 öğe `{ tur: kitap|lab|okuma, baslik, ayrinti, url? }`. URL yalnız `https://` ve
  **sen açıp doğruladıysan** (WebFetch ile). Doğrulayamadığın URL'yi koyma; kitabı URL'siz an.
  Kitap bölüm numarası/adı emin değilsen bölüm verme, konu adını ver.

Gövde (frontmatter'dan sonra) = **Kavram** bölümü: 350-700 kelime Markdown. Kısa paragraflar,
gerekiyorsa küçük tablo ya da kod bloğu. Başlık seviyesi en çok `###`. Ham HTML ve `<script>` yok.
Sonda bir "Güvenlik notu:" paragrafı olabilir.

Frontmatter metinlerinde kod için ters tırnak kullanılabilir (`` `ls -l` ``), ekranda kod olarak görünür.
YAML'da iki nokta, tırnak ya da `#` içeren metinleri çift tırnak içine al; çift tırnak içinde çift
tırnak gerekiyorsa `\"` kullan.

## Bölge sınavı

Yol: `src/content/sinavlar/<bolge-slug>.md` (yalnız frontmatter). Şema koleksiyon `sinavlar`:

```yaml
---
donem: 2
baslik: "Ağ bölgesi sınavı"
sorular:
  - soru: "..."
    secenekler: ["...", "...", "...", "..."]
    dogru: 1        # 0'dan başlar
    aciklama: "Doğru cevap neden doğru, yaygın yanlış neden yanlış."
---
```

- **18 soru**, bölgenin bütün derslerine yayılmış (her dersten en az 1).
- 4 seçenek; tek doğru. Doğru şıkkın yeri sorudan soruya değişsin (hepsi aynı harf olmasın).
- Yanlış şıklar inandırıcı olsun ama tartışmasız yanlış olsun. "Hepsi/hiçbiri" kullanma.
- Senaryolu sorular tercih: "Bir sunucuda şunu gördün, ne yaparsın?"

## Efsane mi? kartı

Yol: `src/content/efsaneler/<slug>.md`. Örnekler: `gizli-sekme.md`, `mac-virus.md`, `uzun-parola.md`.
Alanlar: `iddia`, `hukum` (dogru|kismen|yanlis), `ozet`, `analoji`, `kaynaklar` (en az 1, **birincil
kaynak**: resmi dokümantasyon, standart kurumu, üretici güvenlik sayfası; WebFetch ile açıp iddiayı
desteklediğini doğrula), `ilgiliDers` (bu bölgeden bir ders kimliği), `tarih: "2026-11-25"`.
Gövde 120-250 kelime. Hüküm kaynağa dayansın; kaynak desteklemiyorsa kartı yazma.

## Yapma

- Kitaplardan ya da sitelerden metin kopyalama; her şey özgün yazılır. Alıntı en fazla tek cümle,
  tırnak içinde ve kaynaklı.
- Uydurma komut seçeneği, uydurma CVE numarası, uydurma URL.
- Başka bölgenin dosyalarına dokunma. `git` komutu çalıştırma. Build çalıştırma (paralel çalışan başka
  yazarlar var); yalnız kendi dosyalarını oluştur.

## Zenginleştirme alanları (ders frontmatter'ı)

Mevcut derslere eklenir; var olan alanlara, `kimlik`'e ve soru `id`'lerine dokunulmaz.

- **`sorular[].ipucu`** (her soruya): Cevabı söylemeden düşünmeye yön veren tek cümle. Ör. "`ls -l`
  çıktısının ilk sütununu hatırla." Cevabı ele veren ipucu yazma.
- **Senaryo sorusu**: Her derse bir 5. soru ekle (`id`: `<kimlik>-s5`). Gerçek iş durumu: "Gece 3'te
  şu log satırını gördün, ilk ne yaparsın?" Cevap 2-4 cümle, `ipucu` da olsun.
- **`hizliKontrol`** (1-2 soru): Kavram bölümünü okuyunca cevaplanabilen çoktan seçmeli sorular.
  `{ soru, secenekler: [4 adet], dogru (0'dan), aciklama, ipucu }`. Doğru şıkkın yeri değişsin; doğru
  şık hep en uzun şık olmasın. Sınav sorularını kopyalama.
- **`sikHatalar`** (1-3): `{ hata, dogrusu }`. Yeni başlayanın gerçekten yaptığı hata ve doğrusu.
- **`olay`** (yalnız gerçekten ilgili, kaynağı doğrulanabilen bir olay varsa): `{ baslik, yil, ozet,
  ders, kaynak: { ad, url } }`. `ozet` 2-3 cümle ne oldu; `ders` bu olayın bu dersle bağı. Kaynak
  **birincil** olsun (kurumun açıklaması, resmi rapor, CISA/NIST, mahkeme/düzenleyici belgesi ya da
  güvenilir haber kuruluşu) ve WebFetch ile açılıp doğrulanmış olsun. Emin değilsen `olay` koyma.
  Rakam ve tarih uydurma.
- **`sema`** (süreç anlatan derslerde: el sıkışma, istek akışı, pipeline adımları vb.): `{ baslik,
  adimlar: [{ etiket, aciklama }] }`, 3-8 adım. Etiket kısa, açıklama tek cümle.
- **`terimler`** (3-8): Bu derste geçen ve sözlükte tanımlı terimlerin **tam adları**
  (`src/content/sozluk/<bolge>.md` içindeki `terim` ile birebir aynı yazım).

## Sınav ipuçları

`src/content/sinavlar/<bolge>.md` içindeki her soruya `ipucu` ekle: hangi kavramı düşünmesi gerektiğini
söyler, doğru şıkkı ele vermez. Soruların sırasına, şıklarına ve `dogru` değerine dokunma.

## Sözlük

Yol: `src/content/sozluk/<bolge-slug>.md` (yalnız frontmatter):

```yaml
---
donem: 2
terimler:
  - terim: "Port"
    ingilizce: "port"
    tanim: "Bir makinede hangi servise bağlanılacağını belirten 0-65535 arası numara."
    ders: "ag-003"
---
```

Bölge başına 15-30 terim. Tanım 1-2 cümle, sıfırdan başlayan biri için. Aynı terimi başka bölgede
tekrar tanımlama (önce `src/content/sozluk/` altındaki diğer dosyalara bak; bölgeler paralel
yazıldığından çakışma olursa terimi bölge adıyla ayırma, yalnız daha temel olan bölgede tut:
Linux < Ağ < Temeller < DevOps < AppSec < Pipeline < Container < Bulut).

## Denetim

`node scripts/icerik-denetle.mjs <bolge> --tam` "Sorun yok." demeli.
