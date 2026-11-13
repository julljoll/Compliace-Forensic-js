<?php
/**
 * SHA256.US — Verificador TOTP (RFC 6238 / RFC 4226) para Google Authenticator
 */

declare(strict_types=1);

namespace Sha256\Auth;

class Totp
{
    /**
     * Decodifica una cadena Base32 estándar (RFC 4648)
     */
    public static function base32Decode(string $b32): string
    {
        $lut = [
            'A' => 0, 'B' => 1, 'C' => 2, 'D' => 3, 'E' => 4, 'F' => 5, 'G' => 6, 'H' => 7,
            'I' => 8, 'J' => 9, 'K' => 10, 'L' => 11, 'M' => 12, 'N' => 13, 'O' => 14, 'P' => 15,
            'Q' => 16, 'R' => 17, 'S' => 18, 'T' => 19, 'U' => 20, 'V' => 21, 'W' => 22, 'X' => 23,
            'Y' => 24, 'Z' => 25, '2' => 26, '3' => 27, '4' => 28, '5' => 29, '6' => 30, '7' => 31,
        ];
        $clean = strtoupper(trim($b32));
        $clean = rtrim($clean, '=');
        $n = 0;
        $j = 0;
        $binary = '';

        for ($i = 0; $i < strlen($clean); $i++) {
            $char = $clean[$i];
            if (!isset($lut[$char])) {
                continue;
            }
            $n = ($n << 5) | $lut[$char];
            $j += 5;
            if ($j >= 8) {
                $j -= 8;
                $binary .= chr(($n >> $j) & 0xFF);
            }
        }
        return $binary;
    }

    /**
     * Calcula el código TOTP de 6 dígitos para un timeSlice dado
     */
    public static function getCode(string $secret, ?int $timeSlice = null): string
    {
        if ($timeSlice === null) {
            $timeSlice = (int)floor(time() / 30);
        }
        $key = self::base32Decode($secret);
        if ($key === '') {
            return '';
        }

        // Empaquetar timestamp de 64 bits en Big-Endian
        $time = pack('N*', 0) . pack('N*', $timeSlice);
        $hm = hash_hmac('sha1', $time, $key, true);
        $offset = ord(substr($hm, -1)) & 0x0F;
        $hashpart = substr($hm, $offset, 4);
        $value = unpack('N', $hashpart);
        $value = $value[1] & 0x7FFFFFFF;

        return str_pad((string)($value % 1000000), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Valida si un código de 6 dígitos coincide dentro de una ventana de tolerancia
     *
     * @param string $secret Clave secreta en Base32
     * @param string $code Código de 6 dígitos ingresado por el usuario
     * @param int $window Ventana de tiempo (1 = +- 30 segundos)
     */
    public static function verify(string $secret, string $code, int $window = 1): bool
    {
        $code = trim($code);
        if (strlen($code) !== 6 || !ctype_digit($code)) {
            return false;
        }

        $currentTimeSlice = (int)floor(time() / 30);
        for ($offset = -$window; $offset <= $window; $offset++) {
            $calc = self::getCode($secret, $currentTimeSlice + $offset);
            if (hash_equals($calc, $code)) {
                return true;
            }
        }
        return false;
    }
}
