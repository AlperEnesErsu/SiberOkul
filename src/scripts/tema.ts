// Tema düğmesi: açık ↔ koyu. Seçim tarayıcıda saklanır; hiç seçim yoksa sistem tercihi geçerli.
const ANAHTAR = 'siberokul.tema';
const kok = document.documentElement;
const dugme = document.getElementById('tema-dugmesi');

const gecerli = (): 'acik' | 'koyu' =>
  (kok.dataset.tema as 'acik' | 'koyu' | undefined) ??
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'koyu' : 'acik');

const etiketle = () => {
  const t = gecerli();
  dugme?.setAttribute('aria-label', t === 'koyu' ? 'Açık temaya geç' : 'Koyu temaya geç');
  const simge = dugme?.querySelector('.tema-simge');
  if (simge) simge.textContent = t === 'koyu' ? '☀️' : '🌙';
};

dugme?.addEventListener('click', () => {
  const yeni = gecerli() === 'koyu' ? 'acik' : 'koyu';
  kok.dataset.tema = yeni;
  try {
    localStorage.setItem(ANAHTAR, yeni);
  } catch {
    /* depolama kapalıysa tema yalnız bu sayfa için değişir */
  }
  etiketle();
});

etiketle();
