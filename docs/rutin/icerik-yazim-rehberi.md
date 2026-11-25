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
