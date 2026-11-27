import { expect, test } from 'vitest';
import { adimTamamMi, adimUrl, ilerlet, kartSec, oturumOku, oturumPlanla, oturumuAl, oturumYaz, OTURUM_ANAHTARI, type KartOzet } from '../src/lib/oturum';
import type { DersOzet } from '../src/lib/ilerleme/bugun';
import { bosIlerleme, type Ilerleme } from '../src/lib/ilerleme/model';

const B = '2026-11-25';
const d = (n: number): DersOzet => ({ kimlik: `linux-00${n}`, baslik: `D${n}`, donem: 1, sira: n, sure: 30, url: `/d${n}/`, soruIdleri: [`linux-00${n}-s1`] });
const dersler = [d(1), d(2)];
const kartlar: KartOzet[] = [
  { kimlik: 'atolye:002-b', tur: 'atolye', baslik: 'A2', url: '/a2/', no: 2 },
  { kimlik: 'atolye:001-a', tur: 'atolye', baslik: 'A1', url: '/a1/', no: 1 },
  { kimlik: 'efsane:x', tur: 'efsane', baslik: 'X', url: '/x/' },
  { kimlik: 'efsane:y', tur: 'efsane', baslik: 'Y', url: '/y/', ilgiliDers: 'linux-002' },
];
class Depo implements Storage {
  m = new Map<string, string>();
  get length() { return this.m.size; }
  clear() { this.m.clear(); }
  getItem(k: string) { return this.m.get(k) ?? null; }
  key(i: number) { return [...this.m.keys()][i] ?? null; }
  removeItem(k: string) { this.m.delete(k); }
  setItem(k: string, v: string) { this.m.set(k, v); }
}

// Korur: yeni kullanıcının oturumunun ısınma, ders, kart, özet olmasını
test('boş ilerleme planı', () => {
  const o = oturumPlanla(dersler, kartlar, bosIlerleme(), B);
  expect(o).toMatchObject({ gun: B, adimlar: ['isinma', 'ders', 'kart', 'ozet'], konum: 0, ders: 'linux-001', tekrarlar: [], bitti: false });
});

// Korur: zamanı gelen soruların tekrar adımına girmesini
test('tekrar adımı', () => {
  const i: Ilerleme = { ...bosIlerleme(), bitenDersler: { 'linux-001': '2026-11-24' }, sorular: { 'linux-001-s1': { puan: 'bilemedim', seviye: 0, sonraki: B } } };
  const o = oturumPlanla(dersler, kartlar, i, B);
  expect(o.adimlar).toEqual(['isinma', 'tekrar', 'ders', 'kart', 'ozet']);
  expect(o.tekrarlar).toEqual(['linux-001-s1']);
  expect(o.ders).toBe('linux-002');
});

// Korur: yapılacak bir şey kalmayınca yalnız ısınma ve özetin olmasını
test('her şey bitmiş', () => {
  const i: Ilerleme = { ...bosIlerleme(), bitenDersler: { 'linux-001': B, 'linux-002': B }, okunanKartlar: kartlar.map((k) => k.kimlik) };
  expect(oturumPlanla(dersler, kartlar, i, B)).toMatchObject({ adimlar: ['isinma', 'ozet'], ders: null, kart: null });
});

// Korur: kart seçim kuralının sırasını (derse bağlı efsane → en küçük Atölye → herhangi efsane)
test('kart seçimi', () => {
  expect(kartSec(kartlar, bosIlerleme(), 'linux-002')).toBe('efsane:y');
  expect(kartSec(kartlar, bosIlerleme(), 'linux-001')).toBe('atolye:001-a');
  const atolyeOkundu = { ...bosIlerleme(), okunanKartlar: ['atolye:001-a', 'atolye:002-b'] };
  expect(kartSec(kartlar, atolyeOkundu, 'linux-001')).toBe('efsane:x');
});

// Korur: geçiş kapılarının ilerleme kaydına bakmasını
test('kapılar', () => {
  const i: Ilerleme = { ...bosIlerleme(), sorular: { 'linux-001-s1': { puan: 'bilemedim', seviye: 0, sonraki: B } } };
  let o = oturumPlanla(dersler, kartlar, { ...i, bitenDersler: { 'linux-001': '2026-11-20' } }, B);
  o = { ...o, konum: 1 }; // tekrar
  expect(adimTamamMi(o, i, B)).toBe(false);
  const puanli = { ...i, sorular: { 'linux-001-s1': { ...i.sorular['linux-001-s1'], sonGun: B } } };
  expect(adimTamamMi(o, puanli, B)).toBe(true);
  const dersAdimi = { ...o, konum: 2 };
  expect(adimTamamMi(dersAdimi, puanli, B)).toBe(false);
  expect(adimTamamMi(dersAdimi, { ...puanli, bitenDersler: { [dersAdimi.ders!]: B } }, B)).toBe(true);
  const kartAdimi = { ...o, konum: 3 };
  expect(adimTamamMi(kartAdimi, { ...puanli, okunanKartlar: [o.kart!] }, B)).toBe(true);
});

// Korur: kapısı kapalı adımda ilerlemenin olmamasını, son adımda bitmesini
test('ilerlet', () => {
  const o = oturumPlanla(dersler, kartlar, bosIlerleme(), B);
  const ders = ilerlet(o, bosIlerleme(), B);
  expect(ders.konum).toBe(1);
  expect(ilerlet(ders, bosIlerleme(), B).konum).toBe(1);
  const son = { ...o, konum: 3 };
  expect(ilerlet(son, bosIlerleme(), B)).toMatchObject({ konum: 3, bitti: true });
});

// Korur: kaydedilen oturumun aynı gün geri okunmasını, dünküünün ve bozuğun yok sayılmasını
test('oturum deposu', () => {
  const depo = new Depo();
  expect(oturumOku(B, depo)).toBeNull();
  const o = oturumPlanla(dersler, kartlar, bosIlerleme(), B);
  expect(oturumYaz(o, depo)).toBe(true);
  expect(oturumOku(B, depo)).toEqual(o);
  expect(oturumOku('2026-11-26', depo)).toBeNull();
  depo.setItem(OTURUM_ANAHTARI, '{bozuk');
  expect(oturumOku(B, depo)).toBeNull();
  depo.setItem(OTURUM_ANAHTARI, JSON.stringify({ ...o, adimlar: ['uydurma'] }));
  expect(oturumOku(B, depo)).toBeNull();
  expect(oturumOku(B, null)).toBeNull();
});

// Korur: adımlarla alanları tutarsız kaydın (ders adımı var ama ders yok) reddini; sonsuz yönlendirmeyi önler
test('tutarsız oturum kaydı', () => {
  const depo = new Depo();
  const o = oturumPlanla(dersler, kartlar, bosIlerleme(), B);
  depo.setItem(OTURUM_ANAHTARI, JSON.stringify({ ...o, ders: null }));
  expect(oturumOku(B, depo)).toBeNull();
  depo.setItem(OTURUM_ANAHTARI, JSON.stringify({ ...o, kart: null }));
  expect(oturumOku(B, depo)).toBeNull();
  depo.setItem(OTURUM_ANAHTARI, JSON.stringify({ ...o, adimlar: ['isinma', 'ozet'] }));
  expect(oturumOku(B, depo)).toBeNull();
});

// Korur: adımın sayfası bulunamazsa null dönmesini (ör. ders silindi); çağıran /oturum/'a geri dönmez
test('adimUrl bulunamayan ders', () => {
  const o = { ...oturumPlanla(dersler, kartlar, bosIlerleme(), B), konum: 1 };
  expect(adimUrl(o, dersler, kartlar)).toBe('/d1/?oturum');
  expect(adimUrl(o, [], kartlar)).toBeNull();
  expect(adimUrl({ ...o, konum: 2 }, dersler, [])).toBeNull();
  expect(adimUrl({ ...o, konum: 0 }, dersler, kartlar)).toBe('oturum');
});

// Korur: bölge bitince dersin yerine sınav adımının gelmesini
test('sınav adımı', () => {
  const ozet = { donemler: [{ no: 1, planlananDers: 2 }, { no: 2, planlananDers: 1 }], sinavDonemleri: [1] };
  const i = { ...bosIlerleme(), bitenDersler: { 'linux-001': B, 'linux-002': B } };
  const o = oturumPlanla(dersler, kartlar, i, B, ozet);
  expect(o.adimlar).toContain('sinav');
  expect(o.adimlar).not.toContain('ders');
  expect(o.sinav).toBe(1);
  const sinavAdimi = { ...o, konum: o.adimlar.indexOf('sinav') };
  expect(adimTamamMi(sinavAdimi, i, B)).toBe(false);
  expect(adimTamamMi(sinavAdimi, { ...i, sinavlar: { '1': { enIyi: 40, sonGun: B } } }, B)).toBe(true);
  expect(adimUrl(sinavAdimi, dersler, kartlar)).toBe('sinav:1');
});

// Korur: sınav alanı olmayan eski oturum kaydının hâlâ okunmasını, tutarsız sınav kaydının reddini
test('sınav alanı kaydı', () => {
  const depo = new Depo();
  const o = oturumPlanla(dersler, kartlar, bosIlerleme(), B);
  const { sinav: _, ...eski } = o;
  depo.setItem(OTURUM_ANAHTARI, JSON.stringify(eski));
  expect(oturumOku(B, depo)).not.toBeNull();
  depo.setItem(OTURUM_ANAHTARI, JSON.stringify({ ...o, sinav: 3 }));
  expect(oturumOku(B, depo)).toBeNull();
});

// Korur: sınav yanlışlarının oturumun tekrar adımına girmesini
test('sınav yanlışı tekrarda', () => {
  const i = { ...bosIlerleme(), sorular: { 'sinav-linux-3': { puan: 'bilemedim' as const, seviye: 0, sonraki: B } } };
  const o = oturumPlanla(dersler, kartlar, i, B, { donemler: [], sinavDonemleri: [], soruIdleri: ['sinav-linux-3'] });
  expect(o.adimlar).toContain('tekrar');
  expect(o.tekrarlar).toEqual(['sinav-linux-3']);
});

// Korur: "Başlat"a ikinci kez basılınca (ör. geri tuşuyla eski ana sayfaya dönüp) bugünkü oturumun
// sıfırlanmamasını; var olan oturum aynen sürer
test('oturumu al: var olanı korur', () => {
  const depo = new Depo();
  const ilk = oturumuAl(dersler, kartlar, bosIlerleme(), B, undefined, depo);
  oturumYaz({ ...ilk, konum: 2 }, depo);
  const ikinci = oturumuAl(dersler, kartlar, bosIlerleme(), B, undefined, depo);
  expect(ikinci.konum).toBe(2);
  expect(oturumOku(B, depo)?.konum).toBe(2);
});

// Korur: bugüne ait oturum yoksa yenisinin planlanıp kaydedilmesini
test('oturumu al: yoksa planlar ve kaydeder', () => {
  const depo = new Depo();
  const o = oturumuAl(dersler, kartlar, bosIlerleme(), B, undefined, depo);
  expect(o.konum).toBe(0);
  expect(oturumOku(B, depo)).toEqual(o);
});
