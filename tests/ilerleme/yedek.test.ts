import { expect, test } from 'vitest';
import { ONEK, YedekHatasi, yedekKodunuCoz, yedekKoduOlustur } from '../../src/lib/ilerleme/yedek';
import { bosIlerleme, type Ilerleme } from '../../src/lib/ilerleme/model';

const dolu: Ilerleme = {
  surum: 1,
  bitenDersler: { 'linux-001': '2026-11-25' },
  sorular: { 'linux-001-s1': { puan: 'kismen', seviye: 2, sonraki: '2026-12-02' } },
  calisilanGunler: ['2026-11-24', '2026-11-25'],
};
const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64url');

// Korur: yedek kodunun gidiş-dönüşü
test('gidiş-dönüş', () => {
  const kod = yedekKoduOlustur(dolu);
  expect(kod.startsWith(ONEK)).toBe(true);
  expect(yedekKodunuCoz(kod)).toEqual(dolu);
});

// Korur: Türkçe karakterli anahtarların bozulmamasını
test('Türkçe karakter', () => {
  const i = { ...bosIlerleme(), bitenDersler: { 'güvenlik-001': '2026-11-25' } };
  expect(yedekKodunuCoz(yedekKoduOlustur(i))).toEqual(i);
});

// Korur: başta/sonda boşluklu (kopyala-yapıştır) kodun kabulü
test('boşluklar', () => expect(yedekKodunuCoz(`  ${yedekKoduOlustur(dolu)}\n`)).toEqual(dolu));

// Korur: yanlış önekli kodun reddi
test('yanlış önek', () => expect(() => yedekKodunuCoz('XX1.' + b64('{}'))).toThrow(YedekHatasi));

// Korur: kesik kodun reddi
test('kesik kod', () => expect(() => yedekKodunuCoz(yedekKoduOlustur(dolu).slice(0, 20))).toThrow(YedekHatasi));

// Korur: JSON olmayan içeriğin reddi
test('geçersiz JSON', () => expect(() => yedekKodunuCoz(ONEK + b64('merhaba'))).toThrow(YedekHatasi));

// Korur: bilinmeyen sürümün reddi
test('surum 2', () => expect(() => yedekKodunuCoz(ONEK + b64(JSON.stringify({ ...dolu, surum: 2 })))).toThrow(YedekHatasi));

// Korur: eksik alanlı kaydın reddi
test('eksik alan', () => {
  const { sorular: _, ...eksik } = dolu;
  expect(() => yedekKodunuCoz(ONEK + b64(JSON.stringify(eksik)))).toThrow(YedekHatasi);
});

// Korur: soru durumunda geçersiz puanın reddi
test('geçersiz puan', () => {
  const bozuk = { ...dolu, sorular: { x: { puan: 'belki', seviye: 0, sonraki: '2026-11-25' } } };
  expect(() => yedekKodunuCoz(ONEK + b64(JSON.stringify(bozuk)))).toThrow(YedekHatasi);
});
