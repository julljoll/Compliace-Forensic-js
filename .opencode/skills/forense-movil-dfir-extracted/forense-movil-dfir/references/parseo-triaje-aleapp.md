# Parseo / Triaje: ALEAPP

ALEAPP (Android Logs Events And Protobuf Parser) toma una imagen o extracción **ya adquirida** (de AVILLA, Andriller, o cualquier extracción lógica/física estándar) y parsea decenas de artefactos Android conocidos (bases de datos SQLite de apps, logs del sistema, protobufs) en tablas legibles, rápido.

## Qué es y qué NO es

- **Es** una herramienta de triaje: te dice en minutos si un dispositivo tiene contenido relevante y dónde mirar primero.
- **No es** un sustituto del análisis forense completo. ALEAPP solo parsea lo que sus módulos conocen; artefactos nuevos, apps poco comunes, o timestamps/estructuras no cubiertas por sus plugins no aparecerán. Si el caso requiere un análisis exhaustivo y defendible, ese triaje debe complementarse con IPED.

Cuando el usuario pida un "informe pericial" basándose solo en salida de ALEAPP, indícaselo explícitamente: es una herramienta de priorización, no de análisis final.

## Flujo típico

1. Confirma qué tipo de entrada tienes: ALEAPP acepta directorio de extracción sin comprimir, `.zip`, `.tar`, o imagen física.
2. Ejecuta (interfaz gráfica o CLI):
   ```bash
   python3 aleapp.py -t <tipo_de_entrada> -i <ruta_entrada> -o <ruta_salida>
   ```
   donde `<tipo_de_entrada>` es `fs` (sistema de archivos), `tar`, `zip`, o `gz` según cómo llegó la extracción.
3. ALEAPP genera un reporte HTML navegable con cada módulo (mensajería, geolocalización, cuentas, historial de llamadas, etc.) y, opcionalmente, salida en formato Excel/TSV/KML para artefactos de ubicación.
4. Revisa primero los módulos de mayor prioridad para el caso (mensajería, ubicación, multimedia) y usa el reporte para decidir si el dispositivo amerita procesamiento completo en IPED.
5. Guarda el reporte de ALEAPP como parte del expediente técnico — documenta versión de ALEAPP usada y fecha de ejecución, porque los módulos de parseo se actualizan seguido y eso puede afectar la reproducibilidad si alguien intenta replicar el resultado más adelante.

## Buenas prácticas

- Corre ALEAPP siempre sobre una **copia** de la extracción, nunca sobre el archivo original hasheado.
- Si un módulo falla o no reconoce una app específica del caso, no asumas que "no hay nada" — repórtalo como limitación de cobertura, no como ausencia de evidencia.
- Para triaje masivo (muchos dispositivos), automatiza la llamada a ALEAPP en un bucle sobre las carpetas de extracción, pero revisa manualmente cada reporte antes de descartar un dispositivo — el triaje prioriza, no decide por sí solo.
