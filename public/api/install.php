<?php
/**
 * SHA256.US — Script de Inicialización Automática de Base de Datos
 * Ejecuta el esquema canónico (tablas, llaves foráneas, triggers de inmutabilidad y usuario inicial).
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$key = $_GET['key'] ?? '';
if ($key !== 'Karupano15*') {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado: clave de autorización requerida'], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/lib/db.php';
use Sha256\Db\Database;

try {
    $pdo = Database::getConnection();

    // 1. Tabla de Usuarios
    $pdo->exec("CREATE TABLE IF NOT EXISTS `usuarios` (
      `id` VARCHAR(64) NOT NULL,
      `email` VARCHAR(191) NOT NULL,
      `password_hash` VARCHAR(255) NOT NULL,
      `nombre` VARCHAR(150) NOT NULL,
      `apellido` VARCHAR(150) NOT NULL DEFAULT '',
      `ci` VARCHAR(32) NOT NULL DEFAULT '',
      `cargo` VARCHAR(120) NOT NULL DEFAULT 'Perito Informático Forense',
      `rol` ENUM('admin', 'perito_lider', 'perito_asistente', 'fiscal', 'compliance_officer', 'coordinador') NOT NULL DEFAULT 'perito_lider',
      `organismo` VARCHAR(150) NOT NULL DEFAULT 'Laboratorio Privado SHA256.US',
      `despacho` VARCHAR(150) NOT NULL DEFAULT 'División Pericial Digital',
      `telefono` VARCHAR(64) NOT NULL DEFAULT '',
      `civ` VARCHAR(64) NOT NULL DEFAULT '',
      `inpre` VARCHAR(64) NOT NULL DEFAULT '',
      `activo` TINYINT(1) NOT NULL DEFAULT 1,
      `creado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `actualizado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      UNIQUE KEY `uk_usuarios_email` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // 2. Tabla de Casos
    $pdo->exec("CREATE TABLE IF NOT EXISTS `casos` (
      `id` VARCHAR(64) NOT NULL,
      `numero_caso` VARCHAR(64) NOT NULL,
      `expediente` VARCHAR(100) DEFAULT NULL,
      `numero_prcc` VARCHAR(64) DEFAULT NULL,
      `tipo_proyecto` ENUM('forense_whatsapp', 'forense_email', 'forense_discoduro', 'forense_imagen') NOT NULL,
      `titulo` VARCHAR(255) NOT NULL,
      `descripcion` TEXT,
      `estado` ENUM('iniciado', 'en_proceso', 'analisis', 'informe', 'cerrado', 'archivado') NOT NULL DEFAULT 'iniciado',
      `prioridad` ENUM('critica', 'alta', 'media', 'baja') NOT NULL DEFAULT 'alta',
      `fase_actual` VARCHAR(8) NOT NULL DEFAULT 'F0',
      `perito_lider` VARCHAR(150) NOT NULL,
      `fiscal` VARCHAR(150) DEFAULT NULL,
      `solicitante_nombre` VARCHAR(150) DEFAULT NULL,
      `solicitante_cedula` VARCHAR(32) DEFAULT NULL,
      `hash_sha256` CHAR(64) DEFAULT NULL,
      `version` INT UNSIGNED NOT NULL DEFAULT 1,
      `datos_json` LONGTEXT NOT NULL,
      `creado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `actualizado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      UNIQUE KEY `uk_casos_numero` (`numero_caso`),
      KEY `idx_casos_estado` (`estado`),
      KEY `idx_casos_tipo` (`tipo_proyecto`),
      KEY `idx_casos_fase` (`fase_actual`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // 3. Tabla de Fases ISO
    $pdo->exec("CREATE TABLE IF NOT EXISTS `fases_caso` (
      `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      `caso_id` VARCHAR(64) NOT NULL,
      `fase` VARCHAR(8) NOT NULL,
      `estado` ENUM('BLOQUEADA', 'PENDIENTE', 'EN_PROCESO', 'COMPLETADA') NOT NULL DEFAULT 'BLOQUEADA',
      `controles_json` JSON DEFAULT NULL,
      `hash_anterior` CHAR(64) DEFAULT NULL,
      `hash_fase` CHAR(64) DEFAULT NULL,
      `completada_por` VARCHAR(150) DEFAULT NULL,
      `completada_en` VARCHAR(32) DEFAULT NULL,
      `sellada` TINYINT(1) NOT NULL DEFAULT 0,
      `actualizado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      UNIQUE KEY `uk_fases_caso_fase` (`caso_id`, `fase`),
      KEY `idx_fases_caso_id` (`caso_id`),
      CONSTRAINT `fk_fases_caso_id` FOREIGN KEY (`caso_id`) REFERENCES `casos` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // 4. Tabla de Auditoría Inmutable
    $pdo->exec("DROP TABLE IF EXISTS `auditoria`");
    $pdo->exec("CREATE TABLE IF NOT EXISTS `auditoria` (
      `seq` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      `caso_id` VARCHAR(64) DEFAULT NULL,
      `usuario` VARCHAR(150) NOT NULL,
      `accion` VARCHAR(100) NOT NULL,
      `detalle` TEXT NOT NULL,
      `nivel` ENUM('info', 'warning', 'error', 'success') NOT NULL DEFAULT 'info',
      `ts_utc` VARCHAR(35) NOT NULL,
      `hash_anterior` CHAR(64) NOT NULL,
      `hash_actual` CHAR(64) NOT NULL,
      `creado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`seq`),
      KEY `idx_auditoria_caso` (`caso_id`),
      KEY `idx_auditoria_hash` (`hash_actual`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // 5. Tabla de Evidencias Digitales
    $pdo->exec("DROP TABLE IF EXISTS `evidencias`");
    $pdo->exec("CREATE TABLE IF NOT EXISTS `evidencias` (
      `id` VARCHAR(64) NOT NULL,
      `caso_id` VARCHAR(64) NOT NULL,
      `numero_item` INT UNSIGNED NOT NULL DEFAULT 1,
      `tipo` VARCHAR(64) NOT NULL,
      `descripcion` TEXT NOT NULL,
      `marca` VARCHAR(100) DEFAULT NULL,
      `modelo` VARCHAR(100) DEFAULT NULL,
      `serial` VARCHAR(100) DEFAULT NULL,
      `imei` VARCHAR(64) DEFAULT NULL,
      `estado_fisico` VARCHAR(255) DEFAULT NULL,
      `hash_sha256` CHAR(64) DEFAULT NULL,
      `hash_md5` CHAR(32) DEFAULT NULL,
      `bolsa_faraday` VARCHAR(64) DEFAULT NULL,
      `precinto_numero` VARCHAR(64) DEFAULT NULL,
      `ubicacion_fisica` VARCHAR(150) DEFAULT NULL,
      `fecha_recepcion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      KEY `idx_evidencias_caso` (`caso_id`),
      KEY `idx_evidencias_hash` (`hash_sha256`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // 6. Triggers de Inmutabilidad
    try {
        $pdo->exec("DROP TRIGGER IF EXISTS `trg_auditoria_no_update`");
        $pdo->exec("CREATE TRIGGER `trg_auditoria_no_update` BEFORE UPDATE ON `auditoria`
          FOR EACH ROW
          BEGIN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'VIOLACIÓN DE INTEGRIDAD FORENSE: La tabla de auditoría inmutable no permite UPDATE.';
          END");

        $pdo->exec("DROP TRIGGER IF EXISTS `trg_auditoria_no_delete`");
        $pdo->exec("CREATE TRIGGER `trg_auditoria_no_delete` BEFORE DELETE ON `auditoria`
          FOR EACH ROW
          BEGIN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'VIOLACIÓN DE INTEGRIDAD FORENSE: La tabla de auditoría inmutable no permite DELETE.';
          END");
    } catch (\Throwable $eTrigger) {
        // En algunos cPanel el usuario requiere permiso de superusuario para crear triggers, registramos advertencia
    }

    // 7. Usuario Inicial Perito Administrador
    $pwdHash = password_hash('Karupano15*', PASSWORD_BCRYPT);
    $stmtUser = $pdo->prepare("INSERT INTO `usuarios` (`id`, `email`, `password_hash`, `nombre`, `apellido`, `ci`, `cargo`, `rol`, `organismo`, `despacho`, `telefono`, `civ`, `inpre`, `activo`)
      VALUES ('usr-admin-01', 'julljoll@gmail.com', :pwd, 'Jull', 'Joll', 'V-18.999.001', 'Perito Informático Forense Principal', 'admin', 'Laboratorio Privado SHA256.US', 'Coordinación de Cumplimiento Forense', '+58 412-0000000', 'CIV-299410', 'INPRE-184920', 1)
      ON DUPLICATE KEY UPDATE `activo` = 1, `password_hash` = :pwd2");
    $stmtUser->execute(['pwd' => $pwdHash, 'pwd2' => $pwdHash]);

    echo json_encode([
        'success' => true,
        'message' => 'Base de datos MySQL (sirixutr_Forensic_cco) inicializada exitosamente.',
        'tablas_creadas' => ['usuarios', 'casos', 'fases_caso', 'auditoria', 'evidencias'],
        'usuario_inicial' => 'julljoll@gmail.com'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Error al inicializar la base de datos',
        'detail' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
