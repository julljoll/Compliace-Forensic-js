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
        'host'     => $_SERVER['DB_HOST'] ?? $_ENV['DB_HOST'] ?? (getenv('DB_HOST') ?: 'localhost'),
        'port'     => (int)($_SERVER['DB_PORT'] ?? $_ENV['DB_PORT'] ?? (getenv('DB_PORT') ?: 3306)),
        'database' => $_SERVER['DB_NAME'] ?? $_ENV['DB_NAME'] ?? (getenv('DB_NAME') ?: 'sirixutr_Forensic_cco'),
        'username' => $_SERVER['DB_USER'] ?? $_ENV['DB_USER'] ?? (getenv('DB_USER') ?: 'sirixutr_julljoll'),
        'password' => $_SERVER['DB_PASS'] ?? $_ENV['DB_PASS'] ?? (getenv('DB_PASS') ?: 'Karupano15*'),
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
