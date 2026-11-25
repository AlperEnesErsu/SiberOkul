// Bütün derslerin sıralı özeti. Sayfalar bunu sayfaya JSON olarak gömer; tarayıcı betikleri okur.
import { getCollection } from 'astro:content';
import type { DersOzet } from './ilerleme/bugun';
import { sirala, soruKimlikleriniDenetle } from './icerik';

export const dersUrl = (kimlik: string) => `${import.meta.env.BASE_URL}dersler/${kimlik}/`;

export async function dersOzetleri(): Promise<DersOzet[]> {
  const veriler = (await getCollection('dersler')).map((d) => d.data);
  soruKimlikleriniDenetle(veriler);
  return sirala(veriler).map((d) => ({
    kimlik: d.kimlik,
    baslik: d.baslik,
    donem: d.donem,
    sira: d.sira,
    sure: d.sure,
    url: dersUrl(d.kimlik),
    soruIdleri: d.sorular.map((s) => s.id),
  }));
}
