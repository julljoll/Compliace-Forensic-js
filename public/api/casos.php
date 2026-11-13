<?php
/**
 * SHA256.US — API Endpoint: Gestión de Expedientes Forenses (Casos)
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
$user = Session::getUser();
$method = $_SERVER['REQUEST_METHOD'];

// GET: Listar o consultar caso
if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare('SELECT * FROM casos WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            http_response_code(404);
            echo json_encode(['error' => 'Expediente no encontrado']);
            exit;
        }

        // Obtener fases ISO del caso
        $stmtFases = $pdo->prepare('SELECT fase, estado, controles_json, hash_anterior, hash_fase, completada_por, completada_en, sellada FROM fases_caso WHERE caso_id = :caso_id ORDER BY id ASC');
        $stmtFases->execute(['caso_id' => $id]);
        $fasesRows = $stmtFases->fetchAll();

        $fasesIso = [];
        foreach ($fasesRows as $f) {
            $fasesIso[$f['fase']] = [
                'estado' => $f['estado'],
                'controles' => json_decode($f['controles_json'], true) ?: [],
                'hashAnterior' => $f['hash_anterior'],
                'hash' => $f['hash_fase'],
                'completadaPor' => $f['completada_por'],
                'completadaEn' => $f['completada_en'],
                'sellada' => (bool)$f['sellada']
            ];
        }

        $casoData = json_decode($row['datos_json'], true) ?: [];
        $casoData['id'] = $row['id'];
        $casoData['numeroCaso'] = $row['numero_caso'];
        $casoData['tipoProyecto'] = $row['tipo_proyecto'];
        $casoData['titulo'] = $row['titulo'];
        $casoData['descripcion'] = $row['descripcion'];
        $casoData['estado'] = $row['estado'];
        $casoData['prioridad'] = $row['prioridad'];
        $casoData['peritoLider'] = $row['perito_lider'];
        $casoData['version'] = (int)$row['version'];
        $casoData['fasesIso'] = $fasesIso;

        echo json_encode(['caso' => $casoData], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Listar todos los casos
    try {
        $stmt = $pdo->query('SELECT id, numero_caso, expediente, numero_prcc, tipo_proyecto, titulo, estado, prioridad, fase_actual, perito_lider, creado_en, version, datos_json FROM casos ORDER BY creado_en DESC');
        $rows = $stmt->fetchAll();
        $casos = [];
        foreach ($rows as $r) {
            $c = json_decode($r['datos_json'], true) ?: [];
            $c['id'] = $r['id'];
            $c['numeroCaso'] = $r['numero_caso'];
            $c['tipoProyecto'] = $r['tipo_proyecto'];
            $c['titulo'] = $r['titulo'];
            $c['estado'] = $r['estado'];
            $c['prioridad'] = $r['prioridad'];
            $c['peritoLider'] = $r['perito_lider'];
            $c['version'] = (int)$r['version'];
            $casos[] = $c;
        }

        echo json_encode(['casos' => $casos], JSON_UNESCAPED_UNICODE);
        exit;
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Error al consultar la tabla casos en MySQL',
            'detail' => $e->getMessage(),
            'hint' => 'Asegúrese de importar el archivo database.sql en phpMyAdmin dentro de la base de datos sirixutr_Forensic_cco'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// Para mutaciones (POST, PUT, DELETE) requerimos usuario autenticado si hay sesión activa
$usuarioEmail = $user ? $user['email'] : 'perito@sha256.us';

// POST: Crear nuevo caso
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $input['id'] ?? ('caso-' . bin2hex(random_bytes(8)));
    $numeroCaso = trim((string)($input['numeroCaso'] ?? ''));
    $tipoProyecto = $input['tipoProyecto'] ?? 'forense_whatsapp';
    $titulo = trim((string)($input['titulo'] ?? ''));
    $peritoLider = trim((string)($input['peritoLider'] ?? ($user['nombre'] ?? 'Perito Oficial')));

    if (empty($numeroCaso) || empty($titulo)) {
        http_response_code(400);
        echo json_encode(['error' => 'numeroCaso y titulo son campos obligatorios']);
        exit;
    }

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare('INSERT INTO casos (id, numero_caso, expediente, numero_prcc, tipo_proyecto, titulo, descripcion, estado, prioridad, fase_actual, perito_lider, fiscal, solicitante_nombre, solicitante_cedula, hash_sha256, version, datos_json) VALUES (:id, :numero_caso, :expediente, :numero_prcc, :tipo_proyecto, :titulo, :descripcion, :estado, :prioridad, :fase_actual, :perito_lider, :fiscal, :solicitante_nombre, :solicitante_cedula, :hash_sha256, 1, :datos_json)');

        $input['id'] = $id;
        $input['version'] = 1;
        $input['fechaCreacion'] = date('c');
        $input['fechaUltimaActualizacion'] = date('c');

        $stmt->execute([
            'id' => $id,
            'numero_caso' => $numeroCaso,
            'expediente' => $input['expediente'] ?? null,
            'numero_prcc' => $input['numero_prcc'] ?? null,
            'tipo_proyecto' => $tipoProyecto,
            'titulo' => $titulo,
            'descripcion' => $input['descripcion'] ?? '',
            'estado' => $input['estado'] ?? 'iniciado',
            'prioridad' => $input['prioridad'] ?? 'alta',
            'fase_actual' => 'F0',
            'perito_lider' => $peritoLider,
            'fiscal' => $input['fiscal'] ?? null,
            'solicitante_nombre' => $input['solicitante_nombre'] ?? null,
            'solicitante_cedula' => $input['solicitante_cedula'] ?? null,
            'hash_sha256' => $input['hashSHA256'] ?? null,
            'datos_json' => json_encode($input, JSON_UNESCAPED_UNICODE)
        ]);

        // Inicializar Fases F0..F5
        $fases = ['F0', 'F1', 'F2', 'F3', 'F4', 'F5'];
        $stmtFase = $pdo->prepare('INSERT INTO fases_caso (caso_id, fase, estado, controles_json) VALUES (:caso_id, :fase, :estado, "{}")');
        foreach ($fases as $idx => $f) {
            $estadoInicial = ($f === 'F0') ? 'DISPONIBLE' : 'BLOQUEADA';
            $stmtFase->execute([
                'caso_id' => $id,
                'fase' => $f,
                'estado' => $estadoInicial
            ]);
        }

        // Registrar en auditoría
        $stmtLast = $pdo->query('SELECT hash_actual, seq FROM auditoria ORDER BY seq DESC LIMIT 1');
        $lastRow = $stmtLast->fetch();
        $hashAnterior = $lastRow ? $lastRow['hash_actual'] : Canonical::GENESIS_HASH;
        $seq = $lastRow ? ((int)$lastRow['seq'] + 1) : 1;
        $ts = date('c');

        $eventoAuditoria = [
            'accion' => 'CREACION_CASO',
            'casoId' => $id,
            'detalle' => "Apertura de expediente {$numeroCaso}: {$titulo}",
            'hashAnterior' => $hashAnterior,
            'nivel' => 'info',
            'seq' => $seq,
            'ts' => $ts,
            'usuario' => $usuarioEmail
        ];
        $hashActual = Canonical::hash($eventoAuditoria);

        $stmtAudit = $pdo->prepare('INSERT INTO auditoria (seq, caso_id, usuario, accion, detalle, nivel, ts_utc, hash_anterior, hash_actual) VALUES (:seq, :caso_id, :usuario, :accion, :detalle, :nivel, :ts_utc, :hash_anterior, :hash_actual)');
        $stmtAudit->execute([
            'seq' => $seq,
            'caso_id' => $id,
            'usuario' => $usuarioEmail,
            'accion' => 'CREACION_CASO',
            'detalle' => "Apertura de expediente {$numeroCaso}: {$titulo}",
            'nivel' => 'info',
            'ts_utc' => $ts,
            'hash_anterior' => $hashAnterior,
            'hash_actual' => $hashActual
        ]);

        $pdo->commit();
        echo json_encode(['success' => true, 'id' => $id, 'version' => 1], JSON_UNESCAPED_UNICODE);
        exit;
    } catch (\Throwable $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Error al crear el caso', 'detail' => $e->getMessage()]);
        exit;
    }
}

// PUT: Actualizar caso (con control de concurrencia optimista)
if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $input['id'] ?? null;
    $versionEsperada = isset($input['version']) ? (int)$input['version'] : null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'id del caso requerido']);
        exit;
    }

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare('SELECT version, datos_json FROM casos WHERE id = :id FOR UPDATE');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        if (!$row) {
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode(['error' => 'Caso no encontrado']);
            exit;
        }

        $versionActual = (int)$row['version'];
        if ($versionEsperada !== null && $versionEsperada !== $versionActual) {
            $pdo->rollBack();
            http_response_code(409);
            echo json_encode([
                'error' => 'Conflicto de concurrencia optimista',
                'versionActual' => $versionActual,
                'versionEnviada' => $versionEsperada
            ]);
            exit;
        }

        $existente = json_decode($row['datos_json'], true) ?: [];
        $merged = array_merge($existente, $input);
        $nuevaVersion = $versionActual + 1;
        $merged['version'] = $nuevaVersion;
        $merged['fechaUltimaActualizacion'] = date('c');

        $stmtUpdate = $pdo->prepare('UPDATE casos SET titulo = :titulo, descripcion = :descripcion, estado = :estado, prioridad = :prioridad, solicitante_nombre = :solicitante_nombre, solicitante_cedula = :solicitante_cedula, hash_sha256 = :hash_sha256, version = :version, datos_json = :datos_json WHERE id = :id');

        $stmtUpdate->execute([
            'id' => $id,
            'titulo' => $merged['titulo'] ?? '',
            'descripcion' => $merged['descripcion'] ?? '',
            'estado' => $merged['estado'] ?? 'iniciado',
            'prioridad' => $merged['prioridad'] ?? 'alta',
            'solicitante_nombre' => $merged['solicitante_nombre'] ?? null,
            'solicitante_cedula' => $merged['solicitante_cedula'] ?? null,
            'hash_sha256' => $merged['hashSHA256'] ?? null,
            'version' => $nuevaVersion,
            'datos_json' => json_encode($merged, JSON_UNESCAPED_UNICODE)
        ]);

        $pdo->commit();
        echo json_encode(['success' => true, 'version' => $nuevaVersion], JSON_UNESCAPED_UNICODE);
        exit;
    } catch (\Throwable $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar el caso', 'detail' => $e->getMessage()]);
        exit;
    }
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
