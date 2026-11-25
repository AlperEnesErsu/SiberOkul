# SiberOkul Eğitim Programı (A: yoğun program, 97 ders)

Her bölge 12 ders (Linux 13) + bölge sınavı (15-20 çoktan seçmeli, geçme %70).
Biçim: `kimlik · Başlık — tek satır amaç`. Kimlikler yayımlandıktan sonra değişmez.

## 1. Linux + Bash (`linux`, 13 ders)
- linux-001 · Ubuntu'ya merhaba — WSL'de Ubuntu'yu açmak, istem satırı, `pwd`, `whoami`, `ls`. (yazıldı)
- linux-002 · Dizin ağacında gezinmek — `cd`, mutlak/göreli yol, `~`, `..`, gizli dosyalar. (yazıldı)
- linux-003 · Dosya ve dizin işlemleri — `touch`, `mkdir -p`, `cp`, `mv`, `rm`, joker karakterler.
- linux-004 · Metin okumak ve yardım almak — `cat`, `less`, `head`, `tail -f`, `man`, `--help`.
- linux-005 · Kullanıcılar ve gruplar — `id`, `/etc/passwd`, `/etc/group`, `useradd` fikri.
- linux-006 · Dosya izinleri — `rwx`, sahip/grup/diğerleri, `chmod` (sembolik/sayısal), `chown`.
- linux-007 · sudo ve en az yetki — root, `sudo`, `/etc/sudoers`, neden her şey root değil.
- linux-008 · Yönlendirme ve boru hattı — `stdin/stdout/stderr`, `>`, `>>`, `2>`, `|`, `wc`, `sort`, `uniq`.
- linux-009 · Aramak: grep ve find — `grep -rin`, `find` ad/tür/izin ölçütleri.
- linux-010 · Süreçler ve sinyaller — `ps`, `top`, PID, `kill`, arka plan işleri.
- linux-011 · Paketler ve servisler — `apt`, depolar ve güven, `systemctl status/enable`.
- linux-012 · Loglar — `journalctl`, `/var/log/auth.log`, başarısız giriş denemelerini bulmak.
- linux-013 · Bash betiği temelleri — shebang, değişken, `if`, `for`, `set -euo pipefail`, mini log özeti betiği.

## 2. Ağ (`ag`, 12 ders)
- ag-001 · Ağ nasıl çalışır — paket, katman fikri (TCP/IP modeli), istemci-sunucu.
- ag-002 · IP adresleri ve alt ağlar — IPv4, özel/genel adres, CIDR, `ip addr`.
- ag-003 · Portlar, TCP ve UDP — üçlü el sıkışma, port numaraları, `ss -tulpn`.
- ag-004 · DNS — çözümleme zinciri, kayıt türleri, `dig`, DNS tabanlı saldırılara giriş.
- ag-005 · HTTP — istek/yanıt, metotlar, durum kodları, başlıklar, `curl -v`.
- ag-006 · TLS ve sertifikalar — HTTPS ne korur, sertifika zinciri, `openssl s_client`.
- ag-007 · Ağ teşhis komutları — `ping`, `traceroute`, `curl`, `nc`.
- ag-008 · Paket okumak — `tcpdump` ve Wireshark ile bir HTTP isteğini görmek.
- ag-009 · Güvenlik duvarı — varsayılan reddet, `ufw`, iptables mantığı.
- ag-010 · SSH ve anahtarlar — `ssh`, `ssh-keygen`, anahtarla giriş, sunucu sertleştirme; Bandit 0.
- ag-011 · NAT, proxy ve VPN — ne gizler, ne gizlemez.
- ag-012 · Keşif ve etik sınırlar — `nmap` temel tarama, izin ve yasal çerçeve.

## 3. Güvenlik temelleri (`temeller`, 12 ders)
- temeller-001 · CIA üçlüsü — gizlilik, bütünlük, erişilebilirlik; örnek olaylar.
- temeller-002 · Tehdit, zafiyet, risk — tanımlar, risk = olasılık × etki, CVE/CVSS.
- temeller-003 · Kimlik doğrulama ve yetkilendirme — farkları, oturum, token.
- temeller-004 · Parolalar ve hash — tuz, bcrypt/argon2, sızıntı listeleri, NIST önerileri.
- temeller-005 · Çok faktörlü doğrulama — faktör türleri, TOTP, passkey, SIM swap.
- temeller-006 · Simetrik şifreleme — AES, anahtar yönetimi sorunu.
- temeller-007 · Asimetrik şifreleme ve imza — açık/gizli anahtar, dijital imza.
- temeller-008 · Hash ve bütünlük — SHA-256, dosya doğrulama, `sha256sum`.
- temeller-009 · Sosyal mühendislik ve oltalama — taktikler, işaretler, savunma.
- temeller-010 · Zararlı yazılım türleri — virüs, solucan, truva, fidye yazılımı, yayılma yolları.
- temeller-011 · Derinlemesine savunma ve en az yetki — katmanlı savunma, sıfır güven fikri.
- temeller-012 · Olay müdahalesi temelleri — hazırlık, tespit, sınırlama, temizleme, ders çıkarma.

## 4. Git, CI/CD, Docker (`devops`, 12 ders)
- devops-001 · DevOps ve CI/CD fikri — sürekli entegrasyon/teslim, geri bildirim döngüsü.
- devops-002 · Git temelleri — `init`, `add`, `commit`, `log`, `diff`.
- devops-003 · Dallar ve birleştirme — `branch`, `switch`, `merge`, çakışma çözmek.
- devops-004 · GitHub ve PR akışı — `push`, PR, inceleme, korumalı dal.
- devops-005 · Git'te sır kazaları — `.gitignore`, geçmişte sızan anahtar, döndürme (rotation).
- devops-006 · GitHub Actions'a giriş — workflow, job, step, tetikleyiciler.
- devops-007 · CI'da test ve build — her PR'da otomatik kontrol, önbellek, durum rozetleri.
- devops-008 · Container nedir — VM ile farkı, imaj ve container, `docker run`.
- devops-009 · Dockerfile yazmak — katmanlar, `FROM`, `COPY`, `RUN`, `.dockerignore`.
- devops-010 · İmajlar ve kayıt defterleri — etiket, digest, registry, imaj boyutu.
- devops-011 · Docker Compose — çok servisli uygulama, ağ, volume.
- devops-012 · Ortam değişkenleri ve sır yönetimi — `.env`, CI sırları, sırları imaja koymamak.

## 5. Uygulama güvenliği (`appsec`, 12 ders)
- appsec-001 · OWASP Top 10'a bakış — liste nedir, nasıl kullanılır.
- appsec-002 · Girdi doğrulama ve çıktı kodlama — güvenme, doğrula, kodla.
- appsec-003 · SQL injection — nasıl olur, parametreli sorgu.
- appsec-004 · XSS — yansıyan/depolanan/DOM, kaçırma, CSP.
- appsec-005 · CSRF ve SameSite — istek sahteciliği, token, çerez ayarları.
- appsec-006 · Kimlik doğrulama hataları ve oturum yönetimi — kaba kuvvet, oturum sabitleme, güvenli çerez.
- appsec-007 · Erişim kontrolü ve IDOR — yatay/dikey yetki aşımı.
- appsec-008 · Güvenlik başlıkları ve yanlış yapılandırma — HSTS, CSP, varsayılan şifreler, hata mesajları.
- appsec-009 · Savunmasız bağımlılıklar — bilinen zafiyetli kütüphaneler, sürüm sabitleme.
- appsec-010 · SSRF — sunucuyu içeri istek atmaya kandırmak, meta veri servisleri.
- appsec-011 · Tehdit modelleme — STRIDE, veri akış diyagramı.
- appsec-012 · Güvenli kod incelemesi — kontrol listesi, kırmızı bayraklar.

## 6. Pipeline güvenliği (`pipeline`, 12 ders)
- pipeline-001 · Sola kaydırmak (shift-left) — DevSecOps neyi değiştirir.
- pipeline-002 · Sır taraması — gitleaks, pre-commit kancası, GitShield'in yaklaşımı.
- pipeline-003 · SAST — Semgrep ile statik analiz, yanlış pozitifler.
- pipeline-004 · SCA ve bağımlılık taraması — `npm audit`, Dependabot, OSV.
- pipeline-005 · SBOM — Syft, CycloneDX/SPDX, neden gerekli.
- pipeline-006 · DAST — OWASP ZAP ile çalışan uygulamayı taramak.
- pipeline-007 · Container imajı taraması — Trivy, temel imaj seçimi.
- pipeline-008 · Tedarik zinciri ve imzalama — Sigstore/cosign, SLSA seviyeleri.
- pipeline-009 · GitHub Actions güvenliği — en dar izin, aksiyonları SHA ile sabitlemek, `pull_request_target` riski.
- pipeline-010 · Dal koruma ve kod sahipliği — zorunlu inceleme, CODEOWNERS, imzalı commit.
- pipeline-011 · Güvenlik kapıları ve bulgu yönetimi — ne zaman build'i durdurmalı, SARIF.
- pipeline-012 · Bitirme: kendi pipeline'ın — GitShield + SCA + Trivy'yi bir repoya eklemek.

## 7. Container, Kubernetes, IaC (`container`, 12 ders)
- container-001 · Container güvenliği temelleri — root olmayan kullanıcı, minimal imaj, salt okunur dosya sistemi.
- container-002 · Namespaces ve cgroups — izolasyon nasıl sağlanır, kaçış riski.
- container-003 · Kubernetes mimarisi — kontrol düzlemi, düğüm, kubelet.
- container-004 · Pod, Deployment, Service — temel nesneler, `kubectl`.
- container-005 · Kubernetes RBAC — Role, RoleBinding, ServiceAccount.
- container-006 · NetworkPolicy — varsayılan reddet, pod'lar arası trafik.
- container-007 · Secrets ve ConfigMap — base64 şifreleme değildir, harici sır yöneticileri.
- container-008 · Pod Security Standards — privileged/baseline/restricted.
- container-009 · IaC ve Terraform temelleri — bildirimsel altyapı, `plan`/`apply`.
- container-010 · Terraform state ve güvenliği — state'te sırlar, uzak backend, kilit.
- container-011 · IaC taraması — Checkov/tfsec ile yanlış yapılandırma bulmak.
- container-012 · Policy-as-code — OPA/Kyverno ile kural koymak.

## 8. Bulut ve izleme (`bulut`, 12 ders)
- bulut-001 · Paylaşılan sorumluluk modeli — bulut sağlayıcı ne korur, sen ne korursun.
- bulut-002 · IAM temelleri — kullanıcı, rol, politika, kök hesabı korumak.
- bulut-003 · En az yetkili IAM politikaları — politika okumak, joker karakter tehlikesi.
- bulut-004 · Bulut ağları — VPC, alt ağ, güvenlik grubu.
- bulut-005 · Depolama güvenliği — herkese açık bucket olayları, şifreleme.
- bulut-006 · Sır ve anahtar yönetimi — KMS, Secrets Manager, rotasyon.
- bulut-007 · Denetim kayıtları — CloudTrail, kim neyi ne zaman yaptı.
- bulut-008 · İzleme ve uyarı — metrik, log, alarm, gürültü.
- bulut-009 · SIEM ve log korelasyonu — LogSentry'ye dönüş, kural yazmak.
- bulut-010 · Bulutta olay müdahalesi — sızan anahtar senaryosu adım adım.
- bulut-011 · Yedekleme ve felaket kurtarma — 3-2-1 kuralı, fidye yazılımına dayanıklılık.
- bulut-012 · Bitirme: uçtan uca DevSecOps — kod, pipeline, container, bulut, izleme zinciri.
