// Yolculuk patikası: bölge durumları, biten ve sıradaki ders taşları.
import { bugunSec } from '../lib/ilerleme/bugun';
import { durumHesapla } from './durum';
import { yayimlananlar } from './ders-verisi';

const d = durumHesapla();
const yayin = yayimlananlar(d.veri.dersler);
const etiket = { kilitli: '🔒 Kilitli', devam: '▶ Devam ediyor', tamamlandi: '✓ Tamamlandı' } as const;
const siradaki = bugunSec(d.veri.dersler, d.ilerleme, d.bugun).ders?.kimlik;

d.veri.donemler.forEach((dn, i) => {
  const li = document.querySelector<HTMLElement>(`.bolge[data-donem="${dn.no}"]`);
  if (!li) return;
  li.dataset.durum = d.bolgeler[i];
  li.querySelector('.durum')!.textContent = etiket[d.bolgeler[i]];
  li.querySelector('.biten')!.textContent = String(
    (yayin[dn.no] ?? []).filter((k) => Object.hasOwn(d.ilerleme.bitenDersler, k)).length,
  );
});

for (const li of document.querySelectorAll<HTMLElement>('[data-kimlik]')) {
  const k = li.dataset.kimlik!;
  if (Object.hasOwn(d.ilerleme.bitenDersler, k)) li.classList.add('bitti');
  if (k === siradaki) li.classList.add('siradaki');
}
