// Efsane ve Atölye kartlarının özeti; oturum planı kart adımını buradan seçer.
import { getCollection } from 'astro:content';
import type { KartOzet } from './oturum';

export async function kartOzetleri(): Promise<KartOzet[]> {
  const kok = import.meta.env.BASE_URL;
  const efsaneler = (await getCollection('efsaneler')).map(
    (e): KartOzet => ({
      kimlik: `efsane:${e.id}`,
      tur: 'efsane',
      baslik: e.data.iddia,
      url: `${kok}efsaneler/${e.id}/`,
      ilgiliDers: e.data.ilgiliDers,
    }),
  );
  const atolye = (await getCollection('atolye')).map(
    (k): KartOzet => ({ kimlik: `atolye:${k.id}`, tur: 'atolye', baslik: k.data.baslik, url: `${kok}atolye/${k.id}/`, no: k.data.no }),
  );
  return [...efsaneler, ...atolye];
}
