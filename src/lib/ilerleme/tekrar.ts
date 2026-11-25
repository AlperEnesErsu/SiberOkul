// Aralıklı tekrar: iyi bilinen soru giderek seyrekleşir, unutulan soru başa döner.
import type { Puan, SoruDurumu } from './model';
import { gunEkle, type Gun } from './tarih';

/** Seviyeye göre bir sonraki tekrara kalan gün sayısı. */
export const ARALIKLAR = [1, 3, 7, 14, 30, 60];
const EN_UST = ARALIKLAR.length - 1;

export function puanla(eski: SoruDurumu | undefined, puan: Puan, bugun: Gun): SoruDurumu {
  let seviye = eski?.seviye ?? 0;
  if (puan === 'bilemedim') seviye = 0;
  else if (puan === 'bildim') seviye = Math.min(seviye + 1, EN_UST);
  const ilkPuan = eski ? (eski.ilkPuan ?? eski.puan) : puan;
  const oncekiSayi = eski ? (eski.puanSayisi ?? 1) : 0;
  // Aynı gün ikinci puanlama tekrar sayılmaz.
  const puanSayisi = eski && eski.sonGun === bugun ? oncekiSayi : oncekiSayi + 1;
  return { puan, seviye, sonraki: gunEkle(bugun, ARALIKLAR[seviye]), ilkPuan, puanSayisi, sonGun: bugun };
}
