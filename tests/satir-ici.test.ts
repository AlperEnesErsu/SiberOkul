import { expect, test } from 'vitest';
import { satirIci } from '../src/lib/satir-ici';

// Korur: ters tırnak içindeki metnin kod olarak gösterilmesini
test('kod', () => expect(satirIci('`pwd` yaz')).toBe('<code>pwd</code> yaz'));

// Korur: içerikteki HTML'in çalıştırılmayıp metin olarak gösterilmesini (XSS)
test('HTML kaçırılır', () => expect(satirIci('<script>x</script> & "a"')).toBe('&lt;script&gt;x&lt;/script&gt; &amp; &quot;a&quot;'));

// Korur: kod içindeki HTML'in de kaçırılmasını
test('kod içinde HTML', () => expect(satirIci('`<b>`')).toBe('<code>&lt;b&gt;</code>'));

// Korur: eşi olmayan ters tırnağın olduğu gibi kalmasını
test('tek ters tırnak', () => expect(satirIci('a ` b')).toBe('a ` b'));
