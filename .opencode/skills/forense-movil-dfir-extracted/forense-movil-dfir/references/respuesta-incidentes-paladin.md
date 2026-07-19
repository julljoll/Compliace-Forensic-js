# Respuesta a incidentes: Samurai Linux / PALADIN

Estas son distribuciones Linux forenses **live/bootables**, pensadas para actuar directamente sobre equipos o medios en sitio (una escena, un allanamiento, un servidor comprometido) sin alterar la evidencia, más que para el análisis posterior de laboratorio.

## Diferencia clave frente a AVILLA/Andriller/IPED

AVILLA, Andriller e IPED normalmente se usan sobre el dispositivo ya trasladado al laboratorio, con tiempo y control del entorno. PALADIN/Samurai Linux se usa cuando hay que **actuar en el lugar de los hechos**, típicamente sobre computadoras, discos o medios de almacenamiento (no smartphones directamente — para celulares en sitio, la adquisición sigue siendo AVILLA/Andriller, pero PALADIN puede ser la base del equipo portátil desde el que se opera).

## PALADIN (basado en Debian, orientado a triage/imaging forense)

**Flujo típico en sitio:**
1. Bootear el equipo/medio sospechoso desde el USB/DVD de PALADIN (asegurando en el BIOS/UEFI que el boot no monta en escritura los discos internos).
2. Verificar en el menú de PALADIN que los discos objetivo están montados en **modo solo lectura** — esto es la garantía de no alterar la evidencia, es el paso más importante de todo el procedimiento y nunca debe omitirse ni asumirse.
3. Usar el módulo de imaging de PALADIN para generar una imagen forense (formato E01 o DD/raw) del disco o medio, calculando el hash (MD5/SHA-256) durante o inmediatamente después de la creación de la imagen.
4. Guardar la imagen en un medio de destino distinto al original (disco externo dedicado a evidencia, nunca la misma máquina).
5. Documentar en el momento: hora de inicio/fin de la adquisición, hash resultante, número de serie del disco/equipo, y quién estuvo presente — esto es lo que se pierde con más facilidad si se deja para después.

## Samurai Linux (orientado más ampliamente a seguridad ofensiva/forense de red)

Si el escenario es un incidente de seguridad (no solo un dispositivo aislado, sino una red o sistema comprometido), Samurai Linux aporta herramientas de análisis de red y de intrusión además de las capacidades forenses. Úsalo cuando el usuario describa un incidente activo (servidor comprometido, necesidad de análisis de tráfico) más que una simple adquisición de disco.

## Buenas prácticas de campo

- Nunca conectes un disco/medio sospechoso a un puerto sin verificar el modo solo-lectura primero — en ausencia de un write-blocker físico, esta verificación por software es la única barrera contra alterar la evidencia.
- Prioriza la volatilidad: si hay RAM que capturar (equipo encendido), documenta esa decisión y su justificación antes de proceder — apagar un equipo encendido destruye evidencia volátil, pero intervenir un equipo encendido también conlleva riesgos; ninguna de las dos opciones es automática, requiere criterio del perito y debe quedar justificada.
- Lleva siempre un formulario de cadena de custodia en físico o digital editable en el momento — no dependas de reconstruir los tiempos y datos de memoria después de salir del sitio.
