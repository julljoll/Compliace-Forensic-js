# Plantilla: Informe técnico y cadena de custodia

Usa esta estructura cada vez que el usuario pida un "informe", "cadena de custodia" o "documentación" derivada de un procedimiento de adquisición/parseo/análisis. Mantener la misma estructura entre casos es lo que hace comparables los expedientes.

```markdown
# Informe Técnico de Adquisición y Análisis Forense

## 1. Identificación del caso
- N.º de caso / referencia interna:
- Perito(s) responsable(s):
- Fecha y hora de inicio / fin del procedimiento:
- Lugar (laboratorio / sitio):

## 2. Descripción del dispositivo/medio
- Tipo de dispositivo, marca, modelo:
- IMEI / número de serie:
- Estado al recibirlo (encendido/apagado, bloqueado/desbloqueado, daños visibles):

## 3. Adquisición
- Herramienta usada (AVILLA / Andriller / PALADIN):
- Versión de la herramienta:
- Tipo de extracción (lógica / sistema de archivos / física / imagen de disco):
- Método de bypass usado, si aplica (documentar explícitamente):
- Hash del resultado (algoritmo + valor):
- Hash de verificación posterior (si se recalculó en otro momento):

## 4. Parseo / Triaje (si aplica)
- Herramienta: ALEAPP
- Versión y fecha de ejecución:
- Módulos ejecutados / cobertura:
- Limitaciones de cobertura identificadas:

## 5. Análisis
- Herramienta: IPED
- Versión y configuración de módulos usada:
- Ítems marcados como relevantes (lista con ruta original + hash individual):
- Metodología de búsqueda/filtrado aplicada:

## 6. Cadena de custodia
- Registro cronológico de quién tuvo acceso al original y a las copias de trabajo, con fecha/hora de cada transferencia.
- Ubicación de almacenamiento del original en todo momento.

## 7. Hallazgos y limitaciones
- Resumen de hallazgos relevantes al caso.
- Limitaciones técnicas explícitas (cobertura de parsers, artefactos no soportados, etc.) — no presentar el análisis como exhaustivo si no lo fue.

## 8. Anexos
- Reportes completos de cada herramienta (ALEAPP HTML, IPED export, log de Andriller/AVILLA).
```

## Por qué esta estructura y no otra

Cada sección corresponde a una fase del pipeline (adquisición → parseo → análisis) para que quien lea el informe pueda rastrear cualquier hallazgo hasta el comando y el hash que lo originó. La sección de "limitaciones" es intencional: un informe que no reconoce las limitaciones de cobertura de sus propias herramientas es más fácil de impugnar que uno que las declara.
