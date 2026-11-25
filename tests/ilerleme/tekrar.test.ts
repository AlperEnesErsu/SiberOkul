import { expect, test } from 'vitest';
import { puanla } from '../../src/lib/ilerleme/tekrar';

const B = '2026-11-25';

// Korur: bilinmeyen yeni sorunun ertesi gün geri gelmesini
test('yeni + bilemedim', () => expect(puanla(undefined, 'bilemedim', B)).toMatchObject({ puan: 'bilemedim', seviye: 0, sonraki: '2026-11-26' }));

// Korur: kısmen bilinen yeni sorunun ertesi gün geri gelmesini
test('yeni + kismen', () => expect(puanla(undefined, 'kismen', B)).toMatchObject({ puan: 'kismen', seviye: 0, sonraki: '2026-11-26' }));

// Korur: bilinen yeni sorunun 3 gün sonraya ertelenmesini
test('yeni + bildim', () => expect(puanla(undefined, 'bildim', B)).toMatchObject({ puan: 'bildim', seviye: 1, sonraki: '2026-11-28' }));

// Korur: seviye atlayınca aralığın büyümesini
test('seviye 2 + bildim', () =>
  expect(puanla({ puan: 'bildim', seviye: 2, sonraki: B }, 'bildim', B)).toMatchObject({ puan: 'bildim', seviye: 3, sonraki: '2026-12-09' }));

// Korur: en üst seviyenin aşılmamasını
test('seviye 5 + bildim', () =>
  expect(puanla({ puan: 'bildim', seviye: 5, sonraki: B }, 'bildim', B)).toMatchObject({ puan: 'bildim', seviye: 5, sonraki: '2027-01-24' }));

// Korur: unutulan sorunun başa dönmesini
test('seviye 3 + bilemedim', () =>
  expect(puanla({ puan: 'bildim', seviye: 3, sonraki: B }, 'bilemedim', B)).toMatchObject({ puan: 'bilemedim', seviye: 0, sonraki: '2026-11-26' }));

// Korur: kısmen bilinenin seviyesini koruyup aynı aralıkla tekrar gelmesini
test('seviye 3 + kismen', () =>
  expect(puanla({ puan: 'bildim', seviye: 3, sonraki: B }, 'kismen', B)).toMatchObject({ puan: 'kismen', seviye: 3, sonraki: '2026-12-09' }));

// Korur: yeni sorunun ilk puanını, sayacını ve gününü kaydetmesini (tekrar sayısı ve oturum kapısı bunlara dayanır)
test('yeni soru izleme alanları', () =>
  expect(puanla(undefined, 'kismen', B)).toMatchObject({ ilkPuan: 'kismen', puanSayisi: 1, sonGun: B }));

// Korur: sonraki günde yeniden puanlamanın tekrar sayılmasını ve ilk puanın korunmasını
test('ertesi gün tekrar', () => {
  const ilk = puanla(undefined, 'bilemedim', B);
  expect(puanla(ilk, 'bildim', '2026-11-26')).toMatchObject({ ilkPuan: 'bilemedim', puanSayisi: 2, sonGun: '2026-11-26' });
});

// Korur: aynı gün ikinci puanlamanın tekrar sayılmamasını (rozet sayacı şişmesin)
test('aynı gün ikinci puan', () => {
  const ilk = puanla(undefined, 'bilemedim', B);
  expect(puanla(ilk, 'bildim', B)).toMatchObject({ ilkPuan: 'bilemedim', puanSayisi: 1, puan: 'bildim' });
});

// Korur: v1 kaydından (alansız) gelen sorunun doğru sayılmasını
test('v1 kaydı', () =>
  expect(puanla({ puan: 'kismen', seviye: 1, sonraki: B }, 'bildim', '2026-11-27')).toMatchObject({ ilkPuan: 'kismen', puanSayisi: 2 }));
