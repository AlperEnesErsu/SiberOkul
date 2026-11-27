// /oturum/ sayfası: Isınma, Tekrar ve Özet adımlarını çizer. Ders ve kart adımları kendi sayfalarında.
import { bugunSec } from '../lib/ilerleme/bugun';
import { ilerlemeOku } from '../lib/ilerleme/depo';
import { seriHesapla } from '../lib/ilerleme/seri';
import { bugunStr } from '../lib/ilerleme/tarih';
import { oturumOku, oturumuAl } from '../lib/oturum';
import { durumHesapla, yaz } from './durum';
import { ADIM_ADI, ADIM_SIMGE, adimAdresi, tahminiSure } from './oturum-ortak';
import { puanlamayiBagla, puanlariCiz } from './puanlama';

const bugun = bugunStr();
const bolumler = ['oturum-yok', 'adim-devam', 'adim-isinma', 'adim-tekrar', 'adim-ozet'] as const;
const goster = (id: (typeof bolumler)[number]) => {
  for (const b of bolumler) document.getElementById(b)!.hidden = b !== id;
};

type TekrarKaydi = [soru: string, cevap: string, ipucu: string, baslik: string, url: string];
let tekrarVerisi: Record<string, TekrarKaydi> | null = null;

/** Tekrar sorusunu şablondan üretir. HTML alanları build'de satirIci ile kaçırılmış metinlerdir. */
function tekrarOgesi(id: string): HTMLElement | null {
  tekrarVerisi ??= JSON.parse(document.getElementById('tekrar-verisi')?.textContent || '{}');
  const kayit = tekrarVerisi![id];
  const sablon = document.getElementById('tekrar-sablon') as HTMLTemplateElement | null;
  if (!kayit || !sablon) return null;
  const [soru, cevap, ipucu, baslik, url] = kayit;
  const li = (sablon.content.firstElementChild as HTMLElement).cloneNode(true) as HTMLElement;
  li.dataset.soruId = id;
  const bag = li.querySelector<HTMLAnchorElement>('.soru-ders')!;
  bag.href = url;
  bag.textContent = baslik;
  li.querySelector('.soru-metni')!.innerHTML = soru;
  li.querySelector('.cevap')!.innerHTML = cevap;
  const ipucuKutusu = li.querySelector('.ipucu');
  if (ipucu && ipucuKutusu) ipucuKutusu.querySelector('p')!.innerHTML = ipucu;
  else ipucuKutusu?.remove();
  return li;
}

function ciz() {
  const oturum = oturumOku(bugun);
  const d = durumHesapla();
  if (!oturum) return goster('oturum-yok');
  const adim = oturum.bitti ? 'ozet' : oturum.adimlar[oturum.konum];

  if (adim === 'ders' || adim === 'kart' || adim === 'sinav') {
    // Bu adımlar kendi sayfalarında. Buraya kendiliğinden YÖNLENDİRMİYORUZ: geri tuşuyla /oturum/'a
    // dönen kullanıcı yeniden ileri atılıp oturumda hapsolmasın. Bunun yerine bir "Devam et" bağlantısı.
    const hedef = adimAdresi(oturum, d.veri.dersler, d.veri.kartlar);
    if (!hedef || hedef.endsWith('/oturum/')) return goster('oturum-yok');
    goster('adim-devam');
    const ad =
      adim === 'ders'
        ? d.veri.dersler.find((x) => x.kimlik === oturum.ders)?.baslik
        : adim === 'kart'
          ? d.veri.kartlar.find((x) => x.kimlik === oturum.kart)?.baslik
          : d.veri.donemler.find((x) => x.no === oturum.sinav)?.ad;
    yaz('#devam-etiket', `Adım ${oturum.konum + 1}/${oturum.adimlar.length} · ${ADIM_SIMGE[adim]} ${ADIM_ADI[adim]}`);
    yaz('#devam-baslik', ad ?? ADIM_ADI[adim]);
    yaz('#devam-alt', adim === 'sinav' ? 'Bölge sınavı seni bekliyor.' : 'Kaldığın yerden devam et.');
    (document.getElementById('devam-bag') as HTMLAnchorElement).href = hedef;
    return;
  }

  if (adim === 'isinma') {
    goster('adim-isinma');
    yaz('#isinma-baslik', d.seri.buHaftaGun > 0 ? 'Tekrar hoş geldin! 👋' : 'Hoş geldin! 👋');
    yaz('#isinma-seri', `🔥 Seri: ${d.seri.seriHafta} hafta · bu hafta ${d.seri.buHaftaGun}/5 gün. Bugün ~${tahminiSure(oturum, d.veri.dersler)} dakika.`);
    const ders = d.veri.dersler.find((x) => x.kimlik === oturum.ders);
    const kart = d.veri.kartlar.find((x) => x.kimlik === oturum.kart);
    const ek: Record<string, string> = {
      tekrar: `${oturum.tekrarlar.length} soru`,
      ders: ders ? `${ders.baslik} (~${ders.sure} dk)` : '',
      kart: kart ? kart.baslik : '',
      sinav: oturum.sinav != null ? `${d.veri.donemler.find((x) => x.no === oturum.sinav)?.ad ?? ''} bölgesinin sınavı (~20 dk)` : '',
      ozet: 'bugünün özeti',
      isinma: 'şu an buradasın',
    };
    document.getElementById('isinma-plan')!.replaceChildren(
      ...oturum.adimlar.map((a) => {
        const li = document.createElement('li');
        li.textContent = `${ADIM_SIMGE[a]} ${ADIM_ADI[a]} — ${ek[a]}`;
        return li;
      }),
    );
  }

  if (adim === 'tekrar') {
    goster('adim-tekrar');
    const liste = document.getElementById('tekrar-listesi')!;
    // Yalnız bugünün tekrar soruları şablondan üretilir (bir kez); sayfa yüzlerce soru taşımaz.
    if (liste.dataset.cizildi !== oturum.tekrarlar.join(',')) {
      liste.replaceChildren(...oturum.tekrarlar.flatMap((id) => tekrarOgesi(id) ?? []));
      liste.dataset.cizildi = oturum.tekrarlar.join(',');
    }
    puanlariCiz(liste, ilerlemeOku(), true);
  }

  if (adim === 'ozet') {
    goster('adim-ozet');
    const i = ilerlemeOku();
    yaz('#ozet-baslik', oturum.bitti ? 'Bugün tamam! 🎉' : 'Bugünkü oturumun özeti');
    yaz('#ozet-soru', String(Object.values(i.sorular).filter((x) => x.sonGun === bugun).length));
    yaz('#ozet-ders', String(Object.values(i.bitenDersler).filter((g) => g === bugun).length));
    yaz('#ozet-seri', `${seriHesapla(i.calisilanGunler, bugun).buHaftaGun}/5`);

    const yarin = bugunSec(d.veri.dersler, i, bugun).ders;
    yaz('#ozet-yarin', yarin ? `Yarın: Ders ${String(yarin.sira).padStart(3, '0')} · ${yarin.baslik}` : 'Yeni ders yarın burada.');
    document.getElementById('ozet-bitti')!.hidden = !oturum.bitti;
  }
}

puanlamayiBagla(document.getElementById('tekrar-listesi')!, () => undefined, true);
document.addEventListener('oturum-adimi-degisti', ciz);
// Oturum yokken (ana sayfa yüklenmeden başlatıldıysa ya da gün döndüyse) buradan da başlatılabilir.
document.getElementById('oturumu-baslat')?.addEventListener('click', () => {
  const d = durumHesapla();
  oturumuAl(d.veri.dersler, d.veri.kartlar, d.ilerleme, bugun, {
    donemler: d.veri.donemler,
    sinavDonemleri: d.veri.sinavDonemleri,
    soruIdleri: d.veri.sinavSoruIdleri,
  });
  // Çerçeve (adım listesi, Sonraki adım) kendi kaydını sayfa açılışında okuduğu için tazele.
  location.reload();
});
// Geri/ileri önbelleğinden dönünce eski durum gösterilmesin.
window.addEventListener('pageshow', (e) => { if (e.persisted) ciz(); });
ciz();
