# CURSO COMPLETO: Análisis Forense de WhatsApp en Android con Kali Linux
## SIN ROOT — Válido para Prueba Judicial en Venezuela

**Nivel:** Profesional Avanzado  
**Duración estimada:** 6-8 horas  
**Distribución:** Kali Linux 2024+ (Rolling Release)  
**Herramientas:** ADB, WHAPA, Andriller, SQLite Browser, IPED, ExifTool  
**Marco Legal:** Art. 187 y 225 COPP · Manual Único de Cadena de Custodia 2017 · ISO/IEC 27037:2012 · ISO/IEC 27042  

---

## CASO FICTICIO DIDÁCTICO

**Caso N° KL-2024-001 — "Operación Pantalla Rota"**

La ciudadana **María González Pérez** (C.I. V-12.345.678) presenta denuncia ante el Ministerio Público por presunta extorsión. Señala haber recibido mensajes amenazantes a través de WhatsApp desde el número **+58-414-9876543** entre el 01 y el 15 de octubre de 2024, exigiéndole la suma de Bs. 50.000. El teléfono del presunto autor, un **Samsung Galaxy A23 (SM-A235F)**, IMEI: **358744110123456**, fue incautado mediante allanamiento debidamente acordado. El dispositivo NO tiene root activado. Pantalla desbloqueada (PIN conocido por el imputado).

---

## MÓDULO 1: PREPARACIÓN DEL ENTORNO FORENSE

### 1.1 Fundamento Legal
> **Art. 187 COPP:** "Todo funcionario o empleado público que deba intervenir en la cadena de custodia, o que tenga conocimiento de ella, está obligado a cumplir con los procedimientos establecidos en las normas y reglamentos respectivos, bajo pena de las sanciones administrativas, disciplinarias, civiles y penales que correspondan."

> **ISO/IEC 27037:2012, Sección 7.1:** Los dispositivos digitales potenciales deben ser identificados, documentados y preservados antes de cualquier acción técnica.

### 1.2 Preparación de la Estación de Trabajo Forense en Kali Linux

```bash
# Actualizar Kali Linux al estado más reciente
sudo apt update && sudo apt upgrade -y

# Instalar herramientas esenciales
sudo apt install -y adb android-tools-adb sqlite3 sqlitebrowser python3 python3-pip git

# Verificar versión de ADB instalada
adb version
# Resultado esperado: Android Debug Bridge version 1.0.41+

# Crear estructura de carpetas del caso
export CASO="KL-2024-001"
sudo mkdir -p /casos/${CASO}/{evidencias,adquisicion,analisis,informes,hashes}
sudo chmod 700 /casos/${CASO}/
echo "Estructura creada: /casos/${CASO}/"
```

### 1.3 Instalar WHAPA (WhatsApp Parser Toolset)

```bash
# Clonar repositorio oficial de WHAPA
cd /opt/
sudo git clone https://github.com/B16f00t/whapa.git
cd whapa/

# Instalar dependencias Python
sudo pip3 install -r requirements.txt --break-system-packages

# Verificar instalación
python3 whapa.py --help
# Resultado esperado: menú de ayuda de WHAPA

echo "[OK] WHAPA instalado correctamente"
```

### 1.4 Instalar Andriller (extracción sin root)

```bash
cd /opt/
sudo git clone https://github.com/den4uk/andriller.git
cd andriller/
sudo pip3 install -r requirements.txt --break-system-packages

# Prueba de la instalación
python3 andriller.py --help
echo "[OK] Andriller instalado correctamente"
```

### 📋 Documentar en Cadena de Custodia — Paso 1:
```
Fecha/hora inicio: [AAAA-MM-DD HH:MM:SS VET GMT-4]
Perito actuante: [Nombre completo + credenciales]
Estación forense: [ID del equipo + SO + versiones de herramientas]
Número de caso: KL-2024-001
```

---

## MÓDULO 2: RECEPCIÓN Y DOCUMENTACIÓN DE LA EVIDENCIA

### 2.1 Fundamento Legal
> **Manual Único de Cadena de Custodia, Sección 5.1.1:** El registro de cadena de custodia debe incluir: número de registro, número de expediente, tipo de delito, tipo de evidencia, descripción de la evidencia, cantidad y estado del embalaje.

### 2.2 Fotografiar y Documentar el Dispositivo

Antes de conectar el teléfono, documentar:

```
FORMULARIO DE RECEPCIÓN DE EVIDENCIA DIGITAL
============================================
Caso N°: KL-2024-001
Fecha/Hora de Recepción: 2024-10-20 09:15:00 VET
Recibido de: Fiscal 5° del Ministerio Público del Área Metropolitana

DESCRIPCIÓN DE LA EVIDENCIA:
Tipo: Teléfono inteligente (Smartphone)
Marca: Samsung
Modelo: Galaxy A23
Referencia comercial: SM-A235F
Color: Negro
IMEI: 358744110123456 (verificar en *#06#)
N° de Serie: R9ANA0ABCDE
Sistema Operativo: Android 13 (One UI 5.1)
Versión Security Patch: 2024-09-01
Estado pantalla: Encendida / Desbloqueada
Estado batería: 67%
SIM presente: Sí / Sím: +58-414-XXXXXXXX (verificar)

ESTADO DEL EMBALAJE AL RECIBIR:
Precinto N°: VEN-2024-001-A
Integridad: Íntegro / Sin daños visibles
Firma del funcionario que entrega: _______________
Firma del perito que recibe: _______________

HASH PRECINTADO (si aplica): N/A
```

### 2.3 Calcular Hash de la Evidencia Inicial

```bash
# Con el teléfono AÚN EMBALADO, fotografiar antes de abrir
# Al abrir: documentar hora exacta y estado

# Una vez conectado, calcular hash del almacenamiento accesible
# (En Android sin root, solo podemos hashear lo que ADB puede ver)
echo "Inicio documentación: $(date '+%Y-%m-%d %H:%M:%S')" | tee /casos/${CASO}/hashes/log_inicio.txt
```

---

## MÓDULO 3: ACTIVAR DEPURACIÓN USB EN EL DISPOSITIVO

### 3.1 Consideraciones Legales Importantes
> ⚠️ **ADVERTENCIA LEGAL:** La activación de la depuración USB en el dispositivo del imputado puede argumentarse que modifica el estado del dispositivo. Para minimizar el impacto, fotografiar y documentar CADA paso. En Venezuela, el Art. 225 COPP ampara la actuación del perito siguiendo "los principios o reglas de su ciencia", lo que incluye la metodología forense estándar.

### 3.2 Pasos para Activar Depuración USB (con fotografía en cada paso)

```
PASO A: Ir a Ajustes (Settings) del teléfono
PASO B: Acerca del teléfono (About phone)
PASO C: Tocar "Número de compilación" (Build number) 7 veces
         → El teléfono mostrará: "Ahora eres un desarrollador"
PASO D: Volver a Ajustes → Opciones de desarrollador (Developer options)
PASO E: Activar "Depuración USB" (USB debugging)
PASO F: Conectar cable USB a la estación forense

📸 FOTOGRAFIAR: cada pantalla durante el proceso
📋 DOCUMENTAR: hora exacta de cada acción en el log de cadena de custodia
```

### 3.3 Verificar Conexión ADB

```bash
# Verificar que Kali Linux detecta el dispositivo
adb devices

# Resultado esperado:
# List of devices attached
# R9ANA0ABCDE    device
#
# Si aparece "unauthorized": desbloquear el teléfono y aceptar el cuadro de diálogo

# Si aparece "offline": 
adb kill-server && adb start-server && adb devices

# Obtener información completa del dispositivo (para el informe)
adb shell getprop ro.product.model | tee -a /casos/${CASO}/hashes/info_dispositivo.txt
adb shell getprop ro.product.manufacturer >> /casos/${CASO}/hashes/info_dispositivo.txt
adb shell getprop ro.build.version.release >> /casos/${CASO}/hashes/info_dispositivo.txt
adb shell getprop ro.build.version.security_patch >> /casos/${CASO}/hashes/info_dispositivo.txt
adb shell settings get secure android_id >> /casos/${CASO}/hashes/info_dispositivo.txt

echo "Información del dispositivo registrada"
cat /casos/${CASO}/hashes/info_dispositivo.txt
```

---

## MÓDULO 4: EXTRACCIÓN DE DATOS WHATSAPP SIN ROOT

### 4.1 Fundamento Técnico — Limitaciones sin Root

En Android 9+ sin root, el acceso a `/data/data/com.whatsapp/` está bloqueado por SELinux.
Los métodos válidos sin root son:

| Método | Funciona en Android | Obtiene | Legal |
|---|---|---|---|
| ADB Backup (legacy) | ≤ Android 6 | msgstore.db + key | Sí |
| Google Drive Backup | Todas | Backup encriptado | Sí (con colaboración) |
| Almacenamiento externo `/sdcard` | Todas | Backups crypt12-15 | Sí |
| APK Downgrade + extracción | Android ≤ 12 | Clave + DB | Sí (metod. doc.) |
| Andriller extracción | Android ≤ 10 | Backup .ab | Sí |

### 4.2 Método Principal: Extracción del Backup desde /sdcard

```bash
# WhatsApp guarda backups automáticos en almacenamiento externo (accesible sin root)
# Listar los backups disponibles
adb shell ls -la /sdcard/WhatsApp/Databases/ | tee /casos/${CASO}/adquisicion/lista_backups.txt

# Resultado típico:
# -rw-rw---- 1 u0_a123 media_rw 45234567 2024-10-15 03:00:05 msgstore.db.crypt15
# -rw-rw---- 1 u0_a123 media_rw 44123456 2024-10-08 03:00:01 msgstore-2024-10-08.1.db.crypt15

# Extraer TODOS los archivos de la carpeta Databases
adb pull /sdcard/WhatsApp/Databases/ /casos/${CASO}/adquisicion/databases/

# Extraer archivos multimedia de WhatsApp
adb pull /sdcard/WhatsApp/Media/ /casos/${CASO}/adquisicion/media/

# También extraer la carpeta completa de WhatsApp
adb pull /sdcard/Android/media/com.whatsapp/ /casos/${CASO}/adquisicion/whatsapp_android_media/ 2>/dev/null

echo "Extracción de /sdcard completada"
```

### 4.3 Calcular Hash de Todo lo Extraído

```bash
# Calcular hash SHA-256 de todo lo extraído (OBLIGATORIO para cadena de custodia)
cd /casos/${CASO}/adquisicion/

find . -type f | sort | while read f; do
  sha256sum "$f" >> /casos/${CASO}/hashes/hashes_adquisicion_SHA256.txt
  md5sum "$f" >> /casos/${CASO}/hashes/hashes_adquisicion_MD5.txt
done

echo "Hashes calculados:"
wc -l /casos/${CASO}/hashes/hashes_adquisicion_SHA256.txt
cat /casos/${CASO}/hashes/hashes_adquisicion_SHA256.txt
```

### 4.4 Método Alternativo: Andriller (para backups ADB en Android ≤ 10)

```bash
cd /opt/andriller/

# Lanzar interfaz gráfica de Andriller
python3 andriller.py

# En la interfaz:
# 1. Seleccionar "Backup (ADB)" como método de extracción
# 2. Directorio de salida: /casos/KL-2024-001/adquisicion/andriller/
# 3. Click "Extract"
# Andriller genera un archivo .ab y lo desempaqueta automáticamente
# También intenta extraer y descifrar bases de datos de apps conocidas

# Alternativamente, desde línea de comandos:
python3 andriller.py --backup --output /casos/${CASO}/adquisicion/andriller/
```

---

## MÓDULO 5: DESCIFRADO DE LA BASE DE DATOS WHATSAPP

### 5.1 Identificar el Formato de Cifrado

```bash
# Verificar versión del cifrado del archivo extraído
ls -la /casos/${CASO}/adquisicion/databases/
file /casos/${CASO}/adquisicion/databases/msgstore.db.crypt15

# Los formatos son: crypt12, crypt14, crypt15
# crypt15 es el más reciente (2023+)
```

### 5.2 Obtener la Clave de Descifrado (sin root — método backup)

```bash
# WhatsApp almacena la clave en /data/data/com.whatsapp/files/key
# Sin root, hay dos caminos:

# OPCIÓN A: Si el dispositivo tiene Android ≤ 9 y backup ADB habilitado
adb backup -noapk com.whatsapp

# Extraer el key del backup
( printf "\x1f\x8b\x08\x00\x00\x00\x00\x00" ; tail -c +25 backup.ab ) | zcat | tar xvf - -C /casos/${CASO}/adquisicion/backup_extraido/ 2>/dev/null

# Buscar el archivo key
find /casos/${CASO}/adquisicion/backup_extraido/ -name "key" -o -name "*.key" 2>/dev/null

# OPCIÓN B: Usar la clave de backup E2E (si el usuario la habilitó)
# El propietario del dispositivo puede proporcionar la clave de 64 caracteres hexadecimales
# generada cuando activó "Backup cifrado de extremo a extremo"
# Documentar esta obtención en acta firmada

# OPCIÓN C: Google Drive Backup (con colaboración del propietario/orden judicial)
# Descargar backup desde Google Drive y obtener metadata de clave
```

### 5.3 Descifrar con wa-crypt-tools

```bash
# Instalar wa-crypt-tools (herramienta open source de descifrado)
pip3 install wa-crypt-tools --break-system-packages

# Descifrar la base de datos
decrypt15 \
  /casos/${CASO}/adquisicion/databases/msgstore.db.crypt15 \
  /casos/${CASO}/adquisicion/databases/msgstore.db \
  --keyfile /casos/${CASO}/adquisicion/backup_extraido/apps/com.whatsapp/f/key

# Verificar que el descifrado fue exitoso
file /casos/${CASO}/adquisicion/databases/msgstore.db
# Resultado esperado: SQLite 3.x database

# Calcular hash de la DB descifrada (evidencia de integridad)
sha256sum /casos/${CASO}/adquisicion/databases/msgstore.db | tee -a /casos/${CASO}/hashes/hashes_adquisicion_SHA256.txt
echo "DB descifrada y hash registrado"
```

---

## MÓDULO 6: ANÁLISIS CON WHAPA

### 6.1 Análisis de Mensajes con WHAPA

```bash
cd /opt/whapa/

# Análisis básico de la base de datos de mensajes
python3 whapa.py \
  -m /casos/${CASO}/adquisicion/databases/msgstore.db \
  -w /casos/${CASO}/adquisicion/databases/wa.db \
  -o /casos/${CASO}/analisis/whapa_resultado/

# Analizar contactos
python3 whapa.py \
  -c /casos/${CASO}/adquisicion/databases/wa.db \
  -o /casos/${CASO}/analisis/whapa_contactos/

# Generar reporte HTML de las conversaciones
python3 whapa.py \
  -m /casos/${CASO}/adquisicion/databases/msgstore.db \
  -w /casos/${CASO}/adquisicion/databases/wa.db \
  --report html \
  -o /casos/${CASO}/analisis/reporte_whapa/

echo "Análisis WHAPA completado. Reporte en: /casos/${CASO}/analisis/reporte_whapa/"
```

### 6.2 Análisis Manual con SQLite Browser

```bash
# Abrir la DB descifrada con SQLite Browser (GUI)
sqlitebrowser /casos/${CASO}/adquisicion/databases/msgstore.db &

# Para el caso KL-2024-001, ejecutar estas consultas SQL:

# CONSULTA 1: Todos los mensajes del número sospechoso
# En SQLite Browser → Execute SQL:
SELECT 
  datetime(timestamp/1000, 'unixepoch', 'localtime') AS fecha_hora_ven,
  from_me,
  key_remote_jid AS numero_remoto,
  data AS contenido_mensaje,
  media_url,
  status
FROM messages 
WHERE key_remote_jid LIKE '%5804149876543%'
ORDER BY timestamp ASC;

# CONSULTA 2: Mensajes en el rango de fechas del caso (01-15/10/2024)
SELECT 
  datetime(timestamp/1000, 'unixepoch') AS fecha_UTC,
  datetime(timestamp/1000, 'unixepoch', '-4 hours') AS fecha_Venezuela,
  data AS mensaje,
  from_me AS "0=recibido 1=enviado",
  status
FROM messages
WHERE timestamp BETWEEN 1727740800000 AND 1728950400000
ORDER BY timestamp ASC;

# CONSULTA 3: Mensajes eliminados (pueden aparecer con data NULL)
SELECT 
  datetime(timestamp/1000, 'unixepoch', '-4 hours') AS fecha_VEN,
  key_remote_jid,
  data,
  media_mime_type
FROM messages
WHERE data IS NULL OR data = ''
ORDER BY timestamp ASC;
```

### 6.3 Análisis con IPED (integración final)

```bash
# Procesar TODO el material extraído con IPED para análisis consolidado
java -jar /opt/iped/iped.jar \
  -d /casos/${CASO}/adquisicion/ \
  -o /casos/${CASO}/analisis/iped_completo/ \
  -profile forensic

# Una vez procesado, abrir interfaz IPED
java -jar /opt/iped/iped-search-app.jar /casos/${CASO}/analisis/iped_completo/

# En IPED buscar: type:WhatsApp
# Filtrar por fechas del caso: 2024-10-01 TO 2024-10-15
# Exportar conversaciones relevantes para el informe
```

---

## MÓDULO 7: ANÁLISIS DE METADATOS MULTIMEDIA

```bash
# Analizar metadatos de imágenes enviadas/recibidas por WhatsApp
# (pueden revelar ubicación, dispositivo, fecha real de captura)

find /casos/${CASO}/adquisicion/media/ -name "*.jpg" -o -name "*.jpeg" | while read img; do
  echo "=== Analizando: $img ===" >> /casos/${CASO}/analisis/metadatos_imagenes.txt
  exiftool "$img" >> /casos/${CASO}/analisis/metadatos_imagenes.txt
  echo "" >> /casos/${CASO}/analisis/metadatos_imagenes.txt
done

echo "Análisis de metadatos completado"
grep -i "GPS\|Location\|DateTimeOriginal\|Make\|Model" /casos/${CASO}/analisis/metadatos_imagenes.txt
```

---

## MÓDULO 8: GENERACIÓN DEL INFORME PERICIAL

### 8.1 Estructura del Informe para el Caso KL-2024-001

```markdown
REPÚBLICA BOLIVARIANA DE VENEZUELA
MINISTERIO PÚBLICO — FISCALÍA 5ª DEL ÁREA METROPOLITANA
EXPERTICIA TÉCNICA EN INFORMÁTICA FORENSE N° KL-2024-001

CASO: EXTORSIÓN (Art. 16 LECDI / Art. 459 CP)
IMPUTADO: [Nombre] / C.I.: [número]
VÍCTIMA: María González Pérez / C.I.: V-12.345.678

I. IDENTIFICACIÓN DEL PERITO
[Nombre, títulos, colegiatura, correo institucional]

II. OBJETO DE LA EXPERTICIA
Determinar si el dispositivo móvil Samsung Galaxy A23 (IMEI: 358744110123456)
contiene conversaciones de WhatsApp que evidencien la comisión del delito de
extorsión en perjuicio de la ciudadana María González Pérez, entre el 01 y el 
15 de octubre de 2024.

III. EVIDENCIAS ANALIZADAS
[Tabla con descripción, N° cadena de custodia, hash SHA-256]

IV. METODOLOGÍA
Herramientas utilizadas:
- Kali Linux 2024.3 (SO de la estación forense)
- ADB v1.0.41+ (extracción lógica)
- WHAPA v1.59 (análisis de bases de datos WhatsApp)
- wa-crypt-tools (descifrado de msgstore.db.crypt15)
- SQLite Browser 3.12 (consultas SQL directas)
- IPED 4.2 (indexación y análisis consolidado)
- ExifTool 12.70 (metadatos multimedia)

Normas técnicas aplicadas: ISO/IEC 27037:2012, ISO/IEC 27042

V. VERIFICACIÓN DE INTEGRIDAD
[Tabla con hashes SHA-256 antes y después del análisis]

VI. HALLAZGOS TÉCNICOS
[Transcripción de conversaciones relevantes con timestamps UTC y VET]
[Capturas de pantalla numeradas de WHAPA/IPED]

VII. CONCLUSIONES
1. El dispositivo contiene [N] conversaciones de WhatsApp con el número [+58...]
2. Entre el 01/10/2024 y el 15/10/2024 se registraron [N] mensajes con contenido
   que corresponde a la descripción del delito de extorsión...
3. Se identificaron [N] imágenes con metadatos de GPS correspondientes a...
4. No se detectaron modificaciones en la base de datos msgstore.db...

VIII. JURAMENTO
[Texto legal de juramento del perito]
```

---

## MÓDULO 9: ERRORES CRÍTICOS Y CONSECUENCIAS LEGALES

| Error Técnico | Consecuencia Legal |
|---|---|
| Trabajar sobre el .crypt15 original | Si se corrompe, pierde la evidencia |
| No registrar hash antes de descifrar | Defensa puede alegar modificación |
| Confundir zona horaria (UTC vs VET) | Error en la línea temporal del hecho |
| No documentar cada comando ejecutado | El método no es reproducible, impugnable |
| Analizar solo mensajes recientes | Se pierde contexto importante |
| No verificar hash post-análisis | No se puede demostrar integridad final |

## GLOSARIO LEGAL-TÉCNICO

| Término | Definición |
|---|---|
| ADB | Android Debug Bridge: protocolo de comunicación con Android |
| crypt15 | Formato de cifrado actual de backups WhatsApp (AES-256-GCM) |
| msgstore.db | Base de datos SQLite que contiene todos los mensajes WhatsApp |
| wa.db | Base de datos de contactos WhatsApp |
| Timestamp | Marca de tiempo en milisegundos desde el epoch Unix (01/01/1970) |
| VET | Venezuela Time: UTC-4 (sin ajuste de horario de verano) |
| Hash SHA-256 | Huella digital criptográfica de 256 bits que garantiza integridad |
| from_me | Campo en msgstore.db: 0=recibido, 1=enviado |
