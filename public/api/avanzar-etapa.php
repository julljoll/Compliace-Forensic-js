<?php
/**
 * SHA256.US — API Endpoint: Avance y Sellado Criptográfico de Fases ISO
 *
 * Transacción atómica que valida:
 * 1. La fase anterior debe estar en estado 'COMPLETADA' y su hash debe verificarse.
 * 2. Todos los controles ISO obligatorios aplicables a la tipología del caso deben estar cumplidos.
 * 3. Calcula el nuevo hash canónico SHA-256 de la fase y lo encadena inmutablemente.
 * 4. Actualiza la siguiente fase a 'DISPONIBLE'.
 * 5. Registra el evento en la tabla `auditoria` (hash chain SHA-256).
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/auth.php';
require_once __DIR__ . '/lib/canonical.php';

use Sha256\Db\Database;
use Sha256\Auth\Session;
use Sha256\Crypto\Canonical;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$user = Session::getUser();
$usuarioEmail = $user ? $user['email'] : 'perito@sha256.us';

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$casoId = (string)($input['casoId'] ?? '');
$faseObjetivo = (string)($input['fase'] ?? '');
$controlesEnviados = $input['controles'] ?? [];

$fasesOrden = ['F0', 'F1', 'F2', 'F3', 'F4', 'F5'];
$faseIdx = array_search($faseObjetivo, $fasesOrden, true);

if ($faseIdx === false) {
    http_response_code(400);
    echo json_encode(['error' => "Fase inválida: {$faseObjetivo}. Debe ser F0..F5"]);
    exit;
}

$pdo = Database::getConnection();
$pdo->beginTransaction();

try {
    // 1. Bloquear el caso para evitar condiciones de carrera
    $stmtCaso = $pdo->prepare('SELECT id, numero_caso, tipo_proyecto, fase_actual, version, datos_json FROM casos WHERE id = :id FOR UPDATE');
    $stmtCaso->execute(['id' => $casoId]);
    $casoRow = $stmtCaso->fetch();

    if (!$casoRow) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(['error' => 'Expediente no encontrado']);
        exit;
    }

    $casoData = json_decode($casoRow['datos_json'], true) ?: [];

    // 2. Si no es F0, comprobar que la fase anterior esté COMPLETADA y verificar su hash
    $hashAnteriorFase = Canonical::GENESIS_HASH;
    if ($faseIdx > 0) {
        $faseAnteriorId = $fasesOrden[$faseIdx - 1];
        $stmtPrev = $pdo->prepare('SELECT estado, hash_fase FROM fases_caso WHERE caso_id = :caso_id AND fase = :fase LIMIT 1');
        $stmtPrev->execute(['caso_id' => $casoId, 'fase' => $faseAnteriorId]);
        $prevRow = $stmtPrev->fetch();

        if (!$prevRow || $prevRow['estado'] !== 'COMPLETADA' || empty($prevRow['hash_fase'])) {
            $pdo->rollBack();
            http_response_code(409);
            echo json_encode([
                'error' => "GATING ISO RECHAZADO: La fase anterior ({$faseAnteriorId}) no está COMPLETADA o carece de sello hash",
                'faseBloqueada' => $faseObjetivo,
                'faseAnteriorRequerida' => $faseAnteriorId
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $hashAnteriorFase = $prevRow['hash_fase'];
    }

    // 3. Cargar catálogo ISO para verificar controles obligatorios
    $catalogoPath = __DIR__ . '/../../src/data/fases-iso.json';
    if (!file_exists($catalogoPath)) {
        $catalogoPath = __DIR__ . '/../src/data/fases-iso.json';
    }
    $catalogo = json_decode(file_get_contents($catalogoPath), true);
    $faseDef = null;
    foreach ($catalogo['fases'] as $f) {
        if ($f['id'] === $faseObjetivo) {
            $faseDef = $f;
            break;
        }
    }

    if (!$faseDef) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Definición de fase no encontrada en el catálogo ISO']);
        exit;
    }

    $tipoProyecto = $casoRow['tipo_proyecto'];
    $faltantes = [];

    foreach ($faseDef['controles'] as $ctrl) {
        if (isset($ctrl['requerido']) && $ctrl['requerido'] === false) {
            continue; // Opcional
        }
        // Filtrar por tipología si aplica
        if (!empty($ctrl['tipologias']) && !in_array($tipoProyecto, $ctrl['tipologias'], true)) {
            continue;
        }

        $ctrlId = $ctrl['id'];
        $marcado = isset($controlesEnviados[$ctrlId]) && $controlesEnviados[$ctrlId]['ok'] === true;

        if (!$marcado) {
            $faltantes[] = [
                'controlId' => $ctrlId,
                'texto' => $ctrl['texto'],
                'motivo' => 'Control no marcado por el perito'
            ];
            continue;
        }

        // Si el control exige campos específicos del caso
        if (!empty($ctrl['campos'])) {
            foreach ($ctrl['campos'] as $req) {
                $campo = $req['campo'];
                $regla = $req['regla'];
                $val = $casoData[$campo] ?? null;

                if ($regla === 'verdadero' && $val !== true) {
                    $faltantes[] = ['controlId' => $ctrlId, 'motivo' => "El campo {$campo} debe ser verdadero"];
                } elseif ($regla === 'sha256' && (!is_string($val) || !preg_match('/^[a-f0-9]{64}$/i', trim($val)))) {
                    $faltantes[] = ['controlId' => $ctrlId, 'motivo' => "El campo {$campo} debe ser un hash SHA-256 de 64 caracteres"];
                } elseif ($regla === 'requerido' && (empty($val) || (is_string($val) && trim($val) === ''))) {
                    $faltantes[] = ['controlId' => $ctrlId, 'motivo' => "El campo {$campo} no puede estar vacío"];
                }
            }
        }
    }

    if (!empty($faltantes)) {
        $pdo->rollBack();
        http_response_code(422);
        echo json_encode([
            'error' => "GATING ISO RECHAZADO: Faltan controles obligatorios para cerrar la fase {$faseObjetivo}",
            'faltantes' => $faltantes
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 4. Calcular el Sello Canónico SHA-256 de la Fase
    $ahora = date('c');
    $controlesNormalizados = [];
    foreach ($controlesEnviados as $k => $c) {
        $controlesNormalizados[$k] = [
            'ok' => (bool)($c['ok'] ?? false),
            'por' => (string)($c['por'] ?? $usuarioEmail),
            'ts' => (string)($c['ts'] ?? $ahora)
        ];
    }

    $payloadSello = [
        'casoId' => $casoId,
        'completadaEn' => $ahora,
        'completadaPor' => $usuarioEmail,
        'controles' => $controlesNormalizados,
        'fase' => $faseObjetivo,
        'hashAnterior' => $hashAnteriorFase
    ];
    $nuevoHashFase = Canonical::hash($payloadSello);

    // 5. Actualizar la fase actual a COMPLETADA con su hash
    $stmtUpFase = $pdo->prepare('UPDATE fases_caso SET estado = "COMPLETADA", controles_json = :controles_json, hash_anterior = :hash_anterior, hash_fase = :hash_fase, completada_por = :completada_por, completada_en = :completada_en, sellada = 1 WHERE caso_id = :caso_id AND fase = :fase');
    $stmtUpFase->execute([
        'caso_id' => $casoId,
        'fase' => $faseObjetivo,
        'controles_json' => json_encode($controlesNormalizados, JSON_UNESCAPED_UNICODE),
        'hash_anterior' => $hashAnteriorFase,
        'hash_fase' => $nuevoHashFase,
        'completada_por' => $usuarioEmail,
        'completada_en' => $ahora
    ]);

    // 6. Desbloquear la siguiente fase si existe
    $siguienteFaseId = ($faseIdx < count($fasesOrden) - 1) ? $fasesOrden[$faseIdx + 1] : null;
    if ($siguienteFaseId) {
        $stmtNext = $pdo->prepare('UPDATE fases_caso SET estado = "DISPONIBLE" WHERE caso_id = :caso_id AND fase = :fase AND estado = "BLOQUEADA"');
        $stmtNext->execute(['caso_id' => $casoId, 'fase' => $siguienteFaseId]);
    }

    // 7. Actualizar el caso (fase_actual y versión)
    $nuevaFaseActual = $siguienteFaseId ?: $faseObjetivo;
    $nuevoEstadoCaso = ($faseObjetivo === 'F5') ? 'cerrado' : $casoRow['estado'];
    $nuevaVersion = (int)$casoRow['version'] + 1;

    $stmtUpCaso = $pdo->prepare('UPDATE casos SET fase_actual = :fase_actual, estado = :estado, version = :version WHERE id = :id');
    $stmtUpCaso->execute([
        'id' => $casoId,
        'fase_actual' => $nuevaFaseActual,
        'estado' => $nuevoEstadoCaso,
        'version' => $nuevaVersion
    ]);

    // 8. Escribir evento inmutable en la tabla `auditoria`
    $stmtLastAudit = $pdo->query('SELECT hash_actual, seq FROM auditoria ORDER BY seq DESC LIMIT 1');
    $lastAuditRow = $stmtLastAudit->fetch();
    $hashAuditAnterior = $lastAuditRow ? $lastAuditRow['hash_actual'] : Canonical::GENESIS_HASH;
    $seqAudit = $lastAuditRow ? ((int)$lastAuditRow['seq'] + 1) : 1;

    $eventoAudit = [
        'accion' => "SELLADO_FASE_{$faseObjetivo}",
        'casoId' => $casoId,
        'detalle' => "Fase {$faseObjetivo} sellada criptográficamente con hash {$nuevoHashFase} por {$usuarioEmail}",
        'hashAnterior' => $hashAuditAnterior,
        'nivel' => 'success',
        'seq' => $seqAudit,
        'ts' => $ahora,
        'usuario' => $usuarioEmail
    ];
    $hashAuditActual = Canonical::hash($eventoAudit);

    $stmtInsAudit = $pdo->prepare('INSERT INTO auditoria (seq, caso_id, usuario, accion, detalle, nivel, ts_utc, hash_anterior, hash_actual) VALUES (:seq, :caso_id, :usuario, :accion, :detalle, :nivel, :ts_utc, :hash_anterior, :hash_actual)');
    $stmtInsAudit->execute([
        'seq' => $seqAudit,
        'caso_id' => $casoId,
        'usuario' => $usuarioEmail,
        'accion' => "SELLADO_FASE_{$faseObjetivo}",
        'detalle' => "Fase {$faseObjetivo} sellada criptográficamente con hash {$nuevoHashFase} por {$usuarioEmail}",
        'nivel' => 'success',
        'ts_utc' => $ahora,
        'hash_anterior' => $hashAuditAnterior,
        'hash_actual' => $hashAuditActual
    ]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'faseSellada' => $faseObjetivo,
        'hash' => $nuevoHashFase,
        'hashAnterior' => $hashAnteriorFase,
        'siguienteFase' => $siguienteFaseId,
        'version' => $nuevaVersion
    ], JSON_UNESCAPED_UNICODE);
    exit;

} catch (\Throwable $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error al avanzar etapa', 'detail' => $e->getMessage()]);
    exit;
}
