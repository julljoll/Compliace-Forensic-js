# Análisis Forense — Android, WhatsApp y Aplicaciones Móviles

## Marco Legal Aplicable
- **MUCC Venezuela** — Capítulo de evidencias digitales móviles
- **LECDI Art. 20** — Violación de privacidad de datos
- **ISO/IEC 27037** — Adquisición de dispositivos móviles
- **COPP Art. 198** — Experticias sobre dispositivos electrónicos

---

## Niveles de Extracción Forense en Android

| Nivel | Método | Acceso | Herramienta |
|---|---|---|---|
| **Lógico** | ADB backup / export | Sin root | ADB, Andriller |
| **Sistema de Archivos** | ADB shell + root | Con root | IPED, Andriller, ADB |
| **Físico** | Imagen bit a bit | Root + modo EDL | dd, Avilla Forensics |
| **Chip-off** | Extracción hardware | Sin encender | Laboratorio especializado |

---

## CURSO: Extracción de WhatsApp en Android

### MÓDULO 1 — Verificación Inicial del Dispositivo

**Base Legal:** ISO/IEC 27037 — Identificación y preservación

```
Paso 1: DOCUMENTAR antes de tocar el teléfono
  □ Fotografiar pantalla frontal y trasera
  □ Registrar: marca, modelo, IMEI (si visible), número SIN si corresponde
  □ Verificar estado: encendido/apagado, nivel de batería, WiFi/datos activos

Paso 2: PONER EN MODO AVIÓN inmediatamente
  □ Activar modo avión para prevenir borrado remoto (Android Device Manager)
  □ Documentar hora exacta de activación
  □ Si el teléfono está apagado: NO encender sin Write Blocker de telefonía

Paso 3: Cargar en bolsa de Faraday (si se dispone)
  □ Previene señal celular y WiFi que puede modificar datos
```

---

### MÓDULO 2 — Extracción con Avilla Forensics (Herramienta Principal)

**Avilla Forensics** — Software especializado latinoamericano para extracción Android

```
Instalación:
→ Descargar desde repositorio oficial (requiere licencia o versión gratuita)
→ Instalar en PC Windows con drivers ADB

Habilitación de opciones en el teléfono:
Paso 1: Ajustes → Acerca del teléfono
Paso 2: Tocar "Número de compilación" 7 veces seguidas
Paso 3: Volver → Opciones de desarrollador (aparece nuevo menú)
Paso 4: Activar: "Depuración USB" (USB Debugging)
Paso 5: Conectar teléfono al PC → Autorizar conexión en el teléfono

En Avilla Forensics:
1. Detectar dispositivo conectado
2. Seleccionar tipo de extracción:
   - "Extracción Lógica" (sin root)
   - "Extracción de WhatsApp" (bases de datos + media)
3. Iniciar extracción
4. Esperar reporte con ruta de los archivos extraídos
5. CALCULAR HASH SHA-256 de los archivos extraídos
```

---

### MÓDULO 3 — Extracción Manual de WhatsApp con ADB

**Para cuando no se tiene Avilla Forensics o se requiere método verificable en tribunal**

#### 3.1 — Prerrequisitos
```bash
# Instalar ADB en Linux
sudo apt install adb -y

# Verificar conexión
adb devices
# Debe mostrar: XXXXXXXXXX   device
```

#### 3.2 — Extracción de base de datos WhatsApp (con root)
```bash
# Verificar si el teléfono tiene root
adb shell su -c "whoami"
# Si responde "root" → proceder

# Rutas importantes de WhatsApp en Android:
# /data/data/com.whatsapp/databases/msgstore.db (mensajes)
# /data/data/com.whatsapp/databases/wa.db (contactos)
# /sdcard/WhatsApp/Databases/ (backups)
# /sdcard/WhatsApp/Media/ (fotos, videos, documentos)

# Extraer base de datos de mensajes
adb shell su -c "cp /data/data/com.whatsapp/databases/msgstore.db /sdcard/msgstore.db"
adb pull /sdcard/msgstore.db ./evidencia/msgstore.db

# Extraer base de datos de contactos
adb shell su -c "cp /data/data/com.whatsapp/databases/wa.db /sdcard/wa.db"
adb pull /sdcard/wa.db ./evidencia/wa.db

# Calcular hash inmediatamente
sha256sum ./evidencia/msgstore.db | tee hashes_whatsapp.txt
sha256sum ./evidencia/wa.db | tee -a hashes_whatsapp.txt
```

#### 3.3 — Extracción de media de WhatsApp (sin root)
```bash
# WhatsApp guarda media en almacenamiento externo (accesible sin root)
adb pull /sdcard/WhatsApp/Media/ ./evidencia/whatsapp_media/

# Calcular hash de la carpeta completa
find ./evidencia/whatsapp_media/ -type f -exec sha256sum {} \; > hashes_media.txt
```

---

### MÓDULO 4 — Análisis de Base de Datos WhatsApp con IPED

```
Paso 1: En IPED, agregar los archivos .db extraídos como evidencia:
  File → Add Evidence → Add Files → seleccionar msgstore.db y wa.db

Paso 2: IPED parsea automáticamente WhatsApp si está habilitado en config:
  WhatsAppParser = true

Paso 3: En el árbol de categorías → "Chat" → WhatsApp
  - Ver conversaciones ordenadas por contacto
  - Ver media asociada
  - Ver mensajes borrados (si están en el DB)
  - Ver metadatos de cada mensaje (timestamp, estado de lectura)

Paso 4: Exportar conversaciones:
  - Right click → Export → HTML (para tribunal)
  - Incluir hash del export en el informe
```

#### Análisis Manual con SQLite Browser (alternativo)
```
Herramienta: DB Browser for SQLite (gratuito, https://sqlitebrowser.org/)

Tablas principales en msgstore.db:
  - messages → todos los mensajes
  - message_media → archivos adjuntos
  - jid → identificadores de contactos
  - chat → lista de conversaciones

Consulta SQL para exportar mensajes:
SELECT 
  datetime(timestamp/1000, 'unixepoch', 'localtime') as fecha,
  key_remote_jid as contacto,
  CASE key_from_me WHEN 1 THEN 'ENVIADO' ELSE 'RECIBIDO' END as tipo,
  data as mensaje
FROM messages
ORDER BY timestamp;
```

---

### MÓDULO 5 — Análisis con ALEAPP (Android Logs Events And Protobuf Parser)

**ALEAPP** es especialista en artefactos de Android y redes sociales

```bash
# Instalación
pip install aleapp

# Uso básico
python aleapp.py -t fs -i /ruta/extraccion_android/ -o /ruta/reporte/

# ALEAPP analiza automáticamente:
- WhatsApp (mensajes, contactos, grupos)
- Telegram
- Instagram
- Facebook Messenger
- Gmail
- Historial de ubicaciones GPS
- Registros de llamadas
- SMS/MMS
- Historial de WiFi
- Aplicaciones instaladas/desinstaladas
- Notificaciones del sistema
```

---

### MÓDULO 6 — Análisis de WhatsApp con WLEAPP

**WLEAPP** — WhatsApp Logs Events And Protobuf Parser (especializado en WhatsApp)

```bash
# Instalación
git clone https://github.com/abrignoni/WLEAPP.git
cd WLEAPP
pip install -r requirements.txt

# Uso
python wleapp.py -t fs -i /ruta/whatsapp_extract/ -o /ruta/reporte_whatsapp/

# Genera reporte HTML con:
- Todos los mensajes con timestamps
- Fotos y videos enviados/recibidos
- Archivos de audio
- Documentos compartidos
- Mensajes de estado
- Información de grupos
```

---

### MÓDULO 7 — Documentación y Cadena de Custodia Móvil

```
ACTA DE EXTRACCIÓN FORENSE — DISPOSITIVO MÓVIL

Fecha y hora de recepción del dispositivo: _______________
Número de caso: _______________
Perito actuante: _______________

IDENTIFICACIÓN DEL DISPOSITIVO:
  Tipo: [ ] Smartphone [ ] Tablet
  Marca/Modelo: _______________
  IMEI 1: _______________ IMEI 2: _______________
  Sistema Operativo: _______________  Versión: _______________
  Número telefónico (si aplica): _______________
  Estado al momento de recepción: [ ] Encendido [ ] Apagado [ ] Bloqueado
  Nivel de batería: ___%

MÉTODO DE EXTRACCIÓN:
  Herramienta: _______________ Versión: _______________
  Tipo de extracción: [ ] Lógica [ ] Física [ ] Sistema de Archivos
  Habilitación USB Debug: [ ] Sí [ ] No  Cómo: _______________

RESULTADOS:
  Tamaño total extraído: _______________ GB
  Hash SHA-256 de la extracción: _______________
  Ruta de almacenamiento: _______________

OBSERVACIONES (mensajes borrados, cifrado, daños físicos):
_______________

Firma del perito: _______________
Testigos: _______________
```

---

## Errores Comunes en Forense Móvil

❌ Encender teléfono apagado sin Write Blocker telefónico → modifica timestamps  
❌ Sincronizar WhatsApp o hacer backup en la nube antes de extraer → modifica BD  
❌ Olvidar modo avión → el dueño puede borrar remotamente  
❌ No anotar la versión de WhatsApp → la estructura de la BD cambia con versiones  
❌ Exportar chats desde WhatsApp directamente (no es válido judicialmente en Venezuela)  
❌ No calcular hash de cada archivo extraído  
