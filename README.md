# SiberOkul

Sıfırdan **DevSecOps mühendisliğine** giden kişisel bir siber güvenlik okulu. Her gün tek bir
**günlük oturum**: tekrar soruları, bir ders (ya da bölge sınavı), kısa bir okuma kartı ve özet.
Telefonda okunacak şekilde tasarlandı; terminal görevleri bilgisayarda (WSL2 + Ubuntu) yapılır.

Statik bir Astro sitesi: sunucu, veritabanı ve hesap yok. İlerleme tarayıcıda (localStorage) tutulur,
yedek koduyla başka cihaza taşınır.

## Program

8 bölge, **97 ders**, her bölgenin sonunda bir sınav (18-20 soru, geçme notu %70).
Ayrıntılı liste: [`docs/mufredat/program.md`](docs/mufredat/program.md).

| # | Bölge | Ders | Konular |
|---|---|---|---|
| 1 | 🐧 Linux + Bash | 13 | terminal, dosyalar, izinler, süreçler, servisler, loglar, betikler |
| 2 | 🌐 Ağ | 12 | TCP/IP, DNS, HTTP/TLS, paket okuma, güvenlik duvarı, SSH, nmap |
| 3 | 🛡️ Güvenlik temelleri | 12 | CIA, risk, kimlik doğrulama, kriptografi, sosyal mühendislik, olay müdahalesi |
| 4 | ⚙️ Git, CI/CD, Docker | 12 | Git, GitHub Actions, container, Dockerfile, Compose, sır yönetimi |
| 5 | 🧩 Uygulama güvenliği | 12 | OWASP Top 10, SQLi, XSS, CSRF, IDOR, SSRF, tehdit modelleme |
| 6 | 🏭 Pipeline güvenliği | 12 | sır taraması, SAST, SCA, SBOM, DAST, Trivy, imzalama, Actions güvenliği |
| 7 | 📦 Container, Kubernetes, IaC | 12 | K8s RBAC, NetworkPolicy, Pod Security, Terraform, policy-as-code |
| 8 | ☁️ Bulut ve izleme | 12 | IAM, VPC, S3, KMS, CloudTrail, SIEM, olay müdahalesi, yedekleme |

Her ders: **neden önemli** → **kavram** → (varsa) **şema** → **hızlı kontrol** (anında puanlanan
çoktan seçmeli) → **analoji** → **sık yapılan hatalar** → (varsa) **gerçek olay** → **terminal görevi**
(ve telefondan düşünülebilecek bir soru) → **5 soru** (biri senaryo; her birinde 💡 ipucu, cevabı açıp
kendini puanlarsın) → **terimler** → **derin dalış**.

Ayrıca:

- **Efsane mi?** 56 kart: teknoloji ve güvenlik hakkında sık duyulan iddialar. Önce sen tahmin edersin,
  sonra birincil kaynağa dayanan hüküm açılır.
- **Sözlük:** 219 terim, aranabilir; her ders kendi terimlerini sonunda listeler.
- **Atölye:** Bu siteyi yaparken alınan her kararın ne/neden/bedel kaydı.

## Nasıl çalışır

- **Günlük oturum:** Isınma → Tekrar → Ders ya da Sınav → Okuma kartı → Özet. Plan günün başında
  sabitlenir; yarıda kalırsa kaldığın yerden devam edilir.
- **Aralıklı tekrar:** "Bilemedim" denen soru ertesi gün, bilinenler 3, 7, 14, 30, 60 gün sonra geri gelir.
- **Seri:** Haftada 5 gün çalışmak seriyi sürdürür; bir gün kaçırmak seriyi sıfırlamaz.
- **Bölge sınavı:** Bölgenin dersleri bitince oturuma girer; %70 sonraki bölgeyi açar. Her soruda ipucu
  var; yanlış yaptığın sorular aralıklı tekrara girer ve sonraki günlerde geri gelir.

## Pratik ortamı

Terminal görevleri Windows üzerinde WSL2 + Ubuntu 22.04 için yazıldı. Docker derslerinde Docker
Desktop'ın WSL entegrasyonu açık olmalı (Settings → Resources → WSL integration). Linux, Ağ, Temeller,
DevOps, AppSec ve Pipeline derslerindeki komutların `sudo` ve ek araç gerektirmeyenleri gerçek bir
Ubuntu 22.04'te çalıştırılıp derste yazanla karşılaştırıldı.

## Çalıştırma

Gerekenler: Node.js 24.

```bash
npm ci
npm run dev       # http://localhost:4321/SiberOkul/
npm run build     # dist/ (statik site)
npm run icerik    # bütün ders, sınav ve efsane dosyalarını denetler
npm run check     # tip kontrolü + testler
```

## Yapı

```
src/
├── content/              içerik: her ders, sınav, efsane, Atölye kaydı bir Markdown dosyası
│   ├── dersler/<bolge>/  NNN-baslik.md
│   ├── sinavlar/         <bolge>.md
│   ├── efsaneler/
│   └── atolye/
├── content.config.ts     içerik kuralları (şema): eksik ya da hatalı alan build'i durdurur
├── lib/                  saf mantık (testli): ilerleme, aralıklı tekrar, seri, oturum, sınav
├── scripts/              tarayıcıda çalışan kod: lib'i sayfalara bağlar
├── components/  pages/  layouts/  styles/
tests/                    yalnız src/lib için birim testleri
scripts/icerik-denetle.mjs  içerik denetleyici (bütün sorunları tek seferde listeler)
docs/                     tasarım belgeleri, uygulama planları, program, içerik yazım rehberi
```

## İçerik eklemek

Yazım kuralları: [`docs/rutin/icerik-yazim-rehberi.md`](docs/rutin/icerik-yazim-rehberi.md).
Yeni bir dosyadan sonra `npm run icerik` ve `npm run build` çalıştır. Ders ve soru kimlikleri
(`linux-001`, `linux-001-s2`) yayımlandıktan sonra değiştirilmez; ilerleme kayıtları bunlara bağlı.

## Testler ve CI

Testler yalnız hesap yapan kodu kapsar (`src/lib`): bozulduğunda sessizce yanlış sonuç veren kısımlar.
Her testin üstünde neyi koruduğunu söyleyen bir `// Korur:` satırı var. GitHub Actions her push ve
PR'da içerik denetimi, tip kontrolü, testler ve build çalıştırır.

## Güvenlik

- Sunucu, veritabanı ve giriş yok; saldırı yüzeyi bilinçli olarak küçük tutuldu.
- İçerikteki metinler HTML'i kaçırarak gösterilir; içerik bağlantıları yalnız `http(s)` olabilir.
- Derslerdeki komutlar yalnız kendi makinende ya da izinli laboratuvarlarda (ör. OverTheWire Bandit)
  çalıştırılmak içindir. Başkasına ait sistemleri izinsiz tarama.
