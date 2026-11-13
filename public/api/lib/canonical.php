<?php
/**
 * SHA256.US — JSON Canónico y Hashing Criptográfico en PHP.
 *
 * Paridad matemática 1:1 con `src/lib/crypto/canonical.ts`:
 * - Claves de objetos ordenadas lexicográficamente por punto de código (strcmp en PHP)
 * - Sin espacios en blanco
 * - Números enteros exclusivamente (rechazo estricto de floats para evitar discrepancias)
 * - Codificación UTF-8 pura
 */

declare(strict_types=1);

namespace Sha256\Crypto;

class Canonical
{
    public const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

    /**
     * Serializa una estructura de datos a su representación JSON canónica.
     *
     * @param mixed $value
     * @return string
     * @throws \InvalidArgumentException si se detectan floats o tipos no serializables.
     */
    public static function stringify(mixed $value): string
    {
        if ($value === null) {
            return 'null';
        }
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }
        if (is_int($value)) {
            return (string)$value;
        }
        if (is_float($value)) {
            throw new \InvalidArgumentException('canonicalJson: no se admiten números flotantes para evitar discrepancias');
        }
        if (is_string($value)) {
            return json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        // Si es un array asociativo u objeto
        if (is_object($value)) {
            $value = (array)$value;
        }

        if (is_array($value)) {
            // Verificar si es array indexado secuencial (0..n-1)
            $isIndexed = array_is_list($value);
            if ($isIndexed) {
                $items = array_map([self::class, 'stringify'], $value);
                return '[' . implode(',', $items) . ']';
            }

            // Es objeto/diccionario asociativo: ordenar claves
            $keys = array_keys($value);
            sort($keys, SORT_STRING);

            $pairs = [];
            foreach ($keys as $k) {
                $val = $value[$k];
                if ($val === null && !array_key_exists($k, $value)) {
                    continue; // omitir indefinidos
                }
                $pairs[] = json_encode((string)$k, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . ':' . self::stringify($val);
            }
            return '{' . implode(',', $pairs) . '}';
        }

        throw new \InvalidArgumentException('canonicalJson: tipo no serializable ' . gettype($value));
    }

    /**
     * Calcula el hash SHA-256 en formato hexadecimal en minúsculas de la versión canónica.
     */
    public static function hash(mixed $value): string
    {
        $canonicalStr = self::stringify($value);
        return hash('sha256', $canonicalStr);
    }
}
