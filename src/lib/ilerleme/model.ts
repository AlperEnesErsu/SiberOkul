import type { Gun } from './tarih';

export type Puan = 'bildim' | 'kismen' | 'bilemedim';

export interface SoruDurumu {
  puan: Puan;
  /** 0-5; ARALIKLAR dizisindeki konum. */
  seviye: number;
  /** Sorunun yeniden sorulacağı gün. */
  sonraki: Gun;
  /** İlk puanlamadaki puan. v1 kayıtlarında yok; yoksa `puan` sayılır. */
  ilkPuan?: Puan;
  /** Farklı günlerde kaç kez puanlandığı. Yoksa 1 sayılır. */
  puanSayisi?: number;
  /** Son puanlandığı gün. */
  sonGun?: Gun;
}

export interface Ilerleme {
  surum: 1;
  /** Ders kimliği → bitirildiği gün. */
  bitenDersler: Record<string, Gun>;
  /** Soru id'si → tekrar durumu. */
  sorular: Record<string, SoruDurumu>;
  /** Ders bitirilen ya da soru puanlanan günler (tekil). */
  calisilanGunler: Gun[];
  /** Okunan Efsane/Atölye kartları (`efsane:<id>`, `atolye:<id>`). */
  okunanKartlar?: string[];
}

export function bosIlerleme(): Ilerleme {
  return { surum: 1, bitenDersler: {}, sorular: {}, calisilanGunler: [] };
}
