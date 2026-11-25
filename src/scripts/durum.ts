// Pano sayfalarının ortak durum özeti: seri, bölge durumları.
import { bolgeDurumlari } from '../lib/bolge';
import { sinavGecildi } from '../lib/sinav';
import { ilerlemeOku } from '../lib/ilerleme/depo';
import type { Ilerleme } from '../lib/ilerleme/model';
import { seriHesapla } from '../lib/ilerleme/seri';
import { bugunStr } from '../lib/ilerleme/tarih';
import { dersVerisiniOku, yayimlananlar, type DersVerisi } from './ders-verisi';

export interface Durum {
  veri: DersVerisi;
  ilerleme: Ilerleme;
  bugun: string;
  seri: ReturnType<typeof seriHesapla>;
  bolgeler: ReturnType<typeof bolgeDurumlari>;
}

export function durumHesapla(): Durum {
  const veri = dersVerisiniOku();
  const ilerleme = ilerlemeOku();
  const bugun = bugunStr();
  const gecilen = new Set(veri.sinavDonemleri.filter((n) => sinavGecildi(ilerleme, n)));
  const bolgeler = bolgeDurumlari(veri.donemler, yayimlananlar(veri.dersler), new Set(Object.keys(ilerleme.bitenDersler)), {
    sinavDonemleri: veri.sinavDonemleri,
    gecilen,
  });
  return {
    veri,
    ilerleme,
    bugun,
    seri: seriHesapla(ilerleme.calisilanGunler, bugun),
    bolgeler,
  };
}

/** Metni güvenli biçimde yazar (innerHTML kullanılmaz). */
export function yaz(secici: string, metin: string, kok: ParentNode = document) {
  const el = kok.querySelector<HTMLElement>(secici);
  if (el) el.textContent = metin;
}
