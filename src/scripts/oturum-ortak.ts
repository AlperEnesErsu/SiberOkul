// Oturumla ilgili sayfalar arası ortak yardımcılar.
import type { DersOzet } from '../lib/ilerleme/bugun';
import { adimUrl, type AdimTuru, type KartOzet, type Oturum } from '../lib/oturum';

export const ADIM_ADI: Record<AdimTuru, string> = {
  isinma: 'Isınma',
  tekrar: 'Tekrar',
  ders: 'Ders',
  kart: 'Okuma kartı',
  ozet: 'Özet',
};

export const ADIM_SIMGE: Record<AdimTuru, string> = {
  isinma: '☕',
  tekrar: '🔁',
  ders: '📘',
  kart: '🔎',
  ozet: '🏆',
};

/** Adımın tam adresi; sayfası bulunamazsa null (oturum geçersiz sayılmalı). */
export function adimAdresi(o: Oturum, dersler: DersOzet[], kartlar: KartOzet[]): string | null {
  const hedef = adimUrl(o, dersler, kartlar);
  if (hedef === null) return null;
  return hedef === 'oturum' ? `${import.meta.env.BASE_URL}oturum/` : hedef;
}

/** Tahmini süre (dk): ısınma 2 + tekrar soru başı 1 + ders süresi + kart 5 + özet 1. */
export function tahminiSure(o: Oturum, dersler: DersOzet[]): number {
  const ders = dersler.find((x) => x.kimlik === o.ders)?.sure ?? 0;
  return 2 + o.tekrarlar.length + ders + (o.kart ? 5 : 0) + 1;
}
