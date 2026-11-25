// DersVerisi.astro'nun gömdüğü JSON'u okur.
import type { Donem } from '../data/donemler';
import type { DersOzet } from '../lib/ilerleme/bugun';

export function dersVerisiniOku(): { dersler: DersOzet[]; donemler: Donem[] } {
  const el = document.getElementById('ders-listesi');
  return el?.textContent ? JSON.parse(el.textContent) : { dersler: [], donemler: [] };
}

/** Dönem no → o dönemde yayımlanmış ders kimlikleri. */
export function yayimlananlar(dersler: DersOzet[]): Record<number, string[]> {
  const sonuc: Record<number, string[]> = {};
  for (const d of dersler) (sonuc[d.donem] ??= []).push(d.kimlik);
  return sonuc;
}
