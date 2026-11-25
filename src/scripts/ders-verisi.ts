// DersVerisi.astro'nun gömdüğü JSON'u okur.
import type { Donem } from '../data/donemler';
import type { DersOzet } from '../lib/ilerleme/bugun';
import type { KartOzet } from '../lib/oturum';

export interface DersVerisi {
  dersler: DersOzet[];
  donemler: Donem[];
  kartlar: KartOzet[];
}

export function dersVerisiniOku(): DersVerisi {
  const el = document.getElementById('ders-listesi');
  return el?.textContent ? JSON.parse(el.textContent) : { dersler: [], donemler: [], kartlar: [] };
}

/** Dönem no → o dönemde yayımlanmış ders kimlikleri. */
export function yayimlananlar(dersler: DersOzet[]): Record<number, string[]> {
  const sonuc: Record<number, string[]> = {};
  for (const d of dersler) (sonuc[d.donem] ??= []).push(d.kimlik);
  return sonuc;
}
