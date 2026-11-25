// Tarayıcı deposu (localStorage). Her erişim try/catch içinde: depolama kapalıysa ya da veri bozuksa
// site yine çalışır, ilerleme boş görünür.
import { bosIlerleme, type Ilerleme } from './model';
import { ilerlemeyiDogrula } from './yedek';

export const ANAHTAR = 'siberokul.ilerleme';

const varsayilanDepo = (): Storage | null => {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
};

export function ilerlemeOku(depo: Storage | null = varsayilanDepo()): Ilerleme {
  try {
    const ham = depo?.getItem(ANAHTAR);
    if (!ham) return bosIlerleme();
    const veri: unknown = JSON.parse(ham);
    return ilerlemeyiDogrula(veri) ? veri : bosIlerleme();
  } catch {
    return bosIlerleme();
  }
}

/** Başarılıysa true; depolama kapalı ya da doluysa false. */
export function ilerlemeYaz(i: Ilerleme, depo: Storage | null = varsayilanDepo()): boolean {
  if (!depo) return false;
  try {
    depo.setItem(ANAHTAR, JSON.stringify(i));
    return true;
  } catch {
    return false;
  }
}
