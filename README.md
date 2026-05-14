# ⚖️ SHA256.US — CMS Forense para Compliance Officer

> **Plataforma de gestión de cumplimiento normativo para el proceso técnico-forense en dispositivos móviles Android.**  
> Desarrollada bajo estricto apego al Manual Único de Cadena de Custodia (Venezuela, 2017), ISO/IEC 27037, NIST SP 800-101 y estándares internacionales.

---

## 📋 Descripción del Proyecto

SHA256.US es un **Content Management System (CMS)** diseñado para el rol de **Compliance Officer** en laboratorios de informática forense. Permite:

- 📊 **Supervisar** el ciclo completo del proceso forense (desde la obtención hasta la disposición final)
- ✅ **Controlar** el cumplimiento normativo caso por caso con métricas en tiempo real
- 🔍 **Auditar** cada acción del proceso con trazabilidad inmutable
- 📱 **Integrar** metodologías de herramientas como **Avilla Forensics**, **Andriller** y **ALEAPP**
- 📚 **Referenciar** el marco normativo completo (9 instrumentos legales precargados)

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Frontend** | React + TypeScript | 18.2.0 / 5.3.3 |
| **Bundler** | Vite | 5.0.8 |
| **Estilos** | TailwindCSS (Dark Theme) | 3.4.0 |
| **Estado** | Zustand (con persistencia localStorage) | 4.4.7 |
| **Iconos** | Lucide React | — |
| **Desktop** | Electron + Electron Builder | 28.0.0 |
| **Forense** | Andriller / ALEAPP / Avilla Forensics | — |

---

## 📁 Estructura del Proyecto

```
SHA256.US/
├── RAG/                               # 📖 Base de conocimiento (INTACTA)
│   ├── manual_unico_unificado.yaml    # YAML maestro + Fluent Design
│   ├── arquitectura_cadena_custodia.yaml
│   ├── proceso-desarrollo-forense.yaml
│   ├── Formato_Planilla_PRCC.yaml
│   ├── Formato_acta_consignacion.yaml
│   ├── Skill_electron.yaml
│   ├── skill_claude.json
│   └── *.pdf                          # 16 documentos normativos fuente
│
├── componente/                         # Componentes YAML modulares (7)
│   ├── fase_inicial/
│   ├── fase_laboratorio/
│   ├── fase_disposicion_judicial/
│   ├── fase_disposicion_final/
│   ├── resguardo/
│   ├── herramientas/
│   └── traslado/
│
├── src/                                # 🖥️ Código React (CMS + Forense)
│   ├── components/
│   │   ├── CMSLayout.tsx               # ⭐ Layout principal CMS
│   │   ├── Layout.tsx                  # Layout original (Fluent)
│   │   ├── Laboratorio/
│   │   ├── MarcoLegal/
│   │   ├── Obtencion/
│   │   ├── Prcc/
│   │   ├── DisposicionJudicial/
│   │   └── DisposicionFinal/
│   │
│   ├── pages/
│   │   ├── DashboardPage.tsx           # ⭐ Panel de mando Compliance
│   │   ├── CasosPage.tsx              # ⭐ Gestión de casos
│   │   ├── CompliancePage.tsx         # ⭐ Control de cumplimiento
│   │   ├── NormativasPage.tsx         # ⭐ Marco normativo
│   │   ├── AuditoriaPage.tsx          # ⭐ Log de auditoría
│   │   ├── ManualAvillaPage.tsx       # ⭐ Manual Avilla Forensics
│   │   ├── HomePage.tsx               # Dashboard forense original
│   │   ├── ConsignacionPage.tsx
│   │   ├── PrccPage.tsx
│   │   ├── AdquisicionPage.tsx
│   │   ├── AnalisisPage.tsx
│   │   ├── InformePage.tsx
│   │   ├── DisposicionJudicialPage.tsx
│   │   └── DisposicionFinalPage.tsx
│   │
│   ├── store/
│   │   ├── cmsStore.ts                # ⭐ Estado CMS (Zustand + persist)
│   │   └── forenseStore.ts            # Estado forense original
│   │
│   ├── index.css                      # Diseño (Fluent + CMS tokens)
│   ├── App.tsx                        # Router principal
│   └── main.tsx                       # Entry point
│
├── electron/                           # Proceso Electron
│   ├── main.js
│   └── preload.js
│
├── skill_avilla.md                    # 🔬 Skill Avilla Forensics
├── map_arquitectura.md                # 🗺️ Mapa de arquitectura
├── tailwind.config.js                 # Tokens CMS + Fluent
├── package.json
└── README.md                          # 📄 Este archivo
```

---

## 🖥️ Módulos del CMS Compliance

### Interfaz Principal (`/`)

| Ruta | Página | Función |
|------|--------|---------|
| `/` | **Dashboard** | KPIs: casos activos, % cumplimiento, tareas pendientes, logs recientes |
| `/casos` | **Gestión de Casos** | CRUD completo con filtros por estado, prioridad y búsqueda |
| `/compliance` | **Panel de Compliance** | Distribución visual conforme/parcial/no-conforme + cobertura por normativa |
| `/normativas` | **Marco Normativo** | 9 instrumentos legales agrupados por tipo (ISO, NIST, LEY, MANUAL) |
| `/auditoria` | **Auditoría** | Log cronológico de todas las acciones del sistema |
| `/manual-avilla` | **Manual Avilla** | Guía operativa de extracción Android, WhatsApp y validación de integridad |
| `/tareas` | **Tareas & Fases** | Gestión de tareas por caso *(en desarrollo)* |
| `/personal` | **Personal** | Registro de peritos y roles *(en desarrollo)* |

### Módulos Forenses Originales (`/forense/...`)

| Ruta | Función |
|------|---------|
| `/forense` | Dashboard forense Android |
| `/forense/consignacion` | Registro de evidencia por entrega voluntaria |
| `/forense/prcc` | Planilla de Registro de Cadena de Custodia |
| `/forense/adquisicion` | Extracción forense con Andriller |
| `/forense/analisis` | Procesamiento con ALEAPP |
| `/forense/informe` | Generación de Dictamen Pericial |
| `/forense/disposicion-judicial` | Resguardo judicial y exhibición |
| `/forense/disposicion-final` | Devolución / destrucción / cierre |

---

## 📊 Sistema de Compliance

### Entidades del CMS

| Entidad | Descripción |
|---------|-------------|
| **CasoCMS** | Caso forense con número, prioridad, estado, normativas aplicadas, progreso |
| **Evidencia** | Dispositivo o artefacto con hash, sellado, etiquetado, cadena de custodia |
| **TareaForense** | Actividad asignada con fecha límite, normativas relacionadas |
| **FaseForense** | Etapa del proceso con checklist de cumplimiento |
| **Normativa** | Instrumento legal con código, tipo, versión y vigencia |
| **ChecklistItem** | Requisito verificable con nivel de cumplimiento |
| **Personal** | Perito, fiscal o compliance officer con rol asignado |
| **AuditLog** | Registro inmutable de acciones con timestamp y nivel |

### Niveles de Cumplimiento

| Nivel | Significado | Indicador |
|-------|-------------|-----------|
| 🟢 **Conforme** | Todos los requisitos cumplidos | CheckCircle |
| 🟡 **Parcial** | Requisitos parcialmente cumplidos | AlertTriangle |
| 🔴 **No Conforme** | Incumplimiento detectado | AlertTriangle |
| ⚪ **No Aplica** | Normativa no evaluada aún | Clock |

### Normativas Precargadas (RAG)

| Código | Tipo | Nombre |
|--------|------|--------|
| ISO/IEC 27037:2012 | ISO | Identificación, recopilación, adquisición y preservación de evidencia digital |
| ISO/IEC 27042:2015 | ISO | Análisis e interpretación de evidencia digital |
| NIST SP 800-101 r1 | NIST | Guidelines on Mobile Device Forensics |
| MUCC-2017 | MANUAL | Manual Único de Cadena de Custodia de Evidencias |
| ACPO-v5 | MANUAL | ACPO Good Practice Guide for Digital Evidence v5 |
| LEDI-2001 | LEY | Ley Especial de Delitos Informáticos |
| LMDF-1999 | LEY | Ley sobre Mensajes de Datos y Firmas Electrónicas |
| COPP | LEY | Código Orgánico Procesal Penal |
| CENIF-2012 | REGLAMENTO | Creación del Centro Nacional de Informática Forense |

---

## 🔬 Integración con Avilla Forensics

El CMS integra documentación operativa de [Avilla Forensics](https://github.com/AvillaDaniel/AvillaForensics) para:

- **APK Downgrade**: Extracción de datos de apps sin Root (>400 apps soportadas)
- **WhatsApp Parser**: Parseo de chats con schema nuevo y antiguo de `msgstore.db`
- **Transcripción .opus**: Conversión masiva de audios de WhatsApp a texto
- **Image Finder**: Recuperación de imágenes con metadata EXIF y geolocalización KML
- **Validación de Integridad**: Sistema de hashes SHA-256 + logs cifrados AES-256 (.avilla) + firma HMAC

📖 Ver guía completa: [`skill_avilla.md`](skill_avilla.md)

---

## 🛠️ Instalación y Desarrollo

### Requisitos
- Node.js >= 18.x
- npm >= 9.x
- Python >= 3.11 (para herramientas forenses)

### Comandos

```bash
# Instalación
npm install

# Desarrollo (Vite dev server)
npm run dev

# Desarrollo con Electron
npm run electron:dev

# Build Web
npm run build

# Build Electron Windows
npm run electron:build
```

---

## 🎨 Sistema de Diseño

El proyecto utiliza dos sistemas de diseño complementarios:

### CMS Compliance (Principal)
| Token | Valor |
|-------|-------|
| Background | `#0f1117` |
| Sidebar | `#141721` |
| Card | `#1a1f2e` |
| Accent | `#4f8ef7` |
| Accent 2 | `#7c4dff` |
| Border Radius | `16px` (cards), `12px` (buttons) |

### Fluent UI (Forense Original)
| Token | Valor |
|-------|-------|
| Background | `#202020` (Mica) |
| Accent | `#0078D4` |
| Motion | `167ms` cubic-bezier |

---

## 📊 Marco Legal Aplicado

| Ley | Año | Aplicación |
|-----|-----|------------|
| Constitución Nacional | 1999 | Debido proceso (Art. 49) |
| Código Orgánico Procesal Penal | 2012 | Cadena de custodia (Art. 187-188) |
| Ley Especial Delitos Informáticos | 2001 | Tipificación de delitos |
| Ley de Infogobierno | 2013 | Validez tecnológica |
| Ley Mensajes de Datos | 2001 | Eficacia probatoria |

### Estándares Internacionales
- **ISO/IEC 27037:2012** - Identificación y preservación
- **ISO/IEC 27042:2015** - Análisis e interpretación
- **NIST SP 800-101 r1** - Forense móvil
- **ACPO v5** - Buenas prácticas

---

## 🔐 Seguridad

- ✅ Context Isolation + Preload script seguro (Electron)
- ✅ IPC validado entre frontend y backend
- ✅ Persistencia local (localStorage) con versionado de store
- ✅ Cálculo de hashes SHA-256 / MD5 para integridad
- ✅ Registro de auditoría automático (hasta 500 eventos)

---

## 📄 Documentación

| Archivo | Descripción |
|---------|-------------|
| `README.md` | Este archivo — visión general del proyecto |
| `skill_avilla.md` | Referencia técnica de Avilla Forensics para desarrollo |
| `map_arquitectura.md` | Mapa completo de arquitectura del sistema |
| `RAG/manual_unico_unificado.yaml` | YAML maestro unificado + Fluent Design |
| `componente/*/` | 7 componentes YAML modulares por fase forense |

---

## 🎯 Próximos Pasos

- [ ] Módulo **Tareas & Fases**: Gestión de actividades por caso con checklist normativo
- [ ] Módulo **Personal**: Registro de peritos, fiscales y roles con asignación a casos
- [ ] **Backend PostgreSQL**: Persistencia en base de datos relacional
- [ ] **Autenticación por Rol**: Login con perfiles Compliance Officer / Perito / Fiscal
- [ ] **Firma Digital**: Integrar firma electrónica para PRCC
- [ ] **Generación PDF**: Dictámenes y reportes oficiales automatizados
- [ ] **QR Codes**: Seguimiento de evidencias físicas
- [ ] **PWA Offline**: Modo sin conexión para trabajo de campo

---

## 📓 Licencia

MIT

---

## 👥 Autor

Laboratorio de Informática Forense y Ciberseguridad

---

*Última actualización: 14/May/2026 — Conversión a CMS Compliance Officer + Manual Avilla Forensics*  
*Versión: 2.0.0*  
*Basado en: Manual Único de Cadena de Custodia (Venezuela, 2017) · ISO/IEC 27037 · NIST SP 800-101*
