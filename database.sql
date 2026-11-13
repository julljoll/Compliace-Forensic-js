-- ==============================================================================
-- 🏛️ SHA256.US — CMS DE CUMPLIMIENTO FORENSE DIGITAL
-- Esquema de Base de Datos MySQL / MariaDB para cPanel (phpMyAdmin)
-- Cumplimiento estricto: ISO/IEC 27037 · ISO/IEC 27042 · COPP Art. 187 · MUCC-2017
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Tabla de Usuarios y Peritos
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` VARCHAR(64) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `totp_secret` VARCHAR(64) DEFAULT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Expedientes / Casos
CREATE TABLE IF NOT EXISTS `casos` (
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
  `datos_json` LONGTEXT NOT NULL COMMENT 'Payload completo serializado de CasoCMS (normativas, evidencias, etc.)',
  `creado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_casos_numero` (`numero_caso`),
  KEY `idx_casos_estado` (`estado`),
  KEY `idx_casos_tipo` (`tipo_proyecto`),
  KEY `idx_casos_fase` (`fase_actual`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de Estados de Fases ISO por Caso
CREATE TABLE IF NOT EXISTS `fases_caso` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `caso_id` VARCHAR(64) NOT NULL,
  `fase` ENUM('F0', 'F1', 'F2', 'F3', 'F4', 'F5') NOT NULL,
  `estado` ENUM('BLOQUEADA', 'DISPONIBLE', 'EN_PROGRESO', 'COMPLETADA') NOT NULL DEFAULT 'BLOQUEADA',
  `controles_json` LONGTEXT NOT NULL COMMENT 'Controles marcados con timestamps y perito',
  `hash_anterior` CHAR(64) DEFAULT NULL,
  `hash_fase` CHAR(64) DEFAULT NULL,
  `completada_por` VARCHAR(150) DEFAULT NULL,
  `iniciada_en` DATETIME DEFAULT NULL,
  `completada_en` DATETIME DEFAULT NULL,
  `sellada` TINYINT(1) NOT NULL DEFAULT 0,
  `actualizado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_fases_caso` (`caso_id`, `fase`),
  CONSTRAINT `fk_fases_caso` FOREIGN KEY (`caso_id`) REFERENCES `casos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabla de Auditoría Criptográfica Inmutable (Append-Only)
-- Ningún registro puede ser modificado ni borrado (enforzado mediante triggers)
CREATE TABLE IF NOT EXISTS `auditoria` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabla de Evidencias Digitales
CREATE TABLE IF NOT EXISTS `evidencias` (
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
  `fecha_recepcion` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_evidencias_caso` (`caso_id`),
  CONSTRAINT `fk_evidencias_caso` FOREIGN KEY (`caso_id`) REFERENCES `casos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Triggers de Inmutabilidad para la Tabla de Auditoría (Prevención de Adulteración)
DROP TRIGGER IF EXISTS `trg_auditoria_no_update`;
DELIMITER $$
CREATE TRIGGER `trg_auditoria_no_update` BEFORE UPDATE ON `auditoria`
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'VIOLACIÓN DE INTEGRIDAD FORENSE: La tabla de auditoría inmutable no permite UPDATE.';
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS `trg_auditoria_no_delete`;
DELIMITER $$
CREATE TRIGGER `trg_auditoria_no_delete` BEFORE DELETE ON `auditoria`
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'VIOLACIÓN DE INTEGRIDAD FORENSE: La tabla de auditoría inmutable no permite DELETE.';
END$$
DELIMITER ;

-- 7. Usuarios Oficiales del Laboratorio Forense
-- Usuario 1: Jull Joll — Perito Analizador de Datos (Clave: Karupano | TOTP: JULLJOLLFCCO2FA1)
INSERT INTO `usuarios` (`id`, `email`, `password_hash`, `totp_secret`, `nombre`, `apellido`, `ci`, `cargo`, `rol`, `organismo`, `despacho`, `telefono`, `civ`, `inpre`, `activo`)
VALUES (
  'usr-jull-01',
  'julljoll@gmail.com',
  '$2y$10$rpiUdT4xp.mZyY9ru8Bf4u0pMTGcewPNUroJ0DFs9VBZ061oRK3wm',
  'JULLJOLLFCCO2FA1',
  'Jull',
  'Joll',
  'V-18.999.001',
  'Perito Analizador de Datos Forenses',
  'admin',
  'Laboratorio Privado SHA256.US',
  'Área de Análisis e Interpretación (F3/F4)',
  '+58 412-0000000',
  'CIV-299410',
  'INPRE-184920',
  1
) ON DUPLICATE KEY UPDATE 
  `password_hash` = VALUES(`password_hash`),
  `totp_secret` = VALUES(`totp_secret`),
  `cargo` = VALUES(`cargo`),
  `despacho` = VALUES(`despacho`),
  `activo` = 1;

-- Usuario 2: SHA256 — Encargado de la Etapa de Adquisición (Clave: 15816003 | TOTP: SHA256USFCCO2FA2)
INSERT INTO `usuarios` (`id`, `email`, `password_hash`, `totp_secret`, `nombre`, `apellido`, `ci`, `cargo`, `rol`, `organismo`, `despacho`, `telefono`, `civ`, `inpre`, `activo`)
VALUES (
  'usr-sha256-02',
  'sha256.us@gmail.com',
  '$2y$10$DsXjrM8atz4tFHyraR1Od.HZL7kvcaBuNSm0SLvm5rhEvQ8xnto3i',
  'SHA256USFCCO2FA2',
  'SHA256',
  'Adquisición',
  'V-15.816.003',
  'Encargado de la Etapa de Adquisición',
  'perito_lider',
  'Laboratorio Privado SHA256.US',
  'Área de Adquisición y Cadena de Custodia (F1/F2)',
  '+58 414-0000000',
  'CIV-310520',
  'INPRE-201450',
  1
) ON DUPLICATE KEY UPDATE 
  `password_hash` = VALUES(`password_hash`),
  `totp_secret` = VALUES(`totp_secret`),
  `cargo` = VALUES(`cargo`),
  `despacho` = VALUES(`despacho`),
  `activo` = 1;

-- 8. Expediente Inicial Sincronizado en Base de Datos (ISO/IEC 27037)
INSERT INTO `casos` (`id`, `numero_caso`, `expediente`, `numero_prcc`, `tipo_proyecto`, `titulo`, `descripcion`, `estado`, `prioridad`, `fase_actual`, `perito_lider`, `fiscal`, `solicitante_nombre`, `solicitante_cedula`, `hash_sha256`, `version`, `datos_json`)
VALUES (
  'caso-wa-01',
  'MP-01-2026-WA',
  'EXP-45920-2026',
  'PRCC-2026-001',
  'forense_whatsapp',
  'Extracción Forense - Caso Extorsión Telefónica',
  'Investigación pericial de mensajería instantánea en dispositivo móvil Android incautado conforme a ISO/IEC 27037 y MUCC-2017.',
  'iniciado',
  'alta',
  'F0',
  'Jull Joll',
  'Dr. Alberto Silva (Fiscalía 12º del M.P. Estado Lara)',
  'Insp. Jefe Luis Ortega',
  'V-12.345.678',
  'b5f2a3e8c9d1047f6a2d3e8c9b5f1e2d7a4c0f3b8e5d2a9c6b3f0e7d1a2c3b4e',
  1,
  '{"id":"caso-wa-01","numeroCaso":"MP-01-2026-WA","expediente":"EXP-45920-2026","tipoProyecto":"forense_whatsapp","titulo":"Extracción Forense - Caso Extorsión Telefónica","descripcion":"Investigación pericial de mensajería instantánea en dispositivo móvil Android incautado conforme a ISO/IEC 27037 y MUCC-2017.","prioridad":"alta","estado":"iniciado","faseIsoActual":"F0","fechaCreacion":"2026-07-19T08:00:00.000Z","fechaUltimaActualizacion":"2026-07-19T08:00:00.000Z","consignanteNombre":"Insp. Jefe Luis Ortega","consignanteCedula":"V-12.345.678","consignanteTelefono":"+58 412-5551234","consignanteEmail":"fiscalia12.lara@mp.gob.ve","consignanteDireccion":"Sede Central CICPC Delegación Quíbor","evidenciaTipo":"Teléfono Inteligente","evidenciaMarca":"Samsung","evidenciaModelo":"Galaxy A54","evidenciaSerial":"354928110948271","evidenciaColor":"Negro Phantom","evidenciaEstado":"Operativo, pantalla intacta","evidenciaAislamientoRF":true,"fiscaliaTribunal":"Fiscalía 12º del Ministerio Público Estado Lara","peritoLiderNombre":"Jull Joll","peritoLiderCedula":"V-18.999.001","peritoLiderCiv":"CIV-299410","version":1}'
) ON DUPLICATE KEY UPDATE `version` = 1;

-- Inicialización de fases F0..F5 para caso-wa-01
INSERT INTO `fases_caso` (`caso_id`, `fase`, `estado`, `controles_json`, `hash_anterior`, `hash_fase`, `completada_por`, `sellada`)
VALUES 
  ('caso-wa-01', 'F0', 'DISPONIBLE', '{}', NULL, NULL, NULL, 0),
  ('caso-wa-01', 'F1', 'BLOQUEADA', '{}', NULL, NULL, NULL, 0),
  ('caso-wa-01', 'F2', 'BLOQUEADA', '{}', NULL, NULL, NULL, 0),
  ('caso-wa-01', 'F3', 'BLOQUEADA', '{}', NULL, NULL, NULL, 0),
  ('caso-wa-01', 'F4', 'BLOQUEADA', '{}', NULL, NULL, NULL, 0),
  ('caso-wa-01', 'F5', 'BLOQUEADA', '{}', NULL, NULL, NULL, 0)
ON DUPLICATE KEY UPDATE `estado` = VALUES(`estado`);

SET FOREIGN_KEY_CHECKS = 1;
