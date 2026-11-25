// /oturum/ sayfası: Isınma, Tekrar ve Özet adımlarını çizer. Ders ve kart adımları kendi sayfalarında.
import { bugunSec } from '../lib/ilerleme/bugun';
import { ilerlemeOku } from '../lib/ilerleme/depo';
import { seriHesapla } from '../lib/ilerleme/seri';
import { bugunStr } from '../lib/ilerleme/tarih';
import { oturumOku } from '../lib/oturum';
import { durumHesapla, yaz } from './durum';
import { ADIM_ADI, ADIM_SIMGE, adimAdresi, tahminiSure } from './oturum-ortak';
import { puanlamayiBagla, puanlariCiz } from './puanlama';

const bugun = bugunStr();
const bolumler = ['oturum-yok', 'adim-isinma', 'adim-tekrar', 'adim-ozet'] as const;
const goster = (id: (typeof bolumler)[number]) => {
  for (const b of bolumler) document.getElementById(b)!.hidden = b !== id;
};

function ciz() {
  const oturum = oturumOku(bugun);
  const d = durumHesapla();
  if (!oturum) return goster('oturum-yok');
  const adim = oturum.bitti ? 'ozet' : oturum.adimlar[oturum.konum];

  if (adim === 'ders' || adim === 'kart' || adim === 'sinav') {
    // Bu adımlar kendi sayfalarında; doğrudan /oturum/ açıldıysa oraya yönlendir.
    // Sayfası yoksa kendine yönlenip döngüye girme; oturumu geçersiz say.
    const hedef = adimAdresi(oturum, d.veri.dersler, d.veri.kartlar);
    if (!hedef || hedef.endsWith('/oturum/')) return goster('oturum-yok');
    location.replace(hedef);
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
    const istenen = new Set(oturum.tekrarlar);
    for (const li of liste.querySelectorAll<HTMLElement>('[data-soru-id]')) li.hidden = !istenen.has(li.dataset.soruId!);
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
// Geri/ileri önbelleğinden dönünce eski durum gösterilmesin.
window.addEventListener('pageshow', (e) => { if (e.persisted) ciz(); });
ciz();
