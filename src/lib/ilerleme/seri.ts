// Seri kuralı: haftada en az HAFTALIK_HEDEF gün çalışıldıysa hafta seriye sayılır.
// Süren hafta henüz hedefe ulaşmadıysa seriyi bozmaz.
import { gunEkle, haftaBasi, type Gun } from './tarih';

export const HAFTALIK_HEDEF = 5;

export function seriHesapla(calisilanGunler: Gun[], bugun: Gun): { seriHafta: number; buHaftaGun: number } {
  const haftaSayilari = new Map<Gun, number>();
  for (const g of new Set(calisilanGunler)) {
    const h = haftaBasi(g);
    haftaSayilari.set(h, (haftaSayilari.get(h) ?? 0) + 1);
  }
  const buHafta = haftaBasi(bugun);
  const buHaftaGun = haftaSayilari.get(buHafta) ?? 0;

  let seriHafta = buHaftaGun >= HAFTALIK_HEDEF ? 1 : 0;
  for (let h = gunEkle(buHafta, -7); (haftaSayilari.get(h) ?? 0) >= HAFTALIK_HEDEF; h = gunEkle(h, -7)) {
    seriHafta++;
  }
  return { seriHafta, buHaftaGun };
}
