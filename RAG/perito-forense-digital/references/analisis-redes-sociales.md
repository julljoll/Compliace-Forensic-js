# Análisis Forense de Redes Sociales — Venezuela

## Marco Legal
- LECDI Art. 20: Violación de privacidad telemática
- LECDI Art. 23: Difamación e injuria por medios electrónicos
- Art. 187 COPP: Cadena de custodia de capturas y datos extraídos
- ISO/IEC 27037: Recolección de evidencia de fuentes en línea
- Art. 48 CRBV: Las comunicaciones son privadas (requiere orden para interceptar)

## Principio Fundamental
El perito NO accede a cuentas ajenas sin autorización judicial. Solo analiza:
1. Contenido público accesible sin autenticación
2. Capturas aportadas por la víctima/denunciante
3. Información obtenida con orden judicial del proveedor

---

## PRESERVACIÓN DE EVIDENCIA EN REDES SOCIALES

### Método 1: Captura con Hunchly
```
1. Instalar extensión Hunchly en Chrome
2. Iniciar sesión en Hunchly → crear caso nuevo
3. Navegar a la publicación/perfil de interés
4. Hunchly captura automáticamente:
   - Captura de pantalla
   - Código fuente HTML
   - Metadatos (fecha/hora de captura, URL)
   - Hash del contenido capturado
5. Exportar "Hunchly Package" para el caso
```

### Método 2: Preservación Manual con Hash
```bash
# 1. Capturar pantalla completa (usar herramienta que capture URL + fecha)
# 2. Descargar la página fuente si es pública:
wget -p -k -E "https://url-de-la-publicacion" -P /casos/caso_001/redes_sociales/

# 3. Calcular hash del contenido descargado
sha256sum /casos/caso_001/redes_sociales/* > /casos/caso_001/hashes_redes.txt

# 4. Documentar:
# - URL exacta
# - Fecha y hora de captura (con timezone Venezuela GMT-4)
# - Herramienta utilizada
# - Hash del archivo capturado
```

### Método 3: Notarización Online
```
Herramientas que certifican la existencia de una publicación en un momento dado:
- https://cacert.net/ (genera certificado con hash y timestamp)
- Notario digital o firma electrónica del perito sobre el archivo
```

---

## ANÁLISIS DE METADATOS EN IMÁGENES DE REDES SOCIALES

```bash
# Descargar imagen publicada
wget "https://pbs.twimg.com/media/[imagen].jpg" -O imagen_evidencia.jpg

# Analizar metadatos con ExifTool
exiftool imagen_evidencia.jpg

# Datos relevantes que pueden obtenerse:
# - GPSLatitude / GPSLongitude: ubicación donde se tomó la foto
# - DateTimeOriginal: cuándo fue tomada
# - Make / Model: marca y modelo del dispositivo
# - Software: app de edición usada (si fue alterada)

# NOTA: Muchas redes sociales eliminan EXIF al subir. 
# Si los datos están presentes, son valiosos.
# Si no están, documentar esa ausencia también.
```

---

## SOLICITUD DE INFORMACIÓN A PROVEEDORES

Para obtener logs, IPs de acceso y datos de usuario a redes sociales:

### Proceso Legal en Venezuela
```
1. Fiscal del Ministerio Público o Juez de Control solicita información
2. Se envía carta rogatoria o solicitud judicial al proveedor
3. Las plataformas tienen departamentos de Law Enforcement:
   - Facebook/Instagram: https://www.facebook.com/safety/groups/law/
   - Twitter/X: https://legal.twitter.com/
   - Google/YouTube: https://support.google.com/legal/

4. Información típicamente obtenible:
   - IP de registro y últimas sesiones
   - Número de teléfono vinculado
   - Correo electrónico de recuperación
   - Fecha de creación de la cuenta
   - Historial de cambios en la cuenta
```

---

## ANÁLISIS OSINT (Inteligencia de Fuentes Abiertas)

### Herramientas para investigación de fuentes públicas:
```bash
# Maltego Community Edition (gratuito): mapeo de relaciones entre personas/dominios/IPs

# Sherlock: buscar usuario en múltiples redes sociales
pip install sherlock-project
sherlock [nombre_de_usuario]
# Resultado: en qué redes existe ese nombre de usuario

# Verificar si un email fue comprometido en filtraciones:
# https://haveibeenpwned.com/

# Búsqueda de imágenes inversas:
# Google Images → subir imagen → buscar origen real
# TinEye: https://tineye.com/
```

---

## DOCUMENTACIÓN PARA EL INFORME

Para cada publicación de red social como evidencia:
```
□ URL completa de la publicación
□ Nombre/handle del perfil que publicó
□ Fecha y hora de publicación (plataforma + zona horaria)
□ Fecha y hora de captura por el perito
□ Método de captura utilizado
□ Hash SHA-256 del archivo capturado
□ Captura de pantalla completa (con URL visible)
□ Código fuente HTML si aplica
□ Metadatos EXIF si hay imágenes (ExifTool)
□ Estado actual de la publicación (activa/eliminada al momento del análisis)
```
