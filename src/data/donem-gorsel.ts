// Her dönemin simgesi ve rengi. Renk yalnız zemin, kenar ve simge vurgusunda kullanılır; metin rengi
// olarak kullanılmaz (iki temada da kontrastı garanti etmek için).
export const DONEM_GORSEL: Record<number, { simge: string; renk: string; bolge: string }> = {
  1: { simge: '🐧', renk: '#f08c00', bolge: 'Linux Ormanı' },
  2: { simge: '🌐', renk: '#1c7ed6', bolge: 'Ağ Limanı' },
  3: { simge: '🛡️', renk: '#7048e8', bolge: 'Temeller Kalesi' },
  4: { simge: '⚙️', renk: '#0ca678', bolge: 'DevOps Atölyesi' },
  5: { simge: '🧩', renk: '#e64980', bolge: 'Uygulama Şehri' },
  6: { simge: '🏭', renk: '#f59f00', bolge: 'Pipeline Fabrikası' },
  7: { simge: '📦', renk: '#3bc9db', bolge: 'Container Limanı' },
  8: { simge: '☁️', renk: '#748ffc', bolge: 'Bulut Gözlemevi' },
};
