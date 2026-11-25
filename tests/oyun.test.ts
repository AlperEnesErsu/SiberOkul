import { expect, test } from 'vitest';
import { rozetler, tekrarSayisi } from '../src/lib/oyun';
import { bosIlerleme, type Ilerleme, type SoruDurumu } from '../src/lib/ilerleme/model';

const s = (puan: SoruDurumu['puan'], ek: Partial<SoruDurumu> = {}): SoruDurumu => ({ puan, seviye: 0, sonraki: '2026-11-26', ...ek });
const haftaGunleri = (bas: string, n: number) => {
  const [y, a, g] = bas.split('-').map(Number);
  return Array.from({ length: n }, (_, i) => new Date(Date.UTC(y, a - 1, g + i)).toISOString().slice(0, 10));
};

// Korur: tekrar sayısının farklı günlerdeki yeniden puanlamalardan hesaplanmasını
test('tekrar sayısı', () => {
  expect(tekrarSayisi({ ...bosIlerleme(), sorular: { a: s('bildim', { puanSayisi: 3 }), b: s('kismen') } })).toBe(2);
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
