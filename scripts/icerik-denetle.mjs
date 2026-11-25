// İçerik denetleyici: bütün ders, sınav ve efsane dosyalarını okur, şemanın en sık bozulan kurallarını
// denetler ve bütün sorunları tek seferde listeler (build ilk hatada durur). Kullanım:
//   node scripts/icerik-denetle.mjs            → hepsi
//   node scripts/icerik-denetle.mjs ag         → yalnız bir bölge (ders + sınav + o önekli efsaneler)
// Not: asıl kapı yine `npm run build` (src/content.config.ts); bu araç hızlı ön kontrol içindir.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const KOK = fileURLToPath(new URL('..', import.meta.url));
const ICERIK = join(KOK, 'src', 'content');
const filtre = process.argv[2];
const sorunlar = [];
const sorun = (dosya, mesaj) => sorunlar.push(`${dosya}: ${mesaj}`);

function frontmatter(yol) {
  const metin = readFileSync(yol, 'utf8');
  const m = metin.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) throw new Error('frontmatter (--- ... ---) bulunamadı');
  const belge = YAML.parseDocument(m[1]);
  if (belge.errors.length) throw new Error(belge.errors.map((e) => e.message).join(' | '));
  return { veri: belge.toJS(), govde: metin.slice(m[0].length) };
}

const httpsMi = (u) => typeof u === 'string' && /^https:\/\/[^\s]+$/.test(u);
const metinMi = (x, en = 1) => typeof x === 'string' && x.trim().length >= en;

function dersDenetle(yol, ad) {
  const { veri: d, govde } = frontmatter(yol);
  if (!/^[a-z]+-\d{3}$/.test(d.kimlik ?? '')) sorun(ad, `kimlik geçersiz: ${d.kimlik}`);
  for (const k of ['baslik', 'neden']) if (!metinMi(d[k], 3)) sorun(ad, `${k} eksik`);
  if (!Number.isInteger(d.donem) || d.donem < 1 || d.donem > 8) sorun(ad, 'donem 1-8 tam sayı olmalı');
  if (!Number.isInteger(d.sira) || d.sira < 1) sorun(ad, 'sira pozitif tam sayı olmalı');
  if (!Number.isInteger(d.sure) || d.sure < 5 || d.sure > 180) sorun(ad, 'sure 5-180 tam sayı olmalı');
  if (!metinMi(d.analoji?.baslik) || !metinMi(d.analoji?.metin, 10)) sorun(ad, 'analoji { baslik, metin } eksik');
  const g = d.gorev ?? {};
  if (!metinMi(g.aciklama) || !metinMi(g.soru)) sorun(ad, 'gorev.aciklama / gorev.soru eksik');
  if (!Array.isArray(g.komutlar) || !g.komutlar.length) sorun(ad, 'gorev.komutlar boş');
  else g.komutlar.forEach((k, i) => {
    if (typeof k !== 'string') sorun(ad, `gorev.komutlar[${i}] metin değil (içinde ": " varsa tırnak içine al)`);
  });
  if (!metinMi(g.telefon?.soru, 10) || !metinMi(g.telefon?.cevap, 5)) sorun(ad, 'gorev.telefon { soru, cevap } eksik');
  if (!Array.isArray(d.sorular) || d.sorular.length < 3) sorun(ad, 'en az 3 soru gerekli');
  else d.sorular.forEach((s, i) => {
    if (!new RegExp(`^${d.kimlik}-s\\d+$`).test(s?.id ?? '')) sorun(ad, `sorular[${i}].id "${d.kimlik}-s<n>" olmalı (bulunan: ${s?.id})`);
    if (!metinMi(s?.soru, 5) || !metinMi(s?.cevap, 2)) sorun(ad, `sorular[${i}] soru/cevap eksik`);
  });
  for (const [i, o] of (d.derinDalis ?? []).entries()) {
    if (!['kitap', 'lab', 'okuma'].includes(o?.tur)) sorun(ad, `derinDalis[${i}].tur kitap|lab|okuma olmalı`);
    if (o?.url !== undefined && !httpsMi(o.url)) sorun(ad, `derinDalis[${i}].url https olmalı`);
  }
  if (/<script|<iframe|javascript:/i.test(govde)) sorun(ad, 'gövdede ham HTML/script var');
  return d;
}

function sinavDenetle(yol, ad) {
  const { veri: s } = frontmatter(yol);
  if (!Number.isInteger(s.donem)) sorun(ad, 'donem eksik');
  if (!metinMi(s.baslik)) sorun(ad, 'baslik eksik');
  if (!Array.isArray(s.sorular) || s.sorular.length < 15) sorun(ad, `en az 15 soru gerekli (bulunan ${s.sorular?.length ?? 0})`);
  (s.sorular ?? []).forEach((q, i) => {
    if (!metinMi(q?.soru, 5) || !metinMi(q?.aciklama, 5)) sorun(ad, `sorular[${i}] soru/aciklama eksik`);
    if (!Array.isArray(q?.secenekler) || q.secenekler.length < 2 || q.secenekler.length > 5) sorun(ad, `sorular[${i}].secenekler 2-5 olmalı`);
    else if (q.secenekler.some((x) => typeof x !== 'string')) sorun(ad, `sorular[${i}].secenekler metin olmalı`);
    if (!Number.isInteger(q?.dogru) || q.dogru < 0 || q.dogru >= (q?.secenekler?.length ?? 0)) sorun(ad, `sorular[${i}].dogru geçersiz`);
  });
}

function efsaneDenetle(yol, ad) {
  const { veri: e } = frontmatter(yol);
  if (!metinMi(e.iddia, 5) || !metinMi(e.ozet, 10)) sorun(ad, 'iddia/ozet eksik');
  if (!['dogru', 'kismen', 'yanlis'].includes(e.hukum)) sorun(ad, 'hukum dogru|kismen|yanlis olmalı');
  if (!Array.isArray(e.kaynaklar) || !e.kaynaklar.length) sorun(ad, 'en az 1 kaynak gerekli');
  else e.kaynaklar.forEach((k, i) => { if (!httpsMi(k?.url)) sorun(ad, `kaynaklar[${i}].url https olmalı`); });
  if (e.ilgiliDers !== undefined && !/^[a-z]+-\d{3}$/.test(e.ilgiliDers)) sorun(ad, 'ilgiliDers biçimi geçersiz');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.tarih ?? '')) sorun(ad, 'tarih YYYY-MM-DD olmalı');
}

const dosyalar = (dizin) => (existsSync(dizin) ? readdirSync(dizin).filter((f) => f.endsWith('.md')) : []);
const calistir = (yol, ad, fn) => {
  try {
    return fn(yol, ad);
  } catch (e) {
    sorun(ad, `okunamadı: ${e.message}`);
  }
};

const kimlikler = new Map();
const soruIdleri = new Map();
const dersKok = join(ICERIK, 'dersler');
for (const bolge of readdirSync(dersKok)) {
  if (filtre && bolge !== filtre) continue;
  for (const f of dosyalar(join(dersKok, bolge))) {
    const ad = `dersler/${bolge}/${f}`;
    const d = calistir(join(dersKok, bolge, f), ad, dersDenetle);
    if (!d) continue;
    if (kimlikler.has(d.kimlik)) sorun(ad, `kimlik ${d.kimlik} ${kimlikler.get(d.kimlik)} ile çakışıyor`);
    kimlikler.set(d.kimlik, ad);
    for (const s of d.sorular ?? []) {
      if (soruIdleri.has(s.id)) sorun(ad, `soru id ${s.id} ${soruIdleri.get(s.id)} ile çakışıyor`);
      soruIdleri.set(s.id, ad);
    }
  }
}
for (const f of dosyalar(join(ICERIK, 'sinavlar'))) {
  if (filtre && f !== `${filtre}.md`) continue;
  calistir(join(ICERIK, 'sinavlar', f), `sinavlar/${f}`, sinavDenetle);
}
for (const f of dosyalar(join(ICERIK, 'efsaneler'))) {
  if (filtre && !f.startsWith(`${filtre}-`)) continue;
  calistir(join(ICERIK, 'efsaneler', f), `efsaneler/${f}`, efsaneDenetle);
}

if (sorunlar.length) {
  console.log(sorunlar.join('\n'));
  console.log(`\n${sorunlar.length} sorun.`);
  process.exit(1);
}
console.log('Sorun yok.');
