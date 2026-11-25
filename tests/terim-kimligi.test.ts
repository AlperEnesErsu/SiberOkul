import { expect, test } from 'vitest';
import { terimKimligi } from '../src/lib/terim-kimligi';

// Korur: Türkçe harfli terimlerin kararlı, URL'de güvenli bir bağlantı kimliğine dönüşmesini
test('Türkçe harfler', () => expect(terimKimligi('Çok faktörlü doğrulama')).toBe('terim-cok-faktorlu-dogrulama'));

// Korur: büyük İ ve noktalama içeren terimlerin bozulmamasını
test('büyük İ ve noktalama', () => expect(terimKimligi('İzin (permission)')).toBe('terim-izin-permission'));

// Korur: baş ve sondaki ayraçların atılmasını
test('kenar ayraçları', () => expect(terimKimligi('  /etc/passwd ')).toBe('terim-etc-passwd'));
