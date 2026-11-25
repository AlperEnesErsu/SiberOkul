---
no: 1
baslik: "Site statik olacak, Astro ile"
tarih: "2026-11-25"
sorun: "Günlük derslerle büyüyecek, tek kişinin kullanacağı bir öğrenme sitesi lazım. Bakımı ders yazmaktan fazla zaman almamalı."
secenekler:
  - { ad: "Astro + Markdown + GitHub Pages", aciklama: "Her ders bir `.md` dosyası. Build sırasında saf HTML'e dönüşür. Sunucu ve veritabanı yok.", secildi: true }
  - { ad: "Next.js + Supabase", aciklama: "Hesap, giriş ve senkron ilerleme gelir. Ama auth, veritabanı kuralları ve yönetim paneli de gelir.", secildi: false }
  - { ad: "Düz HTML/JS, build yok", aciklama: "Öğrenecek yeni bir şey yok, ama her dersi elle HTML yazmak yorar ve içerik denetlenmez.", secildi: false }
neden: "Ders yazmak bir dosya eklemek kadar basit olmalı. Sunucusu, veritabanı ve giriş sistemi olmayan bir siteye saldırmanın yolu da çok azdır: buna saldırı yüzeyi denir ve küçük tutmak güvenliğin ilk kurallarından biridir."
bedel: "İlerleme bir sunucuda tutulamaz, tarayıcıda durur. Cihazlar arası taşımak elle yapılır (bkz. Karar 003)."
yoklamaSorusu:
  soru: "Bu sitenin saldırı yüzeyi Next.js + Supabase seçeneğine göre neden daha küçük?"
  cevap: "Çalışan bir sunucu, veritabanı, giriş formu ya da API yok. Ziyaretçiye yalnız hazır HTML dosyaları gönderiliyor. Saldırganın deneyebileceği kapı sayısı çok az."
---
