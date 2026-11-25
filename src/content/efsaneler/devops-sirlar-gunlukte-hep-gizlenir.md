---
iddia: "GitHub Actions günlüklerde sırları kendisi gizler, o yüzden sırrı yazdırmam sorun olmaz."
hukum: yanlis
ozet: "GitHub belgeleri sırların workflow çalışırken yazdırılmamasını söyler; bazı durumlarda sırlar günlükte gizlenmez. Maskeleme ek bir önlemdir, güvence değildir."
analoji: "Kemerle birlikte takılan yedek emniyet gibi: yardımcı olur ama kemeri bağlamamak için gerekçe değildir."
kaynaklar:
  - { ad: "GitHub Docs: Using secrets in GitHub Actions", url: "https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions" }
ilgiliDers: devops-012
tarih: "2026-11-25"
---

GitHub'ın sırlar belgesi, workflow çalışmalarında sırların yazdırılmadığından emin olmanı söyler. Belgedeki büyük sır çözümü (secret'ı şifreleyip dosyadan çözme) için açıkça uyarı vardır: bu yöntemde yazdırılan sırlar günlükte gizlenmez. Belge ayrıca depo sırları olmayan hassas değerleri `::add-mask::` ile elle maskelemeyi önerir.

Yani platform maskelemeye çalışsa da bunu garanti saymak yanlıştır; en güvenlisi sırrı hiç yazdırmamaktır.

Belge bir başka noktayı da hatırlatır: sırları komut satırı argümanı olarak vermek yerine ortam değişkeni ya da standart girdi kullan; komut satırı argümanlarını aynı makinedeki başka kullanıcılar `ps` ile görebilir.

Pratik öneriler:

- Hata ayıklarken bile `echo $SIR` gibi satırlar ekleme.
- Sızdığından şüphelenirsen sırrı hemen döndür.
- Sırların yalnız gereken job'a verilmesini sağla.
