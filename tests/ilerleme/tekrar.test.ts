import { expect, test } from 'vitest';
import { puanla } from '../../src/lib/ilerleme/tekrar';

const B = '2026-11-25';

// Korur: bilinmeyen yeni sorunun ertesi gün geri gelmesini
test('yeni + bilemedim', () => expect(puanla(undefined, 'bilemedim', B)).toEqual({ puan: 'bilemedim', seviye: 0, sonraki: '2026-11-26' }));

// Korur: kısmen bilinen yeni sorunun ertesi gün geri gelmesini
test('yeni + kismen', () => expect(puanla(undefined, 'kismen', B)).toEqual({ puan: 'kismen', seviye: 0, sonraki: '2026-11-26' }));

// Korur: bilinen yeni sorunun 3 gün sonraya ertelenmesini
test('yeni + bildim', () => expect(puanla(undefined, 'bildim', B)).toEqual({ puan: 'bildim', seviye: 1, sonraki: '2026-11-28' }));

// Korur: seviye atlayınca aralığın büyümesini
test('seviye 2 + bildim', () =>
  expect(puanla({ puan: 'bildim', seviye: 2, sonraki: B }, 'bildim', B)).toEqual({ puan: 'bildim', seviye: 3, sonraki: '2026-12-09' }));

// Korur: en üst seviyenin aşılmamasını
test('seviye 5 + bildim', () =>
  expect(puanla({ puan: 'bildim', seviye: 5, sonraki: B }, 'bildim', B)).toEqual({ puan: 'bildim', seviye: 5, sonraki: '2027-01-24' }));

// Korur: unutulan sorunun başa dönmesini
test('seviye 3 + bilemedim', () =>
  expect(puanla({ puan: 'bildim', seviye: 3, sonraki: B }, 'bilemedim', B)).toEqual({ puan: 'bilemedim', seviye: 0, sonraki: '2026-11-26' }));

// Korur: kısmen bilinenin seviyesini koruyup aynı aralıkla tekrar gelmesini
test('seviye 3 + kismen', () =>
  expect(puanla({ puan: 'bildim', seviye: 3, sonraki: B }, 'kismen', B)).toEqual({ puan: 'kismen', seviye: 3, sonraki: '2026-12-09' }));
