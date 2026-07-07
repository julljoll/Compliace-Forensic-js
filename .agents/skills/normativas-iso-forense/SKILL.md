---
name: normativas-iso-forense
description: >
  Especialista en normativas ISO/IEC y estándares internacionales aplicados a la seguridad de la información
  y la forensía digital. Dominio de ISO 27001, ISO 27002, ISO/IEC 27037, ISO/IEC 27042, NIST SP 800-86,
  NIST SP 800-101, RFC 3227, y ACPO Good Practice Guide. Capacidad de auditar, implementar y verificar
  el cumplimiento de estándares internacionales en procesos de peritaje digital.
---

# Especialista en Normativas ISO y Estándares Internacionales de Forensía Digital

## Normativas Disponibles (normativas_rag/)

### ISO/IEC — Seguridad de la Información
| Norma | Archivo RAG | Alcance |
|-------|-------------|---------|
| ISO 27001:2022 | `ISO-27001_2022_NOEDER.md` | Sistema de Gestión de Seguridad de la Información (SGSI) — requisitos |
| ISO 27002:2022 | `ISO 27002_2022 ES.md` | Controles de seguridad de la información — guía de implementación |
| ISO/IEC 27037:2012 | `ISO IEC 27037-2012.md` | Identificación, recolección, adquisición y preservación de evidencia digital |
| ISO/IEC 27042:2015 | `ISO-IEC 27042 2015.md` | Análisis e interpretación de evidencia digital |

### NIST — Instituto Nacional de Estándares y Tecnología (EE.UU.)
| Norma | Archivo RAG | Alcance |
|-------|-------------|---------|
| NIST SP 800-86 | `NIST SP 800-86_ingles.md` | Guía de integración de técnicas forenses en respuesta a incidentes |
| NIST SP 800-101 | `NIST SP 800-101_ingles.md` / `Guidelines on Mobile Device-NIST Special Publication 800-101.md` | Directrices de forensía en dispositivos móviles |

### RFC & Guías Internacionales
| Norma | Archivo RAG | Alcance |
|-------|-------------|---------|
| RFC 3227 (2002) | `RFC 3227 (2002).md` / `RFC 3227 (2002)_2.md` | Directrices para la recolección y archivo de evidencia digital (orden de volatilidad) |
| ACPO Good Practice Guide v5 | `ACPO_Good_Practice_Guide_for_Digital_Evidence_v5.md` | Guía de buenas prácticas para evidencia digital (Reino Unido) |

### Complementarios
| Documento | Archivo RAG |
|-----------|-------------|
| Normalización Economía Digital | `Normalizacion_economia_digital.md` |
| Bibliografía y Leyes Forenses | `borrador para lista de leyes-bibliografias.md` |
| Análisis Forense Android (Avilla) | `analisis forense en android con avilla forensics.md` |

## Competencias por Norma

### ISO/IEC 27037:2012 — Manejo de Evidencia Digital
- **Principios clave**: relevancia, confiabilidad, suficiencia
- **Roles definidos**: DEFR (Digital Evidence First Responder), DES (Digital Evidence Specialist)
- **Proceso**: Identificación → Recolección → Adquisición → Preservación
- **Documentación obligatoria**: cada paso debe registrarse con sello temporal, hash de integridad y responsable
- Aplicación directa en: Acta de Obtención, cadena de custodia digital del CMS

### ISO/IEC 27042:2015 — Análisis de Evidencia Digital
- **Fases**: Examen → Análisis → Interpretación → Reporte
- **Requisitos del informe pericial**: reproducibilidad, trazabilidad, fundamentación técnica
- Aplicación directa en: Acta de Dictamen, informes periciales del CMS

### ISO 27001:2022 — SGSI
- **Controles relevantes**: A.5 (Políticas), A.8 (Gestión de activos), A.12 (Operaciones seguras)
- **Auditoría**: verificación periódica de cumplimiento de controles
- Aplicación directa en: módulo de Auditoría del CMS, hash chain de integridad

### ISO 27002:2022 — Controles de Seguridad
- 93 controles organizados en 4 temas: Organizacionales, Personas, Físicos, Tecnológicos
- Controles prioritarios para forensía: control de acceso, criptografía, gestión de incidentes, continuidad
- Aplicación directa en: checklist normativo de Compliance por etapa

### NIST SP 800-86 — Integración Forense
- **Fases del proceso forense**: Recolección → Examen → Análisis → Reporte
- **Tipos de datos**: datos de red, datos de SO, datos de aplicación, datos de dispositivos móviles
- **Recomendaciones**: hashing pre/post adquisición, documentación fotográfica, aislamiento de red

### NIST SP 800-101 — Forensía Móvil
- **Niveles de adquisición**: manual, lógica, sistema de archivos, física, chip-off, micro-lectura
- **Herramientas**: enfoque en validación cruzada de resultados con múltiples herramientas
- Aplicación directa en: Tutoriales Forenses del CMS, procedimientos de extracción móvil

### RFC 3227 — Recolección de Evidencia
- **Orden de volatilidad**: registros/caché → memoria RAM → disco → logs remotos → backups
- **Principios**: minimizar la contaminación, documentar cada acción, mantener notas detalladas
- **Do's & Don'ts**: nunca ejecutar programas en el sistema sospechoso, clonar antes de analizar

## Reglas de Aplicación

1. **Siempre** referenciar la norma ISO/NIST/RFC específica cuando se implemente un procedimiento forense
2. Los formularios del CMS deben incluir los campos mínimos exigidos por ISO/IEC 27037 (identificador único, sello temporal, hash, responsable)
3. El proceso de auditoría del CMS debe alinearse con los controles de ISO 27001 Anexo A
4. Las etapas forenses del CMS deben mapear directamente a las fases de NIST SP 800-86
5. Los procedimientos de dispositivos móviles deben seguir NIST SP 800-101
6. La recolección de evidencia volátil debe respetar el orden de RFC 3227
