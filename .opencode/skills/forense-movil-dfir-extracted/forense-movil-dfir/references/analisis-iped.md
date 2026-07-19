# Análisis completo: IPED Forensics

IPED (Indexador e Processador de Evidências Digitais) es la herramienta de análisis forense completo del flujo: toma la(s) imagen(es) o extracción(es) ya adquiridas y las procesa en profundidad — indexación full-text, extracción de metadatos, hash sets conocidos (NSRL u otros), detección de artefactos, y búsqueda unificada entre múltiples dispositivos de un mismo caso.

## Cuándo usar IPED frente a ALEAPP

- ALEAPP = triaje rápido de un dispositivo puntual.
- IPED = procesamiento formal, indexado, buscable, multi-dispositivo, pensado para sustentar un informe pericial. Si el usuario va a presentar conclusiones ante un tribunal o fiscalía, el análisis debe pasar por IPED (o equivalente), no quedarse solo en el triaje.

## Flujo típico

1. Crea un nuevo caso en IPED, apuntando a la(s) imagen(es)/extracción(es) ya hasheadas y verificadas.
2. Selecciona los módulos de procesamiento relevantes para el caso (indexación de texto, hash, miniaturas de imágenes, detección de mensajería, geolocalización, análisis de red social si aplica). No actives todos los módulos por defecto sin criterio — cada uno agrega tiempo de procesamiento; selecciona según lo que el caso realmente necesita.
3. Ejecuta el procesamiento:
   ```bash
   java -jar iped.jar -d <ruta_evidencia> -o <ruta_caso_salida>
   ```
   (los flags exactos varían según versión — si el usuario indica una versión específica de IPED, confirma la sintaxis vigente en vez de asumir que es idéntica a versiones anteriores).
4. Una vez terminado, abre el caso en el visor de IPED (IPED Multicase Viewer o el visor estándar) para búsqueda, marcado de ítems relevantes ("bookmarks"), y exportación de la selección para el informe.
5. Exporta el reporte final (HTML/PDF según lo soporte la versión) con los ítems marcados como evidencia relevante, incluyendo su ruta original dentro de la extracción y su hash individual — esto es lo que sostiene la trazabilidad ítem por ítem del hallazgo hasta el archivo original.

## Buenas prácticas específicas de IPED

- Documenta la configuración exacta de módulos usada por caso — si dos peritos procesan la misma evidencia con configuraciones distintas pueden llegar a reportes distintos, y eso debe ser explicable.
- Usa los hash sets (listas de hashes conocidos, buenos o maliciosos) cuando estén disponibles — reduce ruido y acelera la revisión al descartar archivos de sistema conocidos automáticamente.
- Para casos con múltiples dispositivos, aprovecha el análisis multicaso de IPED para cruzar comunicaciones/contactos entre dispositivos en vez de analizar cada uno de forma aislada y cruzar manualmente después.
