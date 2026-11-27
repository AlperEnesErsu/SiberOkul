// Veriyi <script type="application/json"> içine güvenle gömmek için JSON metni üretir:
// "<" kaçırılır, böylece içerikte "</script>" geçse bile etiket erken kapanmaz.
export function jsonGom(veri: unknown): string {
  return JSON.stringify(veri).replace(/</g, '\\u003c');
}
