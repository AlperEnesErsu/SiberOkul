// İlerleme sayfası: takvim, seri özeti, yedek al / geri yükle.
import { ilerlemeOku, ilerlemeYaz } from '../lib/ilerleme/depo';
import type { Ilerleme } from '../lib/ilerleme/model';
import { HAFTALIK_HEDEF, seriHesapla } from '../lib/ilerleme/seri';
import { bugunStr, gunEkle, haftaBasi } from '../lib/ilerleme/tarih';
import { YedekHatasi, yedekKodunuCoz, yedekKoduOlustur } from '../lib/ilerleme/yedek';

const HAFTA = 26;
const bugun = bugunStr();
let ilerleme = ilerlemeOku();

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const durum = $('yedek-durum');

function takvimiCiz() {
  const calisilan = new Set(ilerleme.calisilanGunler);
  const baslangic = gunEkle(haftaBasi(bugun), -7 * (HAFTA - 1));
  const kareler: HTMLElement[] = [];
  for (let i = 0; i < HAFTA * 7; i++) {
    const g = gunEkle(baslangic, i);
    const kare = document.createElement('span');
    kare.className = 'kare';
    if (calisilan.has(g)) kare.classList.add('dolu');
    if (g === bugun) kare.classList.add('bugun');
    if (g > bugun) kare.classList.add('gelecek');
    kare.title = g;
    kareler.push(kare);
  }
  $('takvim').replaceChildren(...kareler);

  const s = seriHesapla(ilerleme.calisilanGunler, bugun);
  const dersSayisi = Object.keys(ilerleme.bitenDersler).length;
  $('seri-ozet').textContent =
    `🔥 Seri: ${s.seriHafta} hafta · bu hafta ${s.buHaftaGun}/${HAFTALIK_HEDEF} gün · ` +
    `${dersSayisi} ders bitti · toplam ${ilerleme.calisilanGunler.length} çalışma günü`;
}

$('kopyala').addEventListener('click', async () => {
  const kod = yedekKoduOlustur(ilerleme);
  const alan = $<HTMLTextAreaElement>('yedek-kodu');
  alan.value = kod;
  try {
    await navigator.clipboard.writeText(kod);
    durum.textContent = 'Yedek kodu panoya kopyalandı.';
  } catch {
    alan.select();
    durum.textContent = 'Kod aşağıdaki kutuda; elle kopyalayabilirsin.';
  }
});

$('indir').addEventListener('click', () => {
  const blob = new Blob([yedekKoduOlustur(ilerleme) + '\n'], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `siberokul-yedek-${bugun}.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  durum.textContent = 'Yedek dosyası indirildi.';
});

let bekleyen: Ilerleme | null = null;

$('geri-yukle').addEventListener('click', () => {
  try {
    bekleyen = yedekKodunuCoz($<HTMLTextAreaElement>('yedek-kodu').value);
  } catch (e) {
    bekleyen = null;
    $('onay').hidden = true;
    durum.textContent =
      e instanceof YedekHatasi ? `Bu kod okunamadı, mevcut ilerlemen değişmedi. (${e.message})` : 'Beklenmeyen hata.';
    return;
  }
  const ders = Object.keys(bekleyen.bitenDersler).length;
  const soru = Object.keys(bekleyen.sorular).length;
  $('onay-metni').textContent = `Mevcut ilerlemenin yerine geçecek: ${ders} ders, ${soru} soru. Onaylıyor musun?`;
  $('onay').hidden = false;
  durum.textContent = '';
});

$('vazgec').addEventListener('click', () => {
  bekleyen = null;
  $('onay').hidden = true;
  durum.textContent = 'Geri yükleme iptal edildi.';
});

$('onayla').addEventListener('click', () => {
  if (!bekleyen) return;
  if (ilerlemeYaz(bekleyen)) {
    ilerleme = bekleyen;
    durum.textContent = 'İlerleme geri yüklendi.';
    takvimiCiz();
  } else {
    durum.textContent = 'Kaydedilemedi: tarayıcı depolaması kapalı olabilir.';
  }
  bekleyen = null;
  $('onay').hidden = true;
});

takvimiCiz();
