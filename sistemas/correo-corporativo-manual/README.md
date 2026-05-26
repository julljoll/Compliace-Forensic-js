# Manual de Análisis Forense de Correo Electrónico Corporativo

Guía de procedimiento técnico-jurídico paso a paso para el análisis forense de correos electrónicos corporativos, basada en los estándares ISO/IEC 27037:2012, ISO/IEC 27042:2015, NIST SP 800-101, MUCC-2017 y el marco legal venezolano (COPP, LMDF, LEDI).

---

## Índice

1. [Introducción](#1-introducción)
2. [Marco Normativo Aplicable](#2-marco-normativo-aplicable)
3. [Requerimientos Técnicos](#3-requerimientos-técnicos)
4. [Fase 1: Identificación y Preservación](#4-fase-1-identificación-y-preservación)
   - Paso 1: Identificar el correo como fuente de evidencia
   - Paso 2: Preservar el mensaje original intacto
   - Paso 3: Calcular hash SHA-256 del mensaje original
5. [Fase 2: Documentación Técnica](#5-fase-2-documentación-técnica)
   - Paso 4: Extraer y documentar encabezados SMTP completos
   - Paso 5: Documentar metadatos del mensaje
   - Paso 6: Establecer la cadena de custodia del correo
6. [Fase 3: Análisis Forense](#6-fase-3-análisis-forense)
   - Paso 7: Analizar el contenido del mensaje
   - Paso 8: Verificar autenticidad de adjuntos y enlaces
   - Paso 9: Documentar hallazgos con línea de tiempo
7. [Fase 4: Informe y Presentación](#7-fase-4-informe-y-presentación)
   - Paso 10: Redactar el informe pericial de correo electrónico
   - Paso 11: Cerrar el caso y generar reporte de auditoría
8. [Herramientas Recomendadas](#8-herramientas-recomendadas)
9. [Consideraciones Legales](#9-consideraciones-legales)
10. [Anexos](#10-anexos)

---

## 1. Introducción

El correo electrónico corporativo constituye una de las fuentes de evidencia digital más relevantes en investigaciones penales, laborales y civiles. Cada mensaje contiene no solo el contenido comunicacional, sino también metadatos técnicos (encabezados SMTP, rutas de transmisión, marcas de tiempo) que permiten reconstruir la cadena de comunicación y verificar su autenticidad.

Este manual describe el procedimiento técnico-jurídico estandarizado para el análisis forense de correos electrónicos corporativos, desde la identificación inicial hasta la emisión del dictamen pericial.

### 1.1 Objetivo

Establecer una metodología reproducible, legalmente sólida y técnicamente rigurosa para:
- Preservar la integridad del mensaje original
- Documentar la cadena de custodia de la evidencia
- Extraer y analizar metadatos técnicos (encabezados)
- Verificar autenticidad de adjuntos, firmas digitales y enlaces
- Generar un informe pericial con valor probatorio

### 1.2 Alcance

Aplica a:
- Correos electrónicos corporativos (cuentas empresariales)
- Proveedores: Exchange, Office 365, Gmail, Outlook, Thunderbird
- Formatos: .eml, .msg, .mbox, exportaciones PST/OST

---

## 2. Marco Normativo Aplicable

| Normativa | Descripción | Aplicación en el Procedimiento |
|-----------|-------------|-------------------------------|
| **ISO/IEC 27037:2012** | Directrices para identificación, recopilación, adquisición y preservación de evidencia digital | Pasos 1-4, 6, 8, 11 |
| **ISO/IEC 27042:2015** | Directrices para el análisis e interpretación de evidencia digital | Pasos 7, 9 |
| **NIST SP 800-101 r1** | Guidelines on Mobile Device Forensics (aplicación extensiva a correo) | Pasos 5, 9 |
| **MUCC-2017** | Manual Único de Cadena de Custodia de Evidencias (Venezuela) | Pasos 3, 6, 11 |
| **COPP Arts. 187-188** | Cadena de Custodia de Evidencias Digitales | Pasos 2, 6, 10 |
| **LMDF Art. 4-9** | Ley sobre Mensajes de Datos y Firmas Electrónicas — Eficacia probatoria | Pasos 4, 10 |
| **LEDI-2001** | Ley Especial de Delitos Informáticos | Paso 8 |

---

## 3. Requerimientos Técnicos

### 3.1 Hardware
- Estación de trabajo forense con capacidad de aislamiento de red
- Dispositivo de almacenamiento para copia forense (dispositivo de solo lectura)
- Bolsa Faraday para aislamiento del dispositivo fuente (si aplica)
- Cámara fotográfica para documentación visual

### 3.2 Software
- Cliente de correo con capacidad de exportación .eml/.msg (Thunderbird, Outlook)
- Herramienta de cálculo de hash (sha256sum, CertUtil, HashMyFiles)
- Visualizador de encabezados SMTP (MessageHeader, MXToolBox)
- Analizador de archivos adjuntos (sandbox, antivirus)
- Suite ofimática para documentación

### 3.3 Documentación Física
- Planilla PRCC (Registro de Cadena de Custodia)
- Acta de Obtención por Consignación
- Formularios de registro de evidencia
- Etiquetas y sellos de seguridad

---

## 4. Fase 1: Identificación y Preservación

### Paso 1 — Identificar el correo electrónico como fuente de evidencia

Identificar el mensaje de datos en su soporte original (bandeja, servidor, respaldo) sin alterar su contenido ni metadatos.

**Normativa aplicable:** ISO/IEC 27037:2012 — Identificación de evidencia digital

#### Procedimiento:

1. **Localizar el mensaje original** en la bandeja de correo del remitente o destinatario
2. **Verificar que sea el mensaje original** (no reenviado ni exportado previamente)
3. **No abrir adjuntos ni hacer clic en enlaces** durante la identificación
4. **Documentar la ubicación exacta** del mensaje:
   - Nombre de la bandeja (Bandeja de entrada, Enviados, Carpeta específica)
   - Ruta de acceso al servidor de correo
   - Tipo de cliente de correo utilizado
5. **Tomar captura de pantalla** del mensaje en su contexto original (lista de mensajes)
6. **Registrar en la bitácora** con fecha, hora y responsable

#### Checklist:

- [ ] Mensaje localizado en su ubicación original
- [ ] Captura de pantalla del contexto tomada
- [ ] Ubicación documentada en bitácora

---

### Paso 2 — Preservar el mensaje original intacto

Realizar copia forense bit a bit del contenedor del correo o exportar el archivo .eml/.msg sin alterar cabeceras ni metadatos. Almacenar el original en custodia.

**Normativa aplicable:** ISO/IEC 27037:2012 — Preservación · Art. 187 COPP — Cadena de Custodia

#### Procedimiento:

1. **Exportar el mensaje en formato original:**
   - Outlook: Guardar como `.msg`
   - Thunderbird: Guardar como `.eml`
   - Gmail/Web: Usar función "Descargar original" (.eml)
2. **Verificar que la exportación no modifique cabeceras:**
   - Comparar el hash del mensaje exportado con el original (si es posible)
   - Verificar que los encabezados completos estén presentes
3. **Crear al menos dos copias:**
   - **Copia de trabajo:** Para análisis
   - **Copia de resguardo:** Almacenada en custodia sellada
4. **Etiquetar físicamente el medio de almacenamiento** con:
   - N° de caso
   - Fecha y hora de la copia
   - Nombre del perito responsable
   - Hash del archivo
5. **Almacenar el original en custodia segura:**
   - Sobre cerrado o contenedor sellado
   - Firma y fecha en el sello
   - Registrar en la PRCC

#### Checklist:

- [ ] Archivo exportado en formato original (.eml/.msg)
- [ ] Cabeceras verificadas (sin alteración)
- [ ] Copia de trabajo creada
- [ ] Copia de resguardo almacenada
- [ ] Medio etiquetado y sellado

---

### Paso 3 — Calcular hash SHA-256 del mensaje original

Calcular el hash criptográfico del archivo de correo original (.eml/.msg) como sello de integridad. Registrar en la cadena de custodia.

**Normativa aplicable:** ISO/IEC 27037:2012 — Integridad · MUCC-2017

#### Procedimiento:

1. **Calcular hash SHA-256** del archivo original:
   ```bash
   # Linux/macOS
   sha256sum mensaje_original.eml
   
   # Windows (PowerShell)
   Get-FileHash -Algorithm SHA256 mensaje_original.eml
   
   # Windows (CMD)
   certutil -hashfile mensaje_original.eml SHA256
   ```
2. **Calcular hash MD5** como respaldo:
   ```bash
   Get-FileHash -Algorithm MD5 mensaje_original.eml
   ```
3. **Calcular hash de la copia de trabajo** y verificar que coincida:
   ```bash
   Get-FileHash -Algorithm SHA256 copia_trabajo.eml
   ```
4. **Registrar ambos hashes en la cadena de custodia:**
   - Fecha y hora del cálculo
   - Nombre del perito
   - Algoritmo utilizado
5. **Firmar digitalmente el registro** (si aplica)

#### Checklist:

- [ ] SHA-256 del original calculado y registrado
- [ ] MD5 del original calculado y registrado
- [ ] Hash de la copia verificado (coincide con original)
- [ ] Hashes registrados en la PRCC

---

## 5. Fase 2: Documentación Técnica

### Paso 4 — Extraer y documentar encabezados SMTP completos

Extraer todos los encabezados del mensaje (Received, From, To, Date, Message-ID, DKIM-Signature, SPF, etc.) y documentar la ruta del correo.

**Normativa aplicable:** ISO/IEC 27037:2012 — Recopilación · LMDF Art. 4 — Eficacia probatoria

#### Procedimiento:

1. **Acceder a los encabezados completos del mensaje:**
   - **Outlook:** Abrir mensaje → Archivo → Propiedades → Encabezados de Internet
   - **Thunderbird:** Ver → Código fuente del mensaje
   - **Gmail:** Abrir mensaje → Más (⋮) → Mostrar original
   - **Archivo .eml:** Abrir con bloc de notas o visor de encabezados
2. **Extraer y documentar los siguientes campos:**
   - **Received:** Cada salto de servidor con IP, timestamp y hostname
   - **From:** Dirección del remitente (verificar contra encabezados)
   - **To / CC / BCC:** Destinatarios
   - **Date:** Fecha y hora con zona horaria
   - **Message-ID:** Identificador único del mensaje
   - **DKIM-Signature:** Firma DKIM (dominio, selector, hash)
   - **SPF:** Resultado de verificación SPF
   - **Authentication-Results:** Resultados de autenticación DMARC
3. **Reconstruir la ruta:** Analizar la secuencia de servidores "Received" en orden inverso
4. **Verificar consistencia:** Comparar IPs, timestamps y dominios entre saltos

#### Campos obligatorios a documentar:

| Campo | Descripción | Dónde encontrarlo |
|-------|-------------|-------------------|
| Message-ID | Identificador único global | Encabezados |
| From | Remitente | Encabezados / Cuerpo |
| To | Destinatario(s) | Encabezados / Cuerpo |
| Date | Fecha emisión | Encabezados |
| Subject | Asunto | Encabezados / Cuerpo |
| Received | Ruta de servidores | Encabezados (múltiples) |
| DKIM-Sig | Firma digital DKIM | Encabezados |
| SPF | SPF check | Encabezados / auth results |
| Content-Type | Tipo MIME / multipart | Encabezados |
| X-Mailer | Cliente de correo usado | Encabezados |

#### Checklist:

- [ ] Encabezados completos exportados a archivo de texto
- [ ] Ruta de servidores Received documentada
- [ ] Verificación DKIM/SPF realizada
- [ ] Message-ID registrado
- [ ] Anomalías en encabezados identificadas (si las hay)

---

### Paso 5 — Documentar metadatos del mensaje

Registrar: remitente, destinatarios, fecha/hora (con zona horaria), Message-ID, tamaño, adjuntos, cliente de correo. Verificar autenticidad DKIM/SPF si aplica.

**Normativa aplicable:** NIST SP 800-101 — Metadatos de evidencia digital

#### Procedimiento:

1. **Crear ficha técnica del mensaje con:**
   - **Remitente:** Nombre y dirección de correo completa
   - **Destinatarios:** Lista completa (To, CC, BCC si visible)
   - **Fecha/Hora UTC:** Convertir la fecha local a UTC
   - **Message-ID:** Identificador único
   - **Tamaño:** En bytes
   - **Tipo MIME:** text/plain, text/html, multipart/mixed, etc.
   - **Cliente de correo:** Extraer de X-Mailer o User-Agent
   - **Adjuntos:** Lista de nombres, tamaños y tipos
2. **Verificar autenticación del dominio:**
   - **DKIM (DomainKeys Identified Mail):** Verificar firma criptográfica
   - **SPF (Sender Policy Framework):** Verificar IP del remitente
   - **DMARC:** Verificar política de alineación
3. **Registrar resultados de autenticación** (pass/fail para cada mecanismo)
4. **Documentar cualquier anomalía:**
   - Encabezados inconsistentes
   - Discrepancias en fechas
   - SPF/DKIM fallidos

#### Checklist:

- [ ] Ficha técnica del mensaje creada
- [ ] Fecha convertida a UTC
- [ ] DKIM verificado (pass/fail)
- [ ] SPF verificado (pass/fail)
- [ ] DMARC verificado (pass/fail)
- [ ] Anomalías documentadas

---

### Paso 6 — Establecer la cadena de custodia del correo

Documentar quién, cuándo y cómo obtuvo el acceso al correo. Registrar cada transferencia de custodia con fechas, firmas y motivos.

**Normativa aplicable:** Art. 187-188 COPP · MUCC-2017 — Cadena de Custodia

#### Procedimiento:

1. **Registrar el primer acceso al mensaje:**
   - Quién identificó el correo como evidencia
   - Fecha y hora exacta
   - Método de acceso (lectura directa, exportación, copia forense)
2. **Documentar cada transferencia de custodia:**
   - De quién a quién
   - Fecha y hora de la transferencia
   - Motivo de la transferencia
   - Firma de ambas partes
3. **Mantener un registro continuo:**
   - Cada vez que el archivo se mueva, copie o procese
   - Cada persona que acceda al archivo
   - Cada herramienta que procese el archivo
4. **Completar la Planilla PRCC:**
   - Datos del caso
   - N° PRCC
   - Descripción de la evidencia
   - Forma de obtención (Consignación)
   - Fechas y firmas

#### Checklist:

- [ ] Primer acceso documentado
- [ ] Cada transferencia registrada
- [ ] PRCC completada y firmada
- [ ] Cadena de custodia ininterrumpida

---

## 6. Fase 3: Análisis Forense

### Paso 7 — Analizar el contenido del mensaje

Extraer el cuerpo del mensaje, firmas digitales, archivos adjuntos y enlaces. Documentar hallazgos relevantes para la investigación.

**Normativa aplicable:** ISO/IEC 27042:2015 — Análisis e interpretación

#### Procedimiento:

1. **Extraer el cuerpo del mensaje:**
   - Separar partes HTML y texto plano
   - Identificar el contenido relevante
   - Traducir si es necesario (documentar traducción)
2. **Identificar y catalogar adjuntos:**
   - Nombre, tamaño, tipo MIME, hash SHA-256
   - No abrir adjuntos directamente (usar sandbox)
3. **Extraer enlaces (URLs):**
   - Lista completa de enlaces contenidos
   - URLs acortadas (expandir antes de analizar)
   - Dominios de destino
4. **Identificar firmas digitales:**
   - Firma en el cuerpo del mensaje
   - Certificados S/MIME si aplica
   - Verificar cadena de certificación
5. **Documentar hallazgos relevantes:**
   - Citas textuales relevantes (con su contexto)
   - Metadatos de adjuntos (autor, fecha creación)
   - Relación con otros elementos de la investigación

#### Checklist:

- [ ] Cuerpo del mensaje extraído y documentado
- [ ] Adjuntos catalogados con hash
- [ ] Enlaces extraídos y expandidos
- [ ] Firmas digitales verificadas
- [ ] Hallazgos relevantes documentados

---

### Paso 8 — Verificar autenticidad de adjuntos y enlaces

Analizar archivos adjuntos en busca de malware, metadatos ocultos o alteraciones. Verificar la legitimidad de los enlaces contenidos.

**Normativa aplicable:** ISO/IEC 27037:2012 · LEDI — Delitos Informáticos

#### Procedimiento:

1. **Análisis de adjuntos:**
   - Escanear con antivirus actualizado
   - Analizar en sandbox (Cuckoo, Joe Sandbox)
   - Verificar hashes contra bases de datos de malware
   - Extraer metadatos (autor, fecha, versiones)
2. **Verificación de enlaces:**
   - Expandir URLs acortadas (bit.ly, tinyurl, etc.)
   - Verificar dominios contra listas de phishing/malware
   - Resolver DNS y verificar IP de destino
   - NO hacer clic directo en enlaces
3. **Detección de manipulación:**
   - Verificar integridad de adjuntos (hash vs. declarado)
   - Buscar esteganografía (si es relevante)
   - Identificar metadatos inconsistentes
4. **Documentar resultados:**
   - Archivos limpios / infectados
   - URLs legítimas / sospechosas
   - Metadatos relevantes encontrados

#### Checklist:

- [ ] Adjuntos escaneados con antivirus
- [ ] Adjuntos analizados en sandbox
- [ ] Hashes verificados contra bases de malware
- [ ] URLs expandidas y verificadas
- [ ] Resultados documentados

---

### Paso 9 — Documentar hallazgos con línea de tiempo

Crear una línea de tiempo forense con todos los eventos: recepción, reenvíos, apertura de adjuntos, respuestas. Correlacionar con otras evidencias.

**Normativa aplicable:** ISO/IEC 27042:2015 — Interpretación · NIST SP 800-101

#### Procedimiento:

1. **Construir la línea de tiempo base:**
   - Fecha/hora de envío (del encabezado Date)
   - Fecha/hora de recepción en cada servidor (Received)
   - Marcas de tiempo de reenvíos y respuestas
2. **Correlacionar con otras evidencias:**
   - Registros de acceso al servidor de correo
   - Logs de firewall/proxy
   - Otros correos en la misma cadena
   - Registros telefónicos o de mensajería
3. **Identificar anomalías temporales:**
   - Discrepancias entre fechas de encabezados
   - Mensajes con timestamps inconsistentes
   - Reenvíos sospechosos
4. **Crear representación visual:**
   - Diagrama de línea de tiempo
   - Tabla cronológica de eventos
   - Mapa de relaciones entre involucrados

#### Formato de línea de tiempo:

| Timestamp (UTC) | Evento | Fuente | Evidencia Relacionada |
|-----------------|--------|--------|-----------------------|
| 2026-05-20 10:30:00 | Mensaje enviado | From header | Correo original |
| 2026-05-20 10:30:05 | Recibido por smtp.empresa.com | Received header | Log servidor |
| 2026-05-20 10:31:00 | Entregado a bandeja destino | Received header | Log servidor |
| 2026-05-20 14:15:00 | Adjunto abierto | Metadatos adjunto | Archivo temporal |

#### Checklist:

- [ ] Línea de tiempo base creada
- [ ] Eventos correlacionados con otras evidencias
- [ ] Anomalías temporales identificadas
- [ ] Representación visual generada

---

## 7. Fase 4: Informe y Presentación

### Paso 10 — Redactar el informe pericial de correo electrónico

Elaborar dictamen pericial con: metodología, cadena de custodia, hallazgos técnicos, hash de integridad, conclusiones y firma digital.

**Normativa aplicable:** Art. 187 COPP · LMDF Art. 4-9 — Valor probatorio

#### Estructura del dictamen:

1. **Encabezado:**
   - N° de dictamen
   - Fecha de emisión
   - Datos del perito (nombre, credencial, cargo)
   - N° de caso y expediente

2. **Identificación de la evidencia:**
   - Message-ID del correo
   - Hash SHA-256
   - Fecha y hora del mensaje
   - Remitente y destinatarios

3. **Metodología aplicada:**
   - Normativa utilizada (ISO 27037, ISO 27042, NIST, MUCC, COPP)
   - Herramientas forenses empleadas
   - Procedimiento seguido

4. **Cadena de custodia:**
   - N° PRCC
   - Registro de transferencias
   - Sellos y firmas

5. **Hallazgos técnicos:**
   - Encabezados SMTP completos
   - Resultados de autenticación (DKIM/SPF/DMARC)
   - Análisis de adjuntos y enlaces
   - Línea de tiempo forense

6. **Conclusiones:**
   - Hechos técnicamente demostrados
   - Nivel de confianza de los hallazgos
   - Limitaciones del análisis

7. **Firma digital del perito**

#### Checklist:

- [ ] Dictamen redactado con estructura completa
- [ ] Encabezados y metadatos incluidos
- [ ] Hallazgos documentados con soporte técnico
- [ ] Conclusiones claras y fundamentadas
- [ ] Dictamen firmado digitalmente

---

### Paso 11 — Cerrar el caso y generar reporte de auditoría

Completar todos los pasos. Generar el reporte final de auditoría con la línea de tiempo completa de todas las acciones realizadas.

**Normativa aplicable:** MUCC-2017 · ISO/IEC 27037:2012

#### Procedimiento:

1. **Verificar completitud:**
   - Todos los pasos 1-10 completados
   - Checklist de cada paso firmado
   - Evidencia debidamente preservada
2. **Generar reporte de auditoría:**
   - Resumen del caso
   - Línea de tiempo completa de acciones
   - Lista de todos los archivos y hashes
   - Registro de acceso a la evidencia
3. **Preparar el expediente final:**
   - Dictamen pericial
   - PRCC firmada
   - Acta de Obtención
   - Copia de la evidencia (en medio sellado)
   - Anexos técnicos (encabezados, hashes, capturas)
4. **Entregar resultados:**
   - Programar entrega con el consignante
   - Completar Acta de Entrega de Resultados
   - Obtener firma de recibido conforme

#### Checklist:

- [ ] Todos los pasos completados y verificados
- [ ] Reporte de auditoría generado
- [ ] Expediente completo preparado
- [ ] Acta de Entrega firmada

---

## 8. Herramientas Recomendadas

### Extracción y visualización de encabezados

| Herramienta | Descripción | Plataforma |
|-------------|-------------|------------|
| MessageHeader | Analizador de encabezados SMTP | Web |
| MXToolBox | Verificación de encabezados y autenticación | Web |
| Thunderbird | Cliente de correo con visor de código fuente | Windows/Mac/Linux |
| Outlook | Exportación .msg y propiedades del mensaje | Windows/Mac |

### Cálculo de hash

| Herramienta | Descripción | Plataforma |
|-------------|-------------|------------|
| CertUtil | Hash SHA-256/MD5 integrado en Windows | Windows |
| Get-FileHash | PowerShell cmdlet | Windows |
| sha256sum | Herramienta estándar UNIX | Linux/macOS |
| HashMyFiles | Hash múltiple con interfaz gráfica | Windows |

### Análisis de adjuntos y enlaces

| Herramienta | Descripción | Plataforma |
|-------------|-------------|------------|
| VirusTotal | Escaneo de archivos y URLs | Web |
| Cuckoo Sandbox | Sandbox automatizado | Linux |
| Joe Sandbox | Análisis avanzado de malware | Web/API |
| Hybrid Analysis | Análisis de archivos sospechosos | Web |
| URLScan.io | Análisis de URLs y dominios | Web |

### Documentación y dictamen

| Herramienta | Descripción |
|-------------|-------------|
| SHA256.US Planilla PRCC | Registro de Cadena de Custodia |
| SHA256.US Acta Dictamen | Plantilla de dictamen pericial |
| SHA256.US Acta Entrega | Acta de entrega de resultados |
| Microsoft Word / LibreOffice | Procesador de texto para dictamen |

---

## 9. Consideraciones Legales

### 9.1 Venezuela

- **COPP Art. 187:** La cadena de custodia de evidencias digitales debe ser ininterrumpida y documentada
- **LMDF Art. 4:** Los mensajes de datos tienen eficacia probatoria
- **LMDF Art. 9:** Las firmas electrónicas tienen la misma validez que las manuscritas
- **LEDI-2001:** Tipifica delitos informáticos (acceso indebido, sabotaje, etc.)
- **MUCC-2017:** Establece el procedimiento estándar de cadena de custodia

### 9.2 Internacional

- **ISO/IEC 27037:2012:** Directrices para manejo de evidencia digital
- **ISO/IEC 27042:2015:** Directrices para análisis e interpretación
- **NIST SP 800-101:** Guía para forensia en dispositivos móviles (aplicable extensivamente a correo electrónico)

### 9.3 Protección de Datos

- La evidencia de correo corporativo puede contener datos personales de terceros
- Limitar el análisis al alcance autorizado en el Acta de Obtención
- No divulgar información no relacionada con la investigación
- Cumplir con las leyes de protección de datos aplicables (LOPDP, GDPR si aplica)

---

## 10. Anexos

### A. Formato de ficha técnica del mensaje

```
┌─────────────────────────────────────────────────┐
│         FICHA TÉCNICA DEL MENSAJE               │
├─────────────────────────────────────────────────┤
│ Message-ID:    <abc123@mail.empresa.com>        │
│ From:          remitente@empresa.com            │
│ To:            destinatario@empresa.com         │
│ CC:            copia@empresa.com                │
│ Date (UTC):    2026-05-20 14:30:00              │
│ Subject:       Re: Contrato N° 1234             │
│ Size:          245,678 bytes                    │
│ MIME-Type:     multipart/mixed                  │
│ X-Mailer:      Microsoft Outlook 16.0           │
│ Adjuntos:      3 (contrato.pdf, factura.pdf,    │
│                imagen.jpg)                      │
│ DKIM:          pass (d=empresa.com)             │
│ SPF:           pass (ip=203.0.113.50)           │
│ DMARC:         pass                             │
└─────────────────────────────────────────────────┘
```

### B. Glosario

| Término | Definición |
|---------|------------|
| **SMTP** | Simple Mail Transfer Protocol — Protocolo de envío de correo |
| **DKIM** | DomainKeys Identified Mail — Firma digital de dominio |
| **SPF** | Sender Policy Framework — Verificación de IP autorizada |
| **DMARC** | Domain-based Message Authentication, Reporting & Conformance |
| **Message-ID** | Identificador único global del mensaje |
| **MIME** | Multipurpose Internet Mail Extensions — Formato de contenido |
| **Hash** | Función criptográfica unidireccional (SHA-256, MD5) |
| **PRCC** | Planilla de Registro de Cadena de Custodia |

---

*Documento generado bajo los estándares del Manual Único de Cadena de Custodia de Evidencias (V. 2017)*  
*SHA256 Forensic Lab — Tecnología al servicio de la justicia.*  
*Normativa aplicable: ISO/IEC 27037:2012 · ISO/IEC 27042:2015 · NIST SP 800-101 · MUCC-2017 · COPP Art. 187-188 · LMDF*
