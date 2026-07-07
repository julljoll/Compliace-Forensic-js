# Informe Pericial Forense Digital — Estructura Legal Venezuela

## Base Legal
- Art. 225 COPP: El perito debe presentar su informe por escrito
- Art. 226 COPP: Contenido mínimo del informe pericial
- Manual Único de Cadena de Custodia: Documentación del análisis

---

## ESTRUCTURA DEL INFORME PERICIAL

### CARÁTULA
```
REPÚBLICA BOLIVARIANA DE VENEZUELA
MINISTERIO PÚBLICO / [TRIBUNAL COMPETENTE]

INFORME PERICIAL DE INFORMÁTICA FORENSE
Caso N°: _______________
Expediente N°: _______________
Fecha: _______________

PERITO: [Nombre y Apellido]
Títulos: [Abogado / Licenciado en Informática]
Número de Inpreabogado: _______________
Correo institucional: _______________
```

### 1. IDENTIFICACIÓN
- Número de caso / expediente judicial
- Tribunal o fiscalía solicitante
- Fecha de la solicitud pericial
- Fecha de recepción de la evidencia
- Datos del perito: nombre, títulos, número de colegio

### 2. OBJETO DE LA EXPERTICIA
Descripción precisa de qué se solicita determinar:
> *"Determinar si el dispositivo móvil marca [X], modelo [Y], IMEI [Z], contiene conversaciones de WhatsApp relacionadas con el hecho investigado ocurrido el [fecha]..."*

### 3. EVIDENCIAS RECIBIDAS
Tabla con cada evidencia:
| N° | Descripción | N° Cadena de Custodia | Estado de Embalaje | Hash SHA-256 |
|---|---|---|---|---|
| 001 | Teléfono Samsung Galaxy A52 | CC-2024-001 | Precintado íntegro | [hash] |

### 4. METODOLOGÍA UTILIZADA
- Herramientas utilizadas (nombre + versión)
- Procedimientos aplicados
- Normas técnicas seguidas (ISO 27037, etc.)
- Justificación de cada herramienta

Ejemplo:
> *"Para la adquisición de la imagen forense se utilizó la herramienta dcfldd versión 1.3.4.1,
> generando simultáneamente la imagen y su hash SHA-256, conforme a lo establecido en la
> ISO/IEC 27037:2012 sección 9.3, y en cumplimiento del artículo 187 del COPP."*

### 5. VERIFICACIÓN DE INTEGRIDAD
```
Evidencia N°001 - Disco Duro Seagate 1TB
Hash SHA-256 calculado al RECIBIR: [hash_original]
Hash SHA-256 calculado al DEVOLVER: [hash_final]
Resultado: COINCIDEN / NO COINCIDEN
Conclusión: La evidencia NO fue alterada durante el peritaje
```

### 6. ANÁLISIS Y HALLAZGOS
Descripción técnica objetiva de los hallazgos:
- Presentar capturas de pantalla de la herramienta utilizada
- Incluir metadata de cada hallazgo relevante
- Relacionar hallazgos con el objeto de la experticia
- NO opinar sobre culpabilidad (eso es función del tribunal)

### 7. CONCLUSIONES
Redactar de forma clara, numerada, en lenguaje que pueda entender el juez:

> *"1. El dispositivo móvil analizado contiene [X] conversaciones de WhatsApp con el número
> +58-414-XXXXXXX entre las fechas [inicio] y [fin].*
> *2. Entre dichas conversaciones se encontraron [N] mensajes con contenido relacionado con [...].*
> *3. No se detectaron evidencias de manipulación o eliminación selectiva de mensajes."*

### 8. ANEXOS
- Cadena de custodia completa
- Hashes de todas las evidencias
- Capturas de pantalla numeradas y referenciadas
- Logs de las herramientas utilizadas
- Exportación de conversaciones/correos relevantes

---

## JURAMENTO DEL PERITO (Art. 225 COPP)

> *"Yo, [Nombre], perito designado en la presente causa, declaro bajo juramento que el presente
> informe refleja fielmente los resultados del análisis técnico realizado sobre las evidencias
> recibidas, que he actuado con objetividad e imparcialidad, y que mi dictamen está basado en
> los principios y reglas de mi ciencia conforme al artículo 225 del Código Orgánico Procesal
> Penal."*

Firma: _______________
Fecha: _______________
