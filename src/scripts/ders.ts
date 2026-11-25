// Ders sayfası: soruları puanlama, puanlama kapısı, "Dersi bitirdim", içindekiler sayacı.
import { dersiBitir } from '../lib/ilerleme/bugun';
import { ilerlemeOku } from '../lib/ilerleme/depo';
import type { Ilerleme } from '../lib/ilerleme/model';
import { bugunStr } from '../lib/ilerleme/tarih';
import { kaydetVeBildir, puanlamayiBagla, puanlariCiz } from './puanlama';

const makale = document.querySelector<HTMLElement>('article[data-ders]');

if (makale) {
  const kimlik = makale.dataset.ders!;
  const soruIdleri: string[] = JSON.parse(makale.dataset.sorular ?? '[]');
  const sonrakiUrl = makale.dataset.sonraki ?? '';
  const oturumda = new URLSearchParams(location.search).has('oturum');
  const bitirDugmesi = document.getElementById('bitir') as HTMLButtonElement;
  const durum = document.getElementById('bitir-durum')!;
  const sonrakiBag = document.getElementById('sonraki-ders') as HTMLAnchorElement;
  const uyari = document.getElementById('kayit-uyarisi')!;
  const sayac = document.getElementById('soru-sayaci');

  const ciz = (i: Ilerleme) => {
    puanlariCiz(makale, i);
    const puanlanan = soruIdleri.filter((id) => Object.hasOwn(i.sorular, id)).length;
    if (sayac) sayac.textContent = `${puanlanan}/${soruIdleri.length} soru puanlandı`;
    if (Object.hasOwn(i.bitenDersler, kimlik)) {
      bitirDugmesi.disabled = true;
      bitirDugmesi.textContent = 'Bitti ✓';
      durum.textContent = oturumda ? 'Oturumda sonraki adıma geçebilirsin.' : '';
      if (sonrakiUrl && !oturumda) {
        sonrakiBag.href = sonrakiUrl;
        sonrakiBag.hidden = false;
      }
    } else {
      bitirDugmesi.disabled = puanlanan < soruIdleri.length;
      durum.textContent = bitirDugmesi.disabled ? `Önce soruları puanla (${puanlanan}/${soruIdleri.length})` : '';
    }
  };

  puanlamayiBagla(makale, (i, kaydedildi) => {
    uyari.hidden = kaydedildi;
    ciz(i);
  });

  bitirDugmesi.addEventListener('click', () => {
    const yeni = dersiBitir(ilerlemeOku(), kimlik, bugunStr());
    uyari.hidden = kaydetVeBildir(yeni);
    ciz(yeni);
  });

  ciz(ilerlemeOku());
}
