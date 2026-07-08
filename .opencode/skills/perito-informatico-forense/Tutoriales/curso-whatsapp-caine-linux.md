# CURSO COMPLETO: Análisis Forense de WhatsApp en Android con CAINE Linux
## SIN ROOT — Válido para Prueba Judicial en Venezuela

**Nivel:** Profesional Avanzado  
**Duración estimada:** 6-8 horas  
**Distribución:** CAINE Linux 13+ (Computer Aided INvestigative Environment)  
**Ventaja vs Kali:** CAINE monta todos los discos en MODO SOLO LECTURA por defecto (write blocker automático por software)  
**Herramientas:** ADB, Autopsy, IPED, Guymager, RegRipper, ExifTool, SQLite Browser  
**Marco Legal:** Art. 187 y 225 COPP · Manual Único de Cadena de Custodia 2017 · ISO/IEC 27037:2012  

---

## ¿POR QUÉ CAINE ES DIFERENTE A KALI PARA PERITAJE?

CAINE (Computer Aided INvestigative Environment) fue diseñada **exclusivamente para forensia**. Sus ventajas sobre Kali Linux en el contexto judicial venezolano:

| Característica | CAINE Linux | Kali Linux |
|---|---|---|
| Montaje automático | BLOQUEADO (solo lectura por defecto) | Lectura/escritura (riesgo) |
| Propósito | 100% Forense | Pentesting + Forense |
| Incluye | Autopsy, Guymager, RegRipper | Herramientas de ataque + forenses |
| Aceptación en tribunal | Alta (entorno forense reconocido) | Media (percibido como hacking) |
| Deja rastros en evidencia | Mínimos por diseño | Posible si no se configura |
| Certeza ISO 27037 | Nativa | Requiere configuración manual |

---

## CASO FICTICIO DIDÁCTICO

**Caso N° CA-2024-002 — "Operación Mensaje Oscuro"**

El ciudadano **Carlos Medina Torres** (C.I. V-9.876.543) fue detenido in fraganti por funcionarios del CICPC con un **Motorola Moto G54 5G**, IMEI: **352897110456789**, en el que se presume existe evidencia de participación en asociación para delinquir (Art. 37 LOOT) mediante coordinación por WhatsApp. El dispositivo tiene Android 13, pantalla BLOQUEADA (PIN desconocido pero con huella dactilar parcialmente activa), y NO tiene root.

---

## MÓDULO 1: ARRANQUE DE CAINE Y PREPARACIÓN

### 1.1 Arrancar CAINE desde USB/DVD

```bash
# CAINE se arranca desde USB booteable (8GB mínimo)
# Descargar desde: https://www.caine-live.net/

# Al arrancar CAINE:
# 1. Seleccionar "Start CAINE" en el menú GRUB
# 2. CAINE automáticamente BLOQUEA la escritura en todos los discos detectados
# 3. Aparecerá el escritorio con MOUNTER (herramienta de montaje seguro)

# Verificar que los dispositivos están en modo solo lectura
# Abrir terminal y ejecutar:
lsblk -o NAME,SIZE,RO,FSTYPE,MOUNTPOINT
# RO=1 significa "Read Only" = correcto para evidencias
```

### 1.2 Configurar la Estación de Trabajo

```bash
# CAINE ya tiene ADB instalado. Verificar:
adb version

# Si necesita actualización:
sudo apt update && sudo apt install android-tools-adb -y

# Instalar herramientas adicionales para WhatsApp
sudo apt install sqlite3 sqlitebrowser python3-pip -y
sudo pip3 install wa-crypt-tools --break-system-packages

# Instalar WHAPA
cd /opt/
sudo git clone https://github.com/B16f00t/whapa.git
cd whapa/ && sudo pip3 install -r requirements.txt --break-system-packages

# Crear estructura del caso
export CASO="CA-2024-002"
sudo mkdir -p /casos/${CASO}/{evidencias,adquisicion,analisis,informes,hashes,logs}
```

### 1.3 Configurar el Log Automático de Comandos

```bash
# CRÍTICO: En peritaje profesional, TODOS los comandos deben quedar registrados
# CAINE permite esto con el script de logging

# Iniciar sesión con log automático
script -a /casos/${CASO}/logs/sesion_pericial_$(date '+%Y%m%d_%H%M%S').log
echo "LOG INICIADO: $(date '+%Y-%m-%d %H:%M:%S VET')"
echo "Perito: [NOMBRE DEL PERITO]"
echo "Caso: CA-2024-002"
# Todo comando ejecutado desde aquí quedará grabado en el log
# Al terminar: exit (para cerrar el log)
```

### 📋 Documentar en Cadena de Custodia — Inicio:
```
Fecha/hora inicio sesión pericial: $(date '+%Y-%m-%d %H:%M:%S')
Versión CAINE: 13.0
Hash del USB de arranque CAINE: [SHA-256 del ISO verificado]
Perito: [Nombre + credenciales]
```

---

## MÓDULO 2: RECEPCIÓN DE EVIDENCIA Y DOCUMENTACIÓN CON GUYMAGER

### 2.1 Documento de Recepción

```
FORMULARIO DE RECEPCIÓN DE EVIDENCIA — CASO CA-2024-002
==========================================================
Dispositivo: Motorola Moto G54 5G
IMEI: 352897110456789 
N° Cadena de Custodia: CICPC-2024-02-456
Estado al recibir: Pantalla bloqueada / Batería 45%
Precinto N°: VEN-CICPC-2024-456-B
Firma entrega/recepción: _______________
```

### 2.2 Fotografía Forense del Dispositivo

CAINE incluye **digiCamControl** y herramientas de fotografía forense:
```
Fotografiar (con escala métrica forense visible):
□ Vista frontal del dispositivo apagado
□ Vista posterior (IMEI impreso si visible)
□ Ambos lados (puertos, botones)
□ Estado de pantalla (bloqueada)
□ Embalaje original completo antes de abrir
□ Precinto con número visible
□ Después de quitar embalaje
```

---

## MÓDULO 3: MANEJO DE PANTALLA BLOQUEADA

### 3.1 Opciones Legales para Pantalla Bloqueada

> ⚠️ **NOTA LEGAL:** La extracción de datos de un dispositivo bloqueado requiere:
> - Orden judicial expresa (Art. 196 COPP)
> - O colaboración voluntaria del propietario (Art. 133 COPP)
> - Documentar el método usado en el informe pericial

```bash
# OPCIÓN 1: Verificar si ADB está habilitado desde antes del bloqueo
# (Si la depuración USB ya estaba activa, puede funcionar aún bloqueado)
adb devices
# Si aparece el dispositivo: proceder al Módulo 4

# OPCIÓN 2: Android Vulnerability Assessment
# Verificar versión de Android para métodos conocidos
adb shell getprop ro.build.version.release 2>/dev/null

# OPCIÓN 3: Solicitar al Ministerio Público oficiar al fabricante
# Motorola/Google tienen procedimientos de Law Enforcement para acceso

# OPCIÓN 4: Esperar a que el dispositivo se desbloquee con huella dactilar
# (documentar la oportunidad legal de hacerlo)

# Para este ejercicio: asumiremos que se obtiene colaboración judicial
# y el dispositivo queda desbloqueado
```

### 3.2 Habilitar Depuración USB (dispositivo desbloqueado)

```bash
# Seguir el mismo proceso que en el Curso Kali Linux (Módulo 3)
# En CAINE el proceso es idéntico al nivel del dispositivo Android

adb devices
# Verificar que aparece: [serial]    device

# Obtener información completa del dispositivo
adb shell getprop | grep -E "ro.product|ro.build.version" | tee /casos/${CASO}/logs/info_dispositivo.txt
```

---

## MÓDULO 4: EXTRACCIÓN FORENSE CON CAINE

### 4.1 Extracción de WhatsApp desde /sdcard (sin root)

```bash
# Extraer bases de datos WhatsApp
adb pull /sdcard/WhatsApp/Databases/ /casos/${CASO}/adquisicion/databases/
echo "Exit code: $?" | tee -a /casos/${CASO}/logs/sesion_pericial_*.log

# Extraer multimedia
adb pull /sdcard/WhatsApp/Media/ /casos/${CASO}/adquisicion/media/

# Extraer directorio Android/media si existe
adb pull /sdcard/Android/media/com.whatsapp/ /casos/${CASO}/adquisicion/android_media/ 2>/dev/null

# Calcular hash de TODO lo extraído
cd /casos/${CASO}/adquisicion/
find . -type f -exec sha256sum {} \; | sort > /casos/${CASO}/hashes/SHA256_post_extraccion.txt
echo "Total archivos extraídos: $(wc -l < /casos/${CASO}/hashes/SHA256_post_extraccion.txt)"
```

### 4.2 Backup Completo del Dispositivo con ADB

```bash
# Backup completo del dispositivo (para preservación máxima)
adb backup \
  -all \
  -shared \
  -apk \
  -f /casos/${CASO}/adquisicion/backup_completo_$(date '+%Y%m%d_%H%M%S').ab

echo "Backup creado. Verificando..."
ls -la /casos/${CASO}/adquisicion/*.ab

# Calcular hash del backup
sha256sum /casos/${CASO}/adquisicion/*.ab | tee -a /casos/${CASO}/hashes/SHA256_post_extraccion.txt
```

### 4.3 Usar Autopsy (incluido en CAINE) para Análisis Mobile

```bash
# CAINE incluye Autopsy 4.21+ con módulos Android
# Lanzar Autopsy
autopsy &

# En Autopsy:
# 1. New Case → Nombre: "CA-2024-002" → Examiner: [nombre perito]
# 2. Add Data Source → "Logical Files"
# 3. Navegar a: /casos/CA-2024-002/adquisicion/
# 4. Módulos a activar:
#    □ Android Analyzer (detecta automáticamente WhatsApp, SMS, contactos)
#    □ Hash Lookup (verificar contra NSRL)
#    □ File Type Identification
#    □ Keyword Search → agregar términos del caso
#    □ Recent Activity
# 5. Finish → Autopsy procesa automáticamente

# Android Analyzer extrae:
# - Contactos
# - SMS/MMS
# - Llamadas
# - GPS/Ubicaciones
# - WhatsApp (si detecta las DBs)
# - Instalaciones de apps
```

---

## MÓDULO 5: ANÁLISIS DE BASE DE DATOS EN CAINE

### 5.1 Descifrado con wa-crypt-tools

```bash
# Verificar formato del backup
file /casos/${CASO}/adquisicion/databases/*.crypt*

# Para crypt15 (más común en 2024):
decrypt15 \
  /casos/${CASO}/adquisicion/databases/msgstore.db.crypt15 \
  /casos/${CASO}/adquisicion/databases/msgstore_descifrada.db \
  --keyfile /[ruta]/key

# Alternativa: si se tiene el backup ADB
# Extraer key del backup .ab usando python-abx
pip3 install python-abx --break-system-packages
python3 -c "
import abx
backup = abx.open('/casos/${CASO}/adquisicion/backup_completo.ab', 'r')
key = backup.read('apps/com.whatsapp/f/key')
open('/casos/${CASO}/adquisicion/databases/whatsapp.key', 'wb').write(key)
print('Key extraída exitosamente')
"
```

### 5.2 Análisis con CAINE's SQLite Browser

```bash
# SQLite Browser viene preinstalado en CAINE
sqlitebrowser /casos/${CASO}/adquisicion/databases/msgstore_descifrada.db &

# Consultas SQL clave para el Caso CA-2024-002
# (buscar coordinación de asociación para delinquir)

# CONSULTA 1: Grupos de WhatsApp (coordinación múltiple personas)
SELECT 
  jid AS grupo_jid,
  subject AS nombre_grupo,
  datetime(creation/1000, 'unixepoch', '-4 hours') AS fecha_creacion_VEN,
  creator AS quien_creo
FROM chat_list
WHERE jid LIKE '%@g.us'
ORDER BY creation DESC;

# CONSULTA 2: Mensajes del tipo broadcast/grupo con términos relevantes
SELECT 
  datetime(timestamp/1000, 'unixepoch', '-4 hours') AS fecha_VEN,
  key_remote_jid AS jid_origen,
  key_from_me AS es_enviado,
  data AS mensaje_texto
FROM messages
WHERE data LIKE '%reunión%' 
   OR data LIKE '%punto%' 
   OR data LIKE '%operacion%'
ORDER BY timestamp;

# CONSULTA 3: Llamadas realizadas/recibidas
SELECT 
  datetime(timestamp/1000, 'unixepoch', '-4 hours') AS fecha_VEN,
  from_me AS "1=saliente 0=entrante",
  duration,
  call_result,
  jid AS contacto
FROM call_log
ORDER BY timestamp;
```

### 5.3 Análisis con IPED en CAINE

```bash
# IPED puede instalarse en CAINE para análisis avanzado
# Si no está preinstalado:
wget https://github.com/sepinf-inc/IPED/releases/download/[VERSION]/IPED-[VERSION].zip -P /opt/
unzip /opt/IPED-*.zip -d /opt/iped/

# Procesar la extracción completa
java -jar /opt/iped/iped.jar \
  -d /casos/${CASO}/adquisicion/ \
  -o /casos/${CASO}/analisis/iped_resultado/ \
  -profile forensic

# Abrir interfaz de análisis
java -jar /opt/iped/iped-search-app.jar /casos/${CASO}/analisis/iped_resultado/

# En IPED: filtrar type:WhatsApp
# Buscar contactos clave del caso
# Exportar conversaciones para informe
```

---

## MÓDULO 6: ANÁLISIS DIFERENCIAL — COMPARACIÓN CON CAINE vs KALI

| Acción | En CAINE | En Kali Linux |
|---|---|---|
| Conectar disco externo | Auto-mounted solo lectura ✓ | Requiere configuración manual |
| ADB backup | Disponible | Disponible |
| Autopsy | Preinstalado ✓ | Requiere instalación |
| Guymager | Preinstalado ✓ | Requiere instalación |
| WHAPA | Requiere instalación | Requiere instalación |
| Log de comandos | Herramienta integrada | Script manual |
| Presunción forense en tribunal | Alta ✓ | Media |

---

## MÓDULO 7: CADENA DE CUSTODIA DIGITAL EN CAINE

### 7.1 Generar el Reporte Forense Final de CAINE

```bash
# Calcular hash final de TODOS los archivos del caso
find /casos/${CASO}/ -type f | sort | while read f; do
  sha256sum "$f"
done > /casos/${CASO}/hashes/SHA256_FINAL_$(date '+%Y%m%d_%H%M%S').txt

# Verificar integridad: los hashes de adquisición deben coincidir con el final
diff /casos/${CASO}/hashes/SHA256_post_extraccion.txt \
     <(grep "adquisicion" /casos/${CASO}/hashes/SHA256_FINAL_*.txt)

echo "Si no hay diferencias: integridad verificada ✓"

# Cerrar el log de sesión
echo "Fin de sesión pericial: $(date '+%Y-%m-%d %H:%M:%S VET')"
exit  # Cierra el script que registraba los comandos
```

### 7.2 Exportar el Log de Comandos para el Informe

```bash
# El log de comandos debe adjuntarse al informe pericial
# Demuestra exactamente qué acciones se ejecutaron y cuándo
cp /casos/${CASO}/logs/sesion_pericial_*.log /casos/${CASO}/informes/log_comandos_pericial.txt

echo "Log de sesión: $(wc -l /casos/${CASO}/informes/log_comandos_pericial.txt) líneas"
```

---

## GLOSARIO LEGAL-TÉCNICO — CURSO CAINE

| Término | Definición Legal-Técnica |
|---|---|
| Write Blocker (software) | Mecanismo que impide escritura en medios conectados. CAINE lo implementa por defecto (montaje read-only). Equivale al bloqueador hardware en ámbito software |
| Backup ADB | Copia de seguridad creada mediante Android Debug Bridge. Método de extracción lógica. Limitado en Android 9+ para datos de apps |
| crypt15 | Estándar de cifrado WhatsApp vigente (2023+). Usa AES-256-GCM. Requiere clave de 32 bytes para descifrar |
| Chain of Custody Log | Registro cronológico de todas las acciones realizadas sobre la evidencia. En CAINE: el script log captura todos los comandos automáticamente |
| Autopsy Android Analyzer | Módulo de Autopsy que parsea artefactos Android: SMS, llamadas, contactos, WhatsApp, ubicaciones GPS |
