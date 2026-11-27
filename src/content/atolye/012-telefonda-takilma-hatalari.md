---
no: 12
baslik: "İlk gün telefonda takılmalar: geri tuşu, kilitli çubuk, sıfırlanan oturum"
tarih: "2026-11-27"
sorun: "İlk gerçek kullanımda telefonda oturum ilerlemiyormuş gibi davrandı: sürekli “devam” görünüyordu, geri tuşu insanı tekrar ileri atıyordu, “Okudum”a basınca bir şey değişmiyormuş gibi görünüyordu."
secenekler:
  - { ad: "Kök nedenleri tek tek bulup düzeltmek", aciklama: "Sorunu gerçek dokunuşlarla canlıda yeniden üretmek, her birinin nedenini bulmak, test ve tarayıcı denemesiyle doğrulamak.", secildi: true }
  - { ad: "Oturum akışını kaldırıp eski sayfalara dönmek", aciklama: "Hızlı ama asıl istenen (tek akışlı günlük oturum) kaybolur.", secildi: false }
neden: "Dört ayrı neden vardı: (1) `/oturum/` sayfası sıradaki adım ders ya da kartsa kendiliğinden oraya atlıyordu; geri tuşuyla oraya dönen kişi tekrar ileri atılıyordu. Artık atlamıyor, bir “Devam et” bağlantısı gösteriyor. (2) Kilitli “Sonraki adım” çubuğu ekranın dörtte birini kaplayıp en göze batan şey oluyordu; artık adım bitene kadar sayfanın sonunda duruyor, bitince alta yapışıyor. (3) Geri tuşuyla dönülen eski ana sayfada “Başlat”a basmak oturumu baştan planlayıp ilerlemeyi sıfırlıyordu; artık süren oturum varsa ona devam ediliyor ve önbellekten dönen her sayfa kendini tazeliyor. (4) “Okudum” yalnız düğmeyi soluklaştırıyordu; artık yeşil bir “Okundu” işareti çıkıyor ve listelerde okunan kartlar işaretli. Ayrıca oturum sayfası yüzlerce gizli soruyu taşımayı bıraktı (880 KB → 367 KB)."
bedel: "Testlerimiz hesap yapan kodu korur, sayfa davranışını değil; bu hatalar oradan kaçtı. Bu yüzden düzeltmelerin her biri telefonda gerçek dokunuşlarla denendi. Ders çıkarıldı: düğmeleri programla “tıklamak” gerçek kullanıcıyı taklit etmiyor."
yoklamaSorusu:
  soru: "Bir sayfanın açılır açılmaz başka bir sayfaya `location.replace` ile yönlendirmesi neden geri tuşunu bozar?"
  cevap: "Geri tuşu seni o sayfaya getirdiğinde sayfa seni hemen yeniden ileri gönderir; kullanıcı ne kadar geri basarsa bassın aynı yere döner. Bu yüzden kendiliğinden yönlendirme yerine kullanıcıya bir bağlantı göstermek daha güvenlidir."
---
