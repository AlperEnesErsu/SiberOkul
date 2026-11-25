// Tarihler YYYY-MM-DD metni olarak tutulur. Aritmetik UTC üzerinde yapılır ki yaz saati ya da
// saat dilimi bir günü kaydırmasın. Yalnız bugunStr yerel saati okur.

export type Gun = string;

const parcala = (g: Gun): number => {
  const [y, a, d] = g.split('-').map(Number);
  return Date.UTC(y, a - 1, d);
};
const metne = (ms: number): Gun => new Date(ms).toISOString().slice(0, 10);
const GUN_MS = 86_400_000;

/** Kullanıcının yerel takvimine göre bugünün tarihi. */
export function bugunStr(d: Date = new Date()): Gun {
  const a = String(d.getMonth() + 1).padStart(2, '0');
  const g = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${a}-${g}`;
}

export function gunEkle(g: Gun, n: number): Gun {
  return metne(parcala(g) + n * GUN_MS);
}

/** b − a, gün olarak. */
export function gunFarki(a: Gun, b: Gun): number {
  return Math.round((parcala(b) - parcala(a)) / GUN_MS);
}

/** Günün bulunduğu haftanın Pazartesi'si. */
export function haftaBasi(g: Gun): Gun {
  const haftaninGunu = new Date(parcala(g)).getUTCDay(); // 0 = Pazar
  return gunEkle(g, -((haftaninGunu + 6) % 7));
}
