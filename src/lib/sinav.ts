// Bölge sınavları: puanlama, en iyi sonucu saklama, hangi sınavın beklediği.
import { gunuIsaretle, type DersOzet } from './ilerleme/bugun';
import type { Ilerleme } from './ilerleme/model';
import type { Gun } from './ilerleme/tarih';
import { puanla } from './ilerleme/tekrar';

export const GECME_YUZDESI = 70;

export function sinavSonucu(
  sorular: { dogru: number }[],
  cevaplar: (number | null)[],
): { dogru: number; toplam: number; yuzde: number; gecti: boolean } {
  const dogru = sorular.filter((s, i) => cevaplar[i] === s.dogru).length;
  const toplam = sorular.length;
  const yuzde = toplam ? Math.round((dogru / toplam) * 100) : 0;
  return { dogru, toplam, yuzde, gecti: yuzde >= GECME_YUZDESI };
}

/** Denemeyi kaydeder: en iyi yüzde korunur, son deneme günü güncellenir, gün çalışılmış sayılır. */
export function sinavKaydet(i: Ilerleme, donem: number, yuzde: number, bugun: Gun): Ilerleme {
  const eski = i.sinavlar?.[String(donem)];
  const kayit = { enIyi: Math.max(eski?.enIyi ?? 0, yuzde), sonGun: bugun };
  return gunuIsaretle({ ...i, sinavlar: { ...i.sinavlar, [String(donem)]: kayit } }, bugun);
}

/** Sınav sorusunun tekrar sistemindeki kimliği (n: 1'den başlayan soru sırası). */
export function sinavSoruId(bolgeSlug: string, n: number): string {
  return `sinav-${bolgeSlug}-${n}`;
}

/**
 * Sınav sonucunu tekrar sistemine işler: yanlış cevaplanan sorular "bilemedim" olarak eklenir;
 * daha önce listede olup bu sefer doğru cevaplananlar "bildim" ile ilerler. Hiç yanlış yapılmamış
 * doğru cevaplar listeye eklenmez.
 */
export function sinavYanlislariniKaydet(i: Ilerleme, bolgeSlug: string, dogruMu: boolean[], bugun: Gun): Ilerleme {
  const sorular = { ...i.sorular };
  dogruMu.forEach((dogru, k) => {
    const id = sinavSoruId(bolgeSlug, k + 1);
    if (!dogru) sorular[id] = puanla(sorular[id], 'bilemedim', bugun);
    else if (sorular[id]) sorular[id] = puanla(sorular[id], 'bildim', bugun);
  });
  return { ...i, sorular };
}

export function sinavGecildi(i: Ilerleme, donem: number): boolean {
  return (i.sinavlar?.[String(donem)]?.enIyi ?? 0) >= GECME_YUZDESI;
}

/**
 * Dönem sırasıyla: planlanan bütün dersleri yayımlanmış ve bitirilmiş, sınavı olan ve henüz geçilmemiş
 * ilk dönem. Yoksa null.
 */
export function bekleyenSinav(
  dersler: DersOzet[],
  donemler: { no: number; planlananDers: number }[],
  i: Ilerleme,
  sinavDonemleri: number[],
): number | null {
  for (const d of donemler) {
    const bolge = dersler.filter((x) => x.donem === d.no);
    const hepsiBitti = bolge.length >= d.planlananDers && bolge.every((x) => Object.hasOwn(i.bitenDersler, x.kimlik));
    if (hepsiBitti && sinavDonemleri.includes(d.no) && !sinavGecildi(i, d.no)) return d.no;
  }
  return null;
}
