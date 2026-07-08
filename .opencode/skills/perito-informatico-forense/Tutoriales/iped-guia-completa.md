# IPED Digital Forensic Tool — Guía Completa de Uso

## ¿Qué es IPED?
IPED (Indexador e Processador de Evidências Digitais) es una herramienta open source
desarrollada por la Policía Federal de Brasil desde 2012. Publicada como código abierto en 2019.
Avalada y recomendada por INTERPOL para laboratorios forenses. Desarrollada en Java (multiplataforma).

**Repositorio oficial:** https://github.com/sepinf-inc/IPED
**Wiki oficial:** https://github.com/sepinf-inc/IPED/wiki

## Capacidades Clave para Peritaje Venezuela
- Procesamiento de imágenes RAW/DD, E01, EX01, VHD, VMDK, ISO
- Parsers específicos para WhatsApp, Telegram, Skype
- OCR con Tesseract (extrae texto de imágenes/PDFs escaneados)
- Recuperación de archivos borrados (data carving)
- Búsqueda regex (emails, IPs, criptomonedas, números de cédula)
- Generación de hash MD5/SHA-1/SHA-256 automático
- Compatible con conjuntos de hash NIST NSRL, ProjectVIC, INTERPOL ICSE
- Velocidad: hasta 400 GB/hora con hardware moderno
- Portable: puede ejecutarse desde USB sin instalación

---

## MÓDULO 1: Instalación y Configuración Inicial

### Prerrequisitos
- Java JDK 11 o superior
- 8 GB RAM mínimo (16 GB recomendado)
- 50 GB espacio libre para casos
- Windows 10/11 o Linux Ubuntu 20.04+

### Instalación en Windows
```
1. Descargar última versión desde:
   https://github.com/sepinf-inc/IPED/releases

2. Extraer el ZIP en C:\iped\

3. Configurar LocalConfig.txt:
   - Cambiar carpeta temporal: tmpDir = D:\iped-temp\
   - Verificar ruta a Java: javaBin = C:\Java\jdk-11\bin\java.exe
```

### Configuración en Linux
```bash
# Instalar dependencias
sudo apt-get install openjdk-11-jdk tesseract-ocr tesseract-ocr-por tesseract-ocr-spa

# Descargar IPED
wget https://github.com/sepinf-inc/IPED/releases/download/[VERSION]/IPED-[VERSION].zip
unzip IPED-[VERSION].zip -d /opt/iped/

# Configurar LocalConfig.txt
nano /opt/iped/LocalConfig.txt
# Cambiar: tmpDir=/tmp/iped-procesamiento/
```

---

## MÓDULO 2: Procesamiento de una Imagen Forense

### Crear un Caso Nuevo (Línea de Comandos)
```bash
# Sintaxis básica
java -jar iped.jar -d [FUENTE] -o [SALIDA_CASO]

# Ejemplo: procesar imagen E01
java -jar iped.jar \
  -d /evidencias/caso_001/disco_imputado.E01 \
  -o /casos/caso_001/analisis_iped/

# Ejemplo: procesar múltiples fuentes
java -jar iped.jar \
  -d /evidencias/disco.E01 \
  -d /evidencias/telefono.tar \
  -o /casos/caso_001/analisis_iped/

# Con perfil forense completo (recomendado para peritaje)
java -jar iped.jar \
  -d /evidencias/disco.E01 \
  -o /casos/caso_001/ \
  -profile forensic
```

### Perfiles Disponibles
| Perfil | Uso |
|---|---|
| `forensic` | Análisis completo (recomendado para peritaje judicial) |
| `triage` | Revisión rápida inicial |
| `fastmode` | Vista previa rápida |
| `blind` | Extracción automática sin GUI |

### Monitorear el Progreso
IPED muestra en tiempo real:
- Archivos procesados
- Tareas completadas (parsing, OCR, hash, carving)
- Tiempo estimado restante

---

## MÓDULO 3: Análisis con la Interfaz Gráfica

### Abrir el Caso
```bash
# Una vez procesado, abrir la interfaz de análisis
java -jar iped-search-app.jar /casos/caso_001/
# En Windows: doble clic en el archivo .iped generado
```

### Funciones Principales de la Interfaz

**Panel de Búsqueda:**
```
# Buscar texto libre
correo@dominio.com

# Búsqueda regex (expresión regular)
\b[0-9]{7,8}-[0-9]\b    ← busca cédulas venezolanas

# Buscar por tipo de archivo
type:WhatsApp

# Buscar en fechas específicas
date:[2023-01-01 TO 2023-12-31]

# Combinar criterios
type:email AND date:[2023-01-01 TO 2023-06-30]
```

**Filtros por Categoría:**
- Imágenes, Videos, Documentos
- Mensajes (WhatsApp, Telegram, Email)
- Archivos borrados/recuperados
- Criptografía detectada

**Vista de WhatsApp:**
IPED extrae y presenta conversaciones de WhatsApp con:
- Contactos y grupos
- Mensajes con fecha/hora
- Archivos multimedia
- Mensajes eliminados (cuando recuperables)

---

## MÓDULO 4: Generación de Informe desde IPED

```
1. En la interfaz: Archivo → Exportar → Informe HTML/PDF
2. Seleccionar ítems marcados como relevantes
3. IPED genera informe con:
   - Lista de evidencias con hashes
   - Capturas de pantalla de ítems relevantes
   - Metadatos de cada archivo
   - Línea temporal de eventos
```

---

## MÓDULO 5: Análisis Específico de WhatsApp con IPED

```bash
# Fuente: backup WhatsApp extraído de Android (archivo .tar de ADB)
java -jar iped.jar \
  -d /evidencias/backup_whatsapp.tar \
  -o /casos/caso_001/whatsapp_analisis/ \
  -profile forensic

# IPED detecta automáticamente:
# - msgstore.db (base de datos de mensajes)
# - wa.db (base de datos de contactos)
# - Media/ (archivos multimedia)
# Genera vista de conversaciones navegable
```

---

## MÓDULO 6: Análisis de Correos con IPED

```bash
# IPED soporta formatos: PST, OST, MBOX, EML, MSG
java -jar iped.jar \
  -d /evidencias/correos_outlook.pst \
  -o /casos/caso_001/correos_analisis/

# En la interfaz, filtrar por: type:email
# Ver: De, Para, CC, Fecha, Asunto, Cuerpo, Adjuntos
# IPED extrae automáticamente headers SMTP
```
