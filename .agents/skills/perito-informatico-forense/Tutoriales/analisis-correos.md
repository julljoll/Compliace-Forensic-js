# Análisis Forense de Correos Electrónicos — Venezuela

## Marco Legal
- Art. 187 COPP: Cadena de custodia del correo como evidencia digital
- Art. 48 CRBV: Inviolabilidad de comunicaciones (requiere orden judicial para interceptar)
- LECDI Art. 20-21: Violación de privacidad telemática
- ISO/IEC 27037: Adquisición de evidencia de correos electrónicos

## Tipos de Evidencia en Correos
1. **Cabeceras SMTP** (headers): ruta del mensaje, IPs de servidores
2. **Cuerpo del mensaje**: texto, HTML
3. **Archivos adjuntos**: documentos, imágenes con metadatos
4. **Metadatos del cliente**: fechas de apertura, respuesta
5. **Registros del servidor**: logs SMTP/IMAP (requieren colaboración del proveedor)

---

## PROCEDIMIENTO DE ANÁLISIS

### PASO 1: Preservación del Correo Original

**Obtener el correo en formato .eml (cabeceras completas):**
```
En Gmail: Abrir email → ⋮ (más opciones) → "Mostrar original" → Descargar .eml
En Outlook: Archivo → Guardar como → Formato: Mensaje de Outlook (.msg)
En Thunderbird: Click derecho → Guardar como → .eml
```

**Calcular hash del archivo preservado:**
```bash
sha256sum correo_evidencia_001.eml > hash_correo_001.txt
# DOCUMENTAR: este hash va en el formulario de cadena de custodia
```

### PASO 2: Análisis de Cabeceras SMTP

**Estructura de una cabecera:**
```
Received: from servidor-origen.com [IP_ORIGEN]
  by servidor-destino.com; [FECHA_HORA_UTC]
From: remitente@dominio.com
To: destinatario@dominio.com
Subject: Asunto del mensaje
Date: [fecha local del cliente]
Message-ID: <identificador-unico@servidor>
X-Originating-IP: [IP real del remitente si disponible]
DKIM-Signature: [firma criptográfica del dominio]
```

**Analizar con MXToolbox (online):**
```
1. Ir a: https://mxtoolbox.com/EmailHeaders.aspx
2. Pegar cabeceras completas del correo
3. MXToolbox muestra:
   - Ruta completa del mensaje (saltos entre servidores)
   - IP de origen del remitente
   - Tiempo entre cada salto
   - Validación SPF/DKIM/DMARC
```

**Buscar IP del remitente:**
```bash
# En las cabeceras buscar líneas "Received: from"
# La IP más antigua (primera en el servidor destino) = IP real del remitente
# Geolocalizar la IP:
curl https://ipapi.co/[IP_AQUI]/json/
# O usar: https://www.iplocation.net/
```

### PASO 3: Análisis de Autenticidad

**Verificar SPF (Sender Policy Framework):**
```
Indica si el servidor que envió el correo está autorizado por el dominio
Resultado SPF PASS = correo enviado desde servidor autorizado
Resultado SPF FAIL = posible spoofing del dominio remitente
```

**Verificar DKIM:**
```
Firma criptográfica que garantiza que el contenido no fue alterado
DKIM válida = el contenido es auténtico desde el servidor firmante
DKIM inválida = posible alteración o correo falsificado
```

**Verificar con MXToolbox:**
```
https://mxtoolbox.com/dkim.aspx → verificar firma DKIM del dominio
https://mxtoolbox.com/spf.aspx → verificar política SPF del dominio
```

### PASO 4: Análisis de Adjuntos

```bash
# Extraer metadatos de adjuntos con ExifTool
exiftool adjunto_sospechoso.pdf

# Información que revela:
# - Fecha de creación/modificación
# - Autor del documento
# - Software utilizado para crearlo
# - GPS si es imagen
# - Historial de modificaciones (Word/PDF)

# Verificar hash del adjunto
sha256sum adjunto_sospechoso.pdf
```

### PASO 5: Análisis Masivo con IPED

```bash
# Si hay múltiples correos (PST de Outlook, MBOX de Thunderbird)
java -jar iped.jar \
  -d /evidencias/carpeta_correos/ \
  -o /casos/caso_001/analisis_correos/ \
  -profile forensic

# IPED indexa automáticamente:
# - De, Para, CC, CCO
# - Fecha/hora (convertida a UTC)
# - Asunto
# - Cuerpo completo (HTML y texto)
# - Adjuntos extraídos con hashes
# Permite búsqueda por cualquier campo
```

---

## PREGUNTAS CLAVE A RESPONDER EN EL INFORME PERICIAL

1. ¿El correo fue enviado realmente desde la dirección indicada? (SPF/DKIM)
2. ¿Desde qué IP fue enviado? ¿A qué ubicación geográfica corresponde?
3. ¿El contenido del correo fue alterado? (DKIM + hash)
4. ¿Cuándo fue enviado, recibido y abierto? (timestamps del servidor)
5. ¿Los adjuntos son auténticos? (metadatos ExifTool + hash)
6. ¿El correo podría ser un phishing/spoofing? (análisis SPF fail + dominio similar)

---

## ERRORES COMUNES Y CONSECUENCIAS

| Error | Consecuencia |
|---|---|
| Analizar solo la vista HTML sin ver cabeceras | No se obtiene IP de origen real |
| No calcular hash del .eml original | Defensa puede alegar alteración |
| Confundir fecha del cliente con fecha del servidor | Error en la línea temporal |
| No verificar SPF/DKIM | No se puede confirmar autenticidad del remitente |
