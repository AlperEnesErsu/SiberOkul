// Yedek kodu: ilerlemenin tamamı, kopyalanıp başka cihaza yapıştırılabilen tek satırlık metin.
// Biçim: "SO1." + JSON'un UTF-8 base64url hali. Bozuk kod reddedilir; mevcut veri ezilmez.
import type { Ilerleme } from './model';

export const ONEK = 'SO1.';

export class YedekHatasi extends Error {
  constructor(mesaj: string) {
    super(mesaj);
    this.name = 'YedekHatasi';
  }
}

const GUN = /^\d{4}-\d{2}-\d{2}$/;
const PUANLAR = new Set(['bildim', 'kismen', 'bilemedim']);
const nesneMi = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

/** Bilinmeyen veriyi Ilerleme biçimine karşı denetler. */
export function ilerlemeyiDogrula(x: unknown): x is Ilerleme {
  if (!nesneMi(x) || x.surum !== 1) return false;
  const { bitenDersler, sorular, calisilanGunler } = x;
  if (!nesneMi(bitenDersler) || !Object.values(bitenDersler).every((g) => typeof g === 'string' && GUN.test(g))) return false;
  if (!Array.isArray(calisilanGunler) || !calisilanGunler.every((g) => typeof g === 'string' && GUN.test(g))) return false;
  if (!nesneMi(sorular)) return false;
  return Object.values(sorular).every(
    (s) =>
      nesneMi(s) &&
      typeof s.puan === 'string' && PUANLAR.has(s.puan) &&
      Number.isInteger(s.seviye) && (s.seviye as number) >= 0 && (s.seviye as number) <= 5 &&
      typeof s.sonraki === 'string' && GUN.test(s.sonraki),
  );
}

const base64urlKodla = (metin: string): string => {
  let ikili = '';
  for (const b of new TextEncoder().encode(metin)) ikili += String.fromCharCode(b);
  return btoa(ikili).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const base64urlCoz = (kod: string): string => {
  const b64 = kod.replace(/-/g, '+').replace(/_/g, '/');
  const ikili = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(ikili, (c) => c.charCodeAt(0)));
};

export function yedekKoduOlustur(i: Ilerleme): string {
  return ONEK + base64urlKodla(JSON.stringify(i));
}

export function yedekKodunuCoz(kod: string): Ilerleme {
  const temiz = kod.trim();
  if (!temiz.startsWith(ONEK)) throw new YedekHatasi('Bu bir SiberOkul yedek kodu değil.');
  let veri: unknown;
  try {
    veri = JSON.parse(base64urlCoz(temiz.slice(ONEK.length)));
  } catch {
    throw new YedekHatasi('Kod okunamadı; eksik ya da bozuk kopyalanmış olabilir.');
  }
  if (!ilerlemeyiDogrula(veri)) throw new YedekHatasi('Kodun içeriği beklenen biçimde değil.');
  return veri;
}
