```
====================================================================================================
               🏛️ SHA256.US — CMS DE COMPLIANCE FORENSE DIGITAL 🏛️
     MANUAL CANÓNICO PROFESIONAL DE INGENIERÍA & ESTÁNDARES DE DESARROLLO
====================================================================================================
```

# ⚖️ SHA256.US — MANUAL CANÓNICO PROFESIONAL DE INGENIERÍA & ESTÁNDARES DE DESARROLLO

> [!IMPORTANT]
> **ESTÁNDAR CANÓNICO DE GOBERNANZA Y DESARROLLO PERICIAL:**
> Este documento constituye el **Manual Canónico Oficial de Ingeniería y Estándares de Desarrollo** que rige obligatoriamente todo el código, arquitectura estática en Astro, API determinista en PHP/MySQL (PDO) para cPanel, interfaz gráfica nativa USWDS (`@uswds/uswds`), catálogo de 13 planillas oficiales en Folio (216mm × 330mm) e inmutabilidad criptográfica en el proyecto **SHA256.US**.

| 📌 Parámetro de Gobernanza | ⚙️ Especificación Técnica Institucional |
|:---------------------------|:----------------------------------------|
| **Documento Oficial**      | **Manual Canónico Profesional de Ingeniería & Estándares de Desarrollo** |
| **Sistema Mandante**       | SHA256.US — Compliance Forense Digital CMS |
| **Versión Canónica**       | `v4.0.0-CANONICAL` |
| **Arquitectura de Despliegue** | **Astro Static (`output: 'static'`) + cPanel (Apache + PHP 8.2+ + MySQL PDO)** |
| **Estado de Vigencia**     | 🟢 **OBLIGATORIO & ACTIVO (ENFORCED)** |
| **Clasificación Legal**    | Estándar Forense ISO/IEC 27037 · ISO/IEC 27042 · ISO/IEC 27043 · ISO 37301 · ISO/IEC 27001 · NIST SP 800-86 · NIST SP 800-88 · MUCC-2017 · COPP Arts. 187, 223–225 |

---

## 1. Stack Tecnológico Exclusivo y Reglas de Arquitectura

- **Framework Principal:** **Astro (`output: 'static'`)**. Genera páginas HTML ultra-ligeras y pre-renderizadas en `dist/` para servir directamente desde `public_html` en Apache.
- **Sistema de UI y Estilos (ÚNICO Y EXCLUSIVO):** **U.S. Web Design System (`@uswds/uswds` 3.14+)** compilado con Sass a `public/assets/uswds/css/uswds.min.css`.
- **PROHIBICIÓN TOTAL DE NEXT.JS Y MATERIAL-UI (MUI):** Eliminados totalmente. Toda la interfaz usa componentes semánticos y clases oficiales USWDS (`.usa-banner`, `.usa-header`, `.usa-sidenav`, `.usa-card`, `.usa-table`, `.usa-step-indicator`, `.usa-summary-box`, `.usa-alert`, `.usa-form`).
- **PROHIBICIÓN TOTAL DE TAILWIND CSS:** Prohibido el uso de utilidades de Tailwind CSS.
- **Backend Determinista para cPanel:** API REST ligera en **PHP puro con PDO** (`public/api/casos.php`, `public/api/avanzar-etapa.php`, `public/api/auditoria.php`, `public/api/auth.php`) conectado a MySQL/MariaDB (`database.sql`).
- **Persistencia Híbrida (Offline-First):** Sincronización bidireccional entre **IndexedDB** en el navegador y **MySQL** vía API PHP.
- **Tipografía Institucional:**
  - `Public Sans Web` (Fuente oficial USWDS para UI y lectura).
  - `Merriweather Web` (Para títulos formales y decretos).
  - `Roboto Mono Web` (Para hashes SHA-256, números de expediente, precintos y direcciones MAC/IP).

---

## 2. Sistema de Diseño Visual (USWDS DC3 Cyber Forensics Light Theme)

La interfaz gráfica sigue el modelo oficial del **Defense Cyber Crime Center — Cyber Forensics Laboratory (DC3)** en modo claro gubernamental:

### 2.1 Tokens de Color Oficiales

| Elemento / Rol | Token USWDS | Valor Hex | Aplicación |
|----------------|-------------|-----------|------------|
| **Fondo Principal (Canvas)** | `Cool Gray 5` | `#F0F4F8` | Canvas general de la aplicación |
| **Tarjetas y Superficies** | `Crisp White` | `#FFFFFF` | Tarjetas, modales, tablas y contenedores (`border: #CBD5E1`) |
| **Sidebar & Nav Superior** | `Dark Navy Ink 90v` | `#112E51` | Azul marino federal de laboratorio forense |
| **Banner Oficial del Gobierno** | `Banner Navy` | `#1A2536` | Componente `.usa-banner` institucional |
| **Acento Primario / Interactivo** | `Vivid Blue 60v` | `#005EA2` | Botones principales, enlaces, progreso, tabs activos |
| **Sellos y Destacados** | `Accent Gold 40v` | `#D9A700` | Insignias de la República, sellos oficiales y badges |
| **Texto de Lectura Principal** | `Dark Ink` | `#1B2A4A` | Encabezados, títulos y texto primario |
| **Texto Secundario / Muted** | `Slate` | `#475569` | Descripciones, labels y meta-información |
| **Estado Éxito / Conforme** | `Green 50v` | `#008837` | Hashes verificados, sellos completados |
| **Estado Alerta / Gating** | `Gold 60v` | `#C05621` | Requisitos pendientes, advertencias de nulidad |
| **Estado Error / Violación** | `Red 50v` | `#D9381E` | Inconsistencias de hash, rotura de cadena |

---

## 3. Optimización del Ciclo Pericial ISO/IEC (6 Fases Canónicas F0 a F5)

El sistema reemplaza los pasos fragmentados anteriores por un flujo unificado y secuencial de 6 fases reguladas por normativas internacionales:

| Fase | Nombre Canónico | Estándares Reguladores | Objetivo y Controles Clave | Planillas Requeridas |
|:-----|:----------------|:-----------------------|:---------------------------|:---------------------|
| **F0** | **Apertura y Legitimación** | ISO 37301 §8.1 · ISO/IEC 27043 §8 · CRBV Arts. 28/60 | Legitimar el encargo pericial, identificar al consignante, consentimiento informado Hábeas Data y delimitar el alcance. | Acta Consentimiento Informado, Acta Entrevista Forense |
| **F1** | **Identificación y Recolección** | ISO/IEC 27037 §5.2–5.3, §7.1 · MUCC-2017 · COPP Art. 187 | Fijación fotográfica 360°, aislamiento electromagnético (Faraday/Modo Avión), precintado numerado y apertura formal de la PRCC. | Acta Obtención y Preservación, Planilla PRCC |
| **F2** | **Adquisición y Preservación** | ISO/IEC 27037 §5.4, §7.1.3 · NIST SP 800-86 | Desprecintado en laboratorio, bloqueadores de escritura (Write-Blockers), clonado bit-a-bit (E01/DD), cálculo de Hash Génesis SHA-256 y verificación MATCH. | Acta Desprecintado, Planilla PRCC |
| **F3** | **Análisis e Interpretación** | ISO/IEC 27042 §7–8 · NIST SP 800-101 · ACPO P1-P4 | Análisis exclusivo sobre copia de trabajo, herramientas validadas (ALEAPP, Kali, Andriller, IPED, Sonic Visualiser), reproducibilidad y bitácora de hallazgos. | Planilla Audio Sonic, Planilla Evaluación UX |
| **F4** | **Informe Pericial y Dictamen** | ISO/IEC 27043 §9 · ISO/IEC 27042 §9 · COPP Arts. 223–225 | Redacción de dictamen científico motivado, citas de hashes génesis, conclusiones legales, revisión técnica y firma bilateral de dos peritos. | Acta Dictamen Oficial, Dictamen Imágenes, Dictamen Audios |
| **F5** | **Entrega, Disposición y Sanitización** | MUCC-2017 Disposición Final · NIST SP 800-88 Rev. 1 · ISO/IEC 27001 | Entrega formal de evidencias y resultados, sanitización certificada (Zeroization/Crypto-Erase) de medios del laboratorio y verificación de cadena de auditoría inmutable. | Acta Entrega Resultados, Acta Sanitización, Acta Auditoría Timeline |

### Regla Criptográfica de Gating:
Ninguna fase puede iniciarse si la anterior no está en estado `COMPLETADA` con su hash SHA-256 generado y verificado. El endpoint `/api/avanzar-etapa.php` ejecuta una transacción atómica `SELECT ... FOR UPDATE` en MySQL para garantizar este principio.

---

## 4. REGLA INQUEBRANTABLE: Preservación de las 13 Planillas Oficiales (216mm × 330mm)

Se preservan íntegramente las 13 planillas y dictámenes oficiales de informática forense:
1. `ActaConsentimiento.astro` (F0)
2. `ActaEntrevista.astro` (F0)
3. `ActaObtencion.astro` (F1)
4. `PlanillaPRCC.astro` (F1)
5. `ActaDesprecintado.astro` (F2)
6. `PlanillaAudioSonic.astro` (F3)
7. `PlanillaEvaluacionUX.astro` (F3)
8. `ActaDictamen.astro` (F4)
9. `DictamenImagenes.astro` (F4)
10. `DictamenAudios.astro` (F4)
11. `ActaEntregaResultados.astro` (F5)
12. `ActaSanitizacion.astro` (F5)
13. `ActaAuditoriaTimeline.astro` (F5)

### Reglas Técnicas de Folio:
- **Dimensiones Reglamentarias:** Tamaño Folio / Oficio (`216mm × 330mm`).
- **Aislamiento Estricto:** Encapsuladas en `<div class="folio-forense-aislado">` con estilos independientes en `src/styles/folio-aislado.css`.
- **Regla de Impresión:** `@page { size: 216mm 330mm; margin: 15mm 15mm 15mm 30mm; }`.
- **Ocultamiento de UI:** Todo componente USWDS (`.usa-banner`, `.usa-header`, `.usa-sidenav`, `.no-print`) se oculta al imprimir o exportar a PDF vía `@media print`.
- **Hashes SHA-256:** Siempre formateados con `overflow-wrap: break-word;` y fuente monoespaciada para evitar desbordes físicos de la hoja.
- **Cierre Legal Obligatorio:** Firma bilateral, N° C.I., CIV, recuadros dactiloscópicos bilaterales (Pulgar Izquierdo y Pulgar Derecho), dirección de residencia y teléfono.

---

## 5. Arquitectura cPanel (Apache + PHP 8.2+ + MySQL PDO)

### 5.1 Base de Datos (`database.sql`)
- Motor InnoDB, codificación `utf8mb4_unicode_ci`.
- Tablas: `usuarios`, `casos`, `fases_caso`, `auditoria`, `evidencias`.
- Triggers de Inmutabilidad contra adulteraciones:
  - `trg_auditoria_no_update`: Impide `UPDATE` en la tabla `auditoria`.
  - `trg_auditoria_no_delete`: Impide `DELETE` en la tabla `auditoria`.

### 5.2 Endpoints REST Deterministas (`public/api/`)
- `casos.php`: CRUD con control de concurrencia optimista (`version`).
- `avanzar-etapa.php`: Transacción atómica que valida hash previo + controles completados y genera el nuevo sello SHA-256.
- `auditoria.php`: Consulta y verificación criptográfica completa de la cadena de hashes (`?verificar=1`).
- `auth.php`: Autenticación por sesiones PHP con `password_verify()`.

### 5.3 Configuración Apache (`.htaccess`)
- `RewriteEngine On` para servir rutas limpias (`/dashboard`, `/casos`, `/flujo`, `/planillas/acta-consentimiento`) mapeadas a los archivos `.html` de `dist/`.
- Protección directa para `api/` sin alterar el tráfico POST/GET hacia PHP.
- Cabeceras de seguridad: `X-Frame-Options SAMEORIGIN`, `X-Content-Type-Options nosniff`, `Referrer-Policy strict-origin-when-cross-origin`.

---

## 6. Procedimiento de Despliegue en cPanel

1. **Compilación Local:**
   ```bash
   npm run build
   ```
   Genera el directorio `dist/` con 22 páginas HTML estáticas, `.htaccess` y la carpeta `api/`.

2. **Base de Datos MySQL:**
   - Crear una base de datos en cPanel (ej. `sha256us_forensic`).
   - Crear un usuario MySQL con permisos completos.
   - En phpMyAdmin, importar `database.sql`.

3. **Configuración de Conexión:**
   - Editar `public/api/config.php` (o `dist/api/config.php` en el servidor) con las credenciales de MySQL.

4. **Copia de Archivos:**
   - Subir el contenido de `dist/` a `public_html/` en el administrador de archivos de cPanel o vía SFTP.
   - Asegurarse de que `.htaccess` esté visible en la raíz de `public_html`.

---

## 7. Verificación de Calidad y Pruebas

- Pruebas unitarias y de integración: `npm test` (Vitest).
- Verificación estática de planillas: `tests/unit/planillas/paridad.test.ts` (14 pruebas de paridad).
- Verificación de vector criptográfico: `tests/unit/crypto/canonical.test.ts` (100% de paridad con RFC 8785).
- Verificación de estructura cPanel: `tests/unit/build/distVerification.test.ts` (6 pruebas de empaquetado).
- Sincronización con GitHub: `npm run sync`.
