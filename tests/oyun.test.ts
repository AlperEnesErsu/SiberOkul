import { expect, test } from 'vitest';
import { rozetler, seviye, tekrarSayisi, xpHesapla, SEVIYE_ADLARI } from '../src/lib/oyun';
import { bosIlerleme, type Ilerleme, type SoruDurumu } from '../src/lib/ilerleme/model';

const s = (puan: SoruDurumu['puan'], ek: Partial<SoruDurumu> = {}): SoruDurumu => ({ puan, seviye: 0, sonraki: '2026-11-26', ...ek });
const haftaGunleri = (bas: string, n: number) => {
  const [y, a, g] = bas.split('-').map(Number);
  return Array.from({ length: n }, (_, i) => new Date(Date.UTC(y, a - 1, g + i)).toISOString().slice(0, 10));
};

// Korur: boş ilerlemenin 0 XP ve ilk seviye olmasını
test('boş', () => {
  expect(xpHesapla(bosIlerleme())).toBe(0);
  expect(seviye(0)).toEqual({ no: 1, ad: 'Çaylak', buSeviyeXp: 0, sonrakiIcin: 200 });
});

// Korur: ders ve ilk puan XP değerlerinin spec'teki gibi olmasını
test('ders + ilk puanlar', () => {
  const i: Ilerleme = {
    ...bosIlerleme(),
    bitenDersler: { 'linux-001': '2026-11-25' },
    sorular: { a: s('bildim', { ilkPuan: 'bildim', puanSayisi: 1 }), b: s('kismen', { ilkPuan: 'kismen', puanSayisi: 1 }), c: s('bilemedim', { ilkPuan: 'bilemedim', puanSayisi: 1 }) },
  };
  expect(xpHesapla(i)).toBe(65);
});

// Korur: her tekrarın 5 XP vermesini, ilk puanın ilk puana göre sayılmasını
test('tekrarlar', () => {
  const i = { ...bosIlerleme(), sorular: { a: s('bilemedim', { ilkPuan: 'bildim', puanSayisi: 3 }) } };
  expect(xpHesapla(i)).toBe(20);
  expect(tekrarSayisi(i)).toBe(2);
});

// Korur: v1 kaydında (alansız) ilk puanın son puan sayılmasını
test('v1 kaydı', () => expect(xpHesapla({ ...bosIlerleme(), sorular: { a: s('kismen') } })).toBe(5));

// Korur: okunan kartların 10'ar XP vermesini
test('kartlar', () => expect(xpHesapla({ ...bosIlerleme(), okunanKartlar: ['efsane:a', 'atolye:b'] })).toBe(20));

// Korur: seviye sınırlarını
test('seviye sınırları', () => {
  expect(seviye(199).no).toBe(1);
  expect(seviye(200)).toEqual({ no: 2, ad: 'Terminal Çırağı', buSeviyeXp: 0, sonrakiIcin: 200 });
  expect(seviye(450)).toMatchObject({ no: 3, buSeviyeXp: 50 });
  expect(seviye(2500)).toMatchObject({ no: 13, ad: SEVIYE_ADLARI[SEVIYE_ADLARI.length - 1] });
});

// Korur: rozetlerin sınırında açılmasını
test('rozetler', () => {
  expect(rozetler(bosIlerleme(), false)).toEqual([]);
  const i: Ilerleme = {
    ...bosIlerleme(),
    bitenDersler: { 'linux-001': '2026-11-25' },
    calisilanGunler: haftaGunleri('2026-11-23', 5),
    sorular: { a: s('bildim', { puanSayisi: 6 }), b: s('bildim', { puanSayisi: 6 }) },
  };
  expect(rozetler(i, true)).toEqual(['ilk-ders', 'tam-hafta', 'on-tekrar', 'donem-bitti']);
  expect(rozetler({ ...i, sorular: { a: s('bildim', { puanSayisi: 10 }) } }, false)).not.toContain('on-tekrar');
});

// Korur: geçmişteki art arda 3 tam haftanın rozet vermesini, aralıklı haftaların vermemesini
test('üç hafta seri', () => {
  const ard = { ...bosIlerleme(), calisilanGunler: [...haftaGunleri('2026-10-05', 5), ...haftaGunleri('2026-10-12', 5), ...haftaGunleri('2026-10-19', 5)] };
  expect(rozetler(ard, false)).toContain('uc-hafta-seri');
  const aralikli = { ...bosIlerleme(), calisilanGunler: [...haftaGunleri('2026-10-05', 5), ...haftaGunleri('2026-10-12', 5), ...haftaGunleri('2026-10-26', 5)] };
  expect(rozetler(aralikli, false)).not.toContain('uc-hafta-seri');
});
