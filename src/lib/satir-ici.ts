// Frontmatter metinlerindeki `ters tırnaklı` parçaları <code> olarak gösterir.
// Önce bütün HTML kaçırılır; böylece içerikteki etiketler asla çalıştırılmaz.
const KACIR: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function satirIci(metin: string): string {
  const guvenli = metin.replace(/[&<>"']/g, (c) => KACIR[c]);
  return guvenli.replace(/`([^`]+)`/g, '<code>$1</code>');
}
