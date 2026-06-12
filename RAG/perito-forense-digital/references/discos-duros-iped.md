# Análisis de Discos Duros y Computadoras — IPED Digital Forensic Tool

## IPED — Perfil de la Herramienta

**Nombre completo:** IPED — Indexador e Processador de Evidências Digitais  
**Origen:** Policía Federal de Brasil (desde 2012)  
**Licencia:** Open Source (código publicado en 2019)  
**Repositorio oficial:** https://github.com/sepinf-inc/IPED  
**Rendimiento:** hasta 400 GB/hora, soporta hasta 135 millones de elementos  
**Formatos de imagen soportados:** RAW/DD, E01, ISO9660, AFF, VHD, VMDK

---

## CURSO COMPLETO: ANÁLISIS FORENSE CON IPED

### MÓDULO 1 — Instalación y Configuración

**Base Legal:** ISO/IEC 27041 — La herramienta debe estar validada y documentada  
**Objetivo:** Tener IPED operativo y configurado para análisis forense

#### Prerrequisitos del sistema
```
- Java JDK 11 o superior (OBLIGATORIO)
- RAM: mínimo 8 GB (recomendado 16-32 GB)
- CPU: Core i7 o superior, multiprocesador preferible
- Disco: SSD para el caso, HDD para evidencias
- OS: Windows 10/11 o Linux Ubuntu 20.04+
```

#### Instalación en Windows
```
Paso 1: Descargar IPED desde GitHub Releases
  → https://github.com/sepinf-inc/IPED/releases
  → Descargar: IPED-X.X.X-installer.exe o ZIP portable

Paso 2: Instalar Java si no está presente
  → https://adoptium.net/ (Eclipse Temurin, gratuito)
  → Verificar: java -version (debe mostrar 11+)

Paso 3: Extraer IPED en directorio sin espacios
  → Ejemplo: C:\Forense\IPED\ (NO C:\Archivos de Programa\)

Paso 4: Verificar instalación
  → Ejecutar: iped.bat --help
```

#### Instalación en Linux (Ubuntu/Debian)
```bash
# Instalar Java
sudo apt update
sudo apt install openjdk-11-jdk -y

# Descargar IPED
wget https://github.com/sepinf-inc/IPED/releases/latest/download/IPED-Linux.zip
unzip IPED-Linux.zip -d /opt/iped
cd /opt/iped

# Dar permisos de ejecución
chmod +x iped.sh

# Verificar
./iped.sh --help
```

**Documentar en bitácora:**
```
Fecha de instalación: _______________
Versión IPED instalada: _______________
Hash SHA-256 del instalador: _______________
Sistema operativo del laboratorio: _______________
Versión de Java: _______________
```

---

### MÓDULO 2 — Adquisición Forense Previa a IPED

> ⚠️ IPED **analiza** imágenes forenses. La adquisición se hace ANTES con otra herramienta.

#### 2.1 — Adquisición con FTK Imager Lite (Windows)
```
Paso 1: Conectar el disco sospechoso vía Write Blocker
Paso 2: Abrir FTK Imager → File → Create Disk Image
Paso 3: Seleccionar: Physical Drive → elegir el disco
Paso 4: Formato de imagen: E01 (Expert Witness Format)
  - Configurar: Case Number, Evidence Number, Examiner
  - Fragmentar cada 2 GB (recomendado)
Paso 5: Seleccionar destino (disco forense del perito)
Paso 6: ✅ Verificar "Verify images after they are created"
Paso 7: Iniciar — esperar a que termine y confirmar hashes
Paso 8: GUARDAR el reporte de FTK Imager con los hashes
```

#### 2.2 — Adquisición con dd en Linux
```bash
# Identificar el disco (SIN montarlo)
sudo fdisk -l
# Ejemplo: el sospechoso es /dev/sdb

# Calcular hash ANTES
sudo sha256sum /dev/sdb | tee hash_original.txt

# Adquirir con dcfldd (más informativo que dd)
sudo dcfldd if=/dev/sdb of=/mnt/forense/caso001.dd \
  bs=512 \
  hash=sha256 \
  hashlog=/mnt/forense/caso001_hash.log \
  hashconv=after \
  conv=noerror,sync

# Verificar hash de la imagen
sha256sum /mnt/forense/caso001.dd
# Debe coincidir con hash_original.txt
```

---

### MÓDULO 3 — Procesamiento de Evidencia con IPED

**Base Legal:** ISO/IEC 27042 — El análisis debe ser documentado, reproducible y transparente

#### 3.1 — Crear un nuevo caso en IPED
```
Paso 1: Abrir IPED (doble clic en iped.jar o iped.bat)
Paso 2: File → New Case
  - Case Name: "CASO-2024-001-[Descripción]"
  - Case Folder: C:\Forense\Casos\CASO-2024-001\
Paso 3: Add Evidence → Disk Image File
  - Seleccionar el archivo .E01 o .DD adquirido
  - IPED detecta automáticamente el formato
Paso 4: Seleccionar perfil de procesamiento:
  - "forensic" → análisis completo (recomendado)
  - "triage" → análisis rápido en escena
  - "fastmode" → vista previa sin análisis profundo
Paso 5: Iniciar procesamiento → puede tomar horas según tamaño
```

#### 3.2 — Configuración de módulos IPED (ipedConfig.txt)
```
# Módulos clave a activar:
HashDBLookup = true          # Busca en NIST NSRL (archivos conocidos)
PhotoDNA = false             # Solo para fuerzas del orden con licencia
ExifParser = true            # Extrae metadatos EXIF de imágenes
OCR = true                   # Reconocimiento de texto en imágenes (Tesseract)
NamedEntityRecognizer = true # Detecta nombres, IPs, emails automáticamente
VideoThumbsGenerator = true  # Genera miniaturas de videos
WhatsAppParser = true        # Parsea bases de datos WhatsApp
TelegramParser = true        # Parsea Telegram
EmailParser = true           # Parsea archivos .PST, .OST, .EML, .MBOX
```

#### 3.3 — Navegación e Investigación en IPED
```
PANEL IZQUIERDO → Árbol de carpetas y categorías automáticas
  - Deleted Files (archivos borrados recuperados)
  - Carved Files (archivos tallados del espacio libre)
  - Email (correos encontrados)
  - Chat (WhatsApp, Telegram, Skype)
  - Documents (Word, PDF, etc.)
  - Images / Videos
  - Executable Files

BÚSQUEDA → Barra superior
  Ejemplos de búsquedas útiles:
  - "password" → busca en contenido de archivos
  - "*.xlsx" → busca por extensión
  - type:email AND from:@gmail.com
  - created:[2023-01-01 TO 2024-12-31]

FILTROS → Panel derecho
  - Por categoría
  - Por fecha
  - Por tamaño
  - Por hash conocido (NSRL)
```

#### 3.4 — Exportar Evidencias
```
Paso 1: Seleccionar archivos/ítems relevantes (checkbox)
Paso 2: Right click → Export Selected Items
  - Opción "Export with Hash" → genera reporte con SHA-256 de cada archivo
Paso 3: IPED genera:
  - Carpeta con los archivos exportados
  - Archivo de reporte con hashes
  - Timestamps de exportación
Paso 4: Documentar en bitácora de análisis
```

---

### MÓDULO 4 — Análisis de Artefactos Específicos

#### 4.1 — Análisis de Archivos Borrados
```
En IPED → Categoría "Deleted Files"
- Verde: recuperable completo
- Amarillo: recuperable parcialmente
- Rojo: solo entrada en MFT, sin contenido

Verificar:
□ ¿El archivo fue borrado intencionalmente?
□ ¿Cuándo fue borrado (timestamps)?
□ ¿Hay herramientas de borrado seguro instaladas?
□ ¿Existen fragmentos en espacio no asignado?
```

#### 4.2 — Análisis de Registro de Windows (Registry)
```
IPED extrae automáticamente:
- Historial de USB conectados (SYSTEM\CurrentControlSet\Enum\USBSTOR)
- Últimos archivos abiertos (NTUSER.DAT → RecentDocs)
- Programas instalados/desinstalados
- Cuentas de usuario y última vez usadas
- Historial de red WiFi
- Prefetch (últimos 128 programas ejecutados)
```

#### 4.3 — Análisis del Historial de Navegación
```
IPED categoriza automáticamente:
- Chrome: History (SQLite), Cache, Cookies, Downloads
- Firefox: places.sqlite, moz_historyvisits
- Edge: Similar a Chrome

Datos extraídos:
- URLs visitadas + timestamps
- Búsquedas realizadas
- Archivos descargados
- Datos de formularios
```

---

### MÓDULO 5 — Generación del Reporte

```
En IPED → File → Generate Report
  Opciones:
  - HTML Report (recomendado para tribunal)
  - PDF Report
  - CSV Export

El reporte incluye automáticamente:
  - Hash del caso
  - Metadatos de la imagen forense analizada
  - Estadísticas del procesamiento
  - Todos los ítems seleccionados/marcados
  - Timestamps de análisis

Documentar externamente:
  □ Hash SHA-256 del reporte generado
  □ Fecha y hora de generación
  □ Versión de IPED usada
  □ Nombre del perito actuante
```

---

## Comandos de Referencia Rápida

```bash
# Calcular hash SHA-256 de imagen forense
sha256sum imagen.E01

# Montar imagen E01 en Linux (solo lectura)
sudo mount -o ro,loop imagen.dd /mnt/evidencia

# Listar información del disco con The Sleuth Kit
img_stat imagen.E01
fsstat imagen.E01

# Procesar IPED por línea de comandos
java -jar iped.jar -d /ruta/imagen.E01 -o /ruta/caso/

# Ver logs de procesamiento IPED
tail -f /ruta/caso/iped.log
```
