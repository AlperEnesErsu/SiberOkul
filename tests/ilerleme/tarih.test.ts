import { expect, test } from 'vitest';
import { bugunStr, gunEkle, gunFarki, haftaBasi } from '../../src/lib/ilerleme/tarih';

// Korur: yıl sınırında gün eklemenin kaymamasını
test('yıl sınırı', () => expect(gunEkle('2026-12-31', 1)).toBe('2027-01-01'));

// Korur: artık yıl 29 Şubat'ın atlanmamasını
test('artık yıl', () => expect(gunEkle('2028-02-28', 1)).toBe('2028-02-29'));

// Korur: geriye gün eklemenin ay sınırında doğru çalışmasını
test('geri ay sınırı', () => expect(gunEkle('2026-03-01', -1)).toBe('2026-02-28'));

// Korur: iki gün arasındaki farkın tam gün olarak hesaplanmasını
test('gün farkı', () => expect(gunFarki('2026-11-25', '2026-12-02')).toBe(7));

// Korur: Pazar gününün önceki Pazartesi haftasına sayılmasını
test('Pazar → Pazartesi', () => expect(haftaBasi('2026-11-29')).toBe('2026-11-23'));

// Korur: Pazartesi'nin kendi haftasının başı olmasını
test('Pazartesi kendisi', () => expect(haftaBasi('2026-11-23')).toBe('2026-11-23'));

// Korur: gece yarısına yakın saatlerde yerel günün UTC'ye kaymamasını
test('yerel gün', () => expect(bugunStr(new Date(2026, 10, 25, 23, 59))).toBe('2026-11-25'));
