# Günlük ders görevi

Her sabah 07:00'de (Europe/Istanbul) bulutta çalışan Claude görevinin talimatı. Görev bu dosyayı
okur ve adımları sırayla uygular. Talimat değişirse bu dosya PR ile güncellenir.

## Amaç

Alper hangi derste olursa olsun önünde en az bir hazır ders olsun. İlerleme Alper'in tarayıcısında
tutulduğu için görev onu göremez; bu yüzden takvime dayalı tampon kullanılır
(bkz. `src/lib/tampon.ts`, Atölye Karar 008).

## Adımlar

1. `main` dalını çek, `npm ci` çalıştır, ardından `npm run tampon`.
   Çıktı: `{"gerekli":N,"mevcut":M,"eksik":K}`.
2. **Önce hatalar.** `ders-hatasi` etiketli açık issue varsa her biri için:
   - Hatayı ilgili ders dosyasında düzelt.
   - `duzeltme/<ders-kimligi>` dalında PR aç; açıklamada `Fixes #<issue-no>`.
   - Auto-merge'ü aç (`gh pr merge --auto --squash`).
3. **Sonra tampon.** `eksik > 0` ise:
   - `docs/mufredat/` altındaki güncel dönem listesinden, henüz `src/content/dersler/` altında
     dosyası olmayan ilk `eksik` dersi sırayla yaz.
   - Dosya adı: `src/content/dersler/<donem-slug>/<NNN>-<slug>.md`; `kimlik` `<donem-slug>-<NNN>`.
   - Şema: `src/content.config.ts`. Mevcut dersleri (ör. `linux/001-*.md`) örnek al.
   - Ders yapısı: Neden önemli → Kavram (gövde) → Analoji → Terminal görevi → 3-5 soru → Derin dalış.
   - Dil: sıfırdan başlayan biri için sade Türkçe. Teknik terimin İngilizcesini ilk geçtiği yerde ver.
   - Kitap metni kopyalanmaz; kitaplar yalnız "hangi bölümü oku" olarak anılır. Kaynak URL'lerini
     açıp doğrula; doğrulanamayanı kullanma.
   - `npm run check && npm run build` geçmeli.
   - `ders/<ilk-kimlik>` dalında tek PR aç. Açıklama `.github/pull_request_template.md` şablonuyla
     ("Ne / Nasıl / Neden"). Auto-merge'ü aç.
4. **Dönem sonu.** Güncel dönemin listesinde yayımlanmamış 3 veya daha az ders kaldıysa ve sonraki
   dönemin listesi (`docs/mufredat/donem-<n>-<slug>.md`) yoksa onu yaz, `src/data/donemler.ts`
   içindeki `planlananDers` değerini güncelle ve ayrı bir PR aç (auto-merge yok; Alper inceler).
5. `eksik == 0` ve açık hata yoksa hiçbir şey yapma ve bitir.

## Yapma

- `main`'e doğrudan push etme.
- Yayımlanmış bir dersin `kimlik`'ini ya da soru `id`'lerini değiştirme (ilerleme kayıtları bozulur).
- Testleri, şemayı ya da CI'ı değiştirme; bunlar insan incelemesiyle değişir.
