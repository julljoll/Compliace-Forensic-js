# Análisis Forense Android + WhatsApp — Venezuela

## Marco Legal Aplicable
- Art. 187 COPP: Cadena de custodia del dispositivo móvil
- Art. 205 COPP: Inspección de personas y objetos con autorización
- Art. 204 COPP: Allanamiento si el dispositivo está en una propiedad
- LECDI Art. 6: Acceso indebido a sistemas (lo que el perito NO debe hacer sin orden)
- ISO/IEC 27037: Adquisición de dispositivos móviles

## Niveles de Extracción (de menos a más invasivo)

| Nivel | Método | Herramienta | Datos Obtenidos |
|---|---|---|---|
| 1. Lógico | ADB backup | ADB | Apps, contactos, SMS, WhatsApp (si no encriptado) |
| 2. Sistema de archivos | ADB root | ADB + root | Archivos de sistema, bases de datos apps |
| 3. Físico | Chip-off / JTAG | Avilla Forensics | Imagen completa del almacenamiento |

---

## PROCEDIMIENTO CON AVILLA FORENSICS

### Prerrequisitos
```
□ Dispositivo Android con batería > 50%
□ Cable USB original o certificado
□ Avilla Forensics instalado en PC forense
□ Habilitar Depuración USB en el dispositivo (Opciones de desarrollador)
□ Bloqueador de escritura activado (para extracción física)
□ Formulario de cadena de custodia preparado
```

### Paso 1: Documentación Inicial
```
□ Fotografiar el dispositivo (frente, dorso, IMEI visible)
□ Registrar: marca, modelo, IMEI, número de serie, versión Android
□ Registrar estado de la batería, estado del bloqueo de pantalla
□ Documentar en formulario de cadena de custodia
□ Calcular hash del dispositivo si es posible (Avilla lo hace automáticamente)
```

### Paso 2: Extracción con Avilla Forensics
```
1. Abrir Avilla Forensics
2. Conectar dispositivo USB → Avilla detecta automáticamente
3. Seleccionar tipo de extracción:
   - "Extracción Lógica" → para casos sin acceso root
   - "Extracción AFLogical" → datos de apps específicas
   - "Extracción ADB" → sistema de archivos (requiere root)
4. Seleccionar aplicaciones a extraer (WhatsApp, Telegram, etc.)
5. Definir carpeta de destino del caso
6. Iniciar extracción → Avilla genera automáticamente:
   - Archivo contenedor de evidencias
   - Log de extracción
   - Hash SHA-256 de la extracción
7. Verificar que el hash generado es correcto
8. Documentar en cadena de custodia
```

---

## EXTRACCIÓN MANUAL DE WHATSAPP (método alternativo)

### Bases de Datos WhatsApp en Android
```
Ubicación en el dispositivo:
/data/data/com.whatsapp/databases/
  ├── msgstore.db          → todos los mensajes
  ├── wa.db               → contactos
  ├── axolotl.db          → claves de encriptación
  └── chatsettings.db     → configuración de chats

Backup en almacenamiento externo:
/sdcard/WhatsApp/Databases/
  ├── msgstore.db.crypt14  → backup encriptado
  └── msgstore-AAAA-MM-DD.db.crypt14 → backups anteriores
```

### Extracción vía ADB (con permisos root)
```bash
# Habilitar ADB
adb devices  # verificar que el dispositivo aparece

# Extraer base de datos de mensajes
adb shell "su -c 'cp /data/data/com.whatsapp/databases/msgstore.db /sdcard/'"
adb pull /sdcard/msgstore.db /casos/caso_001/whatsapp/

# Extraer todos los archivos WhatsApp
adb pull /sdcard/WhatsApp/ /casos/caso_001/whatsapp_media/

# Calcular hash de lo extraído
sha256sum /casos/caso_001/whatsapp/msgstore.db > /casos/caso_001/hashes_whatsapp.txt
```

### Análisis con IPED
```bash
# Procesar el backup/extracción con IPED
java -jar iped.jar \
  -d /casos/caso_001/whatsapp/ \
  -o /casos/caso_001/iped_whatsapp/ \
  -profile forensic

# IPED parsea automáticamente:
# - msgstore.db → conversaciones con fechas/horas UTC
# - wa.db → contactos con números de teléfono
# - Multimedia → imágenes, videos, audios con metadatos
```

---

## ANÁLISIS DE CONVERSACIONES — QUÉ BUSCAR

### Para casos de fraude/extorsión:
```
En IPED → type:WhatsApp
Buscar: montos, transferencias, "paga", "debes", "amenaza"
Exportar conversaciones relevantes con marcas de tiempo
Verificar metadatos de imágenes enviadas (ExifTool: GPS, fecha de captura)
```

### Para casos de acoso/violencia:
```
Exportar hilo de mensajes completo con timestamps
Identificar número de teléfono remitente → cruzar con wa.db
Preservar capturas de pantalla como evidencia complementaria
Documentar si mensajes fueron eliminados (aparecen en IPED como "deleted")
```

### Informe de Conversación WhatsApp
Para cada conversación relevante documentar:
- Número de teléfono o nombre del contacto
- Fecha y hora del primer y último mensaje (UTC y hora Venezuela GMT-4)
- Número total de mensajes
- Contenido de mensajes relevantes
- Estado: enviado / entregado / leído / eliminado
- Hash del archivo msgstore.db analizado
