// Ders tamponu: Alper günde bir ders yapsa bile önünde hep hazır ders olsun diye, yayımlanmış ders
// sayısı her zaman "başlangıçtan beri geçen gün + TAMPON" veya üstünde tutulur.
import { gunFarki, type Gun } from './ilerleme/tarih';

export const TAMPON = 2;

/** Yazılması gereken ders sayısı (0 veya pozitif). */
export function tamponEksigi(baslangic: Gun, bugun: Gun, mevcutDers: number): number {
  return Math.max(0, gunFarki(baslangic, bugun) + TAMPON - mevcutDers);
}
