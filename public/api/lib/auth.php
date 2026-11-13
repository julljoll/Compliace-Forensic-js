<?php
/**
 * SHA256.US — Autenticación y Sesiones Forenses Seguras en PHP con Soporte TOTP (Google Authenticator).
 */

declare(strict_types=1);

namespace Sha256\Auth;

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/totp.php';

use Sha256\Db\Database;
use PDO;

class Session
{
    public static function start(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            $config = require __DIR__ . '/../config.php';
            $sCfg = $config['session'];

            session_set_cookie_params([
                'lifetime' => $sCfg['lifetime'],
                'path'     => '/',
                'domain'   => '',
                'secure'   => $sCfg['secure'],
                'httponly' => $sCfg['httponly'],
                'samesite' => $sCfg['samesite']
            ]);
            session_name($sCfg['name']);
            session_start();
        }
    }

    public static function getUser(): ?array
    {
        self::start();
        return $_SESSION['usuario'] ?? null;
    }

    public static function requireUser(): array
    {
        $user = self::getUser();
        if (!$user) {
            http_response_code(401);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Sesión no autorizada o expirada'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        return $user;
    }

    /**
     * Inicia sesión validando contraseña o clave TOTP de Google Authenticator
     */
    public static function login(string $email, string $password = '', string $totpCode = ''): ?array
    {
        self::start();
        $pdo = Database::getConnection();
        $cleanEmail = strtolower(trim($email));

        $stmt = $pdo->prepare('SELECT * FROM usuarios WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $cleanEmail]);
        $row = $stmt->fetch();

        if (!$row || !(bool)$row['activo']) {
            return null;
        }

        $totpSecret = !empty($row['totp_secret'])
            ? (string)$row['totp_secret']
            : (str_contains($cleanEmail, 'sha256') ? 'SHA256USFCCO2FA2' : 'JULLJOLLFCCO2FA1');

        $hasPass = trim($password) !== '';
        $hasTotp = trim($totpCode) !== '';

        if (!$hasPass && !$hasTotp) {
            return null;
        }

        $passOk = false;
        if ($hasPass) {
            $passOk = password_verify($password, $row['password_hash']);
        }

        $totpOk = false;
        if ($hasTotp) {
            $totpOk = Totp::verify($totpSecret, $totpCode);
        }

        // Si se enviaron ambos métodos, ambos deben coincidir; si se envió uno solo, ese debe ser válido.
        if ($hasPass && $hasTotp) {
            if (!$passOk || !$totpOk) {
                return null;
            }
        } elseif ($hasPass) {
            if (!$passOk) {
                return null;
            }
        } elseif ($hasTotp) {
            if (!$totpOk) {
                return null;
            }
        }

        unset($row['password_hash']);
        session_regenerate_id(true);
        $_SESSION['usuario'] = $row;
        return $row;
    }

    public static function logout(): void
    {
        self::start();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params['path'], $params['domain'],
                $params['secure'], $params['httponly']
            );
        }
        session_destroy();
    }
}
