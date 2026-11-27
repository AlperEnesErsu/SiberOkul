// Günlük oturum: o günün her şeyini tek akışta sıralar. Plan günün ilk başlatılışında yapılır ve gün
// boyunca sabit kalır (tekrar soruları puanlandıkça "zamanı gelen" listesi boşalsa da adım kaybolmaz).
// Adım kapıları sayfaya değil ilerleme kaydına bakar; dersi oturum dışından bitirmek de kapıyı açar.
import { bugunSec, type DersOzet } from './ilerleme/bugun';
import type { Ilerleme } from './ilerleme/model';
import type { Gun } from './ilerleme/tarih';
import { bekleyenSinav } from './sinav';

export type AdimTuru = 'isinma' | 'tekrar' | 'ders' | 'sinav' | 'kart' | 'ozet';

export interface KartOzet {
  /** `efsane:<id>` ya da `atolye:<id>` */
  kimlik: string;
  tur: 'efsane' | 'atolye';
  baslik: string;
  url: string;
  ilgiliDers?: string;
  no?: number;
}

export interface Oturum {
  surum: 1;
  gun: Gun;
  adimlar: AdimTuru[];
  konum: number;
  tekrarlar: string[];
  ders: string | null;
  kart: string | null;
  /** Bekleyen bölge sınavının dönem numarası (varsa ders adımının yerini alır). Eski kayıtlarda yok. */
  sinav?: number | null;
  bitti: boolean;
}

/** Sınav adımını planlamak için gereken bilgi; verilmezse sınav adımı hiç planlanmaz. */
export interface SinavBilgisi {
  donemler: { no: number; planlananDers: number }[];
  sinavDonemleri: number[];
  /** Sınav sorularının tekrar kimlikleri (yanlışlar tekrara girer). */
  soruIdleri?: string[];
}

export const OTURUM_ANAHTARI = 'siberokul.oturum';
const ADIMLAR = new Set<AdimTuru>(['isinma', 'tekrar', 'ders', 'sinav', 'kart', 'ozet']);

/** Bugünün dersine bağlı okunmamış efsane → en küçük numaralı okunmamış Atölye → okunmamış herhangi bir efsane. */
export function kartSec(kartlar: KartOzet[], i: Ilerleme, dersKimligi: string | null): string | null {
  const okunan = new Set(i.okunanKartlar ?? []);
  const okunmamis = kartlar.filter((k) => !okunan.has(k.kimlik));
  const bagli = dersKimligi ? okunmamis.find((k) => k.tur === 'efsane' && k.ilgiliDers === dersKimligi) : undefined;
  if (bagli) return bagli.kimlik;
  const atolye = okunmamis.filter((k) => k.tur === 'atolye').sort((a, b) => (a.no ?? 0) - (b.no ?? 0))[0];
  if (atolye) return atolye.kimlik;
  return okunmamis.find((k) => k.tur === 'efsane')?.kimlik ?? null;
}

export function oturumPlanla(
  dersler: DersOzet[],
  kartlar: KartOzet[],
  i: Ilerleme,
  bugun: Gun,
  sinavBilgisi?: SinavBilgisi,
): Oturum {
  const secim = bugunSec(dersler, i, bugun, sinavBilgisi?.soruIdleri ?? []);
  const { tekrarlar } = secim;
  // Bitmiş bir bölgenin sınavı geçilmeden sonraki bölgenin dersine geçilmez.
  const sinav = sinavBilgisi ? bekleyenSinav(dersler, sinavBilgisi.donemler, i, sinavBilgisi.sinavDonemleri) : null;
  const ders = sinav === null ? secim.ders : null;
  const kart = kartSec(kartlar, i, ders?.kimlik ?? null);
  const adimlar: AdimTuru[] = ['isinma'];
  if (tekrarlar.length) adimlar.push('tekrar');
  if (sinav !== null) adimlar.push('sinav');
  else if (ders) adimlar.push('ders');
  if (kart) adimlar.push('kart');
  adimlar.push('ozet');
  return {
    surum: 1,
    gun: bugun,
    adimlar,
    konum: 0,
    tekrarlar,
    ders: ders?.kimlik ?? null,
    kart,
    sinav,
    bitti: false,
  };
}

export function adimTamamMi(o: Oturum, i: Ilerleme, bugun: Gun): boolean {
  switch (o.adimlar[o.konum]) {
    case 'tekrar':
      return o.tekrarlar.every((id) => i.sorular[id]?.sonGun === bugun);
    case 'ders':
      return o.ders !== null && Object.hasOwn(i.bitenDersler, o.ders);
    case 'kart':
      return o.kart !== null && (i.okunanKartlar ?? []).includes(o.kart);
    case 'sinav':
      // Oturum için bugün bir deneme yeterli; bölgenin açılması için geçmek gerekir.
      return o.sinav != null && i.sinavlar?.[String(o.sinav)]?.sonGun === bugun;
    default:
      return true;
  }
}

/** Adım tamamsa sonrakine geçer; son adımda oturumu bitirir. Girdiyi değiştirmez. */
export function ilerlet(o: Oturum, i: Ilerleme, bugun: Gun): Oturum {
  if (!adimTamamMi(o, i, bugun)) return o;
  if (o.konum >= o.adimlar.length - 1) return { ...o, bitti: true };
  return { ...o, konum: o.konum + 1 };
}

function oturumMu(x: unknown): x is Oturum {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    o.surum === 1 &&
    typeof o.gun === 'string' &&
    Array.isArray(o.adimlar) && o.adimlar.length > 0 && o.adimlar.every((a) => ADIMLAR.has(a as AdimTuru)) &&
    Number.isInteger(o.konum) && (o.konum as number) >= 0 && (o.konum as number) < o.adimlar.length &&
    Array.isArray(o.tekrarlar) && o.tekrarlar.every((t) => typeof t === 'string') &&
    (o.ders === null || typeof o.ders === 'string') &&
    (o.kart === null || typeof o.kart === 'string') &&
    typeof o.bitti === 'boolean' &&
    // Adımlar alanlarla tutarlı olmalı; yoksa adımın sayfası bulunamaz (sonsuz yönlendirme riski).
    o.adimlar.includes('ders') === (o.ders !== null) &&
    o.adimlar.includes('kart') === (o.kart !== null) &&
    (o.sinav === undefined || o.sinav === null || Number.isInteger(o.sinav)) &&
    o.adimlar.includes('sinav') === (o.sinav != null)
  );
}

/**
 * Oturumun şu anki adımının açılacağı yer: ders/kart için o sayfanın adresi (`?oturum` ekli),
 * ısınma/tekrar/özet için `'oturum'` (yani /oturum/ sayfası). Ders ya da kart bulunamazsa null;
 * çağıran bu durumda oturumu geçersiz saymalı, /oturum/'a geri yönlendirmemeli.
 */
export function adimUrl(o: Oturum, dersler: DersOzet[], kartlar: KartOzet[]): string | null {
  const adim = o.bitti ? 'ozet' : o.adimlar[o.konum];
  if (adim === 'ders') {
    const d = dersler.find((x) => x.kimlik === o.ders);
    return d ? `${d.url}?oturum` : null;
  }
  if (adim === 'kart') {
    const k = kartlar.find((x) => x.kimlik === o.kart);
    return k ? `${k.url}?oturum` : null;
  }
  if (adim === 'sinav') return o.sinav != null ? `sinav:${o.sinav}` : null;
  return 'oturum';
}

const varsayilanDepo = (): Storage | null => {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
};

/** Bugüne ait geçerli oturum; yoksa, bozuksa ya da başka güne aitse null. */
export function oturumOku(bugun: Gun, depo: Storage | null = varsayilanDepo()): Oturum | null {
  try {
    const ham = depo?.getItem(OTURUM_ANAHTARI);
    if (!ham) return null;
    const veri: unknown = JSON.parse(ham);
    return oturumMu(veri) && veri.gun === bugun ? veri : null;
  } catch {
    return null;
  }
}

export function oturumYaz(o: Oturum, depo: Storage | null = varsayilanDepo()): boolean {
  if (!depo) return false;
  try {
    depo.setItem(OTURUM_ANAHTARI, JSON.stringify(o));
    return true;
  } catch {
    return false;
  }
}

/**
 * Bugünün oturumunu verir: geçerli bir kayıt varsa onu (sıfırlamadan), yoksa yenisini planlayıp kaydeder.
 * "Başlat" düğmesi her zaman bunu kullanır; geri tuşuyla dönülen eski bir ana sayfadan tekrar
 * basılsa bile süren oturum baştan başlamaz.
 */
export function oturumuAl(
  dersler: DersOzet[],
  kartlar: KartOzet[],
  i: Ilerleme,
  bugun: Gun,
  sinavBilgisi?: SinavBilgisi,
  depo?: Storage | null,
): Oturum {
  const mevcut = oturumOku(bugun, depo);
  if (mevcut) return mevcut;
  const yeni = oturumPlanla(dersler, kartlar, i, bugun, sinavBilgisi);
  oturumYaz(yeni, depo);
  return yeni;
}
