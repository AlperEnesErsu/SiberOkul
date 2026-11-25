// İçerik bütünlüğü yardımcıları. Build sırasında çağrılır; sorun varsa build durur.

interface KimlikliDers {
  kimlik: string;
  sorular: { id: string }[];
}

/** Ders kimlikleri ve soru id'leri site genelinde tekil olmalı. Değilse Error fırlatır. */
export function soruKimlikleriniDenetle(dersler: KimlikliDers[]): void {
  const dersGoruldu = new Set<string>();
  const soruGoruldu = new Map<string, string>();
  for (const ders of dersler) {
    if (dersGoruldu.has(ders.kimlik)) {
      throw new Error(`Ders kimliği iki kez kullanılmış: ${ders.kimlik}`);
    }
    dersGoruldu.add(ders.kimlik);
    for (const soru of ders.sorular) {
      const onceki = soruGoruldu.get(soru.id);
      if (onceki) {
        throw new Error(`Soru id'si iki kez kullanılmış: ${soru.id} (${onceki} ve ${ders.kimlik})`);
      }
      soruGoruldu.set(soru.id, ders.kimlik);
    }
  }
}

/** Dersleri önce döneme, sonra dönem içi sıraya göre dizer. Girdiyi değiştirmez. */
export function sirala<T extends { donem: number; sira: number }>(dersler: T[]): T[] {
  return [...dersler].sort((a, b) => a.donem - b.donem || a.sira - b.sira);
}
