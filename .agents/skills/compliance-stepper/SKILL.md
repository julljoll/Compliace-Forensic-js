---
name: compliance-stepper
description: Genera un Compliance Stepper premium con bloqueo secuencial de pasos, normativa RAG anclada por paso, validadores de campos obligatorios y registro automático de auditoría SHA-256.
---

# Skill: Compliance Stepper Normativo (SHA256.US)

Cuando el usuario pida crear o mejorar un flujo de etapas forenses con pasos, validadores o cumplimiento normativo, aplica este patrón.

## Estructura del Stepper

```tsx
// Cada paso tiene esta forma:
interface ComplianceStep {
  id: string;
  numero: number;
  titulo: string;
  normativa: string;          // Ej: "MUCC-2017 § 4.2", "ISO 27037:2012 § 7.3"
  descripcion: string;
  camposRequeridos: string[]; // Campos que deben estar llenos para completar el paso
  estado: 'pendiente' | 'en_proceso' | 'completado';
}
```

## Reglas de Bloqueo Secuencial

- El paso N+1 solo se habilita cuando el paso N tiene `estado === 'completado'`.
- Para marcar como completado, todos los `camposRequeridos` deben tener valor no vacío.
- Cada transición genera un log de auditoría SHA-256 mediante `useAuditStore`.

## Indicadores Visuales

| Estado | Color | Ícono |
|--------|-------|-------|
| `pendiente` | `#484F58` (gris) | ⬜ |
| `en_proceso` | `#FECF06` (amarillo) | 🟡 |
| `completado` | `#00FF41` (verde) | ✅ |

## Panel de Normativa por Paso

Cada paso muestra un `Alert` con `severity="info"` (color `#FECF06`) indicando la norma aplicable:

```tsx
<Alert severity="info" sx={{ mb: 2, fontSize: '0.75rem' }}>
  <strong>{paso.normativa}</strong> — {paso.descripcion}
</Alert>
```

## Tipos de Proyectos Forenses y Sus Normativas

| Tipo | Pasos | Normativa Principal |
|------|-------|---------------------|
| WhatsApp | 9 pasos | MUCC-2017, ISO 27037, Ley de Mensajes de Datos |
| Email | 7 pasos | MUCC-2017, RFC 3227, ISO 27042 |
| Disco Duro | 8 pasos | MUCC-2017, NIST SP 800-86, ISO 27037 |
