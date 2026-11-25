// Ders sayfası: soruları puanlama, puanlama kapısı, "Dersi bitirdim".
import { dersiBitir, gunuIsaretle } from '../lib/ilerleme/bugun';
import { ilerlemeOku, ilerlemeYaz } from '../lib/ilerleme/depo';
import type { Ilerleme, Puan } from '../lib/ilerleme/model';
import { bugunStr } from '../lib/ilerleme/tarih';
import { puanla } from '../lib/ilerleme/tekrar';

const makale = document.querySelector<HTMLElement>('article[data-ders]');

if (makale) {
  const kimlik = makale.dataset.ders!;
  const soruIdleri: string[] = JSON.parse(makale.dataset.sorular ?? '[]');
  const sonrakiUrl = makale.dataset.sonraki ?? '';
  const bitirDugmesi = document.getElementById('bitir') as HTMLButtonElement;
  const durum = document.getElementById('bitir-durum')!;
  const sonrakiBag = document.getElementById('sonraki-ders') as HTMLAnchorElement;
  const uyari = document.getElementById('kayit-uyarisi')!;

  let ilerleme: Ilerleme = ilerlemeOku();

  const kaydet = (yeni: Ilerleme) => {
    ilerleme = yeni;
    uyari.hidden = ilerlemeYaz(yeni);
  };

  const ciz = () => {
    for (const li of makale.querySelectorAll<HTMLElement>('[data-soru-id]')) {
      const secili = ilerleme.sorular[li.dataset.soruId!]?.puan;
      for (const b of li.querySelectorAll<HTMLButtonElement>('[data-puan]')) {
        b.setAttribute('aria-pressed', String(b.dataset.puan === secili));
      }
    }
    const puanlanan = soruIdleri.filter((id) => id in ilerleme.sorular).length;
    const bitti = kimlik in ilerleme.bitenDersler;
    if (bitti) {
      bitirDugmesi.disabled = true;
      bitirDugmesi.textContent = 'Bitti ✓';
      durum.textContent = '';
      if (sonrakiUrl) {
        sonrakiBag.href = sonrakiUrl;
        sonrakiBag.hidden = false;
      }
    } else {
      bitirDugmesi.disabled = puanlanan < soruIdleri.length;
      durum.textContent = bitirDugmesi.disabled ? `Önce soruları puanla (${puanlanan}/${soruIdleri.length})` : '';
    }
  };

  for (const grup of makale.querySelectorAll<HTMLElement>('.puanlar')) grup.hidden = false;

  makale.addEventListener('click', (olay) => {
    const dugme = (olay.target as HTMLElement).closest<HTMLButtonElement>('[data-puan]');
    if (!dugme) return;
    const id = dugme.closest<HTMLElement>('[data-soru-id]')!.dataset.soruId!;
    const bugun = bugunStr();
    const durumu = puanla(ilerleme.sorular[id], dugme.dataset.puan as Puan, bugun);
    kaydet(gunuIsaretle({ ...ilerleme, sorular: { ...ilerleme.sorular, [id]: durumu } }, bugun));
    ciz();
  });

  bitirDugmesi.addEventListener('click', () => {
    kaydet(dersiBitir(ilerleme, kimlik, bugunStr()));
    ciz();
  });

  ciz();
}
