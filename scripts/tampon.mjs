// Ders tamponunu ölçer ve sonucu JSON olarak yazar. Zamanlanmış görev bunu okuyup kaç ders
// yazacağına karar verir. Çalıştır: npm run tampon
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const KOK = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const TAMPON = 2;
const GUN_MS = 86_400_000;

const baslangic = readFileSync(join(KOK, 'src/data/baslangic.ts'), 'utf8').match(/'(\d{4}-\d{2}-\d{2})'/)?.[1];
if (!baslangic) throw new Error('src/data/baslangic.ts içinde BASLANGIC tarihi bulunamadı');

const dersDizini = join(KOK, 'src/content/dersler');
const mevcut = readdirSync(dersDizini, { recursive: true }).filter((f) => String(f).endsWith('.md')).length;

const simdi = new Date();
const bugunUtc = Date.UTC(simdi.getFullYear(), simdi.getMonth(), simdi.getDate());
const [y, a, g] = baslangic.split('-').map(Number);
const gecen = Math.round((bugunUtc - Date.UTC(y, a - 1, g)) / GUN_MS);
const gerekli = Math.max(0, gecen) + TAMPON;

console.log(JSON.stringify({ gerekli, mevcut, eksik: Math.max(0, gerekli - mevcut) }));
