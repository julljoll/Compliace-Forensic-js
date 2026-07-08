# Análisis Forense de Correos Electrónicos

## Marco Legal
- **LECDI Venezuela — Art. 9** — Espionaje informático (interceptación de comunicaciones)
- **Art. 20 LECDI** — Violación de privacidad de datos personales
- **ISO/IEC 27037** — Preservación de evidencia en formato email
- **RFC 5321 / RFC 5322** — Estándares técnicos del protocolo SMTP/correo

---

## Formatos de Archivo de Correo

| Formato | Cliente | Herramienta de Análisis |
|---|---|---|
| `.PST` / `.OST` | Microsoft Outlook | IPED, Autopsy, pst-utils |
| `.MBOX` | Thunderbird, Gmail export | IPED, Bulk Extractor |
| `.EML` | Genérico | IPED, Autopsy, ExifTool |
| `.MSG` | Outlook mensaje individual | IPED, msgconvert |
| Servidor IMAP | Gmail, Outlook.com | theHarvester, Mailspring |

---

## CURSO: Análisis Forense de Correos

### MÓDULO 1 — Adquisición de Correos en PC

#### 1.1 — Microsoft Outlook (archivos .PST/.OST)
```
Rutas típicas del archivo PST:
  Windows 10/11: C:\Users\[usuario]\Documents\Outlook Files\*.pst
  Windows 7: C:\Users\[usuario]\AppData\Local\Microsoft\Outlook\*.pst

Paso 1: NO abrir Outlook en la computadora analizada
Paso 2: Localizar el .PST desde la imagen forense en IPED
Paso 3: En IPED → categoría "Email" → archivos .PST son parseados automáticamente
Paso 4: Exportar correos de interés con su hash
```

#### 1.2 — Mozilla Thunderbird (formato MBOX)
```
Ruta del perfil:
  Windows: C:\Users\[usuario]\AppData\Roaming\Thunderbird\Profiles\[perfil]\
  Linux: ~/.thunderbird/[perfil]/

Archivos de interés:
  - Inbox (bandeja de entrada, sin extensión)
  - Sent (enviados)
  - Trash (eliminados — muy importante)
  - [Nombre de carpeta].msf (índices)

IPED analiza automáticamente MBOX.
Para análisis manual con la herramienta mbox-reader:
  python -m mbox_reader Inbox | grep -i "From:"
```

#### 1.3 — Gmail / Outlook.com (correo web)
```
Con IPED analizando el historial del navegador:
  Categoría: Email
  Chrome guarda caché de correos web en: Default/Cache/

Para extracción directa de cuenta (con autorización judicial):
  Google Takeout: exporta en formato .MBOX
  → Requiere credenciales del usuario o orden judicial a Google Venezuela
```

---

### MÓDULO 2 — Análisis de Cabeceras (Headers) de Correo

**Importancia forense:** Las cabeceras revelan la trayectoria real del correo y pueden refutar suplantaciones de identidad.

#### 2.1 — ¿Qué son las cabeceras?
```
Cada correo electrónico tiene dos partes:
  1. CUERPO: lo que ve el usuario (texto, imágenes)
  2. CABECERAS: información técnica de enrutamiento (oculta normalmente)

Las cabeceras revelan:
  - IP de origen real del remitente
  - Servidores por los que pasó
  - Timestamps de cada salto
  - Herramientas usadas para enviarlo
  - Si fue falsificado (spoofing)
  - Resultado de autenticación SPF/DKIM/DMARC
```

#### 2.2 — Cómo extraer cabeceras

**En Outlook:**
```
Abrir correo → Archivo → Propiedades → 
Cuadro "Encabezados de Internet" → copiar todo el texto
```

**En Gmail:**
```
Abrir correo → Tres puntos → "Mostrar original"
Aparece la cabecera completa + cuerpo
```

**En archivo .EML con ExifTool:**
```bash
exiftool correo.eml
# Muestra todos los metadatos y cabeceras
```

#### 2.3 — Anatomía de una Cabecera Forense
```
Ejemplo de cabecera con análisis:

Received: from mail.atacante.com (192.168.1.100)
  by mx.google.com with ESMTP id xxx
  for <victima@gmail.com>;
  Mon, 15 Jan 2024 10:30:00 -0400 (VET)

↑ ANÁLISIS:
  - IP de origen: 192.168.1.100 → investigar con WHOIS
  - Servidor enviador: mail.atacante.com → verificar DNS
  - Timestamp: lunes 15 enero 2024, 10:30 AM (hora Venezuela)
  - Protocolo: ESMTP

From: "Banco Venezuela" <banco@gogle.com>
↑ ANÁLISIS: Dominio "gogle.com" (sin segunda 'o') → SUPLANTACIÓN

Authentication-Results: mx.google.com;
  dkim=fail (signature verification failed)
  spf=fail (domain does not designate 192.168.1.100 as permitted sender)
↑ ANÁLISIS: Falló DKIM y SPF → correo NO es auténtico del dominio declarado
```

#### 2.4 — Herramientas para Analizar Cabeceras
```
1. MXToolbox Header Analyzer (online):
   → https://mxtoolbox.com/EmailHeaders.aspx

2. Google Admin Toolbox (online):
   → https://toolbox.googleapps.com/apps/messageheader/

3. EmailHeader Analyzer (online):
   → https://emailheader.net/

4. Con Python (script forense):
import email
import re

with open('correo.eml', 'r') as f:
    msg = email.message_from_file(f)
    
# Extraer todos los headers
for key, value in msg.items():
    print(f"{key}: {value}")
    
# Extraer IPs de "Received" headers
received = msg.get_all('Received', [])
ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
for r in received:
    ips = re.findall(ip_pattern, r)
    print(f"IPs en Received: {ips}")
```

---

### MÓDULO 3 — Análisis con IPED (Correos en Disco)

```
IPED parsea automáticamente:
  ✅ Archivos .PST y .OST (Outlook)
  ✅ Archivos MBOX (Thunderbird)
  ✅ Archivos .EML individuales
  ✅ Archivos .MSG de Outlook
  ✅ Correos en caché del navegador

En el árbol de IPED:
  Categoría "Email" → ver todos los correos encontrados
  
Filtros útiles:
  - Por remitente: from:sospechoso@domain.com
  - Por destinatario: to:victima@domain.com  
  - Por fecha: [2024-01-01 TO 2024-12-31]
  - Por asunto: subject:"urgente" OR subject:"transferencia"
  - Buscar adjuntos: has:attachment
  
Exportar correos seleccionados:
  Right click → Export → EML Format (para presentar como evidencia)
  Generar hash SHA-256 de cada archivo exportado
```

---

### MÓDULO 4 — theHarvester (OSINT de Correos)

**Uso:** Recolectar correos electrónicos asociados a un dominio o persona como prueba de existencia

```bash
# Instalación
pip install theHarvester

# Buscar correos de un dominio
theHarvester -d empresa.com.ve -b google -l 200

# Buscar en múltiples fuentes
theHarvester -d empresa.com.ve -b google,bing,duckduckgo -l 100 -f reporte_correos

# Opciones:
# -d → dominio objetivo
# -b → motor de búsqueda (google, bing, yahoo, linkedin, etc.)
# -l → límite de resultados
# -f → guardar reporte

# ADVERTENCIA LEGAL: Solo usar sobre dominios sobre los que se tiene
# autorización judicial o son parte de la investigación
```

---

### MÓDULO 5 — Redacción del Informe de Correo Electrónico

```
SECCIÓN: ANÁLISIS DE CORREO ELECTRÓNICO

5.1 DESCRIPCIÓN DE LA EVIDENCIA
  - Archivo analizado: nombre_correo.eml
  - Hash SHA-256: [hash]
  - Fuente: [cuenta Gmail / archivo PST / servidor]
  - Fecha de adquisición: _______________

5.2 HALLAZGOS TÉCNICOS

5.2.1 Datos del Correo
  - Remitente declarado: _______________
  - IP de origen real: _______________
  - Fecha y hora (hora Venezuela VET): _______________
  - Asunto: _______________
  - Destinatarios: _______________

5.2.2 Autenticidad del Correo
  - SPF: [ ] Aprobado [ ] Fallido → Interpretación: _______________
  - DKIM: [ ] Aprobado [ ] Fallido → Interpretación: _______________
  - DMARC: [ ] Aprobado [ ] Fallido → Interpretación: _______________

5.2.3 Trayectoria del Correo (Received Headers)
  Salto 1: [IP] → [Servidor] — [Fecha/Hora]
  Salto 2: [IP] → [Servidor] — [Fecha/Hora]
  ...

5.3 CONCLUSIÓN TÉCNICA
  Con base en el análisis de las cabeceras técnicas del correo electrónico
  identificado como [descripción], se determinó que:
  [Conclusión sobre autenticidad, origen, alteración, etc.]
```

---

## Conceptos Clave para el Informe Pericial

| Término técnico | Explicación para el tribunal |
|---|---|
| **Spoofing de correo** | Falsificación del remitente para aparentar ser otra persona |
| **SPF fallido** | El servidor que envió el correo no está autorizado por el dominio declarado |
| **DKIM fallido** | La firma digital del correo no corresponde al dominio declarado |
| **IP origen** | Dirección numérica única del equipo o servidor que envió el correo |
| **Timestamp** | Registro de fecha y hora exacta de un evento digital |
| **Header/Cabecera** | Información técnica de enrutamiento embebida en el correo, no visible al usuario normal |
