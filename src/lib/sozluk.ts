// Sözlük yardımcıları: bütün terimleri toplar, ders sayfası için ada göre bulur.
import { getCollection } from 'astro:content';
export { terimKimligi } from './terim-kimligi';

export interface Terim {
  terim: string;
  ingilizce?: string;
  tanim: string;
  ders?: string;
  donem: number;
}

export async function butunTerimler(): Promise<Terim[]> {
  const dosyalar = await getCollection('sozluk');
  return dosyalar
    .flatMap((d) => d.data.terimler.map((t) => ({ ...t, donem: d.data.donem })))
    .sort((a, b) => a.terim.localeCompare(b.terim, 'tr-TR'));
}
