---
kimlik: appsec-007
baslik: "Erişim kontrolü ve IDOR"
donem: 5
sira: 7
sure: 30
neden: "Erişim kontrolü bozukluğu Top 10 listesinde baştadır: giriş yapmış bir kullanıcı, yapmaması gereken bir şeyi yapabiliyorsa bu sınıftır. Kod incelemesinde 'bu kaydı bu kullanıcı görebilir mi?' sorusunu her uç noktada sormak, bu açıkların çoğunu yakalar."
analoji:
  baslik: "Otel kartı yalnız kendi odanı açmalı"
  metin: "Giriş (kimlik doğrulama), resepsiyondan kartı almandır. Erişim kontrolü, o kartın yalnız kendi odanın kapısını açmasıdır. IDOR, kartın 'oda 214' yerine 'oda 215' yazınca da açması gibidir: kimsin diye sorulmuş, ama hangi odaya girebildiğine bakılmamış. Sınırı: otelde kapı kilitleri fizikseldir, uygulamada her isteği yeniden denetlemek yazılımcıya kalır."
gorev:
  aciklama: "Bir not uygulamasının açıklı ve düzeltilmiş sürümünü bellekteki veriyle karşılaştır. Ağ yok, dosya dışında yan etki yok."
  komutlar:
    - "mkdir -p ~/appsec && cd ~/appsec"
    - |
      cat > idor.py <<'EOF'
      notlar = {
          1: {"sahip": "ayse", "metin": "ayse'nin gizli notu"},
          2: {"sahip": "can", "metin": "can'in gizli notu"},
      }

      def not_getir_acikli(kullanici, not_id):
          return notlar[not_id]["metin"]

      def not_getir_guvenli(kullanici, not_id):
          kayit = notlar.get(not_id)
          if kayit is None or kayit["sahip"] != kullanici:
              return "404 bulunamadi"
          return kayit["metin"]

      print("ACIKLI :", not_getir_acikli("ayse", 2))
      print("GUVENLI:", not_getir_guvenli("ayse", 2))
      print("GUVENLI:", not_getir_guvenli("ayse", 1))
      EOF
    - "python3 idor.py"
  soru: "Güvenli sürüm, başkasının notu istenince neden 403 (yasak) yerine 404 (bulunamadı) döndürüyor olabilir?"
  telefon:
    soru: "`GET /fatura/1042` isteğini yapan kullanıcı, URL'deki sayıyı 1043 yapınca başka birinin faturasını görüyor. Bu açığın adı nedir ve sunucuda ne eksik?"
    cevap: "IDOR (güvensiz doğrudan nesne referansı), yatay yetki aşımı. Sunucu, istenen faturanın isteği yapan kullanıcıya ait olup olmadığını kontrol etmiyor."
sorular:
  - id: appsec-007-s1
    soru: "Yatay ve dikey yetki aşımı arasındaki fark nedir?"
    cevap: "Yatay: aynı yetki düzeyindeki başka bir kullanıcının verisine erişmek (başkasının faturası). Dikey: daha yüksek yetkili işleve erişmek (sıradan kullanıcının yönetici paneline girmesi)."
  - id: appsec-007-s2
    soru: "Erişim kontrolü neden istemcide (gizli düğme, gizli menü) yapılamaz?"
    cevap: "İstemci saldırganın kontrolündedir. Düğmeyi saklamak isteği engellemez; saldırgan isteği doğrudan gönderebilir. Her isteğin yetkisi sunucuda denetlenmelidir."
  - id: appsec-007-s3
    soru: "'Varsayılan olarak reddet' (deny by default) ilkesi ne demektir?"
    cevap: "Açıkça izin verilmeyen her erişim reddedilir. Yeni bir uç nokta eklendiğinde yetki kuralı unutulursa, açık kalmak yerine erişim kapalı olur."
  - id: appsec-007-s4
    soru: "ID'leri sıralı sayı yerine rastgele UUID yapmak IDOR'u çözer mü?"
    cevap: "Hayır, tahmini zorlaştırır ama asıl sorunu çözmez. ID sızarsa ya da öğrenilirse yetki kontrolü yoksa yine erişilir. Sahiplik denetimi olmazsa olmaz; UUID ek bir zorluktur."
derinDalis:
  - tur: okuma
    baslik: "OWASP Authorization Cheat Sheet"
    ayrinti: "Varsayılan reddet, her istekte denetim, IDOR ve sunucu tarafı kontrol."
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
---

**Kimlik doğrulama** "sen kimsin?", **yetkilendirme** (authorization) "bunu yapabilir misin?" sorusudur. Erişim kontrolü bozukluğu, ikinci sorunun hiç sorulmadığı ya da yanlış sorulduğu durumdur ve en sık görülen web açıklarından biridir.

### IDOR

**IDOR** (insecure direct object reference) şöyle olur: uygulama, kaydı bir ID ile getirir (`/fatura/1042`) ve ID'yi kullanıcı değiştirebilir. Sunucu "bu kullanıcı bu kayda sahip mi?" diye bakmazsa, ID'yi değiştiren başkasının verisini görür.

```python
# Açıklı: yalnız ID'ye bakıyor
fatura = db.query("SELECT * FROM fatura WHERE id = ?", (fatura_id,))

# Düzeltilmiş: sahiplik sorguda zorunlu
fatura = db.query(
    "SELECT * FROM fatura WHERE id = ? AND sahip_id = ?",
    (fatura_id, mevcut_kullanici.id),
)
```

Sahiplik koşulunu sorguya koymak, "getir, sonra kontrol etmeyi unut" hatasını da azaltır.

### Yatay ve dikey

| Tür | Anlamı | Örnek |
|---|---|---|
| Yatay | Aynı düzeydeki başka kullanıcının verisi | Başkasının siparişi |
| Dikey | Yüksek yetkili işlev | `/admin/kullanici-sil` uç noktasına sıradan kullanıcı erişimi |

### Temel ilkeler

1. **Sunucuda denetle.** Gizlenen menü ya da devre dışı düğme güvenlik değildir.
2. **Her istekte denetle.** İlk sayfada kontrol edip sonraki adımlarda unutmak (çok adımlı formlar) tipik bir hatadır.
3. **Varsayılan olarak reddet.** Yeni uç nokta, açıkça yetki tanımlanana kadar kapalı olsun.
4. **Merkezi mekanizma kullan.** Her uç noktada elle `if` yazmak yerine ara katman (middleware) ya da çerçeve yetkilendirmesi.
5. **En az yetki.** Rolleri dar tut (Linux bölgesindeki ilkenin uygulama karşılığı).
6. **Reddedilenleri günlüğe yaz.** Çok sayıda yetkisiz erişim denemesi bir saldırı belirtisidir.

### Test etmek için

Kod incelemesinde her `GET /kaynak/{id}`, `PUT`, `DELETE` uç noktası için sor: *bu ID bu kullanıcıya mı ait? Yönetici işlevi mi, rol kontrolü var mı?* Otomatik tarayıcılar IDOR'u genellikle kaçırır, çünkü "bu kayıt başkasına ait" bilgisi uygulama mantığına özgüdür. Bu yüzden insan incelemesi ve yetki testleri önemlidir.

Güvenlik notu: Başkasının kayıtlarına erişim denemesi, "yalnız bakacağım" diye bile olsa, izinsiz erişimdir. Bu tür testleri yalnız kendi uygulamanda, iki ayrı test hesabıyla yap.
