---
iddia: "CloudTrail açıkken hesabımdaki bütün işlemlerin geçmişini istediğim zaman konsoldan görebilirim."
hukum: kismen
ozet: "CloudTrail her hesapta varsayılan açıktır, ama konsoldaki olay geçmişi (event history) yalnız yönetim olaylarının son 90 gününü gösterir. Daha uzun saklama ve veri olayları için iz (trail) ya da olay veri deposu oluşturmak gerekir."
analoji: "Güvenlik kamerası görüntüleri son üç ayı tutan bir ekranda duruyor; arşivlemek için kaydı ayrıca bir yere yazdırmak gerekiyor."
kaynaklar:
  - { ad: "AWS CloudTrail: Olay geçmişi ile çalışmak", url: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html" }
ilgiliDers: bulut-007
tarih: "2026-11-25"
---

CloudTrail hesabını açtığında varsayılan olarak etkindir ve olay geçmişine erişim hazırdır. Bu yüzden "her şey zaten kayıtlı" izlenimi doğar. İddia kısmen doğru: kayıt var, ama sınırları var.

AWS belgesine göre olay geçmişi, bir bölgedeki **yönetim olaylarının** son 90 gününü gösterir. Konsolda yalnız yönetim olayları görünür; veri olayları (örneğin S3 nesne okumaları) ve Insights olayları yoktur. Ayrıca arama tek hesap ve tek bölgeyle sınırlıdır ve aynı anda tek bir özellik süzgeci kullanılabilir.

Belge, süregelen bir kayıt için bir olay veri deposu ya da **iz** oluşturmayı söyler. Kuruluş düzeyinde birleştirme de olay geçmişinde yoktur; bunun için kuruluş izi gerekir.

Hüküm: olay geçmişi hızlı bir ilk bakış için iyidir. Denetim, adli inceleme ve uzun saklama için iz kur, kayıtları korumalı bir depoya yaz.
