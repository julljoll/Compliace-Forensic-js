# Cadena de Custodia Digital — Marco Legal Venezuela

## Base Legal Fundamental

### COPP — Artículos Clave
- **Art. 187**: Define la cadena de custodia como obligatoria para toda evidencia física o digital
- **Art. 223**: Regula las experticias y su valor probatorio
- **Art. 225**: El perito debe actuar "conforme a los principios o reglas de su ciencia o arte" → incluye ISO
- **Art. 181**: Nulidad de pruebas obtenidas ilegalmente

### Manual Único de Cadena de Custodia de Evidencias Físicas (2017)
Aplicado mediante Protocolo Anexo del Compendio 2022. Establece:
1. Definición legal de cadena de custodia
2. Fases: fijación, colección, embalaje, preservación, traslado, análisis, almacenamiento
3. Formularios oficiales requeridos
4. Funcionarios autorizados para cada fase

### ISO/IEC 27037:2012 — Fases de Evidencia Digital
1. **Identificación**: Reconocer objetos con potencial de evidencia digital
2. **Recolección**: Recoger dispositivos físicos y copias documentadas
3. **Adquisición**: Crear copias forenses verificables
4. **Preservación**: Mantener integridad y autenticidad

---

## Procedimiento Estándar de Cadena de Custodia Digital

### FASE 1: En el Sitio del Suceso

**Antes de tocar cualquier dispositivo:**
```
□ Fotografiar el escenario completo (3 distancias: general, media, detalle)
□ Documentar estado de todos los dispositivos (encendido/apagado)
□ Llenar Formulario de Inspección Ocular Técnica
□ Asignar número de caso y código de evidencia
```

**Si el dispositivo está ENCENDIDO:**
```
□ Fotografiar pantalla visible
□ NO apagar si hay posibilidad de extraer RAM
□ Considerar extracción de memoria volátil (Volatility/LiME)
□ Si se va a apagar: documentar exactamente cómo y por qué
```

**Si el dispositivo está APAGADO:**
```
□ NO encender bajo ninguna circunstancia
□ Proceder directamente a embalaje y traslado
```

### FASE 2: Embalaje

```
□ Bolsa antiestática para discos duros y dispositivos electrónicos
□ Caja rígida para transporte
□ Precinto numerado + firma del responsable
□ Etiqueta con: número de caso, descripción, fecha/hora, responsable
□ Formulario de Cadena de Custodia firmado
```

### FASE 3: En el Laboratorio — Adquisición

**Verificación antes de conectar:**
```bash
# 1. Conectar bloqueador de escritura HARDWARE (Tableau, WiebeTech, etc.)
# 2. Verificar que el bloqueador está activo
# 3. Calcular hash del original ANTES de adquirir
sha256sum /dev/sdb > hash_original_ANTES.txt
md5sum /dev/sdb >> hash_original_ANTES.txt
```

**Adquisición con dd:**
```bash
# Crear imagen forense
dd if=/dev/sdb of=/casos/caso_001/evidencia_001.dd bs=512 conv=noerror,sync status=progress

# Verificar integridad post-adquisición
sha256sum /casos/caso_001/evidencia_001.dd > hash_imagen.txt
sha256sum /dev/sdb >> hash_original_DESPUES.txt

# Los hash ANTES y DESPUÉS del original deben ser IDÉNTICOS
# El hash de la imagen debe coincidir con el del original
```

**Adquisición con dcfldd (recomendado — genera hash automático):**
```bash
dcfldd if=/dev/sdb of=/casos/caso_001/evidencia_001.dd \
  hash=sha256 \
  hashlog=/casos/caso_001/hash_log.txt \
  bs=512 conv=noerror,sync
```

### FASE 4: Documentación Obligatoria

El **Registro de Cadena de Custodia** debe incluir (según Protocolo 2022):
- Número de caso
- Número de registro de cadena de custodia
- Fecha y hora de cada intervención (formato ISO 8601: AAAA-MM-DDTHH:MM:SS)
- Descripción detallada de la evidencia
- Nombre y firma del responsable en cada transferencia
- **Valor HASH de la evidencia digital** (SHA-256 mínimo)
- Condición del embalaje en cada transferencia

---

## Consecuencias de Ruptura de Cadena

| Error | Consecuencia Legal |
|---|---|
| No calcular hash inicial | Impugnable por defensa: no hay prueba de integridad |
| Trabajar sobre el original | Nulidad del peritaje (Art. 181 COPP) |
| Formularios incompletos | La prueba puede ser declarada ilícita |
| Sin bloqueador de escritura | Posible alteración = nulidad |
| Cambio de custodio sin firma | Ruptura de cadena = evidencia comprometida |
