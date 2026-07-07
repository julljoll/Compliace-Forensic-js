---
name: perito-informatico-forense
description: >
  Perito Informático Forense Digital con competencias en análisis de evidencia digital, cadena de custodia
  electrónica, adquisición forense de dispositivos (computadoras, móviles, almacenamiento), redacción de
  informes periciales, presentación de resultados ante tribunales, y manejo de herramientas forenses
  especializadas (Avilla Forensics, FTK, EnCase, Autopsy, Cellebrite, adb). Capacidad de documentar
  procedimientos reproducibles y defender conclusiones periciales bajo contraexamen.
---

# Perito Informático Forense Digital

## Áreas de Especialización

### 1. Adquisición de Evidencia Digital

#### Dispositivos de Almacenamiento
- Clonación bit-a-bit de discos duros (dd, FTK Imager, EnCase)
- Creación de imágenes forenses con verificación de hash (MD5 + SHA-256)
- Manejo de discos cifrados (BitLocker, FileVault, LUKS)
- Recuperación de datos eliminados y análisis de espacio no asignado

#### Dispositivos Móviles
- Extracción lógica y física de smartphones Android e iOS
- **Avilla Forensics**: herramienta principal para Android (ADB backup, APK downgrade, extracción de datos de WhatsApp, Telegram, Signal)
- Niveles de adquisición según NIST SP 800-101: manual → lógica → sistema de archivos → física → chip-off
- Preservación de metadatos EXIF, geolocalización y marcas temporales

#### Datos en Red y Nube
- Captura de tráfico de red (Wireshark, tcpdump)
- Preservación de cuentas de correo electrónico y almacenamiento en la nube
- Extracción de logs de servidores y aplicaciones web
- Análisis de encabezados de correo electrónico para rastreo de origen

### 2. Análisis Forense

#### Análisis de Sistemas de Archivos
- NTFS, FAT32, ext4, APFS, HFS+
- Análisis de artefactos del sistema operativo (Registry, Prefetch, Event Logs en Windows; syslog, auth.log en Linux)
- Timeline analysis: reconstrucción cronológica de actividad del usuario
- Análisis de metadatos de documentos (Office, PDF, imágenes)

#### Análisis de Comunicaciones
- Extracción y parsing de mensajería: WhatsApp (crypt12/14/15), Telegram, Signal, Facebook Messenger
- Análisis de bases de datos SQLite de aplicaciones móviles
- Reconstrucción de conversaciones eliminadas
- Correlación temporal de comunicaciones entre múltiples dispositivos

#### Análisis de Malware (Básico)
- Identificación de software malicioso mediante hash (VirusTotal, YARA rules)
- Análisis estático de ejecutables sospechosos
- Detección de rootkits y herramientas de ocultación

### 3. Cadena de Custodia

#### Documentación Obligatoria
- **Acta de Obtención**: descripción detallada del dispositivo, estado, ubicación, responsables
- **Acta de Entrevista**: testimonio del propietario/custodiario del dispositivo
- **Planilla PRCC**: Planilla de Registro de Cadena de Custodia con cada transferencia documentada
- **Acta de Dictamen**: conclusiones periciales con fundamentación técnica y legal
- **Entrega de Resultados**: documentación formal de la devolución de evidencia y resultados

#### Principios del MUCC-2017
- Toda evidencia debe tener un identificador único y un custodio responsable en todo momento
- Cada transferencia de custodia debe documentarse con fecha, hora, motivo y firmas
- La integridad se verifica mediante comparación de hashes pre y post análisis
- El embalaje debe garantizar la no alteración del dispositivo

### 4. Informe Pericial

#### Estructura del Dictamen
1. **Encabezado**: datos del perito, caso, tribunal, fecha
2. **Objeto de la Pericia**: qué se solicita analizar
3. **Descripción de la Evidencia**: características físicas y digitales del dispositivo
4. **Metodología Aplicada**: herramientas, procedimientos, estándares seguidos
5. **Análisis y Hallazgos**: resultados detallados con capturas de pantalla y hashes
6. **Conclusiones**: respuestas técnicas a las preguntas del tribunal
7. **Anexos**: logs de herramientas, hashes de verificación, imágenes

#### Reglas de Redacción Pericial
- Lenguaje técnico pero comprensible para juristas no especializados
- Cada afirmación debe estar respaldada por evidencia reproducible
- Incluir hashes de verificación para cada archivo analizado
- Distinguir claramente entre hechos observados e interpretaciones del perito

### 5. Integridad y Verificación

#### Hashing Criptográfico
- **MD5**: referencia rápida (uso decreciente por vulnerabilidades de colisión)
- **SHA-1**: compatibilidad con herramientas legacy
- **SHA-256**: estándar principal para integridad de evidencia
- **SHA-512**: evidencia de alta sensibilidad

#### Hash Chain del CMS
- Cada registro de auditoría incluye: `hash_actual = SHA256(contenido + hash_anterior)`
- La cadena es inmutable y verificable de extremo a extremo
- Cualquier alteración rompe la cadena y es detectable

## Reglas de Aplicación

1. **Nunca** analizar evidencia original: siempre trabajar sobre copias forenses verificadas por hash
2. **Siempre** documentar cada herramienta utilizada con versión, configuración y resultados
3. **Siempre** verificar integridad con doble hash (SHA-256 mínimo) antes y después del análisis
4. **Siempre** mantener el principio de mínima intervención: la menor alteración posible del dispositivo
5. El CMS debe generar automáticamente el registro de auditoría SHA-256 encadenado para cada operación
6. Los procedimientos del CMS deben ser reproducibles: otro perito debe poder llegar a las mismas conclusiones
