import { describe, expect, test } from 'vitest';
import { sirala, soruKimlikleriniDenetle } from '../src/lib/icerik';

const ders = (kimlik: string, ...ids: string[]) => ({ kimlik, sorular: ids.map((id) => ({ id })) });

describe('soruKimlikleriniDenetle', () => {
  // Korur: aynı soru id'sinin iki derste kullanılmasını (aralıklı tekrar soruları karıştırırdı)
  test('tekrar eden soru id hata verir', () => {
    expect(() =>
      soruKimlikleriniDenetle([ders('linux-001', 'linux-001-s1'), ders('linux-002', 'linux-001-s1')]),
    ).toThrow(/linux-001-s1/);
  });

  // Korur: aynı ders kimliğinin iki dosyada kullanılmasını (ilerleme yanlış derse yazılırdı)
  test('tekrar eden ders kimliği hata verir', () => {
    expect(() =>
      soruKimlikleriniDenetle([ders('linux-002', 'linux-002-s1'), ders('linux-002', 'linux-002-s2')]),
    ).toThrow(/linux-002/);
  });

  // Korur: tekil kimliklerin sorunsuz geçmesini
  test('tekil kimlikler geçer', () => {
    expect(() =>
      soruKimlikleriniDenetle([ders('linux-001', 'linux-001-s1'), ders('linux-002', 'linux-002-s1')]),
    ).not.toThrow();
  });
});

describe('sirala', () => {
  // Korur: ders sırasının önce dönem, sonra sıra ile kurulmasını
  test('dönem sonra sıra', () => {
    const girdi = [
      { donem: 2, sira: 1 },
      { donem: 1, sira: 2 },
      { donem: 1, sira: 1 },
    ];
    expect(sirala(girdi)).toEqual([
      { donem: 1, sira: 1 },
      { donem: 1, sira: 2 },
      { donem: 2, sira: 1 },
    ]);
  });
});
