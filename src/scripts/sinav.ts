// Bölge sınavı sayfası: cevapları topla, puanla, doğru/yanlışı ve açıklamaları göster, sonucu kaydet.
import { ilerlemeOku } from '../lib/ilerleme/depo';
import { bugunStr } from '../lib/ilerleme/tarih';
import { GECME_YUZDESI, sinavKaydet, sinavSonucu, sinavYanlislariniKaydet } from '../lib/sinav';
import { kaydetVeBildir } from './puanlama';

const makale = document.querySelector<HTMLElement>('article[data-sinav]');

if (makale) {
  const donem = Number(makale.dataset.sinav);
  const slug = makale.dataset.slug!;
  const anahtar: number[] = JSON.parse(makale.dataset.anahtar ?? '[]');
  const bitir = document.getElementById('sinavi-bitir') as HTMLButtonElement;
  const yeniden = document.getElementById('yeniden') as HTMLButtonElement;
  const durum = document.getElementById('sinav-durum')!;
  const sorular = [...makale.querySelectorAll<HTMLElement>('.soru')];

  const gecmisiYaz = () => {
    const k = ilerlemeOku().sinavlar?.[String(donem)];
    if (k) {
      document.getElementById('sinav-gecmis')!.textContent =
        `En iyi sonucun: %${k.enIyi}${k.enIyi >= GECME_YUZDESI ? ' · geçtin ✓' : ''}. İstediğin kadar tekrar deneyebilirsin.`;
    }
  };

  const cevaplar = (): (number | null)[] =>
    sorular.map((li) => {
      const secili = li.querySelector<HTMLInputElement>('input:checked');
      return secili ? Number(secili.value) : null;
    });

  bitir.addEventListener('click', () => {
    const c = cevaplar();
    const bos = c.filter((x) => x === null).length;
    if (bos > 0 && durum.dataset.uyarildi !== '1') {
      durum.textContent = `${bos} soru boş. Yine de bitirmek için tekrar bas.`;
      durum.dataset.uyarildi = '1';
      return;
    }
    const sonuc = sinavSonucu(anahtar.map((dogru) => ({ dogru })), c);
    sorular.forEach((li, i) => {
      const dogruMu = c[i] === anahtar[i];
      li.classList.add(dogruMu ? 'dogru' : 'yanlis');
      li.querySelector('.sonuc')!.textContent = dogruMu ? '✓ Doğru.' : '✗ Yanlış.';
      li.querySelector<HTMLElement>('.aciklama')!.hidden = false;
      li.querySelectorAll<HTMLLabelElement>('.secenek')[anahtar[i]]?.classList.add('dogru-secenek');
      li.querySelectorAll<HTMLInputElement>('input').forEach((x) => (x.disabled = true));
    });
    const bugun = bugunStr();
    const dogruMu = anahtar.map((dogru, i) => c[i] === dogru);
    // Yanlışlar aralıklı tekrara girer; sonraki günlerde oturumun tekrar adımında gelir.
    const kaydedildi = kaydetVeBildir(sinavYanlislariniKaydet(sinavKaydet(ilerlemeOku(), donem, sonuc.yuzde, bugun), slug, dogruMu, bugun));
    const kutu = document.getElementById('sonuc-kutu')!;
    kutu.hidden = false;
    document.getElementById('sonuc-yuzde')!.textContent = `%${sonuc.yuzde}`;
    document.getElementById('sonuc-metin')!.textContent =
      `${sonuc.toplam} sorudan ${sonuc.dogru} doğru. ` +
      (sonuc.gecti ? 'Geçtin! Sonraki bölge açıldı. 🎉' : `Geçmek için %${GECME_YUZDESI} gerekiyor. Açıklamaları oku, sonra yeniden dene.`) +
      (sonuc.dogru < sonuc.toplam ? ' Yanlış yaptığın sorular sonraki günlerde tekrar olarak karşına çıkacak.' : '') +
      (kaydedildi ? '' : ' (Sonuç kaydedilemedi: tarayıcı depolaması kapalı olabilir.)');
    bitir.hidden = true;
    yeniden.hidden = false;
    durum.textContent = '';
    gecmisiYaz();
    kutu.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  yeniden.addEventListener('click', () => {
    sorular.forEach((li) => {
      li.classList.remove('dogru', 'yanlis');
      li.querySelector<HTMLElement>('.aciklama')!.hidden = true;
      li.querySelectorAll('.dogru-secenek').forEach((x) => x.classList.remove('dogru-secenek'));
      li.querySelectorAll<HTMLInputElement>('input').forEach((x) => {
        x.disabled = false;
        x.checked = false;
      });
    });
    document.getElementById('sonuc-kutu')!.hidden = true;
    bitir.hidden = false;
    yeniden.hidden = true;
    delete durum.dataset.uyarildi;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  gecmisiYaz();
}
