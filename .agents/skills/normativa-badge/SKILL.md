---
name: normativa-badge
description: Inserta automáticamente chips/badges de normativa aplicable (MUCC-2017, ISO 27037, COPP, Ley Mensajes de Datos) en formularios, secciones de planillas o flujos forenses del CMS SHA256.US.
---

# Skill: Normativa Badge — Referencia Legal Automática

Cuando el usuario pida agregar referencia normativa, base legal, justificación jurídica o anclaje a normativas_rag, aplica este patrón.

## Normativas Disponibles (normativas_rag/)

| Clave | Etiqueta | Color | Descripción |
|-------|----------|-------|-------------|
| `mucc` | MUCC-2017 | `#FECF06` | Manual Único de Cadena de Custodia de Evidencias |
| `iso27037` | ISO 27037 | `#00FF41` | Identificación, recolección y preservación de evidencia digital |
| `iso27042` | ISO 27042 | `#9DFF00` | Análisis e interpretación de evidencia digital |
| `nist86` | NIST SP 800-86 | `#00FF41` | Integración de técnicas forenses en respuesta a incidentes |
| `copp` | COPP | `#FECF06` | Código Orgánico Procesal Penal venezolano |
| `leymd` | Ley Mensajes Datos | `#FECF06` | Ley sobre Mensajes de Datos y Firmas Electrónicas VE |
| `rfc3227` | RFC 3227 | `#9DFF00` | Guía para la recolección y archivado de evidencia |
| `iso27001` | ISO 27001 | `#00FF41` | Sistema de Gestión de Seguridad de la Información |

## Patrón de Implementación (MUI Chip)

```tsx
// NormativaBadge.tsx
const NORMATIVAS = {
  mucc:     { label: 'MUCC-2017',         color: '#FECF06' },
  iso27037: { label: 'ISO 27037',          color: '#00FF41' },
  iso27042: { label: 'ISO 27042',          color: '#9DFF00' },
  copp:     { label: 'COPP Art. 223-225', color: '#FECF06' },
  leymd:    { label: 'Ley Mensajes Datos', color: '#FECF06' },
  nist86:   { label: 'NIST SP 800-86',    color: '#00FF41' },
};

<Stack direction="row" spacing={0.5} flexWrap="wrap">
  {normativas.map(key => (
    <Chip
      key={key}
      label={NORMATIVAS[key].label}
      size="small"
      sx={{
        fontSize: '0.65rem',
        height: '18px',
        backgroundColor: `${NORMATIVAS[key].color}15`,
        color: NORMATIVAS[key].color,
        border: `1px solid ${NORMATIVAS[key].color}30`,
        fontWeight: 700,
        fontFamily: 'monospace',
      }}
    />
  ))}
</Stack>
```

## Uso en Planillas PDF (React-PDF)

En documentos React-PDF, los badges se traducen como:

```tsx
<Text style={{ fontSize: 6.5, color: '#FECF06', fontFamily: 'Helvetica-Bold' }}>
  ▸ MUCC-2017 § 4 | ISO 27037:2012 § 7 | COPP Art. 223
</Text>
```
