import { expect, test } from 'vitest';
import { jsonGom } from '../src/lib/json-gom';

// Korur: gömülü JSON'un içerikteki "</script>" yüzünden erken kapanmamasını (XSS ve bozuk sayfa)
test('script kapanışı kaçırılır', () => {
  const metin = jsonGom({ a: '</script><b>' });
  expect(metin).not.toContain('<');
  expect(JSON.parse(metin)).toEqual({ a: '</script><b>' });
});
