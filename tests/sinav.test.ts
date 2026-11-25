import { expect, test } from 'vitest';
import { bekleyenSinav, GECME_YUZDESI, sinavKaydet, sinavSonucu } from '../src/lib/sinav';
import { bosIlerleme, type Ilerleme } from '../src/lib/ilerleme/model';
import { ilerlemeyiDogrula } from '../src/lib/ilerleme/yedek';
import type { DersOzet } from '../src/lib/ilerleme/bugun';

const B = '2026-11-25';
const d = (donem: number, sira: number): DersOzet => ({
  kimlik: `d${donem}-00${sira}`, baslik: 'x', donem, sira, sure: 30, url: '/', soruIdleri: [],
});
const donemler = [
  { no: 1, planlananDers: 2 },
  { no: 2, planlananDers: 1 },
];
const dersler = [d(1, 1), d(1, 2), d(2, 1)];
const bitir = (i: Ilerleme, ...k: string[]) => ({ ...i, bitenDersler: Object.fromEntries(k.map((x) => [x, B])) });

// Korur: puanın doğru sayılmasını ve %70 sınırını
test('sınav sonucu', () => {
  const sorular = Array.from({ length: 10 }, () => ({ dogru: 1 }));
  expect(sinavSonucu(sorular, [1, 1, 1, 1, 1, 1, 1, 0, 0, null])).toEqual({ dogru: 7, toplam: 10, yuzde: 70, gecti: true });
  expect(sinavSonucu(sorular, [1, 1, 1, 1, 1, 1, 0, 0, 0, 0])).toMatchObject({ yuzde: 60, gecti: false });
  expect(GECME_YUZDESI).toBe(70);
});

// Korur: en iyi sonucun saklanmasını, kötü bir denemenin onu silmemesini; deneme gününün güncellenmesini
test('sınav kaydı', () => {
  let i = sinavKaydet(bosIlerleme(), 1, 80, '2026-11-24');
  i = sinavKaydet(i, 1, 50, B);
  expect(i.sinavlar?.['1']).toEqual({ enIyi: 80, sonGun: B });
  expect(i.calisilanGunler).toContain(B);
});

// Korur: sınav kaydının yedek doğrulamasından geçmesini, bozuğunun reddini
test('sınav kaydı doğrulama', () => {
  expect(ilerlemeyiDogrula(sinavKaydet(bosIlerleme(), 1, 80, B))).toBe(true);
  expect(ilerlemeyiDogrula({ ...bosIlerleme(), sinavlar: { '1': { enIyi: 'çok', sonGun: B } } })).toBe(false);
});

// Korur: bölge dersleri bitmeden sınavın beklenmemesini
test('ders bitmeden sınav yok', () => {
  expect(bekleyenSinav(dersler, donemler, bitir(bosIlerleme(), 'd1-001'), [1, 2])).toBeNull();
});

// Korur: bölgenin bütün dersleri bitince sınavın beklenmesini
test('bölge bitince sınav', () => {
  expect(bekleyenSinav(dersler, donemler, bitir(bosIlerleme(), 'd1-001', 'd1-002'), [1, 2])).toBe(1);
});

// Korur: geçilen sınavın bir daha beklenmemesini
test('geçilen sınav', () => {
  const i = sinavKaydet(bitir(bosIlerleme(), 'd1-001', 'd1-002'), 1, 75, B);
  expect(bekleyenSinav(dersler, donemler, i, [1, 2])).toBeNull();
});

// Korur: sınavı olmayan bölgenin sınav beklememesini
test('sınavı olmayan bölge', () => {
  expect(bekleyenSinav(dersler, donemler, bitir(bosIlerleme(), 'd1-001', 'd1-002'), [2])).toBeNull();
});

// Korur: planlanan dersleri henüz yayımlanmamış bölgede sınavın beklenmemesini
test('eksik yayın', () => {
  expect(bekleyenSinav([d(1, 1)], donemler, bitir(bosIlerleme(), 'd1-001'), [1])).toBeNull();
});
