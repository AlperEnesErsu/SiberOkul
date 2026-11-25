import { expect, test } from 'vitest';
import { seriHesapla } from '../../src/lib/ilerleme/seri';

const B = '2026-11-25'; // Çarşamba; hafta 2026-11-23 Pazartesi başlar
const gunler = (bas: string, n: number) => {
  const [y, a, g] = bas.split('-').map(Number);
  return Array.from({ length: n }, (_, i) => new Date(Date.UTC(y, a - 1, g + i)).toISOString().slice(0, 10));
};

// Korur: hiç çalışılmamışken serinin sıfır olmasını
test('boş', () => expect(seriHesapla([], B)).toEqual({ seriHafta: 0, buHaftaGun: 0 }));

// Korur: süren haftanın 5'e ulaşmamasının seriyi bozmamasını
test('önceki iki hafta tam, bu hafta 2', () =>
  expect(seriHesapla([...gunler('2026-11-09', 5), ...gunler('2026-11-16', 5), ...gunler('2026-11-23', 2)], B)).toEqual({ seriHafta: 2, buHaftaGun: 2 }));

// Korur: 5 günün altında kalan geçmiş haftanın seriyi kırmasını
test('önceki hafta 4 gün', () =>
  expect(seriHesapla([...gunler('2026-11-09', 5), ...gunler('2026-11-16', 4), ...gunler('2026-11-23', 1)], B)).toEqual({ seriHafta: 0, buHaftaGun: 1 }));

// Korur: bu hafta hedefe ulaşınca seriye eklenmesini
test('bu hafta 5 + önceki 5', () =>
  expect(seriHesapla([...gunler('2026-11-16', 5), ...gunler('2026-11-23', 5)], '2026-11-27')).toEqual({ seriHafta: 2, buHaftaGun: 5 }));

// Korur: aynı günün iki kez sayılmamasını
test('tekrarlı gün', () => expect(seriHesapla([B, B], B)).toEqual({ seriHafta: 0, buHaftaGun: 1 }));
