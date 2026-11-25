import { expect, test } from 'vitest';
import { ANAHTAR, ilerlemeOku, ilerlemeYaz } from '../../src/lib/ilerleme/depo';
import { bosIlerleme } from '../../src/lib/ilerleme/model';

class SahteDepo implements Storage {
  veri = new Map<string, string>();
  get length() { return this.veri.size; }
  clear() { this.veri.clear(); }
  getItem(k: string) { return this.veri.get(k) ?? null; }
  key(i: number) { return [...this.veri.keys()][i] ?? null; }
  removeItem(k: string) { this.veri.delete(k); }
  setItem(k: string, v: string) { this.veri.set(k, v); }
}
const patlayan = (): Storage => {
  const d = new SahteDepo();
  d.getItem = () => { throw new Error('erişim yok'); };
  d.setItem = () => { throw new Error('kota dolu'); };
  return d;
};

// Korur: localStorage yoksa sitenin boş ilerlemeyle açılmasını
test('depo yok', () => expect(ilerlemeOku(null)).toEqual(bosIlerleme()));

// Korur: getItem hata fırlatırsa çökmemeyi
test('okuma hatası', () => expect(ilerlemeOku(patlayan())).toEqual(bosIlerleme()));

// Korur: bozuk JSON'un boş ilerleme sayılmasını
test('bozuk JSON', () => {
  const d = new SahteDepo();
  d.setItem(ANAHTAR, '{bozuk');
  expect(ilerlemeOku(d)).toEqual(bosIlerleme());
});

// Korur: biçimi tutmayan kaydın boş ilerleme sayılmasını
test('yanlış biçim', () => {
  const d = new SahteDepo();
  d.setItem(ANAHTAR, JSON.stringify({ surum: 1, bitenDersler: 'x' }));
  expect(ilerlemeOku(d)).toEqual(bosIlerleme());
});

// Korur: yazma başarısızlığının bildirilmesini
test('yazma hatası', () => expect(ilerlemeYaz(bosIlerleme(), patlayan())).toBe(false));

// Korur: yaz/oku gidiş-dönüşü
test('gidiş-dönüş', () => {
  const d = new SahteDepo();
  const i = { ...bosIlerleme(), bitenDersler: { 'linux-001': '2026-11-25' }, calisilanGunler: ['2026-11-25'] };
  expect(ilerlemeYaz(i, d)).toBe(true);
  expect(ilerlemeOku(d)).toEqual(i);
});
