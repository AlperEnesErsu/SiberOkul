// Müfredatın sekiz dönemi. Harita ve ilerleme çubukları bu listeyi okur.
// planlananDers: dönem için hedeflenen ders sayısı; dönem ayrıntılandıkça güncellenir.

export interface Donem {
  no: number;
  slug: string;
  ad: string;
  planlananDers: number;
  aciklama: string;
}

export const DONEMLER: Donem[] = [
  { no: 1, slug: 'linux', ad: 'Linux + Bash', planlananDers: 13, aciklama: 'Terminal, dosyalar, izinler, süreçler, servisler, betikler.' },
  { no: 2, slug: 'ag', ad: 'Ağ', planlananDers: 12, aciklama: 'TCP/IP, DNS, HTTP/TLS, güvenlik duvarı, paket analizi.' },
  { no: 3, slug: 'temeller', ad: 'Güvenlik temelleri', planlananDers: 12, aciklama: 'CIA üçlüsü, kimlik doğrulama, kriptografi, saldırı türleri.' },
  { no: 4, slug: 'devops', ad: 'Git, CI/CD, Docker', planlananDers: 12, aciklama: 'DevOps kültürü, sürüm kontrolü, otomasyon, container.' },
  { no: 5, slug: 'appsec', ad: 'Uygulama güvenliği', planlananDers: 12, aciklama: 'OWASP Top 10, güvenli kod, tehdit modelleme.' },
  { no: 6, slug: 'pipeline', ad: 'Pipeline güvenliği', planlananDers: 12, aciklama: 'SAST, DAST, SCA, sır tarama, SBOM, tedarik zinciri.' },
  { no: 7, slug: 'container', ad: 'Container, Kubernetes, IaC', planlananDers: 12, aciklama: 'Container ve Kubernetes güvenliği, Terraform, policy-as-code.' },
  { no: 8, slug: 'bulut', ad: 'Bulut ve izleme', planlananDers: 12, aciklama: 'Bulut güvenliği, loglama, olay müdahalesi.' },
];
