import { expect, test } from 'vitest';
import { bolgeDurumlari } from '../src/lib/bolge';

const donemler = [
  { no: 1, planlananDers: 2 },
  { no: 2, planlananDers: 1 },
  { no: 3, planlananDers: 1 },
];
const yayin = { 1: ['a', 'b'], 2: ['c'], 3: [] as string[] };

// Korur: ilk dönemin hiç başlanmamışken bile açık olmasını
test('başlangıç', () => expect(bolgeDurumlari(donemler, yayin, new Set())).toEqual(['devam', 'kilitli', 'kilitli']));

// Korur: dönem bitince tamamlandı sayılıp sonrakinin açılmasını
test('ilk dönem bitti', () =>
  expect(bolgeDurumlari(donemler, yayin, new Set(['a', 'b']))).toEqual(['tamamlandi', 'devam', 'kilitli']));

// Korur: yayımlanan dersler bitse de planlanan sayıya ulaşmayan dönemin tamamlandı sayılmamasını
test('eksik yayın', () =>
  expect(bolgeDurumlari(donemler, { 1: ['a'], 2: [], 3: [] }, new Set(['a']))).toEqual(['devam', 'kilitli', 'kilitli']));

// Korur: önceki dönem bitmeden içinden ders bitirilen dönemin açık, onu izleyenin de açılmasını
test('ileri atlama', () =>
  expect(bolgeDurumlari(donemler, yayin, new Set(['c']))).toEqual(['devam', 'tamamlandi', 'devam']));
