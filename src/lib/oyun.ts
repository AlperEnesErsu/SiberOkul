// XP, seviye ve rozetler. Ayrı bir sayaç tutulmaz; her şey ilerleme kaydından hesaplanır, böylece
// yedek kodu tek başına yeterlidir ve sayaç kayıttan sapamaz.
import type { Ilerleme, Puan } from './ilerleme/model';
import { HAFTALIK_HEDEF } from './ilerleme/seri';
import { gunEkle, haftaBasi } from './ilerleme/tarih';

export const XP = {
  ders: 50,
  ilkPuan: { bildim: 10, kismen: 5, bilemedim: 0 } satisfies Record<Puan, number>,
  tekrar: 5,
  kart: 10,
} as const;

export const SEVIYE_XP = 200;

export const SEVIYE_ADLARI = [
  'Çaylak',
  'Terminal Çırağı',
  'Kabuk Kaşifi',
  'İzin Bekçisi',
  'Betik Ustası',
  'Ağ Gezgini',
  'Paket Avcısı',
  'Kale Mimarı',
  'Pipeline Bekçisi',
  'DevSecOps Adayı',
];

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

export function xpHesapla(i: Ilerleme): number {
  const ders = Object.keys(i.bitenDersler).length * XP.ders;
  const ilk = Object.values(i.sorular).reduce((t, s) => t + XP.ilkPuan[s.ilkPuan ?? s.puan], 0);
  const kart = (i.okunanKartlar?.length ?? 0) * XP.kart;
  return ders + ilk + tekrarSayisi(i) * XP.tekrar + kart;
}

export function seviye(xp: number): { no: number; ad: string; buSeviyeXp: number; sonrakiIcin: number } {
  const no = Math.floor(xp / SEVIYE_XP) + 1;
  const ad = SEVIYE_ADLARI[Math.min(no, SEVIYE_ADLARI.length) - 1];
  return { no, ad, buSeviyeXp: xp % SEVIYE_XP, sonrakiIcin: SEVIYE_XP };
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
