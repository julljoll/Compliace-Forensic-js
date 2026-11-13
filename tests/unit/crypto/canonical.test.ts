import { describe, it, expect } from 'vitest';
import { canonicalJson, sha256Hex, hashCanonical } from '../../../src/lib/crypto/canonical';
import vectors from '../../vectors/canonical.json';

describe('canonicalJson & sha256Hex', () => {
  it('satisface los vectores canónicos compartidos', async () => {
    for (const v of vectors) {
      const canonical = canonicalJson(v.input);
      expect(canonical).toBe(v.expectedCanonical);
      const hash = await sha256Hex(canonical);
      expect(hash).toBe(v.expectedSha256);
    }
  });

  it('ordena claves alfabéticamente en todos los niveles anidados', () => {
    const input = { b: { d: 1, c: 2 }, a: [3, { y: true, x: false }] };
    expect(canonicalJson(input)).toBe('{"a":[3,{"x":false,"y":true}],"b":{"c":2,"d":1}}');
  });

  it('omite propiedades con valor undefined', () => {
    const input = { a: 1, b: undefined, c: 'ok' };
    expect(canonicalJson(input)).toBe('{"a":1,"c":"ok"}');
  });

  it('rechaza números de punto flotante para evitar discrepancias de redondeo entre lenguajes', () => {
    expect(() => canonicalJson({ pi: 3.14159 })).toThrow(/no se admiten números flotantes/);
  });
});
