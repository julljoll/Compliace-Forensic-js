# Análisis Forense de Disco Duro / PC Completa — Venezuela

## Marco Legal
- Art. 196-198 COPP: Allanamiento para incautación de equipos
- Art. 187 COPP: Cadena de custodia desde incautación
- Art. 223 COPP: Experticia como medio de prueba
- ISO/IEC 27037: Adquisición de discos y sistemas

---

## FLUJO DE TRABAJO COMPLETO

### FASE 0: En la Escena (Sitio del Suceso)

```bash
# Si PC está ENCENDIDA → consideraciones:
# 1. Fotografiar pantalla visible
# 2. Evaluar captura de RAM (si hay proceso relevante activo)
# Para captura RAM en Windows (con acceso físico):
#   Usar Magnet RAM Capture o WinPmem → genera archivo .raw
# Para captura RAM en Linux:
sudo dd if=/dev/mem of=/evidencias/ram_dump.raw bs=1M
# O mejor: sudo insmod lime.ko path=/evidencias/ram.lime format=lime

# Si PC está APAGADA → NO encender, trasladar directamente
```

### FASE 1: Adquisición de Imagen Forense

**Preparar el entorno forense:**
```bash
# Arrancar desde USB con CAINE Linux (entorno forense que monta discos en solo lectura)
# CAINE automáticamente bloquea escritura en discos detectados

# Identificar el disco a adquirir
lsblk  # lista todos los dispositivos
fdisk -l  # detalles de particiones

# Resultado típico:
# /dev/sda → disco del sistema (el que queremos adquirir)
# /dev/sdb → disco de destino (donde guardaremos la imagen)
```

**Calcular hash ANTES de adquirir:**
```bash
sha256sum /dev/sda | tee /evidencias/caso_001/hash_ANTES_adquisicion.txt
```

**Adquisición con dcfldd (recomendado — hash simultáneo):**
```bash
dcfldd \
  if=/dev/sda \
  of=/evidencias/caso_001/imagen_disco_001.dd \
  bs=512 \
  conv=noerror,sync \
  hash=sha256 \
  hashlog=/evidencias/caso_001/hash_imagen.txt \
  errlog=/evidencias/caso_001/errores.txt
```

**Adquisición en formato E01 con ewfacquire:**
```bash
ewfacquire \
  -t /evidencias/caso_001/imagen_disco_001 \
  -S 2GiB \
  -C "Caso 001 - [descripción]" \
  -E "Perito: [nombre]" \
  -D "Descripción detallada" \
  /dev/sda
# Genera imagen segmentada .E01, .E02, etc. con hash integrado
```

**Verificar integridad post-adquisición:**
```bash
# El hash de /dev/sda debe ser IGUAL antes y después de adquirir
sha256sum /dev/sda | tee /evidencias/caso_001/hash_DESPUES_adquisicion.txt

# Comparar los dos hash:
diff hash_ANTES_adquisicion.txt hash_DESPUES_adquisicion.txt
# Sin diferencias = el original no fue modificado durante la adquisición
```

### FASE 2: Procesamiento con IPED

```bash
# Procesar la imagen forense adquirida
java -jar iped.jar \
  -d /evidencias/caso_001/imagen_disco_001.dd \
  -o /casos/caso_001/iped_resultado/ \
  -profile forensic

# Tiempo estimado: ~30 min por cada 100 GB con hardware moderno
# IPED realiza automáticamente:
# - Indexación de todos los archivos
# - Recuperación de archivos borrados
# - Extracción de metadatos
# - OCR de imágenes con texto
# - Hash de cada archivo encontrado
# - Parsing de correos, bases de datos, chats
```

### FASE 3: Análisis con Autopsy (complementario a IPED)

```
1. Abrir Autopsy → Nuevo Caso → ingresar datos del caso
2. Agregar fuente de datos → Imagen de disco → seleccionar .dd o .E01
3. Configurar módulos de ingestión:
   □ Recent Activity (actividad reciente)
   □ Hash Lookup (comparar con NSRL)
   □ File Type Identification
   □ Keyword Search
   □ Email Parser
   □ Deleted File Recovery
4. Analizar resultados en panel izquierdo:
   - Deleted Files → archivos recuperados
   - Web History → historial de navegación
   - Web Bookmarks → favoritos
   - Web Downloads → archivos descargados
   - Recent Documents → documentos recientes
   - Installed Programs → programas instalados
```

### FASE 4: Línea Temporal (Timeline Analysis)

```bash
# Con The Sleuth Kit + mactime (MAC times: Modificación, Acceso, Cambio)
fls -r -m "/" /evidencias/imagen_disco_001.dd > /casos/caso_001/timeline_raw.txt
mactime -b /casos/caso_001/timeline_raw.txt -d > /casos/caso_001/timeline.csv

# Filtrar por fechas relevantes (ej: día del hecho investigado)
grep "2024-05-15" /casos/caso_001/timeline.csv > /casos/caso_001/actividad_dia_hecho.csv
```

---

## ARTEFACTOS CLAVE A ANALIZAR

### Windows
| Artefacto | Ubicación | Información |
|---|---|---|
| Registro | C:\Windows\System32\config\ | Configuración sistema, USB conectados, programas |
| Prefetch | C:\Windows\Prefetch\ | Programas ejecutados con fecha |
| Recent | C:\Users\[user]\AppData\Roaming\Microsoft\Windows\Recent | Archivos abiertos recientemente |
| Browser History | C:\Users\[user]\AppData\... | Historial, búsquedas, descargas |
| Papelera | C:\$Recycle.Bin | Archivos eliminados con fecha de eliminación |
| NTFS $MFT | raíz del disco | Master File Table: metadatos de TODOS los archivos |

### Linux
| Artefacto | Ubicación | Información |
|---|---|---|
| bash_history | ~/.bash_history | Comandos ejecutados |
| /var/log/auth.log | /var/log/ | Autenticaciones e intentos de acceso |
| /etc/passwd | /etc/ | Usuarios del sistema |
| Crontab | /etc/cron* | Tareas programadas (posible persistencia malware) |
