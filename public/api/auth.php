<?php
/**
 * SHA256.US — API Endpoint: Autenticación de Usuario (Login / Logout / Status)
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/auth.php';

use Sha256\Auth\Session;

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $user = Session::getUser();
    echo json_encode([
        'authenticated' => $user !== null,
        'user' => $user
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $action = $input['action'] ?? 'login';

    if ($action === 'logout') {
        Session::logout();
        echo json_encode(['success' => true, 'message' => 'Sesión cerrada exitosamente']);
        exit;
    }

    $email = (string)($input['email'] ?? '');
    $password = (string)($input['password'] ?? '');
    $totpCode = (string)($input['totp_code'] ?? $input['totpCode'] ?? '');

    if (empty($email) || (empty($password) && empty($totpCode))) {
        http_response_code(400);
        echo json_encode(['error' => 'Se requiere correo electrónico y contraseña o código Google Authenticator']);
        exit;
    }

    $user = Session::login($email, $password, $totpCode);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales inválidas, código 2FA erróneo o usuario inactivo']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'user' => $user
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
