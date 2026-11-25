// Sözlük teriminden sayfa içi bağlantı kimliği (astro:content gerektirmez; testlenebilir).
/** Terim adından sayfa içi bağlantı kimliği üretir (Türkçe harfler sadeleştirilir). */
export function terimKimligi(terim: string): string {
  const harita: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', İ: 'i', ö: 'o', ş: 's', ü: 'u' };
  return (
    'terim-' +
    terim
      .toLocaleLowerCase('tr-TR')
      .replace(/[çğıİöşü]/g, (c) => harita[c] ?? c)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  );
}
