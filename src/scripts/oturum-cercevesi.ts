// Oturum çerçevesi: adım listesini çizer, kapı açılınca "Sonraki adım"ı etkinleştirir, ilerletir.
import { ilerlemeOku } from '../lib/ilerleme/depo';
import { bugunStr } from '../lib/ilerleme/tarih';
import { adimTamamMi, ilerlet, oturumOku, oturumYaz, type Oturum } from '../lib/oturum';
import { dersVerisiniOku } from './ders-verisi';
import { ADIM_ADI, ADIM_SIMGE, adimUrl } from './oturum-ortak';
import { DEGISIM_OLAYI } from './puanlama';

const nav = document.getElementById('oturum-adimlari');
const cubuk = document.getElementById('oturum-cubugu');
const dugme = document.getElementById('sonraki-adim') as HTMLButtonElement | null;
const metin = document.getElementById('oturum-cubugu-metin');

const IPUCU: Record<string, string> = {
  tekrar: 'Bütün tekrar sorularını puanla.',
  ders: 'Soruları puanla ve "Dersi bitirdim"e bas.',
  kart: 'Okuyup "Okudum"a bas.',
};

if (nav && cubuk && dugme) {
  const bugun = bugunStr();
  const oturumSayfasi = nav.dataset.her === '1';
  const oturumda = oturumSayfasi || new URLSearchParams(location.search).has('oturum');
  const veri = dersVerisiniOku();
  let oturum: Oturum | null = oturumda ? oturumOku(bugun) : null;

  const ciz = () => {
    if (!oturum || (oturum.bitti && !oturumSayfasi)) return;
    nav.hidden = false;
    const liste = document.getElementById('oturum-adim-listesi')!;
    liste.replaceChildren(
      ...oturum.adimlar.map((a, i) => {
        const li = document.createElement('li');
        const no = document.createElement('span');
        no.className = 'no';
        no.textContent = i < oturum!.konum || oturum!.bitti ? '✓' : String(i + 1);
        li.append(no, `${ADIM_SIMGE[a]} ${ADIM_ADI[a]}`);
        if (i < oturum!.konum || oturum!.bitti) li.classList.add('tamam');
        else if (i === oturum!.konum) {
          li.classList.add('simdi');
          li.setAttribute('aria-current', 'step');
        }
        return li;
      }),
    );
    if (oturum.bitti) {
      cubuk.hidden = true;
      return;
    }
    cubuk.hidden = false;
    const adim = oturum.adimlar[oturum.konum];
    const sonAdim = oturum.konum === oturum.adimlar.length - 1;
    const acik = adimTamamMi(oturum, ilerlemeOku(), bugun);
    dugme.disabled = !acik;
    dugme.textContent = sonAdim ? 'Oturumu bitir 🎉' : 'Sonraki adım →';
    metin!.textContent = acik ? '' : (IPUCU[adim] ?? '');
  };

  dugme.addEventListener('click', () => {
    if (!oturum) return;
    const yeni = ilerlet(oturum, ilerlemeOku(), bugun);
    if (yeni === oturum) return;
    oturum = yeni;
    oturumYaz(yeni);
    const hedef = yeni.bitti ? `${import.meta.env.BASE_URL}oturum/` : adimUrl(yeni, veri.dersler, veri.kartlar);
    if (oturumSayfasi && hedef.endsWith('/oturum/')) {
      document.dispatchEvent(new CustomEvent('oturum-adimi-degisti'));
      ciz();
      window.scrollTo({ top: 0 });
    } else {
      location.href = hedef;
    }
  });

  document.addEventListener(DEGISIM_OLAYI, ciz);
  ciz();
}
