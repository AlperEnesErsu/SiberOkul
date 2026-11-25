// Ana sayfa: seri, Bugün kartı, tekrar soruları, dönem ilerleme şeritleri.
import { bugunSec } from '../lib/ilerleme/bugun';
import { ilerlemeOku } from '../lib/ilerleme/depo';
import { seriHesapla, HAFTALIK_HEDEF } from '../lib/ilerleme/seri';
import { bugunStr } from '../lib/ilerleme/tarih';
import { dersVerisiniOku, yayimlananlar } from './ders-verisi';

const { dersler, donemler } = dersVerisiniOku();
const ilerleme = ilerlemeOku();
const bugun = bugunStr();
const { ders, tekrarlar } = bugunSec(dersler, ilerleme, bugun);

const seri = seriHesapla(ilerleme.calisilanGunler, bugun);
document.getElementById('seri')!.textContent =
  `🔥 ${seri.seriHafta} hafta · bu hafta ${seri.buHaftaGun}/${HAFTALIK_HEDEF}`;

const kutu = document.getElementById('bugun-icerik')!;
kutu.replaceChildren();
if (ders) {
  const h2 = document.createElement('h2');
  h2.textContent = ders.baslik;
  const bilgi = document.createElement('p');
  bilgi.className = 'soluk';
  bilgi.textContent = `Ders ${String(ders.sira).padStart(3, '0')} · ~${ders.sure} dk · ${ders.soruIdleri.length} soru`;
  const a = document.createElement('a');
  a.className = 'dugme birincil';
  a.href = ders.url;
  a.textContent = 'Derse başla →';
  kutu.append(h2, bilgi, a);
} else {
  const p = document.createElement('p');
  p.textContent = dersler.length
    ? 'Yayımlanan bütün dersleri bitirdin. Yeni ders yarın burada.'
    : 'Henüz yayımlanmış ders yok.';
  kutu.append(p);
}

if (tekrarlar.length) {
  const soruDersi = new Map(dersler.flatMap((d) => d.soruIdleri.map((id, i) => [id, { d, no: i + 1 }] as const)));
  document.getElementById('tekrar')!.hidden = false;
  document.getElementById('tekrar-ozet')!.textContent = `Bugün tekrar edilecek ${tekrarlar.length} soru.`;
  const liste = document.getElementById('tekrar-liste')!;
  for (const id of tekrarlar) {
    const bilgi = soruDersi.get(id)!;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `${bilgi.d.url}#soru-${id}`;
    a.textContent = `${bilgi.d.baslik} · Soru ${bilgi.no}`;
    li.append(a);
    liste.append(li);
  }
}

const yayin = yayimlananlar(dersler);
for (const d of donemler) {
  const li = document.querySelector<HTMLElement>(`[data-donem="${d.no}"]`);
  if (!li) continue;
  const biten = (yayin[d.no] ?? []).filter((k) => k in ilerleme.bitenDersler).length;
  li.querySelector<HTMLElement>('.dolu')!.style.width = `${Math.min(100, (biten / d.planlananDers) * 100)}%`;
  li.querySelector('.sayi')!.textContent = `${biten}/${d.planlananDers}`;
}
