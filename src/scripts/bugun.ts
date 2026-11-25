// Ana sayfa = oturum kapısı: istatistikler, oturumu başlat / devam et / bitti özeti, bölgeler.
import { bugunSec } from '../lib/ilerleme/bugun';
import { oturumOku, oturumPlanla, oturumYaz, type Oturum } from '../lib/oturum';
import { durumHesapla, yaz } from './durum';
import { yayimlananlar } from './ders-verisi';
import { ADIM_ADI, ADIM_SIMGE, adimUrl, tahminiSure } from './oturum-ortak';

const d = durumHesapla();
const { dersler, kartlar, donemler } = d.veri;

yaz('#tarih', new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }));
yaz('#seri', String(d.seri.seriHafta));
yaz('#biten-ders', String(Object.keys(d.ilerleme.bitenDersler).length));
yaz('#rozet-ozet', `${d.rozetler.length}/5`);

// Oturum kapısı
const kayitli = oturumOku(d.bugun);
const oturum: Oturum = kayitli ?? oturumPlanla(dersler, kartlar, d.ilerleme, d.bugun);
const ders = dersler.find((x) => x.kimlik === oturum.ders);
const dugme = document.getElementById('kapi-dugme') as HTMLAnchorElement;

const liste = document.getElementById('kapi-adimlar')!;
liste.replaceChildren(
  ...oturum.adimlar.map((a, i) => {
    const li = document.createElement('li');
    const ek = a === 'tekrar' ? ` (${oturum.tekrarlar.length})` : a === 'ders' && ders ? ` ${String(ders.sira).padStart(3, '0')}` : '';
    li.textContent = `${ADIM_SIMGE[a]} ${ADIM_ADI[a]}${ek}`;
    if (kayitli && (i < oturum.konum || oturum.bitti)) li.classList.add('tamam');
    if (kayitli && !oturum.bitti && i === oturum.konum) li.classList.add('simdi');
    return li;
  }),
);

if (oturum.bitti) {
  const yarin = bugunSec(dersler, d.ilerleme, d.bugun).ders;
  yaz('#kapi-durum', 'Bugün tamam ✓');
  yaz('#kapi-baslik', 'Harika iş! Bugünkü oturum bitti.');
  yaz('#kapi-alt', yarin ? `Yarın: Ders ${String(yarin.sira).padStart(3, '0')} · ${yarin.baslik}` : 'Yeni ders yarın burada.');
  dugme.textContent = 'Özeti gör';
  dugme.href = `${import.meta.env.BASE_URL}oturum/`;
  dugme.classList.remove('birincil');
  yaz('#selam-baslik', 'Yarın görüşürüz 👋');
} else if (kayitli) {
  yaz('#kapi-durum', `Sürüyor · Adım ${oturum.konum + 1}/${oturum.adimlar.length}`);
  yaz('#kapi-baslik', ders ? `Bugün: ${ders.baslik}` : 'Bugünün oturumu');
  dugme.textContent = 'Kaldığın yerden devam et →';
  dugme.href = adimUrl(oturum, dersler, kartlar);
  yaz('#kapi-sure', `~${tahminiSure(oturum, dersler)} dk`);
} else {
  yaz('#kapi-durum', 'Hazır');
  yaz('#kapi-baslik', ders ? `Bugün: ${ders.baslik}` : 'Bugün tekrar ve okuma günü');
  yaz('#kapi-sure', `~${tahminiSure(oturum, dersler)} dk`);
  dugme.textContent = 'Bugünün oturumunu başlat →';
  dugme.addEventListener('click', (olay) => {
    olay.preventDefault();
    const yeni = oturumPlanla(dersler, kartlar, d.ilerleme, d.bugun);
    oturumYaz(yeni);
    location.href = adimUrl(yeni, dersler, kartlar);
  });
}

// Bölgeler
const yayin = yayimlananlar(dersler);
donemler.forEach((dn, i) => {
  const li = document.querySelector<HTMLElement>(`.bolge[data-donem="${dn.no}"]`);
  if (!li) return;
  const biten = (yayin[dn.no] ?? []).filter((k) => Object.hasOwn(d.ilerleme.bitenDersler, k)).length;
  const oran = dn.planlananDers > 0 ? (biten / dn.planlananDers) * 100 : 0;
  li.querySelector<HTMLElement>('.dolu')!.style.width = `${Math.min(100, oran)}%`;
  li.querySelector('.bolge-sayi')!.textContent = `${biten}/${dn.planlananDers}${d.bolgeler[i] === 'kilitli' ? ' · 🔒' : ''}`;
  if (d.bolgeler[i] === 'kilitli') li.classList.add('kilitli');
});
