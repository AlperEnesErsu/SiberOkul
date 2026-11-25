// Pano sayfalarının ortak durum özeti: XP, seviye, seri, rozetler, bölge durumları.
import { bolgeDurumlari } from '../lib/bolge';
import { ilerlemeOku } from '../lib/ilerleme/depo';
import type { Ilerleme } from '../lib/ilerleme/model';
import { seriHesapla } from '../lib/ilerleme/seri';
import { bugunStr } from '../lib/ilerleme/tarih';
import { rozetler, seviye, xpHesapla, type RozetKimligi } from '../lib/oyun';
import { dersVerisiniOku, yayimlananlar, type DersVerisi } from './ders-verisi';

export interface Durum {
  veri: DersVerisi;
  ilerleme: Ilerleme;
  bugun: string;
  xp: number;
  seviye: ReturnType<typeof seviye>;
  seri: ReturnType<typeof seriHesapla>;
  bolgeler: ReturnType<typeof bolgeDurumlari>;
  rozetler: RozetKimligi[];
}

export function durumHesapla(): Durum {
  const veri = dersVerisiniOku();
  const ilerleme = ilerlemeOku();
  const bugun = bugunStr();
  const xp = xpHesapla(ilerleme);
  const bolgeler = bolgeDurumlari(veri.donemler, yayimlananlar(veri.dersler), new Set(Object.keys(ilerleme.bitenDersler)));
  return {
    veri,
    ilerleme,
    bugun,
    xp,
    seviye: seviye(xp),
    seri: seriHesapla(ilerleme.calisilanGunler, bugun),
    bolgeler,
    rozetler: rozetler(ilerleme, bolgeler.includes('tamamlandi')),
  };
}

/** Metni güvenli biçimde yazar (innerHTML kullanılmaz). */
export function yaz(secici: string, metin: string, kok: ParentNode = document) {
  const el = kok.querySelector<HTMLElement>(secici);
  if (el) el.textContent = metin;
}
