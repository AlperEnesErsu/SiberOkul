// Oturumla ilgili sayfalar arası ortak yardımcılar.
import type { DersOzet } from '../lib/ilerleme/bugun';
import type { AdimTuru, KartOzet, Oturum } from '../lib/oturum';

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

/** Oturumun şu anki adımının açılacağı adres. */
export function adimUrl(o: Oturum, dersler: DersOzet[], kartlar: KartOzet[]): string {
  const kok = import.meta.env.BASE_URL;
  const adim = o.adimlar[o.konum];
  if (adim === 'ders') {
    const d = dersler.find((x) => x.kimlik === o.ders);
    if (d) return `${d.url}?oturum`;
  }
  if (adim === 'kart') {
    const k = kartlar.find((x) => x.kimlik === o.kart);
    if (k) return `${k.url}?oturum`;
  }
  return `${kok}oturum/`;
}

/** Tahmini süre (dk): ısınma 2 + tekrar soru başı 1 + ders süresi + kart 5 + özet 1. */
export function tahminiSure(o: Oturum, dersler: DersOzet[]): number {
  const ders = dersler.find((x) => x.kimlik === o.ders)?.sure ?? 0;
  return 2 + o.tekrarlar.length + ders + (o.kart ? 5 : 0) + 1;
}
