// "Bugün" seçimi: sıradaki bitmemiş ders + zamanı gelen tekrar soruları.
import type { Ilerleme } from './model';
import type { Gun } from './tarih';

export interface DersOzet {
  kimlik: string;
  baslik: string;
  donem: number;
  sira: number;
  sure: number;
  url: string;
  soruIdleri: string[];
}

/** dersler sıralı gelmeli (dönem, sıra). */
export function bugunSec(
  dersler: DersOzet[],
  ilerleme: Ilerleme,
  bugun: Gun,
  /** Ders dışı tekrar soruları (ör. sınav yanlışları) için bilinen kimlikler. */
  ekSoruIdleri: Iterable<string> = [],
): { ders: DersOzet | null; tekrarlar: string[] } {
  const ders = dersler.find((d) => !(d.kimlik in ilerleme.bitenDersler)) ?? null;
  const bilinenSorular = new Set([...dersler.flatMap((d) => d.soruIdleri), ...ekSoruIdleri]);
  const tekrarlar = Object.entries(ilerleme.sorular)
    .filter(([id, durum]) => bilinenSorular.has(id) && durum.sonraki <= bugun)
    .sort(([, a], [, b]) => (a.sonraki < b.sonraki ? -1 : a.sonraki > b.sonraki ? 1 : 0))
    .map(([id]) => id);
  return { ders, tekrarlar };
}

/** Çalışılan günü tekil olarak ekler. Girdiyi değiştirmez. */
export function gunuIsaretle(i: Ilerleme, bugun: Gun): Ilerleme {
  return i.calisilanGunler.includes(bugun) ? i : { ...i, calisilanGunler: [...i.calisilanGunler, bugun] };
}

export function dersiBitir(i: Ilerleme, kimlik: string, bugun: Gun): Ilerleme {
  return gunuIsaretle({ ...i, bitenDersler: { ...i.bitenDersler, [kimlik]: bugun } }, bugun);
}
