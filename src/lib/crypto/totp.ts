/**
 * SHA256.US — Módulo de Verificación TOTP (RFC 6238) para Google Authenticator
 * Compatible con navegadores web (Web Crypto API) y Node.js (crypto global).
 */

function base32Decode(b32: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = b32.toUpperCase().replace(/=+$/, '').trim();
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const val = alphabet.indexOf(clean[i]);
    if (val === -1) continue;
    value = (value << 5) | val;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return new Uint8Array(output);
}

export async function generarTotpCode(secretBase32: string, timeStepSeconds: number = 30): Promise<string> {
  const counter = Math.floor(Date.now() / 1000 / timeStepSeconds);
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setBigUint64(0, BigInt(counter), false); // Big-Endian

  const keyBytes = base32Decode(secretBase32);

  // Importar clave HMAC-SHA1 en Web Crypto
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : globalThis.crypto;
  const key = await cryptoObj.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const signature = await cryptoObj.subtle.sign('HMAC', key, buffer);
  const hmac = new Uint8Array(signature);

  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

export async function verificarTotpCode(secretBase32: string, codigoUsuario: string, windowSteps: number = 1): Promise<boolean> {
  const code = (codigoUsuario || '').trim();
  if (code.length !== 6 || !/^\d{6}$/.test(code)) {
    return false;
  }

  const currentCounter = Math.floor(Date.now() / 1000 / 30);
  const keyBytes = base32Decode(secretBase32);
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : globalThis.crypto;

  const key = await cryptoObj.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  for (let offset = -windowSteps; offset <= windowSteps; offset++) {
    const counter = currentCounter + offset;
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setBigUint64(0, BigInt(counter), false);

    const signature = await cryptoObj.subtle.sign('HMAC', key, buffer);
    const hmac = new Uint8Array(signature);

    const off = hmac[hmac.length - 1] & 0x0f;
    const binary =
      ((hmac[off] & 0x7f) << 24) |
      ((hmac[off + 1] & 0xff) << 16) |
      ((hmac[off + 2] & 0xff) << 8) |
      (hmac[off + 3] & 0xff);

    const calc = (binary % 1000000).toString().padStart(6, '0');
    if (calc === code) {
      return true;
    }
  }

  return false;
}
