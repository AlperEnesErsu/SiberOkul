// SiberOkul'u build edip portföy sitesine (AlperEnesErsu.net) kopyalar; orada /siberokul/ adresinde
// sunulur. Burada hiçbir şey yayına çıkmaz: kopya portföyün çalışma ağacına düşer ve ancak portföyün
// incelenmiş bir PR'ıyla yayına girer. (Fuse & Fall'daki `npm run portfolio` ile aynı yöntem.)
//
//   npm run portfolio                          # portföy bu klasörün yanında
//   PORTFOLIO_DIR=yol/portfoy npm run portfolio
import { execSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE = 'https://alperenesersu.netlify.app';
const KLASOR = 'siberokul';

const portfoy = resolve(process.env.PORTFOLIO_DIR ?? '../AlperEnesErsu.net');
if (!existsSync(resolve(portfoy, 'next.config.ts')) || !existsSync(resolve(portfoy, 'public'))) {
  console.error(`Portföy sitesi bulunamadı: ${portfoy}. PORTFOLIO_DIR ile yolunu ver.`);
  process.exit(1);
}

execSync('npm run build', {
  stdio: 'inherit',
  env: { ...process.env, SITE_URL: SITE, SITE_BASE: `/${KLASOR}` },
});

const hedef = resolve(portfoy, 'public', KLASOR);
// Klasör yalnız SiberOkul'un: bütünüyle değiştirilir, eski paketler birikmez.
rmSync(hedef, { recursive: true, force: true });
cpSync('dist', hedef, { recursive: true });
console.log(`${readdirSync(hedef).length} öğe kopyalandı: ${hedef}`);
console.log(`Portföy PR'ı birleşince ${SITE}/${KLASOR}/ adresinde açılır.`);
