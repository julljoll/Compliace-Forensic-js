<?php
/**
 * SHA256.US — Autenticación y Sesiones Forenses Seguras en PHP.
 */

declare(strict_types=1);

namespace Sha256\Auth;

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

    public static function login(string $email, string $password): ?array
    {
        self::start();
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT id, email, password_hash, nombre, apellido, ci, cargo, rol, organismo, despacho, activo FROM usuarios WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => strtolower(trim($email))]);
        $row = $stmt->fetch();

        if (!$row || !(bool)$row['activo']) {
            return null;
        }

        if (!password_verify($password, $row['password_hash'])) {
            return null;
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
