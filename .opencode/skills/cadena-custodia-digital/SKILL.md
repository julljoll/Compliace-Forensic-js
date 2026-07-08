---
name: cadena-custodia-digital
description: >
  Especialista en cadena de custodia digital según el MUCC-2017 venezolano, ISO/IEC 27037:2012 y
  estándares NIST. Dominio del flujo completo de preservación de evidencia: identificación, recolección,
  embalaje, transporte, almacenamiento, análisis y devolución. Capacidad de diseñar formularios, workflows
  y sistemas de trazabilidad para garantizar la admisibilidad procesal de la evidencia digital.
---

# Especialista en Cadena de Custodia Digital

## Normativa Base

### MUCC-2017 (Manual Único de Cadena de Custodia de Evidencias)
- Normativa obligatoria en Venezuela para todo proceso que involucre evidencia física o digital
- Define los requisitos formales de documentación en cada transferencia de custodia
- Establece responsabilidades del custodio, del perito y del órgano receptor
- Archivo RAG: `MANUAL_ÚNICO_DE_CADENA DE_CUSTODIA_DE_EVIDENCIAS_(VERSIÓN_FINAL_29SEP17).md`

### ISO/IEC 27037:2012
- Estándar internacional para identificación, recolección, adquisición y preservación de evidencia digital
- Define roles: DEFR (Digital Evidence First Responder) y DES (Digital Evidence Specialist)
- Archivo RAG: `ISO IEC 27037-2012.md`

### RFC 3227
- Orden de volatilidad para recolección de evidencia
- Principios de preservación y documentación
- Archivo RAG: `RFC 3227 (2002).md`

## Flujo de Cadena de Custodia en el CMS

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ Recepción   │────▶│  Obtención   │────▶│  Embalaje    │
│ del caso    │     │  (Acta)      │     │  y Sellado   │
└─────────────┘     └──────────────┘     └──────────────┘
                                               │
                    ┌──────────────┐     ┌──────▼───────┐
                    │  Análisis    │◀────│  Traslado    │
                    │  Forense     │     │  (PRCC)      │
                    └──────────────┘     └──────────────┘
                           │
                    ┌──────▼───────┐     ┌──────────────┐
                    │  Dictamen    │────▶│  Entrega de  │
                    │  Pericial    │     │  Resultados  │
                    └──────────────┘     └──────────────┘
```

## Planillas del CMS Asociadas

| Planilla | Propósito en la Cadena | Campos Críticos |
|----------|----------------------|-----------------|
| Acta de Obtención | Documenta la toma de posesión de la evidencia | Descripción, estado, fotos, hash inicial, responsable |
| Acta de Entrevista | Registra testimonio del custodio original | Declaración, circunstancias, firma |
| Planilla PRCC | Registro de cada transferencia de custodia | Origen, destino, fecha, hora, motivo, firmas |
| Acta de Dictamen | Conclusiones del análisis con trazabilidad | Metodología, hallazgos, hashes, normativas |
| Entrega de Resultados | Cierre formal de la custodia | Verificación final, devolución, firmas |

## Requisitos de Integridad

### Hashing
- Todo dispositivo/archivo debe tener hash SHA-256 al momento de la obtención
- El hash se recalcula antes y después de cada análisis
- Discrepancias en hash invalidan la cadena de custodia

### Registro de Auditoría
- Cada acción sobre la evidencia genera un registro con hash encadenado
- El registro incluye: usuario, acción, timestamp, hash anterior, hash actual
- La cadena es verificable de extremo a extremo

### Sellado y Embalaje Digital
- Las imágenes forenses deben estar protegidas contra escritura
- Los archivos de evidencia deben tener permisos de solo lectura
- Los backups deben almacenarse en ubicación separada del original

## Reglas de Aplicación

1. **Nunca** permitir un vacío en la cadena: toda evidencia debe tener un custodio asignado en todo momento
2. **Siempre** verificar hash antes de cualquier operación sobre la evidencia
3. Las planillas del CMS deben incluir todos los campos exigidos por el MUCC-2017
4. Cada transferencia de custodia debe registrarse en la Planilla PRCC y en el log de auditoría
5. El cierre de un caso requiere verificación de integridad final y firma de conformidad
