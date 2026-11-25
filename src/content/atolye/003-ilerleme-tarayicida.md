---
no: 3
baslik: "İlerleme tarayıcıda tutulacak, dört ekle güçlendirilecek"
tarih: "2026-11-25"
sorun: "Site statik ve veritabanı yok. 'Bu dersi bitirdim' bilgisi nerede duracak?"
secenekler:
  - { ad: "Tarayıcıda (localStorage), geliştirilmiş", aciklama: "Tarayıcı hatırlar. Puanlama kapısı, aralıklı tekrar, yedek kodu ve takvim eklenir.", secildi: true }
  - { ad: "Git'te not dosyaları", aciklama: "Her ders sonunda cevapları bir dosyaya yazıp commit etmek. Her gün git pratiği, ama daha zahmetli.", secildi: false }
neden: "Basitlik. Düz localStorage'ın iki zayıflığı vardı: veri kaybolabilir ve 'bitirdim' demek hiçbir şeyi kanıtlamaz. Yedek kodu birincisini, 'önce bütün soruları puanla' kapısı ikincisini kapatıyor. Aralıklı tekrar, unutulan soruları 1, 3, 7, 14, 30, 60 gün aralıklarla geri getiriyor."
bedel: "Başka cihaza geçerken yedek kodunu elle taşımak gerekir. Tarayıcı verisi silinirse son yedekten sonrası kaybolur."
yoklamaSorusu:
  soru: "'Bilemedim' dediğin soru ne zaman, 'Bildim' dediğin yeni bir soru ne zaman tekrar karşına çıkar?"
  cevap: "'Bilemedim' ertesi gün. Yeni bir soruya 'Bildim' dersen seviyesi 1 olur ve 3 gün sonra gelir; her 'Bildim'de aralık büyür (7, 14, 30, 60 gün)."
---
