// İçerik kuralları (şema). Her ders, efsane ve Atölye kaydı build sırasında bu kurallara göre
// denetlenir; bir alan eksik ya da yanlışsa build durur ve hata hangi dosyada ne eksik olduğunu söyler.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const gun = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Tarih YYYY-MM-DD biçiminde olmalı');
const dersKimligi = z.string().regex(/^[a-z]+-\d{3}$/, 'Ders kimliği ör. linux-001 biçiminde olmalı');

const dersler = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dersler' }),
  schema: z
    .object({
      kimlik: dersKimligi,
      baslik: z.string().min(3),
      donem: z.number().int().min(1).max(8),
      sira: z.number().int().min(1),
      sure: z.number().int().min(5).max(180),
      neden: z.string().min(10),
      analoji: z.object({ baslik: z.string(), metin: z.string().min(10) }),
      gorev: z.object({
        aciklama: z.string(),
        komutlar: z.array(z.string()).min(1),
        soru: z.string(),
      }),
      sorular: z
        .array(z.object({ id: z.string(), soru: z.string().min(5), cevap: z.string().min(2) }))
        .min(3, 'Her derste en az 3 soru olmalı'),
      derinDalis: z
        .array(
          z.object({
            tur: z.enum(['kitap', 'lab', 'okuma']),
            baslik: z.string(),
            ayrinti: z.string(),
            url: z.url({ protocol: /^https?$/ }).optional(),
          }),
        )
        .optional(),
    })
    .superRefine((ders, ctx) => {
      ders.sorular.forEach((soru, i) => {
        if (!new RegExp(`^${ders.kimlik}-s\\d+$`).test(soru.id)) {
          ctx.addIssue({
            code: 'custom',
            path: ['sorular', i, 'id'],
            message: `Soru id'si "${ders.kimlik}-s<numara>" biçiminde olmalı (bulunan: ${soru.id})`,
          });
        }
      });
    }),
});

const efsaneler = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/efsaneler' }),
  schema: z.object({
    iddia: z.string().min(5),
    hukum: z.enum(['dogru', 'kismen', 'yanlis']),
    ozet: z.string().min(10),
    analoji: z.string().optional(),
    kaynaklar: z.array(z.object({ ad: z.string(), url: z.url({ protocol: /^https?$/ }) })).min(1, 'Her efsanede en az 1 kaynak olmalı'),
    ilgiliDers: dersKimligi.optional(),
    tarih: gun,
  }),
});

const atolye = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/atolye' }),
  schema: z.object({
    no: z.number().int().min(1),
    baslik: z.string(),
    tarih: gun,
    sorun: z.string(),
    secenekler: z.array(z.object({ ad: z.string(), aciklama: z.string(), secildi: z.boolean() })).min(1),
    neden: z.string(),
    bedel: z.string(),
    yoklamaSorusu: z.object({ soru: z.string(), cevap: z.string() }),
    ilgiliDers: dersKimligi.optional(),
  }),
});

export const collections = { dersler, efsaneler, atolye };
