// Yolculuk haritası: bölge durumları ve biten dersler.
import { bolgeDurumlari } from '../lib/bolge';
import { ilerlemeOku } from '../lib/ilerleme/depo';
import { dersVerisiniOku, yayimlananlar } from './ders-verisi';

const { dersler, donemler } = dersVerisiniOku();
const biten = new Set(Object.keys(ilerlemeOku().bitenDersler));
const yayin = yayimlananlar(dersler);
const durumlar = bolgeDurumlari(donemler, yayin, biten);
const etiket = { kilitli: '🔒 Kilitli', devam: 'Devam ediyor', tamamlandi: '✓ Tamamlandı' } as const;

donemler.forEach((d, i) => {
  const li = document.querySelector<HTMLElement>(`.bolge[data-donem="${d.no}"]`);
  if (!li) return;
  li.dataset.durum = durumlar[i];
  li.querySelector('.durum')!.textContent = etiket[durumlar[i]];
  li.querySelector('.biten')!.textContent = String((yayin[d.no] ?? []).filter((k) => biten.has(k)).length);
  if (durumlar[i] === 'devam') li.querySelector('details')!.open = true;
});

for (const li of document.querySelectorAll<HTMLElement>('[data-kimlik]')) {
  if (biten.has(li.dataset.kimlik!)) li.classList.add('bitti');
}
