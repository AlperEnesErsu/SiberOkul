// Yolculuk haritasında her dönemin (bölgenin) durumu.
export type BolgeDurumu = 'kilitli' | 'devam' | 'tamamlandi';

/**
 * tamamlandi: dönemin bütün planlanan dersleri yayımlanmış ve bitmiş.
 * kilitli: dönemde biten ders yok ve önceki dönem tamamlanmamış (ilk dönem asla kilitli değil).
 * devam: diğer her durum.
 */
export function bolgeDurumlari(
  donemler: { no: number; planlananDers: number }[],
  yayimlanan: Record<number, string[]>,
  biten: Set<string>,
): BolgeDurumu[] {
  const sonuc: BolgeDurumu[] = [];
  donemler.forEach((d, i) => {
    const dersler = yayimlanan[d.no] ?? [];
    const bitenSayi = dersler.filter((k) => biten.has(k)).length;
    if (dersler.length >= d.planlananDers && d.planlananDers > 0 && bitenSayi === dersler.length) sonuc.push('tamamlandi');
    else if (i === 0 || bitenSayi > 0 || sonuc[i - 1] === 'tamamlandi') sonuc.push('devam');
    else sonuc.push('kilitli');
  });
  return sonuc;
}
