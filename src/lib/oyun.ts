// Rozetler. Ayrı bir kayıt tutulmaz; her şey ilerleme kaydından hesaplanır.
import type { Ilerleme } from './ilerleme/model';
import { HAFTALIK_HEDEF } from './ilerleme/seri';
import { gunEkle, haftaBasi } from './ilerleme/tarih';

export type RozetKimligi = 'ilk-ders' | 'tam-hafta' | 'on-tekrar' | 'donem-bitti' | 'uc-hafta-seri';

export const ROZETLER: { kimlik: RozetKimligi; ad: string; aciklama: string; simge: string }[] = [
  { kimlik: 'ilk-ders', ad: 'İlk adım', aciklama: 'İlk dersini bitirdin.', simge: '🎯' },
  { kimlik: 'tam-hafta', ad: 'Tam hafta', aciklama: 'Bir haftada 5 gün çalıştın.', simge: '📅' },
  { kimlik: 'on-tekrar', ad: 'Hafıza', aciklama: '10 kez tekrar yaptın.', simge: '🧠' },
  { kimlik: 'donem-bitti', ad: 'Bölge fethi', aciklama: 'Bir dönemi tamamladın.', simge: '🏁' },
  { kimlik: 'uc-hafta-seri', ad: 'Alışkanlık', aciklama: 'Art arda 3 tam hafta.', simge: '🔥' },
];

/** Farklı günlerde yapılan yeniden puanlamaların toplamı. */
export function tekrarSayisi(i: Ilerleme): number {
  return Object.values(i.sorular).reduce((t, s) => t + Math.max(0, (s.puanSayisi ?? 1) - 1), 0);
}

/** Hafta başı (Pazartesi) → o haftadaki tekil çalışma günü sayısı. */
function tamHaftalar(gunler: string[]): Set<string> {
  const sayi = new Map<string, number>();
  for (const g of new Set(gunler)) sayi.set(haftaBasi(g), (sayi.get(haftaBasi(g)) ?? 0) + 1);
  return new Set([...sayi].filter(([, n]) => n >= HAFTALIK_HEDEF).map(([h]) => h));
}

export function rozetler(i: Ilerleme, bolgeTamamlandi: boolean): RozetKimligi[] {
  const tam = tamHaftalar(i.calisilanGunler);
  const ucArdArda = [...tam].some((h) => tam.has(gunEkle(h, 7)) && tam.has(gunEkle(h, 14)));
  const kazanilan: Record<RozetKimligi, boolean> = {
    'ilk-ders': Object.keys(i.bitenDersler).length >= 1,
    'tam-hafta': tam.size >= 1,
    'on-tekrar': tekrarSayisi(i) >= 10,
    'donem-bitti': bolgeTamamlandi,
    'uc-hafta-seri': ucArdArda,
  };
  return ROZETLER.map((r) => r.kimlik).filter((k) => kazanilan[k]);
}
