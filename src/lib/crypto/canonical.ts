/**
 * SHA256.US — JSON canónico + SHA-256 (WebCrypto).
 *
 * El JSON canónico es IDÉNTICO al de `public/api/lib/canonical.php`:
 *   - claves de objeto ordenadas por punto de código (orden binario UTF-16 == strcmp en PHP para BMP)
 *   - sin espacios
 *   - solo string | entero | boolean | null | array | objeto (los flotantes se rechazan)
 * Vectores compartidos: tests/vectors/canonical.json (verificados en Vitest y PHP CLI).
 */

export type Canonicalizable =
  | string
  | number
  | boolean
  | null
  | Canonicalizable[]
  | { [k: string]: Canonicalizable | undefined };

export function canonicalJson(value: Canonicalizable): string {
  if (value === null) return 'null';
  if (typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'number') {
    if (!Number.isInteger(value)) throw new TypeError('canonicalJson: no se admiten números flotantes');
    return String(value);
  }
  if (Array.isArray(value)) return `[${value.map((v) => canonicalJson(v)).join(',')}]`;
  const keys = Object.keys(value)
    .filter((k) => value[k] !== undefined)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k] as Canonicalizable)}`).join(',')}}`;
}

export async function sha256Hex(data: string): Promise<string> {
  const buf = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

export const SHA256_RE = /^[a-f0-9]{64}$/;
export const GENESIS_HASH = '0'.repeat(64);

export const hashCanonical = (value: Canonicalizable) => sha256Hex(canonicalJson(value));
