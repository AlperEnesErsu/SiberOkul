// Soru puanlama düğmeleri (Bildim / Kısmen / Bilemedim). Ders sayfası ve oturumun tekrar adımı kullanır.
// Her değişiklikten sonra `ilerleme-degisti` olayı yayınlanır; oturum çerçevesi kapıyı buna göre günceller.
import { gunuIsaretle } from '../lib/ilerleme/bugun';
import { ilerlemeOku, ilerlemeYaz } from '../lib/ilerleme/depo';
import type { Ilerleme, Puan } from '../lib/ilerleme/model';
import { bugunStr } from '../lib/ilerleme/tarih';
import { puanla } from '../lib/ilerleme/tekrar';

export const DEGISIM_OLAYI = 'ilerleme-degisti';

/** İlerlemeyi kaydeder, olayı yayınlar; kayıt başarısızsa false. */
export function kaydetVeBildir(yeni: Ilerleme): boolean {
  const tamam = ilerlemeYaz(yeni);
  document.dispatchEvent(new CustomEvent(DEGISIM_OLAYI));
  return tamam;
}

/**
 * `[data-soru-id]` öğelerindeki puan düğmelerini işaretler.
 * yalnizBugun: tekrar adımında yalnız bugün verilen puan gösterilir (eski puan "yapıldı" sanılmasın).
 */
export function puanlariCiz(kok: ParentNode, ilerleme: Ilerleme, yalnizBugun = false) {
  const bugun = bugunStr();
  for (const li of kok.querySelectorAll<HTMLElement>('[data-soru-id]')) {
    const durum = ilerleme.sorular[li.dataset.soruId!];
    const gecerli = durum && (!yalnizBugun || durum.sonGun === bugun) ? durum.puan : undefined;
    for (const b of li.querySelectorAll<HTMLButtonElement>('[data-puan]')) {
      b.setAttribute('aria-pressed', String(b.dataset.puan === gecerli));
    }
  }
}

/**
 * Kök içindeki puan düğmelerini bağlar. `sonra` her kayıttan sonra yeni ilerlemeyle çağrılır.
 * Not: ilerleme her tıklamada yeniden okunur; başka sekmede yapılan değişiklik ezilmez.
 */
export function puanlamayiBagla(
  kok: HTMLElement,
  sonra: (i: Ilerleme, kaydedildi: boolean) => void,
  yalnizBugun = false,
) {
  for (const grup of kok.querySelectorAll<HTMLElement>('.puanlar')) grup.hidden = false;
  kok.addEventListener('click', (olay) => {
    const dugme = (olay.target as HTMLElement).closest<HTMLButtonElement>('[data-puan]');
    if (!dugme || !kok.contains(dugme)) return;
    const id = dugme.closest<HTMLElement>('[data-soru-id]')!.dataset.soruId!;
    const bugun = bugunStr();
    const simdiki = ilerlemeOku();
    const durum = puanla(simdiki.sorular[id], dugme.dataset.puan as Puan, bugun);
    const yeni = gunuIsaretle({ ...simdiki, sorular: { ...simdiki.sorular, [id]: durum } }, bugun);
    const kaydedildi = kaydetVeBildir(yeni);
    puanlariCiz(kok, yeni, yalnizBugun);
    sonra(yeni, kaydedildi);
  });
}
