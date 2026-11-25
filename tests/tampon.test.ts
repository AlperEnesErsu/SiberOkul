import { expect, test } from 'vitest';
import { tamponEksigi } from '../src/lib/tampon';

// Korur: ilk gün 2 dersin yetmesini
test('ilk gün', () => expect(tamponEksigi('2026-11-25', '2026-11-25', 2)).toBe(0));

// Korur: geçen her gün için bir ders daha gerekmesini
test('3 gün sonra', () => expect(tamponEksigi('2026-11-25', '2026-11-28', 2)).toBe(3));

// Korur: fazla ders varken eksi sayı dönmemesini
test('fazla ders', () => expect(tamponEksigi('2026-11-25', '2026-11-26', 10)).toBe(0));

// Korur: başlangıçtan önceki bir tarihte ders istenmemesini
test('başlangıç öncesi', () => expect(tamponEksigi('2026-11-25', '2026-11-20', 0)).toBe(0));
