import { expect, test } from 'vitest';
import { bugunSec, dersiBitir, type DersOzet } from '../../src/lib/ilerleme/bugun';
import { bosIlerleme } from '../../src/lib/ilerleme/model';

const B = '2026-11-25';
const d = (n: number): DersOzet => ({
  kimlik: `linux-00${n}`, baslik: `Ders ${n}`, donem: 1, sira: n, sure: 30, url: `/d/${n}/`,
  soruIdleri: [`linux-00${n}-s1`, `linux-00${n}-s2`],
});
const dersler = [d(1), d(2)];

// Korur: hiç başlamamış birine ilk dersin gösterilmesini
test('ilk ders', () => expect(bugunSec(dersler, bosIlerleme(), B).ders?.kimlik).toBe('linux-001'));

// Korur: biten dersin atlanıp sıradakinin gösterilmesini
test('sıradaki', () => {
  const i = dersiBitir(bosIlerleme(), 'linux-001', B);
  expect(bugunSec(dersler, i, B).ders?.kimlik).toBe('linux-002');
});

// Korur: bütün dersler bitince çökmeden ders: null dönmesini
test('hepsi bitti', () => {
  const i = dersiBitir(dersiBitir(bosIlerleme(), 'linux-001', B), 'linux-002', B);
  expect(bugunSec(dersler, i, B).ders).toBeNull();
});

// Korur: zamanı gelen sorunun tekrara girmesini, gelmeyenin girmemesini
test('tekrarlar', () => {
  const i = bosIlerleme();
  i.sorular['linux-001-s2'] = { puan: 'bilemedim', seviye: 0, sonraki: '2026-11-24' };
  i.sorular['linux-001-s1'] = { puan: 'bildim', seviye: 1, sonraki: '2026-11-26' };
  expect(bugunSec(dersler, i, B).tekrarlar).toEqual(['linux-001-s2']);
});

// Korur: silinmiş bir dersin eski sorusunun yok sayılmasını
test('bilinmeyen soru', () => {
  const i = bosIlerleme();
  i.sorular['silinmis-001-s1'] = { puan: 'bilemedim', seviye: 0, sonraki: '2026-11-20' };
  expect(bugunSec(dersler, i, B).tekrarlar).toEqual([]);
});

// Korur: tekrarların en eski tarihten başlayarak sıralanmasını
test('tekrar sırası', () => {
  const i = bosIlerleme();
  i.sorular['linux-002-s1'] = { puan: 'kismen', seviye: 0, sonraki: '2026-11-25' };
  i.sorular['linux-001-s1'] = { puan: 'kismen', seviye: 0, sonraki: '2026-11-20' };
  expect(bugunSec(dersler, i, B).tekrarlar).toEqual(['linux-001-s1', 'linux-002-s1']);
});

// Korur: dersi bitirmenin aynı günü ikinci kez eklememesini
test('dersiBitir tekil gün', () => {
  const i = dersiBitir(dersiBitir(bosIlerleme(), 'linux-001', B), 'linux-002', B);
  expect(i.calisilanGunler).toEqual([B]);
  expect(i.bitenDersler).toEqual({ 'linux-001': B, 'linux-002': B });
});

// Korur: ders dışı (sınav) soruların, ek kimlik verildiğinde tekrara girmesini
test('ek soru kimlikleri', () => {
  const i = bosIlerleme();
  i.sorular['sinav-linux-2'] = { puan: 'bilemedim', seviye: 0, sonraki: '2026-11-24' };
  expect(bugunSec(dersler, i, B).tekrarlar).toEqual([]);
  expect(bugunSec(dersler, i, B, ['sinav-linux-2']).tekrarlar).toEqual(['sinav-linux-2']);
});
