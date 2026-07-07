# CURSO PROFESIONAL: Ciencias Forenses Digitales
## Adaptado al Estilo Universidad de Cambridge — Con Caso Ficticio Venezolano
### Basado en la estructura del curso "Forensic Science: DNA Analysis" (Cambridge/edX)

**Nivel:** Universitario Avanzado / Profesional  
**Duración:** 8 Semanas (40 horas estimadas)  
**Instructores de referencia:** Dr. Susan Gurney (Cambridge) — Metodología adaptada a informática forense  
**Jurisdicción:** Venezuela (COPP / LECDI / Manual Único de Cadena de Custodia)  
**Certificación sugerida:** Al completar todos los módulos y el caso práctico integrador  

---

> **Nota metodológica:** Este curso adopta la estructura didáctica del programa de Cambridge:
> introducción científica → técnicas de laboratorio → casos reales → consideraciones éticas → futuro del campo.
> Cada "semana" equivale a un módulo temático con lecturas, ejercicios y caso práctico.

---

## SEMANA 1: Fundamentos de la Evidencia Digital y Marco Legal

### Objetivos de Aprendizaje
Al finalizar esta semana el estudiante será capaz de:
- Definir evidencia digital y su valor probatorio en el proceso penal venezolano
- Distinguir entre datos volátiles y no volátiles
- Identificar el marco legal que regula la actuación del perito forense
- Aplicar los principios de la ISO/IEC 27037:2012

### 1.1 ¿Qué es la Evidencia Digital?

La evidencia digital es cualquier información almacenada o transmitida en forma binaria que puede ser utilizada como prueba en un proceso judicial. A diferencia del DNA biológico, la evidencia digital tiene una característica crítica: **es extremadamente frágil y mutable**. Un solo bit cambiado destruye la autenticidad de la prueba.

**Tipos de evidencia digital:**
```
PERSISTENTE (no volátil):
  • Archivos en disco duro / SSD
  • Bases de datos de aplicaciones
  • Correos electrónicos almacenados
  • Imágenes y videos
  • Logs del sistema operativo
  • Historial de navegación

VOLÁTIL (se pierde al apagar):
  • Memoria RAM (procesos activos, contraseñas en memoria)
  • Conexiones de red activas
  • Procesos en ejecución
  • Caché del sistema
  • Tablas ARP
```

### 1.2 Marco Legal Venezuela — Lectura Obligatoria

**Código Orgánico Procesal Penal (COPP):**
- Art. 181-182: Libertad y licitud de prueba
- Art. 187: Cadena de custodia (texto completo + análisis)
- Art. 223-228: Experticias y peritaciones
- Art. 225: Requisitos del dictamen pericial

**Ley Especial contra los Delitos Informáticos (LECDI):**
- Art. 6: Acceso indebido
- Art. 7: Sabotaje de sistemas
- Art. 20-21: Violación de privacidad telemática
- Art. 23: Difamación e injuria electrónica

**Normas ISO aplicables:**
```
ISO/IEC 27037:2012 — Identificación, recolección, adquisición y preservación
ISO/IEC 27041:2015 — Aseguramiento de la idoneidad de los métodos
ISO/IEC 27042:2015 — Análisis e interpretación de evidencia digital
ISO/IEC 27043:2015 — Principios y procesos de investigación de incidentes
ISO/IEC 27050 — Descubrimiento electrónico (eDiscovery)
```

### 1.3 Caso Práctico Semana 1

**Escenario:** La ciudadana Ana Rodríguez descubre que alguien ha accedido a su cuenta bancaria en línea. Llama a la Fiscalía. Como perito, ¿qué es lo PRIMERO que debe hacer?

**Respuesta correcta:**
```
1. Identificar TODOS los dispositivos potencialmente involucrados
   (computadora del hogar, router WiFi, teléfono, tablet)
2. Solicitar al fiscal la orden de preservación urgente
3. FOTOGRAFIAR todo antes de tocar cualquier cosa
4. Determinar cuáles dispositivos están encendidos (datos volátiles en riesgo)
5. Completar el formulario inicial de cadena de custodia
6. NO encender/apagar equipos sin documentar el estado actual
```

**Pregunta para reflexión:** ¿Por qué el Art. 181 del COPP exige que la prueba sea obtenida "por medios lícitos"? ¿Qué consecuencias tiene una evidencia obtenida ilegalmente aunque sea técnicamente auténtica?

---

## SEMANA 2: El Laboratorio Forense — Herramientas y Entorno

### Objetivos
- Configurar un entorno forense seguro con software libre
- Distinguir entre bloqueadores de escritura hardware y software
- Instalar y verificar las herramientas principales
- Comprender el concepto de reproducibilidad forense

### 2.1 Distribuciones Linux para Forense

```
CAINE LINUX (Computer Aided INvestigative Environment)
  URL: https://www.caine-live.net/
  Ventaja: Write-blocker automático por software
  Incluye: Autopsy, Guymager, RegRipper, Volatility, etc.
  Uso forense ideal: Análisis de discos y dispositivos

TSURUGI LINUX  
  URL: https://tsurugi-linux.org/
  Ventaja: Incluye WHAPA por defecto
  Incluye: 900+ herramientas forenses
  Uso forense ideal: Análisis de aplicaciones, OSINT

KALI LINUX
  URL: https://www.kali.org/
  Ventaja: Actualizaciones frecuentes, mayor comunidad
  Nota: Requiere configuración manual de write-blocking
  Uso forense: Combinado con pentesting
```

### 2.2 Herramientas Esenciales (open source)

```bash
# Script de instalación de entorno forense básico en Debian/Ubuntu/Kali/CAINE
#!/bin/bash
echo "=== INSTALACIÓN ENTORNO FORENSE DIGITAL ==="

# Adquisición
sudo apt install -y dcfldd dc3dd ewf-tools guymager

# Análisis de disco
sudo apt install -y autopsy sleuthkit testdisk photorec

# Análisis de memoria
sudo apt install -y volatility3

# Móviles Android
sudo apt install -y adb android-tools-adb

# Base de datos
sudo apt install -y sqlite3 sqlitebrowser

# Metadatos
sudo apt install -y exiftool libimage-exiftool-perl

# Red
sudo apt install -y wireshark tshark

# Python tools
sudo pip3 install whapa wa-crypt-tools bulk-extractor --break-system-packages

echo "=== INSTALACIÓN COMPLETADA ==="
# Verificar versiones
for tool in dcfldd autopsy adb sqlite3 exiftool wireshark; do
  echo "$tool: $(${tool} --version 2>&1 | head -1)"
done
```

### 2.3 Verificar Integridad del Entorno

```bash
# Antes de comenzar cualquier caso, verificar que el entorno no ha sido comprometido
# Calcular hash del ejecutable de las herramientas clave
for tool in /usr/bin/dcfldd /usr/bin/adb /usr/bin/sqlite3; do
  [ -f "$tool" ] && sha256sum "$tool"
done > /tmp/hashes_herramientas.txt

echo "Entorno forense verificado: $(date)"
```

---

## SEMANA 3: Adquisición Forense — El Momento Más Crítico

### Objetivos
- Aplicar el proceso de adquisición forense conforme ISO 27037
- Generar imágenes forenses verificables con hash
- Documentar la cadena de custodia correctamente
- Distinguir entre adquisición física, lógica y en la nube

### 3.1 Tipos de Adquisición

```
FÍSICA (bit-a-bit):
  • Copia exacta de TODOS los sectores del disco
  • Incluye espacio no asignado, archivos borrados
  • Formatos: RAW/DD, E01 (EnCase), AFF
  • Herramientas: dcfldd, dd, Guymager
  • Aplica a: discos duros, SSDs, tarjetas SD

LÓGICA:
  • Solo archivos y carpetas activas
  • No recupera borrados del espacio no asignado
  • Aplica a: celulares sin root, cloud storage
  • Herramientas: ADB (Android), iTunes backup (iOS)

NUBE / CLOUD:
  • Datos en servidores remotos (Google Drive, iCloud, WhatsApp backup)
  • Requiere colaboración del usuario o del proveedor
  • Requiere orden judicial para acceso sin consentimiento
  • Herramientas: APIs de plataformas (con autorización)
```

### 3.2 Protocolo Completo de Adquisición de Disco Duro

```bash
#!/bin/bash
# Script profesional de adquisición forense
# Uso: ./adquisicion_forense.sh /dev/FUENTE /casos/CASO/imagen.dd "Descripción"

FUENTE="$1"
DESTINO="$2" 
DESCRIPCION="$3"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
LOG="${DESTINO%.*}_log_${TIMESTAMP}.txt"

echo "==========================================" | tee "$LOG"
echo "ADQUISICIÓN FORENSE PROFESIONAL" | tee -a "$LOG"
echo "Fecha/Hora: $(date '+%Y-%m-%d %H:%M:%S VET')" | tee -a "$LOG"
echo "Fuente: $FUENTE" | tee -a "$LOG"
echo "Destino: $DESTINO" | tee -a "$LOG"
echo "Descripción: $DESCRIPCION" | tee -a "$LOG"
echo "==========================================" | tee -a "$LOG"

# PASO 1: Hash ANTES de adquirir
echo "[PASO 1] Calculando hash de origen ANTES de adquirir..." | tee -a "$LOG"
HASH_ANTES=$(sha256sum "$FUENTE" | awk '{print $1}')
echo "Hash SHA-256 ANTES: $HASH_ANTES" | tee -a "$LOG"

# PASO 2: Información del dispositivo
echo "[PASO 2] Información del dispositivo fuente:" | tee -a "$LOG"
lsblk "$FUENTE" | tee -a "$LOG"
hdparm -I "$FUENTE" 2>/dev/null | grep -E "Model|Serial|Firmware|capacity" | tee -a "$LOG"

# PASO 3: Adquisición con dcfldd (hash simultáneo)
echo "[PASO 3] Iniciando adquisición..." | tee -a "$LOG"
dcfldd \
  if="$FUENTE" \
  of="$DESTINO" \
  bs=512 \
  conv=noerror,sync \
  hash=sha256 \
  hashlog="${DESTINO%.*}_hash_dcfldd.txt" \
  errlog="${DESTINO%.*}_errores.txt" \
  2>&1 | tee -a "$LOG"

# PASO 4: Hash DESPUÉS de adquirir
echo "[PASO 4] Verificando que el original no fue modificado..." | tee -a "$LOG"
HASH_DESPUES=$(sha256sum "$FUENTE" | awk '{print $1}')
echo "Hash SHA-256 DESPUÉS: $HASH_DESPUES" | tee -a "$LOG"

if [ "$HASH_ANTES" = "$HASH_DESPUES" ]; then
  echo "✅ INTEGRIDAD VERIFICADA: El original NO fue modificado" | tee -a "$LOG"
else
  echo "❌ ALERTA: Los hashes difieren. Documentar y consultar al fiscal" | tee -a "$LOG"
fi

# PASO 5: Verificar la imagen creada
echo "[PASO 5] Verificando imagen creada..." | tee -a "$LOG"
sha256sum "$DESTINO" | tee -a "$LOG"

echo "[FIN] Adquisición completada: $(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$LOG"
```

---

## SEMANA 4: Análisis de Artefactos — Correos Electrónicos

*(Ver: `references/analisis-correos.md` para el procedimiento completo)*

### Caso Práctico Semana 4

**Escenario "Caso Phishing Bancario":**
El Banco Nacional de Venezuela reporta que varios funcionarios recibieron correos fraudulentos simulando ser del departamento de TI, solicitando sus credenciales de acceso.

**Tarea:** Analizar el correo `phishing_bnv_muestra.eml` (fichero ficticio) y determinar:
1. ¿El correo fue enviado realmente desde el dominio @bnv.gob.ve?
2. ¿Desde qué dirección IP fue originado?
3. ¿A qué ubicación geográfica corresponde esa IP?
4. ¿El contenido HTML tiene scripts maliciosos embebidos?

**Solución paso a paso:**
```bash
# 1. Calcular hash del .eml (preservación)
sha256sum phishing_bnv_muestra.eml > hash_correo.txt

# 2. Extraer y analizar cabeceras
python3 -c "
import email
msg = email.message_from_file(open('phishing_bnv_muestra.eml'))
for header in ['From','To','Date','Received','X-Originating-IP','DKIM-Signature','Return-Path']:
    print(f'{header}: {msg.get(header, \"NO PRESENTE\")}')
"

# 3. Verificar SPF del dominio del remitente
# (usando MXToolbox o dig en la terminal)
dig TXT bnv.gob.ve | grep spf

# 4. Analizar el HTML del cuerpo en busca de redirecciones
python3 -c "
import email
msg = email.message_from_file(open('phishing_bnv_muestra.eml'))
for part in msg.walk():
    if part.get_content_type() == 'text/html':
        print(part.get_payload(decode=True).decode())
" | grep -i "href\|src\|action\|script"
```

---

## SEMANA 5: Análisis de Dispositivos Móviles Android

*(Ver cursos completos: `curso-whatsapp-kali-linux.md` y `curso-whatsapp-caine-linux.md`)*

### Mapa Conceptual de Artefactos Android

```
DISPOSITIVO ANDROID
│
├── /data/data/               ← Solo accesible con ROOT
│   ├── com.whatsapp/
│   │   ├── databases/
│   │   │   ├── msgstore.db   ← MENSAJES (cifrados → crypt15)
│   │   │   ├── wa.db         ← CONTACTOS
│   │   │   └── axolotl.db    ← CLAVES SIGNAL
│   │   └── files/key         ← CLAVE DE DESCIFRADO
│   └── com.android.contacts/
│       └── databases/contacts2.db
│
└── /sdcard/ (o /storage/emulated/0/)  ← Accesible SIN ROOT
    ├── WhatsApp/
    │   ├── Databases/
    │   │   ├── msgstore.db.crypt15  ← BACKUP ENCRIPTADO
    │   │   └── msgstore-FECHA.db.crypt15
    │   └── Media/
    │       ├── WhatsApp Images/
    │       ├── WhatsApp Videos/
    │       └── WhatsApp Voice Notes/
    ├── DCIM/Camera/           ← Fotos tomadas con la cámara
    ├── Downloads/             ← Archivos descargados
    └── Android/media/
        └── com.whatsapp/      ← Multimedia WhatsApp alternativa
```

---

## SEMANA 6: Análisis de Redes Sociales y OSINT

*(Ver: `references/analisis-redes-sociales.md`)*

### Ejercicio Práctico: Geolocalizar una Publicación

**Escenario:** Se recibe denuncia de acoso. El acosador publica fotos desde Instagram con el perfil "@usuario_ficticio_2024". Una de las imágenes fue subida mostrando un parque.

**Objetivo:** Determinar la ubicación exacta donde fue tomada la foto.

```bash
# PASO 1: Descargar la imagen del post de Instagram (si es público)
wget -O imagen_evidencia_001.jpg "URL_DE_LA_IMAGEN"

# PASO 2: Calcular hash
sha256sum imagen_evidencia_001.jpg > hash_imagen_001.txt

# PASO 3: Extraer metadatos EXIF
exiftool imagen_evidencia_001.jpg

# Campos a buscar:
# GPS Latitude: 10.4806
# GPS Longitude: -66.9036
# DateTimeOriginal: 2024:10:15 14:23:45
# Make: Apple
# Model: iPhone 15 Pro

# PASO 4: Geolocalizar coordenadas
# Convertir a decimal si aparece en grados/minutos/segundos
# 10°28'50"N 66°54'13"W → 10.4806, -66.9036
# Verificar en Google Maps o OpenStreetMap

echo "Coordenadas: 10.4806, -66.9036"
echo "Ubicación aproximada: Caracas, Venezuela"

# PASO 5: Si Instagram eliminó los metadatos EXIF
# (muy común en 2024), usar otras técnicas:
# - Análisis de sombras para determinar hora del sol
# - Vegetación y arquitectura visible
# - Señales, carteles, matrículas de vehículos en la imagen
```

---

## SEMANA 7: Análisis de Memoria RAM y Artefactos Volátiles

### Cuándo Hacer Análisis de RAM

La RAM contiene información que DESAPARECE al apagar el equipo:
- Contraseñas en texto plano (navegadores, SSH)
- Claves de cifrado activas (BitLocker, VeraCrypt)
- Procesos maliciosos (malware sin archivos / fileless)
- Conversaciones en navegadores (modo incógnito)
- Conexiones de red activas

### Captura de RAM con LiME (Linux Memory Extractor)

```bash
# En el sistema bajo investigación (si tenemos acceso root):

# Instalar LiME
git clone https://github.com/504ensicsLabs/LiME.git
cd LiME/src && make

# Cargar el módulo para capturar RAM
sudo insmod lime.ko path=/casos/CASO/ram_dump.lime format=lime

# Calcular hash de la captura
sha256sum /casos/CASO/ram_dump.lime > /casos/CASO/hashes/hash_ram.txt

# En Windows (herramienta externa, desde USB):
# winpmem_mini_x64_rc2.exe > ram_dump.raw
```

### Análisis con Volatility 3

```bash
# Instalar Volatility 3
pip3 install volatility3 --break-system-packages

# Identificar el perfil del SO en la captura
vol3 -f /casos/CASO/ram_dump.lime windows.info 2>/dev/null || \
vol3 -f /casos/CASO/ram_dump.lime linux.bash

# Comandos clave para análisis forense:
# Listar procesos activos al momento de la captura
vol3 -f ram_dump.lime windows.pslist > /casos/CASO/analisis/procesos.txt

# Conexiones de red activas
vol3 -f ram_dump.lime windows.netstat > /casos/CASO/analisis/conexiones_red.txt

# Extraer contraseñas de memoria (LSASS)
vol3 -f ram_dump.lime windows.hashdump > /casos/CASO/analisis/hashes_windows.txt

# Buscar texto en memoria (buscar cadenas relevantes al caso)
vol3 -f ram_dump.lime windows.strings --pid [PID] | grep -i "contraseña\|password\|bitcoin\|transferencia"
```

---

## SEMANA 8: Ética, Derecho y el Futuro de la Forense Digital

### 8.1 Consideraciones Éticas del Perito (Paralelo al Curso Cambridge)

El curso de DNA de Cambridge dedica una semana entera a la ética. En forense digital:

**Dilemas éticos comunes:**
1. **Hallazgo incidental**: Mientras analizas el disco por extorsión, encuentras fotos de abuso infantil. ¿Qué haces?
   - Respuesta: Parar el análisis, preservar el hallazgo, notificar INMEDIATAMENTE al fiscal. Nunca ignorar.

2. **Evidencia exculpatoria**: El análisis revela que el imputado NO pudo haber cometido el delito. ¿Lo reportas aunque el fiscal no lo pida?
   - Respuesta: Sí. El perito es auxiliar de justicia (Art. 225 COPP), no del fiscal. La verdad técnica prima.

3. **Presión judicial**: El juez te pide una conclusión diferente a la que tus hallazgos soportan. ¿Cedes?
   - Respuesta: No. El juramento del perito y la responsabilidad penal por falso testimonio (Art. 242 CP) son claros.

4. **Privacidad vs Investigación**: El análisis forense accede a información privada legítima que no tiene nada que ver con el caso. ¿La usas?
   - Respuesta: No. Solo los hallazgos relacionados con el objeto de la experticia son relevantes y reportables.

### 8.2 Tendencias Futuras en Forense Digital

```
DESAFÍOS ACTUALES Y EMERGENTES:

1. CIFRADO UBICUO
   • WhatsApp E2E, Signal, Telegram "secreto"
   • Dispositivos con cifrado total (Android/iOS modernos)
   • Respuesta: Adquisición antes de bloqueo, colaboración de proveedores

2. CLOUD-FIRST
   • Datos en Google Drive, iCloud, OneDrive, AWS
   • La evidencia ya no está en el dispositivo
   • Respuesta: Órdenes judiciales transnacionales, MLAT

3. DEEPFAKES Y MANIPULACIÓN
   • Imágenes, videos, audios generados por IA
   • El perito debe poder detectar manipulaciones
   • Herramientas: FotoForensics, InVID, análisis de ruido PRNU

4. CRIPTOMONEDAS Y BLOCKCHAIN
   • Rastreo de transacciones en Bitcoin, Monero, etc.
   • IPED ya incluye detección de wallets
   • Herramientas: Chainalysis, Crystal Blockchain

5. IoT (Internet de las Cosas)
   • Refrigeradores, relojes, autos conectados como evidencia
   • Datos de salud de smartwatch en homicidios
   • Marco legal venezolano aún en desarrollo para esto
```

### 8.3 Proyecto Final del Curso

**Caso integrador: "Caso Pérez Soto"**

Se te asignan los siguientes elementos para analizar:
1. Un disco duro de 500GB (imagen DD proporcionada)
2. Un backup de WhatsApp (.crypt15 + key)
3. 47 correos electrónicos en formato .mbox
4. Una captura de RAM de 8GB

**Delito investigado:** Fraude electrónico y legitimación de capitales (Arts. 12 y 14 LECDI)

**Entregable:** Informe pericial completo con:
- Cadena de custodia documentada
- Hashes de todas las evidencias
- Análisis de los 4 elementos con hallazgos específicos
- Conclusiones técnicas numeradas
- Juramento del perito firmado

**Criterios de evaluación:**
- Correcto manejo de cadena de custodia: 25%
- Precisión técnica de los hallazgos: 35%
- Redacción legal del informe: 25%
- Presentación oral del caso (simulación de juicio): 15%

---

## RECURSOS DE REFERENCIA ADICIONALES

### Cursos en Línea Complementarios (Open Access)
```
1. SANS FOR508: Advanced Digital Forensics and Incident Response
   (materiales gratuitos parciales en sans.org)

2. OpenLearn (Open University): Digital Forensics
   https://www.open.edu/openlearn/digital-forensics

3. Cybrary: Computer Hacking Forensics Investigator (CHFI)
   https://www.cybrary.it/

4. Coursera: Identifying, Monitoring, and Analyzing Risks
   (Johns Hopkins - materiales de auditoría)

5. YouTube - Digital Forensics Inc. (canal oficial)
   Tutoriales prácticos en inglés, gratuitos

6. GitHub - awesome-forensics
   https://github.com/cugu/awesome-forensics
   Lista curada de herramientas y recursos forenses open source

7. DFIR.training
   https://www.dfir.training/
   Recursos de entrenamiento en Digital Forensics

8. SANS Digital Forensics Blog
   https://www.sans.org/blog/digital-forensics/
   Artículos técnicos profesionales gratuitos
```

### Comunidades en Español
```
- Foro de Ciberdelincuencia Venezuela (Fiscalía - recursos oficiales)
- Forense Digital Latinoamérica (grupos especializados)
- Raymond Orta (informaticaforense.com) - recursos Venezuela
- YouTube: "Informática Forense Venezuela" - tutoriales en español
```
