# 🔬 skill_avilla.md — Referencia de AvillaForensics

> Archivo de contexto para el desarrollo del proyecto SHA256.US  
> Fuente: https://github.com/AvillaDaniel/AvillaForensics  
> Propósito: Guiar al asistente IA en la creación de módulos que reflejen las capacidades de Avilla Forensics FREE.

---

## 🧭 ¿Qué es Avilla Forensics?

**Avilla Forensics** es una herramienta **gratuita** de forense móvil creada en **febrero de 2021** por el **Agente de Policía Civil del Estado de São Paulo, Daniel Hubscher Avilla**.

- **Lenguaje**: C# (100% del repositorio)
- **Compatibilidad**: Windows 10 y Windows 11 (versiones actualizadas)
- **Objetivo**: Extracción lógica de datos y análisis de dispositivos Android (y en menor medida iOS) sin necesidad de Root.
- **Reconocimiento**: 🥇 Ganadora del **Forensics 4:Cast Award** (SANS Institute) – Mejor Herramienta No-Comercial del año.

---

## 🏗️ Arquitectura del Repositorio

El repositorio es una aplicación **Windows Forms en C#** con arquitectura MDI (Multiple Document Interface):

```
AvillaForensics/
├── MDIParent1.cs / .Designer.cs    # Ventana principal MDI
├── Form1.cs / .Designer.cs         # Formulario principal
├── Form3.cs / Form4.cs             # Formularios generales
├── FormADB.cs                       # Módulo: Colectas ADB misceláneas
├── FormAPK.cs                       # Módulo: APK Downgrade
├── FormAbTar.cs                     # Módulo: Conversión .AB → .TAR
├── FormColetasWhats.cs              # Módulo: Colectas WhatsApp
├── FormCopyAll.cs                   # Módulo: Copia general única
├── FormDecript.cs                   # Módulo: Descifrado Crypt14/15
├── FormIOS.cs                       # Módulo: Extracción iOS
├── FormIPED.cs                      # Módulo: Integración IPED
├── FormMidias.cs                    # Módulo: Archivos multimedia
├── FormOCR.cs                       # Módulo: OCR
├── FormOpus.cs                      # Módulo: Transcripción .opus
├── FormPrint.cs                     # Módulo: Impresión/Reportes
├── FormProcess.cs                   # Módulo: Gestión de procesos
├── FormRaspagemInstagram.cs         # Módulo: Scraping de Instagram
├── FormSpecialDump.cs               # Módulo: Special Dump
├── FormSplash.cs                    # Pantalla de bienvenida
├── FormTrash.cs                     # Módulo: Archivos borrados
├── FormUnlock.cs                    # Módulo: Desbloqueo
├── FormWhats.cs                     # Módulo: WhatsApp general
├── Hash.cs / .Designer.cs           # Módulo: Calculadora de Hash
├── WhatsParser.cs                   # Parser WhatsApp (schema nuevo)
├── WhatsParserAntigocs.cs           # Parser WhatsApp (schema antiguo)
├── ManagementObject.cs              # Gestión de objetos WMI
├── ManagementObjectSearcher.cs      # Búsqueda WMI
├── Program.cs                       # Punto de entrada
└── SQLite.Interop.dll               # Soporte SQLite
```

---

## 🚀 Módulos Funcionales Completos

### 1. 🤖 Backup ADB
- Backup por defecto de Android vía ADB.

### 2. 📱 APK Downgrade (>400 aplicaciones soportadas)
Permite rebajar la versión de APK para acceder a datos en la región DATA sin ROOT.

**Apps incluidas:**
| App | Package |
|-----|---------|
| WhatsApp | `com.whatsapp` |
| Telegram | `org.telegram.messenger` |
| Messenger | `com.facebook.orca` |
| ICQ | `com.icq.mobile.client` |
| Twitter/X | `com.twitter.android` |
| Instagram | `com.instagram.android` |
| Signal | `org.thoughtcrime.securems` |
| LinkedIn | `com.linkedin.android` |
| TikTok | `com.zhiliaoapp.musically` |
| Snapchat | `com.snapchat.android` |
| Tinder | `com.tinder` |
| Badoo | `com.badoo.mobile` |
| Firefox | `org.mozilla.firefox` |
| Dropbox | `com.drobox.android` |
| Alibaba | `com.alibaba.intl.android.apps.poseidon` |

> **Android 14**: Soportado desde versión FREE.  
> **Android 12/13**: Módulo especial para explotar vulnerabilidades sin Root ni Downgrade.

### 3. 💬 Parser de Chats WhatsApp
Soporta **dos esquemas** de base de datos:

**Schema Nuevo** (Tabla: `message`):
```
_id, chat_row_id, from_me, key_id, sender_jid_row_id, status,
broadcast, recipient_count, participant_hash, origination_flags,
origin, timestamp, received_timestamp, receipt_server_timestamp,
message_type, text_data, starred, lookup_tables,
message_add_on_flags, sort_id
```

**Schema Antiguo** (Tabla: `messages`):
```
_id, key_remote_jid, key_from_me, key_id, status, needs_push,
data, timestamp, media_url, media_mime_type, media_wa_type,
media_size, media_name, media_caption, media_hash,
media_duration, origin, latitude, longitude, thumb_image,
remote_resource, received_timestamp, ...
```

**Archivos necesarios:**
- Carpeta destino de chats
- `\com.whatsapp\f\Avatars`
- `\com.whatsapp\db\msgstore.db`

### 4. 🎤 Transcripción de Audios .opus (WhatsApp)
- Transcripción masiva de audios simultáneamente.
- Integración en el reporte HTML del Parser.
- Genera HTML con textos transcritos, hash, contacto y chat vinculado.

### 5. 📊 Colectas ADB Misceláneas (.TXT)
Lista completa de datos extraídos:
- System Properties, Dumpsys, Diskstats
- Geolocalización Android, IMEI (01/02), S/N
- TCP (conexiones activas), Cuentas, Wifi, CPU, RAM
- Pantalla, Recursos, Resolución, Screen Dump (.XML)
- Aplicaciones de terceros, aplicaciones nativas
- Contactos, SMS, Eventos del sistema
- Usuarios activos, versión Android, info de BD
- Historial On/Off, LogCat, espacio en uso
- Bluetooth, ubicación de archivos media
- Reconocimiento facial DUMP
- Configuraciones Global/Seguridad/Sistema
- Gestión de PIN, ADB DUMP, Reboot/Recovery/Fastboot

### 6. ⚡ Tracking y Descifrado de archivos .ENC de WhatsApp
- Genera script `.bat` usando: `C:\Forensics\bin\whatsapp-media-decrypt\decrypt.py`

### 7. 📇 Búsqueda de Contactos, Avatares y Contactos Eliminados
- Carpeta: `\com.whatsapp\f\Avatars`
- BD: `\com.whatsapp\db\wa.db`

### 8. 🔐 Descifrado de Bases de Datos WhatsApp
- Crypt14 y Crypt15
- Usa: `WhatsApp-Crypt14-Crypt15-Decrypter` (Python)

### 9. 📸 Captura y Dump de Pantalla

### 10. 🔗 Integraciones Automáticas
| Herramienta | Ruta |
|-------------|------|
| IPED | Auto-integración |
| IPED Tools | `Z:\bin\IPEDTools\IPEDTools.exe` |
| AFLogical OSE 1.5.2 | `Z:\bin\AFLogicalOSE152OSE.apk` |
| Alias Connector | `Z:\bin\com.alias.connector.apk` |
| MVT-1.5.3 | Auto-integración |

### 11. 📦 Conversión .AB → .TAR
- Requiere agregar `C:\Forensics` a variables del sistema.
- Usa: Android Backup Extractor (Java).

### 12. ♻ Fast Scan y Transferencia en Tiempo Real
**Tipos de archivo soportados:**
```
Imágenes:    .jpg, .jpeg, .png, .psd, .nef, .tiff, .bmp, .webp
Videos:      .3gp, .avi, .m4v, .mp4, .mov, .mpeg, .flv, .wmv
Audios:      .opus, .aiff, .flac, .wav, .m4a, .mp3, .ogg, .aac
Archivos:    .zip, .rar, .7z, .tar, .gz, .bz2, .cab
Bases de datos: .db, .db3, .sqlite, .sqlite3, .backup
Documentos:  .htm, .html, .doc, .docx, .pdf, .txt, .xlsx
Ejecutables: .exe, .msi, .bat, .apk, .dll
```

### 13. 🖼 Image Finder
- Hash, Metadatos, Geolocalización
- Plot en Google Maps y Google Earth
- **Nota**: No guardar adquisiciones en el Escritorio.

### 14. 🗺 Plot de Geolocalización (lote) en Google Earth
- Genera `geo.kml` con puntos y miniaturas
- Requiere Google Earth Pro para mostrar thumbnails

### 15. 🔢 Calculadora de Hash
```
SHA-256, SHA-1, SHA-384, SHA-512, MD5
```
- **Nota**: No guardar adquisiciones en el Escritorio.

### 16. 📁 Explorador de Carpetas Android (PULL/PUSH)
### 17. 🎥 Espejo de Dispositivo (Device Mirroring)
- Usa: `scrcpy` → `C:\Forensics\bin\scrcpy`

### 18. 📸 Scraping de Instagram
- Usa: `Instaloader` (Python)

### 19. 🗂 Copia General Única
- Solución alternativa si `adb pull` o `adb backup` fallan.

### 20. ⚙️ Herramientas Externas Integradas
| Herramienta | Ruta |
|-------------|------|
| JADX (Decompiler) | `C:\Forensics\bin\jadx-1.2.0\jadx-gui-1.2.0-no-jre-win.exe` |
| WhatsApp Viewer | `C:\Forensics\bin\WhatsAppViewer.exe` |
| jExifToolGUI | Acceso via menú |

### 21. 🗺 Conversión CSV/TXT con Geolocalización a KML
- Datos de decisiones judiciales → `.kml` para investigaciones policiales.
- Plot de miles de puntos en segundos.

### 22. 🔀 Fusión de Bases de Datos WhatsApp
- `Z:\bin\merge\merge_databases_exe\merge_databases.exe -lv`

### 23. 📱 Módulo de Extracción iOS
- Usa: `libimobiledevice`

### 24. 🤖 Avilla App Full Extraction (NUEVO en FREE)
- Extrae datos de **cualquier app** en la partición DATA
- **Sin Root** ni APK Downgrade
- Soporte para perfiles secundarios del dispositivo

### 25. 📱 Adquisición Simultánea en Múltiples Dispositivos (NUEVO en FREE)

---

## 🔒 Sistema de Integridad
- Genera logs cifrados en **AES-256** con extensión `.avilla`
- Los archivos `.avilla` contienen:
  - Hashes de todos los archivos recolectados
  - **Firma HMAC** (segunda capa de protección)
- Detección de modificaciones post-adquisición

---

## 🗂 Herramientas de Terceros Integradas

### Licencia Apache
| Herramienta | Propósito |
|-------------|-----------|
| ADB | Interfaz Android Debug Bridge |
| JADX 1.2.0 | Decompilador Dex → Java (requiere Java) |
| Android Backup Extractor | Conversión .AB → .TAR (requiere Java) |
| Instaloader | Scraping Instagram (requiere Python) |
| scrcpy | Espejo de pantalla |

### Licencia GNU GPL
| Herramienta | Propósito |
|-------------|-----------|
| libimobiledevice | Extracción iOS |
| IPED | Análisis forense indexado |
| IPED Parsers (WhatsParser) | Parseo de chats WhatsApp |
| IPEDTools | Herramientas IPED |
| AFLogical OSE 1.5.2 | Colecta forense Android |
| WhatsApp-Crypt14-Crypt15-Decrypter | Descifrado DB WhatsApp (Python) |
| SQLiteStudio | Visor de bases de datos |
| jExifToolGUI | Análisis de metadatos EXIF |
| GpsPrune | Análisis de GPS/KML |
| Bytecode Viewer | Análisis de bytecode |

### Licencia MIT
| Herramienta | Propósito |
|-------------|-----------|
| ALEAPP | Análisis de Android |
| iLEAPP | Análisis de iOS |
| Hashcat | Cracking de hashes |
| WhatsApp Viewer | Visor de chats WhatsApp |
| iTunes Backup Explorer | Explorador de backups iTunes |

### Otras Licencias
| Herramienta | Licencia | Propósito |
|-------------|----------|-----------|
| speech_recognition | BSD | Transcripción de audio |
| Alias Connector | Freeware | Conector forense |
| itunes_backup2hashcat | Dominio Público | iTunes → Hashcat |
| whatsapp-media-decrypt | Sin definir | Descifrado medios WA (Python) |

---

## 💻 Requisitos del Sistema

### Requisitos Avilla Forensics
- Windows 10 / 11 (actualizados)
- Modo DEBUG activado en el dispositivo
- Conocimiento técnico de forense en móviles

### Dependencias de Terceros
- **Java**: https://www.java.com
- **Python**: https://www.python.org

### Instalación
- Formato VHD: Windows monta automáticamente (si no → Administración de discos → Adjuntar VHD)
- Formato ZIP: Descomprimir en `C:\Avilla-Forensics-Free\down` · Contraseña: `1234`
- Herramientas JADX y Backup Extractor en: `C:\Forensics\bin\`
- Puede requerir agregar `C:\Forensics` a variables del sistema PATH

---

## 📥 Descarga (versión FREE)

| Plataforma | Enlace |
|------------|--------|
| Dropbox | https://www.dropbox.com/scl/fo/edcy7xu5fx0zmetor1r6r/AIqNFYghADHTXdfktKXu2Hg |
| OneDrive | https://1drv.ms/u/c/cad000d6a96e59e4/... |
| Google Drive | https://drive.google.com/file/d/1r0hgw52CCH6XcXPPKhKHiZ4Z-HgNA4ye |
| AFD (requiere registro) | https://academiadeforensedigital.com.br |

**Hashes de verificación (ZIP):**
- SHA-256: `27bde1baca786f04dc28111fc2c81fb7f2a457665fc927d62d2709d1e59bdbf7`
- Tamaño: 6.72 GB

---

## 🎯 Contexto de Desarrollo para SHA256.US (CMS Compliance Officer)

### Estado Actual del Proyecto (v2.0.0 — 14/May/2026)
> SHA256.US ha sido transformado en un **CMS para Compliance Officer** que gestiona el cumplimiento
> normativo del proceso forense. El contenido de la carpeta `RAG/` permanece intacto.

### Arquitectura Actual
SHA256.US opera en **dos capas de enrutamiento**:
- **CMS Compliance** (`/`): Dashboard, Casos, Compliance, Normativas, Auditoría
- **Módulos Forenses** (`/forense/...`): Consignación, PRCC, Adquisición, Análisis, Informe, Disposición, Manual Avilla, Manual Serverless

### Principio de Diseño
> Avilla Forensics **NO reemplaza** las herramientas existentes, las **complementa**.  
> El módulo más importante es **APK Downgrade** — acceso a datos de apps sin Root.

### Páginas CMS Implementadas
| Ruta | Página | Estado |
|------|--------|--------|
| `/` | Dashboard Compliance | ✅ Implementado |
| `/casos` | Gestión de Casos (CRUD + filtros) | ✅ Implementado |
| `/compliance` | Panel de cumplimiento normativo | ✅ Implementado |
| `/normativas` | Marco normativo (9 instrumentos) | ✅ Implementado |
| `/auditoria` | Log de trazabilidad | ✅ Implementado |
| `/forense/manual-avilla` | Manual de uso Avilla Forensics | ✅ Implementado |
| `/tareas` | Tareas & Fases | 🔄 Stub |
| `/personal` | Registro de personal | 🔄 Stub |

### Store del CMS (cmsStore.ts)
Zustand con persistencia localStorage. Entidades: `CasoCMS`, `Evidencia`, `TareaForense`, `FaseForense`, `Normativa`, `ChecklistItem`, `Personal`, `AuditLog`.

### Estructura de Archivos CMS
```
src/
├── components/
│   ├── CMSLayout.tsx              # Layout CMS con sidebar y stats
│   └── Layout.tsx                 # Layout Fluent original
├── pages/
│   ├── DashboardPage.tsx          # KPIs y panel de mando
│   ├── CasosPage.tsx             # CRUD de casos
│   ├── CompliancePage.tsx        # Panel de cumplimiento normativo
│   ├── NormativasPage.tsx        # Normativas agrupadas por tipo
│   ├── AuditoriaPage.tsx         # Log de auditoría
│   └── Forense/
│       ├── TutorialesForensesPage.tsx
│       ├── ManualAvillaPage.tsx      # Guía operativa Avilla
│       └── ManualServerlessPage.tsx  # Guía de Neon/Vercel
└── store/
    ├── cmsStore.ts               # Estado CMS (persist)
    └── forenseStore.ts           # Estado forense original
```

### Mapeo de Módulos Avilla → SHA256.US
| Módulo Avilla | Componente SHA256.US | Estado |
|---------------|---------------------|--------|
| Manual Uso Completo | `ManualAvillaPage.tsx` | ✅ Implementado |
| Backup ADB | `FormADB` → `AdbBackupModule` | 🔄 Por crear |
| APK Downgrade | `FormAPK` → `ApkDowngradeModule` | 🔄 Por crear |
| WhatsApp Parser | `WhatsParser` → `WhatsParserModule` | 🔄 Por crear |
| Hash Calculator | `Hash.cs` → `HashCalculatorModule` | ✅ IPC definido |
| Image Finder | `FormMidias` → `ImageFinderModule` | 🔄 Por crear |
| Integridad .avilla | Sistema propio → `IntegrityModule` | 🔄 Por crear |
| iOS Extraction | `FormIOS` → `IosExtractionModule` | 🔄 Por crear |
| IPED Integration | `FormIPED` → `IpedModule` | 🔄 Por crear |
| Decryption WA | `FormDecript` → `DecryptionModule` | 🔄 Por crear |
| Instagram Scraping | `FormRaspagemInstagram` → `InstagramModule` | 🔄 Por crear |

### Rutas y Convenciones Forenses
```
C:\Forensics\bin\                    # Binarios de herramientas
C:\Forensics\backup_extractor\       # Extractor de backups
C:\Avilla-Forensics-Free\down\       # Descarga/instalación
Z:\bin\                              # Drive virtual herramientas
\com.whatsapp\db\msgstore.db         # Base de datos principal WhatsApp
\com.whatsapp\db\wa.db               # Contactos WhatsApp
\com.whatsapp\f\Avatars\             # Avatares/fotos de contacto
```

---

## 📚 Referencias y Recursos

- **Repositorio oficial**: https://github.com/AvillaDaniel/AvillaForensics
- **Proyecto SHA256.US**: https://github.com/julljoll/SHA256.us.git
- **Academia de Forense Digital (AFD)**: https://academiadeforensedigital.com.br
- **Certificación oficial**: https://loja.academiadeforensedigital.com.br
- **LinkedIn autor**: https://www.linkedin.com/in/daniel-a-avilla-0987/
- **Instagram**: https://www.instagram.com/perito_daniel_avilla
- **Contacto**: daniel.avilla@policiacivil.sp.gov.br
- **Award 2023**: https://forensic4cast.com/forensic-4cast-awards/2023-awards/

### Recursos Técnicos
- APK source: https://djangofaiola.blogspot.com/2024/10/happy-3rd-birthday-to-dfapkdngrader.html
- Unix Timestamp: https://www.unixtimestamp.com/
- ADB Docs: https://developer.android.com/tools/adb

### Licencia
GNU General Public License v3.0 (Copyleft © 2025 – Daniel Hubscher Avilla)

---

## 📝 Notas de Desarrollo

> [!IMPORTANT]
> SHA256.US v2.0.0 es ahora un **CMS para Compliance Officer**. La interfaz principal (`/`) muestra el panel de
> cumplimiento. Los módulos forenses operativos están bajo `/forense/...`. El contenido RAG permanece intacto.

> [!TIP]
> Prioridad de módulos pendientes: APK Downgrade → WhatsApp Parser → Integridad de Evidencia → Colectas ADB.
> Para implementar, crear componente en `src/pages/` y registrarlo en `App.tsx` + `CMSLayout.tsx`.

> [!NOTE]
> Los archivos `.avilla` (cifrado AES-256 + HMAC) son el diferenciador clave de Avilla Forensics en términos
> de cadena de custodia. El ManualAvillaPage ya documenta este sistema de validación de autenticidad.
