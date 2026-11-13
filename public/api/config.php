<?php
/**
 * SHA256.US — Configuración de Base de Datos para cPanel / Apache.
 *
 * En cPanel, puedes definir variables de entorno en el archivo .htaccess
 * o editar directamente las credenciales por defecto aquí.
 */

declare(strict_types=1);

return [
    'db' => [
        'host'     => getenv('DB_HOST') ?: '127.0.0.1',
        'port'     => (int)(getenv('DB_PORT') ?: 3306),
        'database' => getenv('DB_NAME') ?: 'sha256_forensic',
        'username' => getenv('DB_USER') ?: 'root',
        'password' => getenv('DB_PASS') ?: '',
        'charset'  => 'utf8mb4',
    ],
    'session' => [
        'name'     => 'SHA256_SESSID',
        'lifetime' => 86400, // 24 horas
        'secure'   => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
        'httponly' => true,
        'samesite' => 'Lax',
    ],
    'security' => [
        'require_https' => false, // Cambiar a true en producción con SSL
    ]
];
