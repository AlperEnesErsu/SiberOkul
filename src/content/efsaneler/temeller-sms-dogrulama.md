---
iddia: "SMS ile iki adımlı doğrulama her saldırıyı durdurur."
hukum: kismen
ozet: "SMS koduyla doğrulama hiç doğrulama olmamasından çok daha iyidir ama en zayıf yöntemlerden biridir. NIST telefon hattı (PSTN) üzerinden kod gönderilmesini 'kısıtlı' sayar ve alternatif yöntem sunulmasını ister; CISA ise oltalamaya dayanıklı tek yaygın yöntemin FIDO/WebAuthn olduğunu söyler."
analoji: "Zayıf bir ek kilit gibi: hiç kilit olmamasından iyidir ama ustalıklı bir hırsız onu atlayabilir. Güvenlik anahtarı ya da passkey ise o kilidin sağlamıdır."
kaynaklar:
  - { ad: "NIST SP 800-63B-4: Authentication and Authenticator Management", url: "https://pages.nist.gov/800-63-4/sp800-63b.html" }
  - { ad: "CISA: More than a Password (MFA)", url: "https://www.cisa.gov/MFA" }
ilgiliDers: temeller-005
tarih: "2026-11-25"
---

SMS doğrulaması saldırganların işini zorlaştırır; yalnız parolası sızmış bir hesabın çoğu otomatik saldırıda düşmesini engeller. Bu yüzden CISA da "herhangi bir MFA, MFA olmamasından iyidir" der. Ama "her saldırıyı durdurur" yanlıştır:

- **SIM swap**: saldırgan numaranı kendi SIM kartına taşıtırsa kodlar ona gider.
- **Gerçek zamanlı oltalama**: sahte site girdiğin kodu anında gerçek siteye iletir.
- **Ağ zayıflıkları**: SMS şifrelenmiş bir kanal olarak tasarlanmamıştır.

NIST bu yüzden PSTN üzerinden gönderilen doğrulama kodlarını kısıtlı sayar; kuruluşlardan SMS'e alternatif sunmasını ve numara değişikliği, SIM değişimi gibi risk işaretlerini dikkate almasını bekler. CISA ise oltalamaya dayanıklı olarak yaygın biçimde bulunabilen tek yöntemin FIDO/WebAuthn olduğunu belirtir.

Pratik sıra: passkey ya da güvenlik anahtarı, sonra Authenticator uygulaması, en sonda SMS. Sadece SMS sunan bir servis varsa yine de aç; ama imkân bulduğunda daha güçlü bir yönteme geç.
