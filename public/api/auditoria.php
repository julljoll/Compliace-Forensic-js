<?php
/**
 * SHA256.US — API Endpoint: Cadena de Auditoría Inmutable (Consulta y Verificación)
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/auth.php';
require_once __DIR__ . '/lib/canonical.php';

use Sha256\Db\Database;
use Sha256\Auth\Session;
use Sha256\Crypto\Canonical;

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Si se solicita verificación criptográfica completa de la cadena
    if (isset($_GET['verificar']) && $_GET['verificar'] === '1') {
        $stmt = $pdo->query('SELECT seq, caso_id, usuario, accion, detalle, nivel, ts_utc, hash_anterior, hash_actual FROM auditoria ORDER BY seq ASC');
        $rows = $stmt->fetchAll();

        $prevHash = Canonical::GENESIS_HASH;
        $total = count($rows);

        for ($i = 0; $i < $total; $i++) {
            $r = $rows[$i];
            $seqEsperado = $i + 1;

            if ((int)$r['seq'] !== $seqEsperado) {
                http_response_code(409);
                echo json_encode([
                    'valida' => false,
                    'total' => $total,
                    'rotoEn' => (int)$r['seq'],
                    'motivo' => "Secuencia discontinua en registro #{$r['seq']}"
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }

            if ($r['hash_anterior'] !== $prevHash) {
                http_response_code(409);
                echo json_encode([
                    'valida' => false,
                    'total' => $total,
                    'rotoEn' => (int)$r['seq'],
                    'motivo' => "Enlace hash_anterior roto en registro #{$r['seq']}"
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $payload = [
                'accion' => $r['accion'],
                'casoId' => $r['caso_id'],
                'detalle' => $r['detalle'],
                'hashAnterior' => $r['hash_anterior'],
                'nivel' => $r['nivel'],
                'seq' => (int)$r['seq'],
                'ts' => $r['ts_utc'],
                'usuario' => $r['usuario']
            ];
            $esperado = Canonical::hash($payload);

            if ($esperado !== $r['hash_actual']) {
                http_response_code(409);
                echo json_encode([
                    'valida' => false,
                    'total' => $total,
                    'rotoEn' => (int)$r['seq'],
                    'motivo' => "Contenido alterado/adulterado en registro #{$r['seq']}"
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $prevHash = $r['hash_actual'];
        }

        echo json_encode([
            'valida' => true,
            'total' => $total,
            'ultimoHash' => $prevHash
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Listado normal (con filtro opcional de casoId)
    $casoId = $_GET['caso_id'] ?? null;
    if ($casoId) {
        $stmt = $pdo->prepare('SELECT seq, caso_id, usuario, accion, detalle, nivel, ts_utc as ts, hash_anterior as hashAnterior, hash_actual as hashActual FROM auditoria WHERE caso_id = :caso_id ORDER BY seq DESC');
        $stmt->execute(['caso_id' => $casoId]);
    } else {
        $stmt = $pdo->query('SELECT seq, caso_id, usuario, accion, detalle, nivel, ts_utc as ts, hash_anterior as hashAnterior, hash_actual as hashActual FROM auditoria ORDER BY seq DESC LIMIT 200');
    }

    $logs = $stmt->fetchAll();
    echo json_encode(['logs' => $logs], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'POST') {
    $user = Session::getUser();
    $usuarioEmail = $user ? $user['email'] : 'perito@sha256.us';

    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $accion = trim((string)($input['accion'] ?? ''));
    $detalle = trim((string)($input['detalle'] ?? ''));
    $nivel = (string)($input['nivel'] ?? 'info');
    $casoId = $input['casoId'] ?? null;

    if (empty($accion) || empty($detalle)) {
        http_response_code(400);
        echo json_encode(['error' => 'accion y detalle son obligatorios']);
        exit;
    }

    $pdo->beginTransaction();
    try {
        $stmtLast = $pdo->query('SELECT hash_actual, seq FROM auditoria ORDER BY seq DESC LIMIT 1 FOR UPDATE');
        $lastRow = $stmtLast->fetch();
        $hashAnterior = $lastRow ? $lastRow['hash_actual'] : Canonical::GENESIS_HASH;
        $seq = $lastRow ? ((int)$lastRow['seq'] + 1) : 1;
        $ts = date('c');

        $evento = [
            'accion' => $accion,
            'casoId' => $casoId,
            'detalle' => $detalle,
            'hashAnterior' => $hashAnterior,
            'nivel' => $nivel,
            'seq' => $seq,
            'ts' => $ts,
            'usuario' => $usuarioEmail
        ];
        $hashActual = Canonical::hash($evento);

        $stmtIns = $pdo->prepare('INSERT INTO auditoria (seq, caso_id, usuario, accion, detalle, nivel, ts_utc, hash_anterior, hash_actual) VALUES (:seq, :caso_id, :usuario, :accion, :detalle, :nivel, :ts_utc, :hash_anterior, :hash_actual)');
        $stmtIns->execute([
            'seq' => $seq,
            'caso_id' => $casoId,
            'usuario' => $usuarioEmail,
            'accion' => $accion,
            'detalle' => $detalle,
            'nivel' => $nivel,
            'ts_utc' => $ts,
            'hash_anterior' => $hashAnterior,
            'hash_actual' => $hashActual
        ]);

        $pdo->commit();
        echo json_encode([
            'success' => true,
            'seq' => $seq,
            'hashActual' => $hashActual,
            'hashAnterior' => $hashAnterior
        ], JSON_UNESCAPED_UNICODE);
        exit;
    } catch (\Throwable $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Error al registrar evento de auditoría', 'detail' => $e->getMessage()]);
        exit;
    }
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
