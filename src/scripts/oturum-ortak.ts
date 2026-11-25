// Oturumla ilgili sayfalar arası ortak yardımcılar.
import type { DersOzet } from '../lib/ilerleme/bugun';
import { adimUrl, type AdimTuru, type KartOzet, type Oturum } from '../lib/oturum';
import { DONEMLER } from '../data/donemler';

export const ADIM_ADI: Record<AdimTuru, string> = {
  isinma: 'Isınma',
  tekrar: 'Tekrar',
  ders: 'Ders',
  sinav: 'Bölge sınavı',
  kart: 'Okuma kartı',
  ozet: 'Özet',
};

export const ADIM_SIMGE: Record<AdimTuru, string> = {
  isinma: '☕',
  tekrar: '🔁',
  ders: '📘',
  sinav: '📝',
  kart: '🔎',
  ozet: '🏆',
};

/** Adımın tam adresi; sayfası bulunamazsa null (oturum geçersiz sayılmalı). */
export function adimAdresi(o: Oturum, dersler: DersOzet[], kartlar: KartOzet[]): string | null {
  const hedef = adimUrl(o, dersler, kartlar);
  if (hedef === null) return null;
  if (hedef === 'oturum') return `${import.meta.env.BASE_URL}oturum/`;
  if (hedef.startsWith('sinav:')) {
    const d = DONEMLER.find((x) => x.no === Number(hedef.slice(6)));
    return d ? `${import.meta.env.BASE_URL}sinav/${d.slug}/?oturum` : null;
  }
  return hedef;
}

/** Tahmini süre (dk): ısınma 2 + tekrar soru başı 1 + ders süresi + kart 5 + özet 1. */
export function tahminiSure(o: Oturum, dersler: DersOzet[]): number {
  const ders = dersler.find((x) => x.kimlik === o.ders)?.sure ?? 0;
  return 2 + o.tekrarlar.length + ders + (o.sinav != null ? 20 : 0) + (o.kart ? 5 : 0) + 1;
}
