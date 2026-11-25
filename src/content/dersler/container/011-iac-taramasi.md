---
kimlik: container-011
baslik: "IaC taraması"
donem: 7
sira: 11
sure: 35
neden: "Yanlış yapılandırma (misconfiguration), bulut ve Kubernetes ihlallerinin en yaygın sebeplerindendir. IaC dosyalarını uygulamadan önce otomatik taramak, hatayı üretimden önce, maliyeti en düşükken yakalamanın yoludur."
analoji:
  baslik: "Yapı denetimi"
  metin: "Bina bittikten sonra çatlak bulmak pahalıdır; proje çizimi aşamasında bir mühendisin 'bu kolon yetmez' demesi ucuzdur. IaC taraması, altyapı projesini yapılmadan önce denetleyen mühendistir. Sınırı: çizimi denetler, binanın o günkü gerçek hâlini değil; kod ile gerçek altyapı ayrışırsa (drift) tarama kaçırır."
gorev:
  aciklama: "Python ve `pip` gerekir (WSL'de `python3 -m venv` ile ayrı bir ortam öneririz). Checkov'u kurup bilerek hatalı yazılmış bir Terraform dosyasını tarayacağız. Dosya yalnız taranır; hiçbir şey uygulanmaz ve bulut kaynağı oluşmaz. Ücretsizdir; kurulum internetten paket indirir."
  komutlar:
    - python3 -m venv /tmp/checkov-env && . /tmp/checkov-env/bin/activate
    - pip install checkov
    - mkdir -p /tmp/iac-tara && cd /tmp/iac-tara
    - |
      cat > main.tf <<'EOF'
      resource "aws_s3_bucket" "veri" {
        bucket = "ornek-bucket-adi"
      }
      resource "aws_security_group" "acik" {
        name = "acik"
        ingress {
          from_port   = 22
          to_port     = 22
          protocol    = "tcp"
          cidr_blocks = ["0.0.0.0/0"]
        }
      }
      EOF
    - checkov -d . --framework terraform --compact --quiet
  soru: "Checkov hangi kontrolleri başarısız saydı? Güvenlik grubundaki SSH kuralı için kaynağın hangi yanı sorun ve nasıl düzeltirsin?"
  telefon:
    soru: "Bir güvenlik grubunda `cidr_blocks = [\"0.0.0.0/0\"]` ve port 22 var. Bu neden bir bulgu olur ve en az hangi değişiklikle düzelir?"
    cevap: "0.0.0.0/0 bütün internet demektir; SSH'ın dünyaya açık olması kaba kuvvet ve tarama saldırılarına kapı açar. Düzeltme: kaynağı yalnız bilinen yönetici IP aralığına ya da VPN çıkış adresine daralt, mümkünse SSH yerine oturum yöneticisi gibi kimliğe bağlı bir erişim kullan."
sorular:
  - id: container-011-s1
    soru: "IaC taramasını neden uygulamadan önce (kod aşamasında) yaparız?"
    cevap: "Hata kod aşamasında düzeltilince hiçbir kaynak yanlış kurulmaz; üretimde bulununca ise açık bir süre canlı kalır. Düzeltme maliyeti ve risk, tarama ne kadar erken olursa o kadar düşüktür."
  - id: container-011-s2
    soru: "Checkov gibi araçlar neyi bulur, neyi bulamaz?"
    cevap: "Koddaki bilinen yanlış yapılandırma desenlerini bulur (açık depolama, şifresiz disk, geniş güvenlik grubu). Çalışma anı davranışını, elle yapılan değişiklikleri (drift) ve iş mantığı hatalarını bulamaz."
  - id: container-011-s3
    soru: "Bir tarama aracı 'yanlış pozitif' (false positive) verirse ne yapılır?"
    cevap: "Önce gerçekten yanlış mı diye insan olarak incele. Gerçekten kabul edilmiş bir istisnaysa, sebebiyle birlikte koda ya da yapılandırmaya yazılı bir bastırma (skip) ekle; sessizce kapatma."
  - id: container-011-s4
    soru: "IaC taraması CI'a nasıl yerleşir?"
    cevap: "Her çekme isteğinde araç otomatik çalışır; belirli önem derecesindeki bulgular build'i durdurur ya da yoruma eklenir. Böylece güvensiz yapılandırma birleştirilmeden fark edilir (pipeline-011'de kapıları işleyeceğiz)."
derinDalis:
  - tur: lab
    baslik: "Checkov depo sayfası"
    ayrinti: "Kurulum, desteklenen çerçeveler (Terraform, Kubernetes, Dockerfile) ve kontrol listesi."
    url: "https://github.com/bridgecrewio/checkov"
  - tur: okuma
    baslik: "tfsec'in Trivy'ye taşınması"
    ayrinti: "tfsec projesinin Trivy'nin bir parçası olduğunu açıklayan depo sayfası."
    url: "https://github.com/aquasecurity/tfsec"
---

Terraform ya da Kubernetes YAML'ı yazarken yanlış bir satır bir bulut ortamını internete açabilir. Bunu gözle yakalamaya çalışmak yerine bir araç bakar: **IaC taraması** (IaC scanning), kodu çalıştırmadan, **statik** olarak inceler.

### Ne arar

Araçlar, yaygın yanlış yapılandırma kalıplarını içeren kural kümeleri taşır. Örnekler:

- Herkese açık depolama (bucket) ya da herkese açık okuma.
- Şifrelenmemiş disk, veri tabanı ya da yedek.
- `0.0.0.0/0` adresine açık yönetim portları (22, 3389).
- Günlük (log) tutmanın kapalı olması.
- Kubernetes YAML'ında `privileged`, root çalışan ya da kaynak sınırı olmayan pod'lar.
- Dockerfile'da `USER` eksikliği, `latest` etiketi.

### Araçlar

- **Checkov**: Terraform, CloudFormation, Kubernetes, Dockerfile ve daha fazlasını tarar; Python ile kurulur.
- **Trivy**: İmaj, dosya sistemi ve IaC için tek araç. **tfsec** artık Trivy'nin içine taşındı; yeni projelerde Trivy'nin yapılandırma taramasına bakmak mantıklıdır.
- **KICS**, **Terrascan** gibi alternatifler de vardır; ilke aynıdır.

### Bir bulgu nasıl okunur

Tipik çıktı üç şey söyler: **kontrol kimliği** (ör. CKV_AWS_...), **başarısız olan kaynak** (`aws_s3_bucket.veri`) ve **dosya, satır aralığı**. Önce kimliğe bakıp aracın açıklamasını okur, sonra kaynağı düzeltirsin. Düzeltmeyi uyguladıktan sonra taramayı tekrar çalıştırıp bulgunun kalktığını doğrularsın.

### Bulguları yönetmek

Her bulgu aynı derecede önemli değildir.

| Durum | Ne yaparsın |
|---|---|
| Gerçek ve kritik (ör. açık veri tabanı) | Hemen düzelt, birleştirmeyi engelle |
| Gerçek ama düşük etkili | İş listesine al, bir süre içinde düzelt |
| Kabul edilmiş istisna | Gerekçeyle yazılı bastır |
| Yanlış pozitif | Doğrula, araç kuralını ya da bastırmayı ayarla |

Bastırmaları (skip) sessizce yapmak, güvenliği kapatmaktır. Her bastırmanın yanında neden yazılmalı.

### CI'a koymak

Tarama en çok değeri her çekme isteğinde otomatik çalışınca verir. Basit bir model: yüksek önem derecesindeki bulgu varsa iş başarısız olur; düşükler yorum olarak eklenir. Böylece güvenlik, gelişim akışının içinde, insanı yavaşlatmadan yer alır.

### Sınırlar

- Araç yalnız **yazdığın kodu** görür. Elle yapılmış değişiklikleri (drift) görmez.
- Kural kümesi eksiktir; araç "temiz" dedi diye sistem güvenli değildir.
- Bir kural yalnız desene bakar; bağlam bilmez (ör. bu bucket gerçekten herkese açık olmalı mı).

Güvenlik notu: Tarama araçlarını resmi kaynaklarından kur ve sürümlerini sabitle. CI'da rastgele bir betiği `curl | sh` ile çalıştırmak, taramayı yapan aracın kendisini saldırı yolu hâline getirir (tedarik zinciri, pipeline-008).
